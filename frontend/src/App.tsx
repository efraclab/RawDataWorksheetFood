import { useCallback, useEffect, useRef, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  useNavigate,
  useParams,
  useLocation,
  Navigate,
} from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";
import "./index.css";

import Login from "./components/Login";
import WorksheetDashboard from "./components/WorksheetDashboard";
import CreateWorksheet from "./components/CreateWorksheet";

import FoodWorksheet from "./components/FoodWorksheet";
import DrugPrintReport from "./components/DrugPrintReport";

import WorksheetSidebar from "./components/shared/WorksheetSidebar";
import ResizableSidebar from "./components/shared/ResizableSidebar";

import ReferenceDataManagement from "./components/ReferenceDataManagement";

import type { WorksheetSidebarState, WorksheetSidebarActions } from "./components/shared/WorksheetSidebar";
import type { Instrument } from "./preparation_models/Instrument";
import type { Chemical } from "./preparation_models/Chemical";
import type { Standard } from "./preparation_models/Standard";
import type { WorksheetDetail } from "./models/WorksheetDetail";

import {
  getInstruments,
  getChemicals,
  getStandards,
  getMedia,
  fetchWorksheetById,
  reviewWorksheetWithAI,
  AI_REVIEW_PROMPT,
  // fetchColumns,
} from "./services/api";
import type { Analyst } from "./models/Analyst";
import type { SampleData } from "./models/SampleData";
import type { Media } from "./preparation_models/Media";

const isTokenExpired = (token: string) => {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join(""),
    );
    const decoded = JSON.parse(jsonPayload);
    if (!decoded?.exp) return true;
    return decoded.exp * 1000 < Date.now();
  } catch {
    return true;
  }
};

/* ------------------ Animations ------------------ */

const pageVariants = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 20 },
};

/* ------------------ Types ------------------ */

interface AuthenticatedAppProps {
  employeeId: string;
  role: string;
  username: string;
  department: string;
  onLogout: () => void;
}

/* ------------------ Simple pages (no sidebar) ------------------ */

function DashboardPage({
  employeeId, role, username, department, onLogout,
}: AuthenticatedAppProps) {
  const navigate = useNavigate();
  const handleNavigation = (
    screen: "create" | "worksheet" | "reference-data",
    worksheetId?: string,
    lab?: string,
  ) => {
    if (screen === "create") navigate("/worksheets/new");
    else if (screen === "reference-data") navigate("/reference-data");
    else if (worksheetId) navigate(`/worksheets/${worksheetId}`, { state: { lab } });
  };
  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate">
      <WorksheetDashboard
        onNavigate={handleNavigation}
        username={username}
        department={department}
        employeeId={employeeId}
        role={role}
        onLogout={onLogout}
      />
    </motion.div>
  );
}

function ReferenceDataPage() {
  const navigate = useNavigate();
  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate">
      <ReferenceDataManagement onBack={() => navigate("/")} />
    </motion.div>
  );
}

function CreateWorksheetPage({
  employeeId, department, role,
}: { employeeId: string; department: string; role: string }) {
  const navigate = useNavigate();
  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate">
      <CreateWorksheet
        role={role}
        employeeId={employeeId}
        department={department}
        onWorksheetCreated={(id) => navigate(`/worksheets/${id}`)}
        onCancel={() => navigate("/")}
      />
    </motion.div>
  );
}

/* ------------------
   WorksheetPage
   Owns: shared sidebar state + print overlay state
   The sidebar is rendered HERE (outside Worksheet), so it persists across
   both the worksheet view and the print-preview overlay.

   FIX: onSidebarStateChange and onSidebarActionsReady are now stable
   useCallback references so they don't change on every render, which
   previously caused an infinite loop:
     Worksheet useEffect → setSidebarState/forceRender → App re-renders
     → new inline arrow fn → Worksheet useEffect fires again → ∞
------------------ */

function WorksheetPage(props: {
  instruments: Instrument[];
  chemicals: Chemical[];
  standards: Standard[];
  media: Media[]
  // columns: Column[];
  isReferenceDataLoading: boolean;
  referenceDataError: string | null;
  employeeId: string;
  role: string;
  department: string;
}) {
  const { worksheetId } = useParams<{ worksheetId: string }>();
  const location = useLocation();

  // lab comes from navigation state (set when clicking a worksheet card).
  // Fall back to the user's department if not provided (e.g. direct URL access).
  const lab: string = (location.state as any)?.lab ?? props.department ?? "";
  const isGas = lab.toLowerCase().includes("gas");
  const isDrug = lab.toLowerCase().includes("drug");
  const isEnv = lab.toLowerCase().includes("environment");
  const isFood = lab.toLowerCase().includes("food");//!(isGas || isDrug || isEnv);

  // Always-current reference data for use inside stable refs (updated every render, no re-render triggered).
  const latestRefDataRef = useRef({
    instruments: props.instruments,
    chemicals: props.chemicals,
    standards: props.standards,
    media: props.media,
    employeeId: props.employeeId,
    role: props.role,
  });
  latestRefDataRef.current = {
    instruments: props.instruments,
    chemicals: props.chemicals,
    standards: props.standards,
    media: props.media,
    employeeId: props.employeeId,
    role: props.role,
  };

  // ── Sidebar state (bubbled up from Worksheet) ──────────────────────────
  const [sidebarState, setSidebarState] = useState<WorksheetSidebarState>({
    worksheetId: worksheetId ?? "",
    displayStatus: "",
    sampleName: "",
    registrationNo: "",
    worksheetStatus: null,
    role: props.role,
    isSaving: false,
    saveSuccess: false,
    isSubmitting: false,
    isSubmittingForQA: false,
    isApprovingWorksheet: false,
    showSaveDraft: false,
    showSubmitForAnalysis: false,
    showSubmitForQA: false,
    showApproveWorksheet: false,
    showPrintReport: false,
    isContentLoading: false,
    includeAuditTrail: false,
  });

  // A stable proxy object that always delegates to the latest actionsRef.
  // Because its identity never changes, passing it as a prop to WorksheetSidebar
  // never triggers an unnecessary re-render, yet every button click always
  // calls the most-recently-registered handler from Worksheet.
  const actionsRef = useRef<WorksheetSidebarActions>({
    onBack: () => window.history.back(),
    onSaveDraft: () => { },
    onSubmitForAnalysis: () => { },
    onSubmitForQA: () => { },
    onApproveWorksheet: () => { },
    onPrintReport: () => { },
    onContentReady: () => { },
    onToggleAuditTrail: () => { },
  });

  // stableActions is created once and its methods always delegate through
  // actionsRef so the sidebar never holds a stale handler reference.
  const stableActionsRef = useRef<WorksheetSidebarActions>({
    onBack: () => actionsRef.current.onBack(),
    onSaveDraft: () => actionsRef.current.onSaveDraft(),
    onSubmitForAnalysis: () => actionsRef.current.onSubmitForAnalysis(),
    onSubmitForQA: () => actionsRef.current.onSubmitForQA(),
    onApproveWorksheet: () => actionsRef.current.onApproveWorksheet(),
    onPrintReport: () => actionsRef.current.onPrintReport(),
    onContentReady: () => actionsRef.current.onContentReady(),
    onToggleAuditTrail: () => setIncludeAuditTrail(v => !v),
  });

  const stableAiReviewRef = useRef(async () => {
    const { instruments, chemicals, standards, media, employeeId, role } = latestRefDataRef.current;

    const detail = await fetchWorksheetById(worksheetId!, { employeeId, role });
    if (!detail) throw new Error("Could not fetch worksheet data");

    // Keep only fields relevant to raw data review — strip admin/workflow/timestamp noise
    const { sampleName, sampleCode, sampleQuantity, natureOfSample, lab } = detail.sample;
    const sample = { sampleName, sampleCode, sampleQuantity, natureOfSample, lab };

    const parameters = detail.parameters.map(({
      files, instrumentIds, chemicalIds, standardIds, mediaIds,
      // strip admin / workflow / timestamp fields
      id, paraCode, preparationCompletedBy, preparationCompletedAt,
      approvedByReviewer, approvedByReviewerName, approvedAtReviewer,
      approvedByQA, approvedByQAName, approvedAtQA,
      remarksByReviewer, remarksByQA, submittedQaBy, submittedQaByName,
      analysisStartDate, analysisCompletionDate,
      calculations,
      ...rest
    }: any) => ({
      ...rest,
      instruments: (instrumentIds ?? []).map((i: string) => instruments.find((x: Instrument) => x.id === i.trim())?.name).filter(Boolean),
      chemicals: (chemicalIds ?? []).map((i: string) => chemicals.find((x: Chemical) => x.slno === i.trim())?.name).filter(Boolean),
      standards: (standardIds ?? []).map((i: string) => standards.find((x: Standard) => x.serialNo === i.trim())?.name).filter(Boolean),
      media: (mediaIds ?? []).map((i: string) => media.find((x: Media) => x.id.toString() === i.trim())?.name).filter(Boolean),
    }));

    return reviewWorksheetWithAI({
      source: "RawData",
      operation: "validate_report",
      prompt: AI_REVIEW_PROMPT,
      data: { sample, parameters },
    });
  });

  // ── Print overlay state ────────────────────────────────────────────────
  const [printData, setPrintData] = useState<{
    worksheetInfo: WorksheetDetail;
    analysts: Analyst[];
    sampleData: SampleData;
  } | null>(null);

  // ── Audit trail toggle ─────────────────────────────────────────────────
  const [includeAuditTrail, setIncludeAuditTrail] = useState(false);

  if (!worksheetId) return null;

  // FIX: stable callbacks — no inline arrow functions passed to Worksheet.
  // Previously these were recreated on every render, causing Worksheet's
  // useEffect deps to change every cycle → infinite setState loop.

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const handleSidebarStateChange = useCallback((state: WorksheetSidebarState) => {
    setSidebarState(state);
  }, []); // no deps → created once, never changes

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const handleSidebarActionsReady = useCallback((actions: WorksheetSidebarActions) => {
    // Store in ref only — no setState, so no re-render triggered here.
    // The sidebar reads actionsRef.current directly on each click.
    actionsRef.current = actions;
  }, []); // no deps → created once, never changes

  const handlePrintRequest = (
    worksheetInfo: WorksheetDetail,
    analysts: Analyst[],
    sampleData: SampleData,
  ) => setPrintData({ worksheetInfo, analysts, sampleData });

  const handleClosePrint = () => setPrintData(null);

  const sidebarMode = printData ? "print" : "worksheet";

  return (
    /* ── Sidebar is OUTSIDE all transitions — rendered once, always present ── */
    <div className="flex min-h-screen">
      <ResizableSidebar>
        <WorksheetSidebar
          state={{ ...sidebarState, includeAuditTrail }}
          actions={stableActionsRef.current}
          mode={sidebarMode}
          onClosePrint={handleClosePrint}
        />
      </ResizableSidebar>

      {/* <AiReviewTerminal
        visible={sidebarState.showSubmitForQA && sidebarState.role.toLowerCase() === "reviewer"}
        onReview={() => stableAiReviewRef.current()}
      /> */}

      {/* ── Only the main content area transitions ── */}
      <div className="flex-1 min-w-0">
        <AnimatePresence mode="wait">
          {printData ? (
            <motion.div
              key="print-view"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 40 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="bg-white"
            >
              {isFood ? (
                <DrugPrintReport
                  worksheetInfo={printData.worksheetInfo}
                  analysts={printData.analysts}
                  sampleData={printData.sampleData}
                  instruments={props.instruments}
                  chemicals={props.chemicals}
                  standards={props.standards}
                  onClose={handleClosePrint}
                />
              )   : null}
            </motion.div>
          ) : (
            /* Worksheet view */
            <motion.div
              key="worksheet-view"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/30"
            >
              {
                isFood ? (
                  <FoodWorksheet
                    worksheetId={worksheetId}
                    instruments={props.instruments}
                    chemicals={props.chemicals}
                    standards={props.standards}
                    isReferenceDataLoading={props.isReferenceDataLoading}
                    referenceDataError={props.referenceDataError}
                    employeeId={props.employeeId}
                    role={props.role}
                    department={props.department}
                    onPrint={handlePrintRequest}
                    onSidebarStateChange={handleSidebarStateChange}
                    onSidebarActionsReady={handleSidebarActionsReady}
                  />
                )
                  // : isDrug ? (
                  //   <DrugWorksheet
                  //     worksheetId={worksheetId}
                  //     instruments={props.instruments}
                  //     chemicals={props.chemicals}
                  //     standards={props.standards}
                  //     isReferenceDataLoading={props.isReferenceDataLoading}
                  //     referenceDataError={props.referenceDataError}
                  //     employeeId={props.employeeId}
                  //     role={props.role}
                  //     department={props.department}
                  //     onPrint={handlePrintRequest}
                  //     onSidebarStateChange={handleSidebarStateChange}
                  //     onSidebarActionsReady={handleSidebarActionsReady}
                  //   />
                  // ) 
                  : null
              }
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ------------------ Authenticated App ------------------ */

function AuthenticatedApp({
  employeeId, role, username, department, onLogout,
}: AuthenticatedAppProps) {
  const [instruments, setInstruments] = useState<Instrument[]>([]);
  const [chemicals, setChemicals] = useState<Chemical[]>([]);
  const [standards, setStandards] = useState<Standard[]>([]);
  const [media, setMedia] = useState<Media[]>([]);
  // const [columns, setColumns] = useState<Column[]>([]);
  const [isReferenceDataLoading, setIsReferenceDataLoading] = useState(true);
  const [referenceDataError, setReferenceDataError] = useState<string | null>(null);

  useEffect(() => {
    const loadReferenceData = async () => {
      try {
        const [inst, chem, std, med] = await Promise.all([
          getInstruments(),
          getChemicals(),
          getStandards(),
          getMedia(),
          // fetchColumns(),
        ]);
        setInstruments(inst);
        setChemicals(chem);
        setStandards(std);
        setMedia(med);
        // setColumns(col);
      } catch (e: any) {
        setReferenceDataError(e.message || "Failed to load reference data");
      } finally {
        setIsReferenceDataLoading(false);
      }
    };
    loadReferenceData();
  }, []);

  return (
    <BrowserRouter>
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/" element={
            <DashboardPage
              employeeId={employeeId} role={role} username={username}
              department={department} onLogout={onLogout}
            />
          } />
          <Route path="/reference-data" element={<ReferenceDataPage />} />
          <Route path="/worksheets/new" element={
            <CreateWorksheetPage role={role} department={department} employeeId={employeeId} />
          } />
          {/* Single route — worksheet view AND print preview, sidebar always present */}
          <Route path="/worksheets/:worksheetId" element={
            <WorksheetPage
              instruments={instruments}
              chemicals={chemicals}
              standards={standards}
              media={media}
              // columns={columns}
              isReferenceDataLoading={isReferenceDataLoading}
              referenceDataError={referenceDataError}
              employeeId={employeeId}
              role={role}
              department={department}
            />
          } />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AnimatePresence>
    </BrowserRouter>
  );
}

/* ------------------ Root App ------------------ */

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [sessionKey, setSessionKey] = useState(Date.now());

  const clearAuthData = () => localStorage.clear();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token && !isTokenExpired(token)) setIsAuthenticated(true);
    else clearAuthData();
    setIsLoading(false);
  }, []);

  const handleLoginSuccess = () => { setIsAuthenticated(true); setSessionKey(Date.now()); };
  const handleLogout = () => { clearAuthData(); setIsAuthenticated(false); setSessionKey(Date.now()); };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  const username = localStorage.getItem("Username") || "Unknown";
  const department = localStorage.getItem("Department") || "Unknown";
  const employeeId = localStorage.getItem("EmployeeId") || "Unknown";
  const role = localStorage.getItem("Role") || "Unknown";

  return isAuthenticated ? (
    <AuthenticatedApp
      key={sessionKey}
      employeeId={employeeId} role={role} username={username}
      department={department} onLogout={handleLogout}
    />
  ) : (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}