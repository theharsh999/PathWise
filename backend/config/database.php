<?php

// Read from environment variables (Railway, Render, Clever Cloud, etc.) or fallback to local defaults
$host     = getenv('DB_HOST')     ?: (getenv('MYSQLHOST')     ?: 'localhost');
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

try {
    $dsn = "mysql:host=$host;port=$port;dbname=$dbname;charset=utf8mb4";
    $pdo = new PDO($dsn, $username, $password);

    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);

} catch (PDOException $e) {
    http_response_code(500);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode([
        'error' => true,
        'message' => 'Database connection failed: ' . $e->getMessage()
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

?>