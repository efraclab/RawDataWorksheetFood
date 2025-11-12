import React from "react";
import { Search, Sparkles, ArrowRight, X, Shield, File } from "lucide-react";

interface RegistrationSearchToolProps {
  registrationNo: string;
  setRegistrationNo: (id: string) => void;
  fetchRegistrationDetails: () => void;
  isLoading: boolean;
  error: string | null;
  onClear: () => void;
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
    <div className="space-y-6 no-print bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200 p-6">
      {/* Main Container */}
      <div className="relative max-w-4xl mx-auto">
        {/* Floating Header Badge */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-lg border border-slate-200">
            <Shield className="text-emerald-600" size={16} />
            <span className="text-xs font-semibold text-slate-700 tracking-wider uppercase">
              LIMS Registration Portal
            </span>
            <Sparkles className="text-emerald-600 animate-pulse" size={16} />
          </div>
        </div>

        {/* Main Card */}
        <div className="relative group">
          {/* Animated Border Glow */}
          <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-1000"></div>
          
          {/* Card Content */}
          <div className="relative bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            {/* Elegant Header Section */}
            <div className="relative bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-700 px-8 py-6">
              {/* Subtle Pattern Overlay */}
              <div 
                className="absolute inset-0 opacity-10"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                }}
              ></div>

              <div className="relative z-10">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-5">
                    {/* Icon Container with Elegant Shadow */}
                    <div className="relative">
                      <div className="absolute inset-0 bg-white rounded-xl blur-sm opacity-20"></div>
                      <div className="relative bg-white/10 backdrop-blur-sm p-3 rounded-xl border border-white/20 shadow-xl">
                        <File size={24} className="text-white" strokeWidth={2} />
                      </div>
                    </div>

                    {/* Title Section */}
                    <div>
                      <h1 className="text-2xl font-bold text-white tracking-tight">
                        Registration Search
                      </h1>
                      <p className="text-emerald-100 text-xs leading-relaxed">
                        Enter your registration number to access comprehensive details and management tools
                      </p>
                    </div>
                  </div>

                  {/* Decorative Element */}
                  <div className="hidden lg:block">
                    <div className="relative">
                      <div className="absolute inset-0 bg-emalad-400 rounded-full blur-md opacity-40 animate-pulse"></div>
                      <Sparkles className="relative text-emerald-600" size={32} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Search Section with Classic Elegance */}
            <div className="p-8 md:p-10 bg-gradient-to-b from-white to-slate-50">
              <div className="space-y-6">
                {/* Input Group */}
                <div className="space-y-3">
                  <label 
                    htmlFor="registrationNo" 
                    className="block text-sm font-semibold text-slate-700 tracking-wide uppercase"
                  >
                    Registration Number
                  </label>
                  
                  <div className="relative group">
                    {/* Input Focus Ring */}
                    <div className="absolute -inset-1 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl blur opacity-0 group-focus-within:opacity-20 transition-opacity duration-500"></div>
                    
                    <div className="relative flex items-center">
                      <input
                        id="registrationNo"
                        type="text"
                        value={registrationNo}
                        onChange={(e) => setRegistrationNo(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && registrationNo && !isLoading) {
                            handleSubmit(e);
                          }
                        }}
                        className="w-full px-6 py-4 bg-white border-2 border-slate-300 rounded-xl
                                 text-slate-800 placeholder-slate-400 text-base font-medium
                                 focus:outline-none focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500
                                 transition-all duration-300 shadow-sm hover:shadow-md hover:border-slate-400
                                 disabled:bg-slate-50 disabled:cursor-not-allowed"
                        placeholder="e.g., REG/2024/00123"
                        disabled={isLoading}
                      />
                      
                      <div className="absolute right-5 pointer-events-none">
                        <div className={`transition-all duration-300 ${registrationNo ? 'text-emerald-600 scale-110' : 'text-slate-400'}`}>
                          <Search size={20} strokeWidth={2.5} />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Helper Text */}
                  <p className="text-xs text-slate-500 flex items-center gap-1.5 ml-1">
                    <span className="inline-block w-1.5 h-1.5 bg-slate-400 rounded-full"></span>
                    Enter the complete registration number
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 pt-2">
                  {/* Clear Button - Classic Secondary Style */}
                  <button
                    type="button"
                    onClick={onClear}
                    disabled={!registrationNo || isLoading}
                    className="group relative px-6 py-3.5 bg-white border-2 border-slate-300 rounded-xl
                             text-slate-700 font-semibold text-sm tracking-wide uppercase
                             shadow-sm hover:shadow-md hover:border-slate-400 hover:bg-slate-50
                             transition-all duration-300 transform hover:-translate-y-0.5
                             disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:transform-none
                             focus:outline-none focus:ring-4 focus:ring-slate-300/50"
                  >
                    <span className="flex items-center justify-center gap-2">
                      <X size={18} className="group-hover:rotate-90 transition-transform duration-300" />
                      <span>Clear</span>
                    </span>
                  </button>

                  {/* Search Button - Premium Primary Style */}
                  <button
                    type="button"
                    onClick={fetchRegistrationDetails}
                    disabled={isLoading || !registrationNo}
                    className="group relative flex-1 px-8 py-3.5 bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-700
                             rounded-xl text-white font-bold text-sm tracking-wide uppercase
                             shadow-lg shadow-emerald-600/30 hover:shadow-xl hover:shadow-emerald-600/40
                             transition-all duration-300 transform hover:-translate-y-0.5 hover:scale-[1.02]
                             disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none
                             focus:outline-none focus:ring-4 focus:ring-emerald-500/50
                             overflow-hidden"
                  >
                    {/* Button Shine Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent 
                                    translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
                    
                    <span className="relative flex items-center justify-center gap-3">
                      {isLoading ? (
                        <>
                          <div className="flex gap-1">
                            <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          </div>
                          <span>Searching</span>
                        </>
                      ) : (
                        <>
                          <Search size={20} className="group-hover:scale-110 transition-transform duration-300" strokeWidth={2.5} />
                          <span>Search Registry</span>
                          <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform duration-300" strokeWidth={2.5} />
                        </>
                      )}
                    </span>
                  </button>
                </div>

                {/* Error Display with Elegant Styling */}
                {error && (
                  <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-red-50 to-rose-50 border-2 border-red-200 p-5 shadow-sm">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 via-rose-500 to-red-500"></div>
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 mt-0.5">
                        <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                          <div className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse"></div>
                        </div>
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-bold text-red-900 mb-1">Search Error</h4>
                        <p className="text-sm text-red-700 leading-relaxed">{error}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Footer Strip */}
            <div className="px-8 py-4 bg-slate-100 border-t border-slate-200">
              <div className="flex items-center justify-between text-xs text-slate-600">
                <span className="flex items-center gap-2">
                  <span className="inline-block w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                  System Active
                </span>
                <span className="font-medium">Secure Connection Established</span>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative Bottom Element */}
        <div className="flex justify-center mt-8">
          <div className="flex items-center gap-3 px-6 py-3 bg-white/80 backdrop-blur-sm rounded-full shadow-md border border-slate-200">
            <div className="flex -space-x-2">
              <div className="w-8 h-8 bg-emerald-500 rounded-full border-2 border-white"></div>
              <div className="w-8 h-8 bg-teal-500 rounded-full border-2 border-white"></div>
              <div className="w-8 h-8 bg-cyan-500 rounded-full border-2 border-white"></div>
            </div>
            <span className="text-xs font-medium text-slate-600">Presented by EFRAC Ltd.</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistrationSearchTool;