import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ClipboardCheck, X, AlertTriangle, Loader2, CheckCircle2 } from "lucide-react";

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
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => !isSubmitting && onClose()}
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
                  <ClipboardCheck className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-white">Submit for Analysis</h3>
                  <p className="text-sm text-emerald-200 mt-0.5">Review before submission</p>
                </div>
                {!isSubmitting && (
                  <button
                    onClick={onClose}
                    className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center"
                  >
                    <X className="w-5 h-5 text-white" />
                  </button>
                )}
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              {/* Parameters Count */}
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="text-lg font-bold text-white">{createdParametersCount}</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-emerald-900">
                      Parameter{createdParametersCount !== 1 ? "s" : ""} to Submit
                    </h4>
                    <p className="text-xs text-emerald-700 mt-0.5">
                      Status will change from{" "}
                      <span className="inline-flex items-center mx-0.5 px-1.5 py-0.5 bg-green-100 border border-green-300 rounded text-[10px] font-semibold text-green-700">
                        CREATED
                      </span>{" "}
                      to{" "}
                      <span className="inline-flex items-center mx-0.5 px-1.5 py-0.5 bg-orange-100 border border-orange-300 rounded text-[10px] font-semibold text-orange-700">
                        ANALYSIS PENDING
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              {/* What happens next — compact */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                <h4 className="text-xs font-semibold text-slate-600 uppercase tracking-wider mb-3">What Happens Next</h4>
                <div className="space-y-2">
                  {[
                    { icon: CheckCircle2, color: "text-emerald-600 bg-emerald-100", text: "Parameters marked as Analysis Pending" },
                    { icon: ClipboardCheck, color: "text-blue-600 bg-blue-100", text: "All parameter details locked for editing" },
                    { icon: CheckCircle2, color: "text-purple-600 bg-purple-100", text: "Assigned analysts can begin analysis" },
                  ].map(({ icon: Icon, color, text }) => (
                    <div key={text} className="flex items-center gap-2.5">
                      <div className={`w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0 ${color.split(" ")[1]}`}>
                        <Icon className={`w-3.5 h-3.5 ${color.split(" ")[0]}`} />
                      </div>
                      <p className="text-sm text-slate-700">{text}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Warning */}
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                  </div>
                  <p className="text-sm text-amber-800 leading-relaxed">
                    Once submitted, parameters will be{" "}
                    <strong className="text-red-700">permanently locked</strong> — this action cannot be undone.
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="bg-slate-50 px-6 py-4 flex gap-3 border-t border-slate-200">
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
                    <ClipboardCheck className="w-4 h-4" />
                    <span>Yes, Submit Now</span>
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

export default SubmitDialog;
