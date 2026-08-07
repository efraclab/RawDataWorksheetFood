import type { PreparationData } from "../../../models/PreparationData";
import type { WorksheetFileData } from "../../../models/WorksheetFileData";
import type { CalculationData } from "../../../models/CalculationData";

export function mapLodDraftToPreparations(
    draft: any
): PreparationData[] {

    if (!draft)
        return [];

    return (draft.samplePreparations ?? []).map((sample: any) => ({

        label: sample.label,

        preparationCategory: "sample",

        preparationType: "lod",

        assignedStandardId: null,

        steps: JSON.stringify(sample.steps),

        content: null,

        isPreparationCompleted: draft.isPreparationCompleted,

        completedAt:
            draft.completedAt
                ? new Date(draft.completedAt).toISOString()
                : null

    }));
}

export function mapLodDraftToFiles(
    draft: any
): WorksheetFileData[] {

    if (!draft)
        return [];

    return (draft.files ?? []).map((file: any) => ({

        id: file.id ?? 0,

        preparationType: "lod",

        label: "Preparation Files",

        fileName: file.fileName,

        fileDataBase64: file.fileDataBase64

    }));
}

export function mapLodDraftToCalculations(
    draft: any
): CalculationData[] {

    if (!draft)
        return [];

    return (draft.calculations ?? []).map((calc: any) => ({

        label: calc.label,

        calculationType: "lod",

        data: calc

    }));

}