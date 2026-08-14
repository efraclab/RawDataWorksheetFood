import type { PreparationData }
    from "../../../models/PreparationData";

import type { WorksheetFileData }
    from "../../../models/WorksheetFileData";

import type { CalculationData }
    from "../../../models/CalculationData";


// ============================================================
// SAPONIFICATION VALUE PREPARATIONS
// ============================================================

export function mapSaponificationValueDraftToPreparations(
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
                "saponificationValue",

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
            "Invalid Saponification Value completedAt:",
            value
        );

        return null;
    }

    return date.toISOString();
}


// ============================================================
// SAPONIFICATION VALUE FILES
// ============================================================

export function mapSaponificationValueDraftToFiles(
    draft: any
): WorksheetFileData[] {

    if (!draft)
        return [];

    return (draft.files ?? []).map(
        (file: any) => ({

            id:
                file.id ?? 0,

            preparationType:
                "saponificationValue",

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
// SAPONIFICATION VALUE CALCULATIONS
// ============================================================

export function mapSaponificationValueDraftToCalculations(
    draft: any
): CalculationData[] {

    if (!draft)
        return [];

    return (draft.calculations ?? []).map(
        (calc: any) => ({

            label:
                calc.label,

            calculationType:
                "saponificationValue",

            data:
                calc

        })
    );
}