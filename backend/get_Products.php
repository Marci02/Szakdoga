<?php
require_once __DIR__ . '/../connect.php';
session_start();

if (!isset($_SESSION['user_id'])) {
    echo json_encode(["success" => false, "message" => "Nincs bejelentkezve."]);
    exit;
}

$user_id = $_SESSION['user_id'];

// Lekérdezés az elérhető termékekhez
$queryAvailable = "SELECT 
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
          WHERE p.user_id = ? AND p.isSold = 0";

$stmtAvailable = $dbconn->prepare($queryAvailable);
$stmtAvailable->bind_param("i", $user_id);
$stmtAvailable->execute();
$resultAvailable = $stmtAvailable->get_result();

$availableProducts = [];
while ($row = $resultAvailable->fetch_assoc()) {
    $availableProducts[] = $row;
}

// Lekérdezés az eladott termékekhez
$querySold = "SELECT 
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
          WHERE p.user_id = ? AND p.isSold = 1";

$stmtSold = $dbconn->prepare($querySold);
$stmtSold->bind_param("i", $user_id);
$stmtSold->execute();
$resultSold = $stmtSold->get_result();

$soldProducts = [];
while ($row = $resultSold->fetch_assoc()) {
    $soldProducts[] = $row;
}

// Válasz JSON formátumban
echo json_encode([
    "success" => true,
    "availableProducts" => $availableProducts,
    "soldProducts" => $soldProducts
]);
?>