import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  Calculator,
  Trash,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import type { CalculationDisso } from "../../../preparation_models/drugs/CalculationDisso";
import type { StandardPreparation } from "../../../preparation_models/drugs/StandardPreparation";
import type { SamplePreparationDisso } from "../../../preparation_models/drugs/SamplePreparationDisso";
import CustomDropdown from "../../shared/CustomDropdown";


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

interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

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
  const [validationResult, setValidationResult] = useState<ValidationResult>({
    isValid: false,
    errors: [],
    warnings: [],
  });
  const [tabletResults, setTabletResults] = useState<TabletResult[]>([]);
  const [summaryResults, setSummaryResults] = useState<SummaryResults | null>(
    null
  );

  const selectedStandardPrep = standardPreparations.find(
    (prep) => prep.label === calculation.selectedStandardPreparationLabel
  );

  const selectedSamplePrepDisso = samplePreparationsDisso.find(
    (prep) => prep.label === calculation.selectedSamplePreparationLabel
  );

  // Create preparation pair options
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

  const currentPrepLabel =
    calculation.selectedStandardPreparationLabel && calculation.selectedSamplePreparationLabel
      ? `${calculation.selectedStandardPreparationLabel}-${calculation.selectedSamplePreparationLabel}`
      : "";

  useEffect(() => {
    if (
      calculation.selectedStandardPreparationLabel &&
      calculation.selectedSamplePreparationLabel
    ) {
      preparationPairs.find(
        (pair) =>
          pair?.standardLabel === calculation.selectedStandardPreparationLabel &&
          pair?.sampleLabel === calculation.selectedSamplePreparationLabel
      );
    }
  }, [
    calculation.selectedStandardPreparationLabel,
    calculation.selectedSamplePreparationLabel,
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
    if (value !== null && value !== undefined && String(value).trim() !== "") {
      const numericValue = Number(value);

      existingResults.push({
        tabletNumber: num,
        result: isNaN(numericValue) ? String(value) : numericValue,
        unit: calculation.calculationResultUnit || "% of LC",
      });
    }
  });

    if (existingResults.length > 0) {
      setTabletResults(existingResults);

      const validResults = existingResults
        .filter((r) => typeof r.result === "number")
        .map((r) => r.result as number);

      if (validResults.length > 0) {
        const min = Math.min(...validResults);
        const max = Math.max(...validResults);
        const sum = validResults.reduce((acc, val) => acc + val, 0);
        const avg = sum / validResults.length;

        // Truncate to 4 decimals, then round to 3 for display
        const minTruncated = min.toFixedNoRound(4);
        const maxTruncated = max.toFixedNoRound(4);
        const avgTruncated = avg.toFixedNoRound(4);

        setSummaryResults({
          min: parseFloat(minTruncated.toFixed(3)),
          max: parseFloat(maxTruncated.toFixed(3)),
          avg: parseFloat(avgTruncated.toFixed(3)),
          unit: calculation.calculationResultUnit || "% of LC",
        });
      }
    }
  }, [calculation.id]);

  const handlePreparationChange = (value: string) => {
    const selectedPair = preparationPairs.find((pair) => pair.value === value);

    if (selectedPair) {
      onFieldChange(
        calculation.id,
        "selectedStandardPreparationLabel",
        selectedPair.standardLabel
      );
      onFieldChange(
        calculation.id,
        "selectedSamplePreparationLabel",
        selectedPair.sampleLabel
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
    if (!selectedSamplePrepDisso) return [];
    const stepsArr = Array.isArray(selectedSamplePrepDisso.steps)
      ? selectedSamplePrepDisso.steps
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

  const getTabletDetails = () => {
    if (!selectedSamplePrepDisso)
      return { claim: "", claimUnit: "mg", mediaVol: "", unit: "ml" };
    const stepsArr = Array.isArray(selectedSamplePrepDisso.steps)
      ? selectedSamplePrepDisso.steps
      : [];
    const tabletStep = stepsArr.find((step) => step.name === "Tablet Details");
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

  const validatePreparations = (): ValidationResult => {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!selectedStandardPrep || !selectedSamplePrepDisso) {
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
      prepType: string
    ) => {
      const hasVol1 = isValueValid(vol1);
      const hasVol2 = isValueValid(vol2);

      if (stepName === "1st Dilution") {
        return;
      }

      if (hasVol1 && !hasVol2) {
        errors.push(
          `${prepType} - ${stepName}: Volume 2 is required when Volume 1 is provided`
        );
      } else if (!hasVol1 && hasVol2) {
        errors.push(
          `${prepType} - ${stepName}: Volume 1 is required when Volume 2 is provided`
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
          "Standard Preparation - Weighing: Weight value is required"
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
          "Standard Preparation - Filtration: Filter size is required"
        );
      }
    }

    standardDilutions.forEach((dilution) => {
      checkDilutionPair(
        dilution.vol1,
        dilution.vol2,
        dilution.name,
        "Standard Preparation"
      );
    });

    const smpSteps = Array.isArray(selectedSamplePrepDisso.steps)
      ? selectedSamplePrepDisso.steps
      : [];

    const smpInstrumentDetails = smpSteps.find(
      (s) => s.name === "Instrument Details"
    );
    if (!smpInstrumentDetails) {
      errors.push("Sample Preparation: Instrument Details step is missing");
    } else {
      if (!smpInstrumentDetails.id || smpInstrumentDetails.id.trim() === "") {
        errors.push("Sample Preparation - Instrument Details: Id is required");
      }
      if (!isValueValid(smpInstrumentDetails.value1)) {
        errors.push("Sample Preparation - Instrument Details: RPM is required");
      }
    }

    const smpTabletDetails = smpSteps.find((s) => s.name === "Tablet Details");
    if (!smpTabletDetails) {
      errors.push("Sample Preparation: Tablet Details step is missing");
    } else {
      if (!isValueValid(smpTabletDetails.value1)) {
        errors.push(
          "Sample Preparation - Tablet Details: Claim value is required"
        );
      }
      if (!isValueValid(smpTabletDetails.value2)) {
        errors.push(
          "Sample Preparation - Tablet Details: Media Volume is required"
        );
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
        "Sample Preparation"
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
  }, [selectedStandardPrep, selectedSamplePrepDisso]);

  // Formula Display Component
  const FormulaDisplay: React.FC = () => {
    if (!selectedStandardPrep || !selectedSamplePrepDisso) return null;

    const stdSteps = Array.isArray(selectedStandardPrep.steps)
      ? selectedStandardPrep.steps
      : [];

    const stdWeighing = stdSteps.find((s) => s.name === "Weighing");
    const stdWeightMg = stdWeighing?.value1
      ? convertMassToMg(stdWeighing.value1, stdWeighing.unit1 || "mg")
      : 0;

    const areaStd = calculation.areaOfStandard || "0";
    const purity = calculation.purity || "100";
    const mwBase = calculation.mWBase || "1";
    const mwSalt = calculation.mWSalt || "1";

    // Build volume labels for standard
    const stdVolsNumSymbolic: string[] = [];
    const stdVolsDenomSymbolic: string[] = [];
    const stdVolsNumValues: string[] = [];
    const stdVolsDenomValues: string[] = [];

    standardDilutions.forEach((dil, idx) => {
      if (idx === 0) {
        if (dil.vol1) {
          stdVolsDenomSymbolic.push("V1");
          stdVolsDenomValues.push(
            convertVolumeToMl(dil.vol1, dil.unit1).toString()
          );
        }
      } else {
        if (dil.vol1) {
          const vNum = idx === 1 ? "V2" : idx === 2 ? "V4" : "V6";
          stdVolsNumSymbolic.push(vNum);
          stdVolsNumValues.push(
            convertVolumeToMl(dil.vol1, dil.unit1).toString()
          );
        }
        if (dil.vol2) {
          const vNum = idx === 1 ? "V3" : idx === 2 ? "V5" : "V7";
          stdVolsDenomSymbolic.push(vNum);
          stdVolsDenomValues.push(
            convertVolumeToMl(dil.vol2, dil.unit2).toString()
          );
        }
      }
    });

    // Build volume labels for sample
    const smpVolsNumSymbolic: string[] = [];
    const smpVolsDenomSymbolic: string[] = [];
    const smpVolsNumValues: string[] = [];
    const smpVolsDenomValues: string[] = [];

    const mediaVol = tabletDetails.mediaVol
      ? convertVolumeToMl(tabletDetails.mediaVol, tabletDetails.unit).toString()
      : "0";
    smpVolsNumSymbolic.push("V8");
    smpVolsNumValues.push(mediaVol);

    sampleDilutions.forEach((dil, idx) => {
      if (dil.vol1) {
        const vNum = idx === 0 ? "V9" : idx === 1 ? "V11" : "V13";
        smpVolsDenomSymbolic.push(vNum);
        smpVolsDenomValues.push(
          convertVolumeToMl(dil.vol1, dil.unit1).toString()
        );
      }
      if (dil.vol2) {
        const vNum = idx === 0 ? "V10" : idx === 1 ? "V12" : "V14";
        smpVolsNumSymbolic.push(vNum);
        smpVolsNumValues.push(
          convertVolumeToMl(dil.vol2, dil.unit2).toString()
        );
      }
    });

    const claim = tabletDetails.claim
      ? convertMassToMg(tabletDetails.claim, tabletDetails.claimUnit).toString()
      : "0";

    const numeratorSymbolic = [
      "Area/ABS of Sample",
      "X SW1",
      ...stdVolsNumSymbolic.map((v) => `X ${v}`),
      ...smpVolsNumSymbolic.map((v) => `X ${v}`),
      "X MW Base",
      "X Purity %",
      "X 100",
    ];

    const denominatorSymbolic = [
      "Area/ABS of Standard",
      ...stdVolsDenomSymbolic.map((v) => `X ${v}`),
      "X Claim",
      ...smpVolsDenomSymbolic.map((v) => `X ${v}`),
      "X MW salt",
      "X 100",
    ];

    const tabletAreas = [
      calculation.areaOfSample1 || "0",
      calculation.areaOfSample2 || "0",
      calculation.areaOfSample3 || "0",
      calculation.areaOfSample4 || "0",
      calculation.areaOfSample5 || "0",
      calculation.areaOfSample6 || "0",
    ];

    return (
      <div className="bg-white rounded-lg p-4 border-2 border-emerald-200 shadow-sm mt-4">
        <h4 className="text-sm font-bold text-gray-900 mb-3">
          Formula for Capsule/Tablets
        </h4>

        {/* Main Symbolic Formula */}
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

        {/* Individual Tablet Formulas */}
        <div className="space-y-3 mt-4">
          {tabletAreas.map((area, idx) => {
            const numeratorValues = [
              area || "0",
              stdWeightMg.toString(),
              ...stdVolsNumValues,
              ...smpVolsNumValues,
              mwBase,
              purity,
              "100",
            ];

            const denominatorValues = [
              areaStd,
              ...stdVolsDenomValues,
              claim,
              ...smpVolsDenomValues,
              mwSalt,
              "100",
            ];

            return (
              <div
                key={idx}
                className="bg-emerald-50 rounded p-3 border border-emerald-300"
              >
                <div className="flex items-start gap-2">
                  <span className="text-xs font-bold text-emerald-700 min-w-[70px]">
                    Tablet {idx + 1}:
                  </span>
                  <div className="flex-1 flex items-center gap-2">
                    <span className="text-sm font-bold text-black">=</span>
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
              </div>
            );
          })}
        </div>

        <p className="text-xs text-right text-gray-600 mt-2 font-semibold">
          % of LC
        </p>
      </div>
    );
  };

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
    const MWBase = parseFloat(calculation.mWBase as string) || 1;
    const MWSalt = parseFloat(calculation.mWSalt as string) || 1;
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

    onFieldChange(calculation.id, "sw1", SW1_Standard.toString());
    onFieldChange(calculation.id, "claim", Claim.toString());
    onFieldChange(calculation.id, "mediaVol", MediaVol.toString());
    onFieldChange(calculation.id, "v1", V1.toString());
    onFieldChange(calculation.id, "v2", V2.toString());
    onFieldChange(calculation.id, "v3", V3.toString());
    onFieldChange(calculation.id, "v4", V4.toString());
    onFieldChange(calculation.id, "v5", V5.toString());
    onFieldChange(calculation.id, "v6", V6.toString());
    onFieldChange(calculation.id, "v7", V7.toString());
    onFieldChange(calculation.id, "v8", MediaVol.toString());
    onFieldChange(calculation.id, "v9", V9.toString());
    onFieldChange(calculation.id, "v10", V10.toString());
    onFieldChange(calculation.id, "v11", V11.toString());
    onFieldChange(calculation.id, "v12", V12.toString());
    onFieldChange(calculation.id, "v13", V13.toString());
    onFieldChange(calculation.id, "v14", V14.toString());

    return result.toFixedNoRound(4);
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
            unit: "% of LC",
          });
          validResults.push(result);

          // Save truncated to 4 decimals, then rounded to 3
          const truncated = result.toFixedNoRound(4);
          const finalValue = parseFloat(truncated.toFixed(3));
          onFieldChange(calculation.id, resultFields[index], finalValue);
        } else {
          results.push({
            tabletNumber: index + 1,
            result: result,
            unit: "% of LC",
          });

          onFieldChange(calculation.id, resultFields[index], result);
        }
      } else {
        onFieldChange(calculation.id, resultFields[index], null);
      }
    });

    setTabletResults(results);

    if (validResults.length > 0) {
      const min = Math.min(...validResults);
      const max = Math.max(...validResults);
      const sum = validResults.reduce((acc, val) => acc + val, 0);
      const avg = sum / validResults.length;

      // Truncate to 4 decimals, then round to 3 for display
      const minTruncated = min.toFixedNoRound(4);
      const maxTruncated = max.toFixedNoRound(4);
      const avgTruncated = avg.toFixedNoRound(4);

      const summaryData = {
        min: parseFloat(minTruncated.toFixed(3)),
        max: parseFloat(maxTruncated.toFixed(3)),
        avg: parseFloat(avgTruncated.toFixed(3)),
        unit: "% of LC",
      };

      setSummaryResults(summaryData);
      onFieldChange(
        calculation.id,
        "calculationResult",
        `Min: ${summaryData.min}, Max: ${summaryData.max}, Avg: ${summaryData.avg}`
      );
      onFieldChange(calculation.id, "calculationResultUnit", "% of LC");

      console.log("Summary Results:", summaryData);
    } else {
      setSummaryResults(null);
      onFieldChange(calculation.id, "calculationResult", null);
      onFieldChange(calculation.id, "calculationResultUnit", null);
    }

    console.groupEnd();
  };

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
      className="bg-white rounded-xl shadow-lg border-2 border-emerald-200 overflow-hidden mb-6"
    >
      <div
          className={`relative bg-gradient-to-r from-emerald-700 via-emerald-800 to-slate-900 ${
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

      {isExpanded && (
        <div className="border-t-4 border-emerald-300">
          <AnimatePresence>
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="p-6 bg-gradient-to-b from-gray-50 to-white space-y-6">
                  <div className="bg-gradient-to-r from-emerald-50 to-slate-50 rounded-lg p-4 border-2 border-emerald-200">
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Select Preparation Pair
                    </label>
                    <CustomDropdown
                      options={preparationPairs.map((pair) => ({
                        value: pair.value,
                        label: pair.label,
                      }))}
                      value={currentPrepLabel}
                      onChange={handlePreparationChange}
                      placeholder="Select preparation pair..."
                      colorScheme="emerald"
                    />
                  </div>

                  {selectedStandardPrep && selectedSamplePrepDisso && (
                    <FormulaDisplay />
                  )}

                  {selectedStandardPrep && selectedSamplePrepDisso && (
                    <div className="space-y-6">
                      <div className="bg-gradient-to-r from-emerald-50 to-slate-50 rounded-lg p-4 border-2 border-emerald-200">
                        <h5 className="text-sm font-bold text-gray-700 mb-3">
                          Area/ABS Values
                        </h5>
                        <div>
                          <div className="mb-4">
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
                              Sample Areas/ABS (6 Tablets)
                            </label>
                            <div className="grid grid-cols-3 gap-2">
                              {[0, 1, 2, 3, 4, 5].map((index) => (
                                <input
                                  key={index}
                                  type="number"
                                  value={getSampleAreaValue(index)}
                                  onChange={(e) =>
                                    handleSampleAreaChange(index, e.target.value)
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
                                  placeholder={`T${index + 1}`}
                                  className="w-full px-2 py-2 bg-white border border-emerald-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-emerald-50"
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gradient-to-r from-emerald-50 to-slate-50 rounded-lg p-4 border-2 border-emerald-200">
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
                              placeholder="MW Salt"
                              className="w-full px-3 py-2 bg-white border border-emerald-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-emerald-50"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Acceptance Limit */}
                      <div className="bg-gradient-to-r from-emerald-50 to-slate-50 rounded-lg p-4 border-2 border-emerald-200">
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
                                e.target.value === "" ? null : e.target.value
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
                                e.target.value === "" ? null : e.target.value
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

                      <div className="flex justify-center pt-2">
                        <motion.button
                          onClick={performCalculation}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-emerald-700 via-emerald-800 to-slate-900 text-white font-semibold rounded-lg hover:from-emerald-700 hover:to-emerald-700 transition-all shadow-md hover:shadow-lg text-sm"
                        >
                          <Calculator className="w-4 h-4" />
                          Calculate Result
                        </motion.button>
                      </div>
                    </div>
                  )}

                  {(!selectedStandardPrep || !selectedSamplePrepDisso) && (
                    <div className="bg-emerald-50 border-2 border-emerald-300 rounded-lg p-3 text-center">
                      <p className="text-xs text-emerald-800 font-medium">
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
                    className="border-t-4 border-emerald-200 p-6 bg-gradient-to-br from-emerald-50 via-slate-100/30 to-slate-50"
                  >
                    <div className="max-w-full mx-auto space-y-6">
                      {/* Header */}
                      <div className="flex items-center gap-3 pb-3">
                        <CheckCircle2 className="w-6 h-6 text-emerald-700" />
                        <div>
                          <h6 className="text-lg font-bold text-emerald-700">
                            Calculation Results
                          </h6>
                        </div>
                      </div>

                      <div className="bg-white rounded-lg shadow-lg border-2 border-emerald-300 overflow-hidden">
                        <div className="bg-gradient-to-r from-emerald-700 via-emerald-800 to-slate-900 px-4 py-2">
                          <h6 className="text-sm font-bold text-white">
                            Individual Tablet Results
                          </h6>
                        </div>
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead>
                              <tr className="bg-emerald-100">
                                <th className="px-4 py-3 text-left text-sm font-bold text-emerald-900 border-r border-emerald-200 w-32">
                                </th>
                                {tabletResults.map((result) => (
                                  <th
                                    key={result.tabletNumber}
                                    className="px-4 py-3 text-center text-xs font-bold text-emerald-900 border-r border-emerald-200 last:border-r-0"
                                  >
                                    Tablet {result.tabletNumber}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              <tr className="bg-white">
                                <td className="px-4 py-4 text-xs font-semibold text-gray-500 border-r border-gray-200">
                                  Result
                                </td>
                                {tabletResults.map((result) => (
                                  <td
                                    key={result.tabletNumber}
                                    className="px-4 py-4 text-center border-r border-gray-200 last:border-r-0"
                                  >
                                    <div className="text-lg font-bold text-gray-800">
                                      {typeof result.result === "number"
                                        ? result.result.toFixedNoRound(4).toFixed(3)
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
                              {(() => {
                                const limitMin = calculation.acceptanceLimitMin != null && calculation.acceptanceLimitMin !== ""
                                  ? parseFloat(calculation.acceptanceLimitMin as string)
                                  : null;
                                const limitMax = calculation.acceptanceLimitMax != null && calculation.acceptanceLimitMax !== ""
                                  ? parseFloat(calculation.acceptanceLimitMax as string)
                                  : null;
                                const hasMin = limitMin !== null && !isNaN(limitMin);
                                const hasMax = limitMax !== null && !isNaN(limitMax);
                                if (!hasMin && !hasMax) return null;
                                return (
                                  <tr className="bg-gray-50 border-t-2 border-emerald-200">
                                    <td className="px-4 py-3 text-xs font-semibold text-gray-500 border-r border-gray-200">
                                      Pass/Fail
                                      <div className="text-gray-400 font-normal">
                                        {hasMin ? `≥ ${limitMin!.toFixed(1)}%` : ""}
                                        {hasMin && hasMax ? " – " : ""}
                                        {hasMax ? `≤ ${limitMax!.toFixed(1)}%` : ""}
                                      </div>
                                    </td>
                                    {tabletResults.map((result) => {
                                      const val = typeof result.result === "number" ? result.result : null;
                                      const pass = val !== null &&
                                        (hasMin ? val >= limitMin! : true) &&
                                        (hasMax ? val <= limitMax! : true);
                                      return (
                                        <td
                                          key={result.tabletNumber}
                                          className="px-4 py-3 text-center border-r border-gray-200 last:border-r-0"
                                        >
                                          {val !== null ? (
                                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${pass ? "bg-green-100 text-green-800 border border-green-300" : "bg-red-100 text-red-800 border border-red-300"}`}>
                                              {pass ? "Pass" : "Fail"}
                                            </span>
                                          ) : (
                                            <span className="text-gray-400 text-xs">—</span>
                                          )}
                                        </td>
                                      );
                                    })}
                                  </tr>
                                );
                              })()}
                            </tbody>
                          </table>
                        </div>
                      </div>

                      {/* Summary Statistics Table */}
                      {summaryResults && (
                        <div className="bg-white rounded-lg shadow-lg border-2 border-emerald-300 overflow-hidden">
                          <div className="bg-gradient-to-r from-emerald-700 via-emerald-800 to-slate-900 px-4 py-2">
                            <h6 className="text-sm font-bold text-white">
                              Summary Statistics
                            </h6>
                          </div>
                          <div className="overflow-x-auto">
                            <table className="w-full">
                              <thead>
                                <tr className="bg-emerald-100">
                                  <th className="px-6 py-3 text-center text-sm font-bold text-emerald-900 border-r border-emerald-200">
                                    Minimum
                                  </th>
                                  <th className="px-6 py-3 text-center text-sm font-bold text-emerald-900 border-r border-emerald-200">
                                    Average
                                  </th>
                                  <th className="px-6 py-3 text-center text-sm font-bold text-emerald-900">
                                    Maximum
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr className="bg-white">
                                  <td className="px-6 py-4 text-center border-r border-gray-200">
                                    <div className="text-xl font-bold text-gray-800">
                                      {summaryResults.min.toFixed(3)}
                                    </div>
                                    <div className="text-xs text-gray-600 mt-1">
                                      {summaryResults.unit}
                                    </div>
                                  </td>
                                  <td className="px-6 py-4 text-center border-r border-gray-200">
                                    <div className="text-xl font-bold text-emerald-800">
                                      {summaryResults.avg.toFixed(3)}
                                    </div>
                                    <div className="text-xs text-gray-600 mt-1">
                                      {summaryResults.unit}
                                    </div>
                                  </td>
                                  <td className="px-6 py-4 text-center">
                                    <div className="text-xl font-bold text-gray-800">
                                      {summaryResults.max.toFixed(3)}
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
                              {calculation.selectedStandardPreparationLabel || "N/A"}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-600 font-medium">
                              Sample Preparation
                            </p>
                            <p className="text-gray-900 font-semibold">
                              {calculation.selectedSamplePreparationLabel || "N/A"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
};

export default CalculationDetailDisso;