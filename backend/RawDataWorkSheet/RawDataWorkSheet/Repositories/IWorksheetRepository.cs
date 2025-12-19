using RawDataWorkSheet.Models.DTOs;
using RawDataWorkSheet.Models.Requests;

namespace RawDataWorkSheet.Repositories
{
    public interface IWorksheetRepository
    {
        Task<bool> ExistsAsync(string worksheetId);
        Task CreateAsync(SaveWorksheetRequest request);
        Task UpdateAsync(SaveWorksheetRequest request);
        Task DeleteAsync(string worksheetId);
        Task<WorksheetDetailDto?> GetByWorksheetIdAsync(string worksheetId);
        Task<List<WorksheetSummaryDto>> GetAllAsync(string? status);
    }
}
