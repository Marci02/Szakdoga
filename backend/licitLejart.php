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
    $sql = "SELECT ho_id AS buyer_id, user_id AS saler_id, id AS auction_id, auction_end FROM auction WHERE id = ?";
    $stmt = $dbconn->prepare($sql);
    $stmt->bind_param("i", $auction_id);
    $stmt->execute();
    $result = $stmt->get_result();
    $auction = $result->fetch_assoc();

    if ($auction) {
        $currentTime = new DateTime();
        $auctionEndTime = new DateTime($auction['auction_end']);

        // Ellenőrizzük, hogy a licit lejárt-e
        if ($currentTime > $auctionEndTime) {
            $buyer_id = (int)$auction['buyer_id'];
            $saler_id = (int)$auction['saler_id'];

            if ($buyer_id > 0) {
                // Hozzáadás a sales táblához az auction_id alapján
                $quantity = 1; // Alapértelmezett mennyiség
                $stmtInsert = $dbconn->prepare("INSERT INTO sales (saler_id, buyer_id, product_id, auction_id, quantity, sold_at) VALUES (?, ?, 1, ?, ?, NOW())");
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
            echo json_encode(["success" => false, "error" => "A licit még nem járt le."]);
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