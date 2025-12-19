using RawDataWorkSheet.Models.DTOs;

namespace RawDataWorkSheet.Models.Responses
{

    public class WorksheetResponse
    {
        public bool Success { get; set; }
        public string Message { get; set; }
        public WorksheetDetailDto Data { get; set; }
    }
}
