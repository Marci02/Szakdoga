<?php

header("Content-Type: application/json");

require "../connect.php";

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit();
}

$request_method = $_SERVER["REQUEST_METHOD"];

switch ($request_method) {
    case 'GET':
        if (isset($_GET['id'])) {
            getUser($_GET['id']);
        } else {
            getUsers();
        }
        break;
    case 'POST':
        addUser();
        break;
    case 'PUT':
        $data = json_decode(file_get_contents("php://input"), true);
        if (isset($data['id'])) {
            updateUser($data['id'], $data);
        } else {
            echo json_encode(["error" => "User ID is required"]);
        }
        break;
    case 'DELETE':
        $data = json_decode(file_get_contents("php://input"), true);
        if (isset($data['id'])) {
            deleteUser($data['id']);
        } else {
            echo json_encode(["error" => "User ID is required"]);
        }
        break;
    default:
        echo json_encode(["error" => "Invalid request method"]);
        break;
}

function getUsers() {
    global $dbconn;
    $sql = "SELECT * FROM user";
    $result = $dbconn->query($sql);
    $users = [];
    while ($row = $result->fetch_assoc()) {
        $users[] = $row;
    }
    echo json_encode($users);
}

function getUser($id) {
    global $dbconn;
    $sql = "SELECT * FROM user WHERE id = ?";
    $stmt = $dbconn->prepare($sql);
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $result = $stmt->get_result();
    echo json_encode($result->fetch_assoc());
}

function addUser() {
    global $dbconn;
    $data = json_decode(file_get_contents("php://input"), true);

    if (!isset($data['firstname'], $data['lastname'], $data['email'], $data['password'])) {
        echo json_encode(["error" => "Missing required fields"]);
        return;
    }

    $sql = "INSERT INTO user (firstname, lastname, email, password, phone_number, city_id, image_url, street, address) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
    $stmt = $dbconn->prepare($sql);
    $stmt->bind_param("ssssissss", $data['firstname'], $data['lastname'], $data['email'], $data['password'], 
        $data['phone_number'], $data['city_id'], $data['image_url'], $data['street'], $data['address']);
    
    if ($stmt->execute()) {
        echo json_encode(["message" => "User added successfully", "id" => $dbconn->insert_id]);
    } else {
        echo json_encode(["error" => "Failed to add user"]);
    }
}

function updateUser($id, $data) {
    global $dbconn;

    if (!isset($data['firstname'], $data['lastname'], $data['email'], $data['password'])) {
        echo json_encode(["error" => "Missing required fields"]);
        return;
    }

    $sql = "UPDATE user SET firstname = ?, lastname = ?, email = ?, password = ?, phone_number = ?, city_id = ?, 
            image_url = ?, street = ?, address = ? WHERE id = ?";
    $stmt = $dbconn->prepare($sql);
    $stmt->bind_param("ssssissssi", $data['firstname'], $data['lastname'], $data['email'], $data['password'], 
        $data['phone_number'], $data['city_id'], $data['image_url'], $data['street'], $data['address'], $id);
    
    if ($stmt->execute()) {
        echo json_encode(["message" => "User updated successfully"]);
    } else {
        echo json_encode(["error" => "Failed to update user"]);
    }
}

function deleteUser($id) {
    global $dbconn;
    $sql = "DELETE FROM user WHERE id = ?";
    $stmt = $dbconn->prepare($sql);
    $stmt->bind_param("i", $id);
    
    if ($stmt->execute()) {
        echo json_encode(["message" => "User deleted successfully"]);
    } else {
        echo json_encode(["error" => "Failed to delete user"]);
    }
}

$dbconn->close();
