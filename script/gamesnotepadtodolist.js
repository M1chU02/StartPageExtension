// Navbar buttons
const navGamesBtn = document.getElementById("nav-games-btn");
const navNotepadBtn = document.getElementById("nav-notepad-btn");
const navTodolistBtn = document.getElementById("nav-todolist-btn");

// Sections
const notepadDiv = document.getElementById("notepaddiv");
const gameselectDiv = document.getElementById("gameselectdiv");
const todolistDiv = document.getElementById("todolistdiv");

// Function to hide all sections
function hideAllSections() {
  notepadDiv.style.display = "none";
  gameselectDiv.style.display = "none";
  todolistDiv.style.display = "none";
}

// Event listeners for navbar buttons
navGamesBtn.addEventListener("click", () => {
  hideAllSections();
  gameselectDiv.style.display = "flex";
  navGamesBtn.classList.add("active");
  navNotepadBtn.classList.remove("active");
  navTodolistBtn.classList.remove("active");
  localStorage.setItem("activeSection", "games");
});

navNotepadBtn.addEventListener("click", () => {
  hideAllSections();
  notepadDiv.style.display = "flex";
  navNotepadBtn.classList.add("active");
  navGamesBtn.classList.remove("active");
  navTodolistBtn.classList.remove("active");
  localStorage.setItem("activeSection", "notepad");
});

navTodolistBtn.addEventListener("click", () => {
  hideAllSections();
  todolistDiv.style.display = "flex";
  navTodolistBtn.classList.add("active");
  navGamesBtn.classList.remove("active");
  navNotepadBtn.classList.remove("active");
  localStorage.setItem("activeSection", "todolist");
});

// Display Notepad section by default on page load or restore last active
window.addEventListener("DOMContentLoaded", () => {
  const activeSection = localStorage.getItem("activeSection");
  hideAllSections();
  navNotepadBtn.classList.remove("active");
  navGamesBtn.classList.remove("active");
  navTodolistBtn.classList.remove("active");

  if (activeSection === "games") {
    gameselectDiv.style.display = "flex";
    navGamesBtn.classList.add("active");
  } else if (activeSection === "todolist") {
    todolistDiv.style.display = "flex";
    navTodolistBtn.classList.add("active");
  } else {
    // Default to Notepad
    notepadDiv.style.display = "flex";
    navNotepadBtn.classList.add("active");
  }
});

const listSelector = document.getElementById("listSelector");
const taskList = document.querySelector("#todolist ul");
const saveBtn = document.getElementById("saveBtn");
const addListBtn = document.getElementById("addListBtn");
const reorderListBtn = document.getElementById("reorderListBtn");
const todoSettingsBtn = document.getElementById("todoSettingsBtn");

// Migrate old data structure to new array format
function migrateToDoListsData() {
  const storedData = localStorage.getItem("toDoLists");
  if (!storedData) return [];

  try {
    const parsed = JSON.parse(storedData);

    // Check if it's already an array (new format)
    if (Array.isArray(parsed)) {
      return parsed;
    }

    // Convert old object format to new array format
    const migratedLists = [];
    for (let listName in parsed) {
      migratedLists.push({
        name: listName,
        content: parsed[listName],
      });
    }
    return migratedLists;
  } catch (e) {
    console.error("Error parsing toDoLists:", e);
    return [];
  }
}

// Object to hold all lists (array of objects)
let lists = migrateToDoListsData();
let currentListIndex = -1;

// Save lists to localStorage
function saveLists() {
  localStorage.setItem("toDoLists", JSON.stringify(lists));
}

// Function to update the list selector dropdown
function updateListSelector() {
  listSelector.innerHTML = ""; // Clear existing options
  lists.forEach((list, index) => {
    let option = document.createElement("option");
    option.value = index;
    option.textContent = list.name;
    listSelector.appendChild(option);
  });
}

// Function to display the selected list
function displayList(index) {
  if (index < 0 || index >= lists.length) return;

  const tasks = lists[index].content || [];
  taskList.innerHTML = tasks
    .map((task) => `<li contenteditable="true">${task}</li>`)
    .join("");
  currentListIndex = index;
}

// Event handler for switching between lists
listSelector.addEventListener("change", (e) => {
  saveCurrentList(); // Save current list before switching
  const selectedIndex = parseInt(e.target.value);
  displayList(selectedIndex); // Display the selected list
  localStorage.setItem("lastSelectedListIndex", selectedIndex);
});

// Save the current list into localStorage
function saveCurrentList() {
  if (currentListIndex === -1 || currentListIndex >= lists.length) return;

  const taskElements = taskList.querySelectorAll("li");
  const tasks = Array.from(taskElements)
    .map((taskEl) => taskEl.textContent.trim())
    .filter((task) => task.length > 0);
  lists[currentListIndex].content = tasks;

  saveLists();
}

// Event handler for saving the current list manually
saveBtn.addEventListener("click", () => {
  saveCurrentList();
  alert("List saved!");
});

// Event handler for adding a new list
addListBtn.addEventListener("click", () => {
  if (lists.length >= 10) {
    alert("You have reached the maximum limit of 10 lists.");
    return;
  }

  const newListName = prompt("Enter a name for the new list:");
  if (!newListName) return;

  // Check if name already exists
  const nameExists = lists.some((list) => list.name === newListName);
  if (nameExists) {
    alert("List name already exists.");
    return;
  }

  saveCurrentList();
  const newList = { name: newListName, content: [] };
  lists.push(newList);
  saveLists();
  updateListSelector();
  listSelector.value = lists.length - 1;
  taskList.innerHTML = "";
  currentListIndex = lists.length - 1;
  localStorage.setItem("lastSelectedListIndex", currentListIndex);
});

// Show todo list settings modal
function showTodoListSettings() {
  if (currentListIndex === -1 || currentListIndex >= lists.length) return;

  const currentTitle = lists[currentListIndex].name;

  const settingsModal = `
    <div id="todo-settings-modal">
      <div id="todo-settings-form-container">
        <form id="todo-settings-form">
          <label for="new-list-title">New List Title:</label>
          <input type="text" id="new-list-title" placeholder="Enter New Title" value="${currentTitle}" required autocomplete="off" />

          <button type="submit" id="rename-list">Rename</button>

          <button id="delete-list" style="display: flex;">
            <span class="text">Delete</span>
            <span class="icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M24 20.188l-8.315-8.209 8.2-8.282-3.697-3.697-8.212 8.318-8.31-8.203-3.666 3.666 8.321 8.24-8.206 8.313 3.666 3.666 8.237-8.318 8.285 8.203z"></path></svg></span>
          </button>
        </form>
      </div>
    </div>`;

  const settingsWindow = new WinBox({
    title: "List Settings",
    background: "transparent",
    modal: true,
    width: "400px",
    height: "500px",
    html: settingsModal,
    x: "center",
    y: "center",
    onclose: function () {
      updateListSelector();
    },
  });

  const renameListButton = settingsWindow.body.querySelector("#rename-list");
  renameListButton.addEventListener("click", function (e) {
    e.preventDefault();
    const newListTitle =
      settingsWindow.body.querySelector("#new-list-title").value;

    // Check if name already exists (excluding current)
    const nameExists = lists.some(
      (list, idx) => list.name === newListTitle && idx !== currentListIndex
    );
    if (nameExists) {
      alert("List name already exists.");
      return;
    }

    lists[currentListIndex].name = newListTitle;
    saveLists();
    updateListSelector();
    listSelector.value = currentListIndex;
    settingsWindow.close();
  });

  const deleteListButton = settingsWindow.body.querySelector("#delete-list");
  deleteListButton.addEventListener("click", function () {
    if (lists.length <= 1) {
      alert("You cannot delete the last list.");
      return;
    }

    const listToDeleteTitle = lists[currentListIndex].name;
    const confirmation = confirm(
      `Are you sure you want to delete "${listToDeleteTitle}"?`
    );
    if (confirmation) {
      lists.splice(currentListIndex, 1);
      saveLists();

      // Update currentListIndex
      if (currentListIndex >= lists.length) {
        currentListIndex = lists.length - 1;
      }

      updateListSelector();
      displayList(currentListIndex);
      listSelector.value = currentListIndex;
      localStorage.setItem("lastSelectedListIndex", currentListIndex);
      settingsWindow.close();
    }
  });
}

// Show todo list reorder modal
function showTodoListReorder() {
  const reorderModal = `
    <div id="todo-reorder-modal">
      <div id="todo-settings-form-container">
        <h3>Reorder Lists</h3>
        <ul id="todo-reorder-list"></ul>
        <button id="save-list-order">Save Order</button>
      </div>
    </div>`;

  const reorderWindow = new WinBox({
    title: "Reorder Lists",
    background: "transparent",
    modal: true,
    width: "400px",
    height: "500px",
    html: reorderModal,
    x: "center",
    y: "center",
    onclose: function () {
      updateListSelector();
    },
  });

  const reorderList = reorderWindow.body.querySelector("#todo-reorder-list");

  function updateReorderList() {
    reorderList.innerHTML = "";
    lists.forEach((list, index) => {
      const li = document.createElement("li");
      li.innerHTML = `
        <span class="list-title">${list.name}</span>
        <button class="move-up" ${index === 0 ? "disabled" : ""}>▲</button>
        <button class="move-down" ${
          index === lists.length - 1 ? "disabled" : ""
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
        [lists[index - 1], lists[index]] = [lists[index], lists[index - 1]];
        updateReorderList();
      }
    } else if (e.target.classList.contains("move-down")) {
      const li = e.target.closest("li");
      const index = Array.from(reorderList.children).indexOf(li);
      if (index < lists.length - 1) {
        [lists[index], lists[index + 1]] = [lists[index + 1], lists[index]];
        updateReorderList();
      }
    }
  });

  const saveOrderButton = reorderWindow.body.querySelector("#save-list-order");
  saveOrderButton.addEventListener("click", function () {
    saveLists();
    updateListSelector();
    listSelector.value = currentListIndex;
    displayList(currentListIndex);
    reorderWindow.close();
  });
}

// Add new list item on Enter key
taskList.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    e.preventDefault(); // Prevent line break
    const newTask = document.createElement("li");
    newTask.setAttribute("contenteditable", "true");
    newTask.textContent = "";
    taskList.appendChild(newTask);
    newTask.focus(); // Focus on the new task
  }
});

// Initialize the list selector with any stored lists and load the last selected list
function init() {
  // Ensure at least one default list exists
  if (lists.length === 0) {
    lists.push({ name: "Default List", content: [] });
    saveLists();
  }

  updateListSelector();

  const lastSelectedIndex = parseInt(
    localStorage.getItem("lastSelectedListIndex")
  );
  if (
    !isNaN(lastSelectedIndex) &&
    lastSelectedIndex >= 0 &&
    lastSelectedIndex < lists.length
  ) {
    listSelector.value = lastSelectedIndex;
    displayList(lastSelectedIndex);
  } else if (lists.length > 0) {
    listSelector.selectedIndex = 0;
    displayList(0);
  }
}

// Event listeners for new buttons
reorderListBtn.addEventListener("click", showTodoListReorder);
todoSettingsBtn.addEventListener("click", showTodoListSettings);

// Save the current list when switching sections or when the page is about to unload
window.addEventListener("beforeunload", saveCurrentList);

// Initialize the app on page load
window.addEventListener("DOMContentLoaded", init);
