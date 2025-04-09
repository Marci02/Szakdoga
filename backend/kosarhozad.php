<?php
session_start();
require_once __DIR__ . '/../connect.php';
header('Content-Type: application/json; charset=utf-8');

if (!isset($_SESSION['user_id'])) {
    echo json_encode(["success" => false, "message" => "Nem vagy bejelentkezve."]);
    exit;
}

$user_id = $_SESSION['user_id'];
$product_id = $_POST['product_id'] ?? null;
$quantity = $_POST['quantity'] ?? 1;

if (!$product_id || $quantity <= 0) {
    echo json_encode(["success" => false, "message" => "Hiányzó vagy hibás termék adat"]);
    exit;
}

// 🔸 Ellenőrizzük, hogy már benne van-e a kosárban
$check = $dbconn->prepare("SELECT quantity FROM cart WHERE user_id = ? AND product_id = ?");
$check->bind_param("ii", $user_id, $product_id);
$check->execute();
$check->store_result();

if ($check->num_rows > 0) {
    // 🔹 Már van ilyen termék a kosárban → frissítjük a mennyiséget
    $check->close();
    $update = $dbconn->prepare("UPDATE cart SET quantity = quantity + ? WHERE user_id = ? AND product_id = ?");
    $update->bind_param("iii", $quantity, $user_id, $product_id);
    $success = $update->execute();
    $update->close();
} else {
    // 🔹 Nincs még a kosárban → új bejegyzés
    $check->close();
    $insert = $dbconn->prepare("INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)");
    $insert->bind_param("iii", $user_id, $product_id, $quantity);
    $success = $insert->execute();
    $insert->close();
}

echo json_encode([
    "success" => $success,
    "message" => $success ? "Termék kosárhoz adva." : "Hiba történt."
]);
?>
