import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, X, AlertTriangle, Loader2 } from "lucide-react";

interface ApproveWorksheetDialogProps {
  isOpen: boolean;
  isApproving: boolean;
  worksheetId: string;
  totalParameters: number;
  onClose: () => void;
  onConfirm: () => void;
}

const ApproveWorksheetDialog: React.FC<ApproveWorksheetDialogProps> = ({
  isOpen,
  isApproving,
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
            className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-emerald-700 to-slate-900 px-6 py-5">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-white">Approve Worksheet</h3>
                  <p className="text-sm text-emerald-200 mt-0.5">Finalize all analysis work</p>
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
              {/* Worksheet Info */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between pb-2.5 border-b border-slate-200">
                    <span className="text-xs text-slate-500 font-medium">Worksheet ID</span>
                    <p className="text-sm text-slate-900 font-semibold font-mono">{worksheetId}</p>
                  </div>
                  <div className="flex items-center justify-between pb-2.5 border-b border-slate-200">
                    <span className="text-xs text-slate-500 font-medium">Total Parameters</span>
                    <p className="text-sm text-slate-900 font-semibold">{totalParameters}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500 font-medium">Approved Parameters</span>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-100 border border-emerald-300 rounded-lg text-xs font-semibold text-emerald-700">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {totalParameters} / {totalParameters}
                    </span>
                  </div>
                </div>
              </div>

              {/* Success + Warning combined */}
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  </div>
                  <p className="text-sm text-emerald-900 leading-relaxed">
                    <strong>All parameters are approved.</strong> Finalizing will mark this worksheet as complete and ready for final review.
                  </p>
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                  </div>
                  <p className="text-sm text-amber-800 leading-relaxed">
                    <strong>This action cannot be undone.</strong> Once approved, this worksheet and all its parameters will be permanently locked.
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="bg-slate-50 px-6 py-4 flex gap-3 border-t border-slate-200">
              <button
                onClick={onClose}
                disabled={isApproving}
                className="flex-1 px-6 py-2.5 bg-white border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-50 hover:border-slate-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                disabled={isApproving}
                className="flex-1 px-6 py-2.5 bg-gradient-to-r from-emerald-700 to-slate-800 text-white font-medium rounded-lg hover:from-emerald-800 hover:to-slate-900 transition-all shadow-sm hover:shadow disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isApproving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Approving...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Approve Worksheet</span>
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

export default ApproveWorksheetDialog;
