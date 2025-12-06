import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Calculator, Trash, CheckCircle, AlertTriangle, X } from "lucide-react";
import type { CalculationRS } from "../../models/CalculationRS";
import type { StandardPreparation } from "../../models/StandardPreparation";
import type { SamplePreparation } from "../../models/SamplePreparation";
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

const CalculationDetailRS: React.FC<CalculationDetailRSProps> = ({
  calculation,
  standardPreparations,
  samplePreparations,
  onFieldChange,
  onRemove,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [calculationResult, setCalculationResult] = useState<string | null>(null);

  

  // Get selected preparations
  const selectedStandardPrep = standardPreparations.find(
    (prep) => prep.id === calculation.selectedStandardPrepId
  );
  const selectedSamplePrep = samplePreparations.find(
    (prep) => prep.id === calculation.selectedSamplePrepId
  );

  // Create preparation pair options
  const preparationPairs = standardPreparations
    .map((stdPrep) => {
      const matchingSamplePrep = samplePreparations.find(
        (samplePrep) => samplePrep.label.charAt(samplePrep.label.length - 1) === stdPrep.label.charAt(stdPrep.label.length - 1)
      );
      if (matchingSamplePrep) {
        return {
          value: stdPrep.label,
          label: `Preparation ${stdPrep.label}`,
          standardId: stdPrep.id,
          sampleId: matchingSamplePrep.id,
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
      onFieldChange(calculation.id, "selectedSamplePrepId", selectedPair.sampleId);
    } else {
      onFieldChange(calculation.id, "selectedStandardPrepId", null);
      onFieldChange(calculation.id, "selectedSamplePrepId", null);
    }
  };

  // Extract dilution values from preparations
  const getStandardDilutions = () => {
    if (!selectedStandardPrep) return [];
    return selectedStandardPrep.steps
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

  const getSampleDilutions = () => {
    if (!selectedSamplePrep) return [];
    return selectedSamplePrep.steps
      .filter((step) => step.name === "1st Dilution")
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

  const getSampleWeight = () => {
    if (!selectedSamplePrep) return { value: "", unit: "g" };
    const weighingStep = selectedSamplePrep.steps.find(
      (step) => step.name === "Weighing"
    );
    return {
      value: weighingStep?.value || "",
      unit: weighingStep?.unit || "g",
    };
  };

  const standardDilutions = getStandardDilutions();
  const sampleDilutions = getSampleDilutions();
  const standardWeight = getStandardWeight();
  const sampleWeight = getSampleWeight();

  const canCalculate = selectedStandardPrep && selectedSamplePrep;

  // Calculation Logic for Residual Solvent
  const performCalculation = () => {
    console.group("🧪 Residual Solvent Calculation Started");

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
    const SW2_Sample = convertMassToMg(sampleWeight.value, sampleWeight.unit);
    const Purity = parseFloat(calculation.purity as string) || 0;

    console.log("1. Raw Inputs:", {
      AreaSample: AreaOfSample,
      AreaStandard: AreaOfStandard,
      SW1: SW1_Standard,
      SW2: SW2_Sample,
      Purity: Purity
    });

    // Get volumes
    const V1 = standardDilutions[0] ? convertVolumeToMl(standardDilutions[0].vol1, standardDilutions[0].unit1) : 0;
    const V2 = standardDilutions[1] ? convertVolumeToMl(standardDilutions[1].vol1, standardDilutions[1].unit1) : 0;
    const V3 = standardDilutions[1] ? convertVolumeToMl(standardDilutions[1].vol2, standardDilutions[1].unit2) : 0;
    const V4 = standardDilutions[2] ? convertVolumeToMl(standardDilutions[2].vol1, standardDilutions[2].unit1) : 0;
    const V5 = standardDilutions[2] ? convertVolumeToMl(standardDilutions[2].vol2, standardDilutions[2].unit2) : 0;
    const V6 = sampleDilutions[0] ? convertVolumeToMl(sampleDilutions[0].vol1, sampleDilutions[0].unit1) : 0;

    console.log("2. Volumes (converted to mL):", { V1, V2, V3, V4, V5, V6 });

    // Calculate ratios
    const AreaRatio = AreaOfStandard !== 0 ? AreaOfSample / AreaOfStandard : 0;
    const PurityFactor = Purity / 100;

    console.log("3. Ratios:", {
      AreaRatio,
      PurityFactor
    });

    // Formula: (Area/ABS of Sample × SW1 × V2 × V4 × V6 × Purity) / (Area/ABS of Standard × V1 × V3 × V5 × SW2 × 100)
    let FinalResult = 0;
    const numerator = AreaOfSample * SW1_Standard * V2 * V4 * V6 * Purity;
    const denominator = AreaOfStandard * V1 * V3 * V5 * SW2_Sample * 100;

    if (denominator !== 0) {
      FinalResult = numerator / denominator * 1000000;
    }

    const formulaDebugString = `(${AreaOfSample} × ${SW1_Standard} × ${V2} × ${V4} × ${V6} × ${Purity}) / (${AreaOfStandard} × ${V1} × ${V3} × ${V5} × ${SW2_Sample} × 100)`;

    console.log("4. Formula:", formulaDebugString);
    console.log(`5. Result: ${FinalResult}`, "color: green; font-weight: bold");
    console.groupEnd();

    if (isNaN(FinalResult) || !isFinite(FinalResult)) {
      setCalculationResult("Error: Result is NaN or Infinite. Check console for details.");
    } else {
      setCalculationResult(`Result: ${FinalResult.toFixed(4)} ppm`);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="relative group"
    >
      <div className="relative bg-white/95 backdrop-blur-sm rounded-lg border border-indigo-200/50 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden mb-4">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-indigo-600 via-indigo-500 to-blue-500 overflow-hidden">
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
                <p className="text-xs text-indigo-100">Residual Solvent Calculation</p>
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
              <div className="p-5 space-y-4 bg-gradient-to-br from-indigo-50/50 to-blue-50/30">
                {/* Selection Section */}
                <div className="grid grid-cols-1 gap-4">
                  {/* Single Preparation Selection */}
                  <div>
                    <label className="block text-xs font-semibold text-indigo-900 mb-2">
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
                      colorScheme="indigo"
                    />
                  </div>
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
                      <div className="bg-gradient-to-br from-white to-indigo-50/50 rounded-xl border-2 border-indigo-300 p-5 shadow-lg hover:shadow-xl transition-all duration-300">
                        <h5 className="text-sm font-bold text-indigo-900 mb-4 flex items-center gap-2 pb-3 border-b-2 border-indigo-200">
                          <div className="w-3 h-3 bg-indigo-500 rounded-full shadow-lg shadow-indigo-500/50 animate-pulse"></div>
                          Standard Preparation Variables
                        </h5>
                        <div className="space-y-2.5">
                          {/* SW1 */}
                          <div className="flex items-center justify-between gap-3 text-xs bg-gradient-to-r from-indigo-100 to-indigo-50 p-3 rounded-lg border border-indigo-200">
                            <span className="font-bold text-indigo-800 bg-indigo-200/50 px-2 rounded-md">SW1:</span>
                            <span className="text-gray-800 font-semibold flex items-center">
                              {standardWeight.value} {standardWeight.unit}
                              <WarningIndicator value={standardWeight.value} />
                            </span>
                          </div>
                          {/* V1, V2, V3, V4, V5 */}
                          {standardDilutions.map((dilution, idx) => (
                            <div key={idx} className="space-y-2">
                              {dilution.name !== "1st Dilution" && (
                                <div className="flex items-center justify-between gap-3 text-xs bg-gradient-to-r from-indigo-100 to-indigo-50 p-3 rounded-lg border border-indigo-200">
                                  <span className="font-bold text-indigo-800 bg-indigo-200/50 px-2 rounded-md">
                                    V{idx * 2}:
                                  </span>
                                  <span className="text-gray-800 font-semibold flex items-center">
                                    {dilution.vol1} {dilution.unit1}
                                    <WarningIndicator value={dilution.vol1} />
                                  </span>
                                </div>
                              )}
                              <div className="flex items-center justify-between gap-3 text-xs bg-gradient-to-r from-indigo-100 to-indigo-50 p-3 rounded-lg border border-indigo-200">
                                <span className="font-bold text-indigo-800 bg-indigo-200/50 px-2 rounded-md">
                                  V{idx * 2 + 1}:
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

                    {/* Sample Preparation Details */}
                    {selectedSamplePrep && (
                      <div className="bg-gradient-to-br from-white to-indigo-50/50 rounded-xl border-2 border-indigo-300 p-5 shadow-lg hover:shadow-xl transition-all duration-300">
                        <h5 className="text-sm font-bold text-indigo-900 mb-4 flex items-center gap-2 pb-3 border-b-2 border-indigo-200">
                          <div className="w-3 h-3 bg-indigo-500 rounded-full shadow-lg shadow-indigo-500/50 animate-pulse"></div>
                          Sample Preparation Variables
                        </h5>
                        <div className="space-y-2.5">
                          {/* SW2 */}
                          <div className="flex items-center justify-between gap-3 text-xs bg-gradient-to-r from-indigo-100 to-indigo-50 p-3 rounded-lg border border-indigo-200">
                            <span className="font-bold text-indigo-800 bg-indigo-200/50 px-2 rounded-md">SW2:</span>
                            <span className="text-gray-800 font-semibold flex items-center">
                              {sampleWeight.value} {sampleWeight.unit}
                              <WarningIndicator value={sampleWeight.value} />
                            </span>
                          </div>
                          {/* V6 */}
                          {sampleDilutions.map((dilution, idx) => (
                            <div key={idx}>
                              <div className="flex items-center justify-between gap-3 text-xs bg-gradient-to-r from-indigo-100 to-indigo-50 p-3 rounded-lg border border-indigo-200">
                                <span className="font-bold text-indigo-800 bg-indigo-200/50 px-2 rounded-md">
                                  V6:
                                </span>
                                <span className="text-gray-800 font-semibold flex items-center">
                                  {dilution.vol1} {dilution.unit1}
                                  <WarningIndicator value={dilution.vol1} />
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
                  <div className="bg-white rounded-lg border-2 border-indigo-300 shadow-md overflow-hidden">
                    <div className="bg-gradient-to-r from-indigo-600 to-blue-600 px-4 py-2">
                      <h5 className="text-sm font-bold text-white flex items-center gap-2">
                        <Calculator className="w-4 h-4" />
                        Calculation Formula Inputs
                      </h5>
                    </div>
                    
                    <div className="p-4 space-y-4">
                      {/* Area/ABS Inputs */}
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-semibold text-indigo-900 mb-1">
                            Area/ABS of Sample
                          </label>
                          <input
                            type="text"
                            value={calculation.areaOfSample}
                            onChange={(e) =>
                              onFieldChange(calculation.id, "areaOfSample", e.target.value)
                            }
                            placeholder="Enter Sample Area/ABS"
                            className="w-full px-3 py-2 border border-indigo-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-400"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-indigo-900 mb-1">
                            Area/ABS of Standard
                          </label>
                          <input
                            type="text"
                            value={calculation.areaOfStandard}
                            onChange={(e) =>
                              onFieldChange(calculation.id, "areaOfStandard", e.target.value)
                            }
                            placeholder="Enter Standard Area/ABS"
                            className="w-full px-3 py-2 border border-indigo-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-400"
                          />
                        </div>
                      </div>

                      {/* Purity */}
                      <div>
                        <label className="block text-xs font-semibold text-indigo-900 mb-1">
                          Purity %
                        </label>
                        <input
                          type="text"
                          value={calculation.purity}
                          onChange={(e) =>
                            onFieldChange(calculation.id, "purity", e.target.value)
                          }
                          placeholder="Enter Purity"
                          className="w-full px-3 py-2 border border-indigo-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        />
                      </div>

                      {/* Calculate Button */}
                      <div className="flex justify-center pt-2">
                        <motion.button
                          onClick={performCalculation}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-semibold rounded-lg hover:from-indigo-700 hover:to-blue-700 transition-all shadow-md hover:shadow-lg text-sm"
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
                              className="p-1 -mt-1 -mr-1 text-gray-400 hover:text-indigo-500 transition-colors"
                              title="Close result"
                            >
                              <X className="w-4 h-4" />
                            </motion.button>
                          </div>
                          <p className="text-sm text-gray-700">{calculationResult}</p>
                        </motion.div>
                      )}
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
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default CalculationDetailRS;