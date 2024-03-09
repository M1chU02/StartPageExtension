console.log((window.navigator.onLine ? "on" : "off") + "line");

const onlineStatus = window.navigator.onLine;
console.log(onlineStatus);
if (!onlineStatus) {
  const offlineElements = document.querySelectorAll(".offline");
  offlineElements.forEach((element) => (element.style.display = "none"));
  document.getElementById("content").style.flexDirection = "column-reverse";
  document.getElementById("content").style.gap = "5vh";
  document.getElementById("offlinediv").style.display = "flex";
}
