namespace RawDataWorkSheet.Models.Requests
{
    public class WorksheetLogRequest
    {
        public string? WorksheetId { get; set; }
        public int? ParameterId { get; set; }
        public string? Remarks { get; set; }
        public string? Action { get; set; }
        public string? EmployeeId { get; set; }
        public string? Role { get; set; }
        public string? ReferenceType { get; set; }
        public string? ReferenceId { get; set; }
    }
}
