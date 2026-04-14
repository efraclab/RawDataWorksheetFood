namespace RawDataWorkSheet.Models.DTOs
{
    public class WorksheetDto
    {
        public string WorksheetId { get; set; }
        public string RegistrationNo { get; set; }
        public string SampleName { get; set; }
        public string SampleCode { get; set; }
        public int SampleQuantity { get; set; }
        public string NatureOfSample { get; set; }
        public int NumberOfParameters { get; set; }
        public string DueDate { get; set; }
        public string PreparedBy { get; set; }
        public string? PreparedByName { get; set; }
        public string RevisionDate { get; set; }
        public string Status { get; set; }
        public string CreatedAt { get; set; }
        public string? UpdatedAt { get; set; }
        public string? ApprovedAt { get; set; }
        public string SubmittedQaAt { get; set; }
        public string? SubmittedQaBy { get; set; }
        public string? ApprovedBy { get; set; }
        public string? ApprovedByName { get; internal set; }
        public string? SubmittedQaByName { get; internal set; }
    }

}
