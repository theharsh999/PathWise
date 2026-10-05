<?php

/**
 * GET /api/categories — list all categories
 */

require_once __DIR__ . '/../helpers.php';
require_once __DIR__ . '/../../config/database.php';

cors_headers();

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    json_error('Method not allowed. Use GET.', 405);
}

$stmt = $pdo->prepare(
    "SELECT c.id, c.name, c.description, c.created_at,
            COUNT(q.id) AS question_count
     FROM categories c
     LEFT JOIN questions q ON q.category_id = c.id
     GROUP BY c.id
     ORDER BY c.name ASC"
);
$stmt->execute();

json_response(['categories' => $stmt->fetchAll()]);
