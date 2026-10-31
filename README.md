# VMIS — Dr. VedPati Mishra Institute Of Scholars
**डॉ. वेदपति मिश्र इंस्टीट्यूट ऑफ स्कॉलर्स · तत्वमसि** — Handia, Prayagraj

Bilingual (English `/en` · Hindi `/hi`) CBSE-oriented school website with admissions enquiries, Mandatory Public Disclosure and a secure staff dashboard.
Stack: Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS 4 · Firebase (Firestore, Auth, Storage via Admin SDK) · Zod · React Hook Form · Vitest · Playwright.

---

## 1. Quick start (Windows + VS Code + PowerShell)

```powershell
npm install
Copy-Item .env.example .env.local      # fill values (section 2)
npm run dev                            # http://localhost:3000
```
The public site works **without Firebase** (bundled content + "To be confirmed" placeholders). Enquiries, admin and documents need Firebase.

| Command | Purpose |
|---|---|
| `npm run build` / `npm start` | Production build / serve |
| `npm test` | Unit tests (12 levels, validation, translations, CSV safety) |
| `npm run test:e2e` | Playwright (desktop, Android, iPhone viewports) — run `npx playwright install chromium` once |
| `npm run typecheck` | TypeScript check |
| `npm run seed` | Seed 12 academic levels + settings doc |
| `npm run set-role -- you@school.in super_admin` | Grant staff role |
| `npm run backup` / `npm run restore -- backups/<dir> [--apply]` | Full backup with SHA-256 manifest / verified, non-destructive restore |
| `npm run check:logo -- 9deeb285fbd7215597b1831a67755b431492bab4d25a3a42af7bbef65e47453f` | Confirms the official logo file is unmodified |

## 2. Firebase setup (one time, ~15 min)
1. Create a project at console.firebase.google.com (region **asia-south1 / Mumbai**).
2. **Firestore** → Create database (production mode). **Storage** → Get started. **Authentication** → enable *Email/Password*.
3. Project settings → *Your apps* → Web app → copy `apiKey, authDomain, projectId, appId` into the `NEXT_PUBLIC_FIREBASE_*` vars.
4. Project settings → *Service accounts* → Generate key → base64 it into `FIREBASE_SERVICE_ACCOUNT_BASE64`:
   `[Convert]::ToBase64String([IO.File]::ReadAllBytes("service-account.json"))` — then **delete the JSON file**.
5. Set `FIREBASE_STORAGE_BUCKET` (shown in Storage, e.g. `project.firebasestorage.app`), a long random `HASH_SALT` and `CRON_SECRET`.
6. `npm i -g firebase-tools; firebase login; firebase use <project-id>; firebase deploy --only firestore,storage` (rules deny all client access; indexes + TTL policies).
7. Authentication → Users → *Add user* (first admin) → `npm run set-role -- that@email super_admin` → `npm run seed`.
8. Sign in at `/admin/login`. Fill **School settings**, **Academic levels**, upload disclosure documents.

## 3. Deploy
**Firebase App Hosting (recommended):** connect the GitHub repo in Firebase console → App Hosting; edit `apphosting.yaml` (`NEXT_PUBLIC_SITE_URL`, add the `NEXT_PUBLIC_FIREBASE_*` values) and store secrets with `firebase apphosting:secrets:set NAME`. Vercel also works (set the same env vars). Rollback = redeploy the previous release; data is never touched by deploys.
Schedule `POST /api/jobs/notify` every 5 min with header `Authorization: Bearer <CRON_SECRET>` (Cloud Scheduler) to send staff email alerts (`NOTIFY_PROVIDER=resend`).
After go-live: add the domain to Google Search Console and submit `/sitemap.xml`.

## 4. What's built
- **12 levels from one source** (`src/content/levels.ts` + admin overrides): homepage, academics, class pages, admissions, enquiry dropdown + server validation, dashboard analytics, search, sitemap. Order (e.g. Nursery ↔ Prep) is admin-configurable.
- **Pages (EN + HI):** home (all 21 sections), about, vision, leadership, principal, 3 stage pages (dedicated softer Early Years), 12 class pages, CBSE approach (+ verified-only affiliation profile), curriculum, assessment, SAFAL, teaching, development, facilities, sports, admissions hub, process, eligibility table, documents, fees, school visit, early-years parent guide, FAQs (FAQPage schema), news, events, gallery, public disclosure (17 Appendix IX categories), contact, search, digital services (Coming soon), 6 policy pages, bilingual 404, maintenance mode (`MAINTENANCE_MODE=true`).
- **Admissions:** Zod client+server validation, Indian mobile normalisation, honeypot + timing check, Firestore-backed rate limiting, idempotency keys, 24-h duplicate detection, consent record, status history, visit appointment, reference `VMIS-YYYY-XXXXXX`, store-then-notify queue with retries.
- **Admin:** roles (Super Admin, School Management, Principal, Admission Officer, Content Editor, Viewer) enforced server-side from Firestore, httpOnly `__session` cookie with revocation, pipeline, filters/pagination, notes, visits, DPDP erasure, levels, settings, news/events, document upload (magic-byte checked, draft → publish by senior roles, expiry alerts), users, audit log (incl. who viewed which enquiry), CSV/JSON export + full backup with checksums.
- **Security:** CSP/HSTS/frame/permissions headers, same-origin checks, deny-all Firestore/Storage rules, signed URLs, CSV formula-injection guard, no secrets client-side, hashed IPs/phones.
- **SEO:** per-page titles/descriptions, canonical + hreflang (en-IN/hi-IN/x-default), EducationalOrganization/WebSite/WebPage/Breadcrumb/FAQ/Event/Article JSON-LD, sitemap, robots, OG image, `llms.txt`. No invented ratings.
- **A11y/perf:** skip link, keyboard menus, visible focus, reduced motion, self-hosted fonts (no Google requests), static/ISR pages (revalidate 5 min, instant after admin edits), AVIF/WebP.

## 4a. Changelog
- **v1.1** — Fixed hydration warning caused by browser extensions (e.g. Scribe) adding attributes to `<html>`/`<body>` (`suppressHydrationWarning` on root elements only). Added the bilingual launch film on the homepage (`public/media`, lazy-loaded, captions, VideoObject schema) and a sticky mobile Call / WhatsApp / Enquire bar (Call and WhatsApp appear once the numbers are set in Admin → School settings).

## 5. Replacing illustrations with real photos
Put consent-cleared images in `public/photos/` and set them in `src/content/assets.ts`. The logo in `public/brand/` is the uploaded original — do not edit it.

## 6. Must be supplied/confirmed by the school (shown as "To be confirmed" until then)
Address/PIN, phone, email, timings · CBSE affiliation status/number/code/validity (displayed only when status ≠ not verified **and** a verification date is set) · Nursery/Prep order · age eligibility & availability per class · fees · documents list · principal name/message · leadership · history, trust/society · vision/mission approval · facilities, activities, clubs · curriculum/textbooks per session · assessment policy · SAFAL participation · disclosure documents · child-safety policy contacts · grievance officer · retention period · app store links.

## 7. Before launch
- Indian legal review of the Data Protection Notice, Privacy Policy and Terms (DPDP Act 2023 + Rules — verify commencement dates).
- Check the latest CBSE Mandatory Public Disclosure circular against `src/content/disclosure.ts`.
- `npm audit`: remaining advisories are transitive dev/Admin-SDK dependencies; re-check on upgrade.
- The 35–45 s Remotion launch video (Section 24) is a separate project — not included here.
