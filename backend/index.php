<?php

/**
 * Backend API Router & Entry Point
 *
 * All requests to localhost:8000 return STRICT JSON responses.
 * Under NO circumstances are HTML, EJS, or raw PHP pages rendered.
 */

// Force JSON response header
header('Content-Type: application/json; charset=utf-8');

// Global CORS headers
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

// Handle preflight immediately
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// Convert any PHP errors/warnings into JSON responses
set_error_handler(function ($errno, $errstr, $errfile, $errline) {
    if (!(error_reporting() & $errno)) {
        return false;
    }
    http_response_code(500);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode([
        'error'   => true,
        'message' => "Internal Server Error: $errstr in " . basename($errfile) . ":$errline",
    ], JSON_UNESCAPED_UNICODE);
    exit;
});

set_exception_handler(function (Throwable $e) {
    http_response_code(500);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode([
        'error'   => true,
        'message' => $e->getMessage(),
    ], JSON_UNESCAPED_UNICODE);
    exit;
});

// Normalize request path
$method  = $_SERVER['REQUEST_METHOD'];
$rawUri  = $_SERVER['REQUEST_URI'] ?? '/';
$path    = parse_url($rawUri, PHP_URL_PATH);
$path    = rtrim($path, '/');
if ($path === '') {
    $path = '/';
}

// Root path — Return API status and endpoint catalog
if ($path === '/' || $path === '') {
    echo json_encode([
        'name'         => 'Pathwise Advice Platform Backend API',
        'version'      => '1.0.0',
        'status'       => 'healthy',
        'mode'         => 'json_only',
        'message'      => 'This is a headless JSON REST API. All endpoints return application/json. The frontend application is available at http://localhost:3000.',
        'frontend_url' => 'http://localhost:3000',
        'endpoints'    => [
            'auth' => [
                'POST /api/auth/login'    => 'Authenticate with email and password',
                'POST /api/auth/register' => 'Create a new user account',
                'POST /api/auth/logout'   => 'Revoke active session token',
                'GET  /api/auth/me'       => 'Get profile of authenticated user',
            ],
            'categories' => [
                'GET  /api/categories'      => 'List all categories with question counts',
                'GET  /api/categories/list' => 'Alias for categories list',
            ],
            'questions' => [
                'GET  /api/questions'       => 'List recent questions with optional ?category_id=&search=',
                'GET  /api/questions/list'  => 'Alias for questions list',
                'GET  /api/questions/view'  => 'Get question details and answers by ?id=',
                'POST /api/questions/index' => 'Create a question (auth required)',
            ],
            'answers' => [
                'POST /api/answers/create' => 'Submit answer to a question (auth required)',
                'POST /api/answers/like'   => 'Toggle like on an answer (auth required)',
            ],
            'notifications' => [
                'GET  /api/notifications'  => 'List user notifications (auth required)',
                'POST /api/notifications'  => 'Mark notifications as read (auth required)',
            ],
            'user' => [
                'GET  /api/user/profile' => 'Get user profile and statistics (auth required)',
                'PUT  /api/user/profile' => 'Update user profile name/bio (auth required)',
            ],
            'admin' => [
                'GET    /api/admin/stats'      => 'Platform metrics and counts (admin only)',
                'GET    /api/admin/users'      => 'List registered users (admin only)',
                'POST   /api/admin/users'      => 'Block or unblock user (admin only)',
                'GET    /api/admin/categories' => 'Manage categories (admin only)',
                'POST   /api/admin/categories' => 'Add new category (admin only)',
                'DELETE /api/admin/categories' => 'Delete category (admin only)',
                'GET    /api/admin/questions'  => 'List all questions (admin only)',
                'DELETE /api/admin/questions'  => 'Delete question (admin only)',
                'GET    /api/admin/reports'    => 'List user reports (admin only)',
                'POST   /api/admin/reports'    => 'Update report status (admin only)',
            ],
        ],
    ], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
    exit;
}

// Route table (supports both clean URIs and .php extensions)
$routes = [
    'GET' => [
        // Auth
        '/api/auth/me'             => __DIR__ . '/api/auth/me.php',
        '/api/auth/me.php'         => __DIR__ . '/api/auth/me.php',

        // Categories
        '/api/categories'          => __DIR__ . '/api/categories/list.php',
        '/api/categories/list'     => __DIR__ . '/api/categories/list.php',
        '/api/categories/list.php' => __DIR__ . '/api/categories/list.php',

        // Questions
        '/api/questions'           => __DIR__ . '/api/questions/index.php',
        '/api/questions/list'      => __DIR__ . '/api/questions/index.php',
        '/api/questions/index'     => __DIR__ . '/api/questions/index.php',
        '/api/questions/index.php' => __DIR__ . '/api/questions/index.php',
        '/api/questions/view'      => __DIR__ . '/api/questions/view.php',
        '/api/questions/view.php'  => __DIR__ . '/api/questions/view.php',

        // Notifications
        '/api/notifications'          => __DIR__ . '/api/notifications/index.php',
        '/api/notifications/index'      => __DIR__ . '/api/notifications/index.php',
        '/api/notifications/index.php'  => __DIR__ . '/api/notifications/index.php',

        // User
        '/api/user/profile'        => __DIR__ . '/api/user/profile.php',
        '/api/user/profile.php'    => __DIR__ . '/api/user/profile.php',

        // Admin
        '/api/admin/stats'         => __DIR__ . '/api/admin/stats.php',
        '/api/admin/users'         => __DIR__ . '/api/admin/users.php',
        '/api/admin/categories'    => __DIR__ . '/api/admin/categories.php',
        '/api/admin/questions'     => __DIR__ . '/api/admin/questions.php',
        '/api/admin/reports'       => __DIR__ . '/api/admin/reports.php',
    ],
    'POST' => [
        // Auth
        '/api/auth/login'          => __DIR__ . '/api/auth/login.php',
        '/api/auth/login.php'      => __DIR__ . '/api/auth/login.php',
        '/api/auth/register'       => __DIR__ . '/api/auth/register.php',
        '/api/auth/register.php'   => __DIR__ . '/api/auth/register.php',
        '/api/auth/logout'         => __DIR__ . '/api/auth/logout.php',
        '/api/auth/logout.php'     => __DIR__ . '/api/auth/logout.php',

        // Questions
        '/api/questions'           => __DIR__ . '/api/questions/index.php',
        '/api/questions/create'    => __DIR__ . '/api/questions/index.php',
        '/api/questions/index'     => __DIR__ . '/api/questions/index.php',
        '/api/questions/index.php' => __DIR__ . '/api/questions/index.php',

        // Answers
        '/api/answers/create'      => __DIR__ . '/api/answers/create.php',
        '/api/answers/create.php'  => __DIR__ . '/api/answers/create.php',
        '/api/answers/like'        => __DIR__ . '/api/answers/like.php',
        '/api/answers/like.php'    => __DIR__ . '/api/answers/like.php',

        // Notifications
        '/api/notifications'          => __DIR__ . '/api/notifications/index.php',
        '/api/notifications/read'     => __DIR__ . '/api/notifications/index.php',
        '/api/notifications/index'    => __DIR__ . '/api/notifications/index.php',
        '/api/notifications/index.php'=> __DIR__ . '/api/notifications/index.php',

        // Admin
        '/api/admin/users'         => __DIR__ . '/api/admin/users.php',
        '/api/admin/users/block'   => __DIR__ . '/api/admin/users.php',
        '/api/admin/categories'    => __DIR__ . '/api/admin/categories.php',
        '/api/admin/reports'       => __DIR__ . '/api/admin/reports.php',
    ],
    'PUT' => [
        '/api/user/profile'        => __DIR__ . '/api/user/profile.php',
        '/api/user/profile.php'    => __DIR__ . '/api/user/profile.php',
    ],
    'DELETE' => [
        '/api/admin/categories'    => __DIR__ . '/api/admin/categories.php',
        '/api/admin/questions'     => __DIR__ . '/api/admin/questions.php',
    ],
];

// Match exact route
if (isset($routes[$method][$path])) {
    require $routes[$method][$path];
    exit;
}

// Intercept legacy HTML paths (/auth/login.php, /admin/index.php, /dashboard/index.php, etc.)
// Return JSON indicating the client should use the frontend at port 3000
$legacyPrefixes = ['/auth', '/admin', '/dashboard', '/user', '/questions', '/answers', '/replies', '/reports'];
$isLegacy = false;
foreach ($legacyPrefixes as $prefix) {
    if (str_starts_with($path, $prefix) && !str_starts_with($path, '/api/')) {
        $isLegacy = true;
        break;
    }
}

if ($isLegacy || str_ends_with($path, '.php') || str_ends_with($path, '.html') || str_ends_with($path, '.ejs')) {
    http_response_code(200);
    $suggestedRoute = '/';
    if (str_contains($path, 'login')) {
        $suggestedRoute = '/login';
    } elseif (str_contains($path, 'register')) {
        $suggestedRoute = '/signup';
    } elseif (str_contains($path, 'admin')) {
        $suggestedRoute = '/admin';
    } elseif (str_contains($path, 'dashboard')) {
        $suggestedRoute = '/dashboard';
    }

    echo json_encode([
        'status'               => 'json_api_mode',
        'message'              => 'The backend server on port 8000 is a dedicated JSON REST API. HTML/EJS pages have been replaced by the Next.js frontend.',
        'requested_endpoint'   => $path,
        'frontend_url'         => 'http://localhost:3000' . $suggestedRoute,
        'available_api_routes' => 'Send GET request to http://localhost:8000/ to view all active REST endpoints.',
    ], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
    exit;
}

// 404 for any other undefined endpoint — STRICTLY JSON
http_response_code(404);
echo json_encode([
    'error'   => true,
    'message' => "Endpoint not found: $method $path",
    'api'     => 'Pathwise JSON REST API',
    'status'  => 404,
], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
exit;