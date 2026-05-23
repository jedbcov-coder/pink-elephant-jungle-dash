import React from "react";

export function PwaInstallCard({ onInstall, onDismiss }) {
  return (
    <div className="title-install-card mx-auto mt-5 max-w-xl rounded-2xl px-4 py-4 text-left">
      <h3 className="text-sm font-black uppercase tracking-[0.18em] text-amber-100">Install Game</h3>
      <p className="mt-2 text-xs leading-relaxed text-amber-50/80">
        Add this game to your desktop for quick access and a cleaner full-screen experience.
      </p>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={onInstall}
          className="rounded-full bg-emerald-200 px-4 py-2 text-xs font-black uppercase tracking-wider text-emerald-950 transition hover:scale-105 active:scale-95"
        >
          Install
        </button>
        <button
          type="button"
          onClick={onDismiss}
          className="rounded-full bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-wider text-amber-50 transition hover:scale-105 active:scale-95"
        >
          Not Now
        </button>
      </div>
    </div>
  );
}
