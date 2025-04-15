document.addEventListener("DOMContentLoaded", () => {
    const logoutButtons = document.querySelectorAll(".logoutButton");

    logoutButtons.forEach(button => {
        button.addEventListener("click", () => {
            // Üzenet tárolása a localStorage-ban
            localStorage.setItem("logoutMessage", "Sikeres kijelentkezés!");

            // Kijelentkezési kérés küldése
            fetch("backend/logout.php")
                .then(() => {
                    // Átirányítás az index.html-re
                    window.location.href = "index.html";
                })
                .catch(error => {
                    console.error("Hiba a kijelentkezés során:", error);
                });
        });
    });
});