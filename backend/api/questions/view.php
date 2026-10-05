<?php

/**
 * GET /api/questions/view?id=<id> — get a single question with its answers
 */

require_once __DIR__ . '/../helpers.php';
require_once __DIR__ . '/../../config/database.php';

cors_headers();

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    json_error('Method not allowed. Use GET.', 405);
}

$id = (int) ($_GET['id'] ?? 0);
if ($id <= 0) {
    json_error('Question ID is required.');
}

/* Get question */
$stmt = $pdo->prepare(
    "SELECT q.id, q.title, q.description, q.is_anonymous, q.created_at,
            c.name AS category_name, c.id AS category_id,
            u.name AS author_name, u.id AS user_id
     FROM questions q
     JOIN categories c ON c.id = q.category_id
     JOIN users u ON u.id = q.user_id
     WHERE q.id = ?"
);
$stmt->execute([$id]);
$question = $stmt->fetch();

if (!$question) {
    json_error('Question not found.', 404);
}

if ($question['is_anonymous']) {
    $question['author_name'] = 'Anonymous';
}

/* Get answers with like counts and replies */
$stmt = $pdo->prepare(
    "SELECT a.id, a.answer, a.is_best, a.created_at,
            u.name AS author_name, u.id AS user_id,
            (SELECT COUNT(*) FROM likes l WHERE l.answer_id = a.id) AS like_count
     FROM answers a
     JOIN users u ON u.id = a.user_id
     WHERE a.question_id = ?
     ORDER BY a.is_best DESC, a.created_at ASC"
);
$stmt->execute([$id]);
$answers = $stmt->fetchAll();

/* Get replies for each answer */
foreach ($answers as &$answer) {
    $stmt = $pdo->prepare(
        "SELECT r.id, r.reply, r.created_at,
                u.name AS author_name, u.id AS user_id
         FROM replies r
         JOIN users u ON u.id = r.user_id
         WHERE r.answer_id = ?
         ORDER BY r.created_at ASC"
    );
    $stmt->execute([$answer['id']]);
    $answer['replies'] = $stmt->fetchAll();
}

json_response([
    'question' => $question,
    'answers'  => $answers,
]);
