// import type { SamplePreparationLod }
//     from "../../../preparation-engine/modules/lod/models/SamplePreparationLod";

// import type { CalculationLod }
//     from "../../../preparation-engine/modules/lod/models/CalculationLod";

// import type { SamplePreparationFat }
//     from "../../../preparation-engine/modules/fat/SamplePreparationFAT";

// import type { CalculationFat }
//     from "../../../preparation-engine/modules/fat/CalculationFat";

// import type { AttachedFile }
//     from "../../../models/AttachedFile";

import type { FatDraft } from "./FatDraft";
import type { LodDraft } from "./LodDraft";
import type { ProteinDraft } from "./ProteinDraft";
import type { SugarDraft } from "./SugarDraft";
import type { EnergyDraft } from "./EnergyDraft";

export interface PreparationDraft {

    activeGroup: string[];

    lod?: LodDraft;

    fat?: FatDraft;

    protein?: ProteinDraft;

    sugar?: SugarDraft;

    energy?: EnergyDraft;
}

// export interface LodDraft {

//     samplePreparations: SamplePreparationLod[];

//     calculations: CalculationLod[];

//     files: AttachedFile[];

//     isPreparationCompleted: boolean;

//     completedAt: Date | null;
// }

// export interface FatDraft {

//     samplePreparations: SamplePreparationFat[];

//     calculations: CalculationFat[];

//     files: AttachedFile[];

//     isPreparationCompleted: boolean;

//     completedAt: Date | null;
// }

