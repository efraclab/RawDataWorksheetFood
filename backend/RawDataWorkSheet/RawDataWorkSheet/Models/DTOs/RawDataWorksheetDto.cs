namespace RawDataWorkSheet.Models.DTOs
{
    public class RawDataWorksheetDto
    {
        public string WorksheetId { get; set; }
        public string RegistrationNo { get; set; }
        public string SampleName { get; set; }
        public string DateOfReceipt { get; set; }
        public int NumberOfParameters { get; set; }
        public string DueDate { get; set; }
        public string AnalysisStartDate { get; set; }
        public string AnalysisCompletionDate { get; set; }
        public string PreparedBy { get; set; }
        public string AnalyzedBy { get; set; }
        public string ApprovedBy { get; set; }
        public string Classified { get; set; }
        public string RevisionDate { get; set; }
        public string Status { get; set; }
        public DateTime? SubmittedAt { get; set; }
        public DateTime? ApprovedAt { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }
}
