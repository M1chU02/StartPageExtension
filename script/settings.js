const footerEl = document.getElementById("footer");
const settingsBtn = document.getElementById("settingsBtn");
settingsBtn.addEventListener("click", showGeneralSettingsModal);

const generalSettingsModal = document.createElement("div");
generalSettingsModal.innerHTML = `<div id="general-settings" style="display: none">
  <div id="general-settings-form">
    
    <div class="settings-tile" id="usernameChangeEl">
    <button id="general-settings-close-button">&times;</button>
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
document.body.appendChild(generalSettingsModal);

const generalSettingsCloseButton = document.getElementById(
  "general-settings-close-button"
);
generalSettingsCloseButton.addEventListener("click", hideGeneralSettingsModal);

const generalSettings = document.getElementById("general-settings");
generalSettings.addEventListener("click", function (e) {
  if (e.target === generalSettings) {
    hideGeneralSettingsModal();
  }
});

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape") {
    document.getElementById("general-settings").style.display = "none";
  }
});

function showGeneralSettingsModal() {
  document.getElementById("general-settings").style.display = "flex";
}

function hideGeneralSettingsModal() {
  document.getElementById("general-settings").style.display = "none";
}

document
  .getElementById("changeUsername")
  .addEventListener("click", changeUserName);

document.getElementById("username").addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    changeUserName();
  }
});

function changeUserName() {
  let newUserName = document.getElementById("username").value;
  if (newUserName == "") {
    document.getElementById("username").placeholder = "Enter username!";
  } else {
    localStorage.setItem("userName", newUserName);
    location.reload();
  }
}

function manageSearchEngine() {
  const searchEngineSelect = document
    .getElementById("searchEngineChangeEl")
    .querySelector("select");
  const searchForm = document.querySelector("#searchform");
  const searchInput = document.querySelector("#searchinput");

  // Define search engine URLs
  const searchEngines = {
    Google: "https://www.google.com/search?q=",
    "Microsoft Bing": "https://www.bing.com/search?q=",
    "Yahoo!": "https://search.yahoo.com/search?p=",
    Yandex: "https://yandex.com/search/?text=",
    DuckDuckGo: "https://duckduckgo.com/?q=",
  };

  // Load saved search engine from localStorage
  const savedSearchEngine = localStorage.getItem("selectedSearchEngine");
  if (savedSearchEngine && searchEngines[savedSearchEngine]) {
    searchEngineSelect.value = savedSearchEngine;
  }

  // Function to update search form action
  function updateSearchForm() {
    const selectedEngine = searchEngineSelect.value;
    const searchUrl = searchEngines[selectedEngine];
    localStorage.setItem("selectedSearchEngine", selectedEngine);
  }

  // Initial update
  updateSearchForm();

  // Listen for changes in search engine selection
  searchEngineSelect.addEventListener("change", updateSearchForm);

  // Modify form submission behavior
  searchForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const selectedEngine = searchEngineSelect.value;
    const searchUrl = searchEngines[selectedEngine];
    const searchQuery = encodeURIComponent(searchInput.value);
    window.location.href = `${searchUrl}${searchQuery}`;
  });
}

// Call the function to set up the search engine management
manageSearchEngine();

document
  .getElementById("delete-bookmarks-button")
  .addEventListener("click", deleteAllBookmarks);
document
  .getElementById("export-bookmarks-button")
  .addEventListener("click", exportBookmarks);

document
  .getElementById("import-bookmarks-input")
  .addEventListener("change", importBookmarks);

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

document
  .getElementById("delete-notes-button")
  .addEventListener("click", deleteAllNotes);
document
  .getElementById("export-notes-button")
  .addEventListener("click", exportNotes);
document
  .getElementById("import-notes-input")
  .addEventListener("change", importNotes);

function deleteAllNotes() {
  localStorage.removeItem("notepadNotes");
  notes.length = 0;
  saveNotes();
  loadDefaultNote();
  updateNoteList();
  switchNote(0);
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
      initializeNotepad();
      location.reload();
    };

    reader.readAsText(file);
  }
}

function createThemeModal() {
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
  hideGeneralSettingsModal();
  const themeModal = document.getElementById("theme-modal");
  themeModal.style.display = "flex";
  document
    .getElementById("theme-modal")
    .addEventListener("click", function (e) {
      if (e.target === themeModal) {
        hideThemeModal();
      }
    });
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

createThemeModal();

document.addEventListener("DOMContentLoaded", () => {
  const selectedTheme = localStorage.getItem("selectedTheme");
  if (selectedTheme) {
    applyTheme(selectedTheme);
  }
});

document
  .getElementById("change-theme-button")
  .addEventListener("click", showThemeModal);

document
  .getElementById("export-all-data-button")
  .addEventListener("click", exportAllData);

document
  .getElementById("import-all-data-input")
  .addEventListener("change", importAllData);

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
