import React from "react";
import { motion } from "framer-motion";

export interface AnalysisLockSectionProps {
    status?: string | null;
    role?: string;
    canUnlock?: boolean;
    canDelete?: boolean;
    onUnlock: () => void;
    onDelete: () => void;
    onStartAnalysis?: () => void;
    onCompleteAnalysis?: () => void;
    onStartRevision?: () => void;
    onApprove?: () => void;
    onRequestRevision?: () => void;
    analystComment?: string | null;
    reviewerComment?: string | null;
    analysisStartDate?: string | null;
    analysisCompletionDate?: string | null;
    revisionStartDate?: string | null;
    approvedAtReviewer?: string | null;
    compact?: boolean;
}

const normalizeStatus = (status?: string | null) =>
    (status ?? "")
        .trim()
        .toLowerCase()
        .replace(/_/g, " ")
        .replace(/-/g, " ");

const AnalysisLockSection: React.FC<AnalysisLockSectionProps> = ({
    status,
    role,
    canUnlock = true,
    canDelete = true,
    onUnlock,
    onDelete,
    onStartAnalysis,
    onCompleteAnalysis,
    onStartRevision,
    onApprove,
    onRequestRevision,
    analystComment,
    reviewerComment,
    analysisStartDate,
    analysisCompletionDate,
    revisionStartDate,
    approvedAtReviewer,
    compact = false,
}) => {
    const normalizedStatus = normalizeStatus(status);

    const isAnalysisPending =
        normalizedStatus === "analysis pending";

    const isAnalysisStarted =
        normalizedStatus === "analysis started" ||
        normalizedStatus === "analysis in progress";

    const isAnalysisCompleted =
        normalizedStatus === "analysis completed";

    const isApproved =
        normalizedStatus === "approved";

    /*
     * IMPORTANT:
     *
     * role determines Analyst / Reviewer.
     * canUnlock is only the permission to unlock.
     *
     * This keeps Reviewer + Analysis Completed readonly while still
     * allowing the Reviewer to Approve / Request Revision.
     */
    const normalizedRole = (role ?? "").trim().toLowerCase();
    const isAnalyst = normalizedRole === "analyst" || (!normalizedRole && !canUnlock);
    const isReviewer = normalizedRole === "reviewer" || (!normalizedRole && canUnlock);

    /*
     * Only these statuses are handled by this component.
     */
    const isAnalysisRevision =
        normalizedStatus === "analysis revision" ||
        normalizedStatus === "analysis revision started";

    if (
        !isAnalysisPending &&
        !isAnalysisStarted &&
        !isAnalysisCompleted &&
        !isApproved &&
        !isAnalysisRevision
    ) {
        return null;
    }

    /*
     * ============================================================
     * REVIEWER - REVISION IN PROGRESS
     * ============================================================
     *
     * There are intentionally TWO presentations for this state.
     *
     * Full view (compact=false):
     *   - Rendered before "Copy from Worksheet".
     *   - Contains the complete Current Status + Please wait information.
     *
     * Compact view (compact=true):
     *   - Rendered at the bottom of the worksheet.
     *   - Contains ONLY the Revision In Progress header and reviewer remark.
     *
     * Keeping these two branches separate prevents the Current Status /
     * Please wait block from appearing in the bottom section.
     */
    if (isReviewer && isAnalysisRevision) {
        const revisionComment =
            typeof reviewerComment === "string" && reviewerComment.trim()
                ? reviewerComment.trim()
                : "Revision requested by Reviewer";

        if (compact) {
            return (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6 rounded-xl overflow-hidden border border-emerald-100 shadow-lg bg-white"
                >
                    <div className="bg-gradient-to-r from-emerald-50 via-emerald-100 to-emerald-50 px-6 py-5 border-b border-emerald-100">
                        <div className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-4 min-w-0">
                                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                    <svg
                                        className="w-6 h-6 text-emerald-600"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M20 11a8 8 0 11-15.5-3M4 5v5h5M4 13a8 8 0 0015.5 3M20 19v-5h-5"
                                        />
                                    </svg>
                                </div>

                                <div className="min-w-0">
                                    <h3 className="text-lg font-bold text-slate-800">
                                        Revision In Progress
                                    </h3>
                                    <p className="text-sm text-slate-600 mt-0.5">
                                        Analyst is working on the requested revisions
                                    </p>
                                </div>
                            </div>

                            <div className="px-4 py-2 rounded-lg border border-emerald-300 bg-white/60 text-emerald-800 text-sm font-semibold whitespace-nowrap">
                                AWAITING REVISION
                            </div>
                        </div>
                    </div>

                    <div className="p-6 bg-emerald-50">
                        <div className="bg-white border border-emerald-200 rounded-xl p-5">
                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <svg
                                        className="w-5 h-5 text-emerald-600"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M8 10h8M8 14h5m7-2a8 8 0 11-16 0 8 8 0 0116 0z"
                                        />
                                    </svg>
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <h4 className="font-semibold text-sm text-slate-800">
                                            Revision Remarks Sent
                                        </h4>
                                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-xs font-semibold">
                                            from Reviewer (You)
                                        </span>
                                    </div>

                                    <p className="mt-2 text-sm italic text-slate-800 bg-emerald-50 border border-emerald-100 rounded-lg px-4 py-3">
                                        &ldquo;{revisionComment}&rdquo;
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            );
        }

        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8 mb-8 rounded-2xl overflow-hidden border border-emerald-100 shadow-lg bg-emerald-50"
            >
                <div className="bg-gradient-to-r from-emerald-50 via-emerald-100 to-emerald-50 px-6 py-5 border-b border-emerald-100">
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4 min-w-0">
                            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                <svg
                                    className="w-6 h-6 text-emerald-600"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M20 11a8 8 0 11-15.5-3M4 5v5h5M4 13a8 8 0 0015.5 3M20 19v-5h-5"
                                    />
                                </svg>
                            </div>

                            <div className="min-w-0">
                                <h3 className="text-lg font-bold text-slate-800">
                                    Revision In Progress — Requested by You
                                </h3>
                                <p className="text-sm text-slate-600 mt-0.5">
                                    Analyst is working on the requested revisions
                                </p>
                            </div>
                        </div>

                        <div className="px-4 py-2 rounded-lg border border-emerald-300 bg-white/60 text-emerald-800 text-sm font-semibold whitespace-nowrap">
                            AWAITING REVISION
                        </div>
                    </div>
                </div>

                <div className="p-6 space-y-4">
                    <div className="bg-white border border-emerald-200 rounded-xl p-5">
                        <div className="flex items-start gap-3">
                            <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center flex-shrink-0">
                                <svg
                                    className="w-5 h-5 text-emerald-600"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M8 10h8M8 14h5m7-2a8 8 0 11-16 0 8 8 0 0116 0z"
                                    />
                                </svg>
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                    <h4 className="font-semibold text-sm text-slate-800">
                                        Revision Remarks Sent
                                    </h4>
                                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-xs font-semibold">
                                        from Reviewer (You)
                                    </span>
                                </div>

                                <p className="mt-2 text-sm italic text-slate-800 bg-emerald-50 border border-emerald-100 rounded-lg px-4 py-3">
                                    &ldquo;{revisionComment}&rdquo;
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-xl p-5">
                        <div className="flex items-start gap-3">
                            <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center flex-shrink-0">
                                <svg
                                    className="w-5 h-5 text-emerald-600"
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
                            </div>

                            <div className="flex-1">
                                <h4 className="font-semibold text-sm text-slate-800 mb-2">
                                    Current Status
                                </h4>
                                <ul className="text-sm text-slate-600 space-y-2">
                                    <li className="flex items-start gap-2">
                                        <span className="text-emerald-500 mt-1">•</span>
                                        <span>You requested revisions on this parameter</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-emerald-500 mt-1">•</span>
                                        <span>The analyst is currently making the necessary changes</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-emerald-500 mt-1">•</span>
                                        <span>Once complete, it will be resubmitted for your review</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-emerald-500 mt-1">•</span>
                                        <span>You can view all parameter details below</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-100 border border-slate-200 rounded-xl p-4">
                        <div className="flex items-start gap-3">
                            <svg
                                className="w-5 h-5 text-slate-600 flex-shrink-0 mt-0.5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 8v4l2.5 2"
                                />
                                <circle cx="12" cy="12" r="9" strokeWidth={2} />
                            </svg>
                            <p className="text-sm text-slate-700">
                                <strong>Please wait:</strong> The parameter will return to &quot;Analysis Completed&quot; status once the analyst finishes the revisions.
                            </p>
                        </div>
                    </div>
                </div>
            </motion.div>
        );
    }

    /*
     * ============================================================
     * ANALYST - ANALYSIS PENDING
     * ============================================================
     *
     * Analyst cannot edit anything before starting analysis.
     * Analyst sees Start Analysis.
     */
    if (isAnalyst && isAnalysisPending) {
        if (compact) {
            return (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="
                        mt-6
                        rounded-xl
                        border
                        border-emerald-100
                        shadow-sm
                        bg-white
                        overflow-hidden
                    "
                >
                    <div
                        className="
                            px-5
                            py-3
                            bg-emerald-50
                            flex
                            items-center
                            justify-between
                            gap-4
                        "
                    >
                        <div className="flex items-center gap-3 min-w-0">

                            <div
                                className="
                                    w-9
                                    h-9
                                    bg-emerald-100
                                    rounded-lg
                                    flex
                                    items-center
                                    justify-center
                                    flex-shrink-0
                                "
                            >
                                <svg
                                    className="w-4 h-4 text-emerald-700"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <circle
                                        cx="12"
                                        cy="12"
                                        r="9"
                                        strokeWidth="2"
                                    />

                                    <path
                                        strokeLinecap="round"
                                        strokeWidth="2"
                                        d="M12 8v4l2.5 2"
                                    />
                                </svg>
                            </div>

                            <div className="min-w-0">
                                <h3 className="text-sm font-bold text-slate-800">
                                    Analysis Pending - Ready to Start
                                </h3>

                                <p className="text-xs text-slate-600">
                                    Click "Start Analysis" to begin working on this parameter
                                </p>
                            </div>
                        </div>

                        <motion.button
                            type="button"
                            onClick={onStartAnalysis}
                            disabled={!onStartAnalysis}
                            whileHover={
                                onStartAnalysis
                                    ? { scale: 1.02 }
                                    : undefined
                            }
                            whileTap={
                                onStartAnalysis
                                    ? { scale: 0.98 }
                                    : undefined
                            }
                            className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all flex items-center gap-2 shadow-sm ${
                                onStartAnalysis
                                    ? "bg-white border border-emerald-200 text-emerald-800 hover:bg-emerald-50"
                                    : "bg-slate-100 border border-slate-200 text-slate-400 cursor-not-allowed"
                            }`}
                        >
                            <svg
                                className="w-4 h-4"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <path d="M6 4.5a1 1 0 011.6-.8l7 5.5a1 1 0 010 1.6l-7 5.5A1 1 0 016 15.5v-11z" />
                            </svg>

                            Start Analysis
                        </motion.button>
                    </div>
                </motion.div>
            );
        }

        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="
                    mt-8
                    rounded-xl
                    overflow-hidden
                    border
                    border-emerald-100
                    shadow-lg
                    bg-white
                "
            >
                <div
                    className="
                        bg-gradient-to-r
                        from-emerald-50
                        via-white
                        to-emerald-50
                        px-6
                        py-4
                        border-b
                        border-emerald-100
                    "
                >
                    <div className="flex items-center justify-between gap-4">

                        <div className="flex items-center gap-3">

                            <div
                                className="
                                    w-10
                                    h-10
                                    bg-emerald-100
                                    rounded-lg
                                    flex
                                    items-center
                                    justify-center
                                "
                            >
                                <svg
                                    className="w-5 h-5 text-emerald-700"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <circle
                                        cx="12"
                                        cy="12"
                                        r="9"
                                        strokeWidth="2"
                                    />

                                    <path
                                        strokeLinecap="round"
                                        strokeWidth="2"
                                        d="M12 8v4l2.5 2"
                                    />
                                </svg>
                            </div>

                            <div>
                                <h3 className="text-base font-bold text-slate-800">
                                    Analysis Pending - Ready to Start
                                </h3>

                                <p className="text-sm text-slate-600">
                                    Click "Start Analysis" to begin working on this parameter
                                </p>
                            </div>

                        </div>

                        <motion.button
                            type="button"
                            onClick={onStartAnalysis}
                            disabled={!onStartAnalysis}
                            whileHover={
                                onStartAnalysis
                                    ? { scale: 1.02 }
                                    : undefined
                            }
                            whileTap={
                                onStartAnalysis
                                    ? { scale: 0.98 }
                                    : undefined
                            }
                            className={`px-5 py-2.5 font-semibold rounded-lg transition-all flex items-center gap-2 shadow-sm ${
                                onStartAnalysis
                                    ? "bg-white border border-emerald-200 text-emerald-800 hover:bg-emerald-50"
                                    : "bg-slate-100 border border-slate-200 text-slate-400 cursor-not-allowed"
                            }`}
                        >
                            <svg
                                className="w-4 h-4"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <path d="M6 4.5a1 1 0 011.6-.8l7 5.5a1 1 0 010 1.6l-7 5.5A1 1 0 016 15.5v-11z" />
                            </svg>

                            Start Analysis
                        </motion.button>

                    </div>
                </div>

                <div className="p-6 bg-emerald-50">

                    <div className="bg-white border border-slate-200 rounded-xl p-5">

                        <div className="flex items-start gap-3">

                            <div
                                className="
                                    w-10
                                    h-10
                                    bg-emerald-50
                                    rounded-lg
                                    flex
                                    items-center
                                    justify-center
                                    flex-shrink-0
                                "
                            >
                                <svg
                                    className="w-5 h-5 text-emerald-600"
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
                            </div>

                            <div className="flex-1">

                                <h4 className="font-semibold text-sm text-slate-800 mb-2">
                                    What happens when you start?
                                </h4>

                                <ul className="text-sm text-slate-600 space-y-1.5">

                                    <li>
                                        • You'll gain full access to edit all preparations and calculations
                                    </li>

                                    <li>
                                        • The parameter status will change to "Analysis Started"
                                    </li>

                                    <li>
                                        • You must complete the entire analysis - no pausing
                                    </li>

                                    <li>
                                        • Click "Complete Analysis" when you're done with all work
                                    </li>

                                </ul>

                            </div>

                        </div>

                    </div>

                    <div
                        className="
                            mt-4
                            bg-emerald-50
                            border
                            border-emerald-200
                            rounded-xl
                            p-4
                        "
                    >
                        <div className="flex items-start gap-3">

                            <svg
                                className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 9v2m0 4h.01M5.07 19h13.86c1.54 0 2.5-1.67 1.73-3L13.73 4c-.77-1.33-2.69-1.33-3.46 0L3.34 16c-.77 1.33.19 3 1.73 3z"
                                />
                            </svg>

                            <p className="text-sm text-emerald-800">
                                <strong>Important:</strong>{" "}
                                Once started, you cannot pause or go back.
                                Make sure you have all required materials and time to complete.
                            </p>

                        </div>
                    </div>

                </div>
            </motion.div>
        );
    }

    /*
     * ============================================================
     * ANALYST - ANALYSIS STARTED
     * ============================================================
     *
     * This is the large "Active Editing Mode" section.
     *
     * The actual editable state of preparations/calculations is
     * still controlled by FoodWorksheet / PreparationEngine.
     */
    if (isAnalyst && isAnalysisStarted) {
        if (compact) {
            return (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="
                        mt-6
                        rounded-xl
                        border
                        border-emerald-100
                        shadow-sm
                        bg-white
                        overflow-hidden
                    "
                >
                    <div
                        className="
                            px-5
                            py-3
                            bg-emerald-50
                            flex
                            items-center
                            justify-between
                            gap-4
                        "
                    >
                        <div className="flex items-center gap-3">

                            <div
                                className="
                                    w-9
                                    h-9
                                    bg-emerald-100
                                    rounded-lg
                                    flex
                                    items-center
                                    justify-center
                                "
                            >
                                <svg
                                    className="w-4 h-4 text-emerald-700"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                >
                                    <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm3.5 8.5h-3v3a.5.5 0 01-1 0v-3h-3a.5.5 0 010-1h3v-3a.5.5 0 011 0v3h3a.5.5 0 010 1z" />
                                </svg>
                            </div>

                            <div>
                                <h3 className="text-sm font-bold text-slate-800">
                                    Analysis In Progress
                                </h3>

                                <p className="text-xs text-slate-600">
                                    Status: ANALYSIS STARTED
                                </p>
                            </div>

                        </div>

                        <motion.button
                            type="button"
                            onClick={onCompleteAnalysis}
                            disabled={!onCompleteAnalysis}
                            whileHover={
                                onCompleteAnalysis
                                    ? { scale: 1.02 }
                                    : undefined
                            }
                            whileTap={
                                onCompleteAnalysis
                                    ? { scale: 0.98 }
                                    : undefined
                            }
                            className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all flex items-center gap-2 ${
                                onCompleteAnalysis
                                    ? "bg-white border border-emerald-200 text-emerald-800 hover:bg-emerald-50"
                                    : "bg-slate-100 border border-slate-200 text-slate-400 cursor-not-allowed"
                            }`}
                        >
                            Complete Analysis
                        </motion.button>

                    </div>
                </motion.div>
            );
        }

        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="
                    relative
                    mb-8
                    rounded-2xl
                    overflow-hidden
                    border
                    border-slate-200
                    shadow-lg
                    bg-white
                "
            >
                {/* Header */}
                <div
                    className="
                        bg-gradient-to-r
                        from-emerald-50
                        via-emerald-100
                        to-emerald-50
                        px-6
                        py-5
                        border-b
                        border-slate-200
                    "
                >
                    <div className="flex items-center justify-between">

                        <div className="flex items-center gap-4">

                            <div className="relative">

                                <div
                                    className="
                                        w-12
                                        h-12
                                        bg-emerald-100
                                        rounded-xl
                                        flex
                                        items-center
                                        justify-center
                                    "
                                >
                                    <svg
                                        className="
                                            w-6
                                            h-6
                                            text-emerald-600
                                            animate-pulse
                                        "
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </div>

                            </div>

                            <div>

                                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                    Analysis In Progress
                                </h3>

                                <p className="text-sm text-slate-600 mt-0.5">
                                    Work on your analysis and click complete when done
                                </p>

                            </div>

                        </div>

                        <motion.button
                            type="button"
                            onClick={onCompleteAnalysis}
                            disabled={!onCompleteAnalysis}
                            whileHover={
                                onCompleteAnalysis
                                    ? { scale: 1.02 }
                                    : undefined
                            }
                            whileTap={
                                onCompleteAnalysis
                                    ? { scale: 0.98 }
                                    : undefined
                            }
                            className={`px-5 py-2.5 text-sm font-semibold rounded-lg transition-all flex items-center gap-2 shadow-sm ${
                                onCompleteAnalysis
                                    ? "bg-white/60 backdrop-blur-sm border border-emerald-200 text-emerald-800 hover:bg-white/80 hover:border-emerald-300"
                                    : "bg-slate-100 border border-slate-200 text-slate-400 cursor-not-allowed"
                            }`}
                        >
                            <svg
                                className="w-5 h-5"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>

                            Complete Analysis
                        </motion.button>

                    </div>
                </div>

                {/* Active Editing Information */}
                <div className="p-6 bg-emerald-50">

                    <div className="grid grid-cols-1 gap-4">

                        <div
                            className="
                                bg-white
                                border
                                border-slate-200
                                rounded-xl
                                p-5
                            "
                        >

                            <div className="flex items-start gap-3">

                                <div
                                    className="
                                        w-10
                                        h-10
                                        bg-emerald-50
                                        rounded-lg
                                        flex
                                        items-center
                                        justify-center
                                        flex-shrink-0
                                    "
                                >
                                    <svg
                                        className="w-5 h-5 text-emerald-600"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                        />
                                    </svg>
                                </div>

                                <div className="flex-1">

                                    <h4 className="font-semibold text-sm text-slate-800 mb-2">
                                        Active Editing Mode
                                    </h4>

                                    <ul className="text-sm text-slate-600 space-y-2">

                                        <li className="flex items-start gap-2">
                                            <span className="text-emerald-500 mt-1">
                                                •
                                            </span>

                                            <span>
                                                You have full editing access to all
                                                preparations and calculations
                                            </span>
                                        </li>

                                        <li className="flex items-start gap-2">
                                            <span className="text-emerald-500 mt-1">
                                                •
                                            </span>

                                            <span>
                                                Scroll down to work on parameter
                                                details, preparations, and calculations
                                            </span>
                                        </li>

                                        <li className="flex items-start gap-2">
                                            <span className="text-emerald-500 mt-1">
                                                •
                                            </span>

                                            <span>
                                                Click <strong>"Save Draft"</strong>{" "}
                                                frequently to save your progress
                                            </span>
                                        </li>

                                        <li className="flex items-start gap-2">
                                            <span className="text-emerald-500 mt-1">
                                                •
                                            </span>

                                            <span>
                                                When all work is complete, click{" "}
                                                <strong>"Complete Analysis"</strong>{" "}
                                                above
                                            </span>
                                        </li>

                                    </ul>

                                </div>

                            </div>

                        </div>

                        <div
                            className="
                                bg-emerald-50
                                border
                                border-emerald-200
                                rounded-xl
                                p-4
                            "
                        >

                            <div className="flex items-start gap-3">

                                <svg
                                    className="
                                        w-5
                                        h-5
                                        text-emerald-600
                                        flex-shrink-0
                                        mt-0.5
                                    "
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>

                                <p className="text-sm text-emerald-800">
                                    <strong>Before Completing:</strong>{" "}
                                    Verify all preparations, calculations, and data
                                    are accurate. This will submit your work to
                                    Reviewer for approval.
                                </p>

                            </div>

                        </div>

                    </div>

                </div>

            </motion.div>
        );
    }

    /*
     * ============================================================
     * ANALYST - REVISION REQUESTED / REVISION IN PROGRESS
     * ============================================================
     *
     * Before Start Revision:
     *   - Everything remains readonly.
     *   - Show Start Revision.
     *
     * After Start Revision:
     *   - FoodWorksheet switches the preparation/calculation locks off.
     *   - Show Complete Revision.
     *
     * Full view is rendered before "Copy from Worksheet".
     * Compact view is rendered at the bottom of the worksheet.
     */
    if (isAnalyst && isAnalysisRevision) {
        const revisionStarted =
            normalizedStatus === "analysis revision started";

        const revisionComment =
            typeof reviewerComment === "string" && reviewerComment.trim()
                ? reviewerComment.trim()
                : "Revision requested by Reviewer";

        const action = revisionStarted ? onCompleteAnalysis : onStartRevision;
        const actionLabel = revisionStarted ? "Complete Revision" : "Start Revision";

        if (compact) {
            return (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6 rounded-xl overflow-hidden border border-emerald-100 shadow-lg bg-white"
                >
                    <div className="bg-gradient-to-r from-emerald-50 via-emerald-100 to-emerald-50 px-6 py-5 border-b border-emerald-100">
                        <div className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-4 min-w-0">
                                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                    <svg
                                        className="w-6 h-6 text-emerald-600"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M20 11a8 8 0 11-15.5-3M4 5v5h5M4 13a8 8 0 0015.5 3M20 19v-5h-5"
                                        />
                                    </svg>
                                </div>

                                <div className="min-w-0">
                                    <h3 className="text-lg font-bold text-slate-800">
                                        Revision Requested by Reviewer
                                    </h3>
                                    <p className="text-sm text-slate-600 mt-0.5">
                                        {revisionStarted
                                            ? "Revision in progress — make your changes and complete when done"
                                            : 'Reviewer has requested revisions. Click "Start Revision" to unlock editing'}
                                    </p>
                                </div>
                            </div>

                            <motion.button
                                type="button"
                                onClick={action}
                                disabled={!action}
                                whileHover={action ? { scale: 1.02 } : undefined}
                                whileTap={action ? { scale: 0.98 } : undefined}
                                className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all flex items-center gap-2 shadow-sm whitespace-nowrap ${
                                    action
                                        ? revisionStarted
                                            ? "bg-white border border-emerald-200 text-emerald-800 hover:bg-emerald-50"
                                            : "bg-orange-500 text-white border border-orange-500 hover:bg-orange-600"
                                        : "bg-slate-100 border border-slate-200 text-slate-400 cursor-not-allowed"
                                }`}
                            >
                                <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d={revisionStarted
                                            ? "M5 13l4 4L19 7"
                                            : "M11 5h2v6h6v2h-6v6h-2v-6H5v-2h6V5z"}
                                    />
                                </svg>
                                {actionLabel}
                            </motion.button>
                        </div>
                    </div>

                    <div className="p-5 bg-slate-50">
                        <div className="bg-white border border-slate-200 rounded-xl p-4">
                            <div className="flex items-start gap-3">
                                <div className="w-9 h-9 bg-orange-50 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <svg
                                        className="w-5 h-5 text-orange-500"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M8 10h8M8 14h5m7-2a8 8 0 11-16 0 8 8 0 0116 0z"
                                        />
                                    </svg>
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <h4 className="font-semibold text-sm text-slate-800">
                                            Reviewer Remarks
                                        </h4>
                                        <span className="px-2 py-0.5 rounded-full bg-orange-100 text-orange-700 text-xs font-semibold">
                                            from Reviewer
                                        </span>
                                    </div>

                                    <p className="mt-2 text-sm italic text-slate-800 bg-orange-50 border border-orange-100 rounded-lg px-4 py-3">
                                        &ldquo;{revisionComment}&rdquo;
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            );
        }

        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8 mb-8 rounded-2xl overflow-hidden border border-orange-100 shadow-lg bg-orange-50"
            >
                <div className="bg-gradient-to-r from-orange-50 via-orange-100 to-orange-50 px-6 py-5 border-b border-orange-100">
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4 min-w-0">
                            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                <svg
                                    className="w-6 h-6 text-orange-500"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M20 11a8 8 0 11-15.5-3M4 5v5h5M4 13a8 8 0 0015.5 3M20 19v-5h-5"
                                    />
                                </svg>
                            </div>

                            <div className="min-w-0">
                                <h3 className="text-lg font-bold text-slate-800">
                                    Revision Requested by Reviewer
                                </h3>
                                <p className="text-sm text-slate-600 mt-0.5">
                                    {revisionStarted
                                        ? "Revision in progress — make your changes and click \"Complete Revision\" when done"
                                        : 'Reviewer has requested revisions. Click "Start Revision" to unlock editing'}
                                </p>
                            </div>
                        </div>

                        <motion.button
                            type="button"
                            onClick={action}
                            disabled={!action}
                            whileHover={action ? { scale: 1.02 } : undefined}
                            whileTap={action ? { scale: 0.98 } : undefined}
                            className={`px-5 py-2.5 text-sm font-semibold rounded-lg transition-all flex items-center gap-2 shadow-sm whitespace-nowrap ${
                                action
                                    ? revisionStarted
                                        ? "bg-white border border-emerald-200 text-emerald-800 hover:bg-emerald-50"
                                        : "bg-orange-500 text-white border border-orange-500 hover:bg-orange-600"
                                    : "bg-slate-100 border border-slate-200 text-slate-400 cursor-not-allowed"
                            }`}
                        >
                            <svg
                                className="w-4 h-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d={revisionStarted
                                        ? "M5 13l4 4L19 7"
                                        : "M11 5h2v6h6v2h-6v6h-2v-6H5v-2h6V5z"}
                                />
                            </svg>
                            {actionLabel}
                        </motion.button>
                    </div>
                </div>

                <div className="p-6 space-y-4">
                    <div className="bg-white border border-orange-200 rounded-xl p-5">
                        <div className="flex items-start gap-3">
                            <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center flex-shrink-0">
                                <svg
                                    className="w-5 h-5 text-orange-500"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M8 10h8M8 14h5m7-2a8 8 0 11-16 0 8 8 0 0116 0z"
                                    />
                                </svg>
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                    <h4 className="font-semibold text-sm text-slate-800">
                                        Revision Remarks
                                    </h4>
                                    <span className="px-2 py-0.5 rounded-full bg-orange-100 text-orange-700 text-xs font-semibold">
                                        from Reviewer
                                    </span>
                                </div>

                                <p className="mt-2 text-sm italic text-slate-800 bg-orange-50 border border-orange-100 rounded-lg px-4 py-3">
                                    &ldquo;{revisionComment}&rdquo;
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-xl p-5">
                        <div className="flex items-start gap-3">
                            <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center flex-shrink-0">
                                <svg
                                    className="w-5 h-5 text-emerald-600"
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
                            </div>

                            <div className="flex-1">
                                <h4 className="font-semibold text-sm text-slate-800 mb-2">
                                    Revision Mode
                                </h4>
                                <ul className="text-sm text-slate-600 space-y-2">
                                    <li className="flex items-start gap-2">
                                        <span className="text-emerald-500 mt-1">•</span>
                                        <span>Review the Reviewer&apos;s feedback above carefully</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-emerald-500 mt-1">•</span>
                                        <span>
                                            {revisionStarted
                                                ? "You have full editing access to all preparations and calculations"
                                                : 'Click "Start Revision" to unlock the parameter for editing'}
                                        </span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-emerald-500 mt-1">•</span>
                                        <span>
                                            {revisionStarted
                                                ? 'Click "Complete Revision" when all changes are done'
                                                : 'Your parameter remains locked until revision is started'}
                                        </span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
                        <div className="flex items-start gap-3">
                            <svg
                                className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 9v2m0 4h.01M5.07 19h13.86c1.54 0 2.5-1.67 1.73-3L13.73 4c-.77-1.33-2.69-1.33-3.46 0L3.34 16c-.77 1.33.19 1.73 1.73 1.73z"
                                />
                            </svg>
                            <p className="text-sm text-orange-800">
                                <strong>Tip:</strong>{" "}
                                Carefully review all sections to ensure accuracy before resubmitting. Your work will be sent back to Reviewer for re-approval.
                            </p>
                        </div>
                    </div>
                </div>
            </motion.div>
        );
    }

    /*
     * ============================================================
     * ANALYST - PARAMETER APPROVED
     * ============================================================
     *
     * After Reviewer approval the Analyst has view-only access.
     * Full presentation is shown before Copy from Worksheet.
     * Compact presentation is shown at the bottom.
     */
    if (isAnalyst && isApproved) {
        const reviewerRemark =
            typeof reviewerComment === "string" && reviewerComment.trim()
                ? reviewerComment.trim()
                : "Completed";

        if (compact) {
            return (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6 rounded-xl overflow-hidden border border-emerald-100 shadow-sm bg-white"
                >
                    <div className="px-5 py-4 bg-emerald-50 flex items-center gap-3">
                        <div className="w-9 h-9 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <svg className="w-5 h-5 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="min-w-0">
                            <h3 className="text-sm font-bold text-slate-800">
                                Parameter Approved - Well Done!
                            </h3>
                            <p className="text-xs text-slate-600">
                                Your analysis has been reviewed and approved by Reviewer
                            </p>
                        </div>
                    </div>
                </motion.div>
            );
        }

        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative mb-8 rounded-2xl overflow-hidden border border-slate-200 shadow-lg bg-white"
            >
                <div className="bg-gradient-to-r from-emerald-50 via-emerald-100 to-emerald-50 px-6 py-5 border-b border-slate-200">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                            <svg className="w-6 h-6 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-slate-800">Parameter Approved - Well Done!</h3>
                            <p className="text-sm text-slate-600 mt-0.5">Your analysis has been reviewed and approved by Reviewer</p>
                        </div>
                    </div>
                </div>

                <div className="p-6 bg-emerald-50">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-white border border-slate-200 rounded-xl p-5">
                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-semibold text-sm text-slate-800 mb-1">Status: Approved</h4>
                                    <p className="text-sm text-slate-600">This parameter has been finalized and approved. All data is now locked.</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white border border-slate-200 rounded-xl p-5">
                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-semibold text-sm text-slate-800 mb-1">View Only Access</h4>
                                    <p className="text-sm text-slate-600">You can view all parameter details, preparations, and calculations below, but cannot make any changes.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-4 bg-blue-50 border border-blue-200 rounded-xl p-4">
                        <div className="flex items-start gap-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h8M8 14h5m-1-9h-1a9 9 0 100 18h1a9 9 0 100-18z" />
                                </svg>
                            </div>
                            <div className="flex-1">
                                <h4 className="font-semibold text-sm text-slate-800 mb-2">Reviewer Remarks</h4>
                                <p className="text-sm italic text-slate-700 bg-blue-100/60 rounded-lg p-3">“{reviewerRemark}”</p>
                            </div>
                        </div>
                    </div>

                    {typeof analystComment === "string" && analystComment.trim() && (
                        <div className="mt-4 bg-white border border-slate-200 rounded-xl p-4">
                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <svg className="w-5 h-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h8M8 14h5m-1-9h-1a9 9 0 100 18h1a9 9 0 100-18z" />
                                    </svg>
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-semibold text-sm text-slate-800 mb-2">Analyst Comment</h4>
                                    <p className="text-sm italic text-slate-700 bg-slate-50 rounded-lg p-3">“{analystComment.trim()}”</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </motion.div>
        );
    }

    /*
     * ============================================================
     * ANALYST - ANALYSIS COMPLETED
     * ============================================================
     *
     * No action button.
     * FoodWorksheet should also use "analysis completed" to disable
     * all preparations/calculations/controls.
     */
    if (isAnalyst && isAnalysisCompleted) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="
                    relative
                    mb-8
                    rounded-2xl
                    overflow-hidden
                    border
                    border-slate-200
                    shadow-lg
                    bg-white
                "
            >
                <div
                    className="
                        bg-gradient-to-r
                        from-emerald-50
                        via-emerald-100
                        to-emerald-50
                        px-6
                        py-5
                        border-b
                        border-slate-200
                    "
                >
                    <div className="flex items-center gap-4">

                        <div
                            className="
                                w-12
                                h-12
                                bg-emerald-100
                                rounded-xl
                                flex
                                items-center
                                justify-center
                            "
                        >
                            <svg
                                className="w-6 h-6 text-emerald-600"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </div>

                        <div>
                            <h3 className="text-lg font-bold text-slate-800">
                                Analysis Completed
                            </h3>

                            <p className="text-sm text-slate-600 mt-0.5">
                                Your work has been submitted and is under review
                            </p>
                        </div>

                    </div>
                </div>

                <div className="p-6 bg-emerald-50">

                    <div
                        className="
                            bg-white
                            border
                            border-slate-200
                            rounded-xl
                            p-5
                        "
                    >

                        <div className="flex items-start gap-3">

                            <div
                                className="
                                    w-10
                                    h-10
                                    bg-emerald-50
                                    rounded-lg
                                    flex
                                    items-center
                                    justify-center
                                    flex-shrink-0
                                "
                            >
                                <svg
                                    className="w-5 h-5 text-emerald-600"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                            </div>

                            <div className="flex-1">

                                <h4 className="font-semibold text-sm text-slate-800 mb-2">
                                    What's Next?
                                </h4>

                                <ul className="text-sm text-slate-600 space-y-2">

                                    <li className="flex items-start gap-2">
                                        <span className="text-emerald-500 mt-1">
                                            •
                                        </span>

                                        <span>
                                            Reviewer is currently reviewing your analysis
                                        </span>
                                    </li>

                                    <li className="flex items-start gap-2">
                                        <span className="text-emerald-500 mt-1">
                                            •
                                        </span>

                                        <span>
                                            If approved, the parameter will be finalized
                                        </span>
                                    </li>

                                    <li className="flex items-start gap-2">
                                        <span className="text-emerald-500 mt-1">
                                            •
                                        </span>

                                        <span>
                                            If revisions are needed, you'll regain editing access
                                        </span>
                                    </li>

                                    <li className="flex items-start gap-2">
                                        <span className="text-emerald-500 mt-1">
                                            •
                                        </span>

                                        <span>
                                            You can view all parameter details below while waiting
                                        </span>
                                    </li>

                                </ul>

                            </div>

                        </div>

                    </div>

                    <div
                        className="
                            mt-4
                            bg-slate-100
                            border
                            border-slate-200
                            rounded-xl
                            p-4
                        "
                    >

                        <div className="flex items-start gap-3">

                            <svg
                                className="
                                    w-5
                                    h-5
                                    text-slate-600
                                    flex-shrink-0
                                    mt-0.5
                                "
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                />
                            </svg>

                            <p className="text-sm text-slate-700">
                                <strong>Status:</strong>{" "}
                                Your analysis is locked for review.
                                No edits can be made until Reviewer provides feedback.
                            </p>

                        </div>

                    </div>

                </div>
            </motion.div>
        );
    }

    /*
     * ============================================================
     * REVIEWER
     * ============================================================
     *
     * Reviewer + Analysis Pending:
     *      Unlock available
     *
     * Reviewer + Analysis Started:
     *      Completely readonly
     *      NO Unlock
     *
     * Reviewer + Analysis Completed:
     *      Unlock available
     */
    /*
     * ============================================================
     * REVIEWER - ANALYSIS COMPLETED
     * ============================================================
     *
     * Reviewer must review the completed analysis instead of
     * unlocking it. Approve / Request Revision callbacks are
     * owned by FoodWorksheet (business logic stays there).
     */
    if (isReviewer && isAnalysisCompleted) {
        if (compact) {
            return (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="
                        mt-6
                        rounded-xl
                        overflow-hidden
                        border
                        border-slate-200
                        shadow-sm
                        bg-white
                    "
                >
                    <div
                        className="
                            px-5
                            py-3
                            bg-emerald-50
                            flex
                            items-center
                            justify-between
                            gap-4
                        "
                    >
                        <div className="flex items-center gap-3 min-w-0">
                            <div
                                className="
                                    w-9
                                    h-9
                                    bg-emerald-100
                                    rounded-lg
                                    flex
                                    items-center
                                    justify-center
                                    flex-shrink-0
                                "
                            >
                                <svg
                                    className="w-4 h-4 text-emerald-600"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </div>

                            <div className="min-w-0">
                                <h3 className="text-sm font-bold text-slate-800">
                                    Analysis Completed
                                </h3>
                                <p className="text-xs text-slate-600">
                                    Review the analysis and approve or request revisions
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-2 flex-shrink-0">
                            <motion.button
                                type="button"
                                onClick={onApprove}
                                disabled={!onApprove}
                                whileHover={onApprove ? { scale: 1.02 } : undefined}
                                whileTap={onApprove ? { scale: 0.98 } : undefined}
                                className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all flex items-center gap-2 ${
                                    onApprove
                                        ? "bg-white border border-emerald-200 text-emerald-800 hover:bg-emerald-50"
                                        : "bg-slate-100 border border-slate-200 text-slate-400 cursor-not-allowed"
                                }`}
                            >
                                <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 000 0"
                                    />
                                </svg>
                                Approve
                            </motion.button>

                            <motion.button
                                type="button"
                                onClick={onRequestRevision}
                                disabled={!onRequestRevision}
                                whileHover={
                                    onRequestRevision ? { scale: 1.02 } : undefined
                                }
                                whileTap={
                                    onRequestRevision ? { scale: 0.98 } : undefined
                                }
                                className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all flex items-center gap-2 ${
                                    onRequestRevision
                                        ? "bg-white border border-emerald-200 text-emerald-800 hover:bg-emerald-50"
                                        : "bg-slate-100 border border-slate-200 text-slate-400 cursor-not-allowed"
                                }`}
                            >
                                <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                    />
                                </svg>
                                Request Revision
                            </motion.button>
                        </div>
                    </div>
                </motion.div>
            );
        }

        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="
                    relative
                    mb-8
                    rounded-2xl
                    overflow-hidden
                    border
                    border-slate-200
                    shadow-lg
                    bg-white
                "
            >
                <div
                    className="
                        bg-gradient-to-r
                        from-emerald-50
                        via-emerald-100
                        to-emerald-50
                        px-6
                        py-5
                        border-b
                        border-slate-200
                    "
                >
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                                <svg
                                    className="w-6 h-6 text-emerald-600"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </div>

                            <div>
                                <h3 className="text-lg font-bold text-slate-800">
                                    Analysis Completed
                                </h3>
                                <p className="text-sm text-slate-600 mt-0.5">
                                    Review the analysis and approve or request revisions
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <motion.button
                                type="button"
                                onClick={onApprove}
                                disabled={!onApprove}
                                whileHover={onApprove ? { scale: 1.02 } : undefined}
                                whileTap={onApprove ? { scale: 0.98 } : undefined}
                                className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all flex items-center gap-2 shadow-sm ${
                                    onApprove
                                        ? "bg-white/60 backdrop-blur-sm border border-emerald-200 text-emerald-800 hover:bg-white/80 hover:border-emerald-300"
                                        : "bg-slate-100 border border-slate-200 text-slate-400 cursor-not-allowed"
                                }`}
                            >
                                <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 12l2 2 4-4m6 2a9 9 0 01-18 0 9 9 0 0118 0"
                                    />
                                </svg>
                                Approve
                            </motion.button>

                            <motion.button
                                type="button"
                                onClick={onRequestRevision}
                                disabled={!onRequestRevision}
                                whileHover={
                                    onRequestRevision ? { scale: 1.02 } : undefined
                                }
                                whileTap={
                                    onRequestRevision ? { scale: 0.98 } : undefined
                                }
                                className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all flex items-center gap-2 shadow-sm ${
                                    onRequestRevision
                                        ? "bg-white/60 backdrop-blur-sm border border-emerald-200 text-emerald-800 hover:bg-white/80 hover:border-emerald-300"
                                        : "bg-slate-100 border border-slate-200 text-slate-400 cursor-not-allowed"
                                }`}
                            >
                                <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                    />
                                </svg>
                                Request Revision
                            </motion.button>
                        </div>
                    </div>
                </div>

                <div className="p-6 bg-emerald-50">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-white border border-slate-200 rounded-xl p-5">
                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <svg
                                        className="w-5 h-5 text-emerald-600"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0"
                                        />
                                    </svg>
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-semibold text-sm text-slate-800 mb-2">
                                        Review Actions Available
                                    </h4>
                                    <p className="text-sm text-slate-600">
                                        <strong>Approve:</strong> If all data is accurate and complete, approve to finalize the parameter.
                                        <br />
                                        <br />
                                        <strong>Request Revision:</strong> If changes are needed, send it back to the analyst with feedback.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white border border-slate-200 rounded-xl p-5">
                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <svg
                                        className="w-5 h-5 text-emerald-600"
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
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-semibold text-sm text-slate-800 mb-2">
                                        Review Guidelines
                                    </h4>
                                    <p className="text-sm text-slate-600">
                                        Carefully review all preparations, calculations, and data. Scroll through the parameter details below to verify accuracy.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-4 bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                        <div className="flex items-start gap-3">
                            <svg
                                className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7z"
                                />
                            </svg>
                            <p className="text-sm text-emerald-800">
                                <strong>Reminder:</strong> Your decision will be final. Approved parameters cannot be edited. Parameters sent for revision will return to the analyst.
                            </p>
                        </div>
                    </div>

                    {typeof analystComment === "string" && analystComment.trim() && (
                        <div className="mt-4 bg-gray-50 border border-gray-200 rounded-xl p-4">
                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <svg
                                        className="w-4 h-4 text-gray-500"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14v8a2 2 0 01-2 2h-3l-4 4z"
                                        />
                                    </svg>
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-xs font-semibold text-gray-700 mb-1">
                                        Analyst Comment
                                    </h4>
                                    <p className="text-sm italic text-gray-800 bg-gray-100 rounded-lg px-3 py-2 border border-gray-200">
                                        &ldquo;{analystComment}&rdquo;
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </motion.div>
        );
    }

    /*
     * ============================================================
     * REVIEWER
     * ============================================================
     *
     * Reviewer + Analysis Pending:
     *      Unlock available
     *
     * Reviewer + Analysis Started:
     *      Completely readonly
     *      NO Unlock
     *
     * Reviewer + Analysis Completed:
     *      Review actions available (no Unlock)
     */
    if (isReviewer) {
        const reviewerCanUnlock =
            isAnalysisPending;

        if (compact) {
            return (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="
                        mt-6
                        rounded-xl
                        border
                        border-slate-200
                        shadow-sm
                        bg-white
                        overflow-hidden
                    "
                >
                    <div
                        className="
                            px-5
                            py-3
                            bg-slate-50
                            flex
                            items-center
                            justify-between
                            gap-4
                        "
                    >

                        <div className="flex items-center gap-3 min-w-0">

                            <div
                                className="
                                    w-9
                                    h-9
                                    bg-slate-100
                                    rounded-lg
                                    flex
                                    items-center
                                    justify-center
                                    flex-shrink-0
                                "
                            >
                                <svg
                                    className="w-4 h-4 text-slate-600"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </div>

                            <div className="min-w-0">

                                <h3 className="text-sm font-bold text-slate-800">
                                    {isAnalysisStarted
                                        ? "Analysis In Progress"
                                        : isAnalysisCompleted
                                            ? "Analysis Completed"
                                            : "Awaiting Analysis"}
                                </h3>

                                <p className="text-xs text-slate-600">
                                    Status:{" "}
                                    <span className="uppercase font-semibold">
                                        {status}
                                    </span>
                                </p>

                            </div>

                        </div>

                        {reviewerCanUnlock && (
                            <motion.button
                                type="button"
                                onClick={onUnlock}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="
                                    px-4
                                    py-2
                                    bg-white
                                    border
                                    border-emerald-200
                                    text-emerald-800
                                    text-sm
                                    font-semibold
                                    rounded-lg
                                    hover:bg-emerald-50
                                    transition-all
                                    flex
                                    items-center
                                    gap-2
                                    shadow-sm
                                "
                            >
                                <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"
                                    />
                                </svg>

                                Unlock
                            </motion.button>
                        )}

                    </div>
                </motion.div>
            );
        }

        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="
                    mt-8
                    rounded-xl
                    overflow-hidden
                    border
                    border-slate-200
                    shadow-lg
                    bg-white
                "
            >

                <div
                    className="
                        bg-gradient-to-r
                        from-slate-50
                        via-gray-50
                        to-slate-50
                        px-6
                        py-4
                        border-b
                        border-slate-200
                    "
                >

                    <div className="flex items-center justify-between">

                        <div className="flex items-center gap-3">

                            <div
                                className="
                                    w-10
                                    h-10
                                    bg-slate-100
                                    rounded-lg
                                    flex
                                    items-center
                                    justify-center
                                "
                            >
                                <svg
                                    className="w-5 h-5 text-slate-600"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </div>

                            <div>

                                <h3 className="text-sm font-bold text-slate-800">
                                    {isAnalysisStarted
                                        ? "Analysis In Progress"
                                        : isAnalysisCompleted
                                            ? "Analysis Completed"
                                            : "Awaiting Analysis"}
                                </h3>

                                <p className="text-xs text-slate-600">
                                    Status:{" "}
                                    <span className="uppercase font-semibold">
                                        {status}
                                    </span>
                                </p>

                            </div>

                        </div>

                        {reviewerCanUnlock && (
                            <motion.button
                                type="button"
                                onClick={onUnlock}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="
                                    px-4
                                    py-2
                                    bg-white/60
                                    backdrop-blur-sm
                                    border
                                    border-emerald-200
                                    text-emerald-800
                                    text-sm
                                    font-semibold
                                    rounded-lg
                                    hover:bg-white/80
                                    hover:border-emerald-300
                                    transition-all
                                    flex
                                    items-center
                                    gap-2
                                    shadow-sm
                                "
                            >
                                <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"
                                    />
                                </svg>

                                Unlock
                            </motion.button>
                        )}

                    </div>
                </div>

                <div className="p-6 bg-emerald-50">

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                        <div
                            className="
                                bg-white
                                border
                                border-slate-200
                                rounded-xl
                                p-5
                            "
                        >

                            <div className="flex items-start gap-3">

                                <div
                                    className="
                                        w-10
                                        h-10
                                        bg-emerald-50
                                        rounded-lg
                                        flex
                                        items-center
                                        justify-center
                                        flex-shrink-0
                                    "
                                >
                                    <svg
                                        className="w-5 h-5 text-emerald-600"
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
                                </div>

                                <div className="flex-1">

                                    <h4 className="font-semibold text-sm text-slate-800 mb-2">
                                        Why is this locked?
                                    </h4>

                                    <p className="text-sm text-slate-600">
                                        {isAnalysisStarted
                                            ? "This parameter is currently under active analysis. The analyst is working on it."
                                            : isAnalysisCompleted
                                                ? "This parameter has completed analysis and is currently under review."
                                                : "This parameter has been submitted for analysis. To maintain data integrity, modifications are restricted."}
                                    </p>

                                </div>

                            </div>

                        </div>

                        <div
                            className="
                                bg-white
                                border
                                border-slate-200
                                rounded-xl
                                p-5
                            "
                        >

                            <div className="flex items-start gap-3">

                                <div
                                    className="
                                        w-10
                                        h-10
                                        bg-emerald-50
                                        rounded-lg
                                        flex
                                        items-center
                                        justify-center
                                        flex-shrink-0
                                    "
                                >
                                    <svg
                                        className="w-5 h-5 text-emerald-600"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                                        />
                                    </svg>
                                </div>

                                <div className="flex-1">

                                    <h4 className="font-semibold text-sm text-slate-800 mb-2">
                                        {reviewerCanUnlock
                                            ? "Unlock Available"
                                            : "Parameter Locked"}
                                    </h4>

                                    <p className="text-sm text-slate-600">

                                        {isAnalysisStarted
                                            ? "The analyst is currently working on this parameter. You cannot make changes while analysis is in progress."
                                            : isAnalysisCompleted
                                                ? "You can unlock this parameter to make changes and revert it to draft status."
                                                : "You can unlock this parameter to make changes. Click \"Unlock\" to revert to draft status."}

                                    </p>

                                </div>

                            </div>

                        </div>

                    </div>

                    <div
                        className="
                            mt-4
                            bg-slate-100
                            border
                            border-slate-200
                            rounded-xl
                            p-4
                        "
                    >

                        <div className="flex items-start gap-3">

                            <svg
                                className="
                                    w-5
                                    h-5
                                    text-slate-600
                                    flex-shrink-0
                                    mt-0.5
                                "
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                />
                            </svg>

                            <div className="flex-1">

                                <p className="text-sm font-semibold text-slate-700 mb-2">
                                    Available Actions:
                                </p>

                                <ul className="text-sm text-slate-600 space-y-1.5">

                                    {reviewerCanUnlock && (
                                        <li className="flex items-start gap-2">

                                            <span
                                                className="
                                                    w-1.5
                                                    h-1.5
                                                    bg-emerald-500
                                                    rounded-full
                                                    mt-1.5
                                                "
                                            />

                                            <span>
                                                <strong>Unlock:</strong>{" "}
                                                Revert to draft status for editing
                                            </span>

                                        </li>
                                    )}

                                    {!reviewerCanUnlock && (
                                        <li className="flex items-start gap-2">

                                            <span
                                                className="
                                                    w-1.5
                                                    h-1.5
                                                    bg-slate-400
                                                    rounded-full
                                                    mt-1.5
                                                "
                                            />

                                            <span>
                                                <strong>Readonly:</strong>{" "}
                                                No modifications are allowed while analysis is in progress.
                                            </span>

                                        </li>
                                    )}

                                    <li className="flex items-start gap-2">

                                        <span
                                            className="
                                                w-1.5
                                                h-1.5
                                                bg-emerald-500
                                                rounded-full
                                                mt-1.5
                                            "
                                        />

                                        <span>
                                            View details below
                                        </span>

                                    </li>

                                </ul>

                            </div>

                        </div>

                    </div>

                </div>

            </motion.div>
        );
    }

    return null;
};

export default AnalysisLockSection;
