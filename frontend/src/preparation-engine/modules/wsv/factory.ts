import type {
    CalculationWsv
} from "./models/CalculationWsv";

import type {
    SamplePreparationWsv
} from "./models/SamplePreparationWsv";


// ============================================================
// CREATE WSV CALCULATION
// ============================================================

export const createCalculationWsv = (
    index: number
): CalculationWsv => ({

    id:
        Date.now() + index,

    label:
        `Calculation ${index + 1}`,

    selectedSamplePreparationLabel:
        null,


    // ============================================================
    // WSV INPUT VALUES
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
// RESTORE WSV CALCULATION
// ============================================================

export const restoreCalculationWsv = (
    data: any
): CalculationWsv => {

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
// CREATE WSV SAMPLE PREPARATION
// ============================================================

export const createSamplePreparationWsv = (
    index: number
): SamplePreparationWsv => ({

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
        // 3. INSTRUMENT CONC
        // ========================================================

        {
            name:
                "Instrument Conc",

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
                "",

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