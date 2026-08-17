import type {
    CalculationUnsapMatter
} from "./models/CalculationUnsapMatter";

import type {
    SamplePreparationUnsapMatter
} from "./models/SamplePreparationUnsapMatter";


// ============================================================
// CREATE UNSAPONIFIABLE MATTER CALCULATION
// ============================================================

export const createCalculationUnsapMatter = (
    index: number
): CalculationUnsapMatter => ({

    id:
        Date.now() + index,

    label:
        `Calculation ${index + 1}`,

    selectedSamplePreparationLabel:
        null,


    // ============================================================
    // UNSAPONIFIABLE MATTER INPUT VALUES
    // ============================================================

    sampleWeight:
        null,

    emptyFlaskWeight:
        null,

    residueAndEmptyFlaskWeight:
        null,

    normality:
        null,

    titreValue:
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
// RESTORE UNSAPONIFIABLE MATTER CALCULATION
// ============================================================

export const restoreCalculationUnsapMatter = (
    data: any
): CalculationUnsapMatter => {

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

        emptyFlaskWeight:
            source?.emptyFlaskWeight ??
            null,

        residueAndEmptyFlaskWeight:
            source?.residueAndEmptyFlaskWeight ??
            null,

        normality:
            source?.normality ??
            null,

        titreValue:
            source?.titreValue ??
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
// CREATE UNSAPONIFIABLE MATTER SAMPLE PREPARATION
// ============================================================

export const createSamplePreparationUnsapMatter = (
    index: number
): SamplePreparationUnsapMatter => ({

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
        // 2. EMPTY FLASK WEIGHT
        // ========================================================

        {
            name:
                "Weight of Empty Flask",

            value1:
                "",

            unit1:
                "g",

            logBookID:
                ""
        },


        // ========================================================
        // 3. RESIDUE + EMPTY FLASK WEIGHT
        // ========================================================

        {
            name:
                "Weight of Residue + Empty Flask",

            value1:
                "",

            unit1:
                "g",

            logBookID:
                ""
        },


        // ========================================================
        // 4. NORMALITY
        // ========================================================

        {
            name:
                "Normality of 0.02 N NaOH",

            value1:
                "",

            unit1:
                "N",

            logBookID:
                ""
        },


        // ========================================================
        // 5. TITRE VALUE
        // ========================================================

        {
            name:
                "Titre Value",

            value1:
                "",

            unit1:
                "ml",

            logBookID:
                ""
        },


        // ========================================================
        // 6. FACTOR
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