import { useEffect, useState } from "react";

import {
    ChevronDown,
    Calculator,
    Trash,
    CheckCircle2,
    XCircle,
} from "lucide-react";

import { motion, AnimatePresence } from "framer-motion";

import type { CalculationProtein } from "./models/CalculationProtein";
import type { SamplePreparationProtein } from "./models/SamplePreparationProtein";

import CustomDropdown from "../../../components/shared/CustomDropdown";


// ============================================================
// PROPS
// ============================================================

interface CalculationDetailProteinProps {

    calculation: CalculationProtein;

    samplePreparations: SamplePreparationProtein[];

    onFieldChange: (
        calculationId: number,
        field: keyof CalculationProtein,
        value: string | number | null
    ) => void;

    onRemove: () => void;

    role: string;
}


// ============================================================
// VALIDATION
// ============================================================

interface ValidationResult {

    isValid: boolean;

    errors: string[];

    warnings: string[];
}


// ============================================================
// NUMBER HELPER
// ============================================================

const toNumber = (
    value: string | number | null | undefined
): number => {

    if (
        value === null ||
        value === undefined ||
        value === ""
    ) {
        return 0;
    }

    const number = parseFloat(String(value));

    return isNaN(number)
        ? 0
        : number;
};


// ============================================================
// COMPONENT
// ============================================================

const CalculationDetailProtein: React.FC<
    CalculationDetailProteinProps
> = ({
    calculation,
    samplePreparations,
    onFieldChange,
    onRemove,
    role,
}) => {

        const [isExpanded, setIsExpanded] =
            useState(true);

        const [validationResult, setValidationResult] =
            useState<ValidationResult>({
                isValid: false,
                errors: [],
                warnings: [],
            });


        // ========================================================
        // SELECTED SAMPLE PREPARATION
        // ========================================================

        const selectedSamplePrep =
            samplePreparations.find(
                prep =>
                    prep.label ===
                    calculation.selectedSamplePreparationLabel
            );

        const getProteinPreparationValues = () => {

            if (!selectedSamplePrep) {
                return {
                    sampleWeight: "",
                    sampleTitreValue: "",
                    blankTitreValue: "",
                    normality: "",
                    proteinFactor: "",
                };
            }

            const steps = Array.isArray(selectedSamplePrep.steps)
                ? selectedSamplePrep.steps
                : [];

            const sampleWeight = steps.find(
                step => step.name === "Sample Weight"
            );

            const sampleTitreValue = steps.find(
                step => step.name === "Sample Titre Value"
            );

            const blankTitreValue = steps.find(
                step => step.name === "Blank Titre Value"
            );

            const normality = steps.find(
                step => step.name === "Normality"
            );

            const proteinFactor = steps.find(
                step => step.name === "Protein Factor"
            );

            return {
                sampleWeight:
                    sampleWeight?.value1 ?? "",

                sampleTitreValue:
                    sampleTitreValue?.value1 ?? "",

                blankTitreValue:
                    blankTitreValue?.value1 ?? "",

                normality:
                    normality?.value1 ?? "",

                proteinFactor:
                    proteinFactor?.value1 ?? "",
            };
        };

        const handleSamplePreparationChange = (value: string) => {

            // --------------------------------------------
            // Set selected preparation
            // --------------------------------------------

            onFieldChange(
                calculation.id,
                "selectedSamplePreparationLabel",
                value
            );

            // --------------------------------------------
            // Find selected preparation
            // --------------------------------------------

            const preparation = samplePreparations.find(
                prep => prep.label === value
            );

            if (!preparation) {
                return;
            }

            // --------------------------------------------
            // Get Protein values
            // --------------------------------------------

            const steps = Array.isArray(preparation.steps)
                ? preparation.steps
                : [];

            const sampleWeight = steps.find(
                step => step.name === "Sample Weight"
            );

            const sampleTitreValue = steps.find(
                step => step.name === "Sample Titre Value"
            );

            const blankTitreValue = steps.find(
                step => step.name === "Blank Titre Value"
            );

            const normality = steps.find(
                step => step.name === "Normality"
            );

            const proteinFactor = steps.find(
                step => step.name === "Protein Factor"
            );

            // --------------------------------------------
            // Copy values into calculation
            // --------------------------------------------

            onFieldChange(
                calculation.id,
                "sampleWeight",
                sampleWeight?.value1 ?? ""
            );

            onFieldChange(
                calculation.id,
                "sampleTitreValue",
                sampleTitreValue?.value1 ?? ""
            );

            onFieldChange(
                calculation.id,
                "blankTitreValue",
                blankTitreValue?.value1 ?? ""
            );

            onFieldChange(
                calculation.id,
                "normality",
                normality?.value1 ?? ""
            );

            onFieldChange(
                calculation.id,
                "proteinFactor",
                proteinFactor?.value1 ?? ""
            );
        };

        //const proteinValues = getProteinPreparationValues();

        // console.log("🥛 PROTEIN PREPARATION VALUES", {
        //     selectedSamplePrep,
        //     proteinValues,
        // });
        // ========================================================
        // DEBUG
        // ========================================================

        // console.log(
        //     "🔥 PROTEIN CALCULATION DEBUG",
        //     {
        //         calculation,
        //         selectedSamplePreparationLabel:
        //             calculation.selectedSamplePreparationLabel,

        //         samplePreparations,

        //         selectedSamplePrep,
        //     }
        // );


        // ========================================================
        // VALIDATION
        // ========================================================

        const validateCalculation =
            (): ValidationResult => {

                const errors: string[] = [];

                const warnings: string[] = [];


                // --------------------------------------------
                // Sample Preparation
                // --------------------------------------------

                if (!selectedSamplePrep) {

                    errors.push(
                        "Please select a Sample Preparation"
                    );

                }


                // --------------------------------------------
                // Helper
                // --------------------------------------------

                const isValidNumber = (
                    value: string | number | null
                ): boolean => {

                    if (
                        value === null ||
                        value === undefined
                    ) {
                        return false;
                    }

                    const text =
                        String(value).trim();

                    if (text === "") {
                        return false;
                    }

                    const number =
                        parseFloat(text);

                    return (
                        !isNaN(number) &&
                        isFinite(number) &&
                        number > 0
                    );
                };


                // --------------------------------------------
                // Sample Weight
                // --------------------------------------------

                if (
                    !isValidNumber(
                        calculation.sampleWeight
                    )
                ) {

                    errors.push(
                        "Sample Weight is required"
                    );

                }


                // --------------------------------------------
                // Sample Titre Value
                // --------------------------------------------

                if (
                    !isValidNumber(
                        calculation.sampleTitreValue
                    )
                ) {

                    errors.push(
                        "Sample Titre Value is required"
                    );

                }


                // --------------------------------------------
                // Blank Titre Value
                // --------------------------------------------

                if (
                    !isValidNumber(
                        calculation.blankTitreValue
                    )
                ) {

                    errors.push(
                        "Blank Titre Value is required"
                    );

                }


                // --------------------------------------------
                // Normality
                // --------------------------------------------

                if (
                    !isValidNumber(
                        calculation.normality
                    )
                ) {

                    errors.push(
                        "Normality is required"
                    );

                }


                // --------------------------------------------
                // Protein Factor
                // --------------------------------------------

                if (
                    !isValidNumber(
                        calculation.proteinFactor
                    )
                ) {

                    errors.push(
                        "Protein Factor is required"
                    );

                }


                return {

                    isValid:
                        errors.length === 0,

                    errors,

                    warnings,
                };
            };


        // ========================================================
        // VALIDATE WHEN VALUES CHANGE
        // ========================================================

        useEffect(() => {

            const result =
                validateCalculation();

            setValidationResult(result);

        }, [
            selectedSamplePrep,

            calculation.sampleWeight,

            calculation.sampleTitreValue,

            calculation.blankTitreValue,

            calculation.normality,

            calculation.proteinFactor,
        ]);


        // ========================================================
        // FORMULA DISPLAY
        // ========================================================

        const FormulaDisplay: React.FC = () => {

            if (!selectedSamplePrep) {
                return null;
            }


            const sampleWeight =
                toNumber(
                    calculation.sampleWeight
                );

            const sampleTitre =
                toNumber(
                    calculation.sampleTitreValue
                );

            const blankTitre =
                toNumber(
                    calculation.blankTitreValue
                );

            const normality =
                toNumber(
                    calculation.normality
                );

            const proteinFactor =
                toNumber(
                    calculation.proteinFactor
                );


            const factor14 =
                calculation.factor14;

            const multiplier100 =
                calculation.multiplier100;

            const denominator1000 =
                calculation.denominator1000;


            const numerator =
                (
                    blankTitre -
                    sampleTitre
                ) *
                proteinFactor *
                factor14 *
                normality *
                multiplier100;


            const denominator =
                sampleWeight *
                denominator1000;


            const result =
                denominator !== 0
                    ? numerator / denominator
                    : 0;


            return (

                <div className="
                bg-white
                rounded-lg
                p-4
                border-2
                border-emerald-200
                shadow-sm
                mt-4
            ">

                    <h4 className="
                    text-sm
                    font-bold
                    text-gray-900
                    mb-3
                ">
                        Formula for Protein
                    </h4>


                    {/* ==========================================
                    SYMBOLIC FORMULA
                ========================================== */}

                    <div className="
                    bg-gray-50
                    rounded
                    p-3
                    mb-3
                ">

                        <div className="
                        flex
                        flex-col
                        items-center
                    ">

                            <div className="
                            text-center
                            border-b-2
                            border-black
                            pb-2
                            mb-2
                            px-2
                            w-full
                        ">

                                <p className="
                                text-xs
                                font-mono
                                text-black
                                break-words
                            ">
                                    (Blank Titre Value in ml)
                                    {" - "}
                                    (Sample Titre Value in ml)
                                    {" × "}
                                    Protein Factor
                                    {" × "}
                                    14.01
                                    {" × "}
                                    Normality
                                    {" × "}
                                    100
                                </p>

                            </div>


                            <div className="
                            text-center
                            px-2
                            w-full
                        ">

                                <p className="
                                text-xs
                                font-mono
                                text-black
                            ">
                                    Weight Of Sample in g × 1000
                                </p>

                            </div>

                        </div>

                    </div>


                    {/* ==========================================
                    VALUES FORMULA
                ========================================== */}

                    <div className="
                    bg-emerald-50
                    rounded
                    p-3
                ">

                        <div className="
                        flex
                        items-center
                        gap-2
                    ">

                            <span className="
                            text-lg
                            font-bold
                        ">
                                =
                            </span>


                            <div className="
                            flex-1
                            flex
                            flex-col
                            items-center
                        ">

                                <div className="
                                border-b-2
                                border-black
                                w-full
                                text-center
                                pb-2
                            ">

                                    (
                                    {blankTitre.toFixed(4)}
                                    {" - "}
                                    {sampleTitre.toFixed(4)}
                                    )
                                    {" × "}
                                    {proteinFactor.toFixed(2)}
                                    {" × "}
                                    {factor14.toFixed(2)}
                                    {" × "}
                                    {normality.toFixed(4)}
                                    {" × "}
                                    {multiplier100}

                                </div>


                                <div className="
                                w-full
                                text-center
                                mt-2
                            ">

                                    {
                                        denominator.toFixed(4)
                                    }

                                </div>

                            </div>

                        </div>


                        <div className="
                        text-center
                        mt-3
                        font-bold
                        text-lg
                    ">

                            =
                            {" "}
                            {result.toFixed(3)}
                            {" %"}

                        </div>

                    </div>


                    <p className="
                    text-xs
                    text-right
                    text-gray-600
                    mt-2
                    font-semibold
                ">
                        = %
                    </p>

                </div>
            );
        };


        // ========================================================
        // CALCULATE
        // ========================================================

        const performCalculation = () => {

            console.group(
                "🔥 PROTEIN Calculation Started"
            );


            if (!selectedSamplePrep) {

                console.warn(
                    "Cannot calculate: Missing sample preparation."
                );

                onFieldChange(
                    calculation.id,
                    "calculationResult",
                    null
                );

                console.groupEnd();

                return;
            }


            const sampleWeight =
                toNumber(
                    calculation.sampleWeight
                );

            const sampleTitre =
                toNumber(
                    calculation.sampleTitreValue
                );

            const blankTitre =
                toNumber(
                    calculation.blankTitreValue
                );

            const normality =
                toNumber(
                    calculation.normality
                );

            const proteinFactor =
                toNumber(
                    calculation.proteinFactor
                );


            const factor14 =
                calculation.factor14;

            const multiplier100 =
                calculation.multiplier100;

            const denominator1000 =
                calculation.denominator1000;


            // ====================================================
            // VALIDATE SAMPLE WEIGHT
            // ====================================================

            if (sampleWeight <= 0) {

                onFieldChange(
                    calculation.id,
                    "calculationResult",
                    null
                );

                console.groupEnd();

                return;
            }


            // ====================================================
            // FORMULA
            //
            // Protein % =
            //
            // (Blank Titre - Sample Titre)
            // × Protein Factor
            // × 14.01
            // × Normality
            // × 100
            // --------------------------------
            // Sample Weight × 1000
            //
            // ====================================================

            const proteinPercentage =

                (
                    (
                        blankTitre -
                        sampleTitre
                    )
                    *
                    proteinFactor
                    *
                    factor14
                    *
                    normality
                    *
                    multiplier100
                )
                /
                (
                    sampleWeight *
                    denominator1000
                );


            console.log(
                "🔥 Protein Calculation:",
                {
                    sampleWeight,

                    sampleTitre,

                    blankTitre,

                    normality,

                    proteinFactor,

                    factor14,

                    multiplier100,

                    denominator1000,

                    result:
                        proteinPercentage,
                }
            );


            // ====================================================
            // RESULT
            // ====================================================

            if (
                isNaN(proteinPercentage) ||
                !isFinite(proteinPercentage)
            ) {

                console.error(
                    "❌ Protein result is NaN or Infinite"
                );

                onFieldChange(
                    calculation.id,
                    "calculationResult",
                    null
                );

            } else {

                onFieldChange(
                    calculation.id,
                    "calculationResult",
                    Number(
                        proteinPercentage.toFixed(3)
                    )
                );


                onFieldChange(
                    calculation.id,
                    "calculationResultUnit",
                    "%"
                );

            }


            console.groupEnd();
        };


        // ========================================================
        // RENDER
        // ========================================================

        return (

            <motion.div
                initial={{
                    opacity: 0,
                    y: 20
                }}
                animate={{
                    opacity: 1,
                    y: 0
                }}
                exit={{
                    opacity: 0,
                    y: -20
                }}
                className="
                bg-white
                rounded-xl
                shadow-lg
                border-2
                border-emerald-200
                overflow-hidden
                mb-6
            "
            >

                {/* ==================================================
                HEADER
            ================================================== */}

                <div className="
                relative
                bg-gradient-to-r
                from-emerald-700
                via-emerald-800
                to-slate-900
            ">

                    <div className="
                    relative
                    flex
                    items-center
                    justify-between
                    px-4
                    py-3
                ">

                        <div
                            className="
                            flex
                            items-center
                            gap-4
                            flex-1
                            cursor-pointer
                            select-none
                        "
                            onClick={() =>
                                setIsExpanded(
                                    !isExpanded
                                )
                            }
                        >

                            <motion.div
                                animate={{
                                    rotate:
                                        isExpanded
                                            ? 0
                                            : 360
                                }}
                                transition={{
                                    duration: 0.5
                                }}
                            >

                                <div className="
                                p-2
                                bg-white/20
                                rounded-lg
                                backdrop-blur-md
                                border
                                border-white/30
                            ">

                                    <Calculator
                                        className="
                                        w-5
                                        h-5
                                        text-white
                                    "
                                    />

                                </div>

                            </motion.div>


                            <div>

                                <h4 className="
                                text-sm
                                font-semibold
                                text-white
                                tracking-wide
                            ">

                                    {calculation.label}

                                </h4>


                                <p className="
                                text-xs
                                text-emerald-100
                            ">

                                    Calculation for Protein

                                </p>

                            </div>

                        </div>


                        <div className="
                        flex
                        items-center
                        gap-3
                    ">

                            <motion.button
                                onClick={() =>
                                    setIsExpanded(
                                        !isExpanded
                                    )
                                }
                                whileHover={{
                                    scale: 1.1
                                }}
                                whileTap={{
                                    scale: 0.95
                                }}
                                className="
                                p-2
                                hover:bg-white/20
                                rounded-lg
                            "
                            >

                                <motion.div
                                    animate={{
                                        rotate:
                                            isExpanded
                                                ? 180
                                                : 0
                                    }}
                                >

                                    <ChevronDown
                                        className="
                                        w-5
                                        h-5
                                        text-white
                                    "
                                    />

                                </motion.div>

                            </motion.button>


                            <motion.button
                                onClick={(e) => {

                                    e.stopPropagation();

                                    onRemove();

                                }}
                                whileHover={{
                                    scale: 1.1,
                                    rotate: 5
                                }}
                                whileTap={{
                                    scale: 0.9
                                }}
                                className="
                                p-2
                                bg-white/20
                                rounded-lg
                                border
                                border-white/30
                            "
                            >

                                <Trash
                                    className="
                                    w-4
                                    h-4
                                    text-white
                                "
                                />

                            </motion.button>

                        </div>

                    </div>

                </div>


                {/* ==================================================
                VALIDATION ERRORS
            ================================================== */}

                {!validationResult.isValid &&
                    isExpanded && (

                        <motion.div
                            initial={{
                                opacity: 0,
                                height: 0
                            }}
                            animate={{
                                opacity: 1,
                                height: "auto"
                            }}
                            className="
                            bg-red-50
                            border-b-2
                            border-red-200
                        "
                        >

                            <div className="p-4">

                                <div className="
                                flex
                                items-start
                                gap-3
                            ">

                                    <XCircle
                                        className="
                                        w-5
                                        h-5
                                        text-red-600
                                        mt-0.5
                                    "
                                    />

                                    <div>

                                        <h4 className="
                                        text-sm
                                        font-bold
                                        text-red-800
                                        mb-2
                                    ">

                                            Validation Errors
                                            {" "}
                                            (
                                            {
                                                validationResult
                                                    .errors
                                                    .length
                                            }
                                            )

                                        </h4>


                                        <ul className="
                                        space-y-1
                                    ">

                                            {
                                                validationResult
                                                    .errors
                                                    .map(
                                                        (
                                                            error,
                                                            index
                                                        ) => (

                                                            <li
                                                                key={index}
                                                                className="
                                                                text-xs
                                                                text-red-700
                                                            "
                                                            >

                                                                •
                                                                {" "}
                                                                {error}

                                                            </li>

                                                        )
                                                    )
                                            }

                                        </ul>

                                    </div>

                                </div>

                            </div>

                        </motion.div>

                    )}


                {/* ==================================================
                VALID
            ================================================== */}

                {validationResult.isValid &&
                    isExpanded && (

                        <motion.div
                            className="
                            bg-emerald-50
                            border-b-2
                            border-emerald-200
                        "
                        >

                            <div className="p-3">

                                <div className="
                                flex
                                items-center
                                gap-2
                            ">

                                    <CheckCircle2
                                        className="
                                        w-5
                                        h-5
                                        text-emerald-600
                                    "
                                    />

                                    <p className="
                                    text-sm
                                    font-semibold
                                    text-emerald-800
                                ">

                                        All required fields
                                        are valid -
                                        Ready to calculate

                                    </p>

                                </div>

                            </div>

                        </motion.div>

                    )}


                {/* ==================================================
                BODY
            ================================================== */}

                {isExpanded && (

                    <div className="
                    border-t-4
                    border-emerald-300
                ">

                        <AnimatePresence>

                            <motion.div
                                initial={{
                                    height: 0,
                                    opacity: 0
                                }}
                                animate={{
                                    height: "auto",
                                    opacity: 1
                                }}
                            >

                                <div className="
    p-6
    bg-gradient-to-b
    from-gray-50
    to-white
    space-y-6
">


                                    {/* =================================
                                    SAMPLE PREPARATION
                                ================================= */}

                                    <div className="
                                    bg-gradient-to-r
                                    from-emerald-50
                                    to-slate-50
                                    rounded-lg
                                    p-4
                                    border-2
                                    border-emerald-200
                                ">

                                        <label className="
                                        block
                                        text-sm
                                        font-bold
                                        text-gray-700
                                        mb-2
                                    ">

                                            Select Sample Preparation

                                        </label>


                                        <CustomDropdown
                                            options={
                                                samplePreparations.map(
                                                    prep => ({
                                                        value:
                                                            prep.label,

                                                        label:
                                                            prep.label,
                                                    })
                                                )
                                            }

                                            value={
                                                calculation
                                                    .selectedSamplePreparationLabel
                                                || ""
                                            }

                                            onChange={handleSamplePreparationChange}

                                            placeholder="
                                            Select sample preparation...
                                        "

                                            colorScheme="emerald"
                                        />

                                    </div>


                                    {/* =================================
                                    INPUTS
                                ================================= */}




                                    {/* =================================
                                    FORMULA
                                ================================= */}

                                    {selectedSamplePrep && (
                                        <FormulaDisplay />
                                    )}


                                    {/* =================================
                                    ACCEPTANCE LIMIT
                                ================================= */}

                                    {selectedSamplePrep && (

                                        <div className="
                                        bg-gradient-to-r
                                        from-emerald-50
                                        to-slate-50
                                        rounded-lg
                                        p-4
                                        border-2
                                        border-emerald-200
                                    ">

                                            <h5 className="
                                            text-sm
                                            font-bold
                                            text-gray-700
                                            mb-3
                                        ">

                                                Acceptance Limit

                                            </h5>


                                            <div className="flex items-center gap-2">

                                                <input
                                                    type="number"
                                                    step="any"
                                                    value={calculation.acceptanceLimitMin ?? ""}
                                                    onChange={(e) =>
                                                        onFieldChange(
                                                            calculation.id,
                                                            "acceptanceLimitMin",
                                                            e.target.value
                                                        )
                                                    }
                                                    placeholder="Enter min limit"
                                                    className="
            w-full
            px-3
            py-2
            bg-white
            border
            border-emerald-300
            rounded-lg
            text-sm
            text-gray-800
            placeholder:text-gray-400
            focus:outline-none
            focus:ring-2
            focus:ring-emerald-500
            focus:border-emerald-500
        "
                                                />

                                                <span className="
        shrink-0
        text-sm
        font-medium
        text-gray-600
    ">
                                                    to
                                                </span>

                                                <input
                                                    type="number"
                                                    step="any"
                                                    value={calculation.acceptanceLimitMax ?? ""}
                                                    onChange={(e) =>
                                                        onFieldChange(
                                                            calculation.id,
                                                            "acceptanceLimitMax",
                                                            e.target.value
                                                        )
                                                    }
                                                    placeholder="Enter max limit"
                                                    className="
            w-full
            px-3
            py-2
            bg-white
            border
            border-emerald-300
            rounded-lg
            text-sm
            text-gray-800
            placeholder:text-gray-400
            focus:outline-none
            focus:ring-2
            focus:ring-emerald-500
            focus:border-emerald-500
        "
                                                />

                                            </div>

                                        </div>

                                    )}


                                    {/* =================================
                                    CALCULATE BUTTON
                                ================================= */}

                                    {selectedSamplePrep && (

                                        <div className="
                                        flex
                                        justify-center
                                    ">

                                            <motion.button
                                                onClick={
                                                    performCalculation
                                                }
                                                whileHover={{
                                                    scale: 1.02
                                                }}
                                                whileTap={{
                                                    scale: 0.98
                                                }}
                                                className="
                                                flex
                                                items-center
                                                gap-2
                                                px-6
                                                py-2.5
                                                bg-gradient-to-r
                                                from-emerald-700
                                                via-emerald-800
                                                to-slate-900
                                                text-white
                                                font-semibold
                                                rounded-lg
                                                shadow-md
                                            "
                                            >

                                                <Calculator
                                                    className="
                                                    w-4
                                                    h-4
                                                "
                                                />

                                                Calculate Result

                                            </motion.button>

                                        </div>

                                    )}


                                    {!selectedSamplePrep && (

                                        <div className="
                                        bg-emerald-50
                                        border-2
                                        border-emerald-300
                                        rounded-lg
                                        p-3
                                        text-center
                                    ">

                                            <p className="
                                            text-xs
                                            text-emerald-800
                                            font-medium
                                        ">

                                                Please select a sample
                                                preparation to enable
                                                calculation

                                            </p>

                                        </div>

                                    )}

                                </div>


                                {/* ======================================
                                RESULT
                            ====================================== */}

                                {calculation.calculationResult !== null && (

                                    <motion.div
                                        initial={{
                                            opacity: 0,
                                            y: 20
                                        }}
                                        animate={{
                                            opacity: 1,
                                            y: 0
                                        }}
                                        className="
                                        border-t-4
                                        border-emerald-200
                                    "
                                    >

                                        <div className="
                                        p-6
                                        bg-gradient-to-br
                                        from-emerald-50
                                        via-slate-100/30
                                        to-slate-50
                                    ">

                                            <div className="
                                            max-w-4xl
                                            mx-auto
                                        ">

                                                <div className="
                                                flex
                                                items-center
                                                gap-3
                                                pb-3
                                            ">

                                                    <CheckCircle2
                                                        className="
                                                        w-6
                                                        h-6
                                                        text-emerald-700
                                                    "
                                                    />

                                                    <h6 className="
                                                    text-lg
                                                    font-bold
                                                    text-emerald-700
                                                ">

                                                        Calculation Results

                                                    </h6>

                                                </div>


                                                <div className="
                                                bg-white
                                                rounded-lg
                                                shadow-lg
                                                border-2
                                                border-emerald-300
                                                overflow-hidden
                                            ">

                                                    <div className="
                                                    bg-gradient-to-r
                                                    from-emerald-700
                                                    via-emerald-800
                                                    to-slate-900
                                                    px-4
                                                    py-2
                                                ">

                                                        <h6 className="
                                                        text-sm
                                                        font-bold
                                                        text-white
                                                    ">

                                                            Protein Result

                                                        </h6>

                                                    </div>


                                                    <div className="
                                                    flex
                                                    items-center
                                                    gap-3
                                                    p-4
                                                ">

                                                        <p className="
                                                        text-2xl
                                                        font-bold
                                                        text-gray-800
                                                    ">

                                                            {
                                                                calculation
                                                                    .calculationResult
                                                            }

                                                            {" "}

                                                            {
                                                                calculation
                                                                    .calculationResultUnit
                                                            }

                                                        </p>


                                                        {/* PASS / FAIL */}
                                                        {(() => {

                                                            const min =
                                                                calculation.acceptanceLimitMin
                                                                    ? parseFloat(
                                                                        calculation.acceptanceLimitMin
                                                                    )
                                                                    : null;

                                                            const max =
                                                                calculation.acceptanceLimitMax
                                                                    ? parseFloat(
                                                                        calculation.acceptanceLimitMax
                                                                    )
                                                                    : null;

                                                            const value =
                                                                Number(calculation.calculationResult);

                                                            const hasMin =
                                                                min !== null &&
                                                                !isNaN(min);

                                                            const hasMax =
                                                                max !== null &&
                                                                !isNaN(max);

                                                            // No acceptance limit entered
                                                            if (!hasMin && !hasMax) {
                                                                return null;
                                                            }

                                                            const pass =
                                                                (!hasMin || value >= min!) &&
                                                                (!hasMax || value <= max!);

                                                            return (
                                                                <span
                                                                    className={`
                inline-flex
                items-center
                justify-center
                min-w-[54px]
                h-[30px]
                px-3
                rounded-full
                text-xs
                font-semibold
                border
                ${pass
                                                                            ? `
                            bg-emerald-50
                            text-emerald-700
                            border-emerald-300
                        `
                                                                            : `
                            bg-red-50
                            text-red-600
                            border-red-300
                        `
                                                                        }
            `}
                                                                >
                                                                    {pass ? "Pass" : "Fail"}
                                                                </span>
                                                            );

                                                        })()}

                                                    </div>

                                                </div>


                                                {/* SAMPLE PREP */}

                                                <div className="
                                                mt-4
                                                bg-white/80
                                                rounded-lg
                                                border
                                                border-gray-200
                                                p-4
                                            ">

                                                    <p className="
                                                    text-gray-600
                                                    font-medium
                                                ">

                                                        Sample Prep

                                                    </p>

                                                    <p className="
                                                    text-gray-900
                                                    font-semibold
                                                ">

                                                        {
                                                            calculation
                                                                .selectedSamplePreparationLabel
                                                            ||
                                                            "N/A"
                                                        }

                                                    </p>

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


export default CalculationDetailProtein;