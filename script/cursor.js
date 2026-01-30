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

    // Get the element under the cursor
    const target = document.elementFromPoint(e.clientX, e.clientY);

    // Check what type of element we're hovering over
    const isClickable =
      target &&
      (target.tagName === "BUTTON" ||
        target.tagName === "A" ||
        target.closest("button") ||
        target.closest("a") ||
        (target.hasAttribute("role") &&
          target.getAttribute("role") === "button") ||
        window.getComputedStyle(target).cursor === "pointer");

    const isTextInput =
      target &&
      (target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable);

    // Change cursor appearance based on context
    if (isClickable) {
      cursor.style.transform = "scale(1.2)"; // Make it slightly bigger for clickable items
    } else if (isTextInput) {
      cursor.style.transform = "scale(0.8) rotate(90deg)"; // Make it look like a text cursor
    } else {
      cursor.style.transform = "scale(1)"; // Normal cursor
    }

    // Position the cursor so the tip (top-left of image) is at the mouse coordinates
    cursor.style.left = e.clientX + "px";
    cursor.style.top = e.clientY + "px";
  });

  // Initial update
  updateCursor();
})();
