using RawDataWorkSheet.Models;

namespace RawDataWorkSheet.Repositories
{
    public interface IRawDataRepository
    {
        Task<IEnumerable<SampleDetails>> GetSampleDetailsByIdAsync(string regNo);
        Task<IEnumerable<Columns>> GetColumnsAsync();
    }
}