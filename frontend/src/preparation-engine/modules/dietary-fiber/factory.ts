import type {
    CalculationDietaryFiber
} from "./models/CalculationDietaryFiber";

import type {
    SamplePreparationDietaryFiber
} from "./models/SamplePreparationDietaryFiber";


// ============================================================
// CREATE DIETARY FIBER CALCULATION
// ============================================================

export const createCalculationDietaryFiber = (
    index: number
): CalculationDietaryFiber => ({

    id:
        Date.now() + index,

    label:
        `Calculation ${index + 1}`,

    selectedSamplePreparationLabel:
        null,


    // ============================================================
    // DIETARY FIBER INPUT VALUES
    // ============================================================

    sampleWeightW1:
        null,

    sampleWeightW2:
        null,

    emptyCrucibleW1:
        null,

    emptyCrucibleW2:
        null,

    crucibleResidueW1:
        null,

    crucibleResidueW2:
        null,

    afterAshing:
        null,

    sampleTitreValue:
        null,

    blankTitreValue:
        null,

    normality:
        null,

    blankWeight:
        null,


    // ============================================================
    // AUTO CALCULATED VALUES
    // ============================================================

    avgSampleWeight:
        null,

    residueWeightW1:
        null,

    residueWeightW2:
        null,

    avgResidueWeight:
        null,

    ashPercentage:
        null,

    ashWeight:
        null,

    proteinPercentage:
        null,

    proteinWeight:
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
// RESTORE DIETARY FIBER CALCULATION
// ============================================================

export const restoreCalculationDietaryFiber = (
    data: any
): CalculationDietaryFiber => {

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

        sampleWeightW1:
            source?.sampleWeightW1 ??
            null,

        sampleWeightW2:
            source?.sampleWeightW2 ??
            null,

        emptyCrucibleW1:
            source?.emptyCrucibleW1 ??
            null,

        emptyCrucibleW2:
            source?.emptyCrucibleW2 ??
            null,

        crucibleResidueW1:
            source?.crucibleResidueW1 ??
            null,

        crucibleResidueW2:
            source?.crucibleResidueW2 ??
            null,

        afterAshing:
            source?.afterAshing ??
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

        blankWeight:
            source?.blankWeight ??
            null,


        // ========================================================
        // AUTO CALCULATED VALUES
        // ========================================================

        avgSampleWeight:
            source?.avgSampleWeight ??
            null,

        residueWeightW1:
            source?.residueWeightW1 ??
            null,

        residueWeightW2:
            source?.residueWeightW2 ??
            null,

        avgResidueWeight:
            source?.avgResidueWeight ??
            null,

        ashPercentage:
            source?.ashPercentage ??
            null,

        ashWeight:
            source?.ashWeight ??
            null,

        proteinPercentage:
            source?.proteinPercentage ??
            null,

        proteinWeight:
            source?.proteinWeight ??
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
// CREATE DIETARY FIBER SAMPLE PREPARATION
// ============================================================

export const createSamplePreparationDietaryFiber = (
    index: number
): SamplePreparationDietaryFiber => ({

    id:
        Date.now() + index,

    label:
        `Sample Preparation ${index + 1}`,

    steps: [

        // ========================================================
        // 1. WT OF SAMPLE W1
        // ========================================================

        {
            name:
                "Wt of Spl (g) W1",

            value1:
                "",

            unit1:
                "g",

            logBookID:
                ""
        },


        // ========================================================
        // 2. WT OF SAMPLE W2
        // ========================================================

        {
            name:
                "Wt of Spl (g) W2",

            value1:
                "",

            unit1:
                "g",

            logBookID:
                ""
        },


        // ========================================================
        // 3. EMPTY WEIGHT OF CRUCIBLE W1
        // ========================================================

        {
            name:
                "Empty wt of crucible(g) W1",

            value1:
                "",

            unit1:
                "g",

            logBookID:
                ""
        },


        // ========================================================
        // 4. EMPTY WEIGHT OF CRUCIBLE W2
        // ========================================================

        {
            name:
                "Empty wt of crucible(g) W2",

            value1:
                "",

            unit1:
                "g",

            logBookID:
                ""
        },


        // ========================================================
        // 5. CRUCIBLE + RESIDUE W1
        // ========================================================

        {
            name:
                "Crucible + Residue (g) W1",

            value1:
                "",

            unit1:
                "g",

            logBookID:
                ""
        },


        // ========================================================
        // 6. CRUCIBLE + RESIDUE W2
        // ========================================================

        {
            name:
                "Crucible + Residue (g) W2",

            value1:
                "",

            unit1:
                "g",

            logBookID:
                ""
        },


        // ========================================================
        // 7. AFTER ASHING
        // ========================================================

        {
            name:
                "After Ashing(g)",

            value1:
                "",

            unit1:
                "g",

            logBookID:
                ""
        },


        // ========================================================
        // 8. ASH
        // ========================================================

        {
            name:
                "Ash",

            value1:
                "",

            unit1:
                "%",

            logBookID:
                ""
        },


        // ========================================================
        // 9. SAMPLE TITRE VALUE
        // ========================================================

        {
            name:
                "Spl T.V(ml)",

            value1:
                "",

            unit1:
                "ml",

            logBookID:
                ""
        },


        // ========================================================
        // 10. BLANK TITRE VALUE
        // ========================================================

        {
            name:
                "Blk T.V(ml)",

            value1:
                "",

            unit1:
                "ml",

            logBookID:
                ""
        },


        // ========================================================
        // 11. NORMALITY
        // ========================================================

        {
            name:
                "Normality",

            value1:
                "",

            unit1:
                "N",

            logBookID:
                ""
        },


        // ========================================================
        // 12. BLANK WEIGHT
        // ========================================================

        {
            name:
                "Blank Wt",

            value1:
                "",

            unit1:
                "g",

            logBookID:
                ""
        },


        // ========================================================
        // 7. ASH
        // ========================================================

        {
            name:
                "Ash",

            value1:
                "",

            unit1:
                "%",

            logBookID:
                ""
        },


        // ========================================================
        // 8. SAMPLE TITRE VALUE
        // ========================================================

        {
            name:
                "Spl T.V(ml)",

            value1:
                "",

            unit1:
                "ml",

            logBookID:
                ""
        },


        // ========================================================
        // 9. BLANK TITRE VALUE
        // ========================================================

        {
            name:
                "Blk T.V(ml)",

            value1:
                "",

            unit1:
                "ml",

            logBookID:
                ""
        },


        // ========================================================
        // 10. NORMALITY
        // ========================================================

        {
            name:
                "Normality",

            value1:
                "",

            unit1:
                "N",

            logBookID:
                ""
        },


        // ========================================================
        // 11. BLANK WEIGHT
        // ========================================================

        {
            name:
                "Blank Wt",

            value1:
                "",

            unit1:
                "g",

            logBookID:
                ""
        }

    ]

});