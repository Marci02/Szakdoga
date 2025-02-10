<?php
session_start();
require_once __DIR__ . '/../connect.php';

header("Content-Type: application/json");

$data = json_decode(file_get_contents('php://input'), true);
$email = trim($data['email'] ?? '');
$password = $data['password'] ?? '';

// Ellenőrizzük, hogy minden mező ki van-e töltve
if (empty($email) || empty($password)) {
    echo json_encode(["message" => "Minden mező kitöltése kötelező!"]);
    exit;
}

// Lekérdezzük az adatbázisból a felhasználót
$query = "SELECT id, firstname, lastname, email, password FROM user WHERE email = ?";
$stmt = mysqli_prepare($dbconn, $query);
mysqli_stmt_bind_param($stmt, 's', $email);
mysqli_stmt_execute($stmt);
mysqli_stmt_store_result($stmt);

// Ha létezik az email
if (mysqli_stmt_num_rows($stmt) > 0) {
    mysqli_stmt_bind_result($stmt, $id, $firstname, $lastname, $email, $hashedPassword);
    mysqli_stmt_fetch($stmt);

    // Ellenőrizzük a jelszót
    if (password_verify($password, $hashedPassword)) {
        // 🔹 Beállítjuk a session változókat
        $_SESSION['user_id'] = $id;
        $_SESSION['firstname'] = $firstname;
        $_SESSION['lastname'] = $lastname;
        $_SESSION['email'] = $email;

        echo json_encode(["message" => "Sikeres bejelentkezés!", "loggedIn" => true]);
        exit;
    } else {
        echo json_encode(["message" => "Hibás jelszó!"]);
        exit;
    }
} else {
    echo json_encode(["message" => "Nincs ilyen email cím regisztrálva!"]);
    exit;
}

mysqli_stmt_close($stmt);
mysqli_close($dbconn);
?>
