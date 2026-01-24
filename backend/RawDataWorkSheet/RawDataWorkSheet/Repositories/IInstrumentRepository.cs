using RawDataWorkSheet.Models.References;

namespace RawDataWorkSheet.Repositories
{
    public interface IInstrumentRepository
    {
        Task AddAsync(InstrumentMaster request);
        Task DeleteAsync(string id);
        Task<IEnumerable<InstrumentMaster>> GetAllAsync();
        Task UpdateAsync(InstrumentMaster request);
    }
}