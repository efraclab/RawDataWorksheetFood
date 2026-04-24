import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, X, Loader2 } from "lucide-react";

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
            className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-emerald-700 to-slate-900 px-6 py-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white">Complete Analysis</h3>
                  <p className="text-xs text-emerald-200">Finalize and send to reviewer</p>
                </div>
                <button onClick={onClose} className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center">
                  <X className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-5 space-y-4">
              {/* Param details + checklist side by side */}
              <div className="flex gap-3">
                <div className="flex-1 bg-emerald-50 border border-emerald-200 rounded-xl p-3 space-y-2">
                  <div className="flex items-center justify-between pb-2 border-b border-emerald-200">
                    <span className="text-xs text-emerald-600 font-medium">Parameter</span>
                    <p className="text-xs text-emerald-900 font-semibold text-right ml-2 truncate max-w-[150px]">{parameterName}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-emerald-600 font-medium">Code</span>
                    <p className="text-xs text-emerald-900 font-semibold font-mono">{parameterCode}</p>
                  </div>
                </div>

                <div className="flex-1 bg-blue-50 border border-blue-200 rounded-xl p-3">
                  <h4 className="text-xs font-semibold text-blue-900 mb-1.5">Before Completing</h4>
                  <ul className="space-y-1">
                    {["All preparations completed", "All calculations verified", "All data recorded accurately", "Ready for review"].map((item) => (
                      <li key={item} className="flex items-center gap-1.5 text-xs text-blue-800">
                        <CheckCircle2 className="w-3 h-3 text-blue-500 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Analyst Comment */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Analyst Comment <span className="text-slate-400 font-normal">(optional)</span>
                </label>
                <textarea
                  value={analystComment}
                  onChange={(e) => setAnalystComment(e.target.value)}
                  placeholder="Add any notes or observations..."
                  rows={2}
                  className="w-full text-sm text-slate-700 bg-white border border-slate-300 rounded-lg px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="bg-slate-50 border-t border-slate-200 px-5 py-4 flex gap-3">
              <button
                onClick={onClose}
                disabled={isCompleting}
                className="flex-1 px-4 py-2.5 bg-white border border-slate-300 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={() => onConfirm(analystComment)}
                disabled={isCompleting}
                className="flex-1 px-4 py-2.5 bg-gradient-to-r from-emerald-700 to-slate-800 text-white text-sm font-semibold rounded-lg hover:from-emerald-800 hover:to-slate-900 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isCompleting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Completing...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Complete Analysis</span>
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

export default CompleteAnalysisDialog;
