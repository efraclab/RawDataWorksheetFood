import PreparationAnalysis from "../modules/lod/components/PreparationAnalysis";
import CalculationDetailLod from "../modules/lod/components/CalculationDetailLod";
import {
    createNewCalculationLod,
    createNewSamplePreparationLod,
    restoreCalculationLod
} from "../modules/lod/factory";

import CalculationDetailFAT from "../modules/fat/CalculationDetailFAT";
import {
    createCalculationFat,
    createSamplePreparationFat,
    restoreCalculationFat
} from "../modules/fat/factory";

import SamplePreparationDetail
    from "../modules/lod/components/SamplePreparationDetail";

import SamplePreparationDetailProtein
    from "../modules/protein/models/SamplePreparationDetailProtein";

import CalculationDetailProtein
    from "../modules/protein/CalculationDetailProtein";

import {
    createCalculationProtein,
    createSamplePreparationProtein,
    restoreCalculationProtein
} from "../modules/protein/factory";

import CalculationDetailSugar
    from "../modules/sugar/CalculationDetailSugar";

import {
    createCalculationSugar,
    createSamplePreparationSugar,
    restoreCalculationSugar
} from "../modules/sugar/factory";

import SamplePreparationDetailSugar
    from "../modules/sugar/models/SamplePreparationDetailSugar";

import CalculationDetailEnergy
    from "../modules/energy/CalculationDetailEnergy";

import SamplePreparationDetailEnergy
    from "../modules/energy/models/SamplePreparationDetailEnergy";

import {
    createCalculationEnergy,
    createSamplePreparationEnergy,
    restoreCalculationEnergy
} from "../modules/energy/factory";

import CalculationDetailCarbohydrate
    from "../modules/carbohydrate/CalculationDetailCarbohydrate";

import SamplePreparationDetailCarbohydrate
    from "../modules/carbohydrate/models/SamplePreparationDetailCarbohydrate";

import {
    createCalculationCarbohydrate,
    createSamplePreparationCarbohydrate,
    restoreCalculationCarbohydrate
} from "../modules/carbohydrate/factory";

import CalculationDetailCrudeFiber
    from "../modules/crude-fiber/CalculationDetailCrudeFiber";

import SamplePreparationDetailCrudeFiber
    from "../modules/crude-fiber/models/SamplePreparationDetailCrudeFiber";

import {
    createCalculationCrudeFiber,
    createSamplePreparationCrudeFiber,
    restoreCalculationCrudeFiber
} from "../modules/crude-fiber/factory";

import CalculationDetailPeroxideValue
    from "../modules/peroxide-value/CalculationDetailPeroxideValue";

import SamplePreparationDetailPeroxideValue
    from "../modules/peroxide-value/models/SamplePreparationDetailPeroxideValue";

import {
    createCalculationPeroxideValue,
    createSamplePreparationPeroxideValue,
    restoreCalculationPeroxideValue
} from "../modules/peroxide-value/factory";

// ============================================================
// FREE FATTY ACID
// ============================================================

import CalculationDetailFreeFattyAcid
    from "../modules/free-fatty-acid/CalculationDetailFreeFattyAcid";

import SamplePreparationDetailFreeFattyAcid
    from "../modules/free-fatty-acid/models/SamplePreparationDetailFreeFattyAcid";

import {
    createCalculationFreeFattyAcid,
    createSamplePreparationFreeFattyAcid,
    restoreCalculationFreeFattyAcid
} from "../modules/free-fatty-acid/factory";


// ============================================================
// UNSAPONIFIABLE MATTER
// ============================================================

import CalculationDetailUnsapMatter
    from "../modules/unsap-matter/CalculationDetailUnsapMatter";

import SamplePreparationDetailUnsapMatter
    from "../modules/unsap-matter/models/SamplePreparationDetailUnsapMatter";

import {
    createCalculationUnsapMatter,
    createSamplePreparationUnsapMatter,
    restoreCalculationUnsapMatter
} from "../modules/unsap-matter/factory";


// ============================================================
 // ARTIFICIAL SWEETNER
 // ============================================================

import CalculationDetailArtificialSweetner
    from "../modules/artificial-sweetner/CalculationDetailArtificialSweetner";

import SamplePreparationDetailArtificialSweetner
    from "../modules/artificial-sweetner/models/SamplePreparationDetailArtificialSweetner";

import {
    createCalculationArtificialSweetner,
    createSamplePreparationArtificialSweetner,
    restoreCalculationArtificialSweetner
} from "../modules/artificial-sweetner/factory";


// ============================================================
 // PRESERVATIVE
 // ============================================================

import CalculationDetailPreservative
    from "../modules/preservative/CalculationDetailPreservative";

import SamplePreparationDetailPreservative
    from "../modules/preservative/models/SamplePreparationDetailPreservative";

import {
    createCalculationPreservative,
    createSamplePreparationPreservative,
    restoreCalculationPreservative
} from "../modules/preservative/factory";


// ============================================================
// NOTS
// ============================================================

import CalculationDetailNots
    from "../modules/nots/CalculationDetailNots";

import SamplePreparationDetailNots
    from "../modules/nots/models/SamplePreparationDetailNots";

import {
    createCalculationNots,
    createSamplePreparationNots,
    restoreCalculationNots
} from "../modules/nots/factory";


 // ============================================================
 // ARTIFICIAL COLOUR
 // ============================================================

import CalculationDetailArtificialColour
    from "../modules/artificial-colour/CalculationDetailArtificialColour";

import SamplePreparationDetailArtificialColour
    from "../modules/artificial-colour/models/SamplePreparationDetailArtificialColour";

import {
    createCalculationArtificialColour,
    createSamplePreparationArtificialColour,
    restoreCalculationArtificialColour
} from "../modules/artificial-colour/factory";


// ============================================================
// URIC ACID
// ============================================================

import CalculationDetailUricAcid
    from "../modules/uric-acid/CalculationDetailUricAcid";

import SamplePreparationDetailUricAcid
    from "../modules/uric-acid/models/SamplePreparationDetailUricAcid";

import {
    createCalculationUricAcid,
    createSamplePreparationUricAcid,
    restoreCalculationUricAcid
} from "../modules/uric-acid/factory";

// ============================================================
// FSV (A, D, E, K)
// ============================================================

import CalculationDetailFSV
    from "../modules/fsv/CalculationDetailFSV";

import SamplePreparationDetailFSV
    from "../modules/fsv/models/SamplePreparationDetailFSV";

import {
    createCalculationFSV,
    createSamplePreparationFSV,
    restoreCalculationFSV
} from "../modules/fsv/factory";


// ============================================================
// FATTY ACID PROFILE
// ============================================================

import CalculationDetailFattyAcidProfile
    from "../modules/fatty-acid-profile/CalculationDetailFattyAcidProfile";

import SamplePreparationDetailFattyAcidProfile
    from "../modules/fatty-acid-profile/models/SamplePreparationDetailFattyAcidProfile";

import {
    createCalculationFattyAcidProfile,
    createSamplePreparationFattyAcidProfile,
    restoreCalculationFattyAcidProfile
} from "../modules/fatty-acid-profile/factory";


// ============================================================
// ACID VALUE
// ============================================================

import CalculationDetailAcidValue
    from "../modules/acid-value/CalculationDetailAcidValue";

import SamplePreparationDetailAcidValue
    from "../modules/acid-value/models/SamplePreparationDetailAcidValue";

import {
    createCalculationAcidValue,
    createSamplePreparationAcidValue,
    restoreCalculationAcidValue
} from "../modules/acid-value/factory";


// ============================================================
// SAPONIFICATION VALUE
// ============================================================

import CalculationDetailSaponificationValue
    from "../modules/saponification-value/CalculationDetailSaponificationValue";

import SamplePreparationDetailSaponificationValue
    from "../modules/saponification-value/models/SamplePreparationDetailSaponificationValue";

import {
    createCalculationSaponificationValue,
    createSamplePreparationSaponificationValue,
    restoreCalculationSaponificationValue
} from "../modules/saponification-value/factory";


interface ModuleLabels {

    details: string;

    w1: string;

    w2: string;

    drying: string;

    w3: string;

    w4?: string;
}


export const moduleRegistry: Record<
    string,
    {
        id: string;

        title: string;

        shortName: string;

        icon: string;

        analysisComponent: any;

        samplePreparationComponent: any;

        calculationComponent: any;

        createCalculation: any;

        createSamplePreparation: any;

        restoreCalculation: any;

        labels: ModuleLabels;
    }
> = {


    // ============================================================
    // LOD
    // ============================================================

    lod: {

        id: "lod",

        title: "LOD Analysis",

        shortName: "LOD",

        icon: "🧪",

        analysisComponent:
            PreparationAnalysis,

        samplePreparationComponent:
            SamplePreparationDetail,

        calculationComponent:
            CalculationDetailLod,

        createCalculation:
            createNewCalculationLod,

        createSamplePreparation:
            createNewSamplePreparationLod,

        restoreCalculation:
            restoreCalculationLod,

        labels: {

            details:
                "Sample Preparation for LOD Details",

            w1:
                "Weight of Empty Dish",

            w2:
                "Weight of Sample + Dish",

            drying:
                "Drying",

            w3:
                "Weight of Sample + Dish after Drying",
        }
    },


    // ============================================================
    // FAT
    // ============================================================

    fat: {

        id: "fat",

        title: "FAT Analysis",

        shortName: "FAT",

        icon: "🧈",

        analysisComponent:
            PreparationAnalysis,

        samplePreparationComponent:
            SamplePreparationDetail,

        calculationComponent:
            CalculationDetailFAT,

        createCalculation:
            createCalculationFat,

        createSamplePreparation:
            createSamplePreparationFat,

        restoreCalculation:
            restoreCalculationFat,

        labels: {

            details:
                "Sample Preparation for FAT Details",

            w1:
                "Initial Empty Weight of R.B Flask",

            w2:
                "Final weight of R.B Flask After Drying",

            drying:
                "Dry at",

            w3:
                "Weight of Sample",
        }
    },


    // ============================================================
    // PROTEIN
    // ============================================================

    protein: {

        id: "protein",

        title: "Protein Analysis",

        shortName: "Protein",

        icon: "🥛",

        analysisComponent:
            PreparationAnalysis,

        samplePreparationComponent:
            SamplePreparationDetailProtein,

        calculationComponent:
            CalculationDetailProtein,

        createCalculation:
            createCalculationProtein,

        createSamplePreparation:
            createSamplePreparationProtein,

        restoreCalculation:
            restoreCalculationProtein,

        labels: {

            details:
                "Sample Preparation for Protein Details",

            w1:
                "Sample Weight",

            w2:
                "Sample Titre Value",

            drying:
                "Blank Titre Value",

            w3:
                "Normality",

            w4:
                "Protein Factor",
        }
    },


    // ============================================================
    // SUGAR
    // ============================================================

    sugar: {

        id: "sugar",

        title: "Total Sugar Analysis",

        shortName: "Total Sugar",

        icon: "🍬",

        analysisComponent:
            PreparationAnalysis,

        samplePreparationComponent:
            SamplePreparationDetailSugar,

        calculationComponent:
            CalculationDetailSugar,

        createCalculation:
            createCalculationSugar,

        createSamplePreparation:
            createSamplePreparationSugar,

        restoreCalculation:
            restoreCalculationSugar,

        labels: {

            details:
                "Sample Preparation for Total Sugar Details",

            w1:
                "Sample Weight",

            w2:
                "Volume Make Up",

            drying:
                "Sample Titre Value",

            w3:
                "Dilution Factor",

            w4:
                "Std Dextrose Weight",
        }
    },


    // ============================================================
    // ENERGY
    // ============================================================

    energy: {

        id: "energy",

        title: "Energy Analysis",

        shortName: "Energy",

        icon: "⚡",

        analysisComponent:
            PreparationAnalysis,

        samplePreparationComponent:
            SamplePreparationDetailEnergy,

        calculationComponent:
            CalculationDetailEnergy,

        createCalculation:
            createCalculationEnergy,

        createSamplePreparation:
            createSamplePreparationEnergy,

        restoreCalculation:
            restoreCalculationEnergy,

        labels: {

            details:
                "Sample Preparation for Energy Details",

            w1:
                "Sample Weight",

            w2:
                "Energy Step 2",

            drying:
                "Energy Step 3",

            w3:
                "Energy Step 4",

            w4:
                "Energy Step 5"
        }
    },


    // ============================================================
    // CARBOHYDRATE
    // ============================================================

    carbohydrate: {

        id: "carbohydrate",

        title: "Carbohydrate Analysis",

        shortName: "Carbohydrate",

        icon: "🍞",

        analysisComponent:
            PreparationAnalysis,

        samplePreparationComponent:
            SamplePreparationDetailCarbohydrate,

        calculationComponent:
            CalculationDetailCarbohydrate,

        createCalculation:
            createCalculationCarbohydrate,

        createSamplePreparation:
            createSamplePreparationCarbohydrate,

        restoreCalculation:
            restoreCalculationCarbohydrate,

        labels: {

            details:
                "Sample Preparation for Carbohydrate Details",

            w1:
                "Moisture",

            w2:
                "Fat",

            drying:
                "Ash",

            w3:
                "Protein",

            w4:
                "Carbohydrate"
        }
    },


    // ============================================================
    // CRUDE FIBER
    // ============================================================

    crudeFiber: {

        id: "crudeFiber",

        title: "Crude Fiber Analysis",

        shortName: "Crude Fiber",

        icon: "🌾",

        analysisComponent:
            PreparationAnalysis,

        samplePreparationComponent:
            SamplePreparationDetailCrudeFiber,

        calculationComponent:
            CalculationDetailCrudeFiber,

        createCalculation:
            createCalculationCrudeFiber,

        createSamplePreparation:
            createSamplePreparationCrudeFiber,

        restoreCalculation:
            restoreCalculationCrudeFiber,

        labels: {

            details:
                "Sample Preparation for Crude Fiber Details",

            w1:
                "Weight of Crucible after Drying",

            w2:
                "Weight of Crucible after Ashing",

            drying:
                "Drying",

            w3:
                "Weight of Sample",

            w4:
                "Crude Fiber"
        }
    },


    // ============================================================
    // PEROXIDE VALUE
    // ============================================================

    peroxideValue: {

        id: "peroxideValue",

        title: "Peroxide Value Analysis",

        shortName: "Peroxide Value",

        icon: "🧪",

        analysisComponent:
            PreparationAnalysis,

        samplePreparationComponent:
            SamplePreparationDetailPeroxideValue,

        calculationComponent:
            CalculationDetailPeroxideValue,

        createCalculation:
            createCalculationPeroxideValue,

        createSamplePreparation:
            createSamplePreparationPeroxideValue,

        restoreCalculation:
            restoreCalculationPeroxideValue,

        labels: {

            details:
                "Sample Preparation for Peroxide Value Details",

            w1:
                "Sample Weight",

            w2:
                "Sample Titre Value",

            drying:
                "Blank Titre Value",

            w3:
                "Normality",

            w4:
                "Peroxide Value"
        }
    },


    // ============================================================
    // ACID VALUE
    // ============================================================

    acidValue: {

        id: "acidValue",

        title: "Acid Value Analysis",

        shortName: "Acid Value",

        icon: "🧪",

        analysisComponent:
            PreparationAnalysis,

        samplePreparationComponent:
            SamplePreparationDetailAcidValue,

        calculationComponent:
            CalculationDetailAcidValue,

        createCalculation:
            createCalculationAcidValue,

        createSamplePreparation:
            createSamplePreparationAcidValue,

        restoreCalculation:
            restoreCalculationAcidValue,

        labels: {

            details:
                "Sample Preparation for Acid Value Details",

            w1:
                "Sample Weight",

            w2:
                "Sample Titre Value",

            drying:
                "Normality",

            w3:
                "Factor",

            w4:
                "Acid Value"
        }
    },


    // ============================================================
    // SAPONIFICATION VALUE
    // ============================================================

    saponificationValue: {

        id: "saponificationValue",

        title:
            "Saponification Value Analysis",

        shortName:
            "Saponification Value",

        icon:
            "🧪",

        analysisComponent:
            PreparationAnalysis,

        samplePreparationComponent:
            SamplePreparationDetailSaponificationValue,

        calculationComponent:
            CalculationDetailSaponificationValue,

        createCalculation:
            createCalculationSaponificationValue,

        createSamplePreparation:
            createSamplePreparationSaponificationValue,

        restoreCalculation:
            restoreCalculationSaponificationValue,

        labels: {

            details:
                "Sample Preparation for Saponification Value Details",

            w1:
                "Sample Weight",

            w2:
                "Sample Titre Value",

            drying:
                "Blank Titre Value",

            w3:
                "Normality of HCL",

            w4:
                "Factor"
        }
    },

    // ============================================================
    // FREE FATTY ACID
    // ============================================================

    freeFattyAcid: {

        id:
            "freeFattyAcid",

        title:
            "Free Fatty Acid Analysis",

        shortName:
            "Free Fatty Acid",

        icon:
            "🧪",

        analysisComponent:
            PreparationAnalysis,

        samplePreparationComponent:
            SamplePreparationDetailFreeFattyAcid,

        calculationComponent:
            CalculationDetailFreeFattyAcid,

        createCalculation:
            createCalculationFreeFattyAcid,

        createSamplePreparation:
            createSamplePreparationFreeFattyAcid,

        restoreCalculation:
            restoreCalculationFreeFattyAcid,

        labels: {

            details:
                "Sample Preparation for Free Fatty Acid Details",

            w1:
                "Sample Weight",

            w2:
                "Sample Titre Value",

            drying:
                "Normality of HCL",

            w3:
                "Factor",

            w4:
                "Free Fatty Acid"

        }

    },


    // ============================================================
    // UNSAPONIFIABLE MATTER
    // ============================================================

    unsapMatter: {

        id:
            "unsapMatter",

        title:
            "Unsaponifiable Matter Analysis",

        shortName:
            "Unsaponifiable Matter",

        icon:
            "🧪",

        analysisComponent:
            PreparationAnalysis,

        samplePreparationComponent:
            SamplePreparationDetailUnsapMatter,

        calculationComponent:
            CalculationDetailUnsapMatter,

        createCalculation:
            createCalculationUnsapMatter,

        createSamplePreparation:
            createSamplePreparationUnsapMatter,

        restoreCalculation:
            restoreCalculationUnsapMatter,

        labels: {

            details:
                "Sample Preparation for Unsaponifiable Matter Details",

            w1:
                "Sample Weight",

            w2:
                "Weight of Empty Flask",

            drying:
                "Weight of Residue + Empty Flask",

            w3:
                "Residue Weight",

            w4:
                "Unsaponifiable Matter"

        }

    }
,


    // ============================================================
    // ARTIFICIAL SWEETNER
    // ============================================================

    artificialSweetner: {

        id:
            "artificialSweetner",

        title:
            "Artificial Sweetner Analysis",

        shortName:
            "Artificial Sweetner",

        icon:
            "🧪",

        analysisComponent:
            PreparationAnalysis,

        samplePreparationComponent:
            SamplePreparationDetailArtificialSweetner,

        calculationComponent:
            CalculationDetailArtificialSweetner,

        createCalculation:
            createCalculationArtificialSweetner,

        createSamplePreparation:
            createSamplePreparationArtificialSweetner,

        restoreCalculation:
            restoreCalculationArtificialSweetner,

        labels: {

            details:
                "Sample Preparation for Artificial Sweetner Details",

            w1:
                "Sample Weight",

            w2:
                "Volume",

            drying:
                "Instrument Concentration",

            w3:
                "Dilution Factor",

            w4:
                "Purity"

        }

    }
,


    // ============================================================
    // PRESERVATIVE
    // ============================================================

    preservative: {

        id:
            "preservative",

        title:
            "Preservative Analysis",

        shortName:
            "Preservative",

        icon:
            "🧪",

        analysisComponent:
            PreparationAnalysis,

        samplePreparationComponent:
            SamplePreparationDetailPreservative,

        calculationComponent:
            CalculationDetailPreservative,

        createCalculation:
            createCalculationPreservative,

        createSamplePreparation:
            createSamplePreparationPreservative,

        restoreCalculation:
            restoreCalculationPreservative,

        labels: {

            details:
                "Sample Preparation for Preservative Details",

            w1:
                "Sample Weight",

            w2:
                "Preservative Step 2",

            drying:
                "Preservative Step 3",

            w3:
                "Preservative Step 4",

            w4:
                "Preservative"

        }

    },


    // ============================================================
    // NOTS
    // ============================================================

    nots: {

        id:
            "nots",

        title:
            "NOTS Analysis",

        shortName:
            "NOTS",

        icon:
            "🧪",

        analysisComponent:
            PreparationAnalysis,

        samplePreparationComponent:
            SamplePreparationDetailNots,

        calculationComponent:
            CalculationDetailNots,

        createCalculation:
            createCalculationNots,

        createSamplePreparation:
            createSamplePreparationNots,

        restoreCalculation:
            restoreCalculationNots,

        labels: {

            details:
                "Sample Preparation for NOTS Details",

            w1:
                "Sample Weight",

            w2:
                "NOTS Step 2",

            drying:
                "NOTS Step 3",

            w3:
                "NOTS Step 4",

            w4:
                "NOTS"

        }

    },


    // ============================================================
    // ARTIFICIAL COLOUR
    // ============================================================

    artificialColour: {

        id:
            "artificialColour",

        title:
            "Artificial Colour Analysis",

        shortName:
            "Artificial Colour",

        icon:
            "🎨",

        analysisComponent:
            PreparationAnalysis,

        samplePreparationComponent:
            SamplePreparationDetailArtificialColour,

        calculationComponent:
            CalculationDetailArtificialColour,

        createCalculation:
            createCalculationArtificialColour,

        createSamplePreparation:
            createSamplePreparationArtificialColour,

        restoreCalculation:
            restoreCalculationArtificialColour,

        labels: {

            details:
                "Sample Preparation for Artificial Colour Details",

            w1:
                "Sample Weight",

            w2:
                "Artificial Colour Step 2",

            drying:
                "Artificial Colour Step 3",

            w3:
                "Artificial Colour Step 4",

            w4:
                "Artificial Colour"

        }

    },


    // ============================================================
    // URIC ACID
    // ============================================================

    uricAcid: {

        id:
            "uricAcid",

        title:
            "Uric Acid Analysis",

        shortName:
            "Uric Acid",

        icon:
            "🧪",

        analysisComponent:
            PreparationAnalysis,

        samplePreparationComponent:
            SamplePreparationDetailUricAcid,

        calculationComponent:
            CalculationDetailUricAcid,

        createCalculation:
            createCalculationUricAcid,

        createSamplePreparation:
            createSamplePreparationUricAcid,

        restoreCalculation:
            restoreCalculationUricAcid,

        labels: {

            details:
                "Sample Preparation for Uric Acid Details",

            w1:
                "Sample Weight",

            w2:
                "Volume",

            drying:
                "Instrument Concentration",

            w3:
                "Dilution Factor",

            w4:
                "Purity"

        }

    },


    // ============================================================
    // FSV (A, D, E, K)
    // ============================================================

    fsv: {

        id:
            "fsv",

        title:
            "FSV (A, D, E, K) Analysis",

        shortName:
            "FSV",

        icon:
            "🧪",

        analysisComponent:
            PreparationAnalysis,

        samplePreparationComponent:
            SamplePreparationDetailFSV,

        calculationComponent:
            CalculationDetailFSV,

        createCalculation:
            createCalculationFSV,

        createSamplePreparation:
            createSamplePreparationFSV,

        restoreCalculation:
            restoreCalculationFSV,

        labels: {

            details:
                "Sample Preparation for FSV (A, D, E, K) Details",

            w1:
                "Sample Weight",

            w2:
                "Volume",

            drying:
                "Instrument Concentration",

            w3:
                "Dilution Factor",

            w4:
                "Purity"

        }

    },


    // ============================================================
    // FATTY ACID PROFILE
    // ============================================================

    fattyAcidProfile: {

        id:
            "fattyAcidProfile",

        title:
            "Fatty Acid Profile Analysis",

        shortName:
            "Fatty Acid Profile",

        icon:
            "🧬",

        analysisComponent:
            PreparationAnalysis,

        samplePreparationComponent:
            SamplePreparationDetailFattyAcidProfile,

        calculationComponent:
            CalculationDetailFattyAcidProfile,

        createCalculation:
            createCalculationFattyAcidProfile,

        createSamplePreparation:
            createSamplePreparationFattyAcidProfile,

        restoreCalculation:
            restoreCalculationFattyAcidProfile,

        labels: {

            details:
                "Sample Preparation for Fatty Acid Profile Details",

            w1:
                "Sample Area %",

            w2:
                "Fat Content",

            drying:
                "Fatty Acid Profile",

            w3:
                "Result",

            w4:
                "Fatty Acid Profile"

        }

    }

};