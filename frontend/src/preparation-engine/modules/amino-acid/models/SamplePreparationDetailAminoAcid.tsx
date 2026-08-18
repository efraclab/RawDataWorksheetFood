import React, {
    useEffect,
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
    SamplePreparationAminoAcid
} from "./SamplePreparationAminoAcid";


// ============================================================
// PROPS
// ============================================================

interface Props {

    samplePreparation:
        SamplePreparationAminoAcid;

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
        value:
            "-",

        label:
            "—"
    },

    {
        value:
            "mg/L",

        label:
            "mg/L"
    },

    {
        value:
            "g",

        label:
            "g"
    },

    {
        value:
            "%",

        label:
            "%"
    }

];

// ============================================================
// EXCEL UNIT DEFAULTS
// ============================================================
//
// Rule:
// 1. Excel unit "-"     -> show Unit dropdown with "-" selected
// 2. Excel unit blank   -> DO NOT show Unit dropdown
// 3. Other Excel unit   -> show Unit dropdown with that unit selected
//
// These defaults also protect the UI when an existing worksheet/API
// preparation comes back with unit1 empty.
// ============================================================

const excelDefaultUnits: Record<string, string> = {
    "Sample Area": "-",
    "Standard Conc.": "mg/L",
    "Sample Dilution Factor": "-",
    "Purity": "%",
    "Standard Area": "",
    "Weight Of Sample in g": "g",
    "Protein": "%",
    "Sample Volume": ""
};


// ============================================================
// COMPONENT
// ============================================================

const SamplePreparationDetailAminoAcid:
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
        // APPLY EXCEL DEFAULT UNITS
        // =====================================================
        //
        // New preparations already contain unit1 from the factory.
        // Existing worksheet/API data may contain an empty unit1.
        // Restore the Excel-defined default in that case.
        //
        useEffect(() => {

            samplePreparation.steps.forEach(
                step => {

                    const defaultUnit =
                        excelDefaultUnits[step.name];

                    if (
                        defaultUnit !== undefined &&
                        step.unit1 === "" &&
                        defaultUnit !== ""
                    ) {

                        onStepChange(
                            samplePreparation.id,
                            step.name,
                            "unit1",
                            defaultUnit
                        );

                    }

                }
            );

        }, [
            samplePreparation.id,
            samplePreparation.steps,
            onStepChange
        ]);


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
                                        for Amino Acid Details

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
                                        samplePreparation.steps.map(
                                            (
                                                step,
                                                index
                                            ) => (

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
                                                            index *
                                                            0.1
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

                                                                    {
                                                                        index +
                                                                        1
                                                                    }

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

                                                                        {
                                                                            step.name
                                                                        }

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

                                                                        {
                                                                            step.name
                                                                        }

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

                                                                    {/*
                                                                        IMPORTANT:
                                                                        - "-"      => dropdown is shown, "-" is selected
                                                                        - "mg/L"   => dropdown is shown, "mg/L" is selected
                                                                        - "%"      => dropdown is shown, "%" is selected
                                                                        - "g"      => dropdown is shown, "g" is selected
                                                                        - ""       => dropdown is NOT shown

                                                                        The fallback to excelDefaultUnits is only for
                                                                        worksheet/API data that arrives with unit1 empty.
                                                                    */}

                                                                    {(
                                                                        // IMPORTANT:
                                                                        // The Excel definition is authoritative.
                                                                        // If Excel has no Unit for this step, NEVER show
                                                                        // a Unit dropdown even if API/worksheet data
                                                                        // contains an old/stale unit1 value.
                                                                        excelDefaultUnits[step.name] !== ""
                                                                    ) && (

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
                                                                                    excelDefaultUnits[step.name] ||
                                                                                    step.unit1 ||
                                                                                    ""
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

                                                                    )}

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

                                            )
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


export default SamplePreparationDetailAminoAcid;