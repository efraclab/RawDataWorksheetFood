import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Droplets, Trash, AlertTriangle } from "lucide-react";
import type { SamplePreparationMetal } from "../../../preparation_models/metal/SamplePreparationMetal";
import type { SamplePreparationMetalStep } from "../../../preparation_models/metal/SamplePreparationMetalStep";
import { getMetalPrepDilutionErrors } from "../../../preparation_models/metal/metalPrepValidation";
import CustomDropdown from "../../shared/CustomDropdown";

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

interface StandardPreparationMetalDetailProps {
  samplePreparation: SamplePreparationMetal;
  onStepChange: (
    samplePreparationId: number,
    stepName: SamplePreparationMetalStep["name"],
    field:
      | "value1"
      | "unit1"
      | "value2"
      | "unit2"
      | "logBookID"
      | "solventChemical",
    newValue: string
  ) => void;
  onRemove: () => void;
}

const StandardPreparationMetalDetail: React.FC<StandardPreparationMetalDetailProps> = ({
  samplePreparation,
  onStepChange,
  onRemove,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const headerRoundingClass = isExpanded ? "rounded-t-lg" : "rounded-lg";

  // Ensure steps is an array before mapping
  const stepsArray: SamplePreparationMetalStep[] = Array.isArray(
    samplePreparation?.steps
  )
    ? samplePreparation.steps
    : [];

  const dilutionErrors = getMetalPrepDilutionErrors(samplePreparation);
  const stepHasError = (stepName: string) =>
    dilutionErrors.some((e) => e.startsWith(stepName));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="relative group z-20"
    >
      {/* Glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-700/20 to-slate-900/20 rounded-xl blur-xl group-hover:blur-xl transition-all duration-300" />

      <div className="relative bg-white/95 backdrop-blur-sm rounded-lg border border-slate-700/40 transition-all duration-300 mb-4">
        <div
          className={`relative bg-gradient-to-r from-emerald-700 via-emerald-800 to-slate-900 ${headerRoundingClass}`}
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
                  <Droplets className="w-5 h-5 text-white" />
                </div>
              </motion.div>

              <div>
                <h4 className="text-sm font-semibold text-white tracking-wide">
                  {`${samplePreparation.label}`}
                </h4>
                <p className="text-xs text-emerald-100">
                  Standard Preparation Details
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
            >
              <div className="p-5 space-y-3 bg-gradient-to-br from-emerald-50/50 to-slate-50/30">
                {stepsArray.map((step, index) => {
                  const isWeighing = step.name === "Weighing";
                  const is1stDilution = step.name === "1st Dilution";
                  const is2ndDilution = step.name === "2nd Dilution";
                  const is3rdDilution = step.name === "3rd Dilution";
                  const is4thDilution = step.name === "4th Dilution";
                  const isFiltration = step.name === "Filtration";

                  const colorScheme = "emerald";
                  const gradientFrom = "from-emerald-700";
                  const gradientTo = "to-slate-800";
                  const borderColor = "border-slate-200/60";
                  const hoverBorderColor = "hover:border-emerald-300";
                  const textColor = "text-slate-900";
                  const inputBorderColor = "border-slate-300";
                  const focusRingColor = "focus:ring-emerald-500";

                  return (
                    <motion.div
                      key={step.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="group/item relative"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-400/0 via-blue-400/5 to-slate-400/0 rounded-xl opacity-0 group-hover/item:opacity-100 transition-opacity" />

                      <div
                        className={`relative bg-white rounded-xl border ${borderColor} ${hoverBorderColor} transition-all duration-200 p-4`}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={`flex-shrink-0 w-7 h-7 bg-gradient-to-br ${gradientFrom} ${gradientTo} rounded-full flex items-center justify-center shadow-md`}
                          >
                            <span className="text-white text-xs font-bold">
                              {index + 1}
                            </span>
                          </div>

                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-3">
                              <div className={`font-bold ${textColor} text-sm`}>
                                {step.name}
                              </div>
                              <div className="h-px flex-1 bg-gradient-to-r from-slate-300 to-transparent" />
                            </div>

                            {isWeighing && (
                              <div className="space-y-3">
                                <div className="flex flex-wrap items-center gap-2 text-xs">
                                  <span className="text-gray-600 font-medium">
                                    Weigh accurately
                                  </span>
                                  <input
                                    type="number"
                                    min="0"
                                    inputMode="decimal"
                                    value={step.value1 || ""}
                                    onChange={(e) =>
                                      onStepChange(
                                        samplePreparation.id,
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
                                    placeholder="Enter Weight"
                                    className={`w-30 px-2.5 py-1.5 border ${inputBorderColor} rounded-lg text-xs focus:outline-none focus:ring-2 ${focusRingColor} focus:border-transparent transition-all`}
                                  />
                                  <div className="w-20">
                                    <CustomDropdown
                                      options={weightUnitOptions}
                                      value={step.unit1}
                                      onChange={(newUnit) =>
                                        onStepChange(
                                          samplePreparation.id,
                                          step.name,
                                          "unit1",
                                          newUnit
                                        )
                                      }
                                      placeholder="Unit"
                                      colorScheme={colorScheme}
                                    />
                                  </div>
                                  <span className="text-gray-600 font-medium">
                                    of
                                  </span>

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
                                    onKeyDown={(e) => {
                                      if (
                                        e.key === "ArrowUp" ||
                                        e.key === "ArrowDown"
                                      ) {
                                        e.preventDefault();
                                      }
                                    }}
                                    onWheel={(e) => e.currentTarget.blur()}
                                    placeholder="Sample"
                                    className={`flex-1 min-w-[120px] px-2.5 py-1.5 border ${inputBorderColor} rounded-lg text-xs focus:outline-none focus:ring-2 ${focusRingColor} transition-all`}
                                  />
                                </div>

                                {/* Log Book ID Input */}
                                <div className="flex items-center gap-2 text-xs">
                                  <span className="text-gray-600 font-medium">
                                    Log Book ID:
                                  </span>
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
                                    onKeyDown={(e) => {
                                      if (
                                        e.key === "ArrowUp" ||
                                        e.key === "ArrowDown"
                                      ) {
                                        e.preventDefault();
                                      }
                                    }}
                                    onWheel={(e) => e.currentTarget.blur()}
                                    placeholder="Enter Log Book ID"
                                    className={`flex-1 px-2.5 py-1.5 border ${inputBorderColor} rounded-lg text-xs focus:outline-none focus:ring-2 ${focusRingColor} transition-all`}
                                  />
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
                                        samplePreparation.id,
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
                                    className={`w-30 px-2.5 py-1.5 border ${inputBorderColor} rounded-lg text-xs focus:outline-none focus:ring-2 ${focusRingColor} transition-all`}
                                  />
                                  <div className="w-20">
                                    <CustomDropdown
                                      options={volumeUnitOptions}
                                      value={step.unit1}
                                      onChange={(newUnit) =>
                                        onStepChange(
                                          samplePreparation.id,
                                          step.name,
                                          "unit1",
                                          newUnit
                                        )
                                      }
                                      placeholder="Unit"
                                      colorScheme={colorScheme}
                                    />
                                  </div>
                                  <span className="text-gray-600 font-medium">
                                    with Diluent
                                  </span>
                                </div>
                              </div>
                            )}

                            {is2ndDilution && (
                              <div className="space-y-2">
                                {stepHasError(step.name) && (
                                  <div className="flex items-center gap-1.5 px-2 py-1.5 bg-amber-50 border border-amber-300 rounded-lg">
                                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                                    <p className="text-[10px] text-amber-700 font-medium">Both "take" and "dilute to" volumes are required together.</p>
                                  </div>
                                )}
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
                                        samplePreparation.id,
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
                                    className={`w-30 px-2.5 py-1.5 border ${inputBorderColor} rounded-lg text-xs focus:outline-none focus:ring-2 ${focusRingColor} transition-all`}
                                  />
                                  <div className="w-20">
                                    <CustomDropdown
                                      options={volumeUnitOptions}
                                      value={step.unit1}
                                      onChange={(newUnit) =>
                                        onStepChange(
                                          samplePreparation.id,
                                          step.name,
                                          "unit1",
                                          newUnit
                                        )
                                      }
                                      placeholder="Unit"
                                      colorScheme={colorScheme}
                                    />
                                  </div>
                                  <span className="text-gray-600 font-medium">
                                    of 1st Dilution Solution & dilute to
                                  </span>
                                  <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    inputMode="decimal"
                                    value={step.value2 || ""}
                                    onChange={(e) =>
                                      onStepChange(
                                        samplePreparation.id,
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
                                    className={`w-30 px-2.5 py-1.5 border ${inputBorderColor} rounded-lg text-xs focus:outline-none focus:ring-2 ${focusRingColor} transition-all`}
                                  />
                                  <div className="w-20">
                                    <CustomDropdown
                                      options={volumeUnitOptions}
                                      value={step.unit2}
                                      onChange={(newUnit) =>
                                        onStepChange(
                                          samplePreparation.id,
                                          step.name,
                                          "unit2",
                                          newUnit
                                        )
                                      }
                                      placeholder="Unit"
                                      colorScheme={colorScheme}
                                    />
                                  </div>
                                  <span className="text-gray-600 font-medium">
                                    with Diluent
                                  </span>
                                </div>
                              </div>
                            )}

                            {is3rdDilution && (
                              <div className="space-y-2">
                                {stepHasError(step.name) && (
                                  <div className="flex items-center gap-1.5 px-2 py-1.5 bg-amber-50 border border-amber-300 rounded-lg">
                                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                                    <p className="text-[10px] text-amber-700 font-medium">Both "take" and "dilute to" volumes are required together.</p>
                                  </div>
                                )}
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
                                        samplePreparation.id,
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
                                    className={`w-30 px-2.5 py-1.5 border ${inputBorderColor} rounded-lg text-xs focus:outline-none focus:ring-2 ${focusRingColor} transition-all`}
                                  />
                                  <div className="w-20">
                                    <CustomDropdown
                                      options={volumeUnitOptions}
                                      value={step.unit1}
                                      onChange={(newUnit) =>
                                        onStepChange(
                                          samplePreparation.id,
                                          step.name,
                                          "unit1",
                                          newUnit
                                        )
                                      }
                                      placeholder="Unit"
                                      colorScheme={colorScheme}
                                    />
                                  </div>
                                  <span className="text-gray-600 font-medium">
                                    of 2nd Dilution Solution &amp; dilute to
                                  </span>
                                  <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    inputMode="decimal"
                                    value={step.value2 || ""}
                                    onChange={(e) =>
                                      onStepChange(
                                        samplePreparation.id,
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
                                    className={`w-30 px-2.5 py-1.5 border ${inputBorderColor} rounded-lg text-xs focus:outline-none focus:ring-2 ${focusRingColor} transition-all`}
                                  />
                                  <div className="w-20">
                                    <CustomDropdown
                                      options={volumeUnitOptions}
                                      value={step.unit2}
                                      onChange={(newUnit) =>
                                        onStepChange(
                                          samplePreparation.id,
                                          step.name,
                                          "unit2",
                                          newUnit
                                        )
                                      }
                                      placeholder="Unit"
                                      colorScheme={colorScheme}
                                    />
                                  </div>
                                  <span className="text-gray-600 font-medium">
                                    with Diluent
                                  </span>
                                </div>
                              </div>
                            )}

                            {is4thDilution && (
                              <div className="space-y-2">
                                {stepHasError(step.name) && (
                                  <div className="flex items-center gap-1.5 px-2 py-1.5 bg-amber-50 border border-amber-300 rounded-lg">
                                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                                    <p className="text-[10px] text-amber-700 font-medium">Both "take" and "dilute to" volumes are required together.</p>
                                  </div>
                                )}
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
                                        samplePreparation.id,
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
                                    className={`w-30 px-2.5 py-1.5 border ${inputBorderColor} rounded-lg text-xs focus:outline-none focus:ring-2 ${focusRingColor} transition-all`}
                                  />
                                  <div className="w-20">
                                    <CustomDropdown
                                      options={volumeUnitOptions}
                                      value={step.unit1}
                                      onChange={(newUnit) =>
                                        onStepChange(
                                          samplePreparation.id,
                                          step.name,
                                          "unit1",
                                          newUnit
                                        )
                                      }
                                      placeholder="Unit"
                                      colorScheme={colorScheme}
                                    />
                                  </div>
                                  <span className="text-gray-600 font-medium">
                                    of 3rd Dilution Solution &amp; dilute to
                                  </span>
                                  <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    inputMode="decimal"
                                    value={step.value2 || ""}
                                    onChange={(e) =>
                                      onStepChange(
                                        samplePreparation.id,
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
                                    className={`w-30 px-2.5 py-1.5 border ${inputBorderColor} rounded-lg text-xs focus:outline-none focus:ring-2 ${focusRingColor} transition-all`}
                                  />
                                  <div className="w-20">
                                    <CustomDropdown
                                      options={volumeUnitOptions}
                                      value={step.unit2}
                                      onChange={(newUnit) =>
                                        onStepChange(
                                          samplePreparation.id,
                                          step.name,
                                          "unit2",
                                          newUnit
                                        )
                                      }
                                      placeholder="Unit"
                                      colorScheme={colorScheme}
                                    />
                                  </div>
                                  <span className="text-gray-600 font-medium">
                                    with Diluent
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
                                      samplePreparation.id,
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
                                  className={`w-30 px-2.5 py-1.5 border ${inputBorderColor} rounded-lg text-xs focus:outline-none focus:ring-2 ${focusRingColor} transition-all`}
                                />
                                <div className="w-30">
                                  <CustomDropdown
                                    options={filtrationUnitOptions}
                                    value={step.unit1}
                                    onChange={(newUnit) =>
                                      onStepChange(
                                        samplePreparation.id,
                                        step.name,
                                        "unit1",
                                        newUnit
                                      )
                                    }
                                    placeholder="Unit"
                                    colorScheme={colorScheme}
                                  />
                                </div>
                                <span className="text-gray-600 font-medium">
                                  Syringe filter
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

export default StandardPreparationMetalDetail;
