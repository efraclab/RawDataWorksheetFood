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
  weightPerMl: string;
  weightPerMlUnit: string;
  mWSalt: string;
  mWBase: string;

  claim: string;
  claimUnit: string;
  labelClaim: string | null;

  lodWaterType: string;
  lodWaterValue: string;

  calculationResult: string | null;
  calculationResultUnit: string | null;
  labelClaimPercent: string | null;
  lodWaterBasisResult: string | null;

  // Stored preparation values
  sw1: string | null;
  sw2: string | null;
  v1: string | null;
  v2: string | null;
  v3: string | null;
  v4: string | null;
  v5: string | null;
  v6: string | null;
  v7: string | null;
  v8: string | null;
  v9: string | null;
  v10: string | null;
  v11: string | null;
  v12: string | null;
  v13: string | null;
  v14: string | null;
}