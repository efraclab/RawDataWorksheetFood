import type {
    SamplePreparationCholesterol
} from "../../../preparation-engine/modules/cholesterol/models/SamplePreparationCholesterol";

import type {
    CalculationCholesterol
} from "../../../preparation-engine/modules/cholesterol/models/CalculationCholesterol";

import type {
    AttachedFile
} from "../../../models/AttachedFile";


// ============================================================
// CHOLESTEROL DRAFT
// ============================================================

export interface CholesterolDraft {

    samplePreparations:
        SamplePreparationCholesterol[];

    calculations:
        CalculationCholesterol[];

    files:
        AttachedFile[];

    isPreparationCompleted:
        boolean;

    completedAt:
        Date | null;

}