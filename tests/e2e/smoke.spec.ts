import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const settled = (page: import("@playwright/test").Page) => page.waitForFunction(() => document.getAnimations().length === 0); // reveal transitions finished, so axe sees final colours

const pages = ["/", "/projects/cliniq", "/projects/pawlift", "/projects/adhd-buddy", "/styleguide"];
const viewports = [
  { name: "desktop", width: 1280, height: 800 },
  { name: "phone", width: 390, height: 844 },
];

for (const vp of viewports) {
  for (const path of pages) {
    test(`${path} at ${vp.name}`, async ({ page, request }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto(path);
      await expect(page.locator("h1")).toHaveCount(1);

      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      expect(overflow).toBeLessThanOrEqual(0);

      await settled(page);
      const { violations } = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag22aa"]).analyze();
      expect(violations.filter((v) => v.impact === "serious" || v.impact === "critical").map((v) => `${v.id}: ${v.nodes.length}`)).toEqual([]);

      const hrefs = await page.$$eval("a[href^='/']", (as) => [...new Set(as.map((a) => (a as HTMLAnchorElement).pathname))]);
      for (const h of hrefs) expect((await request.get(h)).status(), h).toBeLessThan(400);
    });
  }
}

test("banner visible without scrolling at 1280x800", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("/");
  const box = await page.getByRole("region", { name: "Identity" }).boundingBox();
  expect(box && box.y + box.height).toBeLessThanOrEqual(800);
});

test("unknown route shows 404 page", async ({ page }) => {
  const res = await page.goto("/nope");
  expect(res?.status()).toBe(404);
  await expect(page.getByRole("heading", { name: "Page not found" })).toBeVisible();
});

for (const scheme of ["light", "dark"] as const) {
  test(`home contrast (${scheme})`, async ({ page }) => {
    await page.emulateMedia({ colorScheme: scheme });
    await page.goto("/");
    await settled(page);
    const { violations } = await new AxeBuilder({ page }).withRules(["color-contrast"]).analyze();
    expect(violations.map((v) => `${v.id}: ${v.nodes.length}`)).toEqual([]);
  });
}
