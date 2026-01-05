namespace RawDataWorkSheet.Models.DTOs
{
    public class WorksheetDto
    {
        public string WorksheetId { get; set; }
        public string RegistrationNo { get; set; }
        public string SampleName { get; set; }
        public int NumberOfParameters { get; set; }
        public string DueDate { get; set; }
        public string PreparedBy { get; set; }
        public string RevisionDate { get; set; }
        public string Status { get; set; }
        public string CreatedAt { get; set; }
        public string? UpdatedAt { get; set; }
        public string? ApprovedAt { get; set; }
    }

}
