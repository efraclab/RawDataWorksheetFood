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

        // ─────────────────────────────────────────────────────────────────────────
        // EXISTS CHECKS
        // ─────────────────────────────────────────────────────────────────────────

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

        // ─────────────────────────────────────────────────────────────────────────
        // WORKSHEET CRUD
        // ─────────────────────────────────────────────────────────────────────────

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
                DueDate = ParseDateTime(request.RegistrationInfo!.DueDate)
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
                        status = @Status,
                        submitted_qa_by = COALESCE(submitted_qa_by, @SubmittedQaBy),
                        submitted_qa_at = COALESCE(submitted_qa_at, @SubmittedQaAt),
                        approved_by = COALESCE(approved_by, @ApprovedBy)
                    WHERE worksheet_id = @WorksheetId
                """;

                await connection.ExecuteAsync(
                    query,
                    new
                    {
                        ApprovedAt = request.DocumentInfo?.ApprovedAt != null
                            ? ParseDateTime(request.DocumentInfo.ApprovedAt)
                            : null,
                        request.RegistrationInfo!.NumberOfParameters,
                        request.WorksheetId,
                        request.DocumentInfo?.Status,
                        SubmittedQaBy = request.DocumentInfo?.SubmittedQaBy,
                        SubmittedQaAt = request.DocumentInfo?.SubmittedQaAt != null
                            ? ParseDateTime(request.DocumentInfo?.SubmittedQaAt!)
                            : (DateTime?)null,
                        ApprovedBy = request.DocumentInfo?.ApprovedBy,
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
                        !(request.Role == "Reviewer" &&
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

                        await UpdateParameter(connection, transaction, parameterId, request.WorksheetId, param);
                        await UpsertInstruments(connection, transaction, parameterId, param.InstrumentIds);
                        await UpsertChemicals(connection, transaction, parameterId, param.ChemicalIds);
                        await UpsertStandards(connection, transaction, parameterId, param.StandardIds);
                        var prepLabelToId1 = await UpsertPreparations(connection, transaction, parameterId, param.Preparations);
                        await UpsertCalculations(connection, transaction, parameterId, param.Calculations);
                        await UpsertFiles(connection, transaction, parameterId, param.Files, request.WorksheetId, prepLabelToId1);
                    }
                    else
                    {
                        var parameterId = await InsertParameter(connection, transaction, request.WorksheetId, param);

                        await UpsertInstruments(connection, transaction, parameterId, param.InstrumentIds);
                        await UpsertChemicals(connection, transaction, parameterId, param.ChemicalIds);
                        await UpsertStandards(connection, transaction, parameterId, param.StandardIds);
                        var prepLabelToId2 = await UpsertPreparations(connection, transaction, parameterId, param.Preparations);
                        await UpsertCalculations(connection, transaction, parameterId, param.Calculations);
                        await UpsertFiles(connection, transaction, parameterId, param.Files, request.WorksheetId, prepLabelToId2);
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

        public async Task DeleteWorksheetAsync(string worksheetId)
        {
            using var connection = Createconnection();
            var query = "DELETE FROM raw_data_worksheets WHERE worksheet_id = @WorksheetId";
            await connection.ExecuteAsync(query, new { WorksheetId = worksheetId });
        }

        // ─────────────────────────────────────────────────────────────────────────
        // PARAMETER CRUD
        // ─────────────────────────────────────────────────────────────────────────

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
                    throw new InvalidOperationException($"Parameter with id {parameterId} not found");

                await UpdateParameter(connection, transaction, parameterId, worksheetId, request);
                await UpsertInstruments(connection, transaction, parameterId, request.InstrumentIds);
                await UpsertChemicals(connection, transaction, parameterId, request.ChemicalIds);
                await UpsertStandards(connection, transaction, parameterId, request.StandardIds);
                var prepLabelToId = await UpsertPreparations(connection, transaction, parameterId, request.Preparations);
                await UpsertCalculations(connection, transaction, parameterId, request.Calculations);
                await UpsertFiles(connection, transaction, parameterId, request.Files, worksheetId, prepLabelToId);

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
                await connection.ExecuteAsync(
                    "DELETE FROM worksheet_instruments WHERE parameter_id = @ParameterId",
                    new { ParameterId = parameterId }, transaction);

                await connection.ExecuteAsync(
                    "DELETE FROM worksheet_chemicals WHERE parameter_id = @ParameterId",
                    new { ParameterId = parameterId }, transaction);

                await connection.ExecuteAsync(
                    "DELETE FROM worksheet_standards WHERE parameter_id = @ParameterId",
                    new { ParameterId = parameterId }, transaction);

                await connection.ExecuteAsync(
                    "DELETE FROM worksheet_preparations WHERE parameter_id = @ParameterId",
                    new { ParameterId = parameterId }, transaction);

                await connection.ExecuteAsync(
                    "DELETE FROM worksheet_calculations WHERE parameter_id = @ParameterId",
                    new { ParameterId = parameterId }, transaction);

                // Delete all associated files
                await connection.ExecuteAsync(
                    "DELETE FROM worksheet_files WHERE parameter_id = @ParameterId",
                    new { ParameterId = parameterId }, transaction);

                var rowsAffected = await connection.ExecuteAsync(
                    "DELETE FROM worksheet_parameters WHERE id = @ParameterId",
                    new { ParameterId = parameterId }, transaction);

                if (rowsAffected == 0)
                    throw new InvalidOperationException($"Parameter with id {parameterId} not found.");

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
                    throw new InvalidOperationException(
                        $"Parameter with code {parameter.ParaCode} already exists in worksheet {worksheetId}");

                var parameterId = await InsertParameter(connection, transaction, worksheetId, parameter);

                await UpsertInstruments(connection, transaction, parameterId, parameter.InstrumentIds);
                await UpsertChemicals(connection, transaction, parameterId, parameter.ChemicalIds);
                await UpsertStandards(connection, transaction, parameterId, parameter.StandardIds);
                var prepLabelToId = await UpsertPreparations(connection, transaction, parameterId, parameter.Preparations);
                await UpsertCalculations(connection, transaction, parameterId, parameter.Calculations);
                await UpsertFiles(connection, transaction, parameterId, parameter.Files, worksheetId, prepLabelToId);

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

        // ─────────────────────────────────────────────────────────────────────────
        // FILE PUBLIC METHODS (standalone endpoints — no param save required)
        // ─────────────────────────────────────────────────────────────────────────

        /// <summary>
        /// Standalone upload — saves files for an existing parameter outside of a full save request.
        /// </summary>
        public async Task SaveFilesAsync(int parameterId, List<WorksheetFileDto> files)
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
                    throw new InvalidOperationException($"Parameter with id {parameterId} not found");

                await UpsertFiles(connection, transaction, parameterId, files, worksheetId);
                transaction.Commit();
            }
            catch
            {
                transaction.Rollback();
                throw;
            }
        }

        /// <summary>
        /// Returns file metadata (no binary) — use this for listing files in the UI.
        /// </summary>
        public async Task<List<WorksheetFileDto>> GetFilesMetaByParameterAsync(int parameterId)
        {
            using var connection = Createconnection();

            var rows = await connection.QueryAsync<WorksheetFileDto>(
                """
                SELECT
                    id                   AS Id,
                    parameter_id         AS ParameterId,
                    worksheet_id         AS WorksheetId,
                    preparation_type     AS PreparationType,
                    label                AS Label,
                    filename             AS FileName,
                    uploaded_at          AS UploadedAt
                FROM worksheet_files
                WHERE parameter_id = @ParameterId
                ORDER BY uploaded_at DESC
                """,
                new { ParameterId = parameterId });

            return rows.Select(r => new WorksheetFileDto
            {
                Id = r.Id,
                ParameterId = r.ParameterId,
                WorksheetId = r.WorksheetId,
                PreparationType = r.PreparationType,
                Label = r.Label,
                FileName = r.FileName,
                UploadedAt = r.UploadedAt
            }).ToList();
        }

        /// <summary>
        /// Returns a single file with its binary content as base64 — use for download/preview.
        /// </summary>
        public async Task<WorksheetFileDto?> GetFileByIdAsync(int fileId)
        {
            using var connection = Createconnection();

            var row = await connection.QueryFirstOrDefaultAsync<dynamic>(
                """
                SELECT
                    id                   AS Id,
                    parameter_id         AS ParameterId,
                    preparation_type     AS PreparationType,
                    label                AS Label,
                    filename             AS FileName,
                    filedata             AS FileData,
                    uploaded_at          AS UploadedAt
                FROM worksheet_files
                WHERE id = @FileId
                """,
                new { FileId = fileId });

            if (row == null) return null;

            return new WorksheetFileDto
            {
                Id = (int)row.Id,
                ParameterId = (int)row.ParameterId,
                PreparationType = (string?)row.PreparationType,
                Label = (string?)row.Label,
                FileName = (string)row.FileName,
                FileDataBase64 = row.FileData != null
                                        ? Convert.ToBase64String((byte[])row.FileData)
                                        : null,
                UploadedAt = row.UploadedAt?.ToString("dd-MM-yyyy HH:mm:ss")
            };
        }

        /// <summary>
        /// Deletes a single file record by its id.
        /// </summary>
        public async Task DeleteFileAsync(int fileId)
        {
            using var connection = Createconnection();
            await connection.ExecuteAsync(
                "DELETE FROM worksheet_files WHERE id = @FileId",
                new { FileId = fileId });
        }

        // ─────────────────────────────────────────────────────────────────────────
        // GET WORKSHEETS
        // ─────────────────────────────────────────────────────────────────────────

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
                    approved_at        AS ApprovedAt,
                    submitted_qa_by    AS SubmittedQaBy,
                    submitted_qa_at    AS SubmittedQaAt,
                    approved_by        AS ApprovedBy
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

            if (worksheet.SubmittedQaBy != null)
            {
                worksheet.SubmittedQaByName = await connection.QueryFirstOrDefaultAsync<string>(
                    "SELECT emp_name FROM participants_rawdata WHERE emp_id = @EmployeeId",
                    new { EmployeeId = worksheet.SubmittedQaBy });
            }

            if (worksheet.ApprovedBy != null)
            {
                worksheet.ApprovedByName = await connection.QueryFirstOrDefaultAsync<string>(
                    "SELECT emp_name FROM participants_rawdata WHERE emp_id = @EmployeeId",
                    new { EmployeeId = worksheet.ApprovedBy });
            }

            return await LoadWorksheetDetails(connection, worksheet, request);
        }

        public async Task<List<WorksheetSummaryDto>> GetAllWorksheetsAsync(FetchWorksheetsRequest request)
        {
            using var connection = Createconnection();
            string sql;

            if (request.Role == "QA")
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
                    WHERE status IN ('Submitted For QA Review', 'Approved')
                    ORDER BY created_at DESC";
            }
            else if (request.Role == "Reviewer")
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
                        var allReviewerApproved = statusList.All(s => s == "Approved");

                        worksheet.Status = allReviewerApproved
                            ? "Pending QA Submission"
                            : "Pending For Review";
                    }
                }
            }

            return worksheetList;
        }

        // ─────────────────────────────────────────────────────────────────────────
        // PRIVATE – INSERT / UPDATE PARAMETER
        // ─────────────────────────────────────────────────────────────────────────

        private async Task<int> InsertParameter(
            IDbConnection connection,
            IDbTransaction transaction,
            string worksheetId,
            ParameterDto param)
        {
            var sql = @"
                INSERT INTO worksheet_parameters 
                (worksheet_id, para_code, parameter_name, method_code, method_name, 
                 column_id, other_info, 
                 analyzed_by, approved_by_reviewer, analysis_start_date, analysis_completion_date,
                 approved_at_reviewer, status,
                 approved_by_qa, approved_at_qa, remarks_by_qa, remarks_by_reviewer, preparation_completed_by,
                 preparation_completed_at, remarks_by_analyst)
                VALUES 
                (@WorksheetId, @ParaCode, @ParameterName, @MethodCode, @MethodName, 
                 @ColumnId, @OtherInfo, @AnalyzedBy, @ApprovedByReviewer,
                 @AnalysisStartDate, @AnalysisCompletionDate, @ApprovedAtReviewer, @Status,
                 @ApprovedByQA, @ApprovedAtQA, @RemarksByQA, @RemarksByReviewer, @PreparationCompletedBy,
                 @PreparationCompletedAt, @RemarksByAnalyst);
                
                SELECT CAST(SCOPE_IDENTITY() as int);";

            return await connection.ExecuteScalarAsync<int>(
                sql,
                new
                {
                    WorksheetId = worksheetId,
                    param.ParaCode,
                    param.ParameterName,
                    param.MethodCode,
                    param.MethodName,
                    param.ColumnId,
                    param.OtherInfo,
                    param.AnalyzedBy,
                    param.ApprovedByReviewer,
                    AnalysisStartDate = ParseDateTime(param.AnalysisStartDate!),
                    AnalysisCompletionDate = ParseDateTime(param.AnalysisCompletionDate!),
                    ApprovedAtReviewer = ParseDateTime(param.ApprovedAtReviewer!),
                    param.Status,
                    param.ApprovedByQA,
                    ApprovedAtQA = ParseDateTime(param.ApprovedAtQA!),
                    param.RemarksByQA,
                    param.RemarksByReviewer,
                    param.PreparationCompletedBy,
                    param.PreparationCompletedAt,
                    param.RemarksByAnalyst
                },
                transaction);
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
                    other_info = @OtherInfo,
                    analyzed_by = @AnalyzedBy,
                    analysis_start_date = COALESCE(analysis_start_date, @AnalysisStartDate),
                    analysis_completion_date = COALESCE(analysis_completion_date, @AnalysisCompletionDate),
                    approved_by_reviewer = COALESCE(approved_by_reviewer, @ApprovedByReviewer),
                    approved_at_reviewer = COALESCE(approved_at_reviewer, @ApprovedAtReviewer),
                    status = @Status,
                    approved_by_qa = @ApprovedByQA,
                    approved_at_qa = @ApprovedAtQA,
                    remarks_by_qa = @RemarksByQA,
                    remarks_by_reviewer = @RemarksByReviewer,
                    preparation_completed_by = @PreparationCompletedBy,
                    preparation_completed_at = @PreparationCompletedAt,
                    remarks_by_analyst = @RemarksByAnalyst
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
                    param.OtherInfo,
                    param.AnalyzedBy,
                    param.ApprovedByReviewer,
                    AnalysisStartDate = ParseDateTime(param.AnalysisStartDate!),
                    AnalysisCompletionDate = ParseDateTime(param.AnalysisCompletionDate!),
                    ApprovedAtReviewer = ParseDateTime(param.ApprovedAtReviewer!),
                    param.Status,
                    param.ApprovedByQA,
                    ApprovedAtQA = ParseDateTime(param.ApprovedAtQA!),
                    param.RemarksByQA,
                    param.RemarksByReviewer,
                    param.PreparationCompletedBy,
                    param.PreparationCompletedAt,
                    param.RemarksByAnalyst
                },
                transaction);
        }

        // ─────────────────────────────────────────────────────────────────────────
        // PRIVATE – UPSERT CHILD TABLES (instruments, chemicals, standards)
        // ─────────────────────────────────────────────────────────────────────────

        private async Task UpsertInstruments(
            IDbConnection connection,
            IDbTransaction transaction,
            int parameterId,
            List<string> instrumentIds)
        {
            var existing = await connection.QueryAsync<string>(
                "SELECT instrument_id FROM worksheet_instruments WHERE parameter_id = @ParameterId",
                new { ParameterId = parameterId }, transaction);

            var existingSet = existing.ToHashSet();
            var newSet = (instrumentIds ?? new List<string>()).ToHashSet();

            var toDelete = existingSet.Except(newSet).ToList();
            if (toDelete.Any())
                await connection.ExecuteAsync(
                    "DELETE FROM worksheet_instruments WHERE parameter_id = @ParameterId AND instrument_id IN @Ids",
                    new { ParameterId = parameterId, Ids = toDelete }, transaction);

            foreach (var id in newSet.Except(existingSet))
                await connection.ExecuteAsync(
                    "INSERT INTO worksheet_instruments (parameter_id, instrument_id) VALUES (@ParameterId, @InstrumentId)",
                    new { ParameterId = parameterId, InstrumentId = id }, transaction);
        }

        private async Task UpsertChemicals(
            IDbConnection connection,
            IDbTransaction transaction,
            int parameterId,
            List<string> chemicalIds)
        {
            var existing = await connection.QueryAsync<string>(
                "SELECT chemical_id FROM worksheet_chemicals WHERE parameter_id = @ParameterId",
                new { ParameterId = parameterId }, transaction);

            var existingSet = existing.ToHashSet();
            var newSet = (chemicalIds ?? new List<string>()).ToHashSet();

            var toDelete = existingSet.Except(newSet).ToList();
            if (toDelete.Any())
                await connection.ExecuteAsync(
                    "DELETE FROM worksheet_chemicals WHERE parameter_id = @ParameterId AND chemical_id IN @Ids",
                    new { ParameterId = parameterId, Ids = toDelete }, transaction);

            foreach (var id in newSet.Except(existingSet))
                await connection.ExecuteAsync(
                    "INSERT INTO worksheet_chemicals (parameter_id, chemical_id) VALUES (@ParameterId, @ChemicalId)",
                    new { ParameterId = parameterId, ChemicalId = id }, transaction);
        }

        private async Task UpsertStandards(
            IDbConnection connection,
            IDbTransaction transaction,
            int parameterId,
            List<string> standardIds)
        {
            var existing = await connection.QueryAsync<string>(
                "SELECT standard_id FROM worksheet_standards WHERE parameter_id = @ParameterId",
                new { ParameterId = parameterId }, transaction);

            var existingSet = existing.ToHashSet();
            var newSet = (standardIds ?? new List<string>()).ToHashSet();

            var toDelete = existingSet.Except(newSet).ToList();
            if (toDelete.Any())
                await connection.ExecuteAsync(
                    "DELETE FROM worksheet_standards WHERE parameter_id = @ParameterId AND standard_id IN @Ids",
                    new { ParameterId = parameterId, Ids = toDelete }, transaction);

            foreach (var id in newSet.Except(existingSet))
                await connection.ExecuteAsync(
                    "INSERT INTO worksheet_standards (parameter_id, standard_id) VALUES (@ParameterId, @StandardId)",
                    new { ParameterId = parameterId, StandardId = id }, transaction);
        }

        // ─────────────────────────────────────────────────────────────────────────
        // PRIVATE – UPSERT PREPARATIONS
        // ─────────────────────────────────────────────────────────────────────────

        /// <summary>
        /// Upserts preparations and returns a dictionary of Label → preparation_id
        /// so that UpsertFiles can stamp preparation_id on each file.
        /// Files whose linked preparation is removed are also deleted here.
        /// </summary>
        private async Task<Dictionary<string, int>> UpsertPreparations(
            IDbConnection connection,
            IDbTransaction transaction,
            int parameterId,
            List<PreparationDto> preparations)
        {
            if (preparations == null)
                preparations = new List<PreparationDto>();

            var existing = await connection.QueryAsync<(int Id, string Label, string PreparationType, string PreparationCategory)>(
                @"SELECT id, label, preparation_type, preparation_category
                  FROM worksheet_preparations 
                  WHERE parameter_id = @ParameterId",
                new { ParameterId = parameterId }, transaction);

            var existingDict = existing.ToDictionary(
                x => $"{x.Label}_{x.PreparationType ?? ""}_{x.PreparationCategory}",
                x => x.Id);

            // Also keep a label→id map for every existing prep (used for file cascade)
            var existingLabelToId = existing.ToDictionary(x => x.Label, x => x.Id);

            var newKeys = preparations
                .Select(p => $"{p.Label}_{p.PreparationType ?? ""}_{p.PreparationCategory}")
                .ToHashSet();

            // Delete removed preparations — and cascade-delete their linked files
            var toDelete = existingDict.Keys.Except(newKeys).ToList();
            if (toDelete.Any())
            {
                var idsToDelete = toDelete.Select(key => existingDict[key]).ToList();

                // Cascade: delete files that belong to the removed preparations
                await connection.ExecuteAsync(
                    "DELETE FROM worksheet_files WHERE preparation_id IN @Ids",
                    new { Ids = idsToDelete }, transaction);

                await connection.ExecuteAsync(
                    "DELETE FROM worksheet_preparations WHERE id IN @Ids",
                    new { Ids = idsToDelete }, transaction);
            }

            // Insert or update, and build the label→id map for the caller
            var labelToId = new Dictionary<string, int>();

            foreach (var prep in preparations)
            {
                var key = $"{prep.Label}_{prep.PreparationType ?? ""}_{prep.PreparationCategory}";

                if (existingDict.TryGetValue(key, out var existingId))
                {
                    await connection.ExecuteAsync(
                        @"UPDATE worksheet_preparations 
                          SET assigned_standard_id = @AssignedStandardId,
                              steps = @Steps,
                              content = @Content,
                              preparation_type = @PreparationType,
                              preparation_category = @PreparationCategory
                          WHERE id = @Id",
                        new
                        {
                            Id = existingId,
                            prep.AssignedStandardId,
                            prep.Steps,
                            prep.Content,
                            prep.PreparationType,
                            prep.PreparationCategory
                        },
                        transaction);

                    labelToId[prep.Label] = existingId;
                }
                else
                {
                    var newId = await connection.ExecuteScalarAsync<int>(
                        @"INSERT INTO worksheet_preparations 
                          (parameter_id, preparation_category, preparation_type, label, assigned_standard_id, steps, content)
                          VALUES (@ParameterId, @PreparationCategory, @PreparationType, @Label, @AssignedStandardId, @Steps, @Content);
                          SELECT CAST(SCOPE_IDENTITY() AS int);",
                        new
                        {
                            ParameterId = parameterId,
                            prep.PreparationCategory,
                            prep.PreparationType,
                            prep.Label,
                            prep.AssignedStandardId,
                            prep.Steps,
                            prep.Content
                        },
                        transaction);

                    labelToId[prep.Label] = newId;
                }
            }

            return labelToId;
        }

        // ─────────────────────────────────────────────────────────────────────────
        // PRIVATE – UPSERT CALCULATIONS
        // ─────────────────────────────────────────────────────────────────────────

        private async Task UpsertCalculations(
            IDbConnection connection,
            IDbTransaction transaction,
            int parameterId,
            List<CalculationDto> calculations)
        {
            if (calculations == null)
                calculations = new List<CalculationDto>();

            var existing = await connection.QueryAsync<(int Id, string Label, string CalculationType)>(
                @"SELECT id, label, calculation_type 
                  FROM worksheet_calculations 
                  WHERE parameter_id = @ParameterId",
                new { ParameterId = parameterId }, transaction);

            var existingDict = existing.ToDictionary(
                x => $"{x.Label}_{x.CalculationType}",
                x => x.Id);

            var newKeys = calculations.Select(c => $"{c.Label}_{c.CalculationType}").ToHashSet();

            // Delete removed calculations
            var toDelete = existingDict.Keys.Except(newKeys).ToList();
            if (toDelete.Any())
            {
                var idsToDelete = toDelete.Select(key => existingDict[key]).ToList();
                await connection.ExecuteAsync(
                    "DELETE FROM worksheet_calculations WHERE id IN @Ids",
                    new { Ids = idsToDelete }, transaction);
            }

            // Insert or update
            foreach (var calc in calculations)
            {
                var key = $"{calc.Label}_{calc.CalculationType}";

                if (existingDict.TryGetValue(key, out var existingId))
                {
                    await connection.ExecuteAsync(
                        @"UPDATE worksheet_calculations 
                          SET calculation_data = @CalculationData
                          WHERE id = @Id",
                        new { Id = existingId, CalculationData = calc.Data },
                        transaction);
                }
                else
                {
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

        // ─────────────────────────────────────────────────────────────────────────
        // PRIVATE – UPSERT FILES  (same pattern as preparations & calculations)
        // ─────────────────────────────────────────────────────────────────────────

        private async Task UpsertFiles(
            IDbConnection connection,
            IDbTransaction transaction,
            int parameterId,
            List<WorksheetFileDto>? files,
            string worksheetId,
            Dictionary<string, int>? prepLabelToId = null)
        {
            if (files == null)
                files = new List<WorksheetFileDto>();

            prepLabelToId ??= new Dictionary<string, int>();

            // Load all existing file ids for this parameter
            var existing = await connection.QueryAsync<(int Id, string FileName, string? PreparationCategory, string? PreparationType, string? Label)>(
                """
                SELECT id, filename, preparation_type, label
                FROM worksheet_files
                WHERE parameter_id = @ParameterId
                """,
                new { ParameterId = parameterId },
                transaction);

            // Key: id — we match on Id when available (existing records), otherwise insert
            var existingIds = existing.Select(x => x.Id).ToHashSet();

            // Ids sent back from the frontend that still exist (no base64 means "keep as is")
            var incomingIds = files
                .Where(f => f.Id > 0)
                .Select(f => f.Id)
                .ToHashSet();

            // Delete records that were removed (existed before but NOT in incoming list)
            var toDeleteIds = existingIds.Except(incomingIds).ToList();
            if (toDeleteIds.Any())
            {
                await connection.ExecuteAsync(
                    "DELETE FROM worksheet_files WHERE id IN @Ids",
                    new { Ids = toDeleteIds },
                    transaction);
            }

            foreach (var file in files)
            {
                // Resolve preparation_id by matching file label against saved preparations
                int? preparationId = file.Label != null && prepLabelToId.TryGetValue(file.Label, out var pid)
                    ? pid
                    : (int?)null;

                if (file.Id > 0 && existingIds.Contains(file.Id))
                {
                    // ── UPDATE existing record ────────────────────────────────
                    if (file.FileDataBase64 != null)
                    {
                        // Frontend sent new binary — replace everything
                        await connection.ExecuteAsync(
                            """
                            UPDATE worksheet_files
                            SET
                                worksheet_id         = @WorksheetId,
                                preparation_type     = @PreparationType,
                                preparation_id       = @PreparationId,
                                label                = @Label,
                                filename             = @FileName,
                                filedata             = @FileData,
                                uploaded_at          = GETDATE()
                            WHERE id = @Id AND parameter_id = @ParameterId
                            """,
                            new
                            {
                                WorksheetId = worksheetId,
                                file.PreparationType,
                                PreparationId = preparationId,
                                file.Label,
                                file.FileName,
                                FileData = Convert.FromBase64String(file.FileDataBase64),
                                file.Id,
                                ParameterId = parameterId
                            },
                            transaction);
                    }
                    else
                    {
                        // No new binary — just update the metadata fields
                        await connection.ExecuteAsync(
                            """
                            UPDATE worksheet_files
                            SET
                                worksheet_id         = @WorksheetId,
                                preparation_type     = @PreparationType,
                                preparation_id       = @PreparationId,
                                label                = @Label,
                                filename             = @FileName
                            WHERE id = @Id AND parameter_id = @ParameterId
                            """,
                            new
                            {
                                WorksheetId = worksheetId,
                                file.PreparationType,
                                PreparationId = preparationId,
                                file.Label,
                                file.FileName,
                                file.Id,
                                ParameterId = parameterId
                            },
                            transaction);
                    }
                }
                else if (file.FileDataBase64 != null)
                {
                    // ── INSERT new record ─────────────────────────────────────
                    await connection.ExecuteAsync(
                        """
                        INSERT INTO worksheet_files
                            (parameter_id, worksheet_id, preparation_type, preparation_id, label, filename, filedata, uploaded_at)
                        VALUES
                            (@ParameterId, @WorksheetId, @PreparationType, @PreparationId, @Label, @FileName, @FileData, GETDATE())
                        """,
                        new
                        {
                            ParameterId = parameterId,
                            WorksheetId = worksheetId,
                            file.PreparationType,
                            PreparationId = preparationId,
                            file.Label,
                            file.FileName,
                            FileData = Convert.FromBase64String(file.FileDataBase64)
                        },
                        transaction);
                }
                // If Id == 0 and no base64 — skip (nothing to persist)
            }
        }

        // ─────────────────────────────────────────────────────────────────────────
        // PRIVATE – LOAD WORKSHEET DETAILS
        // ─────────────────────────────────────────────────────────────────────────

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

            if (request.Role.Contains("Reviewer") || request.Role.Contains("QA"))
            {
                parametersSql = @"
                    SELECT
                        id                         AS Id,
                        para_code                  AS ParaCode,
                        parameter_name             AS ParameterName,
                        method_code                AS MethodCode,
                        method_name                AS MethodName,
                        column_id                  AS ColumnId,
                        analysis_start_date        AS AnalysisStartDate,
                        analysis_completion_date   AS AnalysisCompletionDate,
                        analyzed_by                AS AnalyzedBy,
                        approved_by_reviewer       AS ApprovedByReviewer,
                        approved_at_reviewer       AS ApprovedAtReviewer,
                        other_info                 AS OtherInfo,
                        status                     AS Status,
                        approved_by_qa             AS ApprovedByQA,
                        approved_at_qa             AS ApprovedAtQA,
                        remarks_by_qa              AS RemarksByQA,
                        remarks_by_reviewer        AS RemarksByReviewer,
                        preparation_completed_by   AS PreparationCompletedBy,
                        preparation_completed_at   AS PreparationCompletedAt,
                        remarks_by_analyst         AS RemarksByAnalyst
                    FROM worksheet_parameters
                    WHERE worksheet_id = @WorksheetId";
            }
            else
            {
                parametersSql = @"
                    SELECT
                        id                         AS Id,
                        para_code                  AS ParaCode,
                        parameter_name             AS ParameterName,
                        method_code                AS MethodCode,
                        method_name                AS MethodName,
                        column_id                  AS ColumnId,
                        analysis_start_date        AS AnalysisStartDate,
                        analysis_completion_date   AS AnalysisCompletionDate,
                        analyzed_by                AS AnalyzedBy,
                        approved_by_reviewer       AS ApprovedByReviewer,
                        approved_at_reviewer       AS ApprovedAtReviewer,
                        other_info                 AS OtherInfo,
                        status                     AS Status,
                        approved_by_qa             AS ApprovedByQA,
                        approved_at_qa             AS ApprovedAtQA,
                        remarks_by_qa              AS RemarksByQA,
                        remarks_by_reviewer        AS RemarksByReviewer,
                        preparation_completed_by   AS PreparationCompletedBy,
                        preparation_completed_at   AS PreparationCompletedAt,
                        remarks_by_analyst         AS RemarksByAnalyst
                    FROM worksheet_parameters
                    WHERE worksheet_id = @WorksheetId AND analyzed_by = @EmployeeId";
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
                    OtherInfo = param.OtherInfo,
                    AnalysisStartDate = FormatDateTime(param.AnalysisStartDate),
                    AnalysisCompletionDate = FormatDateTime(param.AnalysisCompletionDate),
                    AnalyzedBy = param.AnalyzedBy,
                    ApprovedByReviewer = param.ApprovedByReviewer,
                    ApprovedAtReviewer = FormatDateTime(param.ApprovedAtReviewer),
                    Status = param.Status,
                    ApprovedByQA = param.ApprovedByQA,
                    ApprovedAtQA = FormatDateTime(param.ApprovedAtQA),
                    RemarksByQA = param.RemarksByQA,
                    RemarksByReviewer = param.RemarksByReviewer,
                    PreparationCompletedBy = param.PreparationCompletedBy,
                    PreparationCompletedAt = FormatDateTime(param.PreparationCompletedAt),
                    RemarksByAnalyst = param.RemarksByAnalyst,
                };

                if (param.ApprovedByReviewer != null)
                {
                    var query = """
                        SELECT emp_name AS [Username]
                        FROM participants_rawdata
                        WHERE emp_id = @EmployeeId
                    """;
                    paramDetail.ApprovedByReviewerName = await connection.QueryFirstAsync<string>(
                        query, new { EmployeeId = paramDetail.ApprovedByReviewer });
                }

                if (param.ApprovedByQA != null)
                {
                    paramDetail.ApprovedByQAName = await connection.QueryFirstOrDefaultAsync<string>(
                        "SELECT emp_name FROM participants_rawdata WHERE emp_id = @EmployeeId",
                        new { EmployeeId = paramDetail.ApprovedByQA });
                }

                if (param.AnalyzedBy != null)
                {
                    var query = """
                        SELECT emp_name AS [Username]
                        FROM participants_rawdata
                        WHERE emp_id = @EmployeeId
                    """;
                    paramDetail.AnalyzedByName = await connection.QueryFirstAsync<string>(
                        query, new { EmployeeId = paramDetail.AnalyzedBy });
                }

                if (param.PreparationCompletedBy != null)
                {
                    var query = """
                        SELECT emp_name AS [Username]
                        FROM participants_rawdata
                        WHERE emp_id = @EmployeeId
                    """;
                    paramDetail.PreparationCompletedByName = await connection.QueryFirstAsync<string>(
                        query, new { EmployeeId = paramDetail.PreparationCompletedBy });
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

                var preparations = await connection.QueryAsync<WorksheetPreparation>(
                    @"SELECT 
                        label                AS Label,
                        steps                AS Steps,
                        content              AS Content,
                        assigned_standard_id AS AssignedStandardId,
                        preparation_type     AS PreparationType,
                        preparation_category AS PreparationCategory
                    FROM worksheet_preparations WHERE parameter_id = @ParameterId",
                    new { ParameterId = param.Id });

                paramDetail.Preparations = preparations.Select(p => new PreparationDto
                {
                    Label = p.Label,
                    AssignedStandardId = p.AssignedStandardId,
                    Steps = p.Steps,
                    Content = p.Content,
                    PreparationType = p.PreparationType,
                    PreparationCategory = p.PreparationCategory
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

                // Fetch file metadata (no binary — frontend requests download separately)
                var files = await connection.QueryAsync<WorksheetFile>(
                    """
                    SELECT
                        id                   AS Id,
                        parameter_id         AS ParameterId,
                        worksheet_id         AS WorksheetId,
                        preparation_type     AS PreparationType,
                        label                AS Label,
                        filename             AS FileName,
                        fileData             AS FileData,
                        uploaded_at          AS UploadedAt
                    FROM worksheet_files
                    WHERE parameter_id = @ParameterId
                    ORDER BY uploaded_at DESC
                    """,
                    new { ParameterId = param.Id });

                paramDetail.Files = files.Select(f => new WorksheetFileDto
                {
                    Id = f.Id,
                    ParameterId = f.ParameterId,
                    WorksheetId = f.WorksheetId,
                    PreparationType = f.PreparationType,
                    Label = f.Label,
                    FileName = f.FileName,
                    FileDataBase64 = Convert.ToBase64String(f.FileData),
                    UploadedAt = FormatDateTime(f.UploadedAt)
                }).ToList();

                result.Parameters.Add(paramDetail);
            }

            return result;
        }

        // ─────────────────────────────────────────────────────────────────────────
        // PRIVATE – MAPPING HELPERS
        // ─────────────────────────────────────────────────────────────────────────

        private WorksheetDto MapToWorksheetDto(Worksheet worksheet)
        {
            return new WorksheetDto
            {
                WorksheetId = worksheet.WorksheetId,
                RegistrationNo = worksheet.RegistrationNo,
                SampleName = worksheet.SampleName,
                NumberOfParameters = worksheet.NumberOfParameters,
                DueDate = FormatDateTime(worksheet.DueDate, dateOnly: true),
                PreparedBy = worksheet.PreparedBy,
                PreparedByName = worksheet.PreparedByName,
                RevisionDate = FormatDateTime(worksheet.RevisionDate, dateOnly: true),
                Status = worksheet.Status,
                ApprovedAt = FormatDateTime(worksheet.ApprovedAt),
                CreatedAt = FormatDateTime(worksheet.CreatedAt, dateOnly: true),
                UpdatedAt = FormatDateTime(worksheet.UpdatedAt),
                SubmittedQaBy = worksheet.SubmittedQaBy,
                SubmittedQaByName = worksheet.SubmittedQaByName,
                SubmittedQaAt = FormatDateTime(worksheet.SubmittedQaAt),
                ApprovedBy = worksheet.ApprovedBy,
                ApprovedByName = worksheet.ApprovedByName,
            };
        }

        private DateTime? ParseDateTime(string dateTimeString)
        {
            if (string.IsNullOrWhiteSpace(dateTimeString))
                return null;

            dateTimeString = dateTimeString.Trim();

            string[] formats =
            {
                "dd/MM/yyyy",
                "dd-MM-yyyy",
                "yyyy-MM-dd",
                "MM/dd/yyyy",
                "yyyy/MM/dd",
                "dd.MM.yyyy",

                "dd/MM/yyyy HH:mm:ss",
                "dd-MM-yyyy HH:mm:ss",
                "yyyy-MM-dd HH:mm:ss",
                "MM/dd/yyyy HH:mm:ss",
                "yyyy/MM/dd HH:mm:ss",
                "dd.MM.yyyy HH:mm:ss",

                "dd/MM/yyyy HH:mm",
                "dd-MM-yyyy HH:mm",
                "yyyy-MM-dd HH:mm",
                "MM/dd/yyyy HH:mm",
                "yyyy/MM/dd HH:mm",
                "dd.MM.yyyy HH:mm",

                "dd/MM/yyyy hh:mm:ss tt",
                "dd-MM-yyyy hh:mm:ss tt",
                "yyyy-MM-dd hh:mm:ss tt",
                "MM/dd/yyyy hh:mm:ss tt",

                "dd/MM/yyyy hh:mm tt",
                "dd-MM-yyyy hh:mm tt",
                "yyyy-MM-dd hh:mm tt",
                "MM/dd/yyyy hh:mm tt",

                "yyyy-MM-ddTHH:mm:ss",
                "yyyy-MM-ddTHH:mm:ssZ",
                "yyyy-MM-ddTHH:mm:ss.fff",
                "yyyy-MM-ddTHH:mm:ss.fffZ"
            };

            foreach (var format in formats)
            {
                if (DateTime.TryParseExact(
                        dateTimeString,
                        format,
                        System.Globalization.CultureInfo.InvariantCulture,
                        System.Globalization.DateTimeStyles.None,
                        out DateTime result))
                {
                    return result;
                }
            }

            if (DateTime.TryParse(dateTimeString, out DateTime generalResult))
                return generalResult;

            return null;
        }

        private string FormatDateTime(DateTime? dateTime, bool dateOnly = false)
        {
            if (dateTime == null)
                return null;

            if (dateOnly)
                return dateTime.Value.ToString("dd-MM-yyyy");

            return dateTime.Value.TimeOfDay.TotalSeconds > 0
                ? dateTime.Value.ToString("dd-MM-yyyy HH:mm:ss")
                : dateTime.Value.ToString("dd-MM-yyyy");
        }
    }
}