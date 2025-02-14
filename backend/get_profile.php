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
    "phone_number" => $_SESSION['phone_number'],
    "postcode" => $_SESSION['postcode'],
    "image" => $_SESSION['image']
]);
?>
