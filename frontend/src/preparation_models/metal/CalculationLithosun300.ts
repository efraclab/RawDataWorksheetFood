export interface CalculationLithosun300 {
  id: number;
  label: string;

  selectedSamplePreparationLabel: string | null;

  v1: string | null;
  v2: string | null;
  v3: string | null;


  conversionFactor: string | null;
  labelClaim: string | null;
  labelClaimUnit: string | null;

  instrumentConcentrationSampleUnit: string;

  instrumentConcentrationBlank: string;
  instrumentConcentrationBlankUnit: string;

  instrumentConcentrationSampleTablet1: string | null;
  instrumentConcentrationSampleTablet2: string | null;
  instrumentConcentrationSampleTablet3: string | null;
  instrumentConcentrationSampleTablet4: string | null;
  instrumentConcentrationSampleTablet5: string | null;
  instrumentConcentrationSampleTablet6: string | null;

  acceptanceLimitMin: string;
  acceptanceLimitMax: string;

  calculationResultTablet1: string | null;
  calculationResultTablet2: string | null;
  calculationResultTablet3: string | null;
  calculationResultTablet4: string | null;
  calculationResultTablet5: string | null;
  calculationResultTablet6: string | null;

  calculationResult: string | null;
  calculationResultUnit: string | null;
}