<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'phpmailer/src/Exception.php';
require 'phpmailer/src/PHPMailer.php';
require 'phpmailer/src/SMTP.php';

if (isset($_POST["send"])) {
    $mail = new PHPMailer(true);

    try {
        // SMTP beállítások
        $mail->isSMTP();
        $mail->Host = 'smtp.gmail.com';
        $mail->SMTPAuth = true;
        $mail->Username = 'samuelkonderla@gmail.com'; // A te Gmail címed
        $mail->Password = 'zawv ubnq ieij douo'; // Gmail alkalmazásjelszó
        $mail->SMTPSecure = 'ssl';
        $mail->Port = 465;

        // Feladó
        $mail->setFrom($_POST["email"], $_POST["name"]); // A felhasználó által megadott e-mail és név

        // Címzett
        $mail->addAddress('samuelkonderla@gmail.com'); // A te Gmail címed

        // E-mail tartalma
        $mail->isHTML(true);
        $mail->Subject = 'Kapcsolati űrlap üzenet';
        $mail->Body = "
            <h3>Kapcsolati űrlap üzenet</h3>
            <p><b>Név:</b> {$_POST["name"]}</p>
            <p><b>Email:</b> {$_POST["email"]}</p>
            <p><b>Üzenet:</b><br>{$_POST["message"]}</p>
        ";

        // E-mail küldése
        $mail->send();

        echo "
        <script>
        alert('Az üzenetet sikeresen elküldtük.');
        document.location.href = 'kapcsolat.html';
        </script>
        ";
    } catch (Exception $e) {
        echo "
        <script>
        alert('Hiba történt az üzenet küldésekor: {$mail->ErrorInfo}');
        </script>
        ";
    }
}
?>