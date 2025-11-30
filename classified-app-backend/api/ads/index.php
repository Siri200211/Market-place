<?php
require_once __DIR__ . '/../config/database.php';
session_start();

$search      = trim($_GET['search'] ?? '');
$category    = intval($_GET['category'] ?? 0);
$location    = intval($_GET['location'] ?? 0);
$min_price   = floatval($_GET['min_price'] ?? 0);
$max_price   = floatval($_GET['max_price'] ?? 0);
$page        = max(1, intval($_GET['page'] ?? 1));
$limit       = 12;
$offset      = ($page - 1) * $limit;

$sql = "SELECT a.*, c.name as category_name, l.name as location_name, u.name as seller_name
        FROM ads a
        JOIN categories c ON a.category_id = c.id
        JOIN locations l ON a.location_id = l.id
        JOIN users u ON a.user_id = u.id
        WHERE a.status = 'active'";

$params = [];

if ($search !== '') {
    $sql .= " AND a.title LIKE ?";
    $params[] = "%$search%";
}
if ($category > 0) {
    $sql .= " AND a.category_id = ?";
    $params[] = $category;
}
if ($location > 0) {
    $sql .= " AND a.location_id = ?";
    $params[] = $location;
}
if ($min_price > 0) {
    $sql .= " AND a.price >= ?";
    $params[] = $min_price;
}
if ($max_price > 0) {
    $sql .= " AND a.price <= ?";
    $params[] = $max_price;
}

$sql .= " ORDER BY a.created_at DESC LIMIT $limit OFFSET $offset";

$stmt = $pdo->prepare($sql);
$stmt->execute($params);
$ads = $stmt->fetchAll();

// Add first photo to each ad
foreach ($ads as &$ad) {
    $stmt2 = $pdo->prepare("SELECT photo_path FROM photos WHERE ad_id = ? LIMIT 1");
    $stmt2->execute([$ad['id']]);
    $ad['first_photo'] = $stmt2->fetchColumn() ?: null;
}
unset($ad);

echo json_encode([
    'ads' => $ads,
    'page' => $page,
    'has_more' => count($ads) === $limit
]);
?>