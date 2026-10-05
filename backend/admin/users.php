<?php

require_once "../includes/admin_check.php";
require_once "../config/database.php";

/*Get all users*/

$sql = "SELECT
            id,
            name,
            email,
            role,
            status,
            created_at
        FROM users
        ORDER BY created_at DESC";

$stmt = $pdo->prepare($sql);
$stmt->execute();

$users = $stmt->fetchAll();

?>

<!DOCTYPE html>
<html lang="en">

<head>

    <meta charset="UTF-8">

    <title>Manage Users - Free Advice</title>

</head>

<body>

    <h1>Manage Users</h1>

    <hr>

    <?php if (count($users) === 0): ?>

        <p>No users found.</p>

    <?php else: ?>

        <?php foreach ($users as $user): ?>

            <div>

                <h3>
                    User #<?php echo $user['id']; ?>
                </h3>


                <p>

                    <strong>Name:</strong>

                    <?php
                    echo htmlspecialchars(
                        $user['name']
                    );
                    ?>

                </p>


                <p>

                    <strong>Email:</strong>

                    <?php
                    echo htmlspecialchars(
                        $user['email']
                    );
                    ?>

                </p>


                <p>

                    <strong>Role:</strong>

                    <?php
                    echo htmlspecialchars(
                        $user['role']
                    );
                    ?>

                </p>


                <p>

                    <strong>Status:</strong>

                    <?php
                    echo htmlspecialchars(
                        $user['status']
                    );
                    ?>

                </p>


                <p>

                    <strong>Joined:</strong>

                    <?php
                    echo htmlspecialchars(
                        $user['created_at']
                    );
                    ?>

                </p>


             <!-- Block / Unblock Section -->

                <?php if ($user['id'] != $_SESSION['user_id']): ?>

                    <form
                        action="block_user.php"
                        method="POST"
                    >

                        <input
                            type="hidden"
                            name="user_id"
                            value="<?php echo $user['id']; ?>"
                        >


                        <?php if ($user['status'] === 'active'): ?>

                            <input
                                type="hidden"
                                name="action"
                                value="block"
                            >

                            <button
                                type="submit"
                                onclick="return confirm('Are you sure you want to block this user?');"
                            >
                                Block User
                            </button>

                        <?php else: ?>

                            <input
                                type="hidden"
                                name="action"
                                value="unblock"
                            >

                            <button
                                type="submit"
                                onclick="return confirm('Are you sure you want to unblock this user?');"
                            >
                                Unblock User
                            </button>

                        <?php endif; ?>

                    </form>

                <?php else: ?>

                    <p>
                        <strong>Current Admin Account</strong>
                    </p>

                <?php endif; ?>


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