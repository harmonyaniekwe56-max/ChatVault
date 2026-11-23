
const SUPABASE_URL = "https://dzkdcrpcltqfatmazlpt.supabase.co";
const SUPABASE_KEY = "PASTE_YOUR_PUBLISHABLE_KEY_HERE";

const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);

// Navigation
const navItems = document.querySelectorAll(".nav-item");
const sections = document.querySelectorAll(".app-section");
const pageTitle = document.getElementById("pageTitle");

navItems.forEach((button) => {
  button.addEventListener("click", () => {
    const selectedTab = button.dataset.tab;

    sections.forEach((section) =>
      section.classList.remove("active")
    );

    navItems.forEach((item) =>
      item.classList.remove("active")
    );

    document.getElementById(selectedTab).classList.add("active");
    button.classList.add("active");

    pageTitle.textContent =
      button.textContent.trim().replace(/^[^\w]+/, "");
  });
});

// Theme
const themeToggle = document.getElementById("appThemeToggle");
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

// Load logged-in user
async function loadApp() {
  const { data: { session }, error } =
    await supabaseClient.auth.getSession();

  if (error || !session) {
    window.location.href = "index.html";
    return;
  }

  const { data: profile, error: profileError } =
    await supabaseClient
      .from("profiles")
      .select("username, display_name")
      .eq("id", session.user.id)
      .single();

  if (profileError) {
    console.error("Profile error:", profileError.message);
  }

  const username = profile?.username || "New user";
  const displayName = profile?.display_name || username;

  document.getElementById("sidebarName").textContent =
    displayName;

  document.getElementById("sidebarUsername").textContent =
    "@" + username;

  document.getElementById("sidebarAvatar").textContent =
    displayName.charAt(0).toUpperCase();
}

// Log out
document.getElementById("logoutButton").addEventListener(
  "click",
  async () => {
    const { error } = await supabaseClient.auth.signOut();

    if (error) {
      alert(error.message);
      return;
    }

    window.location.href = "index.html";
  }
);

loadApp();

