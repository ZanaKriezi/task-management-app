const authBtn = document.getElementById("auth-btn");
const todoListContainer = document.getElementById("todo-list-container");

export function checkLoginStatus() {
  const loggedIn = localStorage.getItem("loggedIn") === "true";

  if (loggedIn) {
  authBtn.textContent = "Logout";
  console.log("User is logged in.");
} else {
  authBtn.textContent = "Login";
  console.log("User is not logged in.");
}

}

export function handleAuthButtonClick() {
  authBtn.addEventListener("click", () => {
    const loggedIn = localStorage.getItem("loggedIn") === "true";

    if (loggedIn) {
      localStorage.removeItem("loggedIn");
      authBtn.textContent = "Login";
      todoListContainer.style.display = "none";
      window.location.href = "login.html";
      console.log("User logged out.");
    } else {
      window.location.href = "login.html";
      console.log("Redirecting to login page.");
    }
  });
}
