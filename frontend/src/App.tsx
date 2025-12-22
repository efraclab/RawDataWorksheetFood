import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, useNavigate, useParams, Navigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";
import "./index.css";

import Login from "./components/Login";
import WorksheetDashboard from "./components/WorksheetDashboard";
import CreateWorksheet from "./components/CreateWorksheet";
import Worksheet from "./components/Worksheet";

import type { Instrument } from "./preparation_models/Instrument";
import type { Chemical } from "./preparation_models/Chemical";
import type { Standard } from "./preparation_models/Standard";
import type { Column } from "./preparation_models/Column";

import {
  fetchInstruments,
  fetchChemicals,
  fetchStandards,
  fetchColumns,
} from "./services/api";

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

    if (!decoded || !decoded.exp) return true;
    return decoded.exp * 1000 < Date.now();
  } catch (error) {
    return true;
  }
};

const pageVariants = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 20 },
};

interface AuthenticatedAppProps {
  username: string;
  designation: string;
  onLogout: () => void;
}

function DashboardPage({ username, designation, onLogout }: AuthenticatedAppProps) {
  const navigate = useNavigate();

  const handleNavigation = (screen: "create" | "worksheet", worksheetId?: string) => {
    if (screen === "create") {
      navigate("/worksheets/new");
    } else if (worksheetId) {
      navigate(`/worksheets/${worksheetId}`);
    }
  };

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
      <WorksheetDashboard 
        onNavigate={handleNavigation}
        username={username}
        designation={designation}
        onLogout={onLogout}
      />
    </motion.div>
  );
}

function CreateWorksheetPage({ employeeId }: { employeeId: string }) {
  const navigate = useNavigate();

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
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
}) {
  const { worksheetId } = useParams<{ worksheetId: string }>();
  const navigate = useNavigate();

  if (!worksheetId) return null;

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
      />
    </motion.div>
  );
}

function AuthenticatedApp({ username, designation, onLogout }: AuthenticatedAppProps) {
  const [instruments, setInstruments] = useState<Instrument[]>([]);
  const [chemicals, setChemicals] = useState<Chemical[]>([]);
  const [standards, setStandards] = useState<Standard[]>([]);
  const [columns, setColumns] = useState<Column[]>([]);
  const [isReferenceDataLoading, setIsReferenceDataLoading] = useState(true);
  const [referenceDataError, setReferenceDataError] = useState<string | null>(null);

  const employeeId = localStorage.getItem("EmployeeId") || "Unknown";
  const role = localStorage.getItem("Role") || "Unknown";

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
                username={username} 
                designation={designation} 
                onLogout={onLogout} 
              />
            } 
          />
          <Route path="/worksheets/new" element={<CreateWorksheetPage employeeId={employeeId} />} />
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
              />
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AnimatePresence>
    </BrowserRouter>
  );
}

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [sessionKey, setSessionKey] = useState(Date.now());

  const INACTIVITY_TIMEOUT = 
    localStorage.getItem("EmployeeId") === "admin" ? 1800000 : 3600000;

  const clearAuthData = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("EmployeeId");
    localStorage.removeItem("Username");
    localStorage.removeItem("Designation");
    localStorage.removeItem("Role");
  };

  const checkAuth = () => {
    const token = localStorage.getItem("authToken");

    if (token && !isTokenExpired(token)) {
      setIsAuthenticated(true);
    } else {
      clearAuthData();
      setIsAuthenticated(false);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    checkAuth();
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

  useEffect(() => {
    if (!isAuthenticated) return;

    let inactivityTimer: ReturnType<typeof setTimeout>;

    const resetTimer = () => {
      clearTimeout(inactivityTimer);
      inactivityTimer = setTimeout(() => {
        handleLogout();
      }, INACTIVITY_TIMEOUT);
    };

    const activityEvents = ["mousemove", "keydown", "scroll", "click"];

    activityEvents.forEach((event) =>
      window.addEventListener(event, resetTimer)
    );

    resetTimer();

    return () => {
      activityEvents.forEach((event) =>
        window.removeEventListener(event, resetTimer)
      );
      clearTimeout(inactivityTimer);
    };
  }, [isAuthenticated, INACTIVITY_TIMEOUT]);

  if (isLoading) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 via-emerald-50 to-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
            <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
          </div>
          <p className="text-slate-700 text-lg font-semibold">Loading...</p>
          <p className="text-slate-500 text-sm mt-1">Initializing Rawdata Worksheet System</p>
        </div>
      </div>
    );
  }

  const username = localStorage.getItem("Username") || "User";
  const designation = localStorage.getItem("Designation") || "Employee";

  return (
    <>
      {isAuthenticated ? (
        <AuthenticatedApp 
          key={sessionKey} 
          username={username}
          designation={designation}
          onLogout={handleLogout}
        />
      ) : (
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </BrowserRouter>
      )}
    </>
  );
}