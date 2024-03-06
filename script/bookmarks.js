let bookmarks = [];

function addBookmark(url, name, bookmarkBg) {
  bookmarks = JSON.parse(localStorage.getItem("bookmarks")) || [];
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    url = "http://" + url;
  }

  bookmarks.push({ url, name, bookmarkBg });
  localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
}

function updateBookmark(index, url, name, bookmarkBg) {
  let bookmarks = JSON.parse(localStorage.getItem("bookmarks")) || [];
  bookmarks[index].url = url;
  bookmarks[index].name = name;
  bookmarks[index].bookmarkBg = bookmarkBg;
  localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
}

function deleteBookmark(index) {
  let bookmarks = JSON.parse(localStorage.getItem("bookmarks")) || [];
  bookmarks.splice(index, 1);
  localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
}

function getRandomHexColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function showFormModal() {
  const randomHexColor = getRandomHexColor();
  document.getElementById("bookmarkcolor").value = randomHexColor;
  const modal = document.getElementById("bookmark-modal");
  modal.style.display = "flex";
}

function hideFormModal() {
  const modal = document.getElementById("bookmark-modal");
  modal.style.display = "none";
  renderBookmarks();
}

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape") {
    document.getElementById("bookmark-modal").style.display = "none";
    renderBookmarks();
  }
});

const addButton = document.getElementById("add-button");
addButton.addEventListener("click", showFormModal);

const closeButton = document.getElementById("close-button");
closeButton.addEventListener("click", hideFormModal);

const modal = document.getElementById("bookmark-modal");
modal.addEventListener("click", function (e) {
  if (e.target === modal) {
    hideFormModal();
  }
});

const bookmarkForm = document.getElementById("bookmark-form");
bookmarkForm.addEventListener("submit", function (e) {
  e.preventDefault();
  const url = document.getElementById("url").value;
  const name = document.getElementById("name").value;
  const bookmarkBg = document.getElementById("bookmarkcolor").value;

  addBookmark(url, name, bookmarkBg);
  renderBookmarks();

  document.getElementById("url").value = "";
  document.getElementById("name").value = "";

  hideFormModal();
});

function renderBookmarks() {
  const bookmarkList = document.getElementById("bookmark-list");
  bookmarkList.innerHTML = "";

  bookmarks = JSON.parse(localStorage.getItem("bookmarks")) || [];

  bookmarks.forEach((bookmark, index) => {
    const bookmarkel = document.createElement("div");
    bookmarkel.className = "bookmark-element";
    bookmarkel.draggable = true;
    bookmarkel.dataset.index = index;

    const a = document.createElement("a");
    const settingsButton = document.createElement("div");

    a.href = bookmark.url;
    a.textContent = bookmark.name;
    bookmarkel.style.backgroundColor = bookmark.bookmarkBg;

    settingsButton.innerHTML = `<button class="settingsbtn">
      <svg viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg">
        <path d="M140,128a12,12,0,1,1-12-12A12,12,0,0,1,140,128ZM128,72a12,12,0,1,0-12-12A12,12,0,0,0,128,72Zm0,112a12,12,0,1,0,12,12A12,12,0,0,0,128,184Z"></path>
      </svg>
    </button>`;
    settingsButton.addEventListener("click", function () {
      const currentUrl = bookmark.url;
      const currentName = bookmark.name;
      const currentBookmarkColor = bookmark.bookmarkBg;

      const settingsModal = document.createElement("div");
      settingsModal.innerHTML = `<div id="settings-modal" style="display: none">
          <div id="settings-form-container">
              <button id="settings-close-button">&times;</button>
              <form id="settings-form">

                  <label for="new-url">New URL:</label>
                  <input type="text" id="new-url" placeholder="Enter New URL" value="${currentUrl}" required autocomplete="off" />

                  <label for="new-name">New Name:</label>
                  <input type="text" id="new-name" placeholder="Enter New Name" value="${currentName}" required autocomplete="off" />

                  <label for="new-bookmarkcolor">New Background Color</label>
                  <input type="color" id="new-bookmarkcolor" value="${currentBookmarkColor}"/>

                  <button type="submit" id="submit">Save changes</button>

                  <button id="delete-settings" style="display: flex"><span class="text">Delete</span><span class="icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M24 20.188l-8.315-8.209 8.2-8.282-3.697-3.697-8.212 8.318-8.31-8.203-3.666 3.666 8.321 8.24-8.206 8.313 3.666 3.666 8.237-8.318 8.285 8.203z"></path></svg></span></button>
              </form>
          </div>
      </div>`;
      bookmarkList.appendChild(settingsModal);
      document.getElementById("settings-modal").style.display = "flex";
      const settingsCloseButton = document.getElementById(
        "settings-close-button"
      );
      settingsCloseButton.addEventListener("click", () => {
        document.getElementById("settings-modal").style.display = "none";
        renderBookmarks();
      });

      const deleteSettingsButton = document.getElementById("delete-settings");
      deleteSettingsButton.addEventListener("click", () => {
        const confirmation = confirm(
          "Are you sure you want to delete this bookmark?"
        );
        if (confirmation) {
          deleteBookmark(index);
          renderBookmarks();
          document.getElementById("settings-modal").style.display = "none";
        }
      });

      document
        .getElementById("settings-modal")
        .addEventListener("click", function (e) {
          if (e.target === document.getElementById("settings-modal")) {
            document.getElementById("settings-modal").style.display = "none";
            renderBookmarks();
          }
        });

      document.addEventListener("keydown", function (e) {
        if (e.key === "Escape") {
          document.getElementById("settings-modal").style.display = "none";
          renderBookmarks();
        }
      });

      const settingsForm = document.getElementById("settings-form");
      settingsForm.addEventListener("submit", function (e) {
        e.preventDefault();
        const newUrl = document.getElementById("new-url").value;
        const newName = document.getElementById("new-name").value;
        const newbookmarkBg =
          document.getElementById("new-bookmarkcolor").value;
        updateBookmark(index, newUrl, newName, newbookmarkBg);
        renderBookmarks();
        document.getElementById("settings-modal").style.display = "none";
      });
    });

    bookmarkel.addEventListener("dragover", function (e) {
      e.preventDefault();
      this.classList.add("drop-target");
    });

    bookmarkel.addEventListener("dragleave", function () {
      this.classList.remove("drop-target");
    });

    bookmarkel.appendChild(a);
    bookmarkel.appendChild(settingsButton);
    bookmarkList.appendChild(bookmarkel);

    bookmarkel.addEventListener("dragstart", handleDragStart);
    bookmarkel.addEventListener("dragend", handleDragEnd);
  });
}

function saveBookmarks() {
  const bookmarkList = document.getElementById("bookmark-list");
  const bookmarkElements = bookmarkList.querySelectorAll(".bookmark-element");
  const newBookmarks = Array.from(bookmarkElements).map((element) => {
    const index = parseInt(element.dataset.index, 10);
    return bookmarks[index];
  });
  localStorage.setItem("bookmarks", JSON.stringify(newBookmarks));
}

let dragBookmark = null;

function handleDragStart(e) {
  e.dataTransfer.setData("text/plain", e.target.id);
  dragBookmark = this;
  setTimeout(() => {
    this.style.display = "none";
  }, 0);
}

function handleDragEnd(e) {
  e.preventDefault();
  this.style.display = "flex";
  dragBookmark = null;
  saveBookmarks();
}

document.addEventListener("dragover", (e) => {
  e.preventDefault();
});

document.addEventListener("drop", (e) => {
  e.preventDefault();

  if (dragBookmark) {
    const targetDiv = e.target.closest(".bookmark-element");
    const bookmarkList = document.getElementById("bookmark-list");

    if (targetDiv) {
      targetDiv.parentNode.insertBefore(dragBookmark, targetDiv);
    } else {
      bookmarkList.appendChild(dragBookmark);
    }

    const bookmarkElements = document.querySelectorAll(".bookmark-element");
    bookmarkElements.forEach((element) => {
      element.classList.remove("drop-target");
    });
  }

  saveBookmarks();
});

window.addEventListener("load", function () {
  renderBookmarks();
  bookmarks = JSON.parse(localStorage.getItem("bookmarks")) || [];
});
