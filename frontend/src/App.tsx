import { useEffect, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  useNavigate,
  useParams,
  Navigate,
  useLocation,
} from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";
import "./index.css";

import Login from "./components/Login";
import WorksheetDashboard from "./components/WorksheetDashboard";
import CreateWorksheet from "./components/CreateWorksheet";
import Worksheet from "./components/Worksheet";
import PrintReport from "./components/PrintReport";
import ReferenceDataManagement from "./components/ReferenceDataManagement";

import type { Instrument } from "./preparation_models/Instrument";
import type { Chemical } from "./preparation_models/Chemical";
import type { Standard } from "./preparation_models/Standard";
import type { Column } from "./preparation_models/Column";
import type { WorksheetDetail } from "./models/WorksheetDetail";

import {
  getInstruments,
  getChemicals,
  getStandards,
  fetchColumns,
} from "./services/api";
import type { Analyst } from "./models/Analyst";
import type { SampleData } from "./preparation_models/SampleData";

/* ------------------ Auth Helpers ------------------ */

const isTokenExpired = (token: string) => {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
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

/* ------------------ Pages ------------------ */

function DashboardPage({
  employeeId,
  role,
  username,
  department,
  onLogout,
}: AuthenticatedAppProps) {
  const navigate = useNavigate();

  const handleNavigation = (
    screen: "create" | "worksheet" | "reference-data",
    worksheetId?: string
  ) => {
    if (screen === "create") navigate("/worksheets/new");
    else if (screen === "reference-data") navigate("/reference-data");
    else if (worksheetId) navigate(`/worksheets/${worksheetId}`);
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

function CreateWorksheetPage({ employeeId }: { employeeId: string }) {
  const navigate = useNavigate();

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate">
      <CreateWorksheet
        employeeId={employeeId}
        onWorksheetCreated={(id) => navigate(`/worksheets/${id}`)}
        onCancel={() => navigate("/")}
      />
    </motion.div>
  );
}

function WorksheetPreviewPage(props: {
  instruments: Instrument[];
  chemicals: Chemical[];
  standards: Standard[];
  columns: Column[];
  isReferenceDataLoading: boolean;
  referenceDataError: string | null;
  employeeId: string;
  role: string;
  onPrintRequest: (data: WorksheetDetail, analysts: Analyst[], sampleData: SampleData) => void;
}) {
  const { worksheetId } = useParams<{ worksheetId: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  if (!worksheetId) return null;

  const handlePrint = (worksheetInfo: WorksheetDetail, analysts: Analyst[], sampleData: SampleData) => {
    props.onPrintRequest(worksheetInfo, analysts, sampleData);

    console.log("sample received:", sampleData)

    sessionStorage.setItem("printPrevPath", location.pathname);

    navigate(`/worksheets/${worksheetId}/print`, {
      state: { from: location.pathname },
    });
  };

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/30"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <button
          onClick={() => navigate("/")}
          className="group relative inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold rounded-xl shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/40 hover:scale-105 active:scale-95 transition-all duration-300 overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          
          <svg 
            className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform duration-300" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          
          <span className="relative z-10">Back to Dashboard</span>
          
          <div className="absolute inset-0 rounded-xl bg-emerald-400/20 blur-xl group-hover:bg-emerald-400/30 transition-all duration-300" />
        </button>
      </div>

      <Worksheet
        worksheetId={worksheetId}
        instruments={props.instruments}
        chemicals={props.chemicals}
        standards={props.standards}
        columns={props.columns}
        isReferenceDataLoading={props.isReferenceDataLoading}
        referenceDataError={props.referenceDataError}
        employeeId={props.employeeId}
        role={props.role}
        onPrint={handlePrint}
      />
    </motion.div>
  );
}

function PrintReportPage(props: {
  worksheetInfo: WorksheetDetail | null;
  analysts: Analyst[];
  sampleData: SampleData;
  instruments: Instrument[];
  chemicals: Chemical[];
  standards: Standard[];
}) {
  const navigate = useNavigate();
  const location = useLocation();

  const prevPath =
    (location.state as any)?.from ||
    sessionStorage.getItem("printPrevPath") ||
    "/";

  // 🚨 reload case
  if (!props.worksheetInfo) {
    return <Navigate to={prevPath} replace />;
  }

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      className="min-h-screen bg-white"
    >
      <PrintReport
        worksheetInfo={props.worksheetInfo}
        analysts={props.analysts}
        sampleData={props.sampleData}
        instruments={props.instruments}
        chemicals={props.chemicals}
        standards={props.standards}
        onClose={() => navigate(prevPath)}
      />
    </motion.div>
  );
}

/* ------------------ Authenticated App ------------------ */

function AuthenticatedApp({
  employeeId,
  role,
  username,
  department,
  onLogout,
}: AuthenticatedAppProps) {
  const [instruments, setInstruments] = useState<Instrument[]>([]);
  const [chemicals, setChemicals] = useState<Chemical[]>([]);
  const [standards, setStandards] = useState<Standard[]>([]);
  const [analysts, setAnalysts] = useState<Analyst[]>([]);
  const [sampleData, setSampleData] = useState<SampleData>();
  const [columns, setColumns] = useState<Column[]>([]);
  const [isReferenceDataLoading, setIsReferenceDataLoading] = useState(true);
  const [referenceDataError, setReferenceDataError] = useState<string | null>(
    null
  );
  const [activeWorksheetData, setActiveWorksheetData] = useState<WorksheetDetail | null>(null);

  useEffect(() => {
    const loadReferenceData = async () => {
      try {
        const [inst, chem, std, col] = await Promise.all([
          getInstruments(),
          getChemicals(),
          getStandards(),
          fetchColumns(),
        ]);
        setInstruments(inst);
        setChemicals(chem);
        setStandards(std);
        setColumns(col);
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
          <Route
            path="/"
            element={
              <DashboardPage
                employeeId={employeeId}
                role={role}
                username={username}
                department={department}
                onLogout={onLogout}
              />
            }
          />
          <Route
            path="/reference-data"
            element={<ReferenceDataPage />}
          />
          <Route
            path="/worksheets/new"
            element={<CreateWorksheetPage employeeId={employeeId} />}
          />
          <Route
            path="/worksheets/:worksheetId"
            element={
              <WorksheetPreviewPage
                instruments={instruments}
                chemicals={chemicals}
                standards={standards}
                columns={columns}
                isReferenceDataLoading={isReferenceDataLoading}
                referenceDataError={referenceDataError}
                employeeId={employeeId}
                role={role}
                onPrintRequest={(worksheetInfo, analyst, sampleData) => 
                  {setActiveWorksheetData(worksheetInfo); setAnalysts(analyst); setSampleData(sampleData)}}
              />
            }
          />
          <Route
            path="/worksheets/:worksheetId/print"
            element={
              <PrintReportPage
                worksheetInfo={activeWorksheetData}
                analysts={analysts}
                sampleData={sampleData!}
                instruments={instruments}
                chemicals={chemicals}
                standards={standards}
              />
            }
          />
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

  const clearAuthData = () => {
    localStorage.clear();
  };

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token && !isTokenExpired(token)) setIsAuthenticated(true);
    else clearAuthData();
    setIsLoading(false);
  }, []);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    setSessionKey(Date.now());
  };

  const handleLogout = () => {
    clearAuthData();
    setIsAuthenticated(false);
    setSessionKey(Date.now());
  };

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
      employeeId={employeeId}
      role={role}
      username={username}
      department={department}
      onLogout={handleLogout}
    />
  ) : (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={<Login onLoginSuccess={handleLoginSuccess} />}
        />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}