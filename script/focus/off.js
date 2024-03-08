const exitFocusModeBtn = document.getElementById("exitFocusModeBtn");

exitFocusModeBtn.addEventListener("click", (event) => {
  event.preventDefault();
  localStorage.setItem("mode", "normal");

  if (window.location.pathname !== "/index.html") {
    //window.location.href = "/index.html";
    window.location.replace("/index.html");
  }
});

function checkFocus() {
  const savedMode = localStorage.getItem("mode");

  if (savedMode === "normal") {
    if (window.location.pathname !== "/index.html") {
      //window.location.href = "/index.html";
      window.location.replace("/index.html");
    }
  } else if (savedMode === "focus") {
    if (window.location.pathname !== "/focusmode/index.html") {
      //window.location.href = "/focusmode/index.html";
      window.location.replace("/focusmode/index.html");
    }
  }
}

window.onload = checkFocus();
