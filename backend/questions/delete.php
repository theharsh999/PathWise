<?php

require_once "../includes/auth_check.php";
require_once "../config/database.php";


/* Validate ID */

if (!isset($_GET['id']) || !filter_var($_GET['id'], FILTER_VALIDATE_INT)) {
    die("Invalid question ID.");
}

$question_id = (int) $_GET['id'];

$user_id = $_SESSION['user_id'];


/* Delete only if user owns the question */

$sql = "DELETE FROM questions
        WHERE id = ?
        AND user_id = ?";

$stmt = $pdo->prepare($sql);

$stmt->execute([
    $question_id,
    $user_id
]);


/* Check whether deletion happened */

if ($stmt->rowCount() === 0) {
    die("Question not found or you are not allowed to delete it.");
}


/* Redirect */

header("Location: ../dashboard/index.php");
exit;

?>