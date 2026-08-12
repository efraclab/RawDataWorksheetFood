import type { SamplePreparationLod } from "./models/SamplePreparationLod";
import type { CalculationLod } from "./models/CalculationLod";
import { createSamplePreparation } from "../../factory/createSamplePreparation";



export const createNewSamplePreparationLod = (
    index: number
): SamplePreparationLod =>
    createSamplePreparation("lod", index);

export const createNewCalculationLod = (
    index: number
): CalculationLod => ({
    id: Date.now() + index,

    label: `Calculation ${index + 1}`,

    selectedSamplePreparationLabel: null,

    w1_emptyDish: "",
    w2_dishWithSample: "",
    w3_dishAfterIgnition: "",

    calculationResult: null,
    calculationResultUnit: null,

    w1: null,
    w2: null,
    w3: null,

    acceptanceLimitMin: "",
    acceptanceLimitMax: "",
});

export const restoreCalculationLod = (
    calculation: any,
    index: number
): CalculationLod => {

    const data =
        typeof calculation.data === "string"
            ? JSON.parse(calculation.data)
            : (calculation.data ?? {});

    return {

        id: data.id ?? index + 1,

        label:
            data.label ??
            calculation.label ??
            `Calculation ${index + 1}`,

        selectedSamplePreparationLabel:
            data.selectedSamplePreparationLabel ?? null,

        acceptanceLimitMin:
            data.acceptanceLimitMin ?? "",

        acceptanceLimitMax:
            data.acceptanceLimitMax ?? "",

        w1_emptyDish:
            data.w1_emptyDish ?? "",

        w2_dishWithSample:
            data.w2_dishWithSample ?? "",

        w3_dishAfterIgnition:
            data.w3_dishAfterIgnition ?? "",

        calculationResult:
            data.calculationResult ?? null,

        calculationResultUnit:
            data.calculationResultUnit ?? null,

        w1: data.w1 ?? null,
        w2: data.w2 ?? null,
        w3: data.w3 ?? null,
    };
};