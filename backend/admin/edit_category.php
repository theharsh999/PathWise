<?php

require_once "../includes/admin_check.php";
require_once "../config/database.php";

/* Validate category ID */

if (
    !isset($_GET['id']) ||
    !filter_var($_GET['id'], FILTER_VALIDATE_INT)
) {
    die("Invalid category ID.");
}

$category_id = (int) $_GET['id'];

/*Get category */

$sql = "SELECT id, name, description
        FROM categories
        WHERE id = ?";

$stmt = $pdo->prepare($sql);
$stmt->execute([$category_id]);

$category = $stmt->fetch();

if (!$category) {
    die("Category not found.");
}

?>

<!DOCTYPE html>
<html lang="en">

<head>

    <meta charset="UTF-8">

    <title>Edit Category - Free Advice</title>

</head>

<body>

    <h1>Edit Category</h1>

    <hr>

    <form action="update_category.php" method="POST">

        <input
            type="hidden"
            name="category_id"
            value="<?php echo $category['id']; ?>"
        >

        <label>
            Category Name:
        </label>

        <br>

        <input
            type="text"
            name="name"
            value="<?php echo htmlspecialchars($category['name']); ?>"
            required
        >

        <br><br>

        <label>
            Description:
        </label>

        <br>

        <textarea
            name="description"
            rows="5"
            cols="50"
        ><?php echo htmlspecialchars($category['description'] ?? ''); ?></textarea>

        <br><br>

        <button type="submit">
            Update Category
        </button>

    </form>

    <br>

    <a href="categories.php">
        Cancel
    </a>

</body>

</html>