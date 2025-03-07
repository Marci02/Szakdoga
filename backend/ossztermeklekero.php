<?php
$host = 'localhost';
$dbname = 'tesztAdat';
$username = 'root';
$password = '';

header('Content-Type: application/json; charset=utf-8');

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $baseImagePath = "http://localhost/Szakdoga/";

    $query = "SELECT 
            products.name, 
            products.description, 
            products.price, 
            products.db, 
            products.category_id, 
            products.brand_id, 
            products.condition, 
            products.size, 
            COALESCE(image.img_url, 'no-image.jpg') AS img_url 
          FROM products 
          LEFT JOIN image ON image.id = products.image_id";
              
    $stmt = $pdo->prepare($query);
    $stmt->execute();

    $products = [];
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        // Kép elérési útvonalának módosítása
        $row['img_url'] = $baseImagePath . $row['img_url'];
        $products[] = $row;
    }

    echo json_encode($products, JSON_UNESCAPED_UNICODE);

} catch (PDOException $e) {
    echo json_encode(["error" => "Adatbázis hiba: " . $e->getMessage()]);
    exit;
}
?>