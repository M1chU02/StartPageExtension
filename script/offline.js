const onlineStatus = window.navigator.onLine;

if (!onlineStatus) {
  const offlineElements = document.querySelectorAll(".offline");
  offlineElements.forEach((element) => (element.style.display = "none"));
  document.getElementById("content").style.flexDirection = "column-reverse";
  document.getElementById("content").style.gap = "5vh";
  document.getElementById("offlinediv").style.display = "flex";
}
