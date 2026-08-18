import type { SamplePreparationAcidity }
    from "../../../preparation-engine/modules/acidity/models/SamplePreparationAcidity";

import type { CalculationAcidity }
    from "../../../preparation-engine/modules/acidity/models/CalculationAcidity";

import type { AttachedFile }
    from "../../../models/AttachedFile";


export interface AcidityDraft {

    samplePreparations: SamplePreparationAcidity[];

    calculations: CalculationAcidity[];

    files: AttachedFile[];

    isPreparationCompleted: boolean;

    completedAt: Date | null;

}