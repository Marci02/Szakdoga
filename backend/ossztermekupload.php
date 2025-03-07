<?php
require_once __DIR__ . '/../connect.php';
session_start();

header('Content-Type: application/json');

if (isset($_FILES['fileInput'], $_POST['fileTitle'], $_POST['fileDesc'], $_POST['filePrice'], $_POST['fileCategory'], $_POST['fileBrand'], $_POST['fileCondition'])) {
    
    $fileTitle = trim($_POST['fileTitle']);
    $fileDesc = trim($_POST['fileDesc']);
    $filePrice = filter_var($_POST['filePrice'], FILTER_VALIDATE_FLOAT);
    $fileCategory = trim($_POST['fileCategory']);
    $fileBrand = trim($_POST['fileBrand']);
    $fileCondition = trim($_POST['fileCondition']);
    $fileSize = isset($_POST['fileSize']) ? trim($_POST['fileSize']) : null;
    $userId = $_SESSION['user_id'] ?? null;

    if (!$userId) {
        echo json_encode(['message' => 'User is not logged in']);
        exit;
    }

    if (empty($fileTitle) || empty($fileDesc) || $filePrice === false || empty($fileCategory) || empty($fileBrand) || empty($fileCondition)) {
        echo json_encode(['message' => 'All fields are required and must be valid']);
        exit;
    }

    // Adatok tisztítása
    $fileTitle = htmlspecialchars($fileTitle, ENT_QUOTES, 'UTF-8');
    $fileDesc = htmlspecialchars($fileDesc, ENT_QUOTES, 'UTF-8');
    $fileCategory = htmlspecialchars($fileCategory, ENT_QUOTES, 'UTF-8');
    $fileBrand = htmlspecialchars($fileBrand, ENT_QUOTES, 'UTF-8');
    $fileCondition = htmlspecialchars($fileCondition, ENT_QUOTES, 'UTF-8');
    if ($fileSize) {
        $fileSize = htmlspecialchars($fileSize, ENT_QUOTES, 'UTF-8');
    }

    // Fájl feltöltés
    $uploadDirectory = __DIR__ . '/../uploads/';
    if (!is_dir($uploadDirectory)) {
        mkdir($uploadDirectory, 0777, true);
    }

    $fileExtension = strtolower(pathinfo($_FILES['fileInput']['name'], PATHINFO_EXTENSION));
    $uniqueFileName = time() . '_' . uniqid() . '.' . $fileExtension;
    $targetFilePath = $uploadDirectory . $uniqueFileName;

    $allowedTypes = ['jpg', 'jpeg', 'png', 'gif'];
    if (!in_array($fileExtension, $allowedTypes)) {
        echo json_encode(['message' => 'Only image files are allowed (jpg, jpeg, png, gif)']);
        exit;
    }

    if (move_uploaded_file($_FILES['fileInput']['tmp_name'], $targetFilePath)) {
        $relativeFilePath = 'uploads/' . $uniqueFileName;

        // Kép feltöltése az adatbázisba
        $imageQuery = "INSERT INTO image (img_url) VALUES (?)";
        $imageStmt = mysqli_prepare($dbconn, $imageQuery);
        if ($imageStmt) {
            mysqli_stmt_bind_param($imageStmt, "s", $relativeFilePath);
            mysqli_stmt_execute($imageStmt);
            $imageId = mysqli_insert_id($dbconn);
            mysqli_stmt_close($imageStmt);
        } else {
            echo json_encode(['message' => 'Error inserting image: ' . mysqli_error($dbconn)]);
            exit;
        }

        // Kategória ID ellenőrzése és beszúrása, ha nem létezik
        $categoryId = null;
        $categoryQuery = "SELECT id FROM category WHERE category_name = ?";
        $categoryStmt = mysqli_prepare($dbconn, $categoryQuery);
        if ($categoryStmt) {
            mysqli_stmt_bind_param($categoryStmt, "s", $fileCategory);
            mysqli_stmt_execute($categoryStmt);
            mysqli_stmt_bind_result($categoryStmt, $categoryId);
            mysqli_stmt_fetch($categoryStmt);
            mysqli_stmt_close($categoryStmt);
        }

        if (!$categoryId) {
            $insertCategoryQuery = "INSERT INTO category (category_name) VALUES (?)";
            $insertCategoryStmt = mysqli_prepare($dbconn, $insertCategoryQuery);
            if ($insertCategoryStmt) {
                mysqli_stmt_bind_param($insertCategoryStmt, "s", $fileCategory);
                mysqli_stmt_execute($insertCategoryStmt);
                $categoryId = mysqli_insert_id($dbconn);
                mysqli_stmt_close($insertCategoryStmt);
            } else {
                echo json_encode(['message' => 'Error inserting category: ' . mysqli_error($dbconn)]);
                exit;
            }
        }

        // Márka ID ellenőrzése és beszúrása, ha nem létezik
        $brandId = null;
        $brandQuery = "SELECT id FROM brand WHERE brand_name = ?";
        $brandStmt = mysqli_prepare($dbconn, $brandQuery);
        if ($brandStmt) {
            mysqli_stmt_bind_param($brandStmt, "s", $fileBrand);
            mysqli_stmt_execute($brandStmt);
            mysqli_stmt_bind_result($brandStmt, $brandId);
            mysqli_stmt_fetch($brandStmt);
            mysqli_stmt_close($brandStmt);
        }

        if (!$brandId) {
            $insertBrandQuery = "INSERT INTO brand (brand_name) VALUES (?)";
            $insertBrandStmt = mysqli_prepare($dbconn, $insertBrandQuery);
            if ($insertBrandStmt) {
                mysqli_stmt_bind_param($insertBrandStmt, "s", $fileBrand);
                mysqli_stmt_execute($insertBrandStmt);
                $brandId = mysqli_insert_id($dbconn);
                mysqli_stmt_close($insertBrandStmt);
            } else {
                echo json_encode(['message' => 'Error inserting brand: ' . mysqli_error($dbconn)]);
                exit;
            }
        }

        // Termék beszúrása az adatbázisba, beleértve az új mezőket
        $productQuery = "INSERT INTO products (user_id, name, category_id, brand_id, price, description, image_id, uploaded_at, condition, size) 
                         VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), ?, ?)";

        $productStmt = mysqli_prepare($dbconn, $productQuery);
        if ($productStmt) {
            mysqli_stmt_bind_param($productStmt, "isiiissss", $userId, $fileTitle, $categoryId, $brandId, $filePrice, $fileDesc, $imageId, $fileCondition, $fileSize);
            if (mysqli_stmt_execute($productStmt)) {
                echo json_encode(['message' => 'Product added successfully']);
            } else {
                echo json_encode(['message' => 'Error inserting product: ' . mysqli_stmt_error($productStmt)]);
            }
            mysqli_stmt_close($productStmt);
        } else {
            echo json_encode(['message' => 'Database error: ' . mysqli_error($dbconn)]);
        }

        mysqli_close($dbconn);
    } else {
        echo json_encode(['message' => 'Error uploading file']);
    }
} else {
    echo json_encode(['message' => 'Invalid request']);
}
?>