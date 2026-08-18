import type { SamplePreparationMoisture }
    from "../../../preparation-engine/modules/moisture/models/SamplePreparationMoisture";

import type { CalculationMoisture }
    from "../../../preparation-engine/modules/moisture/models/CalculationMoisture";

import type { AttachedFile }
    from "../../../models/AttachedFile";


export interface MoistureDraft {

    samplePreparations:
        SamplePreparationMoisture[];

    calculations:
        CalculationMoisture[];

    files:
        AttachedFile[];

    isPreparationCompleted:
        boolean;

    completedAt:
        Date | null;

}