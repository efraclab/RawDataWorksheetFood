export interface CalculationUnsapMatter {

    id: number;

    label: string;


    // ============================================================
    // SAMPLE PREPARATION
    // ============================================================

    selectedSamplePreparationLabel:
        string | null;


    // ============================================================
    // UNSAPONIFIABLE MATTER INPUT VALUES
    // ============================================================

    sampleWeight:
        string | number | null;

    emptyFlaskWeight:
        string | number | null;

    residueAndEmptyFlaskWeight:
        string | number | null;

    normality:
        string | number | null;

    titreValue:
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