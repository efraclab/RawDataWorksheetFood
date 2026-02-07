import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Target, Trash, Plus, X } from "lucide-react";
import type { SystemSuitabilityStep } from "../../preparation_models/SystemSuitabilityStep";
import type { SystemSuitability } from "../../preparation_models/SystemSuitability";

interface SystemSuitabilityDetailProps {
  systemSuitability: SystemSuitability;
  onStepChange: (
    systemSuitabilityId: number,
    stepName: SystemSuitabilityStep["name"],
    field: "value1" | "value2" | "value3",
    newValue: string
  ) => void;
  onAddStep: (systemSuitabilityId: number, stepName: string, limitType: "NLT" | "NMT") => void;
  onRemoveStep: (systemSuitabilityId: number, stepName: string) => void;
  onRemove: () => void;
}

const SystemSuitabilityDetail: React.FC<SystemSuitabilityDetailProps> = ({
  systemSuitability,
  onStepChange,
  onAddStep,
  onRemoveStep,
  onRemove,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [showAddStepDialog, setShowAddStepDialog] = useState(false);
  const [newStepName, setNewStepName] = useState("");
  const [newStepLimitType, setNewStepLimitType] = useState<"NLT" | "NMT" | "">("");

  const headerRoundingClass = isExpanded ? "rounded-t-lg" : "rounded-lg";

  const getLimitPrefix = (stepName: SystemSuitabilityStep["name"]) => {
    switch (stepName) {
      case "RSD Area":
      case "RSD Retention time":
      case "Tailing factor":
        return "NMT";
      case "Resolution":
      case "Theorital Plate count":
      case "Peak to Valley ratio":
        return "NLT";
      default:
        // For custom steps, check if it has a stored limit type
        const step = systemSuitability.steps.find(s => s.name === stepName);
        return step?.limitType || "NLT"; // Default to NLT if not found
    }
  };

  const getStepTemplate = (stepName: SystemSuitabilityStep["name"]) => {
    switch (stepName) {
      case "RSD Area":
        return "The RSD of area of";
      case "RSD Retention time":
        return "The RSD of Retention time of";
      case "Tailing factor":
        return "The Tailing factor of";
      case "Resolution":
        return "The Resolution between";
      case "Peak to Valley ratio":
        return "The Peak to Valley ratio between";
      case "Theorital Plate count":
        return "The Theoretical Plate count of";
      default:
        return `The ${stepName} of `;
    }
  };

  const isTwoValueStep = (stepName: string) => {
    return stepName === "Resolution" || stepName === "Peak to Valley ratio";
  };

  const handleAddStep = () => {
    if (newStepName.trim() && newStepLimitType) {
      onAddStep(systemSuitability.id, newStepName.trim(), newStepLimitType);
      setNewStepName("");
      setNewStepLimitType("");
      setShowAddStepDialog(false);
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="relative group z-20"
      >
        {/* Glow effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/20 to-emerald-400/20 rounded-xl blur-xl group-hover:blur-xl transition-all duration-300" />

        <div className="relative bg-white/95 backdrop-blur-sm rounded-lg border border-emerald-200/50 transition-all duration-300 mb-4">
          {/* Header */}
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
                    <Target className="w-5 h-5 text-white" />
                  </div>
                </motion.div>

                <div>
                  <h4 className="text-sm font-semibold text-white tracking-wide">
                    {systemSuitability.label}
                  </h4>
                  <p className="text-xs text-emerald-100">
                    System Suitability Parameters
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
                  title={`Remove ${systemSuitability.label}`}
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
                  {systemSuitability.steps.map((step: any, index: any) => {
                    const limitPrefix = getLimitPrefix(step.name);
                    const stepTemplate = getStepTemplate(step.name);
                    const needsTwoValues = isTwoValueStep(step.name);

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
                            <div className="flex-shrink-0 w-7 h-7 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center shadow-md">
                              <span className="text-white text-xs font-bold">
                                {index + 1}
                              </span>
                            </div>

                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-3">
                                <div className="font-bold text-emerald-900 text-sm">
                                  {step.name}
                                </div>
                                <div className="h-px flex-1 bg-gradient-to-r from-emerald-200 to-transparent" />
                                <motion.button
                                  onClick={() => onRemoveStep(systemSuitability.id, step.name)}
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  className="p-1 hover:bg-red-50 rounded-lg transition-colors"
                                  title="Remove step"
                                >
                                  <Trash className="w-4 h-4 text-red-500" />
                                </motion.button>
                              </div>

                              <div className="space-y-2">
                                <div className="flex flex-wrap items-center gap-2 text-xs">
                                  <span className="text-gray-700 font-medium">
                                    {stepTemplate}
                                  </span>
                                  <input
                                    type="text"
                                    value={step.value1}
                                    onChange={(e) =>
                                      onStepChange(
                                        systemSuitability.id,
                                        step.name,
                                        "value1",
                                        e.target.value
                                      )
                                    }
                                    placeholder="Enter value"
                                    className="w-32 px-2.5 py-1.5 border border-emerald-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all bg-white"
                                  />

                                  {needsTwoValues && (
                                    <>
                                      <span className="text-gray-700 font-medium">and</span>
                                      <input
                                        type="text"
                                        value={step.value2}
                                        onChange={(e) =>
                                          onStepChange(
                                            systemSuitability.id,
                                            step.name,
                                            "value2",
                                            e.target.value
                                          )
                                        }
                                        placeholder="Enter value"
                                        className="w-32 px-2.5 py-1.5 border border-emerald-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all bg-white"
                                      />
                                    </>
                                  )}

                                  <span className="text-gray-700 font-medium">
                                    should {limitPrefix}
                                  </span>
                                  <input
                                    type="text"
                                    value={step.value3}
                                    onChange={(e) =>
                                      onStepChange(
                                        systemSuitability.id,
                                        step.name,
                                        "value3",
                                        e.target.value
                                      )
                                    }
                                    placeholder="Enter value"
                                    className="w-32 px-2.5 py-1.5 border border-emerald-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all bg-white"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}

                  {/* Add Another Step Button */}
                  <motion.button
                    onClick={() => setShowAddStepDialog(true)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white border-2 border-dashed border-emerald-300 rounded-xl hover:border-emerald-400 hover:bg-emerald-50 transition-all duration-200 text-emerald-700 font-medium text-sm"
                  >
                    <Plus className="w-4 h-4" />
                    Add Another Step
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Add Step Dialog */}
      <AnimatePresence>
        {showAddStepDialog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => {
              setShowAddStepDialog(false);
              setNewStepName("");
              setNewStepLimitType("");
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
            >
              {/* Dialog Header */}
              <div className="bg-gradient-to-r from-emerald-600 to-emerald-500 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <Plus className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">
                    Add New Step
                  </h3>
                </div>
                <button
                  onClick={() => {
                    setShowAddStepDialog(false);
                    setNewStepName("");
                    setNewStepLimitType("");
                  }}
                  className="p-1 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>

              {/* Dialog Content */}
              <div className="p-6 space-y-5">
                {/* Step Name Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Step Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={newStepName}
                    onChange={(e) => setNewStepName(e.target.value)}
                    placeholder="e.g., Peak to valley ratio"
                    className="w-full px-4 py-3 border border-emerald-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && newStepName.trim() && newStepLimitType) {
                        handleAddStep();
                      }
                    }}
                    autoFocus
                  />
                </div>

                {/* Limit Type Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Limit Type <span className="text-red-500">*</span>
                  </label>
                  <div className="space-y-3">
                    {/* NLT Option */}
                    <label className="flex items-center gap-3 p-3 border-2 rounded-lg cursor-pointer transition-all hover:bg-emerald-50 hover:border-emerald-300"
                      style={{
                        borderColor: newStepLimitType === "NLT" ? "#10b981" : "#d1d5db",
                        backgroundColor: newStepLimitType === "NLT" ? "#f0fdf4" : "transparent"
                      }}
                    >
                      <input
                        type="radio"
                        name="limitType"
                        value="NLT"
                        checked={newStepLimitType === "NLT"}
                        onChange={(e) => setNewStepLimitType(e.target.value as "NLT")}
                        className="w-4 h-4 text-emerald-600 focus:ring-emerald-500"
                      />
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900">NLT</div>
                        <div className="text-xs text-gray-600">Not Less Than (minimum value)</div>
                      </div>
                    </label>

                    {/* NMT Option */}
                    <label className="flex items-center gap-3 p-3 border-2 rounded-lg cursor-pointer transition-all hover:bg-emerald-50 hover:border-emerald-300"
                      style={{
                        borderColor: newStepLimitType === "NMT" ? "#10b981" : "#d1d5db",
                        backgroundColor: newStepLimitType === "NMT" ? "#f0fdf4" : "transparent"
                      }}
                    >
                      <input
                        type="radio"
                        name="limitType"
                        value="NMT"
                        checked={newStepLimitType === "NMT"}
                        onChange={(e) => setNewStepLimitType(e.target.value as "NMT")}
                        className="w-4 h-4 text-emerald-600 focus:ring-emerald-500"
                      />
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900">NMT</div>
                        <div className="text-xs text-gray-600">Not More Than (maximum value)</div>
                      </div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Dialog Footer */}
              <div className="px-6 py-4 bg-gray-50 flex items-center justify-end gap-3">
                <button
                  onClick={() => {
                    setShowAddStepDialog(false);
                    setNewStepName("");
                    setNewStepLimitType("");
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddStep}
                  disabled={!newStepName.trim() || !newStepLimitType}
                  className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add Step
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default SystemSuitabilityDetail;