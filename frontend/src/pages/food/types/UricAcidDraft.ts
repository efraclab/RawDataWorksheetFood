import type { SamplePreparationUricAcid }
    from "../../../preparation-engine/modules/uric-acid/models/SamplePreparationUricAcid";

import type { CalculationUricAcid }
    from "../../../preparation-engine/modules/uric-acid/models/CalculationUricAcid";

import type { AttachedFile }
    from "../../../models/AttachedFile";


export interface UricAcidDraft {

    samplePreparations:
        SamplePreparationUricAcid[];

    calculations:
        CalculationUricAcid[];

    files:
        AttachedFile[];

    isPreparationCompleted:
        boolean;

    completedAt:
        Date | null;

}