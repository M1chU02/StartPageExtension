document.addEventListener("DOMContentLoaded", function () {
  const storedName = localStorage.getItem("userName");

  if (storedName) {
    document.getElementById("nameheader").innerHTML =
      "Hey " + storedName + ", ";
  } else {
    const userNameModal = document.createElement("div");
    userNameModal.id = "username-modal";
    userNameModal.innerHTML = `
                    <div id="username-form-container">
                        <form id="username-form">
                            <button id="username-close-button">&times;</button>
                            <label for="username-input">Enter your username: </label>
                            <input id="username-input" type="text" required autocomplete="off" />
                            <button type="submit" id="username-submit-button">Submit</button>
                        </form>
                    </div>`;
    document.getElementById("nameheader").appendChild(userNameModal);

    const usernameform = document.getElementById("username-form");
    usernameform.addEventListener("submit", function (e) {
      e.preventDefault();
      const userName = document.getElementById("username-input").value;

      if (userName) {
        localStorage.setItem("userName", userName);
        userNameModal.style.display = "none";
        location.reload();
      } else {
        const errorMessage = document.createElement("div");
        errorMessage.textContent = "You didn't enter a name.";
        userNameModal.appendChild(errorMessage);
      }
    });
    userNameModal.style.display = "flex";
  }

  const greetingsheader = document.getElementById("greetingsheader");
  function getGreeting() {
    const currentHour = new Date().getHours();

    if (currentHour >= 5 && currentHour < 12) {
      return "Good Morning!";
    } else if (currentHour >= 12 && currentHour < 17) {
      return "Good Afternoon!";
    } else {
      return "Good Evening!";
    }
  }

  const greeting = getGreeting();
  greetingsheader.innerHTML = greeting;
});
