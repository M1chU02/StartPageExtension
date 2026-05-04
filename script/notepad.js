const textarea = document.getElementById("notepadarea");
const saveButton = document.getElementById("savenotesbtn");
const loaderContainer = document.querySelector(".loader-container");
const loader = document.querySelector(".loader");
const textSpan = document.querySelector("#savenotesbtn span");

const noteList = document.getElementById("note-list");
const addNoteBtn = document.getElementById("add-note-btn");

const notes = JSON.parse(localStorage.getItem("notepadNotes")) || [];
let currentNoteIndex = -1;
let isCreatingNote = false;
const URL_REGEX = /((?:https?:\/\/|www\.)[^\s<]+)/gi;

function normalizeUrl(url) {
  return url.startsWith("www.") ? `https://${url}` : url;
}

function convertTextNodeUrlsToLinks(textNode, parent) {
  const text = textNode.nodeValue;
  URL_REGEX.lastIndex = 0;

  if (!URL_REGEX.test(text)) {
    return;
  }

  URL_REGEX.lastIndex = 0;
  const fragment = document.createDocumentFragment();
  let lastIndex = 0;
  let match = URL_REGEX.exec(text);

  while (match) {
    const matchedText = match[0];
    const startIndex = match.index;

    if (startIndex > lastIndex) {
      fragment.appendChild(
        document.createTextNode(text.slice(lastIndex, startIndex)),
      );
    }

    const anchor = document.createElement("a");
    anchor.href = normalizeUrl(matchedText);
    anchor.textContent = matchedText;
    anchor.target = "_blank";
    anchor.rel = "noopener noreferrer";
    anchor.classList.add("notepad-auto-link");
    fragment.appendChild(anchor);

    lastIndex = startIndex + matchedText.length;
    match = URL_REGEX.exec(text);
  }

  if (lastIndex < text.length) {
    fragment.appendChild(document.createTextNode(text.slice(lastIndex)));
  }

  parent.replaceChild(fragment, textNode);
}

function linkifyNode(node) {
  if (node.nodeType === Node.TEXT_NODE && node.parentNode) {
    convertTextNodeUrlsToLinks(node, node.parentNode);
    return;
  }

  if (node.nodeType !== Node.ELEMENT_NODE) {
    return;
  }

  const element = node;
  if (element.tagName === "A") {
    return;
  }

  const childNodes = Array.from(element.childNodes);
  childNodes.forEach((childNode) => linkifyNode(childNode));
}

function linkifyContent(content) {
  const wrapper = document.createElement("div");
  wrapper.innerHTML = content;
  linkifyNode(wrapper);
  return wrapper.innerHTML;
}

noteList.addEventListener("wheel", (evt) => {
  evt.preventDefault();
  noteList.scrollLeft += evt.deltaY;
});

function saveNotes() {
  localStorage.setItem("notepadNotes", JSON.stringify(notes));
}

function switchNote(index) {
  if (currentNoteIndex !== index) {
    const prevNoteButton = noteList.querySelector(
      `.switchnote[data-index="${currentNoteIndex}"]`,
    );
    if (prevNoteButton) {
      prevNoteButton.classList.remove("currentNote");
    }

    saveCurrentNote();
    currentNoteIndex = index;
    const linkedContent = linkifyContent(notes[index].content || "");
    if (notes[index].content !== linkedContent) {
      notes[index].content = linkedContent;
      saveNotes();
    }
    textarea.innerHTML = linkedContent;
    updateNoteList();

    const currentNoteButton = noteList.querySelector(
      `.switchnote[data-index="${index}"]`,
    );
    if (currentNoteButton) {
      currentNoteButton.classList.add("currentNote");
    }

    localStorage.setItem("lastViewedNoteIndex", index);
  }
}

function saveCurrentNote() {
  if (currentNoteIndex !== -1) {
    notes[currentNoteIndex].content = linkifyContent(textarea.innerHTML);
    saveNotes();
  }
}

function renameNote(index, newName) {
  notes[index].title = newName;
  saveNotes();
  updateNoteList();
}

function deleteNote(index) {
  if (notes.length <= 1) {
    alert("You cannot delete the last note.");
    return;
  }

  notes.splice(index, 1);
  saveNotes();

  // Update currentNoteIndex
  if (currentNoteIndex >= index) {
    currentNoteIndex = Math.max(0, currentNoteIndex - 1);
  }

  updateNoteList();
  switchNote(currentNoteIndex);
  localStorage.setItem("lastViewedNoteIndex", currentNoteIndex);
}

function addNote() {
  if (notes.length > 10) {
    alert("You have reached the maximum limit of 10 notes.");
    return;
  }

  if (isCreatingNote) {
    return;
  }

  isCreatingNote = true;

  saveCurrentNote();
  const newNote = { title: `Note ${notes.length + 1}`, content: "" };
  notes.push(newNote);
  saveNotes();
  updateNoteList();
  switchNote(notes.length - 1);

  setTimeout(function () {
    isCreatingNote = false;
  }, 1000);
}

function loadDefaultNote() {
  if (notes.length === 0) {
    const defaultNote = { title: "Note 1", content: "Make a note..." };
    notes.push(defaultNote);
    saveNotes();
  }
}

function reorderNotes(oldIndex, newIndex) {
  if (
    oldIndex < 0 ||
    oldIndex >= notes.length ||
    newIndex < 0 ||
    newIndex >= notes.length
  ) {
    console.error("Invalid index for reordering");
    return;
  }

  const [movedNote] = notes.splice(oldIndex, 1);
  notes.splice(newIndex, 0, movedNote);

  saveNotes();
  updateNoteList();
  switchNote(newIndex);
}

function updateNoteList() {
  noteList.innerHTML = "";
  const notepadNavbar = document.getElementById("notepad-navbar");
  let reorderButton = notepadNavbar.querySelector(".reorder-btn");
  if (!reorderButton) {
    reorderButton = document.createElement("button");
    reorderButton.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="3" y1="12" x2="21" y2="12"></line>
        <line x1="3" y1="6" x2="21" y2="6"></line>
        <line x1="3" y1="18" x2="21" y2="18"></line>
      </svg>`;
    reorderButton.classList.add("reorder-btn");
    reorderButton.setAttribute("title", "Reorder notes");
    notepadNavbar.appendChild(reorderButton);
    reorderButton.addEventListener("click", showReorderModal);
  }
  notes.forEach((note, index) => {
    const noteTitle = note.title || "Untitled Note";
    const noteItem = document.createElement("div");

    const switchNoteButton = document.createElement("button");
    switchNoteButton.classList.add("switchnote");
    switchNoteButton.dataset.index = index;
    switchNoteButton.textContent = noteTitle;
    switchNoteButton.addEventListener("click", () => switchNote(index));
    noteItem.appendChild(switchNoteButton);

    const settingsButton = document.createElement("button");
    settingsButton.classList.add("settingsbtn");
    settingsButton.setAttribute("title", "Note settings");
    settingsButton.innerHTML = `
  <svg viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg">
    <path d="M140,128a12,12,0,1,1-12-12A12,12,0,0,1,140,128ZM128,72a12,12,0,1,0-12-12A12,12,0,0,0,128,72Zm0,112a12,12,0,1,0,12,12A12,12,0,0,0,128,184Z"></path>
  </svg>
`;
    settingsButton.addEventListener("click", () => showNoteSettings(index));
    noteItem.appendChild(settingsButton);

    noteList.appendChild(noteItem);
  });
}

function showNoteSettings(index) {
  const currentTitle = notes[index].title;

  const settingsModal = `
    <div id="note-settings-modal">
      <div id="note-settings-form-container">
        <form id="note-settings-form">
          <label for="new-note-title">New Note Title:</label>
          <input type="text" id="new-note-title" placeholder="Enter New Title" value="${currentTitle}" required autocomplete="off" />

          <button type="submit" id="rename-note">Rename</button>

          <button id="download-note">Download (.txt)</button>

          <button id="delete-note" style="display: flex;">
            <span class="text">Delete</span>
            <span class="icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M24 20.188l-8.315-8.209 8.2-8.282-3.697-3.697-8.212 8.318-8.31-8.203-3.666 3.666 8.321 8.24-8.206 8.313 3.666 3.666 8.237-8.318 8.285 8.203z"></path></svg></span>
          </button>
        </form>
      </div>
    </div>`;

  const settingsWindow = new WinBox({
    title: "Note Settings",
    background: "transparent",
    modal: true,
    width: "400px",
    height: "500px",
    html: settingsModal,
    x: "center",
    y: "center",
    onclose: function () {
      updateNoteList();
    },
  });

  const renameNoteButton = settingsWindow.body.querySelector("#rename-note");
  renameNoteButton.addEventListener("click", function (e) {
    e.preventDefault();
    const newNoteTitle =
      settingsWindow.body.querySelector("#new-note-title").value;
    renameNote(index, newNoteTitle);
    settingsWindow.close();
  });

  const downloadNoteButton =
    settingsWindow.body.querySelector("#download-note");
  downloadNoteButton.addEventListener("click", function (e) {
    e.preventDefault();
    const plainTextContent = notes[currentNoteIndex].content.replace(
      /<[^>]+>/g,
      "",
    );
    const noteTitle = notes[currentNoteIndex].title;

    const blob = new Blob([plainTextContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = noteTitle + ".txt";
    a.click();

    URL.revokeObjectURL(url);
  });

  const deleteNoteButton = settingsWindow.body.querySelector("#delete-note");
  deleteNoteButton.addEventListener("click", function () {
    const noteToDeleteTitle = notes[index].title;
    const confirmation = confirm(
      `Are you sure you want to delete "${noteToDeleteTitle}"?`,
    );
    if (confirmation) {
      deleteNote(index);
      settingsWindow.close();
    }
  });
}

function initializeNotepad() {
  loadDefaultNote();
  updateNoteList();

  const lastViewedIndex = parseInt(localStorage.getItem("lastViewedNoteIndex"));
  if (
    !isNaN(lastViewedIndex) &&
    lastViewedIndex >= 0 &&
    lastViewedIndex < notes.length
  ) {
    switchNote(lastViewedIndex);
  } else {
    switchNote(0);
  }
}

window.addEventListener("load", initializeNotepad);

saveButton.addEventListener("click", function () {
  saveCurrentNote();

  loaderContainer.style.backgroundColor = "green";
  saveButton.style.backgroundColor = "green";

  loader.style.display = "block";
  textSpan.style.display = "none";

  setTimeout(function () {
    loader.style.display = "none";
    textSpan.style.display = "block";
    textSpan.textContent = "Saved!";

    setTimeout(function () {
      textSpan.textContent = "Save notes";
      loaderContainer.style.backgroundColor = "";
      saveButton.style.backgroundColor = "";
    }, 1000);
  }, 1500);
});

addNoteBtn.addEventListener("click", addNote);

textarea.addEventListener("click", (event) => {
  const anchor = event.target.closest("a");
  if (!anchor) {
    return;
  }

  event.preventDefault();
  window.open(anchor.href, "_blank", "noopener,noreferrer");
});

function showReorderModal() {
  const reorderModal = `
    <div id="reorder-modal">
      <div id="note-settings-form-container">
        <h3>Reorder Notes</h3>
        <ul id="reorder-list"></ul>
        <button id="save-order">Save Order</button>
      </div>
    </div>`;

  const reorderWindow = new WinBox({
    title: "Reorder Notes",
    background: "transparent",
    modal: true,
    width: "400px",
    height: "500px",
    html: reorderModal,
    x: "center",
    y: "center",
    onclose: function () {
      updateNoteList();
    },
  });

  const reorderList = reorderWindow.body.querySelector("#reorder-list");

  function updateReorderList() {
    reorderList.innerHTML = "";
    notes.forEach((note, index) => {
      const li = document.createElement("li");
      li.innerHTML = `
        <span class="note-title">${note.title}
        <button class="move-up" ${index === 0 ? "disabled" : ""}>▲</button>
        <button class="move-down" ${
          index === notes.length - 1 ? "disabled" : ""
        }>▼</button>`;
      reorderList.appendChild(li);
    });
  }

  updateReorderList();

  reorderList.addEventListener("click", function (e) {
    if (e.target.classList.contains("move-up")) {
      const li = e.target.closest("li");
      const index = Array.from(reorderList.children).indexOf(li);
      if (index > 0) {
        [notes[index - 1], notes[index]] = [notes[index], notes[index - 1]];
        updateReorderList();
      }
    } else if (e.target.classList.contains("move-down")) {
      const li = e.target.closest("li");
      const index = Array.from(reorderList.children).indexOf(li);
      if (index < notes.length - 1) {
        [notes[index], notes[index + 1]] = [notes[index + 1], notes[index]];
        updateReorderList();
      }
    }
  });

  const saveOrderButton = reorderWindow.body.querySelector("#save-order");
  saveOrderButton.addEventListener("click", function () {
    saveNotes();
    updateNoteList();
    switchNote(currentNoteIndex);
    reorderWindow.close();
  });
}
