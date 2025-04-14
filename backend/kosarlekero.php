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
        s.quantity, 
        s.sold_at, 
        u1.firstname AS saler_firstname, 
        u1.lastname AS saler_lastname, 
        u1.email AS saler_email, 
        u2.firstname AS buyer_firstname, 
        u2.lastname AS buyer_lastname, 
        u2.email AS buyer_email, 
        p.name AS product_name, 
        p.price AS product_price, 
        p.size AS product_size, 
        p.condition AS product_condition, 
        p.description AS product_description, 
        c.category_name AS product_category, 
        b.brand_name AS product_brand, 
        i.img_url AS product_image_url
    FROM sales s
    JOIN user u1 ON s.saler_id = u1.id
    JOIN user u2 ON s.buyer_id = u2.id
    JOIN products p ON s.product_id = p.id
    JOIN category c ON p.category_id = c.id
    JOIN brand b ON p.brand_id = b.id
    JOIN image i ON p.image_id = i.id
    WHERE s.buyer_id = ? -- Csak a bejelentkezett felhasználó adatai
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
        "product" => [
            "id" => $row['product_id'],
            "name" => $row['product_name'],
            "price" => $row['product_price'],
            "size" => $row['product_size'],
            "condition" => $row['product_condition'],
            "description" => $row['product_description'],
            "category" => $row['product_category'],
            "brand" => $row['product_brand'],
            "image_url" => $row['product_image_url']
        ],
        "quantity" => $row['quantity'],
        "sold_at" => $row['sold_at']
    ];
}

echo json_encode(["success" => true, "sales" => $sales]);
$dbconn->close();
?>