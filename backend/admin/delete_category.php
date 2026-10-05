<?php

require_once "../includes/admin_check.php";
require_once "../config/database.php";

/* Validate category ID */

if (
    !isset($_GET['id']) ||
    !filter_var($_GET['id'], FILTER_VALIDATE_INT)
) {
    die("Invalid category ID.");
}

$category_id = (int) $_GET['id'];

/*
    Check whether category exists
*/

$sql = "SELECT id, name
        FROM categories
        WHERE id = ?";

$stmt = $pdo->prepare($sql);
$stmt->execute([$category_id]);

$category = $stmt->fetch();

if (!$category) {
    die("Category not found.");
}

/* Check whether category is being used by any questions */

$sql = "SELECT COUNT(*) AS question_count
        FROM questions
        WHERE category_id = ?";

$stmt = $pdo->prepare($sql);
$stmt->execute([$category_id]);

$result = $stmt->fetch();

if ($result['question_count'] > 0) {

    die(
        "Cannot delete this category because "
        . $result['question_count']
        . " question(s) are using it."
    );

}

/*Delete category */

$sql = "DELETE FROM categories
        WHERE id = ?";

$stmt = $pdo->prepare($sql);
$stmt->execute([$category_id]);

/*Return to categories page */

header("Location: categories.php");

exit;

?>