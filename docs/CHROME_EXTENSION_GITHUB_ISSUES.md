# Chrome Extension: Application Tracker — GitHub Issues Plan

Use the format below when creating issues. In GitHub: click **Create new issue** → choose **Engineering Issue** or **Feature request** / **Feature enhancement** template → paste the **Title** and **Description** for each issue.

**Title format:** `[ENGINEERING] Your issue title` or `[FEATURE] Your issue title`  
**Description format:** Use **What is the issue?** and **Additional context** as in your templates.

---

## Phase 1: Foundation & Setup

### Issue 1
**Template:** Engineering Issue  
**Title:** `[ENGINEERING] Set up Chrome extension project structure (Manifest V3)`

**What is the issue?**  
A clear description of the task to be implemented by the engineers:
- Create a new directory `extension/` at repo root (or `frontend/extension/` if preferred).
- Add `manifest.json` with Manifest V3: name, version, permissions (e.g. `activeTab`, `storage`, `scripting`, host permissions for target job sites).
- Add minimal `background` service worker (e.g. empty script that loads).
- Add placeholder `popup.html` + `popup.js` and optional `popup.css`.
- Document in README how to load the unpacked extension in Chrome (`chrome://extensions` → Load unpacked → select folder).

**Additional context**  
- Acceptance criteria: Extension loads in Chrome without errors; popup opens when icon is clicked.
- Good for first-time contributors.

---

### Issue 2
**Template:** Engineering Issue  
**Title:** `[ENGINEERING] Opportune auth in the extension (Firebase)`

**What is the issue?**  
A clear description of the task to be implemented by the engineers:
- Use the same Firebase project as Opportune web app for auth.
- In the extension: implement sign-in (e.g. Chrome identity API or Firebase popup) and store ID token / refresh token securely (e.g. `chrome.storage.session` or `chrome.storage.local` with care).
- Add a popup or options page “Login” state: when not logged in, show “Sign in with Google” (or same method as Opportune); when logged in, show user email and “Sign out”.
- Ensure token is sent with every request to Opportune API (e.g. `Authorization: Bearer <token>`).

**Additional context**  
- Acceptance criteria: User can log in and sign out in the extension; token is persisted and included in API requests; backend accepts it (or Issue 3 covers backend).

---

### Issue 3
**Template:** Engineering Issue  
**Title:** `[ENGINEERING] Backend — support extension auth and CORS for Chrome extension`

**What is the issue?**  
A clear description of the task to be implemented by the engineers:
- Accept requests from the extension: validate Firebase ID token (same as web app) and identify user.
- Ensure CORS allows the extension origin (e.g. `chrome-extension://<id>`); document required headers.
- Optionally add a simple “ping” or “me” endpoint for the extension to verify auth.

**Additional context**  
- Acceptance criteria: Extension can call an authenticated Opportune API endpoint and get 200 when token is valid.

---

## Phase 2: Core — Application creation from extension

### Issue 4
**Template:** Engineering Issue  
**Title:** `[ENGINEERING] Backend — API to create application from extension`

**What is the issue?**  
A clear description of the task to be implemented by the engineers:
- Expose (or reuse) an API endpoint for “create application” that accepts: company (name or ID), position, location, job URL, status (e.g. APPLIED), optional note.
- If company is sent by name, resolve to existing company (e.g. fuzzy match) or return “no match” / list of candidates; document behavior.
- Return created application (with ID) or clear error (validation, auth, duplicate).

**Additional context**  
- Acceptance criteria: Extension can POST and create an application; response includes application ID and company link when matched.

---

### Issue 5
**Template:** Engineering Issue  
**Title:** `[ENGINEERING] Backend — Company matching service (fuzzy match) for extension`

**What is the issue?**  
A clear description of the task to be implemented by the engineers:
- Implement a small service/helper: given a company name string, search Opportune companies (e.g. by normalized name, alias) and return best match(es) with a confidence score.
- Support “create new company” path when no match (or separate issue); document how extension should call this (e.g. GET `/api/companies/match?q=...` or part of POST application).

**Additional context**  
- Acceptance criteria: Backend can match “Google LLC” / “Google” to same company; returns score and company ID; documented for extension use.

---

### Issue 6
**Template:** Engineering Issue  
**Title:** `[ENGINEERING] Extension — Extract job data from LinkedIn job pages`

**What is the issue?**  
A clear description of the task to be implemented by the engineers:
- Add a content script that runs only on LinkedIn job pages (match pattern in manifest).
- From the DOM, extract: company name, job title, location, job URL (and optional fields if easy).
- Expose this data to the extension (e.g. send to background via `chrome.runtime.sendMessage` or store in a known format for popup to read).
- Prefer one job board first; document selectors and any assumptions (e.g. “LinkedIn job detail page”).

**Additional context**  
- Acceptance criteria: On a LinkedIn job page, extension can read company, title, location, URL reliably (manual test checklist for 2–3 pages).

---

### Issue 7
**Template:** Engineering Issue  
**Title:** `[ENGINEERING] Extension — Popup UI: show extracted job and "Save to Opportune"`

**What is the issue?**  
A clear description of the task to be implemented by the engineers:
- When user opens the popup on a supported job page, show the extracted job info (company, title, location, URL).
- Allow editing fields (plain inputs) before saving.
- “Save to Opportune” button: call backend API (Issue 4) with current user token; show success toast or error message.
- If backend returns “multiple company matches”, show a simple list for user to pick one (or “Add new company”); then retry create.

**Additional context**  
- Acceptance criteria: User can open popup, see/edit job data, click Save, and see the application in Opportune (e.g. Applications page).

---

## Phase 3: Auto-detect and more job boards

### Issue 8
**Template:** Feature request  
**Title:** `[FEATURE] Extension — Auto-detect Apply / application submit on LinkedIn`

**What is the issue?**  
Suggest a new feature for the project:
- On LinkedIn, detect when user clicks “Apply” or submits an application (e.g. listen for click/submit on known buttons/forms).
- When detected, extract job data (reuse logic from Issue 6) and either: (a) show a small in-page notification “Save to Opportune?” with Confirm/Cancel, or (b) auto-send to backend and show “Saved” toast.
- Prefer one flow (e.g. one-click confirm) and document it.

**Additional context**  
- Acceptance criteria: After user applies on LinkedIn, they can confirm once and the application appears in Opportune; no duplicate if they confirm only once.

---

### Issue 9
**Template:** Feature request  
**Title:** `[FEATURE] Extension — Support more job boards (e.g. Indeed, Handshake)`

**What is the issue?**  
Suggest a new feature for the project:
- Add content scripts and host permissions for 1–2 more job boards (e.g. Indeed, Handshake or Glassdoor).
- For each: define URL match pattern, selectors for company/title/location/URL, and reuse the same “extract → send to background/popup” pipeline as LinkedIn.
- Document each site’s selectors and any limitations (e.g. “Indeed job detail page only”).

**Additional context**  
- Acceptance criteria: Extraction works on at least 2 job boards; popup “Save to Opportune” works from those pages.

---

## Phase 4: Status updates and polish

### Issue 10
**Template:** Engineering Issue  
**Title:** `[ENGINEERING] Backend — API to update application status (for extension)`

**What is the issue?**  
A clear description of the task to be implemented by the engineers:
- Expose PATCH (or PUT) for application status: e.g. `PATCH /api/applications/:id` with `{ status: "OA" }` (or whatever enum Opportune uses).
- Validate status enum and that the application belongs to the authenticated user.

**Additional context**  
- Acceptance criteria: Extension (or web) can update an application’s status and it persists.

---

### Issue 11
**Template:** Feature request  
**Title:** `[FEATURE] Extension — Popup: list recent applications and update status`

**What is the issue?**  
Suggest a new feature for the project:
- In popup (or a “My applications” tab), call backend to list current user’s recent applications (reuse existing GET applications API if any).
- Show a short list (e.g. last 5–10) with position and company; clicking one allows changing status (dropdown: Applied, OA, Phone, Final, Offer, Rejected) and saving via Issue 10.

**Additional context**  
- Acceptance criteria: User can open popup, see recent applications, change status, and see update in Opportune.

---

### Issue 12
**Template:** Feature request  
**Title:** `[FEATURE] Extension — Offline queue (IndexedDB + retry)`

**What is the issue?**  
Suggest a new feature for the project:
- When “Save to Opportune” or “Update status” fails (network error), store the request in IndexedDB (e.g. queue of { action, payload, timestamp }).
- When extension loads or when coming back online, retry queued requests; remove on success; show a small badge or toast when queue is non-empty.

**Additional context**  
- Acceptance criteria: User can trigger save while offline; after going online, requests are sent and queue drains; no duplicate applications if payload is deduplicated.

---

### Issue 13
**Template:** Feature enhancement  
**Title:** `[FEATURE] Extension — Notifications and badge for saved applications`

**What is the issue?**  
Suggest an improvement or enhancement to an existing feature:
- When an application is auto-detected or saved, show a small notification (e.g. `chrome.notifications` or in-page toast) “Application saved to Opportune.”
- Optional: set badge on extension icon (e.g. count of pending confirmations or failed retries) and clear when queue is empty.

**Additional context**  
- Acceptance criteria: User gets clear feedback when an application is saved; optional badge reflects pending state.

---

### Issue 14
**Template:** Feature enhancement  
**Title:** `[FEATURE] Extension — Options/settings page`

**What is the issue?**  
Suggest an improvement or enhancement to an existing feature:
- Add an options page (e.g. `options.html` in manifest): enable/disable auto-detect per job board, toggle notifications, and “Clear offline queue.”
- Persist settings in `chrome.storage.sync` or `local` so they are used by content scripts and background.

**Additional context**  
- Acceptance criteria: User can turn off LinkedIn auto-detect and still use manual “Save to Opportune”; settings persist after closing browser.
- Good for first-time contributors.

---

## Phase 5: Security, performance, docs

### Issue 15
**Template:** Engineering Issue  
**Title:** `[ENGINEERING] Extension — Security and permissions review`

**What is the issue?**  
A clear description of the task to be implemented by the engineers:
- Review manifest: request only needed host permissions (e.g. specific job board domains, not `<all_urls>` if possible).
- Ensure tokens are stored in a secure way (e.g. `chrome.storage.session` for tokens); no secrets in content scripts.
- Document in README: what data is sent to Opportune, what is stored locally, and that we don’t send data to third parties.

**Additional context**  
- Acceptance criteria: Permissions are minimal; token handling is documented; no sensitive data in content script context.

---

### Issue 16
**Template:** Engineering Issue  
**Title:** `[ENGINEERING] Extension — Performance and error handling`

**What is the issue?**  
A clear description of the task to be implemented by the engineers:
- Ensure content scripts are injected only on target URLs and don’t slow page load (e.g. `run_at: "document_idle"` if appropriate).
- Add timeouts for API calls; show user-friendly error messages (e.g. “Could not reach Opportune. Try again or save later.”).
- Optional: add simple error reporting (e.g. log to backend or Sentry) for failed API calls.

**Additional context**  
- Acceptance criteria: Job board pages load without noticeable delay; API failures show clear messages; no uncaught errors in extension.

---

### Issue 17
**Template:** Engineering Issue  
**Title:** `[ENGINEERING] Extension — Documentation and release prep`

**What is the issue?**  
A clear description of the task to be implemented by the engineers:
- README in extension folder: how to install unpacked, how to build (if any build step), env vars (e.g. API base URL), and how to run Opportune backend locally for testing.
- Short “Contributing” section: how to add a new job board (selectors, manifest permissions, content script).
- Checklist for Chrome Web Store (if applicable): privacy policy, screenshots, description.

**Additional context**  
- Acceptance criteria: New dev can clone repo, load extension, and save one application to local Opportune; doc explains adding a new job board.

---

## Suggested order for the team

| Order | Issue | Template | Assignee type |
|-------|--------|----------|----------------|
| 1 | Issue 1 — Extension project structure | Engineering Issue | Any |
| 2 | Issue 3 — Backend CORS + auth | Engineering Issue | Backend |
| 3 | Issue 2 — Extension auth (Firebase) | Engineering Issue | Frontend / full-stack |
| 4 | Issue 4 — Backend create-application API | Engineering Issue | Backend |
| 5 | Issue 5 — Company matching service | Engineering Issue | Backend |
| 6 | Issue 6 — LinkedIn job extraction | Engineering Issue | Frontend |
| 7 | Issue 7 — Popup UI Save to Opportune | Engineering Issue | Frontend |
| 8 | Issue 8 — Auto-detect Apply (LinkedIn) | Feature request | Frontend |
| 9 | Issue 9 — More job boards | Feature request | Frontend |
| 10 | Issue 10 — Backend update status API | Engineering Issue | Backend |
| 11 | Issue 11 — Popup list + update status | Feature request | Frontend |
| 12 | Issue 12 — Offline queue | Feature request | Frontend |
| 13 | Issue 13 — Notifications + badge | Feature enhancement | Frontend |
| 14 | Issue 14 — Options page | Feature enhancement | Frontend |
| 15 | Issue 15 — Security review | Engineering Issue | Any |
| 16 | Issue 16 — Performance + errors | Engineering Issue | Any |
| 17 | Issue 17 — Docs + release prep | Engineering Issue | Any |

---

## How to create each issue in GitHub

1. Go to **Issues** → **Create new issue**.
2. Choose the template that matches the issue:
   - **Engineering Issue** → for `[ENGINEERING]` titles (Issues 1–7, 10, 15–17).
   - **Feature request** → for `[FEATURE]` new capabilities (Issues 8, 9, 11, 12).
   - **Feature enhancement** → for `[FEATURE]` UX improvements (Issues 13, 14).
3. **Add a title:** Use the exact title from above (e.g. `[ENGINEERING] Set up Chrome extension project structure (Manifest V3)`).
4. **Add a description:** Copy the **What is the issue?** and **Additional context** blocks from the issue above into the template’s description (replace the placeholder text).
5. Set **Label** (e.g. `engineering` for Engineering Issue), Assignee, Project, or Milestone as needed.
6. Click **Create issue** (or **Create more** to add another).
