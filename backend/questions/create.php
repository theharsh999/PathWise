<?php

require_once "../includes/auth_check.php";
require_once "../config/database.php";


if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    header("Location: ask.php");
    exit;
}


/* Get logged-in user */

$user_id = $_SESSION['user_id'];


/* Get form data */

$title = trim($_POST['title'] ?? '');
$category_id = $_POST['category_id'] ?? '';
$description = trim($_POST['description'] ?? '');

$is_anonymous = isset($_POST['is_anonymous']) ? 1 : 0;


/* Validate title */

if (empty($title)) {
    die("Question title is required.");
}


/* Validate category */

if (!filter_var($category_id, FILTER_VALIDATE_INT)) {
    die("Invalid category.");
}


/* Validate description */

if (empty($description)) {
    die("Question description is required.");
}


/* Verify category exists */

$sql = "SELECT id
        FROM categories
        WHERE id = ?";

$stmt = $pdo->prepare($sql);
$stmt->execute([$category_id]);

if (!$stmt->fetch()) {
    die("Selected category does not exist.");
}


/* Insert question */

$sql = "INSERT INTO questions
        (user_id, category_id, title, description, is_anonymous)
        VALUES (?, ?, ?, ?, ?)";

$stmt = $pdo->prepare($sql);

$stmt->execute([
    $user_id,
    $category_id,
    $title,
    $description,
    $is_anonymous
]);


/* Get newly created question ID */

$question_id = $pdo->lastInsertId();


/* Redirect to question */

header("Location: view.php?id=" . $question_id);
exit;

?>