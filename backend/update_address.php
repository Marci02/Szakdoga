<?php
session_start();
require_once __DIR__ . '/../connect.php';
header("Content-Type: application/json");

// Ellenőrizzük az adatbázis kapcsolatot
if (!$dbconn) {
    die(json_encode(["success" => false, "message" => "Adatbázis kapcsolat sikertelen: " . mysqli_connect_error()]));
}

// JSON-ből bejövő adatok
$data = json_decode(file_get_contents("php://input"), true);
$userId = $_SESSION['user_id'] ?? null;
$postcode = $data['postcode'] ?? null;
$city = trim($data['city'] ?? '');
$county = trim($data['county'] ?? '');
$street = trim($data['street_address'] ?? '');
$houseNumber = trim($data['house_number'] ?? '');

// Ha valamelyik adat hiányzik, hibaüzenet
if (!$userId || !$postcode || empty($city) || empty($county) || empty($street) || empty($houseNumber)) {
    echo json_encode(["success" => false, "message" => "Hiányzó adatok!"]);
    exit;
}

// 1️⃣ Megye ID lekérdezése vagy beszúrása
$countyId = null;
$countyQuery = "SELECT id FROM counties WHERE name = ?";
$stmt = mysqli_prepare($dbconn, $countyQuery);
mysqli_stmt_bind_param($stmt, "s", $county);
mysqli_stmt_execute($stmt);
mysqli_stmt_bind_result($stmt, $countyId);
mysqli_stmt_fetch($stmt);
mysqli_stmt_close($stmt);

if (!$countyId) {
    $insertCounty = "INSERT INTO counties (name) VALUES (?)";
    $stmt = mysqli_prepare($dbconn, $insertCounty);
    mysqli_stmt_bind_param($stmt, "s", $county);
    mysqli_stmt_execute($stmt);
    $countyId = mysqli_insert_id($dbconn);
    mysqli_stmt_close($stmt);
}

// 2️⃣ Város ID lekérdezése vagy beszúrása
$cityId = null;
$cityQuery = "SELECT id FROM settlement WHERE name = ? AND postcode = ? AND county_id = ?";
$stmt = mysqli_prepare($dbconn, $cityQuery);
mysqli_stmt_bind_param($stmt, "sii", $city, $postcode, $countyId);
mysqli_stmt_execute($stmt);
mysqli_stmt_bind_result($stmt, $cityId);
mysqli_stmt_fetch($stmt);
mysqli_stmt_close($stmt);

if (!$cityId) {
    $insertCity = "INSERT INTO settlement (name, postcode, county_id) VALUES (?, ?, ?)";
    $stmt = mysqli_prepare($dbconn, $insertCity);
    mysqli_stmt_bind_param($stmt, "sii", $city, $postcode, $countyId);
    mysqli_stmt_execute($stmt);
    $cityId = mysqli_insert_id($dbconn);
    mysqli_stmt_close($stmt);
}

// 3️⃣ Felhasználó címének frissítése
// 3️⃣ Felhasználó címének frissítése
$updateUser = "UPDATE user SET city_id = ?, street = ?, address = ? WHERE id = ?";
$stmt = mysqli_prepare($dbconn, $updateUser);

// Ha a lekérdezés nem sikerült
if (!$stmt) {
    die(json_encode(["success" => false, "message" => "SQL hiba: " . mysqli_error($dbconn)]));
}

mysqli_stmt_bind_param($stmt, "isss", $cityId, $street, $houseNumber, $userId);
$success = mysqli_stmt_execute($stmt);
mysqli_stmt_close($stmt);

if ($success) {
    // Session frissítés
    $_SESSION['city'] = $city;
    $_SESSION['county'] = $county;
    $_SESSION['postcode'] = $postcode;
    $_SESSION['street_address'] = $street;
    $_SESSION['house_number'] = $houseNumber;

    echo json_encode(["success" => true, "message" => "Cím frissítve!"]);
} else {
    echo json_encode(["success" => false, "message" => "Adatbázis hiba."]);
}


mysqli_close($dbconn);
?>
