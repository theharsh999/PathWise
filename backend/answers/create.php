<?php

require_once "../includes/auth_check.php";
require_once "../config/database.php";
require_once "../includes/notification_helper.php";

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    header("Location: ../questions/search.php");
    exit;
}

$user_id = $_SESSION['user_id'];

$question_id = $_POST['question_id'] ?? '';
$answer = trim($_POST['answer'] ?? '');

if (!filter_var($question_id, FILTER_VALIDATE_INT)) {
    die("Invalid question ID.");
}

if (empty($answer)) {
    die("Advice cannot be empty.");
}

/*Get question owner*/

$sql = "SELECT id, user_id
        FROM questions
        WHERE id = ?";

$stmt = $pdo->prepare($sql);
$stmt->execute([$question_id]);

$question = $stmt->fetch();

if (!$question) {
    die("Question not found.");
}

/*Insert advice*/

$sql = "INSERT INTO answers
        (question_id, user_id, answer)
        VALUES (?, ?, ?)";

$stmt = $pdo->prepare($sql);

$stmt->execute([
    $question_id,
    $user_id,
    $answer
]);

/*Create notification for question owner

    Don't notify the user if they somehow
    answer their own question.*/

if ($question['user_id'] != $user_id) {

    createNotification(
        $pdo,
        $question['user_id'],
        "Someone answered your question."
    );

}

/*Return to question */

header(
    "Location: ../questions/view.php?id=" . $question_id
);

exit;

?>