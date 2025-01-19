// Mot de passe pour accéder au site
const PASSWORD = "1234";

// Fonction de connexion
function login() {
    const inputPassword = document.getElementById("password").value;
    if (inputPassword === PASSWORD) {
        document.getElementById("login-screen").style.display = "none";
        document.getElementById("main-screen").style.display = "block";
        startScanner();
    } else {
        document.getElementById("login-error").textContent = "Mot de passe incorrect.";
    }
}

// Scanner de QR Code
let scanner;

function startScanner() {
    const video = document.getElementById("camera");

    // Vérifie si la caméra est disponible
    navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
            video.srcObject = stream;
            scanner = stream;

            // Détection simple (simulation de QR code)
            video.addEventListener("click", () => {
                const fakeData = "Objet-" + Math.floor(Math.random() * 100); // Simulation de données scannées
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

// Ajouter un objet scanné à la liste
function addScannedItem(data) {
    const list = document.getElementById("scanned-items");
    const listItem = document.createElement("li");
    listItem.textContent = data;
    list.appendChild(listItem);
}
