import type { SamplePreparationUnsapMatter }
    from "../../../preparation-engine/modules/unsap-matter/models/SamplePreparationUnsapMatter";

import type { CalculationUnsapMatter }
    from "../../../preparation-engine/modules/unsap-matter/models/CalculationUnsapMatter";

import type { AttachedFile }
    from "../../../models/AttachedFile";


export interface UnsapMatterDraft {

    samplePreparations:
        SamplePreparationUnsapMatter[];

    calculations:
        CalculationUnsapMatter[];

    files:
        AttachedFile[];

    isPreparationCompleted:
        boolean;

    completedAt:
        Date | null;

}