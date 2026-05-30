import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Calculator, Trash, CheckCircle2, AlertTriangle } from "lucide-react";
import type { CalculationIcpms } from "../../../preparation_models/metal/CalculationIcpms";
import type { SamplePreparationMetal } from "../../../preparation_models/metal/SamplePreparationMetal";
import CustomDropdown from "../../shared/CustomDropdown";

interface Props {
  calculation: CalculationIcpms;
  samplePreparations: SamplePreparationMetal[];
  onUpdate: (updated: CalculationIcpms) => void;
  onRemove: () => void;
  isLocked?: boolean;
}

const concUnitOptions = [
  { value: "ppb", label: "ppb" },
  { value: "ppm", label: "ppm" },
  { value: "μg/L", label: "μg/L" },
  { value: "mg/L", label: "mg/L" },
];

const RESULT_UNIT = "mg/Kg";

// ─── Unit converters ──────────────────────────────────────────────────────────

const toCanonicalPpm = (value: number, unit: string): number => {
  if (!Number.isFinite(value)) return NaN;
  switch (unit) {
    case "ppm":
    case "mg/L": return value;
    case "ppb":
    case "μg/L": return value / 1000;
    default: return value;
  }
};

/** Any weight unit → g */
const toCanonicalG = (value: number, unit?: string | null): number => {
  if (!Number.isFinite(value)) return NaN;
  if (!unit) return value;
  switch (unit.trim().toLowerCase()) {
    case "g":   return value;
    case "mg":  return value / 1000;
    case "kg":  return value * 1000;
    case "µg":
    case "ug":
    case "mcg": return value / 1_000_000;
    default:    return value;
  }
};

/** Any volume unit → mL */
const toCanonicalML = (value: number, unit?: string | null): number => {
  if (!Number.isFinite(value)) return NaN;
  if (!unit) return value; // assume mL if missing
  switch (unit.trim().toLowerCase()) {
    case "ml": return value;
    case "l": return value * 1000;
    case "µl":
    case "ul": return value / 1000;
    default: return value;
  }
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Trim trailing zeros after up to 4 decimal places */
const trimZeros = (n: number): string =>
  Number.isFinite(n) ? parseFloat(n.toFixed(4)).toString() : "—";

const fmt4 = (v: string | null | undefined): string => {
  if (v === null || v === undefined || v === "") return "—";
  const n = parseFloat(v);
  return Number.isFinite(n) ? trimZeros(n) : "—";
};

const fmtN4 = (n: number): string => trimZeros(n);

const hasVal = (v: string | null | undefined): boolean =>
  !!v && v.trim() !== "" && Number.isFinite(parseFloat(v));

const extractValues = (sp?: SamplePreparationMetal) => {
  const empty = {
    sw: null, swUnit: null,
    v1: null, v1Unit: null,
    v2: null, v2Unit: null,
    v3: null, v3Unit: null,
    v4: null, v4Unit: null,
    v5: null, v5Unit: null,
    v6: null, v6Unit: null,
    v7: null, v7Unit: null,
  };
  if (!sp) return empty;
  const stepsArr = Array.isArray(sp.steps) ? sp.steps : [];
  const weighing = stepsArr.find((s) => s.name === "Weighing");
  const d1 = stepsArr.find((s) => s.name === "1st Dilution");
  const d2 = stepsArr.find((s) => s.name === "2nd Dilution");
  const d3 = stepsArr.find((s) => s.name === "3rd Dilution");
  const d4 = stepsArr.find((s) => s.name === "4th Dilution");
  return {
    sw: weighing?.value1 ?? null, swUnit: (weighing as any)?.unit1 ?? "mg",
    v1: d1?.value1 ?? null,       v1Unit: (d1 as any)?.unit1 ?? "mL",
    v2: d2?.value1 ?? null,       v2Unit: (d2 as any)?.unit1 ?? "mL",
    v3: d2?.value2 ?? null,       v3Unit: (d2 as any)?.unit2 ?? "mL",
    v4: d3?.value1 ?? null,       v4Unit: (d3 as any)?.unit1 ?? "mL",
    v5: d3?.value2 ?? null,       v5Unit: (d3 as any)?.unit2 ?? "mL",
    v6: d4?.value1 ?? null,       v6Unit: (d4 as any)?.unit1 ?? "mL",
    v7: d4?.value2 ?? null,       v7Unit: (d4 as any)?.unit2 ?? "mL",
  };
};

const calcDF = (
  makeup: string | null, makeupUnit?: string | null,
  take?: string | null, takeUnit?: string | null,
): number => {
  const m = toCanonicalML(parseFloat(makeup ?? ""), makeupUnit);
  const t = toCanonicalML(parseFloat(take ?? ""), takeUnit);
  return Number.isFinite(m) && Number.isFinite(t) && t !== 0 ? m / t : NaN;
};

const compute = (
  instSample: string, instSampleUnit: string,
  instBlank: string, instBlankUnit: string,
  sw: string | null, swUnit?: string | null,
  v1?: string | null, v1Unit?: string | null,
  v2?: string | null, v2Unit?: string | null,
  v3?: string | null, v3Unit?: string | null,
  v4?: string | null, v4Unit?: string | null,
  v5?: string | null, v5Unit?: string | null,
  v6?: string | null, v6Unit?: string | null,
  v7?: string | null, v7Unit?: string | null,
): string | null => {
  // Concentrations → ppm
  const sample = toCanonicalPpm(parseFloat(instSample), instSampleUnit);
  if (!Number.isFinite(sample)) return null;
  const blank = toCanonicalPpm(parseFloat(instBlank), instBlankUnit);
  if (!Number.isFinite(blank)) return null;

  // SW → g
  const swG = toCanonicalG(parseFloat(sw ?? ""), swUnit);
  if (!Number.isFinite(swG)) return null;

  // V1 → mL (absent → treat as ×1)
  const v1Ml = toCanonicalML(parseFloat(v1 ?? ""), v1Unit);
  const v1n = Number.isFinite(v1Ml) ? v1Ml : 1;

  const v2n = toCanonicalML(parseFloat(v2 ?? ""), v2Unit);
  const v3n = toCanonicalML(parseFloat(v3 ?? ""), v3Unit);
  const v4n = toCanonicalML(parseFloat(v4 ?? ""), v4Unit);
  const v5n = toCanonicalML(parseFloat(v5 ?? ""), v5Unit);
  const v6n = toCanonicalML(parseFloat(v6 ?? ""), v6Unit);
  const v7n = toCanonicalML(parseFloat(v7 ?? ""), v7Unit);
  const df1 = Number.isFinite(v2n) && Number.isFinite(v3n) && v2n !== 0 ? v3n / v2n : 1;
  const df2 = Number.isFinite(v4n) && Number.isFinite(v5n) && v4n !== 0 ? v5n / v4n : 1;
  const df3 = Number.isFinite(v6n) && Number.isFinite(v7n) && v6n !== 0 ? v7n / v6n : 1;

  const numerator = (sample - blank) * v1n * df1 * df2 * df3;
  const denominator = swG;
  if (denominator === 0) return null;
  const result = numerator / denominator;
  return Number.isFinite(result) ? result.toFixedNoRound(4).toFixed(3) : null;
};

// ─── Component ────────────────────────────────────────────────────────────────
const CalculationDetailIcpms: React.FC<Props> = ({
  calculation,
  samplePreparations,
  onUpdate,
  onRemove,
  isLocked = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  // Cast to any once — unit fields (swUnit, v1Unit…v7Unit) are not in the
  // CalculationIcpms type but are stored on the object at runtime.
  const c = calculation as any;

  const selectedSamplePrep = samplePreparations.find(
    (prep) => prep.label === calculation.selectedSamplePreparationLabel
  );

  const v1Active = hasVal(calculation.v1);
  const df1Active = hasVal(calculation.v2) && hasVal(calculation.v3);
  const df2Active = hasVal(calculation.v4) && hasVal(calculation.v5);
  const df3Active = hasVal(calculation.v6) && hasVal(calculation.v7);

  const df1Val = calcDF(calculation.v3, c.v3Unit, calculation.v2, c.v2Unit);
  const df2Val = calcDF(calculation.v5, c.v5Unit, calculation.v4, c.v4Unit);
  const df3Val = calcDF(calculation.v7, c.v7Unit, calculation.v6, c.v6Unit);


  useEffect(() => {
    const ex = extractValues(selectedSamplePrep);
    const newResult = compute(
      calculation.instrumentConcentrationSample,
      calculation.instrumentConcentrationSampleUnit,
      calculation.instrumentConcentrationBlank,
      calculation.instrumentConcentrationBlankUnit,
      ex.sw, ex.swUnit,
      ex.v1, ex.v1Unit,
      ex.v2, ex.v2Unit,
      ex.v3, ex.v3Unit,
      ex.v4, ex.v4Unit,
      ex.v5, ex.v5Unit,
      ex.v6, ex.v6Unit,
      ex.v7, ex.v7Unit,
    );
    const newLabel = calculation.label;

    if (
      ex.sw !== calculation.sw || ex.swUnit !== c.swUnit ||
      ex.v1 !== calculation.v1 || ex.v1Unit !== c.v1Unit ||
      ex.v2 !== calculation.v2 || ex.v2Unit !== c.v2Unit ||
      ex.v3 !== calculation.v3 || ex.v3Unit !== c.v3Unit ||
      ex.v4 !== calculation.v4 || ex.v4Unit !== c.v4Unit ||
      ex.v5 !== calculation.v5 || ex.v5Unit !== c.v5Unit ||
      ex.v6 !== calculation.v6 || ex.v6Unit !== c.v6Unit ||
      ex.v7 !== calculation.v7 || ex.v7Unit !== c.v7Unit ||
      newResult !== calculation.calculationResult ||
      newLabel !== calculation.label ||
      calculation.calculationResultUnit !== RESULT_UNIT
    ) {
      onUpdate({
        ...calculation,
        ...ex,
        calculationResult: newResult,
        calculationResultUnit: RESULT_UNIT,
        label: newLabel,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    selectedSamplePrep,
    calculation.instrumentConcentrationSample,
    calculation.instrumentConcentrationSampleUnit,
    calculation.instrumentConcentrationBlank,
    calculation.instrumentConcentrationBlankUnit,
  ]);
  // ─── Field update helper ──────────────────────────────────────────────────
  const handleField = (field: keyof CalculationIcpms, value: string | null) => {
    if (isLocked) return;
    onUpdate({ ...calculation, [field]: value });
  };

  // ─── Derived display numbers (all normalised) ─────────────────────────────
  const rawSampleNum = parseFloat(calculation.instrumentConcentrationSample);
  const rawBlankNum = parseFloat(calculation.instrumentConcentrationBlank);
  const samplePpm = toCanonicalPpm(rawSampleNum, calculation.instrumentConcentrationSampleUnit);
  const blankPpm = toCanonicalPpm(rawBlankNum, calculation.instrumentConcentrationBlankUnit);
  const swEff = toCanonicalG(parseFloat(calculation.sw ?? ""), c.swUnit);
  const v1Ml = hasVal(calculation.v1)
    ? toCanonicalML(parseFloat(calculation.v1!), c.v1Unit)
    : null;

  // ─── Missing fields ───────────────────────────────────────────────────────
  const missingFields: string[] = [];
  if (!hasVal(calculation.instrumentConcentrationSample)) missingFields.push("Sample Concentration");
  if (!hasVal(calculation.instrumentConcentrationBlank)) missingFields.push("Blank Concentration");

  // ─── Pass / Fail ──────────────────────────────────────────────────────────
  const getPassFail = (): "pass" | "fail" | null => {
    if (!calculation.calculationResult) return null;
    const v = parseFloat(calculation.calculationResult);
    if (!Number.isFinite(v)) return null;
    const min = calculation.acceptanceLimitMin ? parseFloat(calculation.acceptanceLimitMin) : null;
    const max = calculation.acceptanceLimitMax ? parseFloat(calculation.acceptanceLimitMax) : null;
    if (min === null && max === null) return null;
    return (min === null || v >= min) && (max === null || v <= max) ? "pass" : "fail";
  };
  const passFail = getPassFail();

  // Dynamic symbolic numerator label
  const formulaParts: string[] = [];
  if (v1Active) formulaParts.push("Volume Makeup (V1)");
  if (df1Active) formulaParts.push("DF1");
  if (df2Active) formulaParts.push("DF2");
  if (df3Active) formulaParts.push("DF3");
  const formulaNumerator =
    formulaParts.length > 0
      ? `(Instrument Conc. Sample − Instrument Conc. Blank) × ${formulaParts.join(" × ")}`
      : "(Instrument Conc. Sample − Instrument Conc. Blank)";

  // ─── Sub-components ───────────────────────────────────────────────────────
  const PrepChip = ({
    label, value, unit,
  }: { label: string; value: string | null; unit?: string }) => {
    const empty = !hasVal(value);
    return (
      <div className={`rounded p-2.5 border ${empty ? "bg-amber-50 border-amber-200" : "bg-emerald-50 border-emerald-200"}`}>
        <p className={`text-[10px] font-bold uppercase tracking-wider mb-0.5 ${empty ? "text-amber-600" : "text-emerald-700"}`}>
          {label}
        </p>
        {empty ? (
          <p className="text-[10px] text-amber-600 font-semibold italic">Not filled (×1)</p>
        ) : (
          <p className="text-sm font-bold text-gray-900">
            {fmt4(value)}{" "}
            {unit && <span className="text-xs font-normal text-gray-500">{unit}</span>}
          </p>
        )}
      </div>
    );
  };

  const DFChip = ({
    label, makeup, makeupUnit, take, takeUnit, makeupLabel, takeLabel,
  }: {
    label: string;
    makeup: string | null; makeupUnit?: string | null;
    take: string | null; takeUnit?: string | null;
    makeupLabel: string; takeLabel: string;
  }) => {
    const df = calcDF(makeup, makeupUnit, take, takeUnit);
    const ready = Number.isFinite(df);
    return (
      <div className={`rounded p-2.5 border ${ready ? "bg-blue-50 border-blue-200" : "bg-gray-50 border-gray-200"}`}>
        <p className={`text-[10px] font-bold uppercase tracking-wider mb-0.5 ${ready ? "text-blue-700" : "text-gray-400"}`}>
          {label}
        </p>
        <p className="text-sm font-bold text-gray-900">
          {ready ? fmtN4(df) : "—"}
        </p>
        <p className="text-[10px] text-gray-500">{makeupLabel} / {takeLabel}</p>
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white rounded-xl shadow-lg border-2 border-emerald-200 overflow-hidden mb-6"
    >
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
              <p className="text-xs text-emerald-100">ICP-MS (Food) — Content (mg/Kg) calculation</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <motion.button onClick={() => setIsExpanded(!isExpanded)} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} className="p-2 hover:bg-white/20 rounded-lg transition-colors">
              <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 0.3, ease: "easeInOut" }}>
                <ChevronDown className="w-5 h-5 text-white" />
              </motion.div>
            </motion.button>
            {!isLocked && (
              <motion.button
                onClick={(e) => { e.stopPropagation(); onRemove(); }}
                whileHover={{ scale: 1.1, rotate: 5 }} whileTap={{ scale: 0.9 }}
                className="p-2 bg-white/20 rounded-lg transition-all duration-200 border border-white/30"
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
                <h4 className="text-sm font-bold text-gray-900 mb-1">Formula</h4>
                <p className="text-[10px] text-gray-500 mb-3">
                  DF1 = V3/V2 &nbsp;|&nbsp; DF2 = V5/V4 &nbsp;|&nbsp; DF3 = V7/V6
                </p>
                <div className="bg-gray-50 rounded p-3">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 flex flex-col items-center">
                      <div className="text-center border-b-2 border-black pb-2 mb-2 px-2 w-full">
                        <p className="text-xs font-mono text-black break-words">{formulaNumerator}</p>
                      </div>
                      <div className="text-center px-2 w-full">
                        <p className="text-xs font-mono text-black">Sample Weight (SW1) × 1000</p>
                      </div>
                    </div>
                    <span className="text-sm font-bold text-black shrink-0">= {RESULT_UNIT}</span>
                  </div>
                </div>
              </div>

              {/* ── Sample Preparation Selector ── */}
              <div className="bg-gradient-to-r from-emerald-50 to-slate-50 rounded-lg p-4 border-2 border-emerald-200">
                <label className="block text-sm font-bold text-gray-700 mb-2">Select Sample Preparation</label>
                <CustomDropdown
                  options={samplePreparations.map((prep) => ({ value: prep.label, label: prep.label }))}
                  value={calculation.selectedSamplePreparationLabel || ""}
                  onChange={(value) => handleField("selectedSamplePreparationLabel", value)}
                  placeholder="Select sample preparation..."
                  colorScheme="emerald"
                />
              </div>

              {/* ── Instrument Concentration ── */}
              <div className="bg-gradient-to-r from-emerald-50 to-slate-50 rounded-lg p-4 border-2 border-emerald-200">
                <h5 className="text-sm font-bold text-gray-700 mb-3">Instrument Concentration</h5>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="min-w-0">
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">Sample</label>
                    <div className="flex gap-2">
                      <input
                        type="number" step="any"
                        value={calculation.instrumentConcentrationSample}
                        readOnly={isLocked}
                        onChange={(e) => handleField("instrumentConcentrationSample", e.target.value)}
                        onWheel={(e) => e.currentTarget.blur()}
                        placeholder="Enter value"
                        className={`flex-1 min-w-0 px-3 py-2 bg-white border rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-emerald-400 ${!calculation.instrumentConcentrationSample ? "border-amber-400" : "border-emerald-300"}`}
                      />
                      <div className="w-24 shrink-0">
                        <CustomDropdown options={concUnitOptions} value={calculation.instrumentConcentrationSampleUnit} onChange={(v) => handleField("instrumentConcentrationSampleUnit", v)} placeholder="Unit" colorScheme="emerald" />
                      </div>
                    </div>
                    {/* Show normalised ppb hint when entered in a non-ppb unit */}
                    {hasVal(calculation.instrumentConcentrationSample) &&
                      calculation.instrumentConcentrationSampleUnit !== "ppb" &&
                      calculation.instrumentConcentrationSampleUnit !== "μg/L"}
                    {!calculation.instrumentConcentrationSample && (
                      <p className="text-[10px] text-amber-600 mt-1 flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> Required</p>
                    )}
                  </div>
                  <div className="min-w-0">
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">Blank</label>
                    <div className="flex gap-2">
                      <input
                        type="number" step="any"
                        value={calculation.instrumentConcentrationBlank}
                        readOnly={isLocked}
                        onChange={(e) => handleField("instrumentConcentrationBlank", e.target.value)}
                        onWheel={(e) => e.currentTarget.blur()}
                        placeholder="Enter value"
                        className={`flex-1 min-w-0 px-3 py-2 bg-white border rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-emerald-400 ${!calculation.instrumentConcentrationBlank ? "border-amber-400" : "border-emerald-300"}`}
                      />
                      <div className="w-24 shrink-0">
                        <CustomDropdown options={concUnitOptions} value={calculation.instrumentConcentrationBlankUnit} onChange={(v) => handleField("instrumentConcentrationBlankUnit", v)} placeholder="Unit" colorScheme="emerald" />
                      </div>
                    </div>
                    {hasVal(calculation.instrumentConcentrationBlank) &&
                      calculation.instrumentConcentrationBlankUnit !== "ppb" &&
                      calculation.instrumentConcentrationBlankUnit !== "μg/L"}
                    {!calculation.instrumentConcentrationBlank && (
                      <p className="text-[10px] text-amber-600 mt-1 flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> Required</p>
                    )}
                  </div>
                </div>
              </div>

              {/* ── Formula Derivation ── */}
              <div className="bg-white rounded-lg border-2 border-emerald-200 overflow-hidden">
                <div className="bg-gradient-to-r from-emerald-700 via-emerald-800 to-slate-900 px-4 py-2">
                  <h5 className="text-sm font-bold text-white">Formula Derivation</h5>
                </div>
                <div className="p-5 space-y-4">

                  {/* V values grid — chips show the value + unit the user entered */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <PrepChip label="SW1 (Sample Wt.)" value={calculation.sw} unit={c.swUnit || "g"} />
                    <PrepChip label="V1 (Vol. Makeup)" value={calculation.v1} unit={c.v1Unit || "mL"} />
                    <PrepChip label="V2 (2nd Dil. Take)" value={calculation.v2} unit={c.v2Unit || "mL"} />
                    <PrepChip label="V3 (2nd Dil. Makeup)" value={calculation.v3} unit={c.v3Unit || "mL"} />
                    <PrepChip label="V4 (3rd Dil. Take)" value={calculation.v4} unit={c.v4Unit || "mL"} />
                    <PrepChip label="V5 (3rd Dil. Makeup)" value={calculation.v5} unit={c.v5Unit || "mL"} />
                    <DFChip
                      label="DF1 = V3/V2"
                      makeup={calculation.v3} makeupUnit={c.v3Unit}
                      take={calculation.v2} takeUnit={c.v2Unit}
                      makeupLabel="V3" takeLabel="V2"
                    />
                    <DFChip
                      label="DF2 = V5/V4"
                      makeup={calculation.v5} makeupUnit={c.v5Unit}
                      take={calculation.v4} takeUnit={c.v4Unit}
                      makeupLabel="V5" takeLabel="V4"
                    />
                  </div>

                  {/* Numeric formula — uses canonical-unit values */}
                  {Number.isFinite(samplePpm) && Number.isFinite(blankPpm) && (
                    <div className="bg-emerald-50/60 rounded-lg p-4 border border-emerald-200">
                      <div className="flex flex-col items-center">
                        <div className="text-center border-b-2 border-black pb-2 mb-2 px-2 w-full">
                          <p className="text-xs font-mono text-black break-words">
                            ({fmtN4(samplePpm)} ppm − {fmtN4(blankPpm)} ppm)
                            {v1Active && v1Ml !== null ? ` × ${fmtN4(v1Ml)} mL` : ""}
                            {df1Active && df1Val !== null ? ` × ${fmtN4(df1Val)}` : ""}
                            {df2Active && df2Val !== null ? ` × ${fmtN4(df2Val)}` : ""}
                            {df3Active && df3Val !== null ? ` × ${fmtN4(df3Val)}` : ""}
                          </p>
                        </div>
                        <div className="text-center px-2 w-full">
                          <p className="text-xs font-mono text-black">{fmtN4(swEff)} g</p>
                        </div>
                      </div>
                    </div>
                  )}

                  <p className="text-xs text-center text-gray-600">
                    Output unit is fixed at{" "}
                    <strong>{RESULT_UNIT}</strong>.
                  </p>
                </div>
              </div>

              {/* ── Acceptance Limit ── */}
              <div className="bg-gradient-to-r from-emerald-50 to-slate-50 rounded-lg p-4 border-2 border-emerald-200">
                <h5 className="text-sm font-bold text-gray-700 mb-3">Acceptance Limit</h5>
                <div className="flex items-center gap-2">
                  <input type="number" step="any" value={calculation.acceptanceLimitMin ?? ""} readOnly={isLocked} onChange={(e) => handleField("acceptanceLimitMin", e.target.value)} onWheel={(e) => e.currentTarget.blur()} placeholder="Min limit" className="w-full px-3 py-2 bg-white border border-emerald-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-emerald-400" />
                  <span className="text-xs font-semibold text-gray-500 shrink-0">to</span>
                  <input type="number" step="any" value={calculation.acceptanceLimitMax ?? ""} readOnly={isLocked} onChange={(e) => handleField("acceptanceLimitMax", e.target.value)} onWheel={(e) => e.currentTarget.blur()} placeholder="Max limit" className="w-full px-3 py-2 bg-white border border-emerald-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-emerald-400" />
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

              {/* ── Result ── */}
              {calculation.calculationResult && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-lg shadow-lg border-2 border-emerald-300 overflow-hidden">
                  <div className="bg-gradient-to-r from-emerald-700 via-emerald-800 to-slate-900 px-4 py-2 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-white" />
                    <h6 className="text-sm font-bold text-white">RESULT</h6>
                  </div>
                  <div className="flex items-center justify-between p-4 flex-wrap gap-3">
                    <div className="flex items-baseline gap-2">
                      <p className="text-3xl font-bold text-gray-800">
                        {calculation.calculationResult ? trimZeros(parseFloat(calculation.calculationResult)) : ""}
                      </p>
                      <span className="text-lg font-semibold text-gray-600">{RESULT_UNIT}</span>
                    </div>
                    {passFail && (
                      <span className={`inline-block px-3 py-1 rounded-full text-sm font-bold ${passFail === "pass" ? "bg-green-100 text-green-800 border border-green-300" : "bg-red-100 text-red-800 border border-red-300"}`}>
                        {passFail === "pass" ? "Pass" : "Fail"}
                      </span>
                    )}
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

export default CalculationDetailIcpms;