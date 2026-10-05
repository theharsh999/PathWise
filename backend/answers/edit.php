<?php

require_once "../includes/auth_check.php";
require_once "../config/database.php";


/* Check answer ID */

if (!isset($_GET['id']) || !filter_var($_GET['id'], FILTER_VALIDATE_INT)) {
    die("Invalid answer ID.");
}

$answer_id = (int) $_GET['id'];

$user_id = $_SESSION['user_id'];


/* Get answer */

$sql = "SELECT
            id,
            question_id,
            user_id,
            answer
        FROM answers
        WHERE id = ?";

$stmt = $pdo->prepare($sql);
$stmt->execute([$answer_id]);

$answer = $stmt->fetch();


/* Answer doesn't exist */

if (!$answer) {
    die("Advice not found.");
}


/* Ownership check */

if ($answer['user_id'] != $user_id) {
    die("You are not allowed to edit this advice.");
}

?>

<!DOCTYPE html>
<html lang="en">

<head>

    <meta charset="UTF-8">

    <title>Edit Advice - Free Advice</title>

</head>

<body>

    <h1>Edit Advice</h1>


    <form action="update.php" method="POST">

        <input
            type="hidden"
            name="answer_id"
            value="<?php echo $answer['id']; ?>"
        >


        <label>Your Advice:</label>

        <br>

        <textarea
            name="answer"
            rows="8"
            cols="60"
            required
        ><?php echo htmlspecialchars($answer['answer']); ?></textarea>

        <br><br>


        <button type="submit">
            Update Advice
        </button>

    </form>


    <br>

    <a href="../questions/view.php?id=<?php echo $answer['question_id']; ?>">
        Cancel
    </a>

</body>

</html>