namespace RawDataWorkSheet.Models.DTOs
{
    public class ParameterDetailDto
    {
        public int Id { get; set; }
        public string ParaCode { get; set; }
        public string ParameterName { get; set; }
        public string MethodCode { get; set; }
        public string MethodName { get; set; }
        public string ColumnId { get; set; }
        public string DiluentPreparation { get; set; }
        public string TestSolutionPreparation { get; set; }

        // Just IDs (frontend will fetch full details)
        public List<string> InstrumentIds { get; set; }
        public List<string> ChemicalIds { get; set; }
        public List<string> StandardIds { get; set; }

        // Parsed JSON data
        public List<StandardPreparationDto> StandardPreparations { get; set; }
        public List<SamplePreparationDto> SamplePreparations { get; set; }
        public List<CalculationDto> Calculations { get; set; }
    }
}
