import type { KeyboardEvent } from "react";

const focusable = 'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

/** Keeps Tab and Shift+Tab inside a modal dialog (browsers otherwise let focus escape to their own chrome). */
export function trapTab(e: KeyboardEvent<HTMLElement>) {
  if (e.key !== "Tab") return;
  const items = [...e.currentTarget.querySelectorAll<HTMLElement>(focusable)].filter((el) => el.offsetParent !== null || el === document.activeElement);
  if (!items.length) return;
  const first = items[0];
  const last = items[items.length - 1];
  if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
}
