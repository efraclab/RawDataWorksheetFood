import type { SamplePreparationSugar }
    from "../../../preparation-engine/modules/sugar/models/SamplePreparationSugar";
import type { CalculationSugar }
    from "../../../preparation-engine/modules/sugar/models/CalculationSugar";

import type { AttachedFile }
    from "../../../models/AttachedFile";

export interface SugarDraft {

    samplePreparations: SamplePreparationSugar[];

    calculations: CalculationSugar[];

    files: AttachedFile[];

    isPreparationCompleted: boolean;

    completedAt: Date | null;

}