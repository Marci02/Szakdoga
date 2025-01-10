<?php
/*
echo("Sikeres bejelentkezés!");
$email = $_POST["email"];
var_dump($email);


$input = "Teszt Jelszó";
$encrypted = PASSWORD_BCRYPT;
$hashedPassword = hash_hmac("sha512", $input, $encrypted);
echo $hashedPassword."<br />";
$hashedPassword2 = password_hash($input, $encrypted);
echo $hashedPassword2."<br />";


1.: Ellenőrizni, hogy van-e adat(történt-e login gombra kattintás)
2.: Inputban kapott adatok szanitálása (megfelelő hosszúságúakk-e az adatok, megfelelő formátumú, string escape-elés stb)
3.: Email cím alapján felhasználó keresése adatbázisban. Mivel password hashelve van, ezért
 ugyan azzal a módszerrel hash-elni kell a beírt jelszót is, hogy tudjunk egyenlkőséget vizsgálni
4. a.: Ha van, akkor tovább engedjük ha van, akkor tovább engedjük, beállítjuk a
 session-be az expiration date, token, email, id-t m a tokent és expirateion date-et 
 eltároljuk adatbázisban majd átirányítjuk a felhasználót a megfelelő oldalra.
4. b.: Ha nincs, akkor hibba üzenet, hogy hibás felhasználói név / jelszó
*/

session_start();

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $input = file_get_contents("php://input");
    $data = json_decode($input, true);

    require_once __DIR__ . '/../connect.php';

    header("Content-Type: application/json");

    if (!$data) {
        echo json_encode(['message' => 'Invalid JSON data']);
        exit;
    }

    $email = trim($data['email'] ?? '');
    $password = $data['password'] ?? '';

    if (empty($email) || empty($password)) {
        echo json_encode(['message' => 'All fields are required']);
        exit;
    }
    if(!filter_var($email, FILTER_VALIDATE_EMAIL)){
        echo json_encode(['message' => 'Invalid email format']);
        exit;
    }
    if(strlen($password) < 8){
        echo json_encode(['message' => 'Password must be at least 8 characters long']);
        exit;
    }

    $query = "SELECT id, email, password FROM user WHERE email = ?";

    $stmt = mysqli_prepare($dbconn, $query);
    mysqli_stmt_bind_param($stmt, 's', $email);
    mysqli_stmt_execute($stmt);
    mysqli_stmt_bind_result($stmt, $email, $hashedPassword);
    mysqli_stmt_fetch($stmt);
    mysqli_stmt_close($stmt);

    if (password_verify($password, $hashedPassword)) {
        die();
    }
    else {
        echo json_encode(['message' => 'Invalid email or password']);
        exit;
    }
    mysqli_close($dbconn);
}



?>