import type {
    SamplePreparationFattyAcidProfile
} from "../../../preparation-engine/modules/fatty-acid-profile/models/SamplePreparationFattyAcidProfile";

import type {
    CalculationFattyAcidProfile
} from "../../../preparation-engine/modules/fatty-acid-profile/models/CalculationFattyAcidProfile";

import type {
    AttachedFile
} from "../../../models/AttachedFile";


export interface FattyAcidProfileDraft {

    samplePreparations:
        SamplePreparationFattyAcidProfile[];

    calculations:
        CalculationFattyAcidProfile[];

    files:
        AttachedFile[];

    isPreparationCompleted:
        boolean;

    completedAt:
        Date | null;

}