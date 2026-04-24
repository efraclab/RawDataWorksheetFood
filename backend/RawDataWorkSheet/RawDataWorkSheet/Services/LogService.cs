using RawDataWorkSheet.Models.DTOs;
using RawDataWorkSheet.Models.Requests;
using RawDataWorkSheet.Repositories;

namespace RawDataWorkSheet.Services
{
    public class LogService : ILogService
    {
        private readonly ILogRepository _repo;

        public LogService(ILogRepository repo)
        {
            _repo = repo;
        }

        public Task InsertLogAsync(WorksheetLogRequest request)
            => _repo.InsertLogAsync(request);

        public Task<IEnumerable<WorksheetLogDto>> GetByWorksheetIdAsync(string worksheetId)
            => _repo.GetByWorksheetIdAsync(worksheetId);
    }
}
