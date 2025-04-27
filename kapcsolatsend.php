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
            <div style='font-family: Arial, sans-serif; line-height: 1.6; color: #333;'>
                <h2 style='background-color: #4CAF50; color: white; padding: 10px; text-align: center; border-radius: 5px;'>Kapcsolati űrlap üzenet</h2>
                <div style='border: 1px solid #ddd; padding: 15px; border-radius: 5px;'>
                    <p style='margin: 0;'><strong>Név:</strong> " . htmlspecialchars($_POST["name"]) . "</p>
                    <p style='margin: 0;'><strong>Email:</strong> " . htmlspecialchars($_POST["email"]) . "</p>
                    <p style='margin-top: 10px;'><strong>Üzenet:</strong></p>
                    <div style='background-color: #f9f9f9; padding: 10px; border-radius: 5px; border: 1px solid #ddd;'>
                        " . nl2br(htmlspecialchars($_POST["message"])) . "
                    </div>
                </div>
                <footer style='margin-top: 20px; text-align: center; font-size: 12px; color: #777;'>
                    <p>Ez az üzenet a PremSelect weboldal kapcsolatfelvételi űrlapján keresztül érkezett.</p>
                </footer>
            </div>
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