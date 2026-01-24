using RawDataWorkSheet.Models.References;

namespace RawDataWorkSheet.Repositories
{
    public interface IChemicalRepository
    {
        Task AddAsync(ChemicalMaster request);
        Task DeleteAsync(string slNo);
        Task<IEnumerable<ChemicalMaster>> GetAllAsync();
        Task UpdateAsync(ChemicalMaster request);
    }
}