using RawDataWorkSheet.Models.FinalRawData;

namespace RawDataWorkSheet.Services
{
    public interface IFinalRawDataService
    {
        Task SaveRawDataAsync(SaveWorksheetRawDataRequest request);
    }
}