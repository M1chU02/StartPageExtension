const instagramBtn = document.getElementById("card1");
const twitterBtn = document.getElementById("card2");
const githubBtn = document.getElementById("card3");
const youtubeBtn = document.getElementById("card4");
const spotifyBtn = document.getElementById("spotifycard");

instagramBtn.addEventListener("click", () => {
  window.location = "http://www.instagram.com";
});

twitterBtn.addEventListener("click", () => {
  window.location = "http://www.twitter.com";
});

githubBtn.addEventListener("click", () => {
  window.location = "http://www.github.com";
});

youtubeBtn.addEventListener("click", () => {
  window.location = "http://www.youtube.com";
});

spotifyBtn.addEventListener("click", () => {
  window.location = "https://open.spotify.com";
});
