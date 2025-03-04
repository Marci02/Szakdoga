<?php
session_start();
require_once __DIR__ . '/../connect.php';
header("Content-Type: application/json");

$userId = $_SESSION['user_id'] ?? null;

if (!$userId) {
    echo json_encode(["success" => false, "message" => "Nem vagy bejelentkezve."]);
    exit;
}

// 🔹 Profiladatok lekérdezése
$query = "SELECT 
            u.firstname, 
            u.lastname, 
            u.email, 
            u.phone_number, 
            u.street,
            u.address,  
            s.postcode, 
            s.name AS city, 
            c.name AS county,
            u.image_url AS image  -- Az 'image' tábla helyett a 'user.image_url' használata
          FROM user u
          LEFT JOIN settlement s ON u.city_id = s.id
          LEFT JOIN counties c ON s.county_id = c.id
          WHERE u.id = ?";

$stmt = mysqli_prepare($dbconn, $query);

if (!$stmt) {
    echo json_encode(["success" => false, "message" => "Lekérdezési hiba."]);
    exit;
}

mysqli_stmt_bind_param($stmt, "i", $userId);
mysqli_stmt_execute($stmt);
$result = mysqli_stmt_get_result($stmt);

if ($user = mysqli_fetch_assoc($result)) {
    error_log(print_r($user, true)); 
    echo json_encode([
        "success" => true,
        "firstname" => $user['firstname'],
        "lastname" => $user['lastname'],
        "email" => $user['email'],
        "phone_number" => $user['phone_number'],
        "street" => $user['street'] ?? "",
        "address" => $user['address'] ?? "",
        "postcode" => $user['postcode'] ?? "",
        "city" => $user['city'] ?? "Nincs megadva",
        "county" => $user['county'] ?? "Nincs megadva",
        "image" => $user['image'] ?? null
    ]);
} else {
    echo json_encode(["success" => false, "message" => "Felhasználó nem található."]);
}

mysqli_stmt_close($stmt);
mysqli_close($dbconn);
?>
