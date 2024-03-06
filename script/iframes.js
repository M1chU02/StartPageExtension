const timerBtn = document.getElementById("timerBtn");
const calendarBtn = document.getElementById("calendarBtn");
const calculatorBtn = document.getElementById("calculatorBtn");
const translatorBtn = document.getElementById("translatorBtn");
const allFrames = document.querySelectorAll(".AppFrame");

function hideAllFrames() {
  allFrames.forEach((frame) => {
    frame.style.display = "none";
  });
}
document.addEventListener("keyup", (e) => {
  if (e.altKey) {
    hideAllFrames();
    if (e.key === "1") {
      document.getElementById("timerFrame").style.display = "flex";
    } else if (e.key === "2") {
      document.getElementById("calendarFrame").style.display = "flex";
    } else if (e.key === "3") {
      document.getElementById("calculatorFrame").style.display = "flex";
    } else if (e.key === "4") {
      document.getElementById("translatorFrame").style.display = "flex";
    }
  }
});

timerBtn.addEventListener("click", () => {
  document.getElementById("timerFrame").style.display = "flex";
});
document.querySelector("#timerFrame button").addEventListener("click", () => {
  document.getElementById("timerFrame").style.display = "none";
});
document.getElementById("timerFrame").addEventListener("click", function (e) {
  if (e.target === document.getElementById("timerFrame")) {
    document.getElementById("timerFrame").style.display = "none";
  }
});
document.addEventListener("keydown", function (e) {
  if (e.key === "Escape") {
    document.getElementById("timerFrame").style.display = "none";
  }
});

calendarBtn.addEventListener("click", () => {
  document.getElementById("calendarFrame").style.display = "flex";
});
document
  .querySelector("#calendarFrame button")
  .addEventListener("click", () => {
    document.getElementById("calendarFrame").style.display = "none";
  });
document
  .getElementById("calendarFrame")
  .addEventListener("click", function (e) {
    if (e.target === document.getElementById("calendarFrame")) {
      document.getElementById("calendarFrame").style.display = "none";
    }
  });
document.addEventListener("keydown", function (e) {
  if (e.key === "Escape") {
    document.getElementById("calendarFrame").style.display = "none";
  }
});

calculatorBtn.addEventListener("click", () => {
  document.getElementById("calculatorFrame").style.display = "flex";
});
document
  .querySelector("#calculatorFrame button")
  .addEventListener("click", () => {
    document.getElementById("calculatorFrame").style.display = "none";
  });
document
  .getElementById("calculatorFrame")
  .addEventListener("click", function (e) {
    if (e.target === document.getElementById("calculatorFrame")) {
      document.getElementById("calculatorFrame").style.display = "none";
    }
  });
document.addEventListener("keydown", function (e) {
  if (e.key === "Escape") {
    document.getElementById("calculatorFrame").style.display = "none";
  }
});

translatorBtn.addEventListener("click", () => {
  document.getElementById("translatorFrame").style.display = "flex";
});
document
  .querySelector("#translatorFrame button")
  .addEventListener("click", () => {
    document.getElementById("translatorFrame").style.display = "none";
  });
document
  .getElementById("translatorFrame")
  .addEventListener("click", function (e) {
    if (e.target === document.getElementById("translatorFrame")) {
      document.getElementById("translatorFrame").style.display = "none";
    }
  });
document.addEventListener("keydown", function (e) {
  if (e.key === "Escape") {
    document.getElementById("translatorFrame").style.display = "none";
  }
});
