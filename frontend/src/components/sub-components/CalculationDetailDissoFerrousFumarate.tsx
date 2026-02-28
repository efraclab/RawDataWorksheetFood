import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  Calculator,
  Trash,
  CheckCircle2,
  XCircle,
  FlaskConical,
} from "lucide-react";
import type { CalculationDissoFerrousFumarate } from "../../preparation_models/CalculationDissoFerrousFumarate";
import type { SamplePreparationTitration } from "../../preparation_models/SamplePreparationTitration";
import CustomDropdown from "../shared/CustomDropdown";

interface CalculationDetailDissoFerrousFumarateProps {
  calculation: CalculationDissoFerrousFumarate;
  samplePreparations: SamplePreparationTitration[];
  onFieldChange: (
    calculationId: number,
    field: keyof CalculationDissoFerrousFumarate,
    value: string | null,
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

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

const isPositiveNum = (v: string | null | undefined): boolean => {
  if (!v || v.trim() === "") return false;
  const n = parseFloat(v);
  return !isNaN(n) && n > 0;
};

const safeNum = (v: string | null | undefined, fallback = 1): number => {
  if (!v || v.trim() === "") return fallback;
  const n = parseFloat(v);
  return isNaN(n) ? fallback : n;
};

const FACTOR_UNIT_OPTIONS = [
  { value: "g",   label: "g"   },
  { value: "mg",  label: "mg"  },
  { value: "mcg", label: "mcg" },
];

/** Convert factor value to mg based on its unit. Falls back to 1 mg if empty. */
const factorToMg = (value: string | null | undefined, unit: string | null | undefined): number => {
  const v = safeNum(value); // already defaults to 1 if empty
  const u = unit || "g";
  switch (u.toLowerCase()) {
    case "g":   return v * 1000;
    case "mg":  return v;
    case "mcg": return v / 1000;
    default:    return v * 1000;
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────

const CalculationDetailDissoFerrousFumarate: React.FC<
  CalculationDetailDissoFerrousFumarateProps
> = ({ calculation, samplePreparations, onFieldChange, onRemove }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [validationResult, setValidationResult] = useState<ValidationResult>({
    isValid: false,
    errors: [],
    warnings: [],
  });
  const [tabletResults, setTabletResults] = useState<TabletResult[]>([]);
  const [summaryResults, setSummaryResults] = useState<SummaryResults | null>(null);

  // ── Linked preparation ────────────────────────────────────────────────────
  const selectedSamplePrep = samplePreparations.find(
    (p) => p.label === calculation.selectedSamplePreparationLabel,
  );

  /**
   * Pull derived values from the linked SamplePreparationTitration:
   *   ST  (Sample Taken)       = 1st Dilution  → value1 / unit1
   *   DMV (Disso Media Volume) = Tablet Details → value2 / unit2
   *   LC  (Label Claim)        = Tablet Details → value1 / unit1
   */
  const getFromPrep = () => {
    if (!selectedSamplePrep) {
      return {
        sampleTakenValue: "", sampleTakenUnit: "ml",
        dissoMediaVolume: "", dissoMediaVolumeUnit: "ml",
        labelClaim: "", labelClaimUnit: "mg",
      };
    }
    const dilStep    = selectedSamplePrep.steps.find((s) => s.name === "1st Dilution");
    const tabletStep = selectedSamplePrep.steps.find((s) => s.name === "Tablet Details");
    return {
      sampleTakenValue:     dilStep?.value1    || "",
      sampleTakenUnit:      dilStep?.unit1     || "ml",
      dissoMediaVolume:     tabletStep?.value2 || "",
      dissoMediaVolumeUnit: tabletStep?.unit2  || "ml",
      labelClaim:           tabletStep?.value1 || "",
      labelClaimUnit:       tabletStep?.unit1  || "mg",
    };
  };

  const prepValues = getFromPrep();

  // ── Restore existing per-tablet results on mount ──────────────────────────
  useEffect(() => {
    const storedFields = [
      { num: 1, value: calculation.calculationResultTablet1 },
      { num: 2, value: calculation.calculationResultTablet2 },
      { num: 3, value: calculation.calculationResultTablet3 },
      { num: 4, value: calculation.calculationResultTablet4 },
      { num: 5, value: calculation.calculationResultTablet5 },
      { num: 6, value: calculation.calculationResultTablet6 },
    ];
    const existingResults: TabletResult[] = [];
    storedFields.forEach(({ num, value }) => {
      if (value !== null && value !== undefined && String(value).trim() !== "") {
        const n = Number(value);
        existingResults.push({
          tabletNumber: num,
          result: isNaN(n) ? String(value) : n,
          unit: calculation.calculationResultUnit || "% of LC",
        });
      }
    });
    if (existingResults.length > 0) {
      setTabletResults(existingResults);
      const validNums = existingResults
        .filter((r) => typeof r.result === "number")
        .map((r) => r.result as number);
      if (validNums.length > 0) {
        const min = Math.min(...validNums).toFixedNoRound(4);
        const max = Math.max(...validNums).toFixedNoRound(4);
        const avg = (validNums.reduce((a, b) => a + b, 0) / validNums.length).toFixedNoRound(4);
        setSummaryResults({
          min: parseFloat(min.toFixed(3)),
          max: parseFloat(max.toFixed(3)),
          avg: parseFloat(avg.toFixed(3)),
          unit: calculation.calculationResultUnit || "% of LC",
        });
      }
    }
  }, [calculation.id]);

  // ── Validation — only for Sample Preparation fields ───────────────────────
  const validate = (): ValidationResult => {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!selectedSamplePrep) {
      errors.push("Please select a Sample Preparation");
      return { isValid: false, errors, warnings };
    }

    // ST from 1st Dilution
    const dilStep = selectedSamplePrep.steps.find((s) => s.name === "1st Dilution");
    if (!dilStep || !isPositiveNum(dilStep.value1)) {
      errors.push("Sample Preparation — 1st Dilution: Volume (sample taken) must be > 0");
    }

    // DMV & LC from Tablet Details
    const tabletStep = selectedSamplePrep.steps.find((s) => s.name === "Tablet Details");
    if (!tabletStep) {
      errors.push("Sample Preparation — Tablet Details step is missing");
    } else {
      if (!isPositiveNum(tabletStep.value1))
        errors.push("Sample Preparation — Tablet Details: Label Claim must be > 0");
      if (!isPositiveNum(tabletStep.value2))
        errors.push("Sample Preparation — Tablet Details: Disso Media Volume must be > 0");
    }

    return { isValid: errors.length === 0, errors, warnings };
  };

  useEffect(() => {
    setValidationResult(validate());
  }, [
    calculation.selectedSamplePreparationLabel,
    selectedSamplePrep,
  ]);

  // ── Field arrays ──────────────────────────────────────────────────────────
  const buretteFields: Array<keyof CalculationDissoFerrousFumarate> = [
    "buretteReading1", "buretteReading2", "buretteReading3",
    "buretteReading4", "buretteReading5", "buretteReading6",
  ];
  const resultFields: Array<keyof CalculationDissoFerrousFumarate> = [
    "calculationResultTablet1", "calculationResultTablet2", "calculationResultTablet3",
    "calculationResultTablet4", "calculationResultTablet5", "calculationResultTablet6",
  ];

  const getBuretteValue = (index: number): string => {
    const vals = [
      calculation.buretteReading1, calculation.buretteReading2,
      calculation.buretteReading3, calculation.buretteReading4,
      calculation.buretteReading5, calculation.buretteReading6,
    ];
    return vals[index] || "";
  };

  // ── Formula display ────────────────────────────────────────────────────────
  const FormulaDisplay: React.FC = () => {
    if (!selectedSamplePrep) return null;

    const dmv   = isPositiveNum(prepValues.dissoMediaVolume)      ? prepValues.dissoMediaVolume      : "DMV";
    const am    = isPositiveNum(calculation.actualMolarity)        ? calculation.actualMolarity        : "AM";
    const tm    = isPositiveNum(calculation.theoreticalMolarity)   ? calculation.theoreticalMolarity   : "TM";
    const facMg = isPositiveNum(calculation.factor)
      ? factorToMg(calculation.factor, calculation.factorUnit).toString()
      : "F(mg)";
    const st = isPositiveNum(prepValues.sampleTakenValue) ? prepValues.sampleTakenValue : "ST";
    const lc = isPositiveNum(prepValues.labelClaim)       ? prepValues.labelClaim       : "LC";

    const buretteVals = [
      calculation.buretteReading1, calculation.buretteReading2,
      calculation.buretteReading3, calculation.buretteReading4,
      calculation.buretteReading5, calculation.buretteReading6,
    ];

    return (
      <div className="bg-white rounded-lg p-4 border-2 border-emerald-200 shadow-sm mt-4">
        <h4 className="text-sm font-bold text-gray-900 mb-3">
          Formula — Dissolution (Ferrous Fumarate)
        </h4>

        {/* Symbolic master formula */}
        <div className="bg-gray-50 rounded p-3 mb-1">
          <div className="flex flex-col items-center">
            <div className="text-center border-b-2 border-black pb-2 mb-2 px-2 w-full">
              <p className="text-xs font-mono text-black">BR × DMV × AM × F(mg) × 100</p>
            </div>
            <div className="text-center px-2 w-full">
              <p className="text-xs font-mono text-black">100 × ST × LC × TM</p>
            </div>
          </div>
        </div>
        <p className="text-xs text-right text-gray-500 mb-5">= % of LC</p>

        {/* Per-tablet derivation rows */}
        <div className="space-y-3">
          {buretteVals.map((br_val, idx) => {
            const brDisplay = br_val && br_val.trim() !== "" ? br_val : `BR${idx + 1}`;
            return (
              <div key={idx} className="bg-emerald-50 rounded p-3 border border-emerald-300">
                <div className="flex items-start gap-2">
                  <span className="text-xs font-bold text-emerald-700 min-w-[70px] pt-0.5">
                    Tablet {idx + 1}:
                  </span>
                  <div className="flex items-center gap-2 flex-1">
                    <span className="text-sm font-bold text-black">=</span>
                    <div className="flex-1 flex flex-col items-center">
                      <div className="text-center border-b-2 border-black pb-2 mb-2 px-2 w-full">
                        <p className="text-xs font-mono text-black break-words">
                          {brDisplay} × {dmv} × {am} × {facMg} × 100
                        </p>
                      </div>
                      <div className="text-center px-2 w-full">
                        <p className="text-xs font-mono text-black break-words">
                          {st} × {lc} × {tm}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <p className="text-xs text-right text-gray-600 mt-2 font-semibold">% of LC</p>
      </div>
    );
  };

  // ── Core calculation per tablet (use 1 for empty/null inputs) ─────────────
  const calculateSingleTablet = (buretteReading: string): number | string => {
    const BR   = safeNum(buretteReading);
    const DMV  = safeNum(prepValues.dissoMediaVolume);
    const AM   = safeNum(calculation.actualMolarity);
    const F_mg = factorToMg(calculation.factor, calculation.factorUnit);
    const ST   = safeNum(prepValues.sampleTakenValue);
    const LC   = safeNum(prepValues.labelClaim);
    const TM   = safeNum(calculation.theoreticalMolarity);

    const denominator = ST * LC * TM;
    if (denominator === 0) return "Error: Division by zero";

    const result = (BR * DMV * AM * F_mg * 100) / denominator;
    if (isNaN(result) || !isFinite(result)) return "Error: Invalid calculation";

    return result.toFixedNoRound(4);
  };

  // ── Perform calculation ───────────────────────────────────────────────────
  const performCalculation = () => {
    // Only validate the sample preparation
    const currentValidation = validate();
    setValidationResult(currentValidation);

    if (!currentValidation.isValid) {
      setTabletResults([]);
      setSummaryResults(null);
      onFieldChange(calculation.id, "calculationResult", null);
      onFieldChange(calculation.id, "calculationResultUnit", null);
      return;
    }

    onFieldChange(calculation.id, "sampleTaken", prepValues.sampleTakenValue || null);

    const buretteVals = [
      calculation.buretteReading1, calculation.buretteReading2,
      calculation.buretteReading3, calculation.buretteReading4,
      calculation.buretteReading5, calculation.buretteReading6,
    ];

    const results: TabletResult[] = [];
    const validNums: number[] = [];

    buretteVals.forEach((br_val, index) => {
      if (br_val && br_val.trim() !== "") {
        const result = calculateSingleTablet(br_val);
        if (typeof result === "number") {
          results.push({ tabletNumber: index + 1, result, unit: "% of LC" });
          validNums.push(result);
          const truncated = result.toFixedNoRound(4);
          onFieldChange(calculation.id, resultFields[index], parseFloat(truncated.toFixed(3)).toString());
        } else {
          results.push({ tabletNumber: index + 1, result, unit: "% of LC" });
          onFieldChange(calculation.id, resultFields[index], result);
        }
      } else {
        onFieldChange(calculation.id, resultFields[index], null);
      }
    });

    setTabletResults(results);

    if (validNums.length > 0) {
      const min = Math.min(...validNums).toFixedNoRound(4);
      const max = Math.max(...validNums).toFixedNoRound(4);
      const avg = (validNums.reduce((a, b) => a + b, 0) / validNums.length).toFixedNoRound(4);
      const summary: SummaryResults = {
        min: parseFloat(min.toFixed(3)),
        max: parseFloat(max.toFixed(3)),
        avg: parseFloat(avg.toFixed(3)),
        unit: "% of LC",
      };
      setSummaryResults(summary);
      onFieldChange(calculation.id, "calculationResult", `Min: ${summary.min}, Max: ${summary.max}, Avg: ${summary.avg}`);
      onFieldChange(calculation.id, "calculationResultUnit", "% of LC");
    } else {
      setSummaryResults(null);
      onFieldChange(calculation.id, "calculationResult", null);
      onFieldChange(calculation.id, "calculationResultUnit", null);
    }
  };

  // ─────────────────────────────────────────────────────────────────────────
  const hasResults = tabletResults.length > 0;

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white rounded-xl shadow-lg border-2 border-emerald-200 overflow-hidden mb-6"
    >
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div
        className={`relative bg-gradient-to-r from-emerald-600 via-emerald-500 to-emerald-500 ${
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
                <FlaskConical className="w-5 h-5 text-white" />
              </div>
            </motion.div>

            <div>
              <h4 className="text-sm font-semibold text-white tracking-wide">
                {calculation.label}
              </h4>
              <p className="text-xs text-emerald-100">
                Dissolution — Assay of Ferrous Fumarate (% of LC)
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
              onClick={(e) => { e.stopPropagation(); onRemove(); }}
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

      {/* ── Validation Banner (errors) ─────────────────────────────────────── */}
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

      {/* ── Validation Banner (valid) ──────────────────────────────────────── */}
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
                All required fields are valid — Ready to calculate
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* ── Body ───────────────────────────────────────────────────────────── */}
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

                {/* ── Sample Preparation selector ──────────────────────────── */}
                <div className="bg-gradient-to-r from-emerald-50 to-emerald-50 rounded-lg p-4 border-2 border-emerald-200">
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Select Sample Preparation
                  </label>
                  <CustomDropdown
                    options={samplePreparations.map((p) => ({ value: p.label, label: p.label }))}
                    value={calculation.selectedSamplePreparationLabel || ""}
                    onChange={(v) =>
                      onFieldChange(calculation.id, "selectedSamplePreparationLabel", v || null)
                    }
                    placeholder="Select sample preparation..."
                    colorScheme="emerald"
                  />
                </div>

                {/* ── When a prep is selected show the formula + inputs ─────── */}
                {selectedSamplePrep && (
                  <>
                    {/* Formula */}
                    <FormulaDisplay />

                    {/* ── Titration Parameters ──────────────────────────────── */}
                    <div className="bg-gradient-to-r from-emerald-50 to-emerald-50 rounded-lg p-4 border-2 border-emerald-200">
                      <h5 className="text-sm font-bold text-gray-700 mb-3">
                        Titration Parameters
                      </h5>
                      <div className="grid md:grid-cols-4 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-gray-600 mb-1">
                            Theoretical Molarity
                          </label>
                          <input
                            type="number"
                            value={calculation.theoreticalMolarity || ""}
                            onChange={(e) =>
                              onFieldChange(calculation.id, "theoreticalMolarity", e.target.value)
                            }
                            step="any"
                            onKeyDown={(e) => {
                              if (e.key === "ArrowUp" || e.key === "ArrowDown") e.preventDefault();
                            }}
                            onWheel={(e) => e.currentTarget.blur()}
                            placeholder="e.g. 0.1 (default: 1)"
                            className="w-full px-3 py-2 bg-white border border-emerald-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-emerald-50"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-600 mb-1">
                            Actual Molarity
                          </label>
                          <input
                            type="number"
                            value={calculation.actualMolarity || ""}
                            onChange={(e) =>
                              onFieldChange(calculation.id, "actualMolarity", e.target.value)
                            }
                            step="any"
                            onKeyDown={(e) => {
                              if (e.key === "ArrowUp" || e.key === "ArrowDown") e.preventDefault();
                            }}
                            onWheel={(e) => e.currentTarget.blur()}
                            placeholder="e.g. 0.0998 (default: 1)"
                            className="w-full px-3 py-2 bg-white border border-emerald-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-emerald-50"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-600 mb-1">
                            Factor
                          </label>
                          <div className="flex gap-2">
                            <input
                              type="number"
                              value={calculation.factor || ""}
                              onChange={(e) =>
                                onFieldChange(calculation.id, "factor", e.target.value)
                              }
                              step="any"
                              onKeyDown={(e) => {
                                if (e.key === "ArrowUp" || e.key === "ArrowDown") e.preventDefault();
                              }}
                              onWheel={(e) => e.currentTarget.blur()}
                              placeholder="e.g. 0.036"
                              className="max-w-30 flex-1 px-3 py-2 bg-white border border-emerald-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-emerald-50"
                            />
                            <div className="w-20 shrink-0">
                              <CustomDropdown
                                options={FACTOR_UNIT_OPTIONS}
                                value={calculation.factorUnit || "g"}
                                onChange={(v) =>
                                  onFieldChange(calculation.id, "factorUnit", v || "g")
                                }
                                placeholder="Unit"
                                colorScheme="emerald"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* ── Burette Readings ──────────────────────────────────── */}
                    <div className="bg-gradient-to-r from-emerald-50 to-emerald-50 rounded-lg p-4 border-2 border-emerald-200">
                      <h5 className="text-sm font-bold text-gray-700 mb-3">
                        Burette Readings (ml) — per Tablet
                      </h5>
                      <div className="grid grid-cols-3 gap-2">
                        {buretteFields.map((field, idx) => (
                          <div key={idx}>
                            <label className="block text-xs font-semibold text-gray-600 mb-1">
                              Tablet {idx + 1}
                            </label>
                            <input
                              type="number"
                              value={getBuretteValue(idx)}
                              onChange={(e) =>
                                onFieldChange(calculation.id, field, e.target.value)
                              }
                              step="any"
                              onKeyDown={(e) => {
                                if (e.key === "ArrowUp" || e.key === "ArrowDown") e.preventDefault();
                              }}
                              onWheel={(e) => e.currentTarget.blur()}
                              placeholder={`T${idx + 1}`}
                              className="w-full px-2 py-2 bg-white border border-emerald-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-emerald-50"
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* ── Acceptance Criterion ──────────────────────────────── */}
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

                    {/* ── Calculate button ──────────────────────────────────── */}
                    <div className="flex justify-center pt-2">
                      <motion.button
                        onClick={performCalculation}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-600 text-white font-semibold rounded-lg hover:from-emerald-700 hover:to-emerald-700 transition-all shadow-md hover:shadow-lg text-sm"
                      >
                        <Calculator className="w-4 h-4" />
                        Calculate Results
                      </motion.button>
                    </div>
                  </>
                )}

                {/* Prompt when no prep selected */}
                {!selectedSamplePrep && (
                  <div className="bg-emerald-50 border-2 border-emerald-300 rounded-lg p-3 text-center">
                    <p className="text-xs text-emerald-800 font-medium">
                      Please select a Sample Preparation to enable calculation
                    </p>
                  </div>
                )}
              </div>

              {/* ── Results Panel ─────────────────────────────────────────────── */}
              {hasResults && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="border-t-4 border-emerald-200 p-6 bg-gradient-to-br from-emerald-50 via-emerald-100/30 to-emerald-50"
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

                    {/* Individual Tablet Results */}
                    <div className="bg-white rounded-lg shadow-lg border-2 border-emerald-300 overflow-hidden">
                      <div className="bg-gradient-to-r from-emerald-600 to-emerald-600 px-4 py-2">
                        <h6 className="text-sm font-bold text-white">
                          Individual Tablet Results
                        </h6>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="bg-emerald-100">
                              <th className="px-4 py-3 text-left text-sm font-bold text-emerald-900 border-r border-emerald-200 w-32" />
                              {tabletResults.map((r) => (
                                <th
                                  key={r.tabletNumber}
                                  className="px-4 py-3 text-center text-xs font-bold text-emerald-900 border-r border-emerald-200 last:border-r-0"
                                >
                                  Tablet {r.tabletNumber}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            <tr className="bg-white">
                              <td className="px-4 py-4 text-xs font-semibold text-gray-500 border-r border-gray-200">
                                Result
                              </td>
                              {tabletResults.map((r) => (
                                <td
                                  key={r.tabletNumber}
                                  className="px-4 py-4 text-center border-r border-gray-200 last:border-r-0"
                                >
                                  <div className="text-lg font-bold text-gray-800">
                                    {typeof r.result === "number"
                                      ? r.result.toFixedNoRound(4).toFixed(3)
                                      : r.result}
                                  </div>
                                  {typeof r.result === "number" && (
                                    <div className="text-xs text-gray-600 mt-1">{r.unit}</div>
                                  )}
                                </td>
                              ))}
                            </tr>

                            {/* Pass/Fail row — shown only when acceptance limit is set */}
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
                                  {tabletResults.map((r) => {
                                    const val = typeof r.result === "number" ? r.result : null;
                                    const pass = val !== null &&
                                      (hasMin ? val >= limitMin! : true) &&
                                      (hasMax ? val <= limitMax! : true);
                                    return (
                                      <td
                                        key={r.tabletNumber}
                                        className="px-4 py-3 text-center border-r border-gray-200 last:border-r-0"
                                      >
                                        {val !== null ? (
                                          <span
                                            className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                                              pass
                                                ? "bg-green-100 text-green-800 border border-green-300"
                                                : "bg-red-100 text-red-800 border border-red-300"
                                            }`}
                                          >
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

                    {/* Summary Statistics */}
                    {summaryResults && (
                      <div className="bg-white rounded-lg shadow-lg border-2 border-emerald-300 overflow-hidden">
                        <div className="bg-gradient-to-r from-emerald-600 to-emerald-600 px-4 py-2">
                          <h6 className="text-sm font-bold text-white">Summary Statistics</h6>
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
                                  <div className="text-xs text-gray-600 mt-1">{summaryResults.unit}</div>
                                </td>
                                <td className="px-6 py-4 text-center border-r border-gray-200">
                                  <div className="text-xl font-bold text-emerald-800">
                                    {summaryResults.avg.toFixed(3)}
                                  </div>
                                  <div className="text-xs text-gray-600 mt-1">{summaryResults.unit}</div>
                                </td>
                                <td className="px-6 py-4 text-center">
                                  <div className="text-xl font-bold text-gray-800">
                                    {summaryResults.max.toFixed(3)}
                                  </div>
                                  <div className="text-xs text-gray-600 mt-1">{summaryResults.unit}</div>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}

                    {/* Preparation Info */}
                    <div className="bg-white/80 backdrop-blur-sm rounded-lg border border-gray-200 p-4">
                      <div className="grid md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600 font-medium">Sample Preparation</p>
                          <p className="text-gray-900 font-semibold">
                            {calculation.selectedSamplePreparationLabel ?? "N/A"}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600 font-medium">Sample Taken (ST)</p>
                          <p className="text-gray-900 font-semibold">
                            {prepValues.sampleTakenValue || "—"} {prepValues.sampleTakenUnit}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600 font-medium">Disso Media Volume (DMV)</p>
                          <p className="text-gray-900 font-semibold">
                            {prepValues.dissoMediaVolume || "—"} {prepValues.dissoMediaVolumeUnit}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600 font-medium">Label Claim (LC)</p>
                          <p className="text-gray-900 font-semibold">
                            {prepValues.labelClaim || "—"} {prepValues.labelClaimUnit}
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

export default CalculationDetailDissoFerrousFumarate;