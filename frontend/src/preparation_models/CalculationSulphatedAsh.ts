
export interface CalculationSulphatedAsh {
  id: number;
  label: string;
  selectedSamplePrepLabel: string | null;
  
  w1_emptyCrucible: string;
  w2_crucibleWithSample: string;
  w3_crucibleAfterAsh: string;
  
  calculationResult: string | null;
  calculationResultUnit: string | null;
}