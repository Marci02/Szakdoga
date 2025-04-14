<?php
session_start();
require_once __DIR__ . '/../connect.php';
header("Content-Type: application/json");

if (!isset($_SESSION['user_id'])) {
    echo json_encode(["success" => false, "error" => "Nincs bejelentkezve"]);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['product_id'])) {
    echo json_encode(["success" => false, "error" => "Hiányzó termékazonosító"]);
    exit;
}

$product_id = (int)$data['product_id'];
$buyer_id = $_SESSION['user_id'];

// Töröljük a terméket a sales táblából
$stmt = $dbconn->prepare("DELETE FROM sales WHERE product_id = ? AND buyer_id = ?");
$stmt->bind_param("ii", $product_id, $buyer_id);

if ($stmt->execute()) {
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["success" => false, "error" => "Adatbázis hiba"]);
}

$stmt->close();
$dbconn->close();
?>