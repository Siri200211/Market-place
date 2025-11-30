<?php
require_once __DIR__ . '/../config/database.php';  // This now handles CORS & OPTIONS perfectly
session_start();

$stmt = $pdo->query("SELECT * FROM categories ORDER BY name");
echo json_encode($stmt->fetchAll());
?>