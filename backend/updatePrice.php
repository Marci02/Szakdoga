<?php
require_once __DIR__ . '/../connect.php'; // Kapcsolódás az adatbázishoz
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);

    if (isset($data['auctionId'], $data['currentPrice'], $data['userId'])) {
        $auctionId = intval($data['auctionId']);
        $currentPrice = intval($data['currentPrice']);
        $userId = intval($data['userId']);

        // Ellenőrizzük az alapárat az adatbázisból
        $sql = "SELECT price, ho FROM auction WHERE id = ?";
        $stmt = $dbconn->prepare($sql);
        $stmt->bind_param("i", $auctionId);
        $stmt->execute();
        $result = $stmt->get_result();
        $auction = $result->fetch_assoc();

        if ($auction) {
            $basePrice = intval($auction['price']);
            $currentHo = intval($auction['ho']);

            // Ellenőrizzük, hogy az új ár nagyobb-e az alapárnál és az aktuális árnál
            if ($currentPrice > $basePrice && $currentPrice > $currentHo) {
                // Frissítjük az adatbázisban az aktuális árat és a licitáló felhasználót
                $updateSql = "UPDATE auction SET ho = ?, ho_id = ? WHERE id = ?";
                $updateStmt = $dbconn->prepare($updateSql);
                $updateStmt->bind_param("iii", $currentPrice, $userId, $auctionId);

                if ($updateStmt->execute()) {
                    echo json_encode(["status" => "success", "message" => "Ár és felhasználó sikeresen frissítve"]);
                } else {
                    echo json_encode(["status" => "error", "message" => "Hiba történt az ár frissítésekor"]);
                }
                $updateStmt->close();
            } else {
                echo json_encode(["status" => "error", "message" => "Az új ár nem lehet kisebb az alapárnál vagy az aktuális árnál"]);
            }
        } else {
            echo json_encode(["status" => "error", "message" => "Aukció nem található"]);
        }
        $stmt->close();
    } else {
        echo json_encode(["status" => "error", "message" => "Hiányzó adatok"]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "Érvénytelen kérés"]);
}

$dbconn->close();
?>