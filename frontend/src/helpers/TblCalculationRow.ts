

export interface TblCalculationRow {
  WorksheetId: string;
  ParameterCode: string;

  CalculationLabel: string | null;
  CalculationType: string | null;
  CalculationFor: string | null;

  AreaOfSample?: string | null;
  AreaOfStandard?: string | null;

  Purity?: string | null;
  AvgWeight?: string | null;
  AvgWeightUnit?: string | null;
  SampleVol?: string | null;
  SampleVolUnit?: string | null;
  AvgContent?: string | null;
  AvgContentUnit?: string | null;
  Claim?: string | null;
  ClaimUnit?: string | null;

  MwSalt?: string | null;
  MwBase?: string | null;
  LabelClaim?: string | null;
  LabelClaimUnit?: string | null;

  LodWaterType?: string | null;
  LodWaterValue?: string | null;

  W1_EmptyDish?: string | null;
  W2_DishWithSample?: string | null;
  W3_DishAfterIgnition?: string | null;

  W1_EmptyCrucible?: string | null;
  W2_CrucibleWithSample?: string | null;
  W3_CrucibleAfterAsh?: string | null;

  CalculationResult?: string | null;
  CalculationResultUnit?: string | null;
  LabelClaimPercentResult?: string | null;
  LodWaterBasisResult?: string | null;

  SelectedStandardPrepLabel?: string | null;
  SelectedSamplePrepLabel?: string | null;

  TimePointDetailInHr?: string | null;
  CF?: string | null;
  CorrectedResult?: string | null;
  CorrectedResultUnit?: string | null;
  Limit?:string | null;

}
