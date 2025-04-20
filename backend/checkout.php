<?php
session_start();
require_once __DIR__ . '/../connect.php';
header("Content-Type: application/json");

// Ellenőrizzük, hogy a felhasználó be van-e jelentkezve
if (!isset($_SESSION['user_id'])) {
    echo json_encode(["success" => false, "error" => "Nincs bejelentkezve"]);
    exit;
}

$buyer_id = $_SESSION['user_id'];

// Frissítsük a sales táblában az eladás idejét
$salesUpdateQuery = "í
    UPDATE sales 
    SET sold_at = NOW() 
    WHERE buyer_id = ? AND sold_at IS NULL
";
$salesStmt = $dbconn->prepare($salesUpdateQuery);
$salesStmt->bind_param("i", $buyer_id);

if (!$salesStmt->execute()) {
    echo json_encode(["success" => false, "error" => "Hiba a sales frissítése során: " . $dbconn->error]);
    exit;
}

// Frissítsük a products táblában az isSold értékét
$productsUpdateQuery = "
    UPDATE products 
    SET isSold = 1 
    WHERE id IN (
        SELECT product_id 
        FROM sales 
        WHERE buyer_id = ? AND sold_at IS NOT NULL
    )
";
$productsStmt = $dbconn->prepare($productsUpdateQuery);
$productsStmt->bind_param("i", $buyer_id);

if (!$productsStmt->execute()) {
    echo json_encode(["success" => false, "error" => "Hiba a products frissítése során: " . $dbconn->error]);
    exit;
}

echo json_encode(["success" => true, "message" => "A vásárlás sikeresen befejeződött"]);

$salesStmt->close();
$productsStmt->close();
$dbconn->close();
?>