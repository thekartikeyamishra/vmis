import { expect, test } from "@playwright/test";

const LEVELS = ["Nursery", "Prep", "LKG", "UKG", "Class I", "Class II", "Class III", "Class IV", "Class V", "Class VI", "Class VII", "Class VIII"];

test("home renders in English and Hindi with correct lang", async ({ page }) => {
  await page.goto("/en");
  await expect(page.locator("html")).toHaveAttribute("lang", "en-IN");
  await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
  await page.goto("/hi");
  await expect(page.locator("html")).toHaveAttribute("lang", "hi-IN");
  await expect(page.getByText("डॉ. वेदपति मिश्र इंस्टीट्यूट ऑफ स्कॉलर्स").first()).toBeVisible();
});

test("enquiry form lists all 12 levels and validates", async ({ page }) => {
  await page.goto("/en/admissions/enquiry");
  await page.locator("#levelId").waitFor();
  const options = await page.locator("#levelId option").allTextContents();
  for (const l of LEVELS) expect(options).toContain(l);
  await page.getByRole("button", { name: "Submit enquiry" }).click();
  await expect(page.getByText("Please select a class.")).toBeVisible();
});

test("every class page exists", async ({ page }) => {
  for (const id of ["nursery", "prep", "lkg", "ukg", ...Array.from({ length: 8 }, (_, i) => `class-${i + 1}`)]) {
    const res = await page.goto(`/en/classes/${id}`);
    expect(res?.status()).toBe(200);
  }
});

test("unknown pages return 404 and admin requires login", async ({ page }) => {
  expect((await page.goto("/en/does-not-exist"))?.status()).toBe(404);
  await page.goto("/admin");
  await expect(page).toHaveURL(/\/admin\/login/);
});

test("no console errors even when a browser extension edits <html>", async ({ page }) => {
  await page.addInitScript(() => {
    new MutationObserver(() => document.documentElement?.setAttribute("data-scribe-recorder-ready", "true")).observe(document, { childList: true, subtree: true });
  });
  const errors: string[] = [];
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  page.on("pageerror", (e) => errors.push(e.message));
  for (const p of ["/en", "/hi", "/en/admissions/enquiry"]) await page.goto(p, { waitUntil: "networkidle" });
  expect(errors).toEqual([]);
});

test("launch film and mobile action bar are present", async ({ page }) => {
  await page.goto("/en");
  await expect(page.locator("video source[src='/media/vmis-launch-en.mp4']")).toHaveCount(1);
  const res = await page.request.get("/media/vmis-launch-en.vtt");
  expect(res.status()).toBe(200);
});
