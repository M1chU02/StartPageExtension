function setCookie(name, value, days) {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
}

function getCookie(name) {
  const cookies = document.cookie.split("; ");
  for (const cookie of cookies) {
    const [cookieName, cookieValue] = cookie.split("=");
    if (cookieName === name) {
      return cookieValue;
    }
  }
  return null;
}

function updateWeatherLink(city) {
  const link = document.getElementById("extendedWeatherLink");
  if (link) {
    link.href = `https://www.google.com/search?q=weather+${encodeURIComponent(
      city,
    )}`;
  }
}

const geolocationCookie = getCookie("geolocation");

let forecastData = null; // Store forecast data globally for tooltip

if (geolocationCookie) {
  const [lat, lng] = geolocationCookie.split(",");
  const weather = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current_weather=true&hourly=temperature_2m,weathercode&timezone=auto`;
  fetch(weather)
    .then((response) => response.json())
    .then((data) => {
      const temperature = data.current_weather.temperature + "°C, ";
      document.getElementById("temperature").innerHTML = temperature;

      // Store forecast data for tooltip
      forecastData = data.hourly;
      initializeWeatherTooltip();
    });

  const city = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}`;
  fetch(city)
    .then((response) => response.json())
    .then((data) => {
      const city = data.city;
      document.getElementById("city").innerHTML = city;
      updateWeatherLink(city);
    });
} else if ("geolocation" in navigator) {
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;

      setCookie("geolocation", `${lat},${lng}`, 1);

      const weather = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current_weather=true&hourly=temperature_2m,weathercode&timezone=auto`;
      fetch(weather)
        .then((response) => response.json())
        .then((data) => {
          const temperature = data.current_weather.temperature + "°C, ";
          document.getElementById("temperature").innerHTML = temperature;

          // Store forecast data for tooltip
          forecastData = data.hourly;
          initializeWeatherTooltip();
        });

      const city = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}`;
      fetch(city)
        .then((response) => response.json())
        .then((data) => {
          const city = data.city;
          document.getElementById("city").innerHTML = city;
          updateWeatherLink(city);
        });
    },
    (error) => {
      console.error("Error getting location:", error);
      document.getElementById("weatherdiv").style.display = "none";
      document.getElementById("offlinediv").style.display = "flex";
    },
  );
} else {
  console.log("Geolocation is not supported by this browser.");
  document.getElementById("weatherdiv").style.display = "none";
  document.getElementById("offlinediv").style.display = "flex";
}

// Weather code to description mapping
const weatherCodeMap = {
  0: "Clear sky",
  1: "Mainly clear",
  2: "Partly cloudy",
  3: "Overcast",
  45: "Foggy",
  48: "Foggy",
  51: "Light drizzle",
  53: "Drizzle",
  55: "Heavy drizzle",
  61: "Light rain",
  63: "Rain",
  65: "Heavy rain",
  71: "Light snow",
  73: "Snow",
  75: "Heavy snow",
  77: "Snow grains",
  80: "Light showers",
  81: "Showers",
  82: "Heavy showers",
  85: "Light snow showers",
  86: "Snow showers",
  95: "Thunderstorm",
  96: "Thunderstorm with hail",
  99: "Thunderstorm with hail",
};

function initializeWeatherTooltip() {
  const weatherDiv = document.getElementById("weatherdiv");
  if (!weatherDiv || !forecastData) return;

  // Create tooltip element
  let tooltip = document.getElementById("weather-tooltip");
  if (!tooltip) {
    tooltip = document.createElement("div");
    tooltip.id = "weather-tooltip";
    tooltip.className = "weather-tooltip";
    document.body.appendChild(tooltip);
  }

  // Show tooltip on hover
  weatherDiv.addEventListener("mouseenter", () => {
    if (!forecastData) return;

    const currentHour = new Date().getHours();
    let tooltipHTML = '<div class="weather-tooltip-title">Next 6 Hours</div>';

    // Show next 6 hours of forecast
    for (let i = 0; i < 6; i++) {
      const hourIndex = currentHour + i;
      if (hourIndex >= forecastData.time.length) break;

      const time = new Date(forecastData.time[hourIndex]);
      const temp = Math.round(forecastData.temperature_2m[hourIndex]);
      const weatherCode = forecastData.weathercode[hourIndex];
      const description = weatherCodeMap[weatherCode] || "Unknown";

      tooltipHTML += `
        <div class="weather-tooltip-row">
          <span class="weather-tooltip-time">${time.getHours()}:00</span>
          <span class="weather-tooltip-temp">${temp}°C</span>
          <span class="weather-tooltip-desc">${description}</span>
        </div>
      `;
    }

    tooltip.innerHTML = tooltipHTML;
    tooltip.style.display = "block";

    // Position tooltip below weather div
    const rect = weatherDiv.getBoundingClientRect();
    tooltip.style.left = rect.left + "px";
    tooltip.style.top = rect.bottom + 10 + "px";
  });

  // Hide tooltip on mouse leave
  weatherDiv.addEventListener("mouseleave", () => {
    tooltip.style.display = "none";
  });
}
