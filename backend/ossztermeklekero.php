<?php
$host = 'localhost';
$dbname = 'tesztAdat1';
$username = 'root';
$password = '';

header('Content-Type: application/json; charset=utf-8');

try {
    // Adatbázis kapcsolat létrehozása
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Alapértelmezett kép útvonal
    $baseImagePath = "http://localhost/Szakdoga/";
    $defaultImage = "no-image.jpg";

    // Termékek lekérdezése
    $query = "SELECT 
                products.id,
                products.name, 
                products.description, 
                products.price, 
                products.quantity, 
                products.category_id, 
                products.brand_id, 
                products.condition, 
                products.size, 
                COALESCE(image.img_url, :defaultImage) AS img_url 
              FROM products 
              LEFT JOIN image ON image.id = products.image_id";
              
    $stmt = $pdo->prepare($query);
    $stmt->bindValue(':defaultImage', $defaultImage, PDO::PARAM_STR);
    $stmt->execute();

    // Eredmények összegyűjtése
    $products = [];
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
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

} catch (PDOException $e) {
    echo json_encode(['success' => false, 'error' => 'Adatbázis hiba: ' . $e->getMessage()]);
    exit;
}
?>