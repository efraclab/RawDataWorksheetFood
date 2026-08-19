import type { SamplePreparationDietaryFiber }
    from "../../../preparation-engine/modules/dietary-fiber/models/SamplePreparationDietaryFiber";

import type { CalculationDietaryFiber }
    from "../../../preparation-engine/modules/dietary-fiber/models/CalculationDietaryFiber";

import type { AttachedFile }
    from "../../../models/AttachedFile";


export interface DietaryFiberDraft {

    samplePreparations: SamplePreparationDietaryFiber[];

    calculations: CalculationDietaryFiber[];

    files: AttachedFile[];

    isPreparationCompleted: boolean;

    completedAt: Date | null;

}