import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Droplets, Trash } from "lucide-react";

import CustomDropdown from "../../../../components/shared/CustomDropdown";

import type { SamplePreparationProtein } from "../models/SamplePreparationProtein";

interface Props {
    samplePreparation: SamplePreparationProtein;

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
    { value: "mg", label: "mg" },
    { value: "g", label: "g" },
    { value: "kg", label: "kg" },
];

const volumeUnitOptions = [
    { value: "ml", label: "ml" },
    { value: "L", label: "L" },
];


/* =========================================================
   COMPONENT
========================================================= */

const SamplePreparationDetailProtein: React.FC<Props> = ({
    samplePreparation,
    onStepChange,
    onRemove,
    isLocked,
}) => {

    const [isExpanded, setIsExpanded] = useState(true);

    const headerRoundingClass = isExpanded
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


    return (

        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="relative group z-20"
        >

            {/* =================================================
                OUTER CARD
            ================================================= */}

            <div className="relative bg-white/95 backdrop-blur-sm rounded-lg border border-slate-700/40 transition-all duration-300 mb-4">


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

                    <div className="relative flex items-center justify-between px-4 py-3">


                        {/* LEFT SIDE */}

                        <div
                            className="flex items-center gap-4 flex-1 cursor-pointer select-none"
                            onClick={() =>
                                setIsExpanded(!isExpanded)
                            }
                        >

                            <motion.div
                                animate={{
                                    rotate: isExpanded ? 0 : 360
                                }}
                                transition={{
                                    duration: 0.5
                                }}
                                className="relative"
                            >

                                <div className="absolute inset-0 bg-white/30 rounded-lg blur-md" />

                                <div className="relative p-2 bg-white/20 rounded-lg backdrop-blur-md border border-white/30">

                                    <Droplets className="w-5 h-5 text-white" />

                                </div>

                            </motion.div>


                            <div>

                                <h4 className="text-sm font-semibold text-white tracking-wide">
                                    {samplePreparation.label}
                                </h4>

                                <p className="text-xs text-emerald-100">
                                    Sample Preparation for Protein Details
                                </p>

                            </div>

                        </div>


                        {/* RIGHT SIDE */}

                        <div className="flex items-center gap-3">


                            {/* COLLAPSE */}

                            <motion.button
                                type="button"
                                onClick={() =>
                                    setIsExpanded(!isExpanded)
                                }
                                whileHover={{
                                    scale: 1.1
                                }}
                                whileTap={{
                                    scale: 0.95
                                }}
                                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                            >

                                <motion.div
                                    animate={{
                                        rotate: isExpanded
                                            ? 180
                                            : 0
                                    }}
                                    transition={{
                                        duration: 0.3
                                    }}
                                >

                                    <ChevronDown className="w-5 h-5 text-white" />

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
                                    ${isLocked
                                        ? "opacity-50 cursor-not-allowed"
                                        : "hover:bg-white/30"
                                    }
                                `}
                                title={`Remove ${samplePreparation.label}`}
                            >

                                <Trash className="w-4 h-4 text-white" />

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

                            <div className="p-5 space-y-3 bg-gradient-to-br from-emerald-50/50 to-slate-50/30">


                                {samplePreparation.steps.map(
                                    (step, index) => {

                                        const isSampleWeight =
                                            step.name === "Sample Weight";

                                        const isSampleTitre =
                                            step.name === "Sample Titre Value";

                                        const isBlankTitre =
                                            step.name === "Blank Titre Value";

                                        const isNormality =
                                            step.name === "Normality";

                                        const isProteinFactor =
                                            step.name === "Protein Factor";


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
                                                    delay: index * 0.1
                                                }}
                                                className="group/item relative"
                                            >

                                                <div className="relative bg-white rounded-xl border border-emerald-200/60 hover:border-emerald-300 transition-all duration-200 p-4">


                                                    {/* =================================================
                                                        STEP HEADER
                                                    ================================================= */}

                                                    <div className="flex items-start gap-3">

                                                        <div className="flex-shrink-0 w-7 h-7 bg-gradient-to-br from-emerald-700 to-slate-800 rounded-full flex items-center justify-center shadow-md">

                                                            <span className="text-white text-xs font-bold">
                                                                {index + 1}
                                                            </span>

                                                        </div>


                                                        <div className="flex-1">

                                                            <div className="flex items-center gap-2 mb-3">

                                                                <div className="font-bold text-emerald-900 text-sm">
                                                                    {step.name}
                                                                </div>

                                                                <div className="h-px flex-1 bg-gradient-to-r from-slate-300 to-transparent" />

                                                            </div>


                                                            {/* =================================================
                                                                1. SAMPLE WEIGHT
                                                            ================================================= */}

                                                            {isSampleWeight && (

                                                                <div className="flex flex-wrap items-center gap-2 text-xs">

                                                                    <span className="text-gray-600 font-medium">
                                                                        Sample Weight
                                                                    </span>


                                                                    <input
                                                                        disabled={isLocked}
                                                                        type="number"
                                                                        min="0"
                                                                        step="0.01"
                                                                        inputMode="decimal"
                                                                        value={step.value1 || ""}
                                                                        onChange={(e) =>
                                                                            updateStep(
                                                                                step.name,
                                                                                "value1",
                                                                                e.target.value
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
                                                                        onWheel={(e) =>
                                                                            e.currentTarget.blur()
                                                                        }
                                                                        placeholder="Enter Weight"
                                                                        className="w-30 px-2.5 py-1.5 border border-emerald-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all"
                                                                    />


                                                                    <div className="w-20">

                                                                        <CustomDropdown
                                                                            disabled={isLocked}
                                                                            options={weightUnitOptions}
                                                                            value={step.unit1}
                                                                            onChange={(newUnit) =>
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


                                                                    <span className="text-gray-500 text-xs">
                                                                        (W1) (Log ID:
                                                                    </span>


                                                                    <input
                                                                        disabled={isLocked}
                                                                        type="text"
                                                                        value={step.logBookID || ""}
                                                                        onChange={(e) =>
                                                                            updateStep(
                                                                                step.name,
                                                                                "logBookID",
                                                                                e.target.value
                                                                            )
                                                                        }
                                                                        placeholder="Enter ID"
                                                                        className="w-24 px-2.5 py-1.5 border border-emerald-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-all"
                                                                    />


                                                                    <span className="text-gray-500 text-xs">
                                                                        )
                                                                    </span>

                                                                </div>

                                                            )}


                                                            {/* =================================================
                                                                2. SAMPLE TITRE VALUE
                                                            ================================================= */}

                                                            {isSampleTitre && (

                                                                <div className="flex flex-wrap items-center gap-2 text-xs">

                                                                    <span className="text-gray-600 font-medium">
                                                                        Sample Titre Value
                                                                    </span>


                                                                    <input
                                                                        disabled={isLocked}
                                                                        type="number"
                                                                        min="0"
                                                                        step="0.0001"
                                                                        inputMode="decimal"
                                                                        value={step.value1 || ""}
                                                                        onChange={(e) =>
                                                                            updateStep(
                                                                                step.name,
                                                                                "value1",
                                                                                e.target.value
                                                                            )
                                                                        }
                                                                        placeholder="Enter Titre Value"
                                                                        className="w-30 px-2.5 py-1.5 border border-emerald-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all"
                                                                    />


                                                                    <div className="w-20">

                                                                        <CustomDropdown
                                                                            disabled={isLocked}
                                                                            options={volumeUnitOptions}
                                                                            value={step.unit1}
                                                                            onChange={(newUnit) =>
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


                                                                    <span className="text-gray-500 text-xs">
                                                                        (W2)
                                                                    </span>

                                                                </div>

                                                            )}


                                                            {/* =================================================
                                                                3. BLANK TITRE VALUE
                                                            ================================================= */}

                                                            {isBlankTitre && (

                                                                <div className="flex flex-wrap items-center gap-2 text-xs">

                                                                    <span className="text-gray-600 font-medium">
                                                                        Blank Titre Value
                                                                    </span>

                                                                    <input
                                                                        disabled={isLocked}
                                                                        type="number"
                                                                        min="0"
                                                                        step="0.0001"
                                                                        inputMode="decimal"
                                                                        value={step.value1 || ""}
                                                                        onChange={(e) =>
                                                                            updateStep(
                                                                                step.name,
                                                                                "value1",
                                                                                e.target.value
                                                                            )
                                                                        }
                                                                        placeholder="Enter Titre Value"
                                                                        className="w-30 px-2.5 py-1.5 border border-emerald-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all"
                                                                    />

                                                                    <div className="w-20">

                                                                        <CustomDropdown
                                                                            disabled={isLocked}
                                                                            options={volumeUnitOptions}
                                                                            value={step.unit1}
                                                                            onChange={(newUnit) =>
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

                                                                </div>
                                                            )}


                                                            {/* =================================================
                                                                4. NORMALITY
                                                            ================================================= */}

                                                            {isNormality && (

                                                                <div className="flex flex-wrap items-center gap-2 text-xs">

                                                                    <span className="text-gray-600 font-medium">
                                                                        Normality
                                                                    </span>


                                                                    <input
                                                                        disabled={isLocked}
                                                                        type="number"
                                                                        min="0"
                                                                        step="0.0001"
                                                                        inputMode="decimal"
                                                                        value={step.value1 || ""}
                                                                        onChange={(e) =>
                                                                            updateStep(
                                                                                step.name,
                                                                                "value1",
                                                                                e.target.value
                                                                            )
                                                                        }
                                                                        placeholder="Enter Normality"
                                                                        className="w-30 px-2.5 py-1.5 border border-emerald-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all"
                                                                    />


                                                                    <div className="w-20">

                                                                        <CustomDropdown
                                                                            disabled={isLocked}
                                                                            options={volumeUnitOptions}
                                                                            value={step.unit1}
                                                                            onChange={(newUnit) =>
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


                                                                    <span className="text-gray-500 text-xs">
                                                                        (W3)
                                                                    </span>

                                                                </div>

                                                            )}


                                                            {/* =================================================
                                                                5. PROTEIN FACTOR
                                                            ================================================= */}

                                                            {isProteinFactor && (

                                                                <div className="flex flex-wrap items-center gap-2 text-xs">

                                                                    <span className="text-gray-600 font-medium">
                                                                        Protein Factor
                                                                    </span>


                                                                    <input
                                                                        disabled={isLocked}
                                                                        type="number"
                                                                        min="0"
                                                                        step="0.01"
                                                                        inputMode="decimal"
                                                                        value={step.value1 || ""}
                                                                        onChange={(e) =>
                                                                            updateStep(
                                                                                step.name,
                                                                                "value1",
                                                                                e.target.value
                                                                            )
                                                                        }
                                                                        placeholder="Enter Protein Factor"
                                                                        className="w-30 px-2.5 py-1.5 border border-emerald-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all"
                                                                    />


                                                                    <span className="text-gray-500 text-xs">
                                                                        (Factor)
                                                                    </span>

                                                                </div>

                                                            )}

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


export default SamplePreparationDetailProtein;