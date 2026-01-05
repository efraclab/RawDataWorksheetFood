export interface CalculationRS {
  id: number;
  label: string;
  selectedStandardPrepLabel: string | null;
  selectedSamplePrepLabel: string | null;
  
  // Area/ABS values
  areaOfSample: string;
  areaOfStandard: string;
  
  purity: string;

  calculationResult: string | null;
  calculationResultUnit: string | null;
  
}