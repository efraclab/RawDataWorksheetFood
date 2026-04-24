import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LockOpen, X, Info, Loader2 } from "lucide-react";

interface UnlockParameterDialogProps {
  isOpen: boolean;
  isUnlocking: boolean;
  parameterName: string;
  parameterCode: string;
  onClose: () => void;
  onConfirm: () => void;
}

const UnlockParameterDialog: React.FC<UnlockParameterDialogProps> = ({
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
            <div className="bg-gradient-to-r from-emerald-700 to-slate-900 px-6 py-5">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <LockOpen className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-white">Unlock Parameter</h3>
                  <p className="text-sm text-emerald-200 mt-0.5">Revert to draft status for editing</p>
                </div>
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              {/* Parameter Details */}
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between pb-2.5 border-b border-slate-200">
                    <span className="text-xs text-slate-500 font-medium">Parameter Name</span>
                    <p className="text-sm text-slate-900 font-semibold">{parameterName}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500 font-medium">Parameter Code</span>
                    <p className="text-sm text-slate-900 font-semibold font-mono">{parameterCode}</p>
                  </div>
                </div>
              </div>

              {/* What Will Happen */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Info className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-blue-900 mb-2">What will happen:</h4>
                    <ul className="space-y-1.5 text-sm text-blue-800">
                      <li className="flex items-center gap-2">
                        <span className="w-1 h-1 bg-blue-500 rounded-full flex-shrink-0" />
                        <span>Status changes to <strong>CREATED</strong></span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-1 h-1 bg-blue-500 rounded-full flex-shrink-0" />
                        <span>All parameter details become editable</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-1 h-1 bg-blue-500 rounded-full flex-shrink-0" />
                        <span>Removed from analyst's queue</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-1 h-1 bg-blue-500 rounded-full flex-shrink-0" />
                        <span>All existing data preserved</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="bg-slate-50 px-6 py-4 flex gap-3 border-t border-slate-200">
              <button
                onClick={onClose}
                disabled={isUnlocking}
                className="flex-1 px-6 py-2.5 bg-white border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-50 hover:border-slate-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                disabled={isUnlocking}
                className="flex-1 px-6 py-2.5 bg-gradient-to-r from-emerald-700 to-slate-800 text-white font-medium rounded-lg hover:from-emerald-800 hover:to-slate-900 transition-all shadow-sm hover:shadow disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isUnlocking ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Unlocking...</span>
                  </>
                ) : (
                  <>
                    <LockOpen className="w-4 h-4" />
                    <span>Unlock Parameter</span>
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

export default UnlockParameterDialog;
