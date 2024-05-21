function createBackup() {
  var currentDate = new Date();
  var lastBackupDate = localStorage.getItem("backupdate");
  if (
    !lastBackupDate ||
    currentDate - new Date(lastBackupDate) > 6 * 60 * 60 * 1000
  ) {
    const downloadBackupButton = document.createElement("button");
    downloadBackupButton.innerHTML = "Download Backup";
    downloadBackupButton.classList.add("downloadBackupButton");
    document.body.appendChild(downloadBackupButton);
    downloadBackupButton.addEventListener("click", downloadBackup);
  }
}

if (localStorage.getItem("userName")) {
  createBackup();
}

function downloadBackup() {
  var currentDate = new Date();
  var timestamp = currentDate.toISOString().replace(/[-T:]/g, "").slice(0, -5);

  const allData = {
    bookmarks: localStorage.getItem("bookmarks"),
    notes: localStorage.getItem("notepadNotes"),
    selectedTheme: localStorage.getItem("selectedTheme"),
    background: localStorage.getItem("backgroundImage"),
    username: localStorage.getItem("userName"),
  };

  const backupData = JSON.stringify(allData);
  var blob = new Blob([backupData], { type: "application/json" });
  var a = document.createElement("a");
  a.href = window.URL.createObjectURL(blob);
  a.download = "backup_" + timestamp + ".json";
  a.click();
  localStorage.setItem("backupdate", currentDate.toISOString());
  URL.revokeObjectURL(url);
}
