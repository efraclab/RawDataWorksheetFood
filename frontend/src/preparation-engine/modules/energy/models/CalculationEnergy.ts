export interface CalculationEnergy {

    id: number;

    label: string;


    // ============================================================
    // SAMPLE PREPARATION
    // ============================================================

    selectedSamplePreparationLabel:
        string | null;


    // ============================================================
    // ENERGY INPUT VALUES
    // ============================================================

    protein:
        string | number | null;

    carbohydrate:
        string | number | null;

    fat:
        string | number | null;


    // ============================================================
    // ENERGY FACTORS
    // ============================================================

    proteinFactor:
        number;

    carbohydrateFactor:
        number;

    fatFactor:
        number;


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