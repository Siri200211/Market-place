<?php
require_once __DIR__ . '/../config/database.php';
session_start();

// Log for debugging (check XAMPP logs later if needed)
error_log("Google login attempt started");

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    $idToken = $input['token'] ?? '';

    if (!$idToken) {
        http_response_code(400);
        echo json_encode(['error' => 'No token provided']);
        exit;
    }

    $CLIENT_ID = '1051773537048-50ku177q1vusu9iuu31k40pclk4nr5vh.apps.googleusercontent.com';

    // Verify token with Google
    $url = "https://oauth2.googleapis.com/tokeninfo?id_token=" . urlencode($idToken);
    $context = stream_context_create([
        'http' => [
            'method' => 'GET',
            'header' => "User-Agent: Mozilla/5.0 (compatible; PHP)\r\n"
        ]
    ]);
    $response = @file_get_contents($url, false, $context);
    
    if ($response === false) {
        error_log("Token fetch failed: " . print_r($http_response_header, true));
        http_response_code(500);
        echo json_encode(['error' => 'Token verification failed (network)']);
        exit;
    }

    $payload = json_decode($response, true);
    error_log("Token payload: " . print_r($payload, true));  // Debug: Check XAMPP logs

    if (!$payload || !isset($payload['sub']) || $payload['aud'] !== $CLIENT_ID || $payload['iss'] !== 'https://accounts.google.com' && $payload['iss'] !== 'accounts.google.com') {
        http_response_code(401);
        echo json_encode(['error' => 'Invalid Google token', 'debug' => $payload ? $payload['error_description'] ?? 'N/A' : 'No payload']);
        exit;
    }

    // Valid token
    $googleId = $payload['sub'];
    $email = $payload['email'];
    $name = $payload['name'];
    $picture = $payload['picture'] ?? '';

    // Save/update user
    $stmt = $pdo->prepare("INSERT INTO users (google_id, name, email) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE name = VALUES(name), email = VALUES(email)");
    $stmt->execute([$googleId, $name, $email]);

    $userId = $pdo->lastInsertId();
    if (!$userId) {
        $stmt = $pdo->prepare("SELECT id FROM users WHERE google_id = ?");
        $stmt->execute([$googleId]);
        $userId = $stmt->fetchColumn();
    }

    // Session
    $_SESSION['user_id'] = $userId;
    $_SESSION['name'] = $name;
    $_SESSION['email'] = $email;

    echo json_encode([
        'success' => true,
        'user' => [
            'id' => $userId,
            'name' => $name,
            'email' => $email,
            'picture' => $picture
        ]
    ]);
} else {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
}
?>