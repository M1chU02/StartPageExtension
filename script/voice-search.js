document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("searchinput");
  const voiceSearchBtn = document.getElementById("voiceSearchBtn");
  const searchForm = document.getElementById("searchform");

  // Check if browser supports speech recognition
  if ("webkitSpeechRecognition" in window) {
    const recognition = new webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US"; // Set this to the user's preferred language

    let isListening = false;

    voiceSearchBtn.addEventListener("click", () => {
      if (isListening) {
        recognition.stop();
      } else {
        recognition.start();
      }
    });

    recognition.onstart = () => {
      isListening = true;
      searchInput.placeholder = "Listening...";
      voiceSearchBtn.classList.add("listening");
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      searchInput.value = transcript;
      searchInput.placeholder = "Search...";
      // Trigger search
      searchForm.dispatchEvent(new Event("submit"));
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      resetState();
    };

    recognition.onend = () => {
      resetState();
    };

    function resetState() {
      isListening = false;
      searchInput.placeholder = "Search...";
      voiceSearchBtn.classList.remove("listening");
    }
  } else {
    voiceSearchBtn.style.display = "none";
    console.log("Web Speech API is not supported in this browser.");
  }
});
