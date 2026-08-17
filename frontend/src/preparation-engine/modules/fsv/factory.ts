import type {
    CalculationFSV
} from "./models/CalculationFSV";

import type {
    SamplePreparationFSV
} from "./models/SamplePreparationFSV";


// ============================================================
// CREATE FSV CALCULATION
// ============================================================

export const createCalculationFSV = (
    index: number
): CalculationFSV => ({

    id:
        Date.now() + index,

    label:
        `Calculation ${index + 1}`,

    selectedSamplePreparationLabel:
        null,


    // ============================================================
    // FSV INPUT VALUES
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
        "mcg/100g",


    // ============================================================
    // ACCEPTANCE LIMIT
    // ============================================================

    acceptanceLimitMin:
        "",

    acceptanceLimitMax:
        ""

});


// ============================================================
// RESTORE FSV CALCULATION
// ============================================================

export const restoreCalculationFSV = (
    data: any
): CalculationFSV => {

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


        // ========================================================
        // SAMPLE PREPARATION
        // ========================================================

        selectedSamplePreparationLabel:
            source?.selectedSamplePreparationLabel ??
            null,


        // ========================================================
        // FSV INPUT VALUES
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
            "mcg/100g",


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
// CREATE FSV SAMPLE PREPARATION
// ============================================================

export const createSamplePreparationFSV = (
    index: number
): SamplePreparationFSV => ({

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