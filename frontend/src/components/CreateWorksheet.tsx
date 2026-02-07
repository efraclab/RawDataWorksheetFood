import React, { useState } from "react";
import {
  Search,
  X,
  FileSpreadsheet,
  CheckCircle,
  ArrowRight,
  Beaker,
  ClipboardList,
  Loader2,
  Hash,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { fetchSample, createWorksheet } from "../services/api";
import type { SampleData } from "../preparation_models/SampleData";
import type { WorksheetRequest } from "../models/WorksheetRequest";
import type { SmapleDetailsRequest } from "../models/SmapleDetailsRequest";

interface CreateWorksheetProps {
  employeeId: string;
  department: string;
  role: string;
  onWorksheetCreated: (worksheetId: string, registrationNo: string) => void;
  onCancel: () => void;
}

const CreateWorksheet: React.FC<CreateWorksheetProps> = ({
  employeeId,
  department,
  role,
  onWorksheetCreated,
  onCancel,
}) => {
  const [registrationNo, setRegistrationNo] = useState("");
  const [sampleData, setSampleData] = useState<SampleData[] | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [creationError, setCreationError] = useState<string | null>(null);

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!registrationNo.trim()) {
      setSearchError("Please enter a registration number");
      return;
    }

    setIsSearching(true);
    setSearchError(null);
    setSampleData(null);
    setCreationError(null);

    try {
      const request: SmapleDetailsRequest = {
        regNo: registrationNo,
        lab: department,
      };
      const data = await fetchSample(request);

      if (data && Array.isArray(data) && data.length > 0) {
        setSampleData(data);
      } else {
        setSearchError("No sample data found for this registration number");
      }
    } catch (error: any) {
      console.error("Sample fetch error:", error);
      setSearchError(error.message || "Failed to fetch sample data");
    } finally {
      setIsSearching(false);
    }
  };

  function generateWorksheetId(): string {
    const random = Math.floor(Math.random() * 1_000_000)
      .toString()
      .padStart(6, "0");
    return `ws-${random}`;
  }

  const handleCreateWorksheet = async () => {
    if (!sampleData || sampleData.length === 0) return;

    setIsCreating(true);
    setCreationError(null);

    try {
      const firstSample = sampleData[0];
      const worksheetId = generateWorksheetId();

      // Create worksheet request with real sample data
      const worksheetData: WorksheetRequest = {
        worksheetId: worksheetId,
        registrationInfo: {
          registrationNo: firstSample.registrationNo,
          sampleName: firstSample.sampleName,
          numberOfParameters: 0,
          dueDate: firstSample.tatDate,
        },
        documentInfo: {
          preparedBy: employeeId,
        },
        role: role,
      };

      const response = await createWorksheet(worksheetData);

      if (response && response.worksheetId) {
        console.log("Worksheet created with ID:", response.worksheetId);
        onWorksheetCreated(response.worksheetId, firstSample.registrationNo);
      } else {
        throw new Error("Failed to get worksheet ID from server");
      }
    } catch (error: any) {
      console.error("Error creating worksheet:", error);
      setCreationError(error.message || "Failed to create worksheet");
    } finally {
      setIsCreating(false);
    }
  };

  const handleClear = () => {
    setRegistrationNo("");
    setSampleData(null);
    setSearchError(null);
    setCreationError(null);
  };

  // Get display data from first sample
  const displayData =
    sampleData && sampleData.length > 0 ? sampleData[0] : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/30 py-10 px-6">
      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .animate-shimmer {
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
          background-size: 200% 100%;
          animation: shimmer 2s infinite;
        }
      `}</style>

      <div className="max-w-4xl mx-auto">
        {/* Main Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="relative"
        >
          {/* Card Content */}
          <div className="relative bg-white rounded-2xl shadow-2xl border border-slate-200/80 overflow-hidden">
            {/* Header Section */}
            <div className="relative bg-gradient-to-r from-emerald-600 via-emerald-500 to-emerald-400 px-8 py-6">
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 right-0 w-40 h-40 bg-white rounded-full -translate-y-1/2 translate-x-1/2"></div>
              </div>

              <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/30 shadow-lg">
                    <FileSpreadsheet
                      size={22}
                      className="text-white"
                      strokeWidth={2}
                    />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">
                      Create New Worksheet
                    </h1>
                    <p className="text-emerald-100 text-sm mt-0.5">
                      Search registration number to begin the process
                    </p>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onCancel}
                  className="p-2 bg-white/10 hover:bg-white/20 rounded-xl border border-white/20 transition-all"
                >
                  <X className="text-white" size={20} />
                </motion.button>
              </div>
            </div>

            {/* Content Section */}
            <div className="p-8">
              <AnimatePresence mode="wait">
                {!sampleData ? (
                  // Search Form
                  <motion.div
                    key="search-form"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="space-y-6"
                  >
                    {/* Step Indicator */}
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-9 h-9 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full shadow-md">
                        <span className="text-white font-bold text-base">
                          1
                        </span>
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-slate-800">
                          Search Registration
                        </h3>
                        <p className="text-sm text-slate-500">
                          Enter registration number to verify sample details
                        </p>
                      </div>
                    </div>

                    {/* Input Group */}
                    <div className="space-y-4">
                      <label
                        htmlFor="registrationNo"
                        className="block text-sm font-bold text-slate-700 uppercase tracking-wider"
                      >
                        Registration Number
                      </label>

                      <div className="relative group">
                        <div className="relative flex items-center">
                          <input
                            id="registrationNo"
                            type="text"
                            value={registrationNo}
                            onChange={(e) => setRegistrationNo(e.target.value)}
                            onKeyDown={(e) => {
                              if (
                                e.key === "Enter" &&
                                registrationNo &&
                                !isSearching
                              ) {
                                handleSearch(e);
                              }
                            }}
                            className="w-full px-5 py-4 bg-slate-50 border border-slate-300 rounded-xl
                                     text-slate-800 placeholder-slate-400 text-base font-medium
                                     focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400
                                     transition-all duration-200 hover:border-slate-400
                                     disabled:bg-slate-100 disabled:cursor-not-allowed"
                            placeholder="e.g., EFRAC/DRG/RG/250413001"
                            disabled={isSearching}
                          />

                          <div className="absolute right-5 pointer-events-none">
                            {isSearching ? (
                              <Loader2 className="w-5 h-5 text-emerald-600 animate-spin" />
                            ) : (
                              <Search
                                className={`w-5 h-5 transition-all ${registrationNo ? "text-emerald-600" : "text-slate-400"}`}
                              />
                            )}
                          </div>
                        </div>
                      </div>

                      <p className="text-sm text-slate-500 flex items-center gap-1.5 ml-1">
                        <span className="inline-block w-2 h-2 bg-emerald-500 rounded-full"></span>
                        Enter complete and accurate registration number
                      </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4 pt-3">
                      <button
                        type="button"
                        onClick={handleClear}
                        disabled={!registrationNo || isSearching}
                        className="px-6 py-3 bg-white border border-slate-300 rounded-xl
                                 text-slate-700 font-semibold text-base
                                 hover:bg-slate-50 hover:border-slate-400
                                 transition-all duration-200
                                 disabled:opacity-40 disabled:cursor-not-allowed
                                 focus:outline-none focus:ring-2 focus:ring-slate-300"
                      >
                        <span className="flex items-center gap-2">
                          <X size={18} />
                          Clear
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={handleSearch}
                        disabled={isSearching || !registrationNo}
                        className="group relative flex-1 px-8 py-3 bg-gradient-to-r from-emerald-600 to-emerald-500
                                 rounded-xl text-white font-semibold text-base
                                 hover:from-emerald-700 hover:to-emerald-600
                                 shadow-lg hover:shadow-xl
                                 transition-all duration-200
                                 disabled:opacity-50 disabled:cursor-not-allowed
                                 focus:outline-none focus:ring-2 focus:ring-emerald-400
                                 overflow-hidden"
                      >
                        <div className="absolute inset-0 animate-shimmer"></div>

                        <span className="relative flex items-center justify-center gap-2">
                          {isSearching ? (
                            <>
                              <Loader2 className="w-5 h-5 animate-spin" />
                              Searching...
                            </>
                          ) : (
                            <>
                              <Search size={20} />
                              Search Registration
                            </>
                          )}
                        </span>
                      </button>
                    </div>

                    {/* Error Display */}
                    {searchError && (
                      <motion.div
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 bg-red-50 border border-red-200 rounded-xl"
                      >
                        <div className="flex items-start gap-2">
                          <X className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                          <div>
                            <h4 className="text-sm font-bold text-red-900">
                              Search Error
                            </h4>
                            <p className="text-sm text-red-700 mt-0.5">
                              {searchError}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                ) : (
                  // Search Results
                  <motion.div
                    key="search-results"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="space-y-6"
                  >
                    {/* Step Indicator */}
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-9 h-9 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full shadow-md">
                        <CheckCircle className="text-white" size={18} />
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-slate-800">
                          Registration Found
                        </h3>
                        <p className="text-sm text-slate-500">
                          Review the sample details and create the worksheet
                        </p>
                      </div>
                    </div>

                    {/* Success Banner */}
                    <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-400 p-5 shadow-lg">
                      <div className="relative flex items-center gap-4">
                        <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center shadow-md">
                          <CheckCircle className="text-emerald-600" size={24} />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-white">
                            Verification Successful
                          </h3>
                          <p className="text-emerald-100 text-sm">
                            Sample details have been retrieved for worksheet
                            creation
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Sample Details Card */}
                    <div className="bg-slate-50 rounded-xl border border-emerald-200 overflow-hidden">
                      <div className="bg-gradient-to-r from-emerald-600 to-emerald-500 px-5 py-3 border-b border-emerald-300">
                        <h3 className="text-base font-bold text-white flex items-center gap-2">
                          <Beaker className="w-5 h-5" />
                          Sample Information Overview
                        </h3>
                      </div>
                      <div className="p-5 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-white rounded-xl p-4 border border-slate-200">
                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                              Registration No.
                            </p>
                            <p className="text-base font-bold text-slate-800 truncate">
                              {displayData?.registrationNo}
                            </p>
                          </div>
                          <div className="bg-white rounded-xl p-4 border border-slate-200">
                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                              Date of Receipt
                            </p>
                            <p className="text-base font-bold text-slate-800">
                              {displayData?.registrationDate}
                            </p>
                          </div>
                        </div>

                        <div className="bg-white rounded-xl p-4 border border-slate-200">
                          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                            Sample Name / Description
                          </p>
                          <p className="text-base font-bold text-slate-800">
                            {displayData?.sampleName}
                          </p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-white rounded-xl p-4 border border-slate-200">
                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                              Laboratory
                            </p>
                            <p className="text-base font-bold text-slate-800">
                              {displayData?.lab}
                            </p>
                          </div>
                          <div className="bg-white rounded-xl p-4 border border-slate-200">
                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                              <Hash className="w-4 h-4" />
                              Number of Parameters
                            </p>
                            <p className="text-base font-bold text-slate-800">
                              {sampleData.length}
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-white rounded-xl p-4 border border-slate-200">
                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                              TAT Date
                            </p>
                            <p className="text-base font-bold text-slate-800">
                              {displayData?.tatDate}
                            </p>
                          </div>
                          <div className="bg-white rounded-xl p-4 border border-slate-200">
                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                              Analysis Start Date
                            </p>
                            <p className="text-base font-bold text-slate-800">
                              {displayData?.analysisStartDate}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4 pt-3">
                      <button
                        type="button"
                        onClick={handleClear}
                        disabled={isCreating}
                        className="px-6 py-3 bg-white border border-slate-300 rounded-xl
                                 text-slate-700 font-semibold text-base
                                 hover:bg-slate-50 hover:border-slate-400
                                 transition-all duration-200
                                 disabled:opacity-50 disabled:cursor-not-allowed
                                 focus:outline-none focus:ring-2 focus:ring-slate-300"
                      >
                        <span className="flex items-center gap-2">
                          <Search size={18} />
                          Search Again
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={handleCreateWorksheet}
                        disabled={isCreating}
                        className="group relative flex-1 px-8 py-3 bg-gradient-to-r from-emerald-600 to-emerald-500
                                 rounded-xl text-white font-semibold text-base
                                 hover:from-emerald-700 hover:to-emerald-600
                                 shadow-lg hover:shadow-xl
                                 transition-all duration-200
                                 disabled:opacity-50 disabled:cursor-not-allowed
                                 focus:outline-none focus:ring-2 focus:ring-emerald-400
                                 overflow-hidden"
                      >
                        <div className="absolute inset-0 animate-shimmer"></div>

                        <span className="relative flex items-center justify-center gap-2">
                          {isCreating ? (
                            <>
                              <Loader2 className="w-5 h-5 animate-spin" />
                              Creating Worksheet...
                            </>
                          ) : (
                            <>
                              <ClipboardList size={20} />
                              Create Worksheet
                              <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
                            </>
                          )}
                        </span>
                      </button>
                    </div>

                    {/* Error Display */}
                    {creationError && (
                      <motion.div
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 bg-red-50 border border-red-200 rounded-xl"
                      >
                        <div className="flex items-start gap-2">
                          <X className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                          <div>
                            <h4 className="text-sm font-bold text-red-900">
                              Creation Error
                            </h4>
                            <p className="text-sm text-red-700 mt-0.5">
                              {creationError}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Footer */}
            <div className="px-8 py-4 bg-slate-50 border-t border-slate-200">
              <div className="flex items-center justify-between text-xs text-slate-600">
                <span className="flex items-center gap-2">
                  <span className="inline-block w-2 h-2 bg-emerald-500 rounded-full"></span>
                  <span className="font-medium">System Active</span>
                </span>
                <span className="font-medium">EFRAC Ltd.</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CreateWorksheet;
