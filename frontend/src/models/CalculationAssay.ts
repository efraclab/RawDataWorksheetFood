export type CalculationType = 
  | "For Tablets" 
  | "For Capsule" 
  | "For Injection Vial" 
  | "For Oral Suspension" 
  | "For Oral Liquid"
  | "For Raw Material";

export interface CalculationAssay {
  id: number;
  label: string;
  selectedStandardPrepId: number | null;
  selectedSamplePrepId: number | null;
  calculationType: CalculationType | "";
  
  areaOfSample: string;
  areaOfStandard: string;
  
  v1: string;
  v2: string;
  v3: string;
  v4: string;
  v5: string;
  v6: string;
  v7: string;
  v8: string;
  v9: string;
  v10: string;
  v11: string;
  v12: string;
  v13: string;
  v14: string;
  
  sw1: string;
  sw2: string;
  
  baseXPurity: string;
  avgWt: string;
  mwSalt: string;
  mwBase: string;
  
  claimVolume: string;
}