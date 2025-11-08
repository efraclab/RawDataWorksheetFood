import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { type SampleData } from "../models/SampleData";
import type { Instrument } from "../models/Instrument";
import type { Standard } from "../models/Standard";
import type { Chemical } from "../models/Chemical";

// --- START: Mock Interface for Columns (since it's not in models folder) ---
interface Column {
  id: string; // e.g., 'C-001', 'C-002'
  name: string; // e.g., 'C18', 'Silica'
  length: string;
  diameter: string;
}
// --- END: Mock Interface ---

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

const Trash: React.FC<{ className: string }> = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
  </svg>
);

const ChevronDown: React.FC<{ className: string }> = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <polyline points="6 9 12 15 18 9" />
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

// --- START: Reference Data Status Components ---
const ReferenceLoading: React.FC = () => (
  <div className="flex items-center justify-center p-4 bg-blue-50 border border-blue-200 rounded text-sm text-blue-700 font-medium">
    <LoaderCircle className="w-5 h-5 mr-3" />
    Loading reference data (Instruments, Chemicals, Standards, Columns)...
  </div>
);

const ReferenceError: React.FC<{ error: string }> = ({ error }) => (
  <div className="p-4 bg-red-50 border border-red-200 rounded text-sm text-red-700 font-medium">
    <div className="flex items-center mb-1">
      <Target className="w-5 h-5 mr-2" />
      Error loading reference data:
    </div>
    <p className="text-xs ml-7 break-words">{error}</p>
  </div>
);

// --- END: Reference Data Status Components ---

interface FormPreviewProps {
  reportData: SampleData[] | null;
  loading: boolean;
  error: string | null;
  registrationNo: string;
  // --- START: Reference Data Props ---
  instruments: Instrument[];
  standards: Standard[];
  chemicals: Chemical[];
  columns: Column[];
  isReferenceDataLoading: boolean;
  referenceDataError: string | null;
  // --- END: Reference Data Props ---
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

const FormPreview: React.FC<FormPreviewProps> = ({
  reportData,
  loading,
  error,
  registrationNo,
  // --- Updated destructuring with new props ---
  instruments = [],
  chemicals = [],
  standards = [],
  columns = [],
  isReferenceDataLoading = false,
  referenceDataError = null,
  // ---------------------------------------------
  testInfo = {},
  documentInfo = {},
}) => {
  const [addedParameters, setAddedParameters] = useState<AddedParameter[]>([]);
  const [showParameterDropdown, setShowParameterDropdown] = useState(false);
  const [selectedParamsForDetail, setSelectedParamsForDetail] = useState<
    number[]
  >([]);

  // State for Mobile Phase Input and Selected Column ID (New/Updated State)
  // NOTE: In the user's latest request, these were moved to per-parameter state (mobilePhases, columnsPerParam)
  // I will update the state to reflect this parameter-specific requirement.
  const [mobilePhases, setMobilePhases] = useState<Record<number, string>>({});
  const [columnsPerParam, setColumnsPerParam] = useState<
    Record<number, string>
  >({});

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

  // Control states for dynamic dropdowns
  const [showInstrumentDropdown, setShowInstrumentDropdown] = useState(false);
  const [showChemicalDropdown, setShowChemicalDropdown] = useState(false);
  const [showStandardDropdown, setShowStandardDropdown] = useState(false);
  const [showColumnDropdown, setShowColumnDropdown] = useState(false); // New state for Column dropdown

  // Search states for dynamic dropdowns
  const [instrumentSearch, setInstrumentSearch] = useState("");
  const [chemicalSearch, setChemicalSearch] = useState("");
  const [standardSearch, setStandardSearch] = useState("");
  const [columnSearch, setColumnSearch] = useState(""); // New state for Column search

  const sample = reportData && reportData.length > 0 ? reportData[0] : null;

  // --- START: Click Outside Logic Implementation ---
  const instrumentRef = useRef<HTMLDivElement>(null);
  const chemicalRef = useRef<HTMLDivElement>(null);
  const standardRef = useRef<HTMLDivElement>(null);
  const columnRef = useRef<HTMLDivElement>(null); // Ref for Column Dropdown

  const handleClickOutside = useCallback((event: MouseEvent) => {
    // Check Instrument Dropdown
    if (
      instrumentRef.current &&
      !instrumentRef.current.contains(event.target as Node)
    ) {
      setShowInstrumentDropdown(false);
    }
    // Check Chemical Dropdown
    if (
      chemicalRef.current &&
      !chemicalRef.current.contains(event.target as Node)
    ) {
      setShowChemicalDropdown(false);
    }
    // Check Standard Dropdown
    if (
      standardRef.current &&
      !standardRef.current.contains(event.target as Node)
    ) {
      setShowStandardDropdown(false);
    }
    // Check Column dropdown
    if (
      columnRef.current &&
      !columnRef.current.contains(event.target as Node)
    ) {
      setShowColumnDropdown(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleClickOutside]);
  // --- END: Click Outside Logic Implementation ---

  // Document Info Destructuring (Unchanged)
  const {
    preparationMobilePhase = "Degassed Water.",
    preparationTestSolution = "",
  } = testInfo;

  const {
    dateOfReceipt = new Date().toLocaleDateString("en-GB"),
    preparedBy = "Executive",
    issuedApprovedBy = "QA Manager",
    effectiveIssueDate = "01/05/2025",
    approvedBy = "Sr. Executive",
    classified = '"Internal Use Only"',
    revisionDate = "30/07/2027",
  } = documentInfo;

  // Parameter Handlers (Unchanged logic)
  const handleAddParameter = (param: SampleData) => {
    const newId = Date.now();
    if (!addedParameters.find((p) => p.paraCode === param.paraCode)) {
      setAddedParameters([...addedParameters, { ...param, id: newId }]);

      // Initialize default values for the new parameter
      setMobilePhases((prev) => ({
        ...prev,
        [newId]: testInfo.mobilePhaseId || "",
      }));
      setColumnsPerParam((prev) => ({
        ...prev,
        [newId]: testInfo.columnId || "",
      }));
    }
    setShowParameterDropdown(false);
  };

  const handleRemoveParameter = (id: number) => {
    setAddedParameters(addedParameters.filter((p) => p.id !== id));
    setSelectedParamsForDetail(
      selectedParamsForDetail.filter((paramId) => paramId !== id)
    );
    // CLEANUP: Remove associated reference data and inputs for the removed parameter
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
    setMobilePhases((prev) => {
      const { [id]: _, ...rest } = prev;
      return rest;
    });
    setColumnsPerParam((prev) => {
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

  // Reference Data Search Filters (Updated with Column filter)
  const searchFilteredInstruments = instruments.filter(
    (inst) =>
      inst.name.toLowerCase().includes(instrumentSearch.toLowerCase()) ||
      inst.id.toLowerCase().includes(instrumentSearch.toLowerCase())
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

  // Handler for mobile phase input (per parameter)
  const handleMobilePhaseChange = (parameterId: number, value: string) => {
    setMobilePhases((prev) => ({
      ...prev,
      [parameterId]: value,
    }));
  };

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

  // Handler for selecting a column ID (per parameter)
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

  // Animations/Loading states (Unchanged)
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

  if (loading) {
    return (
      <div className="mx-auto my-8 p-6 bg-white max-w-4xl flex items-center justify-center min-h-[600px]">
        <motion.div
          key="loading"
          {...animationProps}
          className="flex flex-col justify-center items-center py-20 bg-gradient-to-br from-green-50 to-white rounded-2xl shadow-2xl border-2 border-green-200 w-full min-h-[400px]"
        >
          <motion.div
            {...loadingIconProps}
            className="p-5 rounded-full bg-gradient-to-br from-green-100 to-green-200 mb-6 shadow-lg"
          >
            <LoaderCircle className="w-14 h-14 text-green-600" />
          </motion.div>
          <span className="text-2xl font-semibold text-green-700 tracking-wide">
            Loading Report Data
          </span>
          <span className="text-base text-gray-600 mt-3 max-w-md text-center font-medium">
            Fetching results for registration{" "}
            <span className="font-bold text-green-600">{registrationNo}</span>
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
  // --- End of Main Report States ---

  return (
    <div className="mx-auto my-8 p-8 bg-white shadow-2xl max-w-4xl border-2 border-gray-400 rounded-lg">
      <div className="flex justify-between items-center text-sm mb-6 pb-4 border-b-2 border-gray-200">
        <div></div>
        <div className="flex flex-col items-end">
          <img src="./ic_efrac.png" alt="EFRAC Logo" className="h-8" />
        </div>
      </div>

      <div className="my-1 border-2 border-black rounded-lg overflow-hidden">
        <div className="flex justify-between items-center px-4 py-3 bg-gradient-to-r from-gray-800 to-gray-900">
          <h1 className="text-base font-semibold text-white tracking-wide">
            EDWARD FOOD RESEARCH & ANALYSIS CENTRE LTD
          </h1>
        </div>
      </div>

      <div className="my-1 border-2 border-black rounded-lg overflow-hidden">
        <div className="grid grid-cols-2 border-b border-black text-sm bg-gray-100">
          <div className="flex items-center px-3 py-2 border-r-2 border-black">
            <span className="font-bold mr-2 text-gray-900">
              Registration No:
            </span>
            <span className="font-semibold text-gray-700">
              {sample?.registrationNo || registrationNo || "---"}
            </span>
          </div>
          <div className="flex items-center px-3 py-2">
            <span className="font-bold mr-2 text-gray-900">
              Date of Receipt:
            </span>
            <span className="font-semibold text-gray-700">{dateOfReceipt}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 border-b border-black text-sm bg-white">
          <div className="flex items-center px-3 py-2 border-r-2 border-black">
            <span className="font-bold mr-2 text-gray-900">Sample Name:</span>
            <span className="font-semibold text-gray-700">
              {sample?.sampleName || "---"}
            </span>
          </div>
          <div className="flex items-center px-3 py-2">
            <span className="font-bold mr-2 text-gray-900">
              Number of Parameters:
            </span>
            <span className="font-semibold text-gray-700">
              {allParameters.length}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-3 border-black text-sm bg-gray-100">
          <div className="flex items-center px-3 py-2 border-r-2 border-black">
            <span className="font-bold mr-2 text-gray-900">Due Date:</span>
            <span className="font-semibold text-gray-700">
              {sample?.tatDate || "---"}
            </span>
          </div>
          <div className="flex items-center px-3 py-2 border-r-2 border-black">
            <span className="font-bold mr-2 text-gray-900">
              Analysis Started On:
            </span>
            <span className="font-semibold text-gray-700">
              {sample?.analysisStartDate || "---"}
            </span>
          </div>
          <div className="flex items-center px-3 py-2">
            <span className="font-bold mr-2 text-gray-900">
              Analysis Completed On:
            </span>
            <span className="font-semibold text-gray-700">
              {sample?.analysisCompletionDate || "---"}
            </span>
          </div>
        </div>
      </div>

      <div className="p-0 my-8">
        <table className="w-full border-collapse text-sm mb-4">
          <tbody>
            <tr className="border-2 border-gray-500 hover:bg-gray-50 transition-colors">
              <td className="w-8 px-3 py-3 border-r-2 border-gray-500 font-bold text-center bg-gray-100 text-gray-900">
                1
              </td>
              <td className="w-1/3 px-3 py-3 border-r-2 border-gray-500 font-semibold bg-gray-50">
                Sample Particulars (All relevant information received with
                sample to be entered):
              </td>
              <td className="px-3 py-3 font-medium">
                {sample?.sampleName || "---"}
              </td>
            </tr>
            <tr className="border-2 border-gray-500 hover:bg-gray-50 transition-colors">
              <td className="w-8 px-3 py-3 border-r-2 border-gray-500 font-bold text-center bg-gray-100 text-gray-900">
                2
              </td>
              <td className="w-1/3 px-3 py-3 border-r-2 border-gray-500 font-semibold bg-gray-50">
                Test(s) required (all tests and condition to be entered):
              </td>
              <td className="px-3 py-3 font-medium">
                {testsRequiredDisplay || "No parameters added"}
              </td>
            </tr>
            <tr className="border-2 border-gray-500 hover:bg-gray-50 transition-colors">
              <td className="w-8 px-3 py-3 border-r-2 border-gray-500 font-bold text-center bg-gray-100 text-gray-900">
                3
              </td>
              <td className="w-1/3 px-3 py-3 border-r-2 border-gray-500 font-semibold bg-gray-50">
                Method(s) of Analysis / testing
              </td>
              <td className="px-3 py-3 h-16 font-medium">
                {methodsRequiredDisplay || "No methods"}
              </td>
            </tr>
            <tr className="border-2 border-gray-500 hover:bg-gray-50 transition-colors">
              <td className="w-8 px-3 py-3 border-r-2 border-gray-500 font-bold text-center bg-gray-100 text-gray-900">
                4
              </td>
              <td className="w-1/3 px-3 py-3 border-r-2 border-gray-500 font-semibold bg-gray-50">
                Raw Data (Observations, Readings, Calculations etc):
              </td>
              <td className="px-3 py-3 h-32 align-top"></td>
            </tr>
          </tbody>
        </table>

        <div className="my-6 p-4 bg-gradient-to-br from-blue-50 to-white border-2 border-blue-300 rounded-lg shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900">
              Parameters Management
            </h3>
            <div className="relative">
              <button
                onClick={() => setShowParameterDropdown(!showParameterDropdown)}
                disabled={availableToAdd.length === 0}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                <Plus className="w-4 h-4" />
                Add Parameter
                <ChevronDown className="w-3 h-3" />
              </button>

              <AnimatePresence>
                {showParameterDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-72 bg-white border border-gray-300 rounded-lg shadow-xl z-50 max-h-80 overflow-y-auto"
                  >
                    {availableToAdd.map((param) => (
                      <button
                        key={param.paraCode}
                        onClick={() => handleAddParameter(param)}
                        className="w-full text-left px-3 py-2 hover:bg-blue-50 border-b border-gray-200 last:border-b-0 transition-colors text-sm"
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
                    className="flex items-center justify-between p-3 bg-white border border-gray-300 rounded-lg hover:border-blue-400 hover:shadow-sm transition-all"
                  >
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900 text-sm">
                        {param.parameter}
                      </div>
                      <div className="text-xs text-gray-600">
                        {param.paraCode} • {param.methodName}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => toggleParameterDetail(param.id)}
                        className={`px-3 py-1 font-medium rounded text-xs transition-colors ${
                          selectedParamsForDetail.includes(param.id)
                            ? "bg-orange-100 text-orange-700 hover:bg-orange-200"
                            : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                        }`}
                      >
                        {selectedParamsForDetail.includes(param.id)
                          ? "Hide Details"
                          : "View Details"}
                      </button>
                      <button
                        onClick={() => handleRemoveParameter(param.id)}
                        className="p-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
                      >
                        <Trash className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {addedParameters.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Target className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p className="text-sm font-medium">No parameters added yet</p>
              <p className="text-xs mt-1">
                Click "Add Parameter" to get started
              </p>
            </div>
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
                <div className="bg-white rounded-lg border border-black overflow-hidden mb-4">
                  <div className="flex items-center justify-between px-4 py-2 bg-gradient-to-r from-green-100 to-green-200 border-b border-black">
                    <h3 className="text-base font-bold text-gray-900">
                      Parameter Details: {selectedParam.parameter}
                    </h3>
                    <button
                      onClick={() => toggleParameterDetail(selectedParam.id)}
                      className="text-gray-700 hover:text-gray-900 font-bold text-lg"
                    >
                      ✕
                    </button>
                  </div>

                  <table className="w-full border-collapse text-sm">
                    <tbody>
                      <tr>
                        <td className="w-1/2 px-3 py-3 border-r-2 border-gray-500 font-semibold text-center bg-gray-900 text-white">
                          Parameter Code
                        </td>
                        <td className="w-1/2 px-3 py-3 font-semibold text-center bg-gray-900 text-white">
                          Parameter Name
                        </td>
                      </tr>
                      <tr className="border-2 border-gray-500 hover:bg-gray-50 transition-colors">
                        <td className="w-1/2 px-3 py-3 border-r-2 border-gray-500 font-semibold text-center bg-gray-50 text-gray-900">
                          {selectedParam.paraCode}
                        </td>
                        <td className="w-1/2 px-3 py-3 font-semibold text-center bg-gray-50">
                          {selectedParam.parameter}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-base font-bold text-gray-900">
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
                        className="flex items-center gap-2 px-3 py-1.5 bg-green-600 text-white font-semibold rounded hover:bg-green-700 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-xs"
                      >
                        <Plus className="w-3 h-3" />
                        Add Instrument
                      </button>

                      <AnimatePresence>
                        {showInstrumentDropdown && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            // FIX APPLIED HERE: Stop event propagation
                            onMouseDown={(e) => e.stopPropagation()}
                            className="absolute right-0 mt-2 w-80 bg-white border border-gray-300 rounded-lg shadow-xl z-50"
                          >
                            <div className="p-2 border-b border-gray-200">
                              <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                  type="text"
                                  placeholder="Search instruments..."
                                  value={instrumentSearch}
                                  onChange={(e) =>
                                    setInstrumentSearch(e.target.value)
                                  }
                                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
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
                                    className="w-full text-left px-3 py-2 hover:bg-green-50 border-b border-gray-200 last:border-b-0 transition-colors text-sm"
                                  >
                                    <div className="font-semibold text-gray-900">
                                      {inst.name}
                                    </div>
                                    <div className="text-xs text-gray-600">
                                      {inst.id}
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
                    <table className="w-full border-collapse text-sm">
                      <thead>
                        <tr className="bg-gray-100 border-2 border-gray-500">
                          <th className="px-3 py-2 border-r-2 border-gray-500 text-left font-bold">
                            Instrument Id.
                          </th>
                          <th className="px-3 py-2 border-r-2 border-gray-500 text-left font-bold">
                            Instrument Name
                          </th>
                          <th className="px-3 py-2 border-r-2 border-gray-500 text-left font-bold">
                            Calibration Done On
                          </th>
                          <th className="px-3 py-2 border-r-2 border-gray-500 text-left font-bold">
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
                                  className="border-2 border-gray-500 hover:bg-gray-50 transition-colors"
                                >
                                  <td className="px-3 py-2 border-r-2 border-gray-500">
                                    {instrument.id || "---"}
                                  </td>
                                  <td className="px-3 py-2 border-r-2 border-gray-500">
                                    {instrument.name || "---"}
                                  </td>
                                  <td className="px-3 py-2 border-r-2 border-gray-500">
                                    {instrument.calibrationDoneDate || "---"}
                                  </td>
                                  <td className="px-3 py-2 border-r-2 border-gray-500">
                                    {instrument.calibrationDueDate || "---"}
                                  </td>
                                  <td className="px-3 py-2 text-center">
                                    <button
                                      onClick={() =>
                                        handleRemoveInstrument(
                                          selectedParam.id,
                                          instrument.id
                                        )
                                      }
                                      className="p-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
                                      title="Remove instrument"
                                    >
                                      <Trash className="w-4 h-4" />
                                    </button>
                                  </td>
                                </motion.tr>
                              )
                            )
                          ) : (
                            <tr className="border-2 border-gray-500">
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
                    <h3 className="text-base font-bold text-gray-900">
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
                        className="flex items-center gap-2 px-3 py-1.5 bg-green-600 text-white font-semibold rounded hover:bg-green-700 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-xs"
                      >
                        <Plus className="w-3 h-3" />
                        Add Chemical
                      </button>

                      <AnimatePresence>
                        {showChemicalDropdown && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            // FIX APPLIED HERE: Stop event propagation
                            onMouseDown={(e) => e.stopPropagation()}
                            className="absolute right-0 mt-2 w-80 bg-white border border-gray-300 rounded-lg shadow-xl z-50"
                          >
                            <div className="p-2 border-b border-gray-200">
                              <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                  type="text"
                                  placeholder="Search chemicals..."
                                  value={chemicalSearch}
                                  onChange={(e) =>
                                    setChemicalSearch(e.target.value)
                                  }
                                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                                />
                              </div>
                            </div>
                            <div className="max-h-64 overflow-y-auto">
                              {searchFilteredChemicals // Use search-filtered list
                                .filter(
                                  (chem) =>
                                    !addedChemicals[selectedParam.id]?.find(
                                      // Filter out chemicals already added to THIS parameter
                                      (added) => added.id === chem.id
                                    )
                                )
                                .map((chem) => (
                                  <button
                                    key={chem.id}
                                    onClick={() =>
                                      handleAddChemical(selectedParam.id, chem)
                                    }
                                    className="w-full text-left px-3 py-2 hover:bg-green-50 border-b border-gray-200 last:border-b-0 transition-colors text-sm"
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
                    <table className="w-full border-collapse text-sm">
                      <thead>
                        <tr className="bg-gray-100 border-2 border-gray-500">
                          <th className="px-3 py-2 border-r-2 border-gray-500 text-left font-bold">
                            Name of Solvents
                          </th>
                          <th className="px-3 py-2 border-r-2 border-gray-500 text-left font-bold">
                            Make
                          </th>
                          <th className="px-3 py-2 border-r-2 border-gray-500 text-left font-bold">
                            Lot No./Batch No.
                          </th>
                          <th className="px-3 py-2 border-r-2 border-gray-500 text-left font-bold">
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
                                className="border-2 border-gray-500 hover:bg-gray-50 transition-colors"
                              >
                                <td className="px-3 py-2 border-r-2 border-gray-500">
                                  {chemical.name || "---"}
                                </td>
                                <td className="px-3 py-2 border-r-2 border-gray-500">
                                  {chemical.make || "---"}
                                </td>
                                <td className="px-3 py-2 border-r-2 border-gray-500">
                                  {chemical.batchNo || "---"}
                                </td>
                                <td className="px-3 py-2 border-r-2 border-gray-500">
                                  {chemical.validity || "---"}
                                </td>
                                <td className="px-3 py-2 text-center">
                                  <button
                                    onClick={() =>
                                      handleRemoveChemical(
                                        selectedParam.id,
                                        chemical.id
                                      )
                                    }
                                    className="p-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
                                    title="Remove chemical"
                                  >
                                    <Trash className="w-4 h-4" />
                                  </button>
                                </td>
                              </motion.tr>
                            ))
                          ) : (
                            <tr className="border-2 border-gray-500">
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
                    <h3 className="text-base font-bold text-gray-900">
                      Standards Used:
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
                        className="flex items-center gap-2 px-3 py-1.5 bg-green-600 text-white font-semibold rounded hover:bg-green-700 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-xs"
                      >
                        <Plus className="w-3 h-3" />
                        Add Standard
                      </button>

                      <AnimatePresence>
                        {showStandardDropdown && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            // FIX APPLIED HERE: Stop event propagation
                            onMouseDown={(e) => e.stopPropagation()}
                            className="absolute right-0 mt-2 w-80 bg-white border border-gray-300 rounded-lg shadow-xl z-50"
                          >
                            <div className="p-2 border-b border-gray-200">
                              <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                  type="text"
                                  placeholder="Search standards..."
                                  value={standardSearch}
                                  onChange={(e) =>
                                    setStandardSearch(e.target.value)
                                  }
                                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                                />
                              </div>
                            </div>
                            <div className="max-h-64 overflow-y-auto">
                              {searchFilteredStandards // Use search-filtered list
                                .filter(
                                  (std) =>
                                    !addedStandards[selectedParam.id]?.find(
                                      // Filter out standards already added to THIS parameter
                                      (added) => added.id === std.id
                                    )
                                )
                                .map((std) => (
                                  <button
                                    key={std.id}
                                    onClick={() =>
                                      handleAddStandard(selectedParam.id, std)
                                    }
                                    className="w-full text-left px-3 py-2 hover:bg-green-50 border-b border-gray-200 last:border-b-0 transition-colors text-sm"
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
                    <table className="w-full border-collapse text-sm">
                      <thead>
                        <tr className="bg-gray-100 border-2 border-gray-500">
                          <th className="px-3 py-2 border-r-2 border-gray-500 text-left font-bold">
                            Name of Standard
                          </th>
                          <th className="px-3 py-2 border-r-2 border-gray-500 text-left font-bold">
                            Purity
                          </th>
                          <th className="px-3 py-2 border-r-2 border-gray-500 text-left font-bold">
                            Make
                          </th>
                          <th className="px-3 py-2 border-r-2 border-gray-500 text-left font-bold">
                            Lot No./Batch No.
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
                                className="border-2 border-gray-500 hover:bg-gray-50 transition-colors"
                              >
                                <td className="px-3 py-2 border-r-2 border-gray-500">
                                  {standard.name || "---"}
                                </td>
                                <td className="px-3 py-2 border-r-2 border-gray-500">
                                  {standard.purity || "---"}
                                </td>
                                <td className="px-3 py-2 border-r-2 border-gray-500">
                                  {standard.make || "---"}
                                </td>
                                <td className="px-3 py-2 border-r-2 border-gray-500">
                                  {standard.batchNo || "---"}
                                </td>
                                <td className="px-3 py-2 text-center">
                                  <button
                                    onClick={() =>
                                      handleRemoveStandard(
                                        selectedParam.id,
                                        standard.id
                                      )
                                    }
                                    className="p-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
                                    title="Remove standard"
                                  >
                                    <Trash className="w-4 h-4" />
                                  </button>
                                </td>
                              </motion.tr>
                            ))
                          ) : (
                            <tr className="border-2 border-gray-500">
                              <td
                                colSpan={5}
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

                <div className="mb-6 text-sm flex flex-col md:flex-row gap-6">
                  {/* Mobile Phase Input (distinct per parameter) */}
                  <div className="flex items-center p-3 bg-gray-50 border border-gray-200 rounded-xl shadow-inner flex-grow">
                    <span className="font-bold mr-4 text-gray-700 w-36 shrink-0">
                      Mobile phase ID:
                    </span>
                    <input
                      type="text"
                      value={mobilePhases[selectedParam.id] || ""}
                      onChange={(e) =>
                        handleMobilePhaseChange(
                          selectedParam.id,
                          e.target.value
                        )
                      }
                      placeholder="Enter mobile phase ID"
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>

                  {/* Column ID Dropdown (distinct per parameter) */}
                  <div
                    className="relative flex items-center p-3 bg-gray-50 border border-gray-200 rounded-xl shadow-inner flex-grow"
                    ref={columnRef}
                  >
                    <span className="font-bold mr-4 text-gray-700 w-36 shrink-0">
                      Column ID:
                    </span>
                    <button
                      onClick={() => setShowColumnDropdown(!showColumnDropdown)}
                      // Enhanced button style for a vibrant, interactive look
                      className="flex items-center gap-2 px-4 py-2 bg-white text-green-700 font-semibold border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      <span className="truncate">
                        {columns.find(
                          (c) => c.id === columnsPerParam[selectedParam.id]
                        )?.id || "Select Column"}
                      </span>
                      <ChevronDown className="w-4 h-4 text-green-500" />
                    </button>

                    <AnimatePresence>
                      {showColumnDropdown && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          // Updated dropdown styles (full width, richer shadow, blue border)
                          className="absolute left-0 mt-2 w-full top-full bg-white border border-blue-300 rounded-xl shadow-2xl z-50 overflow-hidden"
                        >
                          <div className="p-2 border-b border-gray-200 sticky top-0 bg-white">
                            <div className="relative">
                              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                              <input
                                type="text"
                                placeholder="Search column ID/Name..."
                                value={columnSearch}
                                onChange={(e) =>
                                  setColumnSearch(e.target.value)
                                }
                                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                              />
                            </div>
                          </div>
                          <div className="max-h-64 overflow-y-auto">
                            {searchFilteredColumns.map((col) => (
                              <button
                                key={col.id}
                                onClick={() =>
                                  handleSelectColumnForParam(
                                    selectedParam.id,
                                    col.id
                                  )
                                }
                                // Updated hover state
                                className="w-full text-left px-4 py-2 hover:bg-green-100/70 border-b border-gray-200 last:border-b-0 transition-colors text-sm"
                              >
                                <div className="font-semibold text-gray-900">
                                  {col.name}
                                </div>
                                <div className="text-xs text-gray-600">
                                  {col.id}
                                </div>
                              </button>
                            ))}
                            {searchFilteredColumns.length === 0 && (
                              <div className="px-4 py-4 text-center text-gray-500 text-sm">
                                {columnSearch
                                  ? "No matching columns"
                                  : "No columns available"}
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Preparation of Mobile Phase (Unchanged) */}
                <div className="mb-3">
                  <h3 className="text-base font-bold mb-2 text-gray-900">
                    Preparation of Mobile Phase:
                  </h3>
                  <div className="text-sm">
                    <p>{preparationMobilePhase}</p>
                  </div>
                </div>

                {/* Preparation of Test solution (Unchanged) */}
                <div className="mb-4">
                  <h3 className="text-base font-bold mb-2 text-gray-900">
                    Preparation of Test solution or Sample solution:
                  </h3>
                  {preparationTestSolution ? (
                    <div className="text-sm">
                      <p>{preparationTestSolution}</p>
                    </div>
                  ) : (
                    <div className="min-h-[60px] border border-gray-300 rounded p-2 bg-gray-50"></div>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          ))}

        {/* Footer Section (Unchanged) */}
        <div className="border-2 border-black mt-8 rounded-lg overflow-hidden">
          <div className="grid grid-cols-3 border-b-2 border-black text-sm font-bold text-center bg-gradient-to-r from-gray-100 to-gray-200">
            <div className="flex flex-col justify-center border-r-2 border-black p-4 hover:bg-gray-300 transition-colors">
              <span className="text-gray-900">REVIEWED BY (QC)</span>
              <span className="font-normal text-xs text-gray-600 mt-1">
                (Sign & Date)
              </span>
            </div>
            <div className="flex flex-col justify-center border-r-2 border-black p-4 hover:bg-gray-300 transition-colors">
              <span className="text-gray-900">REVIEWED BY (QA)</span>
              <span className="font-normal text-xs text-gray-600 mt-1">
                (Sign & Date)
              </span>
            </div>
            <div className="flex flex-col justify-center p-4 hover:bg-gray-300 transition-colors">
              <span className="text-gray-900">APPROVED BY (QA)</span>
              <span className="font-normal text-xs text-gray-600 mt-1">
                (Sign & Date)
              </span>
            </div>
          </div>

          <div className="grid grid-cols-3 border-b border-black text-xs bg-gray-50">
            <div className="flex items-center px-3 py-2 border-r-2 border-black">
              <span className="font-bold mr-2 text-gray-900">Prepared By:</span>
              <span className="text-gray-700">{preparedBy}</span>
            </div>
            <div className="flex items-center px-3 py-2 border-r-2 border-black">
              <span className="font-bold mr-2 text-gray-900">
                Issued & Approved By:
              </span>
              <span className="text-gray-700">{issuedApprovedBy}</span>
            </div>
            <div className="flex items-center px-3 py-2">
              <span className="font-bold mr-2 text-gray-900">
                Effective Issue Date:
              </span>
              <span className="text-gray-700">{effectiveIssueDate}</span>
            </div>
          </div>

          <div className="grid grid-cols-3 text-xs bg-white">
            <div className="flex items-center px-3 py-2 border-r-2 border-black">
              <span className="font-bold mr-2 text-gray-900">Approved By:</span>
              <span className="text-gray-700">{approvedBy}</span>
            </div>
            <div className="flex items-center px-3 py-2 border-r-2 border-black">
              <span className="font-bold mr-2 text-gray-900">Classified:</span>
              <span className="text-red-600 font-semibold">{classified}</span>
            </div>
            <div className="flex items-center px-3 py-2">
              <span className="font-bold mr-2 text-gray-900">
                Revision Date:
              </span>
              <span className="text-gray-700">{revisionDate}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons (Unchanged) */}
        <div className="mt-6 flex gap-3 justify-center no-print">
          <button className="px-6 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold rounded-lg hover:from-green-700 hover:to-green-800 transition-all shadow-md hover:shadow-lg text-sm">
            Save Draft
          </button>
          <button className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg text-sm">
            Submit for Review
          </button>
          <button className="px-6 py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all shadow-md hover:shadow-lg text-sm">
            Print Preview
          </button>
        </div>
      </div>
    </div>
  );
};

export default FormPreview;
