const app1 = new WinBox({
  title: "Modal",
  modal: true,
});

const iframe = document.createElement("iframe");
iframe.setAttribute("src", "/iFrames/timer/index.html");
app1.body.appendChild(iframe);
app1.hide();
