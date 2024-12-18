<?php
$input = "teszt jelszó";

$hashedPassword   = password_hash($input, PASSWORD_BCRYPT);
$verifiedPassword = password_verify($input, $hashedPassword);
echo $hashedPassword."<br /><br />";
var_dump($verifiedPassword);
if($verifiedPassword == $hashedPassword) {
    echo "Megegyezik a jelszó";   
} else {
   echo" nem egyezik meg a jelszó";
}
/*
Ez pedig leírás a password_hash és hash_hmac között:
Röviden: hash_hmac 2 fél közötti üzenetek titkosítására való egy titkos kulcs segítségével
         password_hash és password_verify pedig a jelszó tárolásra használatos
https://security.stackexchange.com/questions/16809/is-a-hmac-ed-password-is-more-secure-than-a-bcrypt-ed-or-scrypt-ed-password
*/
?>