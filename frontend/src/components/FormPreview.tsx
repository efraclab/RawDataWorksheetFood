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
import { Droplets } from "lucide-react";

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

const Beaker: React.FC<{ className: string }> = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M9 3h6v7l4 8a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2l4-8V3z" />
    <path d="M9 3h6" />
  </svg>
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
  onRemove: () => void;
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
  onRemove: () => void;
}

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

interface StandardPreparationDetailProps {
  standardPreparation: StandardPreparation;
  onStepChange: (
    standardPreprationId: number,
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
  ) => void;
  onRemove: () => void;
}

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

interface SamplePreparationDetailProps {
  samplePreparation: SamplePreparation;
  onStepChange: (
    samplePreprationId: number,
    stepName: SamplePreparationStep["name"],
    field:
      "value"
      | "unit"
      | "vol1"
      | "vol2"
      | "unit1"
      | "unit2"
      | "logBookID"
      | "solventChemical",
    newValue: string
  ) => void;

  onRemove: () => void;
}

const createNewSamplePreparationTitration = (index: number): SamplePreparationTitration => {
  return {
    id: Date.now() + index,
    label: `Sample Preparation for Titration ${index + 1}`,
    steps: [
      {
        name: "Weighing",
        value: "",
        unit: "g",
        solventChemical: "",
        logBookID: "",
      },
      { name: "1st Dilution", value: "", unit: "ml"},
      { name: "End Point Determination", value: ""},
    ],
  };
};

interface SamplePreparationTitrationDetailProps {
  samplePreparationTitration: SamplePreparationTitration;
  onStepChange: (
    samplePreparationTitrationId: number,
    stepName: SamplePreparationTitrationStep["name"],
    field: "value" | "logBookID" | "unit" | "solventChemical",
    newValue: string
  ) => void;
  onRemove: () => void;
}

const weightUnitOptions = ["g", "mg", "kg"];
const filtrationUnitOptions = ["micron", "µm", "mm"];
const volumeUnitOptions = ["ml", "L", "µL"];

const MobilePhaseDetail: React.FC<MobilePhaseDetailProps> = ({
  mobilePhase,
  onStepChange,
  onRemove,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="relative group"
    >
      {/* Glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-cyan-400/20 rounded-lg blur-xl group-hover:blur-xl transition-all duration-300" />
      
      <div className="relative bg-white/95 backdrop-blur-sm rounded-lg border border-blue-200/50 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden mb-4">
        {/* Elegant Header */}
        <div className="relative bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 overflow-hidden">
          <div className="absolute inset-0 bg-black/5" />
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32" />
          
          <div className="relative flex items-center justify-between px-4 py-3">
            <div
              className="flex items-center gap-4 flex-1 cursor-pointer select-none"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              <motion.div
                animate={{ rotate: isExpanded ? 0 : 360 }}
                transition={{ duration: 0.5 }}
                className="relative"
              >
                <div className="absolute inset-0 bg-white/30 rounded-lg blur-md" />
                <div className="relative p-2 bg-white/20 rounded-lg backdrop-blur-md border border-white/30">
                  <Droplets className="w-5 h-5 text-white" />
                </div>
              </motion.div>
              
              <div>
                <h4 className="text-sm font-semibold text-white tracking-wide">
                  {mobilePhase.label}
                </h4>
                <p className="text-xs text-blue-100">Mobile Phase Preparation Details</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <motion.button
                onClick={() => setIsExpanded(!isExpanded)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <motion.div
                  animate={{ rotate: isExpanded ? 180 : 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  <ChevronDown className="w-5 h-5 text-white" />
                </motion.div>
              </motion.button>
              
              <motion.button
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove();
                }}
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 bg-white/20 rounded-lg transition-all duration-200 border border-white/30"
                title={`Remove ${mobilePhase.label}`}
              >
                <Trash className="w-4 h-4 text-white" />
              </motion.button>
            </div>
          </div>
        </div>

        {/* Content */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="p-5 space-y-3 bg-gradient-to-br from-blue-50/50 to-cyan-50/30">
                {mobilePhase.steps.map((step, index) => {
                  const isWeighing = step.name === "Weighing";
                  const isPH = step.name === "PH";
                  const isSonication = step.name === "Sonication";
                  const isFiltration = step.name === "Filtration";

                  return (
                    <motion.div
                      key={step.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="group/item relative"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-400/0 via-blue-400/5 to-blue-400/0 rounded-xl opacity-0 group-hover/item:opacity-100 transition-opacity" />
                      
                      <div className="relative bg-white rounded-xl border border-blue-200/60 shadow-sm hover:shadow-md hover:border-blue-300 transition-all duration-200 p-4">
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 w-7 h-7 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center shadow-md">
                            <span className="text-white text-xs font-bold">{index + 1}</span>
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-3">
                              <div className="font-bold text-blue-900 text-sm">
                                {step.name}
                              </div>
                              <div className="h-px flex-1 bg-gradient-to-r from-blue-200 to-transparent" />
                            </div>

                            {isWeighing && (
                              <div className="space-y-2">
                                <div className="flex flex-wrap items-center gap-2 text-xs">
                                  <span className="text-gray-600 font-medium">Weigh accurately</span>
                                  <input
                                    type="number"
                                    step="0.01"
                                    inputMode="decimal"
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
                                    className="w-20 px-2.5 py-1.5 border border-blue-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                                  />
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
                                    className="w-16 px-2 py-1.5 border border-blue-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
                                  >
                                    {weightUnitOptions.map((unit) => (
                                      <option key={unit} value={unit}>
                                        {unit}
                                      </option>
                                    ))}
                                  </select>
                                  <span className="text-gray-600 font-medium">of</span>
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
                                    className="flex-1 min-w-[110px] px-2.5 py-1.5 border border-blue-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
                                  />
                                  <span className="text-gray-500 text-xs">(Log ID:</span>
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
                                    placeholder="Enter ID"
                                    className="w-28 px-2.5 py-1.5 border border-blue-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
                                  />
                                  <span className="text-gray-500 text-xs">)</span>
                                </div>
                              </div>
                            )}

                            {isPH && (
                              <div className="space-y-2">
                                <div className="flex flex-wrap items-center gap-2 text-xs">
                                  <span className="text-gray-600 font-medium">Adjust pH to</span>
                                  <input
                                    type="number"
                                    step="0.01"
                                    inputMode="decimal"
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
                                    className="w-40 px-2.5 py-1.5 border border-blue-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
                                  />
                                  <span className="text-gray-500 text-xs">(Log ID:</span>
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
                                    placeholder="Enter ID"
                                    className="flex-1 px-2.5 py-1.5 border border-blue-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
                                  />
                                  <span className="text-gray-500 text-xs">)</span>
                                </div>
                              </div>
                            )}

                            {isFiltration && (
                              <div className="flex flex-wrap items-center gap-2 text-xs">
                                <span className="text-gray-600 font-medium">Filter from</span>
                                <input
                                  type="number"
                                  step="0.01"
                                  inputMode="decimal"
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
                                  className="w-20 px-2.5 py-1.5 border border-blue-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
                                />
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
                                  className="w-20 px-2 py-1.5 border border-blue-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
                                >
                                  {filtrationUnitOptions.map((unit) => (
                                    <option key={unit} value={unit}>
                                      {unit}
                                    </option>
                                  ))}
                                </select>
                                <span className="text-gray-600 font-medium">filter</span>
                              </div>
                            )}

                            {isSonication && (
                              <div className="space-y-2">
                                <div className="flex flex-wrap items-center gap-2 text-xs">
                                  <span className="text-gray-600 font-medium">Sonicate for</span>
                                  <input
                                    type="number"
                                    step="1"
                                    inputMode="numeric"
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
                                    className="w-16 px-2.5 py-1.5 border border-blue-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
                                  />
                                  <span className="text-gray-600 font-medium">{step.unit}</span>
                                </div>
                                <div className="flex items-center gap-2 text-xs">
                                  <span className="text-gray-600 font-medium">Phase ID:</span>
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
                                    className="flex-1 px-2.5 py-1.5 border border-blue-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

const DissoMediaDetail: React.FC<DissoMediaDetailProps> = ({
  dissoMedia,
  onStepChange,
  onRemove,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="relative group"
    >
      {/* Glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-amber-400/20 to-yellow-400/20 rounded-lg blur-xl group-hover:blur-2xl transition-all duration-300" />
      
      <div className="relative bg-white/95 backdrop-blur-sm rounded-lg border border-amber-200/50 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden mb-4">
        {/* Elegant Header */}
        <div className="relative bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-500 overflow-hidden">
          <div className="absolute inset-0 bg-black/5" />
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32" />
          
          <div className="relative flex items-center justify-between px-4 py-3">
            <div
              className="flex items-center gap-4 flex-1 cursor-pointer select-none"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              <motion.div
                animate={{ rotate: isExpanded ? 0 : 360 }}
                transition={{ duration: 0.5 }}
                className="relative"
              >
                <div className="absolute inset-0 bg-white/30 rounded-lg blur-md" />
                <div className="relative p-2 bg-white/20 rounded-lg backdrop-blur-md border border-white/30">
                  <Droplets className="w-5 h-5 text-white" />
                </div>
              </motion.div>
              
              <div>
                <h4 className="text-sm font-semibold text-white tracking-wide">
                  {dissoMedia.label}
                </h4>
                <p className="text-xs text-yellow-100">Dissolution Media Preparation Details</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <motion.button
                onClick={() => setIsExpanded(!isExpanded)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <motion.div
                  animate={{ rotate: isExpanded ? 180 : 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  <ChevronDown className="w-5 h-5 text-white" />
                </motion.div>
              </motion.button>
              
              <motion.button
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove();
                }}
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 bg-white/20 rounded-lg transition-all duration-200 border border-white/30"
                title={`Remove ${dissoMedia.label}`}
              >
                <Trash className="w-4 h-4 text-white" />
              </motion.button>
            </div>
          </div>
        </div>

        {/* Content */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="p-5 space-y-3 bg-gradient-to-br from-amber-50/50 to-yellow-50/30">
                {dissoMedia.steps.map((step, index) => {
                  const isWeighing = step.name === "Weighing";
                  const isPH = step.name === "PH";
                  const isSonication = step.name === "Sonication";
                  const isFiltration = step.name === "Filtration";

                  return (
                    <motion.div
                      key={step.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="group/item relative"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-amber-400/0 via-amber-400/5 to-amber-400/0 rounded-xl opacity-0 group-hover/item:opacity-100 transition-opacity" />
                      
                      <div className="relative bg-white rounded-xl border border-amber-200/60 shadow-sm hover:shadow-md hover:border-amber-300 transition-all duration-200 p-4">
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 w-7 h-7 bg-gradient-to-br from-amber-500 to-yellow-500 rounded-full flex items-center justify-center shadow-md">
                            <span className="text-white text-xs font-bold">{index + 1}</span>
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-3">
                              <div className="font-bold text-amber-900 text-sm">
                                {step.name}
                              </div>
                              <div className="h-px flex-1 bg-gradient-to-r from-amber-200 to-transparent" />
                            </div>

                            {isWeighing && (
                              <div className="space-y-2">
                                <div className="flex flex-wrap items-center gap-2 text-xs">
                                  <span className="text-gray-600 font-medium">Weigh accurately</span>
                                  <input
                                    type="number"
                                    step="0.01"
                                    inputMode="decimal"
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
                                    className="w-20 px-2.5 py-1.5 border border-amber-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all"
                                  />
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
                                    className="w-16 px-2 py-1.5 border border-amber-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all"
                                  >
                                    {weightUnitOptions.map((unit) => (
                                      <option key={unit} value={unit}>
                                        {unit}
                                      </option>
                                    ))}
                                  </select>
                                  <span className="text-gray-600 font-medium">of</span>
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
                                    className="flex-1 min-w-[110px] px-2.5 py-1.5 border border-amber-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all"
                                  />
                                  <span className="text-gray-500 text-xs">(Log ID:</span>
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
                                    placeholder="Enter ID"
                                    className="w-28 px-2.5 py-1.5 border border-amber-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all"
                                  />
                                  <span className="text-gray-500 text-xs">)</span>
                                </div>
                              </div>
                            )}

                            {isPH && (
                              <div className="space-y-2">
                                <div className="flex flex-wrap items-center gap-2 text-xs">
                                  <span className="text-gray-600 font-medium">Adjust pH to</span>
                                  <input
                                    type="number"
                                    step="0.01"
                                    inputMode="decimal"
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
                                    className="w-40 px-2.5 py-1.5 border border-amber-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all"
                                  />
                                  <span className="text-gray-500 text-xs">(Log ID:</span>
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
                                    placeholder="Enter ID"
                                    className="flex-1 px-2.5 py-1.5 border border-amber-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all"
                                  />
                                  <span className="text-gray-500 text-xs">)</span>
                                </div>
                              </div>
                            )}

                            {isFiltration && (
                              <div className="flex flex-wrap items-center gap-2 text-xs">
                                <span className="text-gray-600 font-medium">Filter from</span>
                                <input
                                  type="number"
                                  step="0.01"
                                  inputMode="decimal"
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
                                  className="w-20 px-2.5 py-1.5 border border-amber-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all"
                                />
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
                                  className="w-20 px-2 py-1.5 border border-amber-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all"
                                >
                                  {filtrationUnitOptions.map((unit) => (
                                    <option key={unit} value={unit}>
                                      {unit}
                                    </option>
                                  ))}
                                </select>
                                <span className="text-gray-600 font-medium">filter</span>
                              </div>
                            )}

                            {isSonication && (
                              <div className="space-y-2">
                                <div className="flex flex-wrap items-center gap-2 text-xs">
                                  <span className="text-gray-600 font-medium">Sonicate for</span>
                                  <input
                                    type="number"
                                    step="1"
                                    inputMode="numeric"
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
                                    className="w-16 px-2.5 py-1.5 border border-amber-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all"
                                  />
                                  <span className="text-gray-600 font-medium">{step.unit}</span>
                                </div>
                                <div className="flex items-center gap-2 text-xs">
                                  <span className="text-gray-600 font-medium">Media ID:</span>
                                  <input
                                    type="text"
                                    value={step.dissoMediaID}
                                    onChange={(e) =>
                                      onStepChange(
                                        dissoMedia.id,
                                        step.name,
                                        "dissoMediaID",
                                        e.target.value
                                      )
                                    }
                                    placeholder="Enter ID"
                                    className="flex-1 px-2.5 py-1.5 border border-amber-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all"
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

const StandardPreparationDetail: React.FC<StandardPreparationDetailProps> = ({
  standardPreparation,
  onStepChange,
  onRemove,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="relative group"
    >
      {/* Glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-lg blur-xl group-hover:blur-xl transition-all duration-300" />
      
      <div className="relative bg-white/95 backdrop-blur-sm rounded-lg border border-purple-200/50 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden mb-4">
        {/* Elegant Header */}
        <div className="relative bg-gradient-to-r from-purple-600 via-purple-500 to-pink-500 overflow-hidden">
          <div className="absolute inset-0 bg-black/5" />
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32" />
          
          <div className="relative flex items-center justify-between px-4 py-3">
            <div
              className="flex items-center gap-4 flex-1 cursor-pointer select-none"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              <motion.div
                animate={{ rotate: isExpanded ? 0 : 360 }}
                transition={{ duration: 0.5 }}
                className="relative"
              >
                <div className="absolute inset-0 bg-white/30 rounded-lg blur-md" />
                <div className="relative p-2 bg-white/20 rounded-lg backdrop-blur-md border border-white/30">
                  <Droplets className="w-5 h-5 text-white" />
                </div>
              </motion.div>
              
              <div>
                <h4 className="text-sm font-semibold text-white tracking-wide">
                  {standardPreparation.label}
                </h4>
                <p className="text-xs text-purple-100">Standard Preparation Details</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <motion.button
                onClick={() => setIsExpanded(!isExpanded)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <motion.div
                  animate={{ rotate: isExpanded ? 180 : 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  <ChevronDown className="w-5 h-5 text-white" />
                </motion.div>
              </motion.button>
              
              <motion.button
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove();
                }}
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 bg-white/20 rounded-lg transition-all duration-200 border border-white/30"
                title={`Remove ${standardPreparation.label}`}
              >
                <Trash className="w-4 h-4 text-white" />
              </motion.button>
            </div>
          </div>
        </div>

        {/* Content */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="p-5 space-y-3 bg-gradient-to-br from-purple-50/50 to-pink-50/30">
                {standardPreparation.steps.map((step, index) => {
                  const isWeighing = step.name === "Weighing";
                  const is1stDilution = step.name === "1st Dilution";
                  const is2ndDilution = step.name === "2nd Dilution";
                  const is3rdDilution = step.name === "3rd Dilution";
                  const is4thDilution = step.name === "4th Dilution";
                  const isFiltration = step.name === "Filtration";

                  return (
                    <motion.div
                      key={step.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="group/item relative"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-400/0 via-purple-400/5 to-purple-400/0 rounded-xl opacity-0 group-hover/item:opacity-100 transition-opacity" />
                      
                      <div className="relative bg-white rounded-xl border border-purple-200/60 shadow-sm hover:shadow-md hover:border-purple-300 transition-all duration-200 p-4">
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 w-7 h-7 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-md">
                            <span className="text-white text-xs font-bold">{index + 1}</span>
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-3">
                              <div className="font-bold text-purple-900 text-sm">
                                {step.name}
                              </div>
                              <div className="h-px flex-1 bg-gradient-to-r from-purple-200 to-transparent" />
                            </div>

                            {isWeighing && (
                              <div className="space-y-2">
                                <div className="flex flex-wrap items-center gap-2 text-xs">
                                  <span className="text-gray-600 font-medium">Weigh accurately</span>
                                  <input
                                    type="number"
                                    step="0.01"
                                    inputMode="decimal"
                                    value={step.value || ""}
                                    onChange={(e) =>
                                      onStepChange(
                                        standardPreparation.id,
                                        step.name,
                                        "value",
                                        e.target.value
                                      )
                                    }
                                    placeholder="Amount"
                                    className="w-20 px-2.5 py-1.5 border border-purple-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all"
                                  />
                                  <select
                                    value={step.unit}
                                    onChange={(e) =>
                                      onStepChange(
                                        standardPreparation.id,
                                        step.name,
                                        "unit",
                                        e.target.value
                                      )
                                    }
                                    className="w-16 px-2 py-1.5 border border-purple-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all"
                                  >
                                    {weightUnitOptions.map((unit) => (
                                      <option key={unit} value={unit}>
                                        {unit}
                                      </option>
                                    ))}
                                  </select>
                                  <span className="text-gray-600 font-medium">of</span>
                                  <input
                                    type="text"
                                    value={step.solventChemical || ""}
                                    onChange={(e) =>
                                      onStepChange(
                                        standardPreparation.id,
                                        step.name,
                                        "solventChemical",
                                        e.target.value
                                      )
                                    }
                                    placeholder="Chemical"
                                    className="flex-1 min-w-[100px] px-2.5 py-1.5 border border-purple-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all"
                                  />
                                  <span className="text-gray-500 text-xs">(Log ID:</span>
                                  <input
                                    type="text"
                                    value={step.logBookID || ""}
                                    onChange={(e) =>
                                      onStepChange(
                                        standardPreparation.id,
                                        step.name,
                                        "logBookID",
                                        e.target.value
                                      )
                                    }
                                    placeholder="Enter ID"
                                    className="w-28 px-2.5 py-1.5 border border-purple-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all"
                                  />
                                  <span className="text-gray-500 text-xs">)</span>
                                </div>
                              </div>
                            )}

                            {is1stDilution && (
                              <div className="space-y-2">
                                <div className="flex flex-wrap items-center gap-2 text-xs">
                                  <span className="text-gray-600 font-medium">Diluted to</span>
                                  <input
                                    type="number"
                                    step="0.01"
                                    inputMode="decimal"
                                    value={step.vol1 || ""}
                                    onChange={(e) =>
                                      onStepChange(
                                        standardPreparation.id,
                                        step.name,
                                        "vol1",
                                        e.target.value
                                      )
                                    }
                                    placeholder="Volume"
                                    className="w-20 px-2.5 py-1.5 border border-purple-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all"
                                  />
                                  <select
                                    value={step.unit1 || "ml"}
                                    onChange={(e) =>
                                      onStepChange(
                                        standardPreparation.id,
                                        step.name,
                                        "unit1",
                                        e.target.value
                                      )
                                    }
                                    className="w-16 px-2 py-1.5 border border-purple-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all"
                                  >
                                    {volumeUnitOptions.map((unit) => (
                                      <option key={unit} value={unit}>
                                        {unit}
                                      </option>
                                    ))}
                                  </select>
                                  <span className="text-gray-600 font-medium">with diluent</span>
                                </div>
                              </div>
                            )}

                            {(is2ndDilution || is3rdDilution || is4thDilution) && (
                              <div className="space-y-2">
                                <div className="flex flex-wrap items-center gap-2 text-xs">
                                  <span className="text-gray-600 font-medium">Take</span>
                                  <input
                                    type="number"
                                    step="0.01"
                                    inputMode="decimal"
                                    value={step.vol1 || ""}
                                    onChange={(e) =>
                                      onStepChange(
                                        standardPreparation.id,
                                        step.name,
                                        "vol1",
                                        e.target.value
                                      )
                                    }
                                    placeholder="Volume"
                                    className="w-20 px-2.5 py-1.5 border border-purple-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all"
                                  />
                                  <select
                                    value={step.unit1 || "ml"}
                                    onChange={(e) =>
                                      onStepChange(
                                        standardPreparation.id,
                                        step.name,
                                        "unit1",
                                        e.target.value
                                      )
                                    }
                                    className="w-16 px-2 py-1.5 border border-purple-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all"
                                  >
                                    {volumeUnitOptions.map((unit) => (
                                      <option key={unit} value={unit}>
                                        {unit}
                                      </option>
                                    ))}
                                  </select>
                                  <span className="text-gray-600 font-medium">
                                    of{" "}
                                    {is2ndDilution
                                      ? "1st"
                                      : is3rdDilution
                                      ? "2nd"
                                      : "3rd"}{" "}
                                    Dilution Solution & dilute to
                                  </span>
                                  <input
                                    type="number"
                                    step="0.01"
                                    inputMode="decimal"
                                    value={step.vol2 || ""}
                                    onChange={(e) =>
                                      onStepChange(
                                        standardPreparation.id,
                                        step.name,
                                        "vol2",
                                        e.target.value
                                      )
                                    }
                                    placeholder="Volume"
                                    className="w-20 px-2.5 py-1.5 border border-purple-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all"
                                  />
                                  <select
                                    value={step.unit2 || "ml"}
                                    onChange={(e) =>
                                      onStepChange(
                                        standardPreparation.id,
                                        step.name,
                                        "unit2",
                                        e.target.value
                                      )
                                    }
                                    className="w-16 px-2 py-1.5 border border-purple-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all"
                                  >
                                    {volumeUnitOptions.map((unit) => (
                                      <option key={unit} value={unit}>
                                        {unit}
                                      </option>
                                    ))}
                                  </select>
                                  <span className="text-gray-600 font-medium">with diluent</span>
                                </div>
                              </div>
                            )}

                            {isFiltration && (
                              <div className="flex flex-wrap items-center gap-2 text-xs">
                                <span className="text-gray-600 font-medium">Filter from</span>
                                <input
                                  type="number"
                                  step="0.01"
                                  inputMode="decimal"
                                  value={step.value}
                                  onChange={(e) =>
                                    onStepChange(
                                      standardPreparation.id,
                                      step.name,
                                      "value",
                                      e.target.value
                                    )
                                  }
                                  placeholder="Size"
                                  className="w-20 px-2.5 py-1.5 border border-purple-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all"
                                />
                                <select
                                  value={step.unit}
                                  onChange={(e) =>
                                    onStepChange(
                                      standardPreparation.id,
                                      step.name,
                                      "unit",
                                      e.target.value
                                    )
                                  }
                                  className="w-20 px-2 py-1.5 border border-purple-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all"
                                >
                                  {filtrationUnitOptions.map((unit) => (
                                    <option key={unit} value={unit}>
                                      {unit}
                                    </option>
                                  ))}
                                </select>
                                <span className="text-gray-600 font-medium">filter</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

const SamplePreparationDetail: React.FC<SamplePreparationDetailProps> = ({
  samplePreparation,
  onStepChange,
  onRemove,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="relative group"
    >
      {/* Glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-emerald-400/20 rounded-lg blur-xl group-hover:blur-xl transition-all duration-300" />
      
      <div className="relative bg-white/95 backdrop-blur-sm rounded-lg border border-green-200/50 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden mb-4">
        {/* Elegant Header */}
        <div className="relative bg-gradient-to-r from-green-600 via-green-500 to-emerald-500 overflow-hidden">
          <div className="absolute inset-0 bg-black/5" />
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32" />
          
          <div className="relative flex items-center justify-between px-4 py-3">
            <div
              className="flex items-center gap-4 flex-1 cursor-pointer select-none"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              <motion.div
                animate={{ rotate: isExpanded ? 0 : 360 }}
                transition={{ duration: 0.5 }}
                className="relative"
              >
                <div className="absolute inset-0 bg-white/30 rounded-lg blur-md" />
                <div className="relative p-2 bg-white/20 rounded-lg backdrop-blur-md border border-white/30">
                  <Droplets className="w-5 h-5 text-white" />
                </div>
              </motion.div>
              
              <div>
                <h4 className="text-sm font-semibold text-white tracking-wide">
                  {samplePreparation.label}
                </h4>
                <p className="text-xs text-green-100">Sample Preparation Details</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <motion.button
                onClick={() => setIsExpanded(!isExpanded)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <motion.div
                  animate={{ rotate: isExpanded ? 180 : 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  <ChevronDown className="w-5 h-5 text-white" />
                </motion.div>
              </motion.button>
              
              <motion.button
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove();
                }}
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 bg-white/20 rounded-lg transition-all duration-200 border border-white/30"
                title={`Remove ${samplePreparation.label}`}
              >
                <Trash className="w-4 h-4 text-white" />
              </motion.button>
            </div>
          </div>
        </div>

        {/* Content */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="p-5 space-y-3 bg-gradient-to-br from-green-50/50 to-emerald-50/30">
                {samplePreparation.steps.map((step, index) => {
                  const isWeighing = step.name === "Weighing";
                  const is1stDilution = step.name === "1st Dilution";
                  const is2ndDilution = step.name === "2nd Dilution";
                  const is3rdDilution = step.name === "3rd Dilution";
                  const is4thDilution = step.name === "4th Dilution";
                  const isFiltration = step.name === "Filtration";

                  return (
                    <motion.div
                      key={step.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="group/item relative"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-green-400/0 via-green-400/5 to-green-400/0 rounded-xl opacity-0 group-hover/item:opacity-100 transition-opacity" />
                      
                      <div className="relative bg-white rounded-xl border border-green-200/60 shadow-sm hover:shadow-md hover:border-green-300 transition-all duration-200 p-4">
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 w-7 h-7 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center shadow-md">
                            <span className="text-white text-xs font-bold">{index + 1}</span>
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-3">
                              <div className="font-bold text-green-900 text-sm">
                                {step.name}
                              </div>
                              <div className="h-px flex-1 bg-gradient-to-r from-green-200 to-transparent" />
                            </div>

                            {isWeighing && (
                              <div className="space-y-2">
                                <div className="flex flex-wrap items-center gap-2 text-xs">
                                  <span className="text-gray-600 font-medium">Weigh accurately</span>
                                  <input
                                    type="number"
                                    step="0.01"
                                    inputMode="decimal"
                                    value={step.value || ""}
                                    onChange={(e) =>
                                      onStepChange(
                                        samplePreparation.id,
                                        step.name,
                                        "value",
                                        e.target.value
                                      )
                                    }
                                    placeholder="Amount"
                                    className="w-20 px-2.5 py-1.5 border border-green-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all"
                                  />
                                  <select
                                    value={step.unit}
                                    onChange={(e) =>
                                      onStepChange(
                                        samplePreparation.id,
                                        step.name,
                                        "unit",
                                        e.target.value
                                      )
                                    }
                                    className="w-16 px-2 py-1.5 border border-green-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-green-400 transition-all"
                                  >
                                    {weightUnitOptions.map((unit) => (
                                      <option key={unit} value={unit}>
                                        {unit}
                                      </option>
                                    ))}
                                  </select>
                                  <span className="text-gray-600 font-medium">of</span>
                                  <input
                                    type="text"
                                    value={step.solventChemical || ""}
                                    onChange={(e) =>
                                      onStepChange(
                                        samplePreparation.id,
                                        step.name,
                                        "solventChemical",
                                        e.target.value
                                      )
                                    }
                                    placeholder="Sample"
                                    className="flex-1 min-w-[120px] px-2.5 py-1.5 border border-green-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-green-400 transition-all"
                                  />
                                  <span className="text-gray-500 text-xs">(Log ID:</span>
                                  <input
                                    type="text"
                                    value={step.logBookID || ""}
                                    onChange={(e) =>
                                      onStepChange(
                                        samplePreparation.id,
                                        step.name,
                                        "logBookID",
                                        e.target.value
                                      )
                                    }
                                    placeholder="Enter ID"
                                    className="w-24 px-2.5 py-1.5 border border-green-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-green-400 transition-all"
                                  />
                                  <span className="text-gray-500 text-xs">)</span>
                                </div>
                              </div>
                            )}

                            {is1stDilution && (
                              <div className="space-y-2">
                                <div className="flex flex-wrap items-center gap-2 text-xs">
                                  <span className="text-gray-600 font-medium">Diluted to</span>
                                  <input
                                    type="number"
                                    step="0.01"
                                    inputMode="decimal"
                                    value={step.vol1 || ""}
                                    onChange={(e) =>
                                      onStepChange(
                                        samplePreparation.id,
                                        step.name,
                                        "vol1",
                                        e.target.value
                                      )
                                    }
                                    placeholder="Volume"
                                    className="w-20 px-2.5 py-1.5 border border-green-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-green-400 transition-all"
                                  />
                                  <select
                                    value={step.unit1 || "ml"}
                                    onChange={(e) =>
                                      onStepChange(
                                        samplePreparation.id,
                                        step.name,
                                        "unit1",
                                        e.target.value
                                      )
                                    }
                                    className="w-16 px-2 py-1.5 border border-purple-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all"
                                  >
                                    {volumeUnitOptions.map((unit) => (
                                      <option key={unit} value={unit}>
                                        {unit}
                                      </option>
                                    ))}
                                  </select>
                                  <span className="text-gray-600 font-medium">with diluent</span>
                                </div>
                              </div>
                            )}

                            {(is2ndDilution || is3rdDilution || is4thDilution) && (
                              <div className="space-y-2">
                                <div className="flex flex-wrap items-center gap-2 text-xs">
                                  <span className="text-gray-600 font-medium">Take</span>
                                  <input
                                    type="number"
                                    step="0.01"
                                    inputMode="decimal"
                                    value={step.vol1 || ""}
                                    onChange={(e) =>
                                      onStepChange(
                                        samplePreparation.id,
                                        step.name,
                                        "vol1",
                                        e.target.value
                                      )
                                    }
                                    placeholder="Volume"
                                    className="w-20 px-2.5 py-1.5 border border-green-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-green-400 transition-all"
                                  />
                                  <select
                                    value={step.unit1 || "ml"}
                                    onChange={(e) =>
                                      onStepChange(
                                        samplePreparation.id,
                                        step.name,
                                        "unit1",
                                        e.target.value
                                      )
                                    }
                                    className="w-16 px-2 py-1.5 border border-green-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-green-400 transition-all"
                                  >
                                    {volumeUnitOptions.map((unit) => (
                                      <option key={unit} value={unit}>
                                        {unit}
                                      </option>
                                    ))}
                                  </select>
                                  <span className="text-gray-600 font-medium">
                                    of{" "}
                                    {is2ndDilution
                                      ? "1st"
                                      : is3rdDilution
                                      ? "2nd"
                                      : "3rd"}{" "}
                                    Dilution Solution & dilute to
                                  </span>
                                  <input
                                    type="number"
                                    step="0.01"
                                    inputMode="decimal"
                                    value={step.vol2 || ""}
                                    onChange={(e) =>
                                      onStepChange(
                                        samplePreparation.id,
                                        step.name,
                                        "vol2",
                                        e.target.value
                                      )
                                    }
                                    placeholder="Volume"
                                    className="w-20 px-2.5 py-1.5 border border-green-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-green-400 transition-all"
                                  />
                                  <select
                                    value={step.unit2 || "ml"}
                                    onChange={(e) =>
                                      onStepChange(
                                        samplePreparation.id,
                                        step.name,
                                        "unit2",
                                        e.target.value
                                      )
                                    }
                                    className="w-16 px-2 py-1.5 border border-green-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-green-400 transition-all"
                                  >
                                    {volumeUnitOptions.map((unit) => (
                                      <option key={unit} value={unit}>
                                        {unit}
                                      </option>
                                    ))}
                                  </select>
                                  <span className="text-gray-600 font-medium">with diluent</span>
                                </div>
                              </div>
                            )}

                            {isFiltration && (
                              <div className="flex flex-wrap items-center gap-2 text-xs">
                                <span className="text-gray-600 font-medium">Filter the solution through</span>
                                <input
                                  type="number"
                                  step="0.01"
                                  inputMode="decimal"
                                  value={step.value || ""}
                                  onChange={(e) =>
                                    onStepChange(
                                      samplePreparation.id,
                                      step.name,
                                      "value",
                                      e.target.value
                                    )
                                  }
                                  placeholder="Size"
                                  className="w-20 px-2.5 py-1.5 border border-green-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-green-400 transition-all"
                                />
                                <span className="text-gray-600 font-medium">micron syringe filter</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

const SamplePreparationTitrationDetail: React.FC<SamplePreparationTitrationDetailProps>  = ({
  samplePreparationTitration,
  onStepChange,
  onRemove,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="relative group"
    >
      {/* Glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-lime-400/20 to-green-400/20 rounded-xl blur-xl group-hover:blur-xl transition-all duration-300" />
      
      <div className="relative bg-white/95 backdrop-blur-sm rounded-lg border border-lime-200/50 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden mb-4">
        {/* Elegant Header */}
        <div className="relative bg-gradient-to-r from-lime-600 via-lime-500 to-green-500 overflow-hidden">
          <div className="absolute inset-0 bg-black/5" />
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32" />
          
          <div className="relative flex items-center justify-between px-4 py-3">
            <div
              className="flex items-center gap-4 flex-1 cursor-pointer select-none"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              <motion.div
                animate={{ rotate: isExpanded ? 0 : 360 }}
                transition={{ duration: 0.5 }}
                className="relative"
              >
                <div className="absolute inset-0 bg-white/30 rounded-lg blur-md" />
                <div className="relative p-2 bg-white/20 rounded-lg backdrop-blur-md border border-white/30">
                  <Droplets className="w-5 h-5 text-white" />
                </div>
              </motion.div>
              
              <div>
                <h4 className="text-sm font-semibold text-white tracking-wide">
                  {samplePreparationTitration.label}
                </h4>
                <p className="text-xs text-lime-100">Sample Preparation for Titration Details</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <motion.button
                onClick={() => setIsExpanded(!isExpanded)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <motion.div
                  animate={{ rotate: isExpanded ? 180 : 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  <ChevronDown className="w-5 h-5 text-white" />
                </motion.div>
              </motion.button>
              
              <motion.button
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove();
                }}
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 bg-white/20 rounded-lg transition-all duration-200 border border-white/30"
                title={`Remove ${samplePreparationTitration.label}`}
              >
                <Trash className="w-4 h-4 text-white" />
              </motion.button>
            </div>
          </div>
        </div>

        {/* Content */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="p-5 space-y-3 bg-gradient-to-br from-lime-50/50 to-green-50/30">
                {samplePreparationTitration.steps.map((step, index) => {
                  const isWeighing = step.name === "Weighing";
                  const is1stDilution = step.name === "1st Dilution";
                  const isEPD = step.name === "End Point Determination";

                  return (
                    <motion.div
                      key={step.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="group/item relative"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-lime-400/0 via-lime-400/5 to-lime-400/0 rounded-xl opacity-0 group-hover/item:opacity-100 transition-opacity" />
                      
                      <div className="relative bg-white rounded-xl border border-lime-200/60 shadow-sm hover:shadow-md hover:border-lime-300 transition-all duration-200 p-4">
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 w-7 h-7 bg-gradient-to-br from-lime-500 to-green-500 rounded-full flex items-center justify-center shadow-md">
                            <span className="text-white text-xs font-bold">{index + 1}</span>
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-3">
                              <div className="font-bold text-lime-900 text-sm">
                                {step.name}
                              </div>
                              <div className="h-px flex-1 bg-gradient-to-r from-lime-200 to-transparent" />
                            </div>

                            {isWeighing && (
                              <div className="space-y-2">
                                <div className="flex flex-wrap items-center gap-2 text-xs">
                                  <span className="text-gray-600 font-medium">Weigh accurately</span>
                                  <input
                                    type="number"
                                    step="0.01"
                                    inputMode="decimal"
                                    value={step.value || ""}
                                    onChange={(e) =>
                                      onStepChange(
                                        samplePreparationTitration.id,
                                        step.name,
                                        "value",
                                        e.target.value
                                      )
                                    }
                                    placeholder="Amount"
                                    className="w-20 px-2.5 py-1.5 border border-lime-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-transparent transition-all"
                                  />
                                  <select
                                    value={step.unit}
                                    onChange={(e) =>
                                      onStepChange(
                                        samplePreparationTitration.id,
                                        step.name,
                                        "unit",
                                        e.target.value
                                      )
                                    }
                                    className="w-16 px-2 py-1.5 border border-lime-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-lime-400 transition-all"
                                  >
                                    {weightUnitOptions.map((unit) => (
                                      <option key={unit} value={unit}>
                                        {unit}
                                      </option>
                                    ))}
                                  </select>
                                  <span className="text-gray-600 font-medium">of</span>
                                  <input
                                    type="text"
                                    value={step.solventChemical || ""}
                                    onChange={(e) =>
                                      onStepChange(
                                        samplePreparationTitration.id,
                                        step.name,
                                        "solventChemical",
                                        e.target.value
                                      )
                                    }
                                    placeholder="Sample"
                                    className="flex-1 min-w-[120px] px-2.5 py-1.5 border border-lime-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-lime-400 transition-all"
                                  />
                                  <span className="text-gray-500 text-xs">(Log ID:</span>
                                  <input
                                    type="text"
                                    value={step.logBookID || ""}
                                    onChange={(e) =>
                                      onStepChange(
                                        samplePreparationTitration.id,
                                        step.name,
                                        "logBookID",
                                        e.target.value
                                      )
                                    }
                                    placeholder="Enter ID"
                                    className="w-24 px-2.5 py-1.5 border border-lime-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-lime-400 transition-all"
                                  />
                                  <span className="text-gray-500 text-xs">)</span>
                                </div>
                              </div>
                            )}

                            {is1stDilution && (
                              <div className="space-y-2">
                                <div className="flex flex-wrap items-center gap-2 text-xs">
                                  <span className="text-gray-600 font-medium">Diluted to</span>
                                  <input
                                    type="number"
                                    step="0.01"
                                    inputMode="decimal"
                                    value={step.value || ""}
                                    onChange={(e) =>
                                      onStepChange(
                                        samplePreparationTitration.id,
                                        step.name,
                                        "value",
                                        e.target.value
                                      )
                                    }
                                    placeholder="Volume"
                                    className="w-20 px-2.5 py-1.5 border border-lime-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-lime-400 transition-all"
                                  />
                                  <select
                                    value={step.unit || "ml"}
                                    onChange={(e) =>
                                      onStepChange(
                                        samplePreparationTitration.id,
                                        step.name,
                                        "unit",
                                        e.target.value
                                      )
                                    }
                                    className="w-16 px-2 py-1.5 border border-lime-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-lime-400 transition-all"
                                  >
                                    {volumeUnitOptions.map((unit) => (
                                      <option key={unit} value={unit}>
                                        {unit}
                                      </option>
                                    ))}
                                  </select>
                                  <span className="text-gray-600 font-medium">with diluent</span>
                                </div>
                              </div>
                            )}

                            {isEPD && (
                              <div className="space-y-2">
                                <div className="flex flex-wrap items-center gap-2 text-xs">
                                  <span className="text-gray-600 font-medium">Titration Value</span>
                                  <input
                                    type="number"
                                    step="0.01"
                                    inputMode="decimal"
                                    value={step.value || ""}
                                    onChange={(e) =>
                                      onStepChange(
                                        samplePreparationTitration.id,
                                        step.name,
                                        "value",
                                        e.target.value
                                      )
                                    }
                                    placeholder="Volume"
                                    className="w-20 px-2.5 py-1.5 border border-lime-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-lime-400 transition-all"
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
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

  const [dissoMediaPerParam, setDissoMediaPerParam] = useState<
    Record<number, DissoMedia[]>
  >({});

  // New state for dynamic Disso Media - Map of Parameter ID to a list of DissoMedia objects
  const [standardPreprationPerParam, setStandardPreprationPerParam] = useState<
    Record<number, StandardPreparation[]>
  >({});

  const [samplePreprationPerParam, setSamplePreprationPerParam] = useState<
    Record<number, SamplePreparation[]>
  >({});

    const [samplePreprationTitrationPerParam, setSamplePreprationTitrationPerParam] = useState<
    Record<number, SamplePreparationTitration[]>
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

  // --- END: Disso Media Handlers ---

  // --- START: Standard Preparation Handlers ---

  const handleAddStandardPreparation = (parameterId: number) => {
    setStandardPreprationPerParam((prev) => {
      const currentStandards = prev[parameterId] || [];
      const newIndex = currentStandards.length;
      return {
        ...prev,
        [parameterId]: [
          ...currentStandards,
          createNewStandardPreparation(newIndex),
        ],
      };
    });
  };

  const handleRemoveStandardPreparation = (
    parameterId: number,
    standardPreparationId: number
  ) => {
    setStandardPreprationPerParam((prev) => {
      const updatedStandards = (prev[parameterId] || [])
        .filter((dm) => dm.id !== standardPreparationId)
        .map((dm, index) => ({
          ...dm,
          label: `Standard Preparation ${1 + index}`,
        }));
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
    setStandardPreprationPerParam((prev) => ({
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

  // --- END: Standard Preparation Handlers ---

  // --- START: Sample Preparation Handlers ---

  const handleAddSamplePreparation = (parameterId: number) => {
    setSamplePreprationPerParam((prev) => {
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
    setSamplePreprationPerParam((prev) => {
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
      "value"
      | "unit"
      | "vol1"
      | "vol2"
      | "unit1"
      | "unit2"
      | "logBookID"
      | "solventChemical",
    newValue: string
  ) => {
    setSamplePreprationPerParam((prev) => ({
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

  // --- END: Sample Preparation Handlers ---

    // --- START: Sample Preparation for Titration Handlers ---

  const handleAddSamplePreparationTitration = (parameterId: number) => {
    setSamplePreprationTitrationPerParam((prev) => {
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
    setSamplePreprationTitrationPerParam((prev) => {
      const updatedSamples = (prev[parameterId] || [])
        .filter((spt) => spt.id !== samplePreparationTitrationId)
        .map((spt, index) => ({
          ...spt,
          label: `Sample Preparation for Titration ${1 + index}`,
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
    field:
      "value"
      | "unit"
      | "logBookID"
      | "solventChemical",
    newValue: string
  ) => {
    setSamplePreprationTitrationPerParam((prev) => ({
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

  // --- END: Sample Preparation Handlers ---

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
        standardPreparation: (standardPreprationPerParam[param.id] || []).map(
          (sp) => ({
            id: sp.id,
            label: sp.label,
            steps: sp.steps.map((step) => ({
              name: step.name,
              value: step.value,
              unit: step.unit,
              vol1: step.vol1,
              vol2: step.vol2,
              unit1: step.unit1,
              unit2: step.unit2,
              logBookID: step.logBookID,
              solventChemical: step.solventChemical,
            })),
          })
        ),
        samplePreparataion: (samplePreprationPerParam[param.id] || []).map(
          (sp) => ({
            id: sp.id,
            label: sp.label,
            steps: sp.steps.map((step) => ({
              name: step.name,
              value: step.value,
              unit: step.unit,
              vol1: step.vol1,
              vol2: step.vol2,
              unit1: step.unit1,
              unit2: step.unit2,
              logBookID: step.logBookID,
              solventChemical: step.solventChemical,
            })),
          })
        ),
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
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center shadow-md">
                <span className="text-white text-sm font-bold">P</span>
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
                    className="flex items-center justify-between p-3 bg-white border border-emerald-300 rounded-lg hover:border-emerald-500 hover:shadow-md transition-all"
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
            <div className="text-center py-4 text-gray-500">
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
                    <h3 className="text-base font-bold text-emerald-900">
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
                                    {instrument.id || "---"}
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
                    <h3 className="text-base font-bold text-emerald-900">
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
                    <h3 className="text-base font-bold text-emerald-900">
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
                  <h3 className="text-base font-bold mb-2 text-emerald-900">
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

                {/* <div className="mb-6 text-sm flex flex-col md:flex-row gap-6">
                  <div
                    className="relative flex items-center p-3 bg-gradient-to-br from-emerald-50 to-white border border-emerald-300 rounded-xl shadow-md flex-grow"
                    ref={columnRef}
                  >
                    <span className="font-bold mr-4 text-emerald-900 w-36 shrink-0">
                      Column ID:
                    </span>
                    <button
                      onClick={() => setShowColumnDropdown(!showColumnDropdown)}
                      className="flex items-center gap-2 px-4 py-2 bg-white text-emerald-700 font-semibold border border-emerald-400 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 hover:bg-emerald-50 transition-colors"
                    >
                      <span className="truncate">
                        {columns.find(
                          (c) => c.id === columnsPerParam[selectedParam.id]
                        )?.id || "Select Column"}
                      </span>
                      <ChevronDown className="w-4 h-4 text-emerald-600" />
                    </button>

                    <AnimatePresence>
                      {showColumnDropdown && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="absolute left-0 mt-2 w-full top-full bg-white border border-emerald-400 rounded-xl shadow-2xl z-50 overflow-hidden"
                        >
                          <div className="p-2 border-b border-emerald-200 sticky top-0 bg-white">
                            <div className="relative">
                              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                              <input
                                type="text"
                                placeholder="Search column ID/Name..."
                                value={columnSearch}
                                onChange={(e) =>
                                  setColumnSearch(e.target.value)
                                }
                                className="w-full pl-10 pr-3 py-2 border border-emerald-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
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
                                className="w-full text-left px-4 py-2 hover:bg-emerald-100 border-b border-emerald-200 last:border-b-0 transition-colors text-sm"
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
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-3 px-1">
                    <h3 className="text-base font-bold text-blue-600 flex items-center gap-2">
                      Mobile Phase Preparations
                    </h3>
                    <button
                      onClick={() => handleAddMobilePhase(selectedParam.id)}
                      className="flex items-center p-1.5 bg-blue-600 text-white font-medium rounded-2xl hover:bg-blue-700 transition-colors shadow-sm text-xs"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  <AnimatePresence>
                    {(mobilePhasesPerParam[selectedParam.id] || []).map(
                      (mobilePhase) => (
                        <MobilePhaseDetail
                          key={mobilePhase.id}
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
                          onRemove={() =>
                            handleRemoveMobilePhase(
                              selectedParam.id,
                              mobilePhase.id
                            )
                          }
                        />
                      )
                    )}
                  </AnimatePresence>

                  {(mobilePhasesPerParam[selectedParam.id] || []).length ===
                    0 && (
                    <div className="text-center py-8 text-gray-500 text-sm bg-blue-50/50 border border-blue-200 rounded-lg">
                      <Target className="w-10 h-10 mx-auto mb-2 opacity-30" />
                      <p className="font-medium">No mobile phases added yet.</p>
                      <p className="text-xs mt-1">
                        Click "Add Mobile Phase" to begin preparation.
                      </p>
                    </div>
                  )}
                </div>
                {/* --- END: Dynamic Mobile Phase Section --- */}

                {/* --- START: Dynamic Disso Media Section --- */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-3 px-1">
                    <h3 className="text-base font-bold text-amber-600 flex items-center gap-2">
                      Disso Media Preparations
                    </h3>
                    <button
                      onClick={() => handleAddDissoMedia(selectedParam.id)}
                      className="flex items-center p-1.5 bg-amber-600 text-white font-medium rounded-2xl hover:bg-amber-700 transition-colors shadow-sm text-xs"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  <AnimatePresence>
                    {(dissoMediaPerParam[selectedParam.id] || []).map(
                      (dissoMedia) => (
                        <DissoMediaDetail
                          key={dissoMedia.id}
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
                          onRemove={() =>
                            handleRemoveDissoMedia(
                              selectedParam.id,
                              dissoMedia.id
                            )
                          }
                        />
                      )
                    )}
                  </AnimatePresence>

                  {(dissoMediaPerParam[selectedParam.id] || []).length ===
                    0 && (
                    <div className="text-center py-8 text-gray-500 text-sm bg-amber-50/50 border border-amber-200 rounded-lg">
                      <Target className="w-10 h-10 mx-auto mb-2 opacity-30" />
                      <p className="font-medium">No disso media added yet.</p>
                      <p className="text-xs mt-1">
                        Click "Add Disso Media" to begin preparation.
                      </p>
                    </div>
                  )}
                </div>
                {/* --- END: Dynamic Disso Media Section --- */}

                {/* --- START: Dynamic Standard Preparation Section --- */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-3 px-1">
                    <h3 className="text-base font-bold text-purple-600 flex items-center gap-2">
                      Standard Preparations
                    </h3>
                    <button
                      onClick={() =>
                        handleAddStandardPreparation(selectedParam.id)
                      }
                      className="flex items-center p-1.5 bg-purple-600 text-white font-medium rounded-2xl hover:bg-purple-700 transition-colors shadow-sm text-xs"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  <AnimatePresence>
                    {(standardPreprationPerParam[selectedParam.id] || []).map(
                      (standardPreparation) => (
                        <StandardPreparationDetail
                          key={standardPreparation.id}
                          standardPreparation={standardPreparation}
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
                      )
                    )}
                  </AnimatePresence>

                  {(standardPreprationPerParam[selectedParam.id] || [])
                    .length === 0 && (
                    <div className="text-center py-8 text-gray-500 text-sm bg-purple-50/50 border border-purple-200 rounded-lg">
                      <Target className="w-10 h-10 mx-auto mb-2 opacity-30" />
                      <p className="font-medium">
                        No standard preparation added yet.
                      </p>
                      <p className="text-xs mt-1">
                        Click "Add Standard Preparation" to begin preparation.
                      </p>
                    </div>
                  )}
                </div>
                {/* --- END: Dynamic Standard Preparation Section --- */}

                {/* --- START: Dynamic Sample Preparation Section --- */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-3 px-1">
                    <h3 className="text-base font-bold text-green-600 flex items-center gap-2">
                      Sample Preparations
                    </h3>
                    <button
                      onClick={() =>
                        handleAddSamplePreparation(selectedParam.id)
                      }
                      className="flex items-center p-1.5 bg-green-600 text-white font-medium rounded-2xl hover:bg-green-700 transition-colors shadow-sm text-xs"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  <AnimatePresence>
                    {(samplePreprationPerParam[selectedParam.id] || []).map(
                      (samplePreparation) => (
                        <SamplePreparationDetail
                          key={samplePreparation.id}
                          samplePreparation={samplePreparation}
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
                              samplePreparation.id
                            )
                          }
                        />
                      )
                    )}
                  </AnimatePresence>

                  {(samplePreprationPerParam[selectedParam.id] || []).length ===
                    0 && (
                    <div className="text-center py-8 text-gray-500 text-sm bg-green-50/50 border border-green-200 rounded-lg">
                      <Target className="w-10 h-10 mx-auto mb-2 opacity-30" />
                      <p className="font-medium">
                        No sample preparation added yet.
                      </p>
                      <p className="text-xs mt-1">
                        Click "Add Sample Preparation" to begin preparation.
                      </p>
                    </div>
                  )}
                </div>
                {/* --- END: Dynamic Standard Preparation Section --- */}

                {/* --- START: Dynamic Sample Preparation for Titration Section --- */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-3 px-1">
                    <h3 className="text-base font-bold text-lime-600 flex items-center gap-2">
                      Sample Preparations for Titration
                    </h3>
                    <button
                      onClick={() =>
                        handleAddSamplePreparationTitration(selectedParam.id)
                      }
                      className="flex items-center p-1.5 bg-lime-600 text-white font-medium rounded-2xl hover:bg-lime-700 transition-colors shadow-sm text-xs"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  <AnimatePresence>
                    {(samplePreprationTitrationPerParam[selectedParam.id] || []).map(
                      (samplePreparationTitration) => (
                        <SamplePreparationTitrationDetail
                          key={samplePreparationTitration.id}
                          samplePreparationTitration={samplePreparationTitration}
                          onStepChange={(
                            samplePreparationTitrationId,
                            stepName,
                            field,
                            newValue
                          ) =>
                            handleSamplePreparationTitrationStepChange(
                              selectedParam.id,
                              samplePreparationTitrationId,
                              stepName,
                              field,
                              newValue
                            )
                          }
                          onRemove={() =>
                            handleRemoveSamplePreparationTitration(
                              selectedParam.id,
                              samplePreparationTitration.id
                            )
                          }
                        />
                      )
                    )}
                  </AnimatePresence>

                  {(samplePreprationTitrationPerParam[selectedParam.id] || []).length ===
                    0 && (
                    <div className="text-center py-8 text-gray-500 text-sm bg-lime-50/50 border border-lime-200 rounded-lg">
                      <Target className="w-10 h-10 mx-auto mb-2 opacity-30" />
                      <p className="font-medium">
                        No sample preparation for titration added yet.
                      </p>
                      <p className="text-xs mt-1">
                        Click "Add Sample Preparation for Titration" to begin preparation.
                      </p>
                    </div>
                  )}
                </div>
                {/* --- END: Dynamic Sample Preparation for Titration Section --- */}

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
              <span className="font-bold mr-2 text-emerald-900">Classified:</span>
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
          <button className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-semibold rounded-lg hover:from-emerald-700 hover:to-emerald-800 transition-all shadow-md hover:shadow-lg text-sm">
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
