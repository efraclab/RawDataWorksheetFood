import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LockOpen, X, Info, AlertTriangle, Loader2 } from "lucide-react";

interface UnlockPreparationDialogProps {
  isOpen: boolean;
  isUnlocking: boolean;
  parameterName: string;
  parameterCode: string;
  onClose: () => void;
  onConfirm: () => void;
}

const UnlockPreparationDialog: React.FC<UnlockPreparationDialogProps> = ({
  isOpen,
  isUnlocking,
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
            <div className="bg-gradient-to-r from-orange-500 to-amber-600 px-6 py-5">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center flex-shrink-0">
                  <LockOpen className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-white">Unlock Preparation</h3>
                  <p className="text-sm text-orange-100 mt-0.5">Re-enable preparation editing</p>
                </div>
                <button
                  onClick={onClose}
                  disabled={isUnlocking}
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

              {/* What gets unlocked */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Info className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-blue-900 mb-2">The following will be unlocked for editing:</p>
                    <ul className="space-y-1">
                      {[
                        "Instruments, Chemicals & Standards",
                        "Buffer & Mobile Phase Preparation",
                        "Diluent Preparation",
                        "Standard & Sample Preparations",
                      ].map((item) => (
                        <li key={item} className="flex items-center gap-2 text-sm text-blue-800">
                          <span className="w-1.5 h-1.5 bg-blue-500 rounded-full flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Warning */}
              <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex gap-2.5">
                <div className="w-6 h-6 bg-red-100 rounded-md flex items-center justify-center shrink-0 mt-0.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
                </div>
                <p className="text-sm text-red-800 leading-relaxed">
                  Unlocking will <strong>clear the preparation completion record</strong> and hide the Calculations section until you complete preparation again.
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-slate-50 border-t border-slate-200 px-6 py-4 flex gap-3">
              <button
                onClick={onClose}
                disabled={isUnlocking}
                className="flex-1 px-4 py-2.5 bg-white border border-slate-300 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-50 hover:border-slate-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                disabled={isUnlocking}
                className="flex-1 px-4 py-2.5 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white text-sm font-semibold rounded-lg transition-all shadow-sm hover:shadow disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isUnlocking ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Unlocking...</span>
                  </>
                ) : (
                  <>
                    <LockOpen className="w-4 h-4" />
                    <span>Unlock Preparation</span>
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

export default UnlockPreparationDialog;
