export interface CalculationMoisture {

    id: number;

    label: string;


    // ============================================================
    // SAMPLE PREPARATION
    // ============================================================

    selectedSamplePreparationLabel:
        string | null;


    // ============================================================
    // MOISTURE INPUT VALUES
    // ============================================================

    // W1 - Weight of Empty Dish
    emptyDishWeight:
        string | number | null;

    // W2 - Weight of Sample + Dish
    samplePlusDishWeight:
        string | number | null;

    // W3 - Weight of Sample + Dish after Drying
    samplePlusDishAfterDryingWeight:
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