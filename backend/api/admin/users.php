<?php

/**
 * GET  /api/admin/users — list all users
 * POST /api/admin/users — update user status (block/unblock)
 */

require_once __DIR__ . '/../helpers.php';
require_once __DIR__ . '/../../config/database.php';

cors_headers();

$admin = require_admin($pdo);
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $stmt = $pdo->query(
        "SELECT u.id, u.name, u.email, u.bio, u.role, u.status, u.created_at,
                (SELECT COUNT(*) FROM questions q WHERE q.user_id = u.id) AS question_count,
                (SELECT COUNT(*) FROM answers a WHERE a.user_id = u.id) AS answer_count
         FROM users u
         ORDER BY u.id DESC"
    );
    $users = $stmt->fetchAll();

    json_response(['users' => $users]);
}

if ($method === 'POST') {
    $input = get_json_input();
    $userId = (int) ($input['user_id'] ?? 0);
    $status = trim($input['status'] ?? '');

    if ($userId <= 0) {
        json_error('User ID is required.');
    }

    if (!in_array($status, ['active', 'blocked'], true)) {
        json_error('Status must be "active" or "blocked".');
    }

    if ($userId === (int) $admin['id']) {
        json_error('You cannot change your own admin account status.');
    }

    $stmt = $pdo->prepare("UPDATE users SET status = ? WHERE id = ?");
    $stmt->execute([$status, $userId]);

    json_response([
        'message' => "User status updated to $status.",
        'user_id' => $userId,
        'status'  => $status,
    ]);
}

json_error('Method not allowed.', 405);
