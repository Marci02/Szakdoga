document.addEventListener("DOMContentLoaded", () => {
    const profileButton = document.getElementById("profileButton");

    fetch("backend/check_session.php")
        .then(response => response.json())
        .then(data => {
            if (data.loggedIn) {
                profileButton.target = "_blank";
                profileButton.href = "profile.html";  // Profil oldalra irányít
            } else {
                profileButton.innerHTML = "🔑 Bejelentkezés";
                profileButton.href = "login1.html";  // Bejelentkező oldalra visz
            }
        })
        .catch(error => console.error("Hiba a session ellenőrzésnél:", error));
});
