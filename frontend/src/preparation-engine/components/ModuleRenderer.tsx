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

    lodRef:
        React.RefObject<PreparationModuleHandle | null>;

    proteinRef:
        React.RefObject<PreparationModuleHandle | null>;

    sugarRef:
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

}) => {

    const moduleType = activeGroups[0];

    // =====================================================
    // SELECT CORRECT MODULE REF
    // =====================================================

    const moduleRef =
        moduleType === "protein"
            ? proteinRef
            : moduleType === "sugar"
                ? sugarRef
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