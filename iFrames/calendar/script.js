// >> 21/11/2022
const currentDate = document.querySelector(".current-date"),
  days = document.querySelector(".days"),
  icons = document.querySelectorAll(".icons span");

let date = new Date();
let currentYear = date.getFullYear();
let currentMonth = date.getMonth();
const month = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const renderCalandar = () => {
  let lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0).getDate(),
    lastDayOfLastMonth = new Date(currentYear, currentMonth, 0).getDate(),
    lastDay_OfMonth = new Date(
      currentYear,
      currentMonth,
      lastDayOfMonth
    ).getDay(),
    firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  let lists = "";
  for (let i = firstDayOfMonth; i > 0; i--) {
    lists += `<li class="inactive">${lastDayOfLastMonth - i + 1}</li>`;
  }
  for (let i = 1; i <= lastDayOfMonth; i++) {
    let isDay =
      i === date.getDate() &&
      currentMonth == new Date().getMonth() &&
      currentYear === new Date().getFullYear()
        ? "active"
        : "";
    lists += `<li class="${isDay}">${i}</li>`;
  }
  for (let i = lastDay_OfMonth; i < 6; i++) {
    lists += `<li class="inactive">${i - lastDay_OfMonth + 1}</li>`;
  }
  currentDate.innerHTML = `${month[currentMonth]} ${currentYear}`;
  days.innerHTML = lists;
};
renderCalandar();
icons.forEach((icon) => {
  icon.addEventListener("click", () => {
    if (icon.id === "prev") {
      currentMonth = currentMonth - 1;
    } else {
      currentMonth = currentMonth + 1;
    }
    if (currentMonth < 0 || currentMonth > 11) {
      date = new Date(currentYear, currentMonth);
      currentYear = date.getFullYear();
      currentMonth = date.getMonth();
    } else {
      date = new Date();
    }
    renderCalandar();
  });
});
