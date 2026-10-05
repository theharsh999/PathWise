<?php

require_once "../includes/auth_check.php";
require_once "../config/database.php";

/* Validate question ID */

if (
    !isset($_GET['question_id']) ||
    !filter_var($_GET['question_id'], FILTER_VALIDATE_INT)
) {
    die("Invalid question ID.");
}

$question_id = (int) $_GET['question_id'];

/*
    Check whether question exists
*/

$sql = "SELECT id, title
        FROM questions
        WHERE id = ?";

$stmt = $pdo->prepare($sql);
$stmt->execute([$question_id]);

$question = $stmt->fetch();

if (!$question) {
    die("Question not found.");
}

?>

<!DOCTYPE html>
<html lang="en">

<head>

    <meta charset="UTF-8">

    <title>Report Question - Free Advice</title>

</head>

<body>

    <h1>Report Question</h1>

    <h2>
        <?php echo htmlspecialchars($question['title']); ?>
    </h2>

    <hr>

    <form action="create.php" method="POST">

        <input
            type="hidden"
            name="question_id"
            value="<?php echo $question['id']; ?>"
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
            placeholder="Explain why you are reporting this question..."
        ></textarea>

        <br><br>

        <button type="submit">
            Submit Report
        </button>

    </form>

    <br>

    <a href="../questions/view.php?id=<?php echo $question['id']; ?>">
        Cancel
    </a>

</body>

</html>