let countdown;
let paused = false;
let endTime;
let remainingTime = 0;

function startTimer() {
  if (paused) {
    resumeTimer();
    return;
  }

  const hoursInput = document.getElementById("hours");
  const minutesInput = document.getElementById("minutes");
  const secondsInput = document.getElementById("seconds");
  const timerDisplay = document.getElementById("timer");

  const hours = parseInt(hoursInput.value) || 0;
  const minutes = parseInt(minutesInput.value) || 0;
  const seconds = parseInt(secondsInput.value) || 0;

  if (hours === 0 && minutes === 0 && seconds === 0) {
    alert("Please enter a valid time.");
    return;
  }

  endTime =
    Date.now() + hours * 60 * 60 * 1000 + minutes * 60 * 1000 + seconds * 1000;

  countdown = setInterval(function () {
    if (paused) return;

    remainingTime = endTime - Date.now();
    if (remainingTime <= 0) {
      clearInterval(countdown);
      timerDisplay.textContent = "Time's up!";
      playAlarm();
    } else {
      updateTimerDisplay(remainingTime);
    }
  }, 1000);
}

function stopTimer() {
  paused = true;
}

function resumeTimer() {
  if (paused && remainingTime > 0) {
    endTime = Date.now() + remainingTime;
    paused = false;
    countdown = setInterval(function () {
      if (paused) return;

      remainingTime = endTime - Date.now();
      if (remainingTime <= 0) {
        clearInterval(countdown);
        document.getElementById("timer").textContent = "Time's up!";
        playAlarm();
      } else {
        updateTimerDisplay(remainingTime);
      }
    }, 1000);
  }
}

function resetTimer() {
  clearInterval(countdown);
  paused = false;
  remainingTime = 0;
  endTime = undefined;

  const timerDisplay = document.getElementById("timer");
  timerDisplay.textContent = "00:00:00";

  document.getElementById("hours").value = "";
  document.getElementById("minutes").value = "";
  document.getElementById("seconds").value = "";
}

function updateTimerDisplay(remainingTime) {
  const timerDisplay = document.getElementById("timer");

  const hours = Math.floor(remainingTime / 3600000);
  const minutes = Math.floor((remainingTime % 3600000) / 60000);
  const seconds = Math.floor((remainingTime % 60000) / 1000);

  timerDisplay.textContent = `${hours}:${minutes < 10 ? "0" : ""}${minutes}:${
    seconds < 10 ? "0" : ""
  }${seconds}`;
}

function playAlarm() {
  const alarm = document.getElementById("alarm");
  alarm.play();
}
