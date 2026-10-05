<?php

/**
 * POST /api/auth/register
 * Body: { name, email, password, confirm_password }
 * Returns: { user: {...}, token: "..." }
 */

require_once __DIR__ . '/../helpers.php';
require_once __DIR__ . '/../../config/database.php';

cors_headers();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_error('Method not allowed. Use POST.', 405);
}

$input = get_json_input();
$name             = trim($input['name'] ?? '');
$email            = trim($input['email'] ?? '');
$password         = $input['password'] ?? '';
$confirm_password = $input['confirm_password'] ?? '';

/* Validate */
if (empty($name)) {
    json_error('Name is required.');
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    json_error('Invalid email address.');
}

if (strlen($password) < 6) {
    json_error('Password must be at least 6 characters.');
}

if ($password !== $confirm_password) {
    json_error('Passwords do not match.');
}

/* Check duplicate email */
$stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
$stmt->execute([$email]);

if ($stmt->fetch()) {
    json_error('An account with this email already exists.');
}

/* Create user with token */
$hashed   = password_hash($password, PASSWORD_DEFAULT);
$token    = generate_token();

$stmt = $pdo->prepare(
    "INSERT INTO users (name, email, password, auth_token)
     VALUES (?, ?, ?, ?)"
);
$stmt->execute([$name, $email, $hashed, $token]);

$userId = $pdo->lastInsertId();

/* Return the new user */
json_response([
    'user' => [
        'id'         => (int) $userId,
        'name'       => $name,
        'email'      => $email,
        'bio'        => null,
        'role'       => 'user',
        'status'     => 'active',
        'created_at' => date('Y-m-d H:i:s'),
    ],
    'token' => $token,
], 201);
