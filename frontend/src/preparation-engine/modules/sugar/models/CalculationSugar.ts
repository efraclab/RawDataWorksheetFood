export interface CalculationSugar {

    id: number;

    label: string;

    selectedSamplePreparationLabel: string | null;

    // ============================================
    // SUGAR VALUES
    // ============================================

    sampleWeight: number | string | null;

    volumeMakeUp1: number | string | null;

    sampleTitreValue: number | string | null;

    dilutionFactor: number | string | null;

    stdDextroseWeight: number | string | null;

    volumeMakeUp2: number | string | null;

    standardTitre: number | string | null;

    aliquot: number | string | null;

    // ============================================
    // CALCULATED
    // ============================================

    fehlingFactor: number | null;

    // ============================================
    // CONSTANT
    // ============================================

    multiplier100: number;

    // ============================================
    // ACCEPTANCE
    // ============================================

    acceptanceLimitMin: string | number;

    acceptanceLimitMax: string | number;

    // ============================================
    // RESULT
    // ============================================

    calculationResult: number | null;

    calculationResultUnit: string;
}