import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, X, AlertTriangle, Loader2 } from "lucide-react";

interface DeleteParameterDialogProps {
  isOpen: boolean;
  isDeleting: boolean;
  parameterName: string;
  parameterCode: string;
  parameterStatus: string;
  onClose: () => void;
  onConfirm: () => void;
}

const DeleteParameterDialog: React.FC<DeleteParameterDialogProps> = ({
  isOpen,
  isDeleting,
  parameterName,
  parameterCode,
  parameterStatus,
  onClose,
  onConfirm,
}) => {
  if (!isOpen) return null;

  const isAnalysisStarted = parameterStatus.toLowerCase() === "analysis started";

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
            <div className="bg-gradient-to-r from-red-600 to-red-700 px-6 py-5">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <Trash2 className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-white">Delete Parameter</h3>
                  <p className="text-sm text-red-100 mt-0.5">This action cannot be undone</p>
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
                  <div className="flex items-center justify-between pb-2.5 border-b border-slate-200">
                    <span className="text-xs text-slate-500 font-medium">Parameter Code</span>
                    <p className="text-sm text-slate-900 font-semibold font-mono">{parameterCode}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500 font-medium">Status</span>
                    <span className="text-sm text-slate-900 font-semibold">{parameterStatus}</span>
                  </div>
                </div>
              </div>

              {/* Warning Notice — merges both boxes into one */}
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                    <AlertTriangle className="w-4 h-4 text-red-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-red-900 mb-2">
                      {isAnalysisStarted
                        ? "Analysis in progress — this will permanently delete:"
                        : "This will permanently delete:"}
                    </h4>
                    <ul className="space-y-1.5 text-sm text-red-800">
                      <li className="flex items-center gap-2">
                        <span className="w-1 h-1 bg-red-500 rounded-full flex-shrink-0" />
                        <span>All preparations and samples</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-1 h-1 bg-red-500 rounded-full flex-shrink-0" />
                        <span>Calculations and results</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-1 h-1 bg-red-500 rounded-full flex-shrink-0" />
                        <span>Instruments, chemicals, and standards</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-1 h-1 bg-red-500 rounded-full flex-shrink-0" />
                        <span>Analysis history and notes</span>
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
                disabled={isDeleting}
                className="flex-1 px-6 py-2.5 bg-white border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-50 hover:border-slate-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                disabled={isDeleting}
                className="flex-1 px-6 py-2.5 bg-gradient-to-r from-red-600 to-red-700 text-white font-medium rounded-lg hover:from-red-700 hover:to-red-800 transition-all shadow-sm hover:shadow disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    <span>Delete Parameter</span>
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

export default DeleteParameterDialog;
