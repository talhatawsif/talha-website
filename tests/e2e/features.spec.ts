import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test("command palette opens with Ctrl+K, filters and closes with Escape", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("Control+k");
  const dialog = page.getByRole("dialog", { name: "Command palette" });
  await expect(dialog).toBeVisible();
  const { violations } = await new AxeBuilder({ page }).include("[role=dialog]").analyze();
  expect(violations.filter((v) => v.impact === "serious" || v.impact === "critical")).toEqual([]);
  await page.keyboard.type("pawlift");
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/projects\/pawlift$/);
  await page.keyboard.press("/");
  await expect(dialog).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
});

test("theme toggle persists and applies before paint", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: /^Theme:/ }).click(); // system -> light
  await page.getByRole("button", { name: /^Theme:/ }).click(); // light -> dark
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
});

test("View as FHIR drawer shows a Practitioner", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "View as FHIR" }).click();
  const drawer = page.getByRole("dialog", { name: /FHIR Practitioner/ });
  await expect(drawer).toContainText('"resourceType": "Practitioner"');
  await page.keyboard.press("Escape");
  await expect(drawer).toBeHidden();
});

test("HL7 explainer highlights the mapped FHIR fields", async ({ page }) => {
  await page.goto("/projects/cliniq");
  await page.getByRole("button", { name: /^PID\|/ }).focus();
  await expect(page.locator("#hl7-caption")).toContainText("PID identifies the patient");
});

test("status chips are in the server-rendered HTML", async ({ request }) => {
  const html = await (await request.get("/")).text();
  expect(html).toMatch(/Live · \d+ ms|Waking up|Unreachable|Checking status/);
  expect(html).not.toContain("Status unknown");
});

test("no TODO placeholders in production output", async ({ request }) => {
  for (const path of ["/", "/projects/cliniq", "/projects/pawlift", "/projects/adhd-buddy"]) expect(await (await request.get(path)).text()).not.toContain("[TODO");
  const html = await (await request.get("/")).text();
  expect(html).toContain("View transcript");
});

test("tables: real column headers, phone labels are not in the cell text", async ({ page }) => {
  await page.goto("/");
  const table = page.locator("#experience table");
  await expect(table.locator("thead th")).toHaveText(["Dates", "Role", "Organisation", "What I did"]);
  const first = await table.locator("tbody td").first().textContent();
  expect(first).toBe("Nov 2025 – present");
  await page.setViewportSize({ width: 390, height: 844 });
  const label = await table.locator("tbody td").first().evaluate((el) => getComputedStyle(el, "::before").content);
  expect(label).toContain("Dates");
  await page.setViewportSize({ width: 1280, height: 800 });
  expect(await table.locator("tbody td").first().evaluate((el) => getComputedStyle(el, "::before").content)).toMatch(/none|normal/);
});

test("scroll-spy marks the section in view and updates the hash", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("/");
  await page.locator("#education").scrollIntoViewIfNeeded();
  await page.evaluate(() => document.getElementById("education")!.scrollIntoView());
  await expect(page.getByRole("navigation", { name: "Main", exact: true }).getByRole("link", { name: "Education" })).toHaveAttribute("aria-current", "location");
  await expect(page).toHaveURL(/#education$/);
});

test("ask panel shows the direct-email fallback when the assistant is unavailable", async ({ page }) => {
  await page.route("**/api/ask", (r) => r.fulfill({ json: { available: false, resting: false } }));
  await page.goto("/");
  await expect(page.locator("#ask").getByText("Ask me directly")).toBeVisible();
  await expect(page.locator("#ask")).toContainText("Answers come from this site only");
});

test("ask panel shows the question box when the assistant is available", async ({ page }) => {
  await page.route("**/api/ask", (r) => r.request().method() === "GET" ? r.fulfill({ json: { available: true, resting: false } }) : r.continue());
  await page.goto("/");
  await expect(page.getByLabel("Your question")).toBeVisible();
});

test("case studies hide Demo and Screenshots while there is nothing to show", async ({ page }) => {
  for (const slug of ["cliniq", "pawlift", "adhd-buddy"]) {
    await page.goto(`/projects/${slug}`);
    await expect(page.getByRole("heading", { name: "Demo", exact: true })).toHaveCount(0);
    await expect(page.getByRole("heading", { name: "Screenshots" })).toHaveCount(0);
    await expect(page.getByText("coming soon")).toHaveCount(0);
  }
});

for (const vp of [{ width: 1280, height: 800 }, { width: 390, height: 844 }]) {
  test(`HL7 explainer wraps long lines without clipping or scrolling at ${vp.width}px`, async ({ page }) => {
    await page.setViewportSize(vp);
    await page.goto("/projects/cliniq");
    const clipped = await page.locator("section[aria-labelledby=explainer-h]").evaluate((root) =>
      [...root.querySelectorAll("button, pre, span")].filter((el) => el.scrollWidth > el.clientWidth + 1).length,
    );
    expect(clipped).toBe(0);
    await page.getByRole("button", { name: /^OBX\|/ }).focus();
    await expect(page.locator("#hl7-caption")).toContainText("OBX is the result itself");
  });
}

test("phone project rows use a small logo tile instead of the 16:9 thumbnail", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const row = page.locator("#projects li").first();
  const tile = row.locator("div.h-14.w-14");
  await expect(tile).toBeVisible();
  expect((await tile.boundingBox())!.width).toBe(56);
  await expect(row.locator("a.hidden")).toBeHidden();
  await page.setViewportSize({ width: 1280, height: 800 });
  await expect(tile).toBeHidden();
  const thumb = await row.locator("a[aria-label$='case study'] > div").boundingBox();
  expect(Math.round(thumb!.width / thumb!.height * 100)).toBe(178);
});

test("sections are never invisible: hash targets and in-view sections are shown at once", async ({ page }) => {
  await page.goto("/#education");
  await expect(page.locator("#education")).toHaveCSS("opacity", "1");
  await page.evaluate(() => { location.hash = "#contact"; });
  await expect(page.locator("#contact")).toHaveCSS("opacity", "1");
  await page.goto("/");
  await expect(page.locator("#summary")).toHaveCSS("opacity", "1");
  // After scrolling through the whole page every section is visible.
  await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 300) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 40)); } });
  await page.waitForFunction(() => document.getAnimations().length === 0);
  const hidden = await page.$$eval(".reveal", (els) => els.filter((el) => getComputedStyle(el).opacity !== "1").length);
  expect(hidden).toBe(0);
});

test("banner shows the full location and the email as selectable text", async ({ page }) => {
  await page.goto("/");
  const banner = page.getByRole("region", { name: "Identity" });
  await expect(banner.locator("dd", { hasText: "Melbourne, Victoria, Australia" })).toBeVisible();
  const email = banner.locator("dd a[href^='mailto:']");
  await expect(email).toHaveText("talhatawsif.dev@gmail.com");
});

test("banner shows the phone as text and contact buttons each have a logo", async ({ page }) => {
  await page.goto("/");
  const banner = page.getByRole("region", { name: "Identity" });
  await expect(banner.locator("dd a[href='tel:+61499390833']")).toHaveText("+61 499 390 833");
  for (const [name, href] of [["LinkedIn", "https://www.linkedin.com/in/talha-tawsif"], ["GitHub", "https://github.com/talhatawsif"], ["Email", "mailto:talhatawsif.dev@gmail.com"], ["Call me", "tel:+61499390833"]]) {
    const link = banner.getByRole("link", { name, exact: true });
    await expect(link).toHaveAttribute("href", href);
    await expect(link.locator("svg[aria-hidden='true']")).toHaveCount(1);
  }
  await expect(page.locator("#contact").getByRole("link", { name: "Call me" })).toHaveAttribute("href", "tel:+61499390833");
});

test("the CV never carries the phone number", async ({ request }) => {
  const { getDocument } = await import("pdfjs-dist/legacy/build/pdf.mjs");
  const doc = await getDocument({ data: new Uint8Array(await (await request.get("/cv.pdf")).body()), useSystemFonts: true }).promise;
  let text = "";
  for (let i = 1; i <= doc.numPages; i++) text += (await (await doc.getPage(i)).getTextContent()).items.map((it) => ("str" in it ? it.str : "")).join(" ");
  expect(text).not.toMatch(/499\s?390\s?833/);
});
