<?php

/**
 * GET /api/admin/stats — platform statistics (admin only)
 */

require_once __DIR__ . '/../helpers.php';
require_once __DIR__ . '/../../config/database.php';

cors_headers();

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    json_error('Method not allowed. Use GET.', 405);
}

$admin = require_admin($pdo);

// Total users
$stmt = $pdo->query("SELECT 
    COUNT(*) AS total_users,
    SUM(CASE WHEN role = 'admin' THEN 1 ELSE 0 END) AS total_admins,
    SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) AS active_users,
    SUM(CASE WHEN status = 'blocked' THEN 1 ELSE 0 END) AS blocked_users
    FROM users");
$userStats = $stmt->fetch();

// Total questions
$stmt = $pdo->query("SELECT COUNT(*) AS total_questions FROM questions");
$totalQuestions = (int) $stmt->fetch()['total_questions'];

// Total answers
$stmt = $pdo->query("SELECT COUNT(*) AS total_answers FROM answers");
$totalAnswers = (int) $stmt->fetch()['total_answers'];

// Total categories
$stmt = $pdo->query("SELECT COUNT(*) AS total_categories FROM categories");
$totalCategories = (int) $stmt->fetch()['total_categories'];

// Pending reports
$stmt = $pdo->query("SELECT 
    COUNT(*) AS total_reports,
    SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) AS pending_reports
    FROM reports");
$reportStats = $stmt->fetch();

json_response([
    'stats' => [
        'total_users'      => (int) ($userStats['total_users'] ?? 0),
        'total_admins'     => (int) ($userStats['total_admins'] ?? 0),
        'active_users'     => (int) ($userStats['active_users'] ?? 0),
        'blocked_users'    => (int) ($userStats['blocked_users'] ?? 0),
        'total_questions'  => $totalQuestions,
        'total_answers'    => $totalAnswers,
        'total_categories' => $totalCategories,
        'total_reports'    => (int) ($reportStats['total_reports'] ?? 0),
        'pending_reports'  => (int) ($reportStats['pending_reports'] ?? 0),
    ],
]);
