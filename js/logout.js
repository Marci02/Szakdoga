document.addEventListener("DOMContentLoaded", () => {
    const logoutButton = document.getElementById("logoutButton");

    if (logoutButton) {
        logoutButton.addEventListener("click", () => {
            fetch("backend/logout.php", {
                method: "POST",
                credentials: "include"
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    window.location.href = "index.html"; // Visszairányít a bejelentkezési oldalra
                } else {
                    console.error("Hiba a kijelentkezéskor:", data.error);
                }
            })
            .catch(error => console.error("Hálózati hiba:", error));
        });
    } else {
        console.error("❌ A logout gomb nem található!");
    }
});
