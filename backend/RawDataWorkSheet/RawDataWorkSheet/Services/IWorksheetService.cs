using RawDataWorkSheet.Models.Requests;

namespace RawDataWorkSheet.Services
{
    public interface IWorksheetService
    {
        Task<string> CreateAsync(SaveWorksheetRequest request);
        Task<string> UpdateAsync(SaveWorksheetRequest request);
        Task DeleteAsync(string worksheetId);
        Task<object> GetAsync(string worksheetId);
        Task<List<object>> GetAllAsync(string? status);
    }
}
