export interface CalculationDisso {
  id: number;
  label: string;
  selectedStandardPreparationLabel: string | null;
  selectedSamplePreparationLabel: string | null;
  areaOfSample1: string;
  areaOfSample2: string;
  areaOfSample3: string;
  areaOfSample4: string;
  areaOfSample5: string;
  areaOfSample6: string;
  areaOfStandard: string;
  mWBase: string;
  mWSalt: string;
  purity: string;

  calculationResult: string | null;
  calculationResultTablet1: string | null;
  calculationResultTablet2: string | null;
  calculationResultTablet3: string | null;
  calculationResultTablet4: string | null;
  calculationResultTablet5: string | null;
  calculationResultTablet6: string | null;
  calculationResultUnit: string | null;

  // Stored preparation values
  sw1: string | null;
  claim: string | null;
  mediaVol: string | null;
  v1: string | null;
  v2: string | null;
  v3: string | null;
  v4: string | null;
  v5: string | null;
  v6: string | null;
  v7: string | null;
  v8: string | null;
  v9: string | null;
  v10: string | null;
  v11: string | null;
  v12: string | null;
  v13: string | null;
  v14: string | null;
}