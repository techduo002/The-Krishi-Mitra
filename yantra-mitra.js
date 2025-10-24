document.addEventListener("DOMContentLoaded", async () => {
  /* ------------------------
     YantraMitra JS - Supabase v2
     ------------------------ */

  // ---------- Supabase config ----------
  const SUPABASE_URL = "https://kghafvoigkbcnpsikeow.supabase.co";
  const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtnaGFmdm9pZ2tiY25wc2lrZW93Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA0ODI4OTIsImV4cCI6MjA3NjA1ODg5Mn0.F-b888j82DAx-IIkQacyQnJS1eBXnZdYVL8y_AI50DI";

  const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  console.log("✅ Supabase initialized:", supabase);

          // Smooth scrolling for navigation
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 100,
                        behavior: 'smooth'
                    });
                }
            });
        });
        
        // Navbar background change on scroll
        const navbar = document.getElementById('navbar');
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                navbar.querySelector('.glass').style.background = 'rgba(255, 255, 255, 0.95)';
            } else {
                navbar.querySelector('.glass').style.background = 'rgba(255, 255, 255, 0.85)';
            }
        });

  // ---------- DOM references ----------
  const rentalForm = document.getElementById("rentalForm");
  const requestForm = document.getElementById("requestForm");
  const listingContainer = document.getElementById("listingContainer");
  const requestContainer = document.getElementById("requestContainer");
  const offerSection = document.getElementById("offerSection");
  const requestSection = document.getElementById("requestSection");
  const showOfferBtn = document.getElementById("showOfferBtn");
  const showRequestBtn = document.getElementById("showRequestBtn");

  const DEFAULT_IMAGE = "https://via.placeholder.com/400x280?text=Equipment";

  // ---------- UI helpers ----------
  function showOfferForm() {
    offerSection.classList.remove("hidden");
    requestSection.classList.add("hidden");
    showOfferBtn.classList.add("active");
    showRequestBtn.classList.remove("active");
  }

  function showRequestForm() {
    requestSection.classList.remove("hidden");
    offerSection.classList.add("hidden");
    showRequestBtn.classList.add("active");
    showOfferBtn.classList.remove("active");
  }

  showOfferBtn.addEventListener("click", showOfferForm);
  showRequestBtn.addEventListener("click", showRequestForm);

  // ---------- Create cards ----------
  function createListingCard(item) {
    const div = document.createElement("div");
    div.className = "card";

    const img = document.createElement("img");
    img.src = item.image_url || DEFAULT_IMAGE;
    img.alt = item.equipment_name;
    img.style = "width:100%; border-radius:8px; margin-bottom:10px; object-fit:cover; max-height:150px;";

    const title = document.createElement("div");
    title.className = "card-title";
    title.textContent = item.equipment_name;

    const owner = document.createElement("p");
    owner.innerHTML = `<strong>Owner:</strong> ${item.owner_name}`;

    const price = document.createElement("p");
    price.innerHTML = `<strong>Price:</strong> ₹${item.price_per_day} / day`;

    const loc = document.createElement("p");
    loc.innerHTML = `<strong>Location:</strong> ${item.location}`;

    const contact = document.createElement("p");
    contact.innerHTML = `<strong>Contact:</strong> ${item.contact_number}`;

    const meta = document.createElement("div");
    meta.className = "card-meta";
    const contactBtn = document.createElement("button");
    contactBtn.className = "contact-btn";
    contactBtn.textContent = "Contact";
    contactBtn.addEventListener("click", () => {
      navigator.clipboard.writeText(item.contact_number).then(() => {
        alert(`Contact number ${item.contact_number} copied to clipboard.`);
      }).catch(() => {
        alert(`Contact: ${item.contact_number}`);
      });
    });
    meta.appendChild(contactBtn);

    div.appendChild(img);
    div.appendChild(title);
    div.appendChild(owner);
    div.appendChild(price);
    div.appendChild(loc);
    div.appendChild(contact);
    div.appendChild(meta);

    return div;
  }

  function createRequestCard(r) {
    const div = document.createElement("div");
    div.className = "card";

    const title = document.createElement("div");
    title.className = "card-title";
    title.textContent = r.requested_equipment;

    const farmer = document.createElement("p");
    farmer.innerHTML = `<strong>Farmer:</strong> ${r.farmer_name}`;

    const duration = document.createElement("p");
    duration.innerHTML = `<strong>Duration:</strong> ${r.duration_days || "N/A"} days`;

    const loc = document.createElement("p");
    loc.innerHTML = `<strong>Location:</strong> ${r.location}`;

    const contact = document.createElement("p");
    contact.innerHTML = `<strong>Contact:</strong> ${r.contact}`;

    const notes = r.notes ? `<p><strong>Notes:</strong> ${r.notes}</p>` : "";

    const meta = document.createElement("div");
    meta.className = "card-meta";
    const contactBtn = document.createElement("button");
    contactBtn.className = "contact-btn";
    contactBtn.textContent = "Contact";
    contactBtn.addEventListener("click", () => {
      navigator.clipboard.writeText(r.contact).then(() => {
        alert(`Contact number ${r.contact} copied to clipboard.`);
      }).catch(() => {
        alert(`Contact: ${r.contact}`);
      });
    });
    meta.appendChild(contactBtn);

    div.appendChild(title);
    div.appendChild(farmer);
    div.appendChild(duration);
    div.appendChild(loc);
    div.appendChild(contact);
    div.insertAdjacentHTML("beforeend", notes);
    div.appendChild(meta);

    return div;
  }

  // ---------- Load listings / requests ----------
  async function loadAvailableEquipment() {
    const { data, error } = await supabase
      .from("rental_listings")
      .select("*")
      .eq("status", "available")
      .order("created_at", { ascending: false });

    listingContainer.innerHTML = "";

    if (error) {
      console.error(error);
      listingContainer.innerHTML = "<p>Unable to load listings.</p>";
      return;
    }

    if (!data.length) {
      listingContainer.innerHTML = "<p>No available equipment.</p>";
      return;
    }

    data.forEach(item => listingContainer.appendChild(createListingCard(item)));
  }

  async function loadEquipmentRequests() {
    const { data, error } = await supabase
      .from("rental_requests")
      .select("*")
      .order("created_at", { ascending: false });

    requestContainer.innerHTML = "";

    if (error) {
      console.error(error);
      requestContainer.innerHTML = "<p>Unable to load requests.</p>";
      return;
    }

    if (!data.length) {
      requestContainer.innerHTML = "<p>No requests yet.</p>";
      return;
    }

    data.forEach(r => requestContainer.appendChild(createRequestCard(r)));
  }

  // ---------- Form submissions ----------
  rentalForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const payload = {
      owner_name: document.getElementById("owner_name").value.trim(),
      contact_number: document.getElementById("contact_number").value.trim(),
      equipment_name: document.getElementById("equipment_name").value.trim(),
      price_per_day: Number(document.getElementById("price_per_day").value) || 0,
      location: document.getElementById("location").value.trim(),
      image_url: document.getElementById("image_url").value.trim() || DEFAULT_IMAGE,
      status: "available"  // mark as available
    };
    if (!payload.owner_name || !payload.contact_number || !payload.equipment_name) {
      alert("Please fill required fields.");
      return;
    }

    const submitBtn = rentalForm.querySelector("button[type='submit']");
    submitBtn.disabled = true;
    submitBtn.textContent = "Posting...";

    const { data, error } = await supabase.from("rental_listings").insert([payload]);

    if (error) {
      console.error(error);
      alert("Failed to post listing: " + error.message);
    } else {
      rentalForm.reset();
      alert("Listing posted successfully.");
      await loadAvailableEquipment();
    }

    submitBtn.disabled = false;
    submitBtn.textContent = "Post Listing";
  });

  requestForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const payload = {
      farmer_name: document.getElementById("farmer_name").value.trim(),
      req_contact: document.getElementById("req_contact").value.trim(),
      requested_equipment: document.getElementById("requested_equipment").value.trim(),
      req_location: document.getElementById("req_location").value.trim(),
      duration_days: Number(document.getElementById("duration_days").value) || null,
      notes: document.getElementById("notes").value.trim() || null
    };
    if (!payload.farmer_name || !payload.req_contact || !payload.requested_equipment) {
      alert("Please fill required fields.");
      return;
    }

    const submitBtn = requestForm.querySelector("button[type='submit']");
    submitBtn.disabled = true;
    submitBtn.textContent = "Submitting...";

    const { data, error } = await supabase.from("rental_requests").insert([payload]);

    if (error) {
      console.error(error);
      alert("Failed to submit request: " + error.message);
    } else {
      requestForm.reset();
      alert("Request submitted.");
      await loadEquipmentRequests();
    }

    submitBtn.disabled = false;
    submitBtn.textContent = "Submit Request";
  });

  // ---------- Initialize ----------
  showOfferForm();  // default view
  await loadAvailableEquipment();
  await loadEquipmentRequests();
});
