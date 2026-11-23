
const SUPABASE_URL = "https://dzkdcrpcltqfatmazlpt.supabase.co";
const SUPABASE_KEY = "sb_publishable_FXv-e1b3nPaAXjJqGQeRoQ_eaqyK9vf";

const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);

const profileName = document.getElementById("profileName");
const profileUsername = document.getElementById("profileUsername");
const profileAvatar = document.getElementById("profileAvatar");
const dashboardMessage = document.getElementById("dashboardMessage");

// Check logged-in user
async function loadDashboard() {
  const { data: { session }, error } =
    await supabaseClient.auth.getSession();

  if (error || !session) {
    window.location.href = "index.html";
    return;
  }

  const user = session.user;

  const { data: profile, error: profileError } =
    await supabaseClient
      .from("profiles")
      .select("username")
      .eq("id", user.id)
      .single();

  if (profileError) {
    dashboardMessage.textContent = "Could not load your profile.";
    return;
  }

  const username = profile.username || "New user";

  profileName.textContent =
    user.user_metadata?.display_name || username;

  profileUsername.textContent = "@" + username;
  profileAvatar.textContent = username.charAt(0).toUpperCase();
}

// Theme switching
const themeToggle = document.getElementById("dashboardTheme");

const savedTheme = localStorage.getItem("chatvault-theme");

if (savedTheme === "dark") {
  document.body.classList.add("dark");
}

themeToggle.textContent =
  document.body.classList.contains("dark") ? "☀️" : "🌙";

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");

  const dark = document.body.classList.contains("dark");

  themeToggle.textContent = dark ? "☀️" : "🌙";

  localStorage.setItem(
    "chatvault-theme",
    dark ? "dark" : "light"
  );
});

// Profile settings
document.getElementById("editProfile").addEventListener("click", () => {
  window.location.href = "settings.html";
});

// Log out
document.getElementById("logoutButton").addEventListener("click", async () => {
  const { error } = await supabaseClient.auth.signOut();

  if (error) {
    dashboardMessage.textContent = error.message;
    return;
  }

  window.location.href = "index.html";
});

loadDashboard();
