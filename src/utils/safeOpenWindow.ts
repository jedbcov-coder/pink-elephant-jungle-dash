export function safeOpenWindow(url: string) {
  try {
    const newWin = window.open(url, "_blank", "noopener,noreferrer");
    if (!newWin) {
      // Browser blocked popup or window.open failed
      window.location.href = url;
    }
  } catch (err) {
    // Fallback if window.open throws (e.g., cross-origin or readonly restrictions)
    window.location.href = url;
  }
}
