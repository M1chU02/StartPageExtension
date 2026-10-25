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

// Migrate old data structure to new array format with task objects
function migrateToDoListsData() {
  const storedData = localStorage.getItem("toDoLists");
  if (!storedData) return [];

  try {
    const parsed = JSON.parse(storedData);
    // Already in new format (array of {name, content})
    if (Array.isArray(parsed)) {
      // Ensure each task is an object with required fields
      parsed.forEach(list => {
        if (Array.isArray(list.content) && typeof list.content[0] === "string") {
          // Legacy string tasks – upgrade them
          list.content = list.content.map(t => ({
            title: t,
            priority: "Medium",
            dueDate: null,
            status: "todo",
          }));
        }
      });
      return parsed;
    }
    // Old object format {listName: ["task1", "task2", ...]}
    const migratedLists = [];
    for (let listName in parsed) {
      const tasks = parsed[listName].map(t => ({
        title: t,
        priority: "Medium",
        dueDate: null,
        status: "todo",
      }));
      migratedLists.push({ name: listName, content: tasks });
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
let notificationsEnabled = false;
let reminderLeadMinutes = 60;
let overdueAlertsEnabled = false;

// Save lists to localStorage
function loadNotificationSettings() {
  notificationsEnabled = localStorage.getItem("todoNotificationsEnabled") === "true";
  const lead = localStorage.getItem("todoReminderLeadTime") || "60";
  if (lead === "custom") {
    const custom = parseInt(localStorage.getItem("todoReminderCustom") || "60", 10);
    reminderLeadMinutes = custom;
  } else {
    reminderLeadMinutes = parseInt(lead, 10);
  }
  overdueAlertsEnabled = localStorage.getItem("todoOverdueAlertsEnabled") === "true";
}
loadNotificationSettings();

function showTaskNotification(message) {
  if (typeof chrome !== "undefined" && chrome.notifications) {
    chrome.notifications.create({
      type: "basic",
      iconUrl: "icon.png",
      title: "Task Reminder",
      message,
    });
  } else if (window.Notification && Notification.permission === "granted") {
    new Notification("Task Reminder", { body: message });
  }
}

function scheduleAlarmsForList(listIdx) {
  if (!notificationsEnabled) return;
  if (typeof chrome !== "undefined" && chrome.alarms) {
    // Clear existing alarms for this list
    chrome.alarms.getAll(alarms => {
      alarms.forEach(alarm => {
        if (alarm.name.startsWith(`todo-${listIdx}-`)) {
          chrome.alarms.clear(alarm.name);
        }
      });
      const list = lists[listIdx];
      if (!list) return;
      list.content.forEach((task, taskIdx) => {
        if (task.dueDate) {
          const due = new Date(task.dueDate).getTime();
          const alarmTime = due - reminderLeadMinutes * 60 * 1000;
          const now = Date.now();
          if (alarmTime > now) {
            const alarmName = `todo-${listIdx}-${taskIdx}`;
            chrome.alarms.create(alarmName, { when: alarmTime });
          } else if (overdueAlertsEnabled) {
            showTaskNotification(`Task "${task.title}" is overdue!`);
          }
        }
      });
    });
  }
}

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

  const list = lists[index];
  // Clear existing tasks
  taskList.innerHTML = "";
  list.content.forEach((task, i) => {
    const li = createTaskElement(task, i);
    taskList.appendChild(li);
  });
  currentListIndex = index;
  // Schedule notifications for this list
  scheduleAlarmsForList(index);
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

  const taskItems = taskList.querySelectorAll("li.task-item");
  const tasks = Array.from(taskItems).map(item => {
    const title = item.querySelector(".task-title")?.textContent.trim() || "";
    const priority = item.querySelector(".task-priority")?.value || "Medium";
    const due = item.querySelector(".task-due")?.value || null;
    const status = item.querySelector(".task-status")?.value || "todo";
    return {
      title,
      priority,
      dueDate: due ? new Date(due).toISOString() : null,
      status,
    };
  }).filter(t => t.title.length > 0);
  lists[currentListIndex].content = tasks;

  saveLists();
  // Schedule notifications for updated tasks
  scheduleAlarmsForList(currentListIndex);
}


// Helper to create a task list item element
function createTaskElement(task, idx) {
  const li = document.createElement("li");
  li.className = "task-item";
  li.draggable = true;
  if (typeof idx === "number") li.dataset.taskIndex = idx;
  li.innerHTML = `
    <span class="task-title" contenteditable="true">${task.title}</span>
    <select class="task-priority">
      <option${task.priority==="Low"?" selected":""}>Low</option>
      <option${task.priority==="Medium"?" selected":""}>Medium</option>
      <option${task.priority==="High"?" selected":""}>High</option>
    </select>
    <input type="date" class="task-due" value="${task.dueDate ? task.dueDate.split('T')[0] : ''}">
    <select class="task-status">
      <option${task.status==="todo"?" selected":""}>To Do</option>
      <option${task.status==="inprogress"?" selected":""}>In Progress</option>
      <option${task.status==="done"?" selected":""}>Done</option>
    </select>
    <button class="task-delete" title="Delete Task">✕</button>
  `;

  // Drag start
  li.addEventListener("dragstart", (ev) => {
    ev.dataTransfer.setData("text/plain", li.dataset.taskIndex);
  });

  // Update storage when fields change
  const inputs = li.querySelectorAll(".task-priority, .task-due, .task-status, .task-title");
  inputs.forEach((el) => {
    if (el.isContentEditable) {
      el.addEventListener("input", () => setTimeout(saveCurrentList, 0));
    } else {
      el.addEventListener("change", () => setTimeout(saveCurrentList, 0));
    }
  });
  const deleteBtn = li.querySelector(".task-delete");
  if (deleteBtn) {
    deleteBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      const idxStr = li.dataset.taskIndex;
      const idx = parseInt(idxStr);
      if (!isNaN(idx) && currentListIndex !== -1) {
        lists[currentListIndex].content.splice(idx, 1);
        saveLists();
        if (isKanban) {
          renderKanbanBoard();
        } else {
          displayList(currentListIndex);
        }
      } else {
        li.remove();
        setTimeout(saveCurrentList, 0);
      }
    });
  }

  return li;
}

let isKanban = false;

// Sort current list by given criteria
function sortCurrentList(criteria) {
  if (currentListIndex === -1) return;
  const list = lists[currentListIndex];
  list.content.sort((a, b) => {
    if (criteria === "title") {
      return a.title.localeCompare(b.title);
    } else if (criteria === "priority") {
      const order = { "High": 3, "Medium": 2, "Low": 1 };
      return (order[b.priority] || 0) - (order[a.priority] || 0);
    } else if (criteria === "dueDate") {
      const aTime = a.dueDate ? new Date(a.dueDate).getTime() : Infinity;
      const bTime = b.dueDate ? new Date(b.dueDate).getTime() : Infinity;
      return aTime - bTime;
    }
    return 0;
  });
  displayList(currentListIndex);
}

// Render kanban board view
function renderKanbanBoard() {
  // Remove existing board if any
  const existing = document.getElementById("kanbanBoard");
  if (existing) existing.remove();
  const board = document.createElement("div");
  board.id = "kanbanBoard";
  board.innerHTML = `
    <div class="kanban-column" data-status="todo"><h3>To Do</h3><ul class="kanban-list"></ul></div>
    <div class="kanban-column" data-status="inprogress"><h3>In Progress</h3><ul class="kanban-list"></ul></div>
    <div class="kanban-column" data-status="done"><h3>Done</h3><ul class="kanban-list"></ul></div>`;
  const todolistDiv = document.getElementById("todolistdiv");
  // Insert board before the save button
  const saveBtn = document.getElementById("saveBtn");
  todolistDiv.insertBefore(board, saveBtn);
  const list = lists[currentListIndex];
  list.content.forEach((task, idx) => {
    const li = createTaskElement(task, idx);
    const column = board.querySelector(`.kanban-column[data-status="${task.status}"] .kanban-list`);
    if (column) column.appendChild(li);
  });
  // Setup drag‑and‑drop for columns
  board.querySelectorAll(".kanban-list").forEach(col => {
    col.addEventListener("dragover", e => e.preventDefault());
    col.addEventListener("drop", e => {
      const draggedIdx = e.dataTransfer.getData("text/plain");
      if (draggedIdx !== "") {
        const newStatus = col.parentElement.dataset.status;
        const task = lists[currentListIndex].content[draggedIdx];
        if (task) {
          task.status = newStatus;
          saveCurrentList();
          renderKanbanBoard();
        }
      }
    });
  });
}

// Toggle kanban view
function toggleKanbanView() {
  isKanban = !isKanban;
  const kanbanBtn = document.getElementById("kanbanToggleBtn");
  if (isKanban) {
    kanbanBtn.textContent = "List";
    // Hide list view
    const ul = document.querySelector("#todolist ul");
    if (ul) ul.parentElement.style.display = "none";
    renderKanbanBoard();
  } else {
    kanbanBtn.textContent = "Kanban";
    // Remove board
    const board = document.getElementById("kanbanBoard");
    if (board) board.remove();
    // Show list view
    const ul = document.querySelector("#todolist ul");
    if (ul) ul.parentElement.style.display = "";
    displayList(currentListIndex);
  }
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
    const newTaskObj = { title: "", priority: "Medium", dueDate: null, status: "todo" };
    const li = createTaskElement(newTaskObj);
    taskList.appendChild(li);
    // Focus the title span
    const titleSpan = li.querySelector(".task-title");
    if (titleSpan) titleSpan.focus();
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

// Sort and Kanban controls
const sortSelect = document.getElementById("sortSelect");
if (sortSelect) {
  sortSelect.addEventListener("change", () => {
    sortCurrentList(sortSelect.value);
  });
}
const kanbanToggleBtn = document.getElementById("kanbanToggleBtn");
if (kanbanToggleBtn) {
  kanbanToggleBtn.addEventListener("click", toggleKanbanView);
}

reorderListBtn.addEventListener("click", showTodoListReorder);
todoSettingsBtn.addEventListener("click", showTodoListSettings);

// Save the current list when switching sections or when the page is about to unload
window.addEventListener("beforeunload", saveCurrentList);

// Initialize the app on page load
window.addEventListener("DOMContentLoaded", init);
