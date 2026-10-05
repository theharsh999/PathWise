<?php

require_once "../includes/admin_check.php";

?>

<!DOCTYPE html>
<html lang="en">

<head>

    <meta charset="UTF-8">

    <title>Admin Dashboard - Free Advice</title>

</head>

<body>

    <h1>Free Advice - Admin Dashboard</h1>

    <h2>
        Welcome,
        <?php echo htmlspecialchars($_SESSION['user_name']); ?>
    </h2>

    <p>
        You have administrator access.
    </p>

    <hr>

    <h2>Admin Panel</h2>

    <ul>

        <li>
            <a href="users.php">
                Manage Users
            </a>
        </li>

        <li>
            <a href="questions.php">
                Manage Questions
            </a>
        </li>

        <li>
            <a href="answers.php">
                Manage Answers
            </a>
        </li>

        <li>
            <a href="reports.php">
                Manage Reports
            </a>
        </li>

        <li>
            <a href="categories.php">
                Manage Categories
            </a>
        </li>

    </ul>

    <hr>

    <h3>Quick Navigation</h3>

    <p>
        <a href="../dashboard/index.php">
            User Dashboard
        </a>
    </p>

    <p>
        <a href="../questions/search.php">
            Browse Questions
        </a>
    </p>

    <p>
        <a href="../questions/ask.php">
            Ask a Question
        </a>
    </p>

    <hr>

    <a href="../auth/logout.php">
        Logout
    </a>

</body>

</html>