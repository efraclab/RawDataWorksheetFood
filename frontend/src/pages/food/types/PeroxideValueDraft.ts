import type { SamplePreparationPeroxideValue }
    from "../../../preparation-engine/modules/peroxide-value/models/SamplePreparationPeroxideValue";

import type { CalculationPeroxideValue }
    from "../../../preparation-engine/modules/peroxide-value/models/CalculationPeroxideValue";

import type { AttachedFile }
    from "../../../models/AttachedFile";


export interface PeroxideValueDraft {

    samplePreparations: SamplePreparationPeroxideValue[];

    calculations: CalculationPeroxideValue[];

    files: AttachedFile[];

    isPreparationCompleted: boolean;

    completedAt: Date | null;

}