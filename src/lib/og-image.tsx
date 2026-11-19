import { ImageResponse } from "next/og";
import { og } from "./og-tokens";

export const ogSize = { width: 1200, height: 630 };

/** Shared card: accent bar, title, subtitle, optional mono line. No photo. */
export function ogImage(title: string, subtitle: string, mono?: string) {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", background: og.bg, color: og.text }}>
        <div style={{ height: 16, background: og.accent, display: "flex" }} />
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 80px" }}>
          <div style={{ fontSize: 72, fontWeight: 600, display: "flex" }}>{title}</div>
          <div style={{ fontSize: 34, color: og.muted, marginTop: 16, display: "flex" }}>{subtitle}</div>
          {mono && <div style={{ fontSize: 26, color: og.accent, marginTop: 32, fontFamily: "monospace", display: "flex" }}>{mono}</div>}
        </div>
      </div>
    ),
    ogSize,
  );
}
