import { moduleRegistry } from "../configs/moduleRegistry";

export const createSamplePreparation = (
    parameterType: keyof typeof moduleRegistry,
    index: number
): any => {

    const labels = moduleRegistry[parameterType].labels;

    // =====================================================
    // SUGAR
    // =====================================================

    if (parameterType === "sugar") {

        return {

            id: Date.now() + index,

            label: `Sample Preparation ${index + 1}`,

            steps: [

                {
                    name: "Sample Weight",
                    value1: "",
                    unit1: "g",
                    logBookID: "",
                },

                {
                    name: "Volume Make Up 1",
                    value1: "",
                    unit1: "ml",
                    logBookID: "",
                },

                {
                    name: "Sample Titre Value",
                    value1: "",
                    unit1: "ml",
                    logBookID: "",
                },

                {
                    name: "Dilution Factor",
                    value1: "",
                    unit1: "",
                    logBookID: "",
                },

                {
                    name: "Std Dextrose Weight",
                    value1: "",
                    unit1: "g",
                    logBookID: "",
                },

                {
                    name: "Volume Make Up 2",
                    value1: "",
                    unit1: "ml",
                    logBookID: "",
                },

                {
                    name: "Standard Titre",
                    value1: "",
                    unit1: "ml",
                    logBookID: "",
                },

                {
                    name: "Aliquot",
                    value1: "",
                    unit1: "ml",
                    logBookID: "",
                },

                {
                    name: "Fehling Factor",
                    value1: "",
                    unit1: "",
                    logBookID: "",
                },

            ],

        };
    }

    // =====================================================
    // PROTEIN
    // =====================================================

    if (parameterType === "protein") {

        return {
            id: Date.now() + index,

            label: `Sample Preparation ${index + 1}`,

            steps: [
                {
                    name: "Sample Weight",
                    value1: "",
                    unit1: "g",
                    logBookID: "",
                },
                {
                    name: "Sample Titre Value",
                    value1: "",
                    unit1: "ml",
                    logBookID: "",
                },
                {
                    name: "Blank Titre Value",
                    value1: "",
                    unit1: "ml",
                    logBookID: "",
                },
                {
                    name: "Normality",
                    value1: "",
                    unit1: "ml",
                    logBookID: "",
                },
                {
                    name: "Protein Factor",
                    value1: "",
                    unit1: "",
                    logBookID: "",
                },
            ],
        };
    }

    // =====================================================
    // LOD / FAT
    // =====================================================

    return {
        id: Date.now() + index,

        label: `Sample Preparation ${index + 1}`,

        steps: [
            {
                name: labels.w1,
                value1: "",
                unit1: "g",
                logBookID: "",
            },
            {
                name: labels.w2,
                value1: "",
                unit1: "g",
                logBookID: "",
            },
            {
                name: labels.drying,
                value1: "",
                unit1: "°C",
                value2: "",
                unit2: "min",
                logBookID: "",
            },
            {
                name: labels.w3,
                value1: "",
                unit1: "g",
                logBookID: "",
            },
        ],
    };
};