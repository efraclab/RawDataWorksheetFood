using RawDataWorkSheet.Models.DTOs;

namespace RawDataWorkSheet.Models.Responses
{
    public class WorksheetListResponse
    {
        public bool Success { get; set; }
        public string Message { get; set; }
        public List<WorksheetSummaryDto> Data { get; set; }
    }
}
