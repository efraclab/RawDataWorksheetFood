import React from "react";
import { motion } from "framer-motion";

export interface AnalysisLockSectionProps {
    status?: string | null;
    canUnlock?: boolean;
    canDelete?: boolean;
    onUnlock: () => void;
    onDelete: () => void;
    onStartAnalysis?: () => void;
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
    canUnlock = true,
    canDelete = true,
    onUnlock,
    onDelete,
    onStartAnalysis,
    compact = false
}) => {
    const normalizedStatus = normalizeStatus(status);

    const isAnalysisPending =
        normalizedStatus === "analysis pending";

    const isAnalysisStarted =
        normalizedStatus === "analysis started" ||
        normalizedStatus === "analysis in progress";

    if (!isAnalysisPending && !isAnalysisStarted) {
        return null;
    }

    /*
     * IMPORTANT:
     * canUnlock === true is the Reviewer view.
     * canUnlock === false is the Analyst view.
     *
     * Do not use "canUnlock" as the lock state itself. It is only the
     * permission to unlock a submitted parameter.
     */
    const isAnalyst = !canUnlock;

    /*
     * ANALYST: Analysis Pending / Ready to Start
     *
     * This is deliberately handled before the generic reviewer layout so
     * that an Analyst does not see "Awaiting Analysis" / "Why is this
     * locked?" after submission.
     */
    if (isAnalyst && isAnalysisPending) {
        if (compact) {
            return (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6 rounded-xl border border-emerald-100 shadow-sm bg-white overflow-hidden"
                >
                    <div className="px-5 py-3 bg-emerald-50 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3 min-w-0">
                            <div className="w-9 h-9 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
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
                            whileHover={onStartAnalysis ? { scale: 1.02 } : undefined}
                            whileTap={onStartAnalysis ? { scale: 0.98 } : undefined}
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
                className="mt-8 rounded-xl overflow-hidden border border-emerald-100 shadow-lg bg-white"
            >
                <div className="bg-gradient-to-r from-emerald-50 via-white to-emerald-50 px-6 py-4 border-b border-emerald-100">
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
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
                            whileHover={onStartAnalysis ? { scale: 1.02 } : undefined}
                            whileTap={onStartAnalysis ? { scale: 0.98 } : undefined}
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
                                    What happens when you start?
                                </h4>

                                <ul className="text-sm text-slate-600 space-y-1.5">
                                    <li>• You'll gain full access to edit all preparations and calculations</li>
                                    <li>• The parameter status will change to "Analysis Started"</li>
                                    <li>• You must complete the entire analysis - no pausing</li>
                                    <li>• Click "Complete Analysis" when you're done with all work</li>
                                </ul>
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
                                    d="M12 9v2m0 4h.01M5.07 19h13.86c1.54 0 2.5-1.67 1.73-3L13.73 4c-.77-1.33-2.69-1.33-3.46 0L3.34 16c-.77 1.33.19 3 1.73 3z"
                                />
                            </svg>

                            <p className="text-sm text-emerald-800">
                                <strong>Important:</strong> Once started, you cannot pause or go back.
                                Make sure you have all required materials and time to complete.
                            </p>
                        </div>
                    </div>
                </div>
            </motion.div>
        );
    }

    /*
     * ANALYST: Analysis Started
     *
     * Keep this as an informational state. The actual editing lock/unlock
     * must be controlled by the parent PreparationEngine/worksheet state.
     */
    if (isAnalyst && isAnalysisStarted) {
        if (compact) {
            return (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6 rounded-xl border border-emerald-100 shadow-sm bg-white overflow-hidden"
                >
                    <div className="px-5 py-3 bg-emerald-50 flex items-center gap-3">
                        <div className="w-9 h-9 bg-emerald-100 rounded-lg flex items-center justify-center">
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
                </motion.div>
            );
        }

        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8 rounded-xl overflow-hidden border border-emerald-100 shadow-lg bg-white"
            >
                <div className="px-6 py-4 bg-emerald-50 border-b border-emerald-100">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                            <svg
                                className="w-5 h-5 text-emerald-700"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm3.5 8.5h-3v3a.5.5 0 01-1 0v-3h-3a.5.5 0 010-1h3v-3a.5.5 0 011 0v3h3a.5.5 0 010 1z" />
                            </svg>
                        </div>

                        <div>
                            <h3 className="text-base font-bold text-slate-800">
                                Analysis In Progress
                            </h3>
                            <p className="text-sm text-slate-600">
                                You are currently working on this parameter.
                            </p>
                        </div>
                    </div>
                </div>
            </motion.div>
        );
    }

    /*
     * REVIEWER:
     * Existing lock/unlock behavior is preserved below.
     */
    if (compact) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 rounded-xl border border-slate-200 shadow-sm bg-white overflow-hidden"
            >
                <div className="px-5 py-3 bg-slate-50 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                        <div className="w-9 h-9 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
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
                                {isAnalysisStarted ? "Analysis In Progress" : "Awaiting Analysis"}
                            </h3>

                            <p className="text-xs text-slate-600">
                                Status: <span className="uppercase font-semibold">{status}</span>
                            </p>
                        </div>
                    </div>

                    {canUnlock && (
                        <motion.button
                            type="button"
                            onClick={onUnlock}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="px-4 py-2 bg-white border border-emerald-200 text-emerald-800 text-sm font-semibold rounded-lg hover:bg-emerald-50 transition-all flex items-center gap-2 shadow-sm"
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
            className="mt-8 rounded-xl overflow-hidden border border-slate-200 shadow-lg bg-white"
        >
            <div className="bg-gradient-to-r from-slate-50 via-gray-50 to-slate-50 px-6 py-4 border-b border-slate-200">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
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

                    {canUnlock && (
                        <motion.button
                            type="button"
                            onClick={onUnlock}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="px-4 py-2 bg-white/60 backdrop-blur-sm border border-emerald-200 text-emerald-800 text-sm font-semibold rounded-lg hover:bg-white/80 hover:border-emerald-300 transition-all flex items-center gap-2 shadow-sm"
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
                                    Why is this locked?
                                </h4>

                                <p className="text-sm text-slate-600">
                                    {isAnalysisStarted
                                        ? "This parameter is currently under active analysis. The analyst is working on it."
                                        : "This parameter has been submitted for analysis. To maintain data integrity, modifications are restricted."}
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
                                        d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                                    />
                                </svg>
                            </div>

                            <div className="flex-1">
                                <h4 className="font-semibold text-sm text-slate-800 mb-2">
                                    Unlock Available
                                </h4>

                                <p className="text-sm text-slate-600">
                                    You can unlock this parameter to make changes. Click{" "}
                                    <strong>"Unlock"</strong> to revert to draft status.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-4 bg-slate-100 border border-slate-200 rounded-xl p-4">
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
                                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                            />
                        </svg>

                        <div className="flex-1">
                            <p className="text-sm font-semibold text-slate-700 mb-2">
                                Available Actions:
                            </p>

                            <ul className="text-sm text-slate-600 space-y-1.5">
                                <li className="flex items-start gap-2">
                                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-1.5" />
                                    <span>
                                        <strong>Unlock:</strong> Revert to draft status for editing
                                    </span>
                                </li>

                                <li className="flex items-start gap-2">
                                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-1.5" />
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
};

export default AnalysisLockSection;
