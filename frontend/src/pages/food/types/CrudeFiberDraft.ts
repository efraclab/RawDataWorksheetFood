import type { SamplePreparationCrudeFiber }
    from "../../../preparation-engine/modules/crude-fiber/models/SamplePreparationCrudeFiber";

import type { CalculationCrudeFiber }
    from "../../../preparation-engine/modules/crude-fiber/models/CalculationCrudeFiber";

import type { AttachedFile }
    from "../../../models/AttachedFile";


export interface CrudeFiberDraft {

    samplePreparations:
        SamplePreparationCrudeFiber[];

    calculations:
        CalculationCrudeFiber[];

    files:
        AttachedFile[];

    isPreparationCompleted:
        boolean;

    completedAt:
        Date | null;

}