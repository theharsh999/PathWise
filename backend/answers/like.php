<?php

require_once "../includes/auth_check.php";
require_once "../config/database.php";
require_once "../includes/notification_helper.php";

if (
    !isset($_GET['id']) ||
    !filter_var($_GET['id'], FILTER_VALIDATE_INT)
) {
    die("Invalid answer ID.");
}

$answer_id = (int) $_GET['id'];
$user_id = $_SESSION['user_id'];

/* Get answer details */
$sql = "SELECT
            id,
            question_id,
            user_id AS answer_owner_id
        FROM answers
        WHERE id = ?";

$stmt = $pdo->prepare($sql);
$stmt->execute([$answer_id]);

$answer = $stmt->fetch();

if (!$answer) {
    die("Advice not found.");
}

$question_id = $answer['question_id'];
$answer_owner_id = $answer['answer_owner_id'];

/* Check whether current user already liked the advice */
$sql = "SELECT id
        FROM likes
        WHERE answer_id = ?
        AND user_id = ?";

$stmt = $pdo->prepare($sql);
$stmt->execute([
    $answer_id,
    $user_id
]);

$existing_like = $stmt->fetch();

/* Unlike */
if ($existing_like) {

    $sql = "DELETE FROM likes
            WHERE answer_id = ?
            AND user_id = ?";

    $stmt = $pdo->prepare($sql);

    $stmt->execute([
        $answer_id,
        $user_id
    ]);

}
/* Like */
else {

    $sql = "INSERT INTO likes
            (answer_id, user_id)
            VALUES (?, ?)";

    $stmt = $pdo->prepare($sql);

    $stmt->execute([
        $answer_id,
        $user_id
    ]);

    /* Don't notify someone if they liked their own advice */
    if ($answer_owner_id != $user_id) {

        createNotification(
            $pdo,
            $answer_owner_id,
            "Someone found your advice helpful."
        );

    }

}

/* Return to the question */
header(
    "Location: ../questions/view.php?id="
    . $question_id
);

exit;

?>