import type {
    CalculationPeroxideValue
} from "./models/CalculationPeroxideValue";

import type {
    SamplePreparationPeroxideValue
} from "./models/SamplePreparationPeroxideValue";


// ============================================================
// CREATE PEROXIDE VALUE CALCULATION
// ============================================================

export const createCalculationPeroxideValue = (
    index: number
): CalculationPeroxideValue => ({

    id:
        Date.now() + index,

    label:
        `Calculation ${index + 1}`,

    selectedSamplePreparationLabel:
        null,


    // ============================================================
    // PEROXIDE VALUE INPUT VALUES
    // ============================================================

    sampleWeight:
        null,

    sampleTitreValue:
        null,

    blankTitreValue:
        null,

    normality:
        null,


    // ============================================================
    // RESULT
    // ============================================================

    calculationResult:
        null,

    calculationResultUnit:
        "meq/kg",


    // ============================================================
    // ACCEPTANCE LIMIT
    // ============================================================

    acceptanceLimitMin:
        "",

    acceptanceLimitMax:
        ""

});


// ============================================================
// RESTORE PEROXIDE VALUE CALCULATION
// ============================================================

export const restoreCalculationPeroxideValue = (
    data: any
): CalculationPeroxideValue => {

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

        sampleWeight:
            source?.sampleWeight ??
            null,

        sampleTitreValue:
            source?.sampleTitreValue ??
            null,

        blankTitreValue:
            source?.blankTitreValue ??
            null,

        normality:
            source?.normality ??
            null,


        // ========================================================
        // RESULT
        // ========================================================

        calculationResult:
            source?.calculationResult ??
            null,

        calculationResultUnit:
            source?.calculationResultUnit ??
            "meq/kg",


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
// CREATE PEROXIDE VALUE SAMPLE PREPARATION
// ============================================================

export const createSamplePreparationPeroxideValue = (
    index: number
): SamplePreparationPeroxideValue => ({

    id:
        Date.now() + index,

    label:
        `Sample Preparation ${index + 1}`,

    steps: [

        // ========================================================
        // 1. SAMPLE WEIGHT
        // ========================================================

        {
            name:
                "Sample Weight",

            value1:
                "",

            unit1:
                "g",

            logBookID:
                ""
        },


        // ========================================================
        // 2. SAMPLE TITRE VALUE
        // ========================================================

        {
            name:
                "Sample Titre Value",

            value1:
                "",

            unit1:
                "ml",

            logBookID:
                ""
        },


        // ========================================================
        // 3. BLANK TITRE VALUE
        // ========================================================

        {
            name:
                "Blank Titre Value",

            value1:
                "",

            unit1:
                "ml",

            logBookID:
                ""
        },


        // ========================================================
        // 4. NORMALITY
        // ========================================================

        {
            name:
                "Normality",

            value1:
                "",

            unit1:
                "",

            logBookID:
                ""
        }

    ]

});