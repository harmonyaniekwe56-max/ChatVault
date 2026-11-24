
const SUPABASE_URL = "https://dzkdcrpcltqfatmazlpt.supabase.co";
const SUPABASE_KEY = "sb_publishable_FXv-e1b3nPaAXjJqGQeRoQ_eaqyK9vf";

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


const friendSearch = document.getElementById("friendSearch");
const findFriendsButton = document.getElementById("findFriendsButton");

if (friendSearch) {
  friendSearch.addEventListener("input", () => {
    const searchTerm = friendSearch.value.trim().toLowerCase();

    document.querySelectorAll(".friend-card").forEach((card) => {
      const searchableText = card.textContent.toLowerCase();

      card.style.display = searchableText.includes(searchTerm)
        ? "flex"
        : "none";
    });
  });
}

if (findFriendsButton) {
  findFriendsButton.addEventListener("click", () => {
    document.getElementById("discover").classList.add("active");

    document.querySelectorAll(".app-section").forEach((section) => {
      if (section.id !== "discover") {
        section.classList.remove("active");
      }
    });

    document.querySelectorAll(".nav-item").forEach((item) => {
      item.classList.toggle("active", item.dataset.tab === "discover");
    });

    document.getElementById("pageTitle").textContent = "Discover";
  });
}
// CHATVAULT PEOPLE SEARCH

const peopleSearchInput = document.getElementById("friendSearch");
const peopleSearchResults = document.getElementById("peopleSearchResults");

if (peopleSearchInput && peopleSearchResults) {
  let searchNumber = 0;

  peopleSearchInput.addEventListener("input", async () => {
    const term = peopleSearchInput.value.trim();
    const currentSearch = ++searchNumber;

    if (term.length < 2) {
      peopleSearchResults.textContent =
        "Type at least 2 characters to search.";
      return;
    }

    peopleSearchResults.textContent = "Searching...";

    const { data, error } = await supabaseClient.rpc(
      "search_chatvault_users",
      { search_term: term }
    );

    if (currentSearch !== searchNumber) return;

    if (error) {
      peopleSearchResults.textContent = "Could not search users.";
      console.error(error);
      return;
    }

    peopleSearchResults.replaceChildren();

    if (!data || data.length === 0) {
      peopleSearchResults.textContent = "No users found.";
      return;
    }

    data.forEach((person) => {
      const card = document.createElement("div");
      card.className = "friend-card";

      const info = document.createElement("div");
      info.className = "friend-card-info";

      const name = document.createElement("strong");
      name.textContent = person.display_name || person.username;

      const username = document.createElement("small");
      username.textContent = "@" + person.username;

      const button = document.createElement("button");
      button.className = "primary-button";
      button.textContent = "Add Friend";

      button.addEventListener("click", async () => {
        button.disabled = true;
        button.textContent = "Sending...";

        const { error: requestError } = await supabaseClient.rpc(
          "send_friend_request",
          { target_user_id: person.id }
        );

        if (requestError) {
          button.disabled = false;
          button.textContent = "Add Friend";
          alert(requestError.message);
          return;
        }

        button.textContent = "Request Sent";
      });

      info.append(name, username);
      card.append(info, button);
      peopleSearchResults.appendChild(card);
    });
  });
}
async function loadFriendRequests() {
  const requestContainer = document.getElementById("friendRequests");
  const requestCount = document.getElementById("requestCount");

  if (!requestContainer) return;

  const { data, error } = await supabaseClient.rpc(
    "get_incoming_friend_requests"
  );

  if (error) {
    console.error(error.message);
    requestContainer.textContent = "Could not load requests.";
    return;
  }

  requestCount.textContent = data.length;
  requestContainer.replaceChildren();

  if (data.length === 0) {
    requestContainer.textContent = "No new friend requests yet.";
    return;
  }

  data.forEach((request) => {
    const card = document.createElement("div");
    card.className = "friend-card";

    const info = document.createElement("div");
    info.className = "friend-card-info";

    const name = document.createElement("strong");
    name.textContent = request.display_name || request.username;

    const username = document.createElement("small");
    username.textContent = "@" + request.username;

    const accept = document.createElement("button");
    accept.className = "primary-button";
    accept.textContent = "Accept";

    accept.addEventListener("click", async () => {
      accept.disabled = true;

      const { error } = await supabaseClient.rpc(
        "respond_to_friend_request",
        {
          request_id: request.request_id,
          new_status: "accepted"
        }
      );

      if (error) {
        alert(error.message);
        accept.disabled = false;
        return;
      }

      await loadFriendRequests();
      await loadFriendsList();
    });

    const decline = document.createElement("button");
    decline.textContent = "Decline";

    decline.addEventListener("click", async () => {
      decline.disabled = true;

      const { error } = await supabaseClient.rpc(
        "respond_to_friend_request",
        {
          request_id: request.request_id,
          new_status: "declined"
        }
      );

      if (error) {
        alert(error.message);
        decline.disabled = false;
        return;
      }

      await loadFriendRequests();
    });

    info.append(name, username);
    card.append(info, accept, decline);
    requestContainer.appendChild(card);
  });
}

loadFriendRequests();
