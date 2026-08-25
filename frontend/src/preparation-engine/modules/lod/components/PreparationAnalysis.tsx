import React, {
    useState,
    forwardRef,
    useImperativeHandle
} from "react";

import LODHeader from "./LODHeader";
import SamplePreparationSection from "./SamplePreparationSection";
import FileAttachmentSection from "./FileAttachmentSection";
import PreparationCompleteSection from "./PreparationCompleteSection";
import {
    addSamplePreparation,
    removeSamplePreparation,
    updateSamplePreparationStep
} from "../handlers";
import type { SamplePreparationLod } from "../models/SamplePreparationLod";
import type { SamplePreparationLodStep } from "../models/SamplePreparationLodStep";
import type { AttachedFile } from "../../../../models/AttachedFile";
import type { CalculationLod } from "../models/CalculationLod";
import { moduleRegistry } from "../../../configs/moduleRegistry";
import CalculationSection from "./CalculationSection";
import PreparationCompleteModal from "./PreparationCompleteModal";
import Toast from "../../../../components/shared/Toast";
import UnlockPreparationDialog from "../../../components/UnlockPreparationDialog";
import type { PreparationModuleHandle } from "../../../../pages/food/types/PreparationModuleHandle";
import type { CalculationBase } from "../../../models/CalculationBase";
import { parseWorksheetDate } from "../../../../helpers/parseWorksheetDate";

interface Props {

    parameterId: number;

    parameterName?: string | null;

    parameterCode?: string | null;

    role: string;

    isLocked: boolean;

    canEditCalculations?: boolean;

    canUnlockPreparation: boolean;

    parameterType: string;

    onLockPreparation: (parameterId: number) => void;

    onUnlockPreparation: (parameterId: number) => void;

}

const PreparationAnalysis = forwardRef<PreparationModuleHandle, Props>(({

    parameterId,

    parameterName,

    parameterCode,

    role,

    isLocked,

    parameterType,

    canEditCalculations = false,

    canUnlockPreparation,

    onLockPreparation,

    onUnlockPreparation

}, ref) => {



    const [showUnlockDialog, setShowUnlockDialog] = useState(false);

    const [isUnlocking, setIsUnlocking] = useState(false);

    const [samplePreparations, setSamplePreparations] =
        useState<SamplePreparationLod[]>([]);

    const [files, setFiles] =
        useState<AttachedFile[]>([]);

    const handleAddPreparation = () => {

        const newPreparation =
            moduleConfig.createSamplePreparation(
                samplePreparations.length
            );

        setSamplePreparations(prev => [
            ...prev,
            newPreparation
        ]);
    };

    const handleRemovePreparation = (
        samplePreparationId: number
    ) => {

        setSamplePreparations(prev =>
            removeSamplePreparation(prev, samplePreparationId)
        );

    };

    const handleStepChange = (
        samplePreparationId: number,
        stepName: SamplePreparationLodStep["name"],
        field: "value1" | "unit1" | "value2" | "unit2" | "logBookID",
        value: string
    ) => {

        setSamplePreparations(prev =>
            updateSamplePreparationStep(
                prev,
                samplePreparationId,
                stepName,
                field,
                value
            )
        );

    };

    const handleAttachFiles = (
        newFiles: AttachedFile[]
    ) => {

        setFiles(prev => [

            ...prev,

            ...newFiles

        ]);

    };

    const handleRemoveFile = (
        index: number
    ) => {

        setFiles(prev =>
            prev.filter((_, i) => i !== index)
        );

    };

    const [isPreparationCompleted, setIsPreparationCompleted] = useState(false);

    const [completedAt, setCompletedAt] = useState<Date | null>(null);
    const [showCompleteModal, setShowCompleteModal] = useState(false);
    // const [isPreparationLocked, setIsPreparationLocked] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [toastType, setToastType] = useState<
        "success" | "error" | "info" | "warning"
    >("success");

    // The worksheet/workflow lock is the single authority for editability.
    // Draft/Created worksheets remain editable for Reviewers.
    // Once the parameter is in an analysis-locked state, preparation and
    // calculation controls become read-only.
    const controlsLocked = isLocked;

    const handleCompletePreparation = () => {

        setShowCompleteModal(false);
        setIsPreparationCompleted(true);

        const completedTime = new Date();

        setCompletedAt(completedTime);

        onLockPreparation(parameterId);

        setToastType("success");

        setToastMessage(
            `${parameterType.toUpperCase()} preparation marked as complete!`
        );

        setShowToast(true);

        setTimeout(() => {

            setShowToast(false);

        }, 4000);

    };

    const handleUnlockPreparation = async () => {

        try {

            setIsUnlocking(true);

            setIsPreparationCompleted(false);

            setCompletedAt(null);

            onUnlockPreparation(parameterId);

            setShowUnlockDialog(false);

            setToastType("success");

            setToastMessage(
                `${parameterType.toUpperCase()} preparation unlocked successfully.`
            );

            setShowToast(true);

            setTimeout(() => {

                setShowToast(false);

            }, 4000);

        }
        finally {

            setIsUnlocking(false);

        }

    };
    const [calculations, setCalculations] =
        useState<CalculationBase[]>([]);
    const moduleConfig =
        moduleRegistry[
        parameterType as keyof typeof moduleRegistry
        ];
    // console.log("🔥 PREPARATION ANALYSIS MOUNTED", {
    //     parameterType,
    //     moduleConfig,
    // });

    const handleAddCalculation = () => {

        setCalculations(prev => [

            ...prev,

            moduleConfig.createCalculation(prev.length)

        ]);

    };

    const handleRemoveCalculation = (
        calculationId: number
    ) => {

        setCalculations(prev =>
            prev.filter(c => c.id !== calculationId)
        );

    };

    const handleCalculationFieldChange = (
        calculationId: number,
        field: keyof CalculationBase,
        value: any
    ) => {

        setCalculations(prev =>

            prev.map(calc =>

                calc.id === calculationId

                    ? {
                        ...calc,
                        [field]: value
                    }

                    : calc

            )

        );

    };

    useImperativeHandle(ref, () => ({

        getDraft() {

            return {

                samplePreparations,

                calculations,

                files,

                isPreparationCompleted,

                completedAt

            };

        },

        loadDraft(draft) {

            if (!draft)
                return;

            setSamplePreparations(
                draft.samplePreparations ?? []
            );

            setFiles(
                draft.files ?? []
            );

            setCalculations(
                draft.calculations ?? []
            );

            setIsPreparationCompleted(
                draft.isPreparationCompleted ?? false
            );

            setCompletedAt(
                draft.completedAt ?? null
            );

        },

        //----------------------------------------------------
        // NEW
        //----------------------------------------------------



        restoreFromWorksheet(parameter) {
            //console.log("LOD Parameter", parameter);
            const preps =
                parameter.preparations ?? [];

            //------------------------------------------------
            // Sample Preparation
            //------------------------------------------------

            const samplePreps = preps
                .filter(x =>
                    x.preparationCategory === "sample" &&
                    x.preparationType === parameterType
                )
                .map((x, index) => ({

                    id: index + 1,

                    label: x.label,

                    steps:
                        typeof x.steps === "string"
                            ? JSON.parse(x.steps)
                            : (x.steps ?? [])

                }));

            setSamplePreparations(samplePreps);










            //------------------------------------------------
            // Files
            //------------------------------------------------

            const lodFiles = (parameter.files ?? []).filter(
                x =>

                    x.preparationType === parameterType
            );

            setFiles(lodFiles);

            //------------------------------------------------
            // Calculations
            //------------------------------------------------


            const rawCalculations =
                (parameter.calculations ?? []) as any[];

            const calculations: CalculationBase[] =
                rawCalculations
                    .filter(
                        calculation =>
                            calculation.calculationType === parameterType
                    )
                    .map(
                        calculation =>
                            moduleConfig.restoreCalculation(
                                calculation
                            ) as CalculationBase
                    );

            setCalculations(calculations);

            // ============================================================
            // COMPLETED
            // ============================================================

            const completedDate =
                parseWorksheetDate(
                    parameter.preparationCompletedAt
                );

            console.log(
                "Preparation completed date:",
                {
                    parameterType,
                    raw: parameter.preparationCompletedAt,
                    parsed: completedDate
                }
            );

            const completed =
                completedDate !== null;

            setIsPreparationCompleted(
                completed
            );

            setCompletedAt(
                completedDate
            );

            // Do not convert preparation completion into a workflow lock here.
            // The parent restores the authoritative worksheet/analysis lock.
        }

    }));

    return (

        <div
            className="
                mt-8
                rounded-3xl
                overflow-hidden
                border
                border-emerald-200
                bg-gradient-to-br
                from-white
                via-emerald-50/30
                to-white
                shadow-2xl
            "
        >

            <LODHeader
                sampleCount={samplePreparations.length}
                parameterType={parameterType}
            />

            <SamplePreparationSection
                samplePreparations={samplePreparations}
                role={role}
                onAdd={handleAddPreparation}
                onRemove={handleRemovePreparation}
                onStepChange={handleStepChange}
                isLocked={isLocked}
                parameterType={parameterType}
            />
            {samplePreparations.length > 0 && (

                <>

                    <div className="mx-6 mt-6 mb-6">
                        <FileAttachmentSection
                            files={files}
                            onAdd={handleAttachFiles}
                            onRemove={handleRemoveFile}
                            isLocked={isLocked}
                        />
                    </div>

                    {/*
                     * After the worksheet/parameter is submitted for analysis,
                     * the preparation and calculation area is read-only.
                     * A native disabled fieldset keeps all existing values and
                     * results visible while disabling every button/input inside:
                     * Unlock Preparation, Add Calculation, calculation delete,
                     * Acceptance Limit fields and Calculate Result.
                     */}
                    <PreparationCompleteSection
                        completed={isPreparationCompleted}
                        completedAt={completedAt}
                        onComplete={() => setShowCompleteModal(true)}
                        onUnlock={() => setShowUnlockDialog(true)}
                        parameterType={parameterType}
                        canUnlockPreparation={canUnlockPreparation}
                    />

                    <fieldset
                        disabled={controlsLocked && !canEditCalculations}
                        className={
                            controlsLocked && !canEditCalculations
                                ? "min-w-0 [&_button]:cursor-not-allowed [&_input]:cursor-not-allowed"
                                : "min-w-0"
                        }
                    >
                        {isPreparationCompleted && (
                            <CalculationSection
                                calculations={calculations}
                                samplePreparations={samplePreparations}
                                onAdd={handleAddCalculation}
                                onRemove={handleRemoveCalculation}
                                parameterType={parameterType}
                                role={role}
                                onFieldChange={handleCalculationFieldChange}
                            />
                        )}
                    </fieldset>

                </>

            )}

            <PreparationCompleteModal
                isOpen={showCompleteModal}
                isCompleting={false}
                parameterName={parameterName ?? null}
                parameterCode={parameterCode ?? null}
                onClose={() => setShowCompleteModal(false)}
                onConfirm={handleCompletePreparation}
            />
            <UnlockPreparationDialog
                isOpen={showUnlockDialog}
                isUnlocking={isUnlocking}
                parameterName={parameterName ?? ""}
                parameterCode={parameterCode ?? ""}
                onClose={() => setShowUnlockDialog(false)}
                onConfirm={handleUnlockPreparation}
            />
            <Toast
                isVisible={showToast}
                message={toastMessage}
                type={toastType}
                onClose={() => setShowToast(false)}
            />

        </div>

    );

});

export default PreparationAnalysis;