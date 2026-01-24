using RawDataWorkSheet.Models.References;
using RawDataWorkSheet.Repositories;

namespace RawDataWorkSheet.Services
{
    public class InstrumentService : IInstrumentService
    {
        private readonly IInstrumentRepository _repo;

        public InstrumentService(IInstrumentRepository repo)
        {
            _repo = repo;
        }

        public Task<IEnumerable<InstrumentMaster>> GetAllAsync()
            => _repo.GetAllAsync();

        public Task AddAsync(InstrumentMaster request)
            => _repo.AddAsync(request);

        public Task UpdateAsync(InstrumentMaster request)
            => _repo.UpdateAsync(request);

        public Task DeleteAsync(string id)
            => _repo.DeleteAsync(id);
    }

}
