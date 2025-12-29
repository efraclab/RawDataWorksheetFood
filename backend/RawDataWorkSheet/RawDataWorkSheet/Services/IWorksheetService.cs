using RawDataWorkSheet.Models;
using RawDataWorkSheet.Models.DTOs;
using RawDataWorkSheet.Models.Requests;

namespace RawDataWorkSheet.Services
{
    public interface IWorksheetService
    {
        Task<string> CreateWorksheetAsync(SaveWorksheetRequest request);
        Task DeleteParameterAsync(int parameterId);
        Task DeleteWorksheetAsync(string worksheetId);
        Task<IEnumerable<WorksheetSummaryDto>> GetAllWorksheetsAsync(FetchWorksheetsRequest request);
        Task<WorksheetDetailDto> GetWorksheetByIdAsync(string worksheetId, FetchWorksheetsRequest request);
        Task<int> UpdateParameterAsync(int parameterId, ParameterDto request);
        Task<string> UpdateWorksheetAsync(SaveWorksheetRequest request);
    }
}