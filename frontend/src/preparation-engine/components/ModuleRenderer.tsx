import React from "react";
import LODAnalysis from "../modules/lod/components/LODAnalysis";
import type { PreparationModuleHandle } from "../../pages/food/types/PreparationModuleHandle";

interface Props {

    activeGroups: string[];

    parameterId: number;

    parameterName?: string | null;

    parameterCode?: string | null;

    role: string;

    isLocked: boolean;

    onLockPreparation: (parameterId: number) => void;

    onUnlockPreparation: (parameterId: number) => void;

    lodRef: React.RefObject<PreparationModuleHandle | null>;

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

    lodRef

}) => {

    return (

        <>

            {activeGroups.includes("lod") && (

                <LODAnalysis

                    ref={lodRef}

                    parameterId={parameterId}

                    parameterName={parameterName}

                    parameterCode={parameterCode}

                    role={role}

                    isLocked={isLocked}

                    onLockPreparation={onLockPreparation}

                    onUnlockPreparation={onUnlockPreparation}

                />

            )}

        </>

    );

};

export default ModuleRenderer;