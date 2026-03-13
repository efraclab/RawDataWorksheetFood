import React from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ApproveParameterDialogProps {
  isOpen: boolean;
  isApproving: boolean;
  parameterName: string;
  parameterCode: string;
  onClose: () => void;
  onConfirm: (remarks: string) => void;
}

const ApproveParameterDialog: React.FC<ApproveParameterDialogProps> = ({
  isOpen,
  isApproving,
  parameterName,
  parameterCode,
  onClose,
  onConfirm,
}) => {
  const [reviewerRemarks, setReviewerRemarks] = React.useState("");

  React.useEffect(() => {
    if (!isOpen) setReviewerRemarks("");
  }, [isOpen]);

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
            className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-emerald-600 to-green-600 px-5 py-3.5">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-semibold text-white">Approve Parameter</h3>
                  <p className="text-xs text-emerald-100">Mark as complete and lock</p>
                </div>
                <button onClick={onClose} className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-5 space-y-3">
              {/* Param details + info notice side by side */}
              <div className="flex gap-3">
                <div className="flex-1 bg-emerald-50 border border-emerald-200 rounded-xl p-3 space-y-2">
                  <div className="flex items-center justify-between pb-2 border-b border-emerald-200">
                    <span className="text-xs text-emerald-600 font-medium">Parameter Name</span>
                    <p className="text-xs text-emerald-900 font-semibold text-right ml-2 truncate max-w-[180px]">{parameterName}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-emerald-600 font-medium">Parameter Code</span>
                    <p className="text-xs text-emerald-900 font-semibold font-mono">{parameterCode}</p>
                  </div>
                </div>

                <div className="flex-1 bg-blue-50 border border-blue-200 rounded-xl p-3 flex gap-2">
                  <div className="w-7 h-7 bg-blue-100 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                    <svg className="w-3.5 h-3.5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-blue-900 mb-1">What happens next</h4>
                    <p className="text-xs text-blue-800 leading-relaxed">
                      Once approved, this parameter will be marked as complete and locked from further editing.
                    </p>
                  </div>
                </div>
              </div>

              {/* Reviewer Remarks */}
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-3">
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Reviewer Remarks <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <textarea
                  value={reviewerRemarks}
                  onChange={(e) => setReviewerRemarks(e.target.value)}
                  placeholder="Add any approval notes or observations..."
                  rows={2}
                  className="w-full text-sm text-gray-700 bg-white border border-gray-300 rounded-lg px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent placeholder:text-gray-400"
                />
              </div>

              {/* Confirmation + Actions */}
              <div className="flex items-center gap-3 pt-1">
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-800">Approve this parameter?</p>
                </div>
                <button
                  onClick={onClose}
                  disabled={isApproving}
                  className="px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
                >
                  Cancel
                </button>
                <button
                  onClick={() => onConfirm(reviewerRemarks)}
                  disabled={isApproving}
                  className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-green-600 text-white text-sm font-medium rounded-lg hover:from-emerald-700 hover:to-green-700 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shrink-0"
                >
                  {isApproving ? (
                    <>
                      <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                      <span>Approving...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Approve</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ApproveParameterDialog;