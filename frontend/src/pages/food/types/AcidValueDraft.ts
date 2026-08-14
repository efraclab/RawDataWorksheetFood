import type { SamplePreparationAcidValue }
    from "../../../preparation-engine/modules/acid-value/models/SamplePreparationAcidValue";

import type { CalculationAcidValue }
    from "../../../preparation-engine/modules/acid-value/models/CalculationAcidValue";

import type { AttachedFile }
    from "../../../models/AttachedFile";


export interface AcidValueDraft {

    samplePreparations: SamplePreparationAcidValue[];

    calculations: CalculationAcidValue[];

    files: AttachedFile[];

    isPreparationCompleted: boolean;

    completedAt: Date | null;

}