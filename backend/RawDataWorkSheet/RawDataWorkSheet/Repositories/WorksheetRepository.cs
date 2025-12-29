using Dapper;
using Microsoft.Data.SqlClient;
using RawDataWorkSheet.Models;
using RawDataWorkSheet.Models.DTOs;
using RawDataWorkSheet.Models.Requests;
using System.Data;

namespace RawDataWorkSheet.Repositories
{
    public class WorksheetRepository : IWorksheetRepository
    {
        private readonly string _connectionString;

        public WorksheetRepository(IConfiguration configuration)
        {
            _connectionString = configuration["Connnectionstrings:Connection2"];
        }

        private IDbConnection CreateConnection()
        {
            return new SqlConnection(_connectionString);
        }

        public async Task<bool> ExistsWorksheetAsync(string worksheetId)
        {
            const string sql = """
                SELECT 1
                FROM raw_data_worksheets
                WHERE worksheet_id = @WorksheetId
            """;

            using var conn = CreateConnection();
            return await conn.ExecuteScalarAsync<int?>(sql, new { WorksheetId = worksheetId }) != null;
        }

        public async Task<bool> ExistsParameterAsync(int parameterId)
        {
            const string sql = """
                SELECT 1
                FROM worksheet_parameters
                WHERE id = @ParameterId
            """;

            using var conn = CreateConnection();
            return await conn.ExecuteScalarAsync<int?>(sql, new { ParameterId = parameterId }) != null;
        }

        public async Task CreateWorksheetAsync(SaveWorksheetRequest request)
        {
            const string sql = """
                INSERT INTO raw_data_worksheets (
                    worksheet_id,
                    registration_no,
                    sample_name,
                    number_of_parameters,
                    due_date,
                    status,
                    prepared_by,
                    created_at
                )
                VALUES (
                    @WorksheetId,
                    @RegistrationNo,
                    @SampleName,
                    @NumberOfParameters,
                    @DueDate,
                    'Draft',
                    @PreparedBy,
                    SYSDATETIME()
                )
            """;

            using var conn = CreateConnection();
            await conn.ExecuteAsync(sql, new
            {
                request.WorksheetId,
                request.RegistrationInfo!.RegistrationNo,
                request.RegistrationInfo.SampleName,
                request.RegistrationInfo.NumberOfParameters,
                request.DocumentInfo!.PreparedBy,
                DueDate = ParseDate(request.RegistrationInfo!.DueDate)
            });
        }

        public async Task UpdateWorksheetAsync(SaveWorksheetRequest request)
        {
            using var connection = CreateConnection();
            connection.Open();
            using var transaction = connection.BeginTransaction();

            try
            {
                var updateSql = @"
                    UPDATE raw_data_worksheets 
                    SET
                        updated_at = SYSDATETIME(),
                        status = @Status
                    WHERE worksheet_id = @WorksheetId";

                await connection.ExecuteAsync(
                    updateSql,
                    new
                    {
                        request.WorksheetId,
                        request.DocumentInfo?.Status
                    },
                    transaction);

                // Get existing parameter IDs with their para_codes
                var existingParams = await connection.QueryAsync<(int Id, string ParaCode)>(
                    "SELECT id, para_code FROM worksheet_parameters WHERE worksheet_id = @WorksheetId",
                    new { WorksheetId = request.WorksheetId },
                    transaction);

                var existingParamDict = existingParams.ToDictionary(p => p.ParaCode, p => p.Id);
                var requestParamCodes = request.Parameters.Select(p => p.ParaCode).ToHashSet();

                // Delete parameters that are no longer in the request
                var paramsToDelete = existingParamDict.Keys.Except(requestParamCodes).ToList();
                if (paramsToDelete.Any())
                {
                    var idsToDelete = paramsToDelete.Select(code => existingParamDict[code]).ToList();
                    await connection.ExecuteAsync(
                        "DELETE FROM worksheet_parameters WHERE id IN @Ids",
                        new { Ids = idsToDelete },
                        transaction);
                }

                // Update or insert parameters
                foreach (var param in request.Parameters)
                {
                    int parameterId;
                    if (existingParamDict.TryGetValue(param.ParaCode, out var existingId))
                    {
                        // Update existing parameter
                        parameterId = existingId;
                        await UpdateParameter(connection, transaction, parameterId, request.WorksheetId, param);
                    }
                    else
                    {
                        // Insert new parameter
                        parameterId = await InsertParameter(connection, transaction, request.WorksheetId, param);
                    }

                    // Update associated data with proper upsert logic
                    await UpsertInstruments(connection, transaction, parameterId, param.Instruments);
                    await UpsertChemicals(connection, transaction, parameterId, param.Chemicals);
                    await UpsertStandards(connection, transaction, parameterId, param.Standards);
                    await UpsertStandardPreparations(connection, transaction, parameterId, param.StandardPreparations);
                    await UpsertSamplePreparations(connection, transaction, parameterId, param.SamplePreparations);
                    await UpsertCalculations(connection, transaction, parameterId, param.Calculations);
                }

                transaction.Commit();
            }
            catch
            {
                transaction.Rollback();
                throw;
            }
        }

        public async Task UpdateParameterAsync(int parameterId, ParameterDto request)
        {
            using var connection = CreateConnection();
            connection.Open();
            using var transaction = connection.BeginTransaction();

            try
            {
                var worksheetId = await connection.QuerySingleOrDefaultAsync<string>(
                    "SELECT worksheet_id FROM worksheet_parameters WHERE id = @ParameterId",
                    new { ParameterId = parameterId },
                    transaction
                );

                if (worksheetId == null)
                {
                    throw new InvalidOperationException($"Parameter with id {parameterId} not found");
                }

                // Update the parameter
                await UpdateParameter(connection, transaction, parameterId, worksheetId, request);

                // Update associated data with proper upsert logic
                await UpsertInstruments(connection, transaction, parameterId, request.Instruments);
                await UpsertChemicals(connection, transaction, parameterId, request.Chemicals);
                await UpsertStandards(connection, transaction, parameterId, request.Standards);
                await UpsertStandardPreparations(connection, transaction, parameterId, request.StandardPreparations);
                await UpsertSamplePreparations(connection, transaction, parameterId, request.SamplePreparations);
                await UpsertCalculations(connection, transaction, parameterId, request.Calculations);

                transaction.Commit();
            }
            catch
            {
                transaction.Rollback();
                throw;
            }
        }

        public async Task DeleteParameterAsync(int parameterId)
        {
            using var connection = CreateConnection();
            connection.Open();
            using var transaction = connection.BeginTransaction();

            try
            {
                // Child tables (delete first)
                await connection.ExecuteAsync(
                    "DELETE FROM worksheet_instruments WHERE parameter_id = @ParameterId",
                    new { ParameterId = parameterId },
                    transaction);

                await connection.ExecuteAsync(
                    "DELETE FROM worksheet_chemicals WHERE parameter_id = @ParameterId",
                    new { ParameterId = parameterId },
                    transaction);

                await connection.ExecuteAsync(
                    "DELETE FROM worksheet_standards WHERE parameter_id = @ParameterId",
                    new { ParameterId = parameterId },
                    transaction);

                await connection.ExecuteAsync(
                    "DELETE FROM worksheet_standard_preparations WHERE parameter_id = @ParameterId",
                    new { ParameterId = parameterId },
                    transaction);

                await connection.ExecuteAsync(
                    "DELETE FROM worksheet_sample_preparations WHERE parameter_id = @ParameterId",
                    new { ParameterId = parameterId },
                    transaction);

                await connection.ExecuteAsync(
                    "DELETE FROM worksheet_calculations WHERE parameter_id = @ParameterId",
                    new { ParameterId = parameterId },
                    transaction);

                // Finally delete the parameter itself
                var rowsAffected = await connection.ExecuteAsync(
                    "DELETE FROM worksheet_parameters WHERE id = @ParameterId",
                    new { ParameterId = parameterId },
                    transaction);

                if (rowsAffected == 0)
                {
                    throw new InvalidOperationException($"Parameter with id {parameterId} not found.");
                }

                transaction.Commit();
            }
            catch
            {
                transaction.Rollback();
                throw;
            }
        }


        public async Task DeleteWorksheetAsync(string worksheetId)
        {
            using var connection = CreateConnection();

            var sql = "DELETE FROM raw_data_worksheets WHERE worksheet_id = @WorksheetId";
            await connection.ExecuteAsync(sql, new { WorksheetId = worksheetId });
        }

        public async Task<WorksheetDetailDto> GetWorksheetByIdAsync(string worksheetId, FetchWorksheetsRequest request)
        {
            using var connection = CreateConnection();

            var worksheetSql = @"
                SELECT
                    worksheet_id      AS WorksheetId,
                    registration_no   AS RegistrationNo,
                    sample_name       AS SampleName,
                    number_of_parameters AS NumberOfParameters,
                    due_date           AS DueDate,
                    prepared_by        AS PreparedBy,
                    revision_date      AS RevisionDate,
                    status             AS Status,
                    submitted_at       AS SubmittedAt,
                    created_at         AS CreatedAt,
                    updated_at         AS UpdatedAt
                FROM raw_data_worksheets
                WHERE worksheet_id = @WorksheetId";

            var worksheet = await connection.QueryFirstOrDefaultAsync<RawDataWorksheet>(
                worksheetSql,
                new { WorksheetId = worksheetId });

            if (worksheet == null)
                return null;

            return await LoadWorksheetDetails(connection, worksheet, request);
        }

        public async Task<List<WorksheetSummaryDto>> GetAllWorksheetsAsync(FetchWorksheetsRequest request)
        {
            using var connection = CreateConnection();

            string sql;

            if (request.Role == "HOD LAB")
            {
                sql = @"
                    SELECT 
                        worksheet_id as WorksheetId,
                        registration_no as RegistrationNo,
                        sample_name as SampleName,
                        number_of_parameters as NumberOfParameters,
                        status as Status,
                        created_at as CreatedAt
                    FROM raw_data_worksheets
                    WHERE (prepared_by = @EmployeeId)
                    ORDER BY created_at DESC";
            }
            else
            {
                sql = @"
                    SELECT 
	                    w.worksheet_id as WorksheetId,
	                    p.id as ParameterId,
	                    p.parameter_name as ParameterName,
	                    w.registration_no as RegistrationNo,
	                    w.sample_name as SampleName,
	                    w.number_of_parameters as NumberOfParameters,
	                    w.status as Status,
	                    w.created_at as CreatedAt
                    FROM raw_data_worksheets w
                    JOIN worksheet_parameters p
	                    on w.worksheet_id = p.worksheet_id
                    where p.analyzed_by = @EmployeeId and w.Status != 'Draft'
                    ORDER BY created_at DESC";
            }

            var worksheets = await connection.QueryAsync<WorksheetSummaryDto>(
                sql,
                new { request.EmployeeId }
            );

            return worksheets.ToList();
        }

        private async Task<int> InsertParameter(
            IDbConnection connection,
            IDbTransaction transaction,
            string worksheetId,
            ParameterDto param)
        {
            var sql = @"
                INSERT INTO worksheet_parameters 
                (worksheet_id, para_code, parameter_name, method_code, method_name, 
                 column_id, diluent_preparation, other_info, 
                 analyzed_by, approved_by, analysis_start_date, analysis_completion_date, approved_at, status)
                VALUES 
                (@WorksheetId, @ParaCode, @ParameterName, @MethodCode, @MethodName, 
                 @ColumnId, @DiluentPreparation, @OtherInfo, @AnalyzedBy, @ApprovedBy,
                 @AnalysisStartDate, @AnalysisCompletionDate, @ApprovedAt, @Status);
                
                SELECT CAST(SCOPE_IDENTITY() as int);";

            var parameterId = await connection.ExecuteScalarAsync<int>(
                sql,
                new
                {
                    WorksheetId = worksheetId,
                    param.ParaCode,
                    param.ParameterName,
                    param.MethodCode,
                    param.MethodName,
                    param.ColumnId,
                    param.DiluentPreparation,
                    param.OtherInfo,
                    param.AnalyzedBy,
                    param.ApprovedBy,
                    AnalysisStartDate = ParseDate(param.AnalysisStartDate!),
                    AnalysisCompletionDate = ParseDate(param.AnalysisCompletionDate!),
                    ApprovedAt = ParseDate(param.ApprovedAt!),
                    param.Status
                },
                transaction);

            return parameterId;
        }

        private async Task UpdateParameter(
            IDbConnection connection,
            IDbTransaction transaction,
            int parameterId,
            string worksheetId,
            ParameterDto param)
        {
            var sql = @"
                UPDATE worksheet_parameters 
                SET 
                    worksheet_id = @WorksheetId,
                    para_code = @ParaCode,
                    parameter_name = @ParameterName,
                    method_code = @MethodCode,
                    method_name = @MethodName,
                    column_id = @ColumnId,
                    diluent_preparation = @DiluentPreparation,
                    other_info = @OtherInfo,
                    analyzed_by = @AnalyzedBy,
                    approved_by = @ApprovedBy,
                    analysis_start_date = @AnalysisStartDate,
                    analysis_completion_date = @AnalysisCompletionDate,
                    approved_at = @ApprovedAt,
                    status = @Status
                WHERE id = @ParameterId";

            await connection.ExecuteAsync(
                sql,
                new
                {
                    ParameterId = parameterId,
                    WorksheetId = worksheetId,
                    param.ParaCode,
                    param.ParameterName,
                    param.MethodCode,
                    param.MethodName,
                    param.ColumnId,
                    param.DiluentPreparation,
                    param.OtherInfo,
                    param.AnalyzedBy,
                    param.ApprovedBy,
                    AnalysisStartDate = ParseDate(param.AnalysisStartDate!),
                    AnalysisCompletionDate = ParseDate(param.AnalysisCompletionDate!),
                    ApprovedAt = ParseDate(param.ApprovedAt!),
                    param.Status
                },
                transaction);
        }

        private async Task UpsertInstruments(
            IDbConnection connection,
            IDbTransaction transaction,
            int parameterId,
            List<string> instrumentIds)
        {
            // Get existing instruments
            var existing = await connection.QueryAsync<string>(
                "SELECT instrument_id FROM worksheet_instruments WHERE parameter_id = @ParameterId",
                new { ParameterId = parameterId },
                transaction);

            var existingSet = existing.ToHashSet();
            var newSet = (instrumentIds ?? new List<string>()).ToHashSet();

            // Delete removed instruments
            var toDelete = existingSet.Except(newSet).ToList();
            if (toDelete.Any())
            {
                await connection.ExecuteAsync(
                    "DELETE FROM worksheet_instruments WHERE parameter_id = @ParameterId AND instrument_id IN @Ids",
                    new { ParameterId = parameterId, Ids = toDelete },
                    transaction);
            }

            // Insert new instruments (ones that don't exist)
            var toInsert = newSet.Except(existingSet).ToList();
            foreach (var instrumentId in toInsert)
            {
                await connection.ExecuteAsync(
                    "INSERT INTO worksheet_instruments (parameter_id, instrument_id) VALUES (@ParameterId, @InstrumentId)",
                    new { ParameterId = parameterId, InstrumentId = instrumentId },
                    transaction);
            }
        }

        private async Task UpsertChemicals(
            IDbConnection connection,
            IDbTransaction transaction,
            int parameterId,
            List<string> chemicalIds)
        {
            var existing = await connection.QueryAsync<string>(
                "SELECT chemical_id FROM worksheet_chemicals WHERE parameter_id = @ParameterId",
                new { ParameterId = parameterId },
                transaction);

            var existingSet = existing.ToHashSet();
            var newSet = (chemicalIds ?? new List<string>()).ToHashSet();

            var toDelete = existingSet.Except(newSet).ToList();
            if (toDelete.Any())
            {
                await connection.ExecuteAsync(
                    "DELETE FROM worksheet_chemicals WHERE parameter_id = @ParameterId AND chemical_id IN @Ids",
                    new { ParameterId = parameterId, Ids = toDelete },
                    transaction);
            }

            var toInsert = newSet.Except(existingSet).ToList();
            foreach (var chemicalId in toInsert)
            {
                await connection.ExecuteAsync(
                    "INSERT INTO worksheet_chemicals (parameter_id, chemical_id) VALUES (@ParameterId, @ChemicalId)",
                    new { ParameterId = parameterId, ChemicalId = chemicalId },
                    transaction);
            }
        }

        private async Task UpsertStandards(
            IDbConnection connection,
            IDbTransaction transaction,
            int parameterId,
            List<string> standardIds)
        {
            var existing = await connection.QueryAsync<string>(
                "SELECT standard_id FROM worksheet_standards WHERE parameter_id = @ParameterId",
                new { ParameterId = parameterId },
                transaction);

            var existingSet = existing.ToHashSet();
            var newSet = (standardIds ?? new List<string>()).ToHashSet();

            var toDelete = existingSet.Except(newSet).ToList();
            if (toDelete.Any())
            {
                await connection.ExecuteAsync(
                    "DELETE FROM worksheet_standards WHERE parameter_id = @ParameterId AND standard_id IN @Ids",
                    new { ParameterId = parameterId, Ids = toDelete },
                    transaction);
            }

            var toInsert = newSet.Except(existingSet).ToList();
            foreach (var standardId in toInsert)
            {
                await connection.ExecuteAsync(
                    "INSERT INTO worksheet_standards (parameter_id, standard_id) VALUES (@ParameterId, @StandardId)",
                    new { ParameterId = parameterId, StandardId = standardId },
                    transaction);
            }
        }

        private async Task UpsertStandardPreparations(
            IDbConnection connection,
            IDbTransaction transaction,
            int parameterId,
            List<StandardPreparationDto> preparations)
        {
            if (preparations == null)
                preparations = new List<StandardPreparationDto>();

            // Get existing standard preparations with their IDs
            var existing = await connection.QueryAsync<(int Id, string Label, string PreparationType)>(
                @"SELECT id, label, preparation_type 
                  FROM worksheet_standard_preparations 
                  WHERE parameter_id = @ParameterId",
                new { ParameterId = parameterId },
                transaction);

            // Create lookup by composite key (Label + PreparationType)
            var existingDict = existing.ToDictionary(
                x => $"{x.Label}_{x.PreparationType}",
                x => x.Id
            );

            var newKeys = preparations.Select(p => $"{p.Label}_{p.PreparationType}").ToHashSet();
            var existingKeys = existingDict.Keys.ToHashSet();

            // Delete preparations that no longer exist
            var toDelete = existingKeys.Except(newKeys).ToList();
            if (toDelete.Any())
            {
                var idsToDelete = toDelete.Select(key => existingDict[key]).ToList();
                await connection.ExecuteAsync(
                    "DELETE FROM worksheet_standard_preparations WHERE id IN @Ids",
                    new { Ids = idsToDelete },
                    transaction);
            }

            // Update existing or insert new
            foreach (var prep in preparations)
            {
                var key = $"{prep.Label}_{prep.PreparationType}";

                if (existingDict.TryGetValue(key, out var existingId))
                {
                    // Update existing
                    await connection.ExecuteAsync(
                        @"UPDATE worksheet_standard_preparations 
                          SET assigned_standard_id = @AssignedStandardId,
                              steps = @Steps
                          WHERE id = @Id",
                        new
                        {
                            Id = existingId,
                            prep.AssignedStandardId,
                            prep.Steps
                        },
                        transaction);
                }
                else
                {
                    // Insert new
                    await connection.ExecuteAsync(
                        @"INSERT INTO worksheet_standard_preparations 
                          (parameter_id, preparation_type, label, assigned_standard_id, steps)
                          VALUES (@ParameterId, @PreparationType, @Label, @AssignedStandardId, @Steps)",
                        new
                        {
                            ParameterId = parameterId,
                            prep.PreparationType,
                            prep.Label,
                            prep.AssignedStandardId,
                            prep.Steps
                        },
                        transaction);
                }
            }
        }

        private async Task UpsertSamplePreparations(
            IDbConnection connection,
            IDbTransaction transaction,
            int parameterId,
            List<SamplePreparationDto> preparations)
        {
            if (preparations == null)
                preparations = new List<SamplePreparationDto>();

            // Get existing sample preparations with their IDs
            var existing = await connection.QueryAsync<(int Id, string Label, string PreparationType)>(
                @"SELECT id, label, preparation_type 
                  FROM worksheet_sample_preparations 
                  WHERE parameter_id = @ParameterId",
                new { ParameterId = parameterId },
                transaction);

            // Create lookup by composite key (Label + PreparationType)
            var existingDict = existing.ToDictionary(
                x => $"{x.Label}_{x.PreparationType}",
                x => x.Id
            );

            var newKeys = preparations.Select(p => $"{p.Label}_{p.PreparationType}").ToHashSet();
            var existingKeys = existingDict.Keys.ToHashSet();

            // Delete preparations that no longer exist
            var toDelete = existingKeys.Except(newKeys).ToList();
            if (toDelete.Any())
            {
                var idsToDelete = toDelete.Select(key => existingDict[key]).ToList();
                await connection.ExecuteAsync(
                    "DELETE FROM worksheet_sample_preparations WHERE id IN @Ids",
                    new { Ids = idsToDelete },
                    transaction);
            }

            // Update existing or insert new
            foreach (var prep in preparations)
            {
                var key = $"{prep.Label}_{prep.PreparationType}";

                if (existingDict.TryGetValue(key, out var existingId))
                {
                    // Update existing
                    await connection.ExecuteAsync(
                        @"UPDATE worksheet_sample_preparations 
                          SET assigned_standard_id = @AssignedStandardId,
                              steps = @Steps
                          WHERE id = @Id",
                        new
                        {
                            Id = existingId,
                            prep.AssignedStandardId,
                            prep.Steps
                        },
                        transaction);
                }
                else
                {
                    // Insert new
                    await connection.ExecuteAsync(
                        @"INSERT INTO worksheet_sample_preparations 
                          (parameter_id, preparation_type, label, assigned_standard_id, steps)
                          VALUES (@ParameterId, @PreparationType, @Label, @AssignedStandardId, @Steps)",
                        new
                        {
                            ParameterId = parameterId,
                            prep.PreparationType,
                            prep.Label,
                            prep.AssignedStandardId,
                            prep.Steps
                        },
                        transaction);
                }
            }
        }

        private async Task UpsertCalculations(
            IDbConnection connection,
            IDbTransaction transaction,
            int parameterId,
            List<CalculationDto> calculations)
        {
            if (calculations == null)
                calculations = new List<CalculationDto>();

            // Get existing calculations with their IDs
            var existing = await connection.QueryAsync<(int Id, string Label, string CalculationType)>(
                @"SELECT id, label, calculation_type 
                  FROM worksheet_calculations 
                  WHERE parameter_id = @ParameterId",
                new { ParameterId = parameterId },
                transaction);

            // Create lookup by composite key (Label + CalculationType)
            var existingDict = existing.ToDictionary(
                x => $"{x.Label}_{x.CalculationType}",
                x => x.Id
            );

            var newKeys = calculations.Select(c => $"{c.Label}_{c.CalculationType}").ToHashSet();
            var existingKeys = existingDict.Keys.ToHashSet();

            // Delete calculations that no longer exist
            var toDelete = existingKeys.Except(newKeys).ToList();
            if (toDelete.Any())
            {
                var idsToDelete = toDelete.Select(key => existingDict[key]).ToList();
                await connection.ExecuteAsync(
                    "DELETE FROM worksheet_calculations WHERE id IN @Ids",
                    new { Ids = idsToDelete },
                    transaction);
            }

            // Update existing or insert new
            foreach (var calc in calculations)
            {
                var key = $"{calc.Label}_{calc.CalculationType}";

                if (existingDict.TryGetValue(key, out var existingId))
                {
                    // Update existing
                    await connection.ExecuteAsync(
                        @"UPDATE worksheet_calculations 
                          SET calculation_data = @CalculationData
                          WHERE id = @Id",
                        new
                        {
                            Id = existingId,
                            CalculationData = calc.Data
                        },
                        transaction);
                }
                else
                {
                    // Insert new
                    await connection.ExecuteAsync(
                        @"INSERT INTO worksheet_calculations 
                          (parameter_id, calculation_type, label, calculation_data)
                          VALUES (@ParameterId, @CalculationType, @Label, @CalculationData)",
                        new
                        {
                            ParameterId = parameterId,
                            calc.CalculationType,
                            calc.Label,
                            CalculationData = calc.Data
                        },
                        transaction);
                }
            }
        }

        private async Task<WorksheetDetailDto> LoadWorksheetDetails(
            IDbConnection connection,
            RawDataWorksheet worksheet,
            FetchWorksheetsRequest request)
        {
            var result = new WorksheetDetailDto
            {
                Sample = MapToWorksheetDto(worksheet),
                Parameters = new List<ParameterDetailDto>()
            };

            string parametersSql;

            if (request.Role == "HOD LAB")
            {
                parametersSql = @"
                    SELECT
                        id                    AS Id,
                        para_code             AS ParaCode,
                        parameter_name        AS ParameterName,
                        method_code           AS MethodCode,
                        method_name           AS MethodName,
                        column_id             AS ColumnId,
                        diluent_preparation   AS DiluentPreparation,
                        analysis_start_date   AS AnalysisStartDate,
                        analysis_completion_date   AS AnalysisCompletionDate,
                        analyzed_by   AS AnalyzedBy,
                        approved_by   AS ApprovedBy,
                        approved_at   AS ApprovedAT,
                        other_info    AS OtherInfo,
                        status        AS Status
                    FROM worksheet_parameters
                    WHERE worksheet_id = @WorksheetId";
            }
            else
            {
                parametersSql = @"
                    SELECT
                        id                    AS Id,
                        para_code             AS ParaCode,
                        parameter_name        AS ParameterName,
                        method_code           AS MethodCode,
                        method_name           AS MethodName,
                        column_id             AS ColumnId,
                        diluent_preparation   AS DiluentPreparation,
                        analysis_start_date   AS AnalysisStartDate,
                        analysis_completion_date   AS AnalysisCompletionDate,
                        analyzed_by   AS AnalyzedBy,
                        approved_by   AS ApprovedBy,
                        approved_at   AS ApprovedAT,
                        other_info    AS OtherInfo,
                        status        AS Status
                    FROM worksheet_parameters
                    WHERE worksheet_id = @WorksheetId AND analyzed_by = @EmployeeId AND status != 'Created'";
            }

            var parameters = await connection.QueryAsync<WorksheetParameter>(
                parametersSql,
                new { worksheet.WorksheetId, request.EmployeeId });

            foreach (var param in parameters)
            {
                var paramDetail = new ParameterDetailDto
                {
                    Id = param.Id,
                    ParaCode = param.ParaCode,
                    ParameterName = param.ParameterName,
                    MethodCode = param.MethodCode,
                    MethodName = param.MethodName,
                    ColumnId = param.ColumnId,
                    DiluentPreparation = param.DiluentPreparation,
                    OtherInfo = param.OtherInfo,
                    AnalysisStartDate = param.AnalysisStartDate?.ToString("dd/MM/yyyy"),
                    AnalysisCompletionDate = param.AnalysisCompletionDate?.ToString("dd/MM/yyyy"),
                    AnalyzedBy = param.AnalyzedBy,
                    ApprovedBy = param.ApprovedBy,
                    ApprovedAt = param.ApprovedAt?.ToString("dd/MM/yyyy"),
                    Status = param.Status,
                };

                var instruments = await connection.QueryAsync<WorksheetInstrument>(
                    "SELECT instrument_id AS InstrumentId FROM worksheet_instruments WHERE parameter_id = @ParameterId",
                    new { ParameterId = param.Id });
                paramDetail.InstrumentIds = instruments.Select(i => i.InstrumentId).ToList();

                var chemicals = await connection.QueryAsync<WorksheetChemical>(
                    "SELECT chemical_id AS ChemicalId FROM worksheet_chemicals WHERE parameter_id = @ParameterId",
                    new { ParameterId = param.Id });
                paramDetail.ChemicalIds = chemicals.Select(c => c.ChemicalId).ToList();

                var standards = await connection.QueryAsync<WorksheetStandard>(
                    "SELECT standard_id AS StandardId FROM worksheet_standards WHERE parameter_id = @ParameterId",
                    new { ParameterId = param.Id });
                paramDetail.StandardIds = standards.Select(s => s.StandardId).ToList();

                var standardPreps = await connection.QueryAsync<WorksheetStandardPreparation>(
                    @"SELECT 
                        label AS Label,
                        steps AS Steps,
                        assigned_standard_id AS AssignedStandardId,
                        preparation_type AS PreparationType
                    FROM worksheet_standard_preparations WHERE parameter_id = @ParameterId",
                    new { ParameterId = param.Id });
                paramDetail.StandardPreparations = standardPreps.Select(sp => new StandardPreparationDto
                {
                    Label = sp.Label,
                    AssignedStandardId = sp.AssignedStandardId,
                    Steps = sp.Steps,
                    PreparationType = sp.PreparationType
                }).ToList();

                var samplePreps = await connection.QueryAsync<WorksheetSamplePreparation>(
                    @"SELECT
                        label AS Label,
                        steps AS Steps,
                        assigned_standard_id AS AssignedStandardId,
                        preparation_type AS PreparationType
                    FROM worksheet_sample_preparations WHERE parameter_id = @ParameterId",
                    new { ParameterId = param.Id });
                paramDetail.SamplePreparations = samplePreps.Select(sp => new SamplePreparationDto
                {
                    Label = sp.Label,
                    AssignedStandardId = sp.AssignedStandardId,
                    Steps = sp.Steps,
                    PreparationType = sp.PreparationType
                }).ToList();

                var calculations = await connection.QueryAsync<WorksheetCalculation>(
                    "SELECT label as Label, calculation_data AS CalculationData, calculation_type AS CalculationType FROM worksheet_calculations WHERE parameter_id = @ParameterId",
                    new { ParameterId = param.Id });
                paramDetail.Calculations = calculations.Select(c => new CalculationDto
                {
                    Label = c.Label,
                    Data = c.CalculationData,
                    CalculationType = c.CalculationType
                }).ToList();

                result.Parameters.Add(paramDetail);
            }

            return result;
        }

        private RawDataWorksheetDto MapToWorksheetDto(RawDataWorksheet worksheet)
        {
            return new RawDataWorksheetDto
            {
                WorksheetId = worksheet.WorksheetId,
                RegistrationNo = worksheet.RegistrationNo,
                SampleName = worksheet.SampleName,
                NumberOfParameters = worksheet.NumberOfParameters,
                DueDate = worksheet.DueDate?.ToString("dd/MM/yyyy"),
                PreparedBy = worksheet.PreparedBy,
                RevisionDate = worksheet.RevisionDate?.ToString("dd/MM/yyyy"),
                Status = worksheet.Status,
                SubmittedAt = worksheet.SubmittedAt,
                CreatedAt = worksheet.CreatedAt,
                UpdatedAt = worksheet.UpdatedAt
            };
        }

        private DateTime? ParseDate(string dateString)
        {
            if (string.IsNullOrWhiteSpace(dateString))
                return null;

            string[] formats = { "dd/MM/yyyy", "yyyy-MM-dd", "MM/dd/yyyy" };

            foreach (var format in formats)
            {
                if (DateTime.TryParseExact(dateString, format, null,
                    System.Globalization.DateTimeStyles.None, out DateTime result))
                {
                    return result;
                }
            }

            if (DateTime.TryParse(dateString, out DateTime generalResult))
            {
                return generalResult;
            }

            return null;
        }
    }
}