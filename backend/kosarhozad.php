<?php
session_start();
require_once __DIR__ . '/../connect.php';
header('Content-Type: application/json; charset=utf-8');

ini_set('display_errors', 1);
error_reporting(E_ALL);

if (!isset($_SESSION['user_id'])) {
    echo json_encode([
        "success" => false,
        "message" => "Nem vagy bejelentkezve."
    ]);
    exit;
}

$user_id = $_SESSION['user_id'];
$product_id = isset($_POST['product_id']) ? (int)$_POST['product_id'] : null;

// Validáció: termékazonosító
if (!$product_id) {
    echo json_encode([
        "success" => false,
        "message" => "Hiányzó vagy hibás termék adat."
    ]);
    exit;
}

try {
    // Ellenőrizzük, hogy a termék már létezik-e a kosárban
    $check = $dbconn->prepare("SELECT id FROM cart WHERE user_id = ? AND product_id = ?");
    $check->bind_param("ii", $user_id, $product_id);
    $check->execute();
    $check->store_result();

    if ($check->num_rows > 0) {
        $check->close();

        // Ha létezik, nem csinálunk semmit, mert csak a user_id és product_id páros kell
        $success = true;
    } else {
        // Ha nem, beszúrjuk újként
        $check->close();

        $insert = $dbconn->prepare("INSERT INTO cart (user_id, product_id) VALUES (?, ?)");
        $insert->bind_param("ii", $user_id, $product_id);
        $success = $insert->execute();
        $insert->close();
    }

    // A terméket az archive táblába is beszúrjuk (új adatbázis tábla)
    if ($success) {
        // Lekérjük a termék adatait a termékek táblából
        $productQuery = $dbconn->prepare("SELECT id, name, description, price, size, condition, img_url FROM products WHERE id = ?");
        $productQuery->bind_param("i", $product_id);
        $productQuery->execute();
        $productQuery->store_result();
        $productQuery->bind_result($product_id, $product_name, $product_description, $product_price, $product_size, $product_condition, $product_img_url);
        $productQuery->fetch();

        // Beszúrjuk az adatokat az archive táblába
        $archiveInsert = $dbconn->prepare("INSERT INTO product_archive (id, name, description, price, size, condition, img_url) 
            VALUES (?, ?, ?, ?, ?, ?, ?)");
        $archiveInsert->bind_param("issdsss", $product_id, $product_name, $product_description, $product_price, $product_size, $product_condition, $product_img_url);
        $archiveSuccess = $archiveInsert->execute();
        $archiveInsert->close();
    }

    echo json_encode([
        "success" => $success && $archiveSuccess,
        "message" => $success ? "Termék sikeresen hozzáadva a kosárhoz." : "Hiba történt a mentés során."
    ]);
} catch (Exception $e) {
    echo json_encode([
        "success" => false,
        "message" => "Hiba történt: " . $e->getMessage()
    ]);
}
?>