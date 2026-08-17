import type {
    CalculationFreeFattyAcid
} from "./models/CalculationFreeFattyAcid";

import type {
    SamplePreparationFreeFattyAcid
} from "./models/SamplePreparationFreeFattyAcid";


// ============================================================
// CREATE FREE FATTY ACID CALCULATION
// ============================================================

export const createCalculationFreeFattyAcid = (
    index: number
): CalculationFreeFattyAcid => ({

    id:
        Date.now() + index,

    label:
        `Calculation ${index + 1}`,

    selectedSamplePreparationLabel:
        null,


    // ============================================================
    // FREE FATTY ACID INPUT VALUES
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
// RESTORE FREE FATTY ACID CALCULATION
// ============================================================

export const restoreCalculationFreeFattyAcid = (
    data: any
): CalculationFreeFattyAcid => {

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
// CREATE FREE FATTY ACID SAMPLE PREPARATION
// ============================================================

export const createSamplePreparationFreeFattyAcid = (
    index: number
): SamplePreparationFreeFattyAcid => ({

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
        // 3. NORMALITY OF HCL
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