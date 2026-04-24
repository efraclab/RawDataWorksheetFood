using RawDataWorkSheet.Models.References;

namespace RawDataWorkSheet.Repositories
{
    public interface IMediaRepository
    {
        Task<IEnumerable<MediaMaster>> GetAllAsync();
        Task AddAsync(MediaMaster request);
        Task UpdateAsync(MediaMaster request);
        Task DeleteAsync(int id);
    }
}
