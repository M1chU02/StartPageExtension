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
});

navNotepadBtn.addEventListener("click", () => {
  hideAllSections();
  notepadDiv.style.display = "flex";
  navNotepadBtn.classList.add("active");
  navGamesBtn.classList.remove("active");
  navTodolistBtn.classList.remove("active");
});

navTodolistBtn.addEventListener("click", () => {
  hideAllSections();
  todolistDiv.style.display = "flex";
  navTodolistBtn.classList.add("active");
  navGamesBtn.classList.remove("active");
  navNotepadBtn.classList.remove("active");
});

// Display Notepad section by default on page load
window.addEventListener("DOMContentLoaded", () => {
  notepadDiv.style.display = "flex";
  navNotepadBtn.classList.add("active");
});

const listSelector = document.getElementById("listSelector");
const taskList = document.querySelector("#todolist ul");
const saveBtn = document.getElementById("saveBtn");
const addListBtn = document.getElementById("addListBtn");

// Object to hold all lists
let lists = JSON.parse(localStorage.getItem("toDoLists")) || {};
let currentList = "";

// Function to update the list selector dropdown
function updateListSelector() {
  listSelector.innerHTML = ""; // Clear existing options
  for (let listName in lists) {
    let option = document.createElement("option");
    option.value = listName;
    option.textContent = listName;
    listSelector.appendChild(option);
  }
}

// Function to display the selected list
function displayList(listName) {
  const tasks = lists[listName] || [];
  taskList.innerHTML = tasks
    .map((task) => `<li contenteditable="true">${task}</li>`)
    .join("");
  currentList = listName;
}

// Event handler for switching between lists
listSelector.addEventListener("change", (e) => {
  saveCurrentList(); // Save current list before switching
  const selectedList = e.target.value;
  displayList(selectedList); // Display the selected list
});

// Save the current list into localStorage
function saveCurrentList() {
  if (!currentList) return; // Don't save if no list is selected
  const taskElements = taskList.querySelectorAll("li");
  const tasks = Array.from(taskElements)
    .map((taskEl) => taskEl.textContent.trim()) // Get task text
    .filter((task) => task.length > 0); // Exclude empty tasks
  lists[currentList] = tasks; // Update tasks for the current list

  localStorage.setItem("toDoLists", JSON.stringify(lists)); // Save all lists to localStorage
}

// Event handler for saving the current list manually
saveBtn.addEventListener("click", () => {
  saveCurrentList();
  alert("List saved!");
});

// Event handler for adding a new list
addListBtn.addEventListener("click", () => {
  const newListName = prompt("Enter a name for the new list:");
  if (newListName && !lists[newListName]) {
    lists[newListName] = []; // Create a new empty list
    updateListSelector();
    listSelector.value = newListName;
    taskList.innerHTML = ""; // Clear task list
    currentList = newListName; // Set current list to the new one
  } else {
    alert("List name already exists or is invalid.");
  }
});

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
  updateListSelector();

  const lastSelectedList = localStorage.getItem("lastSelectedList");
  if (lastSelectedList && lists[lastSelectedList]) {
    listSelector.value = lastSelectedList; // Set dropdown to the last selected list
    displayList(lastSelectedList); // Display the last selected list
  } else if (listSelector.options.length > 0) {
    listSelector.selectedIndex = 0; // Default to the first list if any exists
    displayList(listSelector.value); // Display the first list
  }
}

// Save the current list when switching sections or when the page is about to unload
window.addEventListener("beforeunload", saveCurrentList);
listSelector.addEventListener("change", (e) => {
  localStorage.setItem("lastSelectedList", e.target.value); // Save the selected list in localStorage
});

// Initialize the app on page load
window.addEventListener("DOMContentLoaded", init);
