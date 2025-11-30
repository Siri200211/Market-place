<?php
require_once __DIR__ . '/../config/database.php';
session_start();

$id = intval($_GET['id'] ?? 0);
if ($id <= 0) die(json_encode(['error' => 'Invalid ID']));

$stmt = $pdo->prepare("SELECT a.*, c.name as category_name, l.name as location_name, u.name as seller_name, u.email as seller_email
                       FROM ads a
                       JOIN categories c ON a.category_id = c.id
                       JOIN locations l ON a.location_id = l.id
                       JOIN users u ON a.user_id = u.id
                       WHERE a.id = ? AND a.status = 'active'");
$stmt->execute([$id]);
$ad = $stmt->fetch();

if (!$ad) {
    http_response_code(404);
    echo json_encode(['error' => 'Ad not found']);
    exit;
}

$photos = $pdo->prepare("SELECT photo_path FROM photos WHERE ad_id = ?");
$photos->execute([$id]);
$ad['photos'] = $photos->fetchAll(PDO::FETCH_COLUMN);

echo json_encode($ad);
?>