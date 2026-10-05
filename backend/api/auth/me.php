<?php

/**
 * GET /api/auth/me
 * Header: Authorization: Bearer <token>
 * Returns the currently authenticated user profile.
 */

require_once __DIR__ . '/../helpers.php';
require_once __DIR__ . '/../../config/database.php';

cors_headers();

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    json_error('Method not allowed. Use GET.', 405);
}

$user = require_auth($pdo);

json_response(['user' => $user]);
