import React, {
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
    SamplePreparationSulphurDioxide
} from "./SamplePreparationSulphurDioxide";


// ============================================================
// PROPS
// ============================================================

interface Props {

    samplePreparation:
        SamplePreparationSulphurDioxide;

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

    onRemove:
        () => void;

    role:
        string;

    isLocked:
        boolean;

    parameterType:
        string;
}


// ============================================================
// UNIT OPTIONS
// ============================================================

const unitOptions = [

    {
        value: "g",
        label: "g"
    },

    {
        value: "ml",
        label: "ml"
    },

    {
        value: "--",
        label: "--"
    }

];


// ============================================================
// CONSTANT FIELD
// ============================================================

const CONSTANT_FIELDS = new Set([
    "Factor"
]);


// ============================================================
// COMPONENT
// ============================================================

const SamplePreparationDetailSulphurDioxide:
    React.FC<Props> = ({

        samplePreparation,

        onStepChange,

        onRemove,

        isLocked

    }) => {

        const [
            isExpanded,
            setIsExpanded
        ] = useState(true);


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

            if (
                CONSTANT_FIELDS.has(stepName)
            )
                return;

            onStepChange(
                samplePreparation.id,
                stepName,
                field,
                value
            );

        };


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

                                    <FlaskConical
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
                                        for Sulphur Dioxide Details
                                    </p>

                                </div>

                            </div>


                            <div
                                className="
                                    flex
                                    items-center
                                    gap-2
                                "
                            >

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


                                <button
                                    type="button"
                                    disabled={isLocked}
                                    onClick={(event) => {

                                        event.stopPropagation();

                                        if (!isLocked)
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
                                        disabled:opacity-50
                                        disabled:cursor-not-allowed
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
                                    duration: 0.3
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
                                            ) => {

                                                const isConstant =
                                                    CONSTANT_FIELDS.has(
                                                        step.name
                                                    );

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
                                                                index *
                                                                0.05
                                                        }}
                                                        className="
                                                            relative
                                                            bg-white
                                                            rounded-xl
                                                            border
                                                            border-emerald-200/60
                                                            p-4
                                                        "
                                                    >

                                                        <div
                                                            className="
                                                                flex
                                                                items-center
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
                                                                        index + 1
                                                                    }
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


                                                                    <input
                                                                        disabled={
                                                                            isLocked ||
                                                                            isConstant
                                                                        }
                                                                        type="number"
                                                                        min="0"
                                                                        step="0.0001"
                                                                        inputMode="decimal"
                                                                        value={
                                                                            step.value1 ||
                                                                            ""
                                                                        }
                                                                        onChange={(event) =>
                                                                            updateStep(
                                                                                step.name,
                                                                                "value1",
                                                                                event.target.value
                                                                            )
                                                                        }
                                                                        placeholder={
                                                                            isConstant
                                                                                ? ""
                                                                                : `Enter ${step.name}`
                                                                        }
                                                                        className={`
                                                                            w-32
                                                                            px-2.5
                                                                            py-1.5
                                                                            border
                                                                            border-emerald-300
                                                                            rounded-lg
                                                                            text-xs
                                                                            focus:outline-none
                                                                            focus:ring-2
                                                                            focus:ring-emerald-400
                                                                            ${
                                                                                isConstant
                                                                                    ? "bg-slate-100 text-slate-700 cursor-not-allowed font-semibold"
                                                                                    : "bg-white"
                                                                            }
                                                                        `}
                                                                    />


                                                                    <div
                                                                        className="
                                                                            w-24
                                                                        "
                                                                    >

                                                                        {
                                                                            isConstant
                                                                                ? (
                                                                                    <div
                                                                                        className="
                                                                                            h-9
                                                                                            px-3
                                                                                            flex
                                                                                            items-center
                                                                                            border
                                                                                            border-emerald-300
                                                                                            rounded-lg
                                                                                            bg-slate-100
                                                                                            text-xs
                                                                                            font-semibold
                                                                                            text-slate-700
                                                                                        "
                                                                                    >
                                                                                        {
                                                                                            step.unit1
                                                                                        }
                                                                                    </div>
                                                                                )
                                                                                : (
                                                                                    <CustomDropdown
                                                                                        disabled={
                                                                                            isLocked
                                                                                        }
                                                                                        options={
                                                                                            unitOptions
                                                                                        }
                                                                                        value={
                                                                                            step.unit1
                                                                                        }
                                                                                        onChange={(
                                                                                            value
                                                                                        ) =>
                                                                                            updateStep(
                                                                                                step.name,
                                                                                                "unit1",
                                                                                                value
                                                                                            )
                                                                                        }
                                                                                        placeholder="Unit"
                                                                                        colorScheme="emerald"
                                                                                    />
                                                                                )
                                                                        }

                                                                    </div>


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

                                                    </motion.div>

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


export default SamplePreparationDetailSulphurDioxide;
