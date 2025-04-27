<?php
// register.php

// Include the database connection
require_once __DIR__ . '/../connect.php';

header("Content-Type: application/json");

$data = json_decode(file_get_contents('php://input'), true);


if (!$data) {
    echo json_encode(['message' => 'Invalid JSON data']);
    exit;
}

// Get the input data
$firstname = trim($data['firstname'] ?? '');
$lastname = trim($data['lastname'] ?? '');
$email = trim($data['email'] ?? '');
$password = $data['password'] ?? '';

if (strlen($password))

//echo json_encode(['message' => 'Firstname: ' . $firstname . ', Lastname: ' . $lastname . ', Email: ' . $email . ', Password: ' . $password]);


if (empty($firstname) || empty($lastname) || empty($email) || empty($password)) {
    echo json_encode(['message' => 'Kérlek töltsd ki az összes mezőt!']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['message' => 'Érvénytelen e-mail cím']);
    exit;
}

// Check if the email already exists
$query = "SELECT COUNT(*) FROM user WHERE email = ?";
$stmt = mysqli_prepare($dbconn, $query);
mysqli_stmt_bind_param($stmt, 's', $email);
mysqli_stmt_execute($stmt);
mysqli_stmt_bind_result($stmt, $emailExists);
mysqli_stmt_fetch($stmt);
mysqli_stmt_close($stmt);

if ($emailExists) {
    echo json_encode(['message' => 'Email már létezik']);
    exit;
}

if (strlen($password) < 8 || !preg_match('/[A-Z]/', $password) || !preg_match('/[a-z]/', $password) || !preg_match('/[0-9]/', $password)) {
    echo json_encode(['message' => 'A jelszónak legalább 8 karakter hosszúnak kell lennie, és tartalmaznia kell kisbetűket, nagybetűket és számokat']);
    exit;
}

// Hash the password
$hashedPassword = password_hash($password, PASSWORD_BCRYPT);

// Insert the user into the database
$query = "INSERT INTO user (firstname, lastname, email, password) VALUES (?, ?, ?, ?)";
$stmt = mysqli_prepare($dbconn, $query);
mysqli_stmt_bind_param($stmt, 'ssss', $firstname, $lastname, $email, $hashedPassword);

if (mysqli_stmt_execute($stmt)) {
    echo json_encode([
        'success' => true,
        'message' => 'Sikeres regisztráció!',
        'redirect' => '/ossztermek.html' // Az oldal, ahová átirányítod a felhasználót
    ]);
    exit;
} else {
    echo json_encode([
        'success' => false,
        'message' => 'Hiba a regisztráció során' . mysqli_error($dbconn)
    ]);
    exit;
}
mysqli_stmt_close($stmt);
mysqli_close($dbconn);
?>
