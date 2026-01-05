export interface CalculationDisso {
  id: number;
  label: string;
  selectedStandardPrepLabel: string | null;
  selectedSamplePrepLabel: string | null;
  areaOfSample: string;
  areaOfStandard: string;
  mwBase: string;
  mwSalt: string;
  purity: string;

  calculationResult: string | null;
  calculationResultUnit: string | null;
}