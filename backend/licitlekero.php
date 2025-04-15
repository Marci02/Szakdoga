<?php
header("Content-Type: application/json");

// Csatlakozás beolvasása
require_once __DIR__ . '/../connect.php'; // Ezt igazítsd a te mappastruktúrád szerint, ha szükséges

$sql = "
SELECT 
    a.id AS auction_id,
    a.user_id,
    a.name,
    a.price,
    a.ho AS price, -- Aktuális ár
    a.ho_id, -- Az aktuális licitáló felhasználó azonosítója
    a.stair,
    a.auction_end,
    a.size,
    a.condition,
    a.description,
    i.img_url,
    b.brand_name,
    c.category_name
FROM auction a
LEFT JOIN image i ON a.image_id = i.id
LEFT JOIN brand b ON a.brand_id = b.id
LEFT JOIN category c ON a.category_id = c.id
WHERE a.auction_end > NOW() -- Csak a jövőbeli licitek
ORDER BY a.uploaded_at DESC
";

$result = $dbconn->query($sql);

if ($result->num_rows > 0) {
    $auctions = [];

    while ($row = $result->fetch_assoc()) {
        // Kép elérési út korrekció
        if (!empty($row['img_url'])) {
            $row['img_url'] = "uploads/" . $row['img_url'];
        }
        $auctions[] = $row;
    }

    echo json_encode([
        "status" => "success",
        "data" => $auctions
    ]);
} else {
    echo json_encode([
        "status" => "success",
        "data" => []
    ]);
}

$dbconn->close();
?>