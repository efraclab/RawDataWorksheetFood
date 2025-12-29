namespace RawDataWorkSheet.Models.DTOs
{
    public class ParameterDto
    {
        public int? Id { get; set; }
        public string? ParaCode { get; set; }
        public string? ParameterName { get; set; }
        public string? MethodCode { get; set; }
        public string? MethodName { get; set; }
        public string? ColumnId { get; set; }
        public string? DiluentPreparation { get; set; }
        public string? OtherInfo { get; set; }

        public string? AnalyzedBy { get; set; }
        public string? ApprovedBy { get; set; }
        public string? AnalysisStartDate { get; set; }
        public string? AnalysisCompletionDate { get; set; }
        public string? ApprovedAt { get; set; }
        public string? Status { get; set; }

        public List<string>? Instruments { get; set; }
        public List<string>? Chemicals { get; set; }
        public List<string>? Standards { get; set; }

        public List<StandardPreparationDto>? StandardPreparations { get; set; }
        public List<SamplePreparationDto>? SamplePreparations { get; set; }

        public List<CalculationDto>? Calculations { get; set; }
    }
}
