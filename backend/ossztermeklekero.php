<?php
$host = 'localhost';
$dbname = 'tesztAdat1';
$username = 'root';
$password = '';

// Adatbázis kapcsolat létrehozása mysqli-val
$mysqli = new mysqli($host, $username, $password, $dbname);

// Hibakezelés, ha a kapcsolat nem sikerült
if ($mysqli->connect_error) {
    die(json_encode(['success' => false, 'error' => 'Adatbázis kapcsolat hiba: ' . $mysqli->connect_error]));
}

// Alapértelmezett kép útvonal
$baseImagePath = "http://localhost/Szakdoga/uploads/";  // Az alapértelmezett kép útvonala
$defaultImage = "no-image.jpg";  // Alapértelmezett kép neve

// Kép elérési útvonalának beállítása
if (!empty($row['img_url']) && $row['img_url'] !== $defaultImage) {
    $row['img_url'] = $baseImagePath . $row['img_url'];
} else {
    $row['img_url'] = $baseImagePath . $defaultImage;
}

// Termékek lekérdezése
$query = "
    SELECT 
        products.id,
        products.name, 
        products.description, 
        products.price, 
        products.quantity, 
        products.category_id, 
        products.brand_id, 
        products.condition, 
        products.size, 
        COALESCE(image.img_url, ?) AS img_url 
    FROM products 
    LEFT JOIN image ON image.id = products.image_id
";

// Lekérdezés előkészítése
$stmt = $mysqli->prepare($query);
if (!$stmt) {
    die(json_encode(['success' => false, 'error' => 'Hiba a lekérdezés előkészítésekor: ' . $mysqli->error]));
}

// Alapértelmezett kép beállítása
$stmt->bind_param('s', $defaultImage);

// Lekérdezés végrehajtása
$stmt->execute();

// Eredmény lekérése
$result = $stmt->get_result();

// Termékek tárolása egy tömbben
$products = [];
while ($row = $result->fetch_assoc()) {
    // Kép elérési útvonalának beállítása
    if (!empty($row['img_url']) && $row['img_url'] !== $defaultImage) {
        $row['img_url'] = $baseImagePath . $row['img_url'];
    } else {
        $row['img_url'] = $baseImagePath . $defaultImage;
    }
    $products[] = $row;
}

// JSON válasz küldése
echo json_encode(['success' => true, 'products' => $products], JSON_UNESCAPED_UNICODE);

// Kapcsolat bezárása
$stmt->close();
$mysqli->close();
?>