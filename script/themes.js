const localStorageTheme = localStorage.getItem("selectedTheme");

fetch("../iFrames/timer/index.html")
  .then((response) => response.text())
  .then((html) => {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;
    const timerStyle = tempDiv.querySelector("#iframesStyle");
  });

fetch("../iFrames/calendar/index.html")
  .then((response) => response.text())
  .then((html) => {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;
    const calendarStyle = tempDiv.querySelector("#iframesStyle");
  });

fetch("../iFrames/calculator/index.html")
  .then((response) => response.text())
  .then((html) => {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;
    const calculatorStyle = tempDiv.querySelector("#iframesStyle");
  });

fetch("../iFrames/translator/index.html")
  .then((response) => response.text())
  .then((html) => {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;
    const translatorStyle = tempDiv.querySelector("#iframesStyle");
  });
