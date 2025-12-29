using RawDataWorkSheet.Models;
using RawDataWorkSheet.Models.DTOs;
using RawDataWorkSheet.Models.Requests;

namespace RawDataWorkSheet.Repositories
{
    public interface IWorksheetRepository
    {
        Task CreateWorksheetAsync(SaveWorksheetRequest request);
        Task DeleteParameterAsync(int parameterId);
        Task DeleteWorksheetAsync(string worksheetId);
        Task<bool> ExistsParameterAsync(int parameterId);
        Task<bool> ExistsWorksheetAsync(string worksheetId);
        Task<List<WorksheetSummaryDto>> GetAllWorksheetsAsync(FetchWorksheetsRequest request);
        Task<WorksheetDetailDto> GetWorksheetByIdAsync(string worksheetId, FetchWorksheetsRequest request);
        Task UpdateParameterAsync(int parameterId, ParameterDto request);
        Task UpdateWorksheetAsync(SaveWorksheetRequest request);
    }
}