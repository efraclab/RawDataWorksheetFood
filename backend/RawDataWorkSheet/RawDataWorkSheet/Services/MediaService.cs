using RawDataWorkSheet.Models.References;
using RawDataWorkSheet.Repositories;

namespace RawDataWorkSheet.Services
{
    public class MediaService : IMediaService
    {

        private readonly IMediaRepository _repo;

        public MediaService(IMediaRepository repo)
        {
            _repo = repo;
        }

        public Task<IEnumerable<MediaMaster>> GetAllAsync()
            => _repo.GetAllAsync();
    }
}
