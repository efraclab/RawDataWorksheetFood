using Dapper;
using Microsoft.Data.SqlClient;
using RawDataWorkSheet.Models.References;
using System.Data;

namespace RawDataWorkSheet.Repositories
{
    public class StandardRepository : IStandardRepository
    {
        private readonly string _connectionString;

        public StandardRepository(IConfiguration configuration)
        {
            _connectionString = configuration["Connnectionstrings:Connection1"];
        }

        private IDbConnection CreateConnection()
            => new SqlConnection(_connectionString);

        public async Task<IEnumerable<StandardMaster>> GetAllAsync()
        {
            using var conn = CreateConnection();
            return await conn.QueryAsync<StandardMaster>(
                "SELECT * FROM STANDARDMASTER");
        }

        public async Task AddAsync(StandardMaster request)
        {
            const string sql = @"
                INSERT INTO STANDARDMASTER
                VALUES (@SerialNo,@Name,@BatchNo,@Make,@Purity,
                        @Department,@Pack,@UnitCode,@Unit,
                        @Validity,@Remarks)";
            using var conn = CreateConnection();
            await conn.ExecuteAsync(sql, request);
        }

        public async Task UpdateAsync(StandardMaster request)
        {
            const string sql = @"
                UPDATE STANDARDMASTER SET
                    Name=@Name,
                    BatchNo=@BatchNo,
                    Make=@Make,
                    Purity=@Purity,
                    Department=@Department,
                    Pack=@Pack,
                    UnitCode=@UnitCode,
                    Unit=@Unit,
                    Validity=@Validity,
                    Remarks=@Remarks
                WHERE SerialNo=@SerialNo";
            using var conn = CreateConnection();
            await conn.ExecuteAsync(sql, request);
        }

        public async Task DeleteAsync(string serialNo)
        {
            using var conn = CreateConnection();
            await conn.ExecuteAsync(
                "DELETE FROM STANDARDMASTER WHERE SerialNo=@SerialNo",
                new { SerialNo = serialNo });
        }
    }
}
