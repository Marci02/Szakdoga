<?php
// Include the database connection
require_once __DIR__ . '/../connect.php';

header("Content-Type: application/json");

// Read JSON input data
$data = json_decode(file_get_contents('php://input'), true);

if (!$data) {
    echo json_encode(['message' => 'Invalid JSON data']);
    exit;
}

// Extract and sanitize input data
$fileTitle = trim($data['fileTitle'] ?? '');
$fileImg = trim($data['fileImg'] ?? '');
$fileDescription = trim($data['fileDescription'] ?? '');
$filePrice = filter_var($data['filePrice'] ?? null, FILTER_VALIDATE_FLOAT);
$fileQuantity = filter_var($data['fileQuantity'] ?? null, FILTER_VALIDATE_INT);
$fileCategory = trim($data['fileCategory'] ?? '');

// Validate required fields
if (empty($fileTitle) || empty($fileImg) || empty($fileDescription) || 
    $filePrice === false || $fileQuantity === false || empty($fileCategory)) {
    echo json_encode(['message' => 'All fields are required and must be valid']);
    exit;
}

// Sanitize text inputs to prevent XSS
$fileTitle = htmlspecialchars($fileTitle, ENT_QUOTES, 'UTF-8');
$fileImg = htmlspecialchars($fileImg, ENT_QUOTES, 'UTF-8');
$fileDescription = htmlspecialchars($fileDescription, ENT_QUOTES, 'UTF-8');
$fileCategory = htmlspecialchars($fileCategory, ENT_QUOTES, 'UTF-8');

// Prepare SQL insert query
$query = "INSERT INTO cards (name, img, description, price, quantity, category) VALUES (?, ?, ?, ?, ?, ?)";
$stmt = mysqli_prepare($dbconn, $query);

if ($stmt) {
    mysqli_stmt_bind_param($stmt, "sssdis", $fileTitle, $fileImg, $fileDescription, $filePrice, $fileQuantity, $fileCategory);

    if (mysqli_stmt_execute($stmt)) {
        echo json_encode(['message' => 'Card added successfully']);
    } else {
        echo json_encode(['message' => 'Error inserting card: ' . mysqli_stmt_error($stmt)]);
    }

    mysqli_stmt_close($stmt);
} else {
    echo json_encode(['message' => 'Database error: ' . mysqli_error($dbconn)]);
}

mysqli_close($dbconn);
?>