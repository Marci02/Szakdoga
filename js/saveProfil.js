document.addEventListener("DOMContentLoaded", () => {
    // Lapok kezelése
    function openTab(evt, tabName) {
        document.querySelectorAll(".tab-content").forEach(tab => tab.classList.remove("active"));
        document.getElementById(tabName).classList.add("active");
        document.querySelectorAll(".tab-button").forEach(btn => btn.classList.remove("active"));
        evt.currentTarget.classList.add("active");
    }
    
    window.openTab = openTab;

    // Felhasználói adatok betöltése
    fetch("backend/get_profile.php")
    .then(response => {
        if (!response.ok) {
            throw new Error(`Hálózati hiba: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log("Backend válasz:", data); // 📌 Ellenőrzéshez

        if (data.success) {
            document.getElementById("username").value = `${data.firstname} ${data.lastname}`;
            document.getElementById("email").value = data.email;
            document.getElementById("phone").value = data.phone_number || "";
            document.getElementById("profile-image-url").value = data.image || "";
            document.getElementById("profile-image").src = data.image || ""; // ✔ Alapértelmezett kép, ha nincs megadva

            // 📌 Város és megye ellenőrzés
            console.log("City:", data.city || "Nincs adat");
            console.log("County:", data.county || "Nincs adat");

            document.getElementById("postcode").value = data.postcode || "";
            document.getElementById("city").value = data.city || "Nincs megadva";
            document.getElementById("county").value = data.county || "Nincs megadva";
        } else {
            console.error("Hiba a profiladatok lekérésekor: ", data.error || "Ismeretlen hiba");
        }
    })
    .catch(error => console.error("Hálózati hiba:", error));


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
    document.getElementById("saveAddress").addEventListener("click", () => {
        const addressData = {
            postcode: document.getElementById("postcode").value,
            city: document.getElementById("city").value,
            county: document.getElementById("county").value
        };

        fetch("backend/update_address.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(addressData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert("Szállítási cím sikeresen frissítve!");
            } else {
                alert("Hiba történt a mentés során.");
            }
        });
    });

    // Kijelentkezés kezelése
    document.getElementById("logoutButton").addEventListener("click", () => {
        fetch("backend/logout.php")
            .then(() => window.location.href = "index.html");
    });
});
