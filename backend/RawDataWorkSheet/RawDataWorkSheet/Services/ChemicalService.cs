using RawDataWorkSheet.Models.References;
using RawDataWorkSheet.Repositories;

namespace RawDataWorkSheet.Services
{
    public class ChemicalService : IChemicalService
    {
        private readonly IChemicalRepository _repo;

        public ChemicalService(IChemicalRepository repo)
        {
            _repo = repo;
        }

        public Task<IEnumerable<ChemicalMaster>> GetAllAsync()
            => _repo.GetAllAsync();

        public Task AddAsync(ChemicalMaster request)
            => _repo.AddAsync(request);

        public Task UpdateAsync(ChemicalMaster request)
            => _repo.UpdateAsync(request);

        public Task DeleteAsync(string slNo)
            => _repo.DeleteAsync(slNo);
    }

}
