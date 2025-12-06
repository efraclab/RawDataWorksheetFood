import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { type SampleData } from "../models/SampleData";
import type { Instrument } from "../models/Instrument";
import type { Standard } from "../models/Standard";
import type { Chemical } from "../models/Chemical";
import type { MobilePhase } from "../models/MobilePhase";
import type { MobilePhaseStep } from "../models/MobilePhaseStep";
import type { Column } from "../models/Column";
import type { DissoMedia } from "../models/DissoMedia";
import type { DissoMediaStep } from "../models/DissoMediaStep";
import type { StandardPreparation } from "../models/StandardPreparation";
import type { SamplePreparation } from "../models/SamplePreparation";
import type { StandardPreparationStep } from "../models/StandardPreparationStep";
import type { SamplePreparationStep } from "../models/SamplePreparationStep";
import { CgTrash } from "react-icons/cg";
import type { SamplePreparationTitration } from "../models/SamplePreparationTitration";
import type { SamplePreparationTitrationStep } from "../models/SamplePreparationTitrationStep";
import type { SamplePreparationLod } from "../models/SamplePreparationLod";
import type { SamplePreparationLodStep } from "../models/SamplePreparationLodStep";
import type { SamplePreparationSulphatedAsh } from "../models/SamplePreparationSulphatedAsh";
import type { SamplePreparationSulphatedAshStep } from "../models/SamplePreparationSulphatedAshStep";
import type { SamplePreparationROI } from "../models/SamplePreparationROI";
import type { SamplePreparationROIStep } from "../models/SamplePreparationROIStep";
import type { SamplePreparationDisso } from "../models/SamplePreparationDisso";
import type { SamplePreparationDissoStep } from "../models/SamplePreparationDissoStep";
import MobilePhaseDetail from "./sub-components/MobilePhaseDetail";
import DissoMediaDetail from "./sub-components/DissoMediaDetails";
import StandardPreparationDetail from "./sub-components/StandardPreparationDetail";
import SamplePreparationDetail from "./sub-components/SamplePreparationDetail";
import SamplePreparationDissoDetail from "./sub-components/SamplePreparationDissoDetail";
import SamplePreparationTitrationDetail from "./sub-components/SamplePreparationTitrationDetail";
import SamplePreparationLodDetail from "./sub-components/SamplePreparationLodDetail";
import SamplePreparationSulphatedAshDetail from "./sub-components/SamplePreparationSulphatedAshDetail";
import SamplePreparationROIDetail from "./sub-components/SamplePreparationROIDetail";
import DataPreviewDialog from "./DataPreviewDialog";
import PrintPreviewDialog from "./PrintPreviewDialog";
import StandardSelectionDialog from "./shared/StandardSelectionDialog";
import type { CalculationAssay } from "../models/CalculationAssay";
import CalculationDetailAssay from "./sub-components/CalculationDetailAssay";
import { BiTestTube } from "react-icons/bi";
import { IoFlask } from "react-icons/io5";
import type { CalculationSulphatedAsh } from "../models/CalculationSulphatedAsh";
import type { CalculationROI } from "../models/CalculationROI";
import CalculationDetailROI from "./sub-components/CalculationDetailROI";
import CalculationDetailSulphatedAsh from "./sub-components/CalculationDetailSulphatedAsh";
import type { CalculationLod } from "../models/CalculationLod";
import CalculationDetailLod from "./sub-components/CalculationDetailLod";
import type { CalculationRS } from "../models/CalculationRS";
import CalculationDetailRS from "./sub-components/CalculationDetailRS";

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

interface FormPreviewProps {
  reportData: SampleData[] | null;
  loading: boolean;
  error: string | null;
  registrationNo: string;
  instruments: Instrument[];
  standards: Standard[];
  chemicals: Chemical[];
  columns: Column[];
  isReferenceDataLoading: boolean;
  referenceDataError: string | null;
  testInfo?: {
    mobilePhaseId?: string;
    columnId?: string;
    preparationMobilePhase?: string;
    preparationTestSolution?: string;
  };
  documentInfo?: {
    revisionNumber?: string;
    documentCode?: string;
    pageInfo?: string;
    dateOfReceipt?: string;
    preparedBy?: string;
    issuedApprovedBy?: string;
    effectiveIssueDate?: string;
    approvedBy?: string;
    classified?: string;
    revisionDate?: string;
    printedDate?: string;
    printedBy?: string;
  };
}

interface AddedParameter extends SampleData {
  id: number;
}

const createNewCalculationAssay = (index: number): CalculationAssay => {
  return {
    id: Date.now() + index,
    label: `Calculation ${index + 1}`,
    selectedStandardPrepId: null,
    selectedSamplePrepId: null,
    calculationType: "",
    areaOfSample: "",
    areaOfStandard: "",
    v1: "",
    v2: "",
    v3: "",
    v4: "",
    v5: "",
    v6: "",
    v7: "",
    v8: "",
    v9: "",
    v10: "",
    v11: "",
    v12: "",
    v13: "",
    v14: "",
    sw1: "",
    sw2: "",
    baseXPurity: "",
    avgWt: "",
    mwSalt: "",
    mwBase: "",
    claimVolume: "",
  };
};

const createNewCalculationLod = (index: number): CalculationLod => {
  return {
    id: Date.now() + index,
    label: `LOD Calculation ${index + 1}`,
    selectedSamplePrepId: null,
    w1_emptyDish: "",
    w2_dishWithSample: "",
    w3_dishAfterIgnition: "",
  };
};

const createNewCalculationROI = (index: number): CalculationROI => {
  return {
    id: Date.now() + index,
    label: `ROI Calculation ${index + 1}`,
    selectedSamplePrepId: null,
    w1_emptyDish: "",
    w2_dishWithSample: "",
    w3_dishAfterIgnition: "",
  };
};

const createNewCalculationSulphatedAsh = (
  index: number
): CalculationSulphatedAsh => {
  return {
    id: Date.now() + index,
    label: `Sulphated Ash Calculation ${index + 1}`,
    selectedSamplePrepId: null,
    w1_emptyCrucible: "",
    w2_crucibleWithSample: "",
    w3_crucibleAfterAsh: "",
  };
};

const createNewMobilePhase = (index: number): MobilePhase => {
  const label = String.fromCharCode(65 + index);
  return {
    id: Date.now() + index,
    label: `Mobile Phase ${label}`,
    steps: [
      {
        name: "Weighing",
        value: "",
        unit: "g",
        logBookID: "",
        solventChemical: "",
      },
      { name: "PH", value: "", logBookID: "" },
      { name: "Filtration", value: "", unit: "micron" },
      { name: "Sonication", value: "", unit: "min", mobilePhaseID: "" },
    ],
  };
};

const createNewDissoMedia = (index: number): DissoMedia => {
  const label = String.fromCharCode(65 + index);
  return {
    id: Date.now() + index,
    label: `Disso Media ${label}`,
    steps: [
      {
        name: "Weighing",
        value: "",
        unit: "g",
        logBookID: "",
        solventChemical: "",
      },
      { name: "PH", value: "", logBookID: "" },
      { name: "Filtration", value: "", unit: "micron" },
      { name: "Sonication", value: "", unit: "min" },
    ],
  };
};

const createNewStandardPreparation = (index: number): StandardPreparation => {
  return {
    id: Date.now() + index,
    label: `Standard Preparation ${index + 1}`,
    steps: [
      {
        name: "Weighing",
        value: "",
        unit: "g",
        logBookID: "",
        solventChemical: "",
      },
      { name: "1st Dilution", vol1: "", unit1: "ml", vol2: "", unit2: "ml" },
      { name: "2nd Dilution", vol1: "", unit1: "ml", vol2: "", unit2: "ml" },
      { name: "3rd Dilution", vol1: "", unit1: "ml", vol2: "", unit2: "ml" },
      { name: "4th Dilution", vol1: "", unit1: "ml", vol2: "", unit2: "ml" },
      { name: "Filtration", value: "", unit: "micron" },
    ],
  };
};

const createNewSamplePreparation = (index: number): SamplePreparation => {
  return {
    id: Date.now() + index,
    label: `Sample Preparation ${index + 1}`,
    steps: [
      {
        name: "Weighing",
        value: "",
        unit: "g",
        logBookID: "",
        solventChemical: "",
      },
      { name: "1st Dilution", vol1: "", unit1: "ml", vol2: "", unit2: "ml" },
      { name: "2nd Dilution", vol1: "", unit1: "ml", vol2: "", unit2: "ml" },
      { name: "3rd Dilution", vol1: "", unit1: "ml", vol2: "", unit2: "ml" },
      { name: "4th Dilution", vol1: "", unit1: "ml", vol2: "", unit2: "ml" },
      { name: "Filtration", value: "", unit: "micron" },
    ],
  };
};

const createNewSamplePreparationTitration = (
  index: number
): SamplePreparationTitration => {
  return {
    id: Date.now() + index,
    label: `Sample Preparation ${index + 1} for Titration`,
    steps: [
      {
        name: "Weighing",
        value: "",
        unit: "g",
        solventChemical: "",
        logBookID: "",
      },
      { name: "1st Dilution", value: "", unit: "ml" },
      { name: "End Point Determination", value: "" },
    ],
  };
};

const createNewSamplePreparationLod = (index: number): SamplePreparationLod => {
  return {
    id: Date.now() + index,
    label: `Sample Preparation ${index + 1} for LOD`,
    steps: [
      {
        name: "Weighing (Empty Bottle)",
        value: "",
        unit: "g",
        logBookID: "",
      },
      {
        name: "Weighing (Before Drying)",
        value: "",
        unit: "g",
        logBookID: "",
      },
      {
        name: "Drying",
        temp: "",
        tempUnit: "°C",
        time: "",
        timeUnit: "min",
        logBookID: "",
      },
      {
        name: "Weighing (After Drying)",
        value: "",
        unit: "g",
        logBookID: "",
      },
    ],
  };
};

const createNewSamplePreparationSulphatedAsh = (
  index: number
): SamplePreparationSulphatedAsh => {
  return {
    id: Date.now() + index,
    label: `Sample Preparation ${index + 1} for Sulphated Ash`,
    steps: [
      {
        name: "Weighing (Empty Crucible)",
        value: "",
        unit: "g",
        logBookID: "",
      },
      {
        name: "Weighing (Before Drying)",
        value: "",
        unit: "g",
        logBookID: "",
      },
      {
        name: "Drying",
        temp: "",
        tempUnit: "°C",
        time: "",
        timeUnit: "min",
        logBookID: "",
      },
      {
        name: "Weighing (After Drying)",
        value: "",
        unit: "g",
        logBookID: "",
      },
    ],
  };
};

const createNewSamplePreparationROI = (index: number): SamplePreparationROI => {
  return {
    id: Date.now() + index,
    label: `Sample Preparation ${index + 1} for ROI`,
    steps: [
      {
        name: "Weighing (Empty Crucible)",
        value: "",
        unit: "g",
        logBookID: "",
      },
      {
        name: "Weighing (Before Drying)",
        value: "",
        unit: "g",
        logBookID: "",
      },
      {
        name: "Drying",
        temp: "",
        tempUnit: "°C",
        time: "",
        timeUnit: "min",
        logBookID: "",
      },
      {
        name: "Weighing (After Drying)",
        value: "",
        unit: "g",
        logBookID: "",
      },
    ],
  };
};

const createNewSamplePreparationDisso = (
  index: number
): SamplePreparationDisso => {
  return {
    id: Date.now() + index,
    label: `Sample Preparation ${index + 1} for Disso`,
    steps: [
      {
        name: "Instrument Details",
        id: "",
        rpm: "",
        temp: "",
        tempUnit: "°C",
      },
      {
        name: "Tablet Details",
        claim: "",
        mediaVol: "",
        unit: "g",
        time: "",
        timeUnit: "min",
      },
      { name: "1st Dilution", vol1: "", unit1: "ml", vol2: "", unit2: "ml" },
      { name: "2nd Dilution", vol1: "", unit1: "ml", vol2: "", unit2: "ml" },
      { name: "3rd Dilution", vol1: "", unit1: "ml", vol2: "", unit2: "ml" },
      { name: "Filtration", value: "", unit: "micron" },
    ],
  };
};

const createNewCalculationRS = (index: number): CalculationRS => {
  return {
    id: Date.now() + index,
    label: `RS Calculation ${index + 1}`,
    selectedStandardPrepId: null,
    selectedSamplePrepId: null,
    areaOfSample: "",
    areaOfStandard: "",
    sw1: "",
    sw2: "",
    v1: "",
    v2: "",
    v3: "",
    v4: "",
    v5: "",
    v6: "",
    purity: "",
  };
};

const FormPreview: React.FC<FormPreviewProps> = ({
  reportData,
  loading,
  error,
  registrationNo,
  instruments = [],
  chemicals = [],
  standards = [],
  columns = [],
  isReferenceDataLoading = false,
  referenceDataError = null,
  testInfo = {},
  documentInfo = {},
}) => {
  const [addedParameters, setAddedParameters] = useState<AddedParameter[]>([]);
  const [showParameterDropdown, setShowParameterDropdown] = useState(false);
  const [selectedParamsForDetail, setSelectedParamsForDetail] = useState<
    number[]
  >([]);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [showDataDialog, setShowDataDialog] = useState(false);
  const [collectedData, setCollectedData] = useState<any>(null);
  const [showPrintPreview, setShowPrintPreview] = useState(false);

  // State for Columns Per Parameter
  const [columnsPerParam, setColumnsPerParam] = useState<
    Record<number, string>
  >({});

  // New state for dynamic Mobile Phases - Map of Parameter ID to a list of MobilePhase objects
  const [mobilePhasesPerParam, setMobilePhasesPerParam] = useState<
    Record<number, MobilePhase[]>
  >({});
  const [dissoMediaPerParam, setDissoMediaPerParam] = useState<
    Record<number, DissoMedia[]>
  >({});
  const [calculationsAssayPerParam, setCalculationsAssayPerParam] = useState<
    Record<number, CalculationAssay[]>
  >({});
  const [standardPreparationPerParam, setStandardPreparationPerParam] =
    useState<Record<number, StandardPreparation[]>>({});
  const [samplePreparationPerParam, setSamplePreparationPerParam] = useState<
    Record<number, SamplePreparation[]>
  >({});
  const [
    samplePreparationTitrationPerParam,
    setSamplePreparationTitrationPerParam,
  ] = useState<Record<number, SamplePreparationTitration[]>>({});
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

  // New state for dynamic tables
  const [addedInstruments, setAddedInstruments] = useState<
    Record<number, Instrument[]>
  >({});
  const [addedChemicals, setAddedChemicals] = useState<
    Record<number, Chemical[]>
  >({});
  const [addedStandards, setAddedStandards] = useState<
    Record<number, Standard[]>
  >({});

  // State for test solution preparation
  const [testSolutionPerParam, setTestSolutionPerParam] = useState<
    Record<number, string>
  >({});
  const [diluentPerParam, setDiluentPerParam] = useState<
    Record<number, string>
  >({});

  const [standardAssignmentsPerParam, setStandardAssignmentsPerParam] =
    useState<
      Record<number, Record<number, string>> // paramId -> { standardPrepId -> standardId }
    >({});

  const [visiblePreparationsPerParam, setVisiblePreparationsPerParam] =
    useState<Record<number, string[]>>({});

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

  const [isAddingRSStandard, setIsAddingRSStandard] = useState(false);

  // Control states for dynamic dropdowns
  const [showInstrumentDropdown, setShowInstrumentDropdown] = useState(false);
  const [showChemicalDropdown, setShowChemicalDropdown] = useState(false);
  const [showStandardDropdown, setShowStandardDropdown] = useState(false);
  const [showColumnDropdown, setShowColumnDropdown] = useState(false);

  // Search states for dynamic dropdowns
  const [instrumentSearch, setInstrumentSearch] = useState("");
  const [chemicalSearch, setChemicalSearch] = useState("");
  const [standardSearch, setStandardSearch] = useState("");
  const [columnSearch, setColumnSearch] = useState("");

  const [showStandardSelectionDialog, setShowStandardSelectionDialog] =
    useState(false);
  const [currentParameterForStandardPrep, setCurrentParameterForStandardPrep] =
    useState<number | null>(null);

  const sample = reportData && reportData.length > 0 ? reportData[0] : null;

  // --- START: Click Outside Logic Implementation ---
  const instrumentRef = useRef<HTMLDivElement>(null);
  const chemicalRef = useRef<HTMLDivElement>(null);
  const standardRef = useRef<HTMLDivElement>(null);
  const columnRef = useRef<HTMLDivElement>(null);
  const preparationDropdownRef = useRef<HTMLDivElement>(null);

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
      columnRef.current &&
      !columnRef.current.contains(event.target as Node)
    ) {
      setShowColumnDropdown(false);
    }
    if (
      preparationDropdownRef.current &&
      !preparationDropdownRef.current.contains(event.target as Node)
    ) {
      setShowPreparationDropdown({});
    }
  }, []);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleClickOutside]);

  const { preparationTestSolution = "" } = testInfo;

  const {
    dateOfReceipt = new Date().toLocaleDateString("en-GB"),
    preparedBy = "Executive",
    issuedApprovedBy = "QA Manager",
    effectiveIssueDate = "01/05/2025",
    approvedBy = "Sr. Executive",
    classified = '"Internal Use Only"',
    revisionDate = "30/07/2027",
  } = documentInfo;

  const getStorageKey = (regNo: string) => `form_draft_${regNo}`;

  useEffect(() => {
    if (registrationNo) {
      const storageKey = getStorageKey(registrationNo);
      const savedData = localStorage.getItem(storageKey);

      if (savedData) {
        try {
          const parsed = JSON.parse(savedData);

          // Restore all state from saved data
          if (parsed.addedParameters)
            setAddedParameters(parsed.addedParameters);
          if (parsed.selectedParamsForDetail)
            setSelectedParamsForDetail(parsed.selectedParamsForDetail);
          if (parsed.columnsPerParam)
            setColumnsPerParam(parsed.columnsPerParam);
          if (parsed.mobilePhasesPerParam)
            setMobilePhasesPerParam(parsed.mobilePhasesPerParam);
          if (parsed.dissoMediaPerParam)
            setDissoMediaPerParam(parsed.dissoMediaPerParam);
          if (parsed.standardPreparationPerParam)
            setStandardPreparationPerParam(parsed.standardPreparationPerParam);
          if (parsed.samplePreparationPerParam)
            setSamplePreparationPerParam(parsed.samplePreparationPerParam);
          if (parsed.samplePreparationTitrationPerParam)
            setSamplePreparationTitrationPerParam(
              parsed.samplePreparationTitrationPerParam
            );
          if (parsed.samplePreparationLodPerParam)
            setSamplePreparationLodPerParam(
              parsed.samplePreparationLodPerParam
            );
          if (parsed.samplePreparationSulphatedAshPerParam)
            setSamplePreparationSulphatedAshPerParam(
              parsed.samplePreparationSulphatedAshPerParam
            );
          if (parsed.samplePreparationROIPerParam)
            setSamplePreparationROIPerParam(
              parsed.samplePreparationROIPerParam
            );
          if (parsed.samplePreparationDissoPerParam)
            setSamplePreparationDissoPerParam(
              parsed.samplePreparationDissoPerParam
            );
          if (parsed.addedInstruments)
            setAddedInstruments(parsed.addedInstruments);
          if (parsed.addedChemicals) setAddedChemicals(parsed.addedChemicals);
          if (parsed.addedStandards) setAddedStandards(parsed.addedStandards);
          if (parsed.testSolutionPerParam)
            setTestSolutionPerParam(parsed.testSolutionPerParam);
          if (parsed.diluentPerParam)
            setDiluentPerParam(parsed.diluentPerParam);

          if (parsed.standardAssignmentsPerParam)
            setStandardAssignmentsPerParam(parsed.standardAssignmentsPerParam);

          if (parsed.calculationsAssayPerParam)
            setCalculationsAssayPerParam(parsed.calculationsAssayPerParam);
          if (parsed.calculationsLodPerParam)
            setCalculationsROIPerParam(parsed.calculationsLodPerParam);
          if (parsed.calculationsROIPerParam)
            setCalculationsROIPerParam(parsed.calculationsROIPerParam);
          if (parsed.calculationsSulphatedAshPerParam)
            setCalculationsSulphatedAshPerParam(
              parsed.calculationsSulphatedAshPerParam
            );
          if (parsed.activePreparationGroups)
            setActivePreparationGroups(parsed.activePreparationGroups);
          if (parsed.standardPreparationRSPerParam)
            setStandardPreparationRSPerParam(
              parsed.standardPreparationRSPerParam
            );
          if (parsed.samplePreparationRSPerParam)
            setSamplePreparationRSPerParam(parsed.samplePreparationRSPerParam);
          if (parsed.calculationsRSPerParam)
            setCalculationsRSPerParam(parsed.calculationsRSPerParam);

          console.log("Draft loaded for:", registrationNo);
        } catch (err) {
          console.error("Error loading draft:", err);
        }
      }
    }
  }, [registrationNo]);
  // --- END: LOCAL STORAGE LOGIC ---

  // Parameter Handlers
  const handleAddParameter = (param: SampleData) => {
    const newId = Date.now();
    if (!addedParameters.find((p) => p.paraCode === param.paraCode)) {
      setAddedParameters([...addedParameters, { ...param, id: newId }]);

      setColumnsPerParam((prev) => ({
        ...prev,
        [newId]: testInfo.columnId || "",
      }));

      setTestSolutionPerParam((prev) => ({
        ...prev,
        [newId]: preparationTestSolution || "",
      }));
    }
    setShowParameterDropdown(false);
  };

  const handleRemoveParameter = (id: number) => {
    setAddedParameters(addedParameters.filter((p) => p.id !== id));
    setSelectedParamsForDetail(
      selectedParamsForDetail.filter((paramId) => paramId !== id)
    );
    setAddedInstruments((prev) => {
      const { [id]: _, ...rest } = prev;
      return rest;
    });
    setAddedChemicals((prev) => {
      const { [id]: _, ...rest } = prev;
      return rest;
    });
    setAddedStandards((prev) => {
      const { [id]: _, ...rest } = prev;
      return rest;
    });
    setMobilePhasesPerParam((prev) => {
      const { [id]: _, ...rest } = prev;
      return rest;
    });
    setDissoMediaPerParam((prev) => {
      const { [id]: _, ...rest } = prev;
      return rest;
    });
    setColumnsPerParam((prev) => {
      const { [id]: _, ...rest } = prev;
      return rest;
    });
    setDiluentPerParam((prev) => {
      const { [id]: _, ...rest } = prev;
      return rest;
    });
    setTestSolutionPerParam((prev) => {
      const { [id]: _, ...rest } = prev;
      return rest;
    });
    setCalculationsAssayPerParam((prev) => {
      const { [id]: _, ...rest } = prev;
      return rest;
    });

    setCalculationsROIPerParam((prev) => {
      const { [id]: _, ...rest } = prev;
      return rest;
    });
    setCalculationsLodPerParam((prev) => {
      const { [id]: _, ...rest } = prev;
      return rest;
    });
    setCalculationsSulphatedAshPerParam((prev) => {
      const { [id]: _, ...rest } = prev;
      return rest;
    });
  };

  const toggleParameterDetail = (id: number) => {
    if (selectedParamsForDetail.includes(id)) {
      setSelectedParamsForDetail(
        selectedParamsForDetail.filter((paramId) => paramId !== id)
      );
    } else {
      setSelectedParamsForDetail([...selectedParamsForDetail, id]);
    }
  };

  const availableToAdd = (reportData ?? []).filter(
    (param) =>
      !addedParameters.find((added) => added.paraCode === param.paraCode)
  );

  // Mobile Phase Handlers
  const handleAddMobilePhase = (parameterId: number) => {
    setMobilePhasesPerParam((prev) => {
      const currentPhases = prev[parameterId] || [];
      const newIndex = currentPhases.length;
      return {
        ...prev,
        [parameterId]: [...currentPhases, createNewMobilePhase(newIndex)],
      };
    });
  };

  const handleRemoveMobilePhase = (
    parameterId: number,
    mobilePhaseId: number
  ) => {
    setMobilePhasesPerParam((prev) => {
      const updatedPhases = (prev[parameterId] || [])
        .filter((mp) => mp.id !== mobilePhaseId)
        .map((mp, index) => ({
          ...mp,
          label: `Mobile Phase ${String.fromCharCode(65 + index)}`,
        }));
      return {
        ...prev,
        [parameterId]: updatedPhases,
      };
    });
  };

  const handleMobilePhaseStepChange = (
    parameterId: number,
    mobilePhaseId: number,
    stepName: MobilePhaseStep["name"],
    field: "value" | "logBookID" | "mobilePhaseID" | "unit" | "solventChemical",
    newValue: string
  ) => {
    setMobilePhasesPerParam((prev) => ({
      ...prev,
      [parameterId]: (prev[parameterId] || []).map((mp) => {
        if (mp.id === mobilePhaseId) {
          return {
            ...mp,
            steps: mp.steps.map((step) => {
              if (step.name === stepName) {
                return {
                  ...step,
                  [field]: newValue,
                };
              }
              return step;
            }),
          };
        }
        return mp;
      }),
    }));
  };

  const handleAddDissoMedia = (parameterId: number) => {
    setDissoMediaPerParam((prev) => {
      const currentMedias = prev[parameterId] || [];
      const newIndex = currentMedias.length;
      return {
        ...prev,
        [parameterId]: [...currentMedias, createNewDissoMedia(newIndex)],
      };
    });
  };

  const handleRemoveDissoMedia = (
    parameterId: number,
    dissoMediaId: number
  ) => {
    setDissoMediaPerParam((prev) => {
      const updatedMedias = (prev[parameterId] || [])
        .filter((dm) => dm.id !== dissoMediaId)
        .map((dm, index) => ({
          ...dm,
          label: `Disso Media ${String.fromCharCode(65 + index)}`,
        }));
      return {
        ...prev,
        [parameterId]: updatedMedias,
      };
    });
  };

  const handleDissoMediaStepChange = (
    parameterId: number,
    dissoMediaId: number,
    stepName: DissoMediaStep["name"],
    field: "value" | "logBookID" | "unit" | "solventChemical",
    newValue: string
  ) => {
    setDissoMediaPerParam((prev) => ({
      ...prev,
      [parameterId]: (prev[parameterId] || []).map((dm) => {
        if (dm.id === dissoMediaId) {
          return {
            ...dm,
            steps: dm.steps.map((step) => {
              if (step.name === stepName) {
                return {
                  ...step,
                  [field]: newValue,
                };
              }
              return step;
            }),
          };
        }
        return dm;
      }),
    }));
  };

  const handleAddStandardPreparation = (parameterId: number) => {
    setCurrentParameterForStandardPrep(parameterId);
    setIsAddingRSStandard(false);
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

      // Also remove the corresponding sample preparation at the same index
      if (indexToRemove !== -1) {
        setSamplePreparationPerParam((prevSample) => {
          const samples = prevSample[parameterId] || [];
          const updatedSamples = samples
            .filter((_, idx) => idx !== indexToRemove)
            .map((sp, index) => ({
              ...sp,
              label: `Sample Preparation ${1 + index}`,
            }));
          return {
            ...prevSample,
            [parameterId]: updatedSamples,
          };
        });
      }

      return {
        ...prev,
        [parameterId]: updatedStandards,
      };
    });
  };

  const handleStandardPreparationStepChange = (
    parameterId: number,
    standardPreparationId: number,
    stepName: StandardPreparationStep["name"],
    field:
      | "value"
      | "unit"
      | "vol1"
      | "vol2"
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
                return {
                  ...step,
                  [field]: newValue,
                };
              }
              return step;
            }),
          };
        }
        return sp;
      }),
    }));
  };

  const handleAddSamplePreparation = (parameterId: number) => {
    setSamplePreparationPerParam((prev) => {
      const currentSamples = prev[parameterId] || [];
      const newIndex = currentSamples.length;
      return {
        ...prev,
        [parameterId]: [
          ...currentSamples,
          createNewSamplePreparation(newIndex),
        ],
      };
    });
  };

  const handleRemoveSamplePreparation = (
    parameterId: number,
    samplePreparationId: number
  ) => {
    setSamplePreparationPerParam((prev) => {
      const updatedSamples = (prev[parameterId] || [])
        .filter((sp) => sp.id !== samplePreparationId)
        .map((sp, index) => ({
          ...sp,
          label: `Sample Preparation ${1 + index}`,
        }));
      return {
        ...prev,
        [parameterId]: updatedSamples,
      };
    });
  };

  const handleSamplePreparationStepChange = (
    parameterId: number,
    samplePreparationId: number,
    stepName: SamplePreparationStep["name"],
    field:
      | "value"
      | "unit"
      | "vol1"
      | "vol2"
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
                return {
                  ...step,
                  [field]: newValue,
                };
              }
              return step;
            }),
          };
        }
        return sp;
      }),
    }));
  };

  const handleAddSamplePreparationTitration = (parameterId: number) => {
    setSamplePreparationTitrationPerParam((prev) => {
      const currentSamples = prev[parameterId] || [];
      const newIndex = currentSamples.length;
      return {
        ...prev,
        [parameterId]: [
          ...currentSamples,
          createNewSamplePreparationTitration(newIndex),
        ],
      };
    });
  };

  const handleRemoveSamplePreparationTitration = (
    parameterId: number,
    samplePreparationTitrationId: number
  ) => {
    setSamplePreparationTitrationPerParam((prev) => {
      const updatedSamples = (prev[parameterId] || [])
        .filter((spt) => spt.id !== samplePreparationTitrationId)
        .map((spt, index) => ({
          ...spt,
          label: `Sample Preparation ${1 + index} for Titration`,
        }));
      return {
        ...prev,
        [parameterId]: updatedSamples,
      };
    });
  };

  const handleSamplePreparationTitrationStepChange = (
    parameterId: number,
    samplePreparationTitrationId: number,
    stepName: SamplePreparationTitrationStep["name"],
    field: "value" | "unit" | "logBookID" | "solventChemical",
    newValue: string
  ) => {
    setSamplePreparationTitrationPerParam((prev) => ({
      ...prev,
      [parameterId]: (prev[parameterId] || []).map((spt) => {
        if (spt.id === samplePreparationTitrationId) {
          return {
            ...spt,
            steps: spt.steps.map((step) => {
              if (step.name === stepName) {
                return {
                  ...step,
                  [field]: newValue,
                };
              }
              return step;
            }),
          };
        }
        return spt;
      }),
    }));
  };

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
          label: `Sample Preparation ${1 + index} for LOD`,
        }));
      return {
        ...prev,
        [parameterId]: updatedSamples,
      };
    });
  };

  const handleSamplePreparationLodStepChange = (
    parameterId: number,
    samplePreparationLodId: number,
    stepName: SamplePreparationLodStep["name"],
    field:
      | "value"
      | "unit"
      | "temp"
      | "tempUnit"
      | "time"
      | "timeUnit"
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
                return {
                  ...step,
                  [field]: newValue,
                };
              }
              return step;
            }),
          };
        }
        return spl;
      }),
    }));
  };

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
          label: `Sample Preparation ${1 + index} for Sulphated Ash`,
        }));
      return {
        ...prev,
        [parameterId]: updatedSamples,
      };
    });
  };

  const handleSamplePreparationSulphatedAshStepChange = (
    parameterId: number,
    samplePreparationSulphatedAshId: number,
    stepName: SamplePreparationSulphatedAshStep["name"],
    field:
      | "value"
      | "unit"
      | "temp"
      | "tempUnit"
      | "time"
      | "timeUnit"
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
                return {
                  ...step,
                  [field]: newValue,
                };
              }
              return step;
            }),
          };
        }
        return spsa;
      }),
    }));
  };

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
          label: `Sample Preparation ${1 + index} for Loss on Ignation`,
        }));
      return {
        ...prev,
        [parameterId]: updatedSamples,
      };
    });
  };

  const handleSamplePreparationROIStepChange = (
    parameterId: number,
    samplePreparationROIId: number,
    stepName: SamplePreparationROIStep["name"],
    field:
      | "value"
      | "unit"
      | "temp"
      | "tempUnit"
      | "time"
      | "timeUnit"
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
                return {
                  ...step,
                  [field]: newValue,
                };
              }
              return step;
            }),
          };
        }
        return spl;
      }),
    }));
  };

  const handleAddSamplePreparationDisso = (parameterId: number) => {
    setSamplePreparationDissoPerParam((prev) => {
      const currentSamples = prev[parameterId] || [];
      const newIndex = currentSamples.length;
      return {
        ...prev,
        [parameterId]: [
          ...currentSamples,
          createNewSamplePreparationDisso(newIndex),
        ],
      };
    });
  };

  const handleRemoveSamplePreparationDisso = (
    parameterId: number,
    samplePreparationDissoId: number
  ) => {
    setSamplePreparationDissoPerParam((prev) => {
      const updatedSamples = (prev[parameterId] || [])
        .filter((spl) => spl.id !== samplePreparationDissoId)
        .map((spl, index) => ({
          ...spl,
          label: `Sample Preparation ${1 + index} for Disso`,
        }));
      return {
        ...prev,
        [parameterId]: updatedSamples,
      };
    });
  };

  const handleSamplePreparationDissoStepChange = (
    parameterId: number,
    samplePreparationDissoId: number,
    stepName: SamplePreparationDissoStep["name"],
    field:
      | "value"
      | "unit"
      | "vol1"
      | "vol2"
      | "unit1"
      | "unit2"
      | "temp"
      | "tempUnit"
      | "time"
      | "timeUnit"
      | "id"
      | "rpm"
      | "claim"
      | "mediaVol"
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
                return {
                  ...step,
                  [field]: newValue,
                };
              }
              return step;
            }),
          };
        }
        return spl;
      }),
    }));
  };

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

  const searchFilteredColumns = columns.filter(
    (col) =>
      col.name.toLowerCase().includes(columnSearch.toLowerCase()) ||
      col.id.toLowerCase().includes(columnSearch.toLowerCase())
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
        .map((calc, index) => ({
          ...calc,
          label: `Calculation ${index + 1}`,
        }));
      return {
        ...prev,
        [parameterId]: updatedCalculations,
      };
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
          return {
            ...calc,
            [field]: value,
          };
        }
        return calc;
      }),
    }));
  };

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
          label: `LOD Calculation ${index + 1}`,
        }));
      return {
        ...prev,
        [parameterId]: updatedCalculations,
      };
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
          return {
            ...calc,
            [field]: value,
          };
        }
        return calc;
      }),
    }));
  };

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
          label: `ROI Calculation ${index + 1}`,
        }));
      return {
        ...prev,
        [parameterId]: updatedCalculations,
      };
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
          return {
            ...calc,
            [field]: value,
          };
        }
        return calc;
      }),
    }));
  };

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
          label: `Sulphated Ash Calculation ${index + 1}`,
        }));
      return {
        ...prev,
        [parameterId]: updatedCalculations,
      };
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
          return {
            ...calc,
            [field]: value,
          };
        }
        return calc;
      }),
    }));
  };

  const handleAddStandardPreparationRS = (parameterId: number) => {
    setCurrentParameterForStandardPrep(parameterId);
    setIsAddingRSStandard(true); // Explicitly set to true for RS
    setShowStandardSelectionDialog(true);
  };

  const handleStandardSelectedForPreparation = (
    standard: Standard,
    isRS: boolean = false
  ) => {
    if (currentParameterForStandardPrep === null) return;

    const parameterId = currentParameterForStandardPrep;

    if (isRS) {
      // Handle RS Standard Preparation
      const currentStandards = standardPreparationRSPerParam[parameterId] || [];
      const newIndex = currentStandards.length;
      const newStandardPrep = createNewStandardPreparation(newIndex);

      newStandardPrep.steps = newStandardPrep.steps.map((step) => {
        if (step.name === "Weighing") {
          return {
            ...step,
            solventChemical: standard.name,
          };
        }
        return step;
      });

      // Add to RS Standard Preparation list
      setStandardPreparationRSPerParam((prev) => ({
        ...prev,
        [parameterId]: [
          ...currentStandards,
          { ...newStandardPrep, assignedStandardId: standard.id },
        ],
      }));

      // Add corresponding RS Sample Preparation
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
    } else {
      // Handle regular Assay Standard Preparation
      const currentStandards = standardPreparationPerParam[parameterId] || [];
      const newIndex = currentStandards.length;
      const newStandardPrep = createNewStandardPreparation(newIndex);

      newStandardPrep.steps = newStandardPrep.steps.map((step) => {
        if (step.name === "Weighing") {
          return {
            ...step,
            solventChemical: standard.name,
          };
        }
        return step;
      });

      // Add to regular Assay Standard Preparation list
      setStandardPreparationPerParam((prev) => ({
        ...prev,
        [parameterId]: [
          ...currentStandards,
          { ...newStandardPrep, assignedStandardId: standard.id },
        ],
      }));

      // Add corresponding regular Assay Sample Preparation
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

    // Close dialog and reset state
    setShowStandardSelectionDialog(false);
    setCurrentParameterForStandardPrep(null);
    setIsAddingRSStandard(false);
  };

  // Handler for removing RS Standard Preparation
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

      // Also remove the corresponding sample preparation at the same index
      if (indexToRemove !== -1) {
        setSamplePreparationRSPerParam((prevSample) => {
          const samples = prevSample[parameterId] || [];
          const updatedSamples = samples
            .filter((_, idx) => idx !== indexToRemove)
            .map((sp, index) => ({
              ...sp,
              label: `Sample Preparation ${1 + index}`,
            }));
          return {
            ...prevSample,
            [parameterId]: updatedSamples,
          };
        });
      }

      return {
        ...prev,
        [parameterId]: updatedStandards,
      };
    });
  };

  // Handler for RS Standard Preparation step changes
  const handleStandardPreparationRSStepChange = (
    parameterId: number,
    standardPreparationId: number,
    stepName: StandardPreparationStep["name"],
    field:
      | "value"
      | "unit"
      | "vol1"
      | "vol2"
      | "unit1"
      | "unit2"
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
                return {
                  ...step,
                  [field]: newValue,
                };
              }
              return step;
            }),
          };
        }
        return sp;
      }),
    }));
  };

  // Handler for adding RS Sample Preparation
  const handleAddSamplePreparationRS = (parameterId: number) => {
    setSamplePreparationRSPerParam((prev) => {
      const currentSamples = prev[parameterId] || [];
      const newIndex = currentSamples.length;
      return {
        ...prev,
        [parameterId]: [
          ...currentSamples,
          createNewSamplePreparation(newIndex),
        ],
      };
    });
  };

  // Handler for removing RS Sample Preparation
  const handleRemoveSamplePreparationRS = (
    parameterId: number,
    samplePreparationId: number
  ) => {
    setSamplePreparationRSPerParam((prev) => {
      const updatedSamples = (prev[parameterId] || [])
        .filter((sp) => sp.id !== samplePreparationId)
        .map((sp, index) => ({
          ...sp,
          label: `Sample Preparation ${1 + index}`,
        }));
      return {
        ...prev,
        [parameterId]: updatedSamples,
      };
    });
  };

  // Handler for RS Sample Preparation step changes
  const handleSamplePreparationRSStepChange = (
    parameterId: number,
    samplePreparationId: number,
    stepName: SamplePreparationStep["name"],
    field:
      | "value"
      | "unit"
      | "vol1"
      | "vol2"
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
                return {
                  ...step,
                  [field]: newValue,
                };
              }
              return step;
            }),
          };
        }
        return sp;
      }),
    }));
  };

  // Handler for adding RS Calculation
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

  // Handler for removing RS Calculation
  const handleRemoveCalculationRS = (
    parameterId: number,
    calculationId: number
  ) => {
    setCalculationsRSPerParam((prev) => {
      const updatedCalculations = (prev[parameterId] || [])
        .filter((calc) => calc.id !== calculationId)
        .map((calc, index) => ({
          ...calc,
          label: `RS Calculation ${index + 1}`,
        }));
      return {
        ...prev,
        [parameterId]: updatedCalculations,
      };
    });
  };

  // Handler for RS Calculation field changes
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
          return {
            ...calc,
            [field]: value,
          };
        }
        return calc;
      }),
    }));
  };

  const handleSelectColumnForParam = (
    parameterId: number,
    columnId: string
  ) => {
    setColumnsPerParam((prev) => ({
      ...prev,
      [parameterId]: columnId,
    }));
    setShowColumnDropdown(false);
    setColumnSearch("");
  };

  const handleTestSolutionChange = (parameterId: number, value: string) => {
    setTestSolutionPerParam((prev) => ({
      ...prev,
      [parameterId]: value,
    }));
  };

  const handleDiluentChange = (parameterId: number, value: string) => {
    setDiluentPerParam((prev) => ({
      ...prev,
      [parameterId]: value,
    }));
  };

  const handleStandardAssignmentChange = (
    parameterId: number,
    standardPreparationId: number,
    standardId: string
  ) => {
    setStandardAssignmentsPerParam((prev) => ({
      ...prev,
      [parameterId]: {
        ...(prev[parameterId] || {}),
        [standardPreparationId]: standardId,
      },
    }));
  };

  const getAvailableStandardsForParameter = (
    parameterId: number,
    isForRS: boolean = false
  ): Standard[] => {
    const paramStandards = addedStandards[parameterId] || [];

    // Get preparations based on whether it's for RS or regular Assay
    // Each type maintains its own list of assigned standards
    const preparations = isForRS
      ? standardPreparationRSPerParam[parameterId] || []
      : standardPreparationPerParam[parameterId] || [];

    // Get assigned standard IDs only from the specific preparation type
    const assignedStandardIds = preparations
      .map((prep: any) => prep.assignedStandardId)
      .filter(Boolean);

    // Filter out only standards that are already assigned to THIS preparation type
    return paramStandards.filter(
      (std) => !assignedStandardIds.includes(std.id)
    );
  };
  const collectFormDataForReport = () => {
    const formData = {
      registrationInfo: {
        registrationNo: sample?.registrationNo || registrationNo || "",
        dateOfReceipt,
        sampleName: sample?.sampleName || "",
        numberOfParameters: addedParameters.length,
        dueDate: sample?.tatDate || "",
        analysisStartDate: sample?.analysisStartDate || "",
        analysisCompletionDate: sample?.analysisCompletionDate || "",
      },
      documentInfo: {
        preparedBy,
        issuedApprovedBy,
        effectiveIssueDate,
        approvedBy,
        classified,
        revisionDate,
      },
      parameters: addedParameters.map((param) => ({
        paraCode: param.paraCode,
        parameterName: param.parameter,
        methodCode: param.methodCode,
        methodName: param.methodName,
        instruments: (addedInstruments[param.id] || []).map((inst) => ({
          name: inst.name,
          calibrationDoneDate: inst.calibrationDoneDate,
          calibrationDueDate: inst.calibrationDueDate,
        })),
        chemicals: (addedChemicals[param.id] || []).map((chem) => ({
          name: chem.name,
          make: chem.make,
          batchNo: chem.batchNo,
          validity: chem.validity,
        })),
        standards: (addedStandards[param.id] || []).map((std) => ({
          name: std.name,
          purity: std.purity,
          make: std.make,
          batchNo: std.batchNo,
        })),
        diluentPreparation: diluentPerParam[param.id] || "",
        columnId: columnsPerParam[param.id] || "",
        columnDetails:
          columns.find((c) => c.id === columnsPerParam[param.id]) || null,
        mobilePhases: (mobilePhasesPerParam[param.id] || []).map((mp) => ({
          label: mp.label,
          steps: mp.steps,
        })),
        dissoMedia: (dissoMediaPerParam[param.id] || []).map((dm) => ({
          label: dm.label,
          steps: dm.steps,
        })),
        standardPreparation: (standardPreparationPerParam[param.id] || []).map(
          (sp) => ({
            label: sp.label,
            steps: sp.steps,
          })
        ),
        samplePreparation: (samplePreparationPerParam[param.id] || []).map(
          (sp) => ({
            label: sp.label,
            steps: sp.steps,
          })
        ),
        calculationsAssay: (calculationsAssayPerParam[param.id] || []).map(
          (calc) => ({
            label: calc.label,
            selectedStandardPrepId: calc.selectedStandardPrepId,
            selectedSamplePrepId: calc.selectedSamplePrepId,
            calculationType: calc.calculationType,
            areaOfSample: calc.areaOfSample,
            areaOfStandard: calc.areaOfStandard,
            v1: calc.v1,
            v2: calc.v2,
            v3: calc.v3,
            v4: calc.v4,
            v5: calc.v5,
            v6: calc.v6,
            v7: calc.v7,
            v8: calc.v8,
            v9: calc.v9,
            v10: calc.v10,
            v11: calc.v11,
            v12: calc.v12,
            v13: calc.v13,
            v14: calc.v14,
            sw1: calc.sw1,
            sw2: calc.sw2,
            baseXPurity: calc.baseXPurity,
            avgWt: calc.avgWt,
            mwSalt: calc.mwSalt,
            mwBase: calc.mwBase,
            doseVolume: calc.claimVolume,
          })
        ),
        calculationsRS: (calculationsRSPerParam[param.id] || []).map(
          (calc) => ({
            label: calc.label,
            selectedStandardPrepId: calc.selectedStandardPrepId,
            selectedSamplePrepId: calc.selectedSamplePrepId,
            areaOfSample: calc.areaOfSample,
            areaOfStandard: calc.areaOfStandard,
            sw1: calc.sw1,
            sw2: calc.sw2,
            v1: calc.v1,
            v2: calc.v2,
            v3: calc.v3,
            v4: calc.v4,
            v5: calc.v5,
            v6: calc.v6,
            purity: calc.purity,
          })
        ),
        standardPreparationRS: (
          standardPreparationRSPerParam[param.id] || []
        ).map((sp) => ({
          label: sp.label,
          steps: sp.steps,
        })),
        samplePreparationRS: (samplePreparationRSPerParam[param.id] || []).map(
          (sp) => ({
            label: sp.label,
            steps: sp.steps,
          })
        ),
        samplePreparationDisso: (
          samplePreparationDissoPerParam[param.id] || []
        ).map((spd) => ({
          label: spd.label,
          steps: spd.steps,
        })),
        samplePreparationTitration: (
          samplePreparationTitrationPerParam[param.id] || []
        ).map((spt) => ({
          label: spt.label,
          steps: spt.steps,
        })),
        samplePreparationLod: (
          samplePreparationLodPerParam[param.id] || []
        ).map((spl) => ({
          label: spl.label,
          steps: spl.steps,
        })),
        samplePreparationROI: (
          samplePreparationROIPerParam[param.id] || []
        ).map((spl) => ({
          label: spl.label,
          steps: spl.steps,
        })),
        samplePreparationSulphatedAsh: (
          samplePreparationSulphatedAshPerParam[param.id] || []
        ).map((sps) => ({
          label: sps.label,
          steps: sps.steps,
        })),
        testSolutionPreparation: testSolutionPerParam[param.id] || "",
      })),
    };
    return formData;
  };

  const collectFormDataForDraft = () => {
    const formData = {
      registrationInfo: {
        registrationNo: sample?.registrationNo || registrationNo || "",
        dateOfReceipt,
        sampleName: sample?.sampleName || "",
        numberOfParameters: addedParameters.length,
        dueDate: sample?.tatDate || "",
        analysisStartDate: sample?.analysisStartDate || "",
        analysisCompletionDate: sample?.analysisCompletionDate || "",
      },
      documentInfo: {
        preparedBy,
        issuedApprovedBy,
        effectiveIssueDate,
        approvedBy,
        classified,
        revisionDate,
      },
      addedParameters,
      selectedParamsForDetail,
      columnsPerParam,
      mobilePhasesPerParam,
      dissoMediaPerParam,
      standardPreparationPerParam,
      samplePreparationPerParam,
      samplePreparationTitrationPerParam,
      samplePreparationLodPerParam,
      samplePreparationSulphatedAshPerParam,
      samplePreparationROIPerParam,
      samplePreparationDissoPerParam,
      addedInstruments,
      addedChemicals,
      addedStandards,
      testSolutionPerParam,
      diluentPerParam,
      standardAssignmentsPerParam,
      calculationsAssayPerParam,
      standardPreparationRSPerParam,
      samplePreparationRSPerParam,
      calculationsRSPerParam,
    };
    return formData;
  };

  // Save Draft Handler
  const handleSaveDraft = () => {
    const formData = collectFormDataForDraft();
    const storageKey = getStorageKey(registrationNo);

    try {
      localStorage.setItem(storageKey, JSON.stringify(formData));
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
      console.log("Draft saved successfully for:", registrationNo);
    } catch (err) {
      console.error("Error saving draft:", err);
      alert("Failed to save draft. Please try again.");
    }
  };

  // Submit Handler
  const handleSubmit = () => {
    const completeFormData = collectFormDataForReport();

    // Show the data in dialog
    setCollectedData(completeFormData);
    setShowDataDialog(true);

    // Remove from localStorage on submit
    const storageKey = getStorageKey(registrationNo);
    localStorage.removeItem(storageKey);
    console.log("Draft removed from storage for:", registrationNo);
    console.log("=== COMPLETE FORM DATA ===");
    console.log(JSON.stringify(completeFormData, null, 2));
  };

  const handlePrintPreview = () => {
    const completeFormData = collectFormDataForReport();
    setCollectedData(completeFormData);
    setShowPrintPreview(true);
  };

  const allParameters = reportData?.map((data) => data.parameter) ?? [];

  const uniqueMethods = [
    ...new Map(
      (reportData ?? []).map((item) => [item.methodCode, item])
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

  const PREPARATION_GROUPS = {
    assay: {
      id: "assay",
      label: "Preparations for Assay",
      color: "red",
      includes: [
        "standardPreparation",
        "samplePreparation",
        "calculationsAssay",
      ],
    },
    lod: {
      id: "lod",
      label: "Preparations for LOD",
      color: "sky",
      includes: ["samplePreparationLod", "calculationsLod"],
    },
    roi: {
      id: "roi",
      label: "Preparations for ROI",
      color: "orange",
      includes: ["samplePreparationROI", "calculationsROI"],
    },
    sulphatedAsh: {
      id: "sulphatedAsh",
      label: "Preparations for Sulphated Ash",
      color: "rose",
      includes: ["samplePreparationSulphatedAsh", "calculationsSulphatedAsh"],
    },
    residualSolvent: {
      id: "residualSolvent",
      label: "Preparations for Residual Solvent",
      color: "indigo",
      includes: [
        "standardPreparationRS",
        "samplePreparationRS",
        "calculationsRS",
      ],
    },
  } as const;

  const handleTogglePreparationGroup = (
    parameterId: number,
    groupId: string
  ) => {
    setActivePreparationGroups((prev) => {
      const currentGroups = prev[parameterId] || [];

      if (currentGroups.includes(groupId)) {
        // Remove group and clear all associated preparations
        const group =
          PREPARATION_GROUPS[groupId as keyof typeof PREPARATION_GROUPS];

        if (group.includes.includes("standardPreparation")) {
          setStandardPreparationPerParam((p) => {
            const { [parameterId]: _, ...rest } = p;
            return rest;
          });
        }
        if (group.includes.includes("samplePreparation")) {
          setSamplePreparationPerParam((p) => {
            const { [parameterId]: _, ...rest } = p;
            return rest;
          });
        }
        if (group.includes.includes("calculationsAssay")) {
          setCalculationsAssayPerParam((p) => {
            const { [parameterId]: _, ...rest } = p;
            return rest;
          });
        }
        if (group.includes.includes("samplePreparationLod")) {
          setSamplePreparationLodPerParam((p) => {
            const { [parameterId]: _, ...rest } = p;
            return rest;
          });
        }
        if (group.includes.includes("calculationsLod")) {
          setCalculationsLodPerParam((p) => {
            const { [parameterId]: _, ...rest } = p;
            return rest;
          });
        }
        if (group.includes.includes("samplePreparationROI")) {
          setSamplePreparationROIPerParam((p) => {
            const { [parameterId]: _, ...rest } = p;
            return rest;
          });
        }
        if (group.includes.includes("calculationsROI")) {
          setCalculationsROIPerParam((p) => {
            const { [parameterId]: _, ...rest } = p;
            return rest;
          });
        }
        if (group.includes.includes("samplePreparationSulphatedAsh")) {
          setSamplePreparationSulphatedAshPerParam((p) => {
            const { [parameterId]: _, ...rest } = p;
            return rest;
          });
        }
        if (group.includes.includes("calculationsSulphatedAsh")) {
          setCalculationsSulphatedAshPerParam((p) => {
            const { [parameterId]: _, ...rest } = p;
            return rest;
          });
        }
        // ADD RS CLEANUP
        if (group.includes.includes("standardPreparationRS")) {
          setStandardPreparationRSPerParam((p) => {
            const { [parameterId]: _, ...rest } = p;
            return rest;
          });
        }
        if (group.includes.includes("samplePreparationRS")) {
          setSamplePreparationRSPerParam((p) => {
            const { [parameterId]: _, ...rest } = p;
            return rest;
          });
        }
        if (group.includes.includes("calculationsRS")) {
          setCalculationsRSPerParam((p) => {
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
      {
        id: "assay",
        label: "Preparations for Assay",
        color: "red",
      },
      {
        id: "lod",
        label: "Preparations for LOD",
        color: "sky",
      },
      {
        id: "roi",
        label: "Preparations for ROI",
        color: "orange",
      },
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
    ];
  };

  if (loading) {
    return (
      <div className="mx-auto my-8 p-6 bg-gradient-to-br from-green-50 to-white max-w-4xl flex items-center justify-center min-h-[600px] rounded-2xl shadow-2xl">
        <motion.div
          key="loading"
          {...animationProps}
          className="flex flex-col justify-center items-center py-20 bg-white rounded-2xl shadow-2xl border-2 border-green-300 w-full min-h-[400px]"
        >
          <motion.div
            {...loadingIconProps}
            className="p-5 rounded-full bg-gradient-to-br from-green-100 to-green-300 mb-6 shadow-lg"
          >
            <LoaderCircle className="w-14 h-14 text-green-700" />
          </motion.div>
          <span className="text-2xl font-semibold text-green-800 tracking-wide">
            Loading Report Data
          </span>
          <span className="text-base text-gray-600 mt-3 max-w-md text-center font-medium">
            Fetching results for registration{" "}
            <span className="font-bold text-green-700">{registrationNo}</span>
          </span>
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
            Report Fetch Failed
          </span>
          <span className="text-base text-gray-600 mt-3 max-w-md text-center">
            {error}
          </span>
        </motion.div>
      </div>
    );
  }

  if (!sample) {
    return (
      <div className="mx-auto my-8 p-6 bg-white max-w-4xl flex items-center justify-center min-h-[600px]">
        <motion.div
          key="empty"
          {...animationProps}
          className="flex flex-col justify-center items-center py-20 bg-gradient-to-br from-gray-50 to-white rounded-2xl shadow-2xl border-2 border-gray-200 w-full min-h-[400px]"
        >
          <motion.div
            {...loadingIconProps}
            className="p-5 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 mb-6 shadow-lg"
          >
            <Target className="w-14 h-14 text-gray-500" />
          </motion.div>
          <span className="text-2xl font-semibold text-gray-700 tracking-wide">
            {registrationNo
              ? "No Sample Data Found"
              : "Enter Registration Number"}
          </span>
          <span className="text-base text-gray-500 mt-3 max-w-md text-center">
            {registrationNo
              ? `The search for ${registrationNo} returned no associated sample records.`
              : "Please use the search tool above to look up a Raw Data Work Sheet."}
          </span>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="mx-auto my-8 p-8 bg-white shadow-2xl max-w-4xl border-2 border-emerald-300 rounded-2xl">
      {/* Header Section */}
      <div className="flex justify-between items-center text-sm mb-6 pb-4 border-b-2 border-emerald-200">
        <div></div>
        <div className="flex flex-col items-end">
          <img src="./ic_efrac.png" alt="EFRAC Logo" className="h-10" />
        </div>
      </div>

      {/* Company Title */}
      <div className="my-4 border-2 border-emerald-400 rounded-xl overflow-hidden shadow-lg">
        <div className="flex justify-between items-center px-6 py-4 bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-700">
          <h1 className="text-lg font-bold text-white tracking-wide">
            EDWARD FOOD RESEARCH & ANALYSIS CENTRE LTD
          </h1>
        </div>
      </div>

      {/* Registration Info Table */}
      <div className="my-4 border-2 border-emerald-300 rounded-xl overflow-hidden shadow-md">
        <div className="grid grid-cols-2 border-b border-emerald-300 text-sm bg-gradient-to-r from-emerald-50 to-teal-50">
          <div className="flex items-center px-4 py-3 border-r-2 border-emerald-300">
            <span className="font-bold mr-2 text-emerald-900">
              Registration No:
            </span>
            <span className="font-semibold text-slate-700">
              {sample?.registrationNo || registrationNo || "---"}
            </span>
          </div>
          <div className="flex items-center px-4 py-3">
            <span className="font-bold mr-2 text-emerald-900">
              Date of Receipt:
            </span>
            <span className="font-semibold text-slate-700">
              {dateOfReceipt}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 border-b border-emerald-300 text-sm bg-white">
          <div className="flex items-center px-4 py-3 border-r-2 border-emerald-300">
            <span className="font-bold mr-2 text-emerald-900">
              Sample Name:
            </span>
            <span className="font-semibold text-slate-700">
              {sample?.sampleName || "---"}
            </span>
          </div>
          <div className="flex items-center px-4 py-3">
            <span className="font-bold mr-2 text-emerald-900">
              Number of Parameters:
            </span>
            <span className="font-semibold text-slate-700">
              {allParameters.length}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-3 text-sm bg-gradient-to-r from-emerald-50 to-teal-50">
          <div className="flex items-center px-4 py-3 border-r-2 border-emerald-300">
            <span className="font-bold mr-2 text-emerald-900">Due Date:</span>
            <span className="font-semibold text-slate-700">
              {sample?.tatDate || "---"}
            </span>
          </div>
          <div className="flex items-center px-4 py-3 border-r-2 border-emerald-300">
            <span className="font-bold mr-2 text-emerald-900">
              Analysis Started On:
            </span>
            <span className="font-semibold text-slate-700">
              {sample?.analysisStartDate || "---"}
            </span>
          </div>
          <div className="flex items-center px-4 py-3">
            <span className="font-bold mr-2 text-emerald-900">
              Analysis Completed On:
            </span>
            <span className="font-semibold text-slate-700">
              {sample?.analysisCompletionDate || "---"}
            </span>
          </div>
        </div>
      </div>

      {/* Main Table */}
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
                  {sample?.sampleName || "---"}
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
            <div className="relative">
              <button
                onClick={() => setShowParameterDropdown(!showParameterDropdown)}
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
                        onClick={() => handleAddParameter(param)}
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
          </div>

          <AnimatePresence>
            {addedParameters.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-2"
              >
                {addedParameters.map((param) => (
                  <motion.div
                    key={param.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="flex items-center justify-between mt-5 p-4 bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 border-2 border-emerald-200 rounded-xl shadow-inner"
                  >
                    <div className="flex-1">
                      <div className="font-semibold text-emerald-900 text-sm">
                        {param.parameter}
                      </div>
                      <div className="text-xs text-emerald-600">
                        {param.paraCode} • {param.methodName}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => toggleParameterDetail(param.id)}
                        className={`px-3 py-1 font-medium rounded text-xs transition-colors ${
                          selectedParamsForDetail.includes(param.id)
                            ? "bg-orange-100 text-orange-700 hover:bg-orange-200"
                            : "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                        }`}
                      >
                        {selectedParamsForDetail.includes(param.id)
                          ? "Hide Details"
                          : "View Details"}
                      </button>
                      <motion.button
                        onClick={() => handleRemoveParameter(param.id)}
                        whileHover={{ scale: 1.1, rotate: 10 }}
                        whileTap={{ scale: 0.9 }}
                        className="mx-2"
                      >
                        <CgTrash className="w-5 h-5 text-red-500" />
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
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
                            Click the{" "}
                <strong className="text-emerald-700">"Add Parameters"</strong>
                button above to add parameters
              </p>
            </motion.div>
          )}
        </div>

        {addedParameters
          .filter((param) => selectedParamsForDetail.includes(param.id))
          .map((selectedParam) => (
            <AnimatePresence key={selectedParam.id}>
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="my-6"
              >
                <div className="bg-white rounded-lg border border-emerald-600 overflow-hidden mb-4 shadow-lg">
                  <div className="flex items-center justify-between px-4 py-2 bg-gradient-to-r from-emerald-100 to-emerald-200 ">
                    <h3 className="text-base font-bold text-emerald-900">
                      Parameter Details: {selectedParam.parameter}
                    </h3>
                    <button
                      onClick={() => toggleParameterDetail(selectedParam.id)}
                      className="text-green-700 hover:text-emerald-900 font-bold text-lg"
                    >
                      ✕
                    </button>
                  </div>

                  <table className="w-full border-collapse text-sm">
                    <tbody>
                      <tr>
                        <td className="w-1/2 px-3 py-3 border-r-1 border-emerald-500 font-semibold text-center bg-emerald-800 text-white">
                          Parameter Code
                        </td>
                        <td className="w-1/2 px-3 py-3 font-semibold text-center bg-emerald-800 text-white">
                          Parameter Name
                        </td>
                      </tr>
                      <tr className="hover:bg-emerald-50 transition-colors">
                        <td className="w-1/2 px-3 py-3 border-r-1 border-emerald-500 font-semibold text-center bg-emerald-50 text-gray-900">
                          {selectedParam.paraCode}
                        </td>
                        <td className="w-1/2 px-3 py-3 font-semibold text-center bg-emerald-50">
                          {selectedParam.parameter}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-bold text-emerald-900 flex items-center gap-2.5 tracking-tight mb-3">
                      <span className="w-1.5 h-6 bg-gradient-to-b from-emerald-500 to-emerald-700 rounded-full"></span>
                      Instruments Details:
                    </h3>
                    <div className="relative" ref={instrumentRef}>
                      <button
                        onClick={() =>
                          setShowInstrumentDropdown(!showInstrumentDropdown)
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
                                    !addedInstruments[selectedParam.id]?.find(
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
                                  !addedInstruments[selectedParam.id]?.find(
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
                          <th className="px-3 py-2 text-center font-bold w-20">
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <AnimatePresence>
                          {addedInstruments[selectedParam.id]?.length > 0 ? (
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
                                    {instrument.calibrationDoneDate || "---"}
                                  </td>
                                  <td className="px-3 py-2 border-r-2 border-emerald-500">
                                    {instrument.calibrationDueDate || "---"}
                                  </td>
                                  <td className="px-3 py-2 text-center">
                                    <motion.button
                                      onClick={() =>
                                        handleRemoveInstrument(
                                          selectedParam.id,
                                          instrument.id
                                        )
                                      }
                                      whileHover={{ scale: 1.1, rotate: 10 }}
                                      whileTap={{ scale: 0.9 }}
                                      className="mx-2"
                                    >
                                      <CgTrash className="w-5 h-5 text-red-500" />
                                    </motion.button>
                                  </td>
                                </motion.tr>
                              )
                            )
                          ) : (
                            <tr className="border-2 border-emerald-500">
                              <td
                                colSpan={5}
                                className="px-3 py-4 text-center text-gray-500"
                              >
                                <div className="flex flex-col items-center gap-2">
                                  <Target className="w-8 h-8 opacity-30" />
                                  <span>
                                    No instruments added. Click "Add Instrument"
                                    to add.
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
                                    !addedChemicals[selectedParam.id]?.find(
                                      (added) => added.id === chem.id
                                    )
                                )
                                .map((chem) => (
                                  <button
                                    key={chem.id}
                                    onClick={() =>
                                      handleAddChemical(selectedParam.id, chem)
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
                          <th className="px-3 py-2 text-center font-bold w-20">
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <AnimatePresence>
                          {addedChemicals[selectedParam.id]?.length > 0 ? (
                            addedChemicals[selectedParam.id].map((chemical) => (
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
                                <td className="px-3 py-2 text-center">
                                  <motion.button
                                    onClick={() =>
                                      handleRemoveChemical(
                                        selectedParam.id,
                                        chemical.id
                                      )
                                    }
                                    whileHover={{ scale: 1.1, rotate: 10 }}
                                    whileTap={{ scale: 0.9 }}
                                    className="mx-2"
                                  >
                                    <CgTrash className="w-5 h-5 text-red-500" />
                                  </motion.button>
                                </td>
                              </motion.tr>
                            ))
                          ) : (
                            <tr className="border-2 border-emerald-500">
                              <td
                                colSpan={5}
                                className="px-3 py-4 text-center text-gray-500"
                              >
                                <div className="flex flex-col items-center gap-2">
                                  <Target className="w-8 h-8 opacity-30" />
                                  <span>
                                    No chemicals added. Click "Add Chemical" to
                                    add.
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
                                    !addedStandards[selectedParam.id]?.find(
                                      (added) => added.id === std.id
                                    )
                                )
                                .map((std) => (
                                  <button
                                    key={std.id}
                                    onClick={() =>
                                      handleAddStandard(selectedParam.id, std)
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
                                  !addedStandards[selectedParam.id]?.find(
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
                          <th className="px-3 py-2 text-center font-bold w-20">
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <AnimatePresence>
                          {addedStandards[selectedParam.id]?.length > 0 ? (
                            addedStandards[selectedParam.id].map((standard) => (
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
                                <td className="px-3 py-2 text-center">
                                  <motion.button
                                    onClick={() =>
                                      handleRemoveStandard(
                                        selectedParam.id,
                                        standard.id
                                      )
                                    }
                                    whileHover={{ scale: 1.1, rotate: 10 }}
                                    whileTap={{ scale: 0.9 }}
                                    className="mx-2"
                                  >
                                    <CgTrash className="w-5 h-5 text-red-500" />
                                  </motion.button>
                                </td>
                              </motion.tr>
                            ))
                          ) : (
                            <tr className="border-2 border-emerald-500">
                              <td
                                colSpan={6}
                                className="px-3 py-4 text-center text-gray-500"
                              >
                                <div className="flex flex-col items-center gap-2">
                                  <Target className="w-8 h-8 opacity-30" />
                                  <span>
                                    No standards added. Click "Add Standard" to
                                    add.
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
                      handleDiluentChange(selectedParam.id, e.target.value)
                    }
                    placeholder="Enter diluent preparation details..."
                    className="w-full min-h-[100px] border border-emerald-300 rounded-lg p-3 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>

                {/* ============= PREPARATIONS MANAGEMENT SECTION ============= */}
                <div className="mb-8 p-6 bg-gradient-to-br from-emerald-50 via-teal-50 to-emerald-50 border-2 border-emerald-400 rounded-2xl shadow-2xl">
                  {/* Header with Add Button */}
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
                          Configure analysis preparations for this parameter
                        </p>
                      </div>
                    </div>
                    <div className="relative" ref={preparationDropdownRef}>
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
                        <span className="relative z-10">Add Preparations</span>
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
                            })}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                  {/* Added Preparations Chips Display */}
                  <AnimatePresence>
                    {(() => {
                      const activeGroups =
                        activePreparationGroups[selectedParam.id] || [];

                      const groupInfo = {};

                      activeGroups.forEach((groupId) => {
                        const group = PREPARATION_GROUPS[groupId];
                        let count = 0;

                        if (groupId === "assay") {
                          count =
                            (
                              standardPreparationPerParam[selectedParam.id] ||
                              []
                            ).length +
                            (samplePreparationPerParam[selectedParam.id] || [])
                              .length +
                            (calculationsAssayPerParam[selectedParam.id] || [])
                              .length;
                        } else if (groupId === "lod") {
                          count =
                            (
                              samplePreparationLodPerParam[selectedParam.id] ||
                              []
                            ).length +
                            (calculationsLodPerParam[selectedParam.id] || [])
                              .length;
                        } else if (groupId === "roi") {
                          count =
                            (
                              samplePreparationROIPerParam[selectedParam.id] ||
                              []
                            ).length +
                            (calculationsROIPerParam[selectedParam.id] || [])
                              .length;
                        } else if (groupId === "sulphatedAsh") {
                          count =
                            (
                              samplePreparationSulphatedAshPerParam[
                                selectedParam.id
                              ] || []
                            ).length +
                            (
                              calculationsSulphatedAshPerParam[
                                selectedParam.id
                              ] || []
                            ).length;
                        } else if (groupId === "residualSolvent") {
                          count =
                            (
                              standardPreparationRSPerParam[selectedParam.id] ||
                              []
                            ).length +
                            (
                              samplePreparationRSPerParam[selectedParam.id] ||
                              []
                            ).length +
                            (calculationsRSPerParam[selectedParam.id] || [])
                              .length;
                        }

                        groupInfo[groupId] = {
                          label: group.label,
                          color: group.color,
                          count,
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
                                      colorClasses[info.color] ||
                                      colorClasses["default"];

                                    return (
                                      <motion.div
                                        key={groupId}
                                        initial={{
                                          opacity: 0,
                                          scale: 0.8,
                                          y: 20,
                                        }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.8, y: 20 }}
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
                                      button to remove a preparation group and
                                      all its data. The number badge shows total
                                      items in the group. Use
                                      <strong>"Add Preparation"</strong> to
                                      enable more groups.
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
                            button above to select preparation groups for this
                            parameter
                          </p>
                        </motion.div>
                      );
                    })()}
                  </AnimatePresence>
                </div>
                {/* ============= END OF PREPARATIONS MANAGEMENT SECTION ============= */}

                {/* ============= ASSAY GROUP CARD ============= */}
                {(activePreparationGroups[selectedParam.id] || []).includes(
                  "assay"
                ) && (
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
                          {(standardPreparationPerParam[selectedParam.id] || [])
                            .length +
                            (samplePreparationPerParam[selectedParam.id] || [])
                              .length +
                            (calculationsAssayPerParam[selectedParam.id] || [])
                              .length}{" "}
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
                        <button
                          onClick={() =>
                            handleAddStandardPreparation(selectedParam.id)
                          }
                          className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-red-600 to-rose-700 text-white font-semibold rounded-xl hover:from-red-700 hover:to-rose-800 transition-all duration-200 shadow-md hover:shadow-lg text-sm transform"
                        >
                          <Plus className="w-4 h-4" />
                          Add Preparation
                        </button>
                      </div>

                      <AnimatePresence>
                        {(
                          standardPreparationPerParam[selectedParam.id] || []
                        ).map((standardPreparation: any, idx: number) => {
                          const assignedStandard = (
                            addedStandards[selectedParam.id] || []
                          ).find(
                            (std) =>
                              std.id === standardPreparation.assignedStandardId
                          );

                          const correspondingSample =
                            (samplePreparationPerParam[selectedParam.id] || [])[
                              idx
                            ];

                          return (
                            <div key={standardPreparation.id} className="mb-6">
                              <div className="overflow-hidden">
                                <StandardPreparationDetail
                                  standardPreparation={standardPreparation}
                                  assignedStandard={assignedStandard || null}
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
                                />
                              </div>

                              {correspondingSample && (
                                <div className="mt-4">
                                  <div className="overflow-hidden">
                                    <SamplePreparationDetail
                                      samplePreparation={correspondingSample}
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
                                    />
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </AnimatePresence>

                      {(standardPreparationPerParam[selectedParam.id] || [])
                        .length === 0 && (
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
                        <motion.button
                          onClick={() =>
                            handleAddCalculationAssay(selectedParam.id)
                          }
                          whileHover={{ scale: 1 }}
                          whileTap={{ scale: 1 }}
                          className="flex items-center gap-1.5 p-2.5 bg-gradient-to-r from-red-600 to-rose-600 text-white font-semibold rounded-xl hover:from-red-700 hover:to-rose-700 transition-all duration-200 shadow-lg hover:shadow-xl text-xs"
                        >
                          <Plus className="w-4 h-4" />
                          Add Assay Calculation
                        </motion.button>
                      </div>

                      <AnimatePresence>
                        {(
                          calculationsAssayPerParam[selectedParam.id] || []
                        ).map((calculation) => (
                          <CalculationDetailAssay
                            key={calculation.id}
                            calculation={calculation}
                            standardPreparations={
                              standardPreparationPerParam[selectedParam.id] ||
                              []
                            }
                            samplePreparations={
                              samplePreparationPerParam[selectedParam.id] || []
                            }
                            onFieldChange={(calculationId, field, value) =>
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
                          />
                        ))}
                      </AnimatePresence>

                      {(calculationsAssayPerParam[selectedParam.id] || [])
                        .length === 0 && (
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
                  </motion.div>
                )}

                {/* ============= LOD GROUP CARD ============= */}
                {(activePreparationGroups[selectedParam.id] || []).includes(
                  "lod"
                ) && (
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
                            samplePreparationLodPerParam[selectedParam.id] || []
                          ).length +
                            (calculationsLodPerParam[selectedParam.id] || [])
                              .length}{" "}
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
                        <button
                          onClick={() =>
                            handleAddSamplePreparationLod(selectedParam.id)
                          }
                          className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-sky-600 to-blue-700 text-white font-semibold rounded-xl hover:from-sky-700 hover:to-blue-800 transition-all duration-200 shadow-md hover:shadow-lg transform text-sm"
                        >
                          <Plus className="w-4 h-4" />
                          Add Preparation
                        </button>
                      </div>

                      <AnimatePresence>
                        {(
                          samplePreparationLodPerParam[selectedParam.id] || []
                        ).map((samplePreparationLod) => (
                          <div className="overflow-hidden" key={samplePreparationLod.id}>
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
                            />
                          </div>
                        ))}
                      </AnimatePresence>

                      {(samplePreparationLodPerParam[selectedParam.id] || [])
                        .length === 0 && (
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
                          <span className="text-sky-600">LOD Calculations</span>
                        </h3>
                        <motion.button
                          onClick={() =>
                            handleAddCalculationLod(selectedParam.id)
                          }
                          whileHover={{ scale: 1 }}
                          whileTap={{ scale: 1 }}
                          className="flex items-center gap-1.5 p-2.5 bg-gradient-to-r from-sky-600 to-blue-600 text-white font-semibold rounded-xl hover:from-sky-700 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl text-xs"
                        >
                          <Plus className="w-4 h-4" />
                          Add LOD Calculation
                        </motion.button>
                      </div>

                      <AnimatePresence>
                        {(calculationsLodPerParam[selectedParam.id] || []).map(
                          (calculation) => (
                            <CalculationDetailLod
                              key={calculation.id}
                              calculation={calculation}
                              samplePreparations={
                                samplePreparationLodPerParam[
                                  selectedParam.id
                                ] || []
                              }
                              onFieldChange={(calculationId, field, value) =>
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
                            />
                          )
                        )}
                      </AnimatePresence>

                      {(calculationsLodPerParam[selectedParam.id] || [])
                        .length === 0 && (
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
                  </motion.div>
                )}

                {/* ============= ROI GROUP CARD ============= */}
                {(activePreparationGroups[selectedParam.id] || []).includes(
                  "roi"
                ) && (
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
                            samplePreparationROIPerParam[selectedParam.id] || []
                          ).length +
                            (calculationsROIPerParam[selectedParam.id] || [])
                              .length}{" "}
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
                        <button
                          onClick={() =>
                            handleAddSamplePreparationROI(selectedParam.id)
                          }
                          className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-orange-600 to-amber-700 text-sm text-white font-semibold rounded-xl hover:from-orange-700 hover:to-amber-800 transition-all duration-200 shadow-md hover:shadow-lg transform"
                        >
                          <Plus className="w-4 h-4" />
                          Add Preparation
                        </button>
                      </div>

                      <AnimatePresence>
                        {(
                          samplePreparationROIPerParam[selectedParam.id] || []
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
                            />
                          </div>
                        ))}
                      </AnimatePresence>

                      {(samplePreparationROIPerParam[selectedParam.id] || [])
                        .length === 0 && (
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
                        <motion.button
                          onClick={() =>
                            handleAddCalculationROI(selectedParam.id)
                          }
                          whileHover={{ scale: 1 }}
                          whileTap={{ scale: 1 }}
                          className="flex items-center gap-1.5 p-2.5 bg-gradient-to-r from-amber-600 to-orange-600 text-white font-semibold rounded-xl hover:from-amber-700 hover:to-orange-700 transition-all duration-200 shadow-lg hover:shadow-xl text-xs"
                        >
                          <Plus className="w-4 h-4" />
                          Add ROI Calculation
                        </motion.button>
                      </div>

                      <AnimatePresence>
                        {(calculationsROIPerParam[selectedParam.id] || []).map(
                          (calculation) => (
                            <CalculationDetailROI
                              key={calculation.id}
                              calculation={calculation}
                              samplePreparations={
                                samplePreparationROIPerParam[
                                  selectedParam.id
                                ] || []
                              }
                              onFieldChange={(calculationId, field, value) =>
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
                            />
                          )
                        )}
                      </AnimatePresence>

                      {(calculationsROIPerParam[selectedParam.id] || [])
                        .length === 0 && (
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
                  </motion.div>
                )}

                {/* ============= Sulphated Ash GROUP CARD ============= */}
                {(activePreparationGroups[selectedParam.id] || []).includes("sulphatedAsh") && (
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
                          {(samplePreparationSulphatedAshPerParam[selectedParam.id] || []).length +
                          (calculationsSulphatedAshPerParam[selectedParam.id] || []).length} Items
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
                        <button
                          onClick={() => handleAddSamplePreparationSulphatedAsh(selectedParam.id)}
                          className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-rose-600 to-rose-700 text-white font-semibold rounded-xl hover:from-rose-700 hover:to-rose-800 transition-all duration-200 shadow-md hover:shadow-lg transform text-sm"
                        >
                          <Plus className="w-4 h-4" />
                          Add Preparation
                        </button>
                      </div>

                      <AnimatePresence>
                        {(samplePreparationSulphatedAshPerParam[selectedParam.id] || []).map((samplePreparationSulphatedAsh) => (
                          <div className="overflow-hidden" key={samplePreparationSulphatedAsh.id}>
                            <SamplePreparationSulphatedAshDetail
                              samplePreparationSulphatedAsh={samplePreparationSulphatedAsh}
                              onStepChange={(samplePreparationSulphatedAshId, stepName, field, newValue) =>
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
                            />
                          </div>
                        ))}
                      </AnimatePresence>

                      {(samplePreparationSulphatedAshPerParam[selectedParam.id] || []).length === 0 && (
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
                              Click the add button to create Sulphated Ash sample preparation
                            </p>
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-rose-100/50 rounded-lg border border-rose-200">
                              <div className="w-2 h-2 bg-rose-500 rounded-full animate-ping" />
                              <span className="text-xs font-semibold text-rose-700">Ready to start</span>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </div>

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
                          <span className="text-pink-600">Sulphated Ash Calculations</span>
                        </h3>
                        <motion.button
                          onClick={() => handleAddCalculationSulphatedAsh(selectedParam.id)}
                          whileHover={{ scale: 1 }}
                          whileTap={{ scale: 1 }}
                          className="flex items-center gap-1.5 p-2.5 bg-gradient-to-r from-pink-600 to-rose-600 text-white font-semibold rounded-xl hover:from-pink-700 hover:to-rose-700 transition-all duration-200 shadow-lg hover:shadow-xl text-xs"
                        >
                          <Plus className="w-4 h-4" />
                          Add Ash Calculation
                        </motion.button>
                      </div>
                      
                      <AnimatePresence>
                        {(calculationsSulphatedAshPerParam[selectedParam.id] || []).map((calculation) => (
                          <CalculationDetailSulphatedAsh
                            key={calculation.id}
                            calculation={calculation}
                            samplePreparations={
                              samplePreparationSulphatedAshPerParam[selectedParam.id] || []
                            }
                            onFieldChange={(calculationId, field, value) =>
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
                          />
                        ))}
                      </AnimatePresence>

                      {(calculationsSulphatedAshPerParam[selectedParam.id] || []).length === 0 && (
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
                  </motion.div>
                )}

                {/* ============= RESIDUAL SOLVENT GROUP CARD ============= */}
                {(activePreparationGroups[selectedParam.id] || []).includes("residualSolvent") && (
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
                          {(standardPreparationRSPerParam[selectedParam.id] || []).length +
                          (samplePreparationRSPerParam[selectedParam.id] || []).length +
                          (calculationsRSPerParam[selectedParam.id] || []).length} Items
                        </span>
                      </div>
                    </div>

                    {/* Combined Preparations Header with Single Add Button */}
                    <div className="mb-8">
                      <div className="flex items-center justify-between mb-4 px-2">
                        <h3 className="text-lg font-bold text-indigo-900 flex items-center gap-2.5 tracking-tight">
                          <span className="w-1.5 h-6 bg-gradient-to-b from-indigo-500 to-blue-700 rounded-full"></span>
                          Standard & Sample Preparations for Residual Solvent
                        </h3>
                        <button
                          onClick={() => handleAddStandardPreparationRS(selectedParam.id)}
                          className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-indigo-600 to-blue-700 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-blue-800 transition-all duration-200 shadow-md hover:shadow-lg text-sm transform"
                        >
                          <Plus className="w-4 h-4" />
                          Add Preparation
                        </button>
                      </div>

                      {/* Preparations List */}
                      <AnimatePresence>
                        {(standardPreparationRSPerParam[selectedParam.id] || []).map(
                          (standardPreparation: any, idx: number) => {
                            const assignedStandard = (
                              addedStandards[selectedParam.id] || []
                            ).find(
                              (std) => std.id === standardPreparation.assignedStandardId
                            );

                            const correspondingSample = (
                              samplePreparationRSPerParam[selectedParam.id] || []
                            )[idx];

                            return (
                              <div key={standardPreparation.id} className="mb-6">
                                <div className="overflow-hidden">
                                  <StandardPreparationDetail
                                    standardPreparation={standardPreparation}
                                    assignedStandard={assignedStandard || null}
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
                                  />
                                </div>

                                {/* Corresponding Sample Preparation for RS */}
                                {correspondingSample && (
                                  <div className="mt-4">
                                    <div className="overflow-hidden">
                                      <SamplePreparationDetail
                                        samplePreparation={correspondingSample}
                                        assignedStandard={assignedStandard || null}
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
                                      />
                                    </div>
                                  </div>
                                )}
                              </div>
                            );
                          }
                        )}
                      </AnimatePresence>

                      {/* Empty State */}
                      {(standardPreparationRSPerParam[selectedParam.id] || []).length === 0 && (
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
                              Click "Add Preparation" to create standard and sample preparations for Residual Solvent
                            </p>
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100/50 rounded-lg border border-indigo-200">
                              <div className="w-2 h-2 bg-indigo-500 rounded-full animate-ping" />
                              <span className="text-xs font-semibold text-indigo-700">Ready to start</span>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </div>

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
                          <span className="text-indigo-600">Residual Solvent Calculations</span>
                        </h3>
                        <motion.button
                          onClick={() => handleAddCalculationRS(selectedParam.id)}
                          whileHover={{ scale: 1}}
                          whileTap={{ scale: 1 }}
                          className="flex items-center gap-1.5 p-2.5 bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl text-xs"
                        >
                          <Plus className="w-4 h-4" />
                          Add RS Calculation
                        </motion.button>
                      </div>

                      <AnimatePresence>
                        {(calculationsRSPerParam[selectedParam.id] || []).map(
                          (calculation) => (
                            <CalculationDetailRS
                              key={calculation.id}
                              calculation={calculation}
                              standardPreparations={
                                standardPreparationRSPerParam[selectedParam.id] || []
                              }
                              samplePreparations={
                                samplePreparationRSPerParam[selectedParam.id] || []
                              }
                              onFieldChange={(calculationId, field, value) =>
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
                            />
                          )
                        )}
                      </AnimatePresence>

                      {(calculationsRSPerParam[selectedParam.id] || []).length === 0 && (
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
                  </motion.div>
                )}

                {/* Preparation of Test Solution */}
                <div className="mb-4">
                  <h3 className="text-base font-bold mb-2 text-green-900">
                    Preparation of Test solution or Sample solution:
                  </h3>
                  <textarea
                    value={testSolutionPerParam[selectedParam.id] || ""}
                    onChange={(e) =>
                      handleTestSolutionChange(selectedParam.id, e.target.value)
                    }
                    placeholder="Enter test solution preparation details..."
                    className="w-full min-h-[100px] border border-green-300 rounded-lg p-3 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </motion.div>
            </AnimatePresence>
          ))}

        {/* Footer Section */}
        <div className="border-2 border-emerald-600 mt-8 rounded-lg overflow-hidden shadow-lg">
          <div className="grid grid-cols-3 border-b-2 border-emerald-600 text-sm font-bold text-center bg-gradient-to-r from-emerald-100 to-emerald-200">
            <div className="flex flex-col justify-center border-r-2 border-emerald-600 p-4 hover:bg-emerald-300 transition-colors">
              <span className="text-emerald-900">REVIEWED BY (QC)</span>
              <span className="font-normal text-xs text-gray-600 mt-1">
                (Sign & Date)
              </span>
            </div>
            <div className="flex flex-col justify-center border-r-2 border-emerald-600 p-4 hover:bg-emerald-300 transition-colors">
              <span className="text-emerald-900">REVIEWED BY (QA)</span>
              <span className="font-normal text-xs text-gray-600 mt-1">
                (Sign & Date)
              </span>
            </div>
            <div className="flex flex-col justify-center p-4 hover:bg-emerald-300 transition-colors">
              <span className="text-emerald-900">APPROVED BY (QA)</span>
              <span className="font-normal text-xs text-gray-600 mt-1">
                (Sign & Date)
              </span>
            </div>
          </div>

          <div className="grid grid-cols-3 border-b border-emerald-500 text-xs bg-emerald-50">
            <div className="flex items-center px-3 py-2 border-r-2 border-emerald-500">
              <span className="font-bold mr-2 text-emerald-900">
                Prepared By:
              </span>
              <span className="text-gray-700">{preparedBy}</span>
            </div>
            <div className="flex items-center px-3 py-2 border-r-2 border-emerald-500">
              <span className="font-bold mr-2 text-emerald-900">
                Issued & Approved By:
              </span>
              <span className="text-gray-700">{issuedApprovedBy}</span>
            </div>
            <div className="flex items-center px-3 py-2">
              <span className="font-bold mr-2 text-emerald-900">
                Effective Issue Date:
              </span>
              <span className="text-gray-700">{effectiveIssueDate}</span>
            </div>
          </div>

          <div className="grid grid-cols-3 text-xs bg-white">
            <div className="flex items-center px-3 py-2 border-r-2 border-emerald-500">
              <span className="font-bold mr-2 text-emerald-900">
                Approved By:
              </span>
              <span className="text-gray-700">{approvedBy}</span>
            </div>
            <div className="flex items-center px-3 py-2 border-r-2 border-emerald-500">
              <span className="font-bold mr-2 text-emerald-900">
                Classified:
              </span>
              <span className="text-red-600 font-semibold">{classified}</span>
            </div>
            <div className="flex items-center px-3 py-2">
              <span className="font-bold mr-2 text-emerald-900">
                Revision Date:
              </span>
              <span className="text-gray-700">{revisionDate}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex gap-3 justify-center no-print">
          <motion.button
            onClick={handleSaveDraft}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="relative px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg text-sm flex items-center gap-2"
          >
            Save Draft
            <AnimatePresence>
              {saveSuccess && (
                <motion.span
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0 }}
                  className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full p-1"
                >
                  <Check className="w-3 h-3" />
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
          <button
            onClick={handleSubmit}
            className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-semibold rounded-lg hover:from-emerald-700 hover:to-emerald-800 transition-all shadow-md hover:shadow-lg text-sm"
          >
            Submit for Review
          </button>
          <button
            onClick={handlePrintPreview}
            className="px-6 py-2.5 bg-gradient-to-r from-teal-600 to-teal-700 text-white font-semibold rounded-lg hover:from-teal-700 hover:to-teal-800 transition-all shadow-md hover:shadow-lg text-sm"
          >
            Print Preview
          </button>
        </div>
      </div>

      {/* Data Preview Dialog */}
      <DataPreviewDialog
        isOpen={showDataDialog}
        onClose={() => setShowDataDialog(false)}
        data={collectedData}
      />

      {/* Print Preview Dialog */}
      <PrintPreviewDialog
        isOpen={showPrintPreview}
        onClose={() => setShowPrintPreview(false)}
        data={collectedData}
      />

      <StandardSelectionDialog
        isOpen={showStandardSelectionDialog}
        onClose={() => {
          setShowStandardSelectionDialog(false);
          setCurrentParameterForStandardPrep(null);
          setIsAddingRSStandard(false);
        }}
        availableStandards={
          currentParameterForStandardPrep !== null
            ? getAvailableStandardsForParameter(
                currentParameterForStandardPrep,
                isAddingRSStandard // This flag determines which list to check
              )
            : []
        }
        onSelectStandard={(standard) => {
          handleStandardSelectedForPreparation(standard, isAddingRSStandard);
        }}
      />
    </div>
  );
};

export default FormPreview;
