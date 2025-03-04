<?php
session_set_cookie_params(3600, "/");
session_start();

require_once __DIR__ . '/../connect.php';
header("Content-Type: application/json");

$data = json_decode(file_get_contents("php://input"), true);
$email = trim($data['email'] ?? '');
$password = $data['password'] ?? '';

if (empty($email) || empty($password)) {
    echo json_encode(["message" => "Email és jelszó megadása kötelező."]);
    exit;
}

// 🔹 Felhasználó adatainak lekérése (város ID-vel és kép ID-vel)
$query = "SELECT u.id, u.firstname, u.lastname, u.email, u.phone_number, 
                 u.city_id, u.password, u.created, 
                 u.street, u.address, u.image_url
          FROM user u WHERE u.email = ?";
$stmt = mysqli_prepare($dbconn, $query);
mysqli_stmt_bind_param($stmt, 's', $email);
mysqli_stmt_execute($stmt);
$result = mysqli_stmt_get_result($stmt);
$user = mysqli_fetch_assoc($result);
mysqli_stmt_close($stmt);

// Ha nincs ilyen felhasználó
if (!$user) {
    echo json_encode(["message" => "Hibás email vagy jelszó."]);
    exit;
}

// 🔹 Jelszó ellenőrzés
if (!password_verify($password, $user['password'])) {
    echo json_encode(["message" => "Hibás email vagy jelszó."]);
    exit;
}

// 🔹 Város, megye és irányítószám lekérése
$city = $county = $postcode = null;
if (!empty($user['city_id'])) {
    $cityQuery = "SELECT s.name AS city, s.postcode, c.name AS county 
                  FROM settlement s
                  LEFT JOIN counties c ON s.county_id = c.id
                  WHERE s.id = ?";
    $cityStmt = mysqli_prepare($dbconn, $cityQuery);
    mysqli_stmt_bind_param($cityStmt, "i", $user['city_id']);
    mysqli_stmt_execute($cityStmt);
    $cityResult = mysqli_stmt_get_result($cityStmt);
    if ($cityRow = mysqli_fetch_assoc($cityResult)) {
        $city = $cityRow['city'];
        $county = $cityRow['county'];
        $postcode = $cityRow['postcode'];
    }
    mysqli_stmt_close($cityStmt);
}

// 🔹 Kép URL lekérése
$imageUrl = $user['image_url'] ?? null;

// 🔹 SESSION adatok beállítása
$_SESSION['user_id'] = $user['id'];
$_SESSION['firstname'] = $user['firstname'];
$_SESSION['lastname'] = $user['lastname'];
$_SESSION['email'] = $user['email'];
$_SESSION['phone_number'] = $user['phone_number'];
$_SESSION['street'] = $user['street'] ?? "";
$_SESSION['address'] = $user['address'] ?? "";
$_SESSION['postcode'] = $postcode;
$_SESSION['city'] = $city;
$_SESSION['county'] = $county;
$_SESSION['image'] = $imageUrl;
$_SESSION['created'] = $user['created'];

echo json_encode([
    "message" => "Bejelentkezés sikeres!", 
    "loggedIn" => true,
    "user" => [
        "id" => $user['id'],
        "firstname" => $user['firstname'],
        "lastname" => $user['lastname'],
        "email" => $user['email'],
        "phone_number" => $user['phone_number'],
        "street" => $user['street'] ?? "",
        "address" => $user['address'] ?? "",
        "postcode" => $postcode,
        "city" => $city,
        "county" => $county,
        "image" => $imageUrl,
        "created" => $user['created']
    ]
]);

mysqli_close($dbconn);
?>
