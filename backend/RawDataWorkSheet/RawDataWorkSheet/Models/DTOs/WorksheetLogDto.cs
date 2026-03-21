namespace RawDataWorkSheet.Models.DTOs
{
    public class WorksheetLogDto
    {
        public int Id { get; set; }
        public string? WorksheetId { get; set; }
        public string? ParameterCode { get; set; }
        public string? ParameterName { get; set; }
        public string? Timestamp { get; set; }
        public string? Remarks { get; set; }
        public string? Action { get; set; }
        public string? EmployeeId { get; set; }
        public string? EmployeeName { get; set; }
        public string? Role { get; set; }
    }
}
