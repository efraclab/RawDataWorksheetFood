using Dapper;
using Microsoft.Data.SqlClient;
using RawDataWorkSheet.Models.DTOs;
using RawDataWorkSheet.Models.Requests;
using System.Data;

namespace RawDataWorkSheet.Repositories
{
    public class LogRepository : ILogRepository
    {
        private readonly string _connectionString;

        public LogRepository(IConfiguration configuration)
        {
            _connectionString = configuration["Connnectionstrings:Connection1"]!;
        }

        private IDbConnection CreateConnection() => new SqlConnection(_connectionString);

        public async Task InsertLogAsync(WorksheetLogRequest request)
        {
            const string sql = """
                INSERT INTO worksheet_logs (
                    worksheet_id,
                    parameter_id,
                    [timestamp],
                    remarks,
                    action,
                    employee_id,
                    role,
                    reference_type,
                    reference_id
                )
                VALUES (
                    @WorksheetId,
                    @ParameterId,
                    SYSDATETIME(),
                    @Remarks,
                    @Action,
                    @EmployeeId,
                    @Role,
                    @ReferenceType,
                    @ReferenceId
                )
                """;

            using var conn = CreateConnection();
            await conn.ExecuteAsync(sql, new
            {
                request.WorksheetId,
                request.ParameterId,
                request.Remarks,
                request.Action,
                request.EmployeeId,
                request.Role,
                request.ReferenceType,
                request.ReferenceId
            });
        }

        public async Task<IEnumerable<WorksheetLogDto>> GetByWorksheetIdAsync(string worksheetId)
        {
            const string sql = """
                SELECT
                    l.id                AS Id,
                    l.worksheet_id      AS WorksheetId,
                    l.[timestamp]       AS Timestamp,
                    l.remarks           AS Remarks,
                    l.action            AS Action,
                    l.employee_id       AS EmployeeId,
                    l.role              AS Role,
                    l.reference_type    AS ReferenceType,
                    l.reference_id      AS ReferenceId,
                    p.emp_name          AS EmployeeName,
                    wp.parameter_name   AS ParameterName,
                    wp.para_code        AS ParameterCode
                FROM worksheet_logs l
                LEFT JOIN participants_rawdata p
                    ON p.emp_id = l.employee_id
                LEFT JOIN worksheet_parameters wp
                    ON wp.id = l.parameter_id
                WHERE l.worksheet_id = @WorksheetId
                ORDER BY l.[timestamp] ASC
                """;

            using var conn = CreateConnection();
            return await conn.QueryAsync<WorksheetLogDto>(sql, new { WorksheetId = worksheetId });
        }
    }
}
