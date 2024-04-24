const onlineStatus = window.navigator.onLine;

if (!onlineStatus) {
  const offlineScripts = document.querySelectorAll(".offlineScript");
  offlineScripts.forEach((element) => (element.src = ""));
  const offlineElements = document.querySelectorAll(".offline");
  offlineElements.forEach((element) => (element.style.display = "none"));
  document.getElementById("content").style.flexDirection = "column-reverse";
  document.getElementById("content").style.gap = "5vh";
  document.getElementById("offlinediv").style.display = "flex";
}
