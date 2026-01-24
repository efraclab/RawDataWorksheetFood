using RawDataWorkSheet.Models;
using RawDataWorkSheet.Repositories;

namespace RawDataWorkSheet.Services
{
    public class RawDataService : IRawDataService
    {

        private readonly IRawDataRepository _rawDataRepository;

        public RawDataService(IRawDataRepository rawDataRepository)
        {
            _rawDataRepository = rawDataRepository;
        }

        public async Task<IEnumerable<SampleDetails>> GetSampleDetailsByIdAsync(string regNo)
        {
            if (string.IsNullOrWhiteSpace(regNo))
                throw new ArgumentNullException(nameof(regNo));

            return await _rawDataRepository.GetSampleDetailsByIdAsync(regNo);
        }

        //public async Task<IEnumerable<Instruments>> GetInstrumentsAsync()
        //{
        //    return await _rawDataRepository.GetInstrumentsAsync();
        //}

        //public async Task<IEnumerable<Chemicals>> GetChemicalsAsync()
        //{
        //    return await _rawDataRepository.GetChemicalsAsync();
        //}

        //public async Task<IEnumerable<Standard>> GetStandardsAsync()
        //{
        //    return await _rawDataRepository.GetStandardsAsync();
        //}

        public async Task<IEnumerable<Columns>> GetCloumnsAsync()
        {
            return await _rawDataRepository.GetColumnsAsync();
        }
    }
}
