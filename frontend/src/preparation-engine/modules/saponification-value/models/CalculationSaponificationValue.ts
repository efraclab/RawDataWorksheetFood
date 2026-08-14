export interface CalculationSaponificationValue {

    id: number;

    label: string;


    // ============================================================
    // SAMPLE PREPARATION
    // ============================================================

    selectedSamplePreparationLabel:
        string | null;


    // ============================================================
    // SAPONIFICATION VALUE INPUT VALUES
    // ============================================================

    sampleWeight:
        string | number | null;

    sampleTitreValue:
        string | number | null;

    blankTitreValue:
        string | number | null;

    normality:
        string | number | null;

    factor:
        string | number | null;


    // ============================================================
    // RESULT
    // ============================================================

    calculationResult:
        number | null;

    calculationResultUnit:
        string;


    // ============================================================
    // ACCEPTANCE LIMIT
    // ============================================================

    acceptanceLimitMin:
        string;

    acceptanceLimitMax:
        string;
}