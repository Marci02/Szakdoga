<?php
session_start();
require_once __DIR__ . '/../connect.php';
header("Content-Type: application/json");

$data = json_decode(file_get_contents("php://input"), true);
$userId = $_SESSION['user_id'] ?? null;
$postcode = $data['postcode'] ?? null;
$city = $data['city'] ?? null;
$county = $data['county'] ?? null;

if (!$userId || !$postcode || !$city || !$county) {
    echo json_encode(["success" => false, "message" => "Hiányzó adatok."]);
    exit;
}

// 🔹 Frissítés az adatbázisban
$query = "UPDATE user SET postcode = ? WHERE id = ?";
$stmt = mysqli_prepare($dbconn, $query);
mysqli_stmt_bind_param($stmt, "si", $postcode, $userId);
$success = mysqli_stmt_execute($stmt);
mysqli_stmt_close($stmt);

if ($success) {
    // 🔹 Frissítés a session-ben
    $_SESSION['postcode'] = $postcode;
    $_SESSION['city'] = $city;
    $_SESSION['county'] = $county;

    echo json_encode(["success" => true, "message" => "Cím frissítve"]);
} else {
    echo json_encode(["success" => false, "message" => "Adatbázis hiba"]);
}

mysqli_close($dbconn);
?>
