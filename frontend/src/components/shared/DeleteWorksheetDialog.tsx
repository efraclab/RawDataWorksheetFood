import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, X, AlertTriangle, Loader2 } from "lucide-react";

interface DeleteWorksheetDialogProps {
  isOpen: boolean;
  isDeleting: boolean;
  worksheetId: string;
  registrationNo: string;
  sampleName: string;
  status: string;
  numberOfParameters: number;
  onClose: () => void;
  onConfirm: () => void;
}

const DeleteWorksheetDialog: React.FC<DeleteWorksheetDialogProps> = ({
  isOpen,
  isDeleting,
  worksheetId,
  registrationNo,
  sampleName,
  status,
  numberOfParameters,
  onClose,
  onConfirm,
}) => {
  if (!isOpen) return null;

  const isDraft = status.toLowerCase() === "draft";

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
                  <h3 className="text-xl font-semibold text-white">Delete Worksheet</h3>
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
              {/* Worksheet Details */}
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between pb-2.5 border-b border-slate-200">
                    <span className="text-xs text-slate-500 font-medium">Worksheet ID</span>
                    <p className="text-sm text-slate-900 font-semibold font-mono">{worksheetId}</p>
                  </div>
                  <div className="flex items-center justify-between pb-2.5 border-b border-slate-200">
                    <span className="text-xs text-slate-500 font-medium">Registration No.</span>
                    <p className="text-sm text-slate-900 font-semibold">{registrationNo}</p>
                  </div>
                  <div className="flex items-center justify-between pb-2.5 border-b border-slate-200">
                    <span className="text-xs text-slate-500 font-medium">Sample Name</span>
                    <p className="text-sm text-slate-900 font-semibold max-w-[60%] text-right">{sampleName}</p>
                  </div>
                  <div className="flex items-center justify-between pb-2.5 border-b border-slate-200">
                    <span className="text-xs text-slate-500 font-medium">Parameters</span>
                    <p className="text-sm text-slate-900 font-semibold">{numberOfParameters}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500 font-medium">Status</span>
                    <span className="text-sm text-slate-900 font-semibold">{status}</span>
                  </div>
                </div>
              </div>

              {/* Warning — consolidate both notices into one */}
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                    <AlertTriangle className="w-4 h-4 text-red-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-red-900 mb-2">
                      {isDraft
                        ? "This will permanently delete:"
                        : `Worksheet is in "${status}" — deleting may disrupt ongoing work:`}
                    </h4>
                    <ul className="space-y-1.5 text-sm text-red-800">
                      <li className="flex items-center gap-2">
                        <span className="w-1 h-1 bg-red-500 rounded-full flex-shrink-0" />
                        <span>All parameters and their analysis data</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-1 h-1 bg-red-500 rounded-full flex-shrink-0" />
                        <span>All preparations, calculations, and results</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-1 h-1 bg-red-500 rounded-full flex-shrink-0" />
                        <span>Uploaded files and attachments</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-1 h-1 bg-red-500 rounded-full flex-shrink-0" />
                        <span>Instruments, chemicals, and standards links</span>
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
                    <span>Delete Worksheet</span>
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

export default DeleteWorksheetDialog;
