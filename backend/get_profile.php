<?php
session_start();

if (!isset($_SESSION['user_id'])) {
    echo json_encode(["error" => "Nincs bejelentkezett felhasználó"]);
    exit;
}

echo json_encode([
    "firstname" => $_SESSION['firstname'],
    "lastname" => $_SESSION['lastname'],
    "email" => $_SESSION['email'],
    "created" => $_SESSION['created'],
    "phone_number" => isset($_SESSION['phone_number']) ? $_SESSION['phone_number'] : null,
    "postcode" => isset($_SESSION['postcode']) ? $_SESSION['postcode'] : null,
    "image" => isset($_SESSION['image']) ? $_SESSION['image'] : null
]);
?>
