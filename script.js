const SUPABASE_URL = "https://dzkdcrpcltqfatmazlpt.supabase.co";
const SUPABASE_KEY = "sb_publishable_FXv-e1b3nPaAXjJqGQeRoQ_eaqyK9vf";
const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);
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
// Real account registration
signupForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const username = document.getElementById("username").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  message.textContent = "Creating your account...";

  const { data, error } = await supabaseClient.auth.signUp({
    email,
    password,
    options: {
      data: { username }
    }
  });
console.log("SIGNUP RESULT:", { data, error });
  if (error) {
    message.textContent = error.message;
    return;
  }

  message.textContent = data.session
    ? "Account created successfully! Welcome to ChatVault."
    : "Account created! Check your email to confirm your account.";
});
 
 // Real login
loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value;

  message.textContent = "Logging in...";

  const { data, error } = await supabaseClient.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    message.textContent = error.message;
    return;
  }

  message.textContent = "Welcome back to ChatVault!";

window.location.href = "friends.html";
});
