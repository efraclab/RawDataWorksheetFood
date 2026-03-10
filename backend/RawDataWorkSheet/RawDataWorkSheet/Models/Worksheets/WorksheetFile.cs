namespace RawDataWorkSheet.Models.Worksheets
{
    public class WorksheetFile
    {
        public int Id { get; set; }
        public int ParameterId { get; set; }
        public string? PreparationCategory { get; set; }
        public string? PreparationType { get; set; }
        public string? Label { get; set; }
        public string FileName { get; set; } = string.Empty;
        public byte[] FileData { get; set; } = Array.Empty<byte>();
        public DateTime? UploadedAt { get; set; }
        public string? WorksheetId { get; internal set; }
    }

}
