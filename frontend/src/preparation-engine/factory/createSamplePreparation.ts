import { moduleRegistry } from "../configs/moduleRegistry";

export const createSamplePreparation = (
    parameterType: keyof typeof moduleRegistry,
    index: number
): any => {

    const labels =
        moduleRegistry[parameterType].labels;


    // =====================================================
    // SUGAR
    // =====================================================

    if (parameterType === "sugar") {

        return {

            id:
                Date.now() + index,

            label:
                `Sample Preparation ${index + 1}`,

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

            id:
                Date.now() + index,

            label:
                `Sample Preparation ${index + 1}`,

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
    // CARBOHYDRATE
    // =====================================================

    if (parameterType === "carbohydrate") {

        return {

            id:
                Date.now() + index,

            label:
                `Sample Preparation ${index + 1}`,

            steps: [

                {
                    name: "Moisture",
                    value1: "",
                    unit1: "g/100g",
                    logBookID: "",
                },

                {
                    name: "Ash",
                    value1: "",
                    unit1: "g/100g",
                    logBookID: "",
                },

                {
                    name: "Protein",
                    value1: "",
                    unit1: "g/100g",
                    logBookID: "",
                },

                {
                    name: "Fat",
                    value1: "",
                    unit1: "g/100g",
                    logBookID: "",
                },

            ],

        };

    }


    // =====================================================
    // CRUDE FIBER
    // =====================================================

    if (parameterType === "crudeFiber") {

        return {

            id:
                Date.now() + index,

            label:
                `Sample Preparation ${index + 1}`,

            steps: [

                {
                    name:
                        "Weight of Crucible after Drying",

                    value1:
                        "",

                    unit1:
                        "g",

                    logBookID:
                        "",
                },

                {
                    name:
                        "Weight of Crucible after Ashing",

                    value1:
                        "",

                    unit1:
                        "g",

                    logBookID:
                        "",
                },

                {
                    name:
                        "Weight of Sample",

                    value1:
                        "",

                    unit1:
                        "g",

                    logBookID:
                        "",
                },

            ],

        };

    }


    // =====================================================
    // PEROXIDE VALUE
    // =====================================================

    if (parameterType === "peroxideValue") {

        return {

            id:
                Date.now() + index,

            label:
                `Sample Preparation ${index + 1}`,

            steps: [

                {
                    name:
                        "Sample Weight",

                    value1:
                        "",

                    unit1:
                        "g",

                    logBookID:
                        "",
                },

                {
                    name:
                        "Sample Titre Value",

                    value1:
                        "",

                    unit1:
                        "ml",

                    logBookID:
                        "",
                },

                {
                    name:
                        "Blank Titre Value",

                    value1:
                        "",

                    unit1:
                        "ml",

                    logBookID:
                        "",
                },

                {
                    name:
                        "Normality",

                    value1:
                        "",

                    unit1:
                        "ml",

                    logBookID:
                        "",
                },

            ],

        };

    }

    // =====================================================
    // FREE FATTY ACID
    // =====================================================

    if (parameterType === "freeFattyAcid") {

        return {

            id:
                Date.now() + index,

            label:
                `Sample Preparation ${index + 1}`,

            steps: [

                // =================================================
                // 1. SAMPLE WEIGHT
                // =================================================

                {
                    name:
                        "Sample Weight",

                    value1:
                        "",

                    unit1:
                        "g",

                    logBookID:
                        "",
                },


                // =================================================
                // 2. SAMPLE TITRE VALUE
                // =================================================

                {
                    name:
                        "Sample Titre Value",

                    value1:
                        "",

                    unit1:
                        "ml",

                    logBookID:
                        "",
                },


                // =================================================
                // 3. NORMALITY OF HCL
                // =================================================

                {
                    name:
                        "Normality of HCL",

                    value1:
                        "",

                    unit1:
                        "N",

                    logBookID:
                        "",
                },


                // =================================================
                // 4. FACTOR
                // =================================================

                {
                    name:
                        "Factor",

                    value1:
                        "",

                    unit1:
                        "",

                    logBookID:
                        "",
                }

            ],

        };

    }


    // =====================================================
    // ACID VALUE
    // =====================================================

    if (parameterType === "acidValue") {

        return {

            id:
                Date.now() + index,

            label:
                `Sample Preparation ${index + 1}`,

            steps: [

                {
                    name:
                        "Sample Weight",

                    value1:
                        "",

                    unit1:
                        "g",

                    logBookID:
                        "",
                },

                {
                    name:
                        "Sample Titre Value",

                    value1:
                        "",

                    unit1:
                        "ml",

                    logBookID:
                        "",
                },

                {
                    name:
                        "Normality",

                    value1:
                        "",

                    unit1:
                        "N",

                    logBookID:
                        "",
                },

                {
                    name:
                        "Factor",

                    value1:
                        "",

                    unit1:
                        "",

                    logBookID:
                        "",
                },

            ],

        };

    }

    // =====================================================
    // SAPONIFICATION VALUE
    // =====================================================

    if (parameterType === "saponificationValue") {

        return {

            id:
                Date.now() + index,

            label:
                `Sample Preparation ${index + 1}`,

            steps: [

                {
                    name:
                        "Sample Weight",

                    value1:
                        "",

                    unit1:
                        "g",

                    logBookID:
                        "",
                },

                {
                    name:
                        "Sample Titre Value",

                    value1:
                        "",

                    unit1:
                        "ml",

                    logBookID:
                        "",
                },

                {
                    name:
                        "Blank Titre Value",

                    value1:
                        "",

                    unit1:
                        "ml",

                    logBookID:
                        "",
                },

                {
                    name:
                        "Normality of HCL",

                    value1:
                        "",

                    unit1:
                        "N",

                    logBookID:
                        "",
                },

                {
                    name:
                        "Factor",

                    value1:
                        "",

                    unit1:
                        "",

                    logBookID:
                        "",
                },

            ],

        };

    }


    // =====================================================
    // UNSAPONIFIABLE MATTER
    // =====================================================

    if (parameterType === "unsapMatter") {

        return {

            id:
                Date.now() + index,

            label:
                `Sample Preparation ${index + 1}`,

            steps: [

                {
                    name:
                        "Sample Weight",

                    value1:
                        "",

                    unit1:
                        "g",

                    logBookID:
                        "",
                },

                {
                    name:
                        "Weight of Empty Flask",

                    value1:
                        "",

                    unit1:
                        "g",

                    logBookID:
                        "",
                },

                {
                    name:
                        "Weight of Residue + Empty Flask",

                    value1:
                        "",

                    unit1:
                        "g",

                    logBookID:
                        "",
                },

                {
                    name:
                        "Normality of 0.02 N NaOH",

                    value1:
                        "",

                    unit1:
                        "N",

                    logBookID:
                        "",
                },

                {
                    name:
                        "Titre Value",

                    value1:
                        "",

                    unit1:
                        "ml",

                    logBookID:
                        "",
                },

                {
                    name:
                        "Factor",

                    value1:
                        "",

                    unit1:
                        "",

                    logBookID:
                        "",
                },

            ],

        };

    }


    // =====================================================
    // ARTIFICIAL SWEETNER
    // =====================================================

    if (parameterType === "artificialSweetner") {

        return {

            id:
                Date.now() + index,

            label:
                `Sample Preparation ${index + 1}`,

            steps: [

                // =================================================
                // 1. SAMPLE WEIGHT
                // =================================================

                {
                    name:
                        "Sample Weight",

                    value1:
                        "",

                    unit1:
                        "g",

                    logBookID:
                        "",
                },


                // =================================================
                // 2. VOLUME
                // =================================================

                {
                    name:
                        "Volume",

                    value1:
                        "",

                    unit1:
                        "ml",

                    logBookID:
                        "",
                },


                // =================================================
                // 3. INSTRUMENT CONCENTRATION
                // =================================================

                {
                    name:
                        "Instrument Concentration",

                    value1:
                        "",

                    unit1:
                        "ppm",

                    logBookID:
                        "",
                },


                // =================================================
                // 4. DILUTION FACTOR
                // =================================================

                {
                    name:
                        "Dilution Factor",

                    value1:
                        "",

                    unit1:
                        "",

                    logBookID:
                        "",
                },


                // =================================================
                // 5. PURITY
                // =================================================

                {
                    name:
                        "Purity",

                    value1:
                        "",

                    unit1:
                        "%",

                    logBookID:
                        "",
                },

            ],

        };

    }


    // =====================================================
    // NOTS
    // =====================================================

    if (parameterType === "nots") {

        return {

            id:
                Date.now() + index,

            label:
                `Sample Preparation ${index + 1}`,

            steps: [

                // =================================================
                // 1. SAMPLE WEIGHT
                // =================================================

                {
                    name:
                        "Sample Weight",

                    value1:
                        "",

                    unit1:
                        "g",

                    logBookID:
                        "",
                },


                // =================================================
                // 2. VOLUME
                // =================================================

                {
                    name:
                        "Volume",

                    value1:
                        "",

                    unit1:
                        "ml",

                    logBookID:
                        "",
                },


                // =================================================
                // 3. INSTRUMENT CONCENTRATION
                // =================================================

                {
                    name:
                        "Instrument Concentration",

                    value1:
                        "",

                    unit1:
                        "ppm",

                    logBookID:
                        "",
                },


                // =================================================
                // 4. DILUTION FACTOR
                // =================================================

                {
                    name:
                        "Dilution Factor",

                    value1:
                        "",

                    unit1:
                        "ml",

                    logBookID:
                        "",
                },


                // =================================================
                // 5. PURITY
                // =================================================

                {
                    name:
                        "Purity",

                    value1:
                        "",

                    unit1:
                        "%",

                    logBookID:
                        "",
                },

            ],

        };

    }


    // =====================================================
    // ARTIFICIAL COLOUR
    // =====================================================

    if (parameterType === "artificialColour") {

        return {

            id:
                Date.now() + index,

            label:
                `Sample Preparation ${index + 1}`,

            steps: [

                // =================================================
                // 1. SAMPLE WEIGHT
                // =================================================

                {
                    name:
                        "Sample Weight",

                    value1:
                        "",

                    unit1:
                        "g",

                    logBookID:
                        "",
                },


                // =================================================
                // 2. VOLUME
                // =================================================

                {
                    name:
                        "Volume",

                    value1:
                        "",

                    unit1:
                        "ml",

                    logBookID:
                        "",
                },


                // =================================================
                // 3. INSTRUMENT CONCENTRATION
                // =================================================

                {
                    name:
                        "Instrument Concentration",

                    value1:
                        "",

                    unit1:
                        "ppm",

                    logBookID:
                        "",
                },


                // =================================================
                // 4. DILUTION FACTOR
                // =================================================

                {
                    name:
                        "Dilution Factor",

                    value1:
                        "",

                    unit1:
                        "ml",

                    logBookID:
                        "",
                },


                // =================================================
                // 5. PURITY
                // =================================================

                {
                    name:
                        "Purity",

                    value1:
                        "",

                    unit1:
                        "%",

                    logBookID:
                        "",
                },

            ],

        };

    }


    // =====================================================
    // URIC ACID
    // =====================================================

    if (parameterType === "uricAcid") {

        return {

            id:
                Date.now() + index,

            label:
                `Sample Preparation ${index + 1}`,

            steps: [

                // =================================================
                // 1. SAMPLE WEIGHT
                // =================================================

                {
                    name:
                        "Sample Weight",

                    value1:
                        "",

                    unit1:
                        "g",

                    logBookID:
                        "",
                },


                // =================================================
                // 2. VOLUME
                // =================================================

                {
                    name:
                        "Volume",

                    value1:
                        "",

                    unit1:
                        "ml",

                    logBookID:
                        "",
                },


                // =================================================
                // 3. INSTRUMENT CONCENTRATION
                // =================================================

                {
                    name:
                        "Instrument Concentration",

                    value1:
                        "",

                    unit1:
                        "ppm",

                    logBookID:
                        "",
                },


                // =================================================
                // 4. DILUTION FACTOR
                // =================================================

                {
                    name:
                        "Dilution Factor",

                    value1:
                        "",

                    unit1:
                        "ml",

                    logBookID:
                        "",
                },


                // =================================================
                // 5. PURITY
                // =================================================

                {
                    name:
                        "Purity",

                    value1:
                        "",

                    unit1:
                        "%",

                    logBookID:
                        "",
                },

            ],

        };

    }


    // =====================================================
    // FSV (A, D, E, K)
    // =====================================================

    if (parameterType === "fsv") {

        return {

            id:
                Date.now() + index,

            label:
                `Sample Preparation ${index + 1}`,

            steps: [

                // =================================================
                // 1. SAMPLE WEIGHT
                // =================================================

                {
                    name:
                        "Sample Weight",

                    value1:
                        "",

                    unit1:
                        "g",

                    logBookID:
                        ""
                },


                // =================================================
                // 2. VOLUME
                // =================================================

                {
                    name:
                        "Volume",

                    value1:
                        "",

                    unit1:
                        "ml",

                    logBookID:
                        ""
                },


                // =================================================
                // 3. INSTRUMENT CONCENTRATION
                // =================================================

                {
                    name:
                        "Instrument Concentration",

                    value1:
                        "",

                    unit1:
                        "ppm",

                    logBookID:
                        ""
                },


                // =================================================
                // 4. DILUTION FACTOR
                // =================================================

                {
                    name:
                        "Dilution Factor",

                    value1:
                        "",

                    unit1:
                        "",

                    logBookID:
                        ""
                },


                // =================================================
                // 5. PURITY
                // =================================================

                {
                    name:
                        "Purity",

                    value1:
                        "",

                    unit1:
                        "%",

                    logBookID:
                        ""
                }

            ],

        };

    }


    // =====================================================
    // LOD / FAT
    // =====================================================

    return {

        id:
            Date.now() + index,

        label:
            `Sample Preparation ${index + 1}`,

        steps: [

            {
                name:
                    labels.w1,

                value1:
                    "",

                unit1:
                    "g",

                logBookID:
                    "",
            },

            {
                name:
                    labels.w2,

                value1:
                    "",

                unit1:
                    "g",

                logBookID:
                    "",
            },

            {
                name:
                    labels.drying,

                value1:
                    "",

                unit1:
                    "°C",

                value2:
                    "",

                unit2:
                    "min",

                logBookID:
                    "",
            },

            {
                name:
                    labels.w3,

                value1:
                    "",

                unit1:
                    "g",

                logBookID:
                    "",
            },

        ],

    };
};