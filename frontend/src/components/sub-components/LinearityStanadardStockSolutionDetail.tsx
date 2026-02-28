import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, FlaskConical, Trash } from "lucide-react";
import type { LinearityStandardStockSolution } from "../../preparation_models/LinearityStandardStockSolution";
import type { LinearityStandardStockSolutionStep } from "../../preparation_models/LinearityStandardStockSolutionStep";
import type { Standard } from "../../preparation_models/Standard";
import CustomDropdown from "../shared/CustomDropdown";

const weightUnitOptions = [
  { value: "mg", label: "mg" },
  { value: "g", label: "g" },
  { value: "kg", label: "kg" },
];

const volumeUnitOptions = [
  { value: "g", label: "g" },
  { value: "ml", label: "ml" },
  { value: "L", label: "L" },
  { value: "µL", label: "µL" },
];

// Fields that can be updated on a step
type StepField = "value1" | "unit1" | "logBookID" | "concentration";

interface LinearityStanadardStockSolutionDetailProps {
  linearityStockSolution: LinearityStandardStockSolution;
  assignedStandard: Standard | null;
  onStepChange: (
    linearityStockSolutionId: number,
    stepName: LinearityStandardStockSolutionStep["name"],
    field: StepField,
    newValue: string
  ) => void;
  onRemove: () => void;
  role: string;
}

const LinearityStanadardStockSolutionDetail: React.FC<
  LinearityStanadardStockSolutionDetailProps
> = ({
  linearityStockSolution,
  assignedStandard,
  onStepChange,
  onRemove,
  role,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const headerRoundingClass = isExpanded ? "rounded-t-lg" : "rounded-lg";

  const stepsArray: LinearityStandardStockSolutionStep[] = Array.isArray(
    linearityStockSolution?.steps
  )
    ? linearityStockSolution.steps
    : [];

  // ── Color scheme (red / linearity palette) ──────────────────────────────
  const colors = {
    glowGradient: "from-red-400/20 to-red-400/20",
    borderColor: "border-red-200/50",
    headerGradient: "from-red-700 via-red-600 to-red-500",
    textColor: "text-red-100",
    bgGradient: "from-red-50/50 to-red-50/30",
    stepGradient: "from-red-400/0 via-red-400/5 to-red-400/0",
    stepBorder: "border-red-200/60",
    stepHoverBorder: "hover:border-red-300",
    stepText: "text-red-900",
    stepBg: "bg-red-50",
    inputBorder: "border-red-300",
    focusRing: "focus:ring-red-400",
    numberGradient: "from-red-600 to-red-500",
    lineGradient: "from-red-200",
    detailBorder: "border-red-200",
  };

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
        {/* Header */}
        <div
          className={`relative bg-gradient-to-r ${colors.headerGradient} ${headerRoundingClass}`}
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
                  {linearityStockSolution.label}
                </h4>
                <p className={`text-xs ${colors.textColor}`}>
                  Linearity Standard Stock Solution Details
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
                title={`Remove ${linearityStockSolution.label}`}
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
                {stepsArray.map((step, index) => {
                  const isWeighing = step.name === "Weighing";
                  const is1stDilution = step.name === "1st Dilution";

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
                          {/* Step number badge */}
                          <div
                            className={`flex-shrink-0 w-7 h-7 bg-gradient-to-br ${colors.numberGradient} rounded-full flex items-center justify-center shadow-md`}
                          >
                            <span className="text-white text-xs font-bold">
                              {index + 1}
                            </span>
                          </div>

                          <div className="flex-1">
                            {/* Step title row */}
                            <div className="flex items-center gap-2 mb-3">
                              <div
                                className={`font-bold ${colors.stepText} text-sm`}
                              >
                                {step.name}
                                {isWeighing && (
                                  <span className="ml-1 font-normal text-gray-500">
                                    (SW1)
                                  </span>
                                )}
                              </div>
                              <div
                                className={`h-px flex-1 bg-gradient-to-r ${colors.lineGradient} to-transparent`}
                              />
                            </div>

                            {/* ── Weighing step ────────────────────────────── */}
                            {isWeighing && (
                              <div className="space-y-3">
                                {/* Row 1 – weight + unit + standard name + log book */}
                                <div className="flex flex-wrap items-center gap-2 text-xs">
                                  <span className="text-gray-600 font-medium">
                                    Weigh accurately
                                  </span>

                                  {/* Weight value */}
                                  <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    inputMode="decimal"
                                    value={step.value1 || ""}
                                    onChange={(e) =>
                                      onStepChange(
                                        linearityStockSolution.id,
                                        step.name,
                                        "value1",
                                        e.target.value
                                      )
                                    }
                                    onKeyDown={(e) => {
                                      if (
                                        e.key === "ArrowUp" ||
                                        e.key === "ArrowDown"
                                      )
                                        e.preventDefault();
                                    }}
                                    onWheel={(e) => e.currentTarget.blur()}
                                    placeholder="Enter Weight"
                                    className={`w-28 px-2.5 py-1.5 border ${colors.inputBorder} rounded-lg text-xs focus:outline-none focus:ring-2 ${colors.focusRing} focus:border-transparent transition-all`}
                                  />

                                  {/* Weight unit */}
                                  <div className="w-20">
                                    <CustomDropdown
                                      options={weightUnitOptions}
                                      value={step.unit1 || "mg"}
                                      onChange={(newUnit) =>
                                        onStepChange(
                                          linearityStockSolution.id,
                                          step.name,
                                          "unit1",
                                          newUnit
                                        )
                                      }
                                      placeholder="Unit"
                                      colorScheme={"red"}
                                    />
                                  </div>

                                  <span className="text-gray-600 font-medium">
                                    of
                                  </span>

                                  {/* Assigned standard (read-only) */}
                                  {assignedStandard ? (
                                    <div
                                      className={`flex-1 min-w-[150px] px-3 py-2 ${colors.stepBg} border ${colors.inputBorder} rounded-lg text-xs font-semibold ${colors.stepText}`}
                                    >
                                      {assignedStandard.name}
                                    </div>
                                  ) : (
                                    <div className="flex-1 min-w-[150px] px-3 py-2 bg-red-50 border border-red-300 rounded-lg text-xs font-medium text-red-600">
                                      No Standard assigned
                                    </div>
                                  )}

                                  <span className="text-gray-600 font-medium">
                                    (Log Book ID:
                                  </span>

                                  {/* Log Book ID */}
                                  <input
                                    type="text"
                                    value={step.logBookID || ""}
                                    onChange={(e) =>
                                      onStepChange(
                                        linearityStockSolution.id,
                                        step.name,
                                        "logBookID",
                                        e.target.value
                                      )
                                    }
                                    placeholder="Log Book ID"
                                    className={`w-32 px-2.5 py-1.5 border ${colors.inputBorder} rounded-lg text-xs focus:outline-none focus:ring-2 ${colors.focusRing} transition-all`}
                                  />

                                  <span className="text-gray-600 font-medium">
                                    )
                                  </span>
                                </div>

                                {/* Standard details card */}
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

                            {/* ── 1st Dilution step ─────────────────────────── */}
                            {is1stDilution && (
                              <div className="space-y-2">
                                <div className="flex flex-wrap items-center gap-2 text-xs">
                                  <span className="text-gray-600 font-medium">
                                    Diluted to
                                  </span>

                                  {/* Volume value */}
                                  <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    inputMode="decimal"
                                    value={step.value1 || ""}
                                    onChange={(e) =>
                                      onStepChange(
                                        linearityStockSolution.id,
                                        step.name,
                                        "value1",
                                        e.target.value
                                      )
                                    }
                                    onKeyDown={(e) => {
                                      if (
                                        e.key === "ArrowUp" ||
                                        e.key === "ArrowDown"
                                      )
                                        e.preventDefault();
                                    }}
                                    onWheel={(e) => e.currentTarget.blur()}
                                    placeholder="Enter Volume"
                                    className={`w-28 px-2.5 py-1.5 border ${colors.inputBorder} rounded-lg text-xs focus:outline-none focus:ring-2 ${colors.focusRing} transition-all`}
                                  />

                                  {/* Volume unit */}
                                  <div className="w-16">
                                    <CustomDropdown
                                      options={volumeUnitOptions}
                                      value={step.unit1 || "g"}
                                      onChange={(newUnit) =>
                                        onStepChange(
                                          linearityStockSolution.id,
                                          step.name,
                                          "unit1",
                                          newUnit
                                        )
                                      }
                                      placeholder="Unit"
                                      colorScheme={"red"}
                                    />
                                  </div>

                                  <span className="text-gray-600 font-medium">
                                    (V1) with Diluent.
                                  </span>

                                  <span className="text-gray-600 font-medium">
                                    Concentration in mg / ml C1
                                  </span>

                                  {/* C1 concentration (read-only / auto-calculated display) */}
                                  <input
                                    type="number"
                                    min="0"
                                    step="0.0001"
                                    inputMode="decimal"
                                    value={step.concentration || ""}
                                    onChange={(e) =>
                                      onStepChange(
                                        linearityStockSolution.id,
                                        step.name,
                                        "concentration",
                                        e.target.value
                                      )
                                    }
                                    onKeyDown={(e) => {
                                      if (
                                        e.key === "ArrowUp" ||
                                        e.key === "ArrowDown"
                                      )
                                        e.preventDefault();
                                    }}
                                    onWheel={(e) => e.currentTarget.blur()}
                                    placeholder="C1"
                                    className={`w-28 px-2.5 py-1.5 border ${colors.inputBorder} rounded-lg text-xs focus:outline-none focus:ring-2 ${colors.focusRing} transition-all`}
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

export default LinearityStanadardStockSolutionDetail;