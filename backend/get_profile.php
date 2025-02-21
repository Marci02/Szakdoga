<?php
session_start();
header("Content-Type: application/json");

if (!isset($_SESSION['user_id'])) {
    echo json_encode(["success" => false, "error" => "Nincs bejelentkezett felhasználó"]);
    exit;
}

echo json_encode([
    "success" => true,  // ✔ Hozzáadva a success kulcs!
    "firstname" => $_SESSION['firstname'],
    "lastname" => $_SESSION['lastname'],
    "email" => $_SESSION['email'],
    "created" => $_SESSION['created'],
    "phone_number" => $_SESSION['phone_number'] ?? null,
    "postcode" => $_SESSION['postcode'] ?? null,
    "image" => $_SESSION['image'] ?? null
]);
?>
