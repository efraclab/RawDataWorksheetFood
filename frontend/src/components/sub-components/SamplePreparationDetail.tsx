import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Droplets, Trash } from "lucide-react";
import type { SamplePreparation } from "../../models/SamplePreparation";
import type { SamplePreparationStep } from "../../models/SamplePreparationStep";
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

interface SamplePreparationDetailProps {
  samplePreparation: SamplePreparation;
  assignedStandard: Standard | null;
  onStepChange: (
    samplePreparationId: number,
    stepName: SamplePreparationStep["name"],
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
  isRS?: boolean;
}

const SamplePreparationDetail: React.FC<SamplePreparationDetailProps> = ({
  samplePreparation,
  assignedStandard,
  onStepChange,
  onRemove,
  isRS = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const headerRoundingClass = isExpanded ? "rounded-t-lg" : "rounded-lg";

  const filteredSteps = isRS
    ? samplePreparation.steps.filter((step) => 
        step.name === "Weighing" || 
        step.name === "1st Dilution" || 
        step.name === "Filtration"
      )
    : samplePreparation.steps;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="relative group z-20"
    >
      {/* Glow effect */}
      <div className={`absolute inset-0 bg-gradient-to-r ${isRS ? 'from-indigo-400/20 to-blue-400/20' : 'from-red-400/20 to-rose-400/20'} rounded-xl blur-xl group-hover:blur-xl transition-all duration-300`} />

      <div className={`relative bg-white/95 backdrop-blur-sm rounded-lg border ${isRS ? 'border-indigo-200/50' : 'border-red-200/50'} transition-all duration-300 mb-4`}>
        <div className={`relative bg-gradient-to-r ${isRS ? 'from-indigo-600 via-indigo-500 to-blue-500' : 'from-red-600 via-red-500 to-rose-500'} ${headerRoundingClass}`}>
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
                  {`${samplePreparation.label} ${assignedStandard ? `(${assignedStandard.name})` : ''}`}
                </h4>
                <p className={`text-xs ${isRS ? 'text-indigo-100' : 'text-red-100'}`}>
                  Sample Preparation Details {isRS ? '(RS)' : ''}
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
              <div className={`p-5 space-y-3 bg-gradient-to-br ${isRS ? 'from-indigo-50/50 to-blue-50/30' : 'from-red-50/50 to-rose-50/30'}`}>
                {filteredSteps.map((step, index) => {
                  const isWeighing = step.name === "Weighing";
                  const is1stDilution = step.name === "1st Dilution";
                  const is2ndDilution = step.name === "2nd Dilution";
                  const is3rdDilution = step.name === "3rd Dilution";
                  const is4thDilution = step.name === "4th Dilution";
                  const isFiltration = step.name === "Filtration";

                  const colorScheme = isRS ? 'indigo' : 'red';
                  const gradientFrom = isRS ? 'from-indigo-500' : 'from-red-500';
                  const gradientTo = isRS ? 'to-blue-500' : 'to-rose-500';
                  const borderColor = isRS ? 'border-indigo-200/60' : 'border-red-200/60';
                  const hoverBorderColor = isRS ? 'hover:border-indigo-300' : 'hover:border-red-300';
                  const textColor = isRS ? 'text-indigo-900' : 'text-red-900';
                  const bgColor = isRS ? 'bg-indigo-50' : 'bg-red-50';
                  const inputBorderColor = isRS ? 'border-indigo-300' : 'border-red-300';
                  const focusRingColor = isRS ? 'focus:ring-indigo-400' : 'focus:ring-red-400';

                  return (
                    <motion.div
                      key={step.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="group/item relative"
                    >
                      <div className={`absolute inset-0 bg-gradient-to-r ${isRS ? 'from-indigo-400/0 via-indigo-400/5 to-indigo-400/0' : 'from-red-400/0 via-red-400/5 to-red-400/0'} rounded-xl opacity-0 group-hover/item:opacity-100 transition-opacity`} />

                      <div className={`relative bg-white rounded-xl border ${borderColor} ${hoverBorderColor} transition-all duration-200 p-4`}>
                        <div className="flex items-start gap-3">
                          <div className={`flex-shrink-0 w-7 h-7 bg-gradient-to-br ${gradientFrom} ${gradientTo} rounded-full flex items-center justify-center shadow-md`}>
                            <span className="text-white text-xs font-bold">
                              {index + 1}
                            </span>
                          </div>

                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-3">
                              <div className={`font-bold ${textColor} text-sm`}>
                                {step.name}
                              </div>
                              <div className={`h-px flex-1 bg-gradient-to-r ${isRS ? 'from-indigo-200' : 'from-red-200'} to-transparent`} />
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
                                        samplePreparation.id,
                                        step.name,
                                        "value",
                                        e.target.value
                                      )
                                    }
                                    placeholder="Enter Weight"
                                    className={`w-30 px-2.5 py-1.5 border ${inputBorderColor} rounded-lg text-xs focus:outline-none focus:ring-2 ${focusRingColor} focus:border-transparent transition-all`}
                                  />
                                  <div className="w-20">
                                    <CustomDropdown
                                      options={weightUnitOptions}
                                      value={step.unit}
                                      onChange={(newUnit) =>
                                        onStepChange(
                                          samplePreparation.id,
                                          step.name,
                                          "unit",
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
                                  
                                  {/* Display assigned standard name (read-only) or allow manual input */}
                                  {assignedStandard ? (
                                    <div className={`flex-1 min-w-[150px] px-3 py-2 ${bgColor} border ${inputBorderColor} rounded-lg text-xs font-semibold ${textColor}`}>
                                      {assignedStandard.name}
                                    </div>
                                  ) : (
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
                                      className={`flex-1 min-w-[120px] px-2.5 py-1.5 border ${inputBorderColor} rounded-lg text-xs focus:outline-none focus:ring-2 ${focusRingColor} transition-all`}
                                    />
                                  )}
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
                                    value={step.vol1 || ""}
                                    onChange={(e) =>
                                      onStepChange(
                                        samplePreparation.id,
                                        step.name,
                                        "vol1",
                                        e.target.value
                                      )
                                    }
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
                                        samplePreparation.id,
                                        step.name,
                                        "vol1",
                                        e.target.value
                                      )
                                    }
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
                                        samplePreparation.id,
                                        step.name,
                                        "vol2",
                                        e.target.value
                                      )
                                    }
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
                                    with diluent
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
                                  value={step.value || ""}
                                  onChange={(e) =>
                                    onStepChange(
                                      samplePreparation.id,
                                      step.name,
                                      "value",
                                      e.target.value
                                    )
                                  }
                                  placeholder="Enter Size"
                                  className={`w-30 px-2.5 py-1.5 border ${inputBorderColor} rounded-lg text-xs focus:outline-none focus:ring-2 ${focusRingColor} transition-all`}
                                />
                                <div className="w-30">
                                  <CustomDropdown
                                    options={filtrationUnitOptions}
                                    value={step.unit}
                                    onChange={(newUnit) =>
                                      onStepChange(
                                        samplePreparation.id,
                                        step.name,
                                        "unit",
                                        newUnit
                                      )
                                    }
                                    placeholder="Unit"
                                    colorScheme={colorScheme}
                                  />
                                </div>
                                <span className="text-gray-600 font-medium">
                                  syringe filter
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

export default SamplePreparationDetail;