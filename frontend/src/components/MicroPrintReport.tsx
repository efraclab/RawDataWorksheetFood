import React, { useEffect, useState } from "react";
import type { SampleData } from "../models/SampleData";
import type { WorksheetDetail } from "../models/WorksheetDetail";
import type { Analyst } from "../models/Analyst";
import type { Instrument } from "../preparation_models/Instrument";
import type { Chemical } from "../preparation_models/Chemical";
import type { Media } from "../preparation_models/Media";

// ── Signature footer types ────────────────────────────────────────────────────

interface FileSignatureData {
  analyzedByName: string | null;
  analysisCompletionDate: string | null;
  approvedByReviewerName: string | null;
  approvedAtReviewer: string | null;
}

// ── Date helpers ──────────────────────────────────────────────────────────────

function parseDateSafe(raw: string): Date | null {
  const s = raw.trim();
  if (/^\d{4}[-/]/.test(s)) {
    const d = new Date(s.replace(" ", "T"));
    return isNaN(d.getTime()) ? null : d;
  }
  const m = s.match(
    /^(\d{1,2})[-/](\d{1,2})[-/](\d{4})(?:[T ](\d{2}:\d{2}(?::\d{2})?))?/,
  );
  if (m) {
    const iso = `${m[3]}-${m[2].padStart(2, "0")}-${m[1].padStart(2, "0")}`;
    const d = new Date(m[4] ? `${iso}T${m[4]}` : `${iso}T00:00:00`);
    return isNaN(d.getTime()) ? null : d;
  }
  const d = new Date(s);
  return isNaN(d.getTime()) ? null : d;
}

function formatDt(raw: string | null | undefined): string {
  if (!raw) return "N/A";
  const d = parseDateSafe(String(raw));
  if (!d) return String(raw).trim() || "N/A";
  const DD = String(d.getDate()).padStart(2, "0");
  const MM = String(d.getMonth() + 1).padStart(2, "0");
  return `${DD}/${MM}/${d.getFullYear()}`;
}

function formatDateOnly(raw: string | null | undefined): string {
  if (!raw) return "N/A";
  const d = parseDateSafe(String(raw));
  if (!d) return String(raw).trim() || "N/A";
  return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
}

// ── Reusable signature footer ─────────────────────────────────────────────────

const FileSignatureFooter: React.FC<{ sig: FileSignatureData }> = ({ sig }) => (
  <table
    className="file-signature-footer"
    style={{
      width: "100%",
      borderCollapse: "collapse",
      fontSize: "10px",
      marginTop: "4px",
      border: "1px solid black",
      breakInside: "avoid",
      pageBreakInside: "avoid",
    }}
  >
    <tbody>
      <tr>
        <td style={{ padding: "4px 8px", border: "1px solid black", width: "25%" }}>
          Analyzed By
        </td>
        <td style={{ padding: "4px 8px", border: "1px solid black", width: "25%", fontWeight: "bold" }}>
          {sig.analyzedByName || "---"}
        </td>
        <td style={{ padding: "4px 8px", border: "1px solid black", width: "25%" }}>
          Analyzed On
        </td>
        <td style={{ padding: "4px 8px", border: "1px solid black", width: "25%", fontWeight: "bold" }}>
          {formatDt(sig.analysisCompletionDate)}
        </td>
      </tr>
      <tr>
        <td style={{ padding: "4px 8px", border: "1px solid black" }}>
          Reviewed By
        </td>
        <td style={{ padding: "4px 8px", border: "1px solid black", fontWeight: "bold" }}>
          {sig.approvedByReviewerName || "---"}
        </td>
        <td style={{ padding: "4px 8px", border: "1px solid black" }}>
          Reviewed On
        </td>
        <td style={{ padding: "4px 8px", border: "1px solid black", fontWeight: "bold" }}>
          {formatDt(sig.approvedAtReviewer)}
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
            script.src =
              "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
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

        if (!cancelled) {
          setPages(dataUrls);
          setLoading(false);
        }
      } catch (err: any) {
        if (!cancelled) {
          setError(err.message || "Failed to render PDF");
          setLoading(false);
        }
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
    return (
      <div className="p-4 text-xs text-gray-500 text-center">
        Loading {fileName}…
      </div>
    );
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

// ── Component props ───────────────────────────────────────────────────────────

interface MicroPrintReportProps {
  worksheetInfo: WorksheetDetail;
  sampleData: SampleData;
  analysts: Analyst[];
  instruments: Instrument[];
  chemicals: Chemical[];
  media: Media[];
  onClose: () => void;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const safeJSONParse = (data: any, fallback: any = []) => {
  if (!data) return fallback;
  if (typeof data === "string") {
    try { return JSON.parse(data); } catch { return fallback; }
  }
  return data;
};

// ── Shared print-table cell styles ───────────────────────────────────────────

const TH = "border border-black px-2 py-1.5 bg-gray-100 text-xs font-bold text-left";
const TD = "border border-black px-2 py-1.5 text-xs";

// ── BET Preparation print renderer ───────────────────────────────────────────

const BETPrepPrint: React.FC<{ prep: any; idx: number }> = ({ prep, idx }) => {
  const tubes: any[] = prep.observationTubes || [];

  return (
    <div className="mb-4">
      {/* Sub-heading */}
      <p className="font-bold text-md mb-2 underline inline-block">
        {prep.label || `BET Preparation ${idx + 1}`}
      </p>
      {/* Dilution & MVD */}
      {(prep.dilutionProcedure || prep.endotoxinLimit || prep.concentrationOfSample || prep.lysateSensitivity || prep.mvd) && (
        <div className="mb-3">
          <p className="font-bold uppercase text-sm mb-2">Dilution</p>
          <table className="w-full border border-black text-xs">
            <tbody>
              {prep.dilutionProcedure && (
                <tr>
                  <td className={`${TH} w-1/3`}>Dilution Procedure</td>
                  <td className={TD} style={{ whiteSpace: "pre-wrap" }}>{prep.dilutionProcedure}</td>
                </tr>
              )}
              {prep.endotoxinLimit && (
                <tr>
                  <td className={`${TH} w-1/3`}>Endotoxin Limit</td>
                  <td className={TD}>{prep.endotoxinLimit}</td>
                </tr>
              )}
              {prep.concentrationOfSample && (
                <tr>
                  <td className={`${TH} w-1/3`}>Concentration of Sample</td>
                  <td className={TD}>{prep.concentrationOfSample}</td>
                </tr>
              )}
              {prep.lysateSensitivity && (
                <tr>
                  <td className={`${TH} w-1/3`}>Lysate Sensitivity (λ)</td>
                  <td className={TD}>{prep.lysateSensitivity}</td>
                </tr>
              )}
              {(prep.mvd || (prep.endotoxinLimit && prep.concentrationOfSample && prep.lysateSensitivity)) && (() => {
                const el = parseFloat(prep.endotoxinLimit);
                const cs = parseFloat(prep.concentrationOfSample);
                const ls = parseFloat(prep.lysateSensitivity);
                const computed = (!isNaN(el) && !isNaN(cs) && !isNaN(ls) && ls !== 0)
                  ? ((el * cs) / ls).toFixed(4)
                  : null;
                const displayMvd = computed || prep.mvd;
                if (!displayMvd) return null;
                return (
                  <tr>
                    <td className={`${TH} w-1/3`}>MVD</td>
                    <td className={TD}>
                      {displayMvd}
                    </td>
                  </tr>
                );
              })()}
            </tbody>
          </table>
        </div>
      )}

      {/* Observations table */}
      {tubes.length > 0 && (
        <div className="mb-3">
          <p className="font-bold uppercase text-sm mb-2">Observations</p>
          <table className="w-full border border-black text-xs">
            <thead>
              <tr className="bg-gray-100">
                <th className={TH}>Tube No.</th>
                <th className={TH}>Type</th>
                <th className={TH}>Water for BET (µL)</th>
                <th className={TH}>Endotoxin / CSE (µL)</th>
                <th className={TH}>Sample (µL)</th>
                <th className={TH}>Lysate (µL)</th>
                <th className={TH}>Gel Clot Formation</th>
                <th className={TH}>Result</th>
              </tr>
            </thead>
            <tbody>
              {tubes.map((tube: any, ti: number) => (
                <tr key={ti} className={ti % 2 === 0 ? "" : "bg-gray-50"}>
                  <td className={TD}>Tube {ti + 1}</td>
                  <td className={TD}>{tube.tubeType || "---"}</td>
                  <td className={`${TD} text-center`}>{tube.waterForBET || "---"}</td>
                  <td className={`${TD} text-center`}>{tube.endotoxinCSE || "---"}</td>
                  <td className={`${TD} text-center`}>{tube.sample || "---"}</td>
                  <td className={`${TD} text-center`}>{tube.lysate || "---"}</td>
                  <td className={`${TD} text-center font-semibold`}>
                    {tube.gelClotFormation
                      ? (
                        <span>
                          {tube.gelClotFormation}
                        </span>
                      )
                      : "---"
                    }
                  </td>
                  <td className={`${TD} text-center`}>{tube.result || "---"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Final Result */}
      {prep.finalResult && (
        <div className="mb-3">
          <p className="font-bold uppercase text-sm">Final Result</p>
          <span className="text-sm">
            {prep.finalResult === "Complies"
              ? "The product COMPLIES with the Bacterial Endotoxin Test by Gel-Clot Method."
              : "The product DOES NOT COMPLY with the Bacterial Endotoxin Test by Gel-Clot Method."}
          </span>
        </div>
      )}
    </div>
  );
};

// ── Clostridium Preparation print renderer ────────────────────────────────────

const ClostridiumPrepPrint: React.FC<{ prep: any; idx: number }> = ({ prep, idx }) => {
  const inoculationRows: any[] = prep.inoculationRows || [];
  const biochemicalRows: any[] = prep.biochemicalRows || [];

  return (
    <div className="mb-4">
      <div className="keep-together">
        <p className="font-bold text-md mb-2 underline inline-block">
          {prep.label || `Clostridium Preparation ${idx + 1}`}
        </p>

        {/* Preliminary Note */}
        <div className="border border-black px-3 py-2 text-xs bg-gray-50 mb-3">
          <strong>Preliminary Test:</strong> Divide the sample into two portions (A and B) of 10 ml each.{" "}
          Heat portion A at 80°C for 10 minutes, then cool rapidly.{" "}
          Do not heat portion B.
        </div>

      </div>

      {/* Inoculation Observations */}
      {inoculationRows.length > 0 && (
        <div className="mb-3">
          <p className="font-bold uppercase text-sm mb-2">Inoculation Observations</p>
          <table className="w-full border border-black text-xs">
            <thead>
              <tr className="bg-gray-100">
                <th className={TH} style={{ width: "22%" }}>Medium</th>
                <th className={TH} style={{ width: "14%" }}>Colony / Growth Characteristics</th>
                <th className={TH} style={{ width: "8%" }}>Analysis Started</th>
                <th className={TH} style={{ width: "8%" }}>Analysis Completed</th>
                <th className={TH} style={{ width: "6%" }}>Incubation Temp. (°C)</th>
                <th className={TH} style={{ width: "6%" }}>Incubation Time (Hr.)</th>
                <th className={TH} style={{ width: "12%" }}>Observation</th>
                <th className={TH} style={{ width: "12%" }}>Reference Culture</th>
                <th className={TH} style={{ width: "12%" }}>Blank</th>
              </tr>
            </thead>
            <tbody>
              {inoculationRows.map((row: any, ri: number) => (
                <tr key={ri} className={ri % 2 === 0 ? "" : "bg-gray-50"}>
                  <td className={TD}>{row.medium || "---"}</td>
                  <td className={TD}>{row.colonyCharacteristics || "---"}</td>
                  <td className={`${TD} text-center`}>{row.analysisStarted ? formatDateOnly(row.analysisStarted) : "---"}</td>
                  <td className={`${TD} text-center`}>{row.analysisCompleted ? formatDateOnly(row.analysisCompleted) : "---"}</td>
                  <td className={`${TD} text-center`}>{row.incubationTemp || "---"}</td>
                  <td className={`${TD} text-center`}>{row.incubationTime || "---"}</td>
                  <td className={TD}>{row.observation || "---"}</td>
                  <td className={TD}>{row.referenceCulture || "---"}</td>
                  <td className={TD}>{row.blank || "---"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}


      {/* Biochemical Identification */}
      {biochemicalRows.length > 0 && (
        <div className="mb-3">
          <p className="font-bold uppercase text-sm mb-2">Biochemical Identification</p>
          <table className="w-full border border-black text-xs">
            <thead>
              <tr className="bg-gray-100">
                <th className={TH} style={{ width: "22%" }}>Name of the Test</th>
                <th className={TH} style={{ width: "8%" }}>Analysis Started</th>
                <th className={TH} style={{ width: "8%" }}>Analysis Completed</th>
                <th className={TH} style={{ width: "16%" }}>Media / Reagent Required</th>
                <th className={TH} style={{ width: "8%" }}>Incubation Temp. (°C)</th>
                <th className={TH} style={{ width: "8%" }}>Incubation Time (Hr.)</th>
                <th className={TH} style={{ width: "15%" }}>Observation</th>
                <th className={TH} style={{ width: "15%" }}>Blank</th>
              </tr>
            </thead>
            <tbody>
              {biochemicalRows.map((row: any, ri: number) => (
                <tr key={ri} className={ri % 2 === 0 ? "" : "bg-gray-50"}>
                  <td className={TD}>{row.testName || "---"}</td>
                  <td className={`${TD} text-center`}>{row.analysisStarted ? formatDateOnly(row.analysisStarted) : "---"}</td>
                  <td className={`${TD} text-center`}>{row.analysisCompleted ? formatDateOnly(row.analysisCompleted) : "---"}</td>
                  <td className={TD}>{row.mediaReagent || "---"}</td>
                  <td className={`${TD} text-center`}>{row.incubationTemp || "---"}</td>
                  <td className={`${TD} text-center`}>{row.incubationTime || "---"}</td>
                  <td className={TD}>{row.observation || "---"}</td>
                  <td className={TD}>{row.blank || "---"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Final Result */}
      {prep.result && (
        <div className="mb-3">
          <p className="font-bold uppercase text-sm">Final Result</p>
          <span style={{ whiteSpace: "pre-wrap" }}>{prep.result}</span>
        </div>
      )}
    </div>
  );
};

// ── BileTolerant Preparation print renderer ───────────────────────────────────

const BileTolerantPrepPrint: React.FC<{ prep: any; idx: number }> = ({ prep, idx }) => {
  const inoculationRows: any[] = prep.inoculationRows || [];

  return (
    <div className="mb-4">
      <div className="keep-together">
        <p className="font-bold text-md mb-2 underline inline-block">
          {prep.label || `Bile-Tolerant Preparation ${idx + 1}`}
        </p>

        {/* Inoculation / Enrichment table */}
        {inoculationRows.length > 0 && (
          <div className="mb-3">
            <p className="font-bold uppercase text-sm mb-2">Inoculation &amp; Enrichment Observations</p>
            <table className="w-full border border-black text-xs">
              <thead>
                <tr className="bg-gray-100">
                  <th className={TH} style={{ width: "22%" }}>Medium</th>
                  <th className={TH} style={{ width: "14%" }}>Colony / Growth Characteristics</th>
                  <th className={TH} style={{ width: "7%" }}>Analysis Started</th>
                  <th className={TH} style={{ width: "7%" }}>Analysis Completed</th>
                  <th className={TH} style={{ width: "7%" }}>Incubation Temp. (°C)</th>
                  <th className={TH} style={{ width: "7%" }}>Incubation Time (Hr.)</th>
                  <th className={TH} style={{ width: "12%" }}>Sample</th>
                  <th className={TH} style={{ width: "12%" }}>Reference</th>
                  <th className={TH} style={{ width: "12%" }}>Blank</th>
                </tr>
              </thead>
              <tbody>
                {inoculationRows.map((row: any, ri: number) => (
                  <tr key={ri} className={ri % 2 === 0 ? "" : "bg-gray-50"}>
                    <td className={TD}>{row.medium || "---"}</td>
                    <td className={TD}>{row.colonyCharacteristics || "---"}</td>
                    <td className={`${TD} text-center`}>{row.analysisStarted ? formatDateOnly(row.analysisStarted) : "---"}</td>
                    <td className={`${TD} text-center`}>{row.analysisCompleted ? formatDateOnly(row.analysisCompleted) : "---"}</td>
                    <td className={`${TD} text-center`}>{row.incubationTemp || "---"}</td>
                    <td className={`${TD} text-center`}>{row.incubationTime || "---"}</td>
                    <td className={TD}>{row.sample || "---"}</td>
                    <td className={TD}>{row.reference || "---"}</td>
                    <td className={TD}>{row.blank || "---"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>

      {/* Final Result */}
      {prep.result && (
        <div className="mb-3">
          <p className="font-bold uppercase text-sm">Final Result</p>
          <span style={{ whiteSpace: "pre-wrap" }}>{prep.result}</span>
        </div>
      )}
    </div>
  );
};

// ── B. cepacia Preparation print renderer ────────────────────────────────────

const BCepaciaPrepPrint: React.FC<{ prep: any; idx: number }> = ({ prep, idx }) => {
  const inoculationRows: any[] = prep.inoculationRows || [];
  const identificationRows: any[] = prep.identificationRows || [];

  return (
    <div className="mb-4">
      <div className="keep-together">
        <p className="font-bold text-md mb-2 underline inline-block">
          {prep.label || `B. cepacia Preparation ${idx + 1}`}
        </p>

        {/* Inoculation Observations */}
        {inoculationRows.length > 0 && (
          <div className="mb-3">
            <p className="font-bold uppercase text-sm mb-2">Inoculation Observations</p>
            <table className="w-full border border-black text-xs">
              <thead>
                <tr className="bg-gray-100">
                  <th className={TH} style={{ width: "22%" }}>Medium</th>
                  <th className={TH} style={{ width: "16%" }}>Colony / Growth Characteristics</th>
                  <th className={TH} style={{ width: "7%" }}>Analysis Started</th>
                  <th className={TH} style={{ width: "7%" }}>Analysis Completed</th>
                  <th className={TH} style={{ width: "7%" }}>Incubation Temp. (°C)</th>
                  <th className={TH} style={{ width: "7%" }}>Incubation Time (Hr.)</th>
                  <th className={TH} style={{ width: "11%" }}>Observation</th>
                  <th className={TH} style={{ width: "11%" }}>Reference Culture</th>
                  <th className={TH} style={{ width: "12%" }}>Blank</th>
                </tr>
              </thead>
              <tbody>
                {inoculationRows.map((row: any, ri: number) => (
                  <tr key={ri} className={ri % 2 === 0 ? "" : "bg-gray-50"}>
                    <td className={TD}>{row.medium || "---"}</td>
                    <td className={TD}>{row.colonyCharacteristics || "---"}</td>
                    <td className={`${TD} text-center`}>{row.analysisStarted ? formatDateOnly(row.analysisStarted) : "---"}</td>
                    <td className={`${TD} text-center`}>{row.analysisCompleted ? formatDateOnly(row.analysisCompleted) : "---"}</td>
                    <td className={`${TD} text-center`}>{row.incubationTemp || "---"}</td>
                    <td className={`${TD} text-center`}>{row.incubationTime || "---"}</td>
                    <td className={TD}>{row.observation || "---"}</td>
                    <td className={TD}>{row.referenceCulture || "---"}</td>
                    <td className={TD}>{row.blank || "---"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Identification Tests (from BCSA growth) */}
      {identificationRows.length > 0 && (
        <div className="mb-3">
          <p className="font-bold uppercase text-sm mb-2">
            Identification Tests
          </p>
          <table className="w-full border border-black text-xs">
            <thead>
              <tr className="bg-gray-100">
                <th className={TH} style={{ width: "20%" }}>Name of the Test</th>
                <th className={TH} style={{ width: "7%" }}>Analysis Started</th>
                <th className={TH} style={{ width: "7%" }}>Analysis Completed</th>
                <th className={TH} style={{ width: "16%" }}>Media / Reagent</th>
                <th className={TH} style={{ width: "7%" }}>Incubation Temp. (°C)</th>
                <th className={TH} style={{ width: "7%" }}>Incubation Time (Hr.)</th>
                <th className={TH} style={{ width: "12%" }}>Observation</th>
                <th className={TH} style={{ width: "12%" }}>Reference Culture</th>
                <th className={TH} style={{ width: "12%" }}>Blank</th>
              </tr>
            </thead>
            <tbody>
              {identificationRows.map((row: any, ri: number) => (
                <tr key={ri} className={ri % 2 === 0 ? "" : "bg-gray-50"}>
                  <td className={TD}>{row.testName || "---"}</td>
                  <td className={`${TD} text-center`}>{row.analysisStarted ? formatDateOnly(row.analysisStarted) : "---"}</td>
                  <td className={`${TD} text-center`}>{row.analysisCompleted ? formatDateOnly(row.analysisCompleted) : "---"}</td>
                  <td className={TD}>{row.mediaReagent || "---"}</td>
                  <td className={`${TD} text-center`}>{row.incubationTemp || "---"}</td>
                  <td className={`${TD} text-center`}>{row.incubationTime || "---"}</td>
                  <td className={TD}>{row.observation || "---"}</td>
                  <td className={TD}>{row.referenceCulture || "---"}</td>
                  <td className={TD}>{row.blank || "---"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Final Result */}
      {prep.result && (
        <div className="mb-3">
          <p className="font-bold uppercase text-sm">Final Result</p>
          <span style={{ whiteSpace: "pre-wrap" }}>{prep.result}</span>
        </div>
      )}
    </div>
  );
};

// ── Candida albicans Preparation print renderer ───────────────────────────────

const CandidaAlbicansPrepPrint: React.FC<{ prep: any; idx: number }> = ({ prep, idx }) => {
  const inoculationRows: any[] = prep.inoculationRows || [];
  const identificationRows: any[] = prep.identificationRows || [];

  return (
    <div className="mb-4">
      <p className="font-bold text-md mb-2 underline inline-block">
        {prep.label || `C. albicans Preparation ${idx + 1}`}
      </p>

      {/* Inoculation Observations */}
      {inoculationRows.length > 0 && (
        <div className="mb-3">
          <p className="font-bold uppercase text-sm mb-2">Inoculation Observations</p>
          <table className="w-full border border-black text-xs">
            <thead>
              <tr className="bg-gray-100">
                <th className={TH} style={{ width: "22%" }}>Medium</th>
                <th className={TH} style={{ width: "16%" }}>Colony / Growth Characteristics</th>
                <th className={TH} style={{ width: "7%" }}>Analysis Started</th>
                <th className={TH} style={{ width: "7%" }}>Analysis Completed</th>
                <th className={TH} style={{ width: "7%" }}>Incubation Temp. (°C)</th>
                <th className={TH} style={{ width: "7%" }}>Incubation Time (Hr.)</th>
                <th className={TH} style={{ width: "11%" }}>Observation</th>
                <th className={TH} style={{ width: "11%" }}>Reference Culture</th>
                <th className={TH} style={{ width: "12%" }}>Blank</th>
              </tr>
            </thead>
            <tbody>
              {inoculationRows.map((row: any, ri: number) => (
                <tr key={ri} className={ri % 2 === 0 ? "" : "bg-gray-50"}>
                  <td className={TD}>{row.medium || "---"}</td>
                  <td className={TD}>{row.colonyCharacteristics || "---"}</td>
                  <td className={`${TD} text-center`}>{row.analysisStarted ? formatDateOnly(row.analysisStarted) : "---"}</td>
                  <td className={`${TD} text-center`}>{row.analysisCompleted ? formatDateOnly(row.analysisCompleted) : "---"}</td>
                  <td className={`${TD} text-center`}>{row.incubationTemp || "---"}</td>
                  <td className={`${TD} text-center`}>{row.incubationTime || "---"}</td>
                  <td className={TD}>{row.observation || "---"}</td>
                  <td className={TD}>{row.referenceCulture || "---"}</td>
                  <td className={TD}>{row.blank || "---"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Identification Tests (from SDA growth → Brain Heart Infusion Broth) */}
      {identificationRows.length > 0 && (
        <div className="mb-3">
          <p className="font-bold uppercase text-sm mb-2">
            Identification Tests
          </p>
          <table className="w-full border border-black text-xs">
            <thead>
              <tr className="bg-gray-100">
                <th className={TH} style={{ width: "20%" }}>Name of the Test</th>
                <th className={TH} style={{ width: "7%" }}>Analysis Started</th>
                <th className={TH} style={{ width: "7%" }}>Analysis Completed</th>
                <th className={TH} style={{ width: "16%" }}>Media / Reagent</th>
                <th className={TH} style={{ width: "7%" }}>Incubation Temp. (°C)</th>
                <th className={TH} style={{ width: "7%" }}>Incubation Time (Hr.)</th>
                <th className={TH} style={{ width: "12%" }}>Observation</th>
                <th className={TH} style={{ width: "12%" }}>Reference Culture</th>
                <th className={TH} style={{ width: "12%" }}>Blank</th>
              </tr>
            </thead>
            <tbody>
              {identificationRows.map((row: any, ri: number) => (
                <tr key={ri} className={ri % 2 === 0 ? "" : "bg-gray-50"}>
                  <td className={TD}>{row.testName || "---"}</td>
                  <td className={`${TD} text-center`}>{row.analysisStarted ? formatDateOnly(row.analysisStarted) : "---"}</td>
                  <td className={`${TD} text-center`}>{row.analysisCompleted ? formatDateOnly(row.analysisCompleted) : "---"}</td>
                  <td className={TD}>{row.mediaReagent || "---"}</td>
                  <td className={`${TD} text-center`}>{row.incubationTemp || "---"}</td>
                  <td className={`${TD} text-center`}>{row.incubationTime || "---"}</td>
                  <td className={TD}>{row.observation || "---"}</td>
                  <td className={TD}>{row.referenceCulture || "---"}</td>
                  <td className={TD}>{row.blank || "---"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Final Result */}
      {prep.result && (
        <div className="mb-3">
          <p className="font-bold uppercase text-sm">Final Result</p>
          <span style={{ whiteSpace: "pre-wrap" }}>{prep.result}</span>
        </div>
      )}
    </div>
  );
};

// ── Sterility Preparation print renderer ─────────────────────────────────────

const SterilityPrepPrint: React.FC<{ prep: any; idx: number }> = ({ prep, idx }) => {
  const observationDays: any[] = prep.observationDays || [];
  const subCultureRows: any[] = prep.subCultureRows || [];

  return (
    <div className="mb-4">
      <p className="font-bold text-md mb-2 underline inline-block">
        {prep.label || `Sterility Preparation ${idx + 1}`}
      </p>

      {/* Test Method */}
      {prep.testType && (
        <div className="mb-3">
          <table className="w-full border border-black text-xs">
            <tbody>
              <tr>
                <td className={`${TH} w-1/4`}>Test Type</td>
                <td className={TD}>{prep.testType}</td>
              </tr>
              {prep.testType === "Membrane Filtration" && (
                <>
                  {prep.filterPaperName && (
                    <tr>
                      <td className={`${TH} w-1/4`}>Filter Paper Name</td>
                      <td className={TD}>{prep.filterPaperName}</td>
                    </tr>
                  )}
                  {prep.filterPaperDiameter && (
                    <tr>
                      <td className={`${TH} w-1/4`}>Diameter</td>
                      <td className={TD}>{prep.filterPaperDiameter} mm</td>
                    </tr>
                  )}
                  {prep.filterPaperPoreSize && (
                    <tr>
                      <td className={`${TH} w-1/4`}>Pore Size</td>
                      <td className={TD}>{prep.filterPaperPoreSize} µm</td>
                    </tr>
                  )}
                  {prep.filterPaperUsage && (
                    <tr>
                      <td className={`${TH} w-1/4`}>Filter Paper Used As</td>
                      <td className={TD}>{prep.filterPaperUsage}</td>
                    </tr>
                  )}
                </>
              )}
            </tbody>
          </table>
        </div>
      )}


      {/* 14-Day Observations */}
      {observationDays.length > 0 && (
        <div className="mb-3">
          <p className="font-bold uppercase text-sm mb-2">Observations (Daily Growth)</p>
          <p className="text-xs mb-1 italic">
            FTM incubated at 30–35°C &amp; SCDM incubated at 20–25°C
          </p>
          <table className="w-full border border-black text-xs">
            <thead>
              <tr className="bg-gray-100">
                <th className={TH} rowSpan={2} style={{ width: "5%" }}>Day</th>
                <th className={TH} rowSpan={2} style={{ width: "10%" }}>Date</th>
                <th className={`${TH} text-center`} colSpan={2} style={{ width: "20%" }}>Sample</th>
                <th className={`${TH} text-center`} colSpan={2} style={{ width: "20%" }}>Positive Control</th>
                <th className={`${TH} text-center`} colSpan={2} style={{ width: "20%" }}>Blank</th>
              </tr>
              <tr className="bg-gray-100">
                <th className={`${TH} text-center`}>FTM</th>
                <th className={`${TH} text-center`}>SCDM</th>
                <th className={`${TH} text-center`}>FTM</th>
                <th className={`${TH} text-center`}>SCDM</th>
                <th className={`${TH} text-center`}>FTM</th>
                <th className={`${TH} text-center`}>SCDM</th>
              </tr>
            </thead>
            <tbody>
              {observationDays.map((day: any, di: number) => (
                <tr key={di} className={di % 2 === 0 ? "" : "bg-gray-50"}>
                  <td className={`${TD} text-center font-semibold`}>{day.day ?? di + 1}</td>
                  <td className={`${TD} text-center`}>{day.date ? formatDateOnly(day.date) : "---"}</td>
                  <td className={`${TD} text-center`}>{day.sampleFTM || "—"}</td>
                  <td className={`${TD} text-center`}>{day.sampleSCDM || "—"}</td>
                  <td className={`${TD} text-center`}>{day.positiveControlFTM || "—"}</td>
                  <td className={`${TD} text-center`}>{day.positiveControlSCDM || "—"}</td>
                  <td className={`${TD} text-center`}>{day.blankFTM || "—"}</td>
                  <td className={`${TD} text-center`}>{day.blankSCDM || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Sub-culture (After Turbidity) */}
      {subCultureRows.length > 0 && (
        <div className="mb-3">
          <p className="font-bold uppercase text-sm mb-2">Observations After Turbidity</p>
          <table className="w-full border border-black text-xs">
            <thead>
              <tr className="bg-gray-100">
                <th className={TH} rowSpan={2} style={{ width: "12%" }}>Date</th>
                <th className={`${TH} text-center`} colSpan={3}>Fluid Thioglycollate Media (FTM)</th>
                <th className={`${TH} text-center`} colSpan={3}>Soyabean Casein Digest Media (SCDM)</th>
              </tr>
              <tr className="bg-gray-100">
                <th className={`${TH} text-center`}>Sample</th>
                <th className={`${TH} text-center`}>+ve Control</th>
                <th className={`${TH} text-center`}>Blank</th>
                <th className={`${TH} text-center`}>Sample</th>
                <th className={`${TH} text-center`}>+ve Control</th>
                <th className={`${TH} text-center`}>Blank</th>
              </tr>
            </thead>
            <tbody>
              {subCultureRows.map((row: any, si: number) => (
                <tr key={si} className={si % 2 === 0 ? "" : "bg-gray-50"}>
                  <td className={`${TD} text-center`}>{row.date ? formatDateOnly(row.date) : "---"}</td>
                  <td className={`${TD} text-center`}>{row.ftmSampleResult || "—"}</td>
                  <td className={`${TD} text-center`}>{row.ftmPositiveControlResult || "—"}</td>
                  <td className={`${TD} text-center`}>{row.ftmBlankResult || "—"}</td>
                  <td className={`${TD} text-center`}>{row.scdmSampleResult || "—"}</td>
                  <td className={`${TD} text-center`}>{row.scdmPositiveControlResult || "—"}</td>
                  <td className={`${TD} text-center`}>{row.scdmBlankResult || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Final Result */}
      {prep.finalResult && (
        <div className="mb-3">
          <p className="font-bold uppercase text-sm">Final Result</p>
          <span className="text-sm">
            {prep.finalResult === "Complies"
              ? "The product COMPLIES with the Sterility Test."
              : "The product DOES NOT COMPLY with the Sterility Test."}
          </span>
        </div>
      )}
    </div>
  );
};

// ── E.coli Preparation print renderer ────────────────────────────────────────

const EcoliPrepPrint: React.FC<{ prep: any; idx: number }> = ({ prep, idx }) => {
  const observationRows: any[] = prep.observationRows || [];
  const biochemicalRows: any[] = prep.biochemicalRows || [];

  return (
    <div className="mb-4">
      <p className="font-bold text-md mb-2 underline inline-block">
        {prep.label || `E. coli Preparation ${idx + 1}`}
      </p>

      {/* Observations */}
      {observationRows.length > 0 && (
        <div className="mb-3">
          <p className="font-bold uppercase text-sm mb-2">Observations</p>
          <table className="w-full border border-black text-xs">
            <thead>
              <tr className="bg-gray-100">
                <th className={TH} style={{ width: "22%" }}>Medium</th>
                <th className={TH} style={{ width: "14%" }}>Colony / Growth Characteristics</th>
                <th className={TH} style={{ width: "7%" }}>Analysis Started</th>
                <th className={TH} style={{ width: "7%" }}>Analysis Completed</th>
                <th className={TH} style={{ width: "7%" }}>Incubation Temp. (°C)</th>
                <th className={TH} style={{ width: "7%" }}>Incubation Time (Hr.)</th>
                <th className={TH} style={{ width: "12%" }}>Sample</th>
                <th className={TH} style={{ width: "12%" }}>Ref. Culture</th>
                <th className={TH} style={{ width: "12%" }}>Blank</th>
              </tr>
            </thead>
            <tbody>
              {observationRows.map((row: any, ri: number) => (
                <tr key={ri} className={ri % 2 === 0 ? "" : "bg-gray-50"}>
                  <td className={TD}>{row.medium || "---"}</td>
                  <td className={TD}>{row.colonyGrowthCharacteristics || row.colonyCharacteristics || "---"}</td>
                  <td className={`${TD} text-center`}>{row.analysisStarted ? formatDateOnly(row.analysisStarted) : "---"}</td>
                  <td className={`${TD} text-center`}>{row.analysisCompleted ? formatDateOnly(row.analysisCompleted) : "---"}</td>
                  <td className={`${TD} text-center`}>{row.incubationTemp || "---"}</td>
                  <td className={`${TD} text-center`}>{row.incubationTime || "---"}</td>
                  <td className={TD}>{row.sample || "---"}</td>
                  <td className={TD}>{row.referenceCulture || row.reference || "---"}</td>
                  <td className={TD}>{row.blank || "---"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}


      {/* Biochemical Confirmation */}
      {biochemicalRows.length > 0 && (
        <div className="mb-3">
          <p className="font-bold uppercase text-sm mb-2">Biochemical Confirmation</p>
          <table className="w-full border border-black text-xs">
            <thead>
              <tr className="bg-gray-100">
                <th className={TH} style={{ width: "22%" }}>Medium</th>
                <th className={TH} style={{ width: "14%" }}>Colony / Growth Characteristics</th>
                <th className={TH} style={{ width: "7%" }}>Analysis Started</th>
                <th className={TH} style={{ width: "7%" }}>Analysis Completed</th>
                <th className={TH} style={{ width: "7%" }}>Incubation Temp. (°C)</th>
                <th className={TH} style={{ width: "7%" }}>Incubation Time (Hr.)</th>
                <th className={TH} style={{ width: "12%" }}>Sample</th>
                <th className={TH} style={{ width: "12%" }}>Ref. Culture</th>
                <th className={TH} style={{ width: "12%" }}>Blank</th>
              </tr>
            </thead>
            <tbody>
              {biochemicalRows.map((row: any, ri: number) => (
                <tr key={ri} className={ri % 2 === 0 ? "" : "bg-gray-50"}>
                  <td className={TD}>{row.medium || "---"}</td>
                  <td className={TD}>{row.colonyGrowthCharacteristics || row.colonyCharacteristics || "---"}</td>
                  <td className={`${TD} text-center`}>{row.analysisStarted ? formatDateOnly(row.analysisStarted) : "---"}</td>
                  <td className={`${TD} text-center`}>{row.analysisCompleted ? formatDateOnly(row.analysisCompleted) : "---"}</td>
                  <td className={`${TD} text-center`}>{row.incubationTemp || "---"}</td>
                  <td className={`${TD} text-center`}>{row.incubationTime || "---"}</td>
                  <td className={TD}>{row.sample || "---"}</td>
                  <td className={TD}>{row.referenceCulture || row.reference || "---"}</td>
                  <td className={TD}>{row.blank || "---"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Final Result */}
      {prep.result && (
        <div className="mb-3">
          <p className="font-bold uppercase text-sm">Final Result</p>
          <span style={{ whiteSpace: "pre-wrap" }}>{prep.result}</span>
        </div>
      )}
    </div>
  );
};

// ── Shared inoculation+biochemical renderer for Salmonella / Shigella / Pseudomonas / Staphylococcus ──

const InoculationBiochemicalPrepPrint: React.FC<{
  prep: any;
  idx: number;
  typeLabel: string;
  biochemicalLabel?: string;
  /** Salmonella/Shigella biochemical rows have incubationCondition instead of separate temp/time */
  biochemicalHasCondition?: boolean;
  /** Staphylococcus biochemical rows have separate incubationTemp + incubationTime */
  biochemicalHasTempTime?: boolean;
}> = ({ prep, idx, typeLabel, biochemicalLabel = "Biochemical Tests", biochemicalHasCondition = false, biochemicalHasTempTime = false }) => {
  const inoculationRows: any[] = prep.inoculationRows || [];
  const biochemicalRows: any[] = prep.biochemicalRows || [];

  return (
    <div className="mb-4">
      <p className="font-bold text-md mb-2 underline inline-block">
        {prep.label || `${typeLabel} ${idx + 1}`}
      </p>

      {/* Inoculation Observations */}
      {inoculationRows.length > 0 && (
        <div className="mb-3">
          <p className="font-bold uppercase text-sm mb-2">Inoculation Observations</p>
          <table className="w-full border border-black text-xs">
            <thead>
              <tr className="bg-gray-100">
                <th className={TH} style={{ width: "22%" }}>Medium</th>
                <th className={TH} style={{ width: "14%" }}>Colony / Growth Characteristics</th>
                <th className={TH} style={{ width: "7%" }}>Analysis Started</th>
                <th className={TH} style={{ width: "7%" }}>Analysis Completed</th>
                <th className={TH} style={{ width: "7%" }}>Incubation Temp. (°C)</th>
                <th className={TH} style={{ width: "7%" }}>Incubation Time (Hr.)</th>
                <th className={TH} style={{ width: "12%" }}>Sample</th>
                <th className={TH} style={{ width: "12%" }}>Reference</th>
                <th className={TH} style={{ width: "12%" }}>Blank</th>
              </tr>
            </thead>
            <tbody>
              {inoculationRows.map((row: any, ri: number) => (
                <tr key={ri} className={ri % 2 === 0 ? "" : "bg-gray-50"}>
                  <td className={TD}>{row.medium || "---"}</td>
                  <td className={TD}>{row.colonyCharacteristics || row.colonyGrowthCharacteristics || "---"}</td>
                  <td className={`${TD} text-center`}>{row.analysisStarted ? formatDateOnly(row.analysisStarted) : "---"}</td>
                  <td className={`${TD} text-center`}>{row.analysisCompleted ? formatDateOnly(row.analysisCompleted) : "---"}</td>
                  <td className={`${TD} text-center`}>{row.incubationTemp || "---"}</td>
                  <td className={`${TD} text-center`}>{row.incubationTime || "---"}</td>
                  <td className={TD}>{row.sampleResult || row.sample || "---"}</td>
                  <td className={TD}>{row.referenceResult || row.reference || "---"}</td>
                  <td className={TD}>{row.blankResult || row.blank || "---"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}


      {/* Biochemical Tests */}
      {biochemicalRows.length > 0 && (
        <div className="mb-3">
          <p className="font-bold uppercase text-sm mb-2">{biochemicalLabel}</p>
          <table className="w-full border border-black text-xs">
            <thead>
              <tr className="bg-gray-100">
                <th className={TH} style={{ width: "20%" }}>Test Name / Medium</th>
                <th className={TH} style={{ width: "7%" }}>Analysis Started</th>
                <th className={TH} style={{ width: "7%" }}>Analysis Completed</th>
                <th className={TH} style={{ width: "14%" }}>Media / Reagent</th>
                {biochemicalHasCondition && <th className={TH} style={{ width: "12%" }}>Incubation Condition</th>}
                {biochemicalHasTempTime && (
                  <>
                    <th className={TH} style={{ width: "7%" }}>Incubation Temp. (°C)</th>
                    <th className={TH} style={{ width: "7%" }}>Incubation Time (Hr.)</th>
                  </>
                )}
                <th className={TH} style={{ width: "11%" }}>Observation</th>
                <th className={TH} style={{ width: "11%" }}>Reference</th>
                <th className={TH} style={{ width: "11%" }}>Blank</th>
              </tr>
            </thead>
            <tbody>
              {biochemicalRows.map((row: any, ri: number) => (
                <tr key={ri} className={ri % 2 === 0 ? "" : "bg-gray-50"}>
                  <td className={TD}>{row.testName || row.medium || "---"}</td>
                  <td className={`${TD} text-center`}>{row.analysisStarted ? formatDateOnly(row.analysisStarted) : "---"}</td>
                  <td className={`${TD} text-center`}>{row.analysisCompleted ? formatDateOnly(row.analysisCompleted) : "---"}</td>
                  <td className={TD}>{row.mediaReagent || row.medium || "---"}</td>
                  {biochemicalHasCondition && <td className={TD}>{row.incubationCondition || "---"}</td>}
                  {biochemicalHasTempTime && (
                    <>
                      <td className={`${TD} text-center`}>{row.incubationTemp || "---"}</td>
                      <td className={`${TD} text-center`}>{row.incubationTime || "---"}</td>
                    </>
                  )}
                  <td className={TD}>{row.observation || "---"}</td>
                  <td className={TD}>{row.referenceObservation || row.referenceResult || row.reference || "---"}</td>
                  <td className={TD}>{row.blankObservation || row.blankResult || row.blank || "---"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Final Result */}
      {prep.result && (
        <div className="mb-3">
          <p className="font-bold uppercase text-sm">Final Result</p>
          <span style={{ whiteSpace: "pre-wrap" }}>{prep.result}</span>
        </div>
      )}
    </div>
  );
};

// ── Generic inoculation-row preparation renderer (Sterility, E.coli, etc.) ───

interface GenericInoculationRow {
  medium?: string;
  colonyCharacteristics?: string;
  analysisStarted?: string;
  analysisCompleted?: string;
  incubationTemp?: string;
  incubationTime?: string;
  observation?: string;
  referenceCulture?: string;
  reference?: string;
  blank?: string;
  sample?: string;
  sampleResult?: string;
  referenceResult?: string;
  blankResult?: string;
  [key: string]: any;
}

const GenericPrepPrint: React.FC<{
  prep: any;
  idx: number;
  prepType: string;
  typeLabel: string;
  showSampleRefBlank?: boolean;
}> = ({ prep, idx, typeLabel, showSampleRefBlank = false }) => {
  const inoculationRows: GenericInoculationRow[] = prep.inoculationRows || [];
  const biochemicalRows: any[] = prep.biochemicalRows || [];
  const result: string = prep.result || "";

  if (inoculationRows.length === 0 && biochemicalRows.length === 0 && !result) return null;

  return (
    <div className="mb-4">
      <p className="font-bold text-md mb-2 underline inline-block">
        {prep.label || `${typeLabel} ${idx + 1}`}
        <span className="ml-2 font-normal text-xs text-gray-500">— {typeLabel}</span>
      </p>

      {inoculationRows.length > 0 && (
        <div className="mb-3">
          <p className="font-bold uppercase text-sm mb-2">Inoculation Observations</p>
          <table className="w-full border border-black text-xs">
            <thead>
              <tr className="bg-gray-100">
                <th className={TH} style={{ width: "22%" }}>Medium</th>
                <th className={TH} style={{ width: "14%" }}>Colony / Growth Characteristics</th>
                <th className={TH} style={{ width: "7%" }}>Analysis Started</th>
                <th className={TH} style={{ width: "7%" }}>Analysis Completed</th>
                <th className={TH} style={{ width: "7%" }}>Incubation Temp. (°C)</th>
                <th className={TH} style={{ width: "7%" }}>Incubation Time (Hr.)</th>
                {showSampleRefBlank ? (
                  <>
                    <th className={TH} style={{ width: "12%" }}>Sample</th>
                    <th className={TH} style={{ width: "12%" }}>Reference</th>
                    <th className={TH} style={{ width: "12%" }}>Blank</th>
                  </>
                ) : (
                  <>
                    <th className={TH} style={{ width: "12%" }}>Observation</th>
                    <th className={TH} style={{ width: "12%" }}>Reference Culture</th>
                    <th className={TH} style={{ width: "12%" }}>Blank</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {inoculationRows.map((row, ri) => (
                <tr key={ri} className={ri % 2 === 0 ? "" : "bg-gray-50"}>
                  <td className={TD}>{row.medium || "---"}</td>
                  <td className={TD}>{row.colonyCharacteristics || "---"}</td>
                  <td className={`${TD} text-center`}>
                    {row.analysisStarted ? formatDateOnly(row.analysisStarted) : "---"}
                  </td>
                  <td className={`${TD} text-center`}>
                    {row.analysisCompleted ? formatDateOnly(row.analysisCompleted) : "---"}
                  </td>
                  <td className={`${TD} text-center`}>{row.incubationTemp || "---"}</td>
                  <td className={`${TD} text-center`}>{row.incubationTime || "---"}</td>
                  {showSampleRefBlank ? (
                    <>
                      <td className={TD}>{row.sample || row.sampleResult || "---"}</td>
                      <td className={TD}>{row.reference || row.referenceResult || "---"}</td>
                      <td className={TD}>{row.blank || row.blankResult || "---"}</td>
                    </>
                  ) : (
                    <>
                      <td className={TD}>{row.observation || "---"}</td>
                      <td className={TD}>{row.referenceCulture || row.reference || "---"}</td>
                      <td className={TD}>{row.blank || "---"}</td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}


      {biochemicalRows.length > 0 && (
        <div className="mb-3">
          <p className="font-bold uppercase text-sm mb-2">Biochemical Identification</p>
          <table className="w-full border border-black text-xs">
            <thead>
              <tr className="bg-gray-100">
                <th className={TH} style={{ width: "22%" }}>Name of the Test</th>
                <th className={TH} style={{ width: "8%" }}>Analysis Started</th>
                <th className={TH} style={{ width: "8%" }}>Analysis Completed</th>
                <th className={TH} style={{ width: "16%" }}>Media / Reagent</th>
                <th className={TH} style={{ width: "8%" }}>Incubation Temp. (°C)</th>
                <th className={TH} style={{ width: "8%" }}>Incubation Time (Hr.)</th>
                <th className={TH} style={{ width: "15%" }}>Observation</th>
                <th className={TH} style={{ width: "15%" }}>Blank</th>
              </tr>
            </thead>
            <tbody>
              {biochemicalRows.map((row: any, ri: number) => (
                <tr key={ri} className={ri % 2 === 0 ? "" : "bg-gray-50"}>
                  <td className={TD}>{row.testName || "---"}</td>
                  <td className={`${TD} text-center`}>
                    {row.analysisStarted ? formatDateOnly(row.analysisStarted) : "---"}
                  </td>
                  <td className={`${TD} text-center`}>
                    {row.analysisCompleted ? formatDateOnly(row.analysisCompleted) : "---"}
                  </td>
                  <td className={TD}>{row.mediaReagent || "---"}</td>
                  <td className={`${TD} text-center`}>{row.incubationTemp || "---"}</td>
                  <td className={`${TD} text-center`}>{row.incubationTime || "---"}</td>
                  <td className={TD}>{row.observation || "---"}</td>
                  <td className={TD}>{row.blank || "---"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {result && (
        <div className="mb-3">
          <p className="font-bold uppercase text-sm">Final Result</p>
          <span style={{ whiteSpace: "pre-wrap" }}>{prep.result}</span>
        </div>
      )}
    </div>
  );
};


// ── TVC (Water) / TYMC / TAMC Preparation print renderer ─────────────────────
// All three share the same data shape from TVCWaterPreparation:
//   inoculationVolume, incubationTemp(Unit), incubationTime(Unit),
//   observationRows[{replicate, dilutionExponent, dilutionCount, blank}],
//   calculatedResult, result

const formatDilutionExponent = (exp: number | null | undefined): string => {
  if (exp === null || exp === undefined) return "—";
  if (exp === 0) return "10⁰";
  const chars = "⁰¹²³⁴⁵⁶⁷⁸⁹";
  const sup = String(Math.abs(exp))
    .split("")
    .map((d) => chars[parseInt(d)])
    .join("");
  return `10⁻${sup}`;
};

const TVCStylePrepPrint: React.FC<{
  prep: any;
  idx: number;
  typeLabel: string;
}> = ({ prep, idx, typeLabel }) => {
  const observationRows: any[] = prep.observationRows || [];
  // shared dilution exponent is the same on both rows
  const dilutionExp =
    observationRows.length > 0 ? observationRows[0].dilutionExponent : null;

  return (
    <div className="mb-4">
      <p className="font-bold text-md mb-1 underline inline-block">
        {prep.label || `${typeLabel} ${idx + 1}`}
      </p>

      {/* ── Plating Setup ── */}
      {prep.inoculationVolume && (
        <div className="mb-3">
          <p className="font-bold uppercase text-sm mb-1">Plating Setup</p>
          <table className="w-full border border-black text-xs">
            <tbody>
              <tr>
                <td className={`${TH} w-1/3`}>Inoculation Volume (Pour Plate)</td>
                <td className={TD}>{prep.inoculationVolume} mL</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* ── Observation ── */}
      {observationRows.length > 0 && (
        <div className="mb-3">
          <p className="font-bold uppercase text-sm mb-1">Observation</p>
          <table className="w-full border border-black text-xs">
            <thead>
              <tr className="bg-gray-100">
                <th className={TH} style={{ width: "18%" }}>
                  Incubation Temp.&nbsp;({prep.incubationTempUnit || "℃"})
                </th>
                <th className={TH} style={{ width: "18%" }}>
                  Time&nbsp;({prep.incubationTimeUnit || "Hr."})
                </th>
                <th className={TH} style={{ width: "18%" }}>Replicate</th>
                <th className={TH} style={{ width: "20%" }}>
                  Dilution Factor&nbsp;({formatDilutionExponent(dilutionExp)})
                </th>
                <th className={TH} style={{ width: "26%" }}>Blank</th>
              </tr>
            </thead>
            <tbody>
              {observationRows.map((row: any, ri: number) => (
                <tr key={ri} className={ri % 2 === 0 ? "" : "bg-gray-50"}>
                  {/* Incubation Temp — rowspan 2, rendered only for first row */}
                  {ri === 0 && (
                    <td
                      className={`${TD} text-center align-middle`}
                      rowSpan={observationRows.length}
                    >
                      {prep.incubationTemp || "---"}
                    </td>
                  )}
                  {/* Time — rowspan 2, rendered only for first row */}
                  {ri === 0 && (
                    <td
                      className={`${TD} text-center align-middle`}
                      rowSpan={observationRows.length}
                    >
                      {prep.incubationTime || "---"}
                    </td>
                  )}
                  <td className={`${TD} text-center`}>
                    {row.replicate || `R${ri + 1}`}
                  </td>

                  <td className={`${TD} text-center`}>
                    {row.dilutionCount || "---"}
                  </td>
                  <td className={`${TD} text-center`}>
                    {row.blank || "---"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Result Calculation ── */}
      {prep.calculatedResult && (
        <div className="mb-3">
          <p className="font-bold uppercase text-sm mb-1">Result Calculation</p>
          <table className="w-full border border-black text-xs">
            <tbody>
              <tr>
                <td className={`${TH} w-1/3`}>Final Result</td>
                <td className={`${TD} font-bold`}>
                  {prep.calculatedResult === "<10"
                    ? "<10"
                    : prep.calculatedResult === "TNTC"
                      ? "TNTC"
                      : `${prep.calculatedResult} ${prep.calculatedResultUnit}`}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* ── Final Result ── */}
      {prep.result && (
        <div className="mb-3">
          <p className="font-bold uppercase text-sm">Final Result</p>
          <span style={{ whiteSpace: "pre-wrap" }}>{prep.result}</span>
        </div>
      )}
    </div>
  );
};

// ── renderSignatureSection ────────────────────────────────────────────────────

const renderSignatureSection = (param: any) => (
  <div className="mb-2">
    <table
      className="file-signature-footer"
      style={{
        width: "100%",
        borderCollapse: "collapse",
        fontSize: "10px",
        marginTop: "4px",
        border: "1px solid black",
        breakInside: "avoid",
        pageBreakInside: "avoid",
      }}
    >
      <tbody>
        <tr>
          <td style={{ padding: "4px 8px", border: "1px solid black" }}>Analyzed By</td>
          <td style={{ padding: "4px 8px", border: "1px solid black", fontWeight: "bold" }}>
            {param.analyzedByName || "---"}
          </td>
          <td style={{ padding: "4px 8px", border: "1px solid black" }}>Analyzed On</td>
          <td style={{ padding: "4px 8px", border: "1px solid black", fontWeight: "bold" }}>
            {formatDt(param.analysisCompletionDate)}
          </td>
        </tr>
        <tr>
          <td style={{ padding: "4px 8px", border: "1px solid black" }}>Reviewed By</td>
          <td style={{ padding: "4px 8px", border: "1px solid black", fontWeight: "bold" }}>
            {param.approvedByReviewerName || "---"}
          </td>
          <td style={{ padding: "4px 8px", border: "1px solid black" }}>Reviewed On</td>
          <td style={{ padding: "4px 8px", border: "1px solid black", fontWeight: "bold" }}>
            {formatDt(param.approvedAtReviewer)}
          </td>
        </tr>
        <tr>
          <td style={{ padding: "4px 8px", border: "1px solid black" }}>Approved By</td>
          <td style={{ padding: "4px 8px", border: "1px solid black", fontWeight: "bold" }}>
            {param.approvedByQAName || "---"}
          </td>
          <td style={{ padding: "4px 8px", border: "1px solid black" }}>Approved On</td>
          <td style={{ padding: "4px 8px", border: "1px solid black", fontWeight: "bold" }}>
            {formatDt(param.approvedAtQA)}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
);

// ── renderHeaderAndSampleSection ──────────────────────────────────────────────

const renderHeaderAndSampleSection = (
  worksheetInfo: WorksheetDetail,
  sampleData: SampleData,
  param: any,
  paramIdx: number,
) => (
  <div className="keep-together">
    {/* Company / title block */}
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

    {/* Registration / dates row */}
    <div className="mb-2">
      <table className="w-full table-fixed border border-black text-sm">
        <tbody>
          <tr>
            <td className="border border-black px-3 py-1.5" colSpan={2}>
              Registration No: {worksheetInfo.sample.registrationNo}
            </td>
          </tr>
          <tr>
            <td className="border border-black px-3 py-1.5">
              Sample Name: {worksheetInfo.sample.sampleName}
            </td>
            <td className="border border-black px-3 py-1.5">
              Sample Code: {worksheetInfo.sample.sampleCode}
            </td>
          </tr>
          <tr>
            <td className="border border-black px-3 py-1.5">
              Nature of Sample: {worksheetInfo.sample.natureOfSample || ""}
            </td>
            <td className="border border-black px-3 py-1.5">
              Sample Quantity: {worksheetInfo.sample.sampleQuantity || ""}
            </td>
          </tr>
          <tr>
            <td className="border border-black px-3 py-1.5">
              Due Date: {sampleData.tatDate || ""}
            </td>
            <td className="border border-black px-3 py-1.5">
              Date of Receipt: {sampleData.recieptDate || ""}
            </td>
          </tr>
          <tr>
            <td className="border border-black px-3 py-1.5">
              Analysis Started On: {sampleData.analysisStartDate || ""}
            </td>
            <td className="border border-black px-3 py-1.5">
              Analyzed Completed On: {sampleData.analysisCompletionDate || ""}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    {/* Sample particulars table */}
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
          <tr>
            <td className="w-10 px-4 py-3 border-r border-black text-center">3</td>
            <td className="w-1/3 px-4 py-3 border-r border-black">
              Method(s) of Analysis / Testing
            </td>
            <td className="px-3 py-3">{param.methodName}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
);

// ── Preparation type label map ────────────────────────────────────────────────

const PREP_TYPE_LABELS: Record<string, string> = {
  sterility: "Sterility Test",
  bet: "Bacterial Endotoxin Test",
  ecoli: "E. coli Detection",
  shigella: "Shigella Detection",
  clostridium: "Clostridium Detection",
  salmonella: "Salmonella Detection",
  staphylococcus: "Staphylococcus Detection",
  pseudomonas: "Pseudomonas Detection",
  bileTolerant: "Bile-Tolerant Gram-Negative Bacteria",
  calbicans: "C. albicans Detection",
  bcepacia: "B. cepacia Detection",
  totalViableCountWater: "Total Viable Count – Water Sample",
  tymc: "Total Yeast And Mould Count (TYMC)",
  tamc: "Total Aerobic Microbial Count (TAMC)",
};

// ── Main component ────────────────────────────────────────────────────────────

const MicroPrintReport: React.FC<MicroPrintReportProps> = ({
  worksheetInfo,
  sampleData,
  instruments,
  chemicals,
  media,
}) => {

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
              margin: 0 !important;
              padding: 0 !important;
              background: white;
              height: auto !important;
              min-height: 0 !important;
              overflow: visible !important;
            }

            .print-container {
              width: 100%;
              max-width: none;
              margin: 0;
              padding: 0;
              box-shadow: none;
              height: auto !important;
            }

            /* Everything flows freely by default */
            * {
              break-inside: auto !important;
              break-before: auto !important;
              break-after: auto !important;
            }

            /* New parameter starts on a new page — must come AFTER the wildcard reset */
            .page-break-before {
              break-before: page !important;
              page-break-before: always !important;
            }

            /* Individual table rows must not split mid-row */
            tr { break-inside: avoid !important; }

            /* Header, parameter heading, and grouped blocks stay intact */
            .keep-together {
              break-inside: avoid !important;
              page-break-inside: avoid !important;
            }

            /* Section containers (instruments, chemicals, media, prep blocks) */
            .section-container {
              break-inside: avoid !important;
              page-break-inside: avoid !important;
            }

            table { border-collapse: collapse; }
            thead { display: table-header-group; }

            /* Signature footer — always kept together, never orphaned */
            .file-signature-footer {
              break-inside: avoid !important;
              page-break-inside: avoid !important;
            }

            /* Signature + preceding content grouped so sig never orphans at page bottom */
            .signature-group {
              break-inside: avoid !important;
              page-break-inside: avoid !important;
            }

            .pdf-page-with-sig {
              break-inside: avoid !important;
              page-break-inside: avoid !important;
            }

            .pdf-page-with-sig img {
              max-height: calc(100vh - 60px) !important;
              width: 100% !important;
              object-fit: contain !important;
            }
          }

          @media screen {
            .print-container {
              max-width: 210mm;
              margin: 24px auto;
              padding: 6mm 15mm 4mm 15mm;
              background: white;
              box-shadow: 0 0 10px rgba(0,0,0,0.1);
            }
          }
        `}
      </style>

      {/* ── Main print content ── */}
      <div className="print-container">
        {worksheetInfo.parameters.map((param: any, paramIdx: number) => {
          // Parse all preparation groups from the stored JSON list
          const allPreps: any[] = safeJSONParse(param.preparations, []);

          const betPreps = allPreps
            .filter((p: any) => p.preparationType === "bet")
            .map((p: any) => safeJSONParse(p.content, {}));

          const sterilityPreps = allPreps
            .filter((p: any) => p.preparationType === "sterility")
            .map((p: any) => ({ ...safeJSONParse(p.content, {}), label: p.label }));

          const ecoliPreps = allPreps
            .filter((p: any) => p.preparationType === "ecoli")
            .map((p: any) => ({ ...safeJSONParse(p.content, {}), label: p.label }));

          const shigellaPreps = allPreps
            .filter((p: any) => p.preparationType === "shigella")
            .map((p: any) => ({ ...safeJSONParse(p.content, {}), label: p.label }));

          const clostridiumPreps = allPreps
            .filter((p: any) => p.preparationType === "clostridium")
            .map((p: any) => safeJSONParse(p.content, {}));

          const salmonellaPreps = allPreps
            .filter((p: any) => p.preparationType === "salmonella")
            .map((p: any) => ({ ...safeJSONParse(p.content, {}), label: p.label }));

          const staphylococcusPreps = allPreps
            .filter((p: any) => p.preparationType === "staphylococcus")
            .map((p: any) => ({ ...safeJSONParse(p.content, {}), label: p.label }));

          const pseudomonasPreps = allPreps
            .filter((p: any) => p.preparationType === "pseudomonas")
            .map((p: any) => ({ ...safeJSONParse(p.content, {}), label: p.label }));

          const bileTolerantPreps = allPreps
            .filter((p: any) => p.preparationType === "bileTolerant")
            .map((p: any) => safeJSONParse(p.content, {}));

          const bcepaciaPreps = allPreps
            .filter((p: any) => p.preparationType === "bcepacia")
            .map((p: any) => ({ ...safeJSONParse(p.content, {}), label: p.label }));

          const calbicansPreps = allPreps
            .filter((p: any) => p.preparationType === "calbicans")
            .map((p: any) => ({ ...safeJSONParse(p.content, {}), label: p.label }));

          const tvcWaterPreps = allPreps
            .filter((p: any) => p.preparationType === "totalViableCountWater")
            .map((p: any) => ({ ...safeJSONParse(p.content, {}), label: p.label }));

          const tymcPreps = allPreps
            .filter((p: any) => p.preparationType === "tymc")
            .map((p: any) => ({ ...safeJSONParse(p.content, {}), label: p.label }));

          const tamcPreps = allPreps
            .filter((p: any) => p.preparationType === "tamc")
            .map((p: any) => ({ ...safeJSONParse(p.content, {}), label: p.label }));

          // Other prep types (generic) — known types are all handled explicitly above
          const knownPrepTypes = new Set([
            "bet", "sterility", "ecoli", "shigella", "clostridium", "salmonella",
            "staphylococcus", "pseudomonas", "bileTolerant", "bcepacia", "calbicans",
            "totalViableCountWater", "tymc", "tamc",
          ]);
          const otherPreps: { type: string; data: any }[] = [];
          allPreps
            .filter((p: any) => !knownPrepTypes.has(p.preparationType))
            .forEach((p: any) => {
              otherPreps.push({ type: p.preparationType, data: { ...safeJSONParse(p.content, {}), label: p.label } });
            });

          // Signature data for attached files
          const fileSig: FileSignatureData = {
            analyzedByName: param.analyzedByName || null,
            analysisCompletionDate: param.analysisCompletionDate || null,
            approvedByReviewerName: param.approvedByReviewerName || null,
            approvedAtReviewer: param.approvedAtReviewer || null,
          };

          return (
            <div key={paramIdx} className={paramIdx > 0 ? "page-break-before" : ""}>

              {/* Header & sample section */}
              {renderHeaderAndSampleSection(worksheetInfo, sampleData, param, paramIdx)}

              {/* Parameter heading */}
              <div className="mt-4 keep-together">
                <h3 className="text-lg bg-gray-200 font-bold border border-black mb-3 px-3 py-2 uppercase">
                  Parameter: {param.parameterName} ({param.paraCode})
                </h3>
              </div>

              {/* ── Instruments Used ── */}
              {(() => {
                const filteredInstruments = (
                  Array.isArray(param.instruments) && param.instruments.length > 0
                    ? param.instruments
                    : (instruments || []).filter((inst: Instrument) => param.instrumentIds?.includes(inst.id))
                );
                if (filteredInstruments.length === 0) return null;
                return (
                  <div className="mb-4">
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
                        {filteredInstruments.map((inst: Instrument, idx: number) => (
                          <tr key={inst.instrumentId || (inst as any).id || idx}>
                            <td className="border border-black px-3 py-2">{inst.instrumentTag}</td>
                            <td className="border border-black px-3 py-2">{inst.name}</td>
                            <td className="border border-black px-3 py-2">
                              {inst.calibrationDoneDate ? String(inst.calibrationDoneDate).replace(/-/g, "/") : "N/A"}
                            </td>
                            <td className="border border-black px-3 py-2">
                              {inst.calibrationDueDate ? String(inst.calibrationDueDate).replace(/-/g, "/") : "N/A"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                );
              })()}

              {/* ── Chemicals / Reagents Used ── */}
              {(() => {
                const filteredChemicals = (
                  Array.isArray(param.chemicals) && param.chemicals.length > 0
                    ? param.chemicals
                    : (chemicals || []).filter((chem: Chemical) => param.chemicalIds?.includes(chem.slno))
                );

                console.log(filteredChemicals);


                if (filteredChemicals.length === 0) return null;
                return (
                  <div className="mb-4">
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
                        {filteredChemicals.map((chem: Chemical, idx: number) => (
                          <tr key={chem.slno || idx}>
                            <td className="border border-black px-3 py-2">{chem.name}</td>
                            <td className="border border-black px-3 py-2">{chem.code || "N/A"}</td>
                            <td className="border border-black px-3 py-2">{chem.make || "N/A"}</td>
                            <td className="border border-black px-3 py-2">{chem.batchNo || "N/A"}</td>
                            <td className="border border-black px-3 py-2">
                              {chem.exp_Date ? String(chem.exp_Date).replace(/-/g, "/") : "N/A"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                );
              })()}

              {/* ── Media Details ── */}
              {(() => {
                const filteredMedia = (
                  Array.isArray(param.media) && param.media.length > 0
                    ? param.media
                    : (media || []).filter((m: Media) =>
                      param.mediaIds?.map((id: string) => String(id).trim()).includes(String(m.id).trim()))
                );
                if (filteredMedia.length === 0) return null;
                return (
                  <div className="mb-4">
                    <h4 className="text-md uppercase font-bold mb-2">Media Details</h4>
                    <table className="w-full border border-black text-sm">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="border border-black px-3 py-2 text-left font-bold">Name of Media</th>
                          <th className="border border-black px-3 py-2 text-left font-bold">Code</th>
                          <th className="border border-black px-3 py-2 text-left font-bold">Quantity</th>
                          <th className="border border-black px-3 py-2 text-left font-bold">Exp. Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredMedia.map((m: Media, idx: number) => (
                          <tr key={(m as any).id || idx}>
                            <td className="border border-black px-3 py-2">{m.name}</td>
                            <td className="border border-black px-3 py-2">{m.code || "N/A"}</td>
                            <td className="border border-black px-3 py-2">
                              {`${m.quantityValue} ${m.quantityUnit}` || "N/A"}
                            </td>
                            <td className="border border-black px-3 py-2">
                              {m.expDate
                                ? m.expDate.replace(/-/g, "/")
                                : "N/A"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                );
              })()}

              {/* ── BET Preparations ── */}
              {betPreps.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-md mb-2"> <strong>Test Method:</strong> Bacterial Endotoxin Test By Gel-Clot Method</h4>
                  {betPreps.map((prep, i) => (
                    <BETPrepPrint key={i} prep={prep} idx={i} />
                  ))}
                </div>
              )}

              {/* ── Sterility Preparations ── */}
              {sterilityPreps.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-md mb-2"><strong>Test Method:</strong>Sterility Testing</h4>
                  {sterilityPreps.map((prep, i) => (
                    <SterilityPrepPrint key={i} prep={prep} idx={i} />
                  ))}
                </div>
              )}

              {/* ── E. coli Preparations ── */}
              {ecoliPreps.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-md mb-2"><strong>Test Method:</strong> Isolation and Detection of E.coli</h4>
                  {ecoliPreps.map((prep, i) => (
                    <EcoliPrepPrint key={i} prep={prep} idx={i} />
                  ))}
                </div>
              )}

              {/* ── Shigella Preparations ── */}
              {shigellaPreps.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-md mb-2"><strong>Test Method:</strong> Isolation and Detection of Shigella</h4>
                  {shigellaPreps.map((prep, i) => (
                    <InoculationBiochemicalPrepPrint
                      key={i}
                      prep={prep}
                      idx={i}
                      typeLabel="Shigella Preparation"
                      biochemicalLabel="Biochemical Tests"
                      biochemicalHasCondition={true}
                    />
                  ))}
                </div>
              )}

              {/* ── Clostridium Preparations ── */}
              {clostridiumPreps.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-md mb-2"> <strong>Test Method:</strong> Isolation and Detection of Clostridium sp.</h4>
                  {clostridiumPreps.map((prep, i) => (
                    <ClostridiumPrepPrint key={i} prep={prep} idx={i} />
                  ))}
                </div>
              )}

              {/* ── Salmonella Preparations ── */}
              {salmonellaPreps.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-md mb-2"><strong>Test Method:</strong> Isolation and Detection of Salmonella</h4>
                  {salmonellaPreps.map((prep, i) => (
                    <InoculationBiochemicalPrepPrint
                      key={i}
                      prep={prep}
                      idx={i}
                      typeLabel="Salmonella Preparation"
                      biochemicalLabel="Biochemical Tests"
                      biochemicalHasCondition={true}
                    />
                  ))}
                </div>
              )}

              {/* ── Staphylococcus Preparations ── */}
              {staphylococcusPreps.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-md mb-2"><strong>Test Method:</strong> Isolation and Detection of Staphylococcus aureus</h4>
                  {staphylococcusPreps.map((prep, i) => (
                    <InoculationBiochemicalPrepPrint
                      key={i}
                      prep={prep}
                      idx={i}
                      typeLabel="Staphylococcus Preparation"
                      biochemicalLabel="Identification Tests"
                      biochemicalHasTempTime={true}
                    />
                  ))}
                </div>
              )}

              {/* ── Pseudomonas Preparations ── */}
              {pseudomonasPreps.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-md mb-2"><strong>Test Method:</strong> Isolation and Detection of Pseudomonas aeruginosa</h4>
                  {pseudomonasPreps.map((prep, i) => (
                    <InoculationBiochemicalPrepPrint
                      key={i}
                      prep={prep}
                      idx={i}
                      typeLabel="Pseudomonas Preparation"
                      biochemicalLabel="Identification Tests"
                    />
                  ))}
                </div>
              )}

              {/* ── Bile-Tolerant Preparations ── */}
              {bileTolerantPreps.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-md mb-2"><strong>Test Method:</strong> Isolation and Detection of Bile-Tolerant Gram-Negative Bacteria</h4>
                  {bileTolerantPreps.map((prep, i) => (
                    <BileTolerantPrepPrint key={i} prep={prep} idx={i} />
                  ))}
                </div>
              )}

              {/* ── B. cepacia Preparations ── */}
              {bcepaciaPreps.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-md mb-2"><strong>Test Method:</strong> Isolation and Detection of Burkholderia cepacia complex</h4>
                  {bcepaciaPreps.map((prep, i) => (
                    <BCepaciaPrepPrint key={i} prep={prep} idx={i} />
                  ))}
                </div>
              )}

              {/* ── C. albicans Preparations ── */}
              {calbicansPreps.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-md mb-2"><strong>Test Method:</strong> Isolation and Detection of Candida albicans</h4>
                  {calbicansPreps.map((prep, i) => (
                    <CandidaAlbicansPrepPrint key={i} prep={prep} idx={i} />
                  ))}
                </div>
              )}

              {/* ── TVC (Water) Preparations ── */}
              {tvcWaterPreps.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-md mb-2">
                    <strong>Test Method:</strong> Total Viable Count – Water Sample
                  </h4>
                  {tvcWaterPreps.map((prep, i) => (
                    <TVCStylePrepPrint
                      key={i}
                      prep={prep}
                      idx={i}
                      typeLabel="TVC (Water) Preparation"
                    />
                  ))}
                </div>
              )}

              {/* ── TYMC Preparations ── */}
              {tymcPreps.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-md mb-2">
                    <strong>Test Method:</strong> Total Yeast And Mould Count (TYMC)
                  </h4>
                  {tymcPreps.map((prep, i) => (
                    <TVCStylePrepPrint
                      key={i}
                      prep={prep}
                      idx={i}
                      typeLabel="TYMC Preparation"
                    />
                  ))}
                </div>
              )}

              {/* ── TAMC Preparations ── */}
              {tamcPreps.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-md mb-2">
                    <strong>Test Method:</strong> Total Aerobic Microbial Count (TAMC)
                  </h4>
                  {tamcPreps.map((prep, i) => (
                    <TVCStylePrepPrint
                      key={i}
                      prep={prep}
                      idx={i}
                      typeLabel="TAMC Preparation"
                    />
                  ))}
                </div>
              )}

              {/* ── Other / remaining prep types (truly unknown) ── */}
              {otherPreps.length > 0 && (() => {
                // Group by type for section headings
                const grouped: Record<string, { data: any; idx: number }[]> = {};
                otherPreps.forEach(({ type, data }) => {
                  if (!grouped[type]) grouped[type] = [];
                  grouped[type].push({ data, idx: grouped[type].length });
                });
                return Object.entries(grouped).map(([type, entries]) => (
                  <div key={type} className="mb-6">
                    <h4 className="text-md uppercase font-bold mb-2">
                      {PREP_TYPE_LABELS[type] || type}
                    </h4>
                    {entries.map(({ data, idx: ei }) => (
                      <GenericPrepPrint
                        key={ei}
                        prep={data}
                        idx={ei}
                        prepType={type}
                        typeLabel={PREP_TYPE_LABELS[type] || type}
                      />
                    ))}
                  </div>
                ));
              })()}

              {/* ── Signature section ── */}
              <div className="signature-group">
                {renderSignatureSection(param)}
              </div>

              {/* ── Attached Files ── */}
              {param.files &&
                Array.isArray(param.files) &&
                param.files.filter((f: any) => f.fileDataBase64).length > 0 && (
                  <div className="section-container mb-4">
                    <h4 className="text-md uppercase font-bold mb-2 no-print">Attached Files</h4>
                    {(() => {
                      const groups: Record<
                        string,
                        { slotLabel: string; sortOrder: number; files: any[] }
                      > = {};
                      for (const f of param.files) {
                        if (!f.fileDataBase64) continue;
                        let slotKey: string;
                        let slotLabel: string;
                        let sortOrder: number;
                        if (f.preparationType) {
                          slotKey = f.preparationType;
                          slotLabel =
                            PREP_TYPE_LABELS[f.preparationType] ||
                            f.preparationType;
                          sortOrder = 0;
                        } else {
                          slotKey = "__other__";
                          slotLabel = "Other Files";
                          sortOrder = 1;
                        }
                        if (!groups[slotKey])
                          groups[slotKey] = { slotLabel, sortOrder, files: [] };
                        groups[slotKey].files.push(f);
                      }

                      return Object.entries(groups)
                        .sort(([, a], [, b]) => a.sortOrder - b.sortOrder)
                        .map(([slotKey, group]) => (
                          <div key={slotKey} className="mb-4">
                            {group.files.map((f: any, fi: number) => {
                              const isPdf =
                                f.fileName?.toLowerCase().endsWith(".pdf") ||
                                f.fileDataBase64?.startsWith("JVBER");
                              const isImage =
                                /\.(png|jpg|jpeg|gif|bmp|webp)$/i.test(
                                  f.fileName || "",
                                );
                              return (
                                <div key={fi}>
                                  {isPdf ? (
                                    <PdfPageRenderer
                                      base64={f.fileDataBase64}
                                      fileName={
                                        f.fileName || `file_${fi + 1}.pdf`
                                      }
                                      signature={fileSig}
                                    />
                                  ) : isImage ? (
                                    <div
                                      className="pdf-page-with-sig"
                                      style={{
                                        breakInside: "avoid",
                                        pageBreakInside: "avoid",
                                      }}
                                    >
                                      <img
                                        src={`data:image/${f.fileName
                                          ?.split(".")
                                          .pop()
                                          ?.toLowerCase() || "jpeg"};base64,${f.fileDataBase64}`}
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
                            })}
                          </div>
                        ));
                    })()}
                  </div>
                )}
            </div>
          );
        })}
      </div>
    </>
  );
};

export default MicroPrintReport;