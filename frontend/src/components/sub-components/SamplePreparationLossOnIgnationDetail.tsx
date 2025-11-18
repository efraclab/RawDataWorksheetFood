import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Droplets, Trash } from "lucide-react";
import type { SamplePreparationLossOnIgnation } from "../../models/SamplePreparationLossOnIgnation";
import type { SamplePreparationLossOnIgnationStep } from "../../models/SamplePreparationLossOnIgnationStep";

const weightUnitOptions = ["g", "mg", "kg"];
const timeUnitOptions = ["min", "hr", "sec"];
const tempUnitOptions = ["°C", "°F", "K"];

interface SamplePreparationLossOnIgnationDetailProps {
  samplePreparationLossOnIgnation: SamplePreparationLossOnIgnation;
  onStepChange: (
    samplePreparationLossOnIgnationId: number,
    stepName: SamplePreparationLossOnIgnationStep["name"],
    field:
      | "value"
      | "logBookID"
      | "unit"
      | "temp"
      | "tempUnit"
      | "time"
      | "timeUnit",
    newValue: string
  ) => void;
  onRemove: () => void;
}

const SamplePreparationLossOnIgnationDetail: React.FC<
  SamplePreparationLossOnIgnationDetailProps
> = ({ samplePreparationLossOnIgnation, onStepChange, onRemove }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="relative group"
    >
      {/* Glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-400/20 to-indigo-400/20 rounded-xl blur-xl group-hover:blur-xl transition-all duration-300" />

      <div className="relative bg-white/95 backdrop-blur-sm rounded-lg border border-indigo-200/50 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden mb-4">
        {/* Elegant Header */}
        <div className="relative bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-500 overflow-hidden">
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
                  {samplePreparationLossOnIgnation.label}
                </h4>
                <p className="text-xs text-indigo-100">
                  Sample Preparation for Loss on Ignation Details
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
                title={`Remove ${samplePreparationLossOnIgnation.label}`}
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
              <div className="p-5 space-y-3 bg-gradient-to-br from-indigo-50/50 to-indigo-50/30">
                {samplePreparationLossOnIgnation.steps.map((step, index) => {
                  const isWeighingEmptyCrucible =
                    step.name === "Weighing (Empty Crucible)";
                  const isWeighingBeforeDrying =
                    step.name === "Weighing (Before Drying)";
                  const isWeighingAfterDrying =
                    step.name === "Weighing (After Drying)";
                  const isDrying = step.name === "Drying";

                  return (
                    <motion.div
                      key={step.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="group/item relative"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-indigo-400/0 via-indigo-400/5 to-violet-400/0 rounded-xl opacity-0 group-hover/item:opacity-100 transition-opacity" />

                      <div className="relative bg-white rounded-xl border border-indigo-200/60 shadow-sm hover:shadow-md hover:border-indigo-300 transition-all duration-200 p-4">
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 w-7 h-7 bg-gradient-to-br from-indigo-500 to-violet-500 rounded-full flex items-center justify-center shadow-md">
                            <span className="text-white text-xs font-bold">
                              {index + 1}
                            </span>
                          </div>

                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-3">
                              <div className="font-bold text-indigo-900 text-sm">
                                {step.name}
                              </div>
                              <div className="h-px flex-1 bg-gradient-to-r from-indigo-200 to-transparent" />
                            </div>

                            {isWeighingEmptyCrucible && (
                              <div className="space-y-2">
                                <div className="flex flex-wrap items-center gap-2 text-xs">
                                  <span className="text-gray-600 font-medium">
                                    Weigh of Empty Crucible
                                  </span>
                                  <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    inputMode="decimal"
                                    value={step.value || ""}
                                    onChange={(e) =>
                                      onStepChange(
                                        samplePreparationLossOnIgnation.id,
                                        step.name,
                                        "value",
                                        e.target.value
                                      )
                                    }
                                    placeholder="Enter Weight"
                                    className="w-30 px-2.5 py-1.5 border border-indigo-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all"
                                  />
                                  <select
                                    value={step.unit}
                                    onChange={(e) =>
                                      onStepChange(
                                        samplePreparationLossOnIgnation.id,
                                        step.name,
                                        "unit",
                                        e.target.value
                                      )
                                    }
                                    className="w-16 px-2 py-1.5 border border-indigo-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all"
                                  >
                                    {weightUnitOptions.map((unit) => (
                                      <option key={unit} value={unit}>
                                        {unit}
                                      </option>
                                    ))}
                                  </select>

                                  <span className="text-gray-500 text-xs">
                                    (Log ID:
                                  </span>
                                  <input
                                    type="text"
                                    value={step.logBookID || ""}
                                    onChange={(e) =>
                                      onStepChange(
                                        samplePreparationLossOnIgnation.id,
                                        step.name,
                                        "logBookID",
                                        e.target.value
                                      )
                                    }
                                    placeholder="Enter ID"
                                    className="w-24 px-2.5 py-1.5 border border-indigo-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all"
                                  />
                                  <span className="text-gray-500 text-xs">
                                    )
                                  </span>
                                </div>
                              </div>
                            )}

                            {isWeighingBeforeDrying && (
                              <div className="space-y-2">
                                <div className="flex flex-wrap items-center gap-2 text-xs">
                                  <span className="text-gray-600 font-medium">
                                    Weigh of Crucible + Sample
                                  </span>
                                  <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    inputMode="decimal"
                                    value={step.value || ""}
                                    onChange={(e) =>
                                      onStepChange(
                                        samplePreparationLossOnIgnation.id,
                                        step.name,
                                        "value",
                                        e.target.value
                                      )
                                    }
                                    placeholder="Enter Weight"
                                    className="w-30 px-2.5 py-1.5 border border-indigo-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all"
                                  />
                                  <select
                                    value={step.unit}
                                    onChange={(e) =>
                                      onStepChange(
                                        samplePreparationLossOnIgnation.id,
                                        step.name,
                                        "unit",
                                        e.target.value
                                      )
                                    }
                                    className="w-16 px-2 py-1.5 border border-indigo-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all"
                                  >
                                    {weightUnitOptions.map((unit) => (
                                      <option key={unit} value={unit}>
                                        {unit}
                                      </option>
                                    ))}
                                  </select>
                                </div>
                              </div>
                            )}

                            {isDrying && (
                              <div className="space-y-2">
                                <div className="flex flex-wrap items-center gap-2 text-xs">
                                  <span className="text-gray-600 font-medium">
                                    Dry the sample at
                                  </span>
                                  <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    inputMode="decimal"
                                    value={step.temp || ""}
                                    onChange={(e) =>
                                      onStepChange(
                                        samplePreparationLossOnIgnation.id,
                                        step.name,
                                        "temp",
                                        e.target.value
                                      )
                                    }
                                    placeholder="Enter Temp"
                                    className="w-30 px-2.5 py-1.5 border border-indigo-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all"
                                  />
                                  <select
                                    value={step.tempUnit}
                                    onChange={(e) =>
                                      onStepChange(
                                        samplePreparationLossOnIgnation.id,
                                        step.name,
                                        "tempUnit",
                                        e.target.value
                                      )
                                    }
                                    className="w-16 px-2 py-1.5 border border-indigo-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all"
                                  >
                                    {tempUnitOptions.map((unit) => (
                                      <option key={unit} value={unit}>
                                        {unit}
                                      </option>
                                    ))}
                                  </select>

                                  <span className="text-gray-600 font-medium">
                                    for
                                  </span>
                                  <input
                                    type="number"
                                    min="0"
                                    step="1"
                                    inputMode="numeric"
                                    value={step.time || ""}
                                    onChange={(e) =>
                                      onStepChange(
                                        samplePreparationLossOnIgnation.id,
                                        step.name,
                                        "time",
                                        e.target.value
                                      )
                                    }
                                    placeholder="Enter Time"
                                    className="w-30 px-2.5 py-1.5 border border-indigo-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all"
                                  />
                                  <select
                                    value={step.timeUnit}
                                    onChange={(e) =>
                                      onStepChange(
                                        samplePreparationLossOnIgnation.id,
                                        step.name,
                                        "timeUnit",
                                        e.target.value
                                      )
                                    }
                                    className="w-16 px-2 py-1.5 border border-indigo-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all"
                                  >
                                    {timeUnitOptions.map((unit) => (
                                      <option key={unit} value={unit}>
                                        {unit}
                                      </option>
                                    ))}
                                  </select>

                                  <span className="text-gray-500 text-xs">
                                    (Log ID:
                                  </span>
                                  <input
                                    type="text"
                                    value={step.logBookID || ""}
                                    onChange={(e) =>
                                      onStepChange(
                                        samplePreparationLossOnIgnation.id,
                                        step.name,
                                        "logBookID",
                                        e.target.value
                                      )
                                    }
                                    placeholder="Enter ID"
                                    className="w-24 px-2.5 py-1.5 border border-indigo-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all"
                                  />
                                  <span className="text-gray-500 text-xs">
                                    )
                                  </span>
                                </div>
                              </div>
                            )}

                            {isWeighingAfterDrying && (
                              <div className="space-y-2">
                                <div className="flex flex-wrap items-center gap-2 text-xs">
                                  <span className="text-gray-600 font-medium">
                                    Weigh of Crucible + Sample
                                  </span>
                                  <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    inputMode="decimal"
                                    value={step.value || ""}
                                    onChange={(e) =>
                                      onStepChange(
                                        samplePreparationLossOnIgnation.id,
                                        step.name,
                                        "value",
                                        e.target.value
                                      )
                                    }
                                    placeholder="Enter Weight"
                                    className="w-30 px-2.5 py-1.5 border border-indigo-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all"
                                  />
                                  <select
                                    value={step.unit}
                                    onChange={(e) =>
                                      onStepChange(
                                        samplePreparationLossOnIgnation.id,
                                        step.name,
                                        "unit",
                                        e.target.value
                                      )
                                    }
                                    className="w-16 px-2 py-1.5 border border-indigo-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all"
                                  >
                                    {weightUnitOptions.map((unit) => (
                                      <option key={unit} value={unit}>
                                        {unit}
                                      </option>
                                    ))}
                                  </select>
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

export default SamplePreparationLossOnIgnationDetail