const timerPage = window.open("../iFrames/timer/index.html");

timerPage.addEventListener("DOMContentLoaded", () => {
  const timerstyle = timerPage.document.getElementById("iframesStyle");
  console.log(timerstyle.href);
  timerPage.close();
});
