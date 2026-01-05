import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  Calculator,
  Trash,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";
import type {
  CalculationAssay,
  CalculationType,
} from "../../preparation_models/CalculationAssay";
import type { StandardPreparation } from "../../preparation_models/StandardPreparation";
import type { SamplePreparation } from "../../preparation_models/SamplePreparation";
import CustomDropdown from "../shared/CustomDropdown";

// 1. UPDATED: Added "For Raw Material"
const calculationFor: CalculationType[] = [
  "Tablets",
  "Capsule",
  "Injection Vial",
  "Oral Suspension",
  "Oral Liquid",
  "Raw Material",
];

interface CalculationDetailAssayProps {
  calculation: CalculationAssay;
  standardPreparations: StandardPreparation[];
  samplePreparations: SamplePreparation[];
  onFieldChange: (
    calculationId: number,
    field: keyof CalculationAssay,
    value: string | number | null
  ) => void;
  onRemove: () => void;
  role: string;
}

// Helper component for warning indicator
const WarningIndicator: React.FC<{ value: string | number }> = ({ value }) => {
  const strValue = String(value);
  // Check if value is empty string, or zero (0 or 0.0)
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

const convertMassToMg = (value: string | number, unit: string): number => {
  const val = parseFloat(String(value));
  if (isNaN(val)) return 1;

  const lowerUnit = unit.toLowerCase().trim();

  switch (lowerUnit) {
    case "mg":
    case "milligram":
      return val;
    case "g":
    case "gram":
      return val * 1000;
    case "kg":
    case "kilogram":
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
    case "µl":
    case "microliter":
      return val / 1000;
    default:
      return val;
  }
};

const CalculationDetailAssay: React.FC<CalculationDetailAssayProps> = ({
  calculation,
  standardPreparations,
  samplePreparations,
  onFieldChange,
  onRemove,
  role,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

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

  // Get current selected preparation label
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

  // Handle preparation pair selection
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

  // Extract dilution values from preparations
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
          step.name === "3rd Dilution" ||
          step.name === "4th Dilution"
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
      .filter(
        (step) =>
          step.name === "1st Dilution" ||
          step.name === "2nd Dilution" ||
          step.name === "3rd Dilution" ||
          step.name === "4th Dilution"
      )
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

  // Check if both preparations are selected
  const canCalculate =
    selectedStandardPrep && selectedSamplePrep && calculation.calculationFor;

  // --- Calculation Logic ---

  // Explicit mapping for Standard Volumes to avoid index overwrites
  const getStandardVolumes = () => {
    const stdVols: { [key: string]: number } = {};

    standardDilutions.forEach((dilution) => {
      const val1 = convertVolumeToMl(dilution.vol1, dilution.unit1);
      const val2 = convertVolumeToMl(dilution.vol2, dilution.unit2);

      if (dilution.name === "1st Dilution") {
        stdVols["V1"] = val1;
      } else if (dilution.name === "2nd Dilution") {
        stdVols["V2"] = val1;
        stdVols["V3"] = val2;
      } else if (dilution.name === "3rd Dilution") {
        stdVols["V4"] = val1;
        stdVols["V5"] = val2;
      } else if (dilution.name === "4th Dilution") {
        stdVols["V6"] = val1;
        stdVols["V7"] = val2;
      }
    });

    return stdVols;
  };

  // Explicit mapping for Sample Volumes
  const getSampleVolumes = () => {
    const splVols: { [key: string]: number } = {};

    sampleDilutions.forEach((dilution) => {
      const val1 = convertVolumeToMl(dilution.vol1, dilution.unit1);
      const val2 = convertVolumeToMl(dilution.vol2, dilution.unit2);

      if (dilution.name === "1st Dilution") {
        splVols["V8"] = val1;
      } else if (dilution.name === "2nd Dilution") {
        splVols["V9"] = val1;
        splVols["V10"] = val2;
      } else if (dilution.name === "3rd Dilution") {
        splVols["V11"] = val1;
        splVols["V12"] = val2;
      } else if (dilution.name === "4th Dilution") {
        splVols["V13"] = val1;
        splVols["V14"] = val2;
      }
    });

    return splVols;
  };

  const performCalculation = () => {
    console.group("🧪 Calculation Debugger Started");

    if (!canCalculate) {
      onFieldChange(
        calculation.id,
        "calculationResult",
        "Error: Please select both Standard and Sample preparations and a calculation type."
      );
      onFieldChange(calculation.id, "labelClaimPercent", null);
      onFieldChange(calculation.id, "lodWaterBasisResult", null);
      console.groupEnd();
      return;
    }

    const stdVols = getStandardVolumes();
    const splVols_all = getSampleVolumes();

    // 2. Parse Numbers & Apply Mass Conversion
    const AreaOfSample = parseFloat(calculation.areaOfSample as string) || 1;
    const AreaOfStandard =
      parseFloat(calculation.areaOfStandard as string) || 1;
    const SW1_Standard = convertMassToMg(
      standardWeight.value,
      standardWeight.unit
    );
    const SW2_Sample = convertMassToMg(sampleWeight.value, sampleWeight.unit);

    const MWBase = parseFloat(calculation.mwBase as string) || 1;
    const MWSalt = parseFloat(calculation.mwSalt as string) || 1;
    const Purity = parseFloat(calculation.purity as string) || 1;

    // 3. Volume Logic
    const allVols = { ...stdVols, ...splVols_all };
    console.log(
      "2. Volume Inputs Detected (All volumes converted to ML):",
      allVols
    );
    console.log(`   SW1 (Std Wt) converted to mg: ${SW1_Standard}`);
    console.log(`   SW2 (Spl Wt) converted to mg: ${SW2_Sample}`);

    let productEvens = 1;
    let productOdds = 1;
    let volumeLog = [];

    for (let i = 1; i <= 15; i++) {
      const key = `V${i}`;
      const val = allVols[key];

      if (val !== undefined && val !== null && !isNaN(val) && val !== 0) {
        if (i % 2 === 0) {
          productEvens *= val;
          volumeLog.push(`V${i}(${val}) -> Numerator`);
        } else {
          productOdds *= val;
          volumeLog.push(`V${i}(${val}) -> Denominator`);
        }
      }
    }

    console.log("3. Volume sorting:", volumeLog);
    const V_factor = productEvens / productOdds;
    console.log(
      `   V_factor Result: ${V_factor} (Evens: ${productEvens} / Odds: ${productOdds})`
    );

    // 4. Calculate Ratios
    const AreaRatio = AreaOfStandard !== 0 ? AreaOfSample / AreaOfStandard : 0;
    const MWRatio = MWSalt !== 0 ? MWBase / MWSalt : 1;
    const PurityFactor = Purity / 100;

    console.log("4. Intermediate Ratios:", {
      "Area Ratio (Spl/Std)": `${AreaOfSample} / ${AreaOfStandard} = ${AreaRatio}`,
      "MW Ratio (Base/Salt)": `${MWBase} / ${MWSalt} = ${MWRatio}`,
      "Purity Factor": `${Purity} / 100 = ${PurityFactor}`,
    });

    // 5. Final Switch Case Calculation
    let FinalResult = 0;
    let unit = "";
    let formulaDebugString = "";

    const commonPart = AreaRatio * V_factor * MWRatio * PurityFactor;

    switch (calculation.calculationFor) {
      case "Tablets":
      case "Capsule":
      case "Injection Vial": {
        const AvgWt = parseFloat(calculation.avgWeight as string) || 1;

        if (SW2_Sample !== 0) {
          FinalResult = (commonPart * SW1_Standard * AvgWt) / SW2_Sample;
        }

        formulaDebugString = `(${AreaRatio.toFixedNoRound(4)} * ${V_factor.toFixedNoRound(
          4
        )} * ${MWRatio.toFixedNoRound(
          4
        )} * ${PurityFactor} * ${SW1_Standard} * ${AvgWt}) / ${SW2_Sample}`;

        if (calculation.calculationFor === "Injection Vial") {
          unit = "mg/Vial";
        } else if (calculation.calculationFor === "Capsule") {
          unit = "mg/Capsule";
        } else {
          unit = "mg/Tablet";
        }
        break;
      }

      case "Oral Suspension": {
        const claim = parseFloat(calculation.claim as string) || 1;
        const WtPerML = parseFloat(calculation.avgWeight as string) || 1;

        if (SW2_Sample !== 0) {
          FinalResult =
            (commonPart * SW1_Standard * WtPerML * claim) / SW2_Sample;
        }

        formulaDebugString = `(${AreaRatio.toFixedNoRound(4)} * ${V_factor.toFixedNoRound(
          4
        )} * ${MWRatio.toFixedNoRound(
          4
        )} * ${PurityFactor} * ${SW1_Standard} * ${WtPerML} * ${claim}) / ${SW2_Sample}`;
        unit = "mg/ml";
        break;
      }

      case "Oral Liquid": {
        const claim = parseFloat(calculation.claim as string) || 1;
        const SampleVolume = convertVolumeToMl(calculation.avgWeight, "ml");

        if (SampleVolume !== 0) {
          FinalResult = (commonPart * SW1_Standard * claim) / SampleVolume;
        }

        formulaDebugString = `(${AreaRatio.toFixedNoRound(4)} * ${V_factor.toFixedNoRound(
          4
        )} * ${MWRatio.toFixedNoRound(
          4
        )} * ${PurityFactor} * ${SW1_Standard} * ${claim}) / ${SampleVolume}`;
        unit = "mg/ml";
        break;
      }

      case "Raw Material": {
        if (SW2_Sample !== 0) {
          const weightRatio = SW1_Standard / SW2_Sample;
          FinalResult = commonPart * weightRatio * 100;
        }

        formulaDebugString = `( ${AreaRatio.toFixedNoRound(4)} * ${V_factor.toFixedNoRound(
          4
        )} * ${MWRatio.toFixedNoRound(
          4
        )} * ${PurityFactor} * (${SW1_Standard} / ${SW2_Sample}) ) * 100`;
        unit = "%";
        break;
      }
    }

    if (isNaN(FinalResult) || !isFinite(FinalResult)) {
      onFieldChange(
        calculation.id,
        "calculationResult",
        "Error: Result is NaN or Infinite. Check console for details."
      );
      onFieldChange(calculation.id, "labelClaimPercent", null);
      onFieldChange(calculation.id, "lodWaterBasisResult", null);
    } else {
      const result = `${FinalResult.toFixedNoRound(4)}`;
      const resultUnit = `${unit}`;
      onFieldChange(calculation.id, "calculationResult", result);
      onFieldChange(calculation.id, "calculationResultUnit", resultUnit);

      // Calculate Label Claim Percentage for non-Raw Material types
      if (calculation.calculationFor !== "Raw Material") {
        const labelClaim = parseFloat(calculation.labelClaim as string);
        if (labelClaim && labelClaim > 0) {
          const percentOfLabelClaim = (FinalResult * 100) / labelClaim;
          onFieldChange(
            calculation.id,
            "labelClaimPercent",
            `${percentOfLabelClaim.toFixedNoRound(4)} %`
          );
        } else {
          onFieldChange(calculation.id, "labelClaimPercent", null);
        }
        onFieldChange(calculation.id, "lodWaterBasisResult", null);
      } else {
        // For Raw Material: Calculate adjusted basis
        const waterLod = parseFloat(calculation.lodWaterValue as string) || 0;
        if (waterLod >= 0) {
          const adjustedResult = (FinalResult * 100) / (100 - waterLod);
          const basisType =
            calculation.lodWaterType === "water"
              ? "As Anhydrous Basis"
              : "As Dried Basis";
          onFieldChange(
            calculation.id,
            "lodWaterBasisResult",
            `${adjustedResult.toFixedNoRound(4)} %`
          );
        } else {
          onFieldChange(calculation.id, "lodWaterBasisResult", null);
        }
        onFieldChange(calculation.id, "labelClaimPercent", null);
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="relative group"
    >
      <div className="relative bg-white/95 backdrop-blur-sm rounded-lg border border-red-200/50 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden mb-4">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-red-600 via-red-500 to-rose-500 overflow-hidden">
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
                <p className="text-xs text-red-100">
                  Calculation Details for Assay
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
              <div className="p-5 space-y-4 bg-gradient-to-br from-red-50/50 to-rose-50/30">
                {/* Selection Section */}
                <div className="grid grid-cols-1 gap-4">
                  {/* Single Preparation Selection */}
                  <div>
                    <label className="block text-xs font-semibold text-red-900 mb-2">
                      Select Preparation
                    </label>
                    <CustomDropdown
                      options={preparationPairs.map((pair) => ({
                        value: pair!.value,
                        label: pair!.label,
                      }))}
                      value={currentPrepLabel}
                      onChange={handlePreparationChange}
                      placeholder="-- Select Preparation --"
                      colorScheme="rose"
                    />
                  </div>
                </div>

                {/* Calculation Type Selection */}
                <div>
                  <label className="block text-xs font-semibold text-red-900 mb-2">
                    Calculation For
                  </label>
                  <CustomDropdown
                    options={calculationFor.map((type) => ({
                      value: type,
                      label: type,
                    }))}
                    value={calculation.calculationFor}
                    onChange={(value) =>
                      onFieldChange(calculation.id, "calculationFor", value)
                    }
                    placeholder="-- Select Calculation Type --"
                    colorScheme="rose"
                  />
                </div>

                {/* Display Selected Preparations Details */}
                {(selectedStandardPrep || selectedSamplePrep) && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="grid grid-cols-2 gap-5"
                  >
                    {/* Standard Preparation Details */}
                    {selectedStandardPrep && (
                      <div className="bg-gradient-to-br from-white to-red-50/50 rounded-xl border-2 border-red-300 p-5 shadow-lg hover:shadow-xl transition-all duration-300">
                        <h5 className="text-sm font-bold text-red-900 mb-4 flex items-center gap-2 pb-3 border-b-2 border-red-200">
                          <div className="w-3 h-3 bg-red-500 rounded-full shadow-lg shadow-red-500/50 animate-pulse"></div>
                          Standard Preparation Variables
                        </h5>
                        <div className="space-y-2.5">
                          {/* Weighing (SW1) */}
                          <div className="flex items-center justify-between gap-3 text-xs bg-gradient-to-r from-red-100 to-red-50 p-3 rounded-lg border border-red-200 hover:shadow-md transition-all">
                            <span className="font-bold text-red-800 bg-red-200/50 px-2 rounded-md">
                              SW1:
                            </span>
                            <span className="text-gray-800 font-semibold flex items-center">
                              {standardWeight.value} {standardWeight.unit}
                              <WarningIndicator value={standardWeight.value} />
                            </span>
                          </div>
                          {/* Dilutions */}
                          {standardDilutions.map((dilution, idx) => (
                            <div key={idx} className="space-y-2">
                              {/* V2, V4, V6, etc. (Aliquot) */}
                              {dilution.name !== "1st Dilution" && (
                                <div className="flex items-center justify-between gap-3 text-xs bg-gradient-to-r from-red-100 to-red-50 p-3 rounded-lg border border-red-200 hover:shadow-md transition-all">
                                  <span className="font-bold text-red-800 bg-red-200/50 px-2 rounded-md">
                                    V{idx * 2}:
                                  </span>
                                  <span className="text-gray-800 font-semibold flex items-center">
                                    {dilution.vol1} {dilution.unit1}
                                    <WarningIndicator value={dilution.vol1} />
                                  </span>
                                </div>
                              )}
                              {/* V1, V3, V5, V7, etc. (Final Volume) */}
                              <div className="flex items-center justify-between gap-3 text-xs bg-gradient-to-r from-red-100 to-red-50 p-3 rounded-lg border border-red-200 hover:shadow-md transition-all">
                                <span className="font-bold text-red-800 bg-red-200/50 px-2 rounded-md">
                                  V{idx * 2 + 1}:
                                </span>
                                <span className="text-gray-800 font-semibold flex items-center">
                                  {dilution.name === "1st Dilution"
                                    ? dilution.vol1
                                    : dilution.vol2}{" "}
                                  {dilution.name === "1st Dilution"
                                    ? dilution.unit1
                                    : dilution.unit2}
                                  <WarningIndicator
                                    value={
                                      dilution.name === "1st Dilution"
                                        ? dilution.vol1
                                        : dilution.vol2
                                    }
                                  />
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {selectedSamplePrep && (
                      <div className="bg-gradient-to-br from-white to-red-50/50 rounded-xl border-2 border-red-300 p-5 shadow-lg hover:shadow-xl transition-all duration-300">
                        <h5 className="text-sm font-bold text-red-900 mb-4 flex items-center gap-2 pb-3 border-b-2 border-red-200">
                          <div className="w-3 h-3 bg-red-500 rounded-full shadow-lg shadow-red-500/50 animate-pulse"></div>
                          Sample Preparation Variables
                        </h5>
                        <div className="space-y-2.5">
                          {/* Weighing (SW2) */}
                          <div className="flex items-center justify-between gap-3 text-xs bg-gradient-to-r from-red-100 to-red-50 p-3 rounded-lg border border-red-200 hover:shadow-md transition-all">
                            <span className="font-bold text-red-800 bg-red-200/50 px-2 rounded-md">
                              SW2:
                            </span>
                            <span className="text-gray-800 font-semibold flex items-center">
                              {sampleWeight.value} {sampleWeight.unit}
                              <WarningIndicator value={sampleWeight.value} />
                            </span>
                          </div>
                          {/* Dilutions */}
                          {sampleDilutions.map((dilution, idx) => (
                            <div key={idx} className="space-y-2">
                              {/* V9, V11, V13 etc. (Aliquot) */}
                              {dilution.name !== "1st Dilution" && (
                                <div className="flex items-center justify-between gap-3 text-xs bg-gradient-to-r from-red-100 to-red-50 p-3 rounded-lg border border-red-200 hover:shadow-md transition-all">
                                  <span className="font-bold text-red-800 bg-red-200/50 px-2 rounded-md">
                                    V{idx * 2 + 7}:
                                  </span>
                                  <span className="text-gray-800 font-semibold flex items-center">
                                    {dilution.vol1} {dilution.unit1}
                                    <WarningIndicator value={dilution.vol1} />
                                  </span>
                                </div>
                              )}
                              {/* V8, V10, V12, V14, etc. (Final Volume) */}
                              <div className="flex items-center justify-between gap-3 text-xs bg-gradient-to-r from-red-100 to-red-50 p-3 rounded-lg border border-red-200 hover:shadow-md transition-all">
                                <span className="font-bold text-red-800 bg-red-200/50 px-2 rounded-md">
                                  V{idx * 2 + 8}:
                                </span>
                                <span className="text-gray-800 font-semibold flex items-center">
                                  {dilution.name === "1st Dilution"
                                    ? dilution.vol1
                                    : dilution.vol2}{" "}
                                  {dilution.name === "1st Dilution"
                                    ? dilution.unit1
                                    : dilution.unit2}
                                  <WarningIndicator
                                    value={
                                      dilution.name === "1st Dilution"
                                        ? dilution.vol1
                                        : dilution.vol2
                                    }
                                  />
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}

                {/* Calculation Formula Section */}
                {calculation.calculationFor && canCalculate && (
                  <div className="bg-white rounded-lg border-2 border-red-300 shadow-md overflow-hidden">
                    <div className="bg-gradient-to-r from-red-600 to-rose-600 px-4 py-2">
                      <h5 className="text-sm font-bold text-white flex items-center gap-2">
                        <Calculator className="w-4 h-4" />
                        Calculation Formula Inputs
                      </h5>
                    </div>

                    <div className="p-4 space-y-4">
                      {/* Area/ABS Inputs */}
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-semibold text-red-900 mb-1">
                            Area/ABS of Sample
                          </label>
                          <input
                            type="text"
                            value={calculation.areaOfSample}
                            onChange={(e) =>
                              onFieldChange(
                                calculation.id,
                                "areaOfSample",
                                e.target.value
                              )
                            }
                            placeholder="Enter Sample Area/ABS"
                            className="w-full px-3 py-2 border border-red-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-red-400"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-red-900 mb-1">
                            Area/ABS of Standard
                          </label>
                          <input
                            type="text"
                            value={calculation.areaOfStandard}
                            onChange={(e) =>
                              onFieldChange(
                                calculation.id,
                                "areaOfStandard",
                                e.target.value
                              )
                            }
                            placeholder="Enter Standard Area/ABS"
                            className="w-full px-3 py-2 border border-red-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-red-400"
                          />
                        </div>
                      </div>

                      {/* MW & Purity Parameters */}
                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <label className="block text-xs font-semibold text-red-900 mb-1">
                            Purity %
                          </label>
                          <input
                            type="text"
                            value={calculation.purity}
                            onChange={(e) =>
                              onFieldChange(
                                calculation.id,
                                "purity",
                                e.target.value
                              )
                            }
                            placeholder="Purity"
                            className="w-full px-3 py-2 border border-red-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-red-400"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-red-900 mb-1">
                            MW Base
                          </label>
                          <input
                            type="text"
                            value={calculation.mwBase}
                            onChange={(e) =>
                              onFieldChange(
                                calculation.id,
                                "mwBase",
                                e.target.value
                              )
                            }
                            placeholder="MW Base"
                            className="w-full px-3 py-2 border border-red-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-red-400"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-red-900 mb-1">
                            MW Salt
                          </label>
                          <input
                            type="text"
                            value={calculation.mwSalt}
                            onChange={(e) =>
                              onFieldChange(
                                calculation.id,
                                "mwSalt",
                                e.target.value
                              )
                            }
                            placeholder="MW Salt"
                            className="w-full px-3 py-2 border border-red-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-red-400"
                          />
                        </div>
                      </div>

                      {/* Additional Fields based on Calculation Type */}
                      {calculation.calculationFor === "Raw Material" ? (
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-semibold text-red-900 mb-1">
                              Water/LOD Type
                            </label>
                            <CustomDropdown
                              options={[
                                { value: "water", label: "Water" },
                                { value: "lod", label: "LOD" },
                              ]}
                              value={calculation.lodWaterType || "water"}
                              onChange={(value) =>
                                onFieldChange(
                                  calculation.id,
                                  "lodWaterType",
                                  value
                                )
                              }
                              placeholder="Select Type"
                              colorScheme="rose"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-red-900 mb-1">
                              {calculation.lodWaterType === "lod"
                                ? "LOD"
                                : "Water"}{" "}
                              Value (%)
                            </label>
                            <input
                              type="number"
                              step="0.01"
                              value={calculation.lodWaterValue || ""}
                              onChange={(e) =>
                                onFieldChange(
                                  calculation.id,
                                  "lodWaterValue",
                                  e.target.value
                                )
                              }
                              placeholder={`Enter ${
                                calculation.lodWaterType === "lod"
                                  ? "LOD"
                                  : "Water"
                              } %`}
                              className="w-full px-3 py-2 border border-red-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-red-400"
                            />
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="grid grid-cols-3 gap-3">
                            {(calculation.calculationFor === "Tablets" ||
                              calculation.calculationFor === "Capsule" ||
                              calculation.calculationFor ===
                                "Injection Vial" ||
                              calculation.calculationFor ===
                                "Oral Suspension" ||
                              calculation.calculationFor ===
                                "Oral Liquid") && (
                              <div>
                                <label className="block text-xs font-semibold text-red-900 mb-1">
                                  {calculation.calculationFor ===
                                  "Oral Suspension"
                                    ? "Wt / ml (Avg Wt) (mg/ml)"
                                    : calculation.calculationFor ===
                                      "Oral Liquid"
                                    ? "Sample Vol (mL/L)"
                                    : calculation.calculationFor ===
                                      "Injection Vial"
                                    ? "Average Content (mg)"
                                    : "Avg Weight (mg)"}
                                </label>

                                <input
                                  type="text"
                                  value={
                                    calculation.calculationFor ===
                                    "Oral Liquid"
                                      ? calculation.sampleVol
                                      : calculation.calculationFor ===
                                        "Injection Vial"
                                      ? calculation.avgContent
                                      : calculation.avgWeight
                                  }
                                  onChange={(e) => {
                                    const value = e.target.value;

                                    if (
                                      calculation.calculationFor ===
                                      "Oral Suspension"
                                    ) {
                                      onFieldChange(
                                        calculation.id,
                                        "avgWeight",
                                        value
                                      );
                                      onFieldChange(
                                        calculation.id,
                                        "avgWeightUnit",
                                        "mg/ml"
                                      );
                                    } else if (
                                      calculation.calculationFor ===
                                      "Oral Liquid"
                                    ) {
                                      onFieldChange(
                                        calculation.id,
                                        "sampleVol",
                                        value
                                      );
                                      onFieldChange(
                                        calculation.id,
                                        "sampleVolUnit",
                                        "ml/L"
                                      );
                                    } else if (
                                      calculation.calculationFor ===
                                      "Injection Vial"
                                    ) {
                                      onFieldChange(
                                        calculation.id,
                                        "avgContent",
                                        value
                                      );
                                      onFieldChange(
                                        calculation.id,
                                        "avgContentUnit",
                                        "mg"
                                      );
                                    } else {
                                      onFieldChange(
                                        calculation.id,
                                        "avgWeight",
                                        value
                                      );
                                      onFieldChange(
                                        calculation.id,
                                        "avgWeightUnit",
                                        "mg"
                                      );
                                    }
                                  }}
                                  placeholder={
                                    calculation.calculationFor ===
                                    "Oral Suspension"
                                      ? "Wt / ml"
                                      : calculation.calculationFor ===
                                        "Oral Liquid"
                                      ? "Sample Vol"
                                      : calculation.calculationFor ===
                                        "Injection Vial"
                                      ? "Average Content"
                                      : "Avg Wt"
                                  }
                                  className="w-full px-3 py-2 border border-red-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-red-400"
                                />
                              </div>
                            )}

                            {(calculation.calculationFor ===
                              "Oral Suspension" ||
                              calculation.calculationFor ===
                                "Oral Liquid") && (
                              <div>
                                <label className="block text-xs font-semibold text-red-900 mb-1">
                                  Claim (ml)
                                </label>
                                <input
                                  type="text"
                                  value={calculation.claim}
                                  onChange={(e) => {
                                    onFieldChange(
                                      calculation.id,
                                      "claim",
                                      e.target.value
                                    );
                                    onFieldChange(
                                      calculation.id,
                                      "claimUnit",
                                      "ml"
                                    );
                                  }}
                                  placeholder="Claim Vol"
                                  className="w-full px-3 py-2 border border-red-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-red-400"
                                />
                              </div>
                            )}

                            <div>
                              <label className="block text-xs font-semibold text-red-900 mb-1">
                                Label Claim (mg)
                              </label>
                              <input
                                type="text"
                                step="0.01"
                                value={calculation.labelClaim ?? ""}
                                onChange={(e) =>
                                  onFieldChange(
                                    calculation.id,
                                    "labelClaim",
                                    e.target.value
                                  )
                                }
                                placeholder="Label Claim"
                                className="w-full px-3 py-2 border border-red-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-red-400"
                              />
                            </div>
                          </div>
                        </>
                      )}

                      {/* Calculate Button */}
                      <div className="flex justify-center pt-2">
                        <motion.button
                          onClick={performCalculation}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-red-600 to-rose-600 text-white font-semibold rounded-lg hover:from-red-700 hover:to-rose-700 transition-all shadow-md hover:shadow-lg text-sm"
                        >
                          <Calculator className="w-4 h-4" />
                          Calculate Result
                        </motion.button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Warning if preparations not selected */}
                {(!selectedStandardPrep || !selectedSamplePrep) && (
                  <div className="bg-amber-50 border-2 border-amber-300 rounded-lg p-3 text-center">
                    <p className="text-xs text-amber-800 font-medium">
                      Please select a preparation to enable calculation
                    </p>
                  </div>
                )}
              </div>

              {/* FIXED BOTTOM RESULTS SECTION - NON-CLOSABLE */}
              {calculation.calculationResult && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="border-t-4 border-red-200"
                >
                  <div
                    className={`p-6 ${
                      calculation.calculationResult.startsWith("Error")
                        ? "bg-gradient-to-br from-red-50 via-red-100/50 to-rose-50"
                        : "bg-gradient-to-br from-emerald-50 via-green-100/30 to-teal-50"
                    }`}
                  >
                    <div className="max-w-4xl mx-auto space-y-4">
                      {/* Header */}
                      <div className="flex items-center gap-3 pb-3">
                        <CheckCircle2
                          className={`w-6 h-6 ${
                            calculation.calculationResult.startsWith("Error")
                              ? "text-red-700"
                              : "text-green-700"
                          }`}
                        />
                        <div>
                          <h6
                            className={`text-lg font-bold ${
                              calculation.calculationResult.startsWith("Error")
                                ? "text-red-700"
                                : "text-green-700"
                            }`}
                          >
                            Calculation Results
                          </h6>
                        </div>
                      </div>

                      {/* Results Grid */}
                      <div className="grid gap-4">
                        {/* Results Row - Primary and Secondary in single row */}
                        <div
                          className={`grid gap-4 ${
                            calculation.labelClaimPercent ||
                            calculation.lodWaterBasisResult
                              ? "md:grid-cols-2"
                              : "md:grid-cols-1"
                          }`}
                        >
                          {/* Main Result */}
                          <div className="bg-white rounded-lg shadow-lg border-2 border-green-300 overflow-hidden">
                            <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-4 py-2">
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

                          {/* Secondary Result - Show one at a time */}
                          {calculation.labelClaimPercent && (
                            <div className="bg-white rounded-lg shadow-lg border-2 border-blue-300 overflow-hidden">
                              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2">
                                <h6 className="text-sm font-bold text-white">
                                  Label Claim Percentage
                                </h6>
                              </div>
                              <div className="p-4">
                                <p className="text-xl font-bold text-blue-700">
                                  {calculation.labelClaimPercent}
                                </p>
                              </div>
                            </div>
                          )}

                          {!calculation.labelClaimPercent &&
                            calculation.lodWaterBasisResult && (
                              <div className="bg-white rounded-lg shadow-lg border-2 border-purple-300 overflow-hidden">
                                <div className="bg-gradient-to-r from-purple-600 to-violet-600 px-4 py-2">
                                  <h6 className="text-sm font-bold text-white">
                                    Adjusted Basis
                                  </h6>
                                </div>
                                <div className="p-4">
                                  <p className="text-xl font-bold text-purple-700">
                                    {calculation.lodWaterBasisResult}
                                  </p>
                                </div>
                              </div>
                            )}
                        </div>

                        {/* Third Result - Show Adjusted Basis in separate row if Label Claim exists */}
                        {calculation.labelClaimPercent &&
                          calculation.lodWaterBasisResult && (
                            <div className="bg-white rounded-lg shadow-lg border-2 border-purple-300 overflow-hidden">
                              <div className="bg-gradient-to-r from-purple-600 to-violet-600 px-4 py-2">
                                <h6 className="text-sm font-bold text-white">
                                  Adjusted Basis
                                </h6>
                              </div>
                              <div className="p-4">
                                <p className="text-xl font-bold text-purple-700">
                                  {calculation.lodWaterBasisResult}
                                </p>
                              </div>
                            </div>
                          )}
                      </div>

                      {/* Summary Info */}
                      <div className="bg-white/80 backdrop-blur-sm rounded-lg border border-gray-200 p-4">
                        <div className="grid md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <p className="text-gray-600 font-medium">
                              Calculation Type
                            </p>
                            <p className="text-gray-900 font-semibold">
                              {calculation.calculationFor}
                            </p>
                          </div>
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

export default CalculationDetailAssay;
