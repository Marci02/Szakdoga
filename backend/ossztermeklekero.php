<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
header('Content-Type: application/json');
require_once __DIR__ . '/../connect.php';

// Alapértelmezett kép útvonal
$baseImagePath = "http://localhost/Szakdoga/uploads/";
$defaultImage = "no-image.jpg";

// Termékek lekérdezése (brand, category, image csatlakoztatva), rendezve az uploaded_at szerint
$query = "
    SELECT 
        p.id,
        p.name,
        p.description,
        p.price,
        p.quantity,
        p.size,
        p.condition,
        COALESCE(i.img_url, ?) AS img_url,
        b.brand_name,
        c.category_name,
        p.uploaded_at
    FROM products p
    LEFT JOIN image i ON p.image_id = i.id
    LEFT JOIN brand b ON p.brand_id = b.id
    LEFT JOIN category c ON p.category_id = c.id
    WHERE p.isSold = 0
    ORDER BY p.uploaded_at DESC
";

// Lekérdezés előkészítése
$stmt = mysqli_prepare($dbconn, $query);
if (!$stmt) {
    echo json_encode(['success' => false, 'error' => 'Hiba a lekérdezés előkészítésekor: ' . mysqli_error($dbconn)]);
    exit;
}

// Alapértelmezett kép beállítása
mysqli_stmt_bind_param($stmt, 's', $defaultImage);

// Lekérdezés végrehajtása
mysqli_stmt_execute($stmt);

// Eredmény lekérése
$result = mysqli_stmt_get_result($stmt);

// Termékek tömbbe rendezése
$products = [];
while ($row = mysqli_fetch_assoc($result)) {
    // Teljes kép elérési útvonal összeállítása
    $row['img_url'] = $baseImagePath . $row['img_url'];
    $products[] = $row;
}

// JSON válasz
echo json_encode(['success' => true, 'products' => $products], JSON_UNESCAPED_UNICODE);

// Erőforrások felszabadítása
mysqli_stmt_close($stmt);
mysqli_close($dbconn);
?>