using RawDataWorkSheet.Models;

namespace RawDataWorkSheet.Repositories
{
    public interface IRawDataRepository
    {
        Task<IEnumerable<Chemicals>> GetChemicalsAsync();
        Task<IEnumerable<Instruments>> GetInstrumentsAsync();
        Task<IEnumerable<SampleDetails>> GetSampleDetailsByIdAsync(string regNo);
        Task<IEnumerable<Standard>> GetStandardsAsync();
        Task<IEnumerable<Columns>> GetColumnsAsync();
    }
}