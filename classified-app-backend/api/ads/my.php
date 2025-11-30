<?php
require_once __DIR__ . '/../config/database.php';
session_start();

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['error' => 'Login required']);
    exit;
}

$stmt = $pdo->prepare("SELECT a.*, c.name as category_name, l.name as location_name
                       FROM ads a
                       JOIN categories c ON a.category_id = c.id
                       JOIN locations l ON a.location_id = l.id
                       WHERE a.user_id = ?
                       ORDER BY a.created_at DESC");
$stmt->execute([$_SESSION['user_id']]);
$ads = $stmt->fetchAll();

foreach ($ads as &$ad) {
    $p = $pdo->prepare("SELECT photo_path FROM photos WHERE ad_id = ? LIMIT 1");
    $p->execute([$ad['id']]);
    $ad['first_photo'] = $p->fetchColumn();
}
echo json_encode($ads);
?>