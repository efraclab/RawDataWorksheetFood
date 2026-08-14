import type {
    CalculationAcidValue
} from "./models/CalculationAcidValue";

import type {
    SamplePreparationAcidValue
} from "./models/SamplePreparationAcidValue";


// ============================================================
// CREATE ACID VALUE CALCULATION
// ============================================================

export const createCalculationAcidValue = (
    index: number
): CalculationAcidValue => ({

    id:
        Date.now() + index,

    label:
        `Calculation ${index + 1}`,

    selectedSamplePreparationLabel:
        null,


    // ============================================================
    // ACID VALUE INPUT VALUES
    // ============================================================

    sampleWeight:
        null,

    sampleTitreValue:
        null,

    normality:
        null,

    factor:
        null,


    // ============================================================
    // RESULT
    // ============================================================

    calculationResult:
        null,

    calculationResultUnit:
        "",


    // ============================================================
    // ACCEPTANCE LIMIT
    // ============================================================

    acceptanceLimitMin:
        "",

    acceptanceLimitMax:
        ""

});


// ============================================================
// RESTORE ACID VALUE CALCULATION
// ============================================================

export const restoreCalculationAcidValue = (
    data: any
): CalculationAcidValue => {

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

        normality:
            source?.normality ??
            null,

        factor:
            source?.factor ??
            null,


        // ========================================================
        // RESULT
        // ========================================================

        calculationResult:
            source?.calculationResult ??
            null,

        calculationResultUnit:
            source?.calculationResultUnit ??
            "",


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
// CREATE ACID VALUE SAMPLE PREPARATION
// ============================================================

export const createSamplePreparationAcidValue = (
    index: number
): SamplePreparationAcidValue => ({

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
        // 3. NORMALITY
        // ========================================================

        {
            name:
                "Normality",

            value1:
                "",

            unit1:
                "N",

            logBookID:
                ""
        },


        // ========================================================
        // 4. FACTOR
        // ========================================================

        {
            name:
                "Factor",

            value1:
                "",

            unit1:
                "",

            logBookID:
                ""
        }

    ]

});