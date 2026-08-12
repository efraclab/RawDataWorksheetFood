import type { SamplePreparationFat }
    from "../../../preparation-engine/modules/fat/SamplePreparationFAT";

import type { CalculationFat }
    from "../../../preparation-engine/modules/fat/CalculationFat";

import type { AttachedFile }
    from "../../../models/AttachedFile";


export interface FatDraft {

    samplePreparations: SamplePreparationFat[];

    calculations: CalculationFat[];

    files: AttachedFile[];

    isPreparationCompleted: boolean;

    completedAt: Date | null;
}