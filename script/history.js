let shown = false;

function getRecentTabsHistory(callback) {
  chrome.history.search({ text: "", maxResults: 10 }, function (historyItems) {
    callback(historyItems);
  });
}

function displayTabHistory(historyItems) {
  var historyList = document.getElementById("recent-tabs-list");
  historyList.innerHTML = "";

  historyItems.forEach(function (item) {
    var listItemLink = document.createElement("a");
    listItemLink.href = item.url;
    listItemLink.style.display = "flex";
    listItemLink.style.alignItems = "center";
    listItemLink.style.gap = "10px";

    // Get domain from URL to fetch the favicon
    var url = new URL(item.url);
    var domain = url.hostname;
    var faviconUrl = "https://www.google.com/s2/favicons?domain=" + domain;

    // Create favicon image element
    var faviconImg = document.createElement("img");
    faviconImg.src = faviconUrl;
    faviconImg.style.width = "16px";
    faviconImg.style.height = "16px";
    faviconImg.alt = "favicon";

    var timestamp = new Date(item.lastVisitTime);
    var timestampElement = document.createElement("span");
    timestampElement.textContent = timestamp.toLocaleString() + ": ";

    var link = document.createElement("a");
    link.textContent = item.title || item.url; // Fallback to URL if no title
    link.href = item.url;

    // Append favicon, timestamp, and link to the list item
    listItemLink.appendChild(faviconImg);
    listItemLink.appendChild(timestampElement);
    listItemLink.appendChild(link);

    historyList.appendChild(listItemLink);
  });
}

const recentTabsButton = document.getElementById("recent-tabs-button");
recentTabsButton.addEventListener("click", () => {
  if (!shown) {
    getRecentTabsHistory(displayTabHistory);
    shown = true;
  } else {
    document.getElementById("recent-tabs-list").innerHTML = "";
    shown = false;
  }
});

document.addEventListener("click", (e) => {
  const recentTabsList = document.getElementById("recent-tabs-list");
  const recentTabsButton = document.getElementById("recent-tabs-button");

  if (!recentTabsList.contains(e.target) && e.target !== recentTabsButton) {
    recentTabsList.innerHTML = "";
    shown = false;
  }
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    document.getElementById("recent-tabs-list").innerHTML = "";
    shown = false;
  }
});
