
<?php
// A session hosszabb ideig maradjon érvényes
session_set_cookie_params(3600, "/");  // 3600 másodperc (1 óra), minden útvonalra érvényes
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

// Ellenőrizzük, hogy létezik-e a felhasználó
$query = "SELECT id, firstname, lastname, email, phone_number, postcode, image_id, password, created 
          FROM user WHERE email = ?";
$stmt = mysqli_prepare($dbconn, $query);
mysqli_stmt_bind_param($stmt, 's', $email);
mysqli_stmt_execute($stmt);
mysqli_stmt_bind_result($stmt, $userId, $firstname, $lastname, $email, $phone, $postcode, $imageId, $hashedPassword, $created);
mysqli_stmt_fetch($stmt);
mysqli_stmt_close($stmt);

// Jelszó ellenőrzés
if ($userId && password_verify($password, $hashedPassword)) {
    // Kép URL lekérése, ha van image_id
    $imageUrl = null;
    if (!is_null($imageId)) {
        $imageQuery = "SELECT img_url FROM image WHERE id = ?";
        $imgStmt = mysqli_prepare($dbconn, $imageQuery);
        mysqli_stmt_bind_param($imgStmt, "i", $imageId);
        mysqli_stmt_execute($imgStmt);
        $imgResult = mysqli_stmt_get_result($imgStmt);
        if ($imgRow = mysqli_fetch_assoc($imgResult)) {
            $imageUrl = $imgRow['img_url'];
        }
        mysqli_stmt_close($imgStmt);
    }

    // SESSION adatok beállítása
    $_SESSION['user_id'] = $userId;
    $_SESSION['firstname'] = $firstname;
    $_SESSION['lastname'] = $lastname;
    $_SESSION['email'] = $email;
    $_SESSION['phone'] = $phone;
    $_SESSION['postcode'] = $postcode;
    $_SESSION['image_url'] = $imageUrl;  // A kép elérési útját tároljuk
    $_SESSION['created'] = $created;

    echo json_encode([
        "message" => "Bejelentkezés sikeres!", 
        "loggedIn" => true,
        "user" => [
            "id" => $userId,
            "firstname" => $firstname,
            "lastname" => $lastname,
            "email" => $email,
            "phone" => $phone,
            "postcode" => $postcode,
            "image_url" => $imageUrl,
            "created" => $created
        ]
    ]);
} else {
    echo json_encode(["message" => "Hibás email vagy jelszó."]);
}

mysqli_close($dbconn);
?>
