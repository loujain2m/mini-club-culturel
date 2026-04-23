// script.js - Version complète corrigée

document.addEventListener("DOMContentLoaded", function () {

    // --- 1. DONNÉES (TP 8) ---
    const evenements = [
        { id: 1, titre: "Les Voix de la Paix", date: "08 Oct. 2025", lieu: "Tunis", image: "images/img1.webp", description: "Un événement musical qui rassemble des artistes pour promouvoir la paix et la culture.", places: "50" },
        { id: 2, titre: "Les Belles de Carthage", date: "12 Oct. 2025", lieu: "El Kram", image: "images/img2.webp", description: "Une immersion dans le patrimoine tunisien avec des spectacles traditionnels.", places: "80" },
        { id: 3, titre: "Vampire Cup", date: "06 Oct. 2025", lieu: "Monastir", image: "images/img3.webp", description: "Compétition stratégique où les participants s’affrontent dans des jeux intellectuels.", places: "30" },
        { id: 4, titre: "Health & Olive Day", date: "07 Oct. 2025", lieu: "Monastir", image: "images/img4.webp", description: "Journée dédiée à la santé et aux produits locaux comme l’huile d’olive.", places: "100" }
    ];

    // --- 2. SÉCURITÉ (TP 7) ---
    const path = window.location.pathname;
    const currentPage = path.split("/").pop() || "index.html";
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    const publicPages = ["index.html", "about.html", "contact.html"];

    if (!isLoggedIn && !publicPages.includes(currentPage)) {
        window.location.href = "index.html";
    }

    // --- 3. CONNEXION LIBRE ---
    const loginForm = document.getElementById("login-form");
    if (loginForm) {
        loginForm.addEventListener("submit", function (e) {
            e.preventDefault();
            const email = document.getElementById("email").value.trim();
            const password = document.getElementById("password").value.trim();
            if (email.includes("@") && password.length > 0) {
                localStorage.setItem("isLoggedIn", "true");
                localStorage.setItem("user", JSON.stringify({ email: email }));
                window.location.href = "home.html";
            } else {
                const err = document.getElementById("error-message");
                if(err) {
                    err.textContent = "Email ou mot de passe invalide.";
                    err.style.display = "block";
                }
            }
        });
    }

    // --- 4. ACCUEIL DYNAMIQUE (home.html) ---
    const gridEvents = document.querySelector(".grid-evenements");
    if (gridEvents) {
        gridEvents.innerHTML = evenements.map(ev => `
            <article class="event-carte">
                <img src="${ev.image}" alt="${ev.titre}">
                <div class="event-container">
                    <h3>${ev.titre}</h3>
                    <p>📅 ${ev.date}</p>
                    <a href="event-details.html?id=${ev.id}" class="btn-primary">Détails</a>
                </div>
            </article>
        `).join('');
    }

    // --- 5. DÉTAILS (event-details.html) ---
    if (currentPage === "event-details.html") {
        const id = parseInt(new URLSearchParams(window.location.search).get('id'));
        const ev = evenements.find(e => e.id === id);
        if (ev) {
            if(document.getElementById("event-titre")) document.getElementById("event-titre").textContent = ev.titre;
            if(document.getElementById("event-image")) document.getElementById("event-image").src = ev.image;
            if(document.getElementById("event-infos")) document.getElementById("event-infos").innerHTML = `<p>📍 ${ev.lieu} | 🎟 ${ev.places} places</p>`;
            if(document.getElementById("event-description")) document.getElementById("event-description").textContent = ev.description;
            if(document.getElementById("inscription-link")) document.getElementById("inscription-link").href = `register-event.html?id=${ev.id}`;
        }
    }

    // --- 5bis. PAGE INSCRIPTION : charger l'événement (register-event.html) ---
    if (currentPage === "register-event.html") {
        const id = parseInt(new URLSearchParams(window.location.search).get('id'));
        const ev = evenements.find(e => e.id === id);
        const titleEl = document.getElementById("event-title");
        const imgEl = document.getElementById("event-image");
        if (ev && titleEl && imgEl) {
            titleEl.textContent = `Inscription : ${ev.titre}`;
            imgEl.src = ev.image;
            imgEl.alt = ev.titre;
            // Optionnel : forcer un style pour l'image
            imgEl.style.maxWidth = "300px";
            imgEl.style.borderRadius = "10px";
        } else if (titleEl) {
            titleEl.textContent = "Événement non trouvé";
        }
    }

    // --- 6. INSCRIPTION (TP 9) - Formulaire sur register-event.html ---
    const regForm = document.getElementById("register-form");
    if (regForm) {
        regForm.addEventListener("submit", function (e) {
            e.preventDefault();
            const nom = document.getElementById("nom").value.trim();
            const email = document.getElementById("email").value.trim();
            const tel = document.getElementById("telephone").value.trim();
            const places = document.getElementById("places").value;

            if (nom.length >= 3 && email.includes("@") && /^\d{8}$/.test(tel)) {
                let list = JSON.parse(localStorage.getItem("inscriptions") || "[]");
                
                // Récupérer le nom de l'événement depuis l'URL de manière fiable
                const urlParams = new URLSearchParams(window.location.search);
                const eventId = parseInt(urlParams.get('id'));
                const ev = evenements.find(e => e.id === eventId);
                const eventName = ev ? ev.titre : "Événement inconnu";
                
                list.push({ 
                    id: Date.now(), 
                    nom, 
                    email, 
                    places, 
                    event: eventName
                });
                localStorage.setItem("inscriptions", JSON.stringify(list));
                
                const successDiv = document.getElementById("success-message");
                if (successDiv) {
                    successDiv.textContent = "Inscription enregistrée ! Redirection...";
                    successDiv.style.display = "block";
                }
                setTimeout(() => window.location.href = "profile.html", 1500);
            } else {
                const errorDiv = document.getElementById("error-message");
                if (errorDiv) {
                    errorDiv.textContent = "Vérifiez vos champs (nom≥3, email valide, téléphone 8 chiffres).";
                    errorDiv.style.display = "block";
                }
            }
        });
    }

    // --- 7. PROFIL (profile.html) - Affichage initial ---
    if (currentPage === "profile.html") {
        const user = JSON.parse(localStorage.getItem("user"));
        if (user && document.getElementById("user-email")) {
            document.getElementById("user-email").textContent = user.email;
        }
        refreshProfile(); // Appel de la fonction globale pour afficher la liste
    }
});


// ==========================================
// FONCTIONS GLOBALES (Accessibles via onclick)
// ==========================================

// Rafraîchir la liste des inscriptions sur profile.html
function refreshProfile() {
    const listDiv = document.getElementById("inscriptions-list");
    if (!listDiv) return;

    const data = JSON.parse(localStorage.getItem("inscriptions") || "[]");

    if (data.length === 0) {
        listDiv.innerHTML = "<p>Aucune inscription trouvée.</p>";
    } else {
        listDiv.innerHTML = "<ul>" + data.map(i => `
            <li style="margin-bottom:10px; display:flex; justify-content:space-between; align-items:center; background:#fff; padding:15px; border-radius:10px; box-shadow: 0 2px 5px rgba(0,0,0,0.05);">
                <span><strong>${i.event}</strong> - ${i.nom} (${i.places} places)</span>
                <button onclick="supprimerInscription(${i.id})" style="background:#820c0a; color:white; border:none; padding:8px 12px; border-radius:5px; cursor:pointer;">
                    Supprimer
                </button>
            </li>
        `).join('') + "</ul>";
    }
}

// Supprimer une inscription spécifique
function supprimerInscription(idUnique) {
    if (confirm("Voulez-vous supprimer cette inscription ?")) {
        let inscriptions = JSON.parse(localStorage.getItem("inscriptions") || "[]");
        inscriptions = inscriptions.filter(item => item.id !== idUnique);
        localStorage.setItem("inscriptions", JSON.stringify(inscriptions));
        refreshProfile();
    }
}

// Déconnexion
function logout() {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("user");
    window.location.href = "index.html";
}