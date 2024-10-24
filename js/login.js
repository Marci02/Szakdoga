document.querySelector('form').addEventListener('submit', function (event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    console.log(email);

    if (validateEmail(email)) {
        // Ha az email helyes, küldés a backendnek
        fetch('backend/login.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email: email })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                //alert("Sikeres bejelentkezés!");
                // További lépések, pl. átirányítás
                console.log("Sikeres bejelentkezés!")
            } else {
                alert("Hiba: " + data.message);
            }
        })
        .catch(error => {
            console.error("Hálózati hiba:", error);
        });
    } else {
        alert("Kérjük, adjon meg egy érvényes e-mail címet.");
    }
});

// Email validálás funkció
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}
