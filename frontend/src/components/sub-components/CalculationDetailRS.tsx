import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  Calculator,
  Trash,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import type { CalculationRS } from "../../preparation_models/CalculationRS";
import type { StandardPreparation } from "../../preparation_models/StandardPreparation";
import type { SamplePreparation } from "../../preparation_models/SamplePreparation";
import CustomDropdown from "../shared/CustomDropdown";

interface CalculationDetailRSProps {
  calculation: CalculationRS;
  standardPreparations: StandardPreparation[];
  samplePreparations: SamplePreparation[];
  onFieldChange: (
    calculationId: number,
    field: keyof CalculationRS,
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

const convertMassToMg = (value: string | number, unit: string): number => {
  const val = parseFloat(String(value));
  if (isNaN(val)) return 0;

  const lowerUnit = unit.toLowerCase().trim();
  switch (lowerUnit) {
    case "mg":
      return val;
    case "g":
      return val * 1000;
    case "kg":
      return val * 1000000;
    case "mcg":
    case "ug":
    case "microgram":
      return val / 1000;
    default:
      return val;
  }
};

const convertVolumeToMl = (value: string | number, unit: string): number => {
  const val = parseFloat(String(value));
  if (isNaN(val)) return 1;

  const lowerUnit = unit.toLowerCase().trim();
  switch (lowerUnit) {
    case "ml":
    case "milliliter":
      return val;
    case "l":
    case "liter":
      return val * 1000;
    case "ul":
    case "Âµl":
    case "microliter":
      return val / 1000;
    default:
      return val;
  }
};

const CalculationDetailRS: React.FC<CalculationDetailRSProps> = ({
  calculation,
  standardPreparations,
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

  // Get selected preparations
  const selectedStandardPrep = standardPreparations.find(
    (prep) => prep.label === calculation.selectedStandardPrepLabel
  );

  const selectedSamplePrep = samplePreparations.find(
    (prep) => prep.label === calculation.selectedSamplePrepLabel
  );

  // Create preparation pair options
  const preparationPairs = standardPreparations
    .map((stdPrep) => {
      const matchingSamplePrep = samplePreparations.find(
        (samplePrep) =>
          samplePrep.label.charAt(samplePrep.label.length - 1) ===
          stdPrep.label.charAt(stdPrep.label.length - 1)
      );

      if (matchingSamplePrep) {
        return {
          value: stdPrep.label,
          label: `Preparation ${stdPrep.label.slice(-1)}`,
          standardLabel: stdPrep.label,
          sampleLabel: matchingSamplePrep.label,
        };
      }
      return null;
    })
    .filter(Boolean);

  const currentPrepLabel = selectedStandardPrep?.label || "";

  useEffect(() => {
    if (
      calculation.selectedStandardPrepLabel &&
      calculation.selectedSamplePrepLabel
    ) {
      preparationPairs.find(
        (pair) =>
          pair?.standardLabel === calculation.selectedStandardPrepLabel &&
          pair?.sampleLabel === calculation.selectedSamplePrepLabel
      );
    }
  }, [
    calculation.selectedStandardPrepLabel,
    calculation.selectedSamplePrepLabel,
    preparationPairs,
  ]);

  const handlePreparationChange = (value: string) => {
    const selectedPair = preparationPairs.find((pair) => pair?.value === value);

    if (selectedPair) {
      onFieldChange(
        calculation.id,
        "selectedStandardPrepLabel",
        selectedPair.standardLabel
      );
      onFieldChange(
        calculation.id,
        "selectedSamplePrepLabel",
        selectedPair.sampleLabel
      );
    } else {
      onFieldChange(calculation.id, "selectedStandardPrepLabel", null);
      onFieldChange(calculation.id, "selectedSamplePrepLabel", null);
    }
  };

  const getStandardDilutions = () => {
    if (!selectedStandardPrep) return [];
    const stepsArr = Array.isArray(selectedStandardPrep.steps)
      ? selectedStandardPrep.steps
      : [];
    return stepsArr
      .filter(
        (step) =>
          step.name === "1st Dilution" ||
          step.name === "2nd Dilution" ||
          step.name === "3rd Dilution"
      )
      .map((step) => ({
        name: step.name,
        vol1: step.value1 || "",
        vol2: step.value2 || "",
        unit1: step.unit1 || "ml",
        unit2: step.unit2 || "ml",
      }));
  };

  const getSampleDilutions = () => {
    if (!selectedSamplePrep) return [];
    const stepsArr = Array.isArray(selectedSamplePrep.steps)
      ? selectedSamplePrep.steps
      : [];
    return stepsArr
      .filter((step) => step.name === "1st Dilution")
      .map((step) => ({
        name: step.name,
        vol1: step.value1 || "",
        vol2: step.value2 || "",
        unit1: step.unit1 || "ml",
        unit2: step.unit2 || "ml",
      }));
  };

  const getStandardWeight = () => {
    if (!selectedStandardPrep) return { value: "", unit: "g" };
    const stepsArr = Array.isArray(selectedStandardPrep.steps)
      ? selectedStandardPrep.steps
      : [];
    const weighingStep = stepsArr.find((step) => step.name === "Weighing");
    return {
      value: weighingStep?.value1 || "",
      unit: weighingStep?.unit1 || "g",
    };
  };

  const getSampleWeight = () => {
    if (!selectedSamplePrep) return { value: "", unit: "g" };
    const stepsArr = Array.isArray(selectedSamplePrep.steps)
      ? selectedSamplePrep.steps
      : [];
    const weighingStep = stepsArr.find((step) => step.name === "Weighing");
    return {
      value: weighingStep?.value1 || "",
      unit: weighingStep?.unit1 || "g",
    };
  };

  const standardDilutions = getStandardDilutions();
  const sampleDilutions = getSampleDilutions();
  const standardWeight = getStandardWeight();
  const sampleWeight = getSampleWeight();

  const validatePreparations = (): ValidationResult => {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!selectedStandardPrep || !selectedSamplePrep) {
      errors.push("Please select both Standard and Sample preparations");
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

    const stdSteps = Array.isArray(selectedStandardPrep.steps)
      ? selectedStandardPrep.steps
      : [];

    const stdWeighing = stdSteps.find((s) => s.name === "Weighing");
    if (!stdWeighing) {
      errors.push("Standard Preparation: Weighing step is missing");
    } else {
      if (!isValueValid(stdWeighing.value1)) {
        errors.push(
          "Standard Preparation - Weighing: Weight value is required"
        );
      }
      if (!stdWeighing.logBookID || stdWeighing.logBookID.trim() === "") {
        errors.push("Standard Preparation - Weighing: Logbook ID is required");
      }
    }

    standardDilutions.forEach((dilution) => {
      if (dilution.name !== "1st Dilution") {
        if (!isValueValid(dilution.vol1)) {
          errors.push(
            `Standard Preparation - ${dilution.name}: Volume 1 is required`
          );
        }
        if (!isValueValid(dilution.vol2)) {
          errors.push(
            `Standard Preparation - ${dilution.name}: Volume 2 is required`
          );
        }
      }
    });

    const smpSteps = Array.isArray(selectedSamplePrep.steps)
      ? selectedSamplePrep.steps
      : [];

    const smpWeighing = smpSteps.find((s) => s.name === "Weighing");
    if (!smpWeighing) {
      errors.push("Sample Preparation: Weighing step is missing");
    } else {
      if (!isValueValid(smpWeighing.value1)) {
        errors.push("Sample Preparation - Weighing: Weight value is required");
      }
      if (!smpWeighing.logBookID || smpWeighing.logBookID.trim() === "") {
        errors.push("Sample Preparation - Weighing: Logbook ID is required");
      }
    }

    sampleDilutions.forEach((dilution) => {
      if (!isValueValid(dilution.vol1)) {
        errors.push(
          `Sample Preparation - ${dilution.name}: Volume is required`
        );
      }
    });

    if (!isValueValid(calculation.areaOfSample)) {
      errors.push("Area/ABS of Sample is required");
    }

    if (!isValueValid(calculation.areaOfStandard)) {
      errors.push("Area/ABS of Standard is required");
    }

    if (!isValueValid(calculation.purity)) {
      errors.push("Purity is required");
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
  }, [selectedStandardPrep, selectedSamplePrep]);

  // Formula Display Component
  const FormulaDisplay: React.FC = () => {
    if (!selectedStandardPrep || !selectedSamplePrep) return null;

    const areaSmp = calculation.areaOfSample || "1";
    const areaStd = calculation.areaOfStandard || "1";
    const purity = calculation.purity || "100";

    const sw1Value = standardWeight.value || "1";
    const sw2Value = sampleWeight.value || "1";

    const V1 = standardDilutions[0]
      ? convertVolumeToMl(standardDilutions[0].vol1, standardDilutions[0].unit1).toString()
      : "1";
    const V2 = standardDilutions[1]
      ? convertVolumeToMl(standardDilutions[1].vol1, standardDilutions[1].unit1).toString()
      : "1";
    const V3 = standardDilutions[1]
      ? convertVolumeToMl(standardDilutions[1].vol2, standardDilutions[1].unit2).toString()
      : "1";
    const V4 = standardDilutions[2]
      ? convertVolumeToMl(standardDilutions[2].vol1, standardDilutions[2].unit1).toString()
      : "1";
    const V5 = standardDilutions[2]
      ? convertVolumeToMl(standardDilutions[2].vol2, standardDilutions[2].unit2).toString()
      : "1";
    const V6 = sampleDilutions[0]
      ? convertVolumeToMl(sampleDilutions[0].vol1, sampleDilutions[0].unit1).toString()
      : "1";

    const numeratorSymbolic = [
      "Area/ABS of Sample",
      "X SW1",
      "X V2",
      "X V4",
      "X V6",
      "X Purity",
      "X 1000000",
    ];

    const denominatorSymbolic = [
      "Area/ABS of Standard",
      "X V1",
      "X V3",
      "X V5",
      "X SW2",
      "X 100",
    ];

    const numeratorValues = [areaSmp, sw1Value, V2, V4, V6, purity, "1000000"];
    const denominatorValues = [areaStd, V1, V3, V5, sw2Value, "100"];

    return (
      <div className="bg-white rounded-lg p-4 border-2 border-emerald-200 shadow-sm mt-4">
        <h4 className="text-sm font-bold text-gray-900 mb-3">
          Formula for Residual Solvent
        </h4>

        {/* Symbolic Formula */}
        <div className="bg-gray-50 rounded p-3 mb-3">
          <div className="flex flex-col items-center">
            <div className="text-center border-b-2 border-black pb-2 mb-2 px-2 w-full">
              <p className="text-xs font-mono text-black break-words">
                {numeratorSymbolic.join(" ")}
              </p>
            </div>
            <div className="text-center px-2 w-full">
              <p className="text-xs font-mono text-black break-words">
                {denominatorSymbolic.join(" ")}
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
                  {numeratorValues.join(" X ")}
                </p>
              </div>
              <div className="text-center px-2 w-full">
                <p className="text-xs font-mono text-black break-words">
                  {denominatorValues.join(" X ")}
                </p>
              </div>
            </div>
          </div>
        </div>

        <p className="text-xs text-right text-gray-600 mt-2 font-semibold">
          = ppm
        </p>
      </div>
    );
  };

  const canCalculate = selectedStandardPrep && selectedSamplePrep;

  const performCalculation = () => {
    const result = validatePreparations();
    setValidationResult(result);

    if (!result.isValid) {
      onFieldChange(
        calculation.id,
        "calculationResult",
        `Error: Cannot calculate - ${result.errors.length} validation error(s). Please check the validation messages above.`
      );
      return;
    }

    console.group("🧪 Residual Solvent Calculation Started");

    if (!canCalculate) {
      onFieldChange(
        calculation.id,
        "calculationResult",
        "Error: Please select both Standard and Sample preparations."
      );
      console.groupEnd();
      return;
    }

    const AreaOfSample = parseFloat(calculation.areaOfSample as string) || 1;
    const AreaOfStandard =
      parseFloat(calculation.areaOfStandard as string) || 1;
    const SW1_Standard = convertMassToMg(
      standardWeight.value,
      standardWeight.unit
    );
    const SW2_Sample = convertMassToMg(sampleWeight.value, sampleWeight.unit);
    const Purity = parseFloat(calculation.purity as string) || 1;

    console.log("1. Raw Inputs:", {
      AreaSample: AreaOfSample,
      AreaStandard: AreaOfStandard,
      SW1: SW1_Standard,
      SW2: SW2_Sample,
      Purity: Purity,
    });

    const V1 = standardDilutions[0]
      ? convertVolumeToMl(standardDilutions[0].vol1, standardDilutions[0].unit1)
      : 1;
    const V2 = standardDilutions[1]
      ? convertVolumeToMl(standardDilutions[1].vol1, standardDilutions[1].unit1)
      : 1;
    const V3 = standardDilutions[1]
      ? convertVolumeToMl(standardDilutions[1].vol2, standardDilutions[1].unit2)
      : 1;
    const V4 = standardDilutions[2]
      ? convertVolumeToMl(standardDilutions[2].vol1, standardDilutions[2].unit1)
      : 1;
    const V5 = standardDilutions[2]
      ? convertVolumeToMl(standardDilutions[2].vol2, standardDilutions[2].unit2)
      : 1;
    const V6 = sampleDilutions[0]
      ? convertVolumeToMl(sampleDilutions[0].vol1, sampleDilutions[0].unit1)
      : 1;

    console.log("2. Volumes (converted to mL):", { V1, V2, V3, V4, V5, V6 });

    const AreaRatio = AreaOfStandard !== 0 ? AreaOfSample / AreaOfStandard : 0;
    const PurityFactor = Purity / 100;

    console.log("3. Ratios:", { AreaRatio, PurityFactor });

    let FinalResult = 0;
    const numerator = AreaOfSample * SW1_Standard * V2 * V4 * V6 * Purity;
    const denominator = AreaOfStandard * V1 * V3 * V5 * SW2_Sample * 100;

    if (denominator !== 0) {
      FinalResult = (numerator / denominator) * 1000000;
    }

    const formulaDebugString = `(${AreaOfSample} × ${SW1_Standard} × ${V2} × ${V4} × ${V6} × ${Purity}) / (${AreaOfStandard} × ${V1} × ${V3} × ${V5} × ${SW2_Sample} × 100)`;

    console.log("4. Formula:", formulaDebugString);
    console.log(`5. Result: ${FinalResult}`, "color: green; font-weight: bold");
    console.groupEnd();

    if (isNaN(FinalResult) || !isFinite(FinalResult)) {
      onFieldChange(
        calculation.id,
        "calculationResult",
        "Error: Result is NaN or Infinite. Check console for details."
      );
    } else {
      const result = `${FinalResult.toFixedNoRound(4)}`;
      onFieldChange(calculation.id, "calculationResult", result);
      onFieldChange(calculation.id, "calculationResultUnit", "ppm");
    }

    onFieldChange(calculation.id, "sw1", SW1_Standard.toString());
    onFieldChange(calculation.id, "sw2", SW2_Sample.toString());
    onFieldChange(calculation.id, "v1", V1.toString());
    onFieldChange(calculation.id, "v2", V2.toString());
    onFieldChange(calculation.id, "v3", V3.toString());
    onFieldChange(calculation.id, "v4", V4.toString());
    onFieldChange(calculation.id, "v5", V5.toString());
    onFieldChange(calculation.id, "v6", V6.toString());
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white rounded-xl shadow-lg border-2 border-emerald-200 overflow-hidden mb-6"
    >
      <div
        className={`relative bg-gradient-to-r from-emerald-600 to-emerald-600 ${
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
                Residual Solvent Calculation
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

      <div className="relative">
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="p-6 space-y-6">
                <div className="bg-gradient-to-r from-emerald-50 to-emerald-50 rounded-lg p-4 border-2 border-emerald-200">
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Select Preparation Pair
                  </label>
                  <CustomDropdown
                    options={preparationPairs.map((pair) => ({
                      value: pair?.value || "",
                      label: pair?.label || "",
                    }))}
                    value={currentPrepLabel}
                    onChange={handlePreparationChange}
                    placeholder="Select preparation pair..."
                    colorScheme="emerald"
                  />
                </div>

                {selectedStandardPrep &&
                  selectedSamplePrep && <FormulaDisplay />}

                {selectedStandardPrep && selectedSamplePrep && (
                  <div className="space-y-6">
                    <div className="bg-gradient-to-r from-emerald-50 to-emerald-50 rounded-lg p-4 border-2 border-emerald-200">
                      <h5 className="text-sm font-bold text-gray-700 mb-3">
                        Area/ABS Values
                      </h5>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-gray-600 mb-1">
                            Standard Area/ABS *
                          </label>
                          <input
                            type="number"
                            value={calculation.areaOfStandard || ""}
                            onChange={(e) =>
                              onFieldChange(
                                calculation.id,
                                "areaOfStandard",
                                e.target.value
                              )
                            }
                            step="any"
                            onKeyDown={(e) => {
                              if (
                                e.key === "ArrowUp" ||
                                e.key === "ArrowDown"
                              ) {
                                e.preventDefault();
                              }
                            }}
                            onWheel={(e) => e.currentTarget.blur()}
                            placeholder="Enter standard area"
                            className="w-full px-3 py-2 bg-white border border-emerald-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-emerald-50"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-600 mb-1">
                            Sample Area/ABS *
                          </label>
                          <input
                            type="number"
                            value={calculation.areaOfSample || ""}
                            onChange={(e) =>
                              onFieldChange(
                                calculation.id,
                                "areaOfSample",
                                e.target.value
                              )
                            }
                            step="any"
                            onKeyDown={(e) => {
                              if (
                                e.key === "ArrowUp" ||
                                e.key === "ArrowDown"
                              ) {
                                e.preventDefault();
                              }
                            }}
                            onWheel={(e) => e.currentTarget.blur()}
                            placeholder="Enter sample area"
                            className="w-full px-3 py-2 bg-white border border-emerald-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-emerald-50"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-emerald-50 to-emerald-50 rounded-lg p-4 border-2 border-emerald-200">
                      <h5 className="text-sm font-bold text-gray-700 mb-3">
                        Standard Properties
                      </h5>
                      <div className="grid md:grid-cols-1 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-gray-600 mb-1">
                            Purity (%)
                          </label>
                          <input
                            type="number"
                            value={calculation.purity}
                            onChange={(e) =>
                              onFieldChange(
                                calculation.id,
                                "purity",
                                e.target.value
                              )
                            }
                            step="any"
                            onKeyDown={(e) => {
                              if (
                                e.key === "ArrowUp" ||
                                e.key === "ArrowDown"
                              ) {
                                e.preventDefault();
                              }
                            }}
                            onWheel={(e) => e.currentTarget.blur()}
                            placeholder="Purity %"
                            className="w-full px-3 py-2 bg-white border border-emerald-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-emerald-50"
                          />
                        </div>
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

                {(!selectedStandardPrep || !selectedSamplePrep) && (
                  <div className="bg-emerald-50 border-2 border-emerald-300 rounded-lg p-3 text-center">
                    <p className="text-xs text-emerald-800 font-medium">
                      Please select a preparation to enable calculation
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
                              Primary Result
                            </h6>
                          </div>
                          <div className="p-4">
                            <p className="text-2xl font-bold text-gray-800">
                              {calculation.calculationResult}{" "}
                              {!calculation.calculationResult.startsWith(
                                "Error"
                              )
                                ? calculation.calculationResultUnit
                                : ""}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white/80 backdrop-blur-sm rounded-lg border border-gray-200 p-4">
                        <div className="grid md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-gray-600 font-medium">
                              Standard Prep
                            </p>
                            <p className="text-gray-900 font-semibold">
                              {calculation.selectedStandardPrepLabel || "N/A"}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-600 font-medium">
                              Sample Prep
                            </p>
                            <p className="text-gray-900 font-semibold">
                              {calculation.selectedSamplePrepLabel || "N/A"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default CalculationDetailRS;