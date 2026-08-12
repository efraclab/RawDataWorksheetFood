import type { CalculationFat } from "./CalculationFat";
import type { SamplePreparationFat } from "./SamplePreparationFAT";
import { createSamplePreparation } from "../../factory/createSamplePreparation";

export const createCalculationFat = (
    index: number
): CalculationFat => ({
    id: Date.now() + index,

    label: `Calculation ${index + 1}`,

    selectedSamplePreparationLabel: null,

    acceptanceLimitMin: "",
    acceptanceLimitMax: "",

    calculationResult: null,
    calculationResultUnit: "%",

    // FAT values
    w1: null,
    w2: null,
    w3: null,
});

export const restoreCalculationFat = (
    data: any
): CalculationFat => {

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
                "❌ Failed to parse FAT calculation data:",
                error
            );

            source = {};
        }
    }

    console.log("🔥 FAT RESTORE SOURCE:", source);

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
            "%",

        // --------------------------------------------
        // FAT values
        // --------------------------------------------

        w1:
            source?.w1 ??
            null,

        w2:
            source?.w2 ??
            null,

        w3:
            source?.w3 ??
            null,
    };
};

export const createSamplePreparationFat = (
    index: number
): SamplePreparationFat =>
    createSamplePreparation("fat", index);