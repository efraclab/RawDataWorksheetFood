namespace RawDataWorkSheet.Models.FinalRawData
{
    public class RawDataCalculationDto
    {
        public string WorksheetId { get; set; } = default!;
        public string ParameterCode { get; set; } = default!;

        public string? CalculationLabel { get; set; }
        public string? CalculationType { get; set; }
        public string? CalculationFor { get; set; }

        public string? AreaOfSample { get; set; }
        public string? AreaOfStandard { get; set; }

        public string? Purity { get; set; }
        public string? AvgWeight { get; set; }
        public string? AvgWeightUnit { get; set; }
        public string? AvgContent { get; set; }
        public string? AvgContentUnit { get; set; }
        public string? SampleVol { get; set; }
        public string? SampleVolUnit { get; set; }

        public string? MwSalt { get; set; }
        public string? MwBase { get; set; }
        public string? Claim { get; set; }
        public string? ClaimUnit { get; set; }
        public string? LabelClaim { get; set; }
        public string? LabelClaimUnit { get; set; }

        public string? LodWaterType { get; set; }
        public string? LodWaterValue { get; set; }

        public string? W1_EmptyDish { get; set; }
        public string? W2_DishWithSample { get; set; }
        public string? W3_DishAfterIgnition { get; set; }

        public string? W1_EmptyCrucible { get; set; }
        public string? W2_CrucibleWithSample { get; set; }
        public string? W3_CrucibleAfterAsh { get; set; }

        public string? CalculationResult { get; set; }
        public string? CalculationResultUnit { get; set; }
        public string? LabelClaimPercentResult { get; set; }
        public string? LodWaterBasisResult { get; set; }

        public string? SelectedStandardPrepLabel { get; set; }
        public string? SelectedSamplePrepLabel { get; set; }

        public string? TimePointDetailInHr { get; set; }
        public string? CF { get; set; }
        public string? CorrectedResult { get; set; }
        public string? CorrectedResultUnit { get; set; }

        public string? LimitMin { get; set; }

        public string? LimitMax { get; set; }

        public string? BuretteReading { get; set; }

        public string? BuretteReading1 { get; set; }
        public string? BuretteReading2 { get; set; }
        public string? BuretteReading3 { get; set; }
        public string? BuretteReading4 { get; set; }
        public string? BuretteReading5 { get; set; }
        public string? BuretteReading6 { get; set; }

        public string? TheoreticalMolarity { get; set; }
        public string? ActualMolarity { get; set; }
        public string? Factor { get; set; }
        public string? FactorUnit { get; set; }

        public string? DissoMediaVolume { get; set; }
        public string? SampleTaken { get; set; }
        public string? DryBasisResult { get; set; }
    }

}
