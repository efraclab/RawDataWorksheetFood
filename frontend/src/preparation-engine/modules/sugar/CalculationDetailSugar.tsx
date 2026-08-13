import React, { useEffect, useMemo, useState } from "react";

import {
    ChevronDown,
    Calculator,
    Trash,
    CheckCircle2,
    XCircle,
} from "lucide-react";

import { motion, AnimatePresence } from "framer-motion";

import type { CalculationSugar } from "./models/CalculationSugar";
import type { SamplePreparationSugar } from "./models/SamplePreparationSugar";

import CustomDropdown from "../../../components/shared/CustomDropdown";


/* ============================================================
   PROPS
============================================================ */

interface Props {

    calculation: CalculationSugar;

    samplePreparations: SamplePreparationSugar[];

    onRemove: () => void;

    onFieldChange: (
        calculationId: number,
        field: keyof CalculationSugar,
        value: any
    ) => void;

    role?: string;
}


/* ============================================================
   HELPERS
============================================================ */

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

    return Number.isFinite(number)
        ? number
        : 0;
};


/* ============================================================
   COMPONENT
============================================================ */

const CalculationDetailSugar: React.FC<Props> = ({
    calculation,
    samplePreparations,
    onRemove,
    onFieldChange,
}) => {

    const [
        isExpanded,
        setIsExpanded
    ] = useState(true);


    /* ========================================================
       SELECTED SAMPLE PREPARATION
    ======================================================== */

    const selectedPreparation = useMemo(() => {

        if (
            !calculation.selectedSamplePreparationLabel
        ) {
            return undefined;
        }

        return samplePreparations.find(
            preparation =>
                preparation.label ===
                calculation.selectedSamplePreparationLabel
        );

    }, [
        samplePreparations,
        calculation.selectedSamplePreparationLabel
    ]);


    /* ========================================================
       GET PREPARATION STEP VALUE
    ======================================================== */

    const getStepValue = (
        stepName: string
    ): number => {

        if (!selectedPreparation) {
            return 0;
        }

        const steps =
            Array.isArray(selectedPreparation.steps)
                ? selectedPreparation.steps
                : [];

        const step =
            steps.find(
                item =>
                    item.name === stepName
            );

        return toNumber(
            step?.value1
        );
    };


    /* ========================================================
       PREPARATION VALUES

       IMPORTANT:
       These values come directly from the Sample Preparation.

       We do NOT create another set of input fields here.
    ======================================================== */

    const sampleWeight =
        getStepValue("Sample Weight");

    const volumeMakeUp1 =
        getStepValue("Volume Make Up 1");

    const sampleTitreValue =
        getStepValue("Sample Titre Value");

    const dilutionFactor =
        getStepValue("Dilution Factor");

    const stdDextroseWeight =
        getStepValue("Std Dextrose Weight");

    const volumeMakeUp2 =
        getStepValue("Volume Make Up 2");

    const standardTitre =
        getStepValue("Standard Titre");

    const aliquot =
        getStepValue("Aliquot");


    /* ========================================================
       FEHLING FACTOR

       Formula:

       Std Dextrose Weight × Standard Titre
       ------------------------------------
             Volume Make Up 2

       Example:

       (0.1005 × 48.8) / 100

       = 0.049044

       = 0.0490
    ======================================================== */

    const fehlingFactor = useMemo(() => {

        if (
            stdDextroseWeight <= 0 ||
            standardTitre <= 0 ||
            volumeMakeUp2 <= 0
        ) {
            return 0;
        }

        const result =
            (
                stdDextroseWeight *
                standardTitre
            ) /
            volumeMakeUp2;

        return Number.isFinite(result)
            ? result
            : 0;

    }, [
        stdDextroseWeight,
        standardTitre,
        volumeMakeUp2
    ]);


    /* ========================================================
       TOTAL SUGAR

       Formula:

       (Fehling Factor
        × First Volume Make Up
        × Second Volume Make Up
        × Dilution Factor
        × 100)
       /
       (Weight Of Sample
        × Sample Titre Value
        × Aliquot)
    ======================================================== */

    const calculationResult = useMemo(() => {

        if (
            fehlingFactor <= 0 ||
            volumeMakeUp1 <= 0 ||
            volumeMakeUp2 <= 0 ||
            dilutionFactor <= 0 ||
            sampleWeight <= 0 ||
            sampleTitreValue <= 0 ||
            aliquot <= 0
        ) {
            return 0;
        }


        const numerator =
            fehlingFactor *
            volumeMakeUp1 *
            volumeMakeUp2 *
            dilutionFactor *
            100;


        const denominator =
            sampleWeight *
            sampleTitreValue *
            aliquot;


        if (
            denominator === 0
        ) {
            return 0;
        }


        const result =
            numerator /
            denominator;


        return Number.isFinite(result)
            ? result
            : 0;

    }, [
        fehlingFactor,
        volumeMakeUp1,
        volumeMakeUp2,
        dilutionFactor,
        sampleWeight,
        sampleTitreValue,
        aliquot
    ]);


    /* ========================================================
       VALIDATION
    ======================================================== */

    const validationErrors = useMemo(() => {

        const errors: string[] = [];


        if (!selectedPreparation) {

            errors.push(
                "Please select a Sample Preparation"
            );

            return errors;
        }


        if (sampleWeight <= 0) {

            errors.push(
                "Sample Weight is required"
            );
        }


        if (volumeMakeUp1 <= 0) {

            errors.push(
                "Volume Make Up 1 is required"
            );
        }


        if (sampleTitreValue <= 0) {

            errors.push(
                "Sample Titre Value is required"
            );
        }


        if (dilutionFactor <= 0) {

            errors.push(
                "Dilution Factor is required"
            );
        }


        if (stdDextroseWeight <= 0) {

            errors.push(
                "Std Dextrose Weight is required"
            );
        }


        if (volumeMakeUp2 <= 0) {

            errors.push(
                "Volume Make Up 2 is required"
            );
        }


        if (standardTitre <= 0) {

            errors.push(
                "Standard Titre is required"
            );
        }


        if (aliquot <= 0) {

            errors.push(
                "Aliquot is required"
            );
        }


        return errors;

    }, [
        selectedPreparation,
        sampleWeight,
        volumeMakeUp1,
        sampleTitreValue,
        dilutionFactor,
        stdDextroseWeight,
        volumeMakeUp2,
        standardTitre,
        aliquot
    ]);


    const isValid =
        validationErrors.length === 0;


    /* ========================================================
       SAVE CALCULATION VALUES

       This is intentionally done when the user clicks
       Calculate Result.

       Fehling Factor is calculated automatically from the
       standard preparation values.
    ======================================================== */

    const performCalculation = () => {

        if (!selectedPreparation) {

            onFieldChange(
                calculation.id,
                "calculationResult",
                null
            );

            return;
        }


        if (!isValid) {

            onFieldChange(
                calculation.id,
                "calculationResult",
                null
            );

            return;
        }


        onFieldChange(
            calculation.id,
            "fehlingFactor",
            Number(
                fehlingFactor.toFixed(4)
            )
        );


        onFieldChange(
            calculation.id,
            "calculationResult",
            Number(
                calculationResult.toFixed(3)
            )
        );


        onFieldChange(
            calculation.id,
            "calculationResultUnit",
            "g/100g"
        );
    };


    /* ========================================================
       AUTOMATIC FEHLING FACTOR

       Keep the Calculation model synchronized with the
       automatically calculated Fehling Factor.

       This does NOT display "Automatically calculated".
    ======================================================== */

    useEffect(() => {

        if (
            !selectedPreparation
        ) {
            return;
        }


        if (
            fehlingFactor <= 0
        ) {
            return;
        }


        const current =
            toNumber(
                calculation.fehlingFactor
            );


        if (
            Math.abs(
                current - fehlingFactor
            ) > 0.000001
        ) {

            onFieldChange(
                calculation.id,
                "fehlingFactor",
                Number(
                    fehlingFactor.toFixed(4)
                )
            );

        }

    }, [
        selectedPreparation,
        fehlingFactor,
        calculation.id
    ]);


    /* ========================================================
       SAMPLE PREPARATION CHANGE
    ======================================================== */

    const handleSamplePreparationChange = (
        value: string
    ) => {

        onFieldChange(
            calculation.id,
            "selectedSamplePreparationLabel",
            value
        );


        /*
         * Clear old calculation result.
         *
         * When another Sample Preparation is selected,
         * the previous result must not remain visible.
         */

        onFieldChange(
            calculation.id,
            "calculationResult",
            null
        );


        onFieldChange(
            calculation.id,
            "fehlingFactor",
            null
        );

    };


    /* ========================================================
       RENDER
    ======================================================== */

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
                    relative
                    bg-gradient-to-r
                    from-emerald-700
                    via-emerald-800
                    to-slate-900
                "
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
                                {calculation.label}
                            </h4>

                            <p
                                className="
                                    text-xs
                                    text-emerald-100
                                "
                            >
                                Calculation for Sugar
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
                            type="button"
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
                BODY
            ================================================== */}

            {isExpanded && (

                <div
                    className="
                        border-t-4
                        border-emerald-300
                    "
                >

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
                            transition={{
                                duration: 0.3,
                                ease: "easeInOut"
                            }}
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
                                    SELECT SAMPLE PREPARATION

                                    This is the ONLY place where the calculation
                                    chooses the preparation.

                                    We do NOT duplicate preparation fields here.
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
                                            Select sample preparation...
                                        "
                                        colorScheme="emerald"
                                    />

                                </div>


                                {/* =================================================
                                    FORMULA
                                ================================================= */}

                                {selectedPreparation && (

                                    <div
                                        className="
                                            bg-white
                                            rounded-lg
                                            p-4
                                            border-2
                                            border-emerald-200
                                            shadow-sm
                                        "
                                    >

                                        <h4
                                            className="
                                                text-sm
                                                font-bold
                                                text-gray-900
                                                mb-4
                                            "
                                        >
                                            Formula for Total Sugar
                                        </h4>


                                        {/* ===============================
                                            SYMBOLIC FORMULA
                                        =============================== */}

                                        <div
                                            className="
                                                bg-gray-50
                                                rounded
                                                p-4
                                            "
                                        >

                                            <div
                                                className="
                                                    flex
                                                    flex-col
                                                    items-center
                                                "
                                            >

                                                <div
                                                    className="
                                                        text-center
                                                        border-b-2
                                                        border-black
                                                        pb-2
                                                        mb-2
                                                        px-2
                                                        w-full
                                                    "
                                                >

                                                    <p
                                                        className="
                                                            text-xs
                                                            font-mono
                                                            text-black
                                                            break-words
                                                        "
                                                    >
                                                        (
                                                        Fehling Factor
                                                        {" × "}
                                                        First Volume Make Up
                                                        {" × "}
                                                        Second Volume Make Up
                                                        {" × "}
                                                        Dilution Factor
                                                        {" × "}
                                                        100
                                                        )
                                                    </p>

                                                </div>


                                                <div
                                                    className="
                                                        text-center
                                                        px-2
                                                        w-full
                                                    "
                                                >

                                                    <p
                                                        className="
                                                            text-xs
                                                            font-mono
                                                            text-black
                                                        "
                                                    >
                                                        Weight Of Sample
                                                        {" × "}
                                                        Sample Titre Value
                                                        {" × "}
                                                        Aliquot
                                                    </p>

                                                </div>

                                            </div>

                                        </div>


                                        {/* =================================================
                                            ACTUAL VALUES
                                        ================================================= */}

                                        <div
                                            className="
                                                bg-emerald-50
                                                rounded
                                                p-4
                                                mt-4
                                            "
                                        >

                                            <div
                                                className="
                                                    flex
                                                    items-center
                                                    gap-2
                                                "
                                            >

                                                <span
                                                    className="
                                                        text-lg
                                                        font-bold
                                                    "
                                                >
                                                    =
                                                </span>


                                                <div
                                                    className="
                                                        flex-1
                                                        flex
                                                        flex-col
                                                        items-center
                                                    "
                                                >

                                                    <div
                                                        className="
                                                            border-b-2
                                                            border-black
                                                            w-full
                                                            text-center
                                                            pb-2
                                                            text-sm
                                                        "
                                                    >

                                                        (
                                                        {fehlingFactor.toFixed(4)}
                                                        {" × "}
                                                        {volumeMakeUp1.toFixed(2)}
                                                        {" × "}
                                                        {volumeMakeUp2.toFixed(2)}
                                                        {" × "}
                                                        {dilutionFactor.toFixed(2)}
                                                        {" × "}
                                                        100
                                                        )

                                                    </div>


                                                    <div
                                                        className="
                                                            w-full
                                                            text-center
                                                            mt-2
                                                            text-sm
                                                        "
                                                    >

                                                        {sampleWeight.toFixed(4)}
                                                        {" × "}
                                                        {sampleTitreValue.toFixed(4)}
                                                        {" × "}
                                                        {aliquot.toFixed(4)}

                                                    </div>

                                                </div>

                                            </div>


                                            <div
                                                className="
                                                    text-center
                                                    mt-3
                                                    font-bold
                                                    text-lg
                                                "
                                            >
                                                =
                                                {" "}
                                                {calculationResult.toFixed(3)}
                                                {" g/100g"}
                                            </div>

                                        </div>

                                    </div>

                                )}


                                {/* =================================================
                                    ACCEPTANCE LIMIT

                                    Same architectural position as Protein.
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
                                                gap-2
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


                                            <span
                                                className="
                                                    shrink-0
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
                                                performCalculation
                                            }
                                            whileHover={{
                                                scale: 1.02
                                            }}
                                            whileTap={{
                                                scale: 0.98
                                            }}
                                            disabled={
                                                !isValid
                                            }
                                            className={`
                                                flex
                                                items-center
                                                gap-2
                                                px-6
                                                py-2.5
                                                text-white
                                                font-semibold
                                                rounded-lg
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
                                                            bg-slate-400
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
                                    NO SAMPLE PREPARATION
                                ================================================= */}

                                {!selectedPreparation && (

                                    <div
                                        className="
                                            bg-emerald-50
                                            border-2
                                            border-emerald-300
                                            rounded-lg
                                            p-3
                                            text-center
                                        "
                                    >

                                        <p
                                            className="
                                                text-xs
                                                text-emerald-800
                                                font-medium
                                            "
                                        >
                                            Please select a sample
                                            preparation to enable
                                            calculation
                                        </p>

                                    </div>

                                )}


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
                                                        Required Fields
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
                                    RESULT
                                ================================================= */}

                                {calculation.calculationResult !== null &&
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
                                                    max-w-4xl
                                                    mx-auto
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

                                                    <div
                                                        className="
                                                            bg-gradient-to-r
                                                            from-emerald-700
                                                            via-emerald-800
                                                            to-slate-900
                                                            px-4
                                                            py-2
                                                        "
                                                    >

                                                        <h6
                                                            className="
                                                                text-sm
                                                                font-bold
                                                                text-white
                                                            "
                                                        >
                                                            Sugar Result
                                                        </h6>

                                                    </div>


                                                    <div
                                                        className="
                                                            flex
                                                            items-center
                                                            gap-4
                                                            
                                                            p-4
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
                                                                Total Sugar
                                                            </p>

                                                            <p
                                                                className="
                                                                    text-2xl
                                                                    font-bold
                                                                    text-gray-800
                                                                "
                                                            >
                                                                {
                                                                    calculation.calculationResult
                                                                }
                                                                {" "}
                                                                {
                                                                    calculation.calculationResultUnit ||
                                                                    "g/100g"
                                                                }
                                                            </p>

                                                        </div>


                                                        {/* PASS / FAIL */}

                                                        {(() => {

                                                            const min =
                                                                calculation
                                                                    .acceptanceLimitMin
                                                                    ? parseFloat(
                                                                        String(
                                                                            calculation.acceptanceLimitMin
                                                                        )
                                                                    )
                                                                    : null;


                                                            const max =
                                                                calculation
                                                                    .acceptanceLimitMax
                                                                    ? parseFloat(
                                                                        String(
                                                                            calculation.acceptanceLimitMax
                                                                        )
                                                                    )
                                                                    : null;


                                                            const value =
                                                                Number(
                                                                    calculation.calculationResult
                                                                );


                                                            const hasMin =
                                                                min !== null &&
                                                                !isNaN(min);


                                                            const hasMax =
                                                                max !== null &&
                                                                !isNaN(max);


                                                            if (
                                                                !hasMin &&
                                                                !hasMax
                                                            ) {
                                                                return null;
                                                            }


                                                            const pass =
                                                                (!hasMin ||
                                                                    value >= min!) &&
                                                                (!hasMax ||
                                                                    value <= max!);


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
                                                                        ${
                                                                            pass
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
                                                                    {
                                                                        pass
                                                                            ? "Pass"
                                                                            : "Fail"
                                                                    }
                                                                </span>

                                                            );

                                                        })()}

                                                    </div>

                                                </div>


                                                {/* SAMPLE PREPARATION */}

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
                                                            text-gray-600
                                                            font-medium
                                                        "
                                                    >
                                                        Sample Prep
                                                    </p>

                                                    <p
                                                        className="
                                                            text-sm
                                                            text-gray-900
                                                            font-semibold
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

                                            </div>

                                        </motion.div>

                                    )}

                            </div>

                        </motion.div>

                    </AnimatePresence>

                </div>

            )}

        </motion.div>
    );
};


export default CalculationDetailSugar;