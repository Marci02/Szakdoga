<?php
session_start();
require_once __DIR__ . '/../connect.php';
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_SESSION['user_id'])) {
        $userId = intval($_SESSION['user_id']);

        if ($dbconn->connect_error) {
            echo json_encode(['success' => false, 'message' => 'Adatbázis kapcsolat hiba.']);
            exit;
        }

        // Kapcsolódó termékek törlése
        $deleteProductsStmt = $dbconn->prepare("DELETE FROM products WHERE user_id = ?");
        $deleteProductsStmt->bind_param("i", $userId);
        $deleteProductsStmt->execute();
        $deleteProductsStmt->close();

        // Felhasználó törlése
        $deleteUserStmt = $dbconn->prepare("DELETE FROM user WHERE id = ?");
        $deleteUserStmt->bind_param("i", $userId);

        if ($deleteUserStmt->execute()) {
            unset($_SESSION['user_id']);
            session_destroy();
            echo json_encode(['success' => true]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Nem sikerült törölni a felhasználót.']);
        }

        $deleteUserStmt->close();
        $dbconn->close();
    } else {
        echo json_encode(['success' => false, 'message' => 'Felhasználó nincs bejelentkezve.']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Érvénytelen kérés.']);
}
?>