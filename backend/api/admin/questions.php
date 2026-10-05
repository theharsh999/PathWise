<?php

/**
 * GET    /api/admin/questions — list all questions for admin
 * DELETE /api/admin/questions — delete question (admin only)
 */

require_once __DIR__ . '/../helpers.php';
require_once __DIR__ . '/../../config/database.php';

cors_headers();

$admin = require_admin($pdo);
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $stmt = $pdo->query(
        "SELECT q.id, q.title, q.description, q.is_anonymous, q.created_at,
                c.name AS category_name, c.id AS category_id,
                u.name AS author_name, u.email AS author_email, u.id AS user_id,
                (SELECT COUNT(*) FROM answers a WHERE a.question_id = q.id) AS answer_count
         FROM questions q
         JOIN categories c ON c.id = q.category_id
         JOIN users u ON u.id = q.user_id
         ORDER BY q.created_at DESC
         LIMIT 100"
    );
    json_response(['questions' => $stmt->fetchAll()]);
}

if ($method === 'DELETE') {
    $input = get_json_input();
    $id = (int) ($input['id'] ?? ($_GET['id'] ?? 0));

    if ($id <= 0) {
        json_error('Question ID is required.');
    }

    $stmt = $pdo->prepare("DELETE FROM questions WHERE id = ?");
    $stmt->execute([$id]);

    json_response(['message' => 'Question deleted successfully.']);
}

json_error('Method not allowed.', 405);
