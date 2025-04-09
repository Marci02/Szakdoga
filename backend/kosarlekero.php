<?php
session_start();
require_once __DIR__ . '/../connect.php';
header('Content-Type: application/json; charset=utf-8');

if (!isset($_SESSION['user_id'])) {
    echo json_encode(["success" => false, "message" => "Nem vagy bejelentkezve."]);
    exit;
}

$user_id = $_SESSION['user_id'];

$query = "
SELECT 
    p.id AS product_id,
    p.name,
    p.price,
    p.size,
    p.condition,
    c.quantity,
    i.img_url
FROM cart c
JOIN products p ON c.product_id = p.id
LEFT JOIN image i ON p.image_id = i.id
WHERE c.user_id = ?
";

$stmt = $dbconn->prepare($query);
$stmt->bind_param("i", $user_id);
$stmt->execute();
$result = $stmt->get_result();

$items = [];
$subtotal = 0;
while ($row = $result->fetch_assoc()) {
    $row['img_url'] = $row['img_url'] ? "/uploads/" . $row['img_url'] : "/uploads/no-image.jpg";
    $row['total'] = $row['price'] * $row['quantity'];
    $subtotal += $row['total'];
    $items[] = $row;
}

$response = [
    "success" => true,
    "cart" => $items,
    "subtotal" => $subtotal,
    "sales_tax" => round($subtotal * 0.1, 2),
    "grand_total" => round($subtotal * 1.1, 2)
];

echo json_encode($response, JSON_UNESCAPED_UNICODE);
?>
