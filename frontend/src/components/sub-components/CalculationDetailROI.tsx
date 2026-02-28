import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  Calculator,
  Trash,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import type { CalculationROI } from "../../preparation_models/CalculationROI";
import type { SamplePreparationROI } from "../../preparation_models/SamplePreparationROI";
import CustomDropdown from "../shared/CustomDropdown";

interface CalculationDetailROIProps {
  calculation: CalculationROI;
  samplePreparations: SamplePreparationROI[];
  onFieldChange: (
    calculationId: number,
    field: keyof CalculationROI,
    value: string | number | null
  ) => void;
  onRemove: () => void;
  role: string;
}

interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

const convertMassToG = (value: string | number, unit: string): number => {
  const val = parseFloat(String(value));
  if (isNaN(val)) return 0;

  const lowerUnit = unit.toLowerCase().trim();

  switch (lowerUnit) {
    case "g":
    case "gram":
      return val;
    case "mg":
    case "milligram":
      return val / 1000;
    case "kg":
    case "kilogram":
      return val * 1000;
    default:
      return val;
  }
};

const CalculationDetailROI: React.FC<CalculationDetailROIProps> = ({
  calculation,
  samplePreparations,
  onFieldChange,
  onRemove,
  role,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [validationResult, setValidationResult] = useState<ValidationResult>({
    isValid: false,
    errors: [],
    warnings: [],
  });

  const selectedSamplePrep = samplePreparations.find(
    (prep) => prep.label === calculation.selectedSamplePreparationLabel
  );

  useEffect(() => {
    if (calculation.selectedSamplePreparationLabel) {
      const exists = samplePreparations.some(
        (prep) => prep.label === calculation.selectedSamplePreparationLabel
      );

      if (!exists) {
        console.warn(
          "⚠️ Selected Sample Prep label not found:",
          calculation.selectedSamplePreparationLabel
        );
      }
    }
  }, [calculation.selectedSamplePreparationLabel, samplePreparations]);

  const getSampleWeights = () => {
    if (!selectedSamplePrep) {
      return {
        w1: { value: "", unit: "g" },
        w2: { value: "", unit: "g" },
        w3: { value: "", unit: "g" },
      };
    }

    const stepsArr = Array.isArray(selectedSamplePrep.steps)
      ? selectedSamplePrep.steps
      : [];

    const weighingEmptyCrucible = stepsArr.find(
      (s) => s.name === "Weighing (Empty Crucible)"
    );
    const weighingBeforeDrying = stepsArr.find(
      (s) => s.name === "Weighing (Before Drying)"
    );
    const weighingAfterDrying = stepsArr.find(
      (s) => s.name === "Weighing (After Drying)"
    );

    return {
      w1: {
        value: weighingEmptyCrucible?.value1 || "",
        unit: weighingEmptyCrucible?.unit1 || "g",
      },
      w2: {
        value: weighingBeforeDrying?.value1 || "",
        unit: weighingBeforeDrying?.unit1 || "g",
      },
      w3: {
        value: weighingAfterDrying?.value1 || "",
        unit: weighingAfterDrying?.unit1 || "g",
      },
    };
  };

  const sampleWeights = getSampleWeights();

  const validatePreparations = (): ValidationResult => {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!selectedSamplePrep) {
      errors.push("Please select a Sample Preparation");
      return { isValid: false, errors, warnings };
    }

    const isValueValid = (value: any): boolean => {
      if (value === null || value === undefined) return false;
      const strValue = String(value).trim();
      return (
        strValue !== "" &&
        !isNaN(parseFloat(strValue)) &&
        parseFloat(strValue) !== 0
      );
    };

    const smpSteps = Array.isArray(selectedSamplePrep.steps)
      ? selectedSamplePrep.steps
      : [];

    const weighingEmpty = smpSteps.find(
      (s) => s.name === "Weighing (Empty Crucible)"
    );
    if (!weighingEmpty) {
      errors.push(
        "Sample Preparation: Weighing (Empty Crucible) step is missing"
      );
    } else {
      if (!isValueValid(weighingEmpty.value1)) {
        errors.push(
          "Sample Preparation - Weighing (Empty Crucible): Weight value is required"
        );
      }
    }

    const weighingBefore = smpSteps.find(
      (s) => s.name === "Weighing (Before Drying)"
    );
    if (!weighingBefore) {
      errors.push(
        "Sample Preparation: Weighing (Before Drying) step is missing"
      );
    } else {
      if (!isValueValid(weighingBefore.value1)) {
        errors.push(
          "Sample Preparation - Weighing (Before Drying): Weight value is required"
        );
      }
    }

    const weighingAfter = smpSteps.find(
      (s) => s.name === "Weighing (After Drying)"
    );
    if (!weighingAfter) {
      errors.push(
        "Sample Preparation: Weighing (After Drying) step is missing"
      );
    } else {
      if (!isValueValid(weighingAfter.value1)) {
        errors.push(
          "Sample Preparation - Weighing (After Drying): Weight value is required"
        );
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  };

  useEffect(() => {
    const result = validatePreparations();
    setValidationResult(result);
  }, [selectedSamplePrep]);

  // Formula Display Component
  const FormulaDisplay: React.FC = () => {
    if (!selectedSamplePrep) return null;

    const W1_raw = sampleWeights.w1.value || "0";
    const W2_raw = sampleWeights.w2.value || "0";
    const W3_raw = sampleWeights.w3.value || "0";

    const W1_unit = sampleWeights.w1.unit;
    const W2_unit = sampleWeights.w2.unit;
    const W3_unit = sampleWeights.w3.unit;

    const W1 = convertMassToG(W1_raw, W1_unit);
    const W2 = convertMassToG(W2_raw, W2_unit);
    const W3 = convertMassToG(W3_raw, W3_unit);

    return (
      <div className="bg-white rounded-lg p-4 border-2 border-emerald-200 shadow-sm mt-4">
        <h4 className="text-sm font-bold text-gray-900 mb-3">
          Formula for ROI (Residue on Ignition)
        </h4>

        {/* Symbolic Formula */}
        <div className="bg-gray-50 rounded p-3 mb-3">
          <div className="flex flex-col items-center">
            <div className="text-center border-b-2 border-black pb-2 mb-2 px-2 w-full">
              <p className="text-xs font-mono text-black break-words">
                (Weight of Crucible + Sample before ignition in g W2) - (Weight
                of Crucible + Sample after ignition in g W3)
              </p>
            </div>
            <div className="text-center px-2 w-full">
              <p className="text-xs font-mono text-black break-words">
                (Weight of Crucible + Sample before ignition in g W2) - (Weight
                of empty Crucible in g W1)
              </p>
            </div>
          </div>
        </div>

        {/* Values Formula with = sign */}
        <div className="bg-emerald-50 rounded p-3">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-black">=</span>
            <div className="flex-1 flex flex-col items-center">
              <div className="text-center border-b-2 border-black pb-2 mb-2 px-2 w-full">
                <p className="text-xs font-mono text-black break-words">
                  ({W2.toFixed(4)} - {W3.toFixed(4)})
                </p>
              </div>
              <div className="text-center px-2 w-full">
                <p className="text-xs font-mono text-black break-words">
                  ({W2.toFixed(4)} - {W1.toFixed(4)})
                </p>
              </div>
            </div>
            <span className="text-lg font-bold text-black">X 100</span>
          </div>
        </div>

        <p className="text-xs text-right text-gray-600 mt-2 font-semibold">
          = %
        </p>
      </div>
    );
  };

  const canCalculate = selectedSamplePrep;

  const performCalculation = () => {
    console.group("🔥 ROI Calculation Started");

    if (!canCalculate) {
      console.warn("Cannot calculate: Missing sample preparation.");
      onFieldChange(
        calculation.id,
        "calculationResult",
        "Error: Please select a Sample Preparation."
      );
      console.groupEnd();
      return;
    }

    const W1_raw = sampleWeights.w1.value;
    const W2_raw = sampleWeights.w2.value;
    const W3_raw = sampleWeights.w3.value;

    const W1_unit = sampleWeights.w1.unit;
    const W2_unit = sampleWeights.w2.unit;
    const W3_unit = sampleWeights.w3.unit;

    const W1 = convertMassToG(W1_raw, W1_unit);
    const W2 = convertMassToG(W2_raw, W2_unit);
    const W3 = convertMassToG(W3_raw, W3_unit);

    onFieldChange(calculation.id, "w1", W1.toString());
    onFieldChange(calculation.id, "w2", W2.toString());
    onFieldChange(calculation.id, "w3", W3.toString());

    console.log("1. Raw Inputs from Sample Preparation:", {
      W1_EmptyCrucible: W1_raw,
      W2_CrucibleWithSample: W2_raw,
      W3_CrucibleAfterIgnition: W3_raw,
    });

    console.log("2. Converted to grams:", { W1, W2, W3 });

    const numerator = W2 - W3;
    const denominator = W2 - W1;

    console.log("3. Calculation Steps:", {
      "W3 - W1 (numerator)": numerator,
      "W2 - W1 (denominator)": denominator,
    });

    if (denominator === 0) {
      console.error("Division by zero: W2 - W1 = 0");
      onFieldChange(
        calculation.id,
        "calculationResult",
        "Error: Cannot divide by zero (W2 equals W1)"
      );
      console.groupEnd();
      return;
    }

    const ROI_Percentage = (numerator / denominator) * 100;

    console.log(`4. FINAL FORMULA: [(${W3} - ${W1}) / (${W2} - ${W1})] x 100`);
    console.log(`Calculated ROI Result: ${ROI_Percentage.toFixedNoRound(4)} %`);
    console.groupEnd();

    if (isNaN(ROI_Percentage) || !isFinite(ROI_Percentage)) {
      onFieldChange(
        calculation.id,
        "calculationResult",
        "Error: Result is NaN or Infinite"
      );
    } else {
      onFieldChange(
        calculation.id,
        "calculationResult",
        ROI_Percentage.toFixedNoRound(4).toFixed(3)
      );
      onFieldChange(calculation.id, "calculationResultUnit", "%");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white rounded-xl shadow-lg border-2 border-emerald-200 overflow-hidden mb-6"
    >
      <div
          className={`relative bg-gradient-to-r from-emerald-600 via-emerald-500 to-emerald-500 ${
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
                  <Calculator className="w-5 h-5 text-white" />
                </div>
              </motion.div>

              <div>
                <h4 className="text-sm font-semibold text-white tracking-wide">
                  {calculation.label}
                </h4>
                <p className="text-xs text-emerald-100">
                  Calculation for Residue on Ignition
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
                  title={`Remove ${calculation.label}`}
                >
                  <Trash className="w-4 h-4 text-white" />
                </motion.button>
            </div>
          </div>
        </div>

      {!validationResult.isValid && isExpanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="bg-red-50 border-b-2 border-red-200"
        >
          <div className="p-4">
            <div className="flex items-start gap-3">
              <XCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <h4 className="text-sm font-bold text-red-800 mb-2">
                  Validation Errors ({validationResult.errors.length})
                </h4>
                <ul className="space-y-1">
                  {validationResult.errors.map((error, idx) => (
                    <li
                      key={idx}
                      className="text-xs text-red-700 flex items-start gap-2"
                    >
                      <span className="text-red-500 mt-0.5">•</span>
                      <span>{error}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {validationResult.isValid && isExpanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="bg-emerald-50 border-b-2 border-emerald-200"
        >
          <div className="p-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <p className="text-sm font-semibold text-emerald-800">
                All required fields are valid - Ready to calculate
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {isExpanded && (
        <div className="border-t-4 border-emerald-300">
          <AnimatePresence>
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="p-6 bg-gradient-to-b from-gray-50 to-white space-y-6">
                  <div className="bg-gradient-to-r from-emerald-50 to-emerald-50 rounded-lg p-4 border-2 border-emerald-200">
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Select Sample Preparation
                    </label>
                    <CustomDropdown
                      options={samplePreparations.map((prep) => ({
                        value: prep.label,
                        label: prep.label,
                      }))}
                      value={calculation.selectedSamplePreparationLabel || ""}
                      onChange={(value) =>
                        onFieldChange(
                          calculation.id,
                          "selectedSamplePreparationLabel",
                          value
                        )
                      }
                      placeholder="Select sample preparation..."
                      colorScheme="emerald"
                    />
                  </div>

                  {selectedSamplePrep && <FormulaDisplay />}

                  {selectedSamplePrep && (
                    <div className="space-y-6">
                      {/* Acceptance Limit */}
                      <div className="bg-gradient-to-r from-emerald-50 to-emerald-50 rounded-lg p-4 border-2 border-emerald-200">
                        <h5 className="text-sm font-bold text-gray-700 mb-3">
                          Acceptance Limit
                        </h5>
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            min="0"
                            step="any"
                            value={calculation.acceptanceLimitMin ?? ""}
                            onChange={(e) =>
                              onFieldChange(
                                calculation.id,
                                "acceptanceLimitMin",
                                e.target.value === "" ? null : e.target.value,
                              )
                            }
                            onKeyDown={(e) => {
                              if (e.key === "ArrowUp" || e.key === "ArrowDown") e.preventDefault();
                            }}
                            onWheel={(e) => e.currentTarget.blur()}
                            placeholder="Enter min limit"
                            className="w-full px-3 py-2 bg-white border border-emerald-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-emerald-400"
                          />
                          <span className="text-xs font-semibold text-gray-500 shrink-0">to</span>
                          <input
                            type="number"
                            min="0"
                            step="any"
                            value={calculation.acceptanceLimitMax ?? ""}
                            onChange={(e) =>
                              onFieldChange(
                                calculation.id,
                                "acceptanceLimitMax",
                                e.target.value === "" ? null : e.target.value,
                              )
                            }
                            onKeyDown={(e) => {
                              if (e.key === "ArrowUp" || e.key === "ArrowDown") e.preventDefault();
                            }}
                            onWheel={(e) => e.currentTarget.blur()}
                            placeholder="Enter max limit"
                            className="w-full px-3 py-2 bg-white border border-emerald-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-emerald-400"
                          />
                        </div>
                      </div>

                      <div className="flex justify-center pt-2">
                        <motion.button
                          onClick={performCalculation}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-600 text-white font-semibold rounded-lg hover:from-emerald-700 hover:to-emerald-700 transition-all shadow-md hover:shadow-lg text-sm"
                        >
                          <Calculator className="w-4 h-4" />
                          Calculate Result
                        </motion.button>
                      </div>
                    </div>
                  )}

                  {!selectedSamplePrep && (
                    <div className="bg-emerald-50 border-2 border-emerald-300 rounded-lg p-3 text-center">
                      <p className="text-xs text-emerald-800 font-medium">
                        Please select a sample preparation to enable calculation
                      </p>
                    </div>
                  )}
                </div>

                {calculation.calculationResult && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="border-t-4 border-emerald-200"
                  >
                    <div
                      className={`p-6 ${
                        calculation.calculationResult.startsWith("Error")
                          ? "bg-gradient-to-br from-emerald-50 via-emerald-100/50 to-emerald-50"
                          : "bg-gradient-to-br from-emerald-50 via-emerald-100/30 to-emerald-50"
                      }`}
                    >
                      <div className="max-w-4xl mx-auto space-y-4">
                        <div className="flex items-center gap-3 pb-3">
                          <CheckCircle2
                            className={`w-6 h-6 ${
                              calculation.calculationResult.startsWith("Error")
                                ? "text-emerald-700"
                                : "text-emerald-700"
                            }`}
                          />
                          <div>
                            <h6
                              className={`text-lg font-bold ${
                                calculation.calculationResult.startsWith("Error")
                                  ? "text-emerald-700"
                                  : "text-emerald-700"
                              }`}
                            >
                              Calculation Results
                            </h6>
                          </div>
                        </div>

                        <div className="grid gap-4">
                          <div className="bg-white rounded-lg shadow-lg border-2 border-emerald-300 overflow-hidden">
                            <div className="bg-gradient-to-r from-emerald-600 to-emerald-600 px-4 py-2">
                              <h6 className="text-sm font-bold text-white">
                                ROI Result
                              </h6>
                            </div>
                            <div className="flex items-center p-4">
                              <p className="text-2xl font-bold text-gray-800">
                                {calculation.calculationResult}{" "}
                                {!calculation.calculationResult.startsWith(
                                  "Error"
                                )
                                  ? calculation.calculationResultUnit
                                  : ""}
                              </p>
                              {(() => {
                                const limitMin = calculation.acceptanceLimitMin != null && calculation.acceptanceLimitMin !== ""
                                  ? parseFloat(calculation.acceptanceLimitMin as string) : null;
                                const limitMax = calculation.acceptanceLimitMax != null && calculation.acceptanceLimitMax !== ""
                                  ? parseFloat(calculation.acceptanceLimitMax as string) : null;
                                const hasMin = limitMin !== null && !isNaN(limitMin);
                                const hasMax = limitMax !== null && !isNaN(limitMax);
                                if (!hasMin && !hasMax) return null;
                                const val = parseFloat(calculation.calculationResult);
                                const pass = !isNaN(val) &&
                                  (hasMin ? val >= limitMin! : true) &&
                                  (hasMax ? val <= limitMax! : true);
                                return (
                                  <span className={`m-2 inline-block px-3 py-1 rounded-full text-sm font-bold ${pass ? "bg-green-100 text-green-800 border border-green-300" : "bg-red-100 text-red-800 border border-red-300"}`}>
                                    {pass ? "Pass" : "Fail"}
                                  </span>
                                );
                              })()}
                            </div>
                          </div>
                        </div>

                        <div className="bg-white/80 backdrop-blur-sm rounded-lg border border-gray-200 p-4">
                          <div className="grid md:grid-cols-3 gap-4 text-sm">
                            <div>
                              <p className="text-gray-600 font-medium">
                                Sample Prep
                              </p>
                              <p className="text-gray-900 font-semibold">
                                {calculation.selectedSamplePreparationLabel || "N/A"}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
};

export default CalculationDetailROI;