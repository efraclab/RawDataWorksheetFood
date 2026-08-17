import type { PreparationData }
    from "../../../models/PreparationData";

import type { WorksheetFileData }
    from "../../../models/WorksheetFileData";

import type { CalculationData }
    from "../../../models/CalculationData";


// ============================================================
// ARTIFICIAL SWEETNER PREPARATIONS
// ============================================================

export function mapArtificialSweetnerDraftToPreparations(
    draft: any
): PreparationData[] {

    if (!draft)
        return [];


    return (draft.samplePreparations ?? []).map(
        (sample: any) => ({

            label:
                sample.label,

            preparationCategory:
                "sample",

            preparationType:
                "artificialSweetner",

            assignedStandardId:
                null,

            steps:
                JSON.stringify(
                    sample.steps ?? []
                ),

            content:
                null,

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

    const date =
        new Date(value);


    if (
        isNaN(
            date.getTime()
        )
    ) {

        console.warn(
            "Invalid Artificial Sweetner completedAt:",
            value
        );

        return null;
    }


    return date.toISOString();
}


// ============================================================
// ARTIFICIAL SWEETNER FILES
// ============================================================

export function mapArtificialSweetnerDraftToFiles(
    draft: any
): WorksheetFileData[] {

    if (!draft)
        return [];


    return (draft.files ?? []).map(
        (file: any) => ({

            id:
                file.id ?? 0,

            preparationType:
                "artificialSweetner",

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
// ARTIFICIAL SWEETNER CALCULATIONS
// ============================================================

export function mapArtificialSweetnerDraftToCalculations(
    draft: any
): CalculationData[] {

    if (!draft)
        return [];


    return (draft.calculations ?? []).map(
        (calc: any) => ({

            label:
                calc.label,

            calculationType:
                "artificialSweetner",

            data:
                calc

        })
    );
}