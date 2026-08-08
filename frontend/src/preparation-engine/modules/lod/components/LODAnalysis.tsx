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
import { createNewCalculationLod } from "../factory";
import CalculationSection from "./CalculationSection";
import PreparationCompleteModal from "./PreparationCompleteModal";
import Toast from "../../../../components/shared/Toast";
import UnlockPreparationDialog from "../../../components/UnlockPreparationDialog";
import type { PreparationModuleHandle } from "../../../../pages/food/types/PreparationModuleHandle";

interface Props {

    parameterId: number;

    parameterName?: string | null;

    parameterCode?: string | null;

    role: string;

    isLocked: boolean;

    parameterType: string;

    onLockPreparation: (parameterId: number) => void;

    onUnlockPreparation: (parameterId: number) => void;

}

const LODAnalysis = forwardRef<PreparationModuleHandle, Props>(({

    parameterId,

    parameterName,

    parameterCode,

    role,

    isLocked,

    parameterType,

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

        setSamplePreparations(prev =>
            addSamplePreparation(prev)
        );

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
    const [calculations, setCalculations] = useState<CalculationLod[]>([]);

    const handleAddCalculation = () => {

        setCalculations(prev => [

            ...prev,

            createNewCalculationLod(prev.length)

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
        field: keyof CalculationLod,
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

            const calculations: CalculationLod[] =
                (parameter.calculations ?? []).map((c: any, index: number) => {

                    const data =
                        typeof c.data === "string"
                            ? JSON.parse(c.data)
                            : (c.data ?? {});

                    return {

                        id: data.id ?? index + 1,

                        label:
                            data.label ??
                            c.label ??
                            `Calculation ${index + 1}`,

                        selectedSamplePreparationLabel:
                            data.selectedSamplePreparationLabel ?? null,

                        acceptanceLimitMin:
                            data.acceptanceLimitMin ?? "",

                        acceptanceLimitMax:
                            data.acceptanceLimitMax ?? "",

                        w1_emptyDish:
                            data.w1_emptyDish ?? "",

                        w2_dishWithSample:
                            data.w2_dishWithSample ?? "",

                        w3_dishAfterIgnition:
                            data.w3_dishAfterIgnition ?? "",

                        calculationResult:
                            data.calculationResult ?? null,

                        calculationResultUnit:
                            data.calculationResultUnit ?? null,

                        w1: data.w1 ?? null,
                        w2: data.w2 ?? null,
                        w3: data.w3 ?? null
                    };

                });

            setCalculations(calculations);

            // console.log("LOD Parameter");
            // console.log(parameter);
            // console.log(parameter.calculations);
            // console.log(parameter.preparations);

            //------------------------------------------------
            // Completed
            //------------------------------------------------

            // setIsPreparationCompleted(
            //     samplePreps.length > 0
            // );

            // const completed = parameter.status === "COMPLETED";
            const completed = parameter.preparationCompletedAt != null;

            setIsPreparationCompleted(completed);


            setCompletedAt(
                parameter.preparationCompletedAt
                    ? new Date(parameter.preparationCompletedAt)
                    : null
            );

            if (completed) {
                onLockPreparation(parameterId);
            }
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

                    <PreparationCompleteSection
                        completed={isPreparationCompleted}
                        completedAt={completedAt}
                        onComplete={() => setShowCompleteModal(true)}
                        onUnlock={() => setShowUnlockDialog(true)}
                    />
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

export default LODAnalysis;