import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  Calculator,
  Trash,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import type { CalculationUC } from "../../../preparation_models/drugs/CalculationUC";
import type { StandardPreparation } from "../../../preparation_models/drugs/StandardPreparation";
import type { SamplePreparationUC } from "../../../preparation_models/drugs/SamplePreparationUC";
import CustomDropdown from "../../shared/CustomDropdown";

interface CalculationDetailUCProps {
  calculation: CalculationUC;
  standardPreparations: StandardPreparation[];
  samplePreparationsUC: SamplePreparationUC[];
  onFieldChange: (
    calculationId: number,
    field: keyof CalculationUC,
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

const CalculationDetailUC: React.FC<CalculationDetailUCProps> = ({
  calculation,
  standardPreparations,
  samplePreparationsUC,
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
  const [mgPerTabletResults, setMgPerTabletResults] = useState<(number | null)[]>([]);

  const selectedStandardPrep = standardPreparations.find(
    (prep) => prep.label === calculation.selectedStandardPreparationLabel
  );

  const selectedSamplePrepUC = samplePreparationsUC.find(
    (prep) => prep.label === calculation.selectedSamplePreparationLabel
  );

  // Create preparation pair options
  const preparationPairs = standardPreparations
    .map((stdPrep, stdIdx) => {
      const matchingSamplePrep = samplePreparationsUC[stdIdx];

      if (matchingSamplePrep) {
        return {
          value: `${stdPrep.label}-${matchingSamplePrep.label}`,
          label: `Preparation${stdIdx + 1}`,
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
      { num: 7, value: calculation.calculationResultTablet7 },
      { num: 8, value: calculation.calculationResultTablet8 },
      { num: 9, value: calculation.calculationResultTablet9 },
      { num: 10, value: calculation.calculationResultTablet10 },
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

        setSummaryResults({
          min: parseFloat(min.toFixed(4)),
          max: parseFloat(max.toFixed(4)),
          avg: parseFloat(avg.toFixed(4)),
          unit: calculation.calculationResultUnit || "% of LC",
        });
      }
    }

    // Load existing mgPerTablet results
    const mgFields = [
      calculation.mgPerTabletResultTablet1,
      calculation.mgPerTabletResultTablet2,
      calculation.mgPerTabletResultTablet3,
      calculation.mgPerTabletResultTablet4,
      calculation.mgPerTabletResultTablet5,
      calculation.mgPerTabletResultTablet6,
      calculation.mgPerTabletResultTablet7,
      calculation.mgPerTabletResultTablet8,
      calculation.mgPerTabletResultTablet9,
      calculation.mgPerTabletResultTablet10,
    ];

    console.log("Loading mg/Tablet results:", calculation);
    const loadedMgResults: (number | null)[] = mgFields.map((v) => {
      if (v !== null && v !== undefined && String(v).trim() !== "") {
        const n = parseFloat(String(v));
        return isNaN(n) ? null : n;
      }
      return null;
    });
    setMgPerTabletResults(loadedMgResults);
  }, [
    calculation.id,
    calculation.calculationResultTablet1,
    calculation.calculationResultTablet2,
    calculation.calculationResultTablet3,
    calculation.calculationResultTablet4,
    calculation.calculationResultTablet5,
    calculation.calculationResultTablet6,
    calculation.calculationResultTablet7,
    calculation.calculationResultTablet8,
    calculation.calculationResultTablet9,
    calculation.calculationResultTablet10,
    calculation.calculationResultUnit,
    calculation.mgPerTabletResultTablet1,
    calculation.mgPerTabletResultTablet2,
    calculation.mgPerTabletResultTablet3,
    calculation.mgPerTabletResultTablet4,
    calculation.mgPerTabletResultTablet5,
    calculation.mgPerTabletResultTablet6,
    calculation.mgPerTabletResultTablet7,
    calculation.mgPerTabletResultTablet8,
    calculation.mgPerTabletResultTablet9,
    calculation.mgPerTabletResultTablet10,
  ]);

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
    if (!selectedSamplePrepUC) return [];
    const stepsArr = Array.isArray(selectedSamplePrepUC.steps)
      ? selectedSamplePrepUC.steps
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

  const getTabletDetails = () => {
    if (!selectedSamplePrepUC)
      return { claim: "", claimUnit: "mg"};
    const stepsArr = Array.isArray(selectedSamplePrepUC.steps)
      ? selectedSamplePrepUC.steps
      : [];
    const tabletStep = stepsArr.find((step) => step.name === "1 Tablets/Capsules");
    return {
      claim: tabletStep?.value1 || "",
      claimUnit: tabletStep?.unit1 || "mg",
      dilutedVol: tabletStep?.value2 || "",
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

    if (!selectedStandardPrep || !selectedSamplePrepUC) {
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

    const smpSteps = Array.isArray(selectedSamplePrepUC.steps)
      ? selectedSamplePrepUC.steps
      : [];

    const smpTabletDetails = smpSteps.find((s) => s.name === "1 Tablets/Capsules");
    if (!smpTabletDetails) {
      errors.push("Sample Preparation: Tablets/Capsules step is missing");
    } else {
      if (!isValueValid(smpTabletDetails.value1)) {
        errors.push(
          "Sample Preparation - Tablets/Capsules: Claim value is required"
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
  }, [selectedStandardPrep, selectedSamplePrepUC]);

  // Formula Display Component
  const FormulaDisplay: React.FC = () => {
    if (!selectedStandardPrep || !selectedSamplePrepUC) return null;

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


    sampleDilutions.forEach((dil, idx) => {
      if (idx === 0) {
        if (dil.vol1) {
          smpVolsNumSymbolic.push("V8");
          smpVolsNumValues.push(
            convertVolumeToMl(dil.vol1, dil.unit1).toString()
          );
        }
      } else {
        if (dil.vol1) {
          const vNum = idx === 1 ? "V9" : idx === 2 ? "V11" : "V13";
          smpVolsDenomSymbolic.push(vNum);
          smpVolsDenomValues.push(
            convertVolumeToMl(dil.vol1, dil.unit1).toString()
          );
        }
        if (dil.vol2) {
          const vNum = idx === 1 ? "V10" : idx === 2 ? "V12" : "V14";
          smpVolsNumSymbolic.push(vNum);
          smpVolsNumValues.push(
            convertVolumeToMl(dil.vol2, dil.unit2).toString()
          );
        }
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
    ];

    const denominatorSymbolic = [
      "Area/ABS of Standard",
      ...stdVolsDenomSymbolic.map((v) => `X ${v}`),
      ...smpVolsDenomSymbolic.map((v) => `X ${v}`),
      "X MW salt",
      "X 100",
    ];

    const allTabletAreas = [
      calculation.areaOfSample1,
      calculation.areaOfSample2,
      calculation.areaOfSample3,
      calculation.areaOfSample4,
      calculation.areaOfSample5,
      calculation.areaOfSample6,
      calculation.areaOfSample7,
      calculation.areaOfSample8,
      calculation.areaOfSample9,
      calculation.areaOfSample10,
    ];

    // Only render derivation rows for tablets that have an area entered
    const tabletAreas = allTabletAreas
      .map((area, idx) => ({ area, idx }))
      .filter(({ area }) => area !== null && area !== undefined && String(area).trim() !== "");

    return (
      <div className="bg-white rounded-lg p-4 border-2 border-emerald-200 shadow-sm mt-4 space-y-5">
        <h4 className="text-sm font-bold text-gray-900">
          Formula for Capsules/Tablets
        </h4>

        <div>
          <p className="text-xs font-bold text-emerald-700 mb-2">
            Step 1 : Result (mg/Tablet)
          </p>
          <div className="bg-gray-50 rounded p-3 mb-3 flex justify-center">
            <div className="inline-flex flex-col items-center">
              <div className="text-center border-b-2 border-black pb-2 mb-2 px-4">
                <p className="text-xs font-mono text-black whitespace-nowrap">
                  {numeratorSymbolic.join(" ")}
                </p>
              </div>
              <div className="text-center px-4">
                <p className="text-xs font-mono text-black whitespace-nowrap">
                  {denominatorSymbolic.join(" ")}
                </p>
              </div>
            </div>
          </div>
          <p className="text-xs text-right text-gray-600 font-semibold">mg/Tablet</p>
        </div>

        {/* ── STEP 2: % of LC formula ── */}
        <div>
          <p className="text-xs font-bold text-emerald-700 mb-2">
            Step 2 : Label Claim (% of LC)
          </p>
          <div className="bg-gray-50 rounded p-3 flex justify-center">
            <div className="inline-flex flex-col items-center">
              <div className="text-center border-b-2 border-black pb-2 mb-2 px-4">
                <p className="text-xs font-mono text-black whitespace-nowrap">
                  Result (mg/Tablet) × 100
                </p>
              </div>
              <div className="text-center px-4">
                <p className="text-xs font-mono text-black whitespace-nowrap">
                  Claim (mg)
                </p>
              </div>
            </div>
          </div>
          <p className="text-xs text-right text-gray-600 font-semibold">% of LC</p>
        </div>

        {/* Individual Tablet Formulas with derivation */}
        <div>
          <p className="text-xs font-bold text-emerald-700 mb-2">
            Derivations
          </p>
          <div className="space-y-3">
            {tabletAreas.map(({ area, idx }) => {
              const numeratorValues = [
                area || "0",
                stdWeightMg.toString(),
                ...stdVolsNumValues,
                ...smpVolsNumValues,
                mwBase,
                purity
              ];

              const denominatorValues = [
                areaStd,
                ...stdVolsDenomValues,
                ...smpVolsDenomValues,
                mwSalt,
                "100",
              ];

              const claimVal = claim;
              const mgResult = mgPerTabletResults[idx];

              return (
                <div
                  key={idx}
                  className="bg-emerald-50 rounded p-3 border border-emerald-300"
                >
                  <div className="flex items-start gap-2">
                    <span className="text-xs font-bold text-emerald-700 min-w-[70px]">
                      Tablet {idx + 1}:
                    </span>
                    <div className="flex-1 space-y-2">
                      {/* Step 1 derivation */}
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs text-gray-500 min-w-[90px]">Result (mg/Tablet) =</span>
                        <div className="inline-flex flex-col items-center">
                          <div className="text-center border-b-2 border-black pb-1 mb-1 px-4">
                            <p className="text-xs font-mono text-black whitespace-nowrap">
                              {numeratorValues.join(" × ")}
                            </p>
                          </div>
                          <div className="text-center px-4">
                            <p className="text-xs font-mono text-black whitespace-nowrap">
                              {denominatorValues.join(" × ")}
                            </p>
                          </div>
                        </div>
                        {mgResult != null && (
                          <span className="text-xs font-bold text-emerald-700 whitespace-nowrap">
                            = {mgResult} mg/Tablet
                          </span>
                        )}
                      </div>
                      {/* Step 2 derivation */}
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs text-gray-500 min-w-[90px]">Result (% of LC) =</span>
                        <div className="inline-flex flex-col items-center">
                          <div className="text-center border-b-2 border-black pb-1 mb-1 px-4">
                            <p className="text-xs font-mono text-black whitespace-nowrap">
                              {mgResult != null
                                ? `${mgResult} × 100`
                                : "Result (mg/Tablet) × 100"}
                            </p>
                          </div>
                          <div className="text-center px-4">
                            <p className="text-xs font-mono text-black whitespace-nowrap">
                              {claimVal}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  const canCalculate = selectedStandardPrep && selectedSamplePrepUC;

  const calculateSingleTablet = (sampleAreaValue: string): { percentLC: number | string; mgPerTablet: number | null } => {
    if (!canCalculate) {
      return { percentLC: "Missing preparations", mgPerTablet: null };
    }

    const AreaOfSample = parseFloat(sampleAreaValue);
    const AreaOfStandard =
      parseFloat(calculation.areaOfStandard as string) || 1;

    if (isNaN(AreaOfSample) || isNaN(AreaOfStandard)) {
      return { percentLC: "Invalid Input", mgPerTablet: null };
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

    const Claim = convertMassToMg(tabletDetails.claim, tabletDetails.claimUnit);

    const V8 = sampleDilutions[0]
      ? convertVolumeToMl(sampleDilutions[0].vol1, sampleDilutions[0].unit1)
      : 0;

    const V9 = sampleDilutions[1]
      ? convertVolumeToMl(sampleDilutions[1].vol1, sampleDilutions[1].unit1)
      : 0;
    const V10 = sampleDilutions[1]
      ? convertVolumeToMl(sampleDilutions[1].vol2, sampleDilutions[1].unit2)
      : 0;

    const V11 = sampleDilutions[2]
      ? convertVolumeToMl(sampleDilutions[2].vol1, sampleDilutions[2].unit1)
      : 0;
    const V12 = sampleDilutions[2]
      ? convertVolumeToMl(sampleDilutions[2].vol2, sampleDilutions[2].unit2)
      : 0;

    const V13 = sampleDilutions[3]
      ? convertVolumeToMl(sampleDilutions[3].vol1, sampleDilutions[3].unit1)
      : 0;
    const V14 = sampleDilutions[3]
      ? convertVolumeToMl(sampleDilutions[3].vol2, sampleDilutions[3].unit2)
      : 0;

    // Step 1: Calculate result in mg/Tablet (Claim is NOT in denominator)
    const numerator =
      AreaOfSample *
      SW1_Standard *
      V2 *
      V4 *
      V6 *
      V8 *
      V10 *
      V12 *
      V14 *
      MWBase *
      Purity;

    const denominator =
      AreaOfStandard *
      V1 *
      V3 *
      V5 *
      V7 *
      V9 *
      V11 *
      V13 *
      MWSalt *
      100;

    if (denominator === 0) {
      return { percentLC: "Error: Division by zero", mgPerTablet: null };
    }

    const result_mg_per_tablet_raw = numerator / denominator;

    console.log(`Step 1 - mg/Tablet: ${numerator} / ${denominator} = ${result_mg_per_tablet_raw}`);

    if (isNaN(result_mg_per_tablet_raw) || !isFinite(result_mg_per_tablet_raw)) {
      return { percentLC: "Error: Invalid calculation", mgPerTablet: null };
    }

    // Round mg/tablet: toFixedNoRound(4) then toFixed(3)
    const result_mg_per_tablet = result_mg_per_tablet_raw.toFixedNoRound(4);

    // Step 2: Calculate % of LC = Result (mg/Tablet) * 100 / Claim
    if (Claim === 0) {
      return { percentLC: "Error: Claim is zero", mgPerTablet: result_mg_per_tablet };
    }

    const result = (result_mg_per_tablet * 100) / Claim;

    console.log(`Step 2 - % of LC: ${result_mg_per_tablet} x 100 / ${Claim} = ${result}`);

    if (isNaN(result) || !isFinite(result)) {
      return { percentLC: "Error: Invalid calculation", mgPerTablet: result_mg_per_tablet };
    }

    onFieldChange(calculation.id, "sw1", SW1_Standard.toString());
    onFieldChange(calculation.id, "claim", Claim.toString());
    onFieldChange(calculation.id, "v1", V1.toString());
    onFieldChange(calculation.id, "v2", V2.toString());
    onFieldChange(calculation.id, "v3", V3.toString());
    onFieldChange(calculation.id, "v4", V4.toString());
    onFieldChange(calculation.id, "v5", V5.toString());
    onFieldChange(calculation.id, "v6", V6.toString());
    onFieldChange(calculation.id, "v7", V7.toString());
    onFieldChange(calculation.id, "v8", V8.toString());
    onFieldChange(calculation.id, "v9", V9.toString());
    onFieldChange(calculation.id, "v10", V10.toString());
    onFieldChange(calculation.id, "v11", V11.toString());
    onFieldChange(calculation.id, "v12", V12.toString());
    onFieldChange(calculation.id, "v13", V13.toString());
    onFieldChange(calculation.id, "v14", V14.toString());

    return { percentLC: result.toFixedNoRound(4), mgPerTablet: result_mg_per_tablet };
  };

  const performCalculation = () => {
    console.group("🧪 Uniformity of Content Calculation Started");

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
      calculation.areaOfSample7,
      calculation.areaOfSample8,
      calculation.areaOfSample9,
      calculation.areaOfSample10,
    ];

    const results: TabletResult[] = [];
    const validResults: number[] = [];
    const mgResults: (number | null)[] = [];
    const resultFields: Array<keyof CalculationUC> = [
      "calculationResultTablet1",
      "calculationResultTablet2",
      "calculationResultTablet3",
      "calculationResultTablet4",
      "calculationResultTablet5",
      "calculationResultTablet6",
      "calculationResultTablet7",
      "calculationResultTablet8",
      "calculationResultTablet9",
      "calculationResultTablet10",
    ];
    const mgResultFields: Array<keyof CalculationUC> = [
      "mgPerTabletResultTablet1",
      "mgPerTabletResultTablet2",
      "mgPerTabletResultTablet3",
      "mgPerTabletResultTablet4",
      "mgPerTabletResultTablet5",
      "mgPerTabletResultTablet6",
      "mgPerTabletResultTablet7",
      "mgPerTabletResultTablet8",
      "mgPerTabletResultTablet9",
      "mgPerTabletResultTablet10",
    ];

    sampleAreas.forEach((area, index) => {
      if (area && area.trim() !== "") {
        const calcResult = calculateSingleTablet(area);
        const { percentLC, mgPerTablet } = calcResult;

        mgResults.push(mgPerTablet);

        // Save mg/tablet result
        if (mgPerTablet !== null) {
          const mgFinal = mgPerTablet.toFixedNoRound(4);
          onFieldChange(calculation.id, mgResultFields[index], mgFinal);
        } else {
          onFieldChange(calculation.id, mgResultFields[index], null);
        }

        if (typeof percentLC === "number") {
          results.push({
            tabletNumber: index + 1,
            result: percentLC,
            unit: "% of LC",
          });
          validResults.push(percentLC);

          const truncated = percentLC.toFixedNoRound(4);
          const finalValue = parseFloat(truncated.toFixed(3));

          onFieldChange(calculation.id, resultFields[index], finalValue);
        } else {
          results.push({
            tabletNumber: index + 1,
            result: percentLC,
            unit: "",
          });

          onFieldChange(calculation.id, resultFields[index], percentLC);
        }
      } else {
        mgResults.push(null);
        onFieldChange(calculation.id, resultFields[index], null);
        onFieldChange(calculation.id, mgResultFields[index], null);
      }
    });

    setTabletResults(results);
    setMgPerTabletResults(mgResults);

    if (validResults.length > 0) {
      const min = Math.min(...validResults);
      const max = Math.max(...validResults);
      const sum = validResults.reduce((acc, val) => acc + val, 0);
      const avg = sum / validResults.length;

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
      onFieldChange(calculation.id, "calculationResultUnit", "% of LC");
      onFieldChange(calculation.id, "mgPerTabletResultUnit", "mg/Tablet");

      console.log("Summary Results:", summaryData);
    } else {
      setSummaryResults(null);
      onFieldChange(calculation.id, "calculationResultUnit", null);
    }

    console.groupEnd();
  };

  const getSampleAreaField = (index: number): keyof CalculationUC => {
    const fields: Array<keyof CalculationUC> = [
      "areaOfSample1",
      "areaOfSample2",
      "areaOfSample3",
      "areaOfSample4",
      "areaOfSample5",
      "areaOfSample6",
      "areaOfSample7",
      "areaOfSample8",
      "areaOfSample9",
      "areaOfSample10",
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
      calculation.areaOfSample7,
      calculation.areaOfSample8,
      calculation.areaOfSample9,
      calculation.areaOfSample10,
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
                Uniformity of Content Calculation
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

                {selectedStandardPrep && selectedSamplePrepUC && (
                  <FormulaDisplay />
                )}

                {selectedStandardPrep && selectedSamplePrepUC && (
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
                            Sample Areas/ABS (10 Tablets/Capsules)
                          </label>
                          <div className="grid grid-cols-5 gap-2">
                            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((index) => (
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
                            value={calculation.mWBase!}
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
                            value={calculation.mWSalt!}
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

                {(!selectedStandardPrep || !selectedSamplePrepUC) && (
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
                          Individual Tablet/Capsule Results
                        </h6>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="bg-emerald-100">
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
                              {tabletResults.map((result) => (
                                <td
                                  key={result.tabletNumber}
                                  className="px-4 py-4 text-center border-r border-gray-200 last:border-r-0"
                                >
                                  <div className="text-lg font-bold text-gray-800">
                                    {typeof result.result === "number"
                                      ? result.result.toFixedNoRound(3).toFixed(2)
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
                                ? parseFloat(calculation.acceptanceLimitMin as string) : null;
                              const limitMax = calculation.acceptanceLimitMax != null && calculation.acceptanceLimitMax !== ""
                                ? parseFloat(calculation.acceptanceLimitMax as string) : null;
                              const hasMin = limitMin !== null && !isNaN(limitMin);
                              const hasMax = limitMax !== null && !isNaN(limitMax);
                              if (!hasMin && !hasMax) return null;
                              return (
                                <tr className="bg-gray-50 border-t-2 border-emerald-200">
                                  {tabletResults.map((result) => {
                                    const val = typeof result.result === "number" ? result.result : null;
                                    const pass = val !== null &&
                                      (hasMin ? val >= limitMin! : true) &&
                                      (hasMax ? val <= limitMax! : true);
                                    return (
                                      <td key={result.tabletNumber} className="px-4 py-3 text-center border-r border-gray-200 last:border-r-0">
                                        {val !== null ? (
                                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${pass ? "bg-green-100 text-green-800 border border-green-300" : "bg-red-100 text-red-800 border border-red-300"}`}>
                                            {pass ? "Pass" : "Fail"}
                                          </span>
                                        ) : <span className="text-gray-400 text-xs">—</span>}
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
                                    {summaryResults.min.toFixedNoRound(3).toFixed(2)}
                                  </div>
                                  <div className="text-xs text-gray-600 mt-1">
                                    {summaryResults.unit}
                                  </div>
                                </td>
                                <td className="px-6 py-4 text-center border-r border-gray-200">
                                  <div className="text-xl font-bold text-emerald-800">
                                    {summaryResults.avg.toFixedNoRound(3).toFixed(2)}
                                  </div>
                                  <div className="text-xs text-gray-600 mt-1">
                                    {summaryResults.unit}
                                  </div>
                                </td>
                                <td className="px-6 py-4 text-center">
                                  <div className="text-xl font-bold text-gray-800">
                                    {summaryResults.max.toFixedNoRound(3).toFixed(2)}
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

export default CalculationDetailUC;