export interface CalculationDietaryFiber {

    id: number;

    label: string;


    // ============================================================
    // SAMPLE PREPARATION
    // ============================================================

    selectedSamplePreparationLabel:
        string | null;


    // ============================================================
    // DIETARY FIBER INPUT VALUES
    // ============================================================

    sampleWeightW1:
        string | number | null;

    sampleWeightW2:
        string | number | null;

    emptyCrucibleW1:
        string | number | null;

    emptyCrucibleW2:
        string | number | null;

    crucibleResidueW1:
        string | number | null;

    crucibleResidueW2:
        string | number | null;

    afterAshing:
        string | number | null;

    sampleTitreValue:
        string | number | null;

    blankTitreValue:
        string | number | null;

    normality:
        string | number | null;

    blankWeight:
        string | number | null;


    // ============================================================
    // AUTO CALCULATED VALUES
    // ============================================================

    avgSampleWeight:
        number | null;

    residueWeightW1:
        number | null;

    residueWeightW2:
        number | null;

    avgResidueWeight:
        number | null;

    ashPercentage:
        number | null;

    ashWeight:
        number | null;

    proteinPercentage:
        number | null;

    proteinWeight:
        number | null;


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
