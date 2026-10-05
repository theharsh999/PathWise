<?php

require_once "../includes/auth_check.php";
require_once "../config/database.php";


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
    <title>Ask for Advice - Free Advice</title>
</head>

<body>

    <h1>Ask for Advice</h1>

    <form action="create.php" method="POST">

        <label>Question Title:</label><br>

        <input
            type="text"
            name="title"
            maxlength="255"
            required
        >

        <br><br>


        <label>Category:</label><br>

        <select name="category_id" required>

            <option value="">Select Category</option>

            <?php foreach ($categories as $category): ?>

                <option value="<?php echo $category['id']; ?>">
                    <?php echo htmlspecialchars($category['name']); ?>
                </option>

            <?php endforeach; ?>

        </select>

        <br><br>


        <label>Describe your problem:</label><br>

        <textarea
            name="description"
            rows="8"
            cols="60"
            required
        ></textarea>

        <br><br>


        <label>

            <input
                type="checkbox"
                name="is_anonymous"
                value="1"
            >

            Post anonymously

        </label>

        <br><br>


        <button type="submit">
            Ask for Advice
        </button>

    </form>

    <br>

    <a href="../dashboard/index.php">
        Back to Dashboard
    </a>

</body>

</html>