<?php
session_start();
header('Content-Type: application/json');
require_once __DIR__ . '/../connect.php';

// Ellenőrizzük, hogy a product_id paraméter meg van-e adva
if (!isset($_GET['product_id'])) {
    echo json_encode(["success" => false, "message" => "Hiányzó termékazonosító."]);
    exit;
}

$product_id = intval($_GET['product_id']);

// Vásárló szállítási címének lekérdezése
$query = "
    SELECT 
        u.firstname AS buyer_firstname,
        u.lastname AS buyer_lastname,
        u.phone_number AS buyer_phone,
        u.email AS buyer_email,
        s.postcode AS buyer_postcode,
        s.name AS buyer_city,
        u.street AS buyer_street,
        u.address AS buyer_address,
        c.name AS buyer_county,
        p.name AS product_name,
        p.price AS product_price,
        sa.sold_at AS sold_date
    FROM sales sa
    JOIN user u ON sa.buyer_id = u.id
    JOIN settlement s ON u.city_id = s.id
    JOIN counties c ON s.county_id = c.id
    JOIN products p ON sa.product_id = p.id
    WHERE sa.product_id = ?
";

$stmt = $dbconn->prepare($query);
if (!$stmt) {
    echo json_encode(["success" => false, "message" => "Hiba a lekérdezés előkészítésekor: " . $dbconn->error]);
    exit;
}

$stmt->bind_param("i", $product_id);
$stmt->execute();
$result = $stmt->get_result();

if ($row = $result->fetch_assoc()) {
    // Adatok visszaadása JSON formátumban
    echo json_encode([
        "success" => true,
        "buyer" => [
            "firstname" => $row['buyer_firstname'],
            "lastname" => $row['buyer_lastname'],
            "phone" => $row['buyer_phone'],
            "email" => $row['buyer_email'],
            "postcode" => $row['buyer_postcode'],
            "city" => $row['buyer_city'],
            "street" => $row['buyer_street'],
            "address" => $row['buyer_address'],
            "county" => $row['buyer_county']
        ],
        "product" => [
            "name" => $row['product_name'],
            "price" => $row['product_price']
        ],
        "sold_date" => $row['sold_date']
    ]);
} else {
    echo json_encode(["success" => false, "message" => "Nem található vásárló ehhez a termékhez."]);
}

$stmt->close();
$dbconn->close();
?>