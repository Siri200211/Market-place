<?php
require_once __DIR__ . '/../config/database.php';
session_start();

if (isset($_SESSION['user_id'])) {
    echo json_encode([
        'loggedIn' => true,
        'user' => [
            'id'    => $_SESSION['user_id'],
            'name'  => $_SESSION['name'],
            'email' => $_SESSION['email']
        ]
    ]);
} else {
    http_response_code(401);
    echo json_encode(['loggedIn' => false]);
}
?>