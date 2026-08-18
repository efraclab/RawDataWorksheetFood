import type {
    CalculationMoisture
} from "./models/CalculationMoisture";

import type {
    SamplePreparationMoisture
} from "./models/SamplePreparationMoisture";


// ============================================================
// CREATE MOISTURE CALCULATION
// ============================================================

export const createCalculationMoisture = (
    index: number
): CalculationMoisture => ({

    id:
        Date.now() + index,

    label:
        `Calculation ${index + 1}`,

    selectedSamplePreparationLabel:
        null,


    // ============================================================
    // MOISTURE INPUT VALUES
    // ============================================================

    // W1 - Weight of Empty Dish
    emptyDishWeight:
        null,

    // W2 - Weight of Sample + Dish
    samplePlusDishWeight:
        null,

    // W3 - Weight of Sample + Dish after Drying
    samplePlusDishAfterDryingWeight:
        null,


    // ============================================================
    // RESULT
    // ============================================================

    calculationResult:
        null,

    calculationResultUnit:
        "%",


    // ============================================================
    // ACCEPTANCE LIMIT
    // ============================================================

    acceptanceLimitMin:
        "",

    acceptanceLimitMax:
        ""

});


// ============================================================
// RESTORE MOISTURE CALCULATION
// ============================================================

export const restoreCalculationMoisture = (
    data: any
): CalculationMoisture => {

    let source =
        data?.data ??
        data;


    if (
        typeof source === "string"
    ) {

        try {

            source =
                JSON.parse(source);

        }
        catch {

            source = {};

        }

    }


    return {

        id:
            source?.id ??
            data?.id ??
            Date.now(),

        label:
            source?.label ??
            data?.label ??
            "Calculation 1",


        selectedSamplePreparationLabel:
            source?.selectedSamplePreparationLabel ??
            null,


        // ========================================================
        // MOISTURE INPUT VALUES
        // ========================================================

        // W1
        emptyDishWeight:
            source?.emptyDishWeight ??
            null,

        // W2
        samplePlusDishWeight:
            source?.samplePlusDishWeight ??
            null,

        // W3
        samplePlusDishAfterDryingWeight:
            source?.samplePlusDishAfterDryingWeight ??
            null,


        // ========================================================
        // RESULT
        // ========================================================

        calculationResult:
            source?.calculationResult ??
            null,

        calculationResultUnit:
            source?.calculationResultUnit ??
            "%",


        // ========================================================
        // ACCEPTANCE LIMIT
        // ========================================================

        acceptanceLimitMin:
            source?.acceptanceLimitMin ??
            "",

        acceptanceLimitMax:
            source?.acceptanceLimitMax ??
            ""

    };

};


// ============================================================
// CREATE MOISTURE SAMPLE PREPARATION
// ============================================================

export const createSamplePreparationMoisture = (
    index: number
): SamplePreparationMoisture => ({

    id:
        Date.now() + index,

    label:
        `Sample Preparation ${index + 1}`,

    steps: [

        // ========================================================
        // 1. W1 - WEIGHT OF EMPTY DISH
        // ========================================================

        {
            name:
                "Weight of Empty Dish",

            value1:
                "",

            unit1:
                "g",

            logBookID:
                ""
        },


        // ========================================================
        // 2. W2 - WEIGHT OF SAMPLE + DISH
        // ========================================================

        {
            name:
                "Weight of Sample + Dish",

            value1:
                "",

            unit1:
                "g",

            logBookID:
                ""
        },


        // ========================================================
        // 3. AFTER DRYING
        // ========================================================

        {
            name:
                "After Drying",

            value1:
                "",

            unit1:
                "°C",

            value2:
                "",

            unit2:
                "min",

            logBookID:
                ""
        },


        // ========================================================
        // 4. W3 - WEIGHT OF SAMPLE + DISH AFTER DRYING
        // ========================================================

        {
            name:
                "Weight of Sample + Dish after Drying",

            value1:
                "",

            unit1:
                "g",

            logBookID:
                ""
        }

    ]

});