<?php

require_once "../includes/auth_check.php";
require_once "../config/database.php";

$user_id = $_SESSION['user_id'];

$sql = "SELECT id, name, email, bio, role, status, created_at
        FROM users
        WHERE id = ?";

$stmt = $pdo->prepare($sql);
$stmt->execute([$user_id]);

$user = $stmt->fetch();

?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <title>My Profile - Free Advice</title>
</head>

<body>

    <h1>My Profile</h1>

    <p>
        <strong>Name:</strong>
        <?php echo htmlspecialchars($user['name']); ?>
    </p>

    <p>
        <strong>Email:</strong>
        <?php echo htmlspecialchars($user['email']); ?>
    </p>

    <p>
        <strong>Bio:</strong>
        <?php echo htmlspecialchars($user['bio'] ?? 'No bio added.'); ?>
    </p>

    <p>
        <strong>Role:</strong>
        <?php echo htmlspecialchars($user['role']); ?>
    </p>

    <p>
        <strong>Account Status:</strong>
        <?php echo htmlspecialchars($user['status']); ?>
    </p>

    <p>
        <strong>Joined:</strong>
        <?php echo htmlspecialchars($user['created_at']); ?>
    </p>

    <a href="../dashboard/index.php">Back to Dashboard</a>

</body>

</html>