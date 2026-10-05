<?php

// Check if MySQL credentials are provided
$host     = getenv('DB_HOST')     ?: (getenv('MYSQLHOST')     ?: null);
$port     = getenv('DB_PORT')     ?: (getenv('MYSQLPORT')     ?: '3306');
$dbname   = getenv('DB_NAME')     ?: (getenv('MYSQLDATABASE') ?: 'free_advice');
$username = getenv('DB_USER')     ?: (getenv('MYSQLUSER')     ?: 'root');
$password = getenv('DB_PASS') !== false ? getenv('DB_PASS') : (getenv('MYSQLPASSWORD') !== false ? getenv('MYSQLPASSWORD') : 'root123');

// If a full connection URL is provided (e.g. mysql://user:pass@host:port/db)
$dbUrl = getenv('DATABASE_URL') ?: getenv('MYSQL_URL');
if (!empty($dbUrl)) {
    $parsed = parse_url($dbUrl);
    if (!empty($parsed['host'])) $host = $parsed['host'];
    if (!empty($parsed['port'])) $port = (string)$parsed['port'];
    if (!empty($parsed['user'])) $username = $parsed['user'];
    if (!empty($parsed['pass'])) $password = $parsed['pass'];
    if (!empty($parsed['path'])) $dbname = ltrim($parsed['path'], '/');
}

$pdo = null;

// 1. If explicit MySQL host is configured, try connecting to MySQL
if (!empty($host) && $host !== 'localhost' && $host !== '127.0.0.1') {
    try {
        $dsn = "mysql:host=$host;port=$port;dbname=$dbname;charset=utf8mb4";
        $pdo = new PDO($dsn, $username, $password, [
            PDO::ATTR_TIMEOUT => 3,
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        ]);
    } catch (Throwable $e) {
        $pdo = null;
    }
}

// 2. If MySQL is not configured or failed, seamlessly fall back to embedded SQLite database!
// This allows the full platform (auth, questions, admin, categories) to work without external DB.
if (!$pdo) {
    try {
        $sqlitePath = sys_get_temp_dir() . '/pathwise.sqlite';
        $isNewDb = !file_exists($sqlitePath) || filesize($sqlitePath) === 0;

        $pdo = new PDO("sqlite:$sqlitePath");
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);

        // Ensure database tables exist
        $pdo->exec("
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                email TEXT NOT NULL UNIQUE,
                password TEXT NOT NULL,
                bio TEXT NULL,
                role TEXT NOT NULL DEFAULT 'user',
                status TEXT NOT NULL DEFAULT 'active',
                auth_token TEXT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS categories (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL UNIQUE,
                description TEXT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS questions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                category_id INTEGER NOT NULL,
                title TEXT NOT NULL,
                description TEXT NOT NULL,
                is_anonymous INTEGER NOT NULL DEFAULT 0,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS answers (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                question_id INTEGER NOT NULL,
                user_id INTEGER NOT NULL,
                answer TEXT NOT NULL,
                is_best INTEGER NOT NULL DEFAULT 0,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS replies (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                answer_id INTEGER NOT NULL,
                user_id INTEGER NOT NULL,
                reply TEXT NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS likes (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                answer_id INTEGER NOT NULL,
                user_id INTEGER NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                UNIQUE (answer_id, user_id)
            );

            CREATE TABLE IF NOT EXISTS notifications (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                message TEXT NOT NULL,
                is_read INTEGER NOT NULL DEFAULT 0,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS reports (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                question_id INTEGER NULL,
                answer_id INTEGER NULL,
                reason TEXT NOT NULL,
                status TEXT NOT NULL DEFAULT 'pending',
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            );
        ");

        // Seed demo accounts and categories if newly created or empty
        $chkUsers = $pdo->query("SELECT COUNT(*) AS c FROM users")->fetch();
        if ((int)$chkUsers['c'] === 0) {
            $passHash = password_hash('password123', PASSWORD_BCRYPT);

            $stmt = $pdo->prepare("INSERT OR IGNORE INTO users (name, email, password, bio, role, status) VALUES (?, ?, ?, ?, ?, ?)");
            $stmt->execute(['Administrator', 'admin@example.com', $passHash, 'Platform Administrator', 'admin', 'active']);
            $stmt->execute(['Demo User', 'user@example.com', $passHash, 'Curious learner and community member', 'user', 'active']);

            $stmt = $pdo->prepare("INSERT OR IGNORE INTO categories (name, description) VALUES (?, ?)");
            $stmt->execute(['Career & Work', 'Advice on jobs, interviews, and professional growth.']);
            $stmt->execute(['Technology & Programming', 'Questions and tips about software, coding, and tech.']);
            $stmt->execute(['Health & Wellness', 'Lifestyle, fitness, and mental wellness guidance.']);
            $stmt->execute(['Finance & Money', 'Personal finance, investing, and budgeting advice.']);
            $stmt->execute(['Life & Relationships', 'Everyday life situations, friendships, and relationships.']);

            // Insert sample question and answer
            $stmt = $pdo->prepare("INSERT INTO questions (user_id, category_id, title, description, is_anonymous) VALUES (?, ?, ?, ?, ?)");
            $stmt->execute([2, 1, 'How can I transition into Senior Software Engineering?', 'I have 3 years of frontend experience with React and Next.js. What should I focus on next to step up into senior engineering leadership?', 0]);
            $qId = $pdo->lastInsertId();

            $stmt = $pdo->prepare("INSERT INTO answers (question_id, user_id, answer, is_best) VALUES (?, ?, ?, ?)");
            $stmt->execute([$qId, 1, 'Focus on architecture design, cross-team collaboration, mentoring junior developers, and owning end-to-end system reliability beyond just writing code.', 1]);
        }

    } catch (Throwable $e) {
        http_response_code(500);
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode([
            'error' => true,
            'message' => 'Embedded database initialization failed: ' . $e->getMessage()
        ], JSON_UNESCAPED_UNICODE);
        exit;
    }
}