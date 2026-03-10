import React from "react";
import { motion, AnimatePresence } from "framer-motion";

interface SubmitForQAReviewDialogProps {
  isOpen: boolean;
  isSubmitting: boolean;
  worksheetId: string;
  totalParameters: number;
  onClose: () => void;
  onConfirm: () => void;
}

const SubmitForQAReviewDialog: React.FC<SubmitForQAReviewDialogProps> = ({
  isOpen,
  isSubmitting,
  worksheetId,
  totalParameters,
  onClose,
  onConfirm,
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 30, stiffness: 400 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl shadow-2xl max-w-xl w-full overflow-hidden flex flex-col max-h-[90vh]"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-emerald-600 to-emerald-500 px-6 py-4 flex-shrink-0">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-white">
                    Submit for QA Review
                  </h3>
                  <p className="text-sm text-emerald-100 mt-0.5">
                    Hand off to QA for final validation
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center"
                >
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-5 space-y-4 overflow-y-auto flex-1">
              {/* Worksheet Info */}
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between pb-2.5 border-b border-gray-200">
                    <span className="text-xs text-gray-500 font-medium">
                      Worksheet ID
                    </span>
                    <p className="text-sm text-gray-900 font-semibold">
                      {worksheetId}
                    </p>
                  </div>
                  <div className="flex items-center justify-between pb-2.5 border-b border-gray-200">
                    <span className="text-xs text-gray-500 font-medium">
                      Total Parameters
                    </span>
                    <p className="text-sm text-gray-900 font-semibold">
                      {totalParameters}
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500 font-medium">
                      Reviewer-Approved Parameters
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-100 border border-emerald-300 rounded-lg text-xs font-semibold text-emerald-700">
                      <svg
                        className="w-3.5 h-3.5"
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
                      {totalParameters} / {totalParameters}
                    </span>
                  </div>
                </div>
              </div>

              {/* Ready Message */}
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg
                      className="w-4 h-4 text-emerald-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-emerald-900 leading-relaxed">
                      <strong>All parameters have been reviewer-approved.</strong>{" "}
                      Submitting will make this worksheet visible to QA for final
                      validation and sign-off.
                    </p>
                  </div>
                </div>
              </div>

              {/* Flow indicator */}
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                <p className="text-xs text-gray-500 font-medium mb-3 uppercase tracking-wider">
                  Workflow
                </p>
                <div className="flex items-center gap-2">
                  {/* Analyst */}
                  <div className="flex flex-col items-center gap-1 flex-1">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 border-2 border-emerald-400 flex items-center justify-center">
                      <svg className="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <span className="text-xs text-emerald-700 font-semibold text-center leading-tight">Analyst</span>
                    <span className="text-xs text-gray-400 text-center leading-tight">Done</span>
                  </div>

                  {/* Arrow */}
                  <div className="h-px flex-1 bg-emerald-300 relative -mt-5">
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-emerald-400 rotate-45" />
                  </div>

                  {/* Reviewer */}
                  <div className="flex flex-col items-center gap-1 flex-1">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 border-2 border-emerald-400 flex items-center justify-center">
                      <svg className="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <span className="text-xs text-emerald-700 font-semibold text-center leading-tight">Reviewer</span>
                    <span className="text-xs text-gray-400 text-center leading-tight">Done</span>
                  </div>

                  {/* Arrow */}
                  <div className="h-px flex-1 bg-emerald-400 relative -mt-5">
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-emerald-500 rotate-45" />
                  </div>

                  {/* QA */}
                  <div className="flex flex-col items-center gap-1 flex-1">
                    <motion.div
                      animate={{ scale: [1, 1.08, 1] }}
                      transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                      className="w-8 h-8 rounded-full bg-emerald-600 border-2 border-emerald-700 flex items-center justify-center shadow-md shadow-emerald-200"
                    >
                      <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </motion.div>
                    <span className="text-xs text-emerald-700 font-semibold text-center leading-tight">QA</span>
                    <span className="text-xs text-emerald-500 font-medium text-center leading-tight">Next</span>
                  </div>
                </div>
              </div>

              {/* Warning */}
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg
                      className="w-4 h-4 text-amber-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                      />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-amber-900 mb-1">
                      This action cannot be undone
                    </h4>
                    <p className="text-sm text-amber-800 leading-relaxed">
                      Once submitted, this worksheet will be locked for editing and handed off exclusively to QA for review.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            {/* Actions */}
            <div className="bg-gray-50 px-6 py-4 flex gap-3 border-t border-gray-200 flex-shrink-0">
              <button
                onClick={onClose}
                disabled={isSubmitting}
                className="flex-1 px-6 py-2.5 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                disabled={isSubmitting}
                className="flex-1 px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white font-medium rounded-lg hover:from-emerald-700 hover:to-emerald-600 transition-all shadow-sm hover:shadow disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                    />
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
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
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                      />
                    </svg>
                    <span>Submit for QA Review</span>
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SubmitForQAReviewDialog;