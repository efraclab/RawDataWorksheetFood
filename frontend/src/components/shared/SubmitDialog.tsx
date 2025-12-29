import React from "react";
import { motion, AnimatePresence } from "framer-motion";

interface SubmitDialogProps {
  isOpen: boolean;
  isSubmitting: boolean;
  onClose: () => void;
  onConfirm: () => void;
  createdParametersCount: number;
}

const SubmitDialog: React.FC<SubmitDialogProps> = ({
  isOpen,
  isSubmitting,
  onClose,
  onConfirm,
  createdParametersCount,
}) => {


  return (
    <>
      <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => !isSubmitting && onClose()}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full overflow-hidden max-h-[90vh] flex flex-col"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-700 px-6 py-5 flex-shrink-0">
              <div className="flex items-center gap-4">
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center"
                >
                  <svg
                    className="w-7 h-7 text-white"
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
                </motion.div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-white">
                    Submit for Analysis
                  </h3>
                  <p className="text-sm text-emerald-100 mt-0.5">
                    Review before submission
                  </p>
                </div>
                {!isSubmitting && (
                  <button
                    onClick={onClose}
                    className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center"
                  >
                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </div>

            {/* Content - Scrollable */}
            <div className="p-6 space-y-5 overflow-y-auto flex-1">
              {/* Warning and Parameters Count in Row */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Warning Box */}
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-300 rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-1.5">
                    <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg
                        className="w-4 h-4 text-white"
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
                      <h4 className="font-bold text-md text-amber-900 flex items-center gap-1.5">
                        Important Warning
                      </h4>
                    </div>
                  </div>
                    <p className="text-xs text-gray-800 leading-relaxed">
                      Once you submit parameters for analysis, they will be{" "}
                      <span className="font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded">
                        permanently locked
                      </span>{" "}
                      and you will{" "}
                      <span className="font-bold text-red-600">
                        NOT be able to make any changes
                      </span>
                      . This action cannot be undone.
                    </p>
                </div>

                {/* Parameters Count Box */}
                <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-300 rounded-xl p-4">
                  <div className="flex items-center mb-1.5 gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-md font-bold text-white">
                        {createdParametersCount}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-bold text-emerald-900 uppercase tracking-wide">
                        Parameters to Submit
                      </h4>
                    </div>
                  </div>
                  <p className="text-xs text-gray-700 leading-relaxed">
                    All parameters with{" "}
                    <span className="inline-flex items-center mx-0.5 px-1 py-0.3 bg-green-100 border border-green-300 rounded text-[10px] font-bold text-green-700">
                      CREATED
                    </span>{" "}
                    status will be changed to{" "}
                    <span className="inline-flex items-center mx-0.5 px-1 py-0.3 bg-orange-100 border border-orange-300 rounded text-[10px] font-bold text-orange-700">
                      ANALYSIS PENDING
                    </span>
                  </p>
                </div>
              </div>

              {/* Status Change Visualization */}
              <div className="bg-white border-2 border-gray-200 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-4">
                  <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wide">
                    What Happens Next?
                  </h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex flex-col items-start gap-2 p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                      <svg
                        className="w-4 h-4 text-green-600"
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
                    <p className="text-xs text-gray-700 leading-relaxed">
                      Parameters will be marked as{" "}
                      <span className="font-semibold">Analysis Pending</span>
                    </p>
                  </div>

                  <div className="flex flex-col items-start gap-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <svg
                        className="w-4 h-4 text-blue-600"
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
                    <p className="text-xs text-gray-700 leading-relaxed">
                      All parameter details will be{" "}
                      <span className="font-semibold">locked for editing</span>
                    </p>
                  </div>

                  <div className="flex flex-col items-start gap-2 p-3 bg-purple-50 rounded-lg border border-purple-200">
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                      <svg
                        className="w-4 h-4 text-purple-600"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                        <path
                          fillRule="evenodd"
                          d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm9.707 5.707a1 1 0 00-1.414-1.414L9 12.586l-1.293-1.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <p className="text-xs text-gray-700 leading-relaxed">
                      Assigned analysts can{" "}
                      <span className="font-semibold">begin analysis</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Confirmation Question */}
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-5 border border-gray-200 text-center">
                <p className="text-base font-bold text-gray-900">
                  Are you sure you want to proceed?
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  This action will submit <span className="font-semibold text-emerald-600">{createdParametersCount}</span> parameter
                  {createdParametersCount !== 1 ? "s" : ""} for analysis
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 flex gap-3 border-t border-gray-200 flex-shrink-0">
              <button
                onClick={onClose}
                disabled={isSubmitting}
                className="flex-1 px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                disabled={isSubmitting}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold rounded-xl hover:from-emerald-700 hover:to-teal-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transform hover:scale-[1.02] active:scale-[0.98]"
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
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                    />
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <svg
                      className="w-5 h-5"
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
                    <span>Yes, Submit Now</span>
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
    </>
  );
};

export default SubmitDialog;