import type { SamplePreparationEnergy }
    from "../../../preparation-engine/modules/energy/models/SamplePreparationEnergy";
import type { CalculationEnergy }
    from "../../../preparation-engine/modules/energy/models/CalculationEnergy";

import type { AttachedFile }
    from "../../../models/AttachedFile";

export interface EnergyDraft {

    samplePreparations: SamplePreparationEnergy[];

    calculations: CalculationEnergy[];

    files: AttachedFile[];

    isPreparationCompleted: boolean;

    completedAt: Date | null;

}