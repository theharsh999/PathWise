<?php

require_once "../includes/auth_check.php";
require_once "../config/database.php";
require_once "../includes/notification_helper.php";

/* Validate answer ID */

if (
    !isset($_GET['id']) ||
    !filter_var($_GET['id'], FILTER_VALIDATE_INT)
) {
    die("Invalid answer ID.");
}

$answer_id = (int) $_GET['id'];

$user_id = $_SESSION['user_id'];


/*Get answer details with question and answer owners.*/

$sql = "SELECT
            a.id,
            a.question_id,
            a.user_id AS answer_owner_id,
            a.is_best,
            q.user_id AS question_owner_id

        FROM answers a

        INNER JOIN questions q
            ON a.question_id = q.id

        WHERE a.id = ?";

$stmt = $pdo->prepare($sql);
$stmt->execute([$answer_id]);

$answer = $stmt->fetch();

if (!$answer) {
    die("Advice not found.");
}


/* Only question owner can mark an answer as best.*/

if ($answer['question_owner_id'] != $user_id) {
    die("Only the question owner can mark the best advice.");
}

$question_id = $answer['question_id'];


/*Remove previous best advice*/

$sql = "UPDATE answers
        SET is_best = 0
        WHERE question_id = ?";

$stmt = $pdo->prepare($sql);
$stmt->execute([$question_id]);


/*Mark selected advice as best*/

$sql = "UPDATE answers
        SET is_best = 1
        WHERE id = ?
        AND question_id = ?";

$stmt = $pdo->prepare($sql);

$stmt->execute([
    $answer_id,
    $question_id
]);


/*Notify the person who gave
    the selected advice.

    Don't notify if the question owner
    is also the advice author.*/

if ($answer['answer_owner_id'] != $user_id) {

    createNotification(
        $pdo,
        $answer['answer_owner_id'],
        "Your advice was marked as Best Advice."
    );

}


/*Return to question*/

header(
    "Location: ../questions/view.php?id="
    . $question_id
);

exit;

?>