import type { SamplePreparationArtificialSweetner }
    from "../../../preparation-engine/modules/artificial-sweetner/models/SamplePreparationArtificialSweetner";

import type { CalculationArtificialSweetner }
    from "../../../preparation-engine/modules/artificial-sweetner/models/CalculationArtificialSweetner";

import type { AttachedFile }
    from "../../../models/AttachedFile";


export interface ArtificialSweetnerDraft {

    samplePreparations:
        SamplePreparationArtificialSweetner[];

    calculations:
        CalculationArtificialSweetner[];

    files:
        AttachedFile[];

    isPreparationCompleted:
        boolean;

    completedAt:
        Date | null;

}