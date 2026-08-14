import type {
    CalculationSaponificationValue
} from "./models/CalculationSaponificationValue";

import type {
    SamplePreparationSaponificationValue
} from "./models/SamplePreparationSaponificationValue";


// ============================================================
// CREATE SAPONIFICATION VALUE CALCULATION
// ============================================================

export const createCalculationSaponificationValue = (
    index: number
): CalculationSaponificationValue => ({

    id:
        Date.now() + index,

    label:
        `Calculation ${index + 1}`,

    selectedSamplePreparationLabel:
        null,


    // ============================================================
    // SAPONIFICATION VALUE INPUT VALUES
    // ============================================================

    sampleWeight:
        null,

    sampleTitreValue:
        null,

    blankTitreValue:
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
// RESTORE SAPONIFICATION VALUE CALCULATION
// ============================================================

export const restoreCalculationSaponificationValue = (
    data: any
): CalculationSaponificationValue => {

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
// CREATE SAPONIFICATION VALUE SAMPLE PREPARATION
// ============================================================

export const createSamplePreparationSaponificationValue = (
    index: number
): SamplePreparationSaponificationValue => ({

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
                "Normality of HCL",

            value1:
                "",

            unit1:
                "N",

            logBookID:
                ""
        },


        // ========================================================
        // 5. FACTOR
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