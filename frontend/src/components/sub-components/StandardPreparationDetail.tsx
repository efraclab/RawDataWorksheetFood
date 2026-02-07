import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Droplets, Trash } from "lucide-react";
import type { StandardPreparation } from "../../preparation_models/StandardPreparation";
import type { StandardPreparationStep } from "../../preparation_models/StandardPreparationStep";
import type { Standard } from "../../preparation_models/Standard";
import CustomDropdown from "../shared/CustomDropdown";

const weightUnitOptions = [
  { value: "mg", label: "mg" },
  { value: "g", label: "g" },
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
      | "value1"
      | "unit1"
      | "value2"
      | "unit2"
      | "logBookID"
      | "solventChemical",
    newValue: string
  ) => void;
  onRemove: () => void;
  isRS?: boolean;
  isDisso?: boolean;
  role: string;
}

const StandardPreparationDetail: React.FC<StandardPreparationDetailProps> = ({
  standardPreparation,
  assignedStandard,
  onStepChange,
  onRemove,
  isRS = false,
  isDisso = false,
  role,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const headerRoundingClass = isExpanded ? "rounded-t-lg" : "rounded-lg";

  // Ensure steps is an array and filter based on isRS flag
  const stepsArray: StandardPreparationStep[] = Array.isArray(
    standardPreparation?.steps
  )
    ? standardPreparation.steps
    : [];

  const filteredSteps: StandardPreparationStep[] = isRS
    ? stepsArray.filter((step) => step.name !== "4th Dilution")
    : stepsArray;

  // Determine color scheme based on props
  const getColorScheme = () => {
    if (isDisso) {
      return {
        glowGradient: "from-emerald-400/20 to-emerald-400/20",
        borderColor: "border-emerald-200/50",
        headerGradient: "from-emerald-600 via-emerald-500 to-emerald-500",
        textColor: "text-emerald-100",
        bgGradient: "from-emerald-50/50 to-emerald-50/30",
        colorScheme: "emerald" as const,
        stepGradient: "from-emerald-400/0 via-emerald-400/5 to-emerald-400/0",
        stepBorder: "border-emerald-200/60",
        stepHoverBorder: "hover:border-emerald-300",
        stepText: "text-emerald-900",
        stepBg: "bg-emerald-50",
        inputBorder: "border-emerald-300",
        focusRing: "focus:ring-emerald-400",
        numberGradient: "from-emerald-500 to-emerald-500",
        lineGradient: "from-emerald-200",
        detailBorder: "border-emerald-200",
        label: "(Disso)",
      };
    } else if (isRS) {
      return {
        glowGradient: "from-emerald-400/20 to-emerald-400/20",
        borderColor: "border-emerald-200/50",
        headerGradient: "from-emerald-600 via-emerald-500 to-emerald-500",
        textColor: "text-emerald-100",
        bgGradient: "from-emerald-50/50 to-emerald-50/30",
        colorScheme: "indigo" as const,
        stepGradient: "from-emerald-400/0 via-emerald-400/5 to-emerald-400/0",
        stepBorder: "border-emerald-200/60",
        stepHoverBorder: "hover:border-emerald-300",
        stepText: "text-emerald-900",
        stepBg: "bg-emerald-50",
        inputBorder: "border-emerald-300",
        focusRing: "focus:ring-emerald-400",
        numberGradient: "from-emerald-500 to-emerald-500",
        lineGradient: "from-emerald-200",
        detailBorder: "border-emerald-200",
        label: "(RS)",
      };
    } else {
      return {
        glowGradient: "from-emerald-400/20 to-emerald-400/20",
        borderColor: "border-emerald-200/50",
        headerGradient: "from-emerald-600 via-emerald-500 to-emerald-500",
        textColor: "text-emerald-100",
        bgGradient: "from-emerald-50/50 to-emerald-50/30",
        colorScheme: "red" as const,
        stepGradient: "from-emerald-400/0 via-emerald-400/5 to-emerald-400/0",
        stepBorder: "border-emerald-200/60",
        stepHoverBorder: "hover:border-emerald-300",
        stepText: "text-emerald-900",
        stepBg: "bg-emerald-50",
        inputBorder: "border-emerald-300",
        focusRing: "focus:ring-emerald-400",
        numberGradient: "from-emerald-500 to-emerald-500",
        lineGradient: "from-emerald-200",
        detailBorder: "border-emerald-200",
        label: "",
      };
    }
  };

  const colors = getColorScheme();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="relative group z-20"
    >
      {/* Glow effect */}
      <div
        className={`absolute inset-0 bg-gradient-to-r ${colors.glowGradient} rounded-lg blur-xl group-hover:blur-xl transition-all duration-300`}
      />

      <div
        className={`relative bg-white/95 backdrop-blur-sm rounded-lg border ${colors.borderColor} transition-all duration-300 mb-4`}
      >
        {/* Elegant Header */}
        <div
          className={`relative bg-gradient-to-r ${
            colors.headerGradient
          } ${headerRoundingClass} ${
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
                  <Droplets className="w-5 h-5 text-white" />
                </div>
              </motion.div>

              <div>
                <h4 className="text-sm font-semibold text-white tracking-wide">
                  {`${standardPreparation.label}`}
                </h4>
                <p className={`text-xs ${colors.textColor}`}>
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
            >
              <div
                className={`p-5 space-y-3 bg-gradient-to-br ${colors.bgGradient}`}
              >
                {filteredSteps.map((step, index) => {
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
                      <div
                        className={`absolute inset-0 bg-gradient-to-r ${colors.stepGradient} rounded-xl opacity-0 group-hover/item:opacity-100 transition-opacity`}
                      />

                      <div
                        className={`relative bg-white rounded-xl border ${colors.stepBorder} ${colors.stepHoverBorder} transition-all duration-200 p-4`}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={`flex-shrink-0 w-7 h-7 bg-gradient-to-br ${colors.numberGradient} rounded-full flex items-center justify-center shadow-md`}
                          >
                            <span className="text-white text-xs font-bold">
                              {index + 1}
                            </span>
                          </div>

                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-3">
                              <div
                                className={`font-bold ${colors.stepText} text-sm`}
                              >
                                {step.name}
                              </div>
                              <div
                                className={`h-px flex-1 bg-gradient-to-r ${colors.lineGradient} to-transparent`}
                              />
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
                                    value={step.value1 || ""}
                                    onChange={(e) =>
                                      onStepChange(
                                        standardPreparation.id,
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
                                    className={`w-30 px-2.5 py-1.5 border ${colors.inputBorder} rounded-lg text-xs focus:outline-none focus:ring-2 ${colors.focusRing} focus:border-transparent transition-all`}
                                  />
                                  <div className="w-20">
                                    <CustomDropdown
                                      options={weightUnitOptions}
                                      value={step.unit1}
                                      onChange={(newUnit) =>
                                        onStepChange(
                                          standardPreparation.id,
                                          step.name,
                                          "unit1",
                                          newUnit
                                        )
                                      }
                                      placeholder="Unit"
                                      colorScheme={"emerald"}
                                    />
                                  </div>
                                  <span className="text-gray-600 font-medium">
                                    (SW1) of
                                  </span>

                                  {/* Display assigned standard name (read-only) */}
                                  {assignedStandard ? (
                                    <div
                                      className={`flex-1 min-w-[150px] px-3 py-2 ${colors.stepBg} border ${colors.inputBorder} rounded-lg text-xs font-semibold ${colors.stepText}`}
                                    >
                                      {assignedStandard.name}
                                    </div>
                                  ) : (
                                    <div className="flex-1 min-w-[150px] px-3 py-2 bg-emerald-50 border border-emerald-300 rounded-lg text-xs font-medium text-emerald-600">
                                      No Standard assigned
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
                                      className={`flex-1 px-2.5 py-1.5 border ${colors.inputBorder} rounded-lg text-xs focus:outline-none focus:ring-2 ${colors.focusRing} transition-all`}
                                    />
                                  </div>
                                )}

                                {/* Show selected standard details */}
                                {assignedStandard && (
                                  <div
                                    className={`${colors.stepBg} border ${colors.detailBorder} rounded-lg p-2.5 text-xs`}
                                  >
                                    <div
                                      className={`font-semibold ${colors.stepText} mb-1.5`}
                                    >
                                      Selected Standard Details:
                                    </div>
                                    <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-gray-700">
                                      <div>
                                        <span className="font-medium">
                                          Name:
                                        </span>{" "}
                                        {assignedStandard.name}
                                      </div>
                                      <div>
                                        <span className="font-medium">
                                          Purity:
                                        </span>{" "}
                                        {assignedStandard.purity}
                                      </div>
                                      <div>
                                        <span className="font-medium">
                                          Make:
                                        </span>{" "}
                                        {assignedStandard.make}
                                      </div>
                                      <div>
                                        <span className="font-medium">
                                          Batch:
                                        </span>{" "}
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
                                    value={step.value1 || ""}
                                    onChange={(e) =>
                                      onStepChange(
                                        standardPreparation.id,
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
                                    className={`w-30 px-2.5 py-1.5 border ${colors.inputBorder} rounded-lg text-xs focus:outline-none focus:ring-2 ${colors.focusRing} transition-all`}
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
                                      colorScheme={'emerald'}
                                    />
                                  </div>
                                  <span className="text-gray-600 font-medium">
                                    (V1) with diluent
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
                                    value={step.value1 || ""}
                                    onChange={(e) =>
                                      onStepChange(
                                        standardPreparation.id,
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
                                    className={`w-30 px-2.5 py-1.5 border ${colors.inputBorder} rounded-lg text-xs focus:outline-none focus:ring-2 ${colors.focusRing} transition-all`}
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
                                      colorScheme={'emerald'}
                                    />
                                  </div>
                                  <span className="text-gray-600 font-medium">
                                    {is2ndDilution
                                      ? "(V2)"
                                      : is3rdDilution
                                      ? "(V4)"
                                      : "(V6)"}{" "}
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
                                    value={step.value2 || ""}
                                    onChange={(e) =>
                                      onStepChange(
                                        standardPreparation.id,
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
                                    className={`w-30 px-2.5 py-1.5 border ${colors.inputBorder} rounded-lg text-xs focus:outline-none focus:ring-2 ${colors.focusRing} transition-all`}
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
                                      colorScheme={'emerald'}
                                    />
                                  </div>
                                  <span className="text-gray-600 font-medium">
                                    {is2ndDilution
                                      ? "(V3)"
                                      : is3rdDilution
                                      ? "(V5)"
                                      : "(V7)"}{" "}
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
                                  value={step.value1}
                                  onChange={(e) =>
                                    onStepChange(
                                      standardPreparation.id,
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
                                  className={`w-30 px-2.5 py-1.5 border ${colors.inputBorder} rounded-lg text-xs focus:outline-none focus:ring-2 ${colors.focusRing} transition-all`}
                                />
                                <div className="w-24">
                                  <CustomDropdown
                                    options={filtrationUnitOptions}
                                    value={step.unit1}
                                    onChange={(newUnit) =>
                                      onStepChange(
                                        standardPreparation.id,
                                        step.name,
                                        "unit1",
                                        newUnit
                                      )
                                    }
                                    placeholder="Unit"
                                    colorScheme={'emerald'}
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