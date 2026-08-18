import type { PreparationData }
    from "../../../models/PreparationData";

import type { WorksheetFileData }
    from "../../../models/WorksheetFileData";

import type { CalculationData }
    from "../../../models/CalculationData";


// ============================================================
// AMINO ACID PREPARATIONS
// ============================================================

export function mapAminoAcidDraftToPreparations(
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
                "aminoAcid",

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
            "Invalid Amino Acid completedAt:",
            value
        );

        return null;
    }


    return date.toISOString();
}


// ============================================================
// AMINO ACID FILES
// ============================================================

export function mapAminoAcidDraftToFiles(
    draft: any
): WorksheetFileData[] {

    if (!draft)
        return [];


    return (draft.files ?? []).map(
        (file: any) => ({

            id:
                file.id ?? 0,

            preparationType:
                "aminoAcid",

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
// AMINO ACID CALCULATIONS
// ============================================================

export function mapAminoAcidDraftToCalculations(
    draft: any
): CalculationData[] {

    if (!draft)
        return [];


    return (draft.calculations ?? []).map(
        (calc: any) => ({

            label:
                calc.label,

            calculationType:
                "aminoAcid",

            data:
                calc

        })
    );
}