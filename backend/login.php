<?php
session_start(); // Session indítása

require_once __DIR__ . '/../connect.php';

header("Content-Type: application/json");

$data = json_decode(file_get_contents('php://input'), true);

if (!$data) {
    echo json_encode(['message' => 'Invalid JSON data']);
    exit;
}

// Beviteli adatok kinyerése
$email = trim($data['email'] ?? '');
$password = $data['password'] ?? '';

// Ellenőrizzük, hogy minden mező ki van-e töltve
if (empty($email) || empty($password)) {
    echo json_encode(['message' => 'Email and password are required']);
    exit;
}

// Ellenőrizzük, hogy létezik-e az email
$query = "SELECT id, firstname, lastname, email, password FROM user WHERE email = ?";
$stmt = mysqli_prepare($dbconn, $query);
mysqli_stmt_bind_param($stmt, 's', $email);
mysqli_stmt_execute($stmt);
mysqli_stmt_store_result($stmt);

if (mysqli_stmt_num_rows($stmt) === 0) {
    echo json_encode(['message' => 'Invalid email or password']);
    exit;
}

// Lekérjük az adatokat
mysqli_stmt_bind_result($stmt, $id, $firstname, $lastname, $email, $hashedPassword);
mysqli_stmt_fetch($stmt);
mysqli_stmt_close($stmt);

// Ellenőrizzük a jelszót
if (!password_verify($password, $hashedPassword)) {
    echo json_encode(['message' => 'Invalid email or password']);
    exit;
}

// Session változók beállítása
$_SESSION['user_id'] = $id;
$_SESSION['firstname'] = $firstname;
$_SESSION['lastname'] = $lastname;
$_SESSION['email'] = $email;

echo json_encode([
    'message' => 'Login successful',
    'user' => [
        'id' => $id,
        'firstname' => $firstname,
        'lastname' => $lastname,
        'email' => $email
    ]
]);

mysqli_close($dbconn);
?>
