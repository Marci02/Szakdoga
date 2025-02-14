<?php
require_once __DIR__ . '/../connect.php';
session_start(); // Start session to get logged-in user ID

header("Content-Type: application/json");

// Ellenőrizzük, hogy minden POST adat és fájl megérkezett
if (isset($_FILES['fileInput']) && isset($_POST['fileTitle']) && isset($_POST['fileDesc']) && isset($_POST['filePrice']) && isset($_POST['fileQuantity']) && isset($_POST['fileCategory'])) {
    
    // POST adatok beolvasása és tisztítása
    $fileTitle = trim($_POST['fileTitle']);
    $fileDesc = trim($_POST['fileDesc']);
    $filePrice = filter_var($_POST['filePrice'], FILTER_VALIDATE_FLOAT);
    $fileQuantity = filter_var($_POST['fileQuantity'], FILTER_VALIDATE_INT);
    $fileCategory = trim($_POST['fileCategory']);
    $userId = $_SESSION['user_id'] ?? null; // Felhasználó ellenőrzése

    if (!$userId) {
        echo json_encode(['message' => 'User is not logged in']);
        exit;
    }

    if (empty($fileTitle) || empty($fileDesc) || $filePrice === false || $fileQuantity === false || empty($fileCategory)) {
        echo json_encode(['message' => 'All fields are required and must be valid']);
        exit;
    }

    // Beviteli adatok tisztítása
    $fileTitle = htmlspecialchars($fileTitle, ENT_QUOTES, 'UTF-8');
    $fileDesc = htmlspecialchars($fileDesc, ENT_QUOTES, 'UTF-8');
    $fileCategory = htmlspecialchars($fileCategory, ENT_QUOTES, 'UTF-8');

    // **Fájlfeltöltés kezelése**
    $uploadDirectory = __DIR__ . '/../uploads/'; // Abszolút útvonal a feltöltésekhez

    // Ellenőrizzük, hogy az uploads mappa létezik-e, ha nem, akkor létrehozzuk
    if (!is_dir($uploadDirectory)) {
        mkdir($uploadDirectory, 0777, true);
    }

    // Egyedi fájlnév létrehozása az ütközések elkerülése érdekében
    $fileExtension = strtolower(pathinfo($_FILES['fileInput']['name'], PATHINFO_EXTENSION));
    $uniqueFileName = time() . '_' . uniqid() . '.' . $fileExtension;
    $targetFilePath = $uploadDirectory . $uniqueFileName;

    // Engedélyezett fájltípusok ellenőrzése
    $allowedTypes = ['jpg', 'jpeg', 'png', 'gif'];
    if (!in_array($fileExtension, $allowedTypes)) {
        echo json_encode(['message' => 'Only image files are allowed (jpg, jpeg, png, gif)']);
        exit;
    }

    // Fájl áthelyezése az uploads mappába
    if (move_uploaded_file($_FILES['fileInput']['tmp_name'], $targetFilePath)) {

        // Az adatbázisban az elérési utat relatívan tároljuk
        $relativeFilePath = 'uploads/' . $uniqueFileName;

        // Kép beszúrása az adatbázisba
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

        // Kategória ID keresése vagy létrehozása
        $categoryQuery = "SELECT id FROM category WHERE category_name = ?";
        $categoryStmt = mysqli_prepare($dbconn, $categoryQuery);
        if ($categoryStmt) {
            mysqli_stmt_bind_param($categoryStmt, "s", $fileCategory);
            mysqli_stmt_execute($categoryStmt);
            mysqli_stmt_bind_result($categoryStmt, $categoryId);
            mysqli_stmt_fetch($categoryStmt);
            mysqli_stmt_close($categoryStmt);
        }

        // Ha a kategória nem létezik, létrehozzuk
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

        // Termék hozzáadása az adatbázishoz
        $productQuery = "INSERT INTO products (user_id, name, category_id, price, description, image_id, uploaded_at, db) 
                         VALUES (?, ?, ?, ?, ?, ?, NOW(), ?)";

        $productStmt = mysqli_prepare($dbconn, $productQuery);
        if ($productStmt) {
            mysqli_stmt_bind_param($productStmt, "isidsii", $userId, $fileTitle, $categoryId, $filePrice, $fileDesc, $imageId, $fileQuantity);
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