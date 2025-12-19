using RawDataWorkSheet.Models.DTOs;

namespace RawDataWorkSheet.Models.Requests
{
    public class SaveWorksheetRequest
    {
        public string? WorksheetId { get; set; }
        public RegistrationInfoDto? RegistrationInfo { get; set; }
        public DocumentInfoDto? DocumentInfo { get; set; }
        public List<ParameterDto>? Parameters { get; set; }
    }
}
