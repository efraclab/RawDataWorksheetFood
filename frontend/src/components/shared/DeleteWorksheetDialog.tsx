import React from "react";
import { motion, AnimatePresence } from "framer-motion";

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
            <div className="bg-gradient-to-r from-red-600 to-rose-600 px-6 py-5">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-white">
                    Delete Worksheet
                  </h3>
                  <p className="text-sm text-red-100 mt-0.5">
                    This action cannot be undone
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center"
                >
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-5">
              {/* Worksheet Details */}
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                <div className="space-y-3">
                  <div className="flex items-center justify-between pb-2.5 border-b border-gray-200">
                    <span className="text-xs text-gray-500 font-medium">
                      Worksheet ID
                    </span>
                    <p className="text-sm text-gray-900 font-semibold font-mono">
                      {worksheetId}
                    </p>
                  </div>
                  <div className="flex items-center justify-between pb-2.5 border-b border-gray-200">
                    <span className="text-xs text-gray-500 font-medium">
                      Registration No.
                    </span>
                    <p className="text-sm text-gray-900 font-semibold">
                      {registrationNo}
                    </p>
                  </div>
                  <div className="flex items-center justify-between pb-2.5 border-b border-gray-200">
                    <span className="text-xs text-gray-500 font-medium">
                      Sample Name
                    </span>
                    <p className="text-sm text-gray-900 font-semibold max-w-[60%] text-right">
                      {sampleName}
                    </p>
                  </div>
                  <div className="flex items-center justify-between pb-2.5 border-b border-gray-200">
                    <span className="text-xs text-gray-500 font-medium">
                      Parameters
                    </span>
                    <p className="text-sm text-gray-900 font-semibold">
                      {numberOfParameters}
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500 font-medium">
                      Status
                    </span>
                    <span className="text-sm text-gray-900 font-semibold">
                      {status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Non-Draft Warning */}
              {!isDraft && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg
                        className="w-4 h-4 text-amber-600"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold text-amber-900 mb-1">
                        Worksheet is Active
                      </h4>
                      <p className="text-sm text-amber-800 leading-relaxed">
                        This worksheet is currently in <strong>{status}</strong>{" "}
                        state. Deleting it may disrupt ongoing analysis work
                        assigned to analysts.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Deletion Notice */}
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg
                      className="w-4 h-4 text-red-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-red-900 mb-2">
                      This will permanently delete:
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
            <div className="bg-gray-50 px-6 py-4 flex gap-3 border-t border-gray-200">
              <button
                onClick={onClose}
                disabled={isDeleting}
                className="flex-1 px-6 py-2.5 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                disabled={isDeleting}
                className="flex-1 px-6 py-2.5 bg-gradient-to-r from-red-600 to-rose-600 text-white font-medium rounded-lg hover:from-red-700 hover:to-rose-700 transition-all shadow-sm hover:shadow disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isDeleting ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                    />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <>
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
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