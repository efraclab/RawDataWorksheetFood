
export interface CalculationMeropenam {
  id: number;
  label: string;
  selectedSamplePreparationLabel: string | null;

  instrumentConcentrationSample: string;
  instrumentConcentrationSampleUnit: string;   // "ppb" | "ppm" | "μg/L" | "mg/L"
  instrumentConcentrationBlank: string;
  instrumentConcentrationBlankUnit: string;   // "ppb" | "ppm" | "μg/L" | "mg/L"

  sw: string | null;   // grams

  labelClaim: string;
  labelClaimUnit: string;   // "mg" | "g" | "kg"

  /**
   * Auto-populated from the selected sample preparation.
   *   V1 = 1st Dilution value1 (Volume Makeup)
   *   V2 = 2nd Dilution value1 (take)
   *   V3 = 2nd Dilution value2 (makeup)  → DF1 = V3 / V2
   *   V4 = 3rd Dilution value1 (take)
   *   V5 = 3rd Dilution value2 (makeup)  → DF2 = V5 / V4
   *   V6 = 4th Dilution value1 (take)
   *   V7 = 4th Dilution value2 (makeup)  → DF3 = V7 / V6
   */
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
  calculationResultUnit: string;   // always "% of L.C."
}