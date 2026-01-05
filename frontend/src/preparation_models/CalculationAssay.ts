export type CalculationType =
  | "Tablets"
  | "Capsule"
  | "Injection Vial"
  | "Oral Suspension"
  | "Oral Liquid"
  | "Raw Material";

export interface CalculationAssay {
  id: number;
  label: string;
  selectedStandardPrepLabel: string | null;
  selectedSamplePrepLabel: string | null;
  calculationFor: CalculationType | "";

  areaOfSample: string;
  areaOfStandard: string;

  purity: string;
  avgWeight: string;
  avgWeightUnit: string;
  avgContent: string;
  avgContentUnit: string;
  sampleVol: string;
  sampleVolUnit: string;
  mwSalt: string;
  mwBase: string;

  claim: string;
  claimUnit: string;
  labelClaim: string | null;

  lodWaterType: string;
  lodWaterValue: string;

  calculationResult: string | null;
  calculationResultUnit: string | null;
  labelClaimPercent: string | null;
  lodWaterBasisResult: string | null;
}
