import type {
    CalculationEnergy
} from "./models/CalculationEnergy";

import type {
    SamplePreparationEnergy
} from "./models/SamplePreparationEnergy";


// ============================================================
// CREATE ENERGY CALCULATION
// ============================================================

export const createCalculationEnergy = (
    index: number
): CalculationEnergy => ({

    id:
        Date.now() + index,

    label:
        `Calculation ${index + 1}`,

    selectedSamplePreparationLabel:
        null,


    // ============================================================
    // ENERGY INPUT VALUES
    // ============================================================

    protein:
        null,

    carbohydrate:
        null,

    fat:
        null,


    // ============================================================
    // ENERGY FACTORS
    // ============================================================

    proteinFactor:
        4,

    carbohydrateFactor:
        4,

    fatFactor:
        9,


    // ============================================================
    // RESULT
    // ============================================================

    calculationResult:
        null,

    calculationResultUnit:
        "Kcal/100g",


    // ============================================================
    // ACCEPTANCE LIMIT
    // ============================================================

    acceptanceLimitMin:
        "",

    acceptanceLimitMax:
        ""

});


// ============================================================
// RESTORE ENERGY CALCULATION
// ============================================================

export const restoreCalculationEnergy = (
    data: any
): CalculationEnergy => {

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


        protein:
            source?.protein ??
            null,

        carbohydrate:
            source?.carbohydrate ??
            null,

        fat:
            source?.fat ??
            null,


        proteinFactor:
            source?.proteinFactor ??
            4,

        carbohydrateFactor:
            source?.carbohydrateFactor ??
            4,

        fatFactor:
            source?.fatFactor ??
            9,


        calculationResult:
            source?.calculationResult ??
            null,

        calculationResultUnit:
            source?.calculationResultUnit ??
            "Kcal/100g",


        acceptanceLimitMin:
            source?.acceptanceLimitMin ??
            "",

        acceptanceLimitMax:
            source?.acceptanceLimitMax ??
            ""

    };

};


// ============================================================
// CREATE ENERGY SAMPLE PREPARATION
// ============================================================

export const createSamplePreparationEnergy = (
    index: number
): SamplePreparationEnergy => ({

    id:
        Date.now() + index,

    label:
        `Sample Preparation ${index + 1}`,

    steps: [

        {
            name: "Protein",
            value1: "",
            unit1: "g/100g",
            logBookID: ""
        },

        {
            name: "Carbohydrate",
            value1: "",
            unit1: "g/100g",
            logBookID: ""
        },

        {
            name: "Fat",
            value1: "",
            unit1: "g/100g",
            logBookID: ""
        }

    ]

});