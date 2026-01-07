const eventGrid = document.getElementById("eventGrid");

// 1. Fonction pour charger les événements (Postes)
async function loadEvents() {
  try {
    const response = await fetch("http://localhost:3000/api/runs");
    const runs = await response.json();

    eventGrid.innerHTML = runs
      .map(
        (run) => `
            <div class="event-card">
                <h3>${run.titre}</h3>
                <p>📍 ${run.lieu_depart}, ${run.ville}</p>
                <p>🏁 <strong>${run.distance_km} km</strong></p>
                <span class="badge">${run.niveau_requis}</span>
            </div>
        `
      )
      .join("");
  } catch (err) {
    console.error("Erreur chargement:", err);
  }
}

// 2. Gestion du formulaire de création
document.getElementById("eventForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const newRun = {
    titre: document.getElementById("title").value,
    ville: document.getElementById("city").value,
    date: document.getElementById("date").value,
    distance: document.getElementById("distance").value,
    niveau: document.getElementById("level").value,
  };

  const response = await fetch("http://localhost:3000/api/create-run", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newRun),
  });

  if (response.ok) {
    alert("Run publié avec succès !");
    loadEvents(); // Rafraîchir la liste
  }
});

loadEvents();
// Frontend/script.js
