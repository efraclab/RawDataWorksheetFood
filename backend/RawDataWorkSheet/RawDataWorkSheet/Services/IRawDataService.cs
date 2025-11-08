using RawDataWorkSheet.Models;

namespace RawDataWorkSheet.Services
{
    public interface IRawDataService
    {
        Task<IEnumerable<Chemicals>> GetChemicalsAsync();
        Task<IEnumerable<Instruments>> GetInstrumentsAsync();
        Task<IEnumerable<SampleDetails>> GetSampleDetailsByIdAsync(string regNo);
        Task<IEnumerable<Standard>> GetStandardsAsync();
        Task<IEnumerable<Columns>> GetCloumnsAsync();
    }
}