/**
 * CalculationTalc
 *
 * Formula:
 *   Content (%) = (Instrument Conc. Sample − Instrument Conc. Blank) × V1 × DF1 × DF2 × DF3
 *                 ───────────────────────────────────────────────────────────────────────────
 *                                         SW × 10000
 *
 * Where:
 *   V1  = 1st Dilution value1 (make-up volume)  ← multiplied directly in numerator
 *   DF1 = V3 / V2   (2nd Dilution: make-up / take)   — only if both V2 & V3 present
 *   DF2 = V5 / V4   (3rd Dilution: make-up / take)   — only if both V4 & V5 present
 *   DF3 = V7 / V6   (4th Dilution: make-up / take)   — only if both V6 & V7 present
 *   SW  = Sample Weight (g)
 *
 * All concentrations are converted to ppm internally before calculation.
 * Missing optional factors (V1, DF1, DF2, DF3) are treated as ×1.
 */
export interface CalculationTalc {
  id: number;
  label: string;

  /** Linked sample preparation label */
  selectedSamplePreparationLabel: string | null;

  // ─── Instrument concentrations ────────────────────────────────────────────
  instrumentConcentrationSample: string;
  instrumentConcentrationSampleUnit: string;   // "ppb" | "ppm" | "μg/L" | "mg/L"
  instrumentConcentrationBlank: string;
  instrumentConcentrationBlankUnit: string;    // "ppb" | "ppm" | "μg/L" | "mg/L"

  sw: string | null;   // grams — required for result

  v1: string | null;
  v2: string | null;
  v3: string | null;
  v4: string | null;
  v5: string | null;
  v6: string | null;
  v7: string | null;

  // ─── Acceptance limits ────────────────────────────────────────────────────
  acceptanceLimitMin: string | null;
  acceptanceLimitMax: string | null;

  // ─── Computed outputs ─────────────────────────────────────────────────────
  calculationResult: string | null;
  calculationResultUnit: string;   // always "%"
}