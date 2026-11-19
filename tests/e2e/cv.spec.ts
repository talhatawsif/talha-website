import { expect, test } from "@playwright/test";
import { profile, projects } from "../../src/content/site";

test("/cv.pdf is an inline PDF, 1–2 pages, with selectable text", async ({ request }) => {
  const res = await request.get("/cv.pdf");
  expect(res.status()).toBe(200);
  expect(res.headers()["content-type"]).toBe("application/pdf");
  expect(res.headers()["content-disposition"]).toBe('inline; filename="Talha-Tawsif-CV.pdf"');

  const { getDocument } = await import("pdfjs-dist/legacy/build/pdf.mjs");
  const doc = await getDocument({ data: new Uint8Array(await res.body()), useSystemFonts: true }).promise;
  expect(doc.numPages).toBeGreaterThanOrEqual(1);
  expect(doc.numPages).toBeLessThanOrEqual(2);
  let text = "";
  for (let i = 1; i <= doc.numPages; i++) text += (await (await doc.getPage(i)).getTextContent()).items.map((it) => ("str" in it ? it.str : "")).join(" ") + "\n";
  for (const needle of [profile.name, profile.email, ...projects.map((p) => p.name)]) expect(text).toContain(needle);
  expect(text).not.toMatch(/\+?\d[\d ()-]{8,}\d/); // no phone number
});

test("old CV path redirects to /cv.pdf", async ({ request }) => {
  const res = await request.get("/cv/Talha-Tawsif-CV.pdf", { maxRedirects: 0 });
  expect([307, 308]).toContain(res.status());
  expect(res.headers().location).toContain("/cv.pdf");
});

test("Download CV buttons and palette point at /cv.pdf", async ({ page }) => {
  await page.goto("/");
  const links = page.getByRole("link", { name: "Download CV" });
  expect(await links.count()).toBeGreaterThanOrEqual(2);
  for (const l of await links.all()) await expect(l).toHaveAttribute("href", "/cv.pdf");
});
