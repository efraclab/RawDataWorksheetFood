export type RelatedSubstanceCalculationType =
  | "Tablets"
  | "Capsule"
  | "Injection Vial"
  | "Oral Suspension"
  | "Oral Liquid"
  | "Raw Material";

export interface CalculationRelatedSubstance {
  acceptanceLimitMin: string;
  acceptanceLimitMax: string;
  id: number;
  label: string;
  selectedStandardPreparationLabel: string | null;
  selectedSamplePreparationLabel: string | null;
  calculationFor: RelatedSubstanceCalculationType | "";

  areaOfSample: string;
  areaOfStandard: string;

  purity: string;
  mWSalt: string;
  mWBase: string;

  responseFactor: string;
  responseFactorUnit: string;

  labelClaim: string;
  labelClaimUnit: string;

  avgWeight: string;
  avgWeightUnit: string;

  weightPerMl: string;
  weightPerMlUnit: string;

  doseVolume: string;
  doseVolumeUnit: string;

  calculationResult: string | null;
  calculationResultUnit: string;

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