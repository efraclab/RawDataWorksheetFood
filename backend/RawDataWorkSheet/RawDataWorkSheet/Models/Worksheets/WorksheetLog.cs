namespace RawDataWorkSheet.Models.Worksheets
{
    public class WorksheetLog
    {
        public int Id { get; set; }
        public string? WorksheetId { get; set; }
        public int? ParameterId { get; set; }
        public string? ParameterCode { get; set; }
        public string? ParameterName { get; set; }
        public DateTime Timestamp { get; set; }
        public string? Remarks { get; set; }
        public string? Action { get; set; }
        public string? EmployeeId { get; set; }
        public string? EmployeeName { get; set; }
        public string? Role { get; set; }
        public string? ReferenceType { get; set; }
        public string? ReferenceId { get; set; }
    }
}
