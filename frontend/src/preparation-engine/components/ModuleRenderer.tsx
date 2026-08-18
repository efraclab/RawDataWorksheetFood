import React from "react";

import { moduleRegistry } from "../configs/moduleRegistry";

import type { PreparationModuleHandle }
    from "../../pages/food/types/PreparationModuleHandle";


interface Props {

    activeGroups: string[];

    parameterId: number;

    parameterName?: string | null;

    parameterCode?: string | null;

    role: string;

    isLocked: boolean;

    onLockPreparation:
    (parameterId: number) => void;

    onUnlockPreparation:
    (parameterId: number) => void;


    // =====================================================
    // MODULE REFS
    // =====================================================

    lodRef:
    React.RefObject<PreparationModuleHandle | null>;

    proteinRef:
    React.RefObject<PreparationModuleHandle | null>;

    sugarRef:
    React.RefObject<PreparationModuleHandle | null>;

    energyRef:
    React.RefObject<PreparationModuleHandle | null>;

    carbohydrateRef:
    React.RefObject<PreparationModuleHandle | null>;

    crudeFiberRef:
    React.RefObject<PreparationModuleHandle | null>;

    peroxideValueRef:
    React.RefObject<PreparationModuleHandle | null>;

    acidValueRef:
    React.RefObject<PreparationModuleHandle | null>;

    // =====================================================
    // ACIDITY
    // =====================================================

    acidityRef:
    React.RefObject<PreparationModuleHandle | null>;

    saponificationValueRef:
    React.RefObject<PreparationModuleHandle | null>;

    freeFattyAcidRef:
    React.RefObject<PreparationModuleHandle | null>;

    unsapMatterRef:
    React.RefObject<PreparationModuleHandle | null>;

    artificialSweetnerRef:
    React.RefObject<PreparationModuleHandle | null>;

    preservativeRef:
    React.RefObject<PreparationModuleHandle | null>;


    // =====================================================
    // MOISTURE
    // =====================================================

    moistureRef:
    React.RefObject<PreparationModuleHandle | null>;


    // =====================================================
    // NOTS
    // =====================================================

    notsRef:
    React.RefObject<PreparationModuleHandle | null>;


    // =====================================================
    // SULPHUR DIOXIDE
    // =====================================================

    sulphurDioxideRef:
    React.RefObject<PreparationModuleHandle | null>;


    // =====================================================
    // CHOLESTEROL
    // =====================================================

    cholesterolRef:
    React.RefObject<PreparationModuleHandle | null>;


    // =====================================================
    // WSV
    // WATER SOLUBLE VITAMIN
    // =====================================================

    wsvRef:
    React.RefObject<PreparationModuleHandle | null>;


    // =====================================================
    // AMINO ACID
    // =====================================================

    aminoAcidRef:
    React.RefObject<PreparationModuleHandle | null>;


    // =====================================================
    // ARTIFICIAL COLOUR
    // =====================================================

    artificialColourRef:
    React.RefObject<PreparationModuleHandle | null>;

    uricAcidRef:
    React.RefObject<PreparationModuleHandle | null>;


    // =====================================================
    // FSV (A, D, E, K)
    // =====================================================

    fsvRef:
    React.RefObject<PreparationModuleHandle | null>;


    // =====================================================
    // FATTY ACID PROFILE
    // =====================================================

    fattyAcidProfileRef:
    React.RefObject<PreparationModuleHandle | null>;

    // =====================================================
    // SUGAR / SAPONIN / CATECHIN PROFILE
    // =====================================================

    sugarSaponinCatechinProfileRef:
    React.RefObject<PreparationModuleHandle | null>;
}


const ModuleRenderer: React.FC<Props> = ({

    activeGroups,

    parameterId,

    parameterName,

    parameterCode,

    role,

    isLocked,

    onLockPreparation,

    onUnlockPreparation,

    lodRef,

    proteinRef,

    sugarRef,

    energyRef,

    carbohydrateRef,

    crudeFiberRef,

    peroxideValueRef,

    acidValueRef,

    acidityRef,

    saponificationValueRef,

    freeFattyAcidRef,

    unsapMatterRef,

    artificialSweetnerRef,

    preservativeRef,

    moistureRef,

    notsRef,

    sulphurDioxideRef,

    cholesterolRef,

    wsvRef,

    aminoAcidRef,

    artificialColourRef,

    uricAcidRef,

    fsvRef,

    fattyAcidProfileRef,

    sugarSaponinCatechinProfileRef

}) => {

    const moduleType =
        activeGroups[0];


    // =====================================================
    // SELECT CORRECT MODULE REF
    // =====================================================

    const moduleRef =

        moduleType === "protein"
            ? proteinRef

            : moduleType === "sugar"
                ? sugarRef

                : moduleType === "energy"
                    ? energyRef

                    : moduleType === "carbohydrate"
                        ? carbohydrateRef

                        : moduleType === "crudeFiber"
                            ? crudeFiberRef

                            : moduleType === "peroxideValue"
                                ? peroxideValueRef

                                : moduleType === "acidValue"
                                    ? acidValueRef

                                    : moduleType === "acidity"
                                        ? acidityRef

                                        : moduleType === "saponificationValue"
                                            ? saponificationValueRef

                                            : moduleType === "freeFattyAcid"
                                                ? freeFattyAcidRef

                                                : moduleType === "unsapMatter"
                                                    ? unsapMatterRef

                                                    : moduleType === "artificialSweetner"
                                                        ? artificialSweetnerRef

                                                        : moduleType === "preservative"
                                                            ? preservativeRef

                                                            : moduleType === "moisture"
                                                                ? moistureRef

                                                                : moduleType === "nots"
                                                                    ? notsRef

                                                                    : moduleType === "sulphurDioxide"
                                                                        ? sulphurDioxideRef

                                                                        : moduleType === "cholesterol"
                                                                            ? cholesterolRef

                                                                            : moduleType === "wsv"
                                                                                ? wsvRef

                                                                                : moduleType === "aminoAcid"
                                                                                    ? aminoAcidRef

                                                                                    : moduleType === "artificialColour"
                                                                                        ? artificialColourRef

                                                                                        : moduleType === "uricAcid"
                                                                                            ? uricAcidRef

                                                                                            : moduleType === "fsv"
                                                                                                ? fsvRef

                                                                                                : moduleType === "fattyAcidProfile"
                                                                                                    ? fattyAcidProfileRef

                                                                                                    : moduleType === "sugarSaponinCatechinProfile"
                                                                                                        ? sugarSaponinCatechinProfileRef

                                                                                                        : lodRef;


    // =====================================================
    // GET MODULE CONFIG
    // =====================================================

    const moduleConfig =
        moduleRegistry[
            moduleType as keyof typeof moduleRegistry
        ];


    if (!moduleConfig)
        return null;


    // =====================================================
    // ANALYSIS COMPONENT
    // =====================================================

    const AnalysisComponent =
        moduleConfig.analysisComponent;


    return (

        <>

            {AnalysisComponent && (

                <AnalysisComponent

                    ref={moduleRef}

                    parameterId={parameterId}

                    parameterName={parameterName}

                    parameterCode={parameterCode}

                    role={role}

                    isLocked={isLocked}

                    parameterType={moduleType}

                    onLockPreparation={
                        onLockPreparation
                    }

                    onUnlockPreparation={
                        onUnlockPreparation
                    }

                />

            )}

        </>

    );

};


export default ModuleRenderer;
