<?php
require_once __DIR__ . '/../connect.php'; // Csatlakozás az adatbázishoz

header("Content-Type: application/json");

// Ellenőrizzük, hogy POST kérés érkezett-e
if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    echo json_encode(["status" => "error", "message" => "Érvénytelen kérés. Csak POST engedélyezett."]);
    exit;
}

// Ellenőrizzük, hogy minden szükséges adat megvan-e
if (!isset($_POST['name'], $_POST['price'], $_POST['stair'], $_POST['auction_start'], $_POST['auction_end'], $_POST['fileCategory'], $_POST['fileBrand'])) {
    echo json_encode(["status" => "error", "message" => "Hiányzó adatok."]);
    exit;
}

// Adatok beolvasása
$name = trim($_POST['name']);
$price = (int) $_POST['price'];
$stair = (int) $_POST['stair'];
$auction_start = $_POST['auction_start'];
$auction_end = $_POST['auction_end'];
$file_category = $_POST['fileCategory'];
$file_brand = $_POST['fileBrand'];
$uploaded_at = date("Y-m-d H:i:s");

// Kép feltöltése
$image_id = null;
if (isset($_FILES['image']) && $_FILES['image']['error'] == 0) {
    $image_name = time() . '_' . basename($_FILES['image']['name']);
    $target_path = __DIR__ . "/uploads/" . $image_name; // Mentési hely

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
        $stmt = $conn->prepare($sql);
        if ($stmt) {
            $stmt->bind_param("s", $image_name);
            if ($stmt->execute()) {
                $image_id = $stmt->insert_id;
            }
            $stmt->close();
        }
    } else {
        echo json_encode(["status" => "error", "message" => "A kép feltöltése sikertelen."]);
        exit;
    }
}

// Adatok beszúrása az auction táblába
$sql = "INSERT INTO auction (name, price, stair, image_id, uploaded_at, auction_start, auction_end, category, brand) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
$stmt = $conn->prepare($sql);
if ($stmt) {
    $stmt->bind_param("siiisssss", $name, $price, $stair, $image_id, $uploaded_at, $auction_start, $auction_end, $file_category, $file_brand);
    if ($stmt->execute()) {
        echo json_encode(["status" => "success", "message" => "Aukció sikeresen létrehozva!"]);
    } else {
        echo json_encode(["status" => "error", "message" => "Hiba történt az aukció létrehozásakor."]);
    }
    $stmt->close();
} else {
    echo json_encode(["status" => "error", "message" => "SQL előkészítés sikertelen."]);
}

$conn->close();
?>
