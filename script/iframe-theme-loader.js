(function () {
  function applyTheme(themeId) {
    const themeLink = document.getElementById("iframesStyle");
    if (themeLink) {
      themeLink.href = `../themes/${themeId}.css`;
    }
  }

  // Initial load
  const selectedTheme = localStorage.getItem("selectedTheme") || "dark-mode";
  applyTheme(selectedTheme);

  // Listen for changes from other windows/frames
  window.addEventListener("storage", (event) => {
    if (event.key === "selectedTheme") {
      applyTheme(event.newValue);
    }
  });
})();
