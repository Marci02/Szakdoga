document.addEventListener("DOMContentLoaded", () => {
    const profileButton = document.getElementById("profileButton");

    if (!profileButton) {
        console.error("Hiba: A profileButton nem található.");
        return;
    }

    fetch("backend/check_session.php")
        .then(response => response.json())
        .then(data => {
            if (data.loggedIn) {
                console.log("Bejelentkezett felhasználó, átirányítás a profil oldalra.");
                profileButton.setAttribute("href", "profile.html");
            } else {
                console.log("Nincs bejelentkezve, átirányítás a login oldalra.");
                profileButton.setAttribute("href", "login1.html");
            }
        })
        .catch(error => console.error("Hiba a session ellenőrzésnél:", error));
});
