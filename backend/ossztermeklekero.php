<?php
// Adatbázis kapcsolat beállítások
$host = 'localhost'; // Adatbázis host
$dbname = 'tesztAdat1'; // Az adatbázis neve
$username = 'Verebes Bálint'; // Adatbázis felhasználó
$password = 'Balintka2007'; // Adatbázis jelszó

// Kapcsolódás az adatbázishoz
try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    echo "Kapcsolódási hiba: " . $e->getMessage();
    exit;
}

// SQL lekérdezés a termékek adatainak lekérésére
$query = "SELECT title, description, price, quantity, category, brand, image FROM products";
$stmt = $pdo->prepare($query);
$stmt->execute();

// Az adatokat tömbbe töltjük
$products = [];
while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
    $products[] = [
        'title' => $row['title'],
        'description' => $row['description'],
        'price' => $row['price'],
        'quantity' => $row['quantity'],
        'category' => $row['category'],
        'brand' => $row['brand'],
        'image' => $row['image']
    ];
}

// JSON formátumban visszaküldjük az adatokat
header('Content-Type: application/json');
echo json_encode($products);
?>