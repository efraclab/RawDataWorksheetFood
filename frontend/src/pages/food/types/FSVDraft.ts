import type { SamplePreparationFSV }
    from "../../../preparation-engine/modules/fsv/models/SamplePreparationFSV";

import type { CalculationFSV }
    from "../../../preparation-engine/modules/fsv/models/CalculationFSV";

import type { AttachedFile }
    from "../../../models/AttachedFile";


export interface FSVDraft {

    samplePreparations:
        SamplePreparationFSV[];

    calculations:
        CalculationFSV[];

    files:
        AttachedFile[];

    isPreparationCompleted:
        boolean;

    completedAt:
        Date | null;

}