<?php
header("Content-Type: application/json");
require_once '..\..\connect.php'; // vagy ide jön a csatlakozásod

$sql = "
SELECT 
    a.id AS auction_id,
    a.name,
    a.price,
    a.stair,
    a.auction_end,
    a.size,
    a.condition,
    i.img_url,
    b.brand_name,
    c.category_name
FROM auction a
LEFT JOIN image i ON a.image_id = i.id
LEFT JOIN brand b ON a.brand_id = b.id
LEFT JOIN category c ON a.category_id = c.id
ORDER BY a.uploaded_at DESC
";

$result = $conn->query($sql);

if ($result->num_rows > 0) {
    $auctions = [];

    while ($row = $result->fetch_assoc()) {
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
?>
