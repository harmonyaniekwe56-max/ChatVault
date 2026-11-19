
const themeToggle = document.getElementById("themeToggle");
const signupTab = document.getElementById("signupTab");
const loginTab = document.getElementById("loginTab");
const signupForm = document.getElementById("signupForm");
const loginForm = document.getElementById("loginForm");
const message = document.getElementById("message");

// Theme switching
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");

  const isDark = document.body.classList.contains("dark");
  themeToggle.textContent = isDark ? "☀️" : "🌙";

  localStorage.setItem("chatvault-theme", isDark ? "dark" : "light");
});

// Load saved theme
const savedTheme = localStorage.getItem("chatvault-theme");

if (savedTheme === "dark") {
  document.body.classList.add("dark");
  themeToggle.textContent = "☀️";
} else {
  themeToggle.textContent = "🌙";
}

// Switch to registration
signupTab.addEventListener("click", () => {
  signupForm.hidden = false;
  loginForm.hidden = true;

  signupTab.classList.add("active");
  loginTab.classList.remove("active");

  message.textContent = "";
});

// Switch to login
loginTab.addEventListener("click", () => {
  signupForm.hidden = true;
  loginForm.hidden = false;

  loginTab.classList.add("active");
  signupTab.classList.remove("active");

  message.textContent = "";
});

// Temporary form handling
signupForm.addEventListener("submit", (event) => {
  event.preventDefault();

  message.textContent =
    "Your registration form is ready! Account creation will be connected next.";
});

loginForm.addEventListener("submit", (event) => {
  event.preventDefault();

  message.textContent =
    "Your login form is ready! Login will be connected next.";
});
