// Supabase setup
const SUPABASE_URL = "https://kghafvoigkbcnpsikeow.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtnaGFmdm9pZ2tiY25wc2lrZW93Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA0ODI4OTIsImV4cCI6MjA3NjA1ODg5Mn0.F-b888j82DAx-IIkQacyQnJS1eBXnZdYVL8y_AI50DI";
const client = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// --- Custom Role Dropdown ---
const roleDropdown = document.querySelector('.role-dropdown');
const selected = roleDropdown.querySelector('.selected');
const options = roleDropdown.querySelectorAll('.options li');
let selectedRole = '';

roleDropdown.addEventListener('click', () => {
  roleDropdown.classList.toggle('active');
});

options.forEach(option => {
  option.addEventListener('click', () => {
    selected.textContent = option.textContent;
    selectedRole = option.getAttribute('data-value');
    roleDropdown.classList.remove('active');
  });
});

// Close dropdown if clicked outside
document.addEventListener('click', (e) => {
  if (!roleDropdown.contains(e.target)) {
    roleDropdown.classList.remove('active');
  }
});

// --- Signup Function ---
async function signUpUser() {
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();
  const fullName = document.getElementById('fullname').value.trim();
  const role = selectedRole;

  // Basic validation
  if (!email || !password || !fullName || !role) {
    alert("⚠️ Please fill in all fields and select a role.");
    return;
  }

  try {
    const { data, error } = await client.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          role: role
        },
      },
    });

    if (error) {
      alert("❌ " + error.message);
      return;
    }

    alert("✅ Signup successful! Please check your email to verify.");
    window.location.href = "login.html";
  } catch (err) {
    console.error(err);
    alert("❌ Something went wrong. Please try again later.");
  }
}
