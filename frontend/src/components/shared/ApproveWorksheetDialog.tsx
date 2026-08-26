import React from "react";
import { AnimatePresence, motion } from "framer-motion";

interface ApproveWorksheetDialogProps {
    isOpen: boolean;
    isApproving?: boolean;
    worksheetId: number | string;
    totalParameters: number;
    approvedParameters: number;
    approvalDateTime: string;
    onApprovalDateTimeChange: (value: string) => void;
    onClose: () => void;
    onConfirm: () => void;
}

const ApproveWorksheetDialog: React.FC<ApproveWorksheetDialogProps> = ({
    isOpen,
    isApproving = false,
    worksheetId,
    totalParameters,
    approvedParameters,
    approvalDateTime,
    onApprovalDateTimeChange,
    onClose,
    onConfirm,
}) => {
    if (!isOpen) return null;

    const allApproved = totalParameters > 0 && approvedParameters === totalParameters;

    return (
        <AnimatePresence>
            <motion.div
                className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/65 backdrop-blur-sm p-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onMouseDown={(event) => {
                    if (event.target === event.currentTarget && !isApproving) {
                        onClose();
                    }
                }}
            >
                <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 20, scale: 0.98 }}
                    transition={{ duration: 0.2 }}
                    className="w-full max-w-md overflow-hidden rounded-xl bg-white shadow-2xl border border-slate-200"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="approve-worksheet-title"
                >
                    {/* Header */}
                    <div className="bg-gradient-to-r from-emerald-600 to-slate-800 px-5 py-4 text-white">
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-lg bg-white/15 flex items-center justify-center">
                                    <svg
                                        className="w-5 h-5"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <circle cx="12" cy="12" r="9" strokeWidth={2} />
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M8.5 12.5l2.2 2.2 4.8-5"
                                        />
                                    </svg>
                                </div>
                                <div>
                                    <h2 id="approve-worksheet-title" className="text-base font-bold">
                                        Approve Worksheet
                                    </h2>
                                    <p className="text-xs text-emerald-50">
                                        Finalize all analysis work
                                    </p>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={onClose}
                                disabled={isApproving}
                                className="w-7 h-7 rounded-md bg-white/10 hover:bg-white/20 disabled:opacity-40 flex items-center justify-center transition-colors"
                                aria-label="Close"
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
                                        d="M6 6l12 12M18 6L6 18"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>

                    <div className="p-4 space-y-3">
                        {/* Worksheet summary */}
                        <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5">
                            <div className="grid grid-cols-1 gap-0 divide-y divide-slate-200">
                                <div className="flex items-center justify-between py-2 first:pt-0">
                                    <span className="text-xs font-semibold text-slate-500">Worksheet ID</span>
                                    <span className="text-xs font-bold text-slate-700">{worksheetId}</span>
                                </div>
                                <div className="flex items-center justify-between py-2">
                                    <span className="text-xs font-semibold text-slate-500">Total Parameters</span>
                                    <span className="text-xs font-bold text-slate-700">{totalParameters}</span>
                                </div>
                                <div className="flex items-center justify-between py-2 last:pb-0">
                                    <span className="text-xs font-semibold text-slate-500">Approved Parameters</span>
                                    <span className="inline-flex items-center gap-1 rounded-md bg-emerald-100 border border-emerald-300 px-2 py-1 text-xs font-bold text-emerald-700">
                                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <circle cx="12" cy="12" r="9" strokeWidth={2} />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.5 12.5l2.2 2.2 4.8-5" />
                                        </svg>
                                        {approvedParameters} / {totalParameters}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Approval readiness */}
                        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2.5">
                            <div className="flex items-start gap-2.5">
                                <div className="mt-0.5 w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0">
                                    <svg className="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <circle cx="12" cy="12" r="9" strokeWidth={2} />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.5 12.5l2.2 2.2 4.8-5" />
                                    </svg>
                                </div>
                                <p className="text-xs leading-5 text-emerald-800">
                                    <strong>All parameters are approved.</strong>{" "}
                                    Finalizing will mark this worksheet as complete and ready for final review.
                                </p>
                            </div>
                        </div>

                        {/* Optional approval date/time */}
                        <div className="rounded-xl border border-slate-200 bg-white px-3 py-3">
                            <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                                QA Approval Date &amp; Time <span className="font-normal text-slate-400">(optional — leave blank to use current date/time)</span>
                            </label>
                            <div className="relative">
                                <input
                                    type="datetime-local"
                                    value={approvalDateTime}
                                    onChange={(event) => onApprovalDateTimeChange(event.target.value)}
                                    disabled={isApproving}
                                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 disabled:bg-slate-50 disabled:text-slate-400"
                                />
                            </div>
                        </div>

                        {/* Warning */}
                        <div className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-3">
                            <div className="flex items-start gap-2.5">
                                <div className="mt-0.5 w-7 h-7 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
                                    <svg className="w-4 h-4 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v4m0 4h.01M10.3 3.9l-7.2 12.5A2 2 0 004.8 19h14.4a2 2 0 001.7-2.6L13.7 3.9a2 2 0 00-3.4 0z" />
                                    </svg>
                                </div>
                                <p className="text-xs leading-5 text-amber-800">
                                    <strong>This action cannot be undone.</strong> Once approved, this worksheet and all its parameters will be permanently locked.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="border-t border-slate-200 bg-white px-4 py-3 flex items-center justify-end gap-2">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isApproving}
                            className="min-w-[120px] rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={onConfirm}
                            disabled={isApproving || !allApproved}
                            className="min-w-[155px] rounded-lg bg-slate-800 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-900 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                        >
                            {isApproving ? (
                                <>
                                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.35" strokeWidth="2" />
                                        <path stroke="currentColor" strokeWidth="2" strokeLinecap="round" d="M21 12a9 9 0 00-9-9" />
                                    </svg>
                                    Approving...
                                </>
                            ) : (
                                <>
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <circle cx="12" cy="12" r="9" strokeWidth={2} />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.5 12.5l2.2 2.2 4.8-5" />
                                    </svg>
                                    Approve Worksheet
                                </>
                            )}
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default ApproveWorksheetDialog;
