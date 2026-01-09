export interface CalculationDisso {
  id: number;
  label: string;
  selectedStandardPrepLabel: string | null;
  selectedSamplePrepLabel: string | null;
  areaOfSample1: string;
  areaOfSample2: string;
  areaOfSample3: string;
  areaOfSample4: string;
  areaOfSample5: string;
  areaOfSample6: string;
  areaOfStandard: string;
  mwBase: string;
  mwSalt: string;
  purity: string;

  calculationResult: string | null;
  calculationResultTablet1: string | null;
  calculationResultTablet2: string | null;
  calculationResultTablet3: string | null;
  calculationResultTablet4: string | null;
  calculationResultTablet5: string | null;
  calculationResultTablet6: string | null;
  calculationResultUnit: string | null;
}