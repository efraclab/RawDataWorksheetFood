using RawDataWorkSheet.Models;
using RawDataWorkSheet.Models.Requests;

namespace RawDataWorkSheet.Repositories
{
    public interface IRawDataRepository
    {
        Task<IEnumerable<SampleDetails>> GetSampleDetailsByIdAsync(SampleDetailsRequest request);
        //Task<IEnumerable<Columns>> GetColumnsAsync();
    }
}