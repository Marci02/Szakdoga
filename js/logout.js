document.addEventListener("DOMContentLoaded", () => {
    const logoutButtons = document.querySelectorAll(".logoutButton");

    if (logoutButtons.length > 0) {
        logoutButtons.forEach(button => {
            button.addEventListener("click", () => {
                fetch("backend/logout.php", {
                    method: "POST",
                    credentials: "include"
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        window.location.href = "index.html";
                    } else {
                        console.error("Hiba a kijelentkezéskor:", data.error);
                    }
                })
                .catch(error => console.error("Hálózati hiba:", error));
            });
        });
    } else {
        console.warn("❌ Nem található egyetlen logout gomb sem.");
    }
});
