namespace RawDataWorkSheet.Models.Worksheets
{
    public class Worksheet
    {
        public string WorksheetId { get; set; }
        public string RegistrationNo { get; set; }
        public string SampleName { get; set; }
        public string SampleCode { get; set; }
        public int SampleQuantity { get; set; }
        public string NatureOfSample { get; set; }
        public int NumberOfParameters { get; set; }
        public DateTime? DueDate { get; set; }
        public string Lab { get; set; }
        
        public string? PreparedBy { get; set; }
        public string? PreparedByName { get; set; }
        public DateTime? RevisionDate { get; set; }
        public string Status { get; set; }
        public DateTime? ApprovedAt { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public DateTime? SubmittedQaAt { get; set; }
        public string? ApprovedBy { get; set; }
        public string? SubmittedQaBy { get; set; }
        public string? SubmittedQaByName { get; internal set; }
        public string? ApprovedByName { get; internal set; }
    }

}
