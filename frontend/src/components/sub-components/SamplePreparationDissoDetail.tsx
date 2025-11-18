import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Droplets, Trash } from "lucide-react";
import type { SamplePreparationDisso } from "../../models/SamplePreparationDisso";
import type { SamplePreparationDissoStep } from "../../models/SamplePreparationDissoStep";

const weightUnitOptions = ["g", "mg", "kg"];
const filtrationUnitOptions = ["micron", "µm", "mm"];
const volumeUnitOptions = ["ml", "L", "µL"];
const timeUnitOptions = ["min", "hr", "sec"];
const tempUnitOptions = ["°C", "°F", "K"];

interface SamplePreparationDissoDetailProps {
  samplePreparationDisso: SamplePreparationDisso;
  onStepChange: (
    samplePreparationDissoId: number,
    stepName: SamplePreparationDissoStep["name"],
    field:
      | "value"
      | "unit"
      | "vol1"
      | "vol2"
      | "unit1"
      | "unit2"
      | "temp"
      | "tempUnit"
      | "time"
      | "timeUnit"
      | "id"
      | "rpm"
      | "claim"
      | "mediaVol"
      | "solventChemical",
    newValue: string
  ) => void;
  onRemove: () => void;
}

const SamplePreparationDissoDetail: React.FC<SamplePreparationDissoDetailProps> = ({
  samplePreparationDisso,
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
      <div className="absolute inset-0 bg-gradient-to-r from-orange-400/20 to-orange-400/20 rounded-lg blur-xl group-hover:blur-xl transition-all duration-300" />

      <div className="relative bg-white/95 backdrop-blur-sm rounded-lg border border-orange-200/50 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden mb-4">
        {/* Elegant Header */}
        <div className="relative bg-gradient-to-r from-orange-600 via-orange-500 to-red-500 overflow-hidden">
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
                  {samplePreparationDisso.label}
                </h4>
                <p className="text-xs text-orange-100">
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
                title={`Remove ${samplePreparationDisso.label}`}
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
              <div className="p-5 space-y-3 bg-gradient-to-br from-orange-50/50 to-red-50/30">
                {samplePreparationDisso.steps.map((step, index) => {
                  const isInstrument = step.name === "Instrument Details";
                  const isTablet = step.name === "Tablet Details";
                  const is1stDilution = step.name === "1st Dilution";
                  const is2ndDilution = step.name === "2nd Dilution";
                  const is3rdDilution = step.name === "3rd Dilution";
                  const isFiltration = step.name === "Filtration";

                  return (
                    <motion.div
                      key={step.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="group/item relative"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-orange-400/0 via-orange-400/5 to-red-400/0 rounded-xl opacity-0 group-hover/item:opacity-100 transition-opacity" />

                      <div className="relative bg-white rounded-xl border border-orange-200/60 shadow-sm hover:shadow-md hover:border-orange-300 transition-all duration-200 p-4">
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 w-7 h-7 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center shadow-md">
                            <span className="text-white text-xs font-bold">
                              {index + 1}
                            </span>
                          </div>

                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-3">
                              <div className="font-bold text-orange-900 text-sm">
                                {step.name}
                              </div>
                              <div className="h-px flex-1 bg-gradient-to-r from-orange-200 to-transparent" />
                            </div>

                            {isInstrument && (
                              <div className="space-y-2">
                                <div className="flex flex-wrap items-center gap-2 text-xs">
                                  <span className="text-gray-600 font-medium">
                                    Id
                                  </span>
                                  <input
                                  type="text"
                                    value={step.id || ""}
                                    onChange={(e) =>
                                      onStepChange(
                                        samplePreparationDisso.id,
                                        step.name,
                                        "id",
                                        e.target.value
                                      )
                                    }
                                    placeholder="Enter Id"
                                    className="w-20 px-2.5 py-1.5 border border-orange-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all"
                                  />
                                  
                                  <span className="text-gray-600 ml-2 font-medium">
                                    RPM
                                  </span>
                                  <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    inputMode="decimal"
                                    value={step.rpm || ""}
                                    onChange={(e) =>
                                      onStepChange(
                                        samplePreparationDisso.id,
                                        step.name,
                                        "rpm",
                                        e.target.value
                                      )
                                    }
                                    placeholder="Enter Value"
                                    className="flex-1 min-w-[120px] px-2.5 py-1.5 border border-orange-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-orange-400 transition-all"
                                  />
                                  <span className="text-gray-500 font-medium ml-2 text-xs">
                                    Temperature
                                  </span>
                                  <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    inputMode="decimal"
                                    value={step.temp || ""}
                                    onChange={(e) =>
                                      onStepChange(
                                        samplePreparationDisso.id,
                                        step.name,
                                        "temp",
                                        e.target.value
                                      )
                                    }
                                    placeholder="Enter Temp"
                                    className="w-24 px-2.5 py-1.5 border border-orange-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-orange-400 transition-all"
                                  />
                                  <select
                                    value={step.tempUnit || "min"}
                                    onChange={(e) =>
                                      onStepChange(
                                        samplePreparationDisso.id,
                                        step.name,
                                        "tempUnit",
                                        e.target.value
                                      )
                                    }
                                    className="w-16 px-2 py-1.5 border border-orange-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-orange-400 transition-all"
                                  >
                                    {tempUnitOptions.map((unit) => (
                                      <option key={unit} value={unit}>
                                        {unit}
                                      </option>
                                    ))}
                                  </select>
                                </div>
                              </div>
                            )}

                            {isTablet && (
                              <div className="space-y-2">
                                <div className="flex flex-wrap items-center gap-2 text-xs">
                                  <span className="text-gray-600 font-medium">
                                    Claim
                                  </span>
                                  <input
                                  type="text"
                                    value={step.claim || ""}
                                    onChange={(e) =>
                                      onStepChange(
                                        samplePreparationDisso.id,
                                        step.name,
                                        "claim",
                                        e.target.value
                                      )
                                    }
                                    placeholder="Enter Claim"
                                    className="w-24 px-2.5 py-1.5 border border-orange-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all"
                                  />
                                  
                                  <span className="text-gray-600 ml-2 font-medium">
                                    Media Volume
                                  </span>
                                  <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    inputMode="decimal"
                                    value={step.mediaVol || ""}
                                    onChange={(e) =>
                                      onStepChange(
                                        samplePreparationDisso.id,
                                        step.name,
                                        "mediaVol",
                                        e.target.value
                                      )
                                    }
                                    placeholder="Enter Volume"
                                    className="flex-1 min-w-[100px] px-2.5 py-1.5 border border-orange-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-orange-400 transition-all"
                                  />
                                  <select
                                    value={step.unit || "g"}
                                    onChange={(e) =>
                                      onStepChange(
                                        samplePreparationDisso.id,
                                        step.name,
                                        "unit",
                                        e.target.value
                                      )
                                    }
                                    className="w-16 px-2 py-1.5 border border-orange-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-orange-400 transition-all"
                                  >
                                    {weightUnitOptions.map((unit) => (
                                      <option key={unit} value={unit}>
                                        {unit}
                                      </option>
                                    ))}
                                  </select>
                                  <span className="text-gray-500 ml-4 font-medium text-xs">
                                    Sampling Time
                                  </span>
                                  <input
                                    type="number"
                                    min="0"
                                    step="1"
                                    inputMode="decimal"
                                    value={step.time || ""}
                                    onChange={(e) =>
                                      onStepChange(
                                        samplePreparationDisso.id,
                                        step.name,
                                        "time",
                                        e.target.value
                                      )
                                    }
                                    placeholder="Enter Time"
                                    className="w-24 px-2.5 py-1.5 border border-orange-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-orange-400 transition-all"
                                  />
                                  <select
                                    value={step.tempUnit || "min"}
                                    onChange={(e) =>
                                      onStepChange(
                                        samplePreparationDisso.id,
                                        step.name,
                                        "timeUnit",
                                        e.target.value
                                      )
                                    }
                                    className="w-16 px-2 py-1.5 border border-orange-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-orange-400 transition-all"
                                  >
                                    {timeUnitOptions.map((unit) => (
                                      <option key={unit} value={unit}>
                                        {unit}
                                      </option>
                                    ))}
                                  </select>
                                </div>
                              </div>
                            )}

                            {(is1stDilution || is2ndDilution ||
                              is3rdDilution) && (
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
                                        samplePreparationDisso.id,
                                        step.name,
                                        "vol1",
                                        e.target.value
                                      )
                                    }
                                    placeholder="Enter Volume"
                                    className="w-30 px-2.5 py-1.5 border border-orange-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-orange-400 transition-all"
                                  />
                                  <select
                                    value={step.unit1 || "ml"}
                                    onChange={(e) =>
                                      onStepChange(
                                        samplePreparationDisso.id,
                                        step.name,
                                        "unit1",
                                        e.target.value
                                      )
                                    }
                                    className="w-16 px-2 py-1.5 border border-orange-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-orange-400 transition-all"
                                  >
                                    {volumeUnitOptions.map((unit) => (
                                      <option key={unit} value={unit}>
                                        {unit}
                                      </option>
                                    ))}
                                  </select>
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
                                        samplePreparationDisso.id,
                                        step.name,
                                        "vol2",
                                        e.target.value
                                      )
                                    }
                                    placeholder="Enter Volume"
                                    className="w-30 px-2.5 py-1.5 border border-orange-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-orange-400 transition-all"
                                  />
                                  <select
                                    value={step.unit2 || "ml"}
                                    onChange={(e) =>
                                      onStepChange(
                                        samplePreparationDisso.id,
                                        step.name,
                                        "unit2",
                                        e.target.value
                                      )
                                    }
                                    className="w-16 px-2 py-1.5 border border-orange-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-orange-400 transition-all"
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
                                      samplePreparationDisso.id,
                                      step.name,
                                      "value",
                                      e.target.value
                                    )
                                  }
                                  placeholder="Enter Size"
                                  className="w-30 px-2.5 py-1.5 border border-orange-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-orange-400 transition-all"
                                />
                                <select
                                  value={step.unit}
                                  onChange={(e) =>
                                    onStepChange(
                                      samplePreparationDisso.id,
                                      step.name,
                                      "unit",
                                      e.target.value
                                    )
                                  }
                                  className="w-20 px-2 py-1.5 border border-orange-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-orange-400 transition-all"
                                >
                                  {filtrationUnitOptions.map((unit) => (
                                    <option key={unit} value={unit}>
                                      {unit}
                                    </option>
                                  ))}
                                </select>
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

export default SamplePreparationDissoDetail