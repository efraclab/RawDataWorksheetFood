import type {
    SamplePreparationWsv
} from "../../../preparation-engine/modules/wsv/models/SamplePreparationWsv";

import type {
    CalculationWsv
} from "../../../preparation-engine/modules/wsv/models/CalculationWsv";

import type {
    AttachedFile
} from "../../../models/AttachedFile";


// ============================================================
// WSV DRAFT
// ============================================================

export interface WsvDraft {

    samplePreparations:
        SamplePreparationWsv[];

    calculations:
        CalculationWsv[];

    files:
        AttachedFile[];

    isPreparationCompleted:
        boolean;

    completedAt:
        Date | null;

}