using RawDataWorkSheet.Models.References;

namespace RawDataWorkSheet.Repositories
{
    public interface IStandardRepository
    {
        Task AddAsync(StandardMaster request);
        Task DeleteAsync(string serialNo);
        Task<IEnumerable<StandardMaster>> GetAllAsync();
        Task UpdateAsync(StandardMaster request);
    }
}