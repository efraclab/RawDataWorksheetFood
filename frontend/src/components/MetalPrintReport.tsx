import React, { useEffect, useState } from "react";
import type { SampleData } from "../models/SampleData";
import type { WorksheetDetail } from "../models/WorksheetDetail";
import type { Analyst } from "../models/Analyst";
import type { Instrument } from "../preparation_models/Instrument";
import type { Chemical } from "../preparation_models/Chemical";
import type { Standard } from "../preparation_models/Standard";
import type { ParameterDetail } from "../models/ParameterDetail";

// ── Signature footer types ────────────────────────────────────────────────────
interface FileSignatureData {
  analyzedByName: string | null;
  analysisCompletionDate: string | null;
  approvedByReviewerName: string | null;
  approvedAtReviewer: string | null;
}

function parseDateSafe(raw: string): Date | null {
  const s = raw.trim();
  if (/^\d{4}[-/]/.test(s)) {
    const d = new Date(s.replace(" ", "T"));
    return isNaN(d.getTime()) ? null : d;
  }
  const m = s.match(/^(\d{1,2})[-/](\d{1,2})[-/](\d{4})(?:[T ](\d{2}:\d{2}(?::\d{2})?))?/);
  if (m) {
    const iso = `${m[3]}-${m[2].padStart(2, "0")}-${m[1].padStart(2, "0")}`;
    const d = new Date(m[4] ? `${iso}T${m[4]}` : `${iso}T00:00:00`);
    return isNaN(d.getTime()) ? null : d;
  }
  const d = new Date(s);
  return isNaN(d.getTime()) ? null : d;
}

function formatFileDt(raw: string | null | undefined): string {
  if (!raw) return "N/A";
  const d = parseDateSafe(String(raw));
  if (!d) return String(raw).trim() || "N/A";
  const DD = String(d.getDate()).padStart(2, "0");
  const MM = String(d.getMonth() + 1).padStart(2, "0");
  const HH = String(d.getHours()).padStart(2, "0");
  const mi = String(d.getMinutes()).padStart(2, "0");
  const SS = String(d.getSeconds()).padStart(2, "0");
  return `${DD}/${MM}/${d.getFullYear()} ${HH}:${mi}:${SS}`;
}

// ── Reusable signature footer ─────────────────────────────────────────────────
const FileSignatureFooter: React.FC<{ sig: FileSignatureData }> = ({ sig }) => (
  <table
    className="file-signature-footer"
    style={{
      width: "100%", borderCollapse: "collapse", fontSize: "10px",
      marginTop: "4px", border: "1px solid black",
      breakInside: "avoid", pageBreakInside: "avoid",
    }}
  >
    <tbody>
      <tr>
        <td style={{ padding: "4px 8px", border: "1px solid black", width: "25%" }}>Analyzed By</td>
        <td style={{ padding: "4px 8px", border: "1px solid black", width: "25%", fontWeight: "bold" }}>
          {sig.analyzedByName || "---"}
        </td>
        <td style={{ padding: "4px 8px", border: "1px solid black", width: "25%" }}>Analyzed On</td>
        <td style={{ padding: "4px 8px", border: "1px solid black", width: "25%", fontWeight: "bold" }}>
          {formatFileDt(sig.analysisCompletionDate)}
        </td>
      </tr>
      <tr>
        <td style={{ padding: "4px 8px", border: "1px solid black" }}>Reviewed By</td>
        <td style={{ padding: "4px 8px", border: "1px solid black", fontWeight: "bold" }}>
          {sig.approvedByReviewerName || "---"}
        </td>
        <td style={{ padding: "4px 8px", border: "1px solid black" }}>Reviewed On</td>
        <td style={{ padding: "4px 8px", border: "1px solid black", fontWeight: "bold" }}>
          {formatFileDt(sig.approvedAtReviewer)}
        </td>
      </tr>
    </tbody>
  </table>
);

// ── PdfPageRenderer ───────────────────────────────────────────────────────────
const PdfPageRenderer: React.FC<{
  base64: string;
  fileName: string;
  signature: FileSignatureData;
}> = ({ base64, fileName, signature }) => {
  const [pages, setPages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setPages([]);
    setLoading(true);
    setError(null);

    const renderPdf = async () => {
      try {
        if (!(window as any).pdfjsLib) {
          await new Promise<void>((resolve, reject) => {
            const script = document.createElement("script");
            script.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
            script.onload = () => resolve();
            script.onerror = () => reject(new Error("Failed to load PDF.js"));
            document.head.appendChild(script);
          });
          (window as any).pdfjsLib.GlobalWorkerOptions.workerSrc =
            "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
        }

        const pdfjsLib = (window as any).pdfjsLib;
        const binary = atob(base64);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);

        const pdf = await pdfjsLib.getDocument({ data: bytes }).promise;
        if (cancelled) return;

        const dataUrls: string[] = [];
        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
          if (cancelled) return;
          const page = await pdf.getPage(pageNum);
          const viewport = page.getViewport({ scale: 1.2 });
          const canvas = document.createElement("canvas");
          canvas.width = viewport.width;
          canvas.height = viewport.height;
          const ctx = canvas.getContext("2d")!;
          await page.render({ canvasContext: ctx, viewport }).promise;
          if (cancelled) return;
          dataUrls.push(canvas.toDataURL("image/png"));
        }

        if (!cancelled) { setPages(dataUrls); setLoading(false); }
      } catch (err: any) {
        if (!cancelled) { setError(err.message || "Failed to render PDF"); setLoading(false); }
      }
    };

    renderPdf();
    return () => { cancelled = true; };
  }, [base64]);

  if (error) {
    return (
      <div className="p-3 text-xs text-red-600 text-center border border-red-300 bg-red-50">
        Could not render {fileName}: {error}
      </div>
    );
  }
  if (loading) {
    return <div className="p-4 text-xs text-gray-500 text-center">Loading {fileName}…</div>;
  }

  return (
    <>
      {pages.map((dataUrl, idx) => (
        <div
          key={idx}
          className="pdf-page-with-sig"
          style={{ breakInside: "avoid", pageBreakInside: "avoid", marginBottom: "4px" }}
        >
          <img
            src={dataUrl}
            alt={`${fileName} page ${idx + 1}`}
            style={{ width: "100%", display: "block", maxHeight: "87vh", objectFit: "contain" }}
          />
          <FileSignatureFooter sig={signature} />
        </div>
      ))}
    </>
  );
};

// ── Props ─────────────────────────────────────────────────────────────────────
interface MetalPrintReportProps {
  worksheetInfo: WorksheetDetail;
  sampleData: SampleData;
  analysts: Analyst[];
  instruments: Instrument[];
  chemicals: Chemical[];
  standards: Standard[];
  onClose: () => void;
}

// ── Calculation type label map ────────────────────────────────────────────────
const CALC_TYPE_LABELS: Record<string, string> = {
  icpms_food:     "ICP-MS (Food)",
  icpoes_food:    "ICP-OES (Food)",
  icpms_water:    "ICP-MS (Water)",
  icpoes_water:   "ICP-OES (Water)",
  aas_water:      "AAS (Water)",
  icpms_ich_q3d:  "ICP-MS (ICH-Q3D)",
  ors:            "ORS",
  anofer:         "Anofer",
  zpto_shampoo:   "ZPTO Shampoo",
  sodium_lactate: "Sodium Lactate",
  lithosun300:    "Lithosun 300",
  lithosun400:    "Lithosun 400",
  meropenam:      "Meropenam",
  sfgc:           "SFGC",
  talc:           "Talc",
};

const PREP_TYPE_LABELS: Record<string, string> = {
  ...CALC_TYPE_LABELS,
  blank: "Blank Preparation",
};

// ── Helper: trim trailing zeros (up to 4 dp) ─────────────────────────────────
const trimZeros = (v: string | number | null | undefined): string => {
  if (v === null || v === undefined || v === "") return "—";
  const n = typeof v === "number" ? v : parseFloat(String(v));
  return Number.isFinite(n) ? parseFloat(n.toFixed(4)).toString() : "—";
};

// ── Main component ────────────────────────────────────────────────────────────
const MetalPrintReport: React.FC<MetalPrintReportProps> = ({
  worksheetInfo,
  sampleData,
  instruments,
  chemicals,
  standards,
}) => {
  // ── Helpers ────────────────────────────────────────────────────────────────
  const safeJSONParse = (data: any, fallback: any = []) => {
    if (!data) return fallback;
    if (typeof data === "string") {
      try { return JSON.parse(data); } catch { return fallback; }
    }
    return data;
  };

  const calcTypeLabel = (type: string | null | undefined): string =>
    type ? (CALC_TYPE_LABELS[type.toLowerCase()] ?? type) : "";

  const prepTypeLabel = (type: string | null | undefined): string =>
    type ? (PREP_TYPE_LABELS[type.toLowerCase()] ?? type) : "";

  // ── Signature section ──────────────────────────────────────────────────────
  const renderSignatureSection = (param: ParameterDetail) => (
    <div className="mb-2">
      <table
        className="file-signature-footer"
        style={{
          width: "100%", borderCollapse: "collapse", fontSize: "10px",
          marginTop: "4px", border: "1px solid black",
          breakInside: "avoid", pageBreakInside: "avoid",
        }}
      >
        <tbody>
          <tr>
            <td style={{ padding: "4px 8px", border: "1px solid black" }}>Analyzed By</td>
            <td style={{ padding: "4px 8px", border: "1px solid black", fontWeight: "bold" }}>
              {(param as any).analyzedByName || "---"}
            </td>
            <td style={{ padding: "4px 8px", border: "1px solid black" }}>Analyzed On</td>
            <td style={{ padding: "4px 8px", border: "1px solid black", fontWeight: "bold" }}>
              {formatFileDt((param as any).analysisCompletionDate)}
            </td>
          </tr>
          <tr>
            <td style={{ padding: "4px 8px", border: "1px solid black" }}>Reviewed By</td>
            <td style={{ padding: "4px 8px", border: "1px solid black", fontWeight: "bold" }}>
              {(param as any).approvedByReviewerName || "---"}
            </td>
            <td style={{ padding: "4px 8px", border: "1px solid black" }}>Reviewed On</td>
            <td style={{ padding: "4px 8px", border: "1px solid black", fontWeight: "bold" }}>
              {formatFileDt((param as any).approvedAtReviewer)}
            </td>
          </tr>
          <tr>
            <td style={{ padding: "4px 8px", border: "1px solid black" }}>Approved By</td>
            <td style={{ padding: "4px 8px", border: "1px solid black", fontWeight: "bold" }}>
              {(param as any).approvedByQAName || "---"}
            </td>
            <td style={{ padding: "4px 8px", border: "1px solid black" }}>Approved On</td>
            <td style={{ padding: "4px 8px", border: "1px solid black", fontWeight: "bold" }}>
              {formatFileDt((param as any).approvedAtQA)}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );

  // ── Header & sample info ───────────────────────────────────────────────────
  const renderHeaderAndSampleSection = (
    param: any,
    paramIdx: number,
  ) => (
    <div className="keep-together">
      <div className="mb-2">
        <table className="w-full table-fixed border border-black">
          <tbody>
            <tr className="bg-gray-200">
              <td className="border border-black px-3 py-2 text-sm font-bold text-center" colSpan={4}>
                EDWARD FOOD RESEARCH &amp; ANALYSIS CENTRE LTD
              </td>
            </tr>
            <tr>
              <td className="border border-black px-3 py-2 font-bold text-sm text-center" colSpan={4}>
                Raw Data Worksheet
              </td>
            </tr>
            <tr>
              <td className="border border-black px-3 py-2 text-center font-bold text-md" colSpan={4}>
                Annexure-{paramIdx + 1}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="mb-2">
        <table className="w-full table-fixed border border-black text-sm">
          <colgroup>
            <col style={{ width: "30%" }} />
            <col style={{ width: "30%" }} />
            <col style={{ width: "20%" }} />
            <col style={{ width: "20%" }} />
          </colgroup>
          <tbody>
            <tr>
              <td className="border border-black px-3 py-2" colSpan={2}>
                Registration No: {worksheetInfo.sample.registrationNo}
              </td>
              <td className="border border-black px-3 py-2" colSpan={2}>
                Date of Receipt: {sampleData.recieptDate || ""}
              </td>
            </tr>
            <tr>
              <td className="border border-black px-3 py-2" colSpan={2}>
                Sample Name: {worksheetInfo.sample.sampleName}
              </td>
              <td className="border border-black px-3 py-2" colSpan={2}>
                Due Date: {sampleData.tatDate || ""}
              </td>
            </tr>
            <tr>
              <td className="border border-black px-3 py-2" colSpan={2}>
                Analysis Started On: {sampleData.analysisStartDate || ""}
              </td>
              <td className="border border-black px-3 py-2" colSpan={2}>
                Analyzed On: {sampleData.analysisCompletionDate || ""}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="mb-2">
        <table className="w-full border border-black text-sm">
          <tbody>
            <tr className="border-b border-black">
              <td className="w-10 px-4 py-3 border-r border-black text-center">1</td>
              <td className="w-1/3 px-4 py-3 border-r border-black">
                Sample Particulars (All relevant information received with sample to be entered)
              </td>
              <td className="px-3 py-3">{worksheetInfo.sample.sampleName || "---"}</td>
            </tr>
            <tr className="border-b border-black">
              <td className="w-10 px-4 py-3 border-r border-black text-center">2</td>
              <td className="w-1/3 px-4 py-3 border-r border-black">
                Test(s) required (all tests and condition to be entered)
              </td>
              <td className="px-3 py-3">{param.parameterName}</td>
            </tr>
            <tr className="border-b border-black">
              <td className="w-10 px-4 py-3 border-r border-black text-center">3</td>
              <td className="w-1/3 px-4 py-3 border-r border-black">
                Method(s) of Analysis / testing
              </td>
              <td className="px-3 py-3">{param.methodName}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );

  // ── Metal prep steps table ─────────────────────────────────────────────────
  // Steps for metal: Weighing, 1st–4th Dilution, Filtration
  const renderMetalPrepStepsTable = (steps: any[]) => {
    if (!steps || steps.length === 0) return null;

    const validSteps = steps.filter(
      (s: any) => s.value1 || s.value2 || s.unit1 || s.unit2,
    );
    if (validSteps.length === 0) return null;

    const fmtVal = (val: any, unit?: any) => {
      const v = val ?? "";
      const u = unit ?? "";
      return v ? `<strong>${v}${u ? " " + u : ""}</strong>` : "___";
    };

    const rows = validSteps.map((step: any) => {
      let text = "";
      switch (step.name) {
        case "Weighing":
          text = `Weigh accurately ${fmtVal(step.value1, step.unit1)} of sample${step.logBookID ? ` (Log Book ID: ${step.logBookID})` : ""}.`;
          break;
        case "1st Dilution":
          text = `Make up to ${fmtVal(step.value1, step.unit1 || "mL")} (V1) with diluent.`;
          break;
        case "2nd Dilution":
          text = `Take ${fmtVal(step.value1, step.unit1 || "mL")} (V2) and make up to ${fmtVal(step.value2, step.unit2 || "mL")} (V3) with diluent.`;
          break;
        case "3rd Dilution":
          text = `Take ${fmtVal(step.value1, step.unit1 || "mL")} (V4) and make up to ${fmtVal(step.value2, step.unit2 || "mL")} (V5) with diluent.`;
          break;
        case "4th Dilution":
          text = `Take ${fmtVal(step.value1, step.unit1 || "mL")} (V6) and make up to ${fmtVal(step.value2, step.unit2 || "mL")} (V7) with diluent.`;
          break;
        case "Filtration":
          text = step.value1
            ? `Filter through ${fmtVal(step.value1, step.unit1 || "µm")} filter.`
            : "Filter the solution.";
          break;
        default:
          text = `${step.name}: ${fmtVal(step.value1, step.unit1)}${step.value2 ? ` / ${fmtVal(step.value2, step.unit2)}` : ""}`;
      }
      return { stepName: step.name, text };
    });

    return (
      <table className="w-full border border-black text-sm">
        <tbody>
          {rows.map((row, idx) => (
            <tr key={idx} className="border-b border-black last:border-b-0">
              <td className="w-1/3 px-3 py-2 font-bold bg-gray-100 border-r border-black">
                {row.stepName}
              </td>
              <td className="px-3 py-2">
                <span dangerouslySetInnerHTML={{ __html: row.text }} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  // ── Calculation derivation for metal ──────────────────────────────────────
  // All metal calcs share the same formula structure:
  //   (Sample Conc − Blank Conc) × V1 × DF1 × DF2 × DF3 × factor
  //   ─────────────────────────────────────────────────────────────
  //   SW × denominator constant
  // We read the stored calc data and render a fraction-bar derivation.
  const renderMetalCalcDerivation = (calcData: any, calcType: string) => {
    const fmt = (v: any, u?: any) => {
      const val = trimZeros(v);
      if (val === "—") return "—";
      return u ? `${val} ${u}` : val;
    };

    const sampleConc = calcData.instrumentConcentrationSample;
    const sampleUnit = calcData.instrumentConcentrationSampleUnit || "";
    const blankConc  = calcData.instrumentConcentrationBlank;
    const blankUnit  = calcData.instrumentConcentrationBlankUnit || "";

    // Volumes from prep
    const v1 = calcData.v1; const v1u = calcData.v1Unit || "mL";
    const v2 = calcData.v2; const v2u = calcData.v2Unit || "mL";
    const v3 = calcData.v3; const v3u = calcData.v3Unit || "mL";
    const v4 = calcData.v4; const v4u = calcData.v4Unit || "mL";
    const v5 = calcData.v5; const v5u = calcData.v5Unit || "mL";
    const v6 = calcData.v6; const v6u = calcData.v6Unit || "mL";
    const v7 = calcData.v7; const v7u = calcData.v7Unit || "mL";

    const hasV = (v: any) => v !== null && v !== undefined && v !== "";
    const v1Active = hasV(v1);
    const df1Active = hasV(v2) && hasV(v3);
    const df2Active = hasV(v4) && hasV(v5);
    const df3Active = hasV(v6) && hasV(v7);

    const df1 = df1Active
      ? trimZeros(parseFloat(v3) / parseFloat(v2))
      : null;
    const df2 = df2Active
      ? trimZeros(parseFloat(v5) / parseFloat(v4))
      : null;
    const df3 = df3Active
      ? trimZeros(parseFloat(v7) / parseFloat(v6))
      : null;

    // Extra fields (ORS, Meropenam, etc.)
    const sw  = calcData.sw;
    const swU = calcData.swUnit || "mg";

    // Build symbolic numerator parts
    const numSymParts: string[] = ["(Sample Conc. − Blank Conc.)"];
    if (v1Active) numSymParts.push("× V1");
    if (df1Active) numSymParts.push("× DF1 (V3/V2)");
    if (df2Active) numSymParts.push("× DF2 (V5/V4)");
    if (df3Active) numSymParts.push("× DF3 (V7/V6)");

    // Build value numerator parts
    const sConc = fmt(sampleConc, sampleUnit);
    const bConc = hasV(blankConc) && parseFloat(blankConc) !== 0
      ? fmt(blankConc, blankUnit)
      : "0";
    const numValParts: string[] = [`(${sConc} − ${bConc})`];
    if (v1Active) numValParts.push(`× ${fmt(v1, v1u)}`);
    if (df1Active && df1) numValParts.push(`× ${df1}`);
    if (df2Active && df2) numValParts.push(`× ${df2}`);
    if (df3Active && df3) numValParts.push(`× ${df3}`);

    // Denominator depends on calc type
    let denomSym = "SW (mg)";
    let denomVal = fmt(sw, swU);
    let denomConst = "";

    const t = calcType.toLowerCase();

    if (t.includes("food") || t.includes("ich_q3d")) {
      // mg/Kg: × 1000 × 1000 / (SW_mg × 10000)
      numSymParts.push("× 1000 × 1000");
      numValParts.push("× 1,000,000");
      denomSym = "SW (mg) × 10000";
      denomConst = "× 10000";
    } else if (t.includes("water") || t === "aas_water") {
      // mg/L: × 1000 / (V1_mL)
      numSymParts.push("× 1000");
      numValParts.push("× 1000");
      denomSym = "V1 (mL)";
      denomVal = v1Active ? fmt(v1, v1u) : "V1";
      denomConst = "";
    } else if (t === "meropenam") {
      // % LC: × 1000 × 1000 / (SW_mg × LC_mg × 10000)
      const lc  = calcData.labelClaim;
      const lcU = calcData.labelClaimUnit || "mg";
      numSymParts.push("× 1000 × 1000");
      numValParts.push("× 1,000,000");
      denomSym = "SW (mg) × Label Claim (mg) × 10000";
      denomVal = `${fmt(sw, swU)} × ${fmt(lc, lcU)} × 10000`;
      denomConst = "";
    } else if (t === "sfgc" || t === "talc") {
      // %: × 1000 / (SW_g × 10000)  [SW already in g for SFGC]
      numSymParts.push("× 1000");
      numValParts.push("× 1000");
      denomSym = "SW (g) × 10000";
      denomConst = "× 10000";
    } else if (t === "ors") {
      const mw  = calcData.molecularWeight;
      const mwU = calcData.molecularWeightUnit || "g/mol";
      const sw2 = calcData.sachetWeightAvg;
      const sw2U = calcData.sachetWeightAvgUnit || "g";
      numSymParts.push("× MW × 1000");
      numValParts.push(`× ${fmt(mw, mwU)} × 1000`);
      denomSym = "SW (mg) × Label Claim × 10000";
      const lc  = calcData.labelClaim;
      denomVal = `${fmt(sw, swU)} × ${fmt(sw2, sw2U)} × ${fmt(lc)} × 10000`;
      denomConst = "";
    } else {
      // Generic: pass-through
      numSymParts.push("× factor");
      numValParts.push("× factor");
    }

    const numSym = numSymParts.join(" ");
    const denSym = denomSym + (denomConst ? " " + denomConst : "");
    const numVal = numValParts.join(" ");
    const denVal = denomVal + (denomConst ? ` ${denomConst}` : "");

    const result = calcData.calculationResult;
    const resultUnit = calcData.calculationResultUnit || "";
    const limitMin = calcData.acceptanceLimitMin;
    const limitMax = calcData.acceptanceLimitMax;

    const passFail = (() => {
      if (!result) return null;
      const v = parseFloat(result);
      if (!Number.isFinite(v)) return null;
      const min = limitMin ? parseFloat(limitMin) : null;
      const max = limitMax ? parseFloat(limitMax) : null;
      if (min === null && max === null) return null;
      return (min === null || v >= min) && (max === null || v <= max) ? "pass" : "fail";
    })();

    return (
      <div className="bg-gray-100 border border-black p-3 mb-3 calc-block" style={{ breakInside: "avoid", pageBreakInside: "avoid" }}>
        {/* DF legend */}
        {(df1Active || df2Active || df3Active) && (
          <p className="text-xs text-gray-500 mb-2">
            {df1Active && "DF1 = V3/V2"}
            {df1Active && (df2Active || df3Active) && "  |  "}
            {df2Active && "DF2 = V5/V4"}
            {df2Active && df3Active && "  |  "}
            {df3Active && "DF3 = V7/V6"}
          </p>
        )}

        {/* Symbolic formula */}
        <p className="font-bold text-sm mb-2">Formula:</p>
        <div className="formula-display my-2" style={{ breakInside: "avoid" }}>
          <div className="flex items-center justify-center gap-3">
            <div className="formula-fraction text-center">
              <div className="numerator px-4 py-1 border-b-2 border-black text-xs font-mono">
                {numSym}
              </div>
              <div className="denominator px-4 py-1 text-xs font-mono">{denSym}</div>
            </div>
            <span className="text-sm font-bold">= {resultUnit}</span>
          </div>
        </div>

        {/* Value derivation */}
        <p className="font-bold text-sm mb-2 mt-3">Derivation:</p>
        <div className="formula-display my-2" style={{ breakInside: "avoid" }}>
          <div className="flex items-center justify-center gap-3">
            <div className="formula-fraction text-center">
              <div className="numerator px-4 py-1 border-b-2 border-black text-xs font-mono">
                {numVal}
              </div>
              <div className="denominator px-4 py-1 text-xs font-mono">{denVal}</div>
            </div>
            {result && (
              <span className="text-sm font-bold">
                = {trimZeros(result)} {resultUnit}
              </span>
            )}
          </div>
        </div>

        {/* Acceptance limit + pass/fail */}
        {(limitMin || limitMax) && (
          <div className="mt-3 flex items-center gap-4 flex-wrap">
            <p className="text-xs font-semibold text-gray-700">
              Acceptance Limit:&nbsp;
              {limitMin && limitMax
                ? `${trimZeros(limitMin)} – ${trimZeros(limitMax)} ${resultUnit}`
                : limitMin
                ? `≥ ${trimZeros(limitMin)} ${resultUnit}`
                : `≤ ${trimZeros(limitMax)} ${resultUnit}`}
            </p>
            {passFail && (
              <span
                className={`px-2 py-0.5 text-xs font-bold rounded border ${
                  passFail === "pass"
                    ? "bg-green-100 text-green-800 border-green-400"
                    : "bg-red-100 text-red-800 border-red-400"
                }`}
              >
                {passFail === "pass" ? "PASS" : "FAIL"}
              </span>
            )}
          </div>
        )}
      </div>
    );
  };

  // ── ORS-specific extra fields ──────────────────────────────────────────────
  const renderORSExtraFields = (calcData: any) => {
    const rows: { label: string; value: string }[] = [];
    if (calcData.sachetWeightAvg)
      rows.push({ label: "Sachet Weight (Avg)", value: `${trimZeros(calcData.sachetWeightAvg)} ${calcData.sachetWeightAvgUnit || "g"}` });
    if (calcData.molecularWeight)
      rows.push({ label: "Molecular Weight", value: `${trimZeros(calcData.molecularWeight)} ${calcData.molecularWeightUnit || "g/mol"}` });
    if (calcData.labelClaim)
      rows.push({ label: "Label Claim", value: `${trimZeros(calcData.labelClaim)} ${calcData.labelClaimUnit || ""}` });
    if (rows.length === 0) return null;
    return (
      <table className="w-full border border-black text-sm mb-2">
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-b border-black last:border-b-0">
              <td className="w-1/3 px-3 py-1.5 font-bold bg-gray-50 border-r border-black">{r.label}</td>
              <td className="px-3 py-1.5">{r.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  // ── Meropenam-specific extra fields ───────────────────────────────────────
  const renderMeropenamExtraFields = (calcData: any) => {
    if (!calcData.labelClaim) return null;
    return (
      <table className="w-full border border-black text-sm mb-2">
        <tbody>
          <tr>
            <td className="w-1/3 px-3 py-1.5 font-bold bg-gray-50 border-r border-black">Label Claim</td>
            <td className="px-3 py-1.5">
              {trimZeros(calcData.labelClaim)} {calcData.labelClaimUnit || "mg"}
            </td>
          </tr>
        </tbody>
      </table>
    );
  };

  // ── Render a single calculation ────────────────────────────────────────────
  const renderCalculation = (calc: any, idx: number, samplePreps: any[] = [], standardPreps: any[] = []) => {
    const calcData = safeJSONParse(calc.data, {});
    const calcType = calc.calculationType || "";
    const label = calcType ? `${calc.label} (${calcTypeLabel(calcType)})` : calc.label;

    // Find matched sample prep by label, then derive paired standard prep by index
    const matchedSamplePrepIdx = calcData.selectedSamplePreparationLabel
      ? samplePreps.findIndex((p: any) => p.label === calcData.selectedSamplePreparationLabel)
      : -1;
    const matchedSamplePrep = matchedSamplePrepIdx !== -1 ? samplePreps[matchedSamplePrepIdx] : null;
    const matchedStandardPrep = matchedSamplePrepIdx !== -1 ? (standardPreps[matchedSamplePrepIdx] ?? null) : null;

    return (
      <div key={idx} className="mb-4">
        <p className="font-bold text-sm mb-2">{label}</p>

        {/* Instrument concentration summary */}
        <table className="w-full border border-black text-sm mb-2">
          <tbody>
            {calcData.instrumentConcentrationSample !== undefined && calcData.instrumentConcentrationSample !== "" && (
              <tr className="border-b border-black">
                <td className="w-1/3 px-3 py-1.5 font-bold bg-gray-50 border-r border-black">
                  Sample Concentration
                </td>
                <td className="px-3 py-1.5">
                  {trimZeros(calcData.instrumentConcentrationSample)}{" "}
                  {calcData.instrumentConcentrationSampleUnit || ""}
                </td>
              </tr>
            )}
            {calcData.instrumentConcentrationBlank !== undefined && calcData.instrumentConcentrationBlank !== "" && calcData.instrumentConcentrationBlank !== "0" && (
              <tr className="border-b border-black">
                <td className="w-1/3 px-3 py-1.5 font-bold bg-gray-50 border-r border-black">
                  Blank Concentration
                </td>
                <td className="px-3 py-1.5">
                  {trimZeros(calcData.instrumentConcentrationBlank)}{" "}
                  {calcData.instrumentConcentrationBlankUnit || ""}
                </td>
              </tr>
            )}
            {matchedSamplePrep && (
              <tr className="border-t border-black">
                <td className="w-1/3 px-3 py-1.5 font-bold bg-gray-50 border-r border-black">
                  Selected Sample Preparation
                </td>
                <td className="px-3 py-1.5">{matchedSamplePrep.label}</td>
              </tr>
            )}
            {matchedStandardPrep && (
              <tr className="border-t border-black">
                <td className="w-1/3 px-3 py-1.5 font-bold bg-gray-50 border-r border-black">
                  Selected Standard Preparation
                </td>
                <td className="px-3 py-1.5">{matchedStandardPrep.label}</td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Type-specific extra fields */}
        {calcType === "ors" && renderORSExtraFields(calcData)}
        {calcType === "meropenam" && renderMeropenamExtraFields(calcData)}

        {/* Formula + derivation */}
        {calcData.instrumentConcentrationSample && renderMetalCalcDerivation(calcData, calcType)}
      </div>
    );
  };

  // ── Main return ────────────────────────────────────────────────────────────
  return (
    <>
      <style>
        {`
          @media print {
            @page {
              size: A4;
              margin: 6mm 8mm 6mm 8mm;
            }
            .no-print { display: none !important; }
            html, body {
              margin: 0 !important; padding: 0 !important;
              background: white; height: auto !important;
              min-height: 0 !important; overflow: visible !important;
            }
            .print-container {
              width: 100%; max-width: none; margin: 0; padding: 0;
              box-shadow: none; height: auto !important;
            }
            * { break-inside: auto !important; break-before: auto !important; break-after: auto !important; }
            .page-break-before { break-before: page; page-break-before: always; }
            tr { break-inside: avoid !important; }
            .calc-block { break-inside: avoid !important; page-break-inside: avoid !important; }
            .formula-display { break-inside: avoid !important; page-break-inside: avoid !important; }
            table { border-collapse: collapse; }
            thead { display: table-header-group; }
            .pdf-page-with-sig { break-inside: avoid !important; page-break-inside: avoid !important; }
            .file-signature-footer { break-inside: avoid !important; page-break-inside: avoid !important; }
            .pdf-page-with-sig img { max-height: calc(100vh - 60px) !important; width: 100% !important; object-fit: contain !important; }
          }
          @media screen {
            .print-container {
              max-width: 210mm;
              margin: 24px auto 24px auto;
              padding: 6mm 15mm 4mm 15mm;
              background: white;
              box-shadow: 0 0 10px rgba(0,0,0,0.1);
            }
            .attached-file-preview-border { border: 1px solid #ccc; margin-bottom: 8px; }
          }
          @media print {
            .attached-file-preview-border { border: none !important; margin-bottom: 0 !important; }
            .page-break-before { break-before: page !important; page-break-before: always !important; }
          }
          .formula-fraction { display: inline-block; vertical-align: middle; }
          .numerator, .denominator { min-width: 200px; text-align: center; }
          table { border-collapse: collapse; width: 100%; }
          table td { border: 1px solid black; padding: 8px; }
        `}
      </style>

      <div className="print-container">
        {worksheetInfo.parameters.map((param: any, paramIdx: number) => {
          // Filter reference data by ids attached to this parameter
          const filteredInstruments = instruments.filter((inst) =>
            param.instrumentIds?.includes(inst.id),
          );
          const filteredChemicals = chemicals.filter((chem) =>
            param.chemicalIds?.includes(chem.slno),
          );
          const filteredStandards = standards.filter((std) =>
            param.standardIds?.includes(std.serialNo),
          );

          const allPreparations: any[] = safeJSONParse(param.preparations, []);
          const standardPreps = allPreparations.filter(
            (p) => p.preparationCategory === "standard",
          );
          const samplePreps = allPreparations.filter(
            (p) => p.preparationCategory === "sample",
          );
          const blankPreps = allPreparations.filter(
            (p) => p.preparationCategory === "blank",
          );
          const calculations: any[] = Array.isArray(param.calculations) ? param.calculations : [];

          return (
            <div key={paramIdx} className={paramIdx > 0 ? "page-break-before" : ""} style={paramIdx > 0 ? { breakBefore: "page", pageBreakBefore: "always" } : undefined}>
              {renderHeaderAndSampleSection(param, paramIdx)}

              <div className="mt-4">
                {/* Parameter heading */}
                <div className="keep-together">
                  <h3 className="text-lg bg-gray-200 font-bold border border-black mb-3 px-3 py-2 uppercase">
                    Parameter: {param.parameterName} ({param.paraCode})
                  </h3>
                </div>

                {/* ── Instruments ──────────────────────────────────── */}
                {filteredInstruments.length > 0 && (
                  <div className="section-container mb-4">
                    <h4 className="text-md uppercase font-bold mb-2">Instruments Used</h4>
                    <table className="w-full border border-black text-sm">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="border border-black px-3 py-2 text-left font-bold">Instrument Id</th>
                          <th className="border border-black px-3 py-2 text-left font-bold">Instrument Name</th>
                          <th className="border border-black px-3 py-2 text-left font-bold">Calibration Done On</th>
                          <th className="border border-black px-3 py-2 text-left font-bold">Calibration Due On</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredInstruments.map((inst, idx) => (
                          <tr key={idx}>
                            <td className="border border-black px-3 py-2">{inst.instrumentTag}</td>
                            <td className="border border-black px-3 py-2">{inst.name}</td>
                            <td className="border border-black px-3 py-2">
                              {inst.calibrationDoneDate
                                ? new Date(inst.calibrationDoneDate).toLocaleDateString("en-GB")
                                : "N/A"}
                            </td>
                            <td className="border border-black px-3 py-2">
                              {inst.calibrationDueDate
                                ? new Date(inst.calibrationDueDate).toLocaleDateString("en-GB")
                                : "N/A"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* ── Chemicals ─────────────────────────────────────── */}
                {filteredChemicals.length > 0 && (
                  <div className="section-container mb-4">
                    <h4 className="text-md uppercase font-bold mb-2">Chemicals/Reagents Used</h4>
                    <table className="w-full border border-black text-sm">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="border border-black px-3 py-2 text-left font-bold">Chemical Name</th>
                          <th className="border border-black px-3 py-2 text-left font-bold">Code</th>
                          <th className="border border-black px-3 py-2 text-left font-bold">Make</th>
                          <th className="border border-black px-3 py-2 text-left font-bold">Batch No.</th>
                          <th className="border border-black px-3 py-2 text-left font-bold">Validity</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredChemicals.map((chem, idx) => (
                          <tr key={idx}>
                            <td className="border border-black px-3 py-2">{chem.name}</td>
                            <td className="border border-black px-3 py-2">{chem.code || "N/A"}</td>
                            <td className="border border-black px-3 py-2">{chem.make || "N/A"}</td>
                            <td className="border border-black px-3 py-2">{chem.batchNo || "N/A"}</td>
                            <td className="border border-black px-3 py-2">
                              {chem.exp_Date
                                ? new Date(chem.exp_Date).toLocaleDateString("en-GB")
                                : "N/A"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* ── Standards ─────────────────────────────────────── */}
                {filteredStandards.length > 0 && (
                  <div className="section-container mb-4">
                    <h4 className="text-md uppercase font-bold mb-2">Standards Used</h4>
                    <table className="w-full border border-black text-sm">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="border border-black px-3 py-2 text-left font-bold">Standard Name</th>
                          <th className="border border-black px-3 py-2 text-left font-bold">Purity</th>
                          <th className="border border-black px-3 py-2 text-left font-bold">Make</th>
                          <th className="border border-black px-3 py-2 text-left font-bold">Batch No.</th>
                          <th className="border border-black px-3 py-2 text-left font-bold">Validity</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredStandards.map((std, idx) => (
                          <tr key={idx}>
                            <td className="border border-black px-3 py-2">{std.name}</td>
                            <td className="border border-black px-3 py-2">{std.purity || "N/A"}</td>
                            <td className="border border-black px-3 py-2">{std.make || "N/A"}</td>
                            <td className="border border-black px-3 py-2">{std.batchNo || "N/A"}</td>
                            <td className="border border-black px-3 py-2">
                              {std.validity
                                ? new Date(std.validity).toLocaleDateString("en-GB")
                                : "N/A"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* ── Standard Preparations ─────────────────────────── */}
                {(() => {
                  const renderable = standardPreps
                    .map((prep: any) => ({
                      prep,
                      table: renderMetalPrepStepsTable(safeJSONParse(prep.steps, [])),
                    }))
                    .filter(({ table }) => table !== null);
                  if (renderable.length === 0) return null;
                  return (
                    <div className="mb-6">
                      <h4 className="text-md uppercase font-bold mb-2">Standard Preparations</h4>
                      {renderable.map(({ prep, table }, idx) => (
                        <div key={idx} className="section-container mb-3">
                          <p className="font-bold text-sm mb-1">
                            {prep.label}
                            {prep.preparationType ? ` (${prepTypeLabel(prep.preparationType)})` : ""}
                          </p>
                          {table}
                        </div>
                      ))}
                    </div>
                  );
                })()}

                {/* ── Sample Preparations ───────────────────────────── */}
                {(() => {
                  const renderable = samplePreps
                    .map((prep: any) => ({
                      prep,
                      table: renderMetalPrepStepsTable(safeJSONParse(prep.steps, [])),
                    }))
                    .filter(({ table }) => table !== null);
                  if (renderable.length === 0) return null;
                  return (
                    <div className="mb-6">
                      <h4 className="text-md uppercase font-bold mb-2">Sample Preparations</h4>
                      {renderable.map(({ prep, table }, idx) => (
                        <div key={idx} className="section-container mb-3">
                          <p className="font-bold text-sm mb-1">
                            {prep.label}
                            {prep.preparationType ? ` (${prepTypeLabel(prep.preparationType)})` : ""}
                          </p>
                          {table}
                        </div>
                      ))}
                    </div>
                  );
                })()}

                {/* ── Blank Preparations ────────────────────────────── */}
                {blankPreps.length > 0 && (
                  <div className="mb-6">
                    <h4 className="text-md uppercase font-bold mb-2">Blank Preparations</h4>
                    {blankPreps.map((prep: any, idx: number) => (
                      <div key={idx} className="section-container mb-3">
                        <p className="font-bold text-sm mb-1">{prep.label}</p>
                        {prep.content && (
                          <div
                            className="text-sm"
                            style={{ fontFamily: "inherit", fontSize: "0.875rem", lineHeight: "1.6" }}
                            dangerouslySetInnerHTML={{ __html: prep.content }}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* ── Calculations ──────────────────────────────────── */}
                {calculations.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-md uppercase font-bold mb-2">Calculations</h4>
                    {calculations.map((calc: any, idx: number) =>
                      renderCalculation(calc, idx, samplePreps, standardPreps),
                    )}
                  </div>
                )}

                {/* ── Signature + attached files ────────────────────── */}
                <div>
                  {renderSignatureSection(param)}
                </div>

                {/* ── Attached Files ────────────────────────────────── */}
                {param.files && Array.isArray(param.files) &&
                  param.files.filter((f: any) => f.fileDataBase64).length > 0 && (
                    <div className="section-container mb-4">
                      <h4 className="text-md uppercase font-bold mb-2 no-print">Attached Files</h4>
                      {(() => {
                        const fileSig: FileSignatureData = {
                          analyzedByName: (param as any).analyzedByName || null,
                          analysisCompletionDate: (param as any).analysisCompletionDate || null,
                          approvedByReviewerName: (param as any).approvedByReviewerName || null,
                          approvedAtReviewer: (param as any).approvedAtReviewer || null,
                        };
                        return param.files
                          .filter((f: any) => f.fileDataBase64)
                          .map((f: any, fi: number) => {
                            const isPdf =
                              f.fileName?.toLowerCase().endsWith(".pdf") ||
                              f.fileDataBase64?.startsWith("JVBER");
                            const isImage = /\.(png|jpg|jpeg|gif|bmp|webp)$/i.test(f.fileName || "");
                            return (
                              <div key={fi}>
                                {isPdf ? (
                                  <PdfPageRenderer
                                    base64={f.fileDataBase64}
                                    fileName={f.fileName || `file_${fi + 1}.pdf`}
                                    signature={fileSig}
                                  />
                                ) : isImage ? (
                                  <div
                                    className="pdf-page-with-sig"
                                    style={{ breakInside: "avoid", pageBreakInside: "avoid" }}
                                  >
                                    <img
                                      src={`data:image/${f.fileName?.split(".").pop()?.toLowerCase() || "jpeg"};base64,${f.fileDataBase64}`}
                                      alt={f.fileName}
                                      className="max-w-full block"
                                      style={{ objectFit: "contain" }}
                                    />
                                    <FileSignatureFooter sig={fileSig} />
                                  </div>
                                ) : (
                                  <p className="text-xs text-gray-500 text-center py-2">
                                    {f.fileName} (preview not available)
                                  </p>
                                )}
                              </div>
                            );
                          });
                      })()}
                    </div>
                  )}

              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default MetalPrintReport;