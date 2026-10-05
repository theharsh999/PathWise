<?php

require_once "../includes/auth_check.php";
require_once "../config/database.php";
require_once "../includes/notification_helper.php";

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    header("Location: ../questions/search.php");
    exit;
}

$user_id = $_SESSION['user_id'];

$answer_id = $_POST['answer_id'] ?? '';
$reply = trim($_POST['reply'] ?? '');

/* Validate answer ID */

if (!filter_var($answer_id, FILTER_VALIDATE_INT)) {
    die("Invalid answer ID.");
}

$answer_id = (int) $answer_id;

/* Validate reply */

if (empty($reply)) {
    die("Reply cannot be empty.");
}

/*
    Get answer owner and question ID
*/

$sql = "SELECT
            a.id,
            a.question_id,
            a.user_id AS answer_owner_id
        FROM answers a
        WHERE a.id = ?";

$stmt = $pdo->prepare($sql);
$stmt->execute([$answer_id]);

$answer = $stmt->fetch();

if (!$answer) {
    die("Advice not found.");
}

/*
    Insert reply
*/

$sql = "INSERT INTO replies
        (answer_id, user_id, reply)
        VALUES (?, ?, ?)";

$stmt = $pdo->prepare($sql);

$stmt->execute([
    $answer_id,
    $user_id,
    $reply
]);

/*
    Notify the person who gave the advice.

    Don't notify them if they reply to
    their own advice.
*/

if ($answer['answer_owner_id'] != $user_id) {

    createNotification(
        $pdo,
        $answer['answer_owner_id'],
        "Someone replied to your advice."
    );

}

/*
    Return to question
*/

header(
    "Location: ../questions/view.php?id="
    . $answer['question_id']
);

exit;

?>