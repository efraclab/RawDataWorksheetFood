import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  Calculator,
  Trash,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";
import type { CalculationDisso } from "../../preparation_models/CalculationDisso";
import type { StandardPreparation } from "../../preparation_models/StandardPreparation";
import type { SamplePreparationDisso } from "../../preparation_models/SamplePreparationDisso";
import CustomDropdown from "../shared/CustomDropdown";

interface CalculationDetailDissoProps {
  calculation: CalculationDisso;
  standardPreparations: StandardPreparation[];
  samplePreparationsDisso: SamplePreparationDisso[];
  onFieldChange: (
    calculationId: number,
    field: keyof CalculationDisso,
    value: string | number | null
  ) => void;
  onRemove: () => void;
  role: string;
}

interface TabletResult {
  tabletNumber: number;
  result: number | string;
  unit: string;
}

interface SummaryResults {
  min: number;
  max: number;
  avg: number;
  unit: string;
}

// Helper component for warning indicator
const WarningIndicator: React.FC<{ value: string | number }> = ({ value }) => {
  const strValue = String(value);
  const isInvalid = strValue.trim() === "" || parseFloat(strValue) === 0;

  if (isInvalid) {
    return (
      <span
        className="text-amber-500 ml-2"
        title="Missing or zero value detected"
      >
        <AlertTriangle className="w-4 h-4 inline-block" />
      </span>
    );
  }
  return null;
};

// Unit conversion helpers
const convertMassToMg = (value: string | number, unit: string): number => {
  const val = parseFloat(String(value));
  if (isNaN(val)) return 1;

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
      return val;
    case "l":
      return val * 1000;
    case "ul":
    case "µl":
      return val / 1000;
    default:
      return val;
  }
};

const CalculationDetailDisso: React.FC<CalculationDetailDissoProps> = ({
  calculation,
  standardPreparations,
  samplePreparationsDisso,
  onFieldChange,
  onRemove,
  role,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [tabletResults, setTabletResults] = useState<TabletResult[]>([]);
  const [summaryResults, setSummaryResults] = useState<SummaryResults | null>(
    null
  );

  const selectedStandardPrep = standardPreparations.find(
    (prep) => prep.label === calculation.selectedStandardPrepLabel
  );

  const selectedSamplePrepDisso = samplePreparationsDisso.find(
    (prep) => prep.label === calculation.selectedSamplePrepLabel
  );

  // Create preparation pair options - simplified to 1:1 mapping
  const preparationPairs = standardPreparations
    .map((stdPrep, stdIdx) => {
      const matchingSamplePrep = samplePreparationsDisso[stdIdx];

      if (matchingSamplePrep) {
        return {
          value: `${stdPrep.label}-${matchingSamplePrep.label}`,
          label: `Preparation ${stdIdx + 1}`,
          standardLabel: stdPrep.label,
          sampleLabel: matchingSamplePrep.label,
        };
      }
      return null;
    })
    .filter(Boolean) as {
    value: string;
    label: string;
    standardLabel: string;
    sampleLabel: string;
  }[];

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

  // Load existing results when component mounts or calculation changes
  useEffect(() => {
    const existingResults: TabletResult[] = [];
    const resultFields = [
      { num: 1, value: calculation.calculationResultTablet1 },
      { num: 2, value: calculation.calculationResultTablet2 },
      { num: 3, value: calculation.calculationResultTablet3 },
      { num: 4, value: calculation.calculationResultTablet4 },
      { num: 5, value: calculation.calculationResultTablet5 },
      { num: 6, value: calculation.calculationResultTablet6 },
    ];

    resultFields.forEach(({ num, value }) => {
      if (value && value.trim() !== "") {
        const numericValue = parseFloat(value);
        existingResults.push({
          tabletNumber: num,
          result: isNaN(numericValue) ? value : numericValue,
          unit: calculation.calculationResultUnit || "mg/tablet",
        });
      }
    });

    if (existingResults.length > 0) {
      setTabletResults(existingResults);

      // Calculate summary if we have valid numeric results
      const validResults = existingResults
        .filter((r) => typeof r.result === "number")
        .map((r) => r.result as number);

      if (validResults.length > 0) {
        const min = Math.min(...validResults);
        const max = Math.max(...validResults);
        const sum = validResults.reduce((acc, val) => acc + val, 0);
        const avg = sum / validResults.length;

        setSummaryResults({
          min: parseFloat(min.toFixed(4)),
          max: parseFloat(max.toFixed(4)),
          avg: parseFloat(avg.toFixed(4)),
          unit: calculation.calculationResultUnit || "mg/tablet",
        });
      }
    }
  }, [calculation.id]);

  const handlePreparationChange = (value: string) => {
    const selectedPair = preparationPairs.find((pair) => pair.value === value);

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

  // Extract dilution values from standard preparation
  const getStandardDilutions = () => {
    if (!selectedStandardPrep) return [];
    return selectedStandardPrep.steps
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

  // Extract dilution values from sample preparation (Dissolution)
  const getSampleDilutions = () => {
    if (!selectedSamplePrepDisso) return [];
    return selectedSamplePrepDisso.steps
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

  const getStandardWeight = () => {
    if (!selectedStandardPrep) return { value: "", unit: "g" };
    const weighingStep = selectedStandardPrep.steps.find(
      (step) => step.name === "Weighing"
    );
    return {
      value: weighingStep?.value1 || "",
      unit: weighingStep?.unit1 || "g",
    };
  };

  const getTabletDetails = () => {
    if (!selectedSamplePrepDisso)
      return { claim: "", claimUnit: "mg", mediaVol: "", unit: "ml" };
    const tabletStep = selectedSamplePrepDisso.steps.find(
      (step) => step.name === "Tablet Details"
    );
    return {
      claim: tabletStep?.value1 || "",
      claimUnit: tabletStep?.unit1 || "mg",
      mediaVol: tabletStep?.value2 || "",
      unit: tabletStep?.unit2 || "ml",
    };
  };

  const standardDilutions = getStandardDilutions();
  const sampleDilutions = getSampleDilutions();
  const standardWeight = getStandardWeight();
  const tabletDetails = getTabletDetails();

  const canCalculate = selectedStandardPrep && selectedSamplePrepDisso;

  const calculateSingleTablet = (sampleAreaValue: string): number | string => {
    if (!canCalculate) {
      return "Missing preparations";
    }

    const AreaOfSample = parseFloat(sampleAreaValue);
    const AreaOfStandard =
      parseFloat(calculation.areaOfStandard as string) || 1;

    if (isNaN(AreaOfSample) || isNaN(AreaOfStandard)) {
      return "Invalid Input";
    }

    const SW1_Standard = convertMassToMg(
      standardWeight.value,
      standardWeight.unit
    );
    const MWBase = parseFloat(calculation.mwBase as string) || 1;
    const MWSalt = parseFloat(calculation.mwSalt as string) || 1;
    const Purity = parseFloat(calculation.purity as string) || 1;

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

    const V6 = standardDilutions[3]
      ? convertVolumeToMl(standardDilutions[3].vol1, standardDilutions[3].unit1)
      : 1;
    const V7 = standardDilutions[3]
      ? convertVolumeToMl(standardDilutions[3].vol2, standardDilutions[3].unit2)
      : 1;

    const MediaVol = convertVolumeToMl(
      tabletDetails.mediaVol,
      tabletDetails.unit
    );
    const Claim = convertMassToMg(tabletDetails.claim, tabletDetails.claimUnit);

    const V9 = sampleDilutions[0]
      ? convertVolumeToMl(sampleDilutions[0].vol1, sampleDilutions[0].unit1)
      : 0;
    const V10 = sampleDilutions[0]
      ? convertVolumeToMl(sampleDilutions[0].vol2, sampleDilutions[0].unit2)
      : 0;

    const V11 = sampleDilutions[1]
      ? convertVolumeToMl(sampleDilutions[1].vol1, sampleDilutions[1].unit1)
      : 0;
    const V12 = sampleDilutions[1]
      ? convertVolumeToMl(sampleDilutions[1].vol2, sampleDilutions[1].unit2)
      : 0;

    const V13 = sampleDilutions[2]
      ? convertVolumeToMl(sampleDilutions[2].vol1, sampleDilutions[2].unit1)
      : 0;
    const V14 = sampleDilutions[2]
      ? convertVolumeToMl(sampleDilutions[2].vol2, sampleDilutions[2].unit2)
      : 0;

    const numerator =
      AreaOfSample *
      SW1_Standard *
      V2 *
      V4 *
      V6 *
      MediaVol *
      V10 *
      V12 *
      V14 *
      MWBase *
      Purity *
      100;

    const denominator =
      AreaOfStandard *
      V1 *
      V3 *
      V5 *
      V7 *
      Claim *
      V9 *
      V11 *
      V13 *
      MWSalt *
      100;

    if (denominator === 0) {
      return "Error: Division by zero";
    }

    const result = numerator / denominator;

    if (isNaN(result) || !isFinite(result)) {
      return "Error: Invalid calculation";
    }

    return parseFloat(result.toFixed(4));
  };

  const performCalculation = () => {
    console.group("🧪 Dissolution Calculation Started");

    if (!canCalculate) {
      console.warn("Cannot calculate: Missing preparations");
      setTabletResults([]);
      setSummaryResults(null);
      console.groupEnd();
      return;
    }

    const sampleAreas = [
      calculation.areaOfSample1,
      calculation.areaOfSample2,
      calculation.areaOfSample3,
      calculation.areaOfSample4,
      calculation.areaOfSample5,
      calculation.areaOfSample6,
    ];

    const results: TabletResult[] = [];
    const validResults: number[] = [];
    const resultFields: Array<keyof CalculationDisso> = [
      "calculationResultTablet1",
      "calculationResultTablet2",
      "calculationResultTablet3",
      "calculationResultTablet4",
      "calculationResultTablet5",
      "calculationResultTablet6",
    ];

    sampleAreas.forEach((area, index) => {
      if (area && area.trim() !== "") {
        const result = calculateSingleTablet(area);

        if (typeof result === "number") {
          results.push({
            tabletNumber: index + 1,
            result: result,
            unit: "mg/tablet",
          });
          validResults.push(result);

          // Store individual tablet result
          onFieldChange(calculation.id, resultFields[index], result.toFixed(4));
        } else {
          results.push({
            tabletNumber: index + 1,
            result: result,
            unit: "",
          });

          // Store error message
          onFieldChange(calculation.id, resultFields[index], result);
        }
      } else {
        // Clear the result if area is empty
        onFieldChange(calculation.id, resultFields[index], null);
      }
    });

    setTabletResults(results);

    // Calculate summary statistics
    if (validResults.length > 0) {
      const min = Math.min(...validResults);
      const max = Math.max(...validResults);
      const sum = validResults.reduce((acc, val) => acc + val, 0);
      const avg = sum / validResults.length;

      const summaryData = {
        min: parseFloat(min.toFixed(4)),
        max: parseFloat(max.toFixed(4)),
        avg: parseFloat(avg.toFixed(4)),
        unit: "mg/tablet",
      };

      setSummaryResults(summaryData);

      // Store summary in calculationResult field
      const summaryText = `Min: ${summaryData.min}, Avg: ${summaryData.avg}, Max: ${summaryData.max}`;
      onFieldChange(calculation.id, "calculationResult", summaryText);
      onFieldChange(calculation.id, "calculationResultUnit", "mg/tablet");

      console.log("Calculation completed successfully");
      console.log("Results:", { min, max, avg, count: validResults.length });
    } else {
      setSummaryResults(null);
      onFieldChange(calculation.id, "calculationResult", null);
      console.warn("No valid results calculated");
    }

    console.groupEnd();
  };

  // Helper function to get sample area field name
  const getSampleAreaField = (index: number): keyof CalculationDisso => {
    const fields: Array<keyof CalculationDisso> = [
      "areaOfSample1",
      "areaOfSample2",
      "areaOfSample3",
      "areaOfSample4",
      "areaOfSample5",
      "areaOfSample6",
    ];
    return fields[index];
  };

  // Helper function to get sample area value
  const getSampleAreaValue = (index: number): string => {
    const fields = [
      calculation.areaOfSample1,
      calculation.areaOfSample2,
      calculation.areaOfSample3,
      calculation.areaOfSample4,
      calculation.areaOfSample5,
      calculation.areaOfSample6,
    ];
    return fields[index] || "";
  };

  const handleSampleAreaChange = (index: number, value: string) => {
    const field = getSampleAreaField(index);
    onFieldChange(calculation.id, field, value);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="relative group z-20"
    >
      <div className="relative bg-white/95 backdrop-blur-sm rounded-lg border border-emerald-200/50 shadow-lg hover:shadow-xl transition-all duration-300 mb-4">
        {/* Header */}
        <div
          className={`relative bg-gradient-to-r from-emerald-600 via-emerald-500 to-green-500 ${
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
                  Dissolution Calculation
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

        {/* Content */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <div className="p-5 space-y-4 bg-gradient-to-br from-emerald-50/50 to-green-50/30">
                {/* Selection Section */}
                <div className="grid grid-cols-1 gap-4">
                  {/* Single Preparation Selection */}
                  <div>
                    <label className="block text-xs font-semibold text-emerald-900 mb-1">
                      Select Preparation
                    </label>
                    <CustomDropdown
                      options={preparationPairs.map((pair) => ({
                        value: pair.value,
                        label: pair.label,
                      }))}
                      value={
                        calculation.selectedStandardPrepLabel &&
                        calculation.selectedSamplePrepLabel
                          ? `${calculation.selectedStandardPrepLabel}-${calculation.selectedSamplePrepLabel}`
                          : ""
                      }
                      onChange={handlePreparationChange}
                      placeholder="Select preparation"
                      colorScheme="emerald"
                    />
                  </div>
                </div>

                {/* Display Selected Preparations Details */}
                {(selectedStandardPrep || selectedSamplePrepDisso) && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="grid grid-cols-2 gap-5"
                  >
                    {/* Standard Preparation Details */}
                    {selectedStandardPrep && (
                      <div className="bg-gradient-to-br from-white to-emerald-50/50 rounded-xl border-2 border-emerald-300 p-5 shadow-lg hover:shadow-xl transition-all duration-300">
                        <h5 className="text-sm font-bold text-emerald-900 mb-4 flex items-center gap-2 pb-3 border-b-2 border-emerald-200">
                          <div className="w-3 h-3 bg-emerald-500 rounded-full shadow-lg shadow-emerald-500/50 animate-pulse"></div>
                          Standard Preparation Variables
                        </h5>
                        <div className="space-y-2.5">
                          {/* SW1 */}
                          <div className="flex items-center justify-between gap-3 text-xs bg-gradient-to-r from-emerald-100 to-emerald-50 p-3 rounded-lg border border-emerald-200">
                            <span className="font-bold text-emerald-800 bg-emerald-200/50 px-2 rounded-md">
                              SW1:
                            </span>
                            <span className="text-gray-800 font-semibold flex items-center">
                              {standardWeight.value} {standardWeight.unit}
                              <WarningIndicator value={standardWeight.value} />
                            </span>
                          </div>
                          {/* V1, V2, V3, V4, V5, V6, V7 */}
                          {standardDilutions.map((dilution, idx) => (
                            <div key={idx} className="space-y-2">
                              {dilution.name !== "1st Dilution" && (
                                <div className="flex items-center justify-between gap-3 text-xs bg-gradient-to-r from-emerald-100 to-emerald-50 p-3 rounded-lg border border-emerald-200">
                                  <span className="font-bold text-emerald-800 bg-emerald-200/50 px-2 rounded-md">
                                    V{idx * 2}:
                                  </span>
                                  <span className="text-gray-800 font-semibold flex items-center">
                                    {dilution.vol1} {dilution.unit1}
                                    <WarningIndicator value={dilution.vol1} />
                                  </span>
                                </div>
                              )}
                              <div className="flex items-center justify-between gap-3 text-xs bg-gradient-to-r from-emerald-100 to-emerald-50 p-3 rounded-lg border border-emerald-200">
                                <span className="font-bold text-emerald-800 bg-emerald-200/50 px-2 rounded-md">
                                  V
                                  {dilution.name === "1st Dilution"
                                    ? "1"
                                    : idx * 2 + 1}
                                  :
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

                    {/* Sample Preparation (Dissolution) Details */}
                    {selectedSamplePrepDisso && (
                      <div className="bg-gradient-to-br from-white to-emerald-50/50 rounded-xl border-2 border-emerald-300 p-5 shadow-lg hover:shadow-xl transition-all duration-300">
                        <h5 className="text-sm font-bold text-emerald-900 mb-4 flex items-center gap-2 pb-3 border-b-2 border-emerald-200">
                          <div className="w-3 h-3 bg-emerald-500 rounded-full shadow-lg shadow-emerald-500/50 animate-pulse"></div>
                          Sample Preparation Variables
                        </h5>
                        <div className="space-y-2.5">
                          {/* Claim */}
                          <div className="flex items-center justify-between gap-3 text-xs bg-gradient-to-r from-emerald-100 to-emerald-50 p-3 rounded-lg border border-emerald-200">
                            <span className="font-bold text-emerald-800 bg-emerald-200/50 px-2 rounded-md">
                              Claim:
                            </span>
                            <span className="text-gray-800 font-semibold flex items-center">
                              {tabletDetails.claim} mg
                              <WarningIndicator value={tabletDetails.claim} />
                            </span>
                          </div>
                          {/* Media Volume (V8) */}
                          <div className="flex items-center justify-between gap-3 text-xs bg-gradient-to-r from-emerald-100 to-emerald-50 p-3 rounded-lg border border-emerald-200">
                            <span className="font-bold text-emerald-800 bg-emerald-200/50 px-2 rounded-md">
                              Media Vol (V8):
                            </span>
                            <span className="text-gray-800 font-semibold flex items-center">
                              {tabletDetails.mediaVol} {tabletDetails.unit}
                              <WarningIndicator
                                value={tabletDetails.mediaVol}
                              />
                            </span>
                          </div>
                          {/* V9, V10, V11, V12, V13, V14 */}
                          {sampleDilutions.map((dilution, idx) => (
                            <div key={idx} className="space-y-2">
                              <div className="flex items-center justify-between gap-3 text-xs bg-gradient-to-r from-emerald-100 to-emerald-50 p-3 rounded-lg border border-emerald-200">
                                <span className="font-bold text-emerald-800 bg-emerald-200/50 px-2 rounded-md">
                                  V{idx * 2 + 9}:
                                </span>
                                <span className="text-gray-800 font-semibold flex items-center">
                                  {dilution.vol1} {dilution.unit1}
                                  <WarningIndicator value={dilution.vol1} />
                                </span>
                              </div>
                              <div className="flex items-center justify-between gap-3 text-xs bg-gradient-to-r from-emerald-100 to-emerald-50 p-3 rounded-lg border border-emerald-200">
                                <span className="font-bold text-emerald-800 bg-emerald-200/50 px-2 rounded-md">
                                  V{idx * 2 + 10}:
                                </span>
                                <span className="text-gray-800 font-semibold flex items-center">
                                  {dilution.vol2} {dilution.unit2}
                                  <WarningIndicator value={dilution.vol2} />
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
                {canCalculate && (
                  <div className="bg-white rounded-lg border-2 border-emerald-300 shadow-md overflow-hidden">
                    <div className="bg-gradient-to-r from-emerald-600 to-green-600 px-4 py-2">
                      <h5 className="text-sm font-bold text-white flex items-center gap-2">
                        <Calculator className="w-4 h-4" />
                        Calculation Formula Inputs
                      </h5>
                    </div>

                    <div className="p-4 space-y-4">
                      {/* Area/ABS of Standard */}
                      <div>
                        <label className="block text-xs font-semibold text-emerald-900 mb-1">
                          Area/ABS of Standard
                        </label>
                        <input
                          type="number"
                          value={calculation.areaOfStandard}
                          onChange={(e) =>
                            onFieldChange(
                              calculation.id,
                              "areaOfStandard",
                              e.target.value
                            )
                          }
                          onKeyDown={(e) => {
                            if (e.key === "ArrowUp" || e.key === "ArrowDown") {
                              e.preventDefault();
                            }
                          }}
                          onWheel={(e) => e.currentTarget.blur()}
                          placeholder="Enter Standard Area/ABS"
                          className="w-full px-3 py-2 border border-emerald-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-emerald-400"
                        />
                      </div>

                      {/* 6 Sample Area/ABS Inputs */}
                      <div>
                        <label className="block text-xs font-semibold text-emerald-900 mb-2">
                          Area/ABS of Samples (6 Tablets)
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                          {[1, 2, 3, 4, 5, 6].map((tabletNum) => (
                            <div key={tabletNum}>
                              <label className="block text-xs font-medium text-gray-700 mb-1">
                                Sample {tabletNum}
                              </label>
                              <input
                                type="number"
                                value={getSampleAreaValue(tabletNum - 1)}
                                onChange={(e) =>
                                  handleSampleAreaChange(
                                    tabletNum - 1,
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
                                placeholder={`Tablet ${tabletNum}`}
                                className="w-full px-3 py-2 border border-emerald-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-emerald-400"
                              />
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* MW & Purity Parameters */}
                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <label className="block text-xs font-semibold text-emerald-900 mb-1">
                            MW Base
                          </label>
                          <input
                            type="number"
                            value={calculation.mwBase}
                            onChange={(e) =>
                              onFieldChange(
                                calculation.id,
                                "mwBase",
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
                            placeholder="MW Base"
                            className="w-full px-3 py-2 border border-emerald-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-emerald-400"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-emerald-900 mb-1">
                            MW Salt
                          </label>
                          <input
                            type="number"
                            value={calculation.mwSalt}
                            onChange={(e) =>
                              onFieldChange(
                                calculation.id,
                                "mwSalt",
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
                            placeholder="MW Salt"
                            className="w-full px-3 py-2 border border-emerald-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-emerald-400"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-emerald-900 mb-1">
                            Purity
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
                            onKeyDown={(e) => {
                              if (
                                e.key === "ArrowUp" ||
                                e.key === "ArrowDown"
                              ) {
                                e.preventDefault();
                              }
                            }}
                            onWheel={(e) => e.currentTarget.blur()}
                            placeholder="Purity"
                            className="w-full px-3 py-2 border border-emerald-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-emerald-400"
                          />
                        </div>
                      </div>

                      {/* Calculate Button */}
                      <div className="flex justify-center pt-2">
                        <motion.button
                          onClick={performCalculation}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-green-600 text-white font-semibold rounded-lg hover:from-emerald-700 hover:to-green-700 transition-all shadow-md hover:shadow-lg text-sm"
                        >
                          <Calculator className="w-4 h-4" />
                          Calculate Results
                        </motion.button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Warning if preparations not selected */}
                {(!selectedStandardPrep || !selectedSamplePrepDisso) && (
                  <div className="bg-amber-50 border-2 border-amber-300 rounded-lg p-3 text-center">
                    <p className="text-xs text-amber-800 font-medium">
                      Please select a preparation to enable calculation
                    </p>
                  </div>
                )}
              </div>

              {/* RESULTS SECTION - Tablet Results & Summary Tables */}
              {tabletResults.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="border-t-4 border-emerald-200 p-6 bg-gradient-to-br from-emerald-50 via-green-100/30 to-teal-50"
                >
                  <div className="max-w-full mx-auto space-y-6">
                    {/* Header */}
                    <div className="flex items-center gap-3 pb-3">
                      <CheckCircle2 className="w-6 h-6 text-green-700" />
                      <div>
                        <h6 className="text-lg font-bold text-green-700">
                          Calculation Results
                        </h6>
                      </div>
                    </div>

                    {/* Tablet Results Table */}
                    <div className="bg-white rounded-lg shadow-lg border-2 border-green-300 overflow-hidden">
                      <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-4 py-2">
                        <h6 className="text-sm font-bold text-white">
                          Individual Tablet Results
                        </h6>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="bg-emerald-100">
                              {tabletResults.map((result) => (
                                <th
                                  key={result.tabletNumber}
                                  className="px-4 py-3 text-center text-sm font-bold text-emerald-900 border-r border-emerald-200 last:border-r-0"
                                >
                                  Tablet {result.tabletNumber}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            <tr className="bg-white">
                              {tabletResults.map((result) => (
                                <td
                                  key={result.tabletNumber}
                                  className="px-4 py-4 text-center border-r border-gray-200 last:border-r-0"
                                >
                                  <div className="text-lg font-bold text-gray-800">
                                    {typeof result.result === "number"
                                      ? result.result.toFixed(4)
                                      : result.result}
                                  </div>
                                  {typeof result.result === "number" && (
                                    <div className="text-xs text-gray-600 mt-1">
                                      {result.unit}
                                    </div>
                                  )}
                                </td>
                              ))}
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Summary Statistics Table */}
                    {summaryResults && (
                      <div className="bg-white rounded-lg shadow-lg border-2 border-blue-300 overflow-hidden">
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2">
                          <h6 className="text-sm font-bold text-white">
                            Summary Statistics
                          </h6>
                        </div>
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead>
                              <tr className="bg-blue-100">
                                <th className="px-6 py-3 text-center text-sm font-bold text-blue-900 border-r border-blue-200">
                                  Minimum
                                </th>
                                <th className="px-6 py-3 text-center text-sm font-bold text-blue-900 border-r border-blue-200">
                                  Average
                                </th>
                                <th className="px-6 py-3 text-center text-sm font-bold text-blue-900">
                                  Maximum
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr className="bg-white">
                                <td className="px-6 py-4 text-center border-r border-gray-200">
                                  <div className="text-xl font-bold text-gray-800">
                                    {summaryResults.min.toFixed(4)}
                                  </div>
                                  <div className="text-xs text-gray-600 mt-1">
                                    {summaryResults.unit}
                                  </div>
                                </td>
                                <td className="px-6 py-4 text-center border-r border-gray-200">
                                  <div className="text-xl font-bold text-blue-800">
                                    {summaryResults.avg.toFixed(4)}
                                  </div>
                                  <div className="text-xs text-gray-600 mt-1">
                                    {summaryResults.unit}
                                  </div>
                                </td>
                                <td className="px-6 py-4 text-center">
                                  <div className="text-xl font-bold text-gray-800">
                                    {summaryResults.max.toFixed(4)}
                                  </div>
                                  <div className="text-xs text-gray-600 mt-1">
                                    {summaryResults.unit}
                                  </div>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}

                    {/* Preparation Info */}
                    <div className="bg-white/80 backdrop-blur-sm rounded-lg border border-gray-200 p-4">
                      <div className="grid md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600 font-medium">
                            Standard Preparation
                          </p>
                          <p className="text-gray-900 font-semibold">
                            {calculation.selectedStandardPrepLabel || "N/A"}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600 font-medium">
                            Sample Preparation
                          </p>
                          <p className="text-gray-900 font-semibold">
                            {calculation.selectedSamplePrepLabel || "N/A"}
                          </p>
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

export default CalculationDetailDisso;
