document.addEventListener("DOMContentLoaded", () => {
    const profileButton = document.getElementById("profileButton");

    // Ha van profileButton (például navbarban), akkor ellenőrizzük a bejelentkezést
    if (profileButton) {
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
    }

    // Ha a felhasználó a profile.html oldalon van, töltsük be az adatokat
    if (window.location.pathname.includes("profile.html")) {
        fetch("backend/get_profile.php")
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    window.location.href = "login1.html"; // Ha nincs bejelentkezve, irány a login
                } else {
                    document.getElementById("fullname").textContent = data.firstname + " " + data.lastname;
                    document.getElementById("email").textContent = data.email;
                    document.getElementById("created").textContent = data.created;
                    document.getElementById("phone").textContent = data.phone_number;
                    document.getElementById("postcode").textContent = data.postcode;

                    if (data.image) {
                        document.getElementById("profile-pic").src = "uploads/" + data.image;
                    }
                }
            })
            .catch(error => console.error("Hiba a profil betöltésekor:", error));
    }
});
