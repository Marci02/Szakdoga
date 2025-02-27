<?php
session_start();
require_once __DIR__ . '/../connect.php';
header("Content-Type: application/json");

$data = json_decode(file_get_contents("php://input"), true);
$userId = $_SESSION['user_id'] ?? null;
$postcode = $data['postcode'] ?? null;
$city = trim($data['city'] ?? '');
$county = trim($data['county'] ?? '');

if (!$userId || !$postcode || empty($city) || empty($county)) {
    echo json_encode(["success" => false, "message" => "Hiányzó adatok."]);
    exit;
}

// 🔹 Megnézzük, hogy a város és a megye létezik-e
$countyId = null;
$cityId = null;

// 1️⃣ Ellenőrizzük a megyét
$countyQuery = "SELECT id FROM counties WHERE name = ?";
$stmt = mysqli_prepare($dbconn, $countyQuery);
mysqli_stmt_bind_param($stmt, "s", $county);
mysqli_stmt_execute($stmt);
mysqli_stmt_bind_result($stmt, $countyId);
mysqli_stmt_fetch($stmt);
mysqli_stmt_close($stmt);

// Ha nem létezik, akkor hozzáadjuk
if (!$countyId) {
    $insertCounty = "INSERT INTO counties (name) VALUES (?)";
    $stmt = mysqli_prepare($dbconn, $insertCounty);
    mysqli_stmt_bind_param($stmt, "s", $county);
    mysqli_stmt_execute($stmt);
    $countyId = mysqli_insert_id($dbconn);
    mysqli_stmt_close($stmt);
}

// 2️⃣ Ellenőrizzük a várost
$cityQuery = "SELECT id FROM settlement WHERE name = ? AND county_id = ?";
$stmt = mysqli_prepare($dbconn, $cityQuery);
mysqli_stmt_bind_param($stmt, "si", $city, $countyId);
mysqli_stmt_execute($stmt);
mysqli_stmt_bind_result($stmt, $cityId);
mysqli_stmt_fetch($stmt);
mysqli_stmt_close($stmt);

// Ha nem létezik, akkor hozzáadjuk
if (!$cityId) {
    $insertCity = "INSERT INTO settlement (name, postcode, county_id) VALUES (?, ?, ?)";
    $stmt = mysqli_prepare($dbconn, $insertCity);
    mysqli_stmt_bind_param($stmt, "sii", $city, $postcode, $countyId);
    mysqli_stmt_execute($stmt);
    $cityId = mysqli_insert_id($dbconn);
    mysqli_stmt_close($stmt);
}

// 3️⃣ Felhasználó frissítése
$updateUser = "UPDATE user SET postcode = ?, city_id = ? WHERE id = ?";
$stmt = mysqli_prepare($dbconn, $updateUser);
mysqli_stmt_bind_param($stmt, "iii", $postcode, $cityId, $userId);
$success = mysqli_stmt_execute($stmt);
mysqli_stmt_close($stmt);

if ($success) {
    // 🔹 Session frissítése
    $_SESSION['postcode'] = $postcode;
    $_SESSION['city'] = $city;
    $_SESSION['county'] = $county;

    echo json_encode(["success" => true, "message" => "Cím frissítve!"]);
} else {
    echo json_encode(["success" => false, "message" => "Adatbázis hiba."]);
}

mysqli_close($dbconn);
?>
