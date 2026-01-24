using Azure.Core;
using Dapper;
using Microsoft.Data.SqlClient;
using RawDataWorkSheet.Models;

namespace RawDataWorkSheet.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly string _connectionString;

        public UserRepository(IConfiguration configuration)
        {
            _connectionString = configuration["Connnectionstrings:Connection2"];
        }

        public async Task<User?> GetUserAsync(string employeeId)
        {
            const string query = @"
                SELECT 
                    emp_name AS [Username], 
                    password AS [Password], 
                    emp_id AS [EmployeeId], 
                    department AS [Department],
                    role AS [Role]
                FROM participants_rawdata
                WHERE emp_id = @EmployeeId;
            ";

            using (var connection = new SqlConnection(_connectionString))
            {


                return await connection.QueryFirstOrDefaultAsync<User>(query,
                new { EmployeeId = employeeId });
            }
        }

        public async Task<IEnumerable<User?>> GetAnalystsAsync()
        {
            const string query = @"
                SELECT 
                    emp_name AS [Username], 
                    password AS [Password], 
                    emp_id AS [EmployeeId], 
                    department AS [Department],
                    role AS [Role]
                FROM participants_rawdata
                WHERE role = 'Analyst';
            ";

            using (var connection = new SqlConnection(_connectionString))
            {


                return await connection.QueryAsync<User>(query);
            }
        }
    }
}
