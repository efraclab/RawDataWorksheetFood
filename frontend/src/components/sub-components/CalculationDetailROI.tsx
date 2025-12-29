import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  Calculator,
  Trash,
  CheckCircle,
  AlertTriangle,
  X,
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

// Helper component for warning indicator
const WarningIndicator: React.FC<{ value: string | number }> = ({ value }) => {
  const strValue = String(value);
  const isInvalid = strValue.trim() === "" || parseFloat(strValue) === 0;

  if (isInvalid) {
    return (
      <span
        className="text-amber-500 ml-2"
        title="Missing or zero value detected, calculation will fail."
      >
        <AlertTriangle className="w-4 h-4 inline-block" />
      </span>
    );
  }
  return null;
};

/**
 * Converts a mass value from any common unit to grams (g).
 */
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
  const [calculationResult, setCalculationResult] = useState<string | null>(
    null
  );

  // Get selected sample preparation
  const selectedSamplePrep = samplePreparations.find(
    (prep) => prep.id === calculation.selectedSamplePrepId
  );

  useEffect(() => {
    if (samplePreparations.length === 1 && !calculation.selectedSamplePrepId) {
      onFieldChange(
        calculation.id,
        "selectedSamplePrepId",
        samplePreparations[0].id
      );
    }
  }, [
    samplePreparations,
    calculation.selectedSamplePrepId,
    calculation.id,
    onFieldChange,
  ]);

  // Extract weight values from sample preparation steps
  const getSampleWeights = () => {
    if (!selectedSamplePrep) {
      return {
        w1: { value: "", unit: "g" },
        w2: { value: "", unit: "g" },
        w3: { value: "", unit: "g" },
      };
    }

    const weighingEmptyCrucible = selectedSamplePrep.steps.find(
      (s) => s.name === "Weighing (Empty Crucible)"
    );
    const weighingBeforeDrying = selectedSamplePrep.steps.find(
      (s) => s.name === "Weighing (Before Drying)"
    );
    const weighingAfterDrying = selectedSamplePrep.steps.find(
      (s) => s.name === "Weighing (After Drying)"
    );

    return {
      w1: {
        value: weighingEmptyCrucible?.value || "",
        unit: weighingEmptyCrucible?.unit || "g",
      },
      w2: {
        value: weighingBeforeDrying?.value || "",
        unit: weighingBeforeDrying?.unit || "g",
      },
      w3: {
        value: weighingAfterDrying?.value || "",
        unit: weighingAfterDrying?.unit || "g",
      },
    };
  };

  const sampleWeights = getSampleWeights();
  const canCalculate = selectedSamplePrep;

  // ROI Calculation Logic
  const performCalculation = () => {
    console.group("🔥 ROI Calculation Debugger Started");

    if (!canCalculate) {
      console.warn("Cannot calculate: Missing sample preparation.");
      setCalculationResult("Error: Please select a Sample Preparation.");
      console.groupEnd();
      return;
    }

    // Get weight values - prioritize manual inputs if provided, otherwise use from sample prep
    const W1_raw = calculation.w1_emptyDish || sampleWeights.w1.value;
    const W2_raw = calculation.w2_dishWithSample || sampleWeights.w2.value;
    const W3_raw = calculation.w3_dishAfterIgnition || sampleWeights.w3.value;

    const W1_unit = sampleWeights.w1.unit;
    const W2_unit = sampleWeights.w2.unit;
    const W3_unit = sampleWeights.w3.unit;

    // Convert all weights to grams
    const W1 = convertMassToG(W1_raw, W1_unit);
    const W2 = convertMassToG(W2_raw, W2_unit);
    const W3 = convertMassToG(W3_raw, W3_unit);

    console.log("1. Raw Inputs:", {
      W1_EmptyDish: W1_raw,
      W2_DishWithSample: W2_raw,
      W3_DishAfterIgnition: W3_raw,
    });

    console.log("2. Converted to grams:", { W1, W2, W3 });

    // Formula: ROI % (w/w) = [(W2 - W3) / (W2 - W1)] x 100
    const numerator = W2 - W3;
    const denominator = W2 - W1;

    console.log("3. Calculation Steps:", {
      "W2 - W3 (numerator)": numerator,
      "W2 - W1 (denominator)": denominator,
    });

    if (denominator === 0) {
      console.error("Division by zero: W2 - W1 = 0");
      setCalculationResult("Error: Cannot divide by zero (W2 equals W1)");
      console.groupEnd();
      return;
    }

    const ROI_Percentage = (numerator / denominator) * 100;

    console.log(
      `%c 4. FINAL FORMULA: [(${W2} - ${W3}) / (${W2} - ${W1})] x 100`,
      "color: blue; font-weight: bold"
    );
    console.log(
      `%c Calculated ROI Result: ${ROI_Percentage.toFixed(4)} %`,
      "color: green; font-weight: bold; font-size: 14px"
    );
    console.groupEnd();

    if (isNaN(ROI_Percentage) || !isFinite(ROI_Percentage)) {
      setCalculationResult(
        "Error: Result is NaN or Infinite. Check console for details."
      );
    } else {
      setCalculationResult(`Result: ${ROI_Percentage.toFixed(2)} % w/w`);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="relative group"
    >
      <div className="relative bg-white/95 backdrop-blur-sm rounded-lg border border-orange-200/50 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden mb-4">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 overflow-hidden">
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
                  <Calculator className="w-5 h-5 text-white" />
                </div>
              </motion.div>

              <div>
                <h4 className="text-sm font-semibold text-white tracking-wide">
                  {calculation.label}
                </h4>
                <p className="text-xs text-orange-100">
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
              {role === "HOD LAB" && (
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
              )}
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
              <div className="p-5 space-y-4 bg-gradient-to-br from-orange-50/50 to-amber-50/30">
                {/* Sample Preparation Selection */}
                <div>
                  <label className="block text-xs font-semibold text-orange-900 mb-2">
                    Select Sample Preparation
                  </label>
                  <CustomDropdown
                    options={samplePreparations.map((prep) => ({
                      value: String(prep.id),
                      label: prep.label,
                    }))}
                    value={
                      calculation.selectedSamplePrepId
                        ? String(calculation.selectedSamplePrepId)
                        : ""
                    }
                    onChange={(value) =>
                      onFieldChange(
                        calculation.id,
                        "selectedSamplePrepId",
                        value ? parseInt(value) : null
                      )
                    }
                    placeholder="-- Select Sample Prep --"
                    colorScheme="orange"
                  />
                </div>

                {/* Display Selected Sample Preparation Details */}
                {selectedSamplePrep && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <div className="bg-gradient-to-br from-white to-orange-50/50 rounded-xl border-2 border-orange-300 p-5 shadow-lg hover:shadow-xl transition-all duration-300">
                      <h5 className="text-sm font-bold text-orange-900 mb-4 flex items-center gap-2 pb-3 border-b-2 border-orange-200">
                        <div className="w-3 h-3 bg-orange-500 rounded-full shadow-lg shadow-orange-500/50 animate-pulse"></div>
                        Sample Preparation Variables
                      </h5>
                      <div className="space-y-2.5">
                        {/* W1 - Empty Crucible */}
                        <div className="flex items-center justify-between gap-3 text-xs bg-gradient-to-r from-orange-100 to-orange-50 p-3 rounded-lg border border-orange-200 hover:shadow-md transition-all">
                          <span className="font-bold text-orange-800 bg-orange-200/50 px-2 rounded-md">
                            W1 (Empty Crucible):
                          </span>
                          <span className="text-gray-800 font-semibold flex items-center">
                            {sampleWeights.w1.value} {sampleWeights.w1.unit}
                            <WarningIndicator value={sampleWeights.w1.value} />
                          </span>
                        </div>

                        {/* W2 - Crucible + Sample */}
                        <div className="flex items-center justify-between gap-3 text-xs bg-gradient-to-r from-orange-100 to-orange-50 p-3 rounded-lg border border-orange-200 hover:shadow-md transition-all">
                          <span className="font-bold text-orange-800 bg-orange-200/50 px-2 rounded-md">
                            W2 (Crucible + Sample):
                          </span>
                          <span className="text-gray-800 font-semibold flex items-center">
                            {sampleWeights.w2.value} {sampleWeights.w2.unit}
                            <WarningIndicator value={sampleWeights.w2.value} />
                          </span>
                        </div>

                        {/* W3 - After Drying */}
                        <div className="flex items-center justify-between gap-3 text-xs bg-gradient-to-r from-orange-100 to-orange-50 p-3 rounded-lg border border-orange-200 hover:shadow-md transition-all">
                          <span className="font-bold text-orange-800 bg-orange-200/50 px-2 rounded-md">
                            W3 (After Drying):
                          </span>
                          <span className="text-gray-800 font-semibold flex items-center">
                            {sampleWeights.w3.value} {sampleWeights.w3.unit}
                            <WarningIndicator value={sampleWeights.w3.value} />
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Manual Weight Inputs (Optional Override) */}
                {canCalculate && (
                  <>
                    {/* Calculate Button */}
                    <div className="flex justify-center pt-2">
                      <motion.button
                        onClick={performCalculation}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex items-center justify-center w-full gap-2 px-6 py-2.5 bg-gradient-to-r from-orange-600 to-amber-600 text-white font-semibold rounded-lg hover:from-orange-700 hover:to-amber-700 transition-all shadow-md hover:shadow-lg text-sm"
                      >
                        <Calculator className="w-4 h-4" />
                        Calculate ROI
                      </motion.button>
                    </div>

                    {/* Result Display */}
                    {calculationResult && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`bg-gradient-to-br ${
                          calculationResult.startsWith("Error")
                            ? "from-red-100 to-red-50 border-2 border-red-300"
                            : "from-green-50 to-emerald-50 border-2 border-green-300"
                        } rounded-lg p-4`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2 mb-2">
                            <CheckCircle
                              className={`w-5 h-5 ${
                                calculationResult.startsWith("Error")
                                  ? "text-red-600"
                                  : "text-green-600"
                              }`}
                            />
                            <h6
                              className={`text-sm font-bold ${
                                calculationResult.startsWith("Error")
                                  ? "text-red-700"
                                  : "text-green-700"
                              }`}
                            >
                              Calculation Result
                            </h6>
                          </div>
                          <motion.button
                            onClick={() => setCalculationResult(null)}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="p-1 -mt-1 -mr-1 text-gray-400 hover:text-orange-500 transition-colors"
                            title="Close result"
                          >
                            <X className="w-4 h-4" />
                          </motion.button>
                        </div>
                        <p className="text-sm text-gray-700">
                          {calculationResult}
                        </p>
                      </motion.div>
                    )}
                  </>
                )}

                {/* Warning if preparation not selected */}
                {!selectedSamplePrep && (
                  <div className="bg-amber-50 border-2 border-amber-300 rounded-lg p-3 text-center">
                    <p className="text-xs text-amber-800 font-medium">
                      Please select a Sample Preparation to enable calculation
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default CalculationDetailROI;
