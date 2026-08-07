import React, { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CgTrash } from "react-icons/cg";
import type { AttachedFile } from "../../models/AttachedFile";

const MAX_FILE_SIZE_MB = 5;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

interface WorksheetFileAttacherProps {
  files: AttachedFile[];
  onAdd: (newFiles: AttachedFile[]) => void;
  onRemove: (index: number) => void;
  maxFiles?: number;
  preparationType: string | null;
  sectionLabel: string | null;
  isForPrep?: boolean;
  isLocked?: boolean;
}

const PDF_ICON = (
  <svg className="w-5 h-5 text-emerald-500 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm-1 1.5L18.5 9H13V3.5zM8.5 17.5h-1v-5h1.8c.9 0 1.5.6 1.5 1.5s-.6 1.5-1.5 1.5H8.5v2zm0-2.8h.8c.3 0 .5-.2.5-.7s-.2-.7-.5-.7H8.5v1.4zm4.1 2.8h-1.4v-5H12.6c1.3 0 2.1.9 2.1 2.5s-.8 2.5-2.1 2.5zm-.4-4.1v3.2h.4c.6 0 1.1-.4 1.1-1.6s-.5-1.6-1.1-1.6h-.4zm5.3 1.4v.9h-1.5v1.8h-1v-5h2.8v.9h-1.8v1.4h1.5z" />
  </svg>
);

const WorksheetFileAttacher: React.FC<WorksheetFileAttacherProps> = ({
  files,
  onAdd,
  onRemove,
  maxFiles = 10,
  preparationType,
  sectionLabel,
  isForPrep = true,
  isLocked = false,
}) => {
  const inputId = useRef(`wfa-${Math.random().toString(36).slice(2)}`).current;
  const inputRef = useRef<HTMLInputElement>(null);
  const [sizeError, setSizeError] = useState<string | null>(null);

  const handleFilePick = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const picked = Array.from(e.target.files || []);
    // Reset input immediately so the same file can be re-picked later
    if (inputRef.current) inputRef.current.value = "";
    if (!picked.length) return;

    // ── 5 MB size guard ──────────────────────────────────────────────────────
    const oversized = picked.filter((f) => f.size > MAX_FILE_SIZE_BYTES);
    if (oversized.length) {
      const names = oversized.map((f) => f.name).join(", ");
      setSizeError(
        `${oversized.length === 1 ? "File" : "Files"} exceed ${MAX_FILE_SIZE_MB} MB limit: ${names}`
      );
      // Only process the valid files
      const valid = picked.filter((f) => f.size <= MAX_FILE_SIZE_BYTES);
      if (!valid.length) return;
      await processFiles(valid);
      return;
    }

    setSizeError(null);

    const remaining = maxFiles - files.length;
    const toProcess = picked.slice(0, remaining);
    await processFiles(toProcess);
  };

  const processFiles = async (list: File[]) => {
    const newFiles: AttachedFile[] = await Promise.all(
      list.map(async (f) => {
        const base64 = await fileToBase64(f);
        return {
          id: 0,
          fileName: f.name,
          fileDataBase64: base64,
          preparationType,
          label: sectionLabel,
        };
      })
    );
    onAdd(newFiles);
  };

  const canAdd = !isLocked && files.length < maxFiles;

  return (
    <div className="mt-4 p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {PDF_ICON}
          <span className="text-sm font-bold text-emerald-700">
            {isForPrep ? "Attach Weight Print Sheets (PDF)" : "Attach Files (PDF)"}
          </span>
          <span className="text-xs text-emerald-500 font-medium">
            ({files.length}/{maxFiles})
          </span>
        </div>

        {/*
          Use a <label> pointing at the hidden input instead of a button calling
          inputRef.current?.click(). This is a direct browser-native trigger —
          no JS event indirection, no animation delay, file picker opens instantly.
        */}
        {/* {canAdd && (
          <label
            htmlFor={inputId}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 text-white text-xs font-semibold rounded-lg hover:bg-emerald-700 active:scale-95 transition-all shadow cursor-pointer select-none"
          >
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Attach PDF
          </label>
        )} */}

        <label
          htmlFor={!isLocked ? inputId : undefined}
          className={`
        flex items-center gap-1.5 px-3 py-1.5
        rounded-lg text-xs font-semibold shadow select-none
        transition-all
        ${isLocked || files.length >= maxFiles
              ? "bg-emerald-300 text-white opacity-50 cursor-not-allowed"
              : "bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer active:scale-95"
            }
    `}
        >
          <svg
            className="w-3.5 h-3.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4v16m8-8H4"
            />
          </svg>

          Attach PDF
        </label>

        <input
          ref={inputRef}
          id={inputId}
          type="file"
          accept="application/pdf"
          multiple
          disabled={isLocked}
          className="hidden"
          onChange={handleFilePick}
        />
      </div>

      {/* Size error banner */}
      <AnimatePresence>
        {sizeError && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="flex items-start gap-2 mb-3 px-3 py-2 bg-red-50 border border-red-200 rounded-lg"
          >
            <svg
              className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
              />
            </svg>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-red-700">File size limit exceeded</p>
              <p className="text-xs text-red-600 mt-0.5 break-words">{sizeError}</p>
              <p className="text-[10px] text-red-400 mt-0.5">
                Maximum allowed size is {MAX_FILE_SIZE_MB} MB per file.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setSizeError(null)}
              className="flex-shrink-0 text-red-400 hover:text-red-600 transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* File list */}
      <AnimatePresence>
        {files.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-4 border-2 border-dashed border-emerald-200 rounded-lg"
          >
            <p className="text-xs text-emerald-400 font-medium">
              {isLocked ? "No PDFs attached" : "No PDFs attached yet — click Attach PDF"}
            </p>
          </motion.div>
        ) : (
          <div className="space-y-2">
            {files.map((file, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="flex items-center justify-between gap-3 px-3 py-2 bg-white border border-emerald-200 rounded-lg shadow-sm"
              >
                <div className="flex items-center gap-2 min-w-0">
                  {PDF_ICON}
                  <span className="text-xs text-slate-700 font-medium truncate max-w-[200px]">
                    {file.fileName}
                  </span>
                  {file.id > 0 && (
                    <span className="text-[10px] px-1.5 py-0.5 bg-emerald-100 text-emerald-700 rounded-full font-semibold flex-shrink-0">
                      Saved
                    </span>
                  )}
                  {file.id === 0 && file.fileDataBase64 && (
                    <span className="text-[10px] px-1.5 py-0.5 bg-amber-100 text-amber-700 rounded-full font-semibold flex-shrink-0">
                      Pending
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  {file.fileDataBase64 && (
                    <button
                      type="button"
                      onClick={() => previewBase64PDF(file.fileDataBase64!)}
                      className="text-xs text-blue-600 hover:underline font-medium"
                    >
                      {file.id === 0 ? "Preview" : "View"}
                    </button>
                  )}

                  {!isLocked && (
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      type="button"
                      onClick={() => onRemove(idx)}
                      className="p-1 text-emerald-500 hover:text-red-500 rounded transition-colors"
                    >
                      <CgTrash className="w-4 h-4" />
                    </motion.button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};


function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result.split(",")[1]); // strip data:…;base64, prefix
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function previewBase64PDF(base64: string) {
  const byteCharacters = atob(base64);
  const byteArrays = [];
  for (let i = 0; i < byteCharacters.length; i += 512) {
    const slice = byteCharacters.slice(i, i + 512);
    const byteNumbers = new Array(slice.length).fill(0).map((_, j) => slice.charCodeAt(j));
    byteArrays.push(new Uint8Array(byteNumbers));
  }
  const blob = new Blob(byteArrays, { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  window.open(url, "_blank");
}

export default WorksheetFileAttacher;