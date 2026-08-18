import type { SamplePreparationSugarSaponinCatechinProfile }
    from "../../../preparation-engine/modules/sugar-saponin-catechin-profile/models/SamplePreparationSugarSaponinCatechinProfile";

import type { CalculationSugarSaponinCatechinProfile }
    from "../../../preparation-engine/modules/sugar-saponin-catechin-profile/models/CalculationSugarSaponinCatechinProfile";

import type { AttachedFile }
    from "../../../models/AttachedFile";


export interface SugarSaponinCatechinProfileDraft {

    samplePreparations:
        SamplePreparationSugarSaponinCatechinProfile[];

    calculations:
        CalculationSugarSaponinCatechinProfile[];

    files:
        AttachedFile[];

    isPreparationCompleted:
        boolean;

    completedAt:
        Date | null;

}