<?php
// A session hosszabb ideig maradjon érvényes
session_set_cookie_params(3600, "/");  // 3600 másodperc (1 óra), minden útvonalra érvényes
session_start();


require_once __DIR__ . '/../connect.php';
header("Content-Type: application/json");

$data = json_decode(file_get_contents("php://input"), true);
$email = trim($data['email'] ?? '');
$password = $data['password'] ?? '';

if (empty($email) || empty($password)) {
    echo json_encode(["message" => "Email és jelszó megadása kötelező."]);
    exit;
}

// Ellenőrizzük, hogy létezik-e a felhasználó
$query = "SELECT id, firstname, lastname, password FROM user WHERE email = ?";
$stmt = mysqli_prepare($dbconn, $query);
mysqli_stmt_bind_param($stmt, 's', $email);
mysqli_stmt_execute($stmt);
mysqli_stmt_bind_result($stmt, $userId, $firstname, $lastname, $hashedPassword);
mysqli_stmt_fetch($stmt);
mysqli_stmt_close($stmt);

// Jelszó ellenőrzés
if ($userId && password_verify($password, $hashedPassword)) {
    $_SESSION['user_id'] = $userId;
    $_SESSION['username'] = $firstname . " " . $lastname;  // Elmentjük a nevet is

    echo json_encode(["message" => "Bejelentkezés sikeres!", "loggedIn" => true]);
} else {
    echo json_encode(["message" => "Hibás email vagy jelszó."]);
}
?>
