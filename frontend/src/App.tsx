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

import type { Instrument } from "./preparation_models/Instrument";
import type { Chemical } from "./preparation_models/Chemical";
import type { Standard } from "./preparation_models/Standard";
import type { Column } from "./preparation_models/Column";
import type { WorksheetDetail } from "./models/WorksheetDetail";

import {
  fetchInstruments,
  fetchChemicals,
  fetchStandards,
  fetchColumns,
} from "./services/api";
import type { Analyst } from "./models/Analyst";

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
  designation: string;
  onLogout: () => void;
}

/* ------------------ Pages ------------------ */

function DashboardPage({
  employeeId,
  role,
  username,
  designation,
  onLogout,
}: AuthenticatedAppProps) {
  const navigate = useNavigate();

  const handleNavigation = (
    screen: "create" | "worksheet",
    worksheetId?: string
  ) => {
    if (screen === "create") navigate("/worksheets/new");
    else if (worksheetId) navigate(`/worksheets/${worksheetId}`);
  };

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate">
      <WorksheetDashboard
        onNavigate={handleNavigation}
        username={username}
        designation={designation}
        employeeId={employeeId}
        role={role}
        onLogout={onLogout}
      />
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
  onPrintRequest: (data: WorksheetDetail, analysts: Analyst[]) => void;
}) {
  const { worksheetId } = useParams<{ worksheetId: string }>();
  const navigate = useNavigate();

  if (!worksheetId) return null;

  const handlePrint = (data: WorksheetDetail, analysts: Analyst[]) => {
    props.onPrintRequest(data, analysts);

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
      className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/30"
    >
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
  designation,
  onLogout,
}: AuthenticatedAppProps) {
  const [instruments, setInstruments] = useState<Instrument[]>([]);
  const [chemicals, setChemicals] = useState<Chemical[]>([]);
  const [standards, setStandards] = useState<Standard[]>([]);
  const [analysts, setAnalysts] = useState<Analyst[]>([]);
  const [columns, setColumns] = useState<Column[]>([]);
  const [isReferenceDataLoading, setIsReferenceDataLoading] = useState(true);
  const [referenceDataError, setReferenceDataError] = useState<string | null>(
    null
  );
  
  // State to hold the data emitted from Worksheet for PrintReport
  const [activeWorksheetData, setActiveWorksheetData] = useState<WorksheetDetail | null>(null);

  useEffect(() => {
    const loadReferenceData = async () => {
      try {
        const [inst, chem, std, col] = await Promise.all([
          fetchInstruments(),
          fetchChemicals(),
          fetchStandards(),
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
                designation={designation}
                onLogout={onLogout}
              />
            }
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
                onPrintRequest={(data, analyst) => {setActiveWorksheetData(data); setAnalysts(analyst)}}
              />
            }
          />
          <Route
            path="/worksheets/:worksheetId/print"
            element={
              <PrintReportPage
              analysts={analysts}
                worksheetInfo={activeWorksheetData}
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

  // const INACTIVITY_TIMEOUT =
  //   localStorage.getItem("EmployeeId") === "admin" ? 1800000 : 3600000;

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
  const designation = localStorage.getItem("Designation") || "Unknown";
  const employeeId = localStorage.getItem("EmployeeId") || "Unknown";
  const role = localStorage.getItem("Role") || "Unknown";

  return isAuthenticated ? (
    <AuthenticatedApp
      key={sessionKey}
      employeeId={employeeId}
      role={role}
      username={username}
      designation={designation}
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