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
    Get answer and question information
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

    <title>Report Advice - Free Advice</title>

</head>

<body>

    <h1>Report Advice</h1>

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

    <form action="create.php" method="POST">

        <input
            type="hidden"
            name="answer_id"
            value="<?php echo $answer['id']; ?>"
        >

        <label>
            Reason for reporting:
        </label>

        <br>

        <textarea
            name="reason"
            rows="6"
            cols="60"
            required
            placeholder="Explain why you are reporting this advice..."
        ></textarea>

        <br><br>

        <button type="submit">
            Submit Report
        </button>

    </form>

    <br>

    <a href="../questions/view.php?id=<?php echo $answer['question_id']; ?>">
        Cancel
    </a>

</body>

</html>