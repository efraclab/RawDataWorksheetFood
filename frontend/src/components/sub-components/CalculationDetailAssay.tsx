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
  CalculationAssay,
  CalculationType,
} from "../../preparation_models/CalculationAssay";
import type { StandardPreparation } from "../../preparation_models/StandardPreparation";
import type { SamplePreparation } from "../../preparation_models/SamplePreparation";
import CustomDropdown from "../shared/CustomDropdown";

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

  useEffect(() => {
    if (
      calculation.selectedStandardPreparationLabel &&
      calculation.selectedSamplePreparationLabel
    ) {
      preparationPairs.find(
        (pair) =>
          pair?.standardLabel ===
            calculation.selectedStandardPreparationLabel &&
          pair?.sampleLabel === calculation.selectedSamplePreparationLabel,
      );
    }
  }, [
    calculation.selectedStandardPreparationLabel,
    calculation.selectedSamplePreparationLabel,
    preparationPairs,
  ]);

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

    const checkDilutionPair = (
      vol1: any,
      vol2: any,
      stepName: string,
      prepType: string,
    ) => {
      const hasVol1 = isValueValid(vol1);
      const hasVol2 = isValueValid(vol2);

      if (stepName === "1st Dilution") {
        return;
      }

      if (hasVol1 && !hasVol2) {
        errors.push(
          `${prepType} - ${stepName}: Volume 2 is required when Volume 1 is provided`,
        );
      } else if (!hasVol1 && hasVol2) {
        errors.push(
          `${prepType} - ${stepName}: Volume 1 is required when Volume 2 is provided`,
        );
      }
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
          "Standard Preparation - Weighing: Weight value is required",
        );
      }
      if (!stdWeighing.logBookID || stdWeighing.logBookID.trim() === "") {
        errors.push("Standard Preparation - Weighing: Logbook ID is required");
      }
    }

    const stdFiltration = stdSteps.find((s) => s.name === "Filtration");
    if (!stdFiltration) {
      errors.push("Standard Preparation: Filtration step is missing");
    } else {
      if (!isValueValid(stdFiltration.value1)) {
        errors.push(
          "Standard Preparation - Filtration: Filter size is required",
        );
      }
    }

    standardDilutions.forEach((dilution) => {
      checkDilutionPair(
        dilution.vol1,
        dilution.vol2,
        dilution.name,
        "Standard Preparation",
      );
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
      if (
        !smpWeighing.solventChemical ||
        smpWeighing.solventChemical.trim() === ""
      ) {
        errors.push(
          "Sample Preparation - Weighing: solventChemical is required",
        );
      }
      if (!smpWeighing.logBookID || smpWeighing.logBookID.trim() === "") {
        errors.push("Sample Preparation - Weighing: Logbook ID is required");
      }
    }

    const smpFiltration = smpSteps.find((s) => s.name === "Filtration");
    if (!smpFiltration) {
      errors.push("Sample Preparation: Filtration step is missing");
    } else {
      if (!isValueValid(smpFiltration.value1)) {
        errors.push("Sample Preparation - Filtration: Filter size is required");
      }
    }

    sampleDilutions.forEach((dilution) => {
      checkDilutionPair(
        dilution.vol1,
        dilution.vol2,
        dilution.name,
        "Sample Preparation",
      );
    });

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

  // UPDATED: Formula display component - now dynamically updates
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
      : 0;
    const smpWeightMg = smpWeighing?.value1
      ? convertMassToMg(smpWeighing.value1, smpWeighing.unit1 || "mg")
      : 0;

    const areaStd = calculation.areaOfStandard || "1";
    const areaSmp = calculation.areaOfSample || "1";
    const purity = calculation.purity || "100";
    const mwBase = calculation.mWBase || "1";
    const mwSalt = calculation.mWSalt || "1";

    // Build volume labels and values - FIXED MAPPING
    const stdVolsNumSymbolic: string[] = [];
    const stdVolsDenomSymbolic: string[] = [];
    const stdVolsNumValues: string[] = [];
    const stdVolsDenomValues: string[] = [];

    standardDilutions.forEach((dil, idx) => {
      // For 1st dilution: only V2 (to volume) goes to numerator
      if (idx === 0) {
        if (dil.vol1) {
          stdVolsDenomSymbolic.push("V1");
          stdVolsDenomValues.push(
            convertVolumeToMl(dil.vol1, dil.unit1).toString(),
          );
        }
      } else {
        // For 2nd, 3rd, 4th dilution: vol1 to denominator, vol2 to numerator
        if (dil.vol1) {
          const vNum = idx === 1 ? "V2" : idx === 2 ? "V4" : "V6";
          stdVolsNumSymbolic.push(vNum);
          stdVolsNumValues.push(
            convertVolumeToMl(dil.vol1, dil.unit1).toString(),
          );
        }
        if (dil.vol2) {
          const vNum = idx === 1 ? "V3" : idx === 2 ? "V5" : "V7";
          stdVolsDenomSymbolic.push(vNum);
          stdVolsDenomValues.push(
            convertVolumeToMl(dil.vol2, dil.unit2).toString(),
          );
        }
      }
    });

    const smpVolsNumSymbolic: string[] = [];
    const smpVolsDenomSymbolic: string[] = [];
    const smpVolsNumValues: string[] = [];
    const smpVolsDenomValues: string[] = [];

    sampleDilutions.forEach((dil, idx) => {
      // For 1st dilution: only V10 (to volume) goes to numerator
      if (idx === 0) {
        if (dil.vol1) {
          smpVolsNumSymbolic.push("V8");
          smpVolsNumValues.push(
            convertVolumeToMl(dil.vol1, dil.unit1).toString(),
          );
        }
      } else {
        // For 2nd, 3rd, 4th dilution: vol1 to denominator, vol2 to numerator
        if (dil.vol1) {
          const vNum = idx === 1 ? "V9" : idx === 2 ? "V11" : "V13";
          smpVolsDenomSymbolic.push(vNum);
          smpVolsDenomValues.push(
            convertVolumeToMl(dil.vol1, dil.unit1).toString(),
          );
        }
        if (dil.vol2) {
          const vNum = idx === 1 ? "V10" : idx === 2 ? "V12" : "V14";
          smpVolsNumSymbolic.push(vNum);
          smpVolsNumValues.push(
            convertVolumeToMl(dil.vol2, dil.unit2).toString(),
          );
        }
      }
    });

    // Build formula parts based on calculation type
    let numeratorSymbolic: string[] = [];
    let denominatorSymbolic: string[] = [];
    let numeratorValues: string[] = [];
    let denominatorValues: string[] = [];

    if (calculation.calculationFor === "Oral Liquid") {
      // Special case for Oral Liquid
      numeratorSymbolic = [
        "Area/ABS of Sample",
        "X SW1",
        ...stdVolsNumSymbolic.map((v) => `X ${v}`),
        ...smpVolsNumSymbolic.map((v) => `X ${v}`),
        "X MW Base",
        "X Purity %",
        "X Claim Vol",
      ];

      denominatorSymbolic = [
        "Area/ABS of Standard",
        ...stdVolsDenomSymbolic.map((v) => `X ${v}`),
        "X SW2",
        ...smpVolsDenomSymbolic.map((v) => `X ${v}`),
        "X MW salt",
        "X 100",
      ];

      numeratorValues = [
        areaSmp,
        stdWeightMg.toString(),
        ...stdVolsNumValues,
        ...smpVolsNumValues,
        mwBase,
        purity,
        calculation.claim || "1",
      ];

      denominatorValues = [
        areaStd,
        smpWeightMg.toString(),
        ...stdVolsDenomValues,
        ...smpVolsDenomValues,
        mwSalt,
        "100",
      ];
    } else {
      // Standard formula for other types
      numeratorSymbolic = [
        "Area/ABS of Sample",
        "X SW1",
        ...stdVolsNumSymbolic.map((v) => `X ${v}`),
        ...smpVolsNumSymbolic.map((v) => `X ${v}`),
        "X MW Base",
        "X Purity %",
      ];

      denominatorSymbolic = [
        "Area/ABS of Standard",
        ...stdVolsDenomSymbolic.map((v) => `X ${v}`),
        "X SW2",
        ...smpVolsDenomSymbolic.map((v) => `X ${v}`),
        "X MW salt",
        "X 100",
      ];

      numeratorValues = [
        areaSmp,
        stdWeightMg.toString(),
        ...stdVolsNumValues,
        ...smpVolsNumValues,
        mwBase,
        purity,
      ];

      denominatorValues = [
        areaStd,
        ...stdVolsDenomValues,
        smpWeightMg.toString(),
        ...smpVolsDenomValues,
        mwSalt,
        "100",
      ];

      // Add type-specific terms
      if (
        calculation.calculationFor === "Tablets" ||
        calculation.calculationFor === "Capsule" ||
        calculation.calculationFor === "Injection Vial"
      ) {
        numeratorSymbolic.push("X Avg Wt");
        numeratorValues.push(calculation.avgWeight || "");
      } else if (calculation.calculationFor === "Oral Suspension") {
        numeratorSymbolic.push("X Wt / ml", "X Claim Vol");
        numeratorValues.push(
          convertMassToMg(
            calculation.weightPerMl,
            calculation.weightPerMlUnit,
          ).toString() || "1",
          calculation.claim || "1",
        );
      } else if (calculation.calculationFor === "Raw Material") {
        numeratorSymbolic.push("X 100");
        numeratorValues.push("100");
        // Remove the last "X 100" from denominator for Raw Material
        const lastIdx = denominatorSymbolic.lastIndexOf("X 100");
        if (lastIdx > -1) {
          denominatorSymbolic.splice(lastIdx, 1);
          denominatorValues.splice(lastIdx, 1);
        }
      }
    }

    const resultUnit =
      calculation.calculationFor === "Tablets"
        ? "mg / Tablet"
        : calculation.calculationFor === "Capsule"
          ? "mg / Capsule"
          : calculation.calculationFor === "Injection Vial"
            ? "mg / Vial"
            : calculation.calculationFor === "Oral Suspension"
              ? "mg / ml"
              : calculation.calculationFor === "Oral Liquid"
                ? "mg / ml"
                : calculation.calculationFor === "Raw Material"
                  ? "%"
                  : "";

    return (
      <div className="bg-white rounded-lg p-4 border-2 border-emerald-200 shadow-sm mt-4">
        <h4 className="text-sm font-bold text-gray-900 mb-3">
          Formula for {calculation.calculationFor}
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
          = {resultUnit}
        </p>
      </div>
    );
  };

  const canCalculate =
    selectedStandardPrep && selectedSamplePrep && calculation.calculationFor;

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

    console.group("🧪 Calculation Debugger Started");

    if (!canCalculate) {
      onFieldChange(
        calculation.id,
        "calculationResult",
        "Error: Please select both Standard and Sample preparations and a calculation type.",
      );
      onFieldChange(calculation.id, "labelClaimPercent", null);
      onFieldChange(calculation.id, "lodWaterBasisResult", null);
      console.groupEnd();
      return;
    }

    const stdVols = getStandardVolumes();
    const splVols = getSampleVolumes();

    const AreaOfSample = parseFloat(calculation.areaOfSample as string) || 1;
    const AreaOfStandard =
      parseFloat(calculation.areaOfStandard as string) || 1;
    const SW1_Standard = convertMassToMg(
      standardWeight.value,
      standardWeight.unit,
    );
    const SW2_Sample = convertMassToMg(sampleWeight.value, sampleWeight.unit);

    const MWBase = parseFloat(calculation.mWBase as string) || 1;
    const MWSalt = parseFloat(calculation.mWSalt as string) || 1;
    const Purity = parseFloat(calculation.purity as string) || 1;

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
    console.log(
      "2. Volume Inputs Detected (All volumes converted to ML):",
      allVols,
    );
    console.log(`   SW1 (Std Wt) converted to mg: ${SW1_Standard}`);
    console.log(`   SW2 (Spl Wt) converted to mg: ${SW2_Sample}`);

    let productEvens = 1;
    let productOdds = 1;
    let volumeLog = [];

    for (let i = 1; i <= 16; i++) {
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
      `   V_factor Result: ${V_factor} (Evens: ${productEvens} / Odds: ${productOdds})`,
    );

    const AreaRatio = AreaOfStandard !== 0 ? AreaOfSample / AreaOfStandard : 0;
    const MWRatio = MWSalt !== 0 ? MWBase / MWSalt : 1;
    const PurityFactor = Purity / 100;

    console.log("4. Intermediate Ratios:", {
      "Area Ratio (Spl/Std)": `${AreaOfSample} / ${AreaOfStandard} = ${AreaRatio}`,
      "MW Ratio (Base/Salt)": `${MWBase} / ${MWSalt} = ${MWRatio}`,
      "Purity Factor": `${Purity} / 100 = ${PurityFactor}`,
    });

    let FinalResult = 0;
    let unit = "";
    let formulaDebugString = "";

    const commonPart = AreaRatio * V_factor * MWRatio * PurityFactor;

    switch (calculation.calculationFor) {
      case "Tablets":
      case "Capsule":
      case "Injection Vial": {
        const AvgWt = convertMassToMg(
          calculation.avgWeight,
          calculation.avgWeightUnit || "mg",
        );

        if (SW2_Sample !== 0) {
          FinalResult = (commonPart * SW1_Standard * AvgWt) / SW2_Sample;
        }

        formulaDebugString = `(${AreaRatio.toFixedNoRound(
          4,
        )} * ${V_factor.toFixedNoRound(4)} * ${MWRatio.toFixedNoRound(
          4,
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
        const WtPerML = convertMassToMg(
          calculation.weightPerMl,
          calculation.weightPerMlUnit || "mg",
        );

        if (SW2_Sample !== 0) {
          FinalResult =
            (commonPart * SW1_Standard * WtPerML * claim) / SW2_Sample;
        }

        formulaDebugString = `(${AreaRatio.toFixedNoRound(
          4,
        )} * ${V_factor.toFixedNoRound(4)} * ${MWRatio.toFixedNoRound(
          4,
        )} * ${PurityFactor} * ${SW1_Standard} * ${WtPerML} * ${claim}) / ${SW2_Sample}`;
        unit = `mg/${claim}ml`;
        break;
      }

      case "Oral Liquid": {
        const claim = parseFloat(calculation.claim as string) || 1;

        if (SW2_Sample !== 0) {
          FinalResult = (commonPart * SW1_Standard * claim) / SW2_Sample;
        }

        formulaDebugString = `(${AreaRatio.toFixedNoRound(
          4,
        )} * ${V_factor.toFixedNoRound(4)} * ${MWRatio.toFixedNoRound(
          4,
        )} * ${PurityFactor} * ${SW1_Standard} * ${claim}) / ${SW2_Sample}`;
        unit = `mg/${claim != 1 ? claim : ""}ml`;
        break;
      }

      case "Raw Material": {
        if (SW2_Sample !== 0) {
          FinalResult = ((commonPart * SW1_Standard) / SW2_Sample) * 100;
        }

        formulaDebugString = `((${AreaRatio.toFixedNoRound(
          4,
        )} * ${V_factor.toFixedNoRound(4)} * ${MWRatio.toFixedNoRound(
          4,
        )} * ${PurityFactor} * ${SW1_Standard}) / ${SW2_Sample}) * 100`;
        unit = "%";
        break;
      }

      default:
        FinalResult = 0;
        unit = "";
    }

    console.log("5. Final Calculation Formula:", formulaDebugString);
    console.log(`6. Final Result: ${FinalResult.toString()} ${unit}`);

    FinalResult = FinalResult.toFixedNoRound(4);

    onFieldChange(
      calculation.id,
      "calculationResult",
      FinalResult.toFixed(3).toString(),
    );
    onFieldChange(calculation.id, "calculationResultUnit", unit);

    if (
      calculation.calculationFor !== "Raw Material" &&
      calculation.labelClaim
    ) {
      const labelClaim = parseFloat(String(calculation.labelClaim));
      if (labelClaim && labelClaim > 0) {
        const labelClaimPercentage = (FinalResult / labelClaim) * 100;
        onFieldChange(
          calculation.id,
          "labelClaimPercent",
          `${labelClaimPercentage.toFixedNoRound(3).toFixed(2)}`,
        );
        console.log(
          `7. Label Claim %: (${FinalResult} / ${labelClaim}) * 100 = ${labelClaimPercentage} %`,
        );
      }
    } else {
      onFieldChange(calculation.id, "labelClaimPercent", null);
    }

    if (
      calculation.lodWaterValue &&
      parseFloat(calculation.lodWaterValue) > 0
    ) {
      const lodWaterBasisValue = parseFloat(calculation.lodWaterValue);
      const adjustedResult = (
        (FinalResult * 100) /
        (100 - lodWaterBasisValue)
      ).toString();
      onFieldChange(
        calculation.id,
        "lodWaterBasisResult",
        `${adjustedResult} ${unit.replace(
          "%",
          "mg",
        )} (Adjusted for ${lodWaterBasisValue}% LOD/Water)`,
      );
      console.log(
        `8. LOD/Water Basis: (${FinalResult} * 100) / (100 - ${lodWaterBasisValue}) = ${adjustedResult}`,
      );
    } else {
      onFieldChange(calculation.id, "lodWaterBasisResult", null);
    }

    console.groupEnd();
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
              <p className="text-xs text-emerald-100">Assay Calculation</p>
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

                {selectedStandardPrep && selectedSamplePrep && (
                  <div className="bg-gradient-to-r from-emerald-50 to-emerald-50 rounded-lg p-4 border-2 border-emerald-200">
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Calculation For
                    </label>
                    <CustomDropdown
                      options={calculationFor.map((type) => ({
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

                {selectedStandardPrep &&
                  selectedSamplePrep &&
                  calculation.calculationFor && <FormulaDisplay />}

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
                                e.target.value,
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
                                e.target.value,
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
                      <div className="grid md:grid-cols-3 gap-4">
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
                                e.target.value,
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
                        <div>
                          <label className="block text-xs font-semibold text-gray-600 mb-1">
                            MW Base
                          </label>
                          <input
                            type="number"
                            value={calculation.mWBase}
                            onChange={(e) =>
                              onFieldChange(
                                calculation.id,
                                "mWBase",
                                e.target.value,
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
                            placeholder="MW Base"
                            className="w-full px-3 py-2 bg-white border border-emerald-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-emerald-50"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-600 mb-1">
                            MW Salt
                          </label>
                          <input
                            type="number"
                            value={calculation.mWSalt}
                            onChange={(e) =>
                              onFieldChange(
                                calculation.id,
                                "mWSalt",
                                e.target.value,
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
                            placeholder="MW Salt"
                            className="w-full px-3 py-2 bg-white border border-emerald-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-emerald-50"
                          />
                        </div>
                      </div>
                    </div>

                    {(calculation.calculationFor === "Tablets" ||
                      calculation.calculationFor === "Capsule" ||
                      calculation.calculationFor === "Injection Vial") && (
                      <div className="bg-gradient-to-r from-emerald-50 to-emerald-50 rounded-lg p-4 border-2 border-emerald-200">
                        <h5 className="text-sm font-bold text-gray-700 mb-3">
                          Product Details
                        </h5>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1">
                              Average Weight
                            </label>
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
                              onKeyDown={(e) => {
                                if (
                                  e.key === "ArrowUp" ||
                                  e.key === "ArrowDown"
                                ) {
                                  e.preventDefault();
                                }
                              }}
                              onWheel={(e) => e.currentTarget.blur()}
                              placeholder="Enter average weight"
                              className="w-full px-3 py-2 bg-white border border-emerald-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-emerald-50"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1">
                              Unit
                            </label>
                            <CustomDropdown
                              options={[
                                { value: "mg", label: "mg" },
                                { value: "g", label: "g" },
                                { value: "kg", label: "kg" },
                                { value: "mcg", label: "mcg" },
                              ]}
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
                      </div>
                    )}

                    {calculation.calculationFor === "Oral Suspension" && (
                      <div className="bg-gradient-to-r from-emerald-50 to-emerald-50 rounded-lg p-4 border-2 border-emerald-200">
                        <h5 className="text-sm font-bold text-gray-700 mb-3">
                          Product Details
                        </h5>
                        <div className="grid md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1">
                              Weight per mL
                            </label>
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
                              onKeyDown={(e) => {
                                if (
                                  e.key === "ArrowUp" ||
                                  e.key === "ArrowDown"
                                ) {
                                  e.preventDefault();
                                }
                              }}
                              onWheel={(e) => e.currentTarget.blur()}
                              placeholder="Enter value"
                              className="w-full px-3 py-2 bg-white border border-emerald-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-emerald-50"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1">
                              Unit
                            </label>
                            <CustomDropdown
                              options={[
                                { value: "mg", label: "mg" },
                                { value: "g", label: "g" },
                                { value: "kg", label: "kg" },
                                { value: "mcg", label: "mcg" },
                              ]}
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
                          <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1">
                              Claim Volume (mL)
                            </label>
                            <input
                              type="number"
                              value={calculation.claim || ""}
                              onChange={(e) =>
                                onFieldChange(
                                  calculation.id,
                                  "claim",
                                  e.target.value,
                                )
                              }
                              min={1}
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
                              placeholder="Enter claim"
                              className="w-full px-3 py-2 bg-white border border-emerald-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-emerald-50"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {calculation.calculationFor === "Oral Liquid" && (
                      <div className="bg-gradient-to-r from-emerald-50 to-emerald-50 rounded-lg p-4 border-2 border-emerald-200">
                        <h5 className="text-sm font-bold text-gray-700 mb-3">
                          Product Details
                        </h5>
                        <div className="grid md:grid-cols-1 gap-4">
                          <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1">
                              Claim Volume (mL)
                            </label>
                            <input
                              type="number"
                              value={calculation.claim || ""}
                              onChange={(e) =>
                                onFieldChange(
                                  calculation.id,
                                  "claim",
                                  e.target.value,
                                )
                              }
                              min={1}
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
                              placeholder="Enter claim"
                              className="w-full px-3 py-2 bg-white border border-emerald-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-emerald-50"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {calculation.calculationFor === "Raw Material" && (
                      <div className="bg-gradient-to-r from-emerald-50 to-emerald-50 rounded-lg p-4 border-2 border-emerald-200">
                        <h5 className="text-sm font-bold text-gray-700 mb-3">
                          Basis Adjustment
                        </h5>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-semibold text-emerald-900 mb-1">
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
                                  value,
                                )
                              }
                              placeholder="Select Type"
                              colorScheme="emerald"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-emerald-900 mb-1">
                              {calculation.lodWaterType === "lod"
                                ? "LOD"
                                : "Water"}{" "}
                              Value (%)
                            </label>
                            <input
                              type="number"
                              value={calculation.lodWaterValue || ""}
                              onChange={(e) =>
                                onFieldChange(
                                  calculation.id,
                                  "lodWaterValue",
                                  e.target.value,
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
                              placeholder={`Enter ${
                                calculation.lodWaterType === "lod"
                                  ? "LOD"
                                  : "Water"
                              } %`}
                              className="w-full px-3 py-2 bg-white border border-emerald-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-emerald-400"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {calculation.calculationFor !== "Raw Material" && (
                      <div className="bg-gradient-to-r from-emerald-50 to-emerald-50 rounded-lg p-4 border-2 border-emerald-200">
                        <h5 className="text-sm font-bold text-gray-700 mb-3">
                          Label Claim
                        </h5>
                        <div>
                          <label className="block text-xs font-semibold text-gray-600 mb-1">
                            Label Claim (mg)
                          </label>
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
                            onKeyDown={(e) => {
                              if (
                                e.key === "ArrowUp" ||
                                e.key === "ArrowDown"
                              ) {
                                e.preventDefault();
                              }
                            }}
                            onWheel={(e) => e.currentTarget.blur()}
                            placeholder="Label Claim"
                            className="w-full px-3 py-2 bg-white border border-emerald-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-emerald-400"
                          />
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
                            if (e.key === "ArrowUp" || e.key === "ArrowDown")
                              e.preventDefault();
                          }}
                          onWheel={(e) => e.currentTarget.blur()}
                          placeholder="Enter min limit"
                          className="w-full px-3 py-2 bg-white border border-emerald-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-emerald-400"
                        />
                        <span className="text-xs font-semibold text-gray-500 shrink-0">
                          to
                        </span>
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
                            if (e.key === "ArrowUp" || e.key === "ArrowDown")
                              e.preventDefault();
                          }}
                          onWheel={(e) => e.currentTarget.blur()}
                          placeholder="Enter max limit"
                          className="w-full px-3 py-2 bg-white border border-emerald-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-emerald-400"
                        />
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
                        : "bg-gradient-to-br from-emerald-50 via-green-100/30 to-emerald-50"
                    }`}
                  >
                    <div className="max-w-4xl mx-auto space-y-4">
                      <div className="flex items-center gap-3 pb-3">
                        <CheckCircle2
                          className={`w-6 h-6 ${
                            calculation.calculationResult.startsWith("Error")
                              ? "text-green-700"
                              : "text-green-700"
                          }`}
                        />
                        <div>
                          <h6
                            className={`text-lg font-bold ${
                              calculation.calculationResult.startsWith("Error")
                                ? "text-green-700"
                                : "text-green-700"
                            }`}
                          >
                            Calculation Results
                          </h6>
                        </div>
                      </div>

                      <div className="grid gap-4">
                        <div
                          className={`grid gap-4 ${
                            calculation.labelClaimPercent ||
                            calculation.lodWaterBasisResult
                              ? "md:grid-cols-2"
                              : "md:grid-cols-1"
                          }`}
                        >
                          <div className="bg-white rounded-lg shadow-lg border-2 border-emerald-300 overflow-hidden">
                            <div className="bg-gradient-to-r from-emerald-600 to-emerald-600 px-4 py-2">
                              <h6 className="text-sm font-bold text-white">
                                Primary Result
                              </h6>
                            </div>
                            <div className="flex items-center p-4">
                              <p className="text-2xl font-bold text-gray-800">
                                {calculation.calculationResult}{" "}
                                {!calculation.calculationResult.startsWith(
                                  "Error",
                                )
                                  ? calculation.calculationResultUnit
                                  : ""}
                              </p>
                              {(() => {
                                const limitMin =
                                  calculation.acceptanceLimitMin != null &&
                                  calculation.acceptanceLimitMin !== ""
                                    ? parseFloat(
                                        calculation.acceptanceLimitMin as string,
                                      )
                                    : null;
                                const limitMax =
                                  calculation.acceptanceLimitMax != null &&
                                  calculation.acceptanceLimitMax !== ""
                                    ? parseFloat(
                                        calculation.acceptanceLimitMax as string,
                                      )
                                    : null;
                                const hasMin =
                                  limitMin !== null && !isNaN(limitMin);
                                const hasMax =
                                  limitMax !== null && !isNaN(limitMax);
                                if (!hasMin && !hasMax) return null;
                                const val =
                                  typeof calculation.calculationResult ===
                                  "string"
                                    ? parseFloat(calculation.calculationResult)
                                    : null;
                                const pass =
                                  val !== null &&
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

                          {calculation.labelClaimPercent && (
                            <div className="bg-white rounded-lg shadow-lg border-2 border-emerald-300 overflow-hidden">
                              <div className="bg-gradient-to-r from-emerald-600 to-emerald-600 px-4 py-2">
                                <h6 className="text-sm font-bold text-white">
                                  Label Claim Percentage
                                </h6>
                              </div>
                              <div className="p-4">
                                <p className="text-xl font-bold text-green-700">
                                  {calculation.labelClaimPercent}
                                </p>
                              </div>
                            </div>
                          )}

                          {!calculation.labelClaimPercent &&
                            calculation.lodWaterBasisResult && (
                              <div className="bg-white rounded-lg shadow-lg border-2 border-emerald-300 overflow-hidden">
                                <div className="bg-gradient-to-r from-emerald-600 to-emerald-600 px-4 py-2">
                                  <h6 className="text-sm font-bold text-white">
                                    Adjusted Basis
                                  </h6>
                                </div>
                                <div className="p-4">
                                  <p className="text-xl font-bold text-green-700">
                                    {calculation.lodWaterBasisResult} %
                                  </p>
                                  <p className="text-sm font-bold text-green-700">
                                    {calculation.lodWaterType === "lod"
                                      ? "Anhydrous basis"
                                      : "Water basis"}{" "}
                                    adjusted for {calculation.lodWaterValue} %
                                    of {calculation.lodWaterType}
                                  </p>
                                </div>
                              </div>
                            )}
                        </div>

                        {/* {calculation.labelClaimPercent &&
                          calculation.lodWaterBasisResult && (
                            <div className="bg-white rounded-lg shadow-lg border-2 border-emerald-300 overflow-hidden">
                              <div className="bg-gradient-to-r from-emerald-600 to-emerald-600 px-4 py-2">
                                <h6 className="text-sm font-bold text-white">
                                  Adjusted Basis
                                </h6>
                              </div>
                              <div className="p-4">
                                <p className="text-xl font-bold text-green-700">
                                  {calculation.lodWaterBasisResult}
                                </p>
                              </div>
                            </div>
                          )} */}
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

export default CalculationDetailAssay;
