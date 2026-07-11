import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, FlaskConical, Trash } from "lucide-react";
import type { StandardPreparationHypromellose } from "../../../preparation_models/drugs/Standardpreparationhypromellose.ts";
import type { StandardPreparationHypromelloseStep } from "../../../preparation_models/drugs/Standardpreparationhypromellosestep.ts";
import CustomDropdown from "../../shared/CustomDropdown";
import type { Standard } from "../../../preparation_models/Standard";

const weightUnitOptions = [
  { value: "mg", label: "mg" },
  { value: "g", label: "g" },
];

const volumeUnitOptions = [
  { value: "ml", label: "ml" },
  { value: "µl", label: "µl" },
];

interface StandardPreparationHypromelloseDetailProps {
  standardPreparation: StandardPreparationHypromellose;
  assignedStandards: Standard[];
  onStepChange: (
    standardPreparationId: number,
    stepName: StandardPreparationHypromelloseStep["name"],
    field: "value1" | "unit1" | "value2" | "unit2" | "logBookID" | "solventChemical",
    newValue: string
  ) => void;
  onRemove: () => void;
  role: string;
}

const StandardPreparationHypromelloseDetail: React.FC<
  StandardPreparationHypromelloseDetailProps
> = ({ standardPreparation, assignedStandards, onStepChange, onRemove, role }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="relative group z-20"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-700/20 to-slate-900/20 rounded-lg blur-xl group-hover:blur-xl transition-all duration-300" />

      <div className="relative bg-white/95 backdrop-blur-sm rounded-lg border border-slate-700/40 transition-all duration-300 mb-4">
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
                  <FlaskConical className="w-5 h-5 text-white" />
                </div>
              </motion.div>

              <div>
                <h4 className="text-sm font-semibold text-white tracking-wide">
                  {standardPreparation.label}
                </h4>
                <p className="text-xs text-emerald-100">
                  Hypromellose Assay - Standard Solution
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
                title={`Remove ${standardPreparation.label}`}
              >
                <Trash className="w-4 h-4 text-white" />
              </motion.button>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <div className="p-5 space-y-3 bg-gradient-to-br from-emerald-50/50 to-slate-50/30">
                {assignedStandards.length > 0 && (
                  <div className="mb-2 px-3 py-2 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 space-y-0.5">
                    <span className="font-semibold">
                      Assigned Standard{assignedStandards.length > 1 ? "s" : ""}:
                    </span>
                    {assignedStandards.map((std) => (
                      <div key={std.serialNo}>
                        {std.name} (Batch: {std.batchNo || "N/A"})
                      </div>
                    ))}
                  </div>
                )}

                {standardPreparation.steps
                  .filter((step) => step.name !== "Weighing (Vial + Contents)")
                  .map((step, index) => {
                  const isWeighingAdipic = step.name === "Weighing (Adipic Acid)";
                  const isHydriodicAcid = step.name === "Hydriodic Acid";
                  const isInternalStandard = step.name === "Internal Standard Solution";
                  const isIsopropylIodide =
                    step.name === "Isopropyl Iodide - in Weight" ||
                    step.name === "Isopropyl Iodide - By Difference" ||
                    step.name === "Weight of Isopropyl Iodide";
                  const isMethylIodide =
                    step.name === "Methyl Iodide - in Weight" ||
                    step.name === "Methyl Iodide - By Difference" ||
                    step.name === "Weight of Methyl Iodide";
                  const isByDifference = isIsopropylIodide || isMethylIodide;
                  const displayName = isIsopropylIodide
                    ? "Weight of Isopropyl Iodide"
                    : isMethylIodide
                    ? "Weight of Methyl Iodide"
                    : step.name;

                  return (
                    <motion.div
                      key={step.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="group/item relative"
                    >
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
                                {displayName}
                              </div>
                              <div className="h-px flex-1 bg-gradient-to-r from-slate-300 to-transparent" />
                            </div>

                            {(isWeighingAdipic || isHydriodicAcid || isInternalStandard) && (
                              <div className="flex flex-wrap items-center gap-2 text-xs">
                                <span className="text-gray-600 font-medium">
                                  {isWeighingAdipic
                                    ? "Weigh"
                                    : isHydriodicAcid
                                    ? "Add Hydriodic Acid"
                                    : "Add Internal Standard Solution"}
                                </span>
                                <input
                                  type="number"
                                  min="0"
                                  step="0.01"
                                  value={step.value1 || ""}
                                  onChange={(e) =>
                                    onStepChange(
                                      standardPreparation.id,
                                      step.name,
                                      "value1",
                                      e.target.value
                                    )
                                  }
                                  onWheel={(e) => e.currentTarget.blur()}
                                  placeholder="Enter value"
                                  className="w-24 px-2.5 py-1.5 border border-emerald-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-emerald-400"
                                />
                                <div className="w-20">
                                  <CustomDropdown
                                    options={isWeighingAdipic ? weightUnitOptions : volumeUnitOptions}
                                    value={step.unit1 || (isWeighingAdipic ? "mg" : "ml")}
                                    onChange={(newUnit) =>
                                      onStepChange(
                                        standardPreparation.id,
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
                            )}

                            {isByDifference && (
                              <div className="flex flex-wrap items-center gap-2 text-xs">
                                <span className="text-gray-600 font-medium">
                                  Weight
                                </span>
                                <input
                                  type="number"
                                  min="0"
                                  step="0.01"
                                  value={step.value1 || ""}
                                  onChange={(e) =>
                                    onStepChange(
                                      standardPreparation.id,
                                      step.name,
                                      "value1",
                                      e.target.value
                                    )
                                  }
                                  onWheel={(e) => e.currentTarget.blur()}
                                  placeholder="Enter weight"
                                  className="w-24 px-2.5 py-1.5 border border-emerald-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-emerald-400"
                                />
                                <div className="w-20">
                                  <CustomDropdown
                                    options={weightUnitOptions}
                                    value={step.unit1 || "mg"}
                                    onChange={(newUnit) =>
                                      onStepChange(
                                        standardPreparation.id,
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

export default StandardPreparationHypromelloseDetail;