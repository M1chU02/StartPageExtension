// script/user.js – handles authentication and greeting for the StartPageExtension.
// Requires the Firebase Compat SDK (firebase-app-compat.js, firebase-auth-compat.js) and the
// firebase-init.js script to be loaded before this file.

document.addEventListener("DOMContentLoaded", () => {
  // ---------- Greeting based on time of day ----------
  const greetingsHeader = document.getElementById("greetingsheader");
  function getGreeting() {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return "Good Morning!";
    if (hour >= 12 && hour < 17) return "Good Afternoon!";
    return "Good Evening!";
  }
  greetingsHeader.textContent = getGreeting();

  // ---------- Authentication UI ----------
  const nameHeader = document.getElementById("nameheader");

  // Insert a simple modal for sign‑in / register.
  const authModalHtml = `
    <div id="auth-modal" style="display:none; position:fixed; inset:0; background:#0008; align-items:center; justify-content:center; z-index:9999;">
      <div style="background:#fff; padding:1rem; border-radius:0.5rem; max-width:320px; width:100%; box-sizing:border-box;">
        <h3>Sign In</h3>
        <form id="auth-form">
          <button type="button" id="auth-close-button" style="float:right; background:none; border:none; font-size:1.2rem;">&times;</button>
          <label for="auth-email">Email</label>
          <input id="auth-email" type="email" required autocomplete="off" style="width:100%; margin-bottom:0.5rem;"/>
          <label for="auth-password">Password</label>
          <input id="auth-password" type="password" required autocomplete="off" style="width:100%; margin-bottom:0.5rem;"/>
          <div style="margin-top:0.5rem; display:flex; gap:0.5rem;">
            <button type="submit" id="auth-signin">Sign In</button>
            <button type="button" id="auth-register">Register</button>
          </div>
          <p id="auth-message" style="color:red; margin-top:0.5rem;"></p>
        </form>
        <button type="button" id="auth-guest" style="margin-top:0.5rem; width:100%;">Continue as Guest</button>
      </div>
    </div>`;

  // Append modal to body.
  const modalContainer = document.createElement("div");
  modalContainer.innerHTML = authModalHtml;
  document.body.appendChild(modalContainer);

  const authModal = document.getElementById("auth-modal");
  const authMessage = document.getElementById("auth-message");

  function showAuthModal() {
  authModal.style.display = "flex";
}
// Expose showAuthModal globally so other scripts (e.g., settings) can open it.
window.showAuthModal = showAuthModal;
  function hideAuthModal() {
    authModal.style.display = "none";
    authMessage.textContent = "";
    document.getElementById("auth-form").reset();
  }

  document.getElementById("auth-close-button").addEventListener("click", hideAuthModal);
document.getElementById("auth-guest").addEventListener("click", () => {
  // Guest mode: set flag and hide modal.
  localStorage.setItem('guestMode', 'true');
  hideAuthModal();
    // If no name set yet, use stored username.
    if (!nameHeader.textContent) {
      const storedUserName = localStorage.getItem('userName');
      if (storedUserName) {
        nameHeader.textContent = `Hey ${storedUserName}, `;
      }
    }
});

  // Sign‑in flow.
  document.getElementById("auth-form").addEventListener("submit", e => {
    e.preventDefault();
    const email = document.getElementById("auth-email").value.trim();
    const password = document.getElementById("auth-password").value;
    firebase.auth().signInWithEmailAndPassword(email, password)
      .then(() => {
        // Successful sign‑in – clear any guest flag.
        localStorage.removeItem('guestMode');
      })
      .catch(err => { authMessage.textContent = err.message; });
  });

  // Register flow.
  document.getElementById("auth-register").addEventListener("click", () => {
    const email = document.getElementById("auth-email").value.trim();
    const password = document.getElementById("auth-password").value;
    firebase.auth().createUserWithEmailAndPassword(email, password)
      .then(cred => cred.user.updateProfile({ displayName: email.split("@")[0] }))
      .then(() => {
        // Successful registration – clear guest flag.
        localStorage.removeItem('guestMode');
      })
      .catch(err => { authMessage.textContent = err.message; });
  });

  // Sign‑out helper – a button will be injected when the user is logged in.
  function addSignOutButton() {
  if (document.getElementById("signoutBtn")) return; // already added
  const btn = document.createElement("button");
  btn.id = "signoutBtn";
  btn.textContent = "Sign Out";
  btn.style.marginLeft = "8px";
  btn.addEventListener("click", () => {
    firebase.auth().signOut().then(() => {
      // After signing out, stay in guest mode.
      localStorage.setItem('guestMode', 'true');
    });
  });
  nameHeader.appendChild(btn);
}

  // Listen for auth state changes.
  firebase.auth().onAuthStateChanged(user => {
  if (user) {
    const display = user.displayName || user.email.split("@")[0];
    nameHeader.textContent = `Hey ${display}, `;
    hideAuthModal();
    // If no name set yet, use stored username.
    if (!nameHeader.textContent) {
      const storedUserName = localStorage.getItem('userName');
      if (storedUserName) {
        nameHeader.textContent = `Hey ${storedUserName}, `;
      }
    }
    // Ensure we clear guest mode when a real user signs in.
    localStorage.removeItem('guestMode');
    addSignOutButton();
  } else {
    nameHeader.textContent = "";
    // Guest mode: ensure modal is hidden.
    hideAuthModal();
    // If no name set yet, use stored username.
    if (!nameHeader.textContent) {
      const storedUserName = localStorage.getItem('userName');
      if (storedUserName) {
        nameHeader.textContent = `Hey ${storedUserName}, `;
      }
    }
    // remove any existing sign‑out button
    const existingBtn = document.getElementById("signoutBtn");
    if (existingBtn) existingBtn.remove();
    // Ensure guest mode flag is set.
    localStorage.setItem('guestMode', 'true');
  }
});
});
