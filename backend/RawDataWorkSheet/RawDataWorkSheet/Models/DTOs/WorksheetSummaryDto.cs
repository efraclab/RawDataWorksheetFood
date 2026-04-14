namespace RawDataWorkSheet.Models.DTOs
{
    public class WorksheetSummaryDto
    {
        public string WorksheetId { get; set; }
        public string RegistrationNo { get; set; }
        public string SampleName { get; set; }
        public int NumberOfParameters { get; set; }
        public string Status { get; set; }
        public string Lab { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
