export type FFCalculationType = "Finish Product" | "Raw Product";

export interface CalculationAssayFerrousFumarate {
  acceptanceLimitMin: string;
  acceptanceLimitMax: string;
  id: number;
  label: string;

  selectedSamplePreparationLabel: string | null;
  calculationFor: FFCalculationType | "";

  buretteReading: string | null;
  theoreticalMolarity: string | null;
  actualMolarity: string | null;
  factor: string | null;
  factorUnit: string;
  sampleWeight: string | null;
  sampleWeightUnit: string;
  avgWeight: string | null;
  avgWeightUnit: string;
  labelClaim: string | null;
  labelClaimUnit: string;

  lodWaterType: string | null;
  lodWaterValue: string | null;

  calculationResult: string | null;
  calculationResultUnit: string | null;
  labelClaimPercent: string | null;
  lodWaterBasisResult: string | null;
}