using Dapper;
using Microsoft.Data.SqlClient;
using RawDataWorkSheet.Models.References;
using System.Data;

namespace RawDataWorkSheet.Repositories
{
    public class ChemicalRepository : IChemicalRepository
    {
        private readonly string _connectionString;

        public ChemicalRepository(IConfiguration configuration)
        {
            _connectionString = configuration["Connnectionstrings:Connection1"];
        }

        private IDbConnection CreateConnection()
            => new SqlConnection(_connectionString);

        public async Task<IEnumerable<ChemicalMaster>> GetAllAsync()
        {
            using var conn = CreateConnection();
            return await conn.QueryAsync<ChemicalMaster>(
                "SELECT * FROM CHEMICALMASTER");
        }

        public async Task AddAsync(ChemicalMaster request)
        {
            const string sql = @"
                INSERT INTO CHEMICALMASTER
                VALUES (@SLNO,@Name,@Code,@Make,@Part_No,@Exp_Date,
                        @BatchNo,@Modular_Height,@Cas_No,
                        @Manufacturer_Date,@PackQuantity,@PackUnit)";
            using var conn = CreateConnection();
            await conn.ExecuteAsync(sql, request);
        }

        public async Task UpdateAsync(ChemicalMaster request)
        {
            const string sql = @"
                UPDATE CHEMICALMASTER SET
                    Name=@Name,
                    Make=@Make,
                    Part_No=@Part_No,
                    Exp_Date=@Exp_Date,
                    BatchNo=@BatchNo,
                    Modular_Height=@Modular_Height,
                    Cas_No=@Cas_No,
                    Manufacturer_Date=@Manufacturer_Date,
                    PackQuantity=@PackQuantity,
                    PackUnit=@PackUnit
                WHERE Code=@Code";
            using var conn = CreateConnection();
            await conn.ExecuteAsync(sql, request);
        }

        public async Task DeleteAsync(string slNo)
        {
            using var conn = CreateConnection();
            await conn.ExecuteAsync(
                "DELETE FROM CHEMICALMASTER WHERE SLNO=@SLNo",
                new { SLNo = slNo });
        }
    }
}
