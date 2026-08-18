import type {
    CalculationFattyAcidProfile
} from "./models/CalculationFattyAcidProfile";

import type {
    SamplePreparationFattyAcidProfile
} from "./models/SamplePreparationFattyAcidProfile";


// ============================================================
// CREATE FATTY ACID PROFILE CALCULATION
// ============================================================

export const createCalculationFattyAcidProfile = (
    index: number
): CalculationFattyAcidProfile => ({

    id:
        Date.now() + index,

    label:
        `Calculation ${index + 1}`,

    selectedSamplePreparationLabel:
        null,


    // ============================================================
    // FATTY ACID PROFILE INPUT VALUES
    // ============================================================

    sampleAreaPercent:
        null,

    fatContent:
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
// RESTORE FATTY ACID PROFILE CALCULATION
// ============================================================

export const restoreCalculationFattyAcidProfile = (
    data: any
): CalculationFattyAcidProfile => {

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
        // FATTY ACID PROFILE INPUT VALUES
        // ========================================================

        sampleAreaPercent:
            source?.sampleAreaPercent ??
            null,

        fatContent:
            source?.fatContent ??
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
// CREATE FATTY ACID PROFILE SAMPLE PREPARATION
// ============================================================

export const createSamplePreparationFattyAcidProfile = (
    index: number
): SamplePreparationFattyAcidProfile => ({

    id:
        Date.now() + index,

    label:
        `Sample Preparation ${index + 1}`,

    steps: [

        // ========================================================
        // 1. SAMPLE AREA %
        // ========================================================

        {
            name:
                "Sample Area %",

            value1:
                "",

            unit1:
                "%",

            logBookID:
                ""
        },


        // ========================================================
        // 2. FAT CONTENT
        // ========================================================

        {
            name:
                "Fat Content",

            value1:
                "",

            unit1:
                "g/100g",

            logBookID:
                ""
        }

    ]

});