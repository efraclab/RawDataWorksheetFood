import {
    createNewSamplePreparationLod,
    createNewCalculationLod
} from "./factory";

import type { SamplePreparationLodStep } from "./models/SamplePreparationLodStep";

import { moduleRegistry } from "../../configs/moduleRegistry";

import type { SamplePreparationLod } from "./models/SamplePreparationLod";
import type { CalculationLod } from "./models/CalculationLod";


// ============================================================
// UPDATE CALCULATION
// ============================================================

export const updateCalculation = (
    current: CalculationLod[],
    calculationId: number,
    field: keyof CalculationLod,
    value: any
): CalculationLod[] => {

    return current.map(calculation => {

        if (calculation.id !== calculationId)
            return calculation;

        return {
            ...calculation,
            [field]: value
        };

    });

};


// ============================================================
// ADD SAMPLE PREPARATION
// ============================================================

export const addSamplePreparation = (
    samplePreparations: SamplePreparationLod[],
    parameterType: string
) => {

    const moduleConfig =
        moduleRegistry[
            parameterType as keyof typeof moduleRegistry
        ];

    return [
        ...samplePreparations,
        moduleConfig.createSamplePreparation(
            samplePreparations.length
        )
    ];

};


// ============================================================
// REMOVE SAMPLE PREPARATION
// ============================================================

export const removeSamplePreparation = (
    current: SamplePreparationLod[],
    id: number
): SamplePreparationLod[] => {

    return current.filter(
        x => x.id !== id
    );

};


// ============================================================
// CREATE MISSING SAMPLE PREPARATION STEP
// ============================================================
//
// Important:
//
// Previously updateSamplePreparationStep() only updated a
// step if that step already existed.
//
// Therefore:
//
//     "After Ashing(g)"
//
// could be displayed by the UI but typing into it would not
// persist because the step did not exist in preparation.steps.
//
// This helper creates the missing step when necessary.
// ============================================================

const createMissingStep = (
    stepName: SamplePreparationLodStep["name"]
): SamplePreparationLodStep => {

    // --------------------------------------------------------
    // Dietary Fiber specific defaults
    // --------------------------------------------------------

    if (stepName === "After Ashing(g)") {

        return {
            name: stepName,
            value1: "",
            unit1: "g",
            value2: "",
            unit2: "",
            logBookID: ""
        };

    }


    if (stepName === "Ash") {

        return {
            name: stepName,
            value1: "",
            unit1: "%",
            value2: "",
            unit2: "",
            logBookID: ""
        };

    }


    // --------------------------------------------------------
    // Generic fallback
    // --------------------------------------------------------
    //
    // This keeps the handler safe for other preparation
    // modules. If another module sends a step that does not
    // exist, the step will still be created and the requested
    // field will be updated immediately afterwards.
    // --------------------------------------------------------

    return {
        name: stepName,
        value1: "",
        unit1: "",
        value2: "",
        unit2: "",
        logBookID: ""
    };

};


// ============================================================
// UPDATE SAMPLE PREPARATION STEP
// ============================================================

export const updateSamplePreparationStep = (
    current: SamplePreparationLod[],
    preparationId: number,
    stepName: SamplePreparationLodStep["name"],
    field: keyof SamplePreparationLodStep,
    value: string
): SamplePreparationLod[] => {

    return current.map(preparation => {

        if (
            preparation.id !==
            preparationId
        ) {
            return preparation;
        }


        // ----------------------------------------------------
        // Make sure steps is always an array
        // ----------------------------------------------------

        const steps =
            Array.isArray(preparation.steps)
                ? preparation.steps
                : [];


        // ----------------------------------------------------
        // Find the requested step
        // ----------------------------------------------------

        const existingStepIndex =
            steps.findIndex(
                step =>
                    step.name === stepName
            );


        // ====================================================
        // EXISTING STEP
        // ====================================================

        if (
            existingStepIndex >= 0
        ) {

            const updatedSteps =
                steps.map(
                    (step, index) => {

                        if (
                            index !==
                            existingStepIndex
                        ) {
                            return step;
                        }

                        return {
                            ...step,
                            [field]: value
                        };

                    }
                );


            return {
                ...preparation,
                steps: updatedSteps
            };

        }


        // ====================================================
        // MISSING STEP
        // ====================================================
        //
        // This is the important fix.
        //
        // If "After Ashing(g)" does not exist, create it.
        // Then immediately write the requested value.
        // ====================================================

        const newStep =
            createMissingStep(
                stepName
            );


        const completedStep = {
            ...newStep,
            [field]: value
        };


        // ----------------------------------------------------
        // Preserve Dietary Fiber Excel/UI order
        // ----------------------------------------------------
        //
        // Expected order:
        //
        // Avg Residue wt(g)
        // After Ashing(g)
        // Ash
        // Wt of Ash(g)
        //
        // If Ash already exists, insert After Ashing(g)
        // immediately before Ash.
        // ----------------------------------------------------

        if (
            stepName ===
            "After Ashing(g)"
        ) {

            const ashIndex =
                steps.findIndex(
                    step =>
                        step.name ===
                        "Ash"
                );


            if (
                ashIndex >= 0
            ) {

                const updatedSteps =
                    [...steps];

                updatedSteps.splice(
                    ashIndex,
                    0,
                    completedStep
                );

                return {
                    ...preparation,
                    steps: updatedSteps
                };

            }

        }


        // ----------------------------------------------------
        // If Ash itself is missing, put it after
        // After Ashing(g) when possible.
        // ----------------------------------------------------

        if (
            stepName ===
            "Ash"
        ) {

            const afterAshingIndex =
                steps.findIndex(
                    step =>
                        step.name ===
                        "After Ashing(g)"
                );


            if (
                afterAshingIndex >= 0
            ) {

                const updatedSteps =
                    [...steps];

                updatedSteps.splice(
                    afterAshingIndex + 1,
                    0,
                    completedStep
                );

                return {
                    ...preparation,
                    steps: updatedSteps
                };

            }

        }


        // ----------------------------------------------------
        // Generic missing step
        // ----------------------------------------------------

        return {
            ...preparation,
            steps: [
                ...steps,
                completedStep
            ]
        };

    });

};


// ============================================================
// ADD CALCULATION
// ============================================================

export const addCalculation = (
    current: CalculationLod[]
): CalculationLod[] => {

    return [
        ...current,
        createNewCalculationLod(
            current.length
        )
    ];

};


// ============================================================
// REMOVE CALCULATION
// ============================================================

export const removeCalculation = (
    current: CalculationLod[],
    id: number
): CalculationLod[] => {

    return current.filter(
        x => x.id !== id
    );

};