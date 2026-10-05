<?php

require_once "../includes/auth_check.php";
require_once "../config/database.php";


if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    header("Location: ../dashboard/index.php");
    exit;
}


$question_id = $_POST['question_id'] ?? '';
$title = trim($_POST['title'] ?? '');
$category_id = $_POST['category_id'] ?? '';
$description = trim($_POST['description'] ?? '');

$is_anonymous = isset($_POST['is_anonymous']) ? 1 : 0;

$user_id = $_SESSION['user_id'];


/* Validate question ID */

if (!filter_var($question_id, FILTER_VALIDATE_INT)) {
    die("Invalid question ID.");
}


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


/* Verify ownership */

$sql = "SELECT id
        FROM questions
        WHERE id = ?
        AND user_id = ?";

$stmt = $pdo->prepare($sql);

$stmt->execute([
    $question_id,
    $user_id
]);

if (!$stmt->fetch()) {
    die("You are not allowed to update this question.");
}


/* Verify category */

$sql = "SELECT id
        FROM categories
        WHERE id = ?";

$stmt = $pdo->prepare($sql);

$stmt->execute([$category_id]);

if (!$stmt->fetch()) {
    die("Selected category does not exist.");
}


/* Update question */

$sql = "UPDATE questions
        SET title = ?,
            category_id = ?,
            description = ?,
            is_anonymous = ?
        WHERE id = ?
        AND user_id = ?";

$stmt = $pdo->prepare($sql);

$stmt->execute([
    $title,
    $category_id,
    $description,
    $is_anonymous,
    $question_id,
    $user_id
]);


/* Go back to question */

header("Location: view.php?id=" . $question_id);
exit;

?>