<?php
session_start();
header("Content-Type: application/json");

// Ellenőrizzük, hogy be van-e jelentkezve
if (isset($_SESSION['user_id'])) {
    echo json_encode([
        "loggedIn" => true,
        "user" => [
            "id" => $_SESSION['user_id'],
            "firstname" => $_SESSION['firstname'],
            "lastname" => $_SESSION['lastname'],
            "email" => $_SESSION['email']
        ]
    ]);
} else {
    echo json_encode(["loggedIn" => false]);
}
?>
