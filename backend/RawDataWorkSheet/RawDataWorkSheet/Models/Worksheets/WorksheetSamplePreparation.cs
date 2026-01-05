namespace RawDataWorkSheet.Models.Worksheets
{
    public class WorksheetSamplePreparation
    {
        public int Id { get; set; }
        public int ParameterId { get; set; }
        public string PreparationType { get; set; }
        public string Label { get; set; }
        public string AssignedStandardId { get; set; }
        public string Steps { get; set; }
    }

}
