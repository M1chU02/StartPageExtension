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
const saveBtn = document.getElementById("saveBtn");
const addListBtn = document.getElementById("addListBtn");

// Object to hold all lists
let lists = JSON.parse(localStorage.getItem("toDoLists")) || {};

// Function to update the list selector dropdown
function updateListSelector() {
  listSelector.innerHTML = "";
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
  todolistDiv.innerHTML = `<ul>${tasks
    .map((task) => `<li>${task}</li>`)
    .join("")}</ul>`;
}

// Event handler for switching between lists
listSelector.addEventListener("change", (e) => {
  const selectedList = e.target.value;
  displayList(selectedList);
});

// Event handler for saving the current list to localStorage
saveBtn.addEventListener("click", () => {
  const selectedList = listSelector.value;
  if (!selectedList) return;

  const taskElements = todolistDiv.querySelectorAll("li");
  const tasks = Array.from(taskElements).map((taskEl) => taskEl.textContent);
  lists[selectedList] = tasks;

  localStorage.setItem("toDoLists", JSON.stringify(lists));
  alert("List saved!");
});

// Event handler for adding a new list
addListBtn.addEventListener("click", () => {
  const newListName = prompt("Enter a name for the new list:");
  if (newListName && !lists[newListName]) {
    lists[newListName] = [];
    updateListSelector();
    listSelector.value = newListName;
    todolistDiv.innerHTML = "<ul></ul>";
  } else {
    alert("List name already exists or is invalid.");
  }
});

// Initialize the list selector with any stored lists
updateListSelector();
if (listSelector.options.length > 0) {
  listSelector.selectedIndex = 0;
  displayList(listSelector.value);
}
