import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  Calculator,
  Trash,
  CheckCircle2,
  Clock,
} from "lucide-react";
import type { CalculationDissoProfile } from "../../../preparation_models/drugs/CalculationDissoProfile";
import type { StandardPreparation } from "../../../preparation_models/drugs/StandardPreparation";
import type { SamplePreparationDisso } from "../../../preparation_models/drugs/SamplePreparationDisso";
import CustomDropdown from "../../shared/CustomDropdown";

interface CalculationDetailDissoProfileProps {
  calculation: CalculationDissoProfile;
  standardPreparations: StandardPreparation[];
  samplePreparationsDisso: SamplePreparationDisso[];
  onFieldChange: (
    calculationId: number,
    field: keyof CalculationDissoProfile,
    value: string | number | null,
  ) => void;
  onRemove: () => void;
  role: string;
}

interface SampleTimePointResult {
  sampleNumber: number;
  result: number;
  correctionFactor?: number;
  resultAfterCorrection?: number;
}

interface TimePointResult {
  timePoint: number;
  timePointLabel: string;
  v8: number;
  sampleResults: SampleTimePointResult[];
  min: number;
  avg: number;
  max: number;
}

interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

// ─── Field name helpers ───────────────────────────────────────────────────────
const tpDetailField = (tp: number): keyof CalculationDissoProfile =>
  `timePointDetail${tp}` as keyof CalculationDissoProfile;

const tpSampleField = (tp: number, s: number): keyof CalculationDissoProfile =>
  `areaOfSampleT${tp}S${s}` as keyof CalculationDissoProfile;

// ─── Unit conversion helpers ──────────────────────────────────────────────────
const convertMassToMg = (value: string | number, unit: string): number => {
  const val = parseFloat(String(value));
  if (isNaN(val)) return 1;
  switch (unit.toLowerCase().trim()) {
    case "mg":
      return val;
    case "g":
      return val * 1000;
    case "kg":
      return val * 1_000_000;
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
  switch (unit.toLowerCase().trim()) {
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

// ─── Result persistence helpers ──────────────────────────────────────────────

/** Build a 6-element sparse array (index = sampleNumber-1) from sampleResults */
const toSampleArray = (
  sampleResults: SampleTimePointResult[],
  key: "result" | "correctionFactor" | "resultAfterCorrection",
): (number | null)[] => {
  const arr: (number | null)[] = [null, null, null, null, null, null];
  sampleResults.forEach((sr) => {
    const val = sr[key];
    if (val !== undefined && sr.sampleNumber >= 1 && sr.sampleNumber <= 6) {
      arr[sr.sampleNumber - 1] = val;
    }
  });
  return arr;
};

/** Restore TimePointResult[] from the flat typed fields on the model */
const restoreTimePointResults = (
  calc: CalculationDissoProfile,
): TimePointResult[] => {
  const results: TimePointResult[] = [];
  for (let tp = 1; tp <= 10; tp++) {
    const tpKey = `T${tp}`;
    const parseArr = (raw: unknown): (number | null)[] | null => {
      if (!raw) return null;
      try { return typeof raw === "string" ? JSON.parse(raw) : (raw as (number | null)[]); }
      catch { return null; }
    };

    const rawResults = parseArr(calc[`sampleResults${tpKey}` as keyof CalculationDissoProfile]);
    if (!rawResults) break;

    const cfArr = parseArr(calc[`correctionFactors${tpKey}` as keyof CalculationDissoProfile]);
    const racArr = parseArr(calc[`resultsAfterCorrection${tpKey}` as keyof CalculationDissoProfile]);

    const sampleResults: SampleTimePointResult[] = rawResults
      .map((val, idx) => {
        if (val === null) return null;
        const sr: SampleTimePointResult = { sampleNumber: idx + 1, result: val };
        if (cfArr && cfArr[idx] !== null) sr.correctionFactor = cfArr[idx] as number;
        if (racArr && racArr[idx] !== null) sr.resultAfterCorrection = racArr[idx] as number;
        return sr;
      })
      .filter(Boolean) as SampleTimePointResult[];

    if (sampleResults.length === 0) break;

    results.push({
      timePoint: tp,
      timePointLabel: (calc[`timePointDetail${tp}` as keyof CalculationDissoProfile] as string) || `T${tp}`,
      v8: parseFloat((calc[`v8TimePoint${tp}` as keyof CalculationDissoProfile] as string) || "0") || 0,
      sampleResults,
      min: (calc[`minT${tp}` as keyof CalculationDissoProfile] as number | null) ?? 0,
      avg: (calc[`avgT${tp}` as keyof CalculationDissoProfile] as number | null) ?? 0,
      max: (calc[`maxT${tp}` as keyof CalculationDissoProfile] as number | null) ?? 0,
    });
  }
  return results;
};

/** Persist TimePointResult[] into the flat typed fields on the model via onFieldChange */
const persistTimePointResults = (
  calcId: number,
  results: TimePointResult[],
  onFieldChange: (id: number, field: keyof CalculationDissoProfile, value: string | number | null) => void,
) => {
  results.forEach((tpr) => {
    const tp = tpr.timePoint;
    const tpKey = `T${tp}`;

    // Per-sample results
    onFieldChange(calcId, `sampleResults${tpKey}` as keyof CalculationDissoProfile,
      JSON.stringify(toSampleArray(tpr.sampleResults, "result")));

    // CF and RAC only for T2+
    if (tp > 1) {
      onFieldChange(calcId, `correctionFactors${tpKey}` as keyof CalculationDissoProfile,
        JSON.stringify(toSampleArray(tpr.sampleResults, "correctionFactor")));
      onFieldChange(calcId, `resultsAfterCorrection${tpKey}` as keyof CalculationDissoProfile,
        JSON.stringify(toSampleArray(tpr.sampleResults, "resultAfterCorrection")));
    }

    // Stats
    onFieldChange(calcId, `minT${tp}` as keyof CalculationDissoProfile, tpr.min);
    onFieldChange(calcId, `avgT${tp}` as keyof CalculationDissoProfile, tpr.avg);
    onFieldChange(calcId, `maxT${tp}` as keyof CalculationDissoProfile, tpr.max);
  });
};

// ─── Component ────────────────────────────────────────────────────────────────
const CalculationDetailDissoProfile: React.FC<
  CalculationDetailDissoProfileProps
> = ({
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
  const [timePointResults, setTimePointResults] = useState<TimePointResult[]>(() =>
    restoreTimePointResults(calculation),
  );

  // ── Lookups ─────────────────────────────────────────────────────────────────
  const selectedStandardPrep = standardPreparations.find(
    (p) => p.label === calculation.selectedStandardPreparationLabel,
  );
  const selectedSamplePrepDisso = samplePreparationsDisso.find(
    (p) => p.label === calculation.selectedSamplePreparationLabel,
  );

  // ── Dropdown options ─────────────────────────────────────────────────────────
  const timePointOptions = Array.from({ length: 9 }, (_, i) => ({
    value: String(i + 2),
    label: `${i + 2} time points`,
  }));

  const preparationPairs = standardPreparations
    .map((stdPrep, stdIdx) => {
      const matchingSamplePrep = samplePreparationsDisso[stdIdx];
      if (!matchingSamplePrep) return null;
      return {
        value: `${stdPrep.label}-${matchingSamplePrep.label}`,
        label: `Preparation ${stdIdx + 1}`,
        standardLabel: stdPrep.label,
        sampleLabel: matchingSamplePrep.label,
      };
    })
    .filter(Boolean) as {
    value: string;
    label: string;
    standardLabel: string;
    sampleLabel: string;
  }[];

  const currentPrepLabel =
    calculation.selectedStandardPreparationLabel &&
    calculation.selectedSamplePreparationLabel
      ? `${calculation.selectedStandardPreparationLabel}-${calculation.selectedSamplePreparationLabel}`
      : "";

  const handlePreparationChange = (value: string) => {
    const pair = preparationPairs.find((p) => p.value === value);
    if (pair) {
      onFieldChange(
        calculation.id,
        "selectedStandardPreparationLabel",
        pair.standardLabel,
      );
      onFieldChange(
        calculation.id,
        "selectedSamplePreparationLabel",
        pair.sampleLabel,
      );
    } else {
      onFieldChange(calculation.id, "selectedStandardPreparationLabel", null);
      onFieldChange(calculation.id, "selectedSamplePreparationLabel", null);
    }
  };

  // ── Preparation data helpers ─────────────────────────────────────────────────
  const getStandardDilutions = () => {
    if (!selectedStandardPrep) return [];
    return (
      Array.isArray(selectedStandardPrep.steps)
        ? selectedStandardPrep.steps
        : []
    )
      .filter((s) =>
        [
          "1st Dilution",
          "2nd Dilution",
          "3rd Dilution",
          "4th Dilution",
        ].includes(s.name),
      )
      .map((s) => ({
        name: s.name,
        vol1: s.value1 || "",
        vol2: s.value2 || "",
        unit1: s.unit1 || "ml",
        unit2: s.unit2 || "ml",
      }));
  };

  const getSampleDilutions = () => {
    if (!selectedSamplePrepDisso) return [];
    return (
      Array.isArray(selectedSamplePrepDisso.steps)
        ? selectedSamplePrepDisso.steps
        : []
    )
      .filter((s) =>
        ["1st Dilution", "2nd Dilution", "3rd Dilution"].includes(s.name),
      )
      .map((s) => ({
        name: s.name,
        vol1: s.value1 || "",
        vol2: s.value2 || "",
        unit1: s.unit1 || "ml",
        unit2: s.unit2 || "ml",
      }));
  };

  const getStandardWeight = () => {
    if (!selectedStandardPrep) return { value: "", unit: "g" };
    const step = (
      Array.isArray(selectedStandardPrep.steps)
        ? selectedStandardPrep.steps
        : []
    ).find((s) => s.name === "Weighing");
    return { value: step?.value1 || "", unit: step?.unit1 || "g" };
  };

  const getTabletDetails = () => {
    if (!selectedSamplePrepDisso)
      return { claim: "", claimUnit: "mg", mediaVol: "", unit: "ml" };
    const step = (
      Array.isArray(selectedSamplePrepDisso.steps)
        ? selectedSamplePrepDisso.steps
        : []
    ).find((s) => s.name === "Tablet Details");
    return {
      claim: step?.value1 || "",
      claimUnit: step?.unit1 || "mg",
      mediaVol: step?.value2 || "",
      unit: step?.unit2 || "ml",
    };
  };

  const standardDilutions = getStandardDilutions();
  const sampleDilutions = getSampleDilutions();
  const standardWeight = getStandardWeight();
  const tabletDetails = getTabletDetails();

  // ── Validation ───────────────────────────────────────────────────────────────
  const validatePreparations = (): ValidationResult => {
    const errors: string[] = [];
    if (!selectedStandardPrep || !selectedSamplePrepDisso)
      errors.push("Please select both Standard and Sample preparations");
    return { isValid: errors.length === 0, errors, warnings: [] };
  };

  useEffect(() => {
    setValidationResult(validatePreparations());
  }, [selectedStandardPrep, selectedSamplePrepDisso]);

  // ── Restore results when calculation data is loaded/changed externally ────────
  useEffect(() => {
    const restored = restoreTimePointResults(calculation);
    if (restored.length > 0) setTimePointResults(restored);
  }, [calculation.id]);

  const canCalculate = !!(selectedStandardPrep && selectedSamplePrepDisso);

  // ── Volume extraction ────────────────────────────────────────────────────────
  const getVolumes = () => {
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
    return { V1, V2, V3, V4, V5, V6, V7, V9, V10, V11, V12, V13, V14 };
  };

  // ── Core single-sample result ────────────────────────────────────────────────
  // Result(% of LC) = (AreaSample × SW1 × V2 × V4 × V6 × V8 × V10 × V12 × V14 × MWBase × Purity × 100)
  //                 / (AreaStd   × V1  × V3  × V5  × V7  × Claim × V9 × V11 × V13 × MWSalt × 100)
  const calculateSingleSample = (
    areaValue: string,
    v8: number,
  ): number | null => {
    const AreaOfSample = parseFloat(areaValue);
    const AreaOfStandard =
      parseFloat(calculation.areaOfStandard as string) || 1;
    if (isNaN(AreaOfSample)) return null;

    const SW1 = convertMassToMg(standardWeight.value, standardWeight.unit);
    const MWBase = parseFloat(calculation.mWBase as string) || 1;
    const MWSalt = parseFloat(calculation.mWSalt as string) || 1;
    const Purity = parseFloat(calculation.purity as string) || 1;
    const Claim = convertMassToMg(tabletDetails.claim, tabletDetails.claimUnit);
    const { V1, V2, V3, V4, V5, V6, V7, V9, V10, V11, V12, V13, V14 } =
      getVolumes();

    const num =
      AreaOfSample *
      SW1 *
      V2 *
      V4 *
      V6 *
      v8 *
      V10 *
      V12 *
      V14 *
      MWBase *
      Purity *
      100;
    const den =
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
    if (den === 0) return null;
    const r = num / den;
    return isNaN(r) || !isFinite(r) ? null : r;
  };

  // ── Main calculation ─────────────────────────────────────────────────────────hHJHJJJJJJJJJJJJJJJJJJJJJ
  const performCalculation = () => {
    if (!canCalculate) {
      setTimePointResults([]);
      return;
    }

    const numberOfPoints = calculation.numberOfTimePoints || 2;
    const volWithdraw = parseFloat(calculation.volumeWithdraw) || 0;
    const volReplaced = parseFloat(calculation.volumeReplaced) || 0;
    const initialMediaVol = convertVolumeToMl(
      tabletDetails.mediaVol,
      tabletDetails.unit,
    );

    onFieldChange(
      calculation.id,
      "sw1",
      convertMassToMg(standardWeight.value, standardWeight.unit).toString(),
    );
    onFieldChange(calculation.id, "v8", initialMediaVol.toString());

    const results: TimePointResult[] = [];
    // Track the plain Result (not corrected) per sample from the previous time point — used for CF calculation
    const prevPlainResultBySample: Record<number, number> = {};
    // Track cumulative sum of all CFs per sample across time points — used for corrected result
    const cumulativeCFBySample: Record<number, number> = {};
    let v8 = initialMediaVol;

    for (let tp = 0; tp < numberOfPoints; tp++) {
      const timePointNum = tp + 1;
      const v8ThisPoint = v8;
      const timePointLabel =
        (calculation[tpDetailField(timePointNum)] as string) ||
        `T${timePointNum}`;

      onFieldChange(
        calculation.id,
        `v8TimePoint${timePointNum}` as keyof CalculationDissoProfile,
        v8ThisPoint.toString(),
      );

      const sampleResults: SampleTimePointResult[] = [];
      const statNums: number[] = [];

      for (let s = 1; s <= 6; s++) {
        const areaValue = calculation[tpSampleField(timePointNum, s)] as
          | string
          | null;
        if (!areaValue || String(areaValue).trim() === "") continue;

        const rawResultRaw = calculateSingleSample(areaValue, v8ThisPoint);
        if (rawResultRaw === null) continue;

        const rawResult = parseFloat(rawResultRaw.toFixedNoRound(4).toFixed(3));

        const sr: SampleTimePointResult = {
          sampleNumber: s,
          result: rawResult,
        };

        if (tp === 0) {
          // T1: no correction factor — initialise tracking
          prevPlainResultBySample[s] = rawResult;
          cumulativeCFBySample[s] = 0;          // no CFs exist yet
          statNums.push(rawResult);
        } else {
          // CF at this time point is calculated using the PLAIN Result of the previous time point
          // CF(T1) means "CF calculated at T2 using Result(T1)", CF(T2) = "CF at T3 using Result(T2)", etc.
          const prevPlainResult = prevPlainResultBySample[s] ?? 0;
          const cfRaw =
            v8ThisPoint !== 0 ? (prevPlainResult * volWithdraw) / v8ThisPoint : 0;
          const cf = parseFloat(cfRaw.toFixedNoRound(4).toFixed(3));

          // Add current CF into cumulative sum FIRST, then use it for corrected result:
          // At T2: cumulative = 0 + CF(T1) → Corrected(T2) = Result(T2) + CF(T1)          ✓
          // At T3: cumulative = CF(T1) + CF(T2) → Corrected(T3) = Result(T3) + CF(T1) + CF(T2) ✓
          // At T4: cumulative = CF(T1)+CF(T2)+CF(T3) → Corrected(T4) = Result(T4)+CF(T1)+CF(T2)+CF(T3) ✓
          cumulativeCFBySample[s] = (cumulativeCFBySample[s] ?? 0) + cf;

          const rac = parseFloat(
            (rawResult + cumulativeCFBySample[s]).toFixedNoRound(4).toFixed(3),
          );

          sr.correctionFactor = cf;
          sr.resultAfterCorrection = rac;

          // Store the plain result (NOT corrected) as "previous" for the next time point's CF
          prevPlainResultBySample[s] = rawResult;
          statNums.push(rac);
        }

        sampleResults.push(sr);
      }

      const min = statNums.length ? parseFloat((Math.min(...statNums)).toFixedNoRound(4).toFixed(3)) : 0;
      const max = statNums.length ? parseFloat((Math.max(...statNums)).toFixedNoRound(4).toFixed(3)) : 0;
      const avg = statNums.length
        ? parseFloat((statNums.reduce((a, b) => a + b, 0) / statNums.length).toFixedNoRound(4).toFixed(3))
        : 0;

      results.push({
        timePoint: timePointNum,
        timePointLabel,
        v8: v8ThisPoint,
        sampleResults,
        min,
        avg,
        max,
      });

      v8 = v8ThisPoint - volWithdraw + volReplaced;
    }

    setTimePointResults(results);
    persistTimePointResults(calculation.id, results, onFieldChange);
  };

  // ── Formula Display (main formula only) ──────────────────────────────────────
  const FormulaDisplay: React.FC = () => {
    if (!selectedStandardPrep || !selectedSamplePrepDisso) return null;

    const stdVolsNumSym: string[] = [];
    const stdVolsDenSym: string[] = [];
    standardDilutions.forEach((dil, idx) => {
      if (idx === 0) {
        if (dil.vol1) stdVolsDenSym.push("V1");
      } else {
        if (dil.vol1)
          stdVolsNumSym.push(idx === 1 ? "V2" : idx === 2 ? "V4" : "V6");
        if (dil.vol2)
          stdVolsDenSym.push(idx === 1 ? "V3" : idx === 2 ? "V5" : "V7");
      }
    });

    const smpVolsNumSym: string[] = ["V8"];
    const smpVolsDenSym: string[] = [];
    sampleDilutions.forEach((dil, idx) => {
      if (dil.vol2)
        smpVolsNumSym.push(idx === 0 ? "V10" : idx === 1 ? "V12" : "V14");
      if (dil.vol1)
        smpVolsDenSym.push(idx === 0 ? "V9" : idx === 1 ? "V11" : "V13");
    });

    const numeratorParts = [
      "Area/ABS of Sample",
      "× SW1",
      ...stdVolsNumSym.map((v) => `× ${v}`),
      ...smpVolsNumSym.map((v) => `× ${v}`),
      "× MW Base",
      "× Purity %",
      "× 100",
    ];

    const denominatorParts = [
      "Area/ABS of Standard",
      ...stdVolsDenSym.map((v) => `× ${v}`),
      "× Claim",
      ...smpVolsDenSym.map((v) => `× ${v}`),
      "× MW Salt",
      "× 100",
    ];

    return (
      <div className="bg-white rounded-lg p-4 border-2 border-emerald-200 shadow-sm">
        <h4 className="text-xs font-bold text-gray-700 mb-3 uppercase tracking-wide">
          Formula — Dissolution Profile (% of Label Claim)
        </h4>
        <div className="bg-gray-50 rounded-lg p-4 flex flex-col items-center">
          <p className="text-xs font-mono text-gray-900 text-center border-b-2 border-gray-800 pb-3 w-full leading-relaxed">
            {numeratorParts.join("  ")}
          </p>
          <p className="text-xs font-mono text-gray-900 text-center pt-3 w-full leading-relaxed">
            {denominatorParts.join("  ")}
          </p>
        </div>
        <p className="text-xs text-right text-emerald-700 font-bold mt-2">
          = % of LC
        </p>
        {(calculation.numberOfTimePoints || 2) > 1 && (
          <div className="mt-3 bg-emerald-50 rounded-lg p-3 border border-emerald-200 space-y-1 text-xs font-mono text-gray-700">
            <p>
              <span className="font-bold text-emerald-800">V8(T1)</span>
              {" = Initial Media Volume  |  "}
              <span className="font-bold text-emerald-800">V8(Tn)</span>
              {" = V8(Tn‑1) − Vol Withdrawn + Vol Replaced"}
            </p>
            <p>
              <span className="font-bold text-emerald-800">CF(Tn)</span>
              {" = Result(Tn−1) × Vol Withdrawn / V8(Tn)"}
              <span className="text-gray-400 ml-2">[T2 onwards]</span>
            </p>
            <p>
              <span className="font-bold text-emerald-800">Corrected Result</span>
              {" = Result(Tn) + CF(T1) + CF(T2) + ... + CF(Tn-1)"}
            </p>
          </div>
        )}
      </div>
    );
  };

  // ── Colors ───────────────────────────────────────────────────────────────────
  const colors = {
    glowGradient: "from-emerald-700/20 to-slate-900/20",
    borderColor: "border-slate-700/40",
    headerGradient: "from-emerald-700 via-emerald-800 to-slate-900",
    textColor: "text-emerald-100",
    bgGradient: "from-emerald-50/50 to-slate-50/30",
  };

  const numberOfPoints = calculation.numberOfTimePoints || 2;

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="relative group z-20"
    >
      <div
        className={`absolute inset-0 bg-gradient-to-r ${colors.glowGradient} rounded-lg blur-xl group-hover:blur-xl transition-all duration-300`}
      />

      <div
        className={`relative bg-white/95 backdrop-blur-sm rounded-lg border ${colors.borderColor} transition-all duration-300 mb-4`}
      >
        {/* ── Header ── */}
        <div
          className={`relative bg-gradient-to-r ${colors.headerGradient} ${isExpanded ? "rounded-t-lg" : "rounded-lg"}`}
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
                  <Clock className="w-5 h-5 text-white" />
                </div>
              </motion.div>
              <div>
                <h4 className="text-sm font-semibold text-white tracking-wide">
                  {calculation.label}
                </h4>
                <p className={`text-xs ${colors.textColor}`}>
                  Dissolution Profile Calculation
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

        {/* ── Body ── */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <div
                className={`p-5 space-y-4 bg-gradient-to-br ${colors.bgGradient}`}
              >

                {/* ── Preparation selection ── */}
                <div className="bg-white rounded-lg p-4 border-2 border-emerald-200 shadow-sm">
                  <label className="text-xs font-semibold text-gray-700 mb-2 block">
                    Select Preparation Pair
                  </label>
                  <CustomDropdown
                    options={preparationPairs}
                    value={currentPrepLabel}
                    onChange={handlePreparationChange}
                    placeholder="Choose Standard & Sample Preparation"
                    colorScheme="emerald"
                  />
                </div>

                {/* ── Profile configuration ── */}
                {selectedStandardPrep && selectedSamplePrepDisso && (
                  <div className="bg-white rounded-lg p-4 border-2 border-emerald-200 shadow-sm space-y-4">
                    <h5 className="text-sm font-bold text-emerald-900">
                      Profile Configuration
                    </h5>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="text-xs font-semibold text-gray-700 mb-1 block">
                          Number of Time Points
                        </label>
                        <CustomDropdown
                          options={timePointOptions}
                          value={String(calculation.numberOfTimePoints || 2)}
                          onChange={(v) =>
                            onFieldChange(
                              calculation.id,
                              "numberOfTimePoints",
                              parseInt(v),
                            )
                          }
                          placeholder="Select time points"
                          colorScheme="emerald"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-gray-700 mb-1 block">
                          Volume Withdrawn (ml)
                        </label>
                        <input
                          type="number"
                          min="0"
                          step="0.1"
                          value={calculation.volumeWithdraw || ""}
                          onChange={(e) =>
                            onFieldChange(
                              calculation.id,
                              "volumeWithdraw",
                              e.target.value,
                            )
                          }
                          onKeyDown={(e) => {
                            if (e.key === "ArrowUp" || e.key === "ArrowDown")
                              e.preventDefault();
                          }}
                          onWheel={(e) => e.currentTarget.blur()}
                          placeholder="0"
                          className="w-full px-3 py-2 border border-emerald-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-emerald-400"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-gray-700 mb-1 block">
                          Volume Replaced (ml)
                        </label>
                        <input
                          type="number"
                          min="0"
                          step="0.1"
                          value={calculation.volumeReplaced || ""}
                          onChange={(e) =>
                            onFieldChange(
                              calculation.id,
                              "volumeReplaced",
                              e.target.value,
                            )
                          }
                          onKeyDown={(e) => {
                            if (e.key === "ArrowUp" || e.key === "ArrowDown")
                              e.preventDefault();
                          }}
                          onWheel={(e) => e.currentTarget.blur()}
                          placeholder="0"
                          className="w-full px-3 py-2 border border-emerald-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-emerald-400"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* ── Validation errors ── */}
                {validationResult.errors.length > 0 && (
                  <div className="bg-red-50 border-2 border-red-300 rounded-lg p-3">
                    <h6 className="text-xs font-bold text-red-800 mb-2">
                      Validation Errors:
                    </h6>
                    <ul className="space-y-1">
                      {validationResult.errors.map((err, i) => (
                        <li
                          key={i}
                          className="text-xs text-red-700 flex items-start gap-2"
                        >
                          <span className="text-red-500 mt-0.5">•</span>
                          <span>{err}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* ── Calculation inputs ── */}
                {selectedStandardPrep && selectedSamplePrepDisso && (
                  <div className="bg-white rounded-lg p-4 border-2 border-emerald-200 shadow-sm space-y-5">
                    <h5 className="text-sm font-bold text-emerald-900">
                      Calculation Inputs
                    </h5>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-semibold text-gray-700 mb-1 block">
                          Area / ABS of Standard
                        </label>
                        <input
                          type="number"
                          min="0"
                          step="any"
                          value={calculation.areaOfStandard || ""}
                          onChange={(e) =>
                            onFieldChange(
                              calculation.id,
                              "areaOfStandard",
                              e.target.value,
                            )
                          }
                          onKeyDown={(e) => {
                            if (e.key === "ArrowUp" || e.key === "ArrowDown")
                              e.preventDefault();
                          }}
                          onWheel={(e) => e.currentTarget.blur()}
                          placeholder="Enter area/absorbance"
                          className="w-full px-3 py-2 border border-emerald-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-emerald-400"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-gray-700 mb-1 block">
                          Purity %
                        </label>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          step="0.01"
                          value={calculation.purity || ""}
                          onChange={(e) =>
                            onFieldChange(
                              calculation.id,
                              "purity",
                              e.target.value,
                            )
                          }
                          onKeyDown={(e) => {
                            if (e.key === "ArrowUp" || e.key === "ArrowDown")
                              e.preventDefault();
                          }}
                          onWheel={(e) => e.currentTarget.blur()}
                          placeholder="Purity"
                          className="w-full px-3 py-2 border border-emerald-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-emerald-400"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-gray-700 mb-1 block">
                          MW Base
                        </label>
                        <input
                          type="number"
                          min="0"
                          step="any"
                          value={calculation.mWBase || ""}
                          onChange={(e) =>
                            onFieldChange(
                              calculation.id,
                              "mWBase",
                              e.target.value,
                            )
                          }
                          onKeyDown={(e) => {
                            if (e.key === "ArrowUp" || e.key === "ArrowDown")
                              e.preventDefault();
                          }}
                          onWheel={(e) => e.currentTarget.blur()}
                          placeholder="MW Base"
                          className="w-full px-3 py-2 border border-emerald-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-emerald-400"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-gray-700 mb-1 block">
                          MW Salt
                        </label>
                        <input
                          type="number"
                          min="0"
                          step="any"
                          value={calculation.mWSalt || ""}
                          onChange={(e) =>
                            onFieldChange(
                              calculation.id,
                              "mWSalt",
                              e.target.value,
                            )
                          }
                          onKeyDown={(e) => {
                            if (e.key === "ArrowUp" || e.key === "ArrowDown")
                              e.preventDefault();
                          }}
                          onWheel={(e) => e.currentTarget.blur()}
                          placeholder="MW Salt"
                          className="w-full px-3 py-2 border border-emerald-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-emerald-400"
                        />
                      </div>
                    </div>

                    {/* ── Per-time-point data entry ── */}
                    <div className="space-y-3">
                      <h6 className="text-xs font-bold text-emerald-800 uppercase tracking-wide border-b border-emerald-100 pb-1">
                        Time Point Data ({numberOfPoints} time points)
                      </h6>

                      {Array.from({ length: numberOfPoints }, (_, i) => {
                        const tpNum = i + 1;
                        return (
                          <div
                            key={tpNum}
                            className="border-2 border-emerald-200 rounded-lg overflow-hidden"
                          >
                            {/* Time point header */}
                            <div className="bg-emerald-50 border-b border-emerald-200 px-3 py-2.5 flex items-center gap-3">
                              <span className="text-xs font-bold text-white bg-emerald-600 rounded px-2 py-0.5 min-w-[32px] text-center">
                                Time Point {tpNum}
                              </span>
                              <input
                                type="text"
                                value={
                                  (calculation[
                                    tpDetailField(tpNum)
                                  ] as string) || ""
                                }
                                onChange={(e) =>
                                  onFieldChange(
                                    calculation.id,
                                    tpDetailField(tpNum),
                                    e.target.value,
                                  )
                                }
                                placeholder={`Time Point Detail (hr)`}
                                className="flex-1 px-2 py-1.5 border border-emerald-300 rounded-md text-xs focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-white"
                              />
                            </div>

                            {/* 6 sample area inputs */}
                            <div className="p-3 bg-white">
                              <p className="text-xs text-gray-500 font-medium mb-2">
                                Area / ABS of Samples
                              </p>
                              <div className="grid grid-cols-3 gap-2">
                                {[1, 2, 3, 4, 5, 6].map((s) => (
                                  <div key={s} className="flex flex-col gap-1">
                                    <input
                                      type="number"
                                      min="0"
                                      step="any"
                                      value={
                                        (calculation[
                                          tpSampleField(tpNum, s)
                                        ] as string) || ""
                                      }
                                      onChange={(e) =>
                                        onFieldChange(
                                          calculation.id,
                                          tpSampleField(tpNum, s),
                                          e.target.value,
                                        )
                                      }
                                      onKeyDown={(e) => {
                                        if (
                                          e.key === "ArrowUp" ||
                                          e.key === "ArrowDown"
                                        )
                                          e.preventDefault();
                                      }}
                                      onWheel={(e) => e.currentTarget.blur()}
                                      placeholder={`Area of Sample ${s}`}
                                      className="w-full px-1 py-2 border border-emerald-300 rounded-lg text-xs text-center focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-emerald-50"
                                    />
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <FormulaDisplay />

                    {/* Acceptance Limits — per time point */}
                    <div className="bg-gradient-to-r from-emerald-50 to-slate-50 rounded-lg p-4 border-2 border-emerald-200">
                      <h5 className="text-sm font-bold text-gray-700 mb-3">
                        Acceptance Limit for
                      </h5>
                      <div className="space-y-2">
                        {Array.from({ length: numberOfPoints }, (_, i) => {
                          const tpNum = i + 1;
                          const tpLabel =
                            (calculation[tpDetailField(tpNum)] as string) ||
                            `Time Point ${tpNum}`;
                          const minField = `acceptanceLimitMin${tpNum}` as keyof CalculationDissoProfile;
                          const maxField = `acceptanceLimitMax${tpNum}` as keyof CalculationDissoProfile;
                          return (
                            <div key={tpNum} className="flex items-center gap-3">
                              <span className="text-xs font-bold text-emerald-800 w-28 shrink-0 truncate" title={tpLabel}>
                                Time Point {tpLabel}
                              </span>
                              <div className="flex items-center gap-2 flex-1">
                                <input
                                  type="number"
                                  min="0"
                                  step="any"
                                  value={(calculation[minField] as string) ?? ""}
                                  onChange={(e) =>
                                    onFieldChange(
                                      calculation.id,
                                      minField,
                                      e.target.value === "" ? null : e.target.value,
                                    )
                                  }
                                  onKeyDown={(e) => {
                                    if (e.key === "ArrowUp" || e.key === "ArrowDown")
                                      e.preventDefault();
                                  }}
                                  onWheel={(e) => e.currentTarget.blur()}
                                  placeholder="Min %"
                                  className="w-full px-2 py-1.5 bg-white border border-emerald-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-emerald-400"
                                />
                                <span className="text-xs font-semibold text-gray-500 shrink-0">to</span>
                                <input
                                  type="number"
                                  min="0"
                                  step="any"
                                  value={(calculation[maxField] as string) ?? ""}
                                  onChange={(e) =>
                                    onFieldChange(
                                      calculation.id,
                                      maxField,
                                      e.target.value === "" ? null : e.target.value,
                                    )
                                  }
                                  onKeyDown={(e) => {
                                    if (e.key === "ArrowUp" || e.key === "ArrowDown")
                                      e.preventDefault();
                                  }}
                                  onWheel={(e) => e.currentTarget.blur()}
                                  placeholder="Max %"
                                  className="w-full px-2 py-1.5 bg-white border border-emerald-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-emerald-400"
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="flex justify-center pt-2">
                      <motion.button
                        onClick={performCalculation}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-semibold rounded-lg hover:from-emerald-700 hover:to-emerald-800 transition-all shadow-md hover:shadow-lg text-sm"
                      >
                        <Calculator className="w-4 h-4" />
                        Calculate Profile
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

                {timePointResults.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="border-t-4 border-emerald-200 p-6 bg-gradient-to-br from-emerald-50 via-slate-100/30 to-slate-50"
                  >
                    <div className="max-w-full mx-auto space-y-6">
                      <div className="flex items-center gap-3 pb-3">
                        <CheckCircle2 className="w-6 h-6 text-emerald-700" />
                        <h6 className="text-lg font-bold text-emerald-700">
                          Dissolution Profile Results
                        </h6>
                      </div>

                      {timePointResults.map((tpResult) => {
                        const hasCorrection = tpResult.timePoint > 1;
                        const tp = tpResult.timePoint;
                        const rawMin = (calculation[`acceptanceLimitMin${tp}` as keyof CalculationDissoProfile] as string | null);
                        const rawMax = (calculation[`acceptanceLimitMax${tp}` as keyof CalculationDissoProfile] as string | null);
                        const limitMin = rawMin != null && rawMin !== "" ? parseFloat(rawMin) : null;
                        const limitMax = rawMax != null && rawMax !== "" ? parseFloat(rawMax) : null;
                        const hasMin = limitMin !== null && !isNaN(limitMin);
                        const hasMax = limitMax !== null && !isNaN(limitMax);
                        const showPassFail = hasMin || hasMax;
                        const statColSpan = hasCorrection
                          ? (showPassFail ? 5 : 4)
                          : (showPassFail ? 3 : 2);

                        return (
                          <div
                            key={tpResult.timePoint}
                            className="bg-white rounded-lg shadow-lg border-2 border-emerald-300 overflow-hidden"
                          >
                            {/* Table title bar */}
                            <div className="bg-gradient-to-r from-emerald-700 via-emerald-800 to-slate-900 px-4 py-2 flex items-center justify-between">
                              <h6 className="text-sm font-bold text-white">
                                Time Point {tpResult.timePoint}
                              </h6>
                              <span className="text-xs text-emerald-100 font-medium">
                                V8 = {tpResult.v8.toFixedNoRound(4).toFixed(3)} ml
                              </span>
                            </div>

                            <div className="overflow-x-auto">
                              <table className="w-full text-xs">
                                <thead>
                                  <tr className="bg-emerald-100">
                                    <th className="px-3 py-2 text-center font-bold text-emerald-900 border-r border-emerald-200">
                                      Tablet
                                    </th>
                                    <th className="px-3 py-2 text-center font-bold text-emerald-900 border-r border-emerald-200">
                                      Result (% of LC)
                                    </th>
                                    {hasCorrection && (
                                      <>
                                        <th className="px-3 py-2 text-center font-bold text-emerald-900 border-r border-emerald-200">
                                          CF
                                        </th>
                                        <th className="px-3 py-2 text-center font-bold text-emerald-900 border-r border-emerald-200">
                                          Corrected Result (% of LC)
                                        </th>
                                      </>
                                    )}
                                    {showPassFail && (
                                      <th className="px-3 py-2 text-center font-bold text-emerald-900">
                                        Pass/Fail
                                      </th>
                                    )}
                                  </tr>
                                </thead>
                                <tbody>
                                  {tpResult.sampleResults.map((sr, idx) => {
                                    const valueToCheck = hasCorrection && sr.resultAfterCorrection !== undefined
                                      ? sr.resultAfterCorrection
                                      : sr.result;
                                    const aboveMin = hasMin ? valueToCheck >= limitMin! : true;
                                    const belowMax = hasMax ? valueToCheck <= limitMax! : true;
                                    const pass = showPassFail && aboveMin && belowMax;
                                    return (
                                      <tr
                                        key={sr.sampleNumber}
                                        className={
                                          idx % 2 === 0
                                            ? "bg-white"
                                            : "bg-emerald-50/30"
                                        }
                                      >
                                        <td className="px-3 py-2.5 text-center font-semibold text-gray-800 border-r border-gray-200">
                                          Tablet {sr.sampleNumber}
                                        </td>
                                        <td className="px-3 py-2.5 text-center font-bold text-gray-800 border-r border-gray-200">
                                          {sr.result.toFixedNoRound(4).toFixed(3)}
                                        </td>
                                        {hasCorrection && (
                                          <>
                                            <td className="px-3 py-2.5 text-center border-r border-gray-200">
                                              <span className="font-medium text-emerald-700">
                                                {sr.correctionFactor !== undefined
                                                  ? sr.correctionFactor.toFixedNoRound(4).toFixed(3)
                                                  : "—"}
                                              </span>
                                            </td>
                                            <td className="px-3 py-2.5 text-center border-r border-gray-200">
                                              <span className="font-bold text-emerald-800">
                                                {sr.resultAfterCorrection !== undefined
                                                  ? sr.resultAfterCorrection.toFixedNoRound(4).toFixed(3)
                                                  : "—"}
                                              </span>
                                            </td>
                                          </>
                                        )}
                                        {showPassFail && (
                                          <td className="px-3 py-2.5 text-center">
                                            <span className={`inline-block px-2 py-0.5 rounded-full font-bold ${pass ? "bg-green-100 text-green-800 border border-green-300" : "bg-red-100 text-red-800 border border-red-300"}`}>
                                              {pass ? "Pass" : "Fail"}
                                            </span>
                                          </td>
                                        )}
                                      </tr>
                                    );
                                  })}

                                  {tpResult.sampleResults.length > 0 && (
                                    <tr className="bg-emerald-100 border-t-2 border-emerald-300">
                                      <td
                                        colSpan={statColSpan}
                                        className="px-4 py-2.5"
                                      >
                                        <div className="flex items-center justify-around text-xs">
                                          <span className="text-gray-600">
                                            Min:{" "}
                                            <span className="font-bold text-gray-900">
                                              {tpResult.min.toFixedNoRound(4).toFixed(3)}
                                            </span>
                                          </span>
                                          <span className="text-gray-300 mx-1">
                                            |
                                          </span>
                                          <span className="text-gray-600">
                                            Avg:{" "}
                                            <span className="font-bold text-emerald-800">
                                              {tpResult.avg.toFixedNoRound(4).toFixed(3)}
                                            </span>
                                          </span>
                                          <span className="text-gray-300 mx-1">
                                            |
                                          </span>
                                          <span className="text-gray-600">
                                            Max:{" "}
                                            <span className="font-bold text-gray-900">
                                              {tpResult.max.toFixedNoRound(4).toFixed(3)}
                                            </span>
                                          </span>
                                        </div>
                                      </td>
                                    </tr>
                                  )}
                                </tbody>
                              </table>
                              {showPassFail && (
                                <div className="px-4 py-1.5 bg-emerald-50 border-t border-emerald-100">
                                  <p className="text-xs text-emerald-700 font-medium">
                                    Pass/Fail — Acceptance Range:{" "}
                                    {hasMin ? `≥ ${limitMin!.toFixed(1)}%` : ""}
                                    {hasMin && hasMax ? " – " : ""}
                                    {hasMax ? `≤ ${limitMax!.toFixed(1)}%` : ""}
                                    {hasCorrection ? " (applied to Corrected Result)" : ""}
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}

                      {/* Preparation info footer */}
                      <div className="bg-white/80 backdrop-blur-sm rounded-lg border border-gray-200 p-4">
                        <div className="grid md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-gray-600 font-medium">
                              Standard Preparation
                            </p>
                            <p className="text-gray-900 font-semibold">
                              {calculation.selectedStandardPreparationLabel ||
                                "N/A"}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-600 font-medium">
                              Sample Preparation
                            </p>
                            <p className="text-gray-900 font-semibold">
                              {calculation.selectedSamplePreparationLabel ||
                                "N/A"}
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

export default CalculationDetailDissoProfile;