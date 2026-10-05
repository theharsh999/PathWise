<?php

require_once "../includes/admin_check.php";
require_once "../config/database.php";

/* Get all categories */

$sql = "SELECT
            id,
            name,
            description
        FROM categories
        ORDER BY name ASC";

$stmt = $pdo->prepare($sql);
$stmt->execute();

$categories = $stmt->fetchAll();

?>

<!DOCTYPE html>
<html lang="en">

<head>

    <meta charset="UTF-8">

    <title>Manage Categories - Free Advice</title>

</head>

<body>

    <h1>Manage Categories</h1>

    <hr>


  <!-- Add Category Section -->

    <h2>Add New Category</h2>

    <form
        action="add_category.php"
        method="POST"
    >

        <label>
            Category Name:
        </label>

        <br>

        <input
            type="text"
            name="name"
            required
        >

        <br><br>


        <label>
            Description:
        </label>

        <br>

        <textarea
            name="description"
            rows="4"
            cols="50"
            placeholder="Enter category description..."
        ></textarea>

        <br><br>

        <button type="submit">
            Add Category
        </button>

    </form>


    <hr>


   <!-- Display Categories Section -->

    <h2>Existing Categories</h2>


    <?php if (count($categories) === 0): ?>

        <p>
            No categories found.
        </p>

    <?php else: ?>


        <?php foreach ($categories as $category): ?>

            <div>

                <h3>

                    <?php

                    echo htmlspecialchars(
                        $category['name']
                    );

                    ?>

                </h3>


                <p>

                    <strong>Description:</strong>

                    <?php

                    echo htmlspecialchars(
                        $category['description'] ?? ''
                    );

                    ?>

                </p>


                <p>

                    <a
                        href="edit_category.php?id=<?php echo $category['id']; ?>"
                    >
                        Edit Category
                    </a>

                    &nbsp; | &nbsp;

                    <a
                        href="delete_category.php?id=<?php echo $category['id']; ?>"
                        onclick="return confirm('Are you sure you want to delete this category?');"
                    >
                        Delete Category
                    </a>

                </p>


                <hr>

            </div>

        <?php endforeach; ?>


    <?php endif; ?>


    <br>


    <a href="index.php">
        Back to Admin Dashboard
    </a>


</body>

</html>