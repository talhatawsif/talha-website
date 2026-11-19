import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test("transcript dialog opens and closes by keyboard, image loads, axe clean", async ({ page }) => {
  await page.goto("/");
  const button = page.getByRole("button", { name: /^View transcript/ });
  await button.focus();
  const image = page.waitForResponse((r) => r.url().includes("stanford-transcript") && r.status() === 200);
  await page.keyboard.press("Enter");

  const dialog = page.getByRole("dialog", { name: "Stanford Medicine transcript" });
  await expect(dialog).toBeVisible();
  await image;
  const img = dialog.getByRole("img", { name: /Stanford Medicine CME transcript: AI in Healthcare series, five courses, 54.5 credits, Aug 2026/ });
  await expect(img).toBeVisible();
  expect(await img.evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth > 0)).toBe(true);
  await expect(dialog).toContainText("Address removed for privacy.");
  await expect(dialog.getByRole("link", { name: /Open PDF/ })).toHaveAttribute("href", "/credentials/stanford-transcript.pdf");
  await expect(dialog.getByRole("link", { name: /Open PDF/ })).toHaveAttribute("target", "_blank");

  await page.waitForFunction(() => document.getAnimations().length === 0);
  const { violations } = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag22aa"]).analyze();
  expect(violations.filter((v) => v.impact === "serious" || v.impact === "critical").map((v) => `${v.id}: ${v.nodes.length}`)).toEqual([]);

  // Focus is trapped: tabbing never leaves the dialog.
  for (let i = 0; i < 6; i++) {
    await page.keyboard.press("Tab");
    expect(await page.evaluate(() => !!document.activeElement?.closest("dialog"))).toBe(true);
  }
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(button).toBeFocused();
});

test("command palette opens the transcript, also from another page", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("Control+k");
  await page.keyboard.type("transcript");
  await page.keyboard.press("Enter");
  await expect(page.getByRole("dialog", { name: "Stanford Medicine transcript" })).toBeVisible();

  await page.goto("/projects/pawlift");
  await page.keyboard.press("Control+k");
  await page.keyboard.type("transcript");
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/#transcript$|\/$/);
  await expect(page.getByRole("dialog", { name: "Stanford Medicine transcript" })).toBeVisible();
});

test("no Coursera link anywhere and the CV lists the credits", async ({ request }) => {
  for (const path of ["/", "/projects/cliniq"]) expect(await (await request.get(path)).text()).not.toContain("coursera");
  const { getDocument } = await import("pdfjs-dist/legacy/build/pdf.mjs");
  const res = await request.get("/cv.pdf");
  const doc = await getDocument({ data: new Uint8Array(await res.body()), useSystemFonts: true }).promise;
  let text = "";
  for (let i = 1; i <= doc.numPages; i++) text += (await (await doc.getPage(i)).getTextContent()).items.map((it) => ("str" in it ? it.str : "")).join(" ");
  expect(text).toContain("54.5 credits");
  expect(text).toContain("Introduction to Clinical Data");
  expect(text.toLowerCase()).not.toContain("coursera");
});
