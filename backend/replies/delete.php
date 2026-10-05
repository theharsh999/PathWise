<?php

require_once "../includes/auth_check.php";
require_once "../config/database.php";

/* Validate reply ID */

if (
    !isset($_GET['id']) ||
    !filter_var($_GET['id'], FILTER_VALIDATE_INT)
) {
    die("Invalid reply ID.");
}

$reply_id = (int) $_GET['id'];

$user_id = $_SESSION['user_id'];

/*
    Get reply and question ID
*/

$sql = "SELECT
            r.id,
            r.answer_id,
            a.question_id
        FROM replies r
        INNER JOIN answers a
            ON r.answer_id = a.id
        WHERE r.id = ?
        AND r.user_id = ?";

$stmt = $pdo->prepare($sql);

$stmt->execute([
    $reply_id,
    $user_id
]);

$reply = $stmt->fetch();

if (!$reply) {
    die("Reply not found or you are not allowed to delete it.");
}

/*
    Delete reply
*/

$sql = "DELETE FROM replies
        WHERE id = ?
        AND user_id = ?";

$stmt = $pdo->prepare($sql);

$stmt->execute([
    $reply_id,
    $user_id
]);

/*
    Return to question
*/

header(
    "Location: ../questions/view.php?id="
    . $reply['question_id']
);

exit;

?>
 