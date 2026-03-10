namespace RawDataWorkSheet.Models.FinalRawData
{
    public class RawDataFileDto
    {
        public string WorksheetId { get; set; } = default!;
        public string ParameterCode { get; set; } = default!;
        public string? PreparationType { get; set; }
        public string? PrepLabel { get; set; }
        public string FileName { get; set; } = default!;
        public string? FileDataBase64 { get; set; }
    }
}