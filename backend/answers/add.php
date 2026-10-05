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


/* Check question exists */

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

    <title>
        Give Advice - Free Advice
    </title>

</head>

<body>

    <h1>Give Advice</h1>


    <h2>
        <?php echo htmlspecialchars($question['title']); ?>
    </h2>


    <form action="create.php" method="POST">

        <input
            type="hidden"
            name="question_id"
            value="<?php echo $question['id']; ?>"
        >


        <label>
            Your Advice:
        </label>

        <br>

        <textarea
            name="answer"
            rows="8"
            cols="60"
            required
            placeholder="Write helpful advice..."
        ></textarea>

        <br><br>


        <button type="submit">
            Give Advice
        </button>

    </form>


    <br>

    <a href="../questions/view.php?id=<?php echo $question_id; ?>">
        Back to Question
    </a>

</body>

</html>