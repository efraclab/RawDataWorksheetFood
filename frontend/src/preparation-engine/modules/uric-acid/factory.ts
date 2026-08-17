import type {
    CalculationUricAcid
} from "./models/CalculationUricAcid";

import type {
    SamplePreparationUricAcid
} from "./models/SamplePreparationUricAcid";


// ============================================================
// CREATE URIC ACID CALCULATION
// ============================================================

export const createCalculationUricAcid = (
    index: number
): CalculationUricAcid => ({

    id:
        Date.now() + index,

    label:
        `Calculation ${index + 1}`,

    selectedSamplePreparationLabel:
        null,


    // ============================================================
    // URIC ACID INPUT VALUES
    // ============================================================

    sampleWeight:
        null,

    volume:
        null,

    instrumentConcentration:
        null,

    dilutionFactor:
        null,

    purity:
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
// RESTORE URIC ACID CALCULATION
// ============================================================

export const restoreCalculationUricAcid = (
    data: any
): CalculationUricAcid => {

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

        volume:
            source?.volume ??
            null,

        instrumentConcentration:
            source?.instrumentConcentration ??
            null,

        dilutionFactor:
            source?.dilutionFactor ??
            null,

        purity:
            source?.purity ??
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
// CREATE URIC ACID SAMPLE PREPARATION
// ============================================================

export const createSamplePreparationUricAcid = (
    index: number
): SamplePreparationUricAcid => ({

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
        // 2. VOLUME
        // ========================================================

        {
            name:
                "Volume",

            value1:
                "",

            unit1:
                "ml",

            logBookID:
                ""
        },


        // ========================================================
        // 3. INSTRUMENT CONCENTRATION
        // ========================================================

        {
            name:
                "Instrument Concentration",

            value1:
                "",

            unit1:
                "ppm",

            logBookID:
                ""
        },


        // ========================================================
        // 4. DILUTION FACTOR
        // ========================================================

        {
            name:
                "Dilution Factor",

            value1:
                "",

            unit1:
                "ml",

            logBookID:
                ""
        },


        // ========================================================
        // 5. PURITY
        // ========================================================

        {
            name:
                "Purity",

            value1:
                "",

            unit1:
                "%",

            logBookID:
                ""
        }

    ]

});