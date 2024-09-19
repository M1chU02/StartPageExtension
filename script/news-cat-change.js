const localNewsRadio = document.getElementById("value-1");
const globalNewsRadio = document.getElementById("value-2");
const newsDiv = document.getElementById("newsdiv");
const worldNewsDiv = document.getElementById("worldnewsdiv");

window.addEventListener("load", () => {
  localNewsRadio.checked = "true";
  document.getElementById("localNewsLabel").classList.add("active");
});

localNewsRadio.addEventListener("change", function () {
  if (localNewsRadio.checked) {
    newsDiv.style.display = "flex";
    worldNewsDiv.style.display = "none";
    document.getElementById("localNewsLabel").classList.add("active");
    document.getElementById("globalNewsLabel").classList.remove("active");
  }
});

globalNewsRadio.addEventListener("change", function () {
  if (globalNewsRadio.checked) {
    newsDiv.style.display = "none";
    worldNewsDiv.style.display = "flex";
    document.getElementById("localNewsLabel").classList.remove("active");
    document.getElementById("globalNewsLabel").classList.add("active");
  }
});
