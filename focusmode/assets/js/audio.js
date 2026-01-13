document.addEventListener("DOMContentLoaded", () => {
  const audio = document.getElementById("audio");
  const playPauseBtn = document.getElementById("playPauseBtn");
  const skipBtn = document.getElementById("skipBtn");
  const volumeControl = document.getElementById("volume");
  const trackSelect = document.getElementById("track-select");
  const currentSongTitle = document.getElementById("current-song-title");
  const playbackSlider = document.getElementById("playback-slider");

  let isPlaying = false;

  function togglePlayPause() {
    if (isPlaying) {
      audio.pause();
      playPauseBtn.textContent = "Play";
    } else {
      audio.play();
      playPauseBtn.textContent = "Pause";
    }
    isPlaying = !isPlaying;
  }

  function skipTrack() {
    const options = trackSelect.options;
    let currentIndex = trackSelect.selectedIndex;
    let nextIndex = (currentIndex + 1) % options.length;
    if (nextIndex === 0) nextIndex = 1; // Skip the "Select a track" option
    trackSelect.selectedIndex = nextIndex;
    audio.src = options[nextIndex].value;
    audio.play();
    isPlaying = true;
    playPauseBtn.textContent = "Pause";
    updateCurrentSongTitle();
  }

  function updateCurrentSongTitle() {
    const selectedOption = trackSelect.options[trackSelect.selectedIndex];
    currentSongTitle.textContent = selectedOption.text;
  }

  function updatePlaybackSlider() {
    const percentage = (audio.currentTime / audio.duration) * 100;
    playbackSlider.value = percentage;
  }

  playPauseBtn.addEventListener("click", togglePlayPause);
  skipBtn.addEventListener("click", skipTrack);

  volumeControl.addEventListener("input", () => {
    audio.volume = Math.pow(volumeControl.value, 2);
  });

  trackSelect.addEventListener("change", () => {
    audio.src = trackSelect.value;
    if (trackSelect.value) {
      audio.play();
      isPlaying = true;
      playPauseBtn.textContent = "Pause";
      updateCurrentSongTitle();
    } else {
      audio.pause();
      isPlaying = false;
      playPauseBtn.textContent = "Play";
      currentSongTitle.textContent = "";
    }
  });

  playbackSlider.addEventListener("input", () => {
    const time = (playbackSlider.value / 100) * audio.duration;
    audio.currentTime = time;
  });

  audio.addEventListener("timeupdate", updatePlaybackSlider);
  audio.addEventListener("ended", skipTrack);

  // Initialize the current song title
  updateCurrentSongTitle();
});
