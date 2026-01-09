import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Droplets, Trash } from "lucide-react";
import type { SamplePreparationTitration } from "../../preparation_models/SamplePreparationTitration";
import type { SamplePreparationTitrationStep } from "../../preparation_models/SamplePreparationTitrationStep";

const weightUnitOptions = ["g", "mg", "kg"];
const volumeUnitOptions = ["ml", "L", "µL"];

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

const SamplePreparationTitrationDetail: React.FC<
  SamplePreparationTitrationDetailProps
> = ({ samplePreparationTitration, onStepChange, onRemove }) => {
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
                <p className="text-xs text-lime-100">
                  Sample Preparation for Titration Details
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
                            <span className="text-white text-xs font-bold">
                              {index + 1}
                            </span>
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
                                  <span className="text-gray-600 font-medium">
                                    Weigh accurately
                                  </span>
                                  <input
                                    type="number"
                                    min="0"
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
                                    onKeyDown={(e) => {
                                        if (e.key === "ArrowUp" || e.key === "ArrowDown") {
                                          e.preventDefault();
                                        }
                                      }}
                                      onWheel={(e) => e.currentTarget.blur()}
                                    placeholder="Enter Weight"
                                    className="w-30 px-2.5 py-1.5 border border-lime-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-transparent transition-all"
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
                                  <span className="text-gray-600 font-medium">
                                    of
                                  </span>
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
                                    onKeyDown={(e) => {
                                        if (e.key === "ArrowUp" || e.key === "ArrowDown") {
                                          e.preventDefault();
                                        }
                                      }}
                                      onWheel={(e) => e.currentTarget.blur()}
                                    placeholder="Sample"
                                    className="flex-1 min-w-[120px] px-2.5 py-1.5 border border-lime-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-lime-400 transition-all"
                                  />
                                  <span className="text-gray-500 text-xs">
                                    (Log ID:
                                  </span>
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
                                    onKeyDown={(e) => {
                                        if (e.key === "ArrowUp" || e.key === "ArrowDown") {
                                          e.preventDefault();
                                        }
                                      }}
                                      onWheel={(e) => e.currentTarget.blur()}
                                    placeholder="Enter ID"
                                    className="w-24 px-2.5 py-1.5 border border-lime-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-lime-400 transition-all"
                                  />
                                  <span className="text-gray-500 text-xs">
                                    )
                                  </span>
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
                                    value={step.value || ""}
                                    onChange={(e) =>
                                      onStepChange(
                                        samplePreparationTitration.id,
                                        step.name,
                                        "value",
                                        e.target.value
                                      )
                                    }
                                    onKeyDown={(e) => {
                                        if (e.key === "ArrowUp" || e.key === "ArrowDown") {
                                          e.preventDefault();
                                        }
                                      }}
                                      onWheel={(e) => e.currentTarget.blur()}
                                    placeholder="Enter Volume"
                                    className="w-30 px-2.5 py-1.5 border border-lime-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-lime-400 transition-all"
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
                                  <span className="text-gray-600 font-medium">
                                    with diluent
                                  </span>
                                </div>
                              </div>
                            )}

                            {isEPD && (
                              <div className="space-y-2">
                                <div className="flex flex-wrap items-center gap-2 text-xs">
                                  <span className="text-gray-600 font-medium">
                                    Titration Value
                                  </span>
                                  <input
                                    type="number"
                                    min="0"
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
                                    onKeyDown={(e) => {
                                        if (e.key === "ArrowUp" || e.key === "ArrowDown") {
                                          e.preventDefault();
                                        }
                                      }}
                                      onWheel={(e) => e.currentTarget.blur()}
                                    placeholder="Enter Value"
                                    className="w-30 px-2.5 py-1.5 border border-lime-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-lime-400 transition-all"
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


export default SamplePreparationTitrationDetail