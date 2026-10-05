<?php

/**
 * POST /api/auth/login
 * Body: { email, password }
 * Returns: { user: {...}, token: "..." }
 */

require_once __DIR__ . '/../helpers.php';
require_once __DIR__ . '/../../config/database.php';

cors_headers();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_error('Method not allowed. Use POST.', 405);
}

$input = get_json_input();
$email    = trim($input['email'] ?? '');
$password = $input['password'] ?? '';

if (empty($email) || empty($password)) {
    json_error('Email and password are required.');
}

/* Find user */
$stmt = $pdo->prepare(
    "SELECT id, name, email, password, bio, role, status, created_at
     FROM users
     WHERE email = ?"
);
$stmt->execute([$email]);
$user = $stmt->fetch();

if (!$user) {
    json_error('Invalid email or password.', 401);
}

if ($user['status'] === 'blocked') {
    json_error('Your account has been blocked. Contact support.', 403);
}

if (!password_verify($password, $user['password'])) {
    json_error('Invalid email or password.', 401);
}

/* Generate and store token */
$token = generate_token();

$stmt = $pdo->prepare("UPDATE users SET auth_token = ? WHERE id = ?");
$stmt->execute([$token, $user['id']]);

/* Return user (without password hash) */
unset($user['password']);

json_response([
    'user' => $user,
    'token' => $token,
]);
