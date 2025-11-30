<?php
require_once __DIR__ . '/../config/database.php';
session_start();

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['error' => 'Login required']);
    exit;
}

$title       = trim($_POST['title'] ?? '');
$description = trim($_POST['description'] ?? '');
$price       = floatval($_POST['price'] ?? 0);
$category_id = intval($_POST['category_id'] ?? 0);
$location_id = intval($_POST['location_id'] ?? 0);

if ($title === '' || $price <= 0 || $category_id <= 0 || $location_id <= 0) {
    http_response_code(400);
    echo json_encode(['error' => 'All fields are required']);
    exit;
}

try {
    $pdo->beginTransaction();

    $stmt = $pdo->prepare("INSERT INTO ads (user_id, title, description, price, category_id, location_id) 
                           VALUES (?, ?, ?, ?, ?, ?)");
    $stmt->execute([$_SESSION['user_id'], $title, $description, $price, $category_id, $location_id]);
    $adId = $pdo->lastInsertId();

    // Handle multiple photos
    if (isset($_FILES['photos']) && count($_FILES['photos']['name']) > 0) {
        foreach ($_FILES['photos']['name'] as $key => $name) {
            if ($_FILES['photos']['error'][$key] == 0) {
                $ext = pathinfo($name, PATHINFO_EXTENSION);
                $newName = uniqid('ad_') . '.' . $ext;
                $path = __DIR__ . '/../../uploads/' . $newName;

                if (move_uploaded_file($_FILES['photos']['tmp_name'][$key], $path . $newName)) {
                    $stmt = $pdo->prepare("INSERT INTO photos (ad_id, photo_path) VALUES (?, ?)");
                    $stmt->execute([$adId, 'uploads/' . $newName]);
                }
            }
        }
    }

    $pdo->commit();
    echo json_encode(['success' => true, 'ad_id' => $adId]);

} catch (Exception $e) {
    $pdo->rollBack();
    http_response_code(500);
    echo json_encode(['error' => 'Server error']);
}
?>