using RawDataWorkSheet.Models.Requests;
using RawDataWorkSheet.Repositories;

namespace RawDataWorkSheet.Services
{

    public class WorksheetService : IWorksheetService
    {
        private readonly IWorksheetRepository _repo;

        public WorksheetService(IWorksheetRepository repo)
        {
            _repo = repo;
        }

        public async Task<string> CreateAsync(SaveWorksheetRequest request)
        {
            if (await _repo.ExistsAsync(request.WorksheetId))
                throw new InvalidOperationException("Worksheet already exists.");

            await _repo.CreateAsync(request);
            return request.WorksheetId;
        }

        public async Task<string> UpdateAsync(SaveWorksheetRequest request)
        {
            if (!await _repo.ExistsAsync(request.WorksheetId))
                throw new KeyNotFoundException("Worksheet not found.");

            await _repo.UpdateAsync(request);
            return request.WorksheetId;
        }

        public async Task DeleteAsync(string worksheetId)
        {
            if (!await _repo.ExistsAsync(worksheetId))
                throw new KeyNotFoundException("Worksheet not found.");

            await _repo.DeleteAsync(worksheetId);
        }

        public async Task<object> GetAsync(string worksheetId)
        {
            return await _repo.GetByWorksheetIdAsync(worksheetId)
                   ?? throw new KeyNotFoundException("Worksheet not found.");
        }

        public async Task<List<object>> GetAllAsync(string? status)
        {
            return (await _repo.GetAllAsync(status)).Cast<object>().ToList();
        }
    }
}
