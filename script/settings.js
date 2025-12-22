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
    .addEventListener("click", showThemeModal);

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

function createThemeModal() {
  if (document.getElementById("theme-modal")) return;

  const themeModal = document.createElement("div");
  themeModal.id = "theme-modal";
  themeModal.innerHTML = `
    <div id="theme-modal-content">
      <button id="theme-modal-close-button">&times;</button>
      <h2>Select Theme</h2>
      <ul id="theme-list">
        <li data-theme="dark-mode">Dark Mode</li>
        <li data-theme="ocean-blue">Ocean Blue</li>
        <!-- Add more themes here -->
      </ul>
    </div>`;
  document.body.appendChild(themeModal);

  const closeButton = document.getElementById("theme-modal-close-button");
  closeButton.addEventListener("click", hideThemeModal);

  const themeList = document.getElementById("theme-list");
  themeList.addEventListener("click", handleThemeSelection);

  themeModal.addEventListener("click", function (e) {
    if (e.target === themeModal) {
      hideThemeModal();
    }
  });
}

function handleThemeSelection(event) {
  const selectedTheme = event.target.dataset.theme;
  if (selectedTheme) {
    localStorage.setItem("selectedTheme", selectedTheme);
    applyTheme(selectedTheme);
    hideThemeModal();
  }
}

function applyTheme(theme) {
  const currentStylesheet = document.getElementById("themestylesheet");
  currentStylesheet.href = `../themes/${theme}.css`;
}

function showThemeModal() {
  const themeModal = document.getElementById("theme-modal");
  themeModal.style.display = "flex";
}

function hideThemeModal() {
  const themeModal = document.getElementById("theme-modal");
  themeModal.style.display = "none";
}

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape") {
    hideThemeModal();
  }
});

// Init Theme Logic
createThemeModal();
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
