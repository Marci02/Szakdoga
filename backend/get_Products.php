<?php
require_once __DIR__ . '/../connect.php';
session_start();

if (!isset($_SESSION['user_id'])) {
    echo json_encode(["success" => false, "message" => "Nincs bejelentkezve."]);
    exit;
}

$user_id = $_SESSION['user_id'];

$query = "SELECT 
            p.id, 
            p.name, 
            p.price, 
            p.description, 
            p.quantity, 
            p.size, 
            p.condition, 
            c.category_name, 
            b.brand_name, 
            i.img_url 
          FROM products p
          LEFT JOIN category c ON p.category_id = c.id
          LEFT JOIN brand b ON p.brand_id = b.id
          LEFT JOIN image i ON p.image_id = i.id
          WHERE p.user_id = ?";

$stmt = $dbconn->prepare($query);
$stmt->bind_param("i", $user_id);
$stmt->execute();
$result = $stmt->get_result();

$products = [];
while ($row = $result->fetch_assoc()) {
    $products[] = $row;
}

echo json_encode(["success" => true, "products" => $products]);
?>
