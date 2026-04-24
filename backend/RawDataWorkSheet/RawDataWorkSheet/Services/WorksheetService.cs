using RawDataWorkSheet.Models;
using RawDataWorkSheet.Models.DTOs;
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

        public async Task<string> CreateWorksheetAsync(SaveWorksheetRequest request)
        {
            if (await _repo.ExistsWorksheetAsync(request.WorksheetId))
                throw new InvalidOperationException("Worksheet already exists.");

            await _repo.CreateWorksheetAsync(request);
            return request.WorksheetId;
        }

        public async Task<int> AddParameterAsync(string worksheetId, ParameterDto request)
        {
            if (!await _repo.ExistsWorksheetAsync(worksheetId))
                throw new InvalidOperationException("Worksheet not exists.");

            return await _repo.AddParameterAsync(worksheetId, request);
        }

        public async Task<string> UpdateWorksheetAsync(SaveWorksheetRequest request)
        {
            if (!await _repo.ExistsWorksheetAsync(request.WorksheetId))
                throw new KeyNotFoundException("Worksheet not found.");

            await _repo.UpdateWorksheetAsync(request);
            return request.WorksheetId;
        }

        public async Task<int> UpdateParameterAsync(int parameterId, ParameterDto request)
        {
            await _repo.UpdateParameterAsync(parameterId, request);
            return parameterId;
        }

        public async Task DeleteParameterAsync(int parameterId)
        {
            if (!await _repo.ExistsParameterAsync(parameterId))
                throw new KeyNotFoundException("Parameter not found.");

            await _repo.DeleteParameterAsync(parameterId);
        }

        public async Task DeleteWorksheetAsync(string worksheetId)
        {
            if (!await _repo.ExistsWorksheetAsync(worksheetId))
                throw new KeyNotFoundException("Worksheet not found.");

            await _repo.DeleteWorksheetAsync(worksheetId);
        }

        public async Task<WorksheetDetailDto> GetWorksheetByIdAsync(string worksheetId, FetchWorksheetsRequest request)
        {
            return await _repo.GetWorksheetByIdAsync(worksheetId, request)
                   ?? throw new KeyNotFoundException("Worksheet not found.");
        }

        public async Task<IEnumerable<WorksheetSummaryDto>> GetAllWorksheetsAsync(FetchWorksheetsRequest request)
        {
            return await _repo.GetAllWorksheetsAsync(request);
        }



    }
}