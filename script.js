// 1. Gestion de l'inscription via FETCH
document
  .getElementById("registerForm")
  .addEventListener("submit", async (e) => {
    e.preventDefault();

    const data = {
      nom: document.getElementById("nom").value,
      email: document.getElementById("email").value,
      niveau: document.getElementById("niveau").value,
    };

    try {
      // Le lien vers le backend Node.js que nous ferons après
      const response = await fetch("http://localhost:3000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        document.getElementById("msg").innerText = "Bienvenue dans l'équipe !";
        document.getElementById("msg").style.color = "green";
      }
    } catch (err) {
      document.getElementById("msg").innerText =
        "Erreur de connexion au serveur.";
    }
  });

// 2. Exemple de données avec Géolocalisation
const runs = [
  { titre: "Run Corniche", ville: "Casablanca", lat: 33.595, lng: -7.666 },
  { titre: "Forêt Maâmora", ville: "Rabat", lat: 34.013, lng: -6.712 },
];

const listContainer = document.getElementById("run-list");
runs.forEach((run) => {
  const card = document.createElement("div");
  card.className = "card";
  card.innerHTML = `
        <h3>${run.titre}</h3>
        <p>Ville: ${run.ville}</p>
        <p>📍 Coordonnées: ${run.lat}, ${run.lng}</p>
        <button onclick="alert('GPS: ${run.lat}, ${run.lng}')">Voir l'itinéraire</button>
    `;
  listContainer.appendChild(card);
});
