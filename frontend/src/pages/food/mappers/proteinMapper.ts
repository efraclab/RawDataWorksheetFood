import type { PreparationData } from "../../../models/PreparationData";
import type { WorksheetFileData } from "../../../models/WorksheetFileData";
import type { CalculationData } from "../../../models/CalculationData";


// ============================================================
// PROTEIN PREPARATIONS
// ============================================================

export function mapProteinDraftToPreparations(
    draft: any
): PreparationData[] {

    if (!draft)
        return [];

    return (draft.samplePreparations ?? []).map(
        (sample: any) => ({

            label: sample.label,

            preparationCategory: "sample",

            preparationType: "protein",

            assignedStandardId: null,

            steps: JSON.stringify(
                sample.steps
            ),

            content: null,

            isPreparationCompleted:
                draft.isPreparationCompleted,

            completedAt:
                draft.completedAt
                    ? new Date(
                        draft.completedAt
                    ).toISOString()
                    : null

        })
    );
}


// ============================================================
// PROTEIN FILES
// ============================================================

export function mapProteinDraftToFiles(
    draft: any
): WorksheetFileData[] {

    if (!draft)
        return [];

    return (draft.files ?? []).map(
        (file: any) => ({

            id: file.id ?? 0,

            preparationType: "protein",

            label:
                file.label ??
                "Preparation Files",

            fileName:
                file.fileName,

            fileDataBase64:
                file.fileDataBase64

        })
    );
}


// ============================================================
// PROTEIN CALCULATIONS
// ============================================================

export function mapProteinDraftToCalculations(
    draft: any
): CalculationData[] {

    if (!draft)
        return [];

    return (draft.calculations ?? []).map(
        (calc: any) => ({

            label: calc.label,

            calculationType: "protein",

            data: calc

        })
    );
}