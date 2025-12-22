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

        public async Task<bool> ExistsAsync(string worksheetId)
        {
            const string sql = """
                SELECT 1
                FROM raw_data_worksheets
                WHERE worksheet_id = @WorksheetId
            """;

            using var conn = CreateConnection();
            return await conn.ExecuteScalarAsync<int?>(sql, new { WorksheetId = worksheetId }) != null;
        }

        public async Task CreateAsync(SaveWorksheetRequest request)
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


        public async Task UpdateAsync(SaveWorksheetRequest request)
        {
            using var connection = CreateConnection();
            connection.Open();
            using var transaction = connection.BeginTransaction();

            try
            {

                var updateSql = @"
                    UPDATE raw_data_worksheets 
                    SET sample_name = @SampleName,
                        number_of_parameters = @NumberOfParameters,
                        due_date = @DueDate,
                        prepared_by = @PreparedBy,
                        revision_date = @RevisionDate,
                        updated_at = SYSDATETIME()
                    WHERE worksheet_id = @WorksheetId";

                await connection.ExecuteAsync(
                    updateSql,
                    new
                    {
                        request.WorksheetId,
                        request.RegistrationInfo.SampleName,
                        request.RegistrationInfo.NumberOfParameters,
                        DueDate = ParseDate(request.RegistrationInfo.DueDate),
                        request.DocumentInfo.PreparedBy,
                        RevisionDate = ParseDate(request.DocumentInfo.RevisionDate)
                    },
                    transaction);

                // 3. Delete existing parameters (cascade delete will handle related data)
                await connection.ExecuteAsync(
                    "DELETE FROM worksheet_parameters WHERE worksheet_id = @WorksheetId",
                    new { WorksheetId = request.WorksheetId },
                    transaction);

                // 4. Insert new parameters
                foreach (var param in request.Parameters)
                {
                    var parameterId = await InsertParameter(connection, transaction, request.WorksheetId, param);
                    await InsertInstruments(connection, transaction, parameterId, param.Instruments);
                    await InsertChemicals(connection, transaction, parameterId, param.Chemicals);
                    await InsertStandards(connection, transaction, parameterId, param.Standards);
                    await InsertStandardPreparations(connection, transaction, parameterId, param);
                    await InsertSamplePreparations(connection, transaction, parameterId, param);
                    await InsertCalculations(connection, transaction, parameterId, param);
                }

                transaction.Commit();
            }
            catch
            {
                transaction.Rollback();
                throw;
            }
        }

        public async Task DeleteAsync(string worksheetId)
        {
            using var connection = CreateConnection();

            var sql = "DELETE FROM raw_data_worksheets WHERE worksheet_id = @WorksheetId";
            var rowsAffected = await connection.ExecuteAsync(sql, new { WorksheetId = worksheetId });
        }

        public async Task<WorksheetDetailDto> GetByWorksheetIdAsync(string worksheetId)
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

            return await LoadWorksheetDetails(connection, worksheet);
        }


        public async Task<List<WorksheetSummaryDto>> GetAllAsync(string? status)
        {
            using var connection = CreateConnection();

            var sql = @"
        SELECT 
            worksheet_id as WorksheetId,
            registration_no as RegistrationNo,
            sample_name as SampleName,
            number_of_parameters as NumberOfParameters,
            status as Status,
            created_at as CreatedAt
        FROM raw_data_worksheets
        WHERE (@Status IS NULL OR status = @Status)
        ORDER BY created_at DESC";

            var worksheets = await connection.QueryAsync<WorksheetSummaryDto>(
                sql,
                new { Status = status }
            );

            return worksheets.ToList();
        }


        // ==================== HELPER METHODS ====================

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
                    param.AnalysisStartDate,
                    param.AnalysisCompletionDate,
                    param.ApprovedAt
                },
                transaction);

            return parameterId;
        }

        private async Task InsertInstruments(
            IDbConnection connection,
            IDbTransaction transaction,
            int parameterId,
            List<string> instrumentIds)
        {
            if (instrumentIds == null || !instrumentIds.Any())
                return;

            var sql = @"
                INSERT INTO worksheet_instruments (parameter_id, instrument_id)
                VALUES (@ParameterId, @InstrumentId);";

            foreach (var instrumentId in instrumentIds)
            {
                await connection.ExecuteAsync(
                    sql,
                    new { ParameterId = parameterId, InstrumentId = instrumentId },
                    transaction);
            }
        }

        private async Task InsertChemicals(
            IDbConnection connection,
            IDbTransaction transaction,
            int parameterId,
            List<string> chemicalIds)
        {
            if (chemicalIds == null || !chemicalIds.Any())
                return;

            var sql = @"
                INSERT INTO worksheet_chemicals (parameter_id, chemical_id)
                VALUES (@ParameterId, @ChemicalId);";

            foreach (var chemicalId in chemicalIds)
            {
                await connection.ExecuteAsync(
                    sql,
                    new { ParameterId = parameterId, ChemicalId = chemicalId },
                    transaction);
            }
        }

        private async Task InsertStandards(
            IDbConnection connection,
            IDbTransaction transaction,
            int parameterId,
            List<string> standardIds)
        {
            if (standardIds == null || !standardIds.Any())
                return;

            var sql = @"
                INSERT INTO worksheet_standards (parameter_id, standard_id)
                VALUES (@ParameterId, @StandardId);";

            foreach (var standardId in standardIds)
            {
                await connection.ExecuteAsync(
                    sql,
                    new { ParameterId = parameterId, StandardId = standardId },
                    transaction);
            }
        }

        private async Task InsertStandardPreparations(
            IDbConnection connection,
            IDbTransaction transaction,
            int parameterId,
            ParameterDto param)
        {
            var sql = @"
                INSERT INTO worksheet_standard_preparations 
                (parameter_id, preparation_type, label, assigned_standard_id, steps)
                VALUES (@ParameterId, @PreparationType, @Label, @AssignedStandardId, @Steps);";

            // Assay
            await InsertPreparationList(
                connection, transaction, parameterId, param.StandardPreparations, sql);

        }

        private async Task InsertSamplePreparations(
            IDbConnection connection,
            IDbTransaction transaction,
            int parameterId,
            ParameterDto param)
        {
            var sql = @"
                INSERT INTO worksheet_sample_preparations 
                (parameter_id, preparation_type, label, assigned_standard_id, steps)
                VALUES (@ParameterId, @PreparationType, @Label, @AssignedStandardId, @Steps);";

            // Assay
            await InsertSamplePreparationList(
                connection, transaction, parameterId, param.SamplePreparations, sql);
        }

        private async Task InsertCalculations(
            IDbConnection connection,
            IDbTransaction transaction,
            int parameterId,
            ParameterDto param)
        {
            var sql = @"
                INSERT INTO worksheet_calculations 
                (parameter_id, calculation_type, label, calculation_data)
                VALUES (@ParameterId, @CalculationType, @Label, @CalculationData);";

            await InsertCalculationList(
                connection, transaction, parameterId, param.Calculations, sql);
        }

        private async Task InsertPreparationList(
            IDbConnection connection,
            IDbTransaction transaction,
            int parameterId,
            List<StandardPreparationDto> preparations,
            string sql)
        {
            if (preparations == null || !preparations.Any())
                return;

            foreach (var prep in preparations)
            {
                await connection.ExecuteAsync(
                    sql,
                    new
                    {
                        ParameterId = parameterId,
                        prep.Label,
                        prep.AssignedStandardId,
                        prep.PreparationType,
                        prep.Steps
                    },
                    transaction);
            }
        }

        private async Task InsertSamplePreparationList(
            IDbConnection connection,
            IDbTransaction transaction,
            int parameterId,
            List<SamplePreparationDto> preparations,
            string sql)
        {
            if (preparations == null || !preparations.Any())
                return;

            foreach (var prep in preparations)
            {
                await connection.ExecuteAsync(
                    sql,
                    new
                    {
                        ParameterId = parameterId,
                        prep.PreparationType,
                        prep.Label,
                        prep.AssignedStandardId,
                        Steps = prep.Steps
                    },
                    transaction);
            }
        }

        private async Task InsertCalculationList(
            IDbConnection connection,
            IDbTransaction transaction,
            int parameterId,
            List<CalculationDto> calculations,
            string sql)
        {
            if (calculations == null || !calculations.Any())
                return;

            foreach (var calc in calculations)
            {
                await connection.ExecuteAsync(
                    sql,
                    new
                    {
                        ParameterId = parameterId,
                        calc.Label,
                        calc.CalculationType,
                        CalculationData = calc.Data
                    },
                    transaction);
            }
        }

        private async Task<WorksheetDetailDto> LoadWorksheetDetails(
            IDbConnection connection,
            RawDataWorksheet worksheet)
        {
            var result = new WorksheetDetailDto
            {
                Worksheet = MapToWorksheetDto(worksheet),
                Parameters = new List<ParameterDetailDto>()
            };

            var parametersSql = @"
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
                WHERE worksheet_id = @WorksheetId;
            ";
            var parameters = await connection.QueryAsync<WorksheetParameter>(
                parametersSql,
                new { WorksheetId = worksheet.WorksheetId });

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
                };

                // Get instrument IDs
                var instruments = await connection.QueryAsync<WorksheetInstrument>(
                    "SELECT instrument_id AS InstrumentId FROM worksheet_instruments WHERE parameter_id = @ParameterId",
                    new { ParameterId = param.Id });
                paramDetail.InstrumentIds = instruments.Select(i => i.InstrumentId).ToList();

                // Get chemical IDs
                var chemicals = await connection.QueryAsync<WorksheetChemical>(
                    "SELECT chemical_id AS ChemicalId FROM worksheet_chemicals WHERE parameter_id = @ParameterId",
                    new
                    {
                        ParameterId = param.Id
                    });
                paramDetail.ChemicalIds = chemicals.Select(c => c.ChemicalId).ToList();
                // Get standard IDs
                var standards = await connection.QueryAsync<WorksheetStandard>(
                    "SELECT standard_id AS StandardId FROM worksheet_standards WHERE parameter_id = @ParameterId",
                    new { ParameterId = param.Id });
                paramDetail.StandardIds = standards.Select(s => s.StandardId).ToList();

                // Get standard preparations
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
                    //Steps = JsonConvert.DeserializeObject(sp.Steps)
                    Steps = sp.Steps
                }).ToList();

                // Get sample preparations
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
                    //Steps = JsonConvert.DeserializeObject(sp.Steps)
                    Steps = sp.Steps,
                    PreparationType = sp.PreparationType
                }).ToList();

                // Get calculations
                var calculations = await connection.QueryAsync<WorksheetCalculation>(
                    "SELECT label as Label, calculation_data AS CalculationData, calculation_type AS CalculationType FROM worksheet_calculations WHERE parameter_id = @ParameterId",
                    new { ParameterId = param.Id });
                paramDetail.Calculations = calculations.Select(c => new CalculationDto
                {
                    Label = c.Label,
                    //Data = JsonConvert.DeserializeObject(c.CalculationData)
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

            // Try multiple date formats
            string[] formats = { "dd/MM/yyyy", "yyyy-MM-dd", "MM/dd/yyyy" };

            foreach (var format in formats)
            {
                if (DateTime.TryParseExact(dateString, format, null,
                    System.Globalization.DateTimeStyles.None, out DateTime result))
                {
                    return result;
                }
            }

            // If all formats fail, try general parsing
            if (DateTime.TryParse(dateString, out DateTime generalResult))
            {
                return generalResult;
            }

            return null;
        }

    }
}


