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

const ReferenceLoading: React.FC = () => (
  <div className="flex items-center justify-center p-4 bg-green-50 border border-green-300 rounded-lg text-sm text-green-800 font-medium shadow-sm">
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

interface MobilePhaseDetailProps {
  mobilePhase: MobilePhase;
  onStepChange: (
    mobilePhaseId: number,
    stepName: MobilePhaseStep["name"],
    field: "value" | "logBookID" | "mobilePhaseID" | "unit" | "solventChemical",
    newValue: string
  ) => void;
}

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

interface DissoMediaDetailProps {
  dissoMedia: DissoMedia;
  onStepChange: (
    dissoMediaId: number,
    stepName: DissoMediaStep["name"],
    field: "value" | "logBookID" | "unit" | "solventChemical",
    newValue: string
  ) => void;
}

const weightUnitOptions = ["g", "mg", "kg"];
const filtrationUnitOptions = ["micron", "µm", "mm"];

const MobilePhaseDetail: React.FC<MobilePhaseDetailProps> = ({
  mobilePhase,
  onStepChange,
}) => {
  return (
    <div className="border-2 border-blue-400  bg-gradient-to-br from-blue-50 via-white to-blue-50 shadow-lg mb-4 hover:shadow-xl transition-shadow">
      <h4 className="text-sm font-bold bg-blue-100 text-blue-900 p-4 mb-4 border-b-2 border-blue-300">
        {mobilePhase.label} Preparation Details
      </h4>
      <div className="space-y-3 p-5">
        {mobilePhase.steps.map((step) => {
          const isWeighing = step.name === "Weighing";
          const isPH = step.name === "PH";
          const isSonication = step.name === "Sonication";
          const isFiltration = step.name === "Filtration";

          return (
            <div
              key={step.name}
              className="grid grid-cols-[180px_1fr] gap-4 items-start bg-white border border-blue-200 rounded-lg p-3 hover:shadow-md hover:border-blue-400 transition-all"
            >
              <div className="font-bold text-blue-900 pt-2">{step.name}:</div>
              <div className="flex flex-col gap-2">
                {isWeighing && (
                  <>
                    <div className="flex flex-wrap items-center gap-2 text-sm">
                      <span className="text-gray-700">Weigh accurately</span>
                      <input
                        type="text"
                        value={step.value}
                        onChange={(e) =>
                          onStepChange(
                            mobilePhase.id,
                            step.name,
                            "value",
                            e.target.value
                          )
                        }
                        placeholder="Amount"
                        className="w-24 px-3 py-1.5 border border-blue-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <div className="relative">
                        <select
                          value={step.unit}
                          onChange={(e) =>
                            onStepChange(
                              mobilePhase.id,
                              step.name,
                              "unit",
                              e.target.value
                            )
                          }
                          className="appearance-none w-20 px-3 py-1.5 pr-8 border border-blue-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                        >
                          {weightUnitOptions.map((unit) => (
                            <option key={unit} value={unit}>
                              {unit}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                      </div>
                      <span className="text-gray-700">of</span>
                      <input
                        type="text"
                        value={step.solventChemical || ""}
                        onChange={(e) =>
                          onStepChange(
                            mobilePhase.id,
                            step.name,
                            "solventChemical",
                            e.target.value
                          )
                        }
                        placeholder="Solvent/Chemical"
                        className="flex-grow min-w-[150px] px-3 py-1.5 border border-blue-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-gray-700">Log Book ID:</span>
                      <input
                        type="text"
                        value={step.logBookID}
                        onChange={(e) =>
                          onStepChange(
                            mobilePhase.id,
                            step.name,
                            "logBookID",
                            e.target.value
                          )
                        }
                        placeholder="Enter Log ID"
                        className="flex-grow px-3 py-1.5 border border-blue-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </>
                )}

                {isPH && (
                  <>
                    <div className="flex flex-wrap items-center gap-2 text-sm">
                      <span className="text-gray-700">Adjust the pH to</span>
                      <input
                        type="text"
                        value={step.value}
                        onChange={(e) =>
                          onStepChange(
                            mobilePhase.id,
                            step.name,
                            "value",
                            e.target.value
                          )
                        }
                        placeholder="pH value"
                        className="w-24 px-3 py-1.5 border border-blue-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-gray-700">Log Book ID:</span>
                      <input
                        type="text"
                        value={step.logBookID}
                        onChange={(e) =>
                          onStepChange(
                            mobilePhase.id,
                            step.name,
                            "logBookID",
                            e.target.value
                          )
                        }
                        placeholder="Enter Log ID"
                        className="flex-grow px-3 py-1.5 border border-blue-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </>
                )}

                {isFiltration && (
                  <div className="flex flex-wrap items-center gap-2 text-sm">
                    <span className="text-gray-700">
                      Filter the mobile phase from
                    </span>
                    <input
                      type="text"
                      value={step.value}
                      onChange={(e) =>
                        onStepChange(
                          mobilePhase.id,
                          step.name,
                          "value",
                          e.target.value
                        )
                      }
                      placeholder="Size"
                      className="w-24 px-3 py-1.5 border border-blue-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <div className="relative">
                      <select
                        value={step.unit}
                        onChange={(e) =>
                          onStepChange(
                            mobilePhase.id,
                            step.name,
                            "unit",
                            e.target.value
                          )
                        }
                        className="appearance-none w-24 px-3 py-1.5 pr-8 border border-blue-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                      >
                        {filtrationUnitOptions.map((unit) => (
                          <option key={unit} value={unit}>
                            {unit}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>
                    <span className="text-gray-700">filter</span>
                  </div>
                )}

                {isSonication && (
                  <>
                    <div className="flex flex-wrap items-center gap-2 text-sm">
                      <span className="text-gray-700">
                        Sonicate the mobile phase for
                      </span>
                      <input
                        type="text"
                        value={step.value}
                        onChange={(e) =>
                          onStepChange(
                            mobilePhase.id,
                            step.name,
                            "value",
                            e.target.value
                          )
                        }
                        placeholder="Time"
                        className="w-20 px-3 py-1.5 border border-blue-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <span className="text-gray-700">{step.unit}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-gray-700">Mobile Phase ID:</span>
                      <input
                        type="text"
                        value={step.mobilePhaseID}
                        onChange={(e) =>
                          onStepChange(
                            mobilePhase.id,
                            step.name,
                            "mobilePhaseID",
                            e.target.value
                          )
                        }
                        placeholder="Enter ID"
                        className="flex-grow px-3 py-1.5 border border-blue-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const DissoMediaDetail: React.FC<DissoMediaDetailProps> = ({
  dissoMedia,
  onStepChange,
}) => {
  return (
    <div className="border-2 border-yellow-400  bg-gradient-to-br from-yellow-50 via-white to-yellow-50 shadow-lg mb-4 hover:shadow-xl transition-shadow">
      <h4 className="text-sm font-bold bg-yellow-100 text-yellow-900 p-4 mb-4 border-b-2 border-yellow-300">
        {dissoMedia.label} Preparation Details
      </h4>
      <div className="space-y-3 p-5">
        {dissoMedia.steps.map((step) => {
          const isWeighing = step.name === "Weighing";
          const isPH = step.name === "PH";
          const isSonication = step.name === "Sonication";
          const isFiltration = step.name === "Filtration";

          return (
            <div
              key={step.name}
              className="grid grid-cols-[180px_1fr] gap-4 items-start bg-white border border-yellow-200 rounded-lg p-3 hover:shadow-md hover:border-yellow-400 transition-all"
            >
              <div className="font-bold text-yellow-900 pt-2">{step.name}:</div>
              <div className="flex flex-col gap-2">
                {isWeighing && (
                  <>
                    <div className="flex flex-wrap items-center gap-2 text-sm">
                      <span className="text-gray-700">Weigh accurately</span>
                      <input
                        type="text"
                        value={step.value}
                        onChange={(e) =>
                          onStepChange(
                            dissoMedia.id,
                            step.name,
                            "value",
                            e.target.value
                          )
                        }
                        placeholder="Amount"
                        className="w-24 px-3 py-1.5 border border-yellow-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                      />
                      <div className="relative">
                        <select
                          value={step.unit}
                          onChange={(e) =>
                            onStepChange(
                              dissoMedia.id,
                              step.name,
                              "unit",
                              e.target.value
                            )
                          }
                          className="appearance-none w-20 px-3 py-1.5 pr-8 border border-yellow-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent bg-white"
                        >
                          {weightUnitOptions.map((unit) => (
                            <option key={unit} value={unit}>
                              {unit}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                      </div>
                      <span className="text-gray-700">of</span>
                      <input
                        type="text"
                        value={step.solventChemical || ""}
                        onChange={(e) =>
                          onStepChange(
                            dissoMedia.id,
                            step.name,
                            "solventChemical",
                            e.target.value
                          )
                        }
                        placeholder="Solvent/Chemical"
                        className="flex-grow min-w-[150px] px-3 py-1.5 border border-yellow-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                      />
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-gray-700">Log Book ID:</span>
                      <input
                        type="text"
                        value={step.logBookID}
                        onChange={(e) =>
                          onStepChange(
                            dissoMedia.id,
                            step.name,
                            "logBookID",
                            e.target.value
                          )
                        }
                        placeholder="Enter Log ID"
                        className="flex-grow px-3 py-1.5 border border-yellow-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                      />
                    </div>
                  </>
                )}

                {isPH && (
                  <>
                    <div className="flex flex-wrap items-center gap-2 text-sm">
                      <span className="text-gray-700">Adjust the pH to</span>
                      <input
                        type="text"
                        value={step.value}
                        onChange={(e) =>
                          onStepChange(
                            dissoMedia.id,
                            step.name,
                            "value",
                            e.target.value
                          )
                        }
                        placeholder="pH value"
                        className="w-24 px-3 py-1.5 border border-yellow-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                      />
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-gray-700">Log Book ID:</span>
                      <input
                        type="text"
                        value={step.logBookID}
                        onChange={(e) =>
                          onStepChange(
                            dissoMedia.id,
                            step.name,
                            "logBookID",
                            e.target.value
                          )
                        }
                        placeholder="Enter Log ID"
                        className="flex-grow px-3 py-1.5 border border-yellow-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                      />
                    </div>
                  </>
                )}

                {isFiltration && (
                  <div className="flex flex-wrap items-center gap-2 text-sm">
                    <span className="text-gray-700">
                      Filter the disso media from
                    </span>
                    <input
                      type="text"
                      value={step.value}
                      onChange={(e) =>
                        onStepChange(
                          dissoMedia.id,
                          step.name,
                          "value",
                          e.target.value
                        )
                      }
                      placeholder="Size"
                      className="w-24 px-3 py-1.5 border border-yellow-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    />
                    <div className="relative">
                      <select
                        value={step.unit}
                        onChange={(e) =>
                          onStepChange(
                            dissoMedia.id,
                            step.name,
                            "unit",
                            e.target.value
                          )
                        }
                        className="appearance-none w-24 px-3 py-1.5 pr-8 border border-yellow-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent bg-white"
                      >
                        {filtrationUnitOptions.map((unit) => (
                          <option key={unit} value={unit}>
                            {unit}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>
                    <span className="text-gray-700">filter</span>
                  </div>
                )}

                {isSonication && (
                  <>
                    <div className="flex flex-wrap items-center gap-2 text-sm">
                      <span className="text-gray-700">
                        Sonicate the disso media for
                      </span>
                      <input
                        type="text"
                        value={step.value}
                        onChange={(e) =>
                          onStepChange(
                            dissoMedia.id,
                            step.name,
                            "value",
                            e.target.value
                          )
                        }
                        placeholder="Time"
                        className="w-20 px-3 py-1.5 border border-yellow-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                      />
                      <span className="text-gray-700">{step.unit}</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
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

  // State for Columns Per Parameter
  const [columnsPerParam, setColumnsPerParam] = useState<
    Record<number, string>
  >({});

  // New state for dynamic Mobile Phases - Map of Parameter ID to a list of MobilePhase objects
  const [mobilePhasesPerParam, setMobilePhasesPerParam] = useState<
    Record<number, MobilePhase[]>
  >({});

  // New state for dynamic Disso Media - Map of Parameter ID to a list of DissoMedia objects
  const [dissoMediaPerParam, setDissoMediaPerParam] = useState<
    Record<number, DissoMedia[]>
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

  // State for test solution preparation
  const [testSolutionPerParam, setTestSolutionPerParam] = useState<
    Record<number, string>
  >({});

  const [diluentPerParam, setDiluentPerParam] = useState<
    Record<number, string>
  >({});

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

  const sample = reportData && reportData.length > 0 ? reportData[0] : null;

  // --- START: Click Outside Logic Implementation ---
  const instrumentRef = useRef<HTMLDivElement>(null);
  const chemicalRef = useRef<HTMLDivElement>(null);
  const standardRef = useRef<HTMLDivElement>(null);
  const columnRef = useRef<HTMLDivElement>(null);

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

  // Parameter Handlers
  const handleAddParameter = (param: SampleData) => {
    const newId = Date.now();
    if (!addedParameters.find((p) => p.paraCode === param.paraCode)) {
      setAddedParameters([...addedParameters, { ...param, id: newId }]);

      // setMobilePhasesPerParam((prev) => ({
      //   ...prev,
      //   [newId]: [createNewMobilePhase(0)],
      // }));

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

  // --- START: Mobile Phase Handlers ---

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

  // --- END: Mobile Phase Handlers ---

  // --- START: Disso Media Handlers ---

  const handleAddDissoMedia = (parameterId: number) => {
    setDissoMediaPerParam((prev) => {
      const currentPhases = prev[parameterId] || [];
      const newIndex = currentPhases.length;
      return {
        ...prev,
        [parameterId]: [...currentPhases, createNewDissoMedia(newIndex)],
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

  // --- END: Disso Media Handlers ---

  // Reference Data Search Filters
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

  // --- START: Data Collection and Submit Handler ---
  const collectFormData = () => {
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
        id: param.id,
        paraCode: param.paraCode,
        parameterName: param.parameter,
        methodCode: param.methodCode,
        methodName: param.methodName,
        instruments: (addedInstruments[param.id] || []).map((inst) => ({
          id: inst.id,
          name: inst.name,
          calibrationDoneDate: inst.calibrationDoneDate,
          calibrationDueDate: inst.calibrationDueDate,
        })),
        chemicals: (addedChemicals[param.id] || []).map((chem) => ({
          id: chem.id,
          name: chem.name,
          make: chem.make,
          batchNo: chem.batchNo,
          validity: chem.validity,
        })),
        standards: (addedStandards[param.id] || []).map((std) => ({
          id: std.id,
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
          id: mp.id,
          label: mp.label,
          steps: mp.steps.map((step) => ({
            name: step.name,
            value: step.value,
            unit: step.unit,
            logBookID: step.logBookID,
            mobilePhaseID: step.mobilePhaseID,
            solventChemical: step.solventChemical,
          })),
        })),
        dissoMedia: (dissoMediaPerParam[param.id] || []).map((dm) => ({
          id: dm.id,
          label: dm.label,
          steps: dm.steps.map((step) => ({
            name: step.name,
            value: step.value,
            unit: step.unit,
            logBookID: step.logBookID,
            solventChemical: step.solventChemical,
          })),
        })),
        testSolutionPreparation: testSolutionPerParam[param.id] || "",
      })),
    };
    return formData;
  };

  const handleSubmit = () => {
    const completeFormData = collectFormData();
    console.log("=== COMPLETE FORM DATA ===");
    console.log(JSON.stringify(completeFormData, null, 2));
    alert("Form data logged to console! Check developer tools.");
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
    <div className="mx-auto my-8 p-8 bg-white shadow-2xl max-w-4xl border-2 border-green-500 rounded-xl">
      <div className="flex justify-between items-center text-sm mb-6 pb-4 border-b-2 border-green-200">
        <div></div>
        <div className="flex flex-col items-end">
          <img src="./ic_efrac.png" alt="EFRAC Logo" className="h-8" />
        </div>
      </div>

      <div className="my-1 border-2 border-green-600 rounded-lg overflow-hidden shadow-md">
        <div className="flex justify-between items-center px-4 py-3 bg-gradient-to-r from-green-700 to-green-800">
          <h1 className="text-base font-semibold text-white tracking-wide">
            EDWARD FOOD RESEARCH & ANALYSIS CENTRE LTD
          </h1>
        </div>
      </div>

      <div className="my-1 border-2 border-green-500 rounded-lg overflow-hidden shadow-md">
        <div className="grid grid-cols-2 border-b border-green-400 text-sm bg-green-50">
          <div className="flex items-center px-3 py-2 border-r-2 border-green-400">
            <span className="font-bold mr-2 text-green-900">
              Registration No:
            </span>
            <span className="font-semibold text-gray-700">
              {sample?.registrationNo || registrationNo || "---"}
            </span>
          </div>
          <div className="flex items-center px-3 py-2">
            <span className="font-bold mr-2 text-green-900">
              Date of Receipt:
            </span>
            <span className="font-semibold text-gray-700">{dateOfReceipt}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 border-b border-green-400 text-sm bg-white">
          <div className="flex items-center px-3 py-2 border-r-2 border-green-400">
            <span className="font-bold mr-2 text-green-900">Sample Name:</span>
            <span className="font-semibold text-gray-700">
              {sample?.sampleName || "---"}
            </span>
          </div>
          <div className="flex items-center px-3 py-2">
            <span className="font-bold mr-2 text-green-900">
              Number of Parameters:
            </span>
            <span className="font-semibold text-gray-700">
              {allParameters.length}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-3 border-green-400 text-sm bg-green-50">
          <div className="flex items-center px-3 py-2 border-r-2 border-green-400">
            <span className="font-bold mr-2 text-green-900">Due Date:</span>
            <span className="font-semibold text-gray-700">
              {sample?.tatDate || "---"}
            </span>
          </div>
          <div className="flex items-center px-3 py-2 border-r-2 border-green-400">
            <span className="font-bold mr-2 text-green-900">
              Analysis Started On:
            </span>
            <span className="font-semibold text-gray-700">
              {sample?.analysisStartDate || "---"}
            </span>
          </div>
          <div className="flex items-center px-3 py-2">
            <span className="font-bold mr-2 text-green-900">
              Analysis Completed On:
            </span>
            <span className="font-semibold text-gray-700">
              {sample?.analysisCompletionDate || "---"}
            </span>
          </div>
        </div>
      </div>

      <div className="p-0 my-8">
        <table className="w-full border-collapse text-sm mb-4 shadow-md">
          <tbody>
            <tr className="border-2 border-green-500 hover:bg-green-50 transition-colors">
              <td className="w-8 px-3 py-3 border-r-2 border-green-500 font-bold text-center bg-green-100 text-green-900">
                1
              </td>
              <td className="w-1/3 px-3 py-3 border-r-2 border-green-500 font-semibold bg-green-50">
                Sample Particulars (All relevant information received with
                sample to be entered):
              </td>
              <td className="px-3 py-3 font-medium">
                {sample?.sampleName || "---"}
              </td>
            </tr>
            <tr className="border-2 border-green-500 hover:bg-green-50 transition-colors">
              <td className="w-8 px-3 py-3 border-r-2 border-green-500 font-bold text-center bg-green-100 text-green-900">
                2
              </td>
              <td className="w-1/3 px-3 py-3 border-r-2 border-green-500 font-semibold bg-green-50">
                Test(s) required (all tests and condition to be entered):
              </td>
              <td className="px-3 py-3 font-medium">
                {testsRequiredDisplay || "No parameters added"}
              </td>
            </tr>
            <tr className="border-2 border-green-500 hover:bg-green-50 transition-colors">
              <td className="w-8 px-3 py-3 border-r-2 border-green-500 font-bold text-center bg-green-100 text-green-900">
                3
              </td>
              <td className="w-1/3 px-3 py-3 border-r-2 border-green-500 font-semibold bg-green-50">
                Method(s) of Analysis / testing
              </td>
              <td className="px-3 py-3 h-16 font-medium">
                {methodsRequiredDisplay || "No methods"}
              </td>
            </tr>
            <tr className="border-2 border-green-500 hover:bg-green-50 transition-colors">
              <td className="w-8 px-3 py-3 border-r-2 border-green-500 font-bold text-center bg-green-100 text-green-900">
                4
              </td>
              <td className="w-1/3 px-3 py-3 border-r-2 border-green-500 font-semibold bg-green-50">
                Raw Data (Observations, Readings, Calculations etc):
              </td>
              <td className="px-3 py-3 h-32 align-top"></td>
            </tr>
          </tbody>
        </table>

        <div className="my-6 p-5 bg-gradient-to-br from-green-50 via-white to-green-50 border-2 border-green-400 rounded-xl shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-green-900">
              Parameters Management
            </h3>
            <div className="relative">
              <button
                onClick={() => setShowParameterDropdown(!showParameterDropdown)}
                disabled={availableToAdd.length === 0}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold rounded-lg hover:from-green-700 hover:to-green-800 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-sm"
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
                    className="absolute right-0 mt-2 w-72 bg-white border border-green-300 rounded-lg shadow-xl z-50 max-h-80 overflow-y-auto"
                  >
                    {availableToAdd.map((param) => (
                      <button
                        key={param.paraCode}
                        onClick={() => handleAddParameter(param)}
                        className="w-full text-left px-3 py-2 hover:bg-green-50 border-b border-green-200 last:border-b-0 transition-colors text-sm"
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
                    className="flex items-center justify-between p-3 bg-white border border-green-300 rounded-lg hover:border-green-500 hover:shadow-md transition-all"
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
                            : "bg-green-100 text-green-700 hover:bg-green-200"
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
                <div className="bg-white rounded-lg border border-green-600 overflow-hidden mb-4 shadow-lg">
                  <div className="flex items-center justify-between px-4 py-2 bg-gradient-to-r from-green-100 to-green-200 border-b border-green-500">
                    <h3 className="text-base font-bold text-green-900">
                      Parameter Details: {selectedParam.parameter}
                    </h3>
                    <button
                      onClick={() => toggleParameterDetail(selectedParam.id)}
                      className="text-green-700 hover:text-green-900 font-bold text-lg"
                    >
                      ✕
                    </button>
                  </div>

                  <table className="w-full border-collapse text-sm">
                    <tbody>
                      <tr>
                        <td className="w-1/2 px-3 py-3 border-r-2 border-green-500 font-semibold text-center bg-green-800 text-white">
                          Parameter Code
                        </td>
                        <td className="w-1/2 px-3 py-3 font-semibold text-center bg-green-800 text-white">
                          Parameter Name
                        </td>
                      </tr>
                      <tr className="border-2 border-green-500 hover:bg-green-50 transition-colors">
                        <td className="w-1/2 px-3 py-3 border-r-2 border-green-500 font-semibold text-center bg-green-50 text-gray-900">
                          {selectedParam.paraCode}
                        </td>
                        <td className="w-1/2 px-3 py-3 font-semibold text-center bg-green-50">
                          {selectedParam.parameter}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-base font-bold text-green-900">
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
                        className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold rounded-lg hover:from-green-700 hover:to-green-800 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-xs"
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
                            onMouseDown={(e) => e.stopPropagation()}
                            className="absolute right-0 mt-2 w-80 bg-white border border-green-300 rounded-lg shadow-xl z-50"
                          >
                            <div className="p-2 border-b border-green-200">
                              <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                  type="text"
                                  placeholder="Search instruments..."
                                  value={instrumentSearch}
                                  onChange={(e) =>
                                    setInstrumentSearch(e.target.value)
                                  }
                                  className="w-full pl-10 pr-3 py-2 border border-green-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
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
                                    className="w-full text-left px-3 py-2 hover:bg-green-50 border-b border-green-200 last:border-b-0 transition-colors text-sm"
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
                    <table className="w-full border-collapse text-sm shadow-md">
                      <thead>
                        <tr className="bg-green-100 border-2 border-green-500">
                          <th className="px-3 py-2 border-r-2 border-green-500 text-left font-bold">
                            Instrument Id.
                          </th>
                          <th className="px-3 py-2 border-r-2 border-green-500 text-left font-bold">
                            Instrument Name
                          </th>
                          <th className="px-3 py-2 border-r-2 border-green-500 text-left font-bold">
                            Calibration Done On
                          </th>
                          <th className="px-3 py-2 border-r-2 border-green-500 text-left font-bold">
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
                                  className="border-2 border-green-500 hover:bg-green-50 transition-colors"
                                >
                                  <td className="px-3 py-2 border-r-2 border-green-500">
                                    {instrument.id || "---"}
                                  </td>
                                  <td className="px-3 py-2 border-r-2 border-green-500">
                                    {instrument.name || "---"}
                                  </td>
                                  <td className="px-3 py-2 border-r-2 border-green-500">
                                    {instrument.calibrationDoneDate || "---"}
                                  </td>
                                  <td className="px-3 py-2 border-r-2 border-green-500">
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
                            <tr className="border-2 border-green-500">
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
                    <h3 className="text-base font-bold text-green-900">
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
                        className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold rounded-lg hover:from-green-700 hover:to-green-800 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-xs"
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
                            onMouseDown={(e) => e.stopPropagation()}
                            className="absolute right-0 mt-2 w-80 bg-white border border-green-300 rounded-lg shadow-xl z-50"
                          >
                            <div className="p-2 border-b border-green-200">
                              <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                  type="text"
                                  placeholder="Search chemicals..."
                                  value={chemicalSearch}
                                  onChange={(e) =>
                                    setChemicalSearch(e.target.value)
                                  }
                                  className="w-full pl-10 pr-3 py-2 border border-green-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
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
                                    className="w-full text-left px-3 py-2 hover:bg-green-50 border-b border-green-200 last:border-b-0 transition-colors text-sm"
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
                        <tr className="bg-green-100 border-2 border-green-500">
                          <th className="px-3 py-2 border-r-2 border-green-500 text-left font-bold">
                            Name of Solvents
                          </th>
                          <th className="px-3 py-2 border-r-2 border-green-500 text-left font-bold">
                            Make
                          </th>
                          <th className="px-3 py-2 border-r-2 border-green-500 text-left font-bold">
                            Lot No./Batch No.
                          </th>
                          <th className="px-3 py-2 border-r-2 border-green-500 text-left font-bold">
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
                                className="border-2 border-green-500 hover:bg-green-50 transition-colors"
                              >
                                <td className="px-3 py-2 border-r-2 border-green-500">
                                  {chemical.name || "---"}
                                </td>
                                <td className="px-3 py-2 border-r-2 border-green-500">
                                  {chemical.make || "---"}
                                </td>
                                <td className="px-3 py-2 border-r-2 border-green-500">
                                  {chemical.batchNo || "---"}
                                </td>
                                <td className="px-3 py-2 border-r-2 border-green-500">
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
                            <tr className="border-2 border-green-500">
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
                    <h3 className="text-base font-bold text-green-900">
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
                        className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold rounded-lg hover:from-green-700 hover:to-green-800 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-xs"
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
                            onMouseDown={(e) => e.stopPropagation()}
                            className="absolute right-0 mt-2 w-80 bg-white border border-green-300 rounded-lg shadow-xl z-50"
                          >
                            <div className="p-2 border-b border-green-200">
                              <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                  type="text"
                                  placeholder="Search standards..."
                                  value={standardSearch}
                                  onChange={(e) =>
                                    setStandardSearch(e.target.value)
                                  }
                                  className="w-full pl-10 pr-3 py-2 border border-green-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
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
                                    className="w-full text-left px-3 py-2 hover:bg-green-50 border-b border-green-200 last:border-b-0 transition-colors text-sm"
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
                        <tr className="bg-green-100 border-2 border-green-500">
                          <th className="px-3 py-2 border-r-2 border-green-500 text-left font-bold">
                            Name of Standard
                          </th>
                          <th className="px-3 py-2 border-r-2 border-green-500 text-left font-bold">
                            Purity
                          </th>
                          <th className="px-3 py-2 border-r-2 border-green-500 text-left font-bold">
                            Make
                          </th>
                          <th className="px-3 py-2 border-r-2 border-green-500 text-left font-bold">
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
                                className="border-2 border-green-500 hover:bg-green-50 transition-colors"
                              >
                                <td className="px-3 py-2 border-r-2 border-green-500">
                                  {standard.name || "---"}
                                </td>
                                <td className="px-3 py-2 border-r-2 border-green-500">
                                  {standard.purity || "---"}
                                </td>
                                <td className="px-3 py-2 border-r-2 border-green-500">
                                  {standard.make || "---"}
                                </td>
                                <td className="px-3 py-2 border-r-2 border-green-500">
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
                            <tr className="border-2 border-green-500">
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

                {/* Preparation of Diluent */}
                <div className="mb-4">
                  <h3 className="text-base font-bold mb-2 text-green-900">
                    Preparation of Diluent:
                  </h3>
                  <textarea
                    value={diluentPerParam[selectedParam.id] || ""}
                    onChange={(e) =>
                      handleDiluentChange(selectedParam.id, e.target.value)
                    }
                    placeholder="Enter diluent preparation details..."
                    className="w-full min-h-[100px] border border-green-300 rounded-lg p-3 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                {/* <div className="mb-6 text-sm flex flex-col md:flex-row gap-6">
                  <div
                    className="relative flex items-center p-3 bg-gradient-to-br from-green-50 to-white border border-green-300 rounded-xl shadow-md flex-grow"
                    ref={columnRef}
                  >
                    <span className="font-bold mr-4 text-green-900 w-36 shrink-0">
                      Column ID:
                    </span>
                    <button
                      onClick={() => setShowColumnDropdown(!showColumnDropdown)}
                      className="flex items-center gap-2 px-4 py-2 bg-white text-green-700 font-semibold border border-green-400 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 hover:bg-green-50 transition-colors"
                    >
                      <span className="truncate">
                        {columns.find(
                          (c) => c.id === columnsPerParam[selectedParam.id]
                        )?.id || "Select Column"}
                      </span>
                      <ChevronDown className="w-4 h-4 text-green-600" />
                    </button>

                    <AnimatePresence>
                      {showColumnDropdown && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="absolute left-0 mt-2 w-full top-full bg-white border border-green-400 rounded-xl shadow-2xl z-50 overflow-hidden"
                        >
                          <div className="p-2 border-b border-green-200 sticky top-0 bg-white">
                            <div className="relative">
                              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                              <input
                                type="text"
                                placeholder="Search column ID/Name..."
                                value={columnSearch}
                                onChange={(e) =>
                                  setColumnSearch(e.target.value)
                                }
                                className="w-full pl-10 pr-3 py-2 border border-green-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
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
                                className="w-full text-left px-4 py-2 hover:bg-green-100 border-b border-green-200 last:border-b-0 transition-colors text-sm"
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
                </div> */}

                {/* --- START: Dynamic Mobile Phase Section --- */}
                <div className="mb-6 p-5 bg-gradient-to-br from-blue-50 to-white border-2 border-blue-400 rounded-xl shadow-lg">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-blue-900">
                      Mobile Phase Preparations
                    </h3>
                    <button
                      onClick={() => handleAddMobilePhase(selectedParam.id)}
                      className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg text-xs"
                    >
                      <Plus className="w-3 h-3" />
                      Add Mobile Phase
                    </button>
                  </div>

                  <AnimatePresence>
                    {(mobilePhasesPerParam[selectedParam.id] || []).map(
                      (mobilePhase) => (
                        <div key={mobilePhase.id} className="relative">
                          <MobilePhaseDetail
                            mobilePhase={mobilePhase}
                            onStepChange={(
                              mobilePhaseId,
                              stepName,
                              field,
                              newValue
                            ) =>
                              handleMobilePhaseStepChange(
                                selectedParam.id,
                                mobilePhaseId,
                                stepName,
                                field,
                                newValue
                              )
                            }
                          />
                          <button
                            className="absolute top-4 right-5 p-1.5 text-red-500 bg-white rounded-full hover:bg-red-100 transition-colors shadow-lg border border-red-300"
                            onClick={() =>
                              handleRemoveMobilePhase(
                                selectedParam.id,
                                mobilePhase.id
                              )
                            }
                            title={`Remove ${mobilePhase.label}`}
                          >
                            <Trash className="w-4 h-4" />
                          </button>
                        </div>
                      )
                    )}
                  </AnimatePresence>

                  {(mobilePhasesPerParam[selectedParam.id] || []).length ===
                    0 && (
                    <div className="text-center py-6 text-gray-500 text-sm bg-white border border-blue-200 rounded-lg">
                      <Target className="w-10 h-10 mx-auto mb-2 opacity-30" />
                      <p>No mobile phases added yet.</p>
                      <p className="text-xs mt-1">
                        Click "Add Mobile Phase" to begin preparation.
                      </p>
                    </div>
                  )}
                </div>
                {/* --- END: Dynamic Mobile Phase Section --- */}

                {/* --- START: Dynamic Disso Media Section --- */}
                <div className="mb-6 p-5 bg-gradient-to-br from-yellow-50 to-white border-2 border-yellow-400 rounded-xl shadow-lg">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-yellow-900">
                      Disso Media Preparations
                    </h3>
                    <button
                      onClick={() => handleAddDissoMedia(selectedParam.id)}
                      className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-yellow-600 to-yellow-700 text-white font-semibold rounded-lg hover:from-yellow-700 hover:to-yellow-800 transition-all shadow-md hover:shadow-lg text-xs"
                    >
                      <Plus className="w-3 h-3" />
                      Add Disso Media
                    </button>
                  </div>

                  <AnimatePresence>
                    {(dissoMediaPerParam[selectedParam.id] || []).map(
                      (dissoMedia) => (
                        <div key={dissoMedia.id} className="relative">
                          <DissoMediaDetail
                            dissoMedia={dissoMedia}
                            onStepChange={(
                              dissoMediaId,
                              stepName,
                              field,
                              newValue
                            ) =>
                              handleDissoMediaStepChange(
                                selectedParam.id,
                                dissoMediaId,
                                stepName,
                                field,
                                newValue
                              )
                            }
                          />
                          <button
                            className="absolute top-4 right-5 p-1.5 text-red-500 bg-white rounded-full hover:bg-red-100 transition-colors shadow-lg border border-red-300"
                            onClick={() =>
                              handleRemoveDissoMedia(
                                selectedParam.id,
                                dissoMedia.id
                              )
                            }
                            title={`Remove ${dissoMedia.label}`}
                          >
                            <Trash className="w-4 h-4" />
                          </button>
                        </div>
                      )
                    )}
                  </AnimatePresence>

                  {(dissoMediaPerParam[selectedParam.id] || []).length ===
                    0 && (
                    <div className="text-center py-6 text-gray-500 text-sm bg-white border border-yellow-200 rounded-lg">
                      <Target className="w-10 h-10 mx-auto mb-2 opacity-30" />
                      <p>No disso media added yet.</p>
                      <p className="text-xs mt-1">
                        Click "Add Disso Media" to begin preparation.
                      </p>
                    </div>
                  )}
                </div>
                {/* --- END: Dynamic Mobile Phase Section --- */}

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
        <div className="border-2 border-green-600 mt-8 rounded-lg overflow-hidden shadow-lg">
          <div className="grid grid-cols-3 border-b-2 border-green-600 text-sm font-bold text-center bg-gradient-to-r from-green-100 to-green-200">
            <div className="flex flex-col justify-center border-r-2 border-green-600 p-4 hover:bg-green-300 transition-colors">
              <span className="text-green-900">REVIEWED BY (QC)</span>
              <span className="font-normal text-xs text-gray-600 mt-1">
                (Sign & Date)
              </span>
            </div>
            <div className="flex flex-col justify-center border-r-2 border-green-600 p-4 hover:bg-green-300 transition-colors">
              <span className="text-green-900">REVIEWED BY (QA)</span>
              <span className="font-normal text-xs text-gray-600 mt-1">
                (Sign & Date)
              </span>
            </div>
            <div className="flex flex-col justify-center p-4 hover:bg-green-300 transition-colors">
              <span className="text-green-900">APPROVED BY (QA)</span>
              <span className="font-normal text-xs text-gray-600 mt-1">
                (Sign & Date)
              </span>
            </div>
          </div>

          <div className="grid grid-cols-3 border-b border-green-500 text-xs bg-green-50">
            <div className="flex items-center px-3 py-2 border-r-2 border-green-500">
              <span className="font-bold mr-2 text-green-900">
                Prepared By:
              </span>
              <span className="text-gray-700">{preparedBy}</span>
            </div>
            <div className="flex items-center px-3 py-2 border-r-2 border-green-500">
              <span className="font-bold mr-2 text-green-900">
                Issued & Approved By:
              </span>
              <span className="text-gray-700">{issuedApprovedBy}</span>
            </div>
            <div className="flex items-center px-3 py-2">
              <span className="font-bold mr-2 text-green-900">
                Effective Issue Date:
              </span>
              <span className="text-gray-700">{effectiveIssueDate}</span>
            </div>
          </div>

          <div className="grid grid-cols-3 text-xs bg-white">
            <div className="flex items-center px-3 py-2 border-r-2 border-green-500">
              <span className="font-bold mr-2 text-green-900">
                Approved By:
              </span>
              <span className="text-gray-700">{approvedBy}</span>
            </div>
            <div className="flex items-center px-3 py-2 border-r-2 border-green-500">
              <span className="font-bold mr-2 text-green-900">Classified:</span>
              <span className="text-red-600 font-semibold">{classified}</span>
            </div>
            <div className="flex items-center px-3 py-2">
              <span className="font-bold mr-2 text-green-900">
                Revision Date:
              </span>
              <span className="text-gray-700">{revisionDate}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex gap-3 justify-center no-print">
          <button className="px-6 py-2.5 bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold rounded-lg hover:from-green-700 hover:to-green-800 transition-all shadow-md hover:shadow-lg text-sm">
            Save Draft
          </button>
          <button
            onClick={handleSubmit}
            className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-semibold rounded-lg hover:from-emerald-700 hover:to-emerald-800 transition-all shadow-md hover:shadow-lg text-sm"
          >
            Submit for Review
          </button>
          <button className="px-6 py-2.5 bg-gradient-to-r from-teal-600 to-teal-700 text-white font-semibold rounded-lg hover:from-teal-700 hover:to-teal-800 transition-all shadow-md hover:shadow-lg text-sm">
            Print Preview
          </button>
        </div>
      </div>
    </div>
  );
};

export default FormPreview;
