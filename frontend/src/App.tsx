import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import "./index.css";

// ========== COMPONENTS ==========
import WorksheetDashboard from "./components/WorksheetDashboard";
import CreateWorksheet from "./components/CreateWorksheet";
import FormPreview from "./components/FormPreview";

// ========== API & MODELS ==========
import {
  fetchInstruments,
  fetchChemicals,
  fetchStandards,
  fetchColumns,
} from "./services/api";
import type { Instrument } from "./preparation_models/Instrument";
import type { Chemical } from "./preparation_models/Chemical";
import type { Standard } from "./preparation_models/Standard";
import type { Column } from "./preparation_models/Column";

// ========== PAGE ANIMATION ==========
const pageVariants = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 20 },
};

// ========== DASHBOARD PAGE ==========
function DashboardPage() {
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
      <WorksheetDashboard onNavigate={handleNavigation} />
    </motion.div>
  );
}

// ========== CREATE WORKSHEET PAGE ==========
function CreateWorksheetPage() {
  const navigate = useNavigate();

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
      <CreateWorksheet
        onWorksheetCreated={(id) => navigate(`/worksheets/${id}`)}
        onCancel={() => navigate("/")}
      />
    </motion.div>
  );
}

// ========== WORKSHEET PREVIEW PAGE ==========
function WorksheetPreviewPage(props: {
  instruments: Instrument[];
  chemicals: Chemical[];
  standards: Standard[];
  columns: Column[];
  isReferenceDataLoading: boolean;
  referenceDataError: string | null;
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
      {/* Back Button */}
      {/* Back Button */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <button
          onClick={() => navigate("/")}
          className="group relative inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold rounded-xl shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/40 hover:scale-105 active:scale-95 transition-all duration-300 overflow-hidden"
        >
          {/* Animated background shimmer */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          
          {/* Arrow icon with animation */}
          <svg 
            className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform duration-300" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          
          <span className="relative z-10">Back to Dashboard</span>
          
          {/* Pulsing glow effect */}
          <div className="absolute inset-0 rounded-xl bg-emerald-400/20 blur-xl group-hover:bg-emerald-400/30 transition-all duration-300" />
        </button>
      </div>

      <FormPreview
        worksheetId={worksheetId}
        instruments={props.instruments}
        chemicals={props.chemicals}
        standards={props.standards}
        columns={props.columns}
        isReferenceDataLoading={props.isReferenceDataLoading}
        referenceDataError={props.referenceDataError}
      />
    </motion.div>
  );
}

// ========== APP ROOT ==========
function App() {
  // Reference data
  const [instruments, setInstruments] = useState<Instrument[]>([]);
  const [chemicals, setChemicals] = useState<Chemical[]>([]);
  const [standards, setStandards] = useState<Standard[]>([]);
  const [columns, setColumns] = useState<Column[]>([]);
  const [isReferenceDataLoading, setIsReferenceDataLoading] = useState(true);
  const [referenceDataError, setReferenceDataError] = useState<string | null>(null);

  // Load reference data once
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
          <Route path="/" element={<DashboardPage />} />
          <Route path="/worksheets/new" element={<CreateWorksheetPage />} />
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
              />
            }
          />
        </Routes>
      </AnimatePresence>
    </BrowserRouter>
  );
}

export default App;
