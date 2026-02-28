import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Droplets, Trash } from "lucide-react";
import type { SamplePreparationTitration } from "../../preparation_models/SamplePreparationTitration";
import type { SamplePreparationTitrationStep } from "../../preparation_models/SamplePreparationTitrationStep";
import CustomDropdown from "../shared/CustomDropdown";

const weightUnitOptions = [
  { value: "mg", label: "mg" },
  { value: "g", label: "g" },
  { value: "kg", label: "kg" },
];
const volumeUnitOptions = [
  { value: "ml", label: "ml" },
  { value: "L", label: "L" },
  { value: "µL", label: "µL" },
];
const timeUnitOptions = [
  { value: "min", label: "min" },
  { value: "hr", label: "hr" },
  { value: "sec", label: "sec" },
];

interface SamplePreparationTitrationDetailProps {
  samplePreparationTitration: SamplePreparationTitration;
  type: "assay" | "disso";
  onStepChange: (
    samplePreparationTitrationId: number,
    stepName: SamplePreparationTitrationStep["name"],
    field: "value1" | "value2" | "value3" | "logBookID" | "unit1" | "unit2" | "unit3" | "solventChemical",
    newValue: string,
  ) => void;
  onRemove: () => void;
}

const SamplePreparationTitrationDetail: React.FC<
  SamplePreparationTitrationDetailProps
> = ({ samplePreparationTitration, type, onStepChange, onRemove }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const headerRoundingClass = isExpanded ? "rounded-t-lg" : "rounded-lg";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="relative group z-20"
    >
      {/* Glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/20 to-emerald-400/20 rounded-xl blur-xl group-hover:blur-xl transition-all duration-300" />

      <div className="relative bg-white/95 backdrop-blur-sm rounded-lg border border-emerald-200/50 transition-all duration-300 mb-4">
        {/* Elegant Header */}
        <div className={`relative bg-gradient-to-r from-emerald-600 via-emerald-500 to-emerald-500 ${headerRoundingClass}`}>
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
                <p className="text-xs text-emerald-100">
                  Sample Preparation Details
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
            >
              <div className="p-5 space-y-3 bg-gradient-to-br from-emerald-50/50 to-emerald-50/30">
                {samplePreparationTitration.steps.map((step, index) => {
                  const isWeighing = step.name === "Weighing";
                  const isTablet = step.name === "Tablet Details";
                  const is1stDilution = step.name === "1st Dilution";
                  const isEPD = step.name === "End Point Determination";
                  const isDisso = type === "disso";

                  console.log("is Disso ?", isDisso, type);

                  if (isWeighing && isDisso) return null;
                  if (isTablet && !isDisso) return null;

                  return (
                    <motion.div
                      key={step.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="group/item relative"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/0 via-emerald-400/5 to-emerald-400/0 rounded-xl opacity-0 group-hover/item:opacity-100 transition-opacity" />

                      <div className="relative bg-white rounded-xl border border-emerald-200/60 shadow-sm hover:shadow-md hover:border-emerald-300 transition-all duration-200 p-4">
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 w-7 h-7 bg-gradient-to-br from-emerald-500 to-emerald-500 rounded-full flex items-center justify-center shadow-md">
                            <span className="text-white text-xs font-bold">
                              {isDisso ? index : index + 1}
                            </span>
                          </div>

                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-3">
                              <div className="font-bold text-emerald-900 text-sm">
                                {step.name}
                              </div>
                              <div className="h-px flex-1 bg-gradient-to-r from-emerald-200 to-transparent" />
                            </div>

                            {isWeighing && !isDisso && (
                              <div className="flex flex-wrap items-center gap-2 text-xs">
                                <span className="text-gray-600 font-medium">Weigh accurately</span>
                                <input
                                  type="number"
                                  min="0"
                                  step="0.01"
                                  inputMode="decimal"
                                  value={step.value1 || ""}
                                  onChange={(e) => onStepChange(samplePreparationTitration.id, step.name, "value1", e.target.value)}
                                  onKeyDown={(e) => { if (e.key === "ArrowUp" || e.key === "ArrowDown") e.preventDefault(); }}
                                  onWheel={(e) => e.currentTarget.blur()}
                                  placeholder="Enter Weight"
                                  className="w-30 px-2.5 py-1.5 border border-emerald-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all"
                                />
                                <CustomDropdown
                                  options={weightUnitOptions}
                                  value={step.unit1}
                                  onChange={(newUnit) => onStepChange(samplePreparationTitration.id, step.name, "unit1", newUnit)}
                                  placeholder="Unit"
                                  colorScheme="emerald"
                                />
                                <span className="text-gray-600 font-medium">of</span>
                                <input
                                  type="text"
                                  value={step.solventChemical || ""}
                                  onChange={(e) => onStepChange(samplePreparationTitration.id, step.name, "solventChemical", e.target.value)}
                                  onKeyDown={(e) => { if (e.key === "ArrowUp" || e.key === "ArrowDown") e.preventDefault(); }}
                                  onWheel={(e) => e.currentTarget.blur()}
                                  placeholder="Sample"
                                  className="flex-1 min-w-[120px] px-2.5 py-1.5 border border-emerald-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-all"
                                />
                                <span className="text-gray-500 text-xs">(Log ID:</span>
                                <input
                                  type="text"
                                  value={step.logBookID || ""}
                                  onChange={(e) => onStepChange(samplePreparationTitration.id, step.name, "logBookID", e.target.value)}
                                  onKeyDown={(e) => { if (e.key === "ArrowUp" || e.key === "ArrowDown") e.preventDefault(); }}
                                  onWheel={(e) => e.currentTarget.blur()}
                                  placeholder="Enter ID"
                                  className="w-24 px-2.5 py-1.5 border border-emerald-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-all"
                                />
                                <span className="text-gray-500 text-xs">)</span>
                              </div>
                            )}

                            {isTablet && isDisso && (
                              <div className="space-y-2">
                                <div className="flex flex-wrap items-center gap-2 text-xs">
                                  <span className="text-gray-600 font-medium">
                                    Claim
                                  </span>
                                  <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    inputMode="decimal"
                                    value={step.value1 || ""}
                                    onChange={(e) =>
                                      onStepChange(
                                        samplePreparationTitration.id,
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
                                          samplePreparationTitration.id,
                                          step.name,
                                          "unit1",
                                          newUnit
                                        )
                                      }
                                      placeholder="Unit"
                                      colorScheme="emerald"
                                    />
                                  </div>

                                  <span className="text-gray-600 ml-2 font-medium">
                                    Media Volume
                                  </span>
                                  <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    inputMode="decimal"
                                    value={step.value2 || ""}
                                    onChange={(e) =>
                                      onStepChange(
                                        samplePreparationTitration.id,
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
                                    className="flex-1 min-w-[100px] px-2.5 py-1.5 border border-emerald-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-all"
                                  />
                                  <div className="w-20">
                                    <CustomDropdown
                                      options={volumeUnitOptions}
                                      value={step.unit2 || "ml"}
                                      onChange={(newUnit) =>
                                        onStepChange(
                                          samplePreparationTitration.id,
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
                                     Sampling Time
                                  </span>
                                  <input
                                    type="number"
                                    min="0"
                                    step="1"
                                    inputMode="decimal"
                                    value={step.value3 || ""}
                                    onChange={(e) =>
                                      onStepChange(
                                        samplePreparationTitration.id,
                                        step.name,
                                        "value3",
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
                                    placeholder="Enter Time"
                                    className="w-24 px-2.5 py-1.5 border border-emerald-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-all"
                                  />
                                  <div className="w-20">
                                    <CustomDropdown
                                      options={timeUnitOptions}
                                      value={step.unit3 || "min"}
                                      onChange={(newUnit) =>
                                        onStepChange(
                                          samplePreparationTitration.id,
                                          step.name,
                                          "unit3",
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

                            {/* ── 1st Dilution: Assay mode ── */}
                            {is1stDilution && !isDisso && (
                              <div className="flex flex-wrap items-center gap-2 text-xs">
                                <span className="text-gray-600 font-medium">Diluted to</span>
                                <input
                                  type="number"
                                  min="0"
                                  step="0.01"
                                  inputMode="decimal"
                                  value={step.value1 || ""}
                                  onChange={(e) => onStepChange(samplePreparationTitration.id, step.name, "value1", e.target.value)}
                                  onKeyDown={(e) => { if (e.key === "ArrowUp" || e.key === "ArrowDown") e.preventDefault(); }}
                                  onWheel={(e) => e.currentTarget.blur()}
                                  placeholder="Enter Volume"
                                  className="w-30 px-2.5 py-1.5 border border-emerald-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-all"
                                />
                                <CustomDropdown
                                  options={volumeUnitOptions}
                                  value={step.unit1 || "ml"}
                                  onChange={(newUnit) => onStepChange(samplePreparationTitration.id, step.name, "unit1", newUnit)}
                                  placeholder="Unit"
                                  colorScheme="emerald"
                                />
                                <span className="text-gray-600 font-medium">with diluent</span>
                              </div>
                            )}

                            {/* ── 1st Dilution: Disso mode → Take ___ of disso solution ── */}
                            {is1stDilution && isDisso && (
                              <div className="flex flex-wrap items-center gap-2 text-xs">
                                <span className="text-gray-600 font-medium">Take</span>
                                <input
                                  type="number"
                                  min="0"
                                  step="0.01"
                                  inputMode="decimal"
                                  value={step.value1 || ""}
                                  onChange={(e) => onStepChange(samplePreparationTitration.id, step.name, "value1", e.target.value)}
                                  onKeyDown={(e) => { if (e.key === "ArrowUp" || e.key === "ArrowDown") e.preventDefault(); }}
                                  onWheel={(e) => e.currentTarget.blur()}
                                  placeholder="Enter Volume"
                                  className="w-30 px-2.5 py-1.5 border border-emerald-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-all"
                                />
                                <CustomDropdown
                                  options={volumeUnitOptions}
                                  value={step.unit1 || "ml"}
                                  onChange={(newUnit) => onStepChange(samplePreparationTitration.id, step.name, "unit1", newUnit)}
                                  placeholder="Unit"
                                  colorScheme="emerald"
                                />
                                <span className="text-gray-600 font-medium">of Disso Solution</span>
                              </div>
                            )}

                            {isEPD && (
                              <div className="flex flex-wrap items-center gap-2 text-xs">
                                <span className="text-gray-600 font-medium">Titration Value</span>
                                <input
                                  type="number"
                                  min="0"
                                  step="0.01"
                                  inputMode="decimal"
                                  value={step.value1 || ""}
                                  onChange={(e) => onStepChange(samplePreparationTitration.id, step.name, "value1", e.target.value)}
                                  onKeyDown={(e) => { if (e.key === "ArrowUp" || e.key === "ArrowDown") e.preventDefault(); }}
                                  onWheel={(e) => e.currentTarget.blur()}
                                  placeholder="Enter Value"
                                  className="w-30 px-2.5 py-1.5 border border-emerald-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-all"
                                />
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

export default SamplePreparationTitrationDetail;