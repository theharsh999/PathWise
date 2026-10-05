<?php

require_once "../includes/admin_check.php";
require_once "../config/database.php";

/* Only allow POST requests */

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    header("Location: questions.php");
    exit;
}

$question_id = $_POST['question_id'] ?? '';

/* Validate question ID */

if (!filter_var($question_id, FILTER_VALIDATE_INT)) {
    die("Invalid question ID.");
}

$question_id = (int) $question_id;

/*Check whether question exists */

$sql = "SELECT id
        FROM questions
        WHERE id = ?";

$stmt = $pdo->prepare($sql);
$stmt->execute([$question_id]);

if (!$stmt->fetch()) {
    die("Question not found.");
}

/*Delete question*/

$sql = "DELETE FROM questions
        WHERE id = ?";

$stmt = $pdo->prepare($sql);
$stmt->execute([$question_id]);

/*Return to admin questions page*/

header("Location: questions.php");

exit;

?>