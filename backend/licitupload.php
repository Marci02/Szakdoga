<?php
require_once __DIR__ . '/../connect.php'; // Adatbázis kapcsolat
session_start(); // Szükséges a session használatához

header("Content-Type: application/json");

// Debug log készítése
file_put_contents("debug_log.txt", "POST: " . print_r($_POST, true) . "\nFILES: " . print_r($_FILES, true) . "\nSESSION: " . print_r($_SESSION, true), FILE_APPEND);

// Ellenőrizzük, hogy a felhasználó be van-e jelentkezve
if (!isset($_SESSION['user_id'])) {
    echo json_encode(["status" => "error", "message" => "Nincs bejelentkezve."]);
    exit;
}

// Adatok beolvasása
$user_id = $_SESSION['user_id']; // Sessionből vesszük
$name = trim($_POST['name']);
$price = (int) $_POST['price'];
$stair = (int) $_POST['stair'];
$category_id = (int) $_POST['fileCategory'];
$brand_id = (int) $_POST['fileBrand'];
$uploaded_at = date("Y-m-d H:i:s");
$auction_start = $uploaded_at; // Az uploaded_at-tel azonos
$auction_end = $_POST['auction_end']; // Ezt az űrlap küldi

// Ellenőrizzük, hogy minden szükséges adat megvan-e
$required_fields = ['name', 'price', 'stair', 'auction_end', 'fileCategory', 'fileBrand'];
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

// Kép feltöltése
$image_id = null;
$upload_dir = __DIR__ . "/../uploads/"; // Az uploads mappa a backend-en kívül van

// Ha nem létezik a mappa, akkor létrehozzuk
if (!is_dir($upload_dir)) {
    mkdir($upload_dir, 0777, true);
}

if (isset($_FILES['image']) && $_FILES['image']['error'] == 0) {
    $image_name = time() . '_' . preg_replace('/\s+/', '', basename($_FILES['image']['name']));
    $target_path = $upload_dir . $image_name; // Mentési hely

    // Kép MIME típus ellenőrzése
    $allowed_types = ['image/jpeg', 'image/png', 'image/gif'];
    if (!in_array($_FILES['image']['type'], $allowed_types)) {
        echo json_encode(["status" => "error", "message" => "A kép csak JPEG, PNG vagy GIF formátumban lehet."]);
        exit;
    }

    // Kép feltöltése
    if (move_uploaded_file($_FILES['image']['tmp_name'], $target_path)) {
        // Kép elérési útja adatbázisba mentéshez
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

// Adatok beszúrása az auction táblába
$sql = "INSERT INTO auction (user_id, name, price, stair, image_id, category_id, brand_id, uploaded_at, auction_start, auction_end) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
$stmt = $dbconn->prepare($sql);
if ($stmt) {
    $stmt->bind_param("isiiiissss", $user_id, $name, $price, $stair, $image_id, $category_id, $brand_id, $uploaded_at, $auction_start, $auction_end);
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
