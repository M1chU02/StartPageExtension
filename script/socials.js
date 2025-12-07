const SOCIAL_SITES = {
  Spotify: {
    url: "https://open.spotify.com/",
    iconClass: "spotify",
    svgHref: "/svg/socialsvg/spotify.svg#spotify",
    backgroundColor: "#1DB954",
  },
  Facebook: {
    url: "https://www.facebook.com/",
    iconClass: "facebook",
    svgHref: "/svg/socialsvg/facebook.svg#facebook",
    backgroundColor: "#1877F2",
  },
  Instagram: {
    url: "https://www.instagram.com/",
    iconClass: "instagram",
    svgHref: "/svg/socialsvg/instagram.svg#instagram",
    backgroundColor: "#C13584",
  },
  Twitter: {
    url: "https://twitter.com/",
    iconClass: "twitter",
    svgHref: "/svg/socialsvg/twitter.svg#twitter",
    backgroundColor: "#000000",
  },
  Linkedin: {
    url: "https://www.linkedin.com/",
    iconClass: "linkedin",
    svgHref: "/svg/socialsvg/linkedin.svg#linkedin",
    backgroundColor: "#0A66C2",
  },
  Youtube: {
    url: "https://www.youtube.com/",
    iconClass: "youtube",
    svgHref: "/svg/socialsvg/youtube.svg#youtube",
    backgroundColor: "#FF0000",
  },
  Github: {
    url: "https://github.com/",
    iconClass: "github",
    svgHref: "/svg/socialsvg/github.svg#github",
    backgroundColor: "#24292e",
  },
  TikTok: {
    url: "https://www.tiktok.com/",
    iconClass: "tiktok",
    svgHref: "/svg/socialsvg/tiktok.svg#tiktok",
    backgroundColor: "#000000",
  },
  Reddit: {
    url: "https://www.reddit.com/",
    iconClass: "reddit",
    svgHref: "/svg/socialsvg/reddit.svg#reddit",
    backgroundColor: "#FF4500",
  },
  Discord: {
    url: "https://discord.com/",
    iconClass: "discord",
    svgHref: "/svg/socialsvg/discord.svg#discord",
    backgroundColor: "#5865F2",
  },
  Messenger: {
    url: "https://www.messenger.com/",
    iconClass: "messenger",
    svgHref: "/svg/socialsvg/messenger.svg#messenger",
    backgroundColor: "#0084FF",
  },
  Notion: {
    url: "https://www.notion.so/",
    iconClass: "notion",
    svgHref: "/svg/socialsvg/notion.svg#notion",
    backgroundColor: "#000000",
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

  // persist default to storage as well
  localStorage.setItem(`social_${cardId}`, socialName);
  localStorage.setItem(`social_url_${cardId}`, config.url);

  btn.title = socialName;

  // update SVG icon
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

  // update tile background color (overrides CSS background)
  if (config.backgroundColor) {
    btn.style.background = config.backgroundColor;
  }

  // click behaviour
  btn.onclick = () => {
    window.location.href = config.url;
  };
}

// initialize all tiles on page load
SOCIAL_CARD_IDS.forEach(applySocialToButton);
