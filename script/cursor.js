(function () {
  const cursor = document.createElement("div");
  cursor.id = "custom-cursor";
  document.body.appendChild(cursor);

  const cursorImg = document.createElement("img");
  cursorImg.src = "/cursors/Cursor.png";
  cursor.appendChild(cursorImg);

  let isEnabled;
  let size;

  function updateCursor() {
    isEnabled = localStorage.getItem("customCursorEnabled") === "true";
    size = localStorage.getItem("customCursorSize") || "32";

    if (isEnabled) {
      cursor.style.display = "block";
      document.body.classList.add("custom-cursor-active");
      cursor.style.width = size + "px";
      cursor.style.height = size + "px";
    } else {
      cursor.style.display = "none";
      document.body.classList.remove("custom-cursor-active");
    }
  }

  // Exposed to settings.js
  window.updateCustomCursor = updateCursor;

  window.addEventListener("mousemove", (e) => {
    if (!isEnabled) return;

    // Position the cursor so the tip (top-left of image) is at the mouse coordinates
    cursor.style.left = e.clientX + "px";
    cursor.style.top = e.clientY + "px";
  });

  // Initial update
  updateCursor();
})();
