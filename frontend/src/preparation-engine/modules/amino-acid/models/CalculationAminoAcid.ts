export interface CalculationAminoAcid {

    id: number;

    label: string;


    // ============================================================
    // SAMPLE PREPARATION
    // ============================================================

    selectedSamplePreparationLabel:
        string | null;


    // ============================================================
    // AMINO ACID INPUT VALUES
    // ============================================================

    sampleArea:
        string | number | null;

    standardConcentration:
        string | number | null;

    sampleDilutionFactor:
        string | number | null;

    purity:
        string | number | null;

    standardArea:
        string | number | null;

    sampleWeight:
        string | number | null;

    protein:
        string | number | null;

    sampleVolume:
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