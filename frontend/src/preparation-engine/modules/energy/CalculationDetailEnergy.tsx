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
    CalculationEnergy
} from "./models/CalculationEnergy";

import type {
    SamplePreparationEnergy
} from "./models/SamplePreparationEnergy";

import CustomDropdown
    from "../../../components/shared/CustomDropdown";


// ============================================================
// PROPS
// ============================================================

interface Props {

    calculation:
        CalculationEnergy;

    samplePreparations:
        SamplePreparationEnergy[];

    onRemove:
        () => void;

    onFieldChange:
        (
            calculationId: number,
            field: keyof CalculationEnergy,
            value: any
        ) => void;

    role?: string;
}


// ============================================================
// NUMBER HELPER
// ============================================================

const toNumber = (
    value:
        string |
        number |
        null |
        undefined
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

const CalculationDetailEnergy:
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

    const getStep =
        (
            stepName: string
        ) => {

            if (
                !selectedPreparation
            ) {

                return undefined;

            }


            return (
                selectedPreparation.steps ?? []
            ).find(
                step =>
                    step.name ===
                    stepName
            );

        };


    // ========================================================
    // READ PREPARATION VALUES
    // ========================================================

    const protein =
        toNumber(
            getStep(
                "Protein"
            )?.value1
        );


    const carbohydrate =
        toNumber(
            getStep(
                "Carbohydrate"
            )?.value1
        );


    const fat =
        toNumber(
            getStep(
                "Fat"
            )?.value1
        );


    // ========================================================
    // ENERGY FACTORS
    // ========================================================

    const proteinFactor =
        calculation.proteinFactor ?? 4;

    const carbohydrateFactor =
        calculation.carbohydrateFactor ?? 4;

    const fatFactor =
        calculation.fatFactor ?? 9;


    // ========================================================
    // ENERGY CALCULATION
    // ========================================================

    const calculatedEnergy =
        useMemo(() => {

            return (
                (protein * proteinFactor) +
                (carbohydrate * carbohydrateFactor) +
                (fat * fatFactor)
            );

        }, [

            protein,

            carbohydrate,

            fat,

            proteinFactor,

            carbohydrateFactor,

            fatFactor

        ]);


    // ========================================================
    // VALIDATION
    // ========================================================

    const validationErrors =
        useMemo(() => {

            const errors:
                string[] = [];


            if (
                !selectedPreparation
            ) {

                errors.push(
                    "Please select a Sample Preparation"
                );

                return errors;

            }


            if (
                protein <= 0
            ) {

                errors.push(
                    "Protein value is required"
                );

            }


            if (
                carbohydrate <= 0
            ) {

                errors.push(
                    "Carbohydrate value is required"
                );

            }


            if (
                fat <= 0
            ) {

                errors.push(
                    "Fat value is required"
                );

            }


            return errors;

        }, [

            selectedPreparation,

            protein,

            carbohydrate,

            fat

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
                    calculatedEnergy.toFixed(2)
                );


            onFieldChange(
                calculation.id,
                "calculationResult",
                result
            );


            onFieldChange(
                calculation.id,
                "calculationResultUnit",
                "Kcal/100g"
            );

        };


    // ========================================================
    // RESULT STATUS
    // ========================================================

    const resultStatus =
        useMemo(() => {

            if (
                calculation.calculationResult === null ||
                calculation.calculationResult === undefined
            ) {

                return null;

            }


            const result =
                Number(
                    calculation.calculationResult
                );


            const min =
                calculation.acceptanceLimitMin !== ""
                    ? Number(
                        calculation.acceptanceLimitMin
                    )
                    : null;


            const max =
                calculation.acceptanceLimitMax !== ""
                    ? Number(
                        calculation.acceptanceLimitMax
                    )
                    : null;


            const hasMin =
                min !== null &&
                Number.isFinite(min);


            const hasMax =
                max !== null &&
                Number.isFinite(max);


            if (
                !hasMin &&
                !hasMax
            ) {

                return null;

            }


            const pass =
                (
                    !hasMin ||
                    result >= min!
                ) &&
                (
                    !hasMax ||
                    result <= max!
                );


            return pass
                ? "Pass"
                : "Fail";

        }, [

            calculation.calculationResult,

            calculation.acceptanceLimitMin,

            calculation.acceptanceLimitMax

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

                                {calculation.label}

                            </h4>


                            <p
                                className="
                                    text-xs
                                    text-emerald-100
                                "
                            >

                                Calculation for Energy

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
                                ENERGY VALUES
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

                                        Formula for Energy

                                    </h4>


                                    {/* FORMULA */}

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

                                            (4 × Protein)
                                            {" + "}
                                            (4 × Carbohydrate)
                                            {" + "}
                                            (9 × Fat)

                                        </p>

                                    </div>


                                    {/* ACTUAL CALCULATION */}

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

                                            (
                                            {protein.toFixed(4)}
                                            {" × "}
                                            {proteinFactor.toFixed(2)}
                                            )
                                            {" + "}

                                            (
                                            {carbohydrate.toFixed(4)}
                                            {" × "}
                                            {carbohydrateFactor.toFixed(2)}
                                            )
                                            {" + "}

                                            (
                                            {fat.toFixed(4)}
                                            {" × "}
                                            {fatFactor.toFixed(2)}
                                            )

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

                                            =
                                            {" "}
                                            {calculatedEnergy.toFixed(2)}
                                            {" Kcal/100g"}

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

                                    <h5
                                        className="
                                            text-sm
                                            font-bold
                                            text-gray-700
                                            mb-3
                                        "
                                    >

                                        Acceptance Limit

                                    </h5>


                                    <div
                                        className="
                                            flex
                                            items-center
                                            gap-3
                                        "
                                    >

                                        <input
                                            type="number"
                                            step="any"

                                            value={
                                                calculation
                                                    .acceptanceLimitMin
                                                ?? ""
                                            }

                                            onChange={
                                                event =>
                                                    onFieldChange(
                                                        calculation.id,
                                                        "acceptanceLimitMin",
                                                        event.target.value
                                                    )
                                            }

                                            placeholder="Minimum"

                                            className="
                                                w-full
                                                px-3
                                                py-2
                                                bg-white
                                                border
                                                border-emerald-300
                                                rounded-lg
                                                text-sm
                                                focus:outline-none
                                                focus:ring-2
                                                focus:ring-emerald-500
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
                                            step="any"

                                            value={
                                                calculation
                                                    .acceptanceLimitMax
                                                ?? ""
                                            }

                                            onChange={
                                                event =>
                                                    onFieldChange(
                                                        calculation.id,
                                                        "acceptanceLimitMax",
                                                        event.target.value
                                                    )
                                            }

                                            placeholder="Maximum"

                                            className="
                                                w-full
                                                px-3
                                                py-2
                                                bg-white
                                                border
                                                border-emerald-300
                                                rounded-lg
                                                text-sm
                                                focus:outline-none
                                                focus:ring-2
                                                focus:ring-emerald-500
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

                                                Energy Result

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

                                                    Energy

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

                                                    {
                                                        calculation
                                                            .calculationResultUnit
                                                        ||
                                                        "Kcal/100g"
                                                    }

                                                </p>

                                            </div>


                                            {/* PASS / FAIL */}

                                            {resultStatus && (

                                                <span
                                                    className={`
                                                        inline-flex
                                                        items-center
                                                        justify-center
                                                        min-w-[60px]
                                                        h-[32px]
                                                        px-3
                                                        rounded-full
                                                        text-xs
                                                        font-semibold
                                                        border

                                                        ${
                                                            resultStatus ===
                                                            "Pass"

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

                                                    {resultStatus}

                                                </span>

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


export default CalculationDetailEnergy;