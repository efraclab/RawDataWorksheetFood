import type { SamplePreparationNots }
    from "../../../preparation-engine/modules/nots/models/SamplePreparationNots";

import type { CalculationNots }
    from "../../../preparation-engine/modules/nots/models/CalculationNots";

import type { AttachedFile }
    from "../../../models/AttachedFile";


export interface NotsDraft {

    samplePreparations:
        SamplePreparationNots[];

    calculations:
        CalculationNots[];

    files:
        AttachedFile[];

    isPreparationCompleted:
        boolean;

    completedAt:
        Date | null;

}