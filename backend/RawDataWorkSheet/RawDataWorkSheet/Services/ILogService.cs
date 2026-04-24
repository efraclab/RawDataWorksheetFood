using RawDataWorkSheet.Models.DTOs;
using RawDataWorkSheet.Models.Requests;

namespace RawDataWorkSheet.Services
{
    public interface ILogService
    {
        Task InsertLogAsync(WorksheetLogRequest request);
        Task<IEnumerable<WorksheetLogDto>> GetByWorksheetIdAsync(string worksheetId);
    }
}
