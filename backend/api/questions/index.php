<?php

/**
 * GET  /api/questions/list   — list questions (optional ?category_id=&search=)
 * POST /api/questions/create — create a new question (auth required)
 */

require_once __DIR__ . '/../helpers.php';
require_once __DIR__ . '/../../config/database.php';

cors_headers();

$method = $_SERVER['REQUEST_METHOD'];

/* ─── LIST ─── */
if ($method === 'GET') {

    $categoryId = $_GET['category_id'] ?? null;
    $search     = $_GET['search'] ?? null;
    $userId     = $_GET['user_id'] ?? null;

    $sql = "SELECT q.id, q.title, q.description, q.is_anonymous, q.created_at,
                   c.name AS category_name, c.id AS category_id,
                   u.name AS author_name, u.id AS user_id,
                   (SELECT COUNT(*) FROM answers a WHERE a.question_id = q.id) AS answer_count
            FROM questions q
            JOIN categories c ON c.id = q.category_id
            JOIN users u ON u.id = q.user_id
            WHERE 1=1 ";

    $params = [];

    if ($categoryId) {
        $sql .= " AND q.category_id = ?";
        $params[] = $categoryId;
    }
    if ($search) {
        $sql .= " AND (q.title LIKE ? OR q.description LIKE ?)";
        $params[] = "%$search%";
        $params[] = "%$search%";
    }
    if ($userId) {
        $sql .= " AND q.user_id = ?";
        $params[] = $userId;
    }

    $sql .= " ORDER BY q.created_at DESC LIMIT 50";

    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);

    $questions = $stmt->fetchAll();

    // Mask author name for anonymous questions
    foreach ($questions as &$q) {
        if ($q['is_anonymous']) {
            $q['author_name'] = 'Anonymous';
        }
    }

    json_response(['questions' => $questions]);
}

/* ─── CREATE ─── */
if ($method === 'POST') {

    $user  = require_auth($pdo);
    $input = get_json_input();

    $title       = trim($input['title'] ?? '');
    $description = trim($input['description'] ?? '');
    $categoryId  = (int) ($input['category_id'] ?? 0);
    $isAnonymous = !empty($input['is_anonymous']) ? 1 : 0;

    if (empty($title)) {
        json_error('Title is required.');
    }
    if (empty($description)) {
        json_error('Description is required.');
    }
    if ($categoryId <= 0) {
        json_error('Category is required.');
    }

    /* Verify category exists */
    $stmt = $pdo->prepare("SELECT id FROM categories WHERE id = ?");
    $stmt->execute([$categoryId]);
    if (!$stmt->fetch()) {
        json_error('Category not found.');
    }

    $stmt = $pdo->prepare(
        "INSERT INTO questions (user_id, category_id, title, description, is_anonymous)
         VALUES (?, ?, ?, ?, ?)"
    );
    $stmt->execute([$user['id'], $categoryId, $title, $description, $isAnonymous]);

    json_response([
        'message' => 'Question created successfully.',
        'question_id' => (int) $pdo->lastInsertId(),
    ], 201);
}

json_error('Method not allowed.', 405);
