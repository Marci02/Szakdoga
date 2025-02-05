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
    const email = signUpForm.querySelector('input[placeholder="Email"]').value;
    const password = signUpForm.querySelector('input[placeholder="Password"]').value;
    const confirmPassword = signUpForm.querySelector('input[placeholder="Confirm Password"]').value;

    console.log(firstname, lastname, email, password, confirmPassword);

    // Basic validation
    if (password !== confirmPassword) {
        alert("Passwords do not match!");
        return;
    }
    
    try {
        // Send data to server
        const response = await fetch('backend/register.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({firstname: firstname, lastname: lastname, email: email, password: password }),
        });

        if (response.ok) {
            const data = await response.json();
            alert("Registration successful!");
            console.log("User data:", data);
            window.location.href = "login1.html";
        } else {
            const errorText = await response.text();
            console.error("Registration failed response text:", errorText); 
            alert(`Registration failed: ${errorText}`);
        }
    } catch (error) {
        console.error("Error during registration:", error);
        alert("An error occurred. Please try again later.");
    }
});

// Event listener for the Sign-In form
signInForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    // Get form data
    const email = signInForm.querySelector('input[placeholder="Email"]').value;
    const password = signInForm.querySelector('input[placeholder="Password"]').value;

    try {
        const response = await fetch("backend/login.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: email, password: password }),
        });

        const data = await response.json();

        if (response.ok && data.message === "Login successful") {
            alert("Sikeres bejelentkezés!");
            console.log("User data:", data);

            // Tárold a user adatait a localStorage-ban
            localStorage.setItem("user", JSON.stringify(data.user));

            // Átirányítás a főoldalra
            window.location.href = "index.html";
        } else {
            alert(`Hibás bejelentkezés: ${data.message}`);
        }
    } catch (error) {
        console.error("Hálózati vagy szerverhiba:", error);
        alert("Nem sikerült bejelentkezni. Próbáld újra később.");
    }
});

