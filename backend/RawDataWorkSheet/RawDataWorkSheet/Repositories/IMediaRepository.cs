using RawDataWorkSheet.Models.References;

namespace RawDataWorkSheet.Repositories
{
    public interface IMediaRepository
    {
        Task<IEnumerable<MediaMaster>> GetAllAsync();
    }
}