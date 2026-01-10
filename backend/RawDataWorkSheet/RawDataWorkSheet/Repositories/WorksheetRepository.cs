using Dapper;
using Microsoft.Data.SqlClient;
using RawDataWorkSheet.Models;
using RawDataWorkSheet.Models.DTOs;
using RawDataWorkSheet.Models.Requests;
using RawDataWorkSheet.Models.Worksheets;
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

        private IDbConnection Createconnection()
        {
            return new SqlConnection(_connectionString);
        }

        public async Task<bool> ExistsWorksheetAsync(string worksheetId)
        {
            const string query = """
                SELECT 1
                FROM raw_data_worksheets
                WHERE worksheet_id = @WorksheetId
            """;

            using var conn = Createconnection();
            return await conn.ExecuteScalarAsync<int?>(query, new { WorksheetId = worksheetId }) != null;
        }

        public async Task<bool> ExistsParameterAsync(int parameterId)
        {
            const string query = """
                SELECT 1
                FROM worksheet_parameters
                WHERE id = @ParameterId
            """;

            using var conn = Createconnection();
            return await conn.ExecuteScalarAsync<int?>(query, new { ParameterId = parameterId }) != null;
        }

        public async Task CreateWorksheetAsync(SaveWorksheetRequest request)
        {
            const string query = """
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

            using var conn = Createconnection();
            await conn.ExecuteAsync(query, new
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
            using var connection = Createconnection();
            connection.Open();
            using var transaction = connection.BeginTransaction();

            try
            {

                var query = """
            UPDATE raw_data_worksheets 
            SET
                number_of_parameters = @NumberOfParameters,
                updated_at = SYSDATETIME(),
                approved_at = @ApprovedAt,
                status = @Status
            WHERE worksheet_id = @WorksheetId
        """;

                await connection.ExecuteAsync(
                    query,
                    new
                    {
                        ApprovedAt = request.DocumentInfo?.ApprovedAt != null
                            ? ParseDate(request.DocumentInfo.ApprovedAt)
                            : null,
                        request.RegistrationInfo.NumberOfParameters,
                        request.WorksheetId,
                        request.DocumentInfo?.Status
                    },
                    transaction
                );

                var existingParams = await connection.QueryAsync<(
                    int Id,
                    string ParaCode,
                    string Status
                )>(
                    """
                        SELECT id, para_code, status
                        FROM worksheet_parameters
                        WHERE worksheet_id = @WorksheetId
                    """,
                    new { WorksheetId = request.WorksheetId },
                    transaction
                );

                var existingParamDict = existingParams.ToDictionary(
                    p => p.ParaCode,
                    p => (p.Id, p.Status)
                );

                var requestParamCodes = request.Parameters
                    .Select(p => p.ParaCode)
                    .ToHashSet();

                var idsToDelete = existingParamDict
                    .Where(p =>
                        !requestParamCodes.Contains(p.Key) &&
                        !(request.Role == "Reviewer"  &&
                          (p.Value.Status == "Analysis Started" ||
                           p.Value.Status == "Analysis Revision"))
                    )
                    .Select(p => p.Value.Id)
                    .ToList();

                if (idsToDelete.Any())
                {
                    await connection.ExecuteAsync(
                        "DELETE FROM worksheet_parameters WHERE id IN @Ids",
                        new { Ids = idsToDelete },
                        transaction
                    );
                }

                foreach (var param in request.Parameters)
                {
                    if (existingParamDict.TryGetValue(param.ParaCode, out var existing))
                    {
                        if (request.Role == "Reviewer" &&
                            (existing.Status == "Analysis Started" ||
                             existing.Status == "Analysis Revision"))
                        {
                            continue;
                        }

                        var parameterId = existing.Id;

                        await UpdateParameter(
                            connection,
                            transaction,
                            parameterId,
                            request.WorksheetId,
                            param
                        );

                        await UpsertInstruments(connection, transaction, parameterId, param.InstrumentIds);
                        await UpsertChemicals(connection, transaction, parameterId, param.ChemicalIds);
                        await UpsertStandards(connection, transaction, parameterId, param.StandardIds);
                        await UpsertStandardPreparations(connection, transaction, parameterId, param.StandardPreparations);
                        await UpsertSamplePreparations(connection, transaction, parameterId, param.SamplePreparations);
                        await UpsertCalculations(connection, transaction, parameterId, param.Calculations);
                    }
                    else
                    {
                        var parameterId = await InsertParameter(
                            connection,
                            transaction,
                            request.WorksheetId,
                            param
                        );

                        await UpsertInstruments(connection, transaction, parameterId, param.InstrumentIds);
                        await UpsertChemicals(connection, transaction, parameterId, param.ChemicalIds);
                        await UpsertStandards(connection, transaction, parameterId, param.StandardIds);
                        await UpsertStandardPreparations(connection, transaction, parameterId, param.StandardPreparations);
                        await UpsertSamplePreparations(connection, transaction, parameterId, param.SamplePreparations);
                        await UpsertCalculations(connection, transaction, parameterId, param.Calculations);
                    }
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
            using var connection = Createconnection();
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

                await UpdateParameter(connection, transaction, parameterId, worksheetId, request);

                await UpsertInstruments(connection, transaction, parameterId, request.InstrumentIds);
                await UpsertChemicals(connection, transaction, parameterId, request.ChemicalIds);
                await UpsertStandards(connection, transaction, parameterId, request.StandardIds);
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
            using var connection = Createconnection();
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

        public async Task<int> AddParameterAsync(string worksheetId, ParameterDto parameter)
        {
            using var connection = Createconnection();
            connection.Open();
            using var transaction = connection.BeginTransaction();

            try
            {

                var existingParamId = await connection.ExecuteScalarAsync<int?>(
                    @"SELECT id FROM worksheet_parameters 
              WHERE worksheet_id = @WorksheetId AND para_code = @ParaCode",
                    new { WorksheetId = worksheetId, ParaCode = parameter.ParaCode },
                    transaction
                );

                if (existingParamId != null)
                {
                    throw new InvalidOperationException(
                        $"Parameter with code {parameter.ParaCode} already exists in worksheet {worksheetId}"
                    );
                }

                var parameterId = await InsertParameter(
                    connection,
                    transaction,
                    worksheetId,
                    parameter
                );

                await UpsertInstruments(connection, transaction, parameterId, parameter.InstrumentIds);
                await UpsertChemicals(connection, transaction, parameterId, parameter.ChemicalIds);
                await UpsertStandards(connection, transaction, parameterId, parameter.StandardIds);
                await UpsertStandardPreparations(connection, transaction, parameterId, parameter.StandardPreparations);
                await UpsertSamplePreparations(connection, transaction, parameterId, parameter.SamplePreparations);
                await UpsertCalculations(connection, transaction, parameterId, parameter.Calculations);

                await connection.ExecuteAsync(
                    @"UPDATE raw_data_worksheets 
              SET number_of_parameters = number_of_parameters + 1,
                  updated_at = SYSDATETIME()
              WHERE worksheet_id = @WorksheetId",
                    new { WorksheetId = worksheetId },
                    transaction
                );

                transaction.Commit();

                return parameterId;
            }
            catch
            {
                transaction.Rollback();
                throw;
            }
        }



        public async Task DeleteWorksheetAsync(string worksheetId)
        {
            using var connection = Createconnection();

            var query = "DELETE FROM raw_data_worksheets WHERE worksheet_id = @WorksheetId";
            await connection.ExecuteAsync(query, new { WorksheetId = worksheetId });
        }

        public async Task<WorksheetDetailDto> GetWorksheetByIdAsync(string worksheetId, FetchWorksheetsRequest request)
        {
            using var connection = Createconnection();

            var query1 = @"
                SELECT
                    worksheet_id      AS WorksheetId,
                    registration_no   AS RegistrationNo,
                    sample_name       AS SampleName,
                    number_of_parameters AS NumberOfParameters,
                    due_date           AS DueDate,
                    prepared_by        AS PreparedBy,
                    revision_date      AS RevisionDate,
                    status             AS Status,
                    created_at         AS CreatedAt,
                    updated_at         AS UpdatedAt,
                    approved_at        AS ApprovedAt
                FROM raw_data_worksheets
                WHERE worksheet_id = @WorksheetId";

            var worksheet = await connection.QueryFirstOrDefaultAsync<Worksheet>(
                query1,
                new { WorksheetId = worksheetId });


            if (worksheet == null)
                return null;

            var query2 = """
                    SELECT 
                        emp_name AS [Username]
                    FROM participants_rawdata
                    WHERE emp_id = @EmployeeId
                """;
            worksheet.PreparedByName = await connection.QueryFirstAsync<string>(
                query2,
                new { EmployeeId = worksheet.PreparedBy });

            return await LoadWorksheetDetails(connection, worksheet, request);
        }

        public async Task<List<WorksheetSummaryDto>> GetAllWorksheetsAsync(FetchWorksheetsRequest request)
        {
            using var connection = Createconnection();
            string sql;

            if (request.Role == "Reviewer")
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
                WITH cte AS (
                    SELECT 
                        w.worksheet_id        AS WorksheetId,
                        p.id                  AS ParameterId,
                        p.parameter_name      AS ParameterName,
                        w.registration_no     AS RegistrationNo,
                        w.sample_name         AS SampleName,
                        w.number_of_parameters AS NumberOfParameters,
                        w.status              AS Status,
                        w.created_at          AS CreatedAt,
                        ROW_NUMBER() OVER (
                            PARTITION BY w.worksheet_id
                            ORDER BY p.id
                        ) AS rn
                    FROM raw_data_worksheets w
                    JOIN worksheet_parameters p
                        ON w.worksheet_id = p.worksheet_id
                    WHERE p.analyzed_by = @EmployeeId
                      AND w.status <> 'Draft'
                )
                SELECT *
                FROM cte
                WHERE rn = 1
                ORDER BY CreatedAt DESC;
            ";
            }

            var worksheets = await connection.QueryAsync<WorksheetSummaryDto>(
                sql,
                new { request.EmployeeId }
            );

            var worksheetList = worksheets.ToList();

            foreach (var worksheet in worksheetList)
            {
                if (worksheet.Status == "Submitted For Analysis")
                {
                    var parameterStatusSql = @"
                SELECT status
                FROM worksheet_parameters
                WHERE worksheet_id = @WorksheetId";

                    var parameterStatuses = await connection.QueryAsync<string>(
                        parameterStatusSql,
                        new { WorksheetId = worksheet.WorksheetId }
                    );

                    var statusList = parameterStatuses.ToList();

                    if (statusList.Any() &&
                        statusList.All(status =>
                            status == "Analysis Completed" || status == "Approved"))
                    {
                        worksheet.Status = "Pending For Review";
                    }
                }
            }

            return worksheetList;
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
                    analysis_start_date = @AnalysisStartDate,
                    analysis_completion_date = @AnalysisCompletionDate,
                    approved_by = COALESCE(approved_by, @ApprovedBy),
                    approved_at = COALESCE(approved_at, @ApprovedAt),
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
            Worksheet worksheet,
            FetchWorksheetsRequest request)
        {
            var result = new WorksheetDetailDto
            {
                Sample = MapToWorksheetDto(worksheet),
                Parameters = new List<ParameterDto>()
            };

            string parametersSql;

            if (request.Role.Contains("Reviewer"))
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
                        approved_at   AS ApprovedAt,
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
                        approved_at   AS ApprovedAt,
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
                var paramDetail = new ParameterDto
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

                if(param.ApprovedBy != null)
                {
                    var query = """
                        SELECT 
                            emp_name AS [Username]
                        FROM participants_rawdata
                        WHERE emp_id = @EmployeeId
                    """;

                    paramDetail.ApprovedByName = await connection.QueryFirstAsync<string>(
                        query,
                        new { EmployeeId = paramDetail.ApprovedBy });
                }

                if (param.AnalyzedBy != null)
                {
                    var query = """
                        SELECT 
                            emp_name AS [Username]
                        FROM participants_rawdata
                        WHERE emp_id = @EmployeeId
                    """;

                    paramDetail.AnalyzedByName = await connection.QueryFirstAsync<string>(
                        query,
                        new { EmployeeId = paramDetail.AnalyzedBy });
                }

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

        private WorksheetDto MapToWorksheetDto(Worksheet worksheet)
        {
            return new WorksheetDto
            {
                WorksheetId = worksheet.WorksheetId,
                RegistrationNo = worksheet.RegistrationNo,
                SampleName = worksheet.SampleName,
                NumberOfParameters = worksheet.NumberOfParameters,
                DueDate = worksheet.DueDate?.ToString("dd/MM/yyyy"),
                PreparedBy = worksheet.PreparedBy,
                PreparedByName = worksheet.PreparedByName,
                RevisionDate = worksheet.RevisionDate?.ToString("dd/MM/yyyy"),
                Status = worksheet.Status,
                ApprovedAt = worksheet.ApprovedAt?.ToString("dd/MM/yyyy"),
                CreatedAt = worksheet.CreatedAt.ToString("dd/MM/yyyy"),
                UpdatedAt = worksheet.UpdatedAt?.ToString("dd/MM/yyyy")
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