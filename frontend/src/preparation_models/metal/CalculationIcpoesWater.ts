export interface CalculationIcpoesWater {
  id: number;
  label: string;

  /** Label of the SamplePreparation whose V1–V7 feed this calculation. */
  selectedSamplePreparationLabel: string | null;

  /**
   * Auto-populated from the selected sample preparation.
   *   V1 = 1st Dilution value1 (make-up volume) — multiplied directly in numerator
   *   V2 = 2nd Dilution value1 (take volume)
   *   V3 = 2nd Dilution value2 (make-up volume)  → DF1 = V3/V2
   *   V4 = 3rd Dilution value1 (take volume)
   *   V5 = 3rd Dilution value2 (make-up volume)  → DF2 = V5/V4
   *   V6 = 4th Dilution value1 (take volume)
   *   V7 = 4th Dilution value2 (make-up volume)  → DF3 = V7/V6
   */
  v1: string | null;
  v2: string | null;
  v3: string | null;
  v4: string | null;
  v5: string | null;
  v6: string | null;
  v7: string | null;

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
