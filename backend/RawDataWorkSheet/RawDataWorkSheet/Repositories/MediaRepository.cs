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
            _connectionString = configuration["Connnectionstrings:Connection2"];
        }

        private IDbConnection CreateConnection()
            => new SqlConnection(_connectionString);

        public async Task<IEnumerable<MediaMaster>> GetAllAsync()
        {
            using var conn = CreateConnection();
            return await conn.QueryAsync<MediaMaster>(
                @"SELECT 
                    id AS Id,
                    media_name AS Name,
                    lot_no AS LotNo,
                    exp_date AS ExpDate
                FROM temp_media");
        }
    }
}
