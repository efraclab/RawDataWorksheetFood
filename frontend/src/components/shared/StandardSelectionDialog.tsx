import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check, AlertCircle } from "lucide-react";
import type { Standard } from "../../preparation_models/Standard";

interface StandardSelectionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  availableStandards: Standard[];
  onSelectStandard: (standard: Standard) => void;
  /** When true, allows selecting more than one standard (e.g. Hypromellose needs both
   *  Methyl Iodide and 2-Iodopropane assigned to the same preparation). Defaults to false
   *  so every other caller keeps the original single-select behavior unchanged. */
  multiSelect?: boolean;
  /** Standard names (case-insensitive) that should be pre-checked when the dialog opens,
   *  only relevant when multiSelect is true. */
  defaultSelectedNames?: string[];
  /** Required when multiSelect is true - fires with all checked standards on confirm. */
  onSelectStandards?: (standards: Standard[]) => void;
}

const StandardSelectionDialog: React.FC<StandardSelectionDialogProps> = ({
  isOpen,
  onClose,
  availableStandards,
  onSelectStandard,
  multiSelect = false,
  defaultSelectedNames = [],
  onSelectStandards,
}) => {
  const [selectedStandard, setSelectedStandard] = useState<Standard | null>(null);
  const [selectedStandards, setSelectedStandards] = useState<Standard[]>([]);

  // Pre-check the default-named standards whenever the dialog opens in multi-select mode
  React.useEffect(() => {
    if (isOpen && multiSelect) {
      const defaults = availableStandards.filter((std) =>
        defaultSelectedNames.some(
          (name) => name.trim().toLowerCase() === (std.name || "").trim().toLowerCase(),
        ),
      );
      setSelectedStandards(defaults);
    } else if (isOpen && !multiSelect) {
      setSelectedStandard(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, multiSelect]);

  const toggleStandard = (standard: Standard) => {
    setSelectedStandards((prev) =>
      prev.some((s) => s.serialNo === standard.serialNo)
        ? prev.filter((s) => s.serialNo !== standard.serialNo)
        : [...prev, standard],
    );
  };

  const handleConfirm = () => {
    if (multiSelect) {
      if (selectedStandards.length > 0) {
        onSelectStandards?.(selectedStandards);
        setSelectedStandards([]);
        onClose();
      }
      return;
    }
    if (selectedStandard) {
      onSelectStandard(selectedStandard);
      setSelectedStandard(null);
      onClose();
    }
  };

  const handleClose = () => {
    setSelectedStandard(null);
    setSelectedStandards([]);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Dialog */}
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="relative bg-gradient-to-r from-emerald-600 via-emerald-500 to-emerald-500 px-6 py-4">
                <div className="absolute inset-0 bg-black/5" />
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32" />
                
                <div className="relative flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-white">
                      Select Standard for Preparation
                    </h2>
                    <p className="text-emerald-100 text-sm mt-1">
                      Choose a standard to create a new preparation
                    </p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleClose}
                    className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
                  >
                    <X className="w-5 h-5 text-white" />
                  </motion.button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 overflow-y-auto max-h-[calc(80vh-180px)]">
                {availableStandards.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
                      <AlertCircle className="w-8 h-8 text-red-500" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      No Standards Available
                    </h3>
                    <p className="text-sm text-gray-600">
                      All standards have been assigned to preparations or none have been added.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {availableStandards.map((standard, index) => {
                      const isChecked = multiSelect
                        ? selectedStandards.some((s) => s.serialNo === standard.serialNo)
                        : selectedStandard?.serialNo === standard.serialNo;
                      return (
                      <motion.button
                        key={standard.serialNo}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() =>
                          multiSelect
                            ? toggleStandard(standard)
                            : setSelectedStandard(standard)
                        }
                        className={`
                          w-full text-left p-4 rounded-xl border-2 transition-all duration-200
                          ${
                            isChecked
                              ? "border-emerald-500 bg-emerald-50 shadow-md"
                              : "border-gray-200 hover:border-emerald-300 hover:bg-emerald-50/50"
                          }
                        `}
                      >
                        <div className="flex items-start gap-3">
                          {/* Radio/Check indicator */}
                          <div className="flex-shrink-0 mt-0.5">
                            {isChecked ? (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className={`w-6 h-6 ${
                                  multiSelect ? "rounded-md" : "rounded-full"
                                } bg-gradient-to-br from-emerald-500 to-emerald-500 flex items-center justify-center shadow-md`}
                              >
                                <Check className="w-4 h-4 text-white" />
                              </motion.div>
                            ) : (
                              <div
                                className={`w-6 h-6 ${
                                  multiSelect ? "rounded-md" : "rounded-full"
                                } border-2 border-gray-300`}
                              />
                            )}
                          </div>

                          {/* Standard Info */}
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold text-gray-900 text-base mb-1">
                              {standard.name}
                            </div>
                            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm text-gray-600">
                              <div>
                                <span className="font-medium">Purity:</span>{" "}
                                {standard.purity || "N/A"}
                              </div>
                              <div>
                                <span className="font-medium">Make:</span>{" "}
                                {standard.make || "N/A"}
                              </div>
                              <div>
                                <span className="font-medium">Batch:</span>{" "}
                                {standard.batchNo || "N/A"}
                              </div>
                              <div>
                                <span className="font-medium">Validity:</span>{" "}
                                {standard.validity || "N/A"}
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  {availableStandards.length} standard{availableStandards.length !== 1 ? "s" : ""} available
                </p>
                <div className="flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleClose}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleConfirm}
                    disabled={multiSelect ? selectedStandards.length === 0 : !selectedStandard}
                    className={`
                      px-6 py-2 text-sm font-medium text-white rounded-lg transition-all
                      ${
                        (multiSelect ? selectedStandards.length > 0 : !!selectedStandard)
                          ? "bg-gradient-to-r from-emerald-600 to-emerald-600 hover:from-emerald-700 hover:to-emerald-700 shadow-md hover:shadow-lg"
                          : "bg-gray-300 cursor-not-allowed"
                      }
                    `}
                  >
                    {multiSelect && selectedStandards.length > 0
                      ? `Create Preparation (${selectedStandards.length} selected)`
                      : "Create Preparation"}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default StandardSelectionDialog;