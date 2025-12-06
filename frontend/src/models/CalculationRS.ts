export interface CalculationRS {
  id: number;
  label: string;
  selectedStandardPrepId: number | null;
  selectedSamplePrepId: number | null;
  
  // Area/ABS values
  areaOfSample: string;
  areaOfStandard: string;
  
  // Standard weights
  sw1: string;  // Standard weight
  sw2: string;  // Sample weight
  
  // Volumes for calculation
  v1: string;   // Standard 1st dilution final volume
  v2: string;   // Standard 2nd dilution aliquot
  v3: string;   // Standard 2nd dilution final volume
  v4: string;   // Standard 3rd dilution aliquot
  v5: string;   // Standard 3rd dilution final volume
  
  v6: string;   // Sample 1st dilution final volume
  
  // Purity
  purity: string;
}