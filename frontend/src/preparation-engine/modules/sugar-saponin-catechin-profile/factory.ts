import type {
    CalculationSugarSaponinCatechinProfile
} from "./models/CalculationSugarSaponinCatechinProfile";

import type {
    SamplePreparationSugarSaponinCatechinProfile
} from "./models/SamplePreparationSugarSaponinCatechinProfile";


// ============================================================
// CREATE SUGAR / SAPONIN / CATECHIN PROFILE CALCULATION
// ============================================================

export const createCalculationSugarSaponinCatechinProfile = (
    index: number
): CalculationSugarSaponinCatechinProfile => ({

    id:
        Date.now() + index,

    label:
        `Calculation ${index + 1}`,

    selectedSamplePreparationLabel:
        null,


    // ============================================================
    // SUGAR / SAPONIN / CATECHIN PROFILE INPUT VALUES
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
// RESTORE SUGAR / SAPONIN / CATECHIN PROFILE CALCULATION
// ============================================================

export const restoreCalculationSugarSaponinCatechinProfile = (
    data: any
): CalculationSugarSaponinCatechinProfile => {

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
// CREATE SUGAR / SAPONIN / CATECHIN PROFILE SAMPLE PREPARATION
// ============================================================

export const createSamplePreparationSugarSaponinCatechinProfile = (
    index: number
): SamplePreparationSugarSaponinCatechinProfile => ({

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