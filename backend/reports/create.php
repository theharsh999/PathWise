<?php

require_once "../includes/auth_check.php";
require_once "../config/database.php";

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    header("Location: ../questions/search.php");
    exit;
}

$user_id = $_SESSION['user_id'];

$question_id = $_POST['question_id'] ?? null;
$answer_id = $_POST['answer_id'] ?? null;
$reason = trim($_POST['reason'] ?? '');

/*
    Validate reason
*/

if (empty($reason)) {
    die("Report reason cannot be empty.");
}

/*
    Make sure at least one target exists
*/

if (
    empty($question_id) &&
    empty($answer_id)
) {
    die("Invalid report.");
}


/*
    Report a question
*/

if (!empty($question_id)) {

    if (!filter_var($question_id, FILTER_VALIDATE_INT)) {
        die("Invalid question ID.");
    }

    $question_id = (int) $question_id;

    /* Check question exists */

    $sql = "SELECT id
            FROM questions
            WHERE id = ?";

    $stmt = $pdo->prepare($sql);
    $stmt->execute([$question_id]);

    if (!$stmt->fetch()) {
        die("Question not found.");
    }

    /* Insert report */

    $sql = "INSERT INTO reports
            (user_id, question_id, reason)
            VALUES (?, ?, ?)";

    $stmt = $pdo->prepare($sql);

    $stmt->execute([
        $user_id,
        $question_id,
        $reason
    ]);

    header(
        "Location: ../questions/view.php?id=" . $question_id
    );

    exit;
}


/*
    Report an answer
*/

if (!empty($answer_id)) {

    if (!filter_var($answer_id, FILTER_VALIDATE_INT)) {
        die("Invalid answer ID.");
    }

    $answer_id = (int) $answer_id;

    /* Get answer and question */

    $sql = "SELECT id, question_id
            FROM answers
            WHERE id = ?";

    $stmt = $pdo->prepare($sql);
    $stmt->execute([$answer_id]);

    $answer = $stmt->fetch();

    if (!$answer) {
        die("Advice not found.");
    }

    /* Insert report */

    $sql = "INSERT INTO reports
            (user_id, answer_id, reason)
            VALUES (?, ?, ?)";

    $stmt = $pdo->prepare($sql);

    $stmt->execute([
        $user_id,
        $answer_id,
        $reason
    ]);

    header(
        "Location: ../questions/view.php?id="
        . $answer['question_id']
    );

    exit;
}

?>