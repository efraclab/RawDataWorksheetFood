import React from "react";
import { Search, Sparkles, UserPlus, ArrowRight, X } from "lucide-react";

// The component's props are simplified for a registration search/toolbar focus
interface RegistrationSearchToolProps {
  registrationNo: string;
  setRegistrationNo: (id: string) => void;
  fetchRegistrationDetails: () => void;
  isLoading: boolean;
  error: string | null;
  onClear: () => void; // Added for a clear button functionality
}

const RegistrationSearchTool: React.FC<RegistrationSearchToolProps> = ({
  registrationNo,
  setRegistrationNo,
  fetchRegistrationDetails,
  isLoading,
  error,
  onClear,
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchRegistrationDetails();
  };

  return (
    // The main container with sharp corners and green background
    <div className="space-y-6 no-print">
      {/* Main Toolbar Card */}
      <div className="relative group">
        {/* Subtle Glow effect on hover (Green) */}
        <div className="absolute -inset-1 bg-gradient-to-r from-emerald-400 via-emerald-500 to-emerald-600 blur-md opacity-0 group-hover:opacity-20 transition-opacity duration-500" style={{borderRadius: '4px'}}></div>

        {/* Main Card: Green Background, Sharp Corners */}
        <div className="relative bg-gradient-to-r from-emerald-600 to-emerald-700 p-5 border border-emerald-800 overflow-hidden" style={{borderRadius: '2px'}}>
          
          {/* Subtle Background pattern (Using a darker shade) */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23d1d5db' fill-opacity='0.2'%3E%3Ccircle cx='3' cy='3' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          ></div>

          <div className="relative z-10">
            {/* Header / Title */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="relative">
                  {/* Icon: White inside Green background */}
                  <div className="relative bg-emerald-500 p-2 shadow-lg" style={{borderRadius: '2px'}}>
                    <UserPlus size={20} className="text-white" />
                  </div>
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-white">
                    Registration Search
                  </h2>
                  <p className="text-emerald-200 text-sm">
                    Enter registration number to view or manage details
                  </p>
                </div>
              </div>

              <div className="hidden sm:flex items-center gap-2">
                <Sparkles className="text-emerald-200 animate-pulse" size={20} />
              </div>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
              {/* Input: Now a toolbar element, taking full width on small screens */}
              <div className="relative group flex-grow">
                <div className="relative">
                  {/* Focus Glow: Toned down and subtle (Green) */}
                  <div className="absolute -inset-1 bg-gradient-to-r from-emerald-300 via-emerald-400 to-emerald-500 blur-lg opacity-0 group-focus-within:opacity-20 transition-opacity duration-500" style={{borderRadius: '2px'}}></div>

                  <div className="relative">
                    <input
                      id="registrationNo"
                      type="text"
                      value={registrationNo}
                      onChange={(e) => setRegistrationNo(e.target.value)}
                      className="w-full px-4 py-3 bg-white border-2 border-slate-300 
                                 text-slate-800 placeholder-slate-500 shadow-sm
                                 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-500
                                 transition-all duration-300 font-medium text-sm
                                 hover:border-emerald-300"
                      placeholder="Enter Registration No. (e.g., REG/2024/00123)"
                      style={{borderRadius: '2px'}}
                    />

                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-600 transition-colors duration-300">
                      <Search size={18} className="opacity-60" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                {/* Clear Button: White text on Emerald/Green background */}
                <button
                  type="button"
                  onClick={onClear}
                  className="relative flex items-center justify-center p-3 font-semibold text-sm
                           shadow-md shadow-emerald-800/50 transition-all duration-300 transform hover:scale-105 active:scale-95
                           disabled:opacity-50 disabled:shadow-none
                           bg-emerald-500 text-white hover:bg-emerald-400 hover:shadow-lg hover:shadow-emerald-800/60
                           focus:outline-none focus:ring-2 focus:ring-emerald-400/60"
                  disabled={!registrationNo || isLoading}
                  title="Clear Search"
                  style={{borderRadius: '2px'}}
                >
                  <X size={20} />
                </button>

                {/* Submit Button: Full Green Gradient, White Content */}
                <button
                  type="submit"
                  className="group relative flex items-center justify-center gap-2 px-6 py-3 font-bold text-sm tracking-wide
                           shadow-lg shadow-emerald-500/30 transition-all duration-500 transform hover:scale-105 active:scale-95
                           disabled:opacity-50 disabled:shadow-md disabled:cursor-not-allowed disabled:hover:scale-100
                           bg-gradient-to-r from-emerald-500 via-emerald-600 to-emerald-700 text-white
                           hover:from-emerald-600 hover:via-emerald-700 hover:to-emerald-800 hover:shadow-xl hover:shadow-emerald-500/40
                           focus:outline-none focus:ring-4 focus:ring-emerald-300/60 focus:ring-offset-2 focus:ring-offset-white
                           overflow-hidden min-w-[120px]"
                  disabled={isLoading}
                  style={{borderRadius: '2px'}}
                >
                  <div className="relative z-10 flex items-center justify-center gap-2">
                    {isLoading ? (
                      // Loading Animation
                      <>
                        <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-white rounded-full animate-bounce delay-75"></div>
                        <span>Searching...</span>
                      </>
                    ) : (
                      // Default Content
                      <>
                        <Search size={18} className="group-hover:animate-pulse" />
                        <span>Search</span>
                        <ArrowRight
                          size={18}
                          className="group-hover:translate-x-1 transition-transform duration-300"
                        />
                      </>
                    )}
                  </div>
                </button>
              </div>
            </form>

            {/* Error Message: Remains readable with red/white contrast */}
            {error && (
              <div className="mt-4 relative overflow-hidden bg-red-50 border border-red-300 p-3 shadow-sm" style={{borderRadius: '2px'}}>
                <div className="relative flex items-center gap-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce"></div>
                  <p className="text-red-700 font-medium text-sm">{error}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistrationSearchTool;