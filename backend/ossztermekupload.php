<?php
session_start();
ini_set('display_errors', 1);
error_reporting(E_ALL);
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/../connect.php';

// 🔹 Ellenőrizzük, hogy van-e bejelentkezett felhasználó
if (!isset($_SESSION['user_id'])) {
    echo json_encode(["success" => false, "message" => "Nincs bejelentkezett felhasználó"]);
    exit;
}

$user_id = $_SESSION['user_id'];

// Kötelező mezők ellenőrzése
$required_fields = ['name', 'description', 'price', 'brand_id', 'condition', 'size', 'category_id'];
foreach ($required_fields as $field) {
    if (!isset($_POST[$field])) {
        echo json_encode(["success" => false, "message" => "Hiányzó adat: $field"]);
        exit;
    }
}

$name = trim($_POST['name']);
$description = trim($_POST['description']);
$price = floatval($_POST['price']);
$quantity = isset($_POST['quantity']) ? intval($_POST['quantity']) : 1;
$brand_name = trim($_POST['brand_id']);
$condition = trim($_POST['condition']);
$size = trim($_POST['size']);
$category_name = trim($_POST['category_id']);

$allowed_categories = ["ruhák", "cipők", "kiegészítők"];
if (!in_array($category_name, $allowed_categories)) {
    echo json_encode(["success" => false, "message" => "Érvénytelen kategória név"]);
    exit;
}

// 🔹 Kategória ID lekérése vagy beszúrása
$category_query = $dbconn->prepare("SELECT id FROM category WHERE category_name = ?");
$category_query->bind_param("s", $category_name);
$category_query->execute();
$result = $category_query->get_result();

if ($row = $result->fetch_assoc()) {
    $category_id = $row['id'];
} else {
    $insert_category_query = $dbconn->prepare("INSERT INTO category (category_name) VALUES (?)");
    $insert_category_query->bind_param("s", $category_name);
    $insert_category_query->execute();
    $category_id = $insert_category_query->insert_id;
    $insert_category_query->close();
}
$category_query->close();

// 🔹 Márka ID lekérése
$brand_query = $dbconn->prepare("SELECT id FROM brand WHERE brand_name = ?");
$brand_query->bind_param("s", $brand_name);
$brand_query->execute();
$result = $brand_query->get_result();

if ($row = $result->fetch_assoc()) {
    $brand_id = $row['id'];
} else {
    echo json_encode(["success" => false, "message" => "Érvénytelen márka"]);
    exit;
}
$brand_query->close();

// 🔹 Kép feltöltés
$image_id = null;
if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
    $allowedTypes = ["image/jpeg", "image/png", "image/gif"];
    $maxSize = 2 * 1024 * 1024; // 2MB

    $file = $_FILES['image'];
    
    if (!in_array($file["type"], $allowedTypes)) {
        echo json_encode(["success" => false, "message" => "Csak JPG, PNG vagy GIF formátum engedélyezett."]);
        exit;
    }

    if ($file["size"] > $maxSize) {
        echo json_encode(["success" => false, "message" => "A fájl mérete túl nagy (max. 2MB)."]);
        exit;
    }

    // 🔹 Feltöltési könyvtár létrehozása, ha nem létezik
    $uploadDir = __DIR__ . "/../uploads/";
    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0777, true);
    }

    // 🔹 Biztonságos fájlnév generálása (random hash)
    $fileExtension = pathinfo($file["name"], PATHINFO_EXTENSION);
    $fileName = "product_" . uniqid() . "." . $fileExtension;
    $filePath = $uploadDir . $fileName;

    if (!move_uploaded_file($file["tmp_name"], $filePath)) {
        error_log("Fájl feltöltési hiba! Nem sikerült áthelyezni a fájlt: " . $file["tmp_name"] . " -> " . $filePath);
        echo json_encode(["success" => false, "message" => "Nem sikerült a fájlt áthelyezni"]);
        exit;
    }

    // 🔹 Kép elérési út mentése az adatbázisba
    $img_url = $fileName;
    $query = "INSERT INTO image (img_url) VALUES (?)";
    $stmt = $dbconn->prepare($query);
    $stmt->bind_param("s", $img_url);
    if ($stmt->execute()) {
        $image_id = $stmt->insert_id;
    } else {
        echo json_encode(["success" => false, "message" => "Kép adatbázisba mentése sikertelen"]);
        exit;
    }
    $stmt->close();
}

// 🔹 Termék beszúrása az adatbázisba
$query = "INSERT INTO products (user_id, name, description, price, quantity, brand_id, `condition`, size, category_id, image_id, isSold, uploaded_at) 
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
$stmt = $dbconn->prepare($query);

$isSold = 0;
$uploaded_at = date("Y-m-d H:i:s"); // Aktuális időpont

$stmt->bind_param("issdiissiiis", $user_id, $name, $description, $price, $quantity, $brand_id, $condition, $size, $category_id, $image_id, $isSold, $uploaded_at);

if ($stmt->execute()) {
    $productId = $stmt->insert_id;
    echo json_encode(["success" => true, "message" => "Termék sikeresen feltöltve", "product_id" => $productId]);
} else {
    echo json_encode(["success" => false, "message" => "Adatbázis hiba: " . $dbconn->error]);
}

$stmt->close();
$dbconn->close();
?>