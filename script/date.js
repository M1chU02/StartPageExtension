setInterval(clock, 1000);

function clock() {
  let time = new Date();
  let hour = time.getHours();
  let min = time.getMinutes();
  hour = hour < 10 ? "0" + hour : hour;
  min = min < 10 ? "0" + min : min;

  let currentTime = hour + ":" + min;
  document.getElementById("hour").innerHTML = currentTime;
  setTimeout(clock, 1000);
}

clock();

const date = new Date();
const day = date.getDate();
const month = date.toLocaleString("en", { month: "short" });
const currentDate = day + " " + month + ", ";
document.getElementById("date").innerHTML = currentDate;
