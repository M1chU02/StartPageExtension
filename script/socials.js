const SOCIAL_SITES = {
  Spotify: {
    url: "https://open.spotify.com/",
    iconClass: "spotify",
    svgHref: "/svg/socialsvg/spotify.svg#spotify",
    backgroundColor: "#1DB954",
    viewBox: "0 0 48 48",
  },
  Facebook: {
    url: "https://www.facebook.com/",
    iconClass: "facebook",
    svgHref: "/svg/socialsvg/facebook.svg#facebook",
    backgroundColor: "#1877F2",
    viewBox: "0 0 48 48",
  },
  Instagram: {
    url: "https://www.instagram.com/",
    iconClass: "instagram",
    svgHref: "/svg/socialsvg/instagram.svg#instagram",
    backgroundColor: "#C13584",
    viewBox: "0 0 48 48",
  },
  Twitter: {
    url: "https://twitter.com/",
    iconClass: "twitter",
    svgHref: "/svg/socialsvg/twitter.svg#twitter",
    backgroundColor: "#000000",
    viewBox: "0 0 24 24",
  },
  Linkedin: {
    url: "https://www.linkedin.com/",
    iconClass: "linkedin",
    svgHref: "/svg/socialsvg/linkedin.svg#linkedin",
    backgroundColor: "#0A66C2",
    viewBox: "0 0 48 48",
  },
  Youtube: {
    url: "https://www.youtube.com/",
    iconClass: "youtube",
    svgHref: "/svg/socialsvg/youtube.svg#youtube",
    backgroundColor: "#FF0000",
    viewBox: "0 0 48 48",
  },
  Github: {
    url: "https://github.com/",
    iconClass: "github",
    svgHref: "/svg/socialsvg/github.svg#github",
    backgroundColor: "#24292e",
    viewBox: "0 0 48 48",
  },
  TikTok: {
    url: "https://www.tiktok.com/",
    iconClass: "tiktok",
    svgHref: "/svg/socialsvg/tiktok.svg#tiktok",
    backgroundColor: "#000000",
    viewBox: "0 0 48 48",
  },
  Reddit: {
    url: "https://www.reddit.com/",
    iconClass: "reddit",
    svgHref: "/svg/socialsvg/reddit.svg#reddit",
    backgroundColor: "#FF4500",
    viewBox: "0 0 48 48",
  },
  Discord: {
    url: "https://discord.com/",
    iconClass: "discord",
    svgHref: "/svg/socialsvg/discord.svg#discord",
    backgroundColor: "#5865F2",
    viewBox: "0 0 24 24",
  },
  Messenger: {
    url: "https://www.messenger.com/",
    iconClass: "messenger",
    svgHref: "/svg/socialsvg/messenger.svg#messenger",
    backgroundColor: "#0084FF",
    viewBox: "0 0 32 32",
  },
  Notion: {
    url: "https://www.notion.so/",
    iconClass: "notion",
    svgHref: "/svg/socialsvg/notion.svg#notion",
    backgroundColor: "#000000",
    viewBox: "0 0 15 15",
  },
};

const SOCIAL_CARD_IDS = ["card1", "card2", "card3", "card4", "centerCard"];

const SOCIAL_DEFAULTS = {
  card1: "Instagram",
  card2: "Twitter",
  card3: "Github",
  card4: "Youtube",
  centerCard: "Spotify",
};

function getSocialConfig(cardId) {
  const socialName =
    localStorage.getItem(`social_${cardId}`) || SOCIAL_DEFAULTS[cardId];
  const config = SOCIAL_SITES[socialName];
  return { socialName, config };
}

function applySocialToElement(btn, cardId) {
  if (!btn) return;

  const { socialName, config } = getSocialConfig(cardId);
  if (!config) return;

  btn.title = socialName;

  const svg = btn.querySelector("svg");
  if (svg) {
    svg.setAttribute("class", config.iconClass);
    if (config.viewBox) {
      svg.setAttribute("viewBox", config.viewBox);
    }
    const use = svg.querySelector("use");
    if (use) {
      use.setAttributeNS(
        "http://www.w3.org/1999/xlink",
        "href",
        config.svgHref
      );
    }
  }

  if (config.backgroundColor) {
    btn.style.background = config.backgroundColor;
  }
}

function applySocialToButton(cardId) {
  const btn = document.getElementById(cardId);
  if (!btn) return;

  const { socialName, config } = getSocialConfig(cardId);
  if (!config) return;

  // persist selection
  localStorage.setItem(`social_${cardId}`, socialName);
  localStorage.setItem(`social_url_${cardId}`, config.url);

  // apply UI
  applySocialToElement(btn, cardId);

  // navigation only for real homepage tiles
  btn.onclick = () => {
    window.location.href = config.url;
  };
}

// initialize all tiles on page load
SOCIAL_CARD_IDS.forEach(applySocialToButton);
