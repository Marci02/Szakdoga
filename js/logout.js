document.addEventListener("DOMContentLoaded", () => {
    const logoutButton = document.getElementById("logoutButton");

    if (!logoutButton) {
        console.error("Hiba: A logoutButton nem található.");
        return;
    }

    logoutButton.addEventListener("click", () => {
        fetch("backend/logout.php", { method: "POST" })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    console.log("Sikeres kijelentkezés.");
                    window.location.href = "login1.html"; // Átirányítás a bejelentkező oldalra
                } else {
                    console.error("Hiba a kijelentkezés során.");
                }
            })
            .catch(error => console.error("Hálózati hiba:", error));
    });
});
