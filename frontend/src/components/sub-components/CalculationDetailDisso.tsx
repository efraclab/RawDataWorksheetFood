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

  const selectedStandardPrep = standardPreparations.find(
    (prep) => prep.label === calculation.selectedStandardPrepLabel
  );

  const selectedSamplePrepDisso = samplePreparationsDisso.find(
    (prep) => prep.label === calculation.selectedSamplePrepLabel
  );

  // Create preparation pair options
  const preparationPairs = standardPreparations.flatMap((stdPrep, stdIdx) => {
    const pairs = [];
    const startSampleIdx = stdIdx * 6;

    for (let tabletNum = 1; tabletNum <= 6; tabletNum++) {
      const sampleIdx = startSampleIdx + tabletNum - 1;
      const matchingSamplePrep = samplePreparationsDisso[sampleIdx];

      if (matchingSamplePrep) {
        pairs.push({
          value: `${stdPrep.label}-${matchingSamplePrep.label}`,
          label: `Preparation ${stdIdx + 1} - Tablet ${tabletNum}`,
          standardLabel: stdPrep.label,
          sampleLabel: matchingSamplePrep.label,
        });
      }
    }

    return pairs;
  });

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

  const performCalculation = () => {
    console.group("🧪 Dissolution Calculation Started");

    if (!canCalculate) {
      console.warn("Cannot calculate: Missing preparations");
      onFieldChange(calculation.id, "calculationResult", null);
      console.groupEnd();
      return;
    }

    // Parse inputs
    const AreaOfSample = parseFloat(calculation.areaOfSample as string) || 0;
    const AreaOfStandard =
      parseFloat(calculation.areaOfStandard as string) || 1;
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

    // Get Sample volumes
    const MediaVol = convertVolumeToMl(
      tabletDetails.mediaVol,
      tabletDetails.unit
    ); // V8
    const Claim = convertMassToMg(tabletDetails.claim, tabletDetails.claimUnit); // Claim in mg (used separately in formula)

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

    console.log("2. Volumes (converted to mL):", {
      Standard: { V1, V2, V3, V4, V5 },
      Sample: { MediaVol_V8: MediaVol, V9, V10, V11, V12, V13, V14, Claim },
    });

    // Calculate ratios
    const AreaRatio = AreaOfStandard !== 0 ? AreaOfSample / AreaOfStandard : 0;
    const MWRatio = MWSalt !== 0 ? MWBase / MWSalt : 0;

    console.log("3. Ratios:", {
      AreaRatio,
      MWRatio,
    });


    let FinalResult = 0;

    // Building numerator: AreaSample × SW1 × V2 × V4 × MediaVol(V8) × V10 × V12 × V14 × MWBase × 100
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

    // Building denominator: AreaStandard × V1 × V3 × V5 × Claim × V9 × V11 × V13 × MWSalt × 100
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

    if (denominator !== 0) {
      FinalResult = numerator / denominator;
    }

    const formulaDebugString =
      `Numerator: (${AreaOfSample} × ${SW1_Standard} × ${V2} × ${V4} x ${V6} × ${MediaVol} × ${V10} × ${V12} × ${V14} × ${MWBase} x ${Purity} × 100)\n` +
      `Denominator: (${AreaOfStandard} × ${V1} × ${V3} × ${V5} x ${V7} × ${Claim} × ${V9} × ${V11} × ${V13} × ${MWSalt} × 100)\n` +
      `Result: ${numerator} / ${denominator}`;

    console.log("4. Formula:", formulaDebugString);
    console.log(
      `5. Result: ${FinalResult} mg/tablet (or mg/capsule)`,
      "color: green; font-weight: bold"
    );
    console.groupEnd();

    if (isNaN(FinalResult) || !isFinite(FinalResult)) {
      onFieldChange(calculation.id, "calculationResult", null);
    } else {
      const result = `${FinalResult.toFixedNoRound(4)}`;
      onFieldChange(calculation.id, "calculationResult", result);
      onFieldChange(calculation.id, "calculationResultUnit", "mg/tablet");
    }
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
            >
              <div className="p-5 space-y-4 bg-gradient-to-br from-emerald-50/50 to-green-50/30">
                {/* Selection Section */}
                <div className="grid grid-cols-1 gap-4">
                  {/* Single Preparation Selection */}
                  <div>
                    <label className="block text-xs font-semibold text-emerald-900 mb-1">
                      Select Preparation (Standard - Tablet)
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
                      placeholder="Select preparation pair (e.g., Prep 1 - Tablet 1)"
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
                          {/* V1, V2, V3, V4, V5 */}
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
                          {/* Claim (separate, not V9) */}
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
                      {/* Area/ABS Inputs */}
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-semibold text-emerald-900 mb-1">
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
                            className="w-full px-3 py-2 border border-emerald-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-emerald-400"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-emerald-900 mb-1">
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
                            className="w-full px-3 py-2 border border-emerald-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-emerald-400"
                          />
                        </div>
                      </div>

                      {/* MW & Claim Parameters */}
                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <label className="block text-xs font-semibold text-emerald-900 mb-1">
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
                            className="w-full px-3 py-2 border border-emerald-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-emerald-400"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-emerald-900 mb-1">
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
                            className="w-full px-3 py-2 border border-emerald-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-emerald-400"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-emerald-900 mb-1">
                            Purity
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
                          Calculate Result
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

              {/* FIXED BOTTOM RESULTS SECTION - NON-CLOSABLE */}
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
                      </div>

                      {/* Summary Info */}
                      <div className="bg-white/80 backdrop-blur-sm rounded-lg border border-gray-200 p-4">
                        <div className="grid md:grid-cols-3 gap-4 text-sm">
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
                              Sample Prep (Tablet)
                            </p>
                            <p className="text-gray-900 font-semibold">
                              {calculation.selectedSamplePrepLabel
                                ? `${calculation.selectedSamplePrepLabel}`
                                : "N/A"}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-600 font-medium">
                              Preparation Pair
                            </p>
                            <p className="text-gray-900 font-semibold">
                              {(() => {
                                if (
                                  !calculation.selectedStandardPrepLabel ||
                                  !calculation.selectedSamplePrepLabel
                                ) {
                                  return "N/A";
                                }
                                const pair = preparationPairs.find(
                                  (p) =>
                                    p.standardLabel ===
                                      calculation.selectedStandardPrepLabel &&
                                    p.sampleLabel ===
                                      calculation.selectedSamplePrepLabel
                                );
                                return pair?.label || "N/A";
                              })()}
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

export default CalculationDetailDisso;
