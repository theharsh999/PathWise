<?php

require_once "../includes/admin_check.php";
require_once "../config/database.php";

/* Only allow POST requests */

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    header("Location: categories.php");
    exit;
}

$name = trim($_POST['name'] ?? '');
$description = trim($_POST['description'] ?? '');

/* Validate category name */

if (empty($name)) {
    die("Category name is required.");
}

/* Check whether category already exists */

$sql = "SELECT id
        FROM categories
        WHERE name = ?";

$stmt = $pdo->prepare($sql);
$stmt->execute([$name]);

if ($stmt->fetch()) {
    die("A category with this name already exists.");
}

/* Insert category */

$sql = "INSERT INTO categories
        (name, description)
        VALUES (?, ?)";

$stmt = $pdo->prepare($sql);

$stmt->execute([
    $name,
    $description
]);

/* Return to categories page */

header("Location: categories.php");

exit;

?>