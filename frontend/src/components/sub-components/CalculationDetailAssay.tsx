import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Calculator, Trash, CheckCircle, AlertTriangle, X } from "lucide-react"; 
import type { CalculationAssay, CalculationType } from "../../models/CalculationAssay";
import type { StandardPreparation } from "../../models/StandardPreparation";
import type { SamplePreparation } from "../../models/SamplePreparation";
import CustomDropdown from "../shared/CustomDropdown";

// 1. UPDATED: Added "For Raw Material"
const calculationTypes: CalculationType[] = [
  "For Tablets",
  "For Capsule",
  "For Injection Vial",
  "For Oral Suspension",
  "For Oral Liquid",
  "For Raw Material", 
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


const convertMassToMg = (value: string | number, unit: string): number => {
    const val = parseFloat(String(value));
    if (isNaN(val)) return 0;

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
            // If unit is unknown or empty, assume it's already in the target unit (mg)
            return val;
    }
};


const convertVolumeToMl = (value: string | number, unit: string): number => {
    const val = parseFloat(String(value));
    if (isNaN(val)) return 0;

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
            // If unit is unknown or empty, assume it's already in the target unit (ml)
            return val;
    }
};

const CalculationDetailAssay: React.FC<CalculationDetailAssayProps> = ({
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
  
  // Explicit mapping for Standard Volumes to avoid index overwrites
  const getStandardVolumes = () => {
    const stdVols: { [key: string]: number } = {};
    
    standardDilutions.forEach((dilution) => {
      // CONVERSION APPLIED: Convert all volumes to ML
      const val1 = convertVolumeToMl(dilution.vol1, dilution.unit1);
      const val2 = convertVolumeToMl(dilution.vol2, dilution.unit2);

      if (dilution.name === "1st Dilution") {
        // V1: Final Volume
        stdVols['V1'] = val1;
      } else if (dilution.name === "2nd Dilution") {
        // V2: Aliquot, V3: Final Volume
        stdVols['V2'] = val1;
        stdVols['V3'] = val2;
      } else if (dilution.name === "3rd Dilution") {
        // V4: Aliquot, V5: Final Volume
        stdVols['V4'] = val1;
        stdVols['V5'] = val2;
      } else if (dilution.name === "4th Dilution") {
        // V6: Aliquot, V7: Final Volume
        stdVols['V6'] = val1;
        stdVols['V7'] = val2;
      }
    });
    
    return stdVols;
  };
  
  // Explicit mapping for Sample Volumes to ensure V8, V9, V10 etc are assigned correctly
  const getSampleVolumes = () => {
    const splVols: { [key: string]: number } = {};
    
    sampleDilutions.forEach((dilution) => {
      // CONVERSION APPLIED: Convert all volumes to ML
      const val1 = convertVolumeToMl(dilution.vol1, dilution.unit1);
      const val2 = convertVolumeToMl(dilution.vol2, dilution.unit2);

      if (dilution.name === "1st Dilution") {
        // V8: Final Volume
        splVols['V8'] = val1;
      } else if (dilution.name === "2nd Dilution") {
        // V9: Aliquot, V10: Final Volume
        splVols['V9'] = val1;
        splVols['V10'] = val2;
      } else if (dilution.name === "3rd Dilution") {
        // V11: Aliquot, V12: Final Volume
        splVols['V11'] = val1;
        splVols['V12'] = val2;
      } else if (dilution.name === "4th Dilution") {
        // V13: Aliquot, V14: Final Volume
        splVols['V13'] = val1;
        splVols['V14'] = val2;
      }
    });
    
    return splVols;
  };

  const performCalculation = () => {
    console.group("🧪 Calculation Debugger Started");

    if (!canCalculate) {
      console.warn("Cannot calculate: Missing preparations or calculation type.");
      setCalculationResult("Error: Please select both Standard and Sample preparations and a calculation type.");
      console.groupEnd();
      return;
    }

    const stdVols = getStandardVolumes();
    const splVols_all = getSampleVolumes();
    
    // 1. Log Raw Inputs
    const rawInputs = {
        AreaSample: calculation.areaOfSample,
        AreaStandard: calculation.areaOfStandard,
        SW1_StdWt: standardWeight.value,
        SW2_SplWt: sampleWeight.value,
        MW_Base: calculation.mwBase,
        MW_Salt: calculation.mwSalt,
        Purity: calculation.baseXPurity,
        AvgWt_density: calculation.avgWt,
        claimVol: calculation.claimVolume
    };
    console.log("1. Raw Inputs from Form:", rawInputs);

    // 2. Parse Numbers & Apply Mass Conversion
    const AreaOfSample = parseFloat(calculation.areaOfSample as string) || 0;
    const AreaOfStandard = parseFloat(calculation.areaOfStandard as string) || 0;
    // CONVERSION APPLIED: SW1 and SW2 are converted to milligrams (mg)
    const SW1_Standard = convertMassToMg(standardWeight.value, standardWeight.unit);
    const SW2_Sample = convertMassToMg(sampleWeight.value, sampleWeight.unit);

    const MWBase = parseFloat(calculation.mwBase as string) || 0;
    const MWSalt = parseFloat(calculation.mwSalt as string) || 0;
    const Purity = parseFloat(calculation.baseXPurity as string) || 0;
    
    // 3. Volume Logic (The most complex part)
    const allVols = { ...stdVols, ...splVols_all };
    console.log("2. Volume Inputs Detected (All volumes converted to ML):", allVols);
    console.log(`   SW1 (Std Wt) converted to mg: ${SW1_Standard}`);
    console.log(`   SW2 (Spl Wt) converted to mg: ${SW2_Sample}`);


    let productEvens = 1; // Numerator (Usually Aliquots for Std, Final Vols for Spl)
    let productOdds = 1;  // Denominator (Usually Final Vols for Std, Aliquots for Spl)
    let volumeLog = [];   // For debugging text

    // Iterate V1 to V15
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
    console.log(`   V_factor Result: ${V_factor} (Evens: ${productEvens} / Odds: ${productOdds})`);

    // 4. Calculate Ratios
    const AreaRatio = AreaOfStandard !== 0 ? AreaOfSample / AreaOfStandard : 0;
    const MWRatio = MWSalt !== 0 ? MWBase / MWSalt : 0;
    const PurityFactor = Purity / 100;

    console.log("4. Intermediate Ratios:", {
        "Area Ratio (Spl/Std)": `${AreaOfSample} / ${AreaOfStandard} = ${AreaRatio}`,
        "MW Ratio (Base/Salt)": `${MWBase} / ${MWSalt} = ${MWRatio}`,
        "Purity Factor": `${Purity} / 100 = ${PurityFactor}`
    });

    // 5. Final Switch Case Calculation
    let FinalResult = 0;
    let unit = "";
    let formulaDebugString = ""; // To print the math visually

    // The common part of the formula is now unit-aware because SW1 is in mg and volumes are in ml.
    const commonPart = AreaRatio * V_factor * MWRatio * PurityFactor;

    switch (calculation.calculationType) {
      case "For Tablets":
      case "For Capsule":
      case "For Injection Vial": {
        // AvgWt is the Avg Wt of Tablet/Capsule in mg, or Avg Content of Vial in mg.
        const AvgWt = parseFloat(calculation.avgWt as string) || 0; 
        
        // Formula: (Common * SW1 * AvgWt) / SW2. 
        if (SW2_Sample !== 0) {
            FinalResult = (commonPart * SW1_Standard * AvgWt) / SW2_Sample;
        }

        formulaDebugString = `(${AreaRatio.toFixed(4)} * ${V_factor.toFixed(4)} * ${MWRatio.toFixed(4)} * ${PurityFactor} * ${SW1_Standard} * ${AvgWt}) / ${SW2_Sample}`;
        
        // --- UNIT LOGIC ---
        if (calculation.calculationType === "For Injection Vial") {
            unit = "mg/Vial";
        } else if (calculation.calculationType === "For Capsule") {
            unit = "mg/Capsule";
        } else {
            unit = "mg/Tablet";
        }
        break;
      }
      
      case "For Oral Suspension": {
        const ClaimVolume = parseFloat(calculation.claimVolume as string) || 0; 
        // WtPerML is the Avg Wt per ml of the liquid sample in mg/ml
        const WtPerML = parseFloat(calculation.avgWt as string) || 0; 
        
        // Formula: (Common * SW1 * WtPerML * ClaimVol) / SW2
        if (SW2_Sample !== 0) {
            FinalResult = (commonPart * SW1_Standard * WtPerML * ClaimVolume) / SW2_Sample;
        }

        formulaDebugString = `(${AreaRatio.toFixed(4)} * ${V_factor.toFixed(4)} * ${MWRatio.toFixed(4)} * ${PurityFactor} * ${SW1_Standard} * ${WtPerML} * ${ClaimVolume}) / ${SW2_Sample}`;
        unit = "mg/ml";
        break;
      }
      
      case "For Oral Liquid": {
        const ClaimVolume = parseFloat(calculation.claimVolume as string) || 0; 
        // SampleVolume is the volume of the sample taken (converted to mL).
        // Since the input field 'avgWt' doesn't have a dedicated unit, we pass a default 'ml' 
        // but rely on convertVolumeToMl to handle L/uL inputs if entered in the value field.
        const SampleVolume = convertVolumeToMl(calculation.avgWt, "ml"); 
        
        // Formula: (Common * SW1 * ClaimVol) / SampleVol
        if (SampleVolume !== 0) {
            FinalResult = (commonPart * SW1_Standard * ClaimVolume) / SampleVolume;
        }

        formulaDebugString = `(${AreaRatio.toFixed(4)} * ${V_factor.toFixed(4)} * ${MWRatio.toFixed(4)} * ${PurityFactor} * ${SW1_Standard} * ${ClaimVolume}) / ${SampleVolume}`;
        unit = "mg/ml";
        break;
      }

      // 2. ADDED: Calculation for Raw Material Assay
      case "For Raw Material": {
        // Formula: ((Area Spl / Area Std) * (SW1 / SW2) * V_Factor * (Purity / 100) * (MW Base / MW Salt)) * 100
        // The common part already includes all ratios and Purity factor.
        // We only need to handle the weight ratio and multiply by 100.

        if (SW2_Sample !== 0) {
            const weightRatio = SW1_Standard / SW2_Sample;
            FinalResult = commonPart * weightRatio * 100;
        }

        formulaDebugString = `( ${AreaRatio.toFixed(4)} * ${V_factor.toFixed(4)} * ${MWRatio.toFixed(4)} * ${PurityFactor} * (${SW1_Standard} / ${SW2_Sample}) ) * 100`;
        unit = "%";
        break;
      }
    }

    // 6. Final Console Output
    console.log("%c 5. FINAL FORMULA TRACE:", "color: blue; font-weight: bold");
    console.log(formulaDebugString);
    console.log(`%c Calculated Result: ${FinalResult}`, "color: green; font-weight: bold; font-size: 14px");
    console.groupEnd();

    // 7. Update State
    if (isNaN(FinalResult) || !isFinite(FinalResult)) {
        setCalculationResult("Error: Result is NaN or Infinite. Check console for details.");
    } else {
        setCalculationResult(`Result: ${FinalResult.toFixed(4)} ${unit}`);
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
                <p className="text-xs text-red-100">Calculation Details for Assay</p>
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
                              {/* V9, V11, V13 etc. (Aliquot) */}
                              {dilution.name !== "1st Dilution" && (
                                <div className="flex items-center justify-between gap-3 text-xs bg-gradient-to-r from-red-100 to-red-50 p-3 rounded-lg border border-red-200 hover:shadow-md transition-all">
                                  <span className="font-bold text-red-800 bg-red-200/50 px-2 rounded-md">
                                    V{(idx * 2) + 7}:
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
                                  V{(idx * 2) + 8}:
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
                      
                      {/* Additional Fields (Avg Wt / Claim Vol / Sample Vol) */}
                      <div className="grid grid-cols-3 gap-3">
                        {(calculation.calculationType === "For Tablets" ||
                          calculation.calculationType === "For Capsule" ||
                          calculation.calculationType === "For Injection Vial" ||
                          calculation.calculationType === "For Oral Suspension" ||
                          calculation.calculationType === "For Oral Liquid") && (
                          <div className={calculation.calculationType === "For Oral Liquid" ? 'col-span-1' : (calculation.calculationType === "For Oral Suspension" ? 'col-span-1' : 'col-span-1')}>
                            <label className="block text-xs font-semibold text-red-900 mb-1">
                              {calculation.calculationType === "For Oral Suspension"
                                ? "Wt / ml (Avg Wt) (mg/ml)"
                                : calculation.calculationType === "For Oral Liquid"
                                ? "Sample Vol (mL/L)"
                                : calculation.calculationType === "For Injection Vial"
                                ? "Average Content (mg)"
                                : "Avg Weight (mg)"}
                            </label>
                            <input
                              type="text"
                              value={calculation.avgWt}
                              onChange={(e) =>
                                onFieldChange(calculation.id, "avgWt", e.target.value)
                              }
                              placeholder={
                                calculation.calculationType === "For Oral Suspension" ? "Wt / ml" : 
                                calculation.calculationType === "For Oral Liquid" ? "Sample Vol" : 
                                calculation.calculationType === "For Injection Vial" ? "Average Content" :
                                "Avg Wt"
                              }
                              className="w-full px-3 py-2 border border-red-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-red-400"
                            />
                          </div>
                        )}
                        {(calculation.calculationType === "For Oral Suspension" ||
                          calculation.calculationType === "For Oral Liquid") && (
                          <div className="col-span-1">
                            <label className="block text-xs font-semibold text-red-900 mb-1">
                              Claim Volume
                            </label>
                            <input
                              type="text"
                              value={calculation.claimVolume}
                              onChange={(e) =>
                                onFieldChange(calculation.id, "claimVolume", e.target.value)
                              }
                              placeholder="Claim Vol"
                              className="w-full px-3 py-2 border border-red-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-red-400"
                            />
                          </div>
                        )}
                        {/* Empty placeholder to maintain grid layout when inputs are hidden for Raw Material */}
                        {(calculation.calculationType === "For Tablets" ||
                          calculation.calculationType === "For Capsule" ||
                          calculation.calculationType === "For Injection Vial" ||
                          calculation.calculationType === "For Raw Material") && (
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

export default CalculationDetailAssay;