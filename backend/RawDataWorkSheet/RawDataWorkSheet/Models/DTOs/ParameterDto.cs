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
        public string? OtherInfo { get; set; }

        public string? AnalyzedBy { get; set; }
        public string? AnalyzedByName { get; set; }
        public string? ApprovedByReviewer { get; set; }
        public string? ApprovedByReviewerName { get; set; }
        public string? AnalysisStartDate { get; set; }
        public string? AnalysisCompletionDate { get; set; }
        public string? ApprovedAtReviewer { get; set; }
        public string? Status { get; set; }

        public List<string>? InstrumentIds { get; set; }
        public List<string>? ChemicalIds { get; set; }
        public List<string>? StandardIds { get; set; }

        public List<PreparationDto>? Preparations { get; set; }
        public List<CalculationDto>? Calculations { get; set; }
        public List<WorksheetFileDto>? Files { get; set; }
        public string? ApprovedByQA { get; set; }
        public string? ApprovedAtQA { get; set; }
        public string? RemarksByQA { get; set; }
        public string? RemarksByReviewer { get; set; }
        public string? ApprovedByQAName { get; internal set; }
    }

}
