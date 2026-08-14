import type { SamplePreparationSaponificationValue }
    from "../../../preparation-engine/modules/saponification-value/models/SamplePreparationSaponificationValue";

import type { CalculationSaponificationValue }
    from "../../../preparation-engine/modules/saponification-value/models/CalculationSaponificationValue";

import type { AttachedFile }
    from "../../../models/AttachedFile";


export interface SaponificationValueDraft {

    samplePreparations:
        SamplePreparationSaponificationValue[];

    calculations:
        CalculationSaponificationValue[];

    files:
        AttachedFile[];

    isPreparationCompleted:
        boolean;

    completedAt:
        Date | null;

}