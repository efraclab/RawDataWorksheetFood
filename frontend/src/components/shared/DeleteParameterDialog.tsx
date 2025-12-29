import React from "react";
import { motion, AnimatePresence } from "framer-motion";

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
    <>
      <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full overflow-hidden max-h-[90vh] flex flex-col"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-red-600 via-red-700 to-rose-700 px-6 py-5 flex-shrink-0">
              <div className="flex items-center gap-4">
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center"
                >
                  <svg
                    className="w-7 h-7 text-white"
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
                </motion.div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-white">
                    Delete Parameter
                  </h3>
                  <p className="text-sm text-red-100 mt-0.5">
                    This action cannot be undone
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center"
                >
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-6 space-y-5 overflow-y-auto flex-1">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-red-50 to-rose-50 border-2 border-red-200 rounded-xl p-4 h-fit">
                  <div className="flex items-center gap-3 mb-1.5">
                    <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg
                        className="w-4 h-4 text-red-700"
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
                      <h4 className="font-bold text-sm text-red-900">
                        {isAnalysisStarted
                          ? "Warning: Analysis in Progress"
                          : "Confirm Deletion"}
                      </h4>
                    </div>
                  </div>
                    <p className="text-sm text-red-700 leading-relaxed">
                        {isAnalysisStarted ? (
                          <>
                            This parameter is currently under analysis. Deleting it
                            will remove all associated data and may disrupt the
                            ongoing analysis process.
                          </>
                        ) : (
                          <>
                            Are you sure you want to delete the parameter "
                            <strong>{parameterName}</strong>" ({parameterCode})?
                          </>
                        )}
                    </p>
                </div>

                {/* Parameter Details */}
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 h-fit">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between pb-3 border-b border-gray-200">
                      <span className="text-xs text-gray-600 font-medium uppercase tracking-wider">Parameter</span>
                      <p className="text-sm text-gray-900 font-bold">
                        {parameterName}
                      </p>
                    </div>
                    <div className="flex items-center justify-between pb-3 border-b border-gray-200">
                      <span className="text-xs text-gray-600 font-medium uppercase tracking-wider">Code</span>
                      <p className="text-sm text-gray-900 font-bold font-mono">
                        {parameterCode}
                      </p>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-600 font-medium uppercase tracking-wider">Status</span>
                      <p className="text-sm text-gray-900 font-bold uppercase">
                        {parameterStatus}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Deletion Items and Notice in Row */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Warning List */}
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <svg className="w-4 h-4 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <p className="text-xs font-bold text-amber-900 uppercase tracking-wide">
                      This will permanently delete:
                    </p>
                  </div>
                  <ul className="space-y-2 text-xs text-amber-800">
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-amber-500 rounded-full flex-shrink-0" />
                      <span>All preparations (Standard & Sample)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-amber-500 rounded-full flex-shrink-0" />
                      <span>All calculations and results</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-amber-500 rounded-full flex-shrink-0" />
                      <span>Associated instruments, chemicals, and standards</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-amber-500 rounded-full flex-shrink-0" />
                      <span>Analysis history and notes</span>
                    </li>
                  </ul>
                </div>

                {/* Important Notice */}
                <div className="bg-red-100 border-2 border-red-300 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 bg-red-200 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg
                        className="w-5 h-5 text-red-700"
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
                      <p className="text-sm font-bold text-red-900 mb-1.5 flex items-center gap-1.5">
                        ⚠️ Important - Action Required
                      </p>
                      <p className="text-xs text-red-800 leading-relaxed">
                        After deleting, you <strong>MUST click "Save Draft"</strong>{" "}
                        button at the bottom of the page to complete the deletion
                        process and permanently remove this parameter from the
                        database.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 flex gap-3 border-t border-gray-200 flex-shrink-0">
              <button
                onClick={onClose}
                disabled={isDeleting}
                className="flex-1 px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                disabled={isDeleting}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-red-600 to-rose-600 text-white font-semibold rounded-xl hover:from-red-700 hover:to-rose-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transform hover:scale-[1.02] active:scale-[0.98]"
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
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                    />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <>
                    <svg
                      className="w-5 h-5"
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
                    <span>Delete Parameter</span>
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
    </>
  );
};

export default DeleteParameterDialog;