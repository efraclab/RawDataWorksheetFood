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
    CalculationDietaryFiber
} from "./models/CalculationDietaryFiber";

import type {
    SamplePreparationDietaryFiber
} from "./models/SamplePreparationDietaryFiber";

import CustomDropdown
    from "../../../components/shared/CustomDropdown";


// ============================================================
// PROPS
// ============================================================

interface Props {

    calculation:
    CalculationDietaryFiber;

    samplePreparations:
    SamplePreparationDietaryFiber[];

    onRemove:
    () => void;

    onFieldChange: (
        calculationId: number,
        field: keyof CalculationDietaryFiber,
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

const CalculationDetailDietaryFiber:
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
                    .replace(/\s+/g, " ");


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

        const sampleWeightW1 =
            toNumber(
                getStep(
                    "Wt of Spl (g) W1",
                    0
                )?.value1
            );

        const sampleWeightW2 =
            toNumber(
                getStep(
                    "Wt of Spl (g) W2",
                    1
                )?.value1
            );

        const emptyCrucibleW1 =
            toNumber(
                getStep(
                    "Empty wt of crucible(g) W1",
                    2
                )?.value1
            );

        const emptyCrucibleW2 =
            toNumber(
                getStep(
                    "Empty wt of crucible(g) W2",
                    3
                )?.value1
            );

        const crucibleResidueW1 =
            toNumber(
                getStep(
                    "Crucible + Residue (g) W1",
                    4
                )?.value1
            );

        const crucibleResidueW2 =
            toNumber(
                getStep(
                    "Crucible + Residue (g) W2",
                    5
                )?.value1
            );

        const afterAshing =
            toNumber(
                getStep(
                    "After Ashing(g)",
                    6
                )?.value1
            );

        const ashPercentage =
            toNumber(
                getStep(
                    "Ash",
                    7
                )?.value1
            );

        const sampleTitreValue =
            toNumber(
                getStep(
                    "Spl T.V(ml)",
                    8
                )?.value1
            );

        const blankTitreValue =
            toNumber(
                getStep(
                    "Blk T.V(ml)",
                    9
                )?.value1
            );

        const normality =
            toNumber(
                getStep(
                    "Normality",
                    10
                )?.value1
            );

        const blankWeight =
            toNumber(
                getStep(
                    "Blank Wt",
                    11
                )?.value1
            );


        // ========================================================
        // AUTO CALCULATED VALUES
        // ========================================================

        const avgSampleWeight =
            useMemo(() => {

                if (
                    sampleWeightW1 <= 0 ||
                    sampleWeightW2 <= 0
                )
                    return 0;

                return (
                    sampleWeightW1 +
                    sampleWeightW2
                ) / 2;

            }, [
                sampleWeightW1,
                sampleWeightW2
            ]);


        const residueWeightW1 =
            useMemo(() => {

                if (
                    crucibleResidueW1 <= 0 ||
                    emptyCrucibleW1 <= 0
                )
                    return 0;

                return (
                    crucibleResidueW1 -
                    emptyCrucibleW1
                );

            }, [
                crucibleResidueW1,
                emptyCrucibleW1
            ]);


        const residueWeightW2 =
            useMemo(() => {

                if (
                    crucibleResidueW2 <= 0 ||
                    emptyCrucibleW2 <= 0
                )
                    return 0;

                return (
                    crucibleResidueW2 -
                    emptyCrucibleW2
                );

            }, [
                crucibleResidueW2,
                emptyCrucibleW2
            ]);


        const avgResidueWeight =
            useMemo(() => {

                if (
                    residueWeightW1 < 0 ||
                    residueWeightW2 < 0
                )
                    return 0;

                return (
                    residueWeightW1 +
                    residueWeightW2
                ) / 2;

            }, [
                residueWeightW1,
                residueWeightW2
            ]);


        // Wt of Ash(g) is based on the user-entered
        // After Ashing(g) value and the empty crucible W1.
        const ashWeight =
            useMemo(() => {

                if (
                    afterAshing <= 0 ||
                    emptyCrucibleW1 <= 0
                )
                    return 0;

                return Math.max(
                    afterAshing -
                    emptyCrucibleW1,
                    0
                );

            }, [
                afterAshing,
                emptyCrucibleW1
            ]);


        const proteinPercentage =
            useMemo(() => {

                if (
                    avgSampleWeight <= 0 ||
                    normality <= 0
                )
                    return 0;

                // Excel order/formula:
                // (Blk T.V - Spl T.V) × 1.4007 ×
                // Normality × 6.25 ÷ Avg Spl wt
                return (
                    (
                        blankTitreValue -
                        sampleTitreValue
                    ) *
                    1.4007 *
                    normality *
                    6.25
                ) /
                avgSampleWeight;

            }, [
                blankTitreValue,
                sampleTitreValue,
                normality,
                avgSampleWeight
            ]);


        const proteinWeight =
            useMemo(() => {

                if (
                    proteinPercentage <= 0 ||
                    avgSampleWeight <= 0
                )
                    return 0;

                return (
                    proteinPercentage *
                    avgSampleWeight
                ) / 100;

            }, [
                proteinPercentage,
                avgSampleWeight
            ]);


        const calculatedDietaryFiber =
            useMemo(() => {

                if (
                    avgSampleWeight <= 0
                )
                    return 0;

                return (
                    (
                        avgResidueWeight -
                        proteinWeight -
                        ashWeight -
                        blankWeight
                    ) *
                    100
                ) /
                avgSampleWeight;

            }, [
                avgResidueWeight,
                proteinWeight,
                ashWeight,
                blankWeight,
                avgSampleWeight
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
                    sampleWeightW1 <= 0
                ) {

                    errors.push(
                        "Wt of Spl (g) W1 must be greater than 0"
                    );

                }


                if (
                    sampleWeightW2 <= 0
                ) {

                    errors.push(
                        "Wt of Spl (g) W2 must be greater than 0"
                    );

                }


                if (
                    emptyCrucibleW1 <= 0
                ) {

                    errors.push(
                        "Empty wt of crucible(g) W1 must be greater than 0"
                    );

                }


                if (
                    emptyCrucibleW2 <= 0
                ) {

                    errors.push(
                        "Empty wt of crucible(g) W2 must be greater than 0"
                    );

                }


                if (
                    crucibleResidueW1 <= emptyCrucibleW1
                ) {

                    errors.push(
                        "Crucible + Residue (g) W1 must be greater than empty crucible W1"
                    );

                }


                if (
                    crucibleResidueW2 <= emptyCrucibleW2
                ) {

                    errors.push(
                        "Crucible + Residue (g) W2 must be greater than empty crucible W2"
                    );

                }


                if (
                    sampleTitreValue < 0
                ) {

                    errors.push(
                        "Spl T.V(ml) cannot be negative"
                    );

                }


                if (
                    blankTitreValue < 0
                ) {

                    errors.push(
                        "Blk T.V(ml) cannot be negative"
                    );

                }


                if (
                    normality <= 0
                ) {

                    errors.push(
                        "Normality must be greater than 0"
                    );

                }


                if (
                    blankWeight < 0
                ) {

                    errors.push(
                        "Blank Wt cannot be negative"
                    );

                }


                return errors;

            }, [
                selectedPreparation,
                sampleWeightW1,
                sampleWeightW2,
                emptyCrucibleW1,
                emptyCrucibleW2,
                crucibleResidueW1,
                crucibleResidueW2,
                sampleTitreValue,
                blankTitreValue,
                normality,
                blankWeight
            ]);


        const isValid =
            validationErrors.length === 0;


        // ========================================================
        // ACCEPTANCE LIMIT / PASS-FAIL
        // ========================================================

        const acceptanceStatus =
            useMemo(() => {

                if (
                    calculation.calculationResult ===
                    null ||
                    calculation.calculationResult ===
                    undefined
                ) {

                    return null;

                }


                const result =
                    Number(
                        calculation.calculationResult
                    );


                if (
                    !Number.isFinite(result)
                )
                    return null;


                const minText =
                    calculation.acceptanceLimitMin;

                const maxText =
                    calculation.acceptanceLimitMax;


                const hasMin =
                    minText !== "" &&
                    minText !== null &&
                    Number.isFinite(
                        Number(minText)
                    );


                const hasMax =
                    maxText !== "" &&
                    maxText !== null &&
                    Number.isFinite(
                        Number(maxText)
                    );


                if (
                    !hasMin &&
                    !hasMax
                )
                    return null;


                const min =
                    hasMin
                        ? Number(minText)
                        : null;


                const max =
                    hasMax
                        ? Number(maxText)
                        : null;


                if (
                    min !== null &&
                    max !== null
                ) {

                    return (
                        result >= min &&
                        result <= max
                    );

                }


                if (
                    min !== null
                )
                    return result >= min;


                if (
                    max !== null
                )
                    return result <= max;


                return null;

            }, [
                calculation.calculationResult,
                calculation.acceptanceLimitMin,
                calculation.acceptanceLimitMax
            ]);


        // ========================================================
        // SAMPLE PREPARATION CHANGE
        // ========================================================

        const handleSamplePreparationChange =
            (
                value: string
            ) => {

                onFieldChange(
                    calculation.id,
                    "selectedSamplePreparationLabel",
                    value
                );

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
                        calculatedDietaryFiber.toFixed(2)
                    );


                onFieldChange(
                    calculation.id,
                    "calculationResult",
                    result
                );


                onFieldChange(
                    calculation.id,
                    "calculationResultUnit",
                    "%"
                );

            };


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

                                    Calculation for Dietary Fiber

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

                                {
                                    selectedPreparation &&
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

                                                        {
                                                            validationErrors.map(
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
                                                            )
                                                        }

                                                    </ul>

                                                </div>

                                            </div>

                                        </div>

                                    )
                                }


                                {/* =================================================
                                ACIDITY INPUT VALUES
                            ================================================= */}




                                {/* =================================================
                                DIETARY FIBER AUTO-CALCULATED VALUES
                            ================================================= */}

                                {
                                    selectedPreparation && (

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
                                                Dietary Fiber Calculation Details
                                            </h4>


                                            <div
                                                className="
                                                grid
                                                grid-cols-1
                                                md:grid-cols-2
                                                gap-3
                                            "
                                            >

                                                {
                                                    [
                                                        [
                                                            "Avg Spl wt(g)",
                                                            avgSampleWeight
                                                        ],
                                                        [
                                                            "Avg Residue wt(g)",
                                                            avgResidueWeight
                                                        ],
                                                        [
                                                            "Wt of Ash(g)",
                                                            ashWeight
                                                        ],
                                                        [
                                                            "Wt of Protein(g)",
                                                            proteinWeight
                                                        ],
                                                        [
                                                            "Blank Wt",
                                                            blankWeight
                                                        ]
                                                    ].map(
                                                        ([label, value]) => (

                                                            <div
                                                                key={
                                                                    String(label)
                                                                }
                                                                className="
                                                                bg-gray-50
                                                                rounded-lg
                                                                border
                                                                border-gray-200
                                                                px-4
                                                                py-3
                                                                "
                                                            >

                                                                <p
                                                                    className="
                                                                    text-xs
                                                                    text-gray-500
                                                                    mb-1
                                                                    "
                                                                >
                                                                    {
                                                                        label
                                                                    }
                                                                </p>

                                                                <p
                                                                    className="
                                                                    text-sm
                                                                    font-bold
                                                                    text-gray-800
                                                                    "
                                                                >
                                                                    {
                                                                        Number(
                                                                            value
                                                                        ).toFixed(4)
                                                                    }
                                                                </p>

                                                            </div>

                                                        )
                                                    )
                                                }

                                            </div>

                                        </div>

                                    )
                                }


                                {/* =================================================
                                FORMULA
                            ================================================= */}

                                {
                                    selectedPreparation && (

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
                                                Formula for Dietary Fiber
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
                                                    (Avg Residue wt(g) − Wt of Protein(g) − Wt of Ash(g) − Blank Wt)
                                                    × 100 ÷ Avg Spl wt(g)
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

                                                    (

                                                    {
                                                        avgResidueWeight.toFixed(
                                                            4
                                                        )
                                                    }

                                                    {" − "}

                                                    {
                                                        proteinWeight.toFixed(
                                                            4
                                                        )
                                                    }

                                                    {" − "}

                                                    {
                                                        ashWeight.toFixed(
                                                            4
                                                        )
                                                    }

                                                    {" − "}

                                                    {
                                                        blankWeight.toFixed(
                                                            4
                                                        )
                                                    }

                                                    {" ) × 100 ÷ "}

                                                    {
                                                        avgSampleWeight.toFixed(
                                                            4
                                                        )
                                                    }

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

                                                    {
                                                        calculatedDietaryFiber.toFixed(
                                                            2
                                                        )
                                                    }

                                                    {" %"}

                                                </div>

                                            </div>

                                        </div>

                                    )
                                }


                                {/* =================================================
                                ACCEPTANCE LIMIT
                            ================================================= */}

                                {
                                    selectedPreparation && (

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
                                                        calculation
                                                            .acceptanceLimitMin
                                                    }

                                                    onChange={(event) =>
                                                        onFieldChange(
                                                            calculation.id,
                                                            "acceptanceLimitMin",
                                                            event.target.value
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
                                                    focus:ring-emerald-300
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
                                                        calculation
                                                            .acceptanceLimitMax
                                                    }

                                                    onChange={(event) =>
                                                        onFieldChange(
                                                            calculation.id,
                                                            "acceptanceLimitMax",
                                                            event.target.value
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
                                                    focus:ring-emerald-300
                                                "
                                                />

                                            </div>

                                        </div>

                                    )
                                }


                                {/* =================================================
                                CALCULATE BUTTON
                            ================================================= */}

                                {
                                    selectedPreparation && (

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

                                                ${isValid
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

                                    )
                                }


                                {/* =================================================
                                NO PREPARATION
                            ================================================= */}

                                {
                                    !selectedPreparation && (

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

                                    )
                                }


                                {/* =================================================
                                RESULT
                            ================================================= */}

                                {
                                    calculation.calculationResult !==
                                    null &&
                                    calculation.calculationResult !==
                                    undefined && (

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

                                                        Dietary Fiber Result

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

                                                            Dietary Fiber

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

                                                            {" %"}

                                                        </p>

                                                    </div>


                                                    {/* PASS / FAIL */}

                                                    {
                                                        acceptanceStatus !== null && (

                                                            <div
                                                                className={`
                flex
                items-center
                gap-2
                px-3
                py-1.5
                rounded-full
                text-xs
                font-semibold
                border

                ${acceptanceStatus
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

                                                                {
                                                                    acceptanceStatus
                                                                        ? (
                                                                            <>
                                                                                <CheckCircle2
                                                                                    className="
                                    w-4
                                    h-4
                                "
                                                                                />

                                                                                Pass
                                                                            </>
                                                                        )
                                                                        : (
                                                                            <>
                                                                                <XCircle
                                                                                    className="
                                    w-4
                                    h-4
                                "
                                                                                />

                                                                                Fail
                                                                            </>
                                                                        )
                                                                }

                                                            </div>

                                                        )
                                                    }

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

                                    )
                                }

                            </div>

                        </motion.div>

                    )}

                </AnimatePresence>

            </motion.div>

        );

    };


export default CalculationDetailDietaryFiber;