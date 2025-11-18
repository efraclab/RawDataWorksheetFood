import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Droplets, Trash } from "lucide-react";
import type { StandardPreparation } from "../../models/StandardPreparation";
import type { StandardPreparationStep } from "../../models/StandardPreparationStep";
import type { Standard } from "../../models/Standard";
import CustomDropdown from "../shared/CustomDropdown";

const weightUnitOptions = [
  { value: "g", label: "g" },
  { value: "mg", label: "mg" },
  { value: "kg", label: "kg" },
];

const filtrationUnitOptions = [
  { value: "micron", label: "micron" },
  { value: "µm", label: "µm" },
  { value: "mm", label: "mm" },
];

const volumeUnitOptions = [
  { value: "ml", label: "ml" },
  { value: "L", label: "L" },
  { value: "µL", label: "µL" },
];

interface StandardPreparationDetailProps {
  standardPreparation: StandardPreparation;
  assignedStandard: Standard | null;
  onStepChange: (
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
  ) => void;
  onRemove: () => void;
}

const StandardPreparationDetail: React.FC<StandardPreparationDetailProps> = ({
  standardPreparation,
  assignedStandard,
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
                  {`${standardPreparation.label} (${assignedStandard?.name})`}
                </h4>
                <p className="text-xs text-purple-100">
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
                            <span className="text-white text-xs font-bold">
                              {index + 1}
                            </span>
                          </div>

                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-3">
                              <div className="font-bold text-purple-900 text-sm">
                                {step.name}
                              </div>
                              <div className="h-px flex-1 bg-gradient-to-r from-purple-200 to-transparent" />
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
                                    placeholder="Enter Weight"
                                    className="w-30 px-2.5 py-1.5 border border-purple-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all"
                                  />
                                  <div className="w-20">
                                    <CustomDropdown
                                      options={weightUnitOptions}
                                      value={step.unit}
                                      onChange={(newUnit) =>
                                        onStepChange(
                                          standardPreparation.id,
                                          step.name,
                                          "unit",
                                          newUnit
                                        )
                                      }
                                      placeholder="Unit"
                                      colorScheme="purple"
                                    />
                                  </div>
                                  <span className="text-gray-600 font-medium">
                                    of
                                  </span>
                                  
                                  {/* Display assigned standard name (read-only) */}
                                  {assignedStandard ? (
                                    <div className="flex-1 min-w-[150px] px-3 py-2 bg-purple-50 border border-purple-300 rounded-lg text-xs font-semibold text-purple-900">
                                      {assignedStandard.name}
                                    </div>
                                  ) : (
                                    <div className="flex-1 min-w-[150px] px-3 py-2 bg-red-50 border border-red-300 rounded-lg text-xs font-medium text-red-600">
                                      No standard assigned
                                    </div>
                                  )}
                                </div>

                                {/* Log Book ID Input */}
                                {assignedStandard && (
                                  <div className="flex items-center gap-2 text-xs">
                                    <span className="text-gray-600 font-medium">
                                      Log Book ID:
                                    </span>
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
                                      placeholder="Enter Log Book ID"
                                      className="flex-1 px-2.5 py-1.5 border border-purple-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all"
                                    />
                                  </div>
                                )}

                                {/* Show selected standard details */}
                                {assignedStandard && (
                                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-2.5 text-xs">
                                    <div className="font-semibold text-purple-900 mb-1.5">
                                      Selected Standard Details:
                                    </div>
                                    <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-gray-700">
                                      <div>
                                        <span className="font-medium">Name:</span>{" "}
                                        {assignedStandard.name}
                                      </div>
                                      <div>
                                        <span className="font-medium">Purity:</span>{" "}
                                        {assignedStandard.purity}
                                      </div>
                                      <div>
                                        <span className="font-medium">Make:</span>{" "}
                                        {assignedStandard.make}
                                      </div>
                                      <div>
                                        <span className="font-medium">Batch:</span>{" "}
                                        {assignedStandard.batchNo}
                                      </div>
                                    </div>
                                  </div>
                                )}
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
                                    value={step.vol1 || ""}
                                    onChange={(e) =>
                                      onStepChange(
                                        standardPreparation.id,
                                        step.name,
                                        "vol1",
                                        e.target.value
                                      )
                                    }
                                    placeholder="Enter Volume"
                                    className="w-30 px-2.5 py-1.5 border border-purple-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all"
                                  />
                                  <div className="w-20">
                                    <CustomDropdown
                                      options={volumeUnitOptions}
                                      value={step.unit1 || "ml"}
                                      onChange={(newUnit) =>
                                        onStepChange(
                                          standardPreparation.id,
                                          step.name,
                                          "unit1",
                                          newUnit
                                        )
                                      }
                                      placeholder="Unit"
                                      colorScheme="purple"
                                    />
                                  </div>
                                  <span className="text-gray-600 font-medium">
                                    with diluent
                                  </span>
                                </div>
                              </div>
                            )}

                            {(is2ndDilution ||
                              is3rdDilution ||
                              is4thDilution) && (
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
                                    value={step.vol1 || ""}
                                    onChange={(e) =>
                                      onStepChange(
                                        standardPreparation.id,
                                        step.name,
                                        "vol1",
                                        e.target.value
                                      )
                                    }
                                    placeholder="Enter Volume"
                                    className="w-30 px-2.5 py-1.5 border border-purple-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all"
                                  />
                                  <div className="w-20">
                                    <CustomDropdown
                                      options={volumeUnitOptions}
                                      value={step.unit1 || "ml"}
                                      onChange={(newUnit) =>
                                        onStepChange(
                                          standardPreparation.id,
                                          step.name,
                                          "unit1",
                                          newUnit
                                        )
                                      }
                                      placeholder="Unit"
                                      colorScheme="purple"
                                    />
                                  </div>
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
                                    min="0"
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
                                    placeholder="Enter Volume"
                                    className="w-30 px-2.5 py-1.5 border border-purple-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all"
                                  />
                                  <div className="w-20">
                                    <CustomDropdown
                                      options={volumeUnitOptions}
                                      value={step.unit2 || "ml"}
                                      onChange={(newUnit) =>
                                        onStepChange(
                                          standardPreparation.id,
                                          step.name,
                                          "unit2",
                                          newUnit
                                        )
                                      }
                                      placeholder="Unit"
                                      colorScheme="purple"
                                    />
                                  </div>
                                  <span className="text-gray-600 font-medium">
                                      with diluent
                                    </span>
                                </div>
                              </div>
                            )}

                            {isFiltration && (
                              <div className="flex flex-wrap items-center gap-2 text-xs">
                                <span className="text-gray-600 font-medium">
                                  Filter from
                                </span>
                                <input
                                  type="number"
                                  min="0"
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
                                  placeholder="Enter Size"
                                  className="w-30 px-2.5 py-1.5 border border-purple-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all"
                                />
                                <div className="w-24">
                                  <CustomDropdown
                                    options={filtrationUnitOptions}
                                    value={step.unit}
                                    onChange={(newUnit) =>
                                      onStepChange(
                                        standardPreparation.id,
                                        step.name,
                                        "unit",
                                        newUnit
                                      )
                                    }
                                    placeholder="Unit"
                                    colorScheme="purple"
                                  />
                                </div>
                                <span className="text-gray-600 font-medium">
                                  filter
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

export default StandardPreparationDetail;