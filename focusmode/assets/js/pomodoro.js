class PomodoroTimer {
  constructor() {
    this.workTime = 25 * 60; // 25 minutes in seconds
    this.breakTime = 5 * 60; // 5 minutes in seconds
    this.longBreakTime = 15 * 60; // 15 minutes in seconds
    this.sessions = 0;
    this.timeLeft = this.workTime;
    this.timerInterval = null;
    this.isRunning = false;
    this.isWork = true;

    this.timerDisplay = document.getElementById("timer");
    this.startBtn = document.getElementById("start");
    this.pauseBtn = document.getElementById("pause");
    this.resetBtn = document.getElementById("reset");
    this.sessionCount = document.getElementById("session-count");
    this.sessionType = document.getElementById("session-type");

    this.startBtn.addEventListener("click", () => this.start());
    this.pauseBtn.addEventListener("click", () => this.pause());
    this.resetBtn.addEventListener("click", () => this.reset());

    this.updateDisplay();
  }

  start() {
    if (!this.isRunning) {
      this.isRunning = true;
      this.timerInterval = setInterval(() => this.tick(), 1000);
    }
  }

  pause() {
    if (this.isRunning) {
      this.isRunning = false;
      clearInterval(this.timerInterval);
    }
  }

  reset() {
    this.pause();
    this.timeLeft = this.workTime;
    this.sessions = 0;
    this.isWork = true;
    this.updateDisplay();
  }

  tick() {
    this.timeLeft--;
    if (this.timeLeft < 0) {
      this.switchSession();
    }
    this.updateDisplay();
  }

  switchSession() {
    this.isWork = !this.isWork;
    if (this.isWork) {
      this.sessions++;
      this.timeLeft = this.workTime;
    } else {
      if (this.sessions % 4 === 0) {
        this.timeLeft = this.longBreakTime;
      } else {
        this.timeLeft = this.breakTime;
      }
    }
  }

  updateDisplay() {
    const minutes = Math.floor(this.timeLeft / 60);
    const seconds = this.timeLeft % 60;
    this.timerDisplay.textContent = `${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    this.sessionCount.textContent = `Session: ${this.sessions + 1}`;
    this.sessionType.textContent = this.isWork ? "Work" : "Break";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new PomodoroTimer();
});
