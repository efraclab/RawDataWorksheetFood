import React from "react";
import { motion, AnimatePresence } from "framer-motion";

interface CompleteAnalysisDialogProps {
  isOpen: boolean;
  isCompleting: boolean;
  parameterName: string;
  parameterCode: string;
  onClose: () => void;
  onConfirm: (comment: string) => void;
}

const CompleteAnalysisDialog: React.FC<CompleteAnalysisDialogProps> = ({
  isOpen,
  isCompleting,
  parameterName,
  parameterCode,
  onClose,
  onConfirm,
}) => {
  const [analystComment, setAnalystComment] = React.useState("");

  React.useEffect(() => {
    if (!isOpen) setAnalystComment("");
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
                  <h3 className="text-base font-semibold text-white">Complete Analysis</h3>
                  <p className="text-xs text-emerald-100">Finalize your analysis</p>
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
              {/* Param details + checklist side by side */}
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

                <div className="flex-1 bg-blue-50 border border-blue-200 rounded-xl p-3">
                  <h4 className="text-xs font-semibold text-blue-900 mb-1.5">Before Completing</h4>
                  <ul className="space-y-1">
                    {["All preparations completed", "All calculations verified", "All data recorded accurately", "Ready for review"].map((item) => (
                      <li key={item} className="flex items-center gap-1.5 text-xs text-blue-800">
                        <svg className="w-3 h-3 text-blue-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Analyst Comment */}
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-3">
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Analyst Comment <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <textarea
                  value={analystComment}
                  onChange={(e) => setAnalystComment(e.target.value)}
                  placeholder="Add any notes or observations..."
                  rows={2}
                  className="w-full text-sm text-gray-700 bg-white border border-gray-300 rounded-lg px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent placeholder:text-gray-400"
                />
              </div>

              {/* Confirmation + Actions */}
              <div className="flex items-center gap-3 pt-1">
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-800">Mark this analysis as complete?</p>
                  <p className="text-xs text-gray-500 mt-0.5">This will send it to Reviewer for approval</p>
                </div>
                <button
                  onClick={onClose}
                  disabled={isCompleting}
                  className="px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
                >
                  Cancel
                </button>
                <button
                  onClick={() => onConfirm(analystComment)}
                  disabled={isCompleting}
                  className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-green-600 text-white text-sm font-medium rounded-lg hover:from-emerald-700 hover:to-green-700 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shrink-0"
                >
                  {isCompleting ? (
                    <>
                      <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                      <span>Completing...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>Complete Analysis</span>
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

export default CompleteAnalysisDialog;