import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Target, Trash } from "lucide-react";
import type { SystemSuitabilityStep } from "../../preparation_models/SystemSuitabilityStep";
import type { SystemSuitability } from "../../preparation_models/SystemSuitability";

interface SystemSuitabilityDetailProps {
  systemSuitability: SystemSuitability;
  onStepChange: (
    systemSuitabilityId: number,
    stepName: SystemSuitabilityStep["name"],
    field: "value1" | "value2",
    newValue: string
  ) => void;
  onRemove: () => void;
}

const SystemSuitabilityDetail: React.FC<SystemSuitabilityDetailProps> = ({
  systemSuitability,
  onStepChange,
  onRemove,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const headerRoundingClass = isExpanded ? "rounded-t-lg" : "rounded-lg";

  const getLimitPrefix = (stepName: SystemSuitabilityStep["name"]) => {
    switch (stepName) {
      case "RSD Area":
      case "RSD Retention time":
      case "Tailing factor":
        return "NMT";
      case "Resolution":
      case "Theorital Plate count":
        return "NLT";
      case "Any Other":
        return "";
      default:
        return "";
    }
  };

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
                  const isAnyOther = step.name === "Any Other";

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
                            </div>

                            <div className="space-y-2">
                              <div className="flex flex-wrap items-center gap-2 text-xs">
                                <span className="text-gray-600 font-medium">
                                  Value:
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
                                  className="w-40 px-2.5 py-1.5 border border-emerald-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all"
                                />

                                <span className="text-gray-600 font-medium mx-2">
                                  {isAnyOther ? "Limit:" : `(Limit: ${limitPrefix}:`}
                                </span>
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
                                  placeholder={isAnyOther ? "Enter limit" : "Enter value"}
                                  className="w-40 px-2.5 py-1.5 border border-emerald-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all"
                                />
                                {!isAnyOther && (
                                  <span className="text-gray-600">)</span>
                                )}
                              </div>
                            </div>
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

export default SystemSuitabilityDetail;