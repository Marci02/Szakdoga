document.addEventListener("DOMContentLoaded", () => {
    // Lapok kezelése
    function openTab(evt, tabName) {
        document.querySelectorAll(".tab-content").forEach(tab => tab.classList.remove("active"));
        document.getElementById(tabName).classList.add("active");
        document.querySelectorAll(".tab-button").forEach(btn => btn.classList.remove("active"));
        evt.currentTarget.classList.add("active");
    }
    
    window.openTab = openTab;

    document.addEventListener("DOMContentLoaded", () => {
        // Először ellenőrizzük, hogy a felhasználó be van-e jelentkezve
        fetch("backend/check_session.php")
            .then(response => response.json())
            .then(sessionData => {
                if (!sessionData.logged_in) {
                    // Ha nincs bejelentkezve, irányítsuk át a login oldalra
                    window.location.href = "login.html";
                    return;
                }
    
                // Ha be van jelentkezve, lekérjük a profiladatokat
                fetch("backend/get_profile.php")
                    .then(response => response.json())
                    .then(data => {
                        console.log("Backend válasz:", data);
    
                        if (data.success) {
                            document.getElementById("username").value = data.firstname + " " + data.lastname;
                            document.getElementById("email").value = data.email;
                            document.getElementById("phone").value = data.phone_number;
                            document.getElementById("profile-image-url").value = data.image;
                            document.getElementById("profile-image").src = data.image;
    
                            document.getElementById("postcode").value = data.postcode || "";
                            document.getElementById("city").value = data.city || "Nincs megadva";
                            document.getElementById("county").value = data.county || "Nincs megadva";
                        } else {
                            console.error("Hiba a profiladatok lekérésekor, data.success:", data.success);
                        }
                    })
                    .catch(error => console.error("Hálózati hiba: ", error));
            })
            .catch(error => console.error("Hálózati hiba: ", error));
    });
    

    // Személyes adatok mentése
    document.getElementById("savePersonal").addEventListener("click", () => {
        const personalData = {
            username: document.getElementById("username").value,
            email: document.getElementById("email").value,
            phone: document.getElementById("phone").value,
            image: document.getElementById("profile-image-url").value
        };

        fetch("backend/update_profile.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(personalData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert("Személyes adatok sikeresen frissítve!");
            } else {
                alert("Hiba történt a mentés során.");
            }
        });
    });

    // Szállítási cím mentése
    document.getElementById("saveAddress").addEventListener("click", function() {
        const postcode = document.getElementById("postcode").value;
        const city = document.getElementById("city").value;
        const county = document.getElementById("county").value;
        const street = document.getElementById("street_address").value;
        const houseNumber = document.getElementById("house_number").value;
    
        // Ellenőrizzük, hogy minden mező ki van-e töltve
        if (!postcode || !city || !county || !street || !houseNumber) {
            alert("Kérlek, töltsd ki az összes mezőt!");
            return;
        }
    
        fetch("backend/update_address.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                postcode: postcode,
                city: city,
                county: county,
                street_address: street,
                house_number: houseNumber
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert("Cím sikeresen frissítve!");
            } else {
                alert("Hiba történt: " + data.message);
            }
        })
        .catch(error => console.error("Hálózati hiba:", error));
    });

    // Kijelentkezés kezelése
    document.getElementById("logoutButton").addEventListener("click", () => {
        fetch("backend/logout.php")
            .then(() => window.location.href = "index.html");
    });
});
