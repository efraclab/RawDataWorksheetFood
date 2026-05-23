import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Pill, Trash } from "lucide-react";
import type { SamplePreparationUC } from "../../../preparation_models/drugs/SamplePreparationUC";
import type { SamplePreparationUCStep } from "../../../preparation_models/drugs/SamplePreparationUCStep";
import CustomDropdown from "../../shared/CustomDropdown";
import type { Standard } from "../../../preparation_models/Standard";

const weightUnitOptions = [
  { value: "mg", label: "mg" },
  { value: "g", label: "g" },
  { value: "kg", label: "kg" },
];

const filtrationUnitOptions = [
  { value: "micron", label: "micron" },
  { value: "mm", label: "mm" },
];

const volumeUnitOptions = [
  { value: "ml", label: "ml" },
  { value: "L", label: "L" },
  { value: "µL", label: "µL" },
];

interface SamplePreparationUCDetailProps {
  samplePreparationUC: SamplePreparationUC;
  assignedStandard: Standard | null;
  onStepChange: (
    samplePreparationUCId: number,
    stepName: SamplePreparationUCStep["name"],
    field:
      | "value1"
      | "unit1"
      | "value2"
      | "unit2"
      | "value3"
      | "unit3"
      | "value4"
      | "unit4",
    newValue: string
  ) => void;
  onRemove: () => void;
  role: string;
}

const SamplePreparationUCDetail: React.FC<SamplePreparationUCDetailProps> = ({
  samplePreparationUC,
  assignedStandard,
  onStepChange,
  onRemove,
  role,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="relative group z-20"
    >
      {/* Glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-700/20 to-slate-900/20 rounded-lg blur-xl group-hover:blur-xl transition-all duration-300" />

      <div className="relative bg-white/95 backdrop-blur-sm rounded-lg border border-slate-700/40 transition-all duration-300 mb-4">
        {/* Elegant Header */}
        <div
          className={`relative bg-gradient-to-r from-emerald-700 via-emerald-800 to-slate-900 ${
            isExpanded ? "rounded-t-lg" : "rounded-lg"
          }`}
        >
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
                  <Pill className="w-5 h-5 text-white" />
                </div>
              </motion.div>

              <div>
                <h4 className="text-sm font-semibold text-white tracking-wide">
                  {samplePreparationUC.label}
                </h4>
                <p className="text-xs text-emerald-100">
                  Uniformity of Content - Sample Preparation
                </p>
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
                title={`Remove ${samplePreparationUC.label}`}
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
            >
              <div className="p-5 space-y-3 bg-gradient-to-br from-emerald-50/50 to-slate-50/30">
                {samplePreparationUC.steps.map((step, index) => {
                  const isTabletsCapsules = step.name === "1 Tablets/Capsules";
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
                      <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/0 via-emerald-400/5 to-slate-400/0 rounded-xl opacity-0 group-hover/item:opacity-100 transition-opacity" />

                      <div className="relative bg-white rounded-xl border border-emerald-200/60 hover:border-emerald-300 transition-all duration-200 p-4">
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 w-7 h-7 bg-gradient-to-br from-emerald-700 to-slate-800 rounded-full flex items-center justify-center shadow-md">
                            <span className="text-white text-xs font-bold">
                              {index + 1}
                            </span>
                          </div>

                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-3">
                              <div className="font-bold text-emerald-900 text-sm">
                                {step.name}
                              </div>
                              <div className="h-px flex-1 bg-gradient-to-r from-slate-300 to-transparent" />
                            </div>

                            {isTabletsCapsules && (
                              <div className="space-y-2">
                                <div className="flex flex-wrap items-center gap-2 text-xs">
                                  <span className="text-gray-600 font-medium">
                                    Claim of Tablets/Capsules:
                                  </span>
                                  <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    inputMode="decimal"
                                    value={step.value1 || ""}
                                    onChange={(e) =>
                                      onStepChange(
                                        samplePreparationUC.id,
                                        step.name,
                                        "value1",
                                        e.target.value
                                      )
                                    }
                                    onKeyDown={(e) => {
                                      if (
                                        e.key === "ArrowUp" ||
                                        e.key === "ArrowDown"
                                      ) {
                                        e.preventDefault();
                                      }
                                    }}
                                    onWheel={(e) => e.currentTarget.blur()}
                                    placeholder="Enter Claim"
                                    className="w-24 px-2.5 py-1.5 border border-emerald-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all"
                                  />
                                  <div className="w-20">
                                    <CustomDropdown
                                      options={weightUnitOptions}
                                      value={step.unit1 || "mg"}
                                      onChange={(newUnit) =>
                                        onStepChange(
                                          samplePreparationUC.id,
                                          step.name,
                                          "unit1",
                                          newUnit
                                        )
                                      }
                                      placeholder="Unit"
                                      colorScheme="emerald"
                                    />
                                  </div>
                                </div>
                              </div>
                            )}

                            {is1stDilution && (
                              <div className="space-y-2">
                                <div className="flex flex-wrap items-center gap-2 text-xs">
                                  <span className="text-gray-600 font-medium">
                                    Diluted to
                                  </span>
                                  <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    inputMode="decimal"
                                    value={step.value1 || ""}
                                    onChange={(e) =>
                                      onStepChange(
                                        samplePreparationUC.id,
                                        step.name,
                                        "value1",
                                        e.target.value
                                      )
                                    }
                                    onKeyDown={(e) => {
                                      if (
                                        e.key === "ArrowUp" ||
                                        e.key === "ArrowDown"
                                      ) {
                                        e.preventDefault();
                                      }
                                    }}
                                    onWheel={(e) => e.currentTarget.blur()}
                                    placeholder="Enter Volume"
                                    className="w-24 px-2.5 py-1.5 border border-emerald-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-all"
                                  />
                                  <div className="w-20">
                                    <CustomDropdown
                                      options={volumeUnitOptions}
                                      value={step.unit1 || "ml"}
                                      onChange={(newUnit) =>
                                        onStepChange(
                                          samplePreparationUC.id,
                                          step.name,
                                          "unit1",
                                          newUnit
                                        )
                                      }
                                      placeholder="Unit"
                                      colorScheme="emerald"
                                    />
                                  </div>
                                  <span className="text-gray-600 font-medium">
                                    (V8) with Diluent.
                                  </span>
                                </div>
                              </div>
                            )}

                            {is2ndDilution && (
                              <div className="space-y-2">
                                <div className="flex flex-wrap items-center gap-2 text-xs">
                                  <span className="text-gray-600 font-medium">
                                    Take
                                  </span>
                                  <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    inputMode="decimal"
                                    value={step.value1 || ""}
                                    onChange={(e) =>
                                      onStepChange(
                                        samplePreparationUC.id,
                                        step.name,
                                        "value1",
                                        e.target.value
                                      )
                                    }
                                    onKeyDown={(e) => {
                                      if (
                                        e.key === "ArrowUp" ||
                                        e.key === "ArrowDown"
                                      ) {
                                        e.preventDefault();
                                      }
                                    }}
                                    onWheel={(e) => e.currentTarget.blur()}
                                    placeholder="Enter Volume"
                                    className="w-24 px-2.5 py-1.5 border border-emerald-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-all"
                                  />
                                  <div className="w-20">
                                    <CustomDropdown
                                      options={volumeUnitOptions}
                                      value={step.unit1 || "ml"}
                                      onChange={(newUnit) =>
                                        onStepChange(
                                          samplePreparationUC.id,
                                          step.name,
                                          "unit1",
                                          newUnit
                                        )
                                      }
                                      placeholder="Unit"
                                      colorScheme="emerald"
                                    />
                                  </div>
                                  <span className="text-gray-600 font-medium">
                                    (V9) of 1st Dilution Solution & dilute to
                                  </span>
                                  <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    inputMode="decimal"
                                    value={step.value2 || ""}
                                    onChange={(e) =>
                                      onStepChange(
                                        samplePreparationUC.id,
                                        step.name,
                                        "value2",
                                        e.target.value
                                      )
                                    }
                                    onKeyDown={(e) => {
                                      if (
                                        e.key === "ArrowUp" ||
                                        e.key === "ArrowDown"
                                      ) {
                                        e.preventDefault();
                                      }
                                    }}
                                    onWheel={(e) => e.currentTarget.blur()}
                                    placeholder="Enter Volume"
                                    className="w-24 px-2.5 py-1.5 border border-emerald-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-all"
                                  />
                                  <div className="w-20">
                                    <CustomDropdown
                                      options={volumeUnitOptions}
                                      value={step.unit2 || "ml"}
                                      onChange={(newUnit) =>
                                        onStepChange(
                                          samplePreparationUC.id,
                                          step.name,
                                          "unit2",
                                          newUnit
                                        )
                                      }
                                      placeholder="Unit"
                                      colorScheme="emerald"
                                    />
                                  </div>
                                  <span className="text-gray-600 font-medium">
                                    (V10) with diluent
                                  </span>
                                </div>
                              </div>
                            )}

                            {is3rdDilution && (
                              <div className="space-y-2">
                                <div className="flex flex-wrap items-center gap-2 text-xs">
                                  <span className="text-gray-600 font-medium">
                                    Take
                                  </span>
                                  <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    inputMode="decimal"
                                    value={step.value1 || ""}
                                    onChange={(e) =>
                                      onStepChange(
                                        samplePreparationUC.id,
                                        step.name,
                                        "value1",
                                        e.target.value
                                      )
                                    }
                                    onKeyDown={(e) => {
                                      if (
                                        e.key === "ArrowUp" ||
                                        e.key === "ArrowDown"
                                      ) {
                                        e.preventDefault();
                                      }
                                    }}
                                    onWheel={(e) => e.currentTarget.blur()}
                                    placeholder="Enter Volume"
                                    className="w-24 px-2.5 py-1.5 border border-emerald-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-all"
                                  />
                                  <div className="w-20">
                                    <CustomDropdown
                                      options={volumeUnitOptions}
                                      value={step.unit1 || "ml"}
                                      onChange={(newUnit) =>
                                        onStepChange(
                                          samplePreparationUC.id,
                                          step.name,
                                          "unit1",
                                          newUnit
                                        )
                                      }
                                      placeholder="Unit"
                                      colorScheme="emerald"
                                    />
                                  </div>
                                  <span className="text-gray-600 font-medium">
                                    (V11) of 2nd Dilution Solution & dilute to
                                  </span>
                                  <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    inputMode="decimal"
                                    value={step.value2 || ""}
                                    onChange={(e) =>
                                      onStepChange(
                                        samplePreparationUC.id,
                                        step.name,
                                        "value2",
                                        e.target.value
                                      )
                                    }
                                    onKeyDown={(e) => {
                                      if (
                                        e.key === "ArrowUp" ||
                                        e.key === "ArrowDown"
                                      ) {
                                        e.preventDefault();
                                      }
                                    }}
                                    onWheel={(e) => e.currentTarget.blur()}
                                    placeholder="Enter Volume"
                                    className="w-24 px-2.5 py-1.5 border border-emerald-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-all"
                                  />
                                  <div className="w-20">
                                    <CustomDropdown
                                      options={volumeUnitOptions}
                                      value={step.unit2 || "ml"}
                                      onChange={(newUnit) =>
                                        onStepChange(
                                          samplePreparationUC.id,
                                          step.name,
                                          "unit2",
                                          newUnit
                                        )
                                      }
                                      placeholder="Unit"
                                      colorScheme="emerald"
                                    />
                                  </div>
                                  <span className="text-gray-600 font-medium">
                                    (V12) with diluent
                                  </span>
                                </div>
                              </div>
                            )}

                            {is4thDilution && (
                              <div className="space-y-2">
                                <div className="flex flex-wrap items-center gap-2 text-xs">
                                  <span className="text-gray-600 font-medium">
                                    Take
                                  </span>
                                  <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    inputMode="decimal"
                                    value={step.value1 || ""}
                                    onChange={(e) =>
                                      onStepChange(
                                        samplePreparationUC.id,
                                        step.name,
                                        "value1",
                                        e.target.value
                                      )
                                    }
                                    onKeyDown={(e) => {
                                      if (
                                        e.key === "ArrowUp" ||
                                        e.key === "ArrowDown"
                                      ) {
                                        e.preventDefault();
                                      }
                                    }}
                                    onWheel={(e) => e.currentTarget.blur()}
                                    placeholder="Enter Volume"
                                    className="w-24 px-2.5 py-1.5 border border-emerald-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-all"
                                  />
                                  <div className="w-20">
                                    <CustomDropdown
                                      options={volumeUnitOptions}
                                      value={step.unit1 || "ml"}
                                      onChange={(newUnit) =>
                                        onStepChange(
                                          samplePreparationUC.id,
                                          step.name,
                                          "unit1",
                                          newUnit
                                        )
                                      }
                                      placeholder="Unit"
                                      colorScheme="emerald"
                                    />
                                  </div>
                                  <span className="text-gray-600 font-medium">
                                    (V13) of 3rd Dilution Solution & dilute to
                                  </span>
                                  <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    inputMode="decimal"
                                    value={step.value2 || ""}
                                    onChange={(e) =>
                                      onStepChange(
                                        samplePreparationUC.id,
                                        step.name,
                                        "value2",
                                        e.target.value
                                      )
                                    }
                                    onKeyDown={(e) => {
                                      if (
                                        e.key === "ArrowUp" ||
                                        e.key === "ArrowDown"
                                      ) {
                                        e.preventDefault();
                                      }
                                    }}
                                    onWheel={(e) => e.currentTarget.blur()}
                                    placeholder="Enter Volume"
                                    className="w-24 px-2.5 py-1.5 border border-emerald-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-all"
                                  />
                                  <div className="w-20">
                                    <CustomDropdown
                                      options={volumeUnitOptions}
                                      value={step.unit2 || "ml"}
                                      onChange={(newUnit) =>
                                        onStepChange(
                                          samplePreparationUC.id,
                                          step.name,
                                          "unit2",
                                          newUnit
                                        )
                                      }
                                      placeholder="Unit"
                                      colorScheme="emerald"
                                    />
                                  </div>
                                  <span className="text-gray-600 font-medium">
                                    (V14) with diluent
                                  </span>
                                </div>
                              </div>
                            )}

                            {isFiltration && (
                              <div className="flex flex-wrap items-center gap-2 text-xs">
                                <span className="text-gray-600 font-medium">
                                  Filter the solution through
                                </span>
                                <input
                                  type="number"
                                  min="0"
                                  step="0.01"
                                  inputMode="decimal"
                                  value={step.value1 || ""}
                                  onChange={(e) =>
                                    onStepChange(
                                      samplePreparationUC.id,
                                      step.name,
                                      "value1",
                                      e.target.value
                                    )
                                  }
                                  onKeyDown={(e) => {
                                    if (
                                      e.key === "ArrowUp" ||
                                      e.key === "ArrowDown"
                                    ) {
                                      e.preventDefault();
                                    }
                                  }}
                                  onWheel={(e) => e.currentTarget.blur()}
                                  placeholder="Enter Size"
                                  className="w-24 px-2.5 py-1.5 border border-emerald-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-all"
                                />
                                <div className="w-20">
                                  <CustomDropdown
                                    options={filtrationUnitOptions}
                                    value={step.unit1 || "micron"}
                                    onChange={(newUnit) =>
                                      onStepChange(
                                        samplePreparationUC.id,
                                        step.name,
                                        "unit1",
                                        newUnit
                                      )
                                    }
                                    placeholder="Unit"
                                    colorScheme="emerald"
                                  />
                                </div>
                                <span className="text-gray-600 font-medium">
                                  micron Syringe filter
                                </span>
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

export default SamplePreparationUCDetail;