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
import type { CalculationAssayFerrousFumarate } from "../../preparation_models/CalculationAssayFerrousFumarate";
import type { SamplePreparationTitration } from "../../preparation_models/SamplePreparationTitration";
import CustomDropdown from "../shared/CustomDropdown";

const weightUnitOptions = [
  { value: "mg", label: "mg" },
  { value: "g", label: "g" },
  { value: "kg", label: "kg" },
];

interface CalculationDetailAssayFerrousFumarateProps {
  calculation: CalculationAssayFerrousFumarate;
  samplePreparations: SamplePreparationTitration[];
  onFieldChange: (
    calculationId: number,
    field: keyof CalculationAssayFerrousFumarate,
    value: string | null,
  ) => void;
  onRemove: () => void;
  role: string;
}

interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

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

const convertMassToMg = (value: string | number, unit: string): number => {
  const val = parseFloat(String(value));
  if (isNaN(val)) return 1;

    const lowerUnit = unit.toLowerCase().trim();

  switch (lowerUnit) {
    case "mg":
    case "milligram":
      return val.toFixedNoRound(4);
    case "g":
    case "gram":
      return (val * 1000).toFixedNoRound(4);
    case "kg":
    case "kilogram":
      return (val * 1000000).toFixedNoRound(4);
    case "mcg":
    case "ug":
    case "microgram":
      return (val / 1000).toFixedNoRound(4);
    default:
      return val;
  }
};

const NumberInput: React.FC<{
  value: string| null;
  onChange: (v: string) => void;
  placeholder: string;
}> = ({ value, onChange, placeholder }) => (
  <input
    type="number"
    value={value!}
    onChange={(e) => onChange(e.target.value)}
    step="any"
    onKeyDown={(e) => {
      if (e.key === "ArrowUp" || e.key === "ArrowDown") e.preventDefault();
    }}
    onWheel={(e) => e.currentTarget.blur()}
    placeholder={placeholder}
    className="w-full px-3 py-2 bg-white border border-emerald-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-emerald-50"
  />
);

const CalculationDetailAssayFerrousFumarate: React.FC<
  CalculationDetailAssayFerrousFumarateProps
> = ({ calculation, samplePreparations, onFieldChange, onRemove }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [validationResult, setValidationResult] = useState<ValidationResult>({
    isValid: false,
    errors: [],
  });

  const selectedSampleTitration = samplePreparations.find(
    (p) => p.label === calculation.selectedSamplePreparationLabel,
  );

  const getSampleWeight = (): { value: string; unit: string } => {
    if (!selectedSampleTitration) return { value: "", unit: "g" };
    const weighingStep = selectedSampleTitration.steps.find(
      (s) => s.name === "Weighing",
    );
    return {
      value: weighingStep?.value1 || "",
      unit: weighingStep?.unit1 || "g",
    };
  };

  const sampleWeight = getSampleWeight();

  const validate = (): ValidationResult => {
    const errors: string[] = [];

    // ── Sample Preparation checks (only these are required) ───────────
    if (!selectedSampleTitration) {
      errors.push("Please select a Sample Preparation");
      return { isValid: false, errors };
    }

    if (!calculation.calculationFor) {
      errors.push(
        "Please select a Calculation Type (Finish Product / Raw Product)",
      );
    }

    const weighingStep = selectedSampleTitration.steps.find(
      (s) => s.name === "Weighing",
    );
    if (!weighingStep || !isPositiveNum(weighingStep.value1)) {
      errors.push(
        "Sample Preparation — Weighing: Weight value is required and must be > 0",
      );
    }
    if (!weighingStep?.logBookID || weighingStep.logBookID.trim() === "") {
      errors.push("Sample Preparation — Weighing: Logbook ID is required");
    }

    // Calculation input fields are NOT validated — empty fields fall back
    // to 1 for multiplicative operands and 0 for additive operands.

    return { isValid: errors.length === 0, errors };
  };

  useEffect(() => {
    setValidationResult(validate());
  }, [
    calculation.selectedSamplePreparationLabel,
    calculation.calculationFor,
    selectedSampleTitration,
  ]);

  const FormulaDisplay: React.FC = () => {
    if (!calculation.calculationFor || !selectedSampleTitration) return null;

    const sw = convertMassToMg(sampleWeight.value, sampleWeight.unit) || "SW";
    const br = calculation.buretteReading || "BR";
    const am = calculation.actualMolarity || "AM";
    const tm = calculation.theoreticalMolarity || "TM";
    const fac = convertMassToMg(calculation.factor || "1", calculation.factorUnit || 'mg') || "F";
    const aw = convertMassToMg(calculation.avgWeight || "1", calculation.avgWeightUnit || 'mg') || "AW";
    const lc = convertMassToMg(calculation.labelClaim || "1", calculation.labelClaimUnit || 'mg') || "LC";
    const lod = calculation.lodWaterValue || "LOD";

    const formulaBox = (
      symbolicNumerator: string,
      symbolicDenominator: string,
      valueNumerator: string,
      valueDenominator: string,
      unit: string,
    ) => (
      <div>
        <div className="bg-gray-50 rounded p-3 mb-1">
          <div className="flex flex-col items-center">
            <div className="text-center border-b-2 border-black pb-2 mb-2 px-2 w-full">
              <p className="text-xs font-mono text-black">
                {symbolicNumerator}
              </p>
            </div>
            <div className="text-center px-2 w-full">
              <p className="text-xs font-mono text-black">
                {symbolicDenominator}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-emerald-50 rounded p-3">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-black">=</span>
            <div className="flex-1 flex flex-col items-center">
              <div className="text-center border-b-2 border-black pb-2 mb-2 px-2 w-full">
                <p className="text-xs font-mono text-black">{valueNumerator}</p>
              </div>
              <div className="text-center px-2 w-full">
                <p className="text-xs font-mono text-black">
                  {valueDenominator}
                </p>
              </div>
            </div>
          </div>
        </div>
        <p className="text-xs text-right text-gray-600 mt-1 font-semibold">
          = {unit}
        </p>
      </div>
    );

    return (
      <div className="bg-white rounded-lg p-4 border-2 border-emerald-200 shadow-sm mt-4 space-y-5">
        <h4 className="text-sm font-bold text-gray-900">
          Formula for {calculation.calculationFor}
        </h4>

        {calculation.calculationFor === "Finish Product" && (
          <>
            <div>
              <p className="text-xs font-semibold text-gray-600 mb-2">
                Result (mg/Tablet)
              </p>
              {formulaBox(
                "Burette Reading × Actual Molarity × Factor(mg) × Avg. Weight(mg)",
                "Sample Weight(mg) × Theoretical Molarity",
                `${br} × ${am} × ${fac} × ${aw}`,
                `${sw} × ${tm}`,
                "mg/Tablet",
              )}
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-600 mb-2">
                Result (% of Label Claim)
              </p>
              {formulaBox(
                "Result (mg/Tablet) × 100",
                "Label Claim(mg)",
                "Result × 100",
                `${lc}`,
                "% of LC",
              )}
            </div>
          </>
        )}

        {calculation.calculationFor === "Raw Product" && (
          <>
            <div>
              <p className="text-xs font-semibold text-gray-600 mb-2">
                Result (as such Basis)
              </p>
              {formulaBox(
                "Burette Reading × Actual Molarity × Factor(mg) × 100",
                "Sample Weight(mg) × Theoretical Molarity",
                `${br} × ${am} × ${fac} × 100`,
                `${sw} × ${tm}`,
                "% (as such Basis)",
              )}
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-600 mb-2">
                Result (Dry / Anhydrous Basis)
              </p>
              {formulaBox(
                "Result (as such Basis) × 100",
                "100 − LOD/Water (%)",
                "Result × 100",
                `100 − ${lod}`,
                "% (Dry / Anhydrous Basis)",
              )}
            </div>
          </>
        )}
      </div>
    );
  };

  const performCalculation = () => {
    const currentValidation = validate();
    setValidationResult(currentValidation);

    if (!currentValidation.isValid) {
      onFieldChange(
        calculation.id,
        "calculationResult",
        `Error: Cannot calculate — ${currentValidation.errors.length} validation error(s). Please check the validation messages above.`,
      );
      onFieldChange(calculation.id, "calculationResultUnit", null);
      onFieldChange(calculation.id, "labelClaimPercent", null);
      onFieldChange(calculation.id, "dryBasisResult", null);
      return;
    }

    const BR = safeNum(calculation.buretteReading);
    const TM = safeNum(calculation.theoreticalMolarity);
    const AM = safeNum(calculation.actualMolarity);
    const F = convertMassToMg(calculation.factor || "1", calculation.factorUnit || 'mg');
    const SW = convertMassToMg(sampleWeight.value, sampleWeight.unit);

    if (calculation.calculationFor === "Finish Product") {
      const AW = convertMassToMg(calculation.avgWeight || "1", calculation.avgWeightUnit || 'mg'); // ×
      const result = (BR * AM * F * AW) / (SW * TM);

      onFieldChange(
        calculation.id,
        "calculationResult",
        result.toFixedNoRound(4).toFixed(3),
      );
      onFieldChange(calculation.id, "calculationResultUnit", "mg/Tablet");
      onFieldChange(calculation.id, "dryBasisResult", null);

      const LC = convertMassToMg(calculation.labelClaim || "1", calculation.labelClaimUnit || 'mg');
      const lcPercent = (result / LC) * 100;
      onFieldChange(
        calculation.id,
        "labelClaimPercent",
        `${lcPercent.toFixedNoRound(3).toFixed(2)} %`,
      );
    } else {
      const asIs = (BR * AM * F * 100) / (SW * TM);

      onFieldChange(
        calculation.id,
        "calculationResult",
        asIs.toFixedNoRound(3).toFixed(2),
      );
      onFieldChange(calculation.id, "calculationResultUnit", "%");
      onFieldChange(calculation.id, "labelClaimPercent", null);

      const lod = safeNum(calculation.lodWaterValue, 0);
      if (lod < 100) {
        const dryBasis = (asIs * 100) / (100 - lod);
        onFieldChange(
          calculation.id,
          "dryBasisResult",
          `${dryBasis.toFixedNoRound(3).toFixed(2)}`,
        );
      } else {
        onFieldChange(calculation.id, "dryBasisResult", null);
      }
    }
  };


  const headerRoundingClass = isExpanded ? "rounded-t-lg" : "rounded-lg";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white rounded-xl shadow-lg border-2 border-emerald-200 mb-6"
    >
      <div
        className={`relative bg-gradient-to-r from-emerald-600 to-emerald-600 ${headerRoundingClass}`}
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
                Titration (Assay of Ferrous Fumarate) Calculation
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

      {isExpanded && !validationResult.isValid && (
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

      {isExpanded && validationResult.isValid && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="bg-green-50 border-b-2 border-emerald-200"
        >
          <div className="p-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              <p className="text-sm font-semibold text-green-800">
                All required fields are valid — Ready to calculate
              </p>
            </div>
          </div>
        </motion.div>
      )}

      <div className="relative">
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="p-6 space-y-6">
                {/* 1. Sample Preparation */}
                <div className="bg-gradient-to-r from-emerald-50 to-emerald-50 rounded-lg p-4 border-2 border-emerald-200">
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Select Sample Preparation
                  </label>
                  <CustomDropdown
                    options={samplePreparations.map((p) => ({
                      value: p.label,
                      label: p.label,
                    }))}
                    value={calculation.selectedSamplePreparationLabel ?? ""}
                    onChange={(value) => {
                      onFieldChange(
                        calculation.id,
                        "selectedSamplePreparationLabel",
                        value,
                      );
                      onFieldChange(calculation.id, "calculationResult", null);
                      onFieldChange(
                        calculation.id,
                        "calculationResultUnit",
                        null,
                      );
                      onFieldChange(calculation.id, "labelClaimPercent", null);
                      onFieldChange(calculation.id, "dryBasisResult", null);
                    }}
                    placeholder="Select sample preparation..."
                    colorScheme="emerald"
                  />
                  {selectedSampleTitration && (
                    <div className="mt-2 flex items-center gap-2 text-xs text-emerald-700">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>
                        Sample Weight:{" "}
                        <strong>
                          {sampleWeight.value || "—"} {sampleWeight.unit}
                        </strong>{" "}
                        (from Weighing step)
                      </span>
                    </div>
                  )}
                </div>

                {/* 2. Calculation For */}
                {selectedSampleTitration && (
                  <div className="bg-gradient-to-r from-emerald-50 to-emerald-50 rounded-lg p-4 border-2 border-emerald-200">
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Calculation For
                    </label>
                    <CustomDropdown
                      options={[
                        { value: "Finish Product", label: "Finish Product" },
                        { value: "Raw Product", label: "Raw Product" },
                      ]}
                      value={calculation.calculationFor}
                      onChange={(value) => {
                        onFieldChange(calculation.id, "calculationFor", value);
                        onFieldChange(
                          calculation.id,
                          "calculationResult",
                          null,
                        );
                        onFieldChange(
                          calculation.id,
                          "calculationResultUnit",
                          null,
                        );
                        onFieldChange(
                          calculation.id,
                          "labelClaimPercent",
                          null,
                        );
                        onFieldChange(calculation.id, "dryBasisResult", null);
                      }}
                      placeholder="Select calculation type..."
                      colorScheme="emerald"
                    />
                  </div>
                )}

                {/* 3. Formula Preview */}
                {selectedSampleTitration && calculation.calculationFor && (
                  <FormulaDisplay />
                )}

                {/* 4. Inputs */}
                {selectedSampleTitration && calculation.calculationFor && (
                  <div className="space-y-4">
                    {/* Common — Titration Parameters */}
                    <div className="bg-gradient-to-r from-emerald-50 to-emerald-50 rounded-lg p-4 border-2 border-emerald-200">
                      <h5 className="text-sm font-bold text-gray-700 mb-3">
                        Titration Parameters
                      </h5>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-gray-600 mb-1">
                            Burette Reading (ml)
                          </label>
                          <NumberInput
                            value={calculation.buretteReading}
                            onChange={(v) =>
                              onFieldChange(calculation.id, "buretteReading", v)
                            }
                            placeholder="Enter burette reading"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-600 mb-1">
                            Theoretical Molarity
                          </label>
                          <NumberInput
                            value={calculation.theoreticalMolarity}
                            onChange={(v) =>
                              onFieldChange(
                                calculation.id,
                                "theoreticalMolarity",
                                v,
                              )
                            }
                            placeholder="Enter theoretical molarity"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-600 mb-1">
                            Actual Molarity
                          </label>
                          <NumberInput
                            value={calculation.actualMolarity}
                            onChange={(v) =>
                              onFieldChange(calculation.id, "actualMolarity", v)
                            }
                            placeholder="Enter actual molarity"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-600 mb-1">
                            Factor
                          </label>
                          <div className="flex gap-2">
                            <NumberInput
                              value={calculation.factor}
                              onChange={(v) =>
                                onFieldChange(calculation.id, "factor", v)
                              }
                              placeholder="Enter factor"
                            />
                            <div className="w-20 shrink-0">
                              <CustomDropdown
                                options={weightUnitOptions}
                                value={calculation.factorUnit || "g"}
                                onChange={(v) =>
                                  onFieldChange(
                                    calculation.id,
                                    "factorUnit",
                                    v || "g",
                                  )
                                }
                                placeholder="Unit"
                                colorScheme="emerald"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Finish Product extras */}
                    {calculation.calculationFor === "Finish Product" && (
                      <div className="bg-gradient-to-r from-emerald-50 to-emerald-50 rounded-lg p-4 border-2 border-emerald-200">
                        <h5 className="text-sm font-bold text-gray-700 mb-3">
                          Finish Product Details
                        </h5>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1">
                              Avg. Weight
                            </label> 
                            <div className="flex items-center gap-2">
                            <NumberInput
                              value={calculation.avgWeight}
                              onChange={(v) =>
                                onFieldChange(calculation.id, "avgWeight", v)
                              }
                              placeholder="Enter average weight"
                            />
                            <div className="w-20 shrink-0">
                              <CustomDropdown
                                options={weightUnitOptions}
                                value={calculation.avgWeightUnit || "g"}
                                onChange={(v) =>
                                  onFieldChange(
                                    calculation.id,
                                    "avgWeightUnit",
                                    v || "g",
                                  )
                                }
                                placeholder="Unit"
                                colorScheme="emerald"
                              />
                            </div>
                            </div>
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1">
                              Label Claim
                            </label>
                            <div className="flex items-center gap-2">
                            <NumberInput
                              value={calculation.labelClaim}
                              onChange={(v) =>
                                onFieldChange(calculation.id, "labelClaim", v)
                              }
                              placeholder="Enter label claim"
                            />
                            <div className="w-20 shrink-0">
                              <CustomDropdown
                                options={weightUnitOptions}
                                value={calculation.avgWeightUnit || "g"}
                                onChange={(v) =>
                                  onFieldChange(
                                    calculation.id,
                                    "labelClaimUnit",
                                    v || "g",
                                  )
                                }
                                placeholder="Unit"
                                colorScheme="emerald"
                              />
                            </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Raw Product extras */}
                    {calculation.calculationFor === "Raw Product" && (
                      <div className="bg-gradient-to-r from-emerald-50 to-emerald-50 rounded-lg p-4 border-2 border-emerald-200">
                        <h5 className="text-sm font-bold text-gray-700 mb-3">
                          Basis Adjustment
                        </h5>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-semibold text-emerald-900 mb-1">
                              Water / LOD Type
                            </label>
                            <CustomDropdown
                              options={[
                                { value: "water", label: "Water" },
                                { value: "lod", label: "LOD" },
                              ]}
                              value={calculation.lodWaterType || "water"}
                              onChange={(value) =>
                                onFieldChange(
                                  calculation.id,
                                  "lodWaterType",
                                  value,
                                )
                              }
                              placeholder="Select Type"
                              colorScheme="emerald"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-emerald-900 mb-1">
                              {calculation.lodWaterType === "lod"
                                ? "LOD"
                                : "Water"}{" "}
                              Value (%)
                            </label>
                            <NumberInput
                              value={calculation.lodWaterValue}
                              onChange={(v) =>
                                onFieldChange(
                                  calculation.id,
                                  "lodWaterValue",
                                  v,
                                )
                              }
                              placeholder={`Enter ${
                                calculation.lodWaterType === "lod"
                                  ? "LOD"
                                  : "Water"
                              } %`}
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Acceptance Limit */}
                      <div className="bg-gradient-to-r from-emerald-50 to-emerald-50 rounded-lg p-4 border-2 border-emerald-200">
                        <h5 className="text-sm font-bold text-gray-700 mb-3">
                          Acceptance Criterion
                        </h5>
                        <div>
                          <label className="block text-xs font-semibold text-gray-600 mb-1">
                            Acceptance Limit (%)
                          </label>
                          <input
                            type="number"
                            min="0"
                            step="any"
                            value={calculation.acceptanceLimit ?? ""}
                            onChange={(e) =>
                              onFieldChange(
                                calculation.id,
                                "acceptanceLimit",
                                e.target.value === "" ? null : e.target.value,
                              )
                            }
                            onKeyDown={(e) => {
                              if (
                                e.key === "ArrowUp" ||
                                e.key === "ArrowDown"
                              ) {
                                e.preventDefault();
                              }
                            }}
                            onWheel={(e) => e.currentTarget.blur()}
                            placeholder="e.g. 80"
                            className="w-full px-3 py-2 bg-white border border-emerald-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-emerald-50"
                          />
                        </div>
                      </div>

                    {/* Calculate Button */}
                    <div className="flex justify-center pt-2">
                      <motion.button
                        onClick={performCalculation}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-600 text-white font-semibold rounded-lg hover:from-emerald-700 hover:to-emerald-700 transition-all shadow-md hover:shadow-lg text-sm"
                      >
                        <Calculator className="w-4 h-4" />
                        Calculate Result
                      </motion.button>
                    </div>
                  </div>
                )}

                {/* Prompt when no prep selected */}
                {!selectedSampleTitration && (
                  <div className="bg-emerald-50 border-2 border-emerald-300 rounded-lg p-3 text-center">
                    <p className="text-xs text-emerald-800 font-medium">
                      Please select a Sample Preparation to enable calculation
                    </p>
                  </div>
                )}
              </div>

              {/* ── Results Panel ─────────────────────────────────────────────── */}
              {calculation.calculationResult && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="border-t-4 border-emerald-200"
                >
                  <div
                    className={`p-6 ${
                      calculation.calculationResult.startsWith("Error")
                        ? "bg-gradient-to-br from-red-50 via-red-100/50 to-red-50"
                        : "bg-gradient-to-br from-emerald-50 via-green-100/30 to-emerald-50"
                    }`}
                  >
                    <div className="max-w-4xl mx-auto space-y-4">
                      <div className="flex items-center gap-3 pb-3">
                        {calculation.calculationResult.startsWith("Error") ? (
                          <XCircle className="w-6 h-6 text-red-600" />
                        ) : (
                          <CheckCircle2 className="w-6 h-6 text-green-700" />
                        )}
                        <h6
                          className={`text-lg font-bold ${
                            calculation.calculationResult.startsWith("Error")
                              ? "text-red-700"
                              : "text-green-700"
                          }`}
                        >
                          Calculation Results
                        </h6>
                      </div>

                      {calculation.calculationResult.startsWith("Error") ? (
                        <div className="bg-white rounded-lg border-2 border-red-300 p-4">
                          <p className="text-sm text-red-700 font-medium">
                            {calculation.calculationResult}
                          </p>
                        </div>
                      ) : (
                        <div className="grid gap-4">
                          <div
                            className={`grid gap-4 ${
                              calculation.labelClaimPercent ||
                              calculation.dryBasisResult
                                ? "md:grid-cols-2"
                                : "md:grid-cols-1"
                            }`}
                          >
                            {/* Primary result */}
                            <div className="bg-white rounded-lg shadow-lg border-2 border-emerald-300 overflow-hidden">
                              <div className="bg-gradient-to-r from-emerald-600 to-emerald-600 px-4 py-2">
                                <h6 className="text-sm font-bold text-white">
                                  Primary Result
                                </h6>
                              </div>
                              <div className="flex items-center p-4">
                          <p className="text-2xl font-bold text-gray-800">
                            {calculation.calculationResult}{" "}
                            {!calculation.calculationResult.startsWith("Error")
                              ? calculation.calculationResultUnit
                              : ""}
                          </p>
                          {(() => {
                            const limit =
                              calculation.acceptanceLimit != null &&
                              calculation.acceptanceLimit !== ""
                                ? parseFloat(calculation.acceptanceLimit)
                                : null;
                            if (limit === null || isNaN(limit)) return null;

                            const val =
                              typeof calculation.calculationResult === "string"
                                ? parseFloat(calculation.calculationResult)
                                : null;
                            const pass = val !== null && val >= limit;

                            return (
                              <span
                                className={`m-2 inline-block px-3 py-1 rounded-full text-sm font-bold ${pass ? "bg-green-100 text-green-800 border border-green-300" : "bg-red-100 text-red-800 border border-red-300"}`}
                              >
                                {pass ? "Pass" : "Fail"}
                              </span>
                            );
                          })()}
                        </div>
                            </div>

                            {/* % of LC */}
                            {calculation.labelClaimPercent && (
                              <div className="bg-white rounded-lg shadow-lg border-2 border-emerald-300 overflow-hidden">
                                <div className="bg-gradient-to-r from-emerald-600 to-emerald-600 px-4 py-2">
                                  <h6 className="text-sm font-bold text-white">
                                    Label Claim Percentage
                                  </h6>
                                </div>
                                <div className="p-4">
                                  <p className="text-xl font-bold text-green-700">
                                    {calculation.labelClaimPercent}
                                  </p>
                                </div>
                              </div>
                            )}

                            {/* Dry basis */}
                            {calculation.dryBasisResult && (
                              <div className="bg-white rounded-lg shadow-lg border-2 border-emerald-300 overflow-hidden">
                                <div className="bg-gradient-to-r from-emerald-600 to-emerald-600 px-4 py-2">
                                  <h6 className="text-sm font-bold text-white">
                                    Adjusted Basis
                                  </h6>
                                </div>
                                <div className="p-4">
                                  <p className="text-xl font-bold text-green-700">
                                    {calculation.dryBasisResult} %
                                  </p>
                                  <p className="text-sm font-bold text-green-700">
                                    {calculation.lodWaterType === "lod"
                                      ? "Anhydrous basis"
                                      : "Water basis"}{" "}
                                    adjusted for {calculation.lodWaterValue} %
                                    of {calculation.lodWaterType}
                                  </p>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Meta info */}
                          <div className="bg-white/80 backdrop-blur-sm rounded-lg border border-gray-200 p-4">
                            <div className="grid md:grid-cols-3 gap-4 text-sm">
                              <div>
                                <p className="text-gray-600 font-medium">
                                  Calculation Type
                                </p>
                                <p className="text-gray-900 font-semibold">
                                  {calculation.calculationFor}
                                </p>
                              </div>
                              <div>
                                <p className="text-gray-600 font-medium">
                                  Sample Preparation
                                </p>
                                <p className="text-gray-900 font-semibold">
                                  {calculation.selectedSamplePreparationLabel ??
                                    "N/A"}
                                </p>
                              </div>
                              <div>
                                <p className="text-gray-600 font-medium">
                                  Sample Weight
                                </p>
                                <p className="text-gray-900 font-semibold">
                                  {sampleWeight.value} {sampleWeight.unit}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
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

export default CalculationDetailAssayFerrousFumarate;
