<?php

require_once "../includes/auth_check.php";
require_once "../config/database.php";

$user_id = $_SESSION['user_id'];

/* Mark all notifications as read */
$sql = "UPDATE notifications
        SET is_read = 1
        WHERE user_id = ?";

$stmt = $pdo->prepare($sql);
$stmt->execute([$user_id]);

/* Fetch notifications */
$sql = "SELECT
            id,
            message,
            is_read,
            created_at
        FROM notifications
        WHERE user_id = ?
        ORDER BY created_at DESC";

$stmt = $pdo->prepare($sql);
$stmt->execute([$user_id]);

$notifications = $stmt->fetchAll();

?>

<!DOCTYPE html>
<html lang="en">

<head>

<meta charset="UTF-8">

<title>Notifications - Free Advice</title>

</head>

<body>

<h1>Notifications</h1>

<hr>

<?php if (count($notifications) === 0): ?>

    <p>You have no notifications.</p>

<?php else: ?>

    <?php foreach ($notifications as $notification): ?>

        <div>

            <p>
                <?php echo htmlspecialchars($notification['message']); ?>
            </p>

            <p>
                <small>
                    <?php echo htmlspecialchars($notification['created_at']); ?>
                </small>
            </p>

            <hr>

        </div>

    <?php endforeach; ?>

<?php endif; ?>

<br>

<a href="../dashboard/index.php">
    Back to Dashboard
</a>

</body>

</html>