// ✅ Initialize Supabase client
const SUPABASE_URL = "https://kghafvoigkbcnpsikeow.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtnaGFmdm9pZ2tiY25wc2lrZW93Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA0ODI4OTIsImV4cCI6MjA3NjA1ODg5Mn0.F-b888j82DAx-IIkQacyQnJS1eBXnZdYVL8y_AI50DI"; // Replace with your key
const client = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// ✅ Redirect helper
function redirectToLogin() {
  window.location.href = "login.html";
}

// ✅ Update greeting
function updateUserUI(user) {
  const name = user?.user_metadata?.full_name || "Farmer";
  document.getElementById("userName").textContent = `Hello, ${name}!`;
}

// ✅ Auth session persistence
(async () => {
  try {
    const { data, error } = await client.auth.getSession();
    if (error || !data.session?.user) {
      redirectToLogin();
      return;
    }

    const user = data.session.user;
    updateUserUI(user);

    client.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT" || !session) redirectToLogin();
    });
  } catch (err) {
    console.error("Auth error:", err);
    redirectToLogin();
  }
})();

// ✅ Logout button
const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
  logoutBtn.addEventListener("click", async () => {
    await client.auth.signOut();
    redirectToLogin();
  });
}

// ✅ Sidebar toggle
const sidebar = document.getElementById("sidebar");
const toggleBtn = document.getElementById("toggleSidebar");

if (toggleBtn && sidebar) {
  toggleBtn.addEventListener("click", () => {
    sidebar.classList.toggle("collapsed");
    feather.replace();
  });
}

// ✅ Feather icons
feather.replace();

// ✅ Fade-in cards
const featureCards = document.querySelectorAll(".feature-card");

function fadeInOnScroll() {
  featureCards.forEach((card) => {
    const rect = card.getBoundingClientRect();
    if (rect.top < window.innerHeight - 100) {
      card.classList.add("visible");
    }
  });
}

window.addEventListener("scroll", fadeInOnScroll);
window.addEventListener("load", fadeInOnScroll);
