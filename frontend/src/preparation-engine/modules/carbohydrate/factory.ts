import type {
    CalculationCarbohydrate
} from "./models/CalculationCarbohydrate";

import type {
    SamplePreparationCarbohydrate
} from "./models/SamplePreparationCarbohydrate";


// ============================================================
// CREATE CARBOHYDRATE CALCULATION
// ============================================================

export const createCalculationCarbohydrate = (
    index: number
): CalculationCarbohydrate => ({

    id:
        Date.now() + index,

    label:
        `Calculation ${index + 1}`,

    selectedSamplePreparationLabel:
        null,


    // ============================================================
    // CARBOHYDRATE INPUT VALUES
    // ============================================================

    moisture:
        null,

    fat:
        null,

    ash:
        null,

    protein:
        null,


    // ============================================================
    // RESULT
    // ============================================================

    calculationResult:
        null,

    calculationResultUnit:
        "g/100g",


    // ============================================================
    // ACCEPTANCE LIMIT
    // ============================================================

    acceptanceLimitMin:
        "",

    acceptanceLimitMax:
        ""

});


// ============================================================
// RESTORE CARBOHYDRATE CALCULATION
// ============================================================

export const restoreCalculationCarbohydrate = (
    data: any
): CalculationCarbohydrate => {

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
        // INPUT VALUES
        // ========================================================

        moisture:
            source?.moisture ??
            null,

        fat:
            source?.fat ??
            null,

        ash:
            source?.ash ??
            null,

        protein:
            source?.protein ??
            null,


        // ========================================================
        // RESULT
        // ========================================================

        calculationResult:
            source?.calculationResult ??
            null,

        calculationResultUnit:
            source?.calculationResultUnit ??
            "g/100g",


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
// CREATE CARBOHYDRATE SAMPLE PREPARATION
// ============================================================

export const createSamplePreparationCarbohydrate = (
    index: number
): SamplePreparationCarbohydrate => ({

    id:
        Date.now() + index,

    label:
        `Sample Preparation ${index + 1}`,

    steps: [

        {
            name: "Moisture",
            value1: "",
            unit1: "g/100g",
            logBookID: ""
        },

        {
            name: "Fat",
            value1: "",
            unit1: "g/100g",
            logBookID: ""
        },

        {
            name: "Ash",
            value1: "",
            unit1: "g/100g",
            logBookID: ""
        },

        {
            name: "Protein",
            value1: "",
            unit1: "g/100g",
            logBookID: ""
        }

    ]

});