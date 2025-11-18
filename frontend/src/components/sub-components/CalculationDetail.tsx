import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
// Added X for the close button on the result section
import { ChevronDown, Calculator, Trash, CheckCircle, AlertTriangle, X } from "lucide-react"; 
import type { Calculation, CalculationType } from "../../models/Calculation";
import type { StandardPreparation } from "../../models/StandardPreparation";
import type { SamplePreparation } from "../../models/SamplePreparation";
import CustomDropdown from "../shared/CustomDropdown";

const calculationTypes: CalculationType[] = [
  "For Tablets",
  "For Capsule",
  "For Injection Vial",
  "For Oral Suspension",
  "For Oral Liquid",
];

interface CalculationDetailProps {
  calculation: Calculation;
  standardPreparations: StandardPreparation[];
  samplePreparations: SamplePreparation[];
  onFieldChange: (
    calculationId: number,
    field: keyof Calculation,
    value: string | number | null
  ) => void;
  onRemove: () => void;
}

// Helper component for warning indicator
const WarningIndicator: React.FC<{ value: string | number }> = ({ value }) => {
  const strValue = String(value);
  // Check if value is empty string, or zero (0 or 0.0)
  const isInvalid = strValue.trim() === "" || parseFloat(strValue) === 0;

  if (isInvalid) {
    return (
      <span className="text-amber-500 ml-2" title="Missing or zero value detected, calculation will fail.">
        <AlertTriangle className="w-4 h-4 inline-block" />
      </span>
    );
  }
  return null;
};

const CalculationDetail: React.FC<CalculationDetailProps> = ({
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

  // Extract dilution values from preparations
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

  const getSampleDilutions = () => {
    if (!selectedSamplePrep) return [];
    return selectedSamplePrep.steps
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

  // Check if both preparations are selected
  const canCalculate = selectedStandardPrep && selectedSamplePrep && calculation.calculationType;

  // --- Calculation Logic ---
  const getStandardVolumes = () => {
    const stdVols: { [key: string]: number } = {};
    
    let volIdx = 1;
    standardDilutions.forEach((dilution) => {
      if (dilution.name !== "1st Dilution") {
        stdVols[`V${volIdx + 1}`] = parseFloat(dilution.vol1 as string) || 0; 
        volIdx++;
      }
      stdVols[`V${volIdx}`] = parseFloat((dilution.name === "1st Dilution" ? dilution.vol1 : dilution.vol2) as string) || 0; 
      volIdx++;
    });
    
    return stdVols;
  };
  
  const getSampleVolumes = () => {
    const splVols: { [key: string]: number } = {};
    
    let volIdx = 7;
    sampleDilutions.forEach((dilution) => {
      if (dilution.name !== "1st Dilution") {
        splVols[`V${volIdx + 1}`] = parseFloat(dilution.vol1 as string) || 0; 
        volIdx++;
      }
      splVols[`V${volIdx}`] = parseFloat((dilution.name === "1st Dilution" ? dilution.vol1 : dilution.vol2) as string) || 0; 
      volIdx++;
    });
    
    return splVols;
  };

  const performCalculation = () => {
    if (!canCalculate) {
      setCalculationResult("Error: Please select both Standard and Sample preparations and a calculation type.");
      return;
    }

    const stdVols = getStandardVolumes();
    const splVols_all = getSampleVolumes();
    
    // Parse all required numerical inputs
    const AreaOfSample = parseFloat(calculation.areaOfSample as string) || 0;
    const AreaOfStandard = parseFloat(calculation.areaOfStandard as string) || 0;
    const SW1_Standard = parseFloat(standardWeight.value as string) || 0;
    const SW2_Sample = parseFloat(sampleWeight.value as string) || 0;

    const MWBase = parseFloat(calculation.mwBase as string) || 0;
    const MWSalt = parseFloat(calculation.mwSalt as string) || 0;
    const Purity = parseFloat(calculation.baseXPurity as string) || 0;
    
    // --- STEP 1: Comprehensive Input Validation ---

    // 1. Preparation Weights
    if (SW1_Standard === 0) {
        setCalculationResult("Error: Standard Weight (SW1) cannot be zero or missing.");
        return;
    }
    if (SW2_Sample === 0) {
        setCalculationResult("Error: Sample Weight (SW2) cannot be zero or missing.");
        return;
    }

    // 2. Preparation Volumes
    const requiredStdVols = [stdVols.V1, stdVols.V3, stdVols.V5, stdVols.V7, stdVols.V2, stdVols.V4, stdVols.V6].filter(v => v !== undefined);
    const requiredSplVols = [splVols_all.V9, splVols_all.V11, splVols_all.V13, splVols_all.V15, splVols_all.V8, splVols_all.V10, splVols_all.V12, splVols_all.V14].filter(v => v !== undefined);
    
    const allVolumes = [...requiredStdVols, ...requiredSplVols];
    
    if (allVolumes.some(v => v === 0)) {
        setCalculationResult("Error: All volume steps (V#) used in the selected preparations must have non-zero values.");
        return;
    }

    // 3. Formula Inputs
    if (AreaOfSample === 0) {
        setCalculationResult("Error: Area/ABS of Sample cannot be zero or missing.");
        return;
    }
    if (AreaOfStandard === 0) {
        setCalculationResult("Error: Area/ABS of Standard cannot be zero or missing.");
        return;
    }
    if (MWBase === 0) {
        setCalculationResult("Error: MW Base cannot be zero or missing.");
        return;
    }
    if (MWSalt === 0) {
        setCalculationResult("Error: MW Salt cannot be zero or missing.");
        return;
    }
    if (Purity === 0) {
        setCalculationResult("Error: Purity % cannot be zero or missing.");
        return;
    }
    
    // --- STEP 2: Calculate V_factor ---
    
    // Standard V_factor component: (Final Vol / Aliquot)
    const stdNumeratorProd = (stdVols.V1 || 1) * (stdVols.V3 || 1) * (stdVols.V5 || 1) * (stdVols.V7 || 1); 
    const stdDenominatorProd = (stdVols.V2 || 1) * (stdVols.V4 || 1) * (stdVols.V6 || 1); 
    
    // Sample V_factor component: (Final Vol / Aliquot)
    const splNumeratorProd = (splVols_all.V9 || 1) * (splVols_all.V11 || 1) * (splVols_all.V13 || 1) * (splVols_all.V15 || 1); 
    const splDenominatorProd = (splVols_all.V8 || 1) * (splVols_all.V10 || 1) * (splVols_all.V12 || 1) * (splVols_all.V14 || 1); 
    
    const V_factor = (stdNumeratorProd / stdDenominatorProd) * (splNumeratorProd / splDenominatorProd);
    
    // --- STEP 3: Core Calculation Ratios ---
    
    const AreaRatio = AreaOfSample / AreaOfStandard;
    const WeightRatio = SW1_Standard / SW2_Sample; // SW1/SW2
    const MWRatio = MWBase / MWSalt;
    
    // Note: Division by zero for AreaOfStandard, SW2_Sample, MWSalt is already prevented by the 0 checks above.

    let FinalResult: number | typeof NaN = NaN;
    let unit = "";

    // Base formula calculation
    const baseCalculation = AreaRatio * WeightRatio * V_factor * MWRatio * Purity * 0.01;

    // --- STEP 4: Case-specific calculations ---

    switch (calculation.calculationType) {
      case "For Tablets":
      case "For Capsule":
      case "For Injection Vial": {
        const AvgWt = parseFloat(calculation.avgWt as string) || 0;
        if (AvgWt === 0) {
            setCalculationResult(`Error: Missing Average Weight/Volume for ${calculation.calculationType} calculation.`);
            return;
        }
        FinalResult = baseCalculation * AvgWt;
        unit = calculation.calculationType === "For Injection Vial" ? "mg / Vial" : "mg / tablets";
        break;
      }
      case "For Oral Suspension": {
        const WtPerMLDoseVolume = parseFloat(calculation.doseVolume as string) || 0; 
        const WtPerML = parseFloat(calculation.avgWt as string) || 0; 
        
        if (WtPerMLDoseVolume === 0) {
            setCalculationResult("Error: Missing Dose Volume for Oral Suspension calculation.");
            return;
        }
        if (WtPerML === 0) {
            setCalculationResult("Error: Missing Wt/ml (Average Weight) for Oral Suspension calculation.");
            return;
        }
        
        // Final formula: AreaRatio * WeightRatio * V_factor * MWRatio * Purity * (WtPerML * WtPerMLDoseVolume) / 100
        FinalResult = AreaRatio * WeightRatio * V_factor * MWRatio * Purity * (WtPerML * WtPerMLDoseVolume) * 0.01;
        unit = "mg / ml";
        break;
      }
      case "For Oral Liquid": {
        const DoseVolume = parseFloat(calculation.doseVolume as string) || 0; 
        const SampleVolume = parseFloat(calculation.avgWt as string) || 0; // Stored in avgWt field
        
        if (DoseVolume === 0) {
            setCalculationResult("Error: Missing Dose Volume for Oral Liquid calculation.");
            return;
        }
        if (SampleVolume === 0) {
            setCalculationResult("Error: Missing Sample Vol (Average Weight) for Oral Liquid calculation.");
            return;
        }
        
        // In Oral Liquid formula, SW2 is replaced by Sample Vol in the denominator of the weight ratio
        const SplVolRatio = SW1_Standard / SampleVolume;
        
        // Final result: AreaRatio * SplVolRatio * V_factor * MWRatio * Purity * DoseVolume / 100
        FinalResult = AreaRatio * SplVolRatio * V_factor * MWRatio * Purity * DoseVolume * 0.01;
        unit = "mg / ml";
        break;
      }
      default:
        setCalculationResult("Error: Invalid Calculation Type selected.");
        return;
    }

    // --- STEP 5: Final Result Output ---
    if (isNaN(FinalResult) || !isFinite(FinalResult)) {
        setCalculationResult("Error: Calculation resulted in a non-finite number. Check input values.");
    } else {
        setCalculationResult(`Result: ${FinalResult.toFixed(4)} ${unit}`);
    }
  };
  // --- End Calculation Logic ---

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
                <p className="text-xs text-red-100">Calculation Details</p>
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
              <div className="p-5 space-y-4 bg-gradient-to-br from-red-50/50 to-rose-50/30">
                {/* Selection Section */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Standard Preparation Selection */}
                  <div>
                    <label className="block text-xs font-semibold text-red-900 mb-2">
                      Select Standard Preparation
                    </label>
                    <CustomDropdown
                      options={standardPreparations.map((prep) => ({
                        value: String(prep.id),
                        label: prep.label,
                      }))}
                      value={
                        calculation.selectedStandardPrepId
                          ? String(calculation.selectedStandardPrepId)
                          : ""
                      }
                      onChange={(value) =>
                        onFieldChange(
                          calculation.id,
                          "selectedStandardPrepId",
                          value ? parseInt(value) : null
                        )
                      }
                      placeholder="-- Select Standard Prep --"
                      colorScheme="rose"
                    />
                  </div>

                  {/* Sample Preparation Selection */}
                  <div>
                    <label className="block text-xs font-semibold text-red-900 mb-2">
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
                    options={calculationTypes.map((type) => ({
                      value: type,
                      label: type,
                    }))}
                    value={calculation.calculationType}
                    onChange={(value) =>
                      onFieldChange(calculation.id, "calculationType", value)
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
                            <span className="font-bold text-red-800 bg-red-200/50 px-2 rounded-md">SW1:</span>
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
                                    value={dilution.name === "1st Dilution" ? dilution.vol1 : dilution.vol2} 
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
                            <span className="font-bold text-red-800 bg-red-200/50 px-2 rounded-md">SW2:</span>
                            <span className="text-gray-800 font-semibold flex items-center">
                              {sampleWeight.value} {sampleWeight.unit}
                              <WarningIndicator value={sampleWeight.value} />
                            </span>
                          </div>
                          {/* Dilutions */}
                          {sampleDilutions.map((dilution, idx) => (
                            <div key={idx} className="space-y-2">
                              {/* V8, V10, V12, V14, etc. (Aliquot) */}
                              {dilution.name !== "1st Dilution" && (
                                <div className="flex items-center justify-between gap-3 text-xs bg-gradient-to-r from-red-100 to-red-50 p-3 rounded-lg border border-red-200 hover:shadow-md transition-all">
                                  <span className="font-bold text-red-800 bg-red-200/50 px-2 rounded-md">
                                    V{(idx * 2) + 8}:
                                  </span>
                                  <span className="text-gray-800 font-semibold flex items-center">
                                    {dilution.vol1} {dilution.unit1}
                                    <WarningIndicator value={dilution.vol1} />
                                  </span>
                                </div>
                              )}
                              {/* V9, V11, V13, V15, etc. (Final Volume) */}
                              <div className="flex items-center justify-between gap-3 text-xs bg-gradient-to-r from-red-100 to-red-50 p-3 rounded-lg border border-red-200 hover:shadow-md transition-all">
                                <span className="font-bold text-red-800 bg-red-200/50 px-2 rounded-md">
                                  V{(idx * 2 + 1) + 8}:
                                </span>
                                <span className="text-gray-800 font-semibold flex items-center">
                                  {dilution.name === "1st Dilution" 
                                    ? dilution.vol1 
                                    : dilution.vol2}{" "}
                                  {dilution.name === "1st Dilution"
                                    ? dilution.unit1
                                    : dilution.unit2}
                                  <WarningIndicator 
                                    value={dilution.name === "1st Dilution" ? dilution.vol1 : dilution.vol2} 
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
                {calculation.calculationType && canCalculate && (
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
                              onFieldChange(calculation.id, "areaOfSample", e.target.value)
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
                              onFieldChange(calculation.id, "areaOfStandard", e.target.value)
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
                            value={calculation.baseXPurity}
                            onChange={(e) =>
                              onFieldChange(calculation.id, "baseXPurity", e.target.value)
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
                              onFieldChange(calculation.id, "mwBase", e.target.value)
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
                              onFieldChange(calculation.id, "mwSalt", e.target.value)
                            }
                            placeholder="MW Salt"
                            className="w-full px-3 py-2 border border-red-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-red-400"
                          />
                        </div>
                      </div>
                      
                      {/* Additional Fields (Avg Wt / Dose Vol / Sample Vol) */}
                      <div className="grid grid-cols-3 gap-3">
                        {(calculation.calculationType === "For Tablets" ||
                          calculation.calculationType === "For Capsule" ||
                          calculation.calculationType === "For Injection Vial" ||
                          calculation.calculationType === "For Oral Suspension" ||
                          calculation.calculationType === "For Oral Liquid") && (
                          <div className={calculation.calculationType === "For Oral Liquid" ? 'col-span-1' : (calculation.calculationType === "For Oral Suspension" ? 'col-span-1' : 'col-span-1')}>
                            <label className="block text-xs font-semibold text-red-900 mb-1">
                              {calculation.calculationType === "For Oral Suspension"
                                ? "Wt / ml (Avg Wt)"
                                : calculation.calculationType === "For Oral Liquid"
                                ? "Sample Vol"
                                : "Avg Weight"}
                            </label>
                            <input
                              type="text"
                              value={calculation.avgWt}
                              onChange={(e) =>
                                onFieldChange(calculation.id, "avgWt", e.target.value)
                              }
                              placeholder={
                                calculation.calculationType === "For Oral Suspension" ? "Wt / ml" : 
                                calculation.calculationType === "For Oral Liquid" ? "Sample Vol" : "Avg Wt"
                              }
                              className="w-full px-3 py-2 border border-red-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-red-400"
                            />
                          </div>
                        )}
                        {(calculation.calculationType === "For Oral Suspension" ||
                          calculation.calculationType === "For Oral Liquid") && (
                          <div className="col-span-1">
                            <label className="block text-xs font-semibold text-red-900 mb-1">
                              Dose Volume
                            </label>
                            <input
                              type="text"
                              value={calculation.doseVolume}
                              onChange={(e) =>
                                onFieldChange(calculation.id, "doseVolume", e.target.value)
                              }
                              placeholder="Dose Vol"
                              className="w-full px-3 py-2 border border-red-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-red-400"
                            />
                          </div>
                        )}
                        {/* Empty placeholder to maintain grid layout when only one input is visible */}
                        {(calculation.calculationType === "For Tablets" ||
                          calculation.calculationType === "For Capsule" ||
                          calculation.calculationType === "For Injection Vial") && (
                            <div className='col-span-2'></div>
                        )}
                      </div>

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
                                    className="p-1 -mt-1 -mr-1 text-gray-400 hover:text-red-500 transition-colors"
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
                      Please select both Standard and Sample preparations to enable calculation
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

export default CalculationDetail;