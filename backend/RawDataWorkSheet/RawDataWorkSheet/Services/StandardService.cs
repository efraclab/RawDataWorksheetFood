using RawDataWorkSheet.Models.References;
using RawDataWorkSheet.Repositories;

namespace RawDataWorkSheet.Services
{
    public class StandardService : IStandardService
    {
        private readonly IStandardRepository _repo;

        public StandardService(IStandardRepository repo)
        {
            _repo = repo;
        }

        public Task<IEnumerable<StandardMaster>> GetAllAsync()
            => _repo.GetAllAsync();

        public Task AddAsync(StandardMaster request)
            => _repo.AddAsync(request);

        public Task UpdateAsync(StandardMaster request)
            => _repo.UpdateAsync(request);

        public Task DeleteAsync(string serialNo)
            => _repo.DeleteAsync(serialNo);
    }

}
