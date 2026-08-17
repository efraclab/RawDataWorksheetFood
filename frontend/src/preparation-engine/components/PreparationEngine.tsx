import React, {
    useMemo,
    useState,
    useRef,
    forwardRef,
    useImperativeHandle,
    useEffect
} from "react";

import { preparationConfigs } from "../configs";

import PreparationDropdown
    from "./PreparationDropdown";

import ActivePreparationGroups
    from "./ActivePreparationGroups";

import ModuleRenderer
    from "./ModuleRenderer";

import { BiTestTube }
    from "react-icons/bi";

import type {
    PreparationEngineHandle
} from "../../pages/food/types/PreparationEngineHandle";

import type {
    PreparationModuleHandle
} from "../../pages/food/types/PreparationModuleHandle";

import type {
    PreparationDraft
} from "../../pages/food/types/PreparationDraft";

import type {
    ParameterDetail
} from "../../models/ParameterDetail";


interface Props {

    role: string;

    parameterId: number;

    parameterName?: string | null;

    parameterCode?: string | null;

    isLocked: boolean;

    onLockPreparation:
    (parameterId: number) => void;

    onUnlockPreparation:
    (parameterId: number) => void;

}


const PreparationEngine =
    forwardRef<PreparationEngineHandle, Props>(({

        role,

        parameterId,

        parameterName,

        parameterCode,

        isLocked,

        onLockPreparation,

        onUnlockPreparation

    }, ref) => {


        // ============================================================
        // MODULE REFS
        // ============================================================

        const lodRef =
            useRef<PreparationModuleHandle>(null);

        const proteinRef =
            useRef<PreparationModuleHandle>(null);

        const sugarRef =
            useRef<PreparationModuleHandle>(null);

        const energyRef =
            useRef<PreparationModuleHandle>(null);

        const carbohydrateRef =
            useRef<PreparationModuleHandle>(null);


        // ============================================================
        // CRUDE FIBER REF
        // ============================================================

        const crudeFiberRef =
            useRef<PreparationModuleHandle>(null);


        // ============================================================
        // PEROXIDE VALUE REF
        // ============================================================

        const peroxideValueRef =
            useRef<PreparationModuleHandle>(null);


        // ============================================================
        // ACID VALUE REF
        // ============================================================

        const acidValueRef =
            useRef<PreparationModuleHandle>(null);


        // ============================================================
        // SAPONIFICATION VALUE REF
        // ============================================================

        const saponificationValueRef =
            useRef<PreparationModuleHandle>(null);


        // ============================================================
        // FREE FATTY ACID REF
        // ============================================================

        const freeFattyAcidRef =
            useRef<PreparationModuleHandle>(null);


        // ============================================================
        // RESTORE
        // ============================================================

        const pendingRestore =
            useRef<ParameterDetail | null>(null);


        // ============================================================
        // STATE
        // ============================================================

        const [showMenu, setShowMenu] =
            useState(false);

        const [activeGroups, setActiveGroups] =
            useState<string[]>([]);


        // ============================================================
        // ADD PREPARATION
        // ============================================================

        const handleSelectPreparation =
            (groupId: string) => {

                if (
                    activeGroups.includes(groupId)
                )
                    return;


                setActiveGroups([
                    groupId
                ]);

                setShowMenu(false);

            };


        // ============================================================
        // REMOVE PREPARATION
        // ============================================================

        const handleRemovePreparation =
            (groupId: string) => {

                setActiveGroups(prev =>
                    prev.filter(
                        x => x !== groupId
                    )
                );

            };


        // ============================================================
        // GROUP MAP
        // ============================================================

        const groupMap = useMemo(() => {

            return Object.fromEntries(

                preparationConfigs.map(
                    config => [

                        config.id,

                        {
                            id:
                                config.id,

                            label:
                                config.title,

                            color:
                                config.color
                        }

                    ]
                )

            );

        }, []);


        // ============================================================
        // IMPERATIVE HANDLE
        // ============================================================

        useImperativeHandle(
            ref,
            () => ({

                // ====================================================
                // COLLECT DRAFT
                // ====================================================

                collectDraft():
                    PreparationDraft {

                    const activeGroup =
                        activeGroups[0];


                    // ----------------------------------------------
                    // FAT
                    // ----------------------------------------------

                    if (
                        activeGroup === "fat"
                    ) {

                        return {

                            activeGroup:
                                activeGroups,

                            fat:
                                lodRef.current
                                    ?.getDraft()

                        };

                    }


                    // ----------------------------------------------
                    // PROTEIN
                    // ----------------------------------------------

                    if (
                        activeGroup === "protein"
                    ) {

                        return {

                            activeGroup:
                                activeGroups,

                            protein:
                                proteinRef.current
                                    ?.getDraft()

                        };

                    }


                    // ----------------------------------------------
                    // SUGAR
                    // ----------------------------------------------

                    if (
                        activeGroup === "sugar"
                    ) {

                        return {

                            activeGroup:
                                activeGroups,

                            sugar:
                                sugarRef.current
                                    ?.getDraft()

                        };

                    }


                    // ----------------------------------------------
                    // ENERGY
                    // ----------------------------------------------

                    if (
                        activeGroup === "energy"
                    ) {

                        return {

                            activeGroup:
                                activeGroups,

                            energy:
                                energyRef.current
                                    ?.getDraft()

                        };

                    }


                    // ----------------------------------------------
                    // CARBOHYDRATE
                    // ----------------------------------------------

                    if (
                        activeGroup === "carbohydrate"
                    ) {

                        return {

                            activeGroup:
                                activeGroups,

                            carbohydrate:
                                carbohydrateRef.current
                                    ?.getDraft()

                        };

                    }


                    // ----------------------------------------------
                    // CRUDE FIBER
                    // ----------------------------------------------

                    if (
                        activeGroup === "crudeFiber"
                    ) {

                        return {

                            activeGroup:
                                activeGroups,

                            crudeFiber:
                                crudeFiberRef.current
                                    ?.getDraft()

                        };

                    }


                    // ----------------------------------------------
                    // PEROXIDE VALUE
                    // ----------------------------------------------

                    if (
                        activeGroup === "peroxideValue"
                    ) {

                        return {

                            activeGroup:
                                activeGroups,

                            peroxideValue:
                                peroxideValueRef.current
                                    ?.getDraft()

                        };

                    }


                    // ----------------------------------------------
                    // ACID VALUE
                    // ----------------------------------------------

                    if (
                        activeGroup === "acidValue"
                    ) {

                        return {

                            activeGroup:
                                activeGroups,

                            acidValue:
                                acidValueRef.current
                                    ?.getDraft()

                        };

                    }


                    // ----------------------------------------------
                    // SAPONIFICATION VALUE
                    // ----------------------------------------------

                    if (
                        activeGroup ===
                        "saponificationValue"
                    ) {

                        return {

                            activeGroup:
                                activeGroups,

                            saponificationValue:
                                saponificationValueRef.current
                                    ?.getDraft()

                        };

                    }


                    // ----------------------------------------------
                    // FREE FATTY ACID
                    // ----------------------------------------------

                    if (
                        activeGroup ===
                        "freeFattyAcid"
                    ) {

                        return {

                            activeGroup:
                                activeGroups,

                            freeFattyAcid:
                                freeFattyAcidRef.current
                                    ?.getDraft()

                        };

                    }


                    // ----------------------------------------------
                    // LOD
                    // ----------------------------------------------

                    return {

                        activeGroup:
                            activeGroups,

                        lod:
                            lodRef.current
                                ?.getDraft()

                    };

                },


                // ====================================================
                // LOAD DRAFT
                // ====================================================

                loadDraft(
                    draft: PreparationDraft
                ) {

                    if (!draft)
                        return;


                    const activeGroup =
                        draft.activeGroup?.[0];


                    setActiveGroups(
                        draft.activeGroup ?? []
                    );


                    // ----------------------------------------------
                    // LOD
                    // ----------------------------------------------

                    if (
                        activeGroup === "lod" &&
                        draft.lod
                    ) {

                        lodRef.current?.loadDraft(
                            draft.lod
                        );

                    }


                    // ----------------------------------------------
                    // FAT
                    // ----------------------------------------------

                    if (
                        activeGroup === "fat" &&
                        draft.fat
                    ) {

                        lodRef.current?.loadDraft(
                            draft.fat
                        );

                    }


                    // ----------------------------------------------
                    // PROTEIN
                    // ----------------------------------------------

                    if (
                        activeGroup === "protein" &&
                        draft.protein
                    ) {

                        proteinRef.current?.loadDraft(
                            draft.protein
                        );

                    }


                    // ----------------------------------------------
                    // SUGAR
                    // ----------------------------------------------

                    if (
                        activeGroup === "sugar" &&
                        draft.sugar
                    ) {

                        sugarRef.current?.loadDraft(
                            draft.sugar
                        );

                    }


                    // ----------------------------------------------
                    // ENERGY
                    // ----------------------------------------------

                    if (
                        activeGroup === "energy" &&
                        draft.energy
                    ) {

                        energyRef.current?.loadDraft(
                            draft.energy
                        );

                    }


                    // ----------------------------------------------
                    // CARBOHYDRATE
                    // ----------------------------------------------

                    if (
                        activeGroup === "carbohydrate" &&
                        draft.carbohydrate
                    ) {

                        carbohydrateRef.current?.loadDraft(
                            draft.carbohydrate
                        );

                    }


                    // ----------------------------------------------
                    // CRUDE FIBER
                    // ----------------------------------------------

                    if (
                        activeGroup === "crudeFiber" &&
                        draft.crudeFiber
                    ) {

                        crudeFiberRef.current?.loadDraft(
                            draft.crudeFiber
                        );

                    }


                    // ----------------------------------------------
                    // PEROXIDE VALUE
                    // ----------------------------------------------

                    if (
                        activeGroup === "peroxideValue" &&
                        draft.peroxideValue
                    ) {

                        peroxideValueRef.current?.loadDraft(
                            draft.peroxideValue
                        );

                    }


                    // ----------------------------------------------
                    // ACID VALUE
                    // ----------------------------------------------

                    if (
                        activeGroup === "acidValue" &&
                        draft.acidValue
                    ) {

                        acidValueRef.current?.loadDraft(
                            draft.acidValue
                        );

                    }


                    // ----------------------------------------------
                    // SAPONIFICATION VALUE
                    // ----------------------------------------------

                    if (
                        activeGroup ===
                        "saponificationValue" &&
                        draft.saponificationValue
                    ) {

                        saponificationValueRef.current?.loadDraft(
                            draft.saponificationValue
                        );

                    }


                    // ----------------------------------------------
                    // FREE FATTY ACID
                    // ----------------------------------------------

                    if (
                        activeGroup ===
                        "freeFattyAcid" &&
                        draft.freeFattyAcid
                    ) {

                        freeFattyAcidRef.current?.loadDraft(
                            draft.freeFattyAcid
                        );

                    }

                },


                // ====================================================
                // RESTORE FROM WORKSHEET
                // ====================================================

                restoreFromWorksheet(
                    parameter: ParameterDetail
                ) {

                    pendingRestore.current =
                        parameter;


                    const preps =
                        parameter.preparations ?? [];


                    const groups: string[] = [];


                    // ----------------------------------------------
                    // LOD
                    // ----------------------------------------------

                    if (
                        preps.some(
                            p =>
                                p.preparationCategory ===
                                "sample" &&

                                p.preparationType ===
                                "lod"
                        )
                    ) {

                        groups.push("lod");

                    }


                    // ----------------------------------------------
                    // FAT
                    // ----------------------------------------------

                    if (
                        preps.some(
                            p =>
                                p.preparationCategory ===
                                "sample" &&

                                p.preparationType ===
                                "fat"
                        )
                    ) {

                        groups.push("fat");

                    }


                    // ----------------------------------------------
                    // PROTEIN
                    // ----------------------------------------------

                    if (
                        preps.some(
                            p =>
                                p.preparationCategory ===
                                "sample" &&

                                p.preparationType ===
                                "protein"
                        )
                    ) {

                        groups.push("protein");

                    }


                    // ----------------------------------------------
                    // SUGAR
                    // ----------------------------------------------

                    if (
                        preps.some(
                            p =>
                                p.preparationCategory ===
                                "sample" &&

                                p.preparationType ===
                                "sugar"
                        )
                    ) {

                        groups.push("sugar");

                    }


                    // ----------------------------------------------
                    // ENERGY
                    // ----------------------------------------------

                    if (
                        preps.some(
                            p =>
                                p.preparationCategory ===
                                "sample" &&

                                p.preparationType ===
                                "energy"
                        )
                    ) {

                        groups.push("energy");

                    }


                    // ----------------------------------------------
                    // CARBOHYDRATE
                    // ----------------------------------------------

                    if (
                        preps.some(
                            p =>
                                p.preparationCategory ===
                                "sample" &&

                                p.preparationType ===
                                "carbohydrate"
                        )
                    ) {

                        groups.push("carbohydrate");

                    }


                    // ----------------------------------------------
                    // CRUDE FIBER
                    // ----------------------------------------------

                    if (
                        preps.some(
                            p =>
                                p.preparationCategory ===
                                "sample" &&

                                p.preparationType ===
                                "crudeFiber"
                        )
                    ) {

                        groups.push("crudeFiber");

                    }


                    // ----------------------------------------------
                    // PEROXIDE VALUE
                    // ----------------------------------------------

                    if (
                        preps.some(
                            p =>
                                p.preparationCategory ===
                                "sample" &&

                                p.preparationType ===
                                "peroxideValue"
                        )
                    ) {

                        groups.push("peroxideValue");

                    }


                    // ----------------------------------------------
                    // ACID VALUE
                    // ----------------------------------------------

                    if (
                        preps.some(
                            p =>
                                p.preparationCategory ===
                                "sample" &&

                                p.preparationType ===
                                "acidValue"
                        )
                    ) {

                        groups.push("acidValue");

                    }


                    // ----------------------------------------------
                    // SAPONIFICATION VALUE
                    // ----------------------------------------------

                    if (
                        preps.some(
                            p =>
                                p.preparationCategory ===
                                "sample" &&

                                p.preparationType ===
                                "saponificationValue"
                        )
                    ) {

                        groups.push(
                            "saponificationValue"
                        );

                    }


                    // ----------------------------------------------
                    // FREE FATTY ACID
                    // ----------------------------------------------

                    if (
                        preps.some(
                            p =>
                                p.preparationCategory ===
                                "sample" &&

                                p.preparationType ===
                                "freeFattyAcid"
                        )
                    ) {

                        groups.push(
                            "freeFattyAcid"
                        );

                    }


                    setActiveGroups(
                        groups
                    );

                }

            })
        );


        // ============================================================
        // RESTORE AFTER MODULE IS RENDERED
        // ============================================================

        useEffect(() => {

            if (
                !pendingRestore.current
            )
                return;


            const activeGroup =
                activeGroups[0];


            // ========================================================
            // LOD / FAT
            // ========================================================

            if (
                (
                    activeGroup === "lod" ||
                    activeGroup === "fat"
                ) &&
                lodRef.current
            ) {

                console.log(
                    "🔥 Restoring LOD/FAT preparation"
                );


                lodRef.current
                    .restoreFromWorksheet(
                        pendingRestore.current
                    );


                pendingRestore.current =
                    null;


                return;

            }


            // ========================================================
            // PROTEIN
            // ========================================================

            if (
                activeGroup === "protein" &&
                proteinRef.current
            ) {

                proteinRef.current
                    .restoreFromWorksheet(
                        pendingRestore.current
                    );


                pendingRestore.current =
                    null;


                return;

            }


            // ========================================================
            // SUGAR
            // ========================================================

            if (
                activeGroup === "sugar" &&
                sugarRef.current
            ) {

                sugarRef.current
                    .restoreFromWorksheet(
                        pendingRestore.current
                    );


                pendingRestore.current =
                    null;


                return;

            }


            // ========================================================
            // ENERGY
            // ========================================================

            if (
                activeGroup === "energy" &&
                energyRef.current
            ) {

                console.log(
                    "🔥 Restoring ENERGY preparation"
                );


                energyRef.current
                    .restoreFromWorksheet(
                        pendingRestore.current
                    );


                pendingRestore.current =
                    null;


                return;

            }


            // ========================================================
            // CARBOHYDRATE
            // ========================================================

            if (
                activeGroup === "carbohydrate" &&
                carbohydrateRef.current
            ) {

                carbohydrateRef.current
                    .restoreFromWorksheet(
                        pendingRestore.current
                    );


                pendingRestore.current =
                    null;


                return;

            }


            // ========================================================
            // CRUDE FIBER
            // ========================================================

            if (
                activeGroup === "crudeFiber" &&
                crudeFiberRef.current
            ) {

                crudeFiberRef.current
                    .restoreFromWorksheet(
                        pendingRestore.current
                    );


                pendingRestore.current =
                    null;


                return;

            }


            // ========================================================
            // PEROXIDE VALUE
            // ========================================================

            if (
                activeGroup === "peroxideValue" &&
                peroxideValueRef.current
            ) {

                peroxideValueRef.current
                    .restoreFromWorksheet(
                        pendingRestore.current
                    );


                pendingRestore.current =
                    null;


                return;

            }


            // ========================================================
            // ACID VALUE
            // ========================================================

            if (
                activeGroup === "acidValue" &&
                acidValueRef.current
            ) {

                acidValueRef.current
                    .restoreFromWorksheet(
                        pendingRestore.current
                    );


                pendingRestore.current =
                    null;


                return;

            }


            // ========================================================
            // SAPONIFICATION VALUE
            // ========================================================

            if (
                activeGroup ===
                "saponificationValue" &&
                saponificationValueRef.current
            ) {

                saponificationValueRef.current
                    .restoreFromWorksheet(
                        pendingRestore.current
                    );


                pendingRestore.current =
                    null;


                return;

            }


            // ========================================================
            // FREE FATTY ACID
            // ========================================================

            if (
                activeGroup ===
                "freeFattyAcid" &&
                freeFattyAcidRef.current
            ) {

                freeFattyAcidRef.current
                    .restoreFromWorksheet(
                        pendingRestore.current
                    );


                pendingRestore.current =
                    null;


                return;

            }

        }, [activeGroups]);


        // ============================================================
        // RENDER
        // ============================================================

        return (

            <div
                className="
                    mb-8
                    p-6
                    bg-gradient-to-br
                    from-emerald-50
                    via-emerald-50
                    to-emerald-50
                    border
                    border-emerald-200
                    rounded-2xl
                    shadow-2xl
                "
            >

                {/* ==================================================
                    HEADER
                ================================================== */}

                <div
                    className="
                        flex
                        items-center
                        justify-between
                        mb-6
                    "
                >

                    <div
                        className="
                            flex
                            items-center
                            gap-3
                        "
                    >

                        <div className="relative">

                            <div
                                className="
                                    w-12
                                    h-12
                                    bg-gradient-to-br
                                    from-emerald-700
                                    to-emerald-900
                                    rounded-2xl
                                    flex
                                    items-center
                                    justify-center
                                    shadow-lg
                                "
                            >

                                <BiTestTube
                                    className="
                                        w-6
                                        h-6
                                        text-white
                                    "
                                />

                            </div>

                        </div>


                        <div>

                            <h3
                                className="
                                    text-xl
                                    font-bold
                                    text-emerald-900
                                    tracking-tight
                                "
                            >

                                Preparation Management

                            </h3>


                            <p
                                className="
                                    text-xs
                                    text-emerald-600
                                    font-medium
                                "
                            >

                                Configure analysis preparations
                                for this parameter

                            </p>

                        </div>

                    </div>


                    {/* =================================================
                        ADD PREPARATION
                    ================================================= */}

                    <div className="relative">

                        <button
                            type="button"
                            disabled={isLocked}
                            onClick={() => {

                                if (isLocked)
                                    return;

                                setShowMenu(
                                    v => !v
                                );

                            }}
                            className="
                                disabled:opacity-50
                                disabled:cursor-not-allowed
                                px-6
                                py-3
                                bg-emerald-600
                                hover:bg-emerald-700
                                text-white
                                rounded-xl
                                font-semibold
                                shadow-lg
                                transition-all
                                duration-200
                            "
                        >

                            + Add Preparation

                        </button>


                        <PreparationDropdown
                            open={showMenu}
                            groups={preparationConfigs}
                            activeGroups={activeGroups}
                            onSelect={
                                handleSelectPreparation
                            }
                        />

                    </div>

                </div>


                {/* ==================================================
                    ACTIVE GROUPS
                ================================================== */}

                <ActivePreparationGroups
                    activeGroups={
                        activeGroups
                    }

                    groups={
                        groupMap
                    }

                    onRemove={
                        handleRemovePreparation
                    }
                />


                {/* ==================================================
                    MODULE RENDERER
                ================================================== */}

                <ModuleRenderer

                    activeGroups={
                        activeGroups
                    }

                    parameterId={
                        parameterId
                    }

                    parameterName={
                        parameterName
                    }

                    parameterCode={
                        parameterCode
                    }

                    role={
                        role
                    }

                    isLocked={
                        isLocked
                    }

                    onLockPreparation={
                        onLockPreparation
                    }

                    onUnlockPreparation={
                        onUnlockPreparation
                    }

                    lodRef={
                        lodRef
                    }

                    proteinRef={
                        proteinRef
                    }

                    sugarRef={
                        sugarRef
                    }

                    energyRef={
                        energyRef
                    }

                    carbohydrateRef={
                        carbohydrateRef
                    }

                    crudeFiberRef={
                        crudeFiberRef
                    }

                    peroxideValueRef={
                        peroxideValueRef
                    }

                    acidValueRef={
                        acidValueRef
                    }

                    saponificationValueRef={
                        saponificationValueRef
                    }

                    freeFattyAcidRef={
                        freeFattyAcidRef
                    }

                />

            </div>

        );

    });


export default PreparationEngine;