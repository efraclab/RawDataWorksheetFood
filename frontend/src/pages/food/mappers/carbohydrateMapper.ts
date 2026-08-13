import type { PreparationData } from "../../../models/PreparationData";
import type { WorksheetFileData } from "../../../models/WorksheetFileData";
import type { CalculationData } from "../../../models/CalculationData";


// ============================================================
// CARBOHYDRATE PREPARATIONS
// ============================================================

export function mapCarbohydrateDraftToPreparations(
    draft: any
): PreparationData[] {

    if (!draft)
        return [];

    return (draft.samplePreparations ?? []).map(
        (sample: any) => ({

            label: sample.label,

            preparationCategory: "sample",

            preparationType: "carbohydrate",

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
            "Invalid Carbohydrate completedAt:",
            value
        );

        return null;
    }

    return date.toISOString();
}


// ============================================================
// CARBOHYDRATE FILES
// ============================================================

export function mapCarbohydrateDraftToFiles(
    draft: any
): WorksheetFileData[] {

    if (!draft)
        return [];

    return (draft.files ?? []).map(
        (file: any) => ({

            id: file.id ?? 0,

            preparationType: "carbohydrate",

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
// CARBOHYDRATE CALCULATIONS
// ============================================================

export function mapCarbohydrateDraftToCalculations(
    draft: any
): CalculationData[] {

    if (!draft)
        return [];

    return (draft.calculations ?? []).map(
        (calc: any) => ({

            label:
                calc.label,

            calculationType:
                "carbohydrate",

            data:
                calc

        })
    );
}