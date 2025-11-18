import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface DataPreviewDialogProps {
  isOpen: boolean;
  onClose: () => void;
  data: any;
}

const DataPreviewDialog: React.FC<DataPreviewDialogProps> = ({
  isOpen,
  onClose,
  data,
}) => {
  const [activeTab, setActiveTab] = useState<"overview" | "parameters" | "raw">("overview");
  const [expandedParams, setExpandedParams] = useState<number[]>([]);

  if (!isOpen || !data) return null;

  const toggleParamExpansion = (paramId: number) => {
    setExpandedParams((prev) =>
      prev.includes(paramId)
        ? prev.filter((id) => id !== paramId)
        : [...prev, paramId]
    );
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    alert("✅ Data copied to clipboard!");
  };

  const downloadJSON = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `rdws_${data.registrationInfo.registrationNo}_${new Date().getTime()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-7xl max-h-[95vh] flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-700 px-6 py-5 flex items-center justify-between flex-shrink-0">
              <div>
                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center"
                  >
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </motion.div>
                  Form Data Preview
                </h2>
                <p className="text-emerald-100 text-sm mt-1">
                  Registration: {data.registrationInfo?.registrationNo || "N/A"} • {data.parameters?.length || 0} Parameters
                </p>
              </div>
              <button
                onClick={onClose}
                className="text-white hover:bg-white/20 rounded-full p-2 transition-all"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
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

            {/* Tabs */}
            <div className="border-b border-gray-200 bg-gray-50 flex-shrink-0">
              <div className="flex gap-1 px-6">
                {[
                  { id: "overview", label: "Overview", icon: "📊" },
                  { id: "parameters", label: "Parameters Details", icon: "🔬" },
                  { id: "raw", label: "Raw JSON", icon: "📝" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`px-4 py-3 font-semibold text-sm transition-all relative ${
                      activeTab === tab.id
                        ? "text-emerald-700"
                        : "text-gray-600 hover:text-emerald-600"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span>{tab.icon}</span>
                      {tab.label}
                    </span>
                    {activeTab === tab.id && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-t"
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Content - Scrollable */}
            <div className="flex-1 overflow-y-auto p-6">
              <AnimatePresence mode="wait">
                {activeTab === "overview" && (
                  <motion.div
                    key="overview"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-4"
                  >
                    {/* Registration Info Card */}
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-5 border-2 border-blue-300 shadow-md">
                      <h3 className="text-lg font-bold text-blue-900 mb-4 flex items-center gap-2">
                        <span className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-white text-base">
                          📋
                        </span>
                        Registration Information
                      </h3>
                      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                        {data.registrationInfo && Object.entries(data.registrationInfo).map(([key, value]: [string, any]) => (
                          <div key={key} className="bg-white/70 rounded-lg p-3">
                            <div className="text-xs font-semibold text-blue-700 uppercase mb-1 break-words">
                              {key.replace(/([A-Z])/g, " $1").trim()}
                            </div>
                            <div className="text-sm font-bold text-gray-900 break-words">
                              {String(value) || "—"}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Document Info Card */}
                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-5 border-2 border-purple-300 shadow-md">
                      <h3 className="text-lg font-bold text-purple-900 mb-4 flex items-center gap-2">
                        <span className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center text-white text-base">
                          📄
                        </span>
                        Document Information
                      </h3>
                      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                        {data.documentInfo && Object.entries(data.documentInfo).map(([key, value]: [string, any]) => (
                          <div key={key} className="bg-white/70 rounded-lg p-3">
                            <div className="text-xs font-semibold text-purple-700 uppercase mb-1 break-words">
                              {key.replace(/([A-Z])/g, " $1").trim()}
                            </div>
                            <div className="text-sm font-bold text-gray-900 break-words">
                              {String(value) || "—"}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Parameters Summary Card */}
                    <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl p-5 border-2 border-emerald-300 shadow-md">
                      <h3 className="text-lg font-bold text-emerald-900 mb-4 flex items-center gap-2">
                        <span className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center text-white text-base">
                          🧪
                        </span>
                        Parameters Summary
                      </h3>
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="bg-white/70 rounded-lg p-4 text-center">
                          <div className="text-3xl font-bold text-emerald-700">
                            {data.parameters?.length || 0}
                          </div>
                          <div className="text-xs font-semibold text-gray-600 mt-1">
                            Total Parameters
                          </div>
                        </div>
                        <div className="bg-white/70 rounded-lg p-4 text-center">
                          <div className="text-3xl font-bold text-blue-700">
                            {data.parameters?.reduce(
                              (sum: number, p: any) => sum + (p.instruments?.length || 0),
                              0
                            ) || 0}
                          </div>
                          <div className="text-xs font-semibold text-gray-600 mt-1">
                            Total Instruments
                          </div>
                        </div>
                        <div className="bg-white/70 rounded-lg p-4 text-center">
                          <div className="text-3xl font-bold text-purple-700">
                            {data.parameters?.reduce(
                              (sum: number, p: any) => sum + (p.chemicals?.length || 0),
                              0
                            ) || 0}
                          </div>
                          <div className="text-xs font-semibold text-gray-600 mt-1">
                            Total Chemicals
                          </div>
                        </div>
                        <div className="bg-white/70 rounded-lg p-4 text-center">
                          <div className="text-3xl font-bold text-green-700">
                            {data.parameters?.reduce(
                              (sum: number, p: any) => sum + (p.standards?.length || 0),
                              0
                            ) || 0}
                          </div>
                          <div className="text-xs font-semibold text-gray-600 mt-1">
                            Total Standards
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === "parameters" && (
                  <motion.div
                    key="parameters"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-3"
                  >
                    {data.parameters?.map((param: any, index: number) => (
                      <div
                        key={param.id}
                        className="bg-white rounded-xl border-2 border-gray-200 shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                      >
                        <button
                          onClick={() => toggleParamExpansion(param.id)}
                          className="w-full px-5 py-4 flex items-center justify-between bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 transition-all"
                        >
                          <div className="flex items-center gap-3">
                            <span className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                              {index + 1}
                            </span>
                            <div className="text-left">
                              <div className="font-bold text-gray-900">
                                {param.parameterName}
                              </div>
                              <div className="text-xs text-gray-600">
                                {param.paraCode} • {param.methodName}
                              </div>
                            </div>
                          </div>
                          <motion.svg
                            animate={{ rotate: expandedParams.includes(param.id) ? 180 : 0 }}
                            className="w-5 h-5 text-gray-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 9l-7 7-7-7"
                            />
                          </motion.svg>
                        </button>

                        <AnimatePresence>
                          {expandedParams.includes(param.id) && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden"
                            >
                              <div className="p-5 space-y-4 bg-gray-50">
                                {/* Instruments */}
                                {param.instruments?.length > 0 && (
                                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                                    <h4 className="font-bold text-sm text-gray-700 mb-3">
                                      🔧 Instruments ({param.instruments.length})
                                    </h4>
                                    <div className="space-y-2">
                                      {param.instruments.map((inst: any, idx: number) => (
                                        <div
                                          key={inst.id || idx}
                                          className="bg-blue-50 rounded p-3 text-xs"
                                        >
                                          <div className="font-semibold text-blue-900">{inst.name}</div>
                                          <div className="text-gray-600 mt-1">ID: {inst.id}</div>
                                          {inst.calibrationDoneDate && (
                                            <div className="text-gray-600">Calibrated: {inst.calibrationDoneDate}</div>
                                          )}
                                          {inst.calibrationDueDate && (
                                            <div className="text-gray-600">Due: {inst.calibrationDueDate}</div>
                                          )}
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {/* Chemicals */}
                                {param.chemicals?.length > 0 && (
                                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                                    <h4 className="font-bold text-sm text-gray-700 mb-3">
                                      🧪 Chemicals ({param.chemicals.length})
                                    </h4>
                                    <div className="space-y-2">
                                      {param.chemicals.map((chem: any, idx: number) => (
                                        <div
                                          key={chem.id || idx}
                                          className="bg-purple-50 rounded p-3 text-xs"
                                        >
                                          <div className="font-semibold text-purple-900">{chem.name}</div>
                                          <div className="text-gray-600 mt-1">Make: {chem.make}</div>
                                          {chem.batchNo && <div className="text-gray-600">Batch: {chem.batchNo}</div>}
                                          {chem.validity && <div className="text-gray-600">Valid Until: {chem.validity}</div>}
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {/* Standards */}
                                {param.standards?.length > 0 && (
                                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                                    <h4 className="font-bold text-sm text-gray-700 mb-3">
                                      ⚗️ Standards ({param.standards.length})
                                    </h4>
                                    <div className="space-y-2">
                                      {param.standards.map((std: any, idx: number) => (
                                        <div
                                          key={std.id || idx}
                                          className="bg-green-50 rounded p-3 text-xs"
                                        >
                                          <div className="font-semibold text-green-900">{std.name}</div>
                                          <div className="text-gray-600 mt-1">Purity: {std.purity}</div>
                                          {std.make && <div className="text-gray-600">Make: {std.make}</div>}
                                          {std.batchNo && <div className="text-gray-600">Batch: {std.batchNo}</div>}
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {/* Diluent Preparation */}
                                {param.diluentPreparation && (
                                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                                    <h4 className="font-bold text-sm text-gray-700 mb-2">
                                      💧 Diluent Preparation
                                    </h4>
                                    <div className="text-xs text-gray-700 bg-gray-50 rounded p-3 whitespace-pre-wrap break-words">
                                      {param.diluentPreparation}
                                    </div>
                                  </div>
                                )}

                                {/* Mobile Phases */}
                                {param.mobilePhases?.length > 0 && (
                                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                                    <h4 className="font-bold text-sm text-gray-700 mb-3">
                                      🌊 Mobile Phases ({param.mobilePhases.length})
                                    </h4>
                                    <div className="space-y-2">
                                      {param.mobilePhases.map((mp: any, idx: number) => (
                                        <div
                                          key={mp.id || idx}
                                          className="bg-blue-50 rounded p-3"
                                        >
                                          <div className="font-semibold text-blue-900 text-xs mb-2">{mp.label}</div>
                                          <div className="text-xs text-gray-600 space-y-1">
                                            {mp.steps?.map((step: any, sIdx: number) => (
                                              <div key={sIdx} className="pl-2 border-l-2 border-blue-300">
                                                <span className="font-medium">{step.name}:</span> {step.value || "—"} {step.unit || ""}
                                              </div>
                                            ))}
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {/* Disso Media */}
                                {param.dissoMedia?.length > 0 && (
                                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                                    <h4 className="font-bold text-sm text-gray-700 mb-3">
                                      🧬 Disso Media ({param.dissoMedia.length})
                                    </h4>
                                    <div className="space-y-2">
                                      {param.dissoMedia.map((dm: any, idx: number) => (
                                        <div
                                          key={dm.id || idx}
                                          className="bg-amber-50 rounded p-3"
                                        >
                                          <div className="font-semibold text-amber-900 text-xs mb-2">{dm.label}</div>
                                          <div className="text-xs text-gray-600 space-y-1">
                                            {dm.steps?.map((step: any, sIdx: number) => (
                                              <div key={sIdx} className="pl-2 border-l-2 border-amber-300">
                                                <span className="font-medium">{step.name}:</span> {step.value || "—"} {step.unit || ""}
                                              </div>
                                            ))}
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {/* Standard Preparations */}
                                {param.standardPreparation?.length > 0 && (
                                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                                    <h4 className="font-bold text-sm text-gray-700 mb-3">
                                      🔬 Standard Preparations ({param.standardPreparation.length})
                                    </h4>
                                    <div className="space-y-2">
                                      {param.standardPreparation.map((sp: any, idx: number) => (
                                        <div
                                          key={sp.id || idx}
                                          className="bg-purple-50 rounded p-3"
                                        >
                                          <div className="font-semibold text-purple-900 text-xs mb-2">{sp.label}</div>
                                          <div className="text-xs text-gray-600 space-y-1">
                                            {sp.steps?.map((step: any, sIdx: number) => (
                                              <div key={sIdx} className="pl-2 border-l-2 border-purple-300">
                                                <span className="font-medium">{step.name}</span>
                                              </div>
                                            ))}
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {/* Sample Preparations */}
                                {param.samplePreparation?.length > 0 && (
                                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                                    <h4 className="font-bold text-sm text-gray-700 mb-3">
                                      🧫 Sample Preparations ({param.samplePreparation.length})
                                    </h4>
                                    <div className="space-y-2">
                                      {param.samplePreparation.map((sp: any, idx: number) => (
                                        <div
                                          key={sp.id || idx}
                                          className="bg-green-50 rounded p-3"
                                        >
                                          <div className="font-semibold text-green-900 text-xs mb-2">{sp.label}</div>
                                          <div className="text-xs text-gray-600 space-y-1">
                                            {sp.steps?.map((step: any, sIdx: number) => (
                                              <div key={sIdx} className="pl-2 border-l-2 border-green-300">
                                                <span className="font-medium">{step.name}</span>
                                              </div>
                                            ))}
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {/* Test Solution Preparation */}
                                {param.testSolutionPreparation && (
                                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                                    <h4 className="font-bold text-sm text-gray-700 mb-2">
                                      🧪 Test Solution Preparation
                                    </h4>
                                    <div className="text-xs text-gray-700 bg-gray-50 rounded p-3 whitespace-pre-wrap break-words">
                                      {param.testSolutionPreparation}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ))}
                  </motion.div>
                )}

                {activeTab === "raw" && (
                  <motion.div
                    key="raw"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <div className="bg-gray-900 rounded-xl p-4 overflow-x-auto">
                      <pre className="text-xs text-green-400 font-mono whitespace-pre-wrap break-words">
                        {JSON.stringify(data, null, 2)}
                      </pre>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Footer Actions */}
            <div className="border-t border-gray-200 bg-gray-50 px-6 py-4 flex justify-between items-center flex-shrink-0">
              <div className="text-sm text-gray-600">
                Generated: {new Date().toLocaleString()}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={copyToClipboard}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all text-sm font-semibold flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Copy
                </button>
                <button
                  onClick={downloadJSON}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-all text-sm font-semibold flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Download
                </button>
                <button
                  onClick={onClose}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all text-sm font-semibold"
                >
                  Close
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DataPreviewDialog;