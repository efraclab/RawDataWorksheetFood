import type { PreparationData }
    from "../../../models/PreparationData";

import type { WorksheetFileData }
    from "../../../models/WorksheetFileData";

import type { CalculationData }
    from "../../../models/CalculationData";


// ============================================================
// FATTY ACID PROFILE PREPARATIONS
// ============================================================

export function mapFattyAcidProfileDraftToPreparations(
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
                "fattyAcidProfile",

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
            "Invalid Fatty Acid Profile completedAt:",
            value
        );

        return null;
    }


    return date.toISOString();
}


// ============================================================
// FATTY ACID PROFILE FILES
// ============================================================

export function mapFattyAcidProfileDraftToFiles(
    draft: any
): WorksheetFileData[] {

    if (!draft)
        return [];


    return (draft.files ?? []).map(
        (file: any) => ({

            id:
                file.id ?? 0,

            preparationType:
                "fattyAcidProfile",

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
// FATTY ACID PROFILE CALCULATIONS
// ============================================================

export function mapFattyAcidProfileDraftToCalculations(
    draft: any
): CalculationData[] {

    if (!draft)
        return [];


    return (draft.calculations ?? []).map(
        (calc: any) => ({

            label:
                calc.label,

            calculationType:
                "fattyAcidProfile",

            data:
                calc

        })
    );
}