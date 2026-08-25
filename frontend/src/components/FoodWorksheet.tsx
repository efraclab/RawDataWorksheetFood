import React, { useState, useRef, useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { WorksheetProps } from "./shared/WorksheetProps";
import type { WorksheetDetail } from "../models/WorksheetDetail";
import type { SampleData } from "../models/SampleData";
import type { FetchWorksheetRequest } from "../models/FetchWorksheetRequest";
import type { SmapleDetailsRequest } from "../models/SmapleDetailsRequest";
import type { ParameterDetail } from "../models/ParameterDetail";
import FoodHeader from "./sub-components/food/FoodHeader";
import FoodWorksheetInfo from "./sub-components/food/FoodWorksheetInfo";
import FoodParameterManager from "./sub-components/food/FoodParameterManager";
import FoodParameterOverview from "./sub-components/food/FoodParameterOverview";
import FoodInstrumentSection from "./sub-components/food/FoodInstrumentSection";
import FoodChemicalSection from "./sub-components/food/FoodChemicalSection";
import FoodStandardSection from "./sub-components/food/FoodStandardSection";
import type { Analyst } from "../models/Analyst";
import AnalystSelectionDialog from "./shared/AnalystSelectionDialog";
import { fetchAnalysts } from "../services/api";
import DeleteParameterDialog from "./shared/DeleteParameterDialog";
import UnlockParameterDialog from "./shared/UnlockParameterDialog";
import type { WorksheetInstrument } from "../models/WorksheetInstrument";
import type { WorksheetChemical } from "../models/WorksheetChemical";
import { fetchWorksheetById, fetchSample } from "../services/api";
import type { WorksheetStandard } from "../models/WorksheetStandard";
import CopyFromWorksheetDialog from "./shared/Copyfromworksheetdialog.tsx";
import FoodAdditionalInfo from "./sub-components/food/FoodAdditionalInfo";
import type { BufferPreparation as BufferPreparationModel } from "../preparation_models/drugs/BufferPreparation";
import FoodBufferPreparation from "./sub-components/food/FoodBufferPreparation";
import type { MobilePhasePreparation } from "../preparation_models/drugs/MobilePhasePreparation";
import FoodMobilePhasePreparation from "./sub-components/food/FoodMobilePhasePreparation";
import PreparationEditorDialog from "./sub-components/drugs/PreparationEditorDialog";
import type { DiluentPreparation } from "../preparation_models/drugs/DiluentPreparation";
import FoodDiluentPreparation from "./sub-components/food/FoodDiluentPreparation";
import type { SystemSuitability } from "../preparation_models/drugs/SystemSuitability";
import type { SystemSuitabilityStep } from "../preparation_models/drugs/SystemSuitabilityStep";
import FoodSystemSuitability from "./sub-components/food/FoodSystemSuitability";
import FoodParameterFiles from "./sub-components/food/FoodParameterFiles";
import type { AttachedFile } from "../models/AttachedFile";
import PreparationEngine from "../preparation-engine/components/PreparationEngine.tsx";
import type { PreparationEngineHandle } from "../pages/food/types/PreparationEngineHandle";
import { collectFormDataForAPI } from "../pages/food/services/collectFormDataForAPI";
import {
    createWorksheet,
    updateWorksheet,
    updateParameter,
    insertWorksheetLog
} from "../services/api";
import Toast from "./shared/Toast";
import SubmitDialog from "./shared/SubmitDialog";
import AnalysisLockSection from "./shared/AnalysisLockSection";
import StartAnalysisDialog from "./shared/StartAnalysisDialog";
import CompleteAnalysisDialog from "./shared/CompleteAnalysisDialog";
import ApproveParameterDialog from "./shared/ApproveParameterDialog";
import RevisionRequestDialog from "./shared/RevisionRequestDialog";

const FoodWorksheet: React.FC<WorksheetProps> = (props) => {
    const [preparationLockedPerParam, setPreparationLockedPerParam] = useState<Record<number, boolean>>({});
    const preparationRefs = useRef<Record<number, PreparationEngineHandle | null>>({});
    const [showCopyWorksheetDialog, setShowCopyWorksheetDialog] = useState(false);
    const [showAdditionalInfo, setShowAdditionalInfo] = useState<Record<number, boolean>>({});
    const [additionalInfoPerParam, setAdditionalInfoPerParam] = useState<Record<number, string>>({});
    const [bufferPreparationPerParam, setBufferPreparationPerParam] = useState<Record<number, BufferPreparationModel[]>>({});
    const [showBufferPreparation, setShowBufferPreparation] = useState<Record<number, boolean>>({});
    const [parameterStatusPerParam, setParameterStatusPerParam] = useState<Record<number, string>>({});

    const {
        worksheetId,
        employeeId,
        role,
        department,
        instruments,
        chemicals,
        standards
    } = props;
    const [toastMessage, setToastMessage] = useState("");
    const [expandedParameterId, setExpandedParameterId] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [worksheetInfo, setWorksheetInfo] = useState<WorksheetDetail | null>(null);
    const [registrationNo, setRegistrationNo] = useState("");
    const [samplesData, setSamplesData] = useState<SampleData[]>([]);
    const [addedParameters, setAddedParameters] = useState<ParameterDetail[]>([]);
    const [showAnalystDialog, setShowAnalystDialog] = useState(false);
    const [pendingParameter, setPendingParameter] = useState<ParameterDetail | null>(null);
    const [analysts, setAnalysts] = useState<Analyst[]>([]);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [parameterToDelete, setParameterToDelete] = useState<ParameterDetail | null>(null);

    // Analysis lock / unlock state
    const [showUnlockDialog, setShowUnlockDialog] = useState(false);
    const [isUnlocking, setIsUnlocking] = useState(false);
    const [parameterToUnlock, setParameterToUnlock] = useState<ParameterDetail | null>(null);
    // Start Analysis dialog state
    const [showStartAnalysisDialog, setShowStartAnalysisDialog] = useState(false);

    const [isStartingAnalysis, setIsStartingAnalysis] = useState(false);
    const [parameterForAnalysis, setParameterForAnalysis] =
        useState<ParameterDetail | null>(null);
    const [showCompleteAnalysisDialog, setShowCompleteAnalysisDialog] =
        useState(false);

    const [isCompletingAnalysis, setIsCompletingAnalysis] =
        useState(false);

    const [remarksByAnalystPerParam, setRemarksByAnalystPerParam] =
        useState<Record<number, string>>({});

    // Reviewer approval / revision state
    const [showApproveDialog, setShowApproveDialog] = useState(false);
    const [showRevisionDialog, setShowRevisionDialog] = useState(false);
    const [parameterForApproval, setParameterForApproval] =
        useState<ParameterDetail | null>(null);
    const [isApproving, setIsApproving] = useState(false);
    const [isRequestingRevision, setIsRequestingRevision] = useState(false);
    const [remarksByReviewerPerParam, setRemarksByReviewerPerParam] =
        useState<Record<number, string | null>>({});

    // Tracks an Analyst's optimistic "Start Revision" action.
    // The persisted parameter status remains the source of truth after reload.
    const [revisionStartedParams, setRevisionStartedParams] =
        useState<Set<number>>(new Set());

    const [toastType, setToastType] = useState<"success" | "error">("success");
    const restoreWorksheetToState = (worksheetData: WorksheetDetail) => {

        const restoredParams: ParameterDetail[] =
            worksheetData.parameters.map(param => ({
                ...param,
                id: param.id
            }));
        //console.log(restoredParams);

        // Restore per-parameter status/remarks so Reviewer sees the same
        // completed-analysis state immediately after hydration.
        const restoredParameterStatus: Record<number, string> = {};
        const restoredAnalystRemarks: Record<number, string> = {};
        const restoredReviewerRemarks: Record<number, string | null> = {};

        restoredParams.forEach(param => {
            if (param.status) {
                restoredParameterStatus[param.id] = param.status;
            }

            // Backend/database naming can differ between camelCase and snake_case.
            // Keep the original API field first, then support the common aliases so
            // the Reviewer can always restore the Analyst comment after reload.
            const analystRemark =
                (param as any).remarksByAnalyst ??
                (param as any).remarks_by_analyst ??
                (param as any).analystComment ??
                (param as any).analyst_comment ??
                (param as any).analysisRemarks ??
                (param as any).analysis_remarks ??
                null;

            if (analystRemark) {
                restoredAnalystRemarks[param.id] = analystRemark;
            }

            const reviewerRemark =
                (param as any).remarksByReviewer ??
                (param as any).remarks_by_reviewer ??
                null;

            if (reviewerRemark) {
                restoredReviewerRemarks[param.id] = reviewerRemark;
            }
        });


        const restoredShowParamFiles: Record<number, boolean> = {};
        const restoredInstruments: Record<number, WorksheetInstrument[]> = {};
        const restoredChemicals: Record<number, WorksheetChemical[]> = {};
        const restoredStandards: Record<number, WorksheetStandard[]> = {};

        const restoredAdditionalInfo: Record<number, string> = {};
        const restoredShowAdditionalInfo: Record<number, boolean> = {};

        const restoredBufferPreparations: Record<number, BufferPreparationModel[]> = {};
        const restoredMobilePreparations: Record<number, MobilePhasePreparation[]> = {};
        const restoredDiluentPreparations: Record<number, DiluentPreparation[]> = {};

        const restoredShowBuffer: Record<number, boolean> = {};
        const restoredShowMobile: Record<number, boolean> = {};
        const restoredShowDiluent: Record<number, boolean> = {};

        const restoredFilesPerParam: Record<number, any> = {};
        const restoredSystemSuitability: Record<number, SystemSuitability[]> = {};
        const restoredShowSystemSuitability: Record<number, boolean> = {};
        const restoredPreparationLocked: Record<number, boolean> = {};

        restoredParams.forEach(param => {

            // console.log(
            //     "Parameter:",
            //     selectedParameter?.id,
            //     "Locked:",
            //     isPreparationLocked,
            //     preparationLockedPerParam
            // );

            restoredPreparationLocked[param.id] =
                isAnalysisLockedStatus(param.status);

            restoredInstruments[param.id] = param.instruments ?? [];
            restoredChemicals[param.id] = param.chemicals ?? [];
            restoredStandards[param.id] = param.standards ?? [];

            restoredAdditionalInfo[param.id] =
                (param as any).additionalInfo ??
                (param as any).additional_info ??
                "";

            restoredShowAdditionalInfo[param.id] =
                (param as any).showAdditionalInfo ??
                (param as any).show_additional_info ??
                false;

            //---------------------------------------------------
            // Restore Preparations
            //---------------------------------------------------

            const preps = param.preparations ?? [];

            //---------------------------------------------------
            // Buffer
            //---------------------------------------------------

            const bufferPreps = preps
                .filter(p => p.preparationCategory === "buffer")
                .map((p, index) => ({

                    id: index + 1,

                    label: p.label,

                    steps:
                        typeof p.steps === "string"
                            ? JSON.parse(p.steps)
                            : (p.steps ?? [])

                }));

            restoredBufferPreparations[param.id] = bufferPreps;

            restoredShowBuffer[param.id] =
                bufferPreps.length > 0;

            //---------------------------------------------------
            // Mobile Phase
            //---------------------------------------------------

            const mobilePreps = preps
                .filter(p => p.preparationCategory === "mobile_phase")
                .map((p, index) => ({

                    id: String((p as any).id ?? `${param.id}-mobile-${index}`),

                    label: p.label,

                    content: (p as any).content ?? ""

                }));

            restoredMobilePreparations[param.id] =
                mobilePreps;

            restoredShowMobile[param.id] =
                mobilePreps.length > 0;

            //---------------------------------------------------
            // Diluent
            //---------------------------------------------------

            const diluentPreps = preps
                .filter(p => p.preparationCategory === "diluent")
                .map((p, index) => ({

                    id: String((p as any).id ?? `${param.id}-diluent-${index}`),

                    label: p.label,

                    content: (p as any).content ?? ""

                }));

            restoredDiluentPreparations[param.id] =
                diluentPreps;

            restoredShowDiluent[param.id] =
                diluentPreps.length > 0;

            const parameterFiles =
                (param.files ?? []).filter(
                    x => x.preparationType === "parameter_file"
                );

            restoredFilesPerParam[param.id] = {

                param_level: parameterFiles

            };

            restoredShowParamFiles[param.id] =
                parameterFiles.length > 0;

            //---------------------------------------------------
            // System Suitability
            //---------------------------------------------------

            const systemSuitability = preps
                .filter(p => p.preparationCategory === "system_suitability")
                .map((p, index) => ({

                    id: index + 1,

                    label: p.label,

                    steps:
                        typeof p.steps === "string"
                            ? JSON.parse(p.steps)
                            : (p.steps ?? [])

                }));




            restoredSystemSuitability[param.id] =
                systemSuitability;

            restoredShowSystemSuitability[param.id] =
                systemSuitability.length > 0;
        });

        //---------------------------------------------------
        // Restore all states
        //---------------------------------------------------

        setAddedParameters(restoredParams);
        setParameterStatusPerParam(restoredParameterStatus);
        setRemarksByAnalystPerParam(restoredAnalystRemarks);
        setRemarksByReviewerPerParam(restoredReviewerRemarks);

        setAddedInstruments(restoredInstruments);
        setAddedChemicals(restoredChemicals);
        setAddedStandards(restoredStandards);

        setAdditionalInfoPerParam(restoredAdditionalInfo);
        setShowAdditionalInfo(restoredShowAdditionalInfo);

        setBufferPreparationPerParam(restoredBufferPreparations);
        setMobilePhasePerParam(restoredMobilePreparations);
        setDiluentPreparationsPerParam(restoredDiluentPreparations);
        setShowBufferPreparation(restoredShowBuffer);
        setShowMobilePhasePreparation(restoredShowMobile);
        setShowDiluentPreparation(restoredShowDiluent);

        setSystemSuitabilityPerParam(restoredSystemSuitability);
        setShowSystemSuitability(restoredShowSystemSuitability);
        setPreparationLockedPerParam(restoredPreparationLocked);

        setFilesPerParam(restoredFilesPerParam);
        setShowParamFiles(restoredShowParamFiles);

        setShowInstrumentDropdown(false);
        setShowChemicalDropdown(false);
        setShowStandardDropdown(false);






        //---------------------------------------------------
        // Expand first parameter
        //---------------------------------------------------

        if (restoredParams.length > 0) {
            setExpandedParameterId(restoredParams[0].id);
        }


        //---------------------------------------------------
        // Restore Preparation Engine
        //---------------------------------------------------

        setTimeout(() => {

            restoredParams.forEach(param => {

                // console.log(
                //     "Preparation Ref:",
                //     param.id,
                //     preparationRefs.current[param.id]
                // );

                // Restore preparation module
                preparationRefs.current[param.id]?.restoreFromWorksheet(param);

            });

        }, 100);


    };
    const handleAddParameter = (param: SampleData) => {

        // Prevent duplicate parameter
        if (
            addedParameters.some(
                p => p.paraCode === param.paraCode
            )
        )
            return;

        const parameter: ParameterDetail = {

            // id: Date.now(),
            id: Math.floor(Math.random() * 1000000),

            paraCode: param.paraCode,
            parameterName: param.parameter,

            methodCode: param.methodCode,
            methodName: param.methodName,

            status: "CREATED",

            analyzedBy: null,
            analyzedByName: null,

            approvedByReviewer: null,
            approvedByReviewerName: null,

            approvedByQA: null,
            approvedByQAName: null,

            approvedAtReviewer: null,
            approvedAtQA: null,

            analysisStartDate: null,
            analysisObservationDate: null,
            analysisCompletionDate: null,

            preparationCompletedBy: null,
            preparationCompletedAt: null,

            submittedQaBy: null,
            submittedQaByName: null,

            remarksByAnalyst: null,
            remarksByReviewer: null,
            remarksByQA: null,

            additional_info: null,
            other_info: null,

            showAdditionalInfo: false,
            showInternalStandardPreparation: false,

            instruments: [],
            chemicals: [],
            standards: [],
            internalStandards: [],
            media: [],

            preparations: [],
            calculations: [],
            files: []

        };

        setPendingParameter(parameter);

        setShowAnalystDialog(true);


    };

    const handleAnalystSelected = (

        employeeId: string,
        employeeName: string

    ) => {

        if (!pendingParameter)
            return;

        const parameter = {

            ...pendingParameter,

            analyzedBy: employeeId,

            analyzedByName: employeeName

        };

        setAddedParameters(prev => [

            ...prev,

            parameter

        ]);

        // NEW
        setParameterStatusPerParam(prev => ({
            ...prev,
            [parameter.id]: "Created"
        }));

        setPendingParameter(null);

        setShowAnalystDialog(false);

    };
    const [addedChemicals, setAddedChemicals] = useState<Record<number, WorksheetChemical[]>>({});
    const [showChemicalDropdown, setShowChemicalDropdown] = useState(false);
    const [chemicalSearch, setChemicalSearch] = useState("");
    const chemicalRef = useRef<HTMLDivElement>(null);
    const [addedInstruments, setAddedInstruments] = useState<Record<number, WorksheetInstrument[]>>({});
    const [addedStandards, setAddedStandards] = useState<Record<number, WorksheetStandard[]>>({});
    const [showStandardDropdown, setShowStandardDropdown] = useState(false);
    const [standardSearch, setStandardSearch] = useState("");
    const standardRef = useRef<HTMLDivElement>(null);
    const [showParamFiles, setShowParamFiles] = useState<Record<number, boolean>>({});
    const handleRemoveInstrument = (
        parameterId: number,
        instrumentId: string
    ) => {

        setAddedInstruments(prev => ({

            ...prev,

            [parameterId]: (prev[parameterId] || []).filter(
                inst => inst.instrumentId !== instrumentId
            )

        }));

    };
    const searchFilteredStandards = standards.filter(s =>
        s.name
            .toLowerCase()
            .includes(standardSearch.toLowerCase())
    );
    const searchFilteredChemicals = chemicals.filter(c =>
        (c.name ?? "")
            .toLowerCase()
            .includes(chemicalSearch.toLowerCase())
    );
    const handleAddStandard = (
        standard: WorksheetStandard
    ) => {

        setAddedStandards(prev => ({

            ...prev,

            [standard.parameterId]: [

                ...(prev[standard.parameterId] || []),

                standard

            ]

        }));

        setShowStandardDropdown(false);

        setStandardSearch("");

    };
    const [showInstrumentDropdown, setShowInstrumentDropdown] =
        useState(false);
    const [instrumentSearch, setInstrumentSearch] =
        useState("");
    const instrumentRef = useRef<HTMLDivElement>(null);
    const isReferenceDataLoading = false;
    const referenceDataError = "";
    const searchFilteredInstruments = instruments.filter(i =>
        (i.name ?? "")
            .toLowerCase()
            .includes(instrumentSearch.toLowerCase())
    );
    const formatDate = (date: string | null) => {

        if (!date)
            return "-";

        return new Date(date).toLocaleDateString();

    };
    const handleAddInstrument = (instrument: WorksheetInstrument) => {
        const normalized: WorksheetInstrument = {
            ...instrument,
            calibrationDoneDate: instrument.calibrationDoneDate ? formatDate(instrument.calibrationDoneDate) : instrument.calibrationDoneDate,
            calibrationDueDate: instrument.calibrationDueDate ? formatDate(instrument.calibrationDueDate) : instrument.calibrationDueDate,
        };
        setAddedInstruments((prev) => ({
            ...prev,
            [instrument.parameterId]: [...(prev[instrument.parameterId] || []), normalized],
        }));
        setShowInstrumentDropdown(false);
        setInstrumentSearch("");
    };
    const handleAddChemical = (chemical: WorksheetChemical) => {

        setAddedChemicals(prev => ({

            ...prev,

            [chemical.parameterId]: [

                ...(prev[chemical.parameterId] || []),

                chemical

            ]

        }));

        setShowChemicalDropdown(false);

        setChemicalSearch("");

    };
    const handleRemoveChemical = (
        parameterId: number,
        chemicalId: string
    ) => {

        setAddedChemicals(prev => ({

            ...prev,

            [parameterId]: (prev[parameterId] || []).filter(

                c => c.slno !== chemicalId

            )

        }));

    };
    const handleRemoveStandard = (
        parameterId: number,
        standardId: string
    ) => {
        setAddedStandards(prev => ({
            ...prev,
            [parameterId]: (prev[parameterId] || []).filter(
                s => s.serialNo !== standardId
            )
        }));
    };

    // Buffer Preparation Handlers
    const createNewBufferPreparation = (index: number): BufferPreparationModel => ({
        // id: Date.now() + index,
        id: Math.floor(Math.random() * 1000000),
        label: `Buffer Preparation ${index + 1}`,
        steps: [
            {
                name: "Weighing/Measuring",
                value1: "",
                unit1: "g",
                logBookID: "",
                solventChemical: "",
            },
            { name: "PH", value1: "", unit1: "", logBookID: "" },
        ],
    });
    const handleAddBufferPreparation = (parameterId: number) => {
        setBufferPreparationPerParam((prev) => {
            const current = prev[parameterId] || [];
            return {
                ...prev,
                [parameterId]: [...current, createNewBufferPreparation(current.length)],
            };
        });
    };

    const handleRemoveBufferPreparation = (
        parameterId: number,
        bufferPrepId: number,
    ) => {
        setBufferPreparationPerParam((prev) => {
            const updated = (prev[parameterId] || [])
                .filter((bp) => bp.id !== bufferPrepId)
                .map((bp, i) => ({ ...bp, label: `Buffer Preparation ${i + 1}` }));
            return { ...prev, [parameterId]: updated };
        });
    };

    const handleBufferPreparationStepChange = (
        parameterId: number,
        bufferPrepId: number,
        stepName: string,
        field: "value1" | "unit1" | "logBookID" | "solventChemical",
        newValue: string,
    ) => {
        setBufferPreparationPerParam((prev) => ({
            ...prev,
            [parameterId]: (prev[parameterId] || []).map((bp) => {
                if (bp.id !== bufferPrepId) return bp;
                return {
                    ...bp,
                    steps: bp.steps.map((step) =>
                        step.name === stepName ? { ...step, [field]: newValue } : step,
                    ),
                };
            }),
        }));
    };
    const [mobilePhasePerParam, setMobilePhasePerParam] = useState<Record<number, MobilePhasePreparation[]>>({});
    const [showMobilePhasePreparation, setShowMobilePhasePreparation] = useState<Record<number, boolean>>({});
    const [showMobilePhaseDialog, setShowMobilePhaseDialog] = useState<Record<number, boolean>>({});
    const [editingMobilePhasePrepId, setEditingMobilePhasePrepId] = useState<string | null>(null);
    const handleAddMobilePhase = (parameterId: number) => {
        setShowMobilePhaseDialog((prev) => ({ ...prev, [parameterId]: true }));
        setEditingMobilePhasePrepId(null);
    };
    const handleEditMobilePhase = (parameterId: number, id: string) => {
        setEditingMobilePhasePrepId(id);
        setShowMobilePhaseDialog((prev) => ({ ...prev, [parameterId]: true }));
    };
    const handleSaveMobilePhase = (
        parameterId: number,
        _label: string,
        content: string,
    ) => {
        if (editingMobilePhasePrepId) {
            setMobilePhasePerParam((prev) => ({
                ...prev,
                [parameterId]: (prev[parameterId] || []).map((mp) =>
                    mp.id === editingMobilePhasePrepId ? { ...mp, content } : mp,
                ),
            }));
        } else {
            setMobilePhasePerParam((prev) => {
                const current = prev[parameterId] || [];
                const newItem: MobilePhasePreparation = {
                    id: String(Date.now()),
                    label: `Mobile Phase Preparation ${current.length + 1}`,
                    content,
                };
                return { ...prev, [parameterId]: [...current, newItem] };
            });
        }
        setShowMobilePhaseDialog((prev) => ({ ...prev, [parameterId]: false }));
        setEditingMobilePhasePrepId(null);
    };
    const handleRemoveMobilePhase = (
        parameterId: number,
        mobilePhaseId: string,
    ) => {
        setMobilePhasePerParam((prev) => {
            const updated = (prev[parameterId] || [])
                .filter((mp) => mp.id !== mobilePhaseId)
                .map((mp, index) => ({
                    ...mp,
                    label: `Mobile Phase Preparation ${index + 1}`,
                }));
            return { ...prev, [parameterId]: updated };
        });
    };
    const [showDiluentPreparation, setShowDiluentPreparation] = useState<Record<number, boolean>>({});
    const [diluentPreparationsPerParam, setDiluentPreparationsPerParam] = useState<Record<number, DiluentPreparation[]>>({});
    const [showDiluentPrepDialog, setShowDiluentPrepDialog] = useState<Record<number, boolean>>({});
    const [editingDiluentPrepId, setEditingDiluentPrepId] = useState<string | null>(null);
    const handleAddDiluentPreparation = (parameterId: number) => {
        setShowDiluentPrepDialog(prev => ({
            ...prev,
            [parameterId]: true
        }));

        setEditingDiluentPrepId(null);
    };
    const handleEditDiluentPreparation = (
        parameterId: number,
        id: string
    ) => {
        setEditingDiluentPrepId(id);

        setShowDiluentPrepDialog(prev => ({
            ...prev,
            [parameterId]: true
        }));
    };
    const handleSaveDiluentPreparation = (
        parameterId: number,
        _label: string,
        content: string
    ) => {

        if (editingDiluentPrepId) {

            setDiluentPreparationsPerParam(prev => ({
                ...prev,
                [parameterId]: (prev[parameterId] || []).map(dp =>
                    dp.id === editingDiluentPrepId
                        ? { ...dp, content }
                        : dp
                )
            }));

        } else {

            setDiluentPreparationsPerParam(prev => {

                const current = prev[parameterId] || [];

                const newItem: DiluentPreparation = {

                    id: String(Date.now()),

                    label: `Diluent Preparation ${current.length + 1}`,

                    content

                };

                return {

                    ...prev,

                    [parameterId]: [...current, newItem]

                };

            });

        }

        setShowDiluentPrepDialog(prev => ({
            ...prev,
            [parameterId]: false
        }));

        setEditingDiluentPrepId(null);

    };
    const handleRemoveDiluentPreparation = (
        parameterId: number,
        diluentId: string
    ) => {

        setDiluentPreparationsPerParam(prev => {

            const updated = (prev[parameterId] || [])
                .filter(d => d.id !== diluentId)
                .map((d, index) => ({
                    ...d,
                    label: `Diluent Preparation ${index + 1}`
                }));

            return {
                ...prev,
                [parameterId]: updated
            };

        });

    };
    const reloadWorksheet = async () => {

        if (!worksheetId)
            return;

        setIsLoading(true);

        setError(null);

        try {

            const requestData: FetchWorksheetRequest = {

                employeeId,

                role

            };

            const worksheetData =
                await fetchWorksheetById(
                    worksheetId,
                    requestData
                );

            if (!worksheetData) {

                setError("Worksheet not found");

                return;

            }

            setWorksheetInfo(worksheetData);

            setRegistrationNo(
                worksheetData.sample.registrationNo
            );

            const request: SmapleDetailsRequest = {

                regNo: worksheetData.sample.registrationNo,

                lab: department

            };

            const samples =

                await fetchSample(request);

            setSamplesData(samples);

            restoreWorksheetToState(worksheetData);

            // setTimeout(() => {

            //     worksheetData.parameters.forEach(parameter => {

            //         const draft = parameter.preparationDraft;

            //         if (!draft)
            //             return;

            //         preparationRefs.current[parameter.id]?.loadDraft(draft);

            //     });

            // }, 0);

        }
        catch (err: any) {

            setError(
                err.message ??
                "Failed to load worksheet"
            );

        }
        finally {

            setIsLoading(false);

        }

    };
    const [isSaving, setIsSaving] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [displayStatus, setDisplayStatus] = useState<string>("");

    const [showSubmitDialog, setShowSubmitDialog] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);


    useEffect(() => {

        reloadWorksheet();

    }, [worksheetId]);

    const areAllParametersApproved = (): boolean => {
        if (addedParameters.length === 0) {
            return false;
        }

        return addedParameters.every((param) => {
            const status = (
                parameterStatusPerParam[param.id] ||
                param.status ||
                "created"
            ).toLowerCase();

            return status === "approved";
        });
    };

    // ============================================================
    // DISPLAY STATUS
    // Mirrors the Drug worksheet workflow.
    //
    // The database/sample status intentionally remains
    // "Submitted For Analysis" until the Reviewer submits the
    // worksheet for QA. The UI status changes to "Pending QA
    // Submission" when every parameter has been Reviewer-approved.
    // ============================================================
    const computeDisplayStatus = useCallback(() => {
        if (!worksheetInfo) return;

        const currentStatus = worksheetInfo.sample.status;

        if (currentStatus === "Submitted For Analysis") {
            const allStatuses = Object.values(parameterStatusPerParam);

            if (allStatuses.length > 0) {
                const allCompleted = allStatuses.every(
                    (status) =>
                        status === "Analysis Completed" ||
                        status === "Approved"
                );

                if (allCompleted) {
                    const allReviewerApproved = addedParameters.every(
                        (param) =>
                            (
                                parameterStatusPerParam[param.id] ||
                                param.status ||
                                ""
                            ).toLowerCase() === "approved"
                    );

                    if (allReviewerApproved) {
                        setDisplayStatus("Pending QA Submission");
                        return;
                    }

                    setDisplayStatus("Pending For Review");
                    return;
                }
            }
        }

        if (currentStatus === "Submitted For QA Review") {
            setDisplayStatus("Pending QA Validation");
            return;
        }

        setDisplayStatus(currentStatus);
    }, [worksheetInfo, parameterStatusPerParam, addedParameters]);

    useEffect(() => {
        computeDisplayStatus();
    }, [computeDisplayStatus]);

    useEffect(() => {
        props.onSidebarStateChange?.({
            worksheetId,
            registrationNo,
            sampleName:
                worksheetInfo?.sample?.sampleName ?? "",
            worksheetStatus:
                worksheetInfo?.sample?.status ?? null,
            role,
            isContentLoading: isLoading,
            displayStatus:
                displayStatus || worksheetInfo?.sample?.status || "",

            // Keep Save to Draft available until the worksheet is finally approved.
            showSaveDraft:
                worksheetInfo?.sample?.status !== "Approved",

            // After the initial submission, only show Submit for Analysis again
            // when there are newly-created parameters that still need analysis.
            showSubmitForAnalysis:
                role === "Reviewer" &&
                (
                    worksheetInfo?.sample?.status === "Draft" ||
                    worksheetInfo?.sample?.status === "Submitted For Analysis"
                ) &&
                addedParameters.some((param) => {
                    const status = (
                        parameterStatusPerParam[param.id] ||
                        param.status ||
                        "created"
                    ).toLowerCase();

                    return status === "created";
                }),

            // Submit for QA Review must NOT appear immediately after
            // Submit for Analysis. It becomes available only after every
            // parameter has been approved by the Reviewer.
            showSubmitForQA:
                role === "Reviewer" &&
                worksheetInfo?.sample?.status ===
                "Submitted For Analysis" &&
                areAllParametersApproved(),

            showApproveWorksheet:
                role === "QA" &&
                worksheetInfo?.sample?.status ===
                "Submitted For QA Review",

            showPrintReport:
                worksheetInfo?.sample?.status === "Approved",

            isSaving: false,

            saveSuccess: false,

            isSubmitting,

            isSubmittingForQA: false,

            isApprovingWorksheet: false,

            includeAuditTrail: false

        });

    }, [
        worksheetId,
        registrationNo,
        worksheetInfo,
        role,
        isLoading,
        addedParameters,
        parameterStatusPerParam,
        displayStatus,
        isSubmitting,
        props.onSidebarStateChange
    ]);

    useEffect(() => {

        const loadAnalysts = async () => {

            try {

                const result = await fetchAnalysts();

                setAnalysts(result);

            }
            catch (err) {

                console.error(err);

            }

        };

        loadAnalysts();

    }, []);


    const availableToAdd = (samplesData ?? []).filter(
        (param) =>
            !addedParameters.find(
                (added) => added.paraCode === param.paraCode
            )
    );
    const selectedParameter =
        expandedParameterId === null
            ? null
            : addedParameters.find(
                p => p.id === expandedParameterId
            ) ?? null;

    // Always use the latest per-parameter status when it exists.
    // This is important after "Submit for Analysis", because the
    // parameter status can be updated in parameterStatusPerParam
    // before addedParameters is refreshed.
    // Always resolve the Analyst comment from the latest available source.
    // The per-parameter state is preferred because it is updated immediately
    // after Complete Analysis; API aliases are used after a fresh Reviewer load.
    const getAnalystComment = (parameter: any): string | null => {
        if (!parameter) return null;

        const value =
            remarksByAnalystPerParam[parameter.id] ??
            parameter.remarksByAnalyst ??
            parameter.remarks_by_analyst ??
            parameter.analystComment ??
            parameter.analyst_comment ??
            parameter.analysisRemarks ??
            parameter.analysis_remarks ??
            null;

        return typeof value === "string" && value.trim()
            ? value.trim()
            : null;
    };

    const selectedParameterAnalysisStatus =
        selectedParameter
            ? (
                parameterStatusPerParam[selectedParameter.id] ||
                selectedParameter.status ||
                ""
            )
            : "";

    const normalizeStatus = (status?: string | null) =>
        (status ?? "")
            .trim()
            .toLowerCase()
            .replace(/_/g, " ")
            .replace(/-/g, " ");

    const isAnalysisLockedStatus = (status?: string | null) => {
        const normalized = normalizeStatus(status);

        return [
            "analysis pending",
            "analysis completed",
            "analysis revision",
            "analysis revision started",
            "approved",
        ].includes(normalized);
    };

    // ============================================================
    // ANALYST COMPLETE-ANALYSIS LOCK
    // ============================================================
    // Keep all existing Food preparation/calculation logic unchanged.
    // Once an Analyst completes analysis for the selected parameter,
    // the complete Food worksheet content becomes read-only.
    // Reviewer / QA behavior is not affected.
    const isAnalystAnalysisCompleted =
        role?.toLowerCase() === "analyst" &&
        normalizeStatus(selectedParameterAnalysisStatus) ===
        "analysis completed";

    const normalizedSelectedStatus =
        normalizeStatus(selectedParameterAnalysisStatus);

    const isAnalystRevision =
        role?.toLowerCase() === "analyst" &&
        (
            normalizedSelectedStatus === "analysis revision" ||
            normalizedSelectedStatus === "analysis revision started"
        );

    const isAnalystRevisionStarted =
        isAnalystRevision &&
        (
            normalizedSelectedStatus === "analysis revision started" ||
            (selectedParameter
                ? revisionStartedParams.has(selectedParameter.id)
                : false)
        );

    const isAnalysisLocked =
        selectedParameter
            ? isAnalysisLockedStatus(selectedParameterAnalysisStatus)
            : false;

    // During "Analysis Revision" the Analyst remains completely readonly.
    // Once "Start Revision" is clicked, the revision-started state explicitly
    // overrides the analysis lock so every Food control can be edited again.
    const isPreparationLocked =
        selectedParameter
            ? (
                !isAnalystRevisionStarted &&
                (
                    preparationLockedPerParam[selectedParameter.id] === true ||
                    isAnalysisLocked
                )
            )
            : false;

    // Preparation can be unlocked by the Reviewer during the normal
    // Created workflow, and by the Analyst after Start Revision.
    // During "Analysis Revision" the Analyst remains locked; once
    // "Start Revision" changes the status to "Analysis Revision Started",
    // the existing Unlock Preparation control must become enabled.
    const canUnlockPreparation =
        (
            role?.toLowerCase() === "reviewer" &&
            normalizedSelectedStatus === "created"
        ) ||
        (
            role?.toLowerCase() === "analyst" &&
            isAnalystRevisionStarted
        );

    const canEditCalculations =
        // Reviewer can edit calculations after parameter unlock
        (
            role?.toLowerCase() === "reviewer" &&
            normalizedSelectedStatus === "created"
        ) ||

        // Analyst can edit calculations while analysis is in progress
        (
            role?.toLowerCase() === "analyst" &&
            (
                normalizedSelectedStatus === "analysis started" ||
                isAnalystRevisionStarted
            )
        );

    const handleInitiateUnlock = (parameter: ParameterDetail) => {
        setParameterToUnlock(parameter);
        setShowUnlockDialog(true);
    };

    const handleConfirmUnlock = async () => {
        if (!parameterToUnlock)
            return;

        setIsUnlocking(true);

        try {
            const updatedParameter: ParameterDetail = {
                ...parameterToUnlock,
                status: "created"
            };

            const response = await updateParameter(
                parameterToUnlock.id,
                updatedParameter
            );

            if (response?.parameterId) {

                if (!worksheetInfo) {
                    throw new Error(
                        "Worksheet information is not available."
                    );
                }

                const currentWorksheetInfo: WorksheetDetail = worksheetInfo;

                const worksheetData = collectFormDataForAPI({
                    role,
                    worksheetInfo: currentWorksheetInfo,
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
                });

                const updatedWorksheetData = {
                    ...worksheetData,

                    parameters: worksheetData.parameters?.map(param =>
                        param.id === parameterToUnlock.id
                            ? {
                                ...param,
                                status: "created"
                            }
                            : param
                    ),

                    documentInfo: {
                        ...worksheetData.documentInfo,
                        status: "Draft"
                    }
                };

                const worksheetResponse = await updateWorksheet(
                    worksheetId,
                    updatedWorksheetData
                );

                if (!worksheetResponse?.worksheetId) {
                    throw new Error(
                        "Parameter unlocked, but worksheet could not be returned to Draft."
                    );
                }

                setParameterStatusPerParam(prev => ({
                    ...prev,
                    [parameterToUnlock.id]: "created"
                }));

                setAddedParameters(prev =>
                    prev.map(parameter =>
                        parameter.id === parameterToUnlock.id
                            ? updatedParameter
                            : parameter
                    )
                );

                setPreparationLockedPerParam(prev => ({
                    ...prev,
                    [parameterToUnlock.id]: true
                }));

                setWorksheetInfo(prev =>
                    prev
                        ? {
                            ...prev,
                            sample: {
                                ...prev.sample,
                                status: "Draft"
                            }
                        }
                        : null
                );

                await insertWorksheetLog({
                    worksheetId,
                    action: "Parameter Unlocked",
                    remarks:
                        `Parameter ${parameterToUnlock.parameterName} unlocked and worksheet returned to Draft`,
                    employeeId,
                    role
                });

                setToastMessage(
                    "Parameter unlocked successfully!"
                );

                setToastType("success");
                setShowToast(true);

                setShowUnlockDialog(false);
                setParameterToUnlock(null);

                setTimeout(() => {
                    setShowToast(false);
                }, 4000);

            } else {
                throw new Error(
                    "Failed to unlock parameter!"
                );
            }

        } catch (error: any) {

            setToastMessage(
                `Error unlocking parameter: ${error?.message || error}`
            );

            setToastType("error");
            setShowToast(true);

            setTimeout(() => {
                setShowToast(false);
            }, 4000);

        } finally {
            setIsUnlocking(false);
        }
    };

    const handleDeleteParameter = async () => {

        if (!parameterToDelete)
            return;

        try {

            setIsDeleting(true);

            // TODO:
            // await deleteParameter(parameterToDelete.id);

            // setAddedParameters(prev =>
            //     prev.filter(p => p.id !== parameterToDelete.id)
            // );

            setAddedParameters(prev => {
                const updated = prev.filter(p => p.id !== parameterToDelete.id);

                // console.log("Before:", prev.length);
                // console.log("After :", updated.length);

                return updated;
            });

            if (expandedParameterId === parameterToDelete.id)
                setExpandedParameterId(null);

            setShowDeleteDialog(false);

            setParameterToDelete(null);

        }
        finally {

            setIsDeleting(false);

        }

    };
    const [systemSuitabilityPerParam, setSystemSuitabilityPerParam] = useState<Record<number, SystemSuitability[]>>({});
    const [showSystemSuitability, setShowSystemSuitability] = useState<Record<number, boolean>>({});
    const createNewSystemSuitability = (
        index: number
    ): SystemSuitability => ({
        // id: Date.now() + index,
        id: Math.floor(Math.random() * 1000000),
        label: `System Suitability ${index + 1}`,
        steps: [
            { name: "RSD Area", value1: "", value2: "", value3: "", value4: "" },
            { name: "RSD Retention time", value1: "", value2: "", value3: "", value4: "" },
            { name: "Tailing factor", value1: "", value2: "", value3: "", value4: "" },
            { name: "Resolution", value1: "", value2: "", value3: "", value4: "" },
            { name: "Theorital Plate count", value1: "", value2: "", value3: "", value4: "" },
            { name: "Peak to Valley ratio", value1: "", value2: "", value3: "", value4: "" },
        ],
    });
    const handleAddSystemSuitability = (parameterId: number) => {

        setSystemSuitabilityPerParam(prev => {

            const current = prev[parameterId] || [];

            return {

                ...prev,

                [parameterId]: [
                    ...current,
                    createNewSystemSuitability(current.length)
                ]

            };

        });

    };
    const handleRemoveSystemSuitability = (
        parameterId: number,
        suitabilityId: number
    ) => {

        setSystemSuitabilityPerParam(prev => {

            const updated = (prev[parameterId] || [])
                .filter(ss => ss.id !== suitabilityId)
                .map((ss, index) => ({

                    ...ss,

                    label: `System Suitability ${index + 1}`

                }));

            return {

                ...prev,

                [parameterId]: updated

            };

        });

    };
    const handleSystemSuitabilityStepChange = (

        parameterId: number,

        suitabilityId: number,

        stepName: string,

        field: "value1" | "value2" | "value3" | "value4",

        newValue: string

    ) => {

        setSystemSuitabilityPerParam(prev => ({

            ...prev,

            [parameterId]: (prev[parameterId] || []).map(ss => {

                if (ss.id !== suitabilityId)
                    return ss;

                return {

                    ...ss,

                    steps: ss.steps.map(step =>

                        step.name === stepName

                            ? {
                                ...step,
                                [field]: newValue
                            }

                            : step

                    )

                };

            })

        }));

    };

    const handleAddSystemSuitabilityStep = (
        parameterId: number,
        suitabilityId: number,
        stepName: string,
        limitType?: string
    ) => {
        setSystemSuitabilityPerParam(prev => ({
            ...prev,
            [parameterId]: (prev[parameterId] || []).map(ss => {
                if (ss.id !== suitabilityId)
                    return ss;

                const exists = ss.steps.some(
                    s => s.name === stepName
                );

                if (exists)
                    return ss;

                return {
                    ...ss,
                    steps: [
                        ...ss.steps,
                        {
                            name: stepName,
                            limitType: limitType,
                            value1: "",
                            value2: "",
                            value3: "",
                            value4: "",
                        } as SystemSuitabilityStep,
                    ],
                };
            }),
        }));
    };

    const handleRemoveSystemSuitabilityStep = (
        parameterId: number,
        suitabilityId: number,
        stepName: string
    ) => {
        setSystemSuitabilityPerParam(prev => ({
            ...prev,
            [parameterId]: (prev[parameterId] || []).map(ss => {
                if (ss.id !== suitabilityId)
                    return ss;

                return {
                    ...ss,
                    steps: ss.steps.filter(step => step.name !== stepName)
                };
            })
        }));
    };
    const [filesPerParam, setFilesPerParam] =
        useState<
            Record<
                number,
                Record<string, AttachedFile[]>
            >
        >({});

    const prepFileKey = (
        type: string | null,
        label: string | null
    ) => `${type ?? ""}|${label ?? ""}`;

    const PARAM_LEVEL_KEY = "param_level";

    const getFilesForPrep = (
        paramId: number,
        type: string | null,
        label: string | null
    ): AttachedFile[] =>
        (filesPerParam[paramId] ?? {})[
        prepFileKey(type, label)
        ] ?? [];

    const getParamLevelFiles = (
        paramId: number
    ): AttachedFile[] =>
        (filesPerParam[paramId] ?? {})[
        PARAM_LEVEL_KEY
        ] ?? [];

    const updateFilesForSlot = (
        paramId: number,
        slotKey: string,
        updater: (prev: AttachedFile[]) => AttachedFile[]
    ) => {
        setFilesPerParam(prev => ({
            ...prev,
            [paramId]: {
                ...(prev[paramId] ?? {}),
                [slotKey]: updater(
                    (prev[paramId] ?? {})[slotKey] ?? []
                )
            }
        }));
    };

    const handleAddParamFiles = (
        paramId: number,
        newFiles: AttachedFile[]
    ) => {
        updateFilesForSlot(
            paramId,
            PARAM_LEVEL_KEY,
            prev => [...prev, ...newFiles]
        );
    };

    const handleRemoveParamFile = (
        paramId: number,
        index: number
    ) => {
        updateFilesForSlot(
            paramId,
            PARAM_LEVEL_KEY,
            prev => prev.filter((_, i) => i !== index)
        );
    };



    // Copy Instruments / Reagents & Chemicals / Standards from another worksheet
    const handleImportFromWorksheet = (
        paramId: number,
        data: {
            instruments: WorksheetInstrument[];
            chemicals: WorksheetChemical[];
            standards: WorksheetStandard[];
        },
    ) => {
        if (!paramId) return;

        if (data.instruments.length > 0) {
            setAddedInstruments((prev) => {
                const existingIds = new Set(
                    (prev[paramId] || []).map((i) => i.instrumentId),
                );
                const toAdd = data.instruments.filter(
                    (i) => !existingIds.has(i.instrumentId),
                );
                return { ...prev, [paramId]: [...(prev[paramId] || []), ...toAdd] };
            });
        }

        if (data.chemicals.length > 0) {
            setAddedChemicals((prev) => {
                const existingIds = new Set((prev[paramId] || []).map((c) => c.slno));
                const toAdd = data.chemicals.filter((c) => !existingIds.has(c.slno));
                return { ...prev, [paramId]: [...(prev[paramId] || []), ...toAdd] };
            });
        }

        if (data.standards.length > 0) {
            setAddedStandards((prev) => {
                const existingIds = new Set(
                    (prev[paramId] || []).map((s) => s.serialNo),
                );
                const toAdd = data.standards.filter(
                    (s) => !existingIds.has(s.serialNo),
                );
                return { ...prev, [paramId]: [...(prev[paramId] || []), ...toAdd] };
            });
        }

        setToastMessage("Details copied from worksheet successfully");
    };


    const parametersWithPreparation = addedParameters.map(parameter => ({

        ...parameter,

        preparationDraft:
            preparationRefs.current[parameter.id]?.collectDraft()

    }));



    const _saveDraftRef = useRef(() => { });
    const _printRef = useRef(() => { });
    const _submitAnalysisRef = useRef(() => { });
    const _submitQARef = useRef(() => { });
    const _approveRef = useRef(() => { });

    const handleStartRevision = async (parameter: ParameterDetail) => {
        if (role.toLowerCase() !== "analyst") return;

        const parameterId = parameter.id;
        const revisionStartDate = new Date().toISOString();

        // Optimistically unlock immediately, exactly like the Drug worksheet.
        setRevisionStartedParams(prev => {
            const next = new Set(prev);
            next.add(parameterId);
            return next;
        });

        setParameterStatusPerParam(prev => ({
            ...prev,
            [parameterId]: "Analysis Revision Started"
        }));

        setAddedParameters(prev =>
            prev.map(param =>
                param.id === parameterId
                    ? {
                        ...param,
                        status: "Analysis Revision Started",
                        revisionStartDate
                    }
                    : param
            )
        );

        try {
            const updatedParam = {
                ...parameter,
                status: "Analysis Revision Started",
                revisionStartDate
            };

            const response = await updateParameter(parameterId, updatedParam);

            if (!response?.parameterId) {
                throw new Error("Failed to start revision.");
            }

            await insertWorksheetLog({
                worksheetId,
                parameterId,
                action: "Revision Started",
                remarks: "Analyst started revision — parameter unlocked for editing",
                employeeId,
                role
            });

            setToastMessage("Revision started. Parameter is now unlocked for editing.");
            setToastType("success");
            setShowToast(true);
            setTimeout(() => setShowToast(false), 4000);
        } catch (error: any) {
            // Roll back the optimistic unlock if the API call fails.
            setRevisionStartedParams(prev => {
                const next = new Set(prev);
                next.delete(parameterId);
                return next;
            });

            setParameterStatusPerParam(prev => ({
                ...prev,
                [parameterId]: "Analysis Revision"
            }));

            setAddedParameters(prev =>
                prev.map(param =>
                    param.id === parameterId
                        ? {
                            ...param,
                            status: "Analysis Revision"
                        }
                        : param
                )
            );

            setToastMessage(
                `Failed to start revision: ${error?.message || "Unknown error"}`
            );
            setToastType("error");
            setShowToast(true);
            setTimeout(() => setShowToast(false), 4000);
        }
    };

    const handleStartAnalysis = (parameter: ParameterDetail) => {
        setParameterForAnalysis(parameter);
        setShowStartAnalysisDialog(true);
    };

    const handleConfirmStartAnalysis = async (
        parameter: ParameterDetail
    ) => {
        if (!worksheetInfo) {
            setToastMessage("Worksheet information is not available.");
            setToastType("error");
            setShowToast(true);
            return;
        }

        if (role.toLowerCase() !== "analyst") {
            return;
        }

        try {
            setIsStartingAnalysis(true);

            const worksheetData = collectFormDataForAPI({
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
            });

            const analysisStartDate = new Date().toISOString();

            const updatedWorksheetData = {
                ...worksheetData,

                parameters:
                    worksheetData.parameters?.map(param => {

                        if (param.id !== parameter.id) {
                            return param;
                        }

                        return {
                            ...param,

                            status: "Analysis Started",

                            analyzedBy:
                                param.analyzedBy ??
                                parameter.analyzedBy ??
                                employeeId,

                            analyzedByName:
                                param.analyzedByName ??
                                parameter.analyzedByName,

                            analysisStartDate
                        };
                    }),

                documentInfo: {
                    ...worksheetData.documentInfo,

                    // Worksheet remains submitted while analyst
                    // performs the analysis.
                    status: "Submitted For Analysis"
                }
            };

            const response = await updateWorksheet(
                worksheetId,
                updatedWorksheetData
            );

            if (!response?.worksheetId) {
                throw new Error(
                    "Failed to start analysis."
                );
            }

            // ---------------------------------------------------------
            // Update parameter status locally
            // ---------------------------------------------------------

            setParameterStatusPerParam(prev => ({
                ...prev,
                [parameter.id]: "Analysis Started"
            }));

            setAddedParameters(prev =>
                prev.map(param =>
                    param.id === parameter.id
                        ? {
                            ...param,
                            status: "Analysis Started",
                            analysisStartDate,
                            analyzedBy:
                                param.analyzedBy ??
                                parameter.analyzedBy ??
                                employeeId,
                            analyzedByName:
                                param.analyzedByName ??
                                parameter.analyzedByName
                        }
                        : param
                )
            );

            // ---------------------------------------------------------
            // IMPORTANT:
            // Analysis Started means Analyst can now edit.
            // ---------------------------------------------------------

            setPreparationLockedPerParam(prev => ({
                ...prev,
                [parameter.id]: false
            }));

            await insertWorksheetLog({
                worksheetId,
                action: "Analysis Started",
                remarks:
                    `Analysis started for parameter ${parameter.parameterName}`,
                employeeId,
                role
            });
            setShowStartAnalysisDialog(false);
            setParameterForAnalysis(null);

            setToastMessage(
                "Analysis started successfully."
            );

            setToastType("success");
            setShowToast(true);

            setTimeout(() => {
                setShowToast(false);
            }, 4000);

        } catch (error: any) {

            console.error(
                "Start Analysis error:",
                error
            );

            setToastMessage(
                `Failed to start analysis: ${error?.message || "Unknown error"
                }`
            );

            setToastType("error");
            setShowToast(true);

            setTimeout(() => {
                setShowToast(false);
            }, 4000);

        } finally {
            setIsStartingAnalysis(false);
        }
    };
    // Handle complete analysis button click
    const handleCompleteAnalysis = (param: ParameterDetail) => {
        if (!worksheetInfo) {
            setToastMessage("Worksheet information is not available.");
            setToastType("error");
            setShowToast(true);

            setTimeout(() => {
                setShowToast(false);
            }, 4000);

            return;
        }

        const currentWorksheetData = collectFormDataForAPI({
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
        });

        const curParam = currentWorksheetData.parameters?.find(
            parameter => parameter.id === param.id
        );

        setParameterForAnalysis(curParam ?? param);
        setShowCompleteAnalysisDialog(true);
    };

    const handleConfirmCompleteAnalysis = async (comment: string) => {
        if (!parameterForAnalysis) return;

        setIsCompletingAnalysis(true);

        try {
            const previousStatus = normalizeStatus(
                parameterStatusPerParam[parameterForAnalysis.id] ||
                parameterForAnalysis.status
            );

            const wasRevision =
                previousStatus === "analysis revision" ||
                previousStatus === "analysis revision started" ||
                revisionStartedParams.has(parameterForAnalysis.id);

            const completionDate = new Date().toISOString();

            const updatedParam = {
                ...parameterForAnalysis,
                status: "Analysis Completed",
                analysisCompletionDate: completionDate,
                ...(wasRevision && {
                    revisionCompletedDate: completionDate
                }),
                remarksByAnalyst: comment || null,
            };

            const response = await updateParameter(
                parameterForAnalysis.id,
                updatedParam
            );

            if (response?.parameterId) {

                // Update parameter status
                setParameterStatusPerParam(prev => ({
                    ...prev,
                    [parameterForAnalysis.id]: "Analysis Completed"
                }));

                if (wasRevision) {
                    setRevisionStartedParams(prev => {
                        const next = new Set(prev);
                        next.delete(parameterForAnalysis.id);
                        return next;
                    });
                }

                // Update parameter object
                setAddedParameters(prev =>
                    prev.map(parameter =>
                        parameter.id === parameterForAnalysis.id
                            ? {
                                ...parameter,
                                status: "Analysis Completed",
                                analysisCompletionDate: completionDate,
                                ...(wasRevision && {
                                    revisionCompletedDate: completionDate
                                }),
                                remarksByAnalyst: comment || null
                            }
                            : parameter
                    )
                );

                // Save analyst remarks in local per-parameter state as well.
                // Store an empty string when no comment was supplied so an older
                // comment cannot remain visible after a revision/completion.
                setRemarksByAnalystPerParam(prev => ({
                    ...prev,
                    [parameterForAnalysis.id]: comment || ""
                }));

                await insertWorksheetLog({
                    worksheetId,
                    parameterId: parameterForAnalysis.id,
                    action: wasRevision
                        ? "Analysis Completed After Revision"
                        : "Analysis Completed",
                    remarks: comment || (
                        wasRevision
                            ? "Analysis completed after revision"
                            : "Analysis completed"
                    ),
                    employeeId,
                    role
                });

                setToastMessage(
                    wasRevision
                        ? "Revision completed successfully! Resubmitted to Reviewer."
                        : "Analysis completed successfully! Submitted for Reviewer approval."
                );

                setToastType("success");
                setShowToast(true);

                setTimeout(() => {
                    setShowToast(false);
                }, 4000);

                setShowCompleteAnalysisDialog(false);
                setParameterForAnalysis(null);

            } else {
                throw new Error("Failed to complete analysis!");
            }

        } catch (error: any) {

            setToastMessage(
                `Error completing analysis: ${error?.message || error}`
            );

            setToastType("error");
            setShowToast(true);

            setTimeout(() => {
                setShowToast(false);
            }, 4000);

        } finally {
            setIsCompletingAnalysis(false);
        }
    };
    // ============================================================
    // REVIEWER - APPROVE / REQUEST REVISION
    // Mirrors the existing Drug worksheet workflow.
    // ============================================================

    const handleApprove = (param: ParameterDetail) => {
        setParameterForApproval(param);
        setShowApproveDialog(true);
    };

    const handleRequestRevision = (param: ParameterDetail) => {
        setParameterForApproval(param);
        setShowRevisionDialog(true);
    };

    const handleConfirmApprove = async (remarks: string) => {
        if (!parameterForApproval) return;

        setIsApproving(true);

        try {
            const updatedParam = {
                ...parameterForApproval,
                status: "Approved",
                approvedByReviewer: employeeId,
                approvedAtReviewer: new Date().toISOString(),
                remarksByReviewer: remarks || null,
            };

            const response = await updateParameter(
                parameterForApproval.id,
                updatedParam
            );

            if (response?.parameterId) {
                setParameterStatusPerParam(prev => ({
                    ...prev,
                    [parameterForApproval.id]: "Approved"
                }));

                setRemarksByReviewerPerParam(prev => ({
                    ...prev,
                    [parameterForApproval.id]: remarks || null
                }));

                setAddedParameters(prev =>
                    prev.map(parameter =>
                        parameter.id === parameterForApproval.id
                            ? {
                                ...parameter,
                                status: "Approved",
                                approvedByReviewer: employeeId,
                                approvedAtReviewer: updatedParam.approvedAtReviewer,
                                remarksByReviewer: remarks || null
                            }
                            : parameter
                    )
                );

                await insertWorksheetLog({
                    worksheetId,
                    parameterId: parameterForApproval.id,
                    action: "Parameter Approved",
                    remarks: remarks || "Parameter approved by Reviewer",
                    employeeId,
                    role
                });

                setToastMessage("Parameter approved successfully!");
                setToastType("success");
                setShowToast(true);

                setTimeout(() => {
                    setShowToast(false);
                }, 4000);

                setShowApproveDialog(false);
                setParameterForApproval(null);
            } else {
                throw new Error("Failed to approve parameter!");
            }
        } catch (error: any) {
            setToastMessage(
                `Error approving parameter: ${error?.message || error}`
            );
            setToastType("error");
            setShowToast(true);

            setTimeout(() => {
                setShowToast(false);
            }, 4000);
        } finally {
            setIsApproving(false);
        }
    };

    const handleConfirmRevision = async (comments: string) => {
        if (!parameterForApproval) return;

        setIsRequestingRevision(true);

        try {
            const updatedParam = {
                ...parameterForApproval,
                status: "Analysis Revision",
                analysisCompletionDate: new Date().toISOString(),
                revisionComments: comments,
                remarksByReviewer: comments,
            };

            const response = await updateParameter(
                parameterForApproval.id,
                updatedParam
            );

            if (response?.parameterId) {
                setParameterStatusPerParam(prev => ({
                    ...prev,
                    [parameterForApproval.id]: "Analysis Revision"
                }));

                setRemarksByReviewerPerParam(prev => ({
                    ...prev,
                    [parameterForApproval.id]: comments
                }));

                setAddedParameters(prev =>
                    prev.map(parameter =>
                        parameter.id === parameterForApproval.id
                            ? {
                                ...parameter,
                                status: "Analysis Revision",
                                analysisCompletionDate:
                                    updatedParam.analysisCompletionDate,
                                revisionComments: comments,
                                remarksByReviewer: comments
                            }
                            : parameter
                    )
                );

                await insertWorksheetLog({
                    worksheetId,
                    parameterId: parameterForApproval.id,
                    action: "Analysis Revision Requested",
                    remarks: comments || "Revision requested by Reviewer",
                    employeeId,
                    role
                });

                setToastMessage("Revision requested successfully!");
                setToastType("success");
                setShowToast(true);

                setTimeout(() => {
                    setShowToast(false);
                }, 4000);

                setShowRevisionDialog(false);
                setParameterForApproval(null);
            } else {
                throw new Error("Failed to request revision!");
            }
        } catch (error: any) {
            setToastMessage(
                `Error requesting revision: ${error?.message || error}`
            );
            setToastType("error");
            setShowToast(true);

            setTimeout(() => {
                setShowToast(false);
            }, 4000);
        } finally {
            setIsRequestingRevision(false);
        }
    };

    const handleSaveDraft = async () => {

        setIsSaving(true);
        try {

            if (!worksheetInfo) {

                setToastMessage("Worksheet not loaded.");
                setShowToast(true);

                setTimeout(() => {
                    setShowToast(false);
                }, 4000);

                return;
            }

            const worksheetData = collectFormDataForAPI({

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

            });

            // console.log(
            //     "Food Worksheet Request",
            //     JSON.stringify(worksheetData, null, 2)
            // );



            if (worksheetId) {

                const response = await updateWorksheet(
                    worksheetId,
                    worksheetData
                );

                // debugger;

                if (!response?.worksheetId) {

                    throw new Error(
                        "Worksheet draft could not be saved."
                    );

                }

            }
            else {

                const response = await createWorksheet(
                    worksheetData
                );
                // debugger;

                if (!response?.worksheetId) {

                    throw new Error(
                        "Worksheet could not be created."
                    );
                }

            }


            await reloadWorksheet();
            // debugger;
            // console.log("Showing success toast...");
            setToastMessage(
                `Draft saved successfully: ${worksheetId}`
            );

            setShowToast(true);
            setToastType("success");
            setSaveSuccess(true);

            setTimeout(() => {

                setShowToast(false);

                setSaveSuccess(false);

            }, 3000);

        }
        catch (error: any) {

            console.error("Save draft error:", error);

            setToastMessage(

                error?.message ||

                "Failed to save worksheet."

            );

            setToastType("error");

            setShowToast(true);

            setTimeout(() => {

                setShowToast(false);

            }, 4000);

        }
        finally {

            setIsSaving(false);

        }

    };
    _saveDraftRef.current = handleSaveDraft;

    const handleSubmitForAnalysis = async () => {
        setIsSubmitting(true);

        try {
            if (!worksheetInfo) {
                throw new Error("Worksheet information is not available");
            }

            const worksheetData = collectFormDataForAPI({
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
            });

            const currentWorksheetStatus =
                worksheetInfo.sample?.status;

            const createdParameters =
                worksheetData?.parameters?.filter(
                    (param) =>
                        (
                            parameterStatusPerParam[param.id] ||
                            param.status ||
                            "created"
                        ).toLowerCase() === "created"
                ) ?? [];

            if (createdParameters.length === 0) {
                setToastMessage(
                    "No parameters with 'created' status to submit"
                );

                setToastType("error");
                setShowToast(true);

                setTimeout(() => {
                    setShowToast(false);
                }, 4000);

                setIsSubmitting(false);
                setShowSubmitDialog(false);

                return;
            }

            // ---------------------------------------------------------
            // Change CREATED parameters -> ANALYSIS PENDING
            // ---------------------------------------------------------

            if (currentWorksheetStatus === "Draft") {

                const updatedWorksheetData = {
                    ...worksheetData,

                    parameters:
                        worksheetData.parameters?.map((param) => {

                            const isCreated =
                                (
                                    parameterStatusPerParam[param.id] ||
                                    param.status ||
                                    "created"
                                ).toLowerCase() === "created";

                            return {
                                ...param,
                                status: isCreated
                                    ? "Analysis Pending"
                                    : param.status
                            };
                        }),

                    documentInfo: {
                        ...worksheetData.documentInfo,
                        status: "Submitted For Analysis"
                    }
                };

                const response = await updateWorksheet(
                    worksheetId,
                    updatedWorksheetData
                );

                if (!response?.worksheetId) {
                    throw new Error(
                        "Failed to submit worksheet for analysis"
                    );
                }

                // -----------------------------------------------------
                // Update local worksheet status
                // -----------------------------------------------------

                setWorksheetInfo((prev) =>
                    prev
                        ? {
                            ...prev,
                            sample: {
                                ...prev.sample,
                                status: "Submitted For Analysis"
                            }
                        }
                        : null
                );

                // -----------------------------------------------------
                // Update local parameter statuses
                // -----------------------------------------------------

                createdParameters.forEach((param) => {

                    setParameterStatusPerParam((prev) => ({
                        ...prev,
                        [param.id]: "Analysis Pending"
                    }));

                });

                // -----------------------------------------------------
                // Keep preparation lock state synchronized immediately.
                // This prevents the lock/unlock controls from requiring
                // a page refresh after Submit For Analysis.
                // -----------------------------------------------------
                setPreparationLockedPerParam((prev) => {
                    const next = { ...prev };

                    createdParameters.forEach((param) => {
                        next[param.id] = true;
                    });

                    return next;
                });

                // ✅ ADD IT HERE
                await insertWorksheetLog({
                    worksheetId,
                    action: "Submitted For Analysis",
                    remarks: "Worksheet submitted for analysis",
                    employeeId,
                    role
                });

                // Also keep addedParameters in sync
                setAddedParameters((prev) =>
                    prev.map((param) => {

                        const isCreated =
                            (
                                parameterStatusPerParam[param.id] ||
                                param.status ||
                                "created"
                            ).toLowerCase() === "created";

                        return isCreated
                            ? {
                                ...param,
                                status: "Analysis Pending"
                            }
                            : param;
                    })
                );

                setToastMessage(
                    "Worksheet submitted for analysis successfully!"
                );

                setToastType("success");
                setShowToast(true);

                setTimeout(() => {
                    setShowToast(false);
                }, 4000);

                // -----------------------------------------------------
                // Audit log
                // -----------------------------------------------------

                // If insertWorksheetLog is already imported in FoodWorksheet
                // keep this block.
                // Otherwise add the import first.

            } else if (
                currentWorksheetStatus === "Submitted For Analysis"
            ) {

                // -----------------------------------------------------
                // Worksheet already submitted.
                // Submit newly-created parameters only.
                // -----------------------------------------------------

                for (const param of createdParameters) {

                    const response = await updateWorksheet(
                        worksheetId,
                        {
                            ...worksheetData,
                            parameters:
                                worksheetData.parameters?.map((p) =>
                                    p.id === param.id
                                        ? {
                                            ...p,
                                            status: "Analysis Pending"
                                        }
                                        : p
                                )
                        }
                    );

                    if (!response?.worksheetId) {
                        throw new Error(
                            `Failed to update parameter ${param.parameterName}`
                        );
                    }

                    setParameterStatusPerParam((prev) => ({
                        ...prev,
                        [param.id]: "Analysis Pending"
                    }));

                    setPreparationLockedPerParam((prev) => ({
                        ...prev,
                        [param.id]: true
                    }));
                }

                setAddedParameters((prev) =>
                    prev.map((param) =>
                        createdParameters.some(
                            (created) => created.id === param.id
                        )
                            ? {
                                ...param,
                                status: "Analysis Pending"
                            }
                            : param
                    )
                );

                setToastMessage(
                    "Parameters submitted for analysis successfully!"
                );

                setToastType("success");
                setShowToast(true);

                setTimeout(() => {
                    setShowToast(false);
                }, 4000);
            }

            setShowSubmitDialog(false);

        } catch (error: any) {

            console.error(
                "Submit for Analysis error:",
                error
            );

            setToastMessage(
                `Failed to submit: ${error?.message || "Unknown error"
                }`
            );

            setToastType("error");
            setShowToast(true);

            setTimeout(() => {
                setShowToast(false);
            }, 4000);

        } finally {

            setIsSubmitting(false);
        }
    };
    _submitAnalysisRef.current = () =>
        setShowSubmitDialog(true);
    useEffect(() => {

        props.onSidebarActionsReady?.({

            onBack: () => window.history.back(),

            onSaveDraft: () => _saveDraftRef.current(),

            onSubmitForAnalysis: () =>
                _submitAnalysisRef.current(),

            onSubmitForQA: () =>
                _submitQARef.current(),

            onApproveWorksheet: () =>
                _approveRef.current(),

            onPrintReport: () =>
                _printRef.current(),

            onContentReady: () => { },

            onToggleAuditTrail: () => { }

        });

    }, []);



    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    className="relative"
                >
                    {/* Animated Background Circles */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <motion.div
                            animate={{
                                scale: [1, 1.2, 1],
                                opacity: [0.3, 0.1, 0.3],
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: "easeInOut",
                            }}
                            className="absolute w-64 h-64 rounded-full bg-emerald-500/20 blur-3xl"
                        />

                        <motion.div
                            animate={{
                                scale: [1, 1.3, 1],
                                opacity: [0.2, 0.05, 0.2],
                            }}
                            transition={{
                                duration: 2.5,
                                repeat: Infinity,
                                ease: "easeInOut",
                                delay: 0.5,
                            }}
                            className="absolute w-80 h-80 rounded-full bg-emerald-600/10 blur-3xl"
                        />
                    </div>

                    <div className="relative overflow-hidden bg-gradient-to-br from-emerald-700 via-emerald-800 to-slate-900 rounded-2xl shadow-2xl border border-emerald-700/40 p-12 min-w-[400px]">

                        {/* Dot texture */}
                        <div
                            className="absolute inset-0 opacity-[0.04] pointer-events-none"
                            style={{
                                backgroundImage:
                                    "radial-gradient(rgba(255,255,255,.8) 1px, transparent 1px)",
                                backgroundSize: "18px 18px",
                            }}
                        />

                        {/* Spinner */}
                        <div className="relative z-10 flex justify-center mb-6">
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{
                                    duration: 1,
                                    repeat: Infinity,
                                    ease: "linear",
                                }}
                                className="relative w-20 h-20"
                            >
                                <div className="absolute inset-0 rounded-full border-4 border-white/10" />

                                <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-emerald-400 border-r-emerald-400" />

                                <div className="absolute inset-2 rounded-full bg-white/5" />

                                <div className="absolute inset-0 flex items-center justify-center">
                                    <svg
                                        className="w-8 h-8 text-emerald-300"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                        />
                                    </svg>
                                </div>
                            </motion.div>
                        </div>

                        {/* Text */}
                        <div className="relative z-10 text-center space-y-3">
                            <motion.h3
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="text-2xl font-bold text-white"
                            >
                                Loading Worksheet
                            </motion.h3>

                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.3 }}
                                className="flex items-center justify-center gap-2 text-sm text-emerald-300/80"
                            >
                                <span>Fetching data for</span>

                                <span className="px-2 py-0.5 bg-white/15 text-emerald-200 rounded font-semibold border border-white/20">
                                    {worksheetId}
                                </span>
                            </motion.div>

                            {/* Loading dots */}
                            <motion.div
                                className="flex justify-center gap-1.5 pt-2"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.4 }}
                            >
                                {[0, 1, 2].map((i) => (
                                    <motion.div
                                        key={i}
                                        animate={{
                                            scale: [1, 1.2, 1],
                                            opacity: [0.3, 1, 0.3],
                                        }}
                                        transition={{
                                            duration: 1.2,
                                            repeat: Infinity,
                                            delay: i * 0.2,
                                        }}
                                        className="w-2 h-2 rounded-full bg-emerald-400"
                                    />
                                ))}
                            </motion.div>
                        </div>
                    </div>
                </motion.div>
            </div>
        );
    }

    if (error)
        return <div>{error}</div>;

    const isSelectedParameterAnalysisStarted =
        normalizeStatus(selectedParameterAnalysisStatus) === "analysis started";

    const isSelectedParameterAnalysisPending =
        normalizeStatus(selectedParameterAnalysisStatus) === "analysis pending";

    // const renderAnalysisStatusSection = () => {
    //     if (
    //         role.toLowerCase() === "analyst" &&
    //         isSelectedParameterAnalysisStarted &&
    //         selectedParameter
    //     ) {
    //         return (
    //             <div className="relative mb-8 rounded-2xl overflow-hidden border border-slate-200 shadow-lg bg-white">

    //                 {/* Header */}
    //                 <div className="bg-gradient-to-r from-emerald-50 via-emerald-100 to-emerald-50 px-6 py-5 border-b border-slate-200">

    //                     <div className="flex items-center justify-between">

    //                         <div className="flex items-center gap-4">

    //                             <div className="relative">
    //                                 <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
    //                                     <svg
    //                                         className="w-6 h-6 text-emerald-600 animate-pulse"
    //                                         fill="currentColor"
    //                                         viewBox="0 0 20 20"
    //                                     >
    //                                         <path
    //                                             fillRule="evenodd"
    //                                             d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
    //                                             clipRule="evenodd"
    //                                         />
    //                                     </svg>
    //                                 </div>
    //                             </div>

    //                             <div>
    //                                 <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
    //                                     Analysis In Progress
    //                                 </h3>

    //                                 <p className="text-sm text-slate-600 mt-0.5">
    //                                     Work on your analysis and click complete when done
    //                                 </p>
    //                             </div>

    //                         </div>

    //                         <motion.button
    //                             onClick={() =>
    //                                 handleCompleteAnalysis(selectedParameter)
    //                             }
    //                             whileHover={{ scale: 1.02 }}
    //                             whileTap={{ scale: 0.98 }}
    //                             className="px-5 py-2.5 bg-white/60 backdrop-blur-sm border border-emerald-200 text-emerald-800 text-sm font-semibold rounded-lg hover:bg-white/80 hover:border-emerald-300 transition-all flex items-center gap-2 shadow-sm"
    //                         >
    //                             <svg
    //                                 className="w-5 h-5"
    //                                 fill="none"
    //                                 viewBox="0 0 24 24"
    //                                 stroke="currentColor"
    //                             >
    //                                 <path
    //                                     strokeLinecap="round"
    //                                     strokeLinejoin="round"
    //                                     strokeWidth={2}
    //                                     d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
    //                                 />
    //                             </svg>

    //                             Complete Analysis
    //                         </motion.button>

    //                     </div>
    //                 </div>

    //                 {/* Active Editing Information */}
    //                 <div className="p-6 bg-emerald-50">

    //                     <div className="grid grid-cols-1 gap-4">

    //                         <div className="bg-white border border-slate-200 rounded-xl p-5">

    //                             <div className="flex items-start gap-3">

    //                                 <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center flex-shrink-0">
    //                                     <svg
    //                                         className="w-5 h-5 text-emerald-600"
    //                                         fill="none"
    //                                         viewBox="0 0 24 24"
    //                                         stroke="currentColor"
    //                                     >
    //                                         <path
    //                                             strokeLinecap="round"
    //                                             strokeLinejoin="round"
    //                                             strokeWidth={2}
    //                                             d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
    //                                         />
    //                                     </svg>
    //                                 </div>

    //                                 <div className="flex-1">

    //                                     <h4 className="font-semibold text-sm text-slate-800 mb-2">
    //                                         Active Editing Mode
    //                                     </h4>

    //                                     <ul className="text-sm text-slate-600 space-y-2">

    //                                         <li className="flex items-start gap-2">
    //                                             <span className="text-emerald-500 mt-1">
    //                                                 •
    //                                             </span>

    //                                             <span>
    //                                                 You have full editing access to all
    //                                                 preparations and calculations
    //                                             </span>
    //                                         </li>

    //                                         <li className="flex items-start gap-2">
    //                                             <span className="text-emerald-500 mt-1">
    //                                                 •
    //                                             </span>

    //                                             <span>
    //                                                 Scroll down to work on parameter
    //                                                 details, preparations, and calculations
    //                                             </span>
    //                                         </li>

    //                                         <li className="flex items-start gap-2">
    //                                             <span className="text-emerald-500 mt-1">
    //                                                 •
    //                                             </span>

    //                                             <span>
    //                                                 Click <strong>"Save Draft"</strong>{" "}
    //                                                 frequently to save your progress
    //                                             </span>
    //                                         </li>

    //                                         <li className="flex items-start gap-2">
    //                                             <span className="text-emerald-500 mt-1">
    //                                                 •
    //                                             </span>

    //                                             <span>
    //                                                 When all work is complete, click{" "}
    //                                                 <strong>"Complete Analysis"</strong>{" "}
    //                                                 above
    //                                             </span>
    //                                         </li>

    //                                     </ul>

    //                                 </div>

    //                             </div>

    //                         </div>

    //                         <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">

    //                             <div className="flex items-start gap-3">

    //                                 <svg
    //                                     className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5"
    //                                     fill="none"
    //                                     viewBox="0 0 24 24"
    //                                     stroke="currentColor"
    //                                 >
    //                                     <path
    //                                         strokeLinecap="round"
    //                                         strokeLinejoin="round"
    //                                         strokeWidth={2}
    //                                         d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
    //                                     />
    //                                 </svg>

    //                                 <p className="text-sm text-emerald-800">
    //                                     <strong>Before Completing:</strong>{" "}
    //                                     Verify all preparations, calculations, and data
    //                                     are accurate. This will submit your work to
    //                                     Reviewer for approval.
    //                                 </p>

    //                             </div>

    //                         </div>

    //                     </div>

    //                 </div>

    //             </div>
    //         );
    //     }

    //     return null;
    // };

    return (

        <div className="bg-slate-900 min-h-screen">

            <div className="max-w-7xl mx-auto py-10 px-8">

                <div className="bg-white rounded-2xl shadow-2xl p-8">

                    <FoodHeader
                        worksheetId={worksheetId}
                        registrationNo={registrationNo}
                        sampleName={worksheetInfo?.sample.sampleName ?? ""}
                        parameterCount={worksheetInfo?.sample.numberOfParameters ?? 0}
                        dueDate={worksheetInfo?.sample.dueDate}
                        displayStatus={displayStatus || worksheetInfo?.sample.status || ""}
                    />

                    <FoodWorksheetInfo
                        sampleName={worksheetInfo?.sample.sampleName ?? ""}
                        parameterName={addedParameters[0]?.parameterName ?? ""}
                        methodName={addedParameters[0]?.methodName ?? ""}
                    />

                    {/*
                      ============================================================
                      ANALYST COMPLETE-ANALYSIS LOCK
                      ============================================================
                      This wrapper intentionally sits around the existing Food
                      parameter controls so we do not change any of the current
                      Food component logic.  After Complete Analysis, the Analyst
                      can still see the data/status, but cannot click any button,
                      link, input, select, file control, or other interactive
                      element inside this worksheet area.
                    */}
                    <div
                        className={`relative ${
                            isAnalystAnalysisCompleted
                                ? "select-none"
                                : ""
                        }`}
                        aria-disabled={isAnalystAnalysisCompleted}
                        onClickCapture={(event) => {
                            if (isAnalystAnalysisCompleted) {
                                event.preventDefault();
                                event.stopPropagation();
                            }
                        }}
                        onPointerDownCapture={(event) => {
                            if (isAnalystAnalysisCompleted) {
                                event.preventDefault();
                                event.stopPropagation();
                            }
                        }}
                    >
                        <FoodParameterManager
                            parameterCount={worksheetInfo?.parameters.length}
                            addedParameters={addedParameters}
                            availableParameters={availableToAdd}
                            expandedParameterId={expandedParameterId}

                            worksheetStatus={worksheetInfo?.sample?.status}
                            role={role}

                            onAddParameter={handleAddParameter}

                            onToggleParameter={(parameter) => {
                                if (isAnalystAnalysisCompleted) return;

                                if (expandedParameterId === parameter.id) {
                                    setExpandedParameterId(null);
                                } else {
                                    setExpandedParameterId(parameter.id);
                                }
                            }}

                            onDeleteParameter={(parameter) => {
                                if (isAnalystAnalysisCompleted) return;

                                setParameterToDelete(parameter);
                                setShowDeleteDialog(true);
                            }}
                        />

                        {selectedParameter && (

                        <>

                            <FoodParameterOverview
                                parameter={selectedParameter}
                                onClose={() => setExpandedParameterId(null)}
                            />

                            {/* ============================================================
                                ANALYSIS LOCK SECTION
                                Same shared section used by the other worksheet modules.
                            ============================================================ */}
                            {/* ============================================================
    ANALYSIS LOCK SECTION
    Shared section for Reviewer / Analyst status handling.
============================================================ */}
                            <AnalysisLockSection
                                status={selectedParameterAnalysisStatus}
                                role={role}
                                canUnlock={role.toLowerCase() === "reviewer"}
                                canDelete={!isAnalystAnalysisCompleted}
                                onStartAnalysis={
                                    role.toLowerCase() === "analyst" && !isAnalystAnalysisCompleted
                                        ? () => handleStartAnalysis(selectedParameter)
                                        : undefined
                                }
                                onCompleteAnalysis={
                                    role.toLowerCase() === "analyst" &&
                                    (
                                        !isAnalystAnalysisCompleted ||
                                        isAnalystRevisionStarted
                                    )
                                        ? () => handleCompleteAnalysis(selectedParameter)
                                        : undefined
                                }
                                onStartRevision={
                                    role.toLowerCase() === "analyst" &&
                                    isAnalystRevision &&
                                    !isAnalystRevisionStarted
                                        ? () => handleStartRevision(selectedParameter)
                                        : undefined
                                }
                                onApprove={
                                    role.toLowerCase() === "reviewer"
                                        ? () => handleApprove(selectedParameter)
                                        : undefined
                                }
                                onRequestRevision={
                                    role.toLowerCase() === "reviewer"
                                        ? () => handleRequestRevision(selectedParameter)
                                        : undefined
                                }
                                analystComment={getAnalystComment(selectedParameter)}
                                reviewerComment={
                                    remarksByReviewerPerParam[selectedParameter.id] ??
                                    (selectedParameter as any).remarksByReviewer ??
                                    (selectedParameter as any).revisionComments ??
                                    null
                                }
                                analysisStartDate={
                                    (selectedParameter as any).analysisStartDate ?? null
                                }
                                analysisCompletionDate={
                                    (selectedParameter as any).analysisCompletionDate ?? null
                                }
                                revisionStartDate={
                                    (selectedParameter as any).revisionStartDate ?? null
                                }
                                onUnlock={() =>
                                    handleInitiateUnlock(selectedParameter)
                                }
                                onDelete={() => {
                                    setParameterToDelete(selectedParameter);
                                    setShowDeleteDialog(true);
                                }}
                            />

                            {/* Copy from another worksheet */}
                            <div className="mt-5 mb-4 flex justify-end">
                                <button
                                    type="button"
                                    disabled={isPreparationLocked}
                                    onClick={() => {
                                        if (isPreparationLocked)
                                            return;

                                        setShowCopyWorksheetDialog(true);
                                    }}
                                    className={`flex items-center gap-2 px-3 py-1.5 bg-white border border-emerald-400 text-emerald-700 font-semibold rounded-lg transition-colors shadow-sm text-xs ${isPreparationLocked
                                        ? "opacity-50 cursor-not-allowed"
                                        : "hover:bg-emerald-50"
                                        }`}
                                >
                                    Copy from Worksheet
                                </button>
                            </div>

                            <FoodInstrumentSection
                                isLocked={isPreparationLocked}
                                role={role}
                                parameterId={selectedParameter.id}
                                instruments={instruments}
                                addedInstruments={addedInstruments}
                                showInstrumentDropdown={showInstrumentDropdown}
                                instrumentSearch={instrumentSearch}
                                searchFilteredInstruments={searchFilteredInstruments}
                                instrumentRef={instrumentRef}
                                isReferenceDataLoading={isReferenceDataLoading}
                                referenceDataError={referenceDataError}
                                formatDate={formatDate}
                                onToggleDropdown={() => {
                                    if (isPreparationLocked)
                                        return;

                                    setShowInstrumentDropdown(prev => !prev);
                                }}
                                onSearch={setInstrumentSearch}
                                onAddInstrument={handleAddInstrument}
                                onRemoveInstrument={(instrumentId) =>
                                    handleRemoveInstrument(selectedParameter.id, instrumentId)
                                }
                            />

                            <FoodChemicalSection
                                isLocked={isPreparationLocked}
                                role={role}
                                parameterId={selectedParameter.id}
                                chemicals={chemicals}
                                addedChemicals={addedChemicals}
                                showChemicalDropdown={showChemicalDropdown}
                                chemicalSearch={chemicalSearch}
                                searchFilteredChemicals={searchFilteredChemicals}
                                chemicalRef={chemicalRef}
                                isReferenceDataLoading={isReferenceDataLoading}
                                referenceDataError={referenceDataError}
                                formatDate={formatDate}
                                onToggleDropdown={() =>
                                    setShowChemicalDropdown(!showChemicalDropdown)
                                }
                                onSearch={setChemicalSearch}
                                onAddChemical={handleAddChemical}
                                onRemoveChemical={(chemicalId) =>
                                    handleRemoveChemical(selectedParameter.id, chemicalId)
                                }
                            />

                            <FoodStandardSection
                                isLocked={isPreparationLocked}
                                role={role}
                                parameterId={selectedParameter.id}
                                standards={standards}
                                addedStandards={addedStandards}
                                showStandardDropdown={showStandardDropdown}
                                standardSearch={standardSearch}
                                searchFilteredStandards={searchFilteredStandards}
                                standardRef={standardRef}
                                isReferenceDataLoading={isReferenceDataLoading}
                                referenceDataError={referenceDataError}
                                formatDate={formatDate}
                                onToggleDropdown={() =>
                                    setShowStandardDropdown(!showStandardDropdown)
                                }
                                onSearch={setStandardSearch}
                                onAddStandard={handleAddStandard}
                                onRemoveStandard={(standardId) =>
                                    handleRemoveStandard(selectedParameter.id, standardId)
                                }
                            />
                            <CopyFromWorksheetDialog
                                isOpen={showCopyWorksheetDialog}
                                onClose={() => setShowCopyWorksheetDialog(false)}
                                currentWorksheetId={worksheetId}
                                sampleName={worksheetInfo?.sample?.sampleName}
                                targetParameterId={selectedParameter.id}
                                fetchRequest={{ employeeId, role }}
                                includeStandards={true}
                                existingInstrumentIds={(addedInstruments[selectedParameter.id] || [])
                                    .map(i => i.instrumentId)
                                    .filter((id): id is string => !!id)}

                                existingChemicalIds={(addedChemicals[selectedParameter.id] || [])
                                    .map(c => c.slno)
                                    .filter((id): id is string => !!id)}

                                existingStandardIds={(addedStandards[selectedParameter.id] || [])
                                    .map(s => s.serialNo)
                                    .filter((id): id is string => !!id)}
                                onImport={(data) => handleImportFromWorksheet(selectedParameter.id, data)}
                            />

                            <FoodAdditionalInfo
                                parameterId={selectedParameter.id}
                                enabled={showAdditionalInfo[selectedParameter.id] ?? false}
                                value={additionalInfoPerParam[selectedParameter.id] ?? ""}
                                isLocked={isPreparationLocked}
                                onToggle={(checked) => {
                                    if (isPreparationLocked)
                                        return;

                                    setShowAdditionalInfo(prev => ({
                                        ...prev,
                                        [selectedParameter.id]: checked
                                    }));

                                    if (!checked) {
                                        setAdditionalInfoPerParam(prev => ({
                                            ...prev,
                                            [selectedParameter.id]: ""
                                        }));
                                    }
                                }}
                                onChange={(value) => {
                                    if (isPreparationLocked)
                                        return;

                                    setAdditionalInfoPerParam(prev => ({
                                        ...prev,
                                        [selectedParameter.id]: value
                                    }));
                                }}
                            />

                            <FoodBufferPreparation
                                isLocked={isPreparationLocked}
                                parameterId={selectedParameter.id}
                                enabled={showBufferPreparation[selectedParameter.id] || false}
                                buffers={bufferPreparationPerParam[selectedParameter.id] || []}
                                onToggle={(checked) => {
                                    setShowBufferPreparation(prev => ({
                                        ...prev,
                                        [selectedParameter.id]: checked
                                    }));

                                    if (!checked) {
                                        setBufferPreparationPerParam(prev => ({
                                            ...prev,
                                            [selectedParameter.id]: []
                                        }));
                                    }
                                }}
                                onAdd={() => handleAddBufferPreparation(selectedParameter.id)}
                                onRemove={(bufferId) =>
                                    handleRemoveBufferPreparation(selectedParameter.id, bufferId)
                                }
                                onStepChange={(bufferId, step, field, value) =>
                                    handleBufferPreparationStepChange(
                                        selectedParameter.id,
                                        bufferId,
                                        step,
                                        field,
                                        value
                                    )
                                }
                            />
                            <FoodMobilePhasePreparation
                                isLocked={isPreparationLocked}
                                parameterId={selectedParameter.id}
                                enabled={showMobilePhasePreparation[selectedParameter.id] || false}
                                mobilePhases={mobilePhasePerParam[selectedParameter.id] || []}
                                onToggle={(checked) =>
                                    setShowMobilePhasePreparation(prev => ({
                                        ...prev,
                                        [selectedParameter.id]: checked
                                    }))
                                }
                                onAdd={() => handleAddMobilePhase(selectedParameter.id)}
                                onEdit={(id) => handleEditMobilePhase(selectedParameter.id, id)}
                                onRemove={(id) => handleRemoveMobilePhase(selectedParameter.id, id)}
                            />
                            <AnimatePresence>
                                {showMobilePhaseDialog[selectedParameter.id] && (
                                    <PreparationEditorDialog
                                        title={
                                            editingMobilePhasePrepId
                                                ? (
                                                    mobilePhasePerParam[selectedParameter.id] || []
                                                ).find(
                                                    mp => mp.id === editingMobilePhasePrepId
                                                )?.label ?? "Mobile Phase Preparation"
                                                : `Mobile Phase Preparation ${(mobilePhasePerParam[selectedParameter.id] || []).length + 1
                                                }`
                                        }
                                        onClose={() => {
                                            setShowMobilePhaseDialog(prev => ({
                                                ...prev,
                                                [selectedParameter.id]: false
                                            }));

                                            setEditingMobilePhasePrepId(null);
                                        }}
                                        onSave={(content) =>
                                            handleSaveMobilePhase(
                                                selectedParameter.id,
                                                "",
                                                content
                                            )
                                        }
                                        existingContent={
                                            editingMobilePhasePrepId
                                                ? (
                                                    mobilePhasePerParam[selectedParameter.id] || []
                                                ).find(
                                                    mp => mp.id === editingMobilePhasePrepId
                                                )?.content
                                                : undefined
                                        }
                                    />
                                )}
                            </AnimatePresence>

                            <FoodDiluentPreparation
                                isLocked={isPreparationLocked}
                                parameterId={selectedParameter.id}
                                enabled={showDiluentPreparation[selectedParameter.id] || false}
                                diluentPreparations={
                                    diluentPreparationsPerParam[selectedParameter.id] || []
                                }
                                onToggle={(checked) =>
                                    setShowDiluentPreparation(prev => ({
                                        ...prev,
                                        [selectedParameter.id]: checked
                                    }))
                                }
                                onAdd={() => handleAddDiluentPreparation(selectedParameter.id)}
                                onEdit={(id) =>
                                    handleEditDiluentPreparation(selectedParameter.id, id)
                                }
                                onRemove={(id) =>
                                    handleRemoveDiluentPreparation(selectedParameter.id, id)
                                }
                            />

                            <AnimatePresence>
                                {showDiluentPrepDialog[selectedParameter.id] && (
                                    <PreparationEditorDialog
                                        title={
                                            editingDiluentPrepId
                                                ? (
                                                    diluentPreparationsPerParam[selectedParameter.id] || []
                                                ).find(
                                                    d => d.id === editingDiluentPrepId
                                                )?.label ?? "Diluent Preparation"
                                                : `Diluent Preparation ${(diluentPreparationsPerParam[selectedParameter.id] || [])
                                                    .length + 1
                                                }`
                                        }
                                        onClose={() => {
                                            setShowDiluentPrepDialog(prev => ({
                                                ...prev,
                                                [selectedParameter.id]: false
                                            }));

                                            setEditingDiluentPrepId(null);
                                        }}
                                        onSave={(content) =>
                                            handleSaveDiluentPreparation(
                                                selectedParameter.id,
                                                "",
                                                content
                                            )
                                        }
                                        existingContent={
                                            editingDiluentPrepId
                                                ? (
                                                    diluentPreparationsPerParam[selectedParameter.id] || []
                                                ).find(
                                                    d => d.id === editingDiluentPrepId
                                                )?.content
                                                : undefined
                                        }
                                    />
                                )}
                            </AnimatePresence>

                            {/* -----------------Preparation Management will be added here--------------- */}


                            <PreparationEngine

                                ref={(engine) => {

                                    preparationRefs.current[selectedParameter.id] = engine;

                                }}

                                role={role}

                                canUnlockPreparation={canUnlockPreparation}

                                parameterId={selectedParameter.id}

                                parameterName={selectedParameter.parameterName}

                                parameterCode={selectedParameter.paraCode}

                                isLocked={isPreparationLocked}
                                canEditCalculations={canEditCalculations}

                                onLockPreparation={(parameterId) => {

                                    const completedAt = new Date().toLocaleString("en-GB");

                                    setPreparationLockedPerParam(prev => ({

                                        ...prev,
                                        [parameterId]: true

                                    }));

                                    setAddedParameters(prev =>

                                        prev.map(p =>

                                            p.id === parameterId
                                                ? {
                                                    ...p,
                                                    preparationCompletedAt: completedAt,
                                                    preparationCompletedBy: employeeId
                                                }
                                                : p

                                        )

                                    );

                                }}

                                onUnlockPreparation={(parameterId) => {

                                    setPreparationLockedPerParam(prev => ({
                                        ...prev,
                                        [parameterId]: false
                                    }));

                                    setAddedParameters(prev =>
                                        prev.map(p =>
                                            p.id === parameterId
                                                ? {
                                                    ...p,
                                                    preparationCompletedAt: null,
                                                    preparationCompletedBy: null
                                                }
                                                : p
                                        )
                                    );
                                }}

                            />



                            <FoodSystemSuitability
                                parameterId={selectedParameter.id}
                                enabled={showSystemSuitability[selectedParameter.id] || false}
                                isLocked={isPreparationLocked}
                                systemSuitabilities={
                                    systemSuitabilityPerParam[selectedParameter.id] || []
                                }
                                onToggle={(checked) => {
                                    if (isPreparationLocked)
                                        return;

                                    setShowSystemSuitability(prev => ({
                                        ...prev,
                                        [selectedParameter.id]: checked
                                    }));
                                }}
                                onAdd={() => {
                                    if (isPreparationLocked)
                                        return;

                                    handleAddSystemSuitability(selectedParameter.id);
                                }}
                                onRemove={(id) => {
                                    if (isPreparationLocked)
                                        return;

                                    handleRemoveSystemSuitability(
                                        selectedParameter.id,
                                        id
                                    );
                                }}
                                onStepChange={(
                                    suitabilityId,
                                    stepName,
                                    field,
                                    value
                                ) => {
                                    if (isPreparationLocked)
                                        return;

                                    handleSystemSuitabilityStepChange(
                                        selectedParameter.id,
                                        suitabilityId,
                                        stepName,
                                        field,
                                        value
                                    );
                                }}
                                onAddStep={(
                                    suitabilityId,
                                    stepName,
                                    limitType
                                ) => {
                                    if (isPreparationLocked)
                                        return;

                                    handleAddSystemSuitabilityStep(
                                        selectedParameter.id,
                                        suitabilityId,
                                        stepName,
                                        limitType
                                    );
                                }}
                                onRemoveStep={(
                                    suitabilityId,
                                    stepName
                                ) => {
                                    if (isPreparationLocked)
                                        return;

                                    handleRemoveSystemSuitabilityStep(
                                        selectedParameter.id,
                                        suitabilityId,
                                        stepName
                                    );
                                }}
                            />

                            <FoodParameterFiles
                                parameterId={selectedParameter.id}
                                enabled={showParamFiles[selectedParameter.id] || false}
                                files={getParamLevelFiles(selectedParameter.id)}
                                onToggle={(checked) => {
                                    setShowParamFiles(prev => ({
                                        ...prev,
                                        [selectedParameter.id]: checked
                                    }));

                                    if (!checked) {
                                        updateFilesForSlot(
                                            selectedParameter.id,
                                            PARAM_LEVEL_KEY,
                                            () => []
                                        );
                                    }
                                }}
                                onAdd={(newFiles) =>
                                    handleAddParamFiles(
                                        selectedParameter.id,
                                        newFiles
                                    )
                                }
                                onRemove={(index) =>
                                    handleRemoveParamFile(
                                        selectedParameter.id,
                                        index
                                    )
                                }
                                isLocked={isPreparationLocked}
                            />

                            {/* ============================================================
                                    REVIEWER - ANALYSIS COMPLETED ACTION BAR
                                    Uses the shared AnalysisLockSection so the bottom
                                    section stays consistent with the Drug worksheet.
                                ============================================================ */}
                            {role.toLowerCase() === "reviewer" &&
                                normalizeStatus(selectedParameterAnalysisStatus) ===
                                "analysis completed" && (
                                    <AnalysisLockSection
                                        status={selectedParameterAnalysisStatus}
                                        role={role}
                                        canUnlock={false}
                                        canDelete={false}
                                        onApprove={() => handleApprove(selectedParameter)}
                                        onRequestRevision={() =>
                                            handleRequestRevision(selectedParameter)
                                        }
                                        analystComment={getAnalystComment(selectedParameter)}
                                         reviewerComment={remarksByReviewerPerParam[selectedParameter.id] ?? (selectedParameter as any).remarksByReviewer ?? (selectedParameter as any).revisionComments ?? null}
                                        onUnlock={() =>
                                            handleInitiateUnlock(selectedParameter)
                                        }
                                        onDelete={() => {
                                            setParameterToDelete(selectedParameter);
                                            setShowDeleteDialog(true);
                                        }}
                                        compact
                                    />
                                )}


                            {/* ============================================================
    BOTTOM ANALYSIS ACTION SECTION

    Reviewer:
        Keep the existing compact AnalysisLockSection.
        This preserves Awaiting Analysis / Unlock behavior.

    Analyst:
        Show Analysis In Progress + Complete Analysis.
============================================================ */}

                            {role.toLowerCase() === "reviewer" &&
                                normalizeStatus(selectedParameterAnalysisStatus) !==
                                "analysis completed" && (
                                <AnalysisLockSection
                                    status={selectedParameterAnalysisStatus}
                                    role={role}
                                    canUnlock={true}
                                    canDelete={true}
                                    onStartAnalysis={() =>
                                        handleStartAnalysis(selectedParameter)
                                    }
                                    onUnlock={() =>
                                        handleInitiateUnlock(selectedParameter)
                                    }
                                    onDelete={() => {
                                        setParameterToDelete(selectedParameter);
                                        setShowDeleteDialog(true);
                                    }}
                                    compact
                                />
                            )}





                            {/* ============================================================
    ANALYST - ANALYSIS REVISION
    Bottom compact section: disabled before Start Revision,
    Complete Revision after Start Revision.
============================================================ */}
                            {role.toLowerCase() === "analyst" &&
                                isAnalystRevision && (
                                    <AnalysisLockSection
                                        status={selectedParameterAnalysisStatus}
                                        role={role}
                                        canUnlock={false}
                                        canDelete={false}
                                        onStartRevision={
                                            !isAnalystRevisionStarted
                                                ? () => handleStartRevision(selectedParameter)
                                                : undefined
                                        }
                                        onCompleteAnalysis={
                                            isAnalystRevisionStarted
                                                ? () => handleCompleteAnalysis(selectedParameter)
                                                : undefined
                                        }
                                        reviewerComment={
                                            remarksByReviewerPerParam[selectedParameter.id] ??
                                            (selectedParameter as any).remarksByReviewer ??
                                            (selectedParameter as any).revisionComments ??
                                            null
                                        }
                                        analysisStartDate={
                                            (selectedParameter as any).analysisStartDate ?? null
                                        }
                                        analysisCompletionDate={
                                            (selectedParameter as any).analysisCompletionDate ?? null
                                        }
                                        revisionStartDate={
                                            (selectedParameter as any).revisionStartDate ?? null
                                        }
                                        onUnlock={() =>
                                            handleInitiateUnlock(selectedParameter)
                                        }
                                        onDelete={() => {
                                            setParameterToDelete(selectedParameter);
                                            setShowDeleteDialog(true);
                                        }}
                                        compact
                                    />
                                )}

                            {/* ============================================================
    ANALYST - ANALYSIS COMPLETED AFTER REVISION

    Keep the bottom Analysis Completed section visible after
    Complete Revision changes the status back to Analysis Completed.
============================================================ */}
                            {role.toLowerCase() === "analyst" &&
                                normalizeStatus(selectedParameterAnalysisStatus) ===
                                    "analysis completed" && (
                                    <AnalysisLockSection
                                        status={selectedParameterAnalysisStatus}
                                        role={role}
                                        canUnlock={false}
                                        canDelete={false}
                                        analystComment={getAnalystComment(selectedParameter)}
                                        reviewerComment={
                                            remarksByReviewerPerParam[selectedParameter.id] ??
                                            (selectedParameter as any).remarksByReviewer ??
                                            (selectedParameter as any).revisionComments ??
                                            null
                                        }
                                        analysisStartDate={
                                            (selectedParameter as any).analysisStartDate ?? null
                                        }
                                        analysisCompletionDate={
                                            (selectedParameter as any).analysisCompletionDate ?? null
                                        }
                                        revisionStartDate={
                                            (selectedParameter as any).revisionStartDate ?? null
                                        }
                                        onUnlock={() =>
                                            handleInitiateUnlock(selectedParameter)
                                        }
                                        onDelete={() => {
                                            setParameterToDelete(selectedParameter);
                                            setShowDeleteDialog(true);
                                        }}
                                        compact
                                    />
                                )}

                            {/* ============================================================
    ANALYST - ANALYSIS PENDING
============================================================ */}
                            {role.toLowerCase() === "analyst" &&
                                normalizeStatus(selectedParameterAnalysisStatus) ===
                                "analysis pending" && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="mt-6 mb-4"
                                    >
                                        <div className="bg-gradient-to-r from-emerald-50 via-emerald-100 to-emerald-50 border border-emerald-200 rounded-xl shadow-sm overflow-hidden">
                                            <div className="px-5 py-4">
                                                <div className="flex items-center justify-between">

                                                    <div className="flex items-center gap-3">

                                                        <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                                                            <svg
                                                                className="w-5 h-5 text-emerald-600"
                                                                fill="currentColor"
                                                                viewBox="0 0 20 20"
                                                            >
                                                                <path
                                                                    fillRule="evenodd"
                                                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.5 7.2a1 1 0 011.6-.8l3.5 2.8a1 1 0 010 1.6l-3.5 2.8a1 1 0 01-1.6-.8V7.2z"
                                                                    clipRule="evenodd"
                                                                />
                                                            </svg>
                                                        </div>

                                                        <div>
                                                            <h4 className="text-sm font-bold text-slate-800">
                                                                Analysis Pending
                                                            </h4>

                                                            <p className="text-xs text-slate-600">
                                                                Ready to start analysis
                                                            </p>
                                                        </div>

                                                    </div>

                                                    <motion.button
                                                        type="button"
                                                        onClick={() =>
                                                            handleStartAnalysis(selectedParameter)
                                                        }
                                                        whileHover={{ scale: 1.02 }}
                                                        whileTap={{ scale: 0.98 }}
                                                        className="px-5 py-2.5 bg-white/60 backdrop-blur-sm border border-emerald-200 text-emerald-800 text-sm font-semibold rounded-lg hover:bg-white/80 hover:border-emerald-300 transition-all flex items-center gap-2 shadow-sm"
                                                    >
                                                        <svg
                                                            className="w-5 h-5"
                                                            fill="currentColor"
                                                            viewBox="0 0 20 20"
                                                        >
                                                            <path
                                                                fillRule="evenodd"
                                                                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.5 7.2a1 1 0 011.6-.8l3.5 2.8a1 1 0 010 1.6l-3.5 2.8a1 1 0 01-1.6-.8V7.2z"
                                                                clipRule="evenodd"
                                                            />
                                                        </svg>

                                                        Start Analysis
                                                    </motion.button>

                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}


                            {role.toLowerCase() === "analyst" &&
                                normalizeStatus(selectedParameterAnalysisStatus) ===
                                "analysis started" && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="mt-6 mb-4"
                                    >
                                        <div className="bg-gradient-to-r from-emerald-50 via-emerald-100 to-emerald-50 border border-emerald-200 rounded-xl shadow-sm overflow-hidden">
                                            <div className="px-5 py-4">
                                                <div className="flex items-center justify-between">

                                                    <div className="flex items-center gap-3">

                                                        <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                                                            <svg
                                                                className="w-5 h-5 text-emerald-600 animate-pulse"
                                                                fill="currentColor"
                                                                viewBox="0 0 20 20"
                                                            >
                                                                <path
                                                                    fillRule="evenodd"
                                                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a9 9 0 000-1.664l-3-2z"
                                                                    clipRule="evenodd"
                                                                />
                                                            </svg>
                                                        </div>

                                                        <div>
                                                            <h4 className="text-sm font-bold text-slate-800">
                                                                Analysis In Progress
                                                            </h4>

                                                            <p className="text-xs text-slate-600">
                                                                Complete your analysis and click on Complete button
                                                            </p>
                                                        </div>

                                                    </div>

                                                    <motion.button
                                                        type="button"
                                                        onClick={() =>
                                                            handleCompleteAnalysis(selectedParameter)
                                                        }
                                                        whileHover={{ scale: 1.02 }}
                                                        whileTap={{ scale: 0.98 }}
                                                        className="px-5 py-2.5 bg-white/60 backdrop-blur-sm border border-emerald-200 text-emerald-800 text-sm font-semibold rounded-lg hover:bg-white/80 hover:border-emerald-300 transition-all flex items-center gap-2 shadow-sm"
                                                    >
                                                        <svg
                                                            className="w-5 h-5"
                                                            fill="none"
                                                            viewBox="0 0 24 24"
                                                            stroke="currentColor"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={2}
                                                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                                            />
                                                        </svg>

                                                        Complete Analysis
                                                    </motion.button>

                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                        </>

                        )}

                        {isAnalystAnalysisCompleted && (
                            <div
                                className="absolute inset-0 z-50 bg-white/20 backdrop-blur-[0.5px] cursor-not-allowed"
                                aria-hidden="true"
                            />
                        )}
                    </div>

                    <AnalystSelectionDialog
                        isOpen={showAnalystDialog}
                        onClose={() => {
                            setShowAnalystDialog(false);
                            setPendingParameter(null);
                        }}
                        analysts={analysts}
                        onSelectAnalyst={handleAnalystSelected}
                        lab={department}
                    />
                    <AnimatePresence>
                        {showUnlockDialog && parameterToUnlock && (
                            <UnlockParameterDialog
                                isOpen={showUnlockDialog}
                                isUnlocking={isUnlocking}
                                parameterName={parameterToUnlock.parameterName ?? ""}
                                parameterCode={parameterToUnlock.paraCode ?? ""}
                                onClose={() => {
                                    setShowUnlockDialog(false);
                                    setParameterToUnlock(null);
                                }}
                                onConfirm={handleConfirmUnlock}
                            />

                        )}
                    </AnimatePresence>
                    {/* Start Analysis Dialog */}
                    <AnimatePresence>
                        {showStartAnalysisDialog && parameterForAnalysis && (
                            <StartAnalysisDialog
                                isOpen={showStartAnalysisDialog}
                                isStarting={isStartingAnalysis}
                                parameterName={parameterForAnalysis.parameterName ?? ""}
                                parameterCode={parameterForAnalysis.paraCode ?? ""}
                                onClose={() => {
                                    setShowStartAnalysisDialog(false);
                                    setParameterForAnalysis(null);
                                }}
                                onConfirm={() =>
                                    handleConfirmStartAnalysis(parameterForAnalysis)
                                }
                            />
                        )}
                    </AnimatePresence>
                    <AnimatePresence>
                        {showCompleteAnalysisDialog && parameterForAnalysis && (
                            <CompleteAnalysisDialog
                                isOpen={showCompleteAnalysisDialog}
                                isCompleting={isCompletingAnalysis}
                                parameterName={parameterForAnalysis.parameterName ?? ""}
                                parameterCode={parameterForAnalysis.paraCode ?? ""}
                                onClose={() => {
                                    if (isCompletingAnalysis) return;

                                    setShowCompleteAnalysisDialog(false);
                                    setParameterForAnalysis(null);
                                }}
                                onConfirm={handleConfirmCompleteAnalysis}
                            />
                        )}
                    </AnimatePresence>
                    <AnimatePresence>
                        {showApproveDialog && parameterForApproval && (
                            <ApproveParameterDialog
                                isOpen={showApproveDialog}
                                isApproving={isApproving}
                                parameterName={parameterForApproval.parameterName ?? ""}
                                parameterCode={parameterForApproval.paraCode ?? ""}
                                onClose={() => {
                                    if (isApproving) return;
                                    setShowApproveDialog(false);
                                    setParameterForApproval(null);
                                }}
                                onConfirm={handleConfirmApprove}
                            />
                        )}
                    </AnimatePresence>

                    <AnimatePresence>
                        {showRevisionDialog && parameterForApproval && (
                            <RevisionRequestDialog
                                isOpen={showRevisionDialog}
                                isRequesting={isRequestingRevision}
                                parameterName={parameterForApproval.parameterName ?? ""}
                                parameterCode={parameterForApproval.paraCode ?? ""}
                                onClose={() => {
                                    if (isRequestingRevision) return;
                                    setShowRevisionDialog(false);
                                    setParameterForApproval(null);
                                }}
                                onConfirm={handleConfirmRevision}
                            />
                        )}
                    </AnimatePresence>

                    <DeleteParameterDialog
                        isOpen={showDeleteDialog}
                        isDeleting={isDeleting}
                        parameterName={parameterToDelete?.parameterName ?? ""}
                        parameterCode={parameterToDelete?.paraCode ?? ""}
                        parameterStatus={parameterToDelete?.status ?? ""}
                        onClose={() => {

                            setShowDeleteDialog(false);

                            setParameterToDelete(null);

                        }}
                        onConfirm={handleDeleteParameter}
                    />
                    <Toast
                        isVisible={showToast}
                        message={toastMessage}
                        type={toastType}
                        onClose={() => setShowToast(false)}
                    />
                    <AnimatePresence>
                        {showSubmitDialog && (
                            <SubmitDialog
                                isOpen={showSubmitDialog}
                                isSubmitting={isSubmitting}
                                onClose={() =>
                                    setShowSubmitDialog(false)
                                }
                                onConfirm={handleSubmitForAnalysis}
                                createdParametersCount={
                                    addedParameters.filter(
                                        (param) =>
                                            (
                                                parameterStatusPerParam[param.id] ||
                                                param.status ||
                                                "created"
                                            ).toLowerCase() === "created"
                                    ).length
                                }
                            />
                        )}
                    </AnimatePresence>


                </div>
            </div>
        </div>

    );

};

export default FoodWorksheet;
