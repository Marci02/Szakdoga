<?php
session_start();
header("Content-Type: application/json");

// 🔹 Ellenőrizzük, hogy van-e bejelentkezett felhasználó
if (!empty($_SESSION['user_id'])) {
    echo json_encode(["loggedIn" => true, "user" => $_SESSION['user_id']]);
} else {
    echo json_encode(["loggedIn" => false]);
}
?>
