<?php
session_start();
session_destroy(); // Minden session törlése
header("Content-Type: application/json");
echo json_encode(["message" => "Logged out"]);
?>
