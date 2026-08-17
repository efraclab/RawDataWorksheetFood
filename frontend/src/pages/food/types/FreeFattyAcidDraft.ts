import type { SamplePreparationFreeFattyAcid }
    from "../../../preparation-engine/modules/free-fatty-acid/models/SamplePreparationFreeFattyAcid";

import type { CalculationFreeFattyAcid }
    from "../../../preparation-engine/modules/free-fatty-acid/models/CalculationFreeFattyAcid";

import type { AttachedFile }
    from "../../../models/AttachedFile";


export interface FreeFattyAcidDraft {

    samplePreparations:
        SamplePreparationFreeFattyAcid[];

    calculations:
        CalculationFreeFattyAcid[];

    files:
        AttachedFile[];

    isPreparationCompleted:
        boolean;

    completedAt:
        Date | null;

}