<?php
require_once __DIR__ . '/../connect.php';
session_start();

if (!isset($_SESSION['user_id'])) {
    echo json_encode(["success" => false, "message" => "Nincs bejelentkezve."]);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);
$product_id = $data['product_id'] ?? 0;

$query = "DELETE FROM products WHERE id = ? AND user_id = ?";
$stmt = $dbconn->prepare($query);
$stmt->bind_param("ii", $product_id, $_SESSION['user_id']);
$success = $stmt->execute();

echo json_encode(["success" => $success]);
?>
