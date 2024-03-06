const placeholder = document
  .getElementById("notepadarea")
  .getAttribute("data-placeholder");

const notepadboldbtn = document.getElementById("notepadboldbtn");
const notepaditalicbtn = document.getElementById("notepaditalicbtn");
const notepadunderlinebtn = document.getElementById("notepadunderlinebtn");
const fontSize = document.getElementById("fontSize");
const notepadlistbtn = document.getElementById("notepadlistbtn");
const notepadcheckbtn = document.getElementById("notepadcheckbtn");

notepadboldbtn.addEventListener("click", makeBold);
notepaditalicbtn.addEventListener("click", makeItalic);
notepadunderlinebtn.addEventListener("click", makeUnderline);
fontSize.addEventListener("change", () => {
  var selectedValue = this.value;
  changeFontSize(selectedValue);
});
notepadlistbtn.addEventListener("click", addList);
notepadcheckbtn.addEventListener("click", addCheckbox);

const notepadArea = document.getElementById("notepadarea");
notepadArea.addEventListener("input", handleInput);

function handleInput() {
  const content = notepadarea.innerHTML;
  if (content === "") {
    notepadarea.innerHTML = `<div class="placeholder">${placeholder}</div>`;
  } else if (content === placeholder) {
    notepadarea.innerHTML = "";
  }
}

function execCommandWithDefault(command, value = null) {
  document.execCommand(command, false, value);
  notepadarea.focus();
}

function makeBold() {
  execCommandWithDefault("bold");
}

function makeItalic() {
  execCommandWithDefault("italic");
}

function makeUnderline() {
  execCommandWithDefault("underline");
}

function addList() {
  execCommandWithDefault("insertUnorderedList");
}

function addCheckbox() {
  const checkbox = document.createElement("input");
  checkbox.setAttribute("type", "checkbox");
  notepadarea.appendChild(checkbox);
  notepadarea.focus();
}

function changeFontSize(fontSize) {
  const selectedText = getSelectedText();
  if (selectedText) {
    const span = document.createElement("span");
    span.style.fontSize = fontSize;
    span.appendChild(selectedText.cloneContents());
    execCommandWithDefault("insertHTML", span.outerHTML);
  }
}

function getSelectedText() {
  const selection = window.getSelection();
  if (selection.rangeCount > 0) {
    const range = selection.getRangeAt(0);
    return range;
  }
  return null;
}

handleInput();
