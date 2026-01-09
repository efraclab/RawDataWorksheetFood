import { useState, useEffect } from "react";
import {
  Search,
  FileSpreadsheet,
  ChevronRight,
  Loader2,
  Filter,
  RefreshCw,
  Plus,
  Clock,
  CheckCircle2,
  FileEdit,
  TrendingUp,
  Hash,
  AlertCircle,
  Beaker,
  User,
  LogOut,
  ChevronDown,
  Calendar,
  ClipboardCheck,
} from "lucide-react";
import { fetchAllWorksheets } from "../services/api";
import type { FetchWorksheetRequest } from "../models/FetchWorksheetRequest";
import type { WorksheetSummary } from "../models/WorksheetSummary";

interface WorksheetItem {
  id: number;
  worksheetId?: string;
  registrationNo: string;
  sampleName: string;
  dateOfReceipt?: string;
  numberOfParameters: number;
  status: string;
  createdAt: string;
}

interface WorksheetDashboardProps {
  onNavigate: (screen: "worksheet" | "create", worksheetId?: string) => void;
  employeeId: string;
  username: string;
  department: string;
  role: string;
  onLogout: () => void;
}

export default function WorksheetDashboard({
  onNavigate,
  employeeId,
  username,
  department,
  role,
  onLogout,
}: WorksheetDashboardProps) {
  const [worksheets, setWorksheets] = useState<WorksheetItem[]>([]);
  const [filteredWorksheets, setFilteredWorksheets] = useState<WorksheetItem[]>(
    []
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [error, setError] = useState<string | null>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    fetchWorksheets();
  }, []);

  useEffect(() => {
    filterWorksheets();
  }, [searchQuery, worksheets, statusFilter]);

  const fetchWorksheets = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const requestData: FetchWorksheetRequest = { employeeId, role };

      const response: WorksheetSummary[] = await fetchAllWorksheets(
        requestData
      );
      if (response && Array.isArray(response)) {
        const mapped = response.map((r, idx) => ({
          id: idx,
          worksheetId: (r as any).worksheetId || undefined,
          registrationNo: r.registrationNo,
          sampleName: r.sampleName || "",
          dateOfReceipt: (r as any).dateOfReceipt || "",
          numberOfParameters: r.numberOfParameters || 0,
          status: r.status || "Draft",
          createdAt: r.createdAt || new Date().toISOString(),
        }));

        setWorksheets(mapped);
        setFilteredWorksheets(mapped);
      } else {
        setWorksheets([]);
        setFilteredWorksheets([]);
      }
    } catch (error: any) {
      console.error("Error fetching worksheets:", error);
      setError(error.message || "Failed to load worksheets");
      setWorksheets([]);
      setFilteredWorksheets([]);
    } finally {
      setIsLoading(false);
    }
  };

  const filterWorksheets = () => {
    let filtered = worksheets;

    if (searchQuery) {
      filtered = filtered.filter(
        (ws) =>
          ws.worksheetId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          ws.registrationNo
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          ws.sampleName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((ws) => ws.status === statusFilter);
    }

    setFilteredWorksheets(filtered);
  };

  const handleWorksheetClick = (worksheet: WorksheetItem) => {
    const idToPass = worksheet.worksheetId;
    onNavigate("worksheet", idToPass);
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  const getStatusConfig = (status: string) => {
    const configs = {
      Draft: {
        bg: "bg-gradient-to-br from-amber-50 to-orange-50",
        border: "border-amber-200",
        text: "text-amber-700",
        icon: FileEdit,
        dot: "bg-amber-500",
      },
      "Submitted For Analysis": {
        bg: "bg-gradient-to-br from-blue-50 to-indigo-50",
        border: "border-blue-200",
        text: "text-blue-700",
        icon: Clock,
        dot: "bg-blue-500",
      },
      "Pending For Review": {
        bg: "bg-gradient-to-br from-orange-50 to-red-50",
        border: "border-orange-200",
        text: "text-orange-700",
        icon: ClipboardCheck,
        dot: "bg-orange-500",
      },
      Approved: {
        bg: "bg-gradient-to-br from-emerald-50 to-teal-50",
        border: "border-emerald-200",
        text: "text-emerald-700",
        icon: CheckCircle2,
        dot: "bg-emerald-500",
      },
    };
    return configs[status as keyof typeof configs] || configs.Draft;
  };

  const stats = {
    total: worksheets.length,
    draft: worksheets.filter((f) => f.status === "Draft").length,
    submitted: worksheets.filter((f) => f.status === "Submitted For Analysis")
      .length,
    pendingReview: worksheets.filter((f) => f.status === "Pending For Review")
      .length,
    approved: worksheets.filter((f) => f.status === "Approved").length,
  };

  // Build stats cards based on role
  const statsCards = [
    {
      label: "Total Worksheets",
      value: stats.total,
      icon: FileSpreadsheet,
      color: "slate",
      bgGradient: "from-slate-500 to-slate-600",
      show: true,
    },
    {
      label: "Draft",
      value: stats.draft,
      icon: FileEdit,
      color: "amber",
      bgGradient: "from-amber-500 to-amber-600",
      show: role.includes("Reviewer"),
    },
    {
      label: "Submitted",
      value: stats.submitted,
      icon: Clock,
      color: "blue",
      bgGradient: "from-blue-500 to-blue-600",
      show: true,
    },
    {
      label: "Pending Review",
      value: stats.pendingReview,
      icon: ClipboardCheck,
      color: "orange",
      bgGradient: "from-orange-500 to-red-600",
      show: true,
    },
    {
      label: "Approved",
      value: stats.approved,
      icon: CheckCircle2,
      color: "emerald",
      bgGradient: "from-emerald-500 to-emerald-600",
      show: true,
    },
  ].filter((card) => card.show);

  // Status filter options based on role
  const statusFilters = [
    { label: "All", value: "all", count: stats.total },
    ...(role.includes("Reviewer")
      ? [{ label: "Draft", value: "Draft", count: stats.draft }]
      : []),
    {
      label: "Submitted",
      value: "Submitted For Analysis",
      count: stats.submitted,
    },
    {
      label: "Pending Review",
      value: "Pending For Review",
      count: stats.pendingReview,
    },
    { label: "Approved", value: "Approved", count: stats.approved },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <style>
        {`
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes slideIn {
            from {
              transform: translateX(-20px);
              opacity: 0;
            }
            to {
              transform: translateX(0);
              opacity: 1;
            }
          }

          @keyframes pulse-dot {
            0%, 100% {
              opacity: 1;
              transform: scale(1);
            }
            50% {
              opacity: 0.7;
              transform: scale(1.1);
            }
          }

          @keyframes shimmer {
            0% {
              transform: translateX(-100%);
            }
            100% {
              transform: translateX(100%);
            }
          }

          .animate-fadeIn {
            animation: fadeIn 0.5s ease-out forwards;
          }

          .animate-slideIn {
            animation: slideIn 0.5s ease-out forwards;
          }

          .status-dot {
            animation: pulse-dot 2s ease-in-out infinite;
          }

          .worksheet-card {
            animation: fadeIn 0.5s ease-out forwards;
            position: relative;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          }

          .worksheet-card:hover {
            transform: translateY(-4px);
            border-color: rgb(16 185 129);
          }

          .worksheet-card:hover .shimmer-effect {
            animation: shimmer 1.5s ease-in-out;
          }

          .shimmer-effect {
            background: linear-gradient(
              90deg,
              transparent,
              rgba(255, 255, 255, 0.3),
              transparent
            );
          }
        `}
      </style>

      {/* Top Navigation Bar */}
      <div className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-50">
        <div className="max-w-[1800px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Left: Logo and Title */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center shadow-md">
                  <FileSpreadsheet className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-slate-800">
                    Raw Data Worksheets
                  </h1>
                  <p className="text-xs text-slate-500">
                    {role.includes("Reviewer")
                      ? "Laboratory Management"
                      : "Analysis Dashboard"}
                  </p>
                </div>
              </div>
            </div>

            {/* Right: User Menu and Actions */}
            <div className="flex items-center gap-3">
              {/* Refresh Button */}
              <button
                onClick={fetchWorksheets}
                disabled={isLoading}
                className="p-2 text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all disabled:opacity-50"
                title="Refresh worksheets"
              >
                <RefreshCw
                  className={`w-5 h-5 ${isLoading ? "animate-spin" : ""}`}
                />
              </button>

              {/* Create New Button (Reviewer only) */}
              {role.includes("Reviewer") && (
                <button
                  onClick={() => onNavigate("create")}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-lg hover:shadow-lg transition-all text-sm font-medium"
                >
                  <Plus className="w-4 h-4" />
                  <span className="hidden sm:inline">New Worksheet</span>
                </button>
              )}

              {/* User Menu */}
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 px-3 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <div className="text-left hidden md:block">
                    <p className="text-xs font-semibold text-slate-800">
                      {username}
                    </p>
                    <p className="text-[10px] text-slate-500">{department}</p>
                  </div>
                  <ChevronDown className="w-4 h-4 text-slate-600" />
                </button>

                {showUserMenu && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setShowUserMenu(false)}
                    />
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden z-20 animate-fadeIn">
                      <div className="p-4 bg-gradient-to-br from-emerald-50 to-teal-50 border-b border-slate-200">
                        <p className="font-semibold text-slate-800">
                          {username}
                        </p>
                        <p className="text-xs text-slate-600">{department}</p>
                        <p className="text-xs text-slate-500 mt-1">
                          ID: {employeeId}
                        </p>
                      </div>
                      <div className="p-2">
                        <button
                          onClick={onLogout}
                          className="w-full flex items-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm font-medium"
                        >
                          <LogOut className="w-4 h-4" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1800px] mx-auto px-6 py-6">
        {/* Stats Grid */}
        <div className="mb-6">
          <div
            className={`grid gap-4 ${
              statsCards.length === 5
                ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-5"
                : statsCards.length === 4
                ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
                : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
            }`}
          >
            {statsCards.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.label}
                  style={{ animationDelay: `${index * 50}ms` }}
                  className="animate-slideIn bg-white rounded-xl border border-slate-200 shadow-sm p-4 hover:shadow-lg transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div
                      className={`w-10 h-10 rounded-lg bg-gradient-to-br ${stat.bgGradient} flex items-center justify-center group-hover:scale-110 transition-transform`}
                    >
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <TrendingUp className="w-4 h-4 text-slate-400 group-hover:text-emerald-500 transition-colors" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-800 mb-1">
                    {stat.value}
                  </h3>
                  <p className="text-xs font-medium text-slate-500">
                    {stat.label}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="mb-6 animate-fadeIn">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search by worksheet ID, registration number, or sample name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-slate-400 flex-shrink-0" />
                <div className="flex gap-2 flex-wrap">
                  {statusFilters.map((status) => (
                    <button
                      key={status.value}
                      onClick={() => setStatusFilter(status.value)}
                      className={`px-3 py-2 text-xs font-medium rounded-lg transition-all duration-200 border whitespace-nowrap ${
                        statusFilter === status.value
                          ? "bg-emerald-500 text-white border-emerald-600 shadow-sm"
                          : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:border-slate-300"
                      }`}
                    >
                      {status.label}
                      <span
                        className={`ml-1.5 px-1.5 py-0.5 text-[10px] font-semibold rounded ${
                          statusFilter === status.value
                            ? "bg-emerald-600 text-emerald-100"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {status.count}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          {/* Worksheets Grid */}
          <div className="animate-fadeIn">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center px-12 py-8 bg-white rounded-xl border border-slate-200 shadow-sm">
                <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mb-4">
                  <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
                </div>
                <p className="text-sm font-medium text-slate-600">
                  Loading worksheets...
                </p>
              </div>
            ) : error ? (
              <div className="bg-white rounded-xl border border-red-200 shadow-sm px-12 py-8">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
                    <AlertCircle className="w-8 h-8 text-red-500" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-2">
                    Error Loading Worksheets
                  </h3>
                  <p className="text-sm text-slate-600 mb-4">{error}</p>
                  <button
                    onClick={fetchWorksheets}
                    className="px-5 py-2.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm font-medium shadow-sm"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            ) : filteredWorksheets.length === 0 ? (
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm px-12 py-8">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
                    <FileSpreadsheet className="w-8 h-8 text-slate-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-2">
                    No worksheets found
                  </h3>
                  <p className="text-sm text-slate-500 mb-4">
                    {searchQuery || statusFilter !== "all"
                      ? "Try adjusting your search or filter"
                      : role.includes("Reviewer")
                      ? "Create your first worksheet to get started"
                      : "No worksheets available at the moment"}
                  </p>
                  {!searchQuery &&
                    statusFilter === "all" &&
                    role.includes("Reviewer") && (
                      <button
                        onClick={() => onNavigate("create")}
                        className="px-5 py-2.5 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors text-sm font-medium shadow-sm"
                      >
                        Create New Worksheet
                      </button>
                    )}
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 2xl:grid-cols-5 gap-4">
                {filteredWorksheets.map((worksheet, index) => {
                  const statusConfig = getStatusConfig(worksheet.status);

                  return (
                    <div
                      key={worksheet.id}
                      onClick={() => handleWorksheetClick(worksheet)}
                      style={{ animationDelay: `${index * 30}ms` }}
                      className="flex flex-col h-full worksheet-card group bg-white border border-slate-200 rounded-xl cursor-pointer overflow-hidden shadow-sm hover:shadow-xl"
                    >
                      <div className="shimmer-effect absolute inset-0 pointer-events-none"></div>

                      {/* Card Header */}
                      <div className="bg-slate-50 px-4 py-3 border-b border-slate-200">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <FileSpreadsheet className="w-4 h-4 text-slate-500 flex-shrink-0" />
                              <h3 className="text-sm font-bold text-slate-900 truncate">
                                {worksheet.worksheetId}
                              </h3>
                            </div>
                            <p className="text-xs text-slate-500 font-mono truncate">
                              {worksheet.registrationNo}
                            </p>
                          </div>
                          <ChevronRight className="w-4 h-4 text-slate-400 flex-shrink-0 mt-1" />
                        </div>
                      </div>

                      {/* Card Body */}
                      <div className="p-4">
                        {/* Sample Name */}
                        <div className="mb-4">
                          <div className="flex items-start gap-2">
                            <Beaker className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
                            <p className="text-xs font-medium text-slate-700 line-clamp-2">
                              {worksheet.sampleName}
                            </p>
                          </div>
                        </div>

                        {/* Info Grid */}
                        <div className="space-y-2 mb-4">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-slate-500 flex items-center gap-1.5">
                              <Hash className="w-3.5 h-3.5" />
                              Parameters
                            </span>
                            <span className="font-semibold text-slate-700">
                              {worksheet.numberOfParameters}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-slate-500 flex items-center gap-1.5">
                              <Calendar className="w-3.5 h-3.5" />
                              Created
                            </span>
                            <span className="font-medium text-slate-600">
                              {formatDate(worksheet.createdAt)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div
                        className={`${statusConfig.bg} flex flex-col mt-auto px-3 py-2 border-b ${statusConfig.border}`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <div
                              className={`w-1.5 h-1.5 rounded-full ${statusConfig.dot} status-dot`}
                            ></div>
                            <span
                              className={`text-[10px] font-bold uppercase tracking-wider ${statusConfig.text}`}
                            >
                              {worksheet.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
