<?php

require_once "../includes/admin_check.php";
require_once "../config/database.php";

/* Only allow POST requests */

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    header("Location: answers.php");
    exit;
}

$answer_id = $_POST['answer_id'] ?? '';

/* Validate answer ID */

if (!filter_var($answer_id, FILTER_VALIDATE_INT)) {
    die("Invalid answer ID.");
}

$answer_id = (int) $answer_id;

/*Check whether answer exists */

$sql = "SELECT id
        FROM answers
        WHERE id = ?";

$stmt = $pdo->prepare($sql);
$stmt->execute([$answer_id]);

if (!$stmt->fetch()) {
    die("Advice not found.");
}

/* Delete answer */

$sql = "DELETE FROM answers
        WHERE id = ?";

$stmt = $pdo->prepare($sql);
$stmt->execute([$answer_id]);

/* Return to admin answers page */

header("Location: answers.php");

exit;

?>