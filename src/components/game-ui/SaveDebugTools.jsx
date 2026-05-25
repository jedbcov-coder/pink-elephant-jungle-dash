import React from "react";

export function SaveDebugTools({ visible, onToggle, onExport, onImport, onReset }) {
  return (
    <div className="mt-3">
      <button
        type="button"
        onClick={onToggle}
        className="rounded-xl border border-emerald-100/30 bg-emerald-950/45 px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-emerald-100 transition hover:bg-emerald-900/55 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-200/80 focus-visible:ring-offset-2 focus-visible:ring-offset-emerald-950"
      >
        {visible ? "Hide Save Tools" : "Show Save Tools"}
      </button>
      {visible && (
        <div className="mt-3 grid gap-2 sm:grid-cols-3">
          <button type="button" onClick={onExport} className="rounded-xl border border-emerald-100/30 bg-black/35 px-4 py-2 text-xs font-black text-amber-50 transition hover:bg-black/50">Export Save</button>
          <button type="button" onClick={onImport} className="rounded-xl border border-emerald-100/30 bg-black/35 px-4 py-2 text-xs font-black text-amber-50 transition hover:bg-black/50">Import Save</button>
          <button type="button" onClick={onReset} className="rounded-xl border border-rose-200/40 bg-rose-950/40 px-4 py-2 text-xs font-black text-rose-100 transition hover:bg-rose-950/55">Reset All Save</button>
        </div>
      )}
    </div>
  );
}
