document.addEventListener("DOMContentLoaded", () => {
    const profileButton = document.getElementById("profileButton");
    const profileMenu = document.getElementById("profileMenu");
    const logoutButton = document.getElementById("logout");

    fetch("backend/check_session.php")
        .then(response => response.json())
        .then(data => {
            if (data.loggedIn) {
                // 🔹 Ha be van jelentkezve, profil gomb popupot nyit
                profileButton.href = "javascript:void(0)";

                // Popup megjelenítése / eltüntetése
                profileButton.addEventListener("click", (event) => {
                    event.stopPropagation();
                    profileMenu.classList.toggle("active");
                });

                // Külső kattintásra zárja be
                document.addEventListener("click", (event) => {
                    if (!profileButton.contains(event.target) && !profileMenu.contains(event.target)) {
                        profileMenu.classList.remove("active");
                    }
                });

                // Kijelentkezés
                logoutButton.addEventListener("click", () => {
                    fetch("backend/logout.php")
                        .then(() => {
                            window.location.href = "index.html";
                        })
                        .catch(error => console.error("Hiba a kijelentkezésnél:", error));
                });

            } else {
                // 🔹 Ha nincs bejelentkezve, nincs popup
                profileMenu.style.display = "none";
                profileButton.href = "login1.html"; // Login oldalra visz
            }
        })
        .catch(error => console.error("Hiba a session ellenőrzésnél:", error));
});
