const container = document.getElementById("container");
const registerBtn = document.getElementById("register");
const loginBtn = document.getElementById("login");


registerBtn.addEventListener('click', () => {
    container.classList.add("active");
});


loginBtn.addEventListener('click', () => {
    container.classList.remove("active");
});

// Select the form elements
const signUpForm = document.querySelector(".sign-up form");
const signInForm = document.querySelector(".sign-in form");

// Event listener for the Sign-Up form
signUpForm.addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent the form from refreshing the page

    // Get form data
    const firstname = signUpForm.querySelector('input[placeholder="Vezetéknév"]').value;
    const lastname = signUpForm.querySelector('input[placeholder="Keresztnév"]').value;
    const email = signUpForm.querySelector('input[placeholder="E-mail"]').value;
    const password = signUpForm.querySelector('input[placeholder="Jelszó"]').value;
    const confirmPassword = signUpForm.querySelector('input[placeholder="Jelszó megerősítése"]').value;

    console.log(firstname, lastname, email, password, confirmPassword);

    // Basic validation
    if (password !== confirmPassword) {
        showMessage("Passwords do not match!", 'error');
        return;
    }
    
    try {
        // Send data to server
        const response = await fetch('backend/register.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ firstname, lastname, email, password }),
        });

        const data = await response.json(); // Parse the JSON response

        if (response.ok && data.success) {
            showMessage(data.message, 'success'); // Use 'success' for successful registration
            console.log("User data:", data);
            setTimeout(() => {
                window.location.href = "login1.html"; // Redirect after showing the message
            }, 3000); // Wait 3 seconds before redirecting
        } else {
            showMessage(data.message, 'error'); // Show error message if registration fails
        }
    } catch (error) {
        console.error("Error during registration:", error);
        showMessage('Hiba a regisztráció során! Próbáld újra', 'error');
    }
});
// Event listener for the Sign-In form
document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.querySelector(".sign-in form");

    loginForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const email = loginForm.querySelector('input[placeholder="E-mail"]').value;
        const password = loginForm.querySelector('input[placeholder="Jelszó"]').value;

        try {
            const response = await fetch("backend/login.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: email, password: password }),
            });

            const data = await response.json();

            if (data.loggedIn) {
                // Üzenet tárolása a localStorage-ban
                localStorage.setItem("loginMessage", "Sikeres bejelentkezés!");

                // Átirányítás a profile.html-re
                window.location.href = "profile.html";
            } else {
                showMessage("Hibás email vagy jelszó!", 'error');
            }
        } catch (error) {
            console.error("Hiba a bejelentkezés során:", error);
            showMessage("Hiba történt. Próbáld újra!", 'error');
        }
    });
});

function showMessage(message, type = 'error', duration = 3000) {
    const messageBox = document.getElementById('message-box');
    messageBox.textContent = message;
    messageBox.className = `message-box ${type} show`;

    // Az üzenet eltüntetése a megadott idő után
    setTimeout(() => {
        messageBox.classList.remove('show');
    }, duration);
}
