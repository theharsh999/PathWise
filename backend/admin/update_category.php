<?php

require_once "../includes/admin_check.php";
require_once "../config/database.php";

/* Only allow POST requests */

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    header("Location: categories.php");
    exit;
}

$category_id = $_POST['category_id'] ?? '';
$name = trim($_POST['name'] ?? '');
$description = trim($_POST['description'] ?? '');

/* Validate category ID */

if (!filter_var($category_id, FILTER_VALIDATE_INT)) {
    die("Invalid category ID.");
}

$category_id = (int) $category_id;

/* Validate name */

if (empty($name)) {
    die("Category name is required.");
}

/*Check whether category exists */

$sql = "SELECT id
        FROM categories
        WHERE id = ?";

$stmt = $pdo->prepare($sql);
$stmt->execute([$category_id]);

if (!$stmt->fetch()) {
    die("Category not found.");
}

/*Check duplicate category name
    Exclude current category*/

$sql = "SELECT id
        FROM categories
        WHERE name = ?
        AND id != ?";

$stmt = $pdo->prepare($sql);
$stmt->execute([
    $name,
    $category_id
]);

if ($stmt->fetch()) {
    die("Another category with this name already exists.");
}

/*Update category*/

$sql = "UPDATE categories
        SET name = ?,
            description = ?
        WHERE id = ?";

$stmt = $pdo->prepare($sql);

$stmt->execute([
    $name,
    $description,
    $category_id
]);

/*Return to categories page*/

header("Location: categories.php");

exit;

?>