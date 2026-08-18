import type {
    CalculationAminoAcid
} from "./models/CalculationAminoAcid";

import type {
    SamplePreparationAminoAcid
} from "./models/SamplePreparationAminoAcid";


// ============================================================
// CREATE AMINO ACID CALCULATION
// ============================================================

export const createCalculationAminoAcid = (
    index: number
): CalculationAminoAcid => ({

    id:
        Date.now() + index,

    label:
        `Calculation ${index + 1}`,

    selectedSamplePreparationLabel:
        null,


    // ============================================================
    // AMINO ACID INPUT VALUES
    // ============================================================

    sampleArea:
        null,

    standardConcentration:
        null,

    sampleDilutionFactor:
        null,

    purity:
        null,

    standardArea:
        null,

    sampleWeight:
        null,

    protein:
        null,

    sampleVolume:
        null,


    // ============================================================
    // RESULT
    // ============================================================

    calculationResult:
        null,

    calculationResultUnit:
        "g/100g",


    // ============================================================
    // ACCEPTANCE LIMIT
    // ============================================================

    acceptanceLimitMin:
        "",

    acceptanceLimitMax:
        ""

});


// ============================================================
// RESTORE AMINO ACID CALCULATION
// ============================================================

export const restoreCalculationAminoAcid = (
    data: any
): CalculationAminoAcid => {

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
        // AMINO ACID INPUT VALUES
        // ========================================================

        sampleArea:
            source?.sampleArea ??
            null,

        standardConcentration:
            source?.standardConcentration ??
            null,

        sampleDilutionFactor:
            source?.sampleDilutionFactor ??
            null,

        purity:
            source?.purity ??
            null,

        standardArea:
            source?.standardArea ??
            null,

        sampleWeight:
            source?.sampleWeight ??
            null,

        protein:
            source?.protein ??
            null,

        sampleVolume:
            source?.sampleVolume ??
            null,


        // ========================================================
        // RESULT
        // ========================================================

        calculationResult:
            source?.calculationResult ??
            null,

        calculationResultUnit:
            source?.calculationResultUnit ??
            "g/100g",


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
// CREATE AMINO ACID SAMPLE PREPARATION
// ============================================================

export const createSamplePreparationAminoAcid = (
    index: number
): SamplePreparationAminoAcid => ({

    id:
        Date.now() + index,

    label:
        `Sample Preparation ${index + 1}`,

    steps: [

        // ========================================================
        // 1. SAMPLE AREA
        // ========================================================

        {
            name:
                "Sample Area",

            value1:
                "",

            unit1:
                "",

            logBookID:
                ""
        },


        // ========================================================
        // 2. STANDARD CONCENTRATION
        // ========================================================

        {
            name:
                "Standard Conc.",

            value1:
                "",

            unit1:
                "",

            logBookID:
                ""
        },


        // ========================================================
        // 3. SAMPLE DILUTION FACTOR
        // ========================================================

        {
            name:
                "Sample Dilution Factor",

            value1:
                "",

            unit1:
                "",

            logBookID:
                ""
        },


        // ========================================================
        // 4. PURITY
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
        },


        // ========================================================
        // 5. STANDARD AREA
        // ========================================================

        {
            name:
                "Standard Area",

            value1:
                "",

            unit1:
                "",

            logBookID:
                ""
        },


        // ========================================================
        // 6. WEIGHT OF SAMPLE
        // ========================================================

        {
            name:
                "Weight Of Sample in g",

            value1:
                "",

            unit1:
                "g",

            logBookID:
                ""
        },


        // ========================================================
        // 7. PROTEIN
        // ========================================================

        {
            name:
                "Protein",

            value1:
                "",

            unit1:
                "%",

            logBookID:
                ""
        },


        // ========================================================
        // 8. SAMPLE VOLUME
        // ========================================================

        {
            name:
                "Sample Volume",

            value1:
                "",

            unit1:
                "ml",

            logBookID:
                ""
        }

    ]

});