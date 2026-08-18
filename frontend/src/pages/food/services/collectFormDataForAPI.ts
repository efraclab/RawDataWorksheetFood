import type * as React from "react";

import type { WorksheetDetail }
    from "../../../models/WorksheetDetail";

import type { WorksheetRequest }
    from "../../../models/WorksheetRequest";

import type { ParameterDetail }
    from "../../../models/ParameterDetail";

import type { PreparationData }
    from "../../../models/PreparationData";

import type { CalculationData }
    from "../../../models/CalculationData";

import type { WorksheetFileData }
    from "../../../models/WorksheetFileData";


// ============================================================
// LOD
// ============================================================

import {
    mapLodDraftToPreparations,
    mapLodDraftToCalculations,
    mapLodDraftToFiles
} from "../mappers/lodMapper";


// ============================================================
// MOISTURE
// ============================================================

import {
    mapMoistureDraftToPreparations,
    mapMoistureDraftToCalculations,
    mapMoistureDraftToFiles
} from "../mappers/moistureMapper";



// ============================================================
// FAT
// ============================================================

import {
    mapFatDraftToPreparations,
    mapFatDraftToCalculations,
    mapFatDraftToFiles
} from "../mappers/fatMapper";


// ============================================================
// PROTEIN
// ============================================================

import {
    mapProteinDraftToPreparations,
    mapProteinDraftToCalculations,
    mapProteinDraftToFiles
} from "../mappers/proteinMapper";


// ============================================================
// SUGAR
// ============================================================

import {
    mapSugarDraftToPreparations,
    mapSugarDraftToCalculations,
    mapSugarDraftToFiles
} from "../mappers/sugarMapper";


// ============================================================
// ENERGY
// ============================================================

import {
    mapEnergyDraftToPreparations,
    mapEnergyDraftToCalculations,
    mapEnergyDraftToFiles
} from "../mappers/energyMapper";


// ============================================================
// CARBOHYDRATE
// ============================================================

import {
    mapCarbohydrateDraftToPreparations,
    mapCarbohydrateDraftToCalculations,
    mapCarbohydrateDraftToFiles
} from "../mappers/carbohydrateMapper";


// ============================================================
// CRUDE FIBER
// ============================================================

import {
    mapCrudeFiberDraftToPreparations,
    mapCrudeFiberDraftToCalculations,
    mapCrudeFiberDraftToFiles
} from "../mappers/crudeFiberMapper";


// ============================================================
// PEROXIDE VALUE
// ============================================================

import {
    mapPeroxideValueDraftToPreparations,
    mapPeroxideValueDraftToCalculations,
    mapPeroxideValueDraftToFiles
} from "../mappers/PeroxideValueMapper";


// ============================================================
// ACID VALUE
// ============================================================

import {
    mapAcidValueDraftToPreparations,
    mapAcidValueDraftToCalculations,
    mapAcidValueDraftToFiles
} from "../mappers/acidValueMapper";


// ============================================================
// SAPONIFICATION VALUE
// ============================================================

import {
    mapSaponificationValueDraftToPreparations,
    mapSaponificationValueDraftToCalculations,
    mapSaponificationValueDraftToFiles
} from "../mappers/saponificationMapper";


// ============================================================
// FREE FATTY ACID
// ============================================================

import {
    mapFreeFattyAcidDraftToPreparations,
    mapFreeFattyAcidDraftToCalculations,
    mapFreeFattyAcidDraftToFiles
} from "../mappers/freeFattyAcidMapper";


// ============================================================
// UNSAPONIFIABLE MATTER
// ============================================================

import {
    mapUnsapMatterDraftToPreparations,
    mapUnsapMatterDraftToCalculations,
    mapUnsapMatterDraftToFiles
} from "../mappers/unsapMatterMapper";


// ============================================================
// ARTIFICIAL SWEETNER
// ============================================================

import {
    mapArtificialSweetnerDraftToPreparations,
    mapArtificialSweetnerDraftToCalculations,
    mapArtificialSweetnerDraftToFiles
} from "../mappers/artificialSweetnerMapper";


// ============================================================
// PRESERVATIVE
// ============================================================

import {
    mapPreservativeDraftToPreparations,
    mapPreservativeDraftToCalculations,
    mapPreservativeDraftToFiles
} from "../mappers/preservativeMapper";


// ============================================================
// NOTS
// ============================================================

import {
    mapNotsDraftToPreparations,
    mapNotsDraftToCalculations,
    mapNotsDraftToFiles
} from "../mappers/NotsMapper";


// ============================================================
// SULPHUR DIOXIDE
// ============================================================

import {
    mapSulphurDioxideDraftToPreparations,
    mapSulphurDioxideDraftToCalculations,
    mapSulphurDioxideDraftToFiles
} from "../mappers/SulphurDioxideMapper";


// ============================================================
// CHOLESTEROL
// ============================================================

import {
    mapCholesterolDraftToPreparations,
    mapCholesterolDraftToCalculations,
    mapCholesterolDraftToFiles
} from "../mappers/cholesterolMapper";


// ============================================================
// WSV (WATER SOLUBLE VITAMIN)
// ============================================================

import {
    mapWsvDraftToPreparations,
    mapWsvDraftToCalculations,
    mapWsvDraftToFiles
} from "../mappers/wsvMapper";



// ============================================================
// AMINO ACID ON PROTEIN BASIS
// ============================================================

import {
    mapAminoAcidDraftToPreparations,
    mapAminoAcidDraftToCalculations,
    mapAminoAcidDraftToFiles
} from "../mappers/aminoAcidMapper";

// ============================================================
// ARTIFICIAL COLOUR
// ============================================================

import {
    mapArtificialColourDraftToPreparations,
    mapArtificialColourDraftToCalculations,
    mapArtificialColourDraftToFiles
} from "../mappers/ArtificialColourMapper";


// ============================================================
// URIC ACID
// ============================================================

import {
    mapUricAcidDraftToPreparations,
    mapUricAcidDraftToCalculations,
    mapUricAcidDraftToFiles
} from "../mappers/uricAcidMapper";


// ============================================================
// FSV (A, D, E, K)
// ============================================================

import {
    mapFSVDraftToPreparations,
    mapFSVDraftToCalculations,
    mapFSVDraftToFiles
} from "../mappers/FSVMapper";


// ============================================================
// FATTY ACID PROFILE
// ============================================================

import {
    mapFattyAcidProfileDraftToPreparations,
    mapFattyAcidProfileDraftToCalculations,
    mapFattyAcidProfileDraftToFiles
} from "../mappers/fattyAcidProfileMapper";

import type { PreparationEngineHandle }
    from "../types/PreparationEngineHandle";


// ============================================================
// COLLECT FORM DATA
// ============================================================

export function collectFormDataForAPI({

    role,

    worksheetInfo,

    addedParameters,

    preparationRefs,

    bufferPreparationPerParam,

    mobilePhasePerParam,

    diluentPreparationsPerParam,

    systemSuitabilityPerParam,

    filesPerParam,

    additionalInfoPerParam,

    addedChemicals,

    addedStandards,

    addedInstruments

}: {

    role: string;

    worksheetInfo: WorksheetDetail;

    addedParameters: ParameterDetail[];

    preparationRefs: React.MutableRefObject<
        Record<number, PreparationEngineHandle | null>
    >;

    bufferPreparationPerParam:
        Record<number, any[]>;

    mobilePhasePerParam:
        Record<number, any[]>;

    diluentPreparationsPerParam:
        Record<number, any[]>;

    systemSuitabilityPerParam:
        Record<number, any[]>;

    filesPerParam:
        Record<number, any>;

    additionalInfoPerParam:
        Record<number, string>;

    addedChemicals:
        Record<number, any[]>;

    addedStandards:
        Record<number, any[]>;

    addedInstruments:
        Record<number, any[]>;

}): WorksheetRequest {

    return {

        role,

        worksheetId:
            worksheetInfo.sample.worksheetId,

        registrationInfo: {

            registrationNo:
                worksheetInfo.sample.registrationNo,

            sampleName:
                worksheetInfo.sample.sampleName,

            sampleCode:
                worksheetInfo.sample.sampleCode,

            sampleQuantity:
                worksheetInfo.sample.sampleQuantity ??
                undefined,

            natureOfSample:
                worksheetInfo.sample.natureOfSample ??
                undefined,

            numberOfParameters:
                addedParameters.length,

            dueDate:
                worksheetInfo.sample.dueDate,

            lab:
                worksheetInfo.sample.lab

        },

        documentInfo: {

            preparedBy:
                worksheetInfo.sample.preparedBy,

            revisionDate:
                worksheetInfo.sample.revisionDate,

            status:
                worksheetInfo.sample.status,

            approvedAt:
                worksheetInfo.sample.approvedAt

        },

        parameters:

            addedParameters.map(param => {

                const draft =
                    preparationRefs.current[param.id]
                        ?.collectDraft();


                // ========================================================
                // BUILD PREPARATIONS / CALCULATIONS / FILES
                // ========================================================

                const preparations:
                    PreparationData[] = [];

                const calculations:
                    CalculationData[] = [];

                const files:
                    WorksheetFileData[] = [];


                const activeGroup =
                    draft?.activeGroup?.[0];


                // ========================================================
                // LOD
                // ========================================================

                if (
                    activeGroup === "lod"
                ) {

                    preparations.push(
                        ...mapLodDraftToPreparations(
                            draft?.lod
                        )
                    );

                    calculations.push(
                        ...mapLodDraftToCalculations(
                            draft?.lod
                        )
                    );

                    files.push(
                        ...mapLodDraftToFiles(
                            draft?.lod
                        )
                    );
                }


                // ========================================================
                // FAT
                // ========================================================

                if (
                    activeGroup === "fat"
                ) {

                    preparations.push(
                        ...mapFatDraftToPreparations(
                            draft?.fat
                        )
                    );

                    calculations.push(
                        ...mapFatDraftToCalculations(
                            draft?.fat
                        )
                    );

                    files.push(
                        ...mapFatDraftToFiles(
                            draft?.fat
                        )
                    );
                }


                // ========================================================
                // PROTEIN
                // ========================================================

                if (
                    activeGroup === "protein"
                ) {

                    preparations.push(
                        ...mapProteinDraftToPreparations(
                            draft?.protein
                        )
                    );

                    calculations.push(
                        ...mapProteinDraftToCalculations(
                            draft?.protein
                        )
                    );

                    files.push(
                        ...mapProteinDraftToFiles(
                            draft?.protein
                        )
                    );
                }


                // ========================================================
                // SUGAR
                // ========================================================

                if (
                    activeGroup === "sugar"
                ) {

                    preparations.push(
                        ...mapSugarDraftToPreparations(
                            draft?.sugar
                        )
                    );

                    calculations.push(
                        ...mapSugarDraftToCalculations(
                            draft?.sugar
                        )
                    );

                    files.push(
                        ...mapSugarDraftToFiles(
                            draft?.sugar
                        )
                    );
                }


                // ========================================================
                // ENERGY
                // ========================================================

                if (
                    activeGroup === "energy"
                ) {

                    preparations.push(
                        ...mapEnergyDraftToPreparations(
                            draft?.energy
                        )
                    );

                    calculations.push(
                        ...mapEnergyDraftToCalculations(
                            draft?.energy
                        )
                    );

                    files.push(
                        ...mapEnergyDraftToFiles(
                            draft?.energy
                        )
                    );
                }


                // ========================================================
                // CARBOHYDRATE
                // ========================================================

                if (
                    activeGroup === "carbohydrate"
                ) {

                    preparations.push(
                        ...mapCarbohydrateDraftToPreparations(
                            draft?.carbohydrate
                        )
                    );

                    calculations.push(
                        ...mapCarbohydrateDraftToCalculations(
                            draft?.carbohydrate
                        )
                    );

                    files.push(
                        ...mapCarbohydrateDraftToFiles(
                            draft?.carbohydrate
                        )
                    );
                }


                // ========================================================
                // CRUDE FIBER
                // ========================================================

                if (
                    activeGroup === "crudeFiber"
                ) {

                    preparations.push(
                        ...mapCrudeFiberDraftToPreparations(
                            draft?.crudeFiber
                        )
                    );

                    calculations.push(
                        ...mapCrudeFiberDraftToCalculations(
                            draft?.crudeFiber
                        )
                    );

                    files.push(
                        ...mapCrudeFiberDraftToFiles(
                            draft?.crudeFiber
                        )
                    );
                }


                // ========================================================
                // PEROXIDE VALUE
                // ========================================================

                if (
                    activeGroup === "peroxideValue"
                ) {

                    preparations.push(
                        ...mapPeroxideValueDraftToPreparations(
                            draft?.peroxideValue
                        )
                    );

                    calculations.push(
                        ...mapPeroxideValueDraftToCalculations(
                            draft?.peroxideValue
                        )
                    );

                    files.push(
                        ...mapPeroxideValueDraftToFiles(
                            draft?.peroxideValue
                        )
                    );
                }


                // ========================================================
                // ACID VALUE
                // ========================================================

                if (
                    activeGroup === "acidValue"
                ) {

                    preparations.push(
                        ...mapAcidValueDraftToPreparations(
                            draft?.acidValue
                        )
                    );

                    calculations.push(
                        ...mapAcidValueDraftToCalculations(
                            draft?.acidValue
                        )
                    );

                    files.push(
                        ...mapAcidValueDraftToFiles(
                            draft?.acidValue
                        )
                    );
                }


                // ========================================================
                // SAPONIFICATION VALUE
                // ========================================================

                if (
                    activeGroup === "saponificationValue"
                ) {

                    preparations.push(
                        ...mapSaponificationValueDraftToPreparations(
                            draft?.saponificationValue
                        )
                    );

                    calculations.push(
                        ...mapSaponificationValueDraftToCalculations(
                            draft?.saponificationValue
                        )
                    );

                    files.push(
                        ...mapSaponificationValueDraftToFiles(
                            draft?.saponificationValue
                        )
                    );
                }


                // ========================================================
                // FREE FATTY ACID
                // ========================================================

                if (
                    activeGroup === "freeFattyAcid"
                ) {

                    preparations.push(
                        ...mapFreeFattyAcidDraftToPreparations(
                            draft?.freeFattyAcid
                        )
                    );

                    calculations.push(
                        ...mapFreeFattyAcidDraftToCalculations(
                            draft?.freeFattyAcid
                        )
                    );

                    files.push(
                        ...mapFreeFattyAcidDraftToFiles(
                            draft?.freeFattyAcid
                        )
                    );
                }


                // ========================================================
                // UNSAPONIFIABLE MATTER
                // ========================================================

                if (
                    activeGroup === "unsapMatter"
                ) {

                    preparations.push(
                        ...mapUnsapMatterDraftToPreparations(
                            draft?.unsapMatter
                        )
                    );

                    calculations.push(
                        ...mapUnsapMatterDraftToCalculations(
                            draft?.unsapMatter
                        )
                    );

                    files.push(
                        ...mapUnsapMatterDraftToFiles(
                            draft?.unsapMatter
                        )
                    );
                }


                // ========================================================
                // ARTIFICIAL SWEETNER
                // ========================================================

                if (
                    activeGroup === "artificialSweetner"
                ) {

                    preparations.push(
                        ...mapArtificialSweetnerDraftToPreparations(
                            draft?.artificialSweetner
                        )
                    );

                    calculations.push(
                        ...mapArtificialSweetnerDraftToCalculations(
                            draft?.artificialSweetner
                        )
                    );

                    files.push(
                        ...mapArtificialSweetnerDraftToFiles(
                            draft?.artificialSweetner
                        )
                    );
                }


                // ========================================================
                // PRESERVATIVE
                // ========================================================

                if (
                    activeGroup === "preservative"
                ) {

                    preparations.push(
                        ...mapPreservativeDraftToPreparations(
                            draft?.preservative
                        )
                    );

                    calculations.push(
                        ...mapPreservativeDraftToCalculations(
                            draft?.preservative
                        )
                    );

                    files.push(
                        ...mapPreservativeDraftToFiles(
                            draft?.preservative
                        )
                    );
                }


                // ========================================================
                // MOISTURE
                // ========================================================

                if (
                    activeGroup === "moisture"
                ) {

                    preparations.push(
                        ...mapMoistureDraftToPreparations(
                            draft?.moisture
                        )
                    );

                    calculations.push(
                        ...mapMoistureDraftToCalculations(
                            draft?.moisture
                        )
                    );

                    files.push(
                        ...mapMoistureDraftToFiles(
                            draft?.moisture
                        )
                    );
                }


                // ========================================================
                // NOTS
                // ========================================================

                if (
                    activeGroup === "nots"
                ) {

                    preparations.push(
                        ...mapNotsDraftToPreparations(
                            draft?.nots
                        )
                    );

                    calculations.push(
                        ...mapNotsDraftToCalculations(
                            draft?.nots
                        )
                    );

                    files.push(
                        ...mapNotsDraftToFiles(
                            draft?.nots
                        )
                    );
                }


                // ========================================================
                // SULPHUR DIOXIDE
                // ========================================================

                if (
                    activeGroup === "sulphurDioxide"
                ) {

                    preparations.push(
                        ...mapSulphurDioxideDraftToPreparations(
                            draft?.sulphurDioxide
                        )
                    );

                    calculations.push(
                        ...mapSulphurDioxideDraftToCalculations(
                            draft?.sulphurDioxide
                        )
                    );

                    files.push(
                        ...mapSulphurDioxideDraftToFiles(
                            draft?.sulphurDioxide
                        )
                    );
                }


                // ========================================================
                // CHOLESTEROL
                // ========================================================

                if (
                    activeGroup === "cholesterol"
                ) {

                    preparations.push(
                        ...mapCholesterolDraftToPreparations(
                            draft?.cholesterol
                        )
                    );

                    calculations.push(
                        ...mapCholesterolDraftToCalculations(
                            draft?.cholesterol
                        )
                    );

                    files.push(
                        ...mapCholesterolDraftToFiles(
                            draft?.cholesterol
                        )
                    );
                }


                // ========================================================
                // WSV (WATER SOLUBLE VITAMIN)
                // ========================================================

                if (
                    activeGroup === "wsv"
                ) {

                    preparations.push(
                        ...mapWsvDraftToPreparations(
                            draft?.wsv
                        )
                    );

                    calculations.push(
                        ...mapWsvDraftToCalculations(
                            draft?.wsv
                        )
                    );

                    files.push(
                        ...mapWsvDraftToFiles(
                            draft?.wsv
                        )
                    );
                }



                // ========================================================
                // AMINO ACID ON PROTEIN BASIS
                // ========================================================

                if (
                    activeGroup === "aminoAcid"
                ) {

                    preparations.push(
                        ...mapAminoAcidDraftToPreparations(
                            draft?.aminoAcid
                        )
                    );

                    calculations.push(
                        ...mapAminoAcidDraftToCalculations(
                            draft?.aminoAcid
                        )
                    );

                    files.push(
                        ...mapAminoAcidDraftToFiles(
                            draft?.aminoAcid
                        )
                    );
                }


                // ========================================================
                // ARTIFICIAL COLOUR
                // ========================================================

                if (
                    activeGroup === "artificialColour"
                ) {

                    preparations.push(
                        ...mapArtificialColourDraftToPreparations(
                            draft?.artificialColour
                        )
                    );

                    calculations.push(
                        ...mapArtificialColourDraftToCalculations(
                            draft?.artificialColour
                        )
                    );

                    files.push(
                        ...mapArtificialColourDraftToFiles(
                            draft?.artificialColour
                        )
                    );
                }


                // ========================================================
                // URIC ACID
                // ========================================================

                if (
                    activeGroup === "uricAcid"
                ) {

                    preparations.push(
                        ...mapUricAcidDraftToPreparations(
                            draft?.uricAcid
                        )
                    );

                    calculations.push(
                        ...mapUricAcidDraftToCalculations(
                            draft?.uricAcid
                        )
                    );

                    files.push(
                        ...mapUricAcidDraftToFiles(
                            draft?.uricAcid
                        )
                    );
                }


                // ========================================================
                // FSV (A, D, E, K)
                // ========================================================

                if (
                    activeGroup === "fsv"
                ) {

                    preparations.push(
                        ...mapFSVDraftToPreparations(
                            draft?.fsv
                        )
                    );

                    calculations.push(
                        ...mapFSVDraftToCalculations(
                            draft?.fsv
                        )
                    );

                    files.push(
                        ...mapFSVDraftToFiles(
                            draft?.fsv
                        )
                    );
                }


                // ========================================================
                // FATTY ACID PROFILE
                // ========================================================

                if (
                    activeGroup === "fattyAcidProfile"
                ) {

                    preparations.push(
                        ...mapFattyAcidProfileDraftToPreparations(
                            draft?.fattyAcidProfile
                        )
                    );

                    calculations.push(
                        ...mapFattyAcidProfileDraftToCalculations(
                            draft?.fattyAcidProfile
                        )
                    );

                    files.push(
                        ...mapFattyAcidProfileDraftToFiles(
                            draft?.fattyAcidProfile
                        )
                    );
                }


                // ========================================================
                // PARAMETER LEVEL FILES
                // ========================================================

                const parameterFiles:
                    WorksheetFileData[] =
                    filesPerParam[param.id]?.param_level ?? [];


                parameterFiles.forEach(file => {

                    files.push({

                        id:
                            file.id,

                        preparationType:
                            "parameter_file",

                        label:
                            file.label,

                        fileName:
                            file.fileName,

                        fileDataBase64:
                            file.fileDataBase64

                    });

                });


                // ========================================================
                // BUFFER
                // ========================================================

                (
                    bufferPreparationPerParam[param.id] ?? []
                ).forEach(buffer => {

                    preparations.push({

                        label:
                            buffer.label,

                        preparationCategory:
                            "buffer",

                        preparationType:
                            null,

                        assignedStandardId:
                            null,

                        steps:
                            JSON.stringify(
                                buffer.steps
                            ),

                        content:
                            null

                    });

                });


                // ========================================================
                // MOBILE PHASE
                // ========================================================

                (
                    mobilePhasePerParam[param.id] ?? []
                ).forEach(mp => {

                    preparations.push({

                        label:
                            mp.label,

                        preparationCategory:
                            "mobile_phase",

                        preparationType:
                            null,

                        assignedStandardId:
                            null,

                        steps:
                            null,

                        content:
                            mp.content

                    });

                });


                // ========================================================
                // DILUENT
                // ========================================================

                (
                    diluentPreparationsPerParam[param.id] ?? []
                ).forEach(dp => {

                    preparations.push({

                        label:
                            dp.label,

                        preparationCategory:
                            "diluent",

                        preparationType:
                            null,

                        assignedStandardId:
                            null,

                        steps:
                            null,

                        content:
                            dp.content

                    });

                });


                // ========================================================
                // SYSTEM SUITABILITY
                // ========================================================

                (
                    systemSuitabilityPerParam[param.id] ?? []
                ).forEach(ss => {

                    preparations.push({

                        label:
                            ss.label,

                        preparationCategory:
                            "system_suitability",

                        preparationType:
                            null,

                        assignedStandardId:
                            null,

                        steps:
                            JSON.stringify(
                                ss.steps
                            ),

                        content:
                            null

                    });

                });


                // ========================================================
                // INSTRUMENTS / CHEMICALS / STANDARDS
                // ========================================================

                const instruments =
                    addedInstruments[param.id] ?? [];

                const chemicals =
                    addedChemicals[param.id] ?? [];

                const standards =
                    addedStandards[param.id] ?? [];


                // ========================================================
                // RETURN PARAMETER
                // ========================================================

                return {

                    ...param,

                    preparationCompletedAt:
                        param.preparationCompletedAt,

                    preparationCompletedBy:
                        param.preparationCompletedBy,

                    additional_info:
                        additionalInfoPerParam[param.id] ??
                        null,

                    additionalInfo:
                        additionalInfoPerParam[param.id] ??
                        null,

                    showAdditionalInfo:
                        !!additionalInfoPerParam[param.id],

                    instruments,

                    chemicals,

                    standards,

                    preparations,

                    calculations,

                    files

                };

            })

    };

}