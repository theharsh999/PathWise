<?php

/**
 * GET  /api/admin/reports — list all reports
 * POST /api/admin/reports — update report status (pending/reviewed/resolved)
 */

require_once __DIR__ . '/../helpers.php';
require_once __DIR__ . '/../../config/database.php';

cors_headers();

$admin = require_admin($pdo);
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $stmt = $pdo->query(
        "SELECT r.id, r.user_id, r.question_id, r.answer_id, r.reason, r.status, r.created_at,
                u.name AS reporter_name, u.email AS reporter_email,
                q.title AS question_title,
                a.answer AS answer_snippet
         FROM reports r
         JOIN users u ON u.id = r.user_id
         LEFT JOIN questions q ON q.id = r.question_id
         LEFT JOIN answers a ON a.id = r.answer_id
         ORDER BY r.id DESC"
    );
    json_response(['reports' => $stmt->fetchAll()]);
}

if ($method === 'POST') {
    $input = get_json_input();
    $id = (int) ($input['id'] ?? 0);
    $status = trim($input['status'] ?? '');

    if ($id <= 0) {
        json_error('Report ID is required.');
    }

    if (!in_array($status, ['pending', 'reviewed', 'resolved'], true)) {
        json_error('Status must be "pending", "reviewed", or "resolved".');
    }

    $stmt = $pdo->prepare("UPDATE reports SET status = ? WHERE id = ?");
    $stmt->execute([$status, $id]);

    json_response([
        'message' => "Report updated to $status.",
        'id'      => $id,
        'status'  => $status,
    ]);
}

json_error('Method not allowed.', 405);
