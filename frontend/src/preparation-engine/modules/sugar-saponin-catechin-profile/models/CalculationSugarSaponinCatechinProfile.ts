export interface CalculationSugarSaponinCatechinProfile {

    id: number;

    label: string;


    // ============================================================
    // SAMPLE PREPARATION
    // ============================================================

    selectedSamplePreparationLabel:
        string | null;


    // ============================================================
    // SUGAR / SAPONIN / CATECHIN PROFILE INPUT VALUES
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