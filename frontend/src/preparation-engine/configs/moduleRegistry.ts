import PreparationAnalysis from "../modules/lod/components/PreparationAnalysis";
import CalculationDetailLod from "../modules/lod/components/CalculationDetailLod";
import { createNewCalculationLod, createNewSamplePreparationLod, restoreCalculationLod } from "../modules/lod/factory";
import CalculationDetailFAT from "../modules/fat/CalculationDetailFAT";
import { createCalculationFat, createSamplePreparationFat, restoreCalculationFat } from "../modules/fat/factory";
import SamplePreparationDetail from "../modules/lod/components/SamplePreparationDetail";
import SamplePreparationDetailProtein from "../modules/protein/models/SamplePreparationDetailProtein";
import CalculationDetailProtein from "../modules/protein/CalculationDetailProtein";
import { createCalculationProtein, createSamplePreparationProtein, restoreCalculationProtein } from "../modules/protein/factory";
import CalculationDetailSugar from "../modules/sugar/CalculationDetailSugar";
import { createCalculationSugar, createSamplePreparationSugar, restoreCalculationSugar } from "../modules/sugar/factory";
import SamplePreparationDetailSugar from "../modules/sugar/models/SamplePreparationDetailSugar";
import CalculationDetailEnergy from "../modules/energy/CalculationDetailEnergy";
import SamplePreparationDetailEnergy from "../modules/energy/models/SamplePreparationDetailEnergy";
import { createCalculationEnergy, createSamplePreparationEnergy, restoreCalculationEnergy } from "../modules/energy/factory";
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

    lod: {
        id: "lod",
        title: "LOD Analysis",
        shortName: "LOD",
        icon: "🧪",
        analysisComponent: PreparationAnalysis,
        samplePreparationComponent: SamplePreparationDetail,
        calculationComponent: CalculationDetailLod,
        createCalculation: createNewCalculationLod,
        createSamplePreparation: createNewSamplePreparationLod,
        restoreCalculation: restoreCalculationLod,
        labels: {
            details: "Sample Preparation for LOD Details",
            w1: "Weight of Empty Dish",
            w2: "Weight of Sample + Dish",
            drying: "Drying",
            w3: "Weight of Sample + Dish after Drying",
        }
    },

    fat: {
        id: "fat",
        title: "FAT Analysis",
        shortName: "FAT",
        icon: "🧈",
        analysisComponent: PreparationAnalysis,
        samplePreparationComponent: SamplePreparationDetail,
        calculationComponent: CalculationDetailFAT,
        createCalculation: createCalculationFat,
        createSamplePreparation: createSamplePreparationFat,
        restoreCalculation: restoreCalculationFat,
        labels: {
            details: "Sample Preparation for FAT Details",
            w1: "Initial Empty Weight of R.B Flask",
            w2: "Final weight of R.B Flask After Drying",
            drying: "Dry at",
            w3: "Weight of Sample",
        }
    },

    protein: {
        id: "protein",
        title: "Protein Analysis",
        shortName: "Protein",
        icon: "🥛",
        analysisComponent: PreparationAnalysis,
        samplePreparationComponent: SamplePreparationDetailProtein,
        calculationComponent: CalculationDetailProtein,
        createCalculation: createCalculationProtein,
        createSamplePreparation: createSamplePreparationProtein,
        restoreCalculation: restoreCalculationProtein,
        labels: {
            details: "Sample Preparation for Protein Details",
            w1: "Sample Weight",
            w2: "Sample Titre Value",
            drying: "Blank Titre Value",
            w3: "Normality",
            w4: "Protein Factor",
        }
    },
    sugar: {

        id: "sugar",

        title: "Total Sugar Analysis",

        shortName: "Total Sugar",

        icon: "🍬",

        analysisComponent: PreparationAnalysis,

        samplePreparationComponent: SamplePreparationDetailSugar,

        calculationComponent: CalculationDetailSugar,

        createCalculation: createCalculationSugar,

        createSamplePreparation: createSamplePreparationSugar,

        restoreCalculation: restoreCalculationSugar,

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
    energy: {

        id: "energy",

        title: "Energy Analysis",

        shortName: "Energy",

        icon: "⚡",

        analysisComponent: PreparationAnalysis,

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
};