import React, { useState } from "react";
import type { ParameterDetail } from "../../../models/ParameterDetail";
import type { SampleData } from "../../../models/SampleData";
import { IoFlask } from "react-icons/io5";
import { CgTrash } from "react-icons/cg";
import { motion } from "framer-motion";

interface Props {
    parameterCount: number | undefined;

    addedParameters: ParameterDetail[];

    availableParameters: SampleData[];

    onDeleteParameter: (parameter: ParameterDetail) => void;

    onAddParameter: (parameter: SampleData) => void;

    expandedParameterId: number | null;

    onToggleParameter: (parameter: ParameterDetail) => void;

    /**
     * Worksheet status.
     *
     * Used to control whether a NEW parameter can be added.
     *
     * IMPORTANT:
     * This status must NOT be used to lock an already-created
     * parameter card. Parameter locking is handled using the
     * individual parameter status below.
     */
    worksheetStatus?: string | null;

    /**
     * Current user role.
     */
    role?: string | null;
}

/**
 * Normalize status values so the component can safely handle
 * values such as:
 *
 * "ANALYSIS PENDING"
 * "Analysis Pending"
 * "analysis_pending"
 * "Submitted For Analysis"
 * "SUBMITTED_FOR_ANALYSIS"
 */
const normalizeStatus = (status?: string | null): string => {
    return (status ?? "")
        .trim()
        .toLowerCase()
        .replace(/_/g, " ")
        .replace(/-/g, " ")
        .replace(/\s+/g, " ");
};

/**
 * Parameter-level analysis statuses.
 *
 * IMPORTANT:
 * "submitted for analysis" is a WORKSHEET status.
 * It must NOT lock a newly-created parameter.
 *
 * A newly added parameter can therefore be:
 *
 *     worksheetStatus = "Submitted For Analysis"
 *     parameter.status = "CREATED"
 *
 * In that situation the parameter must remain editable
 * and the delete button must remain visible.
 */
const isParameterLockedStatus = (
    status?: string | null
): boolean => {
    const normalized = normalizeStatus(status);

    return [
        "analysis pending",
        "analysis started",
        "analysis completed",
        "submitted for qa review",
        "qa review",
        "approved",
        "analysis revision",
        "analysis revision started"
    ].includes(normalized);
};

/**
 * Worksheet-level status.
 *
 * This controls whether a NEW parameter can be added.
 *
 * It does NOT control the lock state of an individual
 * parameter card.
 */
const isWorksheetLockedStatus = (
    status?: string | null
): boolean => {
    const normalized = normalizeStatus(status);

    return [
        "submitted for analysis",
        "analysis pending",
        "analysis started",
        "analysis completed",
        "submitted for qa review",
        "qa review",
        "approved",
        "analysis revision",
        "analysis revision started"
    ].includes(normalized);
};

const FoodParameterManager: React.FC<Props> = ({
    parameterCount,
    addedParameters,
    availableParameters,
    expandedParameterId,
    onAddParameter,
    onToggleParameter,
    onDeleteParameter,
    worksheetStatus,
    role
}) => {
    const [showDropdown, setShowDropdown] = useState(false);

    React.useEffect(() => {
        if (availableParameters.length === 0) {
            setShowDropdown(false);
        }
    }, [availableParameters]);

    /**
     * ============================================================
     * WORKSHEET-LEVEL LOCK
     * ============================================================
     *
     * This is ONLY used for the Add Parameter button.
     *
     * Special case:
     *
     * If all parameters have been deleted, allow the reviewer
     * to add a new parameter even though the worksheet itself
     * is still "Submitted For Analysis".
     */
    const worksheetLocked = isWorksheetLockedStatus(
        worksheetStatus
    );

    const noParametersRemain = addedParameters.length === 0;

    const canAddParameter =
        (
            !worksheetLocked ||
            noParametersRemain
        ) &&
        (
            role === undefined ||
            role === null ||
            role === "" ||
            role === "Reviewer"
        );

    return (
        <div
            className="
                relative
                rounded-2xl
                bg-gradient-to-r
                from-emerald-900
                via-emerald-800
                to-emerald-900
                shadow-xl
                border
                border-emerald-700
                p-6
                mb-8
            "
        >
            {/* Decorative background */}
            <div
                className="
                    absolute
                    -top-6
                    -right-6
                    w-32
                    h-32
                    rounded-full
                    bg-emerald-400/15
                    blur-3xl
                    pointer-events-none
                "
            />

            {/* ============================================================
                HEADER
            ============================================================ */}

            <div
                className="
                    relative
                    flex
                    items-center
                    justify-between
                "
            >
                <h3
                    className="
                        text-xl
                        font-bold
                        text-white
                        flex
                        items-center
                        gap-3
                    "
                >
                    <div
                        className="
                            w-10
                            h-10
                            bg-white/10
                            backdrop-blur-sm
                            rounded-xl
                            flex
                            items-center
                            justify-center
                            border
                            border-white/20
                            shadow-inner
                        "
                    >
                        <IoFlask
                            className="
                                w-5
                                h-5
                                text-emerald-300
                            "
                        />
                    </div>

                    <span>
                        Parameters Management
                    </span>
                </h3>

                {/* ========================================================
                    ADD PARAMETER
                ======================================================== */}

                <div className="relative">
                    <button
                        type="button"
                        disabled={!canAddParameter}
                        onClick={() => {
                            if (!canAddParameter) {
                                return;
                            }

                            if (availableParameters.length === 0) {
                                return;
                            }

                            setShowDropdown(
                                previous => !previous
                            );
                        }}
                        className={`
                            inline-flex
                            items-start
                            gap-2
                            rounded-lg
                            px-5
                            py-2.5
                            font-semibold
                            shadow-md
                            transition-all
                            duration-200
                            disabled:opacity-100

                            ${
                                !canAddParameter ||
                                availableParameters.length === 0
                                    ? `
                                        bg-emerald-700
                                        text-emerald-200
                                        border
                                        border-emerald-600
                                        cursor-not-allowed
                                        opacity-100
                                    `
                                    : `
                                        bg-emerald-600
                                        hover:bg-emerald-700
                                        text-white
                                        border
                                        border-emerald-500
                                    `
                            }
                        `}
                    >
                        <span className="text-base">
                            +
                        </span>

                        Add Parameter
                    </button>

                    {/* ====================================================
                        DROPDOWN
                    ==================================================== */}

                    {showDropdown && canAddParameter && (
                        <div
                            className="
                                absolute
                                right-0
                                top-full
                                mt-2
                                w-80
                                bg-white
                                rounded-xl
                                shadow-2xl
                                border
                                border-slate-200
                                z-[9999]
                                max-h-96
                                overflow-y-auto
                            "
                        >
                            {availableParameters.length === 0 ? (
                                <div
                                    className="
                                        p-6
                                        text-center
                                        text-gray-500
                                    "
                                >
                                    No parameters available
                                </div>
                            ) : (
                                availableParameters.map(
                                    param => (
                                        <div
                                            key={param.paraCode}
                                            onClick={() => {
                                                if (!canAddParameter) {
                                                    return;
                                                }

                                                onAddParameter(param);

                                                setShowDropdown(
                                                    false
                                                );
                                            }}
                                            className="
                                                px-4
                                                py-3
                                                cursor-pointer
                                                hover:bg-emerald-50
                                                transition
                                                border-b
                                                last:border-b-0
                                            "
                                        >
                                            <div
                                                className="
                                                    font-semibold
                                                    text-slate-800
                                                "
                                            >
                                                {param.parameter}
                                            </div>

                                            <div
                                                className="
                                                    text-xs
                                                    text-slate-500
                                                    mt-1
                                                "
                                            >
                                                {param.methodCode}
                                                {" • "}
                                                {param.methodName}
                                            </div>
                                        </div>
                                    )
                                )
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* ============================================================
                EMPTY STATE
            ============================================================ */}

            {addedParameters.length === 0 ? (
                <div
                    className="
                        rounded-xl
                        border
                        border-emerald-200
                        bg-emerald-50
                        py-10
                        px-6
                        mt-4
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
                                w-10
                                h-10
                                rounded-full
                                border-2
                                border-emerald-200
                                flex
                                items-center
                                justify-center
                                text-emerald-500
                                text-2xl
                            "
                        >
                            ◎
                        </div>

                        <h3
                            className="
                                mt-5
                                font-bold
                                text-slate-800
                            "
                        >
                            No parameters added yet
                        </h3>

                        <p
                            className="
                                mt-2
                                text-sm
                                text-slate-500
                            "
                        >
                            Click the "Add Parameter" button above
                            to add parameters.
                        </p>
                    </div>
                </div>
            ) : (
                /* ========================================================
                   PARAMETER LIST
                ======================================================== */

                <div
                    className="
                        mt-4
                        space-y-3
                    "
                >
                    {addedParameters.map(parameter => {

                        /**
                         * ==================================================
                         * IMPORTANT FIX
                         * ==================================================
                         *
                         * DO NOT use:
                         *
                         *     worksheetLocked ||
                         *     ...
                         *
                         * here.
                         *
                         * The worksheet can be:
                         *
                         *     Submitted For Analysis
                         *
                         * while a newly-added parameter is:
                         *
                         *     CREATED
                         *
                         * A CREATED parameter must remain editable.
                         *
                         * Therefore the card lock is determined ONLY
                         * from parameter.status.
                         */
                        const parameterLocked =
                            isParameterLockedStatus(
                                parameter.status
                            );

                        const isExpanded =
                            expandedParameterId === parameter.id;

                        const status =
                            normalizeStatus(parameter.status) ||
                            "created";

                        const STATUS_COLORS = {
                            created: {
                                bg: "bg-emerald-100",
                                border: "border-emerald-300",
                                text: "text-emerald-800",
                                label: "CREATED"
                            },

                            "analysis pending": {
                                bg: "bg-emerald-100",
                                border: "border-emerald-300",
                                text: "text-emerald-800",
                                label: "ANALYSIS PENDING"
                            },

                            "analysis started": {
                                bg: "bg-emerald-100",
                                border: "border-emerald-300",
                                text: "text-emerald-800",
                                label: "ANALYSIS STARTED"
                            },

                            "analysis completed": {
                                bg: "bg-emerald-100",
                                border: "border-emerald-300",
                                text: "text-emerald-800",
                                label: "ANALYSIS COMPLETED"
                            },

                            approved: {
                                bg: "bg-emerald-100",
                                border: "border-emerald-300",
                                text: "text-emerald-800",
                                label: "APPROVED"
                            },

                            "analysis revision": {
                                bg: "bg-orange-100",
                                border: "border-orange-300",
                                text: "text-orange-800",
                                label: "REVISION REQUESTED"
                            },

                            "analysis revision started": {
                                bg: "bg-orange-100",
                                border: "border-orange-300",
                                text: "text-orange-800",
                                label: "REVISION IN PROGRESS"
                            },

                            disapproved: {
                                bg: "bg-red-100",
                                border: "border-red-300",
                                text: "text-red-700",
                                label: "DISAPPROVED"
                            }
                        };

                        const currentStatus =
                            STATUS_COLORS[
                                status as keyof typeof STATUS_COLORS
                            ] || STATUS_COLORS.created;

                        return (
                            <motion.div
                                key={parameter.id}
                                initial={{
                                    opacity: 0,
                                    x: -20
                                }}
                                animate={{
                                    opacity: 1,
                                    x: 0
                                }}
                                className={`
                                    relative
                                    flex
                                    items-center
                                    justify-between
                                    mt-5
                                    p-4
                                    rounded-xl
                                    shadow-inner
                                    transition-all
                                    duration-300

                                    ${
                                        parameterLocked
                                            ? "bg-gradient-to-r from-slate-100 via-slate-50 to-slate-100 border-2 border-slate-300"
                                            : "bg-gradient-to-r from-emerald-50 via-emerald-50 to-emerald-50 border-2 border-emerald-200"
                                    }
                                `}
                            >
                                {/* ==================================================
                                    LOCKED OVERLAY
                                ================================================== */}

                                {parameterLocked && (
                                    <div
                                        className="
                                            absolute
                                            inset-0
                                            bg-gradient-to-br
                                            from-slate-200/30
                                            to-slate-300/30
                                            backdrop-blur-[1px]
                                            rounded-xl
                                            pointer-events-none
                                        "
                                    >
                                        <div
                                            className="
                                                absolute
                                                top-2
                                                right-2
                                            "
                                        >
                                            <motion.div
                                                initial={{
                                                    scale: 0,
                                                    rotate: -180
                                                }}
                                                animate={{
                                                    scale: 1,
                                                    rotate: 0
                                                }}
                                                transition={{
                                                    type: "spring",
                                                    duration: 0.6
                                                }}
                                                className="
                                                    w-8
                                                    h-8
                                                    bg-slate-600
                                                    rounded-full
                                                    flex
                                                    items-center
                                                    justify-center
                                                    shadow-lg
                                                "
                                            >
                                                <svg
                                                    className="
                                                        w-4
                                                        h-4
                                                        text-white
                                                    "
                                                    fill="currentColor"
                                                    viewBox="0 0 20 20"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            </motion.div>
                                        </div>
                                    </div>
                                )}

                                <div
                                    className="
                                        flex-1
                                        relative
                                        z-10
                                    "
                                >
                                    <div
                                        className="
                                            flex
                                            items-center
                                            gap-3
                                            mb-2
                                        "
                                    >
                                        <div
                                            className={`
                                                font-semibold
                                                text-sm
                                                ${
                                                    parameterLocked
                                                        ? "text-slate-700"
                                                        : "text-emerald-800"
                                                }
                                            `}
                                        >
                                            {parameter.parameterName}
                                        </div>

                                        {/* ==================================================
                                            STATUS BADGE
                                        ================================================== */}

                                        <motion.div
                                            initial={{
                                                scale: 0
                                            }}
                                            animate={{
                                                scale: 1
                                            }}
                                            className={`
                                                inline-flex
                                                items-center
                                                gap-1.5
                                                px-3
                                                py-1
                                                ${currentStatus.bg}
                                                ${currentStatus.border}
                                                border-2
                                                rounded-full
                                                shadow-sm
                                            `}
                                        >
                                            <span
                                                className={`
                                                    text-xs
                                                    font-bold
                                                    ${currentStatus.text}
                                                    uppercase
                                                    tracking-wide
                                                    leading-4
                                                `}
                                            >
                                                {currentStatus.label}
                                            </span>
                                        </motion.div>

                                        {/* ==================================================
                                            LOCKED BADGE
                                        ================================================== */}

                                        {parameterLocked && (
                                            <motion.div
                                                initial={{
                                                    scale: 0,
                                                    x: -10
                                                }}
                                                animate={{
                                                    scale: 1,
                                                    x: 0
                                                }}
                                                className="
                                                    inline-flex
                                                    items-center
                                                    gap-1.5
                                                    px-3
                                                    py-1
                                                    bg-slate-200
                                                    border-2
                                                    border-slate-400
                                                    rounded-full
                                                    shadow-sm
                                                "
                                            >
                                                <svg
                                                    className="
                                                        w-3
                                                        h-3
                                                        text-slate-700
                                                    "
                                                    fill="currentColor"
                                                    viewBox="0 0 20 20"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>

                                                <span
                                                    className="
                                                        text-xs
                                                        font-bold
                                                        text-slate-800
                                                        uppercase
                                                        tracking-wide
                                                    "
                                                >
                                                    LOCKED
                                                </span>
                                            </motion.div>
                                        )}
                                    </div>

                                    <div
                                        className={`
                                            text-xs
                                            ${
                                                parameterLocked
                                                    ? "text-slate-700"
                                                    : "text-emerald-700"
                                            }
                                        `}
                                    >
                                        {parameter.paraCode} •{" "}
                                        {parameter.methodName ??
                                            parameter.methodCode}
                                    </div>

                                    {parameter.analyzedBy && (
                                        <div
                                            className={`
                                                mt-1
                                                text-xs
                                                font-medium
                                                ${
                                                    parameterLocked
                                                        ? "text-slate-700"
                                                        : "text-emerald-800"
                                                }
                                            `}
                                        >
                                            Assigned to:{" "}
                                            {parameter.analyzedByName ??
                                                "Not Assigned"}
                                        </div>
                                    )}

                                    {/* ==================================================
                                        LOCKED MESSAGE
                                    ================================================== */}

                                    {parameterLocked && (
                                        <motion.div
                                            initial={{
                                                opacity: 0,
                                                y: -5
                                            }}
                                            animate={{
                                                opacity: 1,
                                                y: 0
                                            }}
                                            className="
                                                mt-2
                                                flex
                                                items-center
                                                gap-2
                                                text-xs
                                                font-medium
                                                text-slate-700
                                                bg-slate-200/60
                                                px-3
                                                py-1.5
                                                rounded-lg
                                            "
                                        >
                                            <svg
                                                className="
                                                    w-4
                                                    h-4
                                                "
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                                />
                                            </svg>

                                            <span
                                                className="
                                                    font-medium
                                                "
                                            >
                                                This parameter is locked and
                                                cannot be modified during
                                                analysis
                                            </span>
                                        </motion.div>
                                    )}
                                </div>

                                {/* ==================================================
                                    ACTIONS
                                ================================================== */}

                                <div
                                    className="
                                        flex
                                        gap-2
                                        relative
                                        z-10
                                    "
                                >
                                    <button
                                        type="button"
                                        onClick={() =>
                                            onToggleParameter(parameter)
                                        }
                                        className="
                                            group
                                            relative
                                            inline-flex
                                            items-center
                                            gap-2
                                            px-3
                                            py-1.5
                                            rounded-md
                                            border
                                            text-xs
                                            font-semibold
                                            tracking-tight
                                            transition-all
                                            duration-200
                                            bg-emerald-50
                                            border-emerald-200
                                            text-emerald-800
                                            hover:bg-emerald-100
                                            shadow-sm
                                        "
                                    >
                                        <span
                                            className={`
                                                h-1.5
                                                w-1.5
                                                rounded-full
                                                ${
                                                    isExpanded
                                                        ? "bg-emerald-500 animate-pulse"
                                                        : "bg-emerald-500"
                                                }
                                            `}
                                        />

                                        <span>
                                            {isExpanded
                                                ? "CLICK TO HIDE"
                                                : "CLICK TO VIEW"}
                                        </span>

                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className={`
                                                h-3
                                                w-3
                                                transition-transform
                                                duration-200
                                                ${
                                                    isExpanded
                                                        ? "rotate-180"
                                                        : ""
                                                }
                                            `}
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                            strokeWidth={3}
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M19 9l-7 7-7-7"
                                            />
                                        </svg>
                                    </button>

                                    {/* ==================================================
                                        DELETE PARAMETER
                                        
                                        Delete is available for Reviewer when
                                        the PARAMETER itself is not locked.

                                        A worksheet being "Submitted For Analysis"
                                        does NOT hide this button if this particular
                                        parameter is newly CREATED.
                                    ================================================== */}

                                    {(
                                        role === "Reviewer" ||
                                        role === "reviewer"
                                    ) &&
                                        !parameterLocked && (
                                            <motion.button
                                                type="button"
                                                onClick={() =>
                                                    onDeleteParameter(
                                                        parameter
                                                    )
                                                }
                                                whileHover={{
                                                    scale: 1.1,
                                                    rotate: 10
                                                }}
                                                whileTap={{
                                                    scale: 0.9
                                                }}
                                                className="mx-2"
                                                title="Delete parameter"
                                            >
                                                <CgTrash
                                                    className="
                                                        w-5
                                                        h-5
                                                        text-red-500
                                                    "
                                                />
                                            </motion.button>
                                        )}
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default FoodParameterManager;