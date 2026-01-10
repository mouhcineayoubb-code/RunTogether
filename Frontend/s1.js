// Import Leaflet library
const L = window.L;

// Data for running locations in Morocco
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
function signInWithGoogle() {
  const mockUser = {
    id: Date.now(),
    name: "Ahmed Benali",
    email: "ahmed.benali@gmail.com",
    avatar: "/placeholder.svg?height=100&width=100",
  };

  currentUser = mockUser;
  localStorage.setItem("runtogetherUser", JSON.stringify(mockUser));
  updateAuthUI();
  navigateTo("home");
}

function handleEmailLogin(e) {
  e.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const mockUser = {
    id: Date.now(),
    name: email.split("@")[0],
    email: email,
    avatar: "/placeholder.svg?height=100&width=100",
  };

  currentUser = mockUser;
  localStorage.setItem("runtogetherUser", JSON.stringify(mockUser));
  updateAuthUI();
  navigateTo("home");
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
function loadRunDetail(runId) {
  const run = runs.find((r) => r.id === runId);
  if (!run) return;

  const location = locations.find((l) => l.id === run.locationId);

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

  document.getElementById("detailAddress").textContent =
    run.address || (location ? location.address : "");

  // Show coordinates
  const coords = run.coords || (location ? location.coords : null);
  if (coords) {
    document.getElementById(
      "detailCoords"
    ).textContent = `Lat: ${coords[0].toFixed(4)}, Lng: ${coords[1].toFixed(
      4
    )}`;
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
    const mapCoords =
      run.coords || (location ? location.coords : [33.5927, -7.6356]);
    initDetailMap(mapCoords);
  }, 100);

  updateJoinButton(runId);
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
function renderComments(runId) {
  const container = document.getElementById("commentsContainer");
  const comments = commentsData[runId] || [];

  if (comments.length === 0) {
    container.innerHTML =
      '<p class="no-comments">Aucun commentaire pour le moment. Soyez le premier a commenter !</p>';
    return;
  }

  container.innerHTML = comments
    .map(
      (comment) => `
      <div class="comment-item">
        <img src="${comment.avatar}" alt="${comment.author}">
        <div class="comment-content">
          <div class="comment-header">
            <span class="comment-author">${comment.author}</span>
            <span class="comment-time">${comment.time}</span>
          </div>
          <p class="comment-text">${comment.text}</p>
        </div>
      </div>
    `
    )
    .join("");
}

function addComment(e) {
  e.preventDefault();

  if (!currentUser) {
    navigateTo("login");
    return;
  }

  const input = document.getElementById("commentInput");
  const text = input.value.trim();

  if (!text) return;

  const newComment = {
    id: Date.now(),
    author: currentUser.name,
    avatar: currentUser.avatar,
    text: text,
    time: "A l'instant",
  };

  if (!commentsData[currentRunId]) {
    commentsData[currentRunId] = [];
  }

  commentsData[currentRunId].push(newComment);
  renderComments(currentRunId);
  input.value = "";
}

function toggleJoinRun() {
  if (!currentUser) {
    navigateTo("login");
    return;
  }

  const run = runs.find((r) => r.id === currentRunId);
  if (!run) return;

  const joinedRuns = JSON.parse(localStorage.getItem("joinedRuns") || "[]");
  const isJoined = joinedRuns.includes(currentRunId);

  if (isJoined) {
    const index = joinedRuns.indexOf(currentRunId);
    joinedRuns.splice(index, 1);
    run.participants--;
  } else {
    if (run.participants >= run.maxParticipants) {
      alert("Cette course est complete !");
      return;
    }
    joinedRuns.push(currentRunId);
    run.participants++;
  }

  localStorage.setItem("joinedRuns", JSON.stringify(joinedRuns));
  updateJoinButton(currentRunId);
  document.getElementById(
    "detailParticipants"
  ).textContent = `${run.participants}/${run.maxParticipants}`;
  document.getElementById("participantCount").textContent = run.participants;
}

function updateJoinButton(runId) {
  const joinedRuns = JSON.parse(localStorage.getItem("joinedRuns") || "[]");
  const isJoined = joinedRuns.includes(runId);
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

function handleRunSubmit(e) {
  e.preventDefault();

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

  const difficultyLabels = {
    debutant: "Debutant",
    intermediaire: "Intermediaire",
    expert: "Expert",
  };

  const formattedDate = new Date(date).toLocaleDateString("fr-FR", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });

  if (editingRunId) {
    // Update existing run
    const runIndex = runs.findIndex((r) => r.id === editingRunId);
    if (runIndex !== -1) {
      runs[runIndex] = {
        ...runs[runIndex],
        title,
        location: city,
        date: formattedDate,
        time,
        distance: `${distance} km`,
        difficulty,
        difficultyLabel: difficultyLabels[difficulty],
        maxParticipants,
        description,
        address,
        coords: [lat, lng],
      };

      // Update location if user created it
      const locIndex = locations.findIndex(
        (l) =>
          l.id === runs[runIndex].locationId && l.createdBy === currentUser.id
      );
      if (locIndex !== -1) {
        locations[locIndex].coords = [lat, lng];
        locations[locIndex].name = title;
        locations[locIndex].city = city;
        locations[locIndex].address = address;
      }
    }
  } else {
    // Create new run
    const newLocationId = Date.now();
    const newRun = {
      id: Date.now(),
      title,
      location: city,
      locationId: newLocationId,
      coords: [lat, lng],
      date: formattedDate,
      time,
      distance: `${distance} km`,
      difficulty,
      difficultyLabel: difficultyLabels[difficulty],
      participants: 1,
      maxParticipants,
      initials: [currentUser.name.substring(0, 2).toUpperCase()],
      description,
      address,
      createdBy: currentUser.id,
      participantsList: [
        { name: currentUser.name, avatar: currentUser.avatar },
      ],
    };

    // Add new location
    const newLocation = {
      id: newLocationId,
      name: title,
      city,
      coords: [lat, lng],
      distance: `${distance} km`,
      difficulty: difficultyLabels[difficulty],
      runners: 1,
      address,
      isUserCreated: true,
      createdBy: currentUser.id,
    };

    runs.unshift(newRun);
    locations.push(newLocation);

    // Auto-join the run
    const joinedRuns = JSON.parse(localStorage.getItem("joinedRuns") || "[]");
    joinedRuns.push(newRun.id);
    localStorage.setItem("joinedRuns", JSON.stringify(joinedRuns));
  }

  // Save to localStorage
  localStorage.setItem(
    "userRuns",
    JSON.stringify(runs.filter((r) => r.createdBy === currentUser.id))
  );
  localStorage.setItem(
    "userLocations",
    JSON.stringify(locations.filter((l) => l.createdBy === currentUser.id))
  );

  closeRunModal();
  renderRuns();
  renderLocationList();
  refreshMapMarkers();

  if (editingRunId) {
    loadRunDetail(editingRunId);
  }
}

function confirmDeleteRun() {
  document.getElementById("deleteModal").style.display = "flex";
}

function closeDeleteModal() {
  document.getElementById("deleteModal").style.display = "none";
}

function deleteRun() {
  if (!currentUser || !currentRunId) return;

  const run = runs.find((r) => r.id === currentRunId);
  if (!run || run.createdBy !== currentUser.id) return;

  // Remove run
  runs = runs.filter((r) => r.id !== currentRunId);

  // Remove associated location
  locations = locations.filter(
    (l) => l.id !== run.locationId || l.createdBy !== currentUser.id
  );

  // Remove from joined runs
  let joinedRuns = JSON.parse(localStorage.getItem("joinedRuns") || "[]");
  joinedRuns = joinedRuns.filter((id) => id !== currentRunId);
  localStorage.setItem("joinedRuns", JSON.stringify(joinedRuns));

  // Update localStorage
  localStorage.setItem(
    "userRuns",
    JSON.stringify(runs.filter((r) => r.createdBy === currentUser?.id))
  );
  localStorage.setItem(
    "userLocations",
    JSON.stringify(locations.filter((l) => l.createdBy === currentUser?.id))
  );

  closeDeleteModal();
  navigateTo("home");
  renderRuns();
  renderLocationList();
  refreshMapMarkers();
}

function renderMyRuns() {
  const container = document.getElementById("myRunsGrid");
  const myRuns = runs.filter((r) => r.createdBy === currentUser?.id);

  if (myRuns.length === 0) {
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

// Check for existing session
function checkSession() {
  const savedUser = localStorage.getItem("runtogetherUser");
  if (savedUser) {
    currentUser = JSON.parse(savedUser);
    updateAuthUI();

    // Load user's runs and locations
    const userRuns = JSON.parse(localStorage.getItem("userRuns") || "[]");
    const userLocations = JSON.parse(
      localStorage.getItem("userLocations") || "[]"
    );

    userRuns.forEach((run) => {
      if (!runs.find((r) => r.id === run.id)) {
        runs.unshift(run);
      }
    });

    userLocations.forEach((loc) => {
      if (!locations.find((l) => l.id === loc.id)) {
        locations.push(loc);
      }
    });
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
document.addEventListener("DOMContentLoaded", () => {
  checkSession();
  initMap();
  renderLocationList();
  renderRuns();
  initMobileMenu();
  initSmoothScroll();
});
