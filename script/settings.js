const footerEl = document.getElementById("footer");
const settingsBtn = document.getElementById("settingsBtn");
settingsBtn.addEventListener("click", showGeneralSettingsModal);

const generalSettingsModal = document.createElement("div");
generalSettingsModal.innerHTML = `<div id="general-settings" style="display: none">
  <div id="general-settings-form">
    <button id="general-settings-close-button">&times;</button>

    <div id="usernameChangeEl">
      <label for="username" id="change-username-label">Change Username:</label>
      <input type="text" id="username" autocomplete="off">
      <button id="changeUsername">Save</button>
    </div>
    
    <button id="delete-bookmarks-button">Delete All Bookmarks</button>
    <button id="export-bookmarks-button">Export Bookmarks</button>
    <label for="import-bookmarks-input" id="import-bookmarks-label">Import Bookmarks</label>
    <input type="file" accept=".json" id="import-bookmarks-input">

    <br>

    <button id="delete-notes-button">Delete All Notes</button>
    <button id="export-notes-button">Export Notes</button>
    <label for="import-notes-input" id="import-notes-label">Import Notes</label>
    <input type="file" accept=".json" id="import-notes-input">

    <br>

    <button id="change-theme-button">Change Theme</button>

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

document.getElementById("change-theme-button").addEventListener("click", () => {
  const currentstylesheet = document.getElementById("themestylesheet");
  if (currentstylesheet.href.endsWith("/themes/dark-mode.css")) {
    currentstylesheet.href = "/themes/ocean-blue.css";
  } else {
    currentstylesheet.href = "/themes/dark-mode.css";
  }
});
