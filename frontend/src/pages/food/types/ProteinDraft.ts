import type { SamplePreparationProtein } 
    from "../../../preparation-engine/modules/protein/models/SamplePreparationProtein";

import type { CalculationProtein }
    from "../../../preparation-engine/modules/protein/models/CalculationProtein";

import type { AttachedFile }
    from "../../../models/AttachedFile";

export interface ProteinDraft {

    samplePreparations: SamplePreparationProtein[];

    calculations: CalculationProtein[];

    files: AttachedFile[];

    isPreparationCompleted: boolean;

    completedAt: Date | null;
}