<?php

require_once "../includes/auth_check.php";
require_once "../config/database.php";


/* Validate question ID */

if (!isset($_GET['id']) || !filter_var($_GET['id'], FILTER_VALIDATE_INT)) {
    die("Invalid question ID.");
}

$question_id = (int) $_GET['id'];

$user_id = $_SESSION['user_id'];


/* Get question */

$sql = "SELECT id, user_id, category_id, title, description, is_anonymous
        FROM questions
        WHERE id = ?";

$stmt = $pdo->prepare($sql);
$stmt->execute([$question_id]);

$question = $stmt->fetch();


if (!$question) {
    die("Question not found.");
}


/* Ownership check */

if ($question['user_id'] != $user_id) {
    die("You are not allowed to edit this question.");
}


/* Get categories */

$sql = "SELECT id, name
        FROM categories
        ORDER BY name ASC";

$stmt = $pdo->query($sql);

$categories = $stmt->fetchAll();

?>

<!DOCTYPE html>
<html lang="en">

<head>

    <meta charset="UTF-8">

    <title>
        Edit Question - Free Advice
    </title>

</head>

<body>

    <h1>Edit Question</h1>


    <form action="update.php" method="POST">

        <!-- Hidden question ID -->

        <input
            type="hidden"
            name="question_id"
            value="<?php echo $question['id']; ?>"
        >


        <label>Question Title:</label>

        <br>

        <input
            type="text"
            name="title"
            value="<?php echo htmlspecialchars($question['title']); ?>"
            maxlength="255"
            required
        >

        <br><br>


        <label>Category:</label>

        <br>

        <select name="category_id" required>

            <?php foreach ($categories as $category): ?>

                <option
                    value="<?php echo $category['id']; ?>"
                    <?php
                    if ($category['id'] == $question['category_id']) {
                        echo "selected";
                    }
                    ?>
                >

                    <?php echo htmlspecialchars($category['name']); ?>

                </option>

            <?php endforeach; ?>

        </select>

        <br><br>


        <label>Description:</label>

        <br>

        <textarea
            name="description"
            rows="8"
            cols="60"
            required
        ><?php echo htmlspecialchars($question['description']); ?></textarea>

        <br><br>


        <label>

            <input
                type="checkbox"
                name="is_anonymous"
                value="1"
                <?php
                if ($question['is_anonymous']) {
                    echo "checked";
                }
                ?>
            >

            Post anonymously

        </label>

        <br><br>


        <button type="submit">
            Update Question
        </button>

    </form>


    <br>

    <a href="view.php?id=<?php echo $question_id; ?>">
        Cancel
    </a>

</body>

</html>