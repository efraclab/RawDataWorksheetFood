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

    canEditCalculations?: boolean;

    /**
     * Controls whether the Preparation Complete section may be unlocked.
     * Reviewer worksheets that have already been submitted for analysis
     * pass false here, while normal locked preparations can still be unlocked.
     */
    canUnlockPreparation: boolean;

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

        canEditCalculations = false,

        canUnlockPreparation,

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
        // DIETARY FIBER REF
        // ============================================================

        const dietaryFiberRef =
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
        // ACIDITY REF
        // ============================================================

        const acidityRef =
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
        // UNSAPONIFIABLE MATTER REF
        // ============================================================

        const unsapMatterRef =
            useRef<PreparationModuleHandle>(null);


        // ============================================================
        // ARTIFICIAL SWEETNER REF
        // ============================================================

        const artificialSweetnerRef =
            useRef<PreparationModuleHandle>(null);


        // ============================================================
        // PRESERVATIVE REF
        // ============================================================

        const preservativeRef =
            useRef<PreparationModuleHandle>(null);


        // ============================================================
        // MOISTURE REF
        // ============================================================

        const moistureRef =
            useRef<PreparationModuleHandle>(null);


        // ============================================================
        // NOTS REF
        // ============================================================

        const notsRef =
            useRef<PreparationModuleHandle>(null);


        // ============================================================
        // SULPHUR DIOXIDE REF
        // ============================================================

        const sulphurDioxideRef =
            useRef<PreparationModuleHandle>(null);


        // ============================================================
        // CHOLESTEROL REF
        // ============================================================

        const cholesterolRef =
            useRef<PreparationModuleHandle>(null);


        // ============================================================
        // WSV REF
        // ============================================================

        const wsvRef =
            useRef<PreparationModuleHandle>(null);


        // ============================================================
        // AMINO ACID REF
        // ============================================================

        const aminoAcidRef =
            useRef<PreparationModuleHandle>(null);


        // ============================================================
        // ARTIFICIAL COLOUR REF
        // ============================================================

        const artificialColourRef =
            useRef<PreparationModuleHandle>(null);


        // ============================================================
        // URIC ACID REF
        // ============================================================

        const uricAcidRef =
            useRef<PreparationModuleHandle>(null);


        // ============================================================
        // FSV (A, D, E, K) REF
        // ============================================================

        const fsvRef =
            useRef<PreparationModuleHandle>(null);


        // ============================================================
        // FATTY ACID PROFILE REF
        // ============================================================

        const fattyAcidProfileRef =
            useRef<PreparationModuleHandle>(null);


        // ============================================================
        // SUGAR / SAPONIN / CATECHIN PROFILE REF
        // ============================================================

        const sugarSaponinCatechinProfileRef =
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
        // DIETARY FIBER DRAFT NORMALIZATION
        // ============================================================
        // Existing drafts may have been saved before the Dietary Fiber
        // "After Ashing(g)" input was introduced. In that case the module
        // receives the old 12-step structure and the UI cannot render row 11.
        // Normalize the draft before loading it into the module.
        // ============================================================

        const normalizeDietaryFiberDraft = (draft: any) => {

            if (!draft)
                return draft;

            const normalizeName = (value: any) =>
                String(value ?? "")
                    .trim()
                    .toLowerCase()
                    .replace(/\s+/g, " ");

            const samplePreparations =
                Array.isArray(draft.samplePreparations)
                    ? draft.samplePreparations.map((preparation: any) => {

                        let steps: any[] = [];

                        try {
                            steps =
                                typeof preparation?.steps === "string"
                                    ? JSON.parse(preparation.steps)
                                    : Array.isArray(preparation?.steps)
                                        ? preparation.steps
                                        : [];
                        }
                        catch {
                            steps = [];
                        }

                        const findIndex = (...names: string[]) =>
                            steps.findIndex(step =>
                                names.includes(normalizeName(step?.name))
                            );

                        // Existing/legacy names are normalized first.
                        let afterAshingIndex = findIndex(
                            "after ashing(g)",
                            "after ashing (g)",
                            "after ashing"
                        );

                        let ashIndex = findIndex(
                            "ash",
                            "% ash",
                            "ash %",
                            "ash percentage"
                        );

                        // Ensure After Ashing(g) exists.
                        if (afterAshingIndex < 0) {
                            const afterAshingStep = {
                                name: "After Ashing(g)",
                                value1: "",
                                unit1: "g",
                                logBookID: ""
                            };

                            // Insert before Ash if Ash already exists.
                            if (ashIndex >= 0) {
                                steps.splice(ashIndex, 0, afterAshingStep);
                            }
                            else {
                                // Otherwise insert before Spl T.V(ml), which
                                // is the next input in the required order.
                                const sampleTitreIndex = findIndex("spl t.v(ml)");

                                if (sampleTitreIndex >= 0) {
                                    steps.splice(sampleTitreIndex, 0, afterAshingStep);
                                }
                                else {
                                    steps.push(afterAshingStep);
                                }
                            }
                        }

                        // Re-read indexes after insertion.
                        afterAshingIndex = findIndex(
                            "after ashing(g)",
                            "after ashing (g)",
                            "after ashing"
                        );

                        ashIndex = findIndex(
                            "ash",
                            "% ash",
                            "ash %",
                            "ash percentage"
                        );

                        // Ensure Ash exists.
                        if (ashIndex < 0) {
                            steps.splice(afterAshingIndex + 1, 0, {
                                name: "Ash",
                                value1: "",
                                unit1: "%",
                                logBookID: ""
                            });
                        }
                        else {
                            const existingAsh = {
                                ...steps[ashIndex],
                                name: "Ash",
                                unit1: "%"
                            };

                            steps.splice(ashIndex, 1);

                            afterAshingIndex = findIndex(
                                "after ashing(g)",
                                "after ashing (g)",
                                "after ashing"
                            );

                            steps.splice(afterAshingIndex + 1, 0, existingAsh);
                        }

                        // Canonicalize After Ashing and guarantee it is directly
                        // before Ash without losing an already entered value.
                        afterAshingIndex = findIndex(
                            "after ashing(g)",
                            "after ashing (g)",
                            "after ashing"
                        );

                        if (afterAshingIndex >= 0) {
                            steps[afterAshingIndex] = {
                                ...steps[afterAshingIndex],
                                name: "After Ashing(g)",
                                unit1: "g"
                            };
                        }

                        ashIndex = findIndex("ash");

                        if (
                            afterAshingIndex >= 0 &&
                            ashIndex >= 0 &&
                            ashIndex !== afterAshingIndex + 1
                        ) {
                            const afterAshingStep = steps.splice(afterAshingIndex, 1)[0];
                            ashIndex = findIndex("ash");
                            steps.splice(ashIndex, 0, afterAshingStep);
                        }

                        return {
                            ...preparation,
                            steps
                        };
                    })
                    : draft.samplePreparations;

            return {
                ...draft,
                samplePreparations
            };
        };


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
                    // DIETARY FIBER
                    // ----------------------------------------------

                    if (
                        activeGroup === "dietaryFiber"
                    ) {

                        return {

                            activeGroup:
                                activeGroups,

                            dietaryFiber:
                                dietaryFiberRef.current
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
                    // ACIDITY
                    // ----------------------------------------------

                    if (
                        activeGroup === "acidity"
                    ) {

                        return {

                            activeGroup:
                                activeGroups,

                            acidity:
                                acidityRef.current
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
                    // UNSAPONIFIABLE MATTER
                    // ----------------------------------------------

                    if (
                        activeGroup ===
                        "unsapMatter"
                    ) {

                        return {

                            activeGroup:
                                activeGroups,

                            unsapMatter:
                                unsapMatterRef.current
                                    ?.getDraft()

                        };

                    }


                    // ----------------------------------------------
                    // ARTIFICIAL SWEETNER
                    // ----------------------------------------------

                    if (
                        activeGroup ===
                        "artificialSweetner"
                    ) {

                        return {

                            activeGroup:
                                activeGroups,

                            artificialSweetner:
                                artificialSweetnerRef.current
                                    ?.getDraft()

                        };

                    }


                    // ----------------------------------------------
                    // PRESERVATIVE
                    // ----------------------------------------------

                    if (
                        activeGroup ===
                        "preservative"
                    ) {

                        return {

                            activeGroup:
                                activeGroups,

                            preservative:
                                preservativeRef.current
                                    ?.getDraft()

                        };

                    }


                    // ----------------------------------------------
                    // MOISTURE
                    // ----------------------------------------------

                    if (
                        activeGroup ===
                        "moisture"
                    ) {

                        return {

                            activeGroup:
                                activeGroups,

                            moisture:
                                moistureRef.current
                                    ?.getDraft()

                        };

                    }


                    // ----------------------------------------------
                    // NOTS
                    // ----------------------------------------------

                    if (
                        activeGroup ===
                        "nots"
                    ) {

                        return {

                            activeGroup:
                                activeGroups,

                            nots:
                                notsRef.current
                                    ?.getDraft()

                        };

                    }


                    // ----------------------------------------------
                    // SULPHUR DIOXIDE
                    // ----------------------------------------------

                    if (
                        activeGroup ===
                        "sulphurDioxide"
                    ) {

                        return {

                            activeGroup:
                                activeGroups,

                            sulphurDioxide:
                                sulphurDioxideRef.current
                                    ?.getDraft()

                        };

                    }


                    // ----------------------------------------------
                    // CHOLESTEROL
                    // ----------------------------------------------

                    if (
                        activeGroup ===
                        "cholesterol"
                    ) {

                        return {

                            activeGroup:
                                activeGroups,

                            cholesterol:
                                cholesterolRef.current
                                    ?.getDraft()

                        };

                    }


                    // ----------------------------------------------
                    // WSV
                    // ----------------------------------------------

                    if (
                        activeGroup ===
                        "wsv"
                    ) {

                        return {

                            activeGroup:
                                activeGroups,

                            wsv:
                                wsvRef.current
                                    ?.getDraft()

                        };

                    }


                    // ----------------------------------------------
                    // AMINO ACID
                    // ----------------------------------------------

                    if (
                        activeGroup ===
                        "aminoAcid"
                    ) {

                        return {

                            activeGroup:
                                activeGroups,

                            aminoAcid:
                                aminoAcidRef.current
                                    ?.getDraft()

                        };

                    }


                    // ----------------------------------------------
                    // ARTIFICIAL COLOUR
                    // ----------------------------------------------

                    if (
                        activeGroup ===
                        "artificialColour"
                    ) {

                        return {

                            activeGroup:
                                activeGroups,

                            artificialColour:
                                artificialColourRef.current
                                    ?.getDraft()

                        };

                    }


                    // ----------------------------------------------
                    // URIC ACID
                    // ----------------------------------------------

                    if (
                        activeGroup ===
                        "uricAcid"
                    ) {

                        return {

                            activeGroup:
                                activeGroups,

                            uricAcid:
                                uricAcidRef.current
                                    ?.getDraft()

                        };

                    }


                    // ----------------------------------------------
                    // FSV (A, D, E, K)
                    // ----------------------------------------------

                    if (
                        activeGroup === "fsv"
                    ) {

                        return {

                            activeGroup:
                                activeGroups,

                            fsv:
                                fsvRef.current
                                    ?.getDraft()

                        };

                    }


                    // ----------------------------------------------
                    // FATTY ACID PROFILE
                    // ----------------------------------------------

                    if (
                        activeGroup ===
                        "fattyAcidProfile"
                    ) {

                        return {

                            activeGroup:
                                activeGroups,

                            fattyAcidProfile:
                                fattyAcidProfileRef.current
                                    ?.getDraft()

                        };

                    }


                    // ----------------------------------------------
                    // SUGAR / SAPONIN / CATECHIN PROFILE
                    // ----------------------------------------------

                    if (
                        activeGroup ===
                        "sugarSaponinCatechinProfile"
                    ) {

                        return {

                            activeGroup:
                                activeGroups,

                            sugarSaponinCatechinProfile:
                                sugarSaponinCatechinProfileRef.current
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
                    // ARTIFICIAL COLOUR
                    // ----------------------------------------------

                    if (
                        activeGroup ===
                        "artificialColour" &&
                        draft.artificialColour
                    ) {

                        artificialColourRef.current?.loadDraft(
                            draft.artificialColour
                        );

                    }


                    // ----------------------------------------------
                    // URIC ACID
                    // ----------------------------------------------

                    if (
                        activeGroup ===
                        "uricAcid" &&
                        draft.uricAcid
                    ) {

                        uricAcidRef.current?.loadDraft(
                            draft.uricAcid
                        );

                    }


                    // ----------------------------------------------
                    // FSV (A, D, E, K)
                    // ----------------------------------------------

                    if (
                        activeGroup === "fsv" &&
                        draft.fsv
                    ) {

                        fsvRef.current?.loadDraft(
                            draft.fsv
                        );

                    }


                    // ----------------------------------------------
                    // FATTY ACID PROFILE
                    // ----------------------------------------------

                    if (
                        activeGroup ===
                        "fattyAcidProfile" &&
                        draft.fattyAcidProfile
                    ) {

                        fattyAcidProfileRef.current?.loadDraft(
                            draft.fattyAcidProfile
                        );

                    }


                    // ----------------------------------------------
                    // SUGAR / SAPONIN / CATECHIN PROFILE
                    // ----------------------------------------------

                    if (
                        activeGroup ===
                        "sugarSaponinCatechinProfile" &&
                        draft.sugarSaponinCatechinProfile
                    ) {

                        sugarSaponinCatechinProfileRef.current?.loadDraft(
                            draft.sugarSaponinCatechinProfile
                        );

                    }


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
                    // DIETARY FIBER
                    // ----------------------------------------------

                    if (
                        activeGroup === "dietaryFiber" &&
                        draft.dietaryFiber
                    ) {

                        dietaryFiberRef.current?.loadDraft(
                            normalizeDietaryFiberDraft(
                                draft.dietaryFiber
                            )
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
                    // ACIDITY
                    // ----------------------------------------------

                    if (
                        activeGroup === "acidity" &&
                        draft.acidity
                    ) {

                        acidityRef.current?.loadDraft(
                            draft.acidity
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


                    // ----------------------------------------------
                    // UNSAPONIFIABLE MATTER
                    // ----------------------------------------------

                    if (
                        activeGroup ===
                        "unsapMatter" &&
                        draft.unsapMatter
                    ) {

                        unsapMatterRef.current?.loadDraft(
                            draft.unsapMatter
                        );

                    }


                    // ----------------------------------------------
                    // ARTIFICIAL SWEETNER
                    // ----------------------------------------------

                    if (
                        activeGroup ===
                        "artificialSweetner" &&
                        draft.artificialSweetner
                    ) {

                        artificialSweetnerRef.current?.loadDraft(
                            draft.artificialSweetner
                        );

                    }


                    // ----------------------------------------------
                    // PRESERVATIVE
                    // ----------------------------------------------

                    if (
                        activeGroup ===
                        "preservative" &&
                        draft.preservative
                    ) {

                        preservativeRef.current?.loadDraft(
                            draft.preservative
                        );

                    }


                    // ----------------------------------------------
                    // MOISTURE
                    // ----------------------------------------------

                    if (
                        activeGroup ===
                        "moisture" &&
                        draft.moisture
                    ) {

                        moistureRef.current?.loadDraft(
                            draft.moisture
                        );

                    }


                    // ----------------------------------------------
                    // NOTS
                    // ----------------------------------------------

                    if (
                        activeGroup ===
                        "nots" &&
                        draft.nots
                    ) {

                        notsRef.current?.loadDraft(
                            draft.nots
                        );

                    }


                    // ----------------------------------------------
                    // SULPHUR DIOXIDE
                    // ----------------------------------------------

                    if (
                        activeGroup ===
                        "sulphurDioxide" &&
                        draft.sulphurDioxide
                    ) {

                        sulphurDioxideRef.current?.loadDraft(
                            draft.sulphurDioxide
                        );

                    }


                    // ----------------------------------------------
                    // CHOLESTEROL
                    // ----------------------------------------------

                    if (
                        activeGroup ===
                        "cholesterol" &&
                        draft.cholesterol
                    ) {

                        cholesterolRef.current?.loadDraft(
                            draft.cholesterol
                        );

                    }


                    // ----------------------------------------------
                    // WSV
                    // ----------------------------------------------

                    if (
                        activeGroup ===
                        "wsv" &&
                        draft.wsv
                    ) {

                        wsvRef.current?.loadDraft(
                            draft.wsv
                        );

                    }


                    // ----------------------------------------------
                    // AMINO ACID
                    // ----------------------------------------------

                    if (
                        activeGroup ===
                        "aminoAcid" &&
                        draft.aminoAcid
                    ) {

                        aminoAcidRef.current?.loadDraft(
                            draft.aminoAcid
                        );

                    }

                },


                // ====================================================
                // RESTORE FROM WORKSHEET
                // ====================================================

                restoreFromWorksheet(
                    parameter: ParameterDetail
                ) {

                    // ========================================================
                    // NORMALIZE DIETARY FIBER WORKSHEET DATA
                    // ========================================================
                    // Older saved worksheets may contain the obsolete
                    // "After Ashing(g)" step and may not contain the new
                    // user-entered "Ash" (%) step. Normalize the API payload
                    // before passing it to the Dietary Fiber module so the
                    // value survives Save Draft + browser refresh.
                    // ========================================================

                    const normalizedParameter = {
                        ...parameter,

                        preparations:
                            (parameter.preparations ?? []).map(
                                preparation => {

                                    if (
                                        preparation.preparationType !==
                                        "dietaryFiber"
                                    ) {
                                        return preparation;
                                    }

                                    let steps: any[] = [];

                                    try {
                                        steps =
                                            typeof preparation.steps ===
                                                "string"
                                                ? JSON.parse(
                                                    preparation.steps
                                                )
                                                : Array.isArray(
                                                    preparation.steps
                                                )
                                                    ? preparation.steps
                                                    : [];
                                    }
                                    catch {
                                        steps = [];
                                    }

                                    // ========================================================
                                    // ENSURE AFTER ASHING + ASH EXIST IN THE CORRECT ORDER
                                    // ========================================================
                                    // After Ashing(g) is a real user input and MUST be
                                    // displayed immediately after Avg Residue wt(g).
                                    //
                                    // Older saved worksheets may not contain this step.
                                    // Newer worksheets may contain Ash but still be missing
                                    // After Ashing(g). Therefore both steps are normalized
                                    // independently.
                                    // ========================================================

                                    let afterAshingIndex =
                                        steps.findIndex(
                                            step =>
                                                step?.name ===
                                                "After Ashing(g)"
                                        );

                                    let ashIndex =
                                        steps.findIndex(
                                            step =>
                                                step?.name === "Ash"
                                        );

                                    const afterAshingStep = {
                                        name: "After Ashing(g)",
                                        value1: "",
                                        unit1: "g",
                                        logBookID: ""
                                    };

                                    const ashStep = {
                                        name: "Ash",
                                        value1: "",
                                        unit1: "%",
                                        logBookID: ""
                                    };

                                    // --------------------------------------------------------
                                    // 1. Ensure After Ashing(g) exists.
                                    // --------------------------------------------------------
                                    if (
                                        afterAshingIndex < 0
                                    ) {
                                        // Insert it immediately before Ash when Ash exists.
                                        if (ashIndex >= 0) {
                                            steps.splice(
                                                ashIndex,
                                                0,
                                                afterAshingStep
                                            );
                                        }
                                        else {
                                            // Otherwise insert it before Spl T.V(ml),
                                            // which is the next known input in the Excel order.
                                            const sampleTitreIndex =
                                                steps.findIndex(
                                                    step =>
                                                        step?.name ===
                                                        "Spl T.V(ml)"
                                                );

                                            if (
                                                sampleTitreIndex >= 0
                                            ) {
                                                steps.splice(
                                                    sampleTitreIndex,
                                                    0,
                                                    afterAshingStep
                                                );
                                            }
                                            else {
                                                steps.push(
                                                    afterAshingStep
                                                );
                                            }
                                        }
                                    }

                                    // Re-read indexes because the array may have changed.
                                    afterAshingIndex =
                                        steps.findIndex(
                                            step =>
                                                step?.name ===
                                                "After Ashing(g)"
                                        );

                                    ashIndex =
                                        steps.findIndex(
                                            step =>
                                                step?.name === "Ash"
                                        );

                                    // --------------------------------------------------------
                                    // 2. Ensure Ash exists and is immediately after
                                    //    After Ashing(g).
                                    // --------------------------------------------------------
                                    if (
                                        ashIndex < 0
                                    ) {
                                        steps.splice(
                                            afterAshingIndex + 1,
                                            0,
                                            ashStep
                                        );
                                    }
                                    else {
                                        // Preserve the saved Ash value but force its unit
                                        // to %. Also move Ash immediately after After Ashing.
                                        const existingAsh =
                                            steps[ashIndex];

                                        steps.splice(
                                            ashIndex,
                                            1
                                        );

                                        afterAshingIndex =
                                            steps.findIndex(
                                                step =>
                                                    step?.name ===
                                                    "After Ashing(g)"
                                            );

                                        steps.splice(
                                            afterAshingIndex + 1,
                                            0,
                                            {
                                                ...existingAsh,
                                                unit1: "%"
                                            }
                                        );
                                    }

                                    return {
                                        ...preparation,
                                        steps: JSON.stringify(steps)
                                    };
                                }
                            )
                    };

                    pendingRestore.current =
                        normalizedParameter;


                    const preps =
                        normalizedParameter.preparations ?? [];


                    const groups: string[] = [];


                    // ----------------------------------------------
                    // ARTIFICIAL COLOUR
                    // ----------------------------------------------

                    if (
                        preps.some(
                            p =>
                                p.preparationCategory ===
                                "sample" &&

                                p.preparationType ===
                                "artificialColour"
                        )
                    ) {

                        groups.push(
                            "artificialColour"
                        );

                    }


                    // ----------------------------------------------
                    // URIC ACID
                    // ----------------------------------------------

                    if (
                        preps.some(
                            p =>
                                p.preparationCategory ===
                                "sample" &&

                                p.preparationType ===
                                "uricAcid"
                        )
                    ) {

                        groups.push(
                            "uricAcid"
                        );

                    }


                    // ----------------------------------------------
                    // FATTY ACID PROFILE
                    // ----------------------------------------------

                    if (
                        preps.some(
                            p =>
                                p.preparationCategory ===
                                "sample" &&

                                p.preparationType ===
                                "fattyAcidProfile"
                        )
                    ) {

                        groups.push(
                            "fattyAcidProfile"
                        );

                    }


                    // ----------------------------------------------
                    // SULPHUR DIOXIDE
                    // ----------------------------------------------

                    if (
                        preps.some(
                            p =>
                                p.preparationCategory ===
                                "sample" &&

                                p.preparationType ===
                                "sulphurDioxide"
                        )
                    ) {

                        groups.push(
                            "sulphurDioxide"
                        );

                    }


                    // ----------------------------------------------
                    // CHOLESTEROL
                    // ----------------------------------------------

                    if (
                        preps.some(
                            p =>
                                p.preparationCategory ===
                                "sample" &&

                                p.preparationType ===
                                "cholesterol"
                        )
                    ) {

                        groups.push(
                            "cholesterol"
                        );

                    }


                    // ----------------------------------------------
                    // WSV
                    // ----------------------------------------------

                    if (
                        preps.some(
                            p =>
                                p.preparationCategory ===
                                "sample" &&

                                p.preparationType ===
                                "wsv"
                        )
                    ) {

                        groups.push(
                            "wsv"
                        );

                    }


                    // ----------------------------------------------
                    // AMINO ACID
                    // ----------------------------------------------

                    if (
                        preps.some(
                            p =>
                                p.preparationCategory ===
                                "sample" &&

                                p.preparationType ===
                                "aminoAcid"
                        )
                    ) {

                        groups.push(
                            "aminoAcid"
                        );

                    }


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
                    // DIETARY FIBER
                    // ----------------------------------------------

                    if (
                        preps.some(
                            p =>
                                p.preparationCategory ===
                                "sample" &&

                                p.preparationType ===
                                "dietaryFiber"
                        )
                    ) {

                        groups.push("dietaryFiber");

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
                    // ACIDITY
                    // ----------------------------------------------

                    if (
                        preps.some(
                            p =>
                                p.preparationCategory ===
                                "sample" &&

                                p.preparationType ===
                                "acidity"
                        )
                    ) {

                        groups.push("acidity");

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


                    // ----------------------------------------------
                    // UNSAPONIFIABLE MATTER
                    // ----------------------------------------------

                    if (
                        preps.some(
                            p =>
                                p.preparationCategory ===
                                "sample" &&

                                p.preparationType ===
                                "unsapMatter"
                        )
                    ) {

                        groups.push(
                            "unsapMatter"
                        );

                    }


                    // ----------------------------------------------
                    // ARTIFICIAL SWEETNER
                    // ----------------------------------------------

                    if (
                        preps.some(
                            p =>
                                p.preparationCategory ===
                                "sample" &&

                                p.preparationType ===
                                "artificialSweetner"
                        )
                    ) {

                        groups.push(
                            "artificialSweetner"
                        );

                    }


                    // ----------------------------------------------
                    // PRESERVATIVE
                    // ----------------------------------------------

                    if (
                        preps.some(
                            p =>
                                p.preparationCategory ===
                                "sample" &&

                                p.preparationType ===
                                "preservative"
                        )
                    ) {

                        groups.push(
                            "preservative"
                        );

                    }


                    // ----------------------------------------------
                    // MOISTURE
                    // ----------------------------------------------

                    if (
                        preps.some(
                            p =>
                                p.preparationCategory ===
                                "sample" &&

                                p.preparationType ===
                                "moisture"
                        )
                    ) {

                        groups.push(
                            "moisture"
                        );

                    }


                    // ----------------------------------------------
                    // NOTS
                    // ----------------------------------------------

                    if (
                        preps.some(
                            p =>
                                p.preparationCategory ===
                                "sample" &&

                                p.preparationType ===
                                "nots"
                        )
                    ) {

                        groups.push(
                            "nots"
                        );

                    }


                    // ----------------------------------------------
                    // SUGAR / SAPONIN / CATECHIN PROFILE
                    // ----------------------------------------------

                    if (
                        preps.some(
                            p =>
                                p.preparationCategory ===
                                "sample" &&

                                p.preparationType ===
                                "sugarSaponinCatechinProfile"
                        )
                    ) {

                        groups.push(
                            "sugarSaponinCatechinProfile"
                        );

                    }


                    // ----------------------------------------------
                    // FSV (A, D, E, K)
                    // ----------------------------------------------

                    if (
                        preps.some(
                            p =>
                                p.preparationCategory ===
                                "sample" &&

                                p.preparationType ===
                                "fsv"
                        )
                    ) {

                        groups.push(
                            "fsv"
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
            // ARTIFICIAL COLOUR
            // ========================================================

            if (
                activeGroup ===
                "artificialColour" &&
                artificialColourRef.current
            ) {

                artificialColourRef.current
                    .restoreFromWorksheet(
                        pendingRestore.current
                    );


                pendingRestore.current =
                    null;


                return;

            }


            // ========================================================
            // URIC ACID
            // ========================================================

            if (
                activeGroup ===
                "uricAcid" &&
                uricAcidRef.current
            ) {

                uricAcidRef.current
                    .restoreFromWorksheet(
                        pendingRestore.current
                    );


                pendingRestore.current =
                    null;


                return;

            }


            // ========================================================
            // FSV (A, D, E, K)
            // ========================================================

            if (
                activeGroup === "fsv" &&
                fsvRef.current
            ) {

                fsvRef.current
                    .restoreFromWorksheet(
                        pendingRestore.current
                    );


                pendingRestore.current =
                    null;


                return;

            }


            // ========================================================
            // FATTY ACID PROFILE
            // ========================================================

            if (
                activeGroup ===
                "fattyAcidProfile" &&
                fattyAcidProfileRef.current
            ) {

                fattyAcidProfileRef.current
                    .restoreFromWorksheet(
                        pendingRestore.current
                    );


                pendingRestore.current =
                    null;


                return;

            }


            // ========================================================
            // SULPHUR DIOXIDE
            // ========================================================

            if (
                activeGroup ===
                "sulphurDioxide" &&
                sulphurDioxideRef.current
            ) {

                sulphurDioxideRef.current
                    .restoreFromWorksheet(
                        pendingRestore.current
                    );


                pendingRestore.current =
                    null;


                return;

            }


            // ========================================================
            // CHOLESTEROL
            // ========================================================

            if (
                activeGroup ===
                "cholesterol" &&
                cholesterolRef.current
            ) {

                cholesterolRef.current
                    .restoreFromWorksheet(
                        pendingRestore.current
                    );


                pendingRestore.current =
                    null;


                return;

            }


            // ========================================================
            // WSV
            // ========================================================

            if (
                activeGroup ===
                "wsv" &&
                wsvRef.current
            ) {

                wsvRef.current
                    .restoreFromWorksheet(
                        pendingRestore.current
                    );


                pendingRestore.current =
                    null;


                return;

            }


            // ========================================================
            // AMINO ACID
            // ========================================================

            if (
                activeGroup ===
                "aminoAcid" &&
                aminoAcidRef.current
            ) {

                aminoAcidRef.current
                    .restoreFromWorksheet(
                        pendingRestore.current
                    );


                pendingRestore.current =
                    null;


                return;

            }


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
            // DIETARY FIBER
            // ========================================================

            if (
                activeGroup === "dietaryFiber" &&
                dietaryFiberRef.current
            ) {

                dietaryFiberRef.current
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
            // ACIDITY
            // ========================================================

            if (
                activeGroup === "acidity" &&
                acidityRef.current
            ) {

                acidityRef.current
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


            // ========================================================
            // UNSAPONIFIABLE MATTER
            // ========================================================

            if (
                activeGroup ===
                "unsapMatter" &&
                unsapMatterRef.current
            ) {

                unsapMatterRef.current
                    .restoreFromWorksheet(
                        pendingRestore.current
                    );


                pendingRestore.current =
                    null;


                return;

            }


            // ========================================================
            // ARTIFICIAL SWEETNER
            // ========================================================

            if (
                activeGroup ===
                "artificialSweetner" &&
                artificialSweetnerRef.current
            ) {

                artificialSweetnerRef.current
                    .restoreFromWorksheet(
                        pendingRestore.current
                    );


                pendingRestore.current =
                    null;


                return;

            }


            // ========================================================
            // PRESERVATIVE
            // ========================================================

            if (
                activeGroup ===
                "preservative" &&
                preservativeRef.current
            ) {

                preservativeRef.current
                    .restoreFromWorksheet(
                        pendingRestore.current
                    );


                pendingRestore.current =
                    null;


                return;

            }


            // ========================================================
            // MOISTURE
            // ========================================================

            if (
                activeGroup ===
                "moisture" &&
                moistureRef.current
            ) {

                moistureRef.current
                    .restoreFromWorksheet(
                        pendingRestore.current
                    );


                pendingRestore.current =
                    null;


                return;

            }


            // ========================================================
            // SUGAR / SAPONIN / CATECHIN PROFILE
            // ========================================================

            if (
                activeGroup ===
                "sugarSaponinCatechinProfile" &&
                sugarSaponinCatechinProfileRef.current
            ) {

                sugarSaponinCatechinProfileRef.current
                    .restoreFromWorksheet(
                        pendingRestore.current
                    );


                pendingRestore.current =
                    null;


                return;

            }


            // ========================================================
            // NOTS
            // ========================================================

            if (
                activeGroup ===
                "nots" &&
                notsRef.current
            ) {

                notsRef.current
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
                    isLocked={isLocked}
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

                    canUnlockPreparation={
                        canUnlockPreparation
                    }

                    canEditCalculations={
                        canEditCalculations
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

                    dietaryFiberRef={
                        dietaryFiberRef
                    }

                    peroxideValueRef={
                        peroxideValueRef
                    }

                    acidValueRef={
                        acidValueRef
                    }

                    acidityRef={
                        acidityRef
                    }

                    saponificationValueRef={
                        saponificationValueRef
                    }

                    freeFattyAcidRef={
                        freeFattyAcidRef
                    }

                    unsapMatterRef={
                        unsapMatterRef
                    }

                    artificialSweetnerRef={
                        artificialSweetnerRef
                    }

                    preservativeRef={
                        preservativeRef
                    }

                    moistureRef={
                        moistureRef
                    }

                    notsRef={
                        notsRef
                    }

                    sulphurDioxideRef={
                        sulphurDioxideRef
                    }

                    cholesterolRef={
                        cholesterolRef
                    }

                    wsvRef={
                        wsvRef
                    }

                    aminoAcidRef={
                        aminoAcidRef
                    }

                    artificialColourRef={
                        artificialColourRef
                    }

                    uricAcidRef={
                        uricAcidRef
                    }

                    fsvRef={
                        fsvRef
                    }

                    fattyAcidProfileRef={
                        fattyAcidProfileRef
                    }

                    sugarSaponinCatechinProfileRef={
                        sugarSaponinCatechinProfileRef
                    }

                />

            </div>

        );

    });


export default PreparationEngine;