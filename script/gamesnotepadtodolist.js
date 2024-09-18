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
});

navNotepadBtn.addEventListener("click", () => {
  hideAllSections();
  notepadDiv.style.display = "flex";
});

navTodolistBtn.addEventListener("click", () => {
  hideAllSections();
  todolistDiv.style.display = "flex";
});

// Display Notepad section by default on page load
window.addEventListener("DOMContentLoaded", () => {
  notepadDiv.style.display = "flex";
});
