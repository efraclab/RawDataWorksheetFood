import type { SamplePreparationPreservative }
    from "../../../preparation-engine/modules/preservative/models/SamplePreparationPreservative";

import type { CalculationPreservative }
    from "../../../preparation-engine/modules/preservative/models/CalculationPreservative";

import type { AttachedFile }
    from "../../../models/AttachedFile";


export interface PreservativeDraft {

    samplePreparations:
        SamplePreparationPreservative[];

    calculations:
        CalculationPreservative[];

    files:
        AttachedFile[];

    isPreparationCompleted:
        boolean;

    completedAt:
        Date | null;

}