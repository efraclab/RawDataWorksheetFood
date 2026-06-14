import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { type SampleData } from "../models/SampleData";
import type { Instrument } from "../preparation_models/Instrument";
import type { Standard } from "../preparation_models/Standard";
import type { Chemical } from "../preparation_models/Chemical";
import { CgTrash } from "react-icons/cg";
import { BiTestTube } from "react-icons/bi";
import { IoFlask } from "react-icons/io5";
import type { CalculationIcpms } from "../preparation_models/metal/CalculationIcpms";
import type { CalculationIcpoes } from "../preparation_models/metal/CalculationIcpoes";
import type { CalculationIcpmsWater } from "../preparation_models/metal/CalculationIcpmsWater";
import type { CalculationIcpoesWater } from "../preparation_models/metal/CalculationIcpoesWater";
import type { CalculationAasWater } from "../preparation_models/metal/CalculationAasWater";
import type { CalculationIcpmsIchQ3D } from "../preparation_models/metal/CalculationIcpmsIchQ3D";
import type { CalculationORS } from "../preparation_models/metal/CalculationORS";
import type { CalculationAnofer } from "../preparation_models/metal/CalculationAnofer";
import type { CalculationZptoShampoo } from "../preparation_models/metal/CalculationZptoShampoo";
import type { CalculationSodiumLactate } from "../preparation_models/metal/CalculationSodiumLactate";
import type { CalculationLithosun300 } from "../preparation_models/metal/CalculationLithosun300";
import type { SamplePreparationMetal } from "../preparation_models/metal/SamplePreparationMetal";
import type { SamplePreparationMetalStep } from "../preparation_models/metal/SamplePreparationMetalStep";
import type { StandardPreparationMetal } from "../preparation_models/metal/StandardPreparationMetal";
import { areAllMetalPrepsDilutionValid } from "../preparation_models/metal/metalPrepValidation";
import SamplePreparationMetalDetail from "./sub-components/metal/SamplePreparationMetalDetail";
import StandardPreparationMetalDetail from "./sub-components/metal/StandardPreparationMetalDetail";
import CalculationDetailIcpms from "./sub-components/metal/CalculationDetailIcpms";
import CalculationDetailIcpoes from "./sub-components/metal/CalculationDetailIcpoes";
import CalculationDetailIcpmsWater from "./sub-components/metal/CalculationDetailIcpmsWater";
import CalculationDetailIcpoesWater from "./sub-components/metal/CalculationDetailIcpoesWater";
import CalculationDetailAasWater from "./sub-components/metal/CalculationDetailAasWater";
import CalculationDetailIcpmsIchQ3D from "./sub-components/metal/CalculationDetailIcpmsIchQ3D";
import CalculationDetailORS from "./sub-components/metal/CalculationDetailORS";
import CalculationDetailAnofer from "./sub-components/metal/CalculationDetailAnofer";
import CalculationDetailZptoShampoo from "./sub-components/metal/CalculationDetailZptoShampoo";
import CalculationDetailSodiumLactate from "./sub-components/metal/CalculationDetailSodiumLactate";
import CalculationDetailLithosun300 from "./sub-components/metal/CalculationDetailLithosun300";
import AnalystSelectionDialog from "./shared/AnalystSelectionDialog";
import {
  fetchWorksheetById,
  updateWorksheet,
  updateParameter,
  fetchSample,
  fetchAnalysts,
  deleteParameter,
  submitWorksheet,
  addParameter,
  insertWorksheetLog,
} from "../services/api";
import type { WorksheetDetail } from "../models/WorksheetDetail";
import type { WorksheetRequest } from "../models/WorksheetRequest";
import type { ParameterDetail } from "../models/ParameterDetail";
import { type Analyst } from "../models/Analyst";
import type { FetchWorksheetRequest } from "../models/FetchWorksheetRequest";
import SubmitDialog from "./shared/SubmitDialog";
import DeleteParameterDialog from "./shared/DeleteParameterDialog";
import UnlockParameterDialog from "./shared/UnlockParameterDialog";
import CompleteAnalysisDialog from "./shared/CompleteAnalysisDialog";
import CompletePreparationDialog from "./shared/CompletePreparationDialog";
import UnlockPreparationDialog from "./shared/UnlockPreparationDialog";
import StartAnalysisDialog from "./shared/StartAnalysisDialog";
import { BsPlayFill } from "react-icons/bs";
import ApproveParameterDialog from "./shared/ApproveParameterDialog";
import DisapproveParameterDialog from "./shared/DisapproveParameterDialog";
import RevisionRequestDialog from "./shared/RevisionRequestDialog";
import ApproveWorksheetDialog from "./shared/ApproveWorksheetDialog";
import SubmitForQAReviewDialog from "./shared/SubmitForQAReviewDialog";
import Toast from "./shared/Toast";
import { WorksheetDbMapper } from "../helpers/WorksheetDbMapper";
import { MdDone } from "react-icons/md";
import type { SmapleDetailsRequest } from "../models/SmapleDetailsRequest";
import type { BlankPreparation as BlankPreparationModel } from "../preparation_models/drugs/BlankPreparation";
import BlankPreparation from "./sub-components/drugs/BlankPreparation";
import BlankPreparationDetail from "./sub-components/drugs/BlankPreparationDetail";
import type { AttachedFile } from "../models/AttachedFile";
import type { WorksheetFileData } from "../models/WorksheetFileData";
import WorksheetFileAttacher from "./shared/WorksheetFileAttacher";

import type { WorksheetSidebarState, WorksheetSidebarActions } from "./shared/WorksheetSidebar";
import type { WorksheetInstrument } from "../models/WorksheetInstrument";
import type { WorksheetChemical } from "../models/WorksheetChemical";
import type { WorksheetStandard } from "../models/WorksheetStandard";
import type { CalculationLithosun400 } from "../preparation_models/metal/CalculationLithosun400";
import CalculationDetailLithosun400 from "./sub-components/metal/CalculationDetailLithosun400";
import type { CalculationMeropenam } from "../preparation_models/metal/CalculationMeropenam";
import type { CalculationSFGC } from "../preparation_models/metal/CalculationSFGC";
import type { CalculationTalc } from "../preparation_models/metal/CalculationTalc";
import CalculationDetailMeropenam from "./sub-components/metal/CalculationDetailMeropenam";
import CalculationDetailSFGC from "./sub-components/metal/CalculationDetailSFGC";
import CalculationDetailTalc from "./sub-components/metal/CalculationDetailTalc";
import type { StandardPreparationMetalStep } from "../preparation_models/metal/StandardPreparationMetalStep";


const Target: React.FC<{ className: string }> = ({ className }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="6" />
    <circle cx="12" cy="12" r="2" />
  </svg>
);

const LoaderCircle: React.FC<{ className: string }> = ({ className }) => (
  <svg
    className={className + " animate-spin"}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>
);

const Plus: React.FC<{ className: string }> = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const Search: React.FC<{ className: string }> = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.35-4.35" />
  </svg>
);

const Check: React.FC<{ className: string }> = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const ReferenceLoading: React.FC = () => (
  <div className="flex items-center justify-center p-4 bg-emerald-50 border border-emerald-300 rounded-lg text-sm text-emerald-800 font-medium shadow-sm">
    <LoaderCircle className="w-5 h-5 mr-3" />
    Loading reference data (Instruments, Chemicals, Standards, Columns)...
  </div>
);

const ReferenceError: React.FC<{ error: string }> = ({ error }) => (
  <div className="p-4 bg-red-50 border border-red-300 rounded-lg text-sm text-red-700 font-medium shadow-sm">
    <div className="flex items-center mb-1">
      <Target className="w-5 h-5 mr-2" />
      Error loading reference data:
    </div>
    <p className="text-xs ml-7 break-words">{error}</p>
  </div>
);

interface WorksheetProps {
  worksheetId: string;
  instruments: Instrument[];
  standards: Standard[];
  chemicals: Chemical[];
  // columns: Column[];
  isReferenceDataLoading: boolean;
  referenceDataError: string | null;
  employeeId: string;
  role: string;
  department: string;
  onPrint?: (
    info: WorksheetDetail,
    analysts: Analyst[],
    sampleData: SampleData,
  ) => void;
  /** Bubble sidebar state up so App can render the shared sidebar */
  onSidebarStateChange?: (state: WorksheetSidebarState) => void;
  /** Bubble sidebar actions up so App can wire them */
  onSidebarActionsReady?: (actions: WorksheetSidebarActions) => void;
}

const createNewSamplePreparationIcpms = (
  index: number,
): SamplePreparationMetal => ({
  id: Date.now() + index,
  label: `Sample Preparation ${index + 1}`,
  steps: [
    { name: "Weighing" },
    { name: "1st Dilution" },
    { name: "2nd Dilution" },
    { name: "3rd Dilution" },
    { name: "4th Dilution" },
    { name: "Filtration" },
  ],
});

const createNewSamplePreparationIcpoes = (
  index: number,
): SamplePreparationMetal => ({
  id: Date.now() + index,
  label: `Sample Preparation ${index + 1}`,
  steps: [
    { name: "Weighing" },
    { name: "1st Dilution" },
    { name: "2nd Dilution" },
    { name: "3rd Dilution" },
    { name: "4th Dilution" },
    { name: "Filtration" },
  ],
});

const createNewSamplePreparationIcpmsWater = (
  index: number,
): SamplePreparationMetal => ({
  id: Date.now() + index,
  label: `Sample Preparation ${index + 1}`,
  steps: [
    { name: "Weighing" },
    { name: "1st Dilution" },
    { name: "2nd Dilution" },
    { name: "3rd Dilution" },
    { name: "4th Dilution" },
    { name: "Filtration" },
  ],
});

const createNewSamplePreparationIcpmsIchQ3D = (
  index: number,
): SamplePreparationMetal => ({
  id: Date.now() + index,
  label: `Sample Preparation ${index + 1}`,
  steps: [
    { name: "Weighing" },
    { name: "1st Dilution" },
    { name: "2nd Dilution" },
    { name: "3rd Dilution" },
    { name: "4th Dilution" },
    { name: "Filtration" },
  ],
});

const createNewSamplePreparationORS = (
  index: number,
): SamplePreparationMetal => ({
  id: Date.now() + index,
  label: `Sample Preparation ${index + 1}`,
  steps: [
    { name: "Weighing" },
    { name: "1st Dilution" },
    { name: "2nd Dilution" },
    { name: "3rd Dilution" },
    { name: "4th Dilution" },
    { name: "Filtration" },
  ],
});

const createNewSamplePreparationAnofer = (
  index: number,
): SamplePreparationMetal => ({
  id: Date.now() + index,
  label: `Sample Preparation ${index + 1}`,
  steps: [
    { name: "Weighing" },
    { name: "1st Dilution" },
    { name: "2nd Dilution" },
    { name: "3rd Dilution" },
    { name: "4th Dilution" },
    { name: "Filtration" },
  ],
});

const createNewSamplePreparationZptoShampoo = (
  index: number,
): SamplePreparationMetal => ({
  id: Date.now() + index,
  label: `Sample Preparation ${index + 1}`,
  steps: [
    { name: "Weighing" },
    { name: "1st Dilution" },
    { name: "2nd Dilution" },
    { name: "3rd Dilution" },
    { name: "4th Dilution" },
    { name: "Filtration" },
  ],
});

const createNewCalculationIcpms = (
  index: number,
): CalculationIcpms => ({
  id: Date.now() + index,
  label: `Calculation ${index + 1}`,
  selectedSamplePreparationLabel: null,
  sw: null,
  v1: null,
  v2: null,
  v3: null,
  v4: null,
  v5: null,
  v6: null,
  v7: null,
  instrumentConcentrationSample: "",
  instrumentConcentrationSampleUnit: "ppb",
  instrumentConcentrationBlank: "",
  instrumentConcentrationBlankUnit: "ppb",
  acceptanceLimitMin: "",
  acceptanceLimitMax: "",
  calculationResult: null,
  calculationResultUnit: "mg/Kg",
});

const createNewCalculationIcpoes = (
  index: number,
): CalculationIcpoes => ({
  id: Date.now() + index,
  label: `Calculation ${index + 1}`,
  selectedSamplePreparationLabel: null,
  sw: null,
  v1: null,
  v2: null,
  v3: null,
  v4: null,
  v5: null,
  v6: null,
  v7: null,
  instrumentConcentrationSample: "",
  instrumentConcentrationSampleUnit: "ppm",
  instrumentConcentrationBlank: "",
  instrumentConcentrationBlankUnit: "ppm",
  acceptanceLimitMin: "",
  acceptanceLimitMax: "",
  calculationResult: null,
  calculationResultUnit: "mg/Kg",
});

const createNewCalculationIcpmsWater = (
  index: number,
): CalculationIcpmsWater => ({
  id: Date.now() + index,
  label: `Calculation ${index + 1}`,
  selectedSamplePreparationLabel: null,
  v1: null,
  v2: null,
  v3: null,
  v4: null,
  v5: null,
  v6: null,
  v7: null,
  instrumentConcentrationSample: "",
  instrumentConcentrationSampleUnit: "ppb",
  instrumentConcentrationBlank: "",
  instrumentConcentrationBlankUnit: "ppb",
  acceptanceLimitMin: "",
  acceptanceLimitMax: "",
  calculationResult: null,
  calculationResultUnit: "mg/L",
});

const createNewSamplePreparationIcpoesWater = (
  index: number,
): SamplePreparationMetal => ({
  id: Date.now() + index,
  label: `Sample Preparation ${index + 1}`,
  steps: [
    { name: "Weighing" },
    { name: "1st Dilution" },
    { name: "2nd Dilution" },
    { name: "3rd Dilution" },
    { name: "4th Dilution" },
    { name: "Filtration" },
  ],
});

const createNewSamplePreparationAasWater = (
  index: number,
): SamplePreparationMetal => ({
  id: Date.now() + index,
  label: `Sample Preparation ${index + 1}`,
  steps: [
    { name: "Weighing" },
    { name: "1st Dilution" },
    { name: "2nd Dilution" },
    { name: "3rd Dilution" },
    { name: "4th Dilution" },
    { name: "Filtration" },
  ],
});

const createNewCalculationIcpoesWater = (
  index: number,
): CalculationIcpoesWater => ({
  id: Date.now() + index,
  label: `Calculation ${index + 1}`,
  selectedSamplePreparationLabel: null,
  v1: null,
  v2: null,
  v3: null,
  v4: null,
  v5: null,
  v6: null,
  v7: null,
  instrumentConcentrationSample: "",
  instrumentConcentrationSampleUnit: "ppb",
  instrumentConcentrationBlank: "",
  instrumentConcentrationBlankUnit: "ppb",
  acceptanceLimitMin: "",
  acceptanceLimitMax: "",
  calculationResult: null,
  calculationResultUnit: "mg/L",
});

const createNewCalculationAasWater = (
  index: number,
): CalculationAasWater => ({
  id: Date.now() + index,
  label: `Calculation ${index + 1}`,
  selectedSamplePreparationLabel: null,
  v1: null,
  v2: null,
  v3: null,
  v4: null,
  v5: null,
  v6: null,
  v7: null,
  instrumentConcentrationSample: "",
  instrumentConcentrationSampleUnit: "ppb",
  instrumentConcentrationBlank: "",
  instrumentConcentrationBlankUnit: "ppb",
  acceptanceLimitMin: "",
  acceptanceLimitMax: "",
  calculationResult: null,
  calculationResultUnit: "mg/L",
});

const createNewCalculationIcpmsIchQ3D = (
  index: number,
): CalculationIcpmsIchQ3D => ({
  id: Date.now() + index,
  label: `Calculation ${index + 1}`,
  selectedSamplePreparationLabel: null,
  sw: null,
  v1: null,
  v2: null,
  v3: null,
  v4: null,
  v5: null,
  v6: null,
  v7: null,
  instrumentConcentrationSample: "",
  instrumentConcentrationSampleUnit: "ppb",
  instrumentConcentrationBlank: "",
  instrumentConcentrationBlankUnit: "ppb",
  acceptanceLimitMin: "",
  acceptanceLimitMax: "",
  calculationResult: null,
  calculationResultUnit: "mg/Kg",
});

const createNewCalculationORS = (index: number): CalculationORS => ({
  id: Date.now() + index,
  label: `Calculation ${index + 1}`,
  selectedSamplePreparationLabel: null,
  sw: null,
  v1: null,
  v2: null,
  v3: null,
  v4: null,
  v5: null,
  v6: null,
  v7: null,
  sachetWeightAvg: "",
  sachetWeightAvgUnit: "g",
  molecularWeight: "",
  molecularWeightUnit: "g/mol",
  labelClaim: "",
  instrumentConcentrationSample: "",
  instrumentConcentrationSampleUnit: "ppm",
  instrumentConcentrationBlank: "",
  instrumentConcentrationBlankUnit: "ppm",
  acceptanceLimitMin: "",
  acceptanceLimitMax: "",
  calculationResult: null,
  calculationResultUnit: "% of LC",
  labelClaimUnit: "mg"
});

const createNewCalculationAnofer = (index: number): CalculationAnofer => ({
  id: Date.now() + index,
  label: `Calculation ${index + 1}`,
  selectedSamplePreparationLabel: null,
  sw: null,
  v1: null,
  v2: null,
  v3: null,
  v4: null,
  v5: null,
  avgWeight: "",
  avgWeightUnit: "mg",
  labelClaim: "",
  labelClaimUnit: "mg",
  instrumentConcentrationSample: "",
  instrumentConcentrationSampleUnit: "ppm",
  instrumentConcentrationBlank: "",
  instrumentConcentrationBlankUnit: "ppm",
  acceptanceLimitMin: "",
  acceptanceLimitMax: "",
  calculationResult: null,
  calculationResultUnit: "% of LC",
});

const createNewCalculationZptoShampoo = (
  index: number,
): CalculationZptoShampoo => ({
  id: Date.now() + index,
  label: `Calculation ${index + 1}`,
  selectedSamplePreparationLabel: null,
  sw: null,
  v1: null,
  v2: null,
  v3: null,
  specificGravity: "",
  molecularWeight1: "",
  molecularWeight2: "",
  labelClaim: "",
  instrumentConcentrationSample: "",
  instrumentConcentrationSampleUnit: "ppm",
  instrumentConcentrationBlank: "",
  instrumentConcentrationBlankUnit: "ppm",
  acceptanceLimitMin: "",
  acceptanceLimitMax: "",
  calculationResult: null,
  calculationResultUnit: "% of LC",
});

const createNewSamplePreparationSodiumLactate = (
  index: number,
): SamplePreparationMetal => ({
  id: Date.now() + index,
  label: `Sample Preparation ${index + 1}`,
  steps: [
    { name: "Weighing" },
    { name: "1st Dilution" },
    { name: "2nd Dilution" },
    { name: "3rd Dilution" },
    { name: "4th Dilution" },
    { name: "Filtration" },
  ],
});

const createNewCalculationSodiumLactate = (
  index: number,
): CalculationSodiumLactate => ({
  id: Date.now() + index,
  label: `Calculation ${index + 1}`,
  selectedSamplePreparationLabel: null,
  v1: null,
  v2: null,
  v3: null,
  v4: null,
  v5: null,
  v6: null,
  v7: null,
  x1Factor: "",
  instrumentConcentrationSample: "",
  instrumentConcentrationSampleUnit: "ppm",
  instrumentConcentrationBlank: "",
  instrumentConcentrationBlankUnit: "ppm",
  acceptanceLimitMin: "",
  acceptanceLimitMax: "",
  calculationResult: null,
  calculationResultUnit: "%",
});

const createNewSamplePreparationLithosun300 = (
  index: number,
): SamplePreparationMetal => ({
  id: Date.now() + index,
  label: `Sample Preparation ${index + 1}`,
  steps: [
    { name: "Weighing" },
    { name: "1st Dilution" },
    { name: "2nd Dilution" },
    { name: "3rd Dilution" },
    { name: "4th Dilution" },
  ],
});

const createNewCalculationLithosun300 = (
  index: number,
): CalculationLithosun300 => ({
  id: Date.now() + index,
  label: `Calculation ${index + 1}`,
  selectedSamplePreparationLabel: null,
  v1: null,
  v2: null,
  v3: null,
  conversionFactor: null,
  labelClaim: null,
  labelClaimUnit: "mg",
  instrumentConcentrationSampleUnit: "ppm",
  instrumentConcentrationBlank: "",
  instrumentConcentrationBlankUnit: "ppm",
  instrumentConcentrationSampleTablet1: null,
  instrumentConcentrationSampleTablet2: null,
  instrumentConcentrationSampleTablet3: null,
  instrumentConcentrationSampleTablet4: null,
  instrumentConcentrationSampleTablet5: null,
  instrumentConcentrationSampleTablet6: null,
  acceptanceLimitMin: "",
  acceptanceLimitMax: "",
  calculationResultTablet1: null,
  calculationResultTablet2: null,
  calculationResultTablet3: null,
  calculationResultTablet4: null,
  calculationResultTablet5: null,
  calculationResultTablet6: null,
  calculationResult: null,
  calculationResultUnit: "% of LC",
});

const createNewSamplePreparationLithosun400 = (
  index: number,
): SamplePreparationMetal => ({
  id: Date.now() + index,
  label: `Sample Preparation ${index + 1}`,
  steps: [
    { name: "Weighing" },
    { name: "1st Dilution" },
    { name: "2nd Dilution" },
    { name: "3rd Dilution" },
    { name: "4th Dilution" },
  ],
});

const createNewCalculationLithosun400 = (
  index: number,
): CalculationLithosun400 => ({
  id: Date.now() + index,
  label: `Calculation ${index + 1}`,
  selectedSamplePreparationLabel: null,
  v1: null,
  v2: null,
  v3: null,
  conversionFactor: null,
  labelClaim: null,
  labelClaimUnit: "mg",
  instrumentConcentrationSampleUnit: "ppm",
  numberOfTimePoints: 2,
  timePointLabel1: "Time Point 1",
  timePointLabel2: "Time Point 2",
  timePointLabel3: null,
  timePointLabel4: null,
  timePointLabel5: null,
  timePointLabel6: null,
  timePointLabel7: null,
  timePointLabel8: null,
  timePointLabel9: null,
  timePointLabel10: null,
  sampleT1Tab1: null, sampleT1Tab2: null, sampleT1Tab3: null, sampleT1Tab4: null, sampleT1Tab5: null, sampleT1Tab6: null,
  sampleT2Tab1: null, sampleT2Tab2: null, sampleT2Tab3: null, sampleT2Tab4: null, sampleT2Tab5: null, sampleT2Tab6: null,
  sampleT3Tab1: null, sampleT3Tab2: null, sampleT3Tab3: null, sampleT3Tab4: null, sampleT3Tab5: null, sampleT3Tab6: null,
  sampleT4Tab1: null, sampleT4Tab2: null, sampleT4Tab3: null, sampleT4Tab4: null, sampleT4Tab5: null, sampleT4Tab6: null,
  sampleT5Tab1: null, sampleT5Tab2: null, sampleT5Tab3: null, sampleT5Tab4: null, sampleT5Tab5: null, sampleT5Tab6: null,
  sampleT6Tab1: null, sampleT6Tab2: null, sampleT6Tab3: null, sampleT6Tab4: null, sampleT6Tab5: null, sampleT6Tab6: null,
  sampleT7Tab1: null, sampleT7Tab2: null, sampleT7Tab3: null, sampleT7Tab4: null, sampleT7Tab5: null, sampleT7Tab6: null,
  sampleT8Tab1: null, sampleT8Tab2: null, sampleT8Tab3: null, sampleT8Tab4: null, sampleT8Tab5: null, sampleT8Tab6: null,
  sampleT9Tab1: null, sampleT9Tab2: null, sampleT9Tab3: null, sampleT9Tab4: null, sampleT9Tab5: null, sampleT9Tab6: null,
  sampleT10Tab1: null, sampleT10Tab2: null, sampleT10Tab3: null, sampleT10Tab4: null, sampleT10Tab5: null, sampleT10Tab6: null,
  resultT1Tab1: null, resultT1Tab2: null, resultT1Tab3: null, resultT1Tab4: null, resultT1Tab5: null, resultT1Tab6: null,
  resultT2Tab1: null, resultT2Tab2: null, resultT2Tab3: null, resultT2Tab4: null, resultT2Tab5: null, resultT2Tab6: null,
  resultT3Tab1: null, resultT3Tab2: null, resultT3Tab3: null, resultT3Tab4: null, resultT3Tab5: null, resultT3Tab6: null,
  resultT4Tab1: null, resultT4Tab2: null, resultT4Tab3: null, resultT4Tab4: null, resultT4Tab5: null, resultT4Tab6: null,
  resultT5Tab1: null, resultT5Tab2: null, resultT5Tab3: null, resultT5Tab4: null, resultT5Tab5: null, resultT5Tab6: null,
  resultT6Tab1: null, resultT6Tab2: null, resultT6Tab3: null, resultT6Tab4: null, resultT6Tab5: null, resultT6Tab6: null,
  resultT7Tab1: null, resultT7Tab2: null, resultT7Tab3: null, resultT7Tab4: null, resultT7Tab5: null, resultT7Tab6: null,
  resultT8Tab1: null, resultT8Tab2: null, resultT8Tab3: null, resultT8Tab4: null, resultT8Tab5: null, resultT8Tab6: null,
  resultT9Tab1: null, resultT9Tab2: null, resultT9Tab3: null, resultT9Tab4: null, resultT9Tab5: null, resultT9Tab6: null,
  resultT10Tab1: null, resultT10Tab2: null, resultT10Tab3: null, resultT10Tab4: null, resultT10Tab5: null, resultT10Tab6: null,
  minT1: null, avgT1: null, maxT1: null,
  minT2: null, avgT2: null, maxT2: null,
  minT3: null, avgT3: null, maxT3: null,
  minT4: null, avgT4: null, maxT4: null,
  minT5: null, avgT5: null, maxT5: null,
  minT6: null, avgT6: null, maxT6: null,
  minT7: null, avgT7: null, maxT7: null,
  minT8: null, avgT8: null, maxT8: null,
  minT9: null, avgT9: null, maxT9: null,
  minT10: null, avgT10: null, maxT10: null,
  acceptanceLimitMin1: null, acceptanceLimitMax1: null,
  acceptanceLimitMin2: null, acceptanceLimitMax2: null,
  acceptanceLimitMin3: null, acceptanceLimitMax3: null,
  acceptanceLimitMin4: null, acceptanceLimitMax4: null,
  acceptanceLimitMin5: null, acceptanceLimitMax5: null,
  acceptanceLimitMin6: null, acceptanceLimitMax6: null,
  acceptanceLimitMin7: null, acceptanceLimitMax7: null,
  acceptanceLimitMin8: null, acceptanceLimitMax8: null,
  acceptanceLimitMin9: null, acceptanceLimitMax9: null,
  acceptanceLimitMin10: null, acceptanceLimitMax10: null,
  calculationResultUnit: "% of LC",
  instrumentConcentrationBlankT1: null,
  instrumentConcentrationBlankUnitT1: "ppm",
  instrumentConcentrationBlankT2: null,
  instrumentConcentrationBlankUnitT2: "ppm",
  instrumentConcentrationBlankT3: null,
  instrumentConcentrationBlankUnitT3: "ppm",
  instrumentConcentrationBlankT4: null,
  instrumentConcentrationBlankUnitT4: "ppm",
  instrumentConcentrationBlankT5: null,
  instrumentConcentrationBlankUnitT5: "ppm",
  instrumentConcentrationBlankT6: null,
  instrumentConcentrationBlankUnitT6: "ppm",
  instrumentConcentrationBlankT7: null,
  instrumentConcentrationBlankUnitT7: "ppm",
  instrumentConcentrationBlankT8: null,
  instrumentConcentrationBlankUnitT8: "ppm",
  instrumentConcentrationBlankT9: null,
  instrumentConcentrationBlankUnitT9: "ppm",
  instrumentConcentrationBlankT10: null,
  instrumentConcentrationBlankUnitT10: "ppm"
});

const createNewSamplePreparationMeropenam = (
  index: number,
): SamplePreparationMetal => ({
  id: Date.now() + index,
  label: `Sample Preparation ${index + 1}`,
  steps: [
    { name: "Weighing" },
    { name: "1st Dilution" },
    { name: "2nd Dilution" },
    { name: "3rd Dilution" },
    { name: "4th Dilution" },
  ],
});

export const createNewCalculationMeropenam = (index: number): CalculationMeropenam => ({
  id: Date.now() + index,
  label: `Calculation ${index + 1}`,
  selectedSamplePreparationLabel: null,
  instrumentConcentrationSample: "",
  instrumentConcentrationSampleUnit: "ppm",
  sw: null,
  labelClaim: "",
  labelClaimUnit: "mg",
  v1: null,
  v2: null,
  v3: null,
  v4: null,
  v5: null,
  v6: null,
  v7: null,
  acceptanceLimitMin: null,
  acceptanceLimitMax: null,
  calculationResult: null,
  calculationResultUnit: "% of LC",
  instrumentConcentrationBlank: "",
  instrumentConcentrationBlankUnit: "ppm"
});

const createNewSamplePreparationTalc = (
  index: number,
): SamplePreparationMetal => ({
  id: Date.now() + index,
  label: `Sample Preparation ${index + 1}`,
  steps: [
    { name: "Weighing" },
    { name: "1st Dilution" },
    { name: "2nd Dilution" },
    { name: "3rd Dilution" },
    { name: "4th Dilution" },
    { name: "Filtration" },
  ],
});

const createNewCalculationTalc = (index = 1): CalculationTalc => ({
  id: Date.now() + index,
  label: `Calculation ${index + 1}`,
  selectedSamplePreparationLabel: null,
  instrumentConcentrationSample: "",
  instrumentConcentrationSampleUnit: "ppm",
  instrumentConcentrationBlank: "0",
  instrumentConcentrationBlankUnit: "ppm",
  sw: null,
  v1: null,
  v2: null,
  v3: null,
  v4: null,
  v5: null,
  v6: null,
  v7: null,
  acceptanceLimitMin: null,
  acceptanceLimitMax: null,
  calculationResult: null,
  calculationResultUnit: "%",
});

const createNewSamplePreparationSFGC = (
  index: number,
): SamplePreparationMetal => ({
  id: Date.now() + index,
  label: `Sample Preparation ${index + 1}`,
  steps: [
    { name: "Weighing" },
    { name: "1st Dilution" },
    { name: "2nd Dilution" },
    { name: "3rd Dilution" },
    { name: "4th Dilution" },
  ],
});

export const createNewCalculationSFGC = (index: number): CalculationSFGC => ({
  id: Date.now() + index,
  label: `Calculation ${index + 1}`,
  selectedSamplePreparationLabel: null,
  instrumentConcentrationSample: "",
  instrumentConcentrationSampleUnit: "ppm",
  instrumentConcentrationBlank: "",
  instrumentConcentrationBlankUnit: "ppm",
  sw: null,
  v1: null,
  v2: null,
  v3: null,
  v4: null,
  v5: null,
  v6: null,
  v7: null,
  acceptanceLimitMin: null,
  acceptanceLimitMax: null,
  calculationResult: null,
  calculationResultUnit: "% of LC",
});

const createNewStandardPreparationMetal = (
  index: number,
): StandardPreparationMetal => ({
  id: Date.now() + index,
  label: `Standard Preparation ${index + 1}`,
  steps: [
    { name: "Stock Solution" },
    { name: "1st Dilution" },
    { name: "2nd Dilution" },
    { name: "3rd Dilution" },
    { name: "4th Dilution" },
    { name: "Filtration" },
  ],
});

const PREPARATION_GROUPS = {
  icpmsFood: { id: "icpmsFood", label: "ICP-MS", color: "emerald" },
  icpoesFood: { id: "icpoesFood", label: "ICP-OES", color: "emerald" },
  icpmsWater: { id: "icpmsWater", label: "ICP-MS (Water)", color: "emerald" },
  icpoesWater: { id: "icpoesWater", label: "ICP-OES (Water)", color: "emerald" },
  aasWater: { id: "aasWater", label: "AAS (Water)", color: "emerald" },
  icpmsIchQ3D: { id: "icpmsIchQ3D", label: "ICP-MS (ICH-Q3D)", color: "emerald" },
  ors: { id: "ors", label: "ORS", color: "emerald" },
  anofer: { id: "anofer", label: "Anofer", color: "emerald" },
  zptoShampoo: { id: "zptoShampoo", label: "ZPTO Shampoo", color: "emerald" },
  sodiumLactate: { id: "sodiumLactate", label: "Sodium Lactate", color: "emerald" },
  lithosun300: { id: "lithosun300", label: "Lithosun 300", color: "emerald" },
  lithosun400: { id: "lithosun400", label: "Lithosun 400", color: "emerald" },
  talc: { id: "talc", label: "Talc", color: "emerald" },
  meropenam: { id: "meropenam", label: "Meropenam", color: "emerald" },
  sfgc: { id: "sfgc", label: "SFGC", color: "emerald" },
  blankPreparation: { id: "blankPreparation", label: "Blank Preparation", color: "emerald" },
} as const;

const METAL_GROUP_TO_TYPE: Record<string, string> = {
  icpmsFood: "icpms",
  icpoesFood: "icpoes",
  icpmsWater: "icpms_water",
  icpmsIchQ3D: "icpms_ich_q3d",
  ors: "ors",
  anofer: "anofer",
  zptoShampoo: "zpto_shampoo",
  sodiumLactate: "sodium_lactate",
  icpoesWater: "icpoes_water",
  aasWater: "aas_water",
  lithosun300: "lithosun300",
  lithosun400: "lithosun400",
  meropenam: "meropenam",
  sfgc: "sfgc",
  talc: "talc"
};

function parseDateSafe(raw: string): Date | null {
  const s = raw.trim();
  // If it starts with YYYY (ISO format: YYYY-MM-DD...) parse directly
  if (/^\d{4}[-/]/.test(s)) {
    const d = new Date(s.replace(" ", "T"));
    return isNaN(d.getTime()) ? null : d;
  }
  // Otherwise treat as DD-MM-YYYY or DD/MM/YYYY (with optional HH:MM:SS)
  const m = s.match(/^(\d{1,2})[-/](\d{1,2})[-/](\d{4})(?:[T ](\d{2}:\d{2}(?::\d{2})?))?/);
  if (m) {
    const iso = `${m[3]}-${m[2].padStart(2, "0")}-${m[1].padStart(2, "0")}`;
    const d = new Date(m[4] ? `${iso}T${m[4]}` : `${iso}T00:00:00`);
    return isNaN(d.getTime()) ? null : d;
  }
  const d = new Date(s);
  return isNaN(d.getTime()) ? null : d;
}

function formatDate(raw: string | null | undefined): string {
  if (!raw) return "N/A";
  const d = parseDateSafe(String(raw));
  if (!d) return String(raw).trim() || "N/A";
  const DD = String(d.getDate()).padStart(2, "0");
  const MM = String(d.getMonth() + 1).padStart(2, "0");
  return `${DD}/${MM}/${d.getFullYear()}`;
}

const MetalWorksheet: React.FC<WorksheetProps> = ({
  worksheetId,
  instruments = [],
  chemicals = [],
  standards = [],
  isReferenceDataLoading = false,
  referenceDataError = null,
  employeeId,
  role,
  department,
  onPrint,
  onSidebarStateChange,
  onSidebarActionsReady,
}) => {
  // Core state
  const [paramIdx, setParamIdx] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [registrationNo, setRegistrationNo] = useState("");
  const [worksheetInfo, setWorksheetInfo] = useState<WorksheetDetail | null>(
    null,
  );
  const [samplesData, setSamplesData] = useState<SampleData[]>([]);
  const [addedParameters, setAddedParameters] = useState<ParameterDetail[]>([]);
  const [showParameterDropdown, setShowParameterDropdown] = useState(false);
  const [selectedParamsForDetail, setSelectedParamsForDetail] = useState<
    number[]
  >([]);

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [displayStatus, setDisplayStatus] = useState<string>("");

  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [analystMode, setAnalystMode] = useState<"add" | "reassign">("add");
  const [showAnalystDialog, setShowAnalystDialog] = useState(false);
  const [pendingParameter, setPendingParameter] =
    useState<ParameterDetail | null>(null);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [analysts, setAnalysts] = useState<Analyst[]>([]);

  const [showUnlockDialog, setShowUnlockDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [parameterToUnlock, setParameterToUnlock] =
    useState<ParameterDetail | null>(null);
  const [parameterToDelete, setParameterToDelete] =
    useState<ParameterDetail | null>(null);
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [showStartAnalysisDialog, setShowStartAnalysisDialog] = useState(false);
  const [showCompleteAnalysisDialog, setShowCompleteAnalysisDialog] =
    useState(false);
  const [parameterForAnalysis, setParameterForAnalysis] =
    useState<ParameterDetail | null>(null);
  const [isStartingAnalysis, setIsStartingAnalysis] = useState(false);
  const [isCompletingAnalysis, setIsCompletingAnalysis] = useState(false);

  // Tracks which parameters the analyst has explicitly started revision on (optimistic).
  const [revisionStartedParams, setRevisionStartedParams] = useState<Set<number>>(new Set());

  const handleStartRevision = async (param: ParameterDetail) => {
    const parameterId = param.id;
    const revisionStartDate = new Date().toISOString();

    setRevisionStartedParams(prev => new Set([...prev, parameterId]));

    try {
      const updatedParam = {
        ...param,
        status: "Analysis Revision Started",
        revisionStartDate,
      };

      const response = await updateParameter(parameterId, updatedParam);

      if (response && response.parameterId) {
        setParameterStatusPerParam(prev => ({
          ...prev,
          [parameterId]: "Analysis Revision Started",
        }));
        setRevisionStartDatePerParam(prev => ({
          ...prev,
          [parameterId]: revisionStartDate,
        }));
        await insertWorksheetLog({
          worksheetId,
          parameterId,
          action: "Revision Started",
          remarks: "Analyst started revision — parameter unlocked for editing",
          employeeId,
          role,
        });
        setToastMessage("Revision started. Parameter is now unlocked for editing.");
        setShowToast(true);
        setTimeout(() => setShowToast(false), 4000);
      } else {
        setRevisionStartedParams(prev => {
          const next = new Set(prev); next.delete(parameterId); return next;
        });
        setToastMessage("Failed to start revision. Please try again.");
        setShowToast(true);
        setTimeout(() => setShowToast(false), 4000);
      }
    } catch (error) {
      setRevisionStartedParams(prev => {
        const next = new Set(prev); next.delete(parameterId); return next;
      });
      setToastMessage(`Error starting revision: ${error}`);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 4000);
    }
  };

  const [showApproveDialog, setShowApproveDialog] = useState(false);
  const [showDisapproveDialog, setShowDisapproveDialog] = useState(false);
  const [showRevisionDialog, setShowRevisionDialog] = useState(false);
  const [parameterForApproval, setParameterForApproval] =
    useState<ParameterDetail | null>(null);
  const [isApproving, setIsApproving] = useState(false);
  const [isDisapproving, setIsDisapproving] = useState(false);
  const [isRequestingRevision, setIsRequestingRevision] = useState(false);
  const [, setRevisionComments] = useState("");

  const [showApproveWorksheetDialog, setShowApproveWorksheetDialog] =
    useState(false);
  const [isApprovingWorksheet, setIsApprovingWorksheet] = useState(false);

  const [showSubmitForQADialog, setShowSubmitForQADialog] = useState(false);
  const [isSubmittingForQA, setIsSubmittingForQA] = useState(false);
  const [addedInstruments, setAddedInstruments] = useState<
    Record<number, WorksheetInstrument[]>
  >({});
  const [addedChemicals, setAddedChemicals] = useState<
    Record<number, WorksheetChemical[]>
  >({});
  const [addedStandards, setAddedStandards] = useState<
    Record<number, WorksheetStandard[]>
  >({});
  const [otherInfoPerParam, setOtherInfoPerParam] = useState<
    Record<number, string>
  >({});
  const [additionalInfoPerParam, setAdditionalInfoPerParam] = useState<
    Record<number, string>
  >({});
  const [showAdditionalInfo, setShowAdditionalInfo] = useState<
    Record<number, boolean>
  >({});
  const [analysisStartDatePerParam, setAnalysisStartDatePerParam] = useState<
    Record<number, string>
  >({});
  const [analysisCompletionDatePerParam, setAnalysisCompletionDatePerParam] =
    useState<Record<number, string>>({});
  const [revisionStartDatePerParam, setRevisionStartDatePerParam] = useState<
    Record<number, string>
  >({});
  const [revisionCompletedDatePerParam, setRevisionCompletedDatePerParam] = useState<
    Record<number, string>
  >({});
  const [analyzedByPerParam, setAnalyzedByPerParam] = useState<
    Record<number, string>
  >({});
  const [analyzedByNamePerParam, setAnalyzedByNamePerParam] = useState<
    Record<number, string>
  >({});
  const [approvedByReviewerPerParam, setApprovedByPerParam] = useState<
    Record<number, string>
  >({});
  const [approvedByReviewerNamePerParam, setApprovedByNamePerParam] = useState<
    Record<number, string>
  >({});
  const [approvedAtReviewerPerParam, setApprovedAtPerParam] = useState<
    Record<number, string>
  >({});

  // QA-specific state
  const [approvedByQAPerParam, setApprovedByQAPerParam] = useState<
    Record<number, string>
  >({});
  const [approvedAtQAPerParam, setApprovedAtQAPerParam] = useState<
    Record<number, string>
  >({});
  const [remarksQAPerParam, setRemarksQAPerParam] = useState<
    Record<number, string | null>
  >({});
  const [remarksByReviewerPerParam, setRemarksByReviewerPerParam] = useState<
    Record<number, string | null>
  >({});
  const [remarksByAnalystPerParam, setRemarksByAnalystPerParam] = useState<
    Record<number, string | null>
  >({});
  const [preparationCompletedByPerParam, setPreparationCompletedByPerParam] =
    useState<Record<number, string>>({});
  const [preparationCompletedAtPerParam, setPreparationCompletedAtPerParam] =
    useState<Record<number, string>>({});

  // Per-group preparation completion state: { paramId: { groupKey: isoTimestamp } }
  const [groupPrepCompletedAtPerParam, setGroupPrepCompletedAtPerParam] =
    useState<Record<number, Record<string, string>>>({});

  // Complete / Unlock Preparation dialog state
  const [showCompletePreparationDialog, setShowCompletePreparationDialog] =
    useState(false);
  const [showUnlockPreparationDialog, setShowUnlockPreparationDialog] =
    useState(false);
  const [paramForPreparation, setParamForPreparation] =
    useState<ParameterDetail | null>(null);
  const [isCompletingPreparation, setIsCompletingPreparation] = useState(false);
  const [isUnlockingPreparation, setIsUnlockingPreparation] = useState(false);

  // Per-group prep dialog state
  const [showCompleteGroupPrepDialog, setShowCompleteGroupPrepDialog] =
    useState(false);
  const [showUnlockGroupPrepDialog, setShowUnlockGroupPrepDialog] =
    useState(false);
  const [groupPrepDialogParam, setGroupPrepDialogParam] =
    useState<ParameterDetail | null>(null);
  const [groupPrepDialogKey, setGroupPrepDialogKey] = useState<string>("");
  const [isCompletingGroupPrep, setIsCompletingGroupPrep] = useState(false);
  const [isUnlockingGroupPrep, setIsUnlockingGroupPrep] = useState(false);
  const [showQARevisionDialog, setShowQARevisionDialog] = useState(false);
  const [isQARequestingRevision, setIsQARequestingRevision] = useState(false);
  const [, setQARevisionComments] = useState("");
  const [parameterStatusPerParam, setParameterStatusPerParam] = useState<
    Record<number, string>
  >({});
  const [showPreparationDropdown, setShowPreparationDropdown] = useState<
    Record<number, boolean>
  >({});
  const [activePreparationGroups, setActivePreparationGroups] = useState<
    Record<number, string[]>
  >({});
  const [
    samplePreparationIcpmsPerParam,
    setSamplePreparationIcpmsPerParam,
  ] = useState<Record<number, SamplePreparationMetal[]>>({});
  const [calculationsIcpmsPerParam, setCalculationsIcpmsPerParam] =
    useState<Record<number, CalculationIcpms[]>>({});
  const [
    samplePreparationIcpoesPerParam,
    setSamplePreparationIcpoesPerParam,
  ] = useState<Record<number, SamplePreparationMetal[]>>({});
  const [calculationsIcpoesPerParam, setCalculationsIcpoesPerParam] =
    useState<Record<number, CalculationIcpoes[]>>({});
  const [
    samplePreparationIcpmsWaterPerParam,
    setSamplePreparationIcpmsWaterPerParam,
  ] = useState<Record<number, SamplePreparationMetal[]>>({});
  const [calculationsIcpmsWaterPerParam, setCalculationsIcpmsWaterPerParam] =
    useState<Record<number, CalculationIcpmsWater[]>>({});
  const [
    samplePreparationIcpoesWaterPerParam,
    setSamplePreparationIcpoesWaterPerParam,
  ] = useState<Record<number, SamplePreparationMetal[]>>({});
  const [calculationsIcpoesWaterPerParam, setCalculationsIcpoesWaterPerParam] =
    useState<Record<number, CalculationIcpoesWater[]>>({});
  const [
    samplePreparationAasWaterPerParam,
    setSamplePreparationAasWaterPerParam,
  ] = useState<Record<number, SamplePreparationMetal[]>>({});
  const [calculationsAasWaterPerParam, setCalculationsAasWaterPerParam] =
    useState<Record<number, CalculationAasWater[]>>({});
  const [
    samplePreparationIcpmsIchQ3DPerParam,
    setSamplePreparationIcpmsIchQ3DPerParam,
  ] = useState<Record<number, SamplePreparationMetal[]>>({});
  const [calculationsIcpmsIchQ3DPerParam, setCalculationsIcpmsIchQ3DPerParam] =
    useState<Record<number, CalculationIcpmsIchQ3D[]>>({});
  const [
    samplePreparationORSPerParam,
    setSamplePreparationORSPerParam,
  ] = useState<Record<number, SamplePreparationMetal[]>>({});
  const [calculationsORSPerParam, setCalculationsORSPerParam] =
    useState<Record<number, CalculationORS[]>>({});
  const [
    samplePreparationAnoferPerParam,
    setSamplePreparationAnoferPerParam,
  ] = useState<Record<number, SamplePreparationMetal[]>>({});
  const [calculationsAnoferPerParam, setCalculationsAnoferPerParam] =
    useState<Record<number, CalculationAnofer[]>>({});
  const [
    samplePreparationZptoShampooPerParam,
    setSamplePreparationZptoShampooPerParam,
  ] = useState<Record<number, SamplePreparationMetal[]>>({});
  const [calculationsZptoShampooPerParam, setCalculationsZptoShampooPerParam] =
    useState<Record<number, CalculationZptoShampoo[]>>({});
  const [
    samplePreparationSodiumLactatePerParam,
    setSamplePreparationSodiumLactatePerParam,
  ] = useState<Record<number, SamplePreparationMetal[]>>({});
  const [calculationsSodiumLactatePerParam, setCalculationsSodiumLactatePerParam] =
    useState<Record<number, CalculationSodiumLactate[]>>({});
  const [
    samplePreparationLithosun300PerParam,
    setSamplePreparationLithosun300PerParam,
  ] = useState<Record<number, SamplePreparationMetal[]>>({});
  const [calculationsLithosun300PerParam, setCalculationsLithosun300PerParam] =
    useState<Record<number, CalculationLithosun300[]>>({});
  const [
    samplePreparationLithosun400PerParam,
    setSamplePreparationLithosun400PerParam,
  ] = useState<Record<number, SamplePreparationMetal[]>>({});
  const [calculationsLithosun400PerParam, setCalculationsLithosun400PerParam] =
    useState<Record<number, CalculationLithosun400[]>>({});
  const [
    samplePreparationMeropenamPerParam,
    setSamplePreparationMeropenamPerParam,
  ] = useState<Record<number, SamplePreparationMetal[]>>({});
  const [calculationsMeropenamPerParam, setCalculationsMeropenamPerParam] =
    useState<Record<number, CalculationMeropenam[]>>({});
  const [
    samplePreparationSFGCPerParam,
    setSamplePreparationSFGCPerParam,
  ] = useState<Record<number, SamplePreparationMetal[]>>({});
  const [calculationsSFGCPerParam, setCalculationsSFGCPerParam] =
    useState<Record<number, CalculationSFGC[]>>({});

  const [
    samplePreparationTalcPerParam,
    setSamplePreparationTalcPerParam,
  ] = useState<Record<number, SamplePreparationMetal[]>>({});
  const [calculationsTalcPerParam, setCalculationsTalcPerParam] =
    useState<Record<number, CalculationTalc[]>>({});

  const [standardPreparationMetalPerParam, setStandardPreparationMetalPerParam] =
    useState<Record<number, Record<string, StandardPreparationMetal[]>>>({});
  const [blankPreparationPerParam, setBlankPreparationPerParam] = useState<
    Record<number, BlankPreparationModel[]>
  >({});
  const [showBlankPreparationDialog, setShowBlankPreparationDialog] = useState<
    Record<number, boolean>
  >({});
  const [editingBlankPrepId, setEditingBlankPrepId] = useState<string | null>(
    null,
  );

  const [filesPerParam, setFilesPerParam] = useState<
    Record<number, Record<string, AttachedFile[]>>
  >({});

  // Toggle for parameter-level PDF section (after system suitability)
  const [showParamFiles, setShowParamFiles] = useState<Record<number, boolean>>(
    {},
  );

  // Dropdown control states
  const [showInstrumentDropdown, setShowInstrumentDropdown] = useState(false);
  const [showChemicalDropdown, setShowChemicalDropdown] = useState(false);
  const [showStandardDropdown, setShowStandardDropdown] = useState(false);

  // Search states
  const [instrumentSearch, setInstrumentSearch] = useState("");
  const [chemicalSearch, setChemicalSearch] = useState("");
  const [standardSearch, setStandardSearch] = useState("");

  // Refs for click outside detection
  const instrumentRef = useRef<HTMLDivElement>(null);
  const chemicalRef = useRef<HTMLDivElement>(null);
  const standardRef = useRef<HTMLDivElement>(null);
  const preparationDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    reloadWorksheet();
  }, [worksheetId]);

  const computeDisplayStatus = useCallback(() => {
    if (!worksheetInfo) return;

    const currentStatus = worksheetInfo.sample.status;

    if (currentStatus === "Submitted For Analysis") {
      const allStatuses = Object.values(parameterStatusPerParam);

      if (allStatuses.length > 0) {
        const allCompleted = allStatuses.every(
          (status) => status === "Analysis Completed" || status === "Approved",
        );

        if (allCompleted) {
          const allReviewerApproved = addedParameters.every(
            (p) =>
              (parameterStatusPerParam[p.id] || "").toLowerCase() ===
              "approved",
          );

          if (allReviewerApproved) {
            setDisplayStatus("Pending QA Submission");
            return;
          }
          setDisplayStatus("Pending For Review");
          return;
        }
      }
    }

    if (currentStatus === "Submitted For QA Review") {
      setDisplayStatus("Pending QA Validation");
      return;
    }

    setDisplayStatus(currentStatus);
  }, [worksheetInfo, parameterStatusPerParam, addedParameters]);

  useEffect(() => {
    computeDisplayStatus();
  }, [computeDisplayStatus]);

  // Click outside handler
  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (
      instrumentRef.current &&
      !instrumentRef.current.contains(event.target as Node)
    ) {
      setShowInstrumentDropdown(false);
    }
    if (
      chemicalRef.current &&
      !chemicalRef.current.contains(event.target as Node)
    ) {
      setShowChemicalDropdown(false);
    }
    if (
      standardRef.current &&
      !standardRef.current.contains(event.target as Node)
    ) {
      setShowStandardDropdown(false);
    }
    if (
      preparationDropdownRef.current &&
      !preparationDropdownRef.current.contains(event.target as Node)
    ) {
      setShowPreparationDropdown((prev) => {
        if (Object.keys(prev).length > 0) {
          return {};
        }
        return prev;
      });
    }
  }, []);

  const isParameterLocked = useCallback(
    (parameterId: number): boolean => {
      const status = (
        parameterStatusPerParam[parameterId] || "created"
      ).toLowerCase();

      return [
        "analysis pending",
        "analysis started",
        "analysis completed",
        "analysis revision",
        "analysis revision started",
        "approved",
      ].includes(status);
    },
    [role, parameterStatusPerParam],
  );

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [handleClickOutside]);

  useEffect(() => {
    const fetchAllAnalysts = async () => {
      try {
        const analysts = await fetchAnalysts();

        setAnalysts(analysts.filter((a) =>
          a.department?.toLowerCase().includes("metal")
        ));
      } catch (error) {
        console.error("Error fetching analysts:", error);
      }
    };

    fetchAllAnalysts();
  }, [role]);

  // Load worksheet data on mount
  useEffect(() => {
    const loadWorksheetData = async () => {
      if (!worksheetId) {
        setError("No worksheet ID provided");
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const requestData: FetchWorksheetRequest = { employeeId, role };
        const worksheetData = await fetchWorksheetById(
          worksheetId,
          requestData,
        );

        if (!worksheetData) {
          setError("Worksheet not found");
          setIsLoading(false);
          return;
        }

        setWorksheetInfo(worksheetData);
        setRegistrationNo(worksheetData.sample.registrationNo);


        const request: SmapleDetailsRequest = {
          regNo: worksheetData.sample.registrationNo,
          lab: department,
        };
        const samples = await fetchSample(request);
        setSamplesData(samples);

        restoreWorksheetToState(worksheetData);
      } catch (err: any) {
        console.error("Error loading worksheet:", err);
        setError(err.message || "Failed to load worksheet");
      } finally {
        setIsLoading(false);
      }
    };

    loadWorksheetData();
  }, [worksheetId]);

  const restoreWorksheetToState = (worksheetData: WorksheetDetail) => {
    const { parameters } = worksheetData;

    const restoredParams = parameters.map((param, index) => {
      const matchingParameter = parameters.find(
        (s) => s.paraCode === param.paraCode,
      );

      return {
        id: Date.now() + index,
        paraCode: param.paraCode,
        parameterName: param.parameterName,
        methodCode: param.methodCode,
        methodName: param.methodName,
        analyzedBy: param.analyzedBy,
        analysisStartDate: param.analysisStartDate,
        analysisCompletionDate: param.analysisCompletionDate,
        status: param.status,
        approvedByReviewer: param.approvedByReviewer,
        approvedAtReviewer: param.approvedAtReviewer,
        preparationCompletedBy: param.preparationCompletedBy,
        preparationCompletedAt: param.preparationCompletedAt,
        submittedQaBy: param.submittedQaBy,
        submittedQaByName: param.submittedQaByName,
        remarksByAnalyst: param.remarksByAnalyst,
        remarksByReviewer: param.remarksByReviewer,
        remarksByQA: param.remarksByQA,
        ...(matchingParameter || {}),
      };
    });

    setAddedParameters(restoredParams as any);

    // ============================================================================
    // HELPER: Safe JSON Parser
    // ============================================================================
    const safeJSONParse = (data: any, fallback: any = []) => {
      if (!data) return fallback;
      if (typeof data === "string") {
        try {
          return JSON.parse(data);
        } catch (e) {
          console.error("JSON Parse Error:", e);
          return fallback;
        }
      }
      return data;
    };

    // Accumulators for file state — built during forEach, set once cleanly after
    const restoredFilesPerParam: Record<
      number,
      Record<string, AttachedFile[]>
    > = {};
    const restoredShowParamFiles: Record<number, boolean> = {};

    parameters.forEach((param, idx) => {
      const paramId = restoredParams[idx].id;

      if (param.analyzedBy) {
        setAnalyzedByPerParam((prev) => ({
          ...prev,
          [paramId]: param.analyzedBy!,
        }));
      }

      if (param.analyzedByName) {
        setAnalyzedByNamePerParam((prev) => ({
          ...prev,
          [paramId]: param.analyzedByName!,
        }));
      }

      if (param.analysisStartDate) {
        setAnalysisStartDatePerParam((prev) => ({
          ...prev,
          [paramId]: param.analysisStartDate!,
        }));
      }

      if (param.analysisCompletionDate) {
        setAnalysisCompletionDatePerParam((prev) => ({
          ...prev,
          [paramId]: param.analysisCompletionDate!,
        }));
      }

      if ((param as any).revisionStartDate) {
        setRevisionStartDatePerParam((prev) => ({
          ...prev,
          [paramId]: (param as any).revisionStartDate,
        }));
      }

      if ((param as any).revisionCompletedDate) {
        setRevisionCompletedDatePerParam((prev) => ({
          ...prev,
          [paramId]: (param as any).revisionCompletedDate,
        }));
      }

      if ((param.status || "").toLowerCase() === "analysis revision started") {
        setRevisionStartedParams(prev => new Set([...prev, paramId]));
      }

      if (param.status) {
        setParameterStatusPerParam((prev) => ({
          ...prev,
          [paramId]: param.status!,
        }));
      }

      if (param.approvedByReviewer) {
        setApprovedByPerParam((prev) => ({
          ...prev,
          [paramId]: param.approvedByReviewer!,
        }));
      }

      if (param.approvedByReviewerName) {
        setApprovedByNamePerParam((prev) => ({
          ...prev,
          [paramId]: param.approvedByReviewerName!,
        }));
      }

      if (param.approvedAtReviewer) {
        setApprovedAtPerParam((prev) => ({
          ...prev,
          [paramId]: param.approvedAtReviewer!,
        }));
      }

      if (param.approvedByQA) {
        setApprovedByQAPerParam((prev) => ({
          ...prev,
          [paramId]: param.approvedByQA!,
        }));
      }

      if (param.approvedAtQA) {
        setApprovedAtQAPerParam((prev) => ({
          ...prev,
          [paramId]: param.approvedAtQA!,
        }));
      }

      if (param.remarksByQA !== undefined) {
        setRemarksQAPerParam((prev) => ({
          ...prev,
          [paramId]: param.remarksByQA ?? null,
        }));
      }

      if (param.remarksByReviewer !== undefined) {
        setRemarksByReviewerPerParam((prev) => ({
          ...prev,
          [paramId]: param.remarksByReviewer ?? null,
        }));
      }

      if (param.remarksByAnalyst !== undefined) {
        setRemarksByAnalystPerParam((prev) => ({
          ...prev,
          [paramId]: param.remarksByAnalyst ?? null,
        }));
      }

      if (param.additional_info !== undefined) {
        setAdditionalInfoPerParam((prev) => ({
          ...prev,
          [paramId]: param.additional_info ?? "",
        }));
        if (param.additional_info) {
          setShowAdditionalInfo((prev) => ({ ...prev, [paramId]: true }));
        }
      }

      if (param.preparationCompletedBy) {
        setPreparationCompletedByPerParam((prev) => ({
          ...prev,
          [paramId]: param.preparationCompletedBy!,
        }));
      }

      if (param.preparationCompletedAt) {
        setPreparationCompletedAtPerParam((prev) => ({
          ...prev,
          [paramId]: param.preparationCompletedAt!,
        }));

        // Sync groupPrepCompletedAt: mark whichever prep groups exist on this param as done.
        // groupPrepCompletedAtPerParam is local-only UI state derived from preparationCompletedAt.
        if (param.preparations && Array.isArray(param.preparations)) {
          const groupKeys: Record<string, string> = {};
          const at = param.preparationCompletedAt!;
          const prepTypes = param.preparations.map(
            (p: any) => p.preparationType,
          );
          if (prepTypes.includes("icpms")) groupKeys["icpmsFood"] = at;
          if (prepTypes.includes("icpoes")) groupKeys["icpoesFood"] = at;
          if (prepTypes.includes("icpms_water")) groupKeys["icpmsWater"] = at;
          if (prepTypes.includes("icpoes_water")) groupKeys["icpoesWater"] = at;
          if (prepTypes.includes("aas_water")) groupKeys["aasWater"] = at;
          if (prepTypes.includes("icpms_ich_q3d")) groupKeys["icpmsIchQ3D"] = at;
          if (prepTypes.includes("ors")) groupKeys["ors"] = at;
          if (prepTypes.includes("anofer")) groupKeys["anofer"] = at;
          if (prepTypes.includes("zpto_shampoo")) groupKeys["zptoShampoo"] = at;
          if (prepTypes.includes("sodium_lactate")) groupKeys["sodiumLactate"] = at;
          if (prepTypes.includes("lithosun300")) groupKeys["lithosun300"] = at;
          if (prepTypes.includes("lithosun400")) groupKeys["lithosun400"] = at;
          if (prepTypes.includes("meropenam")) groupKeys["meropenam"] = at;
          if (prepTypes.includes("sfgc")) groupKeys["sfgc"] = at;
          if (prepTypes.includes("talc")) groupKeys["talc"] = at;
          if (Object.keys(groupKeys).length > 0) {
            setGroupPrepCompletedAtPerParam((prev) => ({
              ...prev,
              [paramId]: groupKeys,
            }));
          }
        }
      }

      // ------------------------------------------------------------------------
      // 2.3: Instruments
      // ------------------------------------------------------------------------
      if (param.instruments && Array.isArray(param.instruments)) {
        const worksheetInstruments = param.instruments as WorksheetInstrument[];
        if (worksheetInstruments.length > 0) {
          setAddedInstruments((prev) => ({
            ...prev,
            [paramId]: worksheetInstruments,
          }));
        }
      }

      // ------------------------------------------------------------------------
      // 2.4: Chemicals
      // ------------------------------------------------------------------------
      if (param.chemicals && Array.isArray(param.chemicals)) {
        const worksheetChemicals = param.chemicals as WorksheetChemical[];
        if (worksheetChemicals.length > 0) {
          setAddedChemicals((prev) => ({
            ...prev,
            [paramId]: worksheetChemicals,
          }));
        }
      }

      // ------------------------------------------------------------------------
      // 2.5: Standards
      // ------------------------------------------------------------------------
      if (param.standards && Array.isArray(param.standards)) {
        const worksheetStandards = param.standards as WorksheetStandard[];
        if (worksheetStandards.length > 0) {
          setAddedStandards((prev) => ({
            ...prev,
            [paramId]: worksheetStandards,
          }));
        }
      }

      // ------------------------------------------------------------------------
      // 2.6: PREPARATIONS (Main Logic - FIXED)
      // ------------------------------------------------------------------------
      if (
        param.preparations &&
        Array.isArray(param.preparations) &&
        param.preparations.length > 0
      ) {
        // Initialize collection arrays for each preparation type
        const preparationCollections = {
          icpmsFoodSpl: [] as any[],
          icpoesFoodSpl: [] as any[],
          icpmsWaterSpl: [] as any[],
          icpoesWaterSpl: [] as any[],
          aasWaterSpl: [] as any[],
          icpmsIchQ3DSpl: [] as any[],
          orsSpl: [] as any[],
          anoferSpl: [] as any[],
          zptoShampooSpl: [] as any[],
          sodiumLactateSpl: [] as any[],
          lithosun300Spl: [] as any[],
          lithosun400Spl: [] as any[],
          meropenam: [] as any[],
          sfgc: [] as any[],
          talc: [] as any[],
          metalStd: {} as Record<string, any[]>,
          blank: [] as any[],
        };

        // Process each preparation
        param.preparations.forEach((prep: any, i: number) => {
          const prepCategory = prep.preparationCategory;
          const prepType = prep.preparationType;

          const parsedSteps = safeJSONParse(prep.steps, []);

          const newPrep = {
            id: Date.now() + i + 1000 + Math.random() * 1000,
            label: prep.label,
            steps: parsedSteps,
            assignedStandardId: prep.assignedStandardId || null,
          };

          // Route based on preparationCategory first, then preparationType
          if (prepCategory === "standard") {
            // Standard preparations - route by preparationType
            switch (prepType) {
              case "icpms":
                preparationCollections.metalStd["icpmsFood"] = preparationCollections.metalStd["icpmsFood"] || [];
                preparationCollections.metalStd["icpmsFood"].push(newPrep);
                break;
              case "icpoes":
                preparationCollections.metalStd["icpoesFood"] = preparationCollections.metalStd["icpoesFood"] || [];
                preparationCollections.metalStd["icpoesFood"].push(newPrep);
                break;
              case "icpms_water":
                preparationCollections.metalStd["icpmsWater"] = preparationCollections.metalStd["icpmsWater"] || [];
                preparationCollections.metalStd["icpmsWater"].push(newPrep);
                break;
              case "icpoes_water":
                preparationCollections.metalStd["icpoesWater"] = preparationCollections.metalStd["icpoesWater"] || [];
                preparationCollections.metalStd["icpoesWater"].push(newPrep);
                break;
              case "aas_water":
                preparationCollections.metalStd["aasWater"] = preparationCollections.metalStd["aasWater"] || [];
                preparationCollections.metalStd["aasWater"].push(newPrep);
                break;
              case "icpms_ich_q3d":
                preparationCollections.metalStd["icpmsIchQ3D"] = preparationCollections.metalStd["icpmsIchQ3D"] || [];
                preparationCollections.metalStd["icpmsIchQ3D"].push(newPrep);
                break;
              case "ors":
                preparationCollections.metalStd["ors"] = preparationCollections.metalStd["ors"] || [];
                preparationCollections.metalStd["ors"].push(newPrep);
                break;
              case "anofer":
                preparationCollections.metalStd["anofer"] = preparationCollections.metalStd["anofer"] || [];
                preparationCollections.metalStd["anofer"].push(newPrep);
                break;
              case "zpto_shampoo":
                preparationCollections.metalStd["zptoShampoo"] = preparationCollections.metalStd["zptoShampoo"] || [];
                preparationCollections.metalStd["zptoShampoo"].push(newPrep);
                break;
              case "sodium_lactate":
                preparationCollections.metalStd["sodiumLactate"] = preparationCollections.metalStd["sodiumLactate"] || [];
                preparationCollections.metalStd["sodiumLactate"].push(newPrep);
                break;
              case "lithosun300":
                preparationCollections.metalStd["lithosun300"] = preparationCollections.metalStd["lithosun300"] || [];
                preparationCollections.metalStd["lithosun300"].push(newPrep);
                break;
              case "meropenam":
                preparationCollections.metalStd["meropenam"] = preparationCollections.metalStd["meropenam"] || [];
                preparationCollections.metalStd["meropenam"].push(newPrep);
                break;
              case "sfgc":
                preparationCollections.metalStd["sfgc"] = preparationCollections.metalStd["sfgc"] || [];
                preparationCollections.metalStd["sfgc"].push(newPrep);
                break;
              case "talc":
                preparationCollections.metalStd["talc"] = preparationCollections.metalStd["talc"] || [];
                preparationCollections.metalStd["talc"].push(newPrep);
                break;
              case "lithosun400":
                preparationCollections.metalStd["lithosun400"] = preparationCollections.metalStd["lithosun400"] || [];
                preparationCollections.metalStd["lithosun400"].push(newPrep);
                break;
              default:
                // [WARNING] CRITICAL FIX: Log unrecognized types but DON'T add them
                if (prepType) {
                  console.warn(
                    `  [WARNING]  Unrecognized standard preparationType: "${prepType}" for prep: "${prep.label}"`,
                  );
                } else {
                  console.warn(
                    `  [WARNING]  Standard preparation with NULL preparationType: "${prep.label}" - SKIPPED`,
                  );
                }
                break;
            }
          } else if (prepCategory === "sample") {
            // Sample preparations - route by preparationType
            switch (prepType) {
              case "icpms":
                preparationCollections.icpmsFoodSpl.push(newPrep);
                break;
              case "icpoes":
                preparationCollections.icpoesFoodSpl.push(newPrep);
                break;
              case "icpms_water":
                preparationCollections.icpmsWaterSpl.push(newPrep);
                break;
              case "icpoes_water":
                preparationCollections.icpoesWaterSpl.push(newPrep);
                break;
              case "aas_water":
                preparationCollections.aasWaterSpl.push(newPrep);
                break;
              case "icpms_ich_q3d":
                preparationCollections.icpmsIchQ3DSpl.push(newPrep);
                break;
              case "ors":
                preparationCollections.orsSpl.push(newPrep);
                break;
              case "anofer":
                preparationCollections.anoferSpl.push(newPrep);
                break;
              case "zpto_shampoo":
                preparationCollections.zptoShampooSpl.push(newPrep);
                break;
              case "sodium_lactate":
                preparationCollections.sodiumLactateSpl.push(newPrep);
                break;
              case "lithosun300":
                preparationCollections.lithosun300Spl.push(newPrep);
                break;
              case "lithosun400":
                preparationCollections.lithosun400Spl.push(newPrep);
                break;
              case "meropenam":
                preparationCollections.meropenam.push(newPrep);
                break;
              case "sfgc":
                preparationCollections.sfgc.push(newPrep);
                break;
              case "talc":
                preparationCollections.talc.push(newPrep);
                break;
              default:
                // [WARNING] CRITICAL FIX: Log unrecognized types but DON'T add them
                if (prepType) {
                  console.warn(
                    `  [WARNING]  Unrecognized sample preparationType: "${prepType}" for prep: "${prep.label}"`,
                  );
                } else {
                  console.warn(
                    `  [WARNING]  Sample preparation with NULL preparationType: "${prep.label}" - SKIPPED`,
                  );
                }
                break;
            }
          } else if (prepCategory === "blank") {
            preparationCollections.blank.push({
              id: newPrep.id,
              label: prep.label || "Blank Preparation",
              content: prep.content || "",
            });
          } {
            console.warn(
              `  [WARNING]  Unrecognized preparationCategory: "${prepCategory}" for prep: "${prep.label}"`,
            );
          }
        });

        if (preparationCollections.icpmsFoodSpl.length > 0) {
          setSamplePreparationIcpmsPerParam((prev) => ({
            ...prev,
            [paramId]: preparationCollections.icpmsFoodSpl,
          }));
        }

        if (preparationCollections.icpoesFoodSpl.length > 0) {
          setSamplePreparationIcpoesPerParam((prev) => ({
            ...prev,
            [paramId]: preparationCollections.icpoesFoodSpl,
          }));
        }

        if (preparationCollections.icpmsWaterSpl.length > 0) {
          setSamplePreparationIcpmsWaterPerParam((prev) => ({
            ...prev,
            [paramId]: preparationCollections.icpmsWaterSpl,
          }));
        }

        if (preparationCollections.icpoesWaterSpl.length > 0) {
          setSamplePreparationIcpoesWaterPerParam((prev) => ({
            ...prev,
            [paramId]: preparationCollections.icpoesWaterSpl,
          }));
        }

        if (preparationCollections.aasWaterSpl.length > 0) {
          setSamplePreparationAasWaterPerParam((prev) => ({
            ...prev,
            [paramId]: preparationCollections.aasWaterSpl,
          }));
        }

        if (preparationCollections.icpmsIchQ3DSpl.length > 0) {
          setSamplePreparationIcpmsIchQ3DPerParam((prev) => ({
            ...prev,
            [paramId]: preparationCollections.icpmsIchQ3DSpl,
          }));
        }

        if (preparationCollections.orsSpl.length > 0) {
          setSamplePreparationORSPerParam((prev) => ({
            ...prev,
            [paramId]: preparationCollections.orsSpl,
          }));
        }

        if (preparationCollections.anoferSpl.length > 0) {
          setSamplePreparationAnoferPerParam((prev) => ({
            ...prev,
            [paramId]: preparationCollections.anoferSpl,
          }));
        }

        if (preparationCollections.zptoShampooSpl.length > 0) {
          setSamplePreparationZptoShampooPerParam((prev) => ({
            ...prev,
            [paramId]: preparationCollections.zptoShampooSpl,
          }));
        }

        if (preparationCollections.sodiumLactateSpl.length > 0) {
          setSamplePreparationSodiumLactatePerParam((prev) => ({
            ...prev,
            [paramId]: preparationCollections.sodiumLactateSpl,
          }));
        }

        if (preparationCollections.lithosun300Spl.length > 0) {
          setSamplePreparationLithosun300PerParam((prev) => ({
            ...prev,
            [paramId]: preparationCollections.lithosun300Spl,
          }));
        }

        if (preparationCollections.lithosun400Spl.length > 0) {
          setSamplePreparationLithosun400PerParam((prev) => ({
            ...prev,
            [paramId]: preparationCollections.lithosun400Spl,
          }));
        }

        if (preparationCollections.meropenam.length > 0) {
          setSamplePreparationMeropenamPerParam((prev) => ({
            ...prev,
            [paramId]: preparationCollections.meropenam,
          }));
        }

        if (preparationCollections.sfgc.length > 0) {
          setSamplePreparationSFGCPerParam((prev) => ({
            ...prev,
            [paramId]: preparationCollections.sfgc,
          }));
        }

        if (preparationCollections.talc.length > 0) {
          setSamplePreparationTalcPerParam((prev) => ({
            ...prev,
            [paramId]: preparationCollections.talc,
          }));
        }

        if (Object.keys(preparationCollections.metalStd).length > 0) {
          setStandardPreparationMetalPerParam((prev) => ({
            ...prev,
            [paramId]: preparationCollections.metalStd,
          }));
        }

        // Blank preparations
        if (preparationCollections.blank.length > 0) {
          setBlankPreparationPerParam((prev) => ({
            ...prev,
            [paramId]: preparationCollections.blank,
          }));
          // Auto-enable the blank preparation group when data exists
          setActivePreparationGroups((prev) => ({
            ...prev,
            [paramId]: [...(prev[paramId] || []), "blankPreparation"],
          }));
        }
      }

      // ------------------------------------------------------------------------
      // 2.7: CALCULATIONS
      // ------------------------------------------------------------------------
      const prepLabelMapping: Record<string, number> = {};

      // Map all preparation labels to IDs for calculation linking
      if (param.preparations && Array.isArray(param.preparations)) {
        param.preparations.forEach((prep: any, i: number) => {
          if (prep.label) {
            prepLabelMapping[prep.label] =
              Date.now() + i + 1000 + Math.random() * 1000;
          }
        });
      }

      if (param.calculations && Array.isArray(param.calculations)) {
        const restoredCalculations = {
          icpmsFood: [] as CalculationIcpms[],
          icpoesFood: [] as CalculationIcpoes[],
          icpmsWater: [] as CalculationIcpmsWater[],
          icpoesWater: [] as CalculationIcpoesWater[],
          aasWater: [] as CalculationAasWater[],
          icpmsIchQ3D: [] as CalculationIcpmsIchQ3D[],
          ors: [] as CalculationORS[],
          anofer: [] as CalculationAnofer[],
          zptoShampoo: [] as CalculationZptoShampoo[],
          sodiumLactate: [] as CalculationSodiumLactate[],
          lithosun300: [] as CalculationLithosun300[],
          lithosun400: [] as CalculationLithosun400[],
          meropenam: [] as CalculationMeropenam[],
          sfgc: [] as CalculationSFGC[],
          talc: [] as CalculationTalc[]
        };

        param.calculations.forEach((calc: any, i: number) => {
          try {
            const parsedData =
              typeof calc.data === "string" ? JSON.parse(calc.data) : calc.data;
            const calcType = calc.calculationType || "assay";

            // Get preparation labels for linking

            const baseId = Date.now() + paramId * 10000 + i;

            // Route based on calculationType
            switch (calcType) {

              case "icpms": {
                const icpmsFoodCalc: CalculationIcpms = {
                  id: baseId + 9500,
                  label: parsedData.label || calc.label,
                  selectedSamplePreparationLabel: parsedData.selectedSamplePreparationLabel ?? null,
                  sw: parsedData.sw ?? null,
                  v1: parsedData.v1 ?? null,
                  v2: parsedData.v2 ?? null,
                  v3: parsedData.v3 ?? null,
                  v4: parsedData.v4 ?? null,
                  v5: parsedData.v5 ?? null,
                  v6: parsedData.v6 ?? null,
                  v7: parsedData.v7 ?? null,
                  instrumentConcentrationSample: parsedData.instrumentConcentrationSample || "",
                  instrumentConcentrationSampleUnit: parsedData.instrumentConcentrationSampleUnit || "ppb",
                  instrumentConcentrationBlank: parsedData.instrumentConcentrationBlank || "",
                  instrumentConcentrationBlankUnit: parsedData.instrumentConcentrationBlankUnit || "ppb",
                  acceptanceLimitMin: parsedData.acceptanceLimitMin || "",
                  acceptanceLimitMax: parsedData.acceptanceLimitMax || "",
                  calculationResult: parsedData.calculationResult ?? null,
                  calculationResultUnit: parsedData.calculationResultUnit ?? "mg/Kg",
                };
                restoredCalculations.icpmsFood.push(icpmsFoodCalc);
                break;
              }

              case "icpoes": {
                const icpoesFoodCalc: CalculationIcpoes = {
                  id: baseId + 9600,
                  label: parsedData.label || calc.label,
                  selectedSamplePreparationLabel:
                    parsedData.selectedSamplePreparationLabel ?? null,
                  sw: parsedData.sw ?? null,
                  v1: parsedData.v1 ?? null,
                  v2: parsedData.v2 ?? null,
                  v3: parsedData.v3 ?? null,
                  v4: parsedData.v4 ?? null,
                  v5: parsedData.v5 ?? null,
                  v6: parsedData.v6 ?? null,
                  v7: parsedData.v7 ?? null,
                  instrumentConcentrationSample:
                    parsedData.instrumentConcentrationSample || "",
                  instrumentConcentrationSampleUnit:
                    parsedData.instrumentConcentrationSampleUnit || "ppm",
                  instrumentConcentrationBlank:
                    parsedData.instrumentConcentrationBlank || "",
                  instrumentConcentrationBlankUnit:
                    parsedData.instrumentConcentrationBlankUnit || "ppm",
                  acceptanceLimitMin: parsedData.acceptanceLimitMin || "",
                  acceptanceLimitMax: parsedData.acceptanceLimitMax || "",
                  calculationResult: parsedData.calculationResult ?? null,
                  calculationResultUnit:
                    parsedData.calculationResultUnit ?? "mg/Kg",
                };
                restoredCalculations.icpoesFood.push(icpoesFoodCalc);
                break;
              }

              case "icpms_water": {
                const icpmsWaterCalc: CalculationIcpmsWater = {
                  id: baseId + 9700,
                  label: parsedData.label || calc.label,
                  selectedSamplePreparationLabel:
                    parsedData.selectedSamplePreparationLabel ?? null,
                  v1: parsedData.v1 ?? null,
                  v2: parsedData.v2 ?? null,
                  v3: parsedData.v3 ?? null,
                  v4: parsedData.v4 ?? null,
                  v5: parsedData.v5 ?? null,
                  v6: parsedData.v6 ?? null,
                  v7: parsedData.v7 ?? null,
                  instrumentConcentrationSample:
                    parsedData.instrumentConcentrationSample || "",
                  instrumentConcentrationSampleUnit:
                    parsedData.instrumentConcentrationSampleUnit || "ppb",
                  instrumentConcentrationBlank:
                    parsedData.instrumentConcentrationBlank || "",
                  instrumentConcentrationBlankUnit:
                    parsedData.instrumentConcentrationBlankUnit || "ppb",
                  acceptanceLimitMin: parsedData.acceptanceLimitMin || "",
                  acceptanceLimitMax: parsedData.acceptanceLimitMax || "",
                  calculationResult: parsedData.calculationResult ?? null,
                  calculationResultUnit:
                    parsedData.calculationResultUnit ?? "mg/L",
                };
                restoredCalculations.icpmsWater.push(icpmsWaterCalc);
                break;
              }

              case "icpoes_water": {
                const icpoesWaterCalc: CalculationIcpoesWater = {
                  id: baseId + 9750,
                  label: parsedData.label || calc.label,
                  selectedSamplePreparationLabel:
                    parsedData.selectedSamplePreparationLabel ?? null,
                  v1: parsedData.v1 ?? null,
                  v2: parsedData.v2 ?? null,
                  v3: parsedData.v3 ?? null,
                  v4: parsedData.v4 ?? null,
                  v5: parsedData.v5 ?? null,
                  v6: parsedData.v6 ?? null,
                  v7: parsedData.v7 ?? null,
                  instrumentConcentrationSample:
                    parsedData.instrumentConcentrationSample || "",
                  instrumentConcentrationSampleUnit:
                    parsedData.instrumentConcentrationSampleUnit || "ppb",
                  instrumentConcentrationBlank:
                    parsedData.instrumentConcentrationBlank || "",
                  instrumentConcentrationBlankUnit:
                    parsedData.instrumentConcentrationBlankUnit || "ppb",
                  acceptanceLimitMin: parsedData.acceptanceLimitMin || "",
                  acceptanceLimitMax: parsedData.acceptanceLimitMax || "",
                  calculationResult: parsedData.calculationResult ?? null,
                  calculationResultUnit:
                    parsedData.calculationResultUnit ?? "mg/L",
                };
                restoredCalculations.icpoesWater.push(icpoesWaterCalc);
                break;
              }

              case "aas_water": {
                const aasWaterCalc: CalculationAasWater = {
                  id: baseId + 9760,
                  label: parsedData.label || calc.label,
                  selectedSamplePreparationLabel:
                    parsedData.selectedSamplePreparationLabel ?? null,
                  v1: parsedData.v1 ?? null,
                  v2: parsedData.v2 ?? null,
                  v3: parsedData.v3 ?? null,
                  v4: parsedData.v4 ?? null,
                  v5: parsedData.v5 ?? null,
                  v6: parsedData.v6 ?? null,
                  v7: parsedData.v7 ?? null,
                  instrumentConcentrationSample:
                    parsedData.instrumentConcentrationSample || "",
                  instrumentConcentrationSampleUnit:
                    parsedData.instrumentConcentrationSampleUnit || "ppb",
                  instrumentConcentrationBlank:
                    parsedData.instrumentConcentrationBlank || "",
                  instrumentConcentrationBlankUnit:
                    parsedData.instrumentConcentrationBlankUnit || "ppb",
                  acceptanceLimitMin: parsedData.acceptanceLimitMin || "",
                  acceptanceLimitMax: parsedData.acceptanceLimitMax || "",
                  calculationResult: parsedData.calculationResult ?? null,
                  calculationResultUnit:
                    parsedData.calculationResultUnit ?? "mg/L",
                };
                restoredCalculations.aasWater.push(aasWaterCalc);
                break;
              }

              case "icpms_ich_q3d": {
                const icpmsIchQ3DCalc: CalculationIcpmsIchQ3D = {
                  id: baseId + 9800,
                  label: parsedData.label || calc.label,
                  selectedSamplePreparationLabel:
                    parsedData.selectedSamplePreparationLabel ?? null,
                  sw: parsedData.sw ?? null,
                  v1: parsedData.v1 ?? null,
                  v2: parsedData.v2 ?? null,
                  v3: parsedData.v3 ?? null,
                  v4: parsedData.v4 ?? null,
                  v5: parsedData.v5 ?? null,
                  v6: parsedData.v6 ?? null,
                  v7: parsedData.v7 ?? null,
                  instrumentConcentrationSample:
                    parsedData.instrumentConcentrationSample || "",
                  instrumentConcentrationSampleUnit:
                    parsedData.instrumentConcentrationSampleUnit || "ppb",
                  instrumentConcentrationBlank:
                    parsedData.instrumentConcentrationBlank || "",
                  instrumentConcentrationBlankUnit:
                    parsedData.instrumentConcentrationBlankUnit || "ppb",
                  acceptanceLimitMin: parsedData.acceptanceLimitMin || "",
                  acceptanceLimitMax: parsedData.acceptanceLimitMax || "",
                  calculationResult: parsedData.calculationResult ?? null,
                  calculationResultUnit:
                    parsedData.calculationResultUnit ?? "mg/Kg",
                };
                restoredCalculations.icpmsIchQ3D.push(icpmsIchQ3DCalc);
                break;
              }

              case "zpto_shampoo": {
                const zptoCalc: CalculationZptoShampoo = {
                  id: baseId + 10100,
                  label: parsedData.label || calc.label,
                  selectedSamplePreparationLabel:
                    parsedData.selectedSamplePreparationLabel ?? null,
                  sw: parsedData.sw ?? null,
                  v1: parsedData.v1 ?? null,
                  v2: parsedData.v2 ?? null,
                  v3: parsedData.v3 ?? null,
                  specificGravity: parsedData.specificGravity || "",
                  molecularWeight1: parsedData.molecularWeight1 || "",
                  molecularWeight2: parsedData.molecularWeight2 || "",
                  labelClaim: parsedData.labelClaim || "",
                  instrumentConcentrationSample:
                    parsedData.instrumentConcentrationSample || "",
                  instrumentConcentrationSampleUnit:
                    parsedData.instrumentConcentrationSampleUnit || "ppm",
                  instrumentConcentrationBlank:
                    parsedData.instrumentConcentrationBlank || "",
                  instrumentConcentrationBlankUnit:
                    parsedData.instrumentConcentrationBlankUnit || "ppm",
                  acceptanceLimitMin: parsedData.acceptanceLimitMin || "",
                  acceptanceLimitMax: parsedData.acceptanceLimitMax || "",
                  calculationResult: parsedData.calculationResult ?? null,
                  calculationResultUnit:
                    parsedData.calculationResultUnit ?? "% of LC",
                };
                restoredCalculations.zptoShampoo.push(zptoCalc);
                break;
              }

              case "sodium_lactate": {
                const sodiumLactateCalc: CalculationSodiumLactate = {
                  id: baseId + 10200,
                  label: parsedData.label || calc.label,
                  selectedSamplePreparationLabel:
                    parsedData.selectedSamplePreparationLabel ?? null,
                  v1: parsedData.v1 ?? null,
                  v2: parsedData.v2 ?? null,
                  v3: parsedData.v3 ?? null,
                  v4: parsedData.v4 ?? null,
                  v5: parsedData.v5 ?? null,
                  v6: parsedData.v6 ?? null,
                  v7: parsedData.v7 ?? null,
                  x1Factor: parsedData.x1Factor || "",
                  instrumentConcentrationSample:
                    parsedData.instrumentConcentrationSample || "",
                  instrumentConcentrationSampleUnit:
                    parsedData.instrumentConcentrationSampleUnit || "ppm",
                  instrumentConcentrationBlank:
                    parsedData.instrumentConcentrationBlank || "",
                  instrumentConcentrationBlankUnit:
                    parsedData.instrumentConcentrationBlankUnit || "ppm",
                  acceptanceLimitMin: parsedData.acceptanceLimitMin || "",
                  acceptanceLimitMax: parsedData.acceptanceLimitMax || "",
                  calculationResult: parsedData.calculationResult ?? null,
                  calculationResultUnit:
                    parsedData.calculationResultUnit ?? "%",
                };
                restoredCalculations.sodiumLactate.push(sodiumLactateCalc);
                break;
              }

              case "lithosun300": {
                const lithosun300Calc: CalculationLithosun300 = {
                  id: baseId + 10300,
                  label: parsedData.label || calc.label,
                  selectedSamplePreparationLabel:
                    parsedData.selectedSamplePreparationLabel ?? null,
                  v1: parsedData.v1 ?? null,
                  v2: parsedData.v2 ?? null,
                  v3: parsedData.v3 ?? null,
                  conversionFactor: parsedData.conversionFactor || null,
                  labelClaim: parsedData.labelClaim || null,
                  labelClaimUnit: parsedData.labelClaimUnit || "mg",
                  instrumentConcentrationSampleUnit:
                    parsedData.instrumentConcentrationSampleUnit || "ppm",
                  instrumentConcentrationBlank:
                    parsedData.instrumentConcentrationBlank || "",
                  instrumentConcentrationBlankUnit:
                    parsedData.instrumentConcentrationBlankUnit || "ppm",
                  // Per-tablet sample concentrations (null → falls back to primary)
                  instrumentConcentrationSampleTablet1:
                    parsedData.instrumentConcentrationSampleTablet1 ?? null,
                  instrumentConcentrationSampleTablet2:
                    parsedData.instrumentConcentrationSampleTablet2 ?? null,
                  instrumentConcentrationSampleTablet3:
                    parsedData.instrumentConcentrationSampleTablet3 ?? null,
                  instrumentConcentrationSampleTablet4:
                    parsedData.instrumentConcentrationSampleTablet4 ?? null,
                  instrumentConcentrationSampleTablet5:
                    parsedData.instrumentConcentrationSampleTablet5 ?? null,
                  instrumentConcentrationSampleTablet6:
                    parsedData.instrumentConcentrationSampleTablet6 ?? null,
                  acceptanceLimitMin: parsedData.acceptanceLimitMin || "",
                  acceptanceLimitMax: parsedData.acceptanceLimitMax || "",
                  // Per-tablet computed results
                  calculationResultTablet1:
                    parsedData.calculationResultTablet1 ?? null,
                  calculationResultTablet2:
                    parsedData.calculationResultTablet2 ?? null,
                  calculationResultTablet3:
                    parsedData.calculationResultTablet3 ?? null,
                  calculationResultTablet4:
                    parsedData.calculationResultTablet4 ?? null,
                  calculationResultTablet5:
                    parsedData.calculationResultTablet5 ?? null,
                  calculationResultTablet6:
                    parsedData.calculationResultTablet6 ?? null,
                  calculationResult: parsedData.calculationResult ?? null,
                  calculationResultUnit:
                    parsedData.calculationResultUnit ?? "% of LC",
                };
                restoredCalculations.lithosun300.push(lithosun300Calc);
                break;
              }

              case "lithosun400": {
                const lithosun400Calc: CalculationLithosun400 = {
                  id: baseId + 10400,
                  label: parsedData.label || calc.label,
                  selectedSamplePreparationLabel: parsedData.selectedSamplePreparationLabel ?? null,
                  v1: parsedData.v1 ?? null,
                  v2: parsedData.v2 ?? null,
                  v3: parsedData.v3 ?? null,
                  conversionFactor: parsedData.conversionFactor || null,
                  labelClaim: parsedData.labelClaim || null,
                  labelClaimUnit: parsedData.labelClaimUnit || "mg",
                  instrumentConcentrationSampleUnit: parsedData.instrumentConcentrationSampleUnit || "ppm",
                  numberOfTimePoints: parsedData.numberOfTimePoints || 2,
                  timePointLabel1: parsedData.timePointLabel1 ?? "Time Point 1",
                  timePointLabel2: parsedData.timePointLabel2 ?? "Time Point 2",
                  timePointLabel3: parsedData.timePointLabel3 ?? null,
                  timePointLabel4: parsedData.timePointLabel4 ?? null,
                  timePointLabel5: parsedData.timePointLabel5 ?? null,
                  timePointLabel6: parsedData.timePointLabel6 ?? null,
                  timePointLabel7: parsedData.timePointLabel7 ?? null,
                  timePointLabel8: parsedData.timePointLabel8 ?? null,
                  timePointLabel9: parsedData.timePointLabel9 ?? null,
                  timePointLabel10: parsedData.timePointLabel10 ?? null,
                  sampleT1Tab1: parsedData.sampleT1Tab1 ?? null, sampleT1Tab2: parsedData.sampleT1Tab2 ?? null, sampleT1Tab3: parsedData.sampleT1Tab3 ?? null, sampleT1Tab4: parsedData.sampleT1Tab4 ?? null, sampleT1Tab5: parsedData.sampleT1Tab5 ?? null, sampleT1Tab6: parsedData.sampleT1Tab6 ?? null,
                  sampleT2Tab1: parsedData.sampleT2Tab1 ?? null, sampleT2Tab2: parsedData.sampleT2Tab2 ?? null, sampleT2Tab3: parsedData.sampleT2Tab3 ?? null, sampleT2Tab4: parsedData.sampleT2Tab4 ?? null, sampleT2Tab5: parsedData.sampleT2Tab5 ?? null, sampleT2Tab6: parsedData.sampleT2Tab6 ?? null,
                  sampleT3Tab1: parsedData.sampleT3Tab1 ?? null, sampleT3Tab2: parsedData.sampleT3Tab2 ?? null, sampleT3Tab3: parsedData.sampleT3Tab3 ?? null, sampleT3Tab4: parsedData.sampleT3Tab4 ?? null, sampleT3Tab5: parsedData.sampleT3Tab5 ?? null, sampleT3Tab6: parsedData.sampleT3Tab6 ?? null,
                  sampleT4Tab1: parsedData.sampleT4Tab1 ?? null, sampleT4Tab2: parsedData.sampleT4Tab2 ?? null, sampleT4Tab3: parsedData.sampleT4Tab3 ?? null, sampleT4Tab4: parsedData.sampleT4Tab4 ?? null, sampleT4Tab5: parsedData.sampleT4Tab5 ?? null, sampleT4Tab6: parsedData.sampleT4Tab6 ?? null,
                  sampleT5Tab1: parsedData.sampleT5Tab1 ?? null, sampleT5Tab2: parsedData.sampleT5Tab2 ?? null, sampleT5Tab3: parsedData.sampleT5Tab3 ?? null, sampleT5Tab4: parsedData.sampleT5Tab4 ?? null, sampleT5Tab5: parsedData.sampleT5Tab5 ?? null, sampleT5Tab6: parsedData.sampleT5Tab6 ?? null,
                  sampleT6Tab1: parsedData.sampleT6Tab1 ?? null, sampleT6Tab2: parsedData.sampleT6Tab2 ?? null, sampleT6Tab3: parsedData.sampleT6Tab3 ?? null, sampleT6Tab4: parsedData.sampleT6Tab4 ?? null, sampleT6Tab5: parsedData.sampleT6Tab5 ?? null, sampleT6Tab6: parsedData.sampleT6Tab6 ?? null,
                  sampleT7Tab1: parsedData.sampleT7Tab1 ?? null, sampleT7Tab2: parsedData.sampleT7Tab2 ?? null, sampleT7Tab3: parsedData.sampleT7Tab3 ?? null, sampleT7Tab4: parsedData.sampleT7Tab4 ?? null, sampleT7Tab5: parsedData.sampleT7Tab5 ?? null, sampleT7Tab6: parsedData.sampleT7Tab6 ?? null,
                  sampleT8Tab1: parsedData.sampleT8Tab1 ?? null, sampleT8Tab2: parsedData.sampleT8Tab2 ?? null, sampleT8Tab3: parsedData.sampleT8Tab3 ?? null, sampleT8Tab4: parsedData.sampleT8Tab4 ?? null, sampleT8Tab5: parsedData.sampleT8Tab5 ?? null, sampleT8Tab6: parsedData.sampleT8Tab6 ?? null,
                  sampleT9Tab1: parsedData.sampleT9Tab1 ?? null, sampleT9Tab2: parsedData.sampleT9Tab2 ?? null, sampleT9Tab3: parsedData.sampleT9Tab3 ?? null, sampleT9Tab4: parsedData.sampleT9Tab4 ?? null, sampleT9Tab5: parsedData.sampleT9Tab5 ?? null, sampleT9Tab6: parsedData.sampleT9Tab6 ?? null,
                  sampleT10Tab1: parsedData.sampleT10Tab1 ?? null, sampleT10Tab2: parsedData.sampleT10Tab2 ?? null, sampleT10Tab3: parsedData.sampleT10Tab3 ?? null, sampleT10Tab4: parsedData.sampleT10Tab4 ?? null, sampleT10Tab5: parsedData.sampleT10Tab5 ?? null, sampleT10Tab6: parsedData.sampleT10Tab6 ?? null,
                  resultT1Tab1: parsedData.resultT1Tab1 ?? null, resultT1Tab2: parsedData.resultT1Tab2 ?? null, resultT1Tab3: parsedData.resultT1Tab3 ?? null, resultT1Tab4: parsedData.resultT1Tab4 ?? null, resultT1Tab5: parsedData.resultT1Tab5 ?? null, resultT1Tab6: parsedData.resultT1Tab6 ?? null,
                  resultT2Tab1: parsedData.resultT2Tab1 ?? null, resultT2Tab2: parsedData.resultT2Tab2 ?? null, resultT2Tab3: parsedData.resultT2Tab3 ?? null, resultT2Tab4: parsedData.resultT2Tab4 ?? null, resultT2Tab5: parsedData.resultT2Tab5 ?? null, resultT2Tab6: parsedData.resultT2Tab6 ?? null,
                  resultT3Tab1: parsedData.resultT3Tab1 ?? null, resultT3Tab2: parsedData.resultT3Tab2 ?? null, resultT3Tab3: parsedData.resultT3Tab3 ?? null, resultT3Tab4: parsedData.resultT3Tab4 ?? null, resultT3Tab5: parsedData.resultT3Tab5 ?? null, resultT3Tab6: parsedData.resultT3Tab6 ?? null,
                  resultT4Tab1: parsedData.resultT4Tab1 ?? null, resultT4Tab2: parsedData.resultT4Tab2 ?? null, resultT4Tab3: parsedData.resultT4Tab3 ?? null, resultT4Tab4: parsedData.resultT4Tab4 ?? null, resultT4Tab5: parsedData.resultT4Tab5 ?? null, resultT4Tab6: parsedData.resultT4Tab6 ?? null,
                  resultT5Tab1: parsedData.resultT5Tab1 ?? null, resultT5Tab2: parsedData.resultT5Tab2 ?? null, resultT5Tab3: parsedData.resultT5Tab3 ?? null, resultT5Tab4: parsedData.resultT5Tab4 ?? null, resultT5Tab5: parsedData.resultT5Tab5 ?? null, resultT5Tab6: parsedData.resultT5Tab6 ?? null,
                  resultT6Tab1: parsedData.resultT6Tab1 ?? null, resultT6Tab2: parsedData.resultT6Tab2 ?? null, resultT6Tab3: parsedData.resultT6Tab3 ?? null, resultT6Tab4: parsedData.resultT6Tab4 ?? null, resultT6Tab5: parsedData.resultT6Tab5 ?? null, resultT6Tab6: parsedData.resultT6Tab6 ?? null,
                  resultT7Tab1: parsedData.resultT7Tab1 ?? null, resultT7Tab2: parsedData.resultT7Tab2 ?? null, resultT7Tab3: parsedData.resultT7Tab3 ?? null, resultT7Tab4: parsedData.resultT7Tab4 ?? null, resultT7Tab5: parsedData.resultT7Tab5 ?? null, resultT7Tab6: parsedData.resultT7Tab6 ?? null,
                  resultT8Tab1: parsedData.resultT8Tab1 ?? null, resultT8Tab2: parsedData.resultT8Tab2 ?? null, resultT8Tab3: parsedData.resultT8Tab3 ?? null, resultT8Tab4: parsedData.resultT8Tab4 ?? null, resultT8Tab5: parsedData.resultT8Tab5 ?? null, resultT8Tab6: parsedData.resultT8Tab6 ?? null,
                  resultT9Tab1: parsedData.resultT9Tab1 ?? null, resultT9Tab2: parsedData.resultT9Tab2 ?? null, resultT9Tab3: parsedData.resultT9Tab3 ?? null, resultT9Tab4: parsedData.resultT9Tab4 ?? null, resultT9Tab5: parsedData.resultT9Tab5 ?? null, resultT9Tab6: parsedData.resultT9Tab6 ?? null,
                  resultT10Tab1: parsedData.resultT10Tab1 ?? null, resultT10Tab2: parsedData.resultT10Tab2 ?? null, resultT10Tab3: parsedData.resultT10Tab3 ?? null, resultT10Tab4: parsedData.resultT10Tab4 ?? null, resultT10Tab5: parsedData.resultT10Tab5 ?? null, resultT10Tab6: parsedData.resultT10Tab6 ?? null,
                  minT1: parsedData.minT1 ?? null, avgT1: parsedData.avgT1 ?? null, maxT1: parsedData.maxT1 ?? null,
                  minT2: parsedData.minT2 ?? null, avgT2: parsedData.avgT2 ?? null, maxT2: parsedData.maxT2 ?? null,
                  minT3: parsedData.minT3 ?? null, avgT3: parsedData.avgT3 ?? null, maxT3: parsedData.maxT3 ?? null,
                  minT4: parsedData.minT4 ?? null, avgT4: parsedData.avgT4 ?? null, maxT4: parsedData.maxT4 ?? null,
                  minT5: parsedData.minT5 ?? null, avgT5: parsedData.avgT5 ?? null, maxT5: parsedData.maxT5 ?? null,
                  minT6: parsedData.minT6 ?? null, avgT6: parsedData.avgT6 ?? null, maxT6: parsedData.maxT6 ?? null,
                  minT7: parsedData.minT7 ?? null, avgT7: parsedData.avgT7 ?? null, maxT7: parsedData.maxT7 ?? null,
                  minT8: parsedData.minT8 ?? null, avgT8: parsedData.avgT8 ?? null, maxT8: parsedData.maxT8 ?? null,
                  minT9: parsedData.minT9 ?? null, avgT9: parsedData.avgT9 ?? null, maxT9: parsedData.maxT9 ?? null,
                  minT10: parsedData.minT10 ?? null, avgT10: parsedData.avgT10 ?? null, maxT10: parsedData.maxT10 ?? null,
                  acceptanceLimitMin1: parsedData.acceptanceLimitMin1 ?? null, acceptanceLimitMax1: parsedData.acceptanceLimitMax1 ?? null,
                  acceptanceLimitMin2: parsedData.acceptanceLimitMin2 ?? null, acceptanceLimitMax2: parsedData.acceptanceLimitMax2 ?? null,
                  acceptanceLimitMin3: parsedData.acceptanceLimitMin3 ?? null, acceptanceLimitMax3: parsedData.acceptanceLimitMax3 ?? null,
                  acceptanceLimitMin4: parsedData.acceptanceLimitMin4 ?? null, acceptanceLimitMax4: parsedData.acceptanceLimitMax4 ?? null,
                  acceptanceLimitMin5: parsedData.acceptanceLimitMin5 ?? null, acceptanceLimitMax5: parsedData.acceptanceLimitMax5 ?? null,
                  acceptanceLimitMin6: parsedData.acceptanceLimitMin6 ?? null, acceptanceLimitMax6: parsedData.acceptanceLimitMax6 ?? null,
                  acceptanceLimitMin7: parsedData.acceptanceLimitMin7 ?? null, acceptanceLimitMax7: parsedData.acceptanceLimitMax7 ?? null,
                  acceptanceLimitMin8: parsedData.acceptanceLimitMin8 ?? null, acceptanceLimitMax8: parsedData.acceptanceLimitMax8 ?? null,
                  acceptanceLimitMin9: parsedData.acceptanceLimitMin9 ?? null, acceptanceLimitMax9: parsedData.acceptanceLimitMax9 ?? null,
                  acceptanceLimitMin10: parsedData.acceptanceLimitMin10 ?? null, acceptanceLimitMax10: parsedData.acceptanceLimitMax10 ?? null,
                  calculationResultUnit: parsedData.calculationResultUnit ?? "% of LC",
                  instrumentConcentrationBlankT1: parsedData.instrumentConcentrationBlankT1 ?? null,
                  instrumentConcentrationBlankUnitT1: parsedData.instrumentConcentrationBlankUnitT1 ?? null,
                  instrumentConcentrationBlankT2: parsedData.instrumentConcentrationBlankT2 ?? null,
                  instrumentConcentrationBlankUnitT2: parsedData.instrumentConcentrationBlankUnitT2 ?? null,
                  instrumentConcentrationBlankT3: parsedData.instrumentConcentrationBlankT3 ?? null,
                  instrumentConcentrationBlankUnitT3: parsedData.instrumentConcentrationBlankUnitT3 ?? null,
                  instrumentConcentrationBlankT4: parsedData.instrumentConcentrationBlankT4 ?? null,
                  instrumentConcentrationBlankUnitT4: parsedData.instrumentConcentrationBlankUnitT4 ?? null,
                  instrumentConcentrationBlankT5: parsedData.instrumentConcentrationBlankT5 ?? null,
                  instrumentConcentrationBlankUnitT5: parsedData.instrumentConcentrationBlankUnitT5 ?? null,
                  instrumentConcentrationBlankT6: parsedData.instrumentConcentrationBlankT6 ?? null,
                  instrumentConcentrationBlankUnitT6: parsedData.instrumentConcentrationBlankUnitT6 ?? null,
                  instrumentConcentrationBlankT7: parsedData.instrumentConcentrationBlankT7 ?? null,
                  instrumentConcentrationBlankUnitT7: parsedData.instrumentConcentrationBlankUnitT7 ?? null,
                  instrumentConcentrationBlankT8: parsedData.instrumentConcentrationBlankT8 ?? null,
                  instrumentConcentrationBlankUnitT8: parsedData.instrumentConcentrationBlankUnitT8 ?? null,
                  instrumentConcentrationBlankT9: parsedData.instrumentConcentrationBlankT9 ?? null,
                  instrumentConcentrationBlankUnitT9: parsedData.instrumentConcentrationBlankUnitT9 ?? null,
                  instrumentConcentrationBlankT10: parsedData.instrumentConcentrationBlankT10 ?? null,
                  instrumentConcentrationBlankUnitT10: parsedData.instrumentConcentrationBlankUnitT10 ?? null
                };
                restoredCalculations.lithosun400.push(lithosun400Calc);
                break;
              }

              case "anofer": {
                const anoferCalc: CalculationAnofer = {
                  id: baseId + 10000,
                  label: parsedData.label || calc.label,
                  selectedSamplePreparationLabel: parsedData.selectedSamplePreparationLabel ?? null,
                  sw: parsedData.sw ?? null,
                  v1: parsedData.v1 ?? null,
                  v2: parsedData.v2 ?? null,
                  v3: parsedData.v3 ?? null,
                  v4: parsedData.v4 ?? null,
                  v5: parsedData.v5 ?? null,
                  avgWeight: parsedData.avgWeight || "",
                  avgWeightUnit: parsedData.avgWeightUnit || "g",
                  labelClaim: parsedData.labelClaim || "",
                  instrumentConcentrationSample: parsedData.instrumentConcentrationSample || "",
                  instrumentConcentrationSampleUnit: parsedData.instrumentConcentrationSampleUnit || "ppm",
                  instrumentConcentrationBlank: parsedData.instrumentConcentrationBlank || "",
                  instrumentConcentrationBlankUnit: parsedData.instrumentConcentrationBlankUnit || "ppm",
                  acceptanceLimitMin: parsedData.acceptanceLimitMin || "",
                  acceptanceLimitMax: parsedData.acceptanceLimitMax || "",
                  calculationResult: parsedData.calculationResult ?? null,
                  calculationResultUnit: parsedData.calculationResultUnit ?? "% of LC",
                  labelClaimUnit: parsedData.labelClaimUnit ?? ""
                };
                restoredCalculations.anofer.push(anoferCalc);
                break;
              }

              case "ors": {
                const orsCalc: CalculationORS = {
                  id: baseId + 9900,
                  label: parsedData.label || calc.label,
                  selectedSamplePreparationLabel: parsedData.selectedSamplePreparationLabel ?? null,
                  sw: parsedData.sw ?? null,
                  v1: parsedData.v1 ?? null,
                  v2: parsedData.v2 ?? null,
                  v3: parsedData.v3 ?? null,
                  v4: parsedData.v4 ?? null,
                  v5: parsedData.v5 ?? null,
                  v6: parsedData.v6 ?? null,
                  v7: parsedData.v7 ?? null,
                  sachetWeightAvg: parsedData.sachetWeightAvg || "",
                  sachetWeightAvgUnit: parsedData.sachetWeightAvgUnit || "g",
                  molecularWeight: parsedData.molecularWeight || "",
                  molecularWeightUnit: parsedData.molecularWeightUnit || "g/mol",
                  labelClaim: parsedData.labelClaim || "",
                  instrumentConcentrationSample: parsedData.instrumentConcentrationSample || "",
                  instrumentConcentrationSampleUnit: parsedData.instrumentConcentrationSampleUnit || "ppm",
                  instrumentConcentrationBlank: parsedData.instrumentConcentrationBlank || "",
                  instrumentConcentrationBlankUnit: parsedData.instrumentConcentrationBlankUnit || "ppm",
                  acceptanceLimitMin: parsedData.acceptanceLimitMin || "",
                  acceptanceLimitMax: parsedData.acceptanceLimitMax || "",
                  calculationResult: parsedData.calculationResult ?? null,
                  calculationResultUnit: parsedData.calculationResultUnit ?? "% of LC",
                  labelClaimUnit: ""
                };
                restoredCalculations.ors.push(orsCalc);
                break;
              }

              case "meropenam": {
                const meropenamCalc: CalculationMeropenam = {
                  id: baseId + 9700,
                  label: parsedData.label || calc.label,
                  selectedSamplePreparationLabel:
                    parsedData.selectedSamplePreparationLabel ?? null,
                  sw: parsedData.sw ?? null,
                  v1: parsedData.v1 ?? null,
                  v2: parsedData.v2 ?? null,
                  v3: parsedData.v3 ?? null,
                  v4: parsedData.v4 ?? null,
                  v5: parsedData.v5 ?? null,
                  v6: parsedData.v6 ?? null,
                  v7: parsedData.v7 ?? null,
                  instrumentConcentrationSample: parsedData.instrumentConcentrationSample || "",
                  instrumentConcentrationSampleUnit: parsedData.instrumentConcentrationSampleUnit || "",
                  instrumentConcentrationBlank: parsedData.instrumentConcentrationBlank || "",
                  instrumentConcentrationBlankUnit: parsedData.instrumentConcentrationBlankunit || "",
                  labelClaim: parsedData.labelClaim || "",
                  labelClaimUnit: parsedData.labelClaimUnit || "",
                  acceptanceLimitMin: parsedData.acceptanceLimitMin ?? null,
                  acceptanceLimitMax: parsedData.acceptanceLimitMax ?? null,
                  calculationResult: parsedData.calculationResult ?? null,
                  calculationResultUnit:
                    parsedData.calculationResultUnit ?? "% of LC",
                };
                restoredCalculations.meropenam.push(meropenamCalc);
                break;
              }

              case "sfgc": {
                const sfgcCalc: CalculationSFGC = {
                  id: baseId + 9340,
                  label: parsedData.label || calc.label,
                  selectedSamplePreparationLabel:
                    parsedData.selectedSamplePreparationLabel ?? null,
                  sw: parsedData.sw ?? null,
                  v1: parsedData.v1 ?? null,
                  v2: parsedData.v2 ?? null,
                  v3: parsedData.v3 ?? null,
                  v4: parsedData.v4 ?? null,
                  v5: parsedData.v5 ?? null,
                  v6: parsedData.v6 ?? null,
                  v7: parsedData.v7 ?? null,
                  instrumentConcentrationSample: parsedData.instrumentConcentrationSample || "",
                  instrumentConcentrationSampleUnit: parsedData.instrumentConcentrationSampleUnit || "",
                  instrumentConcentrationBlank: parsedData.instrumentConcentrationBlank || "",
                  instrumentConcentrationBlankUnit: parsedData.instrumentConcentrationBlankunit || "",
                  acceptanceLimitMin: parsedData.acceptanceLimitMin ?? null,
                  acceptanceLimitMax: parsedData.acceptanceLimitMax ?? null,
                  calculationResult: parsedData.calculationResult ?? null,
                  calculationResultUnit:
                    parsedData.calculationResultUnit ?? "% of LC",
                };
                restoredCalculations.sfgc.push(sfgcCalc);
                break;
              }

              case "talc": {
                const talcCalc: CalculationTalc = {
                  id: baseId + 9330,
                  label: parsedData.label || calc.label,
                  selectedSamplePreparationLabel:
                    parsedData.selectedSamplePreparationLabel ?? null,
                  sw: parsedData.sw ?? null,
                  v1: parsedData.v1 ?? null,
                  v2: parsedData.v2 ?? null,
                  v3: parsedData.v3 ?? null,
                  v4: parsedData.v4 ?? null,
                  v5: parsedData.v5 ?? null,
                  v6: parsedData.v6 ?? null,
                  v7: parsedData.v7 ?? null,
                  instrumentConcentrationSample: parsedData.instrumentConcentrationSample || "",
                  instrumentConcentrationSampleUnit: parsedData.instrumentConcentrationSampleUnit || "ppm",
                  instrumentConcentrationBlank: parsedData.instrumentConcentrationBlank || "",
                  instrumentConcentrationBlankUnit: parsedData.instrumentConcentrationBlankUnit || "ppm",
                  acceptanceLimitMin: parsedData.acceptanceLimitMin ?? "",
                  acceptanceLimitMax: parsedData.acceptanceLimitMax ?? "",
                  calculationResult: parsedData.calculationResult ?? null,
                  calculationResultUnit: parsedData.calculationResultUnit ?? "%",
                };
                restoredCalculations.talc.push(talcCalc);
                break;
              }

              default:
                console.warn(`Unrecognized calculationType: "${calcType}"`);
                break;
            }
          } catch (e) {
            console.error(`Error parsing calculation ${i + 1}:`, e);
          }
        });

        // Set calculation state ONLY if arrays have items

        if (restoredCalculations.icpmsFood.length > 0) {
          setCalculationsIcpmsPerParam((prev) => ({
            ...prev,
            [paramId]: restoredCalculations.icpmsFood,
          }));
        }

        if (restoredCalculations.icpoesFood.length > 0) {
          setCalculationsIcpoesPerParam((prev) => ({
            ...prev,
            [paramId]: restoredCalculations.icpoesFood,
          }));
        }

        if (restoredCalculations.icpmsWater.length > 0) {
          setCalculationsIcpmsWaterPerParam((prev) => ({
            ...prev,
            [paramId]: restoredCalculations.icpmsWater,
          }));
        }

        if (restoredCalculations.icpoesWater.length > 0) {
          setCalculationsIcpoesWaterPerParam((prev) => ({
            ...prev,
            [paramId]: restoredCalculations.icpoesWater,
          }));
        }

        if (restoredCalculations.aasWater.length > 0) {
          setCalculationsAasWaterPerParam((prev) => ({
            ...prev,
            [paramId]: restoredCalculations.aasWater,
          }));
        }

        if (restoredCalculations.icpmsIchQ3D.length > 0) {
          setCalculationsIcpmsIchQ3DPerParam((prev) => ({
            ...prev,
            [paramId]: restoredCalculations.icpmsIchQ3D,
          }));
        }

        if (restoredCalculations.ors.length > 0) {
          setCalculationsORSPerParam((prev) => ({
            ...prev,
            [paramId]: restoredCalculations.ors,
          }));
        }

        if (restoredCalculations.anofer.length > 0) {
          setCalculationsAnoferPerParam((prev) => ({
            ...prev,
            [paramId]: restoredCalculations.anofer,
          }));
        }

        if (restoredCalculations.zptoShampoo.length > 0) {
          setCalculationsZptoShampooPerParam((prev) => ({
            ...prev,
            [paramId]: restoredCalculations.zptoShampoo,
          }));
        }

        if (restoredCalculations.sodiumLactate.length > 0) {
          setCalculationsSodiumLactatePerParam((prev) => ({
            ...prev,
            [paramId]: restoredCalculations.sodiumLactate,
          }));
        }

        if (restoredCalculations.lithosun300.length > 0) {
          setCalculationsLithosun300PerParam((prev) => ({
            ...prev,
            [paramId]: restoredCalculations.lithosun300,
          }));
        }

        if (restoredCalculations.lithosun400.length > 0) {
          setCalculationsLithosun400PerParam((prev) => ({
            ...prev,
            [paramId]: restoredCalculations.lithosun400,
          }));
        }

        if (restoredCalculations.meropenam.length > 0) {
          setCalculationsMeropenamPerParam((prev) => ({
            ...prev,
            [paramId]: restoredCalculations.meropenam,
          }));
        }

        if (restoredCalculations.sfgc.length > 0) {
          setCalculationsSFGCPerParam((prev) => ({
            ...prev,
            [paramId]: restoredCalculations.sfgc,
          }));
        }

        if (restoredCalculations.talc.length > 0) {
          setCalculationsTalcPerParam((prev) => ({
            ...prev,
            [paramId]: restoredCalculations.talc,
          }));
        }
      }

      const activeGroups: string[] = [];

      if (param.preparations && Array.isArray(param.preparations)) {

        // Check for ICP-MS preparations
        if (
          param.preparations.some(
            (p: any) => p.preparationType === "icpms",
          ) ||
          (param.calculations &&
            Array.isArray(param.calculations) &&
            param.calculations.some(
              (c: any) => c.calculationType === "icpms",
            ))
        ) {
          activeGroups.push("icpmsFood");
        }

        // Check for ICP-OES preparations
        if (
          param.preparations.some(
            (p: any) => p.preparationType === "icpoes",
          ) ||
          (param.calculations &&
            Array.isArray(param.calculations) &&
            param.calculations.some(
              (c: any) => c.calculationType === "icpoes",
            ))
        ) {
          activeGroups.push("icpoesFood");
        }

        // Check for ICP-MS (Water) preparations
        if (
          param.preparations.some(
            (p: any) => p.preparationType === "icpms_water",
          ) ||
          (param.calculations &&
            Array.isArray(param.calculations) &&
            param.calculations.some(
              (c: any) => c.calculationType === "icpms_water",
            ))
        ) {
          activeGroups.push("icpmsWater");
        }

        // Check for ICP-OES (Water) preparations
        if (
          param.preparations.some(
            (p: any) => p.preparationType === "icpoes_water",
          ) ||
          (param.calculations &&
            Array.isArray(param.calculations) &&
            param.calculations.some(
              (c: any) => c.calculationType === "icpoes_water",
            ))
        ) {
          activeGroups.push("icpoesWater");
        }

        // Check for AAS (Water) preparations
        if (
          param.preparations.some(
            (p: any) => p.preparationType === "aas_water",
          ) ||
          (param.calculations &&
            Array.isArray(param.calculations) &&
            param.calculations.some(
              (c: any) => c.calculationType === "aas_water",
            ))
        ) {
          activeGroups.push("aasWater");
        }

        // Check for ICP-MS (ICH-Q3D) preparations
        if (
          param.preparations.some(
            (p: any) => p.preparationType === "icpms_ich_q3d",
          ) ||
          (param.calculations &&
            Array.isArray(param.calculations) &&
            param.calculations.some(
              (c: any) => c.calculationType === "icpms_ich_q3d",
            ))
        ) {
          activeGroups.push("icpmsIchQ3D");
        }

        // Check for ORS preparations
        if (
          param.preparations.some(
            (p: any) => p.preparationType === "ors",
          ) ||
          (param.calculations &&
            Array.isArray(param.calculations) &&
            param.calculations.some(
              (c: any) => c.calculationType === "ors",
            ))
        ) {
          activeGroups.push("ors");
        }

        // Check for Anofer preparations
        if (
          param.preparations.some(
            (p: any) => p.preparationType === "anofer",
          ) ||
          (param.calculations &&
            Array.isArray(param.calculations) &&
            param.calculations.some(
              (c: any) => c.calculationType === "anofer",
            ))
        ) {
          activeGroups.push("anofer");
        }

        // Check for ZPTO Shampoo preparations
        if (
          param.preparations.some(
            (p: any) => p.preparationType === "zpto_shampoo",
          ) ||
          (param.calculations &&
            Array.isArray(param.calculations) &&
            param.calculations.some(
              (c: any) => c.calculationType === "zpto_shampoo",
            ))
        ) {
          activeGroups.push("zptoShampoo");
        }

        if (
          param.preparations.some(
            (p: any) => p.preparationType === "sodium_lactate",
          ) ||
          (param.calculations &&
            Array.isArray(param.calculations) &&
            param.calculations.some(
              (c: any) => c.calculationType === "sodium_lactate",
            ))
        ) {
          activeGroups.push("sodiumLactate");
        }

        if (
          param.preparations.some(
            (p: any) => p.preparationType === "lithosun300",
          ) ||
          (param.calculations &&
            Array.isArray(param.calculations) &&
            param.calculations.some(
              (c: any) => c.calculationType === "lithosun300",
            ))
        ) {
          activeGroups.push("lithosun300");
        }

        if (
          param.preparations.some(
            (p: any) => p.preparationType === "lithosun400",
          ) ||
          (param.calculations &&
            Array.isArray(param.calculations) &&
            param.calculations.some(
              (c: any) => c.calculationType === "lithosun400",
            ))
        ) {
          activeGroups.push("lithosun400");
        }

        if (
          param.preparations.some(
            (p: any) => p.preparationType === "meropenam",
          ) ||
          (param.calculations &&
            Array.isArray(param.calculations) &&
            param.calculations.some(
              (c: any) => c.calculationType === "meropenam",
            ))
        ) {
          activeGroups.push("meropenam");
        }

        if (
          param.preparations.some(
            (p: any) => p.preparationType === "sfgc",
          ) ||
          (param.calculations &&
            Array.isArray(param.calculations) &&
            param.calculations.some(
              (c: any) => c.calculationType === "sfgc",
            ))
        ) {
          activeGroups.push("sfgc");
        }

        if (
          param.preparations.some(
            (p: any) => p.preparationType === "talc",
          ) ||
          (param.calculations &&
            Array.isArray(param.calculations) &&
            param.calculations.some(
              (c: any) => c.calculationType === "talc",
            ))
        ) {
          activeGroups.push("talc");
        }

      }

      if (param.files && Array.isArray(param.files) && param.files.length > 0) {
        const slotMap: Record<string, AttachedFile[]> = {};

        for (const f of param.files) {
          // Treat null / undefined / empty-string all as "no value"
          const hasType = f.preparationType != null && f.preparationType !== "";
          const hasLabel = f.label != null && f.label !== "";

          // Param-level files have neither type nor label
          const slotKey =
            !hasType && !hasLabel
              ? "param_level"
              : `${hasType ? f.preparationType : ""}|${hasLabel ? f.label : ""}`;

          if (!slotMap[slotKey]) slotMap[slotKey] = [];
          slotMap[slotKey].push({
            id: f.id ?? 0,
            fileName: f.fileName,
            fileDataBase64: f.fileDataBase64 ?? null,
            preparationType: hasType ? f.preparationType : null,
            label: hasLabel ? f.label : null,
          });
        }

        restoredFilesPerParam[paramId] = slotMap;

        // Show param-level section if we have param-level files
        if (slotMap["param_level"]?.length) {
          restoredShowParamFiles[paramId] = true;
        }
      }

      if (activeGroups.length > 0) {
        setActivePreparationGroups((prev) => ({
          ...prev,
          [paramId]: activeGroups,
        }));
      }
    });

    // Set file state once cleanly — no stale merging with old paramIds
    setFilesPerParam(restoredFilesPerParam);
    setShowParamFiles(restoredShowParamFiles);

    setSelectedParamsForDetail(restoredParams.map((p) => p.id));
  };

  useEffect(() => {
    if (!instruments) return;
  }, [instruments]);

  useEffect(() => {
    if (!chemicals) return;
  }, [chemicals]);

  useEffect(() => {
    if (!standards) return;
  }, [standards]);

  const collectFormDataForAPI = (): WorksheetRequest => {
    return {
      role: role,
      worksheetId: worksheetId,
      registrationInfo: {
        registrationNo: worksheetInfo?.sample.registrationNo || registrationNo,
        sampleName: worksheetInfo?.sample?.sampleName!,
        numberOfParameters: addedParameters.length!,
        dueDate: worksheetInfo?.sample?.dueDate!,
        lab: worksheetInfo?.sample.lab!,
      },
      documentInfo: {
        preparedBy: employeeId,
        status: worksheetInfo?.sample.status,
        approvedAt: worksheetInfo?.sample?.approvedAt || null,
      },
      parameters: addedParameters.map((param) => {
        const preparations = [
          // Sample Preparations for ICP-MS FOOD
          ...(samplePreparationIcpmsPerParam[param.id] || []).map((sp) => ({
            label: sp.label,
            preparationCategory: "sample",
            preparationType: "icpms",
            assignedStandardId: null,
            steps: JSON.stringify(sp.steps),
          })),
          // Sample Preparations for ICP-OES
          ...(samplePreparationIcpoesPerParam[param.id] || []).map((sp) => ({
            label: sp.label,
            preparationCategory: "sample",
            preparationType: "icpoes",
            assignedStandardId: null,
            steps: JSON.stringify(sp.steps),
          })),
          // Sample Preparations for ICP-MS (Water)
          ...(samplePreparationIcpmsWaterPerParam[param.id] || []).map((sp) => ({
            label: sp.label,
            preparationCategory: "sample",
            preparationType: "icpms_water",
            assignedStandardId: null,
            steps: JSON.stringify(sp.steps),
          })),
          // Sample Preparations for ICP-OES (Water)
          ...(samplePreparationIcpoesWaterPerParam[param.id] || []).map((sp) => ({
            label: sp.label,
            preparationCategory: "sample",
            preparationType: "icpoes_water",
            assignedStandardId: null,
            steps: JSON.stringify(sp.steps),
          })),
          // Sample Preparations for AAS (Water)
          ...(samplePreparationAasWaterPerParam[param.id] || []).map((sp) => ({
            label: sp.label,
            preparationCategory: "sample",
            preparationType: "aas_water",
            assignedStandardId: null,
            steps: JSON.stringify(sp.steps),
          })),
          // Sample Preparations for ICP-MS (ICH-Q3D)
          ...(samplePreparationIcpmsIchQ3DPerParam[param.id] || []).map((sp) => ({
            label: sp.label,
            preparationCategory: "sample",
            preparationType: "icpms_ich_q3d",
            assignedStandardId: null,
            steps: JSON.stringify(sp.steps),
          })),
          // Sample Preparations for ORS
          ...(samplePreparationORSPerParam[param.id] || []).map((sp) => ({
            label: sp.label,
            preparationCategory: "sample",
            preparationType: "ors",
            assignedStandardId: null,
            steps: JSON.stringify(sp.steps),
          })),
          // Sample Preparations for Anofer
          ...(samplePreparationAnoferPerParam[param.id] || []).map((sp) => ({
            label: sp.label,
            preparationCategory: "sample",
            preparationType: "anofer",
            assignedStandardId: null,
            steps: JSON.stringify(sp.steps),
          })),
          // Sample Preparations for ZPTO Shampoo
          ...(samplePreparationZptoShampooPerParam[param.id] || []).map((sp) => ({
            label: sp.label,
            preparationCategory: "sample",
            preparationType: "zpto_shampoo",
            assignedStandardId: null,
            steps: JSON.stringify(sp.steps),
          })),
          // Sample Preparations for Sodium Lactate
          ...(samplePreparationSodiumLactatePerParam[param.id] || []).map((sp) => ({
            label: sp.label,
            preparationCategory: "sample",
            preparationType: "sodium_lactate",
            assignedStandardId: null,
            steps: JSON.stringify(sp.steps),
          })),
          // Sample Preparations for Lithosun 300
          ...(samplePreparationLithosun300PerParam[param.id] || []).map((sp) => ({
            label: sp.label,
            preparationCategory: "sample",
            preparationType: "lithosun300",
            assignedStandardId: null,
            steps: JSON.stringify(sp.steps),
          })),
          // Sample Preparations for Lithosun 400
          ...(samplePreparationLithosun400PerParam[param.id] || []).map((sp) => ({
            label: sp.label,
            preparationCategory: "sample",
            preparationType: "lithosun400",
            assignedStandardId: null,
            steps: JSON.stringify(sp.steps),
          })),
          ...(samplePreparationMeropenamPerParam[param.id] || []).map((sp) => ({
            label: sp.label,
            preparationCategory: "sample",
            preparationType: "meropenam",
            assignedStandardId: null,
            steps: JSON.stringify(sp.steps),
          })),
          ...(samplePreparationSFGCPerParam[param.id] || []).map((sp) => ({
            label: sp.label,
            preparationCategory: "sample",
            preparationType: "sfgc",
            assignedStandardId: null,
            steps: JSON.stringify(sp.steps),
          })),
          ...(samplePreparationTalcPerParam[param.id] || []).map((sp) => ({
            label: sp.label,
            preparationCategory: "sample",
            preparationType: "talc",
            assignedStandardId: null,
            steps: JSON.stringify(sp.steps),
          })),
          // Standard Preparations for Metal groups
          ...Object.entries(standardPreparationMetalPerParam[param.id] || {}).flatMap(([groupId, preps]) => {
            const prepType = METAL_GROUP_TO_TYPE[groupId] || groupId;
            return preps.map((sp) => ({
              label: sp.label,
              preparationCategory: "standard",
              preparationType: prepType,
              assignedStandardId: null,
              steps: JSON.stringify(sp.steps),
            }));
          }),

          ...(blankPreparationPerParam[param.id] || []).map((bp) => ({
            label: bp.label,
            preparationCategory: "blank",
            preparationType: null,
            assignedStandardId: null,
            steps: null,
            content: bp.content,
          })),
        ];

        // Collect all calculations with their types
        const calculations = [
          ...(calculationsIcpmsPerParam[param.id] || []).map((calc) => {
            const dataObj = { ...calc } as any;
            return {
              label: calc.label,
              calculationType: "icpms",
              data: JSON.stringify(dataObj),
            };
          }),
          ...(calculationsIcpoesPerParam[param.id] || []).map((calc) => {
            const dataObj = { ...calc } as any;
            return {
              label: calc.label,
              calculationType: "icpoes",
              data: JSON.stringify(dataObj),
            };
          }),
          ...(calculationsIcpmsWaterPerParam[param.id] || []).map((calc) => {
            const dataObj = { ...calc } as any;
            return {
              label: calc.label,
              calculationType: "icpms_water",
              data: JSON.stringify(dataObj),
            };
          }),
          ...(calculationsIcpoesWaterPerParam[param.id] || []).map((calc) => {
            const dataObj = { ...calc } as any;
            return {
              label: calc.label,
              calculationType: "icpoes_water",
              data: JSON.stringify(dataObj),
            };
          }),
          ...(calculationsAasWaterPerParam[param.id] || []).map((calc) => {
            const dataObj = { ...calc } as any;
            return {
              label: calc.label,
              calculationType: "aas_water",
              data: JSON.stringify(dataObj),
            };
          }),
          ...(calculationsIcpmsIchQ3DPerParam[param.id] || []).map((calc) => {
            const dataObj = { ...calc } as any;
            return {
              label: calc.label,
              calculationType: "icpms_ich_q3d",
              data: JSON.stringify(dataObj),
            };
          }),
          ...(calculationsORSPerParam[param.id] || []).map((calc) => {
            const dataObj = { ...calc } as any;
            return {
              label: calc.label,
              calculationType: "ors",
              data: JSON.stringify(dataObj),
            };
          }),
          ...(calculationsAnoferPerParam[param.id] || []).map((calc) => {
            const dataObj = { ...calc } as any;
            return {
              label: calc.label,
              calculationType: "anofer",
              data: JSON.stringify(dataObj),
            };
          }),
          ...(calculationsZptoShampooPerParam[param.id] || []).map((calc) => {
            const dataObj = { ...calc } as any;
            return {
              label: calc.label,
              calculationType: "zpto_shampoo",
              data: JSON.stringify(dataObj),
            };
          }),
          ...(calculationsSodiumLactatePerParam[param.id] || []).map((calc) => {
            const dataObj = { ...calc } as any;
            return {
              label: calc.label,
              calculationType: "sodium_lactate",
              data: JSON.stringify(dataObj),
            };
          }),
          ...(calculationsLithosun300PerParam[param.id] || []).map((calc) => {
            const dataObj = { ...calc } as any;
            return {
              label: calc.label,
              calculationType: "lithosun300",
              data: JSON.stringify(dataObj),
            };
          }),
          ...(calculationsLithosun400PerParam[param.id] || []).map((calc) => {
            const dataObj = { ...calc } as any;
            return {
              label: calc.label,
              calculationType: "lithosun400",
              data: JSON.stringify(dataObj),
            };
          }),
          ...(calculationsMeropenamPerParam[param.id] || []).map((calc) => {
            const dataObj = { ...calc } as any;
            return {
              label: calc.label,
              calculationType: "meropenam",
              data: JSON.stringify(dataObj),
            };
          }),
          ...(calculationsSFGCPerParam[param.id] || []).map((calc) => {
            const dataObj = { ...calc } as any;
            return {
              label: calc.label,
              calculationType: "sfgc",
              data: JSON.stringify(dataObj),
            };
          }),
          ...(calculationsTalcPerParam[param.id] || []).map((calc) => {
            const dataObj = { ...calc } as any;
            return {
              label: calc.label,
              calculationType: "talc",
              data: JSON.stringify(dataObj),
            };
          }),
        ];

        return {
          id: param.id,
          paraCode: param.paraCode,
          parameterName: param.parameterName,
          methodCode: param.methodCode,
          methodName: param.methodName,
          otherInfo: otherInfoPerParam[param.id] || null,
          analysisStartDate: analysisStartDatePerParam[param.id] || null,
          analysisCompletionDate:
            analysisCompletionDatePerParam[param.id] || null,
          revisionStartDate: revisionStartDatePerParam[param.id] || null,
          revisionCompletedDate: revisionCompletedDatePerParam[param.id] || null,
          analyzedBy: analyzedByPerParam[param.id] || null,
          approvedByReviewer: approvedByReviewerPerParam[param.id] || null,
          approvedAtReviewer: approvedAtReviewerPerParam[param.id] || null,
          approvedByQA: approvedByQAPerParam[param.id] || null,
          approvedAtQA: approvedAtQAPerParam[param.id] || null,
          remarksByQA: remarksQAPerParam[param.id] ?? null,
          remarksByReviewer: remarksByReviewerPerParam[param.id] ?? null,
          remarksByAnalyst: remarksByAnalystPerParam[param.id] ?? null,
          preparationCompletedBy:
            preparationCompletedByPerParam[param.id] || null,
          preparationCompletedAt:
            preparationCompletedAtPerParam[param.id] || null,
          status: parameterStatusPerParam[param.id] || "Created",
          instruments: (addedInstruments[param.id] || []).map((inst) => ({
            instrumentId: inst.instrumentId,
            name: inst.name,
            instrumentTag: inst.instrumentTag,
            make: inst.make,
            calibrationDoneDate: inst.calibrationDoneDate,
            calibrationDueDate: inst.calibrationDueDate,
          })),
          chemicals: (addedChemicals[param.id] || []).map((chem) => ({
            slno: chem.slno,
            name: chem.name,
            code: chem.code,
            make: chem.make,
            batchNo: chem.batchNo,
            expDate: chem.expDate,
          })),
          standards: (addedStandards[param.id] || []).map((std) => ({
            serialNo: std.serialNo,
            name: std.name,
            batchNo: std.batchNo,
            make: std.make,
            purity: std.purity,
            validity: std.validity,
          })),
          preparations,
          calculations,
          files: collectFilesForParam(param.id),
        };
      }),
    };
  };

  const reloadWorksheet = async () => {
    if (!worksheetId) return;

    setError(null);

    try {
      const requestData: FetchWorksheetRequest = { employeeId, role };

      const worksheetData = await fetchWorksheetById(worksheetId, requestData);

      if (!worksheetData) {
        setError("Worksheet not found");
        return;
      }


      setWorksheetInfo(worksheetData);
      setRegistrationNo(worksheetData.sample.registrationNo);

      const request: SmapleDetailsRequest = {
        regNo: worksheetData.sample.registrationNo,
        lab: department,
      };
      const samples = await fetchSample(request);
      setSamplesData(samples);

      setAddedParameters([]);
      setSelectedParamsForDetail([]);
      setFilesPerParam({});
      setShowParamFiles({});

      restoreWorksheetToState(worksheetData);
    } catch (err: any) {
      setError(err.message || "Failed to reload worksheet");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrintClick = () => {
    // samplesData is an array so always truthy — guard with .length
    if (onPrint && worksheetInfo && analysts && samplesData?.length) {
      onPrint(worksheetInfo, analysts, samplesData[0]);
    }
  };

  const handleSaveDraft = async () => {
    setIsSaving(true);
    const worksheetData = collectFormDataForAPI();

    try {
      if (role === "Reviewer" || role === "QA") {
        const response = await updateWorksheet(worksheetId, worksheetData);

        if (response && response.worksheetId) {
          setToastMessage(`Draft saved successfully: ${response.worksheetId}`);
          setShowToast(true);
          setSaveSuccess(true);
          setTimeout(() => setSaveSuccess(false), 3000);
          await reloadWorksheet();
        } else {
          setToastMessage("Failed to save draft");
          setShowToast(true);
          setTimeout(() => {
            setShowToast(false);
          }, 4000);
        }
      } else {
        worksheetData!.parameters!.forEach(async (param) => {
          const response = await updateParameter(param.id, param);

          if (response && response.parameterId) {
            setToastMessage(`Draft saved successfully: ${worksheetId}`);
            setShowToast(true);
            setSaveSuccess(true);
            setTimeout(() => setSaveSuccess(false), 3000);
            await reloadWorksheet();
          } else {
            setToastMessage("Failed to save draft");
            setShowToast(true);
            setTimeout(() => {
              setShowToast(false);
            }, 4000);
            return;
          }
        });
        setSaveSuccess(true);
      }
    } catch (err: any) {
      setToastMessage(`Failed to save draft: ${err.message}`);
      console.error("Save draft error:", err);
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
      }, 4000);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSubmitForAnalysis = async () => {
    setIsSubmitting(true);

    // await handleSaveDraft();

    try {
      const worksheetData = collectFormDataForAPI();
      const currentWorksheetStatus = worksheetInfo?.sample.status;

      const createdParameters = worksheetData?.parameters?.filter(
        (param) =>
          (parameterStatusPerParam[param.id] || "created").toLowerCase() ===
          "created",
      );

      if (createdParameters!.length === 0) {
        setToastMessage("No parameters with 'created' status to submit");
        setShowToast(true);
        setTimeout(() => {
          setShowToast(false);
        }, 4000);
        setIsSubmitting(false);
        setShowSubmitDialog(false);
        return;
      }

      // Update parameter status to "Analysis Pending"
      const updatedParameters = createdParameters!.map((param) => ({
        ...param,
        status: "Analysis Pending",
      }));

      if (currentWorksheetStatus === "Draft") {
        // If worksheet is Draft, update entire worksheet status
        const updatedWorksheetData = {
          ...worksheetData,
          parameters: worksheetData?.parameters?.map((param) => {
            const isCreated =
              (parameterStatusPerParam[param.id] || "created").toLowerCase() ===
              "created";
            return {
              ...param,
              status: isCreated ? "Analysis Pending" : param.status,
            };
          }),
          documentInfo: {
            ...worksheetData?.documentInfo,
            status: "Submitted For Analysis",
          },
        };

        const response = await updateWorksheet(
          worksheetId,
          updatedWorksheetData,
        );

        if (response && response.worksheetId) {
          setWorksheetInfo((prev) =>
            prev
              ? {
                ...prev,
                sample: {
                  ...prev.sample,
                  status: "Submitted For Analysis",
                },
              }
              : null,
          );

          // Update parameter statuses in local state
          updatedParameters.forEach((param) => {
            setParameterStatusPerParam((prev) => ({
              ...prev,
              [param.id]: "Analysis Pending",
            }));
          });

          setToastMessage("Worksheet submitted for analysis successfully!");
          setShowToast(true);
          setTimeout(() => {
            setShowToast(false);
          }, 4000);
          await insertWorksheetLog({
            worksheetId,
            action: "Submitted For Analysis",
            remarks: "Worksheet submitted for analysis",
            employeeId,
            role,
          });
        } else {
          setToastMessage("Failed to submit worksheet!");
          setShowToast(true);
          setTimeout(() => {
            setShowToast(false);
          }, 4000);
        }
      } else if (currentWorksheetStatus === "Submitted For Analysis") {
        // If already submitted, only update individual parameters
        for (const param of updatedParameters) {
          const response = await updateParameter(param.id, param);

          if (response && response.parameterId) {
            // Update local state for this parameter
            setParameterStatusPerParam((prev) => ({
              ...prev,
              [param.id]: "Analysis Pending",
            }));
          } else {
            setToastMessage(
              `Failed to update parameter ${param.parameterName}`,
            );
            setShowToast(true);
            setTimeout(() => {
              setShowToast(false);
            }, 4000);
            setIsSubmitting(false);
            setShowSubmitDialog(false);
            return;
          }
        }
        setToastMessage("Parameters submitted for analysis successfully!");
        setShowToast(true);
        setTimeout(() => {
          setShowToast(false);
        }, 4000);
        await insertWorksheetLog({
          worksheetId,
          action: "Parameters Submitted For Analysis",
          remarks: `${updatedParameters.length} parameter(s) submitted for analysis`,
          employeeId,
          role,
        });
      }

      setShowSubmitDialog(false);
    } catch (err: any) {
      setToastMessage(`Failed to submit: ${err.message}`);
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
      }, 4000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddParameter = (param: ParameterDetail) => {
    if (addedParameters.find((p) => p.paraCode === param.paraCode)) {
      return;
    }

    setPendingParameter(param);
    setShowAnalystDialog(true);
  };

  const handleReassignAnalyst = (paramId: number) => {
    const paramToReassign = addedParameters.find((p) => p.id === paramId);

    if (!paramToReassign) return;

    setAnalystMode("reassign");
    setPendingParameter(paramToReassign);
    setShowAnalystDialog(true);
  };

  const handleAnalystSelected = async (
    employeeId: string,
    employeeName: string,
  ) => {
    if (!pendingParameter) return;

    try {
      if (analystMode === "add") {
        const newId = paramIdx + 1;
        setParamIdx(newId);
        const newParameter = { ...pendingParameter, id: newId };

        setAddedParameters((prev) => [...prev, newParameter]);

        setAnalyzedByPerParam((prev) => ({
          ...prev,
          [newId]: employeeId,
        }));

        setAnalyzedByNamePerParam((prev) => ({
          ...prev,
          [newId]: employeeName,
        }));

        setParameterStatusPerParam((prev) => ({
          ...prev,
          [newId]: "Created",
        }));

        setToastMessage(`Adding parameter "${newParameter.parameterName}"...`);
        setShowToast(true);

        try {
          const parameterData = {
            paraCode: newParameter.paraCode,
            parameterName: newParameter.parameterName,
            methodCode: newParameter.methodCode,
            methodName: newParameter.methodName,
            otherInfo: otherInfoPerParam[newId] || null,
            analyzedBy: employeeId,
            approvedByReviewer: null,
            analysisStartDate: null,
            analysisCompletionDate: null,
            approvedAtReviewer: null,
            status: "Created",
            instruments: (addedInstruments[newId] || []).map((inst) => ({
              instrumentId: inst.instrumentId,
              name: inst.name,
              instrumentTag: inst.instrumentTag,
              make: inst.make,
              calibrationDoneDate: inst.calibrationDoneDate,
              calibrationDueDate: inst.calibrationDueDate,
            })),
            chemicals: (addedChemicals[newId] || []).map((chem) => ({
              slno: chem.slno,
              name: chem.name,
              code: chem.code,
              make: chem.make,
              batchNo: chem.batchNo,
              expDate: chem.expDate,
            })),
            standards: (addedStandards[newId] || []).map((std) => ({
              serialNo: std.serialNo,
              name: std.name,
              batchNo: std.batchNo,
              make: std.make,
              purity: std.purity,
              validity: std.validity,
            })),
            preparations: [
              ...(samplePreparationIcpmsPerParam[newId] || []).map((sp) => ({
                label: sp.label,
                preparationCategory: "sample",
                preparationType: "icpms",
                assignedStandardId: "",
                steps: JSON.stringify(sp.steps),
              })),
              ...(samplePreparationIcpoesPerParam[newId] || []).map((sp) => ({
                label: sp.label,
                preparationCategory: "sample",
                preparationType: "icpoes",
                assignedStandardId: "",
                steps: JSON.stringify(sp.steps),
              })),
              ...(samplePreparationIcpmsWaterPerParam[newId] || []).map((sp) => ({
                label: sp.label,
                preparationCategory: "sample",
                preparationType: "icpms_water",
                assignedStandardId: "",
                steps: JSON.stringify(sp.steps),
              })),
              ...(samplePreparationIcpoesWaterPerParam[newId] || []).map((sp) => ({
                label: sp.label,
                preparationCategory: "sample",
                preparationType: "icpoes_water",
                assignedStandardId: "",
                steps: JSON.stringify(sp.steps),
              })),
              ...(samplePreparationAasWaterPerParam[newId] || []).map((sp) => ({
                label: sp.label,
                preparationCategory: "sample",
                preparationType: "aas_water",
                assignedStandardId: "",
                steps: JSON.stringify(sp.steps),
              })),
              ...(samplePreparationIcpmsIchQ3DPerParam[newId] || []).map((sp) => ({
                label: sp.label,
                preparationCategory: "sample",
                preparationType: "icpms_ich_q3d",
                assignedStandardId: "",
                steps: JSON.stringify(sp.steps),
              })),
              ...(samplePreparationORSPerParam[newId] || []).map((sp) => ({
                label: sp.label,
                preparationCategory: "sample",
                preparationType: "ors",
                assignedStandardId: "",
                steps: JSON.stringify(sp.steps),
              })),
              ...(samplePreparationAnoferPerParam[newId] || []).map((sp) => ({
                label: sp.label,
                preparationCategory: "sample",
                preparationType: "anofer",
                assignedStandardId: "",
                steps: JSON.stringify(sp.steps),
              })),
              ...(samplePreparationZptoShampooPerParam[newId] || []).map((sp) => ({
                label: sp.label,
                preparationCategory: "sample",
                preparationType: "zpto_shampoo",
                assignedStandardId: "",
                steps: JSON.stringify(sp.steps),
              })),
              ...(samplePreparationSodiumLactatePerParam[newId] || []).map((sp) => ({
                label: sp.label,
                preparationCategory: "sample",
                preparationType: "sodium_lactate",
                assignedStandardId: "",
                steps: JSON.stringify(sp.steps),
              })),
              ...(samplePreparationLithosun300PerParam[newId] || []).map((sp) => ({
                label: sp.label,
                preparationCategory: "sample",
                preparationType: "lithosun300",
                assignedStandardId: "",
                steps: JSON.stringify(sp.steps),
              })),
              ...(samplePreparationLithosun400PerParam[newId] || []).map((sp) => ({
                label: sp.label,
                preparationCategory: "sample",
                preparationType: "lithosun400",
                assignedStandardId: "",
                steps: JSON.stringify(sp.steps),
              })),
              // Standard Preparations for Metal groups
              ...Object.entries(standardPreparationMetalPerParam[newId] || {}).flatMap(([groupId, preps]) => {
                const prepType = METAL_GROUP_TO_TYPE[groupId] || groupId;
                return preps.map((sp) => ({
                  label: sp.label,
                  preparationCategory: "standard",
                  preparationType: prepType,
                  assignedStandardId: "",
                  steps: JSON.stringify(sp.steps),
                }));
              }),
            ],
            calculations: [
              ...(calculationsIcpmsPerParam[newId] || []).map((calc) => {
                const dataObj = { ...calc } as any;
                return {
                  label: calc.label,
                  calculationType: "icpms",
                  data: JSON.stringify(dataObj),
                };
              }),
              ...(calculationsIcpoesPerParam[newId] || []).map((calc) => {
                const dataObj = { ...calc } as any;
                return {
                  label: calc.label,
                  calculationType: "icpoes",
                  data: JSON.stringify(dataObj),
                };
              }),
              ...(calculationsIcpmsWaterPerParam[newId] || []).map((calc) => {
                const dataObj = { ...calc } as any;
                return {
                  label: calc.label,
                  calculationType: "icpms_water",
                  data: JSON.stringify(dataObj),
                };
              }),
              ...(calculationsIcpoesWaterPerParam[newId] || []).map((calc) => {
                const dataObj = { ...calc } as any;
                return {
                  label: calc.label,
                  calculationType: "icpoes_water",
                  data: JSON.stringify(dataObj),
                };
              }),
              ...(calculationsAasWaterPerParam[newId] || []).map((calc) => {
                const dataObj = { ...calc } as any;
                return {
                  label: calc.label,
                  calculationType: "aas_water",
                  data: JSON.stringify(dataObj),
                };
              }),
              ...(calculationsIcpmsIchQ3DPerParam[newId] || []).map((calc) => {
                const dataObj = { ...calc } as any;
                return {
                  label: calc.label,
                  calculationType: "icpms_ich_q3d",
                  data: JSON.stringify(dataObj),
                };
              }),
              ...(calculationsORSPerParam[newId] || []).map((calc) => {
                const dataObj = { ...calc } as any;
                return {
                  label: calc.label,
                  calculationType: "ors",
                  data: JSON.stringify(dataObj),
                };
              }),
              ...(calculationsAnoferPerParam[newId] || []).map((calc) => {
                const dataObj = { ...calc } as any;
                return {
                  label: calc.label,
                  calculationType: "anofer",
                  data: JSON.stringify(dataObj),
                };
              }),
              ...(calculationsZptoShampooPerParam[newId] || []).map((calc) => {
                const dataObj = { ...calc } as any;
                return {
                  label: calc.label,
                  calculationType: "zpto_shampoo",
                  data: JSON.stringify(dataObj),
                };
              }),
              ...(calculationsSodiumLactatePerParam[newId] || []).map((calc) => {
                const dataObj = { ...calc } as any;
                return {
                  label: calc.label,
                  calculationType: "sodium_lactate",
                  data: JSON.stringify(dataObj),
                };
              }),
              ...(calculationsLithosun300PerParam[newId] || []).map((calc) => {
                const dataObj = { ...calc } as any;
                return {
                  label: calc.label,
                  calculationType: "lithosun300",
                  data: JSON.stringify(dataObj),
                };
              }),
              ...(calculationsLithosun400PerParam[newId] || []).map((calc) => {
                const dataObj = { ...calc } as any;
                return {
                  label: calc.label,
                  calculationType: "lithosun400",
                  data: JSON.stringify(dataObj),
                };
              }),
              ...(calculationsMeropenamPerParam[newId] || []).map((calc) => {
                const dataObj = { ...calc } as any;
                return {
                  label: calc.label,
                  calculationType: "meropenam",
                  data: JSON.stringify(dataObj),
                };
              }),
              ...(calculationsSFGCPerParam[newId] || []).map((calc) => {
                const dataObj = { ...calc } as any;
                return {
                  label: calc.label,
                  calculationType: "sfgc",
                  data: JSON.stringify(dataObj),
                };
              }),
              ...(calculationsTalcPerParam[newId] || []).map((calc) => {
                const dataObj = { ...calc } as any;
                return {
                  label: calc.label,
                  calculationType: "talc",
                  data: JSON.stringify(dataObj),
                };
              }),
            ],
            files: collectFilesForParam(newId),
          };

          const response = await addParameter(worksheetId, parameterData);

          setAddedParameters((prev) =>
            prev.map((p) =>
              p.id === newId ? { ...p, id: response.parameterId } : p,
            ),
          );

          const serverParameterId = response.parameterId;

          setAnalyzedByPerParam((prev) => {
            const { [newId]: analyzedBy, ...rest } = prev;
            return { ...rest, [serverParameterId]: analyzedBy };
          });

          setAnalyzedByNamePerParam((prev) => {
            const { [newId]: analyzedByName, ...rest } = prev;
            return { ...rest, [serverParameterId]: analyzedByName };
          });

          setParameterStatusPerParam((prev) => {
            const { [newId]: status, ...rest } = prev;
            return { ...rest, [serverParameterId]: status };
          });

          if (otherInfoPerParam[newId]) {
            setOtherInfoPerParam((prev) => {
              const { [newId]: info, ...rest } = prev;
              return { ...rest, [serverParameterId]: info };
            });
          }

          if (additionalInfoPerParam[newId]) {
            setAdditionalInfoPerParam((prev) => {
              const { [newId]: additionalInfo, ...rest } = prev;
              return { ...rest, [serverParameterId]: additionalInfo };
            });
          }

          if (addedInstruments[newId]) {
            setAddedInstruments((prev) => {
              const { [newId]: instruments, ...rest } = prev;
              return { ...rest, [serverParameterId]: instruments };
            });
          }

          if (addedChemicals[newId]) {
            setAddedChemicals((prev) => {
              const { [newId]: chemicals, ...rest } = prev;
              return { ...rest, [serverParameterId]: chemicals };
            });
          }

          if (addedStandards[newId]) {
            setAddedStandards((prev) => {
              const { [newId]: standards, ...rest } = prev;
              return { ...rest, [serverParameterId]: standards };
            });
          }

          if (samplePreparationIcpmsPerParam[newId]) {
            setSamplePreparationIcpmsPerParam((prev) => {
              const { [newId]: preps, ...rest } = prev;
              return { ...rest, [serverParameterId]: preps };
            });
          }

          if (samplePreparationIcpoesPerParam[newId]) {
            setSamplePreparationIcpoesPerParam((prev) => {
              const { [newId]: preps, ...rest } = prev;
              return { ...rest, [serverParameterId]: preps };
            });
          }

          if (samplePreparationIcpmsWaterPerParam[newId]) {
            setSamplePreparationIcpmsWaterPerParam((prev) => {
              const { [newId]: preps, ...rest } = prev;
              return { ...rest, [serverParameterId]: preps };
            });
          }

          if (samplePreparationIcpoesWaterPerParam[newId]) {
            setSamplePreparationIcpoesWaterPerParam((prev) => {
              const { [newId]: preps, ...rest } = prev;
              return { ...rest, [serverParameterId]: preps };
            });
          }

          if (samplePreparationAasWaterPerParam[newId]) {
            setSamplePreparationAasWaterPerParam((prev) => {
              const { [newId]: preps, ...rest } = prev;
              return { ...rest, [serverParameterId]: preps };
            });
          }

          if (samplePreparationIcpmsIchQ3DPerParam[newId]) {
            setSamplePreparationIcpmsIchQ3DPerParam((prev) => {
              const { [newId]: preps, ...rest } = prev;
              return { ...rest, [serverParameterId]: preps };
            });
          }

          if (samplePreparationORSPerParam[newId]) {
            setSamplePreparationORSPerParam((prev) => {
              const { [newId]: preps, ...rest } = prev;
              return { ...rest, [serverParameterId]: preps };
            });
          }

          if (samplePreparationAnoferPerParam[newId]) {
            setSamplePreparationAnoferPerParam((prev) => {
              const { [newId]: preps, ...rest } = prev;
              return { ...rest, [serverParameterId]: preps };
            });
          }

          if (samplePreparationZptoShampooPerParam[newId]) {
            setSamplePreparationZptoShampooPerParam((prev) => {
              const { [newId]: preps, ...rest } = prev;
              return { ...rest, [serverParameterId]: preps };
            });
          }

          if (samplePreparationSodiumLactatePerParam[newId]) {
            setSamplePreparationSodiumLactatePerParam((prev) => {
              const { [newId]: preps, ...rest } = prev;
              return { ...rest, [serverParameterId]: preps };
            });
          }

          if (samplePreparationLithosun300PerParam[newId]) {
            setSamplePreparationLithosun300PerParam((prev) => {
              const { [newId]: preps, ...rest } = prev;
              return { ...rest, [serverParameterId]: preps };
            });
          }

          if (samplePreparationLithosun400PerParam[newId]) {
            setSamplePreparationLithosun400PerParam((prev) => {
              const { [newId]: preps, ...rest } = prev;
              return { ...rest, [serverParameterId]: preps };
            });
          }

          if (calculationsIcpmsPerParam[newId]) {
            setCalculationsIcpmsPerParam((prev) => {
              const { [newId]: calcs, ...rest } = prev;
              return { ...rest, [serverParameterId]: calcs };
            });
          }

          if (calculationsIcpoesPerParam[newId]) {
            setCalculationsIcpoesPerParam((prev) => {
              const { [newId]: calcs, ...rest } = prev;
              return { ...rest, [serverParameterId]: calcs };
            });
          }

          if (calculationsIcpmsWaterPerParam[newId]) {
            setCalculationsIcpmsWaterPerParam((prev) => {
              const { [newId]: calcs, ...rest } = prev;
              return { ...rest, [serverParameterId]: calcs };
            });
          }

          if (calculationsIcpoesWaterPerParam[newId]) {
            setCalculationsIcpoesWaterPerParam((prev) => {
              const { [newId]: calcs, ...rest } = prev;
              return { ...rest, [serverParameterId]: calcs };
            });
          }

          if (calculationsAasWaterPerParam[newId]) {
            setCalculationsAasWaterPerParam((prev) => {
              const { [newId]: calcs, ...rest } = prev;
              return { ...rest, [serverParameterId]: calcs };
            });
          }

          if (calculationsIcpmsIchQ3DPerParam[newId]) {
            setCalculationsIcpmsIchQ3DPerParam((prev) => {
              const { [newId]: calcs, ...rest } = prev;
              return { ...rest, [serverParameterId]: calcs };
            });
          }

          if (calculationsORSPerParam[newId]) {
            setCalculationsORSPerParam((prev) => {
              const { [newId]: calcs, ...rest } = prev;
              return { ...rest, [serverParameterId]: calcs };
            });
          }

          if (calculationsAnoferPerParam[newId]) {
            setCalculationsAnoferPerParam((prev) => {
              const { [newId]: calcs, ...rest } = prev;
              return { ...rest, [serverParameterId]: calcs };
            });
          }

          if (calculationsZptoShampooPerParam[newId]) {
            setCalculationsZptoShampooPerParam((prev) => {
              const { [newId]: calcs, ...rest } = prev;
              return { ...rest, [serverParameterId]: calcs };
            });
          }

          if (calculationsSodiumLactatePerParam[newId]) {
            setCalculationsSodiumLactatePerParam((prev) => {
              const { [newId]: calcs, ...rest } = prev;
              return { ...rest, [serverParameterId]: calcs };
            });
          }

          if (calculationsLithosun300PerParam[newId]) {
            setCalculationsLithosun300PerParam((prev) => {
              const { [newId]: calcs, ...rest } = prev;
              return { ...rest, [serverParameterId]: calcs };
            });
          }

          if (calculationsLithosun400PerParam[newId]) {
            setCalculationsLithosun400PerParam((prev) => {
              const { [newId]: calcs, ...rest } = prev;
              return { ...rest, [serverParameterId]: calcs };
            });
          }

          if (calculationsMeropenamPerParam[newId]) {
            setCalculationsMeropenamPerParam((prev) => {
              const { [newId]: calcs, ...rest } = prev;
              return { ...rest, [serverParameterId]: calcs };
            });
          }

          if (calculationsSFGCPerParam[newId]) {
            setCalculationsSFGCPerParam((prev) => {
              const { [newId]: calcs, ...rest } = prev;
              return { ...rest, [serverParameterId]: calcs };
            });
          }

          setToastMessage(
            `Parameter "${newParameter.parameterName}" added successfully!`,
          );
          setShowToast(true);
          setTimeout(() => setShowToast(false), 3000);
          await insertWorksheetLog({
            worksheetId,
            parameterId: response.parameterId,
            action: "Parameter Added",
            remarks: `Parameter "${newParameter.parameterName}" (${newParameter.paraCode}) added`,
            employeeId,
            role,
          });
        } catch (error) {
          console.error("Error adding parameter:");
          console.error(
            "Error type:",
            error instanceof Error ? error.constructor.name : typeof error,
          );
          console.error(
            "Error message:",
            error instanceof Error ? error.message : String(error),
          );
          console.error("Full error object:", error);

          setAddedParameters((prev) => prev.filter((p) => p.id !== newId));

          const cleanupState = (setter: Function) => {
            setter((prev: any) => {
              const { [newId]: _, ...rest } = prev;
              return rest;
            });
          };

          cleanupState(setAnalyzedByPerParam);
          cleanupState(setParameterStatusPerParam);
          cleanupState(setOtherInfoPerParam);
          cleanupState(setAdditionalInfoPerParam);
          cleanupState(setShowAdditionalInfo);
          cleanupState(setAddedInstruments);
          cleanupState(setAddedChemicals);
          cleanupState(setAddedStandards);
          cleanupState(setSamplePreparationIcpmsPerParam);
          cleanupState(setSamplePreparationIcpoesPerParam);
          cleanupState(setSamplePreparationIcpmsWaterPerParam);
          cleanupState(setSamplePreparationIcpmsIchQ3DPerParam);
          cleanupState(setSamplePreparationORSPerParam);
          cleanupState(setSamplePreparationAnoferPerParam);
          cleanupState(setSamplePreparationZptoShampooPerParam);
          cleanupState(setSamplePreparationSodiumLactatePerParam);
          cleanupState(setCalculationsIcpmsPerParam);
          cleanupState(setCalculationsIcpoesPerParam);
          cleanupState(setCalculationsIcpmsWaterPerParam);
          cleanupState(setCalculationsIcpmsIchQ3DPerParam);
          cleanupState(setCalculationsORSPerParam);
          cleanupState(setCalculationsAnoferPerParam);
          cleanupState(setCalculationsZptoShampooPerParam);
          cleanupState(setCalculationsSodiumLactatePerParam);
          cleanupState(setCalculationsLithosun300PerParam);
          cleanupState(setCalculationsLithosun400PerParam);
          cleanupState(setCalculationsMeropenamPerParam);
          cleanupState(setCalculationsSFGCPerParam);
          cleanupState(setCalculationsTalcPerParam);

          setToastMessage(
            error instanceof Error
              ? `Failed to add parameter: ${error.message}`
              : "Failed to add parameter. Please try again.",
          );
          setShowToast(true);
          setTimeout(() => setShowToast(false), 4000);
        }
      }

      if (analystMode === "reassign") {
        const paramId = pendingParameter.id;

        setAnalyzedByPerParam((prev) => ({
          ...prev,
          [paramId]: employeeId,
        }));

        setToastMessage("Reassigning analyst...");
        setShowToast(true);

        const param = addedParameters.find((p) => p.id === paramId);
        if (param) {
          try {
            const paramData = {
              id: paramId,
              paraCode: param.paraCode,
              parameterName: param.parameterName,
              methodCode: param.methodCode,
              methodName: param.methodName,
              otherInfo: otherInfoPerParam[paramId] || null,
              analyzedBy: employeeId,
              approvedByReviewer: approvedByReviewerPerParam[paramId] || null,
              analysisStartDate: analysisStartDatePerParam[paramId] || null,
              analysisCompletionDate:
                analysisCompletionDatePerParam[paramId] || null,
              revisionStartDate: revisionStartDatePerParam[paramId] || null,
              revisionCompletedDate: revisionCompletedDatePerParam[paramId] || null,
              approvedAtReviewer: approvedAtReviewerPerParam[paramId] || null,
              preparationCompletedBy:
                preparationCompletedByPerParam[paramId] || null,
              preparationCompletedAt:
                preparationCompletedAtPerParam[paramId] || null,
              remarksByAnalyst: remarksByAnalystPerParam[paramId] || null,
              status: parameterStatusPerParam[paramId] || "Created",
              instruments: (addedInstruments[paramId] || []).map((inst) => ({
                instrumentId: inst.instrumentId,
                name: inst.name,
                instrumentTag: inst.instrumentTag,
                make: inst.make,
                calibrationDoneDate: inst.calibrationDoneDate,
                calibrationDueDate: inst.calibrationDueDate,
              })),
              chemicals: (addedChemicals[paramId] || []).map((chem) => ({
                slno: chem.slno,
                name: chem.name,
                code: chem.code,
                make: chem.make,
                batchNo: chem.batchNo,
                expDate: chem.expDate,
              })),
              standards: (addedStandards[paramId] || []).map((std) => ({
                serialNo: std.serialNo,
                name: std.name,
                batchNo: std.batchNo,
                make: std.make,
                purity: std.purity,
                validity: std.validity,
              })),
              standardPreparations: [],
              samplePreparations: [],
              calculations: [],
              files: [],
            };

            const response = await updateParameter(paramId, paramData);

            if (response && response.parameterId) {
              setToastMessage("Analyst reassigned successfully!");
              setShowToast(true);
              setTimeout(() => setShowToast(false), 3000);
              await insertWorksheetLog({
                worksheetId,
                parameterId: paramId,
                action: "Analyst Reassigned",
                remarks: `Analyst reassigned for parameter "${param?.parameterName}"`,
                employeeId,
                role,
              });
            } else {
              console.error("Update failed: Invalid response from server");
              console.error("Response received:", response);

              setToastMessage(
                "Analyst reassigned but failed to save. Please save manually.",
              );
              setShowToast(true);
              setTimeout(() => setShowToast(false), 4000);
            }
          } catch (error) {
            console.error("Error updating parameter:");
            console.error(
              "Error type:",
              error instanceof Error ? error.constructor.name : typeof error,
            );
            console.error(
              "Error message:",
              error instanceof Error ? error.message : String(error),
            );
            console.error("Full error object:", error);

            setToastMessage("Failed to reassign analyst. Please try again.");
            setShowToast(true);
            setTimeout(() => setShowToast(false), 4000);
          }
        } else {
          console.error("Parameter not found for reassignment");
          console.error("Parameter ID:", paramId);
          console.error(
            "Available parameters:",
            addedParameters.map((p) => ({ id: p.id, name: p.parameterName })),
          );
        }
      }

      setPendingParameter(null);
      setAnalystMode("add");
      setShowAnalystDialog(false);
      setShowParameterDropdown(false);
    } catch (error) {
      console.error("Error in handleAnalystSelected:");
      console.error(
        "Error type:",
        error instanceof Error ? error.constructor.name : typeof error,
      );
      console.error(
        "Error message:",
        error instanceof Error ? error.message : String(error),
      );
      console.error("Full error object:", error);
      console.error("Analyst Mode:", analystMode);
      console.error("Pending Parameter:", pendingParameter);

      setToastMessage("Failed to process parameter. Please try again.");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }
  };

  const handleRemoveParameter = (id: number) => {
    setAddedParameters(addedParameters.filter((p) => p.id !== id));
    setSelectedParamsForDetail(
      selectedParamsForDetail.filter((paramId) => paramId !== id),
    );

    // Clean up all related state
    const cleanupState = (setter: Function) => {
      setter((prev: any) => {
        const { [id]: _, ...rest } = prev;
        return rest;
      });
    };

    // Clean up all parameter-related states
    cleanupState(setAnalyzedByPerParam);
    cleanupState(setApprovedByPerParam);
    cleanupState(setAnalyzedByNamePerParam);
    cleanupState(setApprovedByNamePerParam);
    cleanupState(setAnalysisStartDatePerParam);
    cleanupState(setAnalysisCompletionDatePerParam);
    cleanupState(setApprovedAtPerParam);
    cleanupState(setParameterStatusPerParam);
    cleanupState(setAddedInstruments);
    cleanupState(setAddedChemicals);
    cleanupState(setAddedStandards);
    cleanupState(setOtherInfoPerParam);
    cleanupState(setAdditionalInfoPerParam);
    cleanupState(setShowAdditionalInfo);
    cleanupState(setCalculationsIcpmsPerParam);
    cleanupState(setCalculationsIcpoesPerParam);
    cleanupState(setCalculationsIcpmsWaterPerParam);
    cleanupState(setCalculationsIcpmsIchQ3DPerParam);
    cleanupState(setCalculationsORSPerParam);
    cleanupState(setCalculationsAnoferPerParam);
    cleanupState(setCalculationsZptoShampooPerParam);
    cleanupState(setCalculationsSodiumLactatePerParam);
    cleanupState(setSamplePreparationIcpmsPerParam);
    cleanupState(setSamplePreparationIcpoesPerParam);
    cleanupState(setSamplePreparationIcpmsWaterPerParam);
    cleanupState(setSamplePreparationIcpmsIchQ3DPerParam);
    cleanupState(setSamplePreparationORSPerParam);
    cleanupState(setSamplePreparationAnoferPerParam);
    cleanupState(setSamplePreparationZptoShampooPerParam);
    cleanupState(setSamplePreparationSodiumLactatePerParam);
    cleanupState(setActivePreparationGroups);
    cleanupState(setRemarksByAnalystPerParam);
    cleanupState(setPreparationCompletedByPerParam);
    cleanupState(setPreparationCompletedAtPerParam);
    cleanupState(setCalculationsLithosun400PerParam);
    cleanupState(setCalculationsMeropenamPerParam);
    cleanupState(setCalculationsSFGCPerParam);
    cleanupState(setCalculationsTalcPerParam);
  };

  const toggleParameterDetail = (id: number) => {
    setSelectedParamsForDetail((prev) =>
      prev.includes(id)
        ? prev.filter((paramId) => paramId !== id)
        : [...prev, id],
    );
  };

  const areAllParametersApproved = useCallback((): boolean => {
    if (addedParameters.length === 0) return false;

    // For QA: worksheet approval is available when all params are Reviewer-approved (status = "approved")
    // and none have been returned for revision (no pending remarksQA)
    return addedParameters.every((param) => {
      const status = (
        parameterStatusPerParam[param.id] || "created"
      ).toLowerCase();
      return status === "approved";
    });
  }, [addedParameters, parameterStatusPerParam]);

  // ── Bubble sidebar state/actions up to App ──────────────────────────────
  //
  // Problem: registering actions once on mount captures stale closures.
  // handlePrintClick closes over worksheetInfo/analysts/samplesData which are
  // null at mount time, so onPrint() never fires when the button is clicked.
  //
  // Fix: use a stable ref-forwarding pattern. We pass a stable object whose
  // function bodies delegate to refs that are updated every render. This way:
  //   • App receives the object once (no re-registration loop)
  //   • Every click always invokes the current closure
  //
  const _printRef = useRef(handlePrintClick);
  const _saveDraftRef = useRef(handleSaveDraft);
  const _submitAnalysisRef = useRef(() => setShowSubmitDialog(true));
  const _submitQARef = useRef(() => setShowSubmitForQADialog(true));
  const _approveRef = useRef(() => setShowApproveWorksheetDialog(true));

  // Keep refs current every render (cheap assignment, no effect needed)
  _printRef.current = handlePrintClick;
  _saveDraftRef.current = handleSaveDraft;
  _submitAnalysisRef.current = () => setShowSubmitDialog(true);
  _submitQARef.current = () => setShowSubmitForQADialog(true);
  _approveRef.current = () => setShowApproveWorksheetDialog(true);

  useEffect(() => {
    onSidebarActionsReady?.({
      onBack: () => window.history.back(),
      onSaveDraft: () => _saveDraftRef.current(),
      onSubmitForAnalysis: () => _submitAnalysisRef.current(),
      onSubmitForQA: () => _submitQARef.current(),
      onApproveWorksheet: () => _approveRef.current(),
      onPrintReport: () => _printRef.current(),
      onContentReady: function (): void {
        throw new Error("Function not implemented.");
      },
      onToggleAuditTrail: function (): void {
        throw new Error("Function not implemented.");
      }
    });
    // Stable object registered once. The ref wrappers above always delegate
    // to the latest handler, so no stale-closure problem.
    // eslint-disable-next-line react-hooks/exhaustive-deps.
  }, []);

  useEffect(() => {
    onSidebarStateChange?.({
      worksheetId,
      displayStatus,
      sampleName: worksheetInfo?.sample?.sampleName ?? "",
      registrationNo: worksheetInfo?.sample?.registrationNo ?? registrationNo,
      worksheetStatus: worksheetInfo?.sample?.status ?? null,
      role,
      isSaving,
      saveSuccess,
      isSubmitting,
      isSubmittingForQA,
      isApprovingWorksheet,
      showSaveDraft: worksheetInfo?.sample?.status !== "Approved",
      showSubmitForAnalysis: role === "Reviewer" &&
        (worksheetInfo?.sample?.status === "Draft" ||
          worksheetInfo?.sample?.status === "Submitted For Analysis") &&
        addedParameters.some(
          (p) => (parameterStatusPerParam[p.id] || "created").toLowerCase() ===
            "created"
        ),
      showSubmitForQA: role === "Reviewer" &&
        worksheetInfo?.sample?.status === "Submitted For Analysis" &&
        areAllParametersApproved(),
      showApproveWorksheet: role === "QA" &&
        worksheetInfo?.sample?.status === "Submitted For QA Review" &&
        addedParameters.length > 0 &&
        areAllParametersApproved(),
      showPrintReport: worksheetInfo?.sample?.status === "Approved",
      isContentLoading: isLoading,
      includeAuditTrail: false
    });
  }, [
    worksheetId, displayStatus, worksheetInfo, registrationNo, role,
    isSaving, saveSuccess, isSubmitting, isSubmittingForQA, isApprovingWorksheet,
    addedParameters, parameterStatusPerParam, areAllParametersApproved,
    onSidebarStateChange,
  ]);
  // ────────────────────────────────────────────────────────────────────────

  const handleInitiateUnlock = (param: ParameterDetail) => {
    setParameterToUnlock(param);
    setShowUnlockDialog(true);
  };

  const handleConfirmUnlock = async () => {
    if (!parameterToUnlock) return;

    setIsUnlocking(true);

    try {
      // Update parameter status to "created"
      const updatedParam = {
        ...parameterToUnlock,
        status: "created",
        analyzedBy: null,
        analyzedByName: null,
        analysisStartDate: null,
      };

      const response = await updateParameter(
        parameterToUnlock.id,
        updatedParam,
      );

      if (response && response.parameterId) {
        // Update local state
        setParameterStatusPerParam((prev) => ({
          ...prev,
          [parameterToUnlock.id]: "created",
        }));

        setToastMessage("Parameter unlocked successfully!");
        setShowToast(true);
        setTimeout(() => {
          setShowToast(false);
        }, 4000);

        setShowUnlockDialog(false);
        setParameterToUnlock(null);
      } else {
        setToastMessage("Failed to unlock parameter!");
        setShowToast(true);
        setTimeout(() => {
          setShowToast(false);
        }, 4000);
      }
    } catch (error) {
      setToastMessage(`Error unlocking parameter:${error}`);

      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
      }, 4000);
    } finally {
      setIsUnlocking(false);
    }
  };

  // ── Helper: build full parameter payload matching collectFormDataForAPI shape ──
  const buildFullParamPayload = (
    paramId: number,
    overrides: {
      preparationCompletedBy?: string | null;
      preparationCompletedAt?: string | null;
    } = {},
  ) => {
    const param = addedParameters.find((p) => p.id === paramId);
    if (!param) return null;

    const preparations = [
      ...(samplePreparationIcpmsPerParam[paramId] || []).map((sp) => ({
        label: sp.label,
        preparationCategory: "sample",
        preparationType: "icpms",
        assignedStandardId: null,
        steps: JSON.stringify(sp.steps),
      })),
      ...(samplePreparationIcpoesPerParam[paramId] || []).map((sp) => ({
        label: sp.label,
        preparationCategory: "sample",
        preparationType: "icpoes",
        assignedStandardId: null,
        steps: JSON.stringify(sp.steps),
      })),
      ...(samplePreparationIcpmsWaterPerParam[paramId] || []).map((sp) => ({
        label: sp.label,
        preparationCategory: "sample",
        preparationType: "icpms_water",
        assignedStandardId: null,
        steps: JSON.stringify(sp.steps),
      })),
      ...(samplePreparationIcpoesWaterPerParam[paramId] || []).map((sp) => ({
        label: sp.label,
        preparationCategory: "sample",
        preparationType: "icpoes_water",
        assignedStandardId: null,
        steps: JSON.stringify(sp.steps),
      })),
      ...(samplePreparationAasWaterPerParam[paramId] || []).map((sp) => ({
        label: sp.label,
        preparationCategory: "sample",
        preparationType: "aas_water",
        assignedStandardId: null,
        steps: JSON.stringify(sp.steps),
      })),
      ...(samplePreparationIcpmsIchQ3DPerParam[paramId] || []).map((sp) => ({
        label: sp.label,
        preparationCategory: "sample",
        preparationType: "icpms_ich_q3d",
        assignedStandardId: null,
        steps: JSON.stringify(sp.steps),
      })),
      ...(samplePreparationORSPerParam[paramId] || []).map((sp) => ({
        label: sp.label,
        preparationCategory: "sample",
        preparationType: "ors",
        assignedStandardId: null,
        steps: JSON.stringify(sp.steps),
      })),
      ...(samplePreparationAnoferPerParam[paramId] || []).map((sp) => ({
        label: sp.label,
        preparationCategory: "sample",
        preparationType: "anofer",
        assignedStandardId: null,
        steps: JSON.stringify(sp.steps),
      })),
      ...(samplePreparationZptoShampooPerParam[paramId] || []).map((sp) => ({
        label: sp.label,
        preparationCategory: "sample",
        preparationType: "zpto_shampoo",
        assignedStandardId: null,
        steps: JSON.stringify(sp.steps),
      })),
      ...(samplePreparationSodiumLactatePerParam[paramId] || []).map((sp) => ({
        label: sp.label,
        preparationCategory: "sample",
        preparationType: "sodium_lactate",
        assignedStandardId: null,
        steps: JSON.stringify(sp.steps),
      })),
      ...(samplePreparationLithosun300PerParam[paramId] || []).map((sp) => ({
        label: sp.label,
        preparationCategory: "sample",
        preparationType: "lithosun300",
        assignedStandardId: null,
        steps: JSON.stringify(sp.steps),
      })),
      ...(samplePreparationLithosun400PerParam[paramId] || []).map((sp) => ({
        label: sp.label,
        preparationCategory: "sample",
        preparationType: "lithosun400",
        assignedStandardId: null,
        steps: JSON.stringify(sp.steps),
      })),
      ...(samplePreparationMeropenamPerParam[paramId] || []).map((sp) => ({
        label: sp.label,
        preparationCategory: "sample",
        preparationType: "meropenam",
        assignedStandardId: null,
        steps: JSON.stringify(sp.steps),
      })),
      ...(samplePreparationSFGCPerParam[paramId] || []).map((sp) => ({
        label: sp.label,
        preparationCategory: "sample",
        preparationType: "sfgc",
        assignedStandardId: null,
        steps: JSON.stringify(sp.steps),
      })),
      ...(samplePreparationTalcPerParam[paramId] || []).map((sp) => ({
        label: sp.label,
        preparationCategory: "sample",
        preparationType: "talc",
        assignedStandardId: null,
        steps: JSON.stringify(sp.steps),
      })),
      // Standard Preparations for Metal groups
      ...Object.entries(standardPreparationMetalPerParam[paramId] || {}).flatMap(([groupId, preps]) => {
        const prepType = METAL_GROUP_TO_TYPE[groupId] || groupId;
        return preps.map((sp) => ({
          label: sp.label,
          preparationCategory: "standard",
          preparationType: prepType,
          assignedStandardId: null,
          steps: JSON.stringify(sp.steps),
        }));
      }),
      ...(blankPreparationPerParam[paramId] || []).map((bp) => ({
        label: bp.label,
        preparationCategory: "blank",
        preparationType: null,
        assignedStandardId: null,
        steps: null,
        content: bp.content,
      })),

    ];

    const calculations = [
      ...(calculationsIcpmsPerParam[paramId] || []).map((calc) => {
        const d = { ...calc } as any;
        return {
          label: calc.label,
          calculationType: "icpms",
          data: JSON.stringify(d),
        };
      }),
      ...(calculationsIcpoesPerParam[paramId] || []).map((calc) => {
        const d = { ...calc } as any;
        return {
          label: calc.label,
          calculationType: "icpoes",
          data: JSON.stringify(d),
        };
      }),
      ...(calculationsIcpmsWaterPerParam[paramId] || []).map((calc) => {
        const d = { ...calc } as any;
        return {
          label: calc.label,
          calculationType: "icpms_water",
          data: JSON.stringify(d),
        };
      }),
      ...(calculationsIcpoesWaterPerParam[paramId] || []).map((calc) => {
        const d = { ...calc } as any;
        return {
          label: calc.label,
          calculationType: "icpoes_water",
          data: JSON.stringify(d),
        };
      }),
      ...(calculationsAasWaterPerParam[paramId] || []).map((calc) => {
        const d = { ...calc } as any;
        return {
          label: calc.label,
          calculationType: "aas_water",
          data: JSON.stringify(d),
        };
      }),
      ...(calculationsIcpmsIchQ3DPerParam[paramId] || []).map((calc) => {
        const d = { ...calc } as any;
        return {
          label: calc.label,
          calculationType: "icpms_ich_q3d",
          data: JSON.stringify(d),
        };
      }),
      ...(calculationsORSPerParam[paramId] || []).map((calc) => {
        const d = { ...calc } as any;
        return {
          label: calc.label,
          calculationType: "ors",
          data: JSON.stringify(d),
        };
      }),
      ...(calculationsAnoferPerParam[paramId] || []).map((calc) => {
        const d = { ...calc } as any;
        return {
          label: calc.label,
          calculationType: "anofer",
          data: JSON.stringify(d),
        };
      }),
      ...(calculationsZptoShampooPerParam[paramId] || []).map((calc) => {
        const d = { ...calc } as any;
        return {
          label: calc.label,
          calculationType: "zpto_shampoo",
          data: JSON.stringify(d),
        };
      }),
      ...(calculationsSodiumLactatePerParam[paramId] || []).map((calc) => {
        const d = { ...calc } as any;
        return {
          label: calc.label,
          calculationType: "sodium_lactate",
          data: JSON.stringify(d),
        };
      }),
      ...(calculationsLithosun300PerParam[paramId] || []).map((calc) => {
        const d = { ...calc } as any;
        return {
          label: calc.label,
          calculationType: "lithosun300",
          data: JSON.stringify(d),
        };
      }),
      ...(calculationsLithosun400PerParam[paramId] || []).map((calc) => {
        const d = { ...calc } as any;
        return {
          label: calc.label,
          calculationType: "lithosun400",
          data: JSON.stringify(d),
        };
      }),
      ...(calculationsMeropenamPerParam[paramId] || []).map((calc) => {
        const d = { ...calc } as any;
        return {
          label: calc.label,
          calculationType: "meropenam",
          data: JSON.stringify(d),
        };
      }),
      ...(calculationsSFGCPerParam[paramId] || []).map((calc) => {
        const d = { ...calc } as any;
        return {
          label: calc.label,
          calculationType: "sfgc",
          data: JSON.stringify(d),
        };
      }),
      ...(calculationsTalcPerParam[paramId] || []).map((calc) => {
        const d = { ...calc } as any;
        return {
          label: calc.label,
          calculationType: "talc",
          data: JSON.stringify(d),
        };
      }),
    ];

    // Build explicit payload — never spread ...param to avoid stale field contamination
    return {
      id: param.id,
      paraCode: param.paraCode,
      parameterName: param.parameterName,
      methodCode: param.methodCode,
      methodName: param.methodName,
      otherInfo: otherInfoPerParam[paramId] || null,
      additional_info: additionalInfoPerParam[paramId] || null,
      analysisStartDate: analysisStartDatePerParam[paramId] || null,
      analysisCompletionDate: analysisCompletionDatePerParam[paramId] || null,
      revisionStartDate: revisionStartDatePerParam[paramId] || null,
      revisionCompletedDate: revisionCompletedDatePerParam[paramId] || null,
      analyzedBy: analyzedByPerParam[paramId] || null,
      approvedByReviewer: approvedByReviewerPerParam[paramId] || null,
      approvedAtReviewer: approvedAtReviewerPerParam[paramId] || null,
      approvedByQA: approvedByQAPerParam[paramId] || null,
      approvedAtQA: approvedAtQAPerParam[paramId] || null,
      remarksByQA: remarksQAPerParam[paramId] ?? null,
      remarksByReviewer: remarksByReviewerPerParam[paramId] ?? null,
      remarksByAnalyst: remarksByAnalystPerParam[paramId] ?? null,
      // These two are the whole point — always explicit, never from stale param spread
      preparationCompletedBy:
        "preparationCompletedBy" in overrides
          ? (overrides.preparationCompletedBy ?? null)
          : preparationCompletedByPerParam[paramId] || null,
      preparationCompletedAt:
        "preparationCompletedAt" in overrides
          ? (overrides.preparationCompletedAt ?? null)
          : preparationCompletedAtPerParam[paramId] || null,
      status: parameterStatusPerParam[paramId] || "Created",
      instruments: (addedInstruments[paramId] || []).map((inst) => ({
        instrumentId: inst.instrumentId,
        name: inst.name,
        instrumentTag: inst.instrumentTag,
        make: inst.make,
        calibrationDoneDate: inst.calibrationDoneDate,
        calibrationDueDate: inst.calibrationDueDate,
      })),
      chemicals: (addedChemicals[paramId] || []).map((chem) => ({
        slno: chem.slno,
        name: chem.name,
        code: chem.code,
        make: chem.make,
        batchNo: chem.batchNo,
        expDate: chem.expDate,
      })),
      standards: (addedStandards[paramId] || []).map((std) => ({
        serialNo: std.serialNo,
        name: std.name,
        batchNo: std.batchNo,
        make: std.make,
        purity: std.purity,
        validity: std.validity,
      })),
      preparations,
      calculations,
      files: collectFilesForParam(paramId),
    };
  };

  // ── Complete Preparation handlers ──
  const handleConfirmCompletePreparation = async () => {
    if (!paramForPreparation) return;
    setIsCompletingPreparation(true);
    try {
      const paramId = paramForPreparation.id;
      const completedBy = employeeId;
      const completedAt = new Date().toISOString();
      const paramData = buildFullParamPayload(paramId, {
        preparationCompletedBy: completedBy,
        preparationCompletedAt: completedAt,
      });
      if (paramData) {
        const response = await updateParameter(paramId, paramData);
        if (response && response.parameterId) {
          setPreparationCompletedByPerParam((prev) => ({
            ...prev,
            [paramId]: completedBy,
          }));
          setPreparationCompletedAtPerParam((prev) => ({
            ...prev,
            [paramId]: completedAt,
          }));
          setToastMessage("Preparation marked as complete!");
          setShowToast(true);
          setTimeout(() => setShowToast(false), 4000);
          await insertWorksheetLog({
            worksheetId,
            parameterId: paramId,
            action: "Preparation Completed",
            remarks: `Preparation completed for parameter "${paramForPreparation.parameterName}"`,
            employeeId,
            role,
          });
        } else {
          setToastMessage("Failed to complete preparation!");
          setShowToast(true);
          setTimeout(() => setShowToast(false), 4000);
        }
      }
    } catch (error) {
      setToastMessage(`Error completing preparation: ${error}`);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 4000);
    } finally {
      setIsCompletingPreparation(false);
      setShowCompletePreparationDialog(false);
      setParamForPreparation(null);
    }
  };

  // ── Unlock Preparation handlers ──
  const handleConfirmUnlockPreparation = async () => {
    if (!paramForPreparation) return;
    setIsUnlockingPreparation(true);
    try {
      const paramId = paramForPreparation.id;
      const paramData = buildFullParamPayload(paramId, {
        preparationCompletedBy: null,
        preparationCompletedAt: null,
      });
      if (paramData) {
        const response = await updateParameter(paramId, paramData);
        if (response && response.parameterId) {
          setPreparationCompletedByPerParam((prev) => {
            const { [paramId]: _, ...r } = prev;
            return r;
          });
          setPreparationCompletedAtPerParam((prev) => {
            const { [paramId]: _, ...r } = prev;
            return r;
          });
          setToastMessage("Preparation unlocked successfully!");
          setShowToast(true);
          setTimeout(() => setShowToast(false), 4000);
          await insertWorksheetLog({
            worksheetId,
            parameterId: paramId,
            action: "Preparation Unlocked",
            remarks: `Preparation unlocked for parameter "${paramForPreparation.parameterName}"`,
            employeeId,
            role,
          });
        } else {
          setToastMessage("Failed to unlock preparation!");
          setShowToast(true);
          setTimeout(() => setShowToast(false), 4000);
        }
      }
    } catch (error) {
      setToastMessage(`Error unlocking preparation: ${error}`);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 4000);
    } finally {
      setIsUnlockingPreparation(false);
      setShowUnlockPreparationDialog(false);
      setParamForPreparation(null);
    }
  };
  // ── Per-group Preparation handlers ──
  const handleInitiateCompleteGroupPrep = (
    param: ParameterDetail,
    groupKey: string,
  ) => {
    setGroupPrepDialogParam(param);
    setGroupPrepDialogKey(groupKey);
    setShowCompleteGroupPrepDialog(true);
  };

  const handleInitiateUnlockGroupPrep = (
    param: ParameterDetail,
    groupKey: string,
  ) => {
    setGroupPrepDialogParam(param);
    setGroupPrepDialogKey(groupKey);
    setShowUnlockGroupPrepDialog(true);
  };

  const handleConfirmCompleteGroupPrep = async () => {
    if (!groupPrepDialogParam) return;
    setIsCompletingGroupPrep(true);
    try {
      const paramId = groupPrepDialogParam.id;
      const completedBy = employeeId;
      const completedAt = new Date().toISOString();
      // Use the same preparationCompletedBy/At fields as the main prep complete.
      // groupPrepDialogKey identifies which group triggered it (for UI/toast only).
      const paramData = buildFullParamPayload(paramId, {
        preparationCompletedBy: completedBy,
        preparationCompletedAt: completedAt,
      });
      if (paramData) {
        const response = await updateParameter(paramId, paramData);
        if (response && response.parameterId) {
          setPreparationCompletedByPerParam((prev) => ({
            ...prev,
            [paramId]: completedBy,
          }));
          setPreparationCompletedAtPerParam((prev) => ({
            ...prev,
            [paramId]: completedAt,
          }));
          // Also update local groupPrepCompletedAt so the UI reflects this group as done
          setGroupPrepCompletedAtPerParam((prev) => ({
            ...prev,
            [paramId]: {
              ...(prev[paramId] || {}),
              [groupPrepDialogKey]: completedAt,
            },
          }));
          setToastMessage(
            `${groupPrepDialogKey.toUpperCase()} preparation marked as complete!`,
          );
          setShowToast(true);
          setTimeout(() => setShowToast(false), 4000);
          await insertWorksheetLog({
            worksheetId,
            parameterId: paramId,
            action: "Preparation Completed",
            remarks: `${groupPrepDialogKey} preparation completed for parameter "${groupPrepDialogParam.parameterName}"`,
            employeeId,
            role,
          });
        } else {
          setToastMessage("Failed to complete preparation!");
          setShowToast(true);
          setTimeout(() => setShowToast(false), 4000);
        }
      }
    } catch (error) {
      setToastMessage(`Error completing preparation: ${error}`);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 4000);
    } finally {
      setIsCompletingGroupPrep(false);
      setShowCompleteGroupPrepDialog(false);
      setGroupPrepDialogParam(null);
      setGroupPrepDialogKey("");
    }
  };

  const handleConfirmUnlockGroupPrep = async () => {
    if (!groupPrepDialogParam) return;
    setIsUnlockingGroupPrep(true);
    try {
      const paramId = groupPrepDialogParam.id;
      // Clear preparationCompletedBy/At — same field as the main prep unlock.
      const paramData = buildFullParamPayload(paramId, {
        preparationCompletedBy: null,
        preparationCompletedAt: null,
      });
      if (paramData) {
        const response = await updateParameter(paramId, paramData);
        if (response && response.parameterId) {
          setPreparationCompletedByPerParam((prev) => {
            const { [paramId]: _, ...r } = prev;
            return r;
          });
          setPreparationCompletedAtPerParam((prev) => {
            const { [paramId]: _, ...r } = prev;
            return r;
          });
          // Also clear local groupPrepCompletedAt for this group so UI updates
          setGroupPrepCompletedAtPerParam((prev) => {
            const g = { ...(prev[paramId] || {}) };
            delete g[groupPrepDialogKey];
            return { ...prev, [paramId]: g };
          });
          setToastMessage(
            `${groupPrepDialogKey.toUpperCase()} preparation unlocked!`,
          );
          setShowToast(true);
          setTimeout(() => setShowToast(false), 4000);
          await insertWorksheetLog({
            worksheetId,
            parameterId: paramId,
            action: "Group Preparation Unlocked",
            remarks: `${groupPrepDialogKey} preparation unlocked for parameter "${groupPrepDialogParam.parameterName}"`,
            employeeId,
            role,
          });
        } else {
          setToastMessage("Failed to unlock preparation!");
          setShowToast(true);
          setTimeout(() => setShowToast(false), 4000);
        }
      }
    } catch (error) {
      setToastMessage(`Error unlocking preparation: ${error}`);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 4000);
    } finally {
      setIsUnlockingGroupPrep(false);
      setShowUnlockGroupPrepDialog(false);
      setGroupPrepDialogParam(null);
      setGroupPrepDialogKey("");
    }
  };

  const handleInitiateDelete = (param: ParameterDetail) => {
    setParameterToDelete(param);
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (!parameterToDelete) return;

    setIsDeleting(true);

    try {
      await deleteParameter(parameterToDelete.id);
      handleRemoveParameter(parameterToDelete.id);
      setShowDeleteDialog(false);
      setToastMessage("Parameter deleted successfully!");
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
      }, 4000);
      await insertWorksheetLog({
        worksheetId,
        parameterId: parameterToDelete.id,
        action: "Parameter Deleted",
        remarks: `Parameter "${parameterToDelete.parameterName}" (${parameterToDelete.paraCode}) deleted`,
        employeeId,
        role,
      });
    } catch (error) {
      setToastMessage("Failed to delete parameter!");

      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
      }, 4000);
    } finally {
      setIsDeleting(false);
    }
  };

  // Check if parameter is editable for Analyst
  const isParameterEditableForAnalyst = useCallback(
    (parameterId: number): boolean => {
      if (role !== "Analyst") return false;
      const status = (
        parameterStatusPerParam[parameterId] || "created"
      ).toLowerCase();
      return ["created", "analysis started", "analysis revision started"].includes(
        status,
      ) || revisionStartedParams.has(parameterId);
    },
    [role, parameterStatusPerParam, revisionStartedParams],
  );

  const handleApprove = (param: ParameterDetail) => {
    setParameterForApproval(param);
    setShowApproveDialog(true);
  };

  const handleRequestRevision = (param: ParameterDetail) => {
    setParameterForApproval(param);
    setShowRevisionDialog(true);
  };

  const handleConfirmApprove = async (remarks: string) => {
    if (!parameterForApproval) return;

    setIsApproving(true);
    try {
      const updatedParam = {
        ...parameterForApproval,
        status: "Approved",
        approvedByReviewer: employeeId,
        approvedAtReviewer: new Date().toISOString(),
        remarksByQA: null, // Clear QA remarks when Reviewer re-approves
        remarksByReviewer: remarks || null,
      };

      const response = await updateParameter(
        parameterForApproval.id,
        updatedParam,
      );

      if (response && response.parameterId) {
        setParameterStatusPerParam((prev) => ({
          ...prev,
          [parameterForApproval.id]: "Approved",
        }));

        setApprovedByPerParam((prev) => ({
          ...prev,
          [parameterForApproval.id]: employeeId,
        }));

        setApprovedAtPerParam((prev) => ({
          ...prev,
          [parameterForApproval.id]: updatedParam.approvedAtReviewer,
        }));

        // Clear QA remarks locally when Reviewer re-approves
        setRemarksQAPerParam((prev) => ({
          ...prev,
          [parameterForApproval.id]: null,
        }));

        // Save reviewer remarks
        setRemarksByReviewerPerParam((prev) => ({
          ...prev,
          [parameterForApproval.id]: remarks || null,
        }));

        setToastMessage("Parameter approved successfully!");
        setShowToast(true);
        setTimeout(() => {
          setShowToast(false);
        }, 4000);
        await insertWorksheetLog({
          worksheetId,
          parameterId: parameterForApproval.id,
          action: "Parameter Approved",
          remarks: remarks || "Parameter approved by Reviewer",
          employeeId,
          role,
        });
        setShowApproveDialog(false);
        setParameterForApproval(null);
      } else {
        setToastMessage("Failed to approve parameter!");
        setShowToast(true);
        setTimeout(() => {
          setShowToast(false);
        }, 4000);
      }
    } catch (error) {
      setToastMessage(`Error approving parameter:${error}`);
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
      }, 4000);
    } finally {
      setIsApproving(false);
    }
  };

  const handleConfirmDisapprove = async () => {
    if (!parameterForApproval) return;

    setIsDisapproving(true);
    try {
      const updatedParam = {
        ...parameterForApproval,
        status: "Disapproved",
        approvedByReviewer: employeeId,
        approvedAtReviewer: new Date().toISOString(),
      };

      const response = await updateParameter(
        parameterForApproval.id,
        updatedParam,
      );

      if (response && response.parameterId) {
        setParameterStatusPerParam((prev) => ({
          ...prev,
          [parameterForApproval.id]: "Disapproved",
        }));

        setApprovedByPerParam((prev) => ({
          ...prev,
          [parameterForApproval.id]: employeeId,
        }));

        setApprovedAtPerParam((prev) => ({
          ...prev,
          [parameterForApproval.id]: updatedParam.approvedAtReviewer,
        }));

        setToastMessage("Parameter disapproved successfully!");
        setShowToast(true);
        setTimeout(() => {
          setShowToast(false);
        }, 4000);
        await insertWorksheetLog({
          worksheetId,
          parameterId: parameterForApproval.id,
          action: "Parameter Disapproved",
          remarks: "Parameter disapproved by Reviewer",
          employeeId,
          role,
        });
        setShowDisapproveDialog(false);
        setParameterForApproval(null);
      } else {
        setToastMessage("Failed to disapprove parameter!");
        setShowToast(true);
        setTimeout(() => {
          setShowToast(false);
        }, 4000);
      }
    } catch (error) {
      setToastMessage(`Error while disapproving parameter: ${error}`);
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
      }, 4000);
    } finally {
      setIsDisapproving(false);
    }
  };

  const handleConfirmRevision = async (comments: string) => {
    setIsRequestingRevision(true);
    try {
      const updatedParam = {
        ...parameterForApproval,
        status: "Analysis Revision",
        revisionComments: comments,
        remarksByReviewer: comments,
      };

      const response = await updateParameter(
        parameterForApproval?.id!,
        updatedParam!,
      );

      if (response && response.parameterId) {
        setParameterStatusPerParam((prev) => ({
          ...prev,
          [parameterForApproval?.id!]: "Analysis Revision",
        }));

        setRemarksByReviewerPerParam((prev) => ({
          ...prev,
          [parameterForApproval?.id!]: comments,
        }));

        setToastMessage("Revision requested successfully!");
        setShowToast(true);
        setTimeout(() => {
          setShowToast(false);
        }, 4000);
        await insertWorksheetLog({
          worksheetId,
          parameterId: parameterForApproval?.id,
          action: "Revision Requested",
          remarks: comments || "Revision requested by Reviewer",
          employeeId,
          role,
        });
        setShowRevisionDialog(false);
        setParameterForApproval(null);
        setRevisionComments("");
      } else {
        setToastMessage("Failed to request revision!");
        setShowToast(true);
        setTimeout(() => {
          setShowToast(false);
        }, 4000);
      }
    } catch (error) {
      setToastMessage(`Error requesting revision: ${error}`);
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
      }, 4000);
    } finally {
      setIsRequestingRevision(false);
    }
  };

  // ===== QA HANDLERS =====
  const handleQARequestRevision = (param: ParameterDetail) => {
    setParameterForApproval(param);
    setShowQARevisionDialog(true);
  };

  const handleConfirmQARevision = async (comments: string) => {
    if (!parameterForApproval) return;

    setIsQARequestingRevision(true);
    try {
      const updatedParam = {
        ...parameterForApproval,
        status: "Analysis Revision",
        remarksByQA: comments,
      };

      const response = await updateParameter(
        parameterForApproval.id,
        updatedParam,
      );

      if (response && response.parameterId) {
        setParameterStatusPerParam((prev) => ({
          ...prev,
          [parameterForApproval.id]: "Analysis Revision",
        }));
        setRemarksQAPerParam((prev) => ({
          ...prev,
          [parameterForApproval.id]: comments,
        }));

        setToastMessage("Revision requested by QA successfully!");
        setShowToast(true);
        setTimeout(() => setShowToast(false), 4000);
        await insertWorksheetLog({
          worksheetId,
          parameterId: parameterForApproval.id,
          action: "QA Revision Requested",
          remarks: comments || "Revision requested by QA",
          employeeId,
          role,
        });
        setShowQARevisionDialog(false);
        setParameterForApproval(null);
        setQARevisionComments("");
      } else {
        setToastMessage("Failed to request QA revision!");
        setShowToast(true);
        setTimeout(() => setShowToast(false), 4000);
      }
    } catch (error) {
      setToastMessage(`Error requesting QA revision: ${error}`);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 4000);
    } finally {
      setIsQARequestingRevision(false);
    }
  };

  // Handle start analysis button click
  const handleStartAnalysis = (param: ParameterDetail) => {
    setParameterForAnalysis(param);
    setShowStartAnalysisDialog(true);
  };

  // Handle confirm start analysis
  const handleConfirmStartAnalysis = async () => {
    if (!parameterForAnalysis) return;

    setIsStartingAnalysis(true);
    try {
      // Update parameter status to "Analysis Started"
      const updatedParam = {
        ...parameterForAnalysis,
        status: "Analysis Started",
        analysisStartDate: new Date().toISOString(), // Current date
      };

      const response = await updateParameter(
        parameterForAnalysis.id,
        updatedParam,
      );

      if (response && response.parameterId) {
        // Update local state
        setParameterStatusPerParam((prev) => ({
          ...prev,
          [parameterForAnalysis.id]: "Analysis Started",
        }));

        setAnalysisStartDatePerParam((prev) => ({
          ...prev,
          [parameterForAnalysis.id]: updatedParam.analysisStartDate,
        }));

        setToastMessage(
          "Analysis started successfully! You can now proceed with the analysis.",
        );
        setShowToast(true);
        setTimeout(() => {
          setShowToast(false);
        }, 4000);
        await insertWorksheetLog({
          worksheetId,
          parameterId: parameterForAnalysis.id,
          action: "Analysis Started",
          remarks: `Analysis started for parameter "${parameterForAnalysis.parameterName}"`,
          employeeId,
          role,
        });
        setShowStartAnalysisDialog(false);
        setParameterForAnalysis(null);
      } else {
        setToastMessage("Failed to start analysis!");
        setShowToast(true);
        setTimeout(() => {
          setShowToast(false);
        }, 4000);
      }
    } catch (error) {
      setToastMessage(`Error starting analysis: ${error}`);
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
      }, 4000);
    } finally {
      setIsStartingAnalysis(false);
    }
  };

  // Handle complete analysis button click
  const handleCompleteAnalysis = (param: ParameterDetail) => {
    const currentWorksheetData = collectFormDataForAPI();

    const curParam = currentWorksheetData.parameters?.filter(
      (parameter) => parameter.id === param.id,
    )[0];

    setParameterForAnalysis(curParam ?? param);
    setShowCompleteAnalysisDialog(true);
  };

  // Handle confirm complete analysis
  const handleConfirmCompleteAnalysis = async (comment: string) => {
    if (!parameterForAnalysis) return;

    setIsCompletingAnalysis(true);
    try {
      const prevStatus = (
        parameterStatusPerParam[parameterForAnalysis.id] || ""
      ).toLowerCase();
      const wasRevision =
        prevStatus === "analysis revision started" ||
        prevStatus === "analysis revision" ||
        revisionStartedParams.has(parameterForAnalysis.id);

      const completionDate = new Date().toISOString();

      const updatedParam = {
        ...parameterForAnalysis,
        status: "Analysis Completed",
        analysisCompletionDate: completionDate,
        ...(wasRevision && { revisionCompletedDate: completionDate }),
        remarksByAnalyst: comment || null,
      };

      const response = await updateParameter(
        parameterForAnalysis.id,
        updatedParam,
      );

      if (response && response.parameterId) {
        setParameterStatusPerParam((prev) => ({
          ...prev,
          [parameterForAnalysis.id]: "Analysis Completed",
        }));

        setAnalysisCompletionDatePerParam((prev) => ({
          ...prev,
          [parameterForAnalysis.id]: completionDate,
        }));

        if (wasRevision) {
          setRevisionCompletedDatePerParam((prev) => ({
            ...prev,
            [parameterForAnalysis.id]: completionDate,
          }));
          setRevisionStartedParams(prev => {
            const next = new Set(prev);
            next.delete(parameterForAnalysis.id);
            return next;
          });
        }

        if (comment) {
          setRemarksByAnalystPerParam((prev) => ({
            ...prev,
            [parameterForAnalysis.id]: comment,
          }));
        }

        setToastMessage(
          wasRevision
            ? "Revision completed successfully! Resubmitted to Reviewer."
            : "Analysis completed successfully! Submitted for Reviewer approval.",
        );
        setShowToast(true);
        setTimeout(() => {
          setShowToast(false);
        }, 4000);

        await insertWorksheetLog({
          worksheetId,
          parameterId: parameterForAnalysis.id,
          action: wasRevision
            ? "Analysis Completed After Revision"
            : "Analysis Completed",
          remarks: comment || (wasRevision
            ? "Analysis completed after revision"
            : "Analysis completed"),
          employeeId,
          role,
        });

        setShowCompleteAnalysisDialog(false);
        setParameterForAnalysis(null);
      } else {
        setToastMessage("Failed to complete analysis!");
        setShowToast(true);
        setTimeout(() => {
          setShowToast(false);
        }, 4000);
      }
    } catch (error) {
      setToastMessage(`Error completing analysis: ${error}`);
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
      }, 4000);
    } finally {
      setIsCompletingAnalysis(false);
    }
  };

  const handleApproveWorksheet = async () => {
    setIsApprovingWorksheet(true);

    try {
      if (!worksheetInfo) {
        throw new Error("Worksheet information is not available");
      }

      // Capture timestamp once — used for every write below
      const now = new Date().toISOString();

      // ── 1. Build the full payload with QA approval stamped on every parameter ──
      // collectFormDataForAPI reads the current per-param state arrays, giving us
      // the complete parameter data (preparations, calculations, files, etc.)
      const worksheetData = collectFormDataForAPI();

      const updatedWorksheetData = {
        ...worksheetData,
        documentInfo: {
          ...worksheetData?.documentInfo,
          status: "Approved",
          approvedBy: employeeId, // → approved_by column on worksheet row
          approvedAt: now, // → approved_at column on worksheet row
        },
        // Stamp approvedByQA / approvedAtQA on every parameter in the same payload.
        // updateWorksheet's backend loop calls UpdateParameter for each one in a
        // single transaction — no separate per-param API calls needed.
        parameters: worksheetData.parameters?.map((p) => ({
          ...p,
          approvedByQA: employeeId,
          approvedAtQA: now,
        })),
      };

      // ── 2. Single call — updates worksheet row + all parameter rows atomically ──
      const response = await updateWorksheet(worksheetId, updatedWorksheetData);

      if (!response?.worksheetId) {
        throw new Error("Failed to update worksheet status after approval");
      }

      // ── 3. Submit to final tbl tables — inject QA fields BEFORE mapping ──
      const worksheetInfoWithQA = {
        ...worksheetInfo,
        sample: {
          ...worksheetInfo.sample,
          status: "Approved",
          approvedBy: employeeId,
          approvedAt: now,
        },
        parameters: worksheetInfo.parameters.map((p) => ({
          ...p,
          approvedByQA: employeeId,
          approvedAtQA: now,
        })),
      };

      const mappedData = WorksheetDbMapper.mapAll(
        worksheetInfoWithQA as typeof worksheetInfo,
      );
      const submitResponse = await submitWorksheet(mappedData);

      if (!submitResponse.success) {
        throw new Error(
          submitResponse.message ||
          "Failed to submit worksheet to final database",
        );
      }

      // ── 4. Update local React state so UI reflects approval immediately ──
      const qaUpdate: Record<number, string> = {};
      const qaAtUpdate: Record<number, string> = {};
      addedParameters.forEach((p) => {
        qaUpdate[p.id] = employeeId;
        qaAtUpdate[p.id] = now;
      });
      setApprovedByQAPerParam((prev) => ({ ...prev, ...qaUpdate }));
      setApprovedAtQAPerParam((prev) => ({ ...prev, ...qaAtUpdate }));

      setWorksheetInfo((prev) =>
        prev
          ? {
            ...prev,
            sample: {
              ...prev.sample,
              status: "Approved",
              approvedBy: employeeId,
              approvedAt: now,
            },
          }
          : null,
      );

      setToastMessage(
        "Worksheet approved by QA successfully! All parameters are now finalized.",
      );
      setShowToast(true);
      setTimeout(() => setShowToast(false), 4000);
      await insertWorksheetLog({
        worksheetId,
        action: "Worksheet Approved by QA",
        remarks: "Worksheet fully approved by QA",
        employeeId,
        role,
      });
      setShowApproveWorksheetDialog(false);
    } catch (error: any) {
      console.error("Error during worksheet approval:", error);
      setToastMessage(`Error approving worksheet: ${error.message || error}`);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 4000);
    } finally {
      setIsApprovingWorksheet(false);
    }
  };

  const handleSubmitForQA = async () => {
    setIsSubmittingForQA(true);
    try {
      const worksheetData = collectFormDataForAPI();
      const now = new Date().toISOString();

      const updatedWorksheetData = {
        ...worksheetData,
        documentInfo: {
          ...worksheetData?.documentInfo,
          status: "Submitted For QA Review",
          submittedQaBy: employeeId,
          submittedQaAt: now,
        },
      };

      const response = await updateWorksheet(worksheetId, updatedWorksheetData);

      if (response && response.worksheetId) {
        setWorksheetInfo((prev) =>
          prev
            ? {
              ...prev,
              sample: {
                ...prev.sample,
                status: "Submitted For QA Review",
                submittedQaBy: employeeId,
                submittedQaAt: now,
              },
            }
            : null,
        );

        setToastMessage("Worksheet submitted for QA Review successfully!");
        setShowToast(true);
        setTimeout(() => setShowToast(false), 4000);
        await insertWorksheetLog({
          worksheetId,
          action: "Submitted For QA Review",
          remarks: "Worksheet submitted for QA review",
          employeeId,
          role,
        });
        setShowSubmitForQADialog(false);
      } else {
        throw new Error("Failed to submit worksheet for QA Review");
      }
    } catch (error: any) {
      console.error("Error submitting for QA:", error);
      setToastMessage(`Error: ${error.message || error}`);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 4000);
    } finally {
      setIsSubmittingForQA(false);
    }
  };

  const availableToAdd = (samplesData ?? []).filter(
    (param) =>
      !addedParameters.find((added) => added.paraCode === param.paraCode),
  );

  // Instrument/Chemical/Standard Handlers
  const searchFilteredInstruments = instruments.filter(
    (inst) =>
      inst.name.toLowerCase().includes(instrumentSearch.toLowerCase()) ||
      inst
        .instrumentTag!.toLowerCase()
        .includes(instrumentSearch.toLowerCase()),
  );

  const searchFilteredChemicals = chemicals.filter(
    (chem) =>
      chem.name.toLowerCase().includes(chemicalSearch.toLowerCase()) ||
      (chem.make &&
        chem.make.toLowerCase().includes(chemicalSearch.toLowerCase())),
  );

  const searchFilteredStandards = standards.filter(
    (std) =>
      std.name.toLowerCase().includes(standardSearch.toLowerCase()) ||
      (std.make &&
        std.make.toLowerCase().includes(standardSearch.toLowerCase())),
  );

  const handleAddInstrument = (instrument: WorksheetInstrument) => {
    setAddedInstruments((prev) => ({
      ...prev,
      [instrument.parameterId]: [...(prev[instrument.parameterId] || []), instrument],
    }));
    setShowInstrumentDropdown(false);
    setInstrumentSearch("");
  };

  const handleRemoveInstrument = (
    parameterId: number,
    instrumentId: string,
  ) => {
    setAddedInstruments((prev) => ({
      ...prev,
      [parameterId]: (prev[parameterId] || []).filter(
        (inst) => inst.instrumentId !== instrumentId,
      ),
    }));
  };

  const handleAddChemical = (chemical: WorksheetChemical) => {
    setAddedChemicals((prev) => ({
      ...prev,
      [chemical.parameterId]: [...(prev[chemical.parameterId] || []), chemical],
    }));
    setShowChemicalDropdown(false);
    setChemicalSearch("");
  };

  const handleRemoveChemical = (parameterId: number, chemicalId: string) => {
    setAddedChemicals((prev) => ({
      ...prev,
      [parameterId]: (prev[parameterId] || []).filter(
        (chem) => chem.slno !== chemicalId,
      ),
    }));
  };

  const handleAddStandard = (standard: WorksheetStandard) => {
    setAddedStandards((prev) => ({
      ...prev,
      [standard.parameterId]: [...(prev[standard.parameterId] || []), standard],
    }));
    setShowStandardDropdown(false);
    setStandardSearch("");
  };

  const handleRemoveStandard = (parameterId: number, standardId: string) => {
    setAddedStandards((prev) => ({
      ...prev,
      [parameterId]: (prev[parameterId] || []).filter(
        (std) => std.serialNo !== standardId,
      ),
    }));
  };

  const prepFileKey = (type: string | null, label: string | null) =>
    `${type ?? ""}|${label ?? ""}`;

  /** Slot key for parameter-level files */
  const PARAM_LEVEL_KEY = "param_level";

  const getFilesForPrep = (
    paramId: number,
    type: string | null,
    label: string | null,
  ): AttachedFile[] =>
    (filesPerParam[paramId] ?? {})[prepFileKey(type, label)] ?? [];

  const getParamLevelFiles = (paramId: number): AttachedFile[] =>
    (filesPerParam[paramId] ?? {})[PARAM_LEVEL_KEY] ?? [];

  const updateFilesForSlot = (
    paramId: number,
    slotKey: string,
    updater: (prev: AttachedFile[]) => AttachedFile[],
  ) => {
    setFilesPerParam((prev) => ({
      ...prev,
      [paramId]: {
        ...(prev[paramId] ?? {}),
        [slotKey]: updater((prev[paramId] ?? {})[slotKey] ?? []),
      },
    }));
  };

  const handleAddPrepFiles = (
    paramId: number,
    type: string | null,
    label: string | null,
    newFiles: AttachedFile[],
  ) => {
    const key = prepFileKey(type, label);
    updateFilesForSlot(paramId, key, (prev) => [...prev, ...newFiles]);
  };

  const handleRemovePrepFile = (
    paramId: number,
    type: string | null,
    label: string | null,
    index: number,
  ) => {
    const key = prepFileKey(type, label);
    updateFilesForSlot(paramId, key, (prev) =>
      prev.filter((_, i) => i !== index),
    );
  };

  const handleAddParamFiles = (paramId: number, newFiles: AttachedFile[]) => {
    updateFilesForSlot(paramId, PARAM_LEVEL_KEY, (prev) => [
      ...prev,
      ...newFiles,
    ]);
  };

  const handleRemoveParamFile = (paramId: number, index: number) => {
    updateFilesForSlot(paramId, PARAM_LEVEL_KEY, (prev) =>
      prev.filter((_, i) => i !== index),
    );
  };

  /** Collect ALL files for a param into a flat WorksheetFileData[] for save payload */
  const collectFilesForParam = (paramId: number): WorksheetFileData[] => {
    const slots = filesPerParam[paramId] ?? {};
    const result: WorksheetFileData[] = [];
    for (const [slotKey, slotFiles] of Object.entries(slots)) {
      for (const f of slotFiles) {
        if (slotKey === PARAM_LEVEL_KEY) {
          result.push({
            id: f.id,
            preparationType: null,
            label: null,
            fileName: f.fileName,
            fileDataBase64: f.fileDataBase64,
          });
        } else {
          // Key format: "type|label" — use indexOf so labels containing "|" are preserved
          const separatorIdx = slotKey.indexOf("|");
          const type =
            separatorIdx >= 0 ? slotKey.slice(0, separatorIdx) : slotKey;
          const label =
            separatorIdx >= 0 ? slotKey.slice(separatorIdx + 1) : "";
          result.push({
            id: f.id,
            preparationType: type || null,
            label: label || null,
            fileName: f.fileName,
            fileDataBase64: f.fileDataBase64,
          });
        }
      }
    }
    return result;
  };


  const allParameters = samplesData.map((data) => data.parameter) ?? [];
  const uniqueMethods = [
    ...new Map(
      (samplesData ?? []).map((item) => [item.methodCode, item]),
    ).values(),
  ];
  const allMethods = uniqueMethods
    .map((item) => item.methodName)
    .filter((method) => method && method.trim() !== "");

  const testsRequiredDisplay = allParameters
    .filter((param) => param && param.trim() !== "")
    .join(", ");

  const methodsRequiredDisplay = allMethods.join(", ");

  const animationProps = {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.9 },
    transition: { duration: 0.3 },
  };

  const loadingIconProps = {
    animate: { y: [0, -10, 0] },
    transition: { duration: 2, repeat: Infinity },
  };

  // ────────────────────────────────────────────────────────────────────────
  // ICP-MS handlers
  // ────────────────────────────────────────────────────────────────────────
  const handleAddSamplePreparationIcpms = (parameterId: number) => {
    setSamplePreparationIcpmsPerParam((prev) => {
      const current = prev[parameterId] || [];
      const newIndex = current.length;
      return {
        ...prev,
        [parameterId]: [
          ...current,
          createNewSamplePreparationIcpms(newIndex),
        ],
      };
    });
  };

  const handleAddStandardPreparationIcpms = (parameterId: number) => {
    setStandardPreparationMetalPerParam((prev) => {
      const current = prev[parameterId]?.["icpmsFood"] || [];
      return {
        ...prev,
        [parameterId]: {
          ...(prev[parameterId] || {}),
          icpmsFood: [...current, createNewStandardPreparationMetal(current.length)],
        },
      };
    });
  };

  const handleRemoveSamplePreparationIcpms = (
    parameterId: number,
    prepId: number,
  ) => {
    setSamplePreparationIcpmsPerParam((prev) => {
      const updated = (prev[parameterId] || [])
        .filter((p) => p.id !== prepId)
        .map((p, idx) => ({
          ...p,
          label: `Sample Preparation ${idx + 1}`,
        }));
      return { ...prev, [parameterId]: updated };
    });
  };

  const handleRemoveStandardPreparationIcpms = (
    parameterId: number,
    prepId: number,
  ) => {
    setStandardPreparationMetalPerParam((prev) => {
      const current = prev[parameterId]?.["icpmsFood"] || [];
      const updated = current
        .filter((p) => p.id !== prepId)
        .map((p, i) => ({ ...p, label: `Standard Preparation ${i + 1}` }));
      return {
        ...prev,
        [parameterId]: { ...(prev[parameterId] || {}), icpmsFood: updated },
      };
    });
  };

  const handleSamplePreparationIcpmsStepChange = (
    parameterId: number,
    samplePreparationId: number,
    stepName: SamplePreparationMetalStep["name"],
    field: "value1" | "unit1" | "value2" | "unit2" | "logBookID" | "solventChemical",
    newValue: string,
  ) => {
    setSamplePreparationIcpmsPerParam((prev) => {
      const list = prev[parameterId] || [];
      const updated = list.map((sp) => {
        if (sp.id !== samplePreparationId) return sp;
        const stepsArr = Array.isArray(sp.steps) ? sp.steps : [];
        const exists = stepsArr.some((s) => s.name === stepName);
        const newSteps = exists
          ? stepsArr.map((s) => (s.name === stepName ? { ...s, [field]: newValue } : s))
          : [...stepsArr, { name: stepName, [field]: newValue }];
        return { ...sp, steps: newSteps };
      });
      return { ...prev, [parameterId]: updated };
    });
  };

  const handleAddCalculationIcpms = (parameterId: number) => {
    setCalculationsIcpmsPerParam((prev) => {
      const current = prev[parameterId] || [];
      const newIndex = current.length;
      return {
        ...prev,
        [parameterId]: [
          ...current,
          createNewCalculationIcpms(newIndex),
        ],
      };
    });
  };

  const handleRemoveCalculationIcpms = (
    parameterId: number,
    calcId: number,
  ) => {
    setCalculationsIcpmsPerParam((prev) => {
      const updated = (prev[parameterId] || [])
        .filter((c) => c.id !== calcId)
        .map((c, idx) => ({
          ...c,
          label: `Calculation ${idx + 1}`,
        }));
      return { ...prev, [parameterId]: updated };
    });
  };

  const handleUpdateCalculationIcpms = (
    parameterId: number,
    updatedCalc: CalculationIcpms,
  ) => {
    setCalculationsIcpmsPerParam((prev) => ({
      ...prev,
      [parameterId]: (prev[parameterId] || []).map((c) =>
        c.id === updatedCalc.id ? updatedCalc : c,
      ),
    }));
  };

  const handleAddSamplePreparationIcpoes = (parameterId: number) => {
    setSamplePreparationIcpoesPerParam((prev) => {
      const current = prev[parameterId] || [];
      const newIndex = current.length;
      return {
        ...prev,
        [parameterId]: [
          ...current,
          createNewSamplePreparationIcpoes(newIndex),
        ],
      };
    });
  };

  const handleAddStandardPreparationIcpoes = (parameterId: number) => {
    setStandardPreparationMetalPerParam((prev) => {
      const current = prev[parameterId]?.["icpoesFood"] || [];
      return {
        ...prev,
        [parameterId]: {
          ...(prev[parameterId] || {}),
          icpoesFood: [...current, createNewStandardPreparationMetal(current.length)],
        },
      };
    });
  };

  const handleRemoveSamplePreparationIcpoes = (
    parameterId: number,
    prepId: number,
  ) => {
    setSamplePreparationIcpoesPerParam((prev) => {
      const updated = (prev[parameterId] || [])
        .filter((p) => p.id !== prepId)
        .map((p, idx) => ({
          ...p,
          label: `Sample Preparation ${idx + 1}`,
        }));
      return { ...prev, [parameterId]: updated };
    });
  };

  const handleRemoveStandardPreparationIcpoes = (
    parameterId: number,
    prepId: number,
  ) => {
    setStandardPreparationMetalPerParam((prev) => {
      const current = prev[parameterId]?.["icpoesFood"] || [];
      const updated = current
        .filter((p) => p.id !== prepId)
        .map((p, i) => ({ ...p, label: `Standard Preparation ${i + 1}` }));
      return {
        ...prev,
        [parameterId]: { ...(prev[parameterId] || {}), icpoesFood: updated },
      };
    });
  };

  const handleSamplePreparationIcpoesStepChange = (
    parameterId: number,
    samplePreparationId: number,
    stepName: SamplePreparationMetalStep["name"],
    field: "value1" | "unit1" | "value2" | "unit2" | "logBookID" | "solventChemical",
    newValue: string,
  ) => {
    setSamplePreparationIcpoesPerParam((prev) => {
      const list = prev[parameterId] || [];
      const updated = list.map((sp) => {
        if (sp.id !== samplePreparationId) return sp;
        const stepsArr = Array.isArray(sp.steps) ? sp.steps : [];
        const exists = stepsArr.some((s) => s.name === stepName);
        const newSteps = exists
          ? stepsArr.map((s) => (s.name === stepName ? { ...s, [field]: newValue } : s))
          : [...stepsArr, { name: stepName, [field]: newValue }];
        return { ...sp, steps: newSteps };
      });
      return { ...prev, [parameterId]: updated };
    });
  };

  const handleAddCalculationIcpoes = (parameterId: number) => {
    setCalculationsIcpoesPerParam((prev) => {
      const current = prev[parameterId] || [];
      const newIndex = current.length;
      return {
        ...prev,
        [parameterId]: [
          ...current,
          createNewCalculationIcpoes(newIndex),
        ],
      };
    });
  };

  const handleRemoveCalculationIcpoes = (
    parameterId: number,
    calcId: number,
  ) => {
    setCalculationsIcpoesPerParam((prev) => {
      const updated = (prev[parameterId] || [])
        .filter((c) => c.id !== calcId)
        .map((c, idx) => ({
          ...c,
          label: `Calculation ${idx + 1}`,
        }));
      return { ...prev, [parameterId]: updated };
    });
  };

  const handleUpdateCalculationIcpoes = (
    parameterId: number,
    updatedCalc: CalculationIcpoes,
  ) => {
    setCalculationsIcpoesPerParam((prev) => ({
      ...prev,
      [parameterId]: (prev[parameterId] || []).map((c) =>
        c.id === updatedCalc.id ? updatedCalc : c,
      ),
    }));
  };

  const handleAddSamplePreparationIcpmsWater = (parameterId: number) => {
    setSamplePreparationIcpmsWaterPerParam((prev) => {
      const current = prev[parameterId] || [];
      const newIndex = current.length;
      return {
        ...prev,
        [parameterId]: [
          ...current,
          createNewSamplePreparationIcpmsWater(newIndex),
        ],
      };
    });
  };

  const handleAddStandardPreparationIcpmsWater = (parameterId: number) => {
    setStandardPreparationMetalPerParam((prev) => {
      const current = prev[parameterId]?.["icpmsWater"] || [];
      return {
        ...prev,
        [parameterId]: {
          ...(prev[parameterId] || {}),
          icpmsWater: [...current, createNewStandardPreparationMetal(current.length)],
        },
      };
    });
  };

  const handleRemoveSamplePreparationIcpmsWater = (
    parameterId: number,
    prepId: number,
  ) => {
    setSamplePreparationIcpmsWaterPerParam((prev) => {
      const updated = (prev[parameterId] || [])
        .filter((p) => p.id !== prepId)
        .map((p, idx) => ({
          ...p,
          label: `Sample Preparation ${idx + 1}`,
        }));
      return { ...prev, [parameterId]: updated };
    });
  };

  const handleRemoveStandardPreparationIcpmsWater = (
    parameterId: number,
    prepId: number,
  ) => {
    setStandardPreparationMetalPerParam((prev) => {
      const current = prev[parameterId]?.["icpmsWater"] || [];
      const updated = current
        .filter((p) => p.id !== prepId)
        .map((p, i) => ({ ...p, label: `Standard Preparation ${i + 1}` }));
      return {
        ...prev,
        [parameterId]: { ...(prev[parameterId] || {}), icpmsWater: updated },
      };
    });
  };

  const handleSamplePreparationIcpmsWaterStepChange = (
    parameterId: number,
    samplePreparationId: number,
    stepName: SamplePreparationMetalStep["name"],
    field: "value1" | "unit1" | "value2" | "unit2" | "logBookID" | "solventChemical",
    newValue: string,
  ) => {
    setSamplePreparationIcpmsWaterPerParam((prev) => {
      const list = prev[parameterId] || [];
      const updated = list.map((sp) => {
        if (sp.id !== samplePreparationId) return sp;
        const stepsArr = Array.isArray(sp.steps) ? sp.steps : [];
        const exists = stepsArr.some((s) => s.name === stepName);
        const newSteps = exists
          ? stepsArr.map((s) => (s.name === stepName ? { ...s, [field]: newValue } : s))
          : [...stepsArr, { name: stepName, [field]: newValue }];
        return { ...sp, steps: newSteps };
      });
      return { ...prev, [parameterId]: updated };
    });
  };

  const handleAddCalculationIcpmsWater = (parameterId: number) => {
    setCalculationsIcpmsWaterPerParam((prev) => {
      const current = prev[parameterId] || [];
      const newIndex = current.length;
      return {
        ...prev,
        [parameterId]: [
          ...current,
          createNewCalculationIcpmsWater(newIndex),
        ],
      };
    });
  };

  const handleRemoveCalculationIcpmsWater = (
    parameterId: number,
    calcId: number,
  ) => {
    setCalculationsIcpmsWaterPerParam((prev) => {
      const updated = (prev[parameterId] || [])
        .filter((c) => c.id !== calcId)
        .map((c, idx) => ({
          ...c,
          label: `Calculation ${idx + 1}`,
        }));
      return { ...prev, [parameterId]: updated };
    });
  };

  const handleUpdateCalculationIcpmsWater = (
    parameterId: number,
    updatedCalc: CalculationIcpmsWater,
  ) => {
    setCalculationsIcpmsWaterPerParam((prev) => ({
      ...prev,
      [parameterId]: (prev[parameterId] || []).map((c) =>
        c.id === updatedCalc.id ? updatedCalc : c,
      ),
    }));
  };

  const handleAddSamplePreparationIcpoesWater = (parameterId: number) => {
    setSamplePreparationIcpoesWaterPerParam((prev) => {
      const current = prev[parameterId] || [];
      const newIndex = current.length;
      return {
        ...prev,
        [parameterId]: [
          ...current,
          createNewSamplePreparationIcpoesWater(newIndex),
        ],
      };
    });
  };

  const handleAddStandardPreparationIcpoesWater = (parameterId: number) => {
    setStandardPreparationMetalPerParam((prev) => {
      const current = prev[parameterId]?.["icpoesWater"] || [];
      return {
        ...prev,
        [parameterId]: {
          ...(prev[parameterId] || {}),
          icpoesWater: [...current, createNewStandardPreparationMetal(current.length)],
        },
      };
    });
  };

  const handleRemoveSamplePreparationIcpoesWater = (
    parameterId: number,
    prepId: number,
  ) => {
    setSamplePreparationIcpoesWaterPerParam((prev) => {
      const updated = (prev[parameterId] || [])
        .filter((p) => p.id !== prepId)
        .map((p, idx) => ({
          ...p,
          label: `Sample Preparation ${idx + 1}`,
        }));
      return { ...prev, [parameterId]: updated };
    });
  };

  const handleRemoveStandardPreparationIcpoesWater = (
    parameterId: number,
    prepId: number,
  ) => {
    setStandardPreparationMetalPerParam((prev) => {
      const current = prev[parameterId]?.["icpoesWater"] || [];
      const updated = current
        .filter((p) => p.id !== prepId)
        .map((p, i) => ({ ...p, label: `Standard Preparation ${i + 1}` }));
      return {
        ...prev,
        [parameterId]: { ...(prev[parameterId] || {}), icpoesWater: updated },
      };
    });
  };

  const handleSamplePreparationIcpoesWaterStepChange = (
    parameterId: number,
    samplePreparationId: number,
    stepName: SamplePreparationMetalStep["name"],
    field: "value1" | "unit1" | "value2" | "unit2" | "logBookID" | "solventChemical",
    newValue: string,
  ) => {
    setSamplePreparationIcpoesWaterPerParam((prev) => {
      const list = prev[parameterId] || [];
      const updated = list.map((sp) => {
        if (sp.id !== samplePreparationId) return sp;
        const stepsArr = Array.isArray(sp.steps) ? sp.steps : [];
        const exists = stepsArr.some((s) => s.name === stepName);
        const newSteps = exists
          ? stepsArr.map((s) => (s.name === stepName ? { ...s, [field]: newValue } : s))
          : [...stepsArr, { name: stepName, [field]: newValue }];
        return { ...sp, steps: newSteps };
      });
      return { ...prev, [parameterId]: updated };
    });
  };

  const handleAddCalculationIcpoesWater = (parameterId: number) => {
    setCalculationsIcpoesWaterPerParam((prev) => {
      const current = prev[parameterId] || [];
      const newIndex = current.length;
      return {
        ...prev,
        [parameterId]: [
          ...current,
          createNewCalculationIcpoesWater(newIndex),
        ],
      };
    });
  };

  const handleRemoveCalculationIcpoesWater = (
    parameterId: number,
    calcId: number,
  ) => {
    setCalculationsIcpoesWaterPerParam((prev) => {
      const updated = (prev[parameterId] || [])
        .filter((c) => c.id !== calcId)
        .map((c, idx) => ({
          ...c,
          label: `Calculation ${idx + 1}`,
        }));
      return { ...prev, [parameterId]: updated };
    });
  };

  const handleUpdateCalculationIcpoesWater = (
    parameterId: number,
    updatedCalc: CalculationIcpoesWater,
  ) => {
    setCalculationsIcpoesWaterPerParam((prev) => ({
      ...prev,
      [parameterId]: (prev[parameterId] || []).map((c) =>
        c.id === updatedCalc.id ? updatedCalc : c,
      ),
    }));
  };

  const handleAddSamplePreparationAasWater = (parameterId: number) => {
    setSamplePreparationAasWaterPerParam((prev) => {
      const current = prev[parameterId] || [];
      const newIndex = current.length;
      return {
        ...prev,
        [parameterId]: [
          ...current,
          createNewSamplePreparationAasWater(newIndex),
        ],
      };
    });
  };

  const handleAddStandardPreparationAasWater = (parameterId: number) => {
    setStandardPreparationMetalPerParam((prev) => {
      const current = prev[parameterId]?.["aasWater"] || [];
      return {
        ...prev,
        [parameterId]: {
          ...(prev[parameterId] || {}),
          aasWater: [...current, createNewStandardPreparationMetal(current.length)],
        },
      };
    });
  };

  const handleRemoveSamplePreparationAasWater = (
    parameterId: number,
    prepId: number,
  ) => {
    setSamplePreparationAasWaterPerParam((prev) => {
      const updated = (prev[parameterId] || [])
        .filter((p) => p.id !== prepId)
        .map((p, idx) => ({
          ...p,
          label: `Sample Preparation ${idx + 1}`,
        }));
      return { ...prev, [parameterId]: updated };
    });
  };

  const handleRemoveStandardPreparationAasWater = (
    parameterId: number,
    prepId: number,
  ) => {
    setStandardPreparationMetalPerParam((prev) => {
      const current = prev[parameterId]?.["aasWater"] || [];
      const updated = current
        .filter((p) => p.id !== prepId)
        .map((p, i) => ({ ...p, label: `Standard Preparation ${i + 1}` }));
      return {
        ...prev,
        [parameterId]: { ...(prev[parameterId] || {}), aasWater: updated },
      };
    });
  };

  const handleSamplePreparationAasWaterStepChange = (
    parameterId: number,
    samplePreparationId: number,
    stepName: SamplePreparationMetalStep["name"],
    field: "value1" | "unit1" | "value2" | "unit2" | "logBookID" | "solventChemical",
    newValue: string,
  ) => {
    setSamplePreparationAasWaterPerParam((prev) => {
      const list = prev[parameterId] || [];
      const updated = list.map((sp) => {
        if (sp.id !== samplePreparationId) return sp;
        const stepsArr = Array.isArray(sp.steps) ? sp.steps : [];
        const exists = stepsArr.some((s) => s.name === stepName);
        const newSteps = exists
          ? stepsArr.map((s) => (s.name === stepName ? { ...s, [field]: newValue } : s))
          : [...stepsArr, { name: stepName, [field]: newValue }];
        return { ...sp, steps: newSteps };
      });
      return { ...prev, [parameterId]: updated };
    });
  };

  const handleAddCalculationAasWater = (parameterId: number) => {
    setCalculationsAasWaterPerParam((prev) => {
      const current = prev[parameterId] || [];
      const newIndex = current.length;
      return {
        ...prev,
        [parameterId]: [
          ...current,
          createNewCalculationAasWater(newIndex),
        ],
      };
    });
  };

  const handleRemoveCalculationAasWater = (
    parameterId: number,
    calcId: number,
  ) => {
    setCalculationsAasWaterPerParam((prev) => {
      const updated = (prev[parameterId] || [])
        .filter((c) => c.id !== calcId)
        .map((c, idx) => ({
          ...c,
          label: `Calculation ${idx + 1}`,
        }));
      return { ...prev, [parameterId]: updated };
    });
  };

  const handleUpdateCalculationAasWater = (
    parameterId: number,
    updatedCalc: CalculationAasWater,
  ) => {
    setCalculationsAasWaterPerParam((prev) => ({
      ...prev,
      [parameterId]: (prev[parameterId] || []).map((c) =>
        c.id === updatedCalc.id ? updatedCalc : c,
      ),
    }));
  };

  const handleAddSamplePreparationIcpmsIchQ3D = (parameterId: number) => {
    setSamplePreparationIcpmsIchQ3DPerParam((prev) => {
      const current = prev[parameterId] || [];
      const newIndex = current.length;
      return {
        ...prev,
        [parameterId]: [
          ...current,
          createNewSamplePreparationIcpmsIchQ3D(newIndex),
        ],
      };
    });
  };

  const handleAddStandardPreparationIcpmsIchQ3D = (parameterId: number) => {
    setStandardPreparationMetalPerParam((prev) => {
      const current = prev[parameterId]?.["icpmsIchQ3D"] || [];
      return {
        ...prev,
        [parameterId]: {
          ...(prev[parameterId] || {}),
          icpmsIchQ3D: [...current, createNewStandardPreparationMetal(current.length)],
        },
      };
    });
  };

  const handleRemoveSamplePreparationIcpmsIchQ3D = (
    parameterId: number,
    prepId: number,
  ) => {
    setSamplePreparationIcpmsIchQ3DPerParam((prev) => {
      const updated = (prev[parameterId] || [])
        .filter((p) => p.id !== prepId)
        .map((p, idx) => ({
          ...p,
          label: `Sample Preparation ${idx + 1}`,
        }));
      return { ...prev, [parameterId]: updated };
    });
  };

  const handleRemoveStandardPreparationIcpmsIchQ3D = (
    parameterId: number,
    prepId: number,
  ) => {
    setStandardPreparationMetalPerParam((prev) => {
      const current = prev[parameterId]?.["icpmsIchQ3D"] || [];
      const updated = current
        .filter((p) => p.id !== prepId)
        .map((p, i) => ({ ...p, label: `Standard Preparation ${i + 1}` }));
      return {
        ...prev,
        [parameterId]: { ...(prev[parameterId] || {}), icpmsIchQ3D: updated },
      };
    });
  };

  const handleSamplePreparationIcpmsIchQ3DStepChange = (
    parameterId: number,
    samplePreparationId: number,
    stepName: SamplePreparationMetalStep["name"],
    field: "value1" | "unit1" | "value2" | "unit2" | "logBookID" | "solventChemical",
    newValue: string,
  ) => {
    setSamplePreparationIcpmsIchQ3DPerParam((prev) => {
      const list = prev[parameterId] || [];
      const updated = list.map((sp) => {
        if (sp.id !== samplePreparationId) return sp;
        const stepsArr = Array.isArray(sp.steps) ? sp.steps : [];
        const exists = stepsArr.some((s) => s.name === stepName);
        const newSteps = exists
          ? stepsArr.map((s) => (s.name === stepName ? { ...s, [field]: newValue } : s))
          : [...stepsArr, { name: stepName, [field]: newValue }];
        return { ...sp, steps: newSteps };
      });
      return { ...prev, [parameterId]: updated };
    });
  };

  const handleAddCalculationIcpmsIchQ3D = (parameterId: number) => {
    setCalculationsIcpmsIchQ3DPerParam((prev) => {
      const current = prev[parameterId] || [];
      const newIndex = current.length;
      return {
        ...prev,
        [parameterId]: [
          ...current,
          createNewCalculationIcpmsIchQ3D(newIndex),
        ],
      };
    });
  };

  const handleRemoveCalculationIcpmsIchQ3D = (
    parameterId: number,
    calcId: number,
  ) => {
    setCalculationsIcpmsIchQ3DPerParam((prev) => {
      const updated = (prev[parameterId] || [])
        .filter((c) => c.id !== calcId)
        .map((c, idx) => ({
          ...c,
          label: `Calculation ${idx + 1}`,
        }));
      return { ...prev, [parameterId]: updated };
    });
  };

  const handleUpdateCalculationIcpmsIchQ3D = (
    parameterId: number,
    updatedCalc: CalculationIcpmsIchQ3D,
  ) => {
    setCalculationsIcpmsIchQ3DPerParam((prev) => ({
      ...prev,
      [parameterId]: (prev[parameterId] || []).map((c) =>
        c.id === updatedCalc.id ? updatedCalc : c,
      ),
    }));
  };

  const handleAddSamplePreparationORS = (parameterId: number) => {
    setSamplePreparationORSPerParam((prev) => {
      const current = prev[parameterId] || [];
      const newIndex = current.length;
      return {
        ...prev,
        [parameterId]: [
          ...current,
          createNewSamplePreparationORS(newIndex),
        ],
      };
    });
  };

  const handleAddStandardPreparationORS = (parameterId: number) => {
    setStandardPreparationMetalPerParam((prev) => {
      const current = prev[parameterId]?.["ors"] || [];
      return {
        ...prev,
        [parameterId]: {
          ...(prev[parameterId] || {}),
          ors: [...current, createNewStandardPreparationMetal(current.length)],
        },
      };
    });
  };

  const handleRemoveSamplePreparationORS = (
    parameterId: number,
    prepId: number,
  ) => {
    setSamplePreparationORSPerParam((prev) => {
      const updated = (prev[parameterId] || [])
        .filter((p) => p.id !== prepId)
        .map((p, idx) => ({
          ...p,
          label: `Sample Preparation ${idx + 1}`,
        }));
      return { ...prev, [parameterId]: updated };
    });
  };

  const handleRemoveStandardPreparationORS = (
    parameterId: number,
    prepId: number,
  ) => {
    setStandardPreparationMetalPerParam((prev) => {
      const current = prev[parameterId]?.["ors"] || [];
      const updated = current
        .filter((p) => p.id !== prepId)
        .map((p, i) => ({ ...p, label: `Standard Preparation ${i + 1}` }));
      return {
        ...prev,
        [parameterId]: { ...(prev[parameterId] || {}), ors: updated },
      };
    });
  };

  const handleSamplePreparationORSStepChange = (
    parameterId: number,
    samplePreparationId: number,
    stepName: SamplePreparationMetalStep["name"],
    field: "value1" | "unit1" | "value2" | "unit2" | "logBookID" | "solventChemical",
    newValue: string,
  ) => {
    setSamplePreparationORSPerParam((prev) => {
      const list = prev[parameterId] || [];
      const updated = list.map((sp) => {
        if (sp.id !== samplePreparationId) return sp;
        const stepsArr = Array.isArray(sp.steps) ? sp.steps : [];
        const exists = stepsArr.some((s) => s.name === stepName);
        const newSteps = exists
          ? stepsArr.map((s) => (s.name === stepName ? { ...s, [field]: newValue } : s))
          : [...stepsArr, { name: stepName, [field]: newValue }];
        return { ...sp, steps: newSteps };
      });
      return { ...prev, [parameterId]: updated };
    });
  };

  const handleAddCalculationORS = (parameterId: number) => {
    setCalculationsORSPerParam((prev) => {
      const current = prev[parameterId] || [];
      const newIndex = current.length;
      return {
        ...prev,
        [parameterId]: [
          ...current,
          createNewCalculationORS(newIndex),
        ],
      };
    });
  };

  const handleRemoveCalculationORS = (
    parameterId: number,
    calcId: number,
  ) => {
    setCalculationsORSPerParam((prev) => {
      const updated = (prev[parameterId] || [])
        .filter((c) => c.id !== calcId)
        .map((c, idx) => ({
          ...c,
          label: `Calculation ${idx + 1}`,
        }));
      return { ...prev, [parameterId]: updated };
    });
  };

  const handleUpdateCalculationORS = (
    parameterId: number,
    updatedCalc: CalculationORS,
  ) => {
    setCalculationsORSPerParam((prev) => ({
      ...prev,
      [parameterId]: (prev[parameterId] || []).map((c) =>
        c.id === updatedCalc.id ? updatedCalc : c,
      ),
    }));
  };

  const handleAddSamplePreparationAnofer = (parameterId: number) => {
    setSamplePreparationAnoferPerParam((prev) => {
      const current = prev[parameterId] || [];
      const newIndex = current.length;
      return {
        ...prev,
        [parameterId]: [
          ...current,
          createNewSamplePreparationAnofer(newIndex),
        ],
      };
    });
  };

  const handleAddStandardPreparationAnofer = (parameterId: number) => {
    setStandardPreparationMetalPerParam((prev) => {
      const current = prev[parameterId]?.["anofer"] || [];
      return {
        ...prev,
        [parameterId]: {
          ...(prev[parameterId] || {}),
          anofer: [...current, createNewStandardPreparationMetal(current.length)],
        },
      };
    });
  };

  const handleRemoveSamplePreparationAnofer = (
    parameterId: number,
    prepId: number,
  ) => {
    setSamplePreparationAnoferPerParam((prev) => {
      const updated = (prev[parameterId] || [])
        .filter((p) => p.id !== prepId)
        .map((p, idx) => ({
          ...p,
          label: `Sample Preparation ${idx + 1}`,
        }));
      return { ...prev, [parameterId]: updated };
    });
  };

  const handleRemoveStandardPreparationAnofer = (
    parameterId: number,
    prepId: number,
  ) => {
    setStandardPreparationMetalPerParam((prev) => {
      const current = prev[parameterId]?.["anofer"] || [];
      const updated = current
        .filter((p) => p.id !== prepId)
        .map((p, i) => ({ ...p, label: `Standard Preparation ${i + 1}` }));
      return {
        ...prev,
        [parameterId]: { ...(prev[parameterId] || {}), anofer: updated },
      };
    });
  };

  const handleSamplePreparationAnoferStepChange = (
    parameterId: number,
    samplePreparationId: number,
    stepName: SamplePreparationMetalStep["name"],
    field: "value1" | "unit1" | "value2" | "unit2" | "logBookID" | "solventChemical",
    newValue: string,
  ) => {
    setSamplePreparationAnoferPerParam((prev) => {
      const list = prev[parameterId] || [];
      const updated = list.map((sp) => {
        if (sp.id !== samplePreparationId) return sp;
        const stepsArr = Array.isArray(sp.steps) ? sp.steps : [];
        const exists = stepsArr.some((s) => s.name === stepName);
        const newSteps = exists
          ? stepsArr.map((s) => (s.name === stepName ? { ...s, [field]: newValue } : s))
          : [...stepsArr, { name: stepName, [field]: newValue }];
        return { ...sp, steps: newSteps };
      });
      return { ...prev, [parameterId]: updated };
    });
  };

  const handleAddCalculationAnofer = (parameterId: number) => {
    setCalculationsAnoferPerParam((prev) => {
      const current = prev[parameterId] || [];
      const newIndex = current.length;
      return {
        ...prev,
        [parameterId]: [
          ...current,
          createNewCalculationAnofer(newIndex),
        ],
      };
    });
  };

  const handleRemoveCalculationAnofer = (
    parameterId: number,
    calcId: number,
  ) => {
    setCalculationsAnoferPerParam((prev) => {
      const updated = (prev[parameterId] || [])
        .filter((c) => c.id !== calcId)
        .map((c, idx) => ({
          ...c,
          label: `Calculation ${idx + 1}`,
        }));
      return { ...prev, [parameterId]: updated };
    });
  };

  const handleUpdateCalculationAnofer = (
    parameterId: number,
    updatedCalc: CalculationAnofer,
  ) => {
    setCalculationsAnoferPerParam((prev) => ({
      ...prev,
      [parameterId]: (prev[parameterId] || []).map((c) =>
        c.id === updatedCalc.id ? updatedCalc : c,
      ),
    }));
  };

  const handleAddSamplePreparationZptoShampoo = (parameterId: number) => {
    setSamplePreparationZptoShampooPerParam((prev) => {
      const current = prev[parameterId] || [];
      const newIndex = current.length;
      return {
        ...prev,
        [parameterId]: [
          ...current,
          createNewSamplePreparationZptoShampoo(newIndex),
        ],
      };
    });
  };

  const handleAddStandardPreparationZptoShampoo = (parameterId: number) => {
    setStandardPreparationMetalPerParam((prev) => {
      const current = prev[parameterId]?.["zptoShampoo"] || [];
      return {
        ...prev,
        [parameterId]: {
          ...(prev[parameterId] || {}),
          zptoShampoo: [...current, createNewStandardPreparationMetal(current.length)],
        },
      };
    });
  };

  const handleRemoveSamplePreparationZptoShampoo = (
    parameterId: number,
    prepId: number,
  ) => {
    setSamplePreparationZptoShampooPerParam((prev) => {
      const updated = (prev[parameterId] || [])
        .filter((p) => p.id !== prepId)
        .map((p, idx) => ({
          ...p,
          label: `Sample Preparation ${idx + 1}`,
        }));
      return { ...prev, [parameterId]: updated };
    });
  };

  const handleRemoveStandardPreparationZptoShampoo = (
    parameterId: number,
    prepId: number,
  ) => {
    setStandardPreparationMetalPerParam((prev) => {
      const current = prev[parameterId]?.["zptoShampoo"] || [];
      const updated = current
        .filter((p) => p.id !== prepId)
        .map((p, i) => ({ ...p, label: `Standard Preparation ${i + 1}` }));
      return {
        ...prev,
        [parameterId]: { ...(prev[parameterId] || {}), zptoShampoo: updated },
      };
    });
  };

  const handleSamplePreparationZptoShampooStepChange = (
    parameterId: number,
    samplePreparationId: number,
    stepName: SamplePreparationMetalStep["name"],
    field: "value1" | "unit1" | "value2" | "unit2" | "logBookID" | "solventChemical",
    newValue: string,
  ) => {
    setSamplePreparationZptoShampooPerParam((prev) => {
      const list = prev[parameterId] || [];
      const updated = list.map((sp) => {
        if (sp.id !== samplePreparationId) return sp;
        const stepsArr = Array.isArray(sp.steps) ? sp.steps : [];
        const exists = stepsArr.some((s) => s.name === stepName);
        const newSteps = exists
          ? stepsArr.map((s) => (s.name === stepName ? { ...s, [field]: newValue } : s))
          : [...stepsArr, { name: stepName, [field]: newValue }];
        return { ...sp, steps: newSteps };
      });
      return { ...prev, [parameterId]: updated };
    });
  };

  const handleAddCalculationZptoShampoo = (parameterId: number) => {
    setCalculationsZptoShampooPerParam((prev) => {
      const current = prev[parameterId] || [];
      const newIndex = current.length;
      return {
        ...prev,
        [parameterId]: [
          ...current,
          createNewCalculationZptoShampoo(newIndex),
        ],
      };
    });
  };

  const handleRemoveCalculationZptoShampoo = (
    parameterId: number,
    calcId: number,
  ) => {
    setCalculationsZptoShampooPerParam((prev) => {
      const updated = (prev[parameterId] || [])
        .filter((c) => c.id !== calcId)
        .map((c, idx) => ({
          ...c,
          label: `Calculation ${idx + 1}`,
        }));
      return { ...prev, [parameterId]: updated };
    });
  };

  const handleUpdateCalculationZptoShampoo = (
    parameterId: number,
    updatedCalc: CalculationZptoShampoo,
  ) => {
    setCalculationsZptoShampooPerParam((prev) => ({
      ...prev,
      [parameterId]: (prev[parameterId] || []).map((c) =>
        c.id === updatedCalc.id ? updatedCalc : c,
      ),
    }));
  };

  const handleAddSamplePreparationSodiumLactate = (parameterId: number) => {
    setSamplePreparationSodiumLactatePerParam((prev) => {
      const current = prev[parameterId] || [];
      const newIndex = current.length;
      return {
        ...prev,
        [parameterId]: [
          ...current,
          createNewSamplePreparationSodiumLactate(newIndex),
        ],
      };
    });
  };

  const handleAddStandardPreparationSodiumLactate = (parameterId: number) => {
    setStandardPreparationMetalPerParam((prev) => {
      const current = prev[parameterId]?.["sodiumLactate"] || [];
      return {
        ...prev,
        [parameterId]: {
          ...(prev[parameterId] || {}),
          sodiumLactate: [...current, createNewStandardPreparationMetal(current.length)],
        },
      };
    });
  };

  const handleRemoveSamplePreparationSodiumLactate = (
    parameterId: number,
    prepId: number,
  ) => {
    setSamplePreparationSodiumLactatePerParam((prev) => {
      const updated = (prev[parameterId] || [])
        .filter((p) => p.id !== prepId)
        .map((p, idx) => ({
          ...p,
          label: `Sample Preparation ${idx + 1}`,
        }));
      return { ...prev, [parameterId]: updated };
    });
  };

  const handleRemoveStandardPreparationSodiumLactate = (
    parameterId: number,
    prepId: number,
  ) => {
    setStandardPreparationMetalPerParam((prev) => {
      const current = prev[parameterId]?.["sodiumLactate"] || [];
      const updated = current
        .filter((p) => p.id !== prepId)
        .map((p, i) => ({ ...p, label: `Standard Preparation ${i + 1}` }));
      return {
        ...prev,
        [parameterId]: { ...(prev[parameterId] || {}), sodiumLactate: updated },
      };
    });
  };

  const handleSamplePreparationSodiumLactateStepChange = (
    parameterId: number,
    samplePreparationId: number,
    stepName: SamplePreparationMetalStep["name"],
    field: "value1" | "unit1" | "value2" | "unit2" | "logBookID" | "solventChemical",
    newValue: string,
  ) => {
    setSamplePreparationSodiumLactatePerParam((prev) => {
      const list = prev[parameterId] || [];
      const updated = list.map((sp) => {
        if (sp.id !== samplePreparationId) return sp;
        const stepsArr = Array.isArray(sp.steps) ? sp.steps : [];
        const exists = stepsArr.some((s) => s.name === stepName);
        const newSteps = exists
          ? stepsArr.map((s) => (s.name === stepName ? { ...s, [field]: newValue } : s))
          : [...stepsArr, { name: stepName, [field]: newValue }];
        return { ...sp, steps: newSteps };
      });
      return { ...prev, [parameterId]: updated };
    });
  };

  const handleAddCalculationSodiumLactate = (parameterId: number) => {
    setCalculationsSodiumLactatePerParam((prev) => {
      const current = prev[parameterId] || [];
      const newIndex = current.length;
      return {
        ...prev,
        [parameterId]: [
          ...current,
          createNewCalculationSodiumLactate(newIndex),
        ],
      };
    });
  };

  const handleRemoveCalculationSodiumLactate = (
    parameterId: number,
    calcId: number,
  ) => {
    setCalculationsSodiumLactatePerParam((prev) => {
      const updated = (prev[parameterId] || [])
        .filter((c) => c.id !== calcId)
        .map((c, idx) => ({
          ...c,
          label: `Calculation ${idx + 1}`,
        }));
      return { ...prev, [parameterId]: updated };
    });
  };

  const handleUpdateCalculationSodiumLactate = (
    parameterId: number,
    updatedCalc: CalculationSodiumLactate,
  ) => {
    setCalculationsSodiumLactatePerParam((prev) => ({
      ...prev,
      [parameterId]: (prev[parameterId] || []).map((c) =>
        c.id === updatedCalc.id ? updatedCalc : c,
      ),
    }));
  };

  const handleAddSamplePreparationLithosun300 = (parameterId: number) => {
    setSamplePreparationLithosun300PerParam((prev) => {
      const current = prev[parameterId] || [];
      const newIndex = current.length;
      return {
        ...prev,
        [parameterId]: [
          ...current,
          createNewSamplePreparationLithosun300(newIndex),
        ],
      };
    });
  };

  const handleAddStandardPreparationLithosun300 = (parameterId: number) => {
    setStandardPreparationMetalPerParam((prev) => {
      const current = prev[parameterId]?.["lithosun300"] || [];
      return {
        ...prev,
        [parameterId]: {
          ...(prev[parameterId] || {}),
          lithosun300: [...current, createNewStandardPreparationMetal(current.length)],
        },
      };
    });
  };

  const handleRemoveSamplePreparationLithosun300 = (
    parameterId: number,
    prepId: number,
  ) => {
    setSamplePreparationLithosun300PerParam((prev) => {
      const updated = (prev[parameterId] || [])
        .filter((p) => p.id !== prepId)
        .map((p, idx) => ({
          ...p,
          label: `Sample Preparation ${idx + 1}`,
        }));
      return { ...prev, [parameterId]: updated };
    });
  };

  const handleRemoveStandardPreparationLithosun300 = (
    parameterId: number,
    prepId: number,
  ) => {
    setStandardPreparationMetalPerParam((prev) => {
      const current = prev[parameterId]?.["lithosun300"] || [];
      const updated = current
        .filter((p) => p.id !== prepId)
        .map((p, i) => ({ ...p, label: `Standard Preparation ${i + 1}` }));
      return {
        ...prev,
        [parameterId]: { ...(prev[parameterId] || {}), lithosun300: updated },
      };
    });
  };

  const handleSamplePreparationLithosun300StepChange = (
    parameterId: number,
    samplePreparationId: number,
    stepName: SamplePreparationMetalStep["name"],
    field: "value1" | "unit1" | "value2" | "unit2" | "logBookID" | "solventChemical",
    newValue: string,
  ) => {
    setSamplePreparationLithosun300PerParam((prev) => {
      const list = prev[parameterId] || [];
      const updated = list.map((sp) => {
        if (sp.id !== samplePreparationId) return sp;
        const stepsArr = Array.isArray(sp.steps) ? sp.steps : [];
        const exists = stepsArr.some((s) => s.name === stepName);
        const newSteps = exists
          ? stepsArr.map((s) => (s.name === stepName ? { ...s, [field]: newValue } : s))
          : [...stepsArr, { name: stepName, [field]: newValue }];
        return { ...sp, steps: newSteps };
      });
      return { ...prev, [parameterId]: updated };
    });
  };

  const handleAddCalculationLithosun300 = (parameterId: number) => {
    setCalculationsLithosun300PerParam((prev) => {
      const current = prev[parameterId] || [];
      const newIndex = current.length;
      return {
        ...prev,
        [parameterId]: [
          ...current,
          createNewCalculationLithosun300(newIndex),
        ],
      };
    });
  };

  const handleRemoveCalculationLithosun300 = (
    parameterId: number,
    calcId: number,
  ) => {
    setCalculationsLithosun300PerParam((prev) => {
      const updated = (prev[parameterId] || [])
        .filter((c) => c.id !== calcId)
        .map((c, idx) => ({
          ...c,
          label: `Calculation ${idx + 1}`,
        }));
      return { ...prev, [parameterId]: updated };
    });
  };

  const handleUpdateCalculationLithosun300 = (
    parameterId: number,
    updatedCalc: CalculationLithosun300,
  ) => {
    setCalculationsLithosun300PerParam((prev) => ({
      ...prev,
      [parameterId]: (prev[parameterId] || []).map((c) =>
        c.id === updatedCalc.id ? updatedCalc : c,
      ),
    }));
  };

  const handleAddSamplePreparationLithosun400 = (parameterId: number) => {
    setSamplePreparationLithosun400PerParam((prev) => {
      const current = prev[parameterId] || [];
      const newIndex = current.length;
      return {
        ...prev,
        [parameterId]: [
          ...current,
          createNewSamplePreparationLithosun400(newIndex),
        ],
      };
    });
  };

  const handleAddStandardPreparationLithosun400 = (parameterId: number) => {
    setStandardPreparationMetalPerParam((prev) => {
      const current = prev[parameterId]?.["lithosun400"] || [];
      return {
        ...prev,
        [parameterId]: {
          ...(prev[parameterId] || {}),
          lithosun400: [...current, createNewStandardPreparationMetal(current.length)],
        },
      };
    });
  };

  const handleRemoveSamplePreparationLithosun400 = (
    parameterId: number,
    prepId: number,
  ) => {
    setSamplePreparationLithosun400PerParam((prev) => {
      const updated = (prev[parameterId] || [])
        .filter((p) => p.id !== prepId)
        .map((p, idx) => ({
          ...p,
          label: `Sample Preparation ${idx + 1}`,
        }));
      return { ...prev, [parameterId]: updated };
    });
  };

  const handleRemoveStandardPreparationLithosun400 = (
    parameterId: number,
    prepId: number,
  ) => {
    setStandardPreparationMetalPerParam((prev) => {
      const current = prev[parameterId]?.["lithosun400"] || [];
      const updated = current
        .filter((p) => p.id !== prepId)
        .map((p, i) => ({ ...p, label: `Standard Preparation ${i + 1}` }));
      return {
        ...prev,
        [parameterId]: { ...(prev[parameterId] || {}), lithosun400: updated },
      };
    });
  };

  const handleSamplePreparationLithosun400StepChange = (
    parameterId: number,
    samplePreparationId: number,
    stepName: SamplePreparationMetalStep["name"],
    field: "value1" | "unit1" | "value2" | "unit2" | "logBookID" | "solventChemical",
    newValue: string,
  ) => {
    setSamplePreparationLithosun400PerParam((prev) => {
      const list = prev[parameterId] || [];
      const updated = list.map((sp) => {
        if (sp.id !== samplePreparationId) return sp;
        const stepsArr = Array.isArray(sp.steps) ? sp.steps : [];
        const exists = stepsArr.some((s) => s.name === stepName);
        const newSteps = exists
          ? stepsArr.map((s) => (s.name === stepName ? { ...s, [field]: newValue } : s))
          : [...stepsArr, { name: stepName, [field]: newValue }];
        return { ...sp, steps: newSteps };
      });
      return { ...prev, [parameterId]: updated };
    });
  };

  const handleAddCalculationLithosun400 = (parameterId: number) => {
    setCalculationsLithosun400PerParam((prev) => {
      const current = prev[parameterId] || [];
      const newIndex = current.length;
      return {
        ...prev,
        [parameterId]: [
          ...current,
          createNewCalculationLithosun400(newIndex),
        ],
      };
    });
  };

  const handleRemoveCalculationLithosun400 = (
    parameterId: number,
    calcId: number,
  ) => {
    setCalculationsLithosun400PerParam((prev) => {
      const updated = (prev[parameterId] || [])
        .filter((c) => c.id !== calcId)
        .map((c, idx) => ({
          ...c,
          label: `Calculation ${idx + 1}`,
        }));
      return { ...prev, [parameterId]: updated };
    });
  };

  const handleUpdateCalculationLithosun400 = (
    parameterId: number,
    updatedCalc: CalculationLithosun400,
  ) => {
    setCalculationsLithosun400PerParam((prev) => ({
      ...prev,
      [parameterId]: (prev[parameterId] || []).map((c) =>
        c.id === updatedCalc.id ? updatedCalc : c,
      ),
    }));
  };


  const handleAddSamplePreparationMeropenam = (parameterId: number) => {
    setSamplePreparationMeropenamPerParam((prev) => {
      const current = prev[parameterId] || [];
      const newIndex = current.length;
      return {
        ...prev,
        [parameterId]: [
          ...current,
          createNewSamplePreparationMeropenam(newIndex),
        ],
      };
    });
  };

  const handleAddStandardPreparationMeropenam = (parameterId: number) => {
    setStandardPreparationMetalPerParam((prev) => {
      const current = prev[parameterId]?.["meropenam"] || [];
      return {
        ...prev,
        [parameterId]: {
          ...(prev[parameterId] || {}),
          meropenam: [...current, createNewStandardPreparationMetal(current.length)],
        },
      };
    });
  };

  const handleRemoveSamplePreparationMeropenam = (
    parameterId: number,
    prepId: number,
  ) => {
    setSamplePreparationMeropenamPerParam((prev) => {
      const updated = (prev[parameterId] || [])
        .filter((p) => p.id !== prepId)
        .map((p, idx) => ({
          ...p,
          label: `Sample Preparation ${idx + 1}`,
        }));
      return { ...prev, [parameterId]: updated };
    });
  };

  const handleRemoveStandardPreparationMeropenam = (
    parameterId: number,
    prepId: number,
  ) => {
    setStandardPreparationMetalPerParam((prev) => {
      const current = prev[parameterId]?.["meropenam"] || [];
      const updated = current
        .filter((p) => p.id !== prepId)
        .map((p, i) => ({ ...p, label: `Standard Preparation ${i + 1}` }));
      return {
        ...prev,
        [parameterId]: { ...(prev[parameterId] || {}), meropenam: updated },
      };
    });
  };

  const handleSamplePreparationMeropenamStepChange = (
    parameterId: number,
    samplePreparationId: number,
    stepName: SamplePreparationMetalStep["name"],
    field: "value1" | "unit1" | "value2" | "unit2" | "logBookID" | "solventChemical",
    newValue: string,
  ) => {
    setSamplePreparationMeropenamPerParam((prev) => {
      const list = prev[parameterId] || [];
      const updated = list.map((sp) => {
        if (sp.id !== samplePreparationId) return sp;
        const stepsArr = Array.isArray(sp.steps) ? sp.steps : [];
        const exists = stepsArr.some((s) => s.name === stepName);
        const newSteps = exists
          ? stepsArr.map((s) => (s.name === stepName ? { ...s, [field]: newValue } : s))
          : [...stepsArr, { name: stepName, [field]: newValue }];
        return { ...sp, steps: newSteps };
      });
      return { ...prev, [parameterId]: updated };
    });
  };

  const handleAddCalculationMeropenam = (parameterId: number) => {
    setCalculationsMeropenamPerParam((prev) => {
      const current = prev[parameterId] || [];
      const newIndex = current.length;
      return {
        ...prev,
        [parameterId]: [
          ...current,
          createNewCalculationMeropenam(newIndex),
        ],
      };
    });
  };

  const handleRemoveCalculationMeropenam = (
    parameterId: number,
    calcId: number,
  ) => {
    setCalculationsMeropenamPerParam((prev) => {
      const updated = (prev[parameterId] || [])
        .filter((c) => c.id !== calcId)
        .map((c, idx) => ({
          ...c,
          label: `Calculation ${idx + 1}`,
        }));
      return { ...prev, [parameterId]: updated };
    });
  };

  const handleUpdateCalculationMeropenam = (
    parameterId: number,
    updatedCalc: CalculationMeropenam,
  ) => {
    setCalculationsMeropenamPerParam((prev) => ({
      ...prev,
      [parameterId]: (prev[parameterId] || []).map((c) =>
        c.id === updatedCalc.id ? updatedCalc : c,
      ),
    }));
  };

  const handleAddSamplePreparationTalc = (parameterId: number) => {
    setSamplePreparationTalcPerParam((prev) => {
      const current = prev[parameterId] || [];
      const newIndex = current.length;
      return {
        ...prev,
        [parameterId]: [
          ...current,
          createNewSamplePreparationTalc(newIndex),
        ],
      };
    });
  };

  const handleAddStandardPreparationTalc = (parameterId: number) => {
    setStandardPreparationMetalPerParam((prev) => {
      const current = prev[parameterId]?.["talc"] || [];
      return {
        ...prev,
        [parameterId]: {
          ...(prev[parameterId] || {}),
          talc: [...current, createNewStandardPreparationMetal(current.length)],
        },
      };
    });
  };

  const handleRemoveSamplePreparationTalc = (
    parameterId: number,
    prepId: number,
  ) => {
    setSamplePreparationTalcPerParam((prev) => {
      const current = prev[parameterId] || [];
      return { ...prev, [parameterId]: current.filter((p) => p.id !== prepId) };
    });
  };

  const handleRemoveStandardPreparationTalc = (
    parameterId: number,
    prepId: number,
  ) => {
    setStandardPreparationMetalPerParam((prev) => {
      const current = prev[parameterId]?.["talc"] || [];
      const updated = current
        .filter((p) => p.id !== prepId)
        .map((p, i) => ({ ...p, label: `Standard Preparation ${i + 1}` }));
      return {
        ...prev,
        [parameterId]: { ...(prev[parameterId] || {}), talc: updated },
      };
    });
  };

  const handleSamplePreparationTalcStepChange = (
    parameterId: number,
    prepId: number,
    stepName: string,
    field: string,
    value: string,
  ) => {
    setSamplePreparationTalcPerParam((prev) => {
      const current = prev[parameterId] || [];
      return {
        ...prev,
        [parameterId]: current.map((p) =>
          p.id === prepId
            ? {
              ...p,
              steps: p.steps.map((s: SamplePreparationMetalStep) =>
                s.name === stepName ? { ...s, [field]: value } : s,
              ),
            }
            : p,
        ),
      };
    });
  };

  const handleAddCalculationTalc = (parameterId: number) => {
    setCalculationsTalcPerParam((prev) => {
      const current = prev[parameterId] || [];
      return {
        ...prev,
        [parameterId]: [
          ...current,
          createNewCalculationTalc(current.length),
        ],
      };
    });
  };

  const handleRemoveCalculationTalc = (
    parameterId: number,
    calcId: number,
  ) => {
    setCalculationsTalcPerParam((prev) => ({
      ...prev,
      [parameterId]: (prev[parameterId] || []).filter((c) => c.id !== calcId),
    }));
  };

  const handleUpdateCalculationTalc = (
    parameterId: number,
    updatedCalc: CalculationTalc,
  ) => {
    setCalculationsTalcPerParam((prev) => ({
      ...prev,
      [parameterId]: (prev[parameterId] || []).map((c) =>
        c.id === updatedCalc.id ? updatedCalc : c,
      ),
    }));
  };

  const handleAddSamplePreparationSFGC = (parameterId: number) => {
    setSamplePreparationSFGCPerParam((prev) => {
      const current = prev[parameterId] || [];
      const newIndex = current.length;
      return {
        ...prev,
        [parameterId]: [
          ...current,
          createNewSamplePreparationSFGC(newIndex),
        ],
      };
    });
  };

  const handleAddStandardPreparationSFGC = (parameterId: number) => {
    setStandardPreparationMetalPerParam((prev) => {
      const current = prev[parameterId]?.["sfgc"] || [];
      return {
        ...prev,
        [parameterId]: {
          ...(prev[parameterId] || {}),
          sfgc: [...current, createNewStandardPreparationMetal(current.length)],
        },
      };
    });
  };

  const handleRemoveSamplePreparationSFGC = (
    parameterId: number,
    prepId: number,
  ) => {
    setSamplePreparationSFGCPerParam((prev) => {
      const updated = (prev[parameterId] || [])
        .filter((p) => p.id !== prepId)
        .map((p, idx) => ({
          ...p,
          label: `Sample Preparation ${idx + 1}`,
        }));
      return { ...prev, [parameterId]: updated };
    });
  };

  const handleRemoveStandardPreparationSFGC = (
    parameterId: number,
    prepId: number,
  ) => {
    setStandardPreparationMetalPerParam((prev) => {
      const current = prev[parameterId]?.["sfgc"] || [];
      const updated = current
        .filter((p) => p.id !== prepId)
        .map((p, i) => ({ ...p, label: `Standard Preparation ${i + 1}` }));
      return {
        ...prev,
        [parameterId]: { ...(prev[parameterId] || {}), sfgc: updated },
      };
    });
  };

  const handleSamplePreparationSFGCStepChange = (
    parameterId: number,
    samplePreparationId: number,
    stepName: SamplePreparationMetalStep["name"],
    field: "value1" | "unit1" | "value2" | "unit2" | "logBookID" | "solventChemical",
    newValue: string,
  ) => {
    setSamplePreparationSFGCPerParam((prev) => {
      const list = prev[parameterId] || [];
      const updated = list.map((sp) => {
        if (sp.id !== samplePreparationId) return sp;
        const stepsArr = Array.isArray(sp.steps) ? sp.steps : [];
        const exists = stepsArr.some((s) => s.name === stepName);
        const newSteps = exists
          ? stepsArr.map((s) => (s.name === stepName ? { ...s, [field]: newValue } : s))
          : [...stepsArr, { name: stepName, [field]: newValue }];
        return { ...sp, steps: newSteps };
      });
      return { ...prev, [parameterId]: updated };
    });
  };

  const handleAddCalculationSFGC = (parameterId: number) => {
    setCalculationsSFGCPerParam((prev) => {
      const current = prev[parameterId] || [];
      const newIndex = current.length;
      return {
        ...prev,
        [parameterId]: [
          ...current,
          createNewCalculationSFGC(newIndex),
        ],
      };
    });
  };

  const handleRemoveCalculationSFGC = (
    parameterId: number,
    calcId: number,
  ) => {
    setCalculationsSFGCPerParam((prev) => {
      const updated = (prev[parameterId] || [])
        .filter((c) => c.id !== calcId)
        .map((c, idx) => ({
          ...c,
          label: `Calculation ${idx + 1}`,
        }));
      return { ...prev, [parameterId]: updated };
    });
  };

  const handleUpdateCalculationSFGC = (
    parameterId: number,
    updatedCalc: CalculationSFGC,
  ) => {
    setCalculationsSFGCPerParam((prev) => ({
      ...prev,
      [parameterId]: (prev[parameterId] || []).map((c) =>
        c.id === updatedCalc.id ? updatedCalc : c,
      ),
    }));
  };


  const handleStandardPreparationMetalStepChange = (
    parameterId: number,
    groupId: string,
    samplePreparationId: number,
    stepName: StandardPreparationMetalStep["name"],
    field: "value1" | "unit1" | "value2" | "unit2" | "logBookID" | "solventChemical",
    newValue: string,
  ) => {
    setStandardPreparationMetalPerParam((prev) => {
      const paramGroups = prev[parameterId] || {};
      const list = paramGroups[groupId] || [];
      const updated = list.map((sp) => {
        if (sp.id !== samplePreparationId) return sp;
        const stepsArr = Array.isArray(sp.steps) ? sp.steps : [];
        const exists = stepsArr.some((s) => s.name === stepName);
        const newSteps = exists
          ? stepsArr.map((s) => (s.name === stepName ? { ...s, [field]: newValue } : s))
          : [...stepsArr, { name: stepName, [field]: newValue }];
        return { ...sp, steps: newSteps };
      });
      return {
        ...prev,
        [parameterId]: { ...paramGroups, [groupId]: updated },
      };
    });
  };

  const handleTogglePreparationGroup = (
    parameterId: number,
    groupId: string,
  ) => {
    setActivePreparationGroups((prev) => {
      const currentGroups = prev[parameterId] || [];

      if (currentGroups.includes(groupId)) {
        if (groupId === "icpmsFood") {
          setSamplePreparationIcpmsPerParam((p) => {
            const { [parameterId]: _omit, ...rest } = p;
            return rest;
          });
          setCalculationsIcpmsPerParam((p) => {
            const { [parameterId]: _omit, ...rest } = p;
            return rest;
          });
        }
        if (groupId === "icpoesFood") {
          setSamplePreparationIcpoesPerParam((p) => {
            const { [parameterId]: _omit, ...rest } = p;
            return rest;
          });
          setCalculationsIcpoesPerParam((p) => {
            const { [parameterId]: _omit, ...rest } = p;
            return rest;
          });
        }
        if (groupId === "icpmsWater") {
          setSamplePreparationIcpmsWaterPerParam((p) => {
            const { [parameterId]: _omit, ...rest } = p;
            return rest;
          });
          setCalculationsIcpmsWaterPerParam((p) => {
            const { [parameterId]: _omit, ...rest } = p;
            return rest;
          });
        }
        if (groupId === "icpoesWater") {
          setSamplePreparationIcpoesWaterPerParam((p) => {
            const { [parameterId]: _omit, ...rest } = p;
            return rest;
          });
          setCalculationsIcpoesWaterPerParam((p) => {
            const { [parameterId]: _omit, ...rest } = p;
            return rest;
          });
        }
        if (groupId === "aasWater") {
          setSamplePreparationAasWaterPerParam((p) => {
            const { [parameterId]: _omit, ...rest } = p;
            return rest;
          });
          setCalculationsAasWaterPerParam((p) => {
            const { [parameterId]: _omit, ...rest } = p;
            return rest;
          });
        }
        if (groupId === "icpmsIchQ3D") {
          setSamplePreparationIcpmsIchQ3DPerParam((p) => {
            const { [parameterId]: _omit, ...rest } = p;
            return rest;
          });
          setCalculationsIcpmsIchQ3DPerParam((p) => {
            const { [parameterId]: _omit, ...rest } = p;
            return rest;
          });
        }
        if (groupId === "ors") {
          setSamplePreparationORSPerParam((p) => {
            const { [parameterId]: _omit, ...rest } = p;
            return rest;
          });
          setCalculationsORSPerParam((p) => {
            const { [parameterId]: _omit, ...rest } = p;
            return rest;
          });
        }
        if (groupId === "anofer") {
          setSamplePreparationAnoferPerParam((p) => {
            const { [parameterId]: _omit, ...rest } = p;
            return rest;
          });
          setCalculationsAnoferPerParam((p) => {
            const { [parameterId]: _omit, ...rest } = p;
            return rest;
          });
        }
        if (groupId === "zptoShampoo") {
          setSamplePreparationZptoShampooPerParam((p) => {
            const { [parameterId]: _omit, ...rest } = p;
            return rest;
          });
          setCalculationsZptoShampooPerParam((p) => {
            const { [parameterId]: _omit, ...rest } = p;
            return rest;
          });
        }
        if (groupId === "sodiumLactate") {
          setSamplePreparationSodiumLactatePerParam((p) => {
            const { [parameterId]: _omit, ...rest } = p;
            return rest;
          });
          setCalculationsSodiumLactatePerParam((p) => {
            const { [parameterId]: _omit, ...rest } = p;
            return rest;
          });
        }
        if (groupId === "lithosun300") {
          setSamplePreparationLithosun300PerParam((p) => {
            const { [parameterId]: _omit, ...rest } = p;
            return rest;
          });
          setCalculationsLithosun300PerParam((p) => {
            const { [parameterId]: _omit, ...rest } = p;
            return rest;
          });
        }
        if (groupId === "lithosun400") {
          setSamplePreparationLithosun400PerParam((p) => {
            const { [parameterId]: _omit, ...rest } = p;
            return rest;
          });
          setCalculationsLithosun400PerParam((p) => {
            const { [parameterId]: _omit, ...rest } = p;
            return rest;
          });
        }
        if (groupId === "meropenam") {
          setSamplePreparationMeropenamPerParam((p) => {
            const { [parameterId]: _omit, ...rest } = p;
            return rest;
          });
          setCalculationsMeropenamPerParam((p) => {
            const { [parameterId]: _omit, ...rest } = p;
            return rest;
          });
        }
        if (groupId === "sfgc") {
          setSamplePreparationSFGCPerParam((p) => {
            const { [parameterId]: _omit, ...rest } = p;
            return rest;
          });
          setCalculationsSFGCPerParam((p) => {
            const { [parameterId]: _omit, ...rest } = p;
            return rest;
          });
        }
        if (groupId === "talc") {
          setSamplePreparationTalcPerParam((p) => {
            const { [parameterId]: _omit, ...rest } = p;
            return rest;
          });
          setCalculationsTalcPerParam((p) => {
            const { [parameterId]: _omit, ...rest } = p;
            return rest;
          });
        }
        if (groupId === "blankPreparation") {
          setBlankPreparationPerParam((p) => {
            const { [parameterId]: _omit, ...rest } = p;
            return rest;
          });
        }
        // Clear standard metal preps for this group (only for non-blank groups)
        if (groupId !== "blankPreparation") {
          setStandardPreparationMetalPerParam((p) => {
            const paramData = p[parameterId];
            if (!paramData) return p;
            const { [groupId]: _omit, ...remaining } = paramData;
            return { ...p, [parameterId]: remaining };
          });
        }
        return {
          ...prev,
          [parameterId]: currentGroups.filter((g) => g !== groupId),
        };
      }

      // ── Single-select: clear ALL data for each replaced group ──────────────
      const clearGroupData = (oldGroupId: string) => {
        if (oldGroupId === "icpmsFood") {
          setSamplePreparationIcpmsPerParam((p) => { const { [parameterId]: _o, ...r } = p; return r; });
          setCalculationsIcpmsPerParam((p) => { const { [parameterId]: _o, ...r } = p; return r; });
        }
        if (oldGroupId === "icpoesFood") {
          setSamplePreparationIcpoesPerParam((p) => { const { [parameterId]: _o, ...r } = p; return r; });
          setCalculationsIcpoesPerParam((p) => { const { [parameterId]: _o, ...r } = p; return r; });
        }
        if (oldGroupId === "icpmsWater") {
          setSamplePreparationIcpmsWaterPerParam((p) => { const { [parameterId]: _o, ...r } = p; return r; });
          setCalculationsIcpmsWaterPerParam((p) => { const { [parameterId]: _o, ...r } = p; return r; });
        }
        if (oldGroupId === "icpoesWater") {
          setSamplePreparationIcpoesWaterPerParam((p) => { const { [parameterId]: _o, ...r } = p; return r; });
          setCalculationsIcpoesWaterPerParam((p) => { const { [parameterId]: _o, ...r } = p; return r; });
        }
        if (oldGroupId === "aasWater") {
          setSamplePreparationAasWaterPerParam((p) => { const { [parameterId]: _o, ...r } = p; return r; });
          setCalculationsAasWaterPerParam((p) => { const { [parameterId]: _o, ...r } = p; return r; });
        }
        if (oldGroupId === "icpmsIchQ3D") {
          setSamplePreparationIcpmsIchQ3DPerParam((p) => { const { [parameterId]: _o, ...r } = p; return r; });
          setCalculationsIcpmsIchQ3DPerParam((p) => { const { [parameterId]: _o, ...r } = p; return r; });
        }
        if (oldGroupId === "ors") {
          setSamplePreparationORSPerParam((p) => { const { [parameterId]: _o, ...r } = p; return r; });
          setCalculationsORSPerParam((p) => { const { [parameterId]: _o, ...r } = p; return r; });
        }
        if (oldGroupId === "anofer") {
          setSamplePreparationAnoferPerParam((p) => { const { [parameterId]: _o, ...r } = p; return r; });
          setCalculationsAnoferPerParam((p) => { const { [parameterId]: _o, ...r } = p; return r; });
        }
        if (oldGroupId === "zptoShampoo") {
          setSamplePreparationZptoShampooPerParam((p) => { const { [parameterId]: _o, ...r } = p; return r; });
          setCalculationsZptoShampooPerParam((p) => { const { [parameterId]: _o, ...r } = p; return r; });
        }
        if (oldGroupId === "sodiumLactate") {
          setSamplePreparationSodiumLactatePerParam((p) => { const { [parameterId]: _o, ...r } = p; return r; });
          setCalculationsSodiumLactatePerParam((p) => { const { [parameterId]: _o, ...r } = p; return r; });
        }
        if (oldGroupId === "lithosun300") {
          setSamplePreparationLithosun300PerParam((p) => { const { [parameterId]: _o, ...r } = p; return r; });
          setCalculationsLithosun300PerParam((p) => { const { [parameterId]: _o, ...r } = p; return r; });
        }
        if (oldGroupId === "lithosun400") {
          setSamplePreparationLithosun400PerParam((p) => { const { [parameterId]: _o, ...r } = p; return r; });
          setCalculationsLithosun400PerParam((p) => { const { [parameterId]: _o, ...r } = p; return r; });
        }
        if (oldGroupId === "meropenam") {
          setSamplePreparationMeropenamPerParam((p) => { const { [parameterId]: _o, ...r } = p; return r; });
          setCalculationsMeropenamPerParam((p) => { const { [parameterId]: _o, ...r } = p; return r; });
        }
        if (oldGroupId === "sfgc") {
          setSamplePreparationSFGCPerParam((p) => { const { [parameterId]: _o, ...r } = p; return r; });
          setCalculationsSFGCPerParam((p) => { const { [parameterId]: _o, ...r } = p; return r; });
        }
        if (oldGroupId === "talc") {
          setSamplePreparationTalcPerParam((p) => { const { [parameterId]: _o, ...r } = p; return r; });
          setCalculationsTalcPerParam((p) => { const { [parameterId]: _o, ...r } = p; return r; });
        }
        if (oldGroupId === "blankPreparation") {
          setBlankPreparationPerParam((p) => { const { [parameterId]: _o, ...r } = p; return r; });
          return; // blankPreparation has no standard metal preps to clear
        }
        // Clear standard metal preps for this group
        setStandardPreparationMetalPerParam((p) => {
          const paramData = p[parameterId];
          if (!paramData) return p;
          const { [oldGroupId]: _omit, ...remaining } = paramData;
          return { ...p, [parameterId]: remaining };
        });
        // Clear group prep completion timestamp
        setGroupPrepCompletedAtPerParam((p) => {
          const paramData = p[parameterId];
          if (!paramData) return p;
          const { [oldGroupId]: _omit, ...remaining } = paramData;
          return { ...p, [parameterId]: remaining };
        });
        // Clear parameter-level completion
        setPreparationCompletedByPerParam((p) => { const { [parameterId]: _, ...r } = p; return r; });
        setPreparationCompletedAtPerParam((p) => { const { [parameterId]: _, ...r } = p; return r; });
      };

      // ── Blank is additive: it coexists with any other prep group ──────────
      if (groupId === "blankPreparation") {
        return {
          ...prev,
          [parameterId]: [...currentGroups, "blankPreparation"],
        };
      }

      // For all other groups: single-select — clear non-blank groups first
      currentGroups
        .filter((g) => g !== "blankPreparation")
        .forEach(clearGroupData);

      // Keep blankPreparation in the list if it was already active
      const keepBlank = currentGroups.includes("blankPreparation")
        ? ["blankPreparation"]
        : [];

      return {
        ...prev,
        [parameterId]: [...keepBlank, groupId],
      };
    });
    setShowPreparationDropdown({});
  };

  const getAvailablePreparationGroups = () => {
    return [
      { id: "icpmsFood", label: "ICP-MS", color: "emerald" },
      { id: "icpoesFood", label: "ICP-OES", color: "emerald" },
      { id: "icpmsWater", label: "ICP-MS (Water)", color: "emerald" },
      { id: "icpoesWater", label: "ICP-OES (Water)", color: "emerald" },
      { id: "aasWater", label: "AAS (Water)", color: "emerald" },
      { id: "icpmsIchQ3D", label: "ICP-MS (ICH-Q3D)", color: "emerald" },
      { id: "ors", label: "ORS", color: "emerald" },
      { id: "anofer", label: "Anofer", color: "emerald" },
      { id: "zptoShampoo", label: "ZPTO Shampoo", color: "emerald" },
      { id: "sodiumLactate", label: "Sodium Lactate", color: "emerald" },
      { id: "lithosun300", label: "Lithosun 300", color: "emerald" },
      { id: "lithosun400", label: "Lithosun 400", color: "emerald" },
      { id: "talc", label: "Talc", color: "emerald" },
      { id: "meropenam", label: "Meropenam", color: "emerald" },
      { id: "sfgc", label: "SFGC", color: "emerald" },
      { id: "blankPreparation", label: "Blank Preparation", color: "emerald" },
    ];
  };

  // ── Blank Preparation Handlers ────────────────────────────────────────────
  const handleAddBlankPreparation = (parameterId: number) => {
    setShowBlankPreparationDialog((prev) => ({
      ...prev,
      [parameterId]: true,
    }));
    setEditingBlankPrepId(null);
  };

  const handleEditBlankPreparation = (
    parameterId: number,
    blankPrepId: string,
  ) => {
    setEditingBlankPrepId(blankPrepId);
    setShowBlankPreparationDialog((prev) => ({
      ...prev,
      [parameterId]: true,
    }));
  };

  const handleSaveBlankPreparation = (
    parameterId: number,
    label: string,
    content: string,
  ) => {
    if (editingBlankPrepId) {
      setBlankPreparationPerParam((prev) => ({
        ...prev,
        [parameterId]: (prev[parameterId] || []).map((prep) =>
          prep.id === editingBlankPrepId ? { ...prep, label, content } : prep,
        ),
      }));
    } else {
      const newBlankPrep: BlankPreparationModel = {
        id: `blank_${Date.now()}`,
        label,
        content,
      };
      setBlankPreparationPerParam((prev) => ({
        ...prev,
        [parameterId]: [...(prev[parameterId] || []), newBlankPrep],
      }));
    }
    setShowBlankPreparationDialog((prev) => ({
      ...prev,
      [parameterId]: false,
    }));
    setEditingBlankPrepId(null);
  };

  const handleRemoveBlankPreparation = (
    parameterId: number,
    blankPrepId: string,
  ) => {
    setBlankPreparationPerParam((prev) => ({
      ...prev,
      [parameterId]: (prev[parameterId] || []).filter(
        (prep) => prep.id !== blankPrepId,
      ),
    }));
  };

  const LockedParameterOverlay: React.FC<{ parameterId: number }> = React.memo(
    ({ parameterId }) => {
      const status = (
        parameterStatusPerParam[parameterId] || "Created"
      ).toLowerCase();
      const canUnlock = status === "analysis pending";
      const isAnalysisStarted = status === "analysis started";
      const isAnalysisPending = status === "analysis pending";
      const isAnalysisCompleted = status === "analysis completed";
      const isAnalysisRevision = status === "analysis revision" || status === "analysis revision started";
      const isApproved = status === "approved";
      const isCreated = status === "created";
      const param = addedParameters.find((p) => p.id === parameterId);

      // ========== ANALYST VIEW - CREATED (NO OVERLAY - FULLY EDITABLE) ==========
      if (role.toLowerCase() === "analyst" && isCreated) {
        return null; // No overlay needed, fully editable
      }

      // ========== ANALYST VIEW - ANALYSIS PENDING ==========
      if (role.toLowerCase() === "analyst" && isAnalysisPending && param) {
        return (
          <div className="relative mb-8 rounded-2xl overflow-hidden border border-slate-200 shadow-lg bg-white">
            <div className="bg-gradient-to-r from-emerald-50 via-emerald-100 to-emerald-50 px-6 py-5 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-emerald-600 animate-pulse"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                      Analysis Pending - Ready to Start
                    </h3>
                    <p className="text-sm text-slate-600 mt-0.5">
                      Click "Start Analysis" to begin working on this parameter
                    </p>
                  </div>
                </div>

                <motion.button
                  onClick={() => handleStartAnalysis(param)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-5 py-2.5 bg-white/60 backdrop-blur-sm border border-emerald-200 text-emerald-800 text-sm font-semibold rounded-lg hover:bg-white/80 hover:border-emerald-300 transition-all flex items-center gap-2 shadow-sm"
                >
                  <BsPlayFill className="w-5 h-5" />
                  Start Analysis
                </motion.button>
              </div>
            </div>

            <div className="p-6 bg-emerald-50">
              <div className="grid grid-cols-1 gap-4">
                <div className="bg-white border border-slate-200 rounded-xl p-5">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg
                        className="w-5 h-5 text-emerald-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm text-slate-800 mb-2">
                        What happens when you start?
                      </h4>
                      <ul className="text-sm text-slate-600 space-y-2">
                        <li className="flex items-start gap-2">
                          <span className="text-emerald-500 mt-1">•</span>
                          <span>
                            You'll gain full access to edit all preparations and
                            calculations
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-emerald-500 mt-1">•</span>
                          <span>
                            The parameter status will change to "Analysis
                            Started"
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-emerald-500 mt-1">•</span>
                          <span>
                            You must complete the entire analysis - no pausing
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-emerald-500 mt-1">•</span>
                          <span>
                            Click "Complete Analysis" when you're done with all
                            work
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <svg
                      className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                      />
                    </svg>
                    <p className="text-sm text-emerald-800">
                      <strong>Important:</strong> Once started, you cannot pause
                      or go back. Make sure you have all required materials and
                      time to complete.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      }

      // ========== ANALYST VIEW - ANALYSIS STARTED (ACTIVE EDITING) ==========
      if (role.toLowerCase() === "analyst" && isAnalysisStarted && param) {
        return (
          <div className="relative mb-8 rounded-2xl overflow-hidden border border-slate-200 shadow-lg bg-white">
            <div className="bg-gradient-to-r from-emerald-50 via-emerald-100 to-emerald-50 px-6 py-5 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-emerald-600 animate-pulse"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                      Analysis In Progress
                    </h3>
                    <p className="text-sm text-slate-600 mt-0.5">
                      Work on your analysis and click complete when done
                    </p>
                  </div>
                </div>

                <motion.button
                  onClick={() => handleCompleteAnalysis(param)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-5 py-2.5 bg-white/60 backdrop-blur-sm border border-emerald-200 text-emerald-800 text-sm font-semibold rounded-lg hover:bg-white/80 hover:border-emerald-300 transition-all flex items-center gap-2 shadow-sm"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Complete Analysis
                </motion.button>
              </div>
            </div>

            <div className="p-6 bg-emerald-50">
              <div className="grid grid-cols-1 gap-4">
                <div className="bg-white border border-slate-200 rounded-xl p-5">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg
                        className="w-5 h-5 text-emerald-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm text-slate-800 mb-2">
                        Active Editing Mode
                      </h4>
                      <ul className="text-sm text-slate-600 space-y-2">
                        <li className="flex items-start gap-2">
                          <span className="text-emerald-500 mt-1">•</span>
                          <span>
                            You have full editing access to all preparations and
                            calculations
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-emerald-500 mt-1">•</span>
                          <span>
                            Scroll down to work on parameter details,
                            preparations, and calculations
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-emerald-500 mt-1">•</span>
                          <span>
                            Click <strong>"Save Draft"</strong> frequently to
                            save your progress
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-emerald-500 mt-1">•</span>
                          <span>
                            When all work is complete, click{" "}
                            <strong>"Complete Analysis"</strong> above
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <svg
                      className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <p className="text-sm text-emerald-800">
                      <strong>Before Completing:</strong> Verify all
                      preparations, calculations, and data are accurate. This
                      will submit your work to Reviewer for approval.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      }

      // ========== ANALYST VIEW - ANALYSIS COMPLETED (AWAITING REVIEWER REVIEW) ==========
      if (role.toLowerCase() === "analyst" && isAnalysisCompleted && param) {
        return (
          <div className="relative mb-8 rounded-2xl overflow-hidden border border-slate-200 shadow-lg bg-white">
            <div className="bg-gradient-to-r from-emerald-50 via-emerald-100 to-emerald-50 px-6 py-5 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-emerald-600"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-800">
                      Analysis Completed
                    </h3>
                    <p className="text-sm text-slate-600 mt-0.5">
                      Your work has been submitted and is under review
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 bg-emerald-50">
              <div className="grid grid-cols-1 gap-4">
                <div className="bg-white border border-slate-200 rounded-xl p-5">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg
                        className="w-5 h-5 text-emerald-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm text-slate-800 mb-2">
                        What's Next?
                      </h4>
                      <ul className="text-sm text-slate-600 space-y-2">
                        <li className="flex items-start gap-2">
                          <span className="text-emerald-500 mt-1">•</span>
                          <span>
                            Reviewer is currently reviewing your analysis
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-emerald-500 mt-1">•</span>
                          <span>
                            If approved, the parameter will be finalized
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-emerald-500 mt-1">•</span>
                          <span>
                            If revisions are needed, you'll regain editing
                            access
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-emerald-500 mt-1">•</span>
                          <span>
                            You can view all parameter details below while
                            waiting
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-100 border border-slate-200 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <svg
                      className="w-5 h-5 text-slate-600 flex-shrink-0 mt-0.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                    <p className="text-sm text-slate-700">
                      <strong>Status:</strong> Your analysis is locked for
                      review. No edits can be made until Reviewer provides
                      feedback.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      }

      // ========== ANALYST VIEW - ANALYSIS REVISION REQUESTED ==========
      if (role.toLowerCase() === "analyst" && isAnalysisRevision && param) {
        const qaRemarks = remarksQAPerParam[parameterId];
        const reviewerRemarks = remarksByReviewerPerParam[parameterId];
        const isFromQA = !!qaRemarks;
        const activeRemarks = isFromQA ? qaRemarks : reviewerRemarks;
        const senderLabel = isFromQA ? "QA" : "Reviewer";
        const isRevisionStarted = status === "analysis revision started" || revisionStartedParams.has(parameterId);

        return (
          <div className="relative mb-8 rounded-2xl overflow-hidden border border-slate-200 shadow-lg bg-white">
            <div
              className={`bg-gradient-to-r ${isFromQA ? "from-amber-50 via-amber-100 to-amber-50" : "from-orange-50 via-orange-100 to-orange-50"} px-6 py-5 border-b border-slate-200`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div
                      className={`w-12 h-12 ${isFromQA ? "bg-amber-100" : "bg-orange-100"} rounded-xl flex items-center justify-center`}
                    >
                      <svg
                        className={`w-6 h-6 ${isFromQA ? "text-amber-600" : "text-orange-600"} animate-pulse`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-800">
                      Revision Requested by {senderLabel}
                    </h3>
                    <p className="text-sm text-slate-600 mt-0.5">
                      {isRevisionStarted
                        ? `Revision in progress — make your changes and click "Complete Revision" when done`
                        : `${senderLabel} has requested revisions. Click "Start Revision" to unlock editing`}
                    </p>
                  </div>
                </div>

                {isRevisionStarted ? (
                  <motion.button
                    onClick={() => handleCompleteAnalysis(param)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`px-5 py-2.5 bg-white/60 backdrop-blur-sm border ${isFromQA ? "border-amber-200 text-amber-700 hover:border-amber-300" : "border-orange-200 text-orange-700 hover:border-orange-300"} text-sm font-semibold rounded-lg hover:bg-white/80 transition-all flex items-center gap-2 shadow-sm`}
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Complete Revision
                  </motion.button>
                ) : (
                  <motion.button
                    onClick={() => handleStartRevision(param)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`px-5 py-2.5 bg-gradient-to-r ${isFromQA ? "from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700" : "from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"} text-white text-sm font-semibold rounded-lg transition-all flex items-center gap-2 shadow-md`}
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Start Revision
                  </motion.button>
                )}
              </div>
            </div>

            <div className={`p-6 ${isFromQA ? "bg-amber-50" : "bg-orange-50"}`}>
              <div className="grid grid-cols-1 gap-4">
                {/* Revision Remarks — most prominent */}
                {activeRemarks ? (
                  <div
                    className={`bg-white border ${isFromQA ? "border-amber-200" : "border-orange-200"} rounded-xl p-5`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-10 h-10 ${isFromQA ? "bg-amber-50" : "bg-orange-50"} rounded-lg flex items-center justify-center flex-shrink-0`}
                      >
                        <svg
                          className={`w-5 h-5 ${isFromQA ? "text-amber-600" : "text-orange-600"}`}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                          />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm text-slate-800 mb-2 flex items-center gap-2">
                          Revision Remarks
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full font-medium ${isFromQA ? "bg-amber-100 text-amber-700" : "bg-orange-100 text-orange-700"}`}
                          >
                            from {senderLabel}
                          </span>
                        </h4>
                        <p
                          className={`text-sm italic leading-relaxed px-4 py-3 rounded-lg border ${isFromQA ? "text-amber-900 bg-amber-50 border-amber-100" : "text-orange-900 bg-orange-50 border-orange-100"}`}
                        >
                          &ldquo;{activeRemarks}&rdquo;
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white border border-slate-200 rounded-xl p-5">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <svg
                          className="w-5 h-5 text-slate-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                          />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm text-slate-800 mb-1">
                          Revision Remarks
                        </h4>
                        <p className="text-sm text-slate-400 italic">
                          No remarks provided by {senderLabel}.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="bg-white border border-slate-200 rounded-xl p-5">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg
                        className="w-5 h-5 text-emerald-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                        />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm text-slate-800 mb-2">
                        {isRevisionStarted ? "Revision Mode Active" : "Revision Pending — Action Required"}
                      </h4>
                      <ul className="text-sm text-slate-600 space-y-2">
                        {!isRevisionStarted ? (
                          <>
                            <li className="flex items-start gap-2">
                              <span className="text-orange-500 mt-1">•</span>
                              <span>Review {senderLabel}&apos;s feedback above carefully</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-orange-500 mt-1">•</span>
                              <span>Click <strong>&quot;Start Revision&quot;</strong> to unlock the parameter for editing</span>
                            </li>
                          </>
                        ) : (
                          <>
                            <li className="flex items-start gap-2">
                              <span className="text-emerald-500 mt-1">•</span>
                              <span>Review {senderLabel}&apos;s feedback above and make necessary corrections</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-emerald-500 mt-1">•</span>
                              <span>You have full editing access to all preparations and calculations</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-emerald-500 mt-1">•</span>
                              <span>Click <strong>&quot;Save Draft&quot;</strong> to save your changes</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-emerald-500 mt-1">•</span>
                              <span>Click <strong>&quot;Complete Revision&quot;</strong>{" "}when all changes are done</span>
                            </li>
                          </>
                        )}
                      </ul>
                    </div>
                  </div>
                </div>

                <div
                  className={`${isFromQA ? "bg-amber-50 border-amber-200" : "bg-orange-50 border-orange-200"} border rounded-xl p-4`}
                >
                  <div className="flex items-start gap-3">
                    <svg
                      className={`w-5 h-5 ${isFromQA ? "text-amber-600" : "text-orange-600"} flex-shrink-0 mt-0.5`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <p
                      className={`text-sm ${isFromQA ? "text-amber-800" : "text-orange-800"}`}
                    >
                      <strong>Tip:</strong> Carefully review all sections to
                      ensure accuracy before resubmitting. Your work will be
                      sent back to {senderLabel} for re-approval.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      }

      // ========== ANALYST VIEW - APPROVED ==========
      if (role.toLowerCase() === "analyst" && isApproved && param) {
        return (
          <div className="relative mb-8 rounded-2xl overflow-hidden border border-slate-200 shadow-lg bg-white">
            <div className="bg-gradient-to-r from-emerald-50 via-emerald-100 to-emerald-50 px-6 py-5 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-emerald-600"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-800">
                      Parameter Approved - Well Done!
                    </h3>
                    <p className="text-sm text-slate-600 mt-0.5">
                      Your analysis has been reviewed and approved by Reviewer
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 bg-emerald-50">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white border border-slate-200 rounded-xl p-5">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg
                        className="w-5 h-5 text-emerald-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm text-slate-800 mb-1">
                        Status: Approved
                      </h4>
                      <p className="text-sm text-slate-600">
                        This parameter has been finalized and approved. All data
                        is now locked.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-xl p-5">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg
                        className="w-5 h-5 text-emerald-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm text-slate-800 mb-1">
                        View Only Access
                      </h4>
                      <p className="text-sm text-slate-600">
                        You can view all parameter details below, but cannot
                        make any changes.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      }

      // ========== Reviewer VIEW - CREATED ==========
      if (role.toLowerCase() === "reviewer" && isCreated && param) {
        return (
          <div className="relative mb-8 rounded-2xl overflow-hidden border border-slate-200 shadow-lg bg-white">
            <div className="bg-gradient-to-r from-slate-50 via-gray-50 to-slate-50 px-6 py-5 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-slate-600"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-800">
                      Parameter in Draft Mode
                    </h3>
                    <p className="text-sm text-slate-600 mt-0.5">
                      This parameter is being prepared and has not been
                      submitted yet
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <motion.button
                    onClick={() => handleInitiateDelete(param)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-4 py-2 bg-white/60 backdrop-blur-sm border border-red-200 text-red-700 text-sm font-semibold rounded-lg hover:bg-white/80 hover:border-red-300 transition-all flex items-center gap-2 shadow-sm"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                    Delete
                  </motion.button>
                </div>
              </div>
            </div>

            <div className="p-6 bg-emerald-50">
              <div className="grid grid-cols-1 gap-4">
                <div className="bg-white border border-slate-200 rounded-xl p-5">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg
                        className="w-5 h-5 text-emerald-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm text-slate-800 mb-2">
                        Current Status
                      </h4>
                      <ul className="text-sm text-slate-600 space-y-2">
                        <li className="flex items-start gap-2">
                          <span className="text-emerald-500 mt-1">•</span>
                          <span>
                            This parameter is in draft mode and being set up
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-emerald-500 mt-1">•</span>
                          <span>
                            It has not been submitted for analysis yet
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-emerald-500 mt-1">•</span>
                          <span>
                            Once submitted, it will be assigned for analysis
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-100 border border-slate-200 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <svg
                      className="w-5 h-5 text-slate-600 flex-shrink-0 mt-0.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                      />
                    </svg>
                    <p className="text-sm text-slate-700">
                      <strong>Available Actions:</strong> You can delete this
                      parameter if it's no longer needed. View details below.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      }

      // ========== Reviewer VIEW - ANALYSIS PENDING OR STARTED ==========
      if (
        role.toLowerCase() === "reviewer" &&
        (isAnalysisPending || isAnalysisStarted) &&
        param
      ) {
        return (
          <div className="relative mb-8 rounded-2xl overflow-hidden border border-slate-200 shadow-lg bg-white">
            <div className="bg-gradient-to-r from-slate-50 via-gray-50 to-slate-50 px-6 py-5 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-slate-600"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-800">
                      {isAnalysisStarted
                        ? "Analysis In Progress"
                        : "Awaiting Analysis"}
                    </h3>
                    <p className="text-sm text-slate-600 mt-0.5">
                      Status:{" "}
                      <span className="uppercase font-semibold">{status}</span>
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  {canUnlock && (
                    <motion.button
                      onClick={() => handleInitiateUnlock(param)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="px-4 py-2 bg-white/60 backdrop-blur-sm border border-emerald-200 text-emerald-800 text-sm font-semibold rounded-lg hover:bg-white/80 hover:border-emerald-300 transition-all flex items-center gap-2 shadow-sm"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"
                        />
                      </svg>
                      Unlock
                    </motion.button>
                  )}

                  <motion.button
                    onClick={() => handleInitiateDelete(param)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-4 py-2 bg-white/60 backdrop-blur-sm border border-red-200 text-red-700 text-sm font-semibold rounded-lg hover:bg-white/80 hover:border-red-300 transition-all flex items-center gap-2 shadow-sm"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                    Delete
                  </motion.button>
                </div>
              </div>
            </div>

            <div className="p-6 bg-emerald-50">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white border border-slate-200 rounded-xl p-5">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg
                        className="w-5 h-5 text-emerald-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm text-slate-800 mb-2">
                        Why is this locked?
                      </h4>
                      <p className="text-sm text-slate-600">
                        {isAnalysisStarted
                          ? "This parameter is currently under active analysis. The analyst is working on it."
                          : "This parameter has been submitted for analysis. To maintain data integrity, modifications are restricted."}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-xl p-5">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg
                        className="w-5 h-5 text-emerald-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                        />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm text-slate-800 mb-2">
                        {canUnlock
                          ? "Unlock Available"
                          : "Need to make changes?"}
                      </h4>
                      <p className="text-sm text-slate-600">
                        {canUnlock ? (
                          <>
                            You can unlock this parameter to make changes. Click{" "}
                            <strong>"Unlock"</strong> to revert to draft status.
                          </>
                        ) : isAnalysisStarted ? (
                          <>
                            Analysis is in progress. Contact the analyst or
                            delete the parameter if necessary.
                          </>
                        ) : (
                          <>
                            Contact the assigned analyst to discuss
                            modifications or wait until analysis is complete.
                          </>
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 bg-slate-100 border border-slate-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <svg
                    className="w-5 h-5 text-slate-600 flex-shrink-0 mt-0.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-slate-700 mb-2">
                      Available Actions:
                    </p>
                    <ul className="text-sm text-slate-600 space-y-1.5">
                      {canUnlock && (
                        <li className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-1.5" />
                          <span>
                            <strong>Unlock:</strong> Revert to draft status for
                            editing
                          </span>
                        </li>
                      )}
                      <li className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 bg-red-500 rounded-full mt-1.5" />
                        <span>
                          <strong>Delete:</strong> Permanently remove this
                          parameter
                          {isAnalysisStarted &&
                            " (will disrupt ongoing analysis)"}
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-1.5" />
                        <span>
                          <strong>View:</strong> You can still view all
                          parameter details below
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      }

      // ========== REVIEWER VIEW - ANALYSIS COMPLETED (AWAITING APPROVAL) ==========
      if (role.toLowerCase() === "reviewer" && isAnalysisCompleted && param) {
        return (
          <div className="relative mb-8 rounded-2xl overflow-hidden border border-slate-200 shadow-lg bg-white">
            <div className="bg-gradient-to-r from-emerald-50 via-emerald-100 to-emerald-50 px-6 py-5 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-emerald-600 animate-pulse"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-800">
                      Analysis Completed
                    </h3>
                    <p className="text-sm text-slate-600 mt-0.5">
                      Review the analysis and approve or request revisions
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <motion.button
                    onClick={() => handleApprove(param)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-4 py-2 bg-white/60 backdrop-blur-sm border border-emerald-200 text-emerald-800 text-sm font-semibold rounded-lg hover:bg-white/80 hover:border-emerald-300 transition-all flex items-center gap-2 shadow-sm"
                  >
                    <MdDone className="w-4 h-4" />
                    Approve
                  </motion.button>

                  <motion.button
                    onClick={() => handleRequestRevision(param)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-4 py-2 bg-white/60 backdrop-blur-sm border border-emerald-200 text-emerald-800 text-sm font-semibold rounded-lg hover:bg-white/80 hover:border-emerald-300 transition-all flex items-center gap-2 shadow-sm"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      />
                    </svg>
                    Request Revision
                  </motion.button>
                </div>
              </div>
            </div>

            <div className="p-6 bg-emerald-50">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white border border-slate-200 rounded-xl p-5">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg
                        className="w-5 h-5 text-emerald-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm text-slate-800 mb-2">
                        Review Actions Available
                      </h4>
                      <p className="text-sm text-slate-600">
                        <strong>Approve:</strong> If all data is accurate and
                        complete, approve to finalize the parameter.
                        <br />
                        <br />
                        <strong>Request Revision:</strong> If changes are
                        needed, send it back to the analyst with feedback.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-xl p-5">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg
                        className="w-5 h-5 text-emerald-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm text-slate-800 mb-2">
                        Review Guidelines
                      </h4>
                      <p className="text-sm text-slate-600">
                        Carefully review all preparations, calculations, and
                        data. Scroll through the parameter details below to
                        verify accuracy.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <svg
                    className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                  <p className="text-sm text-emerald-800">
                    <strong>Reminder:</strong> Your decision will be final.
                    Approved parameters cannot be edited. Parameters sent for
                    revision will return to the analyst.
                  </p>
                </div>
              </div>

              {/* Analyst Comment submitted with analysis completion */}
              {remarksByAnalystPerParam[parameterId] && (
                <div className="mt-4 bg-gray-50 border border-gray-200 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg
                        className="w-4 h-4 text-gray-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                        />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xs font-semibold text-gray-700 mb-1">
                        Analyst Comment
                      </h4>
                      <p className="text-sm italic text-gray-800 bg-gray-100 rounded-lg px-3 py-2 border border-gray-200">
                        &ldquo;{remarksByAnalystPerParam[parameterId]}&rdquo;
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      }

      // ========== REVIEWER VIEW - ANALYSIS REVISION ==========
      if (role.toLowerCase() === "reviewer" && isAnalysisRevision && param) {
        const qaRemarks = remarksQAPerParam[parameterId];
        const reviewerRemarks = remarksByReviewerPerParam[parameterId];
        const isFromQA = !!qaRemarks;
        const activeRemarks = isFromQA ? qaRemarks : reviewerRemarks;
        const senderLabel = isFromQA ? "QA" : "Reviewer (You)";

        return (
          <div className="relative mb-8 rounded-2xl overflow-hidden border border-slate-200 shadow-lg bg-white">
            <div className="bg-gradient-to-r from-emerald-50 via-emerald-100 to-emerald-50 px-6 py-5 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-emerald-600"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-800">
                      Revision In Progress
                    </h3>
                    <p className="text-sm text-slate-600 mt-0.5">
                      Analyst is working on the requested revisions
                    </p>
                  </div>
                </div>

                <div className="px-4 py-2 bg-white/60 backdrop-blur-sm border border-emerald-200 rounded-lg">
                  <span className="text-sm font-semibold text-emerald-800">
                    AWAITING REVISION
                  </span>
                </div>
              </div>
            </div>

            <div className="p-6 bg-emerald-50">
              <div className="grid grid-cols-1 gap-4">
                {/* Revision Remarks — show what was sent */}
                {activeRemarks ? (
                  <div className="bg-white border border-emerald-200 rounded-xl p-5">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center flex-shrink-0">
                        <svg
                          className="w-5 h-5 text-emerald-600"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                          />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm text-slate-800 mb-2 flex items-center gap-2">
                          Revision Remarks Sent
                          <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-emerald-100 text-emerald-800">
                            from {senderLabel}
                          </span>
                        </h4>
                        <p className="text-sm italic leading-relaxed px-4 py-3 rounded-lg border text-emerald-900 bg-emerald-50 border-emerald-100">
                          &ldquo;{activeRemarks}&rdquo;
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white border border-slate-200 rounded-xl p-5">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <svg
                          className="w-5 h-5 text-slate-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                          />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm text-slate-800 mb-1">
                          Revision Remarks
                        </h4>
                        <p className="text-sm text-slate-400 italic">
                          No remarks were provided with this revision request.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="bg-white border border-slate-200 rounded-xl p-5">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg
                        className="w-5 h-5 text-emerald-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm text-slate-800 mb-2">
                        Current Status
                      </h4>
                      <ul className="text-sm text-slate-600 space-y-2">
                        <li className="flex items-start gap-2">
                          <span className="text-emerald-500 mt-1">•</span>
                          <span>
                            {isFromQA ? "QA" : "You"} requested revisions on
                            this parameter
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-emerald-500 mt-1">•</span>
                          <span>
                            The analyst is currently making the necessary
                            changes
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-emerald-500 mt-1">•</span>
                          <span>
                            Once complete, it will be resubmitted for your
                            review
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-emerald-500 mt-1">•</span>
                          <span>You can view all parameter details below</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-100 border border-slate-200 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <svg
                      className="w-5 h-5 text-slate-600 flex-shrink-0 mt-0.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <p className="text-sm text-slate-700">
                      <strong>Please wait:</strong> The parameter will return to
                      &quot;Analysis Completed&quot; status once the analyst
                      finishes the revisions.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      }

      // ========== Reviewer VIEW - APPROVED ==========
      if (role.toLowerCase() === "reviewer" && isApproved && param) {
        return (
          <div className="relative mb-8 rounded-2xl overflow-hidden border border-slate-200 shadow-lg bg-white">
            <div className="bg-gradient-to-r from-emerald-50 via-emerald-100 to-emerald-50 px-6 py-5 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-emerald-600"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-800">
                      Parameter Approved & Finalized
                    </h3>
                    <p className="text-sm text-slate-600 mt-0.5">
                      This parameter has been reviewed and approved
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 bg-emerald-50">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white border border-slate-200 rounded-xl p-5">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg
                        className="w-5 h-5 text-emerald-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm text-slate-800 mb-1">
                        Status: Approved
                      </h4>
                      <p className="text-sm text-slate-600">
                        This parameter has been finalized and approved. All data
                        is now locked and cannot be modified.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-xl p-5">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg
                        className="w-5 h-5 text-emerald-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm text-slate-800 mb-1">
                        View Only Access
                      </h4>
                      <p className="text-sm text-slate-600">
                        You can view all parameter details, preparations, and
                        calculations below.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Reviewer Remarks on Approval */}
            {remarksByReviewerPerParam[parameterId] && (
              <div className="mx-6 mb-3 bg-blue-50 border border-blue-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg
                      className="w-4 h-4 text-blue-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                      />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-xs font-semibold text-emerald-800 mb-1">
                      Reviewer Remarks
                    </h4>
                    <p className="text-sm italic text-blue-900 bg-blue-100 rounded-lg px-3 py-2 border border-blue-200">
                      &ldquo;{remarksByReviewerPerParam[parameterId]}&rdquo;
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Analyst Comment */}
            {remarksByAnalystPerParam[parameterId] && (
              <div className="mx-6 mb-4 bg-gray-50 border border-gray-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg
                      className="w-4 h-4 text-gray-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                      />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-xs font-semibold text-gray-700 mb-1">
                      Analyst Comment
                    </h4>
                    <p className="text-sm italic text-gray-800 bg-gray-100 rounded-lg px-3 py-2 border border-gray-200">
                      &ldquo;{remarksByAnalystPerParam[parameterId]}&rdquo;
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      }

      // If none of the conditions match, return null (no overlay)

      // ========== QA VIEW - APPROVED (Reviewer approved, pending QA worksheet approval) ==========
      if (role.toLowerCase() === "qa" && isApproved && param) {
        return (
          <div className="relative mb-8 rounded-2xl overflow-hidden border border-slate-200 shadow-lg bg-white">
            <div className="bg-gradient-to-r from-emerald-50 via-emerald-100 to-emerald-50 px-6 py-5 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-emerald-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-800">
                      {worksheetInfo?.sample.status === "Approved"
                        ? "Worksheet Approved & Finalized"
                        : "Reviewer Approved — Pending QA Worksheet Approval"}
                    </h3>
                    <p className="text-sm text-slate-600 mt-0.5">
                      {worksheetInfo?.sample.status === "Approved"
                        ? "This worksheet has been fully approved by QA. All data is locked."
                        : "You can return this parameter for revision, or approve the entire worksheet once all parameters are reviewed"}
                    </p>
                  </div>
                </div>
                {worksheetInfo?.sample.status !== "Approved" && (
                  <motion.button
                    onClick={() => handleRequestRevision(param)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-4 py-2 bg-white/60 backdrop-blur-sm border border-amber-200 text-amber-700 text-sm font-semibold rounded-lg hover:bg-white/80 hover:border-amber-300 transition-all flex items-center gap-2 shadow-sm"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      />
                    </svg>
                    Return for Revision
                  </motion.button>
                )}
              </div>
            </div>
          </div>
        );
      }

      // ========== QA VIEW - ANALYSIS REVISION (parameter sent back by QA or Reviewer) ==========
      if (role.toLowerCase() === "qa" && isAnalysisRevision && param) {
        const qaRemarks = remarksQAPerParam[parameterId];
        const reviewerRemarks = remarksByReviewerPerParam[parameterId];
        const isFromQA = !!qaRemarks;
        const activeRemarks = isFromQA ? qaRemarks : reviewerRemarks;
        const senderLabel = isFromQA ? "QA" : "Reviewer";

        return (
          <div className="relative mb-8 rounded-2xl overflow-hidden border border-slate-200 shadow-lg bg-white">
            {/* Header */}
            <div
              className={`bg-gradient-to-r ${isFromQA ? "from-amber-50 via-amber-100 to-amber-50" : "from-slate-50 via-slate-100 to-slate-50"} px-6 py-5 border-b border-slate-200`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div
                    className={`w-12 h-12 ${isFromQA ? "bg-amber-100" : "bg-slate-200"} rounded-xl flex items-center justify-center`}
                  >
                    <svg
                      className={`w-6 h-6 ${isFromQA ? "text-amber-600" : "text-slate-600"} animate-pulse`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-800">
                      Revision In Progress — Returned by {senderLabel}
                    </h3>
                    <p className="text-sm text-slate-600 mt-0.5">
                      Analyst is working on the requested revisions
                    </p>
                  </div>
                </div>
                <div
                  className={`px-4 py-2 bg-white/60 backdrop-blur-sm border ${isFromQA ? "border-amber-200" : "border-slate-300"} rounded-lg`}
                >
                  <span
                    className={`text-sm font-semibold ${isFromQA ? "text-amber-700" : "text-slate-600"} uppercase tracking-wider`}
                  >
                    AWAITING REVISION
                  </span>
                </div>
              </div>
            </div>

            {/* Content Body */}
            <div className={`p-6 ${isFromQA ? "bg-amber-50" : "bg-slate-50"}`}>
              <div className="grid grid-cols-1 gap-4">
                {/* Remarks Card — most prominent */}
                {activeRemarks ? (
                  <div
                    className={`bg-white border ${isFromQA ? "border-amber-200" : "border-slate-200"} rounded-xl p-5`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-10 h-10 ${isFromQA ? "bg-amber-50" : "bg-slate-100"} rounded-lg flex items-center justify-center flex-shrink-0`}
                      >
                        <svg
                          className={`w-5 h-5 ${isFromQA ? "text-amber-600" : "text-slate-600"}`}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                          />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm text-slate-800 mb-2 flex items-center gap-2">
                          Revision Remarks
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full font-medium ${isFromQA ? "bg-amber-100 text-amber-700" : "bg-slate-200 text-slate-600"}`}
                          >
                            from {senderLabel}
                          </span>
                        </h4>
                        <p
                          className={`text-sm italic leading-relaxed px-4 py-3 rounded-lg border ${isFromQA ? "text-amber-900 bg-amber-50 border-amber-100" : "text-slate-700 bg-slate-50 border-slate-100"}`}
                        >
                          &ldquo;{activeRemarks}&rdquo;
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white border border-slate-200 rounded-xl p-5">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <svg
                          className="w-5 h-5 text-slate-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                          />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm text-slate-800 mb-1">
                          Revision Remarks
                        </h4>
                        <p className="text-sm text-slate-400 italic">
                          No remarks provided by {senderLabel}.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Status Info Card */}
                <div className="bg-white border border-slate-200 rounded-xl p-5">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg
                        className="w-5 h-5 text-slate-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm text-slate-800 mb-2">
                        Current Status
                      </h4>
                      <ul className="text-sm text-slate-600 space-y-2">
                        <li className="flex items-start gap-2">
                          <span
                            className={`${isFromQA ? "text-amber-500" : "text-slate-400"} mt-1`}
                          >
                            •
                          </span>
                          <span>
                            {senderLabel} returned this parameter for revision
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span
                            className={`${isFromQA ? "text-amber-500" : "text-slate-400"} mt-1`}
                          >
                            •
                          </span>
                          <span>
                            The analyst is currently making the necessary
                            changes
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span
                            className={`${isFromQA ? "text-amber-500" : "text-slate-400"} mt-1`}
                          >
                            •
                          </span>
                          <span>
                            Once complete, it will be resubmitted for Reviewer
                            approval
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span
                            className={`${isFromQA ? "text-amber-500" : "text-slate-400"} mt-1`}
                          >
                            •
                          </span>
                          <span>You can view all parameter details below</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Wait notice */}
                <div className="bg-slate-100 border border-slate-200 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <svg
                      className="w-5 h-5 text-slate-500 flex-shrink-0 mt-0.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <p className="text-sm text-slate-700">
                      <strong>Please wait:</strong> The parameter will return to
                      &quot;Analysis Completed&quot; status once the analyst
                      finishes the revisions and the Reviewer re-approves it.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      }

      return null;
    },
    (prevProps, nextProps) => {
      return (
        prevProps.parameterId === nextProps.parameterId &&
        (parameterStatusPerParam[prevProps.parameterId] || "") ===
        (parameterStatusPerParam[nextProps.parameterId] || "")
      );
    },
  );

  LockedParameterOverlay.displayName = "LockedParameterOverlay";

  const BottomParameterActionBar: React.FC<{ parameterId: number }> =
    React.memo(
      ({ parameterId }) => {
        const status = (
          parameterStatusPerParam[parameterId] || "Created"
        ).toLowerCase();
        const canUnlock = status === "analysis pending";
        const isAnalysisStarted = status === "analysis started";
        const isAnalysisPending = status === "analysis pending";
        const isAnalysisCompleted = status === "analysis completed";
        const isAnalysisRevision = status === "analysis revision" || status === "analysis revision started";
        const isApproved = status === "approved";
        const isCreated = status === "created";
        const param = addedParameters.find((p) => p.id === parameterId);

        // ========== ANALYST VIEW - CREATED (NO BAR) ==========
        if (role.toLowerCase() === "analyst" && isCreated) {
          return null; // No action bar needed for created status
        }

        // ========== ANALYST VIEW - ANALYSIS PENDING ==========
        if (role.toLowerCase() === "analyst" && isAnalysisPending && param) {
          return (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 rounded-xl overflow-hidden border border-slate-200 shadow-lg bg-white"
            >
              <div className="bg-gradient-to-r from-emerald-50 via-emerald-100 to-emerald-50 px-6 py-4 border-b border-slate-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                      <svg
                        className="w-5 h-5 text-emerald-600 animate-pulse"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-800">
                        Analysis Pending - Ready to Start
                      </h4>
                      <p className="text-xs text-slate-600">
                        Click "Start Analysis" to begin working on this
                        parameter
                      </p>
                    </div>
                  </div>

                  <motion.button
                    onClick={() => handleStartAnalysis(param)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-5 py-2.5 bg-white/60 backdrop-blur-sm border border-emerald-200 text-emerald-800 text-sm font-semibold rounded-lg hover:bg-white/80 hover:border-emerald-300 transition-all flex items-center gap-2 shadow-sm"
                  >
                    <BsPlayFill className="w-5 h-5" />
                    Start Analysis
                  </motion.button>
                </div>
              </div>
            </motion.div>
          );
        }

        // ========== ANALYST VIEW - ANALYSIS STARTED ==========
        if (role.toLowerCase() === "analyst" && isAnalysisStarted && param) {
          return (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 rounded-xl overflow-hidden border border-slate-200 shadow-lg bg-white"
            >
              <div className="bg-gradient-to-r from-emerald-50 via-emerald-100 to-emerald-50 px-6 py-4 border-b border-slate-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                      <svg
                        className="w-5 h-5 text-emerald-600 animate-pulse"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-800">
                        Analysis In Progress
                      </h4>
                      <p className="text-xs text-slate-600">
                        Complete your analysis and click on Complete button
                      </p>
                    </div>
                  </div>

                  <motion.button
                    onClick={() => handleCompleteAnalysis(param)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-5 py-2.5 bg-white/60 backdrop-blur-sm border border-emerald-200 text-emerald-800 text-sm font-semibold rounded-lg hover:bg-white/80 hover:border-emerald-300 transition-all flex items-center gap-2 shadow-sm"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    Complete Analysis
                  </motion.button>
                </div>
              </div>
            </motion.div>
          );
        }

        // ========== ANALYST VIEW - ANALYSIS COMPLETED ==========
        if (role.toLowerCase() === "analyst" && isAnalysisCompleted && param) {
          return (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 rounded-xl overflow-hidden border border-slate-200 shadow-lg bg-white"
            >
              <div className="bg-gradient-to-r from-emerald-50 via-emerald-100 to-emerald-50 px-6 py-4 border-b border-slate-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                      <svg
                        className="w-5 h-5 text-emerald-600"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-800">
                        Analysis Completed
                      </h4>
                      <p className="text-xs text-slate-600">
                        Your work has been submitted and is under review
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        }

        // ========== ANALYST VIEW - ANALYSIS REVISION ==========
        if (role.toLowerCase() === "analyst" && isAnalysisRevision && param) {
          const qaRemarks = remarksQAPerParam[parameterId];
          const reviewerRemarks = remarksByReviewerPerParam[parameterId];
          const isFromQA = !!qaRemarks;
          const isRevisionStarted = status === "analysis revision started" || revisionStartedParams.has(parameterId);
          return (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 rounded-xl overflow-hidden border border-slate-200 shadow-lg bg-white"
            >
              <div className="bg-gradient-to-r from-emerald-50 via-emerald-100 to-emerald-50 px-6 py-4 border-b border-slate-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                      <svg
                        className="w-5 h-5 text-emerald-600 animate-pulse"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-800">
                        Revision Requested {isFromQA ? "by QA" : "by Reviewer"}
                      </h4>
                      <p className="text-xs text-slate-600">
                        {isRevisionStarted
                          ? "Revision in progress — make your changes and complete when done"
                          : isFromQA
                            ? "QA has requested revisions. Click \"Start Revision\" to begin editing"
                            : "Reviewer has requested revisions. Click \"Start Revision\" to begin editing"}
                      </p>
                    </div>
                  </div>

                  {isRevisionStarted ? (
                    <motion.button
                      onClick={() => handleCompleteAnalysis(param)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="px-5 py-2.5 bg-white/60 backdrop-blur-sm border border-emerald-200 text-emerald-800 text-sm font-semibold rounded-lg hover:bg-white/80 hover:border-emerald-300 transition-all flex items-center gap-2 shadow-sm"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Complete Revision
                    </motion.button>
                  ) : (
                    <motion.button
                      onClick={() => handleStartRevision(param)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`px-5 py-2.5 bg-gradient-to-r ${isFromQA ? "from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700" : "from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"} text-white text-sm font-semibold rounded-lg transition-all flex items-center gap-2 shadow-md`}
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Start Revision
                    </motion.button>
                  )}
                </div>
              </div>

              {/* Remarks Block */}
              {(qaRemarks || reviewerRemarks) && (
                <div
                  className={`px-6 py-4 border-t ${isFromQA ? "bg-amber-50 border-amber-100" : "bg-slate-50 border-slate-100"}`}
                >
                  <div className="flex items-start gap-3">
                    <svg
                      className={`w-4 h-4 mt-0.5 flex-shrink-0 ${isFromQA ? "text-amber-500" : "text-slate-400"}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                      />
                    </svg>
                    <div className="flex-1 min-w-0">
                      <span
                        className={`text-xs font-semibold uppercase tracking-wide ${isFromQA ? "text-amber-600" : "text-slate-500"}`}
                      >
                        {isFromQA ? "QA Remarks" : "Reviewer Remarks"}
                      </span>
                      <p
                        className={`mt-1 text-sm italic leading-relaxed ${isFromQA ? "text-amber-900" : "text-slate-700"}`}
                      >
                        &ldquo;{isFromQA ? qaRemarks : reviewerRemarks}&rdquo;
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          );
        }
        if (role.toLowerCase() === "analyst" && isApproved && param) {
          return (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 rounded-xl overflow-hidden border border-slate-200 shadow-lg bg-white"
            >
              <div className="bg-gradient-to-r from-emerald-50 via-emerald-100 to-emerald-50 px-6 py-4 border-b border-slate-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                      <svg
                        className="w-5 h-5 text-emerald-600"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-800">
                        Parameter Approved - Well Done!
                      </h4>
                      <p className="text-xs text-slate-600">
                        Your analysis has been reviewed and approved by HOD
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        }

        // ========== reviewer VIEW - CREATED ==========
        if (role.toLowerCase() === "reviewer" && isCreated && param) {
          return (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 rounded-xl overflow-hidden border border-slate-200 shadow-lg bg-white"
            >
              <div className="bg-gradient-to-r from-slate-50 via-gray-50 to-slate-50 px-6 py-4 border-b border-slate-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                      <svg
                        className="w-5 h-5 text-slate-600"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-800">
                        Parameter in Draft Mode
                      </h4>
                      <p className="text-xs text-slate-600">
                        This parameter is being prepared and has not been
                        submitted yet
                      </p>
                    </div>
                  </div>

                  <motion.button
                    onClick={() => handleInitiateDelete(param)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-4 py-2 bg-white/60 backdrop-blur-sm border border-red-200 text-red-700 text-sm font-semibold rounded-lg hover:bg-white/80 hover:border-red-300 transition-all flex items-center gap-2 shadow-sm"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                    Delete
                  </motion.button>
                </div>
              </div>
            </motion.div>
          );
        }

        // ========== reviewer VIEW - ANALYSIS PENDING OR STARTED ==========
        if (
          role.toLowerCase() === "reviewer" &&
          (isAnalysisPending || isAnalysisStarted) &&
          param
        ) {
          return (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 rounded-xl overflow-hidden border border-slate-200 shadow-lg bg-white"
            >
              <div className="bg-gradient-to-r from-slate-50 via-gray-50 to-slate-50 px-6 py-4 border-b border-slate-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                      <svg
                        className="w-5 h-5 text-slate-600"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-800">
                        {isAnalysisStarted
                          ? "Analysis In Progress"
                          : "Awaiting Analysis"}
                      </h4>
                      <p className="text-xs text-slate-600">
                        Status:{" "}
                        <span className="uppercase font-semibold">
                          {status}
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {canUnlock && (
                      <motion.button
                        onClick={() => handleInitiateUnlock(param)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="px-4 py-2 bg-white/60 backdrop-blur-sm border border-emerald-200 text-emerald-800 text-sm font-semibold rounded-lg hover:bg-white/80 hover:border-emerald-300 transition-all flex items-center gap-2 shadow-sm"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"
                          />
                        </svg>
                        Unlock
                      </motion.button>
                    )}

                    <motion.button
                      onClick={() => handleInitiateDelete(param)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="px-4 py-2 bg-white/60 backdrop-blur-sm border border-red-200 text-red-700 text-sm font-semibold rounded-lg hover:bg-white/80 hover:border-red-300 transition-all flex items-center gap-2 shadow-sm"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                      Delete
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        }

        // ========== reviewer VIEW - ANALYSIS COMPLETED ==========
        if (role.toLowerCase() === "reviewer" && isAnalysisCompleted && param) {
          return (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 rounded-xl overflow-hidden border border-slate-200 shadow-lg bg-white"
            >
              <div className="bg-gradient-to-r from-emerald-50 via-emerald-100 to-emerald-50 px-6 py-4 border-b border-slate-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                      <svg
                        className="w-5 h-5 text-emerald-600 animate-pulse"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-800">
                        Analysis Completed
                      </h4>
                      <p className="text-xs text-slate-600">
                        Review the analysis and approve or request revisions
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <motion.button
                      onClick={() => handleApprove(param)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="px-4 py-2 bg-white/60 backdrop-blur-sm border border-emerald-200 text-emerald-800 text-sm font-semibold rounded-lg hover:bg-white/80 hover:border-emerald-300 transition-all flex items-center gap-2 shadow-sm"
                    >
                      <MdDone className="w-4 h-4" />
                      Approve
                    </motion.button>

                    <motion.button
                      onClick={() => handleRequestRevision(param)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="px-4 py-2 bg-white/60 backdrop-blur-sm border border-emerald-200 text-emerald-800 text-sm font-semibold rounded-lg hover:bg-white/80 hover:border-emerald-300 transition-all flex items-center gap-2 shadow-sm"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                        />
                      </svg>
                      Request Revision
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        }

        // ========== reviewer VIEW - ANALYSIS REVISION ==========
        if (role.toLowerCase() === "reviewer" && isAnalysisRevision && param) {
          const qaRemarks = remarksQAPerParam[parameterId];
          const reviewerRemarks = remarksByReviewerPerParam[parameterId];
          const isFromQA = !!qaRemarks;
          return (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 rounded-xl overflow-hidden border border-slate-200 shadow-lg bg-white"
            >
              <div className="bg-gradient-to-r from-emerald-50 via-emerald-100 to-emerald-50 px-6 py-4 border-b border-slate-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                      <svg
                        className="w-5 h-5 text-emerald-600"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-800">
                        Revision In Progress —{" "}
                        {isFromQA ? "Returned by QA" : "Requested by You"}
                      </h4>
                      <p className="text-xs text-slate-600">
                        Analyst is working on the requested revisions
                      </p>
                    </div>
                  </div>

                  <div className="px-4 py-2 bg-white/60 backdrop-blur-sm border border-emerald-200 rounded-lg">
                    <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">
                      Awaiting Revision
                    </span>
                  </div>
                </div>
              </div>

              {/* Remarks Block */}
              {(qaRemarks || reviewerRemarks) && (
                <div
                  className={`px-6 py-4 border-t ${isFromQA ? "bg-amber-50 border-amber-100" : "bg-slate-50 border-slate-100"}`}
                >
                  <div className="flex items-start gap-3">
                    <svg
                      className={`w-4 h-4 mt-0.5 flex-shrink-0 ${isFromQA ? "text-amber-500" : "text-slate-400"}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                      />
                    </svg>
                    <div className="flex-1 min-w-0">
                      <span
                        className={`text-xs font-semibold uppercase tracking-wide ${isFromQA ? "text-amber-600" : "text-slate-500"}`}
                      >
                        {isFromQA ? "QA Remarks" : "Your Remarks"}
                      </span>
                      <p
                        className={`mt-1 text-sm italic leading-relaxed ${isFromQA ? "text-amber-900" : "text-slate-700"}`}
                      >
                        &ldquo;{isFromQA ? qaRemarks : reviewerRemarks}&rdquo;
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          );
        }

        if (param) {
          const isQAApproved = !!approvedByQAPerParam[parameterId];
          const isReviewerApproved = isApproved;
          const isAnalysisRevisionState = isAnalysisRevision;

          // ── STAGE 3: Fully QA Approved (final) ──────────────────────
          if (isQAApproved) {
            return (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8 rounded-xl overflow-hidden border border-emerald-200 shadow-lg bg-white"
              >
                <div className="bg-gradient-to-r from-emerald-50 via-emerald-100 to-emerald-50 px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                        <svg
                          className="w-5 h-5 text-emerald-600"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-800">
                          Approved & Finalized
                        </h4>
                        <p className="text-xs text-slate-600">
                          This parameter has been fully approved. All data is
                          locked.
                        </p>
                      </div>
                    </div>
                    <div className="px-3 py-1.5 bg-emerald-100 border border-emerald-300 rounded-lg">
                      <span className="text-xs font-semibold text-emerald-800">
                        QA Approved
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          }

          // ── STAGE 2: Reviewer Approved — Awaiting QA ────────────────
          if (isReviewerApproved) {
            return (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8 rounded-xl overflow-hidden border border-slate-200 shadow-lg bg-white"
              >
                <div className="bg-gradient-to-r from-emerald-50 via-emerald-100 to-emerald-50 px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                        <svg
                          className="w-5 h-5 text-emerald-600"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-800">
                          Approved by Reviewer — Awaiting QA Approval
                        </h4>
                        <p className="text-xs text-slate-600">
                          {role.toLowerCase() === "qa"
                            ? "You can return this parameter for revision, or approve the entire worksheet once all parameters are reviewed"
                            : "Awaiting QA validation"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {role.toLowerCase() === "qa" && (
                        <motion.button
                          onClick={() => handleQARequestRevision(param)}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="px-4 py-2 bg-white/60 backdrop-blur-sm border border-amber-200 text-amber-700 text-sm font-semibold rounded-lg hover:bg-white/80 hover:border-amber-300 transition-all flex items-center gap-2 shadow-sm"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                            />
                          </svg>
                          Return for Revision
                        </motion.button>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          }

          // ── STAGE 1: Revision In Progress ──
          if (isAnalysisRevisionState) {
            const qaRemarks = remarksQAPerParam[parameterId];
            const reviewerRemarks = remarksByReviewerPerParam[parameterId];
            const isFromQA = !!qaRemarks;
            return (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8 rounded-xl overflow-hidden border border-slate-200 shadow-lg bg-white"
              >
                <div className="bg-gradient-to-r from-amber-50 via-amber-100 to-amber-50 px-6 py-4 border-b border-slate-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                        <svg
                          className="w-5 h-5 text-amber-600 animate-pulse"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-800">
                          Revision In Progress —{" "}
                          {isFromQA ? "Returned by QA" : "Returned by Reviewer"}
                        </h4>
                        <p className="text-xs text-slate-600">
                          Analyst is working on revisions
                        </p>
                      </div>
                    </div>
                    <div className="px-4 py-2 bg-white/60 backdrop-blur-sm border border-amber-200 rounded-lg">
                      <span className="text-xs font-semibold text-amber-700 uppercase tracking-wider">
                        Awaiting Revision
                      </span>
                    </div>
                  </div>
                </div>
                {(qaRemarks || reviewerRemarks) && (
                  <div
                    className={`px-6 py-4 border-t ${isFromQA ? "bg-amber-50 border-amber-100" : "bg-slate-50 border-slate-100"}`}
                  >
                    <div className="flex items-start gap-3">
                      <svg
                        className={`w-4 h-4 mt-0.5 flex-shrink-0 ${isFromQA ? "text-amber-500" : "text-slate-400"}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                        />
                      </svg>
                      <div className="flex-1 min-w-0">
                        <span
                          className={`text-xs font-semibold uppercase tracking-wide ${isFromQA ? "text-amber-600" : "text-slate-500"}`}
                        >
                          {isFromQA ? "QA Remarks" : "Reviewer Remarks"}
                        </span>
                        <p
                          className={`mt-1 text-sm italic leading-relaxed ${isFromQA ? "text-amber-900" : "text-slate-700"}`}
                        >
                          &ldquo;{isFromQA ? qaRemarks : reviewerRemarks}&rdquo;
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            );
          }

          // ── STAGE 0: Pending Reviewer Approval ──────────────────────
          return (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 rounded-xl overflow-hidden border border-slate-200 shadow-lg bg-white"
            >
              <div className="bg-gradient-to-r from-slate-50 via-gray-50 to-slate-50 px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-slate-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">
                      Pending Reviewer Approval
                    </h4>
                    <p className="text-xs text-slate-600">
                      Status:{" "}
                      <span className="uppercase font-semibold">{status}</span>
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        }
        // If none of the conditions match, return null (no action bar)
        return null;
      },
      (prevProps, nextProps) => {
        return prevProps.parameterId === nextProps.parameterId;
      },
    );
  // Loading/Error states
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="relative"
        >
          {/* Animated Background Circles */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.1, 0.3] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="absolute w-64 h-64 rounded-full bg-emerald-500/20 blur-3xl"
            />
            <motion.div
              animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.05, 0.2] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              className="absolute w-80 h-80 rounded-full bg-emerald-600/10 blur-3xl"
            />
          </div>

          <div className="relative overflow-hidden bg-gradient-to-br from-emerald-700 via-emerald-800 to-slate-900 rounded-2xl shadow-2xl border border-emerald-700/40 p-12 min-w-[400px]">
            {/* dot texture */}
            <div
              className="absolute inset-0 opacity-[0.04] pointer-events-none"
              style={{ backgroundImage: "radial-gradient(rgba(255,255,255,.8) 1px, transparent 1px)", backgroundSize: "18px 18px" }}
            />
            <div className="relative z-10 flex justify-center mb-6">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="relative w-20 h-20"
              >
                <div className="absolute inset-0 rounded-full border-4 border-white/10"></div>
                <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-emerald-400 border-r-emerald-400"></div>
                <div className="absolute inset-2 rounded-full bg-white/5"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg className="w-8 h-8 text-emerald-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              </motion.div>
            </div>

            <div className="relative z-10 text-center space-y-3">
              <motion.h3
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-2xl font-bold text-white"
              >
                Loading Worksheet
              </motion.h3>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="flex items-center justify-center gap-2 text-sm text-emerald-300/80"
              >
                <span>Fetching data for</span>
                <span className="px-2 py-0.5 bg-white/15 text-emerald-200 rounded font-semibold border border-white/20">
                  {worksheetId}
                </span>
              </motion.div>

              <motion.div
                className="flex justify-center gap-1.5 pt-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    animate={{ scale: [1, 1.2, 1], opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
                    className="w-2 h-2 rounded-full bg-emerald-400"
                  />
                ))}
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 flex items-center justify-center p-4">
        <motion.div
          key="error"
          {...animationProps}
          className="flex flex-col justify-center items-center py-20 bg-gradient-to-br from-emerald-800 via-emerald-900 to-slate-900 rounded-2xl shadow-2xl border border-red-500/30 w-full max-w-lg min-h-[400px] relative overflow-hidden"
        >
          <div className="absolute inset-0 opacity-[0.04] pointer-events-none" style={{ backgroundImage: "radial-gradient(rgba(255,255,255,.8) 1px, transparent 1px)", backgroundSize: "18px 18px" }} />
          <motion.div
            {...loadingIconProps}
            className="relative z-10 p-5 rounded-full bg-red-500/20 border border-red-400/30 mb-6 shadow-lg"
          >
            <Target className="w-14 h-14 text-red-400" />
          </motion.div>
          <span className="relative z-10 text-2xl font-semibold text-white tracking-wide">
            Failed to Load Worksheet
          </span>
          <span className="relative z-10 text-base text-emerald-300/70 mt-3 max-w-md text-center px-6">
            {error}
          </span>
        </motion.div>
      </div>
    );
  }

  if (
    role === "QA" &&
    worksheetInfo &&
    worksheetInfo.sample.status !== "Submitted For QA Review" &&
    worksheetInfo.sample.status !== "Approved"
  ) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 flex items-center justify-center p-4">
        <motion.div
          key="qa-gate"
          {...animationProps}
          className="flex flex-col justify-center items-center py-20 bg-gradient-to-br from-emerald-800 via-emerald-900 to-slate-900 rounded-2xl shadow-2xl border border-violet-500/30 w-full max-w-lg min-h-[400px] relative overflow-hidden"
        >
          <div className="absolute inset-0 opacity-[0.04] pointer-events-none" style={{ backgroundImage: "radial-gradient(rgba(255,255,255,.8) 1px, transparent 1px)", backgroundSize: "18px 18px" }} />
          <motion.div
            {...loadingIconProps}
            className="relative z-10 p-5 rounded-full bg-violet-500/20 border border-violet-400/30 mb-6 shadow-lg"
          >
            <svg className="w-14 h-14 text-violet-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          </motion.div>
          <span className="relative z-10 text-2xl font-semibold text-white tracking-wide">
            Awaiting QA Submission
          </span>
          <span className="relative z-10 text-base text-emerald-300/70 mt-3 max-w-md text-center px-6">
            This worksheet has not yet been submitted for QA Review. It will become available once the Reviewer submits it after approving all parameters.
          </span>
          <div className="relative z-10 mt-4 px-4 py-2 bg-violet-500/20 rounded-lg border border-violet-400/30">
            <span className="text-sm font-semibold text-violet-300 uppercase tracking-wider">
              Current Status: {worksheetInfo.sample.status}
            </span>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <>
      <Toast
        isVisible={showToast}
        message={toastMessage}
        type="success"
        onClose={() => setShowToast(false)}
      />
      <style>{`
        .prep-rich-content, .prep-rich-content * {
          font-family: inherit !important;
          font-size: 0.875rem !important;
        }
        .prep-rich-content p {
          margin: 0 0 0.25rem 0 !important;
          padding: 0 !important;
        }
        .prep-rich-content ul, .prep-rich-content ol {
          margin: 0 !important;
          padding-left: 1.25rem !important;
        }
        .blank-method-content, .blank-method-content * {
          font-family: inherit !important;
          font-size: 0.875rem !important;
        }
        .blank-method-content p {
          margin: 0 0 0.25rem 0 !important;
          padding: 0 !important;
        }
        .ws-prose-reset, .ws-prose-reset * {
          font-family: inherit !important;
          font-size: 0.875rem !important;
        }
        .ws-prose-reset p {
          margin: 0 0 0.25rem 0 !important;
          padding: 0 !important;
        }
        .ws-prose-reset ul, .ws-prose-reset ol {
          margin: 0 !important;
          padding-left: 1.25rem !important;
        }
      `}</style>

      <div className="flex items-start gap-0 min-h-screen bg-slate-900 no-print-layout">


        <div className="flex-1 min-w-0 overflow-y-auto">
          <div className="mx-auto my-8 p-8 bg-white shadow-2xl max-w-4xl border border-emerald-900/30 rounded-2xl">
            <div className="flex justify-between items-center text-sm mb-6 pb-4 border-b border-slate-200">
              <div></div>
              <div className="flex flex-col items-end">
                <img src="/ic_efrac.png" alt="EFRAC Logo" className="h-10" />
              </div>
            </div>

            {/* Add after the error state check (around line 2830) */}
            {!isLoading &&
              !error &&
              worksheetInfo?.sample.status.toLowerCase() === "approved" && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 relative overflow-hidden rounded-2xl"
                >
                  {/* Animated background */}
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-700 via-emerald-1000 to-slate-800" />
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-700/50 via-emerald-500/50 to-emerald-400/50 animate-pulse" />

                  {/* Decorative elements */}
                  <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
                  <div className="absolute bottom-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

                  {/* Content */}
                  <div className="relative px-8 py-6 flex items-center justify-between">
                    <div className="flex items-center gap-6">
                      <motion.div
                        animate={{
                          scale: [1, 1.1, 1],
                          rotate: [0, 5, -5, 0],
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="relative"
                      >
                        <div className="absolute inset-0 bg-white/30 rounded-2xl blur-xl" />
                        <div className="relative w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border-2 border-white/40">
                          <svg
                            className="w-10 h-10 text-white"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      </motion.div>

                      <div>
                        <h2 className="text-2xl font-bold text-white mb-1 flex items-center gap-2">
                          Worksheet Approved & Finalized
                        </h2>
                        <p className="text-emerald-50 text-sm font-medium">
                          This worksheet has been reviewed and approved. All data is
                          locked and finalized.
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

            <div className="my-4 border border-emerald-900/40 mb-6 rounded-xl overflow-hidden shadow-xl">
              <div className="relative flex justify-between items-center px-6 py-5 bg-gradient-to-r from-emerald-700 via-emerald-800 to-slate-900 overflow-hidden">
                {/* Dot grid texture */}
                <div
                  className="absolute inset-0 opacity-[0.045] pointer-events-none"
                  style={{
                    backgroundImage: "radial-gradient(rgba(255,255,255,.9) 1px, transparent 1px)",
                    backgroundSize: "18px 18px",
                  }}
                />
                {/* Glow blobs */}
                <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-emerald-400/15 blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-12 w-28 h-28 rounded-full bg-teal-300/10 blur-2xl pointer-events-none" />
                <div className="relative flex items-center gap-4">
                  <h1 className="flex items-baseline gap-3 tracking-wide text-white">
                    <span className="text-sm font-semibold">Worksheet ID:</span>
                    <span className="text-2xl font-extrabold">{worksheetId}</span>
                  </h1>

                  {displayStatus && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: "spring", duration: 0.6 }}
                      className="ml-4"
                    >
                      {displayStatus.toLowerCase() === "approved" ? (
                        <div className="relative">
                          <div className="relative px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-lg border border-white/30 flex items-center gap-2">
                            <motion.div
                              animate={{ rotate: [0, 360] }}
                              transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: "linear",
                              }}
                            >
                              <svg
                                className="w-4 h-4 text-white"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </motion.div>
                            <span className="text-xs font-bold text-white uppercase tracking-wider">
                              Approved
                            </span>
                          </div>
                        </div>
                      ) : displayStatus.toLowerCase() ===
                        "submitted for analysis" ? (
                        <div className="relative px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-lg border border-white/30 flex items-center gap-2">
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              ease: "linear",
                            }}
                            className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full"
                          />
                          <span className="text-xs font-bold text-white uppercase tracking-wide">
                            In Analysis
                          </span>
                        </div>
                      ) : displayStatus.toLowerCase() === "pending for review" ? (
                        <div className="relative px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-lg border border-white/30 flex items-center gap-2">
                          <motion.div
                            animate={{
                              scale: [1, 1.2, 1],
                              opacity: [1, 0.8, 1],
                            }}
                            transition={{
                              duration: 1.5,
                              repeat: Infinity,
                              ease: "easeInOut",
                            }}
                          >
                            <svg
                              className="w-4 h-4 text-white"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={2}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                              />
                            </svg>
                          </motion.div>
                          <span className="text-xs font-bold text-white uppercase tracking-wide">
                            Pending For Review
                          </span>
                        </div>
                      ) : (
                        <div className="relative px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-lg border border-white/30 flex items-center gap-2">
                          <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                          <span className="text-xs font-bold text-white uppercase tracking-wide">
                            {displayStatus}
                          </span>
                        </div>
                      )}
                    </motion.div>
                  )}
                </div>
              </div>
            </div>
            <div className="my-4 border border-emerald-900/30 rounded-xl overflow-hidden shadow-md">
              <div className="relative grid grid-cols-2 border-b border-white/10 text-sm bg-gradient-to-br from-emerald-700 via-emerald-800 to-slate-900 overflow-hidden">
                <div
                  className="absolute inset-0 opacity-[0.04] pointer-events-none"
                  style={{
                    backgroundImage: "radial-gradient(rgba(255,255,255,.9) 1px, transparent 1px)",
                    backgroundSize: "16px 16px",
                  }}
                />
                <div className="relative flex items-center px-4 py-3 border-r border-white/10">
                  <span className="font-bold mr-2 text-emerald-300 text-xs uppercase tracking-wider">
                    Registration No:
                  </span>
                  <span className="font-semibold text-white text-sm">
                    {worksheetInfo
                      ? worksheetInfo!.sample.registrationNo
                      : registrationNo || "---"}
                  </span>
                </div>
                <div className="relative flex items-center px-4 py-3">
                  <span className="font-bold mr-2 text-emerald-300 text-xs uppercase tracking-wider">
                    Sample Name:
                  </span>
                  <span className="font-semibold text-white text-sm">
                    {worksheetInfo!.sample.sampleName || "---"}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 text-sm bg-white">
                <div className="flex items-center px-4 py-3 border-r border-emerald-100">
                  <span className="font-bold mr-2 text-emerald-800">
                    Number of Parameters:
                  </span>
                  <span className="font-semibold text-slate-700">
                    {allParameters.length}
                  </span>
                </div>
                <div className="flex items-center px-4 py-3">
                  <span className="font-bold mr-2 text-emerald-800">Due Date:</span>
                  <span className="font-semibold text-slate-700">
                    {formatDate(worksheetInfo!.sample?.dueDate) || "---"}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-0 my-8">
              <div className="my-4 border border-emerald-900/30 mb-6 rounded-xl overflow-hidden shadow-md">
                <table className="w-full border-collapse text-sm shadow-md rounded-xl overflow-hidden">
                  <tbody>
                    <tr className="border-b border-emerald-900/20 hover:bg-emerald-50 transition-colors">
                      <td className="w-10 px-4 py-4 border-r border-emerald-900/20 font-bold text-center bg-gradient-to-br from-emerald-700 to-emerald-900 text-emerald-200">
                        1
                      </td>
                      <td className="w-1/3 px-4 py-4 border-r border-emerald-100 font-bold bg-gradient-to-r from-emerald-50 to-white text-emerald-800">
                        Sample Particulars (All relevant information received with
                        sample to be entered):
                      </td>
                      <td className="px-3 py-3 font-medium">
                        {worksheetInfo!.sample.sampleName || "---"}
                      </td>
                    </tr>
                    <tr className="border-b border-emerald-900/20 hover:bg-emerald-50 transition-colors">
                      <td className="w-10 px-4 py-4 border-r border-emerald-900/20 font-bold text-center bg-gradient-to-br from-emerald-700 to-emerald-900 text-emerald-200">
                        2
                      </td>
                      <td className="w-1/3 px-4 py-4 border-r border-emerald-100 font-bold bg-gradient-to-r from-emerald-50 to-white text-emerald-800">
                        Test(s) required (all tests and condition to be entered):
                      </td>
                      <td className="px-3 py-3 font-medium">
                        {testsRequiredDisplay || "No parameters added"}
                      </td>
                    </tr>
                    <tr className="hover:bg-emerald-50 transition-colors">
                      <td className="w-10 px-4 py-4 border-r border-emerald-900/20 font-bold text-center bg-gradient-to-br from-emerald-700 to-emerald-900 text-emerald-200">
                        3
                      </td>
                      <td className="w-1/3 px-4 py-4 border-r border-emerald-100 font-bold bg-gradient-to-r from-emerald-50 to-white text-emerald-800">
                        Method(s) of Analysis / Testing
                      </td>
                      <td className="px-3 py-3 h-16 font-medium">
                        {methodsRequiredDisplay || "No methods"}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="my-6 rounded-xl shadow-xl border border-emerald-900/30">
                {/* Section header */}
                <div className="relative rounded-xl px-5 py-4 bg-gradient-to-br from-emerald-700 via-emerald-800 to-slate-900">
                  <div
                    className="absolute inset-0 opacity-[0.04] pointer-events-none"
                    style={{
                      backgroundImage: "radial-gradient(rgba(255,255,255,.9) 1px, transparent 1px)",
                      backgroundSize: "18px 18px",
                    }}
                  />
                  <div className="absolute -top-6 -right-6 w-32 h-32 rounded-full bg-emerald-400/15 blur-3xl pointer-events-none" />
                  <div className="relative flex items-center justify-between">
                    <h3 className="text-xl font-bold text-white flex items-center gap-3">
                      <div className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/20 shadow-inner">
                        <IoFlask className="w-5 h-5 text-emerald-300" />
                      </div>
                      <span>Parameters Management</span>
                    </h3>

                    {role === "Reviewer" &&
                      worksheetInfo?.sample.status !== "Approved" && (
                        <div className="relative">
                          <button
                            onClick={() =>
                              setShowParameterDropdown(!showParameterDropdown)
                            }
                            disabled={availableToAdd.length === 0}
                            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-emerald-600 text-white font-semibold rounded-lg hover:from-emerald-700 hover:to-emerald-800 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                          >
                            <Plus className="w-4 h-4" />
                            Add Parameter
                          </button>

                          <AnimatePresence>
                            {showParameterDropdown && (
                              <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="absolute right-0 mt-2 w-72 bg-white border border-emerald-300 rounded-lg shadow-xl z-50 max-h-80 overflow-y-auto"
                              >
                                {availableToAdd.map((param) => (
                                  <button
                                    key={param.paraCode}
                                    onClick={() =>
                                      handleAddParameter({
                                        paraCode: param.paraCode,
                                        methodName: param.methodName,
                                        methodCode: param.methodCode,
                                        parameterName: param.parameter,
                                        id: 0,
                                        instruments: [],
                                        chemicals: [],
                                        standards: [],
                                        preparations: [],
                                        calculations: [],
                                        files: [],
                                        preparationCompletedBy: null,
                                        preparationCompletedAt: null,
                                        remarksByAnalyst: null,
                                        analyzedBy: null,
                                        approvedByReviewer: null,
                                        analyzedByName: null,
                                        approvedByReviewerName: null,
                                        analysisStartDate: null,
                                        analysisCompletionDate: null,
                                        approvedAtReviewer: null,
                                        approvedByQAName: null,
                                        approvedByQA: null,
                                        approvedAtQA: null,
                                        remarksByReviewer: null,
                                        remarksByQA: null,
                                        status: null,
                                        submittedQaByName: null,
                                        submittedQaBy: null,
                                        additional_info: null
                                      })
                                    }
                                    className="w-full text-left px-3 py-2 hover:bg-emerald-50 border-b border-emerald-200 last:border-b-0 transition-colors text-sm"
                                  >
                                    <div className="font-semibold text-gray-900">
                                      {param.parameter}
                                    </div>
                                    <div className="text-xs text-gray-600">
                                      {param.paraCode} • {param.methodName}
                                    </div>
                                  </button>
                                ))}
                                {availableToAdd.length === 0 && (
                                  <div className="px-3 py-4 text-center text-gray-500 text-sm">
                                    All parameters have been added
                                  </div>
                                )}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      )}
                  </div>

                  <AnimatePresence>
                    {addedParameters.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-2"
                      >
                        {addedParameters.map((param) => {
                          const isLocked = isParameterLocked(param.id);
                          const status =
                            parameterStatusPerParam[param.id] || "created";

                          // Add these to your status constants (around line 350)
                          const STATUS_COLORS = {
                            created: {
                              bg: "bg-emerald-100",
                              border: "border-emerald-300",
                              text: "text-emerald-800",
                              label: "CREATED",
                            },
                            "analysis pending": {
                              bg: "bg-emerald-100",
                              border: "border-emerald-300",
                              text: "text-emerald-800",
                              label: "ANALYSIS PENDING",
                            },
                            "analysis started": {
                              bg: "bg-emerald-100",
                              border: "border-emerald-300",
                              text: "text-emerald-800",
                              label: "ANALYSIS STARTED",
                            },
                            "analysis completed": {
                              bg: "bg-emerald-100",
                              border: "border-emerald-300",
                              text: "text-emerald-800",
                              label: "ANALYSIS COMPLETED",
                            },
                            approved: {
                              bg: "bg-emerald-100",
                              border: "border-emerald-300",
                              text: "text-emerald-800",
                              label: "APPROVED",
                            },
                            "analysis revision": {
                              bg: "bg-orange-100",
                              border: "border-orange-300",
                              text: "text-orange-800",
                              label: "REVISION REQUESTED",
                            },
                            "analysis revision started": {
                              bg: "bg-orange-100",
                              border: "border-orange-300",
                              text: "text-orange-800",
                              label: "REVISION IN PROGRESS",
                            },
                            disapproved: {
                              bg: "bg-red-100",
                              border: "border-red-300",
                              text: "text-red-700",
                              label: "DISAPPROVED",
                            },
                          };

                          const currentStatus =
                            STATUS_COLORS[
                            status.toLowerCase() as keyof typeof STATUS_COLORS
                            ] || STATUS_COLORS.created;

                          return (
                            <motion.div
                              key={param.id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: 20 }}
                              className={`relative flex items-center justify-between mt-5 p-4 rounded-xl shadow-inner transition-all duration-300 ${isLocked
                                ? "bg-gradient-to-r from-slate-100 via-slate-50 to-slate-100 border-2 border-slate-300"
                                : "bg-gradient-to-r from-emerald-50 via-emerald-50 to-emerald-50 border-2 border-emerald-200"
                                }`}
                            >
                              {/* Locked Overlay Effect */}
                              {isLocked && (
                                <div className="absolute inset-0 bg-gradient-to-br from-slate-200/30 to-slate-300/30 backdrop-blur-[1px] rounded-xl pointer-events-none">
                                  <div className="absolute top-2 right-2">
                                    <motion.div
                                      initial={{ scale: 0, rotate: -180 }}
                                      animate={{ scale: 1, rotate: 0 }}
                                      transition={{ type: "spring", duration: 0.6 }}
                                      className="w-8 h-8 bg-slate-600 rounded-full flex items-center justify-center shadow-lg"
                                    >
                                      <svg
                                        className="w-4 h-4 text-white"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                      >
                                        <path
                                          fillRule="evenodd"
                                          d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                                          clipRule="evenodd"
                                        />
                                      </svg>
                                    </motion.div>
                                  </div>
                                </div>
                              )}

                              <div className="flex-1 relative z-10">
                                <div className="flex items-center gap-3 mb-2">
                                  <div
                                    className={`font-semibold text-sm ${isLocked ? "text-slate-700" : "text-emerald-800"
                                      }`}
                                  >
                                    {param.parameterName}
                                  </div>

                                  {/* Status Badge */}
                                  <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className={`inline-flex items-center gap-1.5 px-3 py-1 ${currentStatus.bg} ${currentStatus.border} border-2 rounded-full shadow-sm`}
                                  >
                                    <span
                                      className={`text-xs font-bold ${currentStatus.text} uppercase tracking-wide`}
                                    >
                                      {currentStatus.label}
                                    </span>
                                  </motion.div>

                                  {/* Locked Badge */}
                                  {isLocked && (
                                    <motion.div
                                      initial={{ scale: 0, x: -10 }}
                                      animate={{ scale: 1, x: 0 }}
                                      className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-200 border-2 border-slate-400 rounded-full shadow-sm"
                                    >
                                      <svg
                                        className="w-3 h-3 text-slate-700"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                      >
                                        <path
                                          fillRule="evenodd"
                                          d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                                          clipRule="evenodd"
                                        />
                                      </svg>
                                      <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                                        LOCKED
                                      </span>
                                    </motion.div>
                                  )}
                                </div>

                                <div
                                  className={`text-xs ${isLocked ? "text-slate-600" : "text-emerald-600"
                                    }`}
                                >
                                  {param.paraCode} • {param.methodName}
                                </div>

                                {analyzedByPerParam[param.id] && (
                                  <div
                                    className={`mt-1 text-xs font-medium ${isLocked ? "text-slate-700" : "text-emerald-800"
                                      }`}
                                  >
                                    Assigned to: {analyzedByNamePerParam[param.id]}
                                  </div>
                                )}

                                {/* Locked Message */}
                                {isLocked && (
                                  <motion.div
                                    initial={{ opacity: 0, y: -5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="mt-2 flex items-center gap-2 text-xs text-slate-600 bg-slate-200/50 px-3 py-1.5 rounded-lg"
                                  >
                                    <svg
                                      className="w-4 h-4"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      stroke="currentColor"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                      />
                                    </svg>
                                    <span className="font-medium">
                                      This parameter is locked and cannot be modified
                                      during analysis
                                    </span>
                                  </motion.div>
                                )}
                              </div>

                              <div className="flex gap-2 relative z-10">
                                <button
                                  onClick={() => toggleParameterDetail(param.id)}
                                  className={`
                            group relative inline-flex items-center gap-2 px-3 py-1.5 
                            rounded-md border text-xs font-semibold tracking-tight transition-all duration-200
                            ${selectedParamsForDetail.includes(param.id)
                                      ? "bg-emerald-50 border-emerald-200 text-emerald-800 hover:bg-emerald-100 shadow-sm"
                                      : "bg-emerald-50 border-emerald-200 text-emerald-800 hover:bg-emerald-100 shadow-sm"
                                    }
                          `}
                                >
                                  {/* The "Dot" Indicator - Classic status signal */}
                                  <span
                                    className={`h-1.5 w-1.5 rounded-full ${selectedParamsForDetail.includes(param.id)
                                      ? "bg-emerald-500 animate-pulse"
                                      : "bg-emerald-500"
                                      }`}
                                  />

                                  <span>
                                    {selectedParamsForDetail.includes(param.id)
                                      ? "CLICK TO HIDE"
                                      : "CLICK TO VIEW"}
                                  </span>

                                  {/* Subtle chevron icon for a classic feel */}
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className={`h-3 w-3 transition-transform duration-200 ${selectedParamsForDetail.includes(param.id)
                                      ? "rotate-180"
                                      : ""
                                      }`}
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth={3}
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      d="M19 9l-7 7-7-7"
                                    />
                                  </svg>
                                </button>

                                {role === "Reviewer" && !isLocked && (
                                  <motion.button
                                    onClick={() => {
                                      setShowDeleteDialog(true);
                                      setParameterToDelete(param);
                                    }}
                                    whileHover={{ scale: 1.1, rotate: 10 }}
                                    whileTap={{ scale: 0.9 }}
                                    className="mx-2"
                                  >
                                    <CgTrash className="w-5 h-5 text-red-500" />
                                  </motion.button>
                                )}
                              </div>
                            </motion.div>
                          );
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {addedParameters.length === 0 && (
                    <motion.div
                      key="empty-state-content"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-center py-12 text-gray-500 mt-4 bg-gradient-to-br from-emerald-100 via-emerald-50 to-emerald-100 rounded-2xl border-2 border-dashed border-gray-300 shadow-inner"
                      layout
                    >
                      <div className="inline-block">
                        <Target className="w-14 h-14 text-gray-300" />
                      </div>
                      <p className="text-base font-bold text-gray-800 mb-2">
                        No parameters added yet
                      </p>
                      <p className="text-sm text-gray-600 max-w-md mx-auto">
                        {role === "Reviewer"
                          ? 'Click the "Add Parameters" button above to add parameters'
                          : "Reviewer will add parameters for analysis"}
                      </p>
                    </motion.div>
                  )}
                </div>
              </div>

              <AnimatePresence>
                {isSaving && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3"
                  >
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-5 h-5 border-2 border-emerald-600 border-t-transparent rounded-full"
                    />
                    <span className="text-sm font-semibold text-emerald-800">
                      Saving parameter assignment to database...
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>

              {addedParameters
                .filter((param) => selectedParamsForDetail.includes(param.id))
                .map((selectedParam) => {
                  const isLocked = isParameterLocked(selectedParam?.id);
                  const isEditableForAnalyst = isParameterEditableForAnalyst(
                    selectedParam?.id,
                  );

                  const shouldDisableContent =
                    (role === "Reviewer" && isLocked) ||
                    role === "QA" ||
                    (role === "Analyst" && !isEditableForAnalyst);

                  // isPreparationLocked: locks ONLY the preparation sections (instruments, chemicals,
                  // standards, buffer, mobile phase, diluent, std/sample prep inputs).
                  // Does NOT lock calculations, system suitability, or other attachments.
                  const isPreparationLocked =
                    !!preparationCompletedAtPerParam[selectedParam.id] ||
                    shouldDisableContent;

                  // isFullyLocked: locks EVERYTHING — preparation AND calculations/system
                  // suitability/other attachments. Triggered when the parameter itself is locked.
                  // For Analyst role: isLocked is true during "analysis started"/"analysis revision"
                  // (because isParameterLocked checks those statuses), but analysts must still be
                  // able to edit calculations, system suitability, and attach files in those states.
                  // So we use shouldDisableContent which is already role-aware: it is false for
                  // analysts when isEditableForAnalyst is true (i.e. started/revision statuses).
                  const isFullyLocked = shouldDisableContent;

                  // canManagePrep: controls prep Complete/Unlock buttons.
                  // Step 1: is the user blocked from editing this param? (role-aware)
                  // Step 2: block only at terminal statuses where nobody can manage prep.
                  // This means Analysts with "analysis started"/"analysis revision" DO see the buttons.
                  const _paramStatusForPrep = (
                    parameterStatusPerParam[selectedParam.id] || "created"
                  ).toLowerCase();
                  const canManagePrep =
                    !shouldDisableContent &&
                    !["analysis completed", "approved"].includes(
                      _paramStatusForPrep,
                    );
                  return (
                    <AnimatePresence key={selectedParam.id}>
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="my-6"
                      >
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mb-8 relative overflow-hidden rounded-2xl bg-white border border-slate-200 shadow-lg"
                        >
                          {/* Parameter detail header — dark gradient */}
                          <div className="relative overflow-hidden bg-gradient-to-r from-emerald-700 via-emerald-800 to-slate-900 px-6 py-4 border-b border-slate-800/30">
                            <div
                              className="absolute inset-0 opacity-[0.04] pointer-events-none"
                              style={{
                                backgroundImage: "radial-gradient(rgba(255,255,255,.8) 1px, transparent 1px)",
                                backgroundSize: "18px 18px",
                              }}
                            />
                            <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-emerald-400/10 blur-2xl pointer-events-none" />
                            <div className="relative z-10 flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                <div className="relative">
                                  <div className="w-10 h-10 bg-white/15 border border-white/20 rounded-xl flex items-center justify-center">
                                    <svg
                                      className="w-5 h-5 text-emerald-300"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      stroke="currentColor"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                                      />
                                    </svg>
                                  </div>
                                </div>
                                <div>
                                  <h3 className="text-base font-bold text-white tracking-tight">
                                    Parameter Overview
                                  </h3>
                                  <p className="text-emerald-300/80 text-xs font-medium mt-0.5">
                                    Complete analysis information
                                  </p>
                                </div>
                              </div>
                              <motion.button
                                onClick={() =>
                                  toggleParameterDetail(selectedParam.id)
                                }
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/15 border border-white/20 hover:bg-white/25 transition-all duration-200"
                              >
                                <span className="text-white/80 text-lg font-bold">
                                  ✕
                                </span>
                              </motion.button>
                            </div>
                          </div>

                          {/* Content Section */}
                          <div className="p-6 bg-slate-50/50 space-y-6">
                            {/* Parameter Details Grid */}
                            <div className="grid grid-cols-2 gap-4">
                              <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.1 }}
                                className="relative group"
                              >
                                <div className="relative bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-300 hover:border-emerald-300">
                                  <div className="flex items-center gap-2 mb-2">
                                    <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                                    <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                                      Parameter Code
                                    </span>
                                  </div>
                                  <p className="text-lg font-bold text-slate-900">
                                    {selectedParam.paraCode}
                                  </p>
                                </div>
                              </motion.div>

                              <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 }}
                                className="relative group"
                              >
                                <div className="relative bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-300 hover:border-emerald-300">
                                  <div className="flex items-center gap-2 mb-2">
                                    <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                                    <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                                      Parameter Name
                                    </span>
                                  </div>
                                  <p className="text-lg font-bold text-slate-900">
                                    {selectedParam.parameterName}
                                  </p>
                                </div>
                              </motion.div>
                            </div>

                            {role !== "Analyst" && (
                              <>
                                {analyzedByPerParam[selectedParam.id] && (
                                  <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                    className="relative group"
                                  >
                                    <div className="relative bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-300 hover:border-emerald-300">
                                      <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-2">
                                          <div className="w-1 h-5 bg-emerald-500 rounded-full" />
                                          <h4 className="text-sm font-semibold text-slate-800 uppercase tracking-wider">
                                            Assigned Analyst
                                          </h4>
                                        </div>
                                      </div>

                                      <div className="flex items-center gap-4">
                                        {/* Avatar */}
                                        <div className="relative">
                                          <div className="relative w-14 h-14 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center ring-2 ring-emerald-200">
                                            <span className="text-white text-lg font-bold">
                                              {analyzedByNamePerParam[
                                                selectedParam.id
                                              ].charAt(0) || "A"}
                                            </span>
                                          </div>
                                        </div>

                                        <div className="flex-1">
                                          <div className="font-semibold text-base text-slate-900 mb-1">
                                            {analyzedByNamePerParam[
                                              selectedParam.id
                                            ] || "Unknown"}
                                          </div>
                                          <div className="flex items-center gap-2 flex-wrap">
                                            <span className="inline-flex items-center px-3 py-1 bg-emerald-50 border border-emerald-200 rounded-lg text-xs font-semibold text-emerald-800">
                                              <svg
                                                className="w-3 h-3 mr-1.5"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                              >
                                                <path
                                                  strokeLinecap="round"
                                                  strokeLinejoin="round"
                                                  strokeWidth={2}
                                                  d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"
                                                />
                                              </svg>
                                              {analyzedByPerParam[
                                                selectedParam.id
                                              ]}
                                            </span>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </motion.div>
                                )}
                              </>
                            )}

                            {role === "QA" && (
                              <>
                                {analyzedByPerParam[selectedParam.id] && (
                                  <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                    className="relative group"
                                  >
                                    <div className="relative bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-300 hover:border-emerald-300">
                                      <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-2">
                                          <div className="w-1 h-5 bg-emerald-500 rounded-full" />
                                          <h4 className="text-sm font-semibold text-slate-800 uppercase tracking-wider">
                                            Assigned Reviewer
                                          </h4>
                                        </div>
                                        {!isLocked && (
                                          <motion.button
                                            onClick={() =>
                                              handleReassignAnalyst(
                                                selectedParam.id,
                                              )
                                            }
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            className="px-3 py-1.5 bg-white/60 backdrop-blur-sm border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-lg hover:bg-white hover:border-emerald-300 transition-all duration-200 flex items-center gap-1.5"
                                          >
                                            <svg
                                              className="w-3.5 h-3.5"
                                              fill="none"
                                              viewBox="0 0 24 24"
                                              stroke="currentColor"
                                            >
                                              <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                                              />
                                            </svg>
                                            Reassign
                                          </motion.button>
                                        )}
                                      </div>

                                      <div className="flex items-center gap-4">
                                        {/* Avatar */}
                                        <div className="relative">
                                          <div className="relative w-14 h-14 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center ring-2 ring-emerald-200">
                                            <span className="text-white text-lg font-bold">
                                              {approvedByReviewerNamePerParam[
                                                selectedParam.id
                                              ].charAt(0) || "A"}
                                            </span>
                                          </div>
                                        </div>

                                        {/* Analyst Info */}
                                        <div className="flex-1">
                                          <div className="font-semibold text-base text-slate-900 mb-1">
                                            {approvedByReviewerNamePerParam[
                                              selectedParam.id
                                            ] || "Unknown"}
                                          </div>
                                          <div className="flex items-center gap-2 flex-wrap">
                                            <span className="inline-flex items-center px-3 py-1 bg-emerald-50 border border-emerald-200 rounded-lg text-xs font-semibold text-emerald-800">
                                              <svg
                                                className="w-3 h-3 mr-1.5"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                              >
                                                <path
                                                  strokeLinecap="round"
                                                  strokeLinejoin="round"
                                                  strokeWidth={2}
                                                  d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"
                                                />
                                              </svg>
                                              {approvedByReviewerPerParam[selectedParam.id]}
                                            </span>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </motion.div>
                                )}
                              </>
                            )}

                            {/* Analysis Timeline Section */}
                            {(analysisStartDatePerParam[selectedParam.id] ||
                              analysisCompletionDatePerParam[selectedParam.id] ||
                              revisionStartDatePerParam[selectedParam.id] ||
                              revisionCompletedDatePerParam[selectedParam.id] ||
                              approvedByReviewerPerParam[selectedParam.id]) && (
                                <motion.div
                                  initial={{ opacity: 0, y: 20 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: 0.4 }}
                                  className="relative group"
                                >
                                  <div className="relative bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-300 hover:border-emerald-300">
                                    <div className="flex items-center gap-2 mb-4">
                                      <div className="w-1 h-5 bg-emerald-500 rounded-full" />
                                      <h4 className="text-sm font-semibold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                                        <svg
                                          className="w-4 h-4"
                                          fill="none"
                                          viewBox="0 0 24 24"
                                          stroke="currentColor"
                                        >
                                          <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                          />
                                        </svg>
                                        Analysis Timeline
                                      </h4>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                      {analysisStartDatePerParam[
                                        selectedParam.id
                                      ] && (
                                          <div className="bg-emerald-50 rounded-lg p-4 border border-slate-200 hover:border-emerald-300 transition-all">
                                            <div className="flex items-center gap-2 mb-2">
                                              <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                                                <svg
                                                  className="w-4 h-4 text-emerald-600"
                                                  fill="none"
                                                  viewBox="0 0 24 24"
                                                  stroke="currentColor"
                                                >
                                                  <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                                                  />
                                                  <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                                  />
                                                </svg>
                                              </div>
                                              <span className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
                                                Started
                                              </span>
                                            </div>
                                            <p className="text-sm font-semibold text-slate-900">
                                              {
                                                formatDate(analysisStartDatePerParam[
                                                  selectedParam.id
                                                ])
                                              }
                                            </p>
                                          </div>
                                        )}

                                      {analysisCompletionDatePerParam[
                                        selectedParam.id
                                      ] && (
                                          <div className="bg-emerald-50 rounded-lg p-4 border border-slate-200 hover:border-emerald-300 transition-all">
                                            <div className="flex items-center gap-2 mb-2">
                                              <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                                                <svg
                                                  className="w-4 h-4 text-emerald-600"
                                                  fill="none"
                                                  viewBox="0 0 24 24"
                                                  stroke="currentColor"
                                                >
                                                  <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                                  />
                                                </svg>
                                              </div>
                                              <span className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
                                                Completed
                                              </span>
                                            </div>
                                            <p className="text-sm font-semibold text-slate-900">
                                              {
                                                formatDate(analysisCompletionDatePerParam[
                                                  selectedParam.id
                                                ])
                                              }
                                            </p>
                                          </div>
                                        )}

                                      {revisionStartDatePerParam[
                                        selectedParam.id
                                      ] && (
                                          <div className="bg-orange-50 rounded-lg p-4 border border-orange-200 hover:border-orange-300 transition-all">
                                            <div className="flex items-center gap-2 mb-2">
                                              <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                                                <svg className="w-4 h-4 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                </svg>
                                              </div>
                                              <span className="text-xs font-semibold text-orange-700 uppercase tracking-wide">Revision Started</span>
                                            </div>
                                            <p className="text-sm font-semibold text-slate-900">{formatDate(revisionStartDatePerParam[selectedParam.id])}</p>
                                          </div>
                                        )}

                                      {revisionCompletedDatePerParam[
                                        selectedParam.id
                                      ] && (
                                          <div className="bg-orange-50 rounded-lg p-4 border border-orange-200 hover:border-orange-300 transition-all">
                                            <div className="flex items-center gap-2 mb-2">
                                              <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                                                <svg className="w-4 h-4 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                              </div>
                                              <span className="text-xs font-semibold text-orange-700 uppercase tracking-wide">Revision Completed</span>
                                            </div>
                                            <p className="text-sm font-semibold text-slate-900">{formatDate(revisionCompletedDatePerParam[selectedParam.id])}</p>
                                          </div>
                                        )}

                                      {approvedAtReviewerPerParam[
                                        selectedParam.id
                                      ] && (
                                          <div className="bg-emerald-50 rounded-lg p-4 border border-slate-200 hover:border-emerald-300 transition-all">
                                            <div className="flex items-center gap-2 mb-2">
                                              <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                                                <svg
                                                  className="w-4 h-4 text-emerald-600"
                                                  fill="none"
                                                  viewBox="0 0 24 24"
                                                  stroke="currentColor"
                                                >
                                                  <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                                                  />
                                                </svg>
                                              </div>
                                              <span className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
                                                Reviewed
                                              </span>
                                            </div>
                                            <p className="text-sm font-semibold text-slate-900">
                                              {
                                                formatDate(approvedAtReviewerPerParam[
                                                  selectedParam.id
                                                ])
                                              }
                                            </p>
                                          </div>
                                        )}
                                    </div>
                                  </div>
                                </motion.div>
                              )}
                          </div>
                        </motion.div>

                        {isLocked && (
                          <LockedParameterOverlay parameterId={selectedParam.id} />
                        )}

                        <div
                          className={
                            isPreparationLocked
                              ? "pointer-events-none opacity-70"
                              : ""
                          }
                        >
                          {/* Instruments Details */}
                          <div className="mb-4">
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="text-lg font-bold text-emerald-800 flex items-center gap-2.5 tracking-tight mb-3">
                                <span className="w-1.5 h-6 bg-gradient-to-b from-emerald-500 to-emerald-600 rounded-full"></span>
                                Instruments Details:
                              </h3>

                              <div className="relative" ref={instrumentRef}>
                                <button
                                  onClick={() =>
                                    setShowInstrumentDropdown(
                                      !showInstrumentDropdown,
                                    )
                                  }
                                  disabled={
                                    isReferenceDataLoading ||
                                    !!referenceDataError ||
                                    instruments.length === 0
                                  }
                                  className="flex items-center gap-2 p-1.5 bg-gradient-to-r from-emerald-600 to-emerald-600 text-white font-semibold rounded-2xl hover:from-emerald-700 hover:to-emerald-800 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-xs"
                                >
                                  <Plus className="w-4 h-4" />
                                </button>

                                <AnimatePresence>
                                  {showInstrumentDropdown && (
                                    <motion.div
                                      initial={{ opacity: 0, y: -10 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      exit={{ opacity: 0, y: -10 }}
                                      onMouseDown={(e) => e.stopPropagation()}
                                      className="absolute right-0 mt-2 w-80 bg-white border border-emerald-300 rounded-lg shadow-xl z-50"
                                    >
                                      <div className="p-2 border-b border-emerald-200">
                                        <div className="relative">
                                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                          <input
                                            type="text"
                                            placeholder="Search instruments..."
                                            value={instrumentSearch}
                                            onChange={(e) =>
                                              setInstrumentSearch(e.target.value)
                                            }
                                            className="w-full pl-10 pr-3 py-2 border border-emerald-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                          />
                                        </div>
                                      </div>
                                      <div className="max-h-64 overflow-y-auto">
                                        {searchFilteredInstruments
                                          .filter(
                                            (inst) =>
                                              !addedInstruments[
                                                selectedParam.id
                                              ]?.find(
                                                (added) => added.instrumentId === inst.id,
                                              ),
                                          )
                                          .map((inst) => (
                                            <button
                                              key={inst.id}
                                              onClick={() =>
                                                handleAddInstrument(
                                                  {
                                                    id: null,
                                                    parameterId: selectedParam.id,
                                                    instrumentId: inst.id,
                                                    name: inst.name,
                                                    instrumentTag: inst.instrumentTag ?? null,
                                                    make: inst.make ?? null,
                                                    calibrationDoneDate: inst.calibrationDoneDate ?? null,
                                                    calibrationDueDate: inst.calibrationDueDate ?? null,
                                                  },
                                                )
                                              }
                                              className="w-full text-left px-3 py-2 hover:bg-emerald-50 border-b border-emerald-200 last:border-b-0 transition-colors text-sm"
                                            >
                                              <div className="font-semibold text-gray-900">
                                                {inst.name}
                                              </div>
                                              <div className="text-xs text-gray-600">
                                                {inst.instrumentTag!}
                                              </div>
                                            </button>
                                          ))}
                                        {searchFilteredInstruments.filter(
                                          (inst) =>
                                            !addedInstruments[
                                              selectedParam.id
                                            ]?.find(
                                              (added) => added.instrumentId === inst.id,
                                            ),
                                        ).length === 0 && (
                                            <div className="px-3 py-4 text-center text-gray-500 text-sm">
                                              {instrumentSearch
                                                ? "No matching instruments"
                                                : "All available instruments added"}
                                            </div>
                                          )}
                                      </div>
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>
                            </div>

                            {isReferenceDataLoading && <ReferenceLoading />}
                            {referenceDataError && (
                              <ReferenceError error={referenceDataError} />
                            )}

                            {!isReferenceDataLoading && !referenceDataError && (
                              <table className="w-full border-collapse text-sm shadow-md">
                                <thead>
                                  <tr className="bg-emerald-100 border-2 border-emerald-500">
                                    <th className="px-3 py-2 border-r-2 border-emerald-500 text-left font-bold">
                                      Instrument Tag
                                    </th>
                                    <th className="px-3 py-2 border-r-2 border-emerald-500 text-left font-bold">
                                      Instrument Name
                                    </th>
                                    <th className="px-3 py-2 border-r-2 border-emerald-500 text-left font-bold">
                                      Calibration Done On
                                    </th>
                                    <th className="px-3 py-2 border-r-2 border-emerald-500 text-left font-bold">
                                      Calibration Due On
                                    </th>
                                    {role === "Reviewer" && (
                                      <th className="px-3 py-2 text-center font-bold w-20">
                                        Action
                                      </th>
                                    )}
                                  </tr>
                                </thead>
                                <tbody>
                                  <AnimatePresence>
                                    {addedInstruments[selectedParam.id]?.length >
                                      0 ? (
                                      addedInstruments[selectedParam.id].map(
                                        (instrument) => (
                                          <motion.tr
                                            key={instrument.id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: 20 }}
                                            className="border-2 border-emerald-500 hover:bg-emerald-50 transition-colors"
                                          >
                                            <td className="px-3 py-2 border-r-2 border-emerald-500">
                                              {instrument.instrumentTag! || "---"}
                                            </td>
                                            <td className="px-3 py-2 border-r-2 border-emerald-500">
                                              {instrument.name || "---"}
                                            </td>
                                            <td className="px-3 py-2 border-r-2 border-emerald-500">
                                              {instrument.calibrationDoneDate
                                                ? instrument.calibrationDoneDate.replace(/-/g, "/")
                                                : "---"}
                                            </td>
                                            <td className="px-3 py-2 border-r-2 border-emerald-500">
                                              {instrument.calibrationDueDate
                                                ? instrument.calibrationDueDate.replace(/-/g, "/")
                                                : "---"}
                                            </td>
                                            <td className="px-3 py-2 text-center">
                                              <motion.button
                                                onClick={() =>
                                                  handleRemoveInstrument(
                                                    selectedParam.id,
                                                    instrument.instrumentId!,
                                                  )
                                                }
                                                whileHover={{
                                                  scale: 1.1,
                                                  rotate: 10,
                                                }}
                                                whileTap={{ scale: 0.9 }}
                                                className="mx-2"
                                              >
                                                <CgTrash className="w-5 h-5 text-red-500" />
                                              </motion.button>
                                            </td>
                                          </motion.tr>
                                        ),
                                      )
                                    ) : (
                                      <tr className="border-2 border-emerald-500">
                                        <td
                                          colSpan={role === "Reviewer" ? 5 : 4}
                                          className="px-3 py-4 text-center text-gray-500"
                                        >
                                          <div className="flex flex-col items-center gap-2">
                                            <Target className="w-8 h-8 opacity-30" />
                                            <span>
                                              {role === "Reviewer"
                                                ? 'No instruments added. Click "Add Instrument" to add.'
                                                : "No instruments added yet."}
                                            </span>
                                          </div>
                                        </td>
                                      </tr>
                                    )}
                                  </AnimatePresence>
                                </tbody>
                              </table>
                            )}
                          </div>

                          {/* Chemicals Used - Dynamic with Add/Remove */}
                          <div className="mb-4">
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="text-lg font-bold text-emerald-800 flex items-center gap-2.5 tracking-tight mb-3">
                                <span className="w-1.5 h-6 bg-gradient-to-b from-emerald-500 to-emerald-600 rounded-full"></span>
                                Reagents and Chemicals Details:
                              </h3>

                              <div className="relative" ref={chemicalRef}>
                                <button
                                  onClick={() =>
                                    setShowChemicalDropdown(!showChemicalDropdown)
                                  }
                                  disabled={
                                    isReferenceDataLoading ||
                                    !!referenceDataError ||
                                    chemicals.length === 0
                                  }
                                  className="flex items-center gap-2 p-1.5 bg-gradient-to-r from-emerald-600 to-emerald-600 text-white font-semibold rounded-2xl hover:from-emerald-700 hover:to-emerald-800 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-xs"
                                >
                                  <Plus className="w-4 h-4" />
                                </button>

                                <AnimatePresence>
                                  {showChemicalDropdown && (
                                    <motion.div
                                      initial={{ opacity: 0, y: -10 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      exit={{ opacity: 0, y: -10 }}
                                      onMouseDown={(e) => e.stopPropagation()}
                                      className="absolute right-0 mt-2 w-80 bg-white border border-emerald-300 rounded-lg shadow-xl z-50"
                                    >
                                      <div className="p-2 border-b border-emerald-200">
                                        <div className="relative">
                                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                          <input
                                            type="text"
                                            placeholder="Search chemicals..."
                                            value={chemicalSearch}
                                            onChange={(e) =>
                                              setChemicalSearch(e.target.value)
                                            }
                                            className="w-full pl-10 pr-3 py-2 border border-emerald-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                          />
                                        </div>
                                      </div>
                                      <div className="max-h-64 overflow-y-auto">
                                        {searchFilteredChemicals
                                          .filter(
                                            (chem) =>
                                              !addedChemicals[
                                                selectedParam.id
                                              ]?.find(
                                                (added) => added.slno === chem.slno,
                                              ),
                                          )
                                          .map((chem) => (
                                            <button
                                              key={chem.slno}
                                              onClick={() =>
                                                handleAddChemical(
                                                  {
                                                    id: null,
                                                    parameterId: selectedParam.id,
                                                    slno: chem.slno,
                                                    name: chem.name,
                                                    code: chem.code ?? null,
                                                    make: chem.make ?? null,
                                                    batchNo: chem.batchNo ?? null,
                                                    expDate: chem.exp_Date ?? null,
                                                  },
                                                )
                                              }
                                              className="w-full text-left px-3 py-2 hover:bg-emerald-50 border-b border-emerald-200 last:border-b-0 transition-colors text-sm"
                                            >
                                              <div className="font-semibold text-gray-900">
                                                {chem.name}
                                              </div>
                                              <div className="text-xs text-gray-600">
                                                {chem.make} • Batch: {chem.batchNo}
                                              </div>
                                            </button>
                                          ))}
                                        {searchFilteredChemicals.filter(
                                          (chem) =>
                                            !addedChemicals[selectedParam.id]?.find(
                                              (added) => added.slno === chem.slno,
                                            ),
                                        ).length === 0 && (
                                            <div className="px-3 py-4 text-center text-gray-500 text-sm">
                                              {chemicalSearch
                                                ? "No matching chemicals"
                                                : "All available chemicals added"}
                                            </div>
                                          )}
                                      </div>
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>
                            </div>

                            {isReferenceDataLoading && <ReferenceLoading />}
                            {referenceDataError && (
                              <ReferenceError error={referenceDataError} />
                            )}

                            {!isReferenceDataLoading && !referenceDataError && (
                              <table className="w-full border-collapse text-sm shadow-md">
                                <thead>
                                  <tr className="bg-emerald-100 border-2 border-emerald-500">
                                    <th className="px-3 py-2 border-r-2 border-emerald-500 text-left font-bold">
                                      Name of Solvents
                                    </th>
                                    <th className="px-3 py-2 border-r-2 border-emerald-500 text-left font-bold">
                                      Code
                                    </th>
                                    <th className="px-3 py-2 border-r-2 border-emerald-500 text-left font-bold">
                                      Make
                                    </th>
                                    <th className="px-3 py-2 border-r-2 border-emerald-500 text-left font-bold">
                                      Lot No./Batch No.
                                    </th>
                                    <th className="px-3 py-2 border-r-2 border-emerald-500 text-left font-bold">
                                      Validity
                                    </th>
                                    {role === "Reviewer" && (
                                      <th className="px-3 py-2 text-center font-bold w-20">
                                        Action
                                      </th>
                                    )}
                                  </tr>
                                </thead>
                                <tbody>
                                  <AnimatePresence>
                                    {addedChemicals[selectedParam.id]?.length >
                                      0 ? (
                                      addedChemicals[selectedParam.id].map(
                                        (chemical) => (
                                          <motion.tr
                                            key={chemical.slno}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: 20 }}
                                            className="border-2 border-emerald-500 hover:bg-emerald-50 transition-colors"
                                          >
                                            <td className="px-3 py-2 border-r-2 border-emerald-500">
                                              {chemical.name || "---"}
                                            </td>
                                            <td className="px-3 py-2 border-r-2 border-emerald-500">
                                              {chemical.code || "---"}
                                            </td>
                                            <td className="px-3 py-2 border-r-2 border-emerald-500">
                                              {chemical.make || "---"}
                                            </td>
                                            <td className="px-3 py-2 border-r-2 border-emerald-500">
                                              {chemical.batchNo || "---"}
                                            </td>
                                            <td className="px-3 py-2 border-r-2 border-emerald-500">
                                              {chemical.expDate
                                                ? new Date(
                                                  chemical.expDate,
                                                ).toLocaleDateString("en-GB")
                                                : "---"}
                                            </td>
                                            <td className="px-3 py-2 text-center">
                                              <motion.button
                                                onClick={() =>
                                                  handleRemoveChemical(
                                                    selectedParam.id,
                                                    chemical.slno,
                                                  )
                                                }
                                                whileHover={{
                                                  scale: 1.1,
                                                  rotate: 10,
                                                }}
                                                whileTap={{ scale: 0.9 }}
                                                className="mx-2"
                                              >
                                                <CgTrash className="w-5 h-5 text-red-500" />
                                              </motion.button>
                                            </td>
                                          </motion.tr>
                                        ),
                                      )
                                    ) : (
                                      <tr className="border-2 border-emerald-500">
                                        <td
                                          colSpan={role === "Reviewer" ? 5 : 4}
                                          className="px-3 py-4 text-center text-gray-500"
                                        >
                                          <div className="flex flex-col items-center gap-2">
                                            <Target className="w-8 h-8 opacity-30" />
                                            <span>
                                              {role === "Reviewer"
                                                ? 'No chemicals added. Click "Add Chemical" to add.'
                                                : "No chemicals added yet."}
                                            </span>
                                          </div>
                                        </td>
                                      </tr>
                                    )}
                                  </AnimatePresence>
                                </tbody>
                              </table>
                            )}
                          </div>

                          {/* Standards Used - Dynamic with Add/Remove */}
                          <div className="mb-4">
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="text-lg font-bold text-emerald-800 flex items-center gap-2.5 tracking-tight mb-3">
                                <span className="w-1.5 h-6 bg-gradient-to-b from-emerald-500 to-emerald-600 rounded-full"></span>
                                Standards Details:
                              </h3>

                              <div className="relative" ref={standardRef}>
                                <button
                                  onClick={() =>
                                    setShowStandardDropdown(!showStandardDropdown)
                                  }
                                  disabled={
                                    isReferenceDataLoading ||
                                    !!referenceDataError ||
                                    standards.length === 0
                                  }
                                  className="flex items-center gap-2 p-1.5 bg-gradient-to-r from-emerald-600 to-emerald-600 text-white font-semibold rounded-2xl hover:from-emerald-700 hover:to-emerald-800 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-xs"
                                >
                                  <Plus className="w-4 h-4" />
                                </button>

                                <AnimatePresence>
                                  {showStandardDropdown && (
                                    <motion.div
                                      initial={{ opacity: 0, y: -10 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      exit={{ opacity: 0, y: -10 }}
                                      onMouseDown={(e) => e.stopPropagation()}
                                      className="absolute right-0 mt-2 w-80 bg-white border border-emerald-300 rounded-lg shadow-xl z-50"
                                    >
                                      <div className="p-2 border-b border-emerald-200">
                                        <div className="relative">
                                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                          <input
                                            type="text"
                                            placeholder="Search standards..."
                                            value={standardSearch}
                                            onChange={(e) =>
                                              setStandardSearch(e.target.value)
                                            }
                                            className="w-full pl-10 pr-3 py-2 border border-emerald-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                          />
                                        </div>
                                      </div>
                                      <div className="max-h-64 overflow-y-auto">
                                        {searchFilteredStandards
                                          .filter(
                                            (std) =>
                                              !addedStandards[
                                                selectedParam.id
                                              ]?.find(
                                                (added) =>
                                                  added.serialNo === std.serialNo,
                                              ),
                                          )
                                          .map((std) => (
                                            <button
                                              key={std.serialNo}
                                              onClick={() =>
                                                handleAddStandard(
                                                  {
                                                    id: null,
                                                    parameterId: selectedParam.id,
                                                    serialNo: std.serialNo,
                                                    name: std.name,
                                                    batchNo: std.batchNo ?? null,
                                                    make: std.make ?? null,
                                                    purity: std.purity ?? null,
                                                    validity: std.validity ?? null,
                                                  },
                                                )
                                              }
                                              className="w-full text-left px-3 py-2 hover:bg-emerald-50 border-b border-emerald-200 last:border-b-0 transition-colors text-sm"
                                            >
                                              <div className="font-semibold text-gray-900">
                                                {std.name}
                                              </div>
                                              <div className="text-xs text-gray-600">
                                                {std.make} • Purity: {std.purity}
                                              </div>
                                            </button>
                                          ))}
                                        {searchFilteredStandards.filter(
                                          (std) =>
                                            !addedStandards[selectedParam.id]?.find(
                                              (added) =>
                                                added.serialNo === std.serialNo,
                                            ),
                                        ).length === 0 && (
                                            <div className="px-3 py-4 text-center text-gray-500 text-sm">
                                              {standardSearch
                                                ? "No matching standards"
                                                : "All available standards added"}
                                            </div>
                                          )}
                                      </div>
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>
                            </div>

                            {isReferenceDataLoading && <ReferenceLoading />}
                            {referenceDataError && (
                              <ReferenceError error={referenceDataError} />
                            )}

                            {!isReferenceDataLoading && !referenceDataError && (
                              <table className="w-full border-collapse text-sm shadow-md">
                                <thead>
                                  <tr className="bg-emerald-100 border-2 border-emerald-500">
                                    <th className="px-3 py-2 border-r-2 border-emerald-500 text-left font-bold">
                                      Name of Standard
                                    </th>
                                    <th className="px-3 py-2 border-r-2 border-emerald-500 text-left font-bold">
                                      Purity
                                    </th>
                                    <th className="px-3 py-2 border-r-2 border-emerald-500 text-left font-bold">
                                      Make
                                    </th>
                                    <th className="px-3 py-2 border-r-2 border-emerald-500 text-left font-bold">
                                      Lot No./Batch No.
                                    </th>
                                    <th className="px-3 py-2 border-r-2 border-emerald-500 text-left font-bold">
                                      Validity
                                    </th>
                                    {role === "Reviewer" && (
                                      <th className="px-3 py-2 text-center font-bold w-20">
                                        Action
                                      </th>
                                    )}
                                  </tr>
                                </thead>
                                <tbody>
                                  <AnimatePresence>
                                    {addedStandards[selectedParam.id]?.length >
                                      0 ? (
                                      addedStandards[selectedParam.id].map(
                                        (standard) => (
                                          <motion.tr
                                            key={standard.serialNo}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: 20 }}
                                            className="border-2 border-emerald-500 hover:bg-emerald-50 transition-colors"
                                          >
                                            <td className="px-3 py-2 border-r-2 border-emerald-500">
                                              {standard.name || "---"}
                                            </td>
                                            <td className="px-3 py-2 border-r-2 border-emerald-500">
                                              {standard.purity || "---"}
                                            </td>
                                            <td className="px-3 py-2 border-r-2 border-emerald-500">
                                              {standard.make || "---"}
                                            </td>
                                            <td className="px-3 py-2 border-r-2 border-emerald-500">
                                              {standard.batchNo || "---"}
                                            </td>
                                            <td className="px-3 py-2 border-r-2 border-emerald-500">
                                              {standard.validity
                                                ? new Date(
                                                  standard.validity,
                                                ).toLocaleDateString("en-GB")
                                                : "---"}
                                            </td>
                                            <td className="px-3 py-2 text-center">
                                              <motion.button
                                                onClick={() =>
                                                  handleRemoveStandard(
                                                    selectedParam.id,
                                                    standard.serialNo,
                                                  )
                                                }
                                                whileHover={{
                                                  scale: 1.1,
                                                  rotate: 10,
                                                }}
                                                whileTap={{ scale: 0.9 }}
                                                className="mx-2"
                                              >
                                                <CgTrash className="w-5 h-5 text-red-500" />
                                              </motion.button>
                                            </td>
                                          </motion.tr>
                                        ),
                                      )
                                    ) : (
                                      <tr className="border-2 border-emerald-500">
                                        <td
                                          colSpan={role === "Reviewer" ? 6 : 5}
                                          className="px-3 py-4 text-center text-gray-500"
                                        >
                                          <div className="flex flex-col items-center gap-2">
                                            <Target className="w-8 h-8 opacity-30" />
                                            <span>
                                              {role === "Reviewer"
                                                ? 'No standards added. Click "Add Standard" to add.'
                                                : "No standards added yet."}
                                            </span>
                                          </div>
                                        </td>
                                      </tr>
                                    )}
                                  </AnimatePresence>
                                </tbody>
                              </table>
                            )}
                          </div>

                          {/* ============= ADDITIONAL INFO TOGGLE ============= */}
                          <div className="mb-6 mt-8">
                            <label className="flex items-center gap-4 cursor-pointer group relative">
                              <div className="relative flex items-center justify-center">
                                <div className="absolute inset-0 bg-gradient-to-r from-emerald-700 to-emerald-900 rounded-full blur-lg opacity-0 group-hover:opacity-20 transition-all duration-300" />
                                <input
                                  type="checkbox"
                                  checked={
                                    showAdditionalInfo[selectedParam.id] || false
                                  }
                                  onChange={(e) => {
                                    setShowAdditionalInfo((prev) => ({
                                      ...prev,
                                      [selectedParam.id]: e.target.checked,
                                    }));
                                    if (!e.target.checked) {
                                      setAdditionalInfoPerParam((prev) => ({
                                        ...prev,
                                        [selectedParam.id]: "",
                                      }));
                                    }
                                  }}
                                  className="peer sr-only"
                                />
                                <div className="relative w-14 h-7 rounded-full border-2 border-emerald-200 bg-gray-200 peer-checked:bg-gradient-to-r peer-checked:from-emerald-700 peer-checked:to-emerald-900 peer-checked:border-emerald-600 transition-all duration-300 shadow-inner group-hover:border-emerald-300">
                                  <motion.div
                                    className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md flex items-center justify-center"
                                    animate={{
                                      x: showAdditionalInfo[selectedParam.id]
                                        ? 28
                                        : 0,
                                    }}
                                    transition={{
                                      type: "spring",
                                      stiffness: 500,
                                      damping: 30,
                                    }}
                                  >
                                    {showAdditionalInfo[selectedParam.id] ? (
                                      <svg
                                        className="w-3 h-3 text-emerald-600"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth="3"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          d="M5 13l4 4L19 7"
                                        />
                                      </svg>
                                    ) : (
                                      <svg
                                        className="w-3 h-3 text-gray-400"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth="3"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          d="M6 18L18 6M6 6l12 12"
                                        />
                                      </svg>
                                    )}
                                  </motion.div>
                                </div>
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <span className="text-base font-bold text-emerald-800 group-hover:text-emerald-800 transition-colors duration-200">
                                    Additional Info
                                  </span>
                                  <motion.span
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className={`px-2 py-0.5 text-[10px] font-medium rounded-full transition-all duration-200 ${showAdditionalInfo[selectedParam.id]
                                      ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                                      : "bg-gray-100 text-gray-500 border border-gray-200"
                                      }`}
                                  >
                                    {showAdditionalInfo[selectedParam.id]
                                      ? "Active"
                                      : "Inactive"}
                                  </motion.span>
                                </div>
                                <p className="text-xs text-emerald-600/70">
                                  Toggle additional info section
                                </p>
                              </div>
                            </label>
                          </div>

                          {/* ============= ADDITIONAL INFO SECTION ============= */}
                          <AnimatePresence>
                            {showAdditionalInfo[selectedParam.id] && (
                              <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 0 }}
                                className="mb-6 p-6 bg-white rounded-xl border-2 border-emerald-200 shadow-lg"
                              >
                                <div className="flex items-center gap-4 mb-4">
                                  <span className="w-1.5 h-6 bg-gradient-to-b from-emerald-700 to-emerald-900 rounded-full"></span>
                                  <h2 className="text-lg font-bold text-emerald-800 tracking-tight">
                                    Additional Info
                                  </h2>
                                </div>
                                <textarea
                                  value={additionalInfoPerParam[selectedParam.id] || ""}
                                  onChange={(e) =>
                                    setAdditionalInfoPerParam((prev) => ({
                                      ...prev,
                                      [selectedParam.id]: e.target.value,
                                    }))
                                  }
                                  rows={4}
                                  placeholder="Enter any additional information..."
                                  className="w-full px-3 py-2 text-sm border border-emerald-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400 resize-y bg-white text-gray-700 placeholder-gray-400"
                                />
                              </motion.div>
                            )}
                          </AnimatePresence>


                          {/* ============= PREPARATIONS MANAGEMENT SECTION ============= */}
                          <div className="mb-8 p-6 bg-gradient-to-br from-emerald-50 via-emerald-50 to-emerald-50 border border-emerald-200 rounded-2xl shadow-2xl">
                            <div
                              className={`flex items-center justify-between mb-6${isPreparationLocked ? " pointer-events-none " : ""}`}
                            >
                              <div className="flex items-center gap-3">
                                <div className="relative">
                                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-700 to-emerald-900 rounded-2xl flex items-center justify-center shadow-lg">
                                    <BiTestTube className="w-6 h-6 text-white" />
                                  </div>
                                </div>
                                <div>
                                  <h3 className="text-xl font-bold text-emerald-900 tracking-tight">
                                    Preparations Management
                                  </h3>
                                  <p className="text-xs text-emerald-600 font-medium">
                                    Configure analysis preparations for this
                                    parameter
                                  </p>
                                </div>
                              </div>

                              <div
                                className="relative"
                                ref={preparationDropdownRef}
                              >
                                <button
                                  onClick={() =>
                                    setShowPreparationDropdown((prev) => ({
                                      ...prev,
                                      [selectedParam.id]: !prev[selectedParam.id],
                                    }))
                                  }
                                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-700 to-emerald-900 text-white font-semibold rounded-lg hover:from-emerald-700 hover:to-emerald-800 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                                >
                                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                                  <Plus className="w-5 h-5 relative z-10 group-hover:rotate-90 transition-transform duration-300" />
                                  <span className="relative z-10">
                                    Add Preparations
                                  </span>
                                </button>
                                {/* Dropdown Menu */}
                                <AnimatePresence>
                                  {showPreparationDropdown[selectedParam.id] && (
                                    <motion.div
                                      initial={{ opacity: 0, y: -10 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      exit={{ opacity: 0, y: -10 }}
                                      className="absolute right-0 mt-2 w-72 bg-white border border-emerald-300 rounded-lg shadow-xl z-50 max-h-80 overflow-y-auto"
                                    >
                                      {getAvailablePreparationGroups().map(
                                        (group) => {
                                          const isActive = (
                                            activePreparationGroups[
                                            selectedParam.id
                                            ] || []
                                          ).includes(group.id);
                                          return (
                                            <button
                                              key={group.id}
                                              onClick={() =>
                                                handleTogglePreparationGroup(
                                                  selectedParam.id,
                                                  group.id,
                                                )
                                              }
                                              className="w-full text-left px-3 py-3 hover:bg-emerald-50 border-b border-emerald-200 last:border-b-0 transition-colors text-sm"
                                            >
                                              <div className="flex items-center justify-between">
                                                <span className="font-semibold text-gray-900">
                                                  {group.label}
                                                </span>
                                                {isActive && (
                                                  <Check className="w-4 h-4 text-emerald-600" />
                                                )}
                                              </div>
                                            </button>
                                          );
                                        },
                                      )}
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>
                            </div>

                            <AnimatePresence>
                              {(() => {
                                const activeGroups =
                                  activePreparationGroups[selectedParam.id] || [];

                                const groupInfo: Record<
                                  string,
                                  { label?: string; color?: string }
                                > = {};

                                // Show all active groups as chips, including blankPreparation
                                activeGroups
                                  .forEach((groupId) => {
                                    const group =
                                      PREPARATION_GROUPS[
                                      groupId as keyof typeof PREPARATION_GROUPS
                                      ];

                                    groupInfo[groupId] = {
                                      label: group.label,
                                      color: group.color,
                                    };
                                  });

                                if (Object.keys(groupInfo).length > 0) {
                                  return (
                                    <motion.div
                                      key="active-preparations-content"
                                      initial={{ opacity: 0, height: 0 }}
                                      animate={{ opacity: 1, height: "auto" }}
                                      exit={{ opacity: 0, height: 0 }}
                                      className="space-y-4"
                                      layout
                                    >
                                      <div className="flex items-center gap-3 my-4">
                                        <div className="h-0.5 flex-1 bg-gradient-to-r from-transparent via-emerald-600 to-transparent"></div>
                                        <div className="flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-emerald-700 via-emerald-800 to-slate-900 rounded-full shadow-lg">
                                          <span className="text-xs font-bold text-white uppercase tracking-wider">
                                            Active Preparation Group
                                          </span>
                                        </div>
                                        <div className="h-0.5 flex-1 bg-gradient-to-r from-transparent via-emerald-600 to-transparent"></div>
                                      </div>

                                      <motion.div layout>
                                        <div className="flex flex-wrap gap-3">
                                          {Object.entries(groupInfo).map(
                                            ([groupId, info]) => {
                                              return (
                                                <motion.div
                                                  key={groupId}
                                                  initial={{
                                                    opacity: 0,
                                                    scale: 0.8,
                                                    y: 20,
                                                  }}
                                                  animate={{
                                                    opacity: 1,
                                                    scale: 1,
                                                    y: 0,
                                                  }}
                                                  exit={{
                                                    opacity: 0,
                                                    scale: 0.8,
                                                    y: 20,
                                                  }}
                                                  whileHover={{ scale: 1.05 }}
                                                  className={`group relative inline-flex items-center gap-3 py-2 px-4 bg-gradient-to-br from-emerald-100 to-emerald-200 text-emerald-800 border-emerald-400 border-2 rounded-lg font-semibold shadow-lg shadow-emerald-200/50 hover:shadow-xl transition-all duration-300 overflow-hidden`}
                                                >
                                                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>

                                                  <div className="flex items-center gap-3 relative z-10">
                                                    <span className="font-bold text-sm">
                                                      {info.label}
                                                    </span>
                                                  </div>

                                                  <motion.button
                                                    onClick={() =>
                                                      handleTogglePreparationGroup(
                                                        selectedParam.id,
                                                        groupId,
                                                      )
                                                    }
                                                    whileHover={{
                                                      scale: 1.2,
                                                      rotate: 90,
                                                    }}
                                                    whileTap={{ scale: 0.9 }}
                                                    className={`relative z-10 w-5 h-5 flex items-center justify-center rounded-full bg-emerald-800 hover:bg-red-500 text-gray-600 hover:text-white transition-all font-bold border-1 border-white/50 hover:border-red-600 shadow-sm`}
                                                    title={`Remove ${info.label} group`}
                                                  >
                                                    <span className="text-[9px] text-white inline-flex items-center justify-center h-full w-full">
                                                      ✕
                                                    </span>
                                                  </motion.button>
                                                </motion.div>
                                              );
                                            },
                                          )}
                                        </div>

                                        <motion.div
                                          initial={{ opacity: 0, y: 10 }}
                                          animate={{ opacity: 1, y: 0 }}
                                          className="mt-5 p-4 bg-gradient-to-r from-emerald-50 via-emerald-50 to-emerald-50 border-2 border-emerald-200 rounded-xl shadow-inner"
                                        >
                                          <div className="flex items-start gap-3">
                                            <div className="w-8 h-8 flex-shrink-0 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center shadow-md">
                                              <span className="text-white text-lg">
                                                💡
                                              </span>
                                            </div>
                                            <div className="flex-1">
                                              <p className="text-sm text-emerald-800 font-semibold mb-1">
                                                Quick Guide
                                              </p>
                                              <p className="text-xs text-emerald-800 leading-relaxed">
                                                Click the{" "}
                                                <span className="inline-flex items-center justify-center w-5 h-5 bg-white rounded-full text-red-500 font-bold mx-1">
                                                  ✕
                                                </span>{" "}
                                                button to remove a preparation group
                                                and all its data. The number badge
                                                shows total items in the group. Use
                                                <strong>
                                                  "Add Preparation"
                                                </strong>{" "}
                                                to enable more groups.
                                              </p>
                                            </div>
                                          </div>
                                        </motion.div>
                                      </motion.div>
                                    </motion.div>
                                  );
                                }

                                return (
                                  <motion.div
                                    key="empty-state-content"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="text-center py-12 text-gray-500 bg-gradient-to-br from-gray-50 via-white to-gray-50 rounded-2xl border-2 border-dashed border-gray-300 shadow-inner"
                                    layout
                                  >
                                    <div className="inline-block">
                                      <Target className="w-14 h-14 text-gray-300" />
                                    </div>
                                    <p className="text-base font-bold text-gray-800 mb-2">
                                      No preparation groups configured yet
                                    </p>
                                    <p className="text-sm text-gray-600 max-w-md mx-auto">
                                      Click the{" "}
                                      <strong className="text-emerald-800">
                                        "Add Preparation"
                                      </strong>{" "}
                                      button above to select preparation groups for
                                      this parameter
                                    </p>
                                  </motion.div>
                                );
                              })()}
                            </AnimatePresence>
                          </div>
                          {/* ============= END OF PREPARATIONS MANAGEMENT SECTION ============= */}
                        </div>

                        {/* ============= BLANK PREPARATION CARD ============= */}
                        {(activePreparationGroups[selectedParam.id] || []).includes(
                          "blankPreparation",
                        ) && (
                            <motion.div
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="relative mb-10 p-8 rounded-2xl border-2 border-emerald-200/50 bg-gradient-to-br from-emerald-50/40 via-white/60 to-emerald-50/40 backdrop-blur-sm shadow-sm hover:shadow-emerald-200/50 transition-all duration-500"
                            >
                              <div
                                className={
                                  isPreparationLocked
                                    ? "pointer-events-none opacity-70"
                                    : ""
                                }
                              >
                                {/* Decorative elements */}
                                <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-emerald-400/10 to-transparent rounded-bl-full -z-10" />
                                <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-emerald-400/10 to-transparent rounded-tr-full -z-10" />

                                {/* Card Header */}
                                <div className="flex items-center justify-between mb-8">
                                  <div className="flex items-center gap-4">
                                    <div className="relative">
                                      <div className="absolute inset-0 bg-emerald-500/20 blur-xl rounded-full" />
                                      <div className="relative w-12 h-12 bg-gradient-to-br from-emerald-700 to-emerald-900 rounded-2xl flex items-center justify-center shadow-lg transform hover:rotate-6 transition-transform duration-300">
                                        <BiTestTube className="w-6 h-6 text-white" />
                                      </div>
                                    </div>
                                    <div>
                                      <h2 className="text-xl font-bold text-emerald-900 tracking-tight">
                                        Blank Preparation
                                      </h2>
                                      <p className="text-sm text-emerald-600/80 font-medium">
                                        Custom Document Preparation
                                      </p>
                                    </div>
                                  </div>

                                  <div className="px-4 py-1 bg-gradient-to-r from-emerald-50 to-emerald-50 border border-emerald-200 rounded-full shadow-sm">
                                    <span className="text-xs font-bold text-emerald-800">
                                      {(blankPreparationPerParam[selectedParam.id] || []).length}{" "}
                                      Items
                                    </span>
                                  </div>
                                </div>

                                {/* Blank Preparation Documents */}
                                <div>
                                  <div className="flex items-center justify-between mb-4 px-2">
                                    <h3 className="text-lg font-bold text-emerald-800 flex items-center gap-2.5 tracking-tight">
                                      <span className="w-1.5 h-6 bg-gradient-to-b from-emerald-700 to-emerald-900 rounded-full"></span>
                                      Preparation Documents
                                    </h3>
                                    <button
                                      onClick={() => handleAddBlankPreparation(selectedParam.id)}
                                      className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-emerald-700 to-emerald-900 text-white font-semibold rounded-xl hover:from-emerald-700 hover:to-emerald-800 transition-all duration-200 shadow-md hover:shadow-lg text-sm transform"
                                    >
                                      <Plus className="w-4 h-4" />
                                      Add Preparation
                                    </button>
                                  </div>

                                  <AnimatePresence>
                                    {(blankPreparationPerParam[selectedParam.id] || []).map((blankPrep) => (
                                      <div key={blankPrep.id}>
                                        <BlankPreparationDetail
                                          blankPreparation={blankPrep}
                                          onEdit={(id) =>
                                            handleEditBlankPreparation(selectedParam.id, id)
                                          }
                                          onRemove={(id) =>
                                            handleRemoveBlankPreparation(selectedParam.id, id)
                                          }
                                        />
                                      </div>
                                    ))}
                                  </AnimatePresence>

                                  {(blankPreparationPerParam[selectedParam.id] || []).length > 0 && (
                                    <div className="pointer-events-auto">
                                      <WorksheetFileAttacher
                                        files={getFilesForPrep(selectedParam.id, "blank", "Preparation Files")}
                                        onAdd={(newFiles) =>
                                          handleAddPrepFiles(selectedParam.id, "blank", "Preparation Files", newFiles)
                                        }
                                        onRemove={(index) =>
                                          handleRemovePrepFile(selectedParam.id, "blank", "Preparation Files", index)
                                        }
                                        preparationType="blank"
                                        sectionLabel="Preparation Files"
                                        isLocked={shouldDisableContent}
                                      />
                                    </div>
                                  )}

                                  {(blankPreparationPerParam[selectedParam.id] || []).length === 0 && (
                                    <motion.div
                                      initial={{ opacity: 0, scale: 0.95 }}
                                      animate={{ opacity: 1, scale: 1 }}
                                      className="relative overflow-hidden text-center py-16 bg-gradient-to-br from-emerald-50 via-white to-emerald-50 border-2 border-dashed border-emerald-300 rounded-2xl shadow-inner"
                                    >
                                      <div className="absolute inset-0 opacity-5">
                                        <div className="absolute top-0 left-1/4 w-64 h-64 bg-emerald-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" />
                                        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-emerald-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-1000" />
                                      </div>
                                      <div className="relative z-10">
                                        <div className="inline-block p-5 bg-white rounded-full shadow-lg mb-4">
                                          <Target className="w-14 h-14 text-emerald-400" />
                                        </div>
                                        <p className="text-lg font-bold text-emerald-800 mb-2">
                                          No documents added yet
                                        </p>
                                        <p className="text-sm text-emerald-600/80 max-w-md mx-auto mb-4">
                                          Click "Add Preparation" to create a blank preparation document
                                        </p>
                                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100/50 rounded-lg border border-emerald-200">
                                          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
                                          <span className="text-xs font-semibold text-emerald-800">
                                            Ready to start
                                          </span>
                                        </div>
                                      </div>
                                    </motion.div>
                                  )}
                                </div>

                                {/* ── Blank Preparation Complete / Unlock Banner ── */}
                                {(blankPreparationPerParam[selectedParam.id] || []).length > 0 &&
                                  (() => {
                                    const isGroupCompleted =
                                      !!groupPrepCompletedAtPerParam[selectedParam.id]?.["blankPreparation"];

                                    if (isPreparationLocked || isGroupCompleted) {
                                      return (
                                        <div className="mt-4 pointer-events-auto">
                                          <div className="flex items-center gap-3 px-5 py-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                                            <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0">
                                              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                              </svg>
                                            </div>
                                            <div className="flex-1">
                                              <p className="text-sm font-semibold text-emerald-800">
                                                Blank Preparation Completed
                                              </p>
                                              {isGroupCompleted && (
                                                <p className="text-xs text-emerald-600">
                                                  Completed at{" "}
                                                  {new Date(
                                                    groupPrepCompletedAtPerParam[selectedParam.id]["blankPreparation"],
                                                  ).toLocaleString()}
                                                </p>
                                              )}
                                            </div>
                                            {canManagePrep && (
                                              <button
                                                onClick={() =>
                                                  handleInitiateUnlockGroupPrep(selectedParam, "blankPreparation")
                                                }
                                                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-orange-700 bg-orange-50 border border-orange-300 rounded-lg hover:bg-orange-100 transition-colors"
                                              >
                                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                                                </svg>
                                                Unlock Preparation
                                              </button>
                                            )}
                                          </div>
                                        </div>
                                      );
                                    }

                                    if (canManagePrep) {
                                      return (
                                        <div className="mt-4 pointer-events-auto">
                                          <button
                                            onClick={() =>
                                              handleInitiateCompleteGroupPrep(selectedParam, "blankPreparation")
                                            }
                                            className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-semibold rounded-xl transition-all shadow-md hover:shadow-lg text-sm"
                                          >
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                            Mark Blank Preparation Complete
                                          </button>
                                        </div>
                                      );
                                    }

                                    return null;
                                  })()
                                }
                              </div>
                            </motion.div>
                          )}

                        {/* ============= BLANK PREPARATION DIALOG (full-screen) ============= */}
                        <AnimatePresence>
                          {showBlankPreparationDialog[selectedParam.id] && (
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 backdrop-blur-sm"
                              onClick={(e) => {
                                if (e.target === e.currentTarget) {
                                  setShowBlankPreparationDialog((prev) => ({
                                    ...prev,
                                    [selectedParam.id]: false,
                                  }));
                                  setEditingBlankPrepId(null);
                                }
                              }}
                            >
                              <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                                className="relative w-full h-full max-w-full max-h-full flex items-center justify-center p-4 sm:p-8"
                              >
                                <div className="relative w-full h-full bg-white rounded-2xl shadow-2xl overflow-auto flex flex-col">
                                  <BlankPreparation
                                    onClose={() => {
                                      setShowBlankPreparationDialog((prev) => ({
                                        ...prev,
                                        [selectedParam.id]: false,
                                      }));
                                      setEditingBlankPrepId(null);
                                    }}
                                    onSave={(label, content) => {
                                      handleSaveBlankPreparation(selectedParam.id, label, content);
                                    }}
                                    existingContent={
                                      editingBlankPrepId
                                        ? (blankPreparationPerParam[selectedParam.id] || []).find(
                                          (prep) => prep.id === editingBlankPrepId,
                                        )?.content || ""
                                        : ""
                                    }
                                    existingLabel={
                                      editingBlankPrepId
                                        ? (blankPreparationPerParam[selectedParam.id] || []).find(
                                          (prep) => prep.id === editingBlankPrepId,
                                        )?.label || ""
                                        : ""
                                    }
                                    isEditing={editingBlankPrepId !== null}
                                  />
                                </div>
                              </motion.div>
                            </motion.div>
                          )}
                        </AnimatePresence>

                        {/* ============= ICP-MS (FOOD) PREPARATIONS ============= */}
                        {(activePreparationGroups[selectedParam.id] || []).includes("icpmsFood") && (
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="relative mb-10 p-8 rounded-2xl border-2 border-emerald-200/50 bg-gradient-to-br from-emerald-50/40 via-white/60 to-emerald-50/40 backdrop-blur-sm shadow-sm hover:shadow-emerald-200/50 transition-all duration-500"
                          >
                            <div className={isPreparationLocked ? "pointer-events-none opacity-70" : ""}>
                              {/* Decorative elements */}
                              <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-emerald-400/10 to-transparent rounded-bl-full -z-10" />
                              <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-emerald-400/10 to-transparent rounded-tr-full -z-10" />

                              {/* Card Header */}
                              <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-4">
                                  <div className="relative">
                                    <div className="absolute inset-0 bg-emerald-500/20 blur-xl rounded-full" />
                                    <div className="relative w-12 h-12 bg-gradient-to-br from-emerald-700 to-emerald-900 rounded-2xl flex items-center justify-center shadow-lg transform hover:rotate-6 transition-transform duration-300">
                                      <BiTestTube className="w-6 h-6 text-white" />
                                    </div>
                                  </div>
                                  <div>
                                    <h2 className="text-xl font-bold text-emerald-900 tracking-tight">
                                      Preparations for ICP-MS
                                    </h2>
                                    <p className="text-sm text-emerald-600/80 font-medium">
                                      Preparations &amp; Calculations
                                    </p>
                                  </div>
                                </div>

                                <div className="px-4 py-1 bg-gradient-to-r from-emerald-50 to-emerald-50 border border-emerald-200 rounded-full shadow-sm">
                                  <span className="text-xs font-bold text-emerald-800">
                                    {((samplePreparationIcpmsPerParam[selectedParam.id] || []).length +
                                      (calculationsIcpmsPerParam[selectedParam.id] || []).length)}{" "}
                                    Items
                                  </span>
                                </div>
                              </div>

                              {/* Sample Preparation Section */}
                              <div>
                                <div className="flex items-center justify-between mb-4 px-2">
                                  <h3 className="text-lg font-bold text-emerald-800 flex items-center gap-2.5 tracking-tight">
                                    <span className="w-1.5 h-6 bg-gradient-to-b from-emerald-700 to-emerald-900 rounded-full"></span>
                                    Sample Preparations for ICP-MS
                                  </h3>
                                  <button
                                    onClick={() => handleAddSamplePreparationIcpms(selectedParam.id)}
                                    className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-emerald-700 to-emerald-900 text-white font-semibold rounded-xl hover:from-emerald-700 hover:to-emerald-800 transition-all duration-200 shadow-md hover:shadow-lg text-sm transform"
                                  >
                                    <Plus className="w-4 h-4" />
                                    Add Sample Preparation
                                  </button>
                                </div>

                                <AnimatePresence>
                                  {(samplePreparationIcpmsPerParam[selectedParam.id] || []).map((samplePrep) => (
                                    <motion.div
                                      key={samplePrep.id}
                                      initial={{ opacity: 0, y: 10 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      exit={{ opacity: 0, y: -10 }}
                                    >
                                      <SamplePreparationMetalDetail
                                        samplePreparation={samplePrep}
                                        onStepChange={(samplePrepId, stepName, field, newValue) =>
                                          handleSamplePreparationIcpmsStepChange(
                                            selectedParam.id,
                                            samplePrepId,
                                            stepName,
                                            field,
                                            newValue,
                                          )
                                        }
                                        onRemove={() =>
                                          handleRemoveSamplePreparationIcpms(selectedParam.id, samplePrep.id)
                                        }
                                      />
                                    </motion.div>
                                  ))}
                                </AnimatePresence>

                                {(samplePreparationIcpmsPerParam[selectedParam.id] || []).length === 0 && (
                                  <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="relative overflow-hidden text-center py-12 bg-gradient-to-br from-emerald-50 via-white to-emerald-50 border-2 border-dashed border-emerald-300 rounded-2xl shadow-inner"
                                  >
                                    <div className="relative z-10">
                                      <div className="inline-block p-4 bg-white rounded-full shadow-lg mb-3">
                                        <IoFlask className="w-10 h-10 text-emerald-400" />
                                      </div>
                                      <p className="text-base font-bold text-emerald-800 mb-1">No sample preparations added yet</p>
                                      <p className="text-xs text-emerald-600/80 max-w-md mx-auto">
                                        Click "Add Sample Preparation" to add one
                                      </p>
                                    </div>
                                  </motion.div>
                                )}
                              </div>

                              {/* Standard Preparation Section */}
                              <div className="mt-6">
                                <div className="flex items-center justify-between mb-4 px-2">
                                  <h3 className="text-lg font-bold text-emerald-800 flex items-center gap-2.5 tracking-tight">
                                    <span className="w-1.5 h-6 bg-gradient-to-b from-emerald-700 to-emerald-900 rounded-full"></span>
                                    Standard Preparations for ICP-MS
                                  </h3>
                                  <button
                                    onClick={() => handleAddStandardPreparationIcpms(selectedParam.id)}
                                    className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-emerald-700 to-emerald-900 text-white font-semibold rounded-xl hover:from-emerald-700 hover:to-emerald-800 transition-all duration-200 shadow-md hover:shadow-lg text-sm transform"
                                  >
                                    <Plus className="w-4 h-4" />
                                    Add Standard Preparation
                                  </button>
                                </div>

                                <AnimatePresence>
                                  {(standardPreparationMetalPerParam[selectedParam.id]?.["icpmsFood"] || []).map((standardPrep) => (
                                    <motion.div
                                      key={standardPrep.id}
                                      initial={{ opacity: 0, y: 10 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      exit={{ opacity: 0, y: -10 }}
                                    >
                                      <StandardPreparationMetalDetail
                                        standardPreparation={standardPrep}
                                        onStepChange={(spId, stepName, field, val) =>
                                          handleStandardPreparationMetalStepChange(selectedParam.id, "icpmsFood", spId, stepName, field, val)
                                        }
                                        onRemove={() => handleRemoveStandardPreparationIcpms(selectedParam.id, standardPrep.id)}
                                      />
                                    </motion.div>
                                  ))}
                                </AnimatePresence>

                                {(standardPreparationMetalPerParam[selectedParam.id]?.["icpmsFood"] || []).length === 0 && (
                                  <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="relative overflow-hidden text-center py-8 bg-gradient-to-br from-emerald-50 via-white to-emerald-50 border-2 border-dashed border-emerald-300 rounded-2xl shadow-inner"
                                  >
                                    <div className="relative z-10">
                                      <div className="inline-block p-4 bg-white rounded-full shadow-lg mb-3">
                                        <IoFlask className="w-10 h-10 text-emerald-400" />
                                      </div>
                                      <p className="text-base font-bold text-emerald-800 mb-1">No standard preparations added yet</p>
                                      <p className="text-xs text-emerald-600/80 max-w-md mx-auto">
                                        Click "Add Standard Preparation" to add one
                                      </p>
                                    </div>
                                  </motion.div>
                                )}

                                {/* Weight Sheet attacher — only when at least one prep exists */}
                                {(samplePreparationIcpmsPerParam[selectedParam.id] || []).length > 0 && (
                                  <div className="pointer-events-auto mt-4">
                                    <WorksheetFileAttacher
                                      files={getFilesForPrep(selectedParam.id, "icpms", "Weight Sheet")}
                                      onAdd={(newFiles) =>
                                        handleAddPrepFiles(selectedParam.id, "icpms", "Weight Sheet", newFiles)
                                      }
                                      onRemove={(index) =>
                                        handleRemovePrepFile(selectedParam.id, "icpms", "Weight Sheet", index)
                                      }
                                      preparationType="icpms"
                                      sectionLabel="Weight Sheet"
                                      isLocked={shouldDisableContent}
                                    />
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Complete Preparation block — gates Calculations */}
                            {canManagePrep &&
                              (samplePreparationIcpmsPerParam[selectedParam.id] || []).length > 0 &&
                              (() => {
                                const isGroupCompleted =
                                  !!groupPrepCompletedAtPerParam[selectedParam.id]?.["icpmsFood"];
                                const allPrepsValid = areAllMetalPrepsDilutionValid([
                                  ...(samplePreparationIcpmsPerParam[selectedParam.id] || []),
                                ]);
                                return (
                                  <div className="mt-4 pointer-events-auto opacity-100">
                                    {isGroupCompleted ? (
                                      <div className="flex items-center gap-3 px-5 py-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                                        <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0">
                                          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                          </svg>
                                        </div>
                                        <div className="flex-1">
                                          <p className="text-sm font-semibold text-emerald-800">
                                            ICP-MS Preparation Completed
                                          </p>
                                          <p className="text-xs text-emerald-600">
                                            Completed at{" "}
                                            {new Date(
                                              groupPrepCompletedAtPerParam[selectedParam.id]["icpmsFood"]
                                            ).toLocaleString()}
                                          </p>
                                        </div>
                                        <button
                                          onClick={() => handleInitiateUnlockGroupPrep(selectedParam, "icpmsFood")}
                                          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-orange-700 bg-orange-50 border border-orange-300 rounded-lg hover:bg-orange-100 transition-colors"
                                        >
                                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                                          </svg>
                                          Unlock Preparation
                                        </button>
                                      </div>
                                    ) : (
                                      <div>
                                        {!allPrepsValid && (
                                          <div className="flex items-center gap-2 px-4 py-2.5 mb-2 bg-amber-50 border border-amber-300 rounded-xl text-xs text-amber-700 font-medium">
                                            <svg className="w-4 h-4 text-amber-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            Fix dilution step errors in all preparations before completing.
                                          </div>
                                        )}
                                        <button
                                          onClick={() => handleInitiateCompleteGroupPrep(selectedParam, "icpmsFood")}
                                          disabled={!allPrepsValid}
                                          className={`w-full flex items-center justify-center gap-2 px-5 py-3 font-semibold rounded-xl transition-all text-sm ${allPrepsValid ? "bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white shadow-md hover:shadow-lg" : "bg-slate-200 text-slate-400 cursor-not-allowed"}`}
                                        >
                                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                          </svg>
                                          Mark ICP-MS Preparation as Complete
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                );
                              })()}

                            {/* Locked-out warning */}
                            {(samplePreparationIcpmsPerParam[selectedParam.id] || []).length > 0 &&
                              !groupPrepCompletedAtPerParam[selectedParam.id]?.["icpmsFood"] &&
                              !canManagePrep && (
                                <div className="flex items-center gap-3 px-5 py-3 mt-4 bg-amber-50 border-2 border-amber-200 rounded-xl">
                                  <svg className="w-5 h-5 text-amber-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                  <p className="text-sm text-amber-800">
                                    <strong>Complete Preparation</strong> above to unlock the Calculations section.
                                  </p>
                                </div>
                              )}

                            {/* Calculations Section — gated on group prep completion */}
                            {(samplePreparationIcpmsPerParam[selectedParam.id] || []).length > 0 &&
                              groupPrepCompletedAtPerParam[selectedParam.id]?.["icpmsFood"] && (
                                <div className={isFullyLocked ? "pointer-events-none opacity-70" : ""}>
                                  <div className="mt-8">
                                    <div className="flex items-center justify-between mb-4 px-2">
                                      <h3 className="text-lg font-bold text-emerald-800 flex items-center gap-2.5 tracking-tight">
                                        <span className="w-1.5 h-6 bg-gradient-to-b from-emerald-700 to-emerald-900 rounded-full"></span>
                                        Calculations for ICP-MS
                                      </h3>
                                      <button
                                        onClick={() => handleAddCalculationIcpms(selectedParam.id)}
                                        className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-emerald-700 to-emerald-900 text-white font-semibold rounded-xl hover:from-emerald-700 hover:to-emerald-800 transition-all duration-200 shadow-md hover:shadow-lg text-sm transform"
                                      >
                                        <Plus className="w-4 h-4" />
                                        Add Calculation
                                      </button>
                                    </div>

                                    <AnimatePresence>
                                      {(calculationsIcpmsPerParam[selectedParam.id] || []).map((calc) => (
                                        <div key={calc.id}>
                                          <CalculationDetailIcpms
                                            calculation={calc}
                                            samplePreparations={samplePreparationIcpmsPerParam[selectedParam.id] || []}
                                            onUpdate={(updated) => handleUpdateCalculationIcpms(selectedParam.id, updated)}
                                            onRemove={() => handleRemoveCalculationIcpms(selectedParam.id, calc.id)}
                                            isLocked={isFullyLocked}
                                          />
                                        </div>
                                      ))}
                                    </AnimatePresence>

                                    {(calculationsIcpmsPerParam[selectedParam.id] || []).length === 0 && (
                                      <motion.div
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="relative overflow-hidden text-center py-12 bg-gradient-to-br from-emerald-50 via-white to-emerald-50 border-2 border-dashed border-emerald-300 rounded-2xl shadow-inner"
                                      >
                                        <div className="relative z-10">
                                          <div className="inline-block p-4 bg-white rounded-full shadow-lg mb-3">
                                            <Target className="w-10 h-10 text-emerald-400" />
                                          </div>
                                          <p className="text-base font-bold text-emerald-800 mb-1">
                                            No calculations added yet
                                          </p>
                                          <p className="text-xs text-emerald-600/80 max-w-md mx-auto">
                                            Click "Add Calculation" to create an ICP-MS calculation
                                          </p>
                                        </div>
                                      </motion.div>
                                    )}
                                  </div>
                                </div>
                              )}
                          </motion.div>
                        )}
                        {/* ============= END ICP-MS (FOOD) PREPARATIONS ============= */}

                        {/* ============= ICP-OES (FOOD) PREPARATIONS ============= */}
                        {(activePreparationGroups[selectedParam.id] || []).includes("icpoesFood") && (
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="relative mb-10 p-8 rounded-2xl border-2 border-emerald-200/50 bg-gradient-to-br from-emerald-50/40 via-white/60 to-emerald-50/40 backdrop-blur-sm shadow-sm hover:shadow-emerald-200/50 transition-all duration-500"
                          >
                            <div className={isPreparationLocked ? "pointer-events-none opacity-70" : ""}>
                              {/* Decorative elements */}
                              <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-emerald-400/10 to-transparent rounded-bl-full -z-10" />
                              <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-emerald-400/10 to-transparent rounded-tr-full -z-10" />

                              {/* Card Header */}
                              <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-4">
                                  <div className="relative">
                                    <div className="absolute inset-0 bg-emerald-500/20 blur-xl rounded-full" />
                                    <div className="relative w-12 h-12 bg-gradient-to-br from-emerald-700 to-emerald-900 rounded-2xl flex items-center justify-center shadow-lg transform hover:rotate-6 transition-transform duration-300">
                                      <BiTestTube className="w-6 h-6 text-white" />
                                    </div>
                                  </div>
                                  <div>
                                    <h2 className="text-xl font-bold text-emerald-900 tracking-tight">
                                      Preparations for ICP-OES
                                    </h2>
                                    <p className="text-sm text-emerald-600/80 font-medium">
                                      Preparations &amp; Calculations
                                    </p>
                                  </div>
                                </div>

                                <div className="px-4 py-1 bg-gradient-to-r from-emerald-50 to-emerald-50 border border-emerald-200 rounded-full shadow-sm">
                                  <span className="text-xs font-bold text-emerald-800">
                                    {((samplePreparationIcpoesPerParam[selectedParam.id] || []).length +
                                      (calculationsIcpoesPerParam[selectedParam.id] || []).length)}{" "}
                                    Items
                                  </span>
                                </div>
                              </div>

                              {/* Sample Preparation Section */}
                              <div>
                                <div className="flex items-center justify-between mb-4 px-2">
                                  <h3 className="text-lg font-bold text-emerald-800 flex items-center gap-2.5 tracking-tight">
                                    <span className="w-1.5 h-6 bg-gradient-to-b from-emerald-700 to-emerald-900 rounded-full"></span>
                                    Sample Preparations for ICP-OES
                                  </h3>
                                  <button
                                    onClick={() => handleAddSamplePreparationIcpoes(selectedParam.id)}
                                    className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-emerald-700 to-emerald-900 text-white font-semibold rounded-xl hover:from-emerald-700 hover:to-emerald-800 transition-all duration-200 shadow-md hover:shadow-lg text-sm transform"
                                  >
                                    <Plus className="w-4 h-4" />
                                    Add Sample Preparation
                                  </button>
                                </div>

                                <AnimatePresence>
                                  {(samplePreparationIcpoesPerParam[selectedParam.id] || []).map((samplePrep) => (
                                    <motion.div
                                      key={samplePrep.id}
                                      initial={{ opacity: 0, y: 10 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      exit={{ opacity: 0, y: -10 }}
                                    >
                                      <SamplePreparationMetalDetail
                                        samplePreparation={samplePrep}
                                        onStepChange={(samplePrepId, stepName, field, newValue) =>
                                          handleSamplePreparationIcpoesStepChange(
                                            selectedParam.id,
                                            samplePrepId,
                                            stepName,
                                            field,
                                            newValue,
                                          )
                                        }
                                        onRemove={() =>
                                          handleRemoveSamplePreparationIcpoes(selectedParam.id, samplePrep.id)
                                        }
                                      />
                                    </motion.div>
                                  ))}
                                </AnimatePresence>

                                {(samplePreparationIcpoesPerParam[selectedParam.id] || []).length === 0 && (
                                  <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="relative overflow-hidden text-center py-12 bg-gradient-to-br from-emerald-50 via-white to-emerald-50 border-2 border-dashed border-emerald-300 rounded-2xl shadow-inner"
                                  >
                                    <div className="relative z-10">
                                      <div className="inline-block p-4 bg-white rounded-full shadow-lg mb-3">
                                        <IoFlask className="w-10 h-10 text-emerald-400" />
                                      </div>
                                      <p className="text-base font-bold text-emerald-800 mb-1">No sample preparations added yet</p>
                                      <p className="text-xs text-emerald-600/80 max-w-md mx-auto">
                                        Click "Add Sample Preparation" to add one
                                      </p>
                                    </div>
                                  </motion.div>
                                )}
                              </div>

                              {/* Standard Preparation Section */}
                              <div className="mt-6">
                                <div className="flex items-center justify-between mb-4 px-2">
                                  <h3 className="text-lg font-bold text-emerald-800 flex items-center gap-2.5 tracking-tight">
                                    <span className="w-1.5 h-6 bg-gradient-to-b from-emerald-700 to-emerald-900 rounded-full"></span>
                                    Standard Preparations for ICP-OES
                                  </h3>
                                  <button
                                    onClick={() => handleAddStandardPreparationIcpoes(selectedParam.id)}
                                    className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-emerald-700 to-emerald-900 text-white font-semibold rounded-xl hover:from-emerald-700 hover:to-emerald-800 transition-all duration-200 shadow-md hover:shadow-lg text-sm transform"
                                  >
                                    <Plus className="w-4 h-4" />
                                    Add Standard Preparation
                                  </button>
                                </div>

                                <AnimatePresence>
                                  {(standardPreparationMetalPerParam[selectedParam.id]?.["icpoesFood"] || []).map((standardPrep) => (
                                    <motion.div
                                      key={standardPrep.id}
                                      initial={{ opacity: 0, y: 10 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      exit={{ opacity: 0, y: -10 }}
                                    >
                                      <StandardPreparationMetalDetail
                                        standardPreparation={standardPrep}
                                        onStepChange={(spId, stepName, field, val) =>
                                          handleStandardPreparationMetalStepChange(selectedParam.id, "icpoesFood", spId, stepName, field, val)
                                        }
                                        onRemove={() => handleRemoveStandardPreparationIcpoes(selectedParam.id, standardPrep.id)}
                                      />
                                    </motion.div>
                                  ))}
                                </AnimatePresence>

                                {(standardPreparationMetalPerParam[selectedParam.id]?.["icpoesFood"] || []).length === 0 && (
                                  <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="relative overflow-hidden text-center py-8 bg-gradient-to-br from-emerald-50 via-white to-emerald-50 border-2 border-dashed border-emerald-300 rounded-2xl shadow-inner"
                                  >
                                    <div className="relative z-10">
                                      <div className="inline-block p-4 bg-white rounded-full shadow-lg mb-3">
                                        <IoFlask className="w-10 h-10 text-emerald-400" />
                                      </div>
                                      <p className="text-base font-bold text-emerald-800 mb-1">No standard preparations added yet</p>
                                      <p className="text-xs text-emerald-600/80 max-w-md mx-auto">
                                        Click "Add Standard Preparation" to add one
                                      </p>
                                    </div>
                                  </motion.div>
                                )}

                                {/* Weight Sheet attacher — only when at least one prep exists */}
                                {(samplePreparationIcpoesPerParam[selectedParam.id] || []).length > 0 && (
                                  <div className="pointer-events-auto mt-4">
                                    <WorksheetFileAttacher
                                      files={getFilesForPrep(selectedParam.id, "icpoes", "Weight Sheet")}
                                      onAdd={(newFiles) =>
                                        handleAddPrepFiles(selectedParam.id, "icpoes", "Weight Sheet", newFiles)
                                      }
                                      onRemove={(index) =>
                                        handleRemovePrepFile(selectedParam.id, "icpoes", "Weight Sheet", index)
                                      }
                                      preparationType="icpoes"
                                      sectionLabel="Weight Sheet"
                                      isLocked={shouldDisableContent}
                                    />
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Complete Preparation block — gates Calculations */}
                            {canManagePrep &&
                              (samplePreparationIcpoesPerParam[selectedParam.id] || []).length > 0 &&
                              (() => {
                                const isGroupCompleted =
                                  !!groupPrepCompletedAtPerParam[selectedParam.id]?.["icpoesFood"];
                                const allPrepsValid = areAllMetalPrepsDilutionValid([
                                  ...(samplePreparationIcpoesPerParam[selectedParam.id] || []),
                                ]);
                                return (
                                  <div className="mt-4 pointer-events-auto opacity-100">
                                    {isGroupCompleted ? (
                                      <div className="flex items-center gap-3 px-5 py-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                                        <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0">
                                          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                          </svg>
                                        </div>
                                        <div className="flex-1">
                                          <p className="text-sm font-semibold text-emerald-800">
                                            ICP-OES Preparation Completed
                                          </p>
                                          <p className="text-xs text-emerald-600">
                                            Completed at{" "}
                                            {new Date(
                                              groupPrepCompletedAtPerParam[selectedParam.id]["icpoesFood"]
                                            ).toLocaleString()}
                                          </p>
                                        </div>
                                        <button
                                          onClick={() => handleInitiateUnlockGroupPrep(selectedParam, "icpoesFood")}
                                          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-orange-700 bg-orange-50 border border-orange-300 rounded-lg hover:bg-orange-100 transition-colors"
                                        >
                                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                                          </svg>
                                          Unlock Preparation
                                        </button>
                                      </div>
                                    ) : (
                                      <div>
                                        {!allPrepsValid && (
                                          <div className="flex items-center gap-2 px-4 py-2.5 mb-2 bg-amber-50 border border-amber-300 rounded-xl text-xs text-amber-700 font-medium">
                                            <svg className="w-4 h-4 text-amber-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            Fix dilution step errors in all preparations before completing.
                                          </div>
                                        )}
                                        <button
                                          onClick={() => handleInitiateCompleteGroupPrep(selectedParam, "icpoesFood")}
                                          disabled={!allPrepsValid}
                                          className={`w-full flex items-center justify-center gap-2 px-5 py-3 font-semibold rounded-xl transition-all text-sm ${allPrepsValid ? "bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white shadow-md hover:shadow-lg" : "bg-slate-200 text-slate-400 cursor-not-allowed"}`}
                                        >
                                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                          </svg>
                                          Mark ICP-OES Preparation as Complete
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                );
                              })()}

                            {/* Locked-out warning */}
                            {(samplePreparationIcpoesPerParam[selectedParam.id] || []).length > 0 &&
                              !groupPrepCompletedAtPerParam[selectedParam.id]?.["icpoesFood"] &&
                              !canManagePrep && (
                                <div className="flex items-center gap-3 px-5 py-3 mt-4 bg-amber-50 border-2 border-amber-200 rounded-xl">
                                  <svg className="w-5 h-5 text-amber-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                  <p className="text-sm text-amber-800">
                                    <strong>Complete Preparation</strong> above to unlock the Calculations section.
                                  </p>
                                </div>
                              )}

                            {/* Calculations Section — gated on group prep completion */}
                            {(samplePreparationIcpoesPerParam[selectedParam.id] || []).length > 0 &&
                              groupPrepCompletedAtPerParam[selectedParam.id]?.["icpoesFood"] && (
                                <div className={isFullyLocked ? "pointer-events-none opacity-70" : ""}>
                                  <div className="mt-8">
                                    <div className="flex items-center justify-between mb-4 px-2">
                                      <h3 className="text-lg font-bold text-emerald-800 flex items-center gap-2.5 tracking-tight">
                                        <span className="w-1.5 h-6 bg-gradient-to-b from-emerald-700 to-emerald-900 rounded-full"></span>
                                        Calculations for ICP-OES
                                      </h3>
                                      <button
                                        onClick={() => handleAddCalculationIcpoes(selectedParam.id)}
                                        className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-emerald-700 to-emerald-900 text-white font-semibold rounded-xl hover:from-emerald-700 hover:to-emerald-800 transition-all duration-200 shadow-md hover:shadow-lg text-sm transform"
                                      >
                                        <Plus className="w-4 h-4" />
                                        Add Calculation
                                      </button>
                                    </div>

                                    <AnimatePresence>
                                      {(calculationsIcpoesPerParam[selectedParam.id] || []).map((calc) => (
                                        <div key={calc.id}>
                                          <CalculationDetailIcpoes
                                            calculation={calc}
                                            samplePreparations={samplePreparationIcpoesPerParam[selectedParam.id] || []}
                                            onUpdate={(updated) => handleUpdateCalculationIcpoes(selectedParam.id, updated)}
                                            onRemove={() => handleRemoveCalculationIcpoes(selectedParam.id, calc.id)}
                                            isLocked={isFullyLocked}
                                          />
                                        </div>
                                      ))}
                                    </AnimatePresence>

                                    {(calculationsIcpoesPerParam[selectedParam.id] || []).length === 0 && (
                                      <motion.div
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="relative overflow-hidden text-center py-12 bg-gradient-to-br from-emerald-50 via-white to-emerald-50 border-2 border-dashed border-emerald-300 rounded-2xl shadow-inner"
                                      >
                                        <div className="relative z-10">
                                          <div className="inline-block p-4 bg-white rounded-full shadow-lg mb-3">
                                            <Target className="w-10 h-10 text-emerald-400" />
                                          </div>
                                          <p className="text-base font-bold text-emerald-800 mb-1">
                                            No calculations added yet
                                          </p>
                                          <p className="text-xs text-emerald-600/80 max-w-md mx-auto">
                                            Click "Add Calculation" to create an ICP-OES calculation
                                          </p>
                                        </div>
                                      </motion.div>
                                    )}
                                  </div>
                                </div>
                              )}
                          </motion.div>
                        )}
                        {/* ============= END ICP-OES (FOOD) PREPARATIONS ============= */}

                        {/* ============= ICP-MS (WATER) PREPARATIONS ============= */}
                        {(activePreparationGroups[selectedParam.id] || []).includes("icpmsWater") && (
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="relative mb-10 p-8 rounded-2xl border-2 border-emerald-200/50 bg-gradient-to-br from-emerald-50/40 via-white/60 to-emerald-50/40 backdrop-blur-sm shadow-sm hover:shadow-emerald-200/50 transition-all duration-500"
                          >
                            <div className={isPreparationLocked ? "pointer-events-none opacity-70" : ""}>
                              {/* Decorative elements */}
                              <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-emerald-400/10 to-transparent rounded-bl-full -z-10" />
                              <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-emerald-400/10 to-transparent rounded-tr-full -z-10" />

                              {/* Card Header */}
                              <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-4">
                                  <div className="relative">
                                    <div className="absolute inset-0 bg-emerald-500/20 blur-xl rounded-full" />
                                    <div className="relative w-12 h-12 bg-gradient-to-br from-emerald-700 to-emerald-900 rounded-2xl flex items-center justify-center shadow-lg transform hover:rotate-6 transition-transform duration-300">
                                      <BiTestTube className="w-6 h-6 text-white" />
                                    </div>
                                  </div>
                                  <div>
                                    <h2 className="text-xl font-bold text-emerald-900 tracking-tight">
                                      Preparations for ICP-MS (Water)
                                    </h2>
                                    <p className="text-sm text-emerald-600/80 font-medium">
                                      Preparations &amp; Calculations
                                    </p>
                                  </div>
                                </div>

                                <div className="px-4 py-1 bg-gradient-to-r from-emerald-50 to-emerald-50 border border-emerald-200 rounded-full shadow-sm">
                                  <span className="text-xs font-bold text-emerald-800">
                                    {((samplePreparationIcpmsWaterPerParam[selectedParam.id] || []).length +
                                      (calculationsIcpmsWaterPerParam[selectedParam.id] || []).length)}{" "}
                                    Items
                                  </span>
                                </div>
                              </div>

                              {/* Sample Preparation Section */}
                              <div>
                                <div className="flex items-center justify-between mb-4 px-2">
                                  <h3 className="text-lg font-bold text-emerald-800 flex items-center gap-2.5 tracking-tight">
                                    <span className="w-1.5 h-6 bg-gradient-to-b from-emerald-700 to-emerald-900 rounded-full"></span>
                                    Sample Preparations for ICP-MS (Water)
                                  </h3>
                                  <button
                                    onClick={() => handleAddSamplePreparationIcpmsWater(selectedParam.id)}
                                    className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-emerald-700 to-emerald-900 text-white font-semibold rounded-xl hover:from-emerald-700 hover:to-emerald-800 transition-all duration-200 shadow-md hover:shadow-lg text-sm transform"
                                  >
                                    <Plus className="w-4 h-4" />
                                    Add Sample Preparation
                                  </button>
                                </div>

                                <AnimatePresence>
                                  {(samplePreparationIcpmsWaterPerParam[selectedParam.id] || []).map((samplePrep) => (
                                    <motion.div
                                      key={samplePrep.id}
                                      initial={{ opacity: 0, y: 10 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      exit={{ opacity: 0, y: -10 }}
                                    >
                                      <SamplePreparationMetalDetail
                                        samplePreparation={samplePrep}
                                        onStepChange={(samplePrepId, stepName, field, newValue) =>
                                          handleSamplePreparationIcpmsWaterStepChange(
                                            selectedParam.id,
                                            samplePrepId,
                                            stepName,
                                            field,
                                            newValue,
                                          )
                                        }
                                        onRemove={() =>
                                          handleRemoveSamplePreparationIcpmsWater(selectedParam.id, samplePrep.id)
                                        }
                                      />
                                    </motion.div>
                                  ))}
                                </AnimatePresence>

                                {(samplePreparationIcpmsWaterPerParam[selectedParam.id] || []).length === 0 && (
                                  <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="relative overflow-hidden text-center py-12 bg-gradient-to-br from-emerald-50 via-white to-emerald-50 border-2 border-dashed border-emerald-300 rounded-2xl shadow-inner"
                                  >
                                    <div className="relative z-10">
                                      <div className="inline-block p-4 bg-white rounded-full shadow-lg mb-3">
                                        <IoFlask className="w-10 h-10 text-emerald-400" />
                                      </div>
                                      <p className="text-base font-bold text-emerald-800 mb-1">No sample preparations added yet</p>
                                      <p className="text-xs text-emerald-600/80 max-w-md mx-auto">
                                        Click "Add Sample Preparation" to add one
                                      </p>
                                    </div>
                                  </motion.div>
                                )}
                              </div>

                              {/* Standard Preparation Section */}
                              <div className="mt-6">
                                <div className="flex items-center justify-between mb-4 px-2">
                                  <h3 className="text-lg font-bold text-emerald-800 flex items-center gap-2.5 tracking-tight">
                                    <span className="w-1.5 h-6 bg-gradient-to-b from-emerald-700 to-emerald-900 rounded-full"></span>
                                    Standard Preparations for ICP-MS (Water)
                                  </h3>
                                  <button
                                    onClick={() => handleAddStandardPreparationIcpmsWater(selectedParam.id)}
                                    className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-emerald-700 to-emerald-900 text-white font-semibold rounded-xl hover:from-emerald-700 hover:to-emerald-800 transition-all duration-200 shadow-md hover:shadow-lg text-sm transform"
                                  >
                                    <Plus className="w-4 h-4" />
                                    Add Standard Preparation
                                  </button>
                                </div>

                                <AnimatePresence>
                                  {(standardPreparationMetalPerParam[selectedParam.id]?.["icpmsWater"] || []).map((standardPrep) => (
                                    <motion.div
                                      key={standardPrep.id}
                                      initial={{ opacity: 0, y: 10 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      exit={{ opacity: 0, y: -10 }}
                                    >
                                      <StandardPreparationMetalDetail
                                        standardPreparation={standardPrep}
                                        onStepChange={(spId, stepName, field, val) =>
                                          handleStandardPreparationMetalStepChange(selectedParam.id, "icpmsWater", spId, stepName, field, val)
                                        }
                                        onRemove={() => handleRemoveStandardPreparationIcpmsWater(selectedParam.id, standardPrep.id)}
                                      />
                                    </motion.div>
                                  ))}
                                </AnimatePresence>

                                {(standardPreparationMetalPerParam[selectedParam.id]?.["icpmsWater"] || []).length === 0 && (
                                  <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="relative overflow-hidden text-center py-8 bg-gradient-to-br from-emerald-50 via-white to-emerald-50 border-2 border-dashed border-emerald-300 rounded-2xl shadow-inner"
                                  >
                                    <div className="relative z-10">
                                      <div className="inline-block p-4 bg-white rounded-full shadow-lg mb-3">
                                        <IoFlask className="w-10 h-10 text-emerald-400" />
                                      </div>
                                      <p className="text-base font-bold text-emerald-800 mb-1">No standard preparations added yet</p>
                                      <p className="text-xs text-emerald-600/80 max-w-md mx-auto">
                                        Click "Add Standard Preparation" to add one
                                      </p>
                                    </div>
                                  </motion.div>
                                )}

                                {/* Preparation Files attacher — only when at least one prep exists */}
                                {(samplePreparationIcpmsWaterPerParam[selectedParam.id] || []).length > 0 && (
                                  <div className="pointer-events-auto mt-4">
                                    <WorksheetFileAttacher
                                      files={getFilesForPrep(selectedParam.id, "icpms_water", "Preparation Files")}
                                      onAdd={(newFiles) =>
                                        handleAddPrepFiles(selectedParam.id, "icpms_water", "Preparation Files", newFiles)
                                      }
                                      onRemove={(index) =>
                                        handleRemovePrepFile(selectedParam.id, "icpms_water", "Preparation Files", index)
                                      }
                                      preparationType="icpms_water"
                                      sectionLabel="Preparation Files"
                                      isLocked={shouldDisableContent}
                                    />
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Complete Preparation block — gates Calculations */}
                            {canManagePrep &&
                              (samplePreparationIcpmsWaterPerParam[selectedParam.id] || []).length > 0 &&
                              (() => {
                                const isGroupCompleted =
                                  !!groupPrepCompletedAtPerParam[selectedParam.id]?.["icpmsWater"];
                                const allPrepsValid = areAllMetalPrepsDilutionValid([
                                  ...(samplePreparationIcpmsWaterPerParam[selectedParam.id] || []),
                                ]);
                                return (
                                  <div className="mt-4 pointer-events-auto opacity-100">
                                    {isGroupCompleted ? (
                                      <div className="flex items-center gap-3 px-5 py-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                                        <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0">
                                          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                          </svg>
                                        </div>
                                        <div className="flex-1">
                                          <p className="text-sm font-semibold text-emerald-800">
                                            ICP-MS (Water) Preparation Completed
                                          </p>
                                          <p className="text-xs text-emerald-600">
                                            Completed at{" "}
                                            {new Date(
                                              groupPrepCompletedAtPerParam[selectedParam.id]["icpmsWater"]
                                            ).toLocaleString()}
                                          </p>
                                        </div>
                                        <button
                                          onClick={() => handleInitiateUnlockGroupPrep(selectedParam, "icpmsWater")}
                                          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-orange-700 bg-orange-50 border border-orange-300 rounded-lg hover:bg-orange-100 transition-colors"
                                        >
                                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                                          </svg>
                                          Unlock Preparation
                                        </button>
                                      </div>
                                    ) : (
                                      <div>
                                        {!allPrepsValid && (
                                          <div className="flex items-center gap-2 px-4 py-2.5 mb-2 bg-amber-50 border border-amber-300 rounded-xl text-xs text-amber-700 font-medium">
                                            <svg className="w-4 h-4 text-amber-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            Fix dilution step errors in all preparations before completing.
                                          </div>
                                        )}
                                        <button
                                          onClick={() => handleInitiateCompleteGroupPrep(selectedParam, "icpmsWater")}
                                          disabled={!allPrepsValid}
                                          className={`w-full flex items-center justify-center gap-2 px-5 py-3 font-semibold rounded-xl transition-all text-sm ${allPrepsValid ? "bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white shadow-md hover:shadow-lg" : "bg-slate-200 text-slate-400 cursor-not-allowed"}`}
                                        >
                                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                          </svg>
                                          Mark ICP-MS (Water) Preparation as Complete
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                );
                              })()}

                            {/* Locked-out warning */}
                            {(samplePreparationIcpmsWaterPerParam[selectedParam.id] || []).length > 0 &&
                              !groupPrepCompletedAtPerParam[selectedParam.id]?.["icpmsWater"] &&
                              !canManagePrep && (
                                <div className="flex items-center gap-3 px-5 py-3 mt-4 bg-amber-50 border-2 border-amber-200 rounded-xl">
                                  <svg className="w-5 h-5 text-amber-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                  <p className="text-sm text-amber-800">
                                    <strong>Complete Preparation</strong> above to unlock the Calculations section.
                                  </p>
                                </div>
                              )}

                            {/* Calculations Section — gated on group prep completion */}
                            {(samplePreparationIcpmsWaterPerParam[selectedParam.id] || []).length > 0 &&
                              groupPrepCompletedAtPerParam[selectedParam.id]?.["icpmsWater"] && (
                                <div className={isFullyLocked ? "pointer-events-none opacity-70" : ""}>
                                  <div className="mt-8">
                                    <div className="flex items-center justify-between mb-4 px-2">
                                      <h3 className="text-lg font-bold text-emerald-800 flex items-center gap-2.5 tracking-tight">
                                        <span className="w-1.5 h-6 bg-gradient-to-b from-emerald-700 to-emerald-900 rounded-full"></span>
                                        Calculations for ICP-MS (Water)
                                      </h3>
                                      <button
                                        onClick={() => handleAddCalculationIcpmsWater(selectedParam.id)}
                                        className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-emerald-700 to-emerald-900 text-white font-semibold rounded-xl hover:from-emerald-700 hover:to-emerald-800 transition-all duration-200 shadow-md hover:shadow-lg text-sm transform"
                                      >
                                        <Plus className="w-4 h-4" />
                                        Add Calculation
                                      </button>
                                    </div>

                                    <AnimatePresence>
                                      {(calculationsIcpmsWaterPerParam[selectedParam.id] || []).map((calc) => (
                                        <div key={calc.id}>
                                          <CalculationDetailIcpmsWater
                                            calculation={calc}
                                            samplePreparations={samplePreparationIcpmsWaterPerParam[selectedParam.id] || []}
                                            onUpdate={(updated) => handleUpdateCalculationIcpmsWater(selectedParam.id, updated)}
                                            onRemove={() => handleRemoveCalculationIcpmsWater(selectedParam.id, calc.id)}
                                            isLocked={isFullyLocked}
                                          />
                                        </div>
                                      ))}
                                    </AnimatePresence>

                                    {(calculationsIcpmsWaterPerParam[selectedParam.id] || []).length === 0 && (
                                      <motion.div
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="relative overflow-hidden text-center py-12 bg-gradient-to-br from-emerald-50 via-white to-emerald-50 border-2 border-dashed border-emerald-300 rounded-2xl shadow-inner"
                                      >
                                        <div className="relative z-10">
                                          <div className="inline-block p-4 bg-white rounded-full shadow-lg mb-3">
                                            <Target className="w-10 h-10 text-emerald-400" />
                                          </div>
                                          <p className="text-base font-bold text-emerald-800 mb-1">
                                            No calculations added yet
                                          </p>
                                          <p className="text-xs text-emerald-600/80 max-w-md mx-auto">
                                            Click "Add Calculation" to create an ICP-MS (Water) calculation
                                          </p>
                                        </div>
                                      </motion.div>
                                    )}
                                  </div>
                                </div>
                              )}
                          </motion.div>
                        )}
                        {/* ============= END ICP-MS (WATER) PREPARATIONS ============= */}

                        {/* ============= ICP-OES (WATER) PREPARATIONS ============= */}
                        {(activePreparationGroups[selectedParam.id] || []).includes("icpoesWater") && (
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="relative mb-10 p-8 rounded-2xl border-2 border-emerald-200/50 bg-gradient-to-br from-emerald-50/40 via-white/60 to-emerald-50/40 backdrop-blur-sm shadow-sm hover:shadow-emerald-200/50 transition-all duration-500"
                          >
                            <div className={isPreparationLocked ? "pointer-events-none opacity-70" : ""}>
                              <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-emerald-400/10 to-transparent rounded-bl-full -z-10" />
                              <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-emerald-400/10 to-transparent rounded-tr-full -z-10" />
                              <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-4">
                                  <div className="relative">
                                    <div className="absolute inset-0 bg-emerald-500/20 blur-xl rounded-full" />
                                    <div className="relative w-12 h-12 bg-gradient-to-br from-emerald-700 to-emerald-900 rounded-2xl flex items-center justify-center shadow-lg transform hover:rotate-6 transition-transform duration-300">
                                      <BiTestTube className="w-6 h-6 text-white" />
                                    </div>
                                  </div>
                                  <div>
                                    <h2 className="text-xl font-bold text-emerald-900 tracking-tight">
                                      Preparations for ICP-OES (Water)
                                    </h2>
                                    <p className="text-sm text-emerald-600/80 font-medium">
                                      Preparations &amp; Calculations
                                    </p>
                                  </div>
                                </div>
                                <div className="px-4 py-1 bg-gradient-to-r from-emerald-50 to-emerald-50 border border-emerald-200 rounded-full shadow-sm">
                                  <span className="text-xs font-bold text-emerald-800">
                                    {((samplePreparationIcpoesWaterPerParam[selectedParam.id] || []).length +
                                      (calculationsIcpoesWaterPerParam[selectedParam.id] || []).length)}{" "}
                                    Items
                                  </span>
                                </div>
                              </div>
                              <div>
                                <div className="flex items-center justify-between mb-4 px-2">
                                  <h3 className="text-lg font-bold text-emerald-800 flex items-center gap-2.5 tracking-tight">
                                    <span className="w-1.5 h-6 bg-gradient-to-b from-emerald-700 to-emerald-900 rounded-full"></span>
                                    Sample Preparations for ICP-OES (Water)
                                  </h3>
                                  <button
                                    onClick={() => handleAddSamplePreparationIcpoesWater(selectedParam.id)}
                                    className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-emerald-700 to-emerald-900 text-white font-semibold rounded-xl hover:from-emerald-700 hover:to-emerald-800 transition-all duration-200 shadow-md hover:shadow-lg text-sm transform"
                                  >
                                    <Plus className="w-4 h-4" />
                                    Add Sample Preparation
                                  </button>
                                </div>
                                <AnimatePresence>
                                  {(samplePreparationIcpoesWaterPerParam[selectedParam.id] || []).map((samplePrep) => (
                                    <motion.div
                                      key={samplePrep.id}
                                      initial={{ opacity: 0, y: 10 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      exit={{ opacity: 0, y: -10 }}
                                    >
                                      <SamplePreparationMetalDetail
                                        samplePreparation={samplePrep}
                                        onStepChange={(samplePrepId, stepName, field, newValue) =>
                                          handleSamplePreparationIcpoesWaterStepChange(
                                            selectedParam.id,
                                            samplePrepId,
                                            stepName,
                                            field,
                                            newValue,
                                          )
                                        }
                                        onRemove={() =>
                                          handleRemoveSamplePreparationIcpoesWater(selectedParam.id, samplePrep.id)
                                        }
                                      />
                                    </motion.div>
                                  ))}
                                </AnimatePresence>
                                {(samplePreparationIcpoesWaterPerParam[selectedParam.id] || []).length === 0 && (
                                  <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="relative overflow-hidden text-center py-12 bg-gradient-to-br from-emerald-50 via-white to-emerald-50 border-2 border-dashed border-emerald-300 rounded-2xl shadow-inner"
                                  >
                                    <div className="relative z-10">
                                      <div className="inline-block p-4 bg-white rounded-full shadow-lg mb-3">
                                        <IoFlask className="w-10 h-10 text-emerald-400" />
                                      </div>
                                      <p className="text-base font-bold text-emerald-800 mb-1">No sample preparations added yet</p>
                                      <p className="text-xs text-emerald-600/80 max-w-md mx-auto">
                                        Click "Add Sample Preparation" to add one
                                      </p>
                                    </div>
                                  </motion.div>
                                )}
                              </div>
                              {/* Standard Preparation Section */}
                              <div className="mt-6">
                                <div className="flex items-center justify-between mb-4 px-2">
                                  <h3 className="text-lg font-bold text-emerald-800 flex items-center gap-2.5 tracking-tight">
                                    <span className="w-1.5 h-6 bg-gradient-to-b from-emerald-700 to-emerald-900 rounded-full"></span>
                                    Standard Preparations for ICP-OES (Water)
                                  </h3>
                                  <button
                                    onClick={() => handleAddStandardPreparationIcpoesWater(selectedParam.id)}
                                    className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-emerald-700 to-emerald-900 text-white font-semibold rounded-xl hover:from-emerald-700 hover:to-emerald-800 transition-all duration-200 shadow-md hover:shadow-lg text-sm transform"
                                  >
                                    <Plus className="w-4 h-4" />
                                    Add Standard Preparation
                                  </button>
                                </div>

                                <AnimatePresence>
                                  {(standardPreparationMetalPerParam[selectedParam.id]?.["icpoesWater"] || []).map((standardPrep) => (
                                    <motion.div
                                      key={standardPrep.id}
                                      initial={{ opacity: 0, y: 10 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      exit={{ opacity: 0, y: -10 }}
                                    >
                                      <StandardPreparationMetalDetail
                                        standardPreparation={standardPrep}
                                        onStepChange={(spId, stepName, field, val) =>
                                          handleStandardPreparationMetalStepChange(selectedParam.id, "icpoesWater", spId, stepName, field, val)
                                        }
                                        onRemove={() => handleRemoveStandardPreparationIcpoesWater(selectedParam.id, standardPrep.id)}
                                      />
                                    </motion.div>
                                  ))}
                                </AnimatePresence>

                                {(standardPreparationMetalPerParam[selectedParam.id]?.["icpoesWater"] || []).length === 0 && (
                                  <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="relative overflow-hidden text-center py-8 bg-gradient-to-br from-emerald-50 via-white to-emerald-50 border-2 border-dashed border-emerald-300 rounded-2xl shadow-inner"
                                  >
                                    <div className="relative z-10">
                                      <div className="inline-block p-4 bg-white rounded-full shadow-lg mb-3">
                                        <IoFlask className="w-10 h-10 text-emerald-400" />
                                      </div>
                                      <p className="text-base font-bold text-emerald-800 mb-1">No standard preparations added yet</p>
                                      <p className="text-xs text-emerald-600/80 max-w-md mx-auto">
                                        Click "Add Standard Preparation" to add one
                                      </p>
                                    </div>
                                  </motion.div>
                                )}
                                {(samplePreparationIcpoesWaterPerParam[selectedParam.id] || []).length > 0 && (
                                  <div className="pointer-events-auto mt-4">
                                    <WorksheetFileAttacher
                                      files={getFilesForPrep(selectedParam.id, "icpoes_water", "Preparation Files")}
                                      onAdd={(newFiles) =>
                                        handleAddPrepFiles(selectedParam.id, "icpoes_water", "Preparation Files", newFiles)
                                      }
                                      onRemove={(index) =>
                                        handleRemovePrepFile(selectedParam.id, "icpoes_water", "Preparation Files", index)
                                      }
                                      preparationType="icpoes_water"
                                      sectionLabel="Preparation Files"
                                      isLocked={shouldDisableContent}
                                    />
                                  </div>
                                )}
                              </div>
                            </div>
                            {canManagePrep &&
                              (samplePreparationIcpoesWaterPerParam[selectedParam.id] || []).length > 0 &&
                              (() => {
                                const isGroupCompleted =
                                  !!groupPrepCompletedAtPerParam[selectedParam.id]?.["icpoesWater"];
                                const allPrepsValid = areAllMetalPrepsDilutionValid([
                                  ...(samplePreparationIcpoesWaterPerParam[selectedParam.id] || []),
                                ]);
                                return (
                                  <div className="mt-4 pointer-events-auto opacity-100">
                                    {isGroupCompleted ? (
                                      <div className="flex items-center gap-3 px-5 py-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                                        <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0">
                                          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                          </svg>
                                        </div>
                                        <div className="flex-1">
                                          <p className="text-sm font-semibold text-emerald-800">
                                            ICP-OES (Water) Preparation Completed
                                          </p>
                                          <p className="text-xs text-emerald-600">
                                            Completed at{" "}
                                            {new Date(
                                              groupPrepCompletedAtPerParam[selectedParam.id]["icpoesWater"]
                                            ).toLocaleString()}
                                          </p>
                                        </div>
                                        <button
                                          onClick={() => handleInitiateUnlockGroupPrep(selectedParam, "icpoesWater")}
                                          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-orange-700 bg-orange-50 border border-orange-300 rounded-lg hover:bg-orange-100 transition-colors"
                                        >
                                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                                          </svg>
                                          Unlock Preparation
                                        </button>
                                      </div>
                                    ) : (
                                      <div>
                                        {!allPrepsValid && (
                                          <div className="flex items-center gap-2 px-4 py-2.5 mb-2 bg-amber-50 border border-amber-300 rounded-xl text-xs text-amber-700 font-medium">
                                            <svg className="w-4 h-4 text-amber-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            Fix dilution step errors in all preparations before completing.
                                          </div>
                                        )}
                                        <button
                                          onClick={() => handleInitiateCompleteGroupPrep(selectedParam, "icpoesWater")}
                                          disabled={!allPrepsValid}
                                          className={`w-full flex items-center justify-center gap-2 px-5 py-3 font-semibold rounded-xl transition-all text-sm ${allPrepsValid ? "bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white shadow-md hover:shadow-lg" : "bg-slate-200 text-slate-400 cursor-not-allowed"}`}
                                        >
                                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                          </svg>
                                          Mark ICP-OES (Water) Preparation as Complete
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                );
                              })()}
                            {(samplePreparationIcpoesWaterPerParam[selectedParam.id] || []).length > 0 &&
                              !groupPrepCompletedAtPerParam[selectedParam.id]?.["icpoesWater"] &&
                              !canManagePrep && (
                                <div className="flex items-center gap-3 px-5 py-3 mt-4 bg-amber-50 border-2 border-amber-200 rounded-xl">
                                  <svg className="w-5 h-5 text-amber-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                  <p className="text-sm text-amber-800">
                                    <strong>Complete Preparation</strong> above to unlock the Calculations section.
                                  </p>
                                </div>
                              )}
                            {(samplePreparationIcpoesWaterPerParam[selectedParam.id] || []).length > 0 &&
                              groupPrepCompletedAtPerParam[selectedParam.id]?.["icpoesWater"] && (
                                <div className={isFullyLocked ? "pointer-events-none opacity-70" : ""}>
                                  <div className="mt-8">
                                    <div className="flex items-center justify-between mb-4 px-2">
                                      <h3 className="text-lg font-bold text-emerald-800 flex items-center gap-2.5 tracking-tight">
                                        <span className="w-1.5 h-6 bg-gradient-to-b from-emerald-700 to-emerald-900 rounded-full"></span>
                                        Calculations for ICP-OES (Water)
                                      </h3>
                                      <button
                                        onClick={() => handleAddCalculationIcpoesWater(selectedParam.id)}
                                        className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-emerald-700 to-emerald-900 text-white font-semibold rounded-xl hover:from-emerald-700 hover:to-emerald-800 transition-all duration-200 shadow-md hover:shadow-lg text-sm transform"
                                      >
                                        <Plus className="w-4 h-4" />
                                        Add Calculation
                                      </button>
                                    </div>
                                    <AnimatePresence>
                                      {(calculationsIcpoesWaterPerParam[selectedParam.id] || []).map((calc) => (
                                        <div key={calc.id}>
                                          <CalculationDetailIcpoesWater
                                            calculation={calc}
                                            samplePreparations={samplePreparationIcpoesWaterPerParam[selectedParam.id] || []}
                                            onUpdate={(updated) => handleUpdateCalculationIcpoesWater(selectedParam.id, updated)}
                                            onRemove={() => handleRemoveCalculationIcpoesWater(selectedParam.id, calc.id)}
                                            isLocked={isFullyLocked}
                                          />
                                        </div>
                                      ))}
                                    </AnimatePresence>
                                    {(calculationsIcpoesWaterPerParam[selectedParam.id] || []).length === 0 && (
                                      <motion.div
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="relative overflow-hidden text-center py-12 bg-gradient-to-br from-emerald-50 via-white to-emerald-50 border-2 border-dashed border-emerald-300 rounded-2xl shadow-inner"
                                      >
                                        <div className="relative z-10">
                                          <div className="inline-block p-4 bg-white rounded-full shadow-lg mb-3">
                                            <Target className="w-10 h-10 text-emerald-400" />
                                          </div>
                                          <p className="text-base font-bold text-emerald-800 mb-1">
                                            No calculations added yet
                                          </p>
                                          <p className="text-xs text-emerald-600/80 max-w-md mx-auto">
                                            Click "Add Calculation" to create an ICP-OES (Water) calculation
                                          </p>
                                        </div>
                                      </motion.div>
                                    )}
                                  </div>
                                </div>
                              )}
                          </motion.div>
                        )}
                        {/* ============= END ICP-OES (WATER) PREPARATIONS ============= */}

                        {/* ============= AAS (WATER) PREPARATIONS ============= */}
                        {(activePreparationGroups[selectedParam.id] || []).includes("aasWater") && (
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="relative mb-10 p-8 rounded-2xl border-2 border-emerald-200/50 bg-gradient-to-br from-emerald-50/40 via-white/60 to-emerald-50/40 backdrop-blur-sm shadow-sm hover:shadow-emerald-200/50 transition-all duration-500"
                          >
                            <div className={isPreparationLocked ? "pointer-events-none opacity-70" : ""}>
                              <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-emerald-400/10 to-transparent rounded-bl-full -z-10" />
                              <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-emerald-400/10 to-transparent rounded-tr-full -z-10" />
                              <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-4">
                                  <div className="relative">
                                    <div className="absolute inset-0 bg-emerald-500/20 blur-xl rounded-full" />
                                    <div className="relative w-12 h-12 bg-gradient-to-br from-emerald-700 to-emerald-900 rounded-2xl flex items-center justify-center shadow-lg transform hover:rotate-6 transition-transform duration-300">
                                      <BiTestTube className="w-6 h-6 text-white" />
                                    </div>
                                  </div>
                                  <div>
                                    <h2 className="text-xl font-bold text-emerald-900 tracking-tight">
                                      Preparations for AAS (Water)
                                    </h2>
                                    <p className="text-sm text-emerald-600/80 font-medium">
                                      Preparations &amp; Calculations
                                    </p>
                                  </div>
                                </div>
                                <div className="px-4 py-1 bg-gradient-to-r from-emerald-50 to-emerald-50 border border-emerald-200 rounded-full shadow-sm">
                                  <span className="text-xs font-bold text-emerald-800">
                                    {((samplePreparationAasWaterPerParam[selectedParam.id] || []).length +
                                      (calculationsAasWaterPerParam[selectedParam.id] || []).length)}{" "}
                                    Items
                                  </span>
                                </div>
                              </div>
                              <div>
                                <div className="flex items-center justify-between mb-4 px-2">
                                  <h3 className="text-lg font-bold text-emerald-800 flex items-center gap-2.5 tracking-tight">
                                    <span className="w-1.5 h-6 bg-gradient-to-b from-emerald-700 to-emerald-900 rounded-full"></span>
                                    Sample Preparations for AAS (Water)
                                  </h3>
                                  <button
                                    onClick={() => handleAddSamplePreparationAasWater(selectedParam.id)}
                                    className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-emerald-700 to-emerald-900 text-white font-semibold rounded-xl hover:from-emerald-700 hover:to-emerald-800 transition-all duration-200 shadow-md hover:shadow-lg text-sm transform"
                                  >
                                    <Plus className="w-4 h-4" />
                                    Add Sample Preparation
                                  </button>
                                </div>
                                <AnimatePresence>
                                  {(samplePreparationAasWaterPerParam[selectedParam.id] || []).map((samplePrep) => (
                                    <motion.div
                                      key={samplePrep.id}
                                      initial={{ opacity: 0, y: 10 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      exit={{ opacity: 0, y: -10 }}
                                    >
                                      <SamplePreparationMetalDetail
                                        samplePreparation={samplePrep}
                                        onStepChange={(samplePrepId, stepName, field, newValue) =>
                                          handleSamplePreparationAasWaterStepChange(
                                            selectedParam.id,
                                            samplePrepId,
                                            stepName,
                                            field,
                                            newValue,
                                          )
                                        }
                                        onRemove={() =>
                                          handleRemoveSamplePreparationAasWater(selectedParam.id, samplePrep.id)
                                        }
                                      />
                                    </motion.div>
                                  ))}
                                </AnimatePresence>
                                {(samplePreparationAasWaterPerParam[selectedParam.id] || []).length === 0 && (
                                  <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="relative overflow-hidden text-center py-12 bg-gradient-to-br from-emerald-50 via-white to-emerald-50 border-2 border-dashed border-emerald-300 rounded-2xl shadow-inner"
                                  >
                                    <div className="relative z-10">
                                      <div className="inline-block p-4 bg-white rounded-full shadow-lg mb-3">
                                        <IoFlask className="w-10 h-10 text-emerald-400" />
                                      </div>
                                      <p className="text-base font-bold text-emerald-800 mb-1">No sample preparations added yet</p>
                                      <p className="text-xs text-emerald-600/80 max-w-md mx-auto">
                                        Click "Add Sample Preparation" to add one
                                      </p>
                                    </div>
                                  </motion.div>
                                )}
                              </div>
                              {/* Standard Preparation Section */}
                              <div className="mt-6">
                                <div className="flex items-center justify-between mb-4 px-2">
                                  <h3 className="text-lg font-bold text-emerald-800 flex items-center gap-2.5 tracking-tight">
                                    <span className="w-1.5 h-6 bg-gradient-to-b from-emerald-700 to-emerald-900 rounded-full"></span>
                                    Standard Preparations for AAS (Water)
                                  </h3>
                                  <button
                                    onClick={() => handleAddStandardPreparationAasWater(selectedParam.id)}
                                    className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-emerald-700 to-emerald-900 text-white font-semibold rounded-xl hover:from-emerald-700 hover:to-emerald-800 transition-all duration-200 shadow-md hover:shadow-lg text-sm transform"
                                  >
                                    <Plus className="w-4 h-4" />
                                    Add Standard Preparation
                                  </button>
                                </div>

                                <AnimatePresence>
                                  {(standardPreparationMetalPerParam[selectedParam.id]?.["aasWater"] || []).map((standardPrep) => (
                                    <motion.div
                                      key={standardPrep.id}
                                      initial={{ opacity: 0, y: 10 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      exit={{ opacity: 0, y: -10 }}
                                    >
                                      <StandardPreparationMetalDetail
                                        standardPreparation={standardPrep}
                                        onStepChange={(spId, stepName, field, val) =>
                                          handleStandardPreparationMetalStepChange(selectedParam.id, "aasWater", spId, stepName, field, val)
                                        }
                                        onRemove={() => handleRemoveStandardPreparationAasWater(selectedParam.id, standardPrep.id)}
                                      />
                                    </motion.div>
                                  ))}
                                </AnimatePresence>

                                {(standardPreparationMetalPerParam[selectedParam.id]?.["aasWater"] || []).length === 0 && (
                                  <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="relative overflow-hidden text-center py-8 bg-gradient-to-br from-emerald-50 via-white to-emerald-50 border-2 border-dashed border-emerald-300 rounded-2xl shadow-inner"
                                  >
                                    <div className="relative z-10">
                                      <div className="inline-block p-4 bg-white rounded-full shadow-lg mb-3">
                                        <IoFlask className="w-10 h-10 text-emerald-400" />
                                      </div>
                                      <p className="text-base font-bold text-emerald-800 mb-1">No standard preparations added yet</p>
                                      <p className="text-xs text-emerald-600/80 max-w-md mx-auto">
                                        Click "Add Standard Preparation" to add one
                                      </p>
                                    </div>
                                  </motion.div>
                                )}
                                {(samplePreparationAasWaterPerParam[selectedParam.id] || []).length > 0 && (
                                  <div className="pointer-events-auto mt-4">
                                    <WorksheetFileAttacher
                                      files={getFilesForPrep(selectedParam.id, "aas_water", "Preparation Files")}
                                      onAdd={(newFiles) =>
                                        handleAddPrepFiles(selectedParam.id, "aas_water", "Preparation Files", newFiles)
                                      }
                                      onRemove={(index) =>
                                        handleRemovePrepFile(selectedParam.id, "aas_water", "Preparation Files", index)
                                      }
                                      preparationType="aas_water"
                                      sectionLabel="Preparation Files"
                                      isLocked={shouldDisableContent}
                                    />
                                  </div>
                                )}
                              </div>
                            </div>
                            {canManagePrep &&
                              (samplePreparationAasWaterPerParam[selectedParam.id] || []).length > 0 &&
                              (() => {
                                const isGroupCompleted =
                                  !!groupPrepCompletedAtPerParam[selectedParam.id]?.["aasWater"];
                                const allPrepsValid = areAllMetalPrepsDilutionValid([
                                  ...(samplePreparationAasWaterPerParam[selectedParam.id] || []),
                                ]);
                                return (
                                  <div className="mt-4 pointer-events-auto opacity-100">
                                    {isGroupCompleted ? (
                                      <div className="flex items-center gap-3 px-5 py-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                                        <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0">
                                          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                          </svg>
                                        </div>
                                        <div className="flex-1">
                                          <p className="text-sm font-semibold text-emerald-800">
                                            AAS (Water) Preparation Completed
                                          </p>
                                          <p className="text-xs text-emerald-600">
                                            Completed at{" "}
                                            {new Date(
                                              groupPrepCompletedAtPerParam[selectedParam.id]["aasWater"]
                                            ).toLocaleString()}
                                          </p>
                                        </div>
                                        <button
                                          onClick={() => handleInitiateUnlockGroupPrep(selectedParam, "aasWater")}
                                          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-orange-700 bg-orange-50 border border-orange-300 rounded-lg hover:bg-orange-100 transition-colors"
                                        >
                                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                                          </svg>
                                          Unlock Preparation
                                        </button>
                                      </div>
                                    ) : (
                                      <div>
                                        {!allPrepsValid && (
                                          <div className="flex items-center gap-2 px-4 py-2.5 mb-2 bg-amber-50 border border-amber-300 rounded-xl text-xs text-amber-700 font-medium">
                                            <svg className="w-4 h-4 text-amber-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            Fix dilution step errors in all preparations before completing.
                                          </div>
                                        )}
                                        <button
                                          onClick={() => handleInitiateCompleteGroupPrep(selectedParam, "aasWater")}
                                          disabled={!allPrepsValid}
                                          className={`w-full flex items-center justify-center gap-2 px-5 py-3 font-semibold rounded-xl transition-all text-sm ${allPrepsValid ? "bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white shadow-md hover:shadow-lg" : "bg-slate-200 text-slate-400 cursor-not-allowed"}`}
                                        >
                                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                          </svg>
                                          Mark AAS (Water) Preparation as Complete
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                );
                              })()}
                            {(samplePreparationAasWaterPerParam[selectedParam.id] || []).length > 0 &&
                              !groupPrepCompletedAtPerParam[selectedParam.id]?.["aasWater"] &&
                              !canManagePrep && (
                                <div className="flex items-center gap-3 px-5 py-3 mt-4 bg-amber-50 border-2 border-amber-200 rounded-xl">
                                  <svg className="w-5 h-5 text-amber-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                  <p className="text-sm text-amber-800">
                                    <strong>Complete Preparation</strong> above to unlock the Calculations section.
                                  </p>
                                </div>
                              )}
                            {(samplePreparationAasWaterPerParam[selectedParam.id] || []).length > 0 &&
                              groupPrepCompletedAtPerParam[selectedParam.id]?.["aasWater"] && (
                                <div className={isFullyLocked ? "pointer-events-none opacity-70" : ""}>
                                  <div className="mt-8">
                                    <div className="flex items-center justify-between mb-4 px-2">
                                      <h3 className="text-lg font-bold text-emerald-800 flex items-center gap-2.5 tracking-tight">
                                        <span className="w-1.5 h-6 bg-gradient-to-b from-emerald-700 to-emerald-900 rounded-full"></span>
                                        Calculations for AAS (Water)
                                      </h3>
                                      <button
                                        onClick={() => handleAddCalculationAasWater(selectedParam.id)}
                                        className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-emerald-700 to-emerald-900 text-white font-semibold rounded-xl hover:from-emerald-700 hover:to-emerald-800 transition-all duration-200 shadow-md hover:shadow-lg text-sm transform"
                                      >
                                        <Plus className="w-4 h-4" />
                                        Add Calculation
                                      </button>
                                    </div>
                                    <AnimatePresence>
                                      {(calculationsAasWaterPerParam[selectedParam.id] || []).map((calc) => (
                                        <div key={calc.id}>
                                          <CalculationDetailAasWater
                                            calculation={calc}
                                            samplePreparations={samplePreparationAasWaterPerParam[selectedParam.id] || []}
                                            onUpdate={(updated) => handleUpdateCalculationAasWater(selectedParam.id, updated)}
                                            onRemove={() => handleRemoveCalculationAasWater(selectedParam.id, calc.id)}
                                            isLocked={isFullyLocked}
                                          />
                                        </div>
                                      ))}
                                    </AnimatePresence>
                                    {(calculationsAasWaterPerParam[selectedParam.id] || []).length === 0 && (
                                      <motion.div
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="relative overflow-hidden text-center py-12 bg-gradient-to-br from-emerald-50 via-white to-emerald-50 border-2 border-dashed border-emerald-300 rounded-2xl shadow-inner"
                                      >
                                        <div className="relative z-10">
                                          <div className="inline-block p-4 bg-white rounded-full shadow-lg mb-3">
                                            <Target className="w-10 h-10 text-emerald-400" />
                                          </div>
                                          <p className="text-base font-bold text-emerald-800 mb-1">
                                            No calculations added yet
                                          </p>
                                          <p className="text-xs text-emerald-600/80 max-w-md mx-auto">
                                            Click "Add Calculation" to create an AAS (Water) calculation
                                          </p>
                                        </div>
                                      </motion.div>
                                    )}
                                  </div>
                                </div>
                              )}
                          </motion.div>
                        )}
                        {/* ============= END AAS (WATER) PREPARATIONS ============= */}

                        {/* ============= ICP-MS (ICH-Q3D) PREPARATIONS ============= */}
                        {(activePreparationGroups[selectedParam.id] || []).includes("icpmsIchQ3D") && (
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="relative mb-10 p-8 rounded-2xl border-2 border-emerald-200/50 bg-gradient-to-br from-emerald-50/40 via-white/60 to-emerald-50/40 backdrop-blur-sm shadow-sm hover:shadow-emerald-200/50 transition-all duration-500"
                          >
                            <div className={isPreparationLocked ? "pointer-events-none opacity-70" : ""}>
                              {/* Decorative elements */}
                              <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-emerald-400/10 to-transparent rounded-bl-full -z-10" />
                              <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-emerald-400/10 to-transparent rounded-tr-full -z-10" />

                              {/* Card Header */}
                              <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-4">
                                  <div className="relative">
                                    <div className="absolute inset-0 bg-emerald-500/20 blur-xl rounded-full" />
                                    <div className="relative w-12 h-12 bg-gradient-to-br from-emerald-700 to-emerald-900 rounded-2xl flex items-center justify-center shadow-lg transform hover:rotate-6 transition-transform duration-300">
                                      <BiTestTube className="w-6 h-6 text-white" />
                                    </div>
                                  </div>
                                  <div>
                                    <h2 className="text-xl font-bold text-emerald-900 tracking-tight">
                                      Preparations for ICP-MS (ICH-Q3D)
                                    </h2>
                                    <p className="text-sm text-emerald-600/80 font-medium">
                                      Preparations &amp; Calculations
                                    </p>
                                  </div>
                                </div>

                                <div className="px-4 py-1 bg-gradient-to-r from-emerald-50 to-emerald-50 border border-emerald-200 rounded-full shadow-sm">
                                  <span className="text-xs font-bold text-emerald-800">
                                    {((samplePreparationIcpmsIchQ3DPerParam[selectedParam.id] || []).length +
                                      (calculationsIcpmsIchQ3DPerParam[selectedParam.id] || []).length)}{" "}
                                    Items
                                  </span>
                                </div>
                              </div>

                              {/* Sample Preparation Section */}
                              <div>
                                <div className="flex items-center justify-between mb-4 px-2">
                                  <h3 className="text-lg font-bold text-emerald-800 flex items-center gap-2.5 tracking-tight">
                                    <span className="w-1.5 h-6 bg-gradient-to-b from-emerald-700 to-emerald-900 rounded-full"></span>
                                    Sample Preparations for ICP-MS (ICH-Q3D)
                                  </h3>
                                  <button
                                    onClick={() => handleAddSamplePreparationIcpmsIchQ3D(selectedParam.id)}
                                    className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-emerald-700 to-emerald-900 text-white font-semibold rounded-xl hover:from-emerald-700 hover:to-emerald-800 transition-all duration-200 shadow-md hover:shadow-lg text-sm transform"
                                  >
                                    <Plus className="w-4 h-4" />
                                    Add Sample Preparation
                                  </button>
                                </div>

                                <AnimatePresence>
                                  {(samplePreparationIcpmsIchQ3DPerParam[selectedParam.id] || []).map((samplePrep) => (
                                    <motion.div
                                      key={samplePrep.id}
                                      initial={{ opacity: 0, y: 10 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      exit={{ opacity: 0, y: -10 }}
                                    >
                                      <SamplePreparationMetalDetail
                                        samplePreparation={samplePrep}
                                        onStepChange={(samplePrepId, stepName, field, newValue) =>
                                          handleSamplePreparationIcpmsIchQ3DStepChange(
                                            selectedParam.id,
                                            samplePrepId,
                                            stepName,
                                            field,
                                            newValue,
                                          )
                                        }
                                        onRemove={() =>
                                          handleRemoveSamplePreparationIcpmsIchQ3D(selectedParam.id, samplePrep.id)
                                        }
                                      />
                                    </motion.div>
                                  ))}
                                </AnimatePresence>

                                {(samplePreparationIcpmsIchQ3DPerParam[selectedParam.id] || []).length === 0 && (
                                  <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="relative overflow-hidden text-center py-12 bg-gradient-to-br from-emerald-50 via-white to-emerald-50 border-2 border-dashed border-emerald-300 rounded-2xl shadow-inner"
                                  >
                                    <div className="relative z-10">
                                      <div className="inline-block p-4 bg-white rounded-full shadow-lg mb-3">
                                        <IoFlask className="w-10 h-10 text-emerald-400" />
                                      </div>
                                      <p className="text-base font-bold text-emerald-800 mb-1">No sample preparations added yet</p>
                                      <p className="text-xs text-emerald-600/80 max-w-md mx-auto">
                                        Click "Add Sample Preparation" to add one
                                      </p>
                                    </div>
                                  </motion.div>
                                )}
                              </div>

                              {/* Standard Preparation Section */}
                              <div className="mt-6">
                                <div className="flex items-center justify-between mb-4 px-2">
                                  <h3 className="text-lg font-bold text-emerald-800 flex items-center gap-2.5 tracking-tight">
                                    <span className="w-1.5 h-6 bg-gradient-to-b from-emerald-700 to-emerald-900 rounded-full"></span>
                                    Standard Preparations for ICP-MS (ICH-Q3D)
                                  </h3>
                                  <button
                                    onClick={() => handleAddStandardPreparationIcpmsIchQ3D(selectedParam.id)}
                                    className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-emerald-700 to-emerald-900 text-white font-semibold rounded-xl hover:from-emerald-700 hover:to-emerald-800 transition-all duration-200 shadow-md hover:shadow-lg text-sm transform"
                                  >
                                    <Plus className="w-4 h-4" />
                                    Add Standard Preparation
                                  </button>
                                </div>

                                <AnimatePresence>
                                  {(standardPreparationMetalPerParam[selectedParam.id]?.["icpmsIchQ3D"] || []).map((standardPrep) => (
                                    <motion.div
                                      key={standardPrep.id}
                                      initial={{ opacity: 0, y: 10 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      exit={{ opacity: 0, y: -10 }}
                                    >
                                      <StandardPreparationMetalDetail
                                        standardPreparation={standardPrep}
                                        onStepChange={(spId, stepName, field, val) =>
                                          handleStandardPreparationMetalStepChange(selectedParam.id, "icpmsIchQ3D", spId, stepName, field, val)
                                        }
                                        onRemove={() => handleRemoveStandardPreparationIcpmsIchQ3D(selectedParam.id, standardPrep.id)}
                                      />
                                    </motion.div>
                                  ))}
                                </AnimatePresence>

                                {(standardPreparationMetalPerParam[selectedParam.id]?.["icpmsIchQ3D"] || []).length === 0 && (
                                  <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="relative overflow-hidden text-center py-8 bg-gradient-to-br from-emerald-50 via-white to-emerald-50 border-2 border-dashed border-emerald-300 rounded-2xl shadow-inner"
                                  >
                                    <div className="relative z-10">
                                      <div className="inline-block p-4 bg-white rounded-full shadow-lg mb-3">
                                        <IoFlask className="w-10 h-10 text-emerald-400" />
                                      </div>
                                      <p className="text-base font-bold text-emerald-800 mb-1">No standard preparations added yet</p>
                                      <p className="text-xs text-emerald-600/80 max-w-md mx-auto">
                                        Click "Add Standard Preparation" to add one
                                      </p>
                                    </div>
                                  </motion.div>
                                )}

                                {/* Weight Sheet attacher — only when at least one prep exists */}
                                {(samplePreparationIcpmsIchQ3DPerParam[selectedParam.id] || []).length > 0 && (
                                  <div className="pointer-events-auto mt-4">
                                    <WorksheetFileAttacher
                                      files={getFilesForPrep(selectedParam.id, "icpms_ich_q3d", "Weight Sheet")}
                                      onAdd={(newFiles) =>
                                        handleAddPrepFiles(selectedParam.id, "icpms_ich_q3d", "Weight Sheet", newFiles)
                                      }
                                      onRemove={(index) =>
                                        handleRemovePrepFile(selectedParam.id, "icpms_ich_q3d", "Weight Sheet", index)
                                      }
                                      preparationType="icpms_ich_q3d"
                                      sectionLabel="Weight Sheet"
                                      isLocked={shouldDisableContent}
                                    />
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Complete Preparation block — gates Calculations */}
                            {canManagePrep &&
                              (samplePreparationIcpmsIchQ3DPerParam[selectedParam.id] || []).length > 0 &&
                              (() => {
                                const isGroupCompleted =
                                  !!groupPrepCompletedAtPerParam[selectedParam.id]?.["icpmsIchQ3D"];
                                const allPrepsValid = areAllMetalPrepsDilutionValid([
                                  ...(samplePreparationIcpmsIchQ3DPerParam[selectedParam.id] || []),
                                ]);
                                return (
                                  <div className="mt-4 pointer-events-auto opacity-100">
                                    {isGroupCompleted ? (
                                      <div className="flex items-center gap-3 px-5 py-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                                        <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0">
                                          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                          </svg>
                                        </div>
                                        <div className="flex-1">
                                          <p className="text-sm font-semibold text-emerald-800">
                                            ICP-MS (ICH-Q3D) Preparation Completed
                                          </p>
                                          <p className="text-xs text-emerald-600">
                                            Completed at{" "}
                                            {new Date(
                                              groupPrepCompletedAtPerParam[selectedParam.id]["icpmsIchQ3D"]
                                            ).toLocaleString()}
                                          </p>
                                        </div>
                                        <button
                                          onClick={() => handleInitiateUnlockGroupPrep(selectedParam, "icpmsIchQ3D")}
                                          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-orange-700 bg-orange-50 border border-orange-300 rounded-lg hover:bg-orange-100 transition-colors"
                                        >
                                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                                          </svg>
                                          Unlock Preparation
                                        </button>
                                      </div>
                                    ) : (
                                      <div>
                                        {!allPrepsValid && (
                                          <div className="flex items-center gap-2 px-4 py-2.5 mb-2 bg-amber-50 border border-amber-300 rounded-xl text-xs text-amber-700 font-medium">
                                            <svg className="w-4 h-4 text-amber-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            Fix dilution step errors in all preparations before completing.
                                          </div>
                                        )}
                                        <button
                                          onClick={() => handleInitiateCompleteGroupPrep(selectedParam, "icpmsIchQ3D")}
                                          disabled={!allPrepsValid}
                                          className={`w-full flex items-center justify-center gap-2 px-5 py-3 font-semibold rounded-xl transition-all text-sm ${allPrepsValid ? "bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white shadow-md hover:shadow-lg" : "bg-slate-200 text-slate-400 cursor-not-allowed"}`}
                                        >
                                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                          </svg>
                                          Mark ICP-MS (ICH-Q3D) Preparation as Complete
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                );
                              })()}

                            {/* Locked-out warning */}
                            {(samplePreparationIcpmsIchQ3DPerParam[selectedParam.id] || []).length > 0 &&
                              !groupPrepCompletedAtPerParam[selectedParam.id]?.["icpmsIchQ3D"] &&
                              !canManagePrep && (
                                <div className="flex items-center gap-3 px-5 py-3 mt-4 bg-amber-50 border-2 border-amber-200 rounded-xl">
                                  <svg className="w-5 h-5 text-amber-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                  <p className="text-sm text-amber-800">
                                    <strong>Complete Preparation</strong> above to unlock the Calculations section.
                                  </p>
                                </div>
                              )}

                            {/* Calculations Section — gated on group prep completion */}
                            {(samplePreparationIcpmsIchQ3DPerParam[selectedParam.id] || []).length > 0 &&
                              groupPrepCompletedAtPerParam[selectedParam.id]?.["icpmsIchQ3D"] && (
                                <div className={isFullyLocked ? "pointer-events-none opacity-70" : ""}>
                                  <div className="mt-8">
                                    <div className="flex items-center justify-between mb-4 px-2">
                                      <h3 className="text-lg font-bold text-emerald-800 flex items-center gap-2.5 tracking-tight">
                                        <span className="w-1.5 h-6 bg-gradient-to-b from-emerald-700 to-emerald-900 rounded-full"></span>
                                        Calculations for ICP-MS (ICH-Q3D)
                                      </h3>
                                      <button
                                        onClick={() => handleAddCalculationIcpmsIchQ3D(selectedParam.id)}
                                        className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-emerald-700 to-emerald-900 text-white font-semibold rounded-xl hover:from-emerald-700 hover:to-emerald-800 transition-all duration-200 shadow-md hover:shadow-lg text-sm transform"
                                      >
                                        <Plus className="w-4 h-4" />
                                        Add Calculation
                                      </button>
                                    </div>

                                    <AnimatePresence>
                                      {(calculationsIcpmsIchQ3DPerParam[selectedParam.id] || []).map((calc) => (
                                        <div key={calc.id}>
                                          <CalculationDetailIcpmsIchQ3D
                                            calculation={calc}
                                            samplePreparations={samplePreparationIcpmsIchQ3DPerParam[selectedParam.id] || []}
                                            onUpdate={(updated) => handleUpdateCalculationIcpmsIchQ3D(selectedParam.id, updated)}
                                            onRemove={() => handleRemoveCalculationIcpmsIchQ3D(selectedParam.id, calc.id)}
                                            isLocked={isFullyLocked}
                                          />
                                        </div>
                                      ))}
                                    </AnimatePresence>

                                    {(calculationsIcpmsIchQ3DPerParam[selectedParam.id] || []).length === 0 && (
                                      <motion.div
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="relative overflow-hidden text-center py-12 bg-gradient-to-br from-emerald-50 via-white to-emerald-50 border-2 border-dashed border-emerald-300 rounded-2xl shadow-inner"
                                      >
                                        <div className="relative z-10">
                                          <div className="inline-block p-4 bg-white rounded-full shadow-lg mb-3">
                                            <Target className="w-10 h-10 text-emerald-400" />
                                          </div>
                                          <p className="text-base font-bold text-emerald-800 mb-1">
                                            No calculations added yet
                                          </p>
                                          <p className="text-xs text-emerald-600/80 max-w-md mx-auto">
                                            Click "Add Calculation" to create an ICP-MS (ICH-Q3D) calculation
                                          </p>
                                        </div>
                                      </motion.div>
                                    )}
                                  </div>
                                </div>
                              )}
                          </motion.div>
                        )}
                        {/* ============= END ICP-MS (ICH-Q3D) PREPARATIONS ============= */}

                        {/* ============= ORS PREPARATIONS ============= */}
                        {(activePreparationGroups[selectedParam.id] || []).includes("ors") && (
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="relative mb-10 p-8 rounded-2xl border-2 border-emerald-200/50 bg-gradient-to-br from-emerald-50/40 via-white/60 to-emerald-50/40 backdrop-blur-sm shadow-sm hover:shadow-emerald-200/50 transition-all duration-500"
                          >
                            <div className={isPreparationLocked ? "pointer-events-none opacity-70" : ""}>
                              {/* Decorative elements */}
                              <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-emerald-400/10 to-transparent rounded-bl-full -z-10" />
                              <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-emerald-400/10 to-transparent rounded-tr-full -z-10" />

                              {/* Card Header */}
                              <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-4">
                                  <div className="relative">
                                    <div className="absolute inset-0 bg-emerald-500/20 blur-xl rounded-full" />
                                    <div className="relative w-12 h-12 bg-gradient-to-br from-emerald-700 to-emerald-900 rounded-2xl flex items-center justify-center shadow-lg transform hover:rotate-6 transition-transform duration-300">
                                      <BiTestTube className="w-6 h-6 text-white" />
                                    </div>
                                  </div>
                                  <div>
                                    <h2 className="text-xl font-bold text-emerald-900 tracking-tight">
                                      Sample Preparations for ORS
                                    </h2>
                                    <p className="text-sm text-emerald-600/80 font-medium">
                                      ORS — Sample Preparation &amp; % of LC Calculations
                                    </p>
                                  </div>
                                </div>

                                <div className="px-4 py-1 bg-gradient-to-r from-emerald-50 to-emerald-50 border border-emerald-200 rounded-full shadow-sm">
                                  <span className="text-xs font-bold text-emerald-800">
                                    {((samplePreparationORSPerParam[selectedParam.id] || []).length +
                                      (calculationsORSPerParam[selectedParam.id] || []).length)}{" "}
                                    Items
                                  </span>
                                </div>
                              </div>

                              {/* Sample Preparation Section */}
                              <div>
                                <div className="flex items-center justify-between mb-4 px-2">
                                  <h3 className="text-lg font-bold text-emerald-800 flex items-center gap-2.5 tracking-tight">
                                    <span className="w-1.5 h-6 bg-gradient-to-b from-emerald-700 to-emerald-900 rounded-full"></span>
                                    Sample Preparations for ORS
                                  </h3>
                                  <button
                                    onClick={() => handleAddSamplePreparationORS(selectedParam.id)}
                                    className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-emerald-700 to-emerald-900 text-white font-semibold rounded-xl hover:from-emerald-700 hover:to-emerald-800 transition-all duration-200 shadow-md hover:shadow-lg text-sm transform"
                                  >
                                    <Plus className="w-4 h-4" />
                                    Add Sample Preparation
                                  </button>
                                </div>

                                <AnimatePresence>
                                  {(samplePreparationORSPerParam[selectedParam.id] || []).map((samplePrep) => (
                                    <motion.div
                                      key={samplePrep.id}
                                      initial={{ opacity: 0, y: 10 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      exit={{ opacity: 0, y: -10 }}
                                    >
                                      <SamplePreparationMetalDetail
                                        samplePreparation={samplePrep}
                                        onStepChange={(samplePrepId, stepName, field, newValue) =>
                                          handleSamplePreparationORSStepChange(
                                            selectedParam.id,
                                            samplePrepId,
                                            stepName,
                                            field,
                                            newValue,
                                          )
                                        }
                                        onRemove={() =>
                                          handleRemoveSamplePreparationORS(selectedParam.id, samplePrep.id)
                                        }
                                      />
                                    </motion.div>
                                  ))}
                                </AnimatePresence>

                                {(samplePreparationORSPerParam[selectedParam.id] || []).length === 0 && (
                                  <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="relative overflow-hidden text-center py-12 bg-gradient-to-br from-emerald-50 via-white to-emerald-50 border-2 border-dashed border-emerald-300 rounded-2xl shadow-inner"
                                  >
                                    <div className="relative z-10">
                                      <div className="inline-block p-4 bg-white rounded-full shadow-lg mb-3">
                                        <IoFlask className="w-10 h-10 text-emerald-400" />
                                      </div>
                                      <p className="text-base font-bold text-emerald-800 mb-1">No sample preparations added yet</p>
                                      <p className="text-xs text-emerald-600/80 max-w-md mx-auto">
                                        Click "Add Sample Preparation" to add one
                                      </p>
                                    </div>
                                  </motion.div>
                                )}
                              </div>

                              {/* Standard Preparation Section */}
                              <div className="mt-6">
                                <div className="flex items-center justify-between mb-4 px-2">
                                  <h3 className="text-lg font-bold text-emerald-800 flex items-center gap-2.5 tracking-tight">
                                    <span className="w-1.5 h-6 bg-gradient-to-b from-emerald-700 to-emerald-900 rounded-full"></span>
                                    Standard Preparations for ORS
                                  </h3>
                                  <button
                                    onClick={() => handleAddStandardPreparationORS(selectedParam.id)}
                                    className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-emerald-700 to-emerald-900 text-white font-semibold rounded-xl hover:from-emerald-700 hover:to-emerald-800 transition-all duration-200 shadow-md hover:shadow-lg text-sm transform"
                                  >
                                    <Plus className="w-4 h-4" />
                                    Add Standard Preparation
                                  </button>
                                </div>

                                <AnimatePresence>
                                  {(standardPreparationMetalPerParam[selectedParam.id]?.["ors"] || []).map((standardPrep) => (
                                    <motion.div
                                      key={standardPrep.id}
                                      initial={{ opacity: 0, y: 10 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      exit={{ opacity: 0, y: -10 }}
                                    >
                                      <StandardPreparationMetalDetail
                                        standardPreparation={standardPrep}
                                        onStepChange={(spId, stepName, field, val) =>
                                          handleStandardPreparationMetalStepChange(selectedParam.id, "ors", spId, stepName, field, val)
                                        }
                                        onRemove={() => handleRemoveStandardPreparationORS(selectedParam.id, standardPrep.id)}
                                      />
                                    </motion.div>
                                  ))}
                                </AnimatePresence>

                                {(standardPreparationMetalPerParam[selectedParam.id]?.["ors"] || []).length === 0 && (
                                  <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="relative overflow-hidden text-center py-8 bg-gradient-to-br from-emerald-50 via-white to-emerald-50 border-2 border-dashed border-emerald-300 rounded-2xl shadow-inner"
                                  >
                                    <div className="relative z-10">
                                      <div className="inline-block p-4 bg-white rounded-full shadow-lg mb-3">
                                        <IoFlask className="w-10 h-10 text-emerald-400" />
                                      </div>
                                      <p className="text-base font-bold text-emerald-800 mb-1">No standard preparations added yet</p>
                                      <p className="text-xs text-emerald-600/80 max-w-md mx-auto">
                                        Click "Add Standard Preparation" to add one
                                      </p>
                                    </div>
                                  </motion.div>
                                )}

                                {/* Weight Sheet attacher — only when at least one prep exists */}
                                {(samplePreparationORSPerParam[selectedParam.id] || []).length > 0 && (
                                  <div className="pointer-events-auto mt-4">
                                    <WorksheetFileAttacher
                                      files={getFilesForPrep(selectedParam.id, "ors", "Weight Sheet")}
                                      onAdd={(newFiles) =>
                                        handleAddPrepFiles(selectedParam.id, "ors", "Weight Sheet", newFiles)
                                      }
                                      onRemove={(index) =>
                                        handleRemovePrepFile(selectedParam.id, "ors", "Weight Sheet", index)
                                      }
                                      preparationType="ors"
                                      sectionLabel="Weight Sheet"
                                      isLocked={shouldDisableContent}
                                    />
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Complete Preparation block — gates Calculations */}
                            {canManagePrep &&
                              (samplePreparationORSPerParam[selectedParam.id] || []).length > 0 &&
                              (() => {
                                const isGroupCompleted =
                                  !!groupPrepCompletedAtPerParam[selectedParam.id]?.["ors"];
                                const allPrepsValid = areAllMetalPrepsDilutionValid([
                                  ...(samplePreparationORSPerParam[selectedParam.id] || []),
                                ]);
                                return (
                                  <div className="mt-4 pointer-events-auto opacity-100">
                                    {isGroupCompleted ? (
                                      <div className="flex items-center gap-3 px-5 py-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                                        <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0">
                                          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                          </svg>
                                        </div>
                                        <div className="flex-1">
                                          <p className="text-sm font-semibold text-emerald-800">
                                            ORS Preparation Completed
                                          </p>
                                          <p className="text-xs text-emerald-600">
                                            Completed at{" "}
                                            {new Date(
                                              groupPrepCompletedAtPerParam[selectedParam.id]["ors"]
                                            ).toLocaleString()}
                                          </p>
                                        </div>
                                        <button
                                          onClick={() => handleInitiateUnlockGroupPrep(selectedParam, "ors")}
                                          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-orange-700 bg-orange-50 border border-orange-300 rounded-lg hover:bg-orange-100 transition-colors"
                                        >
                                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                                          </svg>
                                          Unlock Preparation
                                        </button>
                                      </div>
                                    ) : (
                                      <div>
                                        {!allPrepsValid && (
                                          <div className="flex items-center gap-2 px-4 py-2.5 mb-2 bg-amber-50 border border-amber-300 rounded-xl text-xs text-amber-700 font-medium">
                                            <svg className="w-4 h-4 text-amber-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            Fix dilution step errors in all preparations before completing.
                                          </div>
                                        )}
                                        <button
                                          onClick={() => handleInitiateCompleteGroupPrep(selectedParam, "ors")}
                                          disabled={!allPrepsValid}
                                          className={`w-full flex items-center justify-center gap-2 px-5 py-3 font-semibold rounded-xl transition-all text-sm ${allPrepsValid ? "bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white shadow-md hover:shadow-lg" : "bg-slate-200 text-slate-400 cursor-not-allowed"}`}
                                        >
                                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                          </svg>
                                          Mark ORS Preparation as Complete
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                );
                              })()}

                            {/* Locked-out warning */}
                            {(samplePreparationORSPerParam[selectedParam.id] || []).length > 0 &&
                              !groupPrepCompletedAtPerParam[selectedParam.id]?.["ors"] &&
                              !canManagePrep && (
                                <div className="flex items-center gap-3 px-5 py-3 mt-4 bg-amber-50 border-2 border-amber-200 rounded-xl">
                                  <svg className="w-5 h-5 text-amber-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                  <p className="text-sm text-amber-800">
                                    <strong>Complete Preparation</strong> above to unlock the Calculations section.
                                  </p>
                                </div>
                              )}

                            {/* Calculations Section — gated on group prep completion */}
                            {(samplePreparationORSPerParam[selectedParam.id] || []).length > 0 &&
                              groupPrepCompletedAtPerParam[selectedParam.id]?.["ors"] && (
                                <div className={isFullyLocked ? "pointer-events-none opacity-70" : ""}>
                                  <div className="mt-8">
                                    <div className="flex items-center justify-between mb-4 px-2">
                                      <h3 className="text-lg font-bold text-emerald-800 flex items-center gap-2.5 tracking-tight">
                                        <span className="w-1.5 h-6 bg-gradient-to-b from-emerald-700 to-emerald-900 rounded-full"></span>
                                        Calculations for ORS
                                      </h3>
                                      <button
                                        onClick={() => handleAddCalculationORS(selectedParam.id)}
                                        className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-emerald-700 to-emerald-900 text-white font-semibold rounded-xl hover:from-emerald-700 hover:to-emerald-800 transition-all duration-200 shadow-md hover:shadow-lg text-sm transform"
                                      >
                                        <Plus className="w-4 h-4" />
                                        Add Calculation
                                      </button>
                                    </div>

                                    <AnimatePresence>
                                      {(calculationsORSPerParam[selectedParam.id] || []).map((calc) => (
                                        <div key={calc.id}>
                                          <CalculationDetailORS
                                            calculation={calc}
                                            samplePreparations={samplePreparationORSPerParam[selectedParam.id] || []}
                                            onUpdate={(updated) => handleUpdateCalculationORS(selectedParam.id, updated)}
                                            onRemove={() => handleRemoveCalculationORS(selectedParam.id, calc.id)}
                                            isLocked={isFullyLocked}
                                          />
                                        </div>
                                      ))}
                                    </AnimatePresence>

                                    {(calculationsORSPerParam[selectedParam.id] || []).length === 0 && (
                                      <motion.div
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="relative overflow-hidden text-center py-12 bg-gradient-to-br from-emerald-50 via-white to-emerald-50 border-2 border-dashed border-emerald-300 rounded-2xl shadow-inner"
                                      >
                                        <div className="relative z-10">
                                          <div className="inline-block p-4 bg-white rounded-full shadow-lg mb-3">
                                            <Target className="w-10 h-10 text-emerald-400" />
                                          </div>
                                          <p className="text-base font-bold text-emerald-800 mb-1">
                                            No calculations added yet
                                          </p>
                                          <p className="text-xs text-emerald-600/80 max-w-md mx-auto">
                                            Click "Add Calculation" to create an ORS calculation
                                          </p>
                                        </div>
                                      </motion.div>
                                    )}
                                  </div>
                                </div>
                              )}
                          </motion.div>
                        )}
                        {/* ============= END ORS PREPARATIONS ============= */}

                        {/* ============= ANOFER PREPARATIONS ============= */}
                        {(activePreparationGroups[selectedParam.id] || []).includes("anofer") && (
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="relative mb-10 p-8 rounded-2xl border-2 border-emerald-200/50 bg-gradient-to-br from-emerald-50/40 via-white/60 to-emerald-50/40 backdrop-blur-sm shadow-sm hover:shadow-emerald-200/50 transition-all duration-500"
                          >
                            <div className={isPreparationLocked ? "pointer-events-none opacity-70" : ""}>
                              {/* Decorative elements */}
                              <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-emerald-400/10 to-transparent rounded-bl-full -z-10" />
                              <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-emerald-400/10 to-transparent rounded-tr-full -z-10" />

                              {/* Card Header */}
                              <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-4">
                                  <div className="relative">
                                    <div className="absolute inset-0 bg-emerald-500/20 blur-xl rounded-full" />
                                    <div className="relative w-12 h-12 bg-gradient-to-br from-emerald-700 to-emerald-900 rounded-2xl flex items-center justify-center shadow-lg transform hover:rotate-6 transition-transform duration-300">
                                      <BiTestTube className="w-6 h-6 text-white" />
                                    </div>
                                  </div>
                                  <div>
                                    <h2 className="text-xl font-bold text-emerald-900 tracking-tight">
                                      Preparations for Anofer
                                    </h2>
                                    <p className="text-sm text-emerald-600/80 font-medium">
                                      Preparations &amp; Calculations
                                    </p>
                                  </div>
                                </div>

                                <div className="px-4 py-1 bg-gradient-to-r from-emerald-50 to-emerald-50 border border-emerald-200 rounded-full shadow-sm">
                                  <span className="text-xs font-bold text-emerald-800">
                                    {((samplePreparationAnoferPerParam[selectedParam.id] || []).length +
                                      (calculationsAnoferPerParam[selectedParam.id] || []).length)}{" "}
                                    Items
                                  </span>
                                </div>
                              </div>

                              {/* Sample Preparation Section */}
                              <div>
                                <div className="flex items-center justify-between mb-4 px-2">
                                  <h3 className="text-lg font-bold text-emerald-800 flex items-center gap-2.5 tracking-tight">
                                    <span className="w-1.5 h-6 bg-gradient-to-b from-emerald-700 to-emerald-900 rounded-full"></span>
                                    Sample Preparations for Anofer
                                  </h3>
                                  <button
                                    onClick={() => handleAddSamplePreparationAnofer(selectedParam.id)}
                                    className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-emerald-700 to-emerald-900 text-white font-semibold rounded-xl hover:from-emerald-700 hover:to-emerald-800 transition-all duration-200 shadow-md hover:shadow-lg text-sm transform"
                                  >
                                    <Plus className="w-4 h-4" />
                                    Add Sample Preparation
                                  </button>
                                </div>

                                <AnimatePresence>
                                  {(samplePreparationAnoferPerParam[selectedParam.id] || []).map((samplePrep) => (
                                    <motion.div
                                      key={samplePrep.id}
                                      initial={{ opacity: 0, y: 10 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      exit={{ opacity: 0, y: -10 }}
                                    >
                                      <SamplePreparationMetalDetail
                                        samplePreparation={samplePrep}
                                        onStepChange={(samplePrepId, stepName, field, newValue) =>
                                          handleSamplePreparationAnoferStepChange(
                                            selectedParam.id,
                                            samplePrepId,
                                            stepName,
                                            field,
                                            newValue,
                                          )
                                        }
                                        onRemove={() =>
                                          handleRemoveSamplePreparationAnofer(selectedParam.id, samplePrep.id)
                                        }
                                      />
                                    </motion.div>
                                  ))}
                                </AnimatePresence>

                                {(samplePreparationAnoferPerParam[selectedParam.id] || []).length === 0 && (
                                  <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="relative overflow-hidden text-center py-12 bg-gradient-to-br from-emerald-50 via-white to-emerald-50 border-2 border-dashed border-emerald-300 rounded-2xl shadow-inner"
                                  >
                                    <div className="relative z-10">
                                      <div className="inline-block p-4 bg-white rounded-full shadow-lg mb-3">
                                        <IoFlask className="w-10 h-10 text-emerald-400" />
                                      </div>
                                      <p className="text-base font-bold text-emerald-800 mb-1">No sample preparations added yet</p>
                                      <p className="text-xs text-emerald-600/80 max-w-md mx-auto">
                                        Click "Add Sample Preparation" to add one
                                      </p>
                                    </div>
                                  </motion.div>
                                )}
                              </div>

                              {/* Standard Preparation Section */}
                              <div className="mt-6">
                                <div className="flex items-center justify-between mb-4 px-2">
                                  <h3 className="text-lg font-bold text-emerald-800 flex items-center gap-2.5 tracking-tight">
                                    <span className="w-1.5 h-6 bg-gradient-to-b from-emerald-700 to-emerald-900 rounded-full"></span>
                                    Standard Preparations for Anofer
                                  </h3>
                                  <button
                                    onClick={() => handleAddStandardPreparationAnofer(selectedParam.id)}
                                    className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-emerald-700 to-emerald-900 text-white font-semibold rounded-xl hover:from-emerald-700 hover:to-emerald-800 transition-all duration-200 shadow-md hover:shadow-lg text-sm transform"
                                  >
                                    <Plus className="w-4 h-4" />
                                    Add Standard Preparation
                                  </button>
                                </div>

                                <AnimatePresence>
                                  {(standardPreparationMetalPerParam[selectedParam.id]?.["anofer"] || []).map((standardPrep) => (
                                    <motion.div
                                      key={standardPrep.id}
                                      initial={{ opacity: 0, y: 10 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      exit={{ opacity: 0, y: -10 }}
                                    >
                                      <StandardPreparationMetalDetail
                                        standardPreparation={standardPrep}
                                        onStepChange={(spId, stepName, field, val) =>
                                          handleStandardPreparationMetalStepChange(selectedParam.id, "anofer", spId, stepName, field, val)
                                        }
                                        onRemove={() => handleRemoveStandardPreparationAnofer(selectedParam.id, standardPrep.id)}
                                      />
                                    </motion.div>
                                  ))}
                                </AnimatePresence>

                                {(standardPreparationMetalPerParam[selectedParam.id]?.["anofer"] || []).length === 0 && (
                                  <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="relative overflow-hidden text-center py-8 bg-gradient-to-br from-emerald-50 via-white to-emerald-50 border-2 border-dashed border-emerald-300 rounded-2xl shadow-inner"
                                  >
                                    <div className="relative z-10">
                                      <div className="inline-block p-4 bg-white rounded-full shadow-lg mb-3">
                                        <IoFlask className="w-10 h-10 text-emerald-400" />
                                      </div>
                                      <p className="text-base font-bold text-emerald-800 mb-1">No standard preparations added yet</p>
                                      <p className="text-xs text-emerald-600/80 max-w-md mx-auto">
                                        Click "Add Standard Preparation" to add one
                                      </p>
                                    </div>
                                  </motion.div>
                                )}

                                {/* Weight Sheet attacher — only when at least one prep exists */}
                                {(samplePreparationAnoferPerParam[selectedParam.id] || []).length > 0 && (
                                  <div className="pointer-events-auto mt-4">
                                    <WorksheetFileAttacher
                                      files={getFilesForPrep(selectedParam.id, "anofer", "Weight Sheet")}
                                      onAdd={(newFiles) =>
                                        handleAddPrepFiles(selectedParam.id, "anofer", "Weight Sheet", newFiles)
                                      }
                                      onRemove={(index) =>
                                        handleRemovePrepFile(selectedParam.id, "anofer", "Weight Sheet", index)
                                      }
                                      preparationType="anofer"
                                      sectionLabel="Weight Sheet"
                                      isLocked={shouldDisableContent}
                                    />
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Complete Preparation block — gates Calculations */}
                            {canManagePrep &&
                              (samplePreparationAnoferPerParam[selectedParam.id] || []).length > 0 &&
                              (() => {
                                const isGroupCompleted =
                                  !!groupPrepCompletedAtPerParam[selectedParam.id]?.["anofer"];
                                const allPrepsValid = areAllMetalPrepsDilutionValid([
                                  ...(samplePreparationAnoferPerParam[selectedParam.id] || []),
                                ]);
                                return (
                                  <div className="mt-4 pointer-events-auto opacity-100">
                                    {isGroupCompleted ? (
                                      <div className="flex items-center gap-3 px-5 py-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                                        <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0">
                                          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                          </svg>
                                        </div>
                                        <div className="flex-1">
                                          <p className="text-sm font-semibold text-emerald-800">
                                            Anofer Preparation Completed
                                          </p>
                                          <p className="text-xs text-emerald-600">
                                            Completed at{" "}
                                            {new Date(
                                              groupPrepCompletedAtPerParam[selectedParam.id]["anofer"]
                                            ).toLocaleString()}
                                          </p>
                                        </div>
                                        <button
                                          onClick={() => handleInitiateUnlockGroupPrep(selectedParam, "anofer")}
                                          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-orange-700 bg-orange-50 border border-orange-300 rounded-lg hover:bg-orange-100 transition-colors"
                                        >
                                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                                          </svg>
                                          Unlock Preparation
                                        </button>
                                      </div>
                                    ) : (
                                      <div>
                                        {!allPrepsValid && (
                                          <div className="flex items-center gap-2 px-4 py-2.5 mb-2 bg-amber-50 border border-amber-300 rounded-xl text-xs text-amber-700 font-medium">
                                            <svg className="w-4 h-4 text-amber-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            Fix dilution step errors in all preparations before completing.
                                          </div>
                                        )}
                                        <button
                                          onClick={() => handleInitiateCompleteGroupPrep(selectedParam, "anofer")}
                                          disabled={!allPrepsValid}
                                          className={`w-full flex items-center justify-center gap-2 px-5 py-3 font-semibold rounded-xl transition-all text-sm ${allPrepsValid ? "bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white shadow-md hover:shadow-lg" : "bg-slate-200 text-slate-400 cursor-not-allowed"}`}
                                        >
                                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                          </svg>
                                          Mark Anofer Preparation as Complete
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                );
                              })()}

                            {/* Locked-out warning */}
                            {(samplePreparationAnoferPerParam[selectedParam.id] || []).length > 0 &&
                              !groupPrepCompletedAtPerParam[selectedParam.id]?.["anofer"] &&
                              !canManagePrep && (
                                <div className="flex items-center gap-3 px-5 py-3 mt-4 bg-amber-50 border-2 border-amber-200 rounded-xl">
                                  <svg className="w-5 h-5 text-amber-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                  <p className="text-sm text-amber-800">
                                    <strong>Complete Preparation</strong> above to unlock the Calculations section.
                                  </p>
                                </div>
                              )}

                            {/* Calculations Section — gated on group prep completion */}
                            {(samplePreparationAnoferPerParam[selectedParam.id] || []).length > 0 &&
                              groupPrepCompletedAtPerParam[selectedParam.id]?.["anofer"] && (
                                <div className={isFullyLocked ? "pointer-events-none opacity-70" : ""}>
                                  <div className="mt-8">
                                    <div className="flex items-center justify-between mb-4 px-2">
                                      <h3 className="text-lg font-bold text-emerald-800 flex items-center gap-2.5 tracking-tight">
                                        <span className="w-1.5 h-6 bg-gradient-to-b from-emerald-700 to-emerald-900 rounded-full"></span>
                                        Calculations for Anofer
                                      </h3>
                                      <button
                                        onClick={() => handleAddCalculationAnofer(selectedParam.id)}
                                        className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-emerald-700 to-emerald-900 text-white font-semibold rounded-xl hover:from-emerald-700 hover:to-emerald-800 transition-all duration-200 shadow-md hover:shadow-lg text-sm transform"
                                      >
                                        <Plus className="w-4 h-4" />
                                        Add Calculation
                                      </button>
                                    </div>

                                    <AnimatePresence>
                                      {(calculationsAnoferPerParam[selectedParam.id] || []).map((calc) => (
                                        <div key={calc.id}>
                                          <CalculationDetailAnofer
                                            calculation={calc}
                                            samplePreparations={samplePreparationAnoferPerParam[selectedParam.id] || []}
                                            onUpdate={(updated) => handleUpdateCalculationAnofer(selectedParam.id, updated)}
                                            onRemove={() => handleRemoveCalculationAnofer(selectedParam.id, calc.id)}
                                            isLocked={isFullyLocked}
                                          />
                                        </div>
                                      ))}
                                    </AnimatePresence>

                                    {(calculationsAnoferPerParam[selectedParam.id] || []).length === 0 && (
                                      <motion.div
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="relative overflow-hidden text-center py-12 bg-gradient-to-br from-emerald-50 via-white to-emerald-50 border-2 border-dashed border-emerald-300 rounded-2xl shadow-inner"
                                      >
                                        <div className="relative z-10">
                                          <div className="inline-block p-4 bg-white rounded-full shadow-lg mb-3">
                                            <Target className="w-10 h-10 text-emerald-400" />
                                          </div>
                                          <p className="text-base font-bold text-emerald-800 mb-1">
                                            No calculations added yet
                                          </p>
                                          <p className="text-xs text-emerald-600/80 max-w-md mx-auto">
                                            Click "Add Calculation" to create an Anofer calculation
                                          </p>
                                        </div>
                                      </motion.div>
                                    )}
                                  </div>
                                </div>
                              )}
                          </motion.div>
                        )}
                        {/* ============= END ANOFER PREPARATIONS ============= */}

                        {/* ============= ZPTO SHAMPOO PREPARATIONS ============= */}
                        {(activePreparationGroups[selectedParam.id] || []).includes("zptoShampoo") && (
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="relative mb-10 p-8 rounded-2xl border-2 border-emerald-200/50 bg-gradient-to-br from-emerald-50/40 via-white/60 to-emerald-50/40 backdrop-blur-sm shadow-sm hover:shadow-emerald-200/50 transition-all duration-500"
                          >
                            <div className={isPreparationLocked ? "pointer-events-none opacity-70" : ""}>
                              {/* Decorative elements */}
                              <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-emerald-400/10 to-transparent rounded-bl-full -z-10" />
                              <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-emerald-400/10 to-transparent rounded-tr-full -z-10" />

                              {/* Card Header */}
                              <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-4">
                                  <div className="relative">
                                    <div className="absolute inset-0 bg-emerald-500/20 blur-xl rounded-full" />
                                    <div className="relative w-12 h-12 bg-gradient-to-br from-emerald-700 to-emerald-900 rounded-2xl flex items-center justify-center shadow-lg transform hover:rotate-6 transition-transform duration-300">
                                      <BiTestTube className="w-6 h-6 text-white" />
                                    </div>
                                  </div>
                                  <div>
                                    <h2 className="text-xl font-bold text-emerald-900 tracking-tight">
                                      Preparations for ZPTO Shampoo
                                    </h2>
                                    <p className="text-sm text-emerald-600/80 font-medium">
                                      Preparations &amp; Calculations
                                    </p>
                                  </div>
                                </div>

                                <div className="px-4 py-1 bg-gradient-to-r from-emerald-50 to-emerald-50 border border-emerald-200 rounded-full shadow-sm">
                                  <span className="text-xs font-bold text-emerald-800">
                                    {((samplePreparationZptoShampooPerParam[selectedParam.id] || []).length +
                                      (calculationsZptoShampooPerParam[selectedParam.id] || []).length)}{" "}
                                    Items
                                  </span>
                                </div>
                              </div>

                              {/* Sample Preparation Section */}
                              <div>
                                <div className="flex items-center justify-between mb-4 px-2">
                                  <h3 className="text-lg font-bold text-emerald-800 flex items-center gap-2.5 tracking-tight">
                                    <span className="w-1.5 h-6 bg-gradient-to-b from-emerald-700 to-emerald-900 rounded-full"></span>
                                    Sample Preparations for ZPTO Shampoo
                                  </h3>
                                  <button
                                    onClick={() => handleAddSamplePreparationZptoShampoo(selectedParam.id)}
                                    className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-emerald-700 to-emerald-900 text-white font-semibold rounded-xl hover:from-emerald-700 hover:to-emerald-800 transition-all duration-200 shadow-md hover:shadow-lg text-sm transform"
                                  >
                                    <Plus className="w-4 h-4" />
                                    Add Sample Preparation
                                  </button>
                                </div>

                                <AnimatePresence>
                                  {(samplePreparationZptoShampooPerParam[selectedParam.id] || []).map((samplePrep) => (
                                    <motion.div
                                      key={samplePrep.id}
                                      initial={{ opacity: 0, y: 10 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      exit={{ opacity: 0, y: -10 }}
                                    >
                                      <SamplePreparationMetalDetail
                                        samplePreparation={samplePrep}
                                        onStepChange={(samplePrepId, stepName, field, newValue) =>
                                          handleSamplePreparationZptoShampooStepChange(
                                            selectedParam.id,
                                            samplePrepId,
                                            stepName,
                                            field,
                                            newValue,
                                          )
                                        }
                                        onRemove={() =>
                                          handleRemoveSamplePreparationZptoShampoo(selectedParam.id, samplePrep.id)
                                        }
                                      />
                                    </motion.div>
                                  ))}
                                </AnimatePresence>

                                {(samplePreparationZptoShampooPerParam[selectedParam.id] || []).length === 0 && (
                                  <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="relative overflow-hidden text-center py-12 bg-gradient-to-br from-emerald-50 via-white to-emerald-50 border-2 border-dashed border-emerald-300 rounded-2xl shadow-inner"
                                  >
                                    <div className="relative z-10">
                                      <div className="inline-block p-4 bg-white rounded-full shadow-lg mb-3">
                                        <IoFlask className="w-10 h-10 text-emerald-400" />
                                      </div>
                                      <p className="text-base font-bold text-emerald-800 mb-1">No sample preparations added yet</p>
                                      <p className="text-xs text-emerald-600/80 max-w-md mx-auto">
                                        Click "Add Sample Preparation" to add one
                                      </p>
                                    </div>
                                  </motion.div>
                                )}
                              </div>

                              {/* Standard Preparation Section */}
                              <div className="mt-6">
                                <div className="flex items-center justify-between mb-4 px-2">
                                  <h3 className="text-lg font-bold text-emerald-800 flex items-center gap-2.5 tracking-tight">
                                    <span className="w-1.5 h-6 bg-gradient-to-b from-emerald-700 to-emerald-900 rounded-full"></span>
                                    Standard Preparations for ZPTO Shampoo
                                  </h3>
                                  <button
                                    onClick={() => handleAddStandardPreparationZptoShampoo(selectedParam.id)}
                                    className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-emerald-700 to-emerald-900 text-white font-semibold rounded-xl hover:from-emerald-700 hover:to-emerald-800 transition-all duration-200 shadow-md hover:shadow-lg text-sm transform"
                                  >
                                    <Plus className="w-4 h-4" />
                                    Add Standard Preparation
                                  </button>
                                </div>

                                <AnimatePresence>
                                  {(standardPreparationMetalPerParam[selectedParam.id]?.["zptoShampoo"] || []).map((standardPrep) => (
                                    <motion.div
                                      key={standardPrep.id}
                                      initial={{ opacity: 0, y: 10 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      exit={{ opacity: 0, y: -10 }}
                                    >
                                      <StandardPreparationMetalDetail
                                        standardPreparation={standardPrep}
                                        onStepChange={(spId, stepName, field, val) =>
                                          handleStandardPreparationMetalStepChange(selectedParam.id, "zptoShampoo", spId, stepName, field, val)
                                        }
                                        onRemove={() => handleRemoveStandardPreparationZptoShampoo(selectedParam.id, standardPrep.id)}
                                      />
                                    </motion.div>
                                  ))}
                                </AnimatePresence>

                                {(standardPreparationMetalPerParam[selectedParam.id]?.["zptoShampoo"] || []).length === 0 && (
                                  <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="relative overflow-hidden text-center py-8 bg-gradient-to-br from-emerald-50 via-white to-emerald-50 border-2 border-dashed border-emerald-300 rounded-2xl shadow-inner"
                                  >
                                    <div className="relative z-10">
                                      <div className="inline-block p-4 bg-white rounded-full shadow-lg mb-3">
                                        <IoFlask className="w-10 h-10 text-emerald-400" />
                                      </div>
                                      <p className="text-base font-bold text-emerald-800 mb-1">No standard preparations added yet</p>
                                      <p className="text-xs text-emerald-600/80 max-w-md mx-auto">
                                        Click "Add Standard Preparation" to add one
                                      </p>
                                    </div>
                                  </motion.div>
                                )}

                                {/* Weight Sheet attacher — only when at least one prep exists */}
                                {(samplePreparationZptoShampooPerParam[selectedParam.id] || []).length > 0 && (
                                  <div className="pointer-events-auto mt-4">
                                    <WorksheetFileAttacher
                                      files={getFilesForPrep(selectedParam.id, "zpto_shampoo", "Weight Sheet")}
                                      onAdd={(newFiles) =>
                                        handleAddPrepFiles(selectedParam.id, "zpto_shampoo", "Weight Sheet", newFiles)
                                      }
                                      onRemove={(index) =>
                                        handleRemovePrepFile(selectedParam.id, "zpto_shampoo", "Weight Sheet", index)
                                      }
                                      preparationType="zpto_shampoo"
                                      sectionLabel="Weight Sheet"
                                      isLocked={shouldDisableContent}
                                    />
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Complete Preparation block — gates Calculations */}
                            {canManagePrep &&
                              (samplePreparationZptoShampooPerParam[selectedParam.id] || []).length > 0 &&
                              (() => {
                                const isGroupCompleted =
                                  !!groupPrepCompletedAtPerParam[selectedParam.id]?.["zptoShampoo"];
                                const allPrepsValid = areAllMetalPrepsDilutionValid([
                                  ...(samplePreparationZptoShampooPerParam[selectedParam.id] || []),
                                ]);
                                return (
                                  <div className="mt-4 pointer-events-auto opacity-100">
                                    {isGroupCompleted ? (
                                      <div className="flex items-center gap-3 px-5 py-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                                        <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0">
                                          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                          </svg>
                                        </div>
                                        <div className="flex-1">
                                          <p className="text-sm font-semibold text-emerald-800">
                                            ZPTO Shampoo Preparation Completed
                                          </p>
                                          <p className="text-xs text-emerald-600">
                                            Completed at{" "}
                                            {new Date(
                                              groupPrepCompletedAtPerParam[selectedParam.id]["zptoShampoo"]
                                            ).toLocaleString()}
                                          </p>
                                        </div>
                                        <button
                                          onClick={() => handleInitiateUnlockGroupPrep(selectedParam, "zptoShampoo")}
                                          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-orange-700 bg-orange-50 border border-orange-300 rounded-lg hover:bg-orange-100 transition-colors"
                                        >
                                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                                          </svg>
                                          Unlock Preparation
                                        </button>
                                      </div>
                                    ) : (
                                      <div>
                                        {!allPrepsValid && (
                                          <div className="flex items-center gap-2 px-4 py-2.5 mb-2 bg-amber-50 border border-amber-300 rounded-xl text-xs text-amber-700 font-medium">
                                            <svg className="w-4 h-4 text-amber-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            Fix dilution step errors in all preparations before completing.
                                          </div>
                                        )}
                                        <button
                                          onClick={() => handleInitiateCompleteGroupPrep(selectedParam, "zptoShampoo")}
                                          disabled={!allPrepsValid}
                                          className={`w-full flex items-center justify-center gap-2 px-5 py-3 font-semibold rounded-xl transition-all text-sm ${allPrepsValid ? "bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white shadow-md hover:shadow-lg" : "bg-slate-200 text-slate-400 cursor-not-allowed"}`}
                                        >
                                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                          </svg>
                                          Mark ZPTO Shampoo Preparation as Complete
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                );
                              })()}

                            {/* Locked-out warning */}
                            {(samplePreparationZptoShampooPerParam[selectedParam.id] || []).length > 0 &&
                              !groupPrepCompletedAtPerParam[selectedParam.id]?.["zptoShampoo"] &&
                              !canManagePrep && (
                                <div className="flex items-center gap-3 px-5 py-3 mt-4 bg-amber-50 border-2 border-amber-200 rounded-xl">
                                  <svg className="w-5 h-5 text-amber-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                  <p className="text-sm text-amber-800">
                                    <strong>Complete Preparation</strong> above to unlock the Calculations section.
                                  </p>
                                </div>
                              )}

                            {/* Calculations Section — gated on group prep completion */}
                            {(samplePreparationZptoShampooPerParam[selectedParam.id] || []).length > 0 &&
                              groupPrepCompletedAtPerParam[selectedParam.id]?.["zptoShampoo"] && (
                                <div className={isFullyLocked ? "pointer-events-none opacity-70" : ""}>
                                  <div className="mt-8">
                                    <div className="flex items-center justify-between mb-4 px-2">
                                      <h3 className="text-lg font-bold text-emerald-800 flex items-center gap-2.5 tracking-tight">
                                        <span className="w-1.5 h-6 bg-gradient-to-b from-emerald-700 to-emerald-900 rounded-full"></span>
                                        Calculations for ZPTO Shampoo
                                      </h3>
                                      <button
                                        onClick={() => handleAddCalculationZptoShampoo(selectedParam.id)}
                                        className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-emerald-700 to-emerald-900 text-white font-semibold rounded-xl hover:from-emerald-700 hover:to-emerald-800 transition-all duration-200 shadow-md hover:shadow-lg text-sm transform"
                                      >
                                        <Plus className="w-4 h-4" />
                                        Add Calculation
                                      </button>
                                    </div>

                                    <AnimatePresence>
                                      {(calculationsZptoShampooPerParam[selectedParam.id] || []).map((calc) => (
                                        <div key={calc.id}>
                                          <CalculationDetailZptoShampoo
                                            calculation={calc}
                                            samplePreparations={samplePreparationZptoShampooPerParam[selectedParam.id] || []}
                                            onUpdate={(updated) => handleUpdateCalculationZptoShampoo(selectedParam.id, updated)}
                                            onRemove={() => handleRemoveCalculationZptoShampoo(selectedParam.id, calc.id)}
                                            isLocked={isFullyLocked}
                                          />
                                        </div>
                                      ))}
                                    </AnimatePresence>

                                    {(calculationsZptoShampooPerParam[selectedParam.id] || []).length === 0 && (
                                      <motion.div
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="relative overflow-hidden text-center py-12 bg-gradient-to-br from-emerald-50 via-white to-emerald-50 border-2 border-dashed border-emerald-300 rounded-2xl shadow-inner"
                                      >
                                        <div className="relative z-10">
                                          <div className="inline-block p-4 bg-white rounded-full shadow-lg mb-3">
                                            <Target className="w-10 h-10 text-emerald-400" />
                                          </div>
                                          <p className="text-base font-bold text-emerald-800 mb-1">
                                            No calculations added yet
                                          </p>
                                          <p className="text-xs text-emerald-600/80 max-w-md mx-auto">
                                            Click "Add Calculation" to create a ZPTO Shampoo calculation
                                          </p>
                                        </div>
                                      </motion.div>
                                    )}
                                  </div>
                                </div>
                              )}
                          </motion.div>
                        )}
                        {/* ============= END ZPTO SHAMPOO PREPARATIONS ============= */}

                        {/* ============= SODIUM LACTATE PREPARATIONS ============= */}
                        {(activePreparationGroups[selectedParam.id] || []).includes("sodiumLactate") && (
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="relative mb-10 p-8 rounded-2xl border-2 border-emerald-200/50 bg-gradient-to-br from-emerald-50/40 via-white/60 to-emerald-50/40 backdrop-blur-sm shadow-sm hover:shadow-emerald-200/50 transition-all duration-500"
                          >
                            <div className={isPreparationLocked ? "pointer-events-none opacity-70" : ""}>
                              <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-emerald-400/10 to-transparent rounded-bl-full -z-10" />
                              <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-emerald-400/10 to-transparent rounded-tr-full -z-10" />

                              <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-4">
                                  <div className="relative">
                                    <div className="absolute inset-0 bg-emerald-500/20 blur-xl rounded-full" />
                                    <div className="relative w-12 h-12 bg-gradient-to-br from-emerald-700 to-emerald-900 rounded-2xl flex items-center justify-center shadow-lg transform hover:rotate-6 transition-transform duration-300">
                                      <BiTestTube className="w-6 h-6 text-white" />
                                    </div>
                                  </div>
                                  <div>
                                    <h2 className="text-xl font-bold text-emerald-900 tracking-tight">
                                      Preparations for Sodium Lactate
                                    </h2>
                                    <p className="text-sm text-emerald-600/80 font-medium">
                                      Preparations &amp; Calculations
                                    </p>
                                  </div>
                                </div>

                                <div className="px-4 py-1 bg-gradient-to-r from-emerald-50 to-emerald-50 border border-emerald-200 rounded-full shadow-sm">
                                  <span className="text-xs font-bold text-emerald-800">
                                    {((samplePreparationSodiumLactatePerParam[selectedParam.id] || []).length +
                                      (calculationsSodiumLactatePerParam[selectedParam.id] || []).length)}{" "}
                                    Items
                                  </span>
                                </div>
                              </div>

                              {/* Sample Preparation Section */}
                              <div>
                                <div className="flex items-center justify-between mb-4 px-2">
                                  <h3 className="text-lg font-bold text-emerald-800 flex items-center gap-2.5 tracking-tight">
                                    <span className="w-1.5 h-6 bg-gradient-to-b from-emerald-700 to-emerald-900 rounded-full"></span>
                                    Sample Preparations for Sodium Lactate
                                  </h3>
                                  <button
                                    onClick={() => handleAddSamplePreparationSodiumLactate(selectedParam.id)}
                                    className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-emerald-700 to-emerald-900 text-white font-semibold rounded-xl hover:from-emerald-700 hover:to-emerald-800 transition-all duration-200 shadow-md hover:shadow-lg text-sm transform"
                                  >
                                    <Plus className="w-4 h-4" />
                                    Add Sample Preparation
                                  </button>
                                </div>

                                <AnimatePresence>
                                  {(samplePreparationSodiumLactatePerParam[selectedParam.id] || []).map((samplePrep) => (
                                    <motion.div
                                      key={samplePrep.id}
                                      initial={{ opacity: 0, y: 10 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      exit={{ opacity: 0, y: -10 }}
                                    >
                                      <SamplePreparationMetalDetail
                                        samplePreparation={samplePrep}
                                        onStepChange={(samplePrepId, stepName, field, newValue) =>
                                          handleSamplePreparationSodiumLactateStepChange(
                                            selectedParam.id,
                                            samplePrepId,
                                            stepName,
                                            field,
                                            newValue,
                                          )
                                        }
                                        onRemove={() =>
                                          handleRemoveSamplePreparationSodiumLactate(selectedParam.id, samplePrep.id)
                                        }
                                      />
                                    </motion.div>
                                  ))}
                                </AnimatePresence>

                                {(samplePreparationSodiumLactatePerParam[selectedParam.id] || []).length === 0 && (
                                  <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="relative overflow-hidden text-center py-12 bg-gradient-to-br from-emerald-50 via-white to-emerald-50 border-2 border-dashed border-emerald-300 rounded-2xl shadow-inner"
                                  >
                                    <div className="relative z-10">
                                      <div className="inline-block p-4 bg-white rounded-full shadow-lg mb-3">
                                        <IoFlask className="w-10 h-10 text-emerald-400" />
                                      </div>
                                      <p className="text-base font-bold text-emerald-800 mb-1">No sample preparations added yet</p>
                                      <p className="text-xs text-emerald-600/80 max-w-md mx-auto">
                                        Click "Add Sample Preparation" to add one
                                      </p>
                                    </div>
                                  </motion.div>
                                )}
                              </div>
                              {/* Standard Preparation Section */}
                              <div className="mt-6">
                                <div className="flex items-center justify-between mb-4 px-2">
                                  <h3 className="text-lg font-bold text-emerald-800 flex items-center gap-2.5 tracking-tight">
                                    <span className="w-1.5 h-6 bg-gradient-to-b from-emerald-700 to-emerald-900 rounded-full"></span>
                                    Standard Preparations for Sodium Lactate
                                  </h3>
                                  <button
                                    onClick={() => handleAddStandardPreparationSodiumLactate(selectedParam.id)}
                                    className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-emerald-700 to-emerald-900 text-white font-semibold rounded-xl hover:from-emerald-700 hover:to-emerald-800 transition-all duration-200 shadow-md hover:shadow-lg text-sm transform"
                                  >
                                    <Plus className="w-4 h-4" />
                                    Add Standard Preparation
                                  </button>
                                </div>

                                <AnimatePresence>
                                  {(standardPreparationMetalPerParam[selectedParam.id]?.["sodiumLactate"] || []).map((standardPrep) => (
                                    <motion.div
                                      key={standardPrep.id}
                                      initial={{ opacity: 0, y: 10 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      exit={{ opacity: 0, y: -10 }}
                                    >
                                      <StandardPreparationMetalDetail
                                        standardPreparation={standardPrep}
                                        onStepChange={(spId, stepName, field, val) =>
                                          handleStandardPreparationMetalStepChange(selectedParam.id, "sodiumLactate", spId, stepName, field, val)
                                        }
                                        onRemove={() => handleRemoveStandardPreparationSodiumLactate(selectedParam.id, standardPrep.id)}
                                      />
                                    </motion.div>
                                  ))}
                                </AnimatePresence>

                                {(standardPreparationMetalPerParam[selectedParam.id]?.["sodiumLactate"] || []).length === 0 && (
                                  <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="relative overflow-hidden text-center py-8 bg-gradient-to-br from-emerald-50 via-white to-emerald-50 border-2 border-dashed border-emerald-300 rounded-2xl shadow-inner"
                                  >
                                    <div className="relative z-10">
                                      <div className="inline-block p-4 bg-white rounded-full shadow-lg mb-3">
                                        <IoFlask className="w-10 h-10 text-emerald-400" />
                                      </div>
                                      <p className="text-base font-bold text-emerald-800 mb-1">No standard preparations added yet</p>
                                      <p className="text-xs text-emerald-600/80 max-w-md mx-auto">
                                        Click "Add Standard Preparation" to add one
                                      </p>
                                    </div>
                                  </motion.div>
                                )}

                                {/* Weight Sheet attacher — only when at least one prep exists */}
                                {(samplePreparationSodiumLactatePerParam[selectedParam.id] || []).length > 0 && (
                                  <div className="pointer-events-auto mt-4">
                                    <WorksheetFileAttacher
                                      files={getFilesForPrep(selectedParam.id, "sodium_lactate", "Weight Sheet")}
                                      onAdd={(newFiles) =>
                                        handleAddPrepFiles(selectedParam.id, "sodium_lactate", "Weight Sheet", newFiles)
                                      }
                                      onRemove={(index) =>
                                        handleRemovePrepFile(selectedParam.id, "sodium_lactate", "Weight Sheet", index)
                                      }
                                      preparationType="sodium_lactate"
                                      sectionLabel="Weight Sheet"
                                      isLocked={shouldDisableContent}
                                    />
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Complete Preparation block — gates Calculations */}
                            {canManagePrep &&
                              (samplePreparationSodiumLactatePerParam[selectedParam.id] || []).length > 0 &&
                              (() => {
                                const isGroupCompleted =
                                  !!groupPrepCompletedAtPerParam[selectedParam.id]?.["sodiumLactate"];
                                const allPrepsValid = areAllMetalPrepsDilutionValid([
                                  ...(samplePreparationSodiumLactatePerParam[selectedParam.id] || []),
                                ]);
                                return (
                                  <div className="mt-4 pointer-events-auto opacity-100">
                                    {isGroupCompleted ? (
                                      <div className="flex items-center justify-between flex-wrap gap-3 px-5 py-3 bg-emerald-50 border-2 border-emerald-300 rounded-xl">
                                        <div className="flex items-center gap-2 text-emerald-700">
                                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                          </svg>
                                          <div>
                                            <p className="text-sm font-semibold text-emerald-800">
                                              Sodium Lactate Preparation Completed
                                            </p>
                                            <p className="text-xs text-emerald-600">
                                              Completed at{" "}
                                              {new Date(
                                                groupPrepCompletedAtPerParam[selectedParam.id]["sodiumLactate"]
                                              ).toLocaleString()}
                                            </p>
                                          </div>
                                        </div>
                                        <button
                                          onClick={() => handleInitiateUnlockGroupPrep(selectedParam, "sodiumLactate")}
                                          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-orange-700 bg-orange-50 border border-orange-300 rounded-lg hover:bg-orange-100 transition-colors"
                                        >
                                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                                          </svg>
                                          Unlock Preparation
                                        </button>
                                      </div>
                                    ) : (
                                      <div>
                                        {!allPrepsValid && (
                                          <div className="flex items-center gap-2 px-4 py-2.5 mb-2 bg-amber-50 border border-amber-300 rounded-xl text-xs text-amber-700 font-medium">
                                            <svg className="w-4 h-4 text-amber-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            Fix dilution step errors in all preparations before completing.
                                          </div>
                                        )}
                                        <button
                                          onClick={() => handleInitiateCompleteGroupPrep(selectedParam, "sodiumLactate")}
                                          disabled={!allPrepsValid}
                                          className={`w-full flex items-center justify-center gap-2 px-5 py-3 font-semibold rounded-xl transition-all text-sm ${allPrepsValid ? "bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white shadow-md hover:shadow-lg" : "bg-slate-200 text-slate-400 cursor-not-allowed"}`}
                                        >
                                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                          </svg>
                                          Complete Sodium Lactate Preparation
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                );
                              })()}

                            {(samplePreparationSodiumLactatePerParam[selectedParam.id] || []).length > 0 &&
                              !groupPrepCompletedAtPerParam[selectedParam.id]?.["sodiumLactate"] &&
                              !canManagePrep && (
                                <div className="flex items-center gap-3 px-5 py-3 mt-4 bg-amber-50 border-2 border-amber-200 rounded-xl">
                                  <svg className="w-5 h-5 text-amber-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M12 3a9 9 0 100 18A9 9 0 0012 3z" />
                                  </svg>
                                  <p className="text-xs text-amber-700 font-medium">
                                    Awaiting preparation completion by an authorized user before calculations can be added.
                                  </p>
                                </div>
                              )}

                            {/* Calculations Section — gated on group prep completion */}
                            {(samplePreparationSodiumLactatePerParam[selectedParam.id] || []).length > 0 &&
                              groupPrepCompletedAtPerParam[selectedParam.id]?.["sodiumLactate"] && (
                                <div className={isFullyLocked ? "pointer-events-none opacity-70" : ""}>
                                  <div className="mt-8">
                                    <div className="flex items-center justify-between mb-4 px-2">
                                      <h3 className="text-lg font-bold text-emerald-800 flex items-center gap-2.5 tracking-tight">
                                        <span className="w-1.5 h-6 bg-gradient-to-b from-emerald-700 to-emerald-900 rounded-full"></span>
                                        Calculations for Sodium Lactate
                                      </h3>
                                      <button
                                        onClick={() => handleAddCalculationSodiumLactate(selectedParam.id)}
                                        className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-emerald-700 to-emerald-900 text-white font-semibold rounded-xl hover:from-emerald-700 hover:to-emerald-800 transition-all duration-200 shadow-md hover:shadow-lg text-sm transform"
                                      >
                                        <Plus className="w-4 h-4" />
                                        Add Calculation
                                      </button>
                                    </div>

                                    <AnimatePresence>
                                      {(calculationsSodiumLactatePerParam[selectedParam.id] || []).map((calc) => (
                                        <div key={calc.id}>
                                          <CalculationDetailSodiumLactate
                                            calculation={calc}
                                            samplePreparations={samplePreparationSodiumLactatePerParam[selectedParam.id] || []}
                                            onUpdate={(updated) => handleUpdateCalculationSodiumLactate(selectedParam.id, updated)}
                                            onRemove={() => handleRemoveCalculationSodiumLactate(selectedParam.id, calc.id)}
                                            isLocked={isFullyLocked}
                                          />
                                        </div>
                                      ))}
                                    </AnimatePresence>

                                    {(calculationsSodiumLactatePerParam[selectedParam.id] || []).length === 0 && (
                                      <motion.div
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="relative overflow-hidden text-center py-12 bg-gradient-to-br from-emerald-50 via-white to-emerald-50 border-2 border-dashed border-emerald-300 rounded-2xl shadow-inner"
                                      >
                                        <div className="relative z-10">
                                          <div className="inline-block p-4 bg-white rounded-full shadow-lg mb-3">
                                            <Target className="w-10 h-10 text-emerald-400" />
                                          </div>
                                          <p className="text-base font-bold text-emerald-800 mb-1">
                                            No calculations added yet
                                          </p>
                                          <p className="text-xs text-emerald-600/80 max-w-md mx-auto">
                                            Click "Add Calculation" to create a Sodium Lactate calculation
                                          </p>
                                        </div>
                                      </motion.div>
                                    )}
                                  </div>
                                </div>
                              )}
                          </motion.div>
                        )}
                        {/* ============= END SODIUM LACTATE PREPARATIONS ============= */}

                        {/* ============= LITHOSUN 300 PREPARATIONS ============= */}
                        {(activePreparationGroups[selectedParam.id] || []).includes("lithosun300") && (
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="relative mb-10 p-8 rounded-2xl border-2 border-emerald-200/50 bg-gradient-to-br from-emerald-50/40 via-white/60 to-emerald-50/40 backdrop-blur-sm shadow-sm hover:shadow-emerald-200/50 transition-all duration-500"
                          >
                            <div className={isPreparationLocked ? "pointer-events-none opacity-70" : ""}>
                              <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-emerald-400/10 to-transparent rounded-bl-full -z-10" />
                              <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-emerald-400/10 to-transparent rounded-tr-full -z-10" />

                              <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-4">
                                  <div className="relative">
                                    <div className="absolute inset-0 bg-emerald-500/20 blur-xl rounded-full" />
                                    <div className="relative w-12 h-12 bg-gradient-to-br from-emerald-700 to-emerald-900 rounded-2xl flex items-center justify-center shadow-lg transform hover:rotate-6 transition-transform duration-300">
                                      <BiTestTube className="w-6 h-6 text-white" />
                                    </div>
                                  </div>
                                  <div>
                                    <h2 className="text-xl font-bold text-emerald-900 tracking-tight">
                                      Preparations for Lithosun 300
                                    </h2>
                                    <p className="text-sm text-emerald-600/80 font-medium">
                                      Preparations &amp; Calculations
                                    </p>
                                  </div>
                                </div>

                                <div className="px-4 py-1 bg-gradient-to-r from-emerald-50 to-emerald-50 border border-emerald-200 rounded-full shadow-sm">
                                  <span className="text-xs font-bold text-emerald-800">
                                    {((samplePreparationLithosun300PerParam[selectedParam.id] || []).length +
                                      (calculationsLithosun300PerParam[selectedParam.id] || []).length)}{" "}
                                    Items
                                  </span>
                                </div>
                              </div>

                              {/* Sample Preparation Section */}
                              <div>
                                <div className="flex items-center justify-between mb-4 px-2">
                                  <h3 className="text-lg font-bold text-emerald-800 flex items-center gap-2.5 tracking-tight">
                                    <span className="w-1.5 h-6 bg-gradient-to-b from-emerald-700 to-emerald-900 rounded-full"></span>
                                    Sample Preparations for Lithosun 300
                                  </h3>
                                  <button
                                    onClick={() => handleAddSamplePreparationLithosun300(selectedParam.id)}
                                    className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-emerald-700 to-emerald-900 text-white font-semibold rounded-xl hover:from-emerald-700 hover:to-emerald-800 transition-all duration-200 shadow-md hover:shadow-lg text-sm transform"
                                  >
                                    <Plus className="w-4 h-4" />
                                    Add Sample Preparation
                                  </button>
                                </div>

                                <AnimatePresence>
                                  {(samplePreparationLithosun300PerParam[selectedParam.id] || []).map((samplePrep, idx) => {
                                    const standardPrep = (standardPreparationMetalPerParam[selectedParam.id]?.["lithosun300"] || [])[idx];
                                    return (
                                      <motion.div
                                        key={samplePrep.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                      >
                                        {standardPrep && (
                                          <StandardPreparationMetalDetail
                                            standardPreparation={standardPrep}
                                            onStepChange={(spId, stepName, field, val) =>
                                              handleStandardPreparationMetalStepChange(selectedParam.id, "lithosun300", spId, stepName, field, val)
                                            }
                                            onRemove={() => handleRemoveSamplePreparationLithosun300(selectedParam.id, samplePrep.id)}
                                          />
                                        )}
                                        <div className="mt-2">
                                          <SamplePreparationMetalDetail
                                            samplePreparation={samplePrep}
                                            onStepChange={(spId, stepName, field, val) =>
                                              handleSamplePreparationLithosun300StepChange(
                                                selectedParam.id, spId, stepName, field, val,
                                              )
                                            }
                                            onRemove={() => handleRemoveSamplePreparationLithosun300(selectedParam.id, samplePrep.id)}
                                          />
                                        </div>
                                      </motion.div>
                                    );
                                  })}
                                </AnimatePresence>

                                {(samplePreparationLithosun300PerParam[selectedParam.id] || []).length === 0 && (
                                  <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="relative overflow-hidden text-center py-12 bg-gradient-to-br from-emerald-50 via-white to-emerald-50 border-2 border-dashed border-emerald-300 rounded-2xl shadow-inner"
                                  >
                                    <div className="relative z-10">
                                      <div className="inline-block p-4 bg-white rounded-full shadow-lg mb-3">
                                        <IoFlask className="w-10 h-10 text-emerald-400" />
                                      </div>
                                      <p className="text-base font-bold text-emerald-800 mb-1">No sample preparations added yet</p>
                                      <p className="text-xs text-emerald-600/80 max-w-md mx-auto">
                                        Click "Add Sample Preparation" to add one
                                      </p>
                                    </div>
                                  </motion.div>
                                )}
                              </div>
                              {/* Standard Preparation Section */}
                              <div className="mt-6">
                                <div className="flex items-center justify-between mb-4 px-2">
                                  <h3 className="text-lg font-bold text-emerald-800 flex items-center gap-2.5 tracking-tight">
                                    <span className="w-1.5 h-6 bg-gradient-to-b from-emerald-700 to-emerald-900 rounded-full"></span>
                                    Standard Preparations for Lithosun 300
                                  </h3>
                                  <button
                                    onClick={() => handleAddStandardPreparationLithosun300(selectedParam.id)}
                                    className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-emerald-700 to-emerald-900 text-white font-semibold rounded-xl hover:from-emerald-700 hover:to-emerald-800 transition-all duration-200 shadow-md hover:shadow-lg text-sm transform"
                                  >
                                    <Plus className="w-4 h-4" />
                                    Add Standard Preparation
                                  </button>
                                </div>

                                <AnimatePresence>
                                  {(standardPreparationMetalPerParam[selectedParam.id]?.["lithosun300"] || []).map((standardPrep) => (
                                    <motion.div
                                      key={standardPrep.id}
                                      initial={{ opacity: 0, y: 10 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      exit={{ opacity: 0, y: -10 }}
                                    >
                                      <StandardPreparationMetalDetail
                                        standardPreparation={standardPrep}
                                        onStepChange={(spId, stepName, field, val) =>
                                          handleStandardPreparationMetalStepChange(selectedParam.id, "lithosun300", spId, stepName, field, val)
                                        }
                                        onRemove={() => handleRemoveStandardPreparationLithosun300(selectedParam.id, standardPrep.id)}
                                      />
                                    </motion.div>
                                  ))}
                                </AnimatePresence>

                                {(standardPreparationMetalPerParam[selectedParam.id]?.["lithosun300"] || []).length === 0 && (
                                  <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="relative overflow-hidden text-center py-8 bg-gradient-to-br from-emerald-50 via-white to-emerald-50 border-2 border-dashed border-emerald-300 rounded-2xl shadow-inner"
                                  >
                                    <div className="relative z-10">
                                      <div className="inline-block p-4 bg-white rounded-full shadow-lg mb-3">
                                        <IoFlask className="w-10 h-10 text-emerald-400" />
                                      </div>
                                      <p className="text-base font-bold text-emerald-800 mb-1">No standard preparations added yet</p>
                                      <p className="text-xs text-emerald-600/80 max-w-md mx-auto">
                                        Click "Add Standard Preparation" to add one
                                      </p>
                                    </div>
                                  </motion.div>
                                )}

                                {/* Weight Sheet attacher */}
                                {(samplePreparationLithosun300PerParam[selectedParam.id] || []).length > 0 && (
                                  <div className="pointer-events-auto mt-4">
                                    <WorksheetFileAttacher
                                      files={getFilesForPrep(selectedParam.id, "lithosun300", "Weight Sheet")}
                                      onAdd={(newFiles) =>
                                        handleAddPrepFiles(selectedParam.id, "lithosun300", "Weight Sheet", newFiles)
                                      }
                                      onRemove={(index) =>
                                        handleRemovePrepFile(selectedParam.id, "lithosun300", "Weight Sheet", index)
                                      }
                                      preparationType="lithosun300"
                                      sectionLabel="Weight Sheet"
                                      isLocked={shouldDisableContent}
                                    />
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Complete Preparation block */}
                            {canManagePrep &&
                              (samplePreparationLithosun300PerParam[selectedParam.id] || []).length > 0 &&
                              (() => {
                                const isGroupCompleted =
                                  !!groupPrepCompletedAtPerParam[selectedParam.id]?.["lithosun300"];
                                const allPrepsValid = areAllMetalPrepsDilutionValid([
                                  ...(samplePreparationLithosun300PerParam[selectedParam.id] || []),
                                ]);
                                return (
                                  <div className="mt-4 pointer-events-auto opacity-100">
                                    {isGroupCompleted ? (
                                      <div className="flex items-center justify-between flex-wrap gap-3 px-5 py-3 bg-emerald-50 border-2 border-emerald-300 rounded-xl">
                                        <div className="flex items-center gap-2 text-emerald-700">
                                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                          </svg>
                                          <div>
                                            <p className="text-sm font-semibold text-emerald-800">
                                              Lithosun 300 Preparation Completed
                                            </p>
                                            <p className="text-xs text-emerald-600">
                                              Completed at{" "}
                                              {new Date(
                                                groupPrepCompletedAtPerParam[selectedParam.id]["lithosun300"]
                                              ).toLocaleString()}
                                            </p>
                                          </div>
                                        </div>
                                        <button
                                          onClick={() => handleInitiateUnlockGroupPrep(selectedParam, "lithosun300")}
                                          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-orange-700 bg-orange-50 border border-orange-300 rounded-lg hover:bg-orange-100 transition-colors"
                                        >
                                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                                          </svg>
                                          Unlock Preparation
                                        </button>
                                      </div>
                                    ) : (
                                      <div>
                                        {!allPrepsValid && (
                                          <div className="flex items-center gap-2 px-4 py-2.5 mb-2 bg-amber-50 border border-amber-300 rounded-xl text-xs text-amber-700 font-medium">
                                            <svg className="w-4 h-4 text-amber-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            Fix dilution step errors in all preparations before completing.
                                          </div>
                                        )}
                                        <button
                                          onClick={() => handleInitiateCompleteGroupPrep(selectedParam, "lithosun300")}
                                          disabled={!allPrepsValid}
                                          className={`w-full flex items-center justify-center gap-2 px-5 py-3 font-semibold rounded-xl transition-all text-sm ${allPrepsValid ? "bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white shadow-md hover:shadow-lg" : "bg-slate-200 text-slate-400 cursor-not-allowed"}`}
                                        >
                                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                          </svg>
                                          Complete Lithosun 300 Preparation
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                );
                              })()}

                            {/* Locked-out warning */}
                            {(samplePreparationLithosun300PerParam[selectedParam.id] || []).length > 0 &&
                              !groupPrepCompletedAtPerParam[selectedParam.id]?.["lithosun300"] &&
                              !canManagePrep && (
                                <div className="flex items-center gap-3 px-5 py-3 mt-4 bg-amber-50 border-2 border-amber-200 rounded-xl">
                                  <svg className="w-5 h-5 text-amber-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M12 3a9 9 0 100 18A9 9 0 0012 3z" />
                                  </svg>
                                  <p className="text-xs text-amber-700 font-medium">
                                    Awaiting preparation completion by an authorized user before calculations can be added.
                                  </p>
                                </div>
                              )}

                            {/* Calculations Section — gated on group prep completion */}
                            {(samplePreparationLithosun300PerParam[selectedParam.id] || []).length > 0 &&
                              groupPrepCompletedAtPerParam[selectedParam.id]?.["lithosun300"] && (
                                <div className={isFullyLocked ? "pointer-events-none opacity-70" : ""}>
                                  <div className="mt-8">
                                    <div className="flex items-center justify-between mb-4 px-2">
                                      <h3 className="text-lg font-bold text-emerald-800 flex items-center gap-2.5 tracking-tight">
                                        <span className="w-1.5 h-6 bg-gradient-to-b from-emerald-700 to-emerald-900 rounded-full"></span>
                                        Calculations for Lithosun 300
                                      </h3>
                                      <button
                                        onClick={() => handleAddCalculationLithosun300(selectedParam.id)}
                                        className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-emerald-700 to-emerald-900 text-white font-semibold rounded-xl hover:from-emerald-700 hover:to-emerald-800 transition-all duration-200 shadow-md hover:shadow-lg text-sm transform"
                                      >
                                        <Plus className="w-4 h-4" />
                                        Add Calculation
                                      </button>
                                    </div>

                                    <AnimatePresence>
                                      {(calculationsLithosun300PerParam[selectedParam.id] || []).map((calc) => (
                                        <div key={calc.id}>
                                          <CalculationDetailLithosun300
                                            calculation={calc}
                                            samplePreparations={samplePreparationLithosun300PerParam[selectedParam.id] || []}
                                            onUpdate={(updated) => handleUpdateCalculationLithosun300(selectedParam.id, updated)}
                                            onRemove={() => handleRemoveCalculationLithosun300(selectedParam.id, calc.id)}
                                            isLocked={isFullyLocked}
                                          />
                                        </div>
                                      ))}
                                    </AnimatePresence>

                                    {(calculationsLithosun300PerParam[selectedParam.id] || []).length === 0 && (
                                      <motion.div
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="relative overflow-hidden text-center py-12 bg-gradient-to-br from-emerald-50 via-white to-emerald-50 border-2 border-dashed border-emerald-300 rounded-2xl shadow-inner"
                                      >
                                        <div className="relative z-10">
                                          <div className="inline-block p-4 bg-white rounded-full shadow-lg mb-3">
                                            <Target className="w-10 h-10 text-emerald-400" />
                                          </div>
                                          <p className="text-base font-bold text-emerald-800 mb-1">
                                            No calculations added yet
                                          </p>
                                          <p className="text-xs text-emerald-600/80 max-w-md mx-auto">
                                            Click "Add Calculation" to create a Lithosun 300 calculation
                                          </p>
                                        </div>
                                      </motion.div>
                                    )}
                                  </div>
                                </div>
                              )}
                          </motion.div>
                        )}
                        {/* ============= END LITHOSUN 300 PREPARATIONS ============= */}

                        {/* ============= LITHOSUN 400 PREPARATIONS ============= */}
                        {(activePreparationGroups[selectedParam.id] || []).includes("lithosun400") && (
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="relative mb-10 p-8 rounded-2xl border-2 border-emerald-200/50 bg-gradient-to-br from-emerald-50/40 via-white/60 to-emerald-50/40 backdrop-blur-sm shadow-sm hover:shadow-emerald-200/50 transition-all duration-500"
                          >
                            <div className={isPreparationLocked ? "pointer-events-none opacity-70" : ""}>
                              <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-emerald-400/10 to-transparent rounded-bl-full -z-10" />
                              <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-emerald-400/10 to-transparent rounded-tr-full -z-10" />

                              <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-4">
                                  <div className="relative">
                                    <div className="absolute inset-0 bg-emerald-500/20 blur-xl rounded-full" />
                                    <div className="relative w-12 h-12 bg-gradient-to-br from-emerald-700 to-emerald-900 rounded-2xl flex items-center justify-center shadow-lg transform hover:rotate-6 transition-transform duration-300">
                                      <BiTestTube className="w-6 h-6 text-white" />
                                    </div>
                                  </div>
                                  <div>
                                    <h2 className="text-xl font-bold text-emerald-900 tracking-tight">
                                      Preparations for Lithosun 400
                                    </h2>
                                    <p className="text-sm text-emerald-600/80 font-medium">
                                      Sample Preparation &amp; Calculations
                                    </p>
                                  </div>
                                </div>

                                <div className="px-4 py-1 bg-gradient-to-r from-emerald-50 to-emerald-50 border border-emerald-200 rounded-full shadow-sm">
                                  <span className="text-xs font-bold text-emerald-800">
                                    {((samplePreparationLithosun400PerParam[selectedParam.id] || []).length +
                                      (calculationsLithosun400PerParam[selectedParam.id] || []).length)}{" "}
                                    Items
                                  </span>
                                </div>
                              </div>

                              {/* Sample Preparation Section */}
                              <div>
                                <div className="flex items-center justify-between mb-4 px-2">
                                  <h3 className="text-lg font-bold text-emerald-800 flex items-center gap-2.5 tracking-tight">
                                    <span className="w-1.5 h-6 bg-gradient-to-b from-emerald-700 to-emerald-900 rounded-full"></span>
                                    Sample Preparations for Lithosun 400
                                  </h3>
                                  <button
                                    onClick={() => handleAddSamplePreparationLithosun400(selectedParam.id)}
                                    className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-emerald-700 to-emerald-900 text-white font-semibold rounded-xl hover:from-emerald-700 hover:to-emerald-800 transition-all duration-200 shadow-md hover:shadow-lg text-sm transform"
                                  >
                                    <Plus className="w-4 h-4" />
                                    Add Sample Preparation
                                  </button>
                                </div>

                                <AnimatePresence>
                                  {(samplePreparationLithosun400PerParam[selectedParam.id] || []).map((samplePrep, idx) => {
                                    const standardPrep = (standardPreparationMetalPerParam[selectedParam.id]?.["lithosun400"] || [])[idx];
                                    return (
                                      <motion.div
                                        key={samplePrep.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                      >
                                        {standardPrep && (
                                          <StandardPreparationMetalDetail
                                            standardPreparation={standardPrep}
                                            onStepChange={(spId, stepName, field, val) =>
                                              handleStandardPreparationMetalStepChange(selectedParam.id, "lithosun400", spId, stepName, field, val)
                                            }
                                            onRemove={() => handleRemoveSamplePreparationLithosun400(selectedParam.id, samplePrep.id)}
                                          />
                                        )}
                                        <div className="mt-2">
                                          <SamplePreparationMetalDetail
                                            samplePreparation={samplePrep}
                                            onStepChange={(spId, stepName, field, val) =>
                                              handleSamplePreparationLithosun400StepChange(
                                                selectedParam.id, spId, stepName, field, val,
                                              )
                                            }
                                            onRemove={() => handleRemoveSamplePreparationLithosun400(selectedParam.id, samplePrep.id)}
                                          />
                                        </div>
                                      </motion.div>
                                    );
                                  })}
                                </AnimatePresence>

                                {(samplePreparationLithosun400PerParam[selectedParam.id] || []).length === 0 && (
                                  <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="relative overflow-hidden text-center py-12 bg-gradient-to-br from-emerald-50 via-white to-emerald-50 border-2 border-dashed border-emerald-300 rounded-2xl shadow-inner"
                                  >
                                    <div className="relative z-10">
                                      <div className="inline-block p-4 bg-white rounded-full shadow-lg mb-3">
                                        <IoFlask className="w-10 h-10 text-emerald-400" />
                                      </div>
                                      <p className="text-base font-bold text-emerald-800 mb-1">No sample preparations added yet</p>
                                      <p className="text-xs text-emerald-600/80 max-w-md mx-auto">
                                        Click "Add Sample Preparation" to add one
                                      </p>
                                    </div>
                                  </motion.div>
                                )}
                              </div>
                              {/* Standard Preparation Section */}
                              <div className="mt-6">
                                <div className="flex items-center justify-between mb-4 px-2">
                                  <h3 className="text-lg font-bold text-emerald-800 flex items-center gap-2.5 tracking-tight">
                                    <span className="w-1.5 h-6 bg-gradient-to-b from-emerald-700 to-emerald-900 rounded-full"></span>
                                    Standard Preparations for Lithosun 400
                                  </h3>
                                  <button
                                    onClick={() => handleAddStandardPreparationLithosun400(selectedParam.id)}
                                    className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-emerald-700 to-emerald-900 text-white font-semibold rounded-xl hover:from-emerald-700 hover:to-emerald-800 transition-all duration-200 shadow-md hover:shadow-lg text-sm transform"
                                  >
                                    <Plus className="w-4 h-4" />
                                    Add Standard Preparation
                                  </button>
                                </div>

                                <AnimatePresence>
                                  {(standardPreparationMetalPerParam[selectedParam.id]?.["lithosun400"] || []).map((standardPrep) => (
                                    <motion.div
                                      key={standardPrep.id}
                                      initial={{ opacity: 0, y: 10 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      exit={{ opacity: 0, y: -10 }}
                                    >
                                      <StandardPreparationMetalDetail
                                        standardPreparation={standardPrep}
                                        onStepChange={(spId, stepName, field, val) =>
                                          handleStandardPreparationMetalStepChange(selectedParam.id, "lithosun400", spId, stepName, field, val)
                                        }
                                        onRemove={() => handleRemoveStandardPreparationLithosun400(selectedParam.id, standardPrep.id)}
                                      />
                                    </motion.div>
                                  ))}
                                </AnimatePresence>

                                {(standardPreparationMetalPerParam[selectedParam.id]?.["lithosun400"] || []).length === 0 && (
                                  <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="relative overflow-hidden text-center py-8 bg-gradient-to-br from-emerald-50 via-white to-emerald-50 border-2 border-dashed border-emerald-300 rounded-2xl shadow-inner"
                                  >
                                    <div className="relative z-10">
                                      <div className="inline-block p-4 bg-white rounded-full shadow-lg mb-3">
                                        <IoFlask className="w-10 h-10 text-emerald-400" />
                                      </div>
                                      <p className="text-base font-bold text-emerald-800 mb-1">No standard preparations added yet</p>
                                      <p className="text-xs text-emerald-600/80 max-w-md mx-auto">
                                        Click "Add Standard Preparation" to add one
                                      </p>
                                    </div>
                                  </motion.div>
                                )}

                                {/* Weight Sheet attacher */}
                                {(samplePreparationLithosun400PerParam[selectedParam.id] || []).length > 0 && (
                                  <div className="pointer-events-auto mt-4">
                                    <WorksheetFileAttacher
                                      files={getFilesForPrep(selectedParam.id, "lithosun400", "Weight Sheet")}
                                      onAdd={(newFiles) =>
                                        handleAddPrepFiles(selectedParam.id, "lithosun400", "Weight Sheet", newFiles)
                                      }
                                      onRemove={(index) =>
                                        handleRemovePrepFile(selectedParam.id, "lithosun400", "Weight Sheet", index)
                                      }
                                      preparationType="lithosun400"
                                      sectionLabel="Weight Sheet"
                                      isLocked={shouldDisableContent}
                                    />
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Complete Preparation block */}
                            {canManagePrep &&
                              (samplePreparationLithosun400PerParam[selectedParam.id] || []).length > 0 &&
                              (() => {
                                const isGroupCompleted =
                                  !!groupPrepCompletedAtPerParam[selectedParam.id]?.["lithosun400"];
                                const allPrepsValid = areAllMetalPrepsDilutionValid([
                                  ...(samplePreparationLithosun400PerParam[selectedParam.id] || []),
                                ]);
                                return (
                                  <div className="mt-4 pointer-events-auto opacity-100">
                                    {isGroupCompleted ? (
                                      <div className="flex items-center justify-between flex-wrap gap-3 px-5 py-3 bg-emerald-50 border-2 border-emerald-300 rounded-xl">
                                        <div className="flex items-center gap-2 text-emerald-700">
                                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                          </svg>
                                          <div>
                                            <p className="text-sm font-semibold text-emerald-800">
                                              Lithosun 400 Preparation Completed
                                            </p>
                                            <p className="text-xs text-emerald-600">
                                              Completed at{" "}
                                              {new Date(
                                                groupPrepCompletedAtPerParam[selectedParam.id]["lithosun400"]
                                              ).toLocaleString()}
                                            </p>
                                          </div>
                                        </div>
                                        <button
                                          onClick={() => handleInitiateUnlockGroupPrep(selectedParam, "lithosun400")}
                                          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-orange-700 bg-orange-50 border border-orange-300 rounded-lg hover:bg-orange-100 transition-colors"
                                        >
                                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                                          </svg>
                                          Unlock Preparation
                                        </button>
                                      </div>
                                    ) : (
                                      <div>
                                        {!allPrepsValid && (
                                          <div className="flex items-center gap-2 px-4 py-2.5 mb-2 bg-amber-50 border border-amber-300 rounded-xl text-xs text-amber-700 font-medium">
                                            <svg className="w-4 h-4 text-amber-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            Fix dilution step errors in all preparations before completing.
                                          </div>
                                        )}
                                        <button
                                          onClick={() => handleInitiateCompleteGroupPrep(selectedParam, "lithosun400")}
                                          disabled={!allPrepsValid}
                                          className={`w-full flex items-center justify-center gap-2 px-5 py-3 font-semibold rounded-xl transition-all text-sm ${allPrepsValid ? "bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white shadow-md hover:shadow-lg" : "bg-slate-200 text-slate-400 cursor-not-allowed"}`}
                                        >
                                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                          </svg>
                                          Complete Lithosun 400 Preparation
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                );
                              })()}

                            {/* Locked-out warning */}
                            {(samplePreparationLithosun400PerParam[selectedParam.id] || []).length > 0 &&
                              !groupPrepCompletedAtPerParam[selectedParam.id]?.["lithosun400"] &&
                              !canManagePrep && (
                                <div className="flex items-center gap-3 px-5 py-3 mt-4 bg-amber-50 border-2 border-amber-200 rounded-xl">
                                  <svg className="w-5 h-5 text-amber-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M12 3a9 9 0 100 18A9 9 0 0012 3z" />
                                  </svg>
                                  <p className="text-xs text-amber-700 font-medium">
                                    Awaiting preparation completion by an authorized user before calculations can be added.
                                  </p>
                                </div>
                              )}

                            {/* Calculations Section — gated on group prep completion */}
                            {(samplePreparationLithosun400PerParam[selectedParam.id] || []).length > 0 &&
                              groupPrepCompletedAtPerParam[selectedParam.id]?.["lithosun400"] && (
                                <div className={isFullyLocked ? "pointer-events-none opacity-70" : ""}>
                                  <div className="mt-8">
                                    <div className="flex items-center justify-between mb-4 px-2">
                                      <h3 className="text-lg font-bold text-emerald-800 flex items-center gap-2.5 tracking-tight">
                                        <span className="w-1.5 h-6 bg-gradient-to-b from-emerald-700 to-emerald-900 rounded-full"></span>
                                        Calculations for Lithosun 400
                                      </h3>
                                      <button
                                        onClick={() => handleAddCalculationLithosun400(selectedParam.id)}
                                        className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-emerald-700 to-emerald-900 text-white font-semibold rounded-xl hover:from-emerald-700 hover:to-emerald-800 transition-all duration-200 shadow-md hover:shadow-lg text-sm transform"
                                      >
                                        <Plus className="w-4 h-4" />
                                        Add Calculation
                                      </button>
                                    </div>

                                    <AnimatePresence>
                                      {(calculationsLithosun400PerParam[selectedParam.id] || []).map((calc) => (
                                        <div key={calc.id}>
                                          <CalculationDetailLithosun400
                                            calculation={calc}
                                            samplePreparations={samplePreparationLithosun400PerParam[selectedParam.id] || []}
                                            onUpdate={(updated) => handleUpdateCalculationLithosun400(selectedParam.id, updated)}
                                            onRemove={() => handleRemoveCalculationLithosun400(selectedParam.id, calc.id)}
                                            isLocked={isFullyLocked}
                                          />
                                        </div>
                                      ))}
                                    </AnimatePresence>

                                    {(calculationsLithosun400PerParam[selectedParam.id] || []).length === 0 && (
                                      <motion.div
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="relative overflow-hidden text-center py-12 bg-gradient-to-br from-emerald-50 via-white to-emerald-50 border-2 border-dashed border-emerald-300 rounded-2xl shadow-inner"
                                      >
                                        <div className="relative z-10">
                                          <div className="inline-block p-4 bg-white rounded-full shadow-lg mb-3">
                                            <Target className="w-10 h-10 text-emerald-400" />
                                          </div>
                                          <p className="text-base font-bold text-emerald-800 mb-1">
                                            No calculations added yet
                                          </p>
                                          <p className="text-xs text-emerald-600/80 max-w-md mx-auto">
                                            Click "Add Calculation" to create a Lithosun 400 calculation
                                          </p>
                                        </div>
                                      </motion.div>
                                    )}
                                  </div>
                                </div>
                              )}
                          </motion.div>
                        )}
                        {/* ============= END LITHOSUN 400 PREPARATIONS ============= */}

                        {/* ============= MEROPENAM PREPARATIONS ============= */}
                        {(activePreparationGroups[selectedParam.id] || []).includes("meropenam") && (
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="relative mb-10 p-8 rounded-2xl border-2 border-emerald-200/50 bg-gradient-to-br from-emerald-50/40 via-white/60 to-emerald-50/40 backdrop-blur-sm shadow-sm hover:shadow-emerald-200/50 transition-all duration-500"
                          >
                            <div className={isPreparationLocked ? "pointer-events-none opacity-70" : ""}>
                              <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-emerald-400/10 to-transparent rounded-bl-full -z-10" />
                              <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-emerald-400/10 to-transparent rounded-tr-full -z-10" />

                              <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-4">
                                  <div className="relative">
                                    <div className="absolute inset-0 bg-emerald-500/20 blur-xl rounded-full" />
                                    <div className="relative w-12 h-12 bg-gradient-to-br from-emerald-700 to-emerald-900 rounded-2xl flex items-center justify-center shadow-lg transform hover:rotate-6 transition-transform duration-300">
                                      <BiTestTube className="w-6 h-6 text-white" />
                                    </div>
                                  </div>
                                  <div>
                                    <h2 className="text-xl font-bold text-emerald-900 tracking-tight">
                                      Preparations for Meropenam
                                    </h2>
                                    <p className="text-sm text-emerald-600/80 font-medium">
                                      Sample Preparation &amp; Calculations
                                    </p>
                                  </div>
                                </div>

                                <div className="px-4 py-1 bg-gradient-to-r from-emerald-50 to-emerald-50 border border-emerald-200 rounded-full shadow-sm">
                                  <span className="text-xs font-bold text-emerald-800">
                                    {((samplePreparationMeropenamPerParam[selectedParam.id] || []).length +
                                      (calculationsMeropenamPerParam[selectedParam.id] || []).length)}{" "}
                                    Items
                                  </span>
                                </div>
                              </div>

                              {/* Sample Preparation Section */}
                              <div>
                                <div className="flex items-center justify-between mb-4 px-2">
                                  <h3 className="text-lg font-bold text-emerald-800 flex items-center gap-2.5 tracking-tight">
                                    <span className="w-1.5 h-6 bg-gradient-to-b from-emerald-700 to-emerald-900 rounded-full"></span>
                                    Sample Preparations for Meropenam
                                  </h3>
                                  <button
                                    onClick={() => handleAddSamplePreparationMeropenam(selectedParam.id)}
                                    className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-emerald-700 to-emerald-900 text-white font-semibold rounded-xl hover:from-emerald-700 hover:to-emerald-800 transition-all duration-200 shadow-md hover:shadow-lg text-sm transform"
                                  >
                                    <Plus className="w-4 h-4" />
                                    Add Sample Preparation
                                  </button>
                                </div>

                                <AnimatePresence>
                                  {(samplePreparationMeropenamPerParam[selectedParam.id] || []).map((samplePrep, idx) => {
                                    const standardPrep = (standardPreparationMetalPerParam[selectedParam.id]?.["meropenam"] || [])[idx];
                                    return (
                                      <motion.div
                                        key={samplePrep.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                      >
                                        {standardPrep && (
                                          <StandardPreparationMetalDetail
                                            standardPreparation={standardPrep}
                                            onStepChange={(spId, stepName, field, val) =>
                                              handleStandardPreparationMetalStepChange(selectedParam.id, "meropenam", spId, stepName, field, val)
                                            }
                                            onRemove={() => handleRemoveSamplePreparationMeropenam(selectedParam.id, samplePrep.id)}
                                          />
                                        )}
                                        <div className="mt-2">
                                          <SamplePreparationMetalDetail
                                            samplePreparation={samplePrep}
                                            onStepChange={(spId, stepName, field, val) =>
                                              handleSamplePreparationMeropenamStepChange(
                                                selectedParam.id, spId, stepName, field, val,
                                              )
                                            }
                                            onRemove={() => handleRemoveSamplePreparationMeropenam(selectedParam.id, samplePrep.id)}
                                          />
                                        </div>
                                      </motion.div>
                                    );
                                  })}
                                </AnimatePresence>

                                {(samplePreparationMeropenamPerParam[selectedParam.id] || []).length === 0 && (
                                  <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="relative overflow-hidden text-center py-12 bg-gradient-to-br from-emerald-50 via-white to-emerald-50 border-2 border-dashed border-emerald-300 rounded-2xl shadow-inner"
                                  >
                                    <div className="relative z-10">
                                      <div className="inline-block p-4 bg-white rounded-full shadow-lg mb-3">
                                        <IoFlask className="w-10 h-10 text-emerald-400" />
                                      </div>
                                      <p className="text-base font-bold text-emerald-800 mb-1">No sample preparations added yet</p>
                                      <p className="text-xs text-emerald-600/80 max-w-md mx-auto">
                                        Click "Add Sample Preparation" to add one
                                      </p>
                                    </div>
                                  </motion.div>
                                )}
                              </div>
                              {/* Standard Preparation Section */}
                              <div className="mt-6">
                                <div className="flex items-center justify-between mb-4 px-2">
                                  <h3 className="text-lg font-bold text-emerald-800 flex items-center gap-2.5 tracking-tight">
                                    <span className="w-1.5 h-6 bg-gradient-to-b from-emerald-700 to-emerald-900 rounded-full"></span>
                                    Standard Preparations for Meropenam
                                  </h3>
                                  <button
                                    onClick={() => handleAddStandardPreparationMeropenam(selectedParam.id)}
                                    className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-emerald-700 to-emerald-900 text-white font-semibold rounded-xl hover:from-emerald-700 hover:to-emerald-800 transition-all duration-200 shadow-md hover:shadow-lg text-sm transform"
                                  >
                                    <Plus className="w-4 h-4" />
                                    Add Standard Preparation
                                  </button>
                                </div>

                                <AnimatePresence>
                                  {(standardPreparationMetalPerParam[selectedParam.id]?.["meropenam"] || []).map((standardPrep) => (
                                    <motion.div
                                      key={standardPrep.id}
                                      initial={{ opacity: 0, y: 10 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      exit={{ opacity: 0, y: -10 }}
                                    >
                                      <StandardPreparationMetalDetail
                                        standardPreparation={standardPrep}
                                        onStepChange={(spId, stepName, field, val) =>
                                          handleStandardPreparationMetalStepChange(selectedParam.id, "meropenam", spId, stepName, field, val)
                                        }
                                        onRemove={() => handleRemoveStandardPreparationMeropenam(selectedParam.id, standardPrep.id)}
                                      />
                                    </motion.div>
                                  ))}
                                </AnimatePresence>

                                {(standardPreparationMetalPerParam[selectedParam.id]?.["meropenam"] || []).length === 0 && (
                                  <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="relative overflow-hidden text-center py-8 bg-gradient-to-br from-emerald-50 via-white to-emerald-50 border-2 border-dashed border-emerald-300 rounded-2xl shadow-inner"
                                  >
                                    <div className="relative z-10">
                                      <div className="inline-block p-4 bg-white rounded-full shadow-lg mb-3">
                                        <IoFlask className="w-10 h-10 text-emerald-400" />
                                      </div>
                                      <p className="text-base font-bold text-emerald-800 mb-1">No standard preparations added yet</p>
                                      <p className="text-xs text-emerald-600/80 max-w-md mx-auto">
                                        Click "Add Standard Preparation" to add one
                                      </p>
                                    </div>
                                  </motion.div>
                                )}

                                {/* Weight Sheet attacher */}
                                {(samplePreparationMeropenamPerParam[selectedParam.id] || []).length > 0 && (
                                  <div className="pointer-events-auto mt-4">
                                    <WorksheetFileAttacher
                                      files={getFilesForPrep(selectedParam.id, "meropenam", "Weight Sheet")}
                                      onAdd={(newFiles) =>
                                        handleAddPrepFiles(selectedParam.id, "meropenam", "Weight Sheet", newFiles)
                                      }
                                      onRemove={(index) =>
                                        handleRemovePrepFile(selectedParam.id, "meropenam", "Weight Sheet", index)
                                      }
                                      preparationType="meropenam"
                                      sectionLabel="Weight Sheet"
                                      isLocked={shouldDisableContent}
                                    />
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Complete Preparation block */}
                            {canManagePrep &&
                              (samplePreparationMeropenamPerParam[selectedParam.id] || []).length > 0 &&
                              (() => {
                                const isGroupCompleted =
                                  !!groupPrepCompletedAtPerParam[selectedParam.id]?.["meropenam"];
                                const allPrepsValid = areAllMetalPrepsDilutionValid([
                                  ...(samplePreparationMeropenamPerParam[selectedParam.id] || []),
                                ]);
                                return (
                                  <div className="mt-4 pointer-events-auto opacity-100">
                                    {isGroupCompleted ? (
                                      <div className="flex items-center justify-between flex-wrap gap-3 px-5 py-3 bg-emerald-50 border-2 border-emerald-300 rounded-xl">
                                        <div className="flex items-center gap-2 text-emerald-700">
                                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                          </svg>
                                          <div>
                                            <p className="text-sm font-semibold text-emerald-800">
                                              Meropenam Preparation Completed
                                            </p>
                                            <p className="text-xs text-emerald-600">
                                              Completed at{" "}
                                              {new Date(
                                                groupPrepCompletedAtPerParam[selectedParam.id]["meropenam"]
                                              ).toLocaleString()}
                                            </p>
                                          </div>
                                        </div>
                                        <button
                                          onClick={() => handleInitiateUnlockGroupPrep(selectedParam, "meropenam")}
                                          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-orange-700 bg-orange-50 border border-orange-300 rounded-lg hover:bg-orange-100 transition-colors"
                                        >
                                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                                          </svg>
                                          Unlock Preparation
                                        </button>
                                      </div>
                                    ) : (
                                      <div>
                                        {!allPrepsValid && (
                                          <div className="flex items-center gap-2 px-4 py-2.5 mb-2 bg-amber-50 border border-amber-300 rounded-xl text-xs text-amber-700 font-medium">
                                            <svg className="w-4 h-4 text-amber-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            Fix dilution step errors in all preparations before completing.
                                          </div>
                                        )}
                                        <button
                                          onClick={() => handleInitiateCompleteGroupPrep(selectedParam, "meropenam")}
                                          disabled={!allPrepsValid}
                                          className={`w-full flex items-center justify-center gap-2 px-5 py-3 font-semibold rounded-xl transition-all text-sm ${allPrepsValid ? "bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white shadow-md hover:shadow-lg" : "bg-slate-200 text-slate-400 cursor-not-allowed"}`}
                                        >
                                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                          </svg>
                                          Complete Meropenam Preparation
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                );
                              })()}

                            {/* Locked-out warning */}
                            {(samplePreparationMeropenamPerParam[selectedParam.id] || []).length > 0 &&
                              !groupPrepCompletedAtPerParam[selectedParam.id]?.["meropenam"] &&
                              !canManagePrep && (
                                <div className="flex items-center gap-3 px-5 py-3 mt-4 bg-amber-50 border-2 border-amber-200 rounded-xl">
                                  <svg className="w-5 h-5 text-amber-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M12 3a9 9 0 100 18A9 9 0 0012 3z" />
                                  </svg>
                                  <p className="text-xs text-amber-700 font-medium">
                                    Awaiting preparation completion by an authorized user before calculations can be added.
                                  </p>
                                </div>
                              )}

                            {/* Calculations Section — gated on group prep completion */}
                            {(samplePreparationMeropenamPerParam[selectedParam.id] || []).length > 0 &&
                              groupPrepCompletedAtPerParam[selectedParam.id]?.["meropenam"] && (
                                <div className={isFullyLocked ? "pointer-events-none opacity-70" : ""}>
                                  <div className="mt-8">
                                    <div className="flex items-center justify-between mb-4 px-2">
                                      <h3 className="text-lg font-bold text-emerald-800 flex items-center gap-2.5 tracking-tight">
                                        <span className="w-1.5 h-6 bg-gradient-to-b from-emerald-700 to-emerald-900 rounded-full"></span>
                                        Calculations for Meropenam
                                      </h3>
                                      <button
                                        onClick={() => handleAddCalculationMeropenam(selectedParam.id)}
                                        className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-emerald-700 to-emerald-900 text-white font-semibold rounded-xl hover:from-emerald-700 hover:to-emerald-800 transition-all duration-200 shadow-md hover:shadow-lg text-sm transform"
                                      >
                                        <Plus className="w-4 h-4" />
                                        Add Calculation
                                      </button>
                                    </div>

                                    <AnimatePresence>
                                      {(calculationsMeropenamPerParam[selectedParam.id] || []).map((calc) => (
                                        <div key={calc.id}>
                                          <CalculationDetailMeropenam
                                            calculation={calc}
                                            samplePreparations={samplePreparationMeropenamPerParam[selectedParam.id] || []}
                                            onUpdate={(updated) => handleUpdateCalculationMeropenam(selectedParam.id, updated)}
                                            onRemove={() => handleRemoveCalculationMeropenam(selectedParam.id, calc.id)}
                                            isLocked={isFullyLocked}
                                          />
                                        </div>
                                      ))}
                                    </AnimatePresence>

                                    {(calculationsMeropenamPerParam[selectedParam.id] || []).length === 0 && (
                                      <motion.div
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="relative overflow-hidden text-center py-12 bg-gradient-to-br from-emerald-50 via-white to-emerald-50 border-2 border-dashed border-emerald-300 rounded-2xl shadow-inner"
                                      >
                                        <div className="relative z-10">
                                          <div className="inline-block p-4 bg-white rounded-full shadow-lg mb-3">
                                            <Target className="w-10 h-10 text-emerald-400" />
                                          </div>
                                          <p className="text-base font-bold text-emerald-800 mb-1">
                                            No calculations added yet
                                          </p>
                                          <p className="text-xs text-emerald-600/80 max-w-md mx-auto">
                                            Click "Add Calculation" to create a Meropenam calculation
                                          </p>
                                        </div>
                                      </motion.div>
                                    )}
                                  </div>
                                </div>
                              )}
                          </motion.div>
                        )}
                        {/* ============= END MEROPENAM PREPARATIONS ============= */}

                        {/* ============= TALC PREPARATIONS ============= */}
                        {(activePreparationGroups[selectedParam.id] || []).includes("talc") && (
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="relative mb-10 p-8 rounded-2xl border-2 border-emerald-200/50 bg-gradient-to-br from-emerald-50/40 via-white/60 to-emerald-50/40 backdrop-blur-sm shadow-sm hover:shadow-emerald-200/50 transition-all duration-500"
                          >
                            <div className={isPreparationLocked ? "pointer-events-none opacity-70" : ""}>
                              <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-emerald-400/10 to-transparent rounded-bl-full -z-10" />
                              <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-emerald-400/10 to-transparent rounded-tr-full -z-10" />

                              <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-4">
                                  <div className="relative">
                                    <div className="absolute inset-0 bg-emerald-500/20 blur-xl rounded-full" />
                                    <div className="relative w-12 h-12 bg-gradient-to-br from-emerald-700 to-emerald-900 rounded-2xl flex items-center justify-center shadow-lg transform hover:rotate-6 transition-transform duration-300">
                                      <BiTestTube className="w-6 h-6 text-white" />
                                    </div>
                                  </div>
                                  <div>
                                    <h2 className="text-xl font-bold text-emerald-900 tracking-tight">
                                      Preparations for Talc
                                    </h2>
                                    <p className="text-sm text-emerald-600/80 font-medium">
                                      Sample Preparation &amp; Calculations
                                    </p>
                                  </div>
                                </div>

                                <div className="px-4 py-1 bg-gradient-to-r from-emerald-50 to-emerald-50 border border-emerald-200 rounded-full shadow-sm">
                                  <span className="text-xs font-bold text-emerald-800">
                                    {((samplePreparationTalcPerParam[selectedParam.id] || []).length +
                                      (calculationsTalcPerParam[selectedParam.id] || []).length)}{" "}
                                    Items
                                  </span>
                                </div>
                              </div>

                              {/* Sample Preparation Section */}
                              <div>
                                <div className="flex items-center justify-between mb-4 px-2">
                                  <h3 className="text-lg font-bold text-emerald-800 flex items-center gap-2.5 tracking-tight">
                                    <span className="w-1.5 h-6 bg-gradient-to-b from-emerald-700 to-emerald-900 rounded-full"></span>
                                    Sample Preparations for Talc
                                  </h3>
                                  <button
                                    onClick={() => handleAddSamplePreparationTalc(selectedParam.id)}
                                    className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-emerald-700 to-emerald-900 text-white font-semibold rounded-xl hover:from-emerald-700 hover:to-emerald-800 transition-all duration-200 shadow-md hover:shadow-lg text-sm transform"
                                  >
                                    <Plus className="w-4 h-4" />
                                    Add Sample Preparation
                                  </button>
                                </div>

                                <AnimatePresence>
                                  {(samplePreparationTalcPerParam[selectedParam.id] || []).map((samplePrep, idx) => {
                                    const standardPrep = (standardPreparationMetalPerParam[selectedParam.id]?.["talc"] || [])[idx];
                                    return (
                                      <motion.div
                                        key={samplePrep.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                      >
                                        {standardPrep && (
                                          <StandardPreparationMetalDetail
                                            standardPreparation={standardPrep}
                                            onStepChange={(spId, stepName, field, val) =>
                                              handleStandardPreparationMetalStepChange(selectedParam.id, "talc", spId, stepName, field, val)
                                            }
                                            onRemove={() => handleRemoveSamplePreparationTalc(selectedParam.id, samplePrep.id)}
                                          />
                                        )}
                                        <div className="mt-2">
                                          <SamplePreparationMetalDetail
                                            samplePreparation={samplePrep}
                                            onStepChange={(spId, stepName, field, val) =>
                                              handleSamplePreparationTalcStepChange(
                                                selectedParam.id, spId, stepName, field, val,
                                              )
                                            }
                                            onRemove={() => handleRemoveSamplePreparationTalc(selectedParam.id, samplePrep.id)}
                                          />
                                        </div>
                                      </motion.div>
                                    );
                                  })}
                                </AnimatePresence>

                                {(samplePreparationTalcPerParam[selectedParam.id] || []).length === 0 && (
                                  <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="relative overflow-hidden text-center py-12 bg-gradient-to-br from-emerald-50 via-white to-emerald-50 border-2 border-dashed border-emerald-300 rounded-2xl shadow-inner"
                                  >
                                    <div className="relative z-10">
                                      <div className="inline-block p-4 bg-white rounded-full shadow-lg mb-3">
                                        <IoFlask className="w-10 h-10 text-emerald-400" />
                                      </div>
                                      <p className="text-base font-bold text-emerald-800 mb-1">No sample preparations added yet</p>
                                      <p className="text-xs text-emerald-600/80 max-w-md mx-auto">
                                        Click "Add Sample Preparation" to add one
                                      </p>
                                    </div>
                                  </motion.div>
                                )}
                              </div>
                              {/* Standard Preparation Section */}
                              <div className="mt-6">
                                <div className="flex items-center justify-between mb-4 px-2">
                                  <h3 className="text-lg font-bold text-emerald-800 flex items-center gap-2.5 tracking-tight">
                                    <span className="w-1.5 h-6 bg-gradient-to-b from-emerald-700 to-emerald-900 rounded-full"></span>
                                    Standard Preparations for Talc
                                  </h3>
                                  <button
                                    onClick={() => handleAddStandardPreparationTalc(selectedParam.id)}
                                    className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-emerald-700 to-emerald-900 text-white font-semibold rounded-xl hover:from-emerald-700 hover:to-emerald-800 transition-all duration-200 shadow-md hover:shadow-lg text-sm transform"
                                  >
                                    <Plus className="w-4 h-4" />
                                    Add Standard Preparation
                                  </button>
                                </div>

                                <AnimatePresence>
                                  {(standardPreparationMetalPerParam[selectedParam.id]?.["talc"] || []).map((standardPrep) => (
                                    <motion.div
                                      key={standardPrep.id}
                                      initial={{ opacity: 0, y: 10 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      exit={{ opacity: 0, y: -10 }}
                                    >
                                      <StandardPreparationMetalDetail
                                        standardPreparation={standardPrep}
                                        onStepChange={(spId, stepName, field, val) =>
                                          handleStandardPreparationMetalStepChange(selectedParam.id, "talc", spId, stepName, field, val)
                                        }
                                        onRemove={() => handleRemoveStandardPreparationTalc(selectedParam.id, standardPrep.id)}
                                      />
                                    </motion.div>
                                  ))}
                                </AnimatePresence>

                                {(standardPreparationMetalPerParam[selectedParam.id]?.["talc"] || []).length === 0 && (
                                  <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="relative overflow-hidden text-center py-8 bg-gradient-to-br from-emerald-50 via-white to-emerald-50 border-2 border-dashed border-emerald-300 rounded-2xl shadow-inner"
                                  >
                                    <div className="relative z-10">
                                      <div className="inline-block p-4 bg-white rounded-full shadow-lg mb-3">
                                        <IoFlask className="w-10 h-10 text-emerald-400" />
                                      </div>
                                      <p className="text-base font-bold text-emerald-800 mb-1">No standard preparations added yet</p>
                                      <p className="text-xs text-emerald-600/80 max-w-md mx-auto">
                                        Click "Add Standard Preparation" to add one
                                      </p>
                                    </div>
                                  </motion.div>
                                )}

                                {/* Weight Sheet attacher */}
                                {(samplePreparationTalcPerParam[selectedParam.id] || []).length > 0 && (
                                  <div className="pointer-events-auto mt-4">
                                    <WorksheetFileAttacher
                                      files={getFilesForPrep(selectedParam.id, "talc", "Weight Sheet")}
                                      onAdd={(newFiles) =>
                                        handleAddPrepFiles(selectedParam.id, "talc", "Weight Sheet", newFiles)
                                      }
                                      onRemove={(index) =>
                                        handleRemovePrepFile(selectedParam.id, "talc", "Weight Sheet", index)
                                      }
                                      preparationType="talc"
                                      sectionLabel="Weight Sheet"
                                      isLocked={shouldDisableContent}
                                    />
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Complete Preparation block */}
                            {canManagePrep &&
                              (samplePreparationTalcPerParam[selectedParam.id] || []).length > 0 &&
                              (() => {
                                const isGroupCompleted =
                                  !!groupPrepCompletedAtPerParam[selectedParam.id]?.["talc"];
                                const allPrepsValid = areAllMetalPrepsDilutionValid([
                                  ...(samplePreparationTalcPerParam[selectedParam.id] || []),
                                ]);
                                return (
                                  <div className="mt-4 pointer-events-auto opacity-100">
                                    {isGroupCompleted ? (
                                      <div className="flex items-center justify-between flex-wrap gap-3 px-5 py-3 bg-emerald-50 border-2 border-emerald-300 rounded-xl">
                                        <div className="flex items-center gap-2 text-emerald-700">
                                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                          </svg>
                                          <div>
                                            <p className="text-sm font-semibold text-emerald-800">
                                              Talc Preparation Completed
                                            </p>
                                            <p className="text-xs text-emerald-600">
                                              Completed at{" "}
                                              {new Date(
                                                groupPrepCompletedAtPerParam[selectedParam.id]["talc"]
                                              ).toLocaleString()}
                                            </p>
                                          </div>
                                        </div>
                                        <button
                                          onClick={() => handleInitiateUnlockGroupPrep(selectedParam, "talc")}
                                          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-orange-700 bg-orange-50 border border-orange-300 rounded-lg hover:bg-orange-100 transition-colors"
                                        >
                                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                                          </svg>
                                          Unlock Preparation
                                        </button>
                                      </div>
                                    ) : (
                                      <div>
                                        {!allPrepsValid && (
                                          <div className="flex items-center gap-2 px-4 py-2.5 mb-2 bg-amber-50 border border-amber-300 rounded-xl text-xs text-amber-700 font-medium">
                                            <svg className="w-4 h-4 text-amber-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            Fix dilution step errors in all preparations before completing.
                                          </div>
                                        )}
                                        <button
                                          onClick={() => handleInitiateCompleteGroupPrep(selectedParam, "talc")}
                                          disabled={!allPrepsValid}
                                          className={`w-full flex items-center justify-center gap-2 px-5 py-3 font-semibold rounded-xl transition-all text-sm ${allPrepsValid ? "bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white shadow-md hover:shadow-lg" : "bg-slate-200 text-slate-400 cursor-not-allowed"}`}
                                        >
                                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                          </svg>
                                          Complete Talc Preparation
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                );
                              })()}

                            {/* Locked-out warning */}
                            {(samplePreparationTalcPerParam[selectedParam.id] || []).length > 0 &&
                              !groupPrepCompletedAtPerParam[selectedParam.id]?.["talc"] &&
                              !canManagePrep && (
                                <div className="flex items-center gap-3 px-5 py-3 mt-4 bg-amber-50 border-2 border-amber-200 rounded-xl">
                                  <svg className="w-5 h-5 text-amber-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M12 3a9 9 0 100 18A9 9 0 0012 3z" />
                                  </svg>
                                  <p className="text-xs text-amber-700 font-medium">
                                    Awaiting preparation completion by an authorized user before calculations can be added.
                                  </p>
                                </div>
                              )}

                            {/* Calculations Section — gated on group prep completion */}
                            {(samplePreparationTalcPerParam[selectedParam.id] || []).length > 0 &&
                              groupPrepCompletedAtPerParam[selectedParam.id]?.["talc"] && (
                                <div className={isFullyLocked ? "pointer-events-none opacity-70" : ""}>
                                  <div className="mt-8">
                                    <div className="flex items-center justify-between mb-4 px-2">
                                      <h3 className="text-lg font-bold text-emerald-800 flex items-center gap-2.5 tracking-tight">
                                        <span className="w-1.5 h-6 bg-gradient-to-b from-emerald-700 to-emerald-900 rounded-full"></span>
                                        Calculations for Talc
                                      </h3>
                                      <button
                                        onClick={() => handleAddCalculationTalc(selectedParam.id)}
                                        className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-emerald-700 to-emerald-900 text-white font-semibold rounded-xl hover:from-emerald-700 hover:to-emerald-800 transition-all duration-200 shadow-md hover:shadow-lg text-sm transform"
                                      >
                                        <Plus className="w-4 h-4" />
                                        Add Calculation
                                      </button>
                                    </div>

                                    <AnimatePresence>
                                      {(calculationsTalcPerParam[selectedParam.id] || []).map((calc) => (
                                        <div key={calc.id}>
                                          <CalculationDetailTalc
                                            calculation={calc}
                                            samplePreparations={samplePreparationTalcPerParam[selectedParam.id] || []}
                                            onUpdate={(updated) => handleUpdateCalculationTalc(selectedParam.id, updated)}
                                            onRemove={() => handleRemoveCalculationTalc(selectedParam.id, calc.id)}
                                            isLocked={isFullyLocked}
                                          />
                                        </div>
                                      ))}
                                    </AnimatePresence>

                                    {(calculationsTalcPerParam[selectedParam.id] || []).length === 0 && (
                                      <motion.div
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="relative overflow-hidden text-center py-12 bg-gradient-to-br from-emerald-50 via-white to-emerald-50 border-2 border-dashed border-emerald-300 rounded-2xl shadow-inner"
                                      >
                                        <div className="relative z-10">
                                          <div className="inline-block p-4 bg-white rounded-full shadow-lg mb-3">
                                            <Target className="w-10 h-10 text-emerald-400" />
                                          </div>
                                          <p className="text-base font-bold text-emerald-800 mb-1">
                                            No calculations added yet
                                          </p>
                                          <p className="text-xs text-emerald-600/80 max-w-md mx-auto">
                                            Click "Add Calculation" to create a Talc calculation
                                          </p>
                                        </div>
                                      </motion.div>
                                    )}
                                  </div>
                                </div>
                              )}
                          </motion.div>
                        )}
                        {/* ============= END TALC PREPARATIONS ============= */}

                        {/* ============= SFGC PREPARATIONS ============= */}
                        {(activePreparationGroups[selectedParam.id] || []).includes("sfgc") && (
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="relative mb-10 p-8 rounded-2xl border-2 border-emerald-200/50 bg-gradient-to-br from-emerald-50/40 via-white/60 to-emerald-50/40 backdrop-blur-sm shadow-sm hover:shadow-emerald-200/50 transition-all duration-500"
                          >
                            <div className={isPreparationLocked ? "pointer-events-none opacity-70" : ""}>
                              <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-emerald-400/10 to-transparent rounded-bl-full -z-10" />
                              <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-emerald-400/10 to-transparent rounded-tr-full -z-10" />

                              <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-4">
                                  <div className="relative">
                                    <div className="absolute inset-0 bg-emerald-500/20 blur-xl rounded-full" />
                                    <div className="relative w-12 h-12 bg-gradient-to-br from-emerald-700 to-emerald-900 rounded-2xl flex items-center justify-center shadow-lg transform hover:rotate-6 transition-transform duration-300">
                                      <BiTestTube className="w-6 h-6 text-white" />
                                    </div>
                                  </div>
                                  <div>
                                    <h2 className="text-xl font-bold text-emerald-900 tracking-tight">
                                      Preparations for SFGC
                                    </h2>
                                    <p className="text-sm text-emerald-600/80 font-medium">
                                      Sample Preparation &amp; Calculations
                                    </p>
                                  </div>
                                </div>

                                <div className="px-4 py-1 bg-gradient-to-r from-emerald-50 to-emerald-50 border border-emerald-200 rounded-full shadow-sm">
                                  <span className="text-xs font-bold text-emerald-800">
                                    {((samplePreparationSFGCPerParam[selectedParam.id] || []).length +
                                      (calculationsSFGCPerParam[selectedParam.id] || []).length)}{" "}
                                    Items
                                  </span>
                                </div>
                              </div>

                              {/* Sample Preparation Section */}
                              <div>
                                <div className="flex items-center justify-between mb-4 px-2">
                                  <h3 className="text-lg font-bold text-emerald-800 flex items-center gap-2.5 tracking-tight">
                                    <span className="w-1.5 h-6 bg-gradient-to-b from-emerald-700 to-emerald-900 rounded-full"></span>
                                    Sample Preparations for SFGC
                                  </h3>
                                  <button
                                    onClick={() => handleAddSamplePreparationSFGC(selectedParam.id)}
                                    className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-emerald-700 to-emerald-900 text-white font-semibold rounded-xl hover:from-emerald-700 hover:to-emerald-800 transition-all duration-200 shadow-md hover:shadow-lg text-sm transform"
                                  >
                                    <Plus className="w-4 h-4" />
                                    Add Sample Preparation
                                  </button>
                                </div>

                                <AnimatePresence>
                                  {(samplePreparationSFGCPerParam[selectedParam.id] || []).map((samplePrep, idx) => {
                                    const standardPrep = (standardPreparationMetalPerParam[selectedParam.id]?.["sfgc"] || [])[idx];
                                    return (
                                      <motion.div
                                        key={samplePrep.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                      >
                                        {standardPrep && (
                                          <StandardPreparationMetalDetail
                                            standardPreparation={standardPrep}
                                            onStepChange={(spId, stepName, field, val) =>
                                              handleStandardPreparationMetalStepChange(selectedParam.id, "sfgc", spId, stepName, field, val)
                                            }
                                            onRemove={() => handleRemoveSamplePreparationMeropenam(selectedParam.id, samplePrep.id)}
                                          />
                                        )}
                                        <div className="mt-2">
                                          <SamplePreparationMetalDetail
                                            samplePreparation={samplePrep}
                                            onStepChange={(spId, stepName, field, val) =>
                                              handleSamplePreparationSFGCStepChange(
                                                selectedParam.id, spId, stepName, field, val,
                                              )
                                            }
                                            onRemove={() => handleRemoveSamplePreparationSFGC(selectedParam.id, samplePrep.id)}
                                          />
                                        </div>
                                      </motion.div>
                                    );
                                  })}
                                </AnimatePresence>

                                {(samplePreparationSFGCPerParam[selectedParam.id] || []).length === 0 && (
                                  <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="relative overflow-hidden text-center py-12 bg-gradient-to-br from-emerald-50 via-white to-emerald-50 border-2 border-dashed border-emerald-300 rounded-2xl shadow-inner"
                                  >
                                    <div className="relative z-10">
                                      <div className="inline-block p-4 bg-white rounded-full shadow-lg mb-3">
                                        <IoFlask className="w-10 h-10 text-emerald-400" />
                                      </div>
                                      <p className="text-base font-bold text-emerald-800 mb-1">No sample preparations added yet</p>
                                      <p className="text-xs text-emerald-600/80 max-w-md mx-auto">
                                        Click "Add Sample Preparation" to add one
                                      </p>
                                    </div>
                                  </motion.div>
                                )}
                              </div>
                              {/* Standard Preparation Section */}
                              <div className="mt-6">
                                <div className="flex items-center justify-between mb-4 px-2">
                                  <h3 className="text-lg font-bold text-emerald-800 flex items-center gap-2.5 tracking-tight">
                                    <span className="w-1.5 h-6 bg-gradient-to-b from-emerald-700 to-emerald-900 rounded-full"></span>
                                    Standard Preparations for SFGC
                                  </h3>
                                  <button
                                    onClick={() => handleAddStandardPreparationSFGC(selectedParam.id)}
                                    className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-emerald-700 to-emerald-900 text-white font-semibold rounded-xl hover:from-emerald-700 hover:to-emerald-800 transition-all duration-200 shadow-md hover:shadow-lg text-sm transform"
                                  >
                                    <Plus className="w-4 h-4" />
                                    Add Standard Preparation
                                  </button>
                                </div>

                                <AnimatePresence>
                                  {(standardPreparationMetalPerParam[selectedParam.id]?.["sfgc"] || []).map((standardPrep) => (
                                    <motion.div
                                      key={standardPrep.id}
                                      initial={{ opacity: 0, y: 10 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      exit={{ opacity: 0, y: -10 }}
                                    >
                                      <StandardPreparationMetalDetail
                                        standardPreparation={standardPrep}
                                        onStepChange={(spId, stepName, field, val) =>
                                          handleStandardPreparationMetalStepChange(selectedParam.id, "sfgc", spId, stepName, field, val)
                                        }
                                        onRemove={() => handleRemoveStandardPreparationSFGC(selectedParam.id, standardPrep.id)}
                                      />
                                    </motion.div>
                                  ))}
                                </AnimatePresence>

                                {(standardPreparationMetalPerParam[selectedParam.id]?.["sfgc"] || []).length === 0 && (
                                  <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="relative overflow-hidden text-center py-8 bg-gradient-to-br from-emerald-50 via-white to-emerald-50 border-2 border-dashed border-emerald-300 rounded-2xl shadow-inner"
                                  >
                                    <div className="relative z-10">
                                      <div className="inline-block p-4 bg-white rounded-full shadow-lg mb-3">
                                        <IoFlask className="w-10 h-10 text-emerald-400" />
                                      </div>
                                      <p className="text-base font-bold text-emerald-800 mb-1">No standard preparations added yet</p>
                                      <p className="text-xs text-emerald-600/80 max-w-md mx-auto">
                                        Click "Add Standard Preparation" to add one
                                      </p>
                                    </div>
                                  </motion.div>
                                )}

                                {/* Weight Sheet attacher */}
                                {(samplePreparationSFGCPerParam[selectedParam.id] || []).length > 0 && (
                                  <div className="pointer-events-auto mt-4">
                                    <WorksheetFileAttacher
                                      files={getFilesForPrep(selectedParam.id, "sfgc", "Weight Sheet")}
                                      onAdd={(newFiles) =>
                                        handleAddPrepFiles(selectedParam.id, "sfgc", "Weight Sheet", newFiles)
                                      }
                                      onRemove={(index) =>
                                        handleRemovePrepFile(selectedParam.id, "sfgc", "Weight Sheet", index)
                                      }
                                      preparationType="sfgc"
                                      sectionLabel="Weight Sheet"
                                      isLocked={shouldDisableContent}
                                    />
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Complete Preparation block */}
                            {canManagePrep &&
                              (samplePreparationSFGCPerParam[selectedParam.id] || []).length > 0 &&
                              (() => {
                                const isGroupCompleted =
                                  !!groupPrepCompletedAtPerParam[selectedParam.id]?.["sfgc"];
                                const allPrepsValid = areAllMetalPrepsDilutionValid([
                                  ...(samplePreparationSFGCPerParam[selectedParam.id] || []),
                                ]);
                                return (
                                  <div className="mt-4 pointer-events-auto opacity-100">
                                    {isGroupCompleted ? (
                                      <div className="flex items-center justify-between flex-wrap gap-3 px-5 py-3 bg-emerald-50 border-2 border-emerald-300 rounded-xl">
                                        <div className="flex items-center gap-2 text-emerald-700">
                                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                          </svg>
                                          <div>
                                            <p className="text-sm font-semibold text-emerald-800">
                                              SFGC Preparation Completed
                                            </p>
                                            <p className="text-xs text-emerald-600">
                                              Completed at{" "}
                                              {new Date(
                                                groupPrepCompletedAtPerParam[selectedParam.id]["sfgc"]
                                              ).toLocaleString()}
                                            </p>
                                          </div>
                                        </div>
                                        <button
                                          onClick={() => handleInitiateUnlockGroupPrep(selectedParam, "sfgc")}
                                          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-orange-700 bg-orange-50 border border-orange-300 rounded-lg hover:bg-orange-100 transition-colors"
                                        >
                                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                                          </svg>
                                          Unlock Preparation
                                        </button>
                                      </div>
                                    ) : (
                                      <div>
                                        {!allPrepsValid && (
                                          <div className="flex items-center gap-2 px-4 py-2.5 mb-2 bg-amber-50 border border-amber-300 rounded-xl text-xs text-amber-700 font-medium">
                                            <svg className="w-4 h-4 text-amber-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            Fix dilution step errors in all preparations before completing.
                                          </div>
                                        )}
                                        <button
                                          onClick={() => handleInitiateCompleteGroupPrep(selectedParam, "sfgc")}
                                          disabled={!allPrepsValid}
                                          className={`w-full flex items-center justify-center gap-2 px-5 py-3 font-semibold rounded-xl transition-all text-sm ${allPrepsValid ? "bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white shadow-md hover:shadow-lg" : "bg-slate-200 text-slate-400 cursor-not-allowed"}`}
                                        >
                                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                          </svg>
                                          Complete SFGC Preparation
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                );
                              })()}

                            {/* Locked-out warning */}
                            {(samplePreparationSFGCPerParam[selectedParam.id] || []).length > 0 &&
                              !groupPrepCompletedAtPerParam[selectedParam.id]?.["sfgc"] &&
                              !canManagePrep && (
                                <div className="flex items-center gap-3 px-5 py-3 mt-4 bg-amber-50 border-2 border-amber-200 rounded-xl">
                                  <svg className="w-5 h-5 text-amber-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M12 3a9 9 0 100 18A9 9 0 0012 3z" />
                                  </svg>
                                  <p className="text-xs text-amber-700 font-medium">
                                    Awaiting preparation completion by an authorized user before calculations can be added.
                                  </p>
                                </div>
                              )}

                            {/* Calculations Section — gated on group prep completion */}
                            {(samplePreparationSFGCPerParam[selectedParam.id] || []).length > 0 &&
                              groupPrepCompletedAtPerParam[selectedParam.id]?.["sfgc"] && (
                                <div className={isFullyLocked ? "pointer-events-none opacity-70" : ""}>
                                  <div className="mt-8">
                                    <div className="flex items-center justify-between mb-4 px-2">
                                      <h3 className="text-lg font-bold text-emerald-800 flex items-center gap-2.5 tracking-tight">
                                        <span className="w-1.5 h-6 bg-gradient-to-b from-emerald-700 to-emerald-900 rounded-full"></span>
                                        Calculations for SFGC
                                      </h3>
                                      <button
                                        onClick={() => handleAddCalculationSFGC(selectedParam.id)}
                                        className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-emerald-700 to-emerald-900 text-white font-semibold rounded-xl hover:from-emerald-700 hover:to-emerald-800 transition-all duration-200 shadow-md hover:shadow-lg text-sm transform"
                                      >
                                        <Plus className="w-4 h-4" />
                                        Add Calculation
                                      </button>
                                    </div>

                                    <AnimatePresence>
                                      {(calculationsSFGCPerParam[selectedParam.id] || []).map((calc) => (
                                        <div key={calc.id}>
                                          <CalculationDetailSFGC
                                            calculation={calc}
                                            samplePreparations={samplePreparationSFGCPerParam[selectedParam.id] || []}
                                            onUpdate={(updated) => handleUpdateCalculationSFGC(selectedParam.id, updated)}
                                            onRemove={() => handleRemoveCalculationSFGC(selectedParam.id, calc.id)}
                                            isLocked={isFullyLocked}
                                          />
                                        </div>
                                      ))}
                                    </AnimatePresence>

                                    {(calculationsSFGCPerParam[selectedParam.id] || []).length === 0 && (
                                      <motion.div
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="relative overflow-hidden text-center py-12 bg-gradient-to-br from-emerald-50 via-white to-emerald-50 border-2 border-dashed border-emerald-300 rounded-2xl shadow-inner"
                                      >
                                        <div className="relative z-10">
                                          <div className="inline-block p-4 bg-white rounded-full shadow-lg mb-3">
                                            <Target className="w-10 h-10 text-emerald-400" />
                                          </div>
                                          <p className="text-base font-bold text-emerald-800 mb-1">
                                            No calculations added yet
                                          </p>
                                          <p className="text-xs text-emerald-600/80 max-w-md mx-auto">
                                            Click "Add Calculation" to create a SFGC calculation
                                          </p>
                                        </div>
                                      </motion.div>
                                    )}
                                  </div>
                                </div>
                              )}
                          </motion.div>
                        )}
                        {/* ============= END SFGC PREPARATIONS ============= */}

                        <div
                          className={
                            isFullyLocked ? "pointer-events-none opacity-70" : ""
                          }
                        >
                          {/* Parameter Files Toggle */}
                          <div className="mb-6 mt-4">
                            <label className="flex items-center gap-4 cursor-pointer group relative">
                              <div className="relative flex items-center justify-center">
                                <div className="absolute inset-0 bg-gradient-to-r from-emerald-700 to-emerald-900 rounded-full blur-lg opacity-0 group-hover:opacity-20 transition-all duration-300" />

                                <input
                                  type="checkbox"
                                  checked={
                                    showParamFiles[selectedParam.id] || false
                                  }
                                  onChange={(e) => {
                                    setShowParamFiles((prev) => ({
                                      ...prev,
                                      [selectedParam.id]: e.target.checked,
                                    }));
                                    if (!e.target.checked) {
                                      // Clear param-level files when toggled off
                                      updateFilesForSlot(
                                        selectedParam.id,
                                        PARAM_LEVEL_KEY,
                                        () => [],
                                      );
                                    }
                                  }}
                                  className="peer sr-only"
                                />

                                <div className="relative w-14 h-7 rounded-full border-2 border-emerald-200 bg-gray-200 peer-checked:bg-gradient-to-r peer-checked:from-emerald-700 peer-checked:to-emerald-900 peer-checked:border-emerald-600 transition-all duration-300 shadow-inner group-hover:border-emerald-300">
                                  <motion.div
                                    className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md flex items-center justify-center"
                                    animate={{
                                      x: showParamFiles[selectedParam.id] ? 28 : 0,
                                    }}
                                    transition={{
                                      type: "spring",
                                      stiffness: 500,
                                      damping: 30,
                                    }}
                                  >
                                    {showParamFiles[selectedParam.id] ? (
                                      <svg
                                        className="w-3 h-3 text-emerald-600"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth="3"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          d="M5 13l4 4L19 7"
                                        />
                                      </svg>
                                    ) : (
                                      <svg
                                        className="w-3 h-3 text-gray-400"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth="3"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          d="M6 18L18 6M6 6l12 12"
                                        />
                                      </svg>
                                    )}
                                  </motion.div>
                                </div>
                              </div>

                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <span className="text-base font-bold text-emerald-800 group-hover:text-emerald-800 transition-colors duration-200">
                                    Parameter Files
                                  </span>

                                  <motion.span
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className={`px-2 py-0.2 text-[10px] font-medium rounded-full transition-all duration-200 ${showParamFiles[selectedParam.id]
                                      ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                                      : "bg-gray-100 text-gray-500 border border-gray-200"
                                      }`}
                                  >
                                    {showParamFiles[selectedParam.id]
                                      ? "Active"
                                      : "Inactive"}
                                  </motion.span>
                                </div>

                                <p className="text-xs text-emerald-600/70">
                                  Attach additional files for this parameter
                                </p>
                              </div>
                            </label>
                          </div>

                          {/* Parameter Files Section (Conditional) */}
                          <AnimatePresence>
                            {showParamFiles[selectedParam.id] && (
                              <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 0 }}
                                className="mb-6 p-6 bg-white rounded-xl border-2 border-emerald-200 shadow-lg"
                              >
                                <div className="flex items-center gap-3 mb-4">
                                  <span className="w-1.5 h-6 bg-gradient-to-b from-emerald-500 to-emerald-600 rounded-full"></span>
                                  <h3 className="text-lg font-bold text-emerald-800 tracking-tight">
                                    Parameter Files
                                  </h3>
                                </div>
                                <div className="pointer-events-auto">
                                  <WorksheetFileAttacher
                                    files={getParamLevelFiles(selectedParam.id)}
                                    onAdd={(newFiles) =>
                                      handleAddParamFiles(
                                        selectedParam.id,
                                        newFiles,
                                      )
                                    }
                                    onRemove={(index) =>
                                      handleRemoveParamFile(selectedParam.id, index)
                                    }
                                    preparationType={null}
                                    sectionLabel="Other Files"
                                    isForPrep={false}
                                    isLocked={shouldDisableContent}
                                  />
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>

                        {isLocked && (
                          <BottomParameterActionBar
                            parameterId={selectedParam.id}
                          />
                        )}
                      </motion.div>
                    </AnimatePresence>
                  );
                })}

            </div>
          </div>

          <AnimatePresence>
            {showAnalystDialog && (
              <AnalystSelectionDialog
                isOpen={showAnalystDialog}
                onClose={() => {
                  setShowAnalystDialog(false);
                  setPendingParameter(null);
                }}
                analysts={analysts}
                onSelectAnalyst={handleAnalystSelected}
                lab={worksheetInfo?.sample.lab}
              />
            )}
          </AnimatePresence>
          <AnimatePresence>
            {showSubmitDialog && (
              <SubmitDialog
                isOpen={showSubmitDialog}
                isSubmitting={isSubmitting}
                onClose={() => setShowSubmitDialog(false)}
                onConfirm={handleSubmitForAnalysis}
                createdParametersCount={
                  addedParameters.filter(
                    (param) =>
                      (
                        parameterStatusPerParam[param.id] || "created"
                      ).toLowerCase() === "created",
                  ).length
                }
              />
            )}
          </AnimatePresence>
          <AnimatePresence>
            {showUnlockDialog && parameterToUnlock && (
              <UnlockParameterDialog
                isOpen={showUnlockDialog}
                isUnlocking={isUnlocking}
                parameterName={parameterToUnlock.parameterName!}
                parameterCode={parameterToUnlock.paraCode!}
                onClose={() => {
                  setShowUnlockDialog(false);
                  setParameterToUnlock(null);
                }}
                onConfirm={handleConfirmUnlock}
              />
            )}
          </AnimatePresence>

          <AnimatePresence>
            {showDeleteDialog && parameterToDelete && (
              <DeleteParameterDialog
                isOpen={showDeleteDialog}
                isDeleting={isDeleting}
                parameterName={parameterToDelete.parameterName!}
                parameterCode={parameterToDelete.paraCode!}
                parameterStatus={
                  parameterStatusPerParam[parameterToDelete.id] || "created"
                }
                onClose={() => {
                  setShowDeleteDialog(false);
                  setParameterToDelete(null);
                }}
                onConfirm={handleConfirmDelete}
              />
            )}
          </AnimatePresence>
          {/* Start Analysis Dialog */}
          <AnimatePresence>
            {showStartAnalysisDialog && parameterForAnalysis && (
              <StartAnalysisDialog
                isOpen={showStartAnalysisDialog}
                isStarting={isStartingAnalysis}
                parameterName={parameterForAnalysis.parameterName!}
                parameterCode={parameterForAnalysis.paraCode!}
                onClose={() => {
                  setShowStartAnalysisDialog(false);
                  setParameterForAnalysis(null);
                }}
                onConfirm={handleConfirmStartAnalysis}
              />
            )}
          </AnimatePresence>

          {/* Complete Analysis Dialog */}
          <AnimatePresence>
            {showCompleteAnalysisDialog && parameterForAnalysis && (
              <CompleteAnalysisDialog
                isOpen={showCompleteAnalysisDialog}
                isCompleting={isCompletingAnalysis}
                parameterName={parameterForAnalysis.parameterName!}
                parameterCode={parameterForAnalysis.paraCode!}
                onClose={() => {
                  setShowCompleteAnalysisDialog(false);
                  setParameterForAnalysis(null);
                }}
                onConfirm={handleConfirmCompleteAnalysis}
              />
            )}
          </AnimatePresence>
          <AnimatePresence>
            {showApproveDialog && parameterForApproval && (
              <ApproveParameterDialog
                isOpen={showApproveDialog}
                isApproving={isApproving}
                parameterName={parameterForApproval.parameterName!}
                parameterCode={parameterForApproval.paraCode!}
                onClose={() => {
                  setShowApproveDialog(false);
                  setParameterForApproval(null);
                }}
                onConfirm={handleConfirmApprove}
              />
            )}
          </AnimatePresence>

          <AnimatePresence>
            {showDisapproveDialog && parameterForApproval && (
              <DisapproveParameterDialog
                isOpen={showDisapproveDialog}
                isDisapproving={isDisapproving}
                parameterName={parameterForApproval.parameterName!}
                parameterCode={parameterForApproval.paraCode!}
                onClose={() => {
                  setShowDisapproveDialog(false);
                  setParameterForApproval(null);
                }}
                onConfirm={handleConfirmDisapprove}
              />
            )}
          </AnimatePresence>

          <AnimatePresence>
            {showRevisionDialog && parameterForApproval && (
              <RevisionRequestDialog
                isOpen={showRevisionDialog}
                isRequesting={isRequestingRevision}
                parameterName={parameterForApproval.parameterName!}
                parameterCode={parameterForApproval.paraCode!}
                onClose={() => {
                  setShowRevisionDialog(false);
                  setParameterForApproval(null);
                  setRevisionComments("");
                }}
                onConfirm={(comments: string) => handleConfirmRevision(comments)}
              />
            )}
          </AnimatePresence>

          {/* QA Revision Dialog */}
          <AnimatePresence>
            {showQARevisionDialog && parameterForApproval && (
              <RevisionRequestDialog
                isOpen={showQARevisionDialog}
                isRequesting={isQARequestingRevision}
                parameterName={parameterForApproval.parameterName!}
                parameterCode={parameterForApproval.paraCode!}
                onClose={() => {
                  setShowQARevisionDialog(false);
                  setParameterForApproval(null);
                  setQARevisionComments("");
                }}
                onConfirm={(comments: string) =>
                  handleConfirmQARevision(comments)
                }
              />
            )}
          </AnimatePresence>

          <AnimatePresence>
            {showSubmitForQADialog && (
              <SubmitForQAReviewDialog
                isOpen={showSubmitForQADialog}
                isSubmitting={isSubmittingForQA}
                worksheetId={worksheetId}
                totalParameters={addedParameters.length}
                onClose={() => setShowSubmitForQADialog(false)}
                onConfirm={handleSubmitForQA}
              />
            )}
          </AnimatePresence>

          <AnimatePresence>
            {showApproveWorksheetDialog && (
              <ApproveWorksheetDialog
                isOpen={showApproveWorksheetDialog}
                isApproving={isApprovingWorksheet}
                worksheetId={worksheetId}
                totalParameters={addedParameters.length}
                onClose={() => setShowApproveWorksheetDialog(false)}
                onConfirm={handleApproveWorksheet}
              />
            )}
          </AnimatePresence>

          {/* Complete Preparation Dialog */}
          <AnimatePresence>
            {showCompletePreparationDialog && paramForPreparation && (
              <CompletePreparationDialog
                isOpen={showCompletePreparationDialog}
                isCompleting={isCompletingPreparation}
                parameterName={paramForPreparation.parameterName!}
                parameterCode={paramForPreparation.paraCode!}
                onClose={() => {
                  setShowCompletePreparationDialog(false);
                  setParamForPreparation(null);
                }}
                onConfirm={handleConfirmCompletePreparation}
              />
            )}
          </AnimatePresence>

          {/* Unlock Preparation Dialog */}
          <AnimatePresence>
            {showUnlockPreparationDialog && paramForPreparation && (
              <UnlockPreparationDialog
                isOpen={showUnlockPreparationDialog}
                isUnlocking={isUnlockingPreparation}
                parameterName={paramForPreparation.parameterName!}
                parameterCode={paramForPreparation.paraCode!}
                onClose={() => {
                  setShowUnlockPreparationDialog(false);
                  setParamForPreparation(null);
                }}
                onConfirm={handleConfirmUnlockPreparation}
              />
            )}
          </AnimatePresence>

          {/* Group Complete Preparation Dialog */}
          <AnimatePresence>
            {showCompleteGroupPrepDialog && groupPrepDialogParam && (
              <CompletePreparationDialog
                isOpen={showCompleteGroupPrepDialog}
                isCompleting={isCompletingGroupPrep}
                parameterName={groupPrepDialogParam.parameterName!}
                parameterCode={groupPrepDialogParam.paraCode!}
                onClose={() => {
                  setShowCompleteGroupPrepDialog(false);
                  setGroupPrepDialogParam(null);
                  setGroupPrepDialogKey("");
                }}
                onConfirm={handleConfirmCompleteGroupPrep}
              />
            )}
          </AnimatePresence>

          {/* Group Unlock Preparation Dialog */}
          <AnimatePresence>
            {showUnlockGroupPrepDialog && groupPrepDialogParam && (
              <UnlockPreparationDialog
                isOpen={showUnlockGroupPrepDialog}
                isUnlocking={isUnlockingGroupPrep}
                parameterName={groupPrepDialogParam.parameterName!}
                parameterCode={groupPrepDialogParam.paraCode!}
                onClose={() => {
                  setShowUnlockGroupPrepDialog(false);
                  setGroupPrepDialogParam(null);
                  setGroupPrepDialogKey("");
                }}
                onConfirm={handleConfirmUnlockGroupPrep}
              />
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
};

export default MetalWorksheet;