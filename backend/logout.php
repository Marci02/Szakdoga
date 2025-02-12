<?php
session_start();
session_unset(); // Minden session változót törlünk
session_destroy(); // Session lezárása

header("Content-Type: application/json");
echo json_encode(["message" => "Logged out successfully"]);
exit;
?>
