// Sample events data
let events = [
  {
    id: 1,
    name: "Course du Matin",
    distance: 10,
    date: "2026-01-15",
    time: "07:00",
    location: "Parc de la Ville",
    level: "intermédiaire",
    description:
      "Course matinale pour bien commencer la journée. Parcours plat idéal pour tous.",
    participants: 12,
  },
  {
    id: 2,
    name: "Semi-Marathon du Soir",
    distance: 21,
    date: "2026-01-20",
    time: "18:30",
    location: "Centre Sportif",
    level: "avancé",
    description:
      "Défi semi-marathon pour coureurs expérimentés. Préparation recommandée.",
    participants: 8,
  },
  {
    id: 3,
    name: "Jogging Débutants",
    distance: 5,
    date: "2026-01-10",
    time: "19:00",
    location: "Stade Municipal",
    level: "débutant",
    description:
      "Séance d'initiation à la course à pied dans une ambiance conviviale.",
    participants: 15,
  },
];

// Load events from localStorage
function loadEvents() {
  const stored = localStorage.getItem("runTogetherEvents");
  if (stored) {
    events = JSON.parse(stored);
  }
}

// Save events to localStorage
function saveEvents() {
  localStorage.setItem("runTogetherEvents", JSON.stringify(events));
}

// Initialize app
loadEvents();

// Theme toggle
const themeToggle = document.getElementById("themeToggle");
const body = document.body;

// Load theme preference
const savedTheme = localStorage.getItem("theme");
if (savedTheme === "night") {
  body.classList.add("night-mode");
  themeToggle.textContent = "☀️";
}

themeToggle.addEventListener("click", () => {
  body.classList.toggle("night-mode");
  const isNight = body.classList.contains("night-mode");
  themeToggle.textContent = isNight ? "☀️" : "🌙";
  localStorage.setItem("theme", isNight ? "night" : "day");
});

// Modal handling
const modal = document.getElementById("createEventModal");
const createBtn = document.getElementById("createEventBtn");
const closeBtn = document.querySelector(".close");

createBtn.addEventListener("click", () => {
  modal.style.display = "block";
  const today = new Date().toISOString().split("T")[0];
  document.getElementById("eventDate").min = today;
});

closeBtn.addEventListener("click", () => {
  modal.style.display = "none";
});

window.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.style.display = "none";
  }
});

// Create event form
const createForm = document.getElementById("createEventForm");
createForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const newEvent = {
    id: Date.now(),
    name: document.getElementById("eventName").value,
    distance: parseInt(document.getElementById("eventDistance").value),
    date: document.getElementById("eventDate").value,
    time: document.getElementById("eventTime").value,
    location: document.getElementById("eventLocation").value,
    level: document.getElementById("eventLevel").value,
    description: document.getElementById("eventDescription").value,
    participants: 0,
  };

  events.push(newEvent);
  saveEvents();
  renderEvents();
  modal.style.display = "none";
  createForm.reset();
});

// Countdown timer
function getCountdown(date, time) {
  const eventDate = new Date(`${date}T${time}`);
  const now = new Date();
  const diff = eventDate - now;

  if (diff < 0) {
    return "Événement passé";
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  if (days > 0) {
    return `${days}j ${hours}h ${minutes}m`;
  } else if (hours > 0) {
    return `${hours}h ${minutes}m ${seconds}s`;
  } else {
    return `${minutes}m ${seconds}s`;
  }
}

// Render events
function renderEvents(filteredEvents = null) {
  const container = document.getElementById("eventsContainer");
  const eventsToRender = filteredEvents || events;

  if (eventsToRender.length === 0) {
    container.innerHTML =
      '<p style="text-align: center; color: var(--text-secondary); padding: 40px;">Aucun événement trouvé</p>';
    return;
  }

  container.innerHTML = eventsToRender
    .map(
      (event) => `
                <div class="event-card" data-id="${event.id}">
                    <div class="event-header">
                        <div>
                            <div class="event-title">${event.name}</div>
                        </div>
                        <span class="event-distance">${event.distance} km</span>
                    </div>
                    
                    <div class="countdown" data-date="${
                      event.date
                    }" data-time="${event.time}">
                        <div class="countdown-label">Démarre dans</div>
                        <div class="countdown-time">${getCountdown(
                          event.date,
                          event.time
                        )}</div>
                    </div>
                    
                    <div class="event-info">
                        <div class="info-item">
                            <span>📅</span>
                            <span>${formatDate(event.date)} à ${
        event.time
      }</span>
                        </div>
                        <div class="info-item">
                            <span>📍</span>
                            <span>${event.location}</span>
                        </div>
                        <div class="info-item">
                            <span>👥</span>
                            <span>${event.participants} participant(s)</span>
                        </div>
                    </div>
                    
                    <span class="event-level level-${event.level}">${
        event.level
      }</span>
                    
                    <p class="event-description">${event.description}</p>
                    
                    <div class="event-actions">
                        <button class="btn-join" onclick="joinEvent(${
                          event.id
                        })">
                            Rejoindre
                        </button>
                        <button class="btn-delete" onclick="deleteEvent(${
                          event.id
                        })">
                            🗑️
                        </button>
                    </div>
                </div>
            `
    )
    .join("");

  updateCountdowns();
}

// Update countdowns every second
function updateCountdowns() {
  setInterval(() => {
    document.querySelectorAll(".countdown").forEach((el) => {
      const date = el.dataset.date;
      const time = el.dataset.time;
      const timeEl = el.querySelector(".countdown-time");
      if (timeEl) {
        timeEl.textContent = getCountdown(date, time);
      }
    });
  }, 1000);
}

// Format date
function formatDate(dateString) {
  const date = new Date(dateString);
  const options = { day: "numeric", month: "long", year: "numeric" };
  return date.toLocaleDateString("fr-FR", options);
}

// Join event
function joinEvent(id) {
  const event = events.find((e) => e.id === id);
  if (event) {
    event.participants++;
    saveEvents();
    renderEvents(getFilteredEvents());
  }
}

// Delete event
function deleteEvent(id) {
  if (confirm("Êtes-vous sûr de vouloir supprimer cet événement ?")) {
    events = events.filter((e) => e.id !== id);
    saveEvents();
    renderEvents(getFilteredEvents());
  }
}

// Filtering
function getFilteredEvents() {
  const searchTerm = document.getElementById("searchInput").value.toLowerCase();
  const distanceFilter = document.getElementById("distanceFilter").value;
  const dateFilter = document.getElementById("dateFilter").value;

  return events.filter((event) => {
    const matchesSearch =
      event.name.toLowerCase().includes(searchTerm) ||
      event.location.toLowerCase().includes(searchTerm) ||
      event.description.toLowerCase().includes(searchTerm);

    const matchesDistance =
      distanceFilter === "all" || event.distance === parseInt(distanceFilter);

    let matchesDate = true;
    if (dateFilter !== "all") {
      const eventDate = new Date(event.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (dateFilter === "today") {
        matchesDate = eventDate.toDateString() === today.toDateString();
      } else if (dateFilter === "week") {
        const weekFromNow = new Date(today);
        weekFromNow.setDate(today.getDate() + 7);
        matchesDate = eventDate >= today && eventDate <= weekFromNow;
      } else if (dateFilter === "month") {
        const monthFromNow = new Date(today);
        monthFromNow.setMonth(today.getMonth() + 1);
        matchesDate = eventDate >= today && eventDate <= monthFromNow;
      }
    }

    return matchesSearch && matchesDistance && matchesDate;
  });
}

// Add filter listeners
document.getElementById("searchInput").addEventListener("input", () => {
  renderEvents(getFilteredEvents());
});

document.getElementById("distanceFilter").addEventListener("change", () => {
  renderEvents(getFilteredEvents());
});

document.getElementById("dateFilter").addEventListener("change", () => {
  renderEvents(getFilteredEvents());
});

// Initial render
renderEvents();
