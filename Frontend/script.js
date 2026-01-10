// Import Leaflet library
const L = window.L;

// API Configuration
const API_BASE_URL = "http://localhost:3000/api";

// API Helper Functions
const api = {
  async get(endpoint) {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`);
      if (!response.ok) {
        const errorText = await response.text();
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch {
          errorData = { error: errorText || `HTTP error! status: ${response.status}` };
        }
        const error = new Error(JSON.stringify(errorData));
        error.status = response.status;
        throw error;
      }
      return await response.json();
    } catch (error) {
      console.error("API GET Error:", error);
      throw error;
    }
  },

  async post(endpoint, data) {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const errorText = await response.text();
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch {
          errorData = { error: errorText || `HTTP error! status: ${response.status}` };
        }
        const error = new Error(JSON.stringify(errorData));
        error.status = response.status;
        throw error;
      }
      return await response.json();
    } catch (error) {
      console.error("API POST Error:", error);
      throw error;
    }
  },

  async put(endpoint, data) {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error("API PUT Error:", error);
      throw error;
    }
  },

  async delete(endpoint, data) {
    try {
      let url = `${API_BASE_URL}${endpoint}`;
      const options = {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      };
      
      // Si data est fourni et endpoint n'a pas déjà de query params, utiliser body
      // Sinon, les query params doivent être dans l'endpoint
      if (data && !endpoint.includes("?")) {
        options.body = JSON.stringify(data);
      }
      
      const response = await fetch(url, options);
      if (!response.ok) {
        const errorText = await response.text();
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch {
          errorData = { error: errorText || `HTTP error! status: ${response.status}` };
        }
        const error = new Error(JSON.stringify(errorData));
        error.status = response.status;
        throw error;
      }
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        return await response.json();
      }
      return { message: "Suppression réussie" };
    } catch (error) {
      console.error("API DELETE Error:", error);
      throw error;
    }
  },
};

// Data for running locations in Morocco (fallback data)
let locations = [
  {
    id: 1,
    name: "Corniche de Casablanca",
    city: "Casablanca",
    coords: [33.5927, -7.6356],
    distance: "5-10 km",
    difficulty: "Debutant",
    runners: 342,
    address: "Devant Morocco Mall, Corniche",
    isUserCreated: false,
  },
  {
    id: 2,
    name: "Foret de Maamora",
    city: "Rabat",
    coords: [34.0531, -6.7987],
    distance: "8-15 km",
    difficulty: "Intermediaire",
    runners: 256,
    address: "Entree principale de la foret",
    isUserCreated: false,
  },
  {
    id: 3,
    name: "Jardins de la Menara",
    city: "Marrakech",
    coords: [31.6225, -8.0225],
    distance: "3-5 km",
    difficulty: "Debutant",
    runners: 189,
    address: "Entree des Jardins de la Menara",
    isUserCreated: false,
  },
  {
    id: 4,
    name: "Bord de mer Agadir",
    city: "Agadir",
    coords: [30.4278, -9.5981],
    distance: "6-12 km",
    difficulty: "Debutant",
    runners: 167,
    address: "Promenade du bord de mer",
    isUserCreated: false,
  },
  {
    id: 5,
    name: "Parc de la Ligue Arabe",
    city: "Casablanca",
    coords: [33.5842, -7.6228],
    distance: "2-4 km",
    difficulty: "Debutant",
    runners: 423,
    address: "Entree principale du parc",
    isUserCreated: false,
  },
];

// Data for upcoming runs
let runs = [
  {
    id: 1,
    title: "Morning Run Corniche",
    location: "Casablanca",
    locationId: 1,
    coords: [33.5927, -7.6356],
    date: "Sam 25 Jan",
    time: "07:00",
    distance: "8 km",
    difficulty: "debutant",
    difficultyLabel: "Debutant",
    participants: 24,
    maxParticipants: 30,
    initials: ["MA", "SK", "YB", "NL"],
    description:
      "Rejoignez-nous pour une course matinale le long de la magnifique Corniche de Casablanca. Parcours plat ideal pour les debutants avec une vue imprenable sur l'ocean Atlantique. Point de rencontre devant le Morocco Mall.",
    address: "Devant Morocco Mall, Corniche",
    createdBy: null,
    participantsList: [
      { name: "Mohammed A.", avatar: "/placeholder.svg?height=40&width=40" },
      { name: "Sara K.", avatar: "/placeholder.svg?height=40&width=40" },
      { name: "Youssef B.", avatar: "/placeholder.svg?height=40&width=40" },
      { name: "Nadia L.", avatar: "/placeholder.svg?height=40&width=40" },
    ],
  },
  {
    id: 2,
    title: "Trail Maamora",
    location: "Rabat",
    locationId: 2,
    coords: [34.0531, -6.7987],
    date: "Dim 26 Jan",
    time: "08:00",
    distance: "12 km",
    difficulty: "intermediaire",
    difficultyLabel: "Intermediaire",
    participants: 18,
    maxParticipants: 25,
    initials: ["AH", "RK", "FB"],
    description:
      "Une aventure trail dans la magnifique foret de Maamora. Terrain varie avec chemins forestiers et petites collines.",
    address: "Entree principale de la foret",
    createdBy: null,
    participantsList: [
      { name: "Amine H.", avatar: "/placeholder.svg?height=40&width=40" },
      { name: "Rachid K.", avatar: "/placeholder.svg?height=40&width=40" },
    ],
  },
  {
    id: 3,
    title: "Sunset Run Menara",
    location: "Marrakech",
    locationId: 3,
    coords: [31.6225, -8.0225],
    date: "Sam 25 Jan",
    time: "17:30",
    distance: "5 km",
    difficulty: "debutant",
    difficultyLabel: "Debutant",
    participants: 32,
    maxParticipants: 40,
    initials: ["OE", "SL", "KB", "ZM"],
    description:
      "Course au coucher du soleil autour des mythiques Jardins de la Menara avec vue sur l'Atlas.",
    address: "Entree des Jardins de la Menara",
    createdBy: null,
    participantsList: [
      { name: "Omar E.", avatar: "/placeholder.svg?height=40&width=40" },
      { name: "Salma L.", avatar: "/placeholder.svg?height=40&width=40" },
    ],
  },
];

// Comments data
const commentsData = {
  1: [
    {
      id: 1,
      author: "Sara K.",
      avatar: "/placeholder.svg?height=40&width=40",
      text: "J'ai hate d'y etre ! Quelqu'un peut confirmer le point de RDV exact ?",
      time: "Il y a 2h",
    },
    {
      id: 2,
      author: "Mohammed A.",
      avatar: "/placeholder.svg?height=40&width=40",
      text: "On se retrouve devant l'entree principale du Morocco Mall.",
      time: "Il y a 1h",
    },
  ],
  2: [
    {
      id: 1,
      author: "Amine H.",
      avatar: "/placeholder.svg?height=40&width=40",
      text: "Pensez a prendre suffisamment d'eau, il fait chaud en foret.",
      time: "Il y a 5h",
    },
  ],
  3: [
    {
      id: 1,
      author: "Omar E.",
      avatar: "/placeholder.svg?height=40&width=40",
      text: "La vue sur l'Atlas au coucher du soleil est incroyable depuis la Menara !",
      time: "Il y a 1j",
    },
  ],
};

// Conversations data
const conversations = [
  {
    id: 1,
    name: "Sara K.",
    avatar: "/placeholder.svg?height=60&width=60",
    lastMessage: "A demain pour la course !",
    time: "10:30",
    unread: 2,
    online: true,
    messages: [
      {
        id: 1,
        text: "Salut ! Tu participes a la course de samedi ?",
        sent: false,
        time: "09:15",
      },
      {
        id: 2,
        text: "Oui bien sur ! J'y serai a 6h45",
        sent: true,
        time: "09:20",
      },
      {
        id: 3,
        text: "Super ! On peut se retrouver ensemble avant le depart",
        sent: false,
        time: "10:25",
      },
      { id: 4, text: "A demain pour la course !", sent: false, time: "10:30" },
    ],
  },
  {
    id: 2,
    name: "Mohammed A.",
    avatar: "/placeholder.svg?height=60&width=60",
    lastMessage: "Le parcours de dimanche etait genial",
    time: "Hier",
    unread: 0,
    online: false,
    messages: [
      {
        id: 1,
        text: "Felicitations pour ta course d'hier !",
        sent: true,
        time: "18:00",
      },
      {
        id: 2,
        text: "Merci ! Le parcours de dimanche etait genial",
        sent: false,
        time: "18:15",
      },
    ],
  },
  {
    id: 3,
    name: "Groupe Trail Rabat",
    avatar: "/placeholder.svg?height=60&width=60",
    lastMessage: "Amine: Prochaine sortie samedi 8h",
    time: "Hier",
    unread: 5,
    online: true,
    messages: [
      {
        id: 1,
        text: "Salut tout le monde ! Quelqu'un pour un trail ce weekend ?",
        sent: false,
        time: "Hier 14:00",
        author: "Rachid",
      },
      {
        id: 2,
        text: "Moi je suis dispo samedi matin",
        sent: true,
        time: "Hier 14:30",
      },
      {
        id: 3,
        text: "Prochaine sortie samedi 8h",
        sent: false,
        time: "Hier 20:00",
        author: "Amine",
      },
    ],
  },
];

// Current state
let currentUser = null;
let currentPage = "home";
let currentRunId = null;
let currentConversationId = null;
let editingRunId = null;
let map = null;
let detailMap = null;
let modalMap = null;
let userLocationMarker = null;
let userCoords = null;
const markers = [];
let isDarkMode = true;

function toggleDarkMode() {
  isDarkMode = !isDarkMode;
  document.documentElement.setAttribute(
    "data-theme",
    isDarkMode ? "dark" : "light"
  );
  localStorage.setItem("darkMode", isDarkMode);
  updateDarkModeIcon();

  // Reinitialize maps with new theme
  if (map) {
    updateMapTiles();
  }
}

function updateDarkModeIcon() {
  const icon = document.getElementById("darkModeIcon");
  if (isDarkMode) {
    icon.innerHTML =
      '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>';
  } else {
    icon.innerHTML =
      '<circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>';
  }
}

function updateMapTiles() {
  if (!map) return;

  map.eachLayer((layer) => {
    if (layer instanceof L.TileLayer) {
      map.removeLayer(layer);
    }
  });

  const tileUrl = isDarkMode
    ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
    : "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";

  L.tileLayer(tileUrl, {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>',
    subdomains: "abcd",
    maxZoom: 19,
  }).addTo(map);
}

function getUserLocation() {
  if (!navigator.geolocation) {
    alert("La geolocalisation n'est pas supportee par votre navigateur");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      userCoords = [position.coords.latitude, position.coords.longitude];

      // Update display
      const display = document.getElementById("userLocationDisplay");
      const coordsSpan = document.getElementById("userCoords");
      if (display && coordsSpan) {
        display.style.display = "inline-flex";
        coordsSpan.textContent = `${userCoords[0].toFixed(
          4
        )}, ${userCoords[1].toFixed(4)}`;
      }

      // Add marker on map
      if (map) {
        if (userLocationMarker) {
          map.removeLayer(userLocationMarker);
        }

        userLocationMarker = L.circleMarker(userCoords, {
          radius: 12,
          fillColor: "#3b82f6",
          color: "#fff",
          weight: 3,
          opacity: 1,
          fillOpacity: 0.9,
          className: "user-location-marker",
        }).addTo(map);

        userLocationMarker.bindPopup(
          "<div class='popup-content'><h4>Votre position</h4></div>"
        );

        map.flyTo(userCoords, 13, { duration: 1.5 });
      }
    },
    (error) => {
      alert("Impossible d'obtenir votre position: " + error.message);
    },
    { enableHighAccuracy: true }
  );
}

function centerOnUserLocation() {
  if (userCoords && map) {
    map.flyTo(userCoords, 13, { duration: 1.5 });
    if (userLocationMarker) {
      userLocationMarker.openPopup();
    }
  }
}

// Google Sign In
async function signInWithGoogle() {
  // Rediriger vers le backend OAuth ou créer un utilisateur mock
  window.location.href = "http://localhost:3000/auth/google";
}

async function handleEmailLogin(e) {
  e.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    // Chercher ou créer l'utilisateur dans la BDD
    const users = await api.get("/users");
    let user = users.find((u) => u.email === email);
    
    if (!user) {
      // Créer un nouvel utilisateur
      const name = email.split("@")[0];
      const result = await api.post("/register", {
        nom: name,
        email: email,
        niveau: "Débutant",
      });
      
      // Récupérer l'utilisateur créé
      const newUsers = await api.get("/users");
      user = newUsers.find((u) => u.email === email);
    }

    if (user) {
      currentUser = {
        id: user.id,
        name: user.nom,
        email: user.email,
        avatar: user.photo_url || "/placeholder.svg?height=100&width=100",
      };
      localStorage.setItem("runtogetherUser", JSON.stringify(currentUser));
      updateAuthUI();
      navigateTo("home");
    } else {
      alert("Erreur lors de la connexion");
    }
  } catch (error) {
    console.error("Login error:", error);
    alert("Erreur lors de la connexion: " + (error.message || "Erreur inconnue"));
  }
}

function logout() {
  currentUser = null;
  localStorage.removeItem("runtogetherUser");
  updateAuthUI();
  navigateTo("home");
  closeUserDropdown();
}

function updateAuthUI() {
  const authButtons = document.getElementById("authButtons");
  const userMenu = document.getElementById("userMenu");
  const mobileAuthButtons = document.getElementById("mobileAuthButtons");
  const mobileUserInfo = document.getElementById("mobileUserInfo");
  const navMessages = document.getElementById("navMessages");
  const navMessagesMobile = document.getElementById("navMessagesMobile");
  const navMyRuns = document.getElementById("navMyRuns");
  const navMyRunsMobile = document.getElementById("navMyRunsMobile");
  const heroCreateRunBtn = document.getElementById("heroCreateRunBtn");

  if (currentUser) {
    authButtons.style.display = "none";
    userMenu.style.display = "block";
    mobileAuthButtons.style.display = "none";
    mobileUserInfo.style.display = "flex";
    navMessages.style.display = "block";
    navMessagesMobile.style.display = "block";
    navMyRuns.style.display = "block";
    navMyRunsMobile.style.display = "block";
    if (heroCreateRunBtn) heroCreateRunBtn.style.display = "inline-flex";

    document.getElementById("userAvatar").src = currentUser.avatar;
    document.getElementById("dropdownAvatar").src = currentUser.avatar;
    document.getElementById("dropdownName").textContent = currentUser.name;
    document.getElementById("dropdownEmail").textContent = currentUser.email;

    const commentAvatar = document.getElementById("commentAvatar");
    if (commentAvatar) {
      commentAvatar.src = currentUser.avatar;
    }
  } else {
    authButtons.style.display = "flex";
    userMenu.style.display = "none";
    mobileAuthButtons.style.display = "flex";
    mobileUserInfo.style.display = "none";
    navMessages.style.display = "none";
    navMessagesMobile.style.display = "none";
    navMyRuns.style.display = "none";
    navMyRunsMobile.style.display = "none";
    if (heroCreateRunBtn) heroCreateRunBtn.style.display = "none";
  }
}

function toggleUserDropdown() {
  const dropdown = document.getElementById("userDropdown");
  dropdown.classList.toggle("active");
}

function closeUserDropdown() {
  const dropdown = document.getElementById("userDropdown");
  dropdown.classList.remove("active");
}

document.addEventListener("click", (e) => {
  const userMenu = document.getElementById("userMenu");
  if (userMenu && !userMenu.contains(e.target)) {
    closeUserDropdown();
  }
});

// Navigation
function navigateTo(page, data = null) {
  document.getElementById("homePage").classList.add("page-hidden");
  document.getElementById("loginPage").classList.add("page-hidden");
  document.getElementById("runDetailPage").classList.add("page-hidden");
  document.getElementById("messagesPage").classList.add("page-hidden");
  document.getElementById("myRunsPage").classList.add("page-hidden");

  document.getElementById("mobileNav").classList.remove("active");

  currentPage = page;

  switch (page) {
    case "home":
      document.getElementById("homePage").classList.remove("page-hidden");
      window.scrollTo(0, 0);
      setTimeout(() => {
        if (!map) initMap();
      }, 100);
      break;
    case "login":
      document.getElementById("loginPage").classList.remove("page-hidden");
      window.scrollTo(0, 0);
      break;
    case "runDetail":
      if (!currentUser) {
        navigateTo("login");
        return;
      }
      document.getElementById("runDetailPage").classList.remove("page-hidden");
      window.scrollTo(0, 0);
      if (data) {
        currentRunId = data.runId;
        loadRunDetail(data.runId);
      }
      break;
    case "messages":
      if (!currentUser) {
        navigateTo("login");
        return;
      }
      document.getElementById("messagesPage").classList.remove("page-hidden");
      window.scrollTo(0, 0);
      renderConversations();
      break;
    case "myRuns":
      if (!currentUser) {
        navigateTo("login");
        return;
      }
      document.getElementById("myRunsPage").classList.remove("page-hidden");
      window.scrollTo(0, 0);
      renderMyRuns();
      break;
  }
}

// Load run detail
async function loadRunDetail(runId) {
  try {
    const runData = await api.get(`/runs/${runId}`);
    // Transform API data to frontend format
    const run = {
      id: runData.id,
      title: runData.titre,
      location: runData.ville,
      coords: runData.lat && runData.lng ? [parseFloat(runData.lat), parseFloat(runData.lng)] : null,
      date: new Date(runData.date_course).toLocaleDateString("fr-FR", {
        weekday: "short",
        day: "numeric",
        month: "short",
      }),
      time: new Date(runData.date_course).toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      distance: `${runData.distance_km} km`,
      difficulty: runData.niveau || "debutant",
      difficultyLabel: runData.niveau === "debutant" ? "Débutant" : runData.niveau === "intermediaire" ? "Intermédiaire" : "Expert",
      maxParticipants: runData.max_participants || 30,
      description: runData.description || "",
      address: runData.adresse || "",
      createdBy: runData.organisateur_id,
    };

    // Load participants
    try {
      const participants = await api.get(`/runs/${runId}/participants`);
      run.participants = participants.length;
      run.participantsList = participants.map((p) => ({
        name: p.nom,
        avatar: p.photo_url || "/placeholder.svg?height=40&width=40",
      }));
    } catch (err) {
      console.error("Error loading participants:", err);
      run.participants = 0;
      run.participantsList = [];
    }

    document.getElementById("detailTitle").textContent = run.title;
    document.getElementById("detailLocation").innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
        <circle cx="12" cy="10" r="3"/>
      </svg>
      ${run.location}
    `;
    document.getElementById("detailDate").textContent = run.date;
    document.getElementById("detailTime").textContent = run.time;
    document.getElementById("detailDistance").textContent = run.distance;
    document.getElementById(
      "detailParticipants"
    ).textContent = `${run.participants}/${run.maxParticipants}`;
    document.getElementById("participantCount").textContent = run.participants;
    document.getElementById("detailDescription").textContent = run.description;

    const badge = document.getElementById("detailBadge");
    badge.textContent = run.difficultyLabel;
    badge.className = `run-badge ${run.difficulty}`;

    document.getElementById("detailAddress").textContent = run.address || "";

    // Show coordinates
    if (run.coords) {
      document.getElementById(
        "detailCoords"
      ).textContent = `Lat: ${run.coords[0].toFixed(4)}, Lng: ${run.coords[1].toFixed(4)}`;
    }

    const participantsList = document.getElementById("participantsList");
    participantsList.innerHTML = run.participantsList
      .map(
        (p) => `
        <div class="participant-item">
          <img src="${p.avatar}" alt="${p.name}">
          <span>${p.name}</span>
        </div>
      `
      )
      .join("");

    renderComments(runId);

    // Show/hide edit and delete buttons based on ownership
    const editBtn = document.getElementById("editRunBtn");
    const deleteBtn = document.getElementById("deleteRunBtn");
    const isOwner = currentUser && run.createdBy === currentUser.id;

    editBtn.style.display = isOwner ? "inline-flex" : "none";
    deleteBtn.style.display = isOwner ? "inline-flex" : "none";

    setTimeout(() => {
      const mapCoords = run.coords || [33.5927, -7.6356];
      initDetailMap(mapCoords);
    }, 100);

    updateJoinButton(runId);
  } catch (error) {
    console.error("Error loading run detail:", error);
    alert("Erreur lors du chargement de la course");
  }
}

function initDetailMap(coords) {
  const mapContainer = document.getElementById("detailMap");

  if (detailMap) {
    detailMap.remove();
  }

  detailMap = L.map("detailMap").setView(coords, 14);

  const tileUrl = isDarkMode
    ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
    : "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";

  L.tileLayer(tileUrl, {
    attribution: "&copy; OSM &copy; CARTO",
    subdomains: "abcd",
    maxZoom: 19,
  }).addTo(detailMap);

  L.circleMarker(coords, {
    radius: 12,
    fillColor: "#f97316",
    color: "#fff",
    weight: 3,
    opacity: 1,
    fillOpacity: 0.9,
  }).addTo(detailMap);
}

// Render comments
async function renderComments(runId) {
  const container = document.getElementById("commentsContainer");
  try {
    const commentsData = await api.get(`/runs/${runId}/comments`);
    
    if (commentsData.length === 0) {
      container.innerHTML =
        '<p class="no-comments">Aucun commentaire pour le moment. Soyez le premier a commenter !</p>';
      return;
    }

    container.innerHTML = commentsData
      .map(
        (comment) => {
          const date = new Date(comment.date_publication || comment.created_at);
          const timeAgo = formatTimeAgo(date);
          return `
          <div class="comment-item">
            <img src="/placeholder.svg?height=40&width=40" alt="${comment.nom}">
            <div class="comment-content">
              <div class="comment-header">
                <span class="comment-author">${comment.nom}</span>
                <span class="comment-time">${timeAgo}</span>
              </div>
              <p class="comment-text">${comment.contenu}</p>
            </div>
          </div>
        `;
        }
      )
      .join("");
  } catch (error) {
    console.error("Error loading comments:", error);
    container.innerHTML =
      '<p class="no-comments">Erreur lors du chargement des commentaires.</p>';
  }
}

function formatTimeAgo(date) {
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "A l'instant";
  if (diffMins < 60) return `Il y a ${diffMins} min`;
  if (diffHours < 24) return `Il y a ${diffHours}h`;
  if (diffDays < 7) return `Il y a ${diffDays}j`;
  return date.toLocaleDateString("fr-FR");
}

async function addComment(e) {
  e.preventDefault();

  if (!currentUser) {
    navigateTo("login");
    return;
  }

  const input = document.getElementById("commentInput");
  const text = input.value.trim();

  if (!text || !currentRunId) return;

  try {
    await api.post("/comments", {
      runId: currentRunId,
      userId: currentUser.id,
      contenu: text,
    });
    input.value = "";
    await renderComments(currentRunId);
  } catch (error) {
    console.error("Error adding comment:", error);
    alert("Erreur lors de l'ajout du commentaire");
  }
}

async function toggleJoinRun() {
  if (!currentUser) {
    navigateTo("login");
    return;
  }

  if (!currentRunId) {
    alert("Aucune course sélectionnée");
    return;
  }

  if (!currentUser.id) {
    alert("Erreur: ID utilisateur manquant. Veuillez vous reconnecter.");
    return;
  }

  const btn = document.getElementById("joinBtn");
  const isCurrentlyJoined = btn.textContent === "Quitter";

  try {
    if (isCurrentlyJoined) {
      // Leave run - utiliser query params pour DELETE
      await api.delete(`/runs/${currentRunId}/join?userId=${currentUser.id}`);
    } else {
      // Join run
      await api.post(`/runs/${currentRunId}/join`, { userId: currentUser.id });
    }
    // Reload run detail to get updated participant count
    await loadRunDetail(currentRunId);
  } catch (error) {
    console.error("Error toggling join:", error);
    let errorMessage = "Erreur lors de l'opération";
    if (error.message) {
      try {
        const errorData = JSON.parse(error.message);
        errorMessage = errorData.error || errorMessage;
      } catch {
        if (error.message.includes("400")) {
          errorMessage = "Impossible de rejoindre/quitter cette course";
        } else if (error.message.includes("404")) {
          errorMessage = "Course ou utilisateur non trouvé";
        } else if (error.message.includes("500")) {
          errorMessage = "Erreur serveur. Vérifiez la console pour plus de détails.";
        }
      }
    }
    alert(errorMessage);
  }
}

async function updateJoinButton(runId) {
  if (!currentUser || !runId) {
    const btn = document.getElementById("joinBtn");
    if (btn) {
      btn.textContent = "Rejoindre";
      btn.classList.add("btn-primary");
      btn.classList.remove("btn-outline");
    }
    return;
  }

  try {
    const participants = await api.get(`/runs/${runId}/participants`);
    const isJoined = participants.some((p) => p.id === currentUser.id);
    const btn = document.getElementById("joinBtn");

    if (isJoined) {
      btn.textContent = "Quitter";
      btn.classList.remove("btn-primary");
      btn.classList.add("btn-outline");
    } else {
      btn.textContent = "Rejoindre";
      btn.classList.add("btn-primary");
      btn.classList.remove("btn-outline");
    }
  } catch (error) {
    console.error("Error updating join button:", error);
    const btn = document.getElementById("joinBtn");
    if (btn) {
      btn.textContent = "Rejoindre";
      btn.classList.add("btn-primary");
      btn.classList.remove("btn-outline");
    }
  }
}

// Messages
function renderConversations() {
  const container = document.getElementById("conversationsList");

  container.innerHTML = conversations
    .map(
      (conv) => `
      <div class="conversation-item ${
        currentConversationId === conv.id ? "active" : ""
      }" onclick="openConversation(${conv.id})">
        <img src="${conv.avatar}" alt="${
        conv.name
      }" class="conversation-avatar">
        <div class="conversation-info">
          <div class="conversation-name">${conv.name}</div>
          <div class="conversation-preview">${conv.lastMessage}</div>
        </div>
        <div class="conversation-meta">
          <span class="conversation-time">${conv.time}</span>
          ${
            conv.unread > 0
              ? `<span class="conversation-unread">${conv.unread}</span>`
              : ""
          }
        </div>
      </div>
    `
    )
    .join("");
}

function openConversation(convId) {
  currentConversationId = convId;
  const conv = conversations.find((c) => c.id === convId);
  if (!conv) return;

  conv.unread = 0;
  renderConversations();

  document.getElementById("chatEmpty").style.display = "none";
  document.getElementById("chatContent").style.display = "flex";
  document.getElementById("chatArea").classList.add("active");

  document.getElementById("chatAvatar").src = conv.avatar;
  document.getElementById("chatName").textContent = conv.name;
  document.getElementById("chatStatus").textContent = conv.online
    ? "En ligne"
    : "Hors ligne";
  document.getElementById("chatStatus").style.color = conv.online
    ? "var(--success)"
    : "var(--muted-foreground)";

  renderMessages(conv);
}

function renderMessages(conv) {
  const container = document.getElementById("chatMessages");

  container.innerHTML = conv.messages
    .map(
      (msg) => `
      <div class="message ${msg.sent ? "sent" : "received"}">
        ${
          !msg.sent
            ? `<img src="${conv.avatar}" alt="${conv.name}" class="message-avatar">`
            : ""
        }
        <div>
          ${msg.author ? `<div class="message-author">${msg.author}</div>` : ""}
          <div class="message-bubble">${msg.text}</div>
          <div class="message-time">${msg.time}</div>
        </div>
      </div>
    `
    )
    .join("");

  container.scrollTop = container.scrollHeight;
}

function sendMessage(e) {
  e.preventDefault();

  const input = document.getElementById("messageInput");
  const text = input.value.trim();

  if (!text || !currentConversationId) return;

  const conv = conversations.find((c) => c.id === currentConversationId);
  if (!conv) return;

  const newMessage = {
    id: Date.now(),
    text: text,
    sent: true,
    time: new Date().toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    }),
  };

  conv.messages.push(newMessage);
  conv.lastMessage = text;
  conv.time = newMessage.time;

  renderMessages(conv);
  renderConversations();
  input.value = "";
}

function closeChatMobile() {
  document.getElementById("chatArea").classList.remove("active");
}

function showCreateRunModal() {
  if (!currentUser) {
    navigateTo("login");
    return;
  }

  editingRunId = null;
  document.getElementById("modalTitle").textContent = "Creer une course";
  document.getElementById("submitRunBtn").textContent = "Creer la course";
  document.getElementById("runForm").reset();
  document.getElementById("selectedCoords").textContent = "Non defini";
  document.getElementById("runLat").value = "";
  document.getElementById("runLng").value = "";

  document.getElementById("runModal").style.display = "flex";

  setTimeout(() => initModalMap(), 100);
}

function showEditRunModal() {
  if (!currentUser || !currentRunId) return;

  const run = runs.find((r) => r.id === currentRunId);
  if (!run || run.createdBy !== currentUser.id) return;

  editingRunId = currentRunId;
  document.getElementById("modalTitle").textContent = "Modifier la course";
  document.getElementById("submitRunBtn").textContent = "Enregistrer";

  // Fill form with run data
  document.getElementById("runTitle").value = run.title;
  document.getElementById("runCity").value = run.location;
  document.getElementById("runDistance").value = Number.parseInt(run.distance);
  document.getElementById("runDifficulty").value = run.difficulty;
  document.getElementById("runMaxParticipants").value = run.maxParticipants;
  document.getElementById("runDescription").value = run.description;
  document.getElementById("runAddress").value = run.address || "";

  if (run.coords) {
    document.getElementById("runLat").value = run.coords[0];
    document.getElementById("runLng").value = run.coords[1];
    document.getElementById(
      "selectedCoords"
    ).textContent = `${run.coords[0].toFixed(4)}, ${run.coords[1].toFixed(4)}`;
  }

  document.getElementById("runModal").style.display = "flex";

  setTimeout(() => initModalMap(run.coords), 100);
}

function closeRunModal() {
  document.getElementById("runModal").style.display = "none";
  if (modalMap) {
    modalMap.remove();
    modalMap = null;
  }
}

function initModalMap(initialCoords = null) {
  const mapContainer = document.getElementById("modalMap");

  if (modalMap) {
    modalMap.remove();
  }

  const center = initialCoords || userCoords || [31.7917, -7.0926];
  modalMap = L.map("modalMap").setView(center, initialCoords ? 14 : 6);

  const tileUrl = isDarkMode
    ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
    : "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";

  L.tileLayer(tileUrl, {
    attribution: "&copy; OSM &copy; CARTO",
    subdomains: "abcd",
    maxZoom: 19,
  }).addTo(modalMap);

  let marker = null;

  if (initialCoords) {
    marker = L.circleMarker(initialCoords, {
      radius: 12,
      fillColor: "#f97316",
      color: "#fff",
      weight: 3,
      opacity: 1,
      fillOpacity: 0.9,
    }).addTo(modalMap);
  }

  modalMap.on("click", (e) => {
    const { lat, lng } = e.latlng;

    document.getElementById("runLat").value = lat;
    document.getElementById("runLng").value = lng;
    document.getElementById("selectedCoords").textContent = `${lat.toFixed(
      4
    )}, ${lng.toFixed(4)}`;

    if (marker) {
      modalMap.removeLayer(marker);
    }

    marker = L.circleMarker([lat, lng], {
      radius: 12,
      fillColor: "#f97316",
      color: "#fff",
      weight: 3,
      opacity: 1,
      fillOpacity: 0.9,
    }).addTo(modalMap);
  });
}

async function handleRunSubmit(e) {
  e.preventDefault();

  if (!currentUser) {
    navigateTo("login");
    return;
  }

  const title = document.getElementById("runTitle").value;
  const city = document.getElementById("runCity").value;
  const date = document.getElementById("runDate").value;
  const time = document.getElementById("runTime").value;
  const distance = document.getElementById("runDistance").value;
  const difficulty = document.getElementById("runDifficulty").value;
  const maxParticipants = Number.parseInt(
    document.getElementById("runMaxParticipants").value
  );
  const description = document.getElementById("runDescription").value;
  const address = document.getElementById("runAddress").value;
  const lat = Number.parseFloat(document.getElementById("runLat").value);
  const lng = Number.parseFloat(document.getElementById("runLng").value);

  if (!lat || !lng) {
    alert("Veuillez definir la position sur la carte");
    return;
  }

  // Combine date and time into a single datetime string
  const dateTime = new Date(`${date}T${time}`);
  const dateTimeString = dateTime.toISOString().slice(0, 19).replace("T", " ");

  // Vérifier que l'ID utilisateur existe
  if (!currentUser || !currentUser.id) {
    alert("Erreur: Vous devez être connecté avec un compte valide pour créer une course.");
    return;
  }

  try {
    if (editingRunId) {
      // Update existing run
      await api.put(`/runs/${editingRunId}`, {
        titre: title,
        description,
        date_course: dateTimeString,
        ville: city,
        distance_km: parseFloat(distance),
        adresse: address,
        lat,
        lng,
        niveau: difficulty,
        max_participants: maxParticipants,
      });
      alert("Course mise à jour avec succès!");
      await loadRuns();
      await loadRunDetail(editingRunId);
    } else {
      // Create new run
      const result = await api.post("/runs", {
        titre: title,
        description,
        date_course: dateTimeString,
        ville: city,
        distance_km: parseFloat(distance),
        organisateur_id: currentUser.id,
        adresse: address,
        lat,
        lng,
        niveau: difficulty,
        max_participants: maxParticipants,
      });
      
      if (!result || !result.id) {
        alert("Erreur: La course a été créée mais l'ID n'a pas été retourné. Rafraîchissez la page.");
        await loadRuns();
        return;
      }
      
      alert("Course créée avec succès!");
      
      // Auto-join the run (l'organisateur s'inscrit automatiquement)
      try {
        await api.post(`/runs/${result.id}/join`, { userId: currentUser.id });
      } catch (err) {
        console.error("Error auto-joining run:", err);
        // Ne pas bloquer si l'auto-join échoue
      }
      
      await loadRuns();
    }

    closeRunModal();
    renderLocationList();
    refreshMapMarkers();
  } catch (error) {
    console.error("Error submitting run:", error);
    let errorMessage = "Erreur lors de la sauvegarde de la course";
    if (error.message) {
      try {
        const errorData = JSON.parse(error.message);
        errorMessage = errorData.error || errorMessage;
      } catch {
        if (error.message.includes("400")) {
          errorMessage = "Données invalides. Vérifiez tous les champs.";
        } else if (error.message.includes("500")) {
          errorMessage = "Erreur serveur. Vérifiez que la base de données est configurée.";
        }
      }
    }
    alert(errorMessage);
  }
}

function confirmDeleteRun() {
  document.getElementById("deleteModal").style.display = "flex";
}

function closeDeleteModal() {
  document.getElementById("deleteModal").style.display = "none";
}

async function deleteRun() {
  if (!currentUser || !currentRunId) return;

  try {
    await api.delete(`/runs/${currentRunId}`);
    alert("Course supprimée avec succès!");
    closeDeleteModal();
    await loadRuns();
    navigateTo("home");
    renderLocationList();
    refreshMapMarkers();
  } catch (error) {
    console.error("Error deleting run:", error);
    alert("Erreur lors de la suppression de la course");
  }
}

async function renderMyRuns() {
  const container = document.getElementById("myRunsGrid");
  
  if (!currentUser) {
    container.innerHTML = `
      <div class="no-runs-message">
        <p>Veuillez vous connecter pour voir vos courses.</p>
      </div>
    `;
    return;
  }

  try {
    const myRunsData = await api.get(`/users/${currentUser.id}/runs`);
    
    if (myRunsData.length === 0) {
      container.innerHTML = `
        <div class="no-runs-message">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="48" height="48">
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
          </svg>
          <p>Vous n'avez pas encore cree de course.</p>
          <button class="btn btn-primary" onclick="showCreateRunModal()">Creer ma premiere course</button>
        </div>
      `;
      return;
    }

    // Transform API data to frontend format
    const myRuns = myRunsData.map((run) => ({
      id: run.id,
      title: run.titre,
      location: run.ville,
      coords: run.lat && run.lng ? [parseFloat(run.lat), parseFloat(run.lng)] : null,
      date: new Date(run.date_course).toLocaleDateString("fr-FR", {
        weekday: "short",
        day: "numeric",
        month: "short",
      }),
      time: new Date(run.date_course).toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      distance: `${run.distance_km} km`,
      difficulty: run.niveau || "debutant",
      difficultyLabel: run.niveau === "debutant" ? "Débutant" : run.niveau === "intermediaire" ? "Intermédiaire" : "Expert",
      participants: 0,
      maxParticipants: run.max_participants || 30,
      description: run.description || "",
      address: run.adresse || "",
      createdBy: run.organisateur_id,
    }));

    // Load participants count for each run
    for (const run of myRuns) {
      try {
        const participants = await api.get(`/runs/${run.id}/participants`);
        run.participants = participants.length;
      } catch (err) {
        console.error("Error loading participants for run", run.id, err);
      }
    }

    container.innerHTML = myRuns
      .map(
        (run) => `
      <div class="run-card my-run">
        <div class="run-header">
          <div>
            <h3 class="run-title">${run.title}<span class="my-run-badge">Ma course</span></h3>
            <p class="run-location">${run.location}</p>
          </div>
          <span class="run-badge ${run.difficulty}">${run.difficultyLabel}</span>
        </div>
        <div class="run-details">
          <div class="run-detail">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            ${run.date}
          </div>
          <div class="run-detail">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12,6 12,12 16,14"/>
            </svg>
            ${run.time}
          </div>
          <div class="run-detail">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
            ${run.distance}
          </div>
        </div>
        <div class="run-footer">
          <div class="run-participants">
            <span class="participant-count">${run.participants}/${run.maxParticipants} participants</span>
          </div>
          <div class="run-card-actions">
            <button class="btn btn-outline" onclick="navigateTo('runDetail', { runId: ${run.id} })">Voir</button>
          </div>
        </div>
      </div>
    `
      )
      .join("");
  } catch (error) {
    console.error("Error loading my runs:", error);
    container.innerHTML = `
      <div class="no-runs-message">
        <p>Erreur lors du chargement de vos courses.</p>
      </div>
    `;
  }
}

// Initialize map
function initMap() {
  const mapContainer = document.getElementById("map");
  if (!mapContainer) return;

  map = L.map("map").setView([31.7917, -7.0926], 6);

  const tileUrl = isDarkMode
    ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
    : "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";

  L.tileLayer(tileUrl, {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>',
    subdomains: "abcd",
    maxZoom: 19,
  }).addTo(map);

  refreshMapMarkers();
}

function refreshMapMarkers() {
  if (!map) return;

  // Clear existing markers
  markers.forEach((m) => map.removeLayer(m.marker));
  markers.length = 0;

  // Add markers for all locations
  locations.forEach((location) => {
    const marker = L.circleMarker(location.coords, {
      radius: 10,
      fillColor: location.isUserCreated ? "#22c55e" : "#f97316",
      color: "#fff",
      weight: 2,
      opacity: 1,
      fillOpacity: 0.9,
    }).addTo(map);

    const popupContent = `
      <div class="popup-content">
        <h4>${location.name}</h4>
        <p>${location.city}</p>
        <p class="popup-distance">${location.distance} - ${
      location.difficulty
    }</p>
        <p>${location.runners} coureurs actifs</p>
        ${
          location.isUserCreated
            ? '<p style="color: #22c55e; font-weight: 500;">Votre parcours</p>'
            : ""
        }
      </div>
    `;

    marker.bindPopup(popupContent);
    markers.push({ marker, location });
  });

  // Re-add user location marker if exists
  if (userCoords && userLocationMarker) {
    userLocationMarker.addTo(map);
  }
}

// Render location list
function renderLocationList() {
  const container = document.getElementById("locationList");
  if (!container) return;

  const html = locations
    .map(
      (location) => `
      <div class="location-item ${
        location.isUserCreated ? "user-created" : ""
      }" data-id="${location.id}">
        <div class="location-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
            <circle cx="12" cy="10" r="3"/>
          </svg>
        </div>
        <div class="location-info">
          <h4>${location.name}</h4>
          <div class="location-meta">
            <span>${location.city}</span>
            <span>${location.distance}</span>
          </div>
        </div>
        ${
          location.isUserCreated
            ? '<span class="location-badge">Moi</span>'
            : ""
        }
      </div>
    `
    )
    .join("");

  container.innerHTML = html;

  container.querySelectorAll(".location-item").forEach((item) => {
    item.addEventListener("click", () => {
      const id = Number.parseInt(item.dataset.id);
      const location = locations.find((l) => l.id === id);

      if (location && map) {
        map.flyTo(location.coords, 13, { duration: 1.5 });

        const markerData = markers.find((m) => m.location.id === id);
        if (markerData) {
          markerData.marker.openPopup();
        }

        container
          .querySelectorAll(".location-item")
          .forEach((i) => i.classList.remove("active"));
        item.classList.add("active");
      }
    });
  });
}

// Render runs grid
function renderRuns() {
  const container = document.getElementById("runsGrid");
  if (!container) return;

  const html = runs
    .map(
      (run) => `
      <div class="run-card ${
        run.createdBy === currentUser?.id ? "my-run" : ""
      }">
        <div class="run-header">
          <div>
            <h3 class="run-title">${run.title}${
        run.createdBy === currentUser?.id
          ? '<span class="my-run-badge">Ma course</span>'
          : ""
      }</h3>
            <p class="run-location">${run.location}</p>
          </div>
          <span class="run-badge ${run.difficulty}">${
        run.difficultyLabel
      }</span>
        </div>
        <div class="run-details">
          <div class="run-detail">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            ${run.date}
          </div>
          <div class="run-detail">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12,6 12,12 16,14"/>
            </svg>
            ${run.time}
          </div>
          <div class="run-detail">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
            ${run.distance}
          </div>
        </div>
        <div class="run-footer">
          <div class="run-participants">
            <div class="participant-avatars">
              ${run.initials
                .slice(0, 4)
                .map(
                  (initial) =>
                    `<div class="participant-avatar">${initial}</div>`
                )
                .join("")}
            </div>
            <span class="participant-count">${run.participants}/${
        run.maxParticipants
      }</span>
          </div>
          <button class="btn btn-primary" onclick="navigateTo('runDetail', { runId: ${
            run.id
          } })">Rejoindre</button>
        </div>
      </div>
    `
    )
    .join("");

  container.innerHTML = html;
}

// Mobile menu toggle
function initMobileMenu() {
  const toggle = document.getElementById("menuToggle");
  const nav = document.getElementById("mobileNav");

  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      nav.classList.toggle("active");
    });

    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        nav.classList.remove("active");
      });
    });
  }
}

// Smooth scroll for navigation links
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const href = this.getAttribute("href");
      if (href === "#") return;

      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });
}

// Load runs from API
async function loadRuns() {
  try {
    const data = await api.get("/runs");
    // Transform API data to frontend format
    runs = data.map((run) => ({
      id: run.id,
      title: run.titre,
      location: run.ville,
      locationId: run.id,
      coords: run.lat && run.lng ? [parseFloat(run.lat), parseFloat(run.lng)] : null,
      date: new Date(run.date_course).toLocaleDateString("fr-FR", {
        weekday: "short",
        day: "numeric",
        month: "short",
      }),
      time: new Date(run.date_course).toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      distance: `${run.distance_km} km`,
      difficulty: run.niveau || "debutant",
      difficultyLabel: run.niveau === "debutant" ? "Débutant" : run.niveau === "intermediaire" ? "Intermédiaire" : "Expert",
      participants: 0, // Will be loaded separately
      maxParticipants: run.max_participants || 30,
      initials: [],
      description: run.description || "",
      address: run.adresse || "",
      createdBy: run.organisateur_id,
      participantsList: [],
    }));
    // Load participants count for each run
    for (const run of runs) {
      try {
        const participants = await api.get(`/runs/${run.id}/participants`);
        run.participants = participants.length;
        run.participantsList = participants.map((p) => ({
          name: p.nom,
          avatar: p.photo_url || "/placeholder.svg?height=40&width=40",
        }));
        run.initials = participants.slice(0, 4).map((p) => p.nom.substring(0, 2).toUpperCase());
      } catch (err) {
        console.error("Error loading participants for run", run.id, err);
      }
    }
    renderRuns();
  } catch (error) {
    console.error("Error loading runs:", error);
    // Keep default runs as fallback
    renderRuns();
  }
}

// Check for existing session
function checkSession() {
  // Vérifier si l'utilisateur vient du callback OAuth
  const urlParams = new URLSearchParams(window.location.search);
  const userParam = urlParams.get("user");
  if (userParam) {
    try {
      const user = JSON.parse(decodeURIComponent(userParam));
      currentUser = user;
      localStorage.setItem("runtogetherUser", JSON.stringify(user));
      updateAuthUI();
      // Nettoyer l'URL
      window.history.replaceState({}, document.title, window.location.pathname);
    } catch (e) {
      console.error("Error parsing user from URL:", e);
    }
  } else {
    // Sinon, charger depuis localStorage
    const savedUser = localStorage.getItem("runtogetherUser");
    if (savedUser) {
      try {
        currentUser = JSON.parse(savedUser);
        updateAuthUI();
      } catch (e) {
        console.error("Error parsing saved user:", e);
        localStorage.removeItem("runtogetherUser");
      }
    }
  }

  // Check dark mode preference
  const savedDarkMode = localStorage.getItem("darkMode");
  if (savedDarkMode !== null) {
    isDarkMode = savedDarkMode === "true";
    document.documentElement.setAttribute(
      "data-theme",
      isDarkMode ? "dark" : "light"
    );
    updateDarkModeIcon();
  }
}

// Initialize everything when DOM is ready
document.addEventListener("DOMContentLoaded", async () => {
  checkSession();
  initMap();
  renderLocationList();
  await loadRuns();
  initMobileMenu();
  initSmoothScroll();
});
