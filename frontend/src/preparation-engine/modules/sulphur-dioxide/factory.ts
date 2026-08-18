import type {
    CalculationSulphurDioxide
} from "./models/CalculationSulphurDioxide";

import type {
    SamplePreparationSulphurDioxide
} from "./models/SamplePreparationSulphurDioxide";


// ============================================================
// CREATE SULPHUR DIOXIDE CALCULATION
// ============================================================

export const createCalculationSulphurDioxide = (
    index: number
): CalculationSulphurDioxide => ({

    id:
        Date.now() + index,

    label:
        `Calculation ${index + 1}`,

    selectedSamplePreparationLabel:
        null,

    sampleWeight:
        null,

    sampleTitreValue:
        null,

    blankTitreValue:
        null,

    normality:
        null,

    factor:
        32.03,

    calculationResult:
        null,

    calculationResultUnit:
        "",

    acceptanceLimitMin:
        "",

    acceptanceLimitMax:
        ""

});


// ============================================================
// RESTORE SULPHUR DIOXIDE CALCULATION
// ============================================================

export const restoreCalculationSulphurDioxide = (
    data: any
): CalculationSulphurDioxide => {

    let source =
        data?.data ??
        data;

    if (typeof source === "string") {

        try {

            source =
                JSON.parse(source);

        } catch {

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
            32.03,

        calculationResult:
            source?.calculationResult ??
            null,

        calculationResultUnit:
            source?.calculationResultUnit ??
            "",

        acceptanceLimitMin:
            source?.acceptanceLimitMin ??
            "",

        acceptanceLimitMax:
            source?.acceptanceLimitMax ??
            ""

    };

};


// ============================================================
// CREATE SULPHUR DIOXIDE SAMPLE PREPARATION
// ============================================================

export const createSamplePreparationSulphurDioxide = (
    index: number
): SamplePreparationSulphurDioxide => ({

    id:
        Date.now() + index,

    label:
        `Sample Preparation ${index + 1}`,

    steps: [

        // ========================================================
        // 1. SAMPLE WT
        // ========================================================

        {
            name:
                "Sample wt",

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
        // 4. NORMALITY OF 0.01 N NAOH
        // ========================================================

        {
            name:
                "Normality of 0.01 N NaOH",

            value1:
                "",

            unit1:
                "ml",

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
                "32.03",

            unit1:
                "--",

            logBookID:
                ""
        }

    ]

});
