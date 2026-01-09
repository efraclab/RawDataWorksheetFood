namespace RawDataWorkSheet.Models.FinalRawData
{
    public class RawDataParameterDto
    {
        public string WorksheetId { get; set; } = default!;
        public string ParameterCode { get; set; } = default!;

        public string? ParameterName { get; set; }
        public string? MethodCode { get; set; }
        public string? MethodName { get; set; }

        public string? ColumnId { get; set; }
        public string? DiluentPreparation { get; set; }
        public string? OtherInfo { get; set; }

        public string? ParameterAnalyzedBy { get; set; }
        public string? ParameterApprovedBy { get; set; }
        public string? ParameterStatus { get; set; }
        public string? ParameterApprovedAt { get; set; }
    }

}
