import type {
    CalculationCrudeFiber
} from "./models/CalculationCrudeFiber";

import type {
    SamplePreparationCrudeFiber
} from "./models/SamplePreparationCrudeFiber";


// ============================================================
// CREATE CRUDE FIBER CALCULATION
// ============================================================

export const createCalculationCrudeFiber = (
    index: number
): CalculationCrudeFiber => ({

    id:
        Date.now() + index,

    label:
        `Calculation ${index + 1}`,

    selectedSamplePreparationLabel:
        null,


    // ============================================================
    // CRUDE FIBER INPUT VALUES
    // ============================================================

    weightCrucibleAfterDrying:
        null,

    weightCrucibleAfterAshing:
        null,

    sampleWeight:
        null,


    // ============================================================
    // RESULT
    // ============================================================

    calculationResult:
        null,

    calculationResultUnit:
        "%",


    // ============================================================
    // ACCEPTANCE LIMIT
    // ============================================================

    acceptanceLimitMin:
        "",

    acceptanceLimitMax:
        ""

});


// ============================================================
// RESTORE CRUDE FIBER CALCULATION
// ============================================================

export const restoreCalculationCrudeFiber = (
    data: any
): CalculationCrudeFiber => {

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

        weightCrucibleAfterDrying:
            source?.weightCrucibleAfterDrying ??
            null,

        weightCrucibleAfterAshing:
            source?.weightCrucibleAfterAshing ??
            null,

        sampleWeight:
            source?.sampleWeight ??
            null,


        // ========================================================
        // RESULT
        // ========================================================

        calculationResult:
            source?.calculationResult ??
            null,

        calculationResultUnit:
            source?.calculationResultUnit ??
            "%",


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
// CREATE CRUDE FIBER SAMPLE PREPARATION
// ============================================================

export const createSamplePreparationCrudeFiber = (
    index: number
): SamplePreparationCrudeFiber => ({

    id:
        Date.now() + index,

    label:
        `Sample Preparation ${index + 1}`,

    steps: [

        // ========================================================
        // 1. WEIGHT OF CRUCIBLE AFTER DRYING
        // ========================================================

        {
            name:
                "Weight of Crucible after Drying in g W1",

            value1:
                "",

            unit1:
                "g",

            logBookID:
                ""
        },


        // ========================================================
        // 2. WEIGHT OF CRUCIBLE AFTER ASHING
        // ========================================================

        {
            name:
                "Weight of Crucible after Ashing in g W2",

            value1:
                "",

            unit1:
                "g",

            logBookID:
                ""
        },


        // ========================================================
        // 3. WEIGHT OF SAMPLE
        // ========================================================

        {
            name:
                "Weight of Sample in g W",

            value1:
                "",

            unit1:
                "g",

            logBookID:
                ""
        }

    ]

});