import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, X, CheckCircle2, AlertTriangle, Loader2, User, ClipboardCheck } from "lucide-react";

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
            className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-emerald-700 to-slate-900 px-6 py-5 flex-shrink-0">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <Send className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-white">Submit for QA Review</h3>
                  <p className="text-sm text-emerald-200 mt-0.5">Hand off to QA for final validation</p>
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
            <div className="p-5 space-y-4">
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
                    <span className="text-xs text-slate-500 font-medium">Reviewer-Approved</span>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-100 border border-emerald-300 rounded-lg text-xs font-semibold text-emerald-700">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {totalParameters} / {totalParameters}
                    </span>
                  </div>
                </div>
              </div>

              {/* Ready Message */}
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  </div>
                  <p className="text-sm text-emerald-900 leading-relaxed">
                    <strong>All parameters are reviewer-approved.</strong>{" "}
                    Submitting will make this worksheet visible to QA for final validation and sign-off.
                  </p>
                </div>
              </div>

              {/* Flow indicator */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                <p className="text-xs text-slate-500 font-medium mb-3 uppercase tracking-wider">Workflow</p>
                <div className="flex items-center gap-2">
                  {[
                    { label: "Analyst", sub: "Done", icon: User, done: true },
                    { label: "Reviewer", sub: "Done", icon: ClipboardCheck, done: true },
                    { label: "QA", sub: "Next", icon: Send, done: false },
                  ].map((step, i, arr) => (
                    <React.Fragment key={step.label}>
                      <div className="flex flex-col items-center gap-1">
                        <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${step.done ? "bg-emerald-100 border-emerald-400" : "bg-emerald-600 border-emerald-700 shadow-md shadow-emerald-200"}`}>
                          {step.done
                            ? <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            : <step.icon className="w-4 h-4 text-white" />}
                        </div>
                        <span className={`text-xs font-semibold leading-tight ${step.done ? "text-emerald-700" : "text-emerald-700"}`}>{step.label}</span>
                        <span className={`text-xs leading-tight ${step.done ? "text-slate-400" : "text-emerald-500 font-medium"}`}>{step.sub}</span>
                      </div>
                      {i < arr.length - 1 && (
                        <div className="h-px flex-1 bg-emerald-300 -mt-5" />
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>

              {/* Warning */}
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex gap-2.5">
                <div className="w-6 h-6 bg-amber-100 rounded-md flex items-center justify-center shrink-0 mt-0.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                </div>
                <p className="text-sm text-amber-800 leading-relaxed">
                  <strong>This action cannot be undone.</strong> Once submitted, this worksheet will be locked and handed off exclusively to QA.
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="bg-slate-50 px-6 py-4 flex gap-3 border-t border-slate-200 flex-shrink-0">
              <button
                onClick={onClose}
                disabled={isSubmitting}
                className="flex-1 px-6 py-2.5 bg-white border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-50 hover:border-slate-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                disabled={isSubmitting}
                className="flex-1 px-6 py-2.5 bg-gradient-to-r from-emerald-700 to-slate-800 text-white font-medium rounded-lg hover:from-emerald-800 hover:to-slate-900 transition-all shadow-sm hover:shadow disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
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
