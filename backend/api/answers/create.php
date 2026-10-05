<?php

/**
 * POST /api/answers/create — add an answer to a question (auth required)
 * Body: { question_id, answer }
 */

require_once __DIR__ . '/../helpers.php';
require_once __DIR__ . '/../../config/database.php';

cors_headers();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_error('Method not allowed. Use POST.', 405);
}

$user  = require_auth($pdo);
$input = get_json_input();

$questionId = (int) ($input['question_id'] ?? 0);
$answer     = trim($input['answer'] ?? '');

if ($questionId <= 0) {
    json_error('Question ID is required.');
}
if (empty($answer)) {
    json_error('Answer text is required.');
}

/* Verify question exists */
$stmt = $pdo->prepare("SELECT id, user_id FROM questions WHERE id = ?");
$stmt->execute([$questionId]);
$question = $stmt->fetch();

if (!$question) {
    json_error('Question not found.', 404);
}

/* Insert answer */
$stmt = $pdo->prepare(
    "INSERT INTO answers (question_id, user_id, answer)
     VALUES (?, ?, ?)"
);
$stmt->execute([$questionId, $user['id'], $answer]);

$answerId = (int) $pdo->lastInsertId();

/* Create notification for the question owner */
if ($question['user_id'] != $user['id']) {
    require_once __DIR__ . '/../../includes/notification_helper.php';
    createNotification(
        $pdo,
        $question['user_id'],
        $user['name'] . ' answered your question.'
    );
}

json_response([
    'message'   => 'Answer posted successfully.',
    'answer_id' => $answerId,
], 201);
