namespace RawDataWorkSheet.Models.DTOs
{
    public class WorksheetFileDto
    {
        public int Id { get; set; }
        public int? ParameterId { get; set; }
        public string? PreparationCategory { get; set; }
        public string? PreparationType { get; set; }
        public string? Label { get; set; }
        public string? FileName { get; set; }
        public string? FileDataBase64 { get; set; }
        public string? UploadedAt { get; set; }
        public string? WorksheetId { get; internal set; }
    }
}
