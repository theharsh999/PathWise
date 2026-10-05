<?php

require_once "../includes/admin_check.php";
require_once "../config/database.php";

/* Only allow POST requests */

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    header("Location: users.php");
    exit;
}

$user_id = $_POST['user_id'] ?? '';
$action = $_POST['action'] ?? '';

/* Validate user ID */

if (!filter_var($user_id, FILTER_VALIDATE_INT)) {
    die("Invalid user ID.");
}

$user_id = (int) $user_id;

/* Validate action */

if (!in_array($action, ['block', 'unblock'], true)) {
    die("Invalid action.");
}

/* Prevent admin from blocking their own account */

if ($user_id == $_SESSION['user_id']) {
    die("You cannot block your own admin account.");
}

/* Check whether user exists */

$sql = "SELECT id, role, status
        FROM users
        WHERE id = ?";

$stmt = $pdo->prepare($sql);
$stmt->execute([$user_id]);

$user = $stmt->fetch();

if (!$user) {
    die("User not found.");
}

/*Block user */

if ($action === 'block') {

    $sql = "UPDATE users
            SET status = 'blocked'
            WHERE id = ?";

    $stmt = $pdo->prepare($sql);
    $stmt->execute([$user_id]);

}


/* Unblock user */

if ($action === 'unblock') {

    $sql = "UPDATE users
            SET status = 'active'
            WHERE id = ?";

    $stmt = $pdo->prepare($sql);
    $stmt->execute([$user_id]);

}

/* Return to users page */

header("Location: users.php");

exit;

?>