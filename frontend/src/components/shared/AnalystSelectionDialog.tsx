import { motion, AnimatePresence } from "framer-motion";
import { Search, Check, User, ChevronDown, X, Sparkles } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import type { Analyst } from "../../models/Analyst";

interface AnalystSelectionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  analysts: Analyst[];
  onSelectAnalyst: (employeeId: string, employeeName: string) => void;
}

const AnalystSelectionDialog: React.FC<AnalystSelectionDialogProps> = ({
  isOpen,
  onClose,
  analysts,
  onSelectAnalyst,
}) => {

  console.log("Analysts passed to dialog:", analysts);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedId, setSelectedId] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isDropdownOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isDropdownOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isDropdownOpen]);

  if (!isOpen) return null;

  const filteredAnalysts = analysts.filter((analyst) => {
  const name = analyst.username?.toLowerCase() ?? "";
  const employeeId = analyst.employeeId?.toLowerCase() ?? "";
  const department = analyst.department?.toLowerCase() ?? "";
  const search = searchTerm.toLowerCase();

  return (
    name.includes(search) ||
    employeeId.includes(search) ||
    department.includes(search)
  );
});


  const selectedAnalyst = analysts.find(a => a.employeeId === selectedId);

  const handleConfirm = () => {
    if (selectedId) {
      if (selectedAnalyst) {
        onSelectAnalyst(selectedId, selectedAnalyst.username);
      } 
      setSelectedId("");
      setSearchTerm("");
      setIsDropdownOpen(false);
      onClose();
    }
  };

  const handleCancel = () => {
    setSelectedId("");
    setSearchTerm("");
    setIsDropdownOpen(false);
    onClose();
  };

  const handleSelectFromDropdown = (employeeId: string) => {
    setSelectedId(employeeId);
    setIsDropdownOpen(false);
    setSearchTerm("");
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-black/70 via-emerald-900/20 to-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, rotateX: 10 }}
        animate={{ opacity: 1, scale: 1, rotateX: 0 }}
        exit={{ opacity: 0, scale: 0.95, rotateX: -10 }}
        transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-md relative"
        style={{
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(16, 185, 129, 0.1)"
        }}
      >
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-emerald-400/20 to-teal-500/20 rounded-full blur-3xl -z-0 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-teal-400/20 to-emerald-500/20 rounded-full blur-3xl -z-0 pointer-events-none" />

        {/* Header */}
        <div className="relative bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-700 px-6 py-6 overflow-hidden rounded-t-3xl">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMC41IiBvcGFjaXR5PSIwLjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30" />
          
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-3">
              <motion.div 
                className="p-2.5 bg-white/20 backdrop-blur-xl rounded-xl border border-white/30"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <Sparkles className="w-5 h-5 text-white" />
              </motion.div>
              <div>
                <h3 className="text-xl font-bold text-white tracking-tight">Assign Analyst</h3>
                <p className="text-emerald-100 text-sm">Choose the perfect match</p>
              </div>
            </div>
            <motion.button
              onClick={handleCancel}
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.95 }}
              className="text-white/90 hover:bg-white/20 rounded-xl p-2 transition-all backdrop-blur-sm border border-white/20"
            >
              <X className="w-5 h-5" />
            </motion.button>
          </div>
        </div>

        {/* Content */}
        <div className="relative p-6 bg-gradient-to-b from-white to-gray-50">
          <div className="space-y-4">
            {/* Custom Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <User className="w-4 h-4 text-emerald-600" />
                Select Analyst
              </label>
              
              {/* Dropdown Trigger */}
              <motion.button
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className={`w-full flex items-center justify-between px-4 py-3.5 bg-white border-2 rounded-2xl transition-all duration-300 shadow-sm hover:shadow-md ${
                  isDropdownOpen 
                    ? "border-emerald-500 ring-4 ring-emerald-100" 
                    : "border-gray-200 hover:border-emerald-300"
                }`}
              >
                {selectedAnalyst ? (
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-lg">
                      <User className="w-4 h-4 text-emerald-700" />
                    </div>
                    <div className="text-left">
                      <div className="font-semibold text-gray-900 text-sm">{selectedAnalyst.username}</div>
                      <div className="text-xs text-gray-500">
                        {selectedAnalyst.employeeId} • {selectedAnalyst.department}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      <User className="w-4 h-4 text-gray-400" />
                    </div>
                    <span className="text-gray-400 font-medium text-sm">Choose an analyst...</span>
                  </div>
                )}
                <ChevronDown 
                  className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${
                    isDropdownOpen ? "rotate-180" : ""
                  }`} 
                />
              </motion.button>

              {/* Dropdown Menu */}
              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute z-50 w-full mt-2 bg-white rounded-2xl shadow-2xl border-2 border-gray-100 overflow-hidden"
                    style={{
                      boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
                    }}
                  >
                    {/* Search Bar */}
                    <div className="p-3 bg-gradient-to-r from-gray-50 to-emerald-50 border-b border-gray-200">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-emerald-600" />
                        <input
                          ref={searchInputRef}
                          type="text"
                          placeholder="Search analysts..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="w-full pl-10 pr-4 py-2 text-sm border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white"
                        />
                      </div>
                    </div>

                    {/* Scrollable List */}
                    <div className="max-h-64 overflow-y-auto custom-scrollbar">
                      {filteredAnalysts.length > 0 ? (
                        <div className="p-2">
                          {filteredAnalysts.map((analyst, index) => (
                            <motion.button
                              key={analyst.employeeId}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.03 }}
                              onClick={() => handleSelectFromDropdown(analyst.employeeId)}
                              className={`w-full text-left px-3 py-2.5 flex items-center gap-3 rounded-xl transition-all mb-1 ${
                                selectedId === analyst.employeeId
                                  ? "bg-gradient-to-r from-emerald-100 to-teal-100"
                                  : "hover:bg-gray-50"
                              }`}
                            >
                              <div className={`p-1.5 rounded-lg ${
                                selectedId === analyst.employeeId 
                                  ? "bg-emerald-600" 
                                  : "bg-gray-200"
                              }`}>
                                <User className={`w-3.5 h-3.5 ${
                                  selectedId === analyst.employeeId 
                                    ? "text-white" 
                                    : "text-gray-500"
                                }`} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className={`font-semibold text-sm truncate ${
                                  selectedId === analyst.employeeId 
                                    ? "text-emerald-900" 
                                    : "text-gray-900"
                                }`}>
                                  {analyst.username}
                                </div>
                                <div className="text-xs text-gray-500 truncate">
                                  {analyst.employeeId} • {analyst.department}
                                </div>
                              </div>
                              {selectedId === analyst.employeeId && (
                                <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                              )}
                            </motion.button>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 px-4">
                          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2">
                            <User className="w-6 h-6 text-gray-400" />
                          </div>
                          <p className="text-sm text-gray-500 font-medium">No analysts found</p>
                          <p className="text-xs text-gray-400 mt-1">Try a different search</p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Selection Info */}
            {selectedAnalyst && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-200 rounded-xl"
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-emerald-600 rounded-lg mt-0.5">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-emerald-900 uppercase tracking-wide mb-1">Selected</p>
                    <p className="font-bold text-gray-900">{selectedAnalyst.username}</p>
                    <p className="text-sm text-gray-600">{selectedAnalyst.department}</p>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="relative border-t border-gray-200 bg-white px-6 py-4 flex gap-3 rounded-b-3xl">
          <motion.button
            onClick={handleCancel}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all shadow-sm hover:shadow"
          >
            Cancel
          </motion.button>
          <motion.button
            onClick={handleConfirm}
            disabled={!selectedId}
            whileHover={{ scale: !selectedId ? 1 : 1.02 }}
            whileTap={{ scale: !selectedId ? 1 : 0.98 }}
            className="flex-1 px-4 py-3 bg-gradient-to-r from-emerald-600 to-teal-700 text-white font-semibold rounded-xl hover:from-emerald-700 hover:to-teal-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg disabled:hover:scale-100"
          >
            Confirm
          </motion.button>
        </div>
      </motion.div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #10b981, #14b8a6);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #059669, #0d9488);
        }
      `}</style>
    </div>
  );
};

export default AnalystSelectionDialog;