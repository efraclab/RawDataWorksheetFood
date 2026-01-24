using Dapper;
using Microsoft.Data.SqlClient;
using RawDataWorkSheet.Models.References;
using System.Data;

namespace RawDataWorkSheet.Repositories
{
    public class InstrumentRepository : IInstrumentRepository
    {
        private readonly string _connectionString;

        public InstrumentRepository(IConfiguration configuration)
        {
            _connectionString = configuration["Connnectionstrings:Connection1"];
        }

        private IDbConnection CreateConnection()
            => new SqlConnection(_connectionString);

        public async Task<IEnumerable<InstrumentMaster>> GetAllAsync()
        {
            using var conn = CreateConnection();
            return await conn.QueryAsync<InstrumentMaster>(
                "SELECT * FROM INSTRUMENTMASTER");
        }

        public async Task AddAsync(InstrumentMaster request)
        {
            const string sql = @"
                INSERT INTO INSTRUMENTMASTER
                VALUES (@ID,@Name,@Sl_No,@Make,@InstrumentTag,
                        @PurchaseDate,@LabName,@Warrenty_UOTO,
                        @AMC_UPTO,@CMC_UPTO,
                        @CalibrationDoneDate,@CalibrationDueDate,
                        @CalibrationAgency)";
            using var conn = CreateConnection();
            await conn.ExecuteAsync(sql, request);
        }

        public async Task UpdateAsync(InstrumentMaster request)
        {
            const string sql = @"
                UPDATE INSTRUMENTMASTER SET
                    Name=@Name,
                    Sl_No=@Sl_No,
                    Make=@Make,
                    InstrumentTag=@InstrumentTag,
                    PurchaseDate=@PurchaseDate,
                    LabName=@LabName,
                    Warrenty_UOTO=@Warrenty_UOTO,
                    AMC_UPTO=@AMC_UPTO,
                    CMC_UPTO=@CMC_UPTO,
                    CalibrationDoneDate=@CalibrationDoneDate,
                    CalibrationDueDate=@CalibrationDueDate,
                    CalibrationAgency=@CalibrationAgency
                WHERE ID=@ID";
            using var conn = CreateConnection();
            await conn.ExecuteAsync(sql, request);
        }

        public async Task DeleteAsync(string id)
        {
            using var conn = CreateConnection();
            await conn.ExecuteAsync(
                "DELETE FROM INSTRUMENTMASTER WHERE ID=@ID",
                new { ID = id });
        }
    }
}
