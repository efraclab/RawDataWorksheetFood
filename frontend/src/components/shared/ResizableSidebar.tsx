import React, { useCallback, useEffect, useRef, useState } from "react";

const STORAGE_WIDTH_KEY = "worksheet-sidebar-width";
const STORAGE_HIDDEN_KEY = "worksheet-sidebar-hidden";

const MIN_WIDTH = 200;
const MAX_WIDTH = 560;
const DEFAULT_WIDTH = 288; // matches the original lg:w-72

interface ResizableSidebarProps {
  children: React.ReactNode;
}

const readPersistedWidth = (): number => {
  try {
    const raw = localStorage.getItem(STORAGE_WIDTH_KEY);
    if (!raw) return DEFAULT_WIDTH;
    const n = parseInt(raw, 10);
    if (!Number.isFinite(n)) return DEFAULT_WIDTH;
    return Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, n));
  } catch {
    return DEFAULT_WIDTH;
  }
};

const readPersistedHidden = (): boolean => {
  try {
    return localStorage.getItem(STORAGE_HIDDEN_KEY) === "1";
  } catch {
    return false;
  }
};

const ResizableSidebar: React.FC<ResizableSidebarProps> = ({ children }) => {
  const [width, setWidth] = useState<number>(() => readPersistedWidth());
  const [hidden, setHidden] = useState<boolean>(() => readPersistedHidden());
  const [isDragging, setIsDragging] = useState(false);

  const dragStartXRef = useRef(0);
  const dragStartWidthRef = useRef(width);

  // Persist width
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_WIDTH_KEY, String(width));
    } catch {
      /* ignore quota errors */
    }
  }, [width]);

  // Persist hidden flag
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_HIDDEN_KEY, hidden ? "1" : "0");
    } catch {
      /* ignore */
    }
  }, [hidden]);

  // Global mouse listeners while dragging
  useEffect(() => {
    if (!isDragging) return;
    const onMove = (e: MouseEvent) => {
      const delta = e.clientX - dragStartXRef.current;
      const next = Math.min(
        MAX_WIDTH,
        Math.max(MIN_WIDTH, dragStartWidthRef.current + delta),
      );
      setWidth(next);
    };
    const onUp = () => setIsDragging(false);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
  }, [isDragging]);

  const handleHandleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      dragStartXRef.current = e.clientX;
      dragStartWidthRef.current = width;
      setIsDragging(true);
    },
    [width],
  );

  // Double-click handle resets width
  const handleDoubleClick = useCallback(() => {
    setWidth(DEFAULT_WIDTH);
  }, []);

  // Keyboard shortcut: Ctrl/Cmd + B toggles sidebar visibility
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "b") {
        e.preventDefault();
        setHidden((h) => !h);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Floating "show" hamburger button when collapsed
  if (hidden) {
    return (
      <button
        type="button"
        onClick={() => setHidden(false)}
        title="Show sidebar (Ctrl+B)"
        aria-label="Show sidebar"
        className="no-print fixed left-2 top-3 z-40 p-2 rounded-lg bg-slate-900 text-white shadow-lg hover:bg-slate-800 transition-colors"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
    );
  }

  return (
    <div
      className="no-print relative flex-shrink-0 h-screen sticky top-0 z-30"
      style={{ width: `${width}px` }}
    >
      {/* Sidebar content fills the resizable container */}
      <div className="h-full w-full overflow-hidden">{children}</div>

      {/* Hide button (hamburger) — top-right of the sidebar */}
      <button
        type="button"
        onClick={() => setHidden(true)}
        title="Hide sidebar (Ctrl+B)"
        aria-label="Hide sidebar"
        className="absolute top-2 right-3 z-40 p-1.5 rounded-md bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-colors"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Drag handle — vertical strip on the right edge */}
      <div
        role="separator"
        aria-orientation="vertical"
        aria-label="Resize sidebar"
        onMouseDown={handleHandleMouseDown}
        onDoubleClick={handleDoubleClick}
        className={`absolute top-0 right-0 h-full w-1.5 cursor-col-resize z-50 group ${
          isDragging ? "bg-emerald-400/40" : "hover:bg-emerald-400/30"
        } transition-colors`}
        title="Drag to resize · Double-click to reset"
      >
        {/* visual grip indicator (centered dots) */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col gap-1 opacity-0 group-hover:opacity-80 transition-opacity">
          <span className="w-0.5 h-0.5 rounded-full bg-white" />
          <span className="w-0.5 h-0.5 rounded-full bg-white" />
          <span className="w-0.5 h-0.5 rounded-full bg-white" />
        </div>
      </div>
    </div>
  );
};

export default ResizableSidebar;
