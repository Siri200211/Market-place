<?php
session_start();
require_once 'api/config/database.php';

// Simple routing
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$uri = explode('/', trim($uri, '/'));

if ($uri[0] === 'api') {
    array_shift($uri); // remove 'api'

    $file = __DIR__ . '/api/' . implode('/', $uri) . '.php';
    
    if (file_exists($file)) {
        require $file;
    } else {
        http_response_code(404);
        echo json_encode(['error' => 'API endpoint not found']);
    }
} else {
    http_response_code(404);
    echo json_encode(['error' => 'Invalid request']);
}
?>