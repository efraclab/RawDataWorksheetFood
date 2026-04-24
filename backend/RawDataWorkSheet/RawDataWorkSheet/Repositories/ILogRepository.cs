using RawDataWorkSheet.Models.DTOs;
using RawDataWorkSheet.Models.Requests;
using RawDataWorkSheet.Models.Worksheets;

namespace RawDataWorkSheet.Repositories
{
    public interface ILogRepository
    {
        Task InsertLogAsync(WorksheetLogRequest request);
        Task<IEnumerable<WorksheetLogDto>> GetByWorksheetIdAsync(string worksheetId);
    }
}
