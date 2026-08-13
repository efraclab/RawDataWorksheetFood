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
    Droplets,
    Trash
} from "lucide-react";

import CustomDropdown from "../../../../components/shared/CustomDropdown";

import type {
    SamplePreparationSugar
} from "../models/SamplePreparationSugar";


interface Props {

    samplePreparation: SamplePreparationSugar;

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


/* =========================================================
   UNIT OPTIONS
========================================================= */

const weightUnitOptions = [
    {
        value: "mg",
        label: "mg"
    },
    {
        value: "g",
        label: "g"
    },
    {
        value: "kg",
        label: "kg"
    }
];


const volumeUnitOptions = [
    {
        value: "ml",
        label: "ml"
    },
    {
        value: "L",
        label: "L"
    }
];


/* =========================================================
   COMPONENT
========================================================= */

const SamplePreparationDetailSugar: React.FC<Props> = ({
    samplePreparation,
    onStepChange,
    onRemove,
    isLocked,
}) => {

    const [
        isExpanded,
        setIsExpanded
    ] = useState(true);


    const headerRoundingClass =
        isExpanded
            ? "rounded-t-lg"
            : "rounded-lg";


    /* =====================================================
       HELPER
    ===================================================== */

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


    /* =====================================================
       GET STEP VALUE
    ===================================================== */

    const getStepValue = (
        stepName: string
    ): string => {

        const step =
            samplePreparation.steps.find(
                x => x.name === stepName
            );

        return step?.value1 ?? "";

    };


    /* =====================================================
       FEHLING FACTOR

       Formula:

       Std Dextrose Weight × Standard Titre
       -------------------------------------
              Volume Make Up 2
    ===================================================== */

    const fehlingFactor = useMemo(() => {

        const stdDextroseWeight =
            Number(
                getStepValue(
                    "Std Dextrose Weight"
                )
            );

        const volumeMakeUp2 =
            Number(
                getStepValue(
                    "Volume Make Up 2"
                )
            );

        const standardTitre =
            Number(
                getStepValue(
                    "Standard Titre"
                )
            );


        if (
            !stdDextroseWeight ||
            !volumeMakeUp2 ||
            !standardTitre
        ) {

            return "";

        }


        const result =
            (
                stdDextroseWeight *
                standardTitre
            ) /
            volumeMakeUp2;


        if (
            !Number.isFinite(result)
        ) {

            return "";

        }


        return result.toFixed(4);

    }, [
        samplePreparation.steps
    ]);


    /* =====================================================
       RENDER
    ===================================================== */

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

            {/* =================================================
                OUTER CARD
            ================================================= */}

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
                        ${headerRoundingClass}
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

                        {/* =================================================
                            LEFT SIDE
                        ================================================= */}

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

                                    <Droplets
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
                                    Sample Preparation for Sugar Details
                                </p>

                            </div>

                        </div>


                        {/* =================================================
                            RIGHT SIDE
                        ================================================= */}

                        <div
                            className="
                                flex
                                items-center
                                gap-3
                            "
                        >

                            {/* =================================================
                                COLLAPSE
                            ================================================= */}

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


                            {/* =================================================
                                REMOVE
                            ================================================= */}

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
                                title={`Remove ${samplePreparation.label}`}
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

                                {samplePreparation.steps.map(
                                    (step, index) => {

                                        const isSampleWeight =
                                            step.name ===
                                            "Sample Weight";

                                        const isVolumeMakeUp1 =
                                            step.name ===
                                            "Volume Make Up 1";

                                        const isSampleTitre =
                                            step.name ===
                                            "Sample Titre Value";

                                        const isDilutionFactor =
                                            step.name ===
                                            "Dilution Factor";

                                        const isStdDextroseWeight =
                                            step.name ===
                                            "Std Dextrose Weight";

                                        const isVolumeMakeUp2 =
                                            step.name ===
                                            "Volume Make Up 2";

                                        const isStandardTitre =
                                            step.name ===
                                            "Standard Titre";

                                        const isAliquot =
                                            step.name ===
                                            "Aliquot";

                                        const isFehlingFactor =
                                            step.name ===
                                            "Fehling Factor";


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
                                                        index * 0.1
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

                                                    {/* =================================================
                                                        STEP HEADER
                                                    ================================================= */}

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
                                                                {index + 1}
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


                                                            {/* =================================================
                                                                COMMON INPUT ROW
                                                            ================================================= */}

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


                                                                {/* =================================================
                                                                    VALUE
                                                                ================================================= */}

                                                                <input
                                                                    disabled={
                                                                        isLocked ||
                                                                        isFehlingFactor
                                                                    }
                                                                    type="number"
                                                                    min="0"
                                                                    step={
                                                                        isSampleTitre ||
                                                                        isStandardTitre
                                                                            ? "0.0001"
                                                                            : "0.01"
                                                                    }
                                                                    inputMode="decimal"
                                                                    value={
                                                                        isFehlingFactor
                                                                            ? fehlingFactor
                                                                            : (
                                                                                step.value1 ||
                                                                                ""
                                                                            )
                                                                    }
                                                                    onChange={(e) => {

                                                                        if (
                                                                            isFehlingFactor
                                                                        ) {

                                                                            return;

                                                                        }

                                                                        updateStep(
                                                                            step.name,
                                                                            "value1",
                                                                            e.target.value
                                                                        );

                                                                    }}
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
                                                                        isFehlingFactor
                                                                            ? ""
                                                                            : `Enter ${step.name}`
                                                                    }
                                                                    className={`
                                                                        w-30
                                                                        px-2.5
                                                                        py-1.5
                                                                        border
                                                                        border-emerald-300
                                                                        rounded-lg
                                                                        text-xs
                                                                        transition-all
                                                                        ${
                                                                            isFehlingFactor
                                                                                ? "bg-emerald-50 text-emerald-900 font-semibold cursor-default"
                                                                                : "bg-white"
                                                                        }
                                                                        focus:outline-none
                                                                        focus:ring-2
                                                                        focus:ring-emerald-400
                                                                        focus:border-transparent
                                                                        disabled:cursor-not-allowed
                                                                    `}
                                                                />


                                                                {/* =================================================
                                                                    UNIT DROPDOWN

                                                                    IMPORTANT:
                                                                    No dropdown for:

                                                                    Dilution Factor
                                                                    Fehling Factor
                                                                ================================================= */}

                                                                {!isDilutionFactor &&
                                                                    !isFehlingFactor && (

                                                                        <div
                                                                            className="
                                                                                w-20
                                                                            "
                                                                        >

                                                                            <CustomDropdown
                                                                                disabled={
                                                                                    isLocked
                                                                                }
                                                                                options={
                                                                                    isSampleWeight ||
                                                                                    isStdDextroseWeight
                                                                                        ? weightUnitOptions
                                                                                        : volumeUnitOptions
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

                                                                    )}


                                                                {/* =================================================
                                                                    SAMPLE WEIGHT LOG ID
                                                                ================================================= */}

                                                                {isSampleWeight && (

                                                                    <>

                                                                        <span
                                                                            className="
                                                                                text-gray-500
                                                                                text-xs
                                                                            "
                                                                        >
                                                                            (W)
                                                                            {" "}
                                                                            (Log ID:
                                                                        </span>


                                                                        <input
                                                                            disabled={
                                                                                isLocked
                                                                            }
                                                                            type="text"
                                                                            value={
                                                                                step.logBookID ||
                                                                                ""
                                                                            }
                                                                            onChange={(e) =>
                                                                                updateStep(
                                                                                    step.name,
                                                                                    "logBookID",
                                                                                    e.target.value
                                                                                )
                                                                            }
                                                                            placeholder="Enter ID"
                                                                            className="
                                                                                w-24
                                                                                px-2.5
                                                                                py-1.5
                                                                                border
                                                                                border-emerald-300
                                                                                rounded-lg
                                                                                text-xs
                                                                                focus:outline-none
                                                                                focus:ring-2
                                                                                focus:ring-emerald-400
                                                                                transition-all
                                                                            "
                                                                        />


                                                                        <span
                                                                            className="
                                                                                text-gray-500
                                                                                text-xs
                                                                            "
                                                                        >
                                                                            )
                                                                        </span>

                                                                    </>

                                                                )}


                                                                {/* =================================================
                                                                    SAMPLE TITRE
                                                                ================================================= */}

                                                                {isSampleTitre && (

                                                                    <span
                                                                        className="
                                                                            text-gray-500
                                                                            text-xs
                                                                        "
                                                                    >
                                                                        (TV)
                                                                    </span>

                                                                )}


                                                                {/* =================================================
                                                                    DILUTION FACTOR
                                                                ================================================= */}

                                                                {isDilutionFactor && (

                                                                    <span
                                                                        className="
                                                                            text-gray-500
                                                                            text-xs
                                                                        "
                                                                    >
                                                                        (Factor)
                                                                    </span>

                                                                )}


                                                                {/* =================================================
                                                                    FEHLING FACTOR
                                                                ================================================= */}

                                                                {isFehlingFactor && (

                                                                    <span
                                                                        className="
                                                                            text-gray-500
                                                                            text-xs
                                                                        "
                                                                    >
                                                                        (Factor)
                                                                    </span>

                                                                )}

                                                            </div>

                                                        </div>

                                                    </div>

                                                </div>

                                            </motion.div>

                                        );

                                    }
                                )}

                            </div>

                        </motion.div>

                    )}

                </AnimatePresence>

            </div>

        </motion.div>
    );
};


export default SamplePreparationDetailSugar;