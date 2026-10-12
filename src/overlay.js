// Minimal accessible overlay handling: focus trap, Escape to close, focus return.
const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), textarea, select, [tabindex]:not([tabindex="-1"])';
const state = new Map();

export function openOverlay(overlay, opener, onEscape) {
  overlay.hidden = false;
  document.body.style.overflow = 'hidden';
  const onKey = (e) => {
    if (e.key === 'Escape') { e.preventDefault(); onEscape?.(); return; }
    if (e.key !== 'Tab') return;
    const items = [...overlay.querySelectorAll(FOCUSABLE)].filter((el) => el.offsetParent !== null);
    if (!items.length) return;
    const first = items[0];
    const last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  };
  overlay.addEventListener('keydown', onKey);
  state.set(overlay, { opener, onKey });
  requestAnimationFrame(() => overlay.querySelector('.close')?.focus({ preventScroll: true }));
}

export function closeOverlay(overlay) {
  const s = state.get(overlay);
  overlay.hidden = true;
  document.body.style.overflow = '';
  if (s) {
    overlay.removeEventListener('keydown', s.onKey);
    s.opener?.focus?.({ preventScroll: true });
    state.delete(overlay);
  }
}
