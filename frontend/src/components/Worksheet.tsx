import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { type SampleData } from "../preparation_models/SampleData";
import type { Instrument } from "../preparation_models/Instrument";
import type { Standard } from "../preparation_models/Standard";
import type { Chemical } from "../preparation_models/Chemical";
import type { Column } from "../preparation_models/Column";
import type { StandardPreparation } from "../preparation_models/StandardPreparation";
import type { SamplePreparation } from "../preparation_models/SamplePreparation";
import type { StandardPreparationStep } from "../preparation_models/StandardPreparationStep";
import type { SamplePreparationStep } from "../preparation_models/SamplePreparationStep";
import { CgTrash } from "react-icons/cg";
import type { SamplePreparationLod } from "../preparation_models/SamplePreparationLod";
import type { SamplePreparationLodStep } from "../preparation_models/SamplePreparationLodStep";
import type { SamplePreparationSulphatedAsh } from "../preparation_models/SamplePreparationSulphatedAsh";
import type { SamplePreparationSulphatedAshStep } from "../preparation_models/SamplePreparationSulphatedAshStep";
import type { SamplePreparationROI } from "../preparation_models/SamplePreparationROI";
import type { SamplePreparationROIStep } from "../preparation_models/SamplePreparationROIStep";
import type { SamplePreparationDisso } from "../preparation_models/SamplePreparationDisso";
import type { SamplePreparationDissoStep } from "../preparation_models/SamplePreparationDissoStep";
import StandardPreparationDetail from "./sub-components/StandardPreparationDetail";
import SamplePreparationDetail from "./sub-components/SamplePreparationDetail";
import SamplePreparationDissoDetail from "./sub-components/SamplePreparationDissoDetail";
import SamplePreparationLodDetail from "./sub-components/SamplePreparationLodDetail";
import SamplePreparationSulphatedAshDetail from "./sub-components/SamplePreparationSulphatedAshDetail";
import SamplePreparationROIDetail from "./sub-components/SamplePreparationROIDetail";
import StandardSelectionDialog from "./shared/StandardSelectionDialog";
import type { CalculationAssay } from "../preparation_models/CalculationAssay";
import CalculationDetailAssay from "./sub-components/CalculationDetailAssay";
import { BiTestTube } from "react-icons/bi";
import { IoFlask } from "react-icons/io5";
import type { CalculationSulphatedAsh } from "../preparation_models/CalculationSulphatedAsh";
import type { CalculationROI } from "../preparation_models/CalculationROI";
import CalculationDetailROI from "./sub-components/CalculationDetailROI";
import CalculationDetailSulphatedAsh from "./sub-components/CalculationDetailSulphatedAsh";
import type { CalculationLod } from "../preparation_models/CalculationLod";
import CalculationDetailLod from "./sub-components/CalculationDetailLod";
import type { CalculationRS } from "../preparation_models/CalculationRS";
import CalculationDetailRS from "./sub-components/CalculationDetailRS";
import type { CalculationDisso } from "../preparation_models/CalculationDisso";
import CalculationDetailDisso from "./sub-components/CalculationDetailDisso";
import AnalystSelectionDialog from "./shared/AnalystSelectionDialog";
import {
  fetchWorksheetById,
  updateWorksheet,
  updateParameter,
  fetchSample,
  fetchAnalysts,
  deleteParameter,
  submitWorksheet,
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
import StartAnalysisDialog from "./shared/StartAnalysisDialog";
import { BsPlayFill } from "react-icons/bs";
import ApproveParameterDialog from "./shared/ApproveParameterDialog";
import DisapproveParameterDialog from "./shared/DisapproveParameterDialog";
import RevisionRequestDialog from "./shared/RevisionRequestDialog";
import ApproveWorksheetDialog from "./shared/ApproveWorksheetDialog";
import Toast from "./shared/Toast";
import { WorksheetDbMapper } from "../helpers/WorksheetDbMapper";
import { MdDone } from "react-icons/md";
import { useNavigate } from "react-router-dom";

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
  standards: Standard[];
  chemicals: Chemical[];
  columns: Column[];
  isReferenceDataLoading: boolean;
  referenceDataError: string | null;
  employeeId: string;
  role: string;
  onPrint?: (
    info: WorksheetDetail, 
    analysts: Analyst[],
    instruments: Instrument[], 
    chemicals: Chemical[], 
    standards: Standard[]
  ) => void;
}

// Factory functions for creating new preparation objects
const createNewCalculationDisso = (index: number): CalculationDisso => ({
  id: Date.now() + index,
  label: `Calculation ${index + 1}`,
  selectedStandardPrepLabel: null,
  selectedSamplePrepLabel: null,
  areaOfSample: "",
  areaOfStandard: "",
  mwBase: "",
  mwSalt: "",
  purity: "",
  calculationResult: null,
  calculationResultUnit: null,
});

const createNewCalculationAssay = (index: number): CalculationAssay => ({
  id: Date.now() + index,
  label: `Calculation ${index + 1}`,
  selectedStandardPrepLabel: null,
  selectedSamplePrepLabel: null,
  calculationFor: "",
  areaOfSample: "",
  areaOfStandard: "",
  avgWeight: "",
  mwSalt: "",
  mwBase: "",
  claim: "",
  labelClaim: "",
  lodWaterType: "",
  lodWaterValue: "",
  calculationResult: null,
  labelClaimPercent: null,
  lodWaterBasisResult: null,
  purity: "",
  avgWeightUnit: "",
  avgContent: "",
  avgContentUnit: "",
  sampleVol: "",
  sampleVolUnit: "",
  claimUnit: "",
  calculationResultUnit: null,
});

const createNewCalculationLod = (index: number): CalculationLod => ({
  id: Date.now() + index,
  label: `Calculation ${index + 1}`,
  selectedSamplePrepLabel: null,
  w1_emptyDish: "",
  w2_dishWithSample: "",
  w3_dishAfterIgnition: "",
  calculationResult: null,
  calculationResultUnit: null,
});

const createNewCalculationROI = (index: number): CalculationROI => ({
  id: Date.now() + index,
  label: `Calculation ${index + 1}`,
  selectedSamplePrepLabel: null,
  w1_emptyDish: "",
  w2_dishWithSample: "",
  w3_dishAfterIgnition: "",
  calculationResult: null,
  calculationResultUnit: null,
});

const createNewCalculationSulphatedAsh = (
  index: number
): CalculationSulphatedAsh => ({
  id: Date.now() + index,
  label: `Calculation ${index + 1}`,
  selectedSamplePrepLabel: null,
  w1_emptyCrucible: "",
  w2_crucibleWithSample: "",
  w3_crucibleAfterAsh: "",
  calculationResult: null,
  calculationResultUnit: null,
});

const createNewStandardPreparation = (index: number): StandardPreparation => ({
  id: Date.now() + index,
  label: `Standard Preparation ${index + 1}`,
  assignedStandardId: null,
  steps: [
    {
      name: "Weighing",
      value1: "",
      unit1: "g",
      logBookID: "",
      solventChemical: "",
    },
    { name: "1st Dilution", value1: "", unit1: "ml", value2: "", unit2: "ml" },
    { name: "2nd Dilution", value1: "", unit1: "ml", value2: "", unit2: "ml" },
    { name: "3rd Dilution", value1: "", unit1: "ml", value2: "", unit2: "ml" },
    { name: "4th Dilution", value1: "", unit1: "ml", value2: "", unit2: "ml" },
    { name: "Filtration", value1: "", unit1: "micron" },
  ],
});

const createNewSamplePreparation = (index: number): SamplePreparation => ({
  id: Date.now() + index,
  label: `Sample Preparation ${index + 1}`,
  steps: [
    {
      name: "Weighing",
      value1: "",
      unit1: "g",
      logBookID: "",
      solventChemical: "",
    },
    { name: "1st Dilution", value1: "", unit1: "ml", value2: "", unit2: "ml" },
    { name: "2nd Dilution", value1: "", unit1: "ml", value2: "", unit2: "ml" },
    { name: "3rd Dilution", value1: "", unit1: "ml", value2: "", unit2: "ml" },
    { name: "4th Dilution", value1: "", unit1: "ml", value2: "", unit2: "ml" },
    { name: "Filtration", value1: "", unit1: "micron" },
  ],
});

const createNewSamplePreparationLod = (
  index: number
): SamplePreparationLod => ({
  id: Date.now() + index,
  label: `Sample Preparation ${index + 1}`,
  steps: [
    { name: "Weighing (Empty Bottle)", value1: "", unit1: "g", logBookID: "" },
    { name: "Weighing (Before Drying)", value1: "", unit1: "g", logBookID: "" },
    {
      name: "Drying",
      value1: "",
      unit1: "°C",
      value2: "",
      unit2: "min",
      logBookID: "",
    },
    { name: "Weighing (After Drying)", value1: "", unit1: "g", logBookID: "" },
  ],
});

const createNewSamplePreparationSulphatedAsh = (
  index: number
): SamplePreparationSulphatedAsh => ({
  id: Date.now() + index,
  label: `Sample Preparation ${index + 1}`,
  steps: [
    {
      name: "Weighing (Empty Crucible)",
      value1: "",
      unit1: "g",
      logBookID: "",
    },
    { name: "Weighing (Before Drying)", value1: "", unit1: "g", logBookID: "" },
    {
      name: "Drying",
      value1: "",
      unit1: "°C",
      value2: "",
      unit2: "min",
      logBookID: "",
    },
    { name: "Weighing (After Drying)", value1: "", unit1: "g", logBookID: "" },
  ],
});

const createNewSamplePreparationROI = (
  index: number
): SamplePreparationROI => ({
  id: Date.now() + index,
  label: `Sample Preparation ${index + 1}`,
  steps: [
    {
      name: "Weighing (Empty Crucible)",
      value1: "",
      unit1: "g",
      logBookID: "",
    },
    { name: "Weighing (Before Drying)", value1: "", unit1: "g", logBookID: "" },
    {
      name: "Drying",
      value1: "",
      unit1: "°C",
      value2: "",
      unit2: "min",
      logBookID: "",
    },
    { name: "Weighing (After Drying)", value1: "", unit1: "g", logBookID: "" },
  ],
});

const createNewSamplePreparationDisso = (
  index: number
): SamplePreparationDisso => ({
  id: Date.now() + index,
  label: `Sample Preparation ${index + 1}`,
  assignedStandardId: null,
  steps: [
    {
      name: "Instrument Details",
      id: "",
      value1: "",
      unit1: "rpm",
      value2: "",
      unit2: "°C",
    },
    {
      name: "Tablet Details",
      value1: "",
      unit1: "mg",
      value2: "",
      unit2: "g",
      value3: "",
      unit3: "min",
    },
    { name: "1st Dilution", value1: "", unit1: "ml", value2: "", unit2: "ml" },
    { name: "2nd Dilution", value1: "", unit1: "ml", value2: "", unit2: "ml" },
    { name: "3rd Dilution", value1: "", unit1: "ml", value2: "", unit2: "ml" },
    { name: "Filtration", value1: "", unit1: "micron" },
  ],
});

const createNewCalculationRS = (index: number): CalculationRS => ({
  id: Date.now() + index,
  label: `Calculation ${index + 1}`,
  selectedStandardPrepLabel: null,
  selectedSamplePrepLabel: null,
  areaOfSample: "",
  areaOfStandard: "",
  purity: "",
  calculationResult: null,
  calculationResultUnit: null,
});

const PREPARATION_GROUPS = {
  assay: { id: "assay", label: "Preparations for Assay", color: "red" },
  lod: { id: "lod", label: "Preparations for LOD", color: "sky" },
  roi: { id: "roi", label: "Preparations for ROI", color: "orange" },
  sulphatedAsh: {
    id: "sulphatedAsh",
    label: "Preparations for Sulphated Ash",
    color: "rose",
  },
  residualSolvent: {
    id: "residualSolvent",
    label: "Preparations for Residual Solvent",
    color: "indigo",
  },
  dissolution: {
    id: "dissolution",
    label: "Preparations for Dissolution",
    color: "emerald",
  },
} as const;

const Worksheet: React.FC<WorksheetProps> = ({
  worksheetId,
  instruments = [],
  chemicals = [],
  standards = [],
  isReferenceDataLoading = false,
  referenceDataError = null,
  employeeId,
  role,
  onPrint,
}) => {
  // Core state
  const [paramIdx, setParamIdx] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [registrationNo, setRegistrationNo] = useState("");
  const [worksheetInfo, setWorksheetInfo] = useState<WorksheetDetail | null>(
    null
  );
  const [samplesData, setSamplesData] = useState<SampleData[]>([]);
  const [addedParameters, setAddedParameters] = useState<ParameterDetail[]>([]);
  const [showParameterDropdown, setShowParameterDropdown] = useState(false);
  const [selectedParamsForDetail, setSelectedParamsForDetail] = useState<
    number[]
  >([]);

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

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

  // Per-parameter state
  const [columnsPerParam, setColumnsPerParam] = useState<
    Record<number, string>
  >({});
  const [calculationsAssayPerParam, setCalculationsAssayPerParam] = useState<
    Record<number, CalculationAssay[]>
  >({});
  const [standardPreparationPerParam, setStandardPreparationPerParam] =
    useState<Record<number, StandardPreparation[]>>({});
  const [samplePreparationPerParam, setSamplePreparationPerParam] = useState<
    Record<number, SamplePreparation[]>
  >({});
  const [samplePreparationLodPerParam, setSamplePreparationLodPerParam] =
    useState<Record<number, SamplePreparationLod[]>>({});
  const [
    samplePreparationSulphatedAshPerParam,
    setSamplePreparationSulphatedAshPerParam,
  ] = useState<Record<number, SamplePreparationSulphatedAsh[]>>({});
  const [samplePreparationROIPerParam, setSamplePreparationROIPerParam] =
    useState<Record<number, SamplePreparationROI[]>>({});
  const [samplePreparationDissoPerParam, setSamplePreparationDissoPerParam] =
    useState<Record<number, SamplePreparationDisso[]>>({});
  const [addedInstruments, setAddedInstruments] = useState<
    Record<number, Instrument[]>
  >({});
  const [addedChemicals, setAddedChemicals] = useState<
    Record<number, Chemical[]>
  >({});
  const [addedStandards, setAddedStandards] = useState<
    Record<number, Standard[]>
  >({});
  // Per-parameter id caches (string ids trimmed) to resolve when parent refs arrive
  const [addedInstrumentIdsPerParam, setAddedInstrumentIdsPerParam] = useState<
    Record<number, string[]>
  >({});
  const [addedChemicalIdsPerParam, setAddedChemicalIdsPerParam] = useState<
    Record<number, string[]>
  >({});
  const [addedStandardIdsPerParam, setAddedStandardIdsPerParam] = useState<
    Record<number, string[]>
  >({});
  const [otherInfoPerParam, setOtherInfoPerParam] = useState<
    Record<number, string>
  >({});
  const [diluentPerParam, setDiluentPerParam] = useState<
    Record<number, string>
  >({});
  const [analysisStartDatePerParam, setAnalysisStartDatePerParam] = useState<
    Record<number, string>
  >({});
  const [analysisCompletionDatePerParam, setAnalysisCompletionDatePerParam] =
    useState<Record<number, string>>({});
  const [analyzedByPerParam, setAnalyzedByPerParam] = useState<
    Record<number, string>
  >({});
  const [approvedByPerParam, setApprovedByPerParam] = useState<
    Record<number, string>
  >({});
  const [approvedAtPerParam, setApprovedAtPerParam] = useState<
    Record<number, string>
  >({});
  const [parameterStatusPerParam, setParameterStatusPerParam] = useState<
    Record<number, string>
  >({});
  const [
    standardPreparationDissoPerParam,
    setStandardPreparationDissoPerParam,
  ] = useState<Record<number, StandardPreparation[]>>({});
  const [showPreparationDropdown, setShowPreparationDropdown] = useState<
    Record<number, boolean>
  >({});
  const [activePreparationGroups, setActivePreparationGroups] = useState<
    Record<number, string[]>
  >({});
  const [calculationsLodPerParam, setCalculationsLodPerParam] = useState<
    Record<number, CalculationLod[]>
  >({});
  const [calculationsROIPerParam, setCalculationsROIPerParam] = useState<
    Record<number, CalculationROI[]>
  >({});
  const [
    calculationsSulphatedAshPerParam,
    setCalculationsSulphatedAshPerParam,
  ] = useState<Record<number, CalculationSulphatedAsh[]>>({});
  const [standardPreparationRSPerParam, setStandardPreparationRSPerParam] =
    useState<Record<number, StandardPreparation[]>>({});
  const [samplePreparationRSPerParam, setSamplePreparationRSPerParam] =
    useState<Record<number, SamplePreparation[]>>({});
  const [calculationsRSPerParam, setCalculationsRSPerParam] = useState<
    Record<number, CalculationRS[]>
  >({});
  const [calculationsDissoPerParam, setCalculationsDissoPerParam] = useState<
    Record<number, CalculationDisso[]>
  >({});
  const [isAddingRSStandard, setIsAddingRSStandard] = useState(false);
  const [isAddingDissoStandard, setIsAddingDissoStandard] = useState(false);

  // Dropdown control states
  const [showInstrumentDropdown, setShowInstrumentDropdown] = useState(false);
  const [showChemicalDropdown, setShowChemicalDropdown] = useState(false);
  const [showStandardDropdown, setShowStandardDropdown] = useState(false);

  // Search states
  const [instrumentSearch, setInstrumentSearch] = useState("");
  const [chemicalSearch, setChemicalSearch] = useState("");
  const [standardSearch, setStandardSearch] = useState("");

  // Dialog state
  const [showStandardSelectionDialog, setShowStandardSelectionDialog] =
    useState(false);
  const [currentParameterForStandardPrep, setCurrentParameterForStandardPrep] =
    useState<number | null>(null);

  // Refs for click outside detection
  const instrumentRef = useRef<HTMLDivElement>(null);
  const chemicalRef = useRef<HTMLDivElement>(null);
  const standardRef = useRef<HTMLDivElement>(null);
  const preparationDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    reloadWorksheet();
  }, [worksheetId]);

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
      standardRef.current &&
      !standardRef.current.contains(event.target as Node)
    ) {
      setShowStandardDropdown(false);
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
    [role, parameterStatusPerParam]
  );

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [handleClickOutside]);

  useEffect(() => {
    const fetchAllAnalysts = async () => {
      try {
        const analysts = await fetchAnalysts();

        setAnalysts(analysts);
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
          requestData
        );

        if (!worksheetData) {
          setError("Worksheet not found");
          setIsLoading(false);
          return;
        }

        setWorksheetInfo(worksheetData);
        setRegistrationNo(worksheetData.sample.registrationNo);

        const samples = await fetchSample(worksheetData.sample.registrationNo);
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
    const { parameters } = worksheetData;

    const restoredParams = parameters.map((param, index) => {
      const matchingParameter = parameters.find(
        (s) => s.paraCode === param.paraCode
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
        approvedBy: param.approvedBy,
        approvedAt: param.approvedAt,

        ...(matchingParameter || {}),
      };
    });

    setAddedParameters(restoredParams as any);

    // Helper function to safely parse JSON
    const safeJSONParse = (data: any, fallback: any = []) => {
      if (!data) return fallback;
      if (typeof data === "string") {
        try {
          return JSON.parse(data);
        } catch (e) {
          console.error("JSON Parse Error:", e);
          return fallback;
        }
      }
      return data;
    };

    parameters.forEach((param, idx) => {
      const paramId = restoredParams[idx].id;

      if (param.columnId) {
        setColumnsPerParam((prev) => ({ ...prev, [paramId]: param.columnId! }));
      }

      if (param.diluentPreparation) {
        setDiluentPerParam((prev) => ({
          ...prev,
          [paramId]: param.diluentPreparation!,
        }));
      }

      if (param.otherInfo) {
        setOtherInfoPerParam((prev) => ({
          ...prev,
          [paramId]: param.otherInfo!,
        }));
      }

      if (param.analyzedBy) {
        setAnalyzedByPerParam((prev) => ({
          ...prev,
          [paramId]: param.analyzedBy!,
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

      if (param.approvedBy) {
        setApprovedByPerParam((prev) => ({
          ...prev,
          [paramId]: param.approvedBy!,
        }));
      }

      if (param.approvedAt) {
        setApprovedAtPerParam((prev) => ({
          ...prev,
          [paramId]: param.approvedAt!,
        }));
      }

      // ========== INSTRUMENTS ==========
      if (param.instrumentIds && Array.isArray(param.instrumentIds)) {
        const validInstrumentIds = param.instrumentIds
          .filter((id: any) => id != null)
          .map((id: any) => String(id).trim());
        if (validInstrumentIds.length > 0) {
          setAddedInstrumentIdsPerParam((prev) => ({
            ...prev,
            [paramId]: validInstrumentIds,
          }));

          if (instruments && instruments.length) {
            const paramInstruments = instruments.filter((inst) =>
              validInstrumentIds.includes(String(inst.id).trim())
            );
            setAddedInstruments((prev) => ({
              ...prev,
              [paramId]: paramInstruments,
            }));
          }
        }
      }

      // ========== CHEMICALS ==========
      if (param.chemicalIds && Array.isArray(param.chemicalIds)) {
        const validChemicalIds = param.chemicalIds
          .filter((id: any) => id != null)
          .map((id: any) => String(id).trim());
        if (validChemicalIds.length > 0) {
          setAddedChemicalIdsPerParam((prev) => ({
            ...prev,
            [paramId]: validChemicalIds,
          }));

          if (chemicals && chemicals.length) {
            const paramChemicals = chemicals.filter((chem) =>
              validChemicalIds.includes(String(chem.id).trim())
            );
            setAddedChemicals((prev) => ({
              ...prev,
              [paramId]: paramChemicals,
            }));
          }
        }
      }

      // ========== STANDARDS ==========
      if (param.standardIds && Array.isArray(param.standardIds)) {
        const validStandardIds = param.standardIds
          .filter((id: any) => id != null)
          .map((id: any) => String(id).trim());
        if (validStandardIds.length > 0) {
          setAddedStandardIdsPerParam((prev) => ({
            ...prev,
            [paramId]: validStandardIds,
          }));

          if (standards && standards.length) {
            const paramStandards = standards.filter((std) =>
              validStandardIds.includes(String(std.id).trim())
            );
            setAddedStandards((prev) => ({
              ...prev,
              [paramId]: paramStandards,
            }));
          }
        }
      }

      // ========== STANDARD PREPARATIONS (UNIFIED WITH TYPES) ==========
      if (
        param.standardPreparations &&
        Array.isArray(param.standardPreparations) &&
        param.standardPreparations.length > 0
      ) {
        const assayStdPreps: any[] = [];
        const rsStdPreps: any[] = [];
        const dissoStdPreps: any[] = [];

        param.standardPreparations.forEach((prep: any, i: number) => {
          const parsedSteps = safeJSONParse(prep.steps, []);
          const prepType = prep.preparationType || "assay";

          const newPrep = {
            id: Date.now() + i + 1000 + Math.random() * 1000,
            label: prep.label || `Standard Preparation ${i + 1}`,
            steps: parsedSteps,
            assignedStandardId: prep.assignedStandardId || null,
          };

          // Route based on preparationType
          switch (prepType) {
            case "residual_solvent":
              rsStdPreps.push(newPrep);
              break;
            case "dissolution":
              dissoStdPreps.push(newPrep);
              break;
            case "assay":
            default:
              assayStdPreps.push(newPrep);
              break;
          }
        });

        if (assayStdPreps.length > 0) {
          setStandardPreparationPerParam((prev) => ({
            ...prev,
            [paramId]: assayStdPreps,
          }));
        }

        if (rsStdPreps.length > 0) {
          setStandardPreparationRSPerParam((prev) => ({
            ...prev,
            [paramId]: rsStdPreps,
          }));
        }

        if (dissoStdPreps.length > 0) {
          setStandardPreparationDissoPerParam((prev) => ({
            ...prev,
            [paramId]: dissoStdPreps,
          }));
        }
      }

      // ========== SAMPLE PREPARATIONS (UNIFIED WITH TYPES) ==========
      if (
        param.samplePreparations &&
        Array.isArray(param.samplePreparations) &&
        param.samplePreparations.length > 0
      ) {
        // Arrays to collect preparations by type
        const assaySplPreps: any[] = [];
        const lodSplPreps: any[] = [];
        const roiSplPreps: any[] = [];
        const ashSplPreps: any[] = [];
        const rsSplPreps: any[] = [];
        const dissoSplPreps: any[] = [];

        param.samplePreparations.forEach((prep: any, i: number) => {
          const parsedSteps = safeJSONParse(prep.steps, []);
          const prepType = prep.preparationType || "assay";

          const newPrep = {
            id: Date.now() + i + 2000 + Math.random() * 1000,
            label: prep.label || `Sample Preparation ${i + 1}`,
            steps: parsedSteps,
            assignedStandardId: prep.assignedStandardId || null,
          };

          // Route to correct array based on preparationType
          switch (prepType) {
            case "lod":
              lodSplPreps.push(newPrep);
              break;
            case "roi":
              roiSplPreps.push(newPrep);
              break;
            case "sulphated_ash":
              ashSplPreps.push(newPrep);
              break;
            case "dissolution":
              dissoSplPreps.push(newPrep);
              break;
            case "residual_solvent":
              rsSplPreps.push(newPrep);
              break;
            case "assay":
            default:
              assaySplPreps.push(newPrep);
              break;
          }
        });

        // Set state for each type
        if (assaySplPreps.length > 0) {
          setSamplePreparationPerParam((prev) => ({
            ...prev,
            [paramId]: assaySplPreps,
          }));
        }

        if (lodSplPreps.length > 0) {
          setSamplePreparationLodPerParam((prev) => ({
            ...prev,
            [paramId]: lodSplPreps,
          }));
        }

        if (roiSplPreps.length > 0) {
          setSamplePreparationROIPerParam((prev) => ({
            ...prev,
            [paramId]: roiSplPreps,
          }));
        }

        if (ashSplPreps.length > 0) {
          setSamplePreparationSulphatedAshPerParam((prev) => ({
            ...prev,
            [paramId]: ashSplPreps,
          }));
        }

        if (rsSplPreps.length > 0) {
          setSamplePreparationRSPerParam((prev) => ({
            ...prev,
            [paramId]: rsSplPreps,
          }));
        }

        if (dissoSplPreps.length > 0) {
          setSamplePreparationDissoPerParam((prev) => ({
            ...prev,
            [paramId]: dissoSplPreps,
          }));
        }
      }

      const prepLabelMapping: Record<string, number> = {};

      // Map standard preparations
      if (
        param.standardPreparations &&
        Array.isArray(param.standardPreparations)
      ) {
        param.standardPreparations.forEach((prep: any, i: number) => {
          if (prep.label) {
            prepLabelMapping[prep.label] =
              Date.now() + i + 1000 + Math.random() * 1000;
          }
        });
      }

      // Map sample preparations
      if (param.samplePreparations && Array.isArray(param.samplePreparations)) {
        param.samplePreparations.forEach((prep: any, i: number) => {
          if (prep.label) {
            prepLabelMapping[prep.label] =
              Date.now() + i + 2000 + Math.random() * 1000;
          }
        });
      }

      if (param.calculations && Array.isArray(param.calculations)) {
        const restoredCalculations = {
          assay: [] as any[],
          lod: [] as any[],
          roi: [] as any[],
          sulphatedAsh: [] as any[],
          residualSolvent: [] as any[],
          dissolution: [] as any[],
        };

        param.calculations.forEach((calc: any, i: number) => {
          try {
            const parsedData =
              typeof calc.data === "string" ? JSON.parse(calc.data) : calc.data;
            const calcType = calc.calculationType || "assay";

            // Get preparation labels for linking
            const stdLabel = parsedData.selectedStandardPrepLabel;
            const splLabel = parsedData.selectedSamplePrepLabel;

            const baseId = Date.now() + paramId * 10000 + i;

            // Route based on calculationType
            switch (calcType) {
              case "assay":
                const assayCalc = {
                  id: baseId + 3000,
                  label: parsedData.label || calc.label,
                  selectedStandardPrepLabel: stdLabel,
                  selectedSamplePrepLabel: splLabel,
                  calculationFor: parsedData.calculationFor || "",
                  areaOfSample: parsedData.areaOfSample || "",
                  areaOfStandard: parsedData.areaOfStandard || "",
                  avgWeight: parsedData.avgWeight || "",
                  avgWeightUnit: parsedData.avgWeightUnit || "",
                  avgContent: parsedData.avgContent || "",
                  avgContentUnit: parsedData.avgContentUnit || "",
                  sampleVol: parsedData.sampleVol || "",
                  sampleVolUnit: parsedData.sampleVolUnit || "",
                  mwSalt: parsedData.mwSalt || "",
                  mwBase: parsedData.mwBase || "",
                  claim: parsedData.claim || "",
                  claimUnit: parsedData.claimUnit || "",
                  labelClaim: parsedData.labelClaim || "",
                  lodwaterType: parsedData.lodwaterType || "",
                  lodwaterValue: parsedData.lodwaterValue || "",
                  calculationResult: parsedData.calculationResult || "",
                  calculationResultUnit: parsedData.calculationResultUnit || "",
                  labelClaimPercent: parsedData.labelClaimPercent || "",
                  lodWaterBasisResult: parsedData.lodWaterBasisResult || "",
                };
                restoredCalculations.assay.push(assayCalc);
                break;

              case "lod":
                const lodCalc = {
                  id: baseId + 4000,
                  label: parsedData.label || calc.label,
                  selectedSamplePrepLabel: splLabel,
                  w1_emptyDish: parsedData.w1_emptyDish || "",
                  w2_dishWithSample: parsedData.w2_dishWithSample || "",
                  w3_dishAfterIgnition: parsedData.w3_dishAfterIgnition || "",
                  calculationResult: parsedData.calculationResult || "",
                  calculationResultUnit: parsedData.calculationResultUnit || "",
                };
                restoredCalculations.lod.push(lodCalc);
                break;

              case "roi":
                const roiCalc = {
                  id: baseId + 5000,
                  label: parsedData.label || calc.label,
                  selectedSamplePrepLabel: splLabel,
                  w1_emptyDish: parsedData.w1_emptyDish || "",
                  w2_dishWithSample: parsedData.w2_dishWithSample || "",
                  w3_dishAfterIgnition: parsedData.w3_dishAfterIgnition || "",
                  calculationResult: parsedData.calculationResult || "",
                  calculationResultUnit: parsedData.calculationResultUnit || "",
                };
                restoredCalculations.roi.push(roiCalc);
                break;

              case "sulphated_ash":
                const ashCalc = {
                  id: baseId + 6000,
                  label: parsedData.label || calc.label,
                  selectedSamplePrepLabel: splLabel,
                  w1_emptyCrucible: parsedData.w1_emptyCrucible || "",
                  w2_crucibleWithSample: parsedData.w2_crucibleWithSample || "",
                  w3_crucibleAfterAsh: parsedData.w3_crucibleAfterAsh || "",
                  calculationResult: parsedData.calculationResult || "",
                  calculationResultUnit: parsedData.calculationResultUnit || "",
                };
                restoredCalculations.sulphatedAsh.push(ashCalc);
                break;

              case "residual_solvent":
                const rsCalc = {
                  id: baseId + 7000,
                  label: parsedData.label || calc.label,
                  selectedStandardPrepLabel: stdLabel,
                  selectedSamplePrepLabel: splLabel,
                  areaOfSample: parsedData.areaOfSample || "",
                  areaOfStandard: parsedData.areaOfStandard || "",
                  purity: parsedData.purity || "",
                  calculationResult: parsedData.calculationResult || "",
                  calculationResultUnit: parsedData.calculationResultUnit || "",
                };
                restoredCalculations.residualSolvent.push(rsCalc);
                break;

              case "dissolution":
                const dissoCalc = {
                  id: baseId + 8000,
                  label: parsedData.label || calc.label,
                  selectedStandardPrepLabel: stdLabel,
                  selectedSamplePrepLabel: splLabel,
                  areaOfSample: parsedData.areaOfSample || "",
                  areaOfStandard: parsedData.areaOfStandard || "",
                  mwBase: parsedData.mwBase || "",
                  mwSalt: parsedData.mwSalt || "",
                  purity: parsedData.purity || "",
                  calculationResult: parsedData.calculationResult || "",
                  calculationResultUnit: parsedData.calculationResultUnit || "",
                };
                restoredCalculations.dissolution.push(dissoCalc);
                break;
            }
          } catch (e) {
            console.error(`Error parsing calculation ${i + 1}:`, e);
          }
        });

        if (restoredCalculations.assay.length > 0) {
          setCalculationsAssayPerParam((prev) => ({
            ...prev,
            [paramId]: restoredCalculations.assay,
          }));
        }

        if (restoredCalculations.lod.length > 0) {
          setCalculationsLodPerParam((prev) => ({
            ...prev,
            [paramId]: restoredCalculations.lod,
          }));
        }

        if (restoredCalculations.roi.length > 0) {
          setCalculationsROIPerParam((prev) => ({
            ...prev,
            [paramId]: restoredCalculations.roi,
          }));
        }

        if (restoredCalculations.sulphatedAsh.length > 0) {
          setCalculationsSulphatedAshPerParam((prev) => ({
            ...prev,
            [paramId]: restoredCalculations.sulphatedAsh,
          }));
        }

        if (restoredCalculations.residualSolvent.length > 0) {
          setCalculationsRSPerParam((prev) => ({
            ...prev,
            [paramId]: restoredCalculations.residualSolvent,
          }));
        }

        if (restoredCalculations.dissolution.length > 0) {
          setCalculationsDissoPerParam((prev) => ({
            ...prev,
            [paramId]: restoredCalculations.dissolution,
          }));
        }
      }

      const activeGroups: string[] = [];

      // Check for assay preparations
      if (
        (param.standardPreparations?.filter(
          (p: any) => !p.preparationType || p.preparationType === "assay"
        ).length || 0) > 0 ||
        (param.samplePreparations?.filter(
          (p: any) => !p.preparationType || p.preparationType === "assay"
        ).length || 0) > 0
      ) {
        activeGroups.push("assay");
      }

      // Check for LOD preparations
      if (
        (param.samplePreparations?.filter(
          (p: any) => p.preparationType === "lod"
        ).length || 0) > 0
      ) {
        activeGroups.push("lod");
      }

      // Check for ROI preparations
      if (
        (param.samplePreparations?.filter(
          (p: any) => p.preparationType === "roi"
        ).length || 0) > 0
      ) {
        activeGroups.push("roi");
      }

      // Check for Sulphated Ash preparations
      if (
        (param.samplePreparations?.filter(
          (p: any) => p.preparationType === "sulphated_ash"
        ).length || 0) > 0
      ) {
        activeGroups.push("sulphatedAsh");
      }

      // Check for Residual Solvent preparations
      if (
        (param.standardPreparations?.filter(
          (p: any) => p.preparationType === "residual_solvent"
        ).length || 0) > 0 ||
        (param.samplePreparations?.filter(
          (p: any) => p.preparationType === "residual_solvent"
        ).length || 0) > 0
      ) {
        activeGroups.push("residualSolvent");
      }

      // Check for Dissolution preparations
      if (
        (param.standardPreparations?.filter(
          (p: any) => p.preparationType === "dissolution"
        ).length || 0) > 0 ||
        (param.samplePreparations?.filter(
          (p: any) => p.preparationType === "dissolution"
        ).length || 0) > 0
      ) {
        activeGroups.push("dissolution");
      }

      if (activeGroups.length > 0) {
        setActivePreparationGroups((prev) => ({
          ...prev,
          [paramId]: activeGroups,
        }));
      }
    });

    // Auto-expand all parameters for viewing
    setSelectedParamsForDetail(restoredParams.map((p) => p.id));
  };

  // Resolve per-parameter cached ids to full objects when parent lists become available
  useEffect(() => {
    if (!instruments || !Object.keys(addedInstrumentIdsPerParam).length) return;
    Object.entries(addedInstrumentIdsPerParam).forEach(([paramId, idList]) => {
      const ids = Array.isArray(idList)
        ? idList.map(String).map((s) => s.trim())
        : [];
      const matched = instruments.filter((inst) =>
        ids.includes(String(inst.id).trim())
      );
      setAddedInstruments((prev) => ({ ...prev, [Number(paramId)]: matched }));
    });
  }, [instruments, addedInstrumentIdsPerParam]);

  useEffect(() => {
    if (!chemicals || !Object.keys(addedChemicalIdsPerParam).length) return;
    Object.entries(addedChemicalIdsPerParam).forEach(([paramId, idList]) => {
      const ids = Array.isArray(idList)
        ? idList.map(String).map((s) => s.trim())
        : [];
      const matched = chemicals.filter((chem) =>
        ids.includes(String(chem.id).trim())
      );
      setAddedChemicals((prev) => ({ ...prev, [Number(paramId)]: matched }));
    });
  }, [chemicals, addedChemicalIdsPerParam]);

  useEffect(() => {
    if (!standards || !Object.keys(addedStandardIdsPerParam).length) return;
    Object.entries(addedStandardIdsPerParam).forEach(([paramId, idList]) => {
      const ids = Array.isArray(idList)
        ? idList.map(String).map((s) => s.trim())
        : [];
      const matched = standards.filter((std) =>
        ids.includes(String(std.id).trim())
      );
      setAddedStandards((prev) => ({ ...prev, [Number(paramId)]: matched }));
    });
  }, [standards, addedStandardIdsPerParam]);

  // Resolve worksheet-level id arrays (if any) to full objects when parent refs arrive
  useEffect(() => {
    if (!instruments) return;
  }, [instruments]);

  useEffect(() => {
    if (!chemicals) return;
  }, [chemicals]);

  useEffect(() => {
    if (!standards) return;
  }, [standards]);

  const collectFormDataForAPI = (): WorksheetRequest => {
    return {
      role: role,
      worksheetId: worksheetId,
      registrationInfo: {
        registrationNo:
          worksheetInfo?.sample.registrationNo || registrationNo,
        sampleName: worksheetInfo?.sample?.sampleName!,
        numberOfParameters: addedParameters.length!,
        dueDate: worksheetInfo?.sample?.dueDate!,
      },
      documentInfo: {
        preparedBy: employeeId,
        status: worksheetInfo?.sample.status,
        approvedAt: worksheetInfo?.sample?.approvedAt || null,
      },
      parameters: addedParameters.map((param) => {
        const standardPreparations = [
          ...(standardPreparationPerParam[param.id] || []).map((sp) => ({
            label: sp.label,
            preparationType: "assay",
            assignedStandardId: (sp as any).assignedStandardId || "",
            steps: JSON.stringify(sp.steps),
          })),
          ...(standardPreparationRSPerParam[param.id] || []).map((sp) => ({
            label: sp.label,
            preparationType: "residual_solvent",
            assignedStandardId: (sp as any).assignedStandardId || "",
            steps: JSON.stringify(sp.steps),
          })),
          ...(standardPreparationDissoPerParam[param.id] || []).map((sp) => ({
            label: sp.label,
            preparationType: "dissolution",
            assignedStandardId: (sp as any).assignedStandardId || "",
            steps: JSON.stringify(sp.steps),
          })),
        ];

        // Collect all sample preparations with their types
        const samplePreparations = [
          ...(samplePreparationPerParam[param.id] || []).map((sp) => ({
            label: sp.label,
            preparationType: "assay",
            assignedStandardId: (sp as any).assignedStandardId || "",
            steps: JSON.stringify(sp.steps),
          })),
          ...(samplePreparationLodPerParam[param.id] || []).map((spl) => ({
            label: spl.label,
            preparationType: "lod",
            assignedStandardId: "",
            steps: JSON.stringify(spl.steps),
          })),
          ...(samplePreparationROIPerParam[param.id] || []).map((spl) => ({
            label: spl.label,
            preparationType: "roi",
            assignedStandardId: "",
            steps: JSON.stringify(spl.steps),
          })),
          ...(samplePreparationSulphatedAshPerParam[param.id] || []).map(
            (sps) => ({
              label: sps.label,
              preparationType: "sulphated_ash",
              assignedStandardId: "",
              steps: JSON.stringify(sps.steps),
            })
          ),
          ...(samplePreparationRSPerParam[param.id] || []).map((sp) => ({
            label: sp.label,
            preparationType: "residual_solvent",
            assignedStandardId: (sp as any).assignedStandardId || "",
            steps: JSON.stringify(sp.steps),
          })),
          ...(samplePreparationDissoPerParam[param.id] || []).map((spd) => ({
            label: spd.label,
            preparationType: "dissolution",
            assignedStandardId: (spd as any).assignedStandardId || "",
            steps: JSON.stringify(spd.steps),
          })),
        ];

        // Collect all calculations with their types
        const calculations = [
          ...(calculationsAssayPerParam[param.id] || []).map((calc) => {
            const dataObj = { ...calc } as any;
            delete dataObj.selectedStandardPrepId;
            delete dataObj.selectedSamplePrepId;
            return {
              label: calc.label,
              calculationType: "assay",
              data: JSON.stringify(dataObj),
            };
          }),
          ...(calculationsLodPerParam[param.id] || []).map((calc) => {
            const dataObj = { ...calc } as any;
            delete dataObj.selectedSamplePrepId;
            return {
              label: calc.label,
              calculationType: "lod",
              data: JSON.stringify(dataObj),
            };
          }),
          ...(calculationsROIPerParam[param.id] || []).map((calc) => {
            const dataObj = { ...calc } as any;
            delete dataObj.selectedSamplePrepId;
            return {
              label: calc.label,
              calculationType: "roi",
              data: JSON.stringify(dataObj),
            };
          }),
          ...(calculationsSulphatedAshPerParam[param.id] || []).map((calc) => {
            const dataObj = { ...calc } as any;
            delete dataObj.selectedSamplePrepId;
            return {
              label: calc.label,
              calculationType: "sulphated_ash",
              data: JSON.stringify(dataObj),
            };
          }),
          ...(calculationsRSPerParam[param.id] || []).map((calc) => {
            const dataObj = { ...calc } as any;
            delete dataObj.selectedStandardPrepId;
            delete dataObj.selectedSamplePrepId;
            return {
              label: calc.label,
              calculationType: "residual_solvent",
              data: JSON.stringify(dataObj),
            };
          }),
          ...(calculationsDissoPerParam[param.id] || []).map((calc) => {
            const dataObj = { ...calc } as any;
            delete dataObj.selectedStandardPrepId;
            delete dataObj.selectedSamplePrepId;
            return {
              label: calc.label,
              calculationType: "dissolution",
              data: JSON.stringify(dataObj),
            };
          }),
        ];

        return {
          id: param.id,
          paraCode: param.paraCode,
          parameterName: param.parameterName,
          methodCode: param.methodCode,
          methodName: param.methodName,
          columnId: columnsPerParam[param.id] || null,
          diluentPreparation: diluentPerParam[param.id] || null,
          otherInfo: otherInfoPerParam[param.id] || null,
          analysisStartDate: analysisStartDatePerParam[param.id] || null,
          analysisCompletionDate:
            analysisCompletionDatePerParam[param.id] || null,
          analyzedBy: analyzedByPerParam[param.id] || null,
          approvedBy: approvedByPerParam[param.id] || null,
          approvedAt: approvedAtPerParam[param.id] || null,
          status: parameterStatusPerParam[param.id] || "Created",

          instrumentIds: (addedInstruments[param.id] || []).map(
            (inst) => inst.id
          ),
          chemicalIds: (addedChemicals[param.id] || []).map((chem) => chem.id),
          standardIds: (addedStandards[param.id] || []).map((std) => std.id),

          // Unified arrays with type discriminators
          standardPreparations,
          samplePreparations,
          calculations,
        };
      }),
    };
  };

  const reloadWorksheet = async () => {
    if (!worksheetId) return;

    setIsLoading(true);
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

      const samples = await fetchSample(worksheetData.sample.registrationNo);
      setSamplesData(samples);

      // 🔥 IMPORTANT: clear previous state before restore
      setAddedParameters([]);
      setSelectedParamsForDetail([]);

      restoreWorksheetToState(worksheetData);
    } catch (err: any) {
      setError(err.message || "Failed to reload worksheet");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrintClick = () => {
    if (onPrint && worksheetInfo && analysts) {
      const selectedParam = addedParameters[paramIdx];
      const paramId = selectedParam.id;

      onPrint(
        worksheetInfo,
        analysts,
        addedInstruments[paramId] || [],
        addedChemicals[paramId] || [],
        addedStandards[paramId] || []
      );
    }
  };

  const handleSaveDraft = async () => {
    setIsSaving(true);
    const worksheetData = collectFormDataForAPI();

    try {
      if (role === "HOD LAB") {
        const response = await updateWorksheet(worksheetId, worksheetData);

        if (response && response.worksheetId) {
          await reloadWorksheet();
          setToastMessage(`Draft saved successfully: ${response.worksheetId}`);
          setSaveSuccess(true);
          setTimeout(() => setSaveSuccess(false), 3000);
          setShowToast(true);
          setTimeout(() => {
            setShowToast(false);
          }, 4000);
        } else {
          setTimeout(() => setSaveSuccess(false), 3000);
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
            setTimeout(() => setSaveSuccess(false), 3000);
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
          "created"
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
          updatedWorksheetData
        );

        if (response && response.worksheetId) {
          // ✅ FIX: Update local state correctly
          setWorksheetInfo((prev) =>
            prev
              ? {
                  ...prev,
                  sample: {
                    ...prev.sample,
                    status: "Submitted For Analysis",
                  },
                }
              : null
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
              `Failed to update parameter ${param.parameterName}`
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

  const handleAnalystSelected = (employeeId: string) => {
    if (!pendingParameter) return;

    if (analystMode === "add") {
      const newId = paramIdx + 1;
      setParamIdx(newId);
      const newParameter = { ...pendingParameter, id: newId };

      setAddedParameters((prev) => [...prev, newParameter]);

      setAnalyzedByPerParam((prev) => ({
        ...prev,
        [newId]: employeeId,
      }));
    }

    if (analystMode === "reassign") {
      const paramId = pendingParameter.id;

      setAnalyzedByPerParam((prev) => ({
        ...prev,
        [paramId]: employeeId,
      }));
    }

    setPendingParameter(null);
    setAnalystMode("add");
    setShowAnalystDialog(false);
    setShowParameterDropdown(false);
  };

  const handleRemoveParameter = (id: number) => {
    setAddedParameters(addedParameters.filter((p) => p.id !== id));
    setSelectedParamsForDetail(
      selectedParamsForDetail.filter((paramId) => paramId !== id)
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
    cleanupState(setAnalysisStartDatePerParam);
    cleanupState(setAnalysisCompletionDatePerParam);
    cleanupState(setApprovedAtPerParam);
    cleanupState(setParameterStatusPerParam);
    cleanupState(setAddedInstruments);
    cleanupState(setAddedChemicals);
    cleanupState(setAddedStandards);
    cleanupState(setColumnsPerParam);
    cleanupState(setDiluentPerParam);
    cleanupState(setOtherInfoPerParam);
    cleanupState(setCalculationsAssayPerParam);
    cleanupState(setCalculationsROIPerParam);
    cleanupState(setCalculationsLodPerParam);
    cleanupState(setCalculationsSulphatedAshPerParam);
    cleanupState(setCalculationsDissoPerParam);
    cleanupState(setStandardPreparationPerParam);
    cleanupState(setSamplePreparationPerParam);
    cleanupState(setStandardPreparationDissoPerParam);
    cleanupState(setSamplePreparationDissoPerParam);
    cleanupState(setStandardPreparationRSPerParam);
    cleanupState(setSamplePreparationRSPerParam);
    cleanupState(setCalculationsRSPerParam);
    cleanupState(setSamplePreparationLodPerParam);
    cleanupState(setSamplePreparationROIPerParam);
    cleanupState(setSamplePreparationSulphatedAshPerParam);
    cleanupState(setActivePreparationGroups); // ✅ Also clean up active prep groups
    cleanupState(setAddedInstrumentIdsPerParam); // ✅ Clean up cached IDs
    cleanupState(setAddedChemicalIdsPerParam); // ✅ Clean up cached IDs
    cleanupState(setAddedStandardIdsPerParam); // ✅ Clean up cached IDs
  };

  const toggleParameterDetail = (id: number) => {
    setSelectedParamsForDetail((prev) =>
      prev.includes(id)
        ? prev.filter((paramId) => paramId !== id)
        : [...prev, id]
    );
  };

  const areAllParametersApproved = useCallback((): boolean => {
    if (addedParameters.length === 0) return false;

    return addedParameters.every((param) => {
      const status = (
        parameterStatusPerParam[param.id] || "created"
      ).toLowerCase();
      return status === "approved";
    });
  }, [addedParameters, parameterStatusPerParam]);

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
      };

      const response = await updateParameter(
        parameterToUnlock.id,
        updatedParam
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

  // Check if parameter is editable for scientist
  const isParameterEditableForScientist = useCallback(
    (parameterId: number): boolean => {
      if (role !== "Scientist") return false;
      const status = (
        parameterStatusPerParam[parameterId] || "created"
      ).toLowerCase();
      return ["created", "analysis started", "analysis revision"].includes(
        status
      );
    },
    [role, parameterStatusPerParam]
  );

  const handleApprove = (param: ParameterDetail) => {
    setParameterForApproval(param);
    setShowApproveDialog(true);
  };

  const handleRequestRevision = (param: ParameterDetail) => {
    setParameterForApproval(param);
    setShowRevisionDialog(true);
  };

  const handleConfirmApprove = async () => {
    if (!parameterForApproval) return;

    setIsApproving(true);
    try {
      const updatedParam = {
        ...parameterForApproval,
        status: "Approved",
        approvedBy: employeeId,
        approvedAt: new Date().toISOString().split("T")[0],
      };

      const response = await updateParameter(
        parameterForApproval.id,
        updatedParam
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
          [parameterForApproval.id]: updatedParam.approvedAt,
        }));

        setToastMessage("Parameter approved successfully!");
        setShowToast(true);
        setTimeout(() => {
          setShowToast(false);
        }, 4000);
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
        approvedBy: employeeId,
        approvedAt: new Date().toISOString().split("T")[0],
      };

      const response = await updateParameter(
        parameterForApproval.id,
        updatedParam
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
          [parameterForApproval.id]: updatedParam.approvedAt,
        }));

        setToastMessage("Parameter disapproved successfully!");
        setShowToast(true);
        setTimeout(() => {
          setShowToast(false);
        }, 4000);
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

  const handleConfirmRevision = async () => {
    // if (!parameterForApproval || !revisionComments.trim()) {
    //   alert("Please enter revision comments");
    //   return;
    // }

    setIsRequestingRevision(true);
    try {
      const updatedParam = {
        ...parameterForApproval,
        status: "Analysis Revision",
        revisionComments: revisionComments,
      };

      const response = await updateParameter(
        parameterForApproval?.id!,
        updatedParam!
      );

      if (response && response.parameterId) {
        setParameterStatusPerParam((prev) => ({
          ...prev,
          [parameterForApproval?.id!]: "Analysis Revision",
        }));

        setToastMessage("Revision requested successfully!");
        setShowToast(true);
        setTimeout(() => {
          setShowToast(false);
        }, 4000);

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
        analysisStartDate: new Date().toISOString().split("T")[0], // Current date
      };

      const response = await updateParameter(
        parameterForAnalysis.id,
        updatedParam
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
          "Analysis started successfully! You can now proceed with the analysis."
        );
        setShowToast(true);
        setTimeout(() => {
          setShowToast(false);
        }, 4000);

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
    setParameterForAnalysis(param);
    setShowCompleteAnalysisDialog(true);
  };

  // Handle confirm complete analysis
  const handleConfirmCompleteAnalysis = async () => {
    if (!parameterForAnalysis) return;

    setIsCompletingAnalysis(true);
    try {
      // Save current data first
      // await handleSaveDraft();

      // Update parameter status to "Completed"
      const updatedParam = {
        ...parameterForAnalysis,
        status: "Analysis Completed",
        analysisCompletionDate: new Date().toISOString().split("T")[0], // Current date
      };

      const response = await updateParameter(
        parameterForAnalysis.id,
        updatedParam
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

        setToastMessage(
          "Analysis completed successfully! Submitted for HOD approval."
        );
        setShowToast(true);
        setTimeout(() => {
          setShowToast(false);
        }, 4000);

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
      // Step 1: Collect current worksheet data
      const worksheetData = collectFormDataForAPI();

      // Step 2: Map to database format using WorksheetDbMapper
      if (!worksheetInfo) {
        throw new Error("Worksheet information is not available");
      }

      const mappedData = WorksheetDbMapper.mapAll(worksheetInfo);

      const submitResponse = await submitWorksheet(mappedData);

      if (!submitResponse.success) {
        throw new Error(
          submitResponse.message || "Failed to submit worksheet to database"
        );
      }

      // Step 4: Only if submission succeeds, update worksheet status to "Approved"
      const updatedWorksheetData = {
        ...worksheetData,
        documentInfo: {
          ...worksheetData?.documentInfo,
          status: "Approved",
          approvedBy: employeeId,
          approvedAt: new Date().toISOString().split("T")[0],
        },
      };

      const response = await updateWorksheet(worksheetId, updatedWorksheetData);

      if (response && response.worksheetId) {
        // Update local state
        setWorksheetInfo((prev) =>
          prev
            ? {
                ...prev,
                sample: {
                  ...prev.sample,
                  status: "Approved",
                },
              }
            : null
        );

        setToastMessage(
          "Worksheet submitted to database and approved successfully! All parameters are now finalized."
        );
        setShowToast(true);
        setTimeout(() => {
          setShowToast(false);
        }, 4000);

        setShowApproveWorksheetDialog(false);
      } else {
        throw new Error("Failed to update worksheet status after submission");
      }
    } catch (error: any) {
      console.error("Error during worksheet approval:", error);
      setToastMessage(`Error approving worksheet: ${error.message || error}`);
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
      }, 4000);
    } finally {
      setIsApprovingWorksheet(false);
    }
  };

  const availableToAdd = (samplesData ?? []).filter(
    (param) =>
      !addedParameters.find((added) => added.paraCode === param.paraCode)
  );

  // Standard Preparation Handlers
  const handleAddStandardPreparation = (parameterId: number) => {
    setCurrentParameterForStandardPrep(parameterId);
    setIsAddingRSStandard(false);
    setIsAddingDissoStandard(false);
    setShowStandardSelectionDialog(true);
  };

  const handleRemoveStandardPreparation = (
    parameterId: number,
    standardPreparationId: number
  ) => {
    setStandardPreparationPerParam((prev) => {
      const standards = prev[parameterId] || [];
      const indexToRemove = standards.findIndex(
        (sp) => sp.id === standardPreparationId
      );

      const updatedStandards = standards
        .filter((dm) => dm.id !== standardPreparationId)
        .map((dm, index) => ({
          ...dm,
          label: `Standard Preparation ${1 + index}`,
        }));

      if (indexToRemove !== -1) {
        setSamplePreparationPerParam((prevSample) => {
          const samples = prevSample[parameterId] || [];
          const updatedSamples = samples
            .filter((_, idx) => idx !== indexToRemove)
            .map((sp, index) => ({
              ...sp,
              label: `Sample Preparation ${1 + index}`,
            }));
          return { ...prevSample, [parameterId]: updatedSamples };
        });
      }

      return { ...prev, [parameterId]: updatedStandards };
    });
  };

  const handleStandardPreparationStepChange = (
    parameterId: number,
    standardPreparationId: number,
    stepName: StandardPreparationStep["name"],
    field:
      | "value"
      | "unit"
      | "value1"
      | "value2"
      | "unit1"
      | "unit2"
      | "logBookID"
      | "solventChemical",
    newValue: string
  ) => {
    setStandardPreparationPerParam((prev) => ({
      ...prev,
      [parameterId]: (prev[parameterId] || []).map((sp) => {
        if (sp.id === standardPreparationId) {
          return {
            ...sp,
            steps: sp.steps.map((step) => {
              if (step.name === stepName) {
                return { ...step, [field]: newValue };
              }
              return step;
            }),
          };
        }
        return sp;
      }),
    }));
  };

  const handleRemoveSamplePreparation = (
    parameterId: number,
    samplePreparationId: number
  ) => {
    setSamplePreparationPerParam((prev) => {
      const samples = prev[parameterId] || [];
      const indexToRemove = samples.findIndex(
        (sp) => sp.id === samplePreparationId
      );

      const updatedSamples = samples
        .filter((sp) => sp.id !== samplePreparationId)
        .map((sp, index) => ({
          ...sp,
          label: `Sample Preparation ${1 + index}`,
        }));

      if (indexToRemove !== -1) {
        setStandardPreparationPerParam((prevStandard) => {
          const standards = prevStandard[parameterId] || [];
          const updatedStandards = standards
            .filter((_, idx) => idx !== indexToRemove)
            .map((sp, index) => ({
              ...sp,
              label: `Standard Preparation ${1 + index}`,
            }));
          return { ...prevStandard, [parameterId]: updatedStandards };
        });
      }

      return { ...prev, [parameterId]: updatedSamples };
    });
  };

  const handleSamplePreparationStepChange = (
    parameterId: number,
    samplePreparationId: number,
    stepName: SamplePreparationStep["name"],
    field:
      | "value1"
      | "value2"
      | "unit1"
      | "unit2"
      | "logBookID"
      | "solventChemical",
    newValue: string
  ) => {
    setSamplePreparationPerParam((prev) => ({
      ...prev,
      [parameterId]: (prev[parameterId] || []).map((sp) => {
        if (sp.id === samplePreparationId) {
          return {
            ...sp,
            steps: sp.steps.map((step) => {
              if (step.name === stepName) {
                return { ...step, [field]: newValue };
              }
              return step;
            }),
          };
        }
        return sp;
      }),
    }));
  };

  // LOD Handlers
  const handleAddSamplePreparationLod = (parameterId: number) => {
    setSamplePreparationLodPerParam((prev) => {
      const currentSamples = prev[parameterId] || [];
      const newIndex = currentSamples.length;
      return {
        ...prev,
        [parameterId]: [
          ...currentSamples,
          createNewSamplePreparationLod(newIndex),
        ],
      };
    });
  };

  const handleRemoveSamplePreparationLod = (
    parameterId: number,
    samplePreparationLodId: number
  ) => {
    setSamplePreparationLodPerParam((prev) => {
      const updatedSamples = (prev[parameterId] || [])
        .filter((spl) => spl.id !== samplePreparationLodId)
        .map((spl, index) => ({
          ...spl,
          label: `Sample Preparation ${1 + index}`,
        }));
      return { ...prev, [parameterId]: updatedSamples };
    });
  };

  const handleSamplePreparationLodStepChange = (
    parameterId: number,
    samplePreparationLodId: number,
    stepName: SamplePreparationLodStep["name"],
    field:
      | "value1"
      | "value2"
      | "value3"
      | "unit1"
      | "unit2"
      | "unit3"
      | "logBookID",
    newValue: string
  ) => {
    setSamplePreparationLodPerParam((prev) => ({
      ...prev,
      [parameterId]: (prev[parameterId] || []).map((spl) => {
        if (spl.id === samplePreparationLodId) {
          return {
            ...spl,
            steps: spl.steps.map((step) => {
              if (step.name === stepName) {
                return { ...step, [field]: newValue };
              }
              return step;
            }),
          };
        }
        return spl;
      }),
    }));
  };

  // Sulphated Ash Handlers
  const handleAddSamplePreparationSulphatedAsh = (parameterId: number) => {
    setSamplePreparationSulphatedAshPerParam((prev) => {
      const currentSamples = prev[parameterId] || [];
      const newIndex = currentSamples.length;
      return {
        ...prev,
        [parameterId]: [
          ...currentSamples,
          createNewSamplePreparationSulphatedAsh(newIndex),
        ],
      };
    });
  };

  const handleRemoveSamplePreparationSulphatedAsh = (
    parameterId: number,
    samplePreparationSulphatedAshId: number
  ) => {
    setSamplePreparationSulphatedAshPerParam((prev) => {
      const updatedSamples = (prev[parameterId] || [])
        .filter((spsa) => spsa.id !== samplePreparationSulphatedAshId)
        .map((spsa, index) => ({
          ...spsa,
          label: `Sample Preparation ${1 + index}`,
        }));
      return { ...prev, [parameterId]: updatedSamples };
    });
  };

  const handleSamplePreparationSulphatedAshStepChange = (
    parameterId: number,
    samplePreparationSulphatedAshId: number,
    stepName: SamplePreparationSulphatedAshStep["name"],
    field:
      | "value1"
      | "value2"
      | "value3"
      | "unit1"
      | "unit2"
      | "unit3"
      | "logBookID",
    newValue: string
  ) => {
    setSamplePreparationSulphatedAshPerParam((prev) => ({
      ...prev,
      [parameterId]: (prev[parameterId] || []).map((spsa) => {
        if (spsa.id === samplePreparationSulphatedAshId) {
          return {
            ...spsa,
            steps: spsa.steps.map((step) => {
              if (step.name === stepName) {
                return { ...step, [field]: newValue };
              }
              return step;
            }),
          };
        }
        return spsa;
      }),
    }));
  };

  // ROI Handlers
  const handleAddSamplePreparationROI = (parameterId: number) => {
    setSamplePreparationROIPerParam((prev) => {
      const currentSamples = prev[parameterId] || [];
      const newIndex = currentSamples.length;
      return {
        ...prev,
        [parameterId]: [
          ...currentSamples,
          createNewSamplePreparationROI(newIndex),
        ],
      };
    });
  };

  const handleRemoveSamplePreparationROI = (
    parameterId: number,
    samplePreparationROIId: number
  ) => {
    setSamplePreparationROIPerParam((prev) => {
      const updatedSamples = (prev[parameterId] || [])
        .filter((spl) => spl.id !== samplePreparationROIId)
        .map((spl, index) => ({
          ...spl,
          label: `Sample Preparation ${1 + index}`,
        }));
      return { ...prev, [parameterId]: updatedSamples };
    });
  };

  const handleSamplePreparationROIStepChange = (
    parameterId: number,
    samplePreparationROIId: number,
    stepName: SamplePreparationROIStep["name"],
    field:
      | "value1"
      | "value2"
      | "value3"
      | "unit1"
      | "unit2"
      | "unit3"
      | "logBookID",
    newValue: string
  ) => {
    setSamplePreparationROIPerParam((prev) => ({
      ...prev,
      [parameterId]: (prev[parameterId] || []).map((spl) => {
        if (spl.id === samplePreparationROIId) {
          return {
            ...spl,
            steps: spl.steps.map((step) => {
              if (step.name === stepName) {
                return { ...step, [field]: newValue };
              }
              return step;
            }),
          };
        }
        return spl;
      }),
    }));
  };

  // Dissolution Handlers
  const handleRemoveSamplePreparationDisso = (
    parameterId: number,
    samplePreparationDissoId: number
  ) => {
    setSamplePreparationDissoPerParam((prev) => {
      const samples = prev[parameterId] || [];
      const indexToRemove = samples.findIndex(
        (sp) => sp.id === samplePreparationDissoId
      );

      const updatedSamples = samples
        .filter((sp) => sp.id !== samplePreparationDissoId)
        .map((sp, index) => ({
          ...sp,
          label: `Sample Preparation ${1 + index}`,
        }));

      if (indexToRemove !== -1) {
        setStandardPreparationDissoPerParam((prevStandard) => {
          const standards = prevStandard[parameterId] || [];
          const updatedStandards = standards
            .filter((_, idx) => idx !== indexToRemove)
            .map((sp, index) => ({
              ...sp,
              label: `Standard Preparation ${1 + index}`,
            }));
          return { ...prevStandard, [parameterId]: updatedStandards };
        });
      }

      return { ...prev, [parameterId]: updatedSamples };
    });
  };

  const handleSamplePreparationDissoStepChange = (
    parameterId: number,
    samplePreparationDissoId: number,
    stepName: SamplePreparationDissoStep["name"],
    field:
      | "id"
      | "value1"
      | "value2"
      | "value3"
      | "unit1"
      | "unit2"
      | "unit3"
      | "solventChemical",
    newValue: string
  ) => {
    setSamplePreparationDissoPerParam((prev) => ({
      ...prev,
      [parameterId]: (prev[parameterId] || []).map((spl) => {
        if (spl.id === samplePreparationDissoId) {
          return {
            ...spl,
            steps: spl.steps.map((step) => {
              if (step.name === stepName) {
                return { ...step, [field]: newValue };
              }
              return step;
            }),
          };
        }
        return spl;
      }),
    }));
  };

  // Instrument/Chemical/Standard Handlers
  const searchFilteredInstruments = instruments.filter(
    (inst) =>
      inst.name.toLowerCase().includes(instrumentSearch.toLowerCase()) ||
      inst.tag.toLowerCase().includes(instrumentSearch.toLowerCase())
  );

  const searchFilteredChemicals = chemicals.filter(
    (chem) =>
      chem.name.toLowerCase().includes(chemicalSearch.toLowerCase()) ||
      (chem.make &&
        chem.make.toLowerCase().includes(chemicalSearch.toLowerCase()))
  );

  const searchFilteredStandards = standards.filter(
    (std) =>
      std.name.toLowerCase().includes(standardSearch.toLowerCase()) ||
      (std.make &&
        std.make.toLowerCase().includes(standardSearch.toLowerCase()))
  );

  const handleAddInstrument = (parameterId: number, instrument: Instrument) => {
    setAddedInstruments((prev) => ({
      ...prev,
      [parameterId]: [...(prev[parameterId] || []), instrument],
    }));
    setShowInstrumentDropdown(false);
    setInstrumentSearch("");
  };

  const handleRemoveInstrument = (
    parameterId: number,
    instrumentId: string
  ) => {
    setAddedInstruments((prev) => ({
      ...prev,
      [parameterId]: (prev[parameterId] || []).filter(
        (inst) => inst.id !== instrumentId
      ),
    }));
  };

  const handleAddChemical = (parameterId: number, chemical: Chemical) => {
    setAddedChemicals((prev) => ({
      ...prev,
      [parameterId]: [...(prev[parameterId] || []), chemical],
    }));
    setShowChemicalDropdown(false);
    setChemicalSearch("");
  };

  const handleRemoveChemical = (parameterId: number, chemicalId: string) => {
    setAddedChemicals((prev) => ({
      ...prev,
      [parameterId]: (prev[parameterId] || []).filter(
        (chem) => chem.id !== chemicalId
      ),
    }));
  };

  const handleAddStandard = (parameterId: number, standard: Standard) => {
    setAddedStandards((prev) => ({
      ...prev,
      [parameterId]: [...(prev[parameterId] || []), standard],
    }));
    setShowStandardDropdown(false);
    setStandardSearch("");
  };

  const handleRemoveStandard = (parameterId: number, standardId: string) => {
    setAddedStandards((prev) => ({
      ...prev,
      [parameterId]: (prev[parameterId] || []).filter(
        (std) => std.id !== standardId
      ),
    }));
  };

  // Calculation Handlers - Assay
  const handleAddCalculationAssay = (parameterId: number) => {
    setCalculationsAssayPerParam((prev) => {
      const currentCalculations = prev[parameterId] || [];
      const newIndex = currentCalculations.length;
      return {
        ...prev,
        [parameterId]: [
          ...currentCalculations,
          createNewCalculationAssay(newIndex),
        ],
      };
    });
  };

  const handleRemoveCalculationAssay = (
    parameterId: number,
    calculationId: number
  ) => {
    setCalculationsAssayPerParam((prev) => {
      const updatedCalculations = (prev[parameterId] || [])
        .filter((calc) => calc.id !== calculationId)
        .map((calc, index) => ({ ...calc, label: `Calculation ${index + 1}` }));
      return { ...prev, [parameterId]: updatedCalculations };
    });
  };

  const handleCalculationAssayFieldChange = (
    parameterId: number,
    calculationId: number,
    field: keyof CalculationAssay,
    value: string | number | null
  ) => {
    setCalculationsAssayPerParam((prev) => ({
      ...prev,
      [parameterId]: (prev[parameterId] || []).map((calc) => {
        if (calc.id === calculationId) {
          return { ...calc, [field]: value };
        }
        return calc;
      }),
    }));
  };

  // Calculation Handlers - LOD
  const handleAddCalculationLod = (parameterId: number) => {
    setCalculationsLodPerParam((prev) => {
      const currentCalculations = prev[parameterId] || [];
      const newIndex = currentCalculations.length;
      return {
        ...prev,
        [parameterId]: [
          ...currentCalculations,
          createNewCalculationLod(newIndex),
        ],
      };
    });
  };

  const handleRemoveCalculationLod = (
    parameterId: number,
    calculationId: number
  ) => {
    setCalculationsLodPerParam((prev) => {
      const updatedCalculations = (prev[parameterId] || [])
        .filter((calc) => calc.id !== calculationId)
        .map((calc, index) => ({
          ...calc,
          label: `Calculation ${index + 1}`,
        }));
      return { ...prev, [parameterId]: updatedCalculations };
    });
  };

  const handleCalculationLodFieldChange = (
    parameterId: number,
    calculationId: number,
    field: keyof CalculationLod,
    value: string | number | null
  ) => {
    setCalculationsLodPerParam((prev) => ({
      ...prev,
      [parameterId]: (prev[parameterId] || []).map((calc) => {
        if (calc.id === calculationId) {
          return { ...calc, [field]: value };
        }
        return calc;
      }),
    }));
  };

  // Calculation Handlers - ROI
  const handleAddCalculationROI = (parameterId: number) => {
    setCalculationsROIPerParam((prev) => {
      const currentCalculations = prev[parameterId] || [];
      const newIndex = currentCalculations.length;
      return {
        ...prev,
        [parameterId]: [
          ...currentCalculations,
          createNewCalculationROI(newIndex),
        ],
      };
    });
  };

  const handleRemoveCalculationROI = (
    parameterId: number,
    calculationId: number
  ) => {
    setCalculationsROIPerParam((prev) => {
      const updatedCalculations = (prev[parameterId] || [])
        .filter((calc) => calc.id !== calculationId)
        .map((calc, index) => ({
          ...calc,
          label: `Calculation ${index + 1}`,
        }));
      return { ...prev, [parameterId]: updatedCalculations };
    });
  };

  const handleCalculationROIFieldChange = (
    parameterId: number,
    calculationId: number,
    field: keyof CalculationROI,
    value: string | number | null
  ) => {
    setCalculationsROIPerParam((prev) => ({
      ...prev,
      [parameterId]: (prev[parameterId] || []).map((calc) => {
        if (calc.id === calculationId) {
          return { ...calc, [field]: value };
        }
        return calc;
      }),
    }));
  };

  // Calculation Handlers - Sulphated Ash
  const handleAddCalculationSulphatedAsh = (parameterId: number) => {
    setCalculationsSulphatedAshPerParam((prev) => {
      const currentCalculations = prev[parameterId] || [];
      const newIndex = currentCalculations.length;
      return {
        ...prev,
        [parameterId]: [
          ...currentCalculations,
          createNewCalculationSulphatedAsh(newIndex),
        ],
      };
    });
  };

  const handleRemoveCalculationSulphatedAsh = (
    parameterId: number,
    calculationId: number
  ) => {
    setCalculationsSulphatedAshPerParam((prev) => {
      const updatedCalculations = (prev[parameterId] || [])
        .filter((calc) => calc.id !== calculationId)
        .map((calc, index) => ({
          ...calc,
          label: `Calculation ${index + 1}`,
        }));
      return { ...prev, [parameterId]: updatedCalculations };
    });
  };

  const handleCalculationSulphatedAshFieldChange = (
    parameterId: number,
    calculationId: number,
    field: keyof CalculationSulphatedAsh,
    value: string | number | null
  ) => {
    setCalculationsSulphatedAshPerParam((prev) => ({
      ...prev,
      [parameterId]: (prev[parameterId] || []).map((calc) => {
        if (calc.id === calculationId) {
          return { ...calc, [field]: value };
        }
        return calc;
      }),
    }));
  };

  // RS (Residual Solvent) Handlers
  const handleAddStandardPreparationRS = (parameterId: number) => {
    setCurrentParameterForStandardPrep(parameterId);
    setIsAddingRSStandard(true);
    setIsAddingDissoStandard(false);
    setShowStandardSelectionDialog(true);
  };

  const handleStandardSelectedForPreparation = (
    standard: Standard,
    isRS: boolean = false,
    isDisso: boolean = false
  ) => {
    if (currentParameterForStandardPrep === null) return;

    const parameterId = currentParameterForStandardPrep;

    if (isRS) {
      const currentStandards = standardPreparationRSPerParam[parameterId] || [];
      const newIndex = currentStandards.length;
      const newStandardPrep = createNewStandardPreparation(newIndex);

      newStandardPrep.steps = newStandardPrep.steps.map((step) => {
        if (step.name === "Weighing") {
          return { ...step, solventChemical: standard.name };
        }
        return step;
      });

      setStandardPreparationRSPerParam((prev) => ({
        ...prev,
        [parameterId]: [
          ...currentStandards,
          { ...newStandardPrep, assignedStandardId: standard.id },
        ],
      }));

      const currentSamples = samplePreparationRSPerParam[parameterId] || [];
      const newSampleIndex = currentSamples.length;
      const newSamplePrep = createNewSamplePreparation(newSampleIndex);

      setSamplePreparationRSPerParam((prev) => ({
        ...prev,
        [parameterId]: [
          ...currentSamples,
          { ...newSamplePrep, assignedStandardId: standard.id },
        ],
      }));
    } else if (isDisso) {
      const currentStandards =
        standardPreparationDissoPerParam[parameterId] || [];
      const newIndex = currentStandards.length;
      const newStandardPrep = createNewStandardPreparation(newIndex);

      newStandardPrep.steps = newStandardPrep.steps.map((step) => {
        if (step.name === "Weighing") {
          return { ...step, solventChemical: standard.name };
        }
        return step;
      });

      setStandardPreparationDissoPerParam((prev) => ({
        ...prev,
        [parameterId]: [
          ...currentStandards,
          { ...newStandardPrep, assignedStandardId: standard.id },
        ],
      }));

      const currentSamples = samplePreparationDissoPerParam[parameterId] || [];
      const newSampleIndex = currentSamples.length;
      const newSamplePrepDisso =
        createNewSamplePreparationDisso(newSampleIndex);

      setSamplePreparationDissoPerParam((prev) => ({
        ...prev,
        [parameterId]: [
          ...currentSamples,
          { ...newSamplePrepDisso, assignedStandardId: standard.id },
        ],
      }));
    } else {
      const currentStandards = standardPreparationPerParam[parameterId] || [];
      const newIndex = currentStandards.length;
      const newStandardPrep = createNewStandardPreparation(newIndex);

      newStandardPrep.steps = newStandardPrep.steps.map((step) => {
        if (step.name === "Weighing") {
          return { ...step, solventChemical: standard.name };
        }
        return step;
      });

      setStandardPreparationPerParam((prev) => ({
        ...prev,
        [parameterId]: [
          ...currentStandards,
          { ...newStandardPrep, assignedStandardId: standard.id },
        ],
      }));

      const currentSamples = samplePreparationPerParam[parameterId] || [];
      const newSampleIndex = currentSamples.length;
      const newSamplePrep = createNewSamplePreparation(newSampleIndex);

      setSamplePreparationPerParam((prev) => ({
        ...prev,
        [parameterId]: [
          ...currentSamples,
          { ...newSamplePrep, assignedStandardId: standard.id },
        ],
      }));
    }

    setShowStandardSelectionDialog(false);
    setCurrentParameterForStandardPrep(null);
    setIsAddingRSStandard(false);
    setIsAddingDissoStandard(false);
  };

  const handleRemoveStandardPreparationRS = (
    parameterId: number,
    standardPreparationId: number
  ) => {
    setStandardPreparationRSPerParam((prev) => {
      const standards = prev[parameterId] || [];
      const indexToRemove = standards.findIndex(
        (sp) => sp.id === standardPreparationId
      );

      const updatedStandards = standards
        .filter((dm) => dm.id !== standardPreparationId)
        .map((dm, index) => ({
          ...dm,
          label: `Standard Preparation ${1 + index}`,
        }));

      if (indexToRemove !== -1) {
        setSamplePreparationRSPerParam((prevSample) => {
          const samples = prevSample[parameterId] || [];
          const updatedSamples = samples
            .filter((_, idx) => idx !== indexToRemove)
            .map((sp, index) => ({
              ...sp,
              label: `Sample Preparation ${1 + index}`,
            }));
          return { ...prevSample, [parameterId]: updatedSamples };
        });
      }

      return { ...prev, [parameterId]: updatedStandards };
    });
  };

  const handleStandardPreparationRSStepChange = (
    parameterId: number,
    standardPreparationId: number,
    stepName: StandardPreparationStep["name"],
    field:
      | "value1"
      | "value2"
      | "unit1"
      | "unit2"
      | "value3"
      | "unit3"
      | "logBookID"
      | "solventChemical",
    newValue: string
  ) => {
    setStandardPreparationRSPerParam((prev) => ({
      ...prev,
      [parameterId]: (prev[parameterId] || []).map((sp) => {
        if (sp.id === standardPreparationId) {
          return {
            ...sp,
            steps: sp.steps.map((step) => {
              if (step.name === stepName) {
                return { ...step, [field]: newValue };
              }
              return step;
            }),
          };
        }
        return sp;
      }),
    }));
  };

  const handleRemoveSamplePreparationRS = (
    parameterId: number,
    samplePreparationId: number
  ) => {
    setSamplePreparationRSPerParam((prev) => {
      const samples = prev[parameterId] || [];
      const indexToRemove = samples.findIndex(
        (sp) => sp.id === samplePreparationId
      );

      const updatedSamples = samples
        .filter((sp) => sp.id !== samplePreparationId)
        .map((sp, index) => ({
          ...sp,
          label: `Sample Preparation ${1 + index}`,
        }));

      if (indexToRemove !== -1) {
        setStandardPreparationRSPerParam((prevStandard) => {
          const standards = prevStandard[parameterId] || [];
          const updatedStandards = standards
            .filter((_, idx) => idx !== indexToRemove)
            .map((sp, index) => ({
              ...sp,
              label: `Standard Preparation ${1 + index}`,
            }));
          return { ...prevStandard, [parameterId]: updatedStandards };
        });
      }

      return { ...prev, [parameterId]: updatedSamples };
    });
  };

  const handleSamplePreparationRSStepChange = (
    parameterId: number,
    samplePreparationId: number,
    stepName: SamplePreparationStep["name"],
    field:
      | "value"
      | "unit"
      | "value1"
      | "value2"
      | "unit1"
      | "unit2"
      | "logBookID"
      | "solventChemical",
    newValue: string
  ) => {
    setSamplePreparationRSPerParam((prev) => ({
      ...prev,
      [parameterId]: (prev[parameterId] || []).map((sp) => {
        if (sp.id === samplePreparationId) {
          return {
            ...sp,
            steps: sp.steps.map((step) => {
              if (step.name === stepName) {
                return { ...step, [field]: newValue };
              }
              return step;
            }),
          };
        }
        return sp;
      }),
    }));
  };

  const handleAddCalculationRS = (parameterId: number) => {
    setCalculationsRSPerParam((prev) => {
      const currentCalculations = prev[parameterId] || [];
      const newIndex = currentCalculations.length;
      return {
        ...prev,
        [parameterId]: [
          ...currentCalculations,
          createNewCalculationRS(newIndex),
        ],
      };
    });
  };

  const handleRemoveCalculationRS = (
    parameterId: number,
    calculationId: number
  ) => {
    setCalculationsRSPerParam((prev) => {
      const updatedCalculations = (prev[parameterId] || [])
        .filter((calc) => calc.id !== calculationId)
        .map((calc, index) => ({
          ...calc,
          label: `Calculation ${index + 1}`,
        }));
      return { ...prev, [parameterId]: updatedCalculations };
    });
  };

  const handleCalculationRSFieldChange = (
    parameterId: number,
    calculationId: number,
    field: keyof CalculationRS,
    value: string | number | null
  ) => {
    setCalculationsRSPerParam((prev) => ({
      ...prev,
      [parameterId]: (prev[parameterId] || []).map((calc) => {
        if (calc.id === calculationId) {
          return { ...calc, [field]: value };
        }
        return calc;
      }),
    }));
  };

  const handleAddStandardPreparationDisso = (parameterId: number) => {
    setCurrentParameterForStandardPrep(parameterId);
    setIsAddingRSStandard(false);
    setIsAddingDissoStandard(true);
    setShowStandardSelectionDialog(true);
  };

  const handleAddCalculationDisso = (parameterId: number) => {
    setCalculationsDissoPerParam((prev) => {
      const currentCalculations = prev[parameterId] || [];
      const newIndex = currentCalculations.length;
      return {
        ...prev,
        [parameterId]: [
          ...currentCalculations,
          createNewCalculationDisso(newIndex),
        ],
      };
    });
  };

  const handleRemoveStandardPreparationDisso = (
    parameterId: number,
    standardPreparationId: number
  ) => {
    setStandardPreparationDissoPerParam((prev) => {
      const standards = prev[parameterId] || [];
      const indexToRemove = standards.findIndex(
        (sp) => sp.id === standardPreparationId
      );

      const updatedStandards = standards
        .filter((dm) => dm.id !== standardPreparationId)
        .map((dm, index) => ({
          ...dm,
          label: `Standard Preparation ${1 + index}`,
        }));

      if (indexToRemove !== -1) {
        setSamplePreparationDissoPerParam((prevSample) => {
          const samples = prevSample[parameterId] || [];
          const updatedSamples = samples
            .filter((_, idx) => idx !== indexToRemove)
            .map((sp, index) => ({
              ...sp,
              label: `Sample Preparation ${1 + index}`,
            }));
          return { ...prevSample, [parameterId]: updatedSamples };
        });
      }

      return { ...prev, [parameterId]: updatedStandards };
    });
  };

  const handleStandardPreparationDissoStepChange = (
    parameterId: number,
    standardPreparationId: number,
    stepName: StandardPreparationStep["name"],
    field:
      | "value"
      | "unit"
      | "value1"
      | "value2"
      | "unit1"
      | "unit2"
      | "logBookID"
      | "solventChemical",
    newValue: string
  ) => {
    setStandardPreparationDissoPerParam((prev) => ({
      ...prev,
      [parameterId]: (prev[parameterId] || []).map((sp) => {
        if (sp.id === standardPreparationId) {
          return {
            ...sp,
            steps: sp.steps.map((step) => {
              if (step.name === stepName) {
                return { ...step, [field]: newValue };
              }
              return step;
            }),
          };
        }
        return sp;
      }),
    }));
  };

  const handleRemoveCalculationDisso = (
    parameterId: number,
    calculationId: number
  ) => {
    setCalculationsDissoPerParam((prev) => {
      const updatedCalculations = (prev[parameterId] || [])
        .filter((calc) => calc.id !== calculationId)
        .map((calc, index) => ({
          ...calc,
          label: `Calculation ${index + 1}`,
        }));
      return { ...prev, [parameterId]: updatedCalculations };
    });
  };

  const handleCalculationDissoFieldChange = (
    parameterId: number,
    calculationId: number,
    field: keyof CalculationDisso,
    value: string | number | null
  ) => {
    setCalculationsDissoPerParam((prev) => ({
      ...prev,
      [parameterId]: (prev[parameterId] || []).map((calc) => {
        if (calc.id === calculationId) {
          return { ...calc, [field]: value };
        }
        return calc;
      }),
    }));
  };

  const handleOtherInfoChange = (parameterId: number, value: string) => {
    setOtherInfoPerParam((prev) => ({ ...prev, [parameterId]: value }));
  };

  const handleDiluentChange = (parameterId: number, value: string) => {
    setDiluentPerParam((prev) => ({ ...prev, [parameterId]: value }));
  };

  const getAvailableStandardsForParameter = (
    parameterId: number,
    isForRS: boolean = false,
    isForDisso: boolean = false
  ): Standard[] => {
    const paramStandards = addedStandards[parameterId] || [];
    const preparations = isForRS
      ? standardPreparationRSPerParam[parameterId] || []
      : isForDisso
      ? standardPreparationDissoPerParam[parameterId] || []
      : standardPreparationPerParam[parameterId] || [];

    const assignedStandardIds = preparations
      .map((prep: any) => prep.assignedStandardId)
      .filter(Boolean);

    return paramStandards.filter(
      (std) => !assignedStandardIds.includes(std.id)
    );
  };

  const allParameters = samplesData.map((data) => data.parameter) ?? [];
  const uniqueMethods = [
    ...new Map(
      (samplesData ?? []).map((item) => [item.methodCode, item])
    ).values(),
  ];
  const allMethods = uniqueMethods.map((item) => item.methodName);
  const testsRequiredDisplay =
    allParameters.join(", ") + (allParameters.length > 0 ? "," : "");
  const methodsRequiredDisplay =
    allMethods.join(", ") + (allMethods.length > 0 ? "," : "");

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
    groupId: string
  ) => {
    setActivePreparationGroups((prev) => {
      const currentGroups = prev[parameterId] || [];

      if (currentGroups.includes(groupId)) {
        const group =
          PREPARATION_GROUPS[groupId as keyof typeof PREPARATION_GROUPS];

        // Clean up state for removed group
        if (group.id === "assay") {
          setStandardPreparationPerParam((p) => {
            const { [parameterId]: _, ...rest } = p;
            return rest;
          });
          setSamplePreparationPerParam((p) => {
            const { [parameterId]: _, ...rest } = p;
            return rest;
          });
          setCalculationsAssayPerParam((p) => {
            const { [parameterId]: _, ...rest } = p;
            return rest;
          });
        } else if (group.id === "lod") {
          setSamplePreparationLodPerParam((p) => {
            const { [parameterId]: _, ...rest } = p;
            return rest;
          });
          setCalculationsLodPerParam((p) => {
            const { [parameterId]: _, ...rest } = p;
            return rest;
          });
        } else if (group.id === "roi") {
          setSamplePreparationROIPerParam((p) => {
            const { [parameterId]: _, ...rest } = p;
            return rest;
          });
          setCalculationsROIPerParam((p) => {
            const { [parameterId]: _, ...rest } = p;
            return rest;
          });
        } else if (group.id === "sulphatedAsh") {
          setSamplePreparationSulphatedAshPerParam((p) => {
            const { [parameterId]: _, ...rest } = p;
            return rest;
          });
          setCalculationsSulphatedAshPerParam((p) => {
            const { [parameterId]: _, ...rest } = p;
            return rest;
          });
        } else if (group.id === "residualSolvent") {
          setStandardPreparationRSPerParam((p) => {
            const { [parameterId]: _, ...rest } = p;
            return rest;
          });
          setSamplePreparationRSPerParam((p) => {
            const { [parameterId]: _, ...rest } = p;
            return rest;
          });
          setCalculationsRSPerParam((p) => {
            const { [parameterId]: _, ...rest } = p;
            return rest;
          });
        } else if (group.id === "dissolution") {
          setCalculationsDissoPerParam((p) => {
            const { [parameterId]: _, ...rest } = p;
            return rest;
          });
          setSamplePreparationDissoPerParam((p) => {
            const { [parameterId]: _, ...rest } = p;
            return rest;
          });
          setStandardPreparationDissoPerParam((p) => {
            const { [parameterId]: _, ...rest } = p;
            return rest;
          });
        }

        return {
          ...prev,
          [parameterId]: currentGroups.filter((g) => g !== groupId),
        };
      }

      return {
        ...prev,
        [parameterId]: [...currentGroups, groupId],
      };
    });
    setShowPreparationDropdown({});
  };

  const getAvailablePreparationGroups = () => {
    return [
      { id: "assay", label: "Preparations for Assay", color: "red" },
      { id: "lod", label: "Preparations for LOD", color: "sky" },
      { id: "roi", label: "Preparations for ROI", color: "orange" },
      {
        id: "sulphatedAsh",
        label: "Preparations for Sulphated Ash",
        color: "rose",
      },
      {
        id: "residualSolvent",
        label: "Preparations for Residual Solvent",
        color: "indigo",
      },
      {
        id: "dissolution",
        label: "Preparations for Dissolution",
        color: "emerald",
      },
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

      // ========== SCIENTIST VIEW - CREATED (NO OVERLAY - FULLY EDITABLE) ==========
      if (role.toLowerCase() === "scientist" && isCreated) {
        return null; // No overlay needed, fully editable
      }

      // ========== SCIENTIST VIEW - ANALYSIS PENDING ==========
      if (role.toLowerCase() === "scientist" && isAnalysisPending && param) {
        return (
          <div className="relative mb-8 rounded-2xl overflow-hidden border border-slate-200 shadow-lg bg-white">
            <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-blue-50 px-6 py-5 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-blue-600 animate-pulse"
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
                  className="px-5 py-2.5 bg-white/60 backdrop-blur-sm border border-blue-200 text-blue-700 text-sm font-semibold rounded-lg hover:bg-white/80 hover:border-blue-300 transition-all flex items-center gap-2 shadow-sm"
                >
                  <BsPlayFill className="w-5 h-5" />
                  Start Analysis
                </motion.button>
              </div>
            </div>

            <div className="p-6 bg-slate-50">
              <div className="grid grid-cols-1 gap-4">
                <div className="bg-white border border-slate-200 rounded-xl p-5">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg
                        className="w-5 h-5 text-blue-600"
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
                          <span className="text-blue-500 mt-1">•</span>
                          <span>
                            You'll gain full access to edit all preparations and
                            calculations
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-blue-500 mt-1">•</span>
                          <span>
                            The parameter status will change to "Analysis
                            Started"
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-blue-500 mt-1">•</span>
                          <span>
                            You must complete the entire analysis - no pausing
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-blue-500 mt-1">•</span>
                          <span>
                            Click "Complete Analysis" when you're done with all
                            work
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <svg
                      className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5"
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
                    <p className="text-sm text-amber-800">
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

      // ========== SCIENTIST VIEW - ANALYSIS STARTED (ACTIVE EDITING) ==========
      if (role.toLowerCase() === "scientist" && isAnalysisStarted && param) {
        return (
          <div className="relative mb-8 rounded-2xl overflow-hidden border border-slate-200 shadow-lg bg-white">
            <div className="bg-gradient-to-r from-emerald-50 via-green-50 to-emerald-50 px-6 py-5 border-b border-slate-200">
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
                  className="px-5 py-2.5 bg-white/60 backdrop-blur-sm border border-emerald-200 text-emerald-700 text-sm font-semibold rounded-lg hover:bg-white/80 hover:border-emerald-300 transition-all flex items-center gap-2 shadow-sm"
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

            <div className="p-6 bg-slate-50">
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

                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <svg
                      className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5"
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
                    <p className="text-sm text-blue-800">
                      <strong>Before Completing:</strong> Verify all
                      preparations, calculations, and data are accurate. This
                      will submit your work to HOD for approval.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      }

      // ========== SCIENTIST VIEW - ANALYSIS COMPLETED (AWAITING HOD REVIEW) ==========
      if (role.toLowerCase() === "scientist" && isAnalysisCompleted && param) {
        return (
          <div className="relative mb-8 rounded-2xl overflow-hidden border border-slate-200 shadow-lg bg-white">
            <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-blue-50 px-6 py-5 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-blue-600"
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

            <div className="p-6 bg-slate-50">
              <div className="grid grid-cols-1 gap-4">
                <div className="bg-white border border-slate-200 rounded-xl p-5">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg
                        className="w-5 h-5 text-blue-600"
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
                          <span className="text-blue-500 mt-1">•</span>
                          <span>
                            HOD Lab is currently reviewing your analysis
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-blue-500 mt-1">•</span>
                          <span>
                            If approved, the parameter will be finalized
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-blue-500 mt-1">•</span>
                          <span>
                            If revisions are needed, you'll regain editing
                            access
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-blue-500 mt-1">•</span>
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
                      review. No edits can be made until HOD provides feedback.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      }

      // ========== SCIENTIST VIEW - ANALYSIS REVISION REQUESTED ==========
      if (role.toLowerCase() === "scientist" && isAnalysisRevision && param) {
        return (
          <div className="relative mb-8 rounded-2xl overflow-hidden border border-slate-200 shadow-lg bg-white">
            <div className="bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 px-6 py-5 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-amber-600 animate-pulse"
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
                      Revision Requested
                    </h3>
                    <p className="text-sm text-slate-600 mt-0.5">
                      HOD has requested revisions. Review feedback and update
                      your work
                    </p>
                  </div>
                </div>

                <motion.button
                  onClick={() => handleCompleteAnalysis(param)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-5 py-2.5 bg-white/60 backdrop-blur-sm border border-amber-200 text-amber-700 text-sm font-semibold rounded-lg hover:bg-white/80 hover:border-amber-300 transition-all flex items-center gap-2 shadow-sm"
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

            <div className="p-6 bg-slate-50">
              <div className="grid grid-cols-1 gap-4">
                <div className="bg-white border border-slate-200 rounded-xl p-5">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg
                        className="w-5 h-5 text-amber-600"
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
                          <span className="text-amber-500 mt-1">•</span>
                          <span>
                            Review HOD's feedback and make necessary corrections
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-amber-500 mt-1">•</span>
                          <span>
                            You have full editing access to all preparations and
                            calculations
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-amber-500 mt-1">•</span>
                          <span>
                            Click <strong>"Save Draft"</strong> to save your
                            changes
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-amber-500 mt-1">•</span>
                          <span>
                            Click <strong>"Complete Revision"</strong> when all
                            changes are done
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <svg
                      className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5"
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
                    <p className="text-sm text-yellow-800">
                      <strong>Tip:</strong> Carefully review all sections to
                      ensure accuracy before resubmitting. Your work will be
                      sent back to HOD for re-approval.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      }

      // ========== SCIENTIST VIEW - APPROVED ==========
      if (role.toLowerCase() === "scientist" && isApproved && param) {
        return (
          <div className="relative mb-8 rounded-2xl overflow-hidden border border-slate-200 shadow-lg bg-white">
            <div className="bg-gradient-to-r from-emerald-50 via-green-50 to-emerald-50 px-6 py-5 border-b border-slate-200">
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
                      Your analysis has been reviewed and approved by HOD
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 bg-slate-50">
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
                    <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg
                        className="w-5 h-5 text-blue-600"
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

              {approvedByPerParam[parameterId] &&
                approvedAtPerParam[parameterId] && (
                  <div className="mt-4 bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
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
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-emerald-800">
                          Approved By: {approvedByPerParam[parameterId]}
                        </p>
                        <p className="text-sm text-emerald-700 mt-1">
                          Approval Date: {approvedAtPerParam[parameterId]}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
            </div>
          </div>
        );
      }

      // ========== HOD LAB VIEW - CREATED ==========
      if (role.toLowerCase() === "hod lab" && isCreated && param) {
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

            <div className="p-6 bg-slate-50">
              <div className="grid grid-cols-1 gap-4">
                <div className="bg-white border border-slate-200 rounded-xl p-5">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg
                        className="w-5 h-5 text-blue-600"
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
                          <span className="text-slate-500 mt-1">•</span>
                          <span>
                            This parameter is in draft mode and being set up
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-slate-500 mt-1">•</span>
                          <span>
                            It has not been submitted for analysis yet
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-slate-500 mt-1">•</span>
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

      // ========== HOD LAB VIEW - ANALYSIS PENDING OR STARTED ==========
      if (
        role.toLowerCase() === "hod lab" &&
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
                      className="px-4 py-2 bg-white/60 backdrop-blur-sm border border-emerald-200 text-emerald-700 text-sm font-semibold rounded-lg hover:bg-white/80 hover:border-emerald-300 transition-all flex items-center gap-2 shadow-sm"
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

            <div className="p-6 bg-slate-50">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white border border-slate-200 rounded-xl p-5">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg
                        className="w-5 h-5 text-blue-600"
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
                    <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg
                        className="w-5 h-5 text-amber-600"
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
                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5" />
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

      // ========== HOD LAB VIEW - ANALYSIS COMPLETED (AWAITING APPROVAL) ==========
      if (role.toLowerCase() === "hod lab" && isAnalysisCompleted && param) {
        return (
          <div className="relative mb-8 rounded-2xl overflow-hidden border border-slate-200 shadow-lg bg-white">
            <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-blue-50 px-6 py-5 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-blue-600 animate-pulse"
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
                    className="px-4 py-2 bg-white/60 backdrop-blur-sm border border-emerald-200 text-emerald-700 text-sm font-semibold rounded-lg hover:bg-white/80 hover:border-emerald-300 transition-all flex items-center gap-2 shadow-sm"
                  >
                    <MdDone className="w-4 h-4" />
                    Approve
                  </motion.button>

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
                    Request Revision
                  </motion.button>
                </div>
              </div>
            </div>

            <div className="p-6 bg-slate-50">
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
                    <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg
                        className="w-5 h-5 text-blue-600"
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

              <div className="mt-4 bg-blue-50 border border-blue-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <svg
                    className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5"
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
                  <p className="text-sm text-blue-800">
                    <strong>Reminder:</strong> Your decision will be final.
                    Approved parameters cannot be edited. Parameters sent for
                    revision will return to the analyst.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
      }

      // ========== HOD LAB VIEW - ANALYSIS REVISION ==========
      if (role.toLowerCase() === "hod lab" && isAnalysisRevision && param) {
        return (
          <div className="relative mb-8 rounded-2xl overflow-hidden border border-slate-200 shadow-lg bg-white">
            <div className="bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 px-6 py-5 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-amber-600"
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

                <div className="px-4 py-2 bg-white/60 backdrop-blur-sm border border-amber-200 rounded-lg">
                  <span className="text-sm font-semibold text-amber-700">
                    AWAITING REVISION
                  </span>
                </div>
              </div>
            </div>

            <div className="p-6 bg-slate-50">
              <div className="grid grid-cols-1 gap-4">
                <div className="bg-white border border-slate-200 rounded-xl p-5">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg
                        className="w-5 h-5 text-amber-600"
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
                          <span className="text-amber-500 mt-1">•</span>
                          <span>You requested revisions on this parameter</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-amber-500 mt-1">•</span>
                          <span>
                            The analyst is currently making the necessary
                            changes
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-amber-500 mt-1">•</span>
                          <span>
                            Once complete, it will be resubmitted for your
                            review
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-amber-500 mt-1">•</span>
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
                      "Analysis Completed" status once the analyst finishes the
                      revisions.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      }

      // ========== HOD LAB VIEW - APPROVED ==========
      if (role.toLowerCase() === "hod lab" && isApproved && param) {
        return (
          <div className="relative mb-8 rounded-2xl overflow-hidden border border-slate-200 shadow-lg bg-white">
            <div className="bg-gradient-to-r from-emerald-50 via-green-50 to-emerald-50 px-6 py-5 border-b border-slate-200">
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

            <div className="p-6 bg-slate-50">
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
                    <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg
                        className="w-5 h-5 text-blue-600"
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

              {approvedByPerParam[parameterId] &&
                approvedAtPerParam[parameterId] && (
                  <div className="mt-4 bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
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
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-emerald-800">
                          Approved By: {approvedByPerParam[parameterId]}
                        </p>
                        <p className="text-sm text-emerald-700 mt-1">
                          Approval Date: {approvedAtPerParam[parameterId]}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
            </div>
          </div>
        );
      }

      // If none of the conditions match, return null (no overlay)
      return null;
    },
    (prevProps, nextProps) => {
      return prevProps.parameterId === nextProps.parameterId;
    }
  );

  LockedParameterOverlay.displayName = "LockedParameterOverlay";

  // Loading/Error states
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 flex items-center justify-center p-4">
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
              className="absolute w-64 h-64 rounded-full bg-gradient-to-br from-emerald-200 to-teal-200 blur-3xl"
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
              className="absolute w-80 h-80 rounded-full bg-gradient-to-br from-blue-200 to-cyan-200 blur-3xl"
            />
          </div>

          <div className="relative bg-white rounded-2xl shadow-2xl border border-slate-200 p-12 min-w-[400px]">
            <div className="flex justify-center mb-6">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  ease: "linear",
                }}
                className="relative w-20 h-20"
              >
                <div className="absolute inset-0 rounded-full border-4 border-emerald-100"></div>
                <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-emerald-500 border-r-emerald-500"></div>
                <div className="absolute inset-2 rounded-full bg-gradient-to-br from-emerald-50 to-teal-50"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-emerald-600"
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

            <div className="text-center space-y-3">
              <motion.h3
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-2xl font-bold text-slate-800"
              >
                Loading Worksheet
              </motion.h3>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="flex items-center justify-center gap-2 text-sm text-slate-600"
              >
                <span>Fetching data for</span>
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded font-semibold">
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
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.3, 1, 0.3],
                    }}
                    transition={{
                      duration: 1.2,
                      repeat: Infinity,
                      delay: i * 0.2,
                    }}
                    className="w-2 h-2 rounded-full bg-emerald-500"
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
      <div className="mx-auto my-8 p-6 bg-white shadow-2xl max-w-4xl rounded-xl border border-gray-200 flex items-center justify-center min-h-[600px]">
        <motion.div
          key="error"
          {...animationProps}
          className="flex flex-col justify-center items-center py-20 bg-gradient-to-br from-red-50 to-white rounded-2xl shadow-2xl border-2 border-red-200 w-full min-h-[400px]"
        >
          <motion.div
            {...loadingIconProps}
            className="p-5 rounded-full bg-gradient-to-br from-red-100 to-red-200 mb-6 shadow-lg"
          >
            <Target className="w-14 h-14 text-red-600" />
          </motion.div>
          <span className="text-2xl font-semibold text-red-700 tracking-wide">
            Failed to Load Worksheet
          </span>
          <span className="text-base text-gray-600 mt-3 max-w-md text-center">
            {error}
          </span>
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
      <div className="mx-auto my-8 p-8 bg-white shadow-2xl max-w-4xl border-2 border-emerald-300 rounded-2xl">
        <div className="flex justify-between items-center text-sm mb-6 pb-4 border-b-2 border-emerald-200">
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
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500" />
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/50 via-green-400/50 to-teal-400/50 animate-pulse" />

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

                <div className="flex flex-col items-end gap-2">
                  <div className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-lg border border-white/30">
                    <div className="text-xs text-emerald-50 font-semibold uppercase tracking-wider mb-1">
                      Approved By
                    </div>
                    <div className="text-white font-bold">
                      {worksheetInfo.sample.preparedBy || "HOD LAB"}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

        <div className="my-4 border-2 border-emerald-400 rounded-xl overflow-hidden shadow-lg">
          <div className="flex justify-between items-center px-6 py-4 bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-700">
            <div className="flex items-center gap-4">
              <h1 className="flex items-baseline gap-3 tracking-wide text-white">
                <span className="text-sm font-semibold">Worksheet ID:</span>
                <span className="text-2xl font-extrabold">{worksheetId}</span>
              </h1>

              {/* Dynamic Status Badge */}
              {worksheetInfo?.sample.status && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", duration: 0.6 }}
                  className="ml-4"
                >
                  {worksheetInfo.sample.status.toLowerCase() === "approved" ? (
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
                  ) : worksheetInfo.sample.status.toLowerCase() ===
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
                  ) : (
                    <div className="relative px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-lg border border-white/30 flex items-center gap-2">
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                      <span className="text-xs font-bold text-white uppercase tracking-wide">
                        {worksheetInfo.sample.status}
                      </span>
                    </div>
                  )}
                </motion.div>
              )}
            </div>
          </div>
        </div>

        <div className="my-4 border-2 border-emerald-300 rounded-xl overflow-hidden shadow-md">
          <div className="grid grid-cols-2 border-b-2 border-emerald-300 text-sm bg-gradient-to-r from-emerald-50 to-teal-50">
            <div className="flex items-center px-4 py-3 border-r-2 border-emerald-300">
              <span className="font-bold mr-2 text-emerald-900">
                Registration No:
              </span>
              <span className="font-semibold text-slate-700">
                {worksheetInfo
                  ? worksheetInfo!.sample.registrationNo
                  : registrationNo || "---"}
              </span>
            </div>
            <div className="flex items-center px-4 py-3">
              <span className="font-bold mr-2 text-emerald-900">
                Sample Name:
              </span>
              <span className="font-semibold text-slate-700">
                {worksheetInfo!.sample.sampleName || "---"}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 text-sm bg-white">
            <div className="flex items-center px-4 py-3 border-r-2 border-emerald-300">
              <span className="font-bold mr-2 text-emerald-900">
                Number of Parameters:
              </span>
              <span className="font-semibold text-slate-700">
                {allParameters.length}
              </span>
            </div>
            <div className="flex items-center px-4 py-3">
              <span className="font-bold mr-2 text-emerald-900">Due Date:</span>
              <span className="font-semibold text-slate-700">
                {worksheetInfo!.sample?.dueDate || "---"}
              </span>
            </div>
          </div>
        </div>

        <div className="p-0 my-8">
          <div className="my-4 border-2 border-emerald-400 mb-6 rounded-xl overflow-hidden shadow-md">
            <table className="w-full border-collapse text-sm  shadow-md rounded-xl overflow-hidden">
              <tbody>
                <tr className="border-b-2 border-emerald-400 hover:bg-emerald-50 transition-colors">
                  <td className="w-10 px-4 py-4 border-r-2 border-emerald-400 font-bold text-center bg-gradient-to-br from-emerald-100 to-teal-100 text-emerald-900">
                    1
                  </td>
                  <td className="w-1/3 px-4 py-4 border-r-2 border-emerald-400 font-bold bg-gradient-to-r from-emerald-50 to-white text-emerald-900">
                    Sample Particulars (All relevant information received with
                    sample to be entered):
                  </td>
                  <td className="px-3 py-3 font-medium">
                    {worksheetInfo!.sample.sampleName || "---"}
                  </td>
                </tr>
                <tr className="border-b-2 border-emerald-400 hover:bg-emerald-50 transition-colors">
                  <td className="w-10 px-4 py-4 border-r-2 border-emerald-400 font-bold text-center bg-gradient-to-br from-emerald-100 to-teal-100 text-emerald-900">
                    2
                  </td>
                  <td className="w-1/3 px-4 py-4 border-r-2 border-emerald-400 font-bold bg-gradient-to-r from-emerald-50 to-white text-emerald-900">
                    Test(s) required (all tests and condition to be entered):
                  </td>
                  <td className="px-3 py-3 font-medium">
                    {testsRequiredDisplay || "No parameters added"}
                  </td>
                </tr>
                <tr className="border-b-2 border-emerald-400 hover:bg-emerald-50 transition-colors">
                  <td className="w-10 px-4 py-4 border-r-2 border-emerald-400 font-bold text-center bg-gradient-to-br from-emerald-100 to-teal-100 text-emerald-900">
                    3
                  </td>
                  <td className="w-1/3 px-4 py-4 border-r-2 border-emerald-400 font-bold bg-gradient-to-r from-emerald-50 to-white text-emerald-900">
                    Method(s) of Analysis / testing
                  </td>
                  <td className="px-3 py-3 h-16 font-medium">
                    {methodsRequiredDisplay || "No methods"}
                  </td>
                </tr>
                <tr className="hover:bg-emerald-50 transition-colors">
                  <td className="w-10 px-4 py-4 border-r-2 border-emerald-400 font-bold text-center bg-gradient-to-br from-emerald-100 to-teal-100 text-emerald-900">
                    4
                  </td>
                  <td className="w-1/3 px-4 py-4 border-r-2 border-emerald-400 font-bold bg-gradient-to-r from-emerald-50 to-white text-emerald-900">
                    Raw Data (Observations, Readings, Calculations etc):
                  </td>
                  <td className="px-3 py-3 h-32 align-top"></td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="my-6 p-5 bg-gradient-to-br from-emerald-50 via-white to-emerald-50 border-2 border-emerald-400 rounded-xl shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-emerald-900 flex items-center gap-2">
                <div className="relative">
                  <div className="flex item-center justify-center w-12 h-12 bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <IoFlask className="w-6 h-6 text-white" />
                  </div>
                </div>
                Parameters Management
              </h3>

              {/* ✅ Only show Add Parameter button for HOD LAB */}
              {role === "HOD LAB" &&
                worksheetInfo?.sample.status !== "Approved" && (
                  <div className="relative">
                    <button
                      onClick={() =>
                        setShowParameterDropdown(!showParameterDropdown)
                      }
                      disabled={availableToAdd.length === 0}
                      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-semibold rounded-lg hover:from-emerald-700 hover:to-emerald-800 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-sm"
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
                        bg: "bg-green-100",
                        border: "border-green-300",
                        text: "text-green-700",
                        label: "CREATED",
                        icon: "✓",
                      },
                      "analysis pending": {
                        bg: "bg-orange-100",
                        border: "border-orange-300",
                        text: "text-orange-700",
                        label: "ANALYSIS PENDING",
                        icon: "⏳",
                      },
                      "analysis started": {
                        bg: "bg-blue-100",
                        border: "border-blue-300",
                        text: "text-blue-700",
                        label: "ANALYSIS STARTED",
                        icon: "🔬",
                      },
                      "analysis completed": {
                        bg: "bg-emerald-100",
                        border: "border-emerald-300",
                        text: "text-emerald-700",
                        label: "ANALYSIS COMPLETED",
                        icon: "✅",
                      },
                      approved: {
                        bg: "bg-emerald-100",
                        border: "border-emerald-300",
                        text: "text-emerald-700",
                        label: "APPROVED",
                        icon: "🎉",
                      },
                      "analysis revision": {
                        bg: "bg-amber-100",
                        border: "border-amber-300",
                        text: "text-amber-700",
                        label: "REVISION REQUESTED",
                        icon: "🔄",
                      },
                      disapproved: {
                        bg: "bg-red-100",
                        border: "border-red-300",
                        text: "text-red-700",
                        label: "DISAPPROVED",
                        icon: "❌",
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
                        className={`relative flex items-center justify-between mt-5 p-4 rounded-xl shadow-inner transition-all duration-300 ${
                          isLocked
                            ? "bg-gradient-to-r from-slate-100 via-slate-50 to-slate-100 border-2 border-slate-300"
                            : "bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 border-2 border-emerald-200"
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
                              className={`font-semibold text-sm ${
                                isLocked ? "text-slate-700" : "text-emerald-900"
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
                              <span className="text-xs">
                                {currentStatus.icon}
                              </span>
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
                            className={`text-xs ${
                              isLocked ? "text-slate-600" : "text-emerald-600"
                            }`}
                          >
                            {param.paraCode} • {param.methodName}
                          </div>

                          {analyzedByPerParam[param.id] && (
                            <div
                              className={`mt-1 text-xs font-medium ${
                                isLocked ? "text-slate-700" : "text-blue-700"
                              }`}
                            >
                              Assigned to:{" "}
                              {analysts.find(
                                (a) =>
                                  a.employeeId === analyzedByPerParam[param.id]
                              )?.username || "Unknown"}
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
                            ${
                              selectedParamsForDetail.includes(param.id)
                                ? "bg-orange-50 border-orange-200 text-orange-700 hover:bg-orange-100 shadow-sm"
                                : "bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100 shadow-sm"
                            }
                          `}
                          >
                            {/* The "Dot" Indicator - Classic status signal */}
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${
                                selectedParamsForDetail.includes(param.id)
                                  ? "bg-orange-500 animate-pulse"
                                  : "bg-emerald-500"
                              }`}
                            />

                            <span>
                              {selectedParamsForDetail.includes(param.id)
                                ? "HIDE DETAILS"
                                : "VIEW DETAILS"}
                            </span>

                            {/* Subtle chevron icon for a classic feel */}
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className={`h-3 w-3 transition-transform duration-200 ${
                                selectedParamsForDetail.includes(param.id)
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

                          {role === "HOD LAB" && !isLocked && (
                            <motion.button
                              onClick={() => handleRemoveParameter(param.id)}
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
                className="text-center py-12 text-gray-500 bg-gradient-to-br from-gray-50 via-white to-gray-50 rounded-2xl border-2 border-dashed border-gray-300 shadow-inner"
                layout
              >
                <div className="inline-block">
                  <Target className="w-14 h-14 text-gray-300" />
                </div>
                <p className="text-base font-bold text-gray-800 mb-2">
                  No parameters added yet
                </p>
                <p className="text-sm text-gray-600 max-w-md mx-auto">
                  {role === "HOD LAB"
                    ? 'Click the "Add Parameters" button above to add parameters'
                    : "HOD LAB will add parameters for analysis"}
                </p>
              </motion.div>
            )}
          </div>

          <AnimatePresence>
            {isSaving && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-4 p-3 bg-blue-50 border-2 border-blue-300 rounded-xl flex items-center gap-3"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full"
                />
                <span className="text-sm font-semibold text-blue-800">
                  Saving parameter assignment to database...
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          {addedParameters
            .filter((param) => selectedParamsForDetail.includes(param.id))
            .map((selectedParam) => {
              const isLocked = isParameterLocked(selectedParam?.id);
              const isEditableForScientist = isParameterEditableForScientist(
                selectedParam?.id
              );

              const shouldDisableContent =
                (role === "HOD LAB" && isLocked) ||
                (role === "Scientist" && !isEditableForScientist);

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
                      {/* Header Section */}
                      <div className="relative bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 px-6 py-4 border-b border-slate-200">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="relative">
                              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                                <svg
                                  className="w-6 h-6 text-emerald-600"
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
                              <h3 className="text-lg font-bold text-slate-800 tracking-tight">
                                Parameter Overview
                              </h3>
                              <p className="text-slate-600 text-sm font-medium mt-0.5">
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
                            className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/60 backdrop-blur-sm border border-slate-200 hover:bg-white hover:border-slate-300 transition-all duration-200"
                          >
                            <span className="text-slate-600 text-lg font-bold">
                              ✕
                            </span>
                          </motion.button>
                        </div>
                      </div>

                      {/* Content Section */}
                      <div className="p-6 bg-slate-50 space-y-6">
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

                        {/* Assigned Analyst Section */}

                        {role === "HOD LAB" && (
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
                                    {!isLocked && (
                                      <motion.button
                                      onClick={() =>
                                        handleReassignAnalyst(selectedParam.id)
                                      }
                                      whileHover={{ scale: 1.02 }}
                                      whileTap={{ scale: 0.98 }}
                                      className="px-3 py-1.5 bg-white/60 backdrop-blur-sm border border-emerald-200 text-emerald-700 text-xs font-semibold rounded-lg hover:bg-white hover:border-emerald-300 transition-all duration-200 flex items-center gap-1.5"
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
                                      <div className="relative w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center ring-2 ring-emerald-200">
                                        <span className="text-white text-lg font-bold">
                                          {analysts
                                            .find(
                                              (a) =>
                                                a.employeeId ===
                                                analyzedByPerParam[
                                                  selectedParam.id
                                                ]
                                            )
                                            ?.username.charAt(0) || "A"}
                                        </span>
                                      </div>
                                    </div>

                                    {/* Analyst Info */}
                                    <div className="flex-1">
                                      <div className="font-semibold text-base text-slate-900 mb-1">
                                        {analysts.find(
                                          (a) =>
                                            a.employeeId ===
                                            analyzedByPerParam[selectedParam.id]
                                        )?.username || "Unknown"}
                                      </div>
                                      <div className="flex items-center gap-2 flex-wrap">
                                        <span className="inline-flex items-center px-3 py-1 bg-emerald-50 border border-emerald-200 rounded-lg text-xs font-semibold text-emerald-700">
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
                                          {analyzedByPerParam[selectedParam.id]}
                                        </span>
                                        <span className="text-slate-400">
                                          •
                                        </span>
                                        <span className="inline-flex items-center px-3 py-1 bg-slate-100 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700">
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
                                              d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                            />
                                          </svg>
                                          {analysts.find(
                                            (a) =>
                                              a.employeeId ===
                                              analyzedByPerParam[
                                                selectedParam.id
                                              ]
                                          )?.role || "Analyst"}
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
                          approvedByPerParam[selectedParam.id]) && (
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
                                  <div className="bg-slate-50 rounded-lg p-4 border border-slate-200 hover:border-emerald-300 transition-all">
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
                                        analysisStartDatePerParam[
                                          selectedParam.id
                                        ]
                                      }
                                    </p>
                                  </div>
                                )}

                                {analysisCompletionDatePerParam[
                                  selectedParam.id
                                ] && (
                                  <div className="bg-slate-50 rounded-lg p-4 border border-slate-200 hover:border-emerald-300 transition-all">
                                    <div className="flex items-center gap-2 mb-2">
                                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
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
                                        analysisCompletionDatePerParam[
                                          selectedParam.id
                                        ]
                                      }
                                    </p>
                                  </div>
                                )}

                                {approvedByPerParam[selectedParam.id] && (
                                  <div className="bg-slate-50 rounded-lg p-4 border border-slate-200 hover:border-emerald-300 transition-all">
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
                                        Approved By
                                      </span>
                                    </div>
                                    <p className="text-sm font-semibold text-slate-900">
                                      {approvedByPerParam[selectedParam.id]}
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
                        shouldDisableContent
                          ? ['Analysis Completed', 'Approved'].includes(parameterStatusPerParam[selectedParam.id]) ? "pointer-events-none opacity-80" : "pointer-events-none opacity-60"
                          : ""
                      }
                    >
                      {/* Instruments Details */}
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-lg font-bold text-emerald-900 flex items-center gap-2.5 tracking-tight mb-3">
                            <span className="w-1.5 h-6 bg-gradient-to-b from-emerald-500 to-emerald-700 rounded-full"></span>
                            Instruments Details:
                          </h3>

                          {role === "HOD LAB" && (
                            <div className="relative" ref={instrumentRef}>
                              <button
                                onClick={() =>
                                  setShowInstrumentDropdown(
                                    !showInstrumentDropdown
                                  )
                                }
                                disabled={
                                  isReferenceDataLoading ||
                                  !!referenceDataError ||
                                  instruments.length === 0
                                }
                                className="flex items-center gap-2 p-1.5 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-semibold rounded-2xl hover:from-emerald-700 hover:to-emerald-800 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-xs"
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
                                              (added) => added.id === inst.id
                                            )
                                        )
                                        .map((inst) => (
                                          <button
                                            key={inst.id}
                                            onClick={() =>
                                              handleAddInstrument(
                                                selectedParam.id,
                                                inst
                                              )
                                            }
                                            className="w-full text-left px-3 py-2 hover:bg-emerald-50 border-b border-emerald-200 last:border-b-0 transition-colors text-sm"
                                          >
                                            <div className="font-semibold text-gray-900">
                                              {inst.name}
                                            </div>
                                            <div className="text-xs text-gray-600">
                                              {inst.tag}
                                            </div>
                                          </button>
                                        ))}
                                      {searchFilteredInstruments.filter(
                                        (inst) =>
                                          !addedInstruments[
                                            selectedParam.id
                                          ]?.find(
                                            (added) => added.id === inst.id
                                          )
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
                          )}
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
                                  Instrument Id.
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
                                {role === "HOD LAB" && (
                                  <th className="px-3 py-2 text-center font-bold w-20">
                                    Action
                                  </th>
                                )}
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
                                          {instrument.tag || "---"}
                                        </td>
                                        <td className="px-3 py-2 border-r-2 border-emerald-500">
                                          {instrument.name || "---"}
                                        </td>
                                        <td className="px-3 py-2 border-r-2 border-emerald-500">
                                          {instrument.calibrationDoneDate ||
                                            "---"}
                                        </td>
                                        <td className="px-3 py-2 border-r-2 border-emerald-500">
                                          {instrument.calibrationDueDate ||
                                            "---"}
                                        </td>
                                        {/* ✅ Only show remove button for HOD LAB */}
                                        {role === "HOD LAB" && (
                                          <td className="px-3 py-2 text-center">
                                            <motion.button
                                              onClick={() =>
                                                handleRemoveInstrument(
                                                  selectedParam.id,
                                                  instrument.id
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
                                          </td>
                                        )}
                                      </motion.tr>
                                    )
                                  )
                                ) : (
                                  <tr className="border-2 border-emerald-500">
                                    <td
                                      colSpan={role === "HOD LAB" ? 5 : 4}
                                      className="px-3 py-4 text-center text-gray-500"
                                    >
                                      <div className="flex flex-col items-center gap-2">
                                        <Target className="w-8 h-8 opacity-30" />
                                        <span>
                                          {role === "HOD LAB"
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
                          <h3 className="text-lg font-bold text-emerald-900 flex items-center gap-2.5 tracking-tight mb-3">
                            <span className="w-1.5 h-6 bg-gradient-to-b from-emerald-500 to-emerald-700 rounded-full"></span>
                            Reagents and Chemicals Details:
                          </h3>

                          {/* ✅ Only show Add button for HOD LAB */}
                          {role === "HOD LAB" && (
                            <div className="relative" ref={chemicalRef}>
                              <button
                                onClick={() =>
                                  setShowChemicalDropdown(!showChemicalDropdown)
                                }
                                disabled={
                                  isReferenceDataLoading ||
                                  !!referenceDataError ||
                                  chemicals.length === 0
                                }
                                className="flex items-center gap-2 p-1.5 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-semibold rounded-2xl hover:from-emerald-700 hover:to-emerald-800 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-xs"
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
                                              (added) => added.id === chem.id
                                            )
                                        )
                                        .map((chem) => (
                                          <button
                                            key={chem.id}
                                            onClick={() =>
                                              handleAddChemical(
                                                selectedParam.id,
                                                chem
                                              )
                                            }
                                            className="w-full text-left px-3 py-2 hover:bg-emerald-50 border-b border-emerald-200 last:border-b-0 transition-colors text-sm"
                                          >
                                            <div className="font-semibold text-gray-900">
                                              {chem.name}
                                            </div>
                                            <div className="text-xs text-gray-600">
                                              {chem.make} • Batch:{" "}
                                              {chem.batchNo}
                                            </div>
                                          </button>
                                        ))}
                                      {searchFilteredChemicals.filter(
                                        (chem) =>
                                          !addedChemicals[
                                            selectedParam.id
                                          ]?.find(
                                            (added) => added.id === chem.id
                                          )
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
                          )}
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
                                  Make
                                </th>
                                <th className="px-3 py-2 border-r-2 border-emerald-500 text-left font-bold">
                                  Lot No./Batch No.
                                </th>
                                <th className="px-3 py-2 border-r-2 border-emerald-500 text-left font-bold">
                                  Validity
                                </th>
                                {role === "HOD LAB" && (
                                  <th className="px-3 py-2 text-center font-bold w-20">
                                    Action
                                  </th>
                                )}
                              </tr>
                            </thead>
                            <tbody>
                              <AnimatePresence>
                                {addedChemicals[selectedParam.id]?.length >
                                0 ? (
                                  addedChemicals[selectedParam.id].map(
                                    (chemical) => (
                                      <motion.tr
                                        key={chemical.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                        className="border-2 border-emerald-500 hover:bg-emerald-50 transition-colors"
                                      >
                                        <td className="px-3 py-2 border-r-2 border-emerald-500">
                                          {chemical.name || "---"}
                                        </td>
                                        <td className="px-3 py-2 border-r-2 border-emerald-500">
                                          {chemical.make || "---"}
                                        </td>
                                        <td className="px-3 py-2 border-r-2 border-emerald-500">
                                          {chemical.batchNo || "---"}
                                        </td>
                                        <td className="px-3 py-2 border-r-2 border-emerald-500">
                                          {chemical.validity || "---"}
                                        </td>
                                        {/* ✅ Only show remove button for HOD LAB */}
                                        {role === "HOD LAB" && (
                                          <td className="px-3 py-2 text-center">
                                            <motion.button
                                              onClick={() =>
                                                handleRemoveChemical(
                                                  selectedParam.id,
                                                  chemical.id
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
                                          </td>
                                        )}
                                      </motion.tr>
                                    )
                                  )
                                ) : (
                                  <tr className="border-2 border-emerald-500">
                                    <td
                                      colSpan={role === "HOD LAB" ? 5 : 4}
                                      className="px-3 py-4 text-center text-gray-500"
                                    >
                                      <div className="flex flex-col items-center gap-2">
                                        <Target className="w-8 h-8 opacity-30" />
                                        <span>
                                          {role === "HOD LAB"
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

                      {/* Standards Used - Dynamic with Add/Remove */}
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-lg font-bold text-emerald-900 flex items-center gap-2.5 tracking-tight mb-3">
                            <span className="w-1.5 h-6 bg-gradient-to-b from-emerald-500 to-emerald-700 rounded-full"></span>
                            Standards Details:
                          </h3>

                          {/* ✅ Only show Add button for HOD LAB */}
                          {role === "HOD LAB" && (
                            <div className="relative" ref={standardRef}>
                              <button
                                onClick={() =>
                                  setShowStandardDropdown(!showStandardDropdown)
                                }
                                disabled={
                                  isReferenceDataLoading ||
                                  !!referenceDataError ||
                                  standards.length === 0
                                }
                                className="flex items-center gap-2 p-1.5 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-semibold rounded-2xl hover:from-emerald-700 hover:to-emerald-800 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-xs"
                              >
                                <Plus className="w-4 h-4" />
                              </button>

                              <AnimatePresence>
                                {showStandardDropdown && (
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
                                          placeholder="Search standards..."
                                          value={standardSearch}
                                          onChange={(e) =>
                                            setStandardSearch(e.target.value)
                                          }
                                          className="w-full pl-10 pr-3 py-2 border border-emerald-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                        />
                                      </div>
                                    </div>
                                    <div className="max-h-64 overflow-y-auto">
                                      {searchFilteredStandards
                                        .filter(
                                          (std) =>
                                            !addedStandards[
                                              selectedParam.id
                                            ]?.find(
                                              (added) => added.id === std.id
                                            )
                                        )
                                        .map((std) => (
                                          <button
                                            key={std.id}
                                            onClick={() =>
                                              handleAddStandard(
                                                selectedParam.id,
                                                std
                                              )
                                            }
                                            className="w-full text-left px-3 py-2 hover:bg-emerald-50 border-b border-emerald-200 last:border-b-0 transition-colors text-sm"
                                          >
                                            <div className="font-semibold text-gray-900">
                                              {std.name}
                                            </div>
                                            <div className="text-xs text-gray-600">
                                              {std.make} • Purity: {std.purity}
                                            </div>
                                          </button>
                                        ))}
                                      {searchFilteredStandards.filter(
                                        (std) =>
                                          !addedStandards[
                                            selectedParam.id
                                          ]?.find(
                                            (added) => added.id === std.id
                                          )
                                      ).length === 0 && (
                                        <div className="px-3 py-4 text-center text-gray-500 text-sm">
                                          {standardSearch
                                            ? "No matching standards"
                                            : "All available standards added"}
                                        </div>
                                      )}
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          )}
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
                                  Name of Standard
                                </th>
                                <th className="px-3 py-2 border-r-2 border-emerald-500 text-left font-bold">
                                  Purity
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
                                {role === "HOD LAB" && (
                                  <th className="px-3 py-2 text-center font-bold w-20">
                                    Action
                                  </th>
                                )}
                              </tr>
                            </thead>
                            <tbody>
                              <AnimatePresence>
                                {addedStandards[selectedParam.id]?.length >
                                0 ? (
                                  addedStandards[selectedParam.id].map(
                                    (standard) => (
                                      <motion.tr
                                        key={standard.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                        className="border-2 border-emerald-500 hover:bg-emerald-50 transition-colors"
                                      >
                                        <td className="px-3 py-2 border-r-2 border-emerald-500">
                                          {standard.name || "---"}
                                        </td>
                                        <td className="px-3 py-2 border-r-2 border-emerald-500">
                                          {standard.purity || "---"}
                                        </td>
                                        <td className="px-3 py-2 border-r-2 border-emerald-500">
                                          {standard.make || "---"}
                                        </td>
                                        <td className="px-3 py-2 border-r-2 border-emerald-500">
                                          {standard.batchNo || "---"}
                                        </td>
                                        <td className="px-3 py-2 border-r-2 border-emerald-500">
                                          {standard.validity || "---"}
                                        </td>
                                        {/* ✅ Only show remove button for HOD LAB */}
                                        {role === "HOD LAB" && (
                                          <td className="px-3 py-2 text-center">
                                            <motion.button
                                              onClick={() =>
                                                handleRemoveStandard(
                                                  selectedParam.id,
                                                  standard.id
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
                                          </td>
                                        )}
                                      </motion.tr>
                                    )
                                  )
                                ) : (
                                  <tr className="border-2 border-emerald-500">
                                    <td
                                      colSpan={role === "HOD LAB" ? 6 : 5}
                                      className="px-3 py-4 text-center text-gray-500"
                                    >
                                      <div className="flex flex-col items-center gap-2">
                                        <Target className="w-8 h-8 opacity-30" />
                                        <span>
                                          {role === "HOD LAB"
                                            ? 'No standards added. Click "Add Standard" to add.'
                                            : "No standards added yet."}
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

                      {/* Preparation of Diluent */}
                      <div className="mb-4">
                        <h3 className="text-lg font-bold text-emerald-900 flex items-center gap-2.5 tracking-tight mb-3">
                          <span className="w-1.5 h-6 bg-gradient-to-b from-emerald-500 to-emerald-700 rounded-full"></span>
                          Preparation of Diluent:
                        </h3>
                        <textarea
                          value={diluentPerParam[selectedParam.id] || ""}
                          onChange={(e) =>
                            handleDiluentChange(
                              selectedParam.id,
                              e.target.value
                            )
                          }
                          placeholder="Enter diluent preparation details..."
                          className="w-full min-h-[100px] border border-emerald-300 rounded-lg p-3 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                          readOnly={role !== "HOD LAB"}
                        />
                      </div>

                      {/* ============= PREPARATIONS MANAGEMENT SECTION ============= */}
                      <div className="mb-8 p-6 bg-gradient-to-br from-emerald-50 via-teal-50 to-emerald-50 border-2 border-emerald-400 rounded-2xl shadow-2xl">
                        <div className="flex items-center justify-between mb-6">
                          <div className="flex items-center gap-3">
                            <div className="relative">
                              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg">
                                <BiTestTube className="w-6 h-6 text-white" />
                              </div>
                            </div>
                            <div>
                              <h3 className="text-xl font-bold text-emerald-900 tracking-tight">
                                Preparations Management
                              </h3>
                              <p className="text-xs text-emerald-600 font-medium">
                                Configure analysis preparations for this
                                parameter
                              </p>
                            </div>
                          </div>

                          {/* ✅ Only show Add Preparations button for HOD LAB */}
                          {role === "HOD LAB" && (
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
                                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-semibold rounded-lg hover:from-emerald-700 hover:to-emerald-800 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-sm"
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
                                    {getAvailablePreparationGroups().map(
                                      (group) => {
                                        const isActive = (
                                          activePreparationGroups[
                                            selectedParam.id
                                          ] || []
                                        ).includes(group.id);
                                        return (
                                          <button
                                            key={group.id}
                                            onClick={() =>
                                              handleTogglePreparationGroup(
                                                selectedParam.id,
                                                group.id
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
                                      }
                                    )}
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          )}
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

                              groupInfo[groupId] = {
                                label: group.label,
                                color: group.color,
                              };
                            });

                            const colorClasses = {
                              emerald: {
                                bg: "bg-gradient-to-br from-emerald-100 to-teal-100",
                                text: "text-emerald-900",
                                border: "border-emerald-400",
                                glow: "shadow-emerald-200/50",
                                btnBg: "bg-emerald-800",
                              },
                              sky: {
                                bg: "bg-gradient-to-br from-sky-100 to-blue-200",
                                text: "text-sky-900",
                                border: "border-sky-400",
                                glow: "shadow-sky-200/50",
                                btnBg: "bg-sky-800",
                              },
                              orange: {
                                bg: "bg-gradient-to-br from-orange-100 to-amber-200",
                                text: "text-orange-900",
                                border: "border-orange-400",
                                glow: "shadow-orange-200/50",
                                btnBg: "bg-orange-800",
                              },
                              rose: {
                                bg: "bg-gradient-to-br from-rose-100 to-pink-200",
                                text: "text-rose-900",
                                border: "border-rose-400",
                                glow: "shadow-rose-200/50",
                                btnBg: "bg-rose-800",
                              },
                              red: {
                                bg: "bg-gradient-to-br from-red-100 to-rose-200",
                                text: "text-red-900",
                                border: "border-red-400",
                                glow: "shadow-red-200/50",
                                btnBg: "bg-red-800",
                              },
                              indigo: {
                                bg: "bg-gradient-to-br from-indigo-100 to-purple-200",
                                text: "text-indigo-900",
                                border: "border-indigo-400",
                                glow: "shadow-indigo-200/50",
                                btnBg: "bg-indigo-800",
                              },
                              default: {
                                bg: "bg-gradient-to-br from-gray-100 to-gray-200",
                                text: "text-gray-800",
                                border: "border-gray-400",
                                glow: "shadow-gray-200/50",
                                btnBg: "bg-gray-700",
                              },
                            };

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
                                    <div className="h-0.5 flex-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent"></div>
                                    <div className="flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-full shadow-lg">
                                      <span className="text-xs font-bold text-white uppercase tracking-wider">
                                        Active Preparation Groups
                                      </span>
                                      <span className="px-2 py-0.5 bg-white/20 backdrop-blur-sm rounded-full text-xs font-bold text-white">
                                        {Object.keys(groupInfo).length}
                                      </span>
                                    </div>
                                    <div className="h-0.5 flex-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent"></div>
                                  </div>

                                  <motion.div layout>
                                    <div className="flex flex-wrap gap-3">
                                      {Object.entries(groupInfo).map(
                                        ([groupId, info]) => {
                                          const colors =
                                            info &&
                                            typeof info === "object" &&
                                            "color" in info
                                              ? colorClasses[
                                                  info.color as keyof typeof colorClasses
                                                ] || colorClasses.default
                                              : colorClasses.default;

                                          return (
                                            <motion.div
                                              key={groupId}
                                              initial={{
                                                opacity: 0,
                                                scale: 0.8,
                                                y: 20,
                                              }}
                                              animate={{
                                                opacity: 1,
                                                scale: 1,
                                                y: 0,
                                              }}
                                              exit={{
                                                opacity: 0,
                                                scale: 0.8,
                                                y: 20,
                                              }}
                                              whileHover={{ scale: 1.05 }}
                                              className={`group relative inline-flex items-center gap-3 py-2 px-4 ${colors.bg} ${colors.text} ${colors.border} border-2 rounded-lg font-semibold shadow-lg ${colors.glow} hover:shadow-xl transition-all duration-300 overflow-hidden`}
                                            >
                                              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>

                                              <div className="flex items-center gap-3 relative z-10">
                                                <span className="font-bold text-sm">
                                                  {info.label}
                                                </span>

                                                {/* {info.count > 0 && (
                                            <span
                                              className={`flex items-center justify-center min-w-[1.75rem] h-7 px-2 ${colors.bg}/50 backdrop-blur-sm rounded-md text-xs font-bold`}
                                            >
                                              {info.count}
                                            </span>
                                          )} */}
                                              </div>

                                              <motion.button
                                                onClick={() =>
                                                  handleTogglePreparationGroup(
                                                    selectedParam.id,
                                                    groupId
                                                  )
                                                }
                                                whileHover={{
                                                  scale: 1.2,
                                                  rotate: 90,
                                                }}
                                                whileTap={{ scale: 0.9 }}
                                                className={`relative z-10 w-5 h-5 flex items-center justify-center rounded-full ${colors.btnBg} hover:bg-red-500 text-gray-600 hover:text-white transition-all font-bold border-1 border-white/50 hover:border-red-600 shadow-sm`}
                                                title={`Remove ${info.label} group`}
                                              >
                                                <span className="text-[9px] text-white inline-flex items-center justify-center h-full w-full">
                                                  ✕
                                                </span>
                                              </motion.button>
                                            </motion.div>
                                          );
                                        }
                                      )}
                                    </div>

                                    <motion.div
                                      initial={{ opacity: 0, y: 10 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      className="mt-5 p-4 bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 border-2 border-emerald-200 rounded-xl shadow-inner"
                                    >
                                      <div className="flex items-start gap-3">
                                        <div className="w-8 h-8 flex-shrink-0 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center shadow-md">
                                          <span className="text-white text-lg">
                                            💡
                                          </span>
                                        </div>
                                        <div className="flex-1">
                                          <p className="text-sm text-emerald-900 font-semibold mb-1">
                                            Quick Guide
                                          </p>
                                          <p className="text-xs text-emerald-700 leading-relaxed">
                                            Click the{" "}
                                            <span className="inline-flex items-center justify-center w-5 h-5 bg-white rounded-full text-red-500 font-bold mx-1">
                                              ✕
                                            </span>{" "}
                                            button to remove a preparation group
                                            and all its data. The number badge
                                            shows total items in the group. Use
                                            <strong>
                                              "Add Preparation"
                                            </strong>{" "}
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
                                  <strong className="text-emerald-700">
                                    "Add Preparation"
                                  </strong>{" "}
                                  button above to select preparation groups for
                                  this parameter
                                </p>
                              </motion.div>
                            );
                          })()}
                        </AnimatePresence>
                      </div>
                      {/* ============= END OF PREPARATIONS MANAGEMENT SECTION ============= */}

                      {/* ============= ASSAY GROUP CARD ============= */}
                      {(
                        activePreparationGroups[selectedParam.id] || []
                      ).includes("assay") && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="relative mb-10 p-8 rounded-2xl border-2 border-red-200/50 bg-gradient-to-br from-red-50/40 via-white/60 to-rose-50/40 backdrop-blur-sm shadow-2xl hover:shadow-red-200/50 transition-all duration-500 overflow-hidden hover:scale-[1.01]"
                        >
                          {/* Decorative elements */}
                          <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-red-400/10 to-transparent rounded-bl-full -z-10" />
                          <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-rose-400/10 to-transparent rounded-tr-full -z-10" />

                          {/* Card Header */}
                          <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-4">
                              <div className="relative">
                                <div className="absolute inset-0 bg-red-500/20 blur-xl rounded-full" />
                                <div className="relative w-12 h-12 bg-gradient-to-br from-red-500 to-rose-600 rounded-2xl flex items-center justify-center shadow-lg transform hover:rotate-6 transition-transform duration-300">
                                  <BiTestTube className="w-6 h-6 text-white" />
                                </div>
                              </div>
                              <div>
                                <h2 className="text-xl font-bold text-red-900 tracking-tight">
                                  Assay Analysis
                                </h2>
                                <p className="text-sm text-red-600/80 font-medium">
                                  Standard, Sample & Calculations
                                </p>
                              </div>
                            </div>

                            <div className="px-4 py-1 bg-gradient-to-r from-red-100 to-rose-100 border-2 border-red-300/50 rounded-full shadow-sm">
                              <span className="text-xs font-bold text-red-700">
                                {(
                                  standardPreparationPerParam[
                                    selectedParam.id
                                  ] || []
                                ).length +
                                  (
                                    samplePreparationPerParam[
                                      selectedParam.id
                                    ] || []
                                  ).length +
                                  (
                                    calculationsAssayPerParam[
                                      selectedParam.id
                                    ] || []
                                  ).length}{" "}
                                Items
                              </span>
                            </div>
                          </div>

                          {/* Standard & Sample Preparations Section */}
                          <div className="mb-8">
                            <div className="flex items-center justify-between mb-4 px-2">
                              <h3 className="text-lg font-bold text-red-900 flex items-center gap-2.5 tracking-tight">
                                <span className="w-1.5 h-6 bg-gradient-to-b from-red-500 to-rose-700 rounded-full"></span>
                                Standard & Sample Preparations
                              </h3>
                              {role === "HOD LAB" && (
                                <button
                                  onClick={() =>
                                    handleAddStandardPreparation(
                                      selectedParam.id
                                    )
                                  }
                                  className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-red-600 to-rose-700 text-white font-semibold rounded-xl hover:from-red-700 hover:to-rose-800 transition-all duration-200 shadow-md hover:shadow-lg text-sm transform"
                                >
                                  <Plus className="w-4 h-4" />
                                  Add Preparation
                                </button>
                              )}
                            </div>

                            <AnimatePresence>
                              {(
                                standardPreparationPerParam[selectedParam.id] ||
                                []
                              ).map((standardPreparation: any, idx: number) => {
                                const assignedStandard = (
                                  addedStandards[selectedParam.id] || []
                                ).find(
                                  (std) =>
                                    std.id ===
                                    standardPreparation.assignedStandardId
                                );

                                const correspondingSample =
                                  (samplePreparationPerParam[
                                    selectedParam.id
                                  ] || [])[idx];

                                return (
                                  <div
                                    key={standardPreparation.id}
                                    className="mb-6"
                                  >
                                    <div className="overflow-hidden">
                                      <StandardPreparationDetail
                                        standardPreparation={
                                          standardPreparation
                                        }
                                        assignedStandard={
                                          assignedStandard || null
                                        }
                                        onStepChange={(
                                          standardPreparationId,
                                          stepName,
                                          field,
                                          newValue
                                        ) =>
                                          handleStandardPreparationStepChange(
                                            selectedParam.id,
                                            standardPreparationId,
                                            stepName,
                                            field,
                                            newValue
                                          )
                                        }
                                        onRemove={() =>
                                          handleRemoveStandardPreparation(
                                            selectedParam.id,
                                            standardPreparation.id
                                          )
                                        }
                                        role={role}
                                      />
                                    </div>

                                    {correspondingSample && (
                                      <div className="mt-4">
                                        <div className="overflow-hidden">
                                          <SamplePreparationDetail
                                            samplePreparation={
                                              correspondingSample
                                            }
                                            assignedStandard={
                                              assignedStandard || null
                                            }
                                            onStepChange={(
                                              samplePreparationId,
                                              stepName,
                                              field,
                                              newValue
                                            ) =>
                                              handleSamplePreparationStepChange(
                                                selectedParam.id,
                                                samplePreparationId,
                                                stepName,
                                                field,
                                                newValue
                                              )
                                            }
                                            onRemove={() =>
                                              handleRemoveSamplePreparation(
                                                selectedParam.id,
                                                correspondingSample.id
                                              )
                                            }
                                            role={role}
                                          />
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </AnimatePresence>

                            {(
                              standardPreparationPerParam[selectedParam.id] ||
                              []
                            ).length === 0 && (
                              <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="relative overflow-hidden text-center py-16 bg-gradient-to-br from-red-50 via-white to-rose-50 border-2 border-dashed border-red-300 rounded-2xl shadow-inner"
                              >
                                <div className="absolute inset-0 opacity-5">
                                  <div className="absolute top-0 left-1/4 w-64 h-64 bg-red-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" />
                                  <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-rose-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-1000" />
                                </div>

                                <div className="relative z-10">
                                  <div className="inline-block p-5 bg-white rounded-full shadow-lg mb-4">
                                    <Target className="w-14 h-14 text-red-400" />
                                  </div>
                                  <p className="text-lg font-bold text-red-900 mb-2">
                                    No preparations added yet
                                  </p>
                                  <p className="text-sm text-red-600/80 max-w-md mx-auto mb-4">
                                    Click "Add Preparation" to create your first
                                    standard and sample preparation
                                  </p>
                                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-100/50 rounded-lg border border-red-200">
                                    <div className="w-2 h-2 bg-red-500 rounded-full animate-ping" />
                                    <span className="text-xs font-semibold text-red-700">
                                      Ready to start
                                    </span>
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </div>

                          {standardPreparationPerParam[selectedParam.id]
                            ?.length > 0 &&
                            samplePreparationPerParam[selectedParam.id]
                              ?.length > 0 && (
                              <>
                                {/* Visual Separator */}
                                <div className="flex items-center gap-4 my-8">
                                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-red-300 to-transparent" />
                                  <div className="px-4 py-2 bg-gradient-to-r from-red-100 to-rose-100 rounded-lg border border-red-300/50 shadow-sm">
                                    <span className="text-xs font-bold text-red-700 uppercase tracking-wider flex items-center gap-2">
                                      <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                                      Calculations
                                    </span>
                                  </div>
                                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-red-300 to-transparent" />
                                </div>

                                {/* Calculations Section */}
                                <div className="relative p-6 rounded-xl border-2 border-red-300/30 bg-white/50 backdrop-blur-sm shadow-lg">
                                  <div className="flex items-center justify-between mb-6 px-2">
                                    <h3 className="text-lg font-bold flex items-center gap-3 tracking-tight">
                                      <span className="w-1.5 h-6 bg-gradient-to-b from-red-500 to-rose-700 rounded-full"></span>
                                      <span className="text-red-600">
                                        Calculations for Assay
                                      </span>
                                    </h3>
                                    {role === "HOD LAB" && (
                                      <motion.button
                                        onClick={() =>
                                          handleAddCalculationAssay(
                                            selectedParam.id
                                          )
                                        }
                                        whileHover={{ scale: 1 }}
                                        whileTap={{ scale: 1 }}
                                        className="flex items-center gap-1.5 p-2.5 bg-gradient-to-r from-red-600 to-rose-600 text-white font-semibold rounded-xl hover:from-red-700 hover:to-rose-700 transition-all duration-200 shadow-lg hover:shadow-xl text-xs"
                                      >
                                        <Plus className="w-4 h-4" />
                                        Add Assay Calculation
                                      </motion.button>
                                    )}
                                  </div>

                                  <AnimatePresence>
                                    {(
                                      calculationsAssayPerParam[
                                        selectedParam.id
                                      ] || []
                                    ).map((calculation) => (
                                      <CalculationDetailAssay
                                        key={calculation.id}
                                        calculation={calculation}
                                        standardPreparations={
                                          standardPreparationPerParam[
                                            selectedParam.id
                                          ] || []
                                        }
                                        samplePreparations={
                                          samplePreparationPerParam[
                                            selectedParam.id
                                          ] || []
                                        }
                                        onFieldChange={(
                                          calculationId,
                                          field,
                                          value
                                        ) =>
                                          handleCalculationAssayFieldChange(
                                            selectedParam.id,
                                            calculationId,
                                            field,
                                            value
                                          )
                                        }
                                        onRemove={() =>
                                          handleRemoveCalculationAssay(
                                            selectedParam.id,
                                            calculation.id
                                          )
                                        }
                                        role={role}
                                      />
                                    ))}
                                  </AnimatePresence>

                                  {(
                                    calculationsAssayPerParam[
                                      selectedParam.id
                                    ] || []
                                  ).length === 0 && (
                                    <motion.div
                                      initial={{ opacity: 0, scale: 0.95 }}
                                      animate={{ opacity: 1, scale: 1 }}
                                      className="relative overflow-hidden text-center py-12 bg-gradient-to-br from-red-50 via-white to-rose-50 border-2 border-dashed border-red-300 rounded-xl shadow-inner"
                                    >
                                      <div className="absolute inset-0 opacity-5">
                                        <div className="absolute top-0 left-1/4 w-48 h-48 bg-red-500 rounded-full mix-blend-multiply filter blur-2xl animate-pulse" />
                                      </div>

                                      <div className="relative z-10">
                                        <div className="inline-block p-4 bg-white rounded-full shadow-md mb-3">
                                          <Target className="w-10 h-10 text-red-400" />
                                        </div>
                                        <p className="font-semibold text-base text-red-900 mb-1">
                                          No calculations added yet
                                        </p>
                                        <p className="text-xs text-red-600/80 max-w-sm mx-auto">
                                          Click "Add Calculation" to begin
                                        </p>
                                      </div>
                                    </motion.div>
                                  )}
                                </div>
                              </>
                            )}
                        </motion.div>
                      )}

                      {/* ============= LOD GROUP CARD ============= */}
                      {(
                        activePreparationGroups[selectedParam.id] || []
                      ).includes("lod") && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="relative mb-10 p-8 rounded-2xl border-2 border-sky-200/50 bg-gradient-to-br from-sky-50/40 via-white/60 to-blue-50/40 backdrop-blur-sm shadow-2xl hover:shadow-sky-200/50 transition-all duration-500 overflow-hidden hover:scale-[1.01]"
                        >
                          {/* Decorative elements */}
                          <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-sky-400/10 to-transparent rounded-bl-full -z-10" />
                          <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-blue-400/10 to-transparent rounded-tr-full -z-10" />

                          {/* Card Header */}
                          <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-4">
                              <div className="relative">
                                <div className="absolute inset-0 bg-sky-500/20 blur-xl rounded-full" />
                                <div className="relative w-12 h-12 bg-gradient-to-br from-sky-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg transform hover:rotate-6 transition-transform duration-300">
                                  <BiTestTube className="w-6 h-6 text-white" />
                                </div>
                              </div>
                              <div>
                                <h2 className="text-xl font-bold text-sky-900 tracking-tight">
                                  LOD Analysis
                                </h2>
                                <p className="text-sm text-sky-600/80 font-medium">
                                  Loss on Drying - Sample & Calculations
                                </p>
                              </div>
                            </div>

                            <div className="px-4 py-1 bg-gradient-to-r from-sky-100 to-blue-100 border-2 border-sky-300/50 rounded-full shadow-sm">
                              <span className="text-xs font-bold text-sky-700">
                                {(
                                  samplePreparationLodPerParam[
                                    selectedParam.id
                                  ] || []
                                ).length +
                                  (
                                    calculationsLodPerParam[selectedParam.id] ||
                                    []
                                  ).length}{" "}
                                Items
                              </span>
                            </div>
                          </div>

                          {/* Sample Preparation for LOD */}
                          <div className="mb-8">
                            <div className="flex items-center justify-between mb-4 px-2">
                              <h3 className="text-lg font-bold text-sky-700 flex items-center gap-2.5 tracking-tight">
                                <span className="w-1.5 h-6 bg-gradient-to-b from-sky-500 to-blue-700 rounded-full"></span>
                                Sample Preparations for LOD
                              </h3>
                              {role === "HOD LAB" && (
                                <button
                                  onClick={() =>
                                    handleAddSamplePreparationLod(
                                      selectedParam.id
                                    )
                                  }
                                  className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-sky-600 to-blue-700 text-white font-semibold rounded-xl hover:from-sky-700 hover:to-blue-800 transition-all duration-200 shadow-md hover:shadow-lg transform text-sm"
                                >
                                  <Plus className="w-4 h-4" />
                                  Add Preparation
                                </button>
                              )}
                            </div>

                            <AnimatePresence>
                              {(
                                samplePreparationLodPerParam[
                                  selectedParam.id
                                ] || []
                              ).map((samplePreparationLod) => (
                                <div
                                  className="overflow-hidden"
                                  key={samplePreparationLod.id}
                                >
                                  <SamplePreparationLodDetail
                                    samplePreparationLod={samplePreparationLod}
                                    onStepChange={(
                                      samplePreparationLodId,
                                      stepName,
                                      field,
                                      newValue
                                    ) =>
                                      handleSamplePreparationLodStepChange(
                                        selectedParam.id,
                                        samplePreparationLodId,
                                        stepName,
                                        field,
                                        newValue
                                      )
                                    }
                                    onRemove={() =>
                                      handleRemoveSamplePreparationLod(
                                        selectedParam.id,
                                        samplePreparationLod.id
                                      )
                                    }
                                    role={role}
                                  />
                                </div>
                              ))}
                            </AnimatePresence>

                            {(
                              samplePreparationLodPerParam[selectedParam.id] ||
                              []
                            ).length === 0 && (
                              <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="relative overflow-hidden text-center py-16 bg-gradient-to-br from-sky-50 via-white to-blue-50 border-2 border-dashed border-sky-300 rounded-2xl shadow-inner"
                              >
                                <div className="absolute inset-0 opacity-5">
                                  <div className="absolute top-0 left-1/4 w-64 h-64 bg-sky-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" />
                                  <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-1000" />
                                </div>

                                <div className="relative z-10">
                                  <div className="inline-block p-5 bg-white rounded-full shadow-lg mb-4">
                                    <Target className="w-14 h-14 text-sky-400" />
                                  </div>
                                  <p className="text-lg font-bold text-sky-900 mb-2">
                                    No sample preparations added yet
                                  </p>
                                  <p className="text-sm text-sky-600/80 max-w-md mx-auto mb-4">
                                    Click the add button to create LOD sample
                                    preparation
                                  </p>
                                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-sky-100/50 rounded-lg border border-sky-200">
                                    <div className="w-2 h-2 bg-sky-500 rounded-full animate-ping" />
                                    <span className="text-xs font-semibold text-sky-700">
                                      Ready to start
                                    </span>
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </div>

                          {samplePreparationLodPerParam[selectedParam.id]
                            ?.length > 0 && (
                            <>
                              {/* Visual Separator */}
                              <div className="flex items-center gap-4 my-8">
                                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-sky-300 to-transparent" />
                                <div className="px-4 py-2 bg-gradient-to-r from-sky-100 to-blue-100 rounded-lg border border-sky-300/50 shadow-sm">
                                  <span className="text-xs font-bold text-sky-700 uppercase tracking-wider flex items-center gap-2">
                                    <span className="w-2 h-2 bg-sky-500 rounded-full animate-pulse" />
                                    Calculations
                                  </span>
                                </div>
                                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-sky-300 to-transparent" />
                              </div>

                              {/* Calculations for LOD */}
                              <div className="relative p-6 rounded-xl border-2 border-sky-300/30 bg-white/50 backdrop-blur-sm shadow-lg">
                                <div className="flex items-center justify-between mb-6 px-2">
                                  <h3 className="text-lg font-bold flex items-center gap-3 tracking-tight">
                                    <span className="w-1.5 h-6 bg-gradient-to-b from-sky-500 to-blue-700 rounded-full"></span>
                                    <span className="text-sky-600">
                                      LOD Calculations
                                    </span>
                                  </h3>
                                  {role === "HOD LAB" && (
                                    <motion.button
                                      onClick={() =>
                                        handleAddCalculationLod(
                                          selectedParam.id
                                        )
                                      }
                                      whileHover={{ scale: 1 }}
                                      whileTap={{ scale: 1 }}
                                      className="flex items-center gap-1.5 p-2.5 bg-gradient-to-r from-sky-600 to-blue-600 text-white font-semibold rounded-xl hover:from-sky-700 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl text-xs"
                                    >
                                      <Plus className="w-4 h-4" />
                                      Add LOD Calculation
                                    </motion.button>
                                  )}
                                </div>

                                <AnimatePresence>
                                  {(
                                    calculationsLodPerParam[selectedParam.id] ||
                                    []
                                  ).map((calculation) => (
                                    <CalculationDetailLod
                                      key={calculation.id}
                                      calculation={calculation}
                                      samplePreparations={
                                        samplePreparationLodPerParam[
                                          selectedParam.id
                                        ] || []
                                      }
                                      onFieldChange={(
                                        calculationId,
                                        field,
                                        value
                                      ) =>
                                        handleCalculationLodFieldChange(
                                          selectedParam.id,
                                          calculationId,
                                          field,
                                          value
                                        )
                                      }
                                      onRemove={() =>
                                        handleRemoveCalculationLod(
                                          selectedParam.id,
                                          calculation.id
                                        )
                                      }
                                      role={role}
                                    />
                                  ))}
                                </AnimatePresence>

                                {(
                                  calculationsLodPerParam[selectedParam.id] ||
                                  []
                                ).length === 0 && (
                                  <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="relative overflow-hidden text-center py-12 bg-gradient-to-br from-sky-50 via-white to-blue-50 border-2 border-dashed border-sky-300 rounded-xl shadow-inner"
                                  >
                                    <div className="absolute inset-0 opacity-5">
                                      <div className="absolute top-0 left-1/4 w-48 h-48 bg-sky-500 rounded-full mix-blend-multiply filter blur-2xl animate-pulse" />
                                    </div>

                                    <div className="relative z-10">
                                      <div className="inline-block p-4 bg-white rounded-full shadow-md mb-3">
                                        <Target className="w-10 h-10 text-sky-400" />
                                      </div>
                                      <p className="font-semibold text-base text-sky-900 mb-1">
                                        No LOD calculations added yet
                                      </p>
                                      <p className="text-xs text-sky-600/80 max-w-sm mx-auto">
                                        Click "Add LOD Calculation" to begin
                                      </p>
                                    </div>
                                  </motion.div>
                                )}
                              </div>
                            </>
                          )}
                        </motion.div>
                      )}

                      {/* ============= ROI GROUP CARD ============= */}
                      {(
                        activePreparationGroups[selectedParam.id] || []
                      ).includes("roi") && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="relative mb-10 p-8 rounded-2xl border-2 border-orange-200/50 bg-gradient-to-br from-orange-50/40 via-white/60 to-amber-50/40 backdrop-blur-sm shadow-2xl hover:shadow-orange-200/50 transition-all duration-500 overflow-hidden hover:scale-[1.01]"
                        >
                          {/* Decorative elements */}
                          <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-orange-400/10 to-transparent rounded-bl-full -z-10" />
                          <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-amber-400/10 to-transparent rounded-tr-full -z-10" />

                          {/* Card Header */}
                          <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-4">
                              <div className="relative">
                                <div className="absolute inset-0 bg-orange-500/20 blur-xl rounded-full" />
                                <div className="relative w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-600 rounded-2xl flex items-center justify-center shadow-lg transform hover:rotate-6 transition-transform duration-300">
                                  <BiTestTube className="w-6 h-6 text-white" />
                                </div>
                              </div>
                              <div>
                                <h2 className="text-xl font-bold text-orange-900 tracking-tight">
                                  ROI Analysis
                                </h2>
                                <p className="text-sm text-orange-600/80 font-medium">
                                  Residue on Ignition - Sample & Calculations
                                </p>
                              </div>
                            </div>

                            <div className="px-4 py-1 bg-gradient-to-r from-orange-100 to-amber-100 border-2 border-orange-300/50 rounded-full shadow-sm">
                              <span className="text-xs font-bold text-orange-700">
                                {(
                                  samplePreparationROIPerParam[
                                    selectedParam.id
                                  ] || []
                                ).length +
                                  (
                                    calculationsROIPerParam[selectedParam.id] ||
                                    []
                                  ).length}{" "}
                                Items
                              </span>
                            </div>
                          </div>

                          {/* Sample Preparation for ROI */}
                          <div className="mb-8">
                            <div className="flex items-center justify-between mb-4 px-2">
                              <h3 className="text-lg font-bold text-amber-700 flex items-center gap-2.5 tracking-tight">
                                <span className="w-1.5 h-6 bg-gradient-to-b from-orange-500 to-amber-700 rounded-full"></span>
                                Sample Preparations for ROI
                              </h3>
                              {role === "HOD LAB" && (
                                <button
                                  onClick={() =>
                                    handleAddSamplePreparationROI(
                                      selectedParam.id
                                    )
                                  }
                                  className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-orange-600 to-amber-700 text-sm text-white font-semibold rounded-xl hover:from-orange-700 hover:to-amber-800 transition-all duration-200 shadow-md hover:shadow-lg transform"
                                >
                                  <Plus className="w-4 h-4" />
                                  Add Preparation
                                </button>
                              )}
                            </div>

                            <AnimatePresence>
                              {(
                                samplePreparationROIPerParam[
                                  selectedParam.id
                                ] || []
                              ).map((samplePreparationROI) => (
                                <div
                                  className="overflow-hidden"
                                  key={samplePreparationROI.id}
                                >
                                  <SamplePreparationROIDetail
                                    samplePreparationROI={samplePreparationROI}
                                    onStepChange={(
                                      samplePreparationROIId,
                                      stepName,
                                      field,
                                      newValue
                                    ) =>
                                      handleSamplePreparationROIStepChange(
                                        selectedParam.id,
                                        samplePreparationROIId,
                                        stepName,
                                        field,
                                        newValue
                                      )
                                    }
                                    onRemove={() =>
                                      handleRemoveSamplePreparationROI(
                                        selectedParam.id,
                                        samplePreparationROI.id
                                      )
                                    }
                                    role={role}
                                  />
                                </div>
                              ))}
                            </AnimatePresence>

                            {(
                              samplePreparationROIPerParam[selectedParam.id] ||
                              []
                            ).length === 0 && (
                              <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="relative overflow-hidden text-center py-16 bg-gradient-to-br from-orange-50 via-white to-amber-50 border-2 border-dashed border-orange-300 rounded-2xl shadow-inner"
                              >
                                <div className="absolute inset-0 opacity-5">
                                  <div className="absolute top-0 left-1/4 w-64 h-64 bg-orange-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" />
                                  <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-amber-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-1000" />
                                </div>

                                <div className="relative z-10">
                                  <div className="inline-block p-5 bg-white rounded-full shadow-lg mb-4">
                                    <Target className="w-14 h-14 text-orange-400" />
                                  </div>
                                  <p className="text-lg font-bold text-orange-900 mb-2">
                                    No sample preparations added yet
                                  </p>
                                  <p className="text-sm text-orange-600/80 max-w-md mx-auto mb-4">
                                    Click the add button to create ROI sample
                                    preparation
                                  </p>
                                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-100/50 rounded-lg border border-orange-200">
                                    <div className="w-2 h-2 bg-orange-500 rounded-full animate-ping" />
                                    <span className="text-xs font-semibold text-orange-700">
                                      Ready to start
                                    </span>
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </div>

                          {samplePreparationROIPerParam[selectedParam.id]
                            ?.length > 0 && (
                            <>
                              {/* Visual Separator */}
                              <div className="flex items-center gap-4 my-8">
                                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-orange-300 to-transparent" />
                                <div className="px-4 py-2 bg-gradient-to-r from-orange-100 to-amber-100 rounded-lg border border-orange-300/50 shadow-sm">
                                  <span className="text-xs font-bold text-orange-700 uppercase tracking-wider flex items-center gap-2">
                                    <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
                                    Calculations
                                  </span>
                                </div>
                                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-orange-300 to-transparent" />
                              </div>

                              {/* Calculations for ROI */}
                              <div className="relative p-6 rounded-xl border-2 border-orange-300/30 bg-white/50 backdrop-blur-sm shadow-lg">
                                <div className="flex items-center justify-between mb-6 px-2">
                                  <h3 className="text-lg font-bold flex items-center gap-3 tracking-tight">
                                    <span className="w-1.5 h-6 bg-gradient-to-b from-amber-500 to-orange-700 rounded-full"></span>
                                    <span className="text-orange-600">
                                      ROI Calculations
                                    </span>
                                  </h3>
                                  {role === "HOD LAB" && (
                                    <motion.button
                                      onClick={() =>
                                        handleAddCalculationROI(
                                          selectedParam.id
                                        )
                                      }
                                      whileHover={{ scale: 1 }}
                                      whileTap={{ scale: 1 }}
                                      className="flex items-center gap-1.5 p-2.5 bg-gradient-to-r from-amber-600 to-orange-600 text-white font-semibold rounded-xl hover:from-amber-700 hover:to-orange-700 transition-all duration-200 shadow-lg hover:shadow-xl text-xs"
                                    >
                                      <Plus className="w-4 h-4" />
                                      Add ROI Calculation
                                    </motion.button>
                                  )}
                                </div>

                                <AnimatePresence>
                                  {(
                                    calculationsROIPerParam[selectedParam.id] ||
                                    []
                                  ).map((calculation) => (
                                    <CalculationDetailROI
                                      key={calculation.id}
                                      calculation={calculation}
                                      samplePreparations={
                                        samplePreparationROIPerParam[
                                          selectedParam.id
                                        ] || []
                                      }
                                      onFieldChange={(
                                        calculationId,
                                        field,
                                        value
                                      ) =>
                                        handleCalculationROIFieldChange(
                                          selectedParam.id,
                                          calculationId,
                                          field,
                                          value
                                        )
                                      }
                                      onRemove={() =>
                                        handleRemoveCalculationROI(
                                          selectedParam.id,
                                          calculation.id
                                        )
                                      }
                                      role={role}
                                    />
                                  ))}
                                </AnimatePresence>

                                {(
                                  calculationsROIPerParam[selectedParam.id] ||
                                  []
                                ).length === 0 && (
                                  <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="relative overflow-hidden text-center py-12 bg-gradient-to-br from-orange-50 via-white to-amber-50 border-2 border-dashed border-orange-300 rounded-xl shadow-inner"
                                  >
                                    <div className="absolute inset-0 opacity-5">
                                      <div className="absolute top-0 left-1/4 w-48 h-48 bg-orange-500 rounded-full mix-blend-multiply filter blur-2xl animate-pulse" />
                                    </div>

                                    <div className="relative z-10">
                                      <div className="inline-block p-4 bg-white rounded-full shadow-md mb-3">
                                        <Target className="w-10 h-10 text-orange-400" />
                                      </div>
                                      <p className="font-semibold text-base text-orange-900 mb-1">
                                        No ROI calculations added yet
                                      </p>
                                      <p className="text-xs text-orange-600/80 max-w-sm mx-auto">
                                        Click "Add ROI Calculation" to begin
                                      </p>
                                    </div>
                                  </motion.div>
                                )}
                              </div>
                            </>
                          )}
                        </motion.div>
                      )}

                      {/* ============= Sulphated Ash GROUP CARD ============= */}
                      {(
                        activePreparationGroups[selectedParam.id] || []
                      ).includes("sulphatedAsh") && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="relative mb-10 p-8 rounded-2xl border-2 border-rose-200/50 bg-gradient-to-br from-rose-50/40 via-white/60 to-pink-50/40 backdrop-blur-sm shadow-2xl hover:shadow-rose-200/50 transition-all duration-500 overflow-hidden hover:scale-[1.01]"
                        >
                          {/* Decorative elements */}
                          <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-rose-400/10 to-transparent rounded-bl-full -z-10" />
                          <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-pink-400/10 to-transparent rounded-tr-full -z-10" />

                          {/* Card Header */}
                          <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-4">
                              <div className="relative">
                                <div className="absolute inset-0 bg-rose-500/20 blur-xl rounded-full" />
                                <div className="relative w-16 h-16 bg-gradient-to-br from-rose-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg transform hover:rotate-6 transition-transform duration-300">
                                  <BiTestTube className="w-8 h-8 text-white" />
                                </div>
                              </div>
                              <div>
                                <h2 className="text-xl font-bold text-rose-900 tracking-tight">
                                  Sulphated Ash Analysis
                                </h2>
                                <p className="text-sm text-rose-600/80 font-medium">
                                  Sulphated Ash - Sample & Calculations
                                </p>
                              </div>
                            </div>

                            <div className="px-4 py-2 bg-gradient-to-r from-rose-100 to-pink-100 border-2 border-rose-300/50 rounded-full shadow-sm">
                              <span className="text-xs font-bold text-rose-700">
                                {(
                                  samplePreparationSulphatedAshPerParam[
                                    selectedParam.id
                                  ] || []
                                ).length +
                                  (
                                    calculationsSulphatedAshPerParam[
                                      selectedParam.id
                                    ] || []
                                  ).length}{" "}
                                Items
                              </span>
                            </div>
                          </div>

                          {/* Sample Preparation for Sulphated Ash */}
                          <div className="mb-8">
                            <div className="flex items-center justify-between mb-4 px-2">
                              <h3 className="text-lg font-bold text-rose-900 flex items-center gap-2.5 tracking-tight">
                                <span className="w-1.5 h-6 bg-gradient-to-b from-rose-500 to-rose-700 rounded-full"></span>
                                Sample Preparations for Sulphated Ash
                              </h3>
                              {role === "HOD LAB" && (
                                <button
                                  onClick={() =>
                                    handleAddSamplePreparationSulphatedAsh(
                                      selectedParam.id
                                    )
                                  }
                                  className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-rose-600 to-rose-700 text-white font-semibold rounded-xl hover:from-rose-700 hover:to-rose-800 transition-all duration-200 shadow-md hover:shadow-lg transform text-sm"
                                >
                                  <Plus className="w-4 h-4" />
                                  Add Preparation
                                </button>
                              )}
                            </div>

                            <AnimatePresence>
                              {(
                                samplePreparationSulphatedAshPerParam[
                                  selectedParam.id
                                ] || []
                              ).map((samplePreparationSulphatedAsh) => (
                                <div
                                  className="overflow-hidden"
                                  key={samplePreparationSulphatedAsh.id}
                                >
                                  <SamplePreparationSulphatedAshDetail
                                    samplePreparationSulphatedAsh={
                                      samplePreparationSulphatedAsh
                                    }
                                    onStepChange={(
                                      samplePreparationSulphatedAshId,
                                      stepName,
                                      field,
                                      newValue
                                    ) =>
                                      handleSamplePreparationSulphatedAshStepChange(
                                        selectedParam.id,
                                        samplePreparationSulphatedAshId,
                                        stepName,
                                        field,
                                        newValue
                                      )
                                    }
                                    onRemove={() =>
                                      handleRemoveSamplePreparationSulphatedAsh(
                                        selectedParam.id,
                                        samplePreparationSulphatedAsh.id
                                      )
                                    }
                                    role={role}
                                  />
                                </div>
                              ))}
                            </AnimatePresence>

                            {(
                              samplePreparationSulphatedAshPerParam[
                                selectedParam.id
                              ] || []
                            ).length === 0 && (
                              <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="relative overflow-hidden text-center py-16 bg-gradient-to-br from-rose-50 via-white to-pink-50 border-2 border-dashed border-rose-300 rounded-2xl shadow-inner"
                              >
                                <div className="absolute inset-0 opacity-5">
                                  <div className="absolute top-0 left-1/4 w-64 h-64 bg-rose-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" />
                                  <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-1000" />
                                </div>

                                <div className="relative z-10">
                                  <div className="inline-block p-5 bg-white rounded-full shadow-lg mb-4">
                                    <Target className="w-14 h-14 text-rose-400" />
                                  </div>
                                  <p className="text-lg font-bold text-rose-900 mb-2">
                                    No sample preparations added yet
                                  </p>
                                  <p className="text-sm text-rose-600/80 max-w-md mx-auto mb-4">
                                    Click the add button to create Sulphated Ash
                                    sample preparation
                                  </p>
                                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-rose-100/50 rounded-lg border border-rose-200">
                                    <div className="w-2 h-2 bg-rose-500 rounded-full animate-ping" />
                                    <span className="text-xs font-semibold text-rose-700">
                                      Ready to start
                                    </span>
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </div>

                          {samplePreparationSulphatedAshPerParam[
                            selectedParam.id
                          ]?.length > 0 && (
                            <>
                              {/* Visual Separator */}
                              <div className="flex items-center gap-4 my-8">
                                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-rose-300 to-transparent" />
                                <div className="px-4 py-2 bg-gradient-to-r from-rose-100 to-pink-100 rounded-lg border border-rose-300/50 shadow-sm">
                                  <span className="text-xs font-bold text-rose-700 uppercase tracking-wider flex items-center gap-2">
                                    <span className="w-2 h-2 bg-rose-500 rounded-full animate-pulse" />
                                    Calculations
                                  </span>
                                </div>
                                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-rose-300 to-transparent" />
                              </div>

                              {/* Calculations for Sulphated Ash */}
                              <div className="relative p-6 rounded-xl border-2 border-rose-300/30 bg-white/50 backdrop-blur-sm shadow-lg">
                                <div className="flex items-center justify-between mb-6 px-2">
                                  <h3 className="text-lg font-bold flex items-center gap-3 tracking-tight">
                                    <span className="w-1.5 h-6 bg-gradient-to-b from-pink-500 to-rose-700 rounded-full"></span>
                                    <span className="text-pink-600">
                                      Sulphated Ash Calculations
                                    </span>
                                  </h3>
                                  {role === "HOD LAB" && (
                                    <motion.button
                                      onClick={() =>
                                        handleAddCalculationSulphatedAsh(
                                          selectedParam.id
                                        )
                                      }
                                      whileHover={{ scale: 1 }}
                                      whileTap={{ scale: 1 }}
                                      className="flex items-center gap-1.5 p-2.5 bg-gradient-to-r from-pink-600 to-rose-600 text-white font-semibold rounded-xl hover:from-pink-700 hover:to-rose-700 transition-all duration-200 shadow-lg hover:shadow-xl text-xs"
                                    >
                                      <Plus className="w-4 h-4" />
                                      Add Ash Calculation
                                    </motion.button>
                                  )}
                                </div>

                                <AnimatePresence>
                                  {(
                                    calculationsSulphatedAshPerParam[
                                      selectedParam.id
                                    ] || []
                                  ).map((calculation) => (
                                    <CalculationDetailSulphatedAsh
                                      key={calculation.id}
                                      calculation={calculation}
                                      samplePreparations={
                                        samplePreparationSulphatedAshPerParam[
                                          selectedParam.id
                                        ] || []
                                      }
                                      onFieldChange={(
                                        calculationId,
                                        field,
                                        value
                                      ) =>
                                        handleCalculationSulphatedAshFieldChange(
                                          selectedParam.id,
                                          calculationId,
                                          field,
                                          value
                                        )
                                      }
                                      onRemove={() =>
                                        handleRemoveCalculationSulphatedAsh(
                                          selectedParam.id,
                                          calculation.id
                                        )
                                      }
                                      role={role}
                                    />
                                  ))}
                                </AnimatePresence>

                                {(
                                  calculationsSulphatedAshPerParam[
                                    selectedParam.id
                                  ] || []
                                ).length === 0 && (
                                  <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="relative overflow-hidden text-center py-12 bg-gradient-to-br from-rose-50 via-white to-pink-50 border-2 border-dashed border-rose-300 rounded-xl shadow-inner"
                                  >
                                    <div className="absolute inset-0 opacity-5">
                                      <div className="absolute top-0 left-1/4 w-48 h-48 bg-rose-500 rounded-full mix-blend-multiply filter blur-2xl animate-pulse" />
                                    </div>

                                    <div className="relative z-10">
                                      <div className="inline-block p-4 bg-white rounded-full shadow-md mb-3">
                                        <Target className="w-10 h-10 text-rose-400" />
                                      </div>
                                      <p className="font-semibold text-base text-rose-900 mb-1">
                                        No Sulphated Ash calculations added yet
                                      </p>
                                      <p className="text-xs text-rose-600/80 max-w-sm mx-auto">
                                        Click "Add Ash Calculation" to begin
                                      </p>
                                    </div>
                                  </motion.div>
                                )}
                              </div>
                            </>
                          )}
                        </motion.div>
                      )}

                      {/* ============= RESIDUAL SOLVENT GROUP CARD ============= */}
                      {(
                        activePreparationGroups[selectedParam.id] || []
                      ).includes("residualSolvent") && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="relative mb-10 p-8 rounded-2xl border-2 border-indigo-200/50 bg-gradient-to-br from-indigo-50/40 via-white/60 to-purple-50/40 backdrop-blur-sm shadow-2xl hover:shadow-indigo-200/50 transition-all duration-500 overflow-hidden hover:scale-[1.01]"
                        >
                          {/* Decorative elements */}
                          <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-indigo-400/10 to-transparent rounded-bl-full -z-10" />
                          <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-purple-400/10 to-transparent rounded-tr-full -z-10" />

                          {/* Card Header */}
                          <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-4">
                              <div className="relative">
                                <div className="absolute inset-0 bg-indigo-500/20 blur-xl rounded-full" />
                                <div className="relative w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg transform hover:rotate-6 transition-transform duration-300">
                                  <BiTestTube className="w-6 h-6 text-white" />
                                </div>
                              </div>
                              <div>
                                <h2 className="text-xl font-bold text-indigo-900 tracking-tight">
                                  Residual Solvent Analysis
                                </h2>
                                <p className="text-sm text-indigo-600/80 font-medium">
                                  Standard, Sample & Calculations
                                </p>
                              </div>
                            </div>

                            <div className="px-4 py-1 bg-gradient-to-r from-indigo-100 to-purple-100 border-2 border-indigo-300/50 rounded-full shadow-sm">
                              <span className="text-xs font-bold text-indigo-700">
                                {(
                                  standardPreparationRSPerParam[
                                    selectedParam.id
                                  ] || []
                                ).length +
                                  (
                                    samplePreparationRSPerParam[
                                      selectedParam.id
                                    ] || []
                                  ).length +
                                  (
                                    calculationsRSPerParam[selectedParam.id] ||
                                    []
                                  ).length}{" "}
                                Items
                              </span>
                            </div>
                          </div>

                          {/* Combined Preparations Header with Single Add Button */}
                          <div className="mb-8">
                            <div className="flex items-center justify-between mb-4 px-2">
                              <h3 className="text-lg font-bold text-indigo-900 flex items-center gap-2.5 tracking-tight">
                                <span className="w-1.5 h-6 bg-gradient-to-b from-indigo-500 to-blue-700 rounded-full"></span>
                                Standard & Sample Preparations for Residual
                                Solvent
                              </h3>
                              {role === "HOD LAB" && (
                                <button
                                  onClick={() =>
                                    handleAddStandardPreparationRS(
                                      selectedParam.id
                                    )
                                  }
                                  className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-indigo-600 to-blue-700 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-blue-800 transition-all duration-200 shadow-md hover:shadow-lg text-sm transform"
                                >
                                  <Plus className="w-4 h-4" />
                                  Add Preparation
                                </button>
                              )}
                            </div>

                            {/* Preparations List */}
                            <AnimatePresence>
                              {(
                                standardPreparationRSPerParam[
                                  selectedParam.id
                                ] || []
                              ).map((standardPreparation: any, idx: number) => {
                                const assignedStandard = (
                                  addedStandards[selectedParam.id] || []
                                ).find(
                                  (std) =>
                                    std.id ===
                                    standardPreparation.assignedStandardId
                                );

                                const correspondingSample =
                                  (samplePreparationRSPerParam[
                                    selectedParam.id
                                  ] || [])[idx];

                                return (
                                  <div
                                    key={standardPreparation.id}
                                    className="mb-6"
                                  >
                                    <div className="overflow-hidden">
                                      <StandardPreparationDetail
                                        standardPreparation={
                                          standardPreparation
                                        }
                                        assignedStandard={
                                          assignedStandard || null
                                        }
                                        onStepChange={(
                                          standardPreparationId,
                                          stepName,
                                          field,
                                          newValue
                                        ) =>
                                          handleStandardPreparationRSStepChange(
                                            selectedParam.id,
                                            standardPreparationId,
                                            stepName,
                                            field,
                                            newValue
                                          )
                                        }
                                        onRemove={() =>
                                          handleRemoveStandardPreparationRS(
                                            selectedParam.id,
                                            standardPreparation.id
                                          )
                                        }
                                        isRS={true}
                                        role={role}
                                      />
                                    </div>

                                    {/* Corresponding Sample Preparation for RS */}
                                    {correspondingSample && (
                                      <div className="mt-4">
                                        <div className="overflow-hidden">
                                          <SamplePreparationDetail
                                            samplePreparation={
                                              correspondingSample
                                            }
                                            assignedStandard={
                                              assignedStandard || null
                                            }
                                            onStepChange={(
                                              samplePreparationId,
                                              stepName,
                                              field,
                                              newValue
                                            ) =>
                                              handleSamplePreparationRSStepChange(
                                                selectedParam.id,
                                                samplePreparationId,
                                                stepName,
                                                field,
                                                newValue
                                              )
                                            }
                                            onRemove={() =>
                                              handleRemoveSamplePreparationRS(
                                                selectedParam.id,
                                                correspondingSample.id
                                              )
                                            }
                                            isRS={true}
                                            role={role}
                                          />
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </AnimatePresence>

                            {/* Empty State */}
                            {(
                              standardPreparationRSPerParam[selectedParam.id] ||
                              []
                            ).length === 0 && (
                              <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="relative overflow-hidden text-center py-16 bg-gradient-to-br from-indigo-50 via-white to-purple-50 border-2 border-dashed border-indigo-300 rounded-2xl shadow-inner"
                              >
                                <div className="absolute inset-0 opacity-5">
                                  <div className="absolute top-0 left-1/4 w-64 h-64 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" />
                                  <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-1000" />
                                </div>

                                <div className="relative z-10">
                                  <div className="inline-block p-5 bg-white rounded-full shadow-lg mb-4">
                                    <Target className="w-14 h-14 text-indigo-400" />
                                  </div>
                                  <p className="text-lg font-bold text-indigo-900 mb-2">
                                    No preparations added yet
                                  </p>
                                  <p className="text-sm text-indigo-600/80 max-w-md mx-auto mb-4">
                                    Click "Add Preparation" to create standard
                                    and sample preparations for Residual Solvent
                                  </p>
                                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100/50 rounded-lg border border-indigo-200">
                                    <div className="w-2 h-2 bg-indigo-500 rounded-full animate-ping" />
                                    <span className="text-xs font-semibold text-indigo-700">
                                      Ready to start
                                    </span>
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </div>

                          {standardPreparationRSPerParam[selectedParam.id]
                            ?.length > 0 &&
                            samplePreparationRSPerParam[selectedParam.id]
                              ?.length > 0 && (
                              <>
                                {/* Visual Separator */}
                                <div className="flex items-center gap-4 my-8">
                                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-indigo-300 to-transparent" />
                                  <div className="px-4 py-2 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-lg border border-indigo-300/50 shadow-sm">
                                    <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider flex items-center gap-2">
                                      <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />
                                      Calculations
                                    </span>
                                  </div>
                                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-indigo-300 to-transparent" />
                                </div>

                                {/* Calculations for RS */}
                                <div className="relative p-6 rounded-xl border-2 border-indigo-300/30 bg-white/50 backdrop-blur-sm shadow-lg">
                                  <div className="flex items-center justify-between mb-6 px-2">
                                    <h3 className="text-lg font-bold flex items-center gap-3 tracking-tight">
                                      <span className="w-1.5 h-6 bg-gradient-to-b from-indigo-500 to-blue-700 rounded-full"></span>
                                      <span className="text-indigo-600">
                                        Residual Solvent Calculations
                                      </span>
                                    </h3>
                                    {role === "HOD LAB" && (
                                      <motion.button
                                        onClick={() =>
                                          handleAddCalculationRS(
                                            selectedParam.id
                                          )
                                        }
                                        whileHover={{ scale: 1 }}
                                        whileTap={{ scale: 1 }}
                                        className="flex items-center gap-1.5 p-2.5 bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl text-xs"
                                      >
                                        <Plus className="w-4 h-4" />
                                        Add RS Calculation
                                      </motion.button>
                                    )}
                                  </div>

                                  <AnimatePresence>
                                    {(
                                      calculationsRSPerParam[
                                        selectedParam.id
                                      ] || []
                                    ).map((calculation) => (
                                      <CalculationDetailRS
                                        key={calculation.id}
                                        calculation={calculation}
                                        standardPreparations={
                                          standardPreparationRSPerParam[
                                            selectedParam.id
                                          ] || []
                                        }
                                        samplePreparations={
                                          samplePreparationRSPerParam[
                                            selectedParam.id
                                          ] || []
                                        }
                                        onFieldChange={(
                                          calculationId,
                                          field,
                                          value
                                        ) =>
                                          handleCalculationRSFieldChange(
                                            selectedParam.id,
                                            calculationId,
                                            field,
                                            value
                                          )
                                        }
                                        onRemove={() =>
                                          handleRemoveCalculationRS(
                                            selectedParam.id,
                                            calculation.id
                                          )
                                        }
                                        role={role}
                                      />
                                    ))}
                                  </AnimatePresence>

                                  {(
                                    calculationsRSPerParam[selectedParam.id] ||
                                    []
                                  ).length === 0 && (
                                    <motion.div
                                      initial={{ opacity: 0, scale: 0.95 }}
                                      animate={{ opacity: 1, scale: 1 }}
                                      className="relative overflow-hidden text-center py-12 bg-gradient-to-br from-indigo-50 via-white to-purple-50 border-2 border-dashed border-indigo-300 rounded-xl shadow-inner"
                                    >
                                      <div className="absolute inset-0 opacity-5">
                                        <div className="absolute top-0 left-1/4 w-48 h-48 bg-indigo-500 rounded-full mix-blend-multiply filter blur-2xl animate-pulse" />
                                      </div>

                                      <div className="relative z-10">
                                        <div className="inline-block p-4 bg-white rounded-full shadow-md mb-3">
                                          <Target className="w-10 h-10 text-indigo-400" />
                                        </div>
                                        <p className="font-semibold text-base text-indigo-900 mb-1">
                                          No RS calculations added yet
                                        </p>
                                        <p className="text-xs text-indigo-600/80 max-w-sm mx-auto">
                                          Click "Add RS Calculation" to begin
                                        </p>
                                      </div>
                                    </motion.div>
                                  )}
                                </div>
                              </>
                            )}
                        </motion.div>
                      )}

                      {(
                        activePreparationGroups[selectedParam.id] || []
                      ).includes("dissolution") && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="relative mb-10 p-8 rounded-2xl border-2 border-emerald-200/50 bg-gradient-to-br from-emerald-50/40 via-white/60 to-green-50/40 backdrop-blur-sm shadow-2xl hover:shadow-emerald-200/50 transition-all duration-500 overflow-hidden hover:scale-[1.01]"
                        >
                          {/* Decorative elements */}
                          <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-emerald-400/10 to-transparent rounded-bl-full -z-10" />
                          <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-emerald-400/10 to-transparent rounded-tr-full -z-10" />

                          {/* Card Header */}
                          <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-4">
                              <div className="relative">
                                <div className="absolute inset-0 bg-emerald-500/20 blur-xl rounded-full" />
                                <div className="relative w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg transform hover:rotate-6 transition-transform duration-300">
                                  <BiTestTube className="w-6 h-6 text-white" />
                                </div>
                              </div>
                              <div>
                                <h2 className="text-xl font-bold text-emerald-900 tracking-tight">
                                  Dissolution Analysis
                                </h2>
                                <p className="text-sm text-emerald-600/80 font-medium">
                                  Standard, Sample & Calculations
                                </p>
                              </div>
                            </div>

                            <div className="px-4 py-1 bg-gradient-to-r from-emerald-100 to-green-100 border-2 border-emerald-300/50 rounded-full shadow-sm">
                              <span className="text-xs font-bold text-emerald-700">
                                {(
                                  standardPreparationDissoPerParam[
                                    selectedParam.id
                                  ] || []
                                ).length +
                                  (
                                    samplePreparationDissoPerParam[
                                      selectedParam.id
                                    ] || []
                                  ).length +
                                  (
                                    calculationsDissoPerParam[
                                      selectedParam.id
                                    ] || []
                                  ).length}
                                Items
                              </span>
                            </div>
                          </div>

                          {/* Standard & Sample Preparations Section */}
                          <div className="mb-8">
                            <div className="flex items-center justify-between mb-4 px-2">
                              <h3 className="text-lg font-bold text-emerald-900 flex items-center gap-2.5 tracking-tight">
                                <span className="w-1.5 h-6 bg-gradient-to-b from-emerald-500 to-green-700 rounded-full"></span>
                                Standard & Sample Preparations for Dissolution
                              </h3>
                              {role === "HOD LAB" && (
                                <button
                                  onClick={() =>
                                    handleAddStandardPreparationDisso(
                                      selectedParam.id
                                    )
                                  }
                                  className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-emerald-600 to-green-700 text-white font-semibold rounded-xl hover:from-emerald-700 hover:to-green-800 transition-all duration-200 shadow-md hover:shadow-lg text-sm transform"
                                >
                                  <Plus className="w-4 h-4" />
                                  Add Preparation
                                </button>
                              )}
                            </div>

                            <AnimatePresence>
                              {(
                                standardPreparationDissoPerParam[
                                  selectedParam.id
                                ] || []
                              ).map((standardPreparation: any, idx: number) => {
                                const assignedStandard = (
                                  addedStandards[selectedParam.id] || []
                                ).find(
                                  (std) =>
                                    std.id ===
                                    standardPreparation.assignedStandardId
                                );

                                const correspondingSample =
                                  (samplePreparationDissoPerParam[
                                    selectedParam.id
                                  ] || [])[idx];

                                return (
                                  <div
                                    key={standardPreparation.id}
                                    className="mb-6"
                                  >
                                    <div className="overflow-hidden">
                                      <StandardPreparationDetail
                                        standardPreparation={
                                          standardPreparation
                                        }
                                        assignedStandard={
                                          assignedStandard || null
                                        }
                                        onStepChange={(
                                          standardPreparationId,
                                          stepName,
                                          field,
                                          newValue
                                        ) =>
                                          handleStandardPreparationDissoStepChange(
                                            selectedParam.id,
                                            standardPreparationId,
                                            stepName,
                                            field,
                                            newValue
                                          )
                                        }
                                        onRemove={() =>
                                          handleRemoveStandardPreparationDisso(
                                            selectedParam.id,
                                            standardPreparation.id
                                          )
                                        }
                                        isDisso={true}
                                        role={role}
                                      />
                                    </div>

                                    {correspondingSample && (
                                      <div className="mt-4">
                                        <div className="overflow-hidden">
                                          <SamplePreparationDissoDetail
                                            samplePreparationDisso={
                                              correspondingSample
                                            }
                                            onStepChange={(
                                              samplePreparationDissoId,
                                              stepName,
                                              field,
                                              newValue
                                            ) =>
                                              handleSamplePreparationDissoStepChange(
                                                selectedParam.id,
                                                samplePreparationDissoId,
                                                stepName,
                                                field,
                                                newValue
                                              )
                                            }
                                            onRemove={() =>
                                              handleRemoveSamplePreparationDisso(
                                                selectedParam.id,
                                                correspondingSample.id
                                              )
                                            }
                                            role={role}
                                          />
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </AnimatePresence>

                            {(
                              standardPreparationDissoPerParam[
                                selectedParam.id
                              ] || []
                            ).length === 0 && (
                              <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="relative overflow-hidden text-center py-16 bg-gradient-to-br from-emerald-50 via-white to-green-50 border-2 border-dashed border-emerald-300 rounded-2xl shadow-inner"
                              >
                                <div className="absolute inset-0 opacity-5">
                                  <div className="absolute top-0 left-1/4 w-64 h-64 bg-emerald-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" />
                                  <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-emerald-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-1000" />
                                </div>

                                <div className="relative z-10">
                                  <div className="inline-block p-5 bg-white rounded-full shadow-lg mb-4">
                                    <Target className="w-14 h-14 text-emerald-400" />
                                  </div>
                                  <p className="text-lg font-bold text-emerald-900 mb-2">
                                    No preparations added yet
                                  </p>
                                  <p className="text-sm text-emerald-600/80 max-w-md mx-auto mb-4">
                                    Click "Add Preparation" to create your first
                                    standard and sample preparation for
                                    dissolution
                                  </p>
                                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100/50 rounded-lg border border-emerald-200">
                                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
                                    <span className="text-xs font-semibold text-emerald-700">
                                      Ready to start
                                    </span>
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </div>

                          {standardPreparationDissoPerParam[selectedParam.id]
                            ?.length > 0 &&
                            samplePreparationDissoPerParam[selectedParam.id]
                              ?.length > 0 && (
                              <>
                                {/* Visual Separator */}
                                <div className="flex items-center gap-4 my-8">
                                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-emerald-300 to-transparent" />
                                  <div className="px-4 py-2 bg-gradient-to-r from-emerald-100 to-green-100 rounded-lg border border-emerald-300/50 shadow-sm">
                                    <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider flex items-center gap-2">
                                      <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                                      Calculations
                                    </span>
                                  </div>
                                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-emerald-300 to-transparent" />
                                </div>

                                {/* Calculations Section */}
                                <div className="relative p-6 rounded-xl border-2 border-emerald-300/30 bg-white/50 backdrop-blur-sm shadow-lg">
                                  <div className="flex items-center justify-between mb-6 px-2">
                                    <h3 className="text-lg font-bold flex items-center gap-3 tracking-tight">
                                      <span className="w-1.5 h-6 bg-gradient-to-b from-emerald-500 to-green-700 rounded-full"></span>
                                      <span className="text-emerald-600">
                                        Dissolution Calculations
                                      </span>
                                    </h3>
                                    {role === "HOD LAB" && (
                                      <motion.button
                                        onClick={() =>
                                          handleAddCalculationDisso(
                                            selectedParam.id
                                          )
                                        }
                                        whileHover={{ scale: 1 }}
                                        whileTap={{ scale: 1 }}
                                        className="flex items-center gap-1.5 p-2.5 bg-gradient-to-r from-emerald-600 to-green-600 text-white font-semibold rounded-xl hover:from-emerald-700 hover:to-green-700 transition-all duration-200 shadow-lg hover:shadow-xl text-xs"
                                      >
                                        <Plus className="w-4 h-4" />
                                        Add Dissolution Calculation
                                      </motion.button>
                                    )}
                                  </div>

                                  <AnimatePresence>
                                    {(
                                      calculationsDissoPerParam[
                                        selectedParam.id
                                      ] || []
                                    ).map((calculation) => (
                                      <CalculationDetailDisso
                                        key={calculation.id}
                                        calculation={calculation}
                                        standardPreparations={
                                          standardPreparationDissoPerParam[
                                            selectedParam.id
                                          ] || []
                                        }
                                        samplePreparationsDisso={
                                          samplePreparationDissoPerParam[
                                            selectedParam.id
                                          ] || []
                                        }
                                        onFieldChange={(
                                          calculationId,
                                          field,
                                          value
                                        ) =>
                                          handleCalculationDissoFieldChange(
                                            selectedParam.id,
                                            calculationId,
                                            field,
                                            value
                                          )
                                        }
                                        onRemove={() =>
                                          handleRemoveCalculationDisso(
                                            selectedParam.id,
                                            calculation.id
                                          )
                                        }
                                        role={role}
                                      />
                                    ))}
                                  </AnimatePresence>

                                  {(
                                    calculationsDissoPerParam[
                                      selectedParam.id
                                    ] || []
                                  ).length === 0 && (
                                    <motion.div
                                      initial={{ opacity: 0, scale: 0.95 }}
                                      animate={{ opacity: 1, scale: 1 }}
                                      className="relative overflow-hidden text-center py-12 bg-gradient-to-br from-emerald-50 via-white to-green-50 border-2 border-dashed border-emerald-300 rounded-xl shadow-inner"
                                    >
                                      <div className="absolute inset-0 opacity-5">
                                        <div className="absolute top-0 left-1/4 w-48 h-48 bg-emerald-500 rounded-full mix-blend-multiply filter blur-2xl animate-pulse" />
                                      </div>

                                      <div className="relative z-10">
                                        <div className="inline-block p-4 bg-white rounded-full shadow-md mb-3">
                                          <Target className="w-10 h-10 text-emerald-400" />
                                        </div>
                                        <p className="font-semibold text-base text-emerald-900 mb-1">
                                          No dissolution calculations added yet
                                        </p>
                                        <p className="text-xs text-emerald-600/80 max-w-sm mx-auto">
                                          Click "Add Dissolution Calculation" to
                                          begin
                                        </p>
                                      </div>
                                    </motion.div>
                                  )}
                                </div>
                              </>
                            )}
                        </motion.div>
                      )}

                      <div className="mb-4">
                        <h3 className="text-base font-bold mb-2 text-green-900">
                          Other informations you want to mention regarding test:
                        </h3>
                        <textarea
                          value={otherInfoPerParam[selectedParam.id] || ""}
                          onChange={(e) =>
                            handleOtherInfoChange(
                              selectedParam.id,
                              e.target.value
                            )
                          }
                          placeholder="Enter other informations..."
                          className="w-full min-h-[100px] border border-green-300 rounded-lg p-3 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              );
            })}

          {/* Action Buttons */}
          <div className="mt-6 flex gap-3 justify-center no-print">
            {worksheetInfo?.sample.status !== "Approved" && (
              <>
                {/* Save Draft Button with Loading State */}
                <motion.button
                  onClick={handleSaveDraft}
                  disabled={isSaving}
                  whileHover={!isSaving ? { scale: 1.02 } : {}}
                  whileTap={!isSaving ? { scale: 0.98 } : {}}
                  className={`relative px-6 py-3 rounded-xl font-semibold text-sm shadow-lg transition-all duration-200 flex items-center gap-2 min-w-[140px] justify-center ${
                    isSaving
                      ? "bg-gradient-to-r from-blue-400 to-blue-500 cursor-not-allowed"
                      : "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 hover:shadow-xl"
                  } text-white`}
                >
                  {isSaving ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                      />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
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
                          d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
                        />
                      </svg>
                      <span>Save Draft</span>
                    </>
                  )}

                  <AnimatePresence>
                    {saveSuccess && (
                      <motion.span
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0 }}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg"
                      >
                        <Check className="w-3.5 h-3.5 text-white" />
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>
              </>
            )}
            {/* Submit for Analysis Button - Only for HOD LAB with created parameters */}
            {role === "HOD LAB" &&
              (worksheetInfo?.sample.status === "Draft" ||
                worksheetInfo?.sample.status === "Submitted For Analysis") &&
              addedParameters.some(
                (param) =>
                  (
                    parameterStatusPerParam[param.id] || "created"
                  ).toLowerCase() === "created"
              ) && (
                <motion.button
                  onClick={() => setShowSubmitDialog(true)}
                  disabled={isSubmitting}
                  whileHover={!isSubmitting ? { scale: 1.02 } : {}}
                  whileTap={!isSubmitting ? { scale: 0.98 } : {}}
                  className={`relative px-6 py-3 rounded-xl font-semibold text-sm shadow-lg transition-all duration-200 flex items-center gap-2 min-w-[180px] justify-center ${
                    isSubmitting
                      ? "bg-gradient-to-r from-emerald-400 to-emerald-500 cursor-not-allowed"
                      : "bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 hover:shadow-xl"
                  } text-white`}
                >
                  {isSubmitting ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                      />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
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
                      <span>Submit for Analysis</span>
                    </>
                  )}
                </motion.button>
              )}

            {/* Approve Worksheet Button - Only for HOD LAB when all parameters are approved */}
            {role === "HOD LAB" &&
              addedParameters.length > 0 &&
              areAllParametersApproved() &&
              worksheetInfo?.sample.status !== "Approved" && (
                <motion.button
                  onClick={() => setShowApproveWorksheetDialog(true)}
                  disabled={isApprovingWorksheet}
                  whileHover={!isApprovingWorksheet ? { scale: 1.02 } : {}}
                  whileTap={!isApprovingWorksheet ? { scale: 0.98 } : {}}
                  className={`relative px-6 py-3 rounded-xl font-semibold text-sm shadow-lg transition-all duration-200 flex items-center gap-2 min-w-[200px] justify-center ${
                    isApprovingWorksheet
                      ? "bg-gradient-to-r from-emerald-400 to-green-500 cursor-not-allowed"
                      : "bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 hover:shadow-xl"
                  } text-white`}
                >
                  {isApprovingWorksheet ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                      />
                      <span>Approving...</span>
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-6 h-6"
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
                      <span>Approve Worksheet</span>
                    </>
                  )}
                </motion.button>
              )}

            {worksheetInfo?.sample.status === "Approved" && (
              <motion.button
                onClick={handlePrintClick}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 text-sm flex items-center gap-2"
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
                    d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                  />
                </svg>
                Print Report
              </motion.button>
            )}
          </div>
        </div>

        <StandardSelectionDialog
          isOpen={showStandardSelectionDialog}
          onClose={() => {
            setShowStandardSelectionDialog(false);
            setCurrentParameterForStandardPrep(null);
            setIsAddingRSStandard(false);
            setIsAddingDissoStandard(false);
          }}
          availableStandards={
            currentParameterForStandardPrep !== null
              ? getAvailableStandardsForParameter(
                  currentParameterForStandardPrep,
                  isAddingRSStandard,
                  isAddingDissoStandard
                )
              : []
          }
          onSelectStandard={(standard) => {
            handleStandardSelectedForPreparation(
              standard,
              isAddingRSStandard,
              isAddingDissoStandard
            );
          }}
        />

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
                    ).toLowerCase() === "created"
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
              parameterName={parameterToUnlock.parameterName}
              parameterCode={parameterToUnlock.paraCode}
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
              parameterName={parameterToDelete.parameterName}
              parameterCode={parameterToDelete.paraCode}
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
              parameterName={parameterForAnalysis.parameterName}
              parameterCode={parameterForAnalysis.paraCode}
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
              parameterName={parameterForAnalysis.parameterName}
              parameterCode={parameterForAnalysis.paraCode}
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
              parameterName={parameterForApproval.parameterName}
              parameterCode={parameterForApproval.paraCode}
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
              parameterName={parameterForApproval.parameterName}
              parameterCode={parameterForApproval.paraCode}
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
              parameterName={parameterForApproval.parameterName}
              parameterCode={parameterForApproval.paraCode}
              onClose={() => {
                setShowRevisionDialog(false);
                setParameterForApproval(null);
                setRevisionComments("");
              }}
              onConfirm={handleConfirmRevision}
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
      </div>
    </>
  );
};

export default Worksheet;
