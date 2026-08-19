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
    // DIETARY FIBER
    // =====================================================

    if (parameterType === "dietaryFiber") {

        return {

            id:
                Date.now() + index,

            label:
                `Sample Preparation ${index + 1}`,

            steps: [

                // ========================================================
                // 1. WT OF SPL W1
                // ========================================================

                {
                    name:
                        "Wt of Spl (g) W1",

                    value1:
                        "",

                    unit1:
                        "g",

                    logBookID:
                        ""
                },

                // ========================================================
                // 2. WT OF SPL W2
                // ========================================================

                {
                    name:
                        "Wt of Spl (g) W2",

                    value1:
                        "",

                    unit1:
                        "g",

                    logBookID:
                        ""
                },

                // ========================================================
                // 3. EMPTY WT OF CRUCIBLE W1
                // ========================================================

                {
                    name:
                        "Empty wt of crucible(g) W1",

                    value1:
                        "",

                    unit1:
                        "g",

                    logBookID:
                        ""
                },

                // ========================================================
                // 4. EMPTY WT OF CRUCIBLE W2
                // ========================================================

                {
                    name:
                        "Empty wt of crucible(g) W2",

                    value1:
                        "",

                    unit1:
                        "g",

                    logBookID:
                        ""
                },

                // ========================================================
                // 5. CRUCIBLE + RESIDUE W1
                // ========================================================

                {
                    name:
                        "Crucible + Residue (g) W1",

                    value1:
                        "",

                    unit1:
                        "g",

                    logBookID:
                        ""
                },

                // ========================================================
                // 6. CRUCIBLE + RESIDUE W2
                // ========================================================

                {
                    name:
                        "Crucible + Residue (g) W2",

                    value1:
                        "",

                    unit1:
                        "g",

                    logBookID:
                        ""
                },

                // ========================================================
                // 7. AFTER ASHING
                // ========================================================

                {
                    name:
                        "After Ashing(g)",

                    value1:
                        "",

                    unit1:
                        "g",

                    logBookID:
                        ""
                },

                // ========================================================
                // 8. ASH
                // ========================================================

                {
                    name:
                        "Ash",

                    value1:
                        "",

                    unit1:
                        "%",

                    logBookID:
                        ""
                },

                // ========================================================
                // 9. SAMPLE TITRE VALUE
                // ========================================================

                {
                    name:
                        "Spl T.V(ml)",

                    value1:
                        "",

                    unit1:
                        "ml",

                    logBookID:
                        ""
                },

                // ========================================================
                // 10. BLANK TITRE VALUE
                // ========================================================

                {
                    name:
                        "Blk T.V(ml)",

                    value1:
                        "",

                    unit1:
                        "ml",

                    logBookID:
                        ""
                },

                // ========================================================
                // 11. NORMALITY
                // ========================================================

                {
                    name:
                        "Normality",

                    value1:
                        "",

                    unit1:
                        "N",

                    logBookID:
                        ""
                },

                // ========================================================
                // 12. BLANK WEIGHT
                // ========================================================

                {
                    name:
                        "Blank Wt",

                    value1:
                        "",

                    unit1:
                        "g",

                    logBookID:
                        ""
                }

            ]

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
    // ACIDITY
    // =====================================================

    if (parameterType === "acidity") {

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
    // MOISTURE
    // =====================================================

    if (parameterType === "moisture") {

        return {

            id:
                Date.now() + index,

            label:
                `Sample Preparation ${index + 1}`,

            steps: [

                // =================================================
                // 1. WEIGHT OF EMPTY DISH - W1
                // =================================================

                {
                    name:
                        "Weight of Empty Dish",

                    value1:
                        "",

                    unit1:
                        "g",

                    logBookID:
                        ""
                },


                // =================================================
                // 2. WEIGHT OF SAMPLE + DISH - W2
                // =================================================

                {
                    name:
                        "Weight of Sample + Dish",

                    value1:
                        "",

                    unit1:
                        "g",

                    logBookID:
                        ""
                },


                // =================================================
                // 3. AFTER DRYING
                // =================================================

                {
                    name:
                        "After Drying",

                    value1:
                        "",

                    unit1:
                        "°C",

                    value2:
                        "",

                    unit2:
                        "min",

                    logBookID:
                        ""
                },


                // =================================================
                // 4. WEIGHT OF SAMPLE + DISH AFTER DRYING - W3
                // =================================================

                {
                    name:
                        "Weight of Sample + Dish after Drying",

                    value1:
                        "",

                    unit1:
                        "g",

                    logBookID:
                        ""
                }

            ]

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
    // SULPHUR DIOXIDE
    // =====================================================

    if (parameterType === "sulphurDioxide") {

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
                // 3. BLANK TITRE VALUE
                // =================================================

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


                // =================================================
                // 4. NORMALITY
                // =================================================

                {
                    name:
                        "Normality",

                    value1:
                        "",

                    unit1:
                        "N",

                    logBookID:
                        "",
                }

            ],

        };

    }


    // =====================================================
    // CHOLESTEROL
    // =====================================================

    if (parameterType === "cholesterol") {

        return {

            id:
                Date.now() + index,

            label:
                `Sample Preparation ${index + 1}`,

            steps: [

                // =================================================
                // 1. SAMPLE WT
                // =================================================

                {
                    name:
                        "Sample wt",

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
                // 3. INSTRUMENT CONC
                // =================================================

                {
                    name:
                        "Instrument Conc",

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
                        "ml",

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
    // SUGAR / SAPONIN / CATECHIN PROFILE
    // =====================================================

    if (
        parameterType ===
        "sugarSaponinCatechinProfile"
    ) {

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
                        "ml",

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
    // FATTY ACID PROFILE
    // =====================================================

    if (parameterType === "fattyAcidProfile") {

        return {

            id:
                Date.now() + index,

            label:
                `Sample Preparation ${index + 1}`,

            steps: [

                // =================================================
                // 1. SAMPLE AREA %
                // =================================================

                {
                    name:
                        "Sample Area %",

                    value1:
                        "",

                    unit1:
                        "%",

                    logBookID:
                        ""
                },


                // =================================================
                // 2. FAT CONTENT
                // =================================================

                {
                    name:
                        "Fat Content",

                    value1:
                        "",

                    unit1:
                        "g/100g",

                    logBookID:
                        ""
                }

            ]

        };

    }


    // =====================================================
    // AMINO ACID ON PROTEIN BASIS
    // =====================================================

    if (parameterType === "aminoAcid") {

        return {

            id:
                Date.now() + index,

            label:
                `Sample Preparation ${index + 1}`,

            steps: [

                // =================================================
                // 1. SAMPLE AREA
                // Excel unit = "-"
                // =================================================

                {
                    name:
                        "Sample Area",

                    value1:
                        "",

                    unit1:
                        "-",

                    logBookID:
                        ""
                },

                // =================================================
                // 2. STANDARD CONC.
                // Excel unit = "mg/L"
                // =================================================

                {
                    name:
                        "Standard Conc.",

                    value1:
                        "",

                    unit1:
                        "mg/L",

                    logBookID:
                        ""
                },

                // =================================================
                // 3. SAMPLE DILUTION FACTOR
                // Excel unit = "-"
                // =================================================

                {
                    name:
                        "Sample Dilution Factor",

                    value1:
                        "",

                    unit1:
                        "-",

                    logBookID:
                        ""
                },

                // =================================================
                // 4. PURITY
                // Excel unit = "%"
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
                },

                // =================================================
                // 5. STANDARD AREA
                // Excel unit is blank.
                // Keep unit1 empty so the unit dropdown is hidden.
                // =================================================

                {
                    name:
                        "Standard Area",

                    value1:
                        "",

                    unit1:
                        "",

                    logBookID:
                        ""
                },

                // =================================================
                // 6. WEIGHT OF SAMPLE IN G
                // Excel unit = "g"
                // =================================================

                {
                    name:
                        "Weight Of Sample in g",

                    value1:
                        "",

                    unit1:
                        "g",

                    logBookID:
                        ""
                },

                // =================================================
                // 7. PROTEIN
                // Excel unit = "%"
                // =================================================

                {
                    name:
                        "Protein",

                    value1:
                        "",

                    unit1:
                        "%",

                    logBookID:
                        ""
                },

                // =================================================
                // 8. SAMPLE VOLUME
                // Excel unit is blank.
                // Keep unit1 empty so the unit dropdown is hidden.
                // =================================================

                {
                    name:
                        "Sample Volume",

                    value1:
                        "",

                    unit1:
                        "",

                    logBookID:
                        ""
                }

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
    // WSV (WATER SOLUBLE VITAMIN)
    // =====================================================

    if (parameterType === "wsv") {

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
                        "Sample wt",

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
                        "Instrument Conc",

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
                        "ml",

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