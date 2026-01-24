using RawDataWorkSheet.Models.References;

namespace RawDataWorkSheet.Services
{
    public interface IChemicalService
    {
        Task AddAsync(ChemicalMaster request);
        Task DeleteAsync(string slNo);
        Task<IEnumerable<ChemicalMaster>> GetAllAsync();
        Task UpdateAsync(ChemicalMaster request);
    }
}