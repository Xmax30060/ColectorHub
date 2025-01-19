// Stockage des utilisateurs
let users = JSON.parse(localStorage.getItem("users")) || {};
let currentUser = null;

// Fonction d'inscription
function signup() {
    const username = document.getElementById("signup-username").value;
    const password = document.getElementById("signup-password").value;

    if (!username || !password) {
        document.getElementById("signup-error").textContent = "Veuillez remplir tous les champs.";
        return;
    }

    if (users[username]) {
        document.getElementById("signup-error").textContent = "Nom d'utilisateur déjà pris.";
        return;
    }

    users[username] = { password, collection: [] };
    localStorage.setItem("users", JSON.stringify(users));
    alert("Inscription réussie !");
    showLogin();
}

// Fonction de connexion
function login() {
    const username = document.getElementById("login-username").value;
    const password = document.getElementById("login-password").value;

    if (!users[username] || users[username].password !== password) {
        document.getElementById("login-error").textContent = "Nom d'utilisateur ou mot de passe incorrect.";
        return;
    }

    currentUser = username;
    document.getElementById("login-screen").style.display = "none";
    document.getElementById("main-screen").style.display = "block";
    document.getElementById("user-name").textContent = currentUser;
    loadCollection();
    startScanner();
}

// Fonction de déconnexion
function logout() {
    currentUser = null;
    document.getElementById("main-screen").style.display = "none";
    document.getElementById("login-screen").style.display = "block";
}

// Charger la collection de l'utilisateur connecté
function loadCollection() {
    const list = document.getElementById("scanned-items");
    list.innerHTML = ""; // Vide la liste
    const collection = users[currentUser]?.collection || [];
    collection.forEach(item => {
        const listItem = document.createElement("li");
        listItem.textContent = item;
        list.appendChild(listItem);
    });
}

// Ajouter un objet scanné
function addScannedItem(data) {
    const collection = users[currentUser]?.collection || [];
    collection.push(data);
    users[currentUser].collection = collection;
    localStorage.setItem("users", JSON.stringify(users));
    loadCollection();
}

// Scanner via caméra
let scanner;

function startScanner() {
    const video = document.getElementById("camera");

    navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
            video.srcObject = stream;
            scanner = stream;

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
    if (scanner) {
        const tracks = scanner.getTracks();
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
