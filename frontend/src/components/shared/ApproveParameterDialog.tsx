import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, X, Info, Loader2 } from "lucide-react";

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
            className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-emerald-700 to-slate-900 px-6 py-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white">Approve Parameter</h3>
                  <p className="text-xs text-emerald-200">Mark as complete and lock</p>
                </div>
                <button onClick={onClose} className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center">
                  <X className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-5 space-y-4">
              {/* Param details */}
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 space-y-2.5">
                <div className="flex items-center justify-between pb-2.5 border-b border-emerald-200">
                  <span className="text-xs text-emerald-600 font-medium">Parameter Name</span>
                  <p className="text-sm text-emerald-900 font-semibold text-right ml-2 max-w-[220px] truncate">{parameterName}</p>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-emerald-600 font-medium">Parameter Code</span>
                  <p className="text-sm text-emerald-900 font-semibold font-mono">{parameterCode}</p>
                </div>
              </div>

              {/* Info */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 flex gap-2.5">
                <div className="w-6 h-6 bg-blue-100 rounded-md flex items-center justify-center shrink-0 mt-0.5">
                  <Info className="w-3.5 h-3.5 text-blue-600" />
                </div>
                <p className="text-sm text-blue-800 leading-relaxed">
                  Once approved, this parameter will be marked as complete and locked from further editing.
                </p>
              </div>

              {/* Reviewer Remarks */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Reviewer Remarks <span className="text-slate-400 font-normal">(optional)</span>
                </label>
                <textarea
                  value={reviewerRemarks}
                  onChange={(e) => setReviewerRemarks(e.target.value)}
                  placeholder="Add any approval notes or observations..."
                  rows={2}
                  className="w-full text-sm text-slate-700 bg-white border border-slate-300 rounded-lg px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="bg-slate-50 px-5 py-4 flex gap-3 border-t border-slate-200">
              <button
                onClick={onClose}
                disabled={isApproving}
                className="flex-1 px-4 py-2.5 bg-white border border-slate-300 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={() => onConfirm(reviewerRemarks)}
                disabled={isApproving}
                className="flex-1 px-4 py-2.5 bg-gradient-to-r from-emerald-700 to-slate-800 text-white text-sm font-medium rounded-lg hover:from-emerald-800 hover:to-slate-900 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isApproving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Approving...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Approve Parameter</span>
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

export default ApproveParameterDialog;
