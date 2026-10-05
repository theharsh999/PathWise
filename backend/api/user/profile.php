<?php

/**
 * GET  /api/user/profile         — get own profile (auth required)
 * PUT  /api/user/profile         — update own profile (auth required)
 * Body for PUT: { name?, bio? }
 */

require_once __DIR__ . '/../helpers.php';
require_once __DIR__ . '/../../config/database.php';

cors_headers();

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $user = require_auth($pdo);

    /* Get stats */
    $stmt = $pdo->prepare("SELECT COUNT(*) AS cnt FROM questions WHERE user_id = ?");
    $stmt->execute([$user['id']]);
    $questionCount = $stmt->fetch()['cnt'];

    $stmt = $pdo->prepare("SELECT COUNT(*) AS cnt FROM answers WHERE user_id = ?");
    $stmt->execute([$user['id']]);
    $answerCount = $stmt->fetch()['cnt'];

    json_response([
        'user' => $user,
        'stats' => [
            'questions_asked'   => (int) $questionCount,
            'answers_given'     => (int) $answerCount,
        ],
    ]);
}

if ($method === 'PUT') {
    $user  = require_auth($pdo);
    $input = get_json_input();

    $name = trim($input['name'] ?? $user['name']);
    $bio  = trim($input['bio'] ?? $user['bio'] ?? '');

    if (empty($name)) {
        json_error('Name cannot be empty.');
    }

    $stmt = $pdo->prepare("UPDATE users SET name = ?, bio = ? WHERE id = ?");
    $stmt->execute([$name, $bio, $user['id']]);

    json_response(['message' => 'Profile updated.', 'user' => [
        'id'         => $user['id'],
        'name'       => $name,
        'email'      => $user['email'],
        'bio'        => $bio,
        'role'       => $user['role'],
        'status'     => $user['status'],
        'created_at' => $user['created_at'],
    ]]);
}

json_error('Method not allowed.', 405);
