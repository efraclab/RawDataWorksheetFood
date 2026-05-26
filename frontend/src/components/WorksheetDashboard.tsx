import { useState, useEffect, useMemo } from "react";
import {
  Search,
  FileSpreadsheet,
  MoreVertical,
  Loader2,
  Filter,
  RefreshCw,
  Plus,
  Clock,
  CheckCircle2,
  FileEdit,
  Hash,
  AlertCircle,
  Beaker,
  LogOut,
  ChevronDown,
  Calendar,
  ClipboardCheck,
  Database,
  ArrowRight,
  BarChart3,
  Trash2,
  Microscope,
  TrendingUp,
  Layers,
} from "lucide-react";
import { fetchAllWorksheets, deleteWorksheet } from "../services/api";
import type { FetchWorksheetRequest } from "../models/FetchWorksheetRequest";
import type { WorksheetSummary } from "../models/WorksheetSummary";
import DeleteWorksheetDialog from "./shared/DeleteWorksheetDialog";

interface WorksheetItem {
  id: number;
  worksheetId?: string;
  registrationNo: string;
  sampleName: string;
  dateOfReceipt?: string;
  numberOfParameters: number;
  status: string;
  createdAt: string;
  lab?: string;
}

interface WorksheetDashboardProps {
  onNavigate: (
    screen: "worksheet" | "create" | "reference-data",
    worksheetId?: string,
    lab?: string
  ) => void;
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
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [error, setError] = useState<string | null>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);

  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean;
    isDeleting: boolean;
    worksheet: WorksheetItem | null;
  }>({ isOpen: false, isDeleting: false, worksheet: null });

  const isReviewer = role.includes("Reviewer");

  useEffect(() => { fetchWorksheets(); }, []);

  const fetchWorksheets = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const requestData: FetchWorksheetRequest = { employeeId, role };
      const response: WorksheetSummary[] = await fetchAllWorksheets(requestData);
      if (response && Array.isArray(response)) {
        setWorksheets(response.map((r, idx) => ({
          id: idx,
          worksheetId: (r as any).worksheetId || undefined,
          registrationNo: r.registrationNo,
          sampleName: r.sampleName || "",
          dateOfReceipt: (r as any).dateOfReceipt || "",
          numberOfParameters: r.numberOfParameters || 0,
          lab: r.lab,
          status: r.status || "Draft",
          createdAt: r.createdAt || new Date().toISOString(),
        })));
      } else {
        setWorksheets([]);
      }
    } catch (error: any) {
      setError(error.message || "Failed to load worksheets");
      setWorksheets([]);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredWorksheets = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return worksheets.filter((ws) => {
      const matchesSearch = !q ||
        ws.worksheetId?.toLowerCase().includes(q) ||
        ws.registrationNo?.toLowerCase().includes(q) ||
        ws.sampleName.toLowerCase().includes(q);
      const matchesStatus = statusFilter === "all" ||
        (statusFilter === "Pending For QA Review" || statusFilter === "Submitted For QA Review"
          ? ws.status === "Submitted For QA Review" || ws.status === "Pending For QA Review"
          : ws.status === statusFilter);
      return matchesSearch && matchesStatus;
    });
  }, [worksheets, searchQuery, statusFilter]);

  const handleWorksheetClick = (worksheet: WorksheetItem) => {
    setOpenMenuId(null);
    onNavigate("worksheet", worksheet.worksheetId, worksheet.lab);
  };

  const handleDeleteClick = (e: React.MouseEvent, worksheet: WorksheetItem) => {
    e.stopPropagation();
    setDeleteDialog({ isOpen: true, isDeleting: false, worksheet });
  };

  const handleDeleteClose = () => {
    if (deleteDialog.isDeleting) return;
    setDeleteDialog({ isOpen: false, isDeleting: false, worksheet: null });
  };

  const handleDeleteConfirm = async () => {
    const ws = deleteDialog.worksheet;
    if (!ws?.worksheetId) return;
    setDeleteDialog((prev) => ({ ...prev, isDeleting: true }));
    try {
      await deleteWorksheet(ws.worksheetId);
      setWorksheets((prev) => prev.filter((w) => w.worksheetId !== ws.worksheetId));
      setDeleteDialog({ isOpen: false, isDeleting: false, worksheet: null });
    } catch (err: any) {
      setDeleteDialog((prev) => ({ ...prev, isDeleting: false }));
      alert(err.message || "Failed to delete worksheet.");
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    } catch { return dateString; }
  };

  const getStatusConfig = (status: string) => {
    const configs: Record<string, { bg: string; border: string; text: string; icon: any; dot: string; glow: string }> = {
      Draft:                      { bg: "bg-gradient-to-r from-amber-50 to-orange-50",   border: "border-amber-200",  text: "text-amber-600",   icon: FileEdit,      dot: "bg-amber-400",   glow: "shadow-amber-100" },
      "Submitted For Analysis":   { bg: "bg-gradient-to-r from-blue-50 to-indigo-50",    border: "border-blue-200",   text: "text-blue-600",    icon: Clock,         dot: "bg-blue-400",    glow: "shadow-blue-100" },
      "Pending For Review":       { bg: "bg-gradient-to-r from-orange-50 to-red-50",     border: "border-orange-200", text: "text-orange-600",  icon: ClipboardCheck,dot: "bg-orange-400",  glow: "shadow-orange-100" },
      Approved:                   { bg: "bg-gradient-to-r from-emerald-50 to-teal-50",   border: "border-emerald-200",text: "text-emerald-600", icon: CheckCircle2,  dot: "bg-emerald-400", glow: "shadow-emerald-100" },
      "Pending For QA Review":    { bg: "bg-gradient-to-r from-purple-50 to-violet-50",  border: "border-purple-200", text: "text-purple-600",  icon: ClipboardCheck,dot: "bg-purple-400",  glow: "shadow-purple-100" },
      "Submitted For QA Review":  { bg: "bg-gradient-to-r from-purple-50 to-violet-50",  border: "border-purple-200", text: "text-purple-600",  icon: ClipboardCheck,dot: "bg-purple-400",  glow: "shadow-purple-100" },
    };
    return configs[status] || configs.Draft;
  };

  const stats = {
    total: worksheets.length,
    draft: worksheets.filter((f) => f.status === "Draft").length,
    inAnalysis: worksheets.filter((f) => f.status === "Submitted For Analysis").length,
    pendingReview: worksheets.filter((f) => f.status === "Pending For Review").length,
    pendingQA: worksheets.filter((f) => f.status === "Submitted For QA Review" || f.status === "Pending For QA Review").length,
    approved: worksheets.filter((f) => f.status === "Approved").length,
  };

  const statusFilters: { label: string; value: string; count: number; dot: string; active: string; pill: string }[] =
    role.includes("QA") && !role.includes("Reviewer")
      ? [
          { label: "All",               value: "all",                    count: stats.total,        dot: "bg-slate-400",   active: "bg-slate-600 text-white border-slate-600",     pill: "bg-slate-100 text-slate-500" },
          { label: "Pending QA Review", value: "Pending For QA Review",  count: stats.pendingQA,    dot: "bg-purple-400",  active: "bg-purple-500 text-white border-purple-500",   pill: "bg-purple-50 text-purple-600" },
          { label: "Approved",          value: "Approved",               count: stats.approved,     dot: "bg-emerald-400", active: "bg-emerald-500 text-white border-emerald-500", pill: "bg-emerald-50 text-emerald-600" },
        ]
      : [
          { label: "All",               value: "all",                    count: stats.total,        dot: "bg-slate-400",   active: "bg-slate-600 text-white border-slate-600",     pill: "bg-slate-100 text-slate-500" },
          ...(role.includes("Reviewer")
            ? [{ label: "Draft",        value: "Draft",                  count: stats.draft,        dot: "bg-amber-400",   active: "bg-amber-500 text-white border-amber-500",     pill: "bg-amber-50 text-amber-600" }]
            : []),
          { label: "In Analysis",       value: "Submitted For Analysis", count: stats.inAnalysis,   dot: "bg-blue-400",    active: "bg-blue-500 text-white border-blue-500",       pill: "bg-blue-50 text-blue-600" },
          { label: "Pending Review",    value: "Pending For Review",     count: stats.pendingReview,dot: "bg-orange-400",  active: "bg-orange-500 text-white border-orange-500",   pill: "bg-orange-50 text-orange-600" },
          { label: "Submitted For QA",  value: "Submitted For QA Review",count: stats.pendingQA,    dot: "bg-purple-400",  active: "bg-purple-500 text-white border-purple-500",   pill: "bg-purple-50 text-purple-600" },
          { label: "Approved",          value: "Approved",               count: stats.approved,     dot: "bg-emerald-400", active: "bg-emerald-500 text-white border-emerald-500", pill: "bg-emerald-50 text-emerald-600" },
        ];

  const firstName = username.split(" ")[0];
  const initials = username.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/30">
      <style>{`
        /* ── Keyframes ─────────────────────────────────────── */
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.90) translateY(6px); }
          to   { opacity: 1; transform: scale(1)    translateY(0); }
        }
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-16px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes popIn {
          0%   { opacity: 0; transform: scale(0.6) rotate(-8deg); }
          65%  { transform: scale(1.08) rotate(2deg); }
          100% { opacity: 1; transform: scale(1)    rotate(0deg); }
        }
        @keyframes floatSlow {
          0%, 100% { transform: translateY(0)    rotate(0deg); }
          33%       { transform: translateY(-10px) rotate(1.5deg); }
          66%       { transform: translateY(4px)   rotate(-1deg); }
        }
        @keyframes morphBlob {
          0%, 100% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
          50%       { border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%; }
        }
        @keyframes gradientFlow {
          0%   { background-position: 0%   50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0%   50%; }
        }
        @keyframes shimmerSweep {
          0%   { transform: translateX(-120%); }
          100% { transform: translateX(120%); }
        }
        @keyframes pulseDot {
          0%, 100% { opacity: 1;    transform: scale(1);    }
          50%       { opacity: 0.55; transform: scale(1.3);  }
        }
        @keyframes glowRing {
          0%, 100% { box-shadow: 0 0 0 0   rgba(52,211,153,0);    }
          50%       { box-shadow: 0 0 16px 4px rgba(52,211,153,0.22); }
        }
        @keyframes countUp {
          from { opacity: 0; transform: translateY(8px) scale(0.85); }
          to   { opacity: 1; transform: translateY(0)   scale(1); }
        }
        @keyframes rippleRing {
          0%   { transform: scale(0.7); opacity: 0.6; }
          100% { transform: scale(2.2); opacity: 0; }
        }
        @keyframes textShimmer {
          0%   { background-position: -200% center; }
          100% { background-position:  200% center; }
        }
        @keyframes underlineGrow {
          from { transform: scaleX(0); }
          to   { transform: scaleX(1); }
        }
        @keyframes iconBounce {
          0%, 100% { transform: translateY(0); }
          40%       { transform: translateY(-5px); }
          60%       { transform: translateY(-2px); }
        }
        @keyframes borderGlow {
          0%, 100% { border-color: rgba(52,211,153,0.3); }
          50%       { border-color: rgba(52,211,153,0.8); }
        }

        /* ── Utility classes ────────────────────────────────── */
        .anim-fadeInUp    { animation: fadeInUp    0.55s cubic-bezier(0.16,1,0.3,1) both; }
        .anim-fadeInDown  { animation: fadeInDown  0.4s  cubic-bezier(0.16,1,0.3,1) both; }
        .anim-fadeIn      { animation: fadeIn      0.35s ease both; }
        .anim-scaleIn     { animation: scaleIn     0.4s  cubic-bezier(0.16,1,0.3,1) both; }
        .anim-slideInLeft { animation: slideInLeft 0.4s  cubic-bezier(0.16,1,0.3,1) both; }
        .anim-popIn       { animation: popIn       0.45s cubic-bezier(0.16,1,0.3,1) both; }

        .status-dot { animation: pulseDot 2.4s ease-in-out infinite; }

        /* Worksheet card */
        .worksheet-card {
          transition: transform 0.32s cubic-bezier(0.34,1.56,0.64,1),
                      box-shadow 0.3s cubic-bezier(0.4,0,0.2,1),
                      border-color 0.22s ease;
        }
        .worksheet-card:hover {
          transform: translateY(-6px) scale(1.015);
          box-shadow: 0 24px 48px -8px rgba(5,150,105,0.14),
                      0 8px 20px -4px rgba(0,0,0,0.07);
          border-color: rgb(110,231,183);
        }

        /* Shimmer sweep overlay */
        .card-shimmer {
          position: absolute; inset: 0; overflow: hidden; border-radius: inherit; pointer-events: none;
        }
        .card-shimmer::after {
          content: '';
          position: absolute; top: 0; left: 0; width: 60%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
          transform: translateX(-120%);
          transition: transform 0s;
        }
        .worksheet-card:hover .card-shimmer::after {
          transform: translateX(260%);
          transition: transform 0.65s ease;
        }

        /* Step card */
        .step-card {
          transition: transform 0.3s cubic-bezier(0.34,1.56,0.64,1),
                      background 0.22s ease,
                      border-color 0.22s ease;
        }
        .step-card:hover {
          transform: translateY(-5px) scale(1.025);
          background: rgba(255,255,255,0.14) !important;
          border-color: rgba(255,255,255,0.3) !important;
        }
        .step-card:hover .step-icon { animation: iconBounce 0.5s ease; }

        /* Stat card */
        .stat-card {
          transition: transform 0.25s cubic-bezier(0.34,1.56,0.64,1),
                      box-shadow 0.25s ease;
          animation: fadeInUp 0.5s cubic-bezier(0.16,1,0.3,1) both;
        }
        .stat-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 24px -4px rgba(0,0,0,0.09);
        }
        .stat-card:hover .stat-icon { animation: iconBounce 0.5s ease; }

        /* Quick card (reviewer actions) */
        .quick-card {
          transition: transform 0.32s cubic-bezier(0.34,1.56,0.64,1),
                      box-shadow 0.3s ease, border-color 0.25s ease;
        }
        .quick-card:hover { transform: translateY(-5px); }

        /* Filter button */
        .filter-btn {
          transition: all 0.2s cubic-bezier(0.4,0,0.2,1);
          position: relative;
        }
        .filter-btn:hover  { transform: translateY(-1px); }
        .filter-btn:active { transform: translateY(0); }

        /* Nav button */
        .nav-action-btn { transition: all 0.18s ease; }
        .nav-action-btn:hover { transform: translateY(-1px); }

        /* Animated gradient nav */
        .nav-gradient {
          background: linear-gradient(-45deg, #064e3b, #065f46, #047857, #0f766e, #1e3a5f);
          background-size: 300% 300%;
          animation: gradientFlow 12s ease infinite;
        }

        /* Morphing blob */
        .morph-blob {
          animation: morphBlob 8s ease-in-out infinite, floatSlow 7s ease-in-out infinite;
        }
        .morph-blob-2 {
          animation: morphBlob 10s ease-in-out infinite reverse, floatSlow 9s ease-in-out infinite reverse;
        }

        /* Glowing icon ring */
        .glow-ring { animation: glowRing 2.8s ease-in-out infinite; }

        /* Connector between steps */
        .connector-line {
          flex: 1; height: 1.5px; min-width: 12px; max-width: 24px;
          background: linear-gradient(90deg, rgba(255,255,255,0.1), rgba(255,255,255,0.35), rgba(255,255,255,0.1));
          border-radius: 1px;
        }

        /* Shimmer text (heading) */
        .shimmer-text {
          background: linear-gradient(90deg, #6ee7b7, #a7f3d0, #34d399, #6ee7b7);
          background-size: 200% auto;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: textShimmer 4s linear infinite;
        }

        /* Floating dots background */
        .dot-grid {
          background-image: radial-gradient(rgba(255,255,255,0.7) 1px, transparent 1px);
          background-size: 20px 20px;
        }

        /* Ripple on stat icons */
        .ripple-ring {
          position: absolute; inset: -4px; border-radius: inherit;
          border: 1.5px solid currentColor; opacity: 0;
        }
        .stat-card:hover .ripple-ring {
          animation: rippleRing 0.7s ease-out forwards;
        }

        /* Count animation */
        .stat-num { animation: countUp 0.6s cubic-bezier(0.16,1,0.3,1) both; }
      `}</style>

      {/* ═══════════════════════════════════════════════════════
           TOP NAVIGATION — animated gradient
          ═══════════════════════════════════════════════════════ */}
      <nav className="sticky top-0 z-50 nav-gradient border-b border-black/10 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.3)]">
        {/* Dot grid texture */}
        <div className="absolute inset-0 dot-grid opacity-[0.035] pointer-events-none" />
        {/* Top shine */}
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-emerald-300/35 to-transparent" />
        {/* Morphing ambient blobs */}
        <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-emerald-400/8 blur-3xl pointer-events-none morph-blob" />
        <div className="absolute top-0 left-1/4 w-40 h-40 rounded-full bg-teal-300/5 blur-2xl pointer-events-none morph-blob-2" />

        <div className="relative max-w-[1800px] mx-auto px-6 py-3.5">
          <div className="flex items-center justify-between gap-4">

            {/* Left: Branding */}
            <div className="flex items-center gap-3.5 anim-slideInLeft">
              <div className="relative">
                <div className="w-10 h-10 bg-white/12 border border-white/22 rounded-xl flex items-center justify-center shadow-lg backdrop-blur-sm glow-ring">
                  <FileSpreadsheet className="w-5 h-5 text-white" />
                </div>
                <span className="absolute -bottom-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-emerald-900 animate-pulse" />
              </div>
              <div>
                <h1 className="text-[15px] font-semibold text-white tracking-wide leading-none">
                  Raw Data Worksheets
                </h1>
                <p className="text-[9.5px] text-emerald-300/70 font-normal tracking-widest mt-0.5 uppercase">
                  {role.includes("Reviewer") ? "Laboratory Management" : "Analysis Dashboard"}
                </p>
              </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2 anim-fadeInDown" style={{ animationDelay: "0.08s" }}>
              {/* Refresh */}
              <button
                onClick={fetchWorksheets}
                disabled={isLoading}
                title="Refresh"
                className="nav-action-btn p-2.5 rounded-xl text-emerald-200/65 hover:text-white hover:bg-white/10 active:bg-white/5 border border-transparent hover:border-white/15 transition-all disabled:opacity-35"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
              </button>

              <div className="w-px h-5 bg-white/12 mx-1" />

              {/* User menu */}
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2.5 pl-1.5 pr-3 py-1.5 bg-white/9 hover:bg-white/16 border border-white/18 hover:border-white/28 rounded-xl transition-all"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-lg flex items-center justify-center shadow-md flex-shrink-0">
                    <span className="text-[11px] font-semibold text-white tracking-wider">{initials}</span>
                  </div>
                  <div className="text-left hidden sm:block">
                    <p className="text-[11px] font-medium text-white leading-none">{username}</p>
                    <p className="text-[9px] text-emerald-300/65 mt-0.5 font-normal">{department}</p>
                  </div>
                  <ChevronDown className={`w-3.5 h-3.5 text-emerald-300/55 transition-transform duration-250 ${showUserMenu ? "rotate-180" : ""}`} />
                </button>

                {showUserMenu && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setShowUserMenu(false)} />
                    <div className="anim-scaleIn absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-slate-200/70 overflow-hidden z-20">
                      <div className="relative p-4 nav-gradient overflow-hidden">
                        <div className="absolute inset-0 dot-grid opacity-[0.04]" />
                        <div className="relative flex items-center gap-3">
                          <div className="w-11 h-11 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                            <span className="text-sm font-semibold text-white">{initials}</span>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-white">{username}</p>
                            <p className="text-[10px] text-emerald-300/75">{department}</p>
                            <p className="text-[9px] text-emerald-400/55 mt-0.5 font-mono">ID: {employeeId}</p>
                          </div>
                        </div>
                      </div>
                      <div className="px-3 py-2 border-b border-slate-100">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded-full text-[10px] font-medium uppercase tracking-wider">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          {role}
                        </span>
                      </div>
                      <div className="p-2">
                        <button
                          onClick={onLogout}
                          className="w-full flex items-center gap-2.5 px-3 py-2.5 text-red-500 hover:bg-red-50 rounded-xl transition-colors text-sm font-medium"
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
      </nav>

      {/* ═══════════════════════════════════════════════════════
           MAIN CONTENT
          ═══════════════════════════════════════════════════════ */}
      <div className="max-w-[1800px] mx-auto px-6 py-6 space-y-5">

        {/* ── Reviewer quick-action cards ── */}
        {role.includes("Reviewer") && (
          <div className="anim-fadeInUp" style={{ animationDelay: "0.05s" }}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

              {/* Reference Management */}
              <div
                onClick={() => onNavigate("reference-data")}
                className="quick-card group bg-white rounded-2xl border border-slate-200 hover:border-blue-300 shadow-sm hover:shadow-xl overflow-hidden cursor-pointer"
              >
                <div className="relative p-5">
                  <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-blue-50/50 to-indigo-50/40 rounded-full blur-3xl pointer-events-none group-hover:scale-130 transition-transform duration-700" />
                  <div className="relative flex items-center gap-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-2xl flex items-center justify-center shadow-md group-hover:scale-110 group-hover:shadow-blue-400/35 transition-all duration-350 flex-shrink-0">
                      <Database className="w-6 h-6 text-white/90" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-[15px] font-medium text-slate-700 mb-0.5 group-hover:text-blue-600 transition-colors">Reference Management</h3>
                      <p className="text-xs text-slate-400 leading-relaxed font-normal">Chemicals, instruments &amp; standards</p>
                    </div>
                    <div className="flex-shrink-0 flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-blue-400 to-indigo-500 text-white text-xs font-medium rounded-xl shadow-sm group-hover:shadow-blue-400/30 transition-all duration-200">
                      <span>Open</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                </div>
                <div className="h-0.5 bg-gradient-to-r from-blue-300 via-indigo-400 to-violet-400 opacity-0 group-hover:opacity-100 transition-opacity duration-400" />
              </div>

              {/* RawData Analysis */}
              <div
                onClick={() => onNavigate("create")}
                className="quick-card group bg-white rounded-2xl border border-slate-200 hover:border-emerald-300 shadow-sm hover:shadow-xl overflow-hidden cursor-pointer"
              >
                <div className="relative p-5">
                  <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-emerald-50/50 to-teal-50/40 rounded-full blur-3xl pointer-events-none group-hover:scale-130 transition-transform duration-700" />
                  <div className="relative flex items-center gap-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-md group-hover:scale-110 group-hover:shadow-emerald-400/35 transition-all duration-350 flex-shrink-0">
                      <BarChart3 className="w-6 h-6 text-white/90" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-[15px] font-medium text-slate-700 mb-0.5 group-hover:text-emerald-600 transition-colors">RawData Analysis</h3>
                      <p className="text-xs text-slate-400 leading-relaxed font-normal">Create &amp; manage analysis worksheets</p>
                    </div>
                    <div className="flex-shrink-0 flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-xs font-medium rounded-xl shadow-sm group-hover:shadow-emerald-400/30 transition-all duration-200">
                      <Plus className="w-3.5 h-3.5" />
                      <span>Create</span>
                    </div>
                  </div>
                </div>
                <div className="h-0.5 bg-gradient-to-r from-emerald-300 via-teal-400 to-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity duration-400" />
              </div>
            </div>
          </div>
        )}

        {/* ── QA Hero ── */}
        {role.includes("QA") && !role.includes("Reviewer") && (
          <div className="anim-fadeInUp" style={{ animationDelay: "0.05s" }}>
            <HeroSection
              firstName={firstName}
              subtitle="You are the final quality gate. Verify reviewer-approved parameters, request revisions if needed, and close worksheets with full approval."
              steps={[
                { num: 1, color: "from-emerald-400 to-teal-500",  iconBg: "bg-emerald-400/20", icon: <FileSpreadsheet className="w-4 h-4 text-emerald-200" />, title: "Open Worksheet",   desc: "Pick a worksheet submitted for QA by reviewer" },
                { num: 2, color: "from-teal-400 to-cyan-500",     iconBg: "bg-teal-400/20",    icon: <ClipboardCheck  className="w-4 h-4 text-teal-200"    />, title: "Check Params",    desc: "Verify each reviewer-approved parameter is correct" },
                { num: 3, color: "from-amber-400 to-orange-500",  iconBg: "bg-amber-400/20",   icon: <FileEdit        className="w-4 h-4 text-amber-200"    />, title: "Request Revision",desc: "Flag issues and return to analyst if needed" },
                { num: 4, color: "from-emerald-400 to-green-500", iconBg: "bg-emerald-400/20", icon: <CheckCircle2    className="w-4 h-4 text-emerald-200"  />, title: "Approve All",     desc: "Approve every parameter once all pass verification" },
                { num: 5, color: "from-green-400 to-emerald-500", iconBg: "bg-green-400/20",   icon: <BarChart3       className="w-4 h-4 text-green-200"    />, title: "Close Worksheet", desc: "Mark the full worksheet as officially approved" },
              ]}
            />
          </div>
        )}

        {/* ── Analyst Hero ── */}
        {!role.includes("Reviewer") && !role.includes("QA") && (
          <div className="anim-fadeInUp" style={{ animationDelay: "0.05s" }}>
            <HeroSection
              firstName={firstName}
              subtitle="Review and analyze your assigned worksheets with precision. Follow the workflow below to complete your analysis tasks efficiently."
              steps={[
                { num: 1, color: "from-emerald-400 to-teal-500",  iconBg: "bg-emerald-400/20", icon: <Clock          className="w-4 h-4 text-emerald-200" />, title: "Start Analysis",   desc: "Select and begin analyzing assigned worksheets" },
                { num: 2, color: "from-teal-400 to-cyan-500",     iconBg: "bg-teal-400/20",    icon: <ClipboardCheck className="w-4 h-4 text-teal-200"    />, title: "Submit Review",    desc: "Complete analysis and submit for reviewer approval" },
                { num: 3, color: "from-amber-400 to-orange-500",  iconBg: "bg-amber-400/20",   icon: <FileEdit       className="w-4 h-4 text-amber-200"    />, title: "Revise if Needed", desc: "Update analysis based on reviewer feedback" },
                { num: 4, color: "from-emerald-400 to-green-500", iconBg: "bg-emerald-400/20", icon: <CheckCircle2   className="w-4 h-4 text-emerald-200"  />, title: "Approved!",        desc: "Analysis complete and approved by the reviewer" },
              ]}
            />
          </div>
        )}

        {/* ── Stats Strip ── */}
        {!isLoading && worksheets.length > 0 && (
          <div className="anim-fadeInUp" style={{ animationDelay: "0.1s" }}>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {[
                { label: "Total",       value: stats.total,        dot: "bg-slate-400",   bg: "from-slate-50 to-slate-100/50",   border: "border-slate-200/80", text: "text-slate-500", iconCl: "text-slate-400", icon: <Layers     className="w-4 h-4" /> },
                { label: "Draft",       value: stats.draft,        dot: "bg-amber-400",   bg: "from-amber-50 to-orange-50/50",   border: "border-amber-200/80", text: "text-amber-600", iconCl: "text-amber-400", icon: <FileEdit   className="w-4 h-4" /> },
                { label: "In Analysis", value: stats.inAnalysis,   dot: "bg-blue-400",    bg: "from-blue-50 to-indigo-50/50",    border: "border-blue-200/80",  text: "text-blue-600",  iconCl: "text-blue-400",  icon: <TrendingUp className="w-4 h-4" /> },
                { label: "Pending",     value: stats.pendingReview,dot: "bg-orange-400",  bg: "from-orange-50 to-red-50/50",     border: "border-orange-200/80",text: "text-orange-600",iconCl: "text-orange-400",icon: <Clock      className="w-4 h-4" /> },
                { label: "QA Review",   value: stats.pendingQA,    dot: "bg-purple-400",  bg: "from-purple-50 to-violet-50/50",  border: "border-purple-200/80",text: "text-purple-600",iconCl: "text-purple-400",icon: <ClipboardCheck className="w-4 h-4" /> },
                { label: "Approved",    value: stats.approved,     dot: "bg-emerald-400", bg: "from-emerald-50 to-teal-50/50",   border: "border-emerald-200/80",text:"text-emerald-600",iconCl:"text-emerald-400",icon: <CheckCircle2 className="w-4 h-4" /> },
              ].map((s, i) => (
                <div
                  key={s.label}
                  style={{ animationDelay: `${0.1 + i * 0.04}s` }}
                  className={`stat-card bg-gradient-to-br ${s.bg} border ${s.border} rounded-xl px-4 py-3 flex items-center gap-3`}
                >
                  <div className={`relative w-8 h-8 rounded-lg bg-white/80 shadow-sm flex items-center justify-center flex-shrink-0 ${s.iconCl} stat-icon`}>
                    <div className={`ripple-ring ${s.iconCl}`} />
                    {s.icon}
                  </div>
                  <div className="min-w-0">
                    <p className={`text-xl font-semibold ${s.text} leading-none stat-num`} style={{ animationDelay: `${0.15 + i * 0.04}s` }}>{s.value}</p>
                    <p className={`text-[10px] font-medium uppercase tracking-wider ${s.text} opacity-60 mt-0.5`}>{s.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Search + Filter ── */}
        <div className="anim-fadeInUp" style={{ animationDelay: "0.15s" }}>
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-slate-200/70 shadow-sm overflow-hidden">
            <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-100/80">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-350 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search by worksheet ID, registration no., or sample name…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-50/70 border border-slate-200/80 rounded-xl text-sm text-slate-600 placeholder-slate-350 focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:border-transparent transition-all font-normal"
                />
              </div>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="text-xs text-slate-400 hover:text-slate-600 font-medium px-2.5 py-1.5 rounded-lg hover:bg-slate-100 transition-all whitespace-nowrap"
                >
                  Clear
                </button>
              )}
              <div className="h-5 w-px bg-slate-200/80" />
              <span className="text-xs text-slate-400 whitespace-nowrap font-normal">
                <span className="font-semibold text-slate-600">{filteredWorksheets.length}</span>
                <span className="text-slate-350"> / {worksheets.length}</span>
              </span>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-2.5 overflow-x-auto scrollbar-none">
              <Filter className="w-3.5 h-3.5 text-slate-350 flex-shrink-0 mr-0.5" />
              {statusFilters.map((s) => {
                const isActive = statusFilter === s.value;
                return (
                  <button
                    key={s.value}
                    onClick={() => setStatusFilter(s.value)}
                    className={`filter-btn inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border whitespace-nowrap cursor-pointer ${
                      isActive
                        ? `${s.active} shadow-sm`
                        : "bg-white text-slate-500 border-slate-200/80 hover:border-slate-300 hover:bg-slate-50"
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${isActive ? "bg-white/70" : s.dot}`} />
                    {s.label}
                    <span className={`px-1.5 py-px rounded-lg text-[10px] font-medium ${isActive ? "bg-white/20 text-white" : s.pill}`}>
                      {s.count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── Worksheet Grid ── */}
        <div className="anim-fadeInUp" style={{ animationDelay: "0.2s" }}>
          <div className="bg-white/75 backdrop-blur-sm rounded-2xl border border-slate-200/70 shadow-sm p-5">
            {isLoading ? (
              <LoadingState />
            ) : error ? (
              <ErrorState error={error} onRetry={fetchWorksheets} />
            ) : filteredWorksheets.length === 0 ? (
              <EmptyState
                searchQuery={searchQuery}
                statusFilter={statusFilter}
                isReviewer={isReviewer}
                onClear={() => { setSearchQuery(""); setStatusFilter("all"); }}
                onCreate={() => onNavigate("create")}
              />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 2xl:grid-cols-5 gap-4">
                {filteredWorksheets.map((worksheet, index) => {
                  const sc = getStatusConfig(worksheet.status);
                  return (
                    <div
                      key={worksheet.id}
                      onClick={() => handleWorksheetClick(worksheet)}
                      style={{ animationDelay: `${index * 30}ms` }}
                      className="anim-fadeInUp worksheet-card flex flex-col h-full group bg-white border border-slate-200 rounded-2xl cursor-pointer shadow-sm"
                    >
                      {/* Shimmer sweep */}
                      <div className="card-shimmer" />

                      {/* Header — animated gradient */}
                      <div className="relative nav-gradient px-4 py-3.5 overflow-hidden rounded-t-2xl">
                        <div className="absolute inset-0 dot-grid opacity-[0.04] pointer-events-none" />
                        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-emerald-300/25 to-transparent" />
                        {/* Morphing blob decoration */}
                        <div className="absolute -top-4 -right-4 w-16 h-16 bg-teal-300/10 blur-xl pointer-events-none group-hover:scale-150 transition-transform duration-700 morph-blob" />
                        <div className="relative flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5 mb-1">
                              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-300/70 flex-shrink-0" />
                              <h3 className="text-sm font-medium text-white/90 truncate tracking-wide">
                                {worksheet.worksheetId}
                              </h3>
                            </div>
                            <p className="text-[10px] text-emerald-200/50 font-mono truncate tracking-wide">
                              {worksheet.registrationNo}
                            </p>
                          </div>
                          {isReviewer && (
                            <div className="relative flex-shrink-0">
                              <button
                                onClick={(e) => { e.stopPropagation(); setOpenMenuId(openMenuId === worksheet.id ? null : worksheet.id); }}
                                className="w-7 h-7 rounded-lg flex items-center justify-center text-emerald-200/45 hover:text-white hover:bg-white/12 transition-colors"
                              >
                                <MoreVertical className="w-4 h-4" />
                              </button>
                              {openMenuId === worksheet.id && (
                                <>
                                  <div className="fixed inset-0 z-10" onClick={(e) => { e.stopPropagation(); setOpenMenuId(null); }} />
                                  <div className="anim-scaleIn absolute right-0 top-8 z-20 w-40 bg-white rounded-xl shadow-2xl border border-slate-200/80 overflow-hidden">
                                    <button
                                      onClick={(e) => { e.stopPropagation(); setOpenMenuId(null); handleDeleteClick(e, worksheet); }}
                                      className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors font-medium"
                                    >
                                      <Trash2 className="w-4 h-4" /> Delete
                                    </button>
                                  </div>
                                </>
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Body */}
                      <div className="flex-1 p-4 space-y-3">
                        {/* Sample name */}
                        <div className="flex items-start gap-2">
                          <Beaker className="w-3.5 h-3.5 text-emerald-400/70 flex-shrink-0 mt-0.5" />
                          <p className="text-xs font-normal text-slate-600 line-clamp-2 leading-relaxed">
                            {worksheet.sampleName}
                          </p>
                        </div>

                        {/* Meta rows */}
                        <div className="space-y-2 pt-0.5">
                          <MetaRow icon={<Hash className="w-3 h-3" />}       label="Parameters" value={String(worksheet.numberOfParameters)} />
                          <MetaRow icon={<Calendar className="w-3 h-3" />}   label="Created"    value={formatDate(worksheet.createdAt)} />
                          <MetaRow icon={<Microscope className="w-3 h-3" />} label="Lab"        value={worksheet.lab ?? "—"} />
                        </div>
                      </div>

                      {/* Status footer */}
                      <div className={`${sc.bg} border-t ${sc.border} px-4 py-2.5 flex items-center justify-between rounded-b-2xl`}>
                        <div className="flex items-center gap-1.5">
                          <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 status-dot ${sc.dot}`} />
                          <span className={`text-[9.5px] font-medium uppercase tracking-wider ${sc.text}`}>
                            {worksheet.status}
                          </span>
                        </div>
                        <ArrowRight className={`w-3.5 h-3.5 ${sc.text} opacity-0 group-hover:opacity-70 group-hover:translate-x-0.5 transition-all duration-200`} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Dialog */}
      {isReviewer && deleteDialog.worksheet && (
        <DeleteWorksheetDialog
          isOpen={deleteDialog.isOpen}
          isDeleting={deleteDialog.isDeleting}
          worksheetId={deleteDialog.worksheet.worksheetId ?? ""}
          registrationNo={deleteDialog.worksheet.registrationNo}
          sampleName={deleteDialog.worksheet.sampleName}
          status={deleteDialog.worksheet.status}
          numberOfParameters={deleteDialog.worksheet.numberOfParameters}
          onClose={handleDeleteClose}
          onConfirm={handleDeleteConfirm}
        />
      )}
    </div>
  );
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function MetaRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-xs">
      <span className="text-slate-350 flex items-center gap-1.5 font-normal">
        <span className="text-slate-350">{icon}</span>
        {label}
      </span>
      <span className="font-medium text-slate-500 text-right">{value}</span>
    </div>
  );
}

function HeroSection({ firstName, subtitle, steps }: {
  firstName: string;
  subtitle: string;
  steps: { num: number; color: string; iconBg: string; icon: React.ReactNode; title: string; desc: string }[];
}) {
  return (
    <div className="relative nav-gradient rounded-2xl border border-black/8 shadow-xl overflow-hidden">
      {/* Layered backgrounds */}
      <div className="absolute inset-0 dot-grid opacity-[0.035] pointer-events-none" />
      <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-emerald-300/8 blur-3xl pointer-events-none morph-blob" />
      <div className="absolute -bottom-12 left-8  w-56 h-56 rounded-full bg-teal-300/6 blur-3xl pointer-events-none morph-blob-2" />
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-emerald-300/25 to-transparent" />

      <div className="relative px-8 py-8">
        {/* Greeting */}
        <div className="mb-7">
          <div className="flex items-center gap-2 mb-2.5">
            <span className="w-px h-4 rounded-full bg-gradient-to-b from-emerald-300 to-teal-400" />
            <span className="text-[9px] font-medium uppercase tracking-[0.3em] text-emerald-400/70">Dashboard</span>
          </div>
          <h2 className="text-2xl font-light text-white/90 mb-1.5 tracking-wide">
            Welcome back,{" "}
            <span className="shimmer-text font-semibold">{firstName}</span>
            <span className="text-white/90">!</span>
          </h2>
          <p className="text-sm text-emerald-100/55 leading-relaxed max-w-2xl font-light">{subtitle}</p>
        </div>

        {/* Workflow steps */}
        <div className="flex items-stretch gap-0">
          {steps.map((step, i) => (
            <div key={step.num} className="flex items-center flex-1 min-w-0">
              <div className="step-card relative flex-1 bg-white/7 hover:bg-white/13 backdrop-blur-sm rounded-2xl p-4 border border-white/12 cursor-default overflow-hidden">
                {/* Step number badge */}
                <div className={`absolute -top-3 -left-3 w-6 h-6 bg-gradient-to-br ${step.color} rounded-full flex items-center justify-center shadow-md border border-white/20`}>
                  <span className="text-white text-[9px] font-semibold">{step.num}</span>
                </div>
                <div className="flex items-center gap-2 mb-2 mt-1">
                  <div className={`w-7 h-7 ${step.iconBg} rounded-lg flex items-center justify-center flex-shrink-0 step-icon`}>
                    {step.icon}
                  </div>
                  <h4 className="text-[11px] font-medium text-white/85 leading-tight">{step.title}</h4>
                </div>
                <p className="text-[9.5px] text-emerald-100/50 leading-relaxed font-light">{step.desc}</p>
              </div>
              {i < steps.length - 1 && (
                <div className="connector-line mx-1.5 flex-shrink-0" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="relative">
        <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-100/80 flex items-center justify-center shadow-sm">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-400" />
        </div>
        <div className="absolute inset-0 rounded-2xl animate-ping bg-emerald-400/8" style={{ animationDuration: "1.6s" }} />
      </div>
      <p className="text-sm font-normal text-slate-500 mt-5">Loading worksheets…</p>
      <p className="text-xs text-slate-350 mt-1 font-light">Fetching your data</p>
    </div>
  );
}

function ErrorState({ error, onRetry }: { error: string; onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 rounded-2xl bg-red-50 border border-red-100/80 flex items-center justify-center shadow-sm mb-5">
        <AlertCircle className="w-8 h-8 text-red-400" />
      </div>
      <h3 className="text-base font-medium text-slate-600 mb-1.5">Failed to load worksheets</h3>
      <p className="text-sm text-slate-400 mb-5 max-w-sm font-light">{error}</p>
      <button
        onClick={onRetry}
        className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-red-400 to-red-500 hover:from-red-500 hover:to-red-600 text-white rounded-xl text-sm font-medium shadow-sm hover:shadow-md transition-all"
      >
        <RefreshCw className="w-4 h-4" />
        Try Again
      </button>
    </div>
  );
}

function EmptyState({ searchQuery, statusFilter, isReviewer, onClear, onCreate }: {
  searchQuery: string; statusFilter: string; isReviewer: boolean;
  onClear: () => void; onCreate: () => void;
}) {
  const hasFilter = searchQuery || statusFilter !== "all";
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="relative mb-5 anim-popIn">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200/50 border border-slate-200/80 flex items-center justify-center shadow-sm">
          <FileSpreadsheet className="w-10 h-10 text-slate-350" />
        </div>
        {hasFilter && (
          <div className="absolute -top-2 -right-2 w-7 h-7 bg-amber-100 border-2 border-white rounded-full flex items-center justify-center shadow-sm">
            <Filter className="w-3.5 h-3.5 text-amber-500" />
          </div>
        )}
      </div>
      <h3 className="text-base font-medium text-slate-600 mb-2">
        {hasFilter ? "No matching worksheets" : "No worksheets yet"}
      </h3>
      <p className="text-sm text-slate-400 max-w-xs leading-relaxed mb-6 font-light">
        {hasFilter
          ? "Try adjusting your search or clearing the filters"
          : isReviewer
          ? "Create your first worksheet to get started"
          : "No worksheets are available for you at the moment"}
      </p>
      <div className="flex items-center gap-3">
        {hasFilter && (
          <button
            onClick={onClear}
            className="px-4 py-2.5 border border-slate-200 hover:border-slate-300 text-slate-500 rounded-xl text-sm font-medium transition-all hover:bg-slate-50"
          >
            Clear Filters
          </button>
        )}
        {!hasFilter && isReviewer && (
          <button
            onClick={onCreate}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white rounded-xl text-sm font-medium shadow-sm hover:shadow-md transition-all"
          >
            <Plus className="w-4 h-4" />
            Create Worksheet
          </button>
        )}
      </div>
    </div>
  );
}