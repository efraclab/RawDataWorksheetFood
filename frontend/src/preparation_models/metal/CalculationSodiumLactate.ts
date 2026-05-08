export interface CalculationSodiumLactate {
  id: number;
  label: string;

  /** Label of the SamplePreparationSodiumLactate whose V1-V4 feed this calculation. */
  selectedSamplePreparationLabel: string | null;

  /**
   * Auto-populated from selected sample preparation.
   *   V1 = 1st Dilution value1 (take volume)
   *   V2 = 1st Dilution value2 (makeup volume) → DF1 = V2/V1
   *   V3 = 2nd Dilution value1 (take volume, optional)
   *   V4 = 2nd Dilution value2 (makeup volume) → DF2 = V4/V3 (optional)
   */
  v1: string | null;
  v2: string | null;
  v3: string | null;
  v4: string | null;

  /** User-entered additional multiplier (X1). */
  x1Factor: string;

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
