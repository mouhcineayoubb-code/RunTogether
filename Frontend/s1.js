// 1. Initialisation de la Carte Leaflet
const map = L.map("map").setView([33.5731, -7.5898], 6); // Centré sur Casablanca

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "© OpenStreetMap contributors",
}).addTo(map);

// 2. Données de démonstration (Simulant votre future API Node.js)
const runLocations = [
  { name: "Corniche de Casablanca", coords: [33.595, -7.666], runners: 450 },
  { name: "Forêt de Maâmora (Rabat)", coords: [34.013, -6.712], runners: 210 },
  { name: "Palmeraie de Marrakech", coords: [31.622, -8.022], runners: 320 },
];

const runsData = [
  {
    title: "Morning Run Casa",
    loc: "Phare d'El Hank",
    date: "Dim 12 Jan",
    time: "07:00",
    dist: "10km",
  },
  {
    title: "Trail Forêt Hilton",
    loc: "Rabat",
    date: "Sam 11 Jan",
    time: "08:30",
    dist: "15km",
  },
  {
    title: "Sunset Run Ménara",
    loc: "Marrakech",
    date: "Jeu 09 Jan",
    time: "17:45",
    dist: "5km",
  },
];

// 3. Affichage des marqueurs et de la liste
const locationList = document.getElementById("locationList");
runLocations.forEach((loc) => {
  // Ajouter Marqueur
  L.marker(loc.coords)
    .addTo(map)
    .bindPopup(`<b>${loc.name}</b><br>${loc.runners} coureurs.`);

  // Ajouter à la barre latérale
  const div = document.createElement("div");
  div.className = "location-item";
  div.innerHTML = `<strong>${loc.name}</strong><br><small>${loc.runners} inscrits</small>`;
  div.onclick = () => map.flyTo(loc.coords, 14);
  locationList.appendChild(div);
});

// 4. Génération de la grille des courses
const runsGrid = document.getElementById("runsGrid");
runsData.forEach((run) => {
  const card = document.createElement("div");
  card.className = "run-card";
  card.innerHTML = `
        <div class="run-badge">Nouveau</div>
        <h3>${run.title}</h3>
        <p>📍 ${run.loc}</p>
        <p>📅 ${run.date} à ${run.time}</p>
        <div class="run-footer">
            <span>🏁 ${run.dist}</span>
            <button class="btn btn-primary btn-sm">Participer</button>
        </div>
    `;
  runsGrid.appendChild(card);
});

// 5. Menu Mobile
const menuToggle = document.getElementById("menuToggle");
const mobileNav = document.getElementById("mobileNav");

menuToggle.addEventListener("click", () => {
  mobileNav.classList.toggle("active");
});
