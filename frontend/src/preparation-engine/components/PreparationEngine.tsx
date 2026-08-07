import React, {
    useMemo,
    useState,
    useRef,
    forwardRef,
    useImperativeHandle,
    useEffect
} from "react";

import { preparationConfigs } from "../configs";

import PreparationDropdown from "./PreparationDropdown";
import ActivePreparationGroups from "./ActivePreparationGroups";
import ModuleRenderer from "./ModuleRenderer";

import { BiTestTube } from "react-icons/bi";

import type { PreparationEngineHandle } from "../../pages/food/types/PreparationEngineHandle";
import type { PreparationModuleHandle } from "../../pages/food/types/PreparationModuleHandle";
import type { PreparationDraft } from "../../pages/food/types/PreparationDraft";
import type { ParameterDetail } from "../../models/ParameterDetail";

interface Props {

    role: string;

    parameterId: number;

    parameterName?: string | null;

    parameterCode?: string | null;

    isLocked: boolean;

    onLockPreparation: (parameterId: number) => void;

    onUnlockPreparation: (parameterId: number) => void;

}

const PreparationEngine = forwardRef<PreparationEngineHandle, Props>(({

    role,

    parameterId,

    parameterName,

    parameterCode,

    isLocked,

    onLockPreparation,

    onUnlockPreparation

}, ref) => {

    const lodRef = useRef<PreparationModuleHandle>(null);

    const pendingRestore =
        useRef<ParameterDetail | null>(null);

    const [showMenu, setShowMenu] = useState(false);

    const [activeGroups, setActiveGroups] = useState<string[]>([]);

    const handleSelectPreparation = (groupId: string) => {

        if (activeGroups.includes(groupId))
            return;

        setActiveGroups([groupId]);

        setShowMenu(false);

    };

    const handleRemovePreparation = (groupId: string) => {

        setActiveGroups(prev =>
            prev.filter(x => x !== groupId)
        );

    };

    const groupMap = useMemo(() => {

        return Object.fromEntries(

            preparationConfigs.map(config => [

                config.id,

                {

                    id: config.id,

                    label: config.title,

                    color: config.color

                }

            ])

        );

    }, []);



    useImperativeHandle(ref, () => ({

        collectDraft(): PreparationDraft {

            return {

                activeGroup: activeGroups,

                lod: lodRef.current?.getDraft()

            };

        },

        loadDraft(draft: PreparationDraft) {

            if (!draft)
                return;

            setActiveGroups(
                draft.activeGroup ?? []
            );

            if (draft.lod) {

                lodRef.current?.loadDraft(
                    draft.lod
                );

            }

        },

        restoreFromWorksheet(parameter) {

            pendingRestore.current = parameter;

            const preps = parameter.preparations ?? [];

            const groups: string[] = [];

            if (
                preps.some(
                    p =>
                        p.preparationCategory === "sample" &&
                        p.preparationType === "lod"
                )
            ) {
                groups.push("lod");
            }

            setActiveGroups(groups);
        }

    }));

    useEffect(() => {

        if (!pendingRestore.current)
            return;

        if (!lodRef.current)
            return;

        lodRef.current.restoreFromWorksheet(
            pendingRestore.current
        );

        pendingRestore.current = null;

    }, [activeGroups]);

    return (

        <div className="mb-8 p-6 bg-gradient-to-br from-emerald-50 via-emerald-50 to-emerald-50 border border-emerald-200 rounded-2xl shadow-2xl">

            {/* Header */}

            <div className="flex items-center justify-between mb-6">

                <div className="flex items-center gap-3">

                    <div className="relative">

                        <div className="w-12 h-12 bg-gradient-to-br from-emerald-700 to-emerald-900 rounded-2xl flex items-center justify-center shadow-lg">

                            <BiTestTube className="w-6 h-6 text-white" />

                        </div>

                    </div>

                    <div>

                        <h3 className="text-xl font-bold text-emerald-900 tracking-tight">

                            Preparation Management

                        </h3>

                        <p className="text-xs text-emerald-600 font-medium">

                            Configure analysis preparations for this parameter

                        </p>

                    </div>

                </div>

                <div className="relative">

                    <button
                        disabled={isLocked}
                        onClick={() => {

                            if (isLocked)
                                return;

                            setShowMenu(v => !v);

                        }}
                        className="disabled:opacity-50 disabled:cursor-not-allowed px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold shadow-lg transition-all duration-200"
                    >
                        + Add Preparation
                    </button>

                    <PreparationDropdown
                        open={showMenu}
                        groups={preparationConfigs}
                        activeGroups={activeGroups}
                        onSelect={handleSelectPreparation}
                    />

                </div>

            </div>

            <ActivePreparationGroups
                activeGroups={activeGroups}
                groups={groupMap}
                onRemove={handleRemovePreparation}
            />

            <ModuleRenderer

                activeGroups={activeGroups}

                parameterId={parameterId}

                parameterName={parameterName}

                parameterCode={parameterCode}

                role={role}

                isLocked={isLocked}

                onLockPreparation={onLockPreparation}

                onUnlockPreparation={onUnlockPreparation}

                lodRef={lodRef}

            />

        </div>

    );

});

export default PreparationEngine;