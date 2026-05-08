export interface CalculationLithosun300 {
  id: number;
  label: string;

  /** Label of the SamplePreparation whose V1/V2/V3 feed this calculation. */
  selectedSamplePreparationLabel: string | null;

  /** Auto-populated from selected sample preparation.
   *  V1 = 1st Dilution value1 (dissolution vessel volume, e.g. 900 mL)
   *  V2 = 2nd Dilution value1 (take volume, e.g. 25 mL)
   *  V3 = 2nd Dilution value2 (make-up volume, e.g. 50 mL)
   */
  v1: string | null;
  v2: string | null;
  v3: string | null;

  /** Conversion factor: Li → Li₂CO₃  (= 2×MW(Li)/MW(Li₂CO₃) ≈ 0.188). */
  conversionFactor: string;

  /** Label claim of the tablet (e.g. 300 for Lithosun 300). */
  labelClaim: string;
  labelClaimUnit: string;   // "mg" | "g" | "kg"

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
  calculationResultUnit: string | null;   // "% of L.C."
}
