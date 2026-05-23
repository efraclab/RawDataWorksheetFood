import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  Trash,
  CheckCircle2,
  Clock,
  AlertTriangle,
} from "lucide-react";
import type { SamplePreparationMetal } from "../../../preparation_models/metal/SamplePreparationMetal";
import CustomDropdown from "../../shared/CustomDropdown";
import type { CalculationLithosun400 } from "../../../preparation_models/metal/CalculationLithosun400";

interface Props {
  calculation: CalculationLithosun400;
  samplePreparations: SamplePreparationMetal[];
  onUpdate: (updated: CalculationLithosun400) => void;
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

const timePointCountOptions = Array.from({ length: 9 }, (_, i) => ({
  value: String(i + 2),
  label: `${i + 2} time points`,
}));

const trimZeros = (n: number): string =>
  Number.isFinite(n) ? parseFloat(n.toFixed(4)).toString() : "—";

const RESULT_UNIT = "% of LC";
const MAX_TIME_POINTS = 10;
const TABLETS = [1, 2, 3, 4, 5, 6] as const;

const toCanonicalPpm = (value: number, unit: string): number => {
  if (!Number.isFinite(value)) return NaN;
  switch (unit) {
    case "ppm":
    case "mg/L":  return value;
    case "ppb":
    case "μg/L":  return value / 1000;
    default:      return value;
  }
};

const toCanonicalMg = (value: number, unit: string): number => {
  if (!Number.isFinite(value)) return NaN;
  switch (unit) {
    case "g":  return value * 1000;
    case "kg": return value * 1_000_000;
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

const sampleField = (tp: number, tab: number): keyof CalculationLithosun400 =>
  `sampleT${tp}Tab${tab}` as keyof CalculationLithosun400;

const resultField = (tp: number, tab: number): keyof CalculationLithosun400 =>
  `resultT${tp}Tab${tab}` as keyof CalculationLithosun400;

const tpLabelField = (tp: number): keyof CalculationLithosun400 =>
  `timePointLabel${tp}` as keyof CalculationLithosun400;

const minField  = (tp: number): keyof CalculationLithosun400 => `minT${tp}`  as keyof CalculationLithosun400;
const avgField  = (tp: number): keyof CalculationLithosun400 => `avgT${tp}`  as keyof CalculationLithosun400;
const maxField  = (tp: number): keyof CalculationLithosun400 => `maxT${tp}`  as keyof CalculationLithosun400;
const limitMinField = (tp: number): keyof CalculationLithosun400 => `acceptanceLimitMin${tp}` as keyof CalculationLithosun400;
const limitMaxField = (tp: number): keyof CalculationLithosun400 => `acceptanceLimitMax${tp}` as keyof CalculationLithosun400;
const blankField     = (tp: number): keyof CalculationLithosun400 => `instrumentConcentrationBlankT${tp}`     as keyof CalculationLithosun400;
const blankUnitField = (tp: number): keyof CalculationLithosun400 => `instrumentConcentrationBlankUnitT${tp}` as keyof CalculationLithosun400;


const computeTabletResult = (
  sampleRaw: string | null,
  sampleUnit: string,
  blankRaw: string,
  blankUnit: string,
  v1: string | null, v1Unit: string | null,
  v2: string | null, v2Unit: string | null,
  v3: string | null, v3Unit: string | null,
  cf: string,
  labelClaim: string,
  labelClaimUnit: string,
): number | null => {
  const sample = toCanonicalPpm(parseFloat(sampleRaw ?? ""), sampleUnit);
  // For subtraction: missing blank treated as 0
  const blankParsed = parseFloat(blankRaw);
  const blank  = toCanonicalPpm(Number.isFinite(blankParsed) ? blankParsed : 0, blankUnit);
  if (!Number.isFinite(sample)) return null;

  // V1, V2, V3 → mL (missing → ×1)
  const v1Ml = toCanonicalML(parseFloat(v1 ?? ""), v1Unit);
  const v1n  = Number.isFinite(v1Ml) ? v1Ml : 1;
  const v2Ml = toCanonicalML(parseFloat(v2 ?? ""), v2Unit);
  const v2n  = Number.isFinite(v2Ml) ? v2Ml : 1;
  const v3Ml = toCanonicalML(parseFloat(v3 ?? ""), v3Unit);
  const v3n  = Number.isFinite(v3Ml) ? v3Ml : 1;

  const cfN = parseFloat(cf);
  const lcN = toCanonicalMg(parseFloat(labelClaim), labelClaimUnit);

  // cf and labelClaim are required (division by them) — return null to show NA
  if (!Number.isFinite(cfN) || cfN <= 0) return null;
  if (!Number.isFinite(lcN) || lcN <= 0) return null;

  const num = (sample - blank) * v1n * v3n * 1000;
  const den = lcN * v2n * cfN * 10000;
  if (den === 0) return null;

  const r = num / den;
  return Number.isFinite(r) ? parseFloat(r.toFixedNoRound(4).toFixed(3)) : null;
};

const fmt4 = (v: string | null | undefined): string => {
  if (!v && v !== "0") return "—";
  const n = parseFloat(v ?? "");
  return Number.isFinite(n) ? n.toFixed(4) : "—";
};

const fmtN = (n: number, dec = 4): string =>
  Number.isFinite(n) ? n.toFixed(dec) : "—";

interface TabletEntry {
  tabletNumber: number;
  result: number;
}

interface TimePointResult {
  tp: number;
  label: string;
  tablets: TabletEntry[];
  min: number;
  avg: number;
  max: number;
}

const CalculationDetailLithosun400: React.FC<Props> = ({
  calculation,
  samplePreparations,
  onUpdate,
  onRemove,
  isLocked = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [timePointResults, setTimePointResults] = useState<TimePointResult[]>([]);

  const selectedSamplePrep = samplePreparations.find(
    (p) => p.label === calculation.selectedSamplePreparationLabel,
  );

  const extractPrepValues = (sp?: SamplePreparationMetal) => {
    if (!sp) return { v1: null, v1Unit: null, v2: null, v2Unit: null, v3: null, v3Unit: null };
    const steps = Array.isArray(sp.steps) ? sp.steps : [];
    const d1 = steps.find((s) => s.name === "1st Dilution");
    const d2 = steps.find((s) => s.name === "2nd Dilution");
    return {
      v1: d1?.value1 ?? null, v1Unit: (d1 as any)?.unit1 ?? "mL",
      v2: d2?.value1 ?? null, v2Unit: (d2 as any)?.unit1 ?? "mL",
      v3: d2?.value2 ?? null, v3Unit: (d2 as any)?.unit2 ?? "mL",
    };
  };

  useEffect(() => {
    const { v1, v1Unit, v2, v2Unit, v3, v3Unit } = extractPrepValues(selectedSamplePrep);
    const newLabel = selectedSamplePrep
      ? `Calculation for ${selectedSamplePrep.label}`
      : calculation.label;
    onUpdate({
      ...calculation,
      v1, v2, v3,
      ...(v1Unit ? { v1Unit } : {}),
      ...(v2Unit ? { v2Unit } : {}),
      ...(v3Unit ? { v3Unit } : {}),
      label: newLabel,
    });
  }, [selectedSamplePrep?.label]);

  useEffect(() => {
    const numTP = calculation.numberOfTimePoints || 2;
    const results: TimePointResult[] = [];
    const updates: Partial<CalculationLithosun400> = {};

    for (let tp = 1; tp <= numTP; tp++) {
      const tablets: TabletEntry[] = [];

      for (const tab of TABLETS) {
        const raw = calculation[sampleField(tp, tab)] as string | null;
        const tpBlankRaw  = (calculation[blankField(tp)]     as string | null) ?? "";
        const tpBlankUnit = (calculation[blankUnitField(tp)] as string | null) ?? "ppm";
        const r = computeTabletResult(
          raw,
          tpBlankUnit,
          tpBlankRaw,
          tpBlankUnit,
          calculation.v1,
          calculation.v2,
          calculation.v3,
          calculation.conversionFactor!,
          calculation.labelClaim!,
          calculation.labelClaimUnit!,
        );
        const key = resultField(tp, tab);
        updates[key] = r !== null ? r.toFixed(3) : undefined;
        if (r !== null) tablets.push({ tabletNumber: tab, result: r });
      }

      const nums = tablets.map((t) => t.result);
      const min = nums.length ? Math.min(...nums) : 0;
      const max = nums.length ? Math.max(...nums) : 0;
      const avg = nums.length ? nums.reduce((a, b) => a + b, 0) / nums.length : 0;

      updates[minField(tp)] = nums.length ? min : undefined;
      updates[avgField(tp)] = nums.length ? avg : undefined;
      updates[maxField(tp)] = nums.length ? max : undefined;

      if (tablets.length > 0) {
        results.push({
          tp,
          label: (calculation[tpLabelField(tp)] as string) || `Time Point ${tp}`,
          tablets,
          min, avg, max,
        });
      }
    }

    setTimePointResults(results);
    onUpdate({ ...calculation, ...updates, calculationResultUnit: RESULT_UNIT });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    calculation.numberOfTimePoints,
    calculation.conversionFactor,
    calculation.labelClaim,
    calculation.labelClaimUnit,
    calculation.v1, calculation.v2, calculation.v3,
    // Per-timepoint blank values
    ...Array.from({ length: MAX_TIME_POINTS }, (_, i) => [
      calculation[blankField(i + 1)],
      calculation[blankUnitField(i + 1)],
    ]).flat(),
    // All per-timepoint, per-tablet sample values
    ...Array.from({ length: MAX_TIME_POINTS }, (_, tp) =>
      TABLETS.map((tab) => calculation[sampleField(tp + 1, tab)])
    ).flat(),
  ]);

  // ─── Field update helper ─────────────────────────────────────────────────
  const set = (field: keyof CalculationLithosun400, value: string | number | null) => {
    if (isLocked) return;
    onUpdate({ ...calculation, [field]: value });
  };

  // ─── Derived display values ──────────────────────────────────────────────
  const v1Eff = parseFloat(calculation.v1 ?? "") || 1;
  const v2Eff = parseFloat(calculation.v2 ?? "") || 1;
  const v3Eff = parseFloat(calculation.v3 ?? "") || 1;
  const cfNum = parseFloat(calculation.conversionFactor!);
  const lcMg  = toCanonicalMg(parseFloat(calculation.labelClaim!), calculation.labelClaimUnit!);

  const numTP = calculation.numberOfTimePoints || 2;

  // Missing fields guard
  const missingFields: string[] = [];
  if (!Number.isFinite(cfNum) || cfNum <= 0) missingFields.push("Conversion Factor");
  if (!Number.isFinite(lcMg)  || lcMg  <= 0) missingFields.push("Label Claim");

  // Pass/Fail helper
  const getPassFail = (val: number, tp: number): "pass" | "fail" | null => {
    const rawMin = calculation[limitMinField(tp)] as string | null;
    const rawMax = calculation[limitMaxField(tp)] as string | null;
    const lMin = rawMin ? parseFloat(rawMin) : null;
    const lMax = rawMax ? parseFloat(rawMax) : null;
    if (lMin === null && lMax === null) return null;
    return (lMin === null || val >= lMin) && (lMax === null || val <= lMax)
      ? "pass" : "fail";
  };

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white rounded-xl shadow-lg border-2 border-emerald-200 overflow-hidden mb-6"
    >
      {/* ── Header ── */}
      <div
        className={`relative bg-gradient-to-r from-emerald-700 via-emerald-800 to-slate-900 ${isExpanded ? "rounded-t-lg" : "rounded-lg"}`}
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
              <p className="text-xs text-emerald-100">
                Lithosun 400 Calculation
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
                transition={{ duration: 0.3 }}
              >
                <ChevronDown className="w-5 h-5 text-white" />
              </motion.div>
            </motion.button>
            {!isLocked && (
              <motion.button
                onClick={(e) => { e.stopPropagation(); onRemove(); }}
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
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

              {/* ── Symbolic Formula ── */}
              <div className="bg-white rounded-lg p-4 border-2 border-emerald-200 shadow-sm">
                <h4 className="text-sm font-bold text-gray-900 mb-3">
                  Formula
                </h4>
                <div className="bg-gray-50 rounded p-3">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 flex flex-col items-center">
                      <div className="text-center border-b-2 border-black pb-2 mb-2 px-2 w-full">
                        <p className="text-xs font-mono text-black">
                          (Instrument Conc. Sample − Instrument Conc. Blank) × V1 × V3 × 1000
                        </p>
                      </div>
                      <div className="text-center px-2 w-full">
                        <p className="text-xs font-mono text-black">
                          Label Claim (mg) × V2 × Conversion Factor × 10000
                        </p>
                      </div>
                    </div>
                    <span className="text-sm font-bold text-black shrink-0">
                      {RESULT_UNIT}
                    </span>
                  </div>
                </div>
              </div>

              {/* ── Sample Preparation Selector ── */}
              <div className="bg-gradient-to-r from-emerald-50 to-slate-50 rounded-lg p-4 border-2 border-emerald-200">
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Select Sample Preparation
                </label>
                <CustomDropdown
                  options={samplePreparations.map((p) => ({ value: p.label, label: p.label }))}
                  value={calculation.selectedSamplePreparationLabel || ""}
                  onChange={(v) => set("selectedSamplePreparationLabel", v)}
                  placeholder="Select sample preparation..."
                  colorScheme="emerald"
                />
              </div>

              {/* ── Number of Time Points ── */}
              <div className="bg-gradient-to-r from-emerald-50 to-slate-50 rounded-lg p-4 border-2 border-emerald-200">
                <div className="min-w-0">
                  <label className="block text-xs font-bold text-gray-700 mb-2">
                    Number of Time Points
                  </label>
                  <CustomDropdown
                    options={timePointCountOptions}
                    value={String(calculation.numberOfTimePoints || 2)}
                    onChange={(v) => set("numberOfTimePoints", parseInt(v))}
                    placeholder="Select time points"
                    colorScheme="emerald"
                  />
                </div>
              </div>

              {/* ── Conversion Factor & Label Claim ── */}
              <div className="bg-gradient-to-r from-emerald-50 to-slate-50 rounded-lg p-4 border-2 border-emerald-200">
                <h5 className="text-sm font-bold text-gray-700 mb-3">
                  Conversion Factor &amp; Label Claim
                </h5>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="min-w-0">
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                      Conversion Factor{" "}
                    </label>
                    <input
                      type="number" step="any"
                      value={calculation.conversionFactor ?? ""}
                      readOnly={isLocked}
                      onChange={(e) => set("conversionFactor", e.target.value || null)}
                      onWheel={(e) => e.currentTarget.blur()}
                      placeholder="Enter value"
                      className={`w-full px-3 py-2 bg-white border rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-emerald-400 ${!calculation.conversionFactor ? "border-amber-400" : "border-emerald-300"}`}
                    />
                    {!calculation.conversionFactor && (
                      <p className="text-[10px] text-amber-600 mt-1 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" /> Required
                      </p>
                    )}
                  </div>
                  <div className="min-w-0">
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                      Label Claim
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="number" step="any"
                        value={calculation.labelClaim!}
                        readOnly={isLocked}
                        onChange={(e) => set("labelClaim", e.target.value)}
                        onWheel={(e) => e.currentTarget.blur()}
                        placeholder="Enter Value"
                        className={`flex-1 min-w-0 px-3 py-2 bg-white border rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-emerald-400 ${!calculation.labelClaim ? "border-amber-400" : "border-emerald-300"}`}
                      />
                      <div className="w-20 shrink-0">
                        <CustomDropdown
                          options={labelClaimUnitOptions}
                          value={calculation.labelClaimUnit}
                          onChange={(v) => set("labelClaimUnit", v)}
                          placeholder="Unit"
                          colorScheme="emerald"
                        />
                      </div>
                    </div>
                    {!calculation.labelClaim && (
                      <p className="text-[10px] text-amber-600 mt-1 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" /> Required
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* ── Per-Time-Point Sample Entry ── */}
              <div className="bg-gradient-to-r from-emerald-50 to-slate-50 rounded-lg p-4 border-2 border-emerald-200">
                <div className="mb-3">
                  <h6 className="text-xs font-bold text-emerald-800 uppercase tracking-wide border-b border-emerald-100 pb-1">
                    Time Point Data ({calculation.numberOfTimePoints} time points)
                  </h6>
                </div>

                <div className="space-y-3">
                  {Array.from({ length: numTP }, (_, i) => {
                    const tp = i + 1;
                    const tpLabel = (calculation[tpLabelField(tp)] as string) || "";

                    return (
                      <div
                        key={tp}
                        className="border-2 border-emerald-200 rounded-lg overflow-hidden"
                      >
                        {/* Time point header: badge + label input + shared unit selector */}
                        <div className="bg-emerald-50 border-b border-emerald-200 px-3 py-2.5 flex items-center gap-3">
                          <span className="text-xs font-bold text-white bg-emerald-600 rounded px-2 py-0.5 min-w-[32px] text-center shrink-0">
                            Time Point {tp}
                          </span>
                          <input
                            type="text"
                            value={tpLabel}
                            readOnly={isLocked}
                            onChange={(e) => set(tpLabelField(tp), e.target.value)}
                            placeholder={`Time Point Detail (hr)`}
                            className="flex-1 px-2 py-1.5 border border-emerald-300 rounded-md text-xs focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-white"
                          />
                          {/* Shared unit for both Blank and Sample at this time point */}
                          <div className="flex items-center gap-1.5 shrink-0">
                            <span className="text-[10px] text-gray-500 font-medium whitespace-nowrap">Unit</span>
                            <div className="w-24">
                              <CustomDropdown
                                options={concUnitOptions}
                                value={(calculation[blankUnitField(tp)] as string) || "ppm"}
                                onChange={(v) => {
                                  if (isLocked) return;
                                  onUpdate({
                                    ...calculation,
                                    [blankUnitField(tp)]: v,
                                  });
                                }}
                                placeholder="Unit"
                                colorScheme="emerald"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Blank concentration for this time point */}
                        <div className="px-3 pt-3 pb-0 bg-white">
                          <p className="text-xs text-gray-500 font-medium mb-1.5">
                            Instrument Concentration (Blank)
                          </p>
                          <input
                            type="number" step="any"
                            value={(calculation[blankField(tp)] as string) ?? ""}
                            readOnly={isLocked}
                            onChange={(e) => set(blankField(tp), e.target.value || null)}
                            onWheel={(e) => e.currentTarget.blur()}
                            placeholder="Enter value"
                            className="w-full px-2 py-1.5 bg-white border rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-emerald-400 border-emerald-300"
                          />
                        </div>

                        {/* Instrument Concentration (Sample) inputs */}
                        <div className="p-3 bg-white">
                          <p className="text-xs text-gray-500 font-medium mb-2">
                            Instrument Concentration (Sample)
                          </p>

                        {/* 2 rows × 3 cols of tablet inputs */}
                        <div className="grid grid-cols-3 gap-2">
                          {TABLETS.map((tab) => {
                            const rawVal = (calculation[sampleField(tp, tab)] as string) || "";

                            return (
                              <div key={tab} className="flex flex-col gap-1">
                                <input
                                  type="number" step="any"
                                  value={rawVal}
                                  readOnly={isLocked}
                                  onChange={(e) => set(sampleField(tp, tab), e.target.value || null)}
                                  onWheel={(e) => e.currentTarget.blur()}
                                  placeholder={`Sample ${tab}`}
                                  className="w-full px-1 py-2 border border-emerald-300 rounded-lg text-xs text-center focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-emerald-50"
                                />
                              </div>
                            );
                          })}
                        </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* ── Formula Breakdown ── */}
              <div className="bg-white rounded-lg border-2 border-emerald-200 overflow-hidden">
                <div className="bg-gradient-to-r from-emerald-700 via-emerald-800 to-slate-900 px-4 py-2">
                  <h5 className="text-sm font-bold text-white">Formula Breakdown</h5>
                </div>
                <div className="p-5 space-y-5">

                  {/* Prep value chips */}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {(["V1", "V2", "V3"] as const).map((label, idx) => {
                      const raw = [calculation.v1, calculation.v2, calculation.v3][idx];
                      const empty = !raw || !Number.isFinite(parseFloat(raw));
                      return (
                        <div
                          key={label}
                          className={`rounded p-2.5 border ${empty ? "bg-amber-50 border-amber-200" : "bg-emerald-50 border-emerald-200"}`}
                        >
                          <p className={`text-[10px] font-bold uppercase tracking-wider mb-0.5 ${empty ? "text-amber-600" : "text-emerald-700"}`}>
                            {label}
                          </p>
                          {empty ? (
                            <p className="text-[10px] text-amber-600 font-semibold italic">Not filled (×1)</p>
                          ) : (
                            <p className="text-sm font-bold text-gray-900">
                              {fmt4(raw)} <span className="text-xs font-normal text-gray-500">mL</span>
                            </p>
                          )}
                        </div>
                      );
                    })}
                    <div className="bg-emerald-50 rounded p-2.5 border border-emerald-200">
                      <p className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider mb-0.5">Conv. Factor</p>
                      <p className="text-sm font-bold text-gray-900">{fmt4(calculation.conversionFactor)}</p>
                    </div>
                    <div className="bg-emerald-50 rounded p-2.5 border border-emerald-200">
                      <p className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider mb-0.5">Label Claim</p>
                      <p className="text-sm font-bold text-gray-900">
                        {fmt4(calculation.labelClaim)}{" "}
                        <span className="text-xs font-normal text-gray-500">{calculation.labelClaimUnit}</span>
                      </p>
                    </div>
                  </div>

                  {/* Per-time-point derivations — only when data is present */}
                  {Number.isFinite(cfNum) && Number.isFinite(lcMg) && (
                    <div className="space-y-4 pt-2 border-t border-emerald-100">
                      {Array.from({ length: numTP }, (_, i) => {
                        const tp = i + 1;
                        const tpLabel = (calculation[tpLabelField(tp)] as string) || `Time Point ${tp}`;
                        const tpBlankRaw  = (calculation[blankField(tp)]     as string | null) ?? "";
                        const tpBlankUnit = (calculation[blankUnitField(tp)] as string | null) ?? "ppm";
                        const blankParsedVal = parseFloat(tpBlankRaw);
                        const tpBlankPpm  = toCanonicalPpm(Number.isFinite(blankParsedVal) ? blankParsedVal : 0, tpBlankUnit);

                        // Only render derivation rows for tablets that have values
                        const activeTablets = TABLETS.filter((tab) => {
                          const v = calculation[sampleField(tp, tab)] as string | null;
                          return v !== null && v !== "" && Number.isFinite(parseFloat(v ?? ""));
                        });

                        if (activeTablets.length === 0) return null;

                        return (
                          <div key={tp} className="rounded-lg border border-emerald-200 overflow-hidden">
                            {/* Time point label bar */}
                            <div className="bg-emerald-700 px-4 py-1.5 flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Clock className="w-3.5 h-3.5 text-emerald-200" />
                                <span className="text-xs font-bold text-white">After {tpLabel} Hr.</span>
                              </div>
                            </div>

                            {/* Tablet derivation rows */}
                            <div className="divide-y divide-emerald-50">
                              {activeTablets.map((tab) => {
                                const raw = calculation[sampleField(tp, tab)] as string | null;
                                const samplePpm = toCanonicalPpm(
                                  parseFloat(raw ?? ""),
                                  tpBlankUnit,
                                );
                                const resultKey = resultField(tp, tab);
                                const resultRaw = calculation[resultKey] as string | null;
                                const resultVal = resultRaw ? parseFloat(resultRaw) : null;
                                const pf = resultVal !== null ? getPassFail(resultVal, tp) : null;

                                return (
                                  <div
                                    key={tab}
                                    className="bg-gray-50 px-4 py-3"
                                  >
                                    {/* Tablet header */}
                                    <div className="flex items-center justify-between mb-2">
                                      <span className="text-[11px] font-bold text-emerald-800">
                                        Tablet {tab}
                                      </span>
                                      {resultVal !== null && (
                                        <div className="flex items-center gap-2">
                                          <span className="text-sm font-bold text-gray-800">
                                            {resultVal.toFixed(3)}
                                          </span>
                                          <span className="text-[10px] text-gray-500">{RESULT_UNIT}</span>
                                          {pf && (
                                            <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${pf === "pass" ? "bg-green-100 text-green-800 border border-green-300" : "bg-red-100 text-red-800 border border-red-300"}`}>
                                              {pf === "pass" ? "Pass" : "Fail"}
                                            </span>
                                          )}
                                        </div>
                                      )}
                                    </div>

                                    {/* Clean fraction */}
                                    <div className="font-mono text-xs text-gray-700">
                                      <div className="text-center pb-1.5 border-b-2 border-gray-800">
                                        {Number.isFinite(samplePpm) ? (
                                          <span>
                                            ({fmtN(samplePpm)} − {Number.isFinite(tpBlankPpm) ? fmtN(tpBlankPpm) : "—"}) × {fmtN(v1Eff)} × {fmtN(v3Eff)} × 1000
                                          </span>
                                        ) : (
                                          <span className="text-amber-500 italic font-sans text-[10px]">
                                            Awaiting sample value
                                          </span>
                                        )}
                                      </div>
                                      <div className="text-center pt-1.5">
                                        {Number.isFinite(lcMg) && Number.isFinite(cfNum) ? (
                                          <span>
                                            {fmtN(lcMg)} × {fmtN(v2Eff)} × {fmtN(cfNum)} × 10000
                                          </span>
                                        ) : (
                                          <span className="text-amber-500 italic font-sans text-[10px]">
                                            Awaiting LC / CF values
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* ── Acceptance Limits — per time point ── */}
              <div className="bg-gradient-to-r from-emerald-50 to-slate-50 rounded-lg p-4 border-2 border-emerald-200">
                <h5 className="text-sm font-bold text-gray-700 mb-3">Acceptance Limits</h5>
                <div className="space-y-2">
                  {Array.from({ length: numTP }, (_, i) => {
                    const tp = i + 1;
                    const tpLabel = (calculation[tpLabelField(tp)] as string) || `Time Point ${tp}`;
                    return (
                      <div key={tp} className="flex items-center gap-3">
                        <span
                          className="text-xs font-bold text-emerald-800 w-32 shrink-0 truncate"
                          title={tpLabel}
                        >
                          {tpLabel}
                        </span>
                        <div className="flex items-center gap-2 flex-1">
                          <input
                            type="number" step="any"
                            value={(calculation[limitMinField(tp)] as string) ?? ""}
                            readOnly={isLocked}
                            onChange={(e) => set(limitMinField(tp), e.target.value || null)}
                            onWheel={(e) => e.currentTarget.blur()}
                            placeholder="Min %"
                            className="w-full px-2 py-1.5 bg-white border border-emerald-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-emerald-400"
                          />
                          <span className="text-xs font-semibold text-gray-400 shrink-0">to</span>
                          <input
                            type="number" step="any"
                            value={(calculation[limitMaxField(tp)] as string) ?? ""}
                            readOnly={isLocked}
                            onChange={(e) => set(limitMaxField(tp), e.target.value || null)}
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

              {/* ── Results Section ── */}
              {timePointResults.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  {/* Section header */}
                  <div className="flex items-center gap-3 pb-1">
                    <CheckCircle2 className="w-5 h-5 text-emerald-700" />
                    <h5 className="text-base font-bold text-emerald-700">
                      Lithosun 400 Results
                    </h5>
                  </div>

                  {/* Per-time-point result tables */}
                  {timePointResults.map((tpr) => {
                    const tp = tpr.tp;
                    const rawMin = calculation[limitMinField(tp)] as string | null;
                    const rawMax = calculation[limitMaxField(tp)] as string | null;
                    const lMin = rawMin ? parseFloat(rawMin) : null;
                    const lMax = rawMax ? parseFloat(rawMax) : null;
                    const hasMin = lMin !== null && !isNaN(lMin);
                    const hasMax = lMax !== null && !isNaN(lMax);
                    const showPassFail = hasMin || hasMax;

                    return (
                      <div
                        key={tp}
                        className="bg-white rounded-lg shadow-lg border-2 border-emerald-300 overflow-hidden"
                      >
                        {/* Table header */}
                        <div className="bg-gradient-to-r from-emerald-700 via-emerald-800 to-slate-900 px-4 py-2 flex items-center gap-3">
                          <Clock className="w-4 h-4 text-emerald-200" />
                          <h6 className="text-sm font-bold text-white">After {tpr.label} Hr.</h6>
                        </div>

                        <div className="overflow-x-auto">
                          <table className="w-full text-xs">
                            <thead>
                              <tr className="bg-emerald-100">
                                <th className="px-4 py-2.5 text-left font-bold text-emerald-900 border-r border-emerald-200 w-28">
                                  Tablet
                                </th>
                                <th className="px-4 py-2.5 text-center font-bold text-emerald-900 border-r border-emerald-200">
                                  Result (% of LC)
                                </th>
                                {showPassFail && (
                                  <th className="px-4 py-2.5 text-center font-bold text-emerald-900">
                                    Pass / Fail
                                  </th>
                                )}
                              </tr>
                            </thead>
                            <tbody>
                              {tpr.tablets.map((entry, idx) => {
                                const pf = getPassFail(entry.result, tp);
                                return (
                                  <tr
                                    key={entry.tabletNumber}
                                    className={idx % 2 === 0 ? "bg-white" : "bg-emerald-50/30"}
                                  >
                                    <td className="px-4 py-2.5 font-semibold text-gray-700 border-r border-gray-200">
                                      Tablet {entry.tabletNumber}
                                    </td>
                                    <td className="px-4 py-2.5 text-center font-bold text-gray-800 border-r border-gray-200">
                                      {trimZeros(entry.result)}
                                    </td>
                                    {showPassFail && (
                                      <td className="px-4 py-2.5 text-center">
                                        {pf ? (
                                          <span className={`inline-block px-3 py-0.5 rounded-full font-bold ${pf === "pass" ? "bg-green-100 text-green-800 border border-green-300" : "bg-red-100 text-red-800 border border-red-300"}`}>
                                            {pf === "pass" ? "Pass" : "Fail"}
                                          </span>
                                        ) : (
                                          <span className="text-gray-400">—</span>
                                        )}
                                      </td>
                                    )}
                                  </tr>
                                );
                              })}

                              {/* Summary row */}
                              {tpr.tablets.length > 0 && (
                                <tr className="bg-emerald-100 border-t-2 border-emerald-300">
                                  <td
                                    colSpan={showPassFail ? 3 : 2}
                                    className="px-4 py-2.5"
                                  >
                                    <div className="flex items-center justify-around text-xs">
                                      <span className="text-gray-600">
                                        Min:{" "}
                                        <span className="font-bold text-gray-900">
                                          {trimZeros(tpr.min)}
                                        </span>
                                      </span>
                                      <span className="text-gray-300">|</span>
                                      <span className="text-gray-600">
                                        Avg:{" "}
                                        <span className="font-bold text-emerald-800">
                                          {trimZeros(tpr.avg)}
                                        </span>
                                      </span>
                                      <span className="text-gray-300">|</span>
                                      <span className="text-gray-600">
                                        Max:{" "}
                                        <span className="font-bold text-gray-900">
                                          {trimZeros(tpr.max)}
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
                                {hasMin ? `≥ ${lMin!.toFixed(1)}%` : ""}
                                {hasMin && hasMax ? " – " : ""}
                                {hasMax ? `≤ ${lMax!.toFixed(1)}%` : ""}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}

                  {/* Preparation info footer */}
                  <div className="bg-white/80 rounded-lg border border-gray-200 p-4">
                    <p className="text-xs font-medium text-gray-600">Sample Preparation</p>
                    <p className="text-sm font-semibold text-gray-900">
                      {calculation.selectedSamplePreparationLabel || "N/A"}
                    </p>
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

export default CalculationDetailLithosun400;