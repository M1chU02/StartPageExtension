document.addEventListener("DOMContentLoaded", function () {
  const backgroundContainer = document.getElementById(
    "backgroundImagesContainer"
  );
  const randomThemeButton = document.getElementById(
    "random-theme-background-button"
  );

  const addBackgroundImage = (src) => {
    const img = document.createElement("img");
    img.className = "miniBg lazy";
    img.setAttribute("data-src", src);
    img.addEventListener("click", () => setAndSaveBackground(src));
    backgroundContainer.appendChild(img);
  };

  const setAndSaveBackground = (src) => {
    document.body.style.backgroundImage = `url(${src})`;
    document.body.style.backgroundRepeat = "no-repeat";
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundColor = "";
    localStorage.setItem("backgroundImage", src);
    localStorage.setItem("isRandomBackground", "false");
    localStorage.removeItem("backgroundColor");
  };

  const setAndSaveBackgroundColor = (color) => {
    document.body.style.backgroundColor = color;
    document.body.style.backgroundImage = "";
    localStorage.setItem("backgroundColor", color);
    localStorage.setItem("isRandomBackground", "false");
    localStorage.removeItem("backgroundImage");
  };

  const loadBackgroundFromStorage = () => {
    const storedBackgroundImage = localStorage.getItem("backgroundImage");
    const storedBackgroundColor = localStorage.getItem("backgroundColor");
    const isRandomBackground =
      localStorage.getItem("isRandomBackground") === "true";

    if (isRandomBackground) {
      randomThemeButton.classList.add("toggleOn");
      setRandomBackground();
    } else {
      randomThemeButton.classList.add("toggleOff");
      if (storedBackgroundImage) {
        document.body.style.backgroundImage = `url(${storedBackgroundImage})`;
        document.body.style.backgroundRepeat = "no-repeat";
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
    document.body.style.backgroundRepeat = "no-repeat";
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundColor = "";
    localStorage.setItem("backgroundImage", randomBackgroundSrc);
  };

  const toggleRandomBackground = () => {
    const isRandomBackground =
      localStorage.getItem("isRandomBackground") === "true";
    if (isRandomBackground) {
      localStorage.setItem("isRandomBackground", "false");
      randomThemeButton.classList.add("toggleOff");
      loadBackgroundFromStorage();
      location.reload();
    } else {
      localStorage.setItem("isRandomBackground", "true");
      randomThemeButton.classList.add("toggleOn");
      setRandomBackground();
      location.reload();
    }
  };

  randomThemeButton.addEventListener("click", toggleRandomBackground);

  for (let i = 0; i <= 39; i++) {
    if (i === 0) {
      const themeBg = document.createElement("div");
      themeBg.classList.add("miniBg");
      themeBg.id = "themeBg";
      themeBg.addEventListener("click", () => {
        const themeBgDiv = document.getElementById("themeBg");
        const themeBgColor =
          window.getComputedStyle(themeBgDiv).backgroundColor;
        console.log(themeBgColor);
        setAndSaveBackgroundColor(themeBgColor);
      });
      backgroundContainer.appendChild(themeBg);
    } else {
      addBackgroundImage(`../backgrounds/${i}-min.jpg`);
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

    document.querySelectorAll(".lazy").forEach((lazyImage) => {
      lazyImageObserver.observe(lazyImage);
    });
  } else {
    document.querySelectorAll(".lazy").forEach((lazyImage) => {
      lazyImage.src = lazyImage.dataset.src;
      lazyImage.classList.remove("lazy");
    });
  }

  loadBackgroundFromStorage();
});
