import type { SamplePreparationArtificialColour }
    from "../../../preparation-engine/modules/artificial-colour/models/SamplePreparationArtificialColour";

import type { CalculationArtificialColour }
    from "../../../preparation-engine/modules/artificial-colour/models/CalculationArtificialColour";

import type { AttachedFile }
    from "../../../models/AttachedFile";


export interface ArtificialColourDraft {

    samplePreparations:
        SamplePreparationArtificialColour[];

    calculations:
        CalculationArtificialColour[];

    files:
        AttachedFile[];

    isPreparationCompleted:
        boolean;

    completedAt:
        Date | null;

}