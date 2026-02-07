export interface CalculationRS {
  id: number;
  label: string;
  selectedStandardPreparationLabel: string | null;
  selectedSamplePreparationLabel: string | null;
  
  // Area/ABS values
  areaOfSample: string;
  areaOfStandard: string;
  
  purity: string;

  calculationResult: string | null;
  calculationResultUnit: string | null;

  // Stored preparation values
  sw1: string | null;
  sw2: string | null;
  v1: string | null;
  v2: string | null;
  v3: string | null;
  v4: string | null;
  v5: string | null;
  v6: string | null;
  
}