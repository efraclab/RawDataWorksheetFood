import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { type SampleData } from "../models/SampleData";
import type { Instrument } from "../preparation_models/Instrument";
import type { Chemical } from "../preparation_models/Chemical";
import { CgTrash } from "react-icons/cg";
import { BiTestTube } from "react-icons/bi";
import { IoFlask } from "react-icons/io5";
import AnalystSelectionDialog from "./shared/AnalystSelectionDialog";
import {
    fetchWorksheetById,
    updateWorksheet,
    updateParameter,
    fetchSample,
    fetchAnalysts,
    deleteParameter,
    submitWorksheet,
    addParameter,
    insertWorksheetLog,
} from "../services/api";
import type { WorksheetDetail } from "../models/WorksheetDetail";
import type { WorksheetRequest } from "../models/WorksheetRequest";
import type { ParameterDetail } from "../models/ParameterDetail";
import { type Analyst } from "../models/Analyst";
import type { FetchWorksheetRequest } from "../models/FetchWorksheetRequest";
import SubmitDialog from "./shared/SubmitDialog";
import DeleteParameterDialog from "./shared/DeleteParameterDialog";
import UnlockParameterDialog from "./shared/UnlockParameterDialog";
import CompleteAnalysisDialog from "./shared/CompleteAnalysisDialog";
import CompletePreparationDialog from "./shared/CompletePreparationDialog";
import UnlockPreparationDialog from "./shared/UnlockPreparationDialog";
import StartAnalysisDialog from "./shared/StartAnalysisDialog";
import { BsPlayFill } from "react-icons/bs";
import ApproveParameterDialog from "./shared/ApproveParameterDialog";
import DisapproveParameterDialog from "./shared/DisapproveParameterDialog";
import RevisionRequestDialog from "./shared/RevisionRequestDialog";
import ApproveWorksheetDialog from "./shared/ApproveWorksheetDialog";
import SubmitForQAReviewDialog from "./shared/SubmitForQAReviewDialog";
import Toast from "./shared/Toast";
import { WorksheetDbMapper } from "../helpers/WorksheetDbMapper";
import { MdDone } from "react-icons/md";
import type { SmapleDetailsRequest } from "../models/SmapleDetailsRequest";
import type { AttachedFile } from "../models/AttachedFile";
import type { WorksheetFileData } from "../models/WorksheetFileData";
import WorksheetFileAttacher from "./shared/WorksheetFileAttacher";
import BETPreparationDetail, { createDefaultBETPreparation } from "./sub-components/micro/BETPreparationDetail";
import type { BETPreparation } from "../preparation_models/micro/BETPreparation";

import type { WorksheetSidebarState, WorksheetSidebarActions } from "./shared/WorksheetSidebar";
import SterilityPreparationDetail, { createDefaultSterilityPreparation } from "./sub-components/micro/SterilityPreparationDetail";
import type { SterilityPreparation } from "../preparation_models/micro/SterilityPreparation";
import type { Media } from "../preparation_models/Media";
import type { EcoliPreparation } from "../preparation_models/micro/EColiPreparation";
import EcoliPreparationDetail, { createDefaultEcoliPreparation } from "./sub-components/micro/EColiPreparationDetail";
import type { ShigellaPreparation } from "../preparation_models/micro/ShigellaPreparation";
import ShigellaPreparationDetail, { createDefaultShigellaPreparation } from "./sub-components/micro/ShigellaPreparationDetail";
import ClostridiumPreparationDetail, { createDefaultClostridiumPreparation } from "./sub-components/micro/ClostridiumPreparationDetail";
import type { ClostridiumPreparation } from "../preparation_models/micro/ClostridiumPreparation";
import type { SalmonellaPreparation } from "../preparation_models/micro/SalmonellaPreparation";
import SalmonellaPreparationDetail, { createDefaultSalmonellaPreparation } from "./sub-components/micro/SalmonellaPreparationDetail";
import type { StaphylococcusPreparation } from "../preparation_models/micro/StaphylococcusPreparation";
import StaphylococcusPreparationDetail, { createDefaultStaphylococcusPreparation } from "./sub-components/micro/StaphylococcusPreparationDetail";
import type { PseudomonasPreparation } from "../preparation_models/micro/PseudomonasPreparation";
import type { BileTolerantPreparation } from "../preparation_models/micro/BileTolerantPreparation";
import PseudomonasPreparationDetail, { createDefaultPseudomonasPreparation } from "./sub-components/micro/PseudomonasPreparationDetail";
import BileTolerantPreparationDetail, { createDefaultBileTolerantPreparation } from "./sub-components/micro/BileTolerantPreparationDetail";
import type { BCepaciaPreparation } from "../preparation_models/micro/BCepaciaPreparation";
import type { CandidaAlbicansPreparation } from "../preparation_models/micro/CandidaAlbicansPreparation";
import CandidaAlbicansPreparationDetail, { createDefaultCandidaAlbicansPreparation } from "./sub-components/micro/CandidaAlbicansPreparationDetail";
import BCepaciaPreparationDetail, { createDefaultBCepaciaPreparation } from "./sub-components/micro/BCepaciaPreparationDetail";
import type { WorksheetChemical } from "../models/WorksheetChemical";
import type { WorksheetInstrument } from "../models/WorksheetInstrument";
import type { WorksheetMedia } from "../models/WorksheetMedia";

// SVG Icons
const Target: React.FC<{ className: string }> = ({ className }) => (
    <svg
        className={className}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
    >
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="12" r="6" />
        <circle cx="12" cy="12" r="2" />
    </svg>
);

const LoaderCircle: React.FC<{ className: string }> = ({ className }) => (
    <svg
        className={className + " animate-spin"}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
    >
        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
);

const Plus: React.FC<{ className: string }> = ({ className }) => (
    <svg
        className={className}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
    >
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
);

const Search: React.FC<{ className: string }> = ({ className }) => (
    <svg
        className={className}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
    >
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.35-4.35" />
    </svg>
);

const Check: React.FC<{ className: string }> = ({ className }) => (
    <svg
        className={className}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
    >
        <polyline points="20 6 9 17 4 12" />
    </svg>
);

const ReferenceLoading: React.FC = () => (
    <div className="flex items-center justify-center p-4 bg-emerald-50 border border-emerald-300 rounded-lg text-sm text-emerald-800 font-medium shadow-sm">
        <LoaderCircle className="w-5 h-5 mr-3" />
        Loading reference data (Instruments, Chemicals, Standards, Columns)...
    </div>
);

const ReferenceError: React.FC<{ error: string }> = ({ error }) => (
    <div className="p-4 bg-red-50 border border-red-300 rounded-lg text-sm text-red-700 font-medium shadow-sm">
        <div className="flex items-center mb-1">
            <Target className="w-5 h-5 mr-2" />
            Error loading reference data:
        </div>
        <p className="text-xs ml-7 break-words">{error}</p>
    </div>
);

interface WorksheetProps {
    worksheetId: string;
    instruments: Instrument[];
    media: Media[];
    chemicals: Chemical[];
    isReferenceDataLoading: boolean;
    referenceDataError: string | null;
    employeeId: string;
    role: string;
    department: string;
    onPrint?: (
        info: WorksheetDetail,
        analysts: Analyst[],
        sampleData: SampleData,
    ) => void;
    /** Bubble sidebar state up so App can render the shared sidebar */
    onSidebarStateChange?: (state: WorksheetSidebarState) => void;
    /** Bubble sidebar actions up so App can wire them */
    onSidebarActionsReady?: (actions: WorksheetSidebarActions) => void;
}

const PREPARATION_GROUPS = {
    sterility: { id: "sterility", label: "Preparation for Sterility", color: "emerald" },
    bet: { id: "bet", label: "Preparation for BET", color: "emerald" },
    ecoli: { id: "ecoli", label: "Preparation for E.coli", color: "emerald" },
    shigella: { id: "shigella", label: "Preparation for Shigella", color: "emerald" },
    clostridium: { id: "clostridium", label: "Preparation for Clostridium", color: "emerald" },
    salmonella: { id: "salmonella", label: "Preparation for Salmonella", color: "emerald" },
    staphylococcus: { id: "staphylococcus", label: "Preparation for Staphylococcus", color: "emerald" },
    pseudomonas: { id: "pseudomonas", label: "Preparation for Pseudomonas", color: "emerald" },
    bileTolerant: { id: "bileTolerant", label: "Preparation for Bile Tolerant Gram Negative", color: "emerald" },
    calbicans: { id: "calbicans", label: "Preparation for C.albicans", color: "emerald" },
    bcepacia: { id: "bcepacia", label: "Preparation for B.cepacia", color: "emerald" },
    totalViableCountWater: { id: "totalViableCountWater", label: "Preparation for Total Viable Count Water", color: "emerald" },
    tymc: { id: "tymc", label: "Preparation for TYMC", color: "emerald" },
    tamc: { id: "tamc", label: "Preparation for TAMC", color: "emerald" },
} as const;

function parseDateSafe(raw: string): Date | null {
    const s = raw.trim();
    // If it starts with YYYY (ISO format: YYYY-MM-DD...) parse directly
    if (/^\d{4}[-/]/.test(s)) {
        const d = new Date(s.replace(" ", "T"));
        return isNaN(d.getTime()) ? null : d;
    }
    // Otherwise treat as DD-MM-YYYY or DD/MM/YYYY (with optional HH:MM:SS)
    const m = s.match(/^(\d{1,2})[-/](\d{1,2})[-/](\d{4})(?:[T ](\d{2}:\d{2}(?::\d{2})?))?/);
    if (m) {
        const iso = `${m[3]}-${m[2].padStart(2, "0")}-${m[1].padStart(2, "0")}`;
        const d = new Date(m[4] ? `${iso}T${m[4]}` : `${iso}T00:00:00`);
        return isNaN(d.getTime()) ? null : d;
    }
    const d = new Date(s);
    return isNaN(d.getTime()) ? null : d;
}

function formatDate(raw: string | null | undefined): string {
    if (!raw) return "N/A";
    const d = parseDateSafe(String(raw));
    if (!d) return String(raw).trim() || "N/A";
    const DD = String(d.getDate()).padStart(2, "0");
    const MM = String(d.getMonth() + 1).padStart(2, "0");
    return `${DD}/${MM}/${d.getFullYear()}`;
}

const MicroWorksheet: React.FC<WorksheetProps> = ({
    worksheetId,
    instruments = [],
    chemicals = [],
    media = [],
    isReferenceDataLoading = false,
    referenceDataError = null,
    employeeId,
    role,
    department,
    onPrint,
    onSidebarStateChange,
    onSidebarActionsReady,
}) => {
    // Core state
    const [paramIdx, setParamIdx] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [registrationNo, setRegistrationNo] = useState("");
    const [worksheetInfo, setWorksheetInfo] = useState<WorksheetDetail | null>(
        null,
    );
    const [samplesData, setSamplesData] = useState<SampleData[]>([]);
    const [addedParameters, setAddedParameters] = useState<ParameterDetail[]>([]);
    const [showParameterDropdown, setShowParameterDropdown] = useState(false);
    const [selectedParamsForDetail, setSelectedParamsForDetail] = useState<
        number[]
    >([]);

    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [displayStatus, setDisplayStatus] = useState<string>("");

    const [sampleQuantity, setSampleQuantity] = useState<number | null>(null);
    const [natureOfSample, setNatureOfSample] = useState<string>("");
    const [isSavingSampleDetails, setIsSavingSampleDetails] = useState(false);
    const [isEditingSampleDetails, setIsEditingSampleDetails] = useState(false);

    const [saveSuccess, setSaveSuccess] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [analystMode, setAnalystMode] = useState<"add" | "reassign">("add");
    const [showAnalystDialog, setShowAnalystDialog] = useState(false);
    const [pendingParameter, setPendingParameter] =
        useState<ParameterDetail | null>(null);
    const [showSubmitDialog, setShowSubmitDialog] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [analysts, setAnalysts] = useState<Analyst[]>([]);

    const [showUnlockDialog, setShowUnlockDialog] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [parameterToUnlock, setParameterToUnlock] =
        useState<ParameterDetail | null>(null);
    const [parameterToDelete, setParameterToDelete] =
        useState<ParameterDetail | null>(null);
    const [isUnlocking, setIsUnlocking] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const [showStartAnalysisDialog, setShowStartAnalysisDialog] = useState(false);
    const [showCompleteAnalysisDialog, setShowCompleteAnalysisDialog] =
        useState(false);
    const [parameterForAnalysis, setParameterForAnalysis] =
        useState<ParameterDetail | null>(null);
    const [isStartingAnalysis, setIsStartingAnalysis] = useState(false);
    const [isCompletingAnalysis, setIsCompletingAnalysis] = useState(false);

    const [showApproveDialog, setShowApproveDialog] = useState(false);
    const [showDisapproveDialog, setShowDisapproveDialog] = useState(false);
    const [showRevisionDialog, setShowRevisionDialog] = useState(false);
    const [parameterForApproval, setParameterForApproval] =
        useState<ParameterDetail | null>(null);
    const [isApproving, setIsApproving] = useState(false);
    const [isDisapproving, setIsDisapproving] = useState(false);
    const [isRequestingRevision, setIsRequestingRevision] = useState(false);
    const [revisionComments, setRevisionComments] = useState("");

    const [showApproveWorksheetDialog, setShowApproveWorksheetDialog] =
        useState(false);
    const [isApprovingWorksheet, setIsApprovingWorksheet] = useState(false);

    const [showSubmitForQADialog, setShowSubmitForQADialog] = useState(false);
    const [isSubmittingForQA, setIsSubmittingForQA] = useState(false);

    // Per-parameter state
    const [columnsPerParam, setColumnsPerParam] = useState<
        Record<number, string>
    >({});

    const [addedInstruments, setAddedInstruments] = useState<
        Record<number, WorksheetInstrument[]>
    >({});
    const [addedChemicals, setAddedChemicals] = useState<
        Record<number, WorksheetChemical[]>
    >({});
    const [addedMedia, setAddedMedia] = useState<
        Record<number, WorksheetMedia[]>
    >({});

    const [additionalInfoPerParam, setAdditionalInfoPerParam] = useState<
        Record<number, string>
    >({});
    const [showAdditionalInfo, setShowAdditionalInfo] = useState<
        Record<number, boolean>
    >({});

    const [analysisStartDatePerParam, setAnalysisStartDatePerParam] = useState<
        Record<number, string>
    >({});
    const [analysisCompletionDatePerParam, setAnalysisCompletionDatePerParam] =
        useState<Record<number, string>>({});
    const [analyzedByPerParam, setAnalyzedByPerParam] = useState<
        Record<number, string>
    >({});
    const [analyzedByNamePerParam, setAnalyzedByNamePerParam] = useState<
        Record<number, string>
    >({});
    const [approvedByReviewerPerParam, setApprovedByPerParam] = useState<
        Record<number, string>
    >({});
    const [approvedByReviewerNamePerParam, setApprovedByNamePerParam] = useState<
        Record<number, string>
    >({});
    const [approvedAtReviewerPerParam, setApprovedAtPerParam] = useState<
        Record<number, string>
    >({});

    // QA-specific state
    const [approvedByQAPerParam, setApprovedByQAPerParam] = useState<
        Record<number, string>
    >({});
    const [approvedAtQAPerParam, setApprovedAtQAPerParam] = useState<
        Record<number, string>
    >({});
    const [remarksQAPerParam, setRemarksQAPerParam] = useState<
        Record<number, string | null>
    >({});
    const [remarksByReviewerPerParam, setRemarksByReviewerPerParam] = useState<
        Record<number, string | null>
    >({});
    const [remarksByAnalystPerParam, setRemarksByAnalystPerParam] = useState<
        Record<number, string | null>
    >({});
    const [preparationCompletedByPerParam, setPreparationCompletedByPerParam] =
        useState<Record<number, string>>({});
    const [preparationCompletedAtPerParam, setPreparationCompletedAtPerParam] =
        useState<Record<number, string>>({});

    const [groupPrepCompletedAtPerParam, setGroupPrepCompletedAtPerParam] =
        useState<Record<number, Record<string, string>>>({});

    // Complete / Unlock Preparation dialog state
    const [showCompletePreparationDialog, setShowCompletePreparationDialog] =
        useState(false);
    const [showUnlockPreparationDialog, setShowUnlockPreparationDialog] =
        useState(false);
    const [paramForPreparation, setParamForPreparation] =
        useState<ParameterDetail | null>(null);
    const [isCompletingPreparation, setIsCompletingPreparation] = useState(false);
    const [isUnlockingPreparation, setIsUnlockingPreparation] = useState(false);

    // Per-group prep dialog state
    const [showCompleteGroupPrepDialog, setShowCompleteGroupPrepDialog] =
        useState(false);
    const [showUnlockGroupPrepDialog, setShowUnlockGroupPrepDialog] =
        useState(false);
    const [groupPrepDialogParam, setGroupPrepDialogParam] =
        useState<ParameterDetail | null>(null);
    const [groupPrepDialogKey, setGroupPrepDialogKey] = useState<string>("");
    const [isCompletingGroupPrep, setIsCompletingGroupPrep] = useState(false);
    const [isUnlockingGroupPrep, setIsUnlockingGroupPrep] = useState(false);
    const [showQARevisionDialog, setShowQARevisionDialog] = useState(false);
    const [isQARequestingRevision, setIsQARequestingRevision] = useState(false);
    const [qaRevisionComments, setQARevisionComments] = useState("");
    const [parameterStatusPerParam, setParameterStatusPerParam] = useState<
        Record<number, string>
    >({});
    const [showPreparationDropdown, setShowPreparationDropdown] = useState<
        Record<number, boolean>
    >({});
    const [activePreparationGroups, setActivePreparationGroups] = useState<
        Record<number, string[]>
    >({});

    const [betPreparationsPerParam, setBetPreparationsPerParam] = useState<
        Record<number, BETPreparation[]>
    >({});

    const [sterilityPreparationsPerParam, setSterilityPreparationsPerParam] = useState<
        Record<number, SterilityPreparation[]>
    >({});
    const [ecoliPreparationsPerParam, setEcoliPreparationsPerParam] = useState<
        Record<string, EcoliPreparation[]>
    >({});

    const [clostridiumPreparationsPerParam, setClostridiumPreparationsPerParam] = useState<
        Record<number, ClostridiumPreparation[]>
    >({});

    const [shigellaPreparationsPerParam, setShigellaPreparationsPerParam] = useState<
        Record<number, ShigellaPreparation[]>
    >({});

    const [salmonellaPreparationsPerParam, setSalmonellaPreparationsPerParam] = useState<
        Record<number, SalmonellaPreparation[]>
    >({});

    const [staphylococcusPreparationsPerParam, setStaphylococcusPreparationsPerParam] = useState<
        Record<number, StaphylococcusPreparation[]>
    >({});

    const [pseudomonasPreparationsPerParam, setPseudomonasPreparationsPerParam] = useState<
        Record<number, PseudomonasPreparation[]>
    >({});

    const [bileTolerantPreparationsPerParam, setBileTolerantPreparationsPerParam] = useState<
        Record<number, BileTolerantPreparation[]>
    >({});

    const [bcepaciaPreparationsPerParam, setBcepaciaPreparationsPerParam] = useState<
        Record<number, BCepaciaPreparation[]>
    >({});

    const [calbicansPreparationsPerParam, setCalbicansPreparationsPerParam] = useState<
        Record<number, CandidaAlbicansPreparation[]>
    >({});

    const [filesPerParam, setFilesPerParam] = useState<
        Record<number, Record<string, AttachedFile[]>>
    >({});

    const [showParamFiles, setShowParamFiles] = useState<Record<number, boolean>>(
        {},
    );


    // Dropdown control states
    const [showInstrumentDropdown, setShowInstrumentDropdown] = useState(false);
    const [showChemicalDropdown, setShowChemicalDropdown] = useState(false);
    const [showMediaDropdown, setShowMediaDropdown] = useState(false);

    // Search states
    const [instrumentSearch, setInstrumentSearch] = useState("");
    const [chemicalSearch, setChemicalSearch] = useState("");
    const [mediaSearch, setMediaSearch] = useState("");

    const instrumentRef = useRef<HTMLDivElement>(null);
    const chemicalRef = useRef<HTMLDivElement>(null);
    const mediaRef = useRef<HTMLDivElement>(null);
    const preparationDropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        reloadWorksheet();
    }, [worksheetId]);

    const computeDisplayStatus = useCallback(() => {
        if (!worksheetInfo) return;

        const currentStatus = worksheetInfo.sample.status;

        if (currentStatus === "Submitted For Analysis") {
            const allStatuses = Object.values(parameterStatusPerParam);

            if (allStatuses.length > 0) {
                const allCompleted = allStatuses.every(
                    (status) => status === "Analysis Completed" || status === "Approved",
                );

                if (allCompleted) {
                    const allReviewerApproved = addedParameters.every(
                        (p) =>
                            (parameterStatusPerParam[p.id] || "").toLowerCase() ===
                            "approved",
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

    // Click outside handler
    const handleClickOutside = useCallback((event: MouseEvent) => {
        if (
            instrumentRef.current &&
            !instrumentRef.current.contains(event.target as Node)
        ) {
            setShowInstrumentDropdown(false);
        }
        if (
            chemicalRef.current &&
            !chemicalRef.current.contains(event.target as Node)
        ) {
            setShowChemicalDropdown(false);
        }
        if (
            mediaRef.current &&
            !mediaRef.current.contains(event.target as Node)
        ) {
            setShowMediaDropdown(false);
        }

        if (
            preparationDropdownRef.current &&
            !preparationDropdownRef.current.contains(event.target as Node)
        ) {
            setShowPreparationDropdown((prev) => {
                if (Object.keys(prev).length > 0) {
                    return {};
                }
                return prev;
            });
        }
    }, []);

    const isParameterLocked = useCallback(
        (parameterId: number): boolean => {
            const status = (
                parameterStatusPerParam[parameterId] || "created"
            ).toLowerCase();

            return [
                "analysis pending",
                "analysis started",
                "analysis completed",
                "analysis revision",
                "approved",
            ].includes(status);
        },
        [role, parameterStatusPerParam],
    );

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [handleClickOutside]);

    useEffect(() => {
        const fetchAllAnalysts = async () => {
            try {
                const analysts = await fetchAnalysts();

                setAnalysts(analysts.filter((a) =>
                    a.department?.toLowerCase().includes("microbiology")
                ));
            } catch (error) {
                console.error("Error fetching analysts:", error);
            }
        };

        fetchAllAnalysts();
    }, [role]);

    // Load worksheet data on mount
    useEffect(() => {
        const loadWorksheetData = async () => {
            if (!worksheetId) {
                setError("No worksheet ID provided");
                setIsLoading(false);
                return;
            }

            setIsLoading(true);
            setError(null);

            try {
                const requestData: FetchWorksheetRequest = { employeeId, role };
                const worksheetData = await fetchWorksheetById(
                    worksheetId,
                    requestData,
                );

                if (!worksheetData) {
                    setError("Worksheet not found");
                    setIsLoading(false);
                    return;
                }

                setWorksheetInfo(worksheetData);
                setRegistrationNo(worksheetData.sample.registrationNo);


                const request: SmapleDetailsRequest = {
                    regNo: worksheetData.sample.registrationNo,
                    lab: department,
                };
                const samples = await fetchSample(request);
                setSamplesData(samples);

                restoreWorksheetToState(worksheetData);
            } catch (err: any) {
                console.error("Error loading worksheet:", err);
                setError(err.message || "Failed to load worksheet");
            } finally {
                setIsLoading(false);
            }
        };

        loadWorksheetData();
    }, [worksheetId]);

    const restoreWorksheetToState = (worksheetData: WorksheetDetail) => {
        // Restore sample-level editable fields
        setSampleQuantity((worksheetData.sample as any).sampleQuantity ?? null);
        setNatureOfSample((worksheetData.sample as any).natureOfSample ?? "");

        const { parameters } = worksheetData;

        const restoredParams = parameters.map((param, index) => {
            const matchingParameter = parameters.find(
                (s) => s.paraCode === param.paraCode,
            );

            return {
                id: Date.now() + index,
                paraCode: param.paraCode,
                parameterName: param.parameterName,
                methodCode: param.methodCode,
                methodName: param.methodName,
                analyzedBy: param.analyzedBy,
                analysisStartDate: param.analysisStartDate,
                analysisCompletionDate: param.analysisCompletionDate,
                status: param.status,
                approvedByReviewer: param.approvedByReviewer,
                approvedAtReviewer: param.approvedAtReviewer,
                preparationCompletedBy: param.preparationCompletedBy,
                preparationCompletedAt: param.preparationCompletedAt,
                submittedQaBy: param.submittedQaBy,
                submittedQaByName: param.submittedQaByName,
                remarksByAnalyst: param.remarksByAnalyst,
                remarksByReviewer: param.remarksByReviewer,
                remarksByQA: param.remarksByQA,
                ...(matchingParameter || {}),
            };
        });

        setAddedParameters(restoredParams as any);

        const restoredFilesPerParam: Record<
            number,
            Record<string, AttachedFile[]>
        > = {};
        const restoredShowParamFiles: Record<number, boolean> = {};

        parameters.forEach((param, idx) => {
            const paramId = restoredParams[idx].id;

            if (param.analyzedBy) {
                setAnalyzedByPerParam((prev) => ({
                    ...prev,
                    [paramId]: param.analyzedBy!,
                }));
            }

            if (param.analyzedByName) {
                setAnalyzedByNamePerParam((prev) => ({
                    ...prev,
                    [paramId]: param.analyzedByName!,
                }));
            }

            if (param.analysisStartDate) {
                setAnalysisStartDatePerParam((prev) => ({
                    ...prev,
                    [paramId]: param.analysisStartDate!,
                }));
            }

            if (param.analysisCompletionDate) {
                setAnalysisCompletionDatePerParam((prev) => ({
                    ...prev,
                    [paramId]: param.analysisCompletionDate!,
                }));
            }

            if (param.status) {
                setParameterStatusPerParam((prev) => ({
                    ...prev,
                    [paramId]: param.status!,
                }));
            }

            if (param.approvedByReviewer) {
                setApprovedByPerParam((prev) => ({
                    ...prev,
                    [paramId]: param.approvedByReviewer!,
                }));
            }

            if (param.approvedByReviewerName) {
                setApprovedByNamePerParam((prev) => ({
                    ...prev,
                    [paramId]: param.approvedByReviewerName!,
                }));
            }

            if (param.approvedAtReviewer) {
                setApprovedAtPerParam((prev) => ({
                    ...prev,
                    [paramId]: param.approvedAtReviewer!,
                }));
            }

            if (param.approvedByQA) {
                setApprovedByQAPerParam((prev) => ({
                    ...prev,
                    [paramId]: param.approvedByQA!,
                }));
            }

            if (param.approvedAtQA) {
                setApprovedAtQAPerParam((prev) => ({
                    ...prev,
                    [paramId]: param.approvedAtQA!,
                }));
            }

            if (param.remarksByQA !== undefined) {
                setRemarksQAPerParam((prev) => ({
                    ...prev,
                    [paramId]: param.remarksByQA ?? null,
                }));
            }

            if (param.remarksByReviewer !== undefined) {
                setRemarksByReviewerPerParam((prev) => ({
                    ...prev,
                    [paramId]: param.remarksByReviewer ?? null,
                }));
            }

            if (param.remarksByAnalyst !== undefined) {
                setRemarksByAnalystPerParam((prev) => ({
                    ...prev,
                    [paramId]: param.remarksByAnalyst ?? null,
                }));
            }

            if (param.additional_info !== undefined) {
                setAdditionalInfoPerParam((prev) => ({
                    ...prev,
                    [paramId]: param.additional_info ?? "",
                }));
                if (param.additional_info) {
                    setShowAdditionalInfo((prev) => ({ ...prev, [paramId]: true }));
                }
            }

            if (param.preparationCompletedBy) {
                setPreparationCompletedByPerParam((prev) => ({
                    ...prev,
                    [paramId]: param.preparationCompletedBy!,
                }));
            }

            if (param.preparationCompletedAt) {
                setPreparationCompletedAtPerParam((prev) => ({
                    ...prev,
                    [paramId]: param.preparationCompletedAt!,
                }));

                // Sync groupPrepCompletedAt: mark whichever prep groups exist on this param as done.
                // groupPrepCompletedAtPerParam is local-only UI state derived from preparationCompletedAt.
                if (param.preparations && Array.isArray(param.preparations)) {
                    const groupKeys: Record<string, string> = {};
                    const at = param.preparationCompletedAt!;
                    const prepTypes = param.preparations.map(
                        (p: any) => p.preparationType,
                    );
                    if (prepTypes.includes("bet")) groupKeys["bet"] = at;
                }
            }

            // ------------------------------------------------------------------------
            // 2.3: Instruments
            // ------------------------------------------------------------------------
            if (param.instruments && Array.isArray(param.instruments)) {
            const worksheetInstruments = param.instruments as WorksheetInstrument[];
            if (worksheetInstruments.length > 0) {
                setAddedInstruments((prev) => ({
                ...prev,
                [paramId]: worksheetInstruments,
                }));
            }
            }
    
            // ------------------------------------------------------------------------
            // 2.4: Chemicals
            // ------------------------------------------------------------------------
            if (param.chemicals && Array.isArray(param.chemicals)) {
                const worksheetChemicals = param.chemicals as WorksheetChemical[];
                if (worksheetChemicals.length > 0) {
                    setAddedChemicals((prev) => ({
                    ...prev,
                    [paramId]: worksheetChemicals,
                    }));
                }
            }

            // ------------------------------------------------------------------------
            // 2.5: Media
            // ------------------------------------------------------------------------
            if (param.media && Array.isArray(param.media)) {
                const worksheetMedia = param.media as WorksheetMedia[];
                if (worksheetMedia.length > 0) {
                    setAddedMedia((prev) => ({
                    ...prev,
                    [paramId]: worksheetMedia,
                    }));
                }
            }


            // ------------------------------------------------------------------------
            // 2.6: PREPARATIONS (Main Logic - FIXED)
            // ------------------------------------------------------------------------
            if (
                param.preparations &&
                Array.isArray(param.preparations) &&
                param.preparations.length > 0
            ) {
                // Initialize collection arrays for each preparation type
                const preparationCollections = {
                    betPrep: [] as any[],
                    sterilityPrep: [] as any[],
                    ecoliPrep: [] as any[],
                    shigellaPrep: [] as any[],
                    clostridiumPrep: [] as any[],
                    salmonellaPrep: [] as any[],
                    staphylococcusPrep: [] as any[],
                    pseudomonasPrep: [] as any[],
                    bileTolerantPrep: [] as any[],
                    bcepaciaPrep: [] as any[],
                    calbicansPrep: [] as any[]
                };

                // Process each preparation
                param.preparations.forEach((prep: any, i: number) => {
                    const prepCategory = prep.preparationCategory;
                    const prepType = prep.preparationType;

                    if (prepType === "bet") {
                        try {
                            const betData = typeof prep.content === "string"
                                ? JSON.parse(prep.content)
                                : prep.content;
                            preparationCollections.betPrep.push({
                                ...betData,
                                id: Date.now() + i + 2000 + Math.random() * 1000,
                                label: prep.label || betData?.label || `BET Preparation ${i + 1}`,
                            });
                        } catch (e) {
                            console.warn(`  [WARNING]  Failed to parse BET prep content for: "${prep.label}"`, e);
                        }
                    } else {
                        console.warn(
                            `  [WARNING]  Unrecognized preparationCategory: "${prepCategory}" for prep: "${prep.label}"`,
                        );
                    }

                    if (prepType === "sterility") {
                        try {
                            const sterilityData = typeof prep.content === "string"
                                ? JSON.parse(prep.content)
                                : prep.content;
                            preparationCollections.sterilityPrep.push({
                                ...sterilityData,
                                id: Date.now() + i + 3000 + Math.random() * 1000,
                                label: prep.label || sterilityData?.label || `Sterility Preparation ${i + 1}`,
                            });
                        } catch (e) {
                            console.warn(`  [WARNING]  Failed to parse Sterility prep content for: "${prep.label}"`, e);
                        }
                    }

                    if (prepType === "ecoli") {
                        try {
                            const ecoliData = typeof prep.content === "string"
                                ? JSON.parse(prep.content)
                                : prep.content;
                            preparationCollections.ecoliPrep.push({
                                ...ecoliData,
                                id: Date.now() + i + 3000 + Math.random() * 1000,
                                label: prep.label || ecoliData?.label || `E.coli Preparation ${i + 1}`,
                            });
                        } catch (e) {
                            console.warn(`  [WARNING]  Failed to parse E.coli prep content for: "${prep.label}"`, e);
                        }
                    }

                    if (prepType === "clostridium") {
                        try {
                            const clostridiumData = typeof prep.content === "string"
                                ? JSON.parse(prep.content)
                                : prep.content;
                            preparationCollections.clostridiumPrep.push({
                                ...clostridiumData,
                                id: Date.now() + i + 3000 + Math.random() * 1000,
                                label: prep.label || clostridiumData?.label || `Clostridium Preparation ${i + 1}`,
                            });
                        } catch (e) {
                            console.warn(`  [WARNING]  Failed to parse Clostridium prep content for: "${prep.label}"`, e);
                        }
                    }

                    if (prepType === "salmonella") {
                        try {
                            const salmonellaData = typeof prep.content === "string"
                                ? JSON.parse(prep.content)
                                : prep.content;
                            preparationCollections.salmonellaPrep.push({
                                ...salmonellaData,
                                id: Date.now() + i + 3000 + Math.random() * 1000,
                                label: prep.label || salmonellaData?.label || `Salmonella Preparation ${i + 1}`,
                            });
                        } catch (e) {
                            console.warn(`  [WARNING]  Failed to parse Salmonella prep content for: "${prep.label}"`, e);
                        }
                    }

                    if (prepType === "shigella") {
                        try {
                            const shigellaData = typeof prep.content === "string"
                                ? JSON.parse(prep.content)
                                : prep.content;
                            preparationCollections.shigellaPrep.push({
                                ...shigellaData,
                                id: Date.now() + i + 3000 + Math.random() * 1000,
                                label: prep.label || shigellaData?.label || `Shigella Preparation ${i + 1}`,
                            });
                        } catch (e) {
                            console.warn(`  [WARNING]  Failed to parse Shigella prep content for: "${prep.label}"`, e);
                        }
                    }

                    if (prepType === "staphylococcus") {
                        try {
                            const staphylococcusData = typeof prep.content === "string"
                                ? JSON.parse(prep.content)
                                : prep.content;
                            preparationCollections.staphylococcusPrep.push({
                                ...staphylococcusData,
                                id: Date.now() + i + 3000 + Math.random() * 1000,
                                label: prep.label || staphylococcusData?.label || `Staphylococcus Preparation ${i + 1}`,
                            });
                        } catch (e) {
                            console.warn(`  [WARNING]  Failed to parse Staphylococcus prep content for: "${prep.label}"`, e);
                        }
                    }

                    if (prepType === "pseudomonas") {
                        try {
                            const pseudomonasData = typeof prep.content === "string"
                                ? JSON.parse(prep.content)
                                : prep.content;
                            preparationCollections.pseudomonasPrep.push({
                                ...pseudomonasData,
                                id: Date.now() + i + 3000 + Math.random() * 1000,
                                label: prep.label || pseudomonasData?.label || `Pseudomonas Preparation ${i + 1}`,
                            });
                        } catch (e) {
                            console.warn(`  [WARNING]  Failed to parse Pseudomonas prep content for: "${prep.label}"`, e);
                        }
                    }

                    if (prepType === "bileTolerant") {
                        try {
                            const bileTolerantData = typeof prep.content === "string"
                                ? JSON.parse(prep.content)
                                : prep.content;
                            preparationCollections.bileTolerantPrep.push({
                                ...bileTolerantData,
                                id: Date.now() + i + 3000 + Math.random() * 1000,
                                label: prep.label || bileTolerantData?.label || `BileTolerant Preparation ${i + 1}`,
                            });
                        } catch (e) {
                            console.warn(`  [WARNING]  Failed to parse BileTolerant prep content for: "${prep.label}"`, e);
                        }
                    }

                    if (prepType === "calbicans") {
                        try {
                            const calbicansData = typeof prep.content === "string"
                                ? JSON.parse(prep.content)
                                : prep.content;
                            preparationCollections.calbicansPrep.push({
                                ...calbicansData,
                                id: Date.now() + i + 3000 + Math.random() * 1000,
                                label: prep.label || calbicansData?.label || `C.albicans Preparation ${i + 1}`,
                            });
                        } catch (e) {
                            console.warn(`  [WARNING]  Failed to parse C.albicans prep content for: "${prep.label}"`, e);
                        }
                    }

                    if (prepType === "bcepacia") {
                        try {
                            const bcepaciaData = typeof prep.content === "string"
                                ? JSON.parse(prep.content)
                                : prep.content;
                            preparationCollections.bcepaciaPrep.push({
                                ...bcepaciaData,
                                id: Date.now() + i + 3000 + Math.random() * 1000,
                                label: prep.label || bcepaciaData?.label || `B.cepacia Preparation ${i + 1}`,
                            });
                        } catch (e) {
                            console.warn(`  [WARNING]  Failed to parse B.cepacia prep content for: "${prep.label}"`, e);
                        }
                    }
                });

                // BET preparations
                if (preparationCollections.betPrep.length > 0) {
                    setBetPreparationsPerParam((prev) => ({
                        ...prev,
                        [paramId]: preparationCollections.betPrep,
                    }));
                    setActivePreparationGroups((prev) => ({
                        ...prev,
                        [paramId]: [...(prev[paramId] || []).filter((g) => g !== "bet"), "bet"],
                    }));
                }

                // Sterility preparations
                if (preparationCollections.sterilityPrep.length > 0) {
                    setSterilityPreparationsPerParam((prev) => ({
                        ...prev,
                        [paramId]: preparationCollections.sterilityPrep,
                    }));
                    setActivePreparationGroups((prev) => ({
                        ...prev,
                        [paramId]: [...(prev[paramId] || []).filter((g) => g !== "sterility"), "sterility"],
                    }));
                }

                // E.coli preparations
                if (preparationCollections.ecoliPrep.length > 0) {
                    setEcoliPreparationsPerParam((prev) => ({
                        ...prev,
                        [paramId]: preparationCollections.ecoliPrep,
                    }));
                    setActivePreparationGroups((prev) => ({
                        ...prev,
                        [paramId]: [...(prev[paramId] || []).filter((g) => g !== "ecoli"), "ecoli"],
                    }));
                }

                // Clostridium preparations
                if (preparationCollections.clostridiumPrep.length > 0) {
                    setClostridiumPreparationsPerParam((prev) => ({
                        ...prev,
                        [paramId]: preparationCollections.clostridiumPrep,
                    }));
                    setActivePreparationGroups((prev) => ({
                        ...prev,
                        [paramId]: [...(prev[paramId] || []).filter((g) => g !== "clostridium"), "clostridium"],
                    }));
                }

                // Salmonella preparations
                if (preparationCollections.salmonellaPrep.length > 0) {
                    setSalmonellaPreparationsPerParam((prev) => ({
                        ...prev,
                        [paramId]: preparationCollections.salmonellaPrep,
                    }));
                    setActivePreparationGroups((prev) => ({
                        ...prev,
                        [paramId]: [...(prev[paramId] || []).filter((g) => g !== "salmonella"), "salmonella"],
                    }));
                }

                // Shigella preparations
                if (preparationCollections.shigellaPrep.length > 0) {
                    setShigellaPreparationsPerParam((prev) => ({
                        ...prev,
                        [paramId]: preparationCollections.shigellaPrep,
                    }));
                    setActivePreparationGroups((prev) => ({
                        ...prev,
                        [paramId]: [...(prev[paramId] || []).filter((g) => g !== "shigella"), "shigella"],
                    }));
                }

                // Staphylococcus preparations
                if (preparationCollections.staphylococcusPrep.length > 0) {
                    setStaphylococcusPreparationsPerParam((prev) => ({
                        ...prev,
                        [paramId]: preparationCollections.staphylococcusPrep,
                    }));
                    setActivePreparationGroups((prev) => ({
                        ...prev,
                        [paramId]: [...(prev[paramId] || []).filter((g) => g !== "staphylococcus"), "staphylococcus"],
                    }));
                }

                // Pseudomonas preparations
                if (preparationCollections.pseudomonasPrep.length > 0) {
                    setPseudomonasPreparationsPerParam((prev) => ({
                        ...prev,
                        [paramId]: preparationCollections.pseudomonasPrep,
                    }));
                    setActivePreparationGroups((prev) => ({
                        ...prev,
                        [paramId]: [...(prev[paramId] || []).filter((g) => g !== "pseudomonas"), "pseudomonas"],
                    }));
                }

                // BileTolerant preparations
                if (preparationCollections.bileTolerantPrep.length > 0) {
                    setBileTolerantPreparationsPerParam((prev) => ({
                        ...prev,
                        [paramId]: preparationCollections.bileTolerantPrep,
                    }));
                    setActivePreparationGroups((prev) => ({
                        ...prev,
                        [paramId]: [...(prev[paramId] || []).filter((g) => g !== "bileTolerant"), "bileTolerant"],
                    }));
                }

                // BCepacia preparations
                if (preparationCollections.bcepaciaPrep.length > 0) {
                    setBcepaciaPreparationsPerParam((prev) => ({
                        ...prev,
                        [paramId]: preparationCollections.bcepaciaPrep,
                    }));
                    setActivePreparationGroups((prev) => ({
                        ...prev,
                        [paramId]: [...(prev[paramId] || []).filter((g) => g !== "bcepacia"), "bcepacia"],
                    }));
                }

                // Candida Albicans preparations
                if (preparationCollections.calbicansPrep.length > 0) {
                    setCalbicansPreparationsPerParam((prev) => ({
                        ...prev,
                        [paramId]: preparationCollections.calbicansPrep,
                    }));
                    setActivePreparationGroups((prev) => ({
                        ...prev,
                        [paramId]: [...(prev[paramId] || []).filter((g) => g !== "calbicans"), "calbicans"],
                    }));
                }
            }

            const prepLabelMapping: Record<string, number> = {};

            // Map all preparation labels to IDs for calculation linking
            if (param.preparations && Array.isArray(param.preparations)) {
                param.preparations.forEach((prep: any, i: number) => {
                    if (prep.label) {
                        prepLabelMapping[prep.label] =
                            Date.now() + i + 1000 + Math.random() * 1000;
                    }
                });
            }

            const activeGroups: string[] = [];

            if (param.preparations && Array.isArray(param.preparations)) {
                if (param.preparations.some((p: any) => p.preparationType === "bet")) {
                    activeGroups.push("bet");
                }
            }

            if (param.files && Array.isArray(param.files) && param.files.length > 0) {
                const slotMap: Record<string, AttachedFile[]> = {};

                for (const f of param.files) {
                    // Treat null / undefined / empty-string all as "no value"
                    const hasType = f.preparationType != null && f.preparationType !== "";
                    const hasLabel = f.label != null && f.label !== "";

                    // Param-level files have neither type nor label
                    const slotKey =
                        !hasType && !hasLabel
                            ? "param_level"
                            : `${hasType ? f.preparationType : ""}|${hasLabel ? f.label : ""}`;

                    if (!slotMap[slotKey]) slotMap[slotKey] = [];
                    slotMap[slotKey].push({
                        id: f.id ?? 0,
                        fileName: f.fileName,
                        fileDataBase64: f.fileDataBase64 ?? null,
                        preparationType: hasType ? f.preparationType : null,
                        label: hasLabel ? f.label : null,
                    });
                }

                restoredFilesPerParam[paramId] = slotMap;

                // Show param-level section if we have param-level files
                if (slotMap["param_level"]?.length) {
                    restoredShowParamFiles[paramId] = true;
                }
            }

            if (activeGroups.length > 0) {
                setActivePreparationGroups((prev) => ({
                    ...prev,
                    [paramId]: activeGroups,
                }));
            }
        });

        // Set file state once cleanly — no stale merging with old paramIds
        setFilesPerParam(restoredFilesPerParam);
        setShowParamFiles(restoredShowParamFiles);

        setSelectedParamsForDetail(restoredParams.map((p) => p.id));
    };


    useEffect(() => {
        if (!instruments) return;
    }, [instruments]);

    useEffect(() => {
        if (!chemicals) return;
    }, [chemicals]);

    useEffect(() => {
        if (!media) return;
    }, [media]);


    const collectFormDataForAPI = (): WorksheetRequest => {
        return {
            role: role,
            worksheetId: worksheetId,
            registrationInfo: {
                registrationNo: worksheetInfo?.sample.registrationNo || registrationNo,
                sampleName: worksheetInfo?.sample?.sampleName!,
                numberOfParameters: addedParameters.length!,
                dueDate: worksheetInfo?.sample?.dueDate!,
                lab: worksheetInfo?.sample.lab!,
                sampleQuantity: sampleQuantity!,
                natureOfSample: natureOfSample!,
            },
            documentInfo: {
                preparedBy: employeeId,
                status: worksheetInfo?.sample.status,
                approvedAt: worksheetInfo?.sample?.approvedAt || null,
            },
            parameters: addedParameters.map((param) => {
                const preparations = [
                    // BET Preparations
                    ...(betPreparationsPerParam[param.id] || []).map((bp) => ({
                        label: bp.label,
                        preparationType: "bet",
                        preparationCategory: null,
                        assignedStandardId: null,
                        steps: null,
                        content: JSON.stringify(bp),
                    })),
                    ...(sterilityPreparationsPerParam[param.id] || []).map((st) => ({
                        label: st.label,
                        preparationType: "sterility",
                        preparationCategory: null,
                        assignedStandardId: null,
                        steps: null,
                        content: JSON.stringify(st),
                    })),
                    ...(ecoliPreparationsPerParam[param.id] || []).map((ecl) => ({
                        label: ecl.label,
                        preparationType: "ecoli",
                        preparationCategory: null,
                        assignedStandardId: null,
                        steps: null,
                        content: JSON.stringify(ecl),
                    })),
                    ...(clostridiumPreparationsPerParam[param.id] || []).map((cls) => ({
                        label: cls.label,
                        preparationType: "clostridium",
                        preparationCategory: null,
                        assignedStandardId: null,
                        steps: null,
                        content: JSON.stringify(cls),
                    })),
                    ...(salmonellaPreparationsPerParam[param.id] || []).map((slm) => ({
                        label: slm.label,
                        preparationType: "salmonella",
                        preparationCategory: null,
                        assignedStandardId: null,
                        steps: null,
                        content: JSON.stringify(slm),
                    })),
                    ...(shigellaPreparationsPerParam[param.id] || []).map((sgl) => ({
                        label: sgl.label,
                        preparationType: "shigella",
                        preparationCategory: null,
                        assignedStandardId: null,
                        steps: null,
                        content: JSON.stringify(sgl),
                    })),
                    ...(staphylococcusPreparationsPerParam[param.id] || []).map((stp) => ({
                        label: stp.label,
                        preparationType: "staphylococcus",
                        preparationCategory: null,
                        assignedStandardId: null,
                        steps: null,
                        content: JSON.stringify(stp),
                    })),
                    ...(pseudomonasPreparationsPerParam[param.id] || []).map((psu) => ({
                        label: psu.label,
                        preparationType: "pseudomonas",
                        preparationCategory: null,
                        assignedStandardId: null,
                        steps: null,
                        content: JSON.stringify(psu),
                    })),
                    ...(bileTolerantPreparationsPerParam[param.id] || []).map((bt) => ({
                        label: bt.label,
                        preparationType: "bileTolerant",
                        preparationCategory: null,
                        assignedStandardId: null,
                        steps: null,
                        content: JSON.stringify(bt),
                    })),
                    ...(calbicansPreparationsPerParam[param.id] || []).map((ca) => ({
                        label: ca.label,
                        preparationType: "calbicans",
                        preparationCategory: null,
                        assignedStandardId: null,
                        steps: null,
                        content: JSON.stringify(ca),
                    })),
                    ...(bcepaciaPreparationsPerParam[param.id] || []).map((bc) => ({
                        label: bc.label,
                        preparationType: "bcepacia",
                        preparationCategory: null,
                        assignedStandardId: null,
                        steps: null,
                        content: JSON.stringify(bc),
                    })),
                ];

                return {
                    id: param.id,
                    paraCode: param.paraCode,
                    parameterName: param.parameterName,
                    methodCode: param.methodCode,
                    methodName: param.methodName,
                    columnId: columnsPerParam[param.id] || null,
                    diluentPreparation: null,
                    otherInfo: null,
                    analysisStartDate: analysisStartDatePerParam[param.id] || null,
                    analysisCompletionDate:
                        analysisCompletionDatePerParam[param.id] || null,
                    analyzedBy: analyzedByPerParam[param.id] || null,
                    approvedByReviewer: approvedByReviewerPerParam[param.id] || null,
                    approvedAtReviewer: approvedAtReviewerPerParam[param.id] || null,
                    approvedByQA: approvedByQAPerParam[param.id] || null,
                    approvedAtQA: approvedAtQAPerParam[param.id] || null,
                    remarksByQA: remarksQAPerParam[param.id] ?? null,
                    remarksByReviewer: remarksByReviewerPerParam[param.id] ?? null,
                    remarksByAnalyst: remarksByAnalystPerParam[param.id] ?? null,
                    preparationCompletedBy:
                        preparationCompletedByPerParam[param.id] || null,
                    preparationCompletedAt:
                        preparationCompletedAtPerParam[param.id] || null,
                    status: parameterStatusPerParam[param.id] || "Created",
                    instruments: (addedInstruments[param.id] || []).map((inst) => ({
                        instrumentId: inst.instrumentId,
                        name: inst.name,
                        instrumentTag: inst.instrumentTag,
                        make: inst.make,
                        calibrationDoneDate: inst.calibrationDoneDate,
                        calibrationDueDate: inst.calibrationDueDate,
                    })),
                    chemicals: (addedChemicals[param.id] || []).map((chem) => ({
                        slno: chem.slno,
                        name: chem.name,
                        code: chem.code,
                        make: chem.make,
                        batchNo: chem.batchNo,
                        expDate: chem.expDate,
                    })),
                    media: (addedMedia[param.id] || []).map((m) => ({
                        mediaId: m.id,
                        name: m.name,
                        code: m.code,
                        expDate: m.expDate,
                        quantityValue: m.quantityValue,
                        quantityUnit: m.quantityUnit,
                    })),
                    standardIds: null,
                    preparations,
                    files: collectFilesForParam(param.id),
                };
            }),
        };
    };

    const reloadWorksheet = async () => {
        if (!worksheetId) return;

        setError(null);

        try {
            const requestData: FetchWorksheetRequest = { employeeId, role };

            const worksheetData = await fetchWorksheetById(worksheetId, requestData);

            if (!worksheetData) {
                setError("Worksheet not found");
                return;
            }


            setWorksheetInfo(worksheetData);
            setRegistrationNo(worksheetData.sample.registrationNo);

            const request: SmapleDetailsRequest = {
                regNo: worksheetData.sample.registrationNo,
                lab: department,
            };
            const samples = await fetchSample(request);
            setSamplesData(samples);

            setAddedParameters([]);
            setSelectedParamsForDetail([]);
            setFilesPerParam({});
            setShowParamFiles({});
            setIsEditingSampleDetails(false);

            restoreWorksheetToState(worksheetData);
        } catch (err: any) {
            setError(err.message || "Failed to reload worksheet");
        } finally {
            setIsLoading(false);
        }
    };

    const handlePrintClick = () => {
        // samplesData is an array so always truthy — guard with .length
        if (onPrint && worksheetInfo && analysts && samplesData?.length) {
            onPrint(worksheetInfo, analysts, samplesData[0]);
        }
    };

    const handleSaveDraft = async () => {
        setIsSaving(true);
        const worksheetData = collectFormDataForAPI();

        try {
            if (role === "Reviewer" || role === "QA") {
                const response = await updateWorksheet(worksheetId, worksheetData);

                if (response && response.worksheetId) {
                    setToastMessage(`Draft saved successfully: ${response.worksheetId}`);
                    setShowToast(true);
                    setSaveSuccess(true);
                    setTimeout(() => setSaveSuccess(false), 3000);
                    await reloadWorksheet();
                } else {
                    setToastMessage("Failed to save draft");
                    setShowToast(true);
                    setTimeout(() => {
                        setShowToast(false);
                    }, 4000);
                }
            } else {
                worksheetData!.parameters!.forEach(async (param) => {
                    const response = await updateParameter(param.id, param);

                    if (response && response.parameterId) {
                        setToastMessage(`Draft saved successfully: ${worksheetId}`);
                        setShowToast(true);
                        setSaveSuccess(true);
                        setTimeout(() => setSaveSuccess(false), 3000);
                        await reloadWorksheet();
                    } else {
                        setToastMessage("Failed to save draft");
                        setShowToast(true);
                        setTimeout(() => {
                            setShowToast(false);
                        }, 4000);
                        return;
                    }
                });
                setSaveSuccess(true);
            }
        } catch (err: any) {
            setToastMessage(`Failed to save draft: ${err.message}`);
            console.error("Save draft error:", err);
            setShowToast(true);
            setTimeout(() => {
                setShowToast(false);
            }, 4000);
        } finally {
            setIsSaving(false);
        }
    };

    const handleSubmitForAnalysis = async () => {
        setIsSubmitting(true);

        // await handleSaveDraft();

        try {
            const worksheetData = collectFormDataForAPI();
            const currentWorksheetStatus = worksheetInfo?.sample.status;

            const createdParameters = worksheetData?.parameters?.filter(
                (param) =>
                    (parameterStatusPerParam[param.id] || "created").toLowerCase() ===
                    "created",
            );

            if (createdParameters!.length === 0) {
                setToastMessage("No parameters with 'created' status to submit");
                setShowToast(true);
                setTimeout(() => {
                    setShowToast(false);
                }, 4000);
                setIsSubmitting(false);
                setShowSubmitDialog(false);
                return;
            }

            // Update parameter status to "Analysis Pending"
            const updatedParameters = createdParameters!.map((param) => ({
                ...param,
                status: "Analysis Pending",
            }));

            if (currentWorksheetStatus === "Draft") {
                // If worksheet is Draft, update entire worksheet status
                const updatedWorksheetData = {
                    ...worksheetData,
                    parameters: worksheetData?.parameters?.map((param) => {
                        const isCreated =
                            (parameterStatusPerParam[param.id] || "created").toLowerCase() ===
                            "created";
                        return {
                            ...param,
                            status: isCreated ? "Analysis Pending" : param.status,
                        };
                    }),
                    documentInfo: {
                        ...worksheetData?.documentInfo,
                        status: "Submitted For Analysis",
                    },
                };

                const response = await updateWorksheet(
                    worksheetId,
                    updatedWorksheetData,
                );

                if (response && response.worksheetId) {
                    setWorksheetInfo((prev) =>
                        prev
                            ? {
                                ...prev,
                                sample: {
                                    ...prev.sample,
                                    status: "Submitted For Analysis",
                                },
                            }
                            : null,
                    );

                    // Update parameter statuses in local state
                    updatedParameters.forEach((param) => {
                        setParameterStatusPerParam((prev) => ({
                            ...prev,
                            [param.id]: "Analysis Pending",
                        }));
                    });

                    setToastMessage("Worksheet submitted for analysis successfully!");
                    setShowToast(true);
                    setTimeout(() => {
                        setShowToast(false);
                    }, 4000);
                    await insertWorksheetLog({
                        worksheetId,
                        action: "Submitted For Analysis",
                        remarks: "Worksheet submitted for analysis",
                        employeeId,
                        role,
                    });
                } else {
                    setToastMessage("Failed to submit worksheet!");
                    setShowToast(true);
                    setTimeout(() => {
                        setShowToast(false);
                    }, 4000);
                }
            } else if (currentWorksheetStatus === "Submitted For Analysis") {
                // If already submitted, only update individual parameters
                for (const param of updatedParameters) {
                    const response = await updateParameter(param.id, param);

                    if (response && response.parameterId) {
                        // Update local state for this parameter
                        setParameterStatusPerParam((prev) => ({
                            ...prev,
                            [param.id]: "Analysis Pending",
                        }));
                    } else {
                        setToastMessage(
                            `Failed to update parameter ${param.parameterName}`,
                        );
                        setShowToast(true);
                        setTimeout(() => {
                            setShowToast(false);
                        }, 4000);
                        setIsSubmitting(false);
                        setShowSubmitDialog(false);
                        return;
                    }
                }
                setToastMessage("Parameters submitted for analysis successfully!");
                setShowToast(true);
                setTimeout(() => {
                    setShowToast(false);
                }, 4000);
                await insertWorksheetLog({
                    worksheetId,
                    action: "Parameters Submitted For Analysis",
                    remarks: `${updatedParameters.length} parameter(s) submitted for analysis`,
                    employeeId,
                    role,
                });
            }

            setShowSubmitDialog(false);
        } catch (err: any) {
            setToastMessage(`Failed to submit: ${err.message}`);
            setShowToast(true);
            setTimeout(() => {
                setShowToast(false);
            }, 4000);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleAddParameter = (param: ParameterDetail) => {
        if (addedParameters.find((p) => p.paraCode === param.paraCode)) {
            return;
        }

        setPendingParameter(param);
        setShowAnalystDialog(true);
    };

    const handleReassignAnalyst = (paramId: number) => {
        const paramToReassign = addedParameters.find((p) => p.id === paramId);

        if (!paramToReassign) return;

        setAnalystMode("reassign");
        setPendingParameter(paramToReassign);
        setShowAnalystDialog(true);
    };

    const handleAnalystSelected = async (
        employeeId: string,
        employeeName: string,
    ) => {
        if (!pendingParameter) return;

        try {
            if (analystMode === "add") {
                const newId = paramIdx + 1;
                setParamIdx(newId);
                const newParameter = { ...pendingParameter, id: newId };

                setAddedParameters((prev) => [...prev, newParameter]);

                setAnalyzedByPerParam((prev) => ({
                    ...prev,
                    [newId]: employeeId,
                }));

                setAnalyzedByNamePerParam((prev) => ({
                    ...prev,
                    [newId]: employeeName,
                }));

                setParameterStatusPerParam((prev) => ({
                    ...prev,
                    [newId]: "Created",
                }));

                setToastMessage(`Adding parameter "${newParameter.parameterName}"...`);
                setShowToast(true);

                try {
                    const parameterData = {
                        paraCode: newParameter.paraCode,
                        parameterName: newParameter.parameterName,
                        methodCode: newParameter.methodCode,
                        methodName: newParameter.methodName,
                        columnId: columnsPerParam[newId] || null,
                        diluentPreparation: null,
                        otherInfo: null,
                        analyzedBy: employeeId,
                        approvedByReviewer: null,
                        analysisStartDate: null,
                        analysisCompletionDate: null,
                        approvedAtReviewer: null,
                        status: "Created",
                        instrumentIds: (addedInstruments[newId] || []).map(
                            (inst) => inst.id,
                        ),
                        chemicalIds: (addedChemicals[newId] || []).map((chem) => chem.slno),
                        mediaIds: (addedMedia[newId] || []).map(
                            (chem) => chem.id,
                        ),
                        standardIds: null,
                        preparations: [

                            // BET Preparations
                            ...(betPreparationsPerParam[newId] || []).map((bp) => ({
                                label: bp.label,
                                preparationType: "bet",
                                preparationCategory: null,
                                assignedStandardId: null,
                                steps: null,
                                content: JSON.stringify(bp),
                            })),
                        ],
                        files: collectFilesForParam(newId),
                    };

                    const response = await addParameter(worksheetId, parameterData);

                    setAddedParameters((prev) =>
                        prev.map((p) =>
                            p.id === newId ? { ...p, id: response.parameterId } : p,
                        ),
                    );

                    const serverParameterId = response.parameterId;

                    setAnalyzedByPerParam((prev) => {
                        const { [newId]: analyzedBy, ...rest } = prev;
                        return { ...rest, [serverParameterId]: analyzedBy };
                    });

                    setAnalyzedByNamePerParam((prev) => {
                        const { [newId]: analyzedByName, ...rest } = prev;
                        return { ...rest, [serverParameterId]: analyzedByName };
                    });

                    setParameterStatusPerParam((prev) => {
                        const { [newId]: status, ...rest } = prev;
                        return { ...rest, [serverParameterId]: status };
                    });

                    if (columnsPerParam[newId]) {
                        setColumnsPerParam((prev) => {
                            const { [newId]: column, ...rest } = prev;
                            return { ...rest, [serverParameterId]: column };
                        });
                    }

                    if (additionalInfoPerParam[newId]) {
                        setAdditionalInfoPerParam((prev) => {
                            const { [newId]: additionalInfo, ...rest } = prev;
                            return { ...rest, [serverParameterId]: additionalInfo };
                        });
                    }

                    if (addedInstruments[newId]) {
                        setAddedInstruments((prev) => {
                            const { [newId]: instruments, ...rest } = prev;
                            return { ...rest, [serverParameterId]: instruments };
                        });
                    }

                    if (addedChemicals[newId]) {
                        setAddedChemicals((prev) => {
                            const { [newId]: chemicals, ...rest } = prev;
                            return { ...rest, [serverParameterId]: chemicals };
                        });
                    }

                    if (addedMedia[newId]) {
                        setAddedMedia((prev) => {
                            const { [newId]: media, ...rest } = prev;
                            return { ...rest, [serverParameterId]: media };
                        });
                    }

                    setToastMessage(
                        `Parameter "${newParameter.parameterName}" added successfully!`,
                    );
                    setShowToast(true);
                    setTimeout(() => setShowToast(false), 3000);
                    await insertWorksheetLog({
                        worksheetId,
                        parameterId: response.parameterId,
                        action: "Parameter Added",
                        remarks: `Parameter "${newParameter.parameterName}" (${newParameter.paraCode}) added`,
                        employeeId,
                        role,
                    });
                } catch (error) {
                    console.error("Error adding parameter:");
                    console.error(
                        "Error type:",
                        error instanceof Error ? error.constructor.name : typeof error,
                    );
                    console.error(
                        "Error message:",
                        error instanceof Error ? error.message : String(error),
                    );
                    console.error("Full error object:", error);

                    setAddedParameters((prev) => prev.filter((p) => p.id !== newId));

                    const cleanupState = (setter: Function) => {
                        setter((prev: any) => {
                            const { [newId]: _, ...rest } = prev;
                            return rest;
                        });
                    };

                    cleanupState(setAnalyzedByPerParam);
                    cleanupState(setParameterStatusPerParam);
                    cleanupState(setColumnsPerParam);
                    cleanupState(setAdditionalInfoPerParam);
                    cleanupState(setShowAdditionalInfo);
                    cleanupState(setAddedInstruments);
                    cleanupState(setAddedChemicals);

                    setToastMessage(
                        error instanceof Error
                            ? `Failed to add parameter: ${error.message}`
                            : "Failed to add parameter. Please try again.",
                    );
                    setShowToast(true);
                    setTimeout(() => setShowToast(false), 4000);
                }
            }

            if (analystMode === "reassign") {
                const paramId = pendingParameter.id;

                setAnalyzedByPerParam((prev) => ({
                    ...prev,
                    [paramId]: employeeId,
                }));

                setToastMessage("Reassigning analyst...");
                setShowToast(true);

                const param = addedParameters.find((p) => p.id === paramId);
                if (param) {
                    try {
                        const paramData = {
                            id: paramId,
                            paraCode: param.paraCode,
                            parameterName: param.parameterName,
                            methodCode: param.methodCode,
                            methodName: param.methodName,
                            columnId: columnsPerParam[paramId] || null,
                            diluentPreparation: null,
                            otherInfo: null,
                            analyzedBy: employeeId,
                            approvedByReviewer: approvedByReviewerPerParam[paramId] || null,
                            analysisStartDate: analysisStartDatePerParam[paramId] || null,
                            analysisCompletionDate:
                                analysisCompletionDatePerParam[paramId] || null,
                            approvedAtReviewer: approvedAtReviewerPerParam[paramId] || null,
                            preparationCompletedBy:
                                preparationCompletedByPerParam[paramId] || null,
                            preparationCompletedAt:
                                preparationCompletedAtPerParam[paramId] || null,
                            remarksByAnalyst: remarksByAnalystPerParam[paramId] || null,
                            status: parameterStatusPerParam[paramId] || "Created",
                            instrumentIds: (addedInstruments[paramId] || []).map(
                                (inst) => inst.id,
                            ),
                            chemicalIds: (addedChemicals[paramId] || []).map(
                                (chem) => chem.slno,
                            ),
                            mediaIds: (addedMedia[paramId] || []).map(
                                (chem) => chem.id,
                            ),
                            standardIds: null,
                            standardPreparations: [],
                            samplePreparations: [],
                            calculations: [],
                            files: [],
                        };

                        const response = await updateParameter(paramId, paramData);

                        if (response && response.parameterId) {
                            setToastMessage("Analyst reassigned successfully!");
                            setShowToast(true);
                            setTimeout(() => setShowToast(false), 3000);
                            await insertWorksheetLog({
                                worksheetId,
                                parameterId: paramId,
                                action: "Analyst Reassigned",
                                remarks: `Analyst reassigned for parameter "${param?.parameterName}"`,
                                employeeId,
                                role,
                            });
                        } else {
                            console.error("Update failed: Invalid response from server");
                            console.error("Response received:", response);

                            setToastMessage(
                                "Analyst reassigned but failed to save. Please save manually.",
                            );
                            setShowToast(true);
                            setTimeout(() => setShowToast(false), 4000);
                        }
                    } catch (error) {
                        console.error("Error updating parameter:");
                        console.error(
                            "Error type:",
                            error instanceof Error ? error.constructor.name : typeof error,
                        );
                        console.error(
                            "Error message:",
                            error instanceof Error ? error.message : String(error),
                        );
                        console.error("Full error object:", error);

                        setToastMessage("Failed to reassign analyst. Please try again.");
                        setShowToast(true);
                        setTimeout(() => setShowToast(false), 4000);
                    }
                } else {
                    console.error("Parameter not found for reassignment");
                    console.error("Parameter ID:", paramId);
                    console.error(
                        "Available parameters:",
                        addedParameters.map((p) => ({ id: p.id, name: p.parameterName })),
                    );
                }
            }

            setPendingParameter(null);
            setAnalystMode("add");
            setShowAnalystDialog(false);
            setShowParameterDropdown(false);
        } catch (error) {
            console.error("Error in handleAnalystSelected:");
            console.error(
                "Error type:",
                error instanceof Error ? error.constructor.name : typeof error,
            );
            console.error(
                "Error message:",
                error instanceof Error ? error.message : String(error),
            );
            console.error("Full error object:", error);
            console.error("Analyst Mode:", analystMode);
            console.error("Pending Parameter:", pendingParameter);

            setToastMessage("Failed to process parameter. Please try again.");
            setShowToast(true);
            setTimeout(() => setShowToast(false), 3000);
        }
    };

    const handleRemoveParameter = (id: number) => {
        setAddedParameters(addedParameters.filter((p) => p.id !== id));
        setSelectedParamsForDetail(
            selectedParamsForDetail.filter((paramId) => paramId !== id),
        );

        // Clean up all related state
        const cleanupState = (setter: Function) => {
            setter((prev: any) => {
                const { [id]: _, ...rest } = prev;
                return rest;
            });
        };

        // Clean up all parameter-related states
        cleanupState(setAnalyzedByPerParam);
        cleanupState(setApprovedByPerParam);
        cleanupState(setAnalyzedByNamePerParam);
        cleanupState(setApprovedByNamePerParam);
        cleanupState(setAnalysisStartDatePerParam);
        cleanupState(setAnalysisCompletionDatePerParam);
        cleanupState(setApprovedAtPerParam);
        cleanupState(setParameterStatusPerParam);
        cleanupState(setAddedInstruments);
        cleanupState(setAddedChemicals);
        cleanupState(setColumnsPerParam);
        cleanupState(setAdditionalInfoPerParam);
        cleanupState(setShowAdditionalInfo);
        cleanupState(setActivePreparationGroups);
        cleanupState(setRemarksByAnalystPerParam);
        cleanupState(setPreparationCompletedByPerParam);
        cleanupState(setPreparationCompletedAtPerParam);
    };

    const toggleParameterDetail = (id: number) => {
        setSelectedParamsForDetail((prev) =>
            prev.includes(id)
                ? prev.filter((paramId) => paramId !== id)
                : [...prev, id],
        );
    };

    const areAllParametersApproved = useCallback((): boolean => {
        if (addedParameters.length === 0) return false;

        // For QA: worksheet approval is available when all params are Reviewer-approved (status = "approved")
        // and none have been returned for revision (no pending remarksQA)
        return addedParameters.every((param) => {
            const status = (
                parameterStatusPerParam[param.id] || "created"
            ).toLowerCase();
            return status === "approved";
        });
    }, [addedParameters, parameterStatusPerParam]);

    // ── Bubble sidebar state/actions up to App ──────────────────────────────
    //
    // Problem: registering actions once on mount captures stale closures.
    // handlePrintClick closes over worksheetInfo/analysts/samplesData which are
    // null at mount time, so onPrint() never fires when the button is clicked.
    //
    // Fix: use a stable ref-forwarding pattern. We pass a stable object whose
    // function bodies delegate to refs that are updated every render. This way:
    //   • App receives the object once (no re-registration loop)
    //   • Every click always invokes the current closure
    //
    const _printRef = useRef(handlePrintClick);
    const _saveDraftRef = useRef(handleSaveDraft);
    const _submitAnalysisRef = useRef(() => setShowSubmitDialog(true));
    const _submitQARef = useRef(() => setShowSubmitForQADialog(true));
    const _approveRef = useRef(() => setShowApproveWorksheetDialog(true));

    // Keep refs current every render (cheap assignment, no effect needed)
    _printRef.current = handlePrintClick;
    _saveDraftRef.current = handleSaveDraft;
    _submitAnalysisRef.current = () => setShowSubmitDialog(true);
    _submitQARef.current = () => setShowSubmitForQADialog(true);
    _approveRef.current = () => setShowApproveWorksheetDialog(true);

    useEffect(() => {
        onSidebarActionsReady?.({
            onBack: () => window.history.back(),
            onSaveDraft: () => _saveDraftRef.current(),
            onSubmitForAnalysis: () => _submitAnalysisRef.current(),
            onSubmitForQA: () => _submitQARef.current(),
            onApproveWorksheet: () => _approveRef.current(),
            onPrintReport: () => _printRef.current(),
            onContentReady: function (): void {
                throw new Error("Function not implemented.");
            },
            onToggleAuditTrail: function (): void {
                throw new Error("Function not implemented.");
            }
        });
        // Stable object registered once. The ref wrappers above always delegate
        // to the latest handler, so no stale-closure problem.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        onSidebarStateChange?.({
            worksheetId,
            displayStatus,
            sampleName: worksheetInfo?.sample?.sampleName ?? "",
            registrationNo: worksheetInfo?.sample?.registrationNo ?? registrationNo,
            worksheetStatus: worksheetInfo?.sample?.status ?? null,
            role,
            isSaving,
            saveSuccess,
            isSubmitting,
            isSubmittingForQA,
            isApprovingWorksheet,
            showSaveDraft: worksheetInfo?.sample?.status !== "Approved",
            showSubmitForAnalysis: role === "Reviewer" &&
                (worksheetInfo?.sample?.status === "Draft" ||
                    worksheetInfo?.sample?.status === "Submitted For Analysis") &&
                addedParameters.some(
                    (p) => (parameterStatusPerParam[p.id] || "created").toLowerCase() ===
                        "created"
                ),
            showSubmitForQA: role === "Reviewer" &&
                worksheetInfo?.sample?.status === "Submitted For Analysis" &&
                areAllParametersApproved(),
            showApproveWorksheet: role === "QA" &&
                worksheetInfo?.sample?.status === "Submitted For QA Review" &&
                addedParameters.length > 0 &&
                areAllParametersApproved(),
            showPrintReport: worksheetInfo?.sample?.status === "Approved",
            isContentLoading: isLoading,
            includeAuditTrail: false
        });
    }, [
        worksheetId, displayStatus, worksheetInfo, registrationNo, role,
        isSaving, saveSuccess, isSubmitting, isSubmittingForQA, isApprovingWorksheet,
        addedParameters, parameterStatusPerParam, areAllParametersApproved,
        onSidebarStateChange,
    ]);
    // ────────────────────────────────────────────────────────────────────────

    const handleInitiateUnlock = (param: ParameterDetail) => {
        setParameterToUnlock(param);
        setShowUnlockDialog(true);
    };

    const handleConfirmUnlock = async () => {
        if (!parameterToUnlock) return;

        setIsUnlocking(true);

        try {
            // Update parameter status to "created"
            const updatedParam = {
                ...parameterToUnlock,
                status: "created",
                analyzedBy: null,
                analyzedByName: null,
                analysisStartDate: null,
            };

            const response = await updateParameter(
                parameterToUnlock.id,
                updatedParam,
            );

            if (response && response.parameterId) {
                // Update local state
                setParameterStatusPerParam((prev) => ({
                    ...prev,
                    [parameterToUnlock.id]: "created",
                }));

                setToastMessage("Parameter unlocked successfully!");
                setShowToast(true);
                setTimeout(() => {
                    setShowToast(false);
                }, 4000);

                setShowUnlockDialog(false);
                setParameterToUnlock(null);
            } else {
                setToastMessage("Failed to unlock parameter!");
                setShowToast(true);
                setTimeout(() => {
                    setShowToast(false);
                }, 4000);
            }
        } catch (error) {
            setToastMessage(`Error unlocking parameter:${error}`);

            setShowToast(true);
            setTimeout(() => {
                setShowToast(false);
            }, 4000);
        } finally {
            setIsUnlocking(false);
        }
    };

    // ── Helper: build full parameter payload matching collectFormDataForAPI shape ──
    const buildFullParamPayload = (
        paramId: number,
        overrides: {
            preparationCompletedBy?: string | null;
            preparationCompletedAt?: string | null;
        } = {},
    ) => {
        const param = addedParameters.find((p) => p.id === paramId);
        if (!param) return null;

        const preparations = [
            ...(betPreparationsPerParam[param.id] || []).map((bp) => ({
                label: bp.label,
                preparationType: "bet",
                preparationCategory: null,
                assignedStandardId: null,
                steps: null,
                content: JSON.stringify(bp),
            })),
            ...(sterilityPreparationsPerParam[param.id] || []).map((st) => ({
                label: st.label,
                preparationType: "sterility",
                preparationCategory: null,
                assignedStandardId: null,
                steps: null,
                content: JSON.stringify(st),
            })),
            ...(ecoliPreparationsPerParam[param.id] || []).map((ecl) => ({
                label: ecl.label,
                preparationType: "ecoli",
                preparationCategory: null,
                assignedStandardId: null,
                steps: null,
                content: JSON.stringify(ecl),
            })),
            ...(clostridiumPreparationsPerParam[param.id] || []).map((cls) => ({
                label: cls.label,
                preparationType: "clostridium",
                preparationCategory: null,
                assignedStandardId: null,
                steps: null,
                content: JSON.stringify(cls),
            })),
            ...(salmonellaPreparationsPerParam[param.id] || []).map((slm) => ({
                label: slm.label,
                preparationType: "salmonella",
                preparationCategory: null,
                assignedStandardId: null,
                steps: null,
                content: JSON.stringify(slm),
            })),
            ...(shigellaPreparationsPerParam[param.id] || []).map((sgl) => ({
                label: sgl.label,
                preparationType: "shigella",
                preparationCategory: null,
                assignedStandardId: null,
                steps: null,
                content: JSON.stringify(sgl),
            })),
            ...(staphylococcusPreparationsPerParam[param.id] || []).map((stp) => ({
                label: stp.label,
                preparationType: "staphylococcus",
                preparationCategory: null,
                assignedStandardId: null,
                steps: null,
                content: JSON.stringify(stp),
            })),
            ...(pseudomonasPreparationsPerParam[param.id] || []).map((psu) => ({
                label: psu.label,
                preparationType: "pseudomonas",
                preparationCategory: null,
                assignedStandardId: null,
                steps: null,
                content: JSON.stringify(psu),
            })),
            ...(bileTolerantPreparationsPerParam[param.id] || []).map((bt) => ({
                label: bt.label,
                preparationType: "bileTolerant",
                preparationCategory: null,
                assignedStandardId: null,
                steps: null,
                content: JSON.stringify(bt),
            })),
            ...(calbicansPreparationsPerParam[param.id] || []).map((ca) => ({
                label: ca.label,
                preparationType: "calbicans",
                preparationCategory: null,
                assignedStandardId: null,
                steps: null,
                content: JSON.stringify(ca),
            })),
            ...(bcepaciaPreparationsPerParam[param.id] || []).map((bc) => ({
                label: bc.label,
                preparationType: "bcepacia",
                preparationCategory: null,
                assignedStandardId: null,
                steps: null,
                content: JSON.stringify(bc),
            })),
        ];


        // Build explicit payload — never spread ...param to avoid stale field contamination
        return {
            id: param.id,
            paraCode: param.paraCode,
            parameterName: param.parameterName,
            methodCode: param.methodCode,
            methodName: param.methodName,
            columnId: columnsPerParam[paramId] || null,
            diluentPreparation: null,
            otherInfo: null,
            additional_info: additionalInfoPerParam[paramId] || null,
            analysisStartDate: analysisStartDatePerParam[paramId] || null,
            analysisCompletionDate: analysisCompletionDatePerParam[paramId] || null,
            analyzedBy: analyzedByPerParam[paramId] || null,
            approvedByReviewer: approvedByReviewerPerParam[paramId] || null,
            approvedAtReviewer: approvedAtReviewerPerParam[paramId] || null,
            approvedByQA: approvedByQAPerParam[paramId] || null,
            approvedAtQA: approvedAtQAPerParam[paramId] || null,
            remarksByQA: remarksQAPerParam[paramId] ?? null,
            remarksByReviewer: remarksByReviewerPerParam[paramId] ?? null,
            remarksByAnalyst: remarksByAnalystPerParam[paramId] ?? null,
            // These two are the whole point — always explicit, never from stale param spread
            preparationCompletedBy:
                "preparationCompletedBy" in overrides
                    ? (overrides.preparationCompletedBy ?? null)
                    : preparationCompletedByPerParam[paramId] || null,
            preparationCompletedAt:
                "preparationCompletedAt" in overrides
                    ? (overrides.preparationCompletedAt ?? null)
                    : preparationCompletedAtPerParam[paramId] || null,
            status: parameterStatusPerParam[paramId] || "Created",
            instrumentIds: (addedInstruments[paramId] || []).map((i) => i.id),
            chemicalIds: (addedChemicals[paramId] || []).map((c) => c.slno),
            mediaIds: (addedMedia[paramId] || []).map(
                (chem) => chem.id,
            ),
            preparations,
            files: collectFilesForParam(paramId),
        };
    };


    const handleConfirmCompletePreparation = async () => {
        if (!paramForPreparation) return;
        setIsCompletingPreparation(true);
        try {
            const paramId = paramForPreparation.id;
            const completedBy = employeeId;
            const completedAt = new Date().toISOString();
            const paramData = buildFullParamPayload(paramId, {
                preparationCompletedBy: completedBy,
                preparationCompletedAt: completedAt,
            });
            if (paramData) {
                const response = await updateParameter(paramId, paramData);
                if (response && response.parameterId) {
                    setPreparationCompletedByPerParam((prev) => ({
                        ...prev,
                        [paramId]: completedBy,
                    }));
                    setPreparationCompletedAtPerParam((prev) => ({
                        ...prev,
                        [paramId]: completedAt,
                    }));
                    setToastMessage("Preparation marked as complete!");
                    setShowToast(true);
                    setTimeout(() => setShowToast(false), 4000);
                    await insertWorksheetLog({
                        worksheetId,
                        parameterId: paramId,
                        action: "Preparation Completed",
                        remarks: `Preparation completed for parameter "${paramForPreparation.parameterName}"`,
                        employeeId,
                        role,
                    });
                } else {
                    setToastMessage("Failed to complete preparation!");
                    setShowToast(true);
                    setTimeout(() => setShowToast(false), 4000);
                }
            }
        } catch (error) {
            setToastMessage(`Error completing preparation: ${error}`);
            setShowToast(true);
            setTimeout(() => setShowToast(false), 4000);
        } finally {
            setIsCompletingPreparation(false);
            setShowCompletePreparationDialog(false);
            setParamForPreparation(null);
        }
    };

    // ── Unlock Preparation handlers ──

    const handleConfirmUnlockPreparation = async () => {
        if (!paramForPreparation) return;
        setIsUnlockingPreparation(true);
        try {
            const paramId = paramForPreparation.id;
            const paramData = buildFullParamPayload(paramId, {
                preparationCompletedBy: null,
                preparationCompletedAt: null,
            });
            if (paramData) {
                const response = await updateParameter(paramId, paramData);
                if (response && response.parameterId) {
                    setPreparationCompletedByPerParam((prev) => {
                        const { [paramId]: _, ...r } = prev;
                        return r;
                    });
                    setPreparationCompletedAtPerParam((prev) => {
                        const { [paramId]: _, ...r } = prev;
                        return r;
                    });
                    setToastMessage("Preparation unlocked successfully!");
                    setShowToast(true);
                    setTimeout(() => setShowToast(false), 4000);
                    await insertWorksheetLog({
                        worksheetId,
                        parameterId: paramId,
                        action: "Preparation Unlocked",
                        remarks: `Preparation unlocked for parameter "${paramForPreparation.parameterName}"`,
                        employeeId,
                        role,
                    });
                } else {
                    setToastMessage("Failed to unlock preparation!");
                    setShowToast(true);
                    setTimeout(() => setShowToast(false), 4000);
                }
            }
        } catch (error) {
            setToastMessage(`Error unlocking preparation: ${error}`);
            setShowToast(true);
            setTimeout(() => setShowToast(false), 4000);
        } finally {
            setIsUnlockingPreparation(false);
            setShowUnlockPreparationDialog(false);
            setParamForPreparation(null);
        }
    };
    // ── Per-group Preparation handlers ──

    const handleConfirmCompleteGroupPrep = async () => {
        if (!groupPrepDialogParam) return;
        setIsCompletingGroupPrep(true);
        try {
            const paramId = groupPrepDialogParam.id;
            const completedBy = employeeId;
            const completedAt = new Date().toISOString();
            // Use the same preparationCompletedBy/At fields as the main prep complete.
            // groupPrepDialogKey identifies which group triggered it (for UI/toast only).
            const paramData = buildFullParamPayload(paramId, {
                preparationCompletedBy: completedBy,
                preparationCompletedAt: completedAt,
            });
            if (paramData) {
                const response = await updateParameter(paramId, paramData);
                if (response && response.parameterId) {
                    setPreparationCompletedByPerParam((prev) => ({
                        ...prev,
                        [paramId]: completedBy,
                    }));
                    setPreparationCompletedAtPerParam((prev) => ({
                        ...prev,
                        [paramId]: completedAt,
                    }));
                    // Also update local groupPrepCompletedAt so the UI reflects this group as done
                    setGroupPrepCompletedAtPerParam((prev) => ({
                        ...prev,
                        [paramId]: {
                            ...(prev[paramId] || {}),
                            [groupPrepDialogKey]: completedAt,
                        },
                    }));
                    setToastMessage(
                        `${groupPrepDialogKey.toUpperCase()} preparation marked as complete!`,
                    );
                    setShowToast(true);
                    setTimeout(() => setShowToast(false), 4000);
                    await insertWorksheetLog({
                        worksheetId,
                        parameterId: paramId,
                        action: "Preparation Completed",
                        remarks: `${groupPrepDialogKey} preparation completed for parameter "${groupPrepDialogParam.parameterName}"`,
                        employeeId,
                        role,
                    });
                } else {
                    setToastMessage("Failed to complete preparation!");
                    setShowToast(true);
                    setTimeout(() => setShowToast(false), 4000);
                }
            }
        } catch (error) {
            setToastMessage(`Error completing preparation: ${error}`);
            setShowToast(true);
            setTimeout(() => setShowToast(false), 4000);
        } finally {
            setIsCompletingGroupPrep(false);
            setShowCompleteGroupPrepDialog(false);
            setGroupPrepDialogParam(null);
            setGroupPrepDialogKey("");
        }
    };


    const handleConfirmUnlockGroupPrep = async () => {
        if (!groupPrepDialogParam) return;
        setIsUnlockingGroupPrep(true);
        try {
            const paramId = groupPrepDialogParam.id;
            // Clear preparationCompletedBy/At — same field as the main prep unlock.
            const paramData = buildFullParamPayload(paramId, {
                preparationCompletedBy: null,
                preparationCompletedAt: null,
            });
            if (paramData) {
                const response = await updateParameter(paramId, paramData);
                if (response && response.parameterId) {
                    setPreparationCompletedByPerParam((prev) => {
                        const { [paramId]: _, ...r } = prev;
                        return r;
                    });
                    setPreparationCompletedAtPerParam((prev) => {
                        const { [paramId]: _, ...r } = prev;
                        return r;
                    });
                    // Also clear local groupPrepCompletedAt for this group so UI updates
                    setGroupPrepCompletedAtPerParam((prev) => {
                        const g = { ...(prev[paramId] || {}) };
                        delete g[groupPrepDialogKey];
                        return { ...prev, [paramId]: g };
                    });
                    setToastMessage(
                        `${groupPrepDialogKey.toUpperCase()} preparation unlocked!`,
                    );
                    setShowToast(true);
                    setTimeout(() => setShowToast(false), 4000);
                    await insertWorksheetLog({
                        worksheetId,
                        parameterId: paramId,
                        action: "Group Preparation Unlocked",
                        remarks: `${groupPrepDialogKey} preparation unlocked for parameter "${groupPrepDialogParam.parameterName}"`,
                        employeeId,
                        role,
                    });
                } else {
                    setToastMessage("Failed to unlock preparation!");
                    setShowToast(true);
                    setTimeout(() => setShowToast(false), 4000);
                }
            }
        } catch (error) {
            setToastMessage(`Error unlocking preparation: ${error}`);
            setShowToast(true);
            setTimeout(() => setShowToast(false), 4000);
        } finally {
            setIsUnlockingGroupPrep(false);
            setShowUnlockGroupPrepDialog(false);
            setGroupPrepDialogParam(null);
            setGroupPrepDialogKey("");
        }
    };

    const handleInitiateDelete = (param: ParameterDetail) => {
        setParameterToDelete(param);
        setShowDeleteDialog(true);
    };

    const handleConfirmDelete = async () => {
        if (!parameterToDelete) return;

        setIsDeleting(true);

        try {
            await deleteParameter(parameterToDelete.id);
            handleRemoveParameter(parameterToDelete.id);
            setShowDeleteDialog(false);
            setToastMessage("Parameter deleted successfully!");
            setShowToast(true);
            setTimeout(() => {
                setShowToast(false);
            }, 4000);
            await insertWorksheetLog({
                worksheetId,
                parameterId: parameterToDelete.id,
                action: "Parameter Deleted",
                remarks: `Parameter "${parameterToDelete.parameterName}" (${parameterToDelete.paraCode}) deleted`,
                employeeId,
                role,
            });
        } catch (error) {
            setToastMessage("Failed to delete parameter!");

            setShowToast(true);
            setTimeout(() => {
                setShowToast(false);
            }, 4000);
        } finally {
            setIsDeleting(false);
        }
    };

    // Check if parameter is editable for Analyst
    const isParameterEditableForAnalyst = useCallback(
        (parameterId: number): boolean => {
            if (role !== "Analyst") return false;
            const status = (
                parameterStatusPerParam[parameterId] || "created"
            ).toLowerCase();
            return ["created", "analysis started", "analysis revision"].includes(
                status,
            );
        },
        [role, parameterStatusPerParam],
    );

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
                remarksByQA: null, // Clear QA remarks when Reviewer re-approves
                remarksByReviewer: remarks || null,
            };

            const response = await updateParameter(
                parameterForApproval.id,
                updatedParam,
            );

            if (response && response.parameterId) {
                setParameterStatusPerParam((prev) => ({
                    ...prev,
                    [parameterForApproval.id]: "Approved",
                }));

                setApprovedByPerParam((prev) => ({
                    ...prev,
                    [parameterForApproval.id]: employeeId,
                }));

                setApprovedAtPerParam((prev) => ({
                    ...prev,
                    [parameterForApproval.id]: updatedParam.approvedAtReviewer,
                }));

                // Clear QA remarks locally when Reviewer re-approves
                setRemarksQAPerParam((prev) => ({
                    ...prev,
                    [parameterForApproval.id]: null,
                }));

                // Save reviewer remarks
                setRemarksByReviewerPerParam((prev) => ({
                    ...prev,
                    [parameterForApproval.id]: remarks || null,
                }));

                setToastMessage("Parameter approved successfully!");
                setShowToast(true);
                setTimeout(() => {
                    setShowToast(false);
                }, 4000);
                await insertWorksheetLog({
                    worksheetId,
                    parameterId: parameterForApproval.id,
                    action: "Parameter Approved",
                    remarks: remarks || "Parameter approved by Reviewer",
                    employeeId,
                    role,
                });
                setShowApproveDialog(false);
                setParameterForApproval(null);
            } else {
                setToastMessage("Failed to approve parameter!");
                setShowToast(true);
                setTimeout(() => {
                    setShowToast(false);
                }, 4000);
            }
        } catch (error) {
            setToastMessage(`Error approving parameter:${error}`);
            setShowToast(true);
            setTimeout(() => {
                setShowToast(false);
            }, 4000);
        } finally {
            setIsApproving(false);
        }
    };

    const handleConfirmDisapprove = async () => {
        if (!parameterForApproval) return;

        setIsDisapproving(true);
        try {
            const updatedParam = {
                ...parameterForApproval,
                status: "Disapproved",
                approvedByReviewer: employeeId,
                approvedAtReviewer: new Date().toISOString(),
            };

            const response = await updateParameter(
                parameterForApproval.id,
                updatedParam,
            );

            if (response && response.parameterId) {
                setParameterStatusPerParam((prev) => ({
                    ...prev,
                    [parameterForApproval.id]: "Disapproved",
                }));

                setApprovedByPerParam((prev) => ({
                    ...prev,
                    [parameterForApproval.id]: employeeId,
                }));

                setApprovedAtPerParam((prev) => ({
                    ...prev,
                    [parameterForApproval.id]: updatedParam.approvedAtReviewer,
                }));

                setToastMessage("Parameter disapproved successfully!");
                setShowToast(true);
                setTimeout(() => {
                    setShowToast(false);
                }, 4000);
                await insertWorksheetLog({
                    worksheetId,
                    parameterId: parameterForApproval.id,
                    action: "Parameter Disapproved",
                    remarks: "Parameter disapproved by Reviewer",
                    employeeId,
                    role,
                });
                setShowDisapproveDialog(false);
                setParameterForApproval(null);
            } else {
                setToastMessage("Failed to disapprove parameter!");
                setShowToast(true);
                setTimeout(() => {
                    setShowToast(false);
                }, 4000);
            }
        } catch (error) {
            setToastMessage(`Error while disapproving parameter: ${error}`);
            setShowToast(true);
            setTimeout(() => {
                setShowToast(false);
            }, 4000);
        } finally {
            setIsDisapproving(false);
        }
    };

    const handleConfirmRevision = async (comments: string) => {
        setIsRequestingRevision(true);
        try {
            const updatedParam = {
                ...parameterForApproval,
                status: "Analysis Revision",
                revisionComments: comments,
                remarksByReviewer: comments,
            };

            const response = await updateParameter(
                parameterForApproval?.id!,
                updatedParam!,
            );

            if (response && response.parameterId) {
                setParameterStatusPerParam((prev) => ({
                    ...prev,
                    [parameterForApproval?.id!]: "Analysis Revision",
                }));

                setRemarksByReviewerPerParam((prev) => ({
                    ...prev,
                    [parameterForApproval?.id!]: comments,
                }));

                setToastMessage("Revision requested successfully!");
                setShowToast(true);
                setTimeout(() => {
                    setShowToast(false);
                }, 4000);
                await insertWorksheetLog({
                    worksheetId,
                    parameterId: parameterForApproval?.id,
                    action: "Revision Requested",
                    remarks: comments || "Revision requested by Reviewer",
                    employeeId,
                    role,
                });
                setShowRevisionDialog(false);
                setParameterForApproval(null);
                setRevisionComments("");
            } else {
                setToastMessage("Failed to request revision!");
                setShowToast(true);
                setTimeout(() => {
                    setShowToast(false);
                }, 4000);
            }
        } catch (error) {
            setToastMessage(`Error requesting revision: ${error}`);
            setShowToast(true);
            setTimeout(() => {
                setShowToast(false);
            }, 4000);
        } finally {
            setIsRequestingRevision(false);
        }
    };

    // ===== QA HANDLERS =====
    const handleQARequestRevision = (param: ParameterDetail) => {
        setParameterForApproval(param);
        setShowQARevisionDialog(true);
    };

    const handleConfirmQARevision = async (comments: string) => {
        if (!parameterForApproval) return;

        setIsQARequestingRevision(true);
        try {
            const updatedParam = {
                ...parameterForApproval,
                status: "Analysis Revision",
                remarksByQA: comments,
            };

            const response = await updateParameter(
                parameterForApproval.id,
                updatedParam,
            );

            if (response && response.parameterId) {
                setParameterStatusPerParam((prev) => ({
                    ...prev,
                    [parameterForApproval.id]: "Analysis Revision",
                }));
                setRemarksQAPerParam((prev) => ({
                    ...prev,
                    [parameterForApproval.id]: comments,
                }));

                setToastMessage("Revision requested by QA successfully!");
                setShowToast(true);
                setTimeout(() => setShowToast(false), 4000);
                await insertWorksheetLog({
                    worksheetId,
                    parameterId: parameterForApproval.id,
                    action: "QA Revision Requested",
                    remarks: comments || "Revision requested by QA",
                    employeeId,
                    role,
                });
                setShowQARevisionDialog(false);
                setParameterForApproval(null);
                setQARevisionComments("");
            } else {
                setToastMessage("Failed to request QA revision!");
                setShowToast(true);
                setTimeout(() => setShowToast(false), 4000);
            }
        } catch (error) {
            setToastMessage(`Error requesting QA revision: ${error}`);
            setShowToast(true);
            setTimeout(() => setShowToast(false), 4000);
        } finally {
            setIsQARequestingRevision(false);
        }
    };

    // Handle start analysis button click
    const handleStartAnalysis = (param: ParameterDetail) => {
        setParameterForAnalysis(param);
        setShowStartAnalysisDialog(true);
    };

    // Handle confirm start analysis
    const handleConfirmStartAnalysis = async () => {
        if (!parameterForAnalysis) return;

        setIsStartingAnalysis(true);
        try {
            // Update parameter status to "Analysis Started"
            const updatedParam = {
                ...parameterForAnalysis,
                status: "Analysis Started",
                analysisStartDate: new Date().toISOString(), // Current date
            };

            const response = await updateParameter(
                parameterForAnalysis.id,
                updatedParam,
            );

            if (response && response.parameterId) {
                // Update local state
                setParameterStatusPerParam((prev) => ({
                    ...prev,
                    [parameterForAnalysis.id]: "Analysis Started",
                }));

                setAnalysisStartDatePerParam((prev) => ({
                    ...prev,
                    [parameterForAnalysis.id]: updatedParam.analysisStartDate,
                }));

                setToastMessage(
                    "Analysis started successfully! You can now proceed with the analysis.",
                );
                setShowToast(true);
                setTimeout(() => {
                    setShowToast(false);
                }, 4000);
                await insertWorksheetLog({
                    worksheetId,
                    parameterId: parameterForAnalysis.id,
                    action: "Analysis Started",
                    remarks: `Analysis started for parameter "${parameterForAnalysis.parameterName}"`,
                    employeeId,
                    role,
                });
                setShowStartAnalysisDialog(false);
                setParameterForAnalysis(null);
            } else {
                setToastMessage("Failed to start analysis!");
                setShowToast(true);
                setTimeout(() => {
                    setShowToast(false);
                }, 4000);
            }
        } catch (error) {
            setToastMessage(`Error starting analysis: ${error}`);
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
        const currentWorksheetData = collectFormDataForAPI();

        const curParam = currentWorksheetData.parameters?.filter(
            (parameter) => parameter.id === param.id,
        )[0];

        setParameterForAnalysis(curParam ?? param);
        setShowCompleteAnalysisDialog(true);
    };

    // Handle confirm complete analysis
    const handleConfirmCompleteAnalysis = async (comment: string) => {
        if (!parameterForAnalysis) return;

        setIsCompletingAnalysis(true);
        try {
            const updatedParam = {
                ...parameterForAnalysis,
                status: "Analysis Completed",
                analysisCompletionDate: new Date().toISOString(),
                remarksByAnalyst: comment || null,
            };

            const response = await updateParameter(
                parameterForAnalysis.id,
                updatedParam,
            );

            if (response && response.parameterId) {
                // Update local state
                setParameterStatusPerParam((prev) => ({
                    ...prev,
                    [parameterForAnalysis.id]: "Analysis Completed",
                }));

                setAnalysisCompletionDatePerParam((prev) => ({
                    ...prev,
                    [parameterForAnalysis.id]: updatedParam.analysisCompletionDate,
                }));

                if (comment) {
                    setRemarksByAnalystPerParam((prev) => ({
                        ...prev,
                        [parameterForAnalysis.id]: comment,
                    }));
                }

                setToastMessage(
                    "Analysis completed successfully! Submitted for Reviewer approval.",
                );
                setShowToast(true);
                setTimeout(() => {
                    setShowToast(false);
                }, 4000);

                const prevStatus = (
                    parameterStatusPerParam[parameterForAnalysis.id] || ""
                ).toLowerCase();
                const wasRevision = prevStatus === "analysis revision";
                await insertWorksheetLog({
                    worksheetId,
                    parameterId: parameterForAnalysis.id,
                    action: wasRevision
                        ? "Analysis Completed After Revision"
                        : "Analysis Completed",
                    remarks: comment || (wasRevision
                        ? "Analysis completed after revision"
                        : "Analysis completed"),
                    employeeId,
                    role,
                });

                setShowCompleteAnalysisDialog(false);
                setParameterForAnalysis(null);
            } else {
                setToastMessage("Failed to complete analysis!");
                setShowToast(true);
                setTimeout(() => {
                    setShowToast(false);
                }, 4000);
            }
        } catch (error) {
            setToastMessage(`Error completing analysis: ${error}`);
            setShowToast(true);
            setTimeout(() => {
                setShowToast(false);
            }, 4000);
        } finally {
            setIsCompletingAnalysis(false);
        }
    };

    const handleApproveWorksheet = async () => {
        setIsApprovingWorksheet(true);

        try {
            if (!worksheetInfo) {
                throw new Error("Worksheet information is not available");
            }

            // Capture timestamp once — used for every write below
            const now = new Date().toISOString();

            // ── 1. Build the full payload with QA approval stamped on every parameter ──
            // collectFormDataForAPI reads the current per-param state arrays, giving us
            // the complete parameter data (preparations, calculations, files, etc.)
            const worksheetData = collectFormDataForAPI();

            const updatedWorksheetData = {
                ...worksheetData,
                documentInfo: {
                    ...worksheetData?.documentInfo,
                    status: "Approved",
                    approvedBy: employeeId, // → approved_by column on worksheet row
                    approvedAt: now, // → approved_at column on worksheet row
                },
                // Stamp approvedByQA / approvedAtQA on every parameter in the same payload.
                // updateWorksheet's backend loop calls UpdateParameter for each one in a
                // single transaction — no separate per-param API calls needed.
                parameters: worksheetData.parameters?.map((p) => ({
                    ...p,
                    approvedByQA: employeeId,
                    approvedAtQA: now,
                })),
            };

            // ── 2. Single call — updates worksheet row + all parameter rows atomically ──
            const response = await updateWorksheet(worksheetId, updatedWorksheetData);

            if (!response?.worksheetId) {
                throw new Error("Failed to update worksheet status after approval");
            }

            // ── 3. Submit to final tbl tables — inject QA fields BEFORE mapping ──
            const worksheetInfoWithQA = {
                ...worksheetInfo,
                sample: {
                    ...worksheetInfo.sample,
                    status: "Approved",
                    approvedBy: employeeId,
                    approvedAt: now,
                },
                parameters: worksheetInfo.parameters.map((p) => ({
                    ...p,
                    approvedByQA: employeeId,
                    approvedAtQA: now,
                })),
            };

            const mappedData = WorksheetDbMapper.mapAll(
                worksheetInfoWithQA as typeof worksheetInfo,
            );
            const submitResponse = await submitWorksheet(mappedData);

            if (!submitResponse.success) {
                throw new Error(
                    submitResponse.message ||
                    "Failed to submit worksheet to final database",
                );
            }

            // ── 4. Update local React state so UI reflects approval immediately ──
            const qaUpdate: Record<number, string> = {};
            const qaAtUpdate: Record<number, string> = {};
            addedParameters.forEach((p) => {
                qaUpdate[p.id] = employeeId;
                qaAtUpdate[p.id] = now;
            });
            setApprovedByQAPerParam((prev) => ({ ...prev, ...qaUpdate }));
            setApprovedAtQAPerParam((prev) => ({ ...prev, ...qaAtUpdate }));

            setWorksheetInfo((prev) =>
                prev
                    ? {
                        ...prev,
                        sample: {
                            ...prev.sample,
                            status: "Approved",
                            approvedBy: employeeId,
                            approvedAt: now,
                        },
                    }
                    : null,
            );

            setToastMessage(
                "Worksheet approved by QA successfully! All parameters are now finalized.",
            );
            setShowToast(true);
            setTimeout(() => setShowToast(false), 4000);
            await insertWorksheetLog({
                worksheetId,
                action: "Worksheet Approved by QA",
                remarks: "Worksheet fully approved by QA",
                employeeId,
                role,
            });
            setShowApproveWorksheetDialog(false);
        } catch (error: any) {
            console.error("Error during worksheet approval:", error);
            setToastMessage(`Error approving worksheet: ${error.message || error}`);
            setShowToast(true);
            setTimeout(() => setShowToast(false), 4000);
        } finally {
            setIsApprovingWorksheet(false);
        }
    };

    const handleSubmitForQA = async () => {
        setIsSubmittingForQA(true);
        try {
            const worksheetData = collectFormDataForAPI();
            const now = new Date().toISOString();

            const updatedWorksheetData = {
                ...worksheetData,
                documentInfo: {
                    ...worksheetData?.documentInfo,
                    status: "Submitted For QA Review",
                    submittedQaBy: employeeId,
                    submittedQaAt: now,
                },
            };

            const response = await updateWorksheet(worksheetId, updatedWorksheetData);

            if (response && response.worksheetId) {
                setWorksheetInfo((prev) =>
                    prev
                        ? {
                            ...prev,
                            sample: {
                                ...prev.sample,
                                status: "Submitted For QA Review",
                                submittedQaBy: employeeId,
                                submittedQaAt: now,
                            },
                        }
                        : null,
                );

                setToastMessage("Worksheet submitted for QA Review successfully!");
                setShowToast(true);
                setTimeout(() => setShowToast(false), 4000);
                await insertWorksheetLog({
                    worksheetId,
                    action: "Submitted For QA Review",
                    remarks: "Worksheet submitted for QA review",
                    employeeId,
                    role,
                });
                setShowSubmitForQADialog(false);
            } else {
                throw new Error("Failed to submit worksheet for QA Review");
            }
        } catch (error: any) {
            console.error("Error submitting for QA:", error);
            setToastMessage(`Error: ${error.message || error}`);
            setShowToast(true);
            setTimeout(() => setShowToast(false), 4000);
        } finally {
            setIsSubmittingForQA(false);
        }
    };

    const availableToAdd = (samplesData ?? []).filter(
        (param) =>
            !addedParameters.find((added) => added.paraCode === param.paraCode),
    );

    // Instrument/Chemical/Standard Handlers
    const searchFilteredInstruments = instruments.filter(
        (inst) =>
            inst.name.toLowerCase().includes(instrumentSearch.toLowerCase()) ||
            inst
                .instrumentTag!.toLowerCase()
                .includes(instrumentSearch.toLowerCase()),
    );

    const searchFilteredChemicals = chemicals.filter(
        (chem) =>
            chem.name.toLowerCase().includes(chemicalSearch.toLowerCase()) ||
            (chem.make &&
                chem.make.toLowerCase().includes(chemicalSearch.toLowerCase())),
    );

    const handleAddInstrument = (instrument: WorksheetInstrument) => {
        setAddedInstruments((prev) => ({
            ...prev,
            [instrument.parameterId]: [...(prev[instrument.parameterId] || []), instrument],
        }));
        setShowInstrumentDropdown(false);
        setInstrumentSearch("");
    };

    const handleRemoveInstrument = (
        parameterId: number,
        instrumentId: string,
    ) => {
        setAddedInstruments((prev) => ({
            ...prev,
            [parameterId]: (prev[parameterId] || []).filter(
                (inst) => inst.instrumentId !== instrumentId,
            ),
        }));
    };

    const handleAddChemical = (chemical: WorksheetChemical) => {
        setAddedChemicals((prev) => ({
            ...prev,
            [chemical.parameterId]: [...(prev[chemical.parameterId] || []), chemical],
        }));
        setShowChemicalDropdown(false);
        setChemicalSearch("");
    };

    const handleRemoveChemical = (parameterId: number, chemicalId: string) => {
        setAddedChemicals((prev) => ({
            ...prev,
            [parameterId]: (prev[parameterId] || []).filter(
                (chem) => chem.slno !== chemicalId,
            ),
        }));
    };

    const searchFilteredMedia = media.filter(
        (m) =>
            m.name.toLowerCase().includes(mediaSearch.toLowerCase()) ||
            (m.code !== null && m.code!.toLowerCase().includes(mediaSearch.toLowerCase())),
    );

    const handleAddMedia = (media: WorksheetMedia) => {
        setAddedMedia((prev) => ({
            ...prev,
            [media.parameterId]: [...(prev[media.parameterId] || []), media],
        }));
        setShowMediaDropdown(false);
        setMediaSearch("");
    };

    const handleRemoveMedia = (parameterId: number, mediaId: number) => {
        setAddedMedia((prev) => ({
            ...prev,
            [parameterId]: (prev[parameterId] || []).filter(
                (m) => m.mediaId !== mediaId,
            ),
        }));
    };


    /** Slot key for parameter-level files */
    const PARAM_LEVEL_KEY = "param_level";

    const updateFilesForSlot = (
        paramId: number,
        slotKey: string,
        updater: (prev: AttachedFile[]) => AttachedFile[],
    ) => {
        setFilesPerParam((prev) => ({
            ...prev,
            [paramId]: {
                ...(prev[paramId] ?? {}),
                [slotKey]: updater((prev[paramId] ?? {})[slotKey] ?? []),
            },
        }));
    };

    const getParamLevelFiles = (paramId: number): AttachedFile[] =>
        (filesPerParam[paramId] ?? {})[PARAM_LEVEL_KEY] ?? [];

    const handleAddParamFiles = (paramId: number, newFiles: AttachedFile[]) => {
        updateFilesForSlot(paramId, PARAM_LEVEL_KEY, (prev) => [
            ...prev,
            ...newFiles,
        ]);
    };

    const handleRemoveParamFile = (paramId: number, index: number) => {
        updateFilesForSlot(paramId, PARAM_LEVEL_KEY, (prev) =>
            prev.filter((_, i) => i !== index),
        );
    };


    /** Collect ALL files for a param into a flat WorksheetFileData[] for save payload */
    const collectFilesForParam = (paramId: number): WorksheetFileData[] => {
        const slots = filesPerParam[paramId] ?? {};
        const result: WorksheetFileData[] = [];
        for (const [slotKey, slotFiles] of Object.entries(slots)) {
            for (const f of slotFiles) {
                if (slotKey === PARAM_LEVEL_KEY) {
                    result.push({
                        id: f.id,
                        preparationType: null,
                        label: null,
                        fileName: f.fileName,
                        fileDataBase64: f.fileDataBase64,
                    });
                } else {
                    // Key format: "type|label" — use indexOf so labels containing "|" are preserved
                    const separatorIdx = slotKey.indexOf("|");
                    const type =
                        separatorIdx >= 0 ? slotKey.slice(0, separatorIdx) : slotKey;
                    const label =
                        separatorIdx >= 0 ? slotKey.slice(separatorIdx + 1) : "";
                    result.push({
                        id: f.id,
                        preparationType: type || null,
                        label: label || null,
                        fileName: f.fileName,
                        fileDataBase64: f.fileDataBase64,
                    });
                }
            }
        }
        return result;
    };

    const allParameters = samplesData.map((data) => data.parameter) ?? [];
    const uniqueMethods = [
        ...new Map(
            (samplesData ?? []).map((item) => [item.methodCode, item]),
        ).values(),
    ];
    const allMethods = uniqueMethods
        .map((item) => item.methodName)
        .filter((method) => method && method.trim() !== "");

    const testsRequiredDisplay = allParameters
        .filter((param) => param && param.trim() !== "")
        .join(", ");

    const methodsRequiredDisplay = allMethods.join(", ");

    const animationProps = {
        initial: { opacity: 0, scale: 0.9 },
        animate: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: 0.9 },
        transition: { duration: 0.3 },
    };

    const loadingIconProps = {
        animate: { y: [0, -10, 0] },
        transition: { duration: 2, repeat: Infinity },
    };

    const handleTogglePreparationGroup = (
    parameterId: number,
    groupId: string,
) => {
    setActivePreparationGroups((prev) => {
        const currentGroups = prev[parameterId] || [];

        if (currentGroups.includes(groupId)) {
            // Deselect: clear the specific group being deselected
            const group = PREPARATION_GROUPS[groupId as keyof typeof PREPARATION_GROUPS];

            if (group.id === "bet") {
                setBetPreparationsPerParam((p) => {
                    const { [parameterId]: _, ...rest } = p;
                    return rest;
                });
            } else if (group.id === "sterility") {
                setSterilityPreparationsPerParam((p) => {
                    const { [parameterId]: _, ...rest } = p;
                    return rest;
                });
            } else if (group.id === "ecoli") {
                setEcoliPreparationsPerParam((p) => {
                    const { [parameterId]: _, ...rest } = p;
                    return rest;
                });
            } else if (group.id === "salmonella") {
                setSalmonellaPreparationsPerParam((p) => {
                    const { [parameterId]: _, ...rest } = p;
                    return rest;
                });
            } else if (group.id === "shigella") {
                setShigellaPreparationsPerParam((p) => {
                    const { [parameterId]: _, ...rest } = p;
                    return rest;
                });
            } else if (group.id === "clostridium") {
                setClostridiumPreparationsPerParam((p) => {
                    const { [parameterId]: _, ...rest } = p;
                    return rest;
                });
            } else if (group.id === "staphylococcus") {
                setStaphylococcusPreparationsPerParam((p) => {
                    const { [parameterId]: _, ...rest } = p;
                    return rest;
                });
            } else if (group.id === "pseudomonas") {
                setPseudomonasPreparationsPerParam((p) => {
                    const { [parameterId]: _, ...rest } = p;
                    return rest;
                });
            } else if (group.id === "bileTolerant") {
                setBileTolerantPreparationsPerParam((p) => {
                    const { [parameterId]: _, ...rest } = p;
                    return rest;
                });
            } else if (group.id === "calbicans") {
                setCalbicansPreparationsPerParam((p) => {
                    const { [parameterId]: _, ...rest } = p;
                    return rest;
                });
            } else if (group.id === "bcepacia") {
                setBcepaciaPreparationsPerParam((p) => {
                    const { [parameterId]: _, ...rest } = p;
                    return rest;
                });
            } else if (group.id === "totalViableCountWater") {
                // setTotalViableCountWaterPreparationsPerParam((p) => {
                //     const { [parameterId]: _, ...rest } = p;
                //     return rest;
                // });
            } else if (group.id === "tymc") {
                // setTymcPreparationsPerParam((p) => {
                //     const { [parameterId]: _, ...rest } = p;
                //     return rest;
                //});
            } else if (group.id === "tamc") {
                // setTamcPreparationsPerParam((p) => {
                //     const { [parameterId]: _, ...rest } = p;
                //     return rest;
                // });
            }

            return {
                ...prev,
                [parameterId]: currentGroups.filter((g) => g !== groupId),
            };
        }

        // ── Single-select: if there's already a group, clear it first ──────
        const clearGroup = (oldGroupId: string) => {
            const oldGroup = PREPARATION_GROUPS[oldGroupId as keyof typeof PREPARATION_GROUPS];
            if (!oldGroup) return;
            
            if (oldGroupId === "bet") {
                setBetPreparationsPerParam((p) => {
                    const { [parameterId]: _, ...r } = p;
                    return r;
                });
            } else if (oldGroupId === "sterility") {
                setSterilityPreparationsPerParam((p) => {
                    const { [parameterId]: _, ...r } = p;
                    return r;
                });
            } else if (oldGroupId === "ecoli") {
                setEcoliPreparationsPerParam((p) => {
                    const { [parameterId]: _, ...r } = p;
                    return r;
                });
            } else if (oldGroupId === "salmonella") {
                setSalmonellaPreparationsPerParam((p) => {
                    const { [parameterId]: _, ...r } = p;
                    return r;
                });
            } else if (oldGroupId === "shigella") {
                setShigellaPreparationsPerParam((p) => {
                    const { [parameterId]: _, ...r } = p;
                    return r;
                });
            } else if (oldGroupId === "clostridium") {
                setClostridiumPreparationsPerParam((p) => {
                    const { [parameterId]: _, ...r } = p;
                    return r;
                });
            } else if (oldGroupId === "staphylococcus") {
                setStaphylococcusPreparationsPerParam((p) => {
                    const { [parameterId]: _, ...r } = p;
                    return r;
                });
            } else if (oldGroupId === "pseudomonas") {
                setPseudomonasPreparationsPerParam((p) => {
                    const { [parameterId]: _, ...r } = p;
                    return r;
                });
            } else if (oldGroupId === "bileTolerant") {
                setBileTolerantPreparationsPerParam((p) => {
                    const { [parameterId]: _, ...r } = p;
                    return r;
                });
            } else if (oldGroupId === "calbicans") {
                setCalbicansPreparationsPerParam((p) => {
                    const { [parameterId]: _, ...r } = p;
                    return r;
                });
            } else if (oldGroupId === "bcepacia") {
                setBcepaciaPreparationsPerParam((p) => {
                    const { [parameterId]: _, ...r } = p;
                    return r;
                });
            } else if (oldGroupId === "totalViableCountWater") {
                // setTotalViableCountWaterPreparationsPerParam((p) => {
                //     const { [parameterId]: _, ...r } = p;
                //     return r;
                // });
            } else if (oldGroupId === "tymc") {
                // setTymcPreparationsPerParam((p) => {
                //     const { [parameterId]: _, ...r } = p;
                //     return r;
                // });
            } else if (oldGroupId === "tamc") {
                // setTamcPreparationsPerParam((p) => {
                //     const { [parameterId]: _, ...r } = p;
                //     return r;
                // });
            }
            
            // Also clear preparationCompleted when changing group
            setPreparationCompletedByPerParam((p) => {
                const { [parameterId]: _, ...r } = p;
                return r;
            });
            setPreparationCompletedAtPerParam((p) => {
                const { [parameterId]: _, ...r } = p;
                return r;
            });
        };

        // Clear all existing groups for this parameter (single-select)
        currentGroups.forEach(clearGroup);

        return {
            ...prev,
            [parameterId]: [groupId],
        };
    });

    // Auto-initialize the selected preparation type with default data
    if (groupId === "bet") {
        setBetPreparationsPerParam((prev) => {
            const existing = prev[parameterId] || [];
            if (existing.length === 0) {
                return { ...prev, [parameterId]: [createDefaultBETPreparation(0)] };
            }
            return prev;
        });
    } else if (groupId === "sterility") {
        setSterilityPreparationsPerParam((prev) => {
            const existing = prev[parameterId] || [];
            if (existing.length === 0) {
                return { ...prev, [parameterId]: [createDefaultSterilityPreparation(0)] };
            }
            return prev;
        });
    } else if (groupId === "ecoli") {
        setEcoliPreparationsPerParam((prev) => {
            const existing = prev[parameterId] || [];
            if (existing.length === 0) {
                return { ...prev, [parameterId]: [createDefaultEcoliPreparation(0)] };
            }
            return prev;
        });
    } else if (groupId === "salmonella") {
        setSalmonellaPreparationsPerParam((prev) => {
            const existing = prev[parameterId] || [];
            if (existing.length === 0) {
                return { ...prev, [parameterId]: [createDefaultSalmonellaPreparation(0)] };
            }
            return prev;
        });
    } else if (groupId === "shigella") {
        setShigellaPreparationsPerParam((prev) => {
            const existing = prev[parameterId] || [];
            if (existing.length === 0) {
                return { ...prev, [parameterId]: [createDefaultShigellaPreparation(0)] };
            }
            return prev;
        });
    } else if (groupId === "clostridium") {
        setClostridiumPreparationsPerParam((prev) => {
            const existing = prev[parameterId] || [];
            if (existing.length === 0) {
                return { ...prev, [parameterId]: [createDefaultClostridiumPreparation(0)] };
            }
            return prev;
        });
    } else if (groupId === "staphylococcus") {
        setStaphylococcusPreparationsPerParam((prev) => {
            const existing = prev[parameterId] || [];
            if (existing.length === 0) {
                return { ...prev, [parameterId]: [createDefaultStaphylococcusPreparation(0)] };
            }
            return prev;
        });
    } else if (groupId === "pseudomonas") {
        setPseudomonasPreparationsPerParam((prev) => {
            const existing = prev[parameterId] || [];
            if (existing.length === 0) {
                return { ...prev, [parameterId]: [createDefaultPseudomonasPreparation(0)] };
            }
            return prev;
        });
    } else if (groupId === "bileTolerant") {
        setBileTolerantPreparationsPerParam((prev) => {
            const existing = prev[parameterId] || [];
            if (existing.length === 0) {
                return { ...prev, [parameterId]: [createDefaultBileTolerantPreparation(0)] };
            }
            return prev;
        });
    } else if (groupId === "calbicans") {
        setCalbicansPreparationsPerParam((prev) => {
            const existing = prev[parameterId] || [];
            if (existing.length === 0) {
                return { ...prev, [parameterId]: [createDefaultCandidaAlbicansPreparation(0)] };
            }
            return prev;
        });
    } else if (groupId === "bcepacia") {
        setBcepaciaPreparationsPerParam((prev) => {
            const existing = prev[parameterId] || [];
            if (existing.length === 0) {
                return { ...prev, [parameterId]: [createDefaultBCepaciaPreparation(0)] };
            }
            return prev;
        });
    }

    setShowPreparationDropdown({});
};

    const getAvailablePreparationGroups = () => {
        return [
            { id: "sterility", label: "Preparation for Sterility", color: "emerald" },
            { id: "bet", label: "Preparation for BET", color: "emerald" },
            { id: "ecoli", label: "Preparation for E.coli", color: "emerald" },
            { id: "shigella", label: "Preparation for Shigella", color: "emerald" },
            { id: "clostridium", label: "Preparation for Clostridium", color: "emerald" },
            { id: "salmonella", label: "Preparation for Salmonella", color: "emerald" },
            { id: "staphylococcus", label: "Preparation for Staphylococcus", color: "emerald" },
            { id: "pseudomonas", label: "Preparation for Pseudomonas", color: "emerald" },
            { id: "bileTolerant", label: "Preparation for Bile-Tolerant", color: "emerald" },
            { id: "calbicans", label: "Preparation for C.albicans", color: "emerald" },
            { id: "bcepacia", label: "Preparation for B.cepacia", color: "emerald" },
            { id: "totalViableCountWater", label: "Preparation for Total Viable Count Water", color: "emerald" },
            { id: "tymc", label: "Preparation for TYMC", color: "emerald" },
            { id: "tamc", label: "Preparation for TAMC", color: "emerald" },
        ];
    };

    const LockedParameterOverlay: React.FC<{ parameterId: number }> = React.memo(
        ({ parameterId }) => {
            const status = (
                parameterStatusPerParam[parameterId] || "Created"
            ).toLowerCase();
            const canUnlock = status === "analysis pending";
            const isAnalysisStarted = status === "analysis started";
            const isAnalysisPending = status === "analysis pending";
            const isAnalysisCompleted = status === "analysis completed";
            const isAnalysisRevision = status === "analysis revision";
            const isApproved = status === "approved";
            const isCreated = status === "created";
            const param = addedParameters.find((p) => p.id === parameterId);

            // ========== ANALYST VIEW - CREATED (NO OVERLAY - FULLY EDITABLE) ==========
            if (role.toLowerCase() === "analyst" && isCreated) {
                return null; // No overlay needed, fully editable
            }

            // ========== ANALYST VIEW - ANALYSIS PENDING ==========
            if (role.toLowerCase() === "analyst" && isAnalysisPending && param) {
                return (
                    <div className="relative mb-8 rounded-2xl overflow-hidden border border-slate-200 shadow-lg bg-white">
                        <div className="bg-gradient-to-r from-emerald-50 via-emerald-100 to-emerald-50 px-6 py-5 border-b border-slate-200">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="relative">
                                        <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                                            <svg
                                                className="w-6 h-6 text-emerald-600 animate-pulse"
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                            Analysis Pending - Ready to Start
                                        </h3>
                                        <p className="text-sm text-slate-600 mt-0.5">
                                            Click "Start Analysis" to begin working on this parameter
                                        </p>
                                    </div>
                                </div>

                                <motion.button
                                    onClick={() => handleStartAnalysis(param)}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="px-5 py-2.5 bg-white/60 backdrop-blur-sm border border-emerald-200 text-emerald-800 text-sm font-semibold rounded-lg hover:bg-white/80 hover:border-emerald-300 transition-all flex items-center gap-2 shadow-sm"
                                >
                                    <BsPlayFill className="w-5 h-5" />
                                    Start Analysis
                                </motion.button>
                            </div>
                        </div>

                        <div className="p-6 bg-emerald-50">
                            <div className="grid grid-cols-1 gap-4">
                                <div className="bg-white border border-slate-200 rounded-xl p-5">
                                    <div className="flex items-start gap-3">
                                        <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <svg
                                                className="w-5 h-5 text-emerald-600"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                                />
                                            </svg>
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-semibold text-sm text-slate-800 mb-2">
                                                What happens when you start?
                                            </h4>
                                            <ul className="text-sm text-slate-600 space-y-2">
                                                <li className="flex items-start gap-2">
                                                    <span className="text-emerald-500 mt-1">•</span>
                                                    <span>
                                                        You'll gain full access to edit all preparations and
                                                        calculations
                                                    </span>
                                                </li>
                                                <li className="flex items-start gap-2">
                                                    <span className="text-emerald-500 mt-1">•</span>
                                                    <span>
                                                        The parameter status will change to "Analysis
                                                        Started"
                                                    </span>
                                                </li>
                                                <li className="flex items-start gap-2">
                                                    <span className="text-emerald-500 mt-1">•</span>
                                                    <span>
                                                        You must complete the entire analysis - no pausing
                                                    </span>
                                                </li>
                                                <li className="flex items-start gap-2">
                                                    <span className="text-emerald-500 mt-1">•</span>
                                                    <span>
                                                        Click "Complete Analysis" when you're done with all
                                                        work
                                                    </span>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                                    <div className="flex items-start gap-3">
                                        <svg
                                            className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                            />
                                        </svg>
                                        <p className="text-sm text-emerald-800">
                                            <strong>Important:</strong> Once started, you cannot pause
                                            or go back. Make sure you have all required materials and
                                            time to complete.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            }

            // ========== ANALYST VIEW - ANALYSIS STARTED (ACTIVE EDITING) ==========
            if (role.toLowerCase() === "analyst" && isAnalysisStarted && param) {
                return (
                    <div className="relative mb-8 rounded-2xl overflow-hidden border border-slate-200 shadow-lg bg-white">
                        <div className="bg-gradient-to-r from-emerald-50 via-emerald-100 to-emerald-50 px-6 py-5 border-b border-slate-200">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="relative">
                                        <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                                            <svg
                                                className="w-6 h-6 text-emerald-600 animate-pulse"
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                            Analysis In Progress
                                        </h3>
                                        <p className="text-sm text-slate-600 mt-0.5">
                                            Work on your analysis and click complete when done
                                        </p>
                                    </div>
                                </div>

                                <motion.button
                                    onClick={() => handleCompleteAnalysis(param)}
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

                        <div className="p-6 bg-emerald-50">
                            <div className="grid grid-cols-1 gap-4">
                                <div className="bg-white border border-slate-200 rounded-xl p-5">
                                    <div className="flex items-start gap-3">
                                        <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <svg
                                                className="w-5 h-5 text-emerald-600"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                                />
                                            </svg>
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-semibold text-sm text-slate-800 mb-2">
                                                Active Editing Mode
                                            </h4>
                                            <ul className="text-sm text-slate-600 space-y-2">
                                                <li className="flex items-start gap-2">
                                                    <span className="text-emerald-500 mt-1">•</span>
                                                    <span>
                                                        You have full editing access to all preparations and
                                                        calculations
                                                    </span>
                                                </li>
                                                <li className="flex items-start gap-2">
                                                    <span className="text-emerald-500 mt-1">•</span>
                                                    <span>
                                                        Scroll down to work on parameter details,
                                                        preparations, and calculations
                                                    </span>
                                                </li>
                                                <li className="flex items-start gap-2">
                                                    <span className="text-emerald-500 mt-1">•</span>
                                                    <span>
                                                        Click <strong>"Save Draft"</strong> frequently to
                                                        save your progress
                                                    </span>
                                                </li>
                                                <li className="flex items-start gap-2">
                                                    <span className="text-emerald-500 mt-1">•</span>
                                                    <span>
                                                        When all work is complete, click{" "}
                                                        <strong>"Complete Analysis"</strong> above
                                                    </span>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                                    <div className="flex items-start gap-3">
                                        <svg
                                            className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5"
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
                                        <p className="text-sm text-emerald-800">
                                            <strong>Before Completing:</strong> Verify all
                                            preparations, calculations, and data are accurate. This
                                            will submit your work to Reviewer for approval.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            }

            // ========== ANALYST VIEW - ANALYSIS COMPLETED (AWAITING REVIEWER REVIEW) ==========
            if (role.toLowerCase() === "analyst" && isAnalysisCompleted && param) {
                return (
                    <div className="relative mb-8 rounded-2xl overflow-hidden border border-slate-200 shadow-lg bg-white">
                        <div className="bg-gradient-to-r from-emerald-50 via-emerald-100 to-emerald-50 px-6 py-5 border-b border-slate-200">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="relative">
                                        <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                                            <svg
                                                className="w-6 h-6 text-emerald-600"
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-slate-800">
                                            Analysis Completed
                                        </h3>
                                        <p className="text-sm text-slate-600 mt-0.5">
                                            Your work has been submitted and is under review
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 bg-emerald-50">
                            <div className="grid grid-cols-1 gap-4">
                                <div className="bg-white border border-slate-200 rounded-xl p-5">
                                    <div className="flex items-start gap-3">
                                        <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <svg
                                                className="w-5 h-5 text-emerald-600"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                                />
                                            </svg>
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-semibold text-sm text-slate-800 mb-2">
                                                What's Next?
                                            </h4>
                                            <ul className="text-sm text-slate-600 space-y-2">
                                                <li className="flex items-start gap-2">
                                                    <span className="text-emerald-500 mt-1">•</span>
                                                    <span>
                                                        Reviewer is currently reviewing your analysis
                                                    </span>
                                                </li>
                                                <li className="flex items-start gap-2">
                                                    <span className="text-emerald-500 mt-1">•</span>
                                                    <span>
                                                        If approved, the parameter will be finalized
                                                    </span>
                                                </li>
                                                <li className="flex items-start gap-2">
                                                    <span className="text-emerald-500 mt-1">•</span>
                                                    <span>
                                                        If revisions are needed, you'll regain editing
                                                        access
                                                    </span>
                                                </li>
                                                <li className="flex items-start gap-2">
                                                    <span className="text-emerald-500 mt-1">•</span>
                                                    <span>
                                                        You can view all parameter details below while
                                                        waiting
                                                    </span>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-slate-100 border border-slate-200 rounded-xl p-4">
                                    <div className="flex items-start gap-3">
                                        <svg
                                            className="w-5 h-5 text-slate-600 flex-shrink-0 mt-0.5"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                            />
                                        </svg>
                                        <p className="text-sm text-slate-700">
                                            <strong>Status:</strong> Your analysis is locked for
                                            review. No edits can be made until Reviewer provides
                                            feedback.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            }

            // ========== ANALYST VIEW - ANALYSIS REVISION REQUESTED ==========
            if (role.toLowerCase() === "analyst" && isAnalysisRevision && param) {
                const qaRemarks = remarksQAPerParam[parameterId];
                const reviewerRemarks = remarksByReviewerPerParam[parameterId];
                const isFromQA = !!qaRemarks;
                const activeRemarks = isFromQA ? qaRemarks : reviewerRemarks;
                const senderLabel = isFromQA ? "QA" : "Reviewer";

                return (
                    <div className="relative mb-8 rounded-2xl overflow-hidden border border-slate-200 shadow-lg bg-white">
                        <div
                            className={`bg-gradient-to-r ${isFromQA ? "from-amber-50 via-amber-100 to-amber-50" : "from-orange-50 via-orange-100 to-orange-50"} px-6 py-5 border-b border-slate-200`}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="relative">
                                        <div
                                            className={`w-12 h-12 ${isFromQA ? "bg-amber-100" : "bg-orange-100"} rounded-xl flex items-center justify-center`}
                                        >
                                            <svg
                                                className={`w-6 h-6 ${isFromQA ? "text-amber-600" : "text-orange-600"} animate-pulse`}
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-slate-800">
                                            Revision Requested by {senderLabel}
                                        </h3>
                                        <p className="text-sm text-slate-600 mt-0.5">
                                            {senderLabel} has requested revisions. Review the feedback
                                            below and update your work
                                        </p>
                                    </div>
                                </div>

                                <motion.button
                                    onClick={() => handleCompleteAnalysis(param)}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className={`px-5 py-2.5 bg-white/60 backdrop-blur-sm border ${isFromQA ? "border-amber-200 text-amber-700 hover:border-amber-300" : "border-orange-200 text-orange-700 hover:border-orange-300"} text-sm font-semibold rounded-lg hover:bg-white/80 transition-all flex items-center gap-2 shadow-sm`}
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
                                    Complete Revision
                                </motion.button>
                            </div>
                        </div>

                        <div className={`p-6 ${isFromQA ? "bg-amber-50" : "bg-orange-50"}`}>
                            <div className="grid grid-cols-1 gap-4">
                                {/* Revision Remarks — most prominent */}
                                {activeRemarks ? (
                                    <div
                                        className={`bg-white border ${isFromQA ? "border-amber-200" : "border-orange-200"} rounded-xl p-5`}
                                    >
                                        <div className="flex items-start gap-3">
                                            <div
                                                className={`w-10 h-10 ${isFromQA ? "bg-amber-50" : "bg-orange-50"} rounded-lg flex items-center justify-center flex-shrink-0`}
                                            >
                                                <svg
                                                    className={`w-5 h-5 ${isFromQA ? "text-amber-600" : "text-orange-600"}`}
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                                                    />
                                                </svg>
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-semibold text-sm text-slate-800 mb-2 flex items-center gap-2">
                                                    Revision Remarks
                                                    <span
                                                        className={`text-xs px-2 py-0.5 rounded-full font-medium ${isFromQA ? "bg-amber-100 text-amber-700" : "bg-orange-100 text-orange-700"}`}
                                                    >
                                                        from {senderLabel}
                                                    </span>
                                                </h4>
                                                <p
                                                    className={`text-sm italic leading-relaxed px-4 py-3 rounded-lg border ${isFromQA ? "text-amber-900 bg-amber-50 border-amber-100" : "text-orange-900 bg-orange-50 border-orange-100"}`}
                                                >
                                                    &ldquo;{activeRemarks}&rdquo;
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="bg-white border border-slate-200 rounded-xl p-5">
                                        <div className="flex items-start gap-3">
                                            <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                                <svg
                                                    className="w-5 h-5 text-slate-400"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                                                    />
                                                </svg>
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-semibold text-sm text-slate-800 mb-1">
                                                    Revision Remarks
                                                </h4>
                                                <p className="text-sm text-slate-400 italic">
                                                    No remarks provided by {senderLabel}.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="bg-white border border-slate-200 rounded-xl p-5">
                                    <div className="flex items-start gap-3">
                                        <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <svg
                                                className="w-5 h-5 text-emerald-600"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                                />
                                            </svg>
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-semibold text-sm text-slate-800 mb-2">
                                                Revision Mode Active
                                            </h4>
                                            <ul className="text-sm text-slate-600 space-y-2">
                                                <li className="flex items-start gap-2">
                                                    <span className="text-emerald-500 mt-1">•</span>
                                                    <span>
                                                        Review {senderLabel}&apos;s feedback above and make
                                                        necessary corrections
                                                    </span>
                                                </li>
                                                <li className="flex items-start gap-2">
                                                    <span className="text-emerald-500 mt-1">•</span>
                                                    <span>
                                                        You have full editing access to all preparations and
                                                        calculations
                                                    </span>
                                                </li>
                                                <li className="flex items-start gap-2">
                                                    <span className="text-emerald-500 mt-1">•</span>
                                                    <span>
                                                        Click <strong>&quot;Save Draft&quot;</strong> to
                                                        save your changes
                                                    </span>
                                                </li>
                                                <li className="flex items-start gap-2">
                                                    <span className="text-emerald-500 mt-1">•</span>
                                                    <span>
                                                        Click <strong>&quot;Complete Revision&quot;</strong>{" "}
                                                        when all changes are done
                                                    </span>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                <div
                                    className={`${isFromQA ? "bg-amber-50 border-amber-200" : "bg-orange-50 border-orange-200"} border rounded-xl p-4`}
                                >
                                    <div className="flex items-start gap-3">
                                        <svg
                                            className={`w-5 h-5 ${isFromQA ? "text-amber-600" : "text-orange-600"} flex-shrink-0 mt-0.5`}
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                            />
                                        </svg>
                                        <p
                                            className={`text-sm ${isFromQA ? "text-amber-800" : "text-orange-800"}`}
                                        >
                                            <strong>Tip:</strong> Carefully review all sections to
                                            ensure accuracy before resubmitting. Your work will be
                                            sent back to {senderLabel} for re-approval.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            }

            // ========== ANALYST VIEW - APPROVED ==========
            if (role.toLowerCase() === "analyst" && isApproved && param) {
                return (
                    <div className="relative mb-8 rounded-2xl overflow-hidden border border-slate-200 shadow-lg bg-white">
                        <div className="bg-gradient-to-r from-emerald-50 via-emerald-100 to-emerald-50 px-6 py-5 border-b border-slate-200">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="relative">
                                        <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                                            <svg
                                                className="w-6 h-6 text-emerald-600"
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-slate-800">
                                            Parameter Approved - Well Done!
                                        </h3>
                                        <p className="text-sm text-slate-600 mt-0.5">
                                            Your analysis has been reviewed and approved by Reviewer
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 bg-emerald-50">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-white border border-slate-200 rounded-xl p-5">
                                    <div className="flex items-start gap-3">
                                        <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <svg
                                                className="w-5 h-5 text-emerald-600"
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
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-semibold text-sm text-slate-800 mb-1">
                                                Status: Approved
                                            </h4>
                                            <p className="text-sm text-slate-600">
                                                This parameter has been finalized and approved. All data
                                                is now locked.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white border border-slate-200 rounded-xl p-5">
                                    <div className="flex items-start gap-3">
                                        <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <svg
                                                className="w-5 h-5 text-emerald-600"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                                />
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                                />
                                            </svg>
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-semibold text-sm text-slate-800 mb-1">
                                                View Only Access
                                            </h4>
                                            <p className="text-sm text-slate-600">
                                                You can view all parameter details below, but cannot
                                                make any changes.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            }

            // ========== Reviewer VIEW - CREATED ==========
            if (role.toLowerCase() === "reviewer" && isCreated && param) {
                return (
                    <div className="relative mb-8 rounded-2xl overflow-hidden border border-slate-200 shadow-lg bg-white">
                        <div className="bg-gradient-to-r from-slate-50 via-gray-50 to-slate-50 px-6 py-5 border-b border-slate-200">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="relative">
                                        <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center">
                                            <svg
                                                className="w-6 h-6 text-slate-600"
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-slate-800">
                                            Parameter in Draft Mode
                                        </h3>
                                        <p className="text-sm text-slate-600 mt-0.5">
                                            This parameter is being prepared and has not been
                                            submitted yet
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    <motion.button
                                        onClick={() => handleInitiateDelete(param)}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="px-4 py-2 bg-white/60 backdrop-blur-sm border border-red-200 text-red-700 text-sm font-semibold rounded-lg hover:bg-white/80 hover:border-red-300 transition-all flex items-center gap-2 shadow-sm"
                                    >
                                        <svg
                                            className="w-4 h-4"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                            />
                                        </svg>
                                        Delete
                                    </motion.button>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 bg-emerald-50">
                            <div className="grid grid-cols-1 gap-4">
                                <div className="bg-white border border-slate-200 rounded-xl p-5">
                                    <div className="flex items-start gap-3">
                                        <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <svg
                                                className="w-5 h-5 text-emerald-600"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                                />
                                            </svg>
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-semibold text-sm text-slate-800 mb-2">
                                                Current Status
                                            </h4>
                                            <ul className="text-sm text-slate-600 space-y-2">
                                                <li className="flex items-start gap-2">
                                                    <span className="text-emerald-500 mt-1">•</span>
                                                    <span>
                                                        This parameter is in draft mode and being set up
                                                    </span>
                                                </li>
                                                <li className="flex items-start gap-2">
                                                    <span className="text-emerald-500 mt-1">•</span>
                                                    <span>
                                                        It has not been submitted for analysis yet
                                                    </span>
                                                </li>
                                                <li className="flex items-start gap-2">
                                                    <span className="text-emerald-500 mt-1">•</span>
                                                    <span>
                                                        Once submitted, it will be assigned for analysis
                                                    </span>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-slate-100 border border-slate-200 rounded-xl p-4">
                                    <div className="flex items-start gap-3">
                                        <svg
                                            className="w-5 h-5 text-slate-600 flex-shrink-0 mt-0.5"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                                            />
                                        </svg>
                                        <p className="text-sm text-slate-700">
                                            <strong>Available Actions:</strong> You can delete this
                                            parameter if it's no longer needed. View details below.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            }

            // ========== Reviewer VIEW - ANALYSIS PENDING OR STARTED ==========
            if (
                role.toLowerCase() === "reviewer" &&
                (isAnalysisPending || isAnalysisStarted) &&
                param
            ) {
                return (
                    <div className="relative mb-8 rounded-2xl overflow-hidden border border-slate-200 shadow-lg bg-white">
                        <div className="bg-gradient-to-r from-slate-50 via-gray-50 to-slate-50 px-6 py-5 border-b border-slate-200">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="relative">
                                        <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center">
                                            <svg
                                                className="w-6 h-6 text-slate-600"
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-slate-800">
                                            {isAnalysisStarted
                                                ? "Analysis In Progress"
                                                : "Awaiting Analysis"}
                                        </h3>
                                        <p className="text-sm text-slate-600 mt-0.5">
                                            Status:{" "}
                                            <span className="uppercase font-semibold">{status}</span>
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    {canUnlock && (
                                        <motion.button
                                            onClick={() => handleInitiateUnlock(param)}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            className="px-4 py-2 bg-white/60 backdrop-blur-sm border border-emerald-200 text-emerald-800 text-sm font-semibold rounded-lg hover:bg-white/80 hover:border-emerald-300 transition-all flex items-center gap-2 shadow-sm"
                                        >
                                            <svg
                                                className="w-4 h-4"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"
                                                />
                                            </svg>
                                            Unlock
                                        </motion.button>
                                    )}

                                    <motion.button
                                        onClick={() => handleInitiateDelete(param)}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="px-4 py-2 bg-white/60 backdrop-blur-sm border border-red-200 text-red-700 text-sm font-semibold rounded-lg hover:bg-white/80 hover:border-red-300 transition-all flex items-center gap-2 shadow-sm"
                                    >
                                        <svg
                                            className="w-4 h-4"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                            />
                                        </svg>
                                        Delete
                                    </motion.button>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 bg-emerald-50">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-white border border-slate-200 rounded-xl p-5">
                                    <div className="flex items-start gap-3">
                                        <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <svg
                                                className="w-5 h-5 text-emerald-600"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                                />
                                            </svg>
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-semibold text-sm text-slate-800 mb-2">
                                                Why is this locked?
                                            </h4>
                                            <p className="text-sm text-slate-600">
                                                {isAnalysisStarted
                                                    ? "This parameter is currently under active analysis. The analyst is working on it."
                                                    : "This parameter has been submitted for analysis. To maintain data integrity, modifications are restricted."}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white border border-slate-200 rounded-xl p-5">
                                    <div className="flex items-start gap-3">
                                        <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <svg
                                                className="w-5 h-5 text-emerald-600"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                                                />
                                            </svg>
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-semibold text-sm text-slate-800 mb-2">
                                                {canUnlock
                                                    ? "Unlock Available"
                                                    : "Need to make changes?"}
                                            </h4>
                                            <p className="text-sm text-slate-600">
                                                {canUnlock ? (
                                                    <>
                                                        You can unlock this parameter to make changes. Click{" "}
                                                        <strong>"Unlock"</strong> to revert to draft status.
                                                    </>
                                                ) : isAnalysisStarted ? (
                                                    <>
                                                        Analysis is in progress. Contact the analyst or
                                                        delete the parameter if necessary.
                                                    </>
                                                ) : (
                                                    <>
                                                        Contact the assigned analyst to discuss
                                                        modifications or wait until analysis is complete.
                                                    </>
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-4 bg-slate-100 border border-slate-200 rounded-xl p-4">
                                <div className="flex items-start gap-3">
                                    <svg
                                        className="w-5 h-5 text-slate-600 flex-shrink-0 mt-0.5"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                        />
                                    </svg>
                                    <div className="flex-1">
                                        <p className="text-sm font-semibold text-slate-700 mb-2">
                                            Available Actions:
                                        </p>
                                        <ul className="text-sm text-slate-600 space-y-1.5">
                                            {canUnlock && (
                                                <li className="flex items-start gap-2">
                                                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-1.5" />
                                                    <span>
                                                        <strong>Unlock:</strong> Revert to draft status for
                                                        editing
                                                    </span>
                                                </li>
                                            )}
                                            <li className="flex items-start gap-2">
                                                <span className="w-1.5 h-1.5 bg-red-500 rounded-full mt-1.5" />
                                                <span>
                                                    <strong>Delete:</strong> Permanently remove this
                                                    parameter
                                                    {isAnalysisStarted &&
                                                        " (will disrupt ongoing analysis)"}
                                                </span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-1.5" />
                                                <span>
                                                    <strong>View:</strong> You can still view all
                                                    parameter details below
                                                </span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            }

            // ========== REVIEWER VIEW - ANALYSIS COMPLETED (AWAITING APPROVAL) ==========
            if (role.toLowerCase() === "reviewer" && isAnalysisCompleted && param) {
                return (
                    <div className="relative mb-8 rounded-2xl overflow-hidden border border-slate-200 shadow-lg bg-white">
                        <div className="bg-gradient-to-r from-emerald-50 via-emerald-100 to-emerald-50 px-6 py-5 border-b border-slate-200">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="relative">
                                        <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                                            <svg
                                                className="w-6 h-6 text-emerald-600 animate-pulse"
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-slate-800">
                                            Analysis Completed
                                        </h3>
                                        <p className="text-sm text-slate-600 mt-0.5">
                                            Review the analysis and approve or request revisions
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    <motion.button
                                        onClick={() => handleApprove(param)}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="px-4 py-2 bg-white/60 backdrop-blur-sm border border-emerald-200 text-emerald-800 text-sm font-semibold rounded-lg hover:bg-white/80 hover:border-emerald-300 transition-all flex items-center gap-2 shadow-sm"
                                    >
                                        <MdDone className="w-4 h-4" />
                                        Approve
                                    </motion.button>

                                    <motion.button
                                        onClick={() => handleRequestRevision(param)}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="px-4 py-2 bg-white/60 backdrop-blur-sm border border-emerald-200 text-emerald-800 text-sm font-semibold rounded-lg hover:bg-white/80 hover:border-emerald-300 transition-all flex items-center gap-2 shadow-sm"
                                    >
                                        <svg
                                            className="w-4 h-4"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                            />
                                        </svg>
                                        Request Revision
                                    </motion.button>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 bg-emerald-50">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-white border border-slate-200 rounded-xl p-5">
                                    <div className="flex items-start gap-3">
                                        <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <svg
                                                className="w-5 h-5 text-emerald-600"
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
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-semibold text-sm text-slate-800 mb-2">
                                                Review Actions Available
                                            </h4>
                                            <p className="text-sm text-slate-600">
                                                <strong>Approve:</strong> If all data is accurate and
                                                complete, approve to finalize the parameter.
                                                <br />
                                                <br />
                                                <strong>Request Revision:</strong> If changes are
                                                needed, send it back to the analyst with feedback.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white border border-slate-200 rounded-xl p-5">
                                    <div className="flex items-start gap-3">
                                        <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <svg
                                                className="w-5 h-5 text-emerald-600"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                                />
                                            </svg>
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-semibold text-sm text-slate-800 mb-2">
                                                Review Guidelines
                                            </h4>
                                            <p className="text-sm text-slate-600">
                                                Carefully review all preparations, calculations, and
                                                data. Scroll through the parameter details below to
                                                verify accuracy.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-4 bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                                <div className="flex items-start gap-3">
                                    <svg
                                        className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                        />
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                        />
                                    </svg>
                                    <p className="text-sm text-emerald-800">
                                        <strong>Reminder:</strong> Your decision will be final.
                                        Approved parameters cannot be edited. Parameters sent for
                                        revision will return to the analyst.
                                    </p>
                                </div>
                            </div>

                            {/* Analyst Comment submitted with analysis completion */}
                            {remarksByAnalystPerParam[parameterId] && (
                                <div className="mt-4 bg-gray-50 border border-gray-200 rounded-xl p-4">
                                    <div className="flex items-start gap-3">
                                        <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <svg
                                                className="w-4 h-4 text-gray-500"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                                                />
                                            </svg>
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="text-xs font-semibold text-gray-700 mb-1">
                                                Analyst Comment
                                            </h4>
                                            <p className="text-sm italic text-gray-800 bg-gray-100 rounded-lg px-3 py-2 border border-gray-200">
                                                &ldquo;{remarksByAnalystPerParam[parameterId]}&rdquo;
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                );
            }

            // ========== REVIEWER VIEW - ANALYSIS REVISION ==========
            if (role.toLowerCase() === "reviewer" && isAnalysisRevision && param) {
                const qaRemarks = remarksQAPerParam[parameterId];
                const reviewerRemarks = remarksByReviewerPerParam[parameterId];
                const isFromQA = !!qaRemarks;
                const activeRemarks = isFromQA ? qaRemarks : reviewerRemarks;
                const senderLabel = isFromQA ? "QA" : "Reviewer (You)";

                return (
                    <div className="relative mb-8 rounded-2xl overflow-hidden border border-slate-200 shadow-lg bg-white">
                        <div className="bg-gradient-to-r from-emerald-50 via-emerald-100 to-emerald-50 px-6 py-5 border-b border-slate-200">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="relative">
                                        <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                                            <svg
                                                className="w-6 h-6 text-emerald-600"
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-slate-800">
                                            Revision In Progress
                                        </h3>
                                        <p className="text-sm text-slate-600 mt-0.5">
                                            Analyst is working on the requested revisions
                                        </p>
                                    </div>
                                </div>

                                <div className="px-4 py-2 bg-white/60 backdrop-blur-sm border border-emerald-200 rounded-lg">
                                    <span className="text-sm font-semibold text-emerald-800">
                                        AWAITING REVISION
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 bg-emerald-50">
                            <div className="grid grid-cols-1 gap-4">
                                {/* Revision Remarks — show what was sent */}
                                {activeRemarks ? (
                                    <div className="bg-white border border-emerald-200 rounded-xl p-5">
                                        <div className="flex items-start gap-3">
                                            <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center flex-shrink-0">
                                                <svg
                                                    className="w-5 h-5 text-emerald-600"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                                                    />
                                                </svg>
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-semibold text-sm text-slate-800 mb-2 flex items-center gap-2">
                                                    Revision Remarks Sent
                                                    <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-emerald-100 text-emerald-800">
                                                        from {senderLabel}
                                                    </span>
                                                </h4>
                                                <p className="text-sm italic leading-relaxed px-4 py-3 rounded-lg border text-emerald-900 bg-emerald-50 border-emerald-100">
                                                    &ldquo;{activeRemarks}&rdquo;
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="bg-white border border-slate-200 rounded-xl p-5">
                                        <div className="flex items-start gap-3">
                                            <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                                <svg
                                                    className="w-5 h-5 text-slate-400"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                                                    />
                                                </svg>
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-semibold text-sm text-slate-800 mb-1">
                                                    Revision Remarks
                                                </h4>
                                                <p className="text-sm text-slate-400 italic">
                                                    No remarks were provided with this revision request.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="bg-white border border-slate-200 rounded-xl p-5">
                                    <div className="flex items-start gap-3">
                                        <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <svg
                                                className="w-5 h-5 text-emerald-600"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                                />
                                            </svg>
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-semibold text-sm text-slate-800 mb-2">
                                                Current Status
                                            </h4>
                                            <ul className="text-sm text-slate-600 space-y-2">
                                                <li className="flex items-start gap-2">
                                                    <span className="text-emerald-500 mt-1">•</span>
                                                    <span>
                                                        {isFromQA ? "QA" : "You"} requested revisions on
                                                        this parameter
                                                    </span>
                                                </li>
                                                <li className="flex items-start gap-2">
                                                    <span className="text-emerald-500 mt-1">•</span>
                                                    <span>
                                                        The analyst is currently making the necessary
                                                        changes
                                                    </span>
                                                </li>
                                                <li className="flex items-start gap-2">
                                                    <span className="text-emerald-500 mt-1">•</span>
                                                    <span>
                                                        Once complete, it will be resubmitted for your
                                                        review
                                                    </span>
                                                </li>
                                                <li className="flex items-start gap-2">
                                                    <span className="text-emerald-500 mt-1">•</span>
                                                    <span>You can view all parameter details below</span>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-slate-100 border border-slate-200 rounded-xl p-4">
                                    <div className="flex items-start gap-3">
                                        <svg
                                            className="w-5 h-5 text-slate-600 flex-shrink-0 mt-0.5"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                            />
                                        </svg>
                                        <p className="text-sm text-slate-700">
                                            <strong>Please wait:</strong> The parameter will return to
                                            &quot;Analysis Completed&quot; status once the analyst
                                            finishes the revisions.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            }

            // ========== Reviewer VIEW - APPROVED ==========
            if (role.toLowerCase() === "reviewer" && isApproved && param) {
                return (
                    <div className="relative mb-8 rounded-2xl overflow-hidden border border-slate-200 shadow-lg bg-white">
                        <div className="bg-gradient-to-r from-emerald-50 via-emerald-100 to-emerald-50 px-6 py-5 border-b border-slate-200">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="relative">
                                        <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                                            <svg
                                                className="w-6 h-6 text-emerald-600"
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-slate-800">
                                            Parameter Approved & Finalized
                                        </h3>
                                        <p className="text-sm text-slate-600 mt-0.5">
                                            This parameter has been reviewed and approved
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 bg-emerald-50">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-white border border-slate-200 rounded-xl p-5">
                                    <div className="flex items-start gap-3">
                                        <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <svg
                                                className="w-5 h-5 text-emerald-600"
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
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-semibold text-sm text-slate-800 mb-1">
                                                Status: Approved
                                            </h4>
                                            <p className="text-sm text-slate-600">
                                                This parameter has been finalized and approved. All data
                                                is now locked and cannot be modified.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white border border-slate-200 rounded-xl p-5">
                                    <div className="flex items-start gap-3">
                                        <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <svg
                                                className="w-5 h-5 text-emerald-600"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                                />
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                                />
                                            </svg>
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-semibold text-sm text-slate-800 mb-1">
                                                View Only Access
                                            </h4>
                                            <p className="text-sm text-slate-600">
                                                You can view all parameter details, preparations, and
                                                calculations below.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Reviewer Remarks on Approval */}
                        {remarksByReviewerPerParam[parameterId] && (
                            <div className="mx-6 mb-3 bg-blue-50 border border-blue-200 rounded-xl p-4">
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <svg
                                            className="w-4 h-4 text-blue-600"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                                            />
                                        </svg>
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="text-xs font-semibold text-blue-800 mb-1">
                                            Reviewer Remarks
                                        </h4>
                                        <p className="text-sm italic text-blue-900 bg-blue-100 rounded-lg px-3 py-2 border border-blue-200">
                                            &ldquo;{remarksByReviewerPerParam[parameterId]}&rdquo;
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Analyst Comment */}
                        {remarksByAnalystPerParam[parameterId] && (
                            <div className="mx-6 mb-4 bg-gray-50 border border-gray-200 rounded-xl p-4">
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <svg
                                            className="w-4 h-4 text-gray-500"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                                            />
                                        </svg>
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="text-xs font-semibold text-gray-700 mb-1">
                                            Analyst Comment
                                        </h4>
                                        <p className="text-sm italic text-gray-800 bg-gray-100 rounded-lg px-3 py-2 border border-gray-200">
                                            &ldquo;{remarksByAnalystPerParam[parameterId]}&rdquo;
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                );
            }

            // If none of the conditions match, return null (no overlay)

            // ========== QA VIEW - APPROVED (Reviewer approved, pending QA worksheet approval) ==========
            if (role.toLowerCase() === "qa" && isApproved && param) {
                return (
                    <div className="relative mb-8 rounded-2xl overflow-hidden border border-slate-200 shadow-lg bg-white">
                        <div className="bg-gradient-to-r from-emerald-50 via-emerald-100 to-emerald-50 px-6 py-5 border-b border-slate-200">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                                        <svg
                                            className="w-6 h-6 text-emerald-600"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-slate-800">
                                            {worksheetInfo?.sample.status === "Approved"
                                                ? "Worksheet Approved & Finalized"
                                                : "Reviewer Approved — Pending QA Worksheet Approval"}
                                        </h3>
                                        <p className="text-sm text-slate-600 mt-0.5">
                                            {worksheetInfo?.sample.status === "Approved"
                                                ? "This worksheet has been fully approved by QA. All data is locked."
                                                : "You can return this parameter for revision, or approve the entire worksheet once all parameters are reviewed"}
                                        </p>
                                    </div>
                                </div>
                                {worksheetInfo?.sample.status !== "Approved" && (
                                    <motion.button
                                        onClick={() => handleRequestRevision(param)}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="px-4 py-2 bg-white/60 backdrop-blur-sm border border-amber-200 text-amber-700 text-sm font-semibold rounded-lg hover:bg-white/80 hover:border-amber-300 transition-all flex items-center gap-2 shadow-sm"
                                    >
                                        <svg
                                            className="w-4 h-4"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                            />
                                        </svg>
                                        Return for Revision
                                    </motion.button>
                                )}
                            </div>
                        </div>
                    </div>
                );
            }

            // ========== QA VIEW - ANALYSIS REVISION (parameter sent back by QA or Reviewer) ==========
            if (role.toLowerCase() === "qa" && isAnalysisRevision && param) {
                const qaRemarks = remarksQAPerParam[parameterId];
                const reviewerRemarks = remarksByReviewerPerParam[parameterId];
                const isFromQA = !!qaRemarks;
                const activeRemarks = isFromQA ? qaRemarks : reviewerRemarks;
                const senderLabel = isFromQA ? "QA" : "Reviewer";

                return (
                    <div className="relative mb-8 rounded-2xl overflow-hidden border border-slate-200 shadow-lg bg-white">
                        {/* Header */}
                        <div
                            className={`bg-gradient-to-r ${isFromQA ? "from-amber-50 via-amber-100 to-amber-50" : "from-slate-50 via-slate-100 to-slate-50"} px-6 py-5 border-b border-slate-200`}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div
                                        className={`w-12 h-12 ${isFromQA ? "bg-amber-100" : "bg-slate-200"} rounded-xl flex items-center justify-center`}
                                    >
                                        <svg
                                            className={`w-6 h-6 ${isFromQA ? "text-amber-600" : "text-slate-600"} animate-pulse`}
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-slate-800">
                                            Revision In Progress — Returned by {senderLabel}
                                        </h3>
                                        <p className="text-sm text-slate-600 mt-0.5">
                                            Analyst is working on the requested revisions
                                        </p>
                                    </div>
                                </div>
                                <div
                                    className={`px-4 py-2 bg-white/60 backdrop-blur-sm border ${isFromQA ? "border-amber-200" : "border-slate-300"} rounded-lg`}
                                >
                                    <span
                                        className={`text-sm font-semibold ${isFromQA ? "text-amber-700" : "text-slate-600"} uppercase tracking-wider`}
                                    >
                                        AWAITING REVISION
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Content Body */}
                        <div className={`p-6 ${isFromQA ? "bg-amber-50" : "bg-slate-50"}`}>
                            <div className="grid grid-cols-1 gap-4">
                                {/* Remarks Card — most prominent */}
                                {activeRemarks ? (
                                    <div
                                        className={`bg-white border ${isFromQA ? "border-amber-200" : "border-slate-200"} rounded-xl p-5`}
                                    >
                                        <div className="flex items-start gap-3">
                                            <div
                                                className={`w-10 h-10 ${isFromQA ? "bg-amber-50" : "bg-slate-100"} rounded-lg flex items-center justify-center flex-shrink-0`}
                                            >
                                                <svg
                                                    className={`w-5 h-5 ${isFromQA ? "text-amber-600" : "text-slate-600"}`}
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                                                    />
                                                </svg>
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-semibold text-sm text-slate-800 mb-2 flex items-center gap-2">
                                                    Revision Remarks
                                                    <span
                                                        className={`text-xs px-2 py-0.5 rounded-full font-medium ${isFromQA ? "bg-amber-100 text-amber-700" : "bg-slate-200 text-slate-600"}`}
                                                    >
                                                        from {senderLabel}
                                                    </span>
                                                </h4>
                                                <p
                                                    className={`text-sm italic leading-relaxed px-4 py-3 rounded-lg border ${isFromQA ? "text-amber-900 bg-amber-50 border-amber-100" : "text-slate-700 bg-slate-50 border-slate-100"}`}
                                                >
                                                    &ldquo;{activeRemarks}&rdquo;
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="bg-white border border-slate-200 rounded-xl p-5">
                                        <div className="flex items-start gap-3">
                                            <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                                <svg
                                                    className="w-5 h-5 text-slate-400"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                                                    />
                                                </svg>
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-semibold text-sm text-slate-800 mb-1">
                                                    Revision Remarks
                                                </h4>
                                                <p className="text-sm text-slate-400 italic">
                                                    No remarks provided by {senderLabel}.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Status Info Card */}
                                <div className="bg-white border border-slate-200 rounded-xl p-5">
                                    <div className="flex items-start gap-3">
                                        <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <svg
                                                className="w-5 h-5 text-slate-500"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                                />
                                            </svg>
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-semibold text-sm text-slate-800 mb-2">
                                                Current Status
                                            </h4>
                                            <ul className="text-sm text-slate-600 space-y-2">
                                                <li className="flex items-start gap-2">
                                                    <span
                                                        className={`${isFromQA ? "text-amber-500" : "text-slate-400"} mt-1`}
                                                    >
                                                        •
                                                    </span>
                                                    <span>
                                                        {senderLabel} returned this parameter for revision
                                                    </span>
                                                </li>
                                                <li className="flex items-start gap-2">
                                                    <span
                                                        className={`${isFromQA ? "text-amber-500" : "text-slate-400"} mt-1`}
                                                    >
                                                        •
                                                    </span>
                                                    <span>
                                                        The analyst is currently making the necessary
                                                        changes
                                                    </span>
                                                </li>
                                                <li className="flex items-start gap-2">
                                                    <span
                                                        className={`${isFromQA ? "text-amber-500" : "text-slate-400"} mt-1`}
                                                    >
                                                        •
                                                    </span>
                                                    <span>
                                                        Once complete, it will be resubmitted for Reviewer
                                                        approval
                                                    </span>
                                                </li>
                                                <li className="flex items-start gap-2">
                                                    <span
                                                        className={`${isFromQA ? "text-amber-500" : "text-slate-400"} mt-1`}
                                                    >
                                                        •
                                                    </span>
                                                    <span>You can view all parameter details below</span>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                {/* Wait notice */}
                                <div className="bg-slate-100 border border-slate-200 rounded-xl p-4">
                                    <div className="flex items-start gap-3">
                                        <svg
                                            className="w-5 h-5 text-slate-500 flex-shrink-0 mt-0.5"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                            />
                                        </svg>
                                        <p className="text-sm text-slate-700">
                                            <strong>Please wait:</strong> The parameter will return to
                                            &quot;Analysis Completed&quot; status once the analyst
                                            finishes the revisions and the Reviewer re-approves it.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            }

            return null;
        },
        (prevProps, nextProps) => {
            return (
                prevProps.parameterId === nextProps.parameterId &&
                (parameterStatusPerParam[prevProps.parameterId] || "") ===
                (parameterStatusPerParam[nextProps.parameterId] || "")
            );
        },
    );

    LockedParameterOverlay.displayName = "LockedParameterOverlay";

    const BottomParameterActionBar: React.FC<{ parameterId: number }> =
        React.memo(
            ({ parameterId }) => {
                const status = (
                    parameterStatusPerParam[parameterId] || "Created"
                ).toLowerCase();
                const canUnlock = status === "analysis pending";
                const isAnalysisStarted = status === "analysis started";
                const isAnalysisPending = status === "analysis pending";
                const isAnalysisCompleted = status === "analysis completed";
                const isAnalysisRevision = status === "analysis revision";
                const isApproved = status === "approved";
                const isCreated = status === "created";
                const param = addedParameters.find((p) => p.id === parameterId);

                // ========== ANALYST VIEW - CREATED (NO BAR) ==========
                if (role.toLowerCase() === "analyst" && isCreated) {
                    return null; // No action bar needed for created status
                }

                // ========== ANALYST VIEW - ANALYSIS PENDING ==========
                if (role.toLowerCase() === "analyst" && isAnalysisPending && param) {
                    return (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-8 rounded-xl overflow-hidden border border-slate-200 shadow-lg bg-white"
                        >
                            <div className="bg-gradient-to-r from-emerald-50 via-emerald-100 to-emerald-50 px-6 py-4 border-b border-slate-200">
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
                                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-bold text-slate-800">
                                                Analysis Pending - Ready to Start
                                            </h4>
                                            <p className="text-xs text-slate-600">
                                                Click "Start Analysis" to begin working on this
                                                parameter
                                            </p>
                                        </div>
                                    </div>

                                    <motion.button
                                        onClick={() => handleStartAnalysis(param)}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="px-5 py-2.5 bg-white/60 backdrop-blur-sm border border-emerald-200 text-emerald-800 text-sm font-semibold rounded-lg hover:bg-white/80 hover:border-emerald-300 transition-all flex items-center gap-2 shadow-sm"
                                    >
                                        <BsPlayFill className="w-5 h-5" />
                                        Start Analysis
                                    </motion.button>
                                </div>
                            </div>
                        </motion.div>
                    );
                }

                // ========== ANALYST VIEW - ANALYSIS STARTED ==========
                if (role.toLowerCase() === "analyst" && isAnalysisStarted && param) {
                    return (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-8 rounded-xl overflow-hidden border border-slate-200 shadow-lg bg-white"
                        >
                            <div className="bg-gradient-to-r from-emerald-50 via-emerald-100 to-emerald-50 px-6 py-4 border-b border-slate-200">
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
                                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
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
                                        onClick={() => handleCompleteAnalysis(param)}
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
                        </motion.div>
                    );
                }

                // ========== ANALYST VIEW - ANALYSIS COMPLETED ==========
                if (role.toLowerCase() === "analyst" && isAnalysisCompleted && param) {
                    return (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-8 rounded-xl overflow-hidden border border-slate-200 shadow-lg bg-white"
                        >
                            <div className="bg-gradient-to-r from-emerald-50 via-emerald-100 to-emerald-50 px-6 py-4 border-b border-slate-200">
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
                                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-bold text-slate-800">
                                                Analysis Completed
                                            </h4>
                                            <p className="text-xs text-slate-600">
                                                Your work has been submitted and is under review
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    );
                }

                // ========== ANALYST VIEW - ANALYSIS REVISION ==========
                if (role.toLowerCase() === "analyst" && isAnalysisRevision && param) {
                    const qaRemarks = remarksQAPerParam[parameterId];
                    const reviewerRemarks = remarksByReviewerPerParam[parameterId];
                    const isFromQA = !!qaRemarks;
                    return (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-8 rounded-xl overflow-hidden border border-slate-200 shadow-lg bg-white"
                        >
                            <div className="bg-gradient-to-r from-emerald-50 via-emerald-100 to-emerald-50 px-6 py-4 border-b border-slate-200">
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
                                                    d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-bold text-slate-800">
                                                Revision Requested {isFromQA ? "by QA" : "by Reviewer"}
                                            </h4>
                                            <p className="text-xs text-slate-600">
                                                {isFromQA
                                                    ? "QA has requested revisions. Review feedback and update your work"
                                                    : "Reviewer has requested revisions. Review feedback and update your work"}
                                            </p>
                                        </div>
                                    </div>

                                    <motion.button
                                        onClick={() => handleCompleteAnalysis(param)}
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
                                        Complete Revision
                                    </motion.button>
                                </div>
                            </div>

                            {/* Remarks Block — always shown, if/else for no remarks */}
                            {(() => {
                                const activeRemarks = isFromQA
                                    ? qaRemarks
                                    : reviewerRemarks;
                                const senderLabel = isFromQA ? "QA" : "Reviewer";
                                return activeRemarks ? (
                                    <div
                                        className={`px-6 py-4 border-t ${isFromQA ? "bg-amber-50 border-amber-100" : "bg-slate-50 border-slate-100"}`}
                                    >
                                        <div className="flex items-start gap-3">
                                            <svg
                                                className={`w-4 h-4 mt-0.5 flex-shrink-0 ${isFromQA ? "text-amber-500" : "text-slate-400"}`}
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                                                />
                                            </svg>
                                            <div className="flex-1 min-w-0">
                                                <span
                                                    className={`text-xs font-semibold uppercase tracking-wide ${isFromQA ? "text-amber-600" : "text-slate-500"}`}
                                                >
                                                    {isFromQA ? "QA Remarks" : "Reviewer Remarks"}
                                                </span>
                                                <p
                                                    className={`mt-1 text-sm italic leading-relaxed ${isFromQA ? "text-amber-900" : "text-slate-700"}`}
                                                >
                                                    &ldquo;{activeRemarks}&rdquo;
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="px-6 py-3 border-t border-slate-100 bg-slate-50">
                                        <p className="text-xs text-slate-400 italic">
                                            No remarks provided by {senderLabel}.
                                        </p>
                                    </div>
                                );
                            })()}
                        </motion.div>
                    );
                }

                // ========== ANALYST VIEW - APPROVED ==========
                if (role.toLowerCase() === "analyst" && isApproved && param) {
                    return (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-8 rounded-xl overflow-hidden border border-slate-200 shadow-lg bg-white"
                        >
                            <div className="bg-gradient-to-r from-emerald-50 via-emerald-100 to-emerald-50 px-6 py-4 border-b border-slate-200">
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
                                                    d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-bold text-slate-800">
                                                Parameter Approved - Well Done!
                                            </h4>
                                            <p className="text-xs text-slate-600">
                                                Your analysis has been reviewed and approved by Reviewer
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    );
                }

                // ========== reviewer VIEW - CREATED ==========
                if (role.toLowerCase() === "reviewer" && isCreated && param) {
                    return (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-8 rounded-xl overflow-hidden border border-slate-200 shadow-lg bg-white"
                        >
                            <div className="bg-gradient-to-r from-slate-50 via-gray-50 to-slate-50 px-6 py-4 border-b border-slate-200">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                                            <svg
                                                className="w-5 h-5 text-slate-600"
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-bold text-slate-800">
                                                Parameter in Draft Mode
                                            </h4>
                                            <p className="text-xs text-slate-600">
                                                This parameter is being prepared and has not been
                                                submitted yet
                                            </p>
                                        </div>
                                    </div>

                                    <motion.button
                                        onClick={() => handleInitiateDelete(param)}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="px-4 py-2 bg-white/60 backdrop-blur-sm border border-red-200 text-red-700 text-sm font-semibold rounded-lg hover:bg-white/80 hover:border-red-300 transition-all flex items-center gap-2 shadow-sm"
                                    >
                                        <svg
                                            className="w-4 h-4"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                            />
                                        </svg>
                                        Delete
                                    </motion.button>
                                </div>
                            </div>
                        </motion.div>
                    );
                }

                // ========== reviewer VIEW - ANALYSIS PENDING OR STARTED ==========
                if (
                    role.toLowerCase() === "reviewer" &&
                    (isAnalysisPending || isAnalysisStarted) &&
                    param
                ) {
                    return (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-8 rounded-xl overflow-hidden border border-slate-200 shadow-lg bg-white"
                        >
                            <div className="bg-gradient-to-r from-slate-50 via-gray-50 to-slate-50 px-6 py-4 border-b border-slate-200">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                                            <svg
                                                className="w-5 h-5 text-slate-600"
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-bold text-slate-800">
                                                {isAnalysisStarted
                                                    ? "Analysis In Progress"
                                                    : "Awaiting Analysis"}
                                            </h4>
                                            <p className="text-xs text-slate-600">
                                                Status:{" "}
                                                <span className="uppercase font-semibold">
                                                    {status}
                                                </span>
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex gap-2">
                                        {canUnlock && (
                                            <motion.button
                                                onClick={() => handleInitiateUnlock(param)}
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                className="px-4 py-2 bg-white/60 backdrop-blur-sm border border-emerald-200 text-emerald-800 text-sm font-semibold rounded-lg hover:bg-white/80 hover:border-emerald-300 transition-all flex items-center gap-2 shadow-sm"
                                            >
                                                <svg
                                                    className="w-4 h-4"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"
                                                    />
                                                </svg>
                                                Unlock
                                            </motion.button>
                                        )}

                                        <motion.button
                                            onClick={() => handleInitiateDelete(param)}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            className="px-4 py-2 bg-white/60 backdrop-blur-sm border border-red-200 text-red-700 text-sm font-semibold rounded-lg hover:bg-white/80 hover:border-red-300 transition-all flex items-center gap-2 shadow-sm"
                                        >
                                            <svg
                                                className="w-4 h-4"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                                />
                                            </svg>
                                            Delete
                                        </motion.button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    );
                }

                // ========== reviewer VIEW - ANALYSIS COMPLETED ==========
                if (role.toLowerCase() === "reviewer" && isAnalysisCompleted && param) {
                    return (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-8 rounded-xl overflow-hidden border border-slate-200 shadow-lg bg-white"
                        >
                            <div className="bg-gradient-to-r from-emerald-50 via-emerald-100 to-emerald-50 px-6 py-4 border-b border-slate-200">
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
                                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-bold text-slate-800">
                                                Analysis Completed
                                            </h4>
                                            <p className="text-xs text-slate-600">
                                                Review the analysis and approve or request revisions
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex gap-2">
                                        <motion.button
                                            onClick={() => handleApprove(param)}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            className="px-4 py-2 bg-white/60 backdrop-blur-sm border border-emerald-200 text-emerald-800 text-sm font-semibold rounded-lg hover:bg-white/80 hover:border-emerald-300 transition-all flex items-center gap-2 shadow-sm"
                                        >
                                            <MdDone className="w-4 h-4" />
                                            Approve
                                        </motion.button>

                                        <motion.button
                                            onClick={() => handleRequestRevision(param)}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            className="px-4 py-2 bg-white/60 backdrop-blur-sm border border-emerald-200 text-emerald-800 text-sm font-semibold rounded-lg hover:bg-white/80 hover:border-emerald-300 transition-all flex items-center gap-2 shadow-sm"
                                        >
                                            <svg
                                                className="w-4 h-4"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                                />
                                            </svg>
                                            Request Revision
                                        </motion.button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    );
                }

                // ========== reviewer VIEW - ANALYSIS REVISION ==========
                if (role.toLowerCase() === "reviewer" && isAnalysisRevision && param) {
                    const qaRemarks = remarksQAPerParam[parameterId];
                    const reviewerRemarks = remarksByReviewerPerParam[parameterId];
                    const isFromQA = !!qaRemarks;
                    return (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-8 rounded-xl overflow-hidden border border-slate-200 shadow-lg bg-white"
                        >
                            <div className="bg-gradient-to-r from-emerald-50 via-emerald-100 to-emerald-50 px-6 py-4 border-b border-slate-200">
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
                                                    d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-bold text-slate-800">
                                                Revision In Progress —{" "}
                                                {isFromQA ? "Returned by QA" : "Requested by You"}
                                            </h4>
                                            <p className="text-xs text-slate-600">
                                                Analyst is working on the requested revisions
                                            </p>
                                        </div>
                                    </div>

                                    <div className="px-4 py-2 bg-white/60 backdrop-blur-sm border border-emerald-200 rounded-lg">
                                        <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">
                                            Awaiting Revision
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Remarks Block — always shown */}
                            {(() => {
                                const activeRemarks = isFromQA ? qaRemarks : reviewerRemarks;
                                const senderLabel = isFromQA ? "QA" : "You";
                                return activeRemarks ? (
                                    <div
                                        className={`px-6 py-4 border-t ${isFromQA ? "bg-amber-50 border-amber-100" : "bg-slate-50 border-slate-100"}`}
                                    >
                                        <div className="flex items-start gap-3">
                                            <svg
                                                className={`w-4 h-4 mt-0.5 flex-shrink-0 ${isFromQA ? "text-amber-500" : "text-slate-400"}`}
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                                                />
                                            </svg>
                                            <div className="flex-1 min-w-0">
                                                <span
                                                    className={`text-xs font-semibold uppercase tracking-wide ${isFromQA ? "text-amber-600" : "text-slate-500"}`}
                                                >
                                                    {isFromQA ? "QA Remarks" : "Your Remarks"}
                                                </span>
                                                <p
                                                    className={`mt-1 text-sm italic leading-relaxed ${isFromQA ? "text-amber-900" : "text-slate-700"}`}
                                                >
                                                    &ldquo;{activeRemarks}&rdquo;
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="px-6 py-3 border-t border-slate-100 bg-slate-50">
                                        <p className="text-xs text-slate-400 italic">
                                            No remarks were provided with this revision request.
                                        </p>
                                    </div>
                                );
                            })()}
                        </motion.div>
                    );
                }

                if (param) {
                    const isQAApproved = !!approvedByQAPerParam[parameterId];
                    const isReviewerApproved = isApproved;
                    const isAnalysisRevisionState = isAnalysisRevision;

                    // ── STAGE 3: Fully QA Approved (final) ──────────────────────
                    if (isQAApproved) {
                        return (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mt-8 rounded-xl overflow-hidden border border-emerald-200 shadow-lg bg-white"
                            >
                                <div className="bg-gradient-to-r from-emerald-50 via-emerald-100 to-emerald-50 px-6 py-4">
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
                                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-bold text-slate-800">
                                                    Approved & Finalized
                                                </h4>
                                                <p className="text-xs text-slate-600">
                                                    This parameter has been fully approved. All data is
                                                    locked.
                                                </p>
                                            </div>
                                        </div>
                                        <div className="px-3 py-1.5 bg-emerald-100 border border-emerald-300 rounded-lg">
                                            <span className="text-xs font-semibold text-emerald-800">
                                                QA Approved
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    }

                    // ── STAGE 2: Reviewer Approved — Awaiting QA ────────────────
                    if (isReviewerApproved) {
                        return (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mt-8 rounded-xl overflow-hidden border border-slate-200 shadow-lg bg-white"
                            >
                                <div className="bg-gradient-to-r from-emerald-50 via-emerald-100 to-emerald-50 px-6 py-4">
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
                                                        d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-bold text-slate-800">
                                                    Approved by Reviewer — Awaiting QA Approval
                                                </h4>
                                                <p className="text-xs text-slate-600">
                                                    {role.toLowerCase() === "qa"
                                                        ? "You can return this parameter for revision, or approve the entire worksheet once all parameters are reviewed"
                                                        : "Awaiting QA validation"}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {role.toLowerCase() === "qa" && (
                                                <motion.button
                                                    onClick={() => handleQARequestRevision(param)}
                                                    whileHover={{ scale: 1.02 }}
                                                    whileTap={{ scale: 0.98 }}
                                                    className="px-4 py-2 bg-white/60 backdrop-blur-sm border border-amber-200 text-amber-700 text-sm font-semibold rounded-lg hover:bg-white/80 hover:border-amber-300 transition-all flex items-center gap-2 shadow-sm"
                                                >
                                                    <svg
                                                        className="w-4 h-4"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        stroke="currentColor"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                                        />
                                                    </svg>
                                                    Return for Revision
                                                </motion.button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    }

                    // ── STAGE 1: Revision In Progress ──
                    if (isAnalysisRevisionState) {
                        const qaRemarks = remarksQAPerParam[parameterId];
                        const reviewerRemarks = remarksByReviewerPerParam[parameterId];
                        const isFromQA = !!qaRemarks;
                        return (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mt-8 rounded-xl overflow-hidden border border-slate-200 shadow-lg bg-white"
                            >
                                <div className="bg-gradient-to-r from-amber-50 via-amber-100 to-amber-50 px-6 py-4 border-b border-slate-200">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                                                <svg
                                                    className="w-5 h-5 text-amber-600 animate-pulse"
                                                    fill="currentColor"
                                                    viewBox="0 0 20 20"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-bold text-slate-800">
                                                    Revision In Progress —{" "}
                                                    {isFromQA ? "Returned by QA" : "Returned by Reviewer"}
                                                </h4>
                                                <p className="text-xs text-slate-600">
                                                    Analyst is working on revisions
                                                </p>
                                            </div>
                                        </div>
                                        <div className="px-4 py-2 bg-white/60 backdrop-blur-sm border border-amber-200 rounded-lg">
                                            <span className="text-xs font-semibold text-amber-700 uppercase tracking-wider">
                                                Awaiting Revision
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                {/* Remarks Block — always shown */}
                                {(() => {
                                    const activeRemarks = isFromQA ? qaRemarks : reviewerRemarks;
                                    const senderLabel = isFromQA ? "QA" : "Reviewer";
                                    return activeRemarks ? (
                                        <div
                                            className={`px-6 py-4 border-t ${isFromQA ? "bg-amber-50 border-amber-100" : "bg-slate-50 border-slate-100"}`}
                                        >
                                            <div className="flex items-start gap-3">
                                                <svg
                                                    className={`w-4 h-4 mt-0.5 flex-shrink-0 ${isFromQA ? "text-amber-500" : "text-slate-400"}`}
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                                                    />
                                                </svg>
                                                <div className="flex-1 min-w-0">
                                                    <span
                                                        className={`text-xs font-semibold uppercase tracking-wide ${isFromQA ? "text-amber-600" : "text-slate-500"}`}
                                                    >
                                                        {isFromQA ? "QA Remarks" : "Reviewer Remarks"}
                                                    </span>
                                                    <p
                                                        className={`mt-1 text-sm italic leading-relaxed ${isFromQA ? "text-amber-900" : "text-slate-700"}`}
                                                    >
                                                        &ldquo;{activeRemarks}&rdquo;
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="px-6 py-3 border-t border-slate-100 bg-slate-50">
                                            <p className="text-xs text-slate-400 italic">
                                                No remarks provided by {senderLabel}.
                                            </p>
                                        </div>
                                    );
                                })()}
                            </motion.div>
                        );
                    }

                    // ── STAGE 0: Pending Reviewer Approval ──────────────────────
                    return (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-8 rounded-xl overflow-hidden border border-slate-200 shadow-lg bg-white"
                        >
                            <div className="bg-gradient-to-r from-slate-50 via-gray-50 to-slate-50 px-6 py-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                                        <svg
                                            className="w-5 h-5 text-slate-600"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-slate-800">
                                            Pending Reviewer Approval
                                        </h4>
                                        <p className="text-xs text-slate-600">
                                            Status:{" "}
                                            <span className="uppercase font-semibold">{status}</span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    );
                }
                // If none of the conditions match, return null (no action bar)
                return null;
            },
            (prevProps, nextProps) => {
                return (
                    prevProps.parameterId === nextProps.parameterId &&
                    (parameterStatusPerParam[prevProps.parameterId] || "") ===
                    (parameterStatusPerParam[nextProps.parameterId] || "") &&
                    (remarksQAPerParam[prevProps.parameterId] ?? null) ===
                    (remarksQAPerParam[nextProps.parameterId] ?? null) &&
                    (remarksByReviewerPerParam[prevProps.parameterId] ?? null) ===
                    (remarksByReviewerPerParam[nextProps.parameterId] ?? null) &&
                    (remarksByAnalystPerParam[prevProps.parameterId] ?? null) ===
                    (remarksByAnalystPerParam[nextProps.parameterId] ?? null)
                );
            },
        );
    // Loading/Error states
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
                            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.1, 0.3] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute w-64 h-64 rounded-full bg-emerald-500/20 blur-3xl"
                        />
                        <motion.div
                            animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.05, 0.2] }}
                            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                            className="absolute w-80 h-80 rounded-full bg-emerald-600/10 blur-3xl"
                        />
                    </div>

                    <div className="relative overflow-hidden bg-gradient-to-br from-emerald-700 via-emerald-800 to-slate-900 rounded-2xl shadow-2xl border border-emerald-700/40 p-12 min-w-[400px]">
                        {/* dot texture */}
                        <div
                            className="absolute inset-0 opacity-[0.04] pointer-events-none"
                            style={{ backgroundImage: "radial-gradient(rgba(255,255,255,.8) 1px, transparent 1px)", backgroundSize: "18px 18px" }}
                        />
                        <div className="relative z-10 flex justify-center mb-6">
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                className="relative w-20 h-20"
                            >
                                <div className="absolute inset-0 rounded-full border-4 border-white/10"></div>
                                <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-emerald-400 border-r-emerald-400"></div>
                                <div className="absolute inset-2 rounded-full bg-white/5"></div>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <svg className="w-8 h-8 text-emerald-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                            </motion.div>
                        </div>

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

                            <motion.div
                                className="flex justify-center gap-1.5 pt-2"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.4 }}
                            >
                                {[0, 1, 2].map((i) => (
                                    <motion.div
                                        key={i}
                                        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 1, 0.3] }}
                                        transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
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

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 flex items-center justify-center p-4">
                <motion.div
                    key="error"
                    {...animationProps}
                    className="flex flex-col justify-center items-center py-20 bg-gradient-to-br from-emerald-800 via-emerald-900 to-slate-900 rounded-2xl shadow-2xl border border-red-500/30 w-full max-w-lg min-h-[400px] relative overflow-hidden"
                >
                    <div className="absolute inset-0 opacity-[0.04] pointer-events-none" style={{ backgroundImage: "radial-gradient(rgba(255,255,255,.8) 1px, transparent 1px)", backgroundSize: "18px 18px" }} />
                    <motion.div
                        {...loadingIconProps}
                        className="relative z-10 p-5 rounded-full bg-red-500/20 border border-red-400/30 mb-6 shadow-lg"
                    >
                        <Target className="w-14 h-14 text-red-400" />
                    </motion.div>
                    <span className="relative z-10 text-2xl font-semibold text-white tracking-wide">
                        Failed to Load Worksheet
                    </span>
                    <span className="relative z-10 text-base text-emerald-300/70 mt-3 max-w-md text-center px-6">
                        {error}
                    </span>
                </motion.div>
            </div>
        );
    }

    if (
        role === "QA" &&
        worksheetInfo &&
        worksheetInfo.sample.status !== "Submitted For QA Review" &&
        worksheetInfo.sample.status !== "Approved"
    ) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 flex items-center justify-center p-4">
                <motion.div
                    key="qa-gate"
                    {...animationProps}
                    className="flex flex-col justify-center items-center py-20 bg-gradient-to-br from-emerald-800 via-emerald-900 to-slate-900 rounded-2xl shadow-2xl border border-violet-500/30 w-full max-w-lg min-h-[400px] relative overflow-hidden"
                >
                    <div className="absolute inset-0 opacity-[0.04] pointer-events-none" style={{ backgroundImage: "radial-gradient(rgba(255,255,255,.8) 1px, transparent 1px)", backgroundSize: "18px 18px" }} />
                    <motion.div
                        {...loadingIconProps}
                        className="relative z-10 p-5 rounded-full bg-violet-500/20 border border-violet-400/30 mb-6 shadow-lg"
                    >
                        <svg className="w-14 h-14 text-violet-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                        </svg>
                    </motion.div>
                    <span className="relative z-10 text-2xl font-semibold text-white tracking-wide">
                        Awaiting QA Submission
                    </span>
                    <span className="relative z-10 text-base text-emerald-300/70 mt-3 max-w-md text-center px-6">
                        This worksheet has not yet been submitted for QA Review. It will become available once the Reviewer submits it after approving all parameters.
                    </span>
                    <div className="relative z-10 mt-4 px-4 py-2 bg-violet-500/20 rounded-lg border border-violet-400/30">
                        <span className="text-sm font-semibold text-violet-300 uppercase tracking-wider">
                            Current Status: {worksheetInfo.sample.status}
                        </span>
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <>
            <Toast
                isVisible={showToast}
                message={toastMessage}
                type="success"
                onClose={() => setShowToast(false)}
            />
            <style>{`
        .prep-rich-content, .prep-rich-content * {
          font-family: inherit !important;
          font-size: 0.875rem !important;
        }
        .prep-rich-content p {
          margin: 0 0 0.25rem 0 !important;
          padding: 0 !important;
        }
        .prep-rich-content ul, .prep-rich-content ol {
          margin: 0 !important;
          padding-left: 1.25rem !important;
        }
        .blank-method-content, .blank-method-content * {
          font-family: inherit !important;
          font-size: 0.875rem !important;
        }
        .blank-method-content p {
          margin: 0 0 0.25rem 0 !important;
          padding: 0 !important;
        }
        .ws-prose-reset, .ws-prose-reset * {
          font-family: inherit !important;
          font-size: 0.875rem !important;
        }
        .ws-prose-reset p {
          margin: 0 0 0.25rem 0 !important;
          padding: 0 !important;
        }
        .ws-prose-reset ul, .ws-prose-reset ol {
          margin: 0 !important;
          padding-left: 1.25rem !important;
        }
      `}</style>

            <div className="flex items-start gap-0 min-h-screen bg-slate-900 no-print-layout">


                <div className="flex-1 min-w-0 overflow-y-auto">
                    <div className="mx-auto my-8 p-8 bg-white shadow-2xl max-w-4xl border border-emerald-900/30 rounded-2xl">
                        <div className="flex justify-between items-center text-sm mb-6 pb-4 border-b border-slate-200">
                            <div></div>
                            <div className="flex flex-col items-end">
                                <img src="/ic_efrac.png" alt="EFRAC Logo" className="h-10" />
                            </div>
                        </div>

                        {/* Add after the error state check (around line 2830) */}
                        {!isLoading &&
                            !error &&
                            worksheetInfo?.sample.status.toLowerCase() === "approved" && (
                                <motion.div
                                    initial={{ opacity: 0, y: -20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="mb-6 relative overflow-hidden rounded-2xl"
                                >
                                    {/* Animated background */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-700 via-emerald-1000 to-slate-800" />
                                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-700/50 via-emerald-500/50 to-emerald-400/50 animate-pulse" />

                                    {/* Decorative elements */}
                                    <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
                                    <div className="absolute bottom-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

                                    {/* Content */}
                                    <div className="relative px-8 py-6 flex items-center justify-between">
                                        <div className="flex items-center gap-6">
                                            <motion.div
                                                animate={{
                                                    scale: [1, 1.1, 1],
                                                    rotate: [0, 5, -5, 0],
                                                }}
                                                transition={{ duration: 2, repeat: Infinity }}
                                                className="relative"
                                            >
                                                <div className="absolute inset-0 bg-white/30 rounded-2xl blur-xl" />
                                                <div className="relative w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border-2 border-white/40">
                                                    <svg
                                                        className="w-10 h-10 text-white"
                                                        fill="currentColor"
                                                        viewBox="0 0 20 20"
                                                    >
                                                        <path
                                                            fillRule="evenodd"
                                                            d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                                            clipRule="evenodd"
                                                        />
                                                    </svg>
                                                </div>
                                            </motion.div>

                                            <div>
                                                <h2 className="text-2xl font-bold text-white mb-1 flex items-center gap-2">
                                                    Worksheet Approved & Finalized
                                                </h2>
                                                <p className="text-emerald-50 text-sm font-medium">
                                                    This worksheet has been reviewed and approved. All data is
                                                    locked and finalized.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                        <div className="my-4 border border-emerald-900/40 mb-6 rounded-xl overflow-hidden shadow-xl">
                            <div className="relative flex justify-between items-center px-6 py-5 bg-gradient-to-r from-emerald-700 via-emerald-800 to-slate-900 overflow-hidden">
                                {/* Dot grid texture */}
                                <div
                                    className="absolute inset-0 opacity-[0.045] pointer-events-none"
                                    style={{
                                        backgroundImage: "radial-gradient(rgba(255,255,255,.9) 1px, transparent 1px)",
                                        backgroundSize: "18px 18px",
                                    }}
                                />
                                {/* Glow blobs */}
                                <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-emerald-400/15 blur-3xl pointer-events-none" />
                                <div className="absolute bottom-0 left-12 w-28 h-28 rounded-full bg-teal-300/10 blur-2xl pointer-events-none" />
                                <div className="relative flex items-center gap-4">
                                    <h1 className="flex items-baseline gap-3 tracking-wide text-white">
                                        <span className="text-sm font-semibold">Worksheet ID:</span>
                                        <span className="text-2xl font-extrabold">{worksheetId}</span>
                                    </h1>

                                    {displayStatus && (
                                        <motion.div
                                            initial={{ scale: 0, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            transition={{ type: "spring", duration: 0.6 }}
                                            className="ml-4"
                                        >
                                            {displayStatus.toLowerCase() === "approved" ? (
                                                <div className="relative">
                                                    <div className="relative px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-lg border border-white/30 flex items-center gap-2">
                                                        <motion.div
                                                            animate={{ rotate: [0, 360] }}
                                                            transition={{
                                                                duration: 2,
                                                                repeat: Infinity,
                                                                ease: "linear",
                                                            }}
                                                        >
                                                            <svg
                                                                className="w-4 h-4 text-white"
                                                                fill="currentColor"
                                                                viewBox="0 0 20 20"
                                                            >
                                                                <path
                                                                    fillRule="evenodd"
                                                                    d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                                                    clipRule="evenodd"
                                                                />
                                                            </svg>
                                                        </motion.div>
                                                        <span className="text-xs font-bold text-white uppercase tracking-wider">
                                                            Approved
                                                        </span>
                                                    </div>
                                                </div>
                                            ) : displayStatus.toLowerCase() ===
                                                "submitted for analysis" ? (
                                                <div className="relative px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-lg border border-white/30 flex items-center gap-2">
                                                    <motion.div
                                                        animate={{ rotate: 360 }}
                                                        transition={{
                                                            duration: 2,
                                                            repeat: Infinity,
                                                            ease: "linear",
                                                        }}
                                                        className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full"
                                                    />
                                                    <span className="text-xs font-bold text-white uppercase tracking-wide">
                                                        In Analysis
                                                    </span>
                                                </div>
                                            ) : displayStatus.toLowerCase() === "pending for review" ? (
                                                <div className="relative px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-lg border border-white/30 flex items-center gap-2">
                                                    <motion.div
                                                        animate={{
                                                            scale: [1, 1.2, 1],
                                                            opacity: [1, 0.8, 1],
                                                        }}
                                                        transition={{
                                                            duration: 1.5,
                                                            repeat: Infinity,
                                                            ease: "easeInOut",
                                                        }}
                                                    >
                                                        <svg
                                                            className="w-4 h-4 text-white"
                                                            fill="none"
                                                            viewBox="0 0 24 24"
                                                            stroke="currentColor"
                                                            strokeWidth={2}
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                                                            />
                                                        </svg>
                                                    </motion.div>
                                                    <span className="text-xs font-bold text-white uppercase tracking-wide">
                                                        Pending For Review
                                                    </span>
                                                </div>
                                            ) : (
                                                <div className="relative px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-lg border border-white/30 flex items-center gap-2">
                                                    <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                                                    <span className="text-xs font-bold text-white uppercase tracking-wide">
                                                        {displayStatus}
                                                    </span>
                                                </div>
                                            )}
                                        </motion.div>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="my-4 border border-emerald-900/30 rounded-xl overflow-hidden shadow-md">
                            {/* Dark header row: Reg No + Sample Name */}
                            <div className="relative border-b border-white/10 text-sm bg-gradient-to-br from-emerald-700 via-emerald-800 to-slate-900 overflow-hidden">
                                <div
                                    className="absolute inset-0 opacity-[0.04] pointer-events-none"
                                    style={{
                                        backgroundImage: "radial-gradient(rgba(255,255,255,.9) 1px, transparent 1px)",
                                        backgroundSize: "16px 16px",
                                    }}
                                />
                                <div className="relative flex items-center px-4 py-3 border-r border-white/10">
                                    <span className="font-bold mr-2 text-emerald-300 text-xs uppercase tracking-wider">
                                        Registration No:
                                    </span>
                                    <span className="font-semibold text-white text-sm">
                                        {worksheetInfo
                                            ? worksheetInfo!.sample.registrationNo
                                            : registrationNo || "---"}
                                    </span>
                                </div>
                            </div>

                            {/* Second row: Sample Code + Due Date */}
                            <div className="grid grid-cols-2 text-sm bg-white border-b border-emerald-100">
                                <div className="flex items-center px-4 py-3 border-r border-emerald-100">
                                    <span className="font-bold mr-2 text-emerald-800">
                                        Sample Name:
                                    </span>
                                    <span className="font-semibold text-slate-700">
                                        {worksheetInfo!.sample.sampleName || "---"}
                                    </span>
                                </div>
                                <div className="flex items-center px-4 py-3 border-r border-emerald-100">
                                    <span className="font-bold mr-2 text-emerald-800">
                                        Sample Code:
                                    </span>
                                    <span className="font-semibold text-slate-700">
                                        {(worksheetInfo!.sample as any).sampleCode || "---"}
                                    </span>
                                </div>
                                
                            </div>

                            {/* Third row: Parameters count */}
                            <div className="grid grid-cols-2 text-sm bg-white border-b border-emerald-100">
                                <div className="flex items-center px-4 py-3 border-r border-emerald-100">
                                    <span className="font-bold mr-2 text-emerald-800">
                                        Number of Parameters:
                                    </span>
                                    <span className="font-semibold text-slate-700">
                                        {allParameters.length}
                                    </span>
                                </div>
                                <div className="flex items-center px-4 py-3">
                                    <span className="font-bold mr-2 text-emerald-800">Due Date:</span>
                                    <span className="font-semibold text-slate-700">
                                        {formatDate(worksheetInfo!.sample?.dueDate) || "---"}
                                    </span>
                                </div>
                            </div>

                            {/* Sample Quantity & Nature of Sample — editable for Reviewer, read-only for Analyst/QA */}
                            {role === "Reviewer" && !["Submitted For QA Review", "Approved"].includes(worksheetInfo?.sample.status!) ? (
                                <div className="bg-white">
                                    {/* Edit/Save controls */}
                                    <div className="flex items-center justify-between px-4 py-2 border-b border-emerald-100 bg-emerald-50">
                                        <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
                                            Sample Details
                                        </span>
                                        {!isEditingSampleDetails ? (
                                            <button
                                                onClick={() => setIsEditingSampleDetails(true)}
                                                className="flex items-center gap-1.5 text-xs px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition-colors shadow-sm"
                                            >
                                                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                                </svg>
                                                Edit
                                            </button>
                                        ) : (
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => setIsEditingSampleDetails(false)}
                                                    className="text-xs px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold rounded-lg transition-colors"
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    disabled={isSavingSampleDetails}
                                                    onClick={async () => {
                                                        setIsSavingSampleDetails(true);
                                                        try {
                                                            const data = collectFormDataForAPI();
                                                            await updateWorksheet(worksheetId, data);
                                                            setIsEditingSampleDetails(false);
                                                            setToastMessage("Sample details updated successfully");
                                                            setShowToast(true);
                                                            await reloadWorksheet();
                                                        } catch {
                                                            setToastMessage("Failed to update sample details");
                                                            setShowToast(true);
                                                        } finally {
                                                            setIsSavingSampleDetails(false);
                                                        }
                                                    }}
                                                    className="flex items-center gap-1.5 text-xs px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition-colors shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
                                                >
                                                    {isSavingSampleDetails ? (
                                                        <LoaderCircle className="w-3.5 h-3.5" />
                                                    ) : (
                                                        <MdDone className="w-3.5 h-3.5" />
                                                    )}
                                                    Save
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                    <div className="grid grid-cols-2 text-sm">
                                        <div className="flex items-center px-4 py-3 border-r border-emerald-100">
                                            <span className="font-bold mr-2 text-emerald-800 whitespace-nowrap">
                                                Sample Quantity:
                                            </span>
                                            {isEditingSampleDetails ? (
                                                <input
                                                    type="number"
                                                    value={sampleQuantity ?? ""}
                                                    onChange={(e) =>
                                                        setSampleQuantity(e.target.value === "" ? null : Number(e.target.value))
                                                    }
                                                    className="flex-1 border border-emerald-300 rounded-lg px-2 py-1 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                                                    placeholder="Enter quantity"
                                                />
                                            ) : (
                                                <span className="font-semibold text-slate-700">
                                                    {sampleQuantity != null ? sampleQuantity : "---"}
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex items-center px-4 py-3">
                                            <span className="font-bold mr-2 text-emerald-800 whitespace-nowrap">
                                                Nature of Sample:
                                            </span>
                                            {isEditingSampleDetails ? (
                                                <input
                                                    type="text"
                                                    value={natureOfSample}
                                                    onChange={(e) => setNatureOfSample(e.target.value)}
                                                    className="flex-1 border border-emerald-300 rounded-lg px-2 py-1 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                                                    placeholder="Enter nature of sample"
                                                />
                                            ) : (
                                                <span className="font-semibold text-slate-700">
                                                    {natureOfSample || "---"}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 text-sm bg-white">
                                    <div className="flex items-center px-4 py-3 border-r border-emerald-100">
                                        <span className="font-bold mr-2 text-emerald-800">
                                            Sample Quantity:
                                        </span>
                                        <span className="font-semibold text-slate-700">
                                            {sampleQuantity != null ? sampleQuantity : "---"}
                                        </span>
                                    </div>
                                    <div className="flex items-center px-4 py-3">
                                        <span className="font-bold mr-2 text-emerald-800">
                                            Nature of Sample:
                                        </span>
                                        <span className="font-semibold text-slate-700">
                                            {natureOfSample || "---"}
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="p-0 my-8">
                            <div className="my-4 border border-emerald-900/30 mb-6 rounded-xl overflow-hidden shadow-md">
                                <table className="w-full border-collapse text-sm shadow-md rounded-xl overflow-hidden">
                                    <tbody>
                                        <tr className="border-b border-emerald-900/20 hover:bg-emerald-50 transition-colors">
                                            <td className="w-10 px-4 py-4 border-r border-emerald-900/20 font-bold text-center bg-gradient-to-br from-emerald-700 to-emerald-900 text-emerald-200">
                                                1
                                            </td>
                                            <td className="w-1/3 px-4 py-4 border-r border-emerald-100 font-bold bg-gradient-to-r from-emerald-50 to-white text-emerald-800">
                                                Sample Particulars (All relevant information received with
                                                sample to be entered):
                                            </td>
                                            <td className="px-3 py-3 font-medium">
                                                {worksheetInfo!.sample.sampleName || "---"}
                                            </td>
                                        </tr>
                                        <tr className="border-b border-emerald-900/20 hover:bg-emerald-50 transition-colors">
                                            <td className="w-10 px-4 py-4 border-r border-emerald-900/20 font-bold text-center bg-gradient-to-br from-emerald-700 to-emerald-900 text-emerald-200">
                                                2
                                            </td>
                                            <td className="w-1/3 px-4 py-4 border-r border-emerald-100 font-bold bg-gradient-to-r from-emerald-50 to-white text-emerald-800">
                                                Test(s) required (all tests and condition to be entered):
                                            </td>
                                            <td className="px-3 py-3 font-medium">
                                                {testsRequiredDisplay || "No parameters added"}
                                            </td>
                                        </tr>
                                        <tr className="hover:bg-emerald-50 transition-colors">
                                            <td className="w-10 px-4 py-4 border-r border-emerald-900/20 font-bold text-center bg-gradient-to-br from-emerald-700 to-emerald-900 text-emerald-200">
                                                3
                                            </td>
                                            <td className="w-1/3 px-4 py-4 border-r border-emerald-100 font-bold bg-gradient-to-r from-emerald-50 to-white text-emerald-800">
                                                Method(s) of Analysis / Testing
                                            </td>
                                            <td className="px-3 py-3 h-16 font-medium">
                                                {methodsRequiredDisplay || "No methods"}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            <div className="my-6 rounded-xl shadow-xl border border-emerald-900/30">
                                {/* Section header */}
                                <div className="relative rounded-xl px-5 py-4 bg-gradient-to-br from-emerald-700 via-emerald-800 to-slate-900">
                                    <div
                                        className="absolute inset-0 opacity-[0.04] pointer-events-none"
                                        style={{
                                            backgroundImage: "radial-gradient(rgba(255,255,255,.9) 1px, transparent 1px)",
                                            backgroundSize: "18px 18px",
                                        }}
                                    />
                                    <div className="absolute -top-6 -right-6 w-32 h-32 rounded-full bg-emerald-400/15 blur-3xl pointer-events-none" />
                                    <div className="relative flex items-center justify-between">
                                        <h3 className="text-xl font-bold text-white flex items-center gap-3">
                                            <div className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/20 shadow-inner">
                                                <IoFlask className="w-5 h-5 text-emerald-300" />
                                            </div>
                                            <span>Parameters Management</span>
                                        </h3>

                                        {role === "Reviewer" &&
                                            worksheetInfo?.sample.status !== "Approved" && (
                                                <div className="relative">
                                                    <button
                                                        onClick={() =>
                                                            setShowParameterDropdown(!showParameterDropdown)
                                                        }
                                                        disabled={availableToAdd.length === 0}
                                                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-emerald-600 text-white font-semibold rounded-lg hover:from-emerald-700 hover:to-emerald-800 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                                                    >
                                                        <Plus className="w-4 h-4" />
                                                        Add Parameter
                                                    </button>

                                                    <AnimatePresence>
                                                        {showParameterDropdown && (
                                                            <motion.div
                                                                initial={{ opacity: 0, y: -10 }}
                                                                animate={{ opacity: 1, y: 0 }}
                                                                exit={{ opacity: 0, y: -10 }}
                                                                className="absolute right-0 mt-2 w-72 bg-white border border-emerald-300 rounded-lg shadow-xl z-50 max-h-80 overflow-y-auto"
                                                            >
                                                                {availableToAdd.map((param) => (
                                                                    <button
                                                                        key={param.paraCode}
                                                                        onClick={() =>
                                                                            handleAddParameter({
                                                                                paraCode: param.paraCode,
                                                                                methodName: param.methodName,
                                                                                methodCode: param.methodCode,
                                                                                parameterName: param.parameter,
                                                                                id: 0,
                                                                                preparations: [],
                                                                                calculations: [],
                                                                                files: [],
                                                                                preparationCompletedBy: null,
                                                                                preparationCompletedAt: null,
                                                                                remarksByAnalyst: null,
                                                                                analyzedBy: null,
                                                                                approvedByReviewer: null,
                                                                                analyzedByName: null,
                                                                                approvedByReviewerName: null,
                                                                                analysisStartDate: null,
                                                                                analysisCompletionDate: null,
                                                                                approvedAtReviewer: null,
                                                                                approvedByQAName: null,
                                                                                approvedByQA: null,
                                                                                approvedAtQA: null,
                                                                                remarksByReviewer: null,
                                                                                remarksByQA: null,
                                                                                status: null,
                                                                                submittedQaByName: null,
                                                                                submittedQaBy: null,
                                                                                additional_info: null
                                                                            })
                                                                        }
                                                                        className="w-full text-left px-3 py-2 hover:bg-emerald-50 border-b border-emerald-200 last:border-b-0 transition-colors text-sm"
                                                                    >
                                                                        <div className="font-semibold text-gray-900">
                                                                            {param.parameter}
                                                                        </div>
                                                                        <div className="text-xs text-gray-600">
                                                                            {param.paraCode} • {param.methodName}
                                                                        </div>
                                                                    </button>
                                                                ))}
                                                                {availableToAdd.length === 0 && (
                                                                    <div className="px-3 py-4 text-center text-gray-500 text-sm">
                                                                        All parameters have been added
                                                                    </div>
                                                                )}
                                                            </motion.div>
                                                        )}
                                                    </AnimatePresence>
                                                </div>
                                            )}
                                    </div>

                                    <AnimatePresence>
                                        {addedParameters.length > 0 && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: "auto" }}
                                                exit={{ opacity: 0, height: 0 }}
                                                className="space-y-2"
                                            >
                                                {addedParameters.map((param) => {
                                                    const isLocked = isParameterLocked(param.id);
                                                    const status =
                                                        parameterStatusPerParam[param.id] || "created";

                                                    // Add these to your status constants (around line 350)
                                                    const STATUS_COLORS = {
                                                        created: {
                                                            bg: "bg-emerald-100",
                                                            border: "border-emerald-300",
                                                            text: "text-emerald-800",
                                                            label: "CREATED",
                                                        },
                                                        "analysis pending": {
                                                            bg: "bg-emerald-100",
                                                            border: "border-emerald-300",
                                                            text: "text-emerald-800",
                                                            label: "ANALYSIS PENDING",
                                                        },
                                                        "analysis started": {
                                                            bg: "bg-emerald-100",
                                                            border: "border-emerald-300",
                                                            text: "text-emerald-800",
                                                            label: "ANALYSIS STARTED",
                                                        },
                                                        "analysis completed": {
                                                            bg: "bg-emerald-100",
                                                            border: "border-emerald-300",
                                                            text: "text-emerald-800",
                                                            label: "ANALYSIS COMPLETED",
                                                        },
                                                        approved: {
                                                            bg: "bg-emerald-100",
                                                            border: "border-emerald-300",
                                                            text: "text-emerald-800",
                                                            label: "APPROVED",
                                                        },
                                                        "analysis revision": {
                                                            bg: "bg-emerald-100",
                                                            border: "border-emerald-300",
                                                            text: "text-emerald-800",
                                                            label: "REVISION REQUESTED",
                                                        },
                                                        disapproved: {
                                                            bg: "bg-red-100",
                                                            border: "border-red-300",
                                                            text: "text-red-700",
                                                            label: "DISAPPROVED",
                                                        },
                                                    };

                                                    const currentStatus =
                                                        STATUS_COLORS[
                                                        status.toLowerCase() as keyof typeof STATUS_COLORS
                                                        ] || STATUS_COLORS.created;

                                                    return (
                                                        <motion.div
                                                            key={param.id}
                                                            initial={{ opacity: 0, x: -20 }}
                                                            animate={{ opacity: 1, x: 0 }}
                                                            exit={{ opacity: 0, x: 20 }}
                                                            className={`relative flex items-center justify-between mt-5 p-4 rounded-xl shadow-inner transition-all duration-300 ${isLocked
                                                                ? "bg-gradient-to-r from-slate-100 via-slate-50 to-slate-100 border-2 border-slate-300"
                                                                : "bg-gradient-to-r from-emerald-50 via-emerald-50 to-emerald-50 border-2 border-emerald-200"
                                                                }`}
                                                        >
                                                            {/* Locked Overlay Effect */}
                                                            {isLocked && (
                                                                <div className="absolute inset-0 bg-gradient-to-br from-slate-200/30 to-slate-300/30 backdrop-blur-[1px] rounded-xl pointer-events-none">
                                                                    <div className="absolute top-2 right-2">
                                                                        <motion.div
                                                                            initial={{ scale: 0, rotate: -180 }}
                                                                            animate={{ scale: 1, rotate: 0 }}
                                                                            transition={{ type: "spring", duration: 0.6 }}
                                                                            className="w-8 h-8 bg-slate-600 rounded-full flex items-center justify-center shadow-lg"
                                                                        >
                                                                            <svg
                                                                                className="w-4 h-4 text-white"
                                                                                fill="currentColor"
                                                                                viewBox="0 0 20 20"
                                                                            >
                                                                                <path
                                                                                    fillRule="evenodd"
                                                                                    d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                                                                                    clipRule="evenodd"
                                                                                />
                                                                            </svg>
                                                                        </motion.div>
                                                                    </div>
                                                                </div>
                                                            )}

                                                            <div className="flex-1 relative z-10">
                                                                <div className="flex items-center gap-3 mb-2">
                                                                    <div
                                                                        className={`font-semibold text-sm ${isLocked ? "text-slate-700" : "text-emerald-800"
                                                                            }`}
                                                                    >
                                                                        {param.parameterName}
                                                                    </div>

                                                                    {/* Status Badge */}
                                                                    <motion.div
                                                                        initial={{ scale: 0 }}
                                                                        animate={{ scale: 1 }}
                                                                        className={`inline-flex items-center gap-1.5 px-3 py-1 ${currentStatus.bg} ${currentStatus.border} border-2 rounded-full shadow-sm`}
                                                                    >
                                                                        <span
                                                                            className={`text-xs font-bold ${currentStatus.text} uppercase tracking-wide`}
                                                                        >
                                                                            {currentStatus.label}
                                                                        </span>
                                                                    </motion.div>

                                                                    {/* Locked Badge */}
                                                                    {isLocked && (
                                                                        <motion.div
                                                                            initial={{ scale: 0, x: -10 }}
                                                                            animate={{ scale: 1, x: 0 }}
                                                                            className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-200 border-2 border-slate-400 rounded-full shadow-sm"
                                                                        >
                                                                            <svg
                                                                                className="w-3 h-3 text-slate-700"
                                                                                fill="currentColor"
                                                                                viewBox="0 0 20 20"
                                                                            >
                                                                                <path
                                                                                    fillRule="evenodd"
                                                                                    d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                                                                                    clipRule="evenodd"
                                                                                />
                                                                            </svg>
                                                                            <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                                                                                LOCKED
                                                                            </span>
                                                                        </motion.div>
                                                                    )}
                                                                </div>

                                                                <div
                                                                    className={`text-xs ${isLocked ? "text-slate-600" : "text-emerald-600"
                                                                        }`}
                                                                >
                                                                    {param.paraCode} • {param.methodName}
                                                                </div>

                                                                {analyzedByPerParam[param.id] && (
                                                                    <div
                                                                        className={`mt-1 text-xs font-medium ${isLocked ? "text-slate-700" : "text-emerald-800"
                                                                            }`}
                                                                    >
                                                                        Assigned to: {analyzedByNamePerParam[param.id]}
                                                                    </div>
                                                                )}

                                                                {/* Locked Message */}
                                                                {isLocked && (
                                                                    <motion.div
                                                                        initial={{ opacity: 0, y: -5 }}
                                                                        animate={{ opacity: 1, y: 0 }}
                                                                        className="mt-2 flex items-center gap-2 text-xs text-slate-600 bg-slate-200/50 px-3 py-1.5 rounded-lg"
                                                                    >
                                                                        <svg
                                                                            className="w-4 h-4"
                                                                            fill="none"
                                                                            viewBox="0 0 24 24"
                                                                            stroke="currentColor"
                                                                        >
                                                                            <path
                                                                                strokeLinecap="round"
                                                                                strokeLinejoin="round"
                                                                                strokeWidth={2}
                                                                                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                                                            />
                                                                        </svg>
                                                                        <span className="font-medium">
                                                                            This parameter is locked and cannot be modified
                                                                            during analysis
                                                                        </span>
                                                                    </motion.div>
                                                                )}
                                                            </div>

                                                            <div className="flex gap-2 relative z-10">
                                                                <button
                                                                    onClick={() => toggleParameterDetail(param.id)}
                                                                    className={`
                            group relative inline-flex items-center gap-2 px-3 py-1.5 
                            rounded-md border text-xs font-semibold tracking-tight transition-all duration-200
                            ${selectedParamsForDetail.includes(param.id)
                                                                            ? "bg-emerald-50 border-emerald-200 text-emerald-800 hover:bg-emerald-100 shadow-sm"
                                                                            : "bg-emerald-50 border-emerald-200 text-emerald-800 hover:bg-emerald-100 shadow-sm"
                                                                        }
                          `}
                                                                >
                                                                    {/* The "Dot" Indicator - Classic status signal */}
                                                                    <span
                                                                        className={`h-1.5 w-1.5 rounded-full ${selectedParamsForDetail.includes(param.id)
                                                                            ? "bg-emerald-500 animate-pulse"
                                                                            : "bg-emerald-500"
                                                                            }`}
                                                                    />

                                                                    <span>
                                                                        {selectedParamsForDetail.includes(param.id)
                                                                            ? "CLICK TO HIDE"
                                                                            : "CLICK TO VIEW"}
                                                                    </span>

                                                                    {/* Subtle chevron icon for a classic feel */}
                                                                    <svg
                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                        className={`h-3 w-3 transition-transform duration-200 ${selectedParamsForDetail.includes(param.id)
                                                                            ? "rotate-180"
                                                                            : ""
                                                                            }`}
                                                                        fill="none"
                                                                        viewBox="0 0 24 24"
                                                                        stroke="currentColor"
                                                                        strokeWidth={3}
                                                                    >
                                                                        <path
                                                                            strokeLinecap="round"
                                                                            strokeLinejoin="round"
                                                                            d="M19 9l-7 7-7-7"
                                                                        />
                                                                    </svg>
                                                                </button>

                                                                {role === "Reviewer" && !isLocked && (
                                                                    <motion.button
                                                                        onClick={() => {
                                                                            setShowDeleteDialog(true);
                                                                            setParameterToDelete(param);
                                                                        }}
                                                                        whileHover={{ scale: 1.1, rotate: 10 }}
                                                                        whileTap={{ scale: 0.9 }}
                                                                        className="mx-2"
                                                                    >
                                                                        <CgTrash className="w-5 h-5 text-red-500" />
                                                                    </motion.button>
                                                                )}
                                                            </div>
                                                        </motion.div>
                                                    );
                                                })}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    {addedParameters.length === 0 && (
                                        <motion.div
                                            key="empty-state-content"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="text-center py-12 text-gray-500 mt-4 bg-gradient-to-br from-emerald-100 via-emerald-50 to-emerald-100 rounded-2xl border-2 border-dashed border-gray-300 shadow-inner"
                                            layout
                                        >
                                            <div className="inline-block">
                                                <Target className="w-14 h-14 text-gray-300" />
                                            </div>
                                            <p className="text-base font-bold text-gray-800 mb-2">
                                                No parameters added yet
                                            </p>
                                            <p className="text-sm text-gray-600 max-w-md mx-auto">
                                                {role === "Reviewer"
                                                    ? 'Click the "Add Parameters" button above to add parameters'
                                                    : "Reviewer will add parameters for analysis"}
                                            </p>
                                        </motion.div>
                                    )}
                                </div>
                            </div>

                            <AnimatePresence>
                                {isSaving && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3"
                                    >
                                        <motion.div
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                            className="w-5 h-5 border-2 border-emerald-600 border-t-transparent rounded-full"
                                        />
                                        <span className="text-sm font-semibold text-emerald-800">
                                            Saving parameter assignment to database...
                                        </span>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {addedParameters
                                .filter((param) => selectedParamsForDetail.includes(param.id))
                                .map((selectedParam) => {
                                    const isLocked = isParameterLocked(selectedParam?.id);
                                    const isEditableForAnalyst = isParameterEditableForAnalyst(
                                        selectedParam?.id,
                                    );

                                    const shouldDisableContent =
                                        (role === "Reviewer" && isLocked) ||
                                        role === "QA" ||
                                        (role === "Analyst" && !isEditableForAnalyst);

                                    // isPreparationLocked: locks ONLY the preparation sections (instruments, chemicals,
                                    // standards, buffer, mobile phase, diluent, std/sample prep inputs).
                                    // Does NOT lock calculations, system suitability, or other attachments.
                                    const isPreparationLocked =
                                        !!preparationCompletedAtPerParam[selectedParam.id] ||
                                        shouldDisableContent;

                                    // isFullyLocked: locks EVERYTHING — preparation AND calculations/system
                                    // suitability/other attachments. Triggered when the parameter itself is locked.
                                    // For Analyst role: isLocked is true during "analysis started"/"analysis revision"
                                    // (because isParameterLocked checks those statuses), but analysts must still be
                                    // able to edit calculations, system suitability, and attach files in those states.
                                    // So we use shouldDisableContent which is already role-aware: it is false for
                                    // analysts when isEditableForAnalyst is true (i.e. started/revision statuses).

                                    // canManagePrep: controls prep Complete/Unlock buttons.
                                    // Step 1: is the user blocked from editing this param? (role-aware)
                                    // Step 2: block only at terminal statuses where nobody can manage prep.
                                    // This means Analysts with "analysis started"/"analysis revision" DO see the buttons.

                                    return (
                                        <AnimatePresence key={selectedParam.id}>
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: "auto" }}
                                                exit={{ opacity: 0, height: 0 }}
                                                className="my-6"
                                            >
                                                <motion.div
                                                    initial={{ opacity: 0, y: -10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    className="mb-8 relative overflow-hidden rounded-2xl bg-white border border-slate-200 shadow-lg"
                                                >
                                                    {/* Parameter detail header — dark gradient */}
                                                    <div className="relative overflow-hidden bg-gradient-to-r from-emerald-700 via-emerald-800 to-slate-900 px-6 py-4 border-b border-slate-800/30">
                                                        <div
                                                            className="absolute inset-0 opacity-[0.04] pointer-events-none"
                                                            style={{
                                                                backgroundImage: "radial-gradient(rgba(255,255,255,.8) 1px, transparent 1px)",
                                                                backgroundSize: "18px 18px",
                                                            }}
                                                        />
                                                        <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-emerald-400/10 blur-2xl pointer-events-none" />
                                                        <div className="relative z-10 flex items-center justify-between">
                                                            <div className="flex items-center gap-4">
                                                                <div className="relative">
                                                                    <div className="w-10 h-10 bg-white/15 border border-white/20 rounded-xl flex items-center justify-center">
                                                                        <svg
                                                                            className="w-5 h-5 text-emerald-300"
                                                                            fill="none"
                                                                            viewBox="0 0 24 24"
                                                                            stroke="currentColor"
                                                                        >
                                                                            <path
                                                                                strokeLinecap="round"
                                                                                strokeLinejoin="round"
                                                                                strokeWidth={2}
                                                                                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                                                                            />
                                                                        </svg>
                                                                    </div>
                                                                </div>
                                                                <div>
                                                                    <h3 className="text-base font-bold text-white tracking-tight">
                                                                        Parameter Overview
                                                                    </h3>
                                                                    <p className="text-emerald-300/80 text-xs font-medium mt-0.5">
                                                                        Complete analysis information
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            <motion.button
                                                                onClick={() =>
                                                                    toggleParameterDetail(selectedParam.id)
                                                                }
                                                                whileHover={{ scale: 1.05 }}
                                                                whileTap={{ scale: 0.95 }}
                                                                className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/15 border border-white/20 hover:bg-white/25 transition-all duration-200"
                                                            >
                                                                <span className="text-white/80 text-lg font-bold">
                                                                    ✕
                                                                </span>
                                                            </motion.button>
                                                        </div>
                                                    </div>

                                                    {/* Content Section */}
                                                    <div className="p-6 bg-slate-50/50 space-y-6">
                                                        {/* Parameter Details Grid */}
                                                        <div className="grid grid-cols-2 gap-4">
                                                            <motion.div
                                                                initial={{ opacity: 0, x: -20 }}
                                                                animate={{ opacity: 1, x: 0 }}
                                                                transition={{ delay: 0.1 }}
                                                                className="relative group"
                                                            >
                                                                <div className="relative bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-300 hover:border-emerald-300">
                                                                    <div className="flex items-center gap-2 mb-2">
                                                                        <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                                                                        <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                                                                            Parameter Code
                                                                        </span>
                                                                    </div>
                                                                    <p className="text-lg font-bold text-slate-900">
                                                                        {selectedParam.paraCode}
                                                                    </p>
                                                                </div>
                                                            </motion.div>

                                                            <motion.div
                                                                initial={{ opacity: 0, x: 20 }}
                                                                animate={{ opacity: 1, x: 0 }}
                                                                transition={{ delay: 0.2 }}
                                                                className="relative group"
                                                            >
                                                                <div className="relative bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-300 hover:border-emerald-300">
                                                                    <div className="flex items-center gap-2 mb-2">
                                                                        <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                                                                        <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                                                                            Parameter Name
                                                                        </span>
                                                                    </div>
                                                                    <p className="text-lg font-bold text-slate-900">
                                                                        {selectedParam.parameterName}
                                                                    </p>
                                                                </div>
                                                            </motion.div>
                                                        </div>

                                                        {role !== "Analyst" && (
                                                            <>
                                                                {analyzedByPerParam[selectedParam.id] && (
                                                                    <motion.div
                                                                        initial={{ opacity: 0, y: 20 }}
                                                                        animate={{ opacity: 1, y: 0 }}
                                                                        transition={{ delay: 0.3 }}
                                                                        className="relative group"
                                                                    >
                                                                        <div className="relative bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-300 hover:border-emerald-300">
                                                                            <div className="flex items-center justify-between mb-4">
                                                                                <div className="flex items-center gap-2">
                                                                                    <div className="w-1 h-5 bg-emerald-500 rounded-full" />
                                                                                    <h4 className="text-sm font-semibold text-slate-800 uppercase tracking-wider">
                                                                                        Assigned Analyst
                                                                                    </h4>
                                                                                </div>
                                                                            </div>

                                                                            <div className="flex items-center gap-4">
                                                                                {/* Avatar */}
                                                                                <div className="relative">
                                                                                    <div className="relative w-14 h-14 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center ring-2 ring-emerald-200">
                                                                                        <span className="text-white text-lg font-bold">
                                                                                            {analyzedByNamePerParam[
                                                                                                selectedParam.id
                                                                                            ].charAt(0) || "A"}
                                                                                        </span>
                                                                                    </div>
                                                                                </div>

                                                                                <div className="flex-1">
                                                                                    <div className="font-semibold text-base text-slate-900 mb-1">
                                                                                        {analyzedByNamePerParam[
                                                                                            selectedParam.id
                                                                                        ] || "Unknown"}
                                                                                    </div>
                                                                                    <div className="flex items-center gap-2 flex-wrap">
                                                                                        <span className="inline-flex items-center px-3 py-1 bg-emerald-50 border border-emerald-200 rounded-lg text-xs font-semibold text-emerald-800">
                                                                                            <svg
                                                                                                className="w-3 h-3 mr-1.5"
                                                                                                fill="none"
                                                                                                viewBox="0 0 24 24"
                                                                                                stroke="currentColor"
                                                                                            >
                                                                                                <path
                                                                                                    strokeLinecap="round"
                                                                                                    strokeLinejoin="round"
                                                                                                    strokeWidth={2}
                                                                                                    d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"
                                                                                                />
                                                                                            </svg>
                                                                                            {analyzedByPerParam[
                                                                                                selectedParam.id
                                                                                            ]}
                                                                                        </span>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </motion.div>
                                                                )}
                                                            </>
                                                        )}

                                                        {role === "QA" && (
                                                            <>
                                                                {analyzedByPerParam[selectedParam.id] && (
                                                                    <motion.div
                                                                        initial={{ opacity: 0, y: 20 }}
                                                                        animate={{ opacity: 1, y: 0 }}
                                                                        transition={{ delay: 0.3 }}
                                                                        className="relative group"
                                                                    >
                                                                        <div className="relative bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-300 hover:border-emerald-300">
                                                                            <div className="flex items-center justify-between mb-4">
                                                                                <div className="flex items-center gap-2">
                                                                                    <div className="w-1 h-5 bg-emerald-500 rounded-full" />
                                                                                    <h4 className="text-sm font-semibold text-slate-800 uppercase tracking-wider">
                                                                                        Assigned Reviewer
                                                                                    </h4>
                                                                                </div>
                                                                                {!isLocked && (
                                                                                    <motion.button
                                                                                        onClick={() =>
                                                                                            handleReassignAnalyst(
                                                                                                selectedParam.id,
                                                                                            )
                                                                                        }
                                                                                        whileHover={{ scale: 1.02 }}
                                                                                        whileTap={{ scale: 0.98 }}
                                                                                        className="px-3 py-1.5 bg-white/60 backdrop-blur-sm border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-lg hover:bg-white hover:border-emerald-300 transition-all duration-200 flex items-center gap-1.5"
                                                                                    >
                                                                                        <svg
                                                                                            className="w-3.5 h-3.5"
                                                                                            fill="none"
                                                                                            viewBox="0 0 24 24"
                                                                                            stroke="currentColor"
                                                                                        >
                                                                                            <path
                                                                                                strokeLinecap="round"
                                                                                                strokeLinejoin="round"
                                                                                                strokeWidth={2}
                                                                                                d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                                                                                            />
                                                                                        </svg>
                                                                                        Reassign
                                                                                    </motion.button>
                                                                                )}
                                                                            </div>

                                                                            <div className="flex items-center gap-4">
                                                                                {/* Avatar */}
                                                                                <div className="relative">
                                                                                    <div className="relative w-14 h-14 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center ring-2 ring-emerald-200">
                                                                                        <span className="text-white text-lg font-bold">
                                                                                            {approvedByReviewerNamePerParam[
                                                                                                selectedParam.id
                                                                                            ].charAt(0) || "A"}
                                                                                        </span>
                                                                                    </div>
                                                                                </div>

                                                                                {/* Analyst Info */}
                                                                                <div className="flex-1">
                                                                                    <div className="font-semibold text-base text-slate-900 mb-1">
                                                                                        {approvedByReviewerNamePerParam[
                                                                                            selectedParam.id
                                                                                        ] || "Unknown"}
                                                                                    </div>
                                                                                    <div className="flex items-center gap-2 flex-wrap">
                                                                                        <span className="inline-flex items-center px-3 py-1 bg-emerald-50 border border-emerald-200 rounded-lg text-xs font-semibold text-emerald-800">
                                                                                            <svg
                                                                                                className="w-3 h-3 mr-1.5"
                                                                                                fill="none"
                                                                                                viewBox="0 0 24 24"
                                                                                                stroke="currentColor"
                                                                                            >
                                                                                                <path
                                                                                                    strokeLinecap="round"
                                                                                                    strokeLinejoin="round"
                                                                                                    strokeWidth={2}
                                                                                                    d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"
                                                                                                />
                                                                                            </svg>
                                                                                            {approvedByReviewerPerParam[selectedParam.id]}
                                                                                        </span>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </motion.div>
                                                                )}
                                                            </>
                                                        )}

                                                        {/* Analysis Timeline Section */}
                                                        {(analysisStartDatePerParam[selectedParam.id] ||
                                                            analysisCompletionDatePerParam[selectedParam.id] ||
                                                            approvedByReviewerPerParam[selectedParam.id]) && (
                                                                <motion.div
                                                                    initial={{ opacity: 0, y: 20 }}
                                                                    animate={{ opacity: 1, y: 0 }}
                                                                    transition={{ delay: 0.4 }}
                                                                    className="relative group"
                                                                >
                                                                    <div className="relative bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-300 hover:border-emerald-300">
                                                                        <div className="flex items-center gap-2 mb-4">
                                                                            <div className="w-1 h-5 bg-emerald-500 rounded-full" />
                                                                            <h4 className="text-sm font-semibold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                                                                                <svg
                                                                                    className="w-4 h-4"
                                                                                    fill="none"
                                                                                    viewBox="0 0 24 24"
                                                                                    stroke="currentColor"
                                                                                >
                                                                                    <path
                                                                                        strokeLinecap="round"
                                                                                        strokeLinejoin="round"
                                                                                        strokeWidth={2}
                                                                                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                                                                    />
                                                                                </svg>
                                                                                Analysis Timeline
                                                                            </h4>
                                                                        </div>

                                                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                                            {analysisStartDatePerParam[
                                                                                selectedParam.id
                                                                            ] && (
                                                                                    <div className="bg-emerald-50 rounded-lg p-4 border border-slate-200 hover:border-emerald-300 transition-all">
                                                                                        <div className="flex items-center gap-2 mb-2">
                                                                                            <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                                                                                                <svg
                                                                                                    className="w-4 h-4 text-emerald-600"
                                                                                                    fill="none"
                                                                                                    viewBox="0 0 24 24"
                                                                                                    stroke="currentColor"
                                                                                                >
                                                                                                    <path
                                                                                                        strokeLinecap="round"
                                                                                                        strokeLinejoin="round"
                                                                                                        strokeWidth={2}
                                                                                                        d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                                                                                                    />
                                                                                                    <path
                                                                                                        strokeLinecap="round"
                                                                                                        strokeLinejoin="round"
                                                                                                        strokeWidth={2}
                                                                                                        d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                                                                                    />
                                                                                                </svg>
                                                                                            </div>
                                                                                            <span className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
                                                                                                Started
                                                                                            </span>
                                                                                        </div>
                                                                                        <p className="text-sm font-semibold text-slate-900">
                                                                                            {
                                                                                                formatDate(analysisStartDatePerParam[
                                                                                                    selectedParam.id
                                                                                                ])
                                                                                            }
                                                                                        </p>
                                                                                    </div>
                                                                                )}

                                                                            {analysisCompletionDatePerParam[
                                                                                selectedParam.id
                                                                            ] && (
                                                                                    <div className="bg-emerald-50 rounded-lg p-4 border border-slate-200 hover:border-emerald-300 transition-all">
                                                                                        <div className="flex items-center gap-2 mb-2">
                                                                                            <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                                                                                                <svg
                                                                                                    className="w-4 h-4 text-emerald-600"
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
                                                                                            </div>
                                                                                            <span className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
                                                                                                Completed
                                                                                            </span>
                                                                                        </div>
                                                                                        <p className="text-sm font-semibold text-slate-900">
                                                                                            {
                                                                                                formatDate(analysisCompletionDatePerParam[
                                                                                                    selectedParam.id
                                                                                                ])
                                                                                            }
                                                                                        </p>
                                                                                    </div>
                                                                                )}

                                                                            {approvedAtReviewerPerParam[
                                                                                selectedParam.id
                                                                            ] && (
                                                                                    <div className="bg-emerald-50 rounded-lg p-4 border border-slate-200 hover:border-emerald-300 transition-all">
                                                                                        <div className="flex items-center gap-2 mb-2">
                                                                                            <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                                                                                                <svg
                                                                                                    className="w-4 h-4 text-emerald-600"
                                                                                                    fill="none"
                                                                                                    viewBox="0 0 24 24"
                                                                                                    stroke="currentColor"
                                                                                                >
                                                                                                    <path
                                                                                                        strokeLinecap="round"
                                                                                                        strokeLinejoin="round"
                                                                                                        strokeWidth={2}
                                                                                                        d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                                                                                                    />
                                                                                                </svg>
                                                                                            </div>
                                                                                            <span className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
                                                                                                Reviewed
                                                                                            </span>
                                                                                        </div>
                                                                                        <p className="text-sm font-semibold text-slate-900">
                                                                                            {
                                                                                                formatDate(approvedAtReviewerPerParam[
                                                                                                    selectedParam.id
                                                                                                ])
                                                                                            }
                                                                                        </p>
                                                                                    </div>
                                                                                )}
                                                                        </div>
                                                                    </div>
                                                                </motion.div>
                                                            )}
                                                    </div>
                                                </motion.div>

                                                {isLocked && (
                                                    <LockedParameterOverlay parameterId={selectedParam.id} />
                                                )}

                                                <div
                                                    className={
                                                        isPreparationLocked
                                                            ? "opacity-70"
                                                            : ""
                                                    }
                                                >
                                                    {/* Instruments Details */}
                                                    <div className="mb-4">
                                                        <div className="flex items-center justify-between mb-2">
                                                            <h3 className="text-lg font-bold text-emerald-800 flex items-center gap-2.5 tracking-tight mb-3">
                                                                <span className="w-1.5 h-6 bg-gradient-to-b from-emerald-500 to-emerald-600 rounded-full"></span>
                                                                Instruments Details:
                                                            </h3>

                                                            <div className="relative" ref={instrumentRef}>
                                                                <button
                                                                    onClick={() =>
                                                                        setShowInstrumentDropdown(
                                                                            !showInstrumentDropdown,
                                                                        )
                                                                    }
                                                                    disabled={
                                                                        isPreparationLocked ||
                                                                        isReferenceDataLoading ||
                                                                        !!referenceDataError ||
                                                                        instruments.length === 0
                                                                    }
                                                                    className="flex items-center gap-2 p-1.5 bg-gradient-to-r from-emerald-600 to-emerald-600 text-white font-semibold rounded-2xl hover:from-emerald-700 hover:to-emerald-800 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-xs"
                                                                >
                                                                    <Plus className="w-4 h-4" />
                                                                </button>

                                                                <AnimatePresence>
                                                                    {showInstrumentDropdown && (
                                                                        <motion.div
                                                                            initial={{ opacity: 0, y: -10 }}
                                                                            animate={{ opacity: 1, y: 0 }}
                                                                            exit={{ opacity: 0, y: -10 }}
                                                                            onMouseDown={(e) => e.stopPropagation()}
                                                                            className="absolute right-0 mt-2 w-80 bg-white border border-emerald-300 rounded-lg shadow-xl z-50"
                                                                        >
                                                                            <div className="p-2 border-b border-emerald-200">
                                                                                <div className="relative">
                                                                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                                                                    <input
                                                                                        type="text"
                                                                                        placeholder="Search instruments..."
                                                                                        value={instrumentSearch}
                                                                                        onChange={(e) =>
                                                                                            setInstrumentSearch(e.target.value)
                                                                                        }
                                                                                        className="w-full pl-10 pr-3 py-2 border border-emerald-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                                                                    />
                                                                                </div>
                                                                            </div>
                                                                            <div className="max-h-64 overflow-y-auto">
                                                                                {searchFilteredInstruments
                                                                                    .filter(
                                                                                        (inst) =>
                                                                                            !addedInstruments[
                                                                                                selectedParam.id
                                                                                            ]?.find(
                                                                                                (added) => added.instrumentId === inst.id,
                                                                                            ),
                                                                                    )
                                                                                    .map((inst) => (
                                                                                        <button
                                                                                            key={inst.id}
                                                                                            onClick={() =>
                                                                                                handleAddInstrument(
                                                                                                    {
                                                                                                        id: null,
                                                                                                        parameterId: selectedParam.id,
                                                                                                        instrumentId: inst.id,
                                                                                                        name: inst.name,
                                                                                                        instrumentTag: inst.instrumentTag ?? null,
                                                                                                        make: inst.make ?? null,
                                                                                                        calibrationDoneDate: inst.calibrationDoneDate ?? null,
                                                                                                        calibrationDueDate: inst.calibrationDueDate ?? null,
                                                                                                    },
                                                                                                )
                                                                                            }
                                                                                            className="w-full text-left px-3 py-2 hover:bg-emerald-50 border-b border-emerald-200 last:border-b-0 transition-colors text-sm"
                                                                                        >
                                                                                            <div className="font-semibold text-gray-900">
                                                                                                {inst.name}
                                                                                            </div>
                                                                                            <div className="text-xs text-gray-600">
                                                                                                {inst.instrumentTag!}
                                                                                            </div>
                                                                                        </button>
                                                                                    ))}
                                                                                {searchFilteredInstruments.filter(
                                                                                    (inst) =>
                                                                                        !addedInstruments[
                                                                                            selectedParam.id
                                                                                        ]?.find(
                                                                                            (added) => added.instrumentId === inst.id,
                                                                                        ),
                                                                                ).length === 0 && (
                                                                                        <div className="px-3 py-4 text-center text-gray-500 text-sm">
                                                                                            {instrumentSearch
                                                                                                ? "No matching instruments"
                                                                                                : "All available instruments added"}
                                                                                        </div>
                                                                                    )}
                                                                            </div>
                                                                        </motion.div>
                                                                    )}
                                                                </AnimatePresence>
                                                            </div>
                                                        </div>

                                                        {isReferenceDataLoading && <ReferenceLoading />}
                                                        {referenceDataError && (
                                                            <ReferenceError error={referenceDataError} />
                                                        )}

                                                        {!isReferenceDataLoading && !referenceDataError && (
                                                            <table className="w-full border-collapse text-sm shadow-md">
                                                                <thead>
                                                                    <tr className="bg-emerald-100 border-2 border-emerald-500">
                                                                        <th className="px-3 py-2 border-r-2 border-emerald-500 text-left font-bold">
                                                                            Instrument Tag
                                                                        </th>
                                                                        <th className="px-3 py-2 border-r-2 border-emerald-500 text-left font-bold">
                                                                            Instrument Name
                                                                        </th>
                                                                        <th className="px-3 py-2 border-r-2 border-emerald-500 text-left font-bold">
                                                                            Calibration Done On
                                                                        </th>
                                                                        <th className="px-3 py-2 border-r-2 border-emerald-500 text-left font-bold">
                                                                            Calibration Due On
                                                                        </th>
                                                                        <th className="px-3 py-2 text-center font-bold w-20">
                                                                            Action
                                                                        </th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    <AnimatePresence>
                                                                        {addedInstruments[selectedParam.id]?.length >
                                                                            0 ? (
                                                                            addedInstruments[selectedParam.id].map(
                                                                                (instrument) => (
                                                                                    <motion.tr
                                                                                        key={instrument.id}
                                                                                        initial={{ opacity: 0, x: -20 }}
                                                                                        animate={{ opacity: 1, x: 0 }}
                                                                                        exit={{ opacity: 0, x: 20 }}
                                                                                        className="border-2 border-emerald-500 hover:bg-emerald-50 transition-colors"
                                                                                    >
                                                                                        <td className="px-3 py-2 border-r-2 border-emerald-500">
                                                                                            {instrument.instrumentTag! || "---"}
                                                                                        </td>
                                                                                        <td className="px-3 py-2 border-r-2 border-emerald-500">
                                                                                            {instrument.name || "---"}
                                                                                        </td>
                                                                                        <td className="px-3 py-2 border-r-2 border-emerald-500">
                                                                                            {instrument.calibrationDoneDate
                                                                                                ? new Date(
                                                                                                    instrument.calibrationDoneDate,
                                                                                                ).toLocaleDateString("en-GB")
                                                                                                : "---"}
                                                                                        </td>
                                                                                        <td className="px-3 py-2 border-r-2 border-emerald-500">
                                                                                            {instrument.calibrationDueDate
                                                                                                ? new Date(
                                                                                                    instrument.calibrationDueDate,
                                                                                                ).toLocaleDateString("en-GB")
                                                                                                : "---"}
                                                                                        </td>
                                                                                        <td className="px-3 py-2 text-center">
                                                                                            {!isPreparationLocked && (
                                                                                                <motion.button
                                                                                                    onClick={() =>
                                                                                                        handleRemoveInstrument(
                                                                                                            selectedParam.id,
                                                                                                            instrument.instrumentId!,
                                                                                                        )
                                                                                                    }
                                                                                                    whileHover={{
                                                                                                        scale: 1.1,
                                                                                                        rotate: 10,
                                                                                                    }}
                                                                                                    whileTap={{ scale: 0.9 }}
                                                                                                    className="mx-2"
                                                                                                >
                                                                                                    <CgTrash className="w-5 h-5 text-red-500" />
                                                                                                </motion.button>
                                                                                            )}
                                                                                        </td>
                                                                                    </motion.tr>
                                                                                ),
                                                                            )
                                                                        ) : (
                                                                            <tr className="border-2 border-emerald-500">
                                                                                <td
                                                                                    colSpan={role === "Reviewer" ? 5 : 4}
                                                                                    className="px-3 py-4 text-center text-gray-500"
                                                                                >
                                                                                    <div className="flex flex-col items-center gap-2">
                                                                                        <Target className="w-8 h-8 opacity-30" />
                                                                                        <span>
                                                                                            {role === "Reviewer"
                                                                                                ? 'No instruments added. Click "Add Instrument" to add.'
                                                                                                : "No instruments added yet."}
                                                                                        </span>
                                                                                    </div>
                                                                                </td>
                                                                            </tr>
                                                                        )}
                                                                    </AnimatePresence>
                                                                </tbody>
                                                            </table>
                                                        )}
                                                    </div>

                                                    {/* Chemicals Used - Dynamic with Add/Remove */}
                                                    <div className="mb-4">
                                                        <div className="flex items-center justify-between mb-2">
                                                            <h3 className="text-lg font-bold text-emerald-800 flex items-center gap-2.5 tracking-tight mb-3">
                                                                <span className="w-1.5 h-6 bg-gradient-to-b from-emerald-500 to-emerald-600 rounded-full"></span>
                                                                Reagents and Chemicals Details:
                                                            </h3>

                                                            <div className="relative" ref={chemicalRef}>
                                                                <button
                                                                    onClick={() =>
                                                                        setShowChemicalDropdown(!showChemicalDropdown)
                                                                    }
                                                                    disabled={
                                                                        isPreparationLocked ||
                                                                        isReferenceDataLoading ||
                                                                        !!referenceDataError ||
                                                                        chemicals.length === 0
                                                                    }
                                                                    className="flex items-center gap-2 p-1.5 bg-gradient-to-r from-emerald-600 to-emerald-600 text-white font-semibold rounded-2xl hover:from-emerald-700 hover:to-emerald-800 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-xs"
                                                                >
                                                                    <Plus className="w-4 h-4" />
                                                                </button>

                                                                <AnimatePresence>
                                                                    {showChemicalDropdown && (
                                                                        <motion.div
                                                                            initial={{ opacity: 0, y: -10 }}
                                                                            animate={{ opacity: 1, y: 0 }}
                                                                            exit={{ opacity: 0, y: -10 }}
                                                                            onMouseDown={(e) => e.stopPropagation()}
                                                                            className="absolute right-0 mt-2 w-80 bg-white border border-emerald-300 rounded-lg shadow-xl z-50"
                                                                        >
                                                                            <div className="p-2 border-b border-emerald-200">
                                                                                <div className="relative">
                                                                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                                                                    <input
                                                                                        type="text"
                                                                                        placeholder="Search chemicals..."
                                                                                        value={chemicalSearch}
                                                                                        onChange={(e) =>
                                                                                            setChemicalSearch(e.target.value)
                                                                                        }
                                                                                        className="w-full pl-10 pr-3 py-2 border border-emerald-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                                                                    />
                                                                                </div>
                                                                            </div>
                                                                            <div className="max-h-64 overflow-y-auto">
                                                                                {searchFilteredChemicals
                                                                                    .filter(
                                                                                        (chem) =>
                                                                                            !addedChemicals[
                                                                                                selectedParam.id
                                                                                            ]?.find(
                                                                                                (added) => added.slno === chem.slno,
                                                                                            ),
                                                                                    )
                                                                                    .map((chem) => (
                                                                                        <button
                                                                                            key={chem.slno}
                                                                                            onClick={() =>
                                                                                                handleAddChemical(
                                                                                                    {
                                                                                                        id: null,
                                                                                                        parameterId: selectedParam.id,
                                                                                                        slno: chem.slno,
                                                                                                        name: chem.name,
                                                                                                        code: chem.code ?? null,
                                                                                                        make: chem.make ?? null,
                                                                                                        batchNo: chem.batchNo ?? null,
                                                                                                        expDate: chem.exp_Date ?? null,
                                                                                                    },
                                                                                                )
                                                                                            }
                                                                                            className="w-full text-left px-3 py-2 hover:bg-emerald-50 border-b border-emerald-200 last:border-b-0 transition-colors text-sm"
                                                                                        >
                                                                                            <div className="font-semibold text-gray-900">
                                                                                                {chem.name}
                                                                                            </div>
                                                                                            <div className="text-xs text-gray-600">
                                                                                                {chem.make} • Batch: {chem.batchNo}
                                                                                            </div>
                                                                                        </button>
                                                                                    ))}
                                                                                {searchFilteredChemicals.filter(
                                                                                    (chem) =>
                                                                                        !addedChemicals[selectedParam.id]?.find(
                                                                                            (added) => added.slno === chem.slno,
                                                                                        ),
                                                                                ).length === 0 && (
                                                                                        <div className="px-3 py-4 text-center text-gray-500 text-sm">
                                                                                            {chemicalSearch
                                                                                                ? "No matching chemicals"
                                                                                                : "All available chemicals added"}
                                                                                        </div>
                                                                                    )}
                                                                            </div>
                                                                        </motion.div>
                                                                    )}
                                                                </AnimatePresence>
                                                            </div>
                                                        </div>

                                                        {isReferenceDataLoading && <ReferenceLoading />}

                                                        {referenceDataError && (
                                                            <ReferenceError error={referenceDataError} />
                                                        )}

                                                        {!isReferenceDataLoading && !referenceDataError && (
                                                            <table className="w-full border-collapse text-sm shadow-md">
                                                                <thead>
                                                                    <tr className="bg-emerald-100 border-2 border-emerald-500">
                                                                        <th className="px-3 py-2 border-r-2 border-emerald-500 text-left font-bold">
                                                                            Name of Solvents
                                                                        </th>
                                                                        <th className="px-3 py-2 border-r-2 border-emerald-500 text-left font-bold">
                                                                            Code
                                                                        </th>
                                                                        <th className="px-3 py-2 border-r-2 border-emerald-500 text-left font-bold">
                                                                            Make
                                                                        </th>
                                                                        <th className="px-3 py-2 border-r-2 border-emerald-500 text-left font-bold">
                                                                            Lot No./Batch No.
                                                                        </th>
                                                                        <th className="px-3 py-2 border-r-2 border-emerald-500 text-left font-bold">
                                                                            Validity
                                                                        </th>
                                                                        <th className="px-3 py-2 text-center font-bold w-20">
                                                                            Action
                                                                        </th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    <AnimatePresence>
                                                                        {addedChemicals[selectedParam.id]?.length >
                                                                            0 ? (
                                                                            addedChemicals[selectedParam.id].map(
                                                                                (chemical) => (
                                                                                    <motion.tr
                                                                                        key={chemical.slno}
                                                                                        initial={{ opacity: 0, x: -20 }}
                                                                                        animate={{ opacity: 1, x: 0 }}
                                                                                        exit={{ opacity: 0, x: 20 }}
                                                                                        className="border-2 border-emerald-500 hover:bg-emerald-50 transition-colors"
                                                                                    >
                                                                                        <td className="px-3 py-2 border-r-2 border-emerald-500">
                                                                                            {chemical.name || "---"}
                                                                                        </td>
                                                                                        <td className="px-3 py-2 border-r-2 border-emerald-500">
                                                                                            {chemical.code || "---"}
                                                                                        </td>
                                                                                        <td className="px-3 py-2 border-r-2 border-emerald-500">
                                                                                            {chemical.make || "---"}
                                                                                        </td>
                                                                                        <td className="px-3 py-2 border-r-2 border-emerald-500">
                                                                                            {chemical.batchNo || "---"}
                                                                                        </td>
                                                                                        <td className="px-3 py-2 border-r-2 border-emerald-500">
                                                                                            {chemical.expDate
                                                                                                ? new Date(
                                                                                                    chemical.expDate,
                                                                                                ).toLocaleDateString("en-GB")
                                                                                                : "---"}
                                                                                        </td>
                                                                                        <td className="px-3 py-2 text-center">
                                                                                            {!isPreparationLocked && (
                                                                                                <motion.button
                                                                                                    onClick={() =>
                                                                                                        handleRemoveChemical(
                                                                                                            selectedParam.id,
                                                                                                            chemical.slno,
                                                                                                        )
                                                                                                    }
                                                                                                    whileHover={{
                                                                                                        scale: 1.1,
                                                                                                        rotate: 10,
                                                                                                    }}
                                                                                                    whileTap={{ scale: 0.9 }}
                                                                                                    className="mx-2"
                                                                                                >
                                                                                                    <CgTrash className="w-5 h-5 text-red-500" />
                                                                                                </motion.button>
                                                                                            )}
                                                                                        </td>
                                                                                    </motion.tr>
                                                                                ),
                                                                            )
                                                                        ) : (
                                                                            <tr className="border-2 border-emerald-500">
                                                                                <td
                                                                                    colSpan={role === "Reviewer" ? 5 : 4}
                                                                                    className="px-3 py-4 text-center text-gray-500"
                                                                                >
                                                                                    <div className="flex flex-col items-center gap-2">
                                                                                        <Target className="w-8 h-8 opacity-30" />
                                                                                        <span>
                                                                                            {role === "Reviewer"
                                                                                                ? 'No chemicals added. Click "Add Chemical" to add.'
                                                                                                : "No chemicals added yet."}
                                                                                        </span>
                                                                                    </div>
                                                                                </td>
                                                                            </tr>
                                                                        )}
                                                                    </AnimatePresence>
                                                                </tbody>
                                                            </table>
                                                        )}

                                                    </div>


                                                    {/* Media Details - Dynamic with Add/Remove */}
                                                    <div className="mb-4">
                                                        <div className="flex items-center justify-between mb-2">
                                                            <h3 className="text-lg font-bold text-emerald-800 flex items-center gap-2.5 tracking-tight mb-3">
                                                                <span className="w-1.5 h-6 bg-gradient-to-b from-emerald-500 to-emerald-600 rounded-full"></span>
                                                                Media Details:
                                                            </h3>

                                                            <div className="relative" ref={mediaRef}>
                                                                <button
                                                                    onClick={() =>
                                                                        setShowMediaDropdown(!showMediaDropdown)
                                                                    }
                                                                    disabled={
                                                                        isPreparationLocked ||
                                                                        isReferenceDataLoading ||
                                                                        !!referenceDataError ||
                                                                        media.length === 0
                                                                    }
                                                                    className="flex items-center gap-2 p-1.5 bg-gradient-to-r from-emerald-600 to-emerald-600 text-white font-semibold rounded-2xl hover:from-emerald-700 hover:to-emerald-800 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-xs"
                                                                >
                                                                    <Plus className="w-4 h-4" />
                                                                </button>

                                                                <AnimatePresence>
                                                                    {showMediaDropdown && (
                                                                        <motion.div
                                                                            initial={{ opacity: 0, y: -10 }}
                                                                            animate={{ opacity: 1, y: 0 }}
                                                                            exit={{ opacity: 0, y: -10 }}
                                                                            onMouseDown={(e) => e.stopPropagation()}
                                                                            className="absolute right-0 mt-2 w-80 bg-white border border-emerald-300 rounded-lg shadow-xl z-50"
                                                                        >
                                                                            <div className="p-2 border-b border-emerald-200">
                                                                                <div className="relative">
                                                                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                                                                    <input
                                                                                        type="text"
                                                                                        placeholder="Search media..."
                                                                                        value={mediaSearch}
                                                                                        onChange={(e) =>
                                                                                            setMediaSearch(e.target.value)
                                                                                        }
                                                                                        className="w-full pl-10 pr-3 py-2 border border-emerald-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                                                                    />
                                                                                </div>
                                                                            </div>
                                                                            <div className="max-h-64 overflow-y-auto">
                                                                                {searchFilteredMedia
                                                                                    .filter(
                                                                                        (m) =>
                                                                                            !addedMedia[
                                                                                                selectedParam.id
                                                                                            ]?.find(
                                                                                                (added) => added.mediaId === m.id,
                                                                                            ),
                                                                                    )
                                                                                    .map((m) => (
                                                                                        <button
                                                                                            key={m.id}
                                                                                            onClick={() =>
                                                                                                handleAddMedia(
                                                                                                    {
                                                                                                        id: null,
                                                                                                        parameterId: selectedParam.id,
                                                                                                        mediaId: m.id ?? null,
                                                                                                        name: m.name ?? null,
                                                                                                        code: m.code ?? null,
                                                                                                        expDate: m.expDate ?? null,
                                                                                                        quantityValue: m.quantityValue ?? null,
                                                                                                        quantityUnit: m.quantityUnit ?? null,
                                                                                                    },
                                                                                                )
                                                                                            }
                                                                                            className="w-full text-left px-3 py-2 hover:bg-emerald-50 border-b border-emerald-200 last:border-b-0 transition-colors text-sm"
                                                                                        >
                                                                                            <div className="font-semibold text-gray-900">
                                                                                                {m.name}
                                                                                            </div>
                                                                                            <div className="text-xs text-gray-600">
                                                                                                {m.code ? `Code: ${m.code}` : "No Code"}
                                                                                                {m.expDate ? ` • Exp: ${new Date(m.expDate).toLocaleDateString("en-GB")}` : ""}
                                                                                            </div>
                                                                                        </button>
                                                                                    ))}
                                                                                {searchFilteredMedia.filter(
                                                                                    (m) =>
                                                                                        !addedMedia[selectedParam.id]?.find(
                                                                                            (added) => added.id === m.id,
                                                                                        ),
                                                                                ).length === 0 && (
                                                                                        <div className="px-3 py-4 text-center text-gray-500 text-sm">
                                                                                            {mediaSearch
                                                                                                ? "No matching media"
                                                                                                : "All available media added"}
                                                                                        </div>
                                                                                    )}
                                                                            </div>
                                                                        </motion.div>
                                                                    )}
                                                                </AnimatePresence>
                                                            </div>
                                                        </div>

                                                        {isReferenceDataLoading && <ReferenceLoading />}
                                                        {referenceDataError && (
                                                            <ReferenceError error={referenceDataError} />
                                                        )}

                                                        {!isReferenceDataLoading && !referenceDataError && (
                                                            <table className="w-full border-collapse text-sm shadow-md">
                                                                <thead>
                                                                    <tr className="bg-emerald-100 border-2 border-emerald-500">
                                                                        <th className="px-3 py-2 border-r-2 border-emerald-500 text-left font-bold">
                                                                            Name of Media
                                                                        </th>
                                                                        <th className="px-3 py-2 border-r-2 border-emerald-500 text-left font-bold">
                                                                            Code
                                                                        </th>
                                                                        <th className="px-3 py-2 border-r-2 border-emerald-500 text-left font-bold">
                                                                            Quantity
                                                                        </th>
                                                                        <th className="px-3 py-2 border-r-2 border-emerald-500 text-left font-bold">
                                                                            Exp. Date
                                                                        </th>
                                                                        <th className="px-3 py-2 text-center font-bold w-20">
                                                                            Action
                                                                        </th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    <AnimatePresence>
                                                                        {addedMedia[selectedParam.id]?.length > 0 ? (
                                                                            addedMedia[selectedParam.id].map((m) => (
                                                                                <motion.tr
                                                                                    key={m.id}
                                                                                    initial={{ opacity: 0, x: -20 }}
                                                                                    animate={{ opacity: 1, x: 0 }}
                                                                                    exit={{ opacity: 0, x: 20 }}
                                                                                    className="border-2 border-emerald-500 hover:bg-emerald-50 transition-colors"
                                                                                >
                                                                                    <td className="px-3 py-2 border-r-2 border-emerald-500">
                                                                                        {m.name || "---"}
                                                                                    </td>
                                                                                    <td className="px-3 py-2 border-r-2 border-emerald-500">
                                                                                        {m.code || "---"}
                                                                                    </td>
                                                                                    <td className="px-3 py-2 border-r-2 border-emerald-500">
                                                                                        {m.quantityValue} {m.quantityUnit}
                                                                                    </td>
                                                                                    <td className="px-3 py-2 border-r-2 border-emerald-500">
                                                                                        {m.expDate
                                                                                            ? new Date(m.expDate).toLocaleDateString("en-GB")
                                                                                            : "---"}
                                                                                    </td>
                                                                                    <td className="px-3 py-2 text-center">
                                                                                        {!isPreparationLocked && (
                                                                                            <motion.button
                                                                                                onClick={() =>
                                                                                                    handleRemoveMedia(
                                                                                                        selectedParam.id,
                                                                                                        m.id,
                                                                                                    )
                                                                                                }
                                                                                                whileHover={{ scale: 1.1, rotate: 10 }}
                                                                                                whileTap={{ scale: 0.9 }}
                                                                                                className="mx-2"
                                                                                            >
                                                                                                <CgTrash className="w-5 h-5 text-red-500" />
                                                                                            </motion.button>
                                                                                        )}
                                                                                    </td>
                                                                                </motion.tr>
                                                                            ))
                                                                        ) : (
                                                                            <tr className="border-2 border-emerald-500">
                                                                                <td
                                                                                    colSpan={4}
                                                                                    className="px-3 py-4 text-center text-gray-500"
                                                                                >
                                                                                    <div className="flex flex-col items-center gap-2">
                                                                                        <Target className="w-8 h-8 opacity-30" />
                                                                                        <span>
                                                                                            No media added. Click "+" to add.
                                                                                        </span>
                                                                                    </div>
                                                                                </td>
                                                                            </tr>
                                                                        )}
                                                                    </AnimatePresence>
                                                                </tbody>
                                                            </table>
                                                        )}
                                                    </div>


                                                    {/* ============= PREPARATIONS MANAGEMENT SECTION ============= */}
                                                    <div className="mb-8 p-6 bg-gradient-to-br from-emerald-50 via-emerald-50 to-emerald-50 border border-emerald-200 rounded-2xl shadow-2xl">
                                                        <div
                                                            className="flex items-center justify-between mb-6"
                                                        >
                                                            <div className="flex items-center gap-3">
                                                                <div className="relative">
                                                                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-700 to-emerald-900 rounded-2xl flex items-center justify-center shadow-lg">
                                                                        <BiTestTube className="w-6 h-6 text-white" />
                                                                    </div>
                                                                </div>
                                                                <div>
                                                                    <h3 className="text-xl font-bold text-emerald-900 tracking-tight">
                                                                        Preparations Management
                                                                    </h3>
                                                                    <p className="text-xs text-emerald-600 font-medium">
                                                                        Configure analysis preparations for this parameter
                                                                    </p>
                                                                </div>
                                                            </div>

                                                            <div
                                                                className="relative"
                                                                ref={preparationDropdownRef}
                                                            >
                                                                <button
                                                                    onClick={() =>
                                                                        setShowPreparationDropdown((prev) => ({
                                                                            ...prev,
                                                                            [selectedParam.id]: !prev[selectedParam.id],
                                                                        }))
                                                                    }
                                                                    disabled={isPreparationLocked}
                                                                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-700 to-emerald-900 text-white font-semibold rounded-lg hover:from-emerald-700 hover:to-emerald-800 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                                                                >
                                                                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                                                                    <Plus className="w-5 h-5 relative z-10 group-hover:rotate-90 transition-transform duration-300" />
                                                                    <span className="relative z-10">
                                                                        Add Preparations
                                                                    </span>
                                                                </button>
                                                                {/* Dropdown Menu */}
                                                                <AnimatePresence>
                                                                    {showPreparationDropdown[selectedParam.id] && (
                                                                        <motion.div
                                                                            initial={{ opacity: 0, y: -10 }}
                                                                            animate={{ opacity: 1, y: 0 }}
                                                                            exit={{ opacity: 0, y: -10 }}
                                                                            className="absolute right-0 mt-2 w-72 bg-white border border-emerald-300 rounded-lg shadow-xl z-50 max-h-80 overflow-y-auto"
                                                                        >
                                                                            {getAvailablePreparationGroups().map((group) => {
                                                                                const isActive = (
                                                                                    activePreparationGroups[selectedParam.id] || []
                                                                                ).includes(group.id);
                                                                                return (
                                                                                    <button
                                                                                        key={group.id}
                                                                                        onClick={() =>
                                                                                            handleTogglePreparationGroup(
                                                                                                selectedParam.id,
                                                                                                group.id,
                                                                                            )
                                                                                        }
                                                                                        className="w-full text-left px-3 py-3 hover:bg-emerald-50 border-b border-emerald-200 last:border-b-0 transition-colors text-sm"
                                                                                    >
                                                                                        <div className="flex items-center justify-between">
                                                                                            <span className="font-semibold text-gray-900">
                                                                                                {group.label}
                                                                                            </span>
                                                                                            {isActive && (
                                                                                                <Check className="w-4 h-4 text-emerald-600" />
                                                                                            )}
                                                                                        </div>
                                                                                    </button>
                                                                                );
                                                                            })}
                                                                        </motion.div>
                                                                    )}
                                                                </AnimatePresence>
                                                            </div>
                                                        </div>

                                                        <AnimatePresence>
                                                            {(() => {
                                                                const activeGroups =
                                                                    activePreparationGroups[selectedParam.id] || [];

                                                                const groupInfo: Record<
                                                                    string,
                                                                    { label?: string; color?: string }
                                                                > = {};

                                                                activeGroups.forEach((groupId) => {
                                                                    const group =
                                                                        PREPARATION_GROUPS[
                                                                        groupId as keyof typeof PREPARATION_GROUPS
                                                                        ];
                                                                    if (group) {
                                                                        groupInfo[groupId] = {
                                                                            label: group.label,
                                                                            color: group.color,
                                                                        };
                                                                    }
                                                                });

                                                                if (Object.keys(groupInfo).length > 0) {
                                                                    return (
                                                                        <motion.div
                                                                            key="active-preparations-content"
                                                                            initial={{ opacity: 0, height: 0 }}
                                                                            animate={{ opacity: 1, height: "auto" }}
                                                                            exit={{ opacity: 0, height: 0 }}
                                                                            className="space-y-4"
                                                                            layout
                                                                        >
                                                                            <div className="flex items-center gap-3 my-4">
                                                                                <div className="h-0.5 flex-1 bg-gradient-to-r from-transparent via-emerald-600 to-transparent"></div>
                                                                                <div className="flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-emerald-700 via-emerald-800 to-slate-900 rounded-full shadow-lg">
                                                                                    <span className="text-xs font-bold text-white uppercase tracking-wider">
                                                                                        Active Preparation Group
                                                                                    </span>
                                                                                </div>
                                                                                <div className="h-0.5 flex-1 bg-gradient-to-r from-transparent via-emerald-600 to-transparent"></div>
                                                                            </div>

                                                                            <motion.div layout>
                                                                                <div className="flex flex-wrap gap-3">
                                                                                    {Object.entries(groupInfo).map(([groupId, info]) => {
                                                                                        return (
                                                                                            <motion.div
                                                                                                key={groupId}
                                                                                                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                                                                                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                                                                                exit={{ opacity: 0, scale: 0.8, y: 20 }}
                                                                                                whileHover={{ scale: 1.05 }}
                                                                                                className="group relative inline-flex items-center gap-3 py-2 px-4 bg-gradient-to-br from-emerald-100 to-emerald-200 text-emerald-800 border-emerald-400 border-2 rounded-lg font-semibold shadow-lg shadow-emerald-200/50 hover:shadow-xl transition-all duration-300 overflow-hidden"
                                                                                            >
                                                                                                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>

                                                                                                <div className="flex items-center gap-3 relative z-10">
                                                                                                    <span className="font-bold text-sm">
                                                                                                        {info.label}
                                                                                                    </span>
                                                                                                </div>

                                                                                                {!isPreparationLocked && (
                                                                                                    <motion.button
                                                                                                        onClick={() =>
                                                                                                            handleTogglePreparationGroup(
                                                                                                                selectedParam.id,
                                                                                                                groupId,
                                                                                                            )
                                                                                                        }
                                                                                                        whileHover={{ scale: 1.2, rotate: 90 }}
                                                                                                        whileTap={{ scale: 0.9 }}
                                                                                                        className="relative z-10 w-5 h-5 flex items-center justify-center rounded-full bg-emerald-800 hover:bg-red-500 text-gray-600 hover:text-white transition-all font-bold border-1 border-white/50 hover:border-red-600 shadow-sm"
                                                                                                        title={`Remove ${info.label} group`}
                                                                                                    >
                                                                                                        <span className="text-[9px] text-white inline-flex items-center justify-center h-full w-full">
                                                                                                            ✕
                                                                                                        </span>
                                                                                                    </motion.button>
                                                                                                )}
                                                                                            </motion.div>
                                                                                        );
                                                                                    })}
                                                                                </div>

                                                                                <motion.div
                                                                                    initial={{ opacity: 0, y: 10 }}
                                                                                    animate={{ opacity: 1, y: 0 }}
                                                                                    className="mt-5 p-4 bg-gradient-to-r from-emerald-50 via-emerald-50 to-emerald-50 border-2 border-emerald-200 rounded-xl shadow-inner"
                                                                                >
                                                                                    <div className="flex items-start gap-3">
                                                                                        <div className="w-8 h-8 flex-shrink-0 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center shadow-md">
                                                                                            <span className="text-white text-lg">💡</span>
                                                                                        </div>
                                                                                        <div className="flex-1">
                                                                                            <p className="text-sm text-emerald-800 font-semibold mb-1">
                                                                                                Quick Guide
                                                                                            </p>
                                                                                            <p className="text-xs text-emerald-800 leading-relaxed">
                                                                                                Click the{" "}
                                                                                                <span className="inline-flex items-center justify-center w-5 h-5 bg-white rounded-full text-red-500 font-bold mx-1">
                                                                                                    ✕
                                                                                                </span>{" "}
                                                                                                button to remove a preparation group and all its data.
                                                                                                Use{" "}
                                                                                                <strong>"Add Preparation"</strong>{" "}
                                                                                                to enable more groups.
                                                                                            </p>
                                                                                        </div>
                                                                                    </div>
                                                                                </motion.div>
                                                                            </motion.div>
                                                                        </motion.div>
                                                                    );
                                                                }

                                                                return (
                                                                    <motion.div
                                                                        key="empty-state-content"
                                                                        initial={{ opacity: 0 }}
                                                                        animate={{ opacity: 1 }}
                                                                        exit={{ opacity: 0 }}
                                                                        className="text-center py-12 text-gray-500 bg-gradient-to-br from-gray-50 via-white to-gray-50 rounded-2xl border-2 border-dashed border-gray-300 shadow-inner"
                                                                        layout
                                                                    >
                                                                        <div className="inline-block">
                                                                            <Target className="w-14 h-14 text-gray-300" />
                                                                        </div>
                                                                        <p className="text-base font-bold text-gray-800 mb-2">
                                                                            No preparation groups configured yet
                                                                        </p>
                                                                        <p className="text-sm text-gray-600 max-w-md mx-auto">
                                                                            Click the{" "}
                                                                            <strong className="text-emerald-800">
                                                                                "Add Preparation"
                                                                            </strong>{" "}
                                                                            button above to select preparation groups for this parameter
                                                                        </p>
                                                                    </motion.div>
                                                                );
                                                            })()}
                                                        </AnimatePresence>
                                                    </div>
                                                    {/* ============= END OF PREPARATIONS MANAGEMENT SECTION ============= */}

                                                    {/* ============= BET PREPARATION SECTION ============= */}
                                                    {(activePreparationGroups[selectedParam.id] || []).includes("bet") && (
                                                        <div className="mt-6 space-y-4">
                                                            <div className="flex items-center gap-3 mb-2">
                                                                <div className="h-0.5 flex-1 bg-gradient-to-r from-transparent via-emerald-600 to-transparent" />
                                                                <div className="flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-emerald-700 via-emerald-800 to-slate-900 rounded-full shadow-lg">
                                                                    <span className="text-xs font-bold text-white uppercase tracking-wider">
                                                                        Preparation for BET
                                                                    </span>
                                                                </div>
                                                                <div className="h-0.5 flex-1 bg-gradient-to-r from-transparent via-emerald-600 to-transparent" />
                                                            </div>

                                                            {(betPreparationsPerParam[selectedParam.id] || []).map((betPrep) => (
                                                                <BETPreparationDetail
                                                                    key={betPrep.id}
                                                                    preparation={betPrep}
                                                                    isLocked={isPreparationLocked}
                                                                    onChange={(updated) =>
                                                                        setBetPreparationsPerParam((prev) => ({
                                                                            ...prev,
                                                                            [selectedParam.id]: (prev[selectedParam.id] || []).map((p) =>
                                                                                p.id === updated.id ? updated : p
                                                                            ),
                                                                        }))
                                                                    }
                                                                    onRemove={() =>
                                                                        setBetPreparationsPerParam((prev) => ({
                                                                            ...prev,
                                                                            [selectedParam.id]: (prev[selectedParam.id] || []).filter(
                                                                                (p) => p.id !== betPrep.id
                                                                            ),
                                                                        }))
                                                                    }
                                                                />
                                                            ))}

                                                            {!isPreparationLocked && (
                                                                <button
                                                                    onClick={() =>
                                                                        setBetPreparationsPerParam((prev) => {
                                                                            const existing = prev[selectedParam.id] || [];
                                                                            return {
                                                                                ...prev,
                                                                                [selectedParam.id]: [
                                                                                    ...existing,
                                                                                    createDefaultBETPreparation(existing.length),
                                                                                ],
                                                                            };
                                                                        })
                                                                    }
                                                                    className="flex items-center gap-2 px-4 py-2.5 bg-white border-2 border-dashed border-emerald-300 text-emerald-700 font-semibold rounded-xl hover:border-emerald-500 hover:bg-emerald-50 transition-all text-sm w-full justify-center"
                                                                >
                                                                    <span className="text-lg leading-none">+</span>
                                                                    Add BET Preparation
                                                                </button>
                                                            )}
                                                        </div>
                                                    )}
                                                    {/* ============= END OF BET PREPARATION SECTION ============= */}

                                                    {/* ============= STERILITY PREPARATION SECTION ============= */}
                                                    {(activePreparationGroups[selectedParam.id] || []).includes("sterility") && (
                                                        <div className="mt-6 space-y-4">
                                                            <div className="flex items-center gap-3 mb-2">
                                                                <div className="h-0.5 flex-1 bg-gradient-to-r from-transparent via-emerald-600 to-transparent" />
                                                                <div className="flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-emerald-700 via-emerald-800 to-slate-900 rounded-full shadow-lg">
                                                                    <span className="text-xs font-bold text-white uppercase tracking-wider">Preparation for Sterility</span>
                                                                </div>
                                                                <div className="h-0.5 flex-1 bg-gradient-to-r from-transparent via-emerald-600 to-transparent" />
                                                            </div>
                                                            {(sterilityPreparationsPerParam[selectedParam.id] || []).map((sp) => (
                                                                <SterilityPreparationDetail
                                                                    key={sp.id}
                                                                    preparation={sp}
                                                                    isLocked={isPreparationLocked}
                                                                    onChange={(updated) =>
                                                                        setSterilityPreparationsPerParam((prev) => ({
                                                                            ...prev,
                                                                            [selectedParam.id]: (prev[selectedParam.id] || []).map((p) =>
                                                                                p.id === updated.id ? updated : p
                                                                            ),
                                                                        }))
                                                                    }
                                                                    onRemove={() =>
                                                                        setSterilityPreparationsPerParam((prev) => ({
                                                                            ...prev,
                                                                            [selectedParam.id]: (prev[selectedParam.id] || []).filter(
                                                                                (p) => p.id !== sp.id
                                                                            ),
                                                                        }))
                                                                    }
                                                                />
                                                            ))}
                                                            {!isPreparationLocked && (
                                                                <button
                                                                    onClick={() =>
                                                                        setSterilityPreparationsPerParam((prev) => {
                                                                            const existing = prev[selectedParam.id] || [];
                                                                            return { ...prev, [selectedParam.id]: [...existing, createDefaultSterilityPreparation(existing.length)] };
                                                                        })
                                                                    }
                                                                    className="flex items-center gap-2 px-4 py-2.5 bg-white border-2 border-dashed border-emerald-300 text-emerald-700 font-semibold rounded-xl hover:border-emerald-500 hover:bg-emerald-50 transition-all text-sm w-full justify-center"
                                                                >
                                                                    <span className="text-lg leading-none">+</span>
                                                                    Add Sterility Preparation
                                                                </button>
                                                            )}
                                                        </div>
                                                    )}
                                                    {/* ============= END OF STERILITY PREPARATION SECTION ============= */}

                                                    {/* ============= E.COLI PREPARATION SECTION ============= */}
                                                    {(activePreparationGroups[selectedParam.id] || []).includes("ecoli") && (
                                                        <div className="mt-6 space-y-4">
                                                            <div className="flex items-center gap-3 mb-2">
                                                                <div className="h-0.5 flex-1 bg-gradient-to-r from-transparent via-emerald-600 to-transparent" />
                                                                <div className="flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-emerald-700 via-emerald-800 to-slate-900 rounded-full shadow-lg">
                                                                    <span className="text-xs font-bold text-white uppercase tracking-wider">
                                                                        Preparation for E.coli
                                                                    </span>
                                                                </div>
                                                                <div className="h-0.5 flex-1 bg-gradient-to-r from-transparent via-emerald-600 to-transparent" />
                                                            </div>

                                                            {(ecoliPreparationsPerParam[selectedParam.id] || []).map((ecoliPrep) => (
                                                                <EcoliPreparationDetail
                                                                    key={ecoliPrep.id}
                                                                    preparation={ecoliPrep}
                                                                    isLocked={isPreparationLocked}
                                                                    onChange={(updated) =>
                                                                        setEcoliPreparationsPerParam((prev) => ({
                                                                            ...prev,
                                                                            [selectedParam.id]: (prev[selectedParam.id] || []).map((p) =>
                                                                                p.id === updated.id ? updated : p
                                                                            ),
                                                                        }))
                                                                    }
                                                                    onRemove={() =>
                                                                        setEcoliPreparationsPerParam((prev) => ({
                                                                            ...prev,
                                                                            [selectedParam.id]: (prev[selectedParam.id] || []).filter(
                                                                                (p) => p.id !== ecoliPrep.id
                                                                            ),
                                                                        }))
                                                                    }
                                                                />
                                                            ))}

                                                            {!isPreparationLocked && (
                                                                <button
                                                                    onClick={() =>
                                                                        setEcoliPreparationsPerParam((prev) => {
                                                                            const existing = prev[selectedParam.id] || [];
                                                                            return {
                                                                                ...prev,
                                                                                [selectedParam.id]: [
                                                                                    ...existing,
                                                                                    createDefaultEcoliPreparation(existing.length),
                                                                                ],
                                                                            };
                                                                        })
                                                                    }
                                                                    className="flex items-center gap-2 px-4 py-2.5 bg-white border-2 border-dashed border-emerald-300 text-emerald-700 font-semibold rounded-xl hover:border-emerald-500 hover:bg-emerald-50 transition-all text-sm w-full justify-center"
                                                                >
                                                                    <span className="text-lg leading-none">+</span>
                                                                    Add E.coli Preparation
                                                                </button>
                                                            )}
                                                        </div>
                                                    )}
                                                    {/* ============= END OF E.COLI PREPARATION SECTION ============= */}

                                                    {/* ============= SALMONELLA PREPARATION SECTION ============= */}
                                                    {(activePreparationGroups[selectedParam.id] || []).includes("salmonella") && (
                                                        <div className="mt-6 space-y-4">
                                                            <div className="flex items-center gap-3 mb-2">
                                                                <div className="h-0.5 flex-1 bg-gradient-to-r from-transparent via-emerald-600 to-transparent" />
                                                                <div className="flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-emerald-700 via-emerald-800 to-slate-900 rounded-full shadow-lg">
                                                                    <span className="text-xs font-bold text-white uppercase tracking-wider">
                                                                        Preparation for Salmonella
                                                                    </span>
                                                                </div>
                                                                <div className="h-0.5 flex-1 bg-gradient-to-r from-transparent via-emerald-600 to-transparent" />
                                                            </div>

                                                            {(salmonellaPreparationsPerParam[selectedParam.id] || []).map((sm) => (
                                                                <SalmonellaPreparationDetail
                                                                    key={sm.id}
                                                                    preparation={sm}
                                                                    isLocked={isPreparationLocked}
                                                                    onChange={(updated) =>
                                                                        setSalmonellaPreparationsPerParam((prev) => ({
                                                                            ...prev,
                                                                            [selectedParam.id]: (prev[selectedParam.id] || []).map((p) =>
                                                                                p.id === updated.id ? updated : p
                                                                            ),
                                                                        }))
                                                                    }
                                                                    onRemove={() =>
                                                                        setSalmonellaPreparationsPerParam((prev) => ({
                                                                            ...prev,
                                                                            [selectedParam.id]: (prev[selectedParam.id] || []).filter(
                                                                                (p) => p.id !== sm.id
                                                                            ),
                                                                        }))
                                                                    }
                                                                />
                                                            ))}

                                                            {!isPreparationLocked && (
                                                                <button
                                                                    onClick={() =>
                                                                        setSalmonellaPreparationsPerParam((prev) => {
                                                                            const existing = prev[selectedParam.id] || [];
                                                                            return {
                                                                                ...prev,
                                                                                [selectedParam.id]: [
                                                                                    ...existing,
                                                                                    createDefaultSalmonellaPreparation(existing.length),
                                                                                ],
                                                                            };
                                                                        })
                                                                    }
                                                                    className="flex items-center gap-2 px-4 py-2.5 bg-white border-2 border-dashed border-emerald-300 text-emerald-700 font-semibold rounded-xl hover:border-emerald-500 hover:bg-emerald-50 transition-all text-sm w-full justify-center"
                                                                >
                                                                    <span className="text-lg leading-none">+</span>
                                                                    Add Salmonella Preparation
                                                                </button>
                                                            )}
                                                        </div>
                                                    )}
                                                    {/* ============= END OF SALMONELLA PREPARATION SECTION ============= */}

                                                    {/* ============= Clostridium PREPARATION SECTION ============= */}
                                                    {(activePreparationGroups[selectedParam.id] || []).includes("clostridium") && (
                                                        <div className="mt-6 space-y-4">
                                                            <div className="flex items-center gap-3 mb-2">
                                                                <div className="h-0.5 flex-1 bg-gradient-to-r from-transparent via-emerald-600 to-transparent" />
                                                                <div className="flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-emerald-700 via-emerald-800 to-slate-900 rounded-full shadow-lg">
                                                                    <span className="text-xs font-bold text-white uppercase tracking-wider">
                                                                        Preparation for Clostridium
                                                                    </span>
                                                                </div>
                                                                <div className="h-0.5 flex-1 bg-gradient-to-r from-transparent via-emerald-600 to-transparent" />
                                                            </div>

                                                            {(clostridiumPreparationsPerParam[selectedParam.id] || []).map((sg) => (
                                                                <ClostridiumPreparationDetail
                                                                    key={sg.id}
                                                                    preparation={sg}
                                                                    isLocked={isPreparationLocked}
                                                                    onChange={(updated) =>
                                                                        setClostridiumPreparationsPerParam((prev) => ({
                                                                            ...prev,
                                                                            [selectedParam.id]: (prev[selectedParam.id] || []).map((p) =>
                                                                                p.id === updated.id ? updated : p
                                                                            ),
                                                                        }))
                                                                    }
                                                                    onRemove={() =>
                                                                        setClostridiumPreparationsPerParam((prev) => ({
                                                                            ...prev,
                                                                            [selectedParam.id]: (prev[selectedParam.id] || []).filter(
                                                                                (p) => p.id !== sg.id
                                                                            ),
                                                                        }))
                                                                    }
                                                                />
                                                            ))}

                                                            {!isPreparationLocked && (
                                                                <button
                                                                    onClick={() =>
                                                                        setClostridiumPreparationsPerParam((prev) => {
                                                                            const existing = prev[selectedParam.id] || [];
                                                                            return {
                                                                                ...prev,
                                                                                [selectedParam.id]: [
                                                                                    ...existing,
                                                                                    createDefaultClostridiumPreparation(existing.length),
                                                                                ],
                                                                            };
                                                                        })
                                                                    }
                                                                    className="flex items-center gap-2 px-4 py-2.5 bg-white border-2 border-dashed border-emerald-300 text-emerald-700 font-semibold rounded-xl hover:border-emerald-500 hover:bg-emerald-50 transition-all text-sm w-full justify-center"
                                                                >
                                                                    <span className="text-lg leading-none">+</span>
                                                                    Add Clostridium Preparation
                                                                </button>
                                                            )}
                                                        </div>
                                                    )}
                                                    {/* ============= END OF Clostridium PREPARATION SECTION ============= */}

                                                    {/* ============= SHIGELLA PREPARATION SECTION ============= */}
                                                    {(activePreparationGroups[selectedParam.id] || []).includes("shigella") && (
                                                        <div className="mt-6 space-y-4">
                                                            <div className="flex items-center gap-3 mb-2">
                                                                <div className="h-0.5 flex-1 bg-gradient-to-r from-transparent via-emerald-600 to-transparent" />
                                                                <div className="flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-emerald-700 via-emerald-800 to-slate-900 rounded-full shadow-lg">
                                                                    <span className="text-xs font-bold text-white uppercase tracking-wider">
                                                                        Preparation for Shigella
                                                                    </span>
                                                                </div>
                                                                <div className="h-0.5 flex-1 bg-gradient-to-r from-transparent via-emerald-600 to-transparent" />
                                                            </div>

                                                            {(shigellaPreparationsPerParam[selectedParam.id] || []).map((sg) => (
                                                                <ShigellaPreparationDetail
                                                                    key={sg.id}
                                                                    preparation={sg}
                                                                    isLocked={isPreparationLocked}
                                                                    onChange={(updated) =>
                                                                        setShigellaPreparationsPerParam((prev) => ({
                                                                            ...prev,
                                                                            [selectedParam.id]: (prev[selectedParam.id] || []).map((p) =>
                                                                                p.id === updated.id ? updated : p
                                                                            ),
                                                                        }))
                                                                    }
                                                                    onRemove={() =>
                                                                        setShigellaPreparationsPerParam((prev) => ({
                                                                            ...prev,
                                                                            [selectedParam.id]: (prev[selectedParam.id] || []).filter(
                                                                                (p) => p.id !== sg.id
                                                                            ),
                                                                        }))
                                                                    }
                                                                />
                                                            ))}

                                                            {!isPreparationLocked && (
                                                                <button
                                                                    onClick={() =>
                                                                        setShigellaPreparationsPerParam((prev) => {
                                                                            const existing = prev[selectedParam.id] || [];
                                                                            return {
                                                                                ...prev,
                                                                                [selectedParam.id]: [
                                                                                    ...existing,
                                                                                    createDefaultShigellaPreparation(existing.length),
                                                                                ],
                                                                            };
                                                                        })
                                                                    }
                                                                    className="flex items-center gap-2 px-4 py-2.5 bg-white border-2 border-dashed border-emerald-300 text-emerald-700 font-semibold rounded-xl hover:border-emerald-500 hover:bg-emerald-50 transition-all text-sm w-full justify-center"
                                                                >
                                                                    <span className="text-lg leading-none">+</span>
                                                                    Add Shigella Preparation
                                                                </button>
                                                            )}
                                                        </div>
                                                    )}
                                                    {/* ============= END OF SHIGELLA PREPARATION SECTION ============= */}

                                                    {/* ============= Staphylococcus PREPARATION SECTION ============= */}
                                                    {(activePreparationGroups[selectedParam.id] || []).includes("staphylococcus") && (
                                                        <div className="mt-6 space-y-4">
                                                            <div className="flex items-center gap-3 mb-2">
                                                                <div className="h-0.5 flex-1 bg-gradient-to-r from-transparent via-emerald-600 to-transparent" />
                                                                <div className="flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-emerald-700 via-emerald-800 to-slate-900 rounded-full shadow-lg">
                                                                    <span className="text-xs font-bold text-white uppercase tracking-wider">
                                                                        Preparation for Staphylococcus
                                                                    </span>
                                                                </div>
                                                                <div className="h-0.5 flex-1 bg-gradient-to-r from-transparent via-emerald-600 to-transparent" />
                                                            </div>

                                                            {(staphylococcusPreparationsPerParam[selectedParam.id] || []).map((sg) => (
                                                                <StaphylococcusPreparationDetail
                                                                    key={sg.id}
                                                                    preparation={sg}
                                                                    isLocked={isPreparationLocked}
                                                                    onChange={(updated) =>
                                                                        setStaphylococcusPreparationsPerParam((prev) => ({
                                                                            ...prev,
                                                                            [selectedParam.id]: (prev[selectedParam.id] || []).map((p) =>
                                                                                p.id === updated.id ? updated : p
                                                                            ),
                                                                        }))
                                                                    }
                                                                    onRemove={() =>
                                                                        setStaphylococcusPreparationsPerParam((prev) => ({
                                                                            ...prev,
                                                                            [selectedParam.id]: (prev[selectedParam.id] || []).filter(
                                                                                (p) => p.id !== sg.id
                                                                            ),
                                                                        }))
                                                                    }
                                                                />
                                                            ))}

                                                            {!isPreparationLocked && (
                                                                <button
                                                                    onClick={() =>
                                                                        setStaphylococcusPreparationsPerParam((prev) => {
                                                                            const existing = prev[selectedParam.id] || [];
                                                                            return {
                                                                                ...prev,
                                                                                [selectedParam.id]: [
                                                                                    ...existing,
                                                                                    createDefaultStaphylococcusPreparation(existing.length),
                                                                                ],
                                                                            };
                                                                        })
                                                                    }
                                                                    className="flex items-center gap-2 px-4 py-2.5 bg-white border-2 border-dashed border-emerald-300 text-emerald-700 font-semibold rounded-xl hover:border-emerald-500 hover:bg-emerald-50 transition-all text-sm w-full justify-center"
                                                                >
                                                                    <span className="text-lg leading-none">+</span>
                                                                    Add Staphylococcus Preparation
                                                                </button>
                                                            )}
                                                        </div>
                                                    )}
                                                    {/* ============= END OF Staphylococcus PREPARATION SECTION ============= */}

                                                    {/* ============= Pseudomonas PREPARATION SECTION ============= */}
                                                    {(activePreparationGroups[selectedParam.id] || []).includes("pseudomonas") && (
                                                        <div className="mt-6 space-y-4">
                                                            <div className="flex items-center gap-3 mb-2">
                                                                <div className="h-0.5 flex-1 bg-gradient-to-r from-transparent via-emerald-600 to-transparent" />
                                                                <div className="flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-emerald-700 via-emerald-800 to-slate-900 rounded-full shadow-lg">
                                                                    <span className="text-xs font-bold text-white uppercase tracking-wider">
                                                                        Preparation for Pseudomonas
                                                                    </span>
                                                                </div>
                                                                <div className="h-0.5 flex-1 bg-gradient-to-r from-transparent via-emerald-600 to-transparent" />
                                                            </div>

                                                            {(pseudomonasPreparationsPerParam[selectedParam.id] || []).map((sg) => (
                                                                <PseudomonasPreparationDetail
                                                                    key={sg.id}
                                                                    preparation={sg}
                                                                    isLocked={isPreparationLocked}
                                                                    onChange={(updated) =>
                                                                        setPseudomonasPreparationsPerParam((prev) => ({
                                                                            ...prev,
                                                                            [selectedParam.id]: (prev[selectedParam.id] || []).map((p) =>
                                                                                p.id === updated.id ? updated : p
                                                                            ),
                                                                        }))
                                                                    }
                                                                    onRemove={() =>
                                                                        setPseudomonasPreparationsPerParam((prev) => ({
                                                                            ...prev,
                                                                            [selectedParam.id]: (prev[selectedParam.id] || []).filter(
                                                                                (p) => p.id !== sg.id
                                                                            ),
                                                                        }))
                                                                    }
                                                                />
                                                            ))}

                                                            {!isPreparationLocked && (
                                                                <button
                                                                    onClick={() =>
                                                                        setPseudomonasPreparationsPerParam((prev) => {
                                                                            const existing = prev[selectedParam.id] || [];
                                                                            return {
                                                                                ...prev,
                                                                                [selectedParam.id]: [
                                                                                    ...existing,
                                                                                    createDefaultPseudomonasPreparation(existing.length),
                                                                                ],
                                                                            };
                                                                        })
                                                                    }
                                                                    className="flex items-center gap-2 px-4 py-2.5 bg-white border-2 border-dashed border-emerald-300 text-emerald-700 font-semibold rounded-xl hover:border-emerald-500 hover:bg-emerald-50 transition-all text-sm w-full justify-center"
                                                                >
                                                                    <span className="text-lg leading-none">+</span>
                                                                    Add Pseudomonas Preparation
                                                                </button>
                                                            )}
                                                        </div>
                                                    )}
                                                    {/* ============= END OF Pseudomonas PREPARATION SECTION ============= */}

                                                    {/* ============= BileTolerant PREPARATION SECTION ============= */}
                                                    {(activePreparationGroups[selectedParam.id] || []).includes("bileTolerant") && (
                                                        <div className="mt-6 space-y-4">
                                                            <div className="flex items-center gap-3 mb-2">
                                                                <div className="h-0.5 flex-1 bg-gradient-to-r from-transparent via-emerald-600 to-transparent" />
                                                                <div className="flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-emerald-700 via-emerald-800 to-slate-900 rounded-full shadow-lg">
                                                                    <span className="text-xs font-bold text-white uppercase tracking-wider">
                                                                        Preparation for Bile-Tolerant
                                                                    </span>
                                                                </div>
                                                                <div className="h-0.5 flex-1 bg-gradient-to-r from-transparent via-emerald-600 to-transparent" />
                                                            </div>

                                                            {(bileTolerantPreparationsPerParam[selectedParam.id] || []).map((sg) => (
                                                                <BileTolerantPreparationDetail
                                                                    key={sg.id}
                                                                    preparation={sg}
                                                                    isLocked={isPreparationLocked}
                                                                    onChange={(updated) =>
                                                                        setBileTolerantPreparationsPerParam((prev) => ({
                                                                            ...prev,
                                                                            [selectedParam.id]: (prev[selectedParam.id] || []).map((p) =>
                                                                                p.id === updated.id ? updated : p
                                                                            ),
                                                                        }))
                                                                    }
                                                                    onRemove={() =>
                                                                        setBileTolerantPreparationsPerParam((prev) => ({
                                                                            ...prev,
                                                                            [selectedParam.id]: (prev[selectedParam.id] || []).filter(
                                                                                (p) => p.id !== sg.id
                                                                            ),
                                                                        }))
                                                                    }
                                                                />
                                                            ))}

                                                            {!isPreparationLocked && (
                                                                <button
                                                                    onClick={() =>
                                                                        setBileTolerantPreparationsPerParam((prev) => {
                                                                            const existing = prev[selectedParam.id] || [];
                                                                            return {
                                                                                ...prev,
                                                                                [selectedParam.id]: [
                                                                                    ...existing,
                                                                                    createDefaultBileTolerantPreparation(existing.length),
                                                                                ],
                                                                            };
                                                                        })
                                                                    }
                                                                    className="flex items-center gap-2 px-4 py-2.5 bg-white border-2 border-dashed border-emerald-300 text-emerald-700 font-semibold rounded-xl hover:border-emerald-500 hover:bg-emerald-50 transition-all text-sm w-full justify-center"
                                                                >
                                                                    <span className="text-lg leading-none">+</span>
                                                                    Add Bile-Tolerant Preparation
                                                                </button>
                                                            )}
                                                        </div>
                                                    )}
                                                    {/* ============= END OF Bile-Tolerant PREPARATION SECTION ============= */}

                                                    {/* ============= C.albicans PREPARATION SECTION ============= */}
                                                    {(activePreparationGroups[selectedParam.id] || []).includes("calbicans") && (
                                                        <div className="mt-6 space-y-4">
                                                            <div className="flex items-center gap-3 mb-2">
                                                                <div className="h-0.5 flex-1 bg-gradient-to-r from-transparent via-emerald-600 to-transparent" />
                                                                <div className="flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-emerald-700 via-emerald-800 to-slate-900 rounded-full shadow-lg">
                                                                    <span className="text-xs font-bold text-white uppercase tracking-wider">
                                                                        Preparation for C.albicans
                                                                    </span>
                                                                </div>
                                                                <div className="h-0.5 flex-1 bg-gradient-to-r from-transparent via-emerald-600 to-transparent" />
                                                            </div>

                                                            {(calbicansPreparationsPerParam[selectedParam.id] || []).map((ca) => (
                                                                <CandidaAlbicansPreparationDetail
                                                                    key={ca.id}
                                                                    preparation={ca}
                                                                    isLocked={isPreparationLocked}
                                                                    onChange={(updated) =>
                                                                        setCalbicansPreparationsPerParam((prev) => ({
                                                                            ...prev,
                                                                            [selectedParam.id]: (prev[selectedParam.id] || []).map((p) =>
                                                                                p.id === updated.id ? updated : p
                                                                            ),
                                                                        }))
                                                                    }
                                                                    onRemove={() =>
                                                                        setCalbicansPreparationsPerParam((prev) => ({
                                                                            ...prev,
                                                                            [selectedParam.id]: (prev[selectedParam.id] || []).filter(
                                                                                (p) => p.id !== ca.id
                                                                            ),
                                                                        }))
                                                                    }
                                                                />
                                                            ))}

                                                            {!isPreparationLocked && (
                                                                <button
                                                                    onClick={() =>
                                                                        setCalbicansPreparationsPerParam((prev) => {
                                                                            const existing = prev[selectedParam.id] || [];
                                                                            return {
                                                                                ...prev,
                                                                                [selectedParam.id]: [
                                                                                    ...existing,
                                                                                    createDefaultCandidaAlbicansPreparation(existing.length),
                                                                                ],
                                                                            };
                                                                        })
                                                                    }
                                                                    className="flex items-center gap-2 px-4 py-2.5 bg-white border-2 border-dashed border-emerald-300 text-emerald-700 font-semibold rounded-xl hover:border-emerald-500 hover:bg-emerald-50 transition-all text-sm w-full justify-center"
                                                                >
                                                                    <span className="text-lg leading-none">+</span>
                                                                    Add C.albicans Preparation
                                                                </button>
                                                            )}
                                                        </div>
                                                    )}
                                                    {/* ============= END OF C.albicans PREPARATION SECTION ============= */}

                                                    {/* ============= B.cepacia Cepacia PREPARATION SECTION ============= */}
                                                    {(activePreparationGroups[selectedParam.id] || []).includes("bcepacia") && (
                                                        <div className="mt-6 space-y-4">
                                                            <div className="flex items-center gap-3 mb-2">
                                                                <div className="h-0.5 flex-1 bg-gradient-to-r from-transparent via-emerald-600 to-transparent" />
                                                                <div className="flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-emerald-700 via-emerald-800 to-slate-900 rounded-full shadow-lg">
                                                                    <span className="text-xs font-bold text-white uppercase tracking-wider">
                                                                        Preparation for B.cepacia
                                                                    </span>
                                                                </div>
                                                                <div className="h-0.5 flex-1 bg-gradient-to-r from-transparent via-emerald-600 to-transparent" />
                                                            </div>

                                                            {(bcepaciaPreparationsPerParam[selectedParam.id] || []).map((bc) => (
                                                                <BCepaciaPreparationDetail
                                                                    key={bc.id}
                                                                    preparation={bc}
                                                                    isLocked={isPreparationLocked}
                                                                    onChange={(updated) =>
                                                                        setBcepaciaPreparationsPerParam((prev) => ({
                                                                            ...prev,
                                                                            [selectedParam.id]: (prev[selectedParam.id] || []).map((p) =>
                                                                                p.id === updated.id ? updated : p
                                                                            ),
                                                                        }))
                                                                    }
                                                                    onRemove={() =>
                                                                        setBcepaciaPreparationsPerParam((prev) => ({
                                                                            ...prev,
                                                                            [selectedParam.id]: (prev[selectedParam.id] || []).filter(
                                                                                (p) => p.id !== bc.id
                                                                            ),
                                                                        }))
                                                                    }
                                                                />
                                                            ))}

                                                            {!isPreparationLocked && (
                                                                <button
                                                                    onClick={() =>
                                                                        setBcepaciaPreparationsPerParam((prev) => {
                                                                            const existing = prev[selectedParam.id] || [];
                                                                            return {
                                                                                ...prev,
                                                                                [selectedParam.id]: [
                                                                                    ...existing,
                                                                                    createDefaultBCepaciaPreparation(existing.length),
                                                                                ],
                                                                            };
                                                                        })
                                                                    }
                                                                    className="flex items-center gap-2 px-4 py-2.5 bg-white border-2 border-dashed border-emerald-300 text-emerald-700 font-semibold rounded-xl hover:border-emerald-500 hover:bg-emerald-50 transition-all text-sm w-full justify-center"
                                                                >
                                                                    <span className="text-lg leading-none">+</span>
                                                                    Add B.cepacia Preparation
                                                                </button>
                                                            )}
                                                        </div>
                                                    )}
                                                    {/* ============= END OF B.cepacia PREPARATION SECTION ============= */}

                                                    {/* ============= END OF MICRO WORKSHEET CONTENT ============= */}
                                                </div>

                                                {/* ===== Parameter Files Toggle ===== */}
                                                {(() => {
                                                    const paramFiles = getParamLevelFiles(selectedParam.id);
                                                    const hasParamFiles = paramFiles.length > 0;
                                                    const sectionVisible =
                                                        !!showParamFiles[selectedParam.id] ||
                                                        (isLocked && hasParamFiles);
                                                    return (
                                                <>
                                                <div className={`mb-6 mt-4 ${isLocked ? "opacity-70" : ""}`}>
                                                    <label className={`flex items-center gap-4 group relative ${isLocked ? "cursor-not-allowed" : "cursor-pointer"}`}>
                                                        <div className="relative flex items-center justify-center">
                                                            <div className="absolute inset-0 bg-gradient-to-r from-emerald-700 to-emerald-900 rounded-full blur-lg opacity-0 group-hover:opacity-20 transition-all duration-300" />
                                                            <input
                                                                type="checkbox"
                                                                checked={showParamFiles[selectedParam.id] || false}
                                                                disabled={isLocked}
                                                                onChange={(e) => {
                                                                    setShowParamFiles((prev) => ({
                                                                        ...prev,
                                                                        [selectedParam.id]: e.target.checked,
                                                                    }));
                                                                    if (!e.target.checked) {
                                                                        updateFilesForSlot(
                                                                            selectedParam.id,
                                                                            PARAM_LEVEL_KEY,
                                                                            () => [],
                                                                        );
                                                                    }
                                                                }}
                                                                className="peer sr-only"
                                                            />
                                                            <div className="relative w-14 h-7 rounded-full border-2 border-emerald-200 bg-gray-200 peer-checked:bg-gradient-to-r peer-checked:from-emerald-700 peer-checked:to-emerald-900 peer-checked:border-emerald-600 transition-all duration-300 shadow-inner group-hover:border-emerald-300">
                                                                <motion.div
                                                                    className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md flex items-center justify-center"
                                                                    animate={{
                                                                        x: showParamFiles[selectedParam.id] ? 28 : 0,
                                                                    }}
                                                                    transition={{
                                                                        type: "spring",
                                                                        stiffness: 500,
                                                                        damping: 30,
                                                                    }}
                                                                >
                                                                    {showParamFiles[selectedParam.id] ? (
                                                                        <svg
                                                                            className="w-3 h-3 text-emerald-600"
                                                                            fill="none"
                                                                            viewBox="0 0 24 24"
                                                                            stroke="currentColor"
                                                                            strokeWidth="3"
                                                                        >
                                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                                        </svg>
                                                                    ) : (
                                                                        <svg
                                                                            className="w-3 h-3 text-gray-400"
                                                                            fill="none"
                                                                            viewBox="0 0 24 24"
                                                                            stroke="currentColor"
                                                                            strokeWidth="3"
                                                                        >
                                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                                                        </svg>
                                                                    )}
                                                                </motion.div>
                                                            </div>
                                                        </div>

                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-base font-bold text-emerald-800 group-hover:text-emerald-800 transition-colors duration-200">
                                                                    Parameter Files
                                                                </span>
                                                                <motion.span
                                                                    initial={{ scale: 0 }}
                                                                    animate={{ scale: 1 }}
                                                                    className={`px-2 py-0.5 text-[10px] font-medium rounded-full transition-all duration-200 ${showParamFiles[selectedParam.id]
                                                                        ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                                                                        : "bg-gray-100 text-gray-500 border border-gray-200"
                                                                        }`}
                                                                >
                                                                    {showParamFiles[selectedParam.id] ? "Active" : "Inactive"}
                                                                </motion.span>
                                                            </div>
                                                            <p className="text-xs text-emerald-600/70">
                                                                Attach additional PDF files for this parameter
                                                            </p>
                                                        </div>
                                                    </label>
                                                </div>

                                                {/* Parameter Files Section (Conditional) */}
                                                <AnimatePresence>
                                                    {sectionVisible && (
                                                        <motion.div
                                                            initial={{ opacity: 0, y: 20 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            exit={{ opacity: 0, y: 0 }}
                                                            className="mb-6 p-6 bg-white rounded-xl border-2 border-emerald-200 shadow-lg"
                                                        >
                                                            <div className="flex items-center gap-3 mb-4">
                                                                <span className="w-1.5 h-6 bg-gradient-to-b from-emerald-500 to-emerald-600 rounded-full" />
                                                                <h3 className="text-lg font-bold text-emerald-800 tracking-tight">
                                                                    Parameter Files
                                                                </h3>
                                                            </div>
                                                            <div className="pointer-events-auto">
                                                                <WorksheetFileAttacher
                                                                    files={paramFiles}
                                                                    onAdd={(newFiles) =>
                                                                        handleAddParamFiles(selectedParam.id, newFiles)
                                                                    }
                                                                    onRemove={(index) =>
                                                                        handleRemoveParamFile(selectedParam.id, index)
                                                                    }
                                                                    preparationType={null}
                                                                    sectionLabel="Other Files"
                                                                    isForPrep={false}
                                                                    isLocked={isLocked || shouldDisableContent}
                                                                />
                                                            </div>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                                </>
                                                    );
                                                })()}
                                                {/* ===== END Parameter Files Toggle ===== */}

                                                {isLocked && (
                                                    <BottomParameterActionBar
                                                        parameterId={selectedParam.id}
                                                    />
                                                )}
                                            </motion.div>
                                        </AnimatePresence>
                                    );
                                })}

                        </div>
                    </div>

                    <AnimatePresence>
                        {showAnalystDialog && (
                            <AnalystSelectionDialog
                                isOpen={showAnalystDialog}
                                onClose={() => {
                                    setShowAnalystDialog(false);
                                    setPendingParameter(null);
                                }}
                                analysts={analysts}
                                onSelectAnalyst={handleAnalystSelected}
                                lab={worksheetInfo?.sample.lab}
                            />
                        )}
                    </AnimatePresence>
                    <AnimatePresence>
                        {showSubmitDialog && (
                            <SubmitDialog
                                isOpen={showSubmitDialog}
                                isSubmitting={isSubmitting}
                                onClose={() => setShowSubmitDialog(false)}
                                onConfirm={handleSubmitForAnalysis}
                                createdParametersCount={
                                    addedParameters.filter(
                                        (param) =>
                                            (
                                                parameterStatusPerParam[param.id] || "created"
                                            ).toLowerCase() === "created",
                                    ).length
                                }
                            />
                        )}
                    </AnimatePresence>
                    <AnimatePresence>
                        {showUnlockDialog && parameterToUnlock && (
                            <UnlockParameterDialog
                                isOpen={showUnlockDialog}
                                isUnlocking={isUnlocking}
                                parameterName={parameterToUnlock.parameterName!}
                                parameterCode={parameterToUnlock.paraCode!}
                                onClose={() => {
                                    setShowUnlockDialog(false);
                                    setParameterToUnlock(null);
                                }}
                                onConfirm={handleConfirmUnlock}
                            />
                        )}
                    </AnimatePresence>

                    <AnimatePresence>
                        {showDeleteDialog && parameterToDelete && (
                            <DeleteParameterDialog
                                isOpen={showDeleteDialog}
                                isDeleting={isDeleting}
                                parameterName={parameterToDelete.parameterName!}
                                parameterCode={parameterToDelete.paraCode!}
                                parameterStatus={
                                    parameterStatusPerParam[parameterToDelete.id] || "created"
                                }
                                onClose={() => {
                                    setShowDeleteDialog(false);
                                    setParameterToDelete(null);
                                }}
                                onConfirm={handleConfirmDelete}
                            />
                        )}
                    </AnimatePresence>
                    {/* Start Analysis Dialog */}
                    <AnimatePresence>
                        {showStartAnalysisDialog && parameterForAnalysis && (
                            <StartAnalysisDialog
                                isOpen={showStartAnalysisDialog}
                                isStarting={isStartingAnalysis}
                                parameterName={parameterForAnalysis.parameterName!}
                                parameterCode={parameterForAnalysis.paraCode!}
                                onClose={() => {
                                    setShowStartAnalysisDialog(false);
                                    setParameterForAnalysis(null);
                                }}
                                onConfirm={handleConfirmStartAnalysis}
                            />
                        )}
                    </AnimatePresence>

                    {/* Complete Analysis Dialog */}
                    <AnimatePresence>
                        {showCompleteAnalysisDialog && parameterForAnalysis && (
                            <CompleteAnalysisDialog
                                isOpen={showCompleteAnalysisDialog}
                                isCompleting={isCompletingAnalysis}
                                parameterName={parameterForAnalysis.parameterName!}
                                parameterCode={parameterForAnalysis.paraCode!}
                                onClose={() => {
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
                                parameterName={parameterForApproval.parameterName!}
                                parameterCode={parameterForApproval.paraCode!}
                                onClose={() => {
                                    setShowApproveDialog(false);
                                    setParameterForApproval(null);
                                }}
                                onConfirm={handleConfirmApprove}
                            />
                        )}
                    </AnimatePresence>

                    <AnimatePresence>
                        {showDisapproveDialog && parameterForApproval && (
                            <DisapproveParameterDialog
                                isOpen={showDisapproveDialog}
                                isDisapproving={isDisapproving}
                                parameterName={parameterForApproval.parameterName!}
                                parameterCode={parameterForApproval.paraCode!}
                                onClose={() => {
                                    setShowDisapproveDialog(false);
                                    setParameterForApproval(null);
                                }}
                                onConfirm={handleConfirmDisapprove}
                            />
                        )}
                    </AnimatePresence>

                    <AnimatePresence>
                        {showRevisionDialog && parameterForApproval && (
                            <RevisionRequestDialog
                                isOpen={showRevisionDialog}
                                isRequesting={isRequestingRevision}
                                parameterName={parameterForApproval.parameterName!}
                                parameterCode={parameterForApproval.paraCode!}
                                onClose={() => {
                                    setShowRevisionDialog(false);
                                    setParameterForApproval(null);
                                    setRevisionComments("");
                                }}
                                onConfirm={(comments: string) => handleConfirmRevision(comments)}
                            />
                        )}
                    </AnimatePresence>

                    {/* QA Revision Dialog */}
                    <AnimatePresence>
                        {showQARevisionDialog && parameterForApproval && (
                            <RevisionRequestDialog
                                isOpen={showQARevisionDialog}
                                isRequesting={isQARequestingRevision}
                                parameterName={parameterForApproval.parameterName!}
                                parameterCode={parameterForApproval.paraCode!}
                                onClose={() => {
                                    setShowQARevisionDialog(false);
                                    setParameterForApproval(null);
                                    setQARevisionComments("");
                                }}
                                onConfirm={(comments: string) =>
                                    handleConfirmQARevision(comments)
                                }
                            />
                        )}
                    </AnimatePresence>

                    <AnimatePresence>
                        {showSubmitForQADialog && (
                            <SubmitForQAReviewDialog
                                isOpen={showSubmitForQADialog}
                                isSubmitting={isSubmittingForQA}
                                worksheetId={worksheetId}
                                totalParameters={addedParameters.length}
                                onClose={() => setShowSubmitForQADialog(false)}
                                onConfirm={handleSubmitForQA}
                            />
                        )}
                    </AnimatePresence>

                    <AnimatePresence>
                        {showApproveWorksheetDialog && (
                            <ApproveWorksheetDialog
                                isOpen={showApproveWorksheetDialog}
                                isApproving={isApprovingWorksheet}
                                worksheetId={worksheetId}
                                totalParameters={addedParameters.length}
                                onClose={() => setShowApproveWorksheetDialog(false)}
                                onConfirm={handleApproveWorksheet}
                            />
                        )}
                    </AnimatePresence>

                    {/* Complete Preparation Dialog */}
                    <AnimatePresence>
                        {showCompletePreparationDialog && paramForPreparation && (
                            <CompletePreparationDialog
                                isOpen={showCompletePreparationDialog}
                                isCompleting={isCompletingPreparation}
                                parameterName={paramForPreparation.parameterName!}
                                parameterCode={paramForPreparation.paraCode!}
                                onClose={() => {
                                    setShowCompletePreparationDialog(false);
                                    setParamForPreparation(null);
                                }}
                                onConfirm={handleConfirmCompletePreparation}
                            />
                        )}
                    </AnimatePresence>

                    {/* Unlock Preparation Dialog */}
                    <AnimatePresence>
                        {showUnlockPreparationDialog && paramForPreparation && (
                            <UnlockPreparationDialog
                                isOpen={showUnlockPreparationDialog}
                                isUnlocking={isUnlockingPreparation}
                                parameterName={paramForPreparation.parameterName!}
                                parameterCode={paramForPreparation.paraCode!}
                                onClose={() => {
                                    setShowUnlockPreparationDialog(false);
                                    setParamForPreparation(null);
                                }}
                                onConfirm={handleConfirmUnlockPreparation}
                            />
                        )}
                    </AnimatePresence>

                    {/* Group Complete Preparation Dialog */}
                    <AnimatePresence>
                        {showCompleteGroupPrepDialog && groupPrepDialogParam && (
                            <CompletePreparationDialog
                                isOpen={showCompleteGroupPrepDialog}
                                isCompleting={isCompletingGroupPrep}
                                parameterName={groupPrepDialogParam.parameterName!}
                                parameterCode={groupPrepDialogParam.paraCode!}
                                onClose={() => {
                                    setShowCompleteGroupPrepDialog(false);
                                    setGroupPrepDialogParam(null);
                                    setGroupPrepDialogKey("");
                                }}
                                onConfirm={handleConfirmCompleteGroupPrep}
                            />
                        )}
                    </AnimatePresence>

                    {/* Group Unlock Preparation Dialog */}
                    <AnimatePresence>
                        {showUnlockGroupPrepDialog && groupPrepDialogParam && (
                            <UnlockPreparationDialog
                                isOpen={showUnlockGroupPrepDialog}
                                isUnlocking={isUnlockingGroupPrep}
                                parameterName={groupPrepDialogParam.parameterName!}
                                parameterCode={groupPrepDialogParam.paraCode!}
                                onClose={() => {
                                    setShowUnlockGroupPrepDialog(false);
                                    setGroupPrepDialogParam(null);
                                    setGroupPrepDialogKey("");
                                }}
                                onConfirm={handleConfirmUnlockGroupPrep}
                            />
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </>
    );
};

export default MicroWorksheet;