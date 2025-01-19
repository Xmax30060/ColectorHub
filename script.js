// Stockage des utilisateurs
let USERS_STORAGE = JSON.parse(localStorage.getItem("users")) || {};
let activeUser = null;

// Fonction d'inscription
function signup() {
    const username = document.getElementById("signup-username").value;
    const password = document.getElementById("signup-password").value;

    if (!username || !password) {
        document.getElementById("signup-error").textContent = "Veuillez remplir tous les champs.";
        return;
    }

    if (USERS_STORAGE[username]) {
        document.getElementById("signup-error").textContent = "Nom d'utilisateur déjà pris.";
        return;
    }

    USERS_STORAGE[username] = { password, collection: [] };
    localStorage.setItem("users", JSON.stringify(USERS_STORAGE));
    alert("Inscription réussie !");
    showLogin();
}

// Fonction de connexion
function login() {
    const username = document.getElementById("login-username").value;
    const password = document.getElementById("login-password").value;

    if (!USERS_STORAGE[username] || USERS_STORAGE[username].password !== password) {
        document.getElementById("login-error").textContent = "Nom d'utilisateur ou mot de passe incorrect.";
        return;
    }

    activeUser = username;
    document.getElementById("login-screen").style.display = "none";
    document.getElementById("main-screen").style.display = "block";
    document.getElementById("user-name").textContent = activeUser;
    loadCollection();
    startScanner();
}

// Fonction de déconnexion
function logout() {
    activeUser = null;
    document.getElementById("main-screen").style.display = "none";
    document.getElementById("login-screen").style.display = "block";
}

// Charger la collection de l'utilisateur connecté
function loadCollection() {
    const list = document.getElementById("scanned-items");
    list.innerHTML = ""; // Vide la liste
    const collection = USERS_STORAGE[activeUser]?.collection || [];
    collection.forEach(item => {
        const listItem = document.createElement("li");
        listItem.textContent = item;
        list.appendChild(listItem);
    });
}

// Ajouter un objet scanné
function addScannedItem(data) {
    const collection = USERS_STORAGE[activeUser]?.collection || [];
    collection.push(data);
    USERS_STORAGE[activeUser].collection = collection;
    localStorage.setItem("users", JSON.stringify(USERS_STORAGE));
    loadCollection();
}

// Scanner via caméra
let activeScanner = null;

function startScanner() {
    const video = document.getElementById("camera");

    navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
            video.srcObject = stream;
            activeScanner = stream;

            // Détection (simulation)
            video.addEventListener("click", () => {
                const fakeData = "Objet-" + Math.floor(Math.random() * 100);
                addScannedItem(fakeData);
            });
        })
        .catch(err => {
            alert("Erreur : Impossible d'accéder à la caméra.");
        });
}

// Arrêter le scanner
function stopScanner() {
    if (activeScanner) {
        const tracks = activeScanner.getTracks();
        tracks.forEach(track => track.stop());
    }
}

// Scanner depuis une image
function handleImage() {
    const input = document.getElementById("image-input");
    if (input.files && input.files[0]) {
        const file = input.files[0];
        const fakeData = "Objet depuis image : " + file.name;
        addScannedItem(fakeData);
    }
}
