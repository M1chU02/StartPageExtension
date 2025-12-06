/*const instagramBtn = document.getElementById("card1");
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
*/
const SOCIAL_SITES = {
  Spotify: {
    url: "https://open.spotify.com/",
    iconClass: "spotify",
    svgHref: "/svg/socialsvg/spotify.svg#spotify",
  },
  Facebook: {
    url: "https://www.facebook.com/",
    iconClass: "facebook",
    svgHref: "/svg/socialsvg/facebook.svg#facebook",
  },
  Instagram: {
    url: "https://www.instagram.com/",
    iconClass: "instagram",
    svgHref: "/svg/socialsvg/instagram.svg#instagram",
  },
  Twitter: {
    url: "https://twitter.com/",
    iconClass: "twitter",
    svgHref: "/svg/socialsvg/twitter.svg#twitter",
  },
  Linkedin: {
    url: "https://www.linkedin.com/",
    iconClass: "linkedin",
    svgHref: "/svg/socialsvg/linkedin.svg#linkedin",
  },
  Youtube: {
    url: "https://www.youtube.com/",
    iconClass: "youtube",
    svgHref: "/svg/socialsvg/youtube.svg#youtube",
  },
  Github: {
    url: "https://github.com/",
    iconClass: "github",
    svgHref: "/svg/socialsvg/github.svg#github",
  },
  TikTok: {
    url: "https://www.tiktok.com/",
    iconClass: "tiktok",
    svgHref: "/svg/socialsvg/tiktok.svg#tiktok",
  },
  Reddit: {
    url: "https://www.reddit.com/",
    iconClass: "reddit",
    svgHref: "/svg/socialsvg/reddit.svg#reddit",
  },
  Discord: {
    url: "https://discord.com/",
    iconClass: "discord",
    svgHref: "/svg/socialsvg/discord.svg#discord",
  },
  Messenger: {
    url: "https://www.messenger.com/",
    iconClass: "messenger",
    svgHref: "/svg/socialsvg/messenger.svg#messenger",
  },
  Notion: {
    url: "https://www.notion.so/",
    iconClass: "notion",
    svgHref: "/svg/socialsvg/notion.svg#notion",
  },
};

const SOCIAL_CARD_IDS = ["card1", "card2", "card3", "card4", "spotifycard"];

const SOCIAL_DEFAULTS = {
  card1: "Instagram",
  card2: "Twitter",
  card3: "Github",
  card4: "Youtube",
  spotifycard: "Spotify",
};

function applySocialToButton(cardId) {
  const btn = document.getElementById(cardId);
  if (!btn) return;

  const socialName =
    localStorage.getItem(`social_${cardId}`) || SOCIAL_DEFAULTS[cardId];
  const config = SOCIAL_SITES[socialName];
  if (!config) return;

  // zapisujemy domyślne także do localStorage
  localStorage.setItem(`social_${cardId}`, socialName);
  localStorage.setItem(`social_url_${cardId}`, config.url);

  btn.title = socialName;

  const svg = btn.querySelector("svg");
  if (svg) {
    svg.setAttribute("class", config.iconClass);
    const use = svg.querySelector("use");
    if (use) {
      use.setAttributeNS(
        "http://www.w3.org/1999/xlink",
        "href",
        config.svgHref
      );
    }
  }

  btn.onclick = () => {
    window.location.href = config.url;
  };
}

SOCIAL_CARD_IDS.forEach(applySocialToButton);
