export interface CalculationUricAcid {

    id: number;

    label: string;


    // ============================================================
    // SAMPLE PREPARATION
    // ============================================================

    selectedSamplePreparationLabel:
        string | null;


    // ============================================================
    // URIC ACID INPUT VALUES
    // ============================================================

    sampleWeight:
        string | number | null;

    volume:
        string | number | null;

    instrumentConcentration:
        string | number | null;

    dilutionFactor:
        string | number | null;

    purity:
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