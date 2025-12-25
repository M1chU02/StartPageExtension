const timerBtn = document.getElementById("timerBtn");
const calendarBtn = document.getElementById("calendarBtn");
const calculatorBtn = document.getElementById("calculatorBtn");
const translatorBtn = document.getElementById("translatorBtn");

// Store active WinBox instances
const appInstances = {
  timer: null,
  calendar: null,
  calculator: null,
  translator: null,
};

function openApp(appName, title, url) {
  if (appInstances[appName]) {
    // If minimized or behind, restore and focus
    appInstances[appName].restore().focus();
    return;
  }

  appInstances[appName] = new WinBox({
    title: title,
    url: url,
    background: "transparent",
    x: "center",
    y: "center",
    width: "600px",
    height: "700px",
    onclose: function () {
      appInstances[appName] = null;
    },
  });
}

function toggleApp(appName, title, url) {
  if (appInstances[appName]) {
    appInstances[appName].close();
  } else {
    openApp(appName, title, url);
  }
}

function closeAllApps() {
  Object.keys(appInstances).forEach((appName) => {
    if (appInstances[appName]) {
      appInstances[appName].close();
    }
  });
}

timerBtn.addEventListener("click", () =>
  openApp("timer", "Timer", "/iFrames/timer/index.html")
);
calendarBtn.addEventListener("click", () =>
  openApp("calendar", "Calendar", "/iFrames/calendar/index.html")
);
calculatorBtn.addEventListener("click", () =>
  openApp("calculator", "Calculator", "/iFrames/calculator/index.html")
);
translatorBtn.addEventListener("click", () =>
  openApp("translator", "Translator", "/iFrames/translator/index.html")
);

document.addEventListener("keyup", (e) => {
  if (e.altKey) {
    if (e.key === "1") toggleApp("timer", "Timer", "/iFrames/timer/index.html");
    if (e.key === "2")
      toggleApp("calendar", "Calendar", "/iFrames/calendar/index.html");
    if (e.key === "3")
      toggleApp("calculator", "Calculator", "/iFrames/calculator/index.html");
    if (e.key === "4")
      toggleApp("translator", "Translator", "/iFrames/translator/index.html");
    if (e.key === "0") closeAllApps();
  }
});
