document.addEventListener("DOMContentLoaded", () => {
    const profileButton = document.getElementById("profileButton");
    const logoutButton = document.getElementById("logoutButton");

    if (!profileButton || !logoutButton) {
        console.error("Hiba: A profil vagy a kijelentkezés gomb nem található az oldalon.");
        return; // Ha nincsenek az elemek, akkor ne futtassuk tovább a kódot
    }

    function checkSession() {
        fetch("backend/check_session.php")
            .then(response => response.json())
            .then(data => {
                if (data.loggedIn) {
                    profileButton.innerHTML = `👤 ${data.username || "Profil"}`;
                    profileButton.href = "profile.html";
                    logoutButton.style.display = "block"; // Megjelenik a kijelentkezés gomb
                } else {
                    profileButton.innerHTML = "🔑 Bejelentkezés";
                    profileButton.href = "login1.html";
                    logoutButton.style.display = "none"; // Kijelentkezés gomb elrejtése
                }
            })
            .catch(error => console.error("Hiba a session ellenőrzésnél:", error));
    }

    checkSession(); // Ellenőrizzük a sessiont az oldal betöltésekor

    logoutButton.addEventListener("click", () => {
        fetch("backend/logout.php")
            .then(response => response.json())
            .then(() => {
                window.location.href = "login1.html"; // Átirányítás a bejelentkezési oldalra
            })
            .catch(error => console.error("Hiba a kijelentkezésnél:", error));
    });
});
