import React, { useState, useRef, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
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
    insertWorksheetLog
} from "../services/api";
import Toast from "./shared/Toast";
import SubmitDialog from "./shared/SubmitDialog";
import type { PreparationDraft } from "../pages/food/types/PreparationDraft";


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
    const [toastType, setToastType] = useState<"success" | "error">("success");
    const restoreWorksheetToState = (worksheetData: WorksheetDetail) => {

        const restoredParams: ParameterDetail[] =
            worksheetData.parameters.map(param => ({
                ...param,
                id: param.id
            }));
        //console.log(restoredParams);
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
                param.status === "COMPLETED";

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

                // Restore lock state first
                setPreparationLockedPerParam(prev => ({
                    ...prev,
                    [param.id]: param.status === "COMPLETED"
                }));

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

    const [showSubmitDialog, setShowSubmitDialog] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);


    useEffect(() => {

        reloadWorksheet();

    }, [worksheetId]);

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
                worksheetInfo?.sample?.status ?? "",

            showSaveDraft:
                worksheetInfo?.sample?.status === "Draft" ||
                worksheetInfo?.sample?.status === "Created",

            showSubmitForAnalysis:
                role === "Reviewer" &&
                (
                    worksheetInfo?.sample?.status === "Draft" ||
                    worksheetInfo?.sample?.status === "Created"
                ) &&
                addedParameters.length > 0,

            showSubmitForQA:
                role === "Reviewer" &&
                worksheetInfo?.sample?.status ===
                "Submitted For Analysis",

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

    const isPreparationLocked =
        selectedParameter
            ? (preparationLockedPerParam[selectedParameter.id] ?? false)
            : false;

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



    if (isLoading)
        return <div>Loading...</div>;

    if (error)
        return <div>{error}</div>;



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
                        displayStatus={worksheetInfo?.sample.status}
                    />

                    <FoodWorksheetInfo
                        sampleName={worksheetInfo?.sample.sampleName ?? ""}
                        parameterName={addedParameters[0]?.parameterName ?? ""}
                        methodName={addedParameters[0]?.methodName ?? ""}
                    />

                    <FoodParameterManager
                        parameterCount={worksheetInfo?.parameters.length}
                        addedParameters={addedParameters}
                        availableParameters={availableToAdd}
                        expandedParameterId={expandedParameterId}
                        onAddParameter={handleAddParameter}
                        onToggleParameter={(parameter) => {

                            if (expandedParameterId === parameter.id)
                                setExpandedParameterId(null);
                            else
                                setExpandedParameterId(parameter.id);

                        }}
                        onDeleteParameter={(parameter) => {

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

                            {/* Copy from another worksheet */}
                            <div className="mb-4 flex justify-end">
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

                                parameterId={selectedParameter.id}

                                parameterName={selectedParameter.parameterName}

                                parameterCode={selectedParameter.paraCode}

                                isLocked={
                                    preparationLockedPerParam[selectedParameter.id] ?? false
                                }

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
                            //isLocked={false}
                            />



                        </>

                    )}
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