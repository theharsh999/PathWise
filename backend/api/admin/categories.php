<?php

/**
 * GET    /api/admin/categories — list categories
 * POST   /api/admin/categories — create a new category
 * DELETE /api/admin/categories — delete a category
 */

require_once __DIR__ . '/../helpers.php';
require_once __DIR__ . '/../../config/database.php';

cors_headers();

$admin = require_admin($pdo);
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $stmt = $pdo->query(
        "SELECT c.id, c.name, c.description, c.created_at,
                (SELECT COUNT(*) FROM questions q WHERE q.category_id = c.id) AS question_count
         FROM categories c
         ORDER BY c.name ASC"
    );
    json_response(['categories' => $stmt->fetchAll()]);
}

if ($method === 'POST') {
    $input = get_json_input();
    $name = trim($input['name'] ?? '');
    $description = trim($input['description'] ?? '');

    if (empty($name)) {
        json_error('Category name is required.');
    }

    // Check duplicate
    $stmt = $pdo->prepare("SELECT id FROM categories WHERE name = ?");
    $stmt->execute([$name]);
    if ($stmt->fetch()) {
        json_error('A category with this name already exists.');
    }

    $stmt = $pdo->prepare("INSERT INTO categories (name, description) VALUES (?, ?)");
    $stmt->execute([$name, $description]);

    json_response([
        'message' => 'Category created successfully.',
        'category' => [
            'id' => (int) $pdo->lastInsertId(),
            'name' => $name,
            'description' => $description,
            'question_count' => 0,
        ],
    ], 201);
}

if ($method === 'DELETE') {
    $input = get_json_input();
    $id = (int) ($input['id'] ?? ($_GET['id'] ?? 0));

    if ($id <= 0) {
        json_error('Category ID is required.');
    }

    // Check if category has questions
    $stmt = $pdo->prepare("SELECT COUNT(*) AS cnt FROM questions WHERE category_id = ?");
    $stmt->execute([$id]);
    if ($stmt->fetch()['cnt'] > 0) {
        json_error('Cannot delete category with active questions. Reassign or delete questions first.');
    }

    $stmt = $pdo->prepare("DELETE FROM categories WHERE id = ?");
    $stmt->execute([$id]);

    json_response(['message' => 'Category deleted successfully.']);
}

json_error('Method not allowed.', 405);
