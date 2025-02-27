<?php
session_start();
require_once __DIR__ . '/../connect.php';
header("Content-Type: application/json");

// Hibák megjelenítése
ini_set('display_errors', 1);
error_reporting(E_ALL);

// Adatok fogadása
$data = json_decode(file_get_contents("php://input"), true);
$userId = $_SESSION['user_id'] ?? null;

$firstname = trim($data['firstname'] ?? '');
$lastname = trim($data['lastname'] ?? '');
$email = trim($data['email'] ?? '');
$phone = trim($data['phone'] ?? '');
$image = trim($data['image'] ?? ''); // Ha URL-t tárolunk

// Ellenőrzés: Bejelentkezett felhasználó van-e
if (!$userId) {
    echo json_encode(["success" => false, "message" => "Nincs bejelentkezett felhasználó."]);
    exit;
}

// Ha nincs mit frissíteni
if (!$firstname && !$lastname && !$email && !$phone && !$image) {
    echo json_encode(["success" => false, "message" => "Nincs módosítandó adat."]);
    exit;
}

// Dinamikusan építjük az SQL lekérdezést
$setClauses = [];
$params = [];
$paramTypes = "";

// Frissítendő mezők hozzáadása
if (!empty($firstname)) {
    $setClauses[] = "firstname = ?";
    $params[] = &$firstname;
    $paramTypes .= "s";
}
if (!empty($lastname)) {
    $setClauses[] = "lastname = ?";
    $params[] = &$lastname;
    $paramTypes .= "s";
}
if (!empty($email)) {
    $setClauses[] = "email = ?";
    $params[] = &$email;
    $paramTypes .= "s";
}
if (!empty($phone)) {
    $setClauses[] = "phone_number = ?";
    $params[] = &$phone;
    $paramTypes .= "s";
}
if (!empty($image)) {
    $setClauses[] = "image_url = ?";  // 🔹 Ha az URL-t tároljuk
    $params[] = &$image;
    $paramTypes .= "s";
}

// SQL lekérdezés összeállítása
$query = "UPDATE user SET " . implode(", ", $setClauses) . " WHERE id = ?";
$params[] = &$userId;
$paramTypes .= "i";

// Lekérdezés előkészítése
$stmt = mysqli_prepare($dbconn, $query);
if (!$stmt) {
    echo json_encode(["success" => false, "message" => "SQL hiba: " . mysqli_error($dbconn)]);
    exit;
}

// Paraméterek kötése
mysqli_stmt_bind_param($stmt, $paramTypes, ...$params);

// Lekérdezés futtatása
$success = mysqli_stmt_execute($stmt);
mysqli_stmt_close($stmt);

// Ha sikeres volt, frissítjük a SESSION változókat is
if ($success) {
    // Friss adatokat lekérjük újra az adatbázisból
    $query = "SELECT firstname, lastname, email, phone_number, img_url FROM user WHERE id = ?";
    $stmt = mysqli_prepare($dbconn, $query);
    mysqli_stmt_bind_param($stmt, "i", $userId);
    mysqli_stmt_execute($stmt);
    $result = mysqli_stmt_get_result($stmt);
    $updatedUser = mysqli_fetch_assoc($result);
    
    // SESSION frissítése a lekért új adatokkal
    $_SESSION['firstname'] = $updatedUser['firstname'];
    $_SESSION['lastname'] = $updatedUser['lastname'];
    $_SESSION['email'] = $updatedUser['email'];
    $_SESSION['phone'] = $updatedUser['phone_number'];
    $_SESSION['image'] = $updatedUser['image_url'];

    echo json_encode(["success" => true, "message" => "Profil adatok frissítve!"]);
} else {
    echo json_encode(["success" => false, "message" => "Nem történt változás vagy hiba az adatbázisban."]);
}

// Kapcsolat bezárása
mysqli_close($dbconn);
?>
