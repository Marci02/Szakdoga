<?php
echo("Sikeres bejelentkezés!");
$email = $_POST["email"];
var_dump($email);


$input = "Teszt Jelszó";
$encrypted = PASSWORD_BCRYPT;
$hashedPassword = hash_hmac("sha512", $input, $encrypted);
echo $hashedPassword."<br />";
$hashedPassword2 = password_hash($input, $encrypted);
echo $hashedPassword2."<br />";

/*
1.: Ellenőrizni, hogy van-e adat(történt-e login gombra kattintás)
2.: Inputban kapott adatok szanitálása (megfelelő hosszúságúakk-e az adatok, megfelelő formátumú, string escape-elés stb)
3.: Email cím alapján felhasználó keresése adatbázisban. Mivel password hashelve van, ezért
 ugyan azzal a módszerrel hash-elni kell a beírt jelszót is, hogy tudjunk egyenlkőséget vizsgálni
4. a.: Ha van, akkor tovább engedjük ha van, akkor tovább engedjük, beállítjuk a
 session-be az expiration date, token, email, id-t m a tokent és expirateion date-et 
 eltároljuk adatbázisban majd átirányítjuk a felhasználót a megfelelő oldalra.
4. b.: Ha nincs, akkor hibba üzenet, hogy hibás felhasználói név / jelszó
*/
?>