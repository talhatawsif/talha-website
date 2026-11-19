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
