using RawDataWorkSheet.Models.References;

namespace RawDataWorkSheet.Services
{
    public interface IStandardService
    {
        Task AddAsync(StandardMaster request);
        Task DeleteAsync(string serialNo);
        Task<IEnumerable<StandardMaster>> GetAllAsync();
        Task UpdateAsync(StandardMaster request);
    }
}