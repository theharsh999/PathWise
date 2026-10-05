<?php

/**
 * POST /api/auth/logout
 * Header: Authorization: Bearer <token>
 * Clears the token from the database.
 */

require_once __DIR__ . '/../helpers.php';
require_once __DIR__ . '/../../config/database.php';

cors_headers();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_error('Method not allowed. Use POST.', 405);
}

$user = require_auth($pdo);

/* Clear auth token */
$stmt = $pdo->prepare("UPDATE users SET auth_token = NULL WHERE id = ?");
$stmt->execute([$user['id']]);

json_response(['message' => 'Logged out successfully.']);
