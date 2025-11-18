namespace RawDataWorkSheet.Models.ReportModels
{
    public class ParameterDto
    {
        public string ParaCode { get; set; }
        public string ParameterName { get; set; }
        public string MethodCode { get; set; }
        public string MethodName { get; set; }

        public List<InstrumentDto> Instruments { get; set; }
        public List<ChemicalDto> Chemicals { get; set; }
        public List<StandardDto> Standards { get; set; }

        public string DiluentPreparation { get; set; }
        public string ColumnId { get; set; }
        public ColumnDetailsDto ColumnDetails { get; set; }

        public List<MobilePhaseDto> MobilePhases { get; set; }
        public List<DissoMediaDto> DissoMedia { get; set; }
        public List<PreparationStepDto> StandardPreparation { get; set; }
        public List<PreparationStepDto> SamplePreparation { get; set; }
        public List<PreparationStepDto> SamplePreparationDisso { get; set; }
        public List<PreparationStepDto> SamplePreparationTitration { get; set; }
        public List<PreparationStepDto> SamplePreparationLod { get; set; }
        public List<PreparationStepDto> SamplePreparationLossOnIgnation { get; set; }
        public List<PreparationStepDto> SamplePreparationSulphatedAsh { get; set; }

        public string TestSolutionPreparation { get; set; }
    }

}
