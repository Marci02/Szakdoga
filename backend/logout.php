<?php
session_start();
session_unset();  // Törli az összes session változót
session_destroy();  // Megszünteti a session-t

header("Content-Type: application/json");
echo json_encode(["message" => "Sikeres kijelentkezés"]);
?>
