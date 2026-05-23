import React from "react";

export function SaveDebugTools({ visible, onToggle, onExport, onImport, onReset }) {
  return (
    <div className="mt-5 border-t border-amber-100/20 pt-4">
      <button
        type="button"
        onClick={onToggle}
        className="rounded-full bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-amber-100 transition hover:bg-white/20"
      >
        {visible ? "Hide Save Tools" : "Show Save Tools"}
      </button>
      {visible && (
        <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
          <button type="button" onClick={onExport} className="rounded-full bg-emerald-200 px-4 py-2 text-xs font-black text-emerald-950 transition hover:scale-105 active:scale-95">Export Save</button>
          <button type="button" onClick={onImport} className="rounded-full bg-sky-200 px-4 py-2 text-xs font-black text-sky-950 transition hover:scale-105 active:scale-95">Import Save</button>
          <button type="button" onClick={onReset} className="rounded-full bg-rose-300 px-4 py-2 text-xs font-black text-rose-950 transition hover:scale-105 active:scale-95">Reset All Save</button>
        </div>
      )}
    </div>
  );
}
