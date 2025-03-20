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

// Termékek tárolása egy tömbben
$products = [];
while ($row = mysqli_fetch_assoc($result)) {
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
mysqli_stmt_close($stmt);
mysqli_close($dbconn);
?>
