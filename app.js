
const navItems = document.querySelectorAll(".nav-item");
const sections = document.querySelectorAll(".app-section");
const pageTitle = document.getElementById("pageTitle");

navItems.forEach((button) => {
  button.addEventListener("click", () => {
    const selectedTab = button.dataset.tab;

    // Hide all sections
    sections.forEach((section) => {
      section.classList.remove("active");
    });

    // Remove active style from all buttons
    navItems.forEach((item) => {
      item.classList.remove("active");
    });

    // Open selected section
    document.getElementById(selectedTab).classList.add("active");
    button.classList.add("active");

    // Update page heading
    pageTitle.textContent = button.textContent.trim().replace(/^[^\w]+/, "");
  });
});

// Theme switching
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

  localStorage.setItem("chatvault-theme", dark ? "dark" : "light");
});
