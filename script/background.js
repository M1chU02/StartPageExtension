window.initializeBackgroundSettings = function (scope = document) {
  const backgroundContainer = scope.querySelector("#backgroundImagesContainer");
  const randomThemeButton = scope.querySelector(
    "#random-theme-background-button"
  );

  if (!backgroundContainer || !randomThemeButton) return;

  // Clear existing to avoid duplicates if re-opened
  backgroundContainer.innerHTML = "";

  randomThemeButton.addEventListener("click", toggleRandomBackground);

  // Update button state visually
  const isRandomBackground =
    localStorage.getItem("isRandomBackground") === "true";
  if (isRandomBackground) {
    randomThemeButton.classList.add("toggleOn");
  } else {
    randomThemeButton.classList.add("toggleOff");
  }

  for (let i = 0; i <= 39; i++) {
    if (i === 0) {
      const themeBg = document.createElement("div");
      themeBg.classList.add("miniBg");
      themeBg.id = "themeBg";
      themeBg.addEventListener("click", () => {
        const themeBgColor = window.getComputedStyle(themeBg).backgroundColor;
        console.log(themeBgColor);
        setAndSaveBackgroundColor(themeBgColor);
      });
      backgroundContainer.appendChild(themeBg);
    } else {
      addBackgroundImage(backgroundContainer, `../backgrounds/${i}-min.jpg`);
    }
  }

  if ("IntersectionObserver" in window) {
    const lazyImageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const lazyImage = entry.target;
          lazyImage.src = lazyImage.dataset.src;
          lazyImage.classList.remove("lazy");
          lazyImageObserver.unobserve(lazyImage);
        }
      });
    });

    backgroundContainer.querySelectorAll(".lazy").forEach((lazyImage) => {
      lazyImageObserver.observe(lazyImage);
    });
  } else {
    backgroundContainer.querySelectorAll(".lazy").forEach((lazyImage) => {
      lazyImage.src = lazyImage.dataset.src;
      lazyImage.classList.remove("lazy");
    });
  }
};

const addBackgroundImage = (container, src) => {
  const img = document.createElement("img");
  img.className = "miniBg lazy";
  img.setAttribute("data-src", src);
  img.addEventListener("click", () => setAndSaveBackground(src));
  container.appendChild(img);
};

const setAndSaveBackground = (src) => {
  document.body.style.backgroundImage = `url(${src})`;
  document.body.style.backgroundRepeat = "repeat";
  document.body.style.backgroundSize = "cover";
  document.body.style.backgroundColor = "";
  localStorage.setItem("backgroundImage", src);
  localStorage.setItem("isRandomBackground", "false");
  localStorage.removeItem("backgroundColor");

  // Update toggles if open
  const randomBtns = document.querySelectorAll(
    "#random-theme-background-button"
  );
  randomBtns.forEach((btn) => {
    btn.classList.remove("toggleOn");
    btn.classList.add("toggleOff");
  });
};

const setAndSaveBackgroundColor = (color) => {
  document.body.style.backgroundColor = color;
  document.body.style.backgroundImage = "";
  localStorage.setItem("backgroundColor", color);
  localStorage.setItem("isRandomBackground", "false");
  localStorage.removeItem("backgroundImage");

  // Update toggles if open
  const randomBtns = document.querySelectorAll(
    "#random-theme-background-button"
  );
  randomBtns.forEach((btn) => {
    btn.classList.remove("toggleOn");
    btn.classList.add("toggleOff");
  });
};

const loadBackgroundFromStorage = () => {
  const storedBackgroundImage = localStorage.getItem("backgroundImage");
  const storedBackgroundColor = localStorage.getItem("backgroundColor");
  const isRandomBackground =
    localStorage.getItem("isRandomBackground") === "true";

  if (isRandomBackground) {
    setRandomBackground();
  } else {
    if (storedBackgroundImage) {
      document.body.style.backgroundImage = `url(${storedBackgroundImage})`;
      document.body.style.backgroundRepeat = "repeat";
      document.body.style.backgroundSize = "cover";
    } else if (storedBackgroundColor) {
      document.body.style.backgroundColor = storedBackgroundColor;
    }
  }
};

const setRandomBackground = () => {
  const randomIndex = Math.floor(Math.random() * 39) + 1;
  const randomBackgroundSrc = `../backgrounds/${randomIndex}-min.jpg`;
  document.body.style.backgroundImage = `url(${randomBackgroundSrc})`;
  document.body.style.backgroundRepeat = "repeat";
  document.body.style.backgroundSize = "cover";
  document.body.style.backgroundColor = "";
  localStorage.setItem("backgroundImage", randomBackgroundSrc);
};

const toggleRandomBackground = () => {
  const isRandomBackground =
    localStorage.getItem("isRandomBackground") === "true";
  const randomBtns = document.querySelectorAll(
    "#random-theme-background-button"
  );

  if (isRandomBackground) {
    localStorage.setItem("isRandomBackground", "false");
    randomBtns.forEach((btn) => {
      btn.classList.remove("toggleOn");
      btn.classList.add("toggleOff");
    });
    location.reload();
  } else {
    localStorage.setItem("isRandomBackground", "true");
    randomBtns.forEach((btn) => {
      btn.classList.remove("toggleOff");
      btn.classList.add("toggleOn");
    });
    setRandomBackground();
    location.reload();
  }
};

document.addEventListener("DOMContentLoaded", function () {
  loadBackgroundFromStorage();
});
