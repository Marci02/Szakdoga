<?php
// Include the database connection
require_once __DIR__ . '/../connect.php';

header("Content-Type: application/json");

// JSON adatok beolvasása
$data = json_decode(file_get_contents('php://input'), true);

if (!$data) {
    echo json_encode(['message' => 'Invalid JSON data']);
    exit;
}

// Beérkező adatok ellenőrzése
$fileTitle = trim($data['fileTitle'] ?? '');
$fileImg = trim($data['fileImg'] ?? '');
$fileDescription = trim($data['fileDescription'] ?? '');
$filePrice = filter_var($data['filePrice'] ?? null, FILTER_VALIDATE_FLOAT);
$fileQuantity = filter_var($data['fileQuantity'] ?? null, FILTER_VALIDATE_INT);
$fileCategory = trim($data['fileCategory'] ?? '');

// Ellenőrizzük, hogy minden mező ki van-e töltve
if (!$fileTitle || !$fileImg || !$fileDescription || $filePrice === false || $fileQuantity === false || !$fileCategory) {
    echo json_encode(['message' => 'All fields are required and must be valid']);
    exit;
}

// SQL beszúrás előkészített utasítással
$query = "INSERT INTO cards (name, img, description, price, quantity, category) VALUES (?, ?, ?, ?, ?, ?)";
$stmt = mysqli_prepare($dbconn, $query);

if ($stmt) {
    mysqli_stmt_bind_param($stmt, "sssdis", $fileTitle, $fileImg, $fileDescription, $filePrice, $fileQuantity, $fileCategory);

    if (mysqli_stmt_execute($stmt)) {
        echo json_encode(['message' => 'Card added successfully']);
    } else {
        echo json_encode(['message' => 'Error inserting card: ' . mysqli_error($dbconn)]);
    }

    mysqli_stmt_close($stmt);
} else {
    echo json_encode(['message' => 'Database error: ' . mysqli_error($dbconn)]);
}

mysqli_close($dbconn);
?>