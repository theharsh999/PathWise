<?php

require_once "../includes/auth_check.php";
require_once "../config/database.php";


/* Only POST requests */

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    header("Location: ../questions/search.php");
    exit;
}


$answer_id = $_POST['answer_id'] ?? '';
$answer = trim($_POST['answer'] ?? '');

$user_id = $_SESSION['user_id'];


/* Validate answer ID */

if (!filter_var($answer_id, FILTER_VALIDATE_INT)) {
    die("Invalid answer ID.");
}


/* Validate answer */

if (empty($answer)) {
    die("Advice cannot be empty.");
}


/* Get answer and verify ownership */

$sql = "SELECT question_id
        FROM answers
        WHERE id = ?
        AND user_id = ?";

$stmt = $pdo->prepare($sql);

$stmt->execute([
    $answer_id,
    $user_id
]);

$existing_answer = $stmt->fetch();


if (!$existing_answer) {
    die("Advice not found or you are not allowed to update it.");
}


/* Update answer */

$sql = "UPDATE answers
        SET answer = ?
        WHERE id = ?
        AND user_id = ?";

$stmt = $pdo->prepare($sql);

$stmt->execute([
    $answer,
    $answer_id,
    $user_id
]);


/* Return to question */

header(
    "Location: ../questions/view.php?id="
    . $existing_answer['question_id']
);

exit;

?>