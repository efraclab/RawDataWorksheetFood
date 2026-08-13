import type { PreparationData } from "../../../models/PreparationData";
import type { WorksheetFileData } from "../../../models/WorksheetFileData";
import type { CalculationData } from "../../../models/CalculationData";


// ============================================================
// SUGAR PREPARATIONS
// ============================================================

export function mapSugarDraftToPreparations(
    draft: any
): PreparationData[] {

    if (!draft)
        return [];

    return (draft.samplePreparations ?? []).map(
        (sample: any) => ({

            label: sample.label,

            preparationCategory: "sample",

            preparationType: "sugar",

            assignedStandardId: null,

            steps:
                JSON.stringify(
                    sample.steps ?? []
                ),

            content: null,

            isPreparationCompleted:
                draft.isPreparationCompleted,

            completedAt:
                draft.completedAt
                    ? getSafeISOString(
                        draft.completedAt
                    )
                    : null

        })
    );
}


// ============================================================
// SAFE DATE
// ============================================================

function getSafeISOString(
    value: any
): string | null {

    const date = new Date(value);

    if (isNaN(date.getTime())) {

        console.warn(
            "Invalid Sugar completedAt:",
            value
        );

        return null;
    }

    return date.toISOString();
}


// ============================================================
// SUGAR FILES
// ============================================================

export function mapSugarDraftToFiles(
    draft: any
): WorksheetFileData[] {

    if (!draft)
        return [];

    return (draft.files ?? []).map(
        (file: any) => ({

            id: file.id ?? 0,

            preparationType: "sugar",

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
// SUGAR CALCULATIONS
// ============================================================

export function mapSugarDraftToCalculations(
    draft: any
): CalculationData[] {

    if (!draft)
        return [];

    return (draft.calculations ?? []).map(
        (calc: any) => ({

            label:
                calc.label,

            calculationType:
                "sugar",

            data:
                calc

        })
    );
}