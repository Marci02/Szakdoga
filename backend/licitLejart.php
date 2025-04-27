<?php
session_start();
require_once __DIR__ . '/../connect.php';
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);

    if (!isset($data['auction_id'])) {
        echo json_encode(["success" => false, "error" => "Hiányzó adatok"]);
        exit;
    }

    $auction_id = (int)$data['auction_id'];

    // Lekérjük az aukció adatait
    $sql = "SELECT ho_id AS buyer_id, user_id AS saler_id, id AS auction_id FROM auction WHERE id = ?";
    $stmt = $dbconn->prepare($sql);
    $stmt->bind_param("i", $auction_id);
    $stmt->execute();
    $result = $stmt->get_result();
    $auction = $result->fetch_assoc();

    if ($auction) {
        $buyer_id = (int)$auction['buyer_id'];
        $saler_id = (int)$auction['saler_id'];

        if ($buyer_id > 0) {
            // Ellenőrizzük, hogy létezik-e már a bejegyzés
            $checkSql = "SELECT COUNT(*) AS count FROM sales WHERE saler_id = ? AND buyer_id = ? AND auction_id = ?";
            $checkStmt = $dbconn->prepare($checkSql);
            $checkStmt->bind_param("iii", $saler_id, $buyer_id, $auction_id);
            $checkStmt->execute();
            $checkResult = $checkStmt->get_result();
            $checkRow = $checkResult->fetch_assoc();

            if ($checkRow['count'] > 0) {
                echo json_encode(["success" => false, "error" => "Ez a bejegyzés már létezik a sales táblában."]);
                exit;
            }

            // Hozzáadás a sales táblához az auction_id alapján
            $quantity = 1; // Alapértelmezett mennyiség
            $stmtInsert = $dbconn->prepare("INSERT INTO sales (saler_id, buyer_id, product_id, auction_id, quantity) VALUES (?, ?, NULL, ?, ? )");
            $stmtInsert->bind_param("iiii", $saler_id, $buyer_id, $auction_id, $quantity);

            if ($stmtInsert->execute()) {
                echo json_encode(["success" => true, "message" => "A termék sikeresen hozzáadva a sales táblához."]);
            } else {
                echo json_encode(["success" => false, "error" => "Adatbázis hiba a sales táblába helyezés során."]);
            }
            $stmtInsert->close();
        } else {
            echo json_encode(["success" => false, "error" => "Nincs nyertes a licitnél."]);
        }
    } else {
        echo json_encode(["success" => false, "error" => "Aukció nem található."]);
    }

    $stmt->close();
} else {
    echo json_encode(["success" => false, "error" => "Érvénytelen kérés"]);
}

$dbconn->close();
?>