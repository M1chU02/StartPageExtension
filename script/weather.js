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

const geolocationCookie = getCookie("geolocation");

if (geolocationCookie) {
  const [lat, lng] = geolocationCookie.split(",");
  const weather = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current_weather=true`;
  fetch(weather)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      const temperature = data.current_weather.temperature + "°C, ";
      document.getElementById("temperature").innerHTML = temperature;
    });

  const city = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}`;
  fetch(city)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      const city = data.city;
      document.getElementById("city").innerHTML = city;
    });
} else if ("geolocation" in navigator) {
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;

      setCookie("geolocation", `${lat},${lng}`, 1);

      const weather = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current_weather=true`;
      fetch(weather)
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          const temperature = data.current_weather.temperature + "°C, ";
          document.getElementById("temperature").innerHTML = temperature;
        });

      const city = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}`;
      fetch(city)
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          const city = data.city;
          document.getElementById("city").innerHTML = city;
        });
    },
    (error) => {
      console.error("Error getting user location:", error);
    }
  );
} else {
  console.error("Geolocation is not supported by this browser.");
}
