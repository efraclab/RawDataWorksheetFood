import type { PreparationData } from "../../../models/PreparationData";
import type { WorksheetFileData } from "../../../models/WorksheetFileData";
import type { CalculationData } from "../../../models/CalculationData";


// ============================================================
// SUGAR / SAPONIN / CATECHIN PROFILE PREPARATIONS
// ============================================================

export function mapSugarSaponinCatechinProfileDraftToPreparations(
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
                "sugarSaponinCatechinProfile",

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

    const date = new Date(value);

    if (isNaN(date.getTime())) {

        console.warn(
            "Invalid Sugar/Saponin/Catechin Profile completedAt:",
            value
        );

        return null;
    }

    return date.toISOString();
}


// ============================================================
// SUGAR / SAPONIN / CATECHIN PROFILE FILES
// ============================================================

export function mapSugarSaponinCatechinProfileDraftToFiles(
    draft: any
): WorksheetFileData[] {

    if (!draft)
        return [];

    return (draft.files ?? []).map(
        (file: any) => ({

            id:
                file.id ?? 0,

            preparationType:
                "sugarSaponinCatechinProfile",

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
// SUGAR / SAPONIN / CATECHIN PROFILE CALCULATIONS
// ============================================================

export function mapSugarSaponinCatechinProfileDraftToCalculations(
    draft: any
): CalculationData[] {

    if (!draft)
        return [];

    return (draft.calculations ?? []).map(
        (calc: any) => ({

            label:
                calc.label,

            calculationType:
                "sugarSaponinCatechinProfile",

            data:
                calc

        })
    );
}