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
                            if (data.image) {
                                document.getElementById("profile-image-preview").src = data.image_url;
                            }
    
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
        const fileInput = document.getElementById("profile-image-input");
        const formData = new FormData();
    
        const personalData = {
            username: document.getElementById("username")?.value || "",
            email: document.getElementById("email")?.value || "",
            phone: document.getElementById("phone")?.value || ""
        };
    
        formData.append("username", personalData.username);
        formData.append("email", personalData.email);
        formData.append("phone", personalData.phone);
    
        if (fileInput && fileInput.files.length > 0) {
            formData.append("profile_image", fileInput.files[0]);
        }
    
        fetch("backend/update_profile.php", {
            method: "POST",
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                showMessage("Személyes adatok sikeresen frissítve!", 'success');
                if (data.image_url) {
                    const imgPreview = document.getElementById("profile-image-preview");
                    if (imgPreview) imgPreview.src = data.image_url;
                }
            } else {
                showMessage("Hiba történt a mentés során.", 'error');
            }
        })
        .catch(error => {
            console.error("Hálózati hiba: ", error);
            showMessage("Hálózati hiba történt!", 'error');
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
            showMessage("Kérlek, töltsd ki az összes mezőt!", 'error');
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
                showMessage("Cím sikeresen frissítve!", 'success');
            } else {
                showMessage("Hiba történt: " + data.message, 'error');
            }
        })
        .catch(error => {
            console.error("Hálózati hiba:", error);
            showMessage("Hálózati hiba történt!", 'error');
        });
    });
});

document.addEventListener("DOMContentLoaded", () => {
    // Ellenőrizzük, hogy van-e tárolt üzenet a localStorage-ban
    const loginMessage = localStorage.getItem("loginMessage");

    if (loginMessage) {
        // Üzenet megjelenítése
        showMessage(loginMessage, 'success');

        // Üzenet eltávolítása a localStorage-ból
        localStorage.removeItem("loginMessage");
    }
});

function showMessage(message, type = 'error', duration = 3000) {
    const messageBox = document.getElementById('message-box');
    if (!messageBox) {
        console.error("A 'message-box' elem nem található!");
        return;
    }

    messageBox.textContent = message;
    messageBox.className = `message-box ${type} show`;

    // Az üzenet eltüntetése a megadott idő után
    setTimeout(() => {
        messageBox.classList.remove('show');
    }, duration);
}
