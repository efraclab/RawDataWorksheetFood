export interface CalculationLod {
  id: number;
  label: string;
  selectedSamplePrepId: number | null;
  
  w1_emptyDish: string;
  w2_dishWithSample: string;
  w3_dishAfterIgnition: string;
}