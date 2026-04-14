using RawDataWorkSheet.Models.References;

namespace RawDataWorkSheet.Services
{
    public interface IMediaService
    {
        Task<IEnumerable<MediaMaster>> GetAllAsync();
    }
}