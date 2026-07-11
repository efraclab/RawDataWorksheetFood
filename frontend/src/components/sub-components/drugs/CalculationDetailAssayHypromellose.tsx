import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Calculator, Trash, CheckCircle2 } from "lucide-react";
import type { CalculationAssayHypromellose } from "../../../preparation_models/drugs/Calculationassayhypromellose.ts";
import type { StandardPreparationHypromellose } from "../../../preparation_models/drugs/Standardpreparationhypromellose.ts";
import type { SamplePreparationHypromellose } from "../../../preparation_models/drugs/Samplepreparationhypromellose.ts";
import CustomDropdown from "../../shared/CustomDropdown";

interface CalculationDetailAssayHypromelloseProps {
  calculation: CalculationAssayHypromellose;
  standardPreparations: StandardPreparationHypromellose[];
  samplePreparations: SamplePreparationHypromellose[];
  onFieldChange: (
    calculationId: number,
    field: keyof CalculationAssayHypromellose,
    value: string | number | null
  ) => void;
  onRemove: () => void;
  role: string;
}

// Truncate (not round) to N decimals - matches the Excel sheet's TRUNC() behavior.
// Plain `Math.trunc(value*factor)/factor` is NOT safe: due to binary floating-point
// representation, a value that is mathematically exactly e.g. 0.1362 can come out as
// 1361.9999999999998 after multiplying by 10000, and Math.trunc would then wrongly
// floor it down to 0.1361. Rounding off that representation noise first (to 8dp,
// well past the precision we actually need) before truncating fixes this.
const truncate = (value: number, decimals: number): number => {
  const factor = Math.pow(10, decimals);
  const shifted = value * factor;
  const corrected = Math.round(shifted * 1e8) / 1e8;
  return Math.trunc(corrected) / factor;
};

const toNum = (v: string | null | undefined): number => {
  const n = parseFloat(String(v ?? ""));
  return isNaN(n) ? 0 : n;
};

const CalculationDetailAssayHypromellose: React.FC<
  CalculationDetailAssayHypromelloseProps
> = ({
  calculation,
  standardPreparations,
  samplePreparations,
  onFieldChange,
  onRemove,
  role,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const handleChange = (
    field: keyof CalculationAssayHypromellose,
    value: string
  ) => {
    onFieldChange(calculation.id, field, value);
  };

  // NOTE: The 6-replicate "% Area Ratio RSD" tables above are a precision/system-suitability
  // check only (per the official assay worksheet). The Standard Block (row 31) and Sample Block
  // (row 34) area values are separate, independently entered readings — they are NOT derived
  // from the mean of these replicates. Auto-fetching them from the replicate mean would silently
  // overwrite real data and produce results that don't match the official calculation sheet.

  const performCalculation = () => {
    // ── Replicate area ratios (MI/IS and IPI/IS) ──
    // Excel truncates EACH individual ratio to 4 decimals first (=TRUNC(C20/F20,4)),
    // THEN averages the truncated values. Averaging full-precision ratios first gives
    // a different (wrong, vs. the reference sheet) final Mean/SD.
    const miRatios: number[] = [];
    const ipiRatios: number[] = [];
    for (let i = 1; i <= 6; i++) {
      const area = (calculation as any)[`areaOfMI${i}`];
      const areaIPI = (calculation as any)[`areaOfIPI${i}`];
      const is = (calculation as any)[`internalStandardArea${i}`];
      if (area && is) miRatios.push(truncate(toNum(area) / toNum(is), 4));
      if (areaIPI && is) ipiRatios.push(truncate(toNum(areaIPI) / toNum(is), 4));
    }

    const mean = (arr: number[]) =>
      arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;
    const stdev = (arr: number[], m: number) =>
      arr.length > 1
        ? Math.sqrt(
            arr.reduce((acc, v) => acc + Math.pow(v - m, 2), 0) / (arr.length - 1)
          )
        : 0;

    const miMeanRaw = mean(miRatios);
    const miMean = truncate(miMeanRaw, 4);
    const miSD = truncate(stdev(miRatios, miMeanRaw), 4);
    const miRSD = miMean !== 0 ? truncate((miSD / miMean) * 100, 2) : 0;

    const ipiMeanRaw = mean(ipiRatios);
    const ipiMean = truncate(ipiMeanRaw, 4);
    const ipiSD = truncate(stdev(ipiRatios, ipiMeanRaw), 4);
    const ipiRSD = ipiMean !== 0 ? truncate((ipiSD / ipiMean) * 100, 2) : 0;

    onFieldChange(calculation.id, "areaRatioMIMean", miMean.toString());
    onFieldChange(calculation.id, "areaRatioMISD", miSD.toString());
    onFieldChange(calculation.id, "areaRatioMIRSD", miRSD.toString());
    onFieldChange(calculation.id, "areaRatioIPIMean", ipiMean.toString());
    onFieldChange(calculation.id, "areaRatioIPISD", ipiSD.toString());
    onFieldChange(calculation.id, "areaRatioIPIRSD", ipiRSD.toString());

    // ── Sample replicate area ratios (MI/IS and IPI/IS) - same TRUNC-per-ratio-first method ──
    const sampleMiRatios: number[] = [];
    const sampleIpiRatios: number[] = [];
    for (let i = 1; i <= 6; i++) {
      const area = (calculation as any)[`sampleAreaOfMI${i}`];
      const areaIPI = (calculation as any)[`sampleAreaOfIPI${i}`];
      const is = (calculation as any)[`sampleInternalStandardArea${i}`];
      if (area && is) sampleMiRatios.push(truncate(toNum(area) / toNum(is), 4));
      if (areaIPI && is) sampleIpiRatios.push(truncate(toNum(areaIPI) / toNum(is), 4));
    }

    const sampleMiMeanRaw = mean(sampleMiRatios);
    const sampleMiMean = truncate(sampleMiMeanRaw, 4);
    const sampleMiSD = truncate(stdev(sampleMiRatios, sampleMiMeanRaw), 4);
    const sampleMiRSD = sampleMiMean !== 0 ? truncate((sampleMiSD / sampleMiMean) * 100, 2) : 0;

    const sampleIpiMeanRaw = mean(sampleIpiRatios);
    const sampleIpiMean = truncate(sampleIpiMeanRaw, 4);
    const sampleIpiSD = truncate(stdev(sampleIpiRatios, sampleIpiMeanRaw), 4);
    const sampleIpiRSD =
      sampleIpiMean !== 0 ? truncate((sampleIpiSD / sampleIpiMean) * 100, 2) : 0;

    onFieldChange(calculation.id, "areaRatioSampleMIMean", sampleMiMean.toString());
    onFieldChange(calculation.id, "areaRatioSampleMISD", sampleMiSD.toString());
    onFieldChange(calculation.id, "areaRatioSampleMIRSD", sampleMiRSD.toString());
    onFieldChange(calculation.id, "areaRatioSampleIPIMean", sampleIpiMean.toString());
    onFieldChange(calculation.id, "areaRatioSampleIPISD", sampleIpiSD.toString());
    onFieldChange(calculation.id, "areaRatioSampleIPIRSD", sampleIpiRSD.toString());

    // ── Standard block (QSa, QSb) ──
    const QSa = truncate(
      toNum(calculation.stdAreaOfMI) / toNum(calculation.stdInternalStandardArea),
      4
    );
    const QSb = truncate(
      toNum(calculation.stdAreaOfIPI) / toNum(calculation.stdInternalStandardArea),
      4
    );
    onFieldChange(calculation.id, "areaRatioQSa", QSa.toString());
    onFieldChange(calculation.id, "areaRatioQSb", QSb.toString());

    // ── Sample block (QTa, QTb) ──
    const QTa = truncate(
      toNum(calculation.sampleAreaOfMI) / toNum(calculation.sampleInternalStandardArea),
      4
    );
    const QTb = truncate(
      toNum(calculation.sampleAreaOfIPI) / toNum(calculation.sampleInternalStandardArea),
      4
    );
    onFieldChange(calculation.id, "areaRatioQTa", QTa.toString());
    onFieldChange(calculation.id, "areaRatioQTb", QTb.toString());

    // ── Final results, mirroring the Excel formulas exactly ──
    const WSa = toNum(calculation.methylIodideStdWt);
    const WSb = toNum(calculation.isopropylIodideStdWt);
    const Wu = toNum(calculation.sampleWeight);
    const Pa = toNum(calculation.methylIodidePurity);
    const Pb = toNum(calculation.isopropylIodidePurity);
    const LOD = toNum(calculation.lodPercent);

    let methoxyAsIs = 0;
    let hydroxypropoxyAsIs = 0;

    if (QSa !== 0 && Wu !== 0) {
      methoxyAsIs = truncate((21.864 * (QTa / QSa) * (WSa / Wu) * (Pa / 100)), 3);
    }
    if (QSb !== 0 && Wu !== 0) {
      hydroxypropoxyAsIs = truncate((44.17 * (QTb / QSb) * (WSb / Wu) * (Pb / 100)), 3);
    }

    const methoxyDried =
      LOD !== 100 ? truncate((methoxyAsIs * 100) / (100 - LOD), 3) : 0;
    const hydroxypropoxyDried =
      LOD !== 100 ? truncate((hydroxypropoxyAsIs * 100) / (100 - LOD), 3) : 0;

    onFieldChange(calculation.id, "methoxyResultAsIs", methoxyAsIs.toString());
    onFieldChange(calculation.id, "methoxyResultDried", methoxyDried.toString());
    onFieldChange(calculation.id, "methoxyResultUnit", "%");
    onFieldChange(
      calculation.id,
      "hydroxypropoxyResultAsIs",
      hydroxypropoxyAsIs.toString()
    );
    onFieldChange(
      calculation.id,
      "hydroxypropoxyResultDried",
      hydroxypropoxyDried.toString()
    );
    onFieldChange(calculation.id, "hydroxypropoxyResultUnit", "%");
  };

  const methoxyLimitMin = toNum(calculation.methoxyLimitMin);
  const methoxyLimitMax = toNum(calculation.methoxyLimitMax);
  const hydroxypropoxyLimitMin = toNum(calculation.hydroxypropoxyLimitMin);
  const hydroxypropoxyLimitMax = toNum(calculation.hydroxypropoxyLimitMax);

  const methoxyDriedVal = calculation.methoxyResultDried
    ? parseFloat(calculation.methoxyResultDried)
    : null;
  const hydroxypropoxyDriedVal = calculation.hydroxypropoxyResultDried
    ? parseFloat(calculation.hydroxypropoxyResultDried)
    : null;

  const methoxyPass =
    methoxyDriedVal !== null &&
    methoxyDriedVal >= methoxyLimitMin &&
    methoxyDriedVal <= methoxyLimitMax;
  const hydroxypropoxyPass =
    hydroxypropoxyDriedVal !== null &&
    hydroxypropoxyDriedVal >= hydroxypropoxyLimitMin &&
    hydroxypropoxyDriedVal <= hydroxypropoxyLimitMax;

  const replicateNumberInput = (
    label: string,
    field: keyof CalculationAssayHypromellose
  ) => (
    <input
      key={field}
      type="number"
      step="any"
      value={(calculation as any)[field] ?? ""}
      onChange={(e) => handleChange(field, e.target.value)}
      onWheel={(e) => e.currentTarget.blur()}
      placeholder={label}
      className="w-full px-2 py-2 bg-white border border-emerald-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-emerald-50"
    />
  );

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
                Assay of Hypromellose - Methoxy / Hydroxypropoxy
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

      {isExpanded && (
        <div className="p-6 bg-gradient-to-b from-gray-50 to-white space-y-6">
          {/* Preparation selection - drives auto-fetch of Wu / WSa / WSb */}
          <div className="bg-gradient-to-r from-emerald-50 to-slate-50 rounded-lg p-4 border-2 border-emerald-200">
            <h5 className="text-sm font-bold text-gray-700 mb-3">
              Link Preparations (auto-fills Wu, WSa, WSb below)
            </h5>
            <div className="grid md:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  Standard Preparation
                </label>
                <CustomDropdown
                  options={standardPreparations.map((sp) => ({
                    value: sp.label,
                    label: sp.label,
                  }))}
                  value={calculation.selectedStandardPreparationLabel || ""}
                  onChange={(newValue) =>
                    onFieldChange(
                      calculation.id,
                      "selectedStandardPreparationLabel",
                      newValue
                    )
                  }
                  placeholder="Select Standard Preparation"
                  colorScheme="emerald"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  Sample Preparation
                </label>
                <CustomDropdown
                  options={samplePreparations.map((sp) => ({
                    value: sp.label,
                    label: sp.label,
                  }))}
                  value={calculation.selectedSamplePreparationLabel || ""}
                  onChange={(newValue) =>
                    onFieldChange(
                      calculation.id,
                      "selectedSamplePreparationLabel",
                      newValue
                    )
                  }
                  placeholder="Select Sample Preparation"
                  colorScheme="emerald"
                />
              </div>
            </div>
          </div>

          {/* Reference / method inputs */}
          <div className="bg-gradient-to-r from-emerald-50 to-slate-50 rounded-lg p-4 border-2 border-emerald-200">
            <h5 className="text-sm font-bold text-gray-700 mb-3">
              Standard Batches, Purity & Weights
            </h5>
            <div className="grid md:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  Methyl Iodide Batch No
                </label>
                <input
                  type="text"
                  value={calculation.methylIodideBatchNo || ""}
                  onChange={(e) => handleChange("methylIodideBatchNo", e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-emerald-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-emerald-400"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  Isopropyl Iodide Batch No
                </label>
                <input
                  type="text"
                  value={calculation.isopropylIodideBatchNo || ""}
                  onChange={(e) => handleChange("isopropylIodideBatchNo", e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-emerald-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-emerald-400"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  Sample Weight, Wu (mg)
                </label>
                <input
                  type="number"
                  step="any"
                  value={calculation.sampleWeight || ""}
                  onChange={(e) => handleChange("sampleWeight", e.target.value)}
                  onWheel={(e) => e.currentTarget.blur()}
                  className="w-full px-3 py-2 bg-white border border-emerald-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-emerald-50"
                />
                {calculation.selectedSamplePreparationLabel && (
                  <p className="text-[10px] text-emerald-700 mt-1">
                    Auto-filled from {calculation.selectedSamplePreparationLabel} — edit to override
                  </p>
                )}
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  Methyl Iodide Purity, Pa (%)
                </label>
                <input
                  type="number"
                  step="any"
                  value={calculation.methylIodidePurity || ""}
                  onChange={(e) => handleChange("methylIodidePurity", e.target.value)}
                  onWheel={(e) => e.currentTarget.blur()}
                  className="w-full px-3 py-2 bg-white border border-emerald-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-emerald-400"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  Isopropyl Iodide Purity, Pb (%)
                </label>
                <input
                  type="number"
                  step="any"
                  value={calculation.isopropylIodidePurity || ""}
                  onChange={(e) => handleChange("isopropylIodidePurity", e.target.value)}
                  onWheel={(e) => e.currentTarget.blur()}
                  className="w-full px-3 py-2 bg-white border border-emerald-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-emerald-400"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  LOD of Sample (%)
                </label>
                <input
                  type="number"
                  step="any"
                  value={calculation.lodPercent || ""}
                  onChange={(e) => handleChange("lodPercent", e.target.value)}
                  onWheel={(e) => e.currentTarget.blur()}
                  className="w-full px-3 py-2 bg-white border border-emerald-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-emerald-400"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  Methyl Iodide Std Wt, WSa (mg)
                </label>
                <input
                  type="number"
                  step="any"
                  value={calculation.methylIodideStdWt || ""}
                  onChange={(e) => handleChange("methylIodideStdWt", e.target.value)}
                  onWheel={(e) => e.currentTarget.blur()}
                  className="w-full px-3 py-2 bg-white border border-emerald-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-emerald-400"
                />
                {calculation.selectedStandardPreparationLabel && (
                  <p className="text-[10px] text-emerald-700 mt-1">
                    Auto-filled from {calculation.selectedStandardPreparationLabel} — edit to override
                  </p>
                )}
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  Isopropyl Iodide Std Wt, WSb (mg)
                </label>
                <input
                  type="number"
                  step="any"
                  value={calculation.isopropylIodideStdWt || ""}
                  onChange={(e) => handleChange("isopropylIodideStdWt", e.target.value)}
                  onWheel={(e) => e.currentTarget.blur()}
                  className="w-full px-3 py-2 bg-white border border-emerald-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-emerald-400"
                />
                {calculation.selectedStandardPreparationLabel && (
                  <p className="text-[10px] text-emerald-700 mt-1">
                    Auto-filled from {calculation.selectedStandardPreparationLabel} — edit to override
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Replicate area ratio table */}
          <div className="bg-gradient-to-r from-emerald-50 to-slate-50 rounded-lg p-4 border-2 border-emerald-200">
            <h5 className="text-sm font-bold text-gray-700 mb-3">
              % Area Ratio RSD (6 Replicates)
            </h5>
            <div className="grid grid-cols-3 gap-3 mb-2">
              <span className="text-xs font-semibold text-gray-500">Area of MI</span>
              <span className="text-xs font-semibold text-gray-500">Area of IPI</span>
              <span className="text-xs font-semibold text-gray-500">Internal Standard</span>
            </div>
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="grid grid-cols-3 gap-3 mb-2">
                {replicateNumberInput(`MI ${n}`, `areaOfMI${n}` as keyof CalculationAssayHypromellose)}
                {replicateNumberInput(`IPI ${n}`, `areaOfIPI${n}` as keyof CalculationAssayHypromellose)}
                {replicateNumberInput(
                  `IS ${n}`,
                  `internalStandardArea${n}` as keyof CalculationAssayHypromellose
                )}
              </div>
            ))}

            {calculation.areaRatioMIMean && (
              <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-emerald-200">
                <div className="bg-white rounded-lg p-3 border border-emerald-300">
                  <p className="text-xs font-bold text-gray-700 mb-1">MI Area Ratio</p>
                  <p className="text-xs text-gray-600">
                    Mean: {calculation.areaRatioMIMean} · SD: {calculation.areaRatioMISD} · %RSD:{" "}
                    {calculation.areaRatioMIRSD}
                  </p>
                </div>
                <div className="bg-white rounded-lg p-3 border border-emerald-300">
                  <p className="text-xs font-bold text-gray-700 mb-1">IPI Area Ratio</p>
                  <p className="text-xs text-gray-600">
                    Mean: {calculation.areaRatioIPIMean} · SD: {calculation.areaRatioIPISD} · %RSD:{" "}
                    {calculation.areaRatioIPIRSD}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Sample replicate area ratio table */}
          {/* <div className="bg-gradient-to-r from-emerald-50 to-slate-50 rounded-lg p-4 border-2 border-emerald-200">
            <h5 className="text-sm font-bold text-gray-700 mb-3">
              % Area Ratio RSD (6 Replicates) — Sample Preparation
            </h5>
            <div className="grid grid-cols-3 gap-3 mb-2">
              <span className="text-xs font-semibold text-gray-500">Area of MI</span>
              <span className="text-xs font-semibold text-gray-500">Area of IPI</span>
              <span className="text-xs font-semibold text-gray-500">Internal Standard</span>
            </div>
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="grid grid-cols-3 gap-3 mb-2">
                {replicateNumberInput(
                  `MI ${n}`,
                  `sampleAreaOfMI${n}` as keyof CalculationAssayHypromellose
                )}
                {replicateNumberInput(
                  `IPI ${n}`,
                  `sampleAreaOfIPI${n}` as keyof CalculationAssayHypromellose
                )}
                {replicateNumberInput(
                  `IS ${n}`,
                  `sampleInternalStandardArea${n}` as keyof CalculationAssayHypromellose
                )}
              </div>
            ))}

            {(calculation as any).areaRatioSampleMIMean && (
              <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-emerald-200">
                <div className="bg-white rounded-lg p-3 border border-emerald-300">
                  <p className="text-xs font-bold text-gray-700 mb-1">MI Area Ratio</p>
                  <p className="text-xs text-gray-600">
                    Mean: {(calculation as any).areaRatioSampleMIMean} · SD:{" "}
                    {(calculation as any).areaRatioSampleMISD} · %RSD:{" "}
                    {(calculation as any).areaRatioSampleMIRSD}
                  </p>
                </div>
                <div className="bg-white rounded-lg p-3 border border-emerald-300">
                  <p className="text-xs font-bold text-gray-700 mb-1">IPI Area Ratio</p>
                  <p className="text-xs text-gray-600">
                    Mean: {(calculation as any).areaRatioSampleIPIMean} · SD:{" "}
                    {(calculation as any).areaRatioSampleIPISD} · %RSD:{" "}
                    {(calculation as any).areaRatioSampleIPIRSD}
                  </p>
                </div>
              </div>
            )}
          </div> */}

          {/* Standard & Sample blocks */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-gradient-to-r from-emerald-50 to-slate-50 rounded-lg p-4 border-2 border-emerald-200">
              <h5 className="text-sm font-bold text-gray-700 mb-1">Standard Block</h5>
              <p className="text-[10px] text-gray-500 mb-2">
                Enter separately — this reading is independent of the 6 replicates above
              </p>
              <div className="space-y-2">
                {replicateNumberInput("Std Area of MI", "stdAreaOfMI")}
                {replicateNumberInput("Std Area of IPI", "stdAreaOfIPI")}
                {replicateNumberInput("Std Internal Standard", "stdInternalStandardArea")}
              </div>
              {calculation.areaRatioQSa && (
                <p className="text-xs text-gray-600 mt-2">
                  QSa: {calculation.areaRatioQSa} · QSb: {calculation.areaRatioQSb}
                </p>
              )}
            </div>
            <div className="bg-gradient-to-r from-emerald-50 to-slate-50 rounded-lg p-4 border-2 border-emerald-200">
              <h5 className="text-sm font-bold text-gray-700 mb-1">Sample Block</h5>
              <p className="text-[10px] text-gray-500 mb-2">
                Enter separately — this reading is independent of the 6 replicates above
              </p>
              <div className="space-y-2">
                {replicateNumberInput("Sample Area of MI", "sampleAreaOfMI")}
                {replicateNumberInput("Sample Area of IPI", "sampleAreaOfIPI")}
                {replicateNumberInput("Sample Internal Standard", "sampleInternalStandardArea")}
              </div>
              {calculation.areaRatioQTa && (
                <p className="text-xs text-gray-600 mt-2">
                  QTa: {calculation.areaRatioQTa} · QTb: {calculation.areaRatioQTb}
                </p>
              )}
            </div>
          </div>

          {/* Acceptance limits */}
          <div className="bg-gradient-to-r from-emerald-50 to-slate-50 rounded-lg p-4 border-2 border-emerald-200">
            <h5 className="text-sm font-bold text-gray-700 mb-3">Acceptance Limits</h5>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-semibold text-gray-600 mb-1">Methoxy Content (%)</p>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    step="any"
                    value={calculation.methoxyLimitMin || ""}
                    onChange={(e) => handleChange("methoxyLimitMin", e.target.value)}
                    onWheel={(e) => e.currentTarget.blur()}
                    placeholder="Min"
                    className="w-full px-3 py-2 bg-white border border-emerald-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  />
                  <span className="text-xs text-gray-500">to</span>
                  <input
                    type="number"
                    step="any"
                    value={calculation.methoxyLimitMax || ""}
                    onChange={(e) => handleChange("methoxyLimitMax", e.target.value)}
                    onWheel={(e) => e.currentTarget.blur()}
                    placeholder="Max"
                    className="w-full px-3 py-2 bg-white border border-emerald-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  />
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-600 mb-1">
                  Hydroxypropoxy Content (%)
                </p>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    step="any"
                    value={calculation.hydroxypropoxyLimitMin || ""}
                    onChange={(e) => handleChange("hydroxypropoxyLimitMin", e.target.value)}
                    onWheel={(e) => e.currentTarget.blur()}
                    placeholder="Min"
                    className="w-full px-3 py-2 bg-white border border-emerald-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  />
                  <span className="text-xs text-gray-500">to</span>
                  <input
                    type="number"
                    step="any"
                    value={calculation.hydroxypropoxyLimitMax || ""}
                    onChange={(e) => handleChange("hydroxypropoxyLimitMax", e.target.value)}
                    onWheel={(e) => e.currentTarget.blur()}
                    placeholder="Max"
                    className="w-full px-3 py-2 bg-white border border-emerald-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-center pt-2">
            <motion.button
              onClick={performCalculation}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-emerald-700 via-emerald-800 to-slate-900 text-white font-semibold rounded-lg hover:shadow-lg transition-all shadow-md text-sm"
            >
              <Calculator className="w-4 h-4" />
              Calculate Result
            </motion.button>
          </div>

          {/* Results */}
          {calculation.methoxyResultDried && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow-lg border-2 border-emerald-300 overflow-hidden"
            >
              <div className="bg-gradient-to-r from-emerald-700 via-emerald-800 to-slate-900 px-4 py-2 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-white" />
                <h6 className="text-sm font-bold text-white">Results</h6>
              </div>
              <div className="grid md:grid-cols-2 divide-x divide-gray-200">
                <div className="p-4">
                  <p className="text-xs font-semibold text-gray-500 mb-1">
                    Methoxy Content
                  </p>
                  <p className="text-lg font-bold text-gray-800">
                    As-is: {calculation.methoxyResultAsIs}% &nbsp;|&nbsp; Dried:{" "}
                    {calculation.methoxyResultDried}%
                  </p>
                  {methoxyDriedVal !== null && (
                    <span
                      className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-bold ${
                        methoxyPass
                          ? "bg-green-100 text-green-800 border border-green-300"
                          : "bg-red-100 text-red-800 border border-red-300"
                      }`}
                    >
                      {methoxyPass ? "Pass" : "Fail"}
                    </span>
                  )}
                </div>
                <div className="p-4">
                  <p className="text-xs font-semibold text-gray-500 mb-1">
                    Hydroxypropoxy Content
                  </p>
                  <p className="text-lg font-bold text-gray-800">
                    As-is: {calculation.hydroxypropoxyResultAsIs}% &nbsp;|&nbsp; Dried:{" "}
                    {calculation.hydroxypropoxyResultDried}%
                  </p>
                  {hydroxypropoxyDriedVal !== null && (
                    <span
                      className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-bold ${
                        hydroxypropoxyPass
                          ? "bg-green-100 text-green-800 border border-green-300"
                          : "bg-red-100 text-red-800 border border-red-300"
                      }`}
                    >
                      {hydroxypropoxyPass ? "Pass" : "Fail"}
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default CalculationDetailAssayHypromellose;