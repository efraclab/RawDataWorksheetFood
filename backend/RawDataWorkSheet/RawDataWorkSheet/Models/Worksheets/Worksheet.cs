namespace RawDataWorkSheet.Models.Worksheets
{
    public class Worksheet
    {
        public string WorksheetId { get; set; }
        public string RegistrationNo { get; set; }
        public string SampleName { get; set; }
        public int NumberOfParameters { get; set; }
        public DateTime? DueDate { get; set; }
        
        public string PreparedBy { get; set; }
        public DateTime? RevisionDate { get; set; }
        public string Status { get; set; }
        public DateTime? ApprovedAt { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }

}
