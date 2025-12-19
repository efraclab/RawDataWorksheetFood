import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Calculator, Trash, CheckCircle, AlertTriangle, X } from "lucide-react";
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
}

// Helper component for warning indicator
const WarningIndicator: React.FC<{ value: string | number }> = ({ value }) => {
  const strValue = String(value);
  const isInvalid = strValue.trim() === "" || parseFloat(strValue) === 0;

  if (isInvalid) {
    return (
      <span className="text-amber-500 ml-2" title="Missing or zero value detected">
        <AlertTriangle className="w-4 h-4 inline-block" />
      </span>
    );
  }
  return null;
};

// Unit conversion helpers
const convertMassToMg = (value: string | number, unit: string): number => {
  const val = parseFloat(String(value));
  if (isNaN(val)) return 0;

  const lowerUnit = unit.toLowerCase().trim();
  switch (lowerUnit) {
    case "mg": return val;
    case "g": return val * 1000;
    case "kg": return val * 1000000;
    case "mcg":
    case "ug": return val / 1000;
    default: return val;
  }
};

const convertVolumeToMl = (value: string | number, unit: string): number => {
  const val = parseFloat(String(value));
  if (isNaN(val)) return 0;

  const lowerUnit = unit.toLowerCase().trim();
  switch (lowerUnit) {
    case "ml": return val;
    case "l": return val * 1000;
    case "ul":
    case "µl": return val / 1000;
    default: return val;
  }
};

const CalculationDetailDisso: React.FC<CalculationDetailDissoProps> = ({
  calculation,
  standardPreparations,
  samplePreparationsDisso,
  onFieldChange,
  onRemove,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [calculationResult, setCalculationResult] = useState<string | null>(null);

  // Get selected preparations
  const selectedStandardPrep = standardPreparations.find(
    (prep) => prep.id === calculation.selectedStandardPrepId
  );
  const selectedSamplePrepDisso = samplePreparationsDisso.find(
    (prep) => prep.id === calculation.selectedSamplePrepDissoId
  );

  // Create preparation pair options
  const preparationPairs = standardPreparations
    .map((stdPrep) => {
      const matchingSamplePrep = samplePreparationsDisso.find(
        (samplePrep) => samplePrep.label.charAt(samplePrep.label.length - 1) === stdPrep.label.charAt(stdPrep.label.length - 1)
      );
      if (matchingSamplePrep) {
        return {
          value: stdPrep.label,
          label: `Preparation ${stdPrep.label}`,
          standardId: stdPrep.id,
          sampleDissoId: matchingSamplePrep.id,
        };
      }
      return null;
    })
    .filter(Boolean);

  // Get current selected preparation label
  const currentPrepLabel = selectedStandardPrep?.label || "";

  // Handle preparation pair selection
  const handlePreparationChange = (value: string) => {
    const selectedPair = preparationPairs.find((pair) => pair?.value === value);
    if (selectedPair) {
      onFieldChange(calculation.id, "selectedStandardPrepId", selectedPair.standardId);
      onFieldChange(calculation.id, "selectedSamplePrepDissoId", selectedPair.sampleDissoId);
    } else {
      onFieldChange(calculation.id, "selectedStandardPrepId", null);
      onFieldChange(calculation.id, "selectedSamplePrepDissoId", null);
    }
  };

  // Extract dilution values from standard preparation
  const getStandardDilutions = () => {
    if (!selectedStandardPrep) return [];
    return selectedStandardPrep.steps
      .filter((step) => 
        step.name === "1st Dilution" || 
        step.name === "2nd Dilution" || 
        step.name === "3rd Dilution" ||
        step.name === "4th Dilution"
      )
      .map((step) => ({
        name: step.name,
        vol1: step.vol1 || "",
        vol2: step.vol2 || "",
        unit1: step.unit1 || "ml",
        unit2: step.unit2 || "ml",
      }));
  };

  // Extract dilution values from sample preparation (Dissolution)
  const getSampleDilutions = () => {
    if (!selectedSamplePrepDisso) return [];
    return selectedSamplePrepDisso.steps
      .filter((step) => 
        step.name === "1st Dilution" || 
        step.name === "2nd Dilution" || 
        step.name === "3rd Dilution"
      )
      .map((step) => ({
        name: step.name,
        vol1: step.vol1 || "",
        vol2: step.vol2 || "",
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
      value: weighingStep?.value || "",
      unit: weighingStep?.unit || "g",
    };
  };

  const getTabletDetails = () => {
    if (!selectedSamplePrepDisso) return { claim: "", claimUnit: "mg", mediaVol: "", unit: "ml" };
    const tabletStep = selectedSamplePrepDisso.steps.find(
      (step) => step.name === "Tablet Details"
    );
    return {
      claim: tabletStep?.claim || "",
      claimUnit: tabletStep?.claim || "mg",
      mediaVol: tabletStep?.mediaVol || "",
      unit: tabletStep?.unit || "ml",
    };
  };

  const standardDilutions = getStandardDilutions();
  const sampleDilutions = getSampleDilutions();
  const standardWeight = getStandardWeight();
  const tabletDetails = getTabletDetails();

  const canCalculate = selectedStandardPrep && selectedSamplePrepDisso;

  // Calculation Logic for Dissolution
  const performCalculation = () => {
    console.group("🧪 Dissolution Calculation Started");

    if (!canCalculate) {
      console.warn("Cannot calculate: Missing preparations");
      setCalculationResult("Error: Please select both Standard and Sample preparations");
      console.groupEnd();
      return;
    }

    // Parse inputs
    const AreaOfSample = parseFloat(calculation.areaOfSample as string) || 0;
    const AreaOfStandard = parseFloat(calculation.areaOfStandard as string) || 0;
    const SW1_Standard = convertMassToMg(standardWeight.value, standardWeight.unit);
    const MWBase = parseFloat(calculation.mwBase as string) || 0;
    const MWSalt = parseFloat(calculation.mwSalt as string) || 0;
    const Purity = parseFloat(calculation.purity as string) || 0;
    // Get Standard volumes
    // V1: 1st Dilution final volume
    // V2: 2nd Dilution aliquot, V3: 2nd Dilution final volume
    // V4: 3rd Dilution aliquot, V5: 3rd Dilution final volume
    const V1 = standardDilutions[0] ? convertVolumeToMl(standardDilutions[0].vol1, standardDilutions[0].unit1) : 0;
    
    const V2 = standardDilutions[1] ? convertVolumeToMl(standardDilutions[1].vol1, standardDilutions[1].unit1) : 0;
    const V3 = standardDilutions[1] ? convertVolumeToMl(standardDilutions[1].vol2, standardDilutions[1].unit2) : 0;
    
    const V4 = standardDilutions[2] ? convertVolumeToMl(standardDilutions[2].vol1, standardDilutions[2].unit1) : 0;
    const V5 = standardDilutions[2] ? convertVolumeToMl(standardDilutions[2].vol2, standardDilutions[2].unit2) : 0;

    const V6 = standardDilutions[3] ? convertVolumeToMl(standardDilutions[3].vol1, standardDilutions[3].unit1) : 0;
    const V7 = standardDilutions[3] ? convertVolumeToMl(standardDilutions[3].vol2, standardDilutions[3].unit2) : 0;

    // Get Sample volumes
    // V8: Media Volume (from Tablet Details)
    // V9: 1st Dilution aliquot, V10: 1st Dilution final volume
    // V11: 2nd Dilution aliquot, V12: 2nd Dilution final volume
    // V13: 3rd Dilution aliquot, V14: 3rd Dilution final volume
    const MediaVol = convertVolumeToMl(tabletDetails.mediaVol, tabletDetails.unit); // V8
    const Claim = convertMassToMg(tabletDetails.claim, tabletDetails.claimUnit); // Claim in mg (used separately in formula)
    
    const V9 = sampleDilutions[0] ? convertVolumeToMl(sampleDilutions[0].vol1, sampleDilutions[0].unit1) : 0;
    const V10 = sampleDilutions[0] ? convertVolumeToMl(sampleDilutions[0].vol2, sampleDilutions[0].unit2) : 0;
    
    const V11 = sampleDilutions[1] ? convertVolumeToMl(sampleDilutions[1].vol1, sampleDilutions[1].unit1) : 0;
    const V12 = sampleDilutions[1] ? convertVolumeToMl(sampleDilutions[1].vol2, sampleDilutions[1].unit2) : 0;
    
    const V13 = sampleDilutions[2] ? convertVolumeToMl(sampleDilutions[2].vol1, sampleDilutions[2].unit1) : 0;
    const V14 = sampleDilutions[2] ? convertVolumeToMl(sampleDilutions[2].vol2, sampleDilutions[2].unit2) : 0;

    console.log("2. Volumes (converted to mL):", { 
      Standard: { V1, V2, V3, V4, V5 },
      Sample: { MediaVol_V8: MediaVol, V9, V10, V11, V12, V13, V14, Claim }
    });

    // Calculate ratios
    const AreaRatio = AreaOfStandard !== 0 ? AreaOfSample / AreaOfStandard : 0;
    const MWRatio = MWSalt !== 0 ? MWBase / MWSalt : 0;

    console.log("3. Ratios:", {
      AreaRatio,
      MWRatio
    });

    // Formula from the image (Image 2):
    // Numerator: Area/ABS of Sample × SW1 × V2 × V4 × V6 × V8 × V10 × V12 × V14 × MW Base × Purity × 100
    // Denominator: Area/ABS of Standard × V1 × V3 × V5 × V7 × Claim × V9 × V11 × V13 × MW Salt × 100
    
    // Adjusted based on actual available variables (3 dilutions for standard, 3 for sample):
    // We don't have V6, V7 from standard (only 3 dilutions: V1, V2-V3, V4-V5)
    // V8 = MediaVol (from tablet details)
    // V9 = 1st Dilution aliquot, V10 = 1st Dilution final volume (from sample dilutions)
    // Claim is used separately in the denominator
    // Purity is typically 100% or taken from standard purity
    
    let FinalResult = 0;
    
    // Building numerator: AreaSample × SW1 × V2 × V4 × MediaVol(V8) × V10 × V12 × V14 × MWBase × 100
    const numerator = AreaOfSample * SW1_Standard * V2 * V4 * V6 * MediaVol * V10 * V12 * V14 * MWBase * Purity * 100;
    
    // Building denominator: AreaStandard × V1 × V3 × V5 × Claim × V9 × V11 × V13 × MWSalt × 100
    const denominator = AreaOfStandard * V1 * V3 * V5 * V7 * Claim * V9 * V11 * V13 * MWSalt * 100;

    if (denominator !== 0) {
      FinalResult = numerator / denominator;
    }

    const formulaDebugString = 
      `Numerator: (${AreaOfSample} × ${SW1_Standard} × ${V2} × ${V4} x ${V6} × ${MediaVol} × ${V10} × ${V12} × ${V14} × ${MWBase} x ${Purity} × 100)\n` +
      `Denominator: (${AreaOfStandard} × ${V1} × ${V3} × ${V5} x ${V7} × ${Claim} × ${V9} × ${V11} × ${V13} × ${MWSalt} × 100)\n` +
      `Result: ${numerator} / ${denominator}`;

    console.log("4. Formula:", formulaDebugString);
    console.log(`5. Result: ${FinalResult} mg/tablet (or mg/capsule)`, "color: green; font-weight: bold");
    console.groupEnd();

    if (isNaN(FinalResult) || !isFinite(FinalResult)) {
      setCalculationResult("Error: Result is NaN or Infinite. Check console for details.");
    } else {
      setCalculationResult(`Result: ${FinalResult.toFixed(4)} mg/tablet`);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="relative group"
    >
      <div className="relative bg-white/95 backdrop-blur-sm rounded-lg border border-emerald-200/50 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden mb-4">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-emerald-600 via-emerald-500 to-green-500 overflow-hidden">
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
                <p className="text-xs text-emerald-100">Dissolution Calculation</p>
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
              className="overflow-hidden"
            >
              <div className="p-5 space-y-4 bg-gradient-to-br from-emerald-50/50 to-green-50/30">
                {/* Selection Section */}
                <div className="grid grid-cols-1 gap-4">
                  {/* Single Preparation Selection */}
                  <div>
                    <label className="block text-xs font-semibold text-emerald-900 mb-2">
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
                            <span className="font-bold text-emerald-800 bg-emerald-200/50 px-2 rounded-md">SW1:</span>
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
                                  V{dilution.name === "1st Dilution" ? "1" : idx * 2 + 1}:
                                </span>
                                <span className="text-gray-800 font-semibold flex items-center">
                                  {dilution.name === "1st Dilution" ? dilution.vol1 : dilution.vol2}{" "}
                                  {dilution.name === "1st Dilution" ? dilution.unit1 : dilution.unit2}
                                  <WarningIndicator value={dilution.name === "1st Dilution" ? dilution.vol1 : dilution.vol2} />
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
                            <span className="font-bold text-emerald-800 bg-emerald-200/50 px-2 rounded-md">Claim:</span>
                            <span className="text-gray-800 font-semibold flex items-center">
                              {tabletDetails.claim} mg
                              <WarningIndicator value={tabletDetails.claim} />
                            </span>
                          </div>
                          {/* Media Volume (V8) */}
                          <div className="flex items-center justify-between gap-3 text-xs bg-gradient-to-r from-emerald-100 to-emerald-50 p-3 rounded-lg border border-emerald-200">
                            <span className="font-bold text-emerald-800 bg-emerald-200/50 px-2 rounded-md">Media Vol (V8):</span>
                            <span className="text-gray-800 font-semibold flex items-center">
                              {tabletDetails.mediaVol} {tabletDetails.unit}
                              <WarningIndicator value={tabletDetails.mediaVol} />
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
                              onFieldChange(calculation.id, "areaOfSample", e.target.value)
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
                              onFieldChange(calculation.id, "areaOfStandard", e.target.value)
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
                              onFieldChange(calculation.id, "mwBase", e.target.value)
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
                              onFieldChange(calculation.id, "mwSalt", e.target.value)
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
                              onFieldChange(calculation.id, "purity", e.target.value)
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

                      {/* Result Display */}
                      {calculationResult && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`bg-gradient-to-br ${calculationResult.startsWith("Error") ? 'from-amber-50 to-orange-50 border-2 border-amber-300' : 'from-green-50 to-emerald-50 border-2 border-green-300'} rounded-lg p-4`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-2 mb-2">
                              <CheckCircle className={`w-5 h-5 ${calculationResult.startsWith("Error") ? 'text-amber-600' : 'text-green-600'}`} />
                              <h6 className={`text-sm font-bold ${calculationResult.startsWith("Error") ? 'text-amber-900' : 'text-green-900'}`}>
                                Calculation Result
                              </h6>
                            </div>
                            <motion.button
                              onClick={() => setCalculationResult(null)}
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              className="p-1 -mt-1 -mr-1 text-gray-400 hover:text-emerald-500 transition-colors"
                              title="Close result"
                            >
                              <X className="w-4 h-4" />
                            </motion.button>
                          </div>
                          <p className="text-sm text-gray-700 font-semibold">{calculationResult}</p>
                        </motion.div>
                      )}
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
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default CalculationDetailDisso;