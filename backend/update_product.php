<?php
require_once __DIR__ . '/../connect.php';
session_start();

if (!isset($_SESSION['user_id'])) {
    echo json_encode(["success" => false, "message" => "Nincs bejelentkezve."]);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);

$product_id = $data['id'] ?? 0;
$name = $data['name'] ?? "";
$price = $data['price'] ?? 0;
$description = $data['description'] ?? "";
$quantity = $data['quantity'] ?? 0;
$size = $data['size'] ?? "";
$condition = $data['condition'] ?? ""; // eredeti változó neve

$query = "UPDATE products SET name = ?, price = ?, description = ?, quantity = ?, size = ?, `condition` = ? WHERE id = ? AND user_id = ?";
$stmt = $dbconn->prepare($query);
$stmt->bind_param("sisissii", $name, $price, $description, $quantity, $size, $condition, $product_id, $_SESSION['user_id']);
$success = $stmt->execute();

echo json_encode(["success" => $success]);
?>
