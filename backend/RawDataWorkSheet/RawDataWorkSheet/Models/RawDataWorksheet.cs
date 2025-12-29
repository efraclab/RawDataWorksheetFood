namespace RawDataWorkSheet.Models
{
    public class RawDataWorksheet
    {
        public string WorksheetId { get; set; }
        public string RegistrationNo { get; set; }
        public string SampleName { get; set; }
        public int NumberOfParameters { get; set; }
        public DateTime? DueDate { get; set; }
        
        public string PreparedBy { get; set; }
        public DateTime? RevisionDate { get; set; }
        public string Status { get; set; }
        public DateTime? SubmittedAt { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }

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
        public string ApprovedBy { get; set; }
        public DateTime? ApprovedAt { get; set; }
        public string? Status { get; set; }
    }

    public class WorksheetInstrument
    {
        public int Id { get; set; }
        public int ParameterId { get; set; }
        public string InstrumentId { get; set; }
    }

    public class WorksheetChemical
    {
        public int Id { get; set; }
        public int ParameterId { get; set; }
        public string ChemicalId { get; set; }
    }

    public class WorksheetStandard
    {
        public int Id { get; set; }
        public int ParameterId { get; set; }
        public string StandardId { get; set; }
    }

    public class WorksheetStandardPreparation
    {
        public int Id { get; set; }
        public int ParameterId { get; set; }
        public string PreparationType { get; set; }
        public string Label { get; set; }
        public string AssignedStandardId { get; set; }
        public string Steps { get; set; }
    }

    public class WorksheetSamplePreparation
    {
        public int Id { get; set; }
        public int ParameterId { get; set; }
        public string PreparationType { get; set; }
        public string Label { get; set; }
        public string AssignedStandardId { get; set; }
        public string Steps { get; set; }
    }

    public class WorksheetCalculation
    {
        public int Id { get; set; }
        public int ParameterId { get; set; }
        public string CalculationType { get; set; }
        public string Label { get; set; }
        public string CalculationData { get; set; }
    }

}
