<?php
session_start();

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header('Content-Type: application/json; charset=utf-8');

require_once __DIR__ . '/../connect.php';

// 🔹 Ellenőrizzük, hogy van-e bejelentkezett felhasználó
if (!isset($_SESSION['user_id'])) {
    echo json_encode(["success" => false, "message" => "Nincs bejelentkezett felhasználó"]);
    exit;
}

$user_id = $_SESSION['user_id'];

// 🔹 Debug logolás
error_log("🔍 DEBUG - Bejelentkezett user_id: " . $user_id);
error_log("🔍 DEBUG - POST adatok: " . print_r($_POST, true));
error_log("🔍 DEBUG - FILES adatok: " . print_r($_FILES, true));

// 🔹 Kötelező mezők ellenőrzése
$required_fields = ['name', 'description', 'price', 'brand_id', 'condition', 'size', 'category_id'];

foreach ($required_fields as $field) {
    if (!isset($_POST[$field])) {
        error_log("❌ Hiányzó mező: " . $field);
        echo json_encode(["success" => false, "message" => "Hiányzó adat: $field"]);
        exit;
    }
}

$name = $_POST['name'];
$description = $_POST['description'];
$price = $_POST['price'];
$quantity = $_POST['quantity'] ?? 1;
$brand_id = $_POST['brand_id'];
$condition = $_POST['condition'];
$size = $_POST['size'];
$category_id = $_POST['category_id']; // 🔹 Kategória ID

$img_url = 'no-image.jpg';

// 🔹 Ellenőrizzük, hogy a kategória létezik-e az adatbázisban
$category_check = $conn->prepare("SELECT id FROM category WHERE id = ?");
$category_check->bind_param("i", $category_id);
$category_check->execute();
$category_check->store_result();

if ($category_check->num_rows === 0) {
    error_log("❌ Hiba: A megadott category_id ($category_id) nem létezik!");
    echo json_encode(["success" => false, "message" => "Érvénytelen category_id"]);
    exit;
}
$category_check->close();

// 🔹 Kép feltöltés
if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
    $uploadDir = __DIR__ . '/uploads/';
    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0777, true);
    }

    $imageName = basename($_FILES['image']['name']);
    $targetFilePath = $uploadDir . $imageName;

    if (move_uploaded_file($_FILES['image']['tmp_name'], $targetFilePath)) {
        $img_url = $imageName;
        error_log("✅ Kép sikeresen feltöltve: " . $imageName);
    } else {
        error_log("❌ Kép mentési hiba!");
        echo json_encode(["success" => false, "message" => "Kép feltöltési hiba"]);
        exit;
    }
} else {
    error_log("⚠ Nincs fájl feltöltve.");
}

// 🔹 Termék beszúrása az adatbázisba
$query = "INSERT INTO products (user_id, name, description, price, quantity, brand_id, `condition`, size, category_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
$stmt = $conn->prepare($query);
$stmt->bind_param("issdiissi", $user_id, $name, $description, $price, $quantity, $brand_id, $condition, $size, $category_id);

if ($stmt->execute()) {
    $productId = $stmt->insert_id;
    error_log("✅ Termék sikeresen feltöltve, ID: $productId");
    $stmt->close();

    // 🔹 Kép mentése az adatbázisba
    if ($img_url !== 'no-image.jpg') {
        $query = "INSERT INTO image (img_url, product_id) VALUES (?, ?)";
        $stmt = $conn->prepare($query);
        $stmt->bind_param("si", $img_url, $productId);
        $stmt->execute();
        $stmt->close();
        error_log("✅ Kép mentve az adatbázisba: $img_url (product_id: $productId)");
    }

    echo json_encode(["success" => true, "message" => "Termék sikeresen feltöltve", "product_id" => $productId]);
} else {
    error_log("❌ Adatbázis hiba: " . $conn->error);
    echo json_encode(["success" => false, "message" => "Adatbázis hiba: " . $conn->error]);
}
?>
