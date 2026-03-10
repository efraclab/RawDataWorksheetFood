namespace RawDataWorkSheet.Models.FinalRawData
{
    public class RawDataPreparationDto
    {
        public string WorksheetId { get; set; } = default!;
        public string ParameterCode { get; set; } = default!;
        public string PrepCategory { get; set; } = default!;
        public string PrepLabel { get; set; } = default!;
        public string? PreparationType { get; set; }
        public string? AssignedStandardId { get; set; }
        public string? StepName { get; set; }
        public int? StepOrder { get; set; }
        public string? Value1 { get; set; }
        public string? Unit1 { get; set; }
        public string? Value2 { get; set; }
        public string? Unit2 { get; set; }
        public string? Value3 { get; set; }
        public string? Unit3 { get; set; }
        public string? SolventChemical { get; set; }
        public string? LogBookID { get; set; }
        public string? LimitType { get; set; }
        public string? Content { get; set; }
    }
}