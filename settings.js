
const SUPABASE_URL = "https://dzkdcrpcltqfatmazlpt.supabase.co";
const SUPABASE_KEY = "sb_publishable_FXv-e1b3nPaAXjJqGQeRoQ_eaqyK9vf";

const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);

const profileForm = document.getElementById("profileForm");
const passwordForm = document.getElementById("passwordForm");

async function loadSettings() {
  const { data: { session } } =
    await supabaseClient.auth.getSession();

  if (!session) {
    window.location.href = "index.html";
    return;
  }

  const { data: profile, error } = await supabaseClient
    .from("profiles")
    .select("username, display_name")
    .eq("id", session.user.id)
    .single();

  if (error) {
    document.getElementById("profileMessage").textContent =
      "Could not load your profile.";
    return;
  }

  document.getElementById("username").value =
    profile.username || "";

  document.getElementById("displayName").value =
    profile.display_name || "";
}

profileForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const { data: { session } } =
    await supabaseClient.auth.getSession();

  if (!session) return;

  const username = document.getElementById("username").value.trim();
  const displayName = document.getElementById("displayName").value.trim();
  const message = document.getElementById("profileMessage");

  if (!username || !displayName) {
    message.textContent = "Please fill in both fields.";
    return;
  }

  message.textContent = "Saving...";

  const { error } = await supabaseClient
    .from("profiles")
    .update({
      username,
      display_name: displayName
    })
    .eq("id", session.user.id);

  message.textContent = error
    ? error.message
    : "Profile updated successfully!";
});

passwordForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const newPassword = document.getElementById("newPassword").value;
  const message = document.getElementById("passwordMessage");

  if (newPassword.length < 8) {
    message.textContent = "Password must be at least 8 characters.";
    return;
  }

  message.textContent = "Updating password...";

  const { error } = await supabaseClient.auth.updateUser({
    password: newPassword
  });

  message.textContent = error
    ? error.message
    : "Password updated successfully!";

  if (!error) passwordForm.reset();
});

loadSettings();
