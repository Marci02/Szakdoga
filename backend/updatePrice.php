<?php
require_once __DIR__ . '/../connect.php';
session_start(); // A session elindítása
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);

    if (isset($data['auctionId'], $data['currentPrice']) && isset($_SESSION['user_id'])) {
        $auctionId = intval($data['auctionId']);
        $currentPrice = intval($data['currentPrice']);
        $userId = intval($_SESSION['user_id']); // A bejelentkezett felhasználó azonosítója

        // Lekérjük az aukcióhoz tartozó adatokat, beleértve a tulajdonost
        $sql = "SELECT price, ho, user_id FROM auction WHERE id = ?";
        $stmt = $dbconn->prepare($sql);
        $stmt->bind_param("i", $auctionId);
        $stmt->execute();
        $result = $stmt->get_result();
        $auction = $result->fetch_assoc();

        if ($auction) {
            $basePrice = intval($auction['price']);
            $currentHo = intval($auction['ho']);
            $ownerId = intval($auction['user_id']);

            // NE lehessen saját termékre licitálni
            if ($ownerId === $userId) {
                echo json_encode([
                    "status" => "error",
                    "message" => "Nem licitálhatsz a saját termékedre",
                    "ownerId" => $ownerId,
                    "userId" => $userId
                ]);
                exit;
            }

            // Ár ellenőrzés
            if ($currentPrice > $basePrice && $currentPrice > $currentHo) {
                $updateSql = "UPDATE auction SET ho = ?, ho_id = ? WHERE id = ?";
                $updateStmt = $dbconn->prepare($updateSql);
                $updateStmt->bind_param("iii", $currentPrice, $userId, $auctionId);
                if ($updateStmt->execute()) {
                    echo json_encode([
                        "status" => "success",
                        "message" => "Ár és licitáló sikeresen frissítve",
                        "updatedPrice" => $currentPrice,
                        "updatedUserId" => $userId
                    ]);
                } else {
                    echo json_encode([
                        "status" => "error",
                        "message" => "Hiba történt az ár frissítésekor"
                    ]);
                }
                $updateStmt->close();
            } else {
                echo json_encode([
                    "status" => "error",
                    "message" => "Az új ár nem lehet kisebb az alapárnál vagy az aktuális árnál"
                ]);
            }
        } else {
            echo json_encode([
                "status" => "error",
                "message" => "Aukció nem található"
            ]);
        }
        $stmt->close();
    } else {
        echo json_encode([
            "status" => "error",
            "message" => "Hiányzó adatok vagy nincs bejelentkezett felhasználó"
        ]);
    }
} else {
    echo json_encode([
        "status" => "error",
        "message" => "Érvénytelen kérés"
    ]);
}

$dbconn->close();
?>
