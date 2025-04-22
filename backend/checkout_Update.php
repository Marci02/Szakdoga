<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
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
$postcode = $data['zip'] ?? null;
$city = trim($data['city'] ?? '');
$county = trim($data['county'] ?? '');
$street = trim($data['street'] ?? '');
$houseNumber = trim($data['houseNumber'] ?? '');
$name = trim($data['name'] ?? '');
$email = trim($data['email'] ?? '');
$phone = trim($data['phone'] ?? '');

// Ha valamelyik adat hiányzik, hibaüzenet
if (!$userId || !$postcode || empty($city) || empty($county) || empty($street) || empty($houseNumber) || empty($name) || empty($email) || empty($phone)) {
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

// 3️⃣ Felhasználó címének és profiladatainak frissítése
$updateUser = "
    UPDATE user 
    SET 
        city_id = ?, 
        street = ?, 
        address = ?, 
        firstname = ?, 
        lastname = ?, 
        email = ?, 
        phone_number = ? 
    WHERE id = ?
";
$stmt = mysqli_prepare($dbconn, $updateUser);

// Ha a lekérdezés nem sikerült
if (!$stmt) {
    die(json_encode(["success" => false, "message" => "SQL hiba: " . mysqli_error($dbconn)]));
}

// A teljes név szétbontása keresztnévre és vezetéknévre
$nameParts = explode(' ', $name, 2);
$firstname = $nameParts[0] ?? '';
$lastname = $nameParts[1] ?? '';

$address = $street . ' ' . $houseNumber;
mysqli_stmt_bind_param($stmt, "issssssi", $cityId, $street, $houseNumber, $firstname, $lastname, $email, $phone, $userId);
$success = mysqli_stmt_execute($stmt);
mysqli_stmt_close($stmt);

if ($success) {
    // Session frissítés
    $_SESSION['city'] = $city;
    $_SESSION['county'] = $county;
    $_SESSION['postcode'] = $postcode;
    $_SESSION['street_address'] = $street;
    $_SESSION['house_number'] = $houseNumber;
    $_SESSION['name'] = $name;
    $_SESSION['email'] = $email;
    $_SESSION['phone'] = $phone;

    echo json_encode(["success" => true, "message" => "Adatok sikeresen frissítve!"]);
} else {
    echo json_encode(["success" => false, "message" => "Adatbázis hiba."]);
}

mysqli_close($dbconn);
?>