document.addEventListener("DOMContentLoaded", () => {
    const profileButton = document.getElementById("profileButton");

    updateCart();

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
                console.log("Profil adatok:", data); // 🔍 Debug konzol kiírás
    
                const usernameEl = document.getElementById("username");
                const emailEl = document.getElementById("email");
                const phoneEl = document.getElementById("phone");
                const profileImageUrlEl = document.getElementById("profile-image-input");
                const profileImageEl = document.getElementById("profile-image-preview");
                const postcodeEl = document.getElementById("postcode");
                const cityEl = document.getElementById("city");
                const countyEl = document.getElementById("county");
                const streetEl = document.getElementById("street_address");
                const addressEl = document.getElementById("house_number");
    
                if (usernameEl) usernameEl.value = data.firstname + " " + data.lastname;
                if (emailEl) emailEl.value = data.email;
                if (phoneEl) phoneEl.value = data.phone_number;
                if (postcodeEl) postcodeEl.value = data.postcode;
                if (cityEl) cityEl.value = data.city;
                if (countyEl) countyEl.value = data.county;
                if (streetEl) streetEl.value = data.street || ""; 
                if (addressEl) addressEl.value = data.address || "";

                if (profileImageEl && data.image) {
                    profileImageEl.src = data.image;
                }
            }
        })
        .catch(error => console.error("Hiba a profil betöltésekor:", error));
    }
});

function formatPrice(price) {
    // Biztosítjuk, hogy a price string típusú legyen
    const cleanPrice = String(price).replace(/\D/g, '');  // A nem szám karaktereket eltávolítjuk
    // Visszafordítjuk a számot és szóközökkel tagoljuk
    const formattedPrice = cleanPrice.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    return formattedPrice;
  }