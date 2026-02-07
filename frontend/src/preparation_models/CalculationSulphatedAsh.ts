
export interface CalculationSulphatedAsh {
  id: number;
  label: string;
  selectedSamplePreparationLabel: string | null;
  
  w1_emptyCrucible: string;
  w2_crucibleWithSample: string;
  w3_crucibleAfterAsh: string;
  
  calculationResult: string | null;
  calculationResultUnit: string | null;

  w1: string | null;
  w2: string | null;
  w3: string | null;
}