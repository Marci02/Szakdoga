let profileToDelete = true; // Globális változó a törlendő profil jelzésére

document.addEventListener("DOMContentLoaded", () => {
    const deleteProfileButtons = document.querySelectorAll(".deleteProfile");
    console.log(deleteProfileButtons);

    // Iterálunk az összes deleteProfile osztályú gombon
    deleteProfileButtons.forEach(deleteProfileButton => {
        deleteProfileButton.addEventListener("click", () => {
            // Megjelenítjük a megerősítő modalt
            const deleteModal = document.getElementById("delete-profile-modal");
            deleteModal.style.display = "flex";

            // Eseményfigyelők a modal gombjaihoz
            const confirmButton = document.getElementById("confirm-profile-delete-button");
            const cancelButton = document.getElementById("cancel-profile-delete-button");

            // Ha a felhasználó megerősíti a törlést
            confirmButton.onclick = () => {
                fetch("backend/deleteProfile.php", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ sessionUserId: profileToDelete })
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        // Üzenet mentése a localStorage-ba
                        localStorage.setItem("deleteMessage", "Sikeresen törölted a fiókodat!");

                        // Átirányítás az index.html oldalra
                        window.location.href = "index.html";
                    } else {
                        showMessage("Hiba történt: " + data.message, 'error');
                    }
                })
                .catch(error => {
                    console.error("Hálózati hiba:", error);
                    showMessage("Hálózati hiba történt!", 'error');
                })
                .finally(() => {
                    // Bezárjuk a modalt
                    deleteModal.style.display = "none";
                    profileToDelete = null;
                });
            };

            // Ha a felhasználó megszakítja a törlést
            cancelButton.onclick = () => {
                deleteModal.style.display = "none";
                profileToDelete = null;
            };
        });
    });
});