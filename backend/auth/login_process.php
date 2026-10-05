<?php

session_start();

require_once "../config/database.php";


if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    header("Location: login.php");
    exit;
}


$email = trim($_POST["email"]);
$password = $_POST["password"];


/* Validate input */

if (empty($email) || empty($password)) {
    header("Location: login.php?error=Please fill in all fields.");
    exit;
}


/* Find user */

$sql = "SELECT id, name, email, password, role, status
        FROM users
        WHERE email = ?";

$stmt = $pdo->prepare($sql);
$stmt->execute([$email]);

$user = $stmt->fetch();


/* Check user */

if (!$user) {
    header("Location: login.php?error=Invalid email or password.");
    exit;
}


/* Check account status */

if ($user['status'] === 'blocked') {
    header("Location: login.php?error=Your account has been blocked.");
    exit;
}


/* Verify password */

if (!password_verify($password, $user['password'])) {
    header("Location: login.php?error=Invalid email or password.");
    exit;
}


/* Create session */

session_regenerate_id(true);

$_SESSION['user_id'] = $user['id'];
$_SESSION['user_name'] = $user['name'];
$_SESSION['user_email'] = $user['email'];
$_SESSION['user_role'] = $user['role'];


/* Redirect based on role */

if ($user['role'] === 'admin') {

    header("Location: ../admin/index.php");

} else {

    header("Location: ../dashboard/index.php");

}

exit;

?>