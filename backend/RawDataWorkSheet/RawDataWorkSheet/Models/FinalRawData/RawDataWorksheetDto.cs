namespace RawDataWorkSheet.Models.FinalRawData
{
    public class RawDataWorksheetDto
    {
        public string WorksheetId { get; set; }
        public string? RegistrationNo { get; set; }
        public string? SampleName { get; set; }
        public int? NumberOfParameters { get; set; }
        public DateTime? DueDate { get; set; }

        public string? WorksheetPreparedBy { get; set; }
        public string? WorksheetStatus { get; set; }

        public DateTime? WorksheetCreatedAt { get; set; }
        public DateTime? WorksheetUpdatedAt { get; set; }
        public DateTime? WorksheetApprovedAt { get; set; }
    }

}
