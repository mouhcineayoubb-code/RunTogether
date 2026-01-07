// Import Leaflet library
const L = window.L;

// Data for running locations in Morocco
const locations = [
  {
    id: 1,
    name: "Corniche de Casablanca",
    city: "Casablanca",
    coords: [33.5927, -7.6356],
    distance: "5-10 km",
    difficulty: "Débutant",
    runners: 342,
  },
  {
    id: 2,
    name: "Forêt de Maâmora",
    city: "Rabat",
    coords: [34.0531, -6.7987],
    distance: "8-15 km",
    difficulty: "Intermédiaire",
    runners: 256,
  },
  {
    id: 3,
    name: "Jardins de la Ménara",
    city: "Marrakech",
    coords: [31.6225, -8.0225],
    distance: "3-5 km",
    difficulty: "Débutant",
    runners: 189,
  },
  {
    id: 4,
    name: "Bord de mer Agadir",
    city: "Agadir",
    coords: [30.4278, -9.5981],
    distance: "6-12 km",
    difficulty: "Débutant",
    runners: 167,
  },
  {
    id: 5,
    name: "Parc de la Ligue Arabe",
    city: "Casablanca",
    coords: [33.5842, -7.6228],
    distance: "2-4 km",
    difficulty: "Débutant",
    runners: 423,
  },
];

// Data for upcoming runs
const runs = [
  {
    id: 1,
    title: "Morning Run Corniche",
    location: "Casablanca",
    date: "Sam 25 Jan",
    time: "07:00",
    distance: "8 km",
    difficulty: "debutant",
    difficultyLabel: "Débutant",
    participants: 24,
    maxParticipants: 30,
    initials: ["MA", "SK", "YB", "NL"],
  },
  {
    id: 2,
    title: "Trail Maâmora",
    location: "Rabat",
    date: "Dim 26 Jan",
    time: "08:00",
    distance: "12 km",
    difficulty: "intermediaire",
    difficultyLabel: "Intermédiaire",
    participants: 18,
    maxParticipants: 25,
    initials: ["AH", "RK", "FB"],
  },
  {
    id: 3,
    title: "Sunset Run Ménara",
    location: "Marrakech",
    date: "Sam 25 Jan",
    time: "17:30",
    distance: "5 km",
    difficulty: "debutant",
    difficultyLabel: "Débutant",
    participants: 32,
    maxParticipants: 40,
    initials: ["OE", "SL", "KB", "ZM"],
  },
  {
    id: 4,
    title: "Beach Run Challenge",
    location: "Agadir",
    date: "Dim 26 Jan",
    time: "06:30",
    distance: "10 km",
    difficulty: "intermediaire",
    difficultyLabel: "Intermédiaire",
    participants: 15,
    maxParticipants: 20,
    initials: ["HA", "MC", "JD"],
  },
  {
    id: 5,
    title: "Urban Night Run",
    location: "Casablanca",
    date: "Ven 24 Jan",
    time: "20:00",
    distance: "6 km",
    difficulty: "debutant",
    difficultyLabel: "Débutant",
    participants: 45,
    maxParticipants: 50,
    initials: ["NB", "AS", "YK", "ML"],
  },
  {
    id: 6,
    title: "Marathon Training",
    location: "Rabat",
    date: "Sam 25 Jan",
    time: "06:00",
    distance: "21 km",
    difficulty: "expert",
    difficultyLabel: "Expert",
    participants: 12,
    maxParticipants: 15,
    initials: ["TH", "RM"],
  },
];

// Initialize map
let map;
const markers = [];

function initMap() {
  // Center on Morocco
  map = L.map("map").setView([31.7917, -7.0926], 6);

  // Add dark tile layer
  L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>',
    subdomains: "abcd",
    maxZoom: 19,
  }).addTo(map);

  // Add markers
  locations.forEach((location) => {
    const marker = L.circleMarker(location.coords, {
      radius: 10,
      fillColor: "#f97316",
      color: "#fff",
      weight: 2,
      opacity: 1,
      fillOpacity: 0.9,
    }).addTo(map);

    // Popup content
    const popupContent = `
      <div class="popup-content">
        <h4>${location.name}</h4>
        <p>${location.city}</p>
        <p class="popup-distance">${location.distance} • ${location.difficulty}</p>
        <p>${location.runners} coureurs actifs</p>
      </div>
    `;

    marker.bindPopup(popupContent);
    markers.push({ marker, location });
  });
}

// Render location list
function renderLocationList() {
  const container = document.getElementById("locationList");

  const html = locations
    .map(
      (location) => `
    <div class="location-item" data-id="${location.id}">
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
    </div>
  `
    )
    .join("");

  container.innerHTML = html;

  // Add click handlers
  container.querySelectorAll(".location-item").forEach((item) => {
    item.addEventListener("click", () => {
      const id = Number.parseInt(item.dataset.id);
      const location = locations.find((l) => l.id === id);

      if (location) {
        map.flyTo(location.coords, 13, { duration: 1.5 });

        // Open popup
        const markerData = markers.find((m) => m.location.id === id);
        if (markerData) {
          markerData.marker.openPopup();
        }

        // Update active state
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

  const html = runs
    .map(
      (run) => `
    <div class="run-card">
      <div class="run-header">
        <div>
          <h3 class="run-title">${run.title}</h3>
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
          <div class="participant-avatars">
            ${run.initials
              .slice(0, 4)
              .map(
                (initial) => `
              <div class="participant-avatar">${initial}</div>
            `
              )
              .join("")}
          </div>
          <span class="participant-count">${run.participants}/${
        run.maxParticipants
      }</span>
        </div>
        <button class="btn btn-primary">Rejoindre</button>
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

  toggle.addEventListener("click", () => {
    nav.classList.toggle("active");
  });

  // Close menu when clicking a link
  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("active");
    });
  });
}

// Smooth scroll for navigation links
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });
}

// Initialize everything when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  initMap();
  renderLocationList();
  renderRuns();
  initMobileMenu();
  initSmoothScroll();
});
