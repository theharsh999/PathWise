<?php

require_once "../includes/auth_check.php";
require_once "../config/database.php";

/* Validate answer ID */

if (
    !isset($_GET['answer_id']) ||
    !filter_var($_GET['answer_id'], FILTER_VALIDATE_INT)
) {
    die("Invalid answer ID.");
}

$answer_id = (int) $_GET['answer_id'];

/*
    Get answer + question information
*/

$sql = "SELECT
            a.id,
            a.answer,
            a.question_id,
            q.title
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

?>

<!DOCTYPE html>
<html lang="en">

<head>

    <meta charset="UTF-8">

    <title>Reply to Advice - Free Advice</title>

</head>

<body>

    <h1>Reply to Advice</h1>

    <h2>
        <?php echo htmlspecialchars($answer['title']); ?>
    </h2>

    <hr>

    <h3>Advice</h3>

    <p>
        <?php
        echo nl2br(
            htmlspecialchars($answer['answer'])
        );
        ?>
    </p>

    <hr>

    <h3>Your Reply</h3>

    <form action="create.php" method="POST">

        <input
            type="hidden"
            name="answer_id"
            value="<?php echo $answer['id']; ?>"
        >

        <textarea
            name="reply"
            rows="6"
            cols="60"
            required
            placeholder="Write your reply..."
        ></textarea>

        <br><br>

        <button type="submit">
            Post Reply
        </button>

    </form>

    <br>

    <a href="../questions/view.php?id=<?php echo $answer['question_id']; ?>">
        Back to Question
    </a>

</body>

</html>