import React, { useState, useRef, useEffect, useCallback } from "react";
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
import {
  fetchWorksheetById,
  updateWorksheet,
  fetchSample,
} from "../services/api";
import type { WorksheetDetail } from "../models/requests/WorksheetDetail";
import type { WorksheetRequest } from "../models/requests/WorksheetRequest";

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

interface FormPreviewProps {
  worksheetId: string;
  instruments: Instrument[];
  standards: Standard[];
  chemicals: Chemical[];
  columns: Column[];
  isReferenceDataLoading: boolean;
  referenceDataError: string | null;
}

interface AddedParameter extends SampleData {
  id: number;
}

// Factory functions for creating new preparation objects
const createNewCalculationDisso = (index: number): CalculationDisso => ({
  id: Date.now() + index,
  label: `Dissolution Calculation ${index + 1}`,
  selectedStandardPrepId: null,
  selectedSamplePrepDissoId: null,
  areaOfSample: "",
  areaOfStandard: "",
  mwBase: "",
  mwSalt: "",
  claim: "",
  purity: "",
});

const createNewCalculationAssay = (index: number): CalculationAssay => ({
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
  labelClaim: "",
});

const createNewCalculationLod = (index: number): CalculationLod => ({
  id: Date.now() + index,
  label: `LOD Calculation ${index + 1}`,
  selectedSamplePrepId: null,
  w1_emptyDish: "",
  w2_dishWithSample: "",
  w3_dishAfterIgnition: "",
});

const createNewCalculationROI = (index: number): CalculationROI => ({
  id: Date.now() + index,
  label: `ROI Calculation ${index + 1}`,
  selectedSamplePrepId: null,
  w1_emptyDish: "",
  w2_dishWithSample: "",
  w3_dishAfterIgnition: "",
});

const createNewCalculationSulphatedAsh = (
  index: number
): CalculationSulphatedAsh => ({
  id: Date.now() + index,
  label: `Sulphated Ash Calculation ${index + 1}`,
  selectedSamplePrepId: null,
  w1_emptyCrucible: "",
  w2_crucibleWithSample: "",
  w3_crucibleAfterAsh: "",
});

const createNewStandardPreparation = (index: number): StandardPreparation => ({
  id: Date.now() + index,
  label: `Standard Preparation ${index + 1}`,
  assignedStandardId: null,
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
});

const createNewSamplePreparation = (index: number): SamplePreparation => ({
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
});

const createNewSamplePreparationLod = (
  index: number
): SamplePreparationLod => ({
  id: Date.now() + index,
  label: `Sample Preparation ${index + 1} for LOD`,
  steps: [
    { name: "Weighing (Empty Bottle)", value: "", unit: "g", logBookID: "" },
    { name: "Weighing (Before Drying)", value: "", unit: "g", logBookID: "" },
    {
      name: "Drying",
      temp: "",
      tempUnit: "°C",
      time: "",
      timeUnit: "min",
      logBookID: "",
    },
    { name: "Weighing (After Drying)", value: "", unit: "g", logBookID: "" },
  ],
});

const createNewSamplePreparationSulphatedAsh = (
  index: number
): SamplePreparationSulphatedAsh => ({
  id: Date.now() + index,
  label: `Sample Preparation ${index + 1} for Sulphated Ash`,
  steps: [
    { name: "Weighing (Empty Crucible)", value: "", unit: "g", logBookID: "" },
    { name: "Weighing (Before Drying)", value: "", unit: "g", logBookID: "" },
    {
      name: "Drying",
      temp: "",
      tempUnit: "°C",
      time: "",
      timeUnit: "min",
      logBookID: "",
    },
    { name: "Weighing (After Drying)", value: "", unit: "g", logBookID: "" },
  ],
});

const createNewSamplePreparationROI = (
  index: number
): SamplePreparationROI => ({
  id: Date.now() + index,
  label: `Sample Preparation ${index + 1} for ROI`,
  steps: [
    { name: "Weighing (Empty Crucible)", value: "", unit: "g", logBookID: "" },
    { name: "Weighing (Before Drying)", value: "", unit: "g", logBookID: "" },
    {
      name: "Drying",
      temp: "",
      tempUnit: "°C",
      time: "",
      timeUnit: "min",
      logBookID: "",
    },
    { name: "Weighing (After Drying)", value: "", unit: "g", logBookID: "" },
  ],
});

const createNewSamplePreparationDisso = (
  index: number
): SamplePreparationDisso => ({
  id: Date.now() + index,
  label: `Sample Preparation ${index + 1}`,
  assignedStandardId: null,
  steps: [
    { name: "Instrument Details", id: "", rpm: "", temp: "", tempUnit: "°C" },
    {
      name: "Tablet Details",
      claim: "",
      claimUnit: "mg",
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
});

const createNewCalculationRS = (index: number): CalculationRS => ({
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

const FormPreview: React.FC<FormPreviewProps> = ({
  worksheetId,
  instruments = [],
  chemicals = [],
  standards = [],
  columns = [],
  isReferenceDataLoading = false,
  referenceDataError = null,
}) => {
  // Core state
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [registrationNo, setRegistrationNo] = useState("");
  const [reportData, setReportData] = useState<SampleData[] | null>(null);
  const [addedParameters, setAddedParameters] = useState<AddedParameter[]>([]);
  const [showParameterDropdown, setShowParameterDropdown] = useState(false);
  const [selectedParamsForDetail, setSelectedParamsForDetail] = useState<
    number[]
  >([]);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showDataDialog, setShowDataDialog] = useState(false);
  const [collectedData, setCollectedData] = useState<any>(null);
  const [showPrintPreview, setShowPrintPreview] = useState(false);

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
  // Worksheet-level caches (in case API provides top-level id arrays)
  const [worksheetInstrumentIds, setWorksheetInstrumentIds] = useState<
    string[]
  >([]);
  const [worksheetChemicalIds, setWorksheetChemicalIds] = useState<string[]>(
    []
  );
  const [worksheetStandardIds, setWorksheetStandardIds] = useState<string[]>(
    []
  );
  const [worksheetInstruments, setWorksheetInstruments] = useState<
    Instrument[]
  >([]);
  const [worksheetChemicals, setWorksheetChemicals] = useState<Chemical[]>([]);
  const [worksheetStandards, setWorksheetStandards] = useState<Standard[]>([]);
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
  const [testSolutionPerParam, setTestSolutionPerParam] = useState<
    Record<number, string>
  >({});
  const [diluentPerParam, setDiluentPerParam] = useState<
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
      setShowPreparationDropdown({});
    }
  }, []);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [handleClickOutside]);

  const dateOfReceipt = new Date().toLocaleDateString("en-GB");
  const preparedBy = "Executive";
  const issuedApprovedBy = "QA Manager";
  const effectiveIssueDate = "01/05/2025";
  const approvedBy = "Sr. Executive";
  const classified = '"Internal Use Only"';
  const revisionDate = "30/07/2027";

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
        // Fetch worksheet details
        const worksheetData = await fetchWorksheetById(worksheetId);

        if (!worksheetData) {
          setError("Worksheet not found");
          setIsLoading(false);
          return;
        }

        // Set registration number
        setRegistrationNo(worksheetData.worksheet.registrationNo);

        // Fetch sample data using registration number
        const sampleData = await fetchSample(
          worksheetData.worksheet.registrationNo
        );

        if (sampleData && Array.isArray(sampleData) && sampleData.length > 0) {
          setReportData(sampleData);

          // Restore worksheet state
          restoreWorksheetToState(worksheetData, sampleData);
        } else {
          setError("No sample data found for this registration number");
        }
      } catch (err: any) {
        console.error("Error loading worksheet:", err);
        setError(err.message || "Failed to load worksheet");
      } finally {
        setIsLoading(false);
      }
    };

    loadWorksheetData();
  }, [worksheetId]);

  const restoreWorksheetToState = (
    worksheetData: WorksheetDetail,
    sampleData: SampleData[]
  ) => {
    const { parameters } = worksheetData;

    console.log("🔍 Starting worksheet restoration...");
    console.log("Parameters received:", parameters);

    // Map parameters with sample data
    const restoredParams = parameters.map((param, index) => {
      const matchingSample = sampleData.find(
        (s) => s.paraCode === param.paraCode
      );

      return {
        id: Date.now() + index,
        paraCode: param.paraCode,
        parameter: param.parameterName,
        methodCode: param.methodCode,
        methodName: param.methodName,
        // Add all other sample data fields
        ...(matchingSample || {}),
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

      console.log(`\n📦 Processing parameter ${idx + 1}:`, param.parameterName);
      console.log("Parameter data:", param);

      // ========== BASIC FIELDS ==========
      if (param.columnId) {
        setColumnsPerParam((prev) => ({ ...prev, [paramId]: param.columnId }));
      }

      if (param.diluentPreparation) {
        setDiluentPerParam((prev) => ({
          ...prev,
          [paramId]: param.diluentPreparation,
        }));
      }

      if (param.testSolutionPreparation) {
        setTestSolutionPerParam((prev) => ({
          ...prev,
          [paramId]: param.testSolutionPreparation,
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
            console.log("✅ Restored instruments:", paramInstruments);
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
            console.log("✅ Restored chemicals:", paramChemicals);
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
            console.log("✅ Restored standards:", paramStandards);
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
        console.log(
          "📋 Standard Preparations (raw):",
          param.standardPreparations
        );

        // Arrays to collect preparations by type
        const assayStdPreps: any[] = [];
        const rsStdPreps: any[] = [];
        const dissoStdPreps: any[] = [];

        param.standardPreparations.forEach((prep: any, i: number) => {
          const parsedSteps = safeJSONParse(prep.steps, []);
          const prepType = prep.preparationType || "assay";

          console.log(
            `  Standard Prep ${i + 1} type: ${prepType}, steps:`,
            parsedSteps
          );

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

        // Set state for each type
        if (assayStdPreps.length > 0) {
          console.log(
            "✅ Restored Assay Standard Preparations:",
            assayStdPreps
          );
          setStandardPreparationPerParam((prev) => ({
            ...prev,
            [paramId]: assayStdPreps,
          }));
        }

        if (rsStdPreps.length > 0) {
          console.log("✅ Restored RS Standard Preparations:", rsStdPreps);
          setStandardPreparationRSPerParam((prev) => ({
            ...prev,
            [paramId]: rsStdPreps,
          }));
        }

        if (dissoStdPreps.length > 0) {
          console.log(
            "✅ Restored Dissolution Standard Preparations:",
            dissoStdPreps
          );
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
        console.log("📋 Sample Preparations (raw):", param.samplePreparations);

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

          console.log(
            `  Sample Prep ${i + 1} type: ${prepType}, steps:`,
            parsedSteps
          );

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
          console.log("✅ Restored Assay Sample Preparations:", assaySplPreps);
          setSamplePreparationPerParam((prev) => ({
            ...prev,
            [paramId]: assaySplPreps,
          }));
        }

        if (lodSplPreps.length > 0) {
          console.log("✅ Restored LOD Sample Preparations:", lodSplPreps);
          setSamplePreparationLodPerParam((prev) => ({
            ...prev,
            [paramId]: lodSplPreps,
          }));
        }

        if (roiSplPreps.length > 0) {
          console.log("✅ Restored ROI Sample Preparations:", roiSplPreps);
          setSamplePreparationROIPerParam((prev) => ({
            ...prev,
            [paramId]: roiSplPreps,
          }));
        }

        if (ashSplPreps.length > 0) {
          console.log(
            "✅ Restored Sulphated Ash Sample Preparations:",
            ashSplPreps
          );
          setSamplePreparationSulphatedAshPerParam((prev) => ({
            ...prev,
            [paramId]: ashSplPreps,
          }));
        }

        if (rsSplPreps.length > 0) {
          console.log("✅ Restored RS Sample Preparations:", rsSplPreps);
          setSamplePreparationRSPerParam((prev) => ({
            ...prev,
            [paramId]: rsSplPreps,
          }));
        }

        if (dissoSplPreps.length > 0) {
          console.log(
            "✅ Restored Dissolution Sample Preparations:",
            dissoSplPreps
          );
          setSamplePreparationDissoPerParam((prev) => ({
            ...prev,
            [paramId]: dissoSplPreps,
          }));
        }
      }

      // ========== BUILD PREP LABEL MAPPING FOR CALCULATIONS ==========
      // Build label->newId mapping for restored preparations so we can resolve labels saved in calc data
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

      console.log("🔗 Prep Label Mapping:", prepLabelMapping);

      // ========== CALCULATIONS (UNIFIED WITH TYPES) ==========
      if (param.calculations && Array.isArray(param.calculations)) {
        console.log("📊 Calculations (raw):", param.calculations);

        param.calculations.forEach((calc: any, i: number) => {
          try {
            const parsedData =
              typeof calc.data === "string" ? JSON.parse(calc.data) : calc.data;
            const calcType = calc.calculationType || "assay";

            console.log(`  Calculation ${i + 1} type: ${calcType}`);

            // Get preparation labels for linking
            const stdLabel = parsedData.selectedStandardPreparationLabel;
            const splLabel = parsedData.selectedSamplePreparationLabel;

            // Map labels to IDs from restored preparations
            const stdId = stdLabel ? prepLabelMapping[stdLabel] ?? null : null;
            const splId = splLabel ? prepLabelMapping[splLabel] ?? null : null;

            // Route based on calculationType
            switch (calcType) {
              case "assay":
                const assayCalc = {
                  id: Date.now() + i + 3000 + Math.random() * 1000,
                  label: parsedData.label || calc.label,
                  selectedStandardPrepId: stdId,
                  selectedSamplePrepId: splId,
                  calculationType: parsedData.calculationType || "",
                  areaOfSample: parsedData.areaOfSample || "",
                  areaOfStandard: parsedData.areaOfStandard || "",
                  v1: parsedData.v1 || "",
                  v2: parsedData.v2 || "",
                  v3: parsedData.v3 || "",
                  v4: parsedData.v4 || "",
                  v5: parsedData.v5 || "",
                  v6: parsedData.v6 || "",
                  v7: parsedData.v7 || "",
                  v8: parsedData.v8 || "",
                  v9: parsedData.v9 || "",
                  v10: parsedData.v10 || "",
                  v11: parsedData.v11 || "",
                  v12: parsedData.v12 || "",
                  v13: parsedData.v13 || "",
                  v14: parsedData.v14 || "",
                  sw1: parsedData.sw1 || "",
                  sw2: parsedData.sw2 || "",
                  baseXPurity: parsedData.baseXPurity || "",
                  avgWt: parsedData.avgWt || "",
                  mwSalt: parsedData.mwSalt || "",
                  mwBase: parsedData.mwBase || "",
                  claimVolume:
                    parsedData.claimVolume || parsedData.doseVolume || "",
                  labelClaim: parsedData.labelClaim || "",
                };
                setCalculationsAssayPerParam((prev) => ({
                  ...prev,
                  [paramId]: [...(prev[paramId] || []), assayCalc],
                }));
                console.log("✅ Restored Assay Calculation:", assayCalc);
                break;

              case "lod":
                const lodCalc = {
                  id: Date.now() + i + 4000 + Math.random() * 1000,
                  label: parsedData.label || calc.label,
                  selectedSamplePrepId: splId,
                  w1_emptyDish: parsedData.w1_emptyDish || "",
                  w2_dishWithSample: parsedData.w2_dishWithSample || "",
                  w3_dishAfterIgnition: parsedData.w3_dishAfterIgnition || "",
                };
                setCalculationsLodPerParam((prev) => ({
                  ...prev,
                  [paramId]: [...(prev[paramId] || []), lodCalc],
                }));
                console.log("✅ Restored LOD Calculation:", lodCalc);
                break;

              case "roi":
                const roiCalc = {
                  id: Date.now() + i + 5000 + Math.random() * 1000,
                  label: parsedData.label || calc.label,
                  selectedSamplePrepId: splId,
                  w1_emptyDish: parsedData.w1_emptyDish || "",
                  w2_dishWithSample: parsedData.w2_dishWithSample || "",
                  w3_dishAfterIgnition: parsedData.w3_dishAfterIgnition || "",
                };
                setCalculationsROIPerParam((prev) => ({
                  ...prev,
                  [paramId]: [...(prev[paramId] || []), roiCalc],
                }));
                console.log("✅ Restored ROI Calculation:", roiCalc);
                break;

              case "sulphated_ash":
                const ashCalc = {
                  id: Date.now() + i + 6000 + Math.random() * 1000,
                  label: parsedData.label || calc.label,
                  selectedSamplePrepId: splId,
                  w1_emptyCrucible: parsedData.w1_emptyCrucible || "",
                  w2_crucibleWithSample: parsedData.w2_crucibleWithSample || "",
                  w3_crucibleAfterAsh: parsedData.w3_crucibleAfterAsh || "",
                };
                setCalculationsSulphatedAshPerParam((prev) => ({
                  ...prev,
                  [paramId]: [...(prev[paramId] || []), ashCalc],
                }));
                console.log("✅ Restored Sulphated Ash Calculation:", ashCalc);
                break;

              case "residual_solvent":
                const rsCalc = {
                  id: Date.now() + i + 7000 + Math.random() * 1000,
                  label: parsedData.label || calc.label,
                  selectedStandardPrepId: stdId,
                  selectedSamplePrepId: splId,
                  areaOfSample: parsedData.areaOfSample || "",
                  areaOfStandard: parsedData.areaOfStandard || "",
                  sw1: parsedData.sw1 || "",
                  sw2: parsedData.sw2 || "",
                  v1: parsedData.v1 || "",
                  v2: parsedData.v2 || "",
                  v3: parsedData.v3 || "",
                  v4: parsedData.v4 || "",
                  v5: parsedData.v5 || "",
                  v6: parsedData.v6 || "",
                  purity: parsedData.purity || "",
                };
                setCalculationsRSPerParam((prev) => ({
                  ...prev,
                  [paramId]: [...(prev[paramId] || []), rsCalc],
                }));
                console.log("✅ Restored RS Calculation:", rsCalc);
                break;

              case "dissolution":
                const dissoCalc = {
                  id: Date.now() + i + 8000 + Math.random() * 1000,
                  label: parsedData.label || calc.label,
                  selectedStandardPrepId: stdId,
                  selectedSamplePrepDissoId: splId,
                  areaOfSample: parsedData.areaOfSample || "",
                  areaOfStandard: parsedData.areaOfStandard || "",
                  mwBase: parsedData.mwBase || "",
                  mwSalt: parsedData.mwSalt || "",
                  claim: parsedData.claim || "",
                  purity: parsedData.purity || "",
                };
                setCalculationsDissoPerParam((prev) => ({
                  ...prev,
                  [paramId]: [...(prev[paramId] || []), dissoCalc],
                }));
                console.log("✅ Restored Dissolution Calculation:", dissoCalc);
                break;
            }
          } catch (e) {
            console.error(`Error parsing calculation ${i + 1}:`, e);
          }
        });
      }

      // ========== SET ACTIVE PREPARATION GROUPS ==========
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
        console.log("✅ Active preparation groups:", activeGroups);
        setActivePreparationGroups((prev) => ({
          ...prev,
          [paramId]: activeGroups,
        }));
      }
    });

    // Auto-expand all parameters for viewing
    setSelectedParamsForDetail(restoredParams.map((p) => p.id));

    console.log("✅ Worksheet restoration complete!");
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
    if (
      !instruments ||
      !worksheetInstrumentIds ||
      !worksheetInstrumentIds.length
    )
      return;
    const ids = worksheetInstrumentIds.map((s) => String(s).trim());
    setWorksheetInstruments(
      instruments.filter((inst) => ids.includes(String(inst.id).trim()))
    );
  }, [instruments, worksheetInstrumentIds]);

  useEffect(() => {
    if (!chemicals || !worksheetChemicalIds || !worksheetChemicalIds.length)
      return;
    const ids = worksheetChemicalIds.map((s) => String(s).trim());
    setWorksheetChemicals(
      chemicals.filter((chem) => ids.includes(String(chem.id).trim()))
    );
  }, [chemicals, worksheetChemicalIds]);

  useEffect(() => {
    if (!standards || !worksheetStandardIds || !worksheetStandardIds.length)
      return;
    const ids = worksheetStandardIds.map((s) => String(s).trim());
    setWorksheetStandards(
      standards.filter((std) => ids.includes(String(std.id).trim()))
    );
  }, [standards, worksheetStandardIds]);

  const collectFormDataForAPI = (): WorksheetRequest => {
    const sample = reportData && reportData.length > 0 ? reportData[0] : null;

    // Helper to get prep labels by prep id for this parameter
    const getPrepLabel = (
      paramId: number,
      prepId: number | null | undefined
    ) => {
      if (prepId == null) return "";

      // Search in all standard preparation types
      const allStandardPreps = [
        ...(standardPreparationPerParam[paramId] || []),
        ...(standardPreparationRSPerParam[paramId] || []),
        ...(standardPreparationDissoPerParam[paramId] || []),
      ];

      // Search in all sample preparation types
      const allSamplePreps = [
        ...(samplePreparationPerParam[paramId] || []),
        ...(samplePreparationLodPerParam[paramId] || []),
        ...(samplePreparationROIPerParam[paramId] || []),
        ...(samplePreparationSulphatedAshPerParam[paramId] || []),
        ...(samplePreparationRSPerParam[paramId] || []),
        ...(samplePreparationDissoPerParam[paramId] || []),
      ];

      const foundStd = allStandardPreps.find((p: any) => p.id === prepId);
      if (foundStd) return foundStd.label || "";

      const foundSpl = allSamplePreps.find((p: any) => p.id === prepId);
      if (foundSpl) return foundSpl.label || "";

      return "";
    };

    return {
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
        analyzedBy: issuedApprovedBy,
        approvedBy,
        classified,
        revisionDate,
      },
      parameters: addedParameters.map((param) => {
        // Collect all standard preparations with their types
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
            const stdLabel = getPrepLabel(
              param.id,
              (calc as any).selectedStandardPrepId
            );
            const splLabel = getPrepLabel(
              param.id,
              (calc as any).selectedSamplePrepId
            );
            const dataObj = { ...calc } as any;
            delete dataObj.selectedStandardPrepId;
            delete dataObj.selectedSamplePrepId;
            dataObj.selectedStandardPreparationLabel = stdLabel || "";
            dataObj.selectedSamplePreparationLabel = splLabel || "";
            return {
              label: calc.label,
              calculationType: "assay",
              data: JSON.stringify(dataObj),
            };
          }),
          ...(calculationsLodPerParam[param.id] || []).map((calc) => {
            const splLabel = getPrepLabel(
              param.id,
              (calc as any).selectedSamplePrepId
            );
            const dataObj = { ...calc } as any;
            delete dataObj.selectedSamplePrepId;
            dataObj.selectedSamplePreparationLabel = splLabel || "";
            return {
              label: calc.label,
              calculationType: "lod",
              data: JSON.stringify(dataObj),
            };
          }),
          ...(calculationsROIPerParam[param.id] || []).map((calc) => {
            const splLabel = getPrepLabel(
              param.id,
              (calc as any).selectedSamplePrepId
            );
            const dataObj = { ...calc } as any;
            delete dataObj.selectedSamplePrepId;
            dataObj.selectedSamplePreparationLabel = splLabel || "";
            return {
              label: calc.label,
              calculationType: "roi",
              data: JSON.stringify(dataObj),
            };
          }),
          ...(calculationsSulphatedAshPerParam[param.id] || []).map((calc) => {
            const splLabel = getPrepLabel(
              param.id,
              (calc as any).selectedSamplePrepId
            );
            const dataObj = { ...calc } as any;
            delete dataObj.selectedSamplePrepId;
            dataObj.selectedSamplePreparationLabel = splLabel || "";
            return {
              label: calc.label,
              calculationType: "sulphated_ash",
              data: JSON.stringify(dataObj),
            };
          }),
          ...(calculationsRSPerParam[param.id] || []).map((calc) => {
            const stdLabel = getPrepLabel(
              param.id,
              (calc as any).selectedStandardPrepId
            );
            const splLabel = getPrepLabel(
              param.id,
              (calc as any).selectedSamplePrepId
            );
            const dataObj = { ...calc } as any;
            delete dataObj.selectedStandardPrepId;
            delete dataObj.selectedSamplePrepId;
            dataObj.selectedStandardPreparationLabel = stdLabel || "";
            dataObj.selectedSamplePreparationLabel = splLabel || "";
            return {
              label: calc.label,
              calculationType: "residual_solvent",
              data: JSON.stringify(dataObj),
            };
          }),
          ...(calculationsDissoPerParam[param.id] || []).map((calc) => {
            const stdLabel = getPrepLabel(
              param.id,
              (calc as any).selectedStandardPrepId
            );
            const splLabel = getPrepLabel(
              param.id,
              (calc as any).selectedSamplePrepId
            );
            const dataObj = { ...calc } as any;
            delete dataObj.selectedStandardPrepId;
            delete dataObj.selectedSamplePrepId;
            dataObj.selectedStandardPreparationLabel = stdLabel || "";
            dataObj.selectedSamplePreparationLabel = splLabel || "";
            return {
              label: calc.label,
              calculationType: "dissolution",
              data: JSON.stringify(dataObj),
            };
          }),
        ];

        return {
          paraCode: param.paraCode,
          parameterName: param.parameter,
          methodCode: param.methodCode,
          methodName: param.methodName,
          columnId: columnsPerParam[param.id] || "",
          diluentPreparation: diluentPerParam[param.id] || "",
          testSolutionPreparation: testSolutionPerParam[param.id] || "",

          instruments: (addedInstruments[param.id] || []).map(
            (inst) => inst.id
          ),
          chemicals: (addedChemicals[param.id] || []).map((chem) => chem.id),
          standards: (addedStandards[param.id] || []).map((std) => std.id),

          // Unified arrays with type discriminators
          standardPreparations,
          samplePreparations,
          calculations,
        };
      }),
    };
  };

  const handleSaveDraft = async () => {
    setIsSaving(true);
    const worksheetData = collectFormDataForAPI();

    try {
      const response = await updateWorksheet(worksheetId, worksheetData);

      if (response && response.worksheetId) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
        console.log("Draft saved successfully:", response.worksheetId);
      } else {
        alert("Failed to save draft");
      }
    } catch (err: any) {
      console.error("Error saving draft:", err);
      alert(`Failed to save draft: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const collectFormDataForReport = () => {
    const sample = reportData && reportData.length > 0 ? reportData[0] : null;

    return {
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
        calculationsLod: (calculationsLodPerParam[param.id] || []).map(
          (calc) => ({
            label: calc.label,
            selectedSamplePrepId: calc.selectedSamplePrepId,
            w1_emptyDish: calc.w1_emptyDish,
            w2_dishWithSample: calc.w2_dishWithSample,
            w3_dishAfterIgnition: calc.w3_dishAfterIgnition,
          })
        ),
        calculationsROI: (calculationsROIPerParam[param.id] || []).map(
          (calc) => ({
            label: calc.label,
            selectedSamplePrepId: calc.selectedSamplePrepId,
            w1_emptyDish: calc.w1_emptyDish,
            w2_dishWithSample: calc.w2_dishWithSample,
            w3_dishAfterIgnition: calc.w3_dishAfterIgnition,
          })
        ),
        calculationsSulphatedAsh: (
          calculationsSulphatedAshPerParam[param.id] || []
        ).map((calc) => ({
          label: calc.label,
          selectedSamplePrepId: calc.selectedSamplePrepId,
          w1_emptyCrucible: calc.w1_emptyCrucible,
          w2_crucibleWithSample: calc.w2_crucibleWithSample,
          w3_crucibleAfterAsh: calc.w3_crucibleAfterAsh,
        })),
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
        calculationsDisso: (calculationsDissoPerParam[param.id] || []).map(
          (calc) => ({
            label: calc.label,
            selectedStandardPrepId: calc.selectedStandardPrepId,
            selectedSamplePrepDissoId: calc.selectedSamplePrepDissoId,
            areaOfSample: calc.areaOfSample,
            areaOfStandard: calc.areaOfStandard,
            mwBase: calc.mwBase,
            mwSalt: calc.mwSalt,
            claim: calc.claim,
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
  };

  // Parameter Handlers
  const handleAddParameter = (param: SampleData) => {
    const newId = Date.now();
    if (!addedParameters.find((p) => p.paraCode === param.paraCode)) {
      setAddedParameters([...addedParameters, { ...param, id: newId }]);
    }
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

    cleanupState(setAddedInstruments);
    cleanupState(setAddedChemicals);
    cleanupState(setAddedStandards);
    cleanupState(setColumnsPerParam);
    cleanupState(setDiluentPerParam);
    cleanupState(setTestSolutionPerParam);
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
  };

  const toggleParameterDetail = (id: number) => {
    setSelectedParamsForDetail((prev) =>
      prev.includes(id)
        ? prev.filter((paramId) => paramId !== id)
        : [...prev, id]
    );
  };

  const availableToAdd = (reportData ?? []).filter(
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
          label: `Sample Preparation ${1 + index} for LOD`,
        }));
      return { ...prev, [parameterId]: updatedSamples };
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
          label: `Sample Preparation ${1 + index} for Sulphated Ash`,
        }));
      return { ...prev, [parameterId]: updatedSamples };
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
          label: `Sample Preparation ${1 + index} for Loss on Ignation`,
        }));
      return { ...prev, [parameterId]: updatedSamples };
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
      | "claimUnit"
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
          label: `LOD Calculation ${index + 1}`,
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
          label: `ROI Calculation ${index + 1}`,
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
          label: `Sulphated Ash Calculation ${index + 1}`,
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
          label: `RS Calculation ${index + 1}`,
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

  // Dissolution Handlers
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
      | "vol1"
      | "vol2"
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
          label: `Dissolution Calculation ${index + 1}`,
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

  const handleTestSolutionChange = (parameterId: number, value: string) => {
    setTestSolutionPerParam((prev) => ({ ...prev, [parameterId]: value }));
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

          {/* Main Card */}
          <div className="relative bg-white rounded-2xl shadow-2xl border border-slate-200 p-12 min-w-[400px]">
            {/* Spinner */}
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
                {/* Outer Ring */}
                <div className="absolute inset-0 rounded-full border-4 border-emerald-100"></div>
                {/* Animated Ring */}
                <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-emerald-500 border-r-emerald-500"></div>
                {/* Inner Glow */}
                <div className="absolute inset-2 rounded-full bg-gradient-to-br from-emerald-50 to-teal-50"></div>
                {/* Center Icon */}
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

            {/* Loading Text */}
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

              {/* Loading Dots */}
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

  if (!reportData || reportData.length === 0) {
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
            No Sample Data Found
          </span>
          <span className="text-base text-gray-500 mt-3 max-w-md text-center">
            Unable to load sample data for this worksheet
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
          <img src="/ic_efrac.png" alt="EFRAC Logo" className="h-10" />
        </div>
      </div>

      {/* Company Title */}
      <div className="my-4 border-2 border-emerald-400 rounded-xl overflow-hidden shadow-lg">
        <div className="flex justify-between items-center px-6 py-4 bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-700">
          <h1 className="flex items-baseline gap-3 tracking-wide text-white">
            <span className="text-sm font-semibold">Worksheet ID:</span>
            <span className="text-2xl font-extrabold">{worksheetId}</span>
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
              {reportData && reportData.length > 0
                ? reportData[0].registrationNo
                : registrationNo || "---"}
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
              {reportData[0].sampleName || "---"}
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
              {reportData[0]?.tatDate || "---"}
            </span>
          </div>
          <div className="flex items-center px-4 py-3 border-r-2 border-emerald-300">
            <span className="font-bold mr-2 text-emerald-900">
              Analysis Started On:
            </span>
            <span className="font-semibold text-slate-700">
              {reportData[0]?.analysisStartDate || "---"}
            </span>
          </div>
          <div className="flex items-center px-4 py-3">
            <span className="font-bold mr-2 text-emerald-900">
              Analysis Completed On:
            </span>
            <span className="font-semibold text-slate-700">
              {reportData[0]?.analysisCompletionDate || "---"}
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
                  {reportData[0]?.sampleName || "---"}
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
                {(activePreparationGroups[selectedParam.id] || []).includes(
                  "sulphatedAsh"
                ) && (
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
                        <motion.button
                          onClick={() =>
                            handleAddCalculationSulphatedAsh(selectedParam.id)
                          }
                          whileHover={{ scale: 1 }}
                          whileTap={{ scale: 1 }}
                          className="flex items-center gap-1.5 p-2.5 bg-gradient-to-r from-pink-600 to-rose-600 text-white font-semibold rounded-xl hover:from-pink-700 hover:to-rose-700 transition-all duration-200 shadow-lg hover:shadow-xl text-xs"
                        >
                          <Plus className="w-4 h-4" />
                          Add Ash Calculation
                        </motion.button>
                      </div>

                      <AnimatePresence>
                        {(
                          calculationsSulphatedAshPerParam[selectedParam.id] ||
                          []
                        ).map((calculation) => (
                          <CalculationDetailSulphatedAsh
                            key={calculation.id}
                            calculation={calculation}
                            samplePreparations={
                              samplePreparationSulphatedAshPerParam[
                                selectedParam.id
                              ] || []
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

                      {(
                        calculationsSulphatedAshPerParam[selectedParam.id] || []
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
                  </motion.div>
                )}

                {/* ============= RESIDUAL SOLVENT GROUP CARD ============= */}
                {(activePreparationGroups[selectedParam.id] || []).includes(
                  "residualSolvent"
                ) && (
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
                            standardPreparationRSPerParam[selectedParam.id] ||
                            []
                          ).length +
                            (
                              samplePreparationRSPerParam[selectedParam.id] ||
                              []
                            ).length +
                            (calculationsRSPerParam[selectedParam.id] || [])
                              .length}{" "}
                          Items
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
                          onClick={() =>
                            handleAddStandardPreparationRS(selectedParam.id)
                          }
                          className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-indigo-600 to-blue-700 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-blue-800 transition-all duration-200 shadow-md hover:shadow-lg text-sm transform"
                        >
                          <Plus className="w-4 h-4" />
                          Add Preparation
                        </button>
                      </div>

                      {/* Preparations List */}
                      <AnimatePresence>
                        {(
                          standardPreparationRSPerParam[selectedParam.id] || []
                        ).map((standardPreparation: any, idx: number) => {
                          const assignedStandard = (
                            addedStandards[selectedParam.id] || []
                          ).find(
                            (std) =>
                              std.id === standardPreparation.assignedStandardId
                          );

                          const correspondingSample =
                            (samplePreparationRSPerParam[selectedParam.id] ||
                              [])[idx];

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
                                    />
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </AnimatePresence>

                      {/* Empty State */}
                      {(standardPreparationRSPerParam[selectedParam.id] || [])
                        .length === 0 && (
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
                              Click "Add Preparation" to create standard and
                              sample preparations for Residual Solvent
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
                        <motion.button
                          onClick={() =>
                            handleAddCalculationRS(selectedParam.id)
                          }
                          whileHover={{ scale: 1 }}
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
                                standardPreparationRSPerParam[
                                  selectedParam.id
                                ] || []
                              }
                              samplePreparations={
                                samplePreparationRSPerParam[selectedParam.id] ||
                                []
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

                      {(calculationsRSPerParam[selectedParam.id] || [])
                        .length === 0 && (
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

                {(activePreparationGroups[selectedParam.id] || []).includes(
                  "dissolution"
                ) && (
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
                            (calculationsDissoPerParam[selectedParam.id] || [])
                              .length}
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
                        <button
                          onClick={() =>
                            handleAddStandardPreparationDisso(selectedParam.id)
                          }
                          className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-emerald-600 to-green-700 text-white font-semibold rounded-xl hover:from-emerald-700 hover:to-green-800 transition-all duration-200 shadow-md hover:shadow-lg text-sm transform"
                        >
                          <Plus className="w-4 h-4" />
                          Add Preparation
                        </button>
                      </div>

                      <AnimatePresence>
                        {(
                          standardPreparationDissoPerParam[selectedParam.id] ||
                          []
                        ).map((standardPreparation: any, idx: number) => {
                          const assignedStandard = (
                            addedStandards[selectedParam.id] || []
                          ).find(
                            (std) =>
                              std.id === standardPreparation.assignedStandardId
                          );

                          const correspondingSample =
                            (samplePreparationDissoPerParam[selectedParam.id] ||
                              [])[idx];

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
                                    />
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </AnimatePresence>

                      {(
                        standardPreparationDissoPerParam[selectedParam.id] || []
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
                              standard and sample preparation for dissolution
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
                        <motion.button
                          onClick={() =>
                            handleAddCalculationDisso(selectedParam.id)
                          }
                          whileHover={{ scale: 1 }}
                          whileTap={{ scale: 1 }}
                          className="flex items-center gap-1.5 p-2.5 bg-gradient-to-r from-emerald-600 to-green-600 text-white font-semibold rounded-xl hover:from-emerald-700 hover:to-green-700 transition-all duration-200 shadow-lg hover:shadow-xl text-xs"
                        >
                          <Plus className="w-4 h-4" />
                          Add Dissolution Calculation
                        </motion.button>
                      </div>

                      <AnimatePresence>
                        {(
                          calculationsDissoPerParam[selectedParam.id] || []
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
                            onFieldChange={(calculationId, field, value) =>
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
                          />
                        ))}
                      </AnimatePresence>

                      {(calculationsDissoPerParam[selectedParam.id] || [])
                        .length === 0 && (
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
                              Click "Add Dissolution Calculation" to begin
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
                {/* Attractive Spinner */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
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

            {/* Success Checkmark */}
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

          {/* Submit Button - DISABLED */}
          <button
            disabled
            className="px-6 py-3 bg-gradient-to-r from-slate-300 to-slate-400 text-slate-500 font-semibold rounded-xl shadow-md cursor-not-allowed text-sm opacity-60"
            title="Submit functionality coming soon"
          >
            <span className="flex items-center gap-2">
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
              Submit for Review
            </span>
          </button>

          {/* Print Button - DISABLED */}
          <button
            disabled
            className="px-6 py-3 bg-gradient-to-r from-slate-300 to-slate-400 text-slate-500 font-semibold rounded-xl shadow-md cursor-not-allowed text-sm opacity-60"
            title="Print functionality coming soon"
          >
            <span className="flex items-center gap-2">
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
              Print Preview
            </span>
          </button>
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
    </div>
  );
};

export default FormPreview;
