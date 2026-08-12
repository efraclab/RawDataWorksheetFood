import type { SamplePreparationLod }
    from "../../../preparation-engine/modules/lod/models/SamplePreparationLod";

import type { CalculationLod }
    from "../../../preparation-engine/modules/lod/models/CalculationLod";

import type { AttachedFile }
    from "../../../models/AttachedFile";


export interface LodDraft {

    samplePreparations: SamplePreparationLod[];

    calculations: CalculationLod[];

    files: AttachedFile[];

    isPreparationCompleted: boolean;

    completedAt: Date | null;
}