document.addEventListener("DOMContentLoaded", () => {
    const profileLink = document.getElementById("profileButton");

    // Ellenőrizzük, hogy be van-e jelentkezve
    fetch("backend/check_session.php")
        .then(response => response.json())
        .then(data => {
            if (data.loggedIn) {
                profileLink.href = "profile.html";  // Ha be van jelentkezve, a profilra visz
            } else {
                profileLink.href = "login1.html";  // Ha nincs bejelentkezve, marad a login oldalon
            }
        })
        .catch(error => console.error("Hiba a session ellenőrzésnél:", error));
});
