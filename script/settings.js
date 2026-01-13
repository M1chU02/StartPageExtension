const footerEl = document.getElementById("footer");
const settingsBtn = document.getElementById("settingsBtn");

// Define the HTML content for the settings modal
const generalSettingsModalContent = `<div id="general-settings">
  <div id="general-settings-form">
    
    <div class="settings-tile" id="usernameChangeEl">
      <h1>Change Username</h1>
      <label for="username" id="change-username-label">Username:</label>
      <input type="text" id="username" autocomplete="off">
      <button id="changeUsername">Save</button>
    </div>

    <div class="settings-tile" id="searchEngineChangeEl">
      <h1>Search Engine</h1>
      <select>
        <option>Google</option>
        <option>Microsoft Bing</option>
        <option>Yahoo!</option>
        <option>Yandex</option>
        <option>DuckDuckGo</option>
      </select>
    </div>

    <div id="socialsEdit">
      <h1>Socials</h1>

      <div id="socialsPreviewHost"></div>

      <div id="socialsSitesList" style="display:none;">
        <h2>Choose a site</h2>
        <ul></ul>
      </div>
    </div>

    <div class="settings-tile">
      <h1>Bookmarks</h1>
      <button id="export-bookmarks-button">Export Bookmarks</button>
      <label for="import-bookmarks-input" id="import-bookmarks-label">Import Bookmarks</label>
      <input type="file" accept=".json" id="import-bookmarks-input">
      <button id="delete-bookmarks-button" class="delete">Delete All Bookmarks</button>
    </div>

    <div class="settings-tile">
      <h1>Notes</h1>
      <button id="export-notes-button">Export Notes</button>
      <label for="import-notes-input" id="import-notes-label">Import Notes</label>
      <input type="file" accept=".json" id="import-notes-input">
      <button id="delete-notes-button" class="delete">Delete All Notes</button>
    </div>

    <div class="settings-tile">
      <h1>All Data</h1>
      <button id="export-all-data-button">Export All Data</button>
      <label for="import-all-data-input" id="import-all-data-label">Import All Data</label>
      <input type="file" accept=".json" id="import-all-data-input">
      <button id="delete-all-data" class="delete">Delete All Data</button>
    </div>

    <div class="settings-tile" id="backgroundSelection">
      <h1>Appearance</h1>
      <button id="change-theme-button">Change Theme</button>
      <label>Select Background:</label>
      <div id="backgroundImagesContainer"></div>
      <button id="random-theme-background-button">Random Background</button>
    </div>

    <div class="settings-tile">
      <h1>About</h1>
      <button id="show-changelog-button">Changelog</button>
    </div>
  </div>
</div>`;

let generalSettingsWindow;

function showGeneralSettingsModal() {
  generalSettingsWindow = new WinBox({
    title: "General Settings",
    background: "transparent",
    modal: true,
    width: "1050px",
    height: "85%",
    html: generalSettingsModalContent,
    x: "center",
    y: "center",
    onclose: function () {
      closeSocialPicker();
    },
  });

  const body = generalSettingsWindow.body;

  body
    .querySelector("#changeUsername")
    .addEventListener("click", changeUserName);
  body.querySelector("#username").addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      changeUserName();
    }
  });

  body
    .querySelector("#delete-bookmarks-button")
    .addEventListener("click", deleteAllBookmarks);
  body
    .querySelector("#export-bookmarks-button")
    .addEventListener("click", exportBookmarks);
  body
    .querySelector("#import-bookmarks-input")
    .addEventListener("change", importBookmarks);

  body
    .querySelector("#delete-notes-button")
    .addEventListener("click", deleteAllNotes);
  body
    .querySelector("#export-notes-button")
    .addEventListener("click", exportNotes);
  body
    .querySelector("#import-notes-input")
    .addEventListener("change", importNotes);

  body
    .querySelector("#export-all-data-button")
    .addEventListener("click", exportAllData);
  body
    .querySelector("#import-all-data-input")
    .addEventListener("change", importAllData);
  body
    .querySelector("#change-theme-button")
    .addEventListener("click", openThemeSettingsModal);

  body
    .querySelector("#show-changelog-button")
    .addEventListener("click", showChangelog);

  manageSearchEngine(body);
  buildSocialsPreviewInSettings(body);
  closeSocialPicker();
  if (typeof window.initializeBackgroundSettings === "function") {
    window.initializeBackgroundSettings(body);
  }
}

settingsBtn.addEventListener("click", showGeneralSettingsModal);

function changeUserName() {
  let newUserName = document.getElementById("username").value;
  if (newUserName == "") {
    document.getElementById("username").placeholder = "Enter username!";
  } else {
    localStorage.setItem("userName", newUserName);
    location.reload();
  }
}

function manageSearchEngine(scope = document) {
  const searchEngineSelect = scope.querySelector(
    "#searchEngineChangeEl select"
  );

  const searchEngines = {
    Google: "https://www.google.com/search?q=",
    "Microsoft Bing": "https://www.bing.com/search?q=",
    "Yahoo!": "https://search.yahoo.com/search?p=",
    Yandex: "https://yandex.com/search/?text=",
    DuckDuckGo: "https://duckduckgo.com/?q=",
  };

  const savedSearchEngine = localStorage.getItem("selectedSearchEngine");
  if (savedSearchEngine && searchEngines[savedSearchEngine]) {
    searchEngineSelect.value = savedSearchEngine;
  }

  function updateSearchForm() {
    const selectedEngine = searchEngineSelect.value;
    localStorage.setItem("selectedSearchEngine", selectedEngine);
  }

  updateSearchForm();

  searchEngineSelect.addEventListener("change", updateSearchForm);
}

// Global search initialization
(function initGlobalSearch() {
  const searchForm = document.querySelector("#searchform");
  const searchInput = document.querySelector("#searchinput");

  const searchEngines = {
    Google: "https://www.google.com/search?q=",
    "Microsoft Bing": "https://www.bing.com/search?q=",
    "Yahoo!": "https://search.yahoo.com/search?p=",
    Yandex: "https://yandex.com/search/?text=",
    DuckDuckGo: "https://duckduckgo.com/?q=",
  };

  searchForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const savedSearchEngine =
      localStorage.getItem("selectedSearchEngine") || "Google";
    const searchUrl = searchEngines[savedSearchEngine];
    const searchQuery = encodeURIComponent(searchInput.value);
    window.location.href = `${searchUrl}${searchQuery}`;
  });
})();

function deleteAllBookmarks() {
  localStorage.removeItem("bookmarks");
  renderBookmarks();
}

function exportBookmarks() {
  const bookmarks = JSON.stringify(localStorage.getItem("bookmarks"));
  const blob = new Blob([bookmarks], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "bookmarks.json";
  a.click();

  URL.revokeObjectURL(url);
}

function importBookmarks() {
  const fileInput = document.getElementById("import-bookmarks-input");
  const file = fileInput.files[0];

  if (file) {
    const reader = new FileReader();

    reader.onload = function (e) {
      const importedBookmarks = JSON.parse(e.target.result);
      localStorage.setItem("bookmarks", importedBookmarks);
      renderBookmarks();
      location.reload();
    };

    reader.readAsText(file);
  }
}

function deleteAllNotes() {
  localStorage.removeItem("notepadNotes");
  if (typeof notes !== "undefined") notes.length = 0;
  if (typeof saveNotes === "function") saveNotes();
  if (typeof loadDefaultNote === "function") loadDefaultNote();
  if (typeof updateNoteList === "function") updateNoteList();
  if (typeof switchNote === "function") switchNote(0);
}

function exportNotes() {
  const notes = JSON.stringify(localStorage.getItem("notepadNotes"));
  const blob = new Blob([notes], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "notes.json";
  a.click();

  URL.revokeObjectURL(url);
}

function importNotes() {
  const fileInput = document.getElementById("import-notes-input");
  const file = fileInput.files[0];

  if (file) {
    const reader = new FileReader();

    reader.onload = function (e) {
      const importedNotes = JSON.parse(e.target.result);
      localStorage.setItem("notepadNotes", importedNotes);
      if (typeof initializeNotepad === "function") initializeNotepad();
      location.reload();
    };

    reader.readAsText(file);
  }
}

// === THEME MODAL ===

const THEMES_CONFIG = [
  { id: "dark-mode", name: "Dark Mode" },
  { id: "ocean-blue", name: "Ocean Blue" },
  // Add new themes here
];

let themeSettingsWindow;

async function openThemeSettingsModal() {
  // Container for the dynamic content
  const themeListContainer = document.createElement("div");
  themeListContainer.id = "theme-list";
  themeListContainer.classList.add("loading-themes");
  themeListContainer.textContent = "Loading themes...";

  themeSettingsWindow = new WinBox({
    title: "Theme Selection",
    background: "transparent",
    modal: true,
    width: "1050px",
    height: "85%",
    html: `<div id="theme-settings"></div>`, // simplified container
    x: "center",
    y: "center",
  });

  const body = themeSettingsWindow.body;
  const settingsContainer = body.querySelector("#theme-settings");
  settingsContainer.appendChild(themeListContainer);

  // Generate previews
  await generateThemePreviews(themeListContainer);

  themeListContainer.classList.remove("loading-themes");

  // Attach event listeners to the cards
  const cards = themeListContainer.querySelectorAll(".theme-preview-card");
  cards.forEach((card) => {
    card.addEventListener("click", handleThemeSelection);
  });
}

async function generateThemePreviews(container) {
  container.innerHTML = ""; // Clear loading text

  for (const theme of THEMES_CONFIG) {
    const cssVars = await fetchThemeCSS(theme.id);
    const card = createThemeCard(theme, cssVars);
    container.appendChild(card);
  }
}

async function fetchThemeCSS(themeId) {
  try {
    const response = await fetch(`/themes/${themeId}.css`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const cssText = await response.text();
    const rootMatch = cssText.match(/:root\s*{([^}]+)}/);
    if (rootMatch) {
      const varsBlock = rootMatch[1];
      return {
        bg: extractVar(varsBlock, "--background-color"),
        font: extractVar(varsBlock, "--font-color"),
        fontFamily: extractVar(varsBlock, "--font-family"),
        modalBg: extractVar(varsBlock, "--modal-background"),
        formBg: extractVar(varsBlock, "--form-container-background"),
        btnBg: extractVar(varsBlock, "--button-background"),
        btnHover: extractVar(varsBlock, "--button-hover-background"),
        submitBtnBg: extractVar(varsBlock, "--submit-button-background"),
        submitBtnFont: extractVar(varsBlock, "--submit-button-font-color"),
        tileBg:
          extractVar(varsBlock, "--tile-background") ||
          extractVar(varsBlock, "--form-container-background"),
      };
    }
  } catch (e) {
    console.error(`Failed to load CSS for ${themeId}`, e);
  }
  return null;
}

function extractVar(block, varName) {
  // Regex to handle optional spaces and potential missing semicolon
  const regex = new RegExp(`${varName}\\s*:\\s*([^;]+)(;|})?`);
  const match = block.match(regex);
  return match ? match[1].trim() : "";
}

function createThemeCard(theme, css) {
  const card = document.createElement("div");
  card.classList.add("theme-preview-card");
  card.dataset.theme = theme.id;

  // Check if current theme
  if (localStorage.getItem("selectedTheme") === theme.id) {
    card.classList.add("active-theme");
  }

  // Use defaults if CSS fetch failed
  const style = css || {
    bg: "#222",
    font: "#fff",
    fontFamily: "Arial, sans-serif",
    modalBg: "#333",
    formBg: "#444",
    btnBg: "#007bff",
    submitBtnBg: "#555",
    submitBtnFont: "#fff",
    tileBg: "#444",
  };

  // Safe font family string (replace double quotes with single quotes)
  const safeFontFamily = style.fontFamily
    ? style.fontFamily.replace(/"/g, "'")
    : "Arial, sans-serif";

  card.innerHTML = `
    <div class="preview-mini-ui" style='background-color: ${style.bg}; color: ${style.font}; font-family: ${safeFontFamily};'>
      
      <!-- Header Area -->
      <div class="preview-header-bar" style='background-color: ${style.modalBg}'>
         <div class="preview-mini-date">12:00</div>
      </div>

      <div class="preview-body">
        <!-- Search Bar -->
        <div class="preview-search-bar" style='background-color: ${style.modalBg}'>
            <div class="preview-search-input" style='background-color: ${style.formBg}'></div>
        </div>

        <!-- Centered Tiles/Icons -->
        <div class="preview-icons-row">
           <div class="preview-icon round" style='background-color: ${style.tileBg}; border: 1px solid ${style.submitBtnBg}'></div>
           <div class="preview-icon center" style='background-color: ${style.formBg}'></div>
           <div class="preview-icon round" style='background-color: ${style.tileBg}; border: 1px solid ${style.submitBtnBg}'></div>
        </div>

        <!-- Buttons Row -->
        <div class="preview-apps-row">
            <div class="preview-app-btn" style='background-color: ${style.submitBtnBg}; color: ${style.submitBtnFont}'>App</div>
            <div class="preview-app-btn" style='background-color: ${style.submitBtnBg}; color: ${style.submitBtnFont}'>App</div>
        </div>
      </div>

      <!-- Action Button Example -->
      <div class="preview-action-btn" style='background-color: ${style.btnBg}'></div>
    </div>
    <div class="theme-name">${theme.name}</div>
  `;
  return card;
}

function handleThemeSelection(event) {
  // Traverse up to find the card with data-theme
  const card = event.target.closest(".theme-preview-card");
  if (!card) return;

  const selectedTheme = card.dataset.theme;

  if (selectedTheme) {
    localStorage.setItem("selectedTheme", selectedTheme);

    // Update active class visually without reloading
    const allCards = document.querySelectorAll(".theme-preview-card");
    allCards.forEach((c) => c.classList.remove("active-theme"));
    card.classList.add("active-theme");

    applyTheme(selectedTheme);

    // Give a small delay to see the change, then close?
    // Or just close immediately.
    setTimeout(() => {
      if (themeSettingsWindow) {
        themeSettingsWindow.close();
      }
    }, 300);
  }
}

function applyTheme(theme) {
  const currentStylesheet = document.getElementById("themestylesheet");
  if (currentStylesheet) {
    currentStylesheet.href = `../themes/${theme}.css`;
  }
}

// Init Theme Logic
document.addEventListener("DOMContentLoaded", () => {
  const selectedTheme = localStorage.getItem("selectedTheme");
  if (selectedTheme) {
    applyTheme(selectedTheme);
  }
});

function exportAllData() {
  const allData = {
    bookmarks: localStorage.getItem("bookmarks"),
    notes: localStorage.getItem("notepadNotes"),
    selectedTheme: localStorage.getItem("selectedTheme"),
    background: localStorage.getItem("backgroundImage"),
    username: localStorage.getItem("userName"),
  };

  const blob = new Blob([JSON.stringify(allData)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "alldata.json";
  a.click();

  URL.revokeObjectURL(url);
}

function importAllData() {
  const fileInput = document.getElementById("import-all-data-input");
  const file = fileInput.files[0];

  if (file) {
    const reader = new FileReader();

    reader.onload = function (e) {
      const importedData = JSON.parse(e.target.result);

      localStorage.setItem("bookmarks", importedData.bookmarks);
      localStorage.setItem("notepadNotes", importedData.notes);
      localStorage.setItem("selectedTheme", importedData.selectedTheme);
      localStorage.setItem("backgroundImage", importedData.background);
      localStorage.setItem("userName", importedData.username);

      location.reload();
    };

    reader.readAsText(file);
  }
}

// === SOCIALS – live preview in settings ===

const SOCIAL_SETTINGS_SITES = [
  { name: "Spotify", url: "https://open.spotify.com/" },
  { name: "Facebook", url: "https://www.facebook.com/" },
  { name: "Instagram", url: "https://www.instagram.com/" },
  { name: "Twitter", url: "https://twitter.com/" },
  { name: "Linkedin", url: "https://www.linkedin.com/" },
  { name: "Youtube", url: "https://www.youtube.com/" },
  { name: "Github", url: "https://github.com/" },
  { name: "TikTok", url: "https://www.tiktok.com/" },
  { name: "Reddit", url: "https://www.reddit.com/" },
  { name: "Discord", url: "https://discord.com/" },
  { name: "Messenger", url: "https://www.messenger.com/" },
  { name: "Notion", url: "https://www.notion.so/" },
];

const SOCIAL_IDS = ["card1", "card2", "card3", "card4", "centerCard"];
const PREVIEW_SUFFIX = "-settings-preview";

function buildSocialsPreviewInSettings(scope = document) {
  const host = scope.querySelector("#socialsPreviewHost");
  if (!host) return;

  const realCircle =
    document.getElementById("socialsdiv") ||
    document.querySelector("#socialsdiv") ||
    document.querySelector(".socialsdiv");

  if (!realCircle) {
    host.innerHTML =
      "<div style='opacity:.7;font-size:12px'>Socials preview not found</div>";
    return;
  }

  host.innerHTML = "";

  const clone = realCircle.cloneNode(true);
  clone.id = "socialsdiv-settings-preview";
  clone.classList.add("socials-preview-clone");

  SOCIAL_IDS.forEach((id) => {
    const btn = clone.querySelector(`[id="${id}"]`);
    if (!btn) return;

    btn.id = `${id}${PREVIEW_SUFFIX}`;
    btn.onclick = null;

    btn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      openSocialPicker(id, scope);
    });
  });

  host.appendChild(clone);

  refreshSocialsPreviewInSettings(scope);
}

function refreshSocialsPreviewInSettings(scope = document) {
  SOCIAL_IDS.forEach((id) => {
    const previewBtn = scope.querySelector(`#${id}${PREVIEW_SUFFIX}`);
    if (!previewBtn) return;

    if (typeof applySocialToElement === "function") {
      applySocialToElement(previewBtn, id);
    }
  });
}

function openSocialPicker(cardId, scope = document) {
  const socialsSitesList = scope.querySelector("#socialsSitesList");
  if (!socialsSitesList) return;

  const list = socialsSitesList.querySelector("ul");
  list.innerHTML = "";

  SOCIAL_SETTINGS_SITES.forEach((site) => {
    const li = document.createElement("li");
    li.textContent = site.name;

    li.addEventListener("click", () => {
      localStorage.setItem(`social_${cardId}`, site.name);
      localStorage.setItem(`social_url_${cardId}`, site.url);

      if (typeof applySocialToButton === "function") {
        applySocialToButton(cardId);
      }

      refreshSocialsPreviewInSettings(scope);

      closeSocialPicker(scope);
    });

    list.appendChild(li);
  });

  socialsSitesList.style.display = "block";

  // Highlight the editing tile
  const highlighted = scope.querySelectorAll(".editing-social-tile");
  highlighted.forEach((el) => el.classList.remove("editing-social-tile"));

  const currentPreview = scope.querySelector(`#${cardId}${PREVIEW_SUFFIX}`);
  if (currentPreview) {
    currentPreview.classList.add("editing-social-tile");
  }
}

function closeSocialPicker(scope = document) {
  const socialsSitesList =
    scope.querySelector("#socialsSitesList") ||
    document.getElementById("socialsSitesList");
  if (socialsSitesList) socialsSitesList.style.display = "none";

  // Remove highlight from all tiles
  const highlighted = scope.querySelectorAll(".editing-social-tile");
  highlighted.forEach((el) => el.classList.remove("editing-social-tile"));
}

function showChangelog() {
  fetch("CHANGELOG.md")
    .then((response) => response.text())
    .then((text) => {
      // Parse markdown if marked is available, otherwise use plain text
      const content =
        typeof marked !== "undefined"
          ? marked.parse(text)
          : `<pre>${text}</pre>`;

      new WinBox({
        title: "Changelog",
        modal: true,
        width: "800px",
        height: "600px",
        background: "#222",
        html: `<div class="changelog-content" style="padding: 40px; color: #e0e0e0; overflow-y: auto; height: 100%; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; font-size: 18px; line-height: 1.8;">
                <style>
                  .changelog-content h1 { font-size: 2.5em; border-bottom: 2px solid #444; padding-bottom: 15px; margin-bottom: 30px; color: #fff; font-weight: bold; }
                  .changelog-content h2 { font-size: 2em; margin-top: 40px; margin-bottom: 20px; color: #ffd700; border-bottom: 1px solid #333; padding-bottom: 10px; }
                  .changelog-content h3 { font-size: 1.5em; margin-top: 30px; margin-bottom: 15px; color: #87cefa; }
                  .changelog-content ul { padding-left: 30px; }
                  .changelog-content li { margin-bottom: 10px; list-style-type: disc; }
                  .changelog-content a { color: #87cefa; text-decoration: none; border-bottom: 1px dotted #87cefa; }
                  .changelog-content a:hover { text-decoration: none; border-bottom: 1px solid #87cefa; }
                  .changelog-content p { margin-bottom: 15px; }
                </style>
                ${content}
              </div>`,
        x: "center",
        y: "center",
      });
    })
    .catch((err) => {
      console.error("Failed to load changelog:", err);
      alert("Failed to load changelog.");
    });
}
