using Dapper;
using Microsoft.Data.SqlClient;
using RawDataWorkSheet.Models.References;
using System.Data;

namespace RawDataWorkSheet.Repositories
{
    public class MediaRepository : IMediaRepository
    {
        private readonly string _connectionString;

        public MediaRepository(IConfiguration configuration)
        {
            _connectionString = configuration["Connnectionstrings:Connection1"];
        }

        private IDbConnection CreateConnection()
            => new SqlConnection(_connectionString);

        public async Task<IEnumerable<MediaMaster>> GetAllAsync()
        {
            using var conn = CreateConnection();
            return await conn.QueryAsync<MediaMaster>("SELECT * FROM MediaMaster");
        }

        public async Task AddAsync(MediaMaster request)
        {
            const string sql = @"
                INSERT INTO MediaMaster (Name, Code, ExpDate, QuantityValue, QuantityUnit)
                VALUES (@Name, @Code, @ExpDate, @QuantityValue, @QuantityUnit)";
            using var conn = CreateConnection();
            await conn.ExecuteAsync(sql, request);
        }

        public async Task UpdateAsync(MediaMaster request)
        {
            const string sql = @"
                UPDATE MediaMaster SET
                    Name         = @Name,
                    Code         = @Code,
                    ExpDate      = @ExpDate,
                    QuantityValue = @QuantityValue,
                    QuantityUnit = @QuantityUnit
                WHERE Id = @Id";
            using var conn = CreateConnection();
            await conn.ExecuteAsync(sql, request);
        }

        public async Task DeleteAsync(int id)
        {
            using var conn = CreateConnection();
            await conn.ExecuteAsync(
                "DELETE FROM MediaMaster WHERE Id = @Id",
                new { Id = id });
        }
    }
}
