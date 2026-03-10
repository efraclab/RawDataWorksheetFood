namespace RawDataWorkSheet.Models.FinalRawData
{
    public class RawDataWorksheetDto
    {
        public string WorksheetId { get; set; }
        public string? RegistrationNo { get; set; }
        public string? SampleName { get; set; }
        public int? NumberOfParameters { get; set; }
        public string? DueDate { get; set; }

        public string? WorksheetPreparedBy { get; set; }
        public string? WorksheetStatus { get; set; }

        public string? WorksheetCreatedAt { get; set; }
        public string? WorksheetUpdatedAt { get; set; }
        public string? WorksheetApprovedAt { get; set; }
        public string? SubmittedQaAt { get; set; }
        public string? ApprovedBy { get; set; }
        public string? SubmittedQaBy { get; set; }
    }

}
