import type { SamplePreparationCarbohydrate }
    from "../../../preparation-engine/modules/carbohydrate/models/SamplePreparationCarbohydrate";
import type { CalculationCarbohydrate }
    from "../../../preparation-engine/modules/carbohydrate/models/CalculationCarbohydrate";

import type { AttachedFile }
    from "../../../models/AttachedFile";

export interface CarbohydrateDraft {

    samplePreparations: SamplePreparationCarbohydrate[];

    calculations: CalculationCarbohydrate[];

    files: AttachedFile[];

    isPreparationCompleted: boolean;

    completedAt: Date | null;

}