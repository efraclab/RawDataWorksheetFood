export interface CalculationCrudeFiber {

    id: number;

    label: string;


    // ============================================================
    // SAMPLE PREPARATION
    // ============================================================

    selectedSamplePreparationLabel:
        string | null;


    // ============================================================
    // CRUDE FIBER INPUT VALUES
    // ============================================================

    weightCrucibleAfterDrying:
        string | number | null;

    weightCrucibleAfterAshing:
        string | number | null;

    sampleWeight:
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