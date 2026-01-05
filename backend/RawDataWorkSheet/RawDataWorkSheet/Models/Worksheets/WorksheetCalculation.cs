namespace RawDataWorkSheet.Models.Worksheets
{
    public class WorksheetCalculation
    {
        public int Id { get; set; }
        public int ParameterId { get; set; }
        public string CalculationType { get; set; }
        public string Label { get; set; }
        public string CalculationData { get; set; }
    }

}
