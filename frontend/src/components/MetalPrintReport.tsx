import React, { useEffect, useState } from "react";
import type { SampleData } from "../models/SampleData";
import type { WorksheetDetail } from "../models/WorksheetDetail";
import type { Analyst } from "../models/Analyst";
import type { Instrument } from "../preparation_models/Instrument";
import type { Chemical } from "../preparation_models/Chemical";
import type { Standard } from "../preparation_models/Standard";
import type { ParameterDetail } from "../models/ParameterDetail";
import companyLogo from "../assets/EFRAC-QIMA-logo.png";

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
  return `${DD}/${MM}/${d.getFullYear()}`;
}

// ── Reusable signature footer ─────────────────────────────────────────────────
const FileSignatureFooter: React.FC<{ sig: FileSignatureData }> = ({ sig }) => (
  <div className="signature-footer-block" style={{
    display: "block",
    width: "100%",
    pageBreakInside: "avoid",
    breakInside: "avoid",
  }}>
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
    <div
      style={{
        marginTop: "3px",
        fontSize: "10px",
        fontStyle: "italic",
        pageBreakInside: "avoid",
        breakInside: "avoid",
      }}
    >
      This document has been digitally signed; no further signature is required.
    </div>
  </div>
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
        // Each page + its footer must print together on the same page
        <div
          key={idx}
          className="pdf-page-with-sig"
          style={{
            breakInside: "avoid",
            pageBreakInside: "avoid",
            marginBottom: "4px",
            display: "flex",
            flexDirection: "column",
            height: "100vh",
          }}
        >
          {/* Image area flex-grows to fill whatever space is left; footer sits right after it */}
          <div style={{ flex: 1, minHeight: 0, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
            <img
              src={dataUrl}
              alt={`${fileName} page ${idx + 1}`}
              style={{ maxWidth: "100%", maxHeight: "100%", display: "block", objectFit: "contain" }}
            />
          </div>

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
  icpms: "ICP-MS",
  icpoes: "ICP-OES",
  icpms_water: "ICP-MS (Water)",
  icpoes_water: "ICP-OES (Water)",
  aas_water: "AAS (Water)",
  icpms_ich_q3d: "ICP-MS (ICH-Q3D)",
  ors: "ORS",
  anofer: "Anofer",
  zpto_shampoo: "ZPTO Shampoo",
  sodium_lactate: "Sodium Lactate",
  lithosun300: "Lithosun 300",
  lithosun400: "Lithosun 400",
  meropenam: "Meropenam",
  sfgc: "SFGC",
  talc: "Talc",
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
    <div className="mb-2"
      style={{ breakInside: "avoid", pageBreakInside: "avoid" }}>
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
      <p style={{ fontSize: "10px", fontStyle: "italic", margin: "2px 0 0 0" }}>
        This document has been digitally signed; no further signature is required.
      </p>
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
              <td
                className="border border-black px-3 py-2 text-sm font-bold text-center"
                colSpan={3}
              >
                EDWARD FOOD RESEARCH & ANALYSIS CENTRE LTD
              </td>
              <td
                className="border border-black px-2 py-1 text-center"
                style={{ width: "100px", borderLeft: "none" }}
              >
                <img
                  src={companyLogo}
                  alt="Company Logo"
                  style={{
                    height: "44px",
                    width: "90px",
                    objectFit: "contain",
                    display: "inline-block",
                  }}
                />
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
  // Renders the symbolic formula + numeric derivation for every calc type.
  // All values are converted to the canonical unit BEFORE display so the
  // derivation matches exactly what the source components compute.
  const renderMetalCalcDerivation = (calcData: any, calcType: string) => {

    // ── Unit converters (mirrors source components) ─────────────────────────
    const toMl = (v: any, u?: string): number => {
      const n = parseFloat(v ?? "");
      if (!isFinite(n)) return NaN;
      const unit = (u || "mL").trim().toLowerCase();
      if (unit === "l") return n * 1000;
      if (unit === "μl" || unit === "ul") return n / 1000;
      return n; // mL
    };
    const toPpb = (v: any, u?: string): number => {
      const n = parseFloat(v ?? "");
      if (!isFinite(n)) return NaN;
      const unit = (u || "ppb").trim().toLowerCase();
      if (unit === "ppm" || unit === "mg/l") return n * 1000;
      return n; // ppb / μg/L
    };
    const toPpm = (v: any, u?: string): number => {
      const n = parseFloat(v ?? "");
      if (!isFinite(n)) return NaN;
      const unit = (u || "ppm").trim().toLowerCase();
      if (unit === "ppb" || unit === "μg/l") return n / 1000;
      return n; // ppm / mg/L
    };
    const toG = (v: any, u?: string): number => {
      const n = parseFloat(v ?? "");
      if (!isFinite(n)) return NaN;
      const unit = (u || "g").trim().toLowerCase();
      if (unit === "mg") return n / 1000;
      if (unit === "kg") return n * 1000;
      if (unit === "μg" || unit === "mcg") return n / 1_000_000;
      return n; // g
    };
    const toMg = (v: any, u?: string): number => {
      const n = parseFloat(v ?? "");
      if (!isFinite(n)) return NaN;
      const unit = (u || "mg").trim().toLowerCase();
      if (unit === "g") return n * 1000;
      if (unit === "kg") return n * 1_000_000;
      if (unit === "μg" || unit === "mcg") return n / 1000;
      return n; // mg
    };
    const toGmol = (v: any, u?: string): number => {
      const n = parseFloat(v ?? "");
      if (!isFinite(n)) return NaN;
      const unit = (u || "g/mol").trim().toLowerCase();
      if (unit === "kg/mol") return n * 1000;
      return n; // g/mol
    };

    const fmtN = (n: number): string =>
      isFinite(n) ? parseFloat(n.toFixed(4)).toString() : "—";
    const hasV = (v: any) => v !== null && v !== undefined && v !== "";
    // swPresent: true only when sw has a non-null, non-empty, non-zero value
    const swIsPresent = (v: any) => hasV(v) && parseFloat(v) !== 0;

    // ── Raw stored values ────────────────────────────────────────────────────
    const sRaw = calcData.instrumentConcentrationSample;
    const sU = calcData.instrumentConcentrationSampleUnit || "";
    const bRaw = calcData.instrumentConcentrationBlank;
    const bU = calcData.instrumentConcentrationBlankUnit || "";

    const v1r = calcData.v1; const v1u = calcData.v1Unit || "mL";
    const v2r = calcData.v2; const v2u = calcData.v2Unit || "mL";
    const v3r = calcData.v3; const v3u = calcData.v3Unit || "mL";
    const v4r = calcData.v4; const v4u = calcData.v4Unit || "mL";
    const v5r = calcData.v5; const v5u = calcData.v5Unit || "mL";
    const v6r = calcData.v6; const v6u = calcData.v6Unit || "mL";
    const v7r = calcData.v7; const v7u = calcData.v7Unit || "mL";

    const swRaw = calcData.sw; const swU = calcData.swUnit || "mg";

    const t = calcType.toLowerCase();

    // ── Determine canonical concentration unit for display ────────────────────
    // All types (icpms, icpoes, icpms_water, icpoes_water, aas_water,
    // icpms_ich_q3d, and all others) display concentration in ppm.
    // Raw values stored as ppb are divided by 1000 to convert to ppm.
    const usesPpb = ["icpms", "icpoes", "icpms_water", "icpoes_water",
      "aas_water", "icpms_ich_q3d"].includes(t);

    // Always display in ppm: if stored as ppb, convert ÷1000; otherwise keep as ppm
    const sCanon = usesPpb ? toPpb(sRaw, sU) / 1000 : toPpm(sRaw, sU);
    const bCanon = usesPpb ? toPpb(bRaw, bU) / 1000 : toPpm(bRaw, bU);
    const concUnit = "ppm";

    // ── Volume conversions (all → mL) ────────────────────────────────────────
    const v1Ml = toMl(v1r, v1u);
    const v2Ml = toMl(v2r, v2u);
    const v3Ml = toMl(v3r, v3u);
    const v4Ml = toMl(v4r, v4u);
    const v5Ml = toMl(v5r, v5u);
    const v6Ml = toMl(v6r, v6u);
    const v7Ml = toMl(v7r, v7u);

    const v1Active = hasV(v1r);
    const df1Active = hasV(v2r) && hasV(v3r);
    const df2Active = hasV(v4r) && hasV(v5r);
    const df3Active = hasV(v6r) && hasV(v7r);

    const df1 = (df1Active && isFinite(v2Ml) && isFinite(v3Ml) && v2Ml !== 0) ? v3Ml / v2Ml : NaN;
    const df2 = (df2Active && isFinite(v4Ml) && isFinite(v5Ml) && v4Ml !== 0) ? v5Ml / v4Ml : NaN;
    const df3 = (df3Active && isFinite(v6Ml) && isFinite(v7Ml) && v6Ml !== 0) ? v7Ml / v6Ml : NaN;

    const result = calcData.calculationResult;
    const resultUnit = calcData.calculationResultUnit || "";
    const limitMin = calcData.acceptanceLimitMin;
    const limitMax = calcData.acceptanceLimitMax;

    // ── Build formula parts per calc type ────────────────────────────────────
    // numSym / denSym  = symbolic formula
    // numVal / denVal  = numeric derivation (canonical units)
    let numSym: string[] = [];
    let denSym = "";
    let numVal: string[] = [];
    let denVal = "";

    // Concentration net term (shared by all types)
    const sFmt = isFinite(sCanon) ? `${fmtN(sCanon)} ${concUnit}` : `${sRaw || "—"} ${sU}`;
    const bFmt = (() => {
      if (!hasV(bRaw) || parseFloat(bRaw) === 0) return `0 ${concUnit}`;
      const bc = isFinite(bCanon) ? `${fmtN(bCanon)} ${concUnit}` : `${bRaw} ${bU}`;
      return bc;
    })();
    numSym.push(`(Sample Conc. − Blank Conc.)`);
    numVal.push(`(${sFmt} − ${bFmt})`);

    // V1 (all types except Lithosun 300/400 which use V1 directly anyway)
    if (v1Active && !["lithosun300", "lithosun400"].includes(t)) {
      numSym.push(`× V1`);
      numVal.push(`× ${isFinite(v1Ml) ? fmtN(v1Ml) + " mL" : fmtN(parseFloat(v1r)) + " " + v1u}`);
    }

    // DF1 / DF2 / DF3 (most types)
    if (!["lithosun300", "lithosun400", "zpto_shampoo"].includes(t)) {
      if (df1Active) { numSym.push("× DF1"); numVal.push(`× ${isFinite(df1) ? fmtN(df1) : "—"}`); }
      if (df2Active) { numSym.push("× DF2"); numVal.push(`× ${isFinite(df2) ? fmtN(df2) : "—"}`); }
      if (df3Active) { numSym.push("× DF3"); numVal.push(`× ${isFinite(df3) ? fmtN(df3) : "—"}`); }
    }

    // ── Type-specific numerator additions & denominator ──────────────────────

    if (["icpms", "icpoes", "icpms_ich_q3d"].includes(t)) {
      // Result (mg/Kg) = (Sample_ppb − Blank_ppb) × V1_mL × DF1×DF2×DF3
      //                  ─────────────────────────────────────────────────
      //                                   SW_mg
      const swMg = toMg(swRaw, swU);
      numSym.push("");  // no extra numerator factor
      denSym = "SW (mg)";
      denVal = swIsPresent(swRaw)
        ? `${isFinite(swMg) ? fmtN(swMg) : fmtN(parseFloat(swRaw))} mg`
        : "—";

    } else if (["icpms_water", "icpoes_water", "aas_water"].includes(t)) {
      // Result (mg/L) = (Sample_ppm − Blank_ppm) × V1_mL × DF1×DF2×DF3
      // (no denominator — ppb→ppm conversion already applied to concentrations)
      denSym = "";
      denVal = "";

    } else if (t === "anofer") {
      // % of LC = (Sample_ppm − Blank_ppm) × V1_mL × DF1×DF2 × AvgWeight_mg × 100
      //           ──────────────────────────────────────────────────────────────────
      //                             SW_mg × LabelClaim_mg
      const avgW = calcData.avgWeight; const avgU2 = calcData.avgWeightUnit || "mg";
      const lc = calcData.labelClaim; const lcU2 = calcData.labelClaimUnit || "mg";
      const swMg = toMg(swRaw, swU);
      const avgMg = toMg(avgW, avgU2);
      const lcMg = toMg(lc, lcU2);
      numSym.push("× Avg. Weight (mg) × 100");
      numVal.push(`× ${isFinite(avgMg) ? fmtN(avgMg) : fmtN(parseFloat(avgW))} mg × 100`);
      denSym = "SW (mg) × Label Claim (mg)";
      const swPartAnofer = swIsPresent(swRaw) ? `${isFinite(swMg) ? fmtN(swMg) : fmtN(parseFloat(swRaw))} mg` : null;
      const lcPartAnofer = `${isFinite(lcMg) ? fmtN(lcMg) : fmtN(parseFloat(lc))} mg`;
      denVal = swPartAnofer ? `${swPartAnofer} × ${lcPartAnofer}` : lcPartAnofer;

    } else if (t === "ors") {
      // % of LC = (Sample_ppm − Blank_ppm) × V1_mL × DF1×DF2×DF3 × SachetWeight_g × 100 × 1000
      //           ─────────────────────────────────────────────────────────────────────────────────
      //                     SW_g × 1,000,000 × MolecularWeight (g/mol) × LabelClaim_g
      const sachet = calcData.sachetWeightAvg; const sachetU = calcData.sachetWeightAvgUnit || "g";
      const mw = calcData.molecularWeight; const mwU2 = calcData.molecularWeightUnit || "g/mol";
      const lc = calcData.labelClaim; const lcU2 = calcData.labelClaimUnit || "g";
      const swG = toG(swRaw, swU);
      const sachetG = toG(sachet, sachetU);
      const mwGmol = toGmol(mw, mwU2);
      const lcG = toG(lc, lcU2);
      numSym.push("× Sachet Weight (g) × 100 × 1000");
      numVal.push(`× ${isFinite(sachetG) ? fmtN(sachetG) : fmtN(parseFloat(sachet))} g × 100 × 1000`);
      denSym = "SW (g) × 1,000,000 × MW (g/mol) × Label Claim (g)";
      const swPartOrs = swIsPresent(swRaw) ? `${isFinite(swG) ? fmtN(swG) : fmtN(parseFloat(swRaw))} g` : null;
      const orsRest = `1,000,000 × ${isFinite(mwGmol) ? fmtN(mwGmol) : fmtN(parseFloat(mw))} g/mol × ${isFinite(lcG) ? fmtN(lcG) : fmtN(parseFloat(lc))} g`;
      denVal = swPartOrs ? `${swPartOrs} × ${orsRest}` : orsRest;

    } else if (t === "zpto_shampoo") {
      // % of LC = (Sample_ppm − Blank_ppm) × V1_mL × DF1 × Sp. Gravity × MW₁ × 100
      //           ────────────────────────────────────────────────────────────────────
      //                         SW_g × 10000 × MW₂ × Label Claim
      const sg = calcData.specificGravity;
      const mw1 = calcData.molecularWeight1;
      const mw2 = calcData.molecularWeight2;
      const lc = calcData.labelClaim;
      const swG = toG(swRaw, swU);
      // ZPTO has only one DF = V3/V2
      const dfZp = (isFinite(v2Ml) && isFinite(v3Ml) && v2Ml !== 0) ? v3Ml / v2Ml : NaN;
      numSym.push("× DF1 × Specific Gravity × MW₁ × 100");
      numVal.push(`× ${isFinite(dfZp) ? fmtN(dfZp) : "—"} × ${fmtN(parseFloat(sg))} × ${fmtN(parseFloat(mw1))} × 100`);
      denSym = "SW (g) × 10000 × MW₂ × Label Claim";
      const swPartZp = swIsPresent(swRaw) ? `${isFinite(swG) ? fmtN(swG) : fmtN(parseFloat(swRaw))} g` : null;
      const zpRest = `10000 × ${fmtN(parseFloat(mw2))} × ${fmtN(parseFloat(lc))}`;
      denVal = swPartZp ? `${swPartZp} × ${zpRest}` : zpRest;

    } else if (t === "sodium_lactate") {
      // Content (%) = (Sample_ppm − Blank_ppm) × V1_mL × DF1×DF2×DF3
      //               ─────────────────────────────────────────────────
      //                                  10000
      denSym = "10000";
      denVal = "10000";

    } else if (t === "talc") {
      // Content (%) = (Sample_ppm − Blank_ppm) × V1_mL × DF1×DF2×DF3
      //               ─────────────────────────────────────────────────
      //                               SW_g × 10000
      const swG = toMg(swRaw, swU);
      denSym = "SW (mg) × 10000";
      denVal = swIsPresent(swRaw)
        ? `${isFinite(swG) ? fmtN(swG) : fmtN(parseFloat(swRaw))} mg × 10000`
        : "10000";

    } else if (t === "sfgc") {
      // Content (%) = (Sample_ppm − Blank_ppm) × V1_mL × DF1×DF2×DF3 × 1000
      //               ──────────────────────────────────────────────────────────
      //                                   SW_mg × 10000
      const swMg = toMg(swRaw, swU);
      numSym.push("× 1000");
      numVal.push("× 1000");
      denSym = "SW (mg) × 10000";
      denVal = swIsPresent(swRaw)
        ? `${isFinite(swMg) ? fmtN(swMg) : fmtN(parseFloat(swRaw))} mg × 10000`
        : "10000";

    } else if (t === "meropenam") {
      // % of LC = (Sample_ppm − Blank_ppm) × V1_mL × DF1×DF2×DF3 × 1000 × 1000
      //           ──────────────────────────────────────────────────────────────────
      //                         SW_mg × 10000 × Label Claim_mg
      const lc = calcData.labelClaim; const lcU2 = calcData.labelClaimUnit || "mg";
      const swMg = toMg(swRaw, swU);
      const lcMg = toMg(lc, lcU2);
      numSym.push("× 1000 × 1000");
      numVal.push("× 1000 × 1000");
      denSym = "SW (mg) × 10000 × Label Claim (mg)";
      const swPartMero = swIsPresent(swRaw) ? `${isFinite(swMg) ? fmtN(swMg) : fmtN(parseFloat(swRaw))} mg` : null;
      const meroRest = `10000 × ${isFinite(lcMg) ? fmtN(lcMg) : fmtN(parseFloat(lc))} mg`;
      denVal = swPartMero ? `${swPartMero} × ${meroRest}` : meroRest;

    } else if (t === "lithosun300" || t === "lithosun400") {
      // % of LC = (Sample_ppm − Blank_ppm) × V1_mL × V3_mL × 1000
      //           ─────────────────────────────────────────────────────
      //               Label Claim_mg × V2_mL × CF × 10000
      const lc = calcData.labelClaim; const lcU2 = calcData.labelClaimUnit || "mg";
      const cf = calcData.conversionFactor ?? calcData.cf;
      const lcMg = toMg(lc, lcU2);
      // For Lithosun, V1 and V3 are in numerator directly (not DF ratio)
      numSym = [`(Sample Conc. − Blank Conc.) × V1 (mL) × V3 (mL) × 1000`];
      numVal = [`(${sFmt} − ${bFmt}) × ${isFinite(v1Ml) ? fmtN(v1Ml) : fmtN(parseFloat(v1r))} mL × ${isFinite(v3Ml) ? fmtN(v3Ml) : fmtN(parseFloat(v3r))} mL × 1000`];
      denSym = "Label Claim (mg) × V2 (mL) × CF × 10000";
      denVal = `${isFinite(lcMg) ? fmtN(lcMg) : fmtN(parseFloat(lc))} mg × ${isFinite(v2Ml) ? fmtN(v2Ml) : fmtN(parseFloat(v2r))} mL × ${fmtN(parseFloat(cf))} × 10000`;

      // NOTE: this branch is only used for the symbolic formula display.
      // Per-tablet derivations are rendered by renderLithosun300Calculation /
      // renderLithosun400Calculation below.

    } else {
      // Fallback generic
      denSym = "—";
      denVal = "—";
    }

    // Remove empty string entries pushed by icpms/icpoes/icpms_ich_q3d
    const filteredNumSym = numSym.filter(s => s !== "");
    const filteredNumVal = numVal.filter(s => s !== "");

    const numSymStr = filteredNumSym.join(" ");
    const numValStr = filteredNumVal.join(" ");

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
      <div className="bg-gray-100 border border-black p-3 mb-3 calc-block">

        {/* DF legend */}
        {(df1Active || df2Active || df3Active) && !["lithosun300", "lithosun400", "zpto_shampoo"].includes(t) && (
          <p className="text-xs text-gray-500 mb-2">
            {df1Active && "DF1 = V3/V2"}
            {df1Active && (df2Active || df3Active) && "  |  "}
            {df2Active && "DF2 = V5/V4"}
            {df2Active && df3Active && "  |  "}
            {df3Active && "DF3 = V7/V6"}
          </p>
        )}
        {t === "zpto_shampoo" && (df1Active) && (
          <p className="text-xs text-gray-500 mb-2">DF1 = V3/V2</p>
        )}

        {/* Symbolic formula */}
        <p className="font-bold text-sm mb-2">Formula:</p>
        <div className="formula-display my-2" style={{ breakInside: "avoid" }}>
          <div className="flex items-center justify-center gap-3">
            {denSym ? (
              /* Fraction layout — numerator over denominator */
              <>
                <div className="formula-fraction text-center">
                  <div className="numerator px-4 py-1 border-b-2 border-black text-xs font-mono">
                    {numSymStr}
                  </div>
                  <div className="denominator px-4 py-1 text-xs font-mono">{denSym}</div>
                </div>
                <span className="text-sm font-bold">{resultUnit}</span>
              </>
            ) : (
              /* Inline layout — expression = unit on one line */
              <div style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                <span className="text-xs font-mono">{numSymStr}</span>
                <span className="text-sm font-bold">&nbsp;{resultUnit}</span>
              </div>
            )}
          </div>
        </div>

        {/* Value derivation */}
        <p className="font-bold text-sm mb-2 mt-3">Derivation:</p>
        <div className="formula-display my-2" style={{ breakInside: "avoid" }}>
          <div className="flex items-center justify-center gap-3">
            {denVal ? (
              /* Fraction layout */
              <>
                <div className="formula-fraction text-center">
                  <div className="numerator px-4 py-1 border-b-2 border-black text-xs font-mono">
                    {numValStr}
                  </div>
                  <div className="denominator px-4 py-1 text-xs font-mono">{denVal}</div>
                </div>
                {result && (
                  <span className="text-sm font-bold">
                    = {trimZeros(result)} {resultUnit}
                  </span>
                )}
              </>
            ) : (
              /* Inline layout — derivation = result on one line */
              <div style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                <span className="text-xs font-mono">{numValStr}</span>
                {result && (
                  <span className="text-sm font-bold">
                    =&nbsp;{trimZeros(result)}&nbsp;{resultUnit}
                  </span>
                )}
              </div>
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
                className={`px-2 py-0.5 text-xs font-bold rounded border ${passFail === "pass"
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

  // ── Meropenam-specific extra fields ───────────────────────────────────────

  // ── Shared Lithosun formula symbolic block ─────────────────────────────────
  const renderLithosunFormulaSymbolic = () => (
    <div className="formula-display my-2" style={{ breakInside: "avoid" }}>
      <p className="font-bold text-sm mb-2">Formula :</p>
      <div className="flex items-center justify-center gap-3">
        <div className="formula-fraction text-center">
          <div className="numerator px-4 py-1 border-b-2 border-black text-xs font-mono">
            (Sample Conc. − Blank Conc.) × V1 (mL) × V3 (mL) × 1000
          </div>
          <div className="denominator px-4 py-1 text-xs font-mono">
            Label Claim (mg) × V2 (mL) × Conversion Factor × 10000
          </div>
        </div>
        <span className="text-sm font-bold">% of LC</span>
      </div>
    </div>
  );

  // ── Helper: render one per-tablet derivation row ───────────────────────────
  const renderTabletDerivation = (
    tabletNum: number,
    samplePpm: number | null,
    blankPpm: number,
    v1Ml: number,
    v2Ml: number,
    v3Ml: number,
    cf: number,
    lcMg: number,
    result: string | number | null | undefined,
  ) => {
    const fmtN = (n: number) => (isFinite(n) ? parseFloat(n.toFixed(4)).toString() : "—");
    const num = samplePpm !== null
      ? `(${fmtN(samplePpm)} ppm − ${fmtN(blankPpm)} ppm) × ${fmtN(v1Ml)} mL × ${fmtN(v3Ml)} mL × 1000`
      : "—";
    const den = `${fmtN(lcMg)} mg × ${fmtN(v2Ml)} mL × ${fmtN(cf)} × 10000`;
    return (
      <div key={tabletNum} className="bg-gray-100 border border-black p-3 mb-2 calc-block" style={{ breakInside: "avoid", pageBreakInside: "avoid" }}>
        <p className="font-bold text-xs mb-1">Derivation (Tablet {tabletNum}) :</p>
        <div className="formula-display my-1" style={{ breakInside: "avoid" }}>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <div className="formula-fraction text-center">
              <div className="numerator px-4 py-1 border-b-2 border-black text-xs font-mono">{num}</div>
              <div className="denominator px-4 py-1 text-xs font-mono">{den}</div>
            </div>
            {result !== null && result !== undefined && result !== "" && (
              <span className="text-sm font-bold">= {trimZeros(result)} % of LC</span>
            )}
          </div>
        </div>
      </div>
    );
  };

  // ── Lithosun 300: single time point, 6 tablets ────────────────────────────
  const renderLithosun300Calculation = (calc: any, idx: number, samplePreps: any[] = [] = []) => {
    const calcData = safeJSONParse(calc.data, {});
    const label = `${calc.label} (Lithosun 300)`;

    const matchedSamplePrepIdx = calcData.selectedSamplePreparationLabel
      ? samplePreps.findIndex((p: any) => p.label === calcData.selectedSamplePreparationLabel)
      : -1;
    const matchedSamplePrep = matchedSamplePrepIdx !== -1 ? samplePreps[matchedSamplePrepIdx] : null;

    const _toMl = (v: any, u?: string) => { const n = parseFloat(v ?? ""); if (!isFinite(n)) return NaN; const uu = (u || "mL").trim().toLowerCase(); if (uu === "l") return n * 1000; if (uu === "μl" || uu === "ul") return n / 1000; return n; };
    const _toMg = (v: any, u?: string) => { const n = parseFloat(v ?? ""); if (!isFinite(n)) return NaN; const uu = (u || "mg").trim().toLowerCase(); if (uu === "g") return n * 1000; if (uu === "kg") return n * 1e6; if (uu === "μg" || uu === "mcg") return n / 1000; return n; };
    const _toPpm = (v: any, u?: string) => { const n = parseFloat(v ?? ""); if (!isFinite(n)) return NaN; const uu = (u || "ppm").trim().toLowerCase(); if (uu === "ppb" || uu === "μg/l") return n / 1000; return n; };

    const v1Ml = _toMl(calcData.v1, calcData.v1Unit || "mL");
    const v2Ml = _toMl(calcData.v2, calcData.v2Unit || "mL");
    const v3Ml = _toMl(calcData.v3, calcData.v3Unit || "mL");
    const cf = parseFloat(calcData.conversionFactor ?? calcData.cf ?? "");
    const lcMg = _toMg(calcData.labelClaim, calcData.labelClaimUnit || "mg");
    const blankPpm = _toPpm(calcData.instrumentConcentrationBlank, calcData.instrumentConcentrationBlankUnit || "ppm");

    const TABLETS = [1, 2, 3, 4, 5, 6] as const;
    const tabletSamples = TABLETS.map(t => ({
      t,
      sampleRaw: calcData[`instrumentConcentrationSampleTablet${t}`] as string | null,
      result: calcData[`calculationResultTablet${t}`] as string | null,
    }));
    const hasAnyTabletData = tabletSamples.some(ts => ts.sampleRaw !== null && ts.sampleRaw !== undefined && ts.sampleRaw !== "");

    // Summary — computed from the 6 tablet result fields (these are saved; min/avg/max are not)
    const tabletNums: number[] = [1, 2, 3, 4, 5, 6]
      .map(t => parseFloat(calcData[`calculationResultTablet${t}`] ?? ""))
      .filter(n => isFinite(n));
    const summaryMin = tabletNums.length ? Math.min(...tabletNums) : null;
    const summaryAvg = tabletNums.length ? tabletNums.reduce((a, b) => a + b, 0) / tabletNums.length : null;
    const summaryMax = tabletNums.length ? Math.max(...tabletNums) : null;

    return (
      <div key={idx} className="mb-4">
        <p className="font-bold text-sm mb-2">{label}</p>

        {/* Parameter summary table */}
        <table className="w-full border border-black text-sm mb-2">
          <tbody>
            {matchedSamplePrep && (
              <tr className="border-b border-black">
                <td className="w-1/3 px-3 py-1.5 font-bold bg-gray-50 border-r border-black">Selected Sample Preparation</td>
                <td className="px-3 py-1.5">{matchedSamplePrep.label}</td>
              </tr>
            )}
            {calcData.instrumentConcentrationBlank !== undefined && calcData.instrumentConcentrationBlank !== "" && calcData.instrumentConcentrationBlank !== "0" && (
              <tr className="border-b border-black">
                <td className="w-1/3 px-3 py-1.5 font-bold bg-gray-50 border-r border-black">Blank Concentration</td>
                <td className="px-3 py-1.5">{trimZeros(calcData.instrumentConcentrationBlank)} {calcData.instrumentConcentrationBlankUnit || "ppm"}</td>
              </tr>
            )}
            {calcData.labelClaim && (
              <tr className="border-b border-black">
                <td className="w-1/3 px-3 py-1.5 font-bold bg-gray-50 border-r border-black">Label Claim</td>
                <td className="px-3 py-1.5">{trimZeros(calcData.labelClaim)} {calcData.labelClaimUnit || "mg"}</td>
              </tr>
            )}
            {calcData.conversionFactor && (
              <tr className="border-b border-black">
                <td className="w-1/3 px-3 py-1.5 font-bold bg-gray-50 border-r border-black">Conversion Factor</td>
                <td className="px-3 py-1.5">{trimZeros(calcData.conversionFactor)}</td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Per-tablet sample concentrations */}
        {hasAnyTabletData && (
          <table className="w-full border border-black text-sm mb-2">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-black px-3 py-2 text-left font-bold">Tablet</th>
                <th className="border border-black px-3 py-2 text-left font-bold">Sample Concentration</th>
                <th className="border border-black px-3 py-2 text-left font-bold">Calculation Result</th>
              </tr>
            </thead>
            <tbody>
              {tabletSamples.map(({ t, sampleRaw, result }) => (
                <tr key={t}>
                  <td className="border border-black px-3 py-1.5 font-bold">Tablet {t}</td>
                  <td className="border border-black px-3 py-1.5">
                    {sampleRaw ? `${trimZeros(sampleRaw)} ${calcData.instrumentConcentrationSampleUnit || "ppm"}` : "—"}
                  </td>
                  <td className="border border-black px-3 py-1.5">
                    {result ? `${trimZeros(result)} % of LC` : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Formula */}
        {renderLithosunFormulaSymbolic()}

        {/* Per-tablet derivations */}
        {hasAnyTabletData && tabletSamples.map(({ t, sampleRaw, result }) => {
          const samplePpm = _toPpm(sampleRaw, calcData.instrumentConcentrationSampleUnit || "ppm");
          return renderTabletDerivation(
            t, isFinite(samplePpm) ? samplePpm : null,
            isFinite(blankPpm) ? blankPpm : 0,
            isFinite(v1Ml) ? v1Ml : 1,
            isFinite(v2Ml) ? v2Ml : 1,
            isFinite(v3Ml) ? v3Ml : 1,
            isFinite(cf) ? cf : 1,
            isFinite(lcMg) ? lcMg : 1,
            result,
          );
        })}

        {/* Calculation Summary */}
        {summaryMin !== null && (
          <div className="mt-1 mb-4 calc-summary-group">
            <table className="w-full border border-black">
              <tbody>
                <tr className="bg-gray-100">
                  <td colSpan={3} className="p-3 border-b border-black">
                    <p className="font-bold text-sm">
                      Calculation Summary
                    </p>
                  </td>
                </tr>
                <tr>
                  <td className="text-center p-3 border-r border-black">
                    <p className="font-semibold text-xs">Minimum</p>
                    <p className="text-lg font-bold">{summaryMin !== null ? `${trimZeros(summaryMin)} % of LC` : "—"}</p>
                  </td>
                  <td className="text-center p-3 border-r border-black">
                    <p className="font-semibold text-xs">Average</p>
                    <p className="text-lg font-bold">{summaryAvg !== null ? `${trimZeros(summaryAvg)} % of LC` : "—"}</p>
                  </td>
                  <td className="text-center p-3">
                    <p className="font-semibold text-xs">Maximum</p>
                    <p className="text-lg font-bold">{summaryMax !== null ? `${trimZeros(summaryMax)} % of LC` : "—"}</p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  };

  // ── Lithosun 400: multiple time points × 6 tablets ────────────────────────
  const renderLithosun400Calculation = (calc: any, idx: number, samplePreps: any[] = [] = []) => {
    const calcData = safeJSONParse(calc.data, {});
    const label = `${calc.label} (Lithosun 400)`;

    const matchedSamplePrepIdx = calcData.selectedSamplePreparationLabel
      ? samplePreps.findIndex((p: any) => p.label === calcData.selectedSamplePreparationLabel)
      : -1;
    const matchedSamplePrep = matchedSamplePrepIdx !== -1 ? samplePreps[matchedSamplePrepIdx] : null;

    const _toMl = (v: any, u?: string) => { const n = parseFloat(v ?? ""); if (!isFinite(n)) return NaN; const uu = (u || "mL").trim().toLowerCase(); if (uu === "l") return n * 1000; if (uu === "μl" || uu === "ul") return n / 1000; return n; };
    const _toMg = (v: any, u?: string) => { const n = parseFloat(v ?? ""); if (!isFinite(n)) return NaN; const uu = (u || "mg").trim().toLowerCase(); if (uu === "g") return n * 1000; if (uu === "kg") return n * 1e6; if (uu === "μg" || uu === "mcg") return n / 1000; return n; };
    const _toPpm = (v: any, u?: string) => { const n = parseFloat(v ?? ""); if (!isFinite(n)) return NaN; const uu = (u || "ppm").trim().toLowerCase(); if (uu === "ppb" || uu === "μg/l") return n / 1000; return n; };

    const v1Ml = _toMl(calcData.v1, calcData.v1Unit || "mL");
    const v2Ml = _toMl(calcData.v2, calcData.v2Unit || "mL");
    const v3Ml = _toMl(calcData.v3, calcData.v3Unit || "mL");
    const cf = parseFloat(calcData.conversionFactor ?? "");
    const lcMg = _toMg(calcData.labelClaim, calcData.labelClaimUnit || "mg");

    const numTP = calcData.numberOfTimePoints || 2;
    const TABLETS = [1, 2, 3, 4, 5, 6] as const;

    // Build time-point data
    const timePoints = Array.from({ length: numTP }, (_, i) => {
      const tp = i + 1;
      const tpLabelRaw = (calcData[`timePointLabel${tp}`] as string | null) ?? "";
      // Append "Hrs" if the label doesn't already contain hr/hrs/hour
      const tpLabel = tpLabelRaw
        ? /hr|hour/i.test(tpLabelRaw) ? tpLabelRaw : `${tpLabelRaw} Hrs`
        : null;
      const blankRaw = calcData[`instrumentConcentrationBlankT${tp}`] as string | null;
      const blankUnit = (calcData[`instrumentConcentrationBlankUnitT${tp}`] as string) || "ppm";
      const blankPpm = _toPpm(blankRaw, blankUnit);
      const tablets = TABLETS.map(tab => ({
        tab,
        sampleRaw: calcData[`sampleT${tp}Tab${tab}`] as string | null,
        result: calcData[`resultT${tp}Tab${tab}`] as string | null,
      }));

      // Compute min/avg/max from saved tablet result fields (saved by onUpdate)
      // Fall back to computing from tablet results if the saved fields are missing/zero
      const savedMin = calcData[`minT${tp}`];
      const savedAvg = calcData[`avgT${tp}`];
      const savedMax = calcData[`maxT${tp}`];
      const tabletNums400: number[] = tablets
        .map(ts => parseFloat(ts.result ?? ""))
        .filter(n => isFinite(n));
      const computedMin = tabletNums400.length ? Math.min(...tabletNums400) : null;
      const computedAvg = tabletNums400.length ? tabletNums400.reduce((a, b) => a + b, 0) / tabletNums400.length : null;
      const computedMax = tabletNums400.length ? Math.max(...tabletNums400) : null;
      // Prefer computed (always accurate) over saved (may be stale/0)
      const min = computedMin !== null ? computedMin : (savedMin !== undefined ? savedMin : null);
      const avg = computedAvg !== null ? computedAvg : (savedAvg !== undefined ? savedAvg : null);
      const max = computedMax !== null ? computedMax : (savedMax !== undefined ? savedMax : null);

      return {
        tp, tpLabel,
        blankRaw, blankUnit, blankPpm,
        tablets,
        min, avg, max,
        limitMin: calcData[`acceptanceLimitMin${tp}`],
        limitMax: calcData[`acceptanceLimitMax${tp}`],
      };
    });

    const hasAnyData = timePoints.some(tp => tp.tablets.some(ts => ts.sampleRaw));

    return (
      <div key={idx} className="mb-4">
        <p className="font-bold text-sm mb-2">{label}</p>

        {/* Top summary table */}
        <table className="w-full border border-black text-sm mb-2">
          <tbody>
            {matchedSamplePrep && (
              <tr className="border-b border-black">
                <td className="w-1/3 px-3 py-1.5 font-bold bg-gray-50 border-r border-black">Selected Sample Preparation</td>
                <td className="px-3 py-1.5">{matchedSamplePrep.label}</td>
              </tr>
            )}
            {calcData.labelClaim && (
              <tr className="border-b border-black">
                <td className="w-1/3 px-3 py-1.5 font-bold bg-gray-50 border-r border-black">Label Claim</td>
                <td className="px-3 py-1.5">{trimZeros(calcData.labelClaim)} {calcData.labelClaimUnit || "mg"}</td>
              </tr>
            )}
            {calcData.conversionFactor && (
              <tr className="border-b border-black">
                <td className="w-1/3 px-3 py-1.5 font-bold bg-gray-50 border-r border-black">Conversion Factor</td>
                <td className="px-3 py-1.5">{trimZeros(calcData.conversionFactor)}</td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Formula (once) */}
        {hasAnyData && renderLithosunFormulaSymbolic()}

        {/* Per-time-point blocks */}
        {timePoints.map(({ tp, tpLabel, blankRaw, blankUnit, blankPpm, tablets, min, avg, max }) => {
          const hasTabletData = tablets.some(ts => ts.sampleRaw);
          if (!hasTabletData) return null;
          return (
            <div key={tp} className="mb-4" style={{ breakInside: "avoid", pageBreakInside: "avoid" }}>
              {/* Time-point header */}
              <p className="font-bold text-sm mb-2 bg-gray-200 border border-black px-3 py-1">
                {tp === 1 ? "1st" : tp === 2 ? "2nd" : tp === 3 ? "3rd" : `${tp}th`} Time Point{tpLabel ? ` (${tpLabel})` : ``}
              </p>

              {/* Standard & Sample prep refs */}
              <table className="w-full border border-black text-sm mb-2">
                <tbody>
                  {matchedSamplePrep && (
                    <tr className="border-b border-black">
                      <td className="w-1/3 px-3 py-1.5 font-bold bg-gray-50 border-r border-black">Selected Sample Preparation</td>
                      <td className="px-3 py-1.5">{matchedSamplePrep.label}</td>
                    </tr>
                  )}
                  {blankRaw !== null && blankRaw !== undefined && blankRaw !== "" && blankRaw !== "0" && (
                    <tr className="border-b border-black">
                      <td className="w-1/3 px-3 py-1.5 font-bold bg-gray-50 border-r border-black">Blank Concentration</td>
                      <td className="px-3 py-1.5">{trimZeros(blankRaw)} {blankUnit}</td>
                    </tr>
                  )}
                </tbody>
              </table>

              {/* Per-tablet sample & result table */}
              <table className="w-full border border-black text-sm mb-2">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-black px-3 py-2 text-left font-bold">Tablet</th>
                    <th className="border border-black px-3 py-2 text-left font-bold">Sample Concentration</th>
                    <th className="border border-black px-3 py-2 text-left font-bold">Calculation Result</th>
                  </tr>
                </thead>
                <tbody>
                  {tablets.map(({ tab, sampleRaw, result }) => (
                    <tr key={tab}>
                      <td className="border border-black px-3 py-1.5 font-bold">Tablet {tab}</td>
                      <td className="border border-black px-3 py-1.5">
                        {sampleRaw ? `${trimZeros(sampleRaw)} ${blankUnit}` : "—"}
                      </td>
                      <td className="border border-black px-3 py-1.5">
                        {result ? `${trimZeros(result)} % of LC` : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Per-tablet derivations */}
              {tablets.map(({ tab, sampleRaw, result }) => {
                const samplePpm = _toPpm(sampleRaw, blankUnit);
                return renderTabletDerivation(
                  tab,
                  isFinite(samplePpm) ? samplePpm : null,
                  isFinite(blankPpm) ? blankPpm : 0,
                  isFinite(v1Ml) ? v1Ml : 1,
                  isFinite(v2Ml) ? v2Ml : 1,
                  isFinite(v3Ml) ? v3Ml : 1,
                  isFinite(cf) ? cf : 1,
                  isFinite(lcMg) ? lcMg : 1,
                  result,
                );
              })}

              {/* Time-point summary */}
              {min !== null && (

                <div className="mt-4 calc-summary-group">
                  <table className="w-full">
                    <tbody>
                      <tr className="bg-gray-100">
                        <td colSpan={3} className="p-3 border-b border-black">
                          <p className="font-bold text-sm">Calculation Summary</p>
                        </td>
                      </tr>
                      <tr className="">
                        <td className="text-center p-3 border-r border-black">
                          <p className="font-semibold text-xs">Minimum</p>
                          <p className="text-lg font-bold">
                            {min !== null ? `${trimZeros(min)} % of LC` : "—"}
                          </p>
                        </td>
                        <td className="text-center p-3 border-r border-black">
                          <p className="font-semibold text-xs">Average</p>
                          <p className="text-lg font-bold">
                            {avg !== null ? `${trimZeros(avg)} % of LC` : "—"}
                          </p>
                        </td>
                        <td className="text-center p-3">
                          <p className="font-semibold text-xs">Maximum</p>
                          <p className="text-lg font-bold">
                            {max !== null ? `${trimZeros(max)} % of LC` : "—"}
                          </p>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  // ── Render a single calculation ────────────────────────────────────────────
  const renderCalculation = (calc: any, idx: number, samplePreps: any[] = [] = []) => {
    const calcType = (calc.calculationType || "").toLowerCase();
    if (calcType === "lithosun300") return renderLithosun300Calculation(calc, idx, samplePreps);
    if (calcType === "lithosun400") return renderLithosun400Calculation(calc, idx, samplePreps);
    const calcData = safeJSONParse(calc.data, {});
    const label = calcTypeLabel(calcType) ? `${calc.label} (${calcTypeLabel(calcType)})` : calc.label;

    // Find matched sample prep by label, then derive paired standard prep by index
    const matchedSamplePrepIdx = calcData.selectedSamplePreparationLabel
      ? samplePreps.findIndex((p: any) => p.label === calcData.selectedSamplePreparationLabel)
      : -1;
    const matchedSamplePrep = matchedSamplePrepIdx !== -1 ? samplePreps[matchedSamplePrepIdx] : null;

    // ── Helper converters (same as renderMetalCalcDerivation) ────────────────
    const _toMg = (v: any, u?: string) => { const n = parseFloat(v ?? ""); if (!isFinite(n)) return NaN; const uu = (u || "mg").trim().toLowerCase(); if (uu === "g") return n * 1000; if (uu === "kg") return n * 1e6; if (uu === "μg" || uu === "mcg") return n / 1000; return n; };
    const _hasV = (v: any) => v !== null && v !== undefined && v !== "";
    const _fmtC = (canonical: number, cu: string, origVal: any, origU: string) => {
      const s = `${trimZeros(canonical)} ${cu}`;
      return (origU.toLowerCase() !== cu.toLowerCase() && _hasV(origVal)) ? `${s}` : s;
    };

    // ── Build display rows for the parameter summary table ───────────────────
    const t = calcType.toLowerCase();

    return (
      <div key={idx} className="mb-4">
        <p className="font-bold text-sm mb-2">{label}</p>

        {/* Parameter summary table */}
        <table className="w-full border border-black text-sm mb-2">
          <tbody>
            {matchedSamplePrep && (
              <tr className="border-b border-black">
                <td className="w-1/3 px-3 py-1.5 font-bold bg-gray-50 border-r border-black">Selected Sample Preparation</td>
                <td className="px-3 py-1.5">{matchedSamplePrep.label}</td>
              </tr>
            )}
            {calcData.instrumentConcentrationSample !== undefined && calcData.instrumentConcentrationSample !== "" && (
              <tr className="border-b border-black">
                <td className="w-1/3 px-3 py-1.5 font-bold bg-gray-50 border-r border-black">Sample Concentration</td>
                <td className="px-3 py-1.5">
                  {trimZeros(calcData.instrumentConcentrationSample)}{" "}{calcData.instrumentConcentrationSampleUnit || ""}
                </td>
              </tr>
            )}
            {calcData.instrumentConcentrationBlank !== undefined && calcData.instrumentConcentrationBlank !== "" && calcData.instrumentConcentrationBlank !== "0" && (
              <tr className="border-b border-black">
                <td className="w-1/3 px-3 py-1.5 font-bold bg-gray-50 border-r border-black">Blank Concentration</td>
                <td className="px-3 py-1.5">
                  {trimZeros(calcData.instrumentConcentrationBlank)}{" "}{calcData.instrumentConcentrationBlankUnit || ""}
                </td>
              </tr>
            )}
            {/* SW intentionally omitted — comes from sample prep */}

            {/* ── ZPTO Shampoo extra fields ── */}
            {t === "zpto_shampoo" && _hasV(calcData.specificGravity) && (
              <tr className="border-b border-black">
                <td className="w-1/3 px-3 py-1.5 font-bold bg-gray-50 border-r border-black">Specific Gravity</td>
                <td className="px-3 py-1.5">{trimZeros(calcData.specificGravity)}</td>
              </tr>
            )}
            {t === "zpto_shampoo" && _hasV(calcData.molecularWeight1) && (
              <tr className="border-b border-black">
                <td className="w-1/3 px-3 py-1.5 font-bold bg-gray-50 border-r border-black">Molecular Weight 1 (MW₁)</td>
                <td className="px-3 py-1.5">{trimZeros(calcData.molecularWeight1)} {calcData.molecularWeight1Unit || "g/mol"}</td>
              </tr>
            )}
            {t === "zpto_shampoo" && _hasV(calcData.molecularWeight2) && (
              <tr className="border-b border-black">
                <td className="w-1/3 px-3 py-1.5 font-bold bg-gray-50 border-r border-black">Molecular Weight 2 (MW₂)</td>
                <td className="px-3 py-1.5">{trimZeros(calcData.molecularWeight2)} {calcData.molecularWeight2Unit || "g/mol"}</td>
              </tr>
            )}
            {t === "zpto_shampoo" && _hasV(calcData.labelClaim) && (
              <tr className="border-b border-black">
                <td className="w-1/3 px-3 py-1.5 font-bold bg-gray-50 border-r border-black">Label Claim</td>
                <td className="px-3 py-1.5">{trimZeros(calcData.labelClaim)} {calcData.labelClaimUnit || ""}</td>
              </tr>
            )}

            {/* ── Anofer extra: Avg Weight + Label Claim ── */}
            {t === "anofer" && _hasV(calcData.avgWeight) && (() => {
              const avgU2 = calcData.avgWeightUnit || "mg";
              const avgMg = _toMg(calcData.avgWeight, avgU2);
              return isFinite(avgMg) ? (
                <tr className="border-b border-black">
                  <td className="w-1/3 px-3 py-1.5 font-bold bg-gray-50 border-r border-black">Avg. Weight</td>
                  <td className="px-3 py-1.5">{_fmtC(avgMg, "mg", calcData.avgWeight, avgU2)}</td>
                </tr>
              ) : null;
            })()}
            {["anofer", "lithosun300", "lithosun400"].includes(t) && _hasV(calcData.labelClaim) && (() => {
              const lcU2 = calcData.labelClaimUnit || "mg";
              const lcMg = _toMg(calcData.labelClaim, lcU2);
              return isFinite(lcMg) ? (
                <tr className="border-b border-black">
                  <td className="w-1/3 px-3 py-1.5 font-bold bg-gray-50 border-r border-black">Label Claim</td>
                  <td className="px-3 py-1.5">{_fmtC(lcMg, "mg", calcData.labelClaim, lcU2)}</td>
                </tr>
              ) : null;
            })()}

            {/* ── ORS extra fields ── */}
            {t === "ors" && _hasV(calcData.sachetWeightAvg) && (
              <tr className="border-b border-black">
                <td className="w-1/3 px-3 py-1.5 font-bold bg-gray-50 border-r border-black">Sachet Weight (Avg)</td>
                <td className="px-3 py-1.5">{trimZeros(calcData.sachetWeightAvg)} {calcData.sachetWeightAvgUnit || "g"}</td>
              </tr>
            )}
            {t === "ors" && _hasV(calcData.molecularWeight) && (
              <tr className="border-b border-black">
                <td className="w-1/3 px-3 py-1.5 font-bold bg-gray-50 border-r border-black">Molecular Weight</td>
                <td className="px-3 py-1.5">{trimZeros(calcData.molecularWeight)} {calcData.molecularWeightUnit || "g/mol"}</td>
              </tr>
            )}
            {t === "ors" && _hasV(calcData.labelClaim) && (
              <tr className="border-b border-black">
                <td className="w-1/3 px-3 py-1.5 font-bold bg-gray-50 border-r border-black">Label Claim</td>
                <td className="px-3 py-1.5">{trimZeros(calcData.labelClaim)} {calcData.labelClaimUnit || ""}</td>
              </tr>
            )}

            {/* ── Meropenam extra fields ── */}
            {t === "meropenam" && _hasV(calcData.labelClaim) && (
              <tr className="border-b border-black">
                <td className="w-1/3 px-3 py-1.5 font-bold bg-gray-50 border-r border-black">Label Claim</td>
                <td className="px-3 py-1.5">{trimZeros(calcData.labelClaim)} {calcData.labelClaimUnit || "mg"}</td>
              </tr>
            )}


          </tbody>
        </table>

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
            .pdf-page-with-sig {
              display: flex !important;
              flex-direction: column !important;
              height: 100vh !important;
            }
            .file-signature-footer { break-inside: avoid !important; page-break-inside: avoid !important; }
            /* Wrapper around signature table + italic note — keep as one unit */
            .signature-footer-block {
              break-inside: avoid !important;
              page-break-inside: avoid !important;
              display: block !important;
            }
            .pdf-page-with-sig img {
              max-width: 100% !important;
              max-height: 100% !important;
              object-fit: contain !important;
            }
}
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
          // Instruments, chemicals and standards are stored as embedded objects
          // directly on each parameter — use them directly, no ID look-up needed.
          const filteredInstruments: any[] = Array.isArray(param.instruments)
            ? param.instruments
            : [];
          const filteredChemicals: any[] = Array.isArray(param.chemicals)
            ? param.chemicals
            : [];
          const filteredStandards: any[] = Array.isArray(param.standards)
            ? param.standards
            : [];

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
                            <td className="px-3 py-2 border-r-2 border-emerald-500">
                              {inst.calibrationDoneDate
                                ? inst.calibrationDoneDate.replace(/-/g, "/")
                                : "---"}
                            </td>
                            <td className="px-3 py-2 border-r-2 border-emerald-500">
                              {inst.calibrationDueDate
                                ? inst.calibrationDueDate.replace(/-/g, "/")
                                : "---"}
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
                              {chem.expDate
                                ? new Date(chem.expDate).toLocaleDateString("en-GB")
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
                    <h4 className="text-md uppercase font-bold mb-2">Preparation Details</h4>
                    {blankPreps.map((prep: any, idx: number) => {
                      // Parse content: supports new array format + legacy
                      let methodHtml = "";
                      let results: { id: string; label: string; value: string; unit: string }[] = [];
                      let limits: { id: string; label: string; min: string; max: string; unit: string }[] = [];

                      if (prep.content) {
                        try {
                          const parsed = JSON.parse(prep.content);
                          if (parsed && typeof parsed === "object") {
                            if (Array.isArray(parsed.results) && Array.isArray(parsed.limits)) {
                              methodHtml = parsed.method || "";
                              results = parsed.results;
                              limits = parsed.limits;
                            } else if ("method" in parsed) {
                              methodHtml = parsed.method || "";
                              if (parsed.calculationResult || parsed.calculationResultUnit)
                                results = [{ id: "r", label: "Result", value: parsed.calculationResult || "", unit: parsed.calculationResultUnit || "" }];
                              if (parsed.acceptanceLimitMin || parsed.acceptanceLimitMax)
                                limits = [{ id: "l", label: "Limit", min: parsed.acceptanceLimitMin || "", max: parsed.acceptanceLimitMax || "", unit: parsed.calculationResultUnit || "" }];
                            } else { methodHtml = prep.content; }
                          }
                        } catch { methodHtml = prep.content || ""; }
                      }

                      const hasMethod = !!methodHtml?.replace(/<[^>]*>/g, "").trim();
                      const hasResults = results.some(r => r.value.trim() || r.unit);
                      const hasLimits = limits.some(l => l.min.trim() || l.max.trim());
                      if (!hasMethod && !hasResults && !hasLimits) return null;

                      return (
                        <div key={idx} className="section-container mb-4">
                          <p className="font-bold text-sm mb-2">{prep.label}</p>

                          <style dangerouslySetInnerHTML={{
                            __html: `
                                                        .blank-method-content table { display: table !important; width: 100% !important; border-collapse: collapse !important; }
                                                        .blank-method-content tr    { display: table-row !important; }
                                                        .blank-method-content td, .blank-method-content th { display: table-cell !important; border: 1px solid black !important; padding: 4px 8px !important; }
                                                    `}} />

                          <table className="w-full border-collapse border border-black text-sm">
                            <tbody>

                              {/* Method */}
                              {hasMethod && (
                                <tr>
                                  <td colSpan={3} className="border border-black px-3 py-2">
                                    <span className="font-bold">Method / Preparation :&nbsp;</span>
                                    <div className="blank-method-content text-sm mt-2"
                                      dangerouslySetInnerHTML={{ __html: methodHtml }}
                                      style={{ lineHeight: "1.6", fontFamily: "inherit", fontSize: "0.875rem" }} />
                                  </td>
                                </tr>
                              )}

                              {/* Results */}
                              {hasResults && (
                                <>
                                  <tr className="bg-gray-50">
                                    <td className="border border-black px-3 py-1.5 font-bold text-xs" style={{ width: "30%" }}>Result / Reported Value</td>
                                    <td className="border border-black px-3 py-1.5 font-bold text-xs" style={{ width: "40%" }}>Value</td>
                                    <td className="border border-black px-3 py-1.5 font-bold text-xs" style={{ width: "30%" }}>Unit</td>
                                  </tr>
                                  {results.map((r, ri) => (r.value.trim() || r.unit) && (
                                    <tr key={ri}>
                                      <td className="border border-black px-3 py-1.5 text-xs font-semibold text-gray-600">{r.label}</td>
                                      <td className="border border-black px-3 py-1.5 font-mono font-bold">{r.value || "—"}</td>
                                      <td className="border border-black px-3 py-1.5 text-xs">{r.unit || "—"}</td>
                                    </tr>
                                  ))}
                                </>
                              )}

                              {/* Acceptance Limits */}
                              {hasLimits && (
                                <>
                                  <tr className="bg-gray-50">
                                    <td className="border border-black px-3 py-1.5 font-bold text-xs">Acceptance Limit</td>
                                    <td className="border border-black px-3 py-1.5 font-bold text-xs">Criterion</td>
                                    <td className="border border-black px-3 py-1.5 font-bold text-xs">Unit</td>
                                  </tr>
                                  {limits.map((l, li) => {
                                    const hasMin = !!l.min.trim(), hasMax = !!l.max.trim();
                                    if (!hasMin && !hasMax) return null;
                                    const criterion = hasMin && hasMax
                                      ? `${l.min} ≤ Result ≤ ${l.max}`
                                      : hasMin ? `Result ≥ ${l.min}` : `Result ≤ ${l.max}`;
                                    return (
                                      <tr key={li}>
                                        <td className="border border-black px-3 py-1.5 text-xs font-semibold text-gray-600">{l.label}</td>
                                        <td className="border border-black px-3 py-1.5 font-mono font-bold">{criterion}</td>
                                        <td className="border border-black px-3 py-1.5 text-xs">{l.unit || "—"}</td>
                                      </tr>
                                    );
                                  })}
                                </>
                              )}

                            </tbody>
                          </table>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* ── Calculations ──────────────────────────────────── */}
                {calculations.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-md uppercase font-bold mb-2">Calculations</h4>
                    {calculations.map((calc: any, idx: number) =>
                      renderCalculation(calc, idx, samplePreps),
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
                                  /* Image: show image then JSX footer below */
                                  <div
                                    className="pdf-page-with-sig"
                                    style={{
                                      breakInside: "avoid",
                                      pageBreakInside: "avoid",
                                      display: "flex",
                                      flexDirection: "column",
                                      height: "100vh",
                                    }}
                                  >
                                    <div style={{ flex: 1, minHeight: 0, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                                      <img
                                        src={`data:image/${f.fileName?.split(".").pop()?.toLowerCase() || "jpeg"};base64,${f.fileDataBase64}`}
                                        alt={f.fileName}
                                        style={{ maxWidth: "100%", maxHeight: "100%", display: "block", objectFit: "contain" }}
                                      />
                                    </div>
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