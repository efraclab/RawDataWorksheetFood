namespace RawDataWorkSheet.Models.Worksheets
{
    public class WorksheetParameter
    {
        public int Id { get; set; }
        public string WorksheetId { get; set; }
        public int ParameterId { get; set; }
        public string ParaCode { get; set; }
        public string ParameterName { get; set; }
        public string MethodCode { get; set; }
        public string MethodName { get; set; }
        public string ColumnId { get; set; }
        public string DiluentPreparation { get; set; }
        public string OtherInfo { get; set; }
        public DateTime? AnalysisStartDate { get; set; }
        public DateTime? AnalysisCompletionDate { get; set; }
        public string AnalyzedBy { get; set; }
        public string ApprovedByReviewer { get; set; }
        public DateTime? ApprovedAtReviewer { get; set; }
        public string ApprovedByQA { get; set; }
        public DateTime? ApprovedAtQA { get; set; }
        public string? RemarksByReviewer { get; set; }
        public string? RemarksByQA { get; set; }
        public string? Status { get; set; }
        public string? PreparationCompletedBy { get; set; }
        public DateTime? PreparationCompletedAt { get; set; }
        public string? RemarksByAnalyst { get; set; }
        public List<WorksheetFile>? Files { get; set; }
    }

}
