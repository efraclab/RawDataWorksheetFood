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

};