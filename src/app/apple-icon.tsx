import { ImageResponse } from "next/og";
import { og } from "@/lib/og-tokens";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: og.accent, color: og.onAccent, fontSize: 80, fontWeight: 600 }}>TT</div>,
    size,
  );
}
