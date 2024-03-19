const localStorageTheme = localStorage.getItem("selectedTheme");
console.log(localStorageTheme);

fetch("../iFrames/timer/index.html")
  .then((response) => response.text())
  .then((html) => {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;
    const timerStyle = tempDiv.querySelector("#iframesStyle");
    console.log(timerStyle.href);
  });

fetch("../iFrames/calendar/index.html")
  .then((response) => response.text())
  .then((html) => {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;
    const calendarStyle = tempDiv.querySelector("#iframesStyle");
    console.log(calendarStyle.href);
  });

fetch("../iFrames/calculator/index.html")
  .then((response) => response.text())
  .then((html) => {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;
    const calculatorStyle = tempDiv.querySelector("#iframesStyle");
    console.log(calculatorStyle.href);
  });

fetch("../iFrames/translator/index.html")
  .then((response) => response.text())
  .then((html) => {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;
    const translatorStyle = tempDiv.querySelector("#iframesStyle");
    console.log(translatorStyle.href);
  });
