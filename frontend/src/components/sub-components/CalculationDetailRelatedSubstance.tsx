import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  Calculator,
  Trash,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import type {
  CalculationRelatedSubstance,
  RelatedSubstanceCalculationType,
} from "../../preparation_models/CalculationRelatedSubstance";
import type { StandardPreparation } from "../../preparation_models/StandardPreparation";
import type { SamplePreparation } from "../../preparation_models/SamplePreparation";
import CustomDropdown from "../shared/CustomDropdown";

const calculationForOptions: RelatedSubstanceCalculationType[] = [
  "Tablets",
  "Capsule",
  "Injection Vial",
  "Oral Suspension",
  "Oral Liquid",
  "Raw Material",
];

interface CalculationDetailRelatedSubstanceProps {
  calculation: CalculationRelatedSubstance;
  standardPreparations: StandardPreparation[];
  samplePreparations: SamplePreparation[];
  onFieldChange: (
    calculationId: number,
    field: keyof CalculationRelatedSubstance,
    value: string | number | null,
  ) => void;
  onRemove: () => void;
  role: string;
}

interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

const weightUnitOptions = [
  { value: "mg", label: "mg" },
  { value: "g", label: "g" },
  { value: "kg", label: "kg" },
];

const volumeUnitOptions = [
  { value: "ml", label: "ml" },
  { value: "L", label: "L" },
  { value: "µL", label: "µL" },
];

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

const CalculationDetailRelatedSubstance: React.FC<
  CalculationDetailRelatedSubstanceProps
> = ({
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

  const selectedStandardPrep = standardPreparations.find(
    (prep) => prep.label === calculation.selectedStandardPreparationLabel,
  );

  const selectedSamplePrep = samplePreparations.find(
    (prep) => prep.label === calculation.selectedSamplePreparationLabel,
  );

  const preparationPairs = standardPreparations
    .map((stdPrep) => {
      const matchingSamplePrep = samplePreparations.find(
        (samplePrep) =>
          samplePrep.label.charAt(samplePrep.label.length - 1) ===
          stdPrep.label.charAt(stdPrep.label.length - 1),
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

  const handlePreparationChange = (value: string) => {
    const selectedPair = preparationPairs.find((pair) => pair?.value === value);
    if (selectedPair) {
      onFieldChange(
        calculation.id,
        "selectedStandardPreparationLabel",
        selectedPair.standardLabel,
      );
      onFieldChange(
        calculation.id,
        "selectedSamplePreparationLabel",
        selectedPair.sampleLabel,
      );
    } else {
      onFieldChange(calculation.id, "selectedStandardPreparationLabel", null);
      onFieldChange(calculation.id, "selectedSamplePreparationLabel", null);
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
          step.name === "3rd Dilution" ||
          step.name === "4th Dilution",
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
          step.name === "4th Dilution",
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
      if (!isValueValid(stdWeighing.value1))
        errors.push(
          "Standard Preparation - Weighing: Weight value is required",
        );
      if (!stdWeighing.logBookID || stdWeighing.logBookID.trim() === "")
        errors.push("Standard Preparation - Weighing: Logbook ID is required");
    }
    const stdFiltration = stdSteps.find((s) => s.name === "Filtration");
    if (!stdFiltration) {
      errors.push("Standard Preparation: Filtration step is missing");
    } else {
      if (!isValueValid(stdFiltration.value1))
        errors.push(
          "Standard Preparation - Filtration: Filter size is required",
        );
    }

    const smpSteps = Array.isArray(selectedSamplePrep.steps)
      ? selectedSamplePrep.steps
      : [];
    const smpWeighing = smpSteps.find((s) => s.name === "Weighing");
    if (!smpWeighing) {
      errors.push("Sample Preparation: Weighing step is missing");
    } else {
      if (!isValueValid(smpWeighing.value1))
        errors.push("Sample Preparation - Weighing: Weight value is required");
      if (!smpWeighing.logBookID || smpWeighing.logBookID.trim() === "")
        errors.push("Sample Preparation - Weighing: Logbook ID is required");
    }
    const smpFiltration = smpSteps.find((s) => s.name === "Filtration");
    if (!smpFiltration) {
      errors.push("Sample Preparation: Filtration step is missing");
    } else {
      if (!isValueValid(smpFiltration.value1))
        errors.push("Sample Preparation - Filtration: Filter size is required");
    }

    return { isValid: errors.length === 0, errors, warnings };
  };

  useEffect(() => {
    const result = validatePreparations();
    setValidationResult(result);
  }, [selectedStandardPrep, selectedSamplePrep]);

  // ── Formula Display ──────────────────────────────────────────────────────────
  const FormulaDisplay: React.FC = () => {
    if (
      !selectedStandardPrep ||
      !selectedSamplePrep ||
      !calculation.calculationFor
    )
      return null;

    const stdSteps = Array.isArray(selectedStandardPrep.steps)
      ? selectedStandardPrep.steps
      : [];
    const smpSteps = Array.isArray(selectedSamplePrep.steps)
      ? selectedSamplePrep.steps
      : [];
    const stdWeighing = stdSteps.find((s) => s.name === "Weighing");
    const smpWeighing = smpSteps.find((s) => s.name === "Weighing");

    const stdWeightMg = stdWeighing?.value1
      ? convertMassToMg(stdWeighing.value1, stdWeighing.unit1 || "mg")
      : 1;
    const smpWeightMg = smpWeighing?.value1
      ? convertMassToMg(smpWeighing.value1, smpWeighing.unit1 || "mg")
      : 1;

    const areaStd = calculation.areaOfStandard || "1";
    const areaSmp = calculation.areaOfSample || "1";
    const purity = calculation.purity || "1";
    const mwBase = calculation.mWBase || "1";
    const mwSalt = calculation.mWSalt || "1";
    const rf = calculation.responseFactor || "1";
    const rfUnit = calculation.responseFactorUnit || "";

    const stdVolsNumSym: string[] = [],
      stdVolsDenomSym: string[] = [];
    const stdVolsNumVal: string[] = [],
      stdVolsDenomVal: string[] = [];

    standardDilutions.forEach((dil, idx) => {
      if (idx === 0) {
        if (dil.vol1) {
          stdVolsDenomSym.push("V1");
          stdVolsDenomVal.push(
            convertVolumeToMl(dil.vol1, dil.unit1).toString(),
          );
        }
      } else {
        if (dil.vol1) {
          const vn = idx === 1 ? "V2" : idx === 2 ? "V4" : "V6";
          stdVolsNumSym.push(vn);
          stdVolsNumVal.push(convertVolumeToMl(dil.vol1, dil.unit1).toString());
        }
        if (dil.vol2) {
          const vn = idx === 1 ? "V3" : idx === 2 ? "V5" : "V7";
          stdVolsDenomSym.push(vn);
          stdVolsDenomVal.push(
            convertVolumeToMl(dil.vol2, dil.unit2).toString(),
          );
        }
      }
    });

    const smpVolsNumSym: string[] = [],
      smpVolsDenomSym: string[] = [];
    const smpVolsNumVal: string[] = [],
      smpVolsDenomVal: string[] = [];

    sampleDilutions.forEach((dil, idx) => {
      if (idx === 0) {
        if (dil.vol1) {
          smpVolsNumSym.push("V8");
          smpVolsNumVal.push(convertVolumeToMl(dil.vol1, dil.unit1).toString());
        }
      } else {
        if (dil.vol1) {
          const vn = idx === 1 ? "V9" : idx === 2 ? "V11" : "V13";
          smpVolsDenomSym.push(vn);
          smpVolsDenomVal.push(
            convertVolumeToMl(dil.vol1, dil.unit1).toString(),
          );
        }
        if (dil.vol2) {
          const vn = idx === 1 ? "V10" : idx === 2 ? "V12" : "V14";
          smpVolsNumSym.push(vn);
          smpVolsNumVal.push(convertVolumeToMl(dil.vol2, dil.unit2).toString());
        }
      }
    });

    const numSym = [
      "Area/ABS of Sample",
      "× SW1",
      ...stdVolsNumSym.map((v) => `× ${v}`),
      ...smpVolsNumSym.map((v) => `× ${v}`),
      "× MW Base",
      "× Purity%",
    ];
    const denomSym = [
      "Area/ABS of Standard",
      ...stdVolsDenomSym.map((v) => `× ${v}`),
      "× SW2",
      ...smpVolsDenomSym.map((v) => `× ${v}`),
      "× MW Salt",
      "× 100",
    ];
    const numVal = [
      areaSmp,
      stdWeightMg.toString(),
      ...stdVolsNumVal,
      ...smpVolsNumVal,
      mwBase,
      purity,
    ];
    const denomVal = [
      areaStd,
      ...stdVolsDenomVal,
      smpWeightMg.toString(),
      ...smpVolsDenomVal,
      mwSalt,
      "100",
    ];

    const labelClaim = calculation.labelClaim || "1";

    if (
      calculation.calculationFor === "Tablets" ||
      calculation.calculationFor === "Capsule" ||
      calculation.calculationFor === "Injection Vial"
    ) {
      numSym.push("× Avg Wt", "× 100");
      numVal.push(
        convertMassToMg(
          calculation.avgWeight || "1",
          calculation.avgWeightUnit || "mg",
        ).toString(),
        "100",
      );
      denomSym.push("× Label Claim");
      denomVal.push(labelClaim);
    } else if (calculation.calculationFor === "Oral Suspension") {
      numSym.push("× Wt/ml", "× Dose Volume", "× 100");
      numVal.push(
        convertMassToMg(
          calculation.weightPerMl || "1",
          calculation.weightPerMlUnit || "mg",
        ).toString(),
        calculation.doseVolume || "1",
        "100",
      );
      denomSym.push("× Label Claim");
      denomVal.push(labelClaim);
    } else if (calculation.calculationFor === "Oral Liquid") {
      numSym.push("× Dose Volume", "× 100");
      numVal.push(calculation.doseVolume || "1", "100");
      denomSym.push("× Label Claim");
      denomVal.push(labelClaim);
    } else if (calculation.calculationFor === "Raw Material") {
      numSym.push("× 100");
      numVal.push("100");
      // Raw Material: no Label Claim in denominator
    }

    numSym.push(`× RF${rfUnit ? ` (${rfUnit})` : ""}`);
    numVal.push(rf);

    return (
      <div className="bg-white rounded-lg p-4 border-2 border-emerald-200 shadow-sm mt-4">
        <h4 className="text-sm font-bold text-gray-900 mb-3">
          Formula for {calculation.calculationFor}
        </h4>
        <div className="bg-gray-50 rounded p-3 mb-3">
          <div className="flex flex-col items-center">
            <div className="text-center border-b-2 border-black pb-2 mb-2 px-2 w-full">
              <p className="text-xs font-mono text-black break-words">
                {numSym.join(" ")}
              </p>
            </div>
            <div className="text-center px-2 w-full">
              <p className="text-xs font-mono text-black break-words">
                {denomSym.join(" ")}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-emerald-50 rounded p-3">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-black">=</span>
            <div className="flex-1 flex flex-col items-center">
              <div className="text-center border-b-2 border-black pb-2 mb-2 px-2 w-full">
                <p className="text-xs font-mono text-black break-words">
                  {numVal.join(" × ")}
                </p>
              </div>
              <div className="text-center px-2 w-full">
                <p className="text-xs font-mono text-black break-words">
                  {denomVal.join(" × ")}
                </p>
              </div>
            </div>
          </div>
        </div>
        <p className="text-xs text-right text-gray-600 mt-2 font-semibold">
          = %
        </p>
        {calculation.calculationResultUnit === "ppm" && (
          <div className="mt-3 border-t border-emerald-200 pt-3">
            <p className="text-xs font-bold text-emerald-700 mb-1">
              ppm Conversion
            </p>
            <div className="bg-emerald-50 rounded p-2 flex items-center gap-2 text-xs font-mono text-gray-800">
              <span>Result (ppm)</span>
              <span>=</span>
              <span>Result (%)</span>
              <span>&times; 1000</span>
              {calculation.calculationResult &&
                !calculation.calculationResult.startsWith("Error") && (
                  <>
                    <span>=</span>
                    <span className="font-bold text-emerald-700">
                      {calculation.calculationResult} ppm
                    </span>
                  </>
                )}
            </div>
          </div>
        )}
      </div>
    );
  };

  // ── Volume helpers ───────────────────────────────────────────────────────────
  const getStandardVolumes = () => {
    const stdVols: { [key: string]: number } = {};
    standardDilutions.forEach((dilution) => {
      const val1 = convertVolumeToMl(dilution.vol1, dilution.unit1);
      const val2 = convertVolumeToMl(dilution.vol2, dilution.unit2);
      if (dilution.name === "1st Dilution") stdVols["V1"] = val1;
      else if (dilution.name === "2nd Dilution") {
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

  const getSampleVolumes = () => {
    const splVols: { [key: string]: number } = {};
    sampleDilutions.forEach((dilution) => {
      const val1 = convertVolumeToMl(dilution.vol1, dilution.unit1);
      const val2 = convertVolumeToMl(dilution.vol2, dilution.unit2);
      if (dilution.name === "1st Dilution") splVols["V8"] = val1;
      else if (dilution.name === "2nd Dilution") {
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

  // ── Perform Calculation ──────────────────────────────────────────────────────
  const performCalculation = () => {
    const result = validatePreparations();
    setValidationResult(result);

    if (!result.isValid) {
      onFieldChange(
        calculation.id,
        "calculationResult",
        `Error: Cannot calculate - ${result.errors.length} validation error(s). Please check the validation messages above.`,
      );
      return;
    }
    if (!calculation.calculationFor) {
      onFieldChange(
        calculation.id,
        "calculationResult",
        "Error: Please select a calculation type.",
      );
      return;
    }

    const stdVols = getStandardVolumes();
    const splVols = getSampleVolumes();

    const AreaOfSample = parseFloat(calculation.areaOfSample) || 1;
    const AreaOfStandard = parseFloat(calculation.areaOfStandard) || 1;
    const SW1_Standard = convertMassToMg(
      standardWeight.value,
      standardWeight.unit,
    );
    const SW2_Sample = convertMassToMg(sampleWeight.value, sampleWeight.unit);
    const MWBase = parseFloat(calculation.mWBase) || 1;
    const MWSalt = parseFloat(calculation.mWSalt) || 1;
    const Purity = parseFloat(calculation.purity) || 1;
    const RF = convertMassToMg(calculation.responseFactor, calculation.responseFactorUnit || "mg") || 1;

    onFieldChange(calculation.id, "sw1", SW1_Standard.toString());
    onFieldChange(calculation.id, "sw2", SW2_Sample.toString());
    onFieldChange(calculation.id, "v1", (stdVols.V1 || 0).toString());
    onFieldChange(calculation.id, "v2", (stdVols.V2 || 0).toString());
    onFieldChange(calculation.id, "v3", (stdVols.V3 || 0).toString());
    onFieldChange(calculation.id, "v4", (stdVols.V4 || 0).toString());
    onFieldChange(calculation.id, "v5", (stdVols.V5 || 0).toString());
    onFieldChange(calculation.id, "v6", (stdVols.V6 || 0).toString());
    onFieldChange(calculation.id, "v7", (stdVols.V7 || 0).toString());
    onFieldChange(calculation.id, "v8", (splVols.V8 || 0).toString());
    onFieldChange(calculation.id, "v9", (splVols.V9 || 0).toString());
    onFieldChange(calculation.id, "v10", (splVols.V10 || 0).toString());
    onFieldChange(calculation.id, "v11", (splVols.V11 || 0).toString());
    onFieldChange(calculation.id, "v12", (splVols.V12 || 0).toString());
    onFieldChange(calculation.id, "v13", (splVols.V13 || 0).toString());
    onFieldChange(calculation.id, "v14", (splVols.V14 || 0).toString());

    const allVols = { ...stdVols, ...splVols };
    let productEvens = 1;
    let productOdds = 1;
    for (let i = 1; i <= 14; i++) {
      const val = allVols[`V${i}`];
      if (val !== undefined && !isNaN(val) && val !== 0) {
        if (i % 2 === 0) productEvens *= val;
        else productOdds *= val;
      }
    }
    const V_factor = productOdds !== 0 ? productEvens / productOdds : 0;
    const AreaRatio = AreaOfStandard !== 0 ? AreaOfSample / AreaOfStandard : 0;
    const MWRatio = MWSalt !== 0 ? MWBase / MWSalt : 1;
    const PurityFactor = Purity / 100;
    const commonPart = AreaRatio * V_factor * MWRatio * PurityFactor * RF;

    const LabelClaim = convertMassToMg(calculation.labelClaim, calculation.labelClaimUnit || "mg") || 1;

    let FinalResult = 0;
    switch (calculation.calculationFor) {
      case "Tablets":
      case "Capsule":
      case "Injection Vial": {
        const AvgWt = convertMassToMg(
          calculation.avgWeight || "1",
          calculation.avgWeightUnit || "mg",
        );
        if (SW2_Sample !== 0)
          FinalResult =
            ((commonPart * SW1_Standard * AvgWt) / (SW2_Sample * LabelClaim)) *
            100;
        break;
      }
      case "Oral Suspension": {
        const doseVol = parseFloat(calculation.doseVolume) || 1;
        const WtPerML = convertMassToMg(
          calculation.weightPerMl || "1",
          calculation.weightPerMlUnit || calculation.weightPerMlUnit || "mg",
        );
        if (SW2_Sample !== 0)
          FinalResult =
            ((commonPart * SW1_Standard * WtPerML * doseVol) /
              (SW2_Sample * LabelClaim)) *
            100;
        break;
      }
      case "Oral Liquid": {
        const doseVol = parseFloat(calculation.doseVolume) || 1;
        if (SW2_Sample !== 0)
          FinalResult =
            ((commonPart * SW1_Standard * doseVol) /
              (SW2_Sample * LabelClaim)) *
            100;
        break;
      }
      case "Raw Material": {
        // No Label Claim in denominator for Raw Material
        if (SW2_Sample !== 0)
          FinalResult = ((commonPart * SW1_Standard) / SW2_Sample) * 100;
        break;
      }
      default:
        FinalResult = 0;
    }

    const isPpm = calculation.calculationResultUnit === "ppm";
    const displayResult = isPpm ? FinalResult * 1000 : FinalResult;
    onFieldChange(calculation.id, "calculationResult", displayResult.toFixed(4));
    if (!calculation.calculationResultUnit) {
      onFieldChange(calculation.id, "calculationResultUnit", "%");
    }
  };

  // ── Shared styles ────────────────────────────────────────────────────────────
  const inputCls =
    "w-full px-3 py-2 bg-white border border-emerald-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-emerald-50";
  const labelCls = "block text-xs font-semibold text-gray-600 mb-1";
  const preventScroll = (e: React.WheelEvent<HTMLInputElement>) =>
    e.currentTarget.blur();
  const preventArrow = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowUp" || e.key === "ArrowDown") e.preventDefault();
  };

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white rounded-xl shadow-lg border-2 border-emerald-200 overflow-hidden mb-6"
    >
      {/* Header */}
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
                Related Substance Calculation
                {calculation.calculationFor
                  ? ` — ${calculation.calculationFor}`
                  : ""}
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

      {/* Validation banner */}
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
          className="bg-green-50 border-b-2 border-emerald-200"
        >
          <div className="p-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              <p className="text-sm font-semibold text-green-800">
                All required fields are valid - Ready to calculate
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Body */}
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
                {/* Preparation selector */}
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

                {/* Calculation type selector */}
                {selectedStandardPrep && selectedSamplePrep && (
                  <div className="bg-gradient-to-r from-emerald-50 to-emerald-50 rounded-lg p-4 border-2 border-emerald-200">
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Calculation For
                    </label>
                    <CustomDropdown
                      options={calculationForOptions.map((type) => ({
                        value: type,
                        label: type,
                      }))}
                      value={calculation.calculationFor || ""}
                      onChange={(value) =>
                        onFieldChange(calculation.id, "calculationFor", value)
                      }
                      placeholder="Select calculation type..."
                      colorScheme="emerald"
                    />
                  </div>
                )}

                {/* Formula */}
                {selectedStandardPrep &&
                  selectedSamplePrep &&
                  calculation.calculationFor && <FormulaDisplay />}

                {/* Input fields — gated on prep + calculationFor */}
                {selectedStandardPrep &&
                  selectedSamplePrep &&
                  calculation.calculationFor && (
                    <div className="space-y-6">
                      {/* Area/ABS Values */}
                      <div className="bg-gradient-to-r from-emerald-50 to-emerald-50 rounded-lg p-4 border-2 border-emerald-200">
                        <h5 className="text-sm font-bold text-gray-700 mb-3">
                          Area/ABS Values
                        </h5>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <label className={labelCls}>
                              Standard Area/ABS *
                            </label>
                            <input
                              type="number"
                              value={calculation.areaOfStandard || ""}
                              onChange={(e) =>
                                onFieldChange(
                                  calculation.id,
                                  "areaOfStandard",
                                  e.target.value,
                                )
                              }
                              step="any"
                              onKeyDown={preventArrow}
                              onWheel={preventScroll}
                              placeholder="Enter standard area"
                              className={inputCls}
                            />
                          </div>
                          <div>
                            <label className={labelCls}>
                              Sample Area/ABS *
                            </label>
                            <input
                              type="number"
                              value={calculation.areaOfSample || ""}
                              onChange={(e) =>
                                onFieldChange(
                                  calculation.id,
                                  "areaOfSample",
                                  e.target.value,
                                )
                              }
                              step="any"
                              onKeyDown={preventArrow}
                              onWheel={preventScroll}
                              placeholder="Enter sample area"
                              className={inputCls}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Standard Properties */}
                      <div className="bg-gradient-to-r from-emerald-50 to-emerald-50 rounded-lg p-4 border-2 border-emerald-200">
                        <h5 className="text-sm font-bold text-gray-700 mb-3">
                          Standard Properties
                        </h5>
                        <div className="grid md:grid-cols-3 gap-4">
                          <div>
                            <label className={labelCls}>Purity (%)</label>
                            <input
                              type="number"
                              value={calculation.purity || ""}
                              onChange={(e) =>
                                onFieldChange(
                                  calculation.id,
                                  "purity",
                                  e.target.value,
                                )
                              }
                              step="any"
                              onKeyDown={preventArrow}
                              onWheel={preventScroll}
                              placeholder="Purity %"
                              className={inputCls}
                            />
                          </div>
                          <div>
                            <label className={labelCls}>MW Base</label>
                            <input
                              type="number"
                              value={calculation.mWBase || ""}
                              onChange={(e) =>
                                onFieldChange(
                                  calculation.id,
                                  "mWBase",
                                  e.target.value,
                                )
                              }
                              step="any"
                              onKeyDown={preventArrow}
                              onWheel={preventScroll}
                              placeholder="MW Base"
                              className={inputCls}
                            />
                          </div>
                          <div>
                            <label className={labelCls}>MW Salt</label>
                            <input
                              type="number"
                              value={calculation.mWSalt || ""}
                              onChange={(e) =>
                                onFieldChange(
                                  calculation.id,
                                  "mWSalt",
                                  e.target.value,
                                )
                              }
                              step="any"
                              onKeyDown={preventArrow}
                              onWheel={preventScroll}
                              placeholder="MW Salt"
                              className={inputCls}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Tablets / Capsule / Injection Vial */}
                      {(calculation.calculationFor === "Tablets" ||
                        calculation.calculationFor === "Capsule" ||
                        calculation.calculationFor === "Injection Vial") && (
                        <div className="bg-gradient-to-r from-emerald-50 to-emerald-50 rounded-lg p-4 border-2 border-emerald-200">
                          <h5 className="text-sm font-bold text-gray-700 mb-3">
                            Product Details
                          </h5>
                          <div className="grid md:grid-cols-3 gap-4">
                            <div>
                              <label className={labelCls}>Average Weight</label>
                              <div className="flex gap-2">
                                <input
                                  type="number"
                                  value={calculation.avgWeight || ""}
                                  onChange={(e) =>
                                    onFieldChange(
                                      calculation.id,
                                      "avgWeight",
                                      e.target.value,
                                    )
                                  }
                                  step="any"
                                  onKeyDown={preventArrow}
                                  onWheel={preventScroll}
                                  placeholder="Enter average weight"
                                  className={inputCls}
                                />
                                <CustomDropdown
                                  options={weightUnitOptions}
                                  value={calculation.avgWeightUnit || "mg"}
                                  onChange={(value) =>
                                    onFieldChange(
                                      calculation.id,
                                      "avgWeightUnit",
                                      value,
                                    )
                                  }
                                  placeholder="Unit"
                                  colorScheme="emerald"
                                />
                              </div>
                            </div>
                            <div>
                              <label className={labelCls}>RF</label>
                              <div className="flex gap-2">
                                <input
                                  type="number"
                                  value={calculation.responseFactor || ""}
                                  onChange={(e) =>
                                    onFieldChange(
                                      calculation.id,
                                      "responseFactor",
                                      e.target.value,
                                    )
                                  }
                                  step="any"
                                  onKeyDown={preventArrow}
                                  onWheel={preventScroll}
                                  placeholder="e.g. 1.0"
                                  className={inputCls}
                                />
                                <div>
                                  <CustomDropdown
                                    options={weightUnitOptions}
                                    value={calculation.responseFactorUnit || ""}
                                    onChange={(value) =>
                                      onFieldChange(
                                        calculation.id,
                                        "responseFactorUnit",
                                        value,
                                      )
                                    }
                                    placeholder="Unit"
                                    colorScheme="emerald"
                                  />
                                </div>
                              </div>
                            </div>
                            <div>
                              <label className={labelCls}>Label Claim</label>
                              <div className="flex gap-2">
                                <input
                                  type="number"
                                  value={calculation.labelClaim || ""}
                                  onChange={(e) =>
                                    onFieldChange(
                                      calculation.id,
                                      "labelClaim",
                                      e.target.value,
                                    )
                                  }
                                  step="any"
                                  onKeyDown={preventArrow}
                                  onWheel={preventScroll}
                                  placeholder="Enter label claim"
                                  className={inputCls}
                                />
                                <div>
                                  <CustomDropdown
                                    options={weightUnitOptions}
                                    value={calculation.labelClaimUnit || "mg"}
                                    onChange={(value) =>
                                      onFieldChange(
                                        calculation.id,
                                        "labelClaimUnit",
                                        value,
                                      )
                                    }
                                    placeholder="Unit"
                                    colorScheme="emerald"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Oral Suspension */}
                      {calculation.calculationFor === "Oral Suspension" && (
                        <div className="bg-gradient-to-r from-emerald-50 to-emerald-50 rounded-lg p-4 border-2 border-emerald-200">
                          <h5 className="text-sm font-bold text-gray-700 mb-3">
                            Product Details
                          </h5>
                          <div className="grid md:grid-cols-2 gap-4">
                            <div>
                              <label className={labelCls}>Weight per mL</label>
                              <div className="flex gap-2">
                                <input
                                  type="number"
                                  value={calculation.weightPerMl || ""}
                                  onChange={(e) =>
                                    onFieldChange(
                                      calculation.id,
                                      "weightPerMl",
                                      e.target.value,
                                    )
                                  }
                                  step="any"
                                  onKeyDown={preventArrow}
                                  onWheel={preventScroll}
                                  placeholder="Enter value"
                                  className={inputCls}
                                />
                                <CustomDropdown
                                  options={weightUnitOptions}
                                  value={calculation.weightPerMlUnit || "mg"}
                                  onChange={(value) =>
                                    onFieldChange(
                                      calculation.id,
                                      "weightPerMlUnit",
                                      value,
                                    )
                                  }
                                  placeholder="Unit"
                                  colorScheme="emerald"
                                />
                              </div>
                            </div>
                            <div>
                              <label className={labelCls}>Dose Volume</label>
                              <div className="flex gap-2">
                                <input
                                  type="number"
                                  value={calculation.doseVolume || ""}
                                  onChange={(e) =>
                                    onFieldChange(
                                      calculation.id,
                                      "doseVolume",
                                      e.target.value,
                                    )
                                  }
                                  step="any"
                                  onKeyDown={preventArrow}
                                  onWheel={preventScroll}
                                  placeholder="Enter dose volume"
                                  className={inputCls}
                                />
                                <CustomDropdown
                                  options={volumeUnitOptions}
                                  value={calculation.doseVolumeUnit || "ml"}
                                  onChange={(value) =>
                                    onFieldChange(
                                      calculation.id,
                                      "doseVolumeUnit",
                                      value,
                                    )
                                  }
                                  placeholder="Unit"
                                  colorScheme="emerald"
                                />
                              </div>
                            </div>
                            <div>
                              <label className={labelCls}>RF</label>
                              <div className="flex gap-2">
                                <input
                                  type="number"
                                  value={calculation.responseFactor || ""}
                                  onChange={(e) =>
                                    onFieldChange(
                                      calculation.id,
                                      "responseFactor",
                                      e.target.value,
                                    )
                                  }
                                  step="any"
                                  onKeyDown={preventArrow}
                                  onWheel={preventScroll}
                                  placeholder="e.g. 1.0"
                                  className={inputCls}
                                />
                                <div>
                                  <CustomDropdown
                                    options={weightUnitOptions}
                                    value={calculation.responseFactorUnit || ""}
                                    onChange={(value) =>
                                      onFieldChange(
                                        calculation.id,
                                        "responseFactorUnit",
                                        value,
                                      )
                                    }
                                    placeholder="Unit"
                                    colorScheme="emerald"
                                  />
                                </div>
                              </div>
                            </div>
                            <div>
                              <label className={labelCls}>Label Claim</label>
                              <div className="flex gap-2">
                                <input
                                  type="number"
                                  value={calculation.labelClaim || ""}
                                  onChange={(e) =>
                                    onFieldChange(
                                      calculation.id,
                                      "labelClaim",
                                      e.target.value,
                                    )
                                  }
                                  step="any"
                                  onKeyDown={preventArrow}
                                  onWheel={preventScroll}
                                  placeholder="Enter label claim"
                                  className={inputCls}
                                />
                                <div>
                                  <CustomDropdown
                                    options={weightUnitOptions}
                                    value={calculation.labelClaimUnit || "mg"}
                                    onChange={(value) =>
                                      onFieldChange(
                                        calculation.id,
                                        "labelClaimUnit",
                                        value,
                                      )
                                    }
                                    placeholder="Unit"
                                    colorScheme="emerald"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Oral Liquid */}
                      {calculation.calculationFor === "Oral Liquid" && (
                        <div className="bg-gradient-to-r from-emerald-50 to-emerald-50 rounded-lg p-4 border-2 border-emerald-200">
                          <h5 className="text-sm font-bold text-gray-700 mb-3">
                            Product Details
                          </h5>
                          <div className="grid md:grid-cols-3 gap-4">
                            <div>
                              <label className={labelCls}>Dose Volume</label>
                              <div className="flex gap-2">
                                <input
                                  type="number"
                                  value={calculation.doseVolume || ""}
                                  onChange={(e) =>
                                    onFieldChange(
                                      calculation.id,
                                      "doseVolume",
                                      e.target.value,
                                    )
                                  }
                                  step="any"
                                  onKeyDown={preventArrow}
                                  onWheel={preventScroll}
                                  placeholder="Enter dose volume"
                                  className={inputCls}
                                />
                                <CustomDropdown
                                  options={volumeUnitOptions}
                                  value={calculation.doseVolumeUnit || "ml"}
                                  onChange={(value) =>
                                    onFieldChange(
                                      calculation.id,
                                      "doseVolumeUnit",
                                      value,
                                    )
                                  }
                                  placeholder="Unit"
                                  colorScheme="emerald"
                                />
                              </div>
                            </div>
                            <div>
                              <label className={labelCls}>RF</label>
                              <div className="flex gap-2">
                                <input
                                  type="number"
                                  value={calculation.responseFactor || ""}
                                  onChange={(e) =>
                                    onFieldChange(
                                      calculation.id,
                                      "responseFactor",
                                      e.target.value,
                                    )
                                  }
                                  step="any"
                                  onKeyDown={preventArrow}
                                  onWheel={preventScroll}
                                  placeholder="e.g. 1.0"
                                  className={inputCls}
                                />
                                <div>
                                  <CustomDropdown
                                    options={weightUnitOptions}
                                    value={calculation.responseFactorUnit || ""}
                                    onChange={(value) =>
                                      onFieldChange(
                                        calculation.id,
                                        "responseFactorUnit",
                                        value,
                                      )
                                    }
                                    placeholder="Unit"
                                    colorScheme="emerald"
                                  />
                                </div>
                              </div>
                            </div>
                            <div>
                              <label className={labelCls}>Label Claim</label>
                              <div className="flex gap-2">
                                <input
                                  type="number"
                                  value={calculation.labelClaim || ""}
                                  onChange={(e) =>
                                    onFieldChange(
                                      calculation.id,
                                      "labelClaim",
                                      e.target.value,
                                    )
                                  }
                                  step="any"
                                  onKeyDown={preventArrow}
                                  onWheel={preventScroll}
                                  placeholder="Enter label claim"
                                  className={inputCls}
                                />
                                <div>
                                  <CustomDropdown
                                    options={weightUnitOptions}
                                    value={calculation.labelClaimUnit || "mg"}
                                    onChange={(value) =>
                                      onFieldChange(
                                        calculation.id,
                                        "labelClaimUnit",
                                        value,
                                      )
                                    }
                                    placeholder="Unit"
                                    colorScheme="emerald"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Raw Material */}
                      {calculation.calculationFor === "Raw Material" && (
                        <div className="bg-gradient-to-r from-emerald-50 to-emerald-50 rounded-lg p-4 border-2 border-emerald-200">
                          <h5 className="text-sm font-bold text-gray-700 mb-3">
                            Product Details
                          </h5>
                          <div>
                            <label className={labelCls}>RF</label>
                            <div className="flex gap-2">
                              <input
                                type="number"
                                value={calculation.responseFactor || ""}
                                onChange={(e) =>
                                  onFieldChange(
                                    calculation.id,
                                    "responseFactor",
                                    e.target.value,
                                  )
                                }
                                step="any"
                                onKeyDown={preventArrow}
                                onWheel={preventScroll}
                                placeholder="e.g. 1.0"
                                className={inputCls}
                              />
                              <div>
                                <CustomDropdown
                                  options={weightUnitOptions}
                                  value={calculation.responseFactorUnit || ""}
                                  onChange={(value) =>
                                    onFieldChange(
                                      calculation.id,
                                      "responseFactorUnit",
                                      value,
                                    )
                                  }
                                  placeholder="Unit"
                                  colorScheme="emerald"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

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

                      {/* Required Unit of Result */}
                      <div className="bg-gradient-to-r from-emerald-50 to-emerald-50 rounded-lg p-4 border-2 border-emerald-200">
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                          Required Unit of Result
                        </label>
                        <CustomDropdown
                          options={[
                            { value: "%", label: "%" },
                            { value: "ppm", label: "ppm" },
                          ]}
                          value={calculation.calculationResultUnit ?? "%"}
                          onChange={(value) =>
                            onFieldChange(
                              calculation.id,
                              "calculationResultUnit",
                              value,
                            )
                          }
                          placeholder="Select unit..."
                          colorScheme="emerald"
                        />
                      </div>

                      {/* Calculate Button */}
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

              {/* Result section */}
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
                        : "bg-gradient-to-br from-emerald-50 via-green-100/30 to-emerald-50"
                    }`}
                  >
                    <div className="max-w-4xl mx-auto space-y-4">
                      <div className="flex items-center gap-3 pb-3">
                        <CheckCircle2 className="w-6 h-6 text-green-700" />
                        <div>
                          <h6 className="text-lg font-bold text-green-700">
                            Calculation Results
                          </h6>
                        </div>
                      </div>

                      <div className="bg-white rounded-lg shadow-lg border-2 border-emerald-300 overflow-hidden">
                        <div className="bg-gradient-to-r from-emerald-600 to-emerald-600 px-4 py-2">
                          <h6 className="text-sm font-bold text-white">
                            Primary Result
                          </h6>
                        </div>
                        <div className="flex items-center p-4">
                          <p className="text-2xl font-bold text-gray-800">
                            {calculation.calculationResult}{" "}
                            {!calculation.calculationResult.startsWith("Error")
                              ? calculation.calculationResultUnit
                              : ""}
                          </p>
                          {(() => {
                            const limitMin =
                              calculation.acceptanceLimitMin != null &&
                              calculation.acceptanceLimitMin !== ""
                                ? parseFloat(calculation.acceptanceLimitMin as string)
                                : null;
                            const limitMax =
                              calculation.acceptanceLimitMax != null &&
                              calculation.acceptanceLimitMax !== ""
                                ? parseFloat(calculation.acceptanceLimitMax as string)
                                : null;
                            const hasMin = limitMin !== null && !isNaN(limitMin);
                            const hasMax = limitMax !== null && !isNaN(limitMax);
                            if (!hasMin && !hasMax) return null;

                            const val =
                              typeof calculation.calculationResult === "string"
                                ? parseFloat(calculation.calculationResult)
                                : null;
                            const pass = val !== null &&
                              (hasMin ? val >= limitMin! : true) &&
                              (hasMax ? val <= limitMax! : true);

                            return (
                              <span
                                className={`m-2 inline-block px-3 py-1 rounded-full text-sm font-bold ${pass ? "bg-green-100 text-green-800 border border-green-300" : "bg-red-100 text-red-800 border border-red-300"}`}
                              >
                                {pass ? "Pass" : "Fail"}
                              </span>
                            );
                          })()}
                        </div>
                      </div>

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
                              {calculation.selectedStandardPreparationLabel ||
                                "N/A"}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-600 font-medium">
                              Sample Prep
                            </p>
                            <p className="text-gray-900 font-semibold">
                              {calculation.selectedSamplePreparationLabel ||
                                "N/A"}
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

export default CalculationDetailRelatedSubstance;