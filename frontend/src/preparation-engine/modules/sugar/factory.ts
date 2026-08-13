import type { CalculationSugar }
    from "./models/CalculationSugar";

import type { SamplePreparationSugar }
    from "./models/SamplePreparationSugar";

import { createSamplePreparation }
    from "../../factory/createSamplePreparation";


// ============================================================
// CREATE SUGAR CALCULATION
// ============================================================

export const createCalculationSugar = (
    index: number
): CalculationSugar => ({

    id: Date.now() + index,

    label: `Calculation ${index + 1}`,

    selectedSamplePreparationLabel: null,

    // ========================================================
    // SUGAR VALUES
    // ========================================================

    sampleWeight: null,

    volumeMakeUp1: null,

    sampleTitreValue: null,

    dilutionFactor: null,

    stdDextroseWeight: null,

    volumeMakeUp2: null,

    standardTitre: null,

    aliquot: null,

    // ========================================================
    // CALCULATED
    // ========================================================

    fehlingFactor: null,

    // ========================================================
    // CONSTANT
    // ========================================================

    multiplier100: 100,

    // ========================================================
    // ACCEPTANCE
    // ========================================================

    acceptanceLimitMin: "",

    acceptanceLimitMax: "",

    // ========================================================
    // RESULT
    // ========================================================

    calculationResult: null,

    calculationResultUnit: "g/100 g"

});


// ============================================================
// RESTORE SUGAR CALCULATION
// ============================================================

export const restoreCalculationSugar = (
    data: any
): CalculationSugar => {

    let source = data?.data ?? data;

    // API may return JSON string
    if (typeof source === "string") {

        try {

            source = JSON.parse(source);

        } catch (error) {

            console.error(
                "❌ Failed to parse Sugar calculation data:",
                error
            );

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

        // ====================================================
        // SUGAR VALUES
        // ====================================================

        sampleWeight:
            source?.sampleWeight ??
            null,

        volumeMakeUp1:
            source?.volumeMakeUp1 ??
            null,

        sampleTitreValue:
            source?.sampleTitreValue ??
            null,

        dilutionFactor:
            source?.dilutionFactor ??
            null,

        stdDextroseWeight:
            source?.stdDextroseWeight ??
            null,

        volumeMakeUp2:
            source?.volumeMakeUp2 ??
            null,

        standardTitre:
            source?.standardTitre ??
            null,

        aliquot:
            source?.aliquot ??
            null,

        // ====================================================
        // CALCULATED
        // ====================================================

        fehlingFactor:
            source?.fehlingFactor ??
            null,

        // ====================================================
        // CONSTANT
        // ====================================================

        multiplier100:
            source?.multiplier100 ??
            100,

        // ====================================================
        // ACCEPTANCE
        // ====================================================

        acceptanceLimitMin:
            source?.acceptanceLimitMin ??
            "",

        acceptanceLimitMax:
            source?.acceptanceLimitMax ??
            "",

        // ====================================================
        // RESULT
        // ====================================================

        calculationResult:
            source?.calculationResult ??
            null,

        calculationResultUnit:
            source?.calculationResultUnit ??
            "g/100 g"

    };
};


// ============================================================
// CREATE SUGAR SAMPLE PREPARATION
// ============================================================

export const createSamplePreparationSugar = (
    index: number
): SamplePreparationSugar => {

    return createSamplePreparation(
        "sugar",
        index
    );
};