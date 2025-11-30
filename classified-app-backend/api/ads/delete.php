<?php
require_once __DIR__ . '/../config/database.php';
session_start();

if ($_SERVER['REQUEST_METHOD'] !== 'DELETE') {
    http_response_code(405);
    exit;
}

parse_str(file_get_contents('php://input'), $input);
$id = intval($input['id'] ?? 0);

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['error' => 'Login required']);
    exit;
}

$stmt = $pdo->prepare("UPDATE ads SET status = 'deleted' WHERE id = ? AND user_id = ?");
$stmt->execute([$id, $_SESSION['user_id']]);

echo json_encode(['success' => $stmt->rowCount() > 0]);
?>