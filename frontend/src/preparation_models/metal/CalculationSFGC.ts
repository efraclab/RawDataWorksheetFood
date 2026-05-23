/**
 * CalculationSFGC
 *
 * Formula:
 *   Content (%) = Instrument Conc. × Volume Makeup × DF1 × DF2 × DF3 × 1000 × 100
 *                 ──────────────────────────────────────────────────────────────────
 *                                       SW × 10000
 *
 * Notes:
 *   - No blank subtraction
 *   - No Label Claim
 *   - Volume Makeup = V1 (1st Dilution value1)
 *   - DF1 = V3 / V2   (2nd Dilution makeup / take)  — active only when V2 & V3 present
 *   - DF2 = V5 / V4   (3rd Dilution makeup / take)  — active only when V4 & V5 present
 *   - DF3 = V7 / V6   (4th Dilution makeup / take)  — active only when V6 & V7 present
 *   - SW  = Sample Weight in grams
 *   - Instrument Conc. converted to ppm internally
 */
export interface CalculationSFGC {
    id: number;
    label: string;
    selectedSamplePreparationLabel: string | null;

    instrumentConcentrationSample: string;
    instrumentConcentrationSampleUnit: string;  // "ppb" | "ppm" | "μg/L" | "mg/L"
    instrumentConcentrationBlank: string;
    instrumentConcentrationBlankUnit: string;   // "ppb" | "ppm" | "μg/L" | "mg/L"

    sw: string | null;   // grams

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

    acceptanceLimitMin: string | null;
    acceptanceLimitMax: string | null;

    calculationResult: string | null;
    calculationResultUnit: string;   // always "%"
}