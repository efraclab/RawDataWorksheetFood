export interface CalculationAnofer {
  id: number;
  label: string;

  /** Label of the SamplePreparationAnofer whose SW1/V1-V5 feed this calculation. */
  selectedSamplePreparationLabel: string | null;

  /** Auto-populated from the selected sample preparation. */
  sw1: string | null;
  /** 1st Dilution value1 — Volume Makeup (multiplied directly in numerator). */
  v1: string | null;
  /** 2nd Dilution value1 — take volume. */
  v2: string | null;
  /** 2nd Dilution value2 — makeup volume → DF1 = V3/V2 */
  v3: string | null;
  /** 3rd Dilution value1 — take volume (optional). */
  v4: string | null;
  /** 3rd Dilution value2 — makeup volume → DF2 = V5/V4 (optional). */
  v5: string | null;

  /** User-entered values for the % of L.C. formula. */
  avgWeight: string;
  avgWeightUnit: string;
  labelClaim: string;

  /** User-entered instrument readings. */
  instrumentConcentrationSample: string;
  instrumentConcentrationSampleUnit: string;
  instrumentConcentrationBlank: string;
  instrumentConcentrationBlankUnit: string;

  /** Acceptance limits (as-text). */
  acceptanceLimitMin: string;
  acceptanceLimitMax: string;

  /** Computed result. */
  calculationResult: string | null;
  calculationResultUnit: string | null;
}
