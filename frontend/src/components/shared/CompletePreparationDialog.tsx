import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, X, Lock, Info, Loader2 } from "lucide-react";

interface CompletePreparationDialogProps {
  isOpen: boolean;
  isCompleting: boolean;
  parameterName: string;
  parameterCode: string;
  onClose: () => void;
  onConfirm: () => void;
}

const CompletePreparationDialog: React.FC<CompletePreparationDialogProps> = ({
  isOpen,
  isCompleting,
  parameterName,
  parameterCode,
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
            className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-emerald-700 to-slate-900 px-6 py-5">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center flex-shrink-0">
                  <ShieldCheck className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-white">Complete Preparation</h3>
                  <p className="text-sm text-emerald-200 mt-0.5">Lock preparation data and unlock calculations</p>
                </div>
                <button
                  onClick={onClose}
                  disabled={isCompleting}
                  className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center disabled:opacity-50"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              {/* Parameter details */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2.5">
                <div className="flex items-center justify-between pb-2.5 border-b border-slate-200">
                  <span className="text-xs text-slate-500 font-medium">Parameter</span>
                  <span className="text-sm font-semibold text-slate-900">{parameterName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-medium">Code</span>
                  <span className="text-sm font-semibold text-slate-900 font-mono">{parameterCode}</span>
                </div>
              </div>

              {/* What gets locked */}
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Lock className="w-4 h-4 text-amber-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-amber-900 mb-2">The following will be locked for editing:</p>
                    <ul className="space-y-1">
                      {[
                        "Instruments, Chemicals & Standards",
                        "Buffer & Mobile Phase Preparation",
                        "Diluent Preparation",
                        "Standard & Sample Preparations",
                      ].map((item) => (
                        <li key={item} className="flex items-center gap-2 text-sm text-amber-800">
                          <span className="w-1.5 h-1.5 bg-amber-500 rounded-full flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Info */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 flex gap-2.5">
                <div className="w-6 h-6 bg-blue-100 rounded-md flex items-center justify-center shrink-0 mt-0.5">
                  <Info className="w-3.5 h-3.5 text-blue-600" />
                </div>
                <p className="text-sm text-blue-800 leading-relaxed">
                  Completing preparation will unlock the <strong>Calculations</strong> section.
                  You can unlock preparation later if revisions are needed — as long as analysis has not yet been submitted.
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-slate-50 border-t border-slate-200 px-6 py-4 flex gap-3">
              <button
                onClick={onClose}
                disabled={isCompleting}
                className="flex-1 px-4 py-2.5 bg-white border border-slate-300 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-50 hover:border-slate-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                disabled={isCompleting}
                className="flex-1 px-4 py-2.5 bg-gradient-to-r from-emerald-700 to-slate-800 hover:from-emerald-800 hover:to-slate-900 text-white text-sm font-semibold rounded-lg transition-all shadow-sm hover:shadow disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isCompleting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Completing...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Complete Preparation</span>
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

export default CompletePreparationDialog;
