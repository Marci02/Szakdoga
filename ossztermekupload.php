<?php
$servername = "localhost";
$username = "username";
$password = "password";
$dbname = "database_name";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Check if form is submitted
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $fileTitle = $_POST['fileTitle'];
    $fileImg = $_POST['fileImg'];
    $fileDescription = $_POST['fileDescription'];
    $filePrice = $_POST['filePrice'];
    $fileQuantity = $_POST['fileQuantity'];
    $fileCategory = $_POST['fileCategory'];

    $sql = "INSERT INTO cards (name, description, price) VALUES ('$fileTitle', '$fileImg', '$fileDescription', '$filePrice', '$fileQuantity', '$fileCategory')";

    if ($conn->query($sql) === TRUE) {
        echo "New card added successfully";
    } else {
        echo "Error: " . $sql . "<br>" . $conn->error;
    }
}

$conn->close();
?>