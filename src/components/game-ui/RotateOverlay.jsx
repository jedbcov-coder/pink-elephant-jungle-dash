import React from "react";

export function RotateOverlay({ visible }) {
  if (!visible) return null;

  return (
    <section
      className="pointer-events-auto absolute inset-0 z-40 flex items-center justify-center px-6"
      style={{ background: "rgba(3, 10, 6, 0.82)", backdropFilter: "blur(3px)" }}
      role="status"
      aria-live="polite"
    >
      <div
        className="rounded-[1.5rem] p-6 text-center text-emerald-50"
        style={{ background: "rgba(12,20,10,0.92)", border: "1px solid rgba(134,239,172,0.32)", maxWidth: "22rem" }}
      >
        <div className="text-4xl" aria-hidden="true">📱↻</div>
        <h2 className="display-title mt-2 text-2xl font-black text-emerald-200">Rotate your device</h2>
        <p className="mt-2 text-sm leading-relaxed text-emerald-50/80">This game plays best in landscape mode. Turn your device sideways to continue.</p>
      </div>
    </section>
  );
}
