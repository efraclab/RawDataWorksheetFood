import React, {
    useMemo,
    useState
} from "react";

import {
    motion,
    AnimatePresence
} from "framer-motion";

import {
    ChevronDown,
    Trash,
    FlaskConical
} from "lucide-react";

import CustomDropdown
    from "../../../../components/shared/CustomDropdown";

import type {
    SamplePreparationDietaryFiber
} from "./SamplePreparationDietaryFiber";


// ============================================================
// PROPS
// ============================================================

interface Props {

    samplePreparation:
        SamplePreparationDietaryFiber;

    onStepChange: (

        samplePreparationId: number,

        stepName: string,

        field:
            | "value1"
            | "unit1"
            | "value2"
            | "unit2"
            | "logBookID",

        newValue: string

    ) => void;

    onRemove: () => void;

    role: string;

    isLocked: boolean;

    parameterType: string;
}


// ============================================================
// UNIT OPTIONS
// ============================================================

const valueUnitOptions = [

    {
        value: "g",
        label: "g"
    },

    {
        value: "ml",
        label: "ml"
    },

    {
        value: "N",
        label: "N"
    },

    {
        value: "%",
        label: "%"
    },

    {
        value: "",
        label: "—"
    }

];


// ============================================================
// CALCULATION HELPERS
// ============================================================

const toNumber = (
    value: string | number | null | undefined
): number => {

    const parsed =
        Number(value);

    return Number.isFinite(parsed)
        ? parsed
        : 0;
};


const formatCalculatedValue = (
    value: number,
    decimals: number
): string => {

    if (!Number.isFinite(value))
        return (0).toFixed(decimals);

    return value.toFixed(decimals);
};


// ============================================================
// COMPONENT
// ============================================================

const SamplePreparationDetailDietaryFiber:
    React.FC<Props> = ({

        samplePreparation,

        onStepChange,

        onRemove,

        isLocked,

    }) => {

        const [
            isExpanded,
            setIsExpanded
        ] = useState(true);


        // =====================================================
        // GET STEP
        // =====================================================

        const getStep = (
            name: string,
            _fallbackIndex?: number
        ) => {

            const steps =
                samplePreparation.steps ??
                [];

            const normalize = (value: any) =>
                String(value ?? "")
                    .trim()
                    .toLowerCase()
                    .replace(/\\s+/g, " ");

            const aliases: Record<string, string[]> = {
                "ash": [
                    "ash",
                    "% ash",
                    "ash %",
                    "ash percentage"
                ],
                "after ashing(g)": [
                    "after ashing(g)",
                    "after ashing (g)",
                    "after ashing"
                ]
            };

            const normalizedName =
                normalize(name);

            const acceptedNames =
                aliases[normalizedName] ??
                [normalizedName];

            const matched =
                steps.find(
                    step =>
                        acceptedNames.includes(
                            normalize(step?.name)
                        )
                );

            if (!matched)
                return undefined;

            if (
                normalizedName === "ash"
            ) {
                return {
                    ...matched,
                    name: "Ash",
                    unit1: "%"
                };
            }

            if (
                normalizedName === "after ashing(g)"
            ) {
                return {
                    ...matched,
                    name: "After Ashing(g)",
                    unit1: "g"
                };
            }

            return matched;
        };


        // =====================================================
        // UPDATE STEP
        // =====================================================

        const updateStep = (

            stepName: string,

            field:
                | "value1"
                | "unit1"
                | "value2"
                | "unit2"
                | "logBookID",

            value: string

        ) => {

            onStepChange(

                samplePreparation.id,

                stepName,

                field,

                value

            );

        };


        // =====================================================
        // INPUT VALUES
        // =====================================================

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


        // =====================================================
        // AUTO CALCULATED VALUES
        //
        // The following calculations are displayed in the
        // Sample Preparation UI in the same order as Excel.
        // =====================================================

        const avgSampleWeight =
            useMemo(
                () =>
                    (
                        sampleWeightW1 +
                        sampleWeightW2
                    ) / 2,
                [
                    sampleWeightW1,
                    sampleWeightW2
                ]
            );


        const residueWeightW1 =
            useMemo(
                () =>
                    crucibleResidueW1 -
                    emptyCrucibleW1,
                [
                    crucibleResidueW1,
                    emptyCrucibleW1
                ]
            );


        const residueWeightW2 =
            useMemo(
                () =>
                    crucibleResidueW2 -
                    emptyCrucibleW2,
                [
                    crucibleResidueW2,
                    emptyCrucibleW2
                ]
            );


        const avgResidueWeight =
            useMemo(
                () =>
                    (
                        residueWeightW1 +
                        residueWeightW2
                    ) / 2,
                [
                    residueWeightW1,
                    residueWeightW2
                ]
            );


        const ashWeight =
            useMemo(
                () =>
                    afterAshing -
                    emptyCrucibleW1,
                [
                    afterAshing,
                    emptyCrucibleW1
                ]
            );



        const proteinPercentage =
            useMemo(
                () => {

                    if (
                        avgSampleWeight === 0
                    )
                        return 0;

                    return (
                        (
                            blankTitreValue -
                            sampleTitreValue
                        ) *
                        1.4007 *
                        normality *
                        6.25 /
                        avgSampleWeight
                    );

                },
                [
                    blankTitreValue,
                    sampleTitreValue,
                    normality,
                    avgSampleWeight
                ]
            );


        const proteinWeight =
            useMemo(
                () =>
                    proteinPercentage *
                    avgSampleWeight /
                    100,
                [
                    proteinPercentage,
                    avgSampleWeight
                ]
            );


        // =====================================================
        // CALCULATED ROW
        // =====================================================

        const renderCalculatedRow = (
            number: number,
            name: string,
            value: number,
            unit: string,
            decimals = 4
        ) => (

            <motion.div

                key={name}

                initial={{
                    opacity: 0,
                    x: -20
                }}

                animate={{
                    opacity: 1,
                    x: 0
                }}

                transition={{
                    delay:
                        number * 0.1
                }}

                className="
                    group/item
                    relative
                "
            >

                <div
                    className="
                        relative
                        bg-white
                        rounded-xl
                        border
                        border-emerald-200/60
                        transition-all
                        duration-200
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

                        <div
                            className="
                                flex-shrink-0
                                w-7
                                h-7
                                bg-gradient-to-br
                                from-emerald-700
                                to-slate-800
                                rounded-full
                                flex
                                items-center
                                justify-center
                                shadow-md
                            "
                        >

                            <span
                                className="
                                    text-white
                                    text-xs
                                    font-bold
                                "
                            >
                                {number}
                            </span>

                        </div>


                        <div
                            className="
                                flex-1
                            "
                        >

                            <div
                                className="
                                    flex
                                    items-center
                                    gap-2
                                    mb-3
                                "
                            >

                                <div
                                    className="
                                        font-bold
                                        text-emerald-900
                                        text-sm
                                    "
                                >
                                    {name}
                                </div>

                                <div
                                    className="
                                        h-px
                                        flex-1
                                        bg-gradient-to-r
                                        from-slate-300
                                        to-transparent
                                    "
                                />

                            </div>


                            <div
                                className="
                                    flex
                                    flex-wrap
                                    items-center
                                    gap-2
                                    text-xs
                                "
                            >

                                <span
                                    className="
                                        text-gray-600
                                        font-medium
                                    "
                                >
                                    {name}
                                </span>


                                <input
                                    disabled
                                    type="text"
                                    value={
                                        formatCalculatedValue(
                                            value,
                                            decimals
                                        )
                                    }
                                    className="
                                        w-30
                                        px-2.5
                                        py-1.5
                                        border
                                        border-emerald-300
                                        rounded-lg
                                        text-xs
                                        bg-emerald-50
                                        font-semibold
                                        text-gray-800
                                        focus:outline-none
                                    "
                                />


                                <span
                                    className="
                                        inline-flex
                                        items-center
                                        justify-center
                                        min-w-[96px]
                                        h-[34px]
                                        px-3
                                        border
                                        border-emerald-300
                                        rounded-lg
                                        bg-emerald-50
                                        text-xs
                                        font-semibold
                                        text-emerald-800
                                    "
                                >
                                    {unit}
                                </span>


                                <span
                                    className="
                                        text-gray-500
                                        text-xs
                                    "
                                >
                                    (Calculated)
                                </span>

                            </div>

                        </div>

                    </div>

                </div>

            </motion.div>

        );


        // =====================================================
        // INPUT ROW
        // =====================================================

        const renderInputRow = (
            step:
                | typeof samplePreparation.steps[number]
                | undefined,
            number: number
        ) => {

            if (!step)
                return null;

            return (

                <motion.div

                    key={step.name}

                    initial={{
                        opacity: 0,
                        x: -20
                    }}

                    animate={{
                        opacity: 1,
                        x: 0
                    }}

                    transition={{
                        delay:
                            number * 0.1
                    }}

                    className="
                        group/item
                        relative
                    "
                >

                    <div
                        className="
                            relative
                            bg-white
                            rounded-xl
                            border
                            border-emerald-200/60
                            hover:border-emerald-300
                            transition-all
                            duration-200
                            p-4
                        "
                    >

                        {/* STEP HEADER */}

                        <div
                            className="
                                flex
                                items-start
                                gap-3
                            "
                        >

                            <div
                                className="
                                    flex-shrink-0
                                    w-7
                                    h-7
                                    bg-gradient-to-br
                                    from-emerald-700
                                    to-slate-800
                                    rounded-full
                                    flex
                                    items-center
                                    justify-center
                                    shadow-md
                                "
                            >

                                <span
                                    className="
                                        text-white
                                        text-xs
                                        font-bold
                                    "
                                >
                                    {number}
                                </span>

                            </div>


                            <div
                                className="
                                    flex-1
                                "
                            >

                                {/* TITLE */}

                                <div
                                    className="
                                        flex
                                        items-center
                                        gap-2
                                        mb-3
                                    "
                                >

                                    <div
                                        className="
                                            font-bold
                                            text-emerald-900
                                            text-sm
                                        "
                                    >
                                        {step.name}
                                    </div>


                                    <div
                                        className="
                                            h-px
                                            flex-1
                                            bg-gradient-to-r
                                            from-slate-300
                                            to-transparent
                                        "
                                    />

                                </div>


                                {/* INPUT ROW */}

                                <div
                                    className="
                                        flex
                                        flex-wrap
                                        items-center
                                        gap-2
                                        text-xs
                                    "
                                >

                                    <span
                                        className="
                                            text-gray-600
                                            font-medium
                                        "
                                    >
                                        {step.name}
                                    </span>


                                    {/* VALUE */}

                                    <input

                                        disabled={
                                            isLocked
                                        }

                                        type="number"

                                        min="0"

                                        step="0.0001"

                                        inputMode="decimal"

                                        value={
                                            step.value1 ||
                                            ""
                                        }

                                        onChange={(e) =>
                                            updateStep(
                                                step.name,
                                                "value1",
                                                e.target.value
                                            )
                                        }

                                        onKeyDown={(e) => {

                                            if (
                                                e.key ===
                                                    "ArrowUp" ||
                                                e.key ===
                                                    "ArrowDown"
                                            ) {

                                                e.preventDefault();

                                            }

                                        }}

                                        onWheel={(e) =>
                                            e.currentTarget.blur()
                                        }

                                        placeholder={
                                            `Enter ${step.name}`
                                        }

                                        className="
                                            w-30
                                            px-2.5
                                            py-1.5
                                            border
                                            border-emerald-300
                                            rounded-lg
                                            text-xs
                                            bg-white
                                            focus:outline-none
                                            focus:ring-2
                                            focus:ring-emerald-400
                                            focus:border-transparent
                                            disabled:cursor-not-allowed
                                        "
                                    />


                                    {/* UNIT */}

                                    <div
                                        className="
                                            w-24
                                        "
                                    >

                                        <CustomDropdown

                                            disabled={
                                                isLocked
                                            }

                                            options={
                                                valueUnitOptions
                                            }

                                            value={
                                                step.unit1
                                            }

                                            onChange={(
                                                newUnit
                                            ) =>
                                                updateStep(
                                                    step.name,
                                                    "unit1",
                                                    newUnit
                                                )
                                            }

                                            placeholder="Unit"

                                            colorScheme="emerald"

                                        />

                                    </div>


                                    {/* UNIT DESCRIPTION */}

                                    <span
                                        className="
                                            text-gray-500
                                            text-xs
                                        "
                                    >
                                        (Value)
                                    </span>

                                </div>

                            </div>

                        </div>

                    </div>

                </motion.div>

            );

        };


        // =====================================================
        // EXACT EXCEL ORDER
        //
        // Calculated rows are deliberately inserted into the
        // Sample Preparation UI. They are not required to exist
        // inside samplePreparation.steps.
        // =====================================================

        const orderedRows = [

            {
                type: "input",
                number: 1,
                step: getStep(
                    "Wt of Spl (g) W1",
                    0
                )
            },

            {
                type: "input",
                number: 2,
                step: getStep(
                    "Wt of Spl (g) W2",
                    1
                )
            },

            {
                type: "calculated",
                number: 3,
                name: "Avg Spl wt(g)",
                value: avgSampleWeight,
                unit: "g",
                decimals: 4
            },

            {
                type: "input",
                number: 4,
                step: getStep(
                    "Empty wt of crucible(g) W1",
                    2
                )
            },

            {
                type: "input",
                number: 5,
                step: getStep(
                    "Empty wt of crucible(g) W2",
                    3
                )
            },

            {
                type: "input",
                number: 6,
                step: getStep(
                    "Crucible + Residue (g) W1",
                    4
                )
            },

            {
                type: "input",
                number: 7,
                step: getStep(
                    "Crucible + Residue (g) W2",
                    5
                )
            },

            {
                type: "calculated",
                number: 8,
                name: "Residue wt(g) W1",
                value: residueWeightW1,
                unit: "g",
                decimals: 4
            },

            {
                type: "calculated",
                number: 9,
                name: "Residue wt(g) W2",
                value: residueWeightW2,
                unit: "g",
                decimals: 4
            },

            {
                type: "calculated",
                number: 10,
                name: "Avg Residue wt(g)",
                value: avgResidueWeight,
                unit: "g",
                decimals: 4
            },

            {
                type: "input",
                number: 11,
                step: getStep(
                    "After Ashing(g)",
                    6
                )
            },

            {
                type: "input",
                number: 12,
                step: getStep(
                    "Ash",
                    7
                )
            },

            {
                type: "calculated",
                number: 13,
                name: "Wt of Ash(g)",
                value: ashWeight,
                unit: "g",
                decimals: 4
            },

            {
                type: "input",
                number: 14,
                step: getStep(
                    "Spl T.V(ml)",
                    8
                )
            },

            {
                type: "input",
                number: 15,
                step: getStep(
                    "Blk T.V(ml)",
                    9
                )
            },

            {
                type: "input",
                number: 16,
                step: getStep(
                    "Normality",
                    10
                )
            },

            {
                type: "calculated",
                number: 17,
                name: "% Protein",
                value: proteinPercentage,
                unit: "%",
                decimals: 2
            },

            {
                type: "calculated",
                number: 18,
                name: "Wt of Protein(g)",
                value: proteinWeight,
                unit: "g",
                decimals: 4
            },

            {
                type: "input",
                number: 19,
                step: getStep(
                    "Blank Wt",
                    11
                )
            }

        ] as const;


        // =====================================================
        // RENDER
        // =====================================================

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
                    relative
                    group
                    z-20
                "
            >

                <div
                    className="
                        relative
                        bg-white/95
                        backdrop-blur-sm
                        rounded-lg
                        border
                        border-slate-700/40
                        transition-all
                        duration-300
                        mb-4
                    "
                >

                    {/* =================================================
                        HEADER
                    ================================================= */}

                    <div
                        className={`
                            relative
                            bg-gradient-to-r
                            from-emerald-700
                            via-emerald-800
                            to-slate-900
                            ${
                                isExpanded
                                    ? "rounded-t-lg"
                                    : "rounded-lg"
                            }
                        `}
                    >

                        <div
                            className="
                                relative
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

                                    className="
                                        relative
                                    "
                                >

                                    <div
                                        className="
                                            absolute
                                            inset-0
                                            bg-white/30
                                            rounded-lg
                                            blur-md
                                        "
                                    />

                                    <div
                                        className="
                                            relative
                                            p-2
                                            bg-white/20
                                            rounded-lg
                                            backdrop-blur-md
                                            border
                                            border-white/30
                                        "
                                    >

                                        <FlaskConical
                                            className="
                                                w-5
                                                h-5
                                                text-white
                                            "
                                        />

                                    </div>

                                </motion.div>


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
                                            samplePreparation.label
                                        }

                                    </h4>


                                    <p
                                        className="
                                            text-xs
                                            text-emerald-100
                                        "
                                    >

                                        Sample Preparation
                                        for Dietary Fiber Details

                                    </p>

                                </div>

                            </div>


                            {/* RIGHT */}

                            <div
                                className="
                                    flex
                                    items-center
                                    gap-3
                                "
                            >

                                {/* COLLAPSE */}

                                <motion.button

                                    type="button"

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
                                        transition-colors
                                    "
                                >

                                    <motion.div

                                        animate={{
                                            rotate:
                                                isExpanded
                                                    ? 180
                                                    : 0
                                        }}

                                        transition={{
                                            duration: 0.3
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


                                {/* REMOVE */}

                                <motion.button

                                    type="button"

                                    disabled={isLocked}

                                    onClick={(e) => {

                                        e.stopPropagation();

                                        if (!isLocked) {

                                            onRemove();

                                        }

                                    }}

                                    whileHover={
                                        !isLocked
                                            ? {
                                                scale: 1.1,
                                                rotate: 5
                                            }
                                            : {}
                                    }

                                    whileTap={
                                        !isLocked
                                            ? {
                                                scale: 0.9
                                            }
                                            : {}
                                    }

                                    className={`
                                        p-2
                                        bg-white/20
                                        rounded-lg
                                        transition-all
                                        duration-200
                                        border
                                        border-white/30

                                        ${
                                            isLocked
                                                ? "opacity-50 cursor-not-allowed"
                                                : "hover:bg-white/30"
                                        }
                                    `}
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


                    {/* =================================================
                        CONTENT
                    ================================================= */}

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
                                    duration: 0.3,
                                    ease: "easeInOut"
                                }}
                            >

                                <div
                                    className="
                                        p-5
                                        space-y-3
                                        bg-gradient-to-br
                                        from-emerald-50/50
                                        to-slate-50/30
                                    "
                                >

                                    {
                                        orderedRows.map(
                                            row => {

                                                if (
                                                    row.type ===
                                                    "calculated"
                                                ) {

                                                    return renderCalculatedRow(
                                                        row.number,
                                                        row.name,
                                                        row.value,
                                                        row.unit,
                                                        row.decimals
                                                    );

                                                }

                                                return renderInputRow(
                                                    row.step,
                                                    row.number
                                                );

                                            }
                                        )
                                    }
                                    

                                </div>

                            </motion.div>

                        )}

                    </AnimatePresence>

                </div>

            </motion.div>

        );

    };


export default SamplePreparationDetailDietaryFiber;