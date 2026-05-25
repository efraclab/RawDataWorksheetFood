import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Calculator, Trash, CheckCircle2, AlertTriangle } from "lucide-react";
import type { CalculationSodiumLactate } from "../../../preparation_models/metal/CalculationSodiumLactate";
import type { SamplePreparationMetal } from "../../../preparation_models/metal/SamplePreparationMetal";
import CustomDropdown from "../../shared/CustomDropdown";

interface Props {
  calculation: CalculationSodiumLactate;
  samplePreparations: SamplePreparationMetal[];
  onUpdate: (updated: CalculationSodiumLactate) => void;
  onRemove: () => void;
  isLocked?: boolean;
}

const concUnitOptions = [
  { value: "ppb", label: "ppb" },
  { value: "ppm", label: "ppm" },
  { value: "μg/L", label: "μg/L" },
  { value: "mg/L", label: "mg/L" },
];

const RESULT_UNIT = "%";

const toCanonicalPpm = (value: number, unit: string): number => {
  if (!Number.isFinite(value)) return value;
  switch (unit) {
    case "ppm":
    case "mg/L":
      return value;
    case "ppb":
    case "μg/L":
      return value / 1000;
    default:
      return value;
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
  if (!Number.isFinite(n)) return v;
  return n.toFixed(4);
};

const fmtN4 = (n: number): string => (Number.isFinite(n) ? n.toFixed(4) : "—");

const hasVal = (v: string | null | undefined): boolean =>
  !!v && v.trim() !== "" && Number.isFinite(parseFloat(v));

const trimZeros = (n: number): string =>
  Number.isFinite(n) ? parseFloat(n.toFixed(4)).toString() : "—";

const extractValues = (sp?: SamplePreparationMetal) => {
  const empty = {
    v1: null as string | null, v1Unit: null as string | null,
    v2: null as string | null, v2Unit: null as string | null,
    v3: null as string | null, v3Unit: null as string | null,
    v4: null as string | null, v4Unit: null as string | null,
    v5: null as string | null, v5Unit: null as string | null,
    v6: null as string | null, v6Unit: null as string | null,
    v7: null as string | null, v7Unit: null as string | null,
  };
  if (!sp) return empty;
  const steps = Array.isArray(sp.steps) ? sp.steps : [];
  const d1 = steps.find((s) => s.name === "1st Dilution");
  const d2 = steps.find((s) => s.name === "2nd Dilution");
  const d3 = steps.find((s) => s.name === "3rd Dilution");
  const d4 = steps.find((s) => s.name === "4th Dilution");
  return {
    v1: d1?.value1 ?? null, v1Unit: (d1 as any)?.unit1 ?? "mL",
    v2: d2?.value1 ?? null, v2Unit: (d2 as any)?.unit1 ?? "mL",
    v3: d2?.value2 ?? null, v3Unit: (d2 as any)?.unit2 ?? "mL",
    v4: d3?.value1 ?? null, v4Unit: (d3 as any)?.unit1 ?? "mL",
    v5: d3?.value2 ?? null, v5Unit: (d3 as any)?.unit2 ?? "mL",
    v6: d4?.value1 ?? null, v6Unit: (d4 as any)?.unit1 ?? "mL",
    v7: d4?.value2 ?? null, v7Unit: (d4 as any)?.unit2 ?? "mL",
  };
};

const CalculationDetailSodiumLactate: React.FC<Props> = ({
  calculation,
  samplePreparations,
  onUpdate,
  onRemove,
  isLocked = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const selectedSamplePrep = samplePreparations.find(
    (prep) => prep.label === calculation.selectedSamplePreparationLabel
  );

  // Cast to any once to access unit fields stored on the calculation
  const c = calculation as any;

  // Canonical mL values for every volume (used for flags, DFs, and display)
  const v1Ml = toCanonicalML(parseFloat(calculation.v1 ?? ""), c.v1Unit);
  const v2Ml = toCanonicalML(parseFloat(calculation.v2 ?? ""), c.v2Unit);
  const v3Ml = toCanonicalML(parseFloat(calculation.v3 ?? ""), c.v3Unit);
  const v4Ml = toCanonicalML(parseFloat(calculation.v4 ?? ""), c.v4Unit);
  const v5Ml = toCanonicalML(parseFloat(calculation.v5 ?? ""), c.v5Unit);
  const v6Ml = toCanonicalML(parseFloat(calculation.v6 ?? ""), c.v6Unit);
  const v7Ml = toCanonicalML(parseFloat(calculation.v7 ?? ""), c.v7Unit);

  // Active flags — DF1=V3/V2, DF2=V5/V4, DF3=V7/V6
  const v1Active  = Number.isFinite(v1Ml);
  const df1Active = Number.isFinite(v2Ml) && Number.isFinite(v3Ml);
  const df2Active = Number.isFinite(v4Ml) && Number.isFinite(v5Ml);
  const df3Active = Number.isFinite(v6Ml) && Number.isFinite(v7Ml);

  const df1 = df1Active && v2Ml !== 0 ? v3Ml / v2Ml : null;  // DF1 = V3/V2 (mL/mL)
  const df2 = df2Active && v4Ml !== 0 ? v5Ml / v4Ml : null;  // DF2 = V5/V4
  const df3 = df3Active && v6Ml !== 0 ? v7Ml / v6Ml : null;  // DF3 = V7/V6

  // Sodium Lactate formula: Content (%) =
  //   (Sample_ppm − Blank_ppm) × V1[mL] × DF1 × DF2 × DF3
  //   ──────────────────────────────────────────────────────
  //                         10000
  //
  // All volume units normalised to mL before arithmetic.
  // V1[mL] used directly; DF1 = V3[mL]/V2[mL], DF2 = V5[mL]/V4[mL], DF3 = V7[mL]/V6[mL].
  // Missing volumes treated as ×1.
  const computeResult = (
    instSample: string,
    instSampleUnit: string,
    instBlank: string,
    instBlankUnit: string,
    v1: string | null, v1Unit: string | null,
    v2: string | null, v2Unit: string | null,
    v3: string | null, v3Unit: string | null,
    v4: string | null, v4Unit: string | null,
    v5: string | null, v5Unit: string | null,
    v6: string | null, v6Unit: string | null,
    v7: string | null, v7Unit: string | null,
  ): string | null => {
    const sample = toCanonicalPpm(parseFloat(instSample), instSampleUnit);
    if (!Number.isFinite(sample)) return null;
    const blankRaw = parseFloat(instBlank);
    if (!Number.isFinite(blankRaw)) return null;
    const blank = toCanonicalPpm(blankRaw, instBlankUnit);

    // V1 → mL (missing → ×1)
    const v1Ml = toCanonicalML(parseFloat(v1 ?? ""), v1Unit);
    const v1n  = Number.isFinite(v1Ml) ? v1Ml : 1;

    // DFs: take & makeup both → mL, then ratio (missing pair → ×1)
    const v2Ml = toCanonicalML(parseFloat(v2 ?? ""), v2Unit);
    const v3Ml = toCanonicalML(parseFloat(v3 ?? ""), v3Unit);
    const df1n = Number.isFinite(v2Ml) && Number.isFinite(v3Ml) && v2Ml !== 0 ? v3Ml / v2Ml : 1;

    const v4Ml = toCanonicalML(parseFloat(v4 ?? ""), v4Unit);
    const v5Ml = toCanonicalML(parseFloat(v5 ?? ""), v5Unit);
    const df2n = Number.isFinite(v4Ml) && Number.isFinite(v5Ml) && v4Ml !== 0 ? v5Ml / v4Ml : 1;

    const v6Ml = toCanonicalML(parseFloat(v6 ?? ""), v6Unit);
    const v7Ml = toCanonicalML(parseFloat(v7 ?? ""), v7Unit);
    const df3n = Number.isFinite(v6Ml) && Number.isFinite(v7Ml) && v6Ml !== 0 ? v7Ml / v6Ml : 1;

    const result = ((sample - blank) * v1n * df1n * df2n * df3n) / 10000;
    if (!Number.isFinite(result)) return null;
    return result.toFixedNoRound(4).toFixed(3);
  };

  useEffect(() => {
    const ex = extractValues(selectedSamplePrep);
    const newResult = computeResult(
      calculation.instrumentConcentrationSample,
      calculation.instrumentConcentrationSampleUnit,
      calculation.instrumentConcentrationBlank,
      calculation.instrumentConcentrationBlankUnit,
      ex.v1, ex.v1Unit, ex.v2, ex.v2Unit, ex.v3, ex.v3Unit,
      ex.v4, ex.v4Unit, ex.v5, ex.v5Unit, ex.v6, ex.v6Unit, ex.v7, ex.v7Unit,
    );
    
    const newLabel = calculation.label;

    if (
      ex.v1 !== calculation.v1 || ex.v2 !== calculation.v2 ||
      ex.v3 !== calculation.v3 || ex.v4 !== calculation.v4 ||
      ex.v5 !== calculation.v5 || ex.v6 !== calculation.v6 ||
      ex.v7 !== calculation.v7 ||
      newResult !== calculation.calculationResult ||
      newLabel !== calculation.label ||
      calculation.calculationResultUnit !== RESULT_UNIT
    ) {
      onUpdate({
        ...calculation,
        v1: ex.v1, v2: ex.v2, v3: ex.v3, v4: ex.v4,
        v5: ex.v5, v6: ex.v6, v7: ex.v7,
        ...(ex.v1Unit  ? { v1Unit:  ex.v1Unit  } : {}),
        ...(ex.v2Unit  ? { v2Unit:  ex.v2Unit  } : {}),
        ...(ex.v3Unit  ? { v3Unit:  ex.v3Unit  } : {}),
        ...(ex.v4Unit  ? { v4Unit:  ex.v4Unit  } : {}),
        ...(ex.v5Unit  ? { v5Unit:  ex.v5Unit  } : {}),
        ...(ex.v6Unit  ? { v6Unit:  ex.v6Unit  } : {}),
        ...(ex.v7Unit  ? { v7Unit:  ex.v7Unit  } : {}),
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

  const handleField = (field: keyof CalculationSodiumLactate, value: string | null) => {
    if (isLocked) return;
    onUpdate({ ...calculation, [field]: value });
  };

  // Derived display values
  const samplePpm = toCanonicalPpm(
    parseFloat(calculation.instrumentConcentrationSample),
    calculation.instrumentConcentrationSampleUnit,
  );
  const blankPpm = toCanonicalPpm(
    parseFloat(calculation.instrumentConcentrationBlank),
    calculation.instrumentConcentrationBlankUnit,
  );

  // Dynamic formula numerator — only shows terms with actual values
  const formulaParts: string[] = [];
  if (v1Active)  formulaParts.push("Volume Makeup(V1)");
  if (df1Active) formulaParts.push("DF1");
  if (df2Active) formulaParts.push("DF2");
  if (df3Active) formulaParts.push("DF3");
  const formulaNumerator =
    formulaParts.length > 0
      ? `(Instrument Conc. Sample − Instrument Conc. Blank) × ${formulaParts.join(" × ")}`
      : "(Instrument Conc. Sample − Instrument Conc. Blank)";

  const missingFields: string[] = [];
  if (!calculation.instrumentConcentrationSample) missingFields.push("Sample Concentration");
  if (!calculation.instrumentConcentrationBlank)  missingFields.push("Blank Concentration");

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

  const PrepChip = ({ label, value, unit }: { label: string; value: string | null; unit?: string }) => {
    const empty = !hasVal(value);
    return (
      <div className={`rounded p-2.5 border ${empty ? "bg-amber-50 border-amber-200" : "bg-emerald-50 border-emerald-200"}`}>
        <p className={`text-[10px] font-bold uppercase tracking-wider mb-0.5 ${empty ? "text-amber-600" : "text-emerald-700"}`}>{label}</p>
        {empty ? (
          <p className="text-[10px] text-amber-600 font-semibold italic">Not filled</p>
        ) : (
          <p className="text-sm font-bold text-gray-900">{fmt4(value)} {unit && <span className="text-xs font-normal text-gray-500">{unit}</span>}</p>
        )}
      </div>
    );
  };

  const DFChip = ({ label, numerator, denominator, value }: { label: string; numerator: string | null; denominator: string | null; value: number | null }) => {
    const active = value !== null;
    return (
      <div className={`rounded p-2.5 border ${active ? "bg-blue-50 border-blue-200" : "bg-gray-50 border-gray-200"}`}>
        <p className={`text-[10px] font-bold uppercase tracking-wider mb-0.5 ${active ? "text-blue-700" : "text-gray-400"}`}>{label}</p>
        {active ? (
          <>
            <p className="text-[10px] text-gray-500">{fmt4(numerator)} / {fmt4(denominator)}</p>
            <p className="text-sm font-bold text-gray-900">{fmtN4(value!)}</p>
          </>
        ) : (
          <p className="text-[10px] text-gray-400 italic">Not active (×1)</p>
        )}
      </div>
    );
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="bg-white rounded-xl shadow-lg border-2 border-emerald-200 overflow-hidden mb-6">
      <div className={`relative bg-gradient-to-r from-emerald-700 via-emerald-800 to-slate-900 ${isExpanded ? "rounded-t-lg" : "rounded-lg"}`}>
        <div className="relative flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-4 flex-1 cursor-pointer select-none" onClick={() => setIsExpanded(!isExpanded)}>
            <motion.div animate={{ rotate: isExpanded ? 0 : 360 }} transition={{ duration: 0.5 }} className="relative group">
              <div className="absolute inset-0 bg-white/30 rounded-lg blur-md" />
              <div className="relative p-2 bg-white/20 rounded-lg backdrop-blur-md border border-white/30"><Calculator className="w-5 h-5 text-white" /></div>
            </motion.div>
            <div>
              <h4 className="text-sm font-semibold text-white tracking-wide">{calculation.label}</h4>
              <p className="text-xs text-emerald-100">Sodium Lactate — % calculation</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <motion.button onClick={() => setIsExpanded(!isExpanded)} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} className="p-2 hover:bg-white/20 rounded-lg transition-colors">
              <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 0.3, ease: "easeInOut" }}><ChevronDown className="w-5 h-5 text-white" /></motion.div>
            </motion.button>
            {!isLocked && (
              <motion.button onClick={(e) => { e.stopPropagation(); onRemove(); }} whileHover={{ scale: 1.1, rotate: 5 }} whileTap={{ scale: 0.9 }} className="p-2 bg-white/20 rounded-lg transition-all duration-200 border border-white/30" title={`Remove ${calculation.label}`}>
                <Trash className="w-4 h-4 text-white" />
              </motion.button>
            )}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }}>
            <div className="p-6 bg-gradient-to-b from-gray-50 to-white space-y-6">

              {/* Formula header */}
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
                        <p className="text-xs font-mono text-black">10000</p>
                      </div>
                    </div>
                    <span className="text-sm font-bold text-black">%</span>
                  </div>
                </div>
              </div>

              {/* Sample Preparation selector */}
              <div className="bg-gradient-to-r from-emerald-50 to-slate-50 rounded-lg p-4 border-2 border-emerald-200">
                <label className="block text-sm font-bold text-gray-700 mb-2">Select Sample Preparation</label>
                <CustomDropdown options={samplePreparations.map((prep) => ({ value: prep.label, label: prep.label }))} value={calculation.selectedSamplePreparationLabel || ""} onChange={(value) => handleField("selectedSamplePreparationLabel", value)} placeholder="Select sample preparation..." colorScheme="emerald" />
              </div>

              {/* Instrument Concentration Inputs */}
              <div className="bg-gradient-to-r from-emerald-50 to-slate-50 rounded-lg p-4 border-2 border-emerald-200">
                <h5 className="text-sm font-bold text-gray-700 mb-3">Instrument Concentration</h5>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">Sample</label>
                    <div className="flex gap-2">
                      <input type="number" step="any" value={calculation.instrumentConcentrationSample} readOnly={isLocked} onChange={(e) => handleField("instrumentConcentrationSample", e.target.value)} onWheel={(e) => e.currentTarget.blur()} placeholder="0.0" className={`flex-1 px-3 py-2 bg-white border rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-emerald-400 ${!calculation.instrumentConcentrationSample ? "border-amber-400" : "border-emerald-300"}`} />
                      <div className="w-24 shrink-0"><CustomDropdown options={concUnitOptions} value={calculation.instrumentConcentrationSampleUnit} onChange={(v) => handleField("instrumentConcentrationSampleUnit", v)} placeholder="Unit" colorScheme="emerald" /></div>
                    </div>
                    {!calculation.instrumentConcentrationSample && <p className="text-[10px] text-amber-600 mt-1 flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> Required</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">Blank</label>
                    <div className="flex gap-2">
                      <input type="number" step="any" value={calculation.instrumentConcentrationBlank} readOnly={isLocked} onChange={(e) => handleField("instrumentConcentrationBlank", e.target.value)} onWheel={(e) => e.currentTarget.blur()} placeholder="0.0" className={`flex-1 px-3 py-2 bg-white border rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-emerald-400 ${!calculation.instrumentConcentrationBlank ? "border-amber-400" : "border-emerald-300"}`} />
                      <div className="w-24 shrink-0"><CustomDropdown options={concUnitOptions} value={calculation.instrumentConcentrationBlankUnit} onChange={(v) => handleField("instrumentConcentrationBlankUnit", v)} placeholder="Unit" colorScheme="emerald" /></div>
                    </div>
                    {!calculation.instrumentConcentrationBlank && <p className="text-[10px] text-amber-600 mt-1 flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> Required</p>}
                  </div>
                </div>
              </div>

              {/* Formula Derivation */}
              <div className="bg-white rounded-lg border-2 border-emerald-200 overflow-hidden">
                <div className="bg-gradient-to-r from-emerald-700 via-emerald-800 to-slate-900 px-4 py-2">
                  <h5 className="text-sm font-bold text-white">Formula Derivation</h5>
                </div>
                <div className="p-5 space-y-4">

                  {/* Prep Values */}
                  <div>
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Prep Values</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      <PrepChip label="Volume Makeup (V1)" value={Number.isFinite(v1Ml) ? v1Ml.toFixed(4) : null} unit="mL" />
                      <PrepChip label="V2" value={Number.isFinite(v2Ml) ? v2Ml.toFixed(4) : null} unit="mL" />
                      <PrepChip label="V3" value={Number.isFinite(v3Ml) ? v3Ml.toFixed(4) : null} unit="mL" />
                      <PrepChip label="V4" value={Number.isFinite(v4Ml) ? v4Ml.toFixed(4) : null} unit="mL" />
                      <PrepChip label="V5" value={Number.isFinite(v5Ml) ? v5Ml.toFixed(4) : null} unit="mL" />
                      <PrepChip label="V6" value={Number.isFinite(v6Ml) ? v6Ml.toFixed(4) : null} unit="mL" />
                      <PrepChip label="V7" value={Number.isFinite(v7Ml) ? v7Ml.toFixed(4) : null} unit="mL" />
                      <DFChip label="DF1 = V3/V2" numerator={Number.isFinite(v3Ml) ? v3Ml.toFixed(4) : null} denominator={Number.isFinite(v2Ml) ? v2Ml.toFixed(4) : null} value={df1} />
                      <DFChip label="DF2 = V5/V4" numerator={Number.isFinite(v5Ml) ? v5Ml.toFixed(4) : null} denominator={Number.isFinite(v4Ml) ? v4Ml.toFixed(4) : null} value={df2} />
                      <DFChip label="DF3 = V7/V6" numerator={Number.isFinite(v7Ml) ? v7Ml.toFixed(4) : null} denominator={Number.isFinite(v6Ml) ? v6Ml.toFixed(4) : null} value={df3} />
                    </div>
                  </div>

                  {/* Live numeric breakdown */}
                  <div className="bg-emerald-50/60 rounded-lg p-4 border border-emerald-200">
                    <div className="flex flex-col items-center">
                      <div className="text-center border-b-2 border-black pb-2 mb-2 px-2 w-full">
                        <p className="text-xs font-mono text-black break-words">
                          ({fmtN4(samplePpm)} − {fmtN4(blankPpm)})
                          {v1Active ? ` × ${fmtN4(v1Ml)}` : ""}
                          {df1Active && df1 !== null ? ` × ${fmtN4(df1)}` : ""}
                          {df2Active && df2 !== null ? ` × ${fmtN4(df2)}` : ""}
                          {df3Active && df3 !== null ? ` × ${fmtN4(df3)}` : ""}
                        </p>
                        <p className="text-[10px] text-gray-500 mt-0.5">(Sample/Blank in ppm; all volumes in mL; missing V1 or DFs treated as ×1)</p>
                      </div>
                      <div className="text-center px-2 w-full">
                        <p className="text-xs font-mono text-black">10000</p>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-center text-gray-600">Output unit is fixed at <strong>{RESULT_UNIT}</strong>.</p>
                </div>
              </div>

              {/* Acceptance Limit */}
              <div className="bg-gradient-to-r from-emerald-50 to-slate-50 rounded-lg p-4 border-2 border-emerald-200">
                <h5 className="text-sm font-bold text-gray-700 mb-3">Acceptance Limit</h5>
                <div className="flex items-center gap-2">
                  <input type="number" step="any" value={calculation.acceptanceLimitMin ?? ""} readOnly={isLocked} onChange={(e) => handleField("acceptanceLimitMin", e.target.value)} onWheel={(e) => e.currentTarget.blur()} placeholder="Min limit" className="w-full px-3 py-2 bg-white border border-emerald-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-emerald-400" />
                  <span className="text-xs font-semibold text-gray-500 shrink-0">to</span>
                  <input type="number" step="any" value={calculation.acceptanceLimitMax ?? ""} readOnly={isLocked} onChange={(e) => handleField("acceptanceLimitMax", e.target.value)} onWheel={(e) => e.currentTarget.blur()} placeholder="Max limit" className="w-full px-3 py-2 bg-white border border-emerald-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-emerald-400" />
                </div>
              </div>

              {/* Missing fields warning */}
              {missingFields.length > 0 && (
                <div className="bg-amber-50 border-2 border-amber-200 rounded-lg p-4 flex gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-bold text-amber-800 mb-1">Required for result:</p>
                    {missingFields.map((f) => <p key={f} className="text-xs text-amber-700">• {f}</p>)}
                  </div>
                </div>
              )}

              {/* Result */}
              {calculation.calculationResult && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-lg shadow-lg border-2 border-emerald-300 overflow-hidden">
                  <div className="bg-gradient-to-r from-emerald-700 via-emerald-800 to-slate-900 px-4 py-2 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-white" /><h6 className="text-sm font-bold text-white">RESULT</h6>
                  </div>
                  <div className="flex items-center justify-between p-4 flex-wrap gap-3">
                    <div className="flex items-baseline gap-2">
                      <p className="text-3xl font-bold text-gray-800">{calculation.calculationResult ? trimZeros(parseFloat(calculation.calculationResult)) : ""}</p>
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

export default CalculationDetailSodiumLactate;