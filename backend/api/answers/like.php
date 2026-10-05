<?php

/**
 * POST /api/answers/like — toggle like on an answer (auth required)
 * Body: { answer_id }
 */

require_once __DIR__ . '/../helpers.php';
require_once __DIR__ . '/../../config/database.php';

cors_headers();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_error('Method not allowed. Use POST.', 405);
}

$user  = require_auth($pdo);
$input = get_json_input();

$answerId = (int) ($input['answer_id'] ?? 0);

if ($answerId <= 0) {
    json_error('Answer ID is required.');
}

/* Check if already liked */
$stmt = $pdo->prepare("SELECT id FROM likes WHERE answer_id = ? AND user_id = ?");
$stmt->execute([$answerId, $user['id']]);

if ($stmt->fetch()) {
    /* Unlike */
    $stmt = $pdo->prepare("DELETE FROM likes WHERE answer_id = ? AND user_id = ?");
    $stmt->execute([$answerId, $user['id']]);
    json_response(['message' => 'Like removed.', 'liked' => false]);
} else {
    /* Like */
    $stmt = $pdo->prepare("INSERT INTO likes (answer_id, user_id) VALUES (?, ?)");
    $stmt->execute([$answerId, $user['id']]);
    json_response(['message' => 'Liked.', 'liked' => true]);
}
