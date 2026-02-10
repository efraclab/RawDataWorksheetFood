namespace RawDataWorkSheet.Models.FinalRawData
{
    public class RawDataPreparationDto
    {
        public string WorksheetId { get; set; }
        public string ParameterCode { get; set; }
        public string PrepCategory { get; set; }
        public string PrepLabel { get; set; }
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
        public string? Content { get; set; }
    }

}
