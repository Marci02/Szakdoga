<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header('Content-Type: application/json; charset=utf-8');

require_once __DIR__ . '/../connect.php'; // 🔹 Adatbázis kapcsolat betöltése

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(["success" => false, "message" => "Érvénytelen kérés"]);
    exit;
}

// Debug logolás
error_log("POST adatok: " . print_r($_POST, true));
error_log("FILE adatok: " . print_r($_FILES, true));

// Kötelező mezők ellenőrzése
if (!isset($_POST['name'], $_POST['description'], $_POST['price'], $_POST['brand_id'], $_POST['condition'], $_POST['size'])) {
    echo json_encode(["success" => false, "message" => "Hiányzó adatok"]);
    exit;
}

$name = $_POST['name'];
$description = $_POST['description'];
$price = $_POST['price'];
$quantity = $_POST['quantity'] ?? 1; // 🔹 Ha nincs quantity, legyen 1 alapértelmezettként
$brand_id = $_POST['brand_id'];
$condition = $_POST['condition'];
$size = $_POST['size'];

$img_url = 'no-image.jpg';

// Kép feltöltés
if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
    $uploadDir = __DIR__ . '/uploads/';
    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0777, true);
    }
    
    $imageName = basename($_FILES['image']['name']);
    $targetFilePath = $uploadDir . $imageName;

    if (move_uploaded_file($_FILES['image']['tmp_name'], $targetFilePath)) {
        $img_url = $imageName;
    } else {
        echo json_encode(["success" => false, "message" => "Kép feltöltési hiba"]);
        exit;
    }
}

try {
    $stmt = $pdo->prepare("INSERT INTO products (name, description, price, quantity, brand_id, condition, size, image_id) VALUES (?, ?, ?, ?, ?, ?, ?, NULL)");
    $stmt->execute([$name, $description, $price, $quantity, $brand_id, $condition, $size]);
    
    $productId = $pdo->lastInsertId();
    
    if ($img_url !== 'no-image.jpg') {
        $stmt = $pdo->prepare("INSERT INTO image (img_url, product_id) VALUES (?, ?)");
        $stmt->execute([$img_url, $productId]);
    }
    
    echo json_encode(["success" => true, "message" => "Termék sikeresen feltöltve", "product_id" => $productId]);
} catch (PDOException $e) {
    echo json_encode(["success" => false, "message" => "Adatbázis hiba: " . $e->getMessage()]);
    exit;
}
?>
