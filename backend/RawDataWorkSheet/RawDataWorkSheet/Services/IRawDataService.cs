using RawDataWorkSheet.Models;
using RawDataWorkSheet.Models.Requests;

namespace RawDataWorkSheet.Services
{
    public interface IRawDataService
    {
        //Task<IEnumerable<Chemicals>> GetChemicalsAsync();
        //Task<IEnumerable<Instruments>> GetInstrumentsAsync();
        Task<IEnumerable<SampleDetails>> GetSampleDetailsByIdAsync(SampleDetailsRequest request);
        //Task<IEnumerable<Standard>> GetStandardsAsync();
        Task<IEnumerable<Columns>> GetCloumnsAsync();
    }
}