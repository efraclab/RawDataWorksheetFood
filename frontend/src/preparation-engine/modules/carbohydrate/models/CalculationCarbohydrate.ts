export interface CalculationCarbohydrate {

    id: number;

    label: string;


    // ============================================================
    // SAMPLE PREPARATION
    // ============================================================

    selectedSamplePreparationLabel:
        string | null;


    // ============================================================
    // CARBOHYDRATE INPUT VALUES
    // ============================================================

    moisture:
        string | number | null;

    fat:
        string | number | null;

    ash:
        string | number | null;

    protein:
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