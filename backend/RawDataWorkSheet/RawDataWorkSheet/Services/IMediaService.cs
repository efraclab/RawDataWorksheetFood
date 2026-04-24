using RawDataWorkSheet.Models.References;

namespace RawDataWorkSheet.Services
{
    public interface IMediaService
    {
        Task<IEnumerable<MediaMaster>> GetAllAsync();
        Task AddAsync(MediaMaster request);
        Task UpdateAsync(MediaMaster request);
        Task DeleteAsync(int id);
    }
}
