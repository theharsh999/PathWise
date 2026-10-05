<?php

/**
 * GET /api/notifications/list — get user notifications (auth required)
 * POST /api/notifications/read — mark notification as read (auth required)
 */

require_once __DIR__ . '/../helpers.php';
require_once __DIR__ . '/../../config/database.php';

cors_headers();

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $user = require_auth($pdo);

    $stmt = $pdo->prepare(
        "SELECT id, message, is_read, created_at
         FROM notifications
         WHERE user_id = ?
         ORDER BY created_at DESC
         LIMIT 50"
    );
    $stmt->execute([$user['id']]);

    json_response(['notifications' => $stmt->fetchAll()]);
}

if ($method === 'POST') {
    $user  = require_auth($pdo);
    $input = get_json_input();

    $notifId = (int) ($input['notification_id'] ?? 0);

    if ($notifId <= 0) {
        /* Mark all as read */
        $stmt = $pdo->prepare("UPDATE notifications SET is_read = 1 WHERE user_id = ?");
        $stmt->execute([$user['id']]);
        json_response(['message' => 'All notifications marked as read.']);
    } else {
        $stmt = $pdo->prepare("UPDATE notifications SET is_read = 1 WHERE id = ? AND user_id = ?");
        $stmt->execute([$notifId, $user['id']]);
        json_response(['message' => 'Notification marked as read.']);
    }
}

json_error('Method not allowed.', 405);
