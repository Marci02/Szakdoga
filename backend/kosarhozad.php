<?php
session_start();
require_once __DIR__ . '/../connect.php';
header("Content-Type: application/json");

if (!isset($_SESSION['user_id'])) {
  echo json_encode(["success" => false, "error" => "Nincs bejelentkezve"]);
  exit;
}

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['product_id'], $data['saler_id'], $data['quantity'])) {
  echo json_encode(["success" => false, "error" => "Hiányzó adatok"]);
  exit;
}

$product_id = (int)$data['product_id'];
$saler_id = (int)$data['saler_id'];
$quantity = (int)$data['quantity'];
$buyer_id = $_SESSION['user_id'];

// Ellenőrizzük, hogy a termék eladója nem egyezik-e meg a bejelentkezett felhasználóval
if ($saler_id === $buyer_id) {
  echo json_encode(["success" => false, "error" => "Nem adhatod hozzá a saját termékedet a kosárhoz."]);
  exit;
}

// sold_at nem kerül be
$stmt = $dbconn->prepare("INSERT INTO sales (saler_id, buyer_id, product_id, quantity) VALUES (?, ?, ?, ?)");
$stmt->bind_param("iiii", $saler_id, $buyer_id, $product_id, $quantity);

if ($stmt->execute()) {
  echo json_encode(["success" => true]);
} else {
  echo json_encode(["success" => false, "error" => "Adatbázis hiba"]);
}

$stmt->close();
$dbconn->close();
?>