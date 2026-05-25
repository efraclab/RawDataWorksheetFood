import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Calculator, Trash, CheckCircle2, AlertTriangle } from "lucide-react";
import type { CalculationLithosun300 } from "../../../preparation_models/metal/CalculationLithosun300";
import type { SamplePreparationMetal } from "../../../preparation_models/metal/SamplePreparationMetal";
import CustomDropdown from "../../shared/CustomDropdown";

interface Props {
  calculation: CalculationLithosun300;
  samplePreparations: SamplePreparationMetal[];
  onUpdate: (updated: CalculationLithosun300) => void;
  onRemove: () => void;
  isLocked?: boolean;
}

const concUnitOptions = [
  { value: "ppb", label: "ppb" },
  { value: "ppm", label: "ppm" },
  { value: "μg/L", label: "μg/L" },
  { value: "mg/L", label: "mg/L" },
];

const labelClaimUnitOptions = [
  { value: "mg", label: "mg" },
  { value: "g",  label: "g"  },
  { value: "kg", label: "kg" },
];

const RESULT_UNIT = "% of LC";

// Convert instrument concentration to ppm (mg/L)
const toCanonicalPpm = (value: number, unit: string): number => {
  if (!Number.isFinite(value)) return value;
  switch (unit) {
    case "ppm":
    case "mg/L":  return value;
    case "ppb":
    case "μg/L":  return value / 1000;
    default:      return value;
  }
};

// Convert label claim to mg
const toCanonicalMg = (value: number, unit: string): number => {
  if (!Number.isFinite(value)) return value;
  switch (unit) {
    case "g":  return value * 1000;
    case "kg": return value * 1_000_000;
    case "mg":
    default:   return value;
  }
};

/** Any volume unit → mL */
const toCanonicalML = (value: number, unit?: string | null): number => {
  if (!Number.isFinite(value)) return NaN;
  if (!unit) return value; // assume mL if missing
  switch (unit.trim().toLowerCase()) {
    case "ml": return value;
    case "l":  return value * 1000;
    case "µl":
    case "ul": return value / 1000;
    default:   return value;
  }
};

const fmt4 = (v: string | null | undefined): string => {
  if (v === null || v === undefined || v === "") return "—";
  const n = parseFloat(v);
  return Number.isFinite(n) ? n.toFixed(4) : v;
};

const fmtN = (n: number, decimals = 4): string =>
  Number.isFinite(n) ? n.toFixed(decimals) : "—";

// Lithosun 300 formula:
//   % of L.C. = (Sample_ppm - Blank_ppm) × V1[mL] × V3[mL] × 1000
//               ──────────────────────────────────────────────────────
//                      LC_mg × V2[mL] × CF × 10000
//
// All volume units normalised to mL before arithmetic.
const computeResult = (
  instSample: string, instSampleUnit: string,
  instBlank: string,  instBlankUnit: string,
  v1: string | null, v1Unit: string | null,
  v2: string | null, v2Unit: string | null,
  v3: string | null, v3Unit: string | null,
  conversionFactor: string,
  labelClaim: string, labelClaimUnit: string,
): string | null => {
  const sample = toCanonicalPpm(parseFloat(instSample), instSampleUnit);
  const blank  = toCanonicalPpm(parseFloat(instBlank),  instBlankUnit);
  if (!Number.isFinite(sample) || !Number.isFinite(blank)) return null;

  // V1, V2, V3 → mL (missing → ×1)
  const v1Ml = toCanonicalML(parseFloat(v1 ?? ""), v1Unit);
  const v1n  = Number.isFinite(v1Ml) ? v1Ml : 1;
  const v2Ml = toCanonicalML(parseFloat(v2 ?? ""), v2Unit);
  const v2n  = Number.isFinite(v2Ml) ? v2Ml : 1;
  const v3Ml = toCanonicalML(parseFloat(v3 ?? ""), v3Unit);
  const v3n  = Number.isFinite(v3Ml) ? v3Ml : 1;

  const cf  = parseFloat(conversionFactor);
  const lcN = toCanonicalMg(parseFloat(labelClaim), labelClaimUnit);

  if (!Number.isFinite(cf) || cf <= 0) return null;
  if (!Number.isFinite(lcN) || lcN <= 0) return null;

  const numerator   = (sample - blank) * v1n * v3n * 1000;
  const denominator = lcN * v2n * cf * 10000;
  if (denominator === 0) return null;

  const result = numerator / denominator;
  return Number.isFinite(result) ? result.toFixedNoRound(4).toFixed(3) : null;
};

const trimZeros = (n: number): string =>
  Number.isFinite(n) ? parseFloat(n.toFixed(4)).toString() : "—";

// Per-tablet sample concentration fields
const TABLET_SAMPLE_FIELDS: (keyof CalculationLithosun300)[] = [
  "instrumentConcentrationSampleTablet1",
  "instrumentConcentrationSampleTablet2",
  "instrumentConcentrationSampleTablet3",
  "instrumentConcentrationSampleTablet4",
  "instrumentConcentrationSampleTablet5",
  "instrumentConcentrationSampleTablet6",
];

// Result fields mapping
const TABLET_RESULT_FIELDS: (keyof CalculationLithosun300)[] = [
  "calculationResultTablet1",
  "calculationResultTablet2",
  "calculationResultTablet3",
  "calculationResultTablet4",
  "calculationResultTablet5",
  "calculationResultTablet6",
];

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

const CalculationDetailLithosun300: React.FC<Props> = ({
  calculation,
  samplePreparations,
  onUpdate,
  onRemove,
  isLocked = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [tabletResults, setTabletResults] = useState<TabletResult[]>([]);
  const [summaryResults, setSummaryResults] = useState<SummaryResults | null>(null);

  const selectedSamplePrep = samplePreparations.find(
    (prep) => prep.label === calculation.selectedSamplePreparationLabel,
  );

  // V1 = 1st Dilution value1 (dissolution vessel volume)
  // V2 = 2nd Dilution value1 (take volume)
  // V3 = 2nd Dilution value2 (make-up volume)
  const extractValues = (sp?: SamplePreparationMetal) => {
    if (!sp) return { v1: null, v1Unit: null, v2: null, v2Unit: null, v3: null, v3Unit: null };
    const stepsArr = Array.isArray(sp.steps) ? sp.steps : [];
    const d1 = stepsArr.find((s) => s.name === "1st Dilution");
    const d2 = stepsArr.find((s) => s.name === "2nd Dilution");
    return {
      v1: d1?.value1 ?? null, v1Unit: (d1 as any)?.unit1 ?? "mL",
      v2: d2?.value1 ?? null, v2Unit: (d2 as any)?.unit1 ?? "mL",
      v3: d2?.value2 ?? null, v3Unit: (d2 as any)?.unit2 ?? "mL",
    };
  };

  // Compute all 6 tablet results whenever inputs change
  useEffect(() => {
    const { v1: newV1, v1Unit: newV1Unit, v2: newV2, v2Unit: newV2Unit, v3: newV3, v3Unit: newV3Unit } = extractValues(selectedSamplePrep);

    // Compute each tablet using only its own sample concentration (no fallback)
    const perTabletResults: (string | null)[] = TABLET_SAMPLE_FIELDS.map((field) => {
      const tabletSample = calculation[field] as string | null;
      if (!tabletSample) return null;
      return computeResult(
        tabletSample,
        calculation.instrumentConcentrationSampleUnit,
        calculation.instrumentConcentrationBlank,
        calculation.instrumentConcentrationBlankUnit,
        newV1, newV1Unit, newV2, newV2Unit, newV3, newV3Unit,
        calculation.conversionFactor!,
        calculation.labelClaim!,
        calculation.labelClaimUnit!,
      );
    });

    const newLabel = calculation.label;

    const resultFieldUpdates: Partial<CalculationLithosun300> = {};
    TABLET_RESULT_FIELDS.forEach((field, idx) => {
      (resultFieldUpdates as any)[field] = perTabletResults[idx];
    });

    // Legacy single-result = Tablet 1 result (or null if no tablet 1)
    const newResult = perTabletResults[0] ?? null;

    onUpdate({
      ...calculation,
      v1: newV1, v2: newV2, v3: newV3,
      ...(newV1Unit ? { v1Unit: newV1Unit } : {}),
      ...(newV2Unit ? { v2Unit: newV2Unit } : {}),
      ...(newV3Unit ? { v3Unit: newV3Unit } : {}),
      calculationResult: newResult,
      calculationResultUnit: RESULT_UNIT,
      label: newLabel,
      ...resultFieldUpdates,
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    selectedSamplePrep,
    calculation.instrumentConcentrationSampleTablet1,
    calculation.instrumentConcentrationSampleTablet2,
    calculation.instrumentConcentrationSampleTablet3,
    calculation.instrumentConcentrationSampleTablet4,
    calculation.instrumentConcentrationSampleTablet5,
    calculation.instrumentConcentrationSampleTablet6,
    calculation.instrumentConcentrationSampleUnit,
    calculation.instrumentConcentrationBlank,
    calculation.instrumentConcentrationBlankUnit,
    calculation.conversionFactor,
    calculation.labelClaim,
    calculation.labelClaimUnit,
  ]);

  // Build tablet results for display
  useEffect(() => {
    const results: TabletResult[] = [];
    TABLET_RESULT_FIELDS.forEach((field, idx) => {
      const val = calculation[field] as string | null | undefined;
      if (val !== null && val !== undefined && String(val).trim() !== "") {
        const n = Number(val);
        results.push({
          tabletNumber: idx + 1,
          result: isNaN(n) ? String(val) : n,
          unit: RESULT_UNIT,
        });
      }
    });

    if (results.length > 0) {
      setTabletResults(results);
      const nums = results.filter((r) => typeof r.result === "number").map((r) => r.result as number);
      if (nums.length > 0) {
        const min = Math.min(...nums);
        const max = Math.max(...nums);
        const avg = nums.reduce((a, b) => a + b, 0) / nums.length;
        setSummaryResults({ min, max, avg, unit: RESULT_UNIT });
      }
    } else {
      setTabletResults([]);
      setSummaryResults(null);
    }
  }, [
    calculation.calculationResultTablet1,
    calculation.calculationResultTablet2,
    calculation.calculationResultTablet3,
    calculation.calculationResultTablet4,
    calculation.calculationResultTablet5,
    calculation.calculationResultTablet6,
  ]);

  const handleField = (field: keyof CalculationLithosun300, value: string | null) => {
    if (isLocked) return;
    onUpdate({ ...calculation, [field]: value });
  };

  // Effective values for formula display (all converted to mL / mg)
  const c300 = calculation as any;
  const v1Ml = toCanonicalML(parseFloat(calculation.v1 ?? ""), c300.v1Unit);
  const v2Ml = toCanonicalML(parseFloat(calculation.v2 ?? ""), c300.v2Unit);
  const v3Ml = toCanonicalML(parseFloat(calculation.v3 ?? ""), c300.v3Unit);
  const v1Eff = Number.isFinite(v1Ml) ? v1Ml : 1;
  const v2Eff = Number.isFinite(v2Ml) ? v2Ml : 1;
  const v3Eff = Number.isFinite(v3Ml) ? v3Ml : 1;
  const blankNum = toCanonicalPpm(parseFloat(calculation.instrumentConcentrationBlank), calculation.instrumentConcentrationBlankUnit);
  const cfNum    = parseFloat(calculation.conversionFactor!);
  const lcNum    = toCanonicalMg(parseFloat(calculation.labelClaim!), calculation.labelClaimUnit!);

  // Per-tablet sample ppm values (no fallback)
  const tabletSampleNums = TABLET_SAMPLE_FIELDS.map((field) => {
    const raw = calculation[field] as string | null;
    if (!raw) return NaN;
    return toCanonicalPpm(parseFloat(raw), calculation.instrumentConcentrationSampleUnit);
  });

  const missingFields: string[] = [];
  if (!TABLET_SAMPLE_FIELDS.some((f) => calculation[f])) {
    missingFields.push("Sample Concentration (at least one tablet)");
  }
  if (!calculation.instrumentConcentrationBlank) missingFields.push("Blank Concentration");
  if (!Number.isFinite(cfNum) || cfNum <= 0) missingFields.push("Conversion Factor");
  if (!Number.isFinite(lcNum) || lcNum <= 0) missingFields.push("Label Claim");

  const getPassFail = (val: number | null): "pass" | "fail" | null => {
    if (val === null || !Number.isFinite(val)) return null;
    const min = calculation.acceptanceLimitMin ? parseFloat(calculation.acceptanceLimitMin) : null;
    const max = calculation.acceptanceLimitMax ? parseFloat(calculation.acceptanceLimitMax) : null;
    if (min === null && max === null) return null;
    return (min === null || val >= min) && (max === null || val <= max) ? "pass" : "fail";
  };

  const limitMin = calculation.acceptanceLimitMin ? parseFloat(calculation.acceptanceLimitMin) : null;
  const limitMax = calculation.acceptanceLimitMax ? parseFloat(calculation.acceptanceLimitMax) : null;
  const hasLimits = (limitMin !== null && !isNaN(limitMin)) || (limitMax !== null && !isNaN(limitMax));

  // Determine which tablets have data entered (to show derivation rows)
  const activeTabletIndices = TABLET_SAMPLE_FIELDS
    .map((field, idx) => ({ field, idx }))
    .filter(({ field }) => {
      const v = calculation[field] as string | null;
      return v !== null && v !== "" && Number.isFinite(parseFloat(v ?? ""));
    });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white rounded-xl shadow-lg border-2 border-emerald-200 overflow-hidden mb-6"
    >
      {/* ── Header ── */}
      <div className={`relative bg-gradient-to-r from-emerald-700 via-emerald-800 to-slate-900 ${isExpanded ? "rounded-t-lg" : "rounded-lg"}`}>
        <div className="relative flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-4 flex-1 cursor-pointer select-none" onClick={() => setIsExpanded(!isExpanded)}>
            <motion.div animate={{ rotate: isExpanded ? 0 : 360 }} transition={{ duration: 0.5 }} className="relative group">
              <div className="absolute inset-0 bg-white/30 rounded-lg blur-md" />
              <div className="relative p-2 bg-white/20 rounded-lg backdrop-blur-md border border-white/30">
                <Calculator className="w-5 h-5 text-white" />
              </div>
            </motion.div>
            <div>
              <h4 className="text-sm font-semibold text-white tracking-wide">{calculation.label}</h4>
              <p className="text-xs text-emerald-100">Lithosun 300 Calculation</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <motion.button onClick={() => setIsExpanded(!isExpanded)} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} className="p-2 hover:bg-white/20 rounded-lg transition-colors">
              <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 0.3 }}>
                <ChevronDown className="w-5 h-5 text-white" />
              </motion.div>
            </motion.button>
            {!isLocked && (
              <motion.button
                onClick={(e) => { e.stopPropagation(); onRemove(); }}
                whileHover={{ scale: 1.1, rotate: 5 }} whileTap={{ scale: 0.9 }}
                className="p-2 bg-white/20 rounded-lg border border-white/30"
                title={`Remove ${calculation.label}`}
              >
                <Trash className="w-4 h-4 text-white" />
              </motion.button>
            )}
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
            transition={{ duration: 0.3 }}
          >
            <div className="p-6 bg-gradient-to-b from-gray-50 to-white space-y-6">

              {/* ── Symbolic Formula Header ── */}
              <div className="bg-white rounded-lg p-4 border-2 border-emerald-200 shadow-sm">
                <h4 className="text-sm font-bold text-gray-900 mb-3">Formula</h4>
                <div className="bg-gray-50 rounded p-3">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 flex flex-col items-center">
                      <div className="text-center border-b-2 border-black pb-2 mb-2 px-2 w-full">
                        <p className="text-xs font-mono text-black break-words">
                          (Sample − Blank) × V1 × V3 × 1000
                        </p>
                      </div>
                      <div className="text-center px-2 w-full">
                        <p className="text-xs font-mono text-black break-words">
                          Label Claim (mg) × V2 × Conversion Factor × 10000
                        </p>
                      </div>
                    </div>
                    <span className="text-sm font-bold text-black shrink-0">{RESULT_UNIT}</span>
                  </div>
                </div>
              </div>

              {/* ── Sample Preparation Selector ── */}
              <div className="bg-gradient-to-r from-emerald-50 to-slate-50 rounded-lg p-4 border-2 border-emerald-200">
                <label className="block text-sm font-bold text-gray-700 mb-2">Select Sample Preparation</label>
                <CustomDropdown
                  options={samplePreparations.map((p) => ({ value: p.label, label: p.label }))}
                  value={calculation.selectedSamplePreparationLabel || ""}
                  onChange={(v) => handleField("selectedSamplePreparationLabel", v)}
                  placeholder="Select sample preparation..."
                  colorScheme="emerald"
                />
              </div>

              {/* ── Blank Concentration ── */}
              <div className="bg-gradient-to-r from-emerald-50 to-slate-50 rounded-lg p-4 border-2 border-emerald-200">
                <h5 className="text-sm font-bold text-gray-700 mb-3">Instrument Concentration (Blank)</h5>
                <div className="flex gap-2">
                  <input
                    type="number" step="any"
                    value={calculation.instrumentConcentrationBlank}
                    readOnly={isLocked}
                    onChange={(e) => handleField("instrumentConcentrationBlank", e.target.value)}
                    onWheel={(e) => e.currentTarget.blur()}
                    placeholder="Enter value"
                    className={`flex-1 px-3 py-2 bg-white border rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-emerald-400 ${!calculation.instrumentConcentrationBlank ? "border-amber-400" : "border-emerald-300"}`}
                  />
                  <div className="w-24 shrink-0">
                    <CustomDropdown
                      options={concUnitOptions}
                      value={calculation.instrumentConcentrationBlankUnit}
                      onChange={(v) => handleField("instrumentConcentrationBlankUnit", v)}
                      placeholder="Unit"
                      colorScheme="emerald"
                    />
                  </div>
                </div>
                {!calculation.instrumentConcentrationBlank && (
                  <p className="text-[10px] text-amber-600 mt-1 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" /> Required for calculation
                  </p>
                )}
              </div>

              {/* ── Per-Tablet Sample Concentrations ── */}
              <div className="bg-gradient-to-r from-emerald-50 to-slate-50 rounded-lg p-4 border-2 border-emerald-200">
                <h5 className="text-sm font-bold text-gray-700 mb-1">Instrument Concentration (Sample) — Per Tablet</h5>
                <p className="text-[10px] text-gray-500 mb-3">Enter each tablet's instrument reading and select the unit.</p>

                {/* Unit selector (shared across all tablet sample values) */}
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-semibold text-gray-600 shrink-0">Unit</span>
                  <div className="w-28">
                    <CustomDropdown
                      options={concUnitOptions}
                      value={calculation.instrumentConcentrationSampleUnit}
                      onChange={(v) => handleField("instrumentConcentrationSampleUnit", v)}
                      placeholder="Unit"
                      colorScheme="emerald"
                    />
                  </div>
                </div>

                {/* 6 tablet fields in a 2-col / 3-col grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {TABLET_SAMPLE_FIELDS.map((field, idx) => (
                    <div key={field}>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">Tablet {idx + 1}</label>
                      <input
                        type="number" step="any"
                        value={(calculation[field] as string) || ""}
                        readOnly={isLocked}
                        onChange={(e) => handleField(field, e.target.value || null)}
                        onWheel={(e) => e.currentTarget.blur()}
                        placeholder="Value"
                        className="w-full px-3 py-2 bg-white border border-emerald-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-emerald-400"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* ── Conversion Factor & Label Claim ── */}
              <div className="bg-gradient-to-r from-emerald-50 to-slate-50 rounded-lg p-4 border-2 border-emerald-200">
                <h5 className="text-sm font-bold text-gray-700 mb-3">Conversion Factor &amp; Label Claim</h5>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="min-w-0">
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                      Conversion Factor
                    </label>
                    <input
                      type="number" step="any"
                      value={calculation.conversionFactor!}
                      readOnly={isLocked}
                      onChange={(e) => handleField("conversionFactor", e.target.value)}
                      onWheel={(e) => e.currentTarget.blur()}
                      placeholder="Enter value"
                      className={`w-full px-3 py-2 bg-white border rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-emerald-400 ${!calculation.conversionFactor ? "border-amber-400" : "border-emerald-300"}`}
                    />
                    {!calculation.conversionFactor && (
                      <p className="text-[10px] text-amber-600 mt-1 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" /> Required for calculation
                      </p>
                    )}
                  </div>
                  <div className="min-w-0">
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">Label Claim</label>
                    <div className="flex gap-2">
                      <input
                        type="number" step="any"
                        value={calculation.labelClaim!}
                        readOnly={isLocked}
                        onChange={(e) => handleField("labelClaim", e.target.value)}
                        onWheel={(e) => e.currentTarget.blur()}
                        placeholder="Enter value"
                        className={`flex-1 min-w-0 px-3 py-2 bg-white border rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-emerald-400 ${!calculation.labelClaim ? "border-amber-400" : "border-emerald-300"}`}
                      />
                      <div className="w-20 shrink-0">
                        <CustomDropdown
                          options={labelClaimUnitOptions}
                          value={calculation.labelClaimUnit}
                          onChange={(v) => handleField("labelClaimUnit", v)}
                          placeholder="Unit"
                          colorScheme="emerald"
                        />
                      </div>
                    </div>
                    {!calculation.labelClaim && (
                      <p className="text-[10px] text-amber-600 mt-1 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" /> Required for calculation
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* ── Formula Derivation (V chips + per-tablet derivations) ── */}
              <div className="bg-white rounded-lg border-2 border-emerald-200 overflow-hidden">
                <div className="bg-gradient-to-r from-emerald-700 via-emerald-800 to-slate-900 px-4 py-2">
                  <h5 className="text-sm font-bold text-white">Formula Derivation</h5>
                </div>
                <div className="p-5 space-y-5">

                  {/* Prep value chips */}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {/* V1 */}
                    {(() => {
                      const empty = !Number.isFinite(v1Ml);
                      return (
                        <div className={`rounded p-2.5 border ${empty ? "bg-amber-50 border-amber-200" : "bg-emerald-50 border-emerald-200"}`}>
                          <p className={`text-[10px] font-bold uppercase tracking-wider mb-0.5 ${empty ? "text-amber-600" : "text-emerald-700"}`}>V1</p>
                          {empty ? (
                            <p className="text-[10px] text-amber-600 font-semibold italic">Not filled (×1)</p>
                          ) : (
                            <p className="text-sm font-bold text-gray-900">{fmtN(v1Eff)} <span className="text-xs font-normal text-gray-500">mL</span></p>
                          )}
                        </div>
                      );
                    })()}
                    {/* V2 */}
                    {(() => {
                      const empty = !Number.isFinite(v2Ml);
                      return (
                        <div className={`rounded p-2.5 border ${empty ? "bg-amber-50 border-amber-200" : "bg-emerald-50 border-emerald-200"}`}>
                          <p className={`text-[10px] font-bold uppercase tracking-wider mb-0.5 ${empty ? "text-amber-600" : "text-emerald-700"}`}>V2</p>
                          {empty ? (
                            <p className="text-[10px] text-amber-600 font-semibold italic">Not filled (×1)</p>
                          ) : (
                            <p className="text-sm font-bold text-gray-900">{fmtN(v2Eff)} <span className="text-xs font-normal text-gray-500">mL</span></p>
                          )}
                        </div>
                      );
                    })()}
                    {/* V3 */}
                    {(() => {
                      const empty = !Number.isFinite(v3Ml);
                      return (
                        <div className={`rounded p-2.5 border ${empty ? "bg-amber-50 border-amber-200" : "bg-emerald-50 border-emerald-200"}`}>
                          <p className={`text-[10px] font-bold uppercase tracking-wider mb-0.5 ${empty ? "text-amber-600" : "text-emerald-700"}`}>V3</p>
                          {empty ? (
                            <p className="text-[10px] text-amber-600 font-semibold italic">Not filled (×1)</p>
                          ) : (
                            <p className="text-sm font-bold text-gray-900">{fmtN(v3Eff)} <span className="text-xs font-normal text-gray-500">mL</span></p>
                          )}
                        </div>
                      );
                    })()}
                    {/* Conv. Factor */}
                    <div className="bg-emerald-50 rounded p-2.5 border border-emerald-200">
                      <p className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider mb-0.5">Conv. Factor</p>
                      <p className="text-sm font-bold text-gray-900">{fmt4(calculation.conversionFactor)}</p>
                    </div>
                    {/* Label Claim */}
                    <div className="bg-emerald-50 rounded p-2.5 border border-emerald-200">
                      <p className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider mb-0.5">Label Claim</p>
                      <p className="text-sm font-bold text-gray-900">
                        {fmt4(calculation.labelClaim)}{" "}
                        <span className="text-xs font-normal text-gray-500">{calculation.labelClaimUnit}</span>
                      </p>
                    </div>
                  </div>

                  {/* ── Per-Tablet Derivations (simple, clean) ── */}
                  {activeTabletIndices.length > 0 && Number.isFinite(blankNum) && Number.isFinite(cfNum) && Number.isFinite(lcNum) && (
                    <div className="space-y-3 pt-2 border-t border-emerald-100">
                      {activeTabletIndices.map(({ idx }) => {
                        const samplePpm = tabletSampleNums[idx];
                        const tabletResult = tabletResults.find((r) => r.tabletNumber === idx + 1);
                        const resultVal = tabletResult && typeof tabletResult.result === "number" ? tabletResult.result : null;
                        const pf = getPassFail(resultVal);

                        return (
                          <div key={idx} className="bg-gray-50 rounded-lg border border-emerald-100 overflow-hidden">
                            {/* Tablet header */}
                            <div className="flex items-center justify-between px-4 py-2 bg-emerald-50 border-b border-emerald-100">
                              <span className="text-xs font-bold text-emerald-800">Tablet {idx + 1}</span>
                              {resultVal !== null && (
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-bold text-gray-800">{resultVal.toFixed(3)}</span>
                                  <span className="text-xs text-gray-500">{RESULT_UNIT}</span>
                                  {pf && (
                                    <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${pf === "pass" ? "bg-green-100 text-green-800 border border-green-300" : "bg-red-100 text-red-800 border border-red-300"}`}>
                                      {pf === "pass" ? "Pass" : "Fail"}
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>

                            {/* Simple fraction derivation */}
                            <div className="px-4 py-3 font-mono text-xs text-gray-700">
                              {/* Numerator line */}
                              <div className="text-center pb-1.5 border-b-2 border-gray-800">
                                {Number.isFinite(samplePpm) ? (
                                  <span>
                                    ({fmtN(samplePpm)} − {fmtN(blankNum)}) × {fmtN(v1Eff)} × {fmtN(v3Eff)} × 1000
                                  </span>
                                ) : (
                                  <span className="text-amber-500 italic font-sans text-[10px]">Awaiting sample value</span>
                                )}
                              </div>
                              {/* Denominator line */}
                              <div className="text-center pt-1.5">
                                {Number.isFinite(lcNum) && Number.isFinite(cfNum) ? (
                                  <span>
                                    {fmtN(lcNum)} × {fmtN(v2Eff)} × {fmtN(cfNum)} × 10000
                                  </span>
                                ) : (
                                  <span className="text-amber-500 italic font-sans text-[10px]">Awaiting LC / CF values</span>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* ── Acceptance Limit ── */}
              <div className="bg-gradient-to-r from-emerald-50 to-slate-50 rounded-lg p-4 border-2 border-emerald-200">
                <h5 className="text-sm font-bold text-gray-700 mb-3">Acceptance Limit</h5>
                <div className="flex items-center gap-2">
                  <input
                    type="number" step="any"
                    value={calculation.acceptanceLimitMin ?? ""}
                    readOnly={isLocked}
                    onChange={(e) => handleField("acceptanceLimitMin", e.target.value)}
                    onWheel={(e) => e.currentTarget.blur()}
                    placeholder="Min limit"
                    className="w-full px-3 py-2 bg-white border border-emerald-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  />
                  <span className="text-xs font-semibold text-gray-500 shrink-0">to</span>
                  <input
                    type="number" step="any"
                    value={calculation.acceptanceLimitMax ?? ""}
                    readOnly={isLocked}
                    onChange={(e) => handleField("acceptanceLimitMax", e.target.value)}
                    onWheel={(e) => e.currentTarget.blur()}
                    placeholder="Max limit"
                    className="w-full px-3 py-2 bg-white border border-emerald-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  />
                </div>
              </div>

              {/* ── Missing fields warning ── */}
              {missingFields.length > 0 && (
                <div className="bg-amber-50 border-2 border-amber-200 rounded-lg p-4 flex gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-bold text-amber-800 mb-1">Required for result:</p>
                    {missingFields.map((f) => (
                      <p key={f} className="text-xs text-amber-700">• {f}</p>
                    ))}
                  </div>
                </div>
              )}

              {/* ── Individual Tablet Results Table ── */}
              {tabletResults.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <div className="bg-white rounded-lg shadow-lg border-2 border-emerald-300 overflow-hidden">
                    <div className="bg-gradient-to-r from-emerald-700 via-emerald-800 to-slate-900 px-4 py-2">
                      <h6 className="text-sm font-bold text-white flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4" />
                        Individual Tablet Results
                      </h6>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-emerald-100">
                            <th className="px-4 py-3 text-left text-sm font-bold text-emerald-900 border-r border-emerald-200 w-32" />
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
                                    ? trimZeros(result.result)
                                    : result.result}
                                </div>
                                {typeof result.result === "number" && (
                                  <div className="text-xs text-gray-600 mt-1">{result.unit}</div>
                                )}
                              </td>
                            ))}
                          </tr>

                          {hasLimits && (
                            <tr className="bg-gray-50 border-t-2 border-emerald-200">
                              <td className="px-4 py-3 text-xs font-semibold text-gray-500 border-r border-gray-200">
                                Pass/Fail
                                <div className="text-gray-400 font-normal">
                                  {limitMin !== null && !isNaN(limitMin) ? `≥ ${limitMin.toFixed(1)}%` : ""}
                                  {limitMin !== null && !isNaN(limitMin) && limitMax !== null && !isNaN(limitMax) ? " – " : ""}
                                  {limitMax !== null && !isNaN(limitMax) ? `≤ ${limitMax.toFixed(1)}%` : ""}
                                </div>
                              </td>
                              {tabletResults.map((result) => {
                                const val = typeof result.result === "number" ? result.result : null;
                                const pf = getPassFail(val);
                                return (
                                  <td
                                    key={result.tabletNumber}
                                    className="px-4 py-3 text-center border-r border-gray-200 last:border-r-0"
                                  >
                                    {val !== null && pf ? (
                                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${pf === "pass" ? "bg-green-100 text-green-800 border border-green-300" : "bg-red-100 text-red-800 border border-red-300"}`}>
                                        {pf === "pass" ? "Pass" : "Fail"}
                                      </span>
                                    ) : (
                                      <span className="text-gray-400 text-xs">—</span>
                                    )}
                                  </td>
                                );
                              })}
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Summary Statistics */}
                  {summaryResults && (
                    <div className="bg-white rounded-lg shadow-lg border-2 border-emerald-300 overflow-hidden">
                      <div className="bg-gradient-to-r from-emerald-700 via-emerald-800 to-slate-900 px-4 py-2">
                        <h6 className="text-sm font-bold text-white">Summary Statistics</h6>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="bg-emerald-100">
                              <th className="px-6 py-3 text-center text-sm font-bold text-emerald-900 border-r border-emerald-200">Minimum</th>
                              <th className="px-6 py-3 text-center text-sm font-bold text-emerald-900 border-r border-emerald-200">Average</th>
                              <th className="px-6 py-3 text-center text-sm font-bold text-emerald-900">Maximum</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr className="bg-white">
                              <td className="px-6 py-4 text-center border-r border-gray-200">
                                <div className="text-xl font-bold text-gray-800">{trimZeros(summaryResults.min)}</div>
                                <div className="text-xs text-gray-600 mt-1">{summaryResults.unit}</div>
                              </td>
                              <td className="px-6 py-4 text-center border-r border-gray-200">
                                <div className="text-xl font-bold text-emerald-800">{trimZeros(summaryResults.avg)}</div>
                                <div className="text-xs text-gray-600 mt-1">{summaryResults.unit}</div>
                              </td>
                              <td className="px-6 py-4 text-center">
                                <div className="text-xl font-bold text-gray-800">{trimZeros(summaryResults.max)}</div>
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
                    <div className="grid md:grid-cols-1 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600 font-medium">Sample Preparation</p>
                        <p className="text-gray-900 font-semibold">
                          {calculation.selectedSamplePreparationLabel || "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default CalculationDetailLithosun300;