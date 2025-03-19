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
$brand_name = $_POST['brand_id']; // A POST-ban brand_name van, nem id
$condition = $_POST['condition'];
$size = $_POST['size'];
$category_id = $_POST['category_id']; // 🔹 Kategória ID

$img_url = 'no-image.jpg';

// 🔹 Ha a category_id nem szám, akkor kérjük le a kategória id-t
if (!is_numeric($category_id)) {
    $category_query = $dbconn->prepare("SELECT id FROM category WHERE category_name = ?");
    $category_query->bind_param("s", $category_id);
    $category_query->execute();
    $result = $category_query->get_result();
    if ($row = $result->fetch_assoc()) {
        $category_id = $row['id'];
    } else {
        error_log("❌ Hiba: A kategória ($category_id) nem található!");
        echo json_encode(["success" => false, "message" => "Érvénytelen kategória"]);
        exit;
    }
    $category_query->close();
}

// 🔹 Ha a brand_name nem szám, akkor kérjük le a brand_id-t
if (!is_numeric($brand_name)) {
    $brand_query = $dbconn->prepare("SELECT id FROM brand WHERE brand_name = ?");
    $brand_query->bind_param("s", $brand_name);
    $brand_query->execute();
    $result = $brand_query->get_result();
    if ($row = $result->fetch_assoc()) {
        $brand_id = $row['id']; // Az ID-t beállítjuk
    } else {
        error_log("❌ Hiba: A megadott márka ($brand_name) nem található!");
        echo json_encode(["success" => false, "message" => "Érvénytelen márka"]);
        exit;
    }
    $brand_query->close();
} else {
    // Ha a brand_id szám, akkor azt használjuk
    $brand_id = $brand_name;
}

// 🔹 Kép feltöltés és mentés az adatbázisba először
$image_id = null; // Kezdetben NULL
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

        // Kép mentése az image táblába
        $query = "INSERT INTO image (img_url) VALUES (?)";  // image_id nem szükséges, auto-increment
        $stmt = $dbconn->prepare($query);
        $stmt->bind_param("s", $img_url);
        $stmt->execute();
        $image_id = $stmt->insert_id; // Kép ID-ja
        $stmt->close();

        error_log("✅ Kép mentve az adatbázisba: $img_url (image_id: $image_id)");
    } else {
        error_log("❌ Kép mentési hiba!");
        echo json_encode(["success" => false, "message" => "Kép feltöltési hiba"]);
        exit;
    }
} else {
    error_log("⚠ Nincs fájl feltöltve.");
}

// 🔹 Termék beszúrása az adatbázisba
//INNER JOIN kell a category táblához, mert nem a category_id-t kérjük be hanem a nevet és azt egy külön táblába tároljuk és a brand_id-vel is ugyan ezt kell csinálni.
$query = "INSERT INTO products (user_id, name, description, price, quantity, brand_id, `condition`, size, category_id, image_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
$stmt = $dbconn->prepare($query);
$stmt->bind_param("issdiissii", $user_id, $name, $description, $price, $quantity, $brand_id, $condition, $size, $category_id, $image_id);

if ($stmt->execute()) {
    $productId = $stmt->insert_id;
    error_log("✅ Termék sikeresen feltöltve, ID: $productId");
    $stmt->close();
    echo json_encode(["success" => true, "message" => "Termék sikeresen feltöltve", "product_id" => $productId]);
} else {
    error_log("❌ Adatbázis hiba: " . $dbconn->error);
    echo json_encode(["success" => false, "message" => "Adatbázis hiba: " . $dbconn->error]);
}

$dbconn->close();
?>