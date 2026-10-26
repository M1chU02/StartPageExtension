🚀 StartPageExtension – Quick‑look review

Below is a concise, prioritized audit of the current code base.
I’ve grouped findings by impact and added concrete “first‑action” recommendations you can apply immediately, followed
by medium‑ and longer‑term improvements.

---

1️⃣ Critical‑fix checklist (do these first)

#: 1
Issue: manifest.json – host permissions are “:///_”
Where: manifest.json
Why it matters: Gives the extension full‑read access to every site – unnecessary and a security red‑flag.
Quick fix: Replace with a whitelist of only the domains you really call: <br>json "host_permissions": [
"https://api.open‑meteо.com/_", "https://newsdata.io/*", "https://api.bigdatacloud.net/*",
"https://translate.googleapis.com/*" ]
────────────────────────────────────────
#: 2
Issue: Content‑Security‑Policy too narrow (only script-src/object-src)
Where: manifest.json
Why it matters: The page loads Google‑Fonts, Font‑Awesome CSS and external images. CSP will block them and cause
console errors.
Quick fix: Add the needed directives, e.g.: <br>json "content*security_policy": { "extension_pages": "script-src
'self'; object-src 'self'; style-src 'self' https://fonts.googleapis.com https://cdnjs.cloudflare.com; font-src
'self' https://fonts.gstatic.com; img-src 'self' data: https://*.cdn.\_ https://\*.svg; connect-src 'self'
https://api.open‑meteо.com https://newsdata.io https://api.bigdatacloud.net https://translate.googleapis.com;" }
────────────────────────────────────────
#: 3
Issue: Syntax error in settings.js (showChangelog)
Where: script/settings.js lines 740‑756
Why it matters: The modal never opens; the whole settings UI may crash.
Quick fix: Close the string after the height value: height: "600px", (add the missing quote).
────────────────────────────────────────
#: 4
Issue: backup.js leaks a dangling object‑URL
Where: script/backup.js line 39
Why it matters: URL.revokeObjectURL(url) references an undefined variable; the download link stays in memory.
Quick fix: Capture the URL in a variable and revoke it: <br>const objUrl = URL.createObjectURL(blob); a.href = objUrl;

… URL.revokeObjectURL(objUrl);
────────────────────────────────────────
#: 5
Issue: date.js double‑timer (setInterval + recursive setTimeout)
Where: script/date.js lines 1‑13
Why it matters: Two timers run for the same clock, wasting CPU and potentially causing drift.
Quick fix: Keep one approach. Easiest: replace the whole file with a single setInterval(() => { … }, 1000); and drop
the inner setTimeout.
────────────────────────────────────────
#: 6
Issue: notepad-text-editor.js arrow‑function loses this (font‑size selector)
Where: script/notepad-text-editor.js line 15
Why it matters: Changing the font size never works.
Quick fix: Use a normal function or read event.target.value: <br>fontSize.addEventListener("change", function (e) {
changeFontSize(e.target.value); });
────────────────────────────────────────
#: 7
Issue: history.js nests <a> inside another <a>
Where: script/history.js lines 13‑16 & 41‑44
Why it matters: Invalid HTML → click handling may break, and browsers can auto‑close tags unexpectedly.
Quick fix: Replace the outer <a> with a <div> or <li> and keep the inner <a> for the actual link.
────────────────────────────────────────
#: 8
Issue: news.js relies on global geolocationCookie
Where: script/news.js lines 37‑43 & 183‑187
Why it matters: If the weather script fails or runs later, geolocationCookie is undefined, causing a runtime error.
Quick fix: Pull the cookie locally: const geolocationCookie = getCookie("geolocation"); (reuse the getCookie function
from weather.js). Add a safe‑fallback if the cookie is missing.
────────────────────────────────────────
#: 9
Issue: Un‑sanitized insertion of external data (news titles, bookmark names, note content)
Where: script/news.js, script/bookmarks.js, script/notepad.js
Why it matters: User‑controlled strings are written with innerHTML, opening XSS vectors.
Quick fix: Wherever you use innerHTML with data from an API or localStorage, replace with textContent (or a proper
escaping library). For HTML fragments you control, keep them separate from untrusted strings.
────────────────────────────────────────
#: 10
Issue: showChangelog builds HTML via template string without sanitising markdown
Where: script/settings.js → showChangelog()
Why it matters: If the changelog file ever contains malicious HTML, it will be rendered raw.
Quick fix: Use the safe version of marked (marked.parse) with the sanitize: true option or strip HTML tags before
insertion.

▎ Result of fixing the above 10 items: the extension will load reliably, respect the least‑privilege principle, and
▎ avoid the most obvious runtime errors and XSS risks.

---

2️⃣ Important – next‑level improvements (≈2‑3 days)

Area: Storage model
Why it matters: All data lives in localStorage. Chrome extensions have a dedicated asynchronous
chrome.storage.{local,sync} API that works across extension contexts (background, popup, content scripts) and
respects storage quotas.
Suggested change: Migrate bookmarks, notes, to‑do lists, theme selection, background image, notification settings,
etc.
to chrome.storage.local. Wrap reads/writes in async/await helpers (e.g., await storage.get(key)).
────────────────────────────────────────
Area: Error handling on network calls
Why it matters: Many fetch(...).then(... ) chains lack .catch. A failed request leaves the UI blank and produces
silent
errors.
Suggested change: Add .catch(err => { console.error(err); /_ show user‑friendly toast _/ }) to all external fetch
usage
– weather.js, news.js, translator/script.js, themes.js (if kept).
────────────────────────────────────────
Area: Replace deprecated document.execCommand
Why it matters: The API is obsolete in modern browsers and may be removed.
Suggested change: Switch to a lightweight editor library (Quill, TinyMCE) or implement simple formatting via
document.getSelection() and insertNode. If you stay with execCommand, guard it (check
document.queryCommandSupported).
────────────────────────────────────────
Area: Remove dead code
Why it matters: script/themes.js fetches iFrame HTML but never uses the result, adding unnecessary network traffic.
Suggested change: Delete the whole file (or, if you intended to use the styles, implement the actual logic).
────────────────────────────────────────
Area: Deduplicate event‑listener registration
Why it matters: Settings modals (showGeneralSettingsModal) attach listeners every time the modal opens, leading to
multiple identical callbacks on repeated opens.
Suggested change: Register listeners once when the script loads, or clean them up (removeEventListener) before
re‑adding.
────────────────────────────────────────
Area: Consistent “const/let” usage
Why it matters: A few files still use var or re‑assign let where the value never changes.
Suggested change: Run a quick lint (ESLint) and replace var with const (or let when mutable).
────────────────────────────────────────
Area: Responsive UI / Accessibility
Why it matters: Many UI pieces use fixed widths/heights (600px, 700px). No ARIA labels on custom buttons, and some
images lack alt.
Suggested change: Use CSS flexible units (max-width: 90vw; height: auto) and add aria-label/role attributes to WinBox
close/minimize buttons. Ensure every <img> has meaningful alt.
────────────────────────────────────────
Area: Throttled cursor tracking
Why it matters: cursor.js updates the custom cursor on every mousemove – up to 60 fps, taxing low‑end devices.
Suggested change: Wrap the handler in requestAnimationFrame or a 50‑ms debounce.
────────────────────────────────────────
Area: Unit tests for core utilities
Why it matters: No tests → regressions are likely hidden.
Suggested change: Add a test harness (Jest) for: <br>• filterDuplicates (news) <br>• linkifyContent (notepad) <br>•
saveAndLoad wrappers (storage) <br>· Any pure‑function helpers.
────────────────────────────────────────
Area: Add a lint/formatter
Why it matters: Code style is inconsistent (mixed quotes, missing semicolons, inconsistent indent).
Suggested change: Add ESLint + Prettier config (standard “airbnb‑base” or “google”). Run automatically in a pre‑commit

hook.

---

3️⃣ Long‑term / architectural upgrades (≈1‑2 weeks)

┌──────────────────────────┬─────────────────────────────────────────┬────────────────────────────────────────────┐
│ Goal │ Benefit │ Example actions │
├──────────────────────────┼─────────────────────────────────────────┼────────────────────────────────────────────┤
│ │ Split code into ES modules, enable │ Create src/ folders, write each feature as │
│ Modular build pipeline │ tree‑shaking, minify assets, and │ an ES module (import … from │
│ (Webpack/Vite/Parcel) │ automatically inject CSP‑compatible │ './weather.js'), and bundle with Vite. │
│ │ hashes. │ │
├──────────────────────────┼─────────────────────────────────────────┼────────────────────────────────────────────┤
│ │ Strong typing catches many bugs (e.g., │ Rename .js → .ts, add tsconfig.json, and │
│ TypeScript migration │ wrong index handling in drag‑and‑drop) │ gradually convert files (start with │
│ │ early, improves IDE autocomplete. │ utility modules). │
├──────────────────────────┼─────────────────────────────────────────┼────────────────────────────────────────────┤
│ Chrome Extension │ Use Service Workers │ Move the background alarms/notification │
│ Manifest V3 │ (background.service_worker) for │ logic into background.js declared as a │
│ best‑practice │ background tasks, avoid persistent │ service worker (add "background": { │
│ │ background pages. │ "service_worker": "background.js" }). │
├──────────────────────────┼─────────────────────────────────────────┼────────────────────────────────────────────┤
│ Centralised │ Avoid magic strings/URLs sprinkled │ Create a config.js exporting API_KEYS, │
│ configuration & │ across files. │ ENDPOINTS, MAX_NOTES, MAX_BOOKMARKS, etc. │
│ constants │ │ │
├──────────────────────────┼─────────────────────────────────────────┼────────────────────────────────────────────┤
│ Improved notification │ Current “testNotification” uses │ Wrap notification logic in a helper that │
│ system │ chrome.notifications or the Web │ chooses the best API, adds a fallback UI │
│ │ Notification API inconsistently. │ toast, and respects user opt‑in. │
├──────────────────────────┼─────────────────────────────────────────┼────────────────────────────────────────────┤
│ Better onboarding / │ The settings modal is dense; splitting │ Refactor showGeneralSettingsModal into │
│ settings UI │ into tabs or expanding sections makes │ multiple sub‑modals (User, Appearance, │
│ │ it easier to maintain. │ Data, Notifications). │
├──────────────────────────┼─────────────────────────────────────────┼────────────────────────────────────────────┤
│ Automated CI/CD │ Guarantees lint, tests, and a built │ Add GitHub Actions workflow: npm ci → lint │
│ │ artifact on every push. │ → test → build → upload artifact. │
├──────────────────────────┼─────────────────────────────────────────┼────────────────────────────────────────────┤
│ Internationalisation │ All UI strings are hard‑coded in │ Extract strings to a messages.json and │
│ (i18n) │ English. │ load based on chrome.i18n.getMessage. │
├──────────────────────────┼─────────────────────────────────────────┼────────────────────────────────────────────┤
│ │ Use Chrome DevTools Lighthouse to gauge │ Target > 90 % in Lighthouse after bundling │
│ Performance audit │ start‑up time, bundle size, and │ and lazy‑loading heavy assets (e.g., │
│ │ accessibility score. │ background images). │
└──────────────────────────┴─────────────────────────────────────────┴────────────────────────────────────────────┘

---

📦 Suggested “first‑step” action plan (≈1 hour)

1. Patch the 10 critical bugs (items 1‑10 in the Critical‑fix checklist). They are tiny edits and will immediately
   stop the extension from crashing.
2. Lock down the manifest – replace the wildcard host permissions and extend CSP as shown.
3. Add sanitizer wrappers for any innerHTML that receives external data (one‑liner helper: function safeHTML(str) {
   const div = document.createElement('div'); div.textContent = str; return div.innerHTML; }). Update the three places
   (news, bookmarks, notepad).
4. Run a quick lint (npx eslint . --fix) to catch stray vars and formatting inconsistencies.
5. Commit & test – open a new Chrome tab, reload the unpacked extension, and verify that the console is clean and the
   UI works (settings, backup, history, etc.).

After these steps you’ll have a stable baseline to iterate on the medium‑term improvements.

---

📚 Quick reference snippets for the most common fixes

1️⃣ CSP & host‑permission update (manifest)

{
"manifest*version": 3,
"name": "StartPageExtension",
"author": "MichU",
"version": "1.0",
"permissions": [
"tabs",
"activeTab",
"declarativeContent",
"storage",
"history"
],
"host_permissions": [
"https://api.open-meteo.com/*",
"https://newsdata.io/*",
"https://api.bigdatacloud.net/*",
"https://translate.googleapis.com/*"
],
"content_security_policy": {
"extension_pages": "script-src 'self'; object-src 'self'; style-src 'self' https://fonts.googleapis.com
https://cdnjs.cloudflare.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https://\*.cdn.\_
https://\*.svg; connect-src 'self' https://api.open-meteo.com https://newsdata.io https://api.bigdatacloud.net
https://translate.googleapis.com"
},
...
}

2️⃣ Fixing date.js timer

// date.js – keep only a single interval
function clock() {
const now = new Date();
const hour = now.getHours().toString().padStart(2, '0');
const min = now.getMinutes().toString().padStart(2, '0');
document.getElementById('hour').textContent = `${hour}:${min}`;
}
setInterval(clock, 1000);
clock(); // run immediately on load

3️⃣ Safe HTML helper

function safeHTML(str) {
const div = document.createElement('div');
div.textContent = str; // escapes any markup
return div.innerHTML;
}

Usage example (news.js)

newstile.innerHTML = `    <a href="${safeHTML(articleUrl)}" target="_blank">
      <div class="newstile-content">
        ${imageUrl ?`<img src="${safeHTML(imageUrl)}" class="articleImg" />` : ''}
        <h2>${safeHTML(title)}</h2>
        <p>${safeHTML(formattedDate)}</p>
      </div>
    </a><hr>`;

4️⃣ Fix in backup.js (URL revocation)

function downloadBackup() {
const timestamp = new Date().toISOString().replace(/[-T:]/g, '').slice(0, -5);
const allData = { /_ … _/ };
const blob = new Blob([JSON.stringify(allData)], { type: 'application/json' });
const objUrl = URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = objUrl;
a.download = `backup_${timestamp}.json`;
a.click();
URL.revokeObjectURL(objUrl);
}

5️⃣ Font‑size selector fix in notepad-text-editor.js

fontSize.addEventListener('change', function (e) {
changeFontSize(e.target.value);
});

---

🎯 TL;DR – What to do first

┌───────────────────────────────────────────────────────┬────────┬────────────────────────────────────────────────┐
│ ✅ Done │ ⏱️ Time │ Action │
├───────────────────────────────────────────────────────┼────────┼────────────────────────────────────────────────┤
│ Lock down permissions & CSP │ ~5 min │ Update manifest.json. │
├───────────────────────────────────────────────────────┼────────┼────────────────────────────────────────────────┤
│ Patch syntax/runtime bugs (settings, backup, date, │ ~10 min │ Apply the small code edits above. │
│ font‑size, history) │ │ │
├───────────────────────────────────────────────────────┼────────┼────────────────────────────────────────────────┤
│ Add global data sanitiser │ ~5 min │ Insert safeHTML helper and replace three │
│ │ │ innerHTML usages. │
├───────────────────────────────────────────────────────┼────────┼────────────────────────────────────────────────┤
│ Run linter & commit │ ~5 min │ npx eslint . --fix. │
├───────────────────────────────────────────────────────┼────────┼────────────────────────────────────────────────┤
│ Test in Chrome │ ~5 min │ Reload unpacked extension, click each feature, │
│ │ │ watch console. │
└───────────────────────────────────────────────────────┴────────┴────────────────────────────────────────────────┘

Once those are green, you have a solid foundation to move onto storage migration, error handling, and the longer‑term
refactor roadmap.

Happy coding! 🎉 If you need any of the snippets turned into full‑file patches or want help wiring up chrome.storage,
just let me know.
