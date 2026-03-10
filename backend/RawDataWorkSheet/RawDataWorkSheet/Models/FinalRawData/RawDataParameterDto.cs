using Dapper;

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
        public string? OtherInfo { get; set; }

        public string? ParameterAnalyzedBy { get; set; }
        public string? ParameterApprovedBy { get; set; }
        public string? ParameterStatus { get; set; }
        public string? ParameterApprovedAt { get; set; }
        public string? AnalysisStartedAt { get; set; }
        public string? AnalysisCompletedAt { get; set; }
        public string? ApprovedByReviewer { get; set; }
        public string? ApprovedAtReviewer { get; set; }
        public string? ApprovedByQA { get; set; }
        public string? ApprovedAtQA { get; set; }
        public string? RemarksByQA { get; set; }
        public string? RemarksByReviewer { get; set; }
    }

}
