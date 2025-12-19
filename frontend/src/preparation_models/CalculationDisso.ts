export interface CalculationDisso {
  id: number;
  label: string;
  selectedStandardPrepId: number | null;
  selectedSamplePrepDissoId: number | null;
  areaOfSample: string;
  areaOfStandard: string;
  mwBase: string;
  mwSalt: string;
  claim: string;
  purity: string;
}