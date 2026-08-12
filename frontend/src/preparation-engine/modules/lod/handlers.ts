import {
    createNewSamplePreparationLod,
    createNewCalculationLod
} from "./factory";
import type { SamplePreparationLodStep } from "./models/SamplePreparationLodStep";
import { moduleRegistry } from "../../configs/moduleRegistry";
import type { SamplePreparationLod } from "./models/SamplePreparationLod";
import type { CalculationLod } from "./models/CalculationLod";


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
        moduleConfig.createSamplePreparation(samplePreparations.length)
    ];

};

export const removeSamplePreparation = (
    current: SamplePreparationLod[],
    id: number
): SamplePreparationLod[] => {

    return current.filter(x => x.id !== id);

};

export const updateSamplePreparationStep = (
    current: SamplePreparationLod[],
    preparationId: number,
    stepName: SamplePreparationLodStep["name"],
    field: keyof SamplePreparationLodStep,
    value: string
): SamplePreparationLod[] => {

    return current.map(preparation => {

        if (preparation.id !== preparationId)
            return preparation;

        return {

            ...preparation,

            steps: preparation.steps.map(step => {

                if (step.name !== stepName)
                    return step;

                return {

                    ...step,

                    [field]: value

                };

            })

        };

    });

};

export const addCalculation = (
    current: CalculationLod[]
): CalculationLod[] => {

    return [

        ...current,

        createNewCalculationLod(current.length)

    ];

};

export const removeCalculation = (
    current: CalculationLod[],
    id: number
): CalculationLod[] => {

    return current.filter(x => x.id !== id);

};