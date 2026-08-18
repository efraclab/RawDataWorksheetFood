import type {
    SamplePreparationAminoAcid
} from "../../../preparation-engine/modules/amino-acid/models/SamplePreparationAminoAcid";

import type {
    CalculationAminoAcid
} from "../../../preparation-engine/modules/amino-acid/models/CalculationAminoAcid";

import type {
    AttachedFile
} from "../../../models/AttachedFile";


// ============================================================
// AMINO ACID DRAFT
// ============================================================

export interface AminoAcidDraft {

    samplePreparations:
        SamplePreparationAminoAcid[];

    calculations:
        CalculationAminoAcid[];

    files:
        AttachedFile[];

    isPreparationCompleted:
        boolean;

    completedAt:
        Date | null;

}