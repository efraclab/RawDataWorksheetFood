export interface CalculationROI {
  id: number;
  label: string;
  selectedSamplePrepLabel: string | null;
  
  w1_emptyDish: string;
  w2_dishWithSample: string;
  w3_dishAfterIgnition: string;

  calculationResult: string | null;
  calculationResultUnit: string | null;

  w1: string | null;
  w2: string | null;
  w3: string | null;
}