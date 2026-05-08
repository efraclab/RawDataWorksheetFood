import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Calculator, Trash, CheckCircle2, AlertTriangle } from "lucide-react";
import type { CalculationZptoShampoo } from "../../../preparation_models/metal/CalculationZptoShampoo";
import type { SamplePreparationMetal } from "../../../preparation_models/metal/SamplePreparationMetal";
import CustomDropdown from "../../shared/CustomDropdown";

interface Props {
  calculation: CalculationZptoShampoo;
  samplePreparations: SamplePreparationMetal[];
  onUpdate: (updated: CalculationZptoShampoo) => void;
  onRemove: () => void;
  isLocked?: boolean;
}

const concUnitOptions = [
  { value: "ppb", label: "ppb" },
  { value: "ppm", label: "ppm" },
  { value: "μg/L", label: "μg/L" },
  { value: "mg/L", label: "mg/L" },
];

const weightUnitOptions = [
  { value: "mg", label: "mg" },
  { value: "g", label: "g" },
  { value: "kg", label: "kg" },
];

const RESULT_UNIT = "% of L.C.";

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

const toCanonicalGrams = (value: number, unit: string): number => {
  if (!Number.isFinite(value)) return value;
  switch (unit) {
    case "mg":
      return value / 1000;
    case "kg":
      return value * 1000;
    case "g":
    default:
      return value;
  }
};

const fmt4 = (v: string | null | undefined): string => {
  if (v === null || v === undefined || v === "") return "—";
  const n = parseFloat(v);
  if (!Number.isFinite(n)) return v;
  return n.toFixed(4);
};

const fmtN4 = (n: number): string => (Number.isFinite(n) ? n.toFixed(4) : "—");

const prepNum = (v: string | null): number => {
  const n = parseFloat(v ?? "");
  return Number.isFinite(n) ? n : 1;
};
const isPrepEmpty = (v: string | null): boolean =>
  !v || v === "" || !Number.isFinite(parseFloat(v));

const calcDF = (makeup: string | null, take: string | null): number => {
  const m = parseFloat(makeup ?? "");
  const t = parseFloat(take ?? "");
  return Number.isFinite(m) && Number.isFinite(t) && t !== 0 ? m / t : NaN;
};

const CalculationDetailZptoShampoo: React.FC<Props> = ({
  calculation,
  samplePreparations,
  onUpdate,
  onRemove,
  isLocked = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const PrepChip = ({
    label,
    value,
    unit,
  }: {
    label: string;
    value: string | null;
    unit?: string;
  }) => {
    const empty = isPrepEmpty(value);
    return (
      <div
        className={`rounded p-2.5 border ${
          empty ? "bg-amber-50 border-amber-200" : "bg-emerald-50 border-emerald-200"
        }`}
      >
        <p
          className={`text-[10px] font-bold uppercase tracking-wider mb-0.5 ${
            empty ? "text-amber-600" : "text-emerald-700"
          }`}
        >
          {label}
        </p>
        {empty ? (
          <p className="text-[10px] text-amber-600 font-semibold italic">
            Not filled (×1)
          </p>
        ) : (
          <p className="text-sm font-bold text-gray-900">
            {fmt4(value)}{" "}
            {unit && (
              <span className="text-xs font-normal text-gray-500">{unit}</span>
            )}
          </p>
        )}
      </div>
    );
  };

  const DFChip = ({
    label,
    makeup,
    take,
    makeupLabel,
    takeLabel,
  }: {
    label: string;
    makeup: string | null;
    take: string | null;
    makeupLabel: string;
    takeLabel: string;
  }) => {
    const df = calcDF(makeup, take);
    const ready = Number.isFinite(df);
    return (
      <div
        className={`rounded p-2.5 border ${
          ready ? "bg-blue-50 border-blue-200" : "bg-gray-50 border-gray-200"
        }`}
      >
        <p
          className={`text-[10px] font-bold uppercase tracking-wider mb-0.5 ${
            ready ? "text-blue-700" : "text-gray-400"
          }`}
        >
          {label}
        </p>
        <p className="text-sm font-bold text-gray-900">
          {ready ? df.toFixed(4) : "—"}
        </p>
        <p className="text-[10px] text-gray-500">
          {makeupLabel} / {takeLabel}
        </p>
      </div>
    );
  };

  const selectedSamplePrep = samplePreparations.find(
    (prep) => prep.label === calculation.selectedSamplePreparationLabel
  );

  const extractValues = (sp?: SamplePreparationMetal) => {
    if (!sp) return { sw1: null, v1: null, v2: null, v3: null };
    const stepsArr = Array.isArray(sp.steps) ? sp.steps : [];
    const weighing = stepsArr.find((s) => s.name === "Weighing");
    const d1 = stepsArr.find((s) => s.name === "1st Dilution");
    const d2 = stepsArr.find((s) => s.name === "2nd Dilution");
    return {
      sw1: weighing?.value1 ?? null,
      v1: d1?.value1 ?? null,   // Volume Makeup
      v2: d2?.value1 ?? null,   // 2nd Dil take
      v3: d2?.value2 ?? null,   // 2nd Dil makeup → DF = V3/V2
    };
  };

  // ZPTO Shampoo formula: % of L.C. =
  //   (Sample − Blank) × V1 × DF × Specific Gravity × MW₁ × 100
  //   ────────────────────────────────────────────────────────────
  //              SW1 × 10000 × MW₂ × Label Claim
  //
  // DF = V3/V2 (2nd dilution makeup / take)
  const compute = (
    instSample: string,
    instSampleUnit: string,
    instBlank: string,
    instBlankUnit: string,
    sw1: string | null,
    v1: string | null,
    v2: string | null,
    v3: string | null,
    specificGravity: string,
    molecularWeight1: string,
    molecularWeight2: string,
    labelClaim: string
  ): string | null => {
    const sample = toCanonicalPpm(parseFloat(instSample), instSampleUnit);
    if (!Number.isFinite(sample)) return null;
    const blank = toCanonicalPpm(parseFloat(instBlank), instBlankUnit);
    if (!Number.isFinite(blank)) return null;
    const sw1n = prepNum(sw1);
    const v1n = prepNum(v1);
    const v2n = prepNum(v2);
    const v3n = prepNum(v3);
    const df = v3n / v2n;
    const sg = parseFloat(specificGravity);
    const mw1 = parseFloat(molecularWeight1);
    const mw2 = parseFloat(molecularWeight2);
    const lcN = parseFloat(labelClaim);
    if (
      !Number.isFinite(sg) ||
      !Number.isFinite(mw1) ||
      !Number.isFinite(mw2) ||
      mw2 <= 0 ||
      !Number.isFinite(lcN) ||
      lcN <= 0
    ) {
      return null;
    }
    const numerator = (sample - blank) * v1n * df * sg * mw1 * 100;
    const denominator = sw1n * 10000 * mw2 * lcN;
    const result = numerator / denominator;
    if (!Number.isFinite(result)) return null;
    return result.toFixed(4);
  };

  useEffect(() => {
    const extracted = extractValues(selectedSamplePrep);

    const newResult = compute(
      calculation.instrumentConcentrationSample,
      calculation.instrumentConcentrationSampleUnit,
      calculation.instrumentConcentrationBlank,
      calculation.instrumentConcentrationBlankUnit,
      extracted.sw1,
      extracted.v1,
      extracted.v2,
      extracted.v3,
      calculation.specificGravity,
      calculation.molecularWeight1,
      calculation.molecularWeight2,
      calculation.labelClaim
    );

    const newLabel = selectedSamplePrep
      ? `Calculation for ${selectedSamplePrep.label}`
      : calculation.label;

    if (
      extracted.sw1 !== calculation.sw1 ||
      extracted.v1 !== calculation.v1 ||
      extracted.v2 !== calculation.v2 ||
      extracted.v3 !== calculation.v3 ||
      newResult !== calculation.calculationResult ||
      newLabel !== calculation.label ||
      calculation.calculationResultUnit !== RESULT_UNIT
    ) {
      onUpdate({
        ...calculation,
        sw1: extracted.sw1,
        v1: extracted.v1,
        v2: extracted.v2,
        v3: extracted.v3,
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
    calculation.specificGravity,
    calculation.molecularWeight1,
    calculation.molecularWeight2,
    calculation.labelClaim,
  ]);

  const handleField = (
    field: keyof CalculationZptoShampoo,
    value: string | null
  ) => {
    if (isLocked) return;
    onUpdate({ ...calculation, [field]: value });
  };

  // Auto-compute SG suggestion from W1/W2/W3 for display
  const w1g = toCanonicalGrams(parseFloat(calculation.w1EmptyPycnometer), calculation.w1Unit);
  const w2g = toCanonicalGrams(parseFloat(calculation.w2PycnometerWithSample), calculation.w2Unit);
  const w3g = toCanonicalGrams(parseFloat(calculation.w3PycnometerWithWater), calculation.w3Unit);
  const sgFromPycnometer =
    Number.isFinite(w1g) && Number.isFinite(w2g) && Number.isFinite(w3g) && w3g - w1g !== 0
      ? (w2g - w1g) / (w3g - w1g)
      : NaN;

  const sw1Eff = prepNum(calculation.sw1);
  const v1Eff = prepNum(calculation.v1);
  const v2Eff = prepNum(calculation.v2);
  const v3Eff = prepNum(calculation.v3);
  const dfEff = v3Eff / v2Eff;

  const sampleNum = toCanonicalPpm(
    parseFloat(calculation.instrumentConcentrationSample),
    calculation.instrumentConcentrationSampleUnit
  );
  const blankEff = toCanonicalPpm(
    parseFloat(calculation.instrumentConcentrationBlank),
    calculation.instrumentConcentrationBlankUnit
  );
  const sgNum = parseFloat(calculation.specificGravity);
  const mw1Num = parseFloat(calculation.molecularWeight1);
  const mw2Num = parseFloat(calculation.molecularWeight2);
  const lcNum = parseFloat(calculation.labelClaim);

  const missingFields: string[] = [];
  if (!Number.isFinite(parseFloat(calculation.instrumentConcentrationSample)))
    missingFields.push("Sample Concentration");
  if (!calculation.instrumentConcentrationBlank)
    missingFields.push("Blank Concentration");
  if (!Number.isFinite(sgNum))
    missingFields.push("Specific Gravity");
  if (!Number.isFinite(mw1Num))
    missingFields.push("MW₁ (Compound)");
  if (!Number.isFinite(mw2Num) || mw2Num <= 0)
    missingFields.push("MW₂ (Element)");
  if (!Number.isFinite(lcNum) || lcNum <= 0)
    missingFields.push("Label Claim");

  const getPassFail = (): "pass" | "fail" | null => {
    if (!calculation.calculationResult) return null;
    const v = parseFloat(calculation.calculationResult);
    if (!Number.isFinite(v)) return null;
    const min =
      calculation.acceptanceLimitMin && calculation.acceptanceLimitMin !== ""
        ? parseFloat(calculation.acceptanceLimitMin)
        : null;
    const max =
      calculation.acceptanceLimitMax && calculation.acceptanceLimitMax !== ""
        ? parseFloat(calculation.acceptanceLimitMax)
        : null;
    if (min === null && max === null) return null;
    return (min === null || v >= min) && (max === null || v <= max)
      ? "pass"
      : "fail";
  };
  const passFail = getPassFail();

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
              className="relative group"
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
                ZPTO Shampoo — % of Label Claim calculation
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

            {!isLocked && (
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
            )}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="p-6 bg-gradient-to-b from-gray-50 to-white space-y-6">
              {/* Formula header */}
              <div className="bg-white rounded-lg p-4 border-2 border-emerald-200 shadow-sm">
                <h4 className="text-sm font-bold text-gray-900 mb-3">
                  Content in (% of L.C.)
                </h4>
                <div className="bg-gray-50 rounded p-3">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 flex flex-col items-center">
                      <div className="text-center border-b-2 border-black pb-2 mb-2 px-2 w-full">
                        <p className="text-xs font-mono text-black break-words">
                          (Inst. Conc. Sample − Blank) × Vol. Makeup × DF × Specific Gravity × MW₁ × 100
                        </p>
                        <p className="text-[10px] text-gray-500 mt-0.5">
                          DF = V3/V2 (2nd dil. makeup / take)
                        </p>
                      </div>
                      <div className="text-center px-2 w-full">
                        <p className="text-xs font-mono text-black break-words">
                          Sample Weight (SW1) × 10000 × MW₂ × Label Claim
                        </p>
                      </div>
                    </div>
                    <span className="text-sm font-bold text-black">
                      % of L.C.
                    </span>
                  </div>
                </div>
              </div>

              {/* Sample Preparation selector */}
              <div className="bg-gradient-to-r from-emerald-50 to-slate-50 rounded-lg p-4 border-2 border-emerald-200">
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Select Sample Preparation
                </label>
                <CustomDropdown
                  options={samplePreparations.map((prep) => ({
                    value: prep.label,
                    label: prep.label,
                  }))}
                  value={calculation.selectedSamplePreparationLabel || ""}
                  onChange={(value) =>
                    handleField("selectedSamplePreparationLabel", value)
                  }
                  placeholder="Select sample preparation..."
                  colorScheme="emerald"
                />
              </div>

              {/* Instrument Concentration Inputs */}
              <div className="bg-gradient-to-r from-emerald-50 to-slate-50 rounded-lg p-4 border-2 border-emerald-200">
                <h5 className="text-sm font-bold text-gray-700 mb-3">
                  Instrument Concentration
                </h5>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="min-w-0">
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                      Sample
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        step="any"
                        value={calculation.instrumentConcentrationSample}
                        readOnly={isLocked}
                        onChange={(e) =>
                          handleField("instrumentConcentrationSample", e.target.value)
                        }
                        onWheel={(e) => e.currentTarget.blur()}
                        placeholder="0.0"
                        className={`flex-1 min-w-0 px-3 py-2 bg-white border rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-emerald-400 ${
                          !calculation.instrumentConcentrationSample
                            ? "border-amber-400"
                            : "border-emerald-300"
                        }`}
                      />
                      <div className="w-24 shrink-0">
                        <CustomDropdown
                          options={concUnitOptions}
                          value={calculation.instrumentConcentrationSampleUnit}
                          onChange={(v) =>
                            handleField("instrumentConcentrationSampleUnit", v)
                          }
                          placeholder="Unit"
                          colorScheme="emerald"
                        />
                      </div>
                    </div>
                    {!calculation.instrumentConcentrationSample && (
                      <p className="text-[10px] text-amber-600 mt-1 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" /> Required for calculation
                      </p>
                    )}
                  </div>
                  <div className="min-w-0">
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                      Blank
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        step="any"
                        value={calculation.instrumentConcentrationBlank}
                        readOnly={isLocked}
                        onChange={(e) =>
                          handleField("instrumentConcentrationBlank", e.target.value)
                        }
                        onWheel={(e) => e.currentTarget.blur()}
                        placeholder="0.0"
                        className={`flex-1 min-w-0 px-3 py-2 bg-white border rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-emerald-400 ${
                          !calculation.instrumentConcentrationBlank
                            ? "border-amber-400"
                            : "border-emerald-300"
                        }`}
                      />
                      <div className="w-24 shrink-0">
                        <CustomDropdown
                          options={concUnitOptions}
                          value={calculation.instrumentConcentrationBlankUnit}
                          onChange={(v) =>
                            handleField("instrumentConcentrationBlankUnit", v)
                          }
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
                </div>
              </div>

              {/* Pycnometer weights for Specific Gravity */}
              <div className="bg-gradient-to-r from-emerald-50 to-slate-50 rounded-lg p-4 border-2 border-emerald-200">
                <h5 className="text-sm font-bold text-gray-700 mb-3">
                  Pycnometer Weights &amp; Specific Gravity
                </h5>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="min-w-0">
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                      W1 — Empty Pycnometer
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        step="any"
                        value={calculation.w1EmptyPycnometer}
                        readOnly={isLocked}
                        onChange={(e) => handleField("w1EmptyPycnometer", e.target.value)}
                        onWheel={(e) => e.currentTarget.blur()}
                        placeholder="0.0"
                        className="flex-1 min-w-0 px-3 py-2 bg-white border border-emerald-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-emerald-400"
                      />
                      <div className="w-20 shrink-0">
                        <CustomDropdown
                          options={weightUnitOptions}
                          value={calculation.w1Unit}
                          onChange={(v) => handleField("w1Unit", v)}
                          placeholder="Unit"
                          colorScheme="emerald"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="min-w-0">
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                      W2 — Pycnometer + Sample
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        step="any"
                        value={calculation.w2PycnometerWithSample}
                        readOnly={isLocked}
                        onChange={(e) => handleField("w2PycnometerWithSample", e.target.value)}
                        onWheel={(e) => e.currentTarget.blur()}
                        placeholder="0.0"
                        className="flex-1 min-w-0 px-3 py-2 bg-white border border-emerald-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-emerald-400"
                      />
                      <div className="w-20 shrink-0">
                        <CustomDropdown
                          options={weightUnitOptions}
                          value={calculation.w2Unit}
                          onChange={(v) => handleField("w2Unit", v)}
                          placeholder="Unit"
                          colorScheme="emerald"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="min-w-0">
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                      W3 — Pycnometer + Water
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        step="any"
                        value={calculation.w3PycnometerWithWater}
                        readOnly={isLocked}
                        onChange={(e) => handleField("w3PycnometerWithWater", e.target.value)}
                        onWheel={(e) => e.currentTarget.blur()}
                        placeholder="0.0"
                        className="flex-1 min-w-0 px-3 py-2 bg-white border border-emerald-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-emerald-400"
                      />
                      <div className="w-20 shrink-0">
                        <CustomDropdown
                          options={weightUnitOptions}
                          value={calculation.w3Unit}
                          onChange={(v) => handleField("w3Unit", v)}
                          placeholder="Unit"
                          colorScheme="emerald"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="min-w-0 md:col-span-2 lg:col-span-3">
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                      Specific Gravity{" "}
                      {Number.isFinite(sgFromPycnometer) && (
                        <span className="text-[10px] text-gray-500 font-normal">
                          (W2−W1)/(W3−W1) = {fmtN4(sgFromPycnometer)}
                        </span>
                      )}
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={calculation.specificGravity}
                      readOnly={isLocked}
                      onChange={(e) => handleField("specificGravity", e.target.value)}
                      onWheel={(e) => e.currentTarget.blur()}
                      placeholder="0.0"
                      className={`w-full px-3 py-2 bg-white border rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-emerald-400 ${
                        !calculation.specificGravity ? "border-amber-400" : "border-emerald-300"
                      }`}
                    />
                    {!calculation.specificGravity && (
                      <p className="text-[10px] text-amber-600 mt-1 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" /> Required for calculation
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Molecular Weights & Label Claim */}
              <div className="bg-gradient-to-r from-emerald-50 to-slate-50 rounded-lg p-4 border-2 border-emerald-200">
                <h5 className="text-sm font-bold text-gray-700 mb-3">
                  Molecular Weights &amp; Label Claim
                </h5>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="min-w-0">
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                      MW₁ (Compound)
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={calculation.molecularWeight1}
                      readOnly={isLocked}
                      onChange={(e) => handleField("molecularWeight1", e.target.value)}
                      onWheel={(e) => e.currentTarget.blur()}
                      placeholder="0.0"
                      className={`w-full px-3 py-2 bg-white border rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-emerald-400 ${
                        !calculation.molecularWeight1 ? "border-amber-400" : "border-emerald-300"
                      }`}
                    />
                    {!calculation.molecularWeight1 && (
                      <p className="text-[10px] text-amber-600 mt-1 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" /> Required for calculation
                      </p>
                    )}
                  </div>
                  <div className="min-w-0">
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                      MW₂ (Element)
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={calculation.molecularWeight2}
                      readOnly={isLocked}
                      onChange={(e) => handleField("molecularWeight2", e.target.value)}
                      onWheel={(e) => e.currentTarget.blur()}
                      placeholder="0.0"
                      className={`w-full px-3 py-2 bg-white border rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-emerald-400 ${
                        !calculation.molecularWeight2 ? "border-amber-400" : "border-emerald-300"
                      }`}
                    />
                    {!calculation.molecularWeight2 && (
                      <p className="text-[10px] text-amber-600 mt-1 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" /> Required for calculation
                      </p>
                    )}
                  </div>
                  <div className="min-w-0">
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                      Label Claim
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={calculation.labelClaim}
                      readOnly={isLocked}
                      onChange={(e) => handleField("labelClaim", e.target.value)}
                      onWheel={(e) => e.currentTarget.blur()}
                      placeholder="0.0"
                      className={`w-full px-3 py-2 bg-white border rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-emerald-400 ${
                        !calculation.labelClaim ? "border-amber-400" : "border-emerald-300"
                      }`}
                    />
                    {!calculation.labelClaim && (
                      <p className="text-[10px] text-amber-600 mt-1 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" /> Required for calculation
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Formula Breakdown */}
              <div className="bg-white rounded-lg border-2 border-emerald-200 overflow-hidden">
                <div className="bg-gradient-to-r from-emerald-700 via-emerald-800 to-slate-900 px-4 py-2">
                  <h5 className="text-sm font-bold text-white">
                    Formula Breakdown
                  </h5>
                </div>
                <div className="p-5 space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <PrepChip label="SW1 (Sample Wt.)" value={calculation.sw1} unit="g" />
                    <PrepChip label="V1 (Vol. Makeup)" value={calculation.v1} unit="mL" />
                    <PrepChip label="V2 (2nd Dil. Take)" value={calculation.v2} unit="mL" />
                    <PrepChip label="V3 (2nd Dil. Makeup)" value={calculation.v3} unit="mL" />
                    <DFChip
                      label="DF = V3/V2"
                      makeup={calculation.v3}
                      take={calculation.v2}
                      makeupLabel="V3"
                      takeLabel="V2"
                    />
                    <div className="bg-emerald-50 rounded p-2.5 border border-emerald-200">
                      <p className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider mb-0.5">
                        Specific Gravity
                      </p>
                      <p className="text-sm font-bold text-gray-900">
                        {fmt4(calculation.specificGravity)}
                      </p>
                    </div>
                    <div className="bg-emerald-50 rounded p-2.5 border border-emerald-200">
                      <p className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider mb-0.5">
                        MW₁
                      </p>
                      <p className="text-sm font-bold text-gray-900">
                        {fmt4(calculation.molecularWeight1)}
                      </p>
                    </div>
                    <div className="bg-emerald-50 rounded p-2.5 border border-emerald-200">
                      <p className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider mb-0.5">
                        MW₂
                      </p>
                      <p className="text-sm font-bold text-gray-900">
                        {fmt4(calculation.molecularWeight2)}
                      </p>
                    </div>
                    <div className="bg-emerald-50 rounded p-2.5 border border-emerald-200">
                      <p className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider mb-0.5">
                        Label Claim
                      </p>
                      <p className="text-sm font-bold text-gray-900">
                        {fmt4(calculation.labelClaim)}
                      </p>
                    </div>
                  </div>

                  {/* Numeric derivation */}
                  <div className="bg-emerald-50/60 rounded-lg p-4 border border-emerald-200">
                    <div className="flex flex-col items-center">
                      <div className="text-center border-b-2 border-black pb-2 mb-2 px-2 w-full">
                        <p className="text-xs font-mono text-black break-words">
                          ({fmtN4(sampleNum)} − {fmtN4(blankEff)}) ×{" "}
                          {fmtN4(v1Eff)} × {fmtN4(dfEff)} × {fmtN4(sgNum)} ×{" "}
                          {fmtN4(mw1Num)} × 100
                        </p>
                        <p className="text-[10px] text-gray-500 mt-0.5">
                          (Sample/Blank in ppm; DF=V3/V2={fmtN4(dfEff)})
                        </p>
                      </div>
                      <div className="text-center px-2 w-full">
                        <p className="text-xs font-mono text-black break-words">
                          {fmtN4(sw1Eff)} × 10000 × {fmtN4(mw2Num)} × {fmtN4(lcNum)}
                        </p>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-center text-gray-600">
                    Result is computed as numerator divided by denominator. Output unit is fixed at{" "}
                    <strong>{RESULT_UNIT}</strong>.
                  </p>
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
                    step="any"
                    value={calculation.acceptanceLimitMin ?? ""}
                    readOnly={isLocked}
                    onChange={(e) =>
                      handleField("acceptanceLimitMin", e.target.value)
                    }
                    onWheel={(e) => e.currentTarget.blur()}
                    placeholder="Enter min limit"
                    className="w-full px-3 py-2 bg-white border border-emerald-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  />
                  <span className="text-xs font-semibold text-gray-500 shrink-0">
                    to
                  </span>
                  <input
                    type="number"
                    step="any"
                    value={calculation.acceptanceLimitMax ?? ""}
                    readOnly={isLocked}
                    onChange={(e) =>
                      handleField("acceptanceLimitMax", e.target.value)
                    }
                    onWheel={(e) => e.currentTarget.blur()}
                    placeholder="Enter max limit"
                    className="w-full px-3 py-2 bg-white border border-emerald-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  />
                </div>
              </div>

              {/* Missing fields warning */}
              {missingFields.length > 0 && (
                <div className="bg-amber-50 border-2 border-amber-200 rounded-lg p-4 flex gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-bold text-amber-800 mb-1">
                      Required for result:
                    </p>
                    {missingFields.map((f) => (
                      <p key={f} className="text-xs text-amber-700">
                        • {f}
                      </p>
                    ))}
                  </div>
                </div>
              )}

              {/* Result */}
              {calculation.calculationResult && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-lg shadow-lg border-2 border-emerald-300 overflow-hidden"
                >
                  <div className="bg-gradient-to-r from-emerald-700 via-emerald-800 to-slate-900 px-4 py-2 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-white" />
                    <h6 className="text-sm font-bold text-white">RESULT</h6>
                  </div>
                  <div className="flex items-center justify-between p-4 flex-wrap gap-3">
                    <div className="flex items-baseline gap-2">
                      <p className="text-3xl font-bold text-gray-800">
                        {calculation.calculationResult}
                      </p>
                      <span className="text-lg font-semibold text-gray-600">
                        {RESULT_UNIT}
                      </span>
                    </div>
                    {passFail && (
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-sm font-bold ${
                          passFail === "pass"
                            ? "bg-green-100 text-green-800 border border-green-300"
                            : "bg-red-100 text-red-800 border border-red-300"
                        }`}
                      >
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

export default CalculationDetailZptoShampoo;
