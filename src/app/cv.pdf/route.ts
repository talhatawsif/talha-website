import { renderToBuffer } from "@react-pdf/renderer";
import { cacheLife } from "next/cache";
import { CvDocument } from "@/lib/cv-document";

/** Rendered once at build from src/content/site.ts (cached forever), so editing the site updates the CV. */
async function cvBase64() {
  "use cache";
  cacheLife("max");
  return (await renderToBuffer(CvDocument())).toString("base64");
}

export async function GET() {
  return new Response(Buffer.from(await cvBase64(), "base64"), {
    headers: { "Content-Type": "application/pdf", "Content-Disposition": 'inline; filename="Talha-Tawsif-CV.pdf"' },
  });
}
