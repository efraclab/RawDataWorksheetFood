namespace RawDataWorkSheet.Models.Requests
{
    public class WorksheetLogRequest
    {
        public string WorksheetId { get; set; } = string.Empty;
        public int? ParameterId { get; set; }
        public string? Remarks { get; set; }
        public string? Action { get; set; } = string.Empty;
        public string? EmployeeId { get; set; } = string.Empty;
        public string? Role { get; set; } = string.Empty;
        public string? ReferenceType { get; set; }
        public string? ReferenceId { get; set; }
    }
}
