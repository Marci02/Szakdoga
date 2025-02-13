<?php
session_start();
$_SESSION = []; // Minden session adat törlése
session_destroy();
setcookie(session_name(), "", time() - 3600, "/"); // Session cookie törlése

header("Content-Type: application/json");
echo json_encode(["success" => true]);
exit;
?>
