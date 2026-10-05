<?php

require_once "../includes/auth_check.php";
require_once "../config/database.php";


/* Validate answer ID */

if (!isset($_GET['id']) || !filter_var($_GET['id'], FILTER_VALIDATE_INT)) {
    die("Invalid answer ID.");
}

$answer_id = (int) $_GET['id'];

$user_id = $_SESSION['user_id'];


/* Get question ID and verify ownership */

$sql = "SELECT question_id
        FROM answers
        WHERE id = ?
        AND user_id = ?";

$stmt = $pdo->prepare($sql);

$stmt->execute([
    $answer_id,
    $user_id
]);

$answer = $stmt->fetch();


if (!$answer) {
    die("Advice not found or you are not allowed to delete it.");
}


/* Delete answer */

$sql = "DELETE FROM answers
        WHERE id = ?
        AND user_id = ?";

$stmt = $pdo->prepare($sql);

$stmt->execute([
    $answer_id,
    $user_id
]);


/* Return to question */

header(
    "Location: ../questions/view.php?id="
    . $answer['question_id']
);

exit;

?>