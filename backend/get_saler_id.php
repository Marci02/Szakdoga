<?php
require_once __DIR__ . '/../connect.php';
header("Content-Type: application/json");

$product_id = isset($_GET['product_id']) ? (int)$_GET['product_id'] : 0;

if ($product_id <= 0) {
  echo json_encode(["success" => false, "error" => "Érvénytelen termék azonosító"]);
  exit;
}

$stmt = $dbconn->prepare("
  SELECT user_id 
  FROM products 
  WHERE id = ?
");
$stmt->bind_param("i", $product_id);
$stmt->execute();
$stmt->bind_result($saler_id);

if ($stmt->fetch()) {
  echo json_encode(["success" => true, "saler_id" => $saler_id]);
} else {
  echo json_encode(["success" => false, "error" => "Nem található eladó"]);
}

$stmt->close();
$dbconn->close();
?>