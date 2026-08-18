import type { SamplePreparationSulphurDioxide }
    from "../../../preparation-engine/modules/sulphur-dioxide/models/SamplePreparationSulphurDioxide";

import type { CalculationSulphurDioxide }
    from "../../../preparation-engine/modules/sulphur-dioxide/models/CalculationSulphurDioxide";

import type { AttachedFile }
    from "../../../models/AttachedFile";


export interface SulphurDioxideDraft {

    samplePreparations:
        SamplePreparationSulphurDioxide[];

    calculations:
        CalculationSulphurDioxide[];

    files:
        AttachedFile[];

    isPreparationCompleted:
        boolean;

    completedAt:
        Date | null;

}