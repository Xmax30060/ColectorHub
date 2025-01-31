(function () {
    let USERS_STORAGE = JSON.parse(localStorage.getItem("users")) || {};
    let activeUser = null;

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

    function login() {
        const username = document.getElementById("login-username").value;
        const password = document.getElementById("login-password").value;

        if (!USERS_STORAGE[username] || USERS_STORAGE[username].password !== password) {
            document.getElementById("login-error").textContent = "Nom d'utilisateur ou mot de passe incorrect.";
            return;
        }

        activeUser = username;
        document.getElementById("user-name").textContent = activeUser;
        showMainScreen();
        loadCollection();
    }

    function logout() {
        activeUser = null;
        stopScanner();
        showLogin();
    }

    function loadCollection() {
        const list = document.getElementById("scanned-items");
        list.innerHTML = "";
        const collection = USERS_STORAGE[activeUser]?.collection || [];
        collection.forEach(item => {
            const listItem = document.createElement("li");
            listItem.textContent = item;
            list.appendChild(listItem);
        });
    }

    function addScannedItem(data) {
        const collection = USERS_STORAGE[activeUser]?.collection || [];
        collection.push(data);
        USERS_STORAGE[activeUser].collection = collection;
        localStorage.setItem("users", JSON.stringify(USERS_STORAGE));
        loadCollection();
    }

    let activeScanner = null;    


    function handleImage() {
        const input = document.getElementById("image-input");
        const previewsContainer = document.getElementById("image-previews");

        if (input.files && input.files[0]) {
            const file = input.files[0];

            const reader = new FileReader();
            reader.onload = function (e) {
                const imagePreview = document.createElement("img");
                imagePreview.src = e.target.result;
                imagePreview.alt = file.name;
                imagePreview.className = "preview-image";

                previewsContainer.appendChild(imagePreview);
            };

            reader.readAsDataURL(file);

            const fakeData = "Objet depuis image : " + file.name;
            addScannedItem(fakeData);
        }
    }

    function showSignup() {
        document.getElementById("signup-screen").style.display = "block";
        document.getElementById("login-screen").style.display = "none";
        document.getElementById("main-screen").style.display = "none";
    }

    function showLogin() {
        document.getElementById("signup-screen").style.display = "none";
        document.getElementById("login-screen").style.display = "block";
        document.getElementById("main-screen").style.display = "none";
    }

    function showMainScreen() {
        document.getElementById("signup-screen").style.display = "none";
        document.getElementById("login-screen").style.display = "none";
        document.getElementById("main-screen").style.display = "block";
    }
    function clearUserStorage() {
        if (activeUser) {
            // Vérifier si l'utilisateur est connecté
            USERS_STORAGE[activeUser].collection = []; // Réinitialiser la collection
            localStorage.setItem("users", JSON.stringify(USERS_STORAGE)); // Mettre à jour le stockage local
            loadCollection(); // Recharger l'affichage de la collection
            alert("La collection de l'utilisateur a été vidée !");
        } else {
            alert("Aucun utilisateur n'est connecté !");
        }
    }
    clearUserStorage();
    window.signup = signup;
    window.login = login;
    window.logout = logout;
    window.handleImage = handleImage;    
    window.showLogin = showLogin;
})();
//Work
