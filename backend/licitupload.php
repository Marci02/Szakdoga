<?php
require_once __DIR__ . '/../connect.php';
session_start();

header("Content-Type: application/json");

file_put_contents("debug_log.txt", "POST: " . print_r($_POST, true) . "\nFILES: " . print_r($_FILES, true) . "\nSESSION: " . print_r($_SESSION, true), FILE_APPEND);

if (!isset($_SESSION['user_id'])) {
    echo json_encode(["status" => "error", "message" => "Nincs bejelentkezve."]);
    exit;
}

$user_id = $_SESSION['user_id'];
$name = trim($_POST['name']);
$price = (int) $_POST['price'];
$stair = (int) $_POST['stair'];
$category_id = (int) $_POST['fileCategory'];
$brand_name = trim($_POST['fileBrand']);
$uploaded_at = date("Y-m-d H:i:s");
$auction_start = $uploaded_at;
$auction_end = $_POST['auction_end'];
$size = isset($_POST['fileSize']) ? trim($_POST['fileSize']) : null;
$condition = isset($_POST['fileCondition']) ? trim($_POST['fileCondition']) : null;
$description = isset($_POST['fileDesc']) ? trim($_POST['fileDesc']) : null;

$required_fields = ['name', 'price', 'stair', 'auction_end', 'fileCategory', 'fileBrand', 'fileCondition', 'fileDesc'];
$missing_fields = [];

foreach ($required_fields as $field) {
    if (!isset($_POST[$field]) || empty($_POST[$field])) {
        $missing_fields[] = $field;
    }
}

if (!empty($missing_fields)) {
    echo json_encode([
        "status" => "error",
        "message" => "Hiányzó adatok.",
        "missing_fields" => $missing_fields
    ]);
    exit;
}

// 🔍 Brand kezelése
$sql = "SELECT id FROM brand WHERE brand_name = ?";
$stmt = $dbconn->prepare($sql);
$stmt->bind_param("s", $brand_name);
$stmt->execute();
$result = $stmt->get_result();
$brand = $result->fetch_assoc();

if ($brand) {
    $brand_id = $brand['id'];
} else {
    $sql = "INSERT INTO brand (brand_name) VALUES (?)";
    $stmt = $dbconn->prepare($sql);
    $stmt->bind_param("s", $brand_name);

    if ($stmt->execute()) {
        $brand_id = $stmt->insert_id;
    } else {
        echo json_encode(["status" => "error", "message" => "A brand beszúrása sikertelen."]);
        exit;
    }
}
$stmt->close();

// 📸 Kép feltöltés
$image_id = null;
$upload_dir = __DIR__ . "/../uploads/";

if (!is_dir($upload_dir)) {
    mkdir($upload_dir, 0777, true);
}

if (isset($_FILES['image']) && $_FILES['image']['error'] == 0) {
    $image_name = time() . '_' . preg_replace('/\s+/', '', basename($_FILES['image']['name']));
    $target_path = $upload_dir . $image_name;
    $allowed_types = ['image/jpeg', 'image/png', 'image/gif'];

    if (!in_array($_FILES['image']['type'], $allowed_types)) {
        echo json_encode(["status" => "error", "message" => "A kép csak JPEG, PNG vagy GIF formátumban lehet."]);
        exit;
    }

    if (move_uploaded_file($_FILES['image']['tmp_name'], $target_path)) {
        $sql = "INSERT INTO image (img_url) VALUES (?)";
        $stmt = $dbconn->prepare($sql);
        if ($stmt) {
            $stmt->bind_param("s", $image_name);
            if ($stmt->execute()) {
                $image_id = $stmt->insert_id;
            }
            $stmt->close();
        }
    } else {
        file_put_contents("debug_log.txt", "Hiba move_uploaded_file-nál: " . print_r(error_get_last(), true) . "\n", FILE_APPEND);
        echo json_encode(["status" => "error", "message" => "A kép feltöltése sikertelen."]);
        exit;
    }
}

// 📝 Adatok beszúrása az adatbázisba
$sql = "INSERT INTO auction (user_id, name, price, ho, ho_id, stair, image_id, category_id, brand_id, size, uploaded_at, auction_start, auction_end, `condition`, `description`) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
$stmt = $dbconn->prepare($sql);
if ($stmt) {
    $stmt->bind_param(
        "isiiiiissssssss",
        $user_id,        // user_id
        $name,           // name
        $price,          // price
        $price,          // ho (aktuális ár)
        $user_id,        // ho_id (aktuális felhasználó azonosítója)
        $stair,          // stair
        $image_id,       // image_id
        $category_id,    // category_id
        $brand_id,       // brand_id
        $size,           // size
        $uploaded_at,    // uploaded_at
        $auction_start,  // auction_start
        $auction_end,    // auction_end
        $condition,      // condition
        $description     // description
    );

    if ($stmt->execute()) {
        echo json_encode(["status" => "success", "message" => "Aukció sikeresen létrehozva!"]);
    } else {
        echo json_encode(["status" => "error", "message" => "Hiba történt az aukció létrehozásakor."]);
    }
    $stmt->close();
} else {
    echo json_encode(["status" => "error", "message" => "SQL előkészítés sikertelen."]);
}

$dbconn->close();
?>