export type FFCalculationType = "Finish Product" | "Raw Product";

export interface CalculationAssayFerrousFumarate {
  id: number;
  label: string;

  selectedSamplePreparationLabel: string | null;
  calculationFor: FFCalculationType | "";

  buretteReading: string | null;
  theoreticalMolarity: string | null;
  actualMolarity: string | null;
  factor: string | null;
  factorUnit: string;

  avgWeight: string | null;
  avgWeightUnit: string;
  labelClaim: string | null;
  labelClaimUnit: string;

  lodWaterType: string | null;
  lodWaterValue: string | null;

  calculationResult: string | null;
  calculationResultUnit: string | null;
  labelClaimPercent: string | null;
  dryBasisResult: string | null;
  acceptanceLimit: string | null;
}