import type { CalculationProtein } from "./models/CalculationProtein";
import type { SamplePreparationProtein } from "./models/SamplePreparationProtein";

import { createSamplePreparation } from "../../factory/createSamplePreparation";


// ============================================================
// CREATE PROTEIN CALCULATION
// ============================================================

export const createCalculationProtein = (
    index: number
): CalculationProtein => ({

    id: Date.now() + index,

    label: `Calculation ${index + 1}`,

    selectedSamplePreparationLabel: null,

    // --------------------------------------------
    // PROTEIN VALUES
    // --------------------------------------------

    sampleWeight: null,

    sampleTitreValue: null,

    blankTitreValue: null,

    normality: null,

    proteinFactor: null,

    // --------------------------------------------
    // CONSTANTS
    // --------------------------------------------

    factor14: 14.01,

    multiplier100: 100,

    denominator1000: 1000,

    // --------------------------------------------
    // RESULT
    // --------------------------------------------

    acceptanceLimitMin: "",

    acceptanceLimitMax: "",

    calculationResult: null,

    calculationResultUnit: "%"

});


// ============================================================
// RESTORE PROTEIN CALCULATION
// ============================================================

export const restoreCalculationProtein = (
    data: any
): CalculationProtein => {

    // --------------------------------------------
    // Get actual calculation data
    // --------------------------------------------

    let source = data?.data ?? data;


    // --------------------------------------------
    // API may return data as JSON string
    // --------------------------------------------

    if (typeof source === "string") {

        try {

            source = JSON.parse(source);

        } catch (error) {

            console.error(
                "❌ Failed to parse Protein calculation data:",
                error
            );

            source = {};

        }

    }


    console.log(
        "🔥 PROTEIN RESTORE SOURCE:",
        source
    );


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


        // --------------------------------------------
        // PROTEIN VALUES
        // --------------------------------------------

        sampleWeight:
            source?.sampleWeight ??
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

        proteinFactor:
            source?.proteinFactor ??
            null,


        // --------------------------------------------
        // CONSTANTS
        // --------------------------------------------

        factor14:
            source?.factor14 ??
            14.01,

        multiplier100:
            source?.multiplier100 ??
            100,

        denominator1000:
            source?.denominator1000 ??
            1000,


        // --------------------------------------------
        // RESULT
        // --------------------------------------------

        acceptanceLimitMin:
            source?.acceptanceLimitMin ??
            "",

        acceptanceLimitMax:
            source?.acceptanceLimitMax ??
            "",

        calculationResult:
            source?.calculationResult ??
            null,

        calculationResultUnit:
            source?.calculationResultUnit ??
            "%"

    };

};


// ============================================================
// CREATE PROTEIN SAMPLE PREPARATION
// ============================================================

export const createSamplePreparationProtein = (
    index: number
): SamplePreparationProtein =>
    createSamplePreparation("protein", index);