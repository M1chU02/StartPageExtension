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

    var timestamp = new Date(item.lastVisitTime);
    var timestampElement = document.createElement("span");
    timestampElement.textContent = timestamp.toLocaleString() + ": ";

    var link = document.createElement("a");
    link.textContent = item.title;
    link.href = item.url;
    listItemLink.href = item.url;

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
