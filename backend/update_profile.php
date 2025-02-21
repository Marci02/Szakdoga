<?php
session_start();
require_once __DIR__ . '/../connect.php';
header("Content-Type: application/json");

// Hibák megjelenítése
ini_set('display_errors', 1);
error_reporting(E_ALL);

$data = json_decode(file_get_contents("php://input"), true);
$userId = $_SESSION['user_id'] ?? null;
$firstname = trim($data['firstname'] ?? '');
$lastname = trim($data['lastname'] ?? '');
$email = trim($data['email'] ?? '');
$phone = trim($data['phone_number'] ?? '');
$image = trim($data['image'] ?? '');

// Ellenőrzés, hogy van-e bejelentkezett felhasználó
if (!$userId) {
    echo json_encode(["success" => false, "message" => "Hiányzó bejelentkezett felhasználó."]);
    exit;
}

// Ha nincs mit frissíteni
if (empty($firstname) && empty($lastname) && empty($email) && empty($phone) && empty($image)) {
    echo json_encode(["success" => false, "message" => "Nincs mit frissíteni."]);
    exit;
}

// Dinamikusan építjük az SQL lekérdezést a frissítendő mezőkkel
$setClauses = [];
$params = [];
$paramTypes = "";

// Frissítéshez szükséges mezők hozzáadása
if ($firstname) {
    $setClauses[] = "firstname = ?";
    $params[] = $firstname;
    $paramTypes .= "s";
}
if ($lastname) {
    $setClauses[] = "lastname = ?";
    $params[] = $lastname;
    $paramTypes .= "s";
}
if ($email) {
    $setClauses[] = "email = ?";
    $params[] = $email;
    $paramTypes .= "s";
}
if ($phone) {
    $setClauses[] = "phone_number = ?";
    $params[] = $phone;
    $paramTypes .= "s";
}
if ($image) {
    $setClauses[] = "image_id = ?";
    $params[] = $image;
    $paramTypes .= "s";
}

// SQL lekérdezés felépítése
$query = "UPDATE user SET " . implode(", ", $setClauses) . " WHERE id = ?";

// Paraméterek hozzáadása az SQL végére
$params[] = $userId;
$paramTypes .= "i";

// Lekérdezés előkészítése
$stmt = mysqli_prepare($dbconn, $query);
if (!$stmt) {
    echo json_encode(["success" => false, "message" => "SQL hiba: " . mysqli_error($dbconn)]);
    exit;
}

// Paraméterek kötése
if (!mysqli_stmt_bind_param($stmt, $paramTypes, ...$params)) {
    echo json_encode(["success" => false, "message" => "Hiba a paraméterek kötésében."]);
    exit;
}

// Végrehajtás
$success = mysqli_stmt_execute($stmt);
if (!$success) {
    echo json_encode(["success" => false, "message" => "Hiba a végrehajtásban: " . mysqli_error($dbconn)]);
    exit;
}

mysqli_stmt_close($stmt);

// Ha sikeres volt a frissítés, frissítjük a session változókat is
if ($success) {
    if ($firstname) $_SESSION['firstname'] = $firstname;
    if ($lastname) $_SESSION['lastname'] = $lastname;
    if ($email) $_SESSION['email'] = $email;
    if ($phone) $_SESSION['phone_number'] = $phone;
    if ($image) $_SESSION['image'] = $image;

    echo json_encode(["success" => true, "message" => "Profil adatok frissítve!"]);
} else {
    echo json_encode(["success" => false, "message" => "Adatbázis hiba."]);
}

mysqli_close($dbconn);
?>
