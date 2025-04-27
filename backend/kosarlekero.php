<?php
require_once __DIR__ . '/../connect.php';
session_start(); // Indítsuk el a munkamenetet
header("Content-Type: application/json");

// Ellenőrizzük, hogy a felhasználó be van-e jelentkezve
if (!isset($_SESSION['user_id'])) {
    echo json_encode(["success" => false, "error" => "Felhasználó nincs bejelentkezve."]);
    exit;
}

$buyer_id = $_SESSION['user_id']; // A bejelentkezett felhasználó ID-ja

$query = "
    SELECT 
        s.saler_id, 
        s.buyer_id, 
        s.product_id, 
        s.auction_id, 
        s.quantity, 
        s.sold_at, 
        u1.firstname AS saler_firstname, 
        u1.lastname AS saler_lastname, 
        u1.email AS saler_email, 
        u2.firstname AS buyer_firstname, 
        u2.lastname AS buyer_lastname, 
        u2.email AS buyer_email, 
        IF(s.product_id IS NOT NULL, p.name, a.name) AS item_name, 
        IF(s.product_id IS NOT NULL, p.price, a.price) AS item_price, 
        IF(s.product_id IS NOT NULL, p.size, a.size) AS item_size, 
        IF(s.product_id IS NOT NULL, p.condition, a.condition) AS item_condition, 
        IF(s.product_id IS NOT NULL, p.description, a.description) AS item_description, 
        IF(s.product_id IS NOT NULL, c.category_name, c2.category_name) AS item_category, 
        IF(s.product_id IS NOT NULL, b.brand_name, b2.brand_name) AS item_brand, 
        IF(s.product_id IS NOT NULL, i.img_url, i2.img_url) AS item_image_url
    FROM sales s
    LEFT JOIN products p ON s.product_id = p.id
    LEFT JOIN category c ON p.category_id = c.id
    LEFT JOIN brand b ON p.brand_id = b.id
    LEFT JOIN image i ON p.image_id = i.id
    LEFT JOIN auction a ON s.auction_id = a.id
    LEFT JOIN category c2 ON a.category_id = c2.id
    LEFT JOIN brand b2 ON a.brand_id = b2.id
    LEFT JOIN image i2 ON a.image_id = i2.id
    JOIN user u1 ON s.saler_id = u1.id
    JOIN user u2 ON s.buyer_id = u2.id
    WHERE s.buyer_id = ? AND s.sold_at IS NULL
    ORDER BY s.sold_at DESC
";

$stmt = $dbconn->prepare($query);
$stmt->bind_param("i", $buyer_id); // A buyer_id-t kötjük a lekérdezéshez
$stmt->execute();
$result = $stmt->get_result();

if ($result === false) {
    echo json_encode(["success" => false, "error" => "SQL hiba: " . $dbconn->error]);
    exit;
}

$sales = [];

while ($row = $result->fetch_assoc()) {
    $sales[] = [
        "saler" => [
            "id" => $row['saler_id'],
            "firstname" => $row['saler_firstname'],
            "lastname" => $row['saler_lastname'],
            "email" => $row['saler_email']
        ],
        "buyer" => [
            "id" => $row['buyer_id'],
            "firstname" => $row['buyer_firstname'],
            "lastname" => $row['buyer_lastname'],
            "email" => $row['buyer_email']
        ],
        "item" => [
            "id" => $row['product_id'] ?? $row['auction_id'], // Az ID lehet product_id vagy auction_id
            "name" => $row['item_name'],
            "price" => $row['item_price'],
            "size" => $row['item_size'],
            "condition" => $row['item_condition'],
            "description" => $row['item_description'],
            "category" => $row['item_category'],
            "brand" => $row['item_brand'],
            "image_url" => $row['item_image_url']
        ],
        "quantity" => $row['quantity'],
        "sold_at" => $row['sold_at']
    ];
}

echo json_encode(["success" => true, "sales" => $sales]);
$dbconn->close();
?>