<?php

/**
 * API Helpers — shared utilities for all JSON endpoints.
 *
 * • json_response()  — send a JSON response with proper headers
 * • json_error()     — send an error JSON response
 * • cors_headers()   — set CORS headers for frontend proxy
 * • get_json_input() — parse JSON body from POST/PUT/PATCH
 * • require_auth()   — validate session token, return user row
 * • require_admin()  — validate session token + admin role
 * • generate_token() — create a random auth token
 */

// Prevent any HTML error output
ini_set('display_errors', '0');
error_reporting(E_ALL);

function cors_headers(): void
{
    header('Content-Type: application/json; charset=utf-8');
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization');

    // Handle preflight
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(204);
        exit;
    }
}

function json_response(mixed $data, int $status = 200): void
{
    http_response_code($status);
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}

function json_error(string $message, int $status = 400): void
{
    http_response_code($status);
    echo json_encode(['error' => true, 'message' => $message], JSON_UNESCAPED_UNICODE);
    exit;
}

function get_json_input(): array
{
    $raw = file_get_contents('php://input');
    if (!$raw) {
        return [];
    }
    $data = json_decode($raw, true);
    return is_array($data) ? $data : [];
}

/**
 * Validates the Authorization: Bearer <token> header.
 * Returns the full user row from the DB, or sends 401.
 */
function require_auth(PDO $pdo): array
{
    $header = $_SERVER['HTTP_AUTHORIZATION'] ?? '';

    if (!preg_match('/^Bearer\s+(.+)$/i', $header, $m)) {
        json_error('Authentication required. Please log in.', 401);
    }

    $token = $m[1];

    $stmt = $pdo->prepare(
        "SELECT id, name, email, bio, role, status, created_at
         FROM users
         WHERE auth_token = ? AND status = 'active'"
    );
    $stmt->execute([$token]);
    $user = $stmt->fetch();

    if (!$user) {
        json_error('Invalid or expired token. Please log in again.', 401);
    }

    return $user;
}

/**
 * Same as require_auth but also checks admin role.
 */
function require_admin(PDO $pdo): array
{
    $user = require_auth($pdo);
    if ($user['role'] !== 'admin') {
        json_error('Admin access required.', 403);
    }
    return $user;
}

/**
 * Generate a cryptographically random 64-char hex token.
 */
function generate_token(): string
{
    return bin2hex(random_bytes(32));
}
