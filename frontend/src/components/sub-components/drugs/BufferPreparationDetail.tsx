import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Target, Trash } from "lucide-react";
import CustomDropdown from "../../shared/CustomDropdown";
import type { BufferPreparation } from "../../../preparation_models/drugs/BufferPreparation";
import type { BufferPreparationStep } from "../../../preparation_models/drugs/BufferPreparationStep";


const weightVolUnitOptions = [
  { value: "mg", label: "mg" },
  { value: "g", label: "g" },
  { value: "kg", label: "kg" },
  { value: "ml", label: "ml" },
  { value: "L", label: "L" },
  { value: "µL", label: "µL" },
];

  
interface BufferPreparationDetailProps {
  buffer: BufferPreparation;
  isLocked : boolean,
  onStepChange: (
    bufferId: number,
    stepName: BufferPreparationStep["name"],
    field:
      | "value1"
      | "logBookID"
      | "unit1"
      | "solventChemical",
    newValue: string,
  ) => void;
  onRemove: () => void;
}

const BufferPreparationDetail: React.FC<
  BufferPreparationDetailProps
> = ({ buffer,isLocked, onStepChange, onRemove }) => {
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
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-700/20 to-slate-900/20 rounded-xl blur-xl group-hover:blur-xl transition-all duration-300" />

      <div className="relative bg-white/95 backdrop-blur-sm rounded-lg border border-slate-700/40 transition-all duration-300 mb-4">
        {/* Elegant Header */}
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
                  <Target className="w-5 h-5 text-white" />
                </div>
              </motion.div>

              <div>
                <h4 className="text-sm font-semibold text-white tracking-wide">
                  {buffer.label}
                </h4>
                <p className="text-xs text-emerald-100">
                  Buffer Phase Preparation Details
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
                disabled={isLocked}
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove();
                }}
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 bg-white/20 rounded-lg transition-all duration-200 border border-white/30"
                title={`Remove ${buffer.label}`}
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
                {buffer.steps.map((step, index) => {
                  const isWeighing = step.name === "Weighing/Measuring";
                  const isPH = step.name === "PH";

                  return (
                    <motion.div
                      key={step.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="group/item relative"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/0 via-emerald-400/5 to-slate-400/0 rounded-xl opacity-0 group-hover/item:opacity-100 transition-opacity" />

                      <div className="relative bg-white rounded-xl border border-slate-200/60 shadow-sm hover:shadow-md hover:border-emerald-300 transition-all duration-200 p-4">
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 w-7 h-7 bg-gradient-to-br from-emerald-700 to-slate-800 rounded-full flex items-center justify-center shadow-md">
                            <span className="text-white text-xs font-bold">
                              {index + 1}
                            </span>
                          </div>

                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-3">
                              <div className="font-bold text-slate-900 text-sm">
                                {step.name === "Weighing/Measuring" ? "Weighing / Measuring" : step.name}
                              </div>
                              <div className="h-px flex-1 bg-gradient-to-r from-slate-300 to-transparent" />
                            </div>

                            {isWeighing && (
                              <div className="space-y-2">
                                <div className="flex flex-wrap items-center gap-2 text-xs">
                                  <span className="text-gray-600 font-medium">
                                   {["ml", "L", "µL"].includes(step.unit1!) ? "Measure accurately" : "Weigh accurately"}
                                  </span>
                                  <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    inputMode="decimal"
                                    value={step.value1}
                                    onChange={(e) =>
                                      onStepChange(
                                        buffer.id,
                                        step.name,
                                        "value1",
                                        e.target.value,
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
                                    className="w-30 px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                                  />
                                  <CustomDropdown
                                    options={weightVolUnitOptions}
                                    value={step.unit1}
                                    onChange={(newValue) =>
                                      onStepChange(
                                        buffer.id,
                                        step.name,
                                        "unit1",
                                        newValue,
                                      )
                                    }
                                    placeholder="Unit"
                                    colorScheme="emerald"
                                  />
                                  <span className="text-gray-600 font-medium">
                                    of
                                  </span>
                                  <input
                                    type="text"
                                    value={step.solventChemical || ""}
                                    onChange={(e) =>
                                      onStepChange(
                                        buffer.id,
                                        step.name,
                                        "solventChemical",
                                        e.target.value,
                                      )
                                    }
                                    placeholder="Solvent/Chemical"
                                    className="flex-1 min-w-[110px] px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                                  />
                                  <span className="text-gray-500 text-xs">
                                    (Log ID:
                                  </span>
                                  <input
                                    type="text"
                                    value={step.logBookID}
                                    onChange={(e) =>
                                      onStepChange(
                                        buffer.id,
                                        step.name,
                                        "logBookID",
                                        e.target.value,
                                      )
                                    }
                                    placeholder="Enter ID"
                                    className="w-28 px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                                  />
                                  <span className="text-gray-500 text-xs">
                                    )
                                  </span>
                                </div>
                              </div>
                            )}

                            {isPH && (
                              <div className="space-y-2">
                                <div className="flex flex-wrap items-center gap-2 text-xs">
                                  <span className="text-gray-600 font-medium">
                                    Adjust pH to
                                  </span>
                                  <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    inputMode="decimal"
                                    value={step.value1}
                                    onChange={(e) =>
                                      onStepChange(
                                        buffer.id,
                                        step.name,
                                        "value1",
                                        e.target.value,
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
                                    placeholder="Enter pH value"
                                    className="w-40 px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                                  />
                                  <span className="text-gray-500 text-xs">
                                    (Log ID:
                                  </span>
                                  <input
                                    type="text"
                                    value={step.logBookID}
                                    onChange={(e) =>
                                      onStepChange(
                                        buffer.id,
                                        step.name,
                                        "logBookID",
                                        e.target.value,
                                      )
                                    }
                                    placeholder="Enter ID"
                                    className="flex-1 px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                                  />
                                  <span className="text-gray-500 text-xs">
                                    )
                                  </span>
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

export default BufferPreparationDetail;