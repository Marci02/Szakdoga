<?php
session_start();
require_once __DIR__ . '/../connect.php';
header("Content-Type: application/json");

// Hibák megjelenítése (fejlesztéshez)
ini_set('display_errors', 1);
error_reporting(E_ALL);

// Ellenőrzés: Be van-e jelentkezve a felhasználó?
$userId = $_SESSION['user_id'] ?? null;
if (!$userId) {
    echo json_encode(["success" => false, "message" => "Nincs bejelentkezett felhasználó."]);
    exit;
}

// Adatok fogadása
$firstname = trim($_POST['firstname'] ?? '');
$lastname = trim($_POST['lastname'] ?? '');
$email = trim($_POST['email'] ?? '');
$phone = trim($_POST['phone'] ?? '');
$street = trim($_POST['street'] ?? '');
$address = trim($_POST['address'] ?? '');

// **Profilkép feltöltése**
$imagePath = null;
if (isset($_FILES["profile_image"]) && $_FILES["profile_image"]["error"] == 0) {
    $allowedTypes = ["image/jpeg", "image/png", "image/gif"];
    $maxSize = 2 * 1024 * 1024; // 2MB

    $file = $_FILES["profile_image"];
    
    if (!in_array($file["type"], $allowedTypes)) {
        echo json_encode(["success" => false, "message" => "Csak JPG, PNG vagy GIF formátum engedélyezett."]);
        exit;
    }

    if ($file["size"] > $maxSize) {
        echo json_encode(["success" => false, "message" => "A fájl mérete túl nagy (max. 2MB)."]);
        exit;
    }

    // Feltöltési könyvtár ellenőrzése
    $uploadDir = __DIR__ . "/../uploads/";
    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0777, true);
    }

    // Új fájlnév generálása
    $fileExtension = pathinfo($file["name"], PATHINFO_EXTENSION);
    $fileName = "profile_" . $userId . "." . $fileExtension;
    $filePath = $uploadDir . $fileName;

    if (!move_uploaded_file($file["tmp_name"], $filePath)) {
        echo json_encode(["success" => false, "message" => "Hiba a fájl mentése közben."]);
        exit;
    }

    // Relatív elérési út mentése az adatbázisba
    $imagePath = "uploads/" . $fileName;
}

// Ha nincs mit frissíteni
if (!$firstname && !$lastname && !$email && !$phone && !$street && !$address && !$imagePath) {
    echo json_encode(["success" => false, "message" => "Nincs módosítandó adat."]);
    exit;
}

// **SQL lekérdezés dinamikusan**
$setClauses = [];
$params = [];
$paramTypes = "";

// Frissítendő mezők hozzáadása
if (!empty($firstname)) {
    $setClauses[] = "firstname = ?";
    $params[] = &$firstname;
    $paramTypes .= "s";
}
if (!empty($lastname)) {
    $setClauses[] = "lastname = ?";
    $params[] = &$lastname;
    $paramTypes .= "s";
}
if (!empty($email)) {
    $setClauses[] = "email = ?";
    $params[] = &$email;
    $paramTypes .= "s";
}
if (!empty($phone)) {
    $setClauses[] = "phone_number = ?";
    $params[] = &$phone;
    $paramTypes .= "s";
}
if (!empty($street)) {
    $setClauses[] = "street = ?";
    $params[] = &$street;
    $paramTypes .= "s";
}
if (!empty($address)) {
    $setClauses[] = "address = ?";
    $params[] = &$address;
    $paramTypes .= "s";
}
if (!empty($imagePath)) {
    $setClauses[] = "image_url = ?";
    $params[] = &$imagePath;
    $paramTypes .= "s";
}

// SQL lekérdezés összeállítása
$query = "UPDATE user SET " . implode(", ", $setClauses) . " WHERE id = ?";
$params[] = &$userId;
$paramTypes .= "i";

// Lekérdezés előkészítése és futtatása
$stmt = mysqli_prepare($dbconn, $query);
if (!$stmt) {
    echo json_encode(["success" => false, "message" => "SQL hiba: " . mysqli_error($dbconn)]);
    exit;
}
mysqli_stmt_bind_param($stmt, $paramTypes, ...$params);
$success = mysqli_stmt_execute($stmt);
mysqli_stmt_close($stmt);

// **SESSION frissítése**
if ($success) {
    $query = "SELECT firstname, lastname, email, phone_number, street, address, image_url FROM user WHERE id = ?";
    $stmt = mysqli_prepare($dbconn, $query);
    mysqli_stmt_bind_param($stmt, "i", $userId);
    mysqli_stmt_execute($stmt);
    $result = mysqli_stmt_get_result($stmt);
    $updatedUser = mysqli_fetch_assoc($result);
    
    // Új adatok mentése a SESSION változókba
    $_SESSION['firstname'] = $updatedUser['firstname'];
    $_SESSION['lastname'] = $updatedUser['lastname'];
    $_SESSION['email'] = $updatedUser['email'];
    $_SESSION['phone'] = $updatedUser['phone_number'];
    $_SESSION['street'] = $updatedUser['street'];
    $_SESSION['address'] = $updatedUser['address'];
    $_SESSION['image'] = $updatedUser['image_url'];

    echo json_encode(["success" => true, "message" => "Profil adatok frissítve!", "image_url" => $updatedUser['image_url']]);
} else {
    echo json_encode(["success" => false, "message" => "Nem történt változás vagy hiba az adatbázisban."]);
}

// Kapcsolat bezárása
mysqli_close($dbconn);
?>
