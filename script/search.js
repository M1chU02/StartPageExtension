const searchform = document.getElementById("searchform");

window.addEventListener("load", () => {
  document.getElementById("searchinput").focus();
});

searchform.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    let searchinput = document.getElementById("searchinput").value;
    if (searchinput != "") {
      search(searchinput);
    }
  }
});

function search(searchinput) {
  let searchinputfield = document.getElementById("searchinput");
  searchinputfield.value = "";
  location = `https://www.google.com/search?q=${searchinput}&safe=active`;
}
