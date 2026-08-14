import React, {
    useMemo,
    useState
} from "react";

import {
    Calculator,
    ChevronDown,
    Trash,
    CheckCircle2,
    XCircle
} from "lucide-react";

import {
    motion,
    AnimatePresence
} from "framer-motion";

import type {
    CalculationPeroxideValue
} from "./models/CalculationPeroxideValue";

import type {
    SamplePreparationPeroxideValue
} from "./models/SamplePreparationPeroxideValue";

import CustomDropdown
    from "../../../components/shared/CustomDropdown";


// ============================================================
// PROPS
// ============================================================

interface Props {

    calculation:
        CalculationPeroxideValue;

    samplePreparations:
        SamplePreparationPeroxideValue[];

    onRemove:
        () => void;

    onFieldChange: (
        calculationId: number,
        field: keyof CalculationPeroxideValue,
        value: any
    ) => void;

    role?: string;
}


// ============================================================
// NUMBER HELPER
// ============================================================

const toNumber = (
    value:
        | string
        | number
        | null
        | undefined
): number => {

    if (
        value === null ||
        value === undefined ||
        value === ""
    ) {

        return 0;

    }

    const result =
        Number(value);

    return Number.isFinite(result)
        ? result
        : 0;
};


// ============================================================
// COMPONENT
// ============================================================

const CalculationDetailPeroxideValue:
    React.FC<Props> = ({

        calculation,

        samplePreparations,

        onRemove,

        onFieldChange

    }) => {


    // ========================================================
    // EXPAND / COLLAPSE
    // ========================================================

    const [
        isExpanded,
        setIsExpanded
    ] = useState(true);


    // ========================================================
    // SELECTED SAMPLE PREPARATION
    // ========================================================

    const selectedPreparation =
        useMemo(() => {

            if (
                !calculation
                    .selectedSamplePreparationLabel
            ) {

                return undefined;

            }

            return samplePreparations.find(
                preparation =>
                    preparation.label ===
                    calculation
                        .selectedSamplePreparationLabel
            );

        }, [

            samplePreparations,

            calculation
                .selectedSamplePreparationLabel

        ]);


    // ========================================================
    // GET STEP
    // ========================================================

    const getStep = (
        stepName: string,
        fallbackIndex?: number
    ) => {

        if (
            !selectedPreparation
        ) {

            return undefined;

        }

        const normalize = (
            value: string
        ) =>
            value
                .trim()
                .toLowerCase()
                .replace(/\\s+/g, " ");


        const normalizedName =
            normalize(stepName);


        const matchedStep =
            (
                selectedPreparation.steps ?? []
            ).find(
                step =>
                    normalize(step.name) ===
                    normalizedName
            );


        // Peroxide Value always has these three
        // preparation values in W1 / W2 / W order.
        if (matchedStep)
            return matchedStep;


        if (
            fallbackIndex !== undefined
        ) {

            return (
                selectedPreparation.steps ??
                []
            )[fallbackIndex];

        }


        return undefined;

    };


    // ========================================================
    // READ PREPARATION VALUES
    // ========================================================

    const sampleWeight = toNumber(
        getStep("Sample Weight", 0)?.value1
    );

    const sampleTitreValue = toNumber(
        getStep("Sample Titre Value", 1)?.value1
    );

    const blankTitreValue = toNumber(
        getStep("Blank Titre Value", 2)?.value1
    );

    const normality = toNumber(
        getStep("Normality", 3)?.value1
    );


    // ========================================================
    // PEROXIDE VALUE CALCULATION
    // ========================================================

    const calculatedPeroxideValue = useMemo(() => {

        if (
            sampleWeight <= 0 ||
            sampleTitreValue < 0 ||
            blankTitreValue < 0 ||
            normality <= 0
        ) {
            return 0;
        }

        const result =
            ((sampleTitreValue - blankTitreValue) *
                normality *
                1000) /
            sampleWeight;

        return result >= 0 ? result : 0;

    }, [
        sampleWeight,
        sampleTitreValue,
        blankTitreValue,
        normality
    ]);

    // ========================================================
    // VALIDATION
    // ========================================================

    const validationErrors = useMemo(() => {

        const errors: string[] = [];

        if (!selectedPreparation) {
            errors.push("Please select a Sample Preparation");
            return errors;
        }

        if (sampleWeight <= 0) {
            errors.push("Sample Weight must be greater than 0");
        }

        if (sampleTitreValue < 0) {
            errors.push("Sample Titre Value cannot be negative");
        }

        if (blankTitreValue < 0) {
            errors.push("Blank Titre Value cannot be negative");
        }

        if (sampleTitreValue < blankTitreValue) {
            errors.push(
                "Sample Titre Value must be greater than or equal to Blank Titre Value"
            );
        }

        if (normality <= 0) {
            errors.push("Normality must be greater than 0");
        }

        return errors;

    }, [
        selectedPreparation,
        sampleWeight,
        sampleTitreValue,
        blankTitreValue,
        normality
    ]);


    const isValid =
        validationErrors.length === 0;


    // ========================================================
    // SAMPLE PREPARATION CHANGE
    // ========================================================

    const handleSamplePreparationChange =
        (
            value: string
        ) => {

            // -----------------------------------------------
            // SAVE SELECTED PREPARATION
            // -----------------------------------------------

            onFieldChange(
                calculation.id,
                "selectedSamplePreparationLabel",
                value
            );


            // -----------------------------------------------
            // CLEAR PREVIOUS RESULT
            // -----------------------------------------------

            onFieldChange(
                calculation.id,
                "calculationResult",
                null
            );

        };


    // ========================================================
    // CALCULATE RESULT
    // ========================================================

    const handleCalculate =
        () => {

            if (
                !isValid
            ) {

                onFieldChange(
                    calculation.id,
                    "calculationResult",
                    null
                );

                return;

            }


            const result =
                Number(
                    calculatedPeroxideValue.toFixed(2)
                );


            onFieldChange(
                calculation.id,
                "calculationResult",
                result
            );


            onFieldChange(
                calculation.id,
                "calculationResultUnit",
                "meq/kg"
            );

        };


    // ========================================================
    // ACCEPTANCE LIMIT STATUS
    // ========================================================

    const acceptanceStatus =
        useMemo(() => {

            const min =
                Number(calculation.acceptanceLimitMin);

            const max =
                Number(calculation.acceptanceLimitMax);

            const hasMin =
                calculation.acceptanceLimitMin !== "" &&
                Number.isFinite(min);

            const hasMax =
                calculation.acceptanceLimitMax !== "" &&
                Number.isFinite(max);

            if (!hasMin && !hasMax)
                return null;

            if (
                hasMin &&
                hasMax
            ) {
                return (
                    calculatedPeroxideValue >= min &&
                    calculatedPeroxideValue <= max
                );
            }

            if (hasMin)
                return calculatedPeroxideValue >= min;

            return calculatedPeroxideValue <= max;

        }, [
            calculation.acceptanceLimitMin,
            calculation.acceptanceLimitMax,
            calculatedPeroxideValue
        ]);


    // ============================================================
    // RENDER
    // ============================================================

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

            <div
                className="
                    bg-gradient-to-r
                    from-emerald-700
                    via-emerald-800
                    to-slate-900
                "
            >

                <div
                    className="
                        flex
                        items-center
                        justify-between
                        px-4
                        py-3
                    "
                >

                    {/* LEFT */}

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

                        <div
                            className="
                                p-2
                                bg-white/20
                                rounded-lg
                                backdrop-blur-md
                                border
                                border-white/30
                            "
                        >

                            <Calculator
                                className="
                                    w-5
                                    h-5
                                    text-white
                                "
                            />

                        </div>


                        <div>

                            <h4
                                className="
                                    text-sm
                                    font-semibold
                                    text-white
                                    tracking-wide
                                "
                            >

                                {
                                    calculation.label
                                }

                            </h4>


                            <p
                                className="
                                    text-xs
                                    text-emerald-100
                                "
                            >

                                Calculation for Peroxide Value

                            </p>

                        </div>

                    </div>


                    {/* RIGHT */}

                    <div
                        className="
                            flex
                            items-center
                            gap-2
                        "
                    >

                        {/* COLLAPSE */}

                        <button

                            type="button"

                            onClick={() =>
                                setIsExpanded(
                                    !isExpanded
                                )
                            }

                            className="
                                p-2
                                hover:bg-white/20
                                rounded-lg
                                transition
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

                        </button>


                        {/* DELETE */}

                        <button

                            type="button"

                            onClick={(event) => {

                                event.stopPropagation();

                                onRemove();

                            }}

                            className="
                                p-2
                                bg-white/20
                                rounded-lg
                                border
                                border-white/30
                                hover:bg-red-500/30
                                transition
                            "
                        >

                            <Trash
                                className="
                                    w-4
                                    h-4
                                    text-white
                                "
                            />

                        </button>

                    </div>

                </div>

            </div>


            {/* ==================================================
                BODY
            ================================================== */}

            <AnimatePresence>

                {isExpanded && (

                    <motion.div

                        initial={{
                            height: 0,
                            opacity: 0
                        }}

                        animate={{
                            height: "auto",
                            opacity: 1
                        }}

                        exit={{
                            height: 0,
                            opacity: 0
                        }}

                        transition={{
                            duration: 0.3
                        }}

                        className="
                            border-t-4
                            border-emerald-300
                        "
                    >

                        <div
                            className="
                                p-6
                                bg-gradient-to-b
                                from-gray-50
                                to-white
                                space-y-6
                            "
                        >

                            {/* =================================================
                                SAMPLE PREPARATION DROPDOWN
                            ================================================= */}

                            <div
                                className="
                                    bg-gradient-to-r
                                    from-emerald-50
                                    to-slate-50
                                    rounded-lg
                                    p-4
                                    border-2
                                    border-emerald-200
                                "
                            >

                                <label
                                    className="
                                        block
                                        text-sm
                                        font-bold
                                        text-gray-700
                                        mb-2
                                    "
                                >

                                    Select Sample Preparation

                                </label>


                                <CustomDropdown

                                    options={
                                        samplePreparations.map(
                                            preparation => ({

                                                value:
                                                    preparation.label,

                                                label:
                                                    preparation.label

                                            })
                                        )
                                    }

                                    value={
                                        calculation
                                            .selectedSamplePreparationLabel
                                        || ""
                                    }

                                    onChange={
                                        handleSamplePreparationChange
                                    }

                                    placeholder="
                                        Select sample preparation
                                    "

                                    colorScheme="emerald"

                                />

                            </div>


                            {/* =================================================
                                VALIDATION
                            ================================================= */}

                            {selectedPreparation &&
                                validationErrors.length > 0 && (

                                    <div
                                        className="
                                            bg-red-50
                                            border-2
                                            border-red-200
                                            rounded-lg
                                            p-4
                                        "
                                    >

                                        <div
                                            className="
                                                flex
                                                items-start
                                                gap-3
                                            "
                                        >

                                            <XCircle
                                                className="
                                                    w-5
                                                    h-5
                                                    text-red-600
                                                    mt-0.5
                                                "
                                            />


                                            <div>

                                                <h4
                                                    className="
                                                        text-sm
                                                        font-bold
                                                        text-red-800
                                                        mb-2
                                                    "
                                                >

                                                    Validation Errors

                                                </h4>


                                                <ul
                                                    className="
                                                        space-y-1
                                                    "
                                                >

                                                    {validationErrors.map(
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

                                                                • {error}

                                                            </li>

                                                        )
                                                    )}

                                                </ul>

                                            </div>

                                        </div>

                                    </div>

                                )}


                            {/* =================================================
                                CRUDE FIBER VALUES
                            ================================================= */}

                            


                            {/* =================================================
                                FORMULA
                            ================================================= */}

                            {selectedPreparation && (

                                <div
                                    className="
                                        bg-white
                                        rounded-lg
                                        p-5
                                        border-2
                                        border-emerald-200
                                        shadow-sm
                                    "
                                >

                                    <h4
                                        className="
                                            text-sm
                                            font-bold
                                            text-gray-800
                                            mb-4
                                        "
                                    >

                                        Formula for Peroxide Value

                                    </h4>

                                    <div
                                        className="
                                            bg-gray-50
                                            rounded-lg
                                            p-4
                                            text-center
                                        "
                                    >

                                        <p
                                            className="
                                                text-sm
                                                font-mono
                                                font-semibold
                                                text-gray-700
                                            "
                                        >

                                            ((Sample Titre − Blank Titre) × Normality × 1000) ÷ Sample Weight

                                        </p>

                                    </div>

                                    <div
                                        className="
                                            mt-4
                                            bg-emerald-50
                                            rounded-lg
                                            p-5
                                        "
                                    >

                                        <p
                                            className="
                                                text-center
                                                text-sm
                                                font-mono
                                                text-gray-700
                                            "
                                        >

                                            ((
                                            {sampleTitreValue.toFixed(4)}
                                            {" − "}
                                            {blankTitreValue.toFixed(4)}
                                            ) × {normality.toFixed(4)} × 1000) ÷ {sampleWeight.toFixed(4)}

                                        </p>

                                        <div
                                            className="
                                                mt-4
                                                text-center
                                                text-xl
                                                font-bold
                                                text-emerald-800
                                            "
                                        >

                                            = {calculatedPeroxideValue.toFixed(2)} meq/kg

                                        </div>

                                    </div>

                                </div>

                            )}


                            {/* =================================================
                                ACCEPTANCE LIMIT
                            ================================================= */}

                            {selectedPreparation && (

                                <div
                                    className="
                                        bg-gradient-to-r
                                        from-emerald-50
                                        to-slate-50
                                        rounded-lg
                                        p-4
                                        border-2
                                        border-emerald-200
                                    "
                                >

                                    <label
                                        className="
                                            block
                                            text-sm
                                            font-bold
                                            text-gray-700
                                            mb-3
                                        "
                                    >
                                        Acceptance Limit
                                    </label>

                                    <div
                                        className="
                                            flex
                                            items-center
                                            gap-4
                                        "
                                    >

                                        <input
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            inputMode="decimal"
                                            value={
                                                calculation.acceptanceLimitMin
                                            }
                                            onChange={(e) =>
                                                onFieldChange(
                                                    calculation.id,
                                                    "acceptanceLimitMin",
                                                    e.target.value
                                                )
                                            }
                                            placeholder="Minimum"
                                            className="
                                                flex-1
                                                px-3
                                                py-2.5
                                                border
                                                border-emerald-300
                                                rounded-lg
                                                text-sm
                                                bg-white
                                                focus:outline-none
                                                focus:ring-2
                                                focus:ring-emerald-400
                                                focus:border-transparent
                                            "
                                        />

                                        <span
                                            className="
                                                text-sm
                                                font-medium
                                                text-gray-600
                                            "
                                        >
                                            to
                                        </span>

                                        <input
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            inputMode="decimal"
                                            value={
                                                calculation.acceptanceLimitMax
                                            }
                                            onChange={(e) =>
                                                onFieldChange(
                                                    calculation.id,
                                                    "acceptanceLimitMax",
                                                    e.target.value
                                                )
                                            }
                                            placeholder="Maximum"
                                            className="
                                                flex-1
                                                px-3
                                                py-2.5
                                                border
                                                border-emerald-300
                                                rounded-lg
                                                text-sm
                                                bg-white
                                                focus:outline-none
                                                focus:ring-2
                                                focus:ring-emerald-400
                                                focus:border-transparent
                                            "
                                        />


                                    </div>

                                </div>

                            )}


                            {/* =================================================
                                CALCULATE BUTTON
                            ================================================= */}

                            {selectedPreparation && (

                                <div
                                    className="
                                        flex
                                        justify-center
                                    "
                                >

                                    <motion.button

                                        type="button"

                                        onClick={
                                            handleCalculate
                                        }

                                        disabled={
                                            !isValid
                                        }

                                        whileHover={
                                            isValid
                                                ? {
                                                    scale: 1.02
                                                }
                                                : {}
                                        }

                                        whileTap={
                                            isValid
                                                ? {
                                                    scale: 0.98
                                                }
                                                : {}
                                        }

                                        className={`
                                            flex
                                            items-center
                                            gap-2
                                            px-7
                                            py-3
                                            rounded-lg
                                            text-sm
                                            font-semibold
                                            text-white
                                            shadow-md
                                            transition-all

                                            ${
                                                isValid
                                                    ? `
                                                        bg-gradient-to-r
                                                        from-emerald-700
                                                        via-emerald-800
                                                        to-slate-900
                                                        hover:shadow-lg
                                                    `
                                                    : `
                                                        bg-gray-400
                                                        cursor-not-allowed
                                                    `
                                            }
                                        `}
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


                            {/* =================================================
                                NO PREPARATION
                            ================================================= */}

                            {!selectedPreparation && (

                                <div
                                    className="
                                        bg-emerald-50
                                        border-2
                                        border-emerald-200
                                        rounded-lg
                                        p-4
                                        text-center
                                    "
                                >

                                    <p
                                        className="
                                            text-sm
                                            text-emerald-800
                                            font-medium
                                        "
                                    >

                                        Please select a sample
                                        preparation to enable
                                        calculation.

                                    </p>

                                </div>

                            )}


                            {/* =================================================
                                RESULT
                            ================================================= */}

                            {
                                calculation.calculationResult !== null &&
                                calculation.calculationResult !== undefined && (

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
                                            pt-6
                                        "
                                    >

                                        <div
                                            className="
                                                flex
                                                items-center
                                                gap-3
                                                pb-3
                                            "
                                        >

                                            <CheckCircle2
                                                className="
                                                    w-6
                                                    h-6
                                                    text-emerald-700
                                                "
                                            />


                                            <h6
                                                className="
                                                    text-lg
                                                    font-bold
                                                    text-emerald-700
                                                "
                                            >

                                                Calculation Results

                                            </h6>

                                        </div>


                                        {/* RESULT CARD */}

                                        <div
                                            className="
                                                bg-white
                                                rounded-lg
                                                shadow-lg
                                                border-2
                                                border-emerald-300
                                                overflow-hidden
                                            "
                                        >

                                            {/* HEADER */}

                                            <div
                                                className="
                                                    bg-gradient-to-r
                                                    from-emerald-700
                                                    via-emerald-800
                                                    to-slate-900
                                                    px-4
                                                    py-3
                                                "
                                            >

                                                <h6
                                                    className="
                                                        text-sm
                                                        font-bold
                                                        text-white
                                                    "
                                                >

                                                    Peroxide Value Result

                                                </h6>

                                            </div>


                                            {/* RESULT BODY */}

                                            <div
                                                className="
                                                    flex
                                                    items-center
                                                    gap-4
                                                    p-5
                                                "
                                            >

                                                <div>

                                                    <p
                                                        className="
                                                            text-xs
                                                            text-gray-500
                                                            mb-1
                                                        "
                                                    >

                                                        Peroxide Value

                                                    </p>


                                                    <p
                                                        className="
                                                            text-2xl
                                                            font-bold
                                                            text-gray-800
                                                        "
                                                    >

                                                        {
                                                            Number(
                                                                calculation
                                                                    .calculationResult
                                                            ).toFixed(2)
                                                        }

                                                        {" "}

                                                        meq/kg

                                                    </p>

                                                </div>

                                                {acceptanceStatus !== null && (
                                                    <div
                                                        className={`
                                                            px-3
                                                            py-1.5
                                                            rounded-full
                                                            text-xs
                                                            font-semibold
                                                            border
                                                            ${
                                                                acceptanceStatus
                                                                    ? `
                                                                        bg-emerald-50
                                                                        text-emerald-700
                                                                        border-emerald-300
                                                                    `
                                                                    : `
                                                                        bg-red-50
                                                                        text-red-700
                                                                        border-red-300
                                                                    `
                                                            }
                                                        `}
                                                    >
                                                        {acceptanceStatus
                                                            ? "Pass"
                                                            : "Fail"}
                                                    </div>
                                                )}

                                            </div>

                                        </div>


                                        {/* SELECTED PREPARATION */}

                                        <div
                                            className="
                                                mt-4
                                                bg-white/80
                                                rounded-lg
                                                border
                                                border-gray-200
                                                p-4
                                            "
                                        >

                                            <p
                                                className="
                                                    text-xs
                                                    text-gray-500
                                                    mb-1
                                                "
                                            >

                                                Sample Prep

                                            </p>


                                            <p
                                                className="
                                                    text-sm
                                                    font-semibold
                                                    text-gray-800
                                                "
                                            >

                                                {
                                                    calculation
                                                        .selectedSamplePreparationLabel
                                                    ||
                                                    "N/A"
                                                }

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


export default CalculationDetailPeroxideValue;